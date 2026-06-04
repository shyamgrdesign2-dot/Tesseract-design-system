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
 *   • keyboard-shortcut hint showShortcuts (option.shortcut shown as a kbd)
 *   • per-item left/right icon, and a two-line title + subtitle
 *   • adjustable width      width="trigger" | "auto" | number(px)
 *   • always-visible scroll indicator, adaptive viewport-aware positioning,
 *     and full keyboard nav (↑ ↓ Home End Enter Esc).
 *
 * Props:
 *   options   [{ value, label, subtitle?, icon?, iconRight?, shortcut?, disabled? }]
 *   value     string (single) | string[] (multi)
 *   onChange  (next) => void
 *   mode      "single" | "multi"                     default "single"
 *   optionControl "none" | "checkbox" | "radio"      row indicator; default "none"
 *   chips     boolean — multi: render selected as removable chips in the trigger
 *   searchable boolean
 *   showShortcuts boolean — per-item shortcut hints (option.shortcut)
 *   footerHint boolean — common "↑↓ navigate · ↵ select · esc close" bar
 *   primaryAction / secondaryAction  { label, onClick } — footer CTAs (Button atom)
 *   actionsAlign "right" | "full"                     default "right"
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

export function Dropdown({
  options = [],
  value,
  onChange,
  mode = "single",
  optionControl = "none",
  chips = false,
  searchable = false,
  showShortcuts = false,
  footerHint = false,
  primaryAction,
  secondaryAction,
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
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
  const mounted = useIsClient();

  const id = useId();
  const labelOf = (val) => options.find((o) => o.value === val)?.label ?? val;
  const isSelected = (val) => selectedArr.includes(val);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => `${o.label} ${o.subtitle ?? ""}`.toLowerCase().includes(q));
  }, [options, query, searchable]);

  function commit(opt) {
    if (opt.disabled) return;
    if (isMulti) {
      const next = isSelected(opt.value) ? selectedArr.filter((v) => v !== opt.value) : [...selectedArr, opt.value];
      onChange?.(next);
    } else {
      onChange?.(opt.value);
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
      let w;
      if (width === "trigger") w = tr.width;
      else if (typeof width === "number") w = width;
      else w = m.offsetWidth; // "auto"
      m.style.width = width === "auto" ? "" : `${w}px`;
      const mw = m.offsetWidth;
      const mh = m.offsetHeight;
      const vw = window.innerWidth, vh = window.innerHeight, pad = 8, gap = 6;
      let left = tr.left;
      if (left + mw > vw - pad) left = vw - pad - mw;
      if (left < pad) left = pad;
      let top = tr.bottom + gap;
      if (top + mh > vh - pad && tr.top - gap - mh >= pad) top = tr.top - gap - mh;
      if (top < pad) top = pad;
      setMenuStyle({ position: "fixed", top, left, zIndex: 9999, minWidth: width === "auto" ? tr.width : undefined });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, width, filtered.length, chips]);

  // ── Close on outside click ──
  useEffect(() => {
    function handler(e) {
      if (!rootRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Focus the search field when opened ──
  useEffect(() => {
    if (open && searchable) {
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, searchable]);

  function openMenu() {
    setQuery("");
    setActiveIdx(-1);
    setMenuStyle({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
    setOpen(true);
  }

  function onKeyDown(e) {
    if (disabled) return;
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openMenu();
      return;
    }
    if (!open) return;
    const enabled = filtered.filter((o) => !o.disabled);
    if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(filtered.length - 1, nextEnabled(filtered, i, 1))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(0, nextEnabled(filtered, i, -1))); }
    else if (e.key === "Home") { e.preventDefault(); setActiveIdx(nextEnabled(filtered, -1, 1)); }
    else if (e.key === "End") { e.preventDefault(); setActiveIdx(nextEnabled(filtered, filtered.length, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[activeIdx];
      if (opt) commit(opt);
      else if (enabled.length === 1) commit(enabled[0]);
    }
  }

  // ── Trigger content ──
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

  const menu = (
    <div ref={menuRef} className={styles.menu} style={menuStyle} role="listbox" aria-multiselectable={isMulti} id={`dd-${id}`}>
      {searchable && (
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
        {filtered.length === 0 && <div className={styles.empty}>No matches</div>}
        {filtered.map((opt, i) => {
          const sel = isSelected(opt.value);
          return (
            <div
              key={opt.value}
              role="option"
              aria-selected={sel}
              aria-disabled={opt.disabled || undefined}
              className={styles.option}
              data-active={i === activeIdx ? "true" : undefined}
              data-selected={sel ? "true" : undefined}
              data-disabled={opt.disabled ? "true" : undefined}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => commit(opt)}
            >
              {optionControl === "checkbox" && (
                // Reuse the Checkbox atom (shows a real tick). It's decorative
                // here — the row owns the click — so pointer-events are off.
                <span className={styles.control} aria-hidden>
                  <Checkbox size="sm" checked={sel} tabIndex={-1} disabled={opt.disabled} />
                </span>
              )}
              {optionControl === "radio" && (
                // Reuse the Radio atom (decorative — the row owns the click).
                <span className={styles.control} aria-hidden>
                  <Radio checked={sel} size="sm" />
                </span>
              )}
              {opt.icon && <span className={styles.optIcon}>{opt.icon}</span>}
              <span className={styles.optText}>
                <span className={styles.optTitle}>{opt.label}</span>
                {opt.subtitle && <span className={styles.optSub}>{opt.subtitle}</span>}
              </span>
              <span className={styles.optRight}>
                {showShortcuts && opt.shortcut && <kbd className={styles.kbd}>{opt.shortcut}</kbd>}
                {opt.iconRight && <span className={styles.optIconR}>{opt.iconRight}</span>}
                {optionControl === "none" && sel && <span className={styles.check}><CheckIcon /></span>}
              </span>
            </div>
          );
        })}
      </div>

      {(footerHint || primaryAction || secondaryAction) && (
        <div className={styles.footer}>
          {footerHint && (
            <div className={styles.hint}>
              <span><kbd className={styles.fkbd}>↑</kbd><kbd className={styles.fkbd}>↓</kbd> navigate</span>
              <span><kbd className={styles.fkbd}>↵</kbd> select</span>
              <span><kbd className={styles.fkbd}>esc</kbd> close</span>
            </div>
          )}
          {(primaryAction || secondaryAction) && (
            <div className={styles.actions} data-align={actionsAlign}>
              {secondaryAction && (
                <Button variant="outline" theme="neutral" size="sm" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button variant="solid" theme="primary" size="sm" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(" ")}>
      {label && <span className={styles.label}>{label}</span>}
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
        {triggerContent}
        <Chevron className={styles.chevron} data-open={open ? "true" : undefined} />
      </button>
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
