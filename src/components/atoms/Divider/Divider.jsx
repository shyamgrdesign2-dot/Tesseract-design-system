"use client";

/**
 * Divider — visual separator atom.
 *
 * variant "solid"    — flat single-color line (default)
 * variant "gradient" — fades to transparent at both ends; colour in the middle.
 *                      Works horizontally and vertically.
 */

export function Divider({
  orientation = "horizontal",
  variant      = "solid",
  color        = "var(--tesseract-slate-200, #E2E2EA)",
  spacing      = 0,
  thickness    = 1,
  className,
  style: styleProp,
}) {
  const isH = orientation === "horizontal";

  const sizeStyle = isH
    ? { height: thickness, width: "100%", marginTop: spacing, marginBottom: spacing }
    : { width: thickness, alignSelf: "stretch", marginLeft: spacing, marginRight: spacing };

  const backgroundStyle =
    variant === "gradient"
      ? {
          background: isH
            ? `linear-gradient(to right, transparent, ${color} 25%, ${color} 75%, transparent)`
            : `linear-gradient(to bottom, transparent, ${color} 25%, ${color} 75%, transparent)`,
        }
      : { backgroundColor: color };

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={className}
      style={{ flexShrink: 0, ...sizeStyle, ...backgroundStyle, ...styleProp }}
    />
  );
}

Divider.displayName = "Divider";
export default Divider;
