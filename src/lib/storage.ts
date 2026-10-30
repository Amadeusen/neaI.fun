"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny wrapper around localStorage for per-browser data (best scores, etc.).
 * Every key is namespaced, and every access is guarded: storage can be
 * missing or throw (private mode, blocked cookies), and the game must still
 * work, just without remembering anything.
 */

const PREFIX = "playground:";
const CHANGE_EVENT = "playground-storage";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    // Storage unavailable: silently skip persisting.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * The best (highest) score saved for a game in this browser, plus a function
 * to submit a new score; it is only stored if it beats the current best.
 * `best` is null on the server and until a first score is saved.
 */
export function useBestScore(slug: string) {
  const key = `best:${slug}`;

  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const best = raw === null ? null : Number(raw);

  const submit = useCallback(
    (score: number) => {
      const current = Number(read(key) ?? -Infinity);
      if (score > current) write(key, String(score));
    },
    [key],
  );

  return { best, submit };
}
