"use client";

/**
 * DataTable — the single, configurable table molecule for list surfaces.
 *
 * Column-config driven with table-level knobs. First-party, no external deps.
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
 *   bordered     boolean   outer border + cell column rules  default false
 *   sortable     boolean   show sort affordances (per-col `sortable` opts in)
 *   defaultSort  { id, dir: "asc"|"desc" }
 *   onSortChange (sort) => void
 *   pageSize     number    enables pagination when set
 *   loading      boolean   shows a loading row (lazy fetch)
 *   hasMore      boolean   more rows exist to lazy-load
 *   onLoadMore   ()=>void  called when scrolled near the bottom
 *   emptyState   ReactNode
 *
 *   ── Selection ──
 *   selectionMode "none"|"single"|"multiple"  leading radio/checkbox column
 *   selectable    boolean   alias for selectionMode="multiple"
 *   selectedKeys / onSelectionChange          controlled selection (array of keys)
 *   isRowDisabled (row, i) => boolean         disabled rows can't be selected
 *
 *   ── Row state (semantic tint) ──
 *   rowState     (row, i) => "info"|"success"|"warning"|"error"|"reference"
 *
 *   ── Nesting (expandable sub-rows) ──
 *   getSubRows   (row) => row[]               children of a row (tree)
 *   defaultExpandedKeys / expandedKeys / onExpandedChange
 *   expandColumnId  id of the column that hosts the expander (default: 1st)
 *
 *   ── Grouping (collapsible group headers) ──
 *   groupBy      (row, i) => groupValue
 *   groupLabel   (groupValue, rows) => ReactNode
 *   defaultCollapsedGroups  groupValue[]
 *
 * Column object:
 *   { id, header, width?, minWidth?, maxWidth?, expand?, align?, headerAlign?,
 *     sticky?: "left"|"right", spanRows?: boolean, spanAccessor?: (row)=>any,
 *     sortable?: boolean, sortAccessor?: (row) => comparable,
 *     headerClassName?, cellClassName?, cell: (row, i) => ReactNode }
 *   Headers are left-aligned by default (set `headerAlign` to override); `align`
 *   only affects the body cells. Sticky columns need a `width` (or `minWidth`)
 *   so they can stack against each other.
 *
 * Responsive widths: the table is fluid (width: 100%, auto layout). Every column
 * gets a min-width (own `minWidth`, else a sane default) so it never collapses;
 * on a narrow screen columns shrink to their mins and the table scrolls
 * horizontally. `maxWidth` caps a column; `expand: true` lets a column absorb the
 * leftover width (its max becomes the screen) — use it for the free-text column.
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
import { Radio } from "@/src/components/atoms/Radio";
import { Skeleton } from "@/src/components/atoms/Skeleton";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { useAnalytics } from "@/src/analytics/context";
import {
  DEFAULT_MIN_WIDTH,
  LEADING_COL_WIDTH,
  columnPxWidth,
  orderColumns,
  stickyOffsets,
  collectKeys,
  flattenRows,
  computeRowSpans,
} from "./tableModel";
import styles from "./DataTable.module.scss";

// Responsive per-column sizing. `expand` drops the max so the column soaks up the
// leftover width (its ceiling becomes the screen); otherwise `maxWidth` caps it.
const colStyle = (col) => ({
  width: col.width,
  minWidth: col.minWidth ?? DEFAULT_MIN_WIDTH,
  maxWidth: col.expand ? undefined : col.maxWidth,
});

// Merge the responsive sizing with the resolved sticky offset (left/right px).
const stickyStyle = (col, offsets) => {
  const base = colStyle(col);
  const s = offsets[col.id];
  if (!s) return base;
  return { ...base, [s.side]: s.offset };
};

// Badge tones map 1:1; Chip uses "default" where Badge uses "neutral".
const CHIP_COLOR = { neutral: "default", primary: "primary", success: "success", warning: "warning", error: "error" };

// ── Sort icon (Tesseract up/down "sort" glyph) — the active direction's arrow is
// highlighted: ascending → top arrow, descending → bottom arrow; idle → both faint.
function SortIcon() {
  return (
    <svg className={styles.sortGlyph} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path className={styles.sortUp} d="M12.1549 1.1543C12.2028 1.15981 12.2473 1.16678 12.2867 1.1748L12.4547 1.21777L12.5572 1.25391C12.7055 1.3175 12.8612 1.41698 13.0025 1.56738L13.0045 1.56543L19.9146 8.47559C20.1591 8.7201 20.2325 9.08779 20.1002 9.40723C19.9679 9.72668 19.6559 9.93452 19.3102 9.93457H4.69004C4.34423 9.93457 4.03234 9.72672 3.9 9.40723C3.76768 9.08776 3.84106 8.72011 4.08555 8.47559L10.9957 1.56543L11.0699 1.49512C11.157 1.41763 11.2817 1.32304 11.443 1.25391L11.5963 1.19922C11.7452 1.15616 11.8828 1.14456 11.9996 1.14453L12.1549 1.1543Z" />
      <path className={styles.sortDown} d="M11.8454 22.8457C11.7974 22.8402 11.753 22.8332 11.7135 22.8252L11.5456 22.7822L11.443 22.7461C11.2947 22.6825 11.1391 22.583 10.9977 22.4326L10.9958 22.4346L4.08559 15.5244C3.84116 15.2799 3.76776 14.9122 3.90005 14.5928C4.03237 14.2733 4.34432 14.0655 4.69009 14.0654L19.3102 14.0654C19.656 14.0654 19.9679 14.2733 20.1002 14.5928C20.2326 14.9122 20.1592 15.2799 19.9147 15.5244L13.0045 22.4346L12.9303 22.5049C12.8433 22.5824 12.7185 22.677 12.5573 22.7461L12.404 22.8008C12.2551 22.8438 12.1175 22.8554 12.0006 22.8555L11.8454 22.8457Z" />
    </svg>
  );
}

// Chevron (CDN) used by group headers + nested-row expanders. Rotates when open
// via the .chevron[data-open] selector.
function Chevron({ open }) {
  return <TPLibraryIcon name="chevron-right" size={16} className={styles.chevron} data-open={open || undefined} />;
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

// ── TableActions — the configurable action cluster for an action column ────────
// One config object drives the whole cluster, so an action column is described
// declaratively (and tracked) instead of hand-assembled per table:
//   primary  { label, icon?, menu?, onClick?, variant?, theme?, track? }  the lead CTA
//            (pass `menu` to make it a split button). Falsy → no primary.
//   actions  [{ icon, label, onClick?, menu?, variant?, theme?, track? }] icon-only buttons
//   align    "right" | "left" | "center"                                  default "right"
// Icons accept a Tesseract library name (string) or any ReactNode. Each button carries
// its own `track` id, so clicks flow to the TPAnalyticsProvider automatically.
const actionIcon = (ic, size = 18) =>
  typeof ic === "string" ? (ic.trim() ? <TPLibraryIcon name={ic.trim()} size={size} /> : null) : ic;

export function TableActions({ primary, actions = [], align = "right" }) {
  return (
    <div className={styles.actionCluster} data-align={align}>
      {primary && (
        <Button
          variant={primary.variant || "outline"}
          theme={primary.theme || "primary"}
          size="sm"
          icon={actionIcon(primary.icon, 16)}
          menu={primary.menu}
          onClick={primary.onClick}
          track={primary.track}
        >
          {primary.label}
        </Button>
      )}
      {actions.filter(Boolean).map((a, i) => (
        <Button
          key={a.id || i}
          variant={a.variant || "ghost"}
          theme={a.theme || "neutral"}
          size="sm"
          aria-label={a.label}
          icon={actionIcon(a.icon, 18)}
          menu={a.menu}
          onClick={a.onClick}
          track={a.track}
        />
      ))}
    </div>
  );
}
TableActions.displayName = "TableActions";

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
              <TPLibraryIcon name="chevron-down" size={12} className={styles.rppCaret} />
            </span>
          </label>
        )}
        <span className={styles.pageInfo}>{total === 0 ? "0 results" : `${from}–${to} of ${total}`}</span>
      </div>

      {/* Right: page navigation (neutral) */}
      <div className={styles.pager}>
        <button type="button" className={styles.pageNav} disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <TPLibraryIcon name="chevron-left" size={16} />
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
          <TPLibraryIcon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────
