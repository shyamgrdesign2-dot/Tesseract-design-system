"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import {
  scaleLinear,
  niceTicks,
  pathFor,
  areaPath,
  extent,
  formatCompact,
  seriesColor,
  MARGINS,
  downloadCSV,
} from "../internal/lib";
import { useElementWidth, useZoomPan } from "../internal/hooks";
import { GridLines, AxisLeft, AxisBottom, ChartLegend, ChartToolbar, TooltipCard } from "../internal/primitives";

function normSeries(series, colors) {
  return (series || []).map((s, i) => {
    const spec = typeof s === "string" ? { key: s } : s;
    return { key: spec.key, label: spec.label ?? spec.key, color: spec.color ?? seriesColor(i, colors) };
  });
}

/**
 * LineChart — multi-series time/trend chart. Zero-dependency (pure SVG + own
 * scales/curves). Deeply configurable; defaults preserve the standard look.
 *
 * Data:        data, xKey, series (string | {key,label?,color?})[]
 * Size:        height, margin ({top,right,bottom,left} partial), width (fixed)
 * Line:        curve ("smooth"|"linear"|"step"), strokeWidth, area, areaOpacity,
 *              markers, markerSize
 * Value axis:  yMin, yMax, yTickCount, yFormat, showYAxis, yAxisLabel
 * Category axis: xFormat, showXAxis, xAxisLabel, xTickCount
 * Grid:        showGrid, gridStyle ("solid"|"dashed"), showVerticalGrid
 * Legend:      showLegend, legendPosition ("top"|"bottom"), legendAlign
 * Interaction: showTooltip, showCrosshair, zoomable, showToolbar
 * Misc:        colors[], emptyText
 */
