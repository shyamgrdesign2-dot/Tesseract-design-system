import React from "react";
import { addons, types, useArgs, useArgTypes } from "storybook/manager-api";
import { getIconBaseUrl } from "../src/components/atoms/icons/tp/iconBase";
import CATALOG from "../src/components/atoms/icons/tp/icon-catalog.json";
import MANIFEST from "../src/components/atoms/icons/tp/icon-manifest.json";
import tesseractTheme from "./theme";

// Tesseract Design System — branded manager UI (sidebar logo + theme).
addons.setConfig({ theme: tesseractTheme });

const ADDON_ID = "tp-icons";
const PANEL_ID = `${ADDON_ID}/panel`;

const CORNERS = ["rounded", "straight"];
const STYLES = ["linear", "bold", "bulk", "broken", "twotone", "outline"];
const CAP = 600;

const _familiesPerCorner = {};
CORNERS.forEach((c) => {
  _familiesPerCorner[c] = CATALOG[c] ? ["All", ...Object.keys(CATALOG[c]).sort()] : ["All"];
});

function buildEntries(corner) {
  const fams = CATALOG[corner] || {};
  const out = [];
  for (const fam of Object.keys(fams).sort()) {
    for (const name of fams[fam]) {
      out.push({ name, family: fam });
    }
  }
  return out;
}

const _entriesCache = {};
function getEntries(corner) {
  if (!_entriesCache[corner]) _entriesCache[corner] = buildEntries(corner);
  return _entriesCache[corner];
}

function maskStyle(name, family, style, corner, color) {
  const url = `${getIconBaseUrl()}/${corner}/${style}/${family}/${name}.svg`;
  const mask = `url("${url}") no-repeat center / contain`;
  return { WebkitMask: mask, mask, backgroundColor: color };
}

function Cell({ entry, style, corner, active, onPick }) {
  return (
    <button
      type="button"
      title={`${entry.name} · ${entry.family}`}
      onClick={() => onPick(entry)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "8px 4px",
        border: active ? "1px solid #4b4ad5" : "1px solid transparent",
        borderRadius: 8,
        background: active ? "rgba(75,74,213,0.12)" : "transparent",
        cursor: "pointer",
      }}
    >
      <span style={{ width: 24, height: 24, ...maskStyle(entry.name, entry.family, style, corner, "#8b8b96") }} />
      <span style={{ fontSize: 9, maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.7 }}>
        {entry.name}
      </span>
    </button>
  );
}

const inputStyle = { padding: "6px 10px", border: "1px solid #e2e2ea", borderRadius: 8, fontSize: 12, fontFamily: "Inter, sans-serif" };

function Seg({ value, options, onChange }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid #e2e2ea", borderRadius: 8, overflow: "hidden" }}>
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          style={{ padding: "6px 10px", fontSize: 12, fontFamily: "Inter, sans-serif", cursor: "pointer", border: "none",
            background: value === o ? "#4b4ad5" : "transparent", color: value === o ? "#fff" : "#454551", textTransform: "capitalize" }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Panel() {
  const [args, updateArgs] = useArgs();
  const argTypes = useArgTypes();

  const iconArgs = Object.entries(argTypes || {})
    .filter(([, v]) => v && v.tpIcon)
    .map(([key, v]) => ({ key, label: v.name || key }));

  const [targetState, setTarget] = React.useState(null);
  const [corner, setCorner] = React.useState("rounded");
  const [family, setFamily] = React.useState("All");
  const [style, setStyle] = React.useState("linear");
  const [q, setQ] = React.useState("");

  const target = targetState && iconArgs.some((a) => a.key === targetState) ? targetState : iconArgs[0]?.key;

  if (!iconArgs.length) {
    return (
      <div style={{ padding: 16, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.5 }}>
        This story has no icon controls. Add <code>tpIcon: true</code> to an argType to pick icons here.
      </div>
    );
  }

  const families = _familiesPerCorner[corner] || ["All"];
  const entries = getEntries(corner);

  const ql = q.trim().toLowerCase();
  const filtered = entries.filter((e) =>
    (family === "All" || e.family === family) && (!ql || e.name.toLowerCase().includes(ql))
  );
  const shown = filtered.slice(0, CAP);

  const cur = args[target] || "";
  const curName = cur.includes("/") ? cur.slice(cur.indexOf("/") + 1) : cur;
  const curStyle = cur.includes("/") ? cur.slice(0, cur.indexOf("/")) : "linear";

  const totalAll = CORNERS.reduce((sum, c) => sum + getEntries(c).length, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "10px 12px", borderBottom: "1px solid #e2e2ea" }}>
        {iconArgs.length > 1 && (
          <select value={target} onChange={(e) => setTarget(e.target.value)} style={inputStyle} title="Which control to set">
            {iconArgs.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
          </select>
        )}
        <Seg value={corner} options={CORNERS} onChange={(c) => { setCorner(c); if (family !== "All" && !(_familiesPerCorner[c] || []).includes(family)) setFamily("All"); }} />
        <select value={family} onChange={(e) => setFamily(e.target.value)} style={inputStyle} title="Family (folder)">
          {families.map((f) => <option key={f} value={f}>{f === "All" ? `All families (${entries.length})` : f}</option>)}
        </select>
        <select value={style} onChange={(e) => setStyle(e.target.value)} style={inputStyle} title="Style (variant)">
          {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input style={{ ...inputStyle, flex: 1, minWidth: 160 }} placeholder="Search all icons…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", fontSize: 11, opacity: 0.6 }}>
        <span>{filtered.length} matches{filtered.length > CAP ? ` (showing ${CAP})` : ""}</span>
        <span>·</span>
        <span>{totalAll} icons across {CORNERS.length} corners × {STYLES.length} styles = 50,482 variants</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 4, padding: 10 }}>
        {shown.map((e, i) => (
          <Cell
            key={`${e.family}/${e.name}/${i}`}
            entry={e}
            style={style}
            corner={corner}
            active={curName === e.name && curStyle === style}
            onPick={(entry) => {
              const defaultFam = MANIFEST[entry.name];
              const qualified = (defaultFam && defaultFam !== entry.family) ? `${entry.family}:${entry.name}` : entry.name;
              updateArgs({ [target]: style === "linear" ? qualified : `${style}/${qualified}` });
            }}
          />
        ))}
        {!filtered.length && <div style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center", opacity: 0.5, fontSize: 12 }}>No icons match "{q}"{family !== "All" ? ` in ${family}` : ""}.</div>}
      </div>
    </div>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Tesseract Icons",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => (active ? <Panel /> : null),
  });
});
