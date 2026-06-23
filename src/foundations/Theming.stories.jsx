import React from "react";
import { TesseractThemeProvider, useTheme, useBreakpoint, useComponentTokens, createTheme, ramp } from "@/src/theme";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Toggle } from "@/src/components/atoms/Toggle";

export default {
  title: "Foundations/Theme Provider",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "TesseractThemeProvider is the single theming surface products consume. " +
          "It carries the full theme (foundation tokens, component tokens, breakpoints, colour scheme), " +
          "provides it via context, and scopes the matching CSS variables onto a wrapper so every " +
          "component re-themes with no prop changes.",
      },
    },
  },
};

/* ─── shared styles ───────────────────────────────────────────── */
const PAGE = { fontFamily: "Inter, sans-serif", color: "var(--tesseract-slate-900)", padding: 28, maxWidth: 1080 };
const H2 = { font: "700 22px/28px Mulish, sans-serif", margin: "0 0 6px" };
const SUB = { font: "400 14px/22px Inter", color: "var(--tesseract-slate-500)", maxWidth: 720, margin: "0 0 20px" };
const CODE_BLOCK = {
  font: "500 12px/18px ui-monospace, SFMono-Regular, Menlo, monospace",
  background: "var(--tesseract-slate-900)", color: "#e6e6f0",
  padding: 18, borderRadius: 12, overflowX: "auto", margin: "16px 0",
};
const CARD = {
  background: "var(--tesseract-slate-0)", border: "1px solid var(--tesseract-slate-200)",
  borderRadius: "var(--tesseract-radius-12, 12px)", padding: 20,
  display: "grid", gap: 14, boxShadow: "var(--tesseract-shadow-sm)",
};
const LABEL = { font: "500 11px/14px Inter", color: "var(--tesseract-slate-400)", textTransform: "uppercase", letterSpacing: "0.04em" };

