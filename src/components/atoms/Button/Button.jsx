"use client";

/**
 * Button — the single Tesseract button atom.
 *
 * One component covers every shape:
 *   • Text button            <Button>Save</Button>
 *   • With icons             <Button leftIcon={…} rightIcon={…}>Save</Button>
 *   • Icon-only (square)      <Button icon={…} aria-label="Search" />
 *   • Split (primary + menu)  <Button icon={…} menu={[…]}>New</Button>
 *
 * Styling (variant × theme × size × surface × state) is driven entirely by
 * data-* attributes + Button.module.scss — zero JS for the visual states.
 * The only stateful path is the split-button dropdown (open state + portal).
 *
 * Props:
 *   variant   "solid" | "outline" | "ghost" | "tonal" | "link"   default "solid"
 *   theme     "primary" | "neutral" | "error" | "success" | "warning"   default "primary"
 *   size      "sm" | "md" | "lg"                                  default "md"
 *   surface   "light" | "dark"                                    default "light"
 *   radius    number | "pill" | "sharp" | string
 *             — overrides the corner radius (sets --tesseract-btn-radius inline).
 *               Undefined keeps the default token radius.
 *   as        ElementType    — render a different element (e.g. "a"). Polymorphic.
 *   href      string         — when set, the button renders as a real <a href>
 *               (carrying identical styling). Ideal for the `link` variant.
 *               Polymorphism applies to the non-split shapes only.
 *   fullWidth boolean        — stretch to width:100% (default inline width).
 *   loading   boolean        — spinner, interaction disabled
 *   disabled  boolean
 *   leftIcon  / rightIcon    — ReactNode icons flanking the label
 *   icon      ReactNode      — icon-only mode (no children) OR the leading icon for split
 *   menu      Array<{ id, label, icon?, onClick?, disabled?, shortcut?, danger? }>
 *             — when present the button renders as a split button (primary + dropdown).
 *               Split supports solid / outline / tonal only; ghost & link fall back to outline.
 *   open / onOpenChange      — controlled split-menu open state (optional)
 *   track     string | { id, action?, label?, meta? }
 *             — opt-in action tracking. On click, emits an event to the nearest
 *               <TPAnalyticsProvider> ({ component:"Button", action:"click", … }).
 *               No-op when there is no provider. Split menu items take their own
 *               `track` on each `menu[]` entry.
 */

import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Button.module.scss";
import { LoadingIndicator } from "@/src/components/atoms/LoadingIndicator/LoadingIndicator";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { useIsClient } from "@/src/hooks/use-is-client";
import { useAnalytics, resolveTrack } from "@/src/analytics/context";
import { resolveRadius } from "@/src/hooks/utils";

const ICON_SIZE = { sm: 18, md: 20, lg: 22 };
const LOADER_PX = { sm: 16, md: 18, lg: 20 };

function IconSlot({ size, children }) {
  return (
    <span className={styles.icon} data-size={size} aria-hidden>
      {children}
    </span>
  );
}

