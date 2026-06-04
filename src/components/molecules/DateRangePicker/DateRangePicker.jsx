"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/src/components/atoms/Button";
import { useIsClient } from "@/src/hooks/use-is-client";
import styles from "./DateRangePicker.module.scss";

// Inline chevrons (no external icon dependency).
function Chevron({ dir = "down", size = 14, className, ...rest }) {
  const paths = {
    down: "m6 9 6 6 6-6",
    left: "m15 18-6-6 6-6",
    right: "m9 18 6-6-6-6",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...rest}
    >
      <path d={paths[dir]} />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function addMonths(d, n) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function formatDate(d) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatMonthYear(d) {
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}
function formatInputDate(d) {
  if (!d) return "";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function startOfWeek(d) {
  const s = startOfDay(d);
  const dow = (s.getDay() + 6) % 7; // Monday = 0
  return addDays(s, -dow);
}
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function startOfYear(d) { return new Date(d.getFullYear(), 0, 1); }
function endOfYear(d) { return new Date(d.getFullYear(), 11, 31); }

// ─── Presets (range mode) — adapted from the Untitled UI date-picker set ──────

const PRESETS = [
  { id: "today", label: "Today", getRange: () => { const t = startOfDay(new Date()); return { start: t, end: t }; } },
  { id: "yesterday", label: "Yesterday", getRange: () => { const y = addDays(startOfDay(new Date()), -1); return { start: y, end: y }; } },
  { id: "this-week", label: "This week", getRange: () => ({ start: startOfWeek(new Date()), end: startOfDay(new Date()) }) },
  { id: "last-week", label: "Last week", getRange: () => { const s = addDays(startOfWeek(new Date()), -7); return { start: s, end: addDays(s, 6) }; } },
  { id: "this-month", label: "This month", getRange: () => ({ start: startOfMonth(new Date()), end: startOfDay(new Date()) }) },
  { id: "last-month", label: "Last month", getRange: () => { const lm = addMonths(new Date(), -1); return { start: startOfMonth(lm), end: endOfMonth(lm) }; } },
  { id: "this-year", label: "This year", getRange: () => ({ start: startOfYear(new Date()), end: startOfDay(new Date()) }) },
  { id: "last-year", label: "Last year", getRange: () => { const ly = new Date(new Date().getFullYear() - 1, 0, 1); return { start: startOfYear(ly), end: endOfYear(ly) }; } },
  { id: "all-time", label: "All time", getRange: () => ({ start: null, end: startOfDay(new Date()) }) },
];

// ─── Calendar grid ────────────────────────────────────────────────────────────

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function buildCalendarDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function CalendarMonth({ viewDate, stagedStart, stagedEnd, pendingStart, hoverDate, onDayClick, onDayHover }) {
  const effectiveRange = (() => {
    if (pendingStart && hoverDate) {
      const [s, e] = pendingStart <= hoverDate ? [pendingStart, hoverDate] : [hoverDate, pendingStart];
      return { start: s, end: e };
    }
    if (stagedStart && stagedEnd) return { start: stagedStart, end: stagedEnd };
    return null;
  })();

  const isSingle = effectiveRange ? isSameDay(effectiveRange.start, effectiveRange.end) : false;
  const calendarDays = buildCalendarDays(viewDate);

  const isDayInRange = (day) => (effectiveRange ? day >= effectiveRange.start && day <= effectiveRange.end : false);
  const isDayStart = (day) => (effectiveRange ? isSameDay(day, effectiveRange.start) : false);
  const isDayEnd = (day) => (effectiveRange ? isSameDay(day, effectiveRange.end) : false);
  const isToday = (day) => isSameDay(day, new Date());

  return (
    <div className={styles.month}>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((w) => <div key={w} className={styles.weekday}>{w}</div>)}
      </div>
      <div className={styles.grid}>
        {calendarDays.map((day, i) => {
          if (!day) return <div key={i} />;
          const inRange = isDayInRange(day);
          const isStart = isDayStart(day);
          const isEnd = isDayEnd(day);
          const today = isToday(day);
          const isEdge = isStart || isEnd;
          const isSingleDay = isSingle && isStart;
          return (
            <div
              key={i}
              className={styles.cell}
              data-in-range={inRange && !isSingleDay ? "true" : undefined}
              data-start={isStart && !isSingleDay ? "true" : undefined}
              data-end={isEnd && !isSingleDay ? "true" : undefined}
              onMouseEnter={() => pendingStart && onDayHover(day)}
              onMouseLeave={() => pendingStart && onDayHover(null)}
            >
              <button
                type="button"
                onClick={() => onDayClick(day)}
                className={styles.day}
                data-edge={isEdge || isSingleDay ? "true" : undefined}
                data-inrange={inRange && !isEdge && !isSingleDay ? "true" : undefined}
                data-today={today && !isEdge && !inRange ? "true" : undefined}
              >
                {day.getDate()}
                {today && !isEdge && <span className={styles.todayDot} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * DateRangePicker — adaptive date picker covering single-date and range modes.
 *
 * Props:
 *   mode         "single" | "range"            default "range"
 *   months       number of calendars shown      default single→1, range→2 (max 2)
 *   showPresets  boolean                         default range→true, single→false
 *   value        Date (single) | preset id (range) | null
 *   onChange     (result) => void
 *                single → { mode:"single", date, label }
 *                range  → { mode:"range", presetId, range:{start,end}, start, end, label }
 *   icon         ReactNode — trigger icon
 *
 * The popover is portal-rendered and positioned adaptively: it aligns under the
 * trigger, shifts to stay within the viewport, and flips above when there's no
 * room below — so it's never clipped off-screen.
 */
export function DateRangePicker({
  value,
  onChange,
  className,
  icon,
  mode = "range",
  months: monthsProp,
  showPresets: showPresetsProp,
}) {
  const isSingle = mode === "single";
  // Range shows one or two months — two is the practical maximum.
  const months = Math.max(1, Math.min(2, monthsProp ?? (isSingle ? 1 : 2)));
  // Presets are range shortcuts — never shown in single mode; default on for range.
  const showPresets = isSingle ? false : (showPresetsProp ?? true);

  const [open, setOpen] = useState(false);
  const [leftViewDate, setLeftViewDate] = useState(() => startOfDay(new Date()));

  // Staged state (committed on Apply)
  const [stagedPreset, setStagedPreset] = useState(null);
  const [stagedStart, setStagedStart] = useState(null);
  const [stagedEnd, setStagedEnd] = useState(null);
  const [pendingStart, setPendingStart] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
  const mounted = useIsClient();

  // Trigger label — a formatted date (single) or preset label (range).
  const triggerLabel = (() => {
    if (value instanceof Date) return formatInputDate(value);
    const preset = PRESETS.find((p) => p.id === value);
    if (preset) return preset.label;
    return isSingle ? "Select date" : "Select range";
  })();

  // Sync staged state from the committed value (adjust-during-render on change).
  function deriveStaged(v) {
    if (v instanceof Date) return { preset: null, start: v, end: v };
    const preset = PRESETS.find((p) => p.id === v);
    if (preset) { const r = preset.getRange(); return { preset: v, start: r.start, end: r.end }; }
    return { preset: v ?? null, start: null, end: null };
  }
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const s = deriveStaged(value);
    setStagedPreset(s.preset);
    setStagedStart(s.start);
    setStagedEnd(s.end);
    setPendingStart(null);
  }

  // Adaptive positioning — measure trigger + popover, keep inside the viewport.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const t = triggerRef.current;
      const p = popoverRef.current;
      if (!t || !p) return;
      const tr = t.getBoundingClientRect();
      const pw = p.offsetWidth;
      const ph = p.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 8;
      const gap = 6;
      // Horizontal: align to the trigger's left edge, then shift to fit.
      let left = tr.left;
      if (left + pw > vw - pad) left = vw - pad - pw;
      if (left < pad) left = pad;
      // Vertical: below by default; flip above when there's no room below.
      let top = tr.bottom + gap;
      if (top + ph > vh - pad && tr.top - gap - ph >= pad) top = tr.top - gap - ph;
      if (top < pad) top = pad;
      setPopoverStyle({ position: "fixed", top, left, zIndex: 9999 });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, mode, months, showPresets]);

  // Close on outside click.
  useEffect(() => {
    function handler(e) {
      if (!containerRef.current?.contains(e.target) && !popoverRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Move the visible months so a range is actually in view (fixes "selection
  // not showing" when a preset's range sits in an off-screen month).
  function goToRange(range) {
    const anchor = range?.start ?? range?.end ?? new Date();
    setLeftViewDate(startOfMonth(anchor));
  }

  function openPicker() {
    const s = deriveStaged(value);
    setStagedPreset(s.preset);
    setStagedStart(s.start);
    setStagedEnd(s.end);
    setPendingStart(null);
    setHoverDate(null);
    if (s.start || s.end) goToRange({ start: s.start, end: s.end });
    setPopoverStyle({ position: "fixed", top: 0, left: 0, visibility: "hidden" });
    setOpen(true);
  }

  function handlePresetClick(preset) {
    setStagedPreset(preset.id);
    const range = preset.getRange();
    setStagedStart(range.start);
    setStagedEnd(range.end);
    setPendingStart(null);
    goToRange(range);
  }

  function handleDayClick(day) {
    if (isSingle) {
      setStagedStart(day);
      setStagedEnd(day);
      setStagedPreset(null);
      return;
    }
    if (!pendingStart) {
      // First click is a complete selection on its own (single day = start===end);
      // a second click extends it into a range. Never force a second click.
      setPendingStart(day);
      setStagedStart(day);
      setStagedEnd(day);
      setStagedPreset(null);
    } else {
      const [start, end] = pendingStart <= day ? [pendingStart, day] : [day, pendingStart];
      setStagedStart(start);
      setStagedEnd(end);
      setPendingStart(null);
    }
  }

  function handleApply() {
    if (isSingle) {
      if (stagedStart) {
        onChange?.({ mode: "single", date: stagedStart, label: formatDate(stagedStart) });
      }
      setOpen(false);
      return;
    }
    if (stagedStart && stagedEnd) {
      const range = { start: stagedStart, end: stagedEnd };
      const preset = PRESETS.find((p) => p.id === stagedPreset);
      onChange?.({
        mode: "range",
        type: "preset",
        presetId: stagedPreset,
        range,
        start: stagedStart,
        end: stagedEnd,
        label: preset ? preset.label : `${formatDate(stagedStart)} – ${formatDate(stagedEnd)}`,
      });
    }
    setOpen(false);
  }

  function handleCancel() {
    setOpen(false);
  }

  function handleClear() {
    setStagedPreset(null);
    setStagedStart(null);
    setStagedEnd(null);
    setPendingStart(null);
  }

  // A single day is valid in both modes (range first-click sets start===end).
  const applyDisabled = !stagedStart;

  const popoverContent = (
    <div ref={popoverRef} className={styles.popover} style={popoverStyle} data-mode={mode}>
      <div className={styles.body}>
        {/* Quick-select preset rail (range only). Highlights by id so a preset
            with an open lower bound (e.g. "All time") still shows as active. */}
        {showPresets && (
          <div className={styles.presets}>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={styles.preset}
                data-selected={preset.id === stagedPreset ? "true" : undefined}
              >
                {preset.label}
              </button>
            ))}
            {pendingStart && <p className={styles.pendingHint}>Tip: click another day to make a range</p>}
          </div>
        )}

        {/* Calendars + inputs + actions */}
        <div className={styles.main}>
          {/* Selected date display(s) */}
          <div className={styles.inputs}>
            {isSingle ? (
              <div className={styles.inputCol}>
                <p className={styles.inputLabel}>Date</p>
                <div className={styles.inputBox} data-filled={stagedStart ? "true" : undefined}>
                  {stagedStart ? formatInputDate(stagedStart) : "Pick a date"}
                </div>
              </div>
            ) : (
              <>
                <div className={styles.inputCol}>
                  <p className={styles.inputLabel}>Start</p>
                  <div className={styles.inputBox} data-filled={stagedStart ? "true" : undefined}>
                    {stagedStart ? formatInputDate(stagedStart) : "Start date"}
                  </div>
                </div>
                <div className={styles.inputDash} />
                <div className={styles.inputCol}>
                  <p className={styles.inputLabel}>End</p>
                  <div className={styles.inputBox} data-filled={stagedEnd ? "true" : undefined}>
                    {stagedEnd ? formatInputDate(stagedEnd) : "End date"}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* N calendars side by side */}
          <div className={styles.calendars}>
            {Array.from({ length: months }).map((_, i) => {
              const viewDate = addMonths(leftViewDate, i);
              const isFirst = i === 0;
              const isLast = i === months - 1;
              return (
                <div key={i} className={styles.calCol}>
                  {i > 0 && <div className={styles.calDivider} />}
                  <div className={styles.calBody}>
                    <div className={styles.navRow}>
                      {isFirst ? (
                        <button
                          type="button"
                          onClick={() => setLeftViewDate((d) => addMonths(d, -1))}
                          className={styles.navBtn}
                          aria-label="Previous month"
                        >
                          <Chevron dir="left" size={14} />
                        </button>
                      ) : (
                        <div className={styles.navSpacer} />
                      )}
                      <span className={styles.monthLabel}>{formatMonthYear(viewDate)}</span>
                      {isLast ? (
                        <button
                          type="button"
                          onClick={() => setLeftViewDate((d) => addMonths(d, 1))}
                          className={styles.navBtn}
                          aria-label="Next month"
                        >
                          <Chevron dir="right" size={14} />
                        </button>
                      ) : (
                        <div className={styles.navSpacer} />
                      )}
                    </div>
                    <CalendarMonth
                      viewDate={viewDate}
                      stagedStart={stagedStart}
                      stagedEnd={stagedEnd}
                      pendingStart={pendingStart}
                      hoverDate={hoverDate}
                      onDayClick={handleDayClick}
                      onDayHover={setHoverDate}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected-date preview — space is always reserved so layout never jumps */}
          <div className={styles.preview}>
            {stagedStart ? (
              <>
                <span className={styles.previewIcon} aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="3" /><path d="M3 9h18M8 2v4M16 2v4" />
                  </svg>
                </span>
                {isSingle || (stagedEnd && isSameDay(stagedStart, stagedEnd))
                  ? formatDate(stagedStart)
                  : `${formatDate(stagedStart)} – ${stagedEnd ? formatDate(stagedEnd) : "…"}`}
              </>
            ) : (
              <span className={styles.previewEmpty}>{isSingle ? "No date selected" : "No range selected"}</span>
            )}
          </div>

          {/* Action row: Clear | Cancel + Apply */}
          <div className={styles.actions}>
            <Button variant="link" theme="warning" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <div className={styles.actionsRight}>
              <Button variant="outline" theme="neutral" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="solid" theme="primary" size="sm" disabled={applyDisabled} onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={[styles.root, className].filter(Boolean).join(" ")}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={styles.trigger}
      >
        <span className={styles.triggerLabel}>
          {icon ?? (
            <span className={styles.triggerIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          )}
          <span className={styles.triggerText}>{triggerLabel}</span>
        </span>
        <Chevron dir="down" size={14} className={styles.chevron} data-open={open ? "true" : undefined} />
      </button>

      {open && mounted && createPortal(popoverContent, document.body)}
    </div>
  );
}
