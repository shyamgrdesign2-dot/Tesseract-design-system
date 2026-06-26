"use client";

/**
 * SecondarySidebar — the blue-gradient secondary navigation rail (RxPad pattern).
 * Supports collapsed rail (80px) and expanded (200px) modes with nested items,
 * search filtering, badges, and a configurable collapse toggle.
 *
 * Props:
 *   items          [{ id, label, icon, signal?, badge?, disabled?, href?, children? }]
 *                  — a leaf with `href` renders as a real <a> (SSR / routing).
 *   activeId       id of the active item (controlled)
 *   onSelect       (id) => void
 *   collapsed      controlled collapsed state
 *   defaultCollapsed  uncontrolled initial collapsed state (default true)
 *   onCollapsedChange (collapsed) => void
 *   search         boolean — show search in expanded mode
 *   searchPlaceholder string
 *   showCollapseToggle boolean (default true)
 *   expandedWidth  number (default 200)
 *   collapsedWidth number (default 80)
 *   width          alias for collapsedWidth (backwards compat)
 *   tone           "blue" (default) | "violet" | "slate" | "green" — swaps the rail
 *                  gradient + fade + active-pill-icon colour using --tesseract-* ramps
 *   gradient       CSS string — overrides the tone ramp for the rail background
 *   density        "comfortable" (default) | "compact" — tightens pills/padding/label
 *   header         ReactNode rendered above the items
 *   footer         ReactNode pinned at the bottom (above the fade)
 *   emptyState     ReactNode shown when the filter matches nothing (overrides emptyText)
 *   emptyText      string for the no-matches message (default "No matches")
 *   pointerColor   colour of the active caret so it matches the adjacent content surface
 *   searchIcon     CDN icon name for the search input (default "search-normal")
 *   collapseIcon   CDN icon name for the collapse/expand toggle (default "sidebar-left")
 *   caretIcon      CDN icon name for the expandable-section caret (default "chevron-down")
 *   className
 */

import * as React from "react";
import { Badge } from "@/src/components/atoms/Badge";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./SecondarySidebar.module.scss";

// Render a navigation LEAF as a real link when `item.href` is provided (SSR /
// middle-click / routing) — else a <button>. Additive: same classes/handlers, so
// the look is unchanged. Disabled items stay <button> (a real <a> can't disable).
const NavTag = React.forwardRef(function NavTag({ href, disabled, children, ...rest }, ref) {
  if (href != null && !disabled) {
    const { type: _type, ...anchorRest } = rest; // <a> has no `type`
    return <a ref={ref} href={href} {...anchorRest}>{children}</a>;
  }
  return <button ref={ref} type="button" disabled={disabled} {...rest}>{children}</button>;
});

const isLeaf = (item) => !item.children || item.children.length === 0;
const hasActive = (item, activeId) =>
  isLeaf(item)
    ? item.id === activeId
    : item.children.some((c) => c.id === activeId);

function PillIcon({ icon, active, collapsed }) {
  if (typeof icon === "string") {
    return (
      <TPIcon
        name={icon}
        variant={active ? "bulk" : "linear"}
        size={collapsed ? 20 : 18}
        color={active ? "var(--ss-active-icon, var(--ss-ramp-500, #4b4ad5))" : "var(--tesseract-slate-0)"}
      />
    );
  }
  return icon ?? null;
}

function ItemBadge({ badge }) {
  if (badge == null) return null;
  let cfg = badge;
  if (badge === "trial")
    cfg = { text: "Trial", variant: "gradient", color: "warning", sticky: "right" };
  if (badge === "soon")
    cfg = { text: "Soon", variant: "soft", color: "violet", sticky: "right" };
  if (typeof badge === "string" && !cfg?.text) return null;
  if (cfg && typeof cfg === "object" && cfg.text != null) {
    return (
      <Badge
        variant={cfg.variant || "soft"}
        color={cfg.color || "primary"}
        size="xs"
        sticky={cfg.sticky}
      >
        {cfg.text}
      </Badge>
    );
  }
  return badge;
}

