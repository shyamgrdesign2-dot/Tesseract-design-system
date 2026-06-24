"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/src/components/atoms/Badge";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";
import { InputBox } from "@/src/components/atoms/Input/InputBox";
import { cn } from "@/src/hooks/utils";
import styles from "./Sidebar.module.scss";

/* ── Helpers ── */
const isLeaf = (item) => !item.children || item.children.length === 0;
const hasActive = (item, activeId) =>
  isLeaf(item)
    ? item.id === activeId
    : item.children.some((c) => c.id === activeId);

function ItemIcon({ icon, active, size = 20, variant: variantOverride }) {
  if (typeof icon === "string") {
    return (
      <TPIcon
        name={icon}
        variant={variantOverride || (active ? "bulk" : "linear")}
        size={size}
      />
    );
  }
  return icon ?? null;
}

function ItemBadge({ badge }) {
  if (badge == null) return null;
  let cfg = badge;
  if (badge === "trial")
    cfg = {
      text: "Trial",
      variant: "gradient",
      color: "warning",
      sticky: "right",
    };
  if (badge === "soon")
    cfg = { text: "Soon", variant: "soft", color: "violet" };
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

/* ── Flyout (portal, hover) ── */
function Flyout({ anchor, children, offset = 10, accentVars }) {
  const triggerRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState(null);
  const closeTimer = React.useRef(null);
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag so the portal only renders client-side
  React.useEffect(() => setMounted(true), []);

  const cancel = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancel();
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };
  const openNow = () => {
    cancel();
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setCoords({ left: r.right + offset, top: r.top });
    }
    setOpen(true);
  };

  React.useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      if (triggerRef.current) {
        const r = triggerRef.current.getBoundingClientRect();
        setCoords({ left: r.right + offset, top: r.top });
      }
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, offset]);

  const bind = {
    onMouseEnter: openNow,
    onMouseLeave: scheduleClose,
    onFocus: openNow,
    onBlur: scheduleClose,
  };

  return (
    <>
      {/* eslint-disable-next-line react-hooks/refs -- triggerRef is only attached to the trigger here, never read during render */}
      {anchor(bind, triggerRef)}
      {mounted && open && coords
        ? createPortal(
            <div
              className={styles.flyoutHost}
              style={{
                left: coords.left,
                top: Math.max(8, coords.top - 4),
                ...accentVars,
              }}
              onMouseEnter={openNow}
              onMouseLeave={scheduleClose}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/* ── Flyout content ── */
function FlyoutContent({ item, activeId, onSelect }) {
  return (
    <div className={styles.flyout} role="menu" aria-label={item.label}>
      <p className={styles.flyoutTitle}>{item.label}</p>
      <ul className={styles.flyoutList}>
        {item.children.map((child) => {
          const active = child.id === activeId;
          return (
            <li key={child.id}>
              <button
                type="button"
                role="menuitem"
                aria-current={active ? "page" : undefined}
                className={cn(styles.flyoutItem, active && styles.flyoutItemActive)}
                onClick={() => onSelect(child.id)}
              >
                <span className={styles.flyoutItemIcon}>
                  <ItemIcon icon={child.icon} active={active} size={18} />
                </span>
                <span className={styles.flyoutItemLabel}>{child.label}</span>
                {child.badge && (
                  <span className={styles.flyoutItemBadge}>
                    <ItemBadge badge={child.badge} />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Skeleton placeholder rows ── */
function SkeletonRows({ collapsed, count = 6 }) {
  return (
    <div className={styles.skeletonWrap} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            styles.skeletonRow,
            collapsed && styles.skeletonRowRail,
          )}
        >
          <span className={styles.skeletonChip} />
          {!collapsed && <span className={styles.skeletonLabel} />}
        </div>
      ))}
    </div>
  );
}

/* ── Collapsed rail item ── */
function CollapsedItem({ item, activeId, onSelect, accentVars }) {
  const active = hasActive(item, activeId);
  const leaf = isLeaf(item);

  const renderTrigger = (bind, ref) => (
    <button
      type="button"
      ref={ref}
      className={cn(styles.railItem, active && styles.railItemActive)}
      onClick={() => onSelect(leaf ? item.id : null, item)}
      title={item.label}
      aria-current={leaf && active ? "page" : undefined}
      aria-haspopup={leaf ? undefined : "menu"}
      {...bind}
    >
      {active && <span className={styles.railBar} />}
      <span className={cn(styles.chip, active && styles.chipActive)}>
        <ItemIcon icon={item.icon} active={active} size={20} />
      </span>
      {item.badge && (
        <span className={styles.railBadge}>
          <ItemBadge badge={item.badge} />
        </span>
      )}
      <span className={cn(styles.railLabel, active && styles.railLabelActive)}>
        {item.label}
      </span>
    </button>
  );

  if (leaf) return renderTrigger({}, null);

  return (
    <Flyout
      anchor={(bind, ref) => renderTrigger(bind, ref)}
      accentVars={accentVars}
    >
      <FlyoutContent item={item} activeId={activeId} onSelect={onSelect} />
    </Flyout>
  );
}

/* ── Expanded section row ── */
function ExpandedSection({
  item,
  activeId,
  expanded,
  onToggle,
  onSelect,
  caretIcon = "chevron-down",
}) {
  const leaf = isLeaf(item);
  const active = leaf ? item.id === activeId : false;
  const containsActive = !leaf && hasActive(item, activeId);

  if (leaf) {
    return (
      <button
        type="button"
        className={cn(
          styles.section,
          active && styles.sectionActiveLeaf,
        )}
        onClick={() => onSelect(item.id)}
        aria-current={active ? "page" : undefined}
      >
        <span
          className={cn(
            styles.chip,
            active && styles.chipActive,
          )}
        >
          <ItemIcon icon={item.icon} active={active} size={22} />
        </span>
        <span
          className={cn(
            styles.sectionLabel,
            active && styles.sectionLabelActive,
          )}
        >
          {item.label}
        </span>
        {item.badge && (
          <span className={styles.sectionBadge}>
            <ItemBadge badge={item.badge} />
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={cn(
          styles.section,
          expanded && styles.sectionOpen,
          !expanded && containsActive && styles.sectionAncestor,
        )}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span
          className={cn(
            styles.chip,
            !expanded && containsActive && styles.chipActive,
            expanded && styles.chipOpen,
          )}
        >
          <ItemIcon
            icon={item.icon}
            active={!expanded && containsActive}
            size={22}
          />
        </span>
        <span
          className={cn(
            styles.sectionLabel,
            !expanded && containsActive && styles.sectionLabelActive,
          )}
        >
          {item.label}
        </span>
        {item.badge && (
          <span className={styles.sectionBadge}>
            <ItemBadge badge={item.badge} />
          </span>
        )}
        <span className={cn(styles.caret, expanded && styles.caretOpen)}>
          <TPIcon name={caretIcon} variant="linear" size={14} />
        </span>
      </button>
      {expanded && (
        <div className={styles.children}>
          <span className={styles.childrenLine} />
          <ul className={styles.childrenList}>
            {item.children.map((child) => {
              const childActive = child.id === activeId;
              return (
                <li key={child.id}>
                  <button
                    type="button"
                    className={cn(
                      styles.childItem,
                      childActive && styles.childItemActive,
                    )}
                    onClick={() => onSelect(child.id)}
                    aria-current={childActive ? "page" : undefined}
                  >
                    <span className={styles.childItemIcon}>
                      <ItemIcon
                        icon={child.icon}
                        active={childActive}
                        size={18}
                      />
                    </span>
                    <span className={styles.childItemLabel}>{child.label}</span>
                    {child.badge && (
                      <span className={styles.childItemBadge}>
                        <ItemBadge badge={child.badge} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Main Sidebar ── */
export const Sidebar = React.forwardRef(function Sidebar(
  {
    items = [],
    activeId,
    onSelect,
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    search = false,
    searchPlaceholder = "Search…",
    showCollapseToggle = true,
    expandedWidth = 236,
    collapsedWidth = 80,
    bottomFade = true,
    logo,
    header,
    footer,
    className,
    style,
    accent = "var(--tesseract-blue-500)",
    density = "comfortable",
    emptyState,
    emptyText = "No matches.",
    loading = false,
    collapseIcon = "sidebar-left",
    searchIcon = "search-normal-1",
    caretIcon = "chevron-down",
    defaultOpenIds,
    onOpenChange,
    ...rest
  },
  ref,
) {
  const isControlled = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed);
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  const [query, setQuery] = React.useState("");
  const [openIds, setOpenIds] = React.useState(() => {
    if (defaultOpenIds) return new Set(defaultOpenIds);
    const owner = items.find((it) => hasActive(it, activeId));
    return new Set(owner && !isLeaf(owner) ? [owner.id] : []);
  });

  const commitOpenIds = React.useCallback(
    (updater) => {
      setOpenIds((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        onOpenChange?.([...next]);
        return next;
      });
    },
    [onOpenChange],
  );

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

  const handleSectionToggle = (item) => {
    if (isLeaf(item)) {
      onSelect?.(item.id);
      return;
    }
    if (item.children?.length === 1) {
      onSelect?.(item.children[0].id);
      return;
    }
    if (collapsed) {
      if (!isControlled) setInternalCollapsed(false);
      onCollapsedChange?.(false);
      commitOpenIds((p) => new Set(p).add(item.id));
      return;
    }
    commitOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const handleSelect = (id, item) => {
    if (id) {
      onSelect?.(id);
    } else if (item) {
      handleSectionToggle(item);
    }
  };

  // The "strong" accent step powers active labels (the old hardwired blue-700).
  // Default blue keeps blue-700 exactly; a custom accent derives a darker step.
  const isDefaultAccent = accent === "var(--tesseract-blue-500)";
  const accentMid = isDefaultAccent
    ? "var(--tesseract-blue-600)"
    : `color-mix(in srgb, ${accent} 85%, #000)`;
  const accentStrong = isDefaultAccent
    ? "var(--tesseract-blue-700)"
    : `color-mix(in srgb, ${accent} 72%, #000)`;
  // Flyouts portal to <body>, outside .root — re-declare the accent vars there.
  const accentVars = {
    "--sidebar-accent": accent,
    "--sidebar-accent-mid": accentMid,
    "--sidebar-accent-strong": accentStrong,
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

  return (
    <aside
      ref={ref}
      className={cn(
        styles.root,
        collapsed && styles.collapsed,
        className,
      )}
      style={{
        width: collapsed ? collapsedWidth : expandedWidth,
        ...accentVars,
        ...style,
      }}
      data-density={density}
      aria-label="Navigation"
      {...rest}
    >
      {/* Header */}
      {collapsed ? (
        <>
          {showCollapseToggle && (
            <div className={cn(styles.head, styles.headCollapsed)}>
              <button
                className={styles.toggleBtn}
                onClick={toggleCollapsed}
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <TPIcon
                  name={collapseIcon}
                  variant="linear"
                  size={20}
                  className={styles.flipIcon}
                />
              </button>
            </div>
          )}
          <span className={styles.divider} />
        </>
      ) : (
        <div className={styles.head}>
          {logo != null && <div className={styles.logo}>{logo}</div>}
          {search && (
            <InputBox
              surface="muted"
              height={40}
              radius={10}
              fullWidth
              style={{ flex: 1, minWidth: 0 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              leftIcon={<TPIcon name={searchIcon} variant="linear" size={16} />}
            />
          )}
          {showCollapseToggle && (
            <button
              className={cn(styles.toggleBtn, styles.toggleBtnSm)}
              onClick={toggleCollapsed}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <TPIcon name={collapseIcon} variant="linear" size={20} />
            </button>
          )}
        </div>
      )}

      {/* Header slot (e.g. account card) */}
      {header != null && !collapsed && (
        <div className={styles.header}>{header}</div>
      )}

      {/* Items */}
      <nav className={styles.list}>
        {loading ? (
          <SkeletonRows collapsed={collapsed} />
        ) : filtered.length === 0 ? (
          emptyState != null ? (
            emptyState
          ) : (
            <p className={styles.empty}>{emptyText}</p>
          )
        ) : collapsed ? (
          filtered.map((item) => (
            <CollapsedItem
              key={item.id}
              item={item}
              activeId={activeId}
              onSelect={handleSelect}
              accentVars={accentVars}
            />
          ))
        ) : (
          filtered.map((item) => (
            <ExpandedSection
              key={item.id}
              item={item}
              activeId={activeId}
              caretIcon={caretIcon}
              expanded={
                !isLeaf(item) && (openIds.has(item.id) || !!query)
              }
              onToggle={() => handleSectionToggle(item)}
              onSelect={(id) => onSelect?.(id)}
            />
          ))
        )}
      </nav>

      {/* Footer */}
      {footer != null && (
        <div className={styles.footer}>{footer}</div>
      )}
      {bottomFade && !collapsed && (
        <div className={styles.fade} aria-hidden />
      )}
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
