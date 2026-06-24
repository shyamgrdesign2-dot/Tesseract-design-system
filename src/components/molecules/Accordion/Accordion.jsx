"use client";

/**
 * Accordion — hand-rolled disclosure molecule (no Radix).
 *
 * API mirrors Radix UI Accordion so callers don't change:
 *   <Accordion type="single" | "multiple" collapsible value | defaultValue onValueChange>
 *     <AccordionItem value="...">
 *       <AccordionTrigger>label</AccordionTrigger>
 *       <AccordionContent>body</AccordionContent>
 *     </AccordionItem>
 *   </Accordion>
 *
 * Each trigger sets `data-state="open|closed"` so existing styling
 * (the chevron rotate selector) keeps working.
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./Accordion.module.scss";

const AccordionContext = React.createContext(null);
const AccordionItemContext = React.createContext(null);

export const Accordion = React.forwardRef(function Accordion(
  {
    type = "single",
    collapsible = false,
    value,
    defaultValue,
    onValueChange,
    // Defaults below preserve the current look: chevron-down on the right,
    // comfortable density. Triggers inherit these unless they override locally.
    expandIcon = "chevron-down",
    iconPosition = "right",
    density = "comfortable",
    className = "",
    style,
    children,
    ...props
  },
  ref,
) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(
    defaultValue ?? (type === "multiple" ? [] : ""),
  );
  const current = isControlled ? value : internal;

  const setValue = React.useCallback(
    (next) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const toggle = React.useCallback(
    (itemValue) => {
      if (type === "multiple") {
        const list = Array.isArray(current) ? current : [];
        const next = list.includes(itemValue)
          ? list.filter((v) => v !== itemValue)
          : [...list, itemValue];
        setValue(next);
      } else {
        if (current === itemValue) {
          if (collapsible) setValue("");
        } else {
          setValue(itemValue);
        }
      }
    },
    [type, collapsible, current, setValue],
  );

  const isOpen = React.useCallback(
    (itemValue) =>
      type === "multiple"
        ? Array.isArray(current) && current.includes(itemValue)
        : current === itemValue,
    [type, current],
  );

  const ctx = React.useMemo(
    () => ({ toggle, isOpen, expandIcon, iconPosition }),
    [toggle, isOpen, expandIcon, iconPosition],
  );

  const rootCls = [styles.root, className].filter(Boolean).join(" ");

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={ref}
        className={rootCls}
        style={style}
        data-density={density}
        {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

export const AccordionItem = React.forwardRef(function AccordionItem(
  { value, disabled = false, className = "", style, children, ...props },
  ref,
) {
  const root = React.useContext(AccordionContext);
  // A disabled item is never reported as open and can't be toggled.
  const open = disabled ? false : root?.isOpen(value) ?? false;
  const cls = [styles.item, disabled ? styles.itemDisabled : "", className]
    .filter(Boolean)
    .join(" ");
  // Stable ids so the trigger and content can be associated for a11y
  // (aria-controls / aria-labelledby) without changing the DOM structure.
  const uid = React.useId();
  const triggerId = `${uid}-trigger`;
  const contentId = `${uid}-content`;
  const itemCtx = React.useMemo(
    () => ({
      value,
      open,
      disabled,
      triggerId,
      contentId,
      toggle: () => !disabled && root?.toggle(value),
    }),
    [value, open, disabled, triggerId, contentId, root],
  );
  return (
    <AccordionItemContext.Provider value={itemCtx}>
      <div
        ref={ref}
        className={cls}
        style={style}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

// Render the disclosure indicator: an icon-name string resolves via the CDN
// (sized 16, rotates on open), while a node is rendered as-is. Returning a
// string name keeps the default chevron-down/16 behavior unchanged.
function renderExpandIcon(icon) {
  if (icon == null || icon === false) return null;
  if (typeof icon === "string") {
    return <TPLibraryIcon name={icon} size={16} className={styles.chevron} />;
  }
  return <span className={styles.chevron}>{icon}</span>;
}

export const AccordionTrigger = React.forwardRef(function AccordionTrigger(
  {
    className = "",
    style,
    children,
    onClick,
    // Local overrides; fall back to the root Accordion's defaults.
    expandIcon,
    iconPosition,
    headingLevel = 3,
    as,
    ...props
  },
  ref,
) {
  const root = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  const open = item?.open ?? false;
  const disabled = item?.disabled ?? false;
  const cls = [styles.trigger, className].filter(Boolean).join(" ");

  // Resolve icon + side: trigger prop wins, else the root default.
  const icon = expandIcon !== undefined ? expandIcon : root?.expandIcon ?? "chevron-down";
  const position = iconPosition || root?.iconPosition || "right";
  const indicator = renderExpandIcon(icon);

  // Heading wrapper for a11y: `as` (h1–h6 / element) wins, else headingLevel.
  const Heading = as || `h${Math.min(6, Math.max(1, headingLevel))}`;

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    item?.toggle();
  };

  return (
    <Heading style={{ margin: 0 }}>
      <button
        ref={ref}
        type="button"
        id={item?.triggerId}
        aria-expanded={open}
        aria-controls={item?.contentId}
        disabled={disabled}
        data-state={open ? "open" : "closed"}
        data-icon-position={position}
        className={cls}
        style={style}
        onClick={handleClick}
        {...props}>
        {position === "left" ? indicator : null}
        <span className={styles.label}>{children}</span>
        {position === "right" ? indicator : null}
      </button>
    </Heading>
  );
});

export const AccordionContent = React.forwardRef(function AccordionContent(
  { className = "", style, children, ...props },
  ref,
) {
  const item = React.useContext(AccordionItemContext);
  const open = item?.open ?? false;
  if (!open) return null;
  const cls = [styles.content, className].filter(Boolean).join(" ");
  return (
    <div
      ref={ref}
      role="region"
      id={item?.contentId}
      aria-labelledby={item?.triggerId}
      data-state="open"
      className={cls}
      style={style}
      {...props}>
      <div className={styles.contentInner}>{children}</div>
    </div>
  );
});

Accordion.displayName = "Accordion";
AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";
