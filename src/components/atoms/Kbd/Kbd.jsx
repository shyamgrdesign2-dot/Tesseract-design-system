"use client";

/**
 * Kbd — a keyboard key/shortcut cap (⌘K, Esc, ↵). Pairs with Command / Menu
 * shortcut hints and shortcut documentation.
 *
 *   <Kbd>⌘</Kbd><Kbd>K</Kbd>   ·   <Kbd>Esc</Kbd>
 *
 * Props:
 *   size   "sm" | "md"   default "md"
 *   className, …rest (spread to the <kbd>)
 */

import * as React from "react";
import { cn } from "@/src/hooks/utils";
import styles from "./Kbd.module.scss";

export const Kbd = React.forwardRef(function Kbd({ size = "md", className, children, ...rest }, ref) {
  return (
    <kbd ref={ref} className={cn(styles.kbd, className)} data-size={size} {...rest}>
      {children}
    </kbd>
  );
});

Kbd.displayName = "Kbd";
export default Kbd;
