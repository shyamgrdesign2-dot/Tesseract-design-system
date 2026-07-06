"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { scaleLinear, scaleBand, niceTicks, sum, maxOf, formatCompact, seriesColor, MARGINS, downloadCSV } from "../internal/lib";
import { useElementWidth } from "../internal/hooks";
import { GridLines, AxisLeft, AxisBottom, ChartLegend, ChartToolbar, TooltipCard } from "../internal/primitives";

function normSeries(series, colors) {
  return (series || []).map((s, i) => {
    const spec = typeof s === "string" ? { key: s } : s;
    return { key: spec.key, label: spec.label ?? spec.key, color: spec.color ?? seriesColor(i, colors) };
  });
}

/**
 * BarChart — categorical comparison. Zero-dependency (pure SVG + own scales).
 * Grouped or stacked; vertical or horizontal; optional value labels, gridlines,
 * an interactive tooltip, and a click-to-toggle legend.
 *
 * Props:
 *   data        row objects (e.g. [{ dept:"OPD", visits:120, walkins:30 }])
 *   xKey        the category key (default "x")
 *   series      (string | {key,label?,color?})[]   value series
 *   height      number (default 280); width is responsive
 *   stacked     boolean — stack series instead of grouping (default false)
 *   horizontal  boolean — bars run left→right (default false)
 *   valueLabels boolean — draw the value on each bar (default false)
 *   showGrid / showLegend / showTooltip / showToolbar   booleans
 *   colors      string[]   palette override; valueFormat  (v)=>string
 */
