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
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Dropdown } from "@/src/components/molecules/Dropdown";
import { Menu, MenuTrigger, MenuContent, MenuItem } from "@/src/components/molecules/Menu";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { toOptions, showsKeyHints, resolveStatus } from "./columns";
import styles from "./ClinicalTable.module.scss";

// ── EditableCell ──────────────────────────────────────────────────────────────
export function EditableCell({ column: c, value, row, locked, onChange, onCommit }) {
  const status = locked ? undefined : resolveStatus(c, value, row);
  const readOnly = c.editable === false;

  if (c.type === "multiselect") {
    return (
      <Dropdown
        variant="seamless"
        mode="multi"
        chips={c.chips !== false}
        chevron
        searchable={c.searchable}
        optionControl={c.optionControl || "none"}
        footerHint={c.footerHint ? "keys" : showsKeyHints(c) ? "keys" : false}
        options={toOptions(c.options)}
        value={Array.isArray(value) ? value : []}
        placeholder={locked ? "" : c.placeholder}
        status={status}
        leadingIcon={c.icon}
        disabled={locked || readOnly}
        onChange={onChange}
      />
    );
  }

  if (c.type === "combo") {
    return (
      <Dropdown
        variant="seamless"
        editable
        chevron={c.chevron !== false}
        allowCustom={c.allowCustom !== false}
        searchable={c.searchable}
        groupLabel={c.frequentlyUsedLabel}
        optionControl={c.optionControl || "none"}
        footerHint={c.footerHint ? "keys" : showsKeyHints(c) ? "keys" : false}
        options={toOptions(c.options)}
        value={value}
        placeholder={locked ? "" : c.placeholder}
        status={status}
        leadingIcon={c.icon}
        disabled={locked || readOnly}
        onChange={onChange}
        onCommit={onCommit}
      />
    );
  }

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
        optionControl={c.optionControl || "none"}
        footerHint={c.footerHint ? "keys" : showsKeyHints(c) ? "keys" : false}
        options={toOptions(c.options)}
        value={value}
        placeholder={locked ? "" : c.placeholder}
        status={status}
        leadingIcon={c.icon}
        disabled={locked || readOnly}
        onChange={onChange}
        onCommit={onCommit}
      />
    );
  }

  const inputType = c.type === "date" ? "date" : undefined;
  return (
    <InputBox
      variant="seamless"
      fullWidth
      type={inputType}
      allow={c.type === "number" ? "numeric" : c.allow ?? "any"}
      counter={c.counter}
      clearable={c.clearable}
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
export function DragHandle({ icon, iconVariant, iconFamily, onDragStart, onDragEnd }) {
  return (
    <button type="button" className={styles.dragHandle} draggable onDragStart={onDragStart} onDragEnd={onDragEnd} aria-label="Drag to reorder row">
      {icon ? <TPLibraryIcon name={icon} variant={iconVariant || undefined} family={iconFamily || undefined} size={18} /> : <DragDots />}
    </button>
  );
}

// ── Row "⋯" menu (portal of row actions) ──────────────────────────────────────
// Row "⋯" actions — composes the shared Menu primitive (accessible action menu).
function MoreMenu({ items, row, moreIcon, iconVariant, iconFamily }) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button
          variant="ghost"
          theme="neutral"
          size="sm"
          aria-label="More actions"
          icon={<TPLibraryIcon name={moreIcon || "3-dots-more"} variant={iconVariant || "bold"} family={iconFamily || undefined} corner="straight" size={16} />}
        />
      </MenuTrigger>
      <MenuContent align="end">
        {items.map((it, i) => (
          <MenuItem key={i} icon={it.icon} danger={it.danger} onSelect={() => it.onClick?.(row)}>
            {it.label}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}

// ── RowActions ────────────────────────────────────────────────────────────────
export function RowActions({ row, deletable, menuItems, onDelete, moreIcon, deleteIcon, iconVariant, iconFamily }) {
  return (
    <div className={styles.actionCell}>
      {menuItems.length > 0 && <MoreMenu items={menuItems} row={row} moreIcon={moreIcon} iconVariant={iconVariant} iconFamily={iconFamily} />}
      {deletable && (
        <Button
          variant="ghost"
          theme="neutral"
          size="sm"
          aria-label="Delete row"
          icon={<TPLibraryIcon name={deleteIcon || "trash"} variant={iconVariant || undefined} family={iconFamily || undefined} size={16} />}
          onClick={() => onDelete(row.id)}
        />
      )}
    </div>
  );
}
