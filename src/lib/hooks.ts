"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Returns `false` during server rendering and the first client render, `true`
 * afterwards. Use it to defer UI that depends on browser-only state (such as
 * the persisted cart) and avoid hydration mismatches.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
