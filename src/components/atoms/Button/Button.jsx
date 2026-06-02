"use client";

/**
 * Button — the single TatvaPractice button atom.
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
 *   loading   boolean        — spinner, interaction disabled
 *   disabled  boolean
 *   leftIcon  / rightIcon    — ReactNode icons flanking the label
 *   icon      ReactNode      — icon-only mode (no children) OR the leading icon for split
 *   menu      Array<{ id, label, icon?, onClick?, disabled?, shortcut?, danger? }>
 *             — when present the button renders as a split button (primary + dropdown).
 *               Split supports solid / outline / tonal only; ghost & link fall back to outline.
 *   open / onOpenChange      — controlled split-menu open state (optional)
 */

import { forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Button.module.scss";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";
import { LoadingIndicator } from "@/src/components/atoms/LoadingIndicator/LoadingIndicator";
import { useIsClient } from "@/src/hooks/use-is-client";

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
    ...props
  },
  ref
) {
  const isSplit = Array.isArray(menu) && menu.length > 0;
  const iconOnly = !!icon && children == null && !isSplit;
  const isDisabled = disabled || loading;

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
  };

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
        style={styleProp}
      >
        <button
          type="button"
          disabled={isDisabled}
          onClick={onClick}
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
          {/* Accordion-style chevron — same glyph the Accordion uses. */}
          <svg
            width={ICON_SIZE[size]}
            height={ICON_SIZE[size]}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            focusable="false"
            style={{
              transition: "transform 200ms ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
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
                    action.onClick?.();
                    setOpen(false);
                  }}
                >
                  {action.icon && <IconSlot size="sm">{action.icon}</IconSlot>}
                  <span className={styles.menuItemLabel}>{action.label}</span>
                  {action.shortcut ? (
                    <span className={styles.menuItemShortcut}>{action.shortcut}</span>
                  ) : (
                    <TPIcon name="chevron-right" variant="linear" size={16} className={styles.menuItemChevron} />
                  )}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>
    );
  }

  // ── STANDARD / ICON-ONLY BUTTON ──
  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      className={[styles.button, className].filter(Boolean).join(" ")}
      style={styleProp}
      data-icon-only={iconOnly || undefined}
      onClick={onClick}
      {...dataAttrs}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
