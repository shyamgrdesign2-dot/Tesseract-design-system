"use client";

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { Sparkline } from "../Sparkline/Sparkline";
import { useElementWidth } from "../internal/hooks";
import { formatCompact, seriesColor } from "../internal/lib";

const VARIANTS = {
  surface: { background: "var(--tesseract-bg-surface)", border: "1px solid var(--tesseract-border-soft)" },
  soft: { background: "var(--tesseract-bg-page-subtle)", border: "1px solid transparent" },
  outline: { background: "transparent", border: "1px solid var(--tesseract-border-neutral)" },
};
const SIZES = { sm: { pad: 14, value: 22, radius: 12, label: 12 }, md: { pad: 18, value: 30, radius: 16, label: 13 } };

/**
 * StatCard — a KPI tile. Zero-dependency. Deeply configurable.
 *
 * Content:  label, value, format, delta, deltaSuffix, footer, icon
 * Delta:    invertDelta (down is good), trend override ("up"|"down"|"flat")
 * Spark:    spark, sparkColor, sparkArea, sparkCurve, showSparkline,
 *           sparkPosition ("bottom"|"side"|"none")
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
    sparkPosition = "bottom",
    icon,
    iconPosition = "left",
    footer,
    deltaPlacement = "header",
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
  const [wrapRef, cardWidth] = useElementWidth(240);
  const dir = trend || (delta == null ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat");
  const good = dir === "flat" || dir == null ? null : (dir === "up") !== invertDelta;
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.surface;
  const centered = align === "center";

  const deltaFg = good == null ? "var(--tesseract-fg-tertiary)" : good ? "var(--tesseract-fg-success)" : "var(--tesseract-fg-error)";
  const deltaBg = good == null ? "var(--tesseract-bg-page-subtle)" : good ? "var(--tesseract-bg-success-soft)" : "var(--tesseract-bg-error-soft)";
  const arrow = dir === "up" ? "M6 9.5V2.5M6 2.5 3 5.5M6 2.5l3 3" : dir === "down" ? "M6 2.5v7M6 9.5 3 6.5M6 9.5l3-3" : null;

  const setRef = (node) => {
    wrapRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const deltaPill = delta != null && (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: "2px 7px 2px 5px",
        borderRadius: 999,
        background: deltaBg,
        color: deltaFg,
        fontSize: 11.5,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {arrow && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d={arrow} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {Math.abs(delta)}
      {deltaSuffix}
    </span>
  );

  const iconChip = icon && (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 8, background: "var(--tesseract-bg-brand-soft)", color: "var(--tesseract-fg-link)", flexShrink: 0 }}>
      {icon}
    </span>
  );

  // icon on the right forces the delta below the value (the reference layout)
  const deltaBelow = deltaPlacement === "below" || iconPosition === "right";
  const headerRight = iconPosition === "right" ? iconChip : (!deltaBelow && !centered ? deltaPill : null);
  const belowDelta = deltaBelow || centered ? deltaPill : null;

  const hasSpark = showSparkline && spark && spark.length > 0;
  const bottomSparkW = Math.max(60, cardWidth - s.pad * 2);

  return (
    <div
      ref={setRef}
      className={cn(className) || undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: s.pad,
        borderRadius: s.radius,
        background: v.background,
        border: bordered ? v.border : "1px solid transparent",
        fontFamily: "var(--tesseract-font-body)",
        minWidth: 180,
        boxSizing: "border-box",
        textAlign: centered ? "center" : "left",
        ...style,
      }}
      {...rest}
    >
      {/* header: [icon] label ............ [icon | delta pill] */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: centered ? "center" : "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {iconPosition === "left" && iconChip}
          <span style={{ fontSize: s.label, color: "var(--tesseract-fg-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        </span>
        {!centered && headerRight}
      </div>

      {/* value ( + delta below / side spark ) */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: centered ? "center" : "space-between", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: centered ? "center" : "flex-start" }}>
          <span style={{ fontSize: s.value, fontWeight: 700, color: "var(--tesseract-fg-heading)", lineHeight: 1.05, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>{format(value)}</span>
          {belowDelta}
        </div>
        {hasSpark && sparkPosition === "side" && <Sparkline data={spark} color={sparkColor} area={sparkArea} curve={sparkCurve} width={96} height={40} />}
      </div>

      {footer && <div style={{ fontSize: 11.5, color: "var(--tesseract-fg-tertiary)" }}>{footer}</div>}

      {hasSpark && sparkPosition === "bottom" && (
        <Sparkline data={spark} color={sparkColor} area={sparkArea} curve={sparkCurve} width={bottomSparkW} height={44} style={{ marginTop: 2, display: "block" }} />
      )}
    </div>
  );
});

StatCard.displayName = "StatCard";
