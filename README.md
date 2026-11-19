# YagerLink

My personal link-in-bio site.

Implemented using [Hugo](https://gohugo.io/) with the [LucentLink](https://github.com/cx48/LucentLink-Hugo) theme.

## Development

Tooling comes from `manifest.scm` (Hugo via nonguix). `./dev <cmd>` runs a
command in an FHS container (needed for `workerd`); no args gives a shell.

```sh
git submodule update --init
./dev npm ci
./dev npm run dev       # hugo server
./dev npm run build     # hugo --minify -> public/
./dev npm run preview   # build + cf dev (Workers runtime)
./dev npm run deploy    # build + cf deploy (`./dev npx cf auth login` first)
```

## Configuration

Page content lives in `content/_index.md`:

| Key | Purpose |
|-----|---------|
| `profileImage` | Photo on the page (`images/img-512.webp`; `img.webp` is the full-size original) |
| `previewImage` | Link-preview image (JPG, for sites without WebP support) |
| `description` | Subtitle on the page |
| `seoDescription` | Search results and link previews (falls back to `description`) |
| `socials` | Icon links: `url`, `svg` (icon in `layouts/partials/icons/`), `label`; `sameAs: false` keeps one out of the structured data |
| `sameAs` | Extra profiles for structured data only (not shown) |

Site options in `hugo.toml`: `params.background` is one of `bubbles`,
`lava`, `murmuration`, `birds`, `fireflies`, `none`, `random`, or a list to
pick from per page load (e.g. `["lava", "fireflies"]`).

New icons: add a partial to `layouts/partials/icons/` (Font Awesome Free SVGs
work; keep the license comment). A missing icon fails the build.

## Deployment notes

- Workers Builds deploys `main` on push (`npm run build`, `npx cf deploy`).
- `static/_headers` sets security headers and long-term caching for the
  fingerprinted CSS/JS in `/css/` and `/js/`.
- Unknown paths serve `layouts/404.html` (`notFoundHandling` in `cloudflare.config.ts`).
- Outside the repo, on the `yager.me` zone: a redirect rule sends `www` to the
  apex, and "Always Use HTTPS" is on.
