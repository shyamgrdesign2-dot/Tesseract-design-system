"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { scaleLinear, scaleBand, niceTicks, sum, maxOf, formatCompact, seriesColor, MARGINS, downloadCSV, barPath } from "../internal/lib";
import { useElementWidth } from "../internal/hooks";
import { GridLines, AxisLeft, AxisBottom, ChartLegend, ChartToolbar, TooltipCard } from "../internal/primitives";

function normSeries(series, colors) {
  return (series || []).map((s, i) => {
    const spec = typeof s === "string" ? { key: s } : s;
    return { key: spec.key, label: spec.label ?? spec.key, color: spec.color ?? seriesColor(i, colors) };
  });
}

/**
 * BarChart — categorical comparison. Zero-dependency. Deeply configurable;
 * defaults preserve the standard look.
 *
 * Data:       data, xKey, series (string | {key,label?,color?})[]
 * Layout:     height, width, margin, stacked, horizontal
 * Bars:       barRadius, barPadding (0..0.9), groupPadding, barOpacity, dimOnHover
 * Value axis: yMin, yMax, yTickCount, valueFormat, showValueAxis, valueAxisLabel
 * Category:   showCategoryAxis, categoryAxisLabel
 * Grid/legend/tooltip: showGrid, gridStyle, showLegend, legendPosition,
 *              legendAlign, showTooltip, valueLabels, showToolbar
 * Misc:       colors[], emptyText
 */
