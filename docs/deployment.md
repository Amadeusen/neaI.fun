# Deployment

The site is deployed to GitHub Pages by `.github/workflows/deploy.yml` on
every push to `main` (it can also be run by hand from the Actions tab).

## Pipeline

1. `actions/checkout` and `actions/setup-node` (Node 20, npm cache)
2. `npm ci`
3. `npm run build` with `GITHUB_PAGES=true`
4. `actions/upload-pages-artifact` uploads `out/`
5. `actions/deploy-pages` publishes it

One-time setup in the repository: **Settings → Pages → Build and
deployment → Source: GitHub Actions**.

## Why the config looks the way it does

`next.config.ts`:

| Option                     | Why                                                                 |
| -------------------------- | ------------------------------------------------------------------- |
| `output: "export"`         | Pages only serves static files, so every route is prerendered to HTML |
| `images.unoptimized`       | The image optimizer needs a server; the site uses no images anyway  |
| `trailingSlash: true`      | Emits `stack/index.html`, which Pages serves at `/stack/` with no rewrites |
| `basePath` / `assetPrefix` | Set to `/neaI.fun` only when `GITHUB_PAGES=true`, because a project page lives under `https://<owner>.github.io/neaI.fun/` |
| `devIndicators: false`     | Hides the Next.js dev badge; errors still show in `next dev`        |

Because static export has no server, features that need one (API routes,
server actions, middleware, on-demand rendering) are not available. Anything
a game needs to remember goes in the visitor's browser via
`src/lib/storage.ts`.

## Previewing a production build locally

```bash
npm run build
npx serve out
```

Locally `GITHUB_PAGES` is unset, so the build has no base path and works at
the server's root.

If the repository is renamed, update `repoName` in `next.config.ts`.
