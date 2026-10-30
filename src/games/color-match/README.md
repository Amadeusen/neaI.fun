# Color Match

A target color is shown above six swatches. Pick the swatch that matches.
Ten rounds; one wrong pick ends the run and briefly reveals the right
answer. The score is the number of rounds matched, and the best is saved in
the browser.

## Files

| File            | Role                                                             |
| --------------- | ---------------------------------------------------------------- |
| `manifest.ts`   | Title, description, theme                                        |
| `Game.tsx`      | State and layout: stats, target card, swatch grid, result        |
| `rounds.ts`     | Rules (`TOTAL_ROUNDS`) and random round generation               |
| `Thumbnail.tsx` | Home tile art: a target card and a grid with the match ticked    |

## Notes

- Colors are random HSL with fairly high saturation and mid lightness, so
  they stay vivid.
- Distractors are kept at least `MIN_HUE_GAP` degrees of hue away from the
  target, so no round has two swatches that look identical.
- Rounds are only generated after Start is pressed, so the server render
  and the first client render always match.
