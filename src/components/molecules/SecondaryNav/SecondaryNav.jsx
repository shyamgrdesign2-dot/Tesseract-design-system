"use client";

/**
 * SecondaryNav — the RxPad secondary navigation rail (the blue rail).
 * In-house; reuses the TP icon library (TPLibraryIcon) + the Badge atom (signal
 * dot). 80px blue-gradient rail of icon-pill-over-label items. The icon pill is
 * a translucent white chip at rest and turns SOLID WHITE with a blue icon when
 * active; the active row also gets a white tint + a 3px white left bar.
 *
 * Props:
 *   items    [{ id, label, icon, signal?, disabled? }]
 *              icon   — TP library icon NAME (string) or a ReactNode
 *              signal — boolean → red notification dot on the pill
 *   activeId   id of the active item (controlled)
 *   onSelect   (id) => void
 *   width      rail width in px                                   default 80
 *   className
 */

import * as React from "react";
import { Badge } from "@/src/components/atoms/Badge";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./SecondaryNav.module.scss";

function PillIcon({ icon, active }) {
  if (typeof icon === "string") {
    // Selected → bulk (two-tone) style in blue; rest → linear in white.
    return <TPLibraryIcon name={icon} variant={active ? "bulk" : "linear"} size={20} color={active ? "var(--tp-blue-500, #4b4ad5)" : "#ffffff"} />;
  }
  return icon ?? null;
}

export function SecondaryNav({ items = [], activeId, onSelect, width, className }) {
  return (
    <nav
      className={cn(styles.rail, className)}
      style={width ? { width, minWidth: width, maxWidth: width, flexBasis: width } : undefined}
      aria-label="Secondary"
    >
      <div className={styles.scroll}>
        {items.map((it) => {
          const active = it.id === activeId;
          const select = () => !it.disabled && onSelect?.(it.id);
          return (
            <button
              key={it.id}
              type="button"
              className={styles.item}
              data-active={active || undefined}
              data-disabled={it.disabled || undefined}
              aria-current={active ? "page" : undefined}
              disabled={it.disabled}
              onClick={select}
            >
              <span className={styles.inner}>
                <span className={styles.pill} data-active={active || undefined}>
                  <PillIcon icon={it.icon} active={active} />
                  {it.signal && <span className={styles.signal}><Badge variant="dot" color="error" size="md" /></span>}
                </span>
                <span className={styles.label}>{it.label}</span>
              </span>
              {active && <span className={styles.bar} aria-hidden />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

SecondaryNav.displayName = "SecondaryNav";
export default SecondaryNav;
