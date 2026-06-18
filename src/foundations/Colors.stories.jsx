import React from "react";
import { Page, Title, Section, Code } from "./_kit";

export default {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const SLATE = ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const RAMPS = [
  ["Primary · blue", "blue", STEPS, "Brand identity, primary CTAs, links, focus."],
  ["Secondary · violet", "violet", STEPS, "Informative / AI surfaces, education."],
  ["Tertiary · amber", "amber", STEPS, "Special highlights only."],
  ["Slate (neutral)", "slate", SLATE, "Text, surfaces, borders, icons."],
  ["Success", "success", STEPS, "Confirmed, valid, complete."],
  ["Warning", "warning", STEPS, "Caution, pending, needs review."],
  ["Error", "error", STEPS, "Invalid, failed, destructive."],
];

// ── Resolve the live computed colour of a token → uppercase #RRGGBB ──────────
// We read the rendered swatch's computed background, so the hex reflects any
// runtime ramp override (e.g. a TPThemeProvider dark theme), not a hardcoded
// guess. getComputedStyle returns rgb()/rgba(); we convert to canonical hex.
function rgbToHex(rgb) {
  const m = rgb && rgb.match(/(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(\d*\.?\d+))?/);
  if (!m) return "";
  const h = (n) => Math.round(Number(n)).toString(16).padStart(2, "0");
  const a = m[4] != null && Number(m[4]) < 1 ? h(Math.round(Number(m[4]) * 255)) : "";
  return ("#" + h(m[1]) + h(m[2]) + h(m[3]) + a).toUpperCase();
}

// Attach the returned ref to the element that paints `var(varName)`; the hook
// reads its resolved colour after paint.
function useResolvedHex(varName) {
  const ref = React.useRef(null);
  const [hex, setHex] = React.useState("");
  React.useEffect(() => {
    if (ref.current) setHex(rgbToHex(getComputedStyle(ref.current).backgroundColor));
  }, [varName]);
  return [ref, hex];
}

function Swatch({ varName, step, dark }) {
  const [ref, hex] = useResolvedHex(varName);
  return (
    <div>
      <div
        ref={ref}
        title={`${varName} · ${hex}`}
        style={{ height: 56, borderRadius: 8, background: `var(${varName})`, border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-end", padding: 6 }}
      >
        <span style={{ font: "600 11px/12px Inter", color: dark ? "rgba(255,255,255,0.92)" : "var(--tp-slate-700)" }}>{step}</span>
      </div>
      <div style={{ font: "600 10px/13px ui-monospace, monospace", color: "var(--tp-slate-600)", marginTop: 4, letterSpacing: "0.02em" }}>{hex || "—"}</div>
    </div>
  );
}

function Ramp({ name, prefix, steps, note }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <strong style={{ font: "600 13px/16px Inter" }}>{name}</strong>
        <span style={{ font: "400 12px/16px Inter", color: "var(--tp-slate-500)" }}>{note}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 4 }}>
        {steps.map((s) => {
          const v = `--tp-${prefix}-${s}`;
          const dark = Number(s) >= 400 || s === "900";
          return <Swatch key={s} varName={v} step={s} dark={dark} />;
        })}
      </div>
    </div>
  );
}

