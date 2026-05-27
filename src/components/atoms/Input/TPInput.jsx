"use client";

import { forwardRef, useId } from "react";
import styles from "./TPInput.module.scss";

/**
 * TPInput — comprehensive input atom.
 *
 * All interaction states handled entirely in CSS (hover, focus, disabled).
 * JS only manages controlled value and derived aria attributes.
 *
 * Props:
 *   size         "sm" | "md" | "lg"                                   default "md"
 *   status       "default" | "success" | "error"                      default "default"
 *   label        string — floating label above the field
 *   helperText   string — hint text below the field
 *   leftIcon     ReactNode — icon inside the left of the input
 *   rightIcon    ReactNode — icon inside the right of the input
 *   leftAddon    ReactNode — pinned segment left of the input (e.g. country dropdown)
 *   rightAddon   ReactNode — pinned segment right of the input (e.g. unit, button)
 *   unit         string — fixed unit suffix inside the right edge (e.g. "kg", "px")
 *   counter      boolean — renders +/- stepper buttons (use with type="number")
 *   fullWidth    boolean
 *   disabled     boolean
 *   readOnly     boolean
 *   All native <input> props are forwarded.
 */
export const TPInput = forwardRef(function TPInput(
  {
    size       = "md",
    status     = "default",
    label,
    helperText,
    leftIcon,
    rightIcon,
    leftAddon,
    rightAddon,
    unit,
    counter    = false,
    fullWidth  = false,
    disabled   = false,
    readOnly   = false,
    id: idProp,
    className  = "",
    onChange,
    value,
    defaultValue,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;

  // Stepper helpers (counter mode)
  const stepUp  = () => ref?.current?.stepUp()  ?? document.getElementById(id)?.stepUp();
  const stepDown = () => ref?.current?.stepDown() ?? document.getElementById(id)?.stepDown();

  const wrapCls = [
    styles.wrap,
    fullWidth ? styles.fullWidth : "",
    className,
  ].filter(Boolean).join(" ");

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

        {/* Left addon (country code, prefix dropdown, etc.) */}
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

        {/* Input wrapper (holds icons + native input) */}
        <div className={styles.inputWrap}>
          {leftIcon  && <span className={styles.iconLeft}  aria-hidden>{leftIcon}</span>}

          <input
            ref={ref}
            id={id}
            className={styles.input}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={status === "error" || undefined}
            {...props}
          />

          {/* Unit — fixed text inside right edge */}
          {unit && <span className={styles.unit}>{unit}</span>}

          {rightIcon && <span className={styles.iconRight} aria-hidden>{rightIcon}</span>}

          {/* Success checkmark */}
          {status === "success" && !rightIcon && (
            <span className={styles.iconRight} aria-hidden><CheckIcon /></span>
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

        {/* Right addon (unit button, submit, etc.) */}
        {rightAddon && <div className={styles.addonRight}>{rightAddon}</div>}
      </div>

      {/* Helper / error text */}
      {helperText && (
        <span className={styles.helper} role={status === "error" ? "alert" : undefined}>
          {status === "error" && <AlertIcon />}
          {helperText}
        </span>
      )}
    </div>
  );
});

TPInput.displayName = "TPInput";
export default TPInput;

// ─── Inline micro-icons (keeps zero extra deps) ───────────────────────────────
function PlusIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>; }
function MinusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/></svg>; }
function CheckIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>; }
function AlertIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
