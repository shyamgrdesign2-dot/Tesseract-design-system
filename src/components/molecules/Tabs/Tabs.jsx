"use client";

/**
 * Tabs — TatvaPractice tab navigation. In-house, no external deps.
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
 * Keyboard: Left/Right move between triggers, Home/End jump to first/last.
 * Activation follows focus (Radix "automatic" mode).
 */

import * as React from "react";
import styles from "./Tabs.module.scss";

const TabsContext = React.createContext(null);

// Icon size is driven by the tab size (md = 18px).
const ICON_SIZE = { sm: 16, md: 18, lg: 20 };

export function Tabs({ value, defaultValue, onValueChange, size = "md", className = "", children, ...props }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? value : internal;

  const setValue = React.useCallback(
    (next) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const ctx = React.useMemo(() => ({ value: current, setValue, size }), [current, setValue, size]);

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className} {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", style, children, ...props }) {
  const ctx = React.useContext(TabsContext);
  const cls = [styles.list, className].filter(Boolean).join(" ");
  const listRef = React.useRef(null);

  const onKeyDown = (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const triggers = Array.from(listRef.current?.querySelectorAll('[role="tab"]:not([disabled])') || []);
    if (triggers.length === 0) return;
    const idx = triggers.indexOf(document.activeElement);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % triggers.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + triggers.length) % triggers.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = triggers.length - 1;
    if (next !== idx) {
      e.preventDefault();
      triggers[next].focus();
      triggers[next].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      data-size={ctx?.size || "md"}
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
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? "active" : "inactive"}
      data-disabled={disabled || undefined}
      disabled={disabled}
      className={cls}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {leftIcon != null && <span className={styles.icon}>{withIconProps(leftIcon)}</span>}
      {children != null && <span className={styles.label}>{children}</span>}
      {tag != null && <span className={styles.tag} data-tone={tagTone}>{tag}</span>}
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
    <div role="tabpanel" data-state="active" className={cls} style={style} {...props}>
      {children}
    </div>
  );
}

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";
