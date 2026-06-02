"use client";

/**
 * TPIcon — single entry point to the vendored TP_Icons set
 * (github:shyamgrdesign2-dot/TP_Icons). One icon, six styles.
 *
 *   <TPIcon name="search" variant="linear" size={20} />
 *   <TPIcon name="warning" variant="bulk" color="var(--tp-warning-500)" />
 *
 * Props:
 *   name     icon name (see TP_ICON_NAMES)
 *   variant  "bold" | "broken" | "bulk" | "linear" | "outline" | "twotone"
 *            (aliases: "dual-tone" / "dualtone" → "twotone")    default "linear"
 *   size     number (px, sets width+height)                      default 20
 *   color    any CSS color — icons render in currentColor
 *
 * Icons render with currentColor, so they inherit text color by default.
 * TP medical icons ship only 3 styles (linear/bulk/bold); missing styles
 * fall back gracefully.
 */

import { TP_ICON_REGISTRY, TP_ICON_NAMES, TP_ICON_VARIANTS } from "./registry";

const ALIAS = { "dual-tone": "twotone", dualtone: "twotone", "two-tone": "twotone" };
const FALLBACK = { broken: "linear", outline: "linear", twotone: "bulk", bold: "linear", bulk: "linear" };

export function TPIcon({ name, variant = "linear", size = 20, color, className, style, ...props }) {
  const entry = TP_ICON_REGISTRY[name];
  if (!entry) {
    if (typeof console !== "undefined") console.warn(`TPIcon: unknown icon "${name}"`);
    return null;
  }
  const v = ALIAS[variant] || variant;
  const Comp =
    entry[v] || entry[FALLBACK[v]] || entry.linear || entry.bold || Object.values(entry)[0];
  if (!Comp) return null;

  return (
    <Comp
      width={size}
      height={size}
      color={color}
      className={className}
      style={style}
      aria-hidden
      focusable={false}
      {...props}
    />
  );
}

TPIcon.displayName = "TPIcon";
export { TP_ICON_NAMES, TP_ICON_VARIANTS };
export default TPIcon;
