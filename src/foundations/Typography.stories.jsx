import React from "react";
import { Page, Title, Section, Code } from "./_kit";

export default {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen", options: { showPanel: false } },
};

// [class, family, weight label, size token, lh token]
const HEADINGS = [
  ["display-xl", "Mulish", "Extrabold 800", "56", "64"],
  ["display", "Mulish", "Bold 700", "48", "56"],
  ["h1", "Mulish", "Bold 700", "36", "44"],
  ["h2", "Mulish", "Semibold 600", "30", "38"],
  ["h3", "Mulish", "Semibold 600", "24", "32"],
  ["h4", "Mulish", "Semibold 600", "20", "28"],
  ["h5", "Mulish", "Semibold 600", "16", "24"],
  ["h6", "Mulish", "Semibold 600", "14", "20"],
];
const BODY = [
  ["body-xl", "Inter", "Regular 400", "20", "32"],
  ["body-lg", "Inter", "Regular 400", "18", "28"],
  ["body-base", "Inter", "Regular 400", "16", "24"],
  ["body-sm", "Inter", "Regular 400", "14", "20"],
  ["body-xs", "Inter", "Regular 400", "12", "18"],
];
const UI = [
  ["label-lg", "Inter", "Semibold 600", "16", "24"],
  ["label-md", "Inter", "Semibold 600", "14", "20"],
  ["label-sm", "Inter", "Semibold 600", "12", "16"],
  ["caption-lg", "Inter", "Medium 500", "13", "18"],
  ["caption", "Inter", "Medium 500", "12", "16"],
  ["caption-sm", "Inter", "Medium 500", "11", "14"],
  ["micro", "Inter", "Medium 500", "10", "12"],
  ["overline", "Inter", "Bold 700", "11", "14"],
  ["link", "Inter", "Semibold 600", "14", "20"],
  ["code", "Mono", "Medium 500", "13", "20"],
];

function Row({ cls, family, weight, size, lh }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 230px", gap: 16, alignItems: "baseline", padding: "12px 0", borderBottom: "1px solid var(--tesseract-slate-100)" }}>
      <code style={{ font: "500 12px/16px ui-monospace, monospace", color: "var(--tesseract-slate-600)" }}>.tp-{cls}</code>
      <span className={`tp-${cls}`}>The five boxing wizards jump quickly</span>
      <span style={{ font: "400 11px/16px Inter", color: "var(--tesseract-slate-500)" }}>{family} · {weight} · {size}/{lh}</span>
    </div>
  );
}

export const Scale = {
  render: () => (
    <Page>
      <Title sub={<>Headings use <strong>Mulish</strong>; body, labels, captions and code use <strong>Inter</strong> / mono. Apply a role as a class, e.g. <Code>&lt;p class="tp-body-base"&gt;</Code>, or compose from the size/line-height tokens (<Code>--tesseract-text-h1</Code> / <Code>--tesseract-text-h1-lh</Code>).</>}>Typography</Title>
      <Section>Headings · Mulish</Section>
      {HEADINGS.map((r) => <Row key={r[0]} cls={r[0]} family={r[1]} weight={r[2]} size={r[3]} lh={r[4]} />)}
      <Section>Body · Inter</Section>
      {BODY.map((r) => <Row key={r[0]} cls={r[0]} family={r[1]} weight={r[2]} size={r[3]} lh={r[4]} />)}
      <Section>Labels · captions · UI</Section>
      {UI.map((r) => <Row key={r[0]} cls={r[0]} family={r[1]} weight={r[2]} size={r[3]} lh={r[4]} />)}
    </Page>
  ),
};

export const Families = {
  render: () => (
    <Page>
      <Title sub="Two families, one system. Mulish gives headings a distinct, friendly weight; Inter keeps dense UI legible.">Font families</Title>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[["Mulish", "var(--tesseract-font-heading)", "Headings (display + h1–h6)"], ["Inter", "var(--tesseract-font-body)", "Body, labels, captions, UI"]].map(([name, fam, use]) => (
          <div key={name} style={{ border: "1px solid var(--tesseract-slate-200)", borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: fam, fontWeight: 700, fontSize: 44, lineHeight: 1.1 }}>Aa</div>
            <div style={{ fontFamily: fam, fontSize: 18, marginTop: 8 }}>The quick brown fox</div>
            <div style={{ fontFamily: fam, fontSize: 13, color: "var(--tesseract-slate-500)", marginTop: 4 }}>ABCDEFGHIJKLM · abcdefghijklm · 0123456789</div>
            <div style={{ marginTop: 12, font: "600 13px/16px Inter" }}>{name}<span style={{ font: "400 12px/16px Inter", color: "var(--tesseract-slate-500)" }}> — {use}</span></div>
          </div>
        ))}
      </div>
    </Page>
  ),
};
