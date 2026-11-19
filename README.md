# YagerLink

My personal link-in-bio site.

Implemented using [Hugo](https://gohugo.io/) with the [LucentLink](https://github.com/cx48/LucentLink-Hugo) theme.

## Development

Tooling comes from `manifest.scm` (Hugo via nonguix). `workerd` needs an FHS
loader, so run everything in a container:

```sh
git submodule update --init
guix shell -m manifest.scm --container --emulate-fhs --network -- bash
export DO_NOT_TRACK=1   # disable cf telemetry
npm ci
npm run dev       # hugo server
npm run preview   # hugo build + cf dev (Workers runtime)
npm run deploy    # hugo build + cf deploy (run `npx cf auth login` first)
```
