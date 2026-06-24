"use client";

/**
 * Checkbox — Tri-state checkbox atom (checked / unchecked / indeterminate).
 *
 * Hand-rolled (no Radix). Renders a <button role="checkbox"> + a hidden
 * native checkbox for form participation. Preserves the data-state
 * attribute the SCSS module selects on, so styling is unchanged.
 *
 * Props:
 *   checked / defaultChecked / onCheckedChange   — controlled or uncontrolled.
 *                                                  `checked` may be a boolean
 *                                                  or the literal string
 *                                                  "indeterminate".
 *   disabled, required, name, value
 *   color        — "primary" (default) | "success" | "error" | "warning":
 *                  the checked/indeterminate fill + border + focus ring.
 *   error        — boolean; red invalid state (border + focus ring).
 *   label        — string | ReactNode; built-in label beside the box.
 *   description  — string | ReactNode; smaller helper text below the label.
 *   labelPosition — "right" (default) | "left"; side the label sits on.
 *
 * With no `label`/`description` the bare box is rendered exactly as before.
 */

import * as React from "react";
import styles from "./Checkbox.module.scss";

const isIndeterminate = (v) => v === "indeterminate";

export const Checkbox = React.forwardRef(function Checkbox(
  {
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    required,
    name,
    value = "on",
    size = "md",
    color = "primary",
    error = false,
    label,
    description,
    labelPosition = "right",
    className = "",
    style,
    onClick,
    onKeyDown,
    id,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(Boolean(defaultChecked));
  const current = isControlled ? checked : internal;
  const checkedBool = isIndeterminate(current) ? false : Boolean(current);
  const stateAttr = isIndeterminate(current)
    ? "indeterminate"
    : checkedBool
      ? "checked"
      : "unchecked";

  const toggle = React.useCallback(
    (e) => {
      if (disabled) return;
      const next = isIndeterminate(current) ? true : !checkedBool;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next, e);
    },
    [disabled, current, checkedBool, isControlled, onCheckedChange],
  );

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    toggle(e);
  };

  const handleKeyDown = (e) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === " ") {
      e.preventDefault();
      toggle(e);
    }
  };

  const cls = [styles.root, className].filter(Boolean).join(" ");
  const hasLabel = label != null || description != null;

  const box = (
    <button
      type="button"
      role="checkbox"
      aria-checked={isIndeterminate(current) ? "mixed" : checkedBool}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      data-slot="checkbox"
      data-state={stateAttr}
      data-size={size}
      data-color={color}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      ref={ref}
      id={hasLabel ? undefined : id}
      className={cls}
      style={hasLabel ? undefined : style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...(hasLabel ? {} : rest)}>
      {(checkedBool || isIndeterminate(current)) && (
        <span className={styles.indicator}>
          {isIndeterminate(current) ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6H9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 6L5 8.5L9.5 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round" />
            </svg>
          )}
        </span>
      )}
      {name ? (
        <input
          type="checkbox"
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          value={value}
          checked={checkedBool}
          required={required}
          disabled={disabled}
          onChange={() => {}}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            margin: 0,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </button>
  );

  if (!hasLabel) return box;

  const fieldCls = [styles.field, className].filter(Boolean).join(" ");

  return (
    <label
      className={fieldCls}
      data-position={labelPosition}
      data-disabled={disabled || undefined}
      id={id}
      style={style}
      {...rest}>
      {box}
      <span className={styles.labelText}>
        {label != null && <span className={styles.labelTitle}>{label}</span>}
        {description != null && (
          <span className={styles.labelDescription}>{description}</span>
        )}
      </span>
    </label>
  );
});

Checkbox.displayName = "Checkbox";
export default Checkbox;
