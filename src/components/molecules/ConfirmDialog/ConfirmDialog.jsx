"use client";

/**
 * ConfirmDialog — TP confirmation modal. Three sections: Header · Body · Footer.
 * In-house (built on DialogPrimitive); footer actions use the Button atom.
 *
 * HEADER
 *   title        h2 text
 *   (24px close icon, always present)
 *
 * BODY
 *   description  text
 *   callout      a tinted box (text / node)
 *   calloutTone  "neutral" | "warning" | "error"   default "warning"
 *                neutral → info icon (or none); warning & error → warning icon
 *   calloutIcon  boolean   show the callout icon              default true
 *   calloutPlacement "above" | "below"  box vs description    default "above"
 *   children     custom body content (overrides description/callout)
 *
 * FOOTER — up to three CTA slots: primary · secondary · tertiary.
 *   Each slot: <slot>Label, on<Slot>, <slot>Variant, <slot>Theme, <slot>Disabled.
 *   <slot>Variant: solid | outline | ghost | tonal | link
 *   <slot>Theme:   primary (TP blue) | neutral | warning | error | success
 *
 *   CONVENTION (not enforced — developer decides): the PRIMARY CTA is the safe,
 *   non-destructive action (e.g. "Keep editing" / "Close"); the destructive
 *   action lives on the SECONDARY CTA (e.g. "Discard", themed error). Tertiary
 *   sits on the left for an auxiliary action.
 *
 * Legacy aliases (kept working): warning, primaryLabel/onPrimary/primaryTone,
 *   confirmLabel/onConfirm/confirmTheme, secondaryLabel/onSecondary,
 *   cancelLabel/onCancel, secondaryTone="destructive".
 */

import * as React from "react";
import * as DialogPrimitive from "@/src/hooks/ui/DialogPrimitive";
import { Button } from "@/src/components/atoms/Button";
import { Checkbox } from "@/src/components/atoms/Checkbox";
import { TPIcon } from "@/src/components/atoms/icons/tp/TPIcon";
import styles from "./ConfirmDialog.module.scss";

const Alert = {
  Root: DialogPrimitive.Root,
  Portal: DialogPrimitive.Portal,
  Overlay: DialogPrimitive.Overlay,
  Content: React.forwardRef(function AlertContent(props, ref) {
    return <DialogPrimitive.Content ref={ref} role="alertdialog" {...props} />;
  }),
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
  Close: DialogPrimitive.Close,
};

// Icon scales with how many lines the callout text wraps to (capped at 3):
//   3 lines → 42px · 2 lines → 24px · 1 line → 24px.
function Callout({ tone = "warning", icon = true, customIcon, children }) {
  const isNeutral = tone === "neutral";
  const textRef = React.useRef(null);
  const [lines, setLines] = React.useState(1);

  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 20;
      setLines(Math.max(1, Math.min(3, Math.round(el.scrollHeight / lh))));
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [children]);

  const iconSize = lines >= 3 ? 42 : 24;

  return (
    <div className={styles.callout} data-tone={tone}>
      {icon && (
        <span className={styles.calloutIcon}>
          {customIcon ?? <TPIcon name={isNeutral ? "info" : "warning"} variant="bulk" size={iconSize} />}
        </span>
      )}
      <div ref={textRef} className={styles.calloutText}>{children}</div>
    </div>
  );
}