export const LineChart = React.forwardRef(function LineChart(
  {
    data = [],
    xKey = "x",
    series = [],
    height = 260,
    width: fixedWidth,
    margin,
    curve = "smooth",
    strokeWidth = 2,
    area = false,
    areaOpacity = 0.14,
    markers = false,
    markerSize = 2.5,
    yMin,
    yMax,
    yTickCount = 5,
    yFormat = formatCompact,
    showYAxis = true,
    yAxisLabel,
    xFormat = (v) => v,
    showXAxis = true,
    xAxisLabel,
    xTickCount = 6,
    showGrid = true,
    gridStyle = "solid",
    showVerticalGrid = false,
    showLegend = true,
    legendPosition = "bottom",
    legendAlign = "start",
    showTooltip = true,
    showCrosshair = true,
    zoomable = false,
    showToolbar = false,
    colors,
    emptyText = "No data",
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const [wrapRef, measured] = useElementWidth();
  const width = fixedWidth || measured;
  const clipId = React.useId();
  const specs = normSeries(series, colors);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [hover, setHover] = React.useState(null);
  const zp = useZoomPan(zoomable);

  const active = specs.filter((s) => !hidden.has(s.key));
  const n = data.length;

  const m = {
    top: (margin?.top ?? MARGINS.top),
    right: (margin?.right ?? MARGINS.right),
    bottom: (margin?.bottom ?? MARGINS.bottom) + (xAxisLabel ? 18 : 0),
    left: (margin?.left ?? MARGINS.left) + (yAxisLabel ? 16 : 0),
  };
  const plot = { x: m.left, y: m.top, w: Math.max(10, width - m.left - m.right), h: Math.max(10, height - m.top - m.bottom) };

  const vals = [];
  for (const s of active) for (const row of data) vals.push(Number(row[s.key]));
  const [dmin, dmax] = extent(vals);
  const effMin = yMin != null ? yMin : Math.min(dmin, 0);
  const effMax = yMax != null ? yMax : dmax;
  const nice = niceTicks(effMin, effMax, yTickCount);
  const domMin = yMin != null ? yMin : nice.niceMin;
  const domMax = yMax != null ? yMax : nice.niceMax;
  const yScale = scaleLinear([domMin, domMax], [plot.y + plot.h, plot.y]);
  const baseY = yScale(Math.max(domMin, 0));

  const frac = (i) => (n <= 1 ? 0.5 : i / (n - 1));
  const xAt = (i) => plot.x + ((frac(i) - zp.win.lo) / (zp.win.hi - zp.win.lo)) * plot.w;

  const yTicks = nice.ticks.filter((v) => v >= domMin - 1e-9 && v <= domMax + 1e-9).map((value) => ({ value, y: yScale(value) }));

  const i0 = Math.max(0, Math.floor(zp.win.lo * (n - 1)));
  const i1 = Math.min(n - 1, Math.ceil(zp.win.hi * (n - 1)));
  const xStep = Math.max(1, Math.round((i1 - i0) / Math.max(1, xTickCount)));
  const xTicks = [];
  for (let i = i0; i <= i1; i += xStep) xTicks.push({ value: xFormat(data[i]?.[xKey]), x: xAt(i) });

  const pointsFor = (s) => data.map((row, i) => ({ x: xAt(i), y: yScale(Number(row[s.key])), i, v: Number(row[s.key]) }));

  const onMove = (e) => {
    if (!showTooltip || !n) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = zp.win.lo + ((e.clientX - rect.left - plot.x) / plot.w) * (zp.win.hi - zp.win.lo);
    setHover(Math.max(0, Math.min(n - 1, Math.round(fx * (n - 1)))));
  };
  const toggle = (idx) => {
    const key = specs[idx].key;
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < specs.length - 1) next.add(key);
      return next;
    });
  };
  const exportCSV = () => {
    const header = [xKey, ...specs.map((s) => s.label)];
    downloadCSV("linechart.csv", [header, ...data.map((row) => [row[xKey], ...specs.map((s) => row[s.key])])]);
  };

  const hoverX = hover != null ? xAt(hover) : null;
  const legendEl = showLegend && specs.length > 0 && (
    <ChartLegend items={specs.map((s) => ({ label: s.label, color: s.color, hidden: hidden.has(s.key) }))} onToggle={toggle} align={legendAlign} />
  );

  return (
    <div ref={ref} className={cn(className) || undefined} style={{ fontFamily: "var(--tesseract-font-body)", ...style }} {...rest}>
      {showToolbar && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <ChartToolbar zoomable={zoomable} onZoomIn={zp.zoomIn} onZoomOut={zp.zoomOut} onReset={zp.reset} onExport={exportCSV} />
        </div>
      )}
      {legendPosition === "top" && legendEl && <div style={{ marginBottom: 10 }}>{legendEl}</div>}

      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
        {n === 0 ? (
          <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tesseract-fg-tertiary)", fontSize: 13 }}>{emptyText}</div>
        ) : (
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" style={{ display: "block", touchAction: zoomable ? "none" : undefined }}>
            <defs>
              <clipPath id={clipId}>
                <rect x={plot.x} y={plot.y - 4} width={plot.w} height={plot.h + 8} />
              </clipPath>
            </defs>

            {showGrid && <GridLines x={plot.x} y={plot.y} w={plot.w} h={plot.h} yTicks={yTicks} xTicks={xTicks} showX={showVerticalGrid} dashed={gridStyle === "dashed"} />}
            <line x1={plot.x} x2={plot.x + plot.w} y1={plot.y + plot.h} y2={plot.y + plot.h} stroke="var(--tesseract-border-neutral)" strokeWidth={1} />

            <g clipPath={`url(#${clipId})`}>
              {active.map((s) => {
                const pts = pointsFor(s);
                return (
                  <g key={s.key}>
                    {area && <path d={areaPath(pts, baseY, curve)} fill={s.color} fillOpacity={areaOpacity} stroke="none" />}
                    <path d={pathFor(pts, curve)} fill="none" stroke={s.color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
                    {markers && pts.map((p) => <circle key={p.i} cx={p.x} cy={p.y} r={markerSize} fill="var(--tesseract-bg-surface)" stroke={s.color} strokeWidth={1.5} />)}
                  </g>
                );
              })}

              {hover != null && hoverX != null && (
                <g pointerEvents="none">
                  {showCrosshair && <line x1={hoverX} x2={hoverX} y1={plot.y} y2={plot.y + plot.h} stroke="var(--tesseract-border-strong)" strokeWidth={1} strokeDasharray="3 3" />}
                  {active.map((s) => (
                    <circle key={s.key} cx={hoverX} cy={yScale(Number(data[hover][s.key]))} r={3.5} fill={s.color} stroke="var(--tesseract-bg-surface)" strokeWidth={1.5} />
                  ))}
                </g>
              )}
            </g>

            {showYAxis && <AxisLeft x={plot.x} ticks={yTicks} format={yFormat} />}
            {showXAxis && <AxisBottom y={plot.y + plot.h} ticks={xTicks} />}

            {yAxisLabel && (
              <text transform={`translate(${12},${plot.y + plot.h / 2}) rotate(-90)`} textAnchor="middle" style={{ fontSize: 11, fill: "var(--tesseract-fg-secondary)", fontFamily: "var(--tesseract-font-body)" }}>{yAxisLabel}</text>
            )}
            {xAxisLabel && (
              <text x={plot.x + plot.w / 2} y={height - 2} textAnchor="middle" style={{ fontSize: 11, fill: "var(--tesseract-fg-secondary)", fontFamily: "var(--tesseract-font-body)" }}>{xAxisLabel}</text>
            )}

            <rect x={plot.x} y={plot.y} width={plot.w} height={plot.h} fill="transparent" style={{ cursor: zoomable ? "grab" : "crosshair" }} onMouseMove={onMove} onMouseLeave={() => setHover(null)} {...zp.handlers} />
          </svg>
        )}

        {showTooltip && hover != null && hoverX != null && n > 0 && (
          <TooltipCard x={hoverX} y={plot.y + 8} containerWidth={width} title={xFormat(data[hover]?.[xKey])} rows={active.map((s) => ({ color: s.color, label: s.label, value: yFormat(Number(data[hover][s.key])) }))} />
        )}
      </div>

      {legendPosition !== "top" && legendEl && <div style={{ marginTop: 10 }}>{legendEl}</div>}
    </div>
  );
});

LineChart.displayName = "LineChart";
