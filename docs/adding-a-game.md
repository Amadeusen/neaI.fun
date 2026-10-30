# Adding a game

A game is one folder in `src/games/<slug>/`, one route file in
`src/app/<slug>/page.tsx`, and one line in the registry. The slug is the
URL (`/my-game`), so it must be lowercase, URL-safe, and identical in all
three places.

## 1. Manifest

`src/games/my-game/manifest.ts`:

```ts
import type { GameManifest } from "../types";

export const manifest: GameManifest = {
  slug: "my-game",
  title: "My Game",
  description: "A sentence or two, used as the page's meta description.",
  emoji: "🎮",
  theme: {
    accent: "#00b894",
    background: "#eafaf5",
    tile: "#c8f0e3",
  },
};
```

Pick a `tile` color clearly lighter than `accent` (the title is drawn in the
accent on top of it) and a `background` lighter still.

## 2. The game

`src/games/my-game/Game.tsx`, default export, marked `"use client"`:

```tsx
"use client";

import { useState } from "react";
import { useBestScore } from "@/lib/storage";
import { manifest } from "./manifest";

export default function MyGame() {
  const { best, submit } = useBestScore(manifest.slug);
  const [isNewBest, setIsNewBest] = useState(false);
  // ... call setIsNewBest(submit(score)) when a run ends

  return (
    <div className="flex h-full w-full max-w-md flex-col items-center justify-center gap-6">
      ...
    </div>
  );
}
```

Rules of thumb:

- Fill the stage (`h-full w-full`) and never require scrolling; see
  [styling.md](styling.md#fitting-the-screen).
- Use the shared `.btn`, `.pill` and `.overlay` classes so the game looks
  like the rest of the site.
- Keep files under 150 lines. As the game grows, split it into rules (pure
  `.ts`), state (`useMyGame.ts`), rendering components, and a thin
  `Game.tsx` that assembles them; Stack is the reference.
- Don't touch `window` or `localStorage` during render; do it in effects,
  event handlers, or through `src/lib/storage.ts`.

## 3. Thumbnail

`src/games/my-game/Thumbnail.tsx`: a server component returning an SVG
(usually `viewBox="0 0 200 200"`, `className="h-full w-full"`) that shows
what the game is about. Use `var(--tile-accent)` for the accent color and
`group-hover:` utilities for an optional hover effect. The tile title is
drawn over the top-left corner, so keep that area fairly empty.

## 4. Route

`src/app/my-game/page.tsx`:

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

## 5. Registry

In `src/games/registry.ts`, import the manifest and thumbnail and add an
entry where the tile should appear:

```ts
{ manifest: myGame, Thumbnail: MyGameThumbnail },
```

## 6. Readme

Add `src/games/my-game/README.md` with the rules of the game and a short
map of its files (copy the structure of an existing one).

## Checklist

- [ ] `npm run lint` and `npm run build` pass
- [ ] The tile looks right on the home page (desktop and phone)
- [ ] The game fits the screen at 375 × 812 and on desktop, no scrolling
- [ ] Best score is saved and shown after a reload
- [ ] No file over 200 lines
