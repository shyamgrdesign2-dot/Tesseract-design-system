import React from "react";
import { addons, types, useArgs, useArgTypes } from "storybook/manager-api";
import { tpMedicalIconNames } from "../src/components/atoms/MedicalIcon/registry";
import { getIconBaseUrl } from "../src/components/atoms/icons/tp/iconBase";
import tpTheme from "./theme";

// TatvaPractice-branded Storybook chrome (sidebar logo, brand colours, fonts).
addons.setConfig({ theme: tpTheme });

const ADDON_ID = "tp-icons";
const PANEL_ID = `${ADDON_ID}/panel`;
const STYLES = ["linear", "bulk", "bold"];
const CAP = 300; // cap rendered previews; search narrows the rest

// Manifest is fetched once and cached across renders. The curated health names
// seed the list so they surface before the manifest resolves (they're part of
// the one library now, so the manifest also contains them).
let _manifest = null;
function useIconNames() {
  const [names, setNames] = React.useState(_manifest || tpMedicalIconNames);
  React.useEffect(() => {
    if (_manifest) return;
    fetch("/tp-icons/manifest.json")
      .then((r) => r.json())
      .then((d) => {
        _manifest = d.map((m) => m.n);
        setNames(_manifest);
      })
      .catch(() => {});
  }, []);
  return names;
}

function maskStyle(name, style, color) {
  const url = `${getIconBaseUrl()}/${style}/${encodeURIComponent(name)}.svg`;
  const mask = `url("${url}") no-repeat center / contain`;
  return { WebkitMask: mask, mask, backgroundColor: color };
}

function Cell({ name, style, active, onPick }) {
  return (
    <button
      type="button"
      title={name}
      onClick={() => onPick(name)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 4px",
        border: active ? "1px solid #4b4ad5" : "1px solid transparent",
        borderRadius: 8,
        background: active ? "rgba(75,74,213,0.12)" : "transparent",
        cursor: "pointer",
      }}
    >
      <span style={{ width: 24, height: 24, ...maskStyle(name, style, "#8b8b96") }} />
      <span style={{ fontSize: 9, maxWidth: 68, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.7 }}>
        {name}
      </span>
    </button>
  );
}

function Panel() {
  const [args, updateArgs] = useArgs();
  const argTypes = useArgTypes();
  const names = useIconNames();

  const iconArgs = Object.entries(argTypes || {})
    .filter(([, v]) => v && v.tpIcon)
    .map(([key, v]) => ({ key, label: v.name || key }));

  const [targetState, setTarget] = React.useState(null);
  const [style, setStyle] = React.useState("linear");
  const [q, setQ] = React.useState("");

  const target = targetState && iconArgs.some((a) => a.key === targetState) ? targetState : iconArgs[0]?.key;

  const inputStyle = { padding: "6px 10px", border: "1px solid #e2e2ea", borderRadius: 8, fontSize: 12, fontFamily: "Inter, sans-serif" };

  if (!iconArgs.length) {
    return (
      <div style={{ padding: 16, fontFamily: "Inter, sans-serif", fontSize: 13, lineHeight: 1.5 }}>
        This story has no icon controls. Add <code>tpIcon: true</code> to an argType to pick icons here.
      </div>
    );
  }

  const ql = q.trim().toLowerCase();
  const filtered = ql ? names.filter((n) => n.toLowerCase().includes(ql)) : names;
  const shown = filtered.slice(0, CAP);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "10px 12px", borderBottom: "1px solid #e2e2ea" }}>
        {iconArgs.length > 1 && (
          <select value={target} onChange={(e) => setTarget(e.target.value)} style={inputStyle}>
            {iconArgs.map((a) => (
              <option key={a.key} value={a.key}>{a.label}</option>
            ))}
          </select>
        )}
        <select value={style} onChange={(e) => setStyle(e.target.value)} style={inputStyle}>
          {STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input style={{ ...inputStyle, flex: 1, minWidth: 160 }} placeholder="Search TP + medical icons…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span style={{ fontSize: 11, opacity: 0.6 }}>
          {filtered.length} matches{filtered.length > CAP ? ` (showing ${CAP})` : ""}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 4, padding: 10 }}>
        {shown.map((n) => {
          // Encode the chosen style into the value as "style/name" (plain name
          // for linear) so the rendered icon honours the picked style.
          const cur = args[target] || "";
          const curName = cur.includes("/") ? cur.slice(cur.indexOf("/") + 1) : cur;
          const curStyle = cur.includes("/") ? cur.slice(0, cur.indexOf("/")) : "linear";
          return (
            <Cell
              key={n}
              name={n}
              style={style}
              active={curName === n && curStyle === style}
              onPick={(name) => updateArgs({ [target]: style === "linear" ? name : `${style}/${name}` })}
            />
          );
        })}
        {!filtered.length && <div style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center", opacity: 0.5, fontSize: 12 }}>No icons match “{q}”.</div>}
      </div>
    </div>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "TP Icons",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => (active ? <Panel /> : null),
  });
});
