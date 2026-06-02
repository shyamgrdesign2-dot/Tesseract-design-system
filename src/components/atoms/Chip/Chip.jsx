"use client";

/**
 * Chip — removable / selectable label pill (filters, multi-select).
 * Auto-layout (inline-flex + gap), TP color tokens, sm/md/lg sizes, 10px radius.
 *
 * Props:
 *   label     ReactNode
 *   color     "default" | "primary" | "success" | "warning" | "error"   default "default"
 *   variant   "filled" | "outlined"                                      default "filled"
 *   size      "sm" | "md" | "lg"                                         default "md"
 *   icon      ReactNode    leading icon
 *   onDelete  fn           shows a remove (×) button
 *   onClick   fn           makes the chip act as a button
 *   disabled  boolean
 */

// Inline dismiss glyph — no external icon dependency.
function X({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// One color token per tone; bg/border are translucent washes derived from it.
const TONES = {
  default: "var(--tp-slate-700, #454551)",
  primary: "var(--tp-blue-600, #3c3bb5)",
  success: "var(--tp-success-600, #059669)",
  warning: "var(--tp-warning-600, #d97706)",
  error:   "var(--tp-error-600, #c8102e)",
};

const SIZES = {
  sm: { height: 20, padX: 8,  font: 11, gap: 4, icon: 12 },
  md: { height: 24, padX: 10, font: 12, gap: 4, icon: 14 },
  lg: { height: 28, padX: 12, font: 13, gap: 6, icon: 16 },
};

export function TPChip({
  label,
  color = "default",
  variant = "filled",
  size = "md",
  icon,
  rightIcon,
  onDelete,
  onClick,
  disabled = false,
  className,
  style: styleProp,
}) {
  const c = TONES[color] ?? TONES.default;
  const s = SIZES[size] ?? SIZES.md;
  const outlined = variant === "outlined" || variant === "outline";
  const interactive = !!onClick && !disabled;

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        gap: s.gap,
        height: s.height,
        padding: `0 ${s.padX}px`,
        borderRadius: 10,
        cornerShape: "round",
        fontSize: s.font,
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
        lineHeight: 1,
        color: c,
        backgroundColor: outlined ? "transparent" : `color-mix(in srgb, ${c} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${c} ${outlined ? "40%" : "22%"}, transparent)`,
        cursor: interactive ? "pointer" : "default",
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
        userSelect: "none",
        ...styleProp,
      }}
    >
      {icon && <span style={{ display: "inline-flex", flexShrink: 0 }}>{icon}</span>}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      {rightIcon && <span style={{ display: "inline-flex", flexShrink: 0 }}>{rightIcon}</span>}
      {onDelete && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onDelete(e);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: s.icon,
            height: s.icon,
            marginRight: -2,
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
        </button>
      )}
    </span>
  );
}

export default TPChip;
