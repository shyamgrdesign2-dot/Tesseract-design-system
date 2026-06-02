import { useSyncExternalStore } from "react";

const QUERY = "(hover: none) and (pointer: coarse)";

function subscribe(callback) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false; // SSR: assume hover-capable until hydrated

/**
 * useTouchDevice — true on touch-only devices (e.g. tablet/mobile), detected via
 * `(hover: none) and (pointer: coarse)`. Built on useSyncExternalStore so it
 * stays in sync without setState-in-effect.
 */
export function useTouchDevice() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
