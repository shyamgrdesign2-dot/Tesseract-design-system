"use client";

/**
 * TPIcon — the single icon component. 100% CDN-backed; no icon assets live in
 * the repo. Renders any icon from the Tesseract icon CDN via <TPLibraryIcon/>:
 *
 *   <base>/<corner>/<style>/<family>/<name>.svg
 *
 * Only size / color / variant / corner are configured locally; the SVG itself is
 * always fetched from the CDN and tinted to `currentColor` (or an explicit
 * `color`) via a CSS mask. Use the exact CDN icon name.
 *
 * Props:
 *   name     CDN icon name (e.g. "calendar-1"); also accepts "<style>/<name>"
 *   variant  "linear" | "bold" | "bulk" | "broken" | "twotone" | "outline"  (default "linear")
 *   corner   "rounded" | "straight"   (default "rounded")
 *   size     number (px)              (default 20)
 *   color    any CSS color            (default currentColor)
 *   className, style
 */

import { TPLibraryIcon } from "./TPLibraryIcon";

export function TPIcon(props) {
  return <TPLibraryIcon {...props} />;
}

TPIcon.displayName = "TPIcon";

// Curated set of common CDN names, for icon pickers / story controls. Every name
// here resolves from the CDN (no local assets).
export const TP_ICON_NAMES = [
  "plus", "verify", "chevron-down", "chevron-up", "chevron-left", "chevron-right",
  "search", "close", "close-circle", "eye", "edit", "trash", "more", "more-horizontal",
  "success", "warning", "error", "filter", "printer", "document", "profile", "settings",
  "refresh", "copy", "menu", "call", "clipboard", "health", "heart", "calendar", "folder",
  "message", "ambulance", "hospital", "download", "sort", "notification", "send",
];

export default TPIcon;
