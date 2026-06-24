"use client";

/**
 * Filter — a single "Filter" entry point that opens one panel with grouped,
 * multi-select sections (e.g. Status · Doctors · Types). First-party, no deps.
 *
 * Chosen options appear as removable chips below the bar. Pairs with DataTable
 * (filter the data by the selection); the section set changes per table — just
 * pass a different `groups` config.
 *
 * Props:
 *   groups       [{ id, label, type?, options: [{ value, label }] }]
 *                  type: "multi" (default, checkboxes) | "single" (radio — one value per section)
 *   value        { [groupId]: string[] }     controlled selection
 *   defaultValue { [groupId]: string[] }     uncontrolled initial selection
 *   onChange     (selection) => void
 *   label        trigger label                default "Filter"
 *   icon         ReactNode — trigger icon     default a funnel glyph
 *   mode         "live" (default, immediate onChange) | "apply" (stage a draft, fire on Done)
 *   clearLabel   footer / active-bar reset label   default "Clear all"
 *   doneLabel    footer confirm label              default "Done"
 *   width        panel width (CSS length)          default 240px equivalent (min-width)
 *   maxHeight    panel max height (CSS length)     default 360px
 *   className
 */

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { useClickOutside } from "@/src/hooks/ui/use-overlay";
import { Chip } from "@/src/components/atoms/Chip";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { Radio } from "@/src/components/atoms/Radio";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./Filter.module.scss";

// Caret + funnel from the icon CDN (no inline SVG).
const Chevron = () => <TPLibraryIcon name="chevron-down" size={14} className={styles.caret} />;
const FunnelIcon = () => <TPLibraryIcon name="filter-2" size={15} />;

const toLen = (v) => (typeof v === "number" ? `${v}px` : v || undefined);

export function Filter({
  groups = [],
  value,
  defaultValue,
  onChange,
  label = "Filter",
  icon,
  mode = "live",
  clearLabel = "Clear all",
  doneLabel = "Done",
  width,
  maxHeight,
  className,
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || {});
  const committed = isControlled ? value : internal;

  // In "apply" mode, edits accumulate in a draft and only fire onChange on Done.
  const isApply = mode === "apply";
  const [draft, setDraft] = React.useState(committed);

  const [open, setOpen] = React.useState(false);

  // Open/close the panel; opening in apply mode re-seeds the draft from committed.
  const setOpenState = (next) => {
    setOpen((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (isApply && value) setDraft(committed);
      return value;
    });
  };

  // The selection the panel renders from: the live committed value, or the draft.
  const sel = isApply ? draft : committed;

  const commit = (next) => {
    if (isApply) {
      setDraft(next);
      return;
    }
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const apply = () => {
    if (!isControlled) setInternal(draft);
    onChange?.(draft);
    setOpen(false);
  };

  const ref = React.useRef(null);
  const panelId = React.useId();
  useClickOutside(ref, () => setOpen(false), open);

  const toggle = (gid, val) => {
    const group = groups.find((g) => g.id === gid);
    if (group?.type === "single") {
      const cur = sel[gid] || [];
      const next = cur.includes(val) ? [] : [val];
      commit({ ...sel, [gid]: next });
      return;
    }
    const cur = sel[gid] || [];
    const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
    commit({ ...sel, [gid]: next });
  };
  // Active-bar actions operate on the committed selection directly: they always
  // fire onChange (even in apply mode) and keep the draft in sync.
  const commitNow = (next) => {
    if (!isControlled) setInternal(next);
    if (isApply) setDraft(next);
    onChange?.(next);
  };
  const removeChip = (gid, val) => commitNow({ ...committed, [gid]: (committed[gid] || []).filter((v) => v !== val) });
  const clearActive = () => commitNow({});

  // Panel "Clear all" — in apply mode resets the draft (staged), else commits.
  const clearAll = () => commit({});

  const totalSelected = groups.reduce((n, g) => n + (sel[g.id]?.length || 0), 0);

  // Active chips always reflect the committed selection (the draft is panel-only).
  const chips = groups.flatMap((g) =>
    (committed[g.id] || []).map((v) => ({ gid: g.id, value: v, group: g.label, label: g.options.find((o) => o.value === v)?.label ?? v })),
  );

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.bar}>
        <div ref={ref} className={styles.ddRoot}>
          <button
            type="button"
            className={styles.trigger}
            data-active={totalSelected > 0 || undefined}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls={open ? panelId : undefined}
            onClick={() => setOpenState((o) => !o)}
          >
            <span className={styles.triggerIcon}>{icon ?? <FunnelIcon />}</span>
            {label}
            {totalSelected > 0 ? ` (${totalSelected})` : ""}
            <Chevron />
          </button>

          {open && (
            <div
              id={panelId}
              className={styles.panel}
              role="dialog"
              aria-label={label}
              style={{ "--filter-panel-width": toLen(width), "--filter-panel-max-height": toLen(maxHeight) }}
            >
              <div className={styles.sections}>
                {groups.map((g) => {
                  const single = g.type === "single";
                  return (
                    <div key={g.id} className={styles.section}>
                      <div className={styles.sectionTitle}>{g.label}</div>
                      {g.options.map((o) => {
                        const on = (sel[g.id] || []).includes(o.value);
                        const pick = () => toggle(g.id, o.value);
                        return (
                          <div
                            key={o.value}
                            role="option"
                            aria-selected={on}
                            tabIndex={0}
                            className={styles.option}
                            onClick={pick}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } }}
                          >
                            {/* Reuse the Checkbox / Radio atom (decorative — the row owns the click). */}
                            <span className={styles.control} aria-hidden>
                              {single
                                ? <Radio size="sm" checked={on} />
                                : <Checkbox size="sm" checked={on} tabIndex={-1} />}
                            </span>
                            {o.label}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className={styles.panelFooter}>
                <Button variant="ghost" theme="warning" size="sm" onClick={clearAll} disabled={totalSelected === 0}>
                  {clearLabel}
                </Button>
                <Button variant="solid" theme="primary" size="sm" onClick={isApply ? apply : () => setOpen(false)}>
                  {doneLabel}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {chips.length > 0 && (
        <div className={styles.activeBar}>
          <span className={styles.activeLabel}>{label}:</span>
          <div className={styles.chips}>
            {chips.map((c) => (
              <Chip
                key={`${c.gid}:${c.value}`}
                color="primary"
                label={<><span className={styles.chipGroup}>{c.group}:</span> {c.label}</>}
                onDelete={() => removeChip(c.gid, c.value)}
              />
            ))}
          </div>
          <Button variant="ghost" theme="warning" size="sm" onClick={clearActive}>{clearLabel}</Button>
        </div>
      )}
    </div>
  );
}

Filter.displayName = "Filter";
export default Filter;
