"use client";

/**
 * DataTable — the single, configurable table molecule for list surfaces.
 *
 * Column-config driven with table-level knobs. In-house, no external deps.
 *
 * Table props:
 *   columns, data
 *   rowKey       (row, i) => key
 *   rowHeight    "xs"|"sm"|"md"|"lg"|"xl"  density          default "lg"
 *   stickyHeader boolean   header sticks on vertical scroll  default false
 *                (auto-applies a maxHeight so there's something to scroll)
 *   maxHeight    number|string  vertical scroll cap
 *   zebra        boolean   alternating row stripes           default false
 *   hoverable    boolean   row hover                         default true
 *   sortable     boolean   show sort affordances (per-col `sortable` opts in)
 *   defaultSort  { id, dir: "asc"|"desc" }
 *   onSortChange (sort) => void
 *   pageSize     number    enables pagination when set
 *   loading      boolean   shows a loading row (lazy fetch)
 *   hasMore      boolean   more rows exist to lazy-load
 *   onLoadMore   ()=>void  called when scrolled near the bottom
 *   emptyState   ReactNode
 *
 * Column object:
 *   { id, header, width?, minWidth?, maxWidth?, align?, headerAlign?, sticky?: "right",
 *     sortable?: boolean, sortAccessor?: (row) => comparable,
 *     headerClassName?, cellClassName?, cell: (row, i) => ReactNode }
 *   Headers are left-aligned by default (set `headerAlign` to override); `align`
 *   only affects the body cells.
 *
 * Rich cells: use <DataCell> for primary/secondary text with optional left/right
 * icons per line. Truncation rule: with subtext the primary clamps to ONE line;
 * without subtext it clamps to TWO; subtext clamps to one. Overflow → tooltip.
 */

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import { Tooltip } from "@/src/components/molecules/Tooltip";
import { Badge } from "@/src/components/atoms/Badge";
import { Chip } from "@/src/components/atoms/Chip";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import styles from "./DataTable.module.scss";

// Badge tones map 1:1; Chip uses "default" where Badge uses "neutral".
const CHIP_COLOR = { neutral: "default", primary: "primary", success: "success", warning: "warning", error: "error" };

// ── Sort icon (TP up/down "sort" glyph) — the active direction's arrow is
// highlighted: ascending → top arrow, descending → bottom arrow; idle → both faint.
function SortIcon() {
  return (
    <svg className={styles.sortGlyph} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path className={styles.sortUp} d="M12.1549 1.1543C12.2028 1.15981 12.2473 1.16678 12.2867 1.1748L12.4547 1.21777L12.5572 1.25391C12.7055 1.3175 12.8612 1.41698 13.0025 1.56738L13.0045 1.56543L19.9146 8.47559C20.1591 8.7201 20.2325 9.08779 20.1002 9.40723C19.9679 9.72668 19.6559 9.93452 19.3102 9.93457H4.69004C4.34423 9.93457 4.03234 9.72672 3.9 9.40723C3.76768 9.08776 3.84106 8.72011 4.08555 8.47559L10.9957 1.56543L11.0699 1.49512C11.157 1.41763 11.2817 1.32304 11.443 1.25391L11.5963 1.19922C11.7452 1.15616 11.8828 1.14456 11.9996 1.14453L12.1549 1.1543Z" />
      <path className={styles.sortDown} d="M11.8454 22.8457C11.7974 22.8402 11.753 22.8332 11.7135 22.8252L11.5456 22.7822L11.443 22.7461C11.2947 22.6825 11.1391 22.583 10.9977 22.4326L10.9958 22.4346L4.08559 15.5244C3.84116 15.2799 3.76776 14.9122 3.90005 14.5928C4.03237 14.2733 4.34432 14.0655 4.69009 14.0654L19.3102 14.0654C19.656 14.0654 19.9679 14.2733 20.1002 14.5928C20.2326 14.9122 20.1592 15.2799 19.9147 15.5244L13.0045 22.4346L12.9303 22.5049C12.8433 22.5824 12.7185 22.677 12.5573 22.7461L12.404 22.8008C12.2551 22.8438 12.1175 22.8554 12.0006 22.8555L11.8454 22.8457Z" />
    </svg>
  );
}

// ── Rich cell ────────────────────────────────────────────────────────────────
function ClampText({ children, lines = 2, className, side = "top" }) {
  return (
    <Tooltip content={children} whenTruncated side={side} sideOffset={8}>
      <span className={cn(styles.clamp, className)} style={{ WebkitLineClamp: lines }}>
        {children}
      </span>
    </Tooltip>
  );
}

