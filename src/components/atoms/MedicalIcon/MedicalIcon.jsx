"use client";

/**
 * MedicalIcon (a.k.a. TPMedicalIcon) — health icons are no longer a separate set;
 * they live in the single icon library (/tp-icons/{linear,bulk,bold}). This is a
 * thin convenience wrapper over TPLibraryIcon that keeps the old API working and
 * maps the legacy style names (line → linear, solid → bold).
 *
 * Props: name, variant ("linear"|"bulk"|"bold"; legacy "line"/"solid" accepted),
 *        size, color, alt (accessible label), className, style,
 *        family (default "medical" — override to address any icon family).
 *        Any extra props (onClick, aria-*, data-*, ref, …) pass through to the
 *        underlying TPLibraryIcon, so this can serve as a general icon alias.
 */

import { TPLibraryIcon } from "@/src/components/atoms/icons/tp/TPLibraryIcon";
import { resolveTPMedicalIconName } from "./registry";

const VARIANT = { line: "linear", linear: "linear", bulk: "bulk", solid: "bold", bold: "bold" };

export function MedicalIcon({ name, variant = "linear", size = 24, color, alt, className, style, family = "medical", ...rest }) {
  const resolved = typeof name === "string" ? (resolveTPMedicalIconName(name) ?? name) : name;
  return (
    <TPLibraryIcon
      name={resolved}
      variant={VARIANT[variant] || "linear"}
      family={family}
      size={size}
      color={color}
      title={alt}
      className={className}
      style={style}
      {...rest}
    />
  );
}

MedicalIcon.displayName = "MedicalIcon";
export default MedicalIcon;
