import React from "react";
import { TPThemeProvider, useTheme, useBreakpoint } from "@/src/theme";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Toggle } from "@/src/components/atoms/Toggle";

export default {
  title: "Foundations/Theme Provider",
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "TPThemeProvider is the single theming surface products consume — it carries the whole theme (foundation tokens, component tokens, breakpoints, colour scheme), provides it via context (useTheme / useBreakpoint / useComponentTokens), and scopes the matching CSS variables onto a wrapper so every component re-themes with no prop changes. Providers nest." } },
  },
};

// Reads the live theme via the hooks — proves products can consume it.
function ThemeReadout() {
  const { colorScheme, theme } = useTheme();
  const breakpoint = useBreakpoint();
  const pill = { font: "600 11px/14px Inter", padding: "3px 8px", borderRadius: 9999, background: "var(--tp-slate-100)", color: "var(--tp-slate-700)" };
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
      <span style={pill}>scheme: {colorScheme}</span>
      <span style={pill}>breakpoint: {breakpoint}</span>
      <span style={pill}>button radius: {theme.components.button.radius}</span>
      <span style={pill}>primary: {theme.foundation.colors.blue[500]}</span>
    </div>
  );
}

function SampleUI({ readout }) {
  return (
    <div style={{ background: "var(--tp-slate-100)", padding: 24, borderRadius: "var(--tp-radius-16, 16px)", display: "grid", gap: 16, minWidth: 380 }}>
      {readout && <ThemeReadout />}
      <div style={{ background: "var(--tp-slate-0)", border: "1px solid var(--tp-slate-200)", borderRadius: "var(--tp-radius-12, 12px)", padding: 20, display: "grid", gap: 14, boxShadow: "var(--tp-shadow-sm)" }}>
        <div>
          <div style={{ font: "700 18px/24px Mulish, sans-serif", color: "var(--tp-slate-900)" }}>Patient summary</div>
          <div style={{ font: "400 13px/18px Inter, sans-serif", color: "var(--tp-slate-600)" }}>Surfaces, text, brand + button radius all come from the theme.</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge color="primary">Primary</Badge>
          <Badge color="success" variant="soft">Confirmed</Badge>
          <Badge color="warning" variant="soft">Pending</Badge>
          <Badge color="error" variant="soft">Allergy</Badge>
        </div>
        <InputBox placeholder="Search patients…" />
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Button variant="solid" theme="primary">Save</Button>
          <Button variant="outline" theme="primary">Cancel</Button>
          <Button variant="ghost" theme="neutral">More</Button>
          <Button variant="solid" theme="error">Delete</Button>
          <Toggle defaultChecked aria-label="notify" />
        </div>
      </div>
    </div>
  );
}

// Build a brand ramp around a chosen primary (for the foundation.colors override).
const blueRamp = (primary) => ({
  50: `color-mix(in srgb, ${primary} 12%, #fff)`,
  200: `color-mix(in srgb, ${primary} 42%, #fff)`,
  500: primary,
  600: `color-mix(in srgb, ${primary} 84%, #000)`,
  700: `color-mix(in srgb, ${primary} 70%, #000)`,
});

