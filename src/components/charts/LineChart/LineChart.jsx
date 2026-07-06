"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import {
  scaleLinear,
  niceTicks,
  linePath,
  smoothPath,
  areaPath,
  extent,
  formatCompact,
  seriesColor,
  MARGINS,
  downloadCSV,
} from "../internal/lib";
import { useElementWidth, useZoomPan } from "../internal/hooks";
import { GridLines, AxisLeft, AxisBottom, ChartLegend, ChartToolbar, TooltipCard } from "../internal/primitives";

// Normalise `series` — accepts ["a","b"] or [{key,label,color}] — to full specs.
function normSeries(series, colors) {
  return (series || []).map((s, i) => {
    const spec = typeof s === "string" ? { key: s } : s;
    return { key: spec.key, label: spec.label ?? spec.key, color: spec.color ?? seriesColor(i, colors) };
  });
}

/**
 * LineChart — multi-series time/trend chart. Zero-dependency (pure SVG + own
 * scales/curves). Straight or smooth curves, optional area fill and markers,
 * gridlines, an interactive tooltip crosshair, a click-to-toggle legend, and
 * optional wheel/drag zoom + pan with a toolbar (incl. CSV export).
 *
 * Props:
 *   data       array of row objects (e.g. [{ x:"Mon", visits:12, walkins:4 }])
 *   xKey       string     the category/time key on each row (default "x")
 *   series     (string | {key,label?,color?})[]   the value series to plot
 *   height     number     chart height in px (default 260); width is responsive
 *   curve      "smooth" | "linear"   (default "smooth")
 *   area       boolean    fill under the line (default false)
 *   markers    boolean    dots at each point (default false)
 *   showGrid / showLegend / showTooltip / showToolbar   booleans (default true)
 *   zoomable   boolean    wheel-zoom + drag-pan on the x-axis (default false)
 *   colors     string[]   override the series palette (tokens)
 *   yFormat / xFormat   (v) => string   tick + tooltip formatters
 */
