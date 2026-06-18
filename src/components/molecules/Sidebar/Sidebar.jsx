"use client";

/**
 * Sidebar — the primary 80px navigation rail (VoiceRx redesign).
 * First-party, composed from atoms (Button for the icon chip, Badge for tags).
 *
 * Each item is an icon "chip" over a label. The chip reuses the Button atom in
 * icon-only mode: tonal/neutral (grey) at rest, solid/primary (blue) when
 * active. The icon is a Tesseract library icon that renders LINEAR at rest and BOLD
 * when active, inheriting the chip's text color (slate-700 → white) via
 * currentColor. Active rows get a faint blue tint + a 3px rounded left bar.
 *
 * The row itself is the click target (role="button"); the inner Button chip is
 * decorative (aria-hidden, not tab-focusable) so there are no nested tab stops.
 *
 * Props:
 *   items    [{ id, label, icon, badge?, disabled? }]
 *              icon  — Tesseract library icon NAME (string, switches linear/bold) OR a
 *                      ReactNode escape hatch.
 *              badge — "trial" (gradient/warning Badge) | { text, variant?, color? }
 *                      | ReactNode. Reuses the Badge atom.
 *   activeId   id of the active item (controlled)
 *   onSelect   (id) => void
 *   width      rail width in px                                   default 80
 *   bottomFade show the bottom white fade overlay                 default true
 *   logo / footer  optional ReactNodes (off by default)
 *   className
 */

import * as React from "react";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Sidebar.module.scss";

function ItemIcon({ icon, active }) {
  if (typeof icon === "string") {
    // No color → inherits the chip's currentColor (slate-700 rest / white active).
    // Selected state uses the bulk (two-tone) style; rest is linear.
    return <TPLibraryIcon name={icon} variant={active ? "bulk" : "linear"} size={20} />;
  }
  return icon ?? null;
}

function ItemBadge({ badge }) {
  if (badge == null) return null;
  let cfg = badge;
  if (badge === "trial") cfg = { text: "Trial", variant: "gradient", color: "warning", sticky: "right" };
  if (cfg && typeof cfg === "object" && cfg.text != null) {
    return (
      <span className={styles.badgeSlot}>
        <Badge variant={cfg.variant || "gradient"} color={cfg.color || "warning"} size="xs" sticky={cfg.sticky}>{cfg.text}</Badge>
      </span>
    );
  }
  return <span className={styles.badgeSlot}>{badge}</span>;
}

export function Sidebar({ items = [], activeId, onSelect, width, bottomFade = true, logo, footer, className }) {
  return (
    <nav
      className={cn(styles.rail, className)}
      style={width ? { width } : undefined}
      aria-label="Primary"
    >
      {logo != null && <div className={styles.logo}>{logo}</div>}

      <div className={styles.scroll}>
        {items.map((it) => {
          const active = it.id === activeId;
          const select = () => !it.disabled && onSelect?.(it.id);
          return (
            <div
              key={it.id}
              role="button"
              tabIndex={it.disabled ? -1 : 0}
              className={styles.item}
              data-active={active || undefined}
              data-disabled={it.disabled || undefined}
              aria-current={active ? "page" : undefined}
              aria-disabled={it.disabled || undefined}
              onClick={select}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); } }}
            >
              <span className={styles.body}>
                {/* Icon chip reuses the Button atom (icon-only). Decorative — the
                    row owns the click — so it's aria-hidden and not tab-focusable. */}
                <Button
                  className={styles.chip}
                  aria-hidden
                  tabIndex={-1}
                  size="sm"
                  variant={active ? "solid" : "tonal"}
                  theme={active ? "primary" : "neutral"}
                  icon={<ItemIcon icon={it.icon} active={active} />}
                  style={{ width: "var(--tp-size-32)", height: "var(--tp-size-32)" }}
                />
                <span className={styles.label}>
                  <span
                    className={styles.labelText}
                    data-multiline={typeof it.label === "string" && it.label.trim().includes(" ") ? "" : undefined}
                  >
                    {it.label}
                  </span>
                </span>
              </span>

              {active && <span className={styles.bar} aria-hidden />}
              <ItemBadge badge={it.badge} />
            </div>
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
