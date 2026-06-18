"use client";

/**
 * Tooltip — Tesseract tooltip molecule. First-party, no external deps
 * (built on the shared Portal / Slot / usePosition / useEscape / useClickOutside).
 *
 * Two consumption styles:
 *   1. Wrapper:   <Tooltip content="Save" side="bottom"><Button/></Tooltip>
 *   2. Compound:  <TooltipProvider><Tooltip><TooltipTrigger asChild>…</TooltipTrigger>
 *                  <TooltipContent>…</TooltipContent></Tooltip></TooltipProvider>
 *
 * Variants:
 *   trigger      "hover" | "click"     default "hover"
 *                  hover → opens on enter/focus, closes on leave/blur
 *                  click → toggles on click, stays open; closes on outside-click,
 *                          Escape, or the dismiss button
 *   dismissible  boolean — show a square × dismiss button inside the tooltip
 *   icon         ReactNode — leading icon inside the tooltip (with / without)
 *
 * Other props: side, align, sideOffset, variant ("dark"|"light"), arrow,
 *   maxWidth, disabled, whenTruncated (hover only), open/defaultOpen/onOpenChange.
 */

import * as React from "react";
import { Slot } from "@/src/hooks/ui/Slot";
import { Portal } from "@/src/hooks/ui/Portal";
import { usePosition, useEscape, useClickOutside } from "@/src/hooks/ui/use-overlay";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import styles from "./Tooltip.module.scss";

const ProviderContext = React.createContext({ delayDuration: 200 });
const TooltipContext = React.createContext(null);

let _id = 0;
const nextId = () => `tp-tt-${++_id}`;

function isOverflowing(el) {
  if (!el) return false;
  return el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
}

