"use client";

/**
 * Toast — solid dark status message.
 *
 * Only the status icon is colored (semantic: green / gold / red, white for
 * info); text is white / lighter-white on a dark surface (no outer stroke).
 *
 * Props:
 *   status       "info" | "success" | "warning" | "error"   default "info"
 *   surface      "dark" | "light"  — surface variant; dark = current  default "dark"
 *   title        ReactNode  — primary line
 *   children     ReactNode  — optional supporting line
 *   action       ReactNode  — e.g. a dark-surface <Button>
 *   showIcon     boolean    — show the leading status icon          default true
 *   icon         ReactNode  — override the leading status glyph
 *   statusIcons  object     — partial { info?, success?, warning?, error? } map of
 *                             icon NAMES, merged over the built-in STATUS_ICON map
 *   dismissible  boolean    — shows the square × button
 *   closeIcon    string|node — override the dismiss glyph (icon name or node)  default close-square
 *   maxWidth     number|string — cap the toast width (number → px)        default 60%
 *   lineClamp    number     — max lines for the title-only clamp          default 2
 *   progress     boolean    — show a depleting progress bar (needs duration > 0)  default false
 *   duration     number(ms) — auto-dismiss after this long; 0 = persist  default 0
 *                             (pauses while hovered; 4000–6000 is typical in apps)
 *   onDismiss    () => void
 */

import { useState, useEffect, useRef, forwardRef } from "react";
import styles from "./Toast.module.scss";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";

// Status → solid Tesseract icon (success uses the "verify" seal-check).
// Icon color comes from .icon[data-status] in the SCSS (currentColor).
const STATUS_ICON = {
  info:    { name: "info",   variant: "bold" },
  success: { name: "verify", variant: "bold" },
  warning: { name: "danger", variant: "bold" }, // essential/danger.svg — the clean alert triangle
  error:   { name: "danger", variant: "bold" }, // same triangle; severity reads from the status colour
};

// Coerce a numeric maxWidth/size to a px string; pass strings (e.g. "60%") through.
const toLength = (v) => (typeof v === "number" ? `${v}px` : v);

export const Toast = forwardRef(function Toast({
  status = "info",
  surface = "dark",
  title,
  children,
  action,
  showIcon = true,
  icon: iconOverride,
  statusIcons,
  dismissible = false,
  closeIcon,
  maxWidth,
  lineClamp,
  progress = false,
  duration = 0,
  onDismiss,
  className = "",
  style,
  ...rest
}, ref) {
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => { onDismissRef.current = onDismiss; });

  // Auto-dismiss after `duration` ms (opt-in). The timer pauses while hovered so
  // a reader is never rushed; it restarts on mouse-leave.
  useEffect(() => {
    if (!duration || !visible || paused) return undefined;
    const id = setTimeout(() => { setVisible(false); onDismissRef.current?.(); }, duration);
    return () => clearTimeout(id);
  }, [duration, visible, paused]);

  if (!visible) return null;

  const dismiss = () => { setVisible(false); onDismiss?.(); };
  // Default status glyph, with any per-status name overrides merged on top.
  const base = STATUS_ICON[status] ?? STATUS_ICON.info;
  const overrideName = statusIcons?.[status];
  const icon = overrideName ? { ...base, name: overrideName } : base;
  const twoLine = title != null && children != null; // bigger icon spans the block
  const urgent = status === "error" || status === "warning";
  const showProgress = progress && duration > 0;

  // Inline CSS vars wire the SCSS caps (max-width / line-clamp / progress duration).
  const cssVars = {
    ...(maxWidth != null ? { "--toast-max-width": toLength(maxWidth) } : null),
    ...(lineClamp != null ? { "--toast-line-clamp": lineClamp } : null),
    ...(showProgress ? { "--toast-duration": `${duration}ms` } : null),
  };

  return (
    <div
      ref={ref}
      {...rest}
      className={[styles.toast, className].filter(Boolean).join(" ")}
      style={{ ...cssVars, ...style }}
      data-status={status}
      data-surface={surface}
      data-lines={twoLine ? "two" : "one"}
      data-paused={showProgress && paused ? "true" : undefined}
      role={urgent ? "alert" : "status"}
      aria-live={urgent ? "assertive" : "polite"}
      onMouseEnter={duration ? () => setPaused(true) : undefined}
      onMouseLeave={duration ? () => setPaused(false) : undefined}
    >
      {showIcon && (
        <span className={styles.icon} data-status={status}>
          {iconOverride ?? <TPIcon name={icon.name} variant={icon.variant} size={twoLine ? 42 : 24} />}
        </span>
      )}

      <div className={styles.body}>
        {title != null && <p className={styles.title}>{title}</p>}
        {children != null && <div className={styles.message}>{children}</div>}
      </div>

      {action && <div className={styles.action}>{action}</div>}

      {dismissible && (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={dismiss}>
          {closeIcon != null
            ? (typeof closeIcon === "string"
                ? <TPLibraryIcon name={closeIcon} variant="bold" size={24} />
                : closeIcon)
            : <TPLibraryIcon name="close-square" variant="bold" size={24} />}
        </button>
      )}

      {showProgress && (
        <div className={styles.progress} aria-hidden="true">
          <div className={styles.progressBar} />
        </div>
      )}
    </div>
  );
});

Toast.displayName = "Toast";
export default Toast;
