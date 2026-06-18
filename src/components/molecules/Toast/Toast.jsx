"use client";

/**
 * Toast — solid dark status message.
 *
 * Only the status icon is colored (semantic: green / gold / red, white for
 * info); text is white / lighter-white on a dark surface (no outer stroke).
 *
 * Props:
 *   status       "info" | "success" | "warning" | "error"   default "info"
 *   title        ReactNode  — primary line
 *   children     ReactNode  — optional supporting line
 *   action       ReactNode  — e.g. a dark-surface <Button>
 *   showIcon     boolean    — show the leading status icon          default true
 *   dismissible  boolean    — shows the square × button
 *   duration     number(ms) — auto-dismiss after this long; 0 = persist  default 0
 *                             (pauses while hovered; 4000–6000 is typical in apps)
 *   onDismiss    () => void
 */

import { useState, useEffect, useRef } from "react";
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

export function Toast({
  status = "info",
  title,
  children,
  action,
  showIcon = true,
  icon: iconOverride,
  dismissible = false,
  duration = 0,
  onDismiss,
  className = "",
  style,
}) {
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
  const icon = STATUS_ICON[status] ?? STATUS_ICON.info;
  const twoLine = title != null && children != null; // bigger icon spans the block
  const urgent = status === "error" || status === "warning";

  return (
    <div
      className={[styles.toast, className].filter(Boolean).join(" ")}
      style={style}
      data-status={status}
      data-lines={twoLine ? "two" : "one"}
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
          <TPLibraryIcon name="close-square" variant="bold" size={24} />
        </button>
      )}
    </div>
  );
}

Toast.displayName = "Toast";
export default Toast;