export const BarChart = React.forwardRef(function BarChart(
  {
    data = [],
    xKey = "x",
    series = [],
    height = 280,
    width: fixedWidth,
    margin,
    stacked = false,
    horizontal = false,
    barRadius = 3,
    barPadding = 0.3,
    groupPadding = 0.18,
    barOpacity = 1,
    dimOnHover = true,
    valueLabels = false,
    yMin = 0,
    yMax,
    yTickCount = 5,
    valueFormat = formatCompact,
    showValueAxis = true,
    valueAxisLabel,
    showCategoryAxis = true,
    categoryAxisLabel,
    showGrid = true,
    gridStyle = "solid",
    showLegend = true,
    legendPosition = "bottom",
    legendAlign = "start",
    showTooltip = true,
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
  const specs = normSeries(series, colors);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [hover, setHover] = React.useState(null);
  const active = specs.filter((s) => !hidden.has(s.key));

  const m = {
    top: margin?.top ?? MARGINS.top,
    right: margin?.right ?? MARGINS.right,
    bottom: (margin?.bottom ?? MARGINS.bottom) + (categoryAxisLabel && !horizontal ? 18 : 0) + (valueAxisLabel && horizontal ? 18 : 0),
    left: (margin?.left ?? MARGINS.left) + (valueAxisLabel && !horizontal ? 16 : 0) + (categoryAxisLabel && horizontal ? 16 : 0),
  };
  const plot = { x: m.left, y: m.top, w: Math.max(10, width - m.left - m.right), h: Math.max(10, height - m.top - m.bottom) };
  const cats = data.map((r) => r[xKey]);

  const rawMax = stacked ? maxOf(data, (row) => sum(active, (s) => Number(row[s.key]))) : maxOf(data.flatMap((row) => active.map((s) => Number(row[s.key]))));
  const nice = niceTicks(yMin, yMax != null ? yMax : rawMax || 1, yTickCount);
  const domMax = yMax != null ? yMax : nice.niceMax;

  const band = horizontal ? scaleBand(cats, [plot.y, plot.y + plot.h], barPadding) : scaleBand(cats, [plot.x, plot.x + plot.w], barPadding);
  const vScale = horizontal ? scaleLinear([yMin, domMax], [plot.x, plot.x + plot.w]) : scaleLinear([yMin, domMax], [plot.y + plot.h, plot.y]);

  const bars = [];
  data.forEach((row, ci) => {
    const bStart = band(cats[ci]);
    const bw = band.bandwidth;
    if (stacked) {
      let acc = 0;
      const lastJ = active.length - 1;
      active.forEach((s, j) => {
        const v = Number(row[s.key]) || 0;
        const round = j === lastJ; // only the outermost segment rounds its value end
        if (horizontal) {
          const x0 = vScale(acc);
          const x1 = vScale(acc + v);
          bars.push({ x: x0, y: bStart, w: Math.max(0, x1 - x0), h: bw, color: s.color, v, ci, round });
        } else {
          const y0 = vScale(acc);
          const y1 = vScale(acc + v);
          bars.push({ x: bStart, y: y1, w: bw, h: Math.max(0, y0 - y1), color: s.color, v, ci, round });
        }
        acc += v;
      });
    } else {
      const inner = bw / Math.max(1, active.length);
      const gap = inner * groupPadding;
      active.forEach((s, j) => {
        const v = Number(row[s.key]) || 0;
        if (horizontal) {
          const x1 = vScale(v);
          bars.push({ x: plot.x, y: bStart + j * inner + gap / 2, w: Math.max(0, x1 - plot.x), h: inner - gap, color: s.color, v, ci, round: true });
        } else {
          const y1 = vScale(v);
          bars.push({ x: bStart + j * inner + gap / 2, y: y1, w: inner - gap, h: Math.max(0, plot.y + plot.h - y1), color: s.color, v, ci, round: true });
        }
      });
    }
  });

  const vTicks = nice.ticks.filter((v) => v <= domMax + 1e-9).map((value) => ({ value, [horizontal ? "x" : "y"]: vScale(value) }));
  const catTicks = cats.map((c) => ({ value: c, [horizontal ? "y" : "x"]: band(c) + band.bandwidth / 2 }));

  const toggle = (idx) => {
    const key = specs[idx].key;
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < specs.length - 1) next.add(key);
      return next;
    });
  };
  const exportCSV = () => downloadCSV("barchart.csv", [[xKey, ...specs.map((s) => s.label)], ...data.map((row) => [row[xKey], ...specs.map((s) => row[s.key])])]);

  const hoverPos = hover != null ? (horizontal ? { x: plot.x + plot.w, y: band(cats[hover]) + band.bandwidth / 2 } : { x: band(cats[hover]) + band.bandwidth / 2, y: plot.y + 8 }) : null;
  const legendEl = showLegend && specs.length > 0 && (
    <ChartLegend items={specs.map((s) => ({ label: s.label, color: s.color, hidden: hidden.has(s.key) }))} onToggle={toggle} align={legendAlign} />
  );

  return (
    <div ref={ref} className={cn(className) || undefined} style={{ fontFamily: "var(--tesseract-font-body)", ...style }} {...rest}>
      {showToolbar && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <ChartToolbar onExport={exportCSV} />
        </div>
      )}
      {legendPosition === "top" && legendEl && <div style={{ marginBottom: 10 }}>{legendEl}</div>}

      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
        {data.length === 0 ? (
          <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tesseract-fg-tertiary)", fontSize: 13 }}>{emptyText}</div>
        ) : (
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" style={{ display: "block" }}>
            {showGrid && <GridLines x={plot.x} y={plot.y} w={plot.w} h={plot.h} yTicks={horizontal ? [] : vTicks} xTicks={horizontal ? vTicks : []} showX={horizontal} dashed={gridStyle === "dashed"} />}
            <line x1={plot.x} y1={plot.y + plot.h} x2={plot.x + plot.w} y2={plot.y + plot.h} stroke="var(--tesseract-border-neutral)" strokeWidth={1} />

            {bars.map((b, i) => (
              <path key={i} d={barPath(b.x, b.y, b.w, b.h, b.round ? barRadius : 0, horizontal)} fill={b.color} opacity={(dimOnHover && hover != null && hover !== b.ci ? 0.4 : 1) * barOpacity} style={{ transition: "opacity 120ms" }} />
            ))}

            {valueLabels && bars.map((b, i) => (b.v ? (
              <text key={`l${i}`} x={horizontal ? b.x + b.w + 4 : b.x + b.w / 2} y={horizontal ? b.y + b.h / 2 + 4 : b.y - 4} textAnchor={horizontal ? "start" : "middle"} style={{ fontSize: 10, fill: "var(--tesseract-fg-tertiary)", fontFamily: "var(--tesseract-font-body)" }}>{valueFormat(b.v)}</text>
            ) : null))}

            {horizontal ? (
              <>
                {showValueAxis && <AxisBottom y={plot.y + plot.h} ticks={vTicks} format={valueFormat} />}
                {showCategoryAxis && (
                  <g pointerEvents="none">
                    {catTicks.map((t, i) => (
                      <text key={i} x={plot.x - 8} y={t.y + 4} textAnchor="end" style={{ fontSize: 11, fill: "var(--tesseract-fg-tertiary)", fontFamily: "var(--tesseract-font-body)" }}>{t.value}</text>
                    ))}
                  </g>
                )}
              </>
            ) : (
              <>
                {showValueAxis && <AxisLeft x={plot.x} ticks={vTicks} format={valueFormat} />}
                {showCategoryAxis && <AxisBottom y={plot.y + plot.h} ticks={catTicks} />}
              </>
            )}

            {valueAxisLabel && (horizontal
              ? <text x={plot.x + plot.w / 2} y={height - 2} textAnchor="middle" style={{ fontSize: 11, fill: "var(--tesseract-fg-secondary)", fontFamily: "var(--tesseract-font-body)" }}>{valueAxisLabel}</text>
              : <text transform={`translate(12,${plot.y + plot.h / 2}) rotate(-90)`} textAnchor="middle" style={{ fontSize: 11, fill: "var(--tesseract-fg-secondary)", fontFamily: "var(--tesseract-font-body)" }}>{valueAxisLabel}</text>)}
            {categoryAxisLabel && (horizontal
              ? <text transform={`translate(12,${plot.y + plot.h / 2}) rotate(-90)`} textAnchor="middle" style={{ fontSize: 11, fill: "var(--tesseract-fg-secondary)", fontFamily: "var(--tesseract-font-body)" }}>{categoryAxisLabel}</text>
              : <text x={plot.x + plot.w / 2} y={height - 2} textAnchor="middle" style={{ fontSize: 11, fill: "var(--tesseract-fg-secondary)", fontFamily: "var(--tesseract-font-body)" }}>{categoryAxisLabel}</text>)}

            {showTooltip && cats.map((c, i) => (
              <rect key={`h${i}`} x={horizontal ? plot.x : band(c)} y={horizontal ? band(c) : plot.y} width={horizontal ? plot.w : band.bandwidth} height={horizontal ? band.bandwidth : plot.h} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            ))}
          </svg>
        )}

        {showTooltip && hover != null && hoverPos && data.length > 0 && (
          <TooltipCard x={hoverPos.x} y={hoverPos.y} containerWidth={width} title={cats[hover]} rows={active.map((s) => ({ color: s.color, label: s.label, value: valueFormat(Number(data[hover][s.key])) }))} />
        )}
      </div>

      {legendPosition !== "top" && legendEl && <div style={{ marginTop: 10 }}>{legendEl}</div>}
    </div>
  );
});

BarChart.displayName = "BarChart";
