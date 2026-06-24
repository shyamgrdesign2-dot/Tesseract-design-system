import { createContext, useContext } from "react";
import { defaultTheme } from "./defaultTheme";

// Theme context lives in its own module so the provider file stays component-only.
// Carries the full resolved theme (foundation + component tokens + breakpoints),
// the active color scheme + setter, and the current responsive breakpoint.
export const ThemeContext = createContext({
  theme: defaultTheme,
  colorScheme: "light",
  setColorScheme: () => {},
  breakpoint: "desktop",
  // false on the default (no provider mounted) → lets a provider detect whether it
  // is the outermost one, so only the root provider mirrors the scheme onto the
  // document root (for portaled overlays). Real providers set this true.
  __provided: false,
});

/** Full theme + scheme + active breakpoint. */
export function useTheme() {
  return useContext(ThemeContext);
}

/** Active responsive breakpoint name (e.g. "mobile" | "tablet" | "desktop"). */
export function useBreakpoint() {
  return useContext(ThemeContext).breakpoint;
}

/** Resolved token set for one component, e.g. useComponentTokens("button"). */
export function useComponentTokens(name) {
  return useContext(ThemeContext).theme.components?.[name] ?? {};
}
