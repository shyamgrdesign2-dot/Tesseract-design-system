"use client";

/**
 * Slider — Range input atom with Tesseract token styling.
 * Uses native <input type="range"> with CSS accent-color.
 */

export function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  color = "primary",
  size = "md",
  className,
  style: styleProp,
}) {
  // Tesseract tokens with hex fallbacks; every tone the stories use must be mapped here
  // (warning was previously missing and silently fell back to blue).
  const ACCENT = {
    primary: "var(--tp-blue-500, #4b4ad5)",
    success: "var(--tp-success-500, #10b981)",
    warning: "var(--tp-warning-500, #f59e0b)",
    error:   "var(--tp-error-500, #E11D48)",
  };
  const accentColor = ACCENT[color] ?? ACCENT.primary;
  const trackHeight = size === "sm" ? 4 : size === "lg" ? 6 : 4;

  return (
    <input
      type="range"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onChange={onChange ? (e) => onChange(e, Number(e.target.value)) : undefined}
      className={className}
      style={{
        width: "100%",
        accentColor,
        height: trackHeight,
        cursor: disabled ? "not-allowed" : "pointer",
        ...styleProp,
      }}
    />
  );
}

Slider.displayName = "Slider";
export default Slider;
