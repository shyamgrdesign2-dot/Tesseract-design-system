"use client";

/**
 * Radio / RadioGroup — Native radio input atoms with Tesseract token styling.
 * RadioGroup manages a controlled group. Radio is a single labeled option.
 */

import * as React from "react";
import { createContext, useContext } from "react";
import styles from "./Radio.module.scss";

// Append a module class to any caller-supplied className (never replace it).
const cx = (...parts) => parts.filter(Boolean).join(" ");

const RadioGroupCtx = createContext({ value: undefined, onChange: undefined, name: undefined, size: undefined, color: undefined, error: undefined });

// Semantic colours map to the *-500 token ramp; "primary" stays blue so the
// default look is unchanged. Error styling overrides this to the error ramp.
const RADIO_COLORS = {
  primary: "var(--tesseract-blue-500)",
  success: "var(--tesseract-success-500)",
  error: "var(--tesseract-error-500)",
  warning: "var(--tesseract-warning-500)",
};

export const RadioGroup = React.forwardRef(function RadioGroup({ value, onChange, name, size, color = "primary", error = false, orientation = "vertical", gap, children, style, className, ...rest }, ref) {
  const isRow = orientation === "horizontal";
  // Default gaps preserve the current look; `gap` (px) overrides when provided.
  const groupGap = gap != null ? gap : (isRow ? "var(--tesseract-space-5)" : "var(--tesseract-space-2)");
  return (
    <RadioGroupCtx.Provider value={{ value, onChange, name, size, color, error }}>
      <div
        ref={ref}
        role="radiogroup"
        aria-invalid={error || undefined}
        className={cx(styles.root, className)}
        style={{ display: "flex", flexDirection: isRow ? "row" : "column", gap: groupGap, flexWrap: isRow ? "wrap" : undefined, ...style }}
        {...rest}
      >
        {children}
      </div>
    </RadioGroupCtx.Provider>
  );
});

const RADIO_SIZES = {
  sm: { box: "var(--tesseract-size-14)", font: "var(--tesseract-text-body-xs)" },
  md: { box: "var(--tesseract-size-16)", font: "var(--tesseract-text-body-sm)" },
  lg: { box: "var(--tesseract-size-18)", font: "var(--tesseract-text-body-base)" }, // 16px
};

export const Radio = React.forwardRef(function Radio({
  value,
  label,
  description,
  checked,
  disabled,
  size: sizeProp,
  color: colorProp,
  name,
  onChange,
  className,
  style: styleProp,
  "aria-label": ariaLabel,
  ...rest
}, ref) {
  const ctx = useContext(RadioGroupCtx);
  // Controlled standalone mode when `checked` is passed (e.g. as a decorative
  // indicator inside a Dropdown option, or a single-select row control in a
  // table); otherwise derive from the surrounding RadioGroup.
  const isChecked = checked !== undefined ? checked : ctx.value === value;
  // Per-Radio size wins; otherwise inherit the group's size; else default md.
  const size = sizeProp ?? ctx.size ?? "md";
  const s = RADIO_SIZES[size] ?? RADIO_SIZES.md;
  // Per-Radio colour wins; otherwise inherit the group's colour; else primary.
  // An error group forces the error ramp regardless of the chosen colour.
  const isError = ctx.error === true;
  const color = colorProp ?? ctx.color ?? "primary";
  const accent = isError ? RADIO_COLORS.error : (RADIO_COLORS[color] ?? RADIO_COLORS.primary);
  // Standalone props (name / onChange / aria-label) override the group so the
  // atom is usable on its own, exactly like Checkbox. In group mode they are
  // undefined and the context supplies them. Always a function → React never
  // warns about a controlled input without onChange.
  const handleChange = (e) => { onChange?.(e); ctx.onChange?.(value); };
  // Default look preserved: no description → the label is rendered inline next
  // to the input exactly as before. With a description we stack label + helper.
  const labelColor = isError ? "var(--tesseract-error-700)" : "var(--tesseract-slate-700)";

  return (
    <label
      ref={ref}
      className={cx(styles.root, className)}
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: description != null ? "flex-start" : "center",
        gap: (label != null || description != null) ? "var(--tesseract-space-2)" : 0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: s.font,
        color: labelColor,
        userSelect: "none",
        ...styleProp,
      }}
    >
      <input
        type="radio"
        name={name ?? ctx.name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-invalid={isError || undefined}
        style={{
          width: s.box,
          height: s.box,
          margin: 0,
          // Nudge the box to align with the first line of label text when a
          // description stacks below.
          marginTop: description != null ? "var(--tesseract-space-1)" : 0,
          accentColor: accent,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      {description != null ? (
        <span style={{ display: "inline-flex", flexDirection: "column", gap: "var(--tesseract-space-1)" }}>
          <span>{label}</span>
          <span style={{ fontSize: "var(--tesseract-text-body-xs)", color: isError ? "var(--tesseract-error-600)" : "var(--tesseract-fg-secondary)", lineHeight: 1.4 }}>
            {description}
          </span>
        </span>
      ) : (
        label
      )}
    </label>
  );
});

export const FormControlLabel = React.forwardRef(function FormControlLabel({ control, label, className, style, ...rest }, ref) {
  return (
    <label
      ref={ref}
      className={cx(styles.root, className)}
      {...rest}
      style={{ display: "inline-flex", alignItems: "center", gap: "var(--tesseract-space-2)", fontSize: "var(--tesseract-text-body-sm)", color: "var(--tesseract-slate-700)", cursor: "pointer", ...style }}
    >
      {control}
      {label}
    </label>
  );
});

RadioGroup.displayName = "RadioGroup";
Radio.displayName = "Radio";
FormControlLabel.displayName = "FormControlLabel";
