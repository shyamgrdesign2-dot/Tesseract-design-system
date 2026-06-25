"use client";

/**
 * Alert — an inline status banner (allergy/drug-interaction warnings, page-level
 * notices). Persistent and in-flow — distinct from Toast (transient, floating)
 * and ConfirmDialog (modal).
 *
 *   <Alert status="warning" title="Allergy on file">
 *     Patient is allergic to penicillin. Review before prescribing.
 *   </Alert>
 *
 * Props:
 *   status      "info" | "success" | "warning" | "error"   default "info"
 *   title       ReactNode — bold lead line
 *   children    ReactNode — body
 *   icon        icon name | node | false — override/hide the auto status glyph
 *   action      ReactNode — trailing action(s) (compose the Button atom)
 *   onDismiss   () => void — when set, shows a × close button
 *   variant     "soft" (default, tinted) | "outline"
 *   className, …rest (spread to root)
 *
 * a11y: role="alert" for warning/error (assertive), role="status" otherwise.
 */

import * as React from "react";
import { Button } from "@/src/components/atoms/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Alert.module.scss";

// Glyphs proven to resolve (same set InputBox uses for its status icons).
const STATUS_ICON = {
  info: "info-circle",
  success: "tick-circle",
  warning: "warning",
  error: "danger",
};

export const Alert = React.forwardRef(function Alert(
  { status = "info", title, children, icon, action, onDismiss, variant = "soft", className, ...rest },
  ref,
) {
  const glyph = icon === false ? null : (icon ?? STATUS_ICON[status]);
  const assertive = status === "warning" || status === "error";
  return (
    <div
      ref={ref}
      className={cn(styles.alert, className)}
      data-status={status}
      data-variant={variant}
      role={assertive ? "alert" : "status"}
      {...rest}
    >
      {glyph != null && (
        <span className={styles.icon} aria-hidden>
          {typeof glyph === "string" ? <TPLibraryIcon name={glyph} variant="bold" size={18} /> : glyph}
        </span>
      )}
      <div className={styles.body}>
        {title != null && <p className={styles.title}>{title}</p>}
        {children != null && <div className={styles.description}>{children}</div>}
      </div>
      {action != null && <div className={styles.action}>{action}</div>}
      {onDismiss && (
        <Button
          className={styles.close}
          variant="ghost"
          theme="neutral"
          size="sm"
          aria-label="Dismiss"
          icon={<TPLibraryIcon name="close-square" variant="bold" size={16} />}
          onClick={onDismiss}
        />
      )}
    </div>
  );
});

Alert.displayName = "Alert";
export default Alert;
