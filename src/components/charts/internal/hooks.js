"use client";

import * as React from "react";

// Measure an element's content width, live (ResizeObserver). Returns [ref, width].
// Falls back to `initial` until measured so first paint isn't empty.
export function useElementWidth(initial = 640) {
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(initial);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      if (w && w !== width) setWidth(w);
    };
    measure();
    if (typeof ResizeObserver !== "function") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, width];
}

// Zoom + pan over a normalised x-window {lo,hi} in [0,1] (fraction of the data
// span). Wheel zooms toward the cursor; drag pans. Disabled → identity window.
export function useZoomPan(enabled) {
  const [win, setWin] = React.useState({ lo: 0, hi: 1 });
  const drag = React.useRef(null);

  const clamp = (lo, hi) => {
    const minSpan = 0.05; // never zoom in past 5% of the data
    let span = Math.max(minSpan, Math.min(1, hi - lo));
    if (lo < 0) lo = 0;
    if (lo + span > 1) lo = 1 - span;
    return { lo, hi: lo + span };
  };

  const onWheel = (e) => {
    if (!enabled) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = rect.width ? (e.clientX - rect.left) / rect.width : 0.5;
    const anchor = win.lo + frac * (win.hi - win.lo);
    const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15; // out / in
    const span = (win.hi - win.lo) * factor;
    setWin(clamp(anchor - frac * span, anchor + (1 - frac) * span));
  };

  const onPointerDown = (e) => {
    if (!enabled) return;
    drag.current = { x: e.clientX, win, width: e.currentTarget.getBoundingClientRect().width };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!enabled || !drag.current) return;
    const { x, win: w0, width } = drag.current;
    const span = w0.hi - w0.lo;
    const dx = width ? ((e.clientX - x) / width) * span : 0;
    setWin(clamp(w0.lo - dx, w0.hi - dx));
  };
  const onPointerUp = (e) => {
    drag.current = null;
    e.currentTarget?.releasePointerCapture?.(e.pointerId);
  };

  const zoomBy = (factor) => {
    const mid = (win.lo + win.hi) / 2;
    const span = (win.hi - win.lo) * factor;
    setWin(clamp(mid - span / 2, mid + span / 2));
  };

  const reset = () => setWin({ lo: 0, hi: 1 });
  const active = enabled && (win.lo > 0.001 || win.hi < 0.999);

  return {
    win: enabled ? win : { lo: 0, hi: 1 },
    active,
    handlers: enabled ? { onWheel, onPointerDown, onPointerMove, onPointerUp, onPointerLeave: onPointerUp } : {},
    zoomIn: () => zoomBy(1 / 1.4),
    zoomOut: () => zoomBy(1.4),
    reset,
  };
}