/** What the provider carries — foundation + component tokens, breakpoints, scheme. */
export const Overview = {
  render: () => {
    const box = { border: "1px solid var(--tp-slate-200)", borderRadius: 12, padding: 16 };
    const code = `import { TPThemeProvider, useTheme } from "tp-ui";

<TPThemeProvider
  colorScheme="dark"                       // light | dark | system
  theme={{
    foundation: { colors: { blue: { 500: "#0EA5E9" } } },
    components: { button: { radius: "14px" } },
    breakpoints: { tablet: 720 },
  }}
>
  <App />
</TPThemeProvider>

const { theme, colorScheme, setColorScheme } = useTheme();
const bp = useBreakpoint();               // "mobile" | "tablet" | "desktop"
const btn = useComponentTokens("button"); // { radius, height, … }`;
    return (
      <div style={{ fontFamily: "Inter, sans-serif", color: "var(--tp-slate-900)", padding: 28, maxWidth: 1080 }}>
        <h1 style={{ font: "700 28px/34px Mulish, sans-serif", margin: "0 0 8px" }}>Theme Provider</h1>
        <p style={{ font: "400 14px/22px Inter", color: "var(--tp-slate-500)", maxWidth: 720, marginTop: 0 }}>
          The single theming surface for products. Wrap your app (or any subtree) and it carries the whole theme — foundation tokens, component tokens, breakpoints and the colour scheme — exposing them via context and scoping the matching CSS variables so every component re-themes automatically.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, margin: "20px 0" }}>
          <div style={box}><strong>Foundation tokens</strong><div style={{ font: "400 13px/19px Inter", color: "var(--tp-slate-600)", marginTop: 4 }}>colours · typography · spacing · radius · shadow</div></div>
          <div style={box}><strong>Component tokens</strong><div style={{ font: "400 13px/19px Inter", color: "var(--tp-slate-600)", marginTop: 4 }}>per-component knobs — button, input, card, badge, dropdown</div></div>
          <div style={box}><strong>Breakpoints</strong><div style={{ font: "400 13px/19px Inter", color: "var(--tp-slate-600)", marginTop: 4 }}>mobile / tablet / desktop · <code>useBreakpoint()</code></div></div>
          <div style={box}><strong>Colour scheme</strong><div style={{ font: "400 13px/19px Inter", color: "var(--tp-slate-600)", marginTop: 4 }}>light · dark · system</div></div>
        </div>
        <pre style={{ font: "500 12px/18px ui-monospace, monospace", background: "var(--tp-slate-900)", color: "#e6e6f0", padding: 18, borderRadius: 12, overflowX: "auto" }}>{code}</pre>
      </div>
    );
  },
};

/** Live playground — rebrand via the foundation + component tokens; read it back. */
export const Playground = {
  argTypes: {
    colorScheme: { control: "inline-radio", options: ["light", "dark", "system"] },
    primary: { control: "color" },
    buttonRadius: { control: { type: "range", min: 0, max: 22, step: 1 } },
    fontBody: { control: "select", options: ["Inter", "Roboto", "Georgia", "system-ui"] },
  },
  args: { colorScheme: "light", primary: "#4B4AD5", buttonRadius: 10, fontBody: "Inter" },
  render: ({ colorScheme, primary, buttonRadius, fontBody }) => {
    const theme = {
      foundation: { colors: { blue: blueRamp(primary) }, typography: { fontBody: `'${fontBody}', sans-serif` } },
      components: { button: { radius: `${buttonRadius}px` } },
    };
    const vars = { "--font-sans": `'${fontBody}', sans-serif`, "--tp-font-body": `'${fontBody}', sans-serif` };
    return (
      <TPThemeProvider colorScheme={colorScheme} theme={theme} vars={vars} style={{ padding: 28, background: "var(--tp-slate-50)", minHeight: 480 }}>
        <SampleUI readout />
      </TPThemeProvider>
    );
  },
};

/** Same components, light vs dark — dark reverses the neutral ramp. */
export const LightAndDark = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <TPThemeProvider colorScheme="light" style={{ padding: 28, background: "var(--tp-slate-50)", flex: "1 1 420px" }}><SampleUI /></TPThemeProvider>
      <TPThemeProvider colorScheme="dark" style={{ padding: 28, background: "var(--tp-slate-50)", flex: "1 1 420px" }}><SampleUI /></TPThemeProvider>
    </div>
  ),
};

/** Rebrand — three brand primaries, no component changes. */
export const Rebrand = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {["#4B4AD5", "#0EA5E9", "#E11D48"].map((c) => (
        <TPThemeProvider key={c} theme={{ foundation: { colors: { blue: blueRamp(c) } } }} style={{ padding: 24, background: "var(--tp-slate-50)", flex: "1 1 340px" }}><SampleUI /></TPThemeProvider>
      ))}
    </div>
  ),
};
