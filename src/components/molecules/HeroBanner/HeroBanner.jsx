"use client";

import * as React from "react";
import { AnimatedGrid } from "@/src/components/atoms/AnimatedGrid/AnimatedGrid";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { Tooltip } from "@/src/components/molecules/Tooltip";
import { cn } from "@/src/hooks/utils";
import styles from "./HeroBanner.module.scss";

// Surface gradient by tone — token-only (no raw hex). Deeper + more premium than
// before: the light focus sits toward the LEFT (under the content) and the bright
// edge is dropped for a richer, darker field. The top-right glow + light rays
// (below) supply the premium highlight. Other tones reskin per page/specialty.
const TONE_GRADIENTS = {
  // Deep, premium PURPLE — matches the reference: a rich dark violet, darker than
  // the original (the bright edge is gone) but unmistakably purple, not blue. A
  // soft violet-800 sheen toward the top-centre lifts it off pure violet-900.
  violet:
    "radial-gradient(125% 150% at 46% 30%, var(--tesseract-violet-800) 0%, var(--tesseract-violet-900) 48%, var(--tesseract-violet-900) 100%)",
  blue:
    "radial-gradient(125% 150% at 46% 30%, var(--tesseract-blue-800) 0%, var(--tesseract-blue-900) 48%, var(--tesseract-blue-900) 100%)",
  slate:
    "radial-gradient(125% 155% at 44% 32%, var(--tesseract-slate-800) 0%, var(--tesseract-slate-900) 52%, var(--tesseract-slate-900) 100%)",
  dark:
    "radial-gradient(125% 155% at 44% 32%, var(--tesseract-slate-800) 0%, var(--tesseract-slate-900) 50%, var(--tesseract-slate-900) 100%)",
};
const DEFAULT_TONE = "violet";

const SIZE_HEIGHT = { sm: 80, md: 120, lg: 160 };
// Default bottom corner radius scales with size (md = 24px). Soft, generous
// corners; the practical ceiling is 42px.
const SIZE_RADIUS = { sm: 20, md: 24, lg: 32 };
const MAX_RADIUS = 42;

// Headings come in exactly two sizes: 18px and 24px.
const TITLE_FONT_SIZE = { sm: 18, md: 24 };
const SUBTITLE_FONT_SIZE = { sm: 13, md: 16 };
// Back button scales with the heading and is centered on the heading line.
const BACK_SIZE = { sm: 20, md: 24 };
const BACK_ICON = { sm: 14, md: 18 };

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
 *   tone          "violet" | "blue" | "slate" | "dark"   gradient tone (token-only); default "violet" = current look
 *   background    string                       full CSS background override (wins over tone); default undefined
 *   eyebrow       string | node                small kicker label above the title; default none
 *   align         "center" | "top"             vertical alignment of the content block; default "center" = current
 *   title         string                       required
 *   subtitle      string                       optional
 *   titleSize     "sm" (18px) | "md" (24px)    default "md"
 *   subtitleSize  "sm" | "md"                  default "sm"
 *   showBackButton boolean                     back button (centered on the heading)
 *   backIcon      string                       back glyph name; default "arrow-left"
 *   backIconVariant "linear" | …               back glyph style; default "linear"
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
  backIcon = "arrow-left",
  backIconVariant = "linear",
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
  const backSize = BACK_SIZE[ts];
  // Explicit bottomRadius wins; otherwise it scales with size (md = 24px).
  // Clamped to a 42px ceiling so the banner corners stay sane.
  const radius = Math.min(MAX_RADIUS, bottomRadius ?? SIZE_RADIUS[size] ?? SIZE_RADIUS.md);
  // Explicit `background` string wins; otherwise pick the tone gradient.
  const surface = background ?? TONE_GRADIENTS[tone] ?? TONE_GRADIENTS[DEFAULT_TONE];

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
      {/* Premium light accent — a soft violet→blue corner glow with a fine fan of
          light rays sweeping from the top-right. Pure CSS, screen-blended over the
          dark field; reduced-motion stills the sway. */}
      {/* Soft light leak — bleeds in from the top-LEFT corner (opposite the grid). */}
      {rays && <div className={styles.leak} aria-hidden />}

      {/* Animated lattice accent — its original RIGHT side, smaller now (finer
          cells), vertically centered and pushed off-canvas so only a sliver of
          detailed lattice shows, fading inward. */}
      {pattern && (
        <AnimatedGrid
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "30%",
            right: "-8%",
            height: "250%",
            pointerEvents: "none",
            mixBlendMode: "screen",
            opacity: 0.85,
            WebkitMaskImage: "linear-gradient(to left, black 0%, black 26%, transparent 92%)",
            maskImage: "linear-gradient(to left, black 0%, black 26%, transparent 92%)",
          }}
        />
      )}

      {/* Content — `align="center"` (default) vertically centers the block in
          the banner; `align="top"` lets it hug the top. The CTAs stay centered
          against the whole title + subtitle column. */}
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
        {/* Title + subtitle column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--tesseract-space-1-5)", minWidth: 0, flex: 1 }}>
          {/* Eyebrow — a small kicker label above the title. */}
          {eyebrow && (
            <span
              style={{
                marginLeft: showBackButton ? backSize + 8 : 0,
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

          {/* Heading line: back button + title, centered together */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--tesseract-space-2)", minWidth: 0 }}>
            {showBackButton && (
              // Reuse the Button atom (dark-surface, ghost, icon-only) instead of
              // a hand-rolled <button> with inline styles.
              <Button
                surface="dark"
                variant="tonal"
                theme="neutral"
                size={ts === "sm" ? "sm" : "md"}
                aria-label="Go back"
                onClick={onBack}
                icon={<TPLibraryIcon name={backIcon} variant={backIconVariant} size={BACK_ICON[ts]} color="currentColor" />}
              />
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
          </div>

          {/* Subtitle — below the heading, aligned under the title text.
              Truncates the same way; tooltip on hover only when clipped. */}
          {subtitle && (
            <Tooltip content={subtitle} whenTruncated side="bottom" sideOffset={8}>
              <p
                style={{
                  margin: 0,
                  marginLeft: showBackButton ? backSize + 8 : 0,
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
