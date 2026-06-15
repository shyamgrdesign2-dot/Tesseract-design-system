"use client";

/**
 * TPThemeProvider — runtime theming for the TatvaPractice design system.
 *
 * The system is driven by CSS variables (see tp-tokens.css). This provider scopes
 * token OVERRIDES onto a wrapper element, so any subtree can be rebranded or
 * switched to dark without touching components — they already read `var(--tp-*)`.
 *
 *   <TPThemeProvider colorScheme="dark">…</TPThemeProvider>
 *   <TPThemeProvider tokens={{ "blue-500": "#0EA5E9", "radius-10": "14px" }}>…</TPThemeProvider>
 *   <TPThemeProvider vars={{ "--tp-font-body": "'Roboto', sans-serif" }}>…</TPThemeProvider>
 *
 * Props:
 *   colorScheme  "light" | "dark" | "system"          default "light"
 *   tokens       { [tokenName]: value } — keys are token names WITHOUT the
 *                `--tp-` prefix, e.g. "blue-500", "radius-10", "font-body".
 *   vars         { [cssVar]: value } — raw escape hatch, e.g. "--tp-shadow-md".
 *   as           element/tag to render as the scope                 default "div"
 *   className, style, ...rest
 *
 * Providers nest: an inner provider inherits the outer scope and layers its own
 * overrides on top. `useTheme()` returns { colorScheme, setColorScheme, tokens }.
 */

import * as React from "react";
import { ThemeContext } from "./context";

// Light neutral ramp (mirrors tp-tokens.css). Dark mode reverses it so the same
// token (e.g. --tp-slate-900 used for headings) flips to a light value.
const SLATE = ["#FFFFFF", "#FAFAFB", "#F1F1F5", "#E2E2EA", "#D0D5DD", "#A2A2A8", "#717179", "#545460", "#454551", "#2C2C35", "#171725"];
const SLATE_STEPS = ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

// Dark-scheme token overrides: reversed neutral ramp + translucent soft tints so
// surfaces/text/borders adapt. Brand + status hues are kept (still legible).
const DARK_VARS = (() => {
  const v = {};
  SLATE_STEPS.forEach((s, i) => { v[`--tp-slate-${s}`] = SLATE[SLATE.length - 1 - i]; });
  Object.assign(v, {
    "--tp-blue-50": "rgba(75, 74, 213, 0.22)",      // selected / brand-soft on dark
    "--tp-violet-50": "rgba(164, 97, 216, 0.20)",
    "--tp-success-50": "rgba(16, 185, 129, 0.16)",
    "--tp-warning-50": "rgba(245, 158, 11, 0.16)",
    "--tp-error-50": "rgba(225, 29, 72, 0.16)",
  });
  return v;
})();

// Resolve "system" against the OS preference, live.
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

function buildVars(scheme, tokens, vars) {
  const out = { colorScheme: scheme === "dark" ? "dark" : "light" };
  if (scheme === "dark") Object.assign(out, DARK_VARS);
  if (tokens) for (const [k, val] of Object.entries(tokens)) out[k.startsWith("--") ? k : `--tp-${k}`] = val;
  if (vars) Object.assign(out, vars);
  return out;
}

export function TPThemeProvider({
  colorScheme = "light",
  tokens,
  vars,
  as: Tag = "div",
  className,
  style,
  children,
  ...rest
}) {
  // The `colorScheme` prop is the default; useTheme().setColorScheme() can override
  // it at runtime (override wins once set). No prop→state effect needed.
  const [override, setOverride] = React.useState(null);
  const resolved = useResolvedScheme(override ?? colorScheme);

  const cssVars = React.useMemo(() => buildVars(resolved, tokens, vars), [resolved, tokens, vars]);
  const ctx = React.useMemo(
    () => ({ colorScheme: resolved, setColorScheme: setOverride, tokens: tokens || {} }),
    [resolved, tokens],
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
