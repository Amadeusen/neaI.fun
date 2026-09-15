# Playground

A small hub of self-contained interactive experiments, built with Next.js
(App Router), TypeScript, and Tailwind CSS. Designed so new mini-games can be
dropped in as isolated modules without touching the rest of the app.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
  app/
    page.tsx                 Home page — renders the game grid
    games/[slug]/page.tsx    Generic route that mounts any registered game
    layout.tsx                Root layout (header/footer, fonts, metadata)
  games/
    types.ts                  GameManifest / GameEntry types
    registry.ts                Single source of truth: one entry per game
    <slug>/
      manifest.ts               Metadata (title, tagline, colors, tags…)
      Game.tsx                   The game itself (default-exported component)
  components/
    layout/                   SiteHeader, SiteFooter
    home/                     GameGrid, GameCard
    game/                     GameShell (page chrome), GameLoader (lazy mount)
    ui/                       Small shared primitives (Container, …)
  lib/
    utils.ts                  cn() class-name helper
```

The home page only reads `manifest` data from the registry (cheap and
synchronous), so it never pulls in any individual game's code. Each game's
component is only fetched when its own `/games/<slug>` route is visited,
via `next/dynamic`, so every game is a separate JS chunk.

## Adding a new game

1. Create `src/games/<slug>/manifest.ts`:

   ```ts
   import type { GameManifest } from "../types";

   export const manifest: GameManifest = {
     slug: "my-game",
     title: "My Game",
     tagline: "One line describing it on the home page.",
     description: "A couple of sentences shown on the game's own page.",
     accentColor: "#00b894",
     emoji: "🎮",
     tags: ["puzzle"],
   };
   ```

2. Create `src/games/<slug>/Game.tsx` with a default-exported React component
   (mark it `"use client"` if it uses state/events, which most games will).

3. Register it in `src/games/registry.ts`:

   ```ts
   import { manifest as myGameManifest } from "./my-game/manifest";
   // ...
   { manifest: myGameManifest, load: () => import("./my-game/Game") },
   ```

That's it — the home page card and the `/games/my-game` route appear
automatically.

## Deploying to GitHub Pages

This repo builds as a static export (`output: "export"` in
`next.config.ts`) and ships via the workflow in
`.github/workflows/deploy.yml`, which builds on every push to `main` and
publishes the `out/` directory with GitHub's official Pages actions.

One-time setup in the GitHub repo: **Settings → Pages → Build and
deployment → Source: GitHub Actions**. After that, every push to `main`
redeploys automatically.

Since this is a project page (served at `https://<owner>.github.io/<repo>/`
rather than a `<owner>.github.io` user page), the build sets `basePath`/
`assetPrefix` to the repo name whenever `GITHUB_PAGES=true` — the workflow
sets that env var, so local `npm run build` still outputs unprefixed paths
for previewing with `npx serve out`.
