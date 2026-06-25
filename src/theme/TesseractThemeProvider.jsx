"use client";

/**
 * TesseractThemeProvider — the single theming surface products consume. It carries the
 * whole theme: foundation tokens (colours, type, spacing, radius, shadow),
 * component tokens, breakpoints, and the colour scheme. It provides them via
 * context (read with useTheme / useBreakpoint / useComponentTokens) AND scopes
 * the relevant CSS variables onto a wrapper, so existing components — which read
 * `var(--tesseract-*)` — re-theme with no prop changes.
 *
 *   <TesseractThemeProvider theme={{ foundation: { colors: { blue: { 500: "#0EA5E9" } } },
 *                             components: { button: { radius: "14px" } } }}
 *                    colorScheme="dark">
 *     <App />
 *   </TesseractThemeProvider>
 *
 * Props:
 *   theme        deep-partial of the default theme (foundation / components /
 *                breakpoints) — merged over the defaults.
 *   colorScheme  "light" | "dark" | "system"                    default "light"
 *   tokens       { tokenName: value } shorthand (keys without `--tesseract-`)
 *   vars         { "--css-var": value } raw escape hatch
 *   as, className, style, ...rest
 *
 * useTheme() → { theme, colorScheme, setColorScheme, breakpoint }. Providers nest.
 */

import * as React from "react";
import { ThemeContext } from "./context";
import { defaultTheme } from "./defaultTheme";
import { setIconBaseUrl } from "../components/atoms/icons/tp/iconBase";

const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
function deepMerge(base, over) {
  if (!isObj(over)) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(over)) out[k] = isObj(base?.[k]) && isObj(over[k]) ? deepMerge(base[k], over[k]) : over[k];
  return out;
}

// Dark scheme: reverse the neutral ramp, soften the *-50 tints, and LIFT the
// accent ramps two steps lighter. The lift is the key to legible CTAs on dark:
// without it the accent mid-tones (blue-500 etc.) stay too dark for a dark
// surface, so solid fills go dark-on-dark (slate-0 text auto-flips to near-black)
// and outline/ghost foregrounds disappear. Lifting makes solid fills light
// (paired with the auto-dark text = readable dark-on-light) and outline/ghost
// text bright. One ramp change fixes every accent-coloured component at once.
const SLATE = ["#FFFFFF", "#FAFAFB", "#F1F1F5", "#E2E2EA", "#D0D5DD", "#A2A2A8", "#717179", "#545460", "#454551", "#2C2C35", "#171725"];
const SLATE_STEPS = ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
// Each accent ramp listed light→dark (50→900). In dark mode steps 400/500/600/700
// are remapped to the value two steps lighter (e.g. 500 → the 300 value).
const ACCENT_RAMPS = {
  blue:    ["#EEEEFF", "#D8D8FA", "#B5B4F2", "#8E8DE8", "#6C6BDE", "#4B4AD5", "#3C3BB5", "#2E2D96", "#212077", "#161558"],
  violet:  ["#FAF5FE", "#EDDFF7", "#DBBFEF", "#C89FE7", "#BA7DE9", "#A461D8", "#8A4DBB", "#703A9E", "#572A81", "#3E1C64"],
  success: ["#ECFDF5", "#D1FAE5", "#A7F3D0", "#6EE7B7", "#34D399", "#10B981", "#059669", "#047857", "#065F46", "#064E3B"],
  warning: ["#FFFBEB", "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F"],
  error:   ["#FFF1F2", "#FFE4E6", "#FECDD3", "#FDA4AF", "#FB7185", "#E11D48", "#C8102E", "#9F1239", "#881337", "#4C0519"],
};
const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const DARK_VARS = (() => {
  const v = {};
  SLATE_STEPS.forEach((s, i) => { v[`--tesseract-slate-${s}`] = SLATE[SLATE.length - 1 - i]; });
  // Lift the foreground/fill steps (400–700) two stops lighter for dark surfaces.
  for (const [name, ramp] of Object.entries(ACCENT_RAMPS)) {
    [400, 500, 600, 700].forEach((step) => {
      const idx = RAMP_STEPS.indexOf(step);
      v[`--tesseract-${name}-${step}`] = ramp[idx - 2];
    });
  }
  Object.assign(v, {
    "--tesseract-blue-50": "rgba(75, 74, 213, 0.22)", "--tesseract-violet-50": "rgba(164, 97, 216, 0.20)",
    "--tesseract-success-50": "rgba(16, 185, 129, 0.16)", "--tesseract-warning-50": "rgba(245, 158, 11, 0.16)", "--tesseract-error-50": "rgba(225, 29, 72, 0.16)",
  });
  return v;
})();

// Map component tokens onto the CSS variables components actually read.
function componentVars(components) {
  const v = {};
  if (components?.button?.radius) v["--tesseract-btn-radius"] = components.button.radius;
  if (components?.input?.radius) v["--tesseract-input-radius"] = components.input.radius;
  if (components?.dropdown?.radius) v["--tesseract-dropdown-radius"] = components.dropdown.radius;
  if (components?.badge?.radius) v["--tesseract-badge-radius"] = components.badge.radius;
  return v;
}

