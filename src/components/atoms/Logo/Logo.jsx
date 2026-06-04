"use client";

/**
 * Logo — the TatvaPractice brand mark. Renders the shared SVGs (served from
 * /public/brand) as CSS masks so the same asset can be recoloured per surface.
 *
 * Two SEPARATE marks (never combined into one lockup):
 *   variant "wordmark" — the full TatvaPractice logo (the actual logo)  default
 *   variant "symbol"   — the monochrome symbol on its own
 *
 * Props:
 *   variant  "wordmark" | "symbol"                                  default "wordmark"
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

export function Logo({ variant = "wordmark", tone = "gradient", height = 32, title = "TatvaPractice", className, style }) {
  const wrap = { display: "inline-flex", alignItems: "center", ...style };
  const isSymbol = variant === "symbol";
  const src = isSymbol ? SYMBOL : WORDMARK;
  const w = Math.round(height * (isSymbol ? SYMBOL_AR : WORDMARK_AR));
  return (
    <span role="img" aria-label={title} className={className} style={wrap}>
      <span aria-hidden style={mark(src, w, height, tone)} />
    </span>
  );
}

Logo.displayName = "Logo";
export default Logo;
