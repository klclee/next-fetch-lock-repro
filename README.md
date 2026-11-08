# Next.js fetch cache lock not released on an unparseable URL

Two statically rendered pages (`app/a`, `app/b`) make the same cached fetch:

```js
fetch("not-a-url/data.json", { next: { revalidate: 60 } }).catch(() => null)
```

The error is caught, so both pages should render "fallback".

```sh
npm install
npm run build          # hangs: "took more than 60 seconds", build fails
npm run build:control  # same two pages, valid but unreachable URL: builds fine
```

The first page takes the incremental-cache lock for the fetch. `dedupeFetch` throws synchronously in
`new Request(...)` on the unparseable URL, so the `.catch(() => handleUnlock())` chained onto
`originFetch(...)` in `patch-fetch` is never attached and the lock is never released. The second page
waits on that lock until the prerender timeout.

Tested with next 16.5.0-canary.44 (also seen on 16.3.8).
