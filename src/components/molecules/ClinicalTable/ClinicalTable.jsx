"use client";

/**
 * ClinicalTable — an EDITABLE table for RxPad modules (symptoms, vitals, …).
 *
 * Like DataTable, but every cell is editable inline: a free-text input or a
 * combobox dropdown (type a value or pick from `options`). Optional side columns
 * for drag-to-reorder and row delete, and an auto-appended empty row so there's
 * always a place to add the next entry. In-house, no external deps.
 *
 * Props:
 *   columns   [{ id, header, type?: "text" | "select", options?, placeholder?,
 *               width?, minWidth?, maxWidth?, align? }]   type default "text"
 *   rows / defaultRows  [{ id, [colId]: value }]          controlled / uncontrolled
 *   onChange  (rows) => void
 *   reorderable  boolean  drag handle + reorder            default true
 *   deletable    boolean  trailing delete button           default true
 *   autoRow      boolean  keep one empty row to type into  default true
 *   className
 */

import * as React from "react";
import { createPortal } from "react-dom";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { useIsClient } from "@/src/hooks/use-is-client";
import { cn } from "@/src/hooks/utils";
import styles from "./ClinicalTable.module.scss";

let _rowSeq = 0;
const makeEmptyRow = () => ({ id: `ct-${++_rowSeq}` });
const isBlankRow = (row, columns) => columns.every((c) => !String(row?.[c.id] ?? "").trim());

function DragDots() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {[5, 12, 19].flatMap((cy) => [
        <circle key={`l${cy}`} cx="9" cy={cy} r="1.4" />,
        <circle key={`r${cy}`} cx="15" cy={cy} r="1.4" />,
      ])}
    </svg>
  );
}

// Combobox cell: type freely or pick from `options` (portal popover, filtered).
function CellSelect({ value, options = [], placeholder, onChange, align }) {
  const wrapRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const mounted = useIsClient();

  const place = React.useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    place();
    const onDoc = (e) => { if (!wrapRef.current?.contains(e.target) && !e.target.closest?.(`.${styles.menu}`)) setOpen(false); };
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    document.addEventListener("mousedown", onDoc);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open, place]);

  const q = String(value ?? "").trim().toLowerCase();
  const filtered = q ? options.filter((o) => String(o).toLowerCase().includes(q)) : options;

  return (
    <div ref={wrapRef} className={styles.cellSelect}>
      <input
        className={styles.cellInput}
        data-align={align}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
      />
      <button type="button" className={styles.cellChevron} aria-label="Toggle options" tabIndex={-1} onClick={() => setOpen((o) => !o)}>
        <TPLibraryIcon name="arrow-down-02" size={14} />
      </button>
      {open && mounted && pos && filtered.length > 0 && createPortal(
        <div className={styles.menu} style={{ position: "fixed", top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 3000 }} role="listbox">
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={opt === value}
              className={styles.menuItem}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

export function ClinicalTable({
  columns = [],
  rows: rowsProp,
  defaultRows = [],
  onChange,
  reorderable = true,
  deletable = true,
  autoRow = true,
  className,
}) {
  const controlled = rowsProp !== undefined;
  const [internal, setInternal] = React.useState(defaultRows);
  const baseRows = controlled ? rowsProp : internal;
  const commit = (next) => { if (!controlled) setInternal(next); onChange?.(next); };

  // Stable draft row kept at the tail when autoRow is on.
  const [draft, setDraft] = React.useState(makeEmptyRow);
  const showDraft = autoRow && (!baseRows.length || !isBlankRow(baseRows[baseRows.length - 1], columns));
  const rendered = showDraft ? [...baseRows, draft] : baseRows;

  const [dragIndex, setDragIndex] = React.useState(null);

  const updateCell = (rowId, colId, val) => {
    if (rowId === draft.id) {
      const committedRow = { ...draft, [colId]: val };
      setDraft(makeEmptyRow());
      commit([...baseRows, committedRow]);
    } else {
      commit(baseRows.map((r) => (r.id === rowId ? { ...r, [colId]: val } : r)));
    }
  };
  const deleteRow = (rowId) => commit(baseRows.filter((r) => r.id !== rowId));
  const reorder = (to) => {
    if (dragIndex == null || dragIndex === to) return;
    const next = [...baseRows];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(to, 0, moved);
    setDragIndex(null);
    commit(next);
  };

  const colStyle = (c) => ({ width: c.width, minWidth: c.minWidth, maxWidth: c.maxWidth });

  return (
    <div className={cn(styles.wrap, className)}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {reorderable && <th className={cn(styles.th, styles.sideCol)} aria-hidden />}
            {columns.map((c) => (
              <th key={c.id} className={styles.th} style={colStyle(c)} data-align={c.align}>{c.header}</th>
            ))}
            {deletable && <th className={cn(styles.th, styles.sideCol)} aria-hidden />}
          </tr>
        </thead>
        <tbody>
          {rendered.map((row, i) => {
            const isDraft = row.id === draft.id;
            return (
              <tr
                key={row.id}
                className={styles.row}
                onDragOver={reorderable && !isDraft ? (e) => e.preventDefault() : undefined}
                onDrop={reorderable && !isDraft ? () => reorder(i) : undefined}
              >
                {reorderable && (
                  <td className={cn(styles.td, styles.sideCol)}>
                    {!isDraft && (
                      <button
                        type="button"
                        className={styles.dragHandle}
                        draggable
                        onDragStart={() => setDragIndex(i)}
                        onDragEnd={() => setDragIndex(null)}
                        aria-label="Drag to reorder row"
                      >
                        <DragDots />
                      </button>
                    )}
                  </td>
                )}

                {columns.map((c) => (
                  <td key={c.id} className={styles.td} style={colStyle(c)}>
                    {c.type === "select" ? (
                      <CellSelect
                        value={row[c.id]}
                        options={c.options}
                        placeholder={c.placeholder}
                        align={c.align}
                        onChange={(v) => updateCell(row.id, c.id, v)}
                      />
                    ) : (
                      <input
                        className={styles.cellInput}
                        data-align={c.align}
                        value={row[c.id] ?? ""}
                        placeholder={c.placeholder}
                        onChange={(e) => updateCell(row.id, c.id, e.target.value)}
                      />
                    )}
                  </td>
                ))}

                {deletable && (
                  <td className={cn(styles.td, styles.sideCol)}>
                    {!isDraft && (
                      <button type="button" className={styles.deleteBtn} aria-label="Delete row" onClick={() => deleteRow(row.id)}>
                        <TPLibraryIcon name="trash" size={18} />
                      </button>
                    )}
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
