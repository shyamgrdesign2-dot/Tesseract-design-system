"use client";

/**
 * IconFinder — a searchable explorer for the full Tesseract icon CDN.
 *
 * Type a query → filter the catalog by name → each match is expanded across
 * EVERY family it belongs to (the same name can live in several families, e.g.
 * `add` exists in arrow2 · essential · mobile · web). A family filter (all on by
 * default) lets you narrow without missing any. Each tile fetches live from the
 * CDN (`<base>/<corner>/<style>/<family>/<name>.svg`); click to copy its URL.
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { TP_LIBRARY_ICONS } from "@/src/components/atoms/icons/tp/library-names";
import ICON_AVAILABILITY from "@/src/components/atoms/icons/tp/icon-availability.json";
import ICON_CATALOG from "@/src/components/atoms/icons/tp/icon-catalog.json";
import { iconPath } from "@/src/components/atoms/icons/tp/icon-resolve";
import { getIconBaseUrl } from "@/src/components/atoms/icons/tp/iconBase";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Button } from "@/src/components/atoms/Button";
import { Dropdown } from "@/src/components/molecules/Dropdown";

// Order MUST match the availability bitmask (built from the CDN catalog):
// bit = cornerIndex*6 + styleIndex.
const STYLES = ["linear", "bold", "bulk", "broken", "twotone", "outline"];
const CORNERS = ["rounded", "straight"];
const availBit = (corner, style) => 1 << (CORNERS.indexOf(corner) * 6 + STYLES.indexOf(style));
const hasIcon = (name, corner, style) => (ICON_AVAILABILITY[name] & availBit(corner, style)) !== 0;
const CAP = 300; // cap rendered tiles so a broad query doesn't fire thousands of fetches

// corner -> [{ name, family }] built once from the catalog (corner -> family -> names).
const PAIRS_BY_CORNER = Object.fromEntries(
  CORNERS.map((corner) => {
    const byFamily = ICON_CATALOG[corner] || {};
    const pairs = [];
    for (const family of Object.keys(byFamily)) {
      for (const name of byFamily[family]) pairs.push({ name, family });
    }
    // group same names together, families alphabetical within a name
    pairs.sort((a, b) => a.name.localeCompare(b.name) || a.family.localeCompare(b.family));
    return [corner, pairs];
  }),
);

// Robust clipboard copy — fire BOTH the modern async API and the legacy
// textarea+execCommand path, synchronously inside the click gesture, so whichever
// the environment allows (secure/insecure, same/cross-origin iframe) succeeds.
function copyText(text) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    document.execCommand("copy");
    document.body.removeChild(ta);
  } catch { /* no-op */ }
  try { navigator.clipboard?.writeText(text).then(() => {}, () => {}); } catch { /* no-op */ }
}

const LABEL = { font: "600 11px/14px Inter, sans-serif", color: "var(--tesseract-slate-400)", textTransform: "uppercase", letterSpacing: "0.04em" };

function Toggle({ value, set, options }) {
  return (
    <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => (
        <Button key={o} size="sm" variant={value === o ? "solid" : "tonal"} theme={value === o ? "primary" : "neutral"} onClick={() => set(o)}>
          {o}
        </Button>
      ))}
    </div>
  );
}

