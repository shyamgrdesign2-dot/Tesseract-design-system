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
import { tpMedicalIconRegistry } from "@/src/components/atoms/MedicalIcon/registry";

const STYLES = ["bold", "broken", "bulk", "linear", "outline", "twotone"];
// The medical set ships 3 styles; map the 6 library variants onto them so a
// medical icon picked from the unified search still honours the chosen variant.
const MED_STYLE = { linear: "line", outline: "line", broken: "line", bulk: "bulk", twotone: "bulk", bold: "solid" };

export function TPLibraryIcon({ name, variant = "linear", size = 20, color, title, className, style }) {
  if (!name) return null;
  // Unified namespace: medical icons resolve from /icons/medical/, everything
  // else from the full /tp-icons/ library — one searchable, pickable set.
  const med = tpMedicalIconRegistry[name];
  const url = med
    ? (med[MED_STYLE[variant] || "line"] || med.line)
    : `/tp-icons/${STYLES.includes(variant) ? variant : "linear"}/${encodeURIComponent(name)}.svg`;
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
