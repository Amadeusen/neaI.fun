# Color Match

A target color is shown above a grid of swatches. Pick the swatch that
matches it exactly. The run is endless: each correct pick moves you to the
next level, one wrong pick ends the run and briefly reveals the right
answer. The score is the number of levels cleared, and the best is saved in
the browser.

## Difficulty

| Levels  | Grid                     | Swatches                                     |
| ------- | ------------------------ | -------------------------------------------- |
| 1-9     | 3 × 2                    | Vivid colors with clearly different hues     |
| 10-14   | 4 × 4                    | Slight variations of the target              |
| 15-19   | 5 × 5                    | Variations get subtler every level           |
| 20+     | +1 row and column every 5 levels, up to 8 × 8 | Down to tiny differences, like a color-vision test |

On hard levels every distractor is offset from the target by the same
amount (`delta`) in a random direction of hue, saturation and lightness, so
none is ever an exact match but they all look alike at a glance. `delta`
starts at `START_DELTA` on level 10 and shrinks by `DELTA_STEP` per level
down to `MIN_DELTA`.

## Files

| File             | Role                                                              |
| ---------------- | ----------------------------------------------------------------- |
| `manifest.ts`    | Title, description, theme                                         |
| `Game.tsx`       | State and layout: level, target card, messages, result            |
| `SwatchGrid.tsx` | The grid of swatches; sizes itself to the screen for any grid size |
| `rounds.ts`      | Level rules (grid size, difficulty) and color generation          |
| `Thumbnail.tsx`  | Home tile art: a target card and a grid with the match ticked     |

## Notes

- Easy-level swatches are at least `MIN_HUE_GAP` degrees of hue apart from
  each other, so no early round has two swatches that look identical.
- The grid's width is `min(86vw, 26rem, --grid-h × cols / rows)`, so it fits
  any screen. On short landscape screens the target card moves beside the
  grid.
- Rounds are only generated after Start is pressed, so the server render
  and the first client render always match.
