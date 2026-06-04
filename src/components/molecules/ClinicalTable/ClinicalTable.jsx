"use client";

/**
 * ClinicalTable — an EDITABLE table for RxPad modules (symptoms, vitals, …).
 *
 * Like DataTable, but every cell is its own input box: a free-text input, a
 * dropdown (pick), a search combobox (type / filter / custom-add), or an action
 * cell. Each cell shows a focus stroke (blue) and per-cell status strokes
 * (success / error / warning). Columns are fully UI-configurable; the data shape
 * stays backend-driven.
 *
 * Props:
 *   columns   [{ id, header, type?: "text"|"select"|"search"|"action",
 *               options?, placeholder?, width?, minWidth?, maxWidth?, align?,
 *               allowCustom?: bool (search), sticky?: "right" (usually action),
 *               render?: (row) => ReactNode (action), validate?: (value, row) =>
 *               "success"|"error"|"warning"|undefined }]            type default "text"
 *   rows / defaultRows  [{ id, [colId]: value }]                    controlled / uncontrolled
 *   onChange  (rows) => void
 *   reorderable  boolean  drag handle + reorder                     default true
 *   deletable    boolean  built-in trailing delete column          default true
 *   autoRow      boolean  keep one empty row to type into          default true
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

// ── Free-text cell — bordered input box (focus/status stroke via the wrapper) ──
function TextCell({ value, placeholder, align, status, disabled, onChange }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className={styles.cell} data-disabled={disabled || undefined} data-active={focused && !disabled ? "" : undefined} data-status={!focused ? status : undefined}>
      <input
        className={styles.cellInput}
        data-align={align}
        value={value ?? ""}
        placeholder={disabled ? "" : placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

// ── Dropdown / search combobox cell ──
// `search` allows free typing + custom-add; `select` is pick-from-list. Both:
// show frequently-used options on focus, filter on type, keyboard nav, and a
// chevron that flips up when open. Active (focused/open) shows the blue stroke.
function ComboCell({ value, options = [], placeholder, align, status, allowCustom, showChevron = true, disabled, onChange }) {
  const wrapRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const [pos, setPos] = React.useState(null);
  const mounted = useIsClient();

  const q = String(value ?? "").trim().toLowerCase();
  const filtered = q ? options.filter((o) => String(o).toLowerCase().includes(q)) : options;
  const exact = options.some((o) => String(o).toLowerCase() === q);
  const showCustom = allowCustom && q && !exact;
  const items = showCustom ? [{ custom: true, label: value }, ...filtered.map((o) => ({ label: o }))] : filtered.map((o) => ({ label: o }));

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

  const choose = (item) => { onChange(item.custom ? item.label : item.label); setOpen(false); };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) setOpen(true); setActiveIdx((i) => Math.min((i < 0 ? -1 : i) + 1, items.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { if (open && activeIdx >= 0 && items[activeIdx]) { e.preventDefault(); choose(items[activeIdx]); } }
    else if (e.key === "Escape") { setOpen(false); }
  };

  const active = (focused || open) && !disabled;
  return (
    <div ref={wrapRef} className={cn(styles.cell, styles.cellCombo, showChevron && styles.hasChevron)} data-disabled={disabled || undefined} data-active={active ? "" : undefined} data-status={!active ? status : undefined}>
      <input
        className={styles.cellInput}
        data-align={align}
        value={value ?? ""}
        placeholder={disabled ? "" : placeholder}
        readOnly={!allowCustom}
        disabled={disabled}
        onChange={(e) => { onChange(e.target.value); if (!open) setOpen(true); }}
        onFocus={() => { if (disabled) return; setFocused(true); setOpen(true); setActiveIdx(-1); }}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
      />
      {showChevron && (
        <button type="button" className={styles.cellChevron} data-open={open || undefined} aria-label="Toggle options" tabIndex={-1} disabled={disabled} onMouseDown={(e) => { e.preventDefault(); if (!disabled) setOpen((o) => !o); }}>
          <TPLibraryIcon name="arrow-down-02" size={14} />
        </button>
      )}
      {open && !disabled && mounted && pos && items.length > 0 && createPortal(
        <div className={styles.menu} style={{ position: "fixed", top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 3000 }} role="listbox">
          {items.map((item, idx) => (
            <button
              key={item.custom ? `__custom__${item.label}` : item.label}
              type="button"
              role="option"
              aria-selected={!item.custom && item.label === value}
              className={cn(styles.menuItem, item.custom && styles.menuItemCustom)}
              data-active={idx === activeIdx || undefined}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseDown={(e) => { e.preventDefault(); choose(item); }}
            >
              {item.custom ? <>Add &ldquo;<strong>{item.label}</strong>&rdquo;</> : item.label}
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

  // The first non-action column is the PRIMARY key: a row's other cells stay
  // locked until it's filled, and the next (draft) row only opens after it.
  const primaryColId = (columns.find((c) => c.type !== "action") ?? columns[0])?.id;

  const [draft, setDraft] = React.useState(makeEmptyRow);
  const rendered = autoRow ? [...baseRows, draft] : baseRows;

  const [dragIndex, setDragIndex] = React.useState(null);

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
  const reorder = (to) => {
    if (dragIndex == null || dragIndex === to) return;
    const next = [...baseRows];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(to, 0, moved);
    setDragIndex(null);
    commit(next);
  };

  // Horizontal-overflow detection → left fade/shadow on the sticky column.
  const scrollerRef = React.useRef(null);
  const [overflow, setOverflow] = React.useState(false);
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const update = () => setOverflow(el.scrollWidth > el.clientWidth + 1);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); ro?.disconnect(); window.removeEventListener("resize", update); };
  }, [columns.length]);

  const colStyle = (c) => ({ width: c.width, minWidth: c.minWidth, maxWidth: c.maxWidth });

  // Sticky-right action column sits left of the built-in delete column; the
  // leftmost sticky cell carries the overflow fade/shadow.
  const firstStickyColId = columns.find((c) => c.sticky === "right")?.id ?? null;
  const hasActionSticky = firstStickyColId != null;
  const actionRight = deletable ? 40 : 0;
  const stickyStyle = (c) => (c.sticky === "right" ? { ...colStyle(c), right: actionRight } : colStyle(c));

  return (
    <div ref={scrollerRef} className={cn(styles.wrap, className)} data-overflow={overflow || undefined}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {reorderable && <th className={cn(styles.th, styles.sideCol)} aria-hidden />}
            {columns.map((c) => (
              <th
                key={c.id}
                className={cn(styles.th, c.sticky === "right" && styles.sticky)}
                style={stickyStyle(c)}
                data-align={c.align}
                data-shadow={c.id === firstStickyColId ? "true" : undefined}
              >
                {c.type === "action" ? "" : c.header}
              </th>
            ))}
            {deletable && <th className={cn(styles.th, styles.sideCol, styles.stickyEnd)} data-shadow={!hasActionSticky ? "true" : undefined} aria-hidden />}
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
                    {!isDraft && (
                      <button type="button" className={styles.dragHandle} draggable onDragStart={() => setDragIndex(i)} onDragEnd={() => setDragIndex(null)} aria-label="Drag to reorder row">
                        <DragDots />
                      </button>
                    )}
                  </td>
                )}

                {columns.map((c) => {
                  const status = c.validate ? c.validate(row[c.id], row) : undefined;
                  // Non-primary cells are locked until the primary key is filled.
                  const locked = c.type !== "action" && c.id !== primaryColId && !primaryFilled;
                  return (
                    <td key={c.id} className={cn(styles.td, c.sticky === "right" && styles.sticky)} style={stickyStyle(c)} data-shadow={c.id === firstStickyColId ? "true" : undefined}>
                      {c.type === "action" ? (
                        <div className={styles.actionCell}>{primaryFilled && c.render ? c.render(row) : null}</div>
                      ) : c.type === "select" || c.type === "search" ? (
                        <ComboCell
                          value={row[c.id]}
                          options={c.options}
                          placeholder={c.placeholder}
                          align={c.align}
                          status={status}
                          allowCustom={c.type === "search" || c.allowCustom}
                          showChevron={c.type === "select"}
                          disabled={locked}
                          onChange={(v) => updateCell(row.id, c.id, v)}
                        />
                      ) : (
                        <TextCell
                          value={row[c.id]}
                          placeholder={c.placeholder}
                          align={c.align}
                          status={status}
                          disabled={locked}
                          onChange={(v) => updateCell(row.id, c.id, v)}
                        />
                      )}
                    </td>
                  );
                })}

                {deletable && (
                  <td className={cn(styles.td, styles.sideCol, styles.stickyEnd)} data-shadow={!hasActionSticky ? "true" : undefined}>
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
