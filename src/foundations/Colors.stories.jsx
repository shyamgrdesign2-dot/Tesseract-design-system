import React from "react";
import { Page, Title, Section, Code } from "./_kit";
import { SURFACE_GRADIENTS, grainStyle } from "./surfaceGradients";

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
// runtime ramp override (e.g. a TesseractThemeProvider dark theme), not a hardcoded
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
        <span style={{ font: "600 11px/12px Inter", color: dark ? "rgba(255,255,255,0.92)" : "var(--tesseract-slate-700)" }}>{step}</span>
      </div>
      <div style={{ font: "600 10px/13px ui-monospace, monospace", color: "var(--tesseract-slate-600)", marginTop: 4, letterSpacing: "0.02em" }}>{hex || "—"}</div>
    </div>
  );
}

function Ramp({ name, prefix, steps, note }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <strong style={{ font: "600 13px/16px Inter" }}>{name}</strong>
        <span style={{ font: "400 12px/16px Inter", color: "var(--tesseract-slate-500)" }}>{note}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 4 }}>
        {steps.map((s) => {
          const v = `--tesseract-${prefix}-${s}`;
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
      <Title sub={<>10-step ramps, the raw colour primitives. Use via <Code>var(--tesseract-&lt;ramp&gt;-&lt;step&gt;)</Code> — e.g. <Code>var(--tesseract-blue-500)</Code>. The 500 step is each ramp's base; each swatch shows its resolved hex.</>}>Colours</Title>
      {RAMPS.map(([name, prefix, steps, note]) => <Ramp key={prefix} name={name} prefix={prefix} steps={steps} note={note} />)}
    </Page>
  ),
};

// Real semantic tokens (defined in tesseract-tokens.css → var(--tesseract-fg/bg/border-*)).
// [label, semantic token, underlying ramp] — the ramp is shown for reference.
const SEMANTIC = {
  Text: [
    ["heading", "--tesseract-fg-heading", "slate-900"], ["primary", "--tesseract-fg-primary", "slate-700"],
    ["secondary", "--tesseract-fg-secondary", "slate-600"], ["tertiary", "--tesseract-fg-tertiary", "slate-500"],
    ["placeholder", "--tesseract-fg-placeholder", "slate-300"], ["disabled", "--tesseract-fg-disabled", "slate-200"],
    ["inverse / on-dark", "--tesseract-fg-inverse", "slate-0"], ["brand / link", "--tesseract-fg-link", "blue-500"],
    ["success", "--tesseract-fg-success", "success-700"], ["warning", "--tesseract-fg-warning", "warning-600"],
    ["error", "--tesseract-fg-error", "error-500"],
  ],
  Background: [
    ["page", "--tesseract-bg-page", "slate-50"], ["page subtle", "--tesseract-bg-page-subtle", "slate-100"],
    ["surface / card", "--tesseract-bg-surface", "slate-0"], ["surface hover", "--tesseract-bg-surface-hover", "slate-50"],
    ["surface active", "--tesseract-bg-surface-active", "slate-100"], ["selected", "--tesseract-bg-selected", "blue-50"],
    ["inverse", "--tesseract-bg-inverse", "slate-900"],
    ["brand soft", "--tesseract-bg-brand-soft", "blue-50"],
    ["success soft", "--tesseract-bg-success-soft", "success-50"], ["warning soft", "--tesseract-bg-warning-soft", "warning-50"],
    ["error soft", "--tesseract-bg-error-soft", "error-50"],
  ],
  Border: [
    ["soft", "--tesseract-border-soft", "slate-100"], ["neutral", "--tesseract-border-neutral", "slate-200"],
    ["strong", "--tesseract-border-strong", "slate-300"], ["focus", "--tesseract-border-focus", "blue-500"],
    ["brand / primary", "--tesseract-border-primary", "blue-500"], ["success", "--tesseract-border-success", "success-500"],
    ["warning", "--tesseract-border-warning", "warning-500"], ["error", "--tesseract-border-error", "error-500"],
  ],
};
function Chip({ label, v, ramp }) {
  const [ref, hex] = useResolvedHex(v);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "1px solid var(--tesseract-slate-100)", borderRadius: 8 }}>
      <span ref={ref} title={`${v} · ${hex}`} style={{ width: 22, height: 22, borderRadius: 6, background: `var(${v})`, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
      <span style={{ font: "500 12px/15px Inter" }}>{label}<br /><span style={{ font: "400 11px/14px ui-monospace, monospace", color: "var(--tesseract-slate-500)" }}>{v}{ramp ? ` · ${ramp}` : ""}{hex ? ` · ${hex}` : ""}</span></span>
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
  const v = `--tesseract-gradient-${g}`;
  const [ref, stops] = useGradientStops(v);
  return (
    <div>
      <div ref={ref} style={{ height: 110, borderRadius: 12, background: `var(${v})` }} />
      <div style={{ font: "500 12px/16px Inter", marginTop: 8 }}>{label}</div>
      <div style={{ font: "400 11px/14px ui-monospace, monospace", color: "var(--tesseract-slate-500)" }}>{v}</div>
      {stops.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          {stops.map((hex) => (
            <span key={hex} style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "500 10px/12px ui-monospace, monospace", color: "var(--tesseract-slate-600)", border: "1px solid var(--tesseract-slate-100)", borderRadius: 4, padding: "2px 5px" }}>
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
      <Title sub={<>Brand depth + AI surface + component marks. Use via <Code>var(--tesseract-gradient-&lt;name&gt;)</Code>. Each card lists the hex stops it blends.</>}>Gradients</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {GRADS.map(([g, label]) => <GradientCard key={g} g={g} label={label} />)}
      </div>
    </Page>
  ),
};

// ── Premium SURFACE gradients (violet + blue) — the shiny dark surfaces used by
// HeroBanner, with an optional film-grain overlay. One shared source of truth in
// foundations/surfaceGradients.js, so docs + component can't drift.
function SurfaceCard({ tone, grain }) {
  return (
    <div>
      <div style={{ position: "relative", height: 160, borderRadius: 16, overflow: "hidden", background: SURFACE_GRADIENTS[tone] }}>
        {grain && <div style={grainStyle} aria-hidden />}
        <span style={{ position: "absolute", left: 16, bottom: 13, zIndex: 1, font: "700 15px/18px Mulish, Inter", color: "rgba(255,255,255,0.94)", textTransform: "capitalize" }}>{tone} surface</span>
      </div>
      <div style={{ font: "400 11px/14px ui-monospace, monospace", color: "var(--tesseract-slate-500)", marginTop: 7 }}>
        SURFACE_GRADIENTS.{tone}{grain ? " + grain" : ""}
      </div>
    </div>
  );
}

export const SurfaceGradients = {
  args: { grain: true },
  argTypes: { grain: { control: "boolean", name: "film grain" } },
  parameters: { layout: "fullscreen", options: { showPanel: true } },
  render: ({ grain }) => (
    <Page>
      <Title sub={<>The premium dark <strong>surface gradients</strong> the <Code>HeroBanner</Code> uses — token-only, two tones (violet · blue), each a layered sheen + highlight pools + a near-black field. Toggle the <strong>film-grain</strong> texture. Shared source: <Code>foundations/surfaceGradients.js</Code>.</>}>Surface gradients</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
        {Object.keys(SURFACE_GRADIENTS).map((t) => <SurfaceCard key={t} tone={t} grain={grain} />)}
      </div>
    </Page>
  ),
};
