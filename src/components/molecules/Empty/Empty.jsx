"use client";

/**
 * Empty — empty-state for tables, lists, sidebars, and search no-results.
 *
 * A centered icon/illustration + title + description + optional action(s).
 *
 *   <Empty
 *     icon="folder-open"
 *     title="No patients yet"
 *     description="Add your first patient to get started."
 *     action={<Button leftIcon={…}>Add patient</Button>}
 *   />
 *
 * Props:
 *   icon        icon name | node — leading glyph (rendered in a soft tinted disc).
 *               Pass `media` instead for a full custom illustration.
 *   media       ReactNode — custom illustration (overrides icon)
 *   title       ReactNode
 *   description ReactNode
 *   action      ReactNode — primary action(s) (compose the Button atom)
 *   size        "sm" | "md"                         default "md"
 *   className, …rest (spread to root)
 */

import * as React from "react";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Empty.module.scss";

export const Empty = React.forwardRef(function Empty(
  { icon, media, title, description, action, size = "md", className, ...rest },
  ref,
) {
  const glyphSize = size === "sm" ? 22 : 28;
  return (
    <div ref={ref} className={cn(styles.root, className)} data-size={size} role="status" {...rest}>
      {media != null ? (
        <div className={styles.media}>{media}</div>
      ) : icon != null ? (
        <div className={styles.icon} aria-hidden>
          {typeof icon === "string" ? <TPLibraryIcon name={icon} size={glyphSize} /> : icon}
        </div>
      ) : null}
      {title != null && <p className={styles.title}>{title}</p>}
      {description != null && <p className={styles.description}>{description}</p>}
      {action != null && <div className={styles.action}>{action}</div>}
    </div>
  );
});

Empty.displayName = "Empty";
export default Empty;
