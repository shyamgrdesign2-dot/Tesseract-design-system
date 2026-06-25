"use client";

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { Button } from "@/src/components/atoms/Button/Button";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { Skeleton } from "@/src/components/atoms/Skeleton/Skeleton";
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

function ActionButton({ iconProp, defaultIcon, defaultVariant = "linear", tip, onClick, disabled, size = 18, color, buttonProps }) {
  const { name, variant } = parseIconProp(iconProp, defaultIcon, defaultVariant);
  // Pass-through styling for the button atom. Defaults preserve the current look.
  const { variant: btnVariant = "tonal", theme = "neutral", size: btnSize = "sm", ...restButton } = buttonProps || {};
  // Icon-only button must always have an accessible name; fall back to the icon name.
  const accessibleName = tip || (name ? name.replace(/[-_]/g, " ") : "Action");
  const btn = (
    <Button
      variant={btnVariant}
      theme={theme}
      size={btnSize}
      aria-label={accessibleName}
      disabled={disabled}
      onClick={onClick}
      icon={<TPLibraryIcon name={name} variant={variant} size={size} color={color} />}
      {...restButton}
    />
  );
  return tip ? <Tooltip content={tip} side="bottom">{btn}</Tooltip> : btn;
}

export const RxPadSection = React.forwardRef(function RxPadSection({
  title = "Symptoms",
  subtitle,
  headerMeta,
  icon = "virus",
  iconColor = "var(--tesseract-violet-500)",
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
  headerActions,
  actionButtonProps,
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
  loading = false,
  emptyState,
  collapsible = false,
  defaultCollapsed = false,
  children,
  renderBody,
  className,
  style,
  ...rest
}, ref) {
  const controlled = rowsProp !== undefined;
  const [internal, setInternal] = React.useState(defaultRows);
  const rows = controlled ? rowsProp : internal;
  const setRows = (next) => { if (!controlled) setInternal(next); onRowsChange?.(next); };

  const [text, setText] = React.useState("");
  const [fieldVals, setFieldVals] = React.useState({});
  const [query, setQuery] = React.useState("");
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const bodyId = React.useId();

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

  // The default Repeat/Template/Save/Clear quartet — preserved as the default.
  const defaultActions = (
    <>
      {showRepeat && <ActionButton iconProp={repeatIcon} defaultIcon="refresh-arrow" tip="Repeat previous Rx" onClick={onRepeat} buttonProps={actionButtonProps} />}
      {showTemplate && <ActionButton iconProp={templateIcon} defaultIcon="grid-5" tip="Browse templates" onClick={onTemplate} buttonProps={actionButtonProps} />}
      {showSave && <ActionButton iconProp={saveIcon} defaultIcon="ram" tip="Save as template" onClick={onSave} disabled={!hasData} buttonProps={actionButtonProps} />}
      {showClear && <ActionButton iconProp={clearIcon} defaultIcon="eraser" tip="Clear all entries" onClick={clearAll} disabled={!hasData} buttonProps={actionButtonProps} />}
    </>
  );

  // headerActions: an array of custom actions, a ReactNode, or absent (→ default quartet).
  const customActions = Array.isArray(headerActions)
    ? headerActions.map((a, i) => (
        <ActionButton
          key={i}
          iconProp={a.icon}
          defaultIcon={a.icon}
          tip={a.tip}
          onClick={a.onClick}
          disabled={a.disabled}
          buttonProps={{ ...actionButtonProps, ...(a.variant ? { variant: a.variant } : null) }}
        />
      ))
    : headerActions;
  const headerActionsContent = headerActions != null ? customActions : defaultActions;

  const showBody = !(collapsible && collapsed);

  return (
    <section ref={ref} className={[styles.card, className].filter(Boolean).join(" ")} style={style} {...rest}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          {collapsible && (
            <button
              type="button"
              className={styles.collapseBtn}
              aria-expanded={!collapsed}
              aria-controls={bodyId}
              aria-label={collapsed ? "Expand section" : "Collapse section"}
              onClick={() => setCollapsed((c) => !c)}
            >
              <TPLibraryIcon name="chevron-down" variant="linear" size={18} className={collapsed ? styles.chevronCollapsed : undefined} />
            </button>
          )}
          <span className={styles.iconChip} style={{ color: iconColor }}>
            <TPLibraryIcon name={headerIcon.name} variant={headerIcon.variant} size={24} color={iconColor} />
          </span>
          <div className={styles.titleText}>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
        <div className={styles.actions}>
          {headerMeta && <div className={styles.headerMeta}>{headerMeta}</div>}
          {headerActionsContent}
        </div>
      </header>

      {/* ── Body ── */}
      {showBody && (
        <div id={bodyId} className={styles.body}>
          {/* Escape hatch — a fully custom body beyond table/text/fields. */}
          {(children ?? renderBody?.()) != null ? (
            children ?? renderBody()
          ) : loading ? (
            <div className={styles.loading} aria-busy="true" aria-live="polite">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} variant="rectangular" height={40} radius={8} />
              ))}
            </div>
          ) : !hasData && emptyState != null ? (
            <div className={styles.empty}>{emptyState}</div>
          ) : (
            <>
              {showTable && (
                <ClinicalTable
                  columns={columns} name={name} notes={notes} rows={rows} onChange={setRows}
                  autoRow={mode === "table-first"}
                  dragIcon={dragIcon} moreIcon={moreIcon} deleteIcon={deleteIcon} duplicateIcon={duplicateIcon}
                />
              )}

              {bodyType === "text" && (
                <InputBox fullWidth autoGrow maxHeight={160} value={text} onChange={(e) => setText(e.target?.value ?? e)}
                  aria-label={searchPlaceholder || `${title} notes`}
                  placeholder={searchPlaceholder || "Add clinical notes…"} />
              )}

              {bodyType === "fields" && (
                <div className={styles.fields}>
                  {fields.map((f) => (
                    <InputBox key={f.id} fullWidth label={f.label} type={f.type} placeholder={f.placeholder}
                      aria-label={f.label || f.placeholder || f.id}
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
                  aria-label={searchPlaceholder || `Search & add ${title}`}
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
            </>
          )}
        </div>
      )}
    </section>
  );
});

RxPadSection.displayName = "RxPadSection";
export default RxPadSection;