export function TooltipProvider({ delayDuration = 200, children }) {
  const value = React.useMemo(() => ({ delayDuration }), [delayDuration]);
  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
  collisionPadding = 8,
  delayDuration,
  variant = "dark",
  arrow = true,
  maxWidth = 280,
  disabled = false,
  whenTruncated = false,
  trigger = "hover",
  dismissible = false,
  icon,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
}) {
  const provider = React.useContext(ProviderContext);
  const delay = delayDuration ?? provider.delayDuration ?? 200;
  const isClick = trigger === "click";

  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(Boolean(defaultOpen));
  const open = isControlled ? Boolean(openProp) : internalOpen;
  const setOpen = React.useCallback(
    (v) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  const triggerRef = React.useRef(null);
  const floatingRef = React.useRef(null);
  // Stable id generated once per instance (lazy useState initializer — no ref
  // access during render).
  const [id] = React.useState(nextId);

  const openTimer = React.useRef(0);
  const closeTimer = React.useRef(0);
  const cancelTimers = () => { clearTimeout(openTimer.current); clearTimeout(closeTimer.current); };

  const requestOpen = () => {
    if (disabled) return;
    if (whenTruncated && !isOverflowing(triggerRef.current)) return;
    cancelTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const requestClose = () => {
    cancelTimers();
    closeTimer.current = window.setTimeout(() => setOpen(false), 60);
  };
  const toggle = () => { if (!disabled) setOpen(!open); };

  React.useEffect(() => () => cancelTimers(), []);
  useEscape(() => setOpen(false), open && (isClick || dismissible));
  // Click variant closes when clicking outside the trigger or the panel.
  useClickOutside([triggerRef, floatingRef], () => setOpen(false), open && isClick);

  const ctxValue = React.useMemo(
    () => ({
      open, setOpen, requestOpen, requestClose, toggle,
      triggerRef, floatingRef, id,
      side, align, sideOffset, collisionPadding,
      variant, arrow, maxWidth, className,
      isClick, dismissible, icon, disabled,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, id, side, align, sideOffset, collisionPadding, variant, arrow, maxWidth, className, disabled, whenTruncated, isClick, dismissible, icon],
  );

  const hasContent = content !== undefined && content !== null && content !== "";
  if (hasContent) {
    const child = React.Children.only(children);
    return (
      <TooltipContext.Provider value={ctxValue}>
        <TooltipTrigger asChild>{child}</TooltipTrigger>
        {open ? <TooltipContent>{content}</TooltipContent> : null}
      </TooltipContext.Provider>
    );
  }
  return <TooltipContext.Provider value={ctxValue}>{children}</TooltipContext.Provider>;
}

export function TooltipTrigger({ asChild, children, ...props }) {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) return children;

  const handlers = ctx.isClick
    ? {
        onClick: (e) => { props.onClick?.(e); if (!e.defaultPrevented) ctx.toggle(); },
        "aria-expanded": ctx.open,
        "aria-haspopup": "dialog",
        ref: ctx.triggerRef,
      }
    : {
        onPointerEnter: (e) => { props.onPointerEnter?.(e); ctx.requestOpen(); },
        onPointerLeave: (e) => { props.onPointerLeave?.(e); ctx.requestClose(); },
        onFocus: (e) => { props.onFocus?.(e); ctx.requestOpen(); },
        onBlur: (e) => { props.onBlur?.(e); ctx.requestClose(); },
        "aria-describedby": ctx.open ? ctx.id : undefined,
        ref: ctx.triggerRef,
      };

  if (asChild) return <Slot {...handlers}>{children}</Slot>;
  return (
    <span style={{ display: "inline-flex" }} {...handlers} {...props}>
      {children}
    </span>
  );
}

export function TooltipContent({ className = "", side: sideProp, align: alignProp, sideOffset: sideOffsetProp, collisionPadding: collisionPaddingProp, style, children, ...props }) {
  const ctx = React.useContext(TooltipContext);
  if (!ctx || !ctx.open) return null;
  return (
    <TooltipContentInner ctx={ctx} side={sideProp} align={alignProp} sideOffset={sideOffsetProp} collisionPadding={collisionPaddingProp} className={className} style={style} {...props}>
      {children}
    </TooltipContentInner>
  );
}

function TooltipContentInner({ ctx, side, align, sideOffset, collisionPadding, className, style, children, ...props }) {
  const ref = React.useRef(null);
  const bodyRef = React.useRef(null);
  // Single line → center the icon/×; wraps to 2+ lines → top-align them.
  const [multiline, setMultiline] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    const floatingRef = ctx.floatingRef;
    floatingRef.current = node;
    return () => { if (floatingRef.current === node) floatingRef.current = null; };
  }, [ctx]);

  React.useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 17;
    setMultiline(el.scrollHeight > lh * 1.6);
  }, [children]);

  const pos = usePosition({
    triggerRef: ctx.triggerRef,
    floatingRef: ref,
    open: ctx.open,
    side: side ?? ctx.side,
    align: align ?? ctx.align,
    sideOffset: sideOffset ?? ctx.sideOffset,
    collisionPadding: collisionPadding ?? ctx.collisionPadding,
  });

  const interactive = ctx.isClick || ctx.dismissible;
  const cls = [styles.content, ctx.className, className].filter(Boolean).join(" ");

  return (
    <Portal>
      <div
        ref={ref}
        id={ctx.id}
        role={interactive ? "dialog" : "tooltip"}
        data-state="open"
        data-side={pos.side}
        data-variant={ctx.variant}
        className={cls}
        style={{ position: "fixed", left: pos.x, top: pos.y, maxWidth: ctx.maxWidth, pointerEvents: interactive ? "auto" : "none", ...style }}
        {...props}
      >
        <span className={styles.inner} data-multiline={multiline || undefined}>
          {ctx.icon != null && <span className={styles.ttIcon}>{ctx.icon}</span>}
          <span ref={bodyRef} className={styles.ttBody}>{children}</span>
          {ctx.dismissible && (
            <button type="button" className={styles.ttDismiss} aria-label="Dismiss" onClick={() => ctx.setOpen(false)}>
              <TPLibraryIcon name="close-square" variant="bold" size={14} aria-hidden />
            </button>
          )}
        </span>
        {ctx.arrow ? <TooltipArrow side={pos.side} variant={ctx.variant} /> : null}
      </div>
    </Portal>
  );
}

function TooltipArrow({ side, variant }) {
  const color = variant === "light" ? "var(--tp-slate-0, #ffffff)" : "var(--tp-slate-900, #171725)";
  const base = { position: "absolute", width: 0, height: 0, borderStyle: "solid", borderColor: "transparent" };
  let style = base;
  if (side === "top") style = { ...base, bottom: -5, left: "50%", transform: "translateX(-50%)", borderWidth: "5px 5px 0 5px", borderTopColor: color };
  else if (side === "bottom") style = { ...base, top: -5, left: "50%", transform: "translateX(-50%)", borderWidth: "0 5px 5px 5px", borderBottomColor: color };
  else if (side === "left") style = { ...base, right: -5, top: "50%", transform: "translateY(-50%)", borderWidth: "5px 0 5px 5px", borderLeftColor: color };
  else if (side === "right") style = { ...base, left: -5, top: "50%", transform: "translateY(-50%)", borderWidth: "5px 5px 5px 0", borderRightColor: color };
  return <span aria-hidden style={style} />;
}

Tooltip.displayName = "Tooltip";
TooltipProvider.displayName = "TooltipProvider";
TooltipTrigger.displayName = "TooltipTrigger";
TooltipContent.displayName = "TooltipContent";
export default Tooltip;
