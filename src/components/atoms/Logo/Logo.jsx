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
 *   width / maxWidth  px — optional width-based sizing; height then derives from
 *            the aspect ratio. `width` sets it outright; `maxWidth` only caps it.
 *   color    string — overrides the closed TONES lookup with an arbitrary brand
 *            colour (any CSS color / gradient). Falls back to `tone`.
 *   basePath string — prefixes the SVG asset paths so consumers serving the
 *            brand assets from a CDN / different root can redirect. default "/brand"
 *   title    accessible label (defaults to the brand name)
 *   className, style
 */

// Filenames relative to `basePath` (default "/brand").
const SYMBOL_FILE = "tatvapractice-symbol.svg";
const SYMBOL_AR = 78 / 112; // width / height

// Per-brand wordmark artwork + aspect ratio (from each SVG's viewBox).
const WORDMARKS = {
  practice: { file: "tatvapractice-wordmark.svg", ar: 600 / 105, label: "TatvaPractice" },
  care:     { file: "tatvacare-wordmark.svg",     ar: 600 / 146, label: "TatvaCare" },
};

const TONES = {
  // Brand blue→violet ramp, tokenized to the nearest --tesseract-* stops.
  gradient: "linear-gradient(90deg, var(--tesseract-blue-500, #4b4ad5) 0%, var(--tesseract-violet-500, #a461d8) 100%)",
  dark: "var(--tesseract-slate-900, #171725)",
  light: "var(--tesseract-slate-0, #ffffff)",
  violet: "var(--tesseract-violet-500, #a461d8)",
  blue: "var(--tesseract-blue-500, #4b4ad5)",
};

function mark(src, w, h, paint) {
  const m = `url("${src}") no-repeat center / contain`;
  return {
    display: "inline-block",
    width: w,
    height: h,
    flexShrink: 0,
    background: paint,
    WebkitMask: m,
    mask: m,
  };
}

export function Logo({ variant = "wordmark", brand = "practice", tone = "gradient", height = 32, width, maxWidth, color, basePath = "/brand", title, className, style }) {
  const wrap = { display: "inline-flex", alignItems: "center", ...style };
  const isSymbol = variant === "symbol";
  const word = WORDMARKS[brand] || WORDMARKS.practice;
  const root = String(basePath).replace(/\/$/, "");
  const src = `${root}/${isSymbol ? SYMBOL_FILE : word.file}`;
  const ar = isSymbol ? SYMBOL_AR : word.ar;
  // Width-based sizing wins when provided; otherwise derive width from height.
  const h = width != null ? Math.round(width / ar) : height;
  const w = width != null ? width : Math.round(height * ar);
  const paint = color || TONES[tone] || TONES.gradient;
  const label = title || word.label;
  return (
    <span role="img" aria-label={label} className={className} style={wrap}>
      <span aria-hidden style={{ ...mark(src, w, h, paint), ...(maxWidth != null ? { maxWidth } : null) }} />
    </span>
  );
}

Logo.displayName = "Logo";
export default Logo;
