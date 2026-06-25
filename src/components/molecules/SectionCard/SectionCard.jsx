"use client";

import * as React from "react";
import { cn, resolveRadius } from "@/src/hooks/utils";
import { Button } from "@/src/components/atoms/Button/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./SectionCard.module.scss";

/**
 * SectionCard — the system's container shell. A card with an optional header,
 * arbitrary body content, and an optional footer; collapsible, recolourable, and
 * deeply nestable. One primitive covers rxpad sections, multi-section forms
 * (patient: Personal · Additional · Address), plan clusters (an outer tinted
 * shell holding inner cards), examination panels, and dashboard blocks.
 *
 * Compose freely: put SectionCards inside a SectionCard's body to nest; set a
 * tinted `bodyBg` on the outer one for the "cluster" look. Use <Timeline> inside
 * the body for visit timelines.
 *
 * Props:
 *   title / subtitle / icon (name or node) / iconColor
 *   number       index chip on the left (plan-cluster style), tinted by `tone`
 *   amount       a pill shown under the title (e.g. "₹20,000")
 *   tone         "neutral" | "primary" | "active" | "success" | "violet" —
 *                accents the number chip + icon, and (with headerGradient) the header
 *   headerGradient  paint the header with a soft top-tinted gradient in `tone`
 *   tools        [{ icon, title, onClick, disabled, danger }] — the icon-button trio
 *                (template/save/clear pattern); rendered via the Button atom
 *   headerActions / headerExtra   extra CTAs / a full-width header row (search etc.)
 *   footer / footerAlign("start"|"between"|"end")
 *   collapsible + collapsed/defaultCollapsed/onCollapsedChange + collapseIcon
 *   sticky       sticky header (for scrolling clusters)
 *   maxBodyHeight  number|string — makes the body scroll past this height
 *   elevation    false | true | "sm" | "md" — drop shadow
 *   bordered (default true) / divided (default true) / radius / padding
 *   surface | headerBg / bodyBg / footerBg   one or per-band backgrounds
 *   children     the body — anything (table, inputs, nested SectionCards, Timeline)
 */
const TOOL_VARIANT = "tonal";

export const SectionCard = React.forwardRef(function SectionCard(
  {
    title,
    subtitle,
    icon,
    iconColor,
    number,
    amount,
    tone = "neutral",
    headerGradient = false,
    tools,
    headerActions,
    headerExtra,
    footer,
    footerAlign = "end",
    collapsible = false,
    collapsed: collapsedProp,
    defaultCollapsed = false,
    onCollapsedChange,
    collapseIcon = "chevron-down",
    sticky = false,
    maxBodyHeight,
    elevation = false,
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
  const px = (v) => (typeof v === "number" ? `${v}px` : v);

  const hasHeader =
    title != null || subtitle != null || icon != null || number != null ||
    headerActions != null || headerExtra != null || (tools && tools.length) || collapsible;

  const cardStyle = {
    ...(radius != null ? { "--sc-radius": resolveRadius(radius) } : null),
    ...(padding != null ? { "--sc-pad": px(padding) } : null),
    ...(surface ? { "--sc-bg": surface } : null),
    ...(headerBg ? { "--sc-header-bg": headerBg } : null),
    ...(bodyBg ? { "--sc-body-bg": bodyBg } : null),
    ...(footerBg ? { "--sc-footer-bg": footerBg } : null),
    ...style,
  };

  const bodyStyle = maxBodyHeight != null ? { maxHeight: px(maxBodyHeight), overflowY: "auto" } : undefined;
  const elev = elevation === true ? "md" : elevation || undefined;

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
      data-tone={tone !== "neutral" ? tone : undefined}
      data-divided={divided ? "" : undefined}
      data-collapsed={collapsed ? "" : undefined}
      data-elevation={elev}
      {...rest}
    >
      {hasHeader && (
        <header className={cn(styles.header, sticky && styles.sticky)} data-gradient={headerGradient ? "" : undefined}>
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
                <TPLibraryIcon name={collapseIcon} variant="linear" size={18} className={cn(styles.chevron, collapsed && styles.chevronCollapsed)} />
              </button>
            )}
            {number != null && <span className={styles.numberChip}>{number}</span>}
            {iconEl && (
              <span className={styles.iconChip} style={iconColor ? { color: iconColor } : undefined}>
                {iconEl}
              </span>
            )}
            {(title != null || subtitle != null || amount != null) && (
              <div className={styles.titleText}>
                {title != null && <h3 className={styles.title}>{title}</h3>}
                {(amount != null || subtitle != null) && (
                  <div className={styles.metaRow}>
                    {amount != null && <span className={styles.amount}>{amount}</span>}
                    {subtitle != null && <span className={styles.subtitle}>{subtitle}</span>}
                  </div>
                )}
              </div>
            )}
            {(headerActions != null || (tools && tools.length)) && (
              <div className={styles.headerActions}>
                {headerActions}
                {tools && tools.map((t, i) => (
                  <Button
                    key={i}
                    variant={TOOL_VARIANT}
                    theme={t.danger ? "error" : "neutral"}
                    size="sm"
                    aria-label={t.title}
                    title={t.title}
                    disabled={t.disabled}
                    onClick={t.onClick}
                    icon={typeof t.icon === "string" ? <TPLibraryIcon name={t.icon} variant="linear" size={16} /> : t.icon}
                  />
                ))}
              </div>
            )}
          </div>
          {headerExtra != null && <div className={styles.headerExtra}>{headerExtra}</div>}
        </header>
      )}

      {!collapsed && children != null && (
        <div id={bodyId} className={styles.body} style={bodyStyle}>
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