function CollapsedItem({ item, activeId, onSelect }) {
  const active = isLeaf(item)
    ? item.id === activeId
    : hasActive(item, activeId);

  return (
    <NavTag
      key={item.id}
      href={isLeaf(item) ? item.href : undefined}
      disabled={item.disabled}
      className={styles.item}
      data-active={active || undefined}
      data-disabled={item.disabled || undefined}
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(isLeaf(item) ? item.id : item.children?.[0]?.id)}
      title={item.label}
    >
      <span className={styles.inner}>
        <span className={styles.pill} data-active={active || undefined}>
          <PillIcon icon={item.icon} active={active} collapsed />
          {item.signal && (
            <span className={styles.signal}>
              <Badge variant="dot" color="error" size="md" />
            </span>
          )}
        </span>
        <span className={styles.label}>{item.label}</span>
      </span>
      {item.badge && !item.signal && (
        <span className={styles.railBadge}>
          <ItemBadge badge={item.badge} />
        </span>
      )}
      {active && <span className={styles.bar} aria-hidden />}
      {active && <span className={styles.pointer} aria-hidden />}
    </NavTag>
  );
}

function ExpandedItem({ item, activeId, onSelect, expanded, onToggle, caretIcon = "chevron-down" }) {
  const leaf = isLeaf(item);
  const active = leaf ? item.id === activeId : false;
  const containsActive = !leaf && hasActive(item, activeId);
  const isActive = active || containsActive;
  const childrenId = `ss-section-${item.id}`;

  if (leaf) {
    return (
      <NavTag
        href={item.href}
        disabled={item.disabled}
        className={styles.expItem}
        data-active={active || undefined}
        data-disabled={item.disabled || undefined}
        onClick={() => onSelect(item.id)}
        aria-current={active ? "page" : undefined}
      >
        <span className={styles.expPill} data-active={active || undefined}>
          <PillIcon icon={item.icon} active={active} collapsed={false} />
        </span>
        <span className={styles.expLabel} data-active={active || undefined}>
          {item.label}
        </span>
        {item.badge && (
          <span className={styles.expBadge}>
            <ItemBadge badge={item.badge} />
          </span>
        )}
        {active && <span className={styles.bar} aria-hidden />}
      </NavTag>
    );
  }

  return (
    <div className={styles.expGroup}>
      <button
        type="button"
        className={styles.expItem}
        data-active={isActive || undefined}
        data-open={expanded || undefined}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={childrenId}
      >
        <span
          className={styles.expPill}
          data-active={(!expanded && containsActive) || undefined}
        >
          <PillIcon icon={item.icon} active={!expanded && containsActive} collapsed={false} />
        </span>
        <span
          className={styles.expLabel}
          data-active={(!expanded && containsActive) || undefined}
        >
          {item.label}
        </span>
        {item.badge && (
          <span className={styles.expBadge}>
            <ItemBadge badge={item.badge} />
          </span>
        )}
        <span className={cn(styles.caret, expanded && styles.caretOpen)}>
          <TPIcon name={caretIcon} variant="linear" size={12} />
        </span>
      </button>
      {expanded && (
        <div className={styles.expChildren} id={childrenId}>
          {item.children.map((child) => {
            const childActive = child.id === activeId;
            return (
              <NavTag
                key={child.id}
                href={child.href}
                disabled={child.disabled}
                className={styles.expChild}
                data-active={childActive || undefined}
                data-disabled={child.disabled || undefined}
                onClick={() => onSelect(child.id)}
                aria-current={childActive ? "page" : undefined}
              >
                <PillIcon icon={child.icon} active={childActive} collapsed={false} />
                <span className={styles.expChildLabel} data-active={childActive || undefined}>
                  {child.label}
                </span>
                {child.badge && (
                  <span className={styles.expBadge}>
                    <ItemBadge badge={child.badge} />
                  </span>
                )}
              </NavTag>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const SecondarySidebar = React.forwardRef(function SecondarySidebar({
  items = [],
  activeId,
  onSelect,
  collapsed: controlledCollapsed,
  defaultCollapsed = true,
  onCollapsedChange,
  search = false,
  searchPlaceholder = "Search…",
  showCollapseToggle = true,
  expandedWidth = 200,
  collapsedWidth = 80,
  width,
  bottomFade = true,
  tone = "blue",
  gradient,
  density = "comfortable",
  header,
  footer,
  emptyState,
  emptyText = "No matches",
  pointerColor,
  searchIcon = "search-normal",
  collapseIcon = "sidebar-left",
  caretIcon = "chevron-down",
  className,
  style,
  ...rest
}, ref) {
  const isControlled = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;
  const railWidth = collapsed ? (width || collapsedWidth) : expandedWidth;

  const [query, setQuery] = React.useState("");
  const [openIds, setOpenIds] = React.useState(() => {
    const owner = items.find((it) => hasActive(it, activeId));
    return new Set(owner && !isLeaf(owner) ? [owner.id] : []);
  });

  React.useEffect(() => {
    const owner = items.find((it) => hasActive(it, activeId));
    if (owner && !isLeaf(owner)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-open the section containing the active item on navigation; guarded so it can't loop
      setOpenIds((prev) =>
        prev.has(owner.id) ? prev : new Set(prev).add(owner.id),
      );
    }
  }, [activeId, items]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    if (!isControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const handleToggleSection = (item) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const out = [];
    for (const s of items) {
      if (s.label.toLowerCase().includes(q)) {
        out.push(s);
        continue;
      }
      if (isLeaf(s)) continue;
      const children = s.children.filter((c) =>
        c.label.toLowerCase().includes(q),
      );
      if (children.length) out.push({ ...s, children });
    }
    return out;
  }, [items, query]);

  const railStyle = {
    width: railWidth,
    minWidth: railWidth,
    maxWidth: railWidth,
    flexBasis: railWidth,
  };
  if (gradient) railStyle["--ss-gradient"] = gradient;
  if (pointerColor) railStyle["--ss-pointer"] = pointerColor;

  return (
    <nav
      ref={ref}
      className={cn(styles.rail, collapsed && styles.collapsed, className)}
      style={{ ...railStyle, ...style }}
      data-tone={tone !== "blue" ? tone : undefined}
      data-density={density === "compact" ? "compact" : undefined}
      aria-label="Secondary"
      {...rest}
    >
      {/* Toggle + search header for expanded — only when it has content,
          so removing the collapse toggle (and search) leaves no empty band/divider */}
      {!collapsed && (search || showCollapseToggle) && (
        <div className={styles.expHead}>
          {search && (
            <div className={styles.expSearch}>
              <TPIcon name={searchIcon} variant="linear" size={14} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder || "Search"}
              />
            </div>
          )}
          {showCollapseToggle && (
            <button
              className={styles.expToggle}
              onClick={toggleCollapsed}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <TPIcon name={collapseIcon} variant="linear" size={16} />
            </button>
          )}
        </div>
      )}

      {/* Collapsed toggle */}
      {collapsed && showCollapseToggle && (
        <div className={styles.collapsedHead}>
          <button
            className={styles.expToggle}
            onClick={toggleCollapsed}
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <TPIcon name={collapseIcon} variant="linear" size={16} className={styles.flipIcon} />
          </button>
        </div>
      )}

      {header != null && <div className={styles.slotHeader}>{header}</div>}

      <div className={styles.scroll}>
        {filtered.length === 0 ? (
          emptyState ?? <p className={styles.empty}>{emptyText}</p>
        ) : collapsed ? (
          filtered.map((item) => (
            <CollapsedItem
              key={item.id}
              item={item}
              activeId={activeId}
              onSelect={(id) => onSelect?.(id)}
            />
          ))
        ) : (
          filtered.map((item) => (
            <ExpandedItem
              key={item.id}
              item={item}
              activeId={activeId}
              onSelect={(id) => onSelect?.(id)}
              expanded={!isLeaf(item) && (openIds.has(item.id) || !!query)}
              onToggle={() => handleToggleSection(item)}
              caretIcon={caretIcon}
            />
          ))
        )}
      </div>
      {footer != null && <div className={styles.slotFooter}>{footer}</div>}
      {bottomFade && <div className={styles.fade} aria-hidden />}
    </nav>
  );
});

SecondarySidebar.displayName = "SecondarySidebar";
export default SecondarySidebar;
