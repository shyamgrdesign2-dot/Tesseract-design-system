"use client";

import { forwardRef, useId, useMemo, useRef, useState } from "react";
import { cn, resolveRadius } from "@/src/hooks/utils";
import styles from "./InputOTP.module.scss";

/**
 * InputOTP — one-time-code / PIN input. Renders `length` separate single-char
 * boxes with auto-advance, backspace-to-previous, arrow-key nav, and
 * paste-to-fill across all boxes. Built for 2FA and e-prescription sign-off.
 *
 * Controlled/uncontrolled parity: pass `value` + `onChange`, or `defaultValue`.
 * `onComplete(code)` fires once every box is filled.
 *
 * Props:
 *   length      number — number of boxes                              default 6
 *   value       string — controlled value (≤ length chars)
 *   defaultValue string — initial value (uncontrolled)               default ""
 *   onChange    (code: string) => void
 *   onComplete  (code: string) => void — fires when all boxes filled
 *   allow       "numeric" | "alphanumeric" | "any"                    default "numeric"
 *   size        "sm" | "md" | "lg"                                    default "md"
 *   status      "default" | "error" | "success"                      default "default"
 *   mask        boolean — render as password dots                     default false
 *   separator   ReactNode — rendered between groups when `groupSize` set
 *   groupSize   number — insert a separator every N boxes (e.g. 3 → "123 456")
 *   radius      number | "pill" | "sharp" — per-box corner radius
 *   disabled    boolean
 *   autoFocus   boolean — focus the first box on mount
 *   inputMode   string — keyboard hint; defaults from `allow`
 *   ariaLabel   string — group label for assistive tech     default "Verification code"
 */
export const InputOTP = forwardRef(function InputOTP(
  {
    length = 6,
    value,
    defaultValue = "",
    onChange,
    onComplete,
    allow = "numeric",
    size = "md",
    status = "default",
    mask = false,
    separator = "-",
    groupSize,
    radius,
    disabled = false,
    autoFocus = false,
    inputMode,
    ariaLabel = "Verification code",
    className,
    ...rest
  },
  ref,
) {
  const isControlled = value != null;
  const [internal, setInternal] = useState(() => defaultValue.slice(0, length));
  const code = (isControlled ? value : internal).slice(0, length);
  const boxesRef = useRef([]);
  const groupId = useId();

  const pattern = useMemo(() => {
    if (allow === "numeric") return /[^0-9]/g;
    if (allow === "alphanumeric") return /[^a-zA-Z0-9]/g;
    return null;
  }, [allow]);

  const sanitize = (raw) => (pattern ? raw.replace(pattern, "") : raw);

  const commit = (next) => {
    const clamped = next.slice(0, length);
    if (!isControlled) setInternal(clamped);
    onChange?.(clamped);
    if (clamped.length === length && next.length >= length) onComplete?.(clamped);
  };

  const focusBox = (i) => {
    const el = boxesRef.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select?.();
  };

  const setCharAt = (i, ch) => {
    const arr = code.padEnd(length, " ").split("");
    arr[i] = ch || " ";
    return arr.join("").replace(/ +$/g, "");
  };

  const handleChange = (i) => (e) => {
    const cleaned = sanitize(e.target.value);
    if (!cleaned) {
      // deletion handled in keyDown; ignore empty change
      return;
    }
    // take the last typed char (handles overwrite when box already had a value)
    const ch = cleaned[cleaned.length - 1];
    commit(setCharAt(i, ch));
    if (i < length - 1) focusBox(i + 1);
  };

  const handleKeyDown = (i) => (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (code[i]) {
        commit(setCharAt(i, ""));
      } else if (i > 0) {
        commit(setCharAt(i - 1, ""));
        focusBox(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    } else if (e.key === "Delete") {
      e.preventDefault();
      commit(setCharAt(i, ""));
    }
  };

  const handlePaste = (i) => (e) => {
    e.preventDefault();
    const pasted = sanitize(e.clipboardData.getData("text"));
    if (!pasted) return;
    const arr = code.padEnd(length, " ").split("");
    for (let k = 0; k < pasted.length && i + k < length; k++) arr[i + k] = pasted[k];
    const next = arr.join("").replace(/ +$/g, "");
    commit(next);
    focusBox(Math.min(i + pasted.length, length - 1));
  };

  const resolvedInputMode = inputMode || (allow === "numeric" ? "numeric" : "text");
  const radiusStyle = radius != null ? { "--otp-radius": resolveRadius(radius) } : undefined;

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      data-size={size}
      data-status={status}
      data-disabled={disabled || undefined}
      className={cn(styles.root, className)}
      style={radiusStyle}
      {...rest}
    >
      {Array.from({ length }).map((_, i) => {
        const showSep = groupSize && i > 0 && i % groupSize === 0;
        return (
          <span key={`${groupId}-${i}`} className={styles.cell}>
            {showSep ? (
              <span aria-hidden="true" className={styles.separator}>
                {separator}
              </span>
            ) : null}
            <input
              ref={(el) => {
                boxesRef.current[i] = el;
              }}
              className={styles.box}
              type={mask ? "password" : "text"}
              inputMode={resolvedInputMode}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              disabled={disabled}
              autoFocus={autoFocus && i === 0}
              aria-label={`${ariaLabel} digit ${i + 1}`}
              value={code[i] || ""}
              onChange={handleChange(i)}
              onKeyDown={handleKeyDown(i)}
              onPaste={handlePaste(i)}
              onFocus={(e) => e.target.select()}
            />
          </span>
        );
      })}
    </div>
  );
});

InputOTP.displayName = "InputOTP";

export default InputOTP;
