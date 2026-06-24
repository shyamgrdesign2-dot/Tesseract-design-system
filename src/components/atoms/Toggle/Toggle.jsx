"use client";

/**
 * Toggle — on/off toggle switch atom.
 *
 * Hand-rolled (no Radix). Renders a <button role="switch"> + a hidden
 * checkbox for native form participation. Preserves the same data-state
 * and data-size attributes the SCSS module selects on, so styling is
 * unchanged.
 *
 * Props:
 *   checked / defaultChecked / onCheckedChange  (controlled or uncontrolled)
 *   disabled, required, name, value             (form integration)
 *   size: "sm" | "md" | "lg"
 *   shape: "rounded" (pill track + circular thumb) | "square" (squared track +
 *          rounded-square thumb)   default "rounded"
 *   color: "primary" (default, blue) | "success" | "error" | "warning"
 *          — the CHECKED track colour
 *   label: string | ReactNode — adjacent label; clicking it toggles
 *   labelPosition: "right" (default) | "left"
 */

import * as React from "react";
import { useAnalytics, resolveTrack } from "@/src/analytics/context";
import styles from "./Toggle.module.scss";

export const Toggle = React.forwardRef(function Toggle(
  {
    size = "md",
    shape = "rounded",
    color = "primary",
    label,
    labelPosition = "right",
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    required,
    name,
    value = "on",
    className = "",
    style,
    onClick,
    onKeyDown,
    track,
    ...rest
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(Boolean(defaultChecked));
  const isOn = isControlled ? Boolean(checked) : internal;
  const { track: emit } = useAnalytics();

  const toggle = React.useCallback(
    (e) => {
      if (disabled) return;
      const next = !isOn;
      if (!isControlled) setInternal(next);
      const t = resolveTrack(track);
      if (t) emit({ component: "Toggle", action: "toggle", value: next, ...t });
      onCheckedChange?.(next, e);
    },
    [disabled, isOn, isControlled, onCheckedChange, track, emit],
  );

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    toggle(e);
  };

  const handleKeyDown = (e) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle(e);
    }
  };

  const cls = [styles.root, className].filter(Boolean).join(" ");

  const switchEl = (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-required={required || undefined}
      data-slot="switch"
      data-state={isOn ? "checked" : "unchecked"}
      data-size={size}
      data-shape={shape}
      data-color={color}
      data-disabled={disabled || undefined}
      disabled={disabled}
      ref={ref}
      className={cls}
      style={label == null ? style : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}>
      <span className={styles.thumb} />
      {name ? (
        <input
          type="checkbox"
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          value={value}
          checked={isOn}
          required={required}
          disabled={disabled}
          onChange={() => {}}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            margin: 0,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </button>
  );

  if (label == null) return switchEl;

  return (
    <label
      className={styles.field}
      data-disabled={disabled || undefined}
      data-label-position={labelPosition}
      style={style}>
      {labelPosition === "left" ? (
        <span className={styles.label}>{label}</span>
      ) : null}
      {switchEl}
      {labelPosition === "right" ? (
        <span className={styles.label}>{label}</span>
      ) : null}
    </label>
  );
});

Toggle.displayName = "Toggle";
export default Toggle;
