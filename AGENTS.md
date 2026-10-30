<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

neaI.fun is a static Next.js site (App Router, `output: "export"`) of small
mini-games, deployed to GitHub Pages. Read `docs/architecture.md` before
changing structure, and `docs/adding-a-game.md` before adding a game.

## Architecture

- **One route file per game**: `src/app/<slug>/page.tsx` renders
  `<GameScreen>` around the game. There is no generic `[slug]` route.
- **One folder per game**: `src/games/<slug>/` holds `manifest.ts`,
  `Game.tsx` (client component), `Thumbnail.tsx` (static SVG tile art),
  `Title.tsx` (top-bar logo) and `README.md`, plus any game-specific modules.
- **Registry**: `src/games/registry.ts` lists `{ manifest, Thumbnail }` in
  home page order. The slug must match the route folder name.
- **Shared UI** goes in `src/components/` (`shared/`, `home/`, `game/`);
  framework-agnostic helpers go in `src/lib/`.
- **Styles**: shared CSS lives in `src/styles/` (tokens, base, components,
  animations) and is imported by `src/app/globals.css`. Per-game colors come
  from the manifest `theme`, never hard-coded in shared files.
- **Persistence**: only through `src/lib/storage.ts` (localStorage, keys
  prefixed `playground:`). There is no backend.
- **Static export only**: no API routes, server actions, middleware or
  anything else that needs a server.

## Code rules

- No raw `setTimeout` / `setInterval` / `addEventListener` in games: use
  `useTimeouts`, `useCountdown` and `useKeyPress` from `src/lib/`, which
  clean up on unmount.
- **Keep files short**: aim for under 150 lines, never over 200. When a file
  grows, split it by role: pure rules/math (`.ts`, no React), state hooks
  (`useX.ts`), rendering components, and a thin `Game.tsx` that assembles
  them. `src/games/stack/` is the reference.
- One responsibility per file, named after its main export.
- Server components by default; `"use client"` only where state, effects or
  events are needed.
- Every game must fit the viewport with no scrolling, on a 375 × 812 phone
  and on desktop.
- Every player action gets feedback: a sound from `src/lib/sfx.ts`, a
  vibration from `src/lib/haptics.ts` and a shared animation class
  (see `docs/juice.md`). Each game also has a `Title.tsx` logo.
- Code, comments, UI text and docs are in English.
- Update the relevant `docs/` page and the game's `README.md` in the same
  change as the code.

## Workflow

- Check `npm run lint` and `npm run build` before committing.
- When a choice is ambiguous, ask the user (with clickable options) instead
  of assuming.