export function IconFinder() {
  const [q, setQ] = React.useState("");
  const [style, setStyle] = React.useState("linear");
  const [corner, setCorner] = React.useState("rounded");
  const [excluded, setExcluded] = React.useState(() => new Set()); // empty = ALL families selected
  const [copied, setCopied] = React.useState("");

  const query = q.trim().toLowerCase();

  // All (name, family) pairs that match the query + exist in the current style/corner.
  const queryPairs = React.useMemo(
    () => PAIRS_BY_CORNER[corner].filter((p) => (!query || p.name.includes(query)) && hasIcon(p.name, corner, style)),
    [query, corner, style],
  );

  // Families present in the current query (for the filter chips) — all on by default.
  const familiesInResults = React.useMemo(() => {
    const s = new Set();
    for (const p of queryPairs) s.add(p.family);
    return [...s].sort();
  }, [queryPairs]);

  const visible = queryPairs.filter((p) => !excluded.has(p.family));
  const shown = visible.slice(0, CAP);

  // Family multi-select (dropdown). Selected = every family in the current
  // results minus the ones the user explicitly excluded → all-on by default.
  const familyOptions = familiesInResults.map((f) => ({ value: f, label: f }));
  const selectedFamilies = familiesInResults.filter((f) => !excluded.has(f));
  const onFamilyChange = (next) => {
    const keep = new Set(next);
    setExcluded((prev) => {
      const e = new Set(prev);
      for (const f of familiesInResults) { if (keep.has(f)) e.delete(f); else e.add(f); }
      return e;
    });
  };

  const copy = (name, family) => {
    const key = `${family}:${name}`;
    copyText(`${getIconBaseUrl()}/${iconPath({ name, style, corner, family })}`);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? "" : c)), 1200);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "var(--tesseract-slate-900)", padding: 28, maxWidth: 1120 }}>
      <h1 style={{ font: "700 28px/34px Mulish, sans-serif", margin: "0 0 6px" }}>Icon Finder</h1>
      <p style={{ font: "400 14px/22px Inter", color: "var(--tesseract-slate-500)", maxWidth: 780, margin: "0 0 22px" }}>
        Search all <strong>{TP_LIBRARY_ICONS.length.toLocaleString()}</strong> icons (each in up to 6 styles × 2 corners ≈ 50k SVGs).
        The same name can exist in several <strong>families</strong> — every family is shown by default so you never miss one.
        <strong> Click any icon to copy its CDN URL.</strong>
      </p>

      <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
        <div style={{ maxWidth: 440 }}>
          <InputBox value={q} onChange={(e) => setQ(e?.target?.value ?? e)} placeholder="Search icons by name… (heart, calendar, arrow, user)"
            leftIcon={<TPLibraryIcon name="search:search-2" size={16} />} clearable />
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "grid", gap: 6 }}><span style={LABEL}>Style</span><Toggle value={style} set={setStyle} options={STYLES} /></div>
          <div style={{ display: "grid", gap: 6 }}><span style={LABEL}>Corner</span><Toggle value={corner} set={setCorner} options={CORNERS} /></div>
        </div>

        {/* Family filter — a multi-select dropdown, all families selected by
            default (uncheck to narrow; "all"/"none" for quick reset). */}
        {familiesInResults.length > 1 && (
          <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
            <span style={{ ...LABEL, display: "inline-flex", alignItems: "center", gap: 4 }}>
              Family
              <Button size="sm" variant="link" theme="primary" onClick={() => setExcluded(new Set())} style={{ textTransform: "none" }}>all</Button>
              <span style={{ color: "var(--tesseract-slate-300)" }}>·</span>
              <Button size="sm" variant="link" theme="neutral" onClick={() => setExcluded(new Set(familiesInResults))} style={{ textTransform: "none" }}>none</Button>
            </span>
            <Dropdown
              mode="multi"
              optionControl="checkbox"
              searchable
              searchPlaceholder="Filter families…"
              width={280}
              placeholder="Select families…"
              options={familyOptions}
              value={selectedFamilies}
              onChange={onFamilyChange}
            />
          </div>
        )}

        <div style={{ font: "400 13px/18px Inter", color: "var(--tesseract-slate-500)" }}>
          <strong style={{ color: "var(--tesseract-slate-800)" }}>{visible.length.toLocaleString()}</strong> {visible.length === 1 ? "icon" : "icons"} for {corner}/{style}
          {familiesInResults.length > 1 && <> across {familiesInResults.length - excluded.size}/{familiesInResults.length} families</>}
          {visible.length > CAP && <> · showing the first {CAP} — refine your search</>}
        </div>
      </div>

      {shown.length === 0 ? (
        <div style={{ padding: "48px 0", textAlign: "center", color: "var(--tesseract-slate-400)" }}>No icons match “{q}” in {corner}/{style}.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
          {shown.map(({ name, family }) => {
            const key = `${family}:${name}`;
            const isCopied = copied === key;
            return (
              <button key={key} type="button" onClick={() => copy(name, family)}
                title={`Copy CDN URL — ${getIconBaseUrl()}/${iconPath({ name, style, corner, family })}`}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 6px", border: "1px solid var(--tesseract-slate-100)", borderRadius: 10, background: isCopied ? "var(--tesseract-blue-50)" : "var(--tesseract-slate-0)", color: isCopied ? "var(--tesseract-blue-600)" : "var(--tesseract-slate-700)", cursor: "pointer", transition: "background 120ms ease, border-color 120ms ease" }}>
                <TPLibraryIcon name={name} family={family} variant={style} corner={corner} size={26} />
                <span style={{ font: "400 10px/13px Inter", color: isCopied ? "var(--tesseract-blue-600)" : "var(--tesseract-slate-700)", textAlign: "center", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                  {isCopied ? "URL copied!" : name}
                </span>
                {!isCopied && (
                  <span style={{ font: "400 9px/11px Inter", color: "var(--tesseract-slate-400)", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", textAlign: "center" }}>
                    {family}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default IconFinder;
