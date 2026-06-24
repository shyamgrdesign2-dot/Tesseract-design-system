"use client";

/**
 * Tabs — Tesseract tab navigation. First-party, no external deps.
 *
 * Compound API (Radix-shaped, so callers don't change):
 *   <Tabs value | defaultValue onValueChange size="md">
 *     <TabsList>
 *       <TabsTrigger value="..." leftIcon={<TPIcon .../>} rightIcon={...} tag="3" tagTone="error">
 *         Label
 *       </TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="...">body</TabsContent>
 *   </Tabs>
 *
 * TabsTrigger structure (all optional except value + label):
 *   leftIcon   ReactNode — icon before the label (use <TPIcon/>); the active
 *              tab renders it in the "bulk" family, inactive stays "linear"
 *   rightIcon  ReactNode — icon after the tag, on the far right (same variant rule)
 *   tag        ReactNode — a pill on the right (count / status)
 *   tagTone    "neutral" | "primary" | "success" | "warning" | "error"
 *
 * Active state uses a rounded indicator bar (curved, not a hard underline).
 *
 * Root-level configurability (all optional, defaults preserve the current look):
 *   variant         "line" (default underline) | "pill" | "segment"
 *   accent / color  token name driving active text + indicator (default --tesseract-blue-600)
 *   activationMode  "automatic" (default, select on focus) | "manual" (select on Enter/Space/click)
 *   orientation     "horizontal" (default) | "vertical"
 * TabsList:
 *   fullWidth       triggers grow to fill the row equally
 *
 * Keyboard: arrow keys move between triggers (Left/Right when horizontal,
 * Up/Down when vertical), Home/End jump to first/last. In "automatic" mode
 * activation follows focus; in "manual" mode focus moves but selection waits
 * for Enter/Space/click.
 */

import * as React from "react";
import { Badge } from "@/src/components/atoms/Badge";
import { useAnalytics } from "@/src/analytics/context";
import styles from "./Tabs.module.scss";

const TabsContext = React.createContext(null);

// Icon size is driven by the tab size (md = 18px).
const ICON_SIZE = { sm: 16, md: 18, lg: 20 };

export const Tabs = React.forwardRef(function Tabs({
  value,
  defaultValue,
  onValueChange,
  size = "md",
  variant = "line",
  // `accent` is the canonical prop; `color` is an alias. Both take a token name.
  accent,
  color,
  activationMode = "automatic",
  orientation = "horizontal",
  analyticsId,
  className = "",
  style,
  children,
  ...props
}, ref) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? value : internal;
  const { track } = useAnalytics();

  // Stable base id so triggers and panels can be linked
  // (aria-controls / aria-labelledby) without changing the DOM structure.
  const baseId = React.useId();

  const setValue = React.useCallback(
    (next) => {
      if (!isControlled) setInternal(next);
      if (analyticsId) track({ component: "Tabs", id: analyticsId, action: "tab_change", value: next });
      onValueChange?.(next);
    },
    [isControlled, onValueChange, analyticsId, track],
  );

  // Resolve the accent token → a CSS var the SCSS reads for active text + indicator.
  // Default unchanged: --tesseract-blue-600. Accept a bare token name or a full var().
  const accentToken = accent ?? color;
  const accentVar = accentToken
    ? (accentToken.startsWith("var(") || accentToken.startsWith("#") ? accentToken : `var(--${accentToken.replace(/^--/, "")})`)
    : undefined;
  const rootStyle = accentVar ? { ...style, "--tesseract-tabs-accent": accentVar } : style;

  // Build matching ids for a trigger and its panel from the tab's value, so the
  // ARIA tab pattern is wired (trigger aria-controls → panel; panel
  // aria-labelledby → trigger) without restructuring the DOM.
  const idFor = React.useCallback(
    (part, v) => `${baseId}-${part}-${String(v).replace(/[^\w-]/g, "_")}`,
    [baseId],
  );

  const ctx = React.useMemo(
    () => ({ value: current, setValue, size, variant, activationMode, orientation, idFor }),
    [current, setValue, size, variant, activationMode, orientation, idFor],
  );

  const cls = [styles.root, className].filter(Boolean).join(" ");

  return (
    <TabsContext.Provider value={ctx}>
      <div ref={ref} className={cls} style={rootStyle} {...props}>{children}</div>
    </TabsContext.Provider>
  );
});