export function DataTable({
  columns: columnsProp,
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
  bordered = false,
  sortable = false,
  defaultSort = null,
  onSortChange,
  pageSize,
  pageSizeOptions,
  loading = false,
  hasMore = false,
  onLoadMore,
  lazyRows = 3,
  // selection
  selectable = false,
  selectionMode,
  selectedKeys,
  onSelectionChange,
  isRowDisabled,
  // row state
  rowState,
  // nesting
  getSubRows,
  defaultExpandedKeys,
  expandedKeys: expandedKeysProp,
  onExpandedChange,
  expandColumnId,
  // grouping
  groupBy,
  groupLabel,
  defaultCollapsedGroups,
  // analytics
  analyticsId,
  onRowClick,
}) {
  // Action tracking — emits DataTable events to the nearest TPAnalyticsProvider,
  // but only when `analyticsId` is set (so silent tables stay silent).
  const { track } = useAnalytics();
  const emit = React.useCallback((action, payload) => {
    if (!analyticsId) return;
    track({ component: "DataTable", id: analyticsId, action, ...payload });
  }, [analyticsId, track]);
  // selectable (legacy) → multiple. selectionMode wins when provided.
  const selMode = selectionMode || (selectable ? "multiple" : "none");
  const hasSelect = selMode === "single" || selMode === "multiple";
  const hasNesting = typeof getSubRows === "function";
  const radioName = React.useId();

  // Sticky columns are reordered so left-sticky come first and right-sticky last;
  // relative order within each band is preserved.
  const columns = React.useMemo(() => orderColumns(columnsProp), [columnsProp]);

  // Pixel offsets for every sticky column (cumulative per side). This is the
  // first-paint / SSR estimate from declared widths; it's then corrected with
  // measured widths below so there's never a gap between pinned columns.
  const modelOffsets = React.useMemo(
    () => stickyOffsets(columns, { leadingWidth: hasSelect ? LEADING_COL_WIDTH : 0 }),
    [columns, hasSelect],
  );
  const hasLeftSticky = columns.some((c) => c.sticky === "left");
  // The control column pins left whenever something else is pinned left (so it
  // doesn't scroll away from its rows).
  const leadingSticky = hasSelect && hasLeftSticky;

  // Measure REAL header widths so sticky offsets are pixel-accurate even when the
  // table stretches (width:100%) and a column renders wider than its declared
  // width. Without this, the pinned select column and the first sticky data
  // column drift apart, leaving a visible gap on horizontal scroll.
  const headThRefs = React.useRef(new Map());
  const leadThRef = React.useRef(null);
  const [measured, setMeasured] = React.useState(null);
  // Stable signal: only the sticky structure (which columns, which side, leading)
  // — NOT the columns array ref, which changes every render and would re-subscribe
  // (and re-loop) endlessly.
  const stickyKey = columns.filter((c) => c.sticky).map((c) => `${c.sticky}:${c.id}`).join("|") + `#${leadingSticky}`;
  React.useLayoutEffect(() => {
    const leftCols = columns.filter((c) => c.sticky === "left");
    const rightCols = columns.filter((c) => c.sticky === "right");
    const measure = () => {
      if (!leftCols.length && !rightCols.length) { setMeasured((p) => (p === null ? p : null)); return; }
      const next = {};
      let lx = leadingSticky && leadThRef.current ? leadThRef.current.offsetWidth : 0;
      for (const c of leftCols) {
        next[c.id] = lx;
        const el = headThRefs.current.get(c.id);
        lx += el ? el.offsetWidth : columnPxWidth(c);
      }
      let rx = 0;
      for (let i = rightCols.length - 1; i >= 0; i--) {
        const c = rightCols[i];
        next[c.id] = rx;
        const el = headThRefs.current.get(c.id);
        rx += el ? el.offsetWidth : columnPxWidth(c);
      }
      // Skip the state update when nothing actually moved (avoids a render loop).
      setMeasured((prev) => {
        if (prev) {
          const ks = Object.keys(next);
          if (ks.length === Object.keys(prev).length && ks.every((k) => prev[k] === next[k])) return prev;
        }
        return next;
      });
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    headThRefs.current.forEach((el) => el && ro?.observe(el));
    if (leadThRef.current) ro?.observe(leadThRef.current);
    window.addEventListener("resize", measure);
    return () => { ro?.disconnect(); window.removeEventListener("resize", measure); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickyKey]);

  // Final offsets: measured px override the estimate; side + edge come from the model.
  const offsets = React.useMemo(() => {
    if (!measured) return modelOffsets;
    const out = {};
    for (const id of Object.keys(modelOffsets)) {
      out[id] = { ...modelOffsets[id], offset: measured[id] ?? modelOffsets[id].offset };
    }
    return out;
  }, [modelOffsets, measured]);

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

  // Sorting (top-level rows; sub-rows keep their given order)
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
  const pageRows = ps ? sorted.slice(safePage * ps, (safePage + 1) * ps) : sorted;

  // ── Expand / collapse (nesting) ──
  const expandControlled = expandedKeysProp !== undefined;
  const [internalExpanded, setInternalExpanded] = React.useState(() => new Set(defaultExpandedKeys || []));
  const expandedSet = expandControlled ? new Set(expandedKeysProp) : internalExpanded;
  const toggleExpand = (key) => {
    const next = new Set(expandedSet);
    const willExpand = !next.has(key);
    if (next.has(key)) next.delete(key); else next.add(key);
    if (!expandControlled) setInternalExpanded(next);
    onExpandedChange?.([...next]);
    emit(willExpand ? "row_expand" : "row_collapse", { value: key });
  };

  // ── Collapse / expand (groups) ──
  const [collapsedGroups, setCollapsedGroups] = React.useState(() => new Set(defaultCollapsedGroups || []));
  const toggleGroup = (group) => {
    const willCollapse = !collapsedGroups.has(group);
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group); else next.add(group);
      return next;
    });
    emit(willCollapse ? "group_collapse" : "group_expand", { label: String(group) });
  };

  // ── Visual rows (group headers + data rows w/ depth) + row spans ──
  const visualRows = React.useMemo(
    () => flattenRows(pageRows, { rowKey, getSubRows, expandedKeys: expandedSet, groupBy, groupLabel, collapsedGroups }),
    [pageRows, rowKey, getSubRows, expandedSet, groupBy, groupLabel, collapsedGroups],
  );
  const { spanMap, skip } = React.useMemo(() => computeRowSpans(visualRows, columns), [visualRows, columns]);

  // ── Row selection ──
  const selControlled = selectedKeys !== undefined;
  const [internalSel, setInternalSel] = React.useState(() => new Set());
  const selectedSet = selControlled ? new Set(selectedKeys) : internalSel;
  const setSelection = (nextSet) => {
    if (!selControlled) setInternalSel(nextSet);
    onSelectionChange?.([...nextSet]);
  };
  // "Select all" is scoped to the CURRENT PAGE's rows (incl. their nested
  // descendants), minus disabled ones — not every row across all pages, which
  // is surprising. Use `selectedKeys` to drive an explicit "select all N" if needed.
  const allKeys = React.useMemo(() => {
    const keys = collectKeys(pageRows, { rowKey, getSubRows });
    if (!isRowDisabled) return keys;
    const disabled = new Set();
    const walk = (rows) => rows.forEach((r, i) => {
      if (isRowDisabled(r, i)) disabled.add(rowKey(r, i));
      const sub = getSubRows ? getSubRows(r) : null;
      if (sub && sub.length) walk(sub);
    });
    walk(pageRows);
    return keys.filter((k) => !disabled.has(k));
  }, [pageRows, rowKey, getSubRows, isRowDisabled]);

  const selectedCount = allKeys.filter((k) => selectedSet.has(k)).length;
  const allSelected = allKeys.length > 0 && selectedCount === allKeys.length;
  const headerChecked = allSelected ? true : selectedCount > 0 ? "indeterminate" : false;
  const toggleAll = () => {
    const next = new Set(selectedSet);
    if (allSelected) allKeys.forEach((k) => next.delete(k));
    else allKeys.forEach((k) => next.add(k));
    setSelection(next);
    emit("select_all", { meta: { selected: !allSelected, count: next.size } });
  };
  const toggleRow = (key) => {
    if (selMode === "single") {
      const on = !selectedSet.has(key);
      setSelection(new Set(on ? [key] : []));
      emit("select_row", { value: key, meta: { selected: on, mode: "single" } });
      return;
    }
    const next = new Set(selectedSet);
    const on = !next.has(key);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelection(next);
    emit("select_row", { value: key, meta: { selected: on, mode: "multiple", count: next.size } });
  };
  const toggleGroupSelect = (keys, allOn) => {
    const next = new Set(selectedSet);
    if (allOn) keys.forEach((k) => next.delete(k));
    else keys.forEach((k) => next.add(k));
    setSelection(next);
    emit("select_group", { meta: { selected: !allOn, count: next.size } });
  };

  const dataColCount = columns.length;
  const colCount = dataColCount + (hasSelect ? 1 : 0);

  // The column that hosts the nesting expander (first data column by default).
  const expanderColId = hasNesting ? (expandColumnId || columns[0]?.id) : null;

  // Three-state cycle per column: ascending → descending → unsorted → ascending…
  // Compute the next sort from current state (not inside the updater) so the
  // onSortChange / track side effects don't run during React's render phase.
  const toggleSort = (col) => {
    let next;
    if (!sort || sort.id !== col.id) next = { id: col.id, dir: "asc" };
    else if (sort.dir === "asc") next = { id: col.id, dir: "desc" };
    else next = null; // descending → clear (unsorted)
    setSort(next);
    onSortChange?.(next);
    emit("sort", { columnId: col.id, label: col.header, value: next?.dir || "none" });
  };

  // Scroll: horizontal-overflow shadows (left + right) + vertical lazy-load.
  const scrollerRef = React.useRef(null);
  const [edges, setEdges] = React.useState({ left: false, right: false });
  const effMaxHeight = maxHeight ?? (stickyHeader ? 420 : undefined);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 1;
      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setEdges({ left: hasOverflow && !atStart, right: hasOverflow && !atEnd });
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
  }, [columns, visualRows.length, hasMore, loading, onLoadMore]);

  // Render the body cells for one data row (shared by spanning logic).
  const renderDataCells = (vr, vIdx) => {
    const { row, index, depth, hasChildren, expanded } = vr;
    return columns.map((col) => {
      const cellKey = `${vIdx}:${col.id}`;
      if (skip.has(cellKey)) return null; // covered by a rowSpan above
      const s = offsets[col.id];
      const isExpander = col.id === expanderColId;
      const span = spanMap[cellKey];
      return (
        <td
          key={col.id}
          rowSpan={span}
          className={cn(styles.td, s && styles.sticky, col.cellClassName)}
          data-align={col.align || "left"}
          data-edge={s?.edge ? s.side : undefined}
          style={stickyStyle(col, offsets)}
        >
          {isExpander ? (
            <div className={styles.expandWrap} style={{ paddingLeft: depth * 20 }}>
              {hasChildren ? (
                <button type="button" className={styles.expander} onClick={() => toggleExpand(vr.key)} aria-label={expanded ? "Collapse row" : "Expand row"} aria-expanded={expanded}>
                  <Chevron open={expanded} />
                </button>
              ) : (
                hasNesting && <span className={styles.expanderSpacer} aria-hidden />
              )}
              <div className={styles.expandBody}>{renderCell(col, row, index)}</div>
            </div>
          ) : (
            renderCell(col, row, index)
          )}
        </td>
      );
    });
  };

  return (
    <div className={cn(styles.root, className)}>
      <div
        ref={scrollerRef}
        className={styles.scroller}
        data-overflow-left={edges.left || undefined}
        data-overflow-right={edges.right || undefined}
        style={effMaxHeight ? { maxHeight: effMaxHeight, overflowY: "auto" } : undefined}
      >
        <table className={styles.table} data-density={rowHeight} data-zebra={zebra || undefined} data-hoverable={hoverable || undefined} data-bordered={bordered || undefined}>
          <thead>
            <tr className={styles.headRow} data-sticky-header={stickyHeader || undefined}>
              {hasSelect && (
                <th ref={leadThRef} className={cn(styles.th, styles.selectCell, leadingSticky && styles.sticky)} data-align="center" data-edge={leadingSticky ? "left" : undefined} style={leadingSticky ? { left: 0 } : undefined}>
                  {selMode === "multiple" && (
                    <Checkbox
                      size="sm"
                      checked={headerChecked}
                      onCheckedChange={toggleAll}
                      aria-label={allSelected ? "Deselect all" : "Select all"}
                    />
                  )}
                </th>
              )}
              {columns.map((col) => {
                const s = offsets[col.id];
                const canSort = sortable && col.sortable;
                const active = sort && sort.id === col.id;
                return (
                  <th
                    key={col.id}
                    ref={(el) => { if (el) headThRefs.current.set(col.id, el); else headThRefs.current.delete(col.id); }}
                    className={cn(styles.th, s && styles.sticky, col.headerClassName)}
                    data-align={col.headerAlign || "left"}
                    data-edge={s?.edge ? s.side : undefined}
                    style={stickyStyle(col, offsets)}
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
            {visualRows.length === 0 && !loading ? (
              <tr>
                <td colSpan={colCount} className={styles.empty}>{emptyState || "No data"}</td>
              </tr>
            ) : (
              visualRows.map((vr, vIdx) => {
                if (vr.kind === "group") {
                  const groupKeys = vr.keys.filter((k) => allKeys.includes(k));
                  const groupSelCount = groupKeys.filter((k) => selectedSet.has(k)).length;
                  const groupAll = groupKeys.length > 0 && groupSelCount === groupKeys.length;
                  const groupChecked = groupAll ? true : groupSelCount > 0 ? "indeterminate" : false;
                  return (
                    <tr key={`g-${vr.gi}`} className={styles.groupRow}>
                      {hasSelect && (
                        <td className={cn(styles.td, styles.selectCell, styles.groupCell, leadingSticky && styles.sticky)} data-align="center" style={leadingSticky ? { left: 0 } : undefined}>
                          {selMode === "multiple" && (
                            <Checkbox size="sm" checked={groupChecked} onCheckedChange={() => toggleGroupSelect(groupKeys, groupAll)} aria-label="Select group" />
                          )}
                        </td>
                      )}
                      <td colSpan={dataColCount} className={cn(styles.td, styles.groupCell)}>
                        <button type="button" className={styles.groupToggle} onClick={() => toggleGroup(vr.group)} aria-expanded={!vr.collapsed}>
                          <Chevron open={!vr.collapsed} />
                          <span className={styles.groupLabel}>{vr.label}</span>
                          <span className={styles.groupCount}>{vr.count}</span>
                        </button>
                      </td>
                    </tr>
                  );
                }

                // data row
                const disabled = isRowDisabled ? isRowDisabled(vr.row, vr.index) : false;
                const state = rowState ? rowState(vr.row, vr.index) : undefined;
                const rowSelected = hasSelect && selectedSet.has(vr.key);
                const clickable = !disabled && !!onRowClick;
                return (
                  <tr
                    key={vr.key}
                    className={cn(styles.row, typeof rowClassName === "function" ? rowClassName(vr.row, vr.index) : rowClassName)}
                    data-selected={rowSelected || undefined}
                    data-disabled={disabled || undefined}
                    data-state={state || undefined}
                    data-depth={vr.depth || undefined}
                    data-clickable={clickable || undefined}
                    onClick={(clickable || analyticsId) && !disabled ? (e) => {
                      // Ignore clicks that land on interactive cell content.
                      if (e.target.closest('button, a, input, select, [role="checkbox"], [role="menu"], [role="menuitem"]')) return;
                      onRowClick?.(vr.row, vr.index);
                      emit("row_click", { value: vr.key });
                    } : undefined}
                  >
                    {hasSelect && (
                      <td className={cn(styles.td, styles.selectCell, leadingSticky && styles.sticky)} data-align="center" data-edge={leadingSticky ? "left" : undefined} style={leadingSticky ? { left: 0 } : undefined}>
                        {selMode === "single" ? (
                          <Radio
                            size="sm"
                            name={radioName}
                            checked={rowSelected}
                            disabled={disabled}
                            onChange={() => toggleRow(vr.key)}
                            aria-label="Select row"
                          />
                        ) : (
                          <Checkbox
                            size="sm"
                            checked={rowSelected}
                            disabled={disabled}
                            onCheckedChange={() => toggleRow(vr.key)}
                            aria-label="Select row"
                          />
                        )}
                      </td>
                    )}
                    {renderDataCells(vr, vIdx)}
                  </tr>
                );
              })
            )}
            {/* Shimmer skeleton rows while lazy-loading */}
            {loading &&
              Array.from({ length: lazyRows }).map((_, r) => (
                <tr key={`sk-${r}`} className={styles.row} aria-hidden>
                  {hasSelect && <td className={cn(styles.td, styles.selectCell, leadingSticky && styles.sticky)} style={leadingSticky ? { left: 0 } : undefined}><Skeleton variant="rect" width={16} height={16} radius={5} style={{ display: "block" }} /></td>}
                  {columns.map((col, c) => (
                    <td
                      key={col.id}
                      className={cn(styles.td, offsets[col.id] && styles.sticky)}
                      data-align={col.align || "left"}
                      data-edge={offsets[col.id]?.edge ? offsets[col.id].side : undefined}
                      style={stickyStyle(col, offsets)}
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
          onPageSize={(n) => { setPs(n); setPage(0); emit("page_size", { value: n }); }}
          onPage={(p) => { setPage(p); emit("page_change", { value: p }); }}
        />
      ) : null}
    </div>
  );
}

DataTable.displayName = "DataTable";
export default DataTable;
