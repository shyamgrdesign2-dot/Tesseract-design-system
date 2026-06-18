// createTheme — derive a complete Tesseract theme from a tiny seed.
//
// Inspired by Razorpay Blade's createTheme: instead of hand-writing every token,
// you pass a brand colour (and optionally a few accents / radius / fonts) and this
// generates the full 50→900 colour ramps + component knobs. The result is a normal
// deep-partial theme — feed it straight to <TPThemeProvider theme={…}>.
//
//   import { createTheme } from "@/src/theme/createTheme";
//   const theme = createTheme({ brand: "#0EA5E9", radius: 14 });
//   <TPThemeProvider theme={theme}><App/></TPThemeProvider>
//
// Seed fields (all optional):
//   brand     primary colour — single hex (ramp auto-generated) OR a full ramp
//   accent    secondary/violet colour (hex | ramp)
//   success / warning / error   semantic colours (hex | ramp)
//   neutral   the slate ramp seed (hex | ramp); white (slate-0) is kept
//   radius    number(px) | string — applied to button/input/card/dropdown
//   fontBody / fontHeading   font-family strings
//   colorScheme  "light" | "dark" | "system"
//   extend    a raw deep-partial theme, merged last for full control

const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
function deepMerge(base, over) {
  if (!isObj(over)) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(over)) out[k] = isObj(base?.[k]) && isObj(over[k]) ? deepMerge(base[k], over[k]) : over[k];
  return out;
}

// ── Colour math (sRGB linear mix — good enough for a design seed) ──
function hexToRgb(hex) {
  const h = String(hex).replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
const clamp = (v) => Math.max(0, Math.min(255, v));
function rgbToHex(rgb) {
  return "#" + rgb.map((v) => clamp(Math.round(v)).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function mix(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
}

const WHITE = "#FFFFFF", BLACK = "#000000";

/**
 * Generate a 50→900 ramp from a single base colour placed at step 500.
 * 50–400 tint toward white; 600–900 shade toward black.
 */
export function ramp(base) {
  return {
    50: mix(base, WHITE, 0.92),
    100: mix(base, WHITE, 0.84),
    200: mix(base, WHITE, 0.68),
    300: mix(base, WHITE, 0.48),
    400: mix(base, WHITE, 0.24),
    500: base,
    600: mix(base, BLACK, 0.16),
    700: mix(base, BLACK, 0.32),
    800: mix(base, BLACK, 0.48),
    900: mix(base, BLACK, 0.62),
  };
}

const toRamp = (input) => (typeof input === "string" ? ramp(input) : input);

export function createTheme(seed = {}) {
  const { brand, accent, success, warning, error, neutral, radius, fontBody, fontHeading, colorScheme, extend } = seed;

  const colors = {};
  if (brand) colors.blue = toRamp(brand); // `blue` is the brand/primary ramp in this DS
  if (accent) colors.violet = toRamp(accent);
  if (success) colors.success = toRamp(success);
  if (warning) colors.warning = toRamp(warning);
  if (error) colors.error = toRamp(error);
  if (neutral) colors.slate = { 0: "#FFFFFF", ...toRamp(neutral) };

  const typography = {};
  if (fontBody) typography.fontBody = fontBody;
  if (fontHeading) typography.fontHeading = fontHeading;

  const foundation = {};
  if (Object.keys(colors).length) foundation.colors = colors;
  if (Object.keys(typography).length) foundation.typography = typography;

  const theme = {};
  if (Object.keys(foundation).length) theme.foundation = foundation;
  if (radius != null) {
    const r = typeof radius === "number" ? `${radius}px` : radius;
    theme.components = { button: { radius: r }, input: { radius: r }, card: { radius: r }, dropdown: { radius: r }, badge: { radius: r } };
  }
  if (colorScheme) theme.colorScheme = colorScheme;

  return extend ? deepMerge(theme, extend) : theme;
}

export default createTheme;