export const BarChart = React.forwardRef(function BarChart(
  {
    data = [],
    xKey = "x",
    series = [],
    height = 280,
    stacked = false,
    horizontal = false,
    valueLabels = false,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    showToolbar = false,
    colors,
    valueFormat = formatCompact,
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const [wrapRef, width] = useElementWidth();
  const specs = normSeries(series, colors);
  const [hidden, setHidden] = React.useState(() => new Set());
  const [hover, setHover] = React.useState(null); // category index
  const active = specs.filter((s) => !hidden.has(s.key));

  const m = MARGINS;
  const plot = { x: m.left, y: m.top, w: Math.max(10, width - m.left - m.right), h: Math.max(10, height - m.top - m.bottom) };
  const cats = data.map((r) => r[xKey]);

  const vmax = stacked
    ? maxOf(data, (row) => sum(active, (s) => Number(row[s.key])))
    : maxOf(data.flatMap((row) => active.map((s) => Number(row[s.key]))));
  const { ticks: vTickVals, niceMax } = niceTicks(0, vmax || 1, 5);

  // value scale + category band, swapped by orientation
  const band = horizontal
    ? scaleBand(cats, [plot.y, plot.y + plot.h], 0.3)
    : scaleBand(cats, [plot.x, plot.x + plot.w], 0.3);
  const vScale = horizontal
    ? scaleLinear([0, niceMax], [plot.x, plot.x + plot.w])
    : scaleLinear([0, niceMax], [plot.y + plot.h, plot.y]);

  const bars = [];
  data.forEach((row, ci) => {
    const bStart = band(cats[ci]);
    const bw = band.bandwidth;
    if (stacked) {
      let acc = 0;
      active.forEach((s) => {
        const v = Number(row[s.key]) || 0;
        if (horizontal) {
          const x0 = vScale(acc);
          const x1 = vScale(acc + v);
          bars.push({ x: x0, y: bStart, w: Math.max(0, x1 - x0), h: bw, color: s.color, v, ci, key: s.key });
        } else {
          const y0 = vScale(acc);
          const y1 = vScale(acc + v);
          bars.push({ x: bStart, y: y1, w: bw, h: Math.max(0, y0 - y1), color: s.color, v, ci, key: s.key });
        }
        acc += v;
      });
    } else {
      const sub = bw / Math.max(1, active.length);
      active.forEach((s, j) => {
        const v = Number(row[s.key]) || 0;
        if (horizontal) {
          const x1 = vScale(v);
          bars.push({ x: plot.x, y: bStart + j * sub, w: Math.max(0, x1 - plot.x), h: sub * 0.82, color: s.color, v, ci, key: s.key });
        } else {
          const y1 = vScale(v);
          bars.push({ x: bStart + j * sub, y: y1, w: sub * 0.82, h: Math.max(0, plot.y + plot.h - y1), color: s.color, v, ci, key: s.key });
        }
      });
    }
  });

  const vTicks = vTickVals.map((value) => ({ value, [horizontal ? "x" : "y"]: vScale(value) }));
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
  const exportCSV = () => {
    const header = [xKey, ...specs.map((s) => s.label)];
    const rows = data.map((row) => [row[xKey], ...specs.map((s) => row[s.key])]);
    downloadCSV("barchart.csv", [header, ...rows]);
  };

  // tooltip position: center of the hovered category band
  const hoverPos =
    hover != null
      ? horizontal
        ? { x: plot.x + plot.w, y: band(cats[hover]) + band.bandwidth / 2 }
        : { x: band(cats[hover]) + band.bandwidth / 2, y: plot.y + 8 }
      : null;

  return (
    <div ref={ref} className={cn(className) || undefined} style={{ fontFamily: "var(--tesseract-font-body)", ...style }} {...rest}>
      {showToolbar && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <ChartToolbar onExport={exportCSV} />
        </div>
      )}

      <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" style={{ display: "block" }}>
          {showGrid && (
            <GridLines
              x={plot.x}
              y={plot.y}
              w={plot.w}
              h={plot.h}
              yTicks={horizontal ? [] : vTicks}
              xTicks={horizontal ? vTicks : []}
              showX={horizontal}
            />
          )}
          {/* axis baseline */}
          <line
            x1={plot.x}
            y1={plot.y + plot.h}
            x2={plot.x + plot.w}
            y2={plot.y + plot.h}
            stroke="var(--tesseract-border-neutral)"
            strokeWidth={1}
          />

          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={stacked ? 1 : 3}
              fill={b.color}
              opacity={hover == null || hover === b.ci ? 1 : 0.4}
              style={{ transition: "opacity 120ms" }}
            />
          ))}

          {valueLabels &&
            bars.map((b, i) =>
              b.v ? (
                <text
                  key={`l${i}`}
                  x={horizontal ? b.x + b.w + 4 : b.x + b.w / 2}
                  y={horizontal ? b.y + b.h / 2 + 4 : b.y - 4}
                  textAnchor={horizontal ? "start" : "middle"}
                  style={{ fontSize: 10, fill: "var(--tesseract-fg-tertiary)", fontFamily: "var(--tesseract-font-body)" }}
                >
                  {valueFormat(b.v)}
                </text>
              ) : null,
            )}

          {horizontal ? (
            <>
              <AxisBottom y={plot.y + plot.h} ticks={vTicks} format={valueFormat} />
              <g pointerEvents="none">
                {catTicks.map((t, i) => (
                  <text key={i} x={plot.x - 8} y={t.y + 4} textAnchor="end" style={{ fontSize: 11, fill: "var(--tesseract-fg-tertiary)", fontFamily: "var(--tesseract-font-body)" }}>
                    {t.value}
                  </text>
                ))}
              </g>
            </>
          ) : (
            <>
              <AxisLeft x={plot.x} ticks={vTicks} format={valueFormat} />
              <AxisBottom y={plot.y + plot.h} ticks={catTicks} />
            </>
          )}

          {/* category hover surfaces */}
          {showTooltip &&
            cats.map((c, i) => (
              <rect
                key={`h${i}`}
                x={horizontal ? plot.x : band(c)}
                y={horizontal ? band(c) : plot.y}
                width={horizontal ? plot.w : band.bandwidth}
                height={horizontal ? band.bandwidth : plot.h}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
        </svg>

        {showTooltip && hover != null && hoverPos && (
          <TooltipCard
            x={hoverPos.x}
            y={hoverPos.y}
            containerWidth={width}
            title={cats[hover]}
            rows={active.map((s) => ({ color: s.color, label: s.label, value: valueFormat(Number(data[hover][s.key])) }))}
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

BarChart.displayName = "BarChart";
