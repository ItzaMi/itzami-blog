# Migration from Contentful to Local Markdown

All your blog posts have been extracted from Contentful and converted to markdown files in `/content/posts/`.

## What Was Done

✅ Extracted 9 posts from Contentful  
✅ Converted to markdown with frontmatter  
✅ Created `lib/posts.ts` helper functions  
✅ Created new page files that read from local markdown

## To Complete the Migration

### 1. Install gray-matter

```bash
npm install gray-matter
```

### 2. Replace old pages with new ones

```bash
# Backup old files first
mv pages/blog.tsx pages/blog-old.tsx
mv pages/blog/[slug].js pages/blog/[slug]-old.js

# Use new files
mv pages/blog-new.tsx pages/blog.tsx
mv pages/blog/[slug]-new.js pages/blog/[slug].js
```

### 3. Remove Contentful dependency

```bash
npm uninstall contentful
```

### 4. Remove Contentful env vars

Delete from `.env` or `.env.local`:
```
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=jmotdpsipbdp
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=_olRCVw8c9ZHhFjK-B0ns-wLzMq9hytsJajGYQqp4EY
```

### 5. Test it

```bash
npm run dev
```

Visit `http://localhost:3000/blog` and check that all posts load correctly.

### 6. Clean up

Once confirmed working:
```bash
rm pages/blog-old.tsx
rm pages/blog/[slug]-old.js
rm fetch-contentful.js
rm convert-to-markdown.js
rm posts.json
```

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

## Reverting

If something breaks, your old files are backed up:
- `pages/blog-old.tsx`
- `pages/blog/[slug]-old.js`

Just rename them back and reinstall Contentful.
