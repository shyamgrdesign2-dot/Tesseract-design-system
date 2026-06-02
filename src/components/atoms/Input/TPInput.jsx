"use client";

import { forwardRef, useId, useRef, useState } from "react";
import styles from "./TPInput.module.scss";

/**
 * TPInput — comprehensive, scalable input atom.
 *
 * Interaction states (hover/focus/disabled) are owned by CSS. JS handles
 * controlled value, character filtering, clear, and derived aria attributes.
 *
 * Props:
 *   size        "sm" | "md" | "lg"                                  default "md"
 *   status      "default" | "success" | "error" | "warning"         default "default"
 *   allow       "any" | "numeric" | "alpha" | "alphanumeric"         live character filter
 *   label       string — field label
 *   helperText  string — hint / status message below the field
 *   leftIcon    ReactNode — icon inside the left of the input
 *   rightIcon   ReactNode — icon inside the right of the input
 *   leftAddon   ReactNode — pinned segment left of the input (dropdown, CTA…)
 *   rightAddon  ReactNode — pinned segment right of the input (unit, CTA…)
 *   unit        string — fixed suffix inside the right edge (e.g. "kg")
 *   counter     boolean — +/- stepper buttons (use with type="number")
 *   clearable   boolean — shows an × to clear the field when it has a value
 *   loading     boolean — shows a spinner on the trailing edge
 *   showCount   boolean — shows a character counter (pairs with maxLength)
 *   fullWidth   boolean
 *   disabled    boolean
 *   readOnly    boolean
 *   All native <input> props are forwarded (type, maxLength, pattern, …).
 */

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

export const TPInput = forwardRef(function TPInput(
  {
    size       = "md",
    status     = "default",
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
  const setRefs = (node) => {
    innerRef.current = node;
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
  const hasTrailing = Boolean(unit || showClear || rightIcon || showStatus || loading);
  const showFooter = Boolean(helperText || (showCount));

  return (
    <div
      className={wrapCls}
      data-size={size}
      data-status={status !== "default" ? status : undefined}
      data-disabled={disabled || undefined}
    >
      {/* Label */}
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {props.required && <span className={styles.required} aria-hidden>*</span>}
        </label>
      )}

      {/* Field row */}
      <div className={styles.fieldRow}>

        {/* Left addon (country code, prefix dropdown, CTA, …) */}
        {leftAddon && <div className={styles.addonLeft}>{leftAddon}</div>}

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
            <MinusIcon />
          </button>
        )}

        {/* Input wrapper (icons + native input + trailing cluster) */}
        <div className={styles.inputWrap}>
          {leftIcon && <span className={styles.iconLeft} aria-hidden>{leftIcon}</span>}

          <input
            ref={setRefs}
            id={id}
            className={styles.input}
            disabled={disabled}
            readOnly={readOnly}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            inputMode={filter?.inputMode}
            aria-invalid={status === "error" || undefined}
            {...props}
          />

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
                  <ClearIcon />
                </button>
              )}

              {rightIcon && <span className={styles.iconRight} aria-hidden>{rightIcon}</span>}

              {loading && <span className={styles.spinner} role="status" aria-label="Loading" />}

              {showStatus && (
                <span className={styles.statusIcon} aria-hidden>
                  {status === "success" && <CheckIcon />}
                  {status === "error" && <AlertCircleIcon />}
                  {status === "warning" && <AlertTriangleIcon />}
                </span>
              )}
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
            <PlusIcon />
          </button>
        )}

        {/* Right addon (unit dropdown, CTA, submit, …) */}
        {rightAddon && <div className={styles.addonRight}>{rightAddon}</div>}
      </div>

      {/* Footer: helper / status text + character counter */}
      {showFooter && (
        <div className={styles.footer}>
          {helperText && (
            <span className={styles.helper} role={status === "error" ? "alert" : undefined}>
              {status === "error" && <AlertCircleIcon size={13} />}
              {status === "warning" && <AlertTriangleIcon size={13} />}
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

TPInput.displayName = "TPInput";
export default TPInput;

// ─── Inline micro-icons (zero extra deps) ──────────────────────────────────────
function PlusIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>; }
function MinusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>; }
function CheckIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>; }
function ClearIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>; }
function AlertCircleIcon({ size }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>; }
function AlertTriangleIcon({ size }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>; }
