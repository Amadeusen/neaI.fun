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

/** A stored score, or null if missing or not a valid number (e.g. edited by hand). */
function parseScore(raw: string | null): number | null {
  const value = raw === null ? NaN : Number(raw);
  return Number.isFinite(value) ? value : null;
}

/**
 * The best (highest) score saved for a game in this browser, plus `submit`
 * to record a finished run. `submit` stores the score only if it beats the
 * current best and returns whether it did, so a game can say "New best!".
 * `best` is null on the server and until a first positive score is saved.
 */
export function useBestScore(slug: string) {
  const key = `best:${slug}`;

  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const best = parseScore(raw);

  const submit = useCallback(
    (score: number): boolean => {
      const isNewBest = score > (parseScore(read(key)) ?? 0);
      if (isNewBest) write(key, String(score));
      return isNewBest;
    },
    [key],
  );

  return { best, submit };
}
