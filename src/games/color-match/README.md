# Color Match

A target color is shown above a grid of swatches. Pick the swatch that
matches it exactly. The run is endless and played against the clock:

- **Clock**: 30 seconds at the start; every right pick adds 5 seconds and
  moves you to the next level. Under 5 seconds the clock pulses red.
- **Hearts**: three pixel-art hearts. A wrong pick costs a heart and greys
  that swatch out, and you try the same grid again.
- **Healing**: clear 5 levels in a row without a single miss and a lost
  heart comes back ("Heart restored!"). Progress shows next to the hearts
  (`3/5`); a level with a miss resets it, even once you find the answer.
- **Game over** when the hearts or the clock run out: the right answer is
  outlined for a moment, then the results. The score is the number of
  levels cleared, and the best is saved in the browser.

Tune these with `START_MS`, `BONUS_MS`, `LIVES`, `REGEN_STREAK` and `URGENT_MS` at the top of
`useColorMatch.ts`.

## Difficulty

Difficulty rises smoothly on two axes:

| Levels | Grid  | Swatches                                            |
| ------ | ----- | --------------------------------------------------- |
| 1-5    | 3 × 2 | Vivid colors with clearly different hues            |
| 6-12   | 3 × 3 | Variations of the target, still far apart           |
| 13-26  | 4 × 4 | Variations getting closer every level               |
| 27-36  | 5 × 5 |                                                     |
| 37-46  | 6 × 6 |                                                     |
| 47-56  | 7 × 7 |                                                     |
| 57+    | 8 × 8 | Tiny differences, like a color-vision test          |

From level 6, every distractor is offset from the target by the same
distance `delta` in a random direction of hue, saturation and lightness, so
none is an exact match but they all look alike at a glance. `delta` decays
exponentially: `MIN_DELTA + (START_DELTA - MIN_DELTA) * exp(-(level - 1) / DECAY_LEVELS)`,
which gives about 31 at level 10, 11.6 at level 25, 5.4 at level 40 and
approaches 2.5. Tune it with the constants at the top of `rounds.ts`.

## Files

| File             | Role                                                              |
| ---------------- | ----------------------------------------------------------------- |
| `manifest.ts`    | Title, description, theme                                         |
| `Game.tsx`       | Layout of the screens: intro, run (HUD, target, grid), results    |
| `useColorMatch.ts` | Run state: clock, bonus time, hearts, retries, sounds, best score |
| `Hud.tsx`        | Hearts with healing progress, clock with "+5s" popup, level       |
| `PixelHeart.tsx` | A 7 × 6 pixel-art heart, full or lost                             |
| `Intro.tsx`      | Start screen: shifting mosaic with an odd tile, title, Start      |
| `Title.tsx`      | "Color Match" logo, each letter of "Color" in its own hue          |
| `SwatchGrid.tsx` | The grid; fits any size and screen, swatches pop in each level    |
| `rounds.ts`      | Level rules (grid size, difficulty) and color generation          |
| `Thumbnail.tsx`  | Home tile art: a target card and a grid with the match ticked     |

## Notes

- Swatches pop in one after another on every level, the right pick pops
  with a check mark, a wrong one shakes the target and fades out.
- Easy-level swatches are at least `MIN_HUE_GAP` degrees of hue apart from
  each other, so no early round has two swatches that look identical.
- The grid's width is `min(86vw, 26rem, --grid-h × cols / rows)`, so it fits
  any screen. On short landscape screens the target card moves beside the
  grid.
- Rounds are only generated after Start is pressed, so the server render
  and the first client render always match.
