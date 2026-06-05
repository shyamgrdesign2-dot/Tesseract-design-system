"use client";

/**
 * ClinicalTable — an EDITABLE table for RxPad modules (symptoms, vitals, …).
 *
 * Every cell is its OWN input box, composed from the design-system atoms:
 *   • free text / numeric  → the InputBox atom (variant="seamless")
 *   • dropdown (pick)      → the Dropdown molecule (variant="seamless", chevron)
 *   • search combobox      → the Dropdown molecule (editable, no chevron, a
 *                            "Frequently used" header + "Add ‹custom›")
 * Each cell shows a blue focus ring and per-cell status rings (success / error /
 * warning) via `column.validate`.
 *
 * Fixed skeleton (always present, in order):
 *   [drag-reorder] · NAME (primary search) · …configurable columns… · NOTES
 *   (free text) · ACTION (⋯ menu + delete)
 * The NAME and NOTES columns are mandatory; everything between them is fully
 * configurable from `columns`. NAME is the PRIMARY KEY — a row's other cells stay
 * locked until it is filled, and the next (draft) row only opens after it.
 *
 * Props:
 *   rows / defaultRows  [{ id, [colId]: value }]                 controlled / uncontrolled
 *   onChange  (rows) => void
 *   columns   the CONFIGURABLE middle columns (between Name and Notes). Each:
 *     { id, header, type?: "text"|"number"|"select"|"search",
 *       options?: string[]|{value,label,icon?}[], placeholder?, width?, minWidth?,
 *       maxWidth?, align?, allow?: "numeric"|"alpha"|"alphanumeric" (text),
 *       icon?: ReactNode, frequentlyUsedLabel?: string, allowCustom?: bool (search),
 *       searchable?: bool (select), editable?: bool (default true),
 *       validate?: (value, row) => "success"|"error"|"warning"|undefined }
 *   name      override config for the primary Name column (defaults provided)
 *   notes     override config for the Notes column (defaults provided)
 *   reorderable  boolean  drag handle + reorder                  default true
 *   deletable    boolean  delete button in the action column     default true
 *   rowMenu      Array<{ label, icon?, onClick?: (row) => void, danger?: bool }>
 *                  extra "⋯" row actions. `onClick` omitted → built-in
 *                  "Duplicate" duplicates the row.                default [Duplicate]
 *   autoRow      boolean  keep one empty draft row to type into  default true
 *   className
 */

import * as React from "react";
import { createPortal } from "react-dom";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Dropdown } from "@/src/components/molecules/Dropdown";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { useIsClient } from "@/src/hooks/use-is-client";
import { cn } from "@/src/hooks/utils";
import styles from "./ClinicalTable.module.scss";

let _rowSeq = 0;
const makeEmptyRow = () => ({ id: `ct-${++_rowSeq}` });
const toOptions = (opts) => (opts ?? []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));

// Adoptable min/max widths per cell type — keeps columns scalable without each
// one declaring widths. A column may still override with width/minWidth/maxWidth.
//   number  short values (doses, counts)           84–120
//   select  short picks (1-0-1, Mild, 2 days)     120–180
//   text    free notes                            140–260
//   search  long names (a primary key / medicine) 200–320
const TYPE_WIDTHS = {
  number: { minWidth: 84,  maxWidth: 120 },
  select: { minWidth: 120, maxWidth: 180 },
  text:   { minWidth: 140, maxWidth: 260 },
  search: { minWidth: 200, maxWidth: 320 },
};

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

