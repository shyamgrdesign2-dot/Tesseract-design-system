"use client";

/**
 * Pagination — page navigation (pairs with DataTable, lists, audit logs).
 *
 * Controlled: pass the 0-indexed `page` + `pageCount` + `onPageChange`. Composes
 * the Button atom for prev / next / page buttons; long ranges collapse to first …
 * window … last around the current page.
 *
 *   <Pagination page={p} pageCount={12} onPageChange={setP} />
 *
 * Props:
 *   page         number  — current page, 0-indexed
 *   pageCount    number  — total pages
 *   onPageChange (page) => void
 *   siblingCount number  — pages shown on each side of current (default 1)
 *   size         "sm" | "md"                       default "md"
 *   className, style, …rest (spread to the <nav>)
 */

import * as React from "react";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Pagination.module.scss";

const ELLIPSIS = "…";

// Build the 0-indexed page list with first/last anchored and an ellipsis where
// the window doesn't reach the edges.
function pageList(page, count, sibling) {
  const window = sibling * 2 + 5; // first + last + current + 2 siblings + 2 ellipsis slots
  if (count <= window) return Array.from({ length: count }, (_, i) => i);
  const left = Math.max(page - sibling, 1);
  const right = Math.min(page + sibling, count - 2);
  const out = [0];
  if (left > 1) out.push(ELLIPSIS);
  for (let i = left; i <= right; i++) out.push(i);
  if (right < count - 2) out.push(ELLIPSIS);
  out.push(count - 1);
  return out;
}

export const Pagination = React.forwardRef(function Pagination(
  { page = 0, pageCount = 1, onPageChange, siblingCount = 1, size = "md", className, ...rest },
  ref,
) {
  const go = (p) => { if (p >= 0 && p < pageCount && p !== page) onPageChange?.(p); };
  const px = size === "sm" ? 16 : 18;
  const minW = size === "sm" ? 32 : 36;
  const items = pageList(page, Math.max(1, pageCount), siblingCount);

  return (
    <nav ref={ref} aria-label="Pagination" className={cn(styles.root, className)} data-size={size} {...rest}>
      <Button
        variant="ghost" theme="neutral" size={size}
        icon={<TPLibraryIcon name="arrow-left3" corner="straight" size={px} />}
        aria-label="Previous page" disabled={page <= 0} onClick={() => go(page - 1)}
      />
      {items.map((p, i) =>
        p === ELLIPSIS ? (
          <span key={`e${i}`} className={styles.ellipsis} aria-hidden>{ELLIPSIS}</span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "tonal" : "ghost"}
            theme={p === page ? "primary" : "neutral"}
            size={size}
            aria-label={`Page ${p + 1}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => go(p)}
            style={{ minWidth: minW }}
          >
            {p + 1}
          </Button>
        ),
      )}
      <Button
        variant="ghost" theme="neutral" size={size}
        icon={<TPLibraryIcon name="arrow-right3" corner="straight" size={px} />}
        aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => go(page + 1)}
      />
    </nav>
  );
});

Pagination.displayName = "Pagination";
export default Pagination;
