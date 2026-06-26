"use client";

/**
 * Empty — empty-state for tables, lists, sidebars, and search no-results.
 *
 * A centered icon/illustration + title + description + optional action(s) + an
 * optional text link.
 *
 *   <Empty
 *     icon="folder-open"
 *     title="No patients yet"
 *     description="Add your first patient to get started."
 *     action={<Button>Add patient</Button>}
 *     secondaryAction={<Button variant="outline" theme="neutral">Import</Button>}
 *     link={{ label: "Learn more", href: "/docs" }}
 *   />
 *
 * Props:
 *   icon        icon name | node — leading glyph (rendered in a soft tinted disc).
 *   media       ReactNode — custom illustration (overrides icon)
 *   iconSize    number — glyph size in px (the disc scales with it); else by `size`
 *   title       ReactNode
 *   description ReactNode
 *   action      ReactNode — primary action (compose the Button atom)
 *   secondaryAction ReactNode — a second CTA shown beside `action`
 *   link        { label, href?, onClick? } — a text hyperlink CTA under the actions
 *   size        "sm" | "md"                         default "md"
 *   className, …rest (spread to root)
 */

import * as React from "react";
import { Button } from "@/src/components/atoms/Button/Button";
import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { cn } from "@/src/hooks/utils";
import styles from "./Empty.module.scss";

export const Empty = React.forwardRef(function Empty(
  { icon, media, iconSize, title, description, action, secondaryAction, link, size = "md", className, style, ...rest },
  ref,
) {
  const glyphSize = iconSize ?? (size === "sm" ? 22 : 28);
  const discStyle = iconSize != null ? { "--empty-disc": `${Math.round(iconSize * 1.9)}px` } : undefined;
  return (
    <div ref={ref} className={cn(styles.root, className)} data-size={size} role="status" style={{ ...discStyle, ...style }} {...rest}>
      {media != null ? (
        <div className={styles.media}>{media}</div>
      ) : icon != null ? (
        <div className={styles.icon} aria-hidden>
          {typeof icon === "string" ? <TPLibraryIcon name={icon} size={glyphSize} /> : icon}
        </div>
      ) : null}
      {title != null && <p className={styles.title}>{title}</p>}
      {description != null && <p className={styles.description}>{description}</p>}
      {(action != null || secondaryAction != null) && (
        <div className={styles.action}>
          {action}
          {secondaryAction}
        </div>
      )}
      {link != null && (
        <div className={styles.linkRow}>
          <Button variant="link" theme="primary" size={size === "sm" ? "sm" : "md"} href={link.href} onClick={link.onClick}>
            {link.label}
          </Button>
        </div>
      )}
    </div>
  );
});

Empty.displayName = "Empty";
export default Empty;