/**
 * DataCell — primary line (+ optional subtext), each with optional left/right
 * icons. With subtext the primary truncates at 1 line; without subtext at 2.
 */
export function DataCell({
  primary,
  secondary,
  primaryLeftIcon,
  primaryRightIcon,
  secondaryLeftIcon,
  secondaryRightIcon,
  maxLines,
  align = "left",
  tooltipSide = "top",
  className,
}) {
  const hasSecondary = secondary != null && secondary !== "";
  const primaryLines = maxLines ?? (hasSecondary ? 1 : 2);
  return (
    <div className={cn(styles.cell, className)} data-align={align}>
      <div className={styles.cellLine}>
        {primaryLeftIcon != null && <span className={styles.cellIcon}>{primaryLeftIcon}</span>}
        <ClampText lines={primaryLines} className={styles.primary} side={tooltipSide}>{primary}</ClampText>
        {primaryRightIcon != null && <span className={styles.cellIcon}>{primaryRightIcon}</span>}
      </div>
      {hasSecondary && (
        <div className={styles.cellLine}>
          {secondaryLeftIcon != null && <span className={styles.cellIcon}>{secondaryLeftIcon}</span>}
          <ClampText lines={1} className={styles.secondary} side={tooltipSide}>{secondary}</ClampText>
          {secondaryRightIcon != null && <span className={styles.cellIcon}>{secondaryRightIcon}</span>}
        </div>
      )}
    </div>
  );
}
DataCell.displayName = "DataCell";

/** CellTag — status pill for `type: "tag"` columns. tone: neutral|primary|success|warning|error
 *
 *  Two flavours:
 *   • non-actionable (default) → Badge atom (soft) — a static label.
 *   • actionable (`actionable`/`onClick`) → Chip atom — gains a hover + click
 *     (press) effect and is keyboard/clickable. Use for filter-style tags.
 *  Optional leading `icon`. */
export function CellTag({ label, tone = "neutral", actionable = false, onClick, icon, variant = "soft" }) {
  if (actionable || onClick) {
    return (
      <Chip
        label={label}
        color={CHIP_COLOR[tone] ?? "default"}
        variant={variant}
        size="sm"
        icon={icon}
        onClick={onClick || (() => {})}
        className={styles.actionableTag}
      />
    );
  }
  return <Badge variant={variant} color={tone}>{label}</Badge>;
}
CellTag.displayName = "CellTag";

// Declarative cell rendering — driven by `col.type` so columns map straight onto
// backend data. `col.cell(row, i)` is always the escape hatch when present.
//   type: "text"   → primary (+ optional secondary), icons, truncation rules
//   type: "tag"    → col.tag(row) → { label, tone, actionable?, icon?, onClick? }
//                    | array of them. actionable/onClick → Chip (hover+press);
//                    otherwise a static Badge.
//   type: "action" → col.actions(row, i)
function renderCell(col, row, i) {
  if (typeof col.cell === "function") return col.cell(row, i);
  const resolve = (v) => (typeof v === "function" ? v(row, i) : v);
  const type = col.type || "text";

  if (type === "tag") {
    const t = col.tag ? col.tag(row, i) : null;
    if (!t) return null;
    return Array.isArray(t)
      ? <div className={styles.tagRow}>{t.map((x, k) => <CellTag key={k} {...x} />)}</div>
      : <CellTag {...t} />;
  }
  if (type === "action") {
    return col.actions ? col.actions(row, i) : null;
  }
  // text / text + subtext
  return (
    <DataCell
      primary={col.primary ? col.primary(row, i) : row[col.id]}
      secondary={col.secondary ? col.secondary(row, i) : undefined}
      primaryLeftIcon={resolve(col.leftIcon)}
      primaryRightIcon={resolve(col.rightIcon)}
      secondaryLeftIcon={resolve(col.subLeftIcon)}
      secondaryRightIcon={resolve(col.subRightIcon)}
      maxLines={col.maxLines}
      align={col.align}
    />
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function pageList(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);
  const out = [0];
  const start = Math.max(1, page - 1);
  const end = Math.min(count - 2, page + 1);
  if (start > 1) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < count - 2) out.push("…");
  out.push(count - 1);
  return out;
}

