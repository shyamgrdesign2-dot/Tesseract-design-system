"use client";

import * as React from "react";
import { scaleLinear, extent, pathFor, areaPath, seriesColor } from "../internal/lib";

/**
 * Sparkline — a tiny, axis-less trend line for inline use. Zero-dependency.
 *
 * Data:   data (numbers | objects), valueKey
 * Size:   width, height
 * Line:   color, strokeWidth, curve ("smooth"|"linear"|"step")
 * Fill:   area, fillOpacity
 * Dots:   showLastDot, markers (all points), dotColor, dotRadius
 * Domain: min, max (override auto-fit)
 */
export const Sparkline = React.forwardRef(function Sparkline(
  {
    data = [],
    valueKey,
    width = 96,
    height = 28,
    color = seriesColor(0),
    strokeWidth = 1.5,
    curve = "smooth",
    area = false,
    fillOpacity = 0.15,
    showLastDot = true,
    markers = false,
    dotColor,
    dotRadius,
    min,
    max,
    className,
    style,
    ...rest
  },
  ref,
) {
  const vals = data.map((d) => (valueKey ? Number(d[valueKey]) : Number(d)));
  const n = vals.length;
  const r = dotRadius ?? strokeWidth + 0.5;
  const pad = strokeWidth + (showLastDot || markers ? r + 1 : 1);
  const [emin, emax] = extent(vals);
  const mn = min != null ? min : emin;
  const mx = max != null ? max : emax;
  const xs = scaleLinear([0, Math.max(1, n - 1)], [pad, width - pad]);
  const ys = mn === mx ? () => height / 2 : scaleLinear([mn, mx], [height - pad, pad]);
  const pts = vals.map((v, i) => ({ x: xs(i), y: ys(v) }));
  const last = pts[pts.length - 1];
  const dc = dotColor || color;

  return (
    <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ display: "inline-block", verticalAlign: "middle", ...style }} role="img" {...rest}>
      {area && n > 1 && <path d={areaPath(pts, height - pad + strokeWidth, curve)} fill={color} fillOpacity={fillOpacity} stroke="none" />}
      {n > 1 && <path d={pathFor(pts, curve)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />}
      {markers && pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={r} fill={dc} />)}
      {!markers && showLastDot && last && <circle cx={last.x} cy={last.y} r={r} fill={dc} />}
    </svg>
  );
});

Sparkline.displayName = "Sparkline";
