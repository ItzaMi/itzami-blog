This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Goodreads reading sync

The reading page keeps one event per Goodreads reading session, so rereads are
shown in the year they happened instead of being collapsed into one CSV row.

### One-time history backfill

1. Copy the `Cookie` request header from a signed-in Goodreads page into
   `GOODREADS_COOKIE` in `.env.local`.
2. Run `npm run reading:backfill`.
3. Review `content/reading/imports/goodreads-read-events.json`.

The backfill reads every book from the existing Goodreads export and preserves
partial dates such as a finish year with no month or day.

### Continuous sync

Copy the RSS URL from the bottom of the Goodreads **My Books** page. Use the
feed for all shelves so new, current, finished, and reread books can be
detected.

Add these repository Actions secrets:

- `GOODREADS_RSS_URL`: the full Goodreads RSS URL, including its private key.
- `GOODREADS_COOKIE`: the signed-in Goodreads `Cookie` request header.

The `Sync Goodreads reading history` workflow runs daily. RSS is used to find
changed books; the authenticated edit page is fetched only for changed read
books. Sessions for that book are replaced atomically, while local `favorite`
and `review` edits in `books.csv` are preserved.

If the cookie expires, failed book IDs stay in
`content/reading/imports/goodreads-sync-state.json` and retry after the secret
is refreshed. The workflow can also be run manually from the Actions tab.
