"use client";

/**
 * Field — a form-field grammar: link a label, control, description, and error to
 * ANY form control with consistent layout + accessibility, so each control
 * (Checkbox/Radio/Toggle/Slider/Dropdown/DateRangePicker/custom) doesn't
 * re-implement label/help/error wiring.
 *
 *   <Field invalid={!!err}>
 *     <FieldLabel>Email</FieldLabel>
 *     <FieldControl><InputBox placeholder="you@example.com" /></FieldControl>
 *     <FieldDescription>We’ll never share it.</FieldDescription>
 *     <FieldError>{err}</FieldError>
 *   </Field>
 *
 * Field generates ids and, via FieldControl (Slot), injects `id`,
 * `aria-describedby` (→ description + error), and `aria-invalid` onto the control.
 *
 * Parts: Field (root — `invalid`, `orientation` vertical/horizontal) · FieldLabel ·
 * FieldControl (wires the control) · FieldDescription · FieldError (role="alert").
 */

import * as React from "react";
import { Slot } from "@/src/hooks/ui/Slot";
import { cn } from "@/src/hooks/utils";
import styles from "./Field.module.scss";

const FieldCtx = React.createContext(null);

export const Field = React.forwardRef(function Field({ invalid = false, orientation = "vertical", required = false, className, children, ...rest }, ref) {
  const id = React.useId();
  const ctx = React.useMemo(
    () => ({
      controlId: `${id}-control`,
      descId: `${id}-desc`,
      errorId: `${id}-error`,
      invalid,
      required,
      hasError: false,
    }),
    [id, invalid, required],
  );
  return (
    <FieldCtx.Provider value={ctx}>
      <div ref={ref} className={cn(styles.field, className)} data-orientation={orientation} data-invalid={invalid || undefined} {...rest}>
        {children}
      </div>
    </FieldCtx.Provider>
  );
});

export const FieldLabel = React.forwardRef(function FieldLabel({ className, children, ...rest }, ref) {
  const ctx = React.useContext(FieldCtx);
  return (
    <label ref={ref} htmlFor={ctx?.controlId} className={cn(styles.label, className)} {...rest}>
      {children}
      {ctx?.required && <span className={styles.required} aria-hidden> *</span>}
    </label>
  );
});

export const FieldControl = React.forwardRef(function FieldControl({ children }, ref) {
  const ctx = React.useContext(FieldCtx);
  const describedBy = [ctx?.descId, ctx?.invalid ? ctx?.errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <Slot ref={ref} id={ctx?.controlId} aria-describedby={describedBy} aria-invalid={ctx?.invalid || undefined} aria-required={ctx?.required || undefined}>
      {children}
    </Slot>
  );
});

export const FieldDescription = React.forwardRef(function FieldDescription({ className, children, ...rest }, ref) {
  const ctx = React.useContext(FieldCtx);
  return <p ref={ref} id={ctx?.descId} className={cn(styles.description, className)} {...rest}>{children}</p>;
});

export const FieldError = React.forwardRef(function FieldError({ className, children, ...rest }, ref) {
  const ctx = React.useContext(FieldCtx);
  if (children == null || children === false) return null;
  return <p ref={ref} id={ctx?.errorId} role="alert" className={cn(styles.error, className)} {...rest}>{children}</p>;
});

Field.displayName = "Field";
FieldLabel.displayName = "FieldLabel";
FieldControl.displayName = "FieldControl";
FieldDescription.displayName = "FieldDescription";
FieldError.displayName = "FieldError";

export default Field;