export const Palette = {
  render: () => (
    <Page>
      <Title sub={<>10-step ramps, the raw colour primitives. Use via <Code>var(--tp-&lt;ramp&gt;-&lt;step&gt;)</Code> — e.g. <Code>var(--tp-blue-500)</Code>. The 500 step is each ramp's base; each swatch shows its resolved hex.</>}>Colours</Title>
      {RAMPS.map(([name, prefix, steps, note]) => <Ramp key={prefix} name={name} prefix={prefix} steps={steps} note={note} />)}
    </Page>
  ),
};

// Real semantic tokens (defined in tp-tokens.css → var(--tp-fg/bg/border-*)).
// [label, semantic token, underlying ramp] — the ramp is shown for reference.
const SEMANTIC = {
  Text: [
    ["heading", "--tp-fg-heading", "slate-900"], ["primary", "--tp-fg-primary", "slate-700"],
    ["secondary", "--tp-fg-secondary", "slate-600"], ["tertiary", "--tp-fg-tertiary", "slate-500"],
    ["placeholder", "--tp-fg-placeholder", "slate-300"], ["disabled", "--tp-fg-disabled", "slate-200"],
    ["inverse / on-dark", "--tp-fg-inverse", "slate-0"], ["brand / link", "--tp-fg-link", "blue-500"],
    ["success", "--tp-fg-success", "success-700"], ["warning", "--tp-fg-warning", "warning-600"],
    ["error", "--tp-fg-error", "error-500"],
  ],
  Background: [
    ["page", "--tp-bg-page", "slate-50"], ["page subtle", "--tp-bg-page-subtle", "slate-100"],
    ["surface / card", "--tp-bg-surface", "slate-0"], ["surface hover", "--tp-bg-surface-hover", "slate-50"],
    ["surface active", "--tp-bg-surface-active", "slate-100"], ["selected", "--tp-bg-selected", "blue-50"],
    ["inverse", "--tp-bg-inverse", "slate-900"],
    ["brand soft", "--tp-bg-brand-soft", "blue-50"],
    ["success soft", "--tp-bg-success-soft", "success-50"], ["warning soft", "--tp-bg-warning-soft", "warning-50"],
    ["error soft", "--tp-bg-error-soft", "error-50"],
  ],
  Border: [
    ["soft", "--tp-border-soft", "slate-100"], ["neutral", "--tp-border-neutral", "slate-200"],
    ["strong", "--tp-border-strong", "slate-300"], ["focus", "--tp-border-focus", "blue-500"],
    ["brand / primary", "--tp-border-primary", "blue-500"], ["success", "--tp-border-success", "success-500"],
    ["warning", "--tp-border-warning", "warning-500"], ["error", "--tp-border-error", "error-500"],
  ],
};
function Chip({ label, v, ramp }) {
  const [ref, hex] = useResolvedHex(v);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "1px solid var(--tp-slate-100)", borderRadius: 8 }}>
      <span ref={ref} title={`${v} · ${hex}`} style={{ width: 22, height: 22, borderRadius: 6, background: `var(${v})`, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
      <span style={{ font: "500 12px/15px Inter" }}>{label}<br /><span style={{ font: "400 11px/14px ui-monospace, monospace", color: "var(--tp-slate-500)" }}>{v}{ramp ? ` · ${ramp}` : ""}{hex ? ` · ${hex}` : ""}</span></span>
    </div>
  );
}
export const SemanticTokens = {
  render: () => (
    <Page>
      <Title sub={<>Role-based aliases that map onto the ramps. Reach for these in product code so intent stays consistent. Each chip lists its token, source ramp, and resolved hex.</>}>Semantic colours</Title>
      {Object.entries(SEMANTIC).map(([group, items]) => (
        <div key={group}>
          <Section>{group}</Section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
            {items.map(([label, v, ramp]) => <Chip key={v} label={label} v={v} ramp={ramp} />)}
          </div>
        </div>
      ))}
    </Page>
  ),
};

const GRADS = [["primary-hero", "Primary hero"], ["primary-card", "Primary card"], ["secondary-hero", "Secondary hero"], ["secondary-card", "Secondary card"], ["ai-hero", "AI hero"], ["ai-card", "AI card"]];

// Pull the ordered, de-duplicated hex stops out of a gradient's computed
// background-image so the palette lists the actual colours each gradient blends.
function useGradientStops(varName) {
  const ref = React.useRef(null);
  const [stops, setStops] = React.useState([]);
  React.useEffect(() => {
    if (!ref.current) return;
    const bg = getComputedStyle(ref.current).backgroundImage || "";
    const out = [];
    for (const m of bg.matchAll(/rgba?\(([^)]+)\)/g)) {
      const hex = rgbToHex(m[1]);
      if (hex && !out.includes(hex)) out.push(hex);
    }
    setStops(out);
  }, [varName]);
  return [ref, stops];
}

function GradientCard({ g, label }) {
  const v = `--tp-gradient-${g}`;
  const [ref, stops] = useGradientStops(v);
  return (
    <div>
      <div ref={ref} style={{ height: 110, borderRadius: 12, background: `var(${v})` }} />
      <div style={{ font: "500 12px/16px Inter", marginTop: 8 }}>{label}</div>
      <div style={{ font: "400 11px/14px ui-monospace, monospace", color: "var(--tp-slate-500)" }}>{v}</div>
      {stops.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          {stops.map((hex) => (
            <span key={hex} style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 10px/12px ui-monospace, monospace", color: "var(--tp-slate-600)", border: "1px solid var(--tp-slate-100)", borderRadius: 4, padding: "2px 5px" }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: hex, border: "1px solid rgba(0,0,0,0.1)" }} />
              {hex}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export const Gradients = {
  render: () => (
    <Page>
      <Title sub={<>Brand depth + AI surface + component marks. Use via <Code>var(--tp-gradient-&lt;name&gt;)</Code>. Each card lists the hex stops it blends.</>}>Gradients</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {GRADS.map(([g, label]) => <GradientCard key={g} g={g} label={label} />)}
      </div>
    </Page>
  ),
};
