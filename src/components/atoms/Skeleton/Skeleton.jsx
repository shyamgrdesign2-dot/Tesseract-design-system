"use client";

/**
 * Skeleton — Loading placeholder atom.
 * Styling: Skeleton.module.scss (pulse / wave / none animation + base bg).
 * Width / height / border-radius remain inline (fully dynamic per usage).
 *
 * count     — render N stacked skeletons. For variant="text" the LAST line is
 *             shortened (~60%) for realism. Default 1 = a single placeholder.
 * animation — "pulse" (default) | "wave" | "none". Driven by a data-animation
 *             attribute the SCSS switches on. Always disabled under
 *             prefers-reduced-motion.
 * speed     — animation-duration (seconds number, or any CSS time string).
 *             Default ~1.5s. Passed through as the --skeleton-speed CSS var.
 */

import { forwardRef } from "react";
import { cn } from "../../../hooks/utils";
import styles from "./Skeleton.module.scss";

function SkeletonLine({ variant, width, height, radius, isLast, animation, speed, className, styleProp, rootRef, rootRest }) {
  const defaultRadius =
    variant === "circular" ? "50%" :
    variant === "text" ? 4 :
    8;

  // Last text line of a multi-line block reads shorter, like a real paragraph.
  const textWidth = isLast ? (width ?? "60%") : (width ?? "100%");

  const speedVar =
    speed == null ? undefined : typeof speed === "number" ? `${speed}s` : speed;

  const dynamicStyle = {
    borderRadius: radius ?? defaultRadius,
    ...(speedVar ? { "--skeleton-speed": speedVar } : null),
    ...(variant === "text" ?
      { width: textWidth, height: height ?? 14 } :
    variant === "circular" ?
      { width: width ?? 40, height: height ?? width ?? 40 } :
      { width: width ?? "100%", height: height ?? 40 }),
    ...styleProp,
  };

  return (
    <span
      ref={rootRef}
      className={cn(styles.skeleton, className)}
      data-animation={animation}
      style={dynamicStyle}
      aria-hidden
      {...rootRest}
    />
  );
}

export const Skeleton = forwardRef(function Skeleton(
  {
    variant = "text",
    width,
    height,
    radius,
    count = 1,
    animation = "pulse",
    speed,
    className,
    style: styleProp,
    ...rest
  },
  ref,
) {
  const n = Math.max(1, Math.floor(count) || 1);

  const lineProps = (i) => ({
    variant, width, height, radius, animation, speed,
    isLast: n > 1 && i === n - 1,
  });

  // Single line: the SkeletonLine span IS the root — forward ref/rest/className/style to it.
  if (n === 1) {
    return (
      <SkeletonLine
        {...lineProps(0)}
        className={className}
        styleProp={styleProp}
        rootRef={ref}
        rootRest={rest}
      />
    );
  }

  // Multi line: the wrapper span is the root; per-line className/style still apply to each line.
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(styles.root, className)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--tesseract-space-2, 8px)",
        ...styleProp,
      }}
      {...rest}
    >
      {Array.from({ length: n }, (_, i) => (
        <SkeletonLine key={i} {...lineProps(i)} />
      ))}
    </span>
  );
});

Skeleton.displayName = "Skeleton";
export default Skeleton;
