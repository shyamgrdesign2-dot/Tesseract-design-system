"use client";

import * as React from "react";
import styles from "./Tag.module.scss";

/**
 * TPTag — TP-branded multi-variant tag/label component.
 * 7 color schemes, 4 intensity variants, 3 sizes — all driven by data
 * attributes against TP color tokens. No external dependencies.
 */
export function TPTag({
  children,
  color = "blue",
  variant = "light",
  size = "md",
  icon,
  iconRight,
  onRemove,
  className,
}) {
  return (
    <span
      className={[styles.tag, className].filter(Boolean).join(" ")}
      data-color={color}
      data-variant={variant}
      data-size={size}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.remove}
          aria-label="Remove"
        >
          <svg
            width={size === "sm" ? 12 : 14}
            height={size === "sm" ? 12 : 14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
