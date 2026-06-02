"use client";

import { AnimatedGrid } from "@/src/components/atoms/AnimatedGrid/AnimatedGrid";
import { Tooltip } from "@/src/components/molecules/Tooltip";

const BACKGROUND =
  "radial-gradient(99.09% 59.99% at 50% 55.44%, #46286C 0%, #25113E 39.08%, #372153 78.16%, #6C4F90 100%)";

const SIZE_HEIGHT = { sm: 80, md: 120, lg: 160 };
// Default bottom corner radius scales with size (md = 18px).
const SIZE_RADIUS = { sm: 14, md: 18, lg: 22 };

// Headings come in exactly two sizes: 18px and 24px.
const TITLE_FONT_SIZE = { sm: 18, md: 24 };
const SUBTITLE_FONT_SIZE = { sm: 13, md: 16 };
// Back button scales with the heading and is centered on the heading line.
const BACK_SIZE = { sm: 20, md: 24 };
const BACK_ICON = { sm: 14, md: 18 };

/**
 * TPBanner — The page hero banner. Dark radial-gradient surface with an
 * animated geometric lattice accent (right side, partly off-canvas), an
 * optional back button, and a top-aligned title + subtitle. This is the
 * only banner.
 *
 * Props:
 *   size          "sm" | "md" | "lg"          banner height; default "md"
 *   bottomRadius  number                       overrides the size default (sm 14 / md 18 / lg 22)
 *   title         string                       required
 *   subtitle      string                       optional
 *   titleSize     "sm" (18px) | "md" (24px)    default "md"
 *   subtitleSize  "sm" | "md"                  default "sm"
 *   showBackButton boolean                     back button (centered on the heading)
 *   actions       ReactNode                    CTA slot (dark-surface Button: text / icon / split)
 *   pattern       boolean                      default true — animated lattice accent
 *   className     string
 */
export function TPBanner({
  size = "md",
  bottomRadius,
  title,
  subtitle,
  titleSize = "md",
  subtitleSize = "sm",
  showBackButton = false,
  onBack,
  actions,
  pattern = true,
  className = "",
}) {
  const height = SIZE_HEIGHT[size] ?? SIZE_HEIGHT.md;
  const ts = TITLE_FONT_SIZE[titleSize] ? titleSize : "md";
  const backSize = BACK_SIZE[ts];
  // Explicit bottomRadius wins; otherwise it scales with size (md = 16px).
  const radius = bottomRadius ?? SIZE_RADIUS[size] ?? SIZE_RADIUS.md;

  return (
    <div
      className={className || undefined}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        height,
        background: BACKGROUND,
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
      }}
    >
      {/* Animated lattice accent — larger lattice, vertically centered and
          pushed further off-canvas on the right so only a sliver shows,
          fading inward. Opacity is fixed at 100%. */}
      {pattern && (
        <AnimatedGrid
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "52%",
            right: "-15%",
            height: "320%",
            pointerEvents: "none",
            mixBlendMode: "screen",
            WebkitMaskImage: "linear-gradient(to left, black 0%, black 30%, transparent 94%)",
            maskImage: "linear-gradient(to left, black 0%, black 30%, transparent 94%)",
          }}
        />
      )}

      {/* Content — the block hugs the top of the banner, while the CTAs are
          vertically centered against the whole title + subtitle column. */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 18px",
        }}
      >
        {/* Title + subtitle column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, flex: 1 }}>
          {/* Heading line: back button + title, centered together */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {showBackButton && (
              <button
                type="button"
                aria-label="Go back"
                onClick={onBack}
                style={{
                  flexShrink: 0,
                  width: backSize,
                  height: backSize,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  border: "none",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                }}
              >
                {/* Same chevron as the accordion arrow, pointing left. */}
                <svg
                  width={BACK_ICON[ts]}
                  height={BACK_ICON[ts]}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Title truncates when the CTAs squeeze the row; the full text
                shows in a tooltip on hover only when it is actually clipped. */}
            <Tooltip content={title} whenTruncated side="bottom" sideOffset={10}>
              <h1
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: TITLE_FONT_SIZE[ts],
                  fontWeight: 700,
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
                  color: "rgba(255,255,255,0.75)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
