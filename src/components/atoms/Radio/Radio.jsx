"use client";

/**
 * Radio / RadioGroup — Native radio input atoms with TP token styling.
 * RadioGroup manages a controlled group. Radio is a single labeled option.
 */

import { createContext, useContext } from "react";

const RadioGroupCtx = createContext({ value: undefined, onChange: undefined, name: undefined });

export function RadioGroup({ value, onChange, name, children, style, className }) {
  return (
    <RadioGroupCtx.Provider value={{ value, onChange, name }}>
      <div role="radiogroup" className={className} style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
        {children}
      </div>
    </RadioGroupCtx.Provider>
  );
}

const RADIO_SIZES = {
  sm: { box: 14, font: 13 },
  md: { box: 16, font: 14 },
  lg: { box: 18, font: 15 },
};

export function Radio({ value, label, disabled, size = "md", className, style: styleProp }) {
  const ctx = useContext(RadioGroupCtx);
  const checked = ctx.value === value;
  const s = RADIO_SIZES[size] ?? RADIO_SIZES.md;

  return (
    <label
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: s.font,
        color: "var(--tp-slate-700)",
        userSelect: "none",
        ...styleProp,
      }}
    >
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => ctx.onChange?.(value)}
        style={{
          width: s.box,
          height: s.box,
          accentColor: "var(--tp-blue-500)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      {label}
    </label>
  );
}

export function FormControlLabel({ control, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--tp-slate-700)", cursor: "pointer" }}>
      {control}
      {label}
    </label>
  );
}

RadioGroup.displayName = "RadioGroup";
Radio.displayName = "Radio";
