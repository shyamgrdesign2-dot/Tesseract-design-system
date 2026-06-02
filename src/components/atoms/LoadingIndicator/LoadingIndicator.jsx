"use client";

/**
 * LoadingIndicator — TatvaPractice loading spinner.
 *
 * Three glyphs, all drawn in `currentColor` so they adapt to context
 * (e.g. inside a Button they take the button's text color):
 *   • line-simple   — a clean ring with a rotating arc
 *   • line-spinner  — 12 spokes with a stepped "chase"
 *   • dot-circle    — 8 dots circling
 *
 * Props:
 *   type   "line-simple" | "line-spinner" | "dot-circle"   default "line-simple"
 *   size   "xs" | "sm" | "md" | "lg" | number(px)          default "md"
 *   label  string — shown next to the glyph; also the a11y status text
 */

import "./LoadingIndicator.css";

const SIZE_PX = { xs: 16, sm: 20, md: 24, lg: 32 };

function toPx(size) {
  return typeof size === "number" ? size : SIZE_PX[size] ?? SIZE_PX.md;
}

const polar = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

function LineSimple({ dim }) {
  return (
    <svg
      className="tp-loader__glyph"
      data-type="line-simple"
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function LineSpinner({ dim }) {
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const deg = i * 30 - 90;
    const [x1, y1] = polar(12, 12, 5, deg);
    const [x2, y2] = polar(12, 12, 9.5, deg);
    return { x1, y1, x2, y2, opacity: 0.15 + (i / 11) * 0.85 };
  });
  return (
    <svg
      className="tp-loader__glyph"
      data-type="line-spinner"
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1.toFixed(2)}
          y1={s.y1.toFixed(2)}
          x2={s.x2.toFixed(2)}
          y2={s.y2.toFixed(2)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={s.opacity.toFixed(2)}
        />
      ))}
    </svg>
  );
}

function DotCircle({ dim }) {
  const dots = Array.from({ length: 8 }, (_, i) => {
    const deg = i * 45 - 90;
    const [cx, cy] = polar(12, 12, 8, deg);
    return { cx, cy, opacity: 0.15 + (i / 7) * 0.85 };
  });
  return (
    <svg
      className="tp-loader__glyph"
      data-type="dot-circle"
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.cx.toFixed(2)}
          cy={d.cy.toFixed(2)}
          r="2"
          fill="currentColor"
          opacity={d.opacity.toFixed(2)}
        />
      ))}
    </svg>
  );
}

const GLYPHS = {
  "line-simple": LineSimple,
  "line-spinner": LineSpinner,
  "dot-circle": DotCircle,
};

export function LoadingIndicator({ type = "line-simple", size = "md", label, className = "" }) {
  const dim = toPx(size);
  const Glyph = GLYPHS[type] ?? LineSimple;
  return (
    <div className={["tp-loader", className].filter(Boolean).join(" ")} role="status">
      <Glyph dim={dim} />
      {label ? (
        <span className="tp-loader__label">{label}</span>
      ) : (
        <span className="tp-loader__sr">Loading</span>
      )}
    </div>
  );
}

export default LoadingIndicator;
