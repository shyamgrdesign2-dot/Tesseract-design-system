"use client";

/**
 * TPThemeProvider — the single theming surface products consume. It carries the
 * whole theme: foundation tokens (colours, type, spacing, radius, shadow),
 * component tokens, breakpoints, and the colour scheme. It provides them via
 * context (read with useTheme / useBreakpoint / useComponentTokens) AND scopes
 * the relevant CSS variables onto a wrapper, so existing components — which read
 * `var(--tp-*)` — re-theme with no prop changes.
 *
 *   <TPThemeProvider theme={{ foundation: { colors: { blue: { 500: "#0EA5E9" } } },
 *                             components: { button: { radius: "14px" } } }}
 *                    colorScheme="dark">
 *     <App />
 *   </TPThemeProvider>
 *
 * Props:
 *   theme        deep-partial of the default theme (foundation / components /
 *                breakpoints) — merged over the defaults.
 *   colorScheme  "light" | "dark" | "system"                    default "light"
 *   tokens       { tokenName: value } shorthand (keys without `--tp-`)
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

// Dark scheme: reverse the neutral ramp + soften the *-50 tints.
const SLATE = ["#FFFFFF", "#FAFAFB", "#F1F1F5", "#E2E2EA", "#D0D5DD", "#A2A2A8", "#717179", "#545460", "#454551", "#2C2C35", "#171725"];
const SLATE_STEPS = ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const DARK_VARS = (() => {
  const v = {};
  SLATE_STEPS.forEach((s, i) => { v[`--tp-slate-${s}`] = SLATE[SLATE.length - 1 - i]; });
  Object.assign(v, {
    "--tp-blue-50": "rgba(75, 74, 213, 0.22)", "--tp-violet-50": "rgba(164, 97, 216, 0.20)",
    "--tp-success-50": "rgba(16, 185, 129, 0.16)", "--tp-warning-50": "rgba(245, 158, 11, 0.16)", "--tp-error-50": "rgba(225, 29, 72, 0.16)",
  });
  return v;
})();

// Map component tokens onto the CSS variables components actually read.
function componentVars(components) {
  const v = {};
  if (components?.button?.radius) v["--tp-btn-radius"] = components.button.radius;
  if (components?.input?.radius) v["--tp-input-radius"] = components.input.radius;
  if (components?.dropdown?.radius) v["--tp-dropdown-radius"] = components.dropdown.radius;
  if (components?.badge?.radius) v["--tp-badge-radius"] = components.badge.radius;
  return v;
}

// CSS-variable overrides emitted onto the wrapper — only what the product passed
// (plus the dark remap), so the global token layer stays the source of defaults.
function buildVars(scheme, theme, tokens, vars) {
  const out = { colorScheme: scheme === "dark" ? "dark" : "light" };
  if (scheme === "dark") Object.assign(out, DARK_VARS);
  const colors = theme?.foundation?.colors;
  if (colors) for (const [rampName, steps] of Object.entries(colors)) {
    if (isObj(steps)) for (const [step, val] of Object.entries(steps)) out[`--tp-${rampName}-${step}`] = val;
  }
  Object.assign(out, componentVars(theme?.components));
  if (tokens) for (const [k, val] of Object.entries(tokens)) out[k.startsWith("--") ? k : `--tp-${k}`] = val;
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

export function TPThemeProvider({
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
  const [override, setOverride] = React.useState(null);
  const resolved = useResolvedScheme(override ?? colorScheme);

  // Point the icon resolver at the theme's CDN base (global; set once per app).
  React.useEffect(() => {
    if (themeProp?.iconBaseUrl) setIconBaseUrl(themeProp.iconBaseUrl);
  }, [themeProp?.iconBaseUrl]);

  const theme = React.useMemo(() => deepMerge(defaultTheme, { ...themeProp, colorScheme: resolved }), [themeProp, resolved]);
  const breakpoint = useActiveBreakpoint(theme.breakpoints);
  const cssVars = React.useMemo(() => buildVars(resolved, themeProp, tokens, vars), [resolved, themeProp, tokens, vars]);
  const ctx = React.useMemo(
    () => ({ theme, colorScheme: resolved, setColorScheme: setOverride, breakpoint }),
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

TPThemeProvider.displayName = "TPThemeProvider";
export default TPThemeProvider;