export function TabsList({ className = "", style, fullWidth = false, children, ...props }) {
  const ctx = React.useContext(TabsContext);
  const cls = [styles.list, className].filter(Boolean).join(" ");
  const listRef = React.useRef(null);
  const isVertical = ctx?.orientation === "vertical";
  // Per orientation: vertical uses Up/Down, horizontal uses Left/Right.
  const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
  const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

  const onKeyDown = (e) => {
    if (![prevKey, nextKey, "Home", "End"].includes(e.key)) return;
    const triggers = Array.from(listRef.current?.querySelectorAll('[role="tab"]:not([disabled])') || []);
    if (triggers.length === 0) return;
    const idx = triggers.indexOf(document.activeElement);
    let next = idx;
    if (e.key === nextKey) next = (idx + 1) % triggers.length;
    else if (e.key === prevKey) next = (idx - 1 + triggers.length) % triggers.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = triggers.length - 1;
    if (next !== idx) {
      e.preventDefault();
      triggers[next].focus();
      // Automatic: activation follows focus. Manual: focus only; the trigger
      // selects on Enter/Space/click (handled in TabsTrigger).
      if (ctx?.activationMode !== "manual") triggers[next].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      data-size={ctx?.size || "md"}
      data-variant={ctx?.variant || "line"}
      data-orientation={ctx?.orientation || "horizontal"}
      data-fullwidth={fullWidth || undefined}
      aria-orientation={isVertical ? "vertical" : "horizontal"}
      className={cls}
      style={style}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className = "",
  style,
  disabled,
  onClick,
  leftIcon,
  rightIcon,
  tag,
  tagTone = "neutral",
  children,
  ...props
}) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  const cls = [styles.trigger, className].filter(Boolean).join(" ");

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || disabled) return;
    ctx?.setValue(value);
  };

  // In manual mode the list moves focus without selecting; Enter/Space on the
  // focused trigger commits the selection. (A native button also fires click on
  // Enter/Space, so handleClick covers it — this guards the preventDefault path.)
  const handleKeyDown = (e) => {
    if (ctx?.activationMode === "manual" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (!disabled) ctx?.setValue(value);
    }
  };

  // Cloning injects the icon's variant + size onto TPIcon elements (ignored by
  // other nodes): active → "bulk", inactive → "linear"; size is driven by the
  // tab size (md = 18px) so callers don't need to set it.
  const iconSize = ICON_SIZE[ctx?.size] || ICON_SIZE.md;
  const withIconProps = (node) =>
    React.isValidElement(node)
      ? React.cloneElement(node, { variant: isActive ? "bulk" : "linear", size: iconSize })
      : node;

  return (
    <button
      type="button"
      role="tab"
      id={ctx?.idFor?.("trigger", value)}
      aria-selected={isActive}
      aria-controls={ctx?.idFor?.("panel", value)}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? "active" : "inactive"}
      data-disabled={disabled || undefined}
      disabled={disabled}
      className={cls}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {leftIcon != null && <span className={styles.icon}>{withIconProps(leftIcon)}</span>}
      {children != null && <span className={styles.label}>{children}</span>}
      {/* Reuse the Badge atom for the count/status pill (soft tone). */}
      {tag != null && <Badge variant="soft" color={tagTone} size={ctx?.size === "lg" ? "md" : "sm"}>{tag}</Badge>}
      {rightIcon != null && <span className={styles.icon}>{withIconProps(rightIcon)}</span>}
    </button>
  );
}

export function TabsContent({ value, className = "", style, children, ...props }) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  if (!isActive) return null;
  const cls = [styles.content, className].filter(Boolean).join(" ");
  return (
    <div
      role="tabpanel"
      id={ctx?.idFor?.("panel", value)}
      aria-labelledby={ctx?.idFor?.("trigger", value)}
      data-state="active"
      className={cls}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
