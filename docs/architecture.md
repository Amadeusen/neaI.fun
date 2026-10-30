# Architecture

neaI.fun is a static Next.js site (App Router, React 19, TypeScript,
Tailwind CSS v4). There is no server and no database: every page is
prerendered at build time into `out/`, and GitHub Pages serves those files.

## Folder map

```
src/
  app/                          Routes (one folder = one URL)
    layout.tsx                  Root <html>: fonts, default metadata, viewport
    globals.css                 Tailwind entry; imports src/styles/* and maps tokens
    page.tsx                    "/"  home page: logo, subtitle, tile grid
    stack/page.tsx              "/stack"
    click-sprint/page.tsx       "/click-sprint"
    color-match/page.tsx        "/color-match"

  games/                        Everything game-specific
    types.ts                    GameManifest, GameTheme, GameListing
    registry.ts                 Ordered list shown on the home page
    metadata.ts                 gameMetadata(manifest) for route <head>
    <slug>/                     One folder per game, see "Inside a game folder"

  components/                   UI shared by several pages
    shared/Logo.tsx             "neaI.fun" wordmark (home title + game top bar)
    home/GameTile.tsx           Wide tile on the home page
    game/GameScreen.tsx         Full-viewport frame around every game
    game/Confetti.tsx           One-shot confetti burst for new bests

  styles/                       Plain CSS shared by every screen (see styling.md)
  lib/                          Framework-agnostic helpers
    storage.ts                  useBestScore(): best scores in localStorage
    sound.ts                    Web Audio synthesizer (tone, noise, scaleNote)
    sfx.ts                      The site's sound palette (start, pop, fail, ...)
    haptics.ts                  Light / medium / heavy phone vibrations
    useAspectRatio.ts           Measures an element's width / height
    useKeyPress.ts              Page-wide key handler (space to play)
    utils.ts                    cn() class-name joiner
```

## How a page is built

**Home (`/`)** reads `games` from `src/games/registry.ts`. Each entry pairs
a game's `manifest` (plain data) with its `Thumbnail` and `Title` (server
components drawing static SVG/HTML). All render to HTML at build time, so the home page
ships no game JavaScript at all.

**A game (`/stack`)** has its own route file, `src/app/stack/page.tsx`. It:

1. exports `metadata` built from the manifest (`gameMetadata`), and
2. renders `<GameScreen manifest={manifest} title={<StackTitle />}><Stack /></GameScreen>`.

`GameScreen` is a server component: the top bar (site logo linking home,
and the game's stylized title logo) and a stage filling the rest of the
viewport. The game component
inside is a client component (`"use client"`), the only part that hydrates.

Because each route imports only its own game, Next.js puts every game in
its own JavaScript chunk. Visiting `/stack` never downloads Click Sprint.

## Inside a game folder

Every game folder has the same entry points, and may add more files:

| File            | Role                                                              |
| --------------- | ----------------------------------------------------------------- |
| `manifest.ts`   | Slug, title, description, emoji, theme colors                     |
| `Game.tsx`      | Default-exported client component mounted by the route            |
| `Thumbnail.tsx` | Static SVG art for the home tile (server component, no state)     |
| `Title.tsx`     | Stylized title logo shown in the game's top bar                   |
| `README.md`     | Rules of the game and a map of its files                          |

Larger games split further. Stack, for example, separates:

- **rules and math** (`rules.ts`, `geometry.ts`, `projection.ts`, `camera.ts`,
  `constants.ts`, `types.ts`): pure functions, no React;
- **state** (`useStackGame.ts`, `useDebris.ts`): hooks that own the game
  loop and expose plain data plus actions;
- **rendering** (`StackScene.tsx`, `StackHud.tsx`, `StackBackground.tsx`,
  `BlockMesh.tsx`, `Ground.tsx`): components that only draw what they are
  given;
- **assembly** (`Game.tsx`): wires the hook to the components.

Follow that split whenever a game grows past a single small file.

## Data flow and state

- Game state lives in React state inside the game component or its hooks.
  Nothing is global.
- Values the animation loop must read synchronously (positions, speed) are
  kept in refs, so input handlers always see the exact current frame.
- Persistent data goes through `src/lib/storage.ts` only. It namespaces keys
  with `playground:`, guards every access with try/catch (storage can be
  blocked), and exposes a `useSyncExternalStore` hook so the server render
  and the first client render match.

## Conventions

- **File size**: aim for under 150 lines per file; 200 is the hard limit.
  Split by role (rules / state / rendering / assembly) rather than by size.
- **One responsibility per file**, named after what it exports
  (`StackHud.tsx` exports `StackHud`).
- **Pure logic stays React-free** so it is easy to read and to test.
- **Server components by default.** Add `"use client"` only to the game's
  `Game.tsx` (and anything that needs state, effects or event handlers).
- **No assets**: art is SVG/CSS in code, icons are emoji.
- **Language**: code, comments, UI text and docs are in English.
- Imports use the `@/` alias for anything outside the current folder.
