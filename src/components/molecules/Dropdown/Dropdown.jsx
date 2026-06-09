"use client";

/**
 * Dropdown — the single, extensive select/menu molecule.
 *
 * One component covers every selection surface:
 *   • single-select        mode="single"
 *   • multi-select         mode="multi"   (selected shown as a count or chips)
 *   • option control       optionControl="none" | "checkbox" | "radio"
 *   • chips in the trigger  chips           (multi — removable Chip atoms)
 *   • search box           searchable      (filters options live)
 *   • editable combobox     editable        (the trigger IS a typeahead input —
 *                            type to filter; with allowCustom, add free values)
 *   • keyboard-shortcut hint showShortcuts (option.shortcut shown as a kbd)
 *   • per-item left/right icon, and a two-line title + subtitle
 *   • adjustable width      width="trigger" | "auto" | number(px)
 *   • always-visible scroll indicator, adaptive viewport-aware positioning,
 *     and full keyboard nav (↑ ↓ Home End Enter Esc).
 *
 * Embedding (table cell, etc.):
 *   • variant="seamless"   borderless trigger that fills its container and shows
 *                           an inset focus/status ring (reuse inside ClinicalTable)
 *   • chevron={false}      hide the trigger chevron (a plain search, no dropdown
 *                           affordance — e.g. the primary "name" column)
 *   • status               "success" | "error" | "warning" — per-cell ring colour
 *   • groupLabel           a sticky header above the list (e.g. "Frequently used")
 *   • allowCustom + addLabel  editable: offer "Add ‹query›" when nothing matches
 *
 * Props:
 *   options   FLAT  [{ value, label, subtitle?, icon?, iconRight?, shortcut?, disabled? }]
 *             or GROUPED sections, each with its own heading:
 *                   [{ heading, options: [{ value, label, … }] }]
 *             (single-header convenience: pass flat options + `groupLabel`)
 *   value     string (single) | string[] (multi)
 *   onChange  (next) => void
 *   mode      "single" | "multi"                     default "single"
 *   optionControl "none" | "checkbox" | "radio"      row indicator; default "none"
 *   chips     boolean — multi: render selected as removable chips in the trigger
 *   searchable boolean — search box inside the popover
 *   editable  boolean — the trigger is a typeahead input (combobox)
 *   allowCustom boolean — editable: allow free-text values not in the list
 *   addLabel  (query) => ReactNode — editable: custom-add row label (default "Add ‹q›")
 *   chevron   boolean — show the trigger chevron                default true
 *   variant   "default" | "seamless"                  default "default"
 *   status    "success" | "error" | "warning"         per-cell ring (seamless)
 *   groupLabel string — sticky header above the option list
 *   showShortcuts boolean — per-item shortcut hints (option.shortcut)
 *   footerHint boolean | "keys" — hint bar. true → "↑↓ navigate · ↵ select · esc
 *     close"; "keys" → per-key badges (↑ Up · ↓ Down · ↵ Enter · Esc Close)
 *   primaryAction / secondaryAction / tertiaryAction  — up to 3 footer CTAs, each
 *     composing the Button atom. Each accepts:
 *       { label, onClick, variant?, theme?, icon?, iconPosition?: "left"|"right",
 *         ariaLabel?, disabled? }
 *     Role defaults: primary → solid/primary, secondary → outline/neutral,
 *     tertiary → ghost/neutral. `icon` with no `label` renders an icon-only CTA
 *     (pass `ariaLabel`). Rendered tertiary · secondary · primary (primary last).
 *   actionsAlign "left" | "center" | "right" | "full"  default "right"
 *                  (full → CTAs share the footer width equally)
 *   width     "trigger" | "auto" | number            default "trigger"
 *   placeholder, label, disabled, className
 */

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Chip } from "@/src/components/atoms/Chip";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { Radio } from "@/src/components/atoms/Radio";
import { Button } from "@/src/components/atoms/Button";
import { useIsClient } from "@/src/hooks/use-is-client";
import styles from "./Dropdown.module.scss";

