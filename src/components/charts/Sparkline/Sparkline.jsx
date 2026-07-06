"use client";

import * as React from "react";
import { scaleLinear, extent, linePath, smoothPath, areaPath, seriesColor } from "../internal/lib";

/**
 * Sparkline — a tiny, axis-less trend line for inline use (table cells, KPI
 * tiles). Zero-dependency. Accepts an array of numbers, or objects + `valueKey`.
 *
 * Props: data, valueKey, width (96), height (28), color, area, curve
 * ("smooth"|"linear"), showLastDot, strokeWidth.
 */
export const Sparkline = React.forwardRef(function Sparkline(
  {
    data = [],
    valueKey,
    width = 96,
    height = 28,
    color = seriesColor(0),
    area = false,
    curve = "smooth",
    showLastDot = true,
    strokeWidth = 1.5,
    className,
    style,
    ...rest
  },
  ref,
) {
  const vals = data.map((d) => (valueKey ? Number(d[valueKey]) : Number(d)));
  const n = vals.length;
  const pad = strokeWidth + (showLastDot ? 2.5 : 1);
  const [mn, mx] = extent(vals);
  const xs = scaleLinear([0, Math.max(1, n - 1)], [pad, width - pad]);
  const ys = mn === mx ? () => height / 2 : scaleLinear([mn, mx], [height - pad, pad]);
  const pts = vals.map((v, i) => ({ x: xs(i), y: ys(v) }));
  const smooth = curve === "smooth";
  const last = pts[pts.length - 1];

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      role="img"
      {...rest}
    >
      {area && n > 1 && <path d={areaPath(pts, height - pad + strokeWidth, smooth)} fill={color} fillOpacity={0.15} stroke="none" />}
      {n > 1 && <path d={smooth ? smoothPath(pts) : linePath(pts)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />}
      {showLastDot && last && <circle cx={last.x} cy={last.y} r={strokeWidth + 0.5} fill={color} />}
    </svg>
  );
});

Sparkline.displayName = "Sparkline";