// One footer CTA: wraps Button in Close so it dismisses, then runs the handler.
function FooterButton({ label, onClick, variant, theme, disabled, autoClose = true, fullWidth = false }) {
  if (!label) return null;
  const btn = (
    <Button
      variant={variant}
      theme={theme}
      size="sm"
      disabled={disabled}
      style={fullWidth ? { flex: 1 } : undefined}
      onClick={(e) => {
        if (disabled) { e.preventDefault(); return; }
        if (!autoClose) e.preventDefault();
        onClick?.();
      }}
    >
      {label}
    </Button>
  );
  return autoClose ? <Alert.Close asChild>{btn}</Alert.Close> : btn;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  // Body
  description,
  callout,
  calloutTone = "warning",
  calloutIcon = true,
  calloutCustomIcon,
  calloutPlacement = "above",
  children,
  // Optional "Don't show again" style checkbox in the body.
  checkboxLabel,
  checkboxChecked,
  defaultCheckboxChecked = false,
  onCheckboxChange,
  // Primary CTA (safe action, by convention)
  primaryLabel,
  onPrimary,
  primaryVariant = "solid",
  primaryTheme = "primary",
  primaryDisabled = false,
  primaryAutoClose = true,
  // Secondary CTA (destructive action, by convention)
  secondaryLabel,
  onSecondary,
  secondaryVariant = "outline",
  secondaryTheme = "neutral",
  secondaryDisabled = false,
  // Tertiary CTA (auxiliary, left side)
  tertiaryLabel,
  onTertiary,
  tertiaryVariant = "link",
  tertiaryTheme = "neutral",
  // Footer CTA layout
  actionsAlign = "right",     // "left" | "right" — which side primary/secondary sit
  actionsFullWidth = false,   // true → primary/secondary stretch to equal width
  // ── Legacy aliases ──
  warning,
  primaryTone,
  confirmLabel,
  onConfirm,
  confirmTheme,
  confirmDisabled,
  cancelLabel,
  onCancel,
  secondaryTone,
}) {
  const pLabel = primaryLabel ?? confirmLabel;
  const pOnClick = onPrimary ?? onConfirm;
  const pTheme = confirmTheme ?? primaryTone ?? primaryTheme;
  const pDisabled = confirmDisabled ?? primaryDisabled;
  const sLabel = secondaryLabel ?? cancelLabel;
  const sOnClick = onSecondary ?? onCancel;
  const sTheme = secondaryTone === "destructive" ? "error" : secondaryTheme;
  const calloutContent = callout ?? warning;
  const cTone = callout ? calloutTone : warning ? "warning" : calloutTone;

  // "Don't show again" checkbox state (controlled or uncontrolled).
  const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultCheckboxChecked));
  const cbChecked = checkboxChecked !== undefined ? checkboxChecked : internalChecked;
  const setChecked = (v) => {
    if (checkboxChecked === undefined) setInternalChecked(Boolean(v));
    onCheckboxChange?.(Boolean(v));
  };

  const box = calloutContent ? <Callout tone={cTone} icon={calloutIcon} customIcon={calloutCustomIcon}>{calloutContent}</Callout> : null;
  const desc = description ? <Alert.Description className={styles.description}>{description}</Alert.Description> : null;
  const hasBody = box || desc || children || checkboxLabel;

  return (
    <Alert.Root open={open} onOpenChange={onOpenChange}>
      <Alert.Portal>
        <Alert.Overlay className={styles.overlay} />
        <Alert.Content data-voice-allow className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <Alert.Title className={styles.title}>{title}</Alert.Title>
            <Alert.Close asChild>
              <button type="button" aria-label="Close" className={styles.closeBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </Alert.Close>
          </div>

          <div className={styles.divider} aria-hidden />

          {/* Body */}
          {hasBody && (
            <div className={styles.body}>
              {children ?? (calloutPlacement === "above" ? <>{box}{desc}</> : <>{desc}{box}</>)}
              {checkboxLabel && (
                <div className={styles.checkboxRow}>
                  <Checkbox size="sm" checked={cbChecked} onCheckedChange={setChecked} />
                  <span className={styles.checkboxLabel} onClick={() => setChecked(!cbChecked)}>{checkboxLabel}</span>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className={styles.footer} data-align={actionsAlign} data-full={actionsFullWidth || undefined}>
            <div className={styles.footerLeft}>
              <FooterButton label={tertiaryLabel} onClick={onTertiary} variant={tertiaryVariant} theme={tertiaryTheme} />
            </div>
            <div className={styles.footerRight}>
              <FooterButton label={sLabel} onClick={sOnClick} variant={secondaryVariant} theme={sTheme} disabled={secondaryDisabled} fullWidth={actionsFullWidth} />
              <FooterButton label={pLabel} onClick={pOnClick} variant={primaryVariant} theme={pTheme} disabled={pDisabled} autoClose={primaryAutoClose && !pDisabled} fullWidth={actionsFullWidth} />
            </div>
          </div>
        </Alert.Content>
      </Alert.Portal>
    </Alert.Root>
  );
}

ConfirmDialog.displayName = "ConfirmDialog";
export default ConfirmDialog;
