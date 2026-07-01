"use client";

import * as React from "react";
import { AnimatedGrid } from "@/src/components/atoms/AnimatedGrid/AnimatedGrid";
import { LightRays } from "@/src/components/atoms/LightRays/LightRays";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { SURFACE_GRADIENTS, SURFACE_RAY_COLORS, DEFAULT_SURFACE_TONE, grainStyle } from "@/src/foundations/surfaceGradients";
import { Tooltip } from "@/src/components/molecules/Tooltip";
import { cn } from "@/src/hooks/utils";
import styles from "./HeroBanner.module.scss";

// Surface gradient + film grain + ray tints per tone — shared, token-only source
// of truth (so the component and the Foundations docs stay in sync). Two tones
// only: violet + blue. See surfaceGradients.js for the layer breakdown.
const TONE_GRADIENTS = SURFACE_GRADIENTS;
const RAY_COLORS = SURFACE_RAY_COLORS;
const DEFAULT_TONE = DEFAULT_SURFACE_TONE;

const SIZE_HEIGHT = { sm: 80, md: 120, lg: 160 };
// Default bottom corner radius scales with size (md = 24px). Soft, generous
// corners; the practical ceiling is 42px.
const SIZE_RADIUS = { sm: 20, md: 24, lg: 32 };
const MAX_RADIUS = 42;

// Headings come in exactly two sizes: 18px and 24px.
const TITLE_FONT_SIZE = { sm: 18, md: 24 };
const SUBTITLE_FONT_SIZE = { sm: 13, md: 16 };
// Back-button glyph size scales with the heading.
const BACK_ICON = { sm: 14, md: 18 };
// Back-control box height = the H1 line box (fontSize × 1.15), so the BARE icon
// (no button shell) sits exactly on the title's centre line.
const BACK_BOX = { sm: 20, md: 28 };

/**
 * HeroBanner — The page hero banner. Dark radial-gradient surface with an
 * animated geometric lattice accent (right side, partly off-canvas), an
 * optional back button, and a top-aligned title + subtitle. This is the
 * only banner.
 *
 * Props:
 *   size          "sm" | "md" | "lg"          banner height; default "md"
 *   height        number                       numeric height override (escape hatch); default undefined → use size
 *   bottomRadius  number                       overrides the size default (sm 20 / md 24 / lg 32); max 42
 *   tone          "violet" | "blue"            gradient tone (token-only); default "violet" = current look
 *   background    string                       full CSS background override (wins over tone); default undefined
 *   eyebrow       string | node                small kicker label above the title; default none
 *   align         "center" | "top"             vertical alignment of the content block; default "center" = current
 *   title         string                       required
 *   subtitle      string                       optional
 *   titleSize     "sm" (18px) | "md" (24px)    default "md"
 *   subtitleSize  "sm" | "md"                  default "sm"
 *   showBackButton boolean                     back button (centered on the heading)
 *   backIcon      string                       back glyph name; default "arrow-left3"
 *   backIconVariant "linear" | …               back glyph style; default "outline"
 *   backIconCorner "rounded" | "straight"       back glyph corner; default "straight"
 *   actions       ReactNode                    CTA slot (dark-surface Button: text / icon / split)
 *   rays          boolean                      default true — premium soft light-leak accent (bleeds from the top-left corner)
 *   pattern       boolean                      default true — animated lattice accent (finer; right side, opposite the leak)
 *   className     string
 */
