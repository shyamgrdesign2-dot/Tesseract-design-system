"use client";

import { forwardRef, isValidElement, useId, useRef, useState } from "react";
import { LoadingIndicator } from "@/src/components/atoms/LoadingIndicator/LoadingIndicator";
import { Chip } from "@/src/components/atoms/Chip";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { resolveRadius } from "@/src/hooks/utils";
import styles from "./InputBox.module.scss";

const LOADER_PX = { sm: 16, md: 18, lg: 20 };

/**
 * InputBox — comprehensive, scalable input atom.
 *
 * Interaction states (hover/focus/disabled) are owned by CSS. JS handles
 * controlled value, character filtering, clear, and derived aria attributes.
 *
 * Props:
 *   size        "sm" | "md" | "lg"                                  default "md"
 *   status      "default" | "success" | "error" | "warning"         default "default"
 *   variant     "default" | "seamless" — seamless is borderless and fills its
 *               container, drawing an inset focus/status ring (table-cell use)
 *               default "default"
 *   allow       "any" | "numeric" | "alpha" | "alphanumeric"         live character filter
 *   label       string — field label
 *   helperText  string — hint / status message below the field
 *   leftIcon    ReactNode — icon inside the left of the input
 *   rightIcon   ReactNode — icon inside the right of the input
 *   leftAddon   pinned segment left of the input. Either side accepts the same
 *   rightAddon  shapes, so any add-on can be a prefix OR a suffix:
 *                 • string            → styled text affix ("https://", "+91")
 *                 • { type:"text",   content }                 styled text
 *                 • { type:"select", options, value, onChange, ariaLabel }
 *                                       built-in dropdown (chevron + divider)
 *                 • { type:"button", label, icon, onClick }    in-line CTA add-on
 *                 • ReactNode         → escape hatch, rendered as-is
 *               Built-in add-ons are styled by the component (tokens, height,
 *               divider) so they look identical everywhere — no hand-rolled spans.
 *   height      number|string — override the field height (else the size token).
 *   unit        string — fixed suffix inside the right edge (e.g. "kg")
 *   counter     boolean — +/- stepper buttons (use with type="number")
 *   clearable   boolean — shows an × to clear the field when it has a value
 *   loading     boolean — shows the LoadingIndicator on the trailing edge
 *   showCount   boolean — shows a character counter (pairs with maxLength)
 *   tags        Array<{ id?, label, icon?, color?, variant? }> — render chips
 *               inside the field (file/upload tokens, multi-select values).
 *   onRemoveTag (id) => void — shows a × on each tag
 *   tagsScroll  boolean — single-row horizontal scroll instead of wrapping
 *               (default: tags wrap and the field grows in height)
 *   action      ReactNode — an in-field CTA at the right end (compose a Button
 *               atom: icon-only / small text / link). Not a bordered add-on.
 *   minWidth / maxWidth  number|string — clamp the field width (adapts to the
 *               screen between the two); long single-line content scrolls/ellipses.
 *   autoGrow    boolean — render a textarea that grows with the text…
 *   maxHeight   number|string — …up to this height, then scrolls. Without
 *               autoGrow the field is a single line.
 *   fullWidth   boolean
 *   disabled    boolean
 *   readOnly    boolean — neutral, non-interactive surface (like disabled, but
 *               the value stays focusable/selectable for copy)
 *   radius      number | "pill" | "sharp" | string — field corner radius.
 *               Omit to keep the size's default 10px token (e.g. pill search
 *               inputs keep their existing look).
 *   statusIcon  ReactNode | string — override the auto status glyph. A string is
 *               treated as a CDN icon name; a node is rendered as-is. Only shown
 *               when `status` is not "default".
 *   All native <input> props are forwarded (type, maxLength, pattern, …).
 */

// Per-status glyph shown on the trailing edge. `warning` gets its own real CDN
// icon (the essential-family warning triangle) so it no longer shares the
// `danger` error glyph.
const STATUS_ICON = {
  success: "tick-circle",
  error:   "danger",
  warning: "warning",
};

