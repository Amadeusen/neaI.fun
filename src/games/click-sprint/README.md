# Click Sprint

Click (or tap) the big button as many times as you can in ten seconds. The
clock starts with your first click, so that click counts. A ring around the
button empties as time runs out. At the end you see your clicks and clicks
per second; the best run is saved in the browser.

## Files

| File               | Role                                                         |
| ------------------ | ------------------------------------------------------------ |
| `manifest.ts`      | Title, description, theme                                    |
| `Game.tsx`         | State, timer and layout: stats, button, result               |
| `CountdownRing.tsx`| The circular progress ring around the button                 |
| `Thumbnail.tsx`    | Home tile art: the button, ripples, a cursor and "+1"s       |

## Notes

- The timer compares against a fixed end time (`performance.now()`) every
  100 ms instead of counting ticks, so it stays accurate even if the tab
  lags.
- The button reacts on `pointerdown`, not `click`, so fast tapping on
  phones registers every press. Space and Enter also work.
- `ROUND_MS` and `TICK_MS` at the top of `Game.tsx` set the round length and
  display precision.
