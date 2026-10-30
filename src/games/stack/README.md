# Stack

A block slides back and forth above the tower. Tap, click or press space to
drop it. Whatever overhangs the block below is trimmed off and falls away;
the part that overlaps becomes the new top. Each layer slides along the
other axis and a little faster. Miss completely and the run ends. The score
is the number of blocks placed.

**Perfect drops**: landing within `PERFECT_TOLERANCE` of the block below
snaps the block into place with nothing trimmed ("Perfect!", with a chime
that rises with the streak). Every `REGROW_EVERY` (3) perfect drops in a
row, the block grows back to the size the tower had before its last trim
("Grow!"), so the next blocks are bigger again.

The world is drawn in SVG with an isometric projection, on a small floating
island, under a sky that turns from day to sunset to night as the tower
grows.

## Files

| File                  | Role                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| `manifest.ts`         | Title, description, theme                                                |
| `Game.tsx`            | Assembles the stage: background, scene, HUD; handles taps                |
| `useStackGame.ts`     | Game state: start, drop (place / perfect / grow / miss), score, restart   |
| `useSlidingBlock.ts`  | The requestAnimationFrame loop moving the sliding block                  |
| `feedback.ts`         | Sound and vibration for each kind of drop                                |
| `DropEffects.tsx`     | Flash and expanding rings on the block that just landed                  |
| `Title.tsx`           | "STACK" title logo, one letter per block                                 |
| `useDebris.ts`        | Trimmed pieces that fall and remove themselves                           |
| `rules.ts`            | Base block, sliding axes, next block, `resolveDrop` (perfect and regrow) |
| `geometry.ts`         | `sliceBlock` (overlap + trimmed pieces), block faces and screen points   |
| `projection.ts`       | Isometric projection and color helpers                                   |
| `camera.ts`           | The SVG viewBox that keeps the tower framed                              |
| `constants.ts`        | All tunable numbers (sizes, speeds, camera)                              |
| `types.ts`            | `Block`, `Debris`, `Axis`, `Phase`                                       |
| `StackScene.tsx`      | Draws island, tower, debris and the sliding block                        |
| `StackHud.tsx`        | Big score, Perfect popups, best pill, overlays, confetti on a new best   |
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
for how zoomed-in the camera is, `HUE_STEP` for how fast colors shift,
`PERFECT_TOLERANCE` and `REGROW_EVERY` for the perfect-drop bonus.
