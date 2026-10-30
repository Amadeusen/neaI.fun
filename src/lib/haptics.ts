/**
 * Light vibration feedback on phones that support it (Android browsers;
 * iOS Safari ignores the Vibration API). Always safe to call.
 */
function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Unsupported or blocked: no vibration.
  }
}

export const haptics = {
  /** A barely-there tick, for frequent actions. */
  light: () => vibrate(8),
  /** A clear bump, for a success or a landing. */
  medium: () => vibrate(20),
  /** A double knock, for a loss. */
  heavy: () => vibrate([40, 40, 70]),
};
