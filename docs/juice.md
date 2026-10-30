# Sound, vibration and animation

Every game should feel alive: each action gets a sound, a small motion and,
on phones, a light vibration. The shared pieces below keep that consistent
across games.

## Sound (`src/lib/sound.ts`, `src/lib/sfx.ts`)

All sounds are synthesized with the Web Audio API; there are no audio
files. `sound.ts` is the engine (`tone`, `noise`, `scaleNote`); `sfx.ts` is
the palette games actually call:

| Call                 | Use it for                                          |
| -------------------- | --------------------------------------------------- |
| `sfx.start()`        | A run begins                                        |
| `sfx.pop(step)`      | Frequent light taps (`step` raises the pitch)       |
| `sfx.place(step)`    | Something lands                                     |
| `sfx.success(step)`  | A right answer (climbs with `step`)                 |
| `sfx.perfect(streak)`| A perfect hit (rises with the streak)               |
| `sfx.grow()`         | Something grows back / a bonus                      |
| `sfx.levelUp()`      | A new stage or a bigger challenge                   |
| `sfx.tick()`         | Countdown ticks                                     |
| `sfx.timeUp()`       | Time's up                                           |
| `sfx.fail()`         | A mistake or a loss                                 |
| `sfx.newBest()`      | A new personal best                                 |

Steps follow a pentatonic scale, so counting up one step per combo, level
or streak always sounds in tune. The AudioContext is created on the first
sound, which always follows a tap, so browsers allow it. Sound is always on;
there is no mute setting.

## Vibration (`src/lib/haptics.ts`)

`haptics.light()` for frequent actions, `haptics.medium()` for a success or
a landing, `haptics.heavy()` for a loss. Works on Android browsers; iOS
ignores it. Calls are always safe.

## Animation (`src/styles/animations.css`)

Shared one-shot classes. Replay one by re-mounting the element with a new
React `key` (for example `key={score}` makes `.bump` play on every point):

| Class          | Effect                                             |
| -------------- | -------------------------------------------------- |
| `.pop`         | Springy entrance that overshoots                   |
| `.bump`        | Quick swell, for numbers that changed              |
| `.float-up`    | Drifts up and fades ("+1", "Perfect!"); centered on its `left` |
| `.ring-out`    | Expanding ring that fades (works on SVG too)       |
| `.flash`       | White flash fading out                             |
| `.shake`       | Short horizontal shake (wrong answer)              |
| `.stage-shake` | Heavier shake for losing                           |
| `.stagger-in`  | Items popping in one by one; set `--i` per item    |
| `.bob`         | Gentle idle float (start buttons, title details)   |

Keyframes used by only one game live in `src/styles/game-animations.css`.
For a one-off motion on every press without re-rendering, use the Web
Animations API (`element.animate(...)`), as Click Sprint's button does.

`<Confetti />` (`src/components/game/Confetti.tsx`) fires a burst from the
center of its parent; render it when the player sets a new best.

Everything respects `prefers-reduced-motion`.

## Recipe for a new game

- start → `sfx.start()`; each action → a sound + `haptics.light()` + a
  `.bump` or `.pop` on what changed;
- streaks or levels → raise the `step`;
- loss → `sfx.fail()`, `haptics.heavy()`, a shake;
- new best → `<Confetti />` and `sfx.newBest()`.
