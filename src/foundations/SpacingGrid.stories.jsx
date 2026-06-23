import React from "react";
import { Page, Title, Section, Code } from "./_kit";

export default {
  title: "Foundations/Spacing & Grid",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};

const SPACE = [["1", "4px"], ["1-5", "6px"], ["2", "8px"], ["2-5", "10px"], ["3", "12px"], ["3-5", "14px"], ["4", "16px"], ["5", "20px"], ["6", "24px"], ["7", "28px"], ["8", "32px"], ["9", "36px"], ["10", "40px"], ["12", "48px"], ["16", "64px"]];

export const Spacing = {
  render: () => (
    <Page>
      <Title sub={<>A 4-pt base scale. Use via <Code>var(--tesseract-space-&lt;n&gt;)</Code> for padding, gaps and margins. Half-steps (<Code>--tesseract-space-1-5</Code> = 6px) exist for tight CTA/icon spacing.</>}>Spacing</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SPACE.map(([n, px]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <code style={{ font: "500 12px/16px ui-monospace, monospace", color: "var(--tesseract-slate-600)", width: 110 }}>space-{n}</code>
            <span style={{ font: "400 12px/16px Inter", color: "var(--tesseract-slate-500)", width: 44 }}>{px}</span>
            <div style={{ height: 18, width: `var(--tesseract-space-${n})`, background: "var(--tesseract-blue-500)", borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </Page>
  ),
};

const GRIDS = [
  ["Desktop", 12, "64px", "24px"],
  ["Tablet", 8, "32px", "20px"],
  ["Mobile", 4, "16px", "16px"],
];
export const Grid = {
  render: () => (
    <Page>
      <Title sub="Responsive column grids — 12 / 8 / 4 columns with the margins and gutters used per breakpoint.">Grid</Title>
      {GRIDS.map(([name, cols, margin, gutter]) => (
        <div key={name} style={{ marginBottom: 28 }}>
          <Section>{name} · {cols} columns · {margin} margin · {gutter} gutter</Section>
          <div style={{ background: "var(--tesseract-slate-50)", border: "1px solid var(--tesseract-slate-100)", borderRadius: 10, padding: `12px ${margin}` }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: gutter }}>
              {Array.from({ length: cols }).map((_, i) => (
                <div key={i} style={{ height: 56, borderRadius: 6, background: "color-mix(in srgb, var(--tesseract-blue-500) 16%, #fff)", border: "1px solid color-mix(in srgb, var(--tesseract-blue-500) 30%, #fff)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 11px/14px Inter", color: "var(--tesseract-blue-700)" }}>{i + 1}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Page>
  ),
};

const SIZES = ["12", "16", "18", "20", "22", "24", "28", "32", "36", "40", "42"];
export const Sizing = {
  render: () => (
    <Page>
      <Title sub={<>Control + icon sizes. Use via <Code>var(--tesseract-size-&lt;n&gt;)</Code> (icons 16–24, CTA heights 36/42/48, avatars 28–40).</>}>Sizing</Title>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
        {SIZES.map((s) => (
          <div key={s} style={{ textAlign: "center" }}>
            <div style={{ width: `var(--tesseract-size-${s})`, height: `var(--tesseract-size-${s})`, background: "var(--tesseract-blue-500)", borderRadius: 6, margin: "0 auto" }} />
            <div style={{ font: "500 11px/14px Inter", marginTop: 6 }}>{s}</div>
          </div>
        ))}
      </div>
    </Page>
  ),
};