export const Button = forwardRef(function Button(
  {
    variant = "solid",
    theme = "primary",
    size = "md",
    surface = "light",
    radius,
    as,
    href,
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    icon,
    menu,
    open: controlledOpen,
    onOpenChange,
    className = "",
    children,
    style: styleProp,
    onClick,
    track,
    ...props
  },
  ref
) {
  const isSplit = Array.isArray(menu) && menu.length > 0;
  const iconOnly = !!icon && children == null && !isSplit;
  const isDisabled = disabled || loading;

  // ── Action tracking (opt-in via `track`; no-op without a TPAnalyticsProvider) ──
  const { track: emit } = useAnalytics();
  const handleClick = (e) => {
    const t = resolveTrack(track);
    if (t) {
      emit({
        component: "Button",
        action: "click",
        label: typeof children === "string" ? children : (props["aria-label"] || undefined),
        ...t,
      });
    }
    onClick?.(e);
  };

  // Split buttons only support filled/bordered variants — ghost/link have no
  // container to host the divider + dropdown trigger, so fall back to outline.
  const splitVariant = variant === "ghost" || variant === "link" ? "outline" : variant;

  // ── Split: dropdown state + positioning ──
  const [internalOpen, setInternalOpen] = useState(false);
  const mounted = useIsClient();
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, minWidth: 0 });
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (value) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (!isSplit) return;
    function onDocMouseDown(e) {
      if (containerRef.current?.contains(e.target)) return;
      if (menuRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSplit]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPos({ top: rect.bottom + 6, left: rect.left, minWidth: rect.width });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  // ── Shared content (label + icons), with loader overlaid when loading ──
  // The content stays in flow (just hidden) so the button keeps its exact
  // width + height; the LoadingIndicator is centered on top.
  const renderContent = () => (
    <>
      <span className={styles.content} data-hidden={loading || undefined}>
        {leftIcon && <IconSlot size={size}>{leftIcon}</IconSlot>}
        {icon && !leftIcon && <IconSlot size={size}>{icon}</IconSlot>}
        {children != null && (
          <span style={iconOnly ? undefined : { overflow: "hidden", textOverflow: "ellipsis" }}>
            {children}
          </span>
        )}
        {rightIcon && <IconSlot size={size}>{rightIcon}</IconSlot>}
      </span>
      {loading && (
        <span className={styles.loaderOverlay}>
          <LoadingIndicator type="line-simple" size={LOADER_PX[size]} />
        </span>
      )}
    </>
  );

  const dataAttrs = {
    "data-variant": variant,
    "data-theme": theme,
    "data-size": size,
    "data-surface": surface,
    "data-loading": loading || undefined,
    "data-full": fullWidth || undefined,
  };

  // Merge an inline radius override (--tesseract-btn-radius) with the caller's
  // style. Undefined `radius` leaves the SCSS default token radius untouched.
  const resolvedRadius = resolveRadius(radius);
  const mergedStyle =
    resolvedRadius != null
      ? { "--tesseract-btn-radius": resolvedRadius, ...styleProp }
      : styleProp;

  // ── SPLIT BUTTON ──
  if (isSplit) {
    const splitDataAttrs = { ...dataAttrs, "data-variant": splitVariant };
    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={[styles.splitGroup, className].filter(Boolean).join(" ")}
        data-variant={splitVariant}
        data-full={fullWidth || undefined}
        style={mergedStyle}
      >
        <button
          type="button"
          disabled={isDisabled}
          onClick={handleClick}
          className={styles.button}
          data-split-part="primary"
          {...splitDataAttrs}
          {...props}
        >
          {renderContent()}
        </button>

        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setOpen(!open)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="More actions"
          className={styles.button}
          data-split-part="trigger"
          {...splitDataAttrs}
        >
          <TPLibraryIcon
            name="chevron-down"
            size={ICON_SIZE[size]}
            style={{ transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {open &&
          mounted &&
          createPortal(
            <div
              ref={menuRef}
              role="menu"
              className={styles.menu}
              style={{
                position: "fixed",
                top: menuPos.top,
                left: menuPos.left,
                minWidth: menuPos.minWidth,
                zIndex: 2100,
              }}
            >
              {menu.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  disabled={action.disabled}
                  data-danger={action.danger || undefined}
                  className={styles.menuItem}
                  onClick={() => {
                    const it = resolveTrack(action.track);
                    if (it) emit({ component: "Button", action: "menu_select", label: action.label, ...it });
                    action.onClick?.();
                    setOpen(false);
                  }}
                >
                  {action.icon && <IconSlot size="sm">{action.icon}</IconSlot>}
                  <span className={styles.menuItemLabel}>{action.label}</span>
                  {action.shortcut ? (
                    <span className={styles.menuItemShortcut}>{action.shortcut}</span>
                  ) : (
                    <TPLibraryIcon name="chevron-right" size={16} className={styles.menuItemChevron} />
                  )}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>
    );
  }

  // ── STANDARD / ICON-ONLY BUTTON (polymorphic) ──
  // When `href` (or `as`) is provided, render a real element other than
  // <button> carrying identical styling — e.g. an <a href> for the `link`
  // variant. Native-button-only attributes (type / disabled) are dropped for
  // non-button elements; a disabled anchor is reflected with aria-disabled.
  const Component = as || (href != null ? "a" : "button");
  const isNativeButton = Component === "button";
  const elementProps = isNativeButton
    ? { type: "button", disabled: isDisabled }
    : {
        href: Component === "a" ? href : undefined,
        role: Component === "a" ? undefined : "button",
        "aria-disabled": isDisabled || undefined,
      };

  return (
    <Component
      ref={ref}
      className={[styles.button, className].filter(Boolean).join(" ")}
      style={mergedStyle}
      data-icon-only={iconOnly || undefined}
      onClick={handleClick}
      {...elementProps}
      {...dataAttrs}
      {...props}
    >
      {renderContent()}
    </Component>
  );
});

Button.displayName = "Button";
export default Button;
