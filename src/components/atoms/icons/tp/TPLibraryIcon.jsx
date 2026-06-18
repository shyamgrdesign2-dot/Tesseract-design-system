"use client";

/**
 * TPLibraryIcon — renders any icon from the Tesseract icon CDN.
 *
 * Icons are served as static SVGs from the design-system CDN:
 *   <base>/<corner>/<style>/<family>/<name>.svg
 * e.g. https://pmdoctorportal.tatvacare.in/tp-icons/rounded/linear/ai/ai-3d-box.svg
 *
 * The family segment is resolved from the icon name via the bundled manifest, so
 * callers only pass a name (+ optional style/corner). The source SVGs are painted
 * white, so they're applied as a CSS mask filled with `currentColor` — every icon
 * tints to the surrounding text colour (or an explicit `color`) regardless of how
 * it was painted. Nothing is bundled; the browser fetches each SVG on demand.
 *
 * Props:
 *   name      icon name (e.g. "search"); also accepts "<style>/<name>" from the picker
 *   variant   "linear" | "bold" | "bulk" | "broken" | "twotone" | "outline" (default "linear")
 *   corner    "rounded" | "straight" (default "rounded")
 *   family    optional explicit family override (else resolved from the manifest)
 *   size      px (default 20)
 *   color     CSS colour (default currentColor)
 *   title     accessible label (otherwise aria-hidden)
 *   className, style
 */

import * as React from "react";
import { getIconBaseUrl } from "./iconBase";
import { iconPath, normStyle } from "./icon-resolve";

export function TPLibraryIcon({
  name,
  variant = "linear",
  corner = "rounded",
  family,
  size = 20,
  color,
  title,
  className,
  style,
  ...rest
}) {
  if (!name) return null;

  // The icon picker encodes the chosen style into the value as "<style>/<name>"
  // (e.g. "bulk/search"); parse it so the picked style reaches the URL without
  // every story threading a separate variant prop.
  let v = variant;
  let n = name;
  const slash = name.indexOf("/");
  if (slash > 0) {
    v = name.slice(0, slash);
    n = name.slice(slash + 1);
  }

  const rel = iconPath({ name: n, style: v, corner, family });
  if (!rel) return null; // unknown name — render nothing rather than a broken box

  const url = `${getIconBaseUrl()}/${rel}`;
  const mask = `url("${url}") no-repeat center / contain`;

  return (
    <span
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      data-tp-icon={`${n}/${normStyle(v)}`}
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
      {...rest}
    />
  );
}

TPLibraryIcon.displayName = "TPLibraryIcon";
export default TPLibraryIcon;
