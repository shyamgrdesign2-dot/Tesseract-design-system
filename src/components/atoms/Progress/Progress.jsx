"use client";

/**
 * Progress — a horizontal progress bar (uploads, imports, treatment-plan completion).
 *
 * Determinate when `value` (0–100) is set; indeterminate (animated sweep) when it
 * is omitted/null. Exposes the progressbar role + aria-value* for assistive tech.
 *
 *   <Progress value={64} />
 *   <Progress />            // indeterminate
 *
 * Props:
 *   value   number | null — 0–100; omit/null for indeterminate
 *   max     number        — value scale (default 100)
 *   size    "sm" | "md" | "lg"                 track height (default "md")
 *   tone    "primary" | "success" | "warning" | "error"   fill colour (default "primary")
 *   label   string — accessible name (aria-label) for the bar
 *   className, style, …rest (spread to root)
 */

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import styles from "./Progress.module.scss";

export const Progress = React.forwardRef(function Progress(
  { value = null, max = 100, size = "md", tone = "primary", label, className, style, ...rest },
  ref,
) {
  const indeterminate = value == null;
  const pct = indeterminate ? null : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      ref={ref}
      className={cn(styles.track, className)}
      data-size={size}
      data-tone={tone}
      data-indeterminate={indeterminate || undefined}
      role="progressbar"
      aria-label={label}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : value}
      style={style}
      {...rest}
    >
      <div className={styles.fill} style={indeterminate ? undefined : { width: `${pct}%` }} />
    </div>
  );
});

Progress.displayName = "Progress";
export default Progress;
