"use client";

/**
 * ClinicalTable cells — the reusable, self-contained building blocks.
 *
 * Each editable cell is composed from a design-system atom and is a MODULE-LEVEL
 * component (never defined inside the table's render) so the atom keeps a stable
 * React identity and never remounts / loses focus while the parent re-renders.
 *
 *   EditableCell   dispatches by column.type → InputBox (text/number) or
 *                  Dropdown (select/search), wiring status rings, key hints,
 *                  locking and the per-type defaults.
 *   RowActions     the sticky action cluster: "⋯" menu (MoreMenu) + delete.
 *   DragHandle     the reorder grip.
 */

import * as React from "react";
import { createPortal } from "react-dom";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Dropdown } from "@/src/components/molecules/Dropdown";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { useIsClient } from "@/src/hooks/use-is-client";
import { cn } from "@/src/hooks/utils";
import { toOptions, showsKeyHints, resolveStatus } from "./columns";
import styles from "./ClinicalTable.module.scss";

// ── EditableCell ──────────────────────────────────────────────────────────────
export function EditableCell({ column: c, value, row, locked, onChange }) {
  const status = locked ? undefined : resolveStatus(c, value, row);
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
        footerHint={showsKeyHints(c) ? "keys" : false}
        options={toOptions(c.options)}
        value={value}
        placeholder={locked ? "" : c.placeholder}
        status={status}
        leadingIcon={c.icon}
        disabled={locked || readOnly}
        onChange={onChange}
      />
    );
  }

  // text / number
  return (
    <InputBox
      variant="seamless"
      fullWidth
      allow={c.type === "number" ? "numeric" : c.allow ?? "any"}
      value={value ?? ""}
      placeholder={locked ? "" : c.placeholder}
      status={status ?? "default"}
      leftIcon={c.icon}
      disabled={locked}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ── DragHandle ────────────────────────────────────────────────────────────────
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
export function DragHandle({ onDragStart, onDragEnd }) {
  return (
    <button type="button" className={styles.dragHandle} draggable onDragStart={onDragStart} onDragEnd={onDragEnd} aria-label="Drag to reorder row">
      <DragDots />
    </button>
  );
}

// ── Row "⋯" menu (portal of row actions) ──────────────────────────────────────
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

// ── RowActions ────────────────────────────────────────────────────────────────
export function RowActions({ row, deletable, menuItems, onDelete }) {
  return (
    <div className={styles.actionCell}>
      {menuItems.length > 0 && <MoreMenu items={menuItems} row={row} />}
      {deletable && (
        <Button
          variant="ghost"
          theme="neutral"
          size="sm"
          aria-label="Delete row"
          icon={<TPLibraryIcon name="trash" size={16} />}
          onClick={() => onDelete(row.id)}
        />
      )}
    </div>
  );
}
