"use client";

import { forwardRef } from "react";
import { cn } from "../../../hooks/utils";

/**
 * Divider — visual separator atom.
 *
 * variant "solid"    — flat single-color line (default)
 * variant "gradient" — fades to transparent at both ends; colour in the middle.
 *                      Works horizontally and vertically.
 *
 * lineStyle "solid" (default) | "dashed" | "dotted" — switches the rule rendering.
 *   For solid + variant="solid" the line is a filled bar (backgroundColor); for
 *   dashed/dotted it becomes a CSS border so the gaps show through.
 *
 * label + labelPosition "center" (default) | "start" | "end" — horizontal only:
 *   renders the label between two line segments. No label = a plain line (default).
 *
 * inset (number | {start,end}) — indents the line from its ends (px). Default 0.
 */

export const Divider = forwardRef(function Divider({
  orientation = "horizontal",
  variant      = "solid",
  color        = "var(--tesseract-slate-200, #E2E2EA)",
  spacing      = 0,
  thickness    = 1,
  lineStyle    = "solid",
  label,
  labelPosition = "center",
  inset        = 0,
  className,
  style: styleProp,
  ...rest
}, ref) {
  const isH = orientation === "horizontal";

  // Normalise inset → { start, end } in px.
  const insetStart = typeof inset === "object" && inset ? (inset.start ?? 0) : inset;
  const insetEnd   = typeof inset === "object" && inset ? (inset.end ?? 0) : inset;

  // Build the visual line for a given orientation. A solid+filled line uses a
  // background bar; dashed/dotted (or any non-solid lineStyle) uses a CSS border
  // so the gaps render. Gradient keeps the fade and falls back to the bar look.
  const lineEl = (extra) => {
    const sizeStyle = isH
      ? { height: thickness, width: "100%" }
      : { width: thickness, alignSelf: "stretch" };

    let paint;
    if (variant === "gradient") {
      paint = {
        background: isH
          ? `linear-gradient(to right, transparent, ${color} 25%, ${color} 75%, transparent)`
          : `linear-gradient(to bottom, transparent, ${color} 25%, ${color} 75%, transparent)`,
      };
    } else if (lineStyle === "dashed" || lineStyle === "dotted") {
      // Border-based so dashes/dots are visible. Use the leading edge as the rule.
      paint = isH
        ? { height: 0, borderTop: `${thickness}px ${lineStyle} ${color}` }
        : { width: 0, borderLeft: `${thickness}px ${lineStyle} ${color}` };
    } else {
      paint = { backgroundColor: color };
    }

    return {
      flexShrink: 0,
      ...sizeStyle,
      ...paint,
      ...extra,
    };
  };

  // ── Labelled divider (horizontal only) ────────────────────────────────────
  if (label != null && isH) {
    const startFlex = labelPosition === "start" ? 0 : 1;
    const endFlex   = labelPosition === "end" ? 0 : 1;
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        {...rest}
        className={cn(className)}
        style={{
          boxSizing: "border-box",
          fontFamily: "var(--tesseract-font-body)",
          display: "flex",
          alignItems: "center",
          gap: "var(--tesseract-space-3)",
          width: "100%",
          marginTop: spacing,
          marginBottom: spacing,
          paddingLeft: insetStart,
          paddingRight: insetEnd,
          ...styleProp,
        }}
      >
        <div style={lineEl({ flex: startFlex, minWidth: startFlex ? 0 : 0 })} />
        <span
          style={{
            flexShrink: 0,
            fontSize: "var(--tesseract-text-caption-sm)",
            fontWeight: "var(--tesseract-weight-medium)",
            color: "var(--tesseract-slate-600)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <div style={lineEl({ flex: endFlex })} />
      </div>
    );
  }

  // ── Plain line (no label, or vertical) ────────────────────────────────────
  const wrapStyle = isH
    ? {
        marginTop: spacing,
        marginBottom: spacing,
        marginLeft: insetStart,
        marginRight: insetEnd,
      }
    : {
        marginLeft: spacing,
        marginRight: spacing,
        marginTop: insetStart,
        marginBottom: insetEnd,
      };

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      {...rest}
      className={cn(className)}
      style={{ boxSizing: "border-box", fontFamily: "var(--tesseract-font-body)", ...lineEl(), ...wrapStyle, ...styleProp }}
    />
  );
});

Divider.displayName = "Divider";
export default Divider;
