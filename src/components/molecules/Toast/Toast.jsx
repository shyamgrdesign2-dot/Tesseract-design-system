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
 *   onDismiss    () => void
 */

import { useState } from "react";
import styles from "./Toast.module.scss";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";

// Status → solid TP icon (success uses the "verify" seal-check).
// Icon color comes from .icon[data-status] in the SCSS (currentColor).
const STATUS_ICON = {
  info:    { name: "info",    variant: "bold" },
  success: { name: "verify",  variant: "bold" },
  warning: { name: "warning", variant: "bold" },
  error:   { name: "error",   variant: "bold" },
};

export function Toast({
  status = "info",
  title,
  children,
  action,
  showIcon = true,
  icon: iconOverride,
  dismissible = false,
  onDismiss,
  className = "",
  style,
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

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
        <button
          type="button"
          className={styles.dismiss}
          aria-label="Dismiss"
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
        >
          {/* Square solid × — same glyph as the confirm-dialog close */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

Toast.displayName = "Toast";
export default Toast;
