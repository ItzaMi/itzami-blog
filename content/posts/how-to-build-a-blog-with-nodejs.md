---
title: "How to build a blog with NodeJS"
slug: "how-to-build-a-blog-with-nodejs"
date: "2024-10-31T17:00+00:00"
description: "In this blog post we'll learn how to build a blog using NodeJS for the sake of going back to basis and being able to separate ourselves from the ever growing complexity of the frontend frameworks!"
thumbnail: "https://images.ctfassets.net/jmotdpsipbdp/78x1NQEnwIuDxLl613EdEm/0f417c45665c2d2662afed51321177e2/ItzaMi_Frame_27.jpg"
---

*Just want the code? Visit the [repo](https://github.com/ItzaMi/nodejs-blog-starter)*

If you're looking to start a blog (or if you're thinking of redesigning yours although you haven't posted in 2 years), you'll stumble upon [a](https://gohugo.io//) [lot](https://vercel.com/templates/next.js/blog-starter-kit) [of](https://jekyllrb.com/) [options](https://www.11ty.dev/) and it can be incredibly daunting; and if you stumble with the newest [Josh's post about his stack](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/) it is easy to feel overwhelmed with the shown stack.

__But you shouldn't feel like that and starting small is key to being sustainable__

And how do I know that? Because I feel that sense of feeling overwhelmed as well!
At this date, this website is done with [NextJS](https://nextjs.org/), [Contentful](https://nextjs.org/), and [Markdown](https://en.wikipedia.org/wiki/Markdown) and while adding posts to it is not particularly hard, maintaining it is!

> I haven't added anything code-related to this website since [2021](https://github.com/ItzaMi/itzami-blog/commit/a60c8e0fe30498d5b140c0576a3893ed7768930e) and at this point I don't even know if I'm able to run it locally (and I'm reticent even to try it out)!

For this 👆 particular reason, I want to preach for a simple stack; something that endures the test of time; something that 'just works'; so let's jump right into it, shall we?

## Start that project!

Keep in mind that this project will be very, very barebones but it should give you a good foundation for you to develop on top of it and [reach for the sky](https://www.youtube.com/watch?v=byq2K2IYMlI).

We'll start by initializing a Node project inside a chosen folder (`nodejs-blog` for me) with and installing a couple of dependencies that I feel like will make our lives easier, like [Express](https://expressjs.com/), [EJS](https://github.com/tj/ejs), [Marked](https://marked.js.org/), the good ol' [body-parser](https://www.npmjs.com/package/body-parser) and [gray-matter](https://github.com/jonschlinkert/gray-matter).

```bash
npm init
npm install body-parser ejs express marked gray-matter
```

### Explaining the dependencies

The reason why I chose to add EJS into the mix was to make things a bit easier for me, by taking advantage of templates and just writing less code overall. If you're not familiar with it, just wait. It's pretty cool! 

For `Marked` and `gray-matter`, it's pretty simple: markdown rules and I want my posts to have proper metadata, which I plan to create with [frontmatter](https://daily-dev-tips.com/posts/what-exactly-is-frontmatter/).

## Alright, back at it!

Now open your project in your favourite IDE and create your `main.js` file. I know that we'll want the following routes: `/`, `/:post`, and that we'll need to have relevant stuff on the `public` folder, so our initial `main.js` can look like this:

```js
// main.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const matter = require("gray-matter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {});

app.get("/:post", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

Pretty straightforward, right? The idea is to have the list of posts on my `home` (or `/`) and just have individual pages for my posts.

## Time to template like you never templated before!

With the base setup out of the way, we also need a base structure and EJS will provide that.
Start by creating a folder named `views`; this will be the root of your *pages*, so to speak, which means that you can create a `home.ejs` and a `post.ejs` inside it just to mark the two types of pages that we'll have.

Create also a folder, inside `views`, named `partials`; you can think of it as our *components* and you can already create 3 files here: `header.ejs`, `footer.ejs` and `head.ejs`.

This is the base structure of our blog: 2 pages and 3 components, that's it. All the rest will be dealt with inside `main.js`

### The `partials`

Like I've mentioned, templates allow us to not have to repeat as much code as we would have to if we were creating each page by hand, and our setup provides us exactly with a ease of mind regarding that.

```ejs
// head.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Here's my blog</title>
  </head>
</html>
```

```ejs
// footer.ejs
    </main>
  </body>
</html>
```

```ejs
// header.ejs
<body>
  <main>
    <header>
      <a href="/">Blog</a>
    </header>
```

Basically, the regular `head` at, well, `head`, the closing tags at `footer` and the *navbar*, and opening tags at `header`. Pretty simple, right?

### The `views`

Now that we have our *components* we can get the pages going.

```ejs
// home.ejs
<%- include('./partials/head') %>
<%- include('./partials/header') %>
<div>
  <h2>The posts:</h2>
  <ul>
    <% posts.forEach((post)=> { %>
    <li>
      <a href="<%= post.link %>"><%= post.title %></a>
    </li>
    <% }) %>
  </ul>
</div>
<%- include('./partials/footer') %>
```

```ejs
// post.ejs
<%- include('./partials/head') %>
<%- include('./partials/header') %>
<h1><%= frontmatter.title %></h1>
<p><%= frontmatter.date %></p>
<p><%= frontmatter.author %></p>
<%- content %>
<%- include('./partials/footer') %>
```

Yeah, it looks pretty weird but just know that the `include` brings the `partials` into our views and that there's extra syntax to make it work (go to the [docs](https://ejs.co/#docs) if you're interested in how it works).

The `<%-` allows us to not double-escape our HTML ( try it out with `<%` or `<%=` at the end and see what happens) and the `forEach()`, well, does exactly what a `forEach` does. Nothing particularly new here, just a different way of writing stuff that you already know!

But, rejoice, you've now interacted with a new tool! 💃

## The blog posts! 📄

At the root of your project create a `posts` folder and your first `blog-post-1.md` inside of it with the following content:

```md
---
title: "Blog post 1"
date: 2024-10-31
author: "Rui Sousa"
summary: "Here's the first blog post"
---

# A blog post

Here's my first blog post!
```

What's inside the `---` is our `frontmatter`, and you'll get to use it right away!

## Time to see some stuff on the screen!

Back to our `main.js`, we'll first deal with the `/` route. As we've seen, we want to be able to get our posts and loop over them to display info about them on the screen.

To simplify stuff I'll leave comments next to each relevant line instead of writing huge blocks of text explaining stuff! 😄

```js
// main.js
app.get("/", (req, res) => {
  // we get the folder with the `posts`
  const postsDir = path.join(__dirname, "posts");
  // we reach inside the folder
  fs.readdir(postsDir, (err, files) => {
    // check for any errors
    if (err) {
      return res.status(500).send("Error reading posts directory");
    }

    const posts = files
       // for the retrieved files we filter those that are markdown `.md`
      .filter((file) => file.endsWith(".md"))
      // afterwards we'll map over each one to parse the info
      .map((file) => {
        // we get its path so we can read its content
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        // we retrieve the frontmatter content (`matter()` deals with that for us)
        const { data: frontmatter } = matter(fileContent);
        // we get the post file name to use as the slug for our link
        const postName = path.basename(file, ".md");
        // we return two properties (`title` and `link`) that we've already seen inside `home.ejs` inside the `forEach` loop
        return {
          title: frontmatter.title || postName,
          link: `/${postName}`,
        };
      });

    // we render the `home.ejs` file and pass the property `posts` (that we run through the `forEach` loop
    res.render("home", { posts });
  });
});
```

Now run `node main.js` in your terminal and visit `localhost:3000`. You should see your `/` route populated with links to the markdown files that you created! 💃

There's a lot to digest there so, please, try every code line by yourself and see if it makes sense. Try to do different stuff, actually! Get the `summary` for your posts and find a way of displaying it inside the `home.ejs` file. Go crazy with it! Attach image urls and also try to display them. PLAY WITH IT!

Now, for the `/post` itself:

```js
// main.js
app.get("/:post", (req, res) => {
  // via the params of the request we get the post identifier (in this case the slug)
  const postName = req.params.post;
  // now instead of grabbing the `posts` folder, we make sure to grab a file that has the same `filename` of our route inside the `posts` folder
  const postPath = path.join(__dirname, "posts", `${postName}.md`);

  // we jump inside the file
  fs.readFile(postPath, "utf8", (err, data) => {
    // once again we check for any errors
    if (err) {
      return res.status(404).send("Post not found");
    }

    // we fetch the content of the post and its frontmatter
    const { content, data: frontmatter } = matter(data);
    // we use `marked` to render the `htmlContent` (very important if you have `code blocks`, links, and other interesting stuff
    const htmlContent = marked(content);

    // we tell to render the `post.ejs` file and pass two properties, `content` and `frontmatter` that we'll pick and render inside our file 
    res.render("post", { content: htmlContent, frontmatter });
  });
});
```

Once again, run `node main.js`, and choose one of the links in the homepage. You should see your markdown file rendered as HTML!

As before, try stuff out; add elements to the markdown and see how they render; add new fields to the frontmatter and also get them to show.

You're now the proud owner of a blog made with Node! 💃

## That's it

There's a lot more that we could do here but that's out of the scope, isn't it? We got something working, with what we intended to do, and that is perfect. Now it's your turn to ✨ make it shine ✨
See if you can change the `head.ejs` info by passing properties to it! Ideally, the tab name would change with the chosen content. And we should also have proper metadata when we share the website on social media so we also need that frontmatter info inside the `head`. Sounds like a good challenge, uh? 😎

As always, if you have any doubts, feel free to reach me via [X](https://twitter.com/HeyItzaMi).