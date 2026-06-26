"use client";

/**
 * Command — a ⌘K command palette: a dialog-hosted, searchable, keyboard-navigable
 * action list for fast global navigation/actions (patient search, quick actions).
 *
 * Data-driven: pass `groups` (or flat `items`); the palette filters live as you
 * type (label + keywords), supports ↑/↓/Enter, and runs the item's `onSelect`.
 * Controlled via `open`/`onOpenChange` (wire it to your ⌘K shortcut), or
 * uncontrolled via `defaultOpen` for demos.
 *
 *   <Command open={open} onOpenChange={setOpen} placeholder="Search…" groups={[
 *     { heading: "Patients", items: [{ id, label, icon, keywords, onSelect }] },
 *     { heading: "Actions",  items: [{ id, label, icon, shortcut, onSelect }] },
 *   ]} />
 *
 * Props:
 *   open / defaultOpen / onOpenChange   controlled/uncontrolled palette state
 *   groups   [{ heading?, items: [{ id, label, icon?, shortcut?, keywords?, onSelect, disabled? }] }]
 *   items    flat [{ … }] convenience (one unlabeled group)
 *   placeholder, emptyText, label (aria), className
 */

import * as React from "react";
import * as Dialog from "@/src/hooks/ui/DialogPrimitive";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Command.module.scss";

const norm = (s) => String(s ?? "").toLowerCase().trim();
const matches = (item, q) => {
  if (!q) return true;
  const hay = `${norm(item.label)} ${norm((item.keywords || []).join(" "))}`;
  return hay.includes(q);
};

export const Command = React.forwardRef(function Command({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  groups,
  items,
  placeholder = "Type a command or search…",
  emptyText = "No results found.",
  label = "Command palette",
  className,
  ...rest
}, ref) {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp : internalOpen;
  const setOpen = React.useCallback(
    (v) => {
      setInternalOpen((prev) => {
        const next = typeof v === "function" ? v(isControlled ? openProp : prev) : v;
        onOpenChange?.(next);
        return isControlled ? prev : next;
      });
    },
    [isControlled, openProp, onOpenChange],
  );

  const resolvedGroups = groups ?? (items ? [{ items }] : []);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) { const t = setTimeout(() => inputRef.current?.focus(), 20); return () => clearTimeout(t); }
    return undefined;
  }, [open]);

  const q = norm(query);
  const filtered = resolvedGroups
    .map((g) => ({ ...g, items: (g.items || []).filter((it) => matches(it, q)) }))
    .filter((g) => g.items.length > 0);
  const flat = filtered.flatMap((g) => g.items);

  const closeAndReset = () => { setOpen(false); setQuery(""); };
  const run = (item) => { if (!item || item.disabled) return; item.onSelect?.(item); closeAndReset(); };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(flat[active]); }
  };

  let idx = -1;
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
      {open && (
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content ref={ref} aria-label={label} className={cn(styles.palette, className)} onKeyDown={onKeyDown} {...rest}>
            <div className={styles.searchRow}>
              <TPLibraryIcon name="search-normal" size={18} className={styles.searchIcon} aria-hidden />
              <input
                ref={inputRef}
                className={styles.input}
                placeholder={placeholder}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                role="combobox"
                aria-expanded="true"
                aria-controls="tesseract-command-list"
                aria-label="Command search"
              />
            </div>
            <div id="tesseract-command-list" role="listbox" className={styles.list}>
              {flat.length === 0 ? (
                <div className={styles.empty}>{emptyText}</div>
              ) : (
                filtered.map((g, gi) => (
                  <div key={g.heading ?? gi} className={styles.group} role="group" aria-label={g.heading}>
                    {g.heading && <div className={styles.groupLabel}>{g.heading}</div>}
                    {g.items.map((item) => {
                      idx += 1;
                      const here = idx;
                      const isActive = here === active;
                      return (
                        <div
                          key={item.id ?? item.label}
                          role="option"
                          aria-selected={isActive}
                          data-active={isActive || undefined}
                          data-disabled={item.disabled || undefined}
                          className={styles.item}
                          onMouseEnter={() => setActive(here)}
                          onClick={() => run(item)}
                        >
                          {item.icon != null && (
                            <span className={styles.itemIcon} aria-hidden>
                              {typeof item.icon === "string" ? <TPLibraryIcon name={item.icon} size={16} /> : item.icon}
                            </span>
                          )}
                          <span className={styles.itemLabel}>{item.label}</span>
                          {item.shortcut && <span className={styles.itemShortcut}>{item.shortcut}</span>}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
});

Command.displayName = "Command";
export default Command;
