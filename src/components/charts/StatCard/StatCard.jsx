"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { Sparkline } from "../Sparkline/Sparkline";
import { formatCompact, seriesColor } from "../internal/lib";

const VARIANTS = {
  surface: { background: "var(--tesseract-bg-surface)", border: "1px solid var(--tesseract-border-soft)" },
  soft: { background: "var(--tesseract-bg-page-subtle)", border: "1px solid transparent" },
  outline: { background: "transparent", border: "1px solid var(--tesseract-border-neutral)" },
};
const SIZES = { sm: { pad: 12, value: 20, radius: 12 }, md: { pad: 16, value: 26, radius: 14 } };

/**
 * StatCard — a KPI tile. Zero-dependency. Deeply configurable.
 *
 * Content:  label, value, format, delta, deltaSuffix, footer, icon
 * Delta:    invertDelta (down is good), trend override ("up"|"down"|"flat")
 * Spark:    spark, sparkColor, sparkArea, sparkCurve, showSparkline
 * Look:     variant ("surface"|"soft"|"outline"), size ("sm"|"md"), align
 *           ("left"|"center"), bordered
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
    sparkArea = true,
    sparkCurve = "smooth",
    showSparkline = true,
    icon,
    footer,
    variant = "surface",
    size = "md",
    align = "left",
    bordered = true,
    className = "",
    style,
    ...rest
  },
  ref,
) {
  const dir = trend || (delta == null ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat");
  const good = dir === "flat" || dir == null ? null : (dir === "up") !== invertDelta;
  const deltaColor = good == null ? "var(--tesseract-fg-tertiary)" : good ? "var(--tesseract-fg-success)" : "var(--tesseract-fg-error)";
  const arrow = dir === "up" ? "M6 9.5V2.5M6 2.5 3 5.5M6 2.5l3 3" : dir === "down" ? "M6 2.5v7M6 9.5 3 6.5M6 9.5l3-3" : null;
  const v = VARIANTS[variant] || VARIANTS.surface;
  const s = SIZES[size] || SIZES.md;
  const centered = align === "center";

  return (
    <div
      ref={ref}
      className={cn(className) || undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: s.pad,
        borderRadius: s.radius,
        background: v.background,
        border: bordered ? v.border : "1px solid transparent",
        fontFamily: "var(--tesseract-font-body)",
        minWidth: 180,
        textAlign: centered ? "center" : "left",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: centered ? "center" : "flex-start" }}>
        {icon && <span style={{ display: "inline-flex", color: "var(--tesseract-fg-tertiary)" }}>{icon}</span>}
        <span style={{ fontSize: 12, color: "var(--tesseract-fg-tertiary)", fontWeight: 500 }}>{label}</span>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: centered ? "center" : "space-between", gap: 12, flexDirection: centered ? "column" : "row" }}>
        <div>
          <div style={{ fontSize: s.value, fontWeight: 700, color: "var(--tesseract-fg-heading)", lineHeight: 1.1 }}>{format(value)}</div>
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
        {showSparkline && spark && spark.length > 0 && <Sparkline data={spark} color={sparkColor} area={sparkArea} curve={sparkCurve} width={92} height={38} />}
      </div>

      {footer && <div style={{ fontSize: 11, color: "var(--tesseract-fg-tertiary)" }}>{footer}</div>}
    </div>
  );
});

StatCard.displayName = "StatCard";
