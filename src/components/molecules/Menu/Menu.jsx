"use client";

/**
 * Menu — the shared action-menu primitive (Radix-style compound parts).
 *
 * An accessible, portaled action menu (role="menu" + menuitem) — distinct from
 * Dropdown (which is a value SELECT). Use it for row "…" actions, header overflow
 * menus, and nav flyouts so they share one keyboard/focus/positioning contract.
 *
 *   <Menu>
 *     <MenuTrigger asChild><Button icon={…} aria-label="Actions" /></MenuTrigger>
 *     <MenuContent>
 *       <MenuLabel>Row</MenuLabel>
 *       <MenuItem icon="edit-2" onSelect={…}>Edit</MenuItem>
 *       <MenuItem icon="copy" shortcut="⌘D" onSelect={…}>Duplicate</MenuItem>
 *       <MenuSeparator />
 *       <MenuItem icon="trash" danger onSelect={…}>Delete</MenuItem>
 *     </MenuContent>
 *   </Menu>
 *
 * Parts: Menu (root, controlled/uncontrolled open) · MenuTrigger (asChild) ·
 * MenuContent (portal, collision-aware, focus-trapped, arrow-key nav, Escape,
 * click-outside) · MenuItem (icon/shortcut/danger/disabled/onSelect) ·
 * MenuSeparator · MenuLabel.
 */

import * as React from "react";
import { Portal } from "@/src/hooks/ui/Portal";
import { Slot } from "@/src/hooks/ui/Slot";
import { useEscape, useClickOutside, useFocusTrap, usePosition } from "@/src/hooks/ui/use-overlay";
import { useIsClient } from "@/src/hooks/use-is-client";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Menu.module.scss";

const MenuCtx = React.createContext(null);

export function Menu({ open: openProp, defaultOpen = false, onOpenChange, children }) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internal;
  const setOpen = React.useCallback(
    (v) => {
      setInternal((prev) => {
        const next = typeof v === "function" ? v(isControlled ? openProp : prev) : v;
        onOpenChange?.(next);
        return isControlled ? prev : next;
      });
    },
    [isControlled, openProp, onOpenChange],
  );
  const triggerRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const ctx = React.useMemo(() => ({ open, setOpen, triggerRef, contentRef }), [open, setOpen]);
  return <MenuCtx.Provider value={ctx}>{children}</MenuCtx.Provider>;
}

export function MenuTrigger({ asChild = false, children, onClick, ...props }) {
  const ctx = React.useContext(MenuCtx);
  const handleClick = (e) => {
    onClick?.(e);
    if (!e.defaultPrevented) ctx?.setOpen((o) => !o);
  };
  const triggerProps = {
    ref: ctx?.triggerRef,
    "aria-haspopup": "menu",
    "aria-expanded": ctx?.open || false,
    "data-state": ctx?.open ? "open" : "closed",
    onClick: handleClick,
    ...props,
  };
  if (asChild) return <Slot {...triggerProps}>{children}</Slot>;
  return <button type="button" {...triggerProps}>{children}</button>;
}

export function MenuContent({ side = "bottom", align = "start", sideOffset = 6, className, style, children, ...props }) {
  const ctx = React.useContext(MenuCtx);
  const mounted = useIsClient();
  const { open, setOpen, triggerRef, contentRef } = ctx || {};
  const { x, y } = usePosition({ triggerRef, floatingRef: contentRef, open, side, align, sideOffset });

  useEscape(() => { setOpen?.(false); triggerRef?.current?.focus?.(); }, open);
  useClickOutside([triggerRef, contentRef], () => setOpen?.(false), open);
  useFocusTrap(contentRef, open);

  // Focus the first item on open.
  React.useEffect(() => {
    if (!open) return;
    const first = contentRef?.current?.querySelector('[role="menuitem"]:not([data-disabled])');
    first?.focus?.();
  }, [open, contentRef]);

  // Roving arrow-key navigation among enabled items.
  const onKeyDown = (e) => {
    const items = Array.from(contentRef?.current?.querySelectorAll('[role="menuitem"]:not([data-disabled])') || []);
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); (items[idx + 1] || items[0]).focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus(); }
    else if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); items[items.length - 1].focus(); }
  };

  if (!open || !mounted) return null;
  return (
    <Portal>
      <div
        ref={contentRef}
        role="menu"
        className={cn(styles.menu, className)}
        style={{ position: "fixed", top: y, left: x, ...style }}
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}

export function MenuItem({ icon, shortcut, danger = false, disabled = false, onSelect, onClick, children, className, ...props }) {
  const ctx = React.useContext(MenuCtx);
  const handle = (e) => {
    if (disabled) return;
    onClick?.(e);
    onSelect?.(e);
    ctx?.setOpen(false);
    ctx?.triggerRef?.current?.focus?.();
  };
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      data-disabled={disabled || undefined}
      data-danger={danger || undefined}
      className={cn(styles.item, className)}
      onClick={handle}
      {...props}
    >
      {icon != null && (
        <span className={styles.itemIcon} aria-hidden>
          {typeof icon === "string" ? <TPLibraryIcon name={icon} size={16} /> : icon}
        </span>
      )}
      <span className={styles.itemLabel}>{children}</span>
      {shortcut != null && <span className={styles.itemShortcut}>{shortcut}</span>}
    </button>
  );
}

export function MenuSeparator({ className }) {
  return <div role="separator" className={cn(styles.separator, className)} />;
}

export function MenuLabel({ className, children }) {
  return <div className={cn(styles.label, className)}>{children}</div>;
}

Menu.displayName = "Menu";
MenuTrigger.displayName = "MenuTrigger";
MenuContent.displayName = "MenuContent";
MenuItem.displayName = "MenuItem";
MenuSeparator.displayName = "MenuSeparator";
MenuLabel.displayName = "MenuLabel";

export default Menu;
