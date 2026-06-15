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
  ["Success", "success", STEPS, "Confirmed, vitals normal."],
  ["Warning", "warning", STEPS, "Drug interaction, pending review."],
  ["Error", "error", STEPS, "Allergy flag, validation failed, destructive."],
];

function Hex({ varName }) {
  const ref = React.useRef(null);
  const [hex, setHex] = React.useState("");
  React.useEffect(() => { if (ref.current) setHex(getComputedStyle(ref.current).backgroundColor); }, []);
  return <span ref={ref} style={{ background: `var(${varName})`, display: "block", width: 0, height: 0 }}>{hex && <span style={{ position: "absolute" }}>{""}</span>}{hex}</span>;
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
          return (
            <div key={s}>
              <div style={{ height: 56, borderRadius: 8, background: `var(${v})`, border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "flex-end", padding: 6 }}>
                <span style={{ font: "600 11px/12px Inter", color: dark ? "rgba(255,255,255,0.92)" : "var(--tp-slate-700)" }}>{s}</span>
              </div>
              <div style={{ font: "400 10px/13px ui-monospace, monospace", color: "var(--tp-slate-500)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis" }}><Hex varName={v} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Palette = {
  render: () => (
    <Page>
      <Title sub={<>10-step ramps, the raw colour primitives. Use via <Code>var(--tp-&lt;ramp&gt;-&lt;step&gt;)</Code> — e.g. <Code>var(--tp-blue-500)</Code>. The 500 step is each ramp's base.</>}>Colours</Title>
      {RAMPS.map(([name, prefix, steps, note]) => <Ramp key={prefix} name={name} prefix={prefix} steps={steps} note={note} />)}
    </Page>
  ),
};

const SEMANTIC = {
  Text: [["heading", "--tp-slate-900"], ["primary", "--tp-slate-700"], ["tertiary", "--tp-slate-600"], ["placeholder", "--tp-slate-400"], ["disabled", "--tp-slate-300"], ["brand / link", "--tp-blue-500"], ["success", "--tp-success-700"], ["warning", "--tp-warning-700"], ["error", "--tp-error-700"]],
  Background: [["page", "--tp-slate-100"], ["surface / card", "--tp-slate-0"], ["subtle / hover", "--tp-slate-50"], ["selected", "--tp-blue-50"], ["success soft", "--tp-success-50"], ["warning soft", "--tp-warning-50"], ["error soft", "--tp-error-50"]],
  Border: [["neutral", "--tp-slate-200"], ["strong", "--tp-slate-300"], ["primary", "--tp-blue-500"], ["success", "--tp-success-500"], ["warning", "--tp-warning-500"], ["error", "--tp-error-500"]],
};
function Chip({ label, v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: "1px solid var(--tp-slate-100)", borderRadius: 8 }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: `var(${v})`, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
      <span style={{ font: "500 12px/15px Inter" }}>{label}<br /><span style={{ font: "400 11px/14px ui-monospace, monospace", color: "var(--tp-slate-500)" }}>{v}</span></span>
    </div>
  );
}
export const SemanticTokens = {
  render: () => (
    <Page>
      <Title sub={<>Role-based aliases that map onto the ramps. Reach for these in product code so intent stays consistent.</>}>Semantic colours</Title>
      {Object.entries(SEMANTIC).map(([group, items]) => (
        <div key={group}>
          <Section>{group}</Section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {items.map(([label, v]) => <Chip key={label} label={label} v={v} />)}
          </div>
        </div>
      ))}
    </Page>
  ),
};

const GRADS = [["primary-hero", "Primary hero"], ["primary-card", "Primary card"], ["secondary-hero", "Secondary hero"], ["secondary-card", "Secondary card"], ["ai-hero", "AI hero"], ["ai-card", "AI card"]];
export const Gradients = {
  render: () => (
    <Page>
      <Title sub={<>Brand depth + AI surface. Use via <Code>var(--tp-gradient-&lt;name&gt;)</Code>.</>}>Gradients</Title>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {GRADS.map(([g, label]) => (
          <div key={g}>
            <div style={{ height: 110, borderRadius: 12, background: `var(--tp-gradient-${g})` }} />
            <div style={{ font: "500 12px/16px Inter", marginTop: 8 }}>{label}</div>
            <div style={{ font: "400 11px/14px ui-monospace, monospace", color: "var(--tp-slate-500)" }}>--tp-gradient-{g}</div>
          </div>
        ))}
      </div>
    </Page>
  ),
};
