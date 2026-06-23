"use client";

/**
 * TPIcon — single entry point for component icons. Now CDN-backed.
 *
 *   <TPIcon name="search" variant="linear" size={20} />
 *   <TPIcon name="warning" variant="bulk" color="var(--tesseract-warning-500)" />
 *
 * Icons resolve from the Tesseract icon CDN via <TPLibraryIcon/> (one icon,
 * six styles, served from `<base>/<corner>/<style>/<family>/<name>.svg`). A small
 * set of app-specific icons that aren't in the catalog (e.g. appt-type,
 * patient-gender) fall back to the vendored inline-SVG components so nothing
 * breaks. Icons render in `currentColor` either way.
 *
 * Props:
 *   name     icon name (see TP_ICON_NAMES); also accepts "<style>/<name>"
 *   variant  "linear" | "bold" | "bulk" | "broken" | "twotone" | "outline"  default "linear"
 *            (legacy "solid"→bold, "line"→linear, "dual-tone"→bulk accepted)
 *   corner   "rounded" | "straight"   default "rounded"
 *   size     number (px)              default 20
 *   color    any CSS color
 */

import { TPLibraryIcon } from "./TPLibraryIcon";
import { hasIcon, ICON_STYLES } from "./icon-resolve";
import { TP_ICON_REGISTRY, TP_ICON_NAMES } from "./registry";

// Legacy / removed styles map onto catalog variants (used by the vendored fallback).
const ALIAS = { "dual-tone": "bulk", dualtone: "bulk", "two-tone": "bulk", twotone: "bulk", solid: "bold", line: "linear", broken: "linear", outline: "linear" };
const FALLBACK = { bulk: "linear", bold: "linear" };

export function TPIcon({ name, variant = "linear", corner = "rounded", size = 20, color, className, style, ...props }) {
  // The picker may encode the chosen style as "<style>/<name>"; honour it.
  let v = variant;
  let n = name;
  if (typeof name === "string") {
    const slash = name.indexOf("/");
    if (slash > 0 && ICON_STYLES.includes(name.slice(0, slash))) {
      v = name.slice(0, slash);
      n = name.slice(slash + 1);
    }
  }

  // Catalog icon → load from the CDN (themed via currentColor mask).
  if (hasIcon(n)) {
    return <TPLibraryIcon name={n} variant={v} corner={corner} size={size} color={color} className={className} style={style} />;
  }

  // App-specific icons not in the catalog → vendored inline SVG fallback.
  const entry = TP_ICON_REGISTRY[n];
  if (!entry) {
    if (typeof console !== "undefined") console.warn(`TPIcon: unknown icon "${n}"`);
    return null;
  }
  const av = ALIAS[v] || v;
  const Comp = entry[av] || entry[FALLBACK[av]] || entry.linear || entry.bold || Object.values(entry)[0];
  if (!Comp) return null;
  return <Comp width={size} height={size} color={color} className={className} style={style} aria-hidden focusable={false} {...props} />;
}

TPIcon.displayName = "TPIcon";
export { TP_ICON_NAMES };
export default TPIcon;
