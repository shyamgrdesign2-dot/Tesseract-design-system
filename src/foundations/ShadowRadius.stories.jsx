import React from "react";
import { Page, Title, Code } from "./_kit";

export default {
  title: "Foundations/Shadow & Radius",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};

const SHADOWS = [["xs", "Inputs, small cards"], ["sm", "Cards, dropdowns"], ["md", "Modals, popovers"], ["lg", "Floating elements"], ["xl", "Command palettes"], ["2xl", "Full-screen overlays"]];
const FOCUS = [["primary", "Primary focus ring"], ["error", "Error focus ring"], ["neutral", "Neutral focus ring"]];

export const Elevation = {
  render: () => (
    <Page>
      <Title sub={<>Drop-shadow scale + focus rings. Use via <Code>var(--tesseract-shadow-&lt;size&gt;)</Code> and <Code>var(--tesseract-focus-&lt;tone&gt;)</Code>.</>}>Elevation</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 28, background: "var(--tesseract-slate-50)", padding: 28, borderRadius: 12, marginBottom: 24 }}>
        {SHADOWS.map(([s, use]) => (
          <div key={s} style={{ textAlign: "center" }}>
            <div style={{ height: 84, background: "#fff", borderRadius: 12, boxShadow: `var(--tesseract-shadow-${s})` }} />
            <div style={{ font: "600 12px/16px Inter", marginTop: 12 }}>shadow-{s}</div>
            <div style={{ font: "400 11px/14px Inter", color: "var(--tesseract-slate-500)" }}>{use}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 28, padding: 8 }}>
        {FOCUS.map(([f, use]) => (
          <div key={f} style={{ textAlign: "center" }}>
            <div style={{ height: 60, background: "#fff", border: "1px solid var(--tesseract-slate-200)", borderRadius: 10, boxShadow: `var(--tesseract-focus-${f})` }} />
            <div style={{ font: "600 12px/16px Inter", marginTop: 12 }}>focus-{f}</div>
            <div style={{ font: "400 11px/14px Inter", color: "var(--tesseract-slate-500)" }}>{use}</div>
          </div>
        ))}
      </div>
    </Page>
  ),
};

const RADII = [["0", "Sharp"], ["2", "Micro"], ["4", "Tags, chips"], ["6", "Small inputs"], ["8", "Inputs, dropdowns"], ["10", "CTAs"], ["12", "Cards, dialogs"], ["14", "Large inputs"], ["16", "Large cards"], ["18", "Panels"], ["20", "Hero, modals"], ["22", "Large modals"], ["24", "Max standard"], ["42", "Pills"], ["84", "Circle"], ["full", "Avatars, pills, toggles"]];
export const Radius = {
  render: () => (
    <Page>
      <Title sub={<>Corner-radius scale. Use via <Code>var(--tesseract-radius-&lt;n&gt;)</Code>. CTAs = 10, cards = 12, pills/avatars = full.</>}>Corner radius</Title>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {RADII.map(([r, use]) => (
          <div key={r} style={{ textAlign: "center", width: 96 }}>
            <div style={{ width: 80, height: 80, margin: "0 auto", background: "var(--tesseract-blue-100)", border: "1.5px solid var(--tesseract-blue-500)", borderRadius: `var(--tesseract-radius-${r})`, cornerShape: "round" }} />
            <div style={{ font: "600 11px/14px Inter", marginTop: 6 }}>radius-{r}</div>
            <div style={{ font: "400 10px/13px Inter", color: "var(--tesseract-slate-500)" }}>{use}</div>
          </div>
        ))}
      </div>
    </Page>
  ),
};
