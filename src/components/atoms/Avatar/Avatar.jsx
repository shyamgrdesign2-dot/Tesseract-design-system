"use client";

/**
 * Avatar — user/profile image atom with an initial fallback and an optional
 * gradient ring. In-house, no deps.
 *
 * Props:
 *   src      image URL (falls back to the name's initial when absent/broken)
 *   name     used for the alt text + initial fallback
 *   size     px                                              default 40
 *   shape    "circle" | "square"                            default "circle"
 *   ring     boolean (brand gradient ring) | CSS string (custom ring)
 *   onClick  when set, renders as a <button>
 *   className, style
 */

import * as React from "react";

const DEFAULT_RING = "linear-gradient(#ffde00, #fd5900)";

export function Avatar({ src, name, alt, size = 40, shape = "circle", ring = false, onClick, className, style }) {
  const [broken, setBroken] = React.useState(false);
  const radius = shape === "square" ? Math.round(size * 0.28) : "50%";
  const showImg = src && !broken;
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";

  const ringBg = ring ? (typeof ring === "string" ? ring : DEFAULT_RING) : undefined;
  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? (name || "Profile") : undefined}
      className={className}
      style={{
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        padding: ring ? 2 : 0,
        border: "none",
        borderRadius: radius,
        cornerShape: "round",
        background: ringBg || "transparent",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <span
        style={{
          boxSizing: "border-box",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: radius,
          border: ring ? "1px solid var(--tp-slate-0, #fff)" : "none",
          background: "var(--tp-slate-100, #f1f1f5)",
          color: "var(--tp-slate-600, #717179)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: Math.round(size * 0.4),
        }}
      >
        {showImg
          ? <img src={src} alt={alt || name || "User"} onError={() => setBroken(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : initial}
      </span>
    </Tag>
  );
}

Avatar.displayName = "Avatar";
export default Avatar;