// Live character filters. Each strips disallowed characters as the user types
// and sets the mobile keyboard hint via inputMode.
const FILTERS = {
  numeric:      { re: /[^0-9]/g,          inputMode: "numeric" },
  alpha:        { re: /[^a-zA-Z\s]/g,     inputMode: "text" },
  alphanumeric: { re: /[^a-zA-Z0-9\s]/g,  inputMode: "text" },
};

// Write a value through the native setter so React's onChange fires for
// controlled inputs (used by the clear button).
function setNativeValue(el, value) {
  const proto = Object.getPrototypeOf(el);
  const desc = Object.getOwnPropertyDescriptor(proto, "value");
  desc?.set?.call(el, value);
}

// ── Built-in add-ons ─────────────────────────────────────────────────────────
// The add-on visual treatment (background, divider, dropdown chevron, CTA) lives
// IN the component so it's consistent and tokenised everywhere — consumers pass a
// descriptor instead of hand-rolling a styled <span>. Either side accepts the same
// descriptors, so any add-on can be a prefix or a suffix.

function AddonSelect({ options = [], value, defaultValue, onChange, ariaLabel, placeholder }) {
  return (
    <span className={styles.addonSelect}>
      <select
        className={styles.addonSelectControl}
        aria-label={ariaLabel}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === "object" ? o : { value: o, label: o };
          return <option key={opt.value ?? opt.label} value={opt.value ?? opt.label}>{opt.label ?? opt.value}</option>;
        })}
      </select>
      <TPLibraryIcon name="arrow-down" size={14} className={styles.addonChevron} aria-hidden />
    </span>
  );
}

function AddonButton({ label, icon, iconVariant = "linear", onClick, ariaLabel, disabled }) {
  return (
    <button
      type="button"
      className={styles.addonButton}
      onClick={onClick}
      aria-label={ariaLabel || (typeof label === "string" ? label : undefined)}
      disabled={disabled}
    >
      {icon && (typeof icon === "string"
        ? <TPLibraryIcon name={icon} variant={iconVariant} size={16} aria-hidden />
        : icon)}
      {label && <span className={styles.addonButtonLabel}>{label}</span>}
    </button>
  );
}

// Resolve an add-on prop into a node. Accepts: a ReactNode (escape hatch), a
// string (→ text affix), or a descriptor { type: "text" | "select" | "button", … }.
function renderAddon(addon) {
  if (addon == null || addon === false) return null;
  if (isValidElement(addon)) return addon;
  if (typeof addon === "string" || typeof addon === "number") {
    return <span className={styles.addonText}>{addon}</span>;
  }
  if (typeof addon === "object") {
    if (addon.type === "select") return <AddonSelect {...addon} />;
    if (addon.type === "button") return <AddonButton {...addon} />;
    // default + "text"
    return <span className={styles.addonText}>{addon.content ?? addon.label}</span>;
  }
  return null;
}