function Chevron(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function CheckIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// Per-role variant/theme defaults; each can be overridden by the action config.
const CTA_DEFAULTS = {
  primary:   { variant: "solid",   theme: "primary" },
  secondary: { variant: "outline", theme: "neutral" },
  tertiary:  { variant: "ghost",   theme: "neutral" },
};

// One footer CTA → the Button atom. `icon` only → icon-only; `icon` + `label` →
// leading/trailing icon by `iconPosition`; otherwise plain text.
function FooterCta({ action, role }) {
  if (!action) return null;
  const d = CTA_DEFAULTS[role];
  const { label, onClick, icon, iconPosition = "left", variant, theme, ariaLabel, disabled } = action;
  const common = { size: "sm", variant: variant ?? d.variant, theme: theme ?? d.theme, onClick, disabled };
  if (icon && !label) return <Button {...common} aria-label={ariaLabel || "action"} icon={icon} />;
  if (icon) {
    return (
      <Button {...common} leftIcon={iconPosition === "left" ? icon : undefined} rightIcon={iconPosition === "right" ? icon : undefined}>
        {label}
      </Button>
    );
  }
  return <Button {...common}>{label}</Button>;
}

export function Dropdown({
  options = [],
  value,
  onChange,
  mode = "single",
  optionControl = "none",
  chips = false,
  searchable = false,
  editable = false,
  allowCustom = false,
  addLabel,
  chevron = true,
  variant = "default",
  status,
  groupLabel,
  showShortcuts = false,
  footerHint = false,
  leadingIcon,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  actionsAlign = "right",
  width = "trigger",
  placeholder = "Select…",
  label,
  disabled = false,
  className,
}) {
  const isMulti = mode === "multi";
  const selectedArr = isMulti ? (Array.isArray(value) ? value : []) : value != null ? [value] : [];

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
  const mounted = useIsClient();

  const id = useId();
  const isSelected = (val) => selectedArr.includes(val);

  // Active query: editable combobox filters by the trigger value; otherwise the
  // popover search box drives filtering (only when searchable).
  const editQ = editable ? String(value ?? "") : "";
  const activeQuery = editable ? editQ : query;

  // Options may be a FLAT list ([{value,label,…}]) or GROUPED sections, each with
  // its own heading: [{ heading, options: [{value,label}] }]. Sections render
  // their heading above their rows; keyboard nav flows across all sections.
  const grouped = options.length > 0 && options.every((o) => o && Array.isArray(o.options));
  const allOptions = useMemo(() => (grouped ? options.flatMap((g) => g.options ?? []) : options), [options, grouped]);
  const labelOf = (val) => allOptions.find((o) => o.value === val)?.label ?? val;

  // Editable + allowCustom: offer an "Add ‹query›" row when the typed value
  // matches no existing option. It leads the navigable list.
  const trimmedQ = activeQuery.trim();
  const exact = allOptions.some((o) => String(o.label).toLowerCase() === trimmedQ.toLowerCase());
  const showCustom = editable && allowCustom && trimmedQ !== "" && !exact;

  // Flattened render/nav list: custom-add row, then per non-empty section a
  // (non-navigable) heading row followed by its option rows.
  const listItems = useMemo(() => {
    const q = trimmedQ.toLowerCase();
    const doFilter = q !== "" && (searchable || editable);
    const matches = (o) => !doFilter || `${o.label} ${o.subtitle ?? ""}`.toLowerCase().includes(q);
    const sections = grouped
      ? options.map((g) => ({ heading: g.heading, options: (g.options ?? []).filter(matches) }))
      : [{ heading: groupLabel, options: options.filter(matches) }];
    const out = [];
    if (showCustom) out.push({ __custom: true, value: trimmedQ, label: trimmedQ });
    sections.forEach((s) => {
      if (s.options.length === 0) return;
      if (s.heading) out.push({ __heading: true, disabled: true, label: s.heading });
      s.options.forEach((o) => out.push(o));
    });
    return out;
  }, [options, grouped, groupLabel, trimmedQ, searchable, editable, showCustom]);

  const optionCount = listItems.filter((i) => !i.__heading && !i.__custom).length;

  function commit(item) {
    if (item.disabled) return;
    if (item.__custom) { onChange?.(item.value); setOpen(false); return; }
    if (isMulti) {
      const next = isSelected(item.value) ? selectedArr.filter((v) => v !== item.value) : [...selectedArr, item.value];
      onChange?.(next);
    } else {
      onChange?.(item.value);
      setOpen(false);
    }
  }
  function removeChip(val) {
    onChange?.(selectedArr.filter((v) => v !== val));
  }

  // ── Adaptive positioning + width ──
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const t = triggerRef.current;
      const m = menuRef.current;
      if (!t || !m) return;
      const tr = t.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight, pad = 8, gap = 6;
      const seamless = variant === "seamless";
      const cap = vw - 2 * pad;
      // Width. Seamless (table-cell) menus are NOT locked to the narrow cell —
      // they size to content with a floor of ~1.45× the cell (min 200px) so long
      // options stay readable; capped to the viewport.
      if (typeof width === "number") {
        m.style.width = `${Math.min(cap, width)}px`;
      } else if (width === "trigger" && !seamless) {
        m.style.width = `${tr.width}px`;
      } else {
        m.style.width = ""; // measure intrinsic content width
        const floor = seamless ? Math.max(tr.width * 1.45, 200) : tr.width;
        m.style.width = `${Math.min(cap, Math.max(m.offsetWidth, floor))}px`;
      }
      const mw = m.offsetWidth;
      const mh = m.offsetHeight;
      let left = tr.left;
      if (left + mw > vw - pad) left = vw - pad - mw;
      if (left < pad) left = pad;
      let top = tr.bottom + gap;
      if (top + mh > vh - pad && tr.top - gap - mh >= pad) top = tr.top - gap - mh;
      if (top < pad) top = pad;
      setMenuStyle({ position: "fixed", top, left, zIndex: 9999 });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, width, variant, listItems.length, chips]);

  // ── Close on outside click ──
  useEffect(() => {
    function handler(e) {
      if (!rootRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Focus the popover search field when opened (non-editable searchable) ──
  useEffect(() => {
    if (open && searchable && !editable) {
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, searchable, editable]);

  function openMenu() {
    if (!editable) setQuery("");
    setActiveIdx(-1);
    setMenuStyle({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
    setOpen(true);
  }

  function onKeyDown(e) {
    if (disabled) return;
    if (!open && (e.key === "ArrowDown" || (!editable && (e.key === "Enter" || e.key === " ")))) {
      e.preventDefault();
      openMenu();
      return;
    }
    if (!open) return;
    const enabled = listItems.filter((o) => !o.disabled);
    if (e.key === "Escape") { setOpen(false); (editable ? inputRef.current : triggerRef.current)?.focus(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => nextEnabled(listItems, i, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => nextEnabled(listItems, i, -1)); }
    else if (e.key === "Home") { e.preventDefault(); setActiveIdx(nextEnabled(listItems, -1, 1)); }
    else if (e.key === "End") { e.preventDefault(); setActiveIdx(nextEnabled(listItems, listItems.length, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const opt = listItems[activeIdx] ?? (showCustom ? listItems[0] : enabled.length === 1 ? enabled[0] : null);
      if (opt) commit(opt);
    }
  }

  // ── Trigger content (non-editable) ──
  const triggerContent = (() => {
    if (chips && isMulti && selectedArr.length) {
      return (
        <span className={styles.triggerChips}>
          {selectedArr.map((v) => (
            <Chip
              key={v}
              size="sm"
              color="primary"
              label={labelOf(v)}
              onDelete={!disabled ? () => removeChip(v) : undefined}
              className={styles.triggerChip}
            />
          ))}
        </span>
      );
    }
    if (isMulti && selectedArr.length) {
      return <span className={styles.triggerText}>{selectedArr.length === 1 ? labelOf(selectedArr[0]) : `${selectedArr.length} selected`}</span>;
    }
    if (!isMulti && value != null && value !== "") {
      return <span className={styles.triggerText}>{labelOf(value)}</span>;
    }
    return <span className={styles.placeholder}>{placeholder}</span>;
  })();

  function renderOptionRow(item, i) {
    if (item.__heading) {
      return <div key={`__h${i}`} className={styles.groupLabel} role="presentation">{item.label}</div>;
    }
    if (item.__custom) {
      return (
        <div
          key="__custom__"
          role="option"
          aria-selected={false}
          className={`${styles.option} ${styles.optionCustom}`}
          data-active={i === activeIdx ? "true" : undefined}
          onMouseEnter={() => setActiveIdx(i)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => commit(item)}
        >
          <span className={styles.optAddIcon} aria-hidden><PlusIcon /></span>
          <span className={styles.optText}>
            <span className={styles.optTitle}>{addLabel ? addLabel(item.value) : <>Add “<strong>{item.value}</strong>”</>}</span>
          </span>
        </div>
      );
    }
    const sel = isSelected(item.value);
    return (
      <div
        key={item.value}
        role="option"
        aria-selected={sel}
        aria-disabled={item.disabled || undefined}
        className={styles.option}
        data-active={i === activeIdx ? "true" : undefined}
        data-selected={sel ? "true" : undefined}
        data-disabled={item.disabled ? "true" : undefined}
        onMouseEnter={() => setActiveIdx(i)}
        onMouseDown={editable ? (e) => e.preventDefault() : undefined}
        onClick={() => commit(item)}
      >
        {optionControl === "checkbox" && (
          // Reuse the Checkbox atom (shows a real tick). It's decorative
          // here — the row owns the click — so pointer-events are off.
          <span className={styles.control} aria-hidden>
            <Checkbox size="sm" checked={sel} tabIndex={-1} disabled={item.disabled} />
          </span>
        )}
        {optionControl === "radio" && (
          // Reuse the Radio atom (decorative — the row owns the click).
          <span className={styles.control} aria-hidden>
            <Radio checked={sel} size="sm" />
          </span>
        )}
        {item.icon && <span className={styles.optIcon}>{item.icon}</span>}
        <span className={styles.optText}>
          <span className={styles.optTitle}>{item.label}</span>
          {item.subtitle && <span className={styles.optSub}>{item.subtitle}</span>}
        </span>
        <span className={styles.optRight}>
          {showShortcuts && item.shortcut && <kbd className={styles.kbd}>{item.shortcut}</kbd>}
          {item.iconRight && <span className={styles.optIconR}>{item.iconRight}</span>}
          {optionControl === "none" && sel && <span className={styles.check}><CheckIcon /></span>}
        </span>
      </div>
    );
  }

  const menu = (
    <div ref={menuRef} className={styles.menu} style={menuStyle} role="listbox" aria-multiselectable={isMulti} id={`dd-${id}`}>
      {searchable && !editable && (
        <div className={styles.search}>
          <span className={styles.searchIcon}><SearchIcon /></span>
          <input
            ref={searchRef}
            className={styles.searchInput}
            value={query}
            placeholder="Search…"
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
            onKeyDown={onKeyDown}
          />
        </div>
      )}
      <div className={styles.list}>
        {optionCount === 0 && !showCustom && <div className={styles.empty}>No matches</div>}
        {listItems.map((item, i) => renderOptionRow(item, i))}
      </div>

      {(footerHint || primaryAction || secondaryAction || tertiaryAction) && (
        <div className={styles.footer}>
          {footerHint === "keys" ? (
            <div className={styles.hint} data-keys="true">
              <span><kbd className={styles.fkbd}>↑</kbd> Up</span>
              <span><kbd className={styles.fkbd}>↓</kbd> Down</span>
              <span><kbd className={styles.fkbd}>↵</kbd> Enter</span>
              <span><kbd className={styles.fkbd}>esc</kbd> Close</span>
            </div>
          ) : footerHint ? (
            <div className={styles.hint}>
              <span><kbd className={styles.fkbd}>↑</kbd><kbd className={styles.fkbd}>↓</kbd> navigate</span>
              <span><kbd className={styles.fkbd}>↵</kbd> select</span>
              <span><kbd className={styles.fkbd}>esc</kbd> close</span>
            </div>
          ) : null}
          {(primaryAction || secondaryAction || tertiaryAction) && (
            <div className={styles.actions} data-align={actionsAlign}>
              <FooterCta action={tertiaryAction} role="tertiary" />
              <FooterCta action={secondaryAction} role="secondary" />
              <FooterCta action={primaryAction} role="primary" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  const rootCls = [
    styles.root,
    variant === "seamless" && styles.seamless,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={rootRef}
      className={rootCls}
      data-variant={variant === "seamless" ? "seamless" : undefined}
      data-status={status || undefined}
      data-open={open ? "true" : undefined}
    >
      {label && <span className={styles.label}>{label}</span>}
      {editable ? (
        <div ref={triggerRef} className={styles.trigger} data-editable="true" data-open={open ? "true" : undefined}>
          {leadingIcon && <span className={styles.triggerLead}>{leadingIcon}</span>}
          <input
            ref={inputRef}
            className={styles.editInput}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            value={value ?? ""}
            placeholder={placeholder}
            onChange={(e) => { onChange?.(e.target.value); if (!open) setOpen(true); setActiveIdx(-1); }}
            onFocus={() => { if (!disabled) { setOpen(true); setActiveIdx(-1); } }}
            onKeyDown={onKeyDown}
          />
          {chevron && (
            <button
              type="button"
              className={styles.chevronBtn}
              data-open={open ? "true" : undefined}
              aria-label="Toggle options"
              tabIndex={-1}
              disabled={disabled}
              onMouseDown={(e) => { e.preventDefault(); if (!disabled) setOpen((o) => !o); }}
            >
              <Chevron />
            </button>
          )}
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          data-open={open ? "true" : undefined}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
        >
          {leadingIcon && <span className={styles.triggerLead}>{leadingIcon}</span>}
          {triggerContent}
          {chevron && <Chevron className={styles.chevron} data-open={open ? "true" : undefined} />}
        </button>
      )}
      {open && mounted && createPortal(menu, document.body)}
    </div>
  );
}

// Find the next enabled option index in a direction (wraps within bounds).
function nextEnabled(list, from, dir) {
  let i = from;
  for (let n = 0; n < list.length; n++) {
    i += dir;
    if (i < 0) i = list.length - 1;
    if (i >= list.length) i = 0;
    if (!list[i]?.disabled) return i;
  }
  return from;
}

Dropdown.displayName = "Dropdown";
export default Dropdown;
