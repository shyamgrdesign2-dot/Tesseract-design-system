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
 *     { id, header, type?: "text"|"number"|"date"|"select"|"search",
 *       options?: string[]|{value,label,icon?}[], placeholder?, width?, minWidth?,
 *       maxWidth?, expand?: bool (drop the max — absorb leftover width, e.g. Notes),
 *       align?, allow?: "numeric"|"alpha"|"alphanumeric" (text),
 *       icon?: ReactNode, frequentlyUsedLabel?: string, allowCustom?: bool (search),
 *       flagCustom?: true|"warning"|"error" (search — ring custom entries),
 *       searchable?: bool (select), editable?: bool (default true),
 *       validate?: (value, row) => "success"|"error"|"warning"|undefined }
 *   name      override config for the primary Name column (defaults provided)
 *   notes     override config for the Notes column (defaults provided)
 *   reorderable  boolean  drag handle + reorder                  default true
 *   deletable    boolean  delete button in the action column     default true
 *   showRowMenu  boolean  the "⋯" row-actions menu (independent of delete) default true
 *   rowMenu      Array<{ label, icon?, onClick?: (row) => void, danger?: bool }>
 *                  extra "⋯" row actions. `onClick` omitted on "Duplicate" →
 *                  built-in duplicate.                            default [Duplicate]
 *   autoRow      boolean  keep one empty draft row to type into  default true
 *   className
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
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

export function ClinicalTable({
  columns = [],
  name,
  notes,
  rows: rowsProp,
  defaultRows = [],
  onChange,
  reorderable = true,
  deletable = true,
  showRowMenu = true,
  rowMenu,
  autoRow = true,
  className,
}) {
  const controlled = rowsProp !== undefined;
  const [internal, setInternal] = React.useState(defaultRows);
  const baseRows = controlled ? rowsProp : internal;
  const commit = (next) => { if (!controlled) setInternal(next); onChange?.(next); };

  // ── Fixed skeleton: NAME (primary search) · …middle… · NOTES (free text) ──
  const nameCol = {
    id: "name", header: "Name", type: "search", placeholder: "Search & add",
    frequentlyUsedLabel: "Frequently used", allowCustom: true, minWidth: 220, maxWidth: 320,
    ...name,
  };
  const notesCol = {
    id: "notes", header: "Notes", type: "text", placeholder: "Notes", minWidth: 160, expand: true,
    ...notes,
  };
  const dataColumns = [nameCol, ...columns, notesCol];
  const primaryColId = nameCol.id;

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
  const updateCell = (rowId, colId, val) => {
    if (rowId === draft.id) {
      // Only the primary cell is editable on the empty draft; filling it commits
      // the row (same id → input keeps focus) and spawns a fresh draft below.
      if (colId === primaryColId && String(val).trim()) {
        const committedRow = { ...draft, [colId]: val };
        setDraft(makeEmptyRow());
        commit([...baseRows, committedRow]);
      } else {
        setDraft({ ...draft, [colId]: val });
      }
    } else {
      commit(baseRows.map((r) => (r.id === rowId ? { ...r, [colId]: val } : r)));
    }
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
  const menuItems = !showRowMenu
    ? []
    : (rowMenu ?? [{ label: "Duplicate", icon: <TPLibraryIcon name="copy" size={15} /> }]).map((it) => ({
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

  return (
    <div ref={scrollerRef} className={cn(styles.wrap, className)} data-behind={behind || undefined}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {reorderable && <th className={cn(styles.th, styles.sideCol)} aria-hidden />}
            {dataColumns.map((c) => (
              <th key={c.id} className={styles.th} style={columnWidthStyle(c)} data-align={c.align}>
                {c.header}
              </th>
            ))}
            {hasAction && <th className={cn(styles.th, styles.actionCol, styles.sticky)} data-shadow="true" aria-hidden />}
          </tr>
        </thead>
        <tbody>
          {rendered.map((row, i) => {
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
                    {!isDraft && <DragHandle onDragStart={(e) => startDrag(e, row.id)} onDragEnd={endDrag} />}
                  </td>
                )}

                {dataColumns.map((c) => {
                  // Non-primary cells are locked until the primary key is filled.
                  const locked = c.id !== primaryColId && !primaryFilled;
                  return (
                    <td key={c.id} className={styles.td} style={columnWidthStyle(c)}>
                      <EditableCell column={c} value={row[c.id]} row={row} locked={locked} onChange={(v) => updateCell(row.id, c.id, v)} />
                    </td>
                  );
                })}

                {hasAction && (
                  <td className={cn(styles.td, styles.actionCol, styles.sticky)} data-shadow="true">
                    {primaryFilled && <RowActions row={row} deletable={deletable} menuItems={menuItems} onDelete={deleteRow} />}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ClinicalTable.displayName = "ClinicalTable";
export default ClinicalTable;
