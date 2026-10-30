import { noise, scaleNote, tone } from "./sound";

/**
 * The site's sound palette. Games call these by meaning ("success",
 * "fail") rather than building tones themselves, so every game sounds like
 * part of the same family. Steps are pentatonic, so counting up a step per
 * combo or level always stays in tune.
 */
export const sfx = {
  /** A run begins: quick rising three-note arpeggio. */
  start() {
    [0, 2, 4].forEach((s, i) =>
      tone({ freq: scaleNote(s), duration: 0.12, type: "triangle", delay: i * 0.06 }),
    );
  },

  /** A light tap; `step` raises the pitch for combos. */
  pop(step = 0) {
    tone({ freq: scaleNote(step % 15, 392), duration: 0.07, type: "triangle", volume: 0.18 });
  },

  /** Something lands: a soft thud plus a short tuned knock. */
  place(step = 0) {
    noise({ duration: 0.06, volume: 0.12, cutoff: 700 });
    tone({ freq: scaleNote(step % 15, 196), duration: 0.12, type: "triangle", volume: 0.22 });
  },

  /** A right answer; `step` makes successive answers climb. */
  success(step = 0) {
    tone({ freq: scaleNote(step % 10, 659.25), duration: 0.1, type: "sine" });
    tone({ freq: scaleNote((step % 10) + 2, 659.25), duration: 0.16, type: "sine", delay: 0.06 });
  },

  /** A perfect hit: bright two-note chime that rises with the streak. */
  perfect(streak = 1) {
    const s = Math.min(streak, 12);
    tone({ freq: scaleNote(s + 4), duration: 0.18, type: "sine", volume: 0.22 });
    tone({ freq: scaleNote(s + 6), duration: 0.28, type: "triangle", volume: 0.16, delay: 0.07 });
  },

  /** Something grows back: an upward sweep with a sparkle on top. */
  grow() {
    tone({ freq: 300, to: 900, duration: 0.3, type: "sine", volume: 0.2 });
    tone({ freq: scaleNote(10), duration: 0.2, type: "triangle", volume: 0.14, delay: 0.25 });
  },

  /** A new stage or bigger challenge: four-note fanfare. */
  levelUp() {
    [0, 2, 4, 5].forEach((s, i) =>
      tone({ freq: scaleNote(s, 659.25), duration: 0.14, type: "triangle", delay: i * 0.07 }),
    );
  },

  /** Clock tick for the last seconds of a countdown. */
  tick() {
    tone({ freq: 1400, duration: 0.03, type: "square", volume: 0.07 });
  },

  /** Time is up: a falling two-tone buzzer. */
  timeUp() {
    tone({ freq: 523, duration: 0.18, type: "square", volume: 0.12 });
    tone({ freq: 392, duration: 0.35, type: "square", volume: 0.12, delay: 0.16 });
  },

  /** A mistake or a loss: a sagging buzz with a crash. */
  fail() {
    tone({ freq: 240, to: 70, duration: 0.45, type: "sawtooth", volume: 0.14 });
    noise({ duration: 0.3, volume: 0.15, cutoff: 900 });
  },

  /** A new personal best: a short triumphant run up the scale. */
  newBest() {
    [0, 2, 4, 5, 7].forEach((s, i) =>
      tone({ freq: scaleNote(s), duration: 0.16, type: "triangle", volume: 0.2, delay: i * 0.08 }),
    );
    tone({ freq: scaleNote(10), duration: 0.5, type: "sine", volume: 0.18, delay: 0.42 });
  },
};