// ── Row "⋯" menu — a small portal of row actions (reuses the Button atom for the
// trigger; renders its own lightweight popover). ──
function MoreMenu({ items, row }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [pos, setPos] = React.useState(null);
  const mounted = useIsClient();

  React.useEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    };
    place();
    const onDoc = (e) => { if (!anchorRef.current?.contains(e.target) && !e.target.closest?.(`.${styles.menu}`)) setOpen(false); };
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    document.addEventListener("mousedown", onDoc);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  return (
    <span ref={anchorRef} className={styles.moreAnchor}>
      <Button
        variant="ghost"
        theme="neutral"
        size="sm"
        aria-label="More actions"
        icon={<TPLibraryIcon name="more" size={16} />}
        onClick={() => setOpen((o) => !o)}
      />
      {open && mounted && pos && createPortal(
        <div className={styles.menu} style={{ position: "fixed", top: pos.top, right: pos.right, zIndex: 3000 }} role="menu">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              className={cn(styles.menuItem, it.danger && styles.menuItemDanger)}
              onClick={() => { setOpen(false); it.onClick?.(row); }}
            >
              {it.icon && <span className={styles.menuItemIcon}>{it.icon}</span>}
              {it.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </span>
  );
}

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
    id: "name",
    header: "Name",
    type: "search",
    placeholder: "Search & add",
    frequentlyUsedLabel: "Frequently used",
    allowCustom: true,
    minWidth: 220,
    maxWidth: 320,
    ...name,
  };
  const notesCol = {
    id: "notes",
    header: "Notes",
    type: "text",
    placeholder: "Notes",
    minWidth: 140,
    maxWidth: 240,
    ...notes,
  };
  const dataColumns = [nameCol, ...columns, notesCol];
  const primaryColId = nameCol.id;

  // The "⋯" menu items — default to a single "Duplicate" action.
  const menuItems = (rowMenu ?? [{ label: "Duplicate", icon: <TPLibraryIcon name="copy" size={15} /> }]).map((it) => ({
    ...it,
    onClick: it.onClick ?? (it.label === "Duplicate" ? (row) => duplicateRow(row) : undefined),
  }));
  const hasMenu = menuItems.length > 0;
  const hasAction = deletable || hasMenu;

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
  const duplicateRow = (row) => {
    const idx = baseRows.findIndex((r) => r.id === row.id);
    if (idx < 0) return;
    const clone = { ...row, id: `ct-${++_rowSeq}` };
    const next = [...baseRows];
    next.splice(idx + 1, 0, clone);
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

  const colStyle = (c) => {
    const d = TYPE_WIDTHS[c.type] ?? TYPE_WIDTHS.text;
    return { width: c.width, minWidth: c.minWidth ?? d.minWidth, maxWidth: c.maxWidth ?? d.maxWidth };
  };

  // ── One editable cell — picks the right atom for the column type. A plain
  // function (NOT a nested component) so the atoms keep a stable tree position
  // and don't remount / lose focus on each parent render. ──
  const renderCell = (c, row, locked) => {
    const status = c.validate ? c.validate(row[c.id], row) : undefined;
    const readOnly = c.editable === false;
    if (c.type === "select" || c.type === "search") {
      const isSearch = c.type === "search";
      return (
        <Dropdown
          variant="seamless"
          editable={isSearch}
          chevron={!isSearch}
          searchable={!isSearch && c.searchable}
          allowCustom={isSearch && c.allowCustom !== false}
          groupLabel={c.frequentlyUsedLabel}
          footerHint="keys"
          options={toOptions(c.options)}
          value={row[c.id]}
          placeholder={locked ? "" : c.placeholder}
          status={!locked ? status : undefined}
          leadingIcon={c.icon}
          disabled={locked || readOnly}
          onChange={(v) => updateCell(row.id, c.id, v)}
        />
      );
    }
    // text / number
    return (
      <InputBox
        variant="seamless"
        fullWidth
        allow={c.type === "number" ? "numeric" : c.allow ?? "any"}
        value={row[c.id] ?? ""}
        placeholder={locked ? "" : c.placeholder}
        status={!locked ? status ?? "default" : "default"}
        leftIcon={c.icon}
        disabled={locked}
        readOnly={readOnly}
        onChange={(e) => updateCell(row.id, c.id, e.target.value)}
      />
    );
  };

  return (
    <div ref={scrollerRef} className={cn(styles.wrap, className)} data-behind={behind || undefined}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headRow}>
            {reorderable && <th className={cn(styles.th, styles.sideCol)} aria-hidden />}
            {dataColumns.map((c) => (
              <th key={c.id} className={styles.th} style={colStyle(c)} data-align={c.align}>
                {c.header}
              </th>
            ))}
            {hasAction && (
              <th className={cn(styles.th, styles.actionCol, styles.sticky)} data-shadow="true" aria-hidden />
            )}
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

                {dataColumns.map((c) => {
                  // Non-primary cells are locked until the primary key is filled.
                  const locked = c.id !== primaryColId && !primaryFilled;
                  return (
                    <td key={c.id} className={styles.td} style={colStyle(c)}>
                      {renderCell(c, row, locked)}
                    </td>
                  );
                })}

                {hasAction && (
                  <td className={cn(styles.td, styles.actionCol, styles.sticky)} data-shadow="true">
                    {primaryFilled && (
                      <div className={styles.actionCell}>
                        {hasMenu && <MoreMenu items={menuItems} row={row} />}
                        {deletable && (
                          <Button
                            variant="ghost"
                            theme="neutral"
                            size="sm"
                            aria-label="Delete row"
                            icon={<TPLibraryIcon name="trash" size={16} />}
                            onClick={() => deleteRow(row.id)}
                          />
                        )}
                      </div>
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
