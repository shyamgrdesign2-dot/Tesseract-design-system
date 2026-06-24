"use client";

/**
 * Badge — Status / count indicator atom.
 * Styling: Badge.module.scss (data-variant / data-color selectors).
 *
 * Props:
 *   variant  "solid" | "soft" | "outline" | "gradient" | "dot"   default "soft"
 *            (gradient → white text on a color ramp; color picks the ramp)
 *   color    "primary" | "success" | "warning" | "error" | "neutral" | "violet"
 *   size     "sm" | "md" | "lg"                       default "md"
 *   icon       ReactNode — leading icon (inherits the badge color via currentColor)
 *   rightIcon  ReactNode — trailing icon
 *   sticky     "left" | "right" — squares the corners on that edge so the badge
 *              can sit flush against a container edge
 *   radius     number (px) | string — override the corner radius (default = pill).
 *              0 = sharp rectangle; high values = pill. Configurable, not fixed.
 *   children   label (optional — omit for an icon-only badge; usually data-bound)
 */


import { forwardRef } from "react";
import styles from "./Badge.module.scss";












export const Badge = forwardRef(function Badge({
  variant = "soft",
  color = "primary",
  size = "md",
  icon,
  rightIcon,
  sticky,
  radius,
  children,
  className,
  style: styleProp,
  ...rest
}, ref) {
  // Corner radius is configurable; default falls back to the token in the SCSS.
  const radiusStyle =
    radius != null ? { borderRadius: typeof radius === "number" ? `${radius}px` : radius } : null;
  const mergedStyle = radiusStyle || styleProp ? { ...radiusStyle, ...styleProp } : undefined;

  if (variant === "dot") {
    const cls = [styles.dot, className].filter(Boolean).join(" ");
    return (
      <span
        ref={ref}
        className={cls}
        style={mergedStyle}
        data-color={color}
        data-size={size}
        aria-hidden
        {...rest} />);


  }

  const cls = [styles.badge, className].filter(Boolean).join(" ");
  // Icons inherit the badge's text color via currentColor, so they tint to
  // match the variant/color automatically.
  return (
    <span
      ref={ref}
      className={cls}
      style={mergedStyle}
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-sticky={sticky || undefined}
      {...rest}>

      {icon != null && <span className={styles.icon}>{icon}</span>}
      {children != null && <span>{children}</span>}
      {rightIcon != null && <span className={styles.icon}>{rightIcon}</span>}
    </span>);

});

Badge.displayName = "Badge";
export default Badge;