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
 *   children   label
 */


import styles from "./Badge.module.scss";












export function Badge({
  variant = "soft",
  color = "primary",
  size = "md",
  icon,
  rightIcon,
  sticky,
  children,
  className,
  style: styleProp
}) {
  if (variant === "dot") {
    const cls = [styles.dot, className].filter(Boolean).join(" ");
    return (
      <span
        className={cls}
        style={styleProp}
        data-color={color}
        data-size={size}
        aria-hidden />);


  }

  const cls = [styles.badge, className].filter(Boolean).join(" ");
  // Icons inherit the badge's text color via currentColor, so they tint to
  // match the variant/color automatically.
  return (
    <span
      className={cls}
      style={styleProp}
      data-variant={variant}
      data-color={color}
      data-size={size}
      data-sticky={sticky || undefined}>

      {icon != null && <span className={styles.icon}>{icon}</span>}
      {children != null && <span>{children}</span>}
      {rightIcon != null && <span className={styles.icon}>{rightIcon}</span>}
    </span>);

}

Badge.displayName = "Badge";
export default Badge;