/* ─── reusable sample UI ──────────────────────────────────────── */
function SampleUI({ title = "Patient summary", subtitle }) {
  return (
    <div style={{ background: "var(--tesseract-slate-100)", padding: 24, borderRadius: "var(--tesseract-radius-16, 16px)", display: "grid", gap: 16, minWidth: 340 }}>
      <div style={CARD}>
        <div>
          <div style={{ font: "700 18px/24px Mulish, sans-serif", color: "var(--tesseract-slate-900)" }}>{title}</div>
          {subtitle && <div style={{ font: "400 13px/18px Inter, sans-serif", color: "var(--tesseract-slate-600)" }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge color="primary">Primary</Badge>
          <Badge color="success" variant="soft">Confirmed</Badge>
          <Badge color="warning" variant="soft">Pending</Badge>
          <Badge color="error" variant="soft">Allergy</Badge>
        </div>
        <InputBox placeholder="Search patients..." />
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

const blueRamp = (primary) => ({
  50: `color-mix(in srgb, ${primary} 12%, #fff)`,
  200: `color-mix(in srgb, ${primary} 42%, #fff)`,
  500: primary,
  600: `color-mix(in srgb, ${primary} 84%, #000)`,
  700: `color-mix(in srgb, ${primary} 70%, #000)`,
});

/* ═══════════════════════════════════════════════════════════════
   1. BASIC SETUP
   ═══════════════════════════════════════════════════════════════ */
export const BasicSetup = {
  render: () => (
    <div style={PAGE}>
      <h2 style={H2}>Basic Setup</h2>
      <p style={SUB}>
        Wrap your app (or any subtree) with <code>&lt;TesseractThemeProvider&gt;</code>.
        It scopes CSS variables onto the wrapper and provides the theme via React context
        so every component re-themes automatically.
      </p>
      <pre style={CODE_BLOCK}>{`import { TesseractThemeProvider } from "tesseract-ui";

function App() {
  return (
    <TesseractThemeProvider colorScheme="light">
      <YourApp />
    </TesseractThemeProvider>
  );
}`}</pre>
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        <div>
          <div style={{ ...LABEL, marginBottom: 8 }}>Light (default)</div>
          <TesseractThemeProvider colorScheme="light" style={{ background: "var(--tesseract-slate-50)", borderRadius: 12 }}>
            <SampleUI subtitle="Default light theme, no overrides." />
          </TesseractThemeProvider>
        </div>
        <div>
          <div style={{ ...LABEL, marginBottom: 8 }}>Dark</div>
          <TesseractThemeProvider colorScheme="dark" style={{ background: "var(--tesseract-slate-50)", borderRadius: 12 }}>
            <SampleUI subtitle="colorScheme='dark' reverses the neutral ramp." />
          </TesseractThemeProvider>
        </div>
      </div>
      <pre style={CODE_BLOCK}>{`// Toggle between light and dark
<TesseractThemeProvider colorScheme="dark">
  <YourApp />
</TesseractThemeProvider>

// Follow the OS preference
<TesseractThemeProvider colorScheme="system">
  <YourApp />
</TesseractThemeProvider>`}</pre>
    </div>
  ),
};

/* ═══════════════════════════════════════════════════════════════
   2. CUSTOM FOUNDATION TOKENS
   ═══════════════════════════════════════════════════════════════ */
export const CustomFoundationTokens = {
  argTypes: {
    primary: { control: "color", name: "brand primary", table: { category: "Colors" } },
    successBase: { control: "color", name: "success-500", table: { category: "Colors" } },
    errorBase: { control: "color", name: "error-500", table: { category: "Colors" } },
    fontHeading: {
      control: "select",
      options: ["Mulish", "Poppins", "Georgia", "Playfair Display", "system-ui"],
      name: "heading font", table: { category: "Typography" },
    },
    fontBody: {
      control: "select",
      options: ["Inter", "Roboto", "Lato", "Georgia", "system-ui"],
      name: "body font", table: { category: "Typography" },
    },
    colorScheme: { control: "inline-radio", options: ["light", "dark", "system"], table: { category: "Scheme" } },
  },
  args: {
    primary: "#4B4AD5",
    successBase: "#10B981",
    errorBase: "#E11D48",
    fontHeading: "Mulish",
    fontBody: "Inter",
    colorScheme: "light",
  },
  render: ({ primary, successBase, errorBase, fontHeading, fontBody, colorScheme }) => {
    const theme = {
      foundation: {
        colors: {
          blue: blueRamp(primary),
          success: { 500: successBase, 50: `color-mix(in srgb, ${successBase} 12%, #fff)` },
          error: { 500: errorBase, 50: `color-mix(in srgb, ${errorBase} 12%, #fff)` },
        },
        typography: {
          fontHeading: `'${fontHeading}', system-ui, sans-serif`,
          fontBody: `'${fontBody}', system-ui, sans-serif`,
        },
      },
    };
    const vars = { "--font-sans": `'${fontBody}', sans-serif`, "--tesseract-font-body": `'${fontBody}', sans-serif` };
    return (
      <div style={PAGE}>
        <h2 style={H2}>Custom Foundation Tokens</h2>
        <p style={SUB}>
          Override any foundation token (colours, typography, spacing, radius, shadow) via
          <code> theme.foundation</code>. Partial overrides are deep-merged over the defaults
          so you only specify what changes.
        </p>
        <pre style={CODE_BLOCK}>{`<TesseractThemeProvider
  theme={{
    foundation: {
      colors: {
        blue: { 500: "${primary}" },      // rebrand primary
        success: { 500: "${successBase}" },
        error: { 500: "${errorBase}" },
      },
      typography: {
        fontHeading: "'${fontHeading}', system-ui, sans-serif",
        fontBody: "'${fontBody}', system-ui, sans-serif",
      },
    },
  }}
>`}</pre>
        <TesseractThemeProvider colorScheme={colorScheme} theme={theme} vars={vars} style={{ background: "var(--tesseract-slate-50)", borderRadius: 12 }}>
          <SampleUI subtitle="Foundation tokens overridden via controls." />
        </TesseractThemeProvider>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════════════
   3. CUSTOM COMPONENT TOKENS
   ═══════════════════════════════════════════════════════════════ */
export const CustomComponentTokens = {
  argTypes: {
    buttonRadius: { control: { type: "range", min: 0, max: 24, step: 1 }, name: "button radius (px)", table: { category: "Button" } },
    inputRadius: { control: { type: "range", min: 0, max: 24, step: 1 }, name: "input radius (px)", table: { category: "Input" } },
    badgeRadius: { control: { type: "range", min: 0, max: 9999, step: 1 }, name: "badge radius (px)", table: { category: "Badge" } },
    dropdownRadius: { control: { type: "range", min: 0, max: 24, step: 1 }, name: "dropdown radius (px)", table: { category: "Dropdown" } },
    colorScheme: { control: "inline-radio", options: ["light", "dark"], table: { category: "Scheme" } },
  },
  args: { buttonRadius: 10, inputRadius: 10, badgeRadius: 9999, dropdownRadius: 12, colorScheme: "light" },
  render: ({ buttonRadius, inputRadius, badgeRadius, dropdownRadius, colorScheme }) => {
    const theme = {
      components: {
        button: { radius: `${buttonRadius}px` },
        input: { radius: `${inputRadius}px` },
        badge: { radius: `${badgeRadius}px` },
        dropdown: { radius: `${dropdownRadius}px` },
      },
    };
    return (
      <div style={PAGE}>
        <h2 style={H2}>Custom Component Tokens</h2>
        <p style={SUB}>
          Override per-component knobs (radius, height, font weight, shadow) via
          <code> theme.components</code>. These map to CSS variables that atoms read
          directly. Drag the sliders to see components update live.
        </p>
        <pre style={CODE_BLOCK}>{`<TesseractThemeProvider
  theme={{
    components: {
      button:   { radius: "${buttonRadius}px" },
      input:    { radius: "${inputRadius}px" },
      badge:    { radius: "${badgeRadius}px" },
      dropdown: { radius: "${dropdownRadius}px" },
    },
  }}
>`}</pre>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", marginBottom: 16 }}>
          {[
            ["Button", `${buttonRadius}px`],
            ["Input", `${inputRadius}px`],
            ["Badge", badgeRadius >= 9999 ? "full" : `${badgeRadius}px`],
            ["Dropdown", `${dropdownRadius}px`],
          ].map(([name, val]) => (
            <div key={name} style={{ border: "1px solid var(--tesseract-slate-200)", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ font: "600 13px/18px Inter", color: "var(--tesseract-slate-800)" }}>{name}</div>
              <div style={{ font: "500 20px/28px ui-monospace, monospace", color: "var(--tesseract-blue-500)" }}>{val}</div>
            </div>
          ))}
        </div>
        <TesseractThemeProvider colorScheme={colorScheme} theme={theme} style={{ background: "var(--tesseract-slate-50)", borderRadius: 12 }}>
          <SampleUI subtitle="Component tokens overridden via controls." />
        </TesseractThemeProvider>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════════════
   4. USING THEME HOOK
   ═══════════════════════════════════════════════════════════════ */
function HookDemo() {
  const { theme, colorScheme, setColorScheme } = useTheme();
  const breakpoint = useBreakpoint();
  const btnTokens = useComponentTokens("button");
  const inputTokens = useComponentTokens("input");

  const pill = { font: "600 11px/14px Inter", padding: "4px 10px", borderRadius: 9999, background: "var(--tesseract-blue-50)", color: "var(--tesseract-blue-700)" };
  const row = { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" };
  const mono = { font: "500 12px/16px ui-monospace, monospace", color: "var(--tesseract-slate-700)", background: "var(--tesseract-slate-100)", padding: "2px 6px", borderRadius: 4 };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={CARD}>
        <div style={{ font: "600 15px/20px Inter", color: "var(--tesseract-slate-900)" }}>useTheme()</div>
        <div style={row}>
          <span style={pill}>colorScheme: {colorScheme}</span>
          <span style={pill}>primary: {theme.foundation.colors.blue[500]}</span>
          <span style={pill}>fontBody: {theme.foundation.typography.fontBody}</span>
        </div>
        <div style={{ ...row, marginTop: 4 }}>
          <span style={LABEL}>switch scheme:</span>
          {["light", "dark", "system"].map((s) => (
            <button
              key={s}
              onClick={() => setColorScheme(s)}
              style={{
                font: "500 12px/16px Inter", padding: "4px 12px", borderRadius: 8, cursor: "pointer",
                border: colorScheme === s ? "2px solid var(--tesseract-blue-500)" : "1px solid var(--tesseract-slate-300)",
                background: colorScheme === s ? "var(--tesseract-blue-50)" : "var(--tesseract-slate-0)",
                color: colorScheme === s ? "var(--tesseract-blue-700)" : "var(--tesseract-slate-600)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={CARD}>
        <div style={{ font: "600 15px/20px Inter", color: "var(--tesseract-slate-900)" }}>useBreakpoint()</div>
        <div style={row}>
          <span style={pill}>active: {breakpoint}</span>
          <span style={mono}>mobile: 0px</span>
          <span style={mono}>tablet: {theme.breakpoints.tablet}px</span>
          <span style={mono}>desktop: {theme.breakpoints.desktop}px</span>
        </div>
        <div style={{ font: "400 12px/18px Inter", color: "var(--tesseract-slate-500)" }}>
          Resize the browser window to see the breakpoint change.
        </div>
      </div>

      <div style={CARD}>
        <div style={{ font: "600 15px/20px Inter", color: "var(--tesseract-slate-900)" }}>useComponentTokens("button")</div>
        <div style={row}>
          {Object.entries(btnTokens).map(([k, v]) => (
            <span key={k} style={pill}>{k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
          ))}
        </div>
      </div>

      <div style={CARD}>
        <div style={{ font: "600 15px/20px Inter", color: "var(--tesseract-slate-900)" }}>useComponentTokens("input")</div>
        <div style={row}>
          {Object.entries(inputTokens).map(([k, v]) => (
            <span key={k} style={pill}>{k}: {typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const UsingThemeHook = {
  render: () => (
    <div style={PAGE}>
      <h2 style={H2}>Using Theme Hooks</h2>
      <p style={SUB}>
        Three hooks read the theme from context. <code>useTheme()</code> returns the full
        resolved theme, colour scheme, and a setter. <code>useBreakpoint()</code> returns the
        active breakpoint name. <code>useComponentTokens(name)</code> returns the token set
        for one component.
      </p>
      <pre style={CODE_BLOCK}>{`import { useTheme, useBreakpoint, useComponentTokens } from "tesseract-ui";

function MyComponent() {
  const { theme, colorScheme, setColorScheme } = useTheme();
  const breakpoint = useBreakpoint();       // "mobile" | "tablet" | "desktop"
  const btn = useComponentTokens("button"); // { radius, height, fontWeight }

  return <div style={{ borderRadius: btn.radius }}>...</div>;
}`}</pre>
      <TesseractThemeProvider style={{ background: "var(--tesseract-slate-50)", borderRadius: 12, padding: 24 }}>
        <HookDemo />
      </TesseractThemeProvider>
    </div>
  ),
};

/* ═══════════════════════════════════════════════════════════════
   5. RESPONSIVE TOKENS
   ═══════════════════════════════════════════════════════════════ */
function ResponsiveDemo() {
  const breakpoint = useBreakpoint();
  const { theme } = useTheme();

  const bpNames = Object.keys(theme.breakpoints);
  const activeIdx = bpNames.indexOf(breakpoint);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {bpNames.map((bp, i) => (
          <div
            key={bp}
            style={{
              flex: "1 1 120px", padding: "14px 16px", borderRadius: 10, textAlign: "center",
              border: i === activeIdx ? "2px solid var(--tesseract-blue-500)" : "1px solid var(--tesseract-slate-200)",
              background: i === activeIdx ? "var(--tesseract-blue-50)" : "var(--tesseract-slate-0)",
            }}
          >
            <div style={{ font: "600 14px/18px Inter", color: i === activeIdx ? "var(--tesseract-blue-700)" : "var(--tesseract-slate-600)", textTransform: "capitalize" }}>{bp}</div>
            <div style={{ font: "500 12px/16px ui-monospace, monospace", color: "var(--tesseract-slate-400)", marginTop: 2 }}>&ge; {theme.breakpoints[bp]}px</div>
            {i === activeIdx && <div style={{ font: "600 10px/12px Inter", color: "var(--tesseract-blue-500)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>active</div>}
          </div>
        ))}
      </div>
      <div style={CARD}>
        <div style={{ font: "600 15px/20px Inter", color: "var(--tesseract-slate-900)" }}>Responsive layout</div>
        <div style={{ font: "400 13px/18px Inter", color: "var(--tesseract-slate-600)" }}>
          The buttons below stack on mobile, wrap on tablet, and sit in a row on desktop.
        </div>
        <div style={{
          display: "flex", gap: 8,
          flexDirection: breakpoint === "mobile" ? "column" : "row",
          flexWrap: breakpoint === "tablet" ? "wrap" : "nowrap",
        }}>
          <Button variant="solid" theme="primary">Save</Button>
          <Button variant="outline" theme="primary">Discard</Button>
          <Button variant="ghost" theme="neutral">Preview</Button>
          <Button variant="solid" theme="error">Delete</Button>
        </div>
      </div>
    </div>
  );
}

export const ResponsiveTokens = {
  argTypes: {
    tabletBreakpoint: { control: { type: "range", min: 480, max: 1024, step: 8 }, name: "tablet breakpoint (px)", table: { category: "Breakpoints" } },
    desktopBreakpoint: { control: { type: "range", min: 768, max: 1920, step: 8 }, name: "desktop breakpoint (px)", table: { category: "Breakpoints" } },
  },
  args: { tabletBreakpoint: 768, desktopBreakpoint: 1280 },
  render: ({ tabletBreakpoint, desktopBreakpoint }) => {
    const theme = { breakpoints: { mobile: 0, tablet: tabletBreakpoint, desktop: desktopBreakpoint } };
    return (
      <div style={PAGE}>
        <h2 style={H2}>Responsive Tokens</h2>
        <p style={SUB}>
          Override breakpoints via <code>theme.breakpoints</code>. The active breakpoint updates
          as you resize the window. Use <code>useBreakpoint()</code> in your components to
          adapt layout, density, or visibility.
        </p>
        <pre style={CODE_BLOCK}>{`<TesseractThemeProvider
  theme={{
    breakpoints: {
      mobile:  0,
      tablet:  ${tabletBreakpoint},
      desktop: ${desktopBreakpoint},
    },
  }}
>
  ...
</TesseractThemeProvider>

function Layout() {
  const bp = useBreakpoint();
  return bp === "mobile"
    ? <MobileNav />
    : <DesktopNav />;
}`}</pre>
        <TesseractThemeProvider theme={theme} style={{ background: "var(--tesseract-slate-50)", borderRadius: 12, padding: 24 }}>
          <ResponsiveDemo />
        </TesseractThemeProvider>
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════════════
   6. LIVE EXAMPLE
   ═══════════════════════════════════════════════════════════════ */
function LiveReadout() {
  const { colorScheme, theme } = useTheme();
  const breakpoint = useBreakpoint();
  const pill = { font: "600 11px/14px Inter", padding: "3px 8px", borderRadius: 9999, background: "var(--tesseract-slate-100)", color: "var(--tesseract-slate-700)" };
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
      <span style={pill}>scheme: {colorScheme}</span>
      <span style={pill}>breakpoint: {breakpoint}</span>
      <span style={pill}>btn radius: {theme.components.button.radius}</span>
      <span style={pill}>primary: {theme.foundation.colors.blue[500]}</span>
    </div>
  );
}

export const LiveExample = {
  argTypes: {
    colorScheme: { control: "inline-radio", options: ["light", "dark", "system"], table: { category: "Scheme" } },
    primary: { control: "color", table: { category: "Foundation" } },
    successBase: { control: "color", name: "success-500", table: { category: "Foundation" } },
    errorBase: { control: "color", name: "error-500", table: { category: "Foundation" } },
    fontHeading: { control: "select", options: ["Mulish", "Poppins", "Georgia", "Playfair Display", "system-ui"], name: "heading font", table: { category: "Foundation" } },
    fontBody: { control: "select", options: ["Inter", "Roboto", "Lato", "Georgia", "system-ui"], name: "body font", table: { category: "Foundation" } },
    buttonRadius: { control: { type: "range", min: 0, max: 24, step: 1 }, name: "button radius (px)", table: { category: "Components" } },
    inputRadius: { control: { type: "range", min: 0, max: 24, step: 1 }, name: "input radius (px)", table: { category: "Components" } },
    badgeRadius: { control: { type: "range", min: 0, max: 9999, step: 1 }, name: "badge radius (px)", table: { category: "Components" } },
    dropdownRadius: { control: { type: "range", min: 0, max: 24, step: 1 }, name: "dropdown radius (px)", table: { category: "Components" } },
  },
  args: {
    colorScheme: "light",
    primary: "#4B4AD5",
    successBase: "#10B981",
    errorBase: "#E11D48",
    fontHeading: "Mulish",
    fontBody: "Inter",
    buttonRadius: 10,
    inputRadius: 10,
    badgeRadius: 9999,
    dropdownRadius: 12,
  },
  render: ({ colorScheme, primary, successBase, errorBase, fontHeading, fontBody, buttonRadius, inputRadius, badgeRadius, dropdownRadius }) => {
    const theme = {
      foundation: {
        colors: {
          blue: blueRamp(primary),
          success: { 500: successBase, 50: `color-mix(in srgb, ${successBase} 12%, #fff)` },
          error: { 500: errorBase, 50: `color-mix(in srgb, ${errorBase} 12%, #fff)` },
        },
        typography: {
          fontHeading: `'${fontHeading}', system-ui, sans-serif`,
          fontBody: `'${fontBody}', system-ui, sans-serif`,
        },
      },
      components: {
        button: { radius: `${buttonRadius}px` },
        input: { radius: `${inputRadius}px` },
        badge: { radius: `${badgeRadius}px` },
        dropdown: { radius: `${dropdownRadius}px` },
      },
    };
    const vars = { "--font-sans": `'${fontBody}', sans-serif`, "--tesseract-font-body": `'${fontBody}', sans-serif` };
    return (
      <div style={PAGE}>
        <h2 style={H2}>Live Example</h2>
        <p style={SUB}>
          Full playground: all foundation + component tokens combined. Use the Controls panel
          to tweak every token and see the components update live.
        </p>
        <TesseractThemeProvider colorScheme={colorScheme} theme={theme} vars={vars} style={{ background: "var(--tesseract-slate-50)", borderRadius: 12 }}>
          <LiveReadout />
          <SampleUI subtitle="Every token is driven by the Controls panel." />
        </TesseractThemeProvider>
      </div>
    );
  },
};

/* ─── createTheme() — derive a whole theme from a tiny seed ───────── */
// Swatch preview of a generated ramp.
function RampStrip({ label, ramp: r }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={LABEL}>{label}</div>
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid var(--tesseract-slate-200)" }}>
        {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => (
          <div key={step} title={`${step}: ${r[step]}`} style={{ background: r[step], height: 40, flex: 1 }} />
        ))}
      </div>
    </div>
  );
}

export const CreateThemeFn = {
  name: "createTheme() function",
  parameters: {
    docs: { description: { story: "`createTheme({ brand, accent, radius })` derives the full 50→900 ramps + component radii from a tiny seed (Blade-style). The output is a normal deep-partial theme — pass it straight to `<TesseractThemeProvider theme={…}>`. Change the seed colours below and the entire UI + ramps regenerate." } },
  },
  argTypes: {
    brand: { control: "color", table: { category: "Seed" } },
    accent: { control: "color", name: "accent (violet)", table: { category: "Seed" } },
    success: { control: "color", table: { category: "Seed" } },
    error: { control: "color", table: { category: "Seed" } },
    radius: { control: { type: "range", min: 0, max: 24, step: 1 }, name: "radius (px)", table: { category: "Seed" } },
    fontHeading: { control: "select", options: ["Mulish", "Poppins", "Playfair Display", "system-ui"], name: "heading font", table: { category: "Seed" } },
  },
  args: { brand: "#0EA5E9", accent: "#A461D8", success: "#10B981", error: "#E11D48", radius: 14, fontHeading: "Mulish" },
  render: ({ brand, accent, success, error, radius, fontHeading }) => {
    const theme = createTheme({ brand, accent, success, error, radius, fontHeading: `'${fontHeading}', system-ui, sans-serif` });
    return (
      <div style={PAGE}>
        <h2 style={H2}>createTheme()</h2>
        <p style={SUB}>One seed in, a full theme out. The brand colour seeds the primary ramp; every component re-themes with no prop changes.</p>
        <pre style={CODE_BLOCK}>{`import { createTheme } from "@/src/theme";

const theme = createTheme({
  brand: "${brand}",
  accent: "${accent}",
  radius: ${radius},
});

<TesseractThemeProvider theme={theme}>…</TesseractThemeProvider>`}</pre>
        <div style={{ display: "grid", gap: 10, margin: "8px 0 20px" }}>
          <RampStrip label="brand → primary" ramp={ramp(brand)} />
          <RampStrip label="accent → violet" ramp={ramp(accent)} />
        </div>
        <TesseractThemeProvider theme={theme} style={{ background: "var(--tesseract-slate-50)", borderRadius: 12 }}>
          <SampleUI subtitle={`Generated from brand ${brand}, radius ${radius}px.`} />
        </TesseractThemeProvider>
      </div>
    );
  },
};
