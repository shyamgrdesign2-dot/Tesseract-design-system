import React from "react";
import { TPThemeProvider } from "@/src/theme";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Toggle } from "@/src/components/atoms/Toggle";

export default {
  title: "Foundations/Theming",
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: "TPThemeProvider scopes design-token overrides (and light/dark) onto a subtree as CSS variables — components rebrand or invert without any prop changes, because they already read var(--tp-*). Nest providers to theme a region." } },
  },
};

// A representative slice of the system that reads the neutral + brand tokens, so
// theming/dark-mode is visibly applied.
function SampleUI() {
  return (
    <div style={{ background: "var(--tp-slate-100)", padding: 24, borderRadius: "var(--tp-radius-16, 16px)", display: "grid", gap: 16, minWidth: 380 }}>
      <div style={{ background: "var(--tp-slate-0)", border: "1px solid var(--tp-slate-200)", borderRadius: "var(--tp-radius-12, 12px)", padding: 20, display: "grid", gap: 14, boxShadow: "var(--tp-shadow-sm)" }}>
        <div>
          <div style={{ font: "700 18px/24px Mulish, sans-serif", color: "var(--tp-slate-900)" }}>Patient summary</div>
          <div style={{ font: "400 13px/18px Inter, sans-serif", color: "var(--tp-slate-600)" }}>Theme adapts surfaces, text and brand from tokens.</div>
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

const ramp = (primary) => ({
  "blue-50": `color-mix(in srgb, ${primary} 12%, #fff)`,
  "blue-200": `color-mix(in srgb, ${primary} 42%, #fff)`,
  "blue-500": primary,
  "blue-600": `color-mix(in srgb, ${primary} 84%, #000)`,
  "blue-700": `color-mix(in srgb, ${primary} 70%, #000)`,
});

/** Live playground — rebrand the primary, corner radius, body font and switch
 *  light/dark. Everything inside the provider re-themes from the tokens. */
export const Playground = {
  argTypes: {
    colorScheme: { control: "inline-radio", options: ["light", "dark", "system"] },
    primary: { control: "color" },
    radius: { control: { type: "range", min: 0, max: 22, step: 1 }, name: "corner radius" },
    fontBody: { control: "select", options: ["Inter", "Roboto", "Georgia", "system-ui"], name: "body font" },
  },
  args: { colorScheme: "light", primary: "#4B4AD5", radius: 10, fontBody: "Inter" },
  render: ({ colorScheme, primary, radius, fontBody }) => {
    const tokens = { ...ramp(primary), "btn-radius": `${radius}px`, "radius-10": `${radius}px`, "radius-12": `${radius + 2}px`, "radius-16": `${radius + 6}px` };
    const vars = { "--tp-font-body": `'${fontBody}', sans-serif`, "--font-sans": `'${fontBody}', sans-serif` };
    return (
      <TPThemeProvider colorScheme={colorScheme} tokens={tokens} vars={vars} style={{ padding: 28, background: "var(--tp-slate-50)", minHeight: 460 }}>
        <SampleUI />
      </TPThemeProvider>
    );
  },
};

/** Light vs dark from the same components — dark reverses the neutral ramp. */
export const LightAndDark = {
  render: () => (
    <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
      <TPThemeProvider colorScheme="light" style={{ padding: 28, background: "var(--tp-slate-50)", flex: "1 1 420px" }}><SampleUI /></TPThemeProvider>
      <TPThemeProvider colorScheme="dark" style={{ padding: 28, background: "var(--tp-slate-50)", flex: "1 1 420px" }}><SampleUI /></TPThemeProvider>
    </div>
  ),
};

/** Rebrand — the same UI under three brand primaries, no component changes. */
export const Rebrand = {
  render: () => (
    <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
      {["#4B4AD5", "#0EA5E9", "#E11D48"].map((c) => (
        <TPThemeProvider key={c} tokens={ramp(c)} style={{ padding: 24, background: "var(--tp-slate-50)", flex: "1 1 340px" }}><SampleUI /></TPThemeProvider>
      ))}
    </div>
  ),
};
