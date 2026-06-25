"use client";

/**
 * Slider — Range input atom with Tesseract token styling.
 *
 * A fully Tesseract-styled but still-native `<input type="range">` (kept native
 * for accessibility + keyboard support). The filled portion of the track is a
 * CSS gradient driven by `--slider-pct`; the fill colour + thumb ring come from
 * `--slider-fill` (set inline from the `color` prop). See Slider.module.scss.
 */

import { forwardRef } from "react";
import { cn } from "@/src/hooks/utils";
import styles from "./Slider.module.scss";

const FILL = {
  primary: "var(--tesseract-blue-500)",
  success: "var(--tesseract-success-500)",
  warning: "var(--tesseract-warning-500)",
  error: "var(--tesseract-error-500)",
};

// Resolve the marks prop into an array of { value, label }.
// boolean true → show min & max; array → use as-is; falsy → no marks.
function resolveMarks(marks, min, max) {
  if (!marks) return null;
  if (marks === true) {
    return [
      { value: min, label: String(min) },
      { value: max, label: String(max) },
    ];
  }
  return Array.isArray(marks) ? marks : null;
}

export const Slider = forwardRef(function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  color = "primary",
  size = "md",
  error = false,
  label,
  ariaLabel,
  showValue = false,
  formatValue = (v) => v,
  marks = false,
  className,
  style: styleProp,
  ...rest
}, ref) {
  const fill = error ? FILL.error : FILL[color] ?? FILL.primary;

  // Current value for the readout / fill percentage (controlled or uncontrolled).
  const current = value != null ? Number(value) : Number(defaultValue ?? min);
  const pct = max > min ? ((current - min) / (max - min)) * 100 : 0;

  const markList = resolveMarks(marks, min, max);

  // Shared <input type="range"> markup. When the slider renders bare (no chrome),
  // this IS the root, so it receives the forwarded ref, appended className, merged
  // style and the spread `...rest`. When wrapped, those land on the root <div>.
  const bare = !label && !showValue && !markList;

  const input = (
    <input
      ref={bare ? ref : undefined}
      type="range"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-label={(typeof label === "string" && label ? label : ariaLabel) || undefined}
      data-size={size}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      onChange={onChange ? (e) => onChange(e, Number(e.target.value)) : undefined}
      className={cn(styles.input, bare && className)}
      style={{
        "--slider-fill": fill,
        "--slider-pct": `${pct}%`,
        ...(bare ? styleProp : null),
      }}
      {...(bare ? rest : null)}
    />
  );

  // Bare input when there's no surrounding chrome (label / value / marks).
  if (bare) return input;

  return (
    // --slider-fill on the wrapper so the value readout tracks the slider colour.
    <div
      ref={ref}
      className={cn(styles.field, className)}
      style={{ "--slider-fill": fill, ...styleProp }}
      {...rest}
    >
      {(label || showValue) && (
        <div className={styles.header}>
          {label ? <span className={styles.label}>{label}</span> : <span />}
          {showValue && <span className={styles.value}>{formatValue(current)}</span>}
        </div>
      )}
      {input}
      {markList && (
        <div className={styles.marks}>
          {markList.map((m, i) => (
            <span key={`${m.value}-${i}`} className={styles.mark}>
              {m.label ?? m.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

Slider.displayName = "Slider";
export default Slider;
