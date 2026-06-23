"use client";

/**
 * Logo — the Tatva brand marks. Renders the shared SVGs (served from
 * /public/brand) as CSS masks so the same artwork can be recoloured per surface.
 *
 * Two SEPARATE marks (never combined into one lockup):
 *   variant "wordmark" — the full brand logo (symbol + word)          default
 *   variant "symbol"   — the monochrome symbol on its own
 *
 * Two brand wordmarks (the symbol is shared):
 *   brand "practice" — TatvaPractice                                  default
 *   brand "care"     — TatvaCare
 *
 * Props:
 *   variant  "wordmark" | "symbol"                                  default "wordmark"
 *   brand    "practice" | "care"                                    default "practice"
 *   tone     "gradient" (brand violet→purple) | "dark" (slate-900, for light
 *            surfaces) | "light" (white, for dark surfaces) | "violet" | "blue"
 *            default "gradient"
 *   height   px — the mark scales to this height; width is derived from the
 *            artwork aspect ratio.                                  default 32
 *   title    accessible label (defaults to the brand name)
 *   className, style
 */

const SYMBOL = "/brand/tatvapractice-symbol.svg";
const SYMBOL_AR = 78 / 112; // width / height

// Per-brand wordmark artwork + aspect ratio (from each SVG's viewBox).
const WORDMARKS = {
  practice: { src: "/brand/tatvapractice-wordmark.svg", ar: 600 / 105, label: "TatvaPractice" },
  care:     { src: "/brand/tatvacare-wordmark.svg",     ar: 600 / 146, label: "TatvaCare" },
};

const TONES = {
  gradient: "linear-gradient(90deg, #5347d8 0%, #9d2af7 100%)",
  dark: "var(--tesseract-slate-900, #171725)",
  light: "var(--tesseract-slate-0, #ffffff)",
  violet: "var(--tesseract-violet-500, #a461d8)",
  blue: "var(--tesseract-blue-500, #4b4ad5)",
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

export function Logo({ variant = "wordmark", brand = "practice", tone = "gradient", height = 32, title, className, style }) {
  const wrap = { display: "inline-flex", alignItems: "center", ...style };
  const isSymbol = variant === "symbol";
  const word = WORDMARKS[brand] || WORDMARKS.practice;
  const src = isSymbol ? SYMBOL : word.src;
  const ar = isSymbol ? SYMBOL_AR : word.ar;
  const w = Math.round(height * ar);
  const label = title || word.label;
  return (
    <span role="img" aria-label={label} className={className} style={wrap}>
      <span aria-hidden style={mark(src, w, height, tone)} />
    </span>
  );
}

Logo.displayName = "Logo";
export default Logo;
