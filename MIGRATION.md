# Migration from Contentful to Local Markdown

All your blog posts have been extracted from Contentful and converted to markdown files in `/content/posts/`.

## What Was Done

✅ Extracted 9 posts from Contentful  
✅ Converted to markdown with frontmatter  
✅ Created `lib/posts.ts` helper functions  
✅ Updated `pages/blog.tsx` and `pages/blog/[slug].js` to read from local markdown  
✅ Installed `gray-matter` for parsing frontmatter  
✅ Removed `contentful` dependency

## Testing

```bash
npm run dev
```

Visit `http://localhost:3000/blog` and verify all posts load correctly.

## Post Format

Each markdown file in `/content/posts/` has this structure:

```markdown
---
title: "Post Title"
slug: "post-slug"
date: "2024-12-24T17:00+00:00"
description: "Post description"
thumbnail: "https://images.ctfassets.net/..."
---

Post content in markdown...
```

## Benefits

✅ No API calls (faster builds)  
✅ No Contentful bill  
✅ Version control for content  
✅ Easier to edit (just markdown files)  
✅ No external dependencies

## Adding New Posts

Just create a new `.md` file in `/content/posts/` with the same frontmatter format. The site will pick it up automatically.

## Cleanup

Once confirmed working in production:

```bash
rm fetch-contentful.js
rm convert-to-markdown.js
rm posts.json
```

And remove these env vars from your deployment platform:
```
NEXT_PUBLIC_CONTENTFUL_SPACE_ID
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
```
