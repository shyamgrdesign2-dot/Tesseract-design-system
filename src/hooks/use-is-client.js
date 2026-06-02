import { useSyncExternalStore } from "react";

// No external store to subscribe to — client-ness never changes after mount.
const subscribe = () => () => {};

/**
 * useIsClient — false during SSR, true once mounted on the client. Built on
 * useSyncExternalStore so client-only UI (portals/overlays) can gate render
 * without a setState-in-effect mount flag.
 */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
