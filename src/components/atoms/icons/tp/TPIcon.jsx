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
 *   variant  "linear" | "bulk" | "bold"    default "linear"
 *            (legacy "solid"→bold, "line"→linear, broken/outline→linear,
 *             twotone/"dual-tone"→bulk are accepted and mapped)
 *   size     number (px, sets width+height)                      default 20
 *   color    any CSS color — icons render in currentColor
 *
 * The icon system uses three styles everywhere — linear / bulk / bold. Legacy
 * style names map onto them so older usages keep working.
 */

import { TP_ICON_REGISTRY, TP_ICON_NAMES } from "./registry";
import { TP_ICON_VARIANTS } from "./constants";

// Legacy / removed styles map onto the three public variants.
const ALIAS = { "dual-tone": "bulk", dualtone: "bulk", "two-tone": "bulk", twotone: "bulk", solid: "bold", line: "linear", broken: "linear", outline: "linear" };
const FALLBACK = { bulk: "linear", bold: "linear" };

const STYLES = TP_ICON_VARIANTS;

export function TPIcon({ name, variant = "linear", size = 20, color, className, style, ...props }) {
  // The icon picker may encode the chosen style as "variant/name"; honour it so
  // a picked style reaches the rendered icon. Explicit `variant` still wins for
  // plain names.
  let resolvedVariant = variant;
  let resolvedName = name;
  if (typeof name === "string") {
    const slash = name.indexOf("/");
    if (slash > 0 && STYLES.includes(name.slice(0, slash))) {
      resolvedVariant = name.slice(0, slash);
      resolvedName = name.slice(slash + 1);
    }
  }
  const entry = TP_ICON_REGISTRY[resolvedName];
  if (!entry) {
    if (typeof console !== "undefined") console.warn(`TPIcon: unknown icon "${resolvedName}"`);
    return null;
  }
  const v = ALIAS[resolvedVariant] || resolvedVariant;
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
export { TP_ICON_NAMES };
export default TPIcon;
