"use client";

/**
 * Avatar — user/profile mark. Three content types:
 *   • image   — pass `src`
 *   • initials — pass `name` (first+last initials; single name → first two letters)
 *   • icon    — pass `icon` (a Tesseract library icon NAME or a ReactNode)
 * Resolution order: icon → image → initials.
 *
 * Props:
 *   src      image URL (falls back to initials if it fails to load)
 *   name     used for alt + the initials fallback
 *   icon     Tesseract library icon name (string) or a ReactNode
 *   size     px                                              default 40
 *   shape    "circle" (default) | "rounded" | "square"
 *   radius   number | "pill" | "sharp" | string — overrides the shape radius
 *   color    "slate" (default) | "primary" | "success" | "warning" | "error" | "violet"
 *   status   "online" | "offline" | "away" | "busy" | ReactNode — corner status dot
 *   ring     boolean (brand gradient ring) | CSS string (custom ring)
 *   onClick  when set, renders as a <button>
 *   className, style
 *
 * Defaults preserve the original look: circle shape, slate colour, no status,
 * the brand amber→orange ring (now token-only).
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { resolveRadius, cn } from "@/src/hooks/utils";

// Component-local brand gradient — token-only (was raw `linear-gradient(#ffde00, #fd5900)`).
// amber-400 (#FED15E) → warning-600 (#D97706) is the nearest token ramp.
const DEFAULT_RING =
  "linear-gradient(var(--tesseract-amber-400, #FED15E), var(--tesseract-warning-600, #D97706))";

// shape → borderRadius token. `circle` keeps the original "50%".
const SHAPE_RADIUS = {
  circle: "50%",
  rounded: "var(--tesseract-radius-12, 12px)",
  square: "var(--tesseract-radius-4, 4px)",
};

// color → { bg (—100), fg (—600) }. `slate` keeps the original slate-100 / slate-600.
const COLOR_TOKENS = {
  slate: { bg: "var(--tesseract-slate-100, #f1f1f5)", fg: "var(--tesseract-slate-600, #545460)" },
  primary: { bg: "var(--tesseract-primary-100)", fg: "var(--tesseract-primary-600)" },
  success: { bg: "var(--tesseract-success-100)", fg: "var(--tesseract-success-600)" },
  warning: { bg: "var(--tesseract-warning-100)", fg: "var(--tesseract-warning-600)" },
  error: { bg: "var(--tesseract-error-100)", fg: "var(--tesseract-error-600)" },
  violet: { bg: "var(--tesseract-violet-100)", fg: "var(--tesseract-violet-600)" },
};

// Built-in status presets → dot colour. A ReactNode `status` is rendered as-is instead.
const STATUS_COLORS = {
  online: "var(--tesseract-success-500, #10B981)",
  offline: "var(--tesseract-slate-400, #A2A2A8)",
  away: "var(--tesseract-warning-500, #F59E0B)",
  busy: "var(--tesseract-error-500, #E11D48)",
};

// Initials: first letter of the first + last name; a single name → its first two
// letters. e.g. "Ramesh Kumar" → "RK", "Ramesh" → "RA".
function initialsOf(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar = React.forwardRef(function Avatar({
  src,
  name,
  alt,
  icon,
  size = 40,
  shape = "circle",
  radius,
  color = "slate",
  status,
  ring = false,
  onClick,
  className,
  style,
  ...rest
}, ref) {
  const [broken, setBroken] = React.useState(false);
  const ringBg = ring ? (typeof ring === "string" ? ring : DEFAULT_RING) : undefined;
  const Tag = onClick ? "button" : "span";

  // radius prop overrides the shape radius when provided.
  const borderRadius = resolveRadius(radius) ?? (SHAPE_RADIUS[shape] || SHAPE_RADIUS.circle);
  const corner = { borderRadius, cornerShape: "round" };
  const palette = COLOR_TOKENS[color] || COLOR_TOKENS.slate;

  let content;
  if (icon != null) {
    content = typeof icon === "string"
      ? <TPLibraryIcon name={icon} size={Math.round(size * 0.5)} color={palette.fg} />
      : icon;
  } else if (src && !broken) {
    content = <img src={src} alt={alt || name || "User"} onError={() => setBroken(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  } else {
    content = initialsOf(name);
  }

  // Status dot — built-in preset (coloured dot) or a custom ReactNode.
  let statusNode = null;
  if (status != null) {
    const isPreset = typeof status === "string" && status in STATUS_COLORS;
    const dot = Math.max(8, Math.round(size * 0.28));
    statusNode = (
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: isPreset ? dot : undefined,
          height: isPreset ? dot : undefined,
          borderRadius: "50%",
          background: isPreset ? STATUS_COLORS[status] : "transparent",
          border: isPreset ? "2px solid var(--tesseract-slate-0, #fff)" : "none",
          boxSizing: "border-box",
        }}
      >
        {isPreset ? null : status}
      </span>
    );
  }

  return (
    <Tag
      ref={ref}
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? (name || "Profile") : undefined}
      className={cn(className)}
      {...rest}
      style={{
        boxSizing: "border-box",
        position: "relative",
        ...corner,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        padding: ring ? "var(--tesseract-space-0-5)" : 0,
        border: "none",
        background: ringBg || "transparent",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <span
        style={{
          boxSizing: "border-box",
          ...corner,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          border: ring ? "1px solid var(--tesseract-slate-0, #fff)" : "none",
          background: palette.bg,
          color: palette.fg,
          fontFamily: "var(--tesseract-font-body)",
          fontWeight: "var(--tesseract-weight-extrabold)",
          fontSize: Math.round(size * 0.36),
          lineHeight: 1,
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        {content}
      </span>
      {statusNode}
    </Tag>
  );
});

Avatar.displayName = "Avatar";
export default Avatar;
