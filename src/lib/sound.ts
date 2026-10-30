/**
 * A tiny Web Audio synthesizer: every sound in the site is generated in code
 * (no audio files). The AudioContext is created lazily on the first sound,
 * which always follows a tap or key press, so browsers allow it to play.
 * Every call is a no-op on the server or if audio is unavailable.
 */

let context: AudioContext | null = null;
let output: GainNode | null = null;

function audio(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === "undefined") return null;
  try {
    if (!context) {
      context = new AudioContext();
      const compressor = context.createDynamicsCompressor();
      output = context.createGain();
      output.gain.value = 0.5;
      output.connect(compressor).connect(context.destination);
    }
    if (context.state === "suspended") void context.resume();
    return { ctx: context, out: output! };
  } catch {
    return null;
  }
}

export interface ToneOptions {
  /** Start frequency in Hz. */
  freq: number;
  /** Optional end frequency, for a pitch sweep. */
  to?: number;
  /** Length in seconds. */
  duration?: number;
  type?: OscillatorType;
  volume?: number;
  /** Seconds to wait before playing (for arpeggios). */
  delay?: number;
}

/** One oscillator note with a quick attack and an exponential fade-out. */
export function tone({
  freq,
  to,
  duration = 0.12,
  type = "sine",
  volume = 0.25,
  delay = 0,
}: ToneOptions): void {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime + delay;
  const osc = a.ctx.createOscillator();
  const gain = a.ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + duration);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(gain).connect(a.out);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** A short burst of filtered white noise (thuds, crashes, whooshes). */
export function noise({
  duration = 0.15,
  volume = 0.2,
  delay = 0,
  cutoff = 1200,
}: {
  duration?: number;
  volume?: number;
  delay?: number;
  /** Low-pass cutoff in Hz: low for thuds, high for hisses. */
  cutoff?: number;
}): void {
  const a = audio();
  if (!a) return;
  const t = a.ctx.currentTime + delay;
  const length = Math.ceil(a.ctx.sampleRate * duration);
  const buffer = a.ctx.createBuffer(1, length, a.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;

  const source = a.ctx.createBufferSource();
  const filter = a.ctx.createBiquadFilter();
  const gain = a.ctx.createGain();
  source.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  source.connect(filter).connect(gain).connect(a.out);
  source.start(t);
}

const PENTATONIC = [0, 2, 4, 7, 9];

/**
 * Frequency of the `step`-th note of a major pentatonic scale above `base`.
 * Consecutive steps always sound pleasant together, so rising streaks and
 * combos can simply count up.
 */
export function scaleNote(step: number, base = 523.25): number {
  const octave = Math.floor(step / PENTATONIC.length);
  const semitones = PENTATONIC[step % PENTATONIC.length] + 12 * octave;
  return base * 2 ** (semitones / 12);
}
