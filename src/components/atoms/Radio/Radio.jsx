"use client";

/**
 * Radio / RadioGroup — Native radio input atoms with Tesseract token styling.
 * RadioGroup manages a controlled group. Radio is a single labeled option.
 */

import { createContext, useContext } from "react";

const RadioGroupCtx = createContext({ value: undefined, onChange: undefined, name: undefined, size: undefined });

export function RadioGroup({ value, onChange, name, size, orientation = "vertical", children, style, className }) {
  const isRow = orientation === "horizontal";
  return (
    <RadioGroupCtx.Provider value={{ value, onChange, name, size }}>
      <div
        role="radiogroup"
        className={className}
        style={{ display: "flex", flexDirection: isRow ? "row" : "column", gap: isRow ? "var(--tp-space-5)" : "var(--tp-space-2)", flexWrap: isRow ? "wrap" : undefined, ...style }}
      >
        {children}
      </div>
    </RadioGroupCtx.Provider>
  );
}

const RADIO_SIZES = {
  sm: { box: "var(--tp-size-14)", font: "var(--tp-text-body-xs)" },
  md: { box: "var(--tp-size-16)", font: "var(--tp-text-body-sm)" },
  lg: { box: "var(--tp-size-18)", font: "var(--tp-text-body-base)" }, // 16px
};

export function Radio({
  value,
  label,
  checked,
  disabled,
  size: sizeProp,
  name,
  onChange,
  className,
  style: styleProp,
  "aria-label": ariaLabel,
}) {
  const ctx = useContext(RadioGroupCtx);
  // Controlled standalone mode when `checked` is passed (e.g. as a decorative
  // indicator inside a Dropdown option, or a single-select row control in a
  // table); otherwise derive from the surrounding RadioGroup.
  const isChecked = checked !== undefined ? checked : ctx.value === value;
  // Per-Radio size wins; otherwise inherit the group's size; else default md.
  const size = sizeProp ?? ctx.size ?? "md";
  const s = RADIO_SIZES[size] ?? RADIO_SIZES.md;
  // Standalone props (name / onChange / aria-label) override the group so the
  // atom is usable on its own, exactly like Checkbox. In group mode they are
  // undefined and the context supplies them. Always a function → React never
  // warns about a controlled input without onChange.
  const handleChange = (e) => { onChange?.(e); ctx.onChange?.(value); };

  return (
    <label
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: label != null ? "var(--tp-space-2)" : 0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: s.font,
        color: "var(--tp-slate-700, #454551)",
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
        style={{
          width: s.box,
          height: s.box,
          margin: 0,
          accentColor: "var(--tp-blue-500, #4b4ad5)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      {label}
    </label>
  );
}

export function FormControlLabel({ control, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "var(--tp-space-2)", fontSize: "var(--tp-text-body-sm)", color: "var(--tp-slate-700, #454551)", cursor: "pointer" }}>
      {control}
      {label}
    </label>
  );
}

RadioGroup.displayName = "RadioGroup";
Radio.displayName = "Radio";
