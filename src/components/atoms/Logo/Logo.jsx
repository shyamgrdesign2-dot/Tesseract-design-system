"use client";

/**
 * Logo — the TatvaPractice brand mark. Renders the shared SVGs (served from
 * /public/brand) as CSS masks so the same asset can be recoloured per surface.
 *
 * Props:
 *   variant  "lockup" (symbol + wordmark) | "symbol" | "wordmark"   default "lockup"
 *   tone     "gradient" (brand violet→purple) | "dark" (slate-900, for light
 *            surfaces) | "light" (white, for dark surfaces) | "violet" | "blue"
 *            default "gradient"
 *   height   px — the mark scales to this height; width is derived from the
 *            artwork aspect ratio.                                  default 32
 *   title    accessible label                                       default "TatvaPractice"
 *   className, style
 */

const SYMBOL = "/brand/tatvapractice-symbol.svg";
const WORDMARK = "/brand/tatvapractice-wordmark.svg";
const SYMBOL_AR = 78 / 112;   // width / height
const WORDMARK_AR = 117 / 20; // width / height

const TONES = {
  gradient: "linear-gradient(90deg, #5347d8 0%, #9d2af7 100%)",
  dark: "var(--tp-slate-900, #171725)",
  light: "var(--tp-slate-0, #ffffff)",
  violet: "var(--tp-violet-500, #a461d8)",
  blue: "var(--tp-blue-500, #4b4ad5)",
};

function mark(src, w, h, tone) {
  const m = `url("${src}") no-repeat center / contain`;
  return {
    display: "inline-block",
    width: w,
    height: h,
    flexShrink: 0,
    background: TONES[tone] || TONES.gradient,
    WebkitMask: m,
    mask: m,
  };
}

export function Logo({ variant = "lockup", tone = "gradient", height = 32, title = "TatvaPractice", className, style }) {
  const wrap = { display: "inline-flex", alignItems: "center", ...style };

  if (variant === "symbol") {
    return (
      <span role="img" aria-label={title} className={className} style={wrap}>
        <span aria-hidden style={mark(SYMBOL, Math.round(height * SYMBOL_AR), height, tone)} />
      </span>
    );
  }
  if (variant === "wordmark") {
    return (
      <span role="img" aria-label={title} className={className} style={wrap}>
        <span aria-hidden style={mark(WORDMARK, Math.round(height * WORDMARK_AR), height, tone)} />
      </span>
    );
  }

  // Lockup — symbol at full height, wordmark scaled to read alongside it.
  const symH = height;
  const wmH = Math.round(height * 0.62);
  return (
    <span role="img" aria-label={title} className={className} style={{ ...wrap, gap: Math.round(height * 0.26) }}>
      <span aria-hidden style={mark(SYMBOL, Math.round(symH * SYMBOL_AR), symH, tone)} />
      <span aria-hidden style={mark(WORDMARK, Math.round(wmH * WORDMARK_AR), wmH, tone)} />
    </span>
  );
}

Logo.displayName = "Logo";
export default Logo;
