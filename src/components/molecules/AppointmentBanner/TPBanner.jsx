"use client";

import { NoiseOverlay } from "@/src/components/atoms/NoiseOverlay/NoiseOverlay";
import { TPIconButton } from "@/src/components/atoms/Button/button-system/index.js";
import { ChevronLeft } from "@/src/components/atoms/icons/lucide.jsx";

const BACKGROUND =
  "radial-gradient(99.09% 59.99% at 50% 55.44%, #46286C 0%, #25113E 39.08%, #372153 78.16%, #6C4F90 100%)";

const SIZE_HEIGHT = { sm: 80, md: 120, lg: 160 };

const TITLE_FONT_SIZE = { sm: 18, md: 24, lg: 32 };
const SUBTITLE_FONT_SIZE = { sm: 13, md: 16 };

/**
 * TPBanner — Flexible dark radial-gradient hero banner.
 *
 * Props:
 *   size          "sm" | "md" | "lg"          default "md"
 *   bottomRadius  number                       default 16 (px)
 *   title         string                       required
 *   subtitle      string                       optional
 *   titleSize     "sm" | "md" | "lg"           default "md"
 *   subtitleSize  "sm" | "md"                  default "sm"
 *   showBackButton boolean                     shows ChevronLeft icon-button
 *   chips         string[]                     small pill chips below title
 *   actions       ReactNode                    right side of header
 *   pattern       boolean                      default true
 *   patternOpacity number 0–1                  default 0.75
 *   noise         boolean                      default true
 *   className     string
 */
export function TPBanner({
  size = "md",
  bottomRadius = 16,
  title,
  subtitle,
  titleSize = "md",
  subtitleSize = "sm",
  showBackButton = false,
  chips,
  actions,
  pattern = true,
  patternOpacity = 0.75,
  noise = true,
  className = "",
}) {
  const height = SIZE_HEIGHT[size] ?? SIZE_HEIGHT.md;

  return (
    <div
      className={["relative w-full overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        height,
        background: BACKGROUND,
        borderBottomLeftRadius: bottomRadius,
        borderBottomRightRadius: bottomRadius,
      }}
    >
      {/* Geometric diagonal line pattern */}
      {pattern && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 18px)",
            opacity: patternOpacity,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Noise grain texture */}
      {noise && <NoiseOverlay opacity={0.06} />}

      {/* Content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "16px 18px",
          gap: 4,
        }}
      >
        {/* Header row: back button + title/subtitle + actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          {/* Left: optional back button + title block */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              minWidth: 0,
              flex: 1,
            }}
          >
            {showBackButton && (
              <TPIconButton
                surface="dark"
                size="sm"
                aria-label="Go back"
                icon={<ChevronLeft size={20} />}
                style={{ flexShrink: 0 }}
              />
            )}

            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: TITLE_FONT_SIZE[titleSize] ?? 24,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.75)",
                    fontSize: SUBTITLE_FONT_SIZE[subtitleSize] ?? 13,
                    lineHeight: 1.4,
                    marginTop: 2,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: actions */}
          {actions && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {actions}
            </div>
          )}
        </div>

        {/* Chips row */}
        {chips && chips.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 6,
            }}
          >
            {chips.map((chip) => (
              <span
                key={chip}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