function Pagination({ page, pageCount, total, pageSize, sizeOptions, onPageSize, onPage }) {
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);
  return (
    <div className={styles.pagination}>
      {/* Left: rows-per-page + the range showing */}
      <div className={styles.pageLeft}>
        {sizeOptions && sizeOptions.length > 1 && (
          <label className={styles.rpp}>
            <span>Rows</span>
            <span className={styles.rppSelectWrap}>
              <select className={styles.rppSelect} value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))} aria-label="Rows per page">
                {sizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <svg className={styles.rppCaret} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
            </span>
          </label>
        )}
        <span className={styles.pageInfo}>{total === 0 ? "0 results" : `${from}–${to} of ${total}`}</span>
      </div>

      {/* Right: page navigation (neutral) */}
      <div className={styles.pager}>
        <button type="button" className={styles.pageNav} disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
        </button>
        {pageList(page, pageCount).map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className={styles.ellipsis}>…</span>
          ) : (
            <button key={p} type="button" className={styles.pageBtn} data-active={p === page} aria-current={p === page ? "page" : undefined} onClick={() => onPage(p)}>
              {p + 1}
            </button>
          ),
        )}
        <button type="button" className={styles.pageNav} disabled={page >= pageCount - 1} onClick={() => onPage(page + 1)} aria-label="Next page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────
