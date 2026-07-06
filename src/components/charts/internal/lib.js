// Tesseract charts — zero-dependency math core.
//
// Pure functions only (no React, no D3, no deps): scales, nice ticks, SVG path
// geometry (lines, smooth curves, areas, arcs), number formatting, and the
// token-based series colour scale. Every chart is built on this.

/* ───────────────────────── array helpers ───────────────────────── */

export const extent = (arr, acc = (d) => d) => {
  let min = Infinity;
  let max = -Infinity;
  for (const d of arr) {
    const v = acc(d);
    if (v == null || Number.isNaN(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [min === Infinity ? 0 : min, max === -Infinity ? 0 : max];
};

export const sum = (arr, acc = (d) => d) => arr.reduce((s, d) => s + (Number(acc(d)) || 0), 0);
export const maxOf = (arr, acc = (d) => d) => arr.reduce((m, d) => Math.max(m, Number(acc(d)) || 0), 0);

/* ───────────────────────── scales ───────────────────────── */

// Continuous linear scale: domain [d0,d1] → range [r0,r1], with invert().
export function scaleLinear(domain, range) {
  let [d0, d1] = domain;
  const [r0, r1] = range;
  if (d0 === d1) d1 = d0 + 1; // guard divide-by-zero
  const k = (r1 - r0) / (d1 - d0);
  const scale = (v) => r0 + (v - d0) * k;
  scale.invert = (px) => d0 + (px - r0) / k;
  scale.domain = [d0, d1];
  scale.range = [r0, r1];
  return scale;
}

// Band scale for categories: evenly spaced slots with inner padding.
export function scaleBand(domainArr, range, padding = 0.2) {
  const [r0, r1] = range;
  const n = domainArr.length || 1;
  const step = (r1 - r0) / n;
  const bandwidth = step * (1 - padding);
  const index = new Map(domainArr.map((d, i) => [String(d), i]));
  const scale = (v) => r0 + (index.get(String(v)) ?? 0) * step + (step - bandwidth) / 2;
  scale.bandwidth = bandwidth;
  scale.step = step;
  scale.domain = domainArr;
  scale.range = [r0, r1];
  return scale;
}

// Round, human-friendly tick values covering [min,max] (~count ticks).
export function niceTicks(min, max, count = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { ticks: [0, 1], niceMin: 0, niceMax: 1, step: 1 };
  if (min === max) { max = min + 1; }
  const rawStep = (max - min) / Math.max(1, count);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = niceMin; v <= niceMax + step * 0.5; v += step) ticks.push(Number(v.toFixed(10)));
  return { ticks, niceMin, niceMax, step };
}

/* ───────────────────────── line / area geometry ───────────────────────── */

export const linePath = (pts) => (pts.length ? "M" + pts.map((p) => `${p.x},${p.y}`).join("L") : "");

// Smooth curve through points (Catmull-Rom → cubic bezier). Seek-safe, no deps.
export function smoothPath(pts) {
  if (pts.length < 3) return linePath(pts);
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

// Filled area under a line down to baseline y0 (px). `smooth` uses the curve.
export function areaPath(pts, y0, smooth = false) {
  if (!pts.length) return "";
  const top = smooth ? smoothPath(pts) : linePath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${top}L${last.x},${y0}L${first.x},${y0}Z`;
}

/* ───────────────────────── arc geometry (pie / donut / gauge) ───────────────────────── */

// angle in radians; 0 = 12 o'clock, increasing clockwise.
export const polar = (cx, cy, r, angle) => {
  const a = angle - Math.PI / 2;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

// Ring/pie slice path from startAngle→endAngle (rad). rInner=0 → full pie.
export function arcPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  const p0 = polar(cx, cy, rOuter, startAngle);
  const p1 = polar(cx, cy, rOuter, endAngle);
  if (rInner <= 0) {
    return `M${cx},${cy}L${p0.x},${p0.y}A${rOuter},${rOuter} 0 ${large} 1 ${p1.x},${p1.y}Z`;
  }
  const q0 = polar(cx, cy, rInner, endAngle);
  const q1 = polar(cx, cy, rInner, startAngle);
  return (
    `M${p0.x},${p0.y}` +
    `A${rOuter},${rOuter} 0 ${large} 1 ${p1.x},${p1.y}` +
    `L${q0.x},${q0.y}` +
    `A${rInner},${rInner} 0 ${large} 0 ${q1.x},${q1.y}Z`
  );
}

/* ───────────────────────── formatting ───────────────────────── */

// 1234 → "1.2k", 1_200_000 → "1.2M". Keeps small numbers exact.
export function formatCompact(n) {
  if (n == null || Number.isNaN(n)) return "";
  const abs = Math.abs(n);
  const trim = (x) => x.toFixed(1).replace(/\.0$/, "");
  if (abs >= 1e9) return trim(n / 1e9) + "B";
  if (abs >= 1e6) return trim(n / 1e6) + "M";
  if (abs >= 1e3) return trim(n / 1e3) + "k";
  return String(Math.round(n * 100) / 100);
}

export const formatNumber = (n) => (n == null || Number.isNaN(n) ? "" : n.toLocaleString());

/* ───────────────────────── series colour scale (token-only) ───────────────────────── */

// Colourblind-aware ordering across the brand ramps; wraps for many series.
export const SERIES_COLORS = [
  "var(--tesseract-blue-500)",
  "var(--tesseract-violet-500)",
  "var(--tesseract-amber-500)",
  "var(--tesseract-success-500)",
  "var(--tesseract-error-500)",
  "var(--tesseract-blue-300)",
  "var(--tesseract-violet-300)",
  "var(--tesseract-slate-400)",
];

export const seriesColor = (i, custom) => (custom && custom[i]) || SERIES_COLORS[i % SERIES_COLORS.length];

/* ───────────────────────── layout + export helpers ───────────────────────── */

// Default cartesian plot margins (room for axis labels).
export const MARGINS = { top: 12, right: 16, bottom: 28, left: 40 };

// CSV export — build a file and trigger a download, no deps.
export function downloadCSV(filename, rows) {
  try {
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  } catch {
    /* no-op */
  }
}
