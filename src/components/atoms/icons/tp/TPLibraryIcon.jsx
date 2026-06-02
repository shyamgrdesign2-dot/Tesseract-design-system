"use client";

/**
 * TPLibraryIcon — renders any icon from the full TP_Icons library (6,769 icons
 * × 6 styles), served as static SVGs from `/tp-icons/<style>/<name>.svg`.
 *
 * The SVG is applied as a CSS mask and filled with `currentColor`, so every
 * icon tints to the surrounding text color regardless of how the source SVG is
 * painted (white stroke / fill / two-tone opacity all map through the mask's
 * alpha). Nothing is bundled — the icons are fetched on demand by the browser.
 *
 * For the curated, hand-tuned set used inside components (Button, Toast, Tabs…)
 * keep using <TPIcon/>. Use this for free-form library browsing / picking.
 *
 * Props:
 *   name      library icon name (see TP_LIBRARY_ICONS / manifest.json)
 *   variant   "linear" | "bold" | "bulk" | "broken" | "outline" | "twotone"  (default "linear")
 *   size      px (default 20)
 *   color     CSS color (default currentColor)
 *   title     accessible label (otherwise aria-hidden)
 *   className, style
 */

import * as React from "react";

const STYLES = ["bold", "broken", "bulk", "linear", "outline", "twotone"];

export function TPLibraryIcon({ name, variant = "linear", size = 20, color, title, className, style }) {
  if (!name) return null;
  const st = STYLES.includes(variant) ? variant : "linear";
  const url = `/tp-icons/${st}/${encodeURIComponent(name)}.svg`;
  const mask = `url("${url}") no-repeat center / contain`;

  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: color || "currentColor",
        WebkitMask: mask,
        mask: mask,
        ...style,
      }}
    />
  );
}

TPLibraryIcon.displayName = "TPLibraryIcon";
export default TPLibraryIcon;