export function DataTable({
  columns,
  data,
  rowKey = (row, i) => row?.id ?? i,
  emptyState = null,
  rowClassName,
  className,
  rowHeight = "lg",
  stickyHeader = false,
  maxHeight,
  zebra = false,
  hoverable = true,
  sortable = false,
  defaultSort = null,
  onSortChange,
  pageSize,
  pageSizeOptions,
  loading = false,
  hasMore = false,
  onLoadMore,
  lazyRows = 3,
  selectable = false,
  selectedKeys,
  onSelectionChange,
}) {
  const [sort, setSort] = React.useState(defaultSort);
  const [page, setPage] = React.useState(0);
  const [ps, setPs] = React.useState(pageSize);
  // Sync internal rows-per-page when the pageSize prop changes — done during
  // render (React's "adjust state on prop change" pattern) rather than an effect.
  const [prevPageSize, setPrevPageSize] = React.useState(pageSize);
  if (pageSize !== prevPageSize) {
    setPrevPageSize(pageSize);
    setPs(pageSize);
  }
  // Rows-per-page choices (always includes the current size).
  const sizeOptions = React.useMemo(() => {
    const base = pageSizeOptions && pageSizeOptions.length ? pageSizeOptions : [10, 20, 50, 100];
    return Array.from(new Set([...(pageSize ? [pageSize] : []), ...base])).sort((a, b) => a - b);
  }, [pageSizeOptions, pageSize]);

  // Sorting
  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.id === sort.id);
    if (!col) return data;
    const acc = col.sortAccessor || ((row) => row?.[col.id]);
    const dir = sort.dir === "desc" ? -1 : 1;
    return [...data].sort((a, b) => {
      const va = acc(a), vb = acc(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir;
    });
  }, [data, sort, columns]);

  // Pagination (ps = current rows-per-page, chosen via the selector)
  const pageCount = ps ? Math.max(1, Math.ceil(sorted.length / ps)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  // Clamp the page during render when the data/page-size shrinks the range.
  if (page > safePage) setPage(safePage);
  const rows = ps ? sorted.slice(safePage * ps, (safePage + 1) * ps) : sorted;

  // ── Row selection (optional leading checkbox column) ──
  const selControlled = selectedKeys !== undefined;
  const [internalSel, setInternalSel] = React.useState(() => new Set());
  const selectedSet = selControlled ? new Set(selectedKeys) : internalSel;
  const setSelection = (nextSet) => {
    if (!selControlled) setInternalSel(nextSet);
    onSelectionChange?.([...nextSet]);
  };
  const allKeys = React.useMemo(() => sorted.map((r, i) => rowKey(r, i)), [sorted, rowKey]);
  const selectedCount = allKeys.filter((k) => selectedSet.has(k)).length;
  const allSelected = allKeys.length > 0 && selectedCount === allKeys.length;
  const headerChecked = allSelected ? true : selectedCount > 0 ? "indeterminate" : false;
  const toggleAll = () => {
    const next = new Set(selectedSet);
    if (allSelected) allKeys.forEach((k) => next.delete(k));
    else allKeys.forEach((k) => next.add(k));
    setSelection(next);
  };
  const toggleRow = (key) => {
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelection(next);
  };
  const colCount = columns.length + (selectable ? 1 : 0);

  // Three-state cycle per column: ascending → descending → unsorted → ascending…
  const toggleSort = (col) => {
    setSort((prev) => {
      let next;
      if (!prev || prev.id !== col.id) next = { id: col.id, dir: "asc" };
      else if (prev.dir === "asc") next = { id: col.id, dir: "desc" };
      else next = null; // descending → clear (unsorted)
      onSortChange?.(next);
      return next;
    });
  };

  // Scroll: horizontal-overflow shadow + vertical lazy-load trigger.
  const scrollerRef = React.useRef(null);
  const [overflow, setOverflow] = React.useState(false);
  const effMaxHeight = maxHeight ?? (stickyHeader ? 420 : undefined);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setOverflow(hasOverflow && !atEnd);
      if (hasMore && !loading && onLoadMore) {
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 80;
        if (nearBottom) onLoadMore();
      }
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [columns, rows.length, hasMore, loading, onLoadMore]);

  return (
    <div className={cn(styles.root, className)}>
      <div
        ref={scrollerRef}
        className={styles.scroller}
        data-overflow={overflow || undefined}
        style={effMaxHeight ? { maxHeight: effMaxHeight, overflowY: "auto" } : undefined}
      >
        <table className={styles.table} data-density={rowHeight} data-zebra={zebra || undefined} data-hoverable={hoverable || undefined}>
          <thead>
            <tr className={styles.headRow} data-sticky-header={stickyHeader || undefined}>
              {selectable && (
                <th className={cn(styles.th, styles.selectCell)} data-align="center">
                  <Checkbox
                    size="sm"
                    checked={headerChecked}
                    onCheckedChange={toggleAll}
                    aria-label={allSelected ? "Deselect all" : "Select all"}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSticky = col.sticky === "right";
                const canSort = sortable && col.sortable;
                const active = sort && sort.id === col.id;
                return (
                  <th
                    key={col.id}
                    className={cn(styles.th, isSticky && styles.sticky, col.headerClassName)}
                    data-align={col.headerAlign || "left"}
                    style={{ width: col.width, minWidth: col.minWidth, maxWidth: col.maxWidth }}
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                  >
                    {canSort ? (
                      <button type="button" className={styles.sortBtn} data-dir={active ? sort.dir : undefined} onClick={() => toggleSort(col)}>
                        <span>{col.header}</span>
                        <SortIcon />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading ? (
              <tr>
                <td colSpan={colCount} className={styles.empty}>{emptyState || "No data"}</td>
              </tr>
            ) : (
              rows.map((row, i) => {
                const gIdx = (ps ? safePage * ps : 0) + i;
                const key = rowKey(row, gIdx);
                const rowSelected = selectable && selectedSet.has(key);
                return (
                <tr
                  key={key}
                  className={cn(styles.row, typeof rowClassName === "function" ? rowClassName(row, gIdx) : rowClassName)}
                  data-selected={rowSelected || undefined}
                >
                  {selectable && (
                    <td className={cn(styles.td, styles.selectCell)} data-align="center">
                      <Checkbox
                        size="sm"
                        checked={rowSelected}
                        onCheckedChange={() => toggleRow(key)}
                        aria-label="Select row"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const isSticky = col.sticky === "right";
                    return (
                      <td
                        key={col.id}
                        className={cn(styles.td, isSticky && styles.sticky, col.cellClassName)}
                        data-align={col.align || "left"}
                        style={{ width: col.width, minWidth: col.minWidth, maxWidth: col.maxWidth }}
                      >
                        {renderCell(col, row, i)}
                      </td>
                    );
                  })}
                </tr>
                );
              })
            )}
            {/* Shimmer skeleton rows while lazy-loading */}
            {loading &&
              Array.from({ length: lazyRows }).map((_, r) => (
                <tr key={`sk-${r}`} className={styles.row} aria-hidden>
                  {selectable && <td className={cn(styles.td, styles.selectCell)}><Skeleton variant="rect" width={16} height={16} radius={5} style={{ display: "block" }} /></td>}
                  {columns.map((col, c) => (
                    <td
                      key={col.id}
                      className={cn(styles.td, col.sticky === "right" && styles.sticky)}
                      data-align={col.align || "left"}
                    >
                      <Skeleton variant="text" width={`${55 + ((r * 7 + c * 13) % 35)}%`} />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pageSize ? (
        <Pagination
          page={safePage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={ps}
          sizeOptions={sizeOptions}
          onPageSize={(n) => { setPs(n); setPage(0); }}
          onPage={setPage}
        />
      ) : null}
    </div>
  );
}

DataTable.displayName = "DataTable";
export default DataTable;
