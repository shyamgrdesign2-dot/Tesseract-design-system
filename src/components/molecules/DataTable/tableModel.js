"use client";

/**
 * DataTable model — pure, framework-agnostic helpers that turn the flat
 * `data`/`columns` config into the structures the renderer needs:
 *
 *   orderColumns       sticky-left → normal → sticky-right (preserving order)
 *   columnPxWidth      the px width used for sticky offset math
 *   stickyOffsets      cumulative left/right px offset per sticky column
 *   collectKeys        every row key incl. nested descendants (for select-all)
 *   flattenRows        data → visual rows (group headers + data rows w/ depth),
 *                      honouring grouping, nesting and collapse/expand state
 *   computeRowSpans    per-cell rowSpan + a skip-set for `column.spanRows`
 *
 * Keeping this out of the component keeps the render path readable and the math
 * unit-testable. No React, no DOM.
 */

// A column never collapses below this when the table flexes (mirrors DataTable).
export const DEFAULT_MIN_WIDTH = 88;
// Width of the leading control column (checkbox / radio) when present. This is
// only the first-paint estimate; DataTable measures the real width at runtime.
export const LEADING_COL_WIDTH = 48;

// The px width a sticky column reserves for offset math. Sticky columns need a
// concrete width to stack against; fall back to width → minWidth → default.
export function columnPxWidth(col) {
  const w = col.width ?? col.minWidth ?? DEFAULT_MIN_WIDTH;
  return typeof w === "number" ? w : DEFAULT_MIN_WIDTH;
}

// Sticky-left columns first (in order), then normal, then sticky-right (in
// order). Returns a NEW array; relative order within each band is preserved.
export function orderColumns(columns) {
  const left = columns.filter((c) => c.sticky === "left");
  const normal = columns.filter((c) => c.sticky !== "left" && c.sticky !== "right");
  const right = columns.filter((c) => c.sticky === "right");
  return [...left, ...normal, ...right];
}

/**
 * Cumulative sticky offsets keyed by column id:
 *   { [id]: { side: "left"|"right", offset: px, edge: boolean } }
 * `edge` marks the column on the INNER boundary of its band (the one that casts
 * the divider shadow towards the scrolling area). `leadingWidth` is the width of
 * the pinned control column that sits left of every left-sticky data column.
 */
export function stickyOffsets(orderedColumns, { leadingWidth = 0 } = {}) {
  const map = {};

  // Left band: walk left→right, accumulating width after the leading column.
  const leftCols = orderedColumns.filter((c) => c.sticky === "left");
  let lx = leadingWidth;
  leftCols.forEach((c, i) => {
    map[c.id] = { side: "left", offset: lx, edge: i === leftCols.length - 1 };
    lx += columnPxWidth(c);
  });

  // Right band: walk right→left, accumulating from the table's right edge.
  const rightCols = orderedColumns.filter((c) => c.sticky === "right");
  let rx = 0;
  for (let i = rightCols.length - 1; i >= 0; i--) {
    const c = rightCols[i];
    map[c.id] = { side: "right", offset: rx, edge: i === 0 };
    rx += columnPxWidth(c);
  }

  return map;
}

// Every row key, including nested descendants — so "select all" covers children.
export function collectKeys(data, { rowKey, getSubRows }) {
  const keys = [];
  const walk = (rows) => {
    rows.forEach((row, i) => {
      keys.push(rowKey(row, i));
      const sub = getSubRows ? getSubRows(row) : null;
      if (sub && sub.length) walk(sub);
    });
  };
  walk(data);
  return keys;
}

// Keys for one branch (a row + all its descendants) — used by group/row select.
export function branchKeys(rows, { rowKey, getSubRows }) {
  return collectKeys(rows, { rowKey, getSubRows });
}

/**
 * Flatten `data` into the ordered list of VISUAL rows the body renders:
 *   { kind: "group", group, label, count, keys, collapsed, gi }
 *   { kind: "data",  row, key, depth, hasChildren, expanded, index }
 * Honours grouping (top level), nesting (recursive) and the collapse/expand sets.
 */
export function flattenRows(data, opts) {
  const { rowKey, getSubRows, expandedKeys, groupBy, groupLabel, collapsedGroups } = opts;
  const out = [];

  const pushData = (row, index, depth) => {
    const key = rowKey(row, index);
    const sub = getSubRows ? getSubRows(row) || [] : [];
    const hasChildren = sub.length > 0;
    const expanded = expandedKeys?.has(key);
    out.push({ kind: "data", row, key, depth, hasChildren, expanded, index });
    if (hasChildren && expanded) sub.forEach((child, ci) => pushData(child, ci, depth + 1));
  };

  if (groupBy) {
    // Preserve first-seen group order.
    const groups = new Map();
    data.forEach((row, i) => {
      const g = groupBy(row, i);
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(row);
    });
    let gi = 0;
    for (const [group, rowsInGroup] of groups) {
      const collapsed = collapsedGroups?.has(group) || false;
      out.push({
        kind: "group",
        group,
        label: groupLabel ? groupLabel(group, rowsInGroup) : String(group),
        count: rowsInGroup.length,
        keys: branchKeys(rowsInGroup, { rowKey, getSubRows }),
        collapsed,
        gi,
      });
      gi += 1;
      if (!collapsed) rowsInGroup.forEach((row, i) => pushData(row, i, 0));
    }
  } else {
    data.forEach((row, i) => pushData(row, i, 0));
  }

  return out;
}

/**
 * For every `column.spanRows` column, merge vertically-adjacent DATA rows that
 * share the same value into a single rowSpan'd cell. Returns:
 *   { spanMap: { "<visualIdx>:<colId>": rowSpan }, skip: Set("<visualIdx>:<colId>") }
 * Runs never cross group headers or expanded nesting (depth changes break a run),
 * so merged cells stay within a coherent block.
 */
export function computeRowSpans(visualRows, columns) {
  const spanMap = {};
  const skip = new Set();

  columns.forEach((col) => {
    if (!col.spanRows) return;
    const acc = col.spanAccessor || ((row) => row[col.id]);

    let runStart = -1;
    let runVal;
    let runDepth;
    const flush = (end) => {
      if (runStart >= 0 && end - runStart > 1) {
        spanMap[`${runStart}:${col.id}`] = end - runStart;
        for (let k = runStart + 1; k < end; k++) skip.add(`${k}:${col.id}`);
      }
      runStart = -1;
    };

    visualRows.forEach((vr, idx) => {
      if (vr.kind !== "data") { flush(idx); return; }
      const val = acc(vr.row);
      if (runStart < 0) { runStart = idx; runVal = val; runDepth = vr.depth; }
      else if (val !== runVal || vr.depth !== runDepth) { flush(idx); runStart = idx; runVal = val; runDepth = vr.depth; }
    });
    flush(visualRows.length);
  });

  return { spanMap, skip };
}
