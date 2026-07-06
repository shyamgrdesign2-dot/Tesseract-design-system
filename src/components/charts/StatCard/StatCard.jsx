"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { Sparkline } from "../Sparkline/Sparkline";
import { formatCompact, seriesColor } from "../internal/lib";

/**
 * StatCard — a KPI tile: label, big value, an optional delta chip (auto-coloured
 * up/down), and an optional inline Sparkline. Zero-dependency.
 *
 * Props:
 *   label, value, format((v)=>string)
 *   delta        number — change; sign drives arrow + colour
 *   deltaSuffix  string (default "%");  invertDelta  boolean (down is good)
 *   trend        "up"|"down"|"flat"     override the auto direction
 *   spark        number[] | object[]    inline trend; sparkColor
 *   icon, footer nodes
 */
export const StatCard = React.forwardRef(function StatCard(
  {
    label,
    value,
    format = (v) => (typeof v === "number" ? formatCompact(v) : v),
    delta,
    deltaSuffix = "%",
    invertDelta = false,
    trend,
    spark,
    sparkColor = seriesColor(0),
    icon,
    footer,
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const dir = trend || (delta == null ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat");
  const good = dir === "flat" || dir == null ? null : (dir === "up") !== invertDelta;
  const deltaColor = good == null ? "var(--tesseract-fg-tertiary)" : good ? "var(--tesseract-fg-success)" : "var(--tesseract-fg-error)";
  const arrow =
    dir === "up" ? "M6 9.5V2.5M6 2.5 3 5.5M6 2.5l3 3" : dir === "down" ? "M6 2.5v7M6 9.5 3 6.5M6 9.5l3-3" : null;

  return (
    <div
      ref={ref}
      className={cn(className) || undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        borderRadius: 14,
        background: "var(--tesseract-bg-surface)",
        border: "1px solid var(--tesseract-border-soft)",
        fontFamily: "var(--tesseract-font-body)",
        minWidth: 180,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon && <span style={{ display: "inline-flex", color: "var(--tesseract-fg-tertiary)" }}>{icon}</span>}
        <span style={{ fontSize: 12, color: "var(--tesseract-fg-tertiary)", fontWeight: 500 }}>{label}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--tesseract-fg-heading)", lineHeight: 1.1 }}>{format(value)}</div>
          {delta != null && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 3, marginTop: 6, fontSize: 12, fontWeight: 600, color: deltaColor }}>
              {arrow && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d={arrow} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {Math.abs(delta)}
              {deltaSuffix}
            </div>
          )}
        </div>
        {spark && spark.length > 0 && <Sparkline data={spark} color={sparkColor} area width={92} height={38} />}
      </div>

      {footer && <div style={{ fontSize: 11, color: "var(--tesseract-fg-tertiary)" }}>{footer}</div>}
    </div>
  );
});

StatCard.displayName = "StatCard";
