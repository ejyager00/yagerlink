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