export const InputBox = forwardRef(function InputBox(
  {
    size       = "md",
    status     = "default",
    variant    = "default",
    allow      = "any",
    label,
    helperText,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    unit,
    counter    = false,
    clearable  = false,
    loading    = false,
    showCount  = false,
    fullWidth  = false,
    disabled   = false,
    readOnly   = false,
    radius,
    statusIcon,
    tags,
    onRemoveTag,
    tagsScroll = false,
    action,
    minWidth,
    maxWidth,
    height,
    autoGrow   = false,
    maxHeight,
    type,
    id: idProp,
    className  = "",
    onChange,
    value,
    defaultValue,
    maxLength,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;

  const innerRef = useRef(null);

  // Auto-grow the textarea with its content, up to maxHeight (then scroll).
  const maxH = maxHeight == null ? null : (typeof maxHeight === "number" ? maxHeight : parseInt(maxHeight, 10));
  const autoResize = (el) => {
    if (!el || !autoGrow) return;
    el.style.height = "auto";
    let h = el.scrollHeight;
    if (maxH != null) { el.style.overflowY = h > maxH ? "auto" : "hidden"; h = Math.min(h, maxH); }
    el.style.height = `${h}px`;
  };

  const setRefs = (node) => {
    innerRef.current = node;
    autoResize(node);
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const initial = String(value ?? defaultValue ?? "");
  const [hasContent, setHasContent] = useState(Boolean(initial));
  const [count, setCount] = useState(initial.length);

  const filter = allow !== "any" ? FILTERS[allow] : null;

  // Stepper helpers (counter mode)
  const stepUp   = () => innerRef.current?.stepUp();
  const stepDown = () => innerRef.current?.stepDown();

  function handleChange(e) {
    if (filter) {
      const cleaned = e.target.value.replace(filter.re, "");
      if (cleaned !== e.target.value) {
        const el = e.target;
        const delta = el.value.length - cleaned.length;
        const pos = Math.max(0, (el.selectionStart ?? cleaned.length) - delta);
        el.value = cleaned;
        try { el.setSelectionRange(pos, pos); } catch { /* number inputs disallow selection */ }
      }
    }
    setHasContent(Boolean(e.target.value));
    setCount(e.target.value.length);
    autoResize(e.target);
    onChange?.(e);
  }

  function handleClear() {
    const el = innerRef.current;
    if (!el) return;
    setNativeValue(el, "");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
    setHasContent(false);
    setCount(0);
  }

  const wrapCls = [
    styles.wrap,
    fullWidth ? styles.fullWidth : "",
    className,
  ].filter(Boolean).join(" ");

  const showClear  = clearable && hasContent && !disabled && !readOnly && !loading;
  const showStatus = status !== "default" && !loading;
  const hasTrailing = Boolean(unit || showClear || rightIcon || showStatus || loading || action);
  const showFooter = Boolean(helperText || (showCount));
  const hasTags = Array.isArray(tags) && tags.length > 0;

  // Associate the helper/status message with the control for screen readers.
  // A consumer-supplied aria-describedby (via ...props) still wins.
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = props["aria-describedby"] ?? helperId;

  // Field corner radius. Drives the same CSS var the SCSS reads
  // (--tesseract-input-radius); undefined keeps the size's default token.
  const resolvedRadius = resolveRadius(radius);

  // A height override → drives the same CSS var the SCSS reads for the field row.
  const resolvedHeight = height == null ? null : (typeof height === "number" ? `${height}px` : height);

  // Merge width clamps + radius + height into a single inline style (omit when
  // empty so defaults are untouched).
  const wrapStyle =
    minWidth != null || maxWidth != null || resolvedRadius != null || resolvedHeight != null
      ? {
          ...(minWidth != null ? { minWidth } : null),
          ...(maxWidth != null ? { maxWidth } : null),
          ...(resolvedRadius != null ? { "--tesseract-input-radius": resolvedRadius } : null),
          ...(resolvedHeight != null ? { "--input-height": resolvedHeight } : null),
        }
      : undefined;

  return (
    <div
      className={wrapCls}
      data-size={size}
      data-variant={variant !== "default" ? variant : undefined}
      data-status={status !== "default" ? status : undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-autogrow={autoGrow || undefined}
      style={wrapStyle}
    >
      {/* Label */}
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {props.required && <span className={styles.required} aria-hidden>*</span>}
        </label>
      )}

      {/* Field row */}
      <div
        className={styles.fieldRow}
        data-tags={hasTags ? (tagsScroll ? "scroll" : "wrap") : undefined}
      >

        {/* Left addon (country code, prefix dropdown, CTA, …) — descriptor or node */}
        {leftAddon && <div className={styles.addonLeft}>{renderAddon(leftAddon)}</div>}

        {/* Counter decrement */}
        {counter && (
          <button
            type="button"
            className={styles.stepBtn}
            onClick={stepDown}
            disabled={disabled}
            aria-label="Decrease"
            tabIndex={-1}
          >
            <TPLibraryIcon name="minus" size={14} aria-hidden />
          </button>
        )}

        {/* Input wrapper (icons + tags + native input + trailing cluster) */}
        <div className={styles.inputWrap}>
          {leftIcon && <span className={styles.iconLeft} aria-hidden>{leftIcon}</span>}

          {/* Tag chips (file/upload tokens, multi-select values, …) — reuse the Chip atom */}
          {hasTags && tags.map((t) => (
            <Chip
              key={t.id ?? t.label}
              size="sm"
              color={t.color ?? "primary"}
              variant={t.variant ?? "filled"}
              icon={t.icon}
              label={t.label}
              onDelete={onRemoveTag && !disabled && !readOnly ? () => onRemoveTag(t.id ?? t.label) : undefined}
              className={styles.tagChip}
            />
          ))}

          {autoGrow ? (
            <textarea
              ref={setRefs}
              id={id}
              rows={1}
              className={`${styles.input} ${styles.textarea}`}
              disabled={disabled}
              readOnly={readOnly}
              onChange={handleChange}
              value={value}
              defaultValue={defaultValue}
              maxLength={maxLength}
              inputMode={filter?.inputMode}
              aria-invalid={status === "error" || undefined}
              aria-describedby={describedBy}
              {...props}
            />
          ) : (
            <input
              ref={setRefs}
              id={id}
              type={type}
              className={styles.input}
              disabled={disabled}
              readOnly={readOnly}
              onChange={handleChange}
              value={value}
              defaultValue={defaultValue}
              maxLength={maxLength}
              inputMode={filter?.inputMode}
              aria-invalid={status === "error" || undefined}
              aria-describedby={describedBy}
              {...props}
            />
          )}

          {hasTrailing && (
            <span className={styles.trailing}>
              {unit && <span className={styles.unit}>{unit}</span>}

              {showClear && (
                <button
                  type="button"
                  className={styles.clear}
                  onClick={handleClear}
                  aria-label="Clear"
                  tabIndex={-1}
                >
                  <TPLibraryIcon name="close-square" variant="bold" size={12} aria-hidden />
                </button>
              )}

              {rightIcon && <span className={styles.iconRight} aria-hidden>{rightIcon}</span>}

              {loading && (
                <LoadingIndicator type="line-simple" size={LOADER_PX[size] ?? 18} className={styles.loader} />
              )}

              {showStatus && (
                <span className={styles.statusIcon} aria-hidden>
                  {statusIcon != null
                    ? (typeof statusIcon === "string"
                        ? <TPLibraryIcon name={statusIcon} size={18} aria-hidden />
                        : statusIcon)
                    : STATUS_ICON[status] && <TPLibraryIcon name={STATUS_ICON[status]} size={18} aria-hidden />}
                </span>
              )}

              {/* In-field CTA at the right end (compose a Button atom: icon /
                  text / link). Not a bordered add-on — sits inside the field. */}
              {action && <span className={styles.action}>{action}</span>}
            </span>
          )}
        </div>

        {/* Counter increment */}
        {counter && (
          <button
            type="button"
            className={styles.stepBtn}
            onClick={stepUp}
            disabled={disabled}
            aria-label="Increase"
            tabIndex={-1}
          >
            <TPLibraryIcon name="add" size={14} aria-hidden />
          </button>
        )}

        {/* Right addon (unit dropdown, CTA, submit, …) — descriptor or node */}
        {rightAddon && <div className={styles.addonRight}>{renderAddon(rightAddon)}</div>}
      </div>

      {/* Footer: helper / status text + character counter */}
      {showFooter && (
        <div className={styles.footer}>
          {helperText && (
            <span id={helperId} className={styles.helper} role={status === "error" ? "alert" : undefined}>
              {status === "error" && <TPLibraryIcon name={STATUS_ICON.error} size={13} aria-hidden />}
              {status === "warning" && <TPLibraryIcon name={STATUS_ICON.warning} size={13} aria-hidden />}
              {helperText}
            </span>
          )}
          {showCount && (
            <span className={styles.count} data-over={maxLength != null && count > maxLength ? "true" : undefined}>
              {maxLength != null ? `${count}/${maxLength}` : count}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

InputBox.displayName = "InputBox";
export default InputBox;
