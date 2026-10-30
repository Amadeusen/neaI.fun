# Stack

A block slides back and forth above the tower. Tap, click or press space to
drop it. Whatever overhangs the block below is trimmed off and falls away;
the part that overlaps becomes the new top. Each layer slides along the
other axis and a little faster. Miss completely and the run ends. The score
is the number of blocks placed.

The world is drawn in SVG with an isometric projection, on a small floating
island, under a sky that turns from day to sunset to night as the tower
grows.

## Files

| File                  | Role                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| `manifest.ts`         | Title, description, theme                                                |
| `Game.tsx`            | Assembles the stage: background, scene, HUD; handles taps                |
| `useStackGame.ts`     | Game state and loop: slide, drop, score, restart, space-bar control      |
| `useDebris.ts`        | Trimmed pieces that fall and remove themselves                           |
| `rules.ts`            | Base block, which axis each layer slides on, spawning the next block     |
| `geometry.ts`         | `sliceBlock` (overlap + trimmed pieces), block faces and screen points   |
| `projection.ts`       | Isometric projection and color helpers                                   |
| `camera.ts`           | The SVG viewBox that keeps the tower framed                              |
| `constants.ts`        | All tunable numbers (sizes, speeds, camera)                              |
| `types.ts`            | `Block`, `Debris`, `Axis`, `Phase`                                       |
| `StackScene.tsx`      | Draws island, tower, debris and the sliding block                        |
| `StackHud.tsx`        | Big score, best-score pill, start and game-over overlays                 |
| `StackBackground.tsx` | Score-driven sky gradient, clouds and stars                              |
| `BlockMesh.tsx`       | One block as three shaded faces; hue shifts per layer                    |
| `Ground.tsx`          | The floating island under the tower; fades out as the tower grows        |
| `Thumbnail.tsx`       | Home tile art, drawn with the real `BlockMesh` and `Ground`              |

## Coordinates

World `x` and `y` are in `[0, GAME_SIZE]` (150), `z` is height
(`index * BLOCK_HEIGHT`). `projection.ts` maps world points to screen
points; `camera.ts` picks which slice of the screen plane is visible, with a
fixed width (`VIEW_W`) and a height that follows the stage's aspect ratio.

## Tuning

Everything is in `constants.ts`: `BASE_SPEED`, `SPEED_STEP` and `MAX_SPEED`
for difficulty, `MIN_OVERLAP` for how forgiving a near miss is, `VIEW_W`
for how zoomed-in the camera is, `HUE_STEP` for how fast colors shift.
