# neaI.fun

Games and stuff: a small hub of self-contained interactive toys and
mini-games. Built with Next.js (App Router), React 19, TypeScript and
Tailwind CSS v4, and deployed as a static site on GitHub Pages.

In code the project is called `playground` (package name, localStorage
prefix), since `neaI.fun` is awkward to type.

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

## Games

| Game                                           | URL             |
| ---------------------------------------------- | --------------- |
| [Stack](src/games/stack/README.md)             | `/stack`        |
| [Click Sprint](src/games/click-sprint/README.md) | `/click-sprint` |
| [Color Match](src/games/color-match/README.md) | `/color-match`  |

## Documentation

- [Architecture](docs/architecture.md): folder map, how pages are built,
  state, conventions
- [Styling](docs/styling.md): tokens, shared classes, per-game themes,
  fitting the screen, home tiles
- [Sound, vibration and animation](docs/juice.md): the shared feedback toolkit
- [Adding a game](docs/adding-a-game.md): step-by-step guide and checklist
- [Deployment](docs/deployment.md): GitHub Pages pipeline and config

## At a glance

```
src/
  app/            Routes: home + one folder per game (app/stack/page.tsx -> /stack)
  games/          One folder per game (manifest, Game, Thumbnail, README, ...)
  components/     Logo, GameTile, GameScreen, Confetti
  styles/         Shared CSS: tokens, base, components, animations
  lib/            storage, sound/sfx, haptics, small hooks, cn
docs/             Project documentation
```
