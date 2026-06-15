import React from "react";
import { Page, Title, Section, Code } from "./_kit";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { tpMedicalIconNames } from "@/src/components/atoms/MedicalIcon/registry";

export default {
  title: "Foundations/Icons",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};

// Names verified to exist in the library (won't render blank in the demo).
const SAMPLE = ["heart-add", "plus", "calendar-1", "copy", "copypaste", "more", "more-circle", "trash", "trash-square", "delete", "delete-basket", "eraser", "arrow-up-02", "arrow-down-02", "arrow-left-02", "arrow-right-02"];
const LIB_STYLES = ["linear", "bulk", "bold"];
const MED_NAMES = tpMedicalIconNames;

const Tile = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 8px", border: "1px solid var(--tp-slate-100)", borderRadius: 10, color: "var(--tp-slate-700)" }}>
    {children}
    <span style={{ font: "400 10px/13px Inter", color: "var(--tp-slate-500)", textAlign: "center", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{label}</span>
  </div>
);

export const Overview = {
  render: () => (
    <Page>
      <Title sub={<>One unified icon library served from <Code>/tp-icons/</Code> in three styles — <strong>linear · bulk · bold</strong>. Health icons are merged in (no separate set). Render any by name with <Code>&lt;TPLibraryIcon name="heart-add" /&gt;</Code>; pick from the full set in the <strong>TP Icons</strong> addon panel.</>}>Icons</Title>

      <Section>Styles — one glyph, three styles</Section>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {LIB_STYLES.map((s) => (
          <Tile key={s} label={s}><TPLibraryIcon name={`${s}/copy`} size={28} /></Tile>
        ))}
      </div>

      <Section>Health icons — merged into the library (same three styles)</Section>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {LIB_STYLES.map((s) => (
          <Tile key={s} label={s}><TPLibraryIcon name={`${s}/ambulance`} size={28} /></Tile>
        ))}
      </div>

      <Section>Sizes &amp; colour (currentColor)</Section>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
        {[16, 20, 24, 32, 40].map((sz) => (
          <div key={sz} style={{ textAlign: "center", color: "var(--tp-slate-700)" }}>
            <TPLibraryIcon name="calendar-1" size={sz} />
            <div style={{ font: "400 10px/13px Inter", color: "var(--tp-slate-500)", marginTop: 6 }}>{sz}px</div>
          </div>
        ))}
        {["--tp-blue-500", "--tp-success-600", "--tp-warning-600", "--tp-error-600"].map((c) => (
          <div key={c} style={{ textAlign: "center", color: `var(${c})` }}>
            <TPLibraryIcon name="heart-add" size={28} />
            <div style={{ font: "400 10px/13px Inter", color: "var(--tp-slate-500)", marginTop: 6 }}>{c.replace("--tp-", "")}</div>
          </div>
        ))}
      </div>
    </Page>
  ),
};

export const Library = {
  render: () => (
    <Page>
      <Title sub={<>A sample of the library (linear). The complete set is searchable in the <strong>TP Icons</strong> addon panel — every icon resolves by name across six styles via <Code>&lt;TPLibraryIcon name="…" /&gt;</Code> or the curated <Code>&lt;TPIcon /&gt;</Code>.</>}>Icon library</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 10 }}>
        {SAMPLE.map((n) => <Tile key={n} label={n}><TPLibraryIcon name={n} size={26} /></Tile>)}
      </div>
    </Page>
  ),
};

export const Medical = {
  render: () => (
    <Page>
      <Title sub={<>The curated health subset ({MED_NAMES.length} glyphs) — now just part of the one library (linear / bulk / bold), no separate set. Render via <Code>&lt;TPMedicalIcon /&gt;</Code> (a thin alias) or by name through <Code>TPLibraryIcon</Code>.</>}>Health icons</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 10 }}>
        {MED_NAMES.map((n) => <Tile key={n} label={n}><TPLibraryIcon name={n} size={26} /></Tile>)}
      </div>
    </Page>
  ),
};
