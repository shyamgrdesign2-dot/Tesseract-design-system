import React from "react";
import { Page, Title, Section, Code } from "./_kit";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { IconFinder } from "./IconFinder";
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
      <Title sub={<>One unified icon library served from the design-system CDN (<Code>setIconBaseUrl()</Code> to self-host) in three styles — <strong>linear · bulk · bold</strong>. Health icons are merged in (no separate set). Render any by name with <Code>&lt;TPLibraryIcon name="heart-add" /&gt;</Code>; pick from the full set in the <strong>Tesseract Icons</strong> addon panel.</>}>Icons</Title>

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

// Breakdown of one CDN icon URL into its segments.
const PATH_PARTS = [
  { seg: "<base>", val: "…/tp-icons", desc: "CDN root — override with setIconBaseUrl() to self-host" },
  { seg: "<corner>", val: "rounded", desc: '"rounded" | "straight"' },
  { seg: "<style>", val: "linear", desc: '"linear" | "bold" | "bulk" | "broken" | "twotone" | "outline"' },
  { seg: "<family>", val: "arrow", desc: "folder, resolved from the icon name (no need to pass it)" },
  { seg: "<name>.svg", val: "arrow-down4.svg", desc: "the icon glyph" },
];

export const Usage = {
  name: "Using icons",
  render: () => (
    <Page>
      <Title sub={<>Every icon is a static SVG from the design-system CDN. <strong>Never hand-write an inline <Code>&lt;svg&gt;</Code></strong> — always render through <Code>TPLibraryIcon</Code> so glyphs stay consistent, themeable (<Code>currentColor</Code>) and swappable from one source.</>}>Using icons</Title>

      <Section>The CDN path</Section>
      <div style={{ font: "600 14px/20px ui-monospace, Menlo, monospace", color: "var(--tp-slate-700)", background: "var(--tp-slate-50)", border: "1px solid var(--tp-slate-200)", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
        &lt;base&gt; / &lt;corner&gt; / &lt;style&gt; / &lt;family&gt; / &lt;name&gt;.svg
      </div>
      <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
        {PATH_PARTS.map((p) => (
          <div key={p.seg} style={{ display: "grid", gridTemplateColumns: "120px 150px 1fr", gap: 12, alignItems: "baseline", font: "400 13px/18px Inter", color: "var(--tp-slate-600)" }}>
            <code style={{ color: "var(--tp-blue-600)", fontWeight: 600 }}>{p.seg}</code>
            <code style={{ color: "var(--tp-slate-800)" }}>{p.val}</code>
            <span>{p.desc}</span>
          </div>
        ))}
      </div>

      <Section>How to render</Section>
      <pre style={{ font: "500 12px/18px ui-monospace, Menlo, monospace", background: "var(--tp-slate-900)", color: "#e6e6f0", padding: 16, borderRadius: 12, overflowX: "auto", margin: "0 0 8px" }}>{`import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";

// name only — family is resolved from the manifest, style defaults to linear
<TPLibraryIcon name="calendar-1" size={16} />

// choose a style (variant) and colour (else inherits currentColor)
<TPLibraryIcon name="heart-add" variant="bulk" size={24} color="var(--tp-error-600)" />

// the picker encodes style in the name too: "<style>/<name>"
<TPLibraryIcon name="bold/trash" size={20} />`}</pre>
      <div style={{ display: "flex", gap: 16, alignItems: "center", margin: "6px 0 4px" }}>
        <Tile label="linear (default)"><TPLibraryIcon name="calendar-1" size={24} /></Tile>
        <Tile label="bulk"><TPLibraryIcon name="heart-add" variant="bulk" size={24} color="var(--tp-error-600)" /></Tile>
        <Tile label="bold/trash"><TPLibraryIcon name="bold/trash" size={24} /></Tile>
      </div>

      <Section>Semantic chevrons</Section>
      <p style={{ font: "400 14px/22px Inter", color: "var(--tp-slate-600)", maxWidth: 720, margin: "0 0 12px" }}>
        Use the semantic <Code>chevron-*</Code> names for disclosure / navigation affordances — they alias to the centered CDN chevron glyphs (so you never inline a chevron <Code>&lt;svg&gt;</Code>).
      </p>
      <div style={{ display: "flex", gap: 16 }}>
        {["chevron-down", "chevron-up", "chevron-left", "chevron-right"].map((n) => (
          <Tile key={n} label={n}><TPLibraryIcon name={n} size={22} /></Tile>
        ))}
      </div>
    </Page>
  ),
};

// The searchable explorer also lives as its own page: Foundations → Icon Finder.
export const Search = {
  name: "Search",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
  render: () => <IconFinder />,
};

export const Library = {
  render: () => (
    <Page>
      <Title sub={<>A sample of the library (linear). The complete set is searchable in the <strong>Tesseract Icons</strong> addon panel — every icon resolves by name across six styles via <Code>&lt;TPLibraryIcon name="…" /&gt;</Code> or the curated <Code>&lt;TPIcon /&gt;</Code>.</>}>Icon library</Title>
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
