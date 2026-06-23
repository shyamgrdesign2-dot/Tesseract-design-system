/**
 * DataCell — primary line (+ optional subtext), each with optional left/right
 * icons. With subtext the primary truncates at 1 line; without subtext at 2.
 */
export function DataCell({ primary, secondary, primaryLeftIcon, primaryRightIcon, secondaryLeftIcon, secondaryRightIcon, maxLines, align, tooltipSide, className, }: {
    primary: any;
    secondary: any;
    primaryLeftIcon: any;
    primaryRightIcon: any;
    secondaryLeftIcon: any;
    secondaryRightIcon: any;
    maxLines: any;
    align?: string | undefined;
    tooltipSide?: string | undefined;
    className: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace DataCell {
    let displayName: string;
}
/** CellTag — status pill for `type: "tag"` columns. tone: neutral|primary|success|warning|error
 *
 *  Two flavours:
 *   • non-actionable (default) → Badge atom (soft) — a static label.
 *   • actionable (`actionable`/`onClick`) → Chip atom — gains a hover + click
 *     (press) effect and is keyboard/clickable. Use for filter-style tags.
 *  Optional leading `icon`. */
export function CellTag({ label, tone, actionable, onClick, icon, variant }: {
    label: any;
    tone?: string | undefined;
    actionable?: boolean | undefined;
    onClick: any;
    icon: any;
    variant?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
export namespace CellTag {
    let displayName_1: string;
    export { displayName_1 as displayName };
}
export function TableActions({ primary, actions, align }: {
    primary: any;
    actions?: never[] | undefined;
    align?: string | undefined;
}): import("react/jsx-runtime").JSX.Element;
export namespace TableActions {
    let displayName_2: string;
    export { displayName_2 as displayName };
}
export function DataTable({ columns: columnsProp, data, rowKey, emptyState, rowClassName, className, rowHeight, stickyHeader, maxHeight, zebra, hoverable, bordered, sortable, defaultSort, onSortChange, pageSize, pageSizeOptions, loading, hasMore, onLoadMore, lazyRows, selectable, selectionMode, selectedKeys, onSelectionChange, isRowDisabled, rowState, getSubRows, defaultExpandedKeys, expandedKeys: expandedKeysProp, onExpandedChange, expandColumnId, groupBy, groupLabel, defaultCollapsedGroups, analyticsId, onRowClick, }: {
    columns: any;
    data: any;
    rowKey?: ((row: any, i: any) => any) | undefined;
    emptyState?: null | undefined;
    rowClassName: any;
    className: any;
    rowHeight?: string | undefined;
    stickyHeader?: boolean | undefined;
    maxHeight: any;
    zebra?: boolean | undefined;
    hoverable?: boolean | undefined;
    bordered?: boolean | undefined;
    sortable?: boolean | undefined;
    defaultSort?: null | undefined;
    onSortChange: any;
    pageSize: any;
    pageSizeOptions: any;
    loading?: boolean | undefined;
    hasMore?: boolean | undefined;
    onLoadMore: any;
    lazyRows?: number | undefined;
    selectable?: boolean | undefined;
    selectionMode: any;
    selectedKeys: any;
    onSelectionChange: any;
    isRowDisabled: any;
    rowState: any;
    getSubRows: any;
    defaultExpandedKeys: any;
    expandedKeys: any;
    onExpandedChange: any;
    expandColumnId: any;
    groupBy: any;
    groupLabel: any;
    defaultCollapsedGroups: any;
    analyticsId: any;
    onRowClick: any;
}): import("react/jsx-runtime").JSX.Element;
export namespace DataTable {
    let displayName_3: string;
    export { displayName_3 as displayName };
}
export default DataTable;