export const HeroBanner = React.forwardRef(function HeroBanner({
  size = "md",
  height,
  bottomRadius,
  tone = DEFAULT_TONE,
  background,
  eyebrow,
  align = "center",
  title,
  subtitle,
  titleSize = "md",
  subtitleSize = "sm",
  showBackButton = false,
  backIcon = "arrow-left3",
  backIconVariant = "outline",
  backIconCorner = "straight",
  onBack,
  actions,
  rays = true,
  pattern = true,
  className = "",
  style,
  ...rest
}, ref) {
  // Numeric `height` is an escape hatch; otherwise it derives from `size`.
  const resolvedHeight = height ?? SIZE_HEIGHT[size] ?? SIZE_HEIGHT.md;
  const ts = TITLE_FONT_SIZE[titleSize] ? titleSize : "md";
  // Explicit bottomRadius wins; otherwise it scales with size (md = 24px).
  // Clamped to a 42px ceiling so the banner corners stay sane.
  const radius = Math.min(MAX_RADIUS, bottomRadius ?? SIZE_RADIUS[size] ?? SIZE_RADIUS.md);
  // Explicit `background` string wins; otherwise pick the tone gradient.
  const surface = background ?? TONE_GRADIENTS[tone] ?? TONE_GRADIENTS[DEFAULT_TONE];
  // Tint the angled light rays to match the tone.
  const [ray1, ray2] = RAY_COLORS[tone] ?? RAY_COLORS[DEFAULT_TONE];

  return (
    <div
      ref={ref}
      className={cn(className) || undefined}
      style={{
        // Self-contained box model + brand font so the banner never depends on a
        // host/global reset for its sizing or typography.
        boxSizing: "border-box",
        fontFamily: "var(--tesseract-font-body)",
        position: "relative",
        width: "100%",
        overflow: "hidden",
        height: resolvedHeight,
        background: surface,
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
        ...style,
      }}
      {...rest}
    >
      {/* Premium light accent — real animated WebGL light rays (SideRays) streaming
          from the top-LEFT corner (opposite the grid), screen-blended over the dark
          field. Tone-aware tints; reduced-motion freezes on a still frame; degrades
          to just the dark surface where WebGL is unavailable. */}
      {rays && (
        <LightRays
          color1={ray1}
          color2={ray2}
          origin={[0.6, -0.12]}
          direction={[-0.2, 1]}
          className={styles.rays}
        />
      )}

      {/* Animated lattice accent — its original RIGHT side, smaller now (finer
          cells), vertically centered and pushed off-canvas so only a sliver of
          detailed lattice shows, fading inward. */}
      {pattern && (
        <AnimatedGrid
          lineColor="color-mix(in srgb, var(--tesseract-slate-0) 20%, transparent)"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "30%",
            right: "-8%",
            height: "250%",
            pointerEvents: "none",
            mixBlendMode: "screen",
            opacity: 1,
            WebkitMaskImage: "linear-gradient(to left, black 0%, black 26%, transparent 92%)",
            maskImage: "linear-gradient(to left, black 0%, black 26%, transparent 92%)",
          }}
        />
      )}

      {/* Film-grain texture across the whole surface (premium tooth). Static,
          subtle, screen-blended, beneath the content. Shared with Foundations. */}
      <div style={grainStyle} aria-hidden />

      {/* Content — `align="center"` (default) vertically centers the block in
          the banner; `align="top"` lets it hug the top. */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: align === "top" ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: "var(--tesseract-space-3)",
          padding: "var(--tesseract-space-3-5) var(--tesseract-space-4-5)",
        }}
      >
        {/* Left cluster: back button (a small ghost CTA) + the title/subtitle
            block. The back button lives OUTSIDE the text column, so the title and
            subtitle stay left-aligned to each other; `flex-start` centres the back
            button on the TITLE line (the top line) rather than the whole block. */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--tesseract-space-2)", minWidth: 0, flex: 1 }}>
          {showBackButton && (
            <button
              type="button"
              className={styles.back}
              aria-label="Go back"
              onClick={onBack}
              style={{ height: BACK_BOX[ts] }}
            >
              <TPLibraryIcon name={backIcon} variant={backIconVariant} corner={backIconCorner} size={BACK_ICON[ts]} color="currentColor" />
            </button>
          )}

          {/* Title + subtitle block — always left-aligned to each other. */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--tesseract-space-1-5)", minWidth: 0, flex: 1 }}>
            {/* Eyebrow — a small kicker label above the title. */}
            {eyebrow && (
              <span
                style={{
                  color: "color-mix(in srgb, var(--tesseract-slate-0) 70%, transparent)",
                  fontSize: "var(--tesseract-text-body-xs, 12px)",
                  fontWeight: "var(--tesseract-weight-semibold)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {eyebrow}
              </span>
            )}

            {/* Title truncates when the CTAs squeeze the row; the full text
                shows in a tooltip on hover only when it is actually clipped. */}
            <Tooltip content={title} whenTruncated side="bottom" sideOffset={10}>
              <h1
                style={{
                  margin: 0,
                  color: "var(--tesseract-fg-inverse)",
                  fontSize: TITLE_FONT_SIZE[ts],
                  fontWeight: "var(--tesseract-weight-bold)",
                  lineHeight: 1.15,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: 0,
                }}
              >
                {title}
              </h1>
            </Tooltip>

            {/* Subtitle — left-aligned under the title. Truncates the same way. */}
            {subtitle && (
              <Tooltip content={subtitle} whenTruncated side="bottom" sideOffset={8}>
                <p
                  style={{
                    margin: 0,
                    color: "color-mix(in srgb, var(--tesseract-slate-0) 75%, transparent)",
                    fontSize: SUBTITLE_FONT_SIZE[subtitleSize] ?? 13,
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {subtitle}
                </p>
              </Tooltip>
            )}
          </div>
        </div>

        {/* CTAs — vertically centered to the title + subtitle column. */}
        {actions && (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--tesseract-space-2)", flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
});

HeroBanner.displayName = "HeroBanner";
