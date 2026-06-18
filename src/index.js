// ─────────────────────────────────────────────────────────────────────────────
// Tesseract UI — public entry point.
//
// Single import surface for consumers:
//   import { Button, Badge, DataTable, Dropdown } from "tp-ui";
//
// Everything is built from scratch with zero runtime dependencies beyond
// react / react-dom. Atoms are primitives; molecules compose atoms.
// ─────────────────────────────────────────────────────────────────────────────

// Foundational styles ship with the package (bundled into tp-ui.css): the design
// tokens (CSS variables), the minimal base reset, and the type-role classes.
import "./tp-tokens.css";
import "./tp-base.css";
import "./tp-typography.css";

export * from "./components/atoms";
export * from "./components/molecules";

// Runtime theming — foundation + component tokens, breakpoints, light/dark.
// `createTheme({ brand })` derives a full theme from a seed.
export { TPThemeProvider, useTheme, useBreakpoint, useComponentTokens, defaultTheme, createTheme, ramp } from "./theme";

// Action tracking — opt-in; no-op without a provider.
export { TPAnalyticsProvider, useAnalytics, resolveTrack } from "./analytics";

// Icon CDN base (default = Tesseract CDN); override to self-host.
export { getIconBaseUrl, setIconBaseUrl, ICON_BASE_DEFAULT } from "./components/atoms/icons/tp/iconBase";