// CSS-variable overrides emitted onto the wrapper — only what the product passed
// (plus the dark remap), so the global token layer stays the source of defaults.
function buildVars(scheme, theme, tokens, vars) {
  const out = { colorScheme: scheme === "dark" ? "dark" : "light" };
  if (scheme === "dark") Object.assign(out, DARK_VARS);
  const colors = theme?.foundation?.colors;
  if (colors) for (const [rampName, steps] of Object.entries(colors)) {
    if (isObj(steps)) for (const [step, val] of Object.entries(steps)) out[`--tesseract-${rampName}-${step}`] = val;
  }
  Object.assign(out, componentVars(theme?.components));
  if (tokens) for (const [k, val] of Object.entries(tokens)) out[k.startsWith("--") ? k : `--tesseract-${k}`] = val;
  if (vars) Object.assign(out, vars);
  return out;
}

function useResolvedScheme(colorScheme) {
  const read = () =>
    typeof window !== "undefined" && window.matchMedia
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : "light";
  const [sys, setSys] = React.useState(read);
  React.useEffect(() => {
    if (colorScheme !== "system" || typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSys(mq.matches ? "dark" : "light");
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [colorScheme]);
  return colorScheme === "system" ? sys : colorScheme;
}

// Active breakpoint name from window width against the theme's breakpoints.
function useActiveBreakpoint(breakpoints) {
  const pick = (w) => {
    let name = Object.keys(breakpoints)[0];
    for (const [n, min] of Object.entries(breakpoints)) if (w >= min) name = n;
    return name;
  };
  const [bp, setBp] = React.useState(() => (typeof window !== "undefined" ? pick(window.innerWidth) : "desktop"));
  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onResize = () => setBp(pick(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(breakpoints)]);
  return bp;
}

export function TesseractThemeProvider({
  theme: themeProp,
  colorScheme = "light",
  tokens,
  vars,
  as: Tag = "div",
  className,
  style,
  children,
  ...rest
}) {
  const parent = React.useContext(ThemeContext);
  const isRoot = !parent.__provided;
  const [override, setOverride] = React.useState(null);
  const resolved = useResolvedScheme(override ?? colorScheme);

  // Point the icon resolver at the theme's CDN base (global; set once per app).
  React.useEffect(() => {
    if (themeProp?.iconBaseUrl) setIconBaseUrl(themeProp.iconBaseUrl);
  }, [themeProp?.iconBaseUrl]);

  const theme = React.useMemo(() => deepMerge(defaultTheme, { ...themeProp, colorScheme: resolved }), [themeProp, resolved]);
  const breakpoint = useActiveBreakpoint(theme.breakpoints);
  const cssVars = React.useMemo(() => buildVars(resolved, themeProp, tokens, vars), [resolved, themeProp, tokens, vars]);

  // The outermost provider mirrors its scheme + CSS variables onto the document
  // root, so content that portals to document.body (Dropdown / Tooltip menus,
  // ConfirmDialog, flyouts) inherits the same theme as the scoped wrapper instead
  // of falling back to the light defaults. Nested providers stay wrapper-scoped
  // (e.g. side-by-side light/dark demos), so this never clobbers local overrides.
  React.useEffect(() => {
    if (!isRoot || typeof document === "undefined") return undefined;
    const root = document.documentElement;
    const prevAttr = root.getAttribute("data-tp-theme");
    const prevColorScheme = root.style.colorScheme;
    const keys = Object.keys(cssVars).filter((k) => k.startsWith("--"));
    const prev = {};
    keys.forEach((k) => { prev[k] = root.style.getPropertyValue(k); root.style.setProperty(k, cssVars[k]); });
    root.setAttribute("data-tp-theme", resolved);
    root.style.colorScheme = resolved === "dark" ? "dark" : "light";
    return () => {
      keys.forEach((k) => { if (prev[k]) root.style.setProperty(k, prev[k]); else root.style.removeProperty(k); });
      if (prevAttr) root.setAttribute("data-tp-theme", prevAttr); else root.removeAttribute("data-tp-theme");
      root.style.colorScheme = prevColorScheme;
    };
  }, [isRoot, resolved, cssVars]);

  const ctx = React.useMemo(
    () => ({ theme, colorScheme: resolved, setColorScheme: setOverride, breakpoint, __provided: true }),
    [theme, resolved, breakpoint],
  );

  return (
    <ThemeContext.Provider value={ctx}>
      <Tag data-tp-theme={resolved} className={className} style={{ ...cssVars, ...style }} {...rest}>
        {children}
      </Tag>
    </ThemeContext.Provider>
  );
}

TesseractThemeProvider.displayName = "TesseractThemeProvider";
export default TesseractThemeProvider;
