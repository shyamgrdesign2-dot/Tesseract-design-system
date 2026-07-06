"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { arcPath, sum, formatCompact, seriesColor } from "../internal/lib";
import { TooltipCard } from "../internal/primitives";

/**
 * DonutChart — part-to-whole composition. Zero-dependency (own arc geometry).
 * A donut (or full pie when innerRadius=0) with a center total, hover-to-expand
 * slices, an interactive tooltip, and a legend listing value + %.
 *
 * Props:
 *   data         [{ label, value, color? }]
 *   height       number (default 240) — the ring is square at this size
 *   innerRadius  0..0.9 hole fraction (default 0.62; 0 → full pie)
 *   centerLabel  string — caption under the center total (donut only)
 *   showCenter   boolean (default true for donut) — total in the hole
 *   showLegend / showTooltip   booleans; legend  "right" | "bottom" | "none"
 *   colors       palette override; valueFormat  (v)=>string
 */
export const DonutChart = React.forwardRef(function DonutChart(
  {
    data = [],
    height = 240,
    innerRadius = 0.62,
    centerLabel,
    showCenter = true,
    legend = "right",
    showTooltip = true,
    colors,
    valueFormat = formatCompact,
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const [hover, setHover] = React.useState(null);
  const slices = data.map((d, i) => ({ label: d.label, value: Number(d.value) || 0, color: d.color ?? seriesColor(i, colors) }));
  const total = sum(slices, (s) => s.value);

  const size = height;
  const cx = size / 2;
  const cy = size / 2;
  const pad = 8;
  const rOuter = size / 2 - pad;
  const rInner = Math.max(0, innerRadius) * rOuter;
  const isDonut = rInner > 0;

  let acc = 0;
  const arcs = slices.map((s) => {
    const a0 = total > 0 ? (acc / total) * Math.PI * 2 : 0;
    acc += s.value;
    const a1 = total > 0 ? (acc / total) * Math.PI * 2 : 0;
    return { ...s, a0, a1, pct: total > 0 ? s.value / total : 0 };
  });

  const centerValue = hover != null ? arcs[hover].value : total;
  const centerCaption = hover != null ? arcs[hover].label : centerLabel ?? "Total";

  return (
    <div
      ref={ref}
      className={cn(className) || undefined}
      style={{
        display: "flex",
        flexDirection: legend === "bottom" ? "column" : "row",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
        fontFamily: "var(--tesseract-font-body)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" style={{ display: "block" }}>
          {arcs.map((a, i) => {
            if (a.a1 - a.a0 <= 0) return null;
            const r = hover === i ? rOuter + 4 : rOuter;
            return (
              <path
                key={i}
                d={arcPath(cx, cy, r, rInner, a.a0, a.a1)}
                fill={a.color}
                stroke="var(--tesseract-bg-surface)"
                strokeWidth={2}
                opacity={hover == null || hover === i ? 1 : 0.5}
                style={{ transition: "opacity 120ms", cursor: "pointer" }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}
        </svg>

        {isDonut && showCenter && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--tesseract-fg-heading)", lineHeight: 1.1 }}>
              {valueFormat(centerValue)}
            </div>
            <div style={{ fontSize: 11, color: "var(--tesseract-fg-tertiary)", marginTop: 2, maxWidth: rInner * 1.7, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {centerCaption}
            </div>
          </div>
        )}

        {!isDonut && showTooltip && hover != null && (
          <TooltipCard
            x={cx}
            y={cy}
            containerWidth={size}
            rows={[{ color: arcs[hover].color, label: arcs[hover].label, value: `${valueFormat(arcs[hover].value)} · ${Math.round(arcs[hover].pct * 100)}%` }]}
          />
        )}
      </div>

      {legend !== "none" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 140, flex: legend === "bottom" ? undefined : 1 }}>
          {arcs.map((a, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: 0,
                padding: "2px 0",
                cursor: "default",
                textAlign: "left",
                opacity: hover == null || hover === i ? 1 : 0.5,
                transition: "opacity 120ms",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: 3, background: a.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--tesseract-fg-secondary)", marginRight: "auto" }}>{a.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--tesseract-fg-primary)" }}>{valueFormat(a.value)}</span>
              <span style={{ fontSize: 11, color: "var(--tesseract-fg-tertiary)", width: 34, textAlign: "right" }}>{Math.round(a.pct * 100)}%</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

DonutChart.displayName = "DonutChart";

/** PieChart — DonutChart with no hole (full pie). */
export const PieChart = React.forwardRef(function PieChart(props, ref) {
  return <DonutChart ref={ref} innerRadius={0} showCenter={false} {...props} />;
});
PieChart.displayName = "PieChart";
