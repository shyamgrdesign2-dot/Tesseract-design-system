"use client";

/**
 * DatePicker — the single Tesseract date/time picker. One component, one
 * popover, every mode (functionality reference: Razorpay Blade DatePicker):
 *
 *   mode "single"    pick one date
 *   mode "range"     start–end range (1–2 months, quick-select presets)
 *   mode "month"     pick a month (month grid + year stepping)
 *   mode "year"      pick a year (decade grid)
 *   mode "time"      pick a time (hours · minutes · AM/PM)
 *   mode "datetime"  pick a date AND a time
 *
 * Shared chrome: month/year drill-down navigation, min/max + per-day disable,
 * keyboard navigation (arrows · Home/End · PageUp/Dn · Enter · Esc), a real form
 * field (label · helperText · status · size · required), staged editing with TP
 * Button CTAs (Clear · Cancel · Apply), and adaptive viewport-aware positioning.
 *
 * Props:
 *   value        depends on mode:
 *                  single/datetime → Date
 *                  range           → preset id | { start, end } | Date
 *                  month           → Date | { year, month }
 *                  year            → Date | number(year)
 *                  time            → Date | { hours, minutes } | "HH:MM"
 *   onChange     (result) => void   shape carries `mode`, the value, and a `label`
 *   mode         see above                                  default "single"
 *   months       1 | 2  (range)                             default range→2
 *   showPresets  boolean (range)                            default range→true
 *   presets      custom preset list
 *   minDate / maxDate / isDateDisabled    constraints (date modes)
 *   use12Hour    12h + AM/PM vs 24h (time/datetime)         default true
 *   minuteStep   minute granularity                         default 5
 *   label / helperText / status ("error"|"success"|"warning") / required / disabled
 *   placeholder / size ("sm"|"md"|"lg") / fullWidth / icon / analyticsId
 *   locale       BCP-47 locale for all date formatting            default "en-IN"
 *   formatDate   (date) => string  override for rendered dates (wins over locale)
 *   weekStartsOn 0 (Sunday) | 1 (Monday) — week start             default 1
 *   applyLabel / cancelLabel / clearLabel   footer button labels  default Apply/Cancel/Clear
 *   showFooter   show the Clear · Cancel · Apply footer            default true
 *   commitMode   "outside-click" (commit on outside click) | "apply" (commit only on Apply)
 *                                                                  default "outside-click"
 */

import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { useIsClient } from "@/src/hooks/use-is-client";
import { useAnalytics } from "@/src/analytics/context";
import styles from "./DateRangePicker.module.scss";

// Chevron from the icon CDN (no inline SVG). Forwards data-* (e.g. data-open) so
// the trigger chevron can still rotate via the .chevron[data-open] selector.
function Chevron({ dir = "down", size = 14, className, ...rest }) {
  return <TPLibraryIcon name={`chevron-${dir}`} size={size} className={className} {...rest} />;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function addMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; }
function isSameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function clampDate(d, min, max) { if (min && d < min) return startOfDay(min); if (max && d > max) return startOfDay(max); return d; }
// startOfWeek honours weekStartsOn (0=Sun, 1=Mon). Default 1 = the original Monday start.
function startOfWeek(d, weekStartsOn = 1) { const s = startOfDay(d); const dow = (s.getDay() - weekStartsOn + 7) % 7; return addDays(s, -dow); }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function startOfYear(d) { return new Date(d.getFullYear(), 0, 1); }
function endOfYear(d) { return new Date(d.getFullYear(), 11, 31); }
const pad2 = (n) => String(n).padStart(2, "0");

