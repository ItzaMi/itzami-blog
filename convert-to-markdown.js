const fs = require('fs');
const path = require('path');

// Read the posts from the JSON file
const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));

// Create content/posts directory if it doesn't exist
const postsDir = path.join(__dirname, 'content', 'posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// Convert each post to markdown
posts.forEach(post => {
  const { title, slug, date, description, markdown, thumbnail } = post.fields;
  
  // Get thumbnail URL if it exists
  const thumbnailUrl = thumbnail?.fields?.file?.url 
    ? `https:${thumbnail.fields.file.url}`
    : '';
  
  // Create frontmatter
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
description: "${description.replace(/"/g, '\\"')}"
thumbnail: "${thumbnailUrl}"
---

`;
  
  // Combine frontmatter and markdown content
  const fullContent = frontmatter + (markdown || '');
  
  // Write to file
  const filename = `${slug}.md`;
  const filepath = path.join(postsDir, filename);
  fs.writeFileSync(filepath, fullContent, 'utf8');
  
  console.log(`Created: ${filename}`);
});

console.log(`\nConverted ${posts.length} posts to markdown!`);
