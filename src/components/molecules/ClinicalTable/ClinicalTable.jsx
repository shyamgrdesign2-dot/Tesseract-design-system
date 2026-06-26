"use client";

/**
 * ClinicalTable — an EDITABLE table for RxPad modules (symptoms, vitals, …).
 *
 * Every cell is its OWN input box, composed from the design-system atoms (see
 * cells.jsx):
 *   • free text / numeric  → the InputBox atom (variant="seamless")
 *   • dropdown (pick)      → the Dropdown molecule (variant="seamless", chevron)
 *   • search combobox      → the Dropdown molecule (editable, no chevron, a
 *                            "Frequently used" header + "Add ‹custom›", key hints)
 * Cells show a blue focus ring and per-cell status rings (success / error /
 * warning) via `column.validate`, or — for a search column — an opt-in
 * `flagCustom` ring on values that aren't in the option list (custom entries).
 *
 * Fixed skeleton (always present, in order):
 *   [drag-reorder] · NAME (primary search) · …configurable columns… · NOTES
 *   (free text) · ACTION (⋯ menu + delete)
 * NAME and NOTES are mandatory; everything between them is configurable from
 * `columns`. NAME is the PRIMARY KEY — a row's other cells stay locked until it
 * is filled, and the next (draft) row only opens after it.
 *
 * Props:
 *   rows / defaultRows  [{ id, [colId]: value }]                 controlled / uncontrolled
 *   onChange  (rows) => void
 *   columns   the CONFIGURABLE middle columns (between Name and Notes). Each:
 *     { id, header, type?: "text"|"number"|"date"|"select"|"search"|"multiselect"|"combo",
 *       options?: string[]|{value,label,icon?}[], placeholder?, width?, minWidth?,
 *       maxWidth?, expand?: bool (drop the max — absorb leftover width, e.g. Notes),
 *       align?, allow?: "numeric"|"alpha"|"alphanumeric" (text),
 *       icon?: ReactNode, frequentlyUsedLabel?: string, allowCustom?: bool (search/combo),
 *       flagCustom?: true|"warning"|"error" (search — ring custom entries),
 *       searchable?: bool (select/multiselect/combo), editable?: bool (default true),
 *       chips?: bool (multiselect — show chips, default true),
 *       chevron?: bool (combo — show chevron, default true),
 *       validate?: (value, row) => "success"|"error"|"warning"|undefined }
 *   name      override config for the primary Name column (defaults provided)
 *   notes     override config for the Notes column (defaults provided). Pass
 *             `false` to drop the Notes column entirely.
 *   primaryKey  column id used as the PRIMARY KEY (the search column that gates
 *               a row + opens the next draft). Default: the Name column's id.
 *   reorderable  boolean  drag handle + reorder                  default true
 *   deletable    boolean  delete button in the action column     default true
 *   showRowMenu  boolean  the "⋯" row-actions menu (independent of delete) default true
 *   rowMenu      Array<{ label, icon?, onClick?: (row) => void, danger?: bool }>
 *                  extra "⋯" row actions. `onClick` omitted on "Duplicate" →
 *                  built-in duplicate.                            default [Duplicate]
 *   autoRow      boolean  keep one empty draft row to type into  default true
 *   density      "comfortable" (default) | "compact"  row/header height + padding
 *   loading      boolean  show skeleton rows (Skeleton atom) instead of data
 *   loadingRows  number   how many skeleton rows to render       default 4
 *   emptyState   ReactNode  shown when there are no rows AND no draft row
 *                  (autoRow off / loading off). Default: the draft row only.
 *   stickyHeader boolean  pin the header while the body scrolls vertically
 *   stickyFirst  boolean  pin the first (Name) column to the left edge
 *   stickyLast   boolean  pin the last data column to the right edge
 *                (edge-anchored, single column per edge; an explicit
 *                 column.sticky still wins)
 *   maxHeight    number|string  cap the table height → vertical scroll
 *
 *   Per-column `render(value, row) => ReactNode`  escape hatch: when present, the
 *   column renders this instead of the type-dispatched editable cell.
 *   className
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { cn } from "@/src/hooks/utils";
import { EditableCell, RowActions, DragHandle } from "./cells";
import { columnWidthStyle } from "./columns";
import styles from "./ClinicalTable.module.scss";

let _rowSeq = 0;
const makeEmptyRow = () => ({ id: `ct-${++_rowSeq}` });

// A 1×1 transparent image used as the drag ghost so the native preview doesn't
// trail the cursor outside the table during a reorder.
const BLANK_IMG = (() => {
  if (typeof document === "undefined") return null;
  const img = new Image(1, 1);
  img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  return img;
})();

export const ClinicalTable = React.forwardRef(function ClinicalTable({
  columns = [],
  name,
  notes,
  primaryKey,
  rows: rowsProp,
  defaultRows = [],
  onChange,
  reorderable = true,
  deletable = true,
  showRowMenu = true,
  rowMenu,
  autoRow = true,
  density = "comfortable",
  loading = false,
  loadingRows = 4,
  emptyState,
  stickyHeader = false,
  stickyFirst = false,
  stickyLast = false,
  maxHeight,
  dragIcon,
  moreIcon,
  deleteIcon,
  duplicateIcon,
  iconVariant,   // optional style override for the action glyphs (else each keeps its own default)
  iconFamily,    // optional CDN family override for the action glyphs
  className,
  style,
  ...rest
}, ref) {
  const controlled = rowsProp !== undefined;
  const [internal, setInternal] = React.useState(defaultRows);
  const baseRows = controlled ? rowsProp : internal;
  const commit = (next) => { if (!controlled) setInternal(next); onChange?.(next); };

  // ── Skeleton: NAME (primary search) · …middle… · NOTES (free text) ──
  // NAME and NOTES are defaults, not hard constraints: `notes={false}` drops the
  // trailing notes column, and `primaryKey` lets any column be the gating search
  // key — keeping the legacy NAME-first / NOTES-last layout when unset.
  const nameCol = {
    id: "name", header: "Name", type: "search", placeholder: "Search & add",
    frequentlyUsedLabel: "Frequently used", allowCustom: true, minWidth: 220, maxWidth: 320,
    ...name,
  };
  const notesCol = notes === false ? null : {
    id: "notes", header: "Notes", type: "text", placeholder: "Notes", minWidth: 160, expand: true,
    ...notes,
  };
  // Edge-sticky convenience: stickyFirst pins the first (Name) column to the left
  // edge, stickyLast pins the last data column to the right. Always edge-anchored;
  // an explicit column.sticky wins. (Single column per edge — ClinicalTable's
  // fluid min/max widths make accurate multi-column pixel offsets unreliable;
  // DataTable does 1–2 via header measurement.)
  const baseColumns = [nameCol, ...columns, ...(notesCol ? [notesCol] : [])];
  const rawDataColumns = (!stickyFirst && !stickyLast)
    ? baseColumns
    : baseColumns.map((c, i) => {
        if (c.sticky) return c;
        if (stickyFirst && i === 0) return { ...c, sticky: "left" };
        if (stickyLast && i === baseColumns.length - 1) return { ...c, sticky: "right" };
        return c;
      });
  const dataColumns = React.useMemo(() => {
    const normal = rawDataColumns.filter((c) => c.sticky !== "right");
    const sticky = rawDataColumns.filter((c) => c.sticky === "right");
    if (sticky.length <= 1) return [...normal, ...sticky];
    return [...normal, ...sticky.slice(0, -1).map((c) => ({ ...c, sticky: undefined })), sticky[sticky.length - 1]];
  }, [rawDataColumns]);
  // The primary key gates a row + opens the next draft. Default: the Name column;
  // override via `primaryKey` (falls back to Name's id if it doesn't match a col).
  const primaryColId =
    primaryKey && dataColumns.some((c) => c.id === primaryKey) ? primaryKey : nameCol.id;

  const [draft, setDraft] = React.useState(makeEmptyRow);
  const rendered = autoRow ? [...baseRows, draft] : baseRows;

  // Drag-reorder: track the row BEING dragged + the one that just landed (for the
  // settle animation). Rows reorder live as you drag over them — no native ghost.
  const [dragId, setDragId] = React.useState(null);
  const [movedId, setMovedId] = React.useState(null);
  const movedTimer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(movedTimer.current), []);

  // ── FLIP: rows physically glide to their new position on reorder/delete/dup.
  // Capture each row's top BEFORE the reorder commit; the layout effect reads the
  // new tops and plays the inverted delta back to zero. ──
  const rowEls = React.useRef(new Map());
  const flipFrom = React.useRef(null);
  const captureFlip = () => {
    const m = new Map();
    rowEls.current.forEach((el, id) => { if (el && el.isConnected) m.set(id, el.getBoundingClientRect().top); });
    flipFrom.current = m;
  };
  React.useLayoutEffect(() => {
    const prev = flipFrom.current;
    if (!prev) return;
    flipFrom.current = null;
    rowEls.current.forEach((el, id) => {
      const prevTop = prev.get(id);
      if (!el || prevTop == null) return;
      const delta = prevTop - el.getBoundingClientRect().top;
      if (Math.abs(delta) < 0.5) return;
      el.style.transition = "none";
      el.style.transform = `translateY(${delta}px)`;
      el.getBoundingClientRect(); // force reflow so the invert sticks
      requestAnimationFrame(() => {
        el.style.transition = "transform 220ms cubic-bezier(.2,.8,.2,1)";
        el.style.transform = "";
        const clear = () => { el.style.transition = ""; el.removeEventListener("transitionend", clear); };
        el.addEventListener("transitionend", clear);
      });
    });
  });

  // ── Mutations ──
  // Live value change. On the draft row this only updates the in-progress value
  // (so the dropdown can show "Add ‹typed›") — it does NOT commit or spawn a new
  // row. The draft is finalised only on a deliberate confirm (commitDraft).
  const updateCell = (rowId, colId, val) => {
    if (rowId === draft.id) {
      setDraft({ ...draft, [colId]: val });
    } else {
      commit(baseRows.map((r) => (r.id === rowId ? { ...r, [colId]: val } : r)));
    }
  };
  // Finalise the draft once its NAME is confirmed (option picked / custom added /
  // Enter). The committed row keeps the draft's id (so its input keeps focus) and
  // a fresh empty draft opens below — this is the only path that adds a row.
  const commitDraft = (val) => {
    const v = String(val ?? "").trim();
    if (!v) return;
    const committedRow = { ...draft, [primaryColId]: v };
    setDraft(makeEmptyRow());
    commit([...baseRows, committedRow]);
  };
  const deleteRow = (rowId) => { captureFlip(); commit(baseRows.filter((r) => r.id !== rowId)); };
  const duplicateRow = (row) => {
    const idx = baseRows.findIndex((r) => r.id === row.id);
    if (idx < 0) return;
    const next = [...baseRows];
    next.splice(idx + 1, 0, { ...row, id: `ct-${++_rowSeq}` });
    captureFlip();
    commit(next);
  };
  // Begin dragging a row from its handle. Suppress the native drag ghost (a 1×1
  // transparent image) so nothing trails the cursor outside the table — the
  // feedback is the lifted row + the live reorder beneath the pointer.
  const startDrag = (e, rowId) => {
    setDragId(rowId);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      if (BLANK_IMG) e.dataTransfer.setDragImage(BLANK_IMG, 0, 0);
    }
  };
  // Live reorder: as the dragged row passes over row `overIdx`, move it there.
  const dragOverRow = (e, overIdx) => {
    e.preventDefault();
    if (dragId == null || overIdx >= baseRows.length) return;
    const from = baseRows.findIndex((r) => r.id === dragId);
    if (from < 0 || from === overIdx) return;
    const next = [...baseRows];
    const [moved] = next.splice(from, 1);
    next.splice(overIdx, 0, moved);
    captureFlip();
    commit(next);
  };
  const endDrag = () => {
    if (dragId != null) {
      const landed = dragId;
      setMovedId(landed);
      clearTimeout(movedTimer.current);
      movedTimer.current = setTimeout(() => setMovedId(null), 650);
    }
    setDragId(null);
  };

  // ── Action column (⋯ menu + delete) ──
  const dupIconName = duplicateIcon || "copy";
  const menuItems = !showRowMenu
    ? []
    : (rowMenu ?? [{ label: "Duplicate", icon: <TPLibraryIcon name={dupIconName} variant={iconVariant || undefined} family={iconFamily || undefined} size={15} /> }]).map((it) => ({
        ...it,
        onClick: it.onClick ?? (it.label === "Duplicate" ? duplicateRow : undefined),
      }));
  const hasAction = deletable || menuItems.length > 0;

  // ── Horizontal-overflow → left fade ONLY while content is scrolled behind the
  // sticky action column (i.e. not scrolled fully right). ──
  const scrollerRef = React.useRef(null);
  const [behind, setBehind] = React.useState(false);
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const update = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      setBehind(maxScroll > 1 && el.scrollLeft < maxScroll - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); ro?.disconnect(); window.removeEventListener("resize", update); };
  }, [columns.length]);

  // Vertical scroll cap (long tables). When set, the wrapper scrolls vertically;
  // `stickyHeader` pins <thead> against that scroll.
  const wrapStyle = maxHeight != null
    ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight, overflowY: "auto" }
    : undefined;

  // Merge the forwarded ref with the internal scroller ref so the root DOM node is
  // exposed to callers without losing the table's own overflow tracking.
  const setRootRef = React.useCallback((node) => {
    scrollerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const colCount = dataColumns.length + (reorderable ? 1 : 0) + (hasAction ? 1 : 0);
  const showEmpty = !loading && emptyState != null && baseRows.length === 0 && (!autoRow || rendered.length === 0);

  return (
    <div
      ref={setRootRef}
      className={cn(styles.wrap, className)}
      data-behind={behind || undefined}
      data-density={density}
      data-sticky-header={stickyHeader || undefined}
      style={{ ...wrapStyle, ...style }}
      {...rest}
    >
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {reorderable && <th className={cn(styles.th, styles.sideCol)} aria-hidden />}
            {dataColumns.map((c) => (
              <th key={c.id} className={cn(styles.th, c.sticky === "right" && styles.sticky, c.sticky === "left" && styles.stickyLeft)} style={{ ...columnWidthStyle(c), ...(c.sticky === "right" && hasAction ? { right: 92 } : {}) }} data-align={c.align} data-shadow={(c.sticky === "right" || c.sticky === "left") || undefined}>
                {c.header}
              </th>
            ))}
            {hasAction && <th className={cn(styles.th, styles.actionCol, styles.sticky)} data-shadow="true" aria-hidden />}
          </tr>
        </thead>
        <tbody>
          {loading && Array.from({ length: Math.max(1, loadingRows) }).map((_, i) => (
            <tr key={`sk-${i}`} className={styles.row} aria-hidden>
              {reorderable && <td className={cn(styles.td, styles.sideCol)} />}
              {dataColumns.map((c) => (
                <td key={c.id} className={cn(styles.td, c.sticky === "right" && styles.sticky, c.sticky === "left" && styles.stickyLeft)} style={{ ...columnWidthStyle(c), ...(c.sticky === "right" && hasAction ? { right: 92 } : {}) }} data-shadow={(c.sticky === "right" || c.sticky === "left") || undefined}>
                  <div className={styles.skelCell}>
                    <Skeleton variant="text" height={12} width={c.id === primaryColId ? "70%" : "55%"} />
                  </div>
                </td>
              ))}
              {hasAction && <td className={cn(styles.td, styles.actionCol, styles.sticky)} data-shadow="true" />}
            </tr>
          ))}

          {showEmpty && (
            <tr className={styles.row}>
              <td className={cn(styles.td, styles.emptyCell)} colSpan={colCount}>{emptyState}</td>
            </tr>
          )}

          {!loading && !showEmpty && rendered.map((row, i) => {
            const isDraft = row.id === draft.id;
            const primaryFilled = Boolean(String(row[primaryColId] ?? "").trim());
            return (
              <tr
                key={row.id}
                ref={(el) => { if (el) rowEls.current.set(row.id, el); else rowEls.current.delete(row.id); }}
                className={styles.row}
                data-dragging={row.id === dragId || undefined}
                data-moved={row.id === movedId || undefined}
                onDragOver={reorderable && !isDraft ? (e) => dragOverRow(e, i) : undefined}
                onDrop={reorderable ? endDrag : undefined}
              >
                {reorderable && (
                  <td className={cn(styles.td, styles.sideCol)}>
                    {!isDraft && <DragHandle icon={dragIcon} iconVariant={iconVariant} iconFamily={iconFamily} onDragStart={(e) => startDrag(e, row.id)} onDragEnd={endDrag} />}
                  </td>
                )}

                {dataColumns.map((c) => {
                  const isPrimary = c.id === primaryColId;
                  // The draft only lets you edit the NAME; its other cells stay
                  // locked until the name is confirmed (and the row becomes real).
                  // Committed rows lock a non-primary cell only if the name is empty.
                  const locked = !isPrimary && (isDraft || !primaryFilled);
                  // Escape hatch: a column may supply `render(value, row)` to draw
                  // its own (typically read-only) cell, bypassing the type-dispatch.
                  // The draft row still falls through to the editable cell so a new
                  // row can be typed in regardless of custom renderers.
                  const useCustom = typeof c.render === "function" && !isDraft;
                  return (
                    <td key={c.id} className={cn(styles.td, c.sticky === "right" && styles.sticky, c.sticky === "left" && styles.stickyLeft)} style={{ ...columnWidthStyle(c), ...(c.sticky === "right" && hasAction ? { right: 92 } : {}) }} data-shadow={(c.sticky === "right" || c.sticky === "left") || undefined}>
                      {useCustom ? (
                        <div className={styles.customCell} data-align={c.align}>{c.render(row[c.id], row)}</div>
                      ) : (
                        <EditableCell
                          column={c}
                          value={row[c.id]}
                          row={row}
                          locked={locked}
                          onChange={(v) => updateCell(row.id, c.id, v)}
                          onCommit={isDraft && isPrimary ? commitDraft : undefined}
                        />
                      )}
                    </td>
                  );
                })}

                {hasAction && (
                  <td className={cn(styles.td, styles.actionCol, styles.sticky)} data-shadow="true">
                    {!isDraft && <RowActions row={row} deletable={deletable} menuItems={menuItems} onDelete={deleteRow} moreIcon={moreIcon} deleteIcon={deleteIcon} iconVariant={iconVariant} iconFamily={iconFamily} />}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

ClinicalTable.displayName = "ClinicalTable";
export default ClinicalTable;
