// The default Tesseract theme — the structured object products read through
// TPThemeProvider / useTheme(). It mirrors the CSS-variable tokens (tesseract-tokens.css)
// so foundation + component tokens are available in JS, and is the base that a
// product's partial `theme` is deep-merged over.

import { ICON_BASE_DEFAULT } from "../components/atoms/icons/tp/iconBase";

const ramp = (a) => ({ 50: a[0], 100: a[1], 200: a[2], 300: a[3], 400: a[4], 500: a[5], 600: a[6], 700: a[7], 800: a[8], 900: a[9] });

export const defaultTheme = {
  colorScheme: "light",

  // Where icon SVGs load from (CDN by default). See setIconBaseUrl / iconBase.js.
  iconBaseUrl: ICON_BASE_DEFAULT,

  // Responsive breakpoints (min-width, px). useBreakpoint() resolves the active one.
  breakpoints: { mobile: 0, tablet: 768, desktop: 1280 },

  // ── Foundation tokens ──
  foundation: {
    colors: {
      blue:    ramp(["#EEEEFF", "#D8D8FA", "#B5B4F2", "#8E8DE8", "#6C6BDE", "#4B4AD5", "#3C3BB5", "#2E2D96", "#212077", "#161558"]),
      violet:  ramp(["#FAF5FE", "#EDDFF7", "#DBBFEF", "#C89FE7", "#BA7DE9", "#A461D8", "#8A4DBB", "#703A9E", "#572A81", "#3E1C64"]),
      amber:   ramp(["#FFFBEB", "#FFF4CC", "#FFE8AE", "#FEDC85", "#FED15E", "#F5B832", "#D99B1A", "#B47D10", "#8F6008", "#6A4504"]),
      slate:   { 0: "#FFFFFF", ...ramp(["#FAFAFB", "#F1F1F5", "#E2E2EA", "#D0D5DD", "#A2A2A8", "#717179", "#545460", "#454551", "#2C2C35", "#171725"]) },
      success: ramp(["#ECFDF5", "#D1FAE5", "#A7F3D0", "#6EE7B7", "#34D399", "#10B981", "#059669", "#047857", "#065F46", "#064E3B"]),
      warning: ramp(["#FFFBEB", "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F"]),
      error:   ramp(["#FFF1F2", "#FFE4E6", "#FECDD3", "#FDA4AF", "#FB7185", "#E11D48", "#C8102E", "#9F1239", "#881337", "#4C0519"]),
    },
    typography: {
      fontHeading: '"Mulish", system-ui, sans-serif',
      fontBody: '"Inter", system-ui, sans-serif',
      fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",
      weight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
      scale: {
        "display-xl": { size: "56px", lineHeight: "64px", weight: 800 },
        display: { size: "48px", lineHeight: "56px", weight: 700 },
        h1: { size: "36px", lineHeight: "44px", weight: 700 },
        h2: { size: "30px", lineHeight: "38px", weight: 600 },
        h3: { size: "24px", lineHeight: "32px", weight: 600 },
        h4: { size: "20px", lineHeight: "28px", weight: 600 },
        h5: { size: "16px", lineHeight: "24px", weight: 600 },
        h6: { size: "14px", lineHeight: "20px", weight: 600 },
        "body-base": { size: "16px", lineHeight: "24px", weight: 400 },
        "body-sm": { size: "14px", lineHeight: "20px", weight: 400 },
        "body-xs": { size: "12px", lineHeight: "18px", weight: 400 },
        caption: { size: "12px", lineHeight: "16px", weight: 500 },
        micro: { size: "10px", lineHeight: "12px", weight: 500 },
      },
    },
    spacing: { "0.5": "2px", 1: "4px", "1.5": "6px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 10: "40px", 12: "48px", 16: "64px" },
    radius: { 0: "0", 4: "4px", 6: "6px", 8: "8px", 10: "10px", 12: "12px", 16: "16px", 20: "20px", 24: "24px", full: "9999px" },
    shadow: {
      xs: "0 1px 2px 0 rgba(23,23,37,0.04)",
      sm: "0 1px 3px 0 rgba(23,23,37,0.08)",
      md: "0 4px 8px -2px rgba(23,23,37,0.08)",
      lg: "0 12px 24px -4px rgba(23,23,37,0.08)",
      xl: "0 20px 40px -8px rgba(23,23,37,0.12)",
      "2xl": "0 32px 64px -12px rgba(23,23,37,0.20)",
    },
  },

  // ── Component tokens ── (per-component knobs; products override per component)
  components: {
    button: { radius: "10px", height: { sm: "36px", md: "42px", lg: "48px" }, fontWeight: 600 },
    input: { radius: "10px", height: { sm: "36px", md: "42px", lg: "48px" } },
    card: { radius: "12px", shadow: "0 1px 3px 0 rgba(23,23,37,0.08)" },
    badge: { radius: "9999px" },
    dropdown: { radius: "12px", shadow: "0 16px 32px -8px rgba(23,23,37,0.16)" },
  },
};

export default defaultTheme;
