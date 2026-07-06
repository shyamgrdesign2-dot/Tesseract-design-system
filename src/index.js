// ─────────────────────────────────────────────────────────────────────────────
// Tesseract UI — public entry point.
//
// Single import surface for consumers:
//   import { Button, Badge, DataTable, Dropdown } from "tesseract-ui";
//
// Everything is built from scratch with zero runtime dependencies beyond
// react / react-dom. Atoms are primitives; molecules compose atoms.
// ─────────────────────────────────────────────────────────────────────────────

// Foundational styles ship with the package (bundled into tesseract-ui.css): the design
// tokens (CSS variables), the minimal base reset, and the type-role classes.
import "./tesseract-tokens.css";
import "./tesseract-base.css";
import "./tesseract-typography.css";

export * from "./components/atoms";
export * from "./components/molecules";
export * from "./components/charts";

// Runtime theming — foundation + component tokens, breakpoints, light/dark.
// `createTheme({ brand })` derives a full theme from a seed.
export { TesseractThemeProvider, useTheme, useBreakpoint, useComponentTokens, defaultTheme, createTheme, ramp } from "./theme";

// Action tracking — opt-in; no-op without a provider.
export { TPAnalyticsProvider, useAnalytics, resolveTrack } from "./analytics";

// Icon CDN base (default = Tesseract CDN); override to self-host.
export { getIconBaseUrl, setIconBaseUrl, ICON_BASE_DEFAULT } from "./components/atoms/icons/tp/iconBase";
