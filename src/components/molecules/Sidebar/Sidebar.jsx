"use client";

/**
 * Sidebar — the primary 80px navigation rail (VoiceRx redesign).
 * In-house, no external deps.
 *
 * Each item is an icon "chip" (32×32 rounded square) over a label. The chip is
 * grey (slate-100) at rest and blue (blue-500) when active; the icon itself is a
 * TP library icon that renders LINEAR at rest and BOLD when active, tinting to
 * slate-700 / white via the `color` prop. Active items also get a faint blue row
 * tint and a 3px rounded left indicator bar. An optional Trial tag is pinned to
 * the right edge, vertically centered on the icon.
 *
 * Props:
 *   items    [{ id, label, icon, badge?, disabled? }]
 *              icon  — TP library icon NAME (string) → switches linear/bold on
 *                      active; or a ReactNode escape hatch (no switch).
 *              badge — "trial" (orange gradient tag) | ReactNode
 *   activeId   id of the active item (controlled)
 *   onSelect   (id) => void
 *   width      rail width in px                                   default 80
 *   bottomFade show the bottom white fade overlay                 default true
 *   logo       optional ReactNode pinned to the top (off by default)
 *   footer     optional ReactNode pinned to the bottom (off by default)
 *   className
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Sidebar.module.scss";

function ItemIcon({ icon, active }) {
  if (typeof icon === "string") {
    return (
      <TPLibraryIcon
        name={icon}
        variant={active ? "bold" : "linear"}
        size={20}
        color={active ? "var(--tp-slate-0, #fff)" : "var(--tp-slate-700, #454551)"}
      />
    );
  }
  return icon ?? null;
}

export function Sidebar({ items = [], activeId, onSelect, width, bottomFade = true, logo, footer, className }) {
  return (
    <nav
      className={cn(styles.rail, className)}
      style={width ? { width, minWidth: width, maxWidth: width } : undefined}
      aria-label="Primary"
    >
      {logo != null && <div className={styles.logo}>{logo}</div>}

      <div className={styles.scroll}>
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <button
              key={it.id}
              type="button"
              className={styles.item}
              data-active={active || undefined}
              data-disabled={it.disabled || undefined}
              aria-current={active ? "page" : undefined}
              disabled={it.disabled}
              onClick={() => !it.disabled && onSelect?.(it.id)}
            >
              <span className={styles.body}>
                <span className={styles.iconChip}>
                  <ItemIcon icon={it.icon} active={active} />
                </span>
                <span
                  className={styles.label}
                  data-multiline={typeof it.label === "string" && it.label.trim().includes(" ") ? "" : undefined}
                >
                  {it.label}
                </span>
              </span>

              {active && <span className={styles.bar} aria-hidden />}
              {it.badge === "trial"
                ? <span className={styles.trial}>Trial</span>
                : it.badge != null && <span className={styles.badge}>{it.badge}</span>}
            </button>
          );
        })}
        {bottomFade && <div className={styles.spacer} aria-hidden />}
      </div>

      {footer != null && <div className={styles.footer}>{footer}</div>}
      {bottomFade && <div className={styles.fade} aria-hidden />}
    </nav>
  );
}

Sidebar.displayName = "Sidebar";
export default Sidebar;
