"use client";

/**
 * Chip — removable / selectable label pill (filters, multi-select).
 * Auto-layout (inline-flex + gap), Tesseract color tokens, sm/md/lg sizes, 10px radius.
 *
 * Props:
 *   label     ReactNode
 *   color     "default" | "primary" | "success" | "warning" | "error"   default "default"
 *   variant   "solid" | "soft" | "outline"   default "soft"
 *             (aliases: "filled" → soft, "outlined" → outline)
 *   size      "sm" | "md" | "lg"                                         default "md"
 *   icon          ReactNode    leading icon
 *   rightIcon     ReactNode    trailing icon
 *   onDelete      fn           shows a remove (×) button
 *   removePosition "left" | "right"   side for the × button   default "right"
 *   onClick       fn           makes the chip act as a button
 *   selected  boolean      first-class active/toggle state (stronger wash + 500 border)
 *   radius    number | "pill" | "sharp" | string   corner radius override (default = radius-10)
 *   track     string | { id, … }  opt-in action tracking (emits on click to the
 *                                  nearest TPAnalyticsProvider; no-op without one)
 *   disabled  boolean
 */

import { forwardRef } from "react";
import { useAnalytics, resolveTrack } from "@/src/analytics/context";
import { resolveRadius } from "@/src/hooks/utils";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./Chip.module.scss";

// Dismiss glyph from the icon CDN (no inline SVG).
const X = ({ size = 12 }) => <TPLibraryIcon name="close-square" variant="bold" size={size} />;

// One color token per tone; bg/border are translucent washes derived from it.
// Text/icon tone — uses the deep ramp step so it clears WCAG AA on the soft
// tinted chip fill (success/warning at -600 fail; amber needs -800).
const TONES = {
  default: "var(--tesseract-slate-700)",
  primary: "var(--tesseract-blue-600)",
  success: "var(--tesseract-success-700)",
  warning: "var(--tesseract-warning-800)",
  error:   "var(--tesseract-error-600)",
};

// 500-step tokens — the active/selected border accent (one ramp step lighter
// than the 600 tone, so the selected outline reads as a deliberate emphasis).
const TONES_500 = {
  default: "var(--tesseract-slate-500)",
  primary: "var(--tesseract-blue-500)",
  success: "var(--tesseract-success-500)",
  warning: "var(--tesseract-warning-500)",
  error:   "var(--tesseract-error-500)",
};

const SIZES = {
  sm: { height: 20, padX: 8,  font: "var(--tesseract-text-micro)",   gap: 4, icon: 12 },
  md: { height: 24, padX: 10, font: "var(--tesseract-text-body-xs)", gap: 4, icon: 14 },
  lg: { height: 28, padX: 12, font: "var(--tesseract-text-body-sm)", gap: 6, icon: 16 },
};

export const TPChip = forwardRef(function TPChip({
  label,
  color = "default",
  variant = "filled",
  size = "md",
  icon,
  rightIcon,
  onDelete,
  removePosition = "right",
  onClick,
  selected = false,
  radius,
  track,
  disabled = false,
  className,
  style: styleProp,
  ...rest
}, ref) {
  const c = TONES[color] ?? TONES.default;
  const c500 = TONES_500[color] ?? TONES_500.default;
  const s = SIZES[size] ?? SIZES.md;
  const resolvedRadius = resolveRadius(radius);
  const interactive = !!onClick && !disabled;
  // Hover affordance applies to any interactive chip — clickable OR dismissible.
  const hoverable = (!!onClick || !!onDelete) && !disabled;
  const { track: emit } = useAnalytics();
  const handleClick = (e) => {
    if (disabled) return;
    const t = resolveTrack(track);
    if (t) emit({ component: "Chip", action: "click", label: typeof label === "string" ? label : undefined, ...t });
    onClick?.(e);
  };

  // Variants mirror the Badge atom: solid (filled) · soft (wash) · outline.
  // Back-compat aliases: "filled" → soft, "outlined" → outline.
  const v = variant === "filled" ? "soft" : variant === "outlined" ? "outline" : variant;
  const variantStyle =
    v === "solid"
      ? { color: "var(--tesseract-slate-0)", backgroundColor: c, border: `1px solid ${c}` }
      : v === "outline"
        ? { color: c, backgroundColor: "transparent", border: `1px solid color-mix(in srgb, ${c} 40%, transparent)` }
        : { color: c, backgroundColor: `color-mix(in srgb, ${c} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 22%, transparent)` };

  // Selected = first-class active/toggle state. A solid chip is already "filled",
  // so we just firm up its border to the 500 accent; soft/outline chips get a
  // stronger wash plus the 500 border so the active state reads clearly.
  const selectedStyle = selected
    ? v === "solid"
      ? { border: `1px solid ${c500}` }
      : { color: c, backgroundColor: `color-mix(in srgb, ${c} 22%, transparent)`, border: `1px solid ${c500}` }
    : undefined;

  // The remove control is a span (role="button"), NOT a <button> — chips are
  // often rendered inside a button trigger (Dropdown/ClinicalTable), and a
  // <button> nested in a <button> is invalid HTML (and warns in React).
  const removeBtn = onDelete && (
    <span
      role="button"
      aria-label="Remove"
      aria-disabled={disabled ? true : undefined}
      data-disabled={disabled ? "" : undefined}
      className={styles.remove}
      tabIndex={disabled ? undefined : 0}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onDelete(e);
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          e.stopPropagation();
          onDelete(e);
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: s.icon,
        height: s.icon,
        marginRight: removePosition === "right" ? -2 : 0,
        marginLeft: removePosition === "left" ? -2 : 0,
        padding: 0,
        border: "none",
        background: "none",
        color: "inherit",
        opacity: 0.7,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <X size={s.icon - 2} />
    </span>
  );

  return (
    <span
      {...rest}
      ref={ref}
      role={onClick ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={onClick && selected ? true : undefined}
      aria-disabled={onClick && disabled ? true : undefined}
      data-selected={selected ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onClick={disabled ? undefined : handleClick}
      className={[styles.root, hoverable && styles.interactive, className].filter(Boolean).join(" ") || undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        gap: s.gap,
        height: s.height,
        padding: `0 ${s.padX}px`,
        borderRadius: resolvedRadius ?? "var(--tesseract-radius-10)",
        cornerShape: "round",
        fontSize: s.font,
        fontWeight: "var(--tesseract-weight-medium)",
        fontFamily: "var(--tesseract-font-body)",
        lineHeight: 1,
        ...variantStyle,
        ...selectedStyle,
        cursor: interactive ? "pointer" : "default",
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
        userSelect: "none",
        ...styleProp,
      }}
    >
      {removePosition === "left" && removeBtn}
      {icon && <span style={{ display: "inline-flex", flexShrink: 0 }}>{icon}</span>}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      {rightIcon && <span style={{ display: "inline-flex", flexShrink: 0 }}>{rightIcon}</span>}
      {removePosition === "right" && removeBtn}
    </span>
  );
});

TPChip.displayName = "TPChip";

export default TPChip;
