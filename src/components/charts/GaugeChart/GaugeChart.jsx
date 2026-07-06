"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { polar, formatCompact } from "../internal/lib";

// Open (stroked) arc path with rounded caps — cleaner than a filled donut for a gauge.
function arcStroke(cx, cy, radius, a0, a1) {
  const p0 = polar(cx, cy, radius, a0);
  const p1 = polar(cx, cy, radius, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${p0.x},${p0.y}A${radius},${radius} 0 ${large} 1 ${p1.x},${p1.y}`;
}

/**
 * GaugeChart — a single value against a range (KPI vs target). Zero-dependency
 * (own arc geometry). A rounded arc with a neutral track, a value arc coloured
 * by optional thresholds, a big centre readout, and range labels.
 *
 * Value:   value, min (0), max (100), valueFormat, unit, label, showValue, showRange
 * Arc:     height, arcDegrees (sweep), thickness, rounded
 * Colour:  color, trackColor, segments ([{ upTo, color }] threshold colouring)
 */
export const GaugeChart = React.forwardRef(function GaugeChart(
  {
    value = 0,
    min = 0,
    max = 100,
    height = 180,
    arcDegrees = 240,
    thickness,
    rounded = true,
    color = "var(--tesseract-blue-500)",
    trackColor = "var(--tesseract-slate-100)",
    segments,
    label,
    unit = "",
    valueFormat = (v) => formatCompact(v),
    showValue = true,
    showRange = true,
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const size = height;
  const cx = size / 2;
  const cy = size * 0.52;
  const radius = size * 0.38;
  const tw = thickness ?? Math.max(6, size * 0.08);

  const sweep = (Math.min(300, Math.max(60, arcDegrees)) * Math.PI) / 180;
  const a0 = -sweep / 2;
  const frac = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const aVal = a0 + frac * sweep;

  // value-arc colour: first segment whose upTo ≥ value, else the base color
  let valColor = color;
  if (Array.isArray(segments) && segments.length) {
    const sorted = [...segments].sort((p, q) => p.upTo - q.upTo);
    valColor = (sorted.find((s) => value <= s.upTo) || sorted[sorted.length - 1]).color;
  }

  const endL = polar(cx, cy, radius, a0);
  const endR = polar(cx, cy, radius, a0 + sweep);

  return (
    <div ref={ref} className={cn(className) || undefined} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", fontFamily: "var(--tesseract-font-body)", ...style }} {...rest}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" style={{ display: "block", overflow: "visible" }}>
          <path d={arcStroke(cx, cy, radius, a0, a0 + sweep)} fill="none" stroke={trackColor} strokeWidth={tw} strokeLinecap={rounded ? "round" : "butt"} />
          {frac > 0.001 && <path d={arcStroke(cx, cy, radius, a0, aVal)} fill="none" stroke={valColor} strokeWidth={tw} strokeLinecap={rounded ? "round" : "butt"} />}
        </svg>

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {showValue && (
            <div style={{ fontSize: size * 0.2, fontWeight: 700, color: "var(--tesseract-fg-heading)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {valueFormat(value)}
              {unit && <span style={{ fontSize: size * 0.1, fontWeight: 600, color: "var(--tesseract-fg-tertiary)" }}>{unit}</span>}
            </div>
          )}
          {label && <div style={{ fontSize: 12, color: "var(--tesseract-fg-tertiary)", marginTop: 4 }}>{label}</div>}
        </div>

        {showRange && (
          <>
            <span style={{ position: "absolute", left: endL.x, top: endL.y + 6, transform: "translate(-50%,0)", fontSize: 11, color: "var(--tesseract-fg-tertiary)", fontVariantNumeric: "tabular-nums" }}>{valueFormat(min)}</span>
            <span style={{ position: "absolute", left: endR.x, top: endR.y + 6, transform: "translate(-50%,0)", fontSize: 11, color: "var(--tesseract-fg-tertiary)", fontVariantNumeric: "tabular-nums" }}>{valueFormat(max)}</span>
          </>
        )}
      </div>
    </div>
  );
});

GaugeChart.displayName = "GaugeChart";
