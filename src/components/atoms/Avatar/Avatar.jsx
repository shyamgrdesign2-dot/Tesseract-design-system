"use client";

/**
 * Avatar — always-circular user/profile mark. Three content types:
 *   • image   — pass `src`
 *   • initials — pass `name` (first+last initials; single name → first two letters)
 *   • icon    — pass `icon` (a TP library icon NAME or a ReactNode)
 * Resolution order: icon → image → initials.
 *
 * Props:
 *   src      image URL (falls back to initials if it fails to load)
 *   name     used for alt + the initials fallback
 *   icon     TP library icon name (string) or a ReactNode
 *   size     px                                              default 40
 *   ring     boolean (brand gradient ring) | CSS string (custom ring)
 *   onClick  when set, renders as a <button>
 *   className, style
 *
 * The avatar is ALWAYS circular (no square variant).
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";

const DEFAULT_RING = "linear-gradient(#ffde00, #fd5900)";
const CIRCLE = { borderRadius: "50%", cornerShape: "round" };

// Initials: first letter of the first + last name; a single name → its first two
// letters. e.g. "Ramesh Kumar" → "RK", "Ramesh" → "RA".
function initialsOf(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ src, name, alt, icon, size = 40, ring = false, onClick, className, style }) {
  const [broken, setBroken] = React.useState(false);
  const ringBg = ring ? (typeof ring === "string" ? ring : DEFAULT_RING) : undefined;
  const Tag = onClick ? "button" : "span";

  let content;
  if (icon != null) {
    content = typeof icon === "string"
      ? <TPLibraryIcon name={icon} size={Math.round(size * 0.5)} color="var(--tp-slate-600, #717179)" />
      : icon;
  } else if (src && !broken) {
    content = <img src={src} alt={alt || name || "User"} onError={() => setBroken(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  } else {
    content = initialsOf(name);
  }

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? (name || "Profile") : undefined}
      className={className}
      style={{
        boxSizing: "border-box",
        ...CIRCLE,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        padding: ring ? 2 : 0,
        border: "none",
        background: ringBg || "transparent",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <span
        style={{
          boxSizing: "border-box",
          ...CIRCLE,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: ring ? "1px solid var(--tp-slate-0, #fff)" : "none",
          background: "var(--tp-slate-100, #f1f1f5)",
          color: "var(--tp-slate-600, #717179)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: Math.round(size * 0.4),
        }}
      >
        {content}
      </span>
    </Tag>
  );
}

Avatar.displayName = "Avatar";
export default Avatar;
