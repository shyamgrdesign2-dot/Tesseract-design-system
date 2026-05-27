"use client";

import { forwardRef } from "react";
import styles from "./TPButton.module.scss";

/**
 * TPButton — TatvaPractice extended CTA
 *
 * All interaction states (hover, focus, disabled, loading) are handled
 * entirely in CSS. Zero JS event handlers, zero re-renders on hover.
 *
 * Props:
 *   variant  "solid" | "outline" | "ghost" | "tonal" | "link"   default "solid"
 *   theme    "primary" | "neutral" | "error"                     default "primary"
 *   size     "sm" | "md" | "lg"                                  default "md"
 *   surface  "light" | "dark"                                    default "light"
 *   loading  boolean
 *   disabled boolean
 *   leftIcon  ReactNode
 *   rightIcon ReactNode
 */
export const TPButton = forwardRef(function TPButton(
  {
    variant  = "solid",
    theme    = "primary",
    size     = "md",
    surface  = "light",
    disabled = false,
    loading  = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      data-variant={variant}
      data-theme={theme}
      data-size={size}
      data-surface={surface}
      data-loading={loading || undefined}
      className={[styles.btn, className].filter(Boolean).join(" ")}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden />
      ) : (
        <>
          {leftIcon  && <span className={styles.icon} aria-hidden>{leftIcon}</span>}
          <span className={styles.label}>{children}</span>
          {rightIcon && <span className={styles.icon} aria-hidden>{rightIcon}</span>}
        </>
      )}
    </button>
  );
});
