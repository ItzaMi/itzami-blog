const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));

const postsDir = path.join(__dirname, 'content', 'posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

posts.forEach(post => {
  const { title, slug, date, description, markdown, thumbnail } = post.fields;
  
  const thumbnailUrl = thumbnail?.fields?.file?.url 
    ? `https:${thumbnail.fields.file.url}`
    : '';
  
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
thumbnail: "${thumbnailUrl}"
---

`;
  
  const fullContent = frontmatter + (markdown || '');
  
  const filename = `${slug}.md`;
  const filepath = path.join(postsDir, filename);
  fs.writeFileSync(filepath, fullContent, 'utf8');
  
  console.log(`Created: ${filename}`);
});

console.log(`\nConverted ${posts.length} posts to markdown!`);
