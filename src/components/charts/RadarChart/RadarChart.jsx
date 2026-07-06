"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { seriesColor, formatCompact, maxOf, niceTicks, polar } from "../internal/lib";
import { ChartLegend, TooltipCard } from "../internal/primitives";

function normSeries(series, colors) {
  return (series || []).map((s, i) => {
    const spec = typeof s === "string" ? { key: s } : s;
    return { key: spec.key, label: spec.label ?? spec.key, color: spec.color ?? seriesColor(i, colors) };
  });
}

/**
 * RadarChart — multi-variable comparison across 3+ axes. Zero-dependency
 * (pure SVG + own polar geometry). One polygon per series over a shared set of
 * axes; grid rings, axis labels, hover tooltip per axis, legend toggle.
 *
 * Data:   data (one row per axis) + axisKey; series (string | {key,label?,color?})[]
 * Scale:  max (auto), levels (grid rings)
 * Shape:  fillOpacity, strokeWidth, dot
 * Chrome: showGrid, showAxisLabels, showLegend, showTooltip, legendAlign
 * Misc:   height (square), colors[], valueFormat
 */
export const RadarChart = React.forwardRef(function RadarChart(
  {
    data = [],
    axisKey = "axis",
    series = [],
    height = 300,
    max,
    levels = 4,
    fillOpacity = 0.15,
    strokeWidth = 2,
    dot = true,
    showGrid = true,
    showAxisLabels = true,
    showLegend = true,
    showTooltip = true,
    legendAlign = "center",
    colors,
    valueFormat = formatCompact,
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const specs = normSeries(series, colors);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [hoverAxis, setHoverAxis] = React.useState(null);
  const active = specs.filter((s) => !hidden.has(s.key));

  const axes = data.map((r) => r[axisKey]);
  const n = axes.length;
  const size = height;
  const cx = size / 2;
  const cy = size / 2;
  const pad = 46;
  const r = Math.max(10, size / 2 - pad);

  const rawMax = maxOf(data.flatMap((row) => active.map((s) => Number(row[s.key]))));
  const maxVal = max != null ? max : niceTicks(0, rawMax || 1, levels).niceMax;
  const angleAt = (i) => (i / Math.max(1, n)) * Math.PI * 2;
  const pointAt = (i, value) => polar(cx, cy, (Math.max(0, Number(value)) / maxVal) * r, angleAt(i));

  const polygon = (getVal) => (n ? axes.map((_, i) => { const p = pointAt(i, getVal(i)); return `${p.x},${p.y}`; }).join(" ") : "");

  const toggle = (idx) => {
    const key = specs[idx].key;
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < specs.length - 1) next.add(key);
      return next;
    });
  };

  const onMove = (e) => {
    if (!showTooltip || !n) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    if (Math.hypot(dx, dy) < r * 0.12) return setHoverAxis(null);
    let a = Math.atan2(dx, -dy); // 0 at top, clockwise
    if (a < 0) a += Math.PI * 2;
    setHoverAxis(Math.round(a / (Math.PI * 2 / n)) % n);
  };

  const hoverPt = hoverAxis != null ? polar(cx, cy, r + 4, angleAt(hoverAxis)) : null;

  return (
    <div ref={ref} className={cn(className) || undefined} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: "var(--tesseract-font-body)", ...style }} {...rest}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" style={{ display: "block", overflow: "visible" }}>
          {showGrid && (
            <g pointerEvents="none">
              {Array.from({ length: levels }, (_, l) => {
                const rr = ((l + 1) / levels) * r;
                const pts = axes.map((_, i) => { const p = polar(cx, cy, rr, angleAt(i)); return `${p.x},${p.y}`; }).join(" ");
                return <polygon key={l} points={pts} fill="none" stroke="var(--tesseract-border-soft)" strokeWidth={1} />;
              })}
              {axes.map((_, i) => { const p = polar(cx, cy, r, angleAt(i)); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={hoverAxis === i ? "var(--tesseract-border-strong)" : "var(--tesseract-border-soft)"} strokeWidth={1} />; })}
            </g>
          )}

          {active.map((s) => (
            <g key={s.key}>
              <polygon points={polygon((i) => data[i][s.key])} fill={s.color} fillOpacity={fillOpacity} stroke={s.color} strokeWidth={strokeWidth} strokeLinejoin="round" />
              {dot && axes.map((_, i) => { const p = pointAt(i, data[i][s.key]); return <circle key={i} cx={p.x} cy={p.y} r={3} fill={s.color} stroke="var(--tesseract-bg-surface)" strokeWidth={1.5} />; })}
            </g>
          ))}

          {showAxisLabels && axes.map((axis, i) => {
            const p = polar(cx, cy, r + 18, angleAt(i));
            const anchor = Math.abs(p.x - cx) < 2 ? "middle" : p.x > cx ? "start" : "end";
            return <text key={i} x={p.x} y={p.y + 4} textAnchor={anchor} style={{ fontSize: 11, fill: hoverAxis === i ? "var(--tesseract-fg-secondary)" : "var(--tesseract-fg-tertiary)", fontFamily: "var(--tesseract-font-body)", fontWeight: hoverAxis === i ? 600 : 400 }}>{axis}</text>;
          })}

          <rect x={0} y={0} width={size} height={size} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHoverAxis(null)} />
        </svg>

        {showTooltip && hoverAxis != null && hoverPt && (
          <TooltipCard x={hoverPt.x} y={hoverPt.y} containerWidth={size} title={axes[hoverAxis]} rows={active.map((s) => ({ color: s.color, label: s.label, value: valueFormat(Number(data[hoverAxis][s.key])) }))} />
        )}
      </div>

      {showLegend && specs.length > 0 && (
        <ChartLegend items={specs.map((s) => ({ label: s.label, color: s.color, hidden: hidden.has(s.key) }))} onToggle={toggle} align={legendAlign} />
      )}
    </div>
  );
});

RadarChart.displayName = "RadarChart";