export const LineChart = React.forwardRef(function LineChart(
  {
    data = [],
    xKey = "x",
    series = [],
    height = 260,
    curve = "smooth",
    area = false,
    markers = false,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    showToolbar = false,
    zoomable = false,
    colors,
    yFormat = formatCompact,
    xFormat = (v) => v,
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const [wrapRef, width] = useElementWidth();
  const clipId = React.useId();
  const specs = normSeries(series, colors);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [hover, setHover] = React.useState(null); // index
  const zp = useZoomPan(zoomable);

  const active = specs.filter((s) => !hidden.has(s.key));
  const n = data.length;
  const smooth = curve === "smooth";

  const m = MARGINS;
  const plot = {
    x: m.left,
    y: m.top,
    w: Math.max(10, width - m.left - m.right),
    h: Math.max(10, height - m.top - m.bottom),
  };

  // y-domain from the visible/active series
  const vals = [];
  for (const s of active) for (const row of data) vals.push(Number(row[s.key]));
  const [dmin, dmax] = extent(vals);
  const { ticks: yTickVals, niceMin, niceMax } = niceTicks(Math.min(dmin, 0), dmax, 5);
  const yScale = scaleLinear([niceMin, niceMax], [plot.y + plot.h, plot.y]);
  const baseY = yScale(Math.max(niceMin, 0));

  // x position of a data index under the current zoom window
  const frac = (i) => (n <= 1 ? 0.5 : i / (n - 1));
  const xAt = (i) => plot.x + ((frac(i) - zp.win.lo) / (zp.win.hi - zp.win.lo)) * plot.w;

  const yTicks = yTickVals.map((value) => ({ value, y: yScale(value) }));

  // x-axis labels — ~6 evenly across the visible index range
  const i0 = Math.max(0, Math.floor(zp.win.lo * (n - 1)));
  const i1 = Math.min(n - 1, Math.ceil(zp.win.hi * (n - 1)));
  const visCount = Math.max(1, i1 - i0);
  const xStep = Math.max(1, Math.round(visCount / 6));
  const xTicks = [];
  for (let i = i0; i <= i1; i += xStep) xTicks.push({ value: xFormat(data[i]?.[xKey]), x: xAt(i) });

  const pointsFor = (s) => data.map((row, i) => ({ x: xAt(i), y: yScale(Number(row[s.key])), i, v: Number(row[s.key]) }));

  const onMove = (e) => {
    if (!showTooltip || !n) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const fx = zp.win.lo + ((mx - plot.x) / plot.w) * (zp.win.hi - zp.win.lo);
    const i = Math.max(0, Math.min(n - 1, Math.round(fx * (n - 1))));
    setHover(i);
  };
  const onLeave = () => setHover(null);

  const toggle = (idx) => {
    const key = specs[idx].key;
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < specs.length - 1) next.add(key); // keep ≥1 series
      return next;
    });
  };

  const exportCSV = () => {
    const header = [xKey, ...specs.map((s) => s.label)];
    const rows = data.map((row) => [row[xKey], ...specs.map((s) => row[s.key])]);
    downloadCSV("linechart.csv", [header, ...rows]);
  };

  const hoverX = hover != null ? xAt(hover) : null;

  return (
    <div ref={ref} className={cn(className) || undefined} style={{ fontFamily: "var(--tesseract-font-body)", ...style }} {...rest}>
      {showToolbar && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <ChartToolbar zoomable={zoomable} onZoomIn={zp.zoomIn} onZoomOut={zp.zoomOut} onReset={zp.reset} onExport={exportCSV} />
        </div>
      )}

      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" style={{ display: "block", touchAction: zoomable ? "none" : undefined }}>
          <defs>
            <clipPath id={clipId}>
              <rect x={plot.x} y={plot.y - 4} width={plot.w} height={plot.h + 8} />
            </clipPath>
          </defs>

          {showGrid && <GridLines x={plot.x} y={plot.y} w={plot.w} h={plot.h} yTicks={yTicks} />}
          {/* baseline / x-axis line */}
          <line x1={plot.x} x2={plot.x + plot.w} y1={plot.y + plot.h} y2={plot.y + plot.h} stroke="var(--tesseract-border-neutral)" strokeWidth={1} />

          <g clipPath={`url(#${clipId})`}>
            {active.map((s) => {
              const pts = pointsFor(s);
              return (
                <g key={s.key}>
                  {area && <path d={areaPath(pts, baseY, smooth)} fill={s.color} fillOpacity={0.14} stroke="none" />}
                  <path d={smooth ? smoothPath(pts) : linePath(pts)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  {markers && pts.map((p) => <circle key={p.i} cx={p.x} cy={p.y} r={2.5} fill="var(--tesseract-bg-surface)" stroke={s.color} strokeWidth={1.5} />)}
                </g>
              );
            })}

            {/* hover crosshair + focus dots */}
            {hover != null && hoverX != null && (
              <g pointerEvents="none">
                <line x1={hoverX} x2={hoverX} y1={plot.y} y2={plot.y + plot.h} stroke="var(--tesseract-border-strong)" strokeWidth={1} strokeDasharray="3 3" />
                {active.map((s) => (
                  <circle key={s.key} cx={hoverX} cy={yScale(Number(data[hover][s.key]))} r={3.5} fill={s.color} stroke="var(--tesseract-bg-surface)" strokeWidth={1.5} />
                ))}
              </g>
            )}
          </g>

          <AxisLeft x={plot.x} ticks={yTicks} format={yFormat} />
          <AxisBottom y={plot.y + plot.h} ticks={xTicks} />

          {/* pointer surface: hover + zoom/pan */}
          <rect
            x={plot.x}
            y={plot.y}
            width={plot.w}
            height={plot.h}
            fill="transparent"
            style={{ cursor: zoomable ? "grab" : "crosshair" }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            {...zp.handlers}
          />
        </svg>

        {showTooltip && hover != null && hoverX != null && (
          <TooltipCard
            x={hoverX}
            y={plot.y + 8}
            containerWidth={width}
            title={xFormat(data[hover]?.[xKey])}
            rows={active.map((s) => ({ color: s.color, label: s.label, value: yFormat(Number(data[hover][s.key])) }))}
          />
        )}
      </div>

      {showLegend && specs.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <ChartLegend items={specs.map((s) => ({ label: s.label, color: s.color, hidden: hidden.has(s.key) }))} onToggle={toggle} />
        </div>
      )}
    </div>
  );
});

LineChart.displayName = "LineChart";