// Formatters take a locale (default "en-IN" = unchanged). formatDate additionally
// accepts a `custom` override ((date) => string) which wins over the locale path.
function formatDate(d, locale = "en-IN", custom) { return custom ? custom(d) : d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }); }
function formatMonthYear(d, locale = "en-IN") { return d.toLocaleDateString(locale, { month: "long", year: "numeric" }); }
function formatInputDate(d, locale = "en-IN") { return d ? d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" }) : ""; }
function formatTime(h, m, use12) {
  if (use12) { const ap = h < 12 ? "AM" : "PM"; const h12 = h % 12 || 12; return `${pad2(h12)}:${pad2(m)} ${ap}`; }
  return `${pad2(h)}:${pad2(m)}`;
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Sunday-indexed base labels; reordered per weekStartsOn (default 1 = Monday-first,
// i.e. ["Mo","Tu","We","Th","Fr","Sa","Su"] — the original array).
const WEEKDAYS_BASE = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function weekdayLabels(weekStartsOn = 1) {
  return Array.from({ length: 7 }, (_, i) => WEEKDAYS_BASE[(i + weekStartsOn) % 7]);
}

// ─── Presets (range mode) ─────────────────────────────────────────────────────
const PRESETS = [
  { id: "today", label: "Today", getRange: () => { const t = startOfDay(new Date()); return { start: t, end: t }; } },
  { id: "yesterday", label: "Yesterday", getRange: () => { const y = addDays(startOfDay(new Date()), -1); return { start: y, end: y }; } },
  { id: "last-7", label: "Past 7 days", getRange: () => ({ start: addDays(startOfDay(new Date()), -6), end: startOfDay(new Date()) }) },
  { id: "last-30", label: "Past 30 days", getRange: () => ({ start: addDays(startOfDay(new Date()), -29), end: startOfDay(new Date()) }) },
  { id: "this-month", label: "This month", getRange: () => ({ start: startOfMonth(new Date()), end: startOfDay(new Date()) }) },
  { id: "last-month", label: "Last month", getRange: () => { const lm = addMonths(new Date(), -1); return { start: startOfMonth(lm), end: endOfMonth(lm) }; } },
  { id: "this-year", label: "This year", getRange: () => ({ start: startOfYear(new Date()), end: startOfDay(new Date()) }) },
  { id: "last-year", label: "Last year", getRange: () => { const ly = new Date(new Date().getFullYear() - 1, 0, 1); return { start: startOfYear(ly), end: endOfYear(ly) }; } },
];

function buildCalendarDays(viewDate, weekStartsOn = 1) {
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  // Days from the week start to the 1st of the month (default Monday start = original).
  const startOffset = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ─── Calendar month grid ──────────────────────────────────────────────────────
function CalendarMonth({ viewDate, stagedStart, stagedEnd, pendingStart, hoverDate, focusDate, isDisabledDay, onDayClick, onDayHover, weekStartsOn = 1, locale = "en-IN", formatDateFn }) {
  const effectiveRange = (() => {
    if (pendingStart && hoverDate) { const [s, e] = pendingStart <= hoverDate ? [pendingStart, hoverDate] : [hoverDate, pendingStart]; return { start: s, end: e }; }
    if (stagedStart && stagedEnd) return { start: stagedStart, end: stagedEnd };
    return null;
  })();
  const isSingle = effectiveRange ? isSameDay(effectiveRange.start, effectiveRange.end) : false;
  const days = buildCalendarDays(viewDate, weekStartsOn);
  const WEEKDAYS = weekdayLabels(weekStartsOn);
  const inRange = (day) => (effectiveRange && effectiveRange.start && effectiveRange.end ? day >= effectiveRange.start && day <= effectiveRange.end : false);
  const isStart = (day) => (effectiveRange ? isSameDay(day, effectiveRange.start) : false);
  const isEnd = (day) => (effectiveRange ? isSameDay(day, effectiveRange.end) : false);

  return (
    <div className={styles.month}>
      <div className={styles.weekdays}>{WEEKDAYS.map((w) => <div key={w} className={styles.weekday}>{w}</div>)}</div>
      <div className={styles.grid}>
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const within = inRange(day), s = isStart(day), e = isEnd(day);
          const today = isSameDay(day, new Date()), edge = s || e, single = isSingle && s;
          const disabled = isDisabledDay(day), focused = focusDate && isSameDay(day, focusDate);
          return (
            <div key={i} className={styles.cell}
              data-in-range={within && !single && !disabled ? "true" : undefined}
              data-start={s && !single ? "true" : undefined}
              data-end={e && !single ? "true" : undefined}
              onMouseEnter={() => pendingStart && !disabled && onDayHover(day)}
              onMouseLeave={() => pendingStart && onDayHover(null)}>
              <button type="button" disabled={disabled} onClick={() => !disabled && onDayClick(day)} className={styles.day}
                data-edge={edge || single ? "true" : undefined}
                data-inrange={within && !edge && !single ? "true" : undefined}
                data-today={today && !edge && !within ? "true" : undefined}
                data-focused={focused && !edge ? "true" : undefined}
                data-disabled={disabled ? "true" : undefined}
                aria-label={formatDate(day, locale, formatDateFn)} aria-current={today ? "date" : undefined}>
                {day.getDate()}
                {today && !edge && <span className={styles.todayDot} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Month / year quick-pick grid ──────────────────────────────────────────────
function MonthYearPanel({ view, viewDate, selected, minDate, maxDate, onPickMonth, onPickYear }) {
  const year = viewDate.getFullYear();
  if (view === "years") {
    const base = Math.floor(year / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => base + i);
    const minY = minDate ? minDate.getFullYear() : -Infinity, maxY = maxDate ? maxDate.getFullYear() : Infinity;
    return (
      <div className={styles.mypanel}><div className={styles.mygrid}>
        {years.map((y) => (
          <button key={y} type="button" className={styles.mycell} disabled={y < minY || y > maxY}
            data-selected={selected?.kind === "year" && selected.year === y ? "true" : undefined}
            onClick={() => onPickYear(y)}>{y}</button>
        ))}
      </div></div>
    );
  }
  return (
    <div className={styles.mypanel}><div className={styles.mygrid}>
      {MONTHS_SHORT.map((m, idx) => {
        const monthEnd = endOfMonth(new Date(year, idx, 1)), monthStart = startOfMonth(new Date(year, idx, 1));
        const disabled = (maxDate && monthStart > maxDate) || (minDate && monthEnd < minDate);
        const isSel = selected?.kind === "month" && selected.year === year && selected.month === idx;
        return (
          <button key={m} type="button" className={styles.mycell} disabled={disabled}
            data-selected={isSel ? "true" : undefined} onClick={() => onPickMonth(idx)}>{m}</button>
        );
      })}
    </div></div>
  );
}

// ─── Time panel (hours · minutes · AM/PM columns) ──────────────────────────────
// TimeCol is module-level (NOT nested in TimePanel) so its DOM nodes stay stable
// across re-renders — otherwise the columns would remount and lose scroll.
function TimeCol({ items, isActive, onPick, fmt }) {
  return (
    <div className={styles.timeCol} role="listbox">
      {items.map((it) => (
        <button key={it} type="button" role="option" aria-selected={isActive(it)}
          className={styles.timeItem} data-selected={isActive(it) ? "true" : undefined}
          onClick={() => onPick(it)}>{fmt ? fmt(it) : pad2(it)}</button>
      ))}
    </div>
  );
}

function TimePanel({ value, use12, step, onChange }) {
  const { h, m } = value;
  const rootRef = useRef(null);
  // Center the selected hour/minute/meridiem in each column when the panel opens.
  // Scroll the column directly (not scrollIntoView) so the fixed popover never shifts.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      rootRef.current?.querySelectorAll('[data-selected="true"]').forEach((el) => {
        const col = el.parentElement;
        if (col) col.scrollTop = el.offsetTop - col.clientHeight / 2 + el.offsetHeight / 2;
      });
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const hours = use12 ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
  const h12 = h % 12 || 12, ampm = h < 12 ? "AM" : "PM";
  const setHour12 = (hr) => onChange({ h: (hr % 12) + (ampm === "PM" ? 12 : 0), m });
  const setHour24 = (hr) => onChange({ h: hr, m });
  const setMin = (mn) => onChange({ h, m: mn });
  const setAmpm = (ap) => onChange({ h: (h % 12) + (ap === "PM" ? 12 : 0), m });

  return (
    <div className={styles.timePanel} ref={rootRef}>
      <TimeCol items={hours} fmt={(x) => pad2(x)} isActive={(x) => (use12 ? x === h12 : x === h)} onPick={use12 ? setHour12 : setHour24} />
      <span className={styles.timeSep}>:</span>
      <TimeCol items={minutes} isActive={(x) => x === m} onPick={setMin} />
      {use12 && <TimeCol items={["AM", "PM"]} fmt={(x) => x} isActive={(x) => x === ampm} onPick={setAmpm} />}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export const DatePicker = forwardRef(function DatePicker({
  value, onChange, className, style, icon,
  mode = "single",
  months: monthsProp, showPresets: showPresetsProp, presets = PRESETS,
  minDate, maxDate, isDateDisabled,
  use12Hour = true, minuteStep = 5,
  label, helperText, status, required = false, disabled = false, placeholder,
  size = "md", fullWidth = true, analyticsId,
  // i18n + configurability (defaults preserve the original behaviour/look)
  locale = "en-IN", formatDate: formatDateProp,
  weekStartsOn = 1,
  applyLabel = "Apply", cancelLabel = "Cancel", clearLabel = "Clear", showFooter = true,
  commitMode = "outside-click",
  ...rest
}, ref) {
  const { track } = useAnalytics();
  const isRange = mode === "range";
  const isSingle = mode === "single";
  const isMonth = mode === "month";
  const isYear = mode === "year";
  const isTime = mode === "time";
  const isDateTime = mode === "datetime";
  const hasCalendar = isSingle || isRange || isDateTime;
  const hasTime = isTime || isDateTime;

  const months = Math.max(1, Math.min(2, monthsProp ?? (isRange ? 2 : 1)));
  const showPresets = isRange ? (showPresetsProp ?? true) : false;
  const min = minDate ? startOfDay(minDate) : null;
  const max = maxDate ? startOfDay(maxDate) : null;
  const isDisabledDay = (day) => {
    if (min && day < min) return true;
    if (max && day > max) return true;
    return isDateDisabled ? isDateDisabled(day) : false;
  };

  // Locale-bound formatters — the rest of the component calls these so `locale`
  // (default "en-IN" = unchanged) and the optional `formatDate` override apply
  // everywhere a date is rendered. `fmtDate` honours the override; the others
  // are locale-only (month/year + short-input variants).
  const fmtDate = (d) => formatDate(d, locale, formatDateProp);
  const fmtMonthYear = (d) => formatMonthYear(d, locale);
  const fmtInputDate = (d) => formatInputDate(d, locale);
  const fmtMonthShort = (d) => d.toLocaleDateString(locale, { month: "short", year: "numeric" });

  // Base panel for the mode (month/year open straight onto their grid).
  const basePanel = isMonth ? "months" : isYear ? "years" : "days";

  const [open, setOpen] = useState(false);
  const [leftViewDate, setLeftViewDate] = useState(() => startOfDay(new Date()));
  const [panel, setPanel] = useState(basePanel);
  const [stagedPreset, setStagedPreset] = useState(null);
  const [stagedStart, setStagedStart] = useState(null);
  const [stagedEnd, setStagedEnd] = useState(null);
  const [pendingStart, setPendingStart] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [focusDate, setFocusDate] = useState(null);
  const [stagedTime, setStagedTime] = useState({ h: 9, m: 0 });

  const containerRef = useRef(null);
  // Forward the external ref to the root element (the container div) while
  // keeping the internal containerRef intact for positioning/outside-click.
  useImperativeHandle(ref, () => containerRef.current, []);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const keyHandlerRef = useRef(null);
  const commitRef = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
  const mounted = useIsClient();

  // ── value → staged ──
  function deriveStaged(v) {
    const out = { preset: null, start: null, end: null, time: null };
    if (v == null) return out;
    if (isRange) {
      if (v instanceof Date) { out.start = startOfDay(v); out.end = startOfDay(v); return out; }
      if (typeof v === "object" && v.start) { out.start = startOfDay(v.start); out.end = v.end ? startOfDay(v.end) : startOfDay(v.start); return out; }
      const p = presets.find((x) => x.id === v); if (p) { const r = p.getRange(); out.preset = v; out.start = r.start; out.end = r.end; }
      return out;
    }
    if (isTime) {
      if (v instanceof Date) out.time = { h: v.getHours(), m: v.getMinutes() };
      else if (typeof v === "string") { const [hh, mm] = v.split(":"); out.time = { h: +hh || 0, m: +mm || 0 }; }
      else if (typeof v === "object") out.time = { h: v.hours ?? 0, m: v.minutes ?? 0 };
      return out;
    }
    if (isYear) { const y = v instanceof Date ? v.getFullYear() : Number(v); if (!isNaN(y)) out.start = new Date(y, 0, 1); return out; }
    if (isMonth) {
      if (v instanceof Date) out.start = startOfMonth(v);
      else if (typeof v === "object") out.start = new Date(v.year, v.month, 1);
      return out;
    }
    // single / datetime
    if (v instanceof Date) { out.start = startOfDay(v); out.end = startOfDay(v); if (isDateTime) out.time = { h: v.getHours(), m: v.getMinutes() }; }
    return out;
  }

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const s = deriveStaged(value);
    setStagedPreset(s.preset); setStagedStart(s.start); setStagedEnd(s.end);
    if (s.time) setStagedTime(s.time);
    setPendingStart(null);
  }

  // ── Trigger label ──
  const triggerLabel = (() => {
    if (isRange) {
      if (value && typeof value === "object" && value.start) return `${fmtInputDate(value.start)}${value.end ? ` – ${fmtInputDate(value.end)}` : ""}`;
      const p = presets.find((x) => x.id === value); if (p) return p.label;
      if (value instanceof Date) return fmtInputDate(value);
    } else if (isTime) {
      if (value != null) { const s = deriveStaged(value); if (s.time) return formatTime(s.time.h, s.time.m, use12Hour); }
    } else if (isYear) {
      if (value != null) return String(value instanceof Date ? value.getFullYear() : value);
    } else if (isMonth) {
      if (value != null) { const s = deriveStaged(value); if (s.start) return fmtMonthShort(s.start); }
    } else if (value instanceof Date) {
      return isDateTime ? `${fmtInputDate(value)}, ${formatTime(value.getHours(), value.getMinutes(), use12Hour)}` : fmtInputDate(value);
    }
    return placeholder || DEFAULT_PLACEHOLDER[mode] || "Select";
  })();

  // Live preview: while open, the field mirrors the STAGED selection so the user
  // sees their pick immediately (no Apply needed).
  const stagedLabel = (() => {
    if (isTime) return formatTime(stagedTime.h, stagedTime.m, use12Hour);
    if (isYear) return stagedStart ? String(stagedStart.getFullYear()) : null;
    if (isMonth) return stagedStart ? fmtMonthShort(stagedStart) : null;
    if (isRange) {
      if (stagedStart && stagedEnd) { const p = presets.find((x) => x.id === stagedPreset); return p ? p.label : `${fmtInputDate(stagedStart)} – ${fmtInputDate(stagedEnd)}`; }
      if (stagedStart) return fmtInputDate(stagedStart);
      return null;
    }
    if (stagedStart) return isDateTime ? `${fmtInputDate(stagedStart)}, ${formatTime(stagedTime.h, stagedTime.m, use12Hour)}` : fmtInputDate(stagedStart);
    return null;
  })();
  const displayLabel = open && stagedLabel ? stagedLabel : triggerLabel;
  const committedValue = value != null && !(typeof value === "object" && !(value instanceof Date) && !value.start);
  const hasValue = committedValue || (open && !!stagedLabel);

  // ── Positioning ──
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const t = triggerRef.current, p = popoverRef.current;
      if (!t || !p) return;
      const tr = t.getBoundingClientRect();
      const pw = p.offsetWidth, ph = p.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, pad = 8, gap = 6;
      let left = tr.left; if (left + pw > vw - pad) left = vw - pad - pw; if (left < pad) left = pad;
      let top = tr.bottom + gap; if (top + ph > vh - pad && tr.top - gap - ph >= pad) top = tr.top - gap - ph; if (top < pad) top = pad;
      setPopoverStyle({ position: "fixed", top, left, zIndex: 9999 });
    };
    place();
    window.addEventListener("resize", place); window.addEventListener("scroll", place, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); };
  }, [open, mode, months, showPresets, panel]);

  // Click outside → COMMIT the current selection (don't discard it), then close.
  // This matches the reference: you don't have to press Apply.
  useEffect(() => {
    function handler(e) {
      if (!containerRef.current?.contains(e.target) && !popoverRef.current?.contains(e.target)) commitRef.current?.();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) { const id = requestAnimationFrame(() => popoverRef.current?.focus()); return () => cancelAnimationFrame(id); }
    triggerRef.current?.focus();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const el = popoverRef.current; if (!el) return undefined;
    const h = (e) => keyHandlerRef.current?.(e);
    el.addEventListener("keydown", h);
    return () => el.removeEventListener("keydown", h);
  }, [open]);

  function goToRange(range) { setLeftViewDate(startOfMonth(range?.start ?? range?.end ?? new Date())); }

  function openPicker() {
    if (disabled) return;
    const s = deriveStaged(value);
    setStagedPreset(s.preset); setStagedStart(s.start); setStagedEnd(s.end);
    if (s.time) setStagedTime(s.time);
    setPendingStart(null); setHoverDate(null); setPanel(basePanel);
    // Don't seed a visible focus ring on open — today shows as plain blue + dot.
    // The keyboard ring only appears once the user actually arrow-navigates.
    setFocusDate(null);
    setLeftViewDate(startOfMonth(clampDate(s.start || new Date(), min, max)));
    setPopoverStyle({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
    setOpen(true);
  }

  function handlePresetClick(preset) {
    setStagedPreset(preset.id);
    const range = preset.getRange();
    const cs = range.start ? clampDate(range.start, min, max) : range.start;
    const ce = range.end ? clampDate(range.end, min, max) : range.end;
    setStagedStart(cs); setStagedEnd(ce); setPendingStart(null); goToRange({ start: cs, end: ce });
  }

  function selectDay(day) {
    if (isDisabledDay(day)) return;
    setFocusDate(day);
    if (isRange) {
      if (!pendingStart) { setPendingStart(day); setStagedStart(day); setStagedEnd(day); setStagedPreset(null); }
      else { const [s, e] = pendingStart <= day ? [pendingStart, day] : [day, pendingStart]; setStagedStart(s); setStagedEnd(e); setPendingStart(null); }
    } else {
      setStagedStart(day); setStagedEnd(day);
    }
  }

  function handleCancel() { setOpen(false); }
  function onPopoverKeyDown(e) {
    if (e.key === "Escape") { e.preventDefault(); handleCancel(); return; }
    if (panel !== "days" || !hasCalendar) return;
    if (e.target.tagName === "INPUT") return;
    const f = focusDate || clampDate(stagedStart || new Date(), min, max);
    let next;
    switch (e.key) {
      case "ArrowLeft": next = addDays(f, -1); break;
      case "ArrowRight": next = addDays(f, 1); break;
      case "ArrowUp": next = addDays(f, -7); break;
      case "ArrowDown": next = addDays(f, 7); break;
      case "Home": next = startOfWeek(f, weekStartsOn); break;
      case "End": next = addDays(startOfWeek(f, weekStartsOn), 6); break;
      case "PageUp": next = addMonths(f, -1); break;
      case "PageDown": next = addMonths(f, 1); break;
      case "Enter": e.preventDefault(); selectDay(f); return;
      default: return;
    }
    e.preventDefault();
    next = clampDate(next, min, max);
    setFocusDate(next);
    const lastVisible = endOfMonth(addMonths(leftViewDate, months - 1));
    if (next < startOfMonth(leftViewDate)) setLeftViewDate(startOfMonth(next));
    else if (next > lastVisible) setLeftViewDate(startOfMonth(addMonths(next, -(months - 1))));
  }
  useEffect(() => { keyHandlerRef.current = onPopoverKeyDown; });

  function emit(action, payload) { if (analyticsId) track({ component: "DatePicker", id: analyticsId, action, ...payload }); }

  function handleApply() {
    if (isTime) {
      const label = formatTime(stagedTime.h, stagedTime.m, use12Hour);
      onChange?.({ mode: "time", hours: stagedTime.h, minutes: stagedTime.m, time: `${pad2(stagedTime.h)}:${pad2(stagedTime.m)}`, label });
      emit("apply", { value: label });
    } else if (isYear && stagedStart) {
      const y = stagedStart.getFullYear();
      onChange?.({ mode: "year", year: y, date: new Date(y, 0, 1), label: String(y) });
      emit("apply", { value: y });
    } else if (isMonth && stagedStart) {
      const label = fmtMonthShort(stagedStart);
      onChange?.({ mode: "month", year: stagedStart.getFullYear(), month: stagedStart.getMonth(), date: stagedStart, label });
      emit("apply", { value: label });
    } else if (isRange) {
      if (stagedStart && stagedEnd) {
        const preset = presets.find((p) => p.id === stagedPreset);
        const label = preset ? preset.label : `${fmtDate(stagedStart)} – ${fmtDate(stagedEnd)}`;
        onChange?.({ mode: "range", type: stagedPreset ? "preset" : "custom", presetId: stagedPreset, range: { start: stagedStart, end: stagedEnd }, start: stagedStart, end: stagedEnd, label });
        emit("apply", { value: label, presetId: stagedPreset || undefined });
      }
    } else if (stagedStart) {
      // single / datetime
      let date = stagedStart;
      if (isDateTime) { date = new Date(stagedStart); date.setHours(stagedTime.h, stagedTime.m, 0, 0); }
      const label = isDateTime ? `${fmtInputDate(date)}, ${formatTime(stagedTime.h, stagedTime.m, use12Hour)}` : fmtDate(date);
      onChange?.({ mode, date, label });
      emit("apply", { value: label });
    }
    setOpen(false);
  }
  // Outside-click commit. An INCOMPLETE range (only the start picked — pendingStart
  // still set) is discarded rather than committed as a one-day range.
  // commitMode "outside-click" (default) commits the staged selection on outside
  // click; "apply" only closes (commit happens solely via the Apply button).
  useEffect(() => {
    commitRef.current = () => {
      if (commitMode === "apply") { setOpen(false); return; }
      if (isRange && pendingStart) { setOpen(false); return; }
      handleApply();
    };
  });
  // Clear resets the staged selection AND commits the empty value, so the field
  // above falls back to its placeholder (not just the calendar below). Popover
  // stays open so the user can immediately pick again.
  function handleClear() {
    setStagedPreset(null); setStagedStart(null); setStagedEnd(null); setPendingStart(null); setStagedTime({ h: 9, m: 0 }); setFocusDate(null);
    const cleared = isRange ? { mode: "range", range: null, start: null, end: null, presetId: null, label: "" }
      : isTime ? { mode: "time", time: null, hours: null, minutes: null, label: "" }
      : isYear ? { mode: "year", year: null, date: null, label: "" }
      : { mode, date: null, label: "" };
    onChange?.(cleared);
    emit("clear", {});
  }

  const applyDisabled = isTime ? false : isRange ? (!stagedStart || !stagedEnd) : !stagedStart;
  const prevDisabled = min && hasCalendar && panel === "days" ? endOfMonth(addMonths(leftViewDate, -1)) < min : false;
  const nextDisabled = max && hasCalendar && panel === "days" ? startOfMonth(addMonths(leftViewDate, months)) > max : false;

  const monthYearSelected = isMonth && stagedStart ? { kind: "month", year: stagedStart.getFullYear(), month: stagedStart.getMonth() }
    : isYear && stagedStart ? { kind: "year", year: stagedStart.getFullYear() } : null;

  const showNav = hasCalendar || isMonth || isYear;

  const popoverContent = (
    <div ref={popoverRef} tabIndex={-1} className={styles.popover} style={popoverStyle} data-mode={mode} role="dialog" aria-label={`Choose ${mode}`}>
      <div className={styles.body}>
        {showPresets && (
          <div className={styles.presets}>
            {presets.map((preset) => (
              <button key={preset.id} type="button" onClick={() => handlePresetClick(preset)}
                className={styles.preset} data-selected={preset.id === stagedPreset ? "true" : undefined}>{preset.label}</button>
            ))}
            {pendingStart && <p className={styles.pendingHint}>Tip: click another day to make a range</p>}
          </div>
        )}

        <div className={styles.main}>
          {(() => {
            const nav = showNav && (
              <div className={styles.navRow}>
                <button type="button" className={styles.navBtn} disabled={prevDisabled}
                  onClick={() => setLeftViewDate((d) => addMonths(d, panel === "days" ? -1 : panel === "months" ? -12 : -144))}
                  aria-label="Previous"><Chevron dir="left" size={16} /></button>
                <div className={styles.headLabels}>
                  {panel === "days" ? (
                    Array.from({ length: months }).map((_, i) => (
                      <button key={i} type="button" className={styles.monthBtn} onClick={() => setPanel("months")}>
                        {fmtMonthYear(addMonths(leftViewDate, i))}<Chevron dir="down" size={13} />
                      </button>
                    ))
                  ) : (
                    <button type="button" className={styles.monthBtn} onClick={() => setPanel(panel === "months" ? "years" : "days")}>
                      {panel === "months" ? leftViewDate.getFullYear() : `${Math.floor(leftViewDate.getFullYear() / 12) * 12} – ${Math.floor(leftViewDate.getFullYear() / 12) * 12 + 11}`}
                    </button>
                  )}
                </div>
                <button type="button" className={styles.navBtn} disabled={nextDisabled}
                  onClick={() => setLeftViewDate((d) => addMonths(d, panel === "days" ? 1 : panel === "months" ? 12 : 144))}
                  aria-label="Next"><Chevron dir="right" size={16} /></button>
              </div>
            );
            const body = panel === "days" && hasCalendar ? (
              <div className={styles.calendars}>
                {Array.from({ length: months }).map((_, i) => (
                  <div key={i} className={styles.calCol}>
                    {i > 0 && <div className={styles.calDivider} />}
                    <CalendarMonth viewDate={addMonths(leftViewDate, i)} stagedStart={stagedStart} stagedEnd={stagedEnd}
                      pendingStart={pendingStart} hoverDate={hoverDate} focusDate={focusDate}
                      isDisabledDay={isDisabledDay} onDayClick={selectDay} onDayHover={setHoverDate}
                      weekStartsOn={weekStartsOn} locale={locale} formatDateFn={formatDateProp} />
                  </div>
                ))}
              </div>
            ) : panel !== "days" ? (
              <MonthYearPanel view={panel} viewDate={leftViewDate} selected={monthYearSelected} minDate={min} maxDate={max}
                onPickMonth={(idx) => {
                  if (isMonth) { setStagedStart(new Date(leftViewDate.getFullYear(), idx, 1)); }
                  else { setLeftViewDate((d) => new Date(d.getFullYear(), idx, 1)); setPanel("days"); }
                }}
                onPickYear={(y) => {
                  if (isYear) { setStagedStart(new Date(y, 0, 1)); }
                  else { setLeftViewDate((d) => new Date(y, d.getMonth(), 1)); setPanel("months"); }
                }} />
            ) : null;
            const time = <TimePanel value={stagedTime} use12={use12Hour} step={minuteStep} onChange={setStagedTime} />;

            // datetime → calendar + time SIDE BY SIDE (grow width, not height).
            if (isDateTime) {
              return (
                <div className={styles.dtRow}>
                  <div className={styles.dtCal}>{nav}{body}</div>
                  <div className={styles.timeSide}>{time}</div>
                </div>
              );
            }
            return (<>{nav}{body}{isTime && <div className={styles.timeWrap}>{time}</div>}</>);
          })()}

          {showFooter && (
            <div className={styles.actions}>
              <Button variant="link" theme="warning" size="sm" onClick={handleClear}>{clearLabel}</Button>
              <div className={styles.actionsRight}>
                <Button variant="outline" theme="neutral" size="sm" onClick={handleCancel}>{cancelLabel}</Button>
                <Button variant="solid" theme="primary" size="sm" disabled={applyDisabled} onClick={handleApply}>{applyLabel}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={[styles.root, fullWidth && styles.fullWidth, className].filter(Boolean).join(" ")} style={style} {...rest}>
      {label && <label className={styles.fieldLabel}>{label}{required && <span className={styles.req}>*</span>}</label>}
      <button ref={triggerRef} type="button" disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={styles.trigger} data-size={size} data-status={status || undefined}
        data-open={open ? "true" : undefined} data-placeholder={!hasValue ? "true" : undefined}
        aria-haspopup="dialog" aria-expanded={open}>
        <span className={styles.triggerLabel}>
          <span className={styles.triggerIcon}>
            {icon ?? <TPLibraryIcon name={hasTime && !hasCalendar ? "clock" : "calendar-1"} size={16} />}
          </span>
          <span className={styles.triggerText}>{displayLabel}</span>
        </span>
        <Chevron dir="down" size={14} className={styles.chevron} data-open={open ? "true" : undefined} />
      </button>
      {helperText && <p className={styles.helper} data-status={status || undefined}>{helperText}</p>}
      {open && mounted && createPortal(popoverContent, document.body)}
    </div>
  );
});

const DEFAULT_PLACEHOLDER = {
  single: "Select date", range: "Select range", month: "Select month",
  year: "Select year", time: "Select time", datetime: "Select date & time",
};

DatePicker.displayName = "DatePicker";
// Back-compat alias — the component used to be named DateRangePicker.
export const DateRangePicker = DatePicker;
export default DatePicker;
