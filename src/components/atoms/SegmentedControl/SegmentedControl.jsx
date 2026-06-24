"use client";

import * as React from "react";
import { useAnalytics, resolveTrack } from "@/src/analytics/context";
import { resolveRadius } from "@/src/hooks/utils";
import styles from "./SegmentedControl.module.scss";

export const SegmentedControl = React.forwardRef(function SegmentedControl(
  {
    options = [],
    value,
    defaultValue,
    onValueChange,
    size = "md",
    variant = "pill",
    theme = "neutral",
    orientation = "horizontal",
    radius,
    indicatorColor,
    fullWidth = false,
    disabled = false,
    className = "",
    style,
    track,
    ...rest
  },
  ref,
) {
  const isVertical = orientation === "vertical";
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(
    defaultValue ?? (options.length > 0 ? options[0].value : undefined),
  );
  const current = isControlled ? value : internal;

  const rootRef = React.useRef(null);
  const itemRefs = React.useRef({});
  const [indicator, setIndicator] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [ready, setReady] = React.useState(false);

  const { track: emit } = useAnalytics();

  const measure = React.useCallback(() => {
    const root = rootRef.current;
    const el = itemRefs.current[current];
    if (!root || !el) return;
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      left: elRect.left - rootRect.left,
      top: elRect.top - rootRect.top,
      width: elRect.width,
      height: elRect.height,
    });
    setReady(true);
  }, [current]);

  React.useEffect(() => {
    measure();
  }, [measure, options.length, orientation]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [measure]);

  const handleSelect = (optValue, e) => {
    if (disabled || optValue === current) return;
    if (!isControlled) setInternal(optValue);
    const t = resolveTrack(track);
    if (t)
      emit({
        component: "SegmentedControl",
        action: "select",
        value: optValue,
        ...t,
      });
    onValueChange?.(optValue, e);
  };

  const handleKeyDown = (optValue, e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleSelect(optValue, e);
    }
  };

  const cls = [styles.root, fullWidth && styles.fullWidth, className]
    .filter(Boolean)
    .join(" ");

  const resolvedRadius = resolveRadius(radius);
  const rootStyle = {
    ...(resolvedRadius != null
      ? { "--tesseract-sc-radius": resolvedRadius }
      : null),
    ...(indicatorColor ? { "--tesseract-sc-indicator": indicatorColor } : null),
    ...style,
  };

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      role="radiogroup"
      data-size={size}
      data-variant={variant}
      data-theme={theme}
      data-orientation={orientation}
      data-disabled={disabled || undefined}
      className={cls}
      style={rootStyle}
      {...rest}
    >
      {ready && (
        <span
          className={styles.indicator}
          aria-hidden="true"
          style={
            isVertical
              ? {
                  transform: `translateY(${indicator.top}px)`,
                  height: indicator.height,
                }
              : {
                  transform: `translateX(${indicator.left}px)`,
                  width: indicator.width,
                }
          }
        />
      )}
      {options.map((opt) => {
        const isActive = opt.value === current;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              itemRefs.current[opt.value] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            data-state={isActive ? "active" : "inactive"}
            disabled={disabled || opt.disabled}
            className={styles.item}
            onClick={(e) => handleSelect(opt.value, e)}
            onKeyDown={(e) => handleKeyDown(opt.value, e)}
          >
            {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
            <span className={styles.label}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
});

SegmentedControl.displayName = "SegmentedControl";
export default SegmentedControl;
