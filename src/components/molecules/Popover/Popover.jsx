"use client";

/**
 * Popover — a generic anchored floating panel (Radix-style compound parts).
 *
 * The substrate for date pickers, comboboxes, colour/quantity pickers, and rich
 * "more info" panels. Unlike Menu (a list of actions) or Tooltip (hover text),
 * Popover holds arbitrary interactive content in a focus-managed dialog.
 *
 *   <Popover>
 *     <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
 *     <PopoverContent side="bottom" align="start">…</PopoverContent>
 *   </Popover>
 *
 * Parts: Popover (root — controlled/uncontrolled `open`) · PopoverTrigger (asChild) ·
 * PopoverContent (portal, collision-aware via usePosition, focus-trapped, Escape,
 * click-outside; role="dialog").
 */

import * as React from "react";
import { Portal } from "@/src/hooks/ui/Portal";
import { Slot } from "@/src/hooks/ui/Slot";
import { useEscape, useClickOutside, useFocusTrap, usePosition } from "@/src/hooks/ui/use-overlay";
import { useIsClient } from "@/src/hooks/use-is-client";
import { cn } from "@/src/hooks/utils";
import styles from "./Popover.module.scss";

const PopoverCtx = React.createContext(null);

export function Popover({ open: openProp, defaultOpen = false, onOpenChange, children }) {
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
  return <PopoverCtx.Provider value={ctx}>{children}</PopoverCtx.Provider>;
}

export function PopoverTrigger({ asChild = false, children, onClick, ...props }) {
  const ctx = React.useContext(PopoverCtx);
  const handleClick = (e) => {
    onClick?.(e);
    if (!e.defaultPrevented) ctx?.setOpen((o) => !o);
  };
  const triggerProps = {
    ref: ctx?.triggerRef,
    "aria-haspopup": "dialog",
    "aria-expanded": ctx?.open || false,
    "data-state": ctx?.open ? "open" : "closed",
    onClick: handleClick,
    ...props,
  };
  if (asChild) return <Slot {...triggerProps}>{children}</Slot>;
  return <button type="button" {...triggerProps}>{children}</button>;
}

export function PopoverContent({ side = "bottom", align = "center", sideOffset = 8, trapFocus = true, className, style, children, ...props }) {
  const ctx = React.useContext(PopoverCtx);
  const mounted = useIsClient();
  const { open, setOpen, triggerRef, contentRef } = ctx || {};
  const { x, y } = usePosition({ triggerRef, floatingRef: contentRef, open, side, align, sideOffset });

  useEscape(() => { setOpen?.(false); triggerRef?.current?.focus?.(); }, open);
  useClickOutside([triggerRef, contentRef], () => setOpen?.(false), open);
  useFocusTrap(contentRef, open && trapFocus);

  if (!open || !mounted) return null;
  return (
    <Portal>
      <div
        ref={contentRef}
        role="dialog"
        className={cn(styles.content, className)}
        style={{ position: "fixed", top: y, left: x, ...style }}
        {...props}
      >
        {children}
      </div>
    </Portal>
  );
}

Popover.displayName = "Popover";
PopoverTrigger.displayName = "PopoverTrigger";
PopoverContent.displayName = "PopoverContent";

export default Popover;
