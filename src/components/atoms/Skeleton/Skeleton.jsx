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

import styles from "./Skeleton.module.scss";

function SkeletonLine({ variant, width, height, radius, isLast, animation, speed, className, styleProp }) {
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

  const cls = [styles.skeleton, className].filter(Boolean).join(" ");

  return <span className={cls} data-animation={animation} style={dynamicStyle} aria-hidden />;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  radius,
  count = 1,
  animation = "pulse",
  speed,
  className,
  style: styleProp,
}) {
  const n = Math.max(1, Math.floor(count) || 1);

  const lineProps = (i) => ({
    variant, width, height, radius, animation, speed, className, styleProp,
    isLast: n > 1 && i === n - 1,
  });

  if (n === 1) {
    return <SkeletonLine {...lineProps(0)} />;
  }

  return (
    <span
      aria-hidden
      style={{ display: "flex", flexDirection: "column", gap: "var(--tesseract-space-2, 8px)" }}
    >
      {Array.from({ length: n }, (_, i) => (
        <SkeletonLine key={i} {...lineProps(i)} />
      ))}
    </span>
  );
}

Skeleton.displayName = "Skeleton";
export default Skeleton;
