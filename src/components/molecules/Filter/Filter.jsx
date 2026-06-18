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
 *   groups       [{ id, label, options: [{ value, label }] }]
 *   value        { [groupId]: string[] }     controlled selection
 *   defaultValue { [groupId]: string[] }     uncontrolled initial selection
 *   onChange     (selection) => void
 *   label        trigger label                default "Filter"
 *   icon         ReactNode — trigger icon     default a funnel glyph
 *   className
 */

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { useClickOutside } from "@/src/hooks/ui/use-overlay";
import { Chip } from "@/src/components/atoms/Chip";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./Filter.module.scss";

// Caret + funnel from the icon CDN (no inline SVG).
const Chevron = () => <TPLibraryIcon name="chevron-down" size={14} className={styles.caret} />;
const FunnelIcon = () => <TPLibraryIcon name="filter-2" size={15} />;

export function Filter({ groups = [], value, defaultValue, onChange, label = "Filter", icon, className }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || {});
  const sel = isControlled ? value : internal;
  const commit = (next) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  const toggle = (gid, val) => {
    const cur = sel[gid] || [];
    const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
    commit({ ...sel, [gid]: next });
  };
  const removeChip = (gid, val) => commit({ ...sel, [gid]: (sel[gid] || []).filter((v) => v !== val) });
  const clearAll = () => commit({});

  const totalSelected = groups.reduce((n, g) => n + (sel[g.id]?.length || 0), 0);

  const chips = groups.flatMap((g) =>
    (sel[g.id] || []).map((v) => ({ gid: g.id, value: v, group: g.label, label: g.options.find((o) => o.value === v)?.label ?? v })),
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
            onClick={() => setOpen((o) => !o)}
          >
            <span className={styles.triggerIcon}>{icon ?? <FunnelIcon />}</span>
            {label}
            {totalSelected > 0 ? ` (${totalSelected})` : ""}
            <Chevron />
          </button>

          {open && (
            <div className={styles.panel} role="dialog" aria-label={label}>
              <div className={styles.sections}>
                {groups.map((g) => (
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
                          {/* Reuse the Checkbox atom (decorative — the row owns the click). */}
                          <span className={styles.control} aria-hidden>
                            <Checkbox size="sm" checked={on} tabIndex={-1} />
                          </span>
                          {o.label}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className={styles.panelFooter}>
                <Button variant="ghost" theme="warning" size="sm" onClick={clearAll} disabled={totalSelected === 0}>
                  Clear all
                </Button>
                <Button variant="solid" theme="primary" size="sm" onClick={() => setOpen(false)}>
                  Done
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
          <Button variant="ghost" theme="warning" size="sm" onClick={clearAll}>Clear all</Button>
        </div>
      )}
    </div>
  );
}

Filter.displayName = "Filter";
export default Filter;
