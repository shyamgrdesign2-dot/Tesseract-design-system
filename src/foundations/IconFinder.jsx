"use client";

/**
 * IconFinder — a searchable explorer for the full Tesseract icon CDN.
 *
 * Type a query → filter the catalog by name, scoped to the icons that actually
 * exist for the chosen corner + style → each result is fetched live from the CDN
 * (`<base>/<corner>/<style>/<family>/<name>.svg`). Click a tile to copy its CDN URL.
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { TP_LIBRARY_ICONS } from "@/src/components/atoms/icons/tp/library-names";
import ICON_AVAILABILITY from "@/src/components/atoms/icons/tp/icon-availability.json";
import { iconPath } from "@/src/components/atoms/icons/tp/icon-resolve";
import { getIconBaseUrl } from "@/src/components/atoms/icons/tp/iconBase";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Button } from "@/src/components/atoms/Button";

// Order MUST match the availability bitmask (built from the CDN catalog):
// bit = cornerIndex*6 + styleIndex.
const STYLES = ["linear", "bold", "bulk", "broken", "twotone", "outline"];
const CORNERS = ["rounded", "straight"];
const availBit = (corner, style) => 1 << (CORNERS.indexOf(corner) * 6 + STYLES.indexOf(style));
const hasIcon = (name, corner, style) => (ICON_AVAILABILITY[name] & availBit(corner, style)) !== 0;
const CAP = 300; // cap rendered results so a broad query doesn't fire thousands of fetches

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

const LABEL = { font: "600 11px/14px Inter, sans-serif", color: "var(--tp-slate-400)", textTransform: "uppercase", letterSpacing: "0.04em" };

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
  const [copied, setCopied] = React.useState("");

  const query = q.trim().toLowerCase();
  const matches = React.useMemo(
    () => TP_LIBRARY_ICONS.filter((n) => (!query || n.includes(query)) && hasIcon(n, corner, style)),
    [query, corner, style],
  );
  const shown = matches.slice(0, CAP);

  const copy = (name) => {
    copyText(`${getIconBaseUrl()}/${iconPath({ name, style, corner })}`);
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? "" : c)), 1200);
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "var(--tp-slate-900)", padding: 28, maxWidth: 1120 }}>
      <h1 style={{ font: "700 28px/34px Mulish, sans-serif", margin: "0 0 6px" }}>Icon Finder</h1>
      <p style={{ font: "400 14px/22px Inter", color: "var(--tp-slate-500)", maxWidth: 760, margin: "0 0 22px" }}>
        Search all <strong>{TP_LIBRARY_ICONS.length.toLocaleString()}</strong> icons (each in up to 6 styles × 2 corners ≈ 50k SVGs).
        Pick a style/corner, search by name, and <strong>click any icon to copy its CDN URL</strong>. Results are fetched live from the CDN.
      </p>

      <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
        <div style={{ maxWidth: 440 }}>
          <InputBox value={q} onChange={(e) => setQ(e?.target?.value ?? e)} placeholder="Search icons by name… (heart, calendar, arrow, user)"
            leftIcon={<TPLibraryIcon name="search" size={16} />} clearable />
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "grid", gap: 6 }}><span style={LABEL}>Style</span><Toggle value={style} set={setStyle} options={STYLES} /></div>
          <div style={{ display: "grid", gap: 6 }}><span style={LABEL}>Corner</span><Toggle value={corner} set={setCorner} options={CORNERS} /></div>
        </div>
        <div style={{ font: "400 13px/18px Inter", color: "var(--tp-slate-500)" }}>
          <strong style={{ color: "var(--tp-slate-800)" }}>{matches.length.toLocaleString()}</strong> {matches.length === 1 ? "icon" : "icons"} for {corner}/{style}
          {matches.length > CAP && <> · showing the first {CAP} — refine your search</>}
        </div>
      </div>

      {shown.length === 0 ? (
        <div style={{ padding: "48px 0", textAlign: "center", color: "var(--tp-slate-400)" }}>No icons match “{q}” in {corner}/{style}.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
          {shown.map((n) => (
            <button key={n} type="button" onClick={() => copy(n)} title={`Copy CDN URL — ${getIconBaseUrl()}/${iconPath({ name: n, style, corner })}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 6px", border: "1px solid var(--tp-slate-100)", borderRadius: 10, background: copied === n ? "var(--tp-blue-50)" : "var(--tp-slate-0)", color: copied === n ? "var(--tp-blue-600)" : "var(--tp-slate-700)", cursor: "pointer", transition: "background 120ms ease, border-color 120ms ease" }}>
              <TPLibraryIcon name={n} variant={style} corner={corner} size={26} />
              <span style={{ font: "400 10px/13px Inter", color: copied === n ? "var(--tp-blue-600)" : "var(--tp-slate-500)", textAlign: "center", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                {copied === n ? "URL copied!" : n}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default IconFinder;
