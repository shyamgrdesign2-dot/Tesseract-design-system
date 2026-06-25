"use client";

import * as React from "react";
import { cn, resolveRadius } from "@/src/hooks/utils";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./SectionCard.module.scss";

/**
 * SectionCard — a generic container shell: a card with an optional header,
 * arbitrary body content, and an optional footer. Each band can be collapsed,
 * recoloured, and filled with any content (a table, inputs, or a mix). Use it
 * for rxpad sections, multi-section forms (e.g. patient: Personal / Additional /
 * Address), dashboards — anywhere you need a titled, optionally-collapsible block.
 *
 * White surface + padding + outer stroke + radius by default; collapsing hides
 * the body (header + footer stay), so a footer's CTAs remain reachable.
 *
 * Props:
 *   title         heading text (rendered at a compact section size, not h1/h3)
 *   subtitle      secondary line under the title
 *   icon          icon NAME (string, bulk variant) or a ReactNode
 *   iconColor     colour for a string icon + its chip
 *   headerActions ReactNode — CTAs pinned to the right of the header (compose Buttons)
 *   headerExtra   ReactNode — a full-width row under the title (e.g. a search field)
 *   footer        ReactNode — footer band content (CTAs, summaries…)
 *   footerAlign   "start" | "between" | "end"  footer content alignment   default "end"
 *   collapsible   boolean — show an accordion toggle in the header
 *   collapsed / defaultCollapsed / onCollapsedChange   controlled|uncontrolled
 *   collapseIcon  icon name for the toggle (default "arrow-down-1")
 *   bordered      outer stroke (default true)
 *   divided       divider lines between header / body / footer (default true)
 *   radius        number | "pill" | "sharp" — card corner radius
 *   padding       number | string — band padding override
 *   surface       one background for all three bands (token/colour)
 *   headerBg / bodyBg / footerBg   per-band background overrides
 *   children      the body content — anything
 */
export const SectionCard = React.forwardRef(function SectionCard(
  {
    title,
    subtitle,
    icon,
    iconColor,
    headerActions,
    headerExtra,
    footer,
    footerAlign = "end",
    collapsible = false,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    collapseIcon = "chevron-down",
    bordered = true,
    divided = true,
    radius,
    padding,
    surface,
    headerBg,
    bodyBg,
    footerBg,
    children,
    className,
    style,
    ...rest
  },
  ref,
) {
  const controlled = collapsedProp !== undefined;
  const [internal, setInternal] = React.useState(defaultCollapsed);
  const collapsed = controlled ? collapsedProp : internal;
  const setCollapsed = (next) => {
    if (!controlled) setInternal(next);
    onCollapsedChange?.(next);
  };
  const bodyId = React.useId();

  const hasHeader = title != null || subtitle != null || icon != null || headerActions != null || headerExtra != null || collapsible;
  const px = (v) => (typeof v === "number" ? `${v}px` : v);

  const cardStyle = {
    ...(radius != null ? { "--sc-radius": resolveRadius(radius) } : null),
    ...(padding != null ? { "--sc-pad": px(padding) } : null),
    ...(surface ? { "--sc-bg": surface } : null),
    ...(headerBg ? { "--sc-header-bg": headerBg } : null),
    ...(bodyBg ? { "--sc-body-bg": bodyBg } : null),
    ...(footerBg ? { "--sc-footer-bg": footerBg } : null),
    ...style,
  };

  const iconEl =
    icon != null
      ? typeof icon === "string"
        ? <TPLibraryIcon name={icon} variant="bulk" size={20} color={iconColor} />
        : icon
      : null;

  return (
    <section
      ref={ref}
      className={cn(styles.card, bordered && styles.bordered, className)}
      style={cardStyle}
      data-divided={divided ? "" : undefined}
      data-collapsed={collapsed ? "" : undefined}
      {...rest}
    >
      {hasHeader && (
        <header className={styles.header}>
          <div className={styles.titleRow}>
            {collapsible && (
              <button
                type="button"
                className={styles.collapseBtn}
                aria-expanded={!collapsed}
                aria-controls={bodyId}
                aria-label={collapsed ? "Expand section" : "Collapse section"}
                onClick={() => setCollapsed(!collapsed)}
              >
                <TPLibraryIcon
                  name={collapseIcon}
                  variant="linear"
                  size={18}
                  className={cn(styles.chevron, collapsed && styles.chevronCollapsed)}
                />
              </button>
            )}
            {iconEl && (
              <span className={styles.iconChip} style={iconColor ? { color: iconColor } : undefined}>
                {iconEl}
              </span>
            )}
            {(title != null || subtitle != null) && (
              <div className={styles.titleText}>
                {title != null && <h3 className={styles.title}>{title}</h3>}
                {subtitle != null && <p className={styles.subtitle}>{subtitle}</p>}
              </div>
            )}
            {headerActions != null && <div className={styles.headerActions}>{headerActions}</div>}
          </div>
          {headerExtra != null && <div className={styles.headerExtra}>{headerExtra}</div>}
        </header>
      )}

      {!collapsed && children != null && (
        <div id={bodyId} className={styles.body}>
          {children}
        </div>
      )}

      {footer != null && (
        <footer className={styles.footer} data-align={footerAlign}>
          {footer}
        </footer>
      )}
    </section>
  );
});

SectionCard.displayName = "SectionCard";
export default SectionCard;
