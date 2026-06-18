"use client";

/**
 * TPAnalyticsProvider — the single place products wire up action tracking for
 * every Tesseract component beneath it. Components (Button, DataTable, …)
 * emit semantic events; this provider stamps each with a timestamp + shared
 * context and forwards it to your `onTrack` sink (Segment, GA, Amplitude, a
 * console logger — anything).
 *
 *   <TPAnalyticsProvider
 *     onTrack={(e) => analytics.track(e.action, e)}
 *     context={{ surface: "rxpad", clinicId, meta: { build } }}
 *   >
 *     <App />
 *   </TPAnalyticsProvider>
 *
 * Props:
 *   onTrack   (event) => void   the sink. Omit/disabled → tracking is a no-op.
 *   context   object            merged into every event (e.g. surface/user ids).
 *                               Its `meta` is deep-merged with the event's meta.
 *   disabled  boolean           hard kill-switch (e.g. before consent).
 *
 * Providers nest: an inner provider overrides the sink for its subtree.
 */

import * as React from "react";
import { AnalyticsContext } from "./context";

export function TPAnalyticsProvider({ onTrack, context, disabled = false, children }) {
  // Keep the latest sink + context in refs so `track` stays referentially stable
  // (components can depend on it without re-subscribing every render).
  const onTrackRef = React.useRef(onTrack);
  const ctxRef = React.useRef(context);
  React.useEffect(() => {
    onTrackRef.current = onTrack;
    ctxRef.current = context;
  });

  const enabled = !disabled && typeof onTrack === "function";

  const value = React.useMemo(() => ({
    enabled,
    track: (event) => {
      const fn = onTrackRef.current;
      if (disabled || typeof fn !== "function") return;
      const base = ctxRef.current || {};
      fn({
        timestamp: Date.now(),
        ...base,
        ...event,
        meta: { ...(base.meta || {}), ...(event?.meta || {}) },
      });
    },
  }), [enabled, disabled]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

TPAnalyticsProvider.displayName = "TPAnalyticsProvider";
export default TPAnalyticsProvider;
