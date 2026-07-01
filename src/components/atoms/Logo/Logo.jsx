"use client";

/**
 * Logo — the Tatva brand marks.
 *
 * SELF-CONTAINED: the brand artwork lives beside this component as real SVG files
 * in ./assets and is bundled in (imported below), so the atom needs no /public
 * hosting. Each mark is painted as a CSS mask so the same artwork recolours per
 * surface.
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
 *   basePath string — OPTIONAL override. If set, load the brand SVGs from this URL
 *            root as `<basePath>/<file>.svg` (e.g. serve them from a CDN) instead
 *            of the bundled copy. Omit to use the bundled assets (default).
 *   title    accessible label (defaults to the brand name)
 *   className, style
 */

// The brand artwork — real SVG files stored in ./assets, imported as raw markup
// and inlined as data-URIs so the mark ships inside the component (no hosting).
import symbolSvg from "./assets/tatvapractice-symbol.svg?raw";
import practiceSvg from "./assets/tatvapractice-wordmark.svg?raw";
import careSvg from "./assets/tatvacare-wordmark.svg?raw";

const toDataUri = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

// Each variant: its filename (for the basePath override), bundled data-URI, and
// aspect ratio (width / height, read from the SVG's viewBox).
const SYMBOL = { file: "tatvapractice-symbol.svg", data: toDataUri(symbolSvg), ar: 78 / 112 };
const WORDMARKS = {
  practice: { file: "tatvapractice-wordmark.svg", data: toDataUri(practiceSvg), ar: 600 / 105, label: "TatvaPractice" },
  care:     { file: "tatvacare-wordmark.svg",     data: toDataUri(careSvg),     ar: 600 / 146, label: "TatvaCare" },
};

const TONES = {
  // Brand blue→violet ramp, tokenized to the nearest --tesseract-* stops.
  gradient: "linear-gradient(90deg, var(--tesseract-blue-500) 0%, var(--tesseract-violet-500) 100%)",
  dark: "var(--tesseract-slate-900)",
  light: "var(--tesseract-slate-0)",
  violet: "var(--tesseract-violet-500)",
  blue: "var(--tesseract-blue-500)",
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

export function Logo({ variant = "wordmark", brand = "practice", tone = "gradient", height = 32, width, maxWidth, color, basePath, title, className, style }) {
  const wrap = { display: "inline-flex", alignItems: "center", ...style };
  const isSymbol = variant === "symbol";
  const word = WORDMARKS[brand] || WORDMARKS.practice;
  const asset = isSymbol ? SYMBOL : word;
  // Default: the bundled data-URI (self-contained). A `basePath` swaps to a URL.
  const src = basePath ? `${String(basePath).replace(/\/$/, "")}/${asset.file}` : asset.data;
  const ar = asset.ar;
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
