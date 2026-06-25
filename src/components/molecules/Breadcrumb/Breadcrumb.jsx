"use client";

/**
 * Breadcrumb — wayfinding for deep navigation (Patients › Ramesh Kumar › Visit).
 *
 * Data-driven (config over markup, per the Tesseract standard): pass `items`, each
 * a crumb. The last item is the current page (rendered as text with aria-current);
 * earlier items are links (real <a> when `href`, else a <button> if `onClick`,
 * else plain text). Long trails collapse to first … last via `maxItems`.
 *
 *   <Breadcrumb items={[
 *     { label: "Patients", href: "/patients", icon: "user" },
 *     { label: "Ramesh Kumar", href: "/patients/123" },
 *     { label: "Visit — 24 Jun" },                // current page (no href)
 *   ]} />
 *
 * Props:
 *   items      [{ label, href?, onClick?, icon? }]  — last = current page
 *   separator  icon name | node                     glyph between crumbs (default "arrow-right3")
 *   maxItems   number — collapse the middle to "…" when the trail is longer
 *   size       "sm" | "md"                          default "md"
 *   className, …rest (spread to the <nav>)
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Breadcrumb.module.scss";

const Sep = ({ separator }) =>
  typeof separator === "string"
    ? <TPLibraryIcon name={separator} size={14} className={styles.sep} aria-hidden />
    : <span className={styles.sep} aria-hidden>{separator}</span>;

const Glyph = ({ icon }) =>
  icon == null ? null : (
    <span className={styles.crumbIcon} aria-hidden>
      {typeof icon === "string" ? <TPLibraryIcon name={icon} size={15} /> : icon}
    </span>
  );

export const Breadcrumb = React.forwardRef(function Breadcrumb(
  { items = [], separator = "arrow-right3", maxItems, size = "md", className, ...rest },
  ref,
) {
  // Collapse the middle to an ellipsis crumb when longer than maxItems
  // (keep the first crumb + the last two for context).
  let crumbs = items;
  if (typeof maxItems === "number" && maxItems >= 2 && items.length > maxItems) {
    crumbs = [items[0], { ellipsis: true }, ...items.slice(items.length - (maxItems - 1))];
  }

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn(styles.root, className)} data-size={size} {...rest}>
      <ol className={styles.list}>
        {crumbs.map((it, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className={styles.item}>
              {it.ellipsis ? (
                <span className={styles.ellipsis} title={items.slice(1, items.length - (maxItems - 1)).map((c) => c.label).join(" › ")}>…</span>
              ) : isLast ? (
                <span className={styles.current} aria-current="page"><Glyph icon={it.icon} />{it.label}</span>
              ) : it.href != null ? (
                <a href={it.href} className={styles.link} onClick={it.onClick}><Glyph icon={it.icon} />{it.label}</a>
              ) : it.onClick ? (
                <button type="button" className={styles.link} onClick={it.onClick}><Glyph icon={it.icon} />{it.label}</button>
              ) : (
                <span className={styles.link} data-static><Glyph icon={it.icon} />{it.label}</span>
              )}
              {!isLast && <Sep separator={separator} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = "Breadcrumb";
export default Breadcrumb;
