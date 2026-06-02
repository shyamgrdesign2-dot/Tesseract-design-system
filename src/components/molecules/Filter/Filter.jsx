"use client";

/**
 * Filter — chip-based multi-select filter bar. In-house, no external deps.
 *
 * Each filter group is a dropdown of options; chosen options appear as removable
 * chips below the bar. Pairs with DataTable (filter the data by the selection),
 * and the group set changes per table — just pass a different `groups` config.
 *
 * Props:
 *   groups       [{ id, label, options: [{ value, label }] }]
 *   value        { [groupId]: string[] }     controlled selection
 *   defaultValue { [groupId]: string[] }     uncontrolled initial selection
 *   onChange     (selection) => void
 *   className
 */

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { useClickOutside } from "@/src/hooks/ui/use-overlay";
import { Chip } from "@/src/components/atoms/Chip";
import styles from "./Filter.module.scss";

function Chevron() {
  return (
    <svg className={styles.caret} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FilterDropdown({ group, selected, onToggle }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className={styles.ddRoot}>
      <button
        type="button"
        className={styles.trigger}
        data-active={selected.length > 0 || undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        {group.icon != null && <span className={styles.triggerIcon}>{group.icon}</span>}
        {group.label}
        {selected.length > 0 ? ` (${selected.length})` : ""}
        <Chevron />
      </button>
      {open && (
        <div className={styles.menu} role="listbox" aria-multiselectable="true">
          {group.options.map((o) => {
            const on = selected.includes(o.value);
            return (
              <button key={o.value} type="button" className={styles.option} role="option" aria-selected={on} onClick={() => onToggle(o.value)}>
                <span className={styles.check} data-on={on || undefined}>
                  {on && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Filter({ groups = [], value, defaultValue, onChange, className }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || {});
  const sel = isControlled ? value : internal;
  const commit = (next) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const toggle = (gid, val) => {
    const cur = sel[gid] || [];
    const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
    commit({ ...sel, [gid]: next });
  };
  const removeChip = (gid, val) => commit({ ...sel, [gid]: (sel[gid] || []).filter((v) => v !== val) });
  const clearAll = () => commit({});

  const chips = groups.flatMap((g) =>
    (sel[g.id] || []).map((v) => ({ gid: g.id, value: v, group: g.label, label: g.options.find((o) => o.value === v)?.label ?? v })),
  );

  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.bar}>
        {groups.map((g) => (
          <FilterDropdown key={g.id} group={g} selected={sel[g.id] || []} onToggle={(v) => toggle(g.id, v)} />
        ))}
      </div>

      {chips.length > 0 && (
        <div className={styles.activeBar}>
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
          <button type="button" className={styles.clear} onClick={clearAll}>Clear all</button>
        </div>
      )}
    </div>
  );
}

Filter.displayName = "Filter";
export default Filter;
