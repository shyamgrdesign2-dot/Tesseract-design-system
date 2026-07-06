"use client";

import * as React from "react";

// Shared chart chrome: gridlines, axes, legend, toolbar, tooltip card. All
// token-only, zero-dependency. Cartesian charts (line/bar/area) assemble these.

const AXIS_TEXT = {
  fontSize: 11,
  fill: "var(--tesseract-fg-tertiary)",
  fontFamily: "var(--tesseract-font-body)",
};

/* Horizontal gridlines at the y ticks (+ optional verticals at x ticks). */
export function GridLines({ x, y, w, h, yTicks = [], xTicks = [], showX = false, dashed = false }) {
  const dash = dashed ? "3 3" : undefined;
  return (
    <g pointerEvents="none">
      {yTicks.map((t, i) => (
        <line key={`gy${i}`} x1={x} x2={x + w} y1={t.y} y2={t.y} stroke="var(--tesseract-border-soft)" strokeWidth={1} strokeDasharray={dash} />
      ))}
      {showX &&
        xTicks.map((t, i) => (
          <line key={`gx${i}`} x1={t.x} x2={t.x} y1={y} y2={y + h} stroke="var(--tesseract-border-soft)" strokeWidth={1} strokeDasharray={dash} />
        ))}
    </g>
  );
}

/* Left value axis — labels only (grid draws the lines). */
export function AxisLeft({ x, ticks, format }) {
  return (
    <g pointerEvents="none">
      {ticks.map((t, i) => (
        <text key={i} x={x - 8} y={t.y + 4} textAnchor="end" style={AXIS_TEXT}>
          {format ? format(t.value) : t.value}
        </text>
      ))}
    </g>
  );
}

/* Bottom category / time axis. */
export function AxisBottom({ y, ticks, format }) {
  return (
    <g pointerEvents="none">
      {ticks.map((t, i) => (
        <text key={i} x={t.x} y={y + 16} textAnchor="middle" style={AXIS_TEXT}>
          {format ? format(t.value) : t.value}
        </text>
      ))}
    </g>
  );
}

/* Interactive legend — click an item to toggle its series (when onToggle set). */
export function ChartLegend({ items, onToggle, align = "start" }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        justifyContent: align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start",
        padding: "2px 2px",
        fontFamily: "var(--tesseract-font-body)",
      }}
    >
      {items.map((it, i) => (
        <button
          key={i}
          type="button"
          onClick={onToggle ? () => onToggle(i) : undefined}
          aria-pressed={onToggle ? !it.hidden : undefined}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: 0,
            padding: 0,
            cursor: onToggle ? "pointer" : "default",
            opacity: it.hidden ? 0.45 : 1,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 3, background: it.color, flexShrink: 0 }} />
          <span
            style={{
              fontSize: 12,
              color: "var(--tesseract-fg-secondary)",
              textDecoration: it.hidden ? "line-through" : "none",
            }}
          >
            {it.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* Toolbar — zoom in/out, reset, export. Inline-SVG glyphs (no icon dependency). */
const GLYPH_CHILDREN = {
  zoomIn: (
    <>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 5v4M5 7h4M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7h4M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  reset: <path d="M12.5 6a5 5 0 1 0 .9 3M12.5 3v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  export: <path d="M8 2v7m0 0 2.5-2.5M8 9 5.5 6.5M3 11v1.5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
};

function ToolbarButton({ glyph, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        border: "1px solid var(--tesseract-border-neutral)",
        background: "var(--tesseract-bg-surface)",
        color: "var(--tesseract-fg-secondary)",
        cursor: "pointer",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        {GLYPH_CHILDREN[glyph]}
      </svg>
    </button>
  );
}

export function ChartToolbar({ onZoomIn, onZoomOut, onReset, onExport, zoomable }) {
  return (
    <div style={{ display: "inline-flex", gap: 6 }}>
      {zoomable && (
        <>
          <ToolbarButton glyph="zoomOut" label="Zoom out" onClick={onZoomOut} />
          <ToolbarButton glyph="zoomIn" label="Zoom in" onClick={onZoomIn} />
          <ToolbarButton glyph="reset" label="Reset zoom" onClick={onReset} />
        </>
      )}
      {onExport && <ToolbarButton glyph="export" label="Export CSV" onClick={onExport} />}
    </div>
  );
}

/* Floating tooltip card — positioned in the chart's relative container. */
export function TooltipCard({ x, y, title, rows, containerWidth }) {
  const flip = containerWidth != null && x > containerWidth - 168;
  return (
    <div
      style={{
        position: "absolute",
        left: flip ? x - 12 : x + 14,
        top: y,
        transform: flip ? "translate(-100%, -50%)" : "translateY(-50%)",
        pointerEvents: "none",
        background: "var(--tesseract-bg-surface)",
        border: "1px solid var(--tesseract-border-neutral)",
        borderRadius: 10,
        boxShadow: "0 8px 24px -8px color-mix(in srgb, var(--tesseract-slate-900) 24%, transparent)",
        padding: "8px 10px",
        minWidth: 128,
        zIndex: 5,
        fontFamily: "var(--tesseract-font-body)",
      }}
    >
      {title != null && (
        <div style={{ fontSize: 11, color: "var(--tesseract-fg-tertiary)", marginBottom: 6 }}>{title}</div>
      )}
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, lineHeight: "18px" }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: r.color, flexShrink: 0 }} />
          <span style={{ color: "var(--tesseract-fg-secondary)", marginRight: "auto" }}>{r.label}</span>
          <strong style={{ color: "var(--tesseract-fg-primary)", fontWeight: 600 }}>{r.value}</strong>
        </div>
      ))}
    </div>
  );
}

