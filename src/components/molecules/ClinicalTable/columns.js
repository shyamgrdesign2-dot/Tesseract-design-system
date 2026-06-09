/**
 * ClinicalTable column helpers — pure config logic, no React components.
 * (Kept separate from cells.jsx so that file can stay component-only for
 * fast-refresh, and so this logic is unit-testable in isolation.)
 */

export const toOptions = (opts) => (opts ?? []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));

// Adoptable min/max widths per cell type — columns stay scalable without each one
// declaring widths. A column may still override with width/minWidth/maxWidth.
//   number  short values (doses, counts)            84–120
//   select  short picks (1-0-1, Mild, 2 days)      120–180
//   text    free notes                             140–260
//   search  long names (a primary key / medicine)  200–320
export const TYPE_WIDTHS = {
  number: { minWidth: 84,  maxWidth: 120 },
  date:   { minWidth: 140, maxWidth: 180 },
  select: { minWidth: 120, maxWidth: 180 },
  text:   { minWidth: 140, maxWidth: 260 },
  search: { minWidth: 200, maxWidth: 320 },
};

// Responsive per-column sizing. The table is fluid (auto layout): each column
// flexes between min and max. An `expand` column (e.g. Notes) carries NO max so
// it absorbs the leftover width up to the screen; every other column is capped.
export const columnWidthStyle = (c) => {
  const d = TYPE_WIDTHS[c.type] ?? TYPE_WIDTHS.text;
  return {
    width: c.width,
    minWidth: c.minWidth ?? d.minWidth,
    maxWidth: c.expand ? undefined : (c.maxWidth ?? d.maxWidth),
  };
};

// Whether a dropdown column shows the ↑↓↵esc key hints: only the interactive
// "frequently used" surfaces (search comboboxes, or any dropdown with a section
// heading) — NOT short plain pick-lists.
export const showsKeyHints = (c) => c.type === "search" || Boolean(c.frequentlyUsedLabel);

/**
 * Resolve a cell's status ring colour.
 *   1. column.validate(value, row) wins when it returns a status.
 *   2. else, a `search` column with `flagCustom` rings any value that is NOT in
 *      its option list — i.e. a custom / not-from-database entry. `flagCustom`
 *      may be `true` (→ "warning"), or an explicit "warning" | "error".
 * Opt-in: with no validate and no flagCustom, a cell shows no status ring.
 */
export function resolveStatus(c, value, row) {
  if (c.validate) {
    const s = c.validate(value, row);
    if (s) return s;
  }
  if (c.type === "search" && c.flagCustom) {
    const v = String(value ?? "").trim().toLowerCase();
    if (v) {
      const known = toOptions(c.options).some(
        (o) => String(o.label).toLowerCase() === v || String(o.value).toLowerCase() === v,
      );
      if (!known) return c.flagCustom === true ? "warning" : c.flagCustom;
    }
  }
  return undefined;
}
