"use client";

/**
 * Sidebar — the primary navigation rail (home / appointment / RxPad shells).
 * In-house, no external deps. Vertical rail of icon-over-label items with an
 * active blue indicator bar; because the icon atoms render in currentColor, the
 * active item only sets `color` and the icon follows automatically.
 *
 * Props:
 *   items    [{ id, label, icon: ReactNode, badge?: "trial" | ReactNode, disabled? }]
 *   activeId   id of the active item (controlled)
 *   onSelect   (id) => void
 *   logo       ReactNode pinned to the top
 *   footer     ReactNode pinned to the bottom (e.g. avatar / settings)
 *   width      rail width in px                                   default 100
 *   className
 */

import * as React from "react";
import { Badge } from "@/src/components/atoms/Badge";
import { cn } from "@/src/hooks/utils";
import styles from "./Sidebar.module.scss";

export function Sidebar({ items = [], activeId, onSelect, logo, footer, width, className }) {
  return (
    <nav
      className={cn(styles.rail, className)}
      style={width ? { width, maxWidth: width } : undefined}
      aria-label="Primary"
    >
      {logo != null && <div className={styles.logo}>{logo}</div>}

      <div className={styles.items}>
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
              <span className={styles.icon}>{it.icon}</span>
              <span className={styles.label}>{it.label}</span>
              {it.badge != null && (
                <span className={styles.badge}>
                  {it.badge === "trial" ? <Badge variant="soft" color="warning" size="sm">Trial</Badge> : it.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {footer != null && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
}

Sidebar.displayName = "Sidebar";
export default Sidebar;
