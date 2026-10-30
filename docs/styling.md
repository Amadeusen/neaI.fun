# Styling

The look is deliberately simple: a white home page, black ink, big flat
rounded tiles, and one rounded display font (Fredoka). Each game screen
keeps the same building blocks but re-tints itself.

## Files

All shared CSS lives in `src/styles/` and is imported once, in order, by
`src/app/globals.css`:

| File             | Contains                                                         |
| ---------------- | ---------------------------------------------------------------- |
| `tokens.css`     | CSS variables: colors, radii, shadow, per-screen variables       |
| `base.css`       | Element defaults: body colors and font, focus ring               |
| `components.css` | Shared classes: `.btn`, `.btn-light`, `.pill`, `.overlay`, `.overlay-dim` |
| `animations.css` | Keyframes and their classes: `pop-in`, `shake`, debris, clouds   |

`globals.css` then maps the tokens into Tailwind with `@theme inline`, which
is what makes utilities like `text-ink-muted`, `bg-accent`, `bg-screen` and
`font-display` exist.

## Tokens

| Variable         | Tailwind         | Meaning                                    |
| ---------------- | ---------------- | ------------------------------------------ |
| `--ink`          | `text-ink`       | Main text color                            |
| `--ink-muted`    | `text-ink-muted` | Secondary text                             |
| `--surface`      | `bg-surface`     | Soft grey surface                          |
| `--screen-bg`    | `bg-screen`      | Background of the current screen           |
| `--game-accent`  | `bg-accent` etc. | Current game's main color                  |
| `--radius-tile`  |                  | Home tiles and small swatches (15px)       |
| `--radius-card`  |                  | Large game stages (22px)                   |
| `--radius-pill`  |                  | Buttons and pills                          |

Fonts come from `next/font` in `layout.tsx` as `--font-geist-sans` (body),
`--font-geist-mono` and `--font-fredoka` (display, `font-display`).

## Per-screen theming

Each manifest has a `theme`:

```ts
theme: {
  accent: "#ff7a59",     // buttons, highlights, focus ring, tile title
  background: "#e6f6ff", // the game screen's background
  tile: "#cdeeff",       // the game's tile on the home page
}
```

- `GameScreen` sets `--screen-bg` and `--game-accent` inline from the theme,
  so every `.btn`, `.pill`, `bg-accent` and focus ring on that screen picks
  up the game's colors automatically.
- `GameTile` sets the tile background and `--tile-accent`, which thumbnails
  use for their accent-colored parts.

To restyle a single game, change its theme first. For styles only one game
needs, use Tailwind utilities inside that game's components; promote a
pattern to `components.css` once a second game needs it.

## Shared classes

- `.btn`: pill button in the accent color with a pressable shadow.
  `.btn-light` is the white variant for dark overlays.
- `.pill`: small translucent stat readout. Put the number in `<strong>`:
  `<span className="pill">Best <strong>12</strong></span>`.
- `.overlay`: absolutely positioned, centered layer over a game stage.
  Add `.overlay-dim` for the dark, blurred "game over" variant.
- `.shake`: one short horizontal shake (wrong answer feedback).

All animations are disabled or simplified under `prefers-reduced-motion`.

## Fitting the screen

Games must be fully playable without scrolling, on phones too:

- `GameScreen` is exactly `100dvh` tall with `overflow: hidden`; its stage is
  the remaining flex space, padded for the phone's safe areas.
- A game should fill that space (`h-full w-full`) and size its pieces with
  viewport-relative values, e.g. `size-[min(72vw,46dvh)]`.
- For canvas-like games, measure the stage (`useAspectRatio`) and adapt the
  drawing, as Stack does with its camera.
- Check every game at 375 × 812 (phone) and at desktop size.

## Home tiles

Tiles are squares: the game title in the top-left corner (accent color,
`font-display`) and the game's `Thumbnail` filling the rest. A thumbnail is
static SVG that shows what the game is about at a glance. It may use
`group-hover:` utilities for a small hover animation, but no state or
effects. Reuse the game's own drawing code where possible; Stack's tile is
drawn with its real `BlockMesh` and `Ground`.
