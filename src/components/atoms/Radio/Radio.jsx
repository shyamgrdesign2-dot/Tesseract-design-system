"use client";

/**
 * Radio / RadioGroup — Native radio input atoms with TP token styling.
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
        style={{ display: "flex", flexDirection: isRow ? "row" : "column", gap: isRow ? 20 : 8, flexWrap: isRow ? "wrap" : undefined, ...style }}
      >
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

export function Radio({ value, label, checked, disabled, size: sizeProp, className, style: styleProp }) {
  const ctx = useContext(RadioGroupCtx);
  // Controlled standalone mode when `checked` is passed (e.g. as a decorative
  // indicator inside a Dropdown option); otherwise derive from the group.
  const isChecked = checked !== undefined ? checked : ctx.value === value;
  // Per-Radio size wins; otherwise inherit the group's size; else default md.
  const size = sizeProp ?? ctx.size ?? "md";
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
        color: "var(--tp-slate-700, #454551)",
        userSelect: "none",
        ...styleProp,
      }}
    >
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={() => ctx.onChange?.(value)}
        style={{
          width: s.box,
          height: s.box,
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
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--tp-slate-700, #454551)", cursor: "pointer" }}>
      {control}
      {label}
    </label>
  );
}

RadioGroup.displayName = "RadioGroup";
Radio.displayName = "Radio";
