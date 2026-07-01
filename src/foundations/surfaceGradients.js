// Premium SURFACE GRADIENTS — the shiny, layered dark gradients used by the
// HeroBanner, exposed here as one shared, token-only source of truth so the
// component and the Foundations docs can't drift. Two tones only: violet + blue.
//
// Each value layers (top → base):
//   1 · a soft diagonal sheen band (a highlight, like light on glass)
//   2 · two natural, asymmetric highlight pools (a corner-leak feel), light
//       shifted centre-right so a title on the left sits on a calm area
//   3 · the dark field — the tone's -900 focal falling to near-black (slate-900)
// A companion film-GRAIN overlay (below) adds tactile texture; on the HeroBanner
// the animated <LightRays/> then drifts a soft glow on top.

export const SURFACE_GRADIENTS = {
  violet: `
    linear-gradient(118deg, transparent 0%,
      color-mix(in srgb, var(--tesseract-violet-600) 18%, transparent) 34%,
      color-mix(in srgb, var(--tesseract-violet-400) 12%, transparent) 47%,
      color-mix(in srgb, var(--tesseract-violet-700) 14%, transparent) 60%,
      transparent 84%),
    radial-gradient(52% 125% at 60% -18%,
      color-mix(in srgb, var(--tesseract-violet-600) 30%, transparent) 0%,
      color-mix(in srgb, var(--tesseract-violet-800) 13%, transparent) 34%,
      transparent 60%),
    radial-gradient(24% 78% at 34% -8%,
      color-mix(in srgb, var(--tesseract-violet-500) 14%, transparent) 0%,
      transparent 54%),
    radial-gradient(125% 150% at 50% 42%,
      color-mix(in srgb, var(--tesseract-violet-900) 82%, var(--tesseract-slate-900)) 0%,
      color-mix(in srgb, var(--tesseract-violet-900) 40%, var(--tesseract-slate-900)) 52%,
      color-mix(in srgb, var(--tesseract-violet-900) 8%, var(--tesseract-slate-900)) 100%)`,
  blue: `
    linear-gradient(118deg, transparent 0%,
      color-mix(in srgb, var(--tesseract-blue-600) 18%, transparent) 34%,
      color-mix(in srgb, var(--tesseract-blue-400) 12%, transparent) 47%,
      color-mix(in srgb, var(--tesseract-blue-700) 14%, transparent) 60%,
      transparent 84%),
    radial-gradient(52% 125% at 60% -18%,
      color-mix(in srgb, var(--tesseract-blue-500) 38%, transparent) 0%,
      color-mix(in srgb, var(--tesseract-blue-700) 17%, transparent) 34%,
      transparent 60%),
    radial-gradient(24% 78% at 34% -8%,
      color-mix(in srgb, var(--tesseract-blue-400) 20%, transparent) 0%,
      transparent 54%),
    radial-gradient(125% 150% at 50% 42%,
      color-mix(in srgb, var(--tesseract-blue-700) 62%, var(--tesseract-blue-900)) 0%,
      color-mix(in srgb, var(--tesseract-blue-900) 74%, var(--tesseract-slate-900)) 55%,
      color-mix(in srgb, var(--tesseract-blue-900) 16%, var(--tesseract-slate-900)) 100%)`,
};

// Light-ray tint per tone (for the HeroBanner <LightRays/>) — the more saturated
// 300s so the glow reads coloured, not bleached to white.
export const SURFACE_RAY_COLORS = {
  violet: ["var(--tesseract-violet-300)", "var(--tesseract-blue-300)"],
  blue: ["var(--tesseract-blue-300)", "var(--tesseract-violet-300)"],
};

export const SURFACE_TONES = Object.keys(SURFACE_GRADIENTS);
export const DEFAULT_SURFACE_TONE = "violet";

// Film grain — a fine fractal-noise texture. 'screen' blend keeps it visible as
// tactile grain even on the dark field (unlike overlay/soft-light, which the
// dark base suppresses). Static, so no perf / reduced-motion concern.
export const GRAIN_IMAGE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Inline-style overlay for the grain layer (absolute, covers the surface).
export const grainStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  opacity: 0.09,
  mixBlendMode: "screen",
  backgroundImage: GRAIN_IMAGE,
  backgroundSize: "120px 120px",
};
