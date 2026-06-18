"use client";

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { Button } from "@/src/components/atoms/Button/Button";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { ClinicalTable } from "@/src/components/molecules/ClinicalTable/ClinicalTable";
import { Tooltip } from "@/src/components/molecules/Tooltip/Tooltip";
import styles from "./RxPadSection.module.scss";

let _seq = 0;
const newRow = (name) => ({ id: `rx-${++_seq}`, name });

function parseIconProp(val, defaultName, defaultVariant = "linear") {
  if (!val) return { name: defaultName, variant: defaultVariant };
  const s = String(val);
  if (s.includes("/")) {
    const slashIdx = s.indexOf("/");
    return { name: s.slice(slashIdx + 1), variant: s.slice(0, slashIdx) };
  }
  return { name: s, variant: defaultVariant };
}

function ActionButton({ iconProp, defaultIcon, defaultVariant = "linear", tip, onClick, disabled, size = 18, color }) {
  const { name, variant } = parseIconProp(iconProp, defaultIcon, defaultVariant);
  return (
    <Tooltip content={tip} side="bottom">
      <Button
        variant="tonal"
        theme="neutral"
        size="sm"
        aria-label={tip}
        disabled={disabled}
        onClick={onClick}
        icon={<TPLibraryIcon name={name} variant={variant} size={size} color={color} />}
      />
    </Tooltip>
  );
}

export function RxPadSection({
  title = "Symptoms",
  icon = "virus",
  iconColor = "var(--tp-violet-500)",
  mode = "table-first",
  bodyType = "table",
  columns = [],
  name,
  notes,
  fields = [],
  search = true,
  searchPlaceholder,
  frequentlyUsed = [],
  showRepeat = true,
  showTemplate = true,
  showSave = true,
  showClear = true,
  onRepeat,
  onTemplate,
  onSave,
  onClear,
  repeatIcon = "refresh-arrow",
  templateIcon = "grid-5",
  saveIcon = "ram",
  clearIcon = "eraser",
  searchIcon = "search-normal-1",
  dragIcon = "menu",
  moreIcon = "3-dots-more",
  deleteIcon = "trash",
  duplicateIcon = "copy",
  rows: rowsProp,
  defaultRows = [],
  onRowsChange,
  className,
  style,
}) {
  const controlled = rowsProp !== undefined;
  const [internal, setInternal] = React.useState(defaultRows);
  const rows = controlled ? rowsProp : internal;
  const setRows = (next) => { if (!controlled) setInternal(next); onRowsChange?.(next); };

  const [text, setText] = React.useState("");
  const [fieldVals, setFieldVals] = React.useState({});
  const [query, setQuery] = React.useState("");

  const hasData =
    bodyType === "table" ? rows.length > 0
      : bodyType === "text" ? text.trim().length > 0
        : Object.values(fieldVals).some((v) => (v || "").trim());

  const availableChips = frequentlyUsed.filter(
    (s) => !rows.some((r) => String(r.name || "").toLowerCase() === s.toLowerCase()),
  );

  const addRow = (label) => {
    const v = (label || "").trim();
    if (!v) return;
    setRows([...rows, newRow(v)]);
    setQuery("");
  };

  const clearAll = () => {
    setRows([]); setText(""); setFieldVals({});
    onClear?.();
  };

  const showTable = bodyType === "table" && (mode === "table-first" || rows.length > 0);

  const headerIcon = parseIconProp(icon, "virus", "bulk");
  const searchParsed = parseIconProp(searchIcon, "search-normal-1");

  return (
    <section className={[styles.card, className].filter(Boolean).join(" ")} style={style}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.iconChip} style={{ color: iconColor }}>
            <TPLibraryIcon name={headerIcon.name} variant={headerIcon.variant} size={24} color={iconColor} />
          </span>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.actions}>
          {showRepeat && <ActionButton iconProp={repeatIcon} defaultIcon="refresh-arrow" tip="Repeat previous Rx" onClick={onRepeat} />}
          {showTemplate && <ActionButton iconProp={templateIcon} defaultIcon="grid-5" tip="Browse templates" onClick={onTemplate} />}
          {showSave && <ActionButton iconProp={saveIcon} defaultIcon="ram" tip="Save as template" onClick={onSave} disabled={!hasData} />}
          {showClear && <ActionButton iconProp={clearIcon} defaultIcon="eraser" tip="Clear all entries" onClick={clearAll} disabled={!hasData} />}
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>
        {showTable && (
          <ClinicalTable
            columns={columns} name={name} notes={notes} rows={rows} onChange={setRows}
            autoRow={mode === "table-first"}
            dragIcon={dragIcon} moreIcon={moreIcon} deleteIcon={deleteIcon} duplicateIcon={duplicateIcon}
          />
        )}

        {bodyType === "text" && (
          <InputBox fullWidth autoGrow maxHeight={160} value={text} onChange={(e) => setText(e.target?.value ?? e)}
            placeholder={searchPlaceholder || "Add clinical notes…"} />
        )}

        {bodyType === "fields" && (
          <div className={styles.fields}>
            {fields.map((f) => (
              <InputBox key={f.id} fullWidth label={f.label} type={f.type} placeholder={f.placeholder}
                leftIcon={f.icon} value={fieldVals[f.id] || ""}
                onChange={(e) => setFieldVals((s) => ({ ...s, [f.id]: e.target?.value ?? e }))} />
            ))}
          </div>
        )}

        {search && bodyType === "table" && mode !== "table-first" && (
          <InputBox
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target?.value ?? e)}
            onKeyDown={(e) => { if (e.key === "Enter") addRow(query); }}
            leftIcon={<TPLibraryIcon name={searchParsed.name} variant={searchParsed.variant} size={18} />}
            placeholder={searchPlaceholder || `Search & add ${title}`}
          />
        )}

        {availableChips.length > 0 && (
          <div className={styles.chips}>
            {availableChips.map((s) => (
              <Button key={s} variant="tonal" theme="neutral" size="sm" onClick={() => addRow(s)}>{s}</Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

RxPadSection.displayName = "RxPadSection";
export default RxPadSection;
