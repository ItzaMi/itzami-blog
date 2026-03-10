---
title: "How to add a Google Font to your Gatsby + Tailwind project"
slug: "how-to-add-a-google-font-to-your-gatsby-tailwind-project"
date: "2021-10-12T23:00+01:00"
description: "While I was building itzami.com, I ended up having a hard time looking for a straight answer on the internet on how to import a Google Font into my GatsbyJS + Tailwind project. This tutorial should fill that gap once and for all!"
thumbnail: "https://images.ctfassets.net/jmotdpsipbdp/4rgRCKpFazcyVWEdwRuogP/20486b42738d0be0e98bc2560cb6fcd7/how-to-add-a-google-font-to-your-gatsby-tailwind-project.png"
---

While I was building the first version of [itzami.com](https://www.itzami.com/ "Link to itzami.com"), I found myself having a hard time finding out on the internet how I could import a [Google Font](https://fonts.google.com/) into my website that was using [GatsbyJS](https://www.gatsbyjs.com/) and [TailwindCSS](https://tailwindcss.com/). (and the tutorials I found all told me to install a dependency). With some trial and error I was finally able to achieve it and with this blog post I hope to make the job a lot easier for everybody that tries to do the same! It's incredibly easy to do it but since I haven't seen anyone mention it so clearly, why not do it myself?

## First step: Grab your font!
You probably already know how to do this but let's do a refresh on it: to get a font (or font-family) from [Google Fonts](https://fonts.google.com/) you must first go into the website (_duh!_) and choose your prefered font (I know, this tutorial is like, super high-level!). Let's pretend it's [Festive](https://fonts.google.com/specimen/Festive).
Within your chosen font, there are a lot of styles but for this blog post I'll just pick __Regular 400__. Tick the _Select this style_ and a sidebar should appear. We won't use the the `<link>` but we will use the `@import` so you should see something like this:

```css
@import url('https://fonts.googleapis.com/css2?family=Festive&display=swap');
```

This is all you need from Google Fonts!

## Second step: Paste it on `index.css`
I recommend that you follow Gatsby's tutorial on [how to install Tailwind on a project](https://www.gatsbyjs.com/docs/how-to/styling/tailwind-css/) since it will give you all the initial files that you need.
Once you finish your setup your `index.css` will look like this:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Now, on this exact file, we'll add our recently acquired `@import` so your `index.css` should now look like:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Festive&display=swap');
```

This is the setup on `index.css`!

## Third step: Extend your `fontFamily`
Now that you're correctly importing your new font, you need to be able to use it on your code via `className` so you must add it customize your Tailwind configuration. To do this we'll simply extend our `fontFamily` to include this new font and we'll do it on our `tailwind.config.js`. This means that your file will have following structure inside `extend` (among other stuff that you might have added):

```js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        festive: ["'Festive', cursive"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
```

Be sure to copy the exact string that you find on your Google font page on the `CSS rules to specify families` section. Our `festive` here is what we type when we want to style any text with this new font.

## You're done, baby!
Now you can freely use your new Google Font wherever you want by adding a new class that looks like `font-festive`! So, to style, let's say, an `<h1>`, you would do something like:

```html
<h1 className="font-festive">Hello there!</h1>
```

## Now make it appear everywhere!
Now that we know how to add a font to any element, it's also time to add this font to our entire app. To do so, we just need to style our `body` on our `index.css`:

```css
body {
  font-family: 'Festive', cursive;
}
```

And now your entire app will appear with the new font and you don't really need to declare it on any element! Isn't that cool?

## Wrap up!
And that's it! Now you can freely add a Google Font to your GatsbyJS + TailwindCSS project with no issue whatsoever!
Let me know what you thought about this post and feel free to follow me on [Twitter](https://twitter.com/HeyItzaMi) 🤘