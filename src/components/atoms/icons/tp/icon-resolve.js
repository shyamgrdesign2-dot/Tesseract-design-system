// ─────────────────────────────────────────────────────────────────────────────
// Icon path resolution for the Tesseract icon CDN.
//
// Every icon is served from:
//   <base>/<corner>/<style>/<family>/<name>.svg
//   e.g. https://pmdoctorportal.tatvacare.in/tp-icons/rounded/linear/ai/ai-3d-box.svg
//
// The caller only knows the icon NAME (+ optional style/corner); the FAMILY is
// looked up from the bundled manifest (name -> family). A few curated names that
// pre-date the catalog are aliased to their catalog equivalents.
// ─────────────────────────────────────────────────────────────────────────────

import MANIFEST from "./icon-manifest.json";

export const ICON_STYLES = ["linear", "bold", "bulk", "broken", "twotone", "outline"];
export const ICON_CORNERS = ["rounded", "straight"];

const STYLE_ALIAS = {
  line: "linear", solid: "bold", "dual-tone": "bulk", dualtone: "bulk",
  "two-tone": "twotone", default: "linear",
};

export const ICON_ALIAS = {
  "arrow-down-02": "arrow-down",
  "arrow-right-02": "arrow-right",
  "calendar-1": "calendar",
  // Disclosure/affordance chevrons → the CENTERED chevron glyphs (the plain
  // arrow-down/up/etc sit low in the viewbox and read as a pointing arrow).
  "chevron-down": "arrow-down4",
  "chevron-up": "arrow-up4",
  "chevron-left": "arrow-left3", // arrow-left4 is missing on the CDN; left3 is the matching centered chevron
  "chevron-right": "arrow-right4",
  "more-horizontal": "more",
  "message": "messages",
  "success": "tick-circle",
};

export const resolveIconName = (name) => ICON_ALIAS[name] || name;

export const normStyle = (style) => {
  const s = STYLE_ALIAS[style] || style;
  return ICON_STYLES.includes(s) ? s : "linear";
};

export const normCorner = (corner) => (ICON_CORNERS.includes(corner) ? corner : "rounded");

// Parse "family:name" format — returns { name, family } or { name, family: null }.
export function parseQualifiedName(raw) {
  if (!raw) return { name: raw, family: null };
  const i = raw.indexOf(":");
  if (i > 0) return { name: raw.slice(i + 1), family: raw.slice(0, i) };
  return { name: raw, family: null };
}

export const iconFamily = (name) => {
  const { name: n, family: f } = parseQualifiedName(name);
  return f || MANIFEST[resolveIconName(n)] || null;
};

export const hasIcon = (name) => !!iconFamily(name);

export function iconPath({ name, style = "linear", corner = "rounded", family } = {}) {
  if (!name) return null;
  const { name: parsed, family: qFam } = parseQualifiedName(name);
  const n = resolveIconName(parsed);
  const fam = family || qFam || MANIFEST[n];
  if (!fam) return null;
  return `${normCorner(corner)}/${normStyle(style)}/${fam}/${encodeURIComponent(n)}.svg`;
}
