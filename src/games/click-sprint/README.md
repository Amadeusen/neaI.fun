# Click Sprint

Click (or tap) the big button as many times as you can in ten seconds. The
clock starts with your first click, so that click counts. The button itself
is the scoreboard: a big countdown with your clicks and best underneath. A
ring around it empties as time runs out, and the last three seconds tick
and pulse. Every press pops, ripples and floats a "+1". At the end you see
your clicks per second; a new best gets confetti and a fanfare.

## Files

| File               | Role                                                         |
| ------------------ | ------------------------------------------------------------ |
| `manifest.ts`      | Title, description, theme                                    |
| `Game.tsx`         | Layout: the button, live clicks per second, result           |
| `useClickSprint.ts`| Round state, timer, ticks, sounds and vibration              |
| `SprintButton.tsx` | The button/scoreboard with squish, ripples and "+1" popups   |
| `CountdownRing.tsx`| The circular progress ring around the button                 |
| `Title.tsx`        | Leaning "Click Sprint" logo with speed lines and a cursor    |
| `Thumbnail.tsx`    | Home tile art: the button, ripples, a cursor and "+1"s       |

## Notes

- The clock is the shared `useCountdown` hook: it compares against a fixed
  end time every 100 ms instead of counting ticks, so it stays accurate
  even if the tab lags.
- The button reacts on `pointerdown`, not `click`, so fast tapping on
  phones registers every press. Space and Enter also work.
- `ROUND_MS`, `TICK_MS` and `URGENT_SECONDS` at the top of
  `useClickSprint.ts` set the round length, display precision and when the
  countdown starts ticking.
