"use client";

/**
 * Drawer — an edge-anchored modal panel with a consistent header / body / footer.
 *
 * The single slide-in surface for the whole system (filters, quick-view, forms,
 * bill preview, record editors). Backed by the shared DialogPrimitive (focus trap
 * + scroll lock + Escape + focus restore + role="dialog"/aria-modal); this adds
 * the standard chrome the product expects:
 *   • header: a left-aligned close button · a hairline divider · the title ·
 *     an optional right-aligned `action` slot (CTAs).
 *   • body: the scrollable middle — ANY content (reuse any molecule).
 *   • footer: an optional pinned band (totals, primary actions).
 *
 * Width is configurable as a percentage of the viewport ("full" | "90%" … "20%"),
 * a pixel number/string (capped at the viewport), or any CSS length. Top/bottom
 * drawers use `height` the same way.
 *
 *   <Drawer open={open} onOpenChange={setOpen}>
 *     <DrawerContent width="50%" title="Create Plan" action={<Button>Save</Button>}
 *       footer={<Button fullWidth>Apply</Button>}>
 *       … any content …
 *     </DrawerContent>
 *   </Drawer>
 *
 * Parts: Drawer (root) · DrawerTrigger (asChild) · DrawerContent · DrawerHeader ·
 * DrawerTitle · DrawerDescription · DrawerBody · DrawerFooter · DrawerClose.
 */

import * as React from "react";
import * as Dialog from "@/src/hooks/ui/DialogPrimitive";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Drawer.module.scss";

export function Drawer(props) { return <Dialog.Root {...props} />; }
export function DrawerTrigger(props) { return <Dialog.Trigger {...props} />; }
export function DrawerClose(props) { return <Dialog.Close {...props} />; }

// Resolve a width/height value to a CSS length.
//   "full" → 100v*  ·  "70%" → 70v*  ·  number/"600" → min(100v*, 600px)  ·  any CSS passes through.
function resolveSize(v, fallback, axis /* "vw" | "vh" */) {
  if (v == null) return fallback;
  if (v === "full") return axis === "vh" ? "100vh" : "100vw";
  if (typeof v === "number") return `min(100${axis}, ${v}px)`;
  const s = String(v).trim();
  if (s.endsWith("%")) return `${parseFloat(s)}${axis}`;
  if (/^\d+(\.\d+)?$/.test(s)) return `min(100${axis}, ${s}px)`;
  return s;
}

export const DrawerContent = React.forwardRef(function DrawerContent(
  {
    side = "right",
    width,
    height,
    title,
    description,
    action,
    footer,
    header,
    showClose = true,
    closeIcon = "close-square",
    bodyPadding,
    bodyClassName,
    className,
    children,
    ...props
  },
  ref,
) {
  const isVertical = side === "top" || side === "bottom";
  const sizeStyle = isVertical
    ? { "--drawer-h": resolveSize(height, "85vh", "vh") }
    : { "--drawer-w": resolveSize(width, "min(440px, 100vw)", "vw") };
  if (bodyPadding != null) sizeStyle["--drawer-body-pad"] = typeof bodyPadding === "number" ? `${bodyPadding}px` : bodyPadding;

  const hasHeader = header != null || title != null || action != null || showClose;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content ref={ref} data-side={side} className={cn(styles.content, className)} style={sizeStyle} {...props}>
        {hasHeader && (header != null ? header : (
          <DrawerHeader title={title} description={description} action={action} showClose={showClose} closeIcon={closeIcon} />
        ))}
        <div className={cn(styles.body, bodyClassName)}>{children}</div>
        {footer != null && <DrawerFooter>{footer}</DrawerFooter>}
      </Dialog.Content>
    </Dialog.Portal>
  );
});

export const DrawerHeader = React.forwardRef(function DrawerHeader(
  { title, description, action, showClose = true, closeIcon = "close-square", className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.header, className)} {...rest}>
      {showClose && (
        <Dialog.Close asChild>
          <button type="button" className={styles.closeBtn} aria-label="Close">
            <TPLibraryIcon name={closeIcon} variant="bold" size={22} />
          </button>
        </Dialog.Close>
      )}
      {showClose && (title != null || children != null) && <span className={styles.divider} aria-hidden="true" />}
      {children != null ? (
        children
      ) : (
        <div className={styles.headerText}>
          {title != null && <DrawerTitle>{title}</DrawerTitle>}
          {description != null && <DrawerDescription>{description}</DrawerDescription>}
        </div>
      )}
      {action != null && <div className={styles.action}>{action}</div>}
    </div>
  );
});

export const DrawerTitle = React.forwardRef(function DrawerTitle({ className, ...rest }, ref) {
  return <Dialog.Title ref={ref} className={cn(styles.title, className)} {...rest} />;
});
export const DrawerDescription = React.forwardRef(function DrawerDescription({ className, ...rest }, ref) {
  return <Dialog.Description ref={ref} className={cn(styles.description, className)} {...rest} />;
});
export const DrawerBody = React.forwardRef(function DrawerBody({ className, ...rest }, ref) {
  return <div ref={ref} className={cn(styles.body, className)} {...rest} />;
});
export const DrawerFooter = React.forwardRef(function DrawerFooter({ className, align = "end", children, ...rest }, ref) {
  return <div ref={ref} className={cn(styles.footer, className)} data-align={align} {...rest}>{children}</div>;
});

Drawer.displayName = "Drawer";
DrawerTrigger.displayName = "DrawerTrigger";
DrawerContent.displayName = "DrawerContent";
DrawerHeader.displayName = "DrawerHeader";
DrawerTitle.displayName = "DrawerTitle";
DrawerDescription.displayName = "DrawerDescription";
DrawerBody.displayName = "DrawerBody";
DrawerFooter.displayName = "DrawerFooter";
DrawerClose.displayName = "DrawerClose";

export default Drawer;
