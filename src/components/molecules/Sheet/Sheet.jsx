"use client";

/**
 * Sheet — DEPRECATED. Prefer `Drawer` (molecules/Drawer): same DialogPrimitive
 * backing, plus a standard header (close · divider · title · action), a footer
 * band, and configurable width presets ("full" | "70%" | px). Sheet is kept
 * working for existing imports.
 *
 * A modal surface that slides in from an edge. Composes the shared DialogPrimitive
 * (focus trap + scroll lock + Escape + focus restore + role="dialog"/aria-modal)
 * and just adds the edge positioning + slide animation + scrim.
 *
 * Parts: Sheet (root, controlled/uncontrolled `open`) · SheetTrigger (asChild) ·
 * SheetContent (`side` left/right/top/bottom, `showClose`) · SheetHeader ·
 * SheetTitle · SheetDescription · SheetFooter · SheetClose (asChild).
 */

import * as React from "react";
import * as Dialog from "@/src/hooks/ui/DialogPrimitive";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Sheet.module.scss";

export function Sheet(props) { return <Dialog.Root {...props} />; }
export function SheetTrigger(props) { return <Dialog.Trigger {...props} />; }
export function SheetClose(props) { return <Dialog.Close {...props} />; }

export const SheetContent = React.forwardRef(function SheetContent(
  { side = "right", showClose = true, closeIcon = "close-square", className, children, ...props },
  ref,
) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content ref={ref} data-side={side} className={cn(styles.content, className)} {...props}>
        {showClose && (
          <Dialog.Close asChild>
            <Button
              className={styles.close}
              variant="ghost"
              theme="neutral"
              size="sm"
              aria-label="Close"
              icon={<TPLibraryIcon name={closeIcon} variant="bold" size={16} />}
            />
          </Dialog.Close>
        )}
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
});

export const SheetHeader = React.forwardRef(function SheetHeader({ className, children, ...rest }, ref) {
  return <div ref={ref} className={cn(styles.header, className)} {...rest}>{children}</div>;
});
export const SheetTitle = React.forwardRef(function SheetTitle({ className, ...rest }, ref) {
  return <Dialog.Title ref={ref} className={cn(styles.title, className)} {...rest} />;
});
export const SheetDescription = React.forwardRef(function SheetDescription({ className, ...rest }, ref) {
  return <Dialog.Description ref={ref} className={cn(styles.description, className)} {...rest} />;
});
export const SheetFooter = React.forwardRef(function SheetFooter({ className, children, ...rest }, ref) {
  return <div ref={ref} className={cn(styles.footer, className)} {...rest}>{children}</div>;
});

Sheet.displayName = "Sheet";
SheetTrigger.displayName = "SheetTrigger";
SheetContent.displayName = "SheetContent";
SheetHeader.displayName = "SheetHeader";
SheetTitle.displayName = "SheetTitle";
SheetDescription.displayName = "SheetDescription";
SheetFooter.displayName = "SheetFooter";
SheetClose.displayName = "SheetClose";

export default Sheet;
