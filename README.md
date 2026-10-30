# neaI.fun

A small hub of self-contained interactive toys and mini-games, built with
Next.js (App Router), TypeScript and Tailwind CSS, and deployed as a static
site on GitHub Pages. In code the project is called `playground` (package
name, localStorage prefix), since `neaI.fun` is awkward to type.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script          | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Dev server with hot reload                    |
| `npm run build` | Static export into `out/`                     |
| `npm run lint`  | ESLint (Next.js core-web-vitals + TypeScript) |

## Architecture

```
src/
  app/
    layout.tsx               Root layout: fonts, metadata, viewport
    globals.css              Tailwind entry; imports src/styles/*
    page.tsx                 Home page: title + grid of game tiles
    <slug>/page.tsx          One route file per game, e.g. app/stack/page.tsx -> /stack
  games/
    types.ts                 GameManifest / GameTheme types
    registry.ts              Ordered list of manifests shown on the home page
    metadata.ts              gameMetadata(): page <title>/description from a manifest
    <slug>/
      manifest.ts            Title, tagline, emoji, theme colors
      Game.tsx               The game itself (default-exported client component)
      ...                    Any game-specific modules (Stack has several)
  components/
    home/GameTile.tsx        A tile on the home page
    game/GameScreen.tsx      Full-viewport frame: back arrow, title, game stage
  styles/
    tokens.css               Design tokens (colors, radii) + per-screen variables
    base.css                 Element defaults
    components.css           Shared classes: .btn, .btn-light, .pill, .overlay
    animations.css           Keyframes and their utility classes
  lib/
    storage.ts               useBestScore(): per-browser best scores in localStorage
    utils.ts                 cn() class-name helper
```

### Styling

The look is deliberately plain: a white home page with big, flat, rounded
tiles. Every screen shares the tokens and classes in `src/styles/`, and
each game re-tints its own screen through its manifest `theme`:

- `accent`: buttons, highlights and focus rings (`--game-accent`, `bg-accent`)
- `background`: the game screen's background (`--screen-bg`, `bg-screen`)
- `tile`: the game's tile color on the home page

`GameScreen` fills exactly one viewport (`100dvh`) and never scrolls. A game
should size itself to the space it is given (use `h-full`, `dvh` or `min()`
based sizes), so it is fully playable on a phone without scrolling.

### Saved data

There is no backend. `useBestScore(slug)` keeps each game's best score in
the visitor's own browser (`localStorage`, keys prefixed with
`playground:`). If storage is unavailable (private mode, blocked site data)
games still work; they just don't remember anything.

## Adding a new game

1. Create `src/games/<slug>/manifest.ts`:

   ```ts
   import type { GameManifest } from "../types";

   export const manifest: GameManifest = {
     slug: "my-game",
     title: "My Game",
     tagline: "One line describing it on the home page.",
     description: "A sentence or two used as the page's meta description.",
     emoji: "🎮",
     theme: { accent: "#00b894", background: "#eafaf5", tile: "#c8f0e3" },
   };
   ```

2. Create `src/games/<slug>/Game.tsx` with a default-exported component,
   marked `"use client"` if it uses state or events (most games will).

3. Create the route `src/app/<slug>/page.tsx` (the folder name must equal
   the manifest's `slug`):

   ```tsx
   import { GameScreen } from "@/components/game/GameScreen";
   import { gameMetadata } from "@/games/metadata";
   import MyGame from "@/games/my-game/Game";
   import { manifest } from "@/games/my-game/manifest";

   export const metadata = gameMetadata(manifest);

   export default function MyGamePage() {
     return (
       <GameScreen manifest={manifest}>
         <MyGame />
       </GameScreen>
     );
   }
   ```

4. Add the manifest to the list in `src/games/registry.ts` so it shows up on
   the home page.

Each route only imports its own game, so Next.js puts every game in its own
JS chunk and the home page never downloads game code.

## Deploying to GitHub Pages

The site builds as a static export (`output: "export"` in
`next.config.ts`) and ships via `.github/workflows/deploy.yml`, which builds
on every push to `main` and publishes `out/` with GitHub's official Pages
actions.

One-time setup in the GitHub repo: **Settings → Pages → Build and
deployment → Source: GitHub Actions**.

Because this is a project page (served at `https://<owner>.github.io/<repo>/`),
the build sets `basePath`/`assetPrefix` to the repo name whenever
`GITHUB_PAGES=true`. The workflow sets that variable, so a local
`npm run build` still outputs unprefixed paths you can preview with
`npx serve out`. `trailingSlash: true` makes each route an
`<route>/index.html`, which GitHub Pages serves without any rewrites.
