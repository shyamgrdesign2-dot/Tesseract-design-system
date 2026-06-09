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
 *     { id, header, type?: "text"|"number"|"select"|"search",
 *       options?: string[]|{value,label,icon?}[], placeholder?, width?, minWidth?,
 *       maxWidth?, align?, allow?: "numeric"|"alpha"|"alphanumeric" (text),
 *       icon?: ReactNode, frequentlyUsedLabel?: string, allowCustom?: bool (search),
 *       flagCustom?: true|"warning"|"error" (search — ring custom entries),
 *       searchable?: bool (select), editable?: bool (default true),
 *       validate?: (value, row) => "success"|"error"|"warning"|undefined }
 *   name      override config for the primary Name column (defaults provided)
 *   notes     override config for the Notes column (defaults provided)
 *   reorderable  boolean  drag handle + reorder                  default true
 *   deletable    boolean  delete button in the action column     default true
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

export function ClinicalTable({
  columns = [],
  name,
  notes,
  rows: rowsProp,
  defaultRows = [],
  onChange,
  reorderable = true,
  deletable = true,
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
    id: "notes", header: "Notes", type: "text", placeholder: "Notes", minWidth: 140, maxWidth: 240,
    ...notes,
  };
  const dataColumns = [nameCol, ...columns, notesCol];
  const primaryColId = nameCol.id;

  const [draft, setDraft] = React.useState(makeEmptyRow);
  const rendered = autoRow ? [...baseRows, draft] : baseRows;
  const [dragIndex, setDragIndex] = React.useState(null);

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
  const deleteRow = (rowId) => commit(baseRows.filter((r) => r.id !== rowId));
  const duplicateRow = (row) => {
    const idx = baseRows.findIndex((r) => r.id === row.id);
    if (idx < 0) return;
    const next = [...baseRows];
    next.splice(idx + 1, 0, { ...row, id: `ct-${++_rowSeq}` });
    commit(next);
  };
  const reorder = (to) => {
    if (dragIndex == null || dragIndex === to) return;
    const next = [...baseRows];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(to, 0, moved);
    setDragIndex(null);
    commit(next);
  };

  // ── Action column (⋯ menu + delete) ──
  const menuItems = (rowMenu ?? [{ label: "Duplicate", icon: <TPLibraryIcon name="copy" size={15} /> }]).map((it) => ({
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
                className={styles.row}
                onDragOver={reorderable && !isDraft ? (e) => e.preventDefault() : undefined}
                onDrop={reorderable && !isDraft ? () => reorder(i) : undefined}
              >
                {reorderable && (
                  <td className={cn(styles.td, styles.sideCol)}>
                    {!isDraft && <DragHandle onDragStart={() => setDragIndex(i)} onDragEnd={() => setDragIndex(null)} />}
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
