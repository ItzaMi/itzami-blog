---
title: "Boost your CSS animations with Intersection Observer API"
description: "I use Notion for a lot of stuff (activity tracker, money manager, diary) but it all started when I realized that I had way too many development blog posts saved in my browser's bookmarks."
author: "Rui Sousa"
date: "2021-02-06"
type: post
---

CSS animations can be a pain in the 🍑, and what's even worst is to trigger them at the exact moment. For that exact reason, *and if I may be perfectly honest with you*, I opt for not using them most of the time. However...

## Presenting: Intersection Observer API

*Before starting, if you need a refresher on what's an API, [this](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction) is a good place to get info on it*

You may think that I'm out of my mind for suggesting that you should use an API for animating CSS but hear me out... [GitHub](https://github.blog/2021-01-29-making-githubs-new-homepage-fast-and-performant/) uses it to make their homepage more performant and faster so you know it must be good!

When we usually want to check an element's position in the window we might end up using stuff like `elem.clientTop`, `elem.offsetTop` or even `elem.getBoundingClientRect()` but the truth is that these properties/methods will trigger the browser to calculate the required style and layout (check the whole list of properties that target this and a further explanation [here](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)) which creates a performance bottleneck.

A way to circunvent this is by using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which, according to the MDN documentation, 'provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.'. So, basically, we'll just monitor if an element will enter/exit another element/the viewport and that's way easier for the browser to process.

## So... How do you do it?

The [IntersectionObserver interface](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) can be created very easily and all you have to do is to pass a callback to it and some options. The **callback** is what decides what will happen to the list of *IntersectionObserverEntry* objects and the **options** allow you to control the circumstances in which the *callback* will be called (please refer to the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for full details on this).

For example purposes only, we'll not define our **options** (which will make them adopt some default values) and we'll simply work with our **callback**, so our initial setup would be something like this:

```javascript
let expansionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
        // something here
    } else {
        // something here
    }
  });
});
```

Now that we have our *expansionObserver*, we need to grab the elements that we want to animate. For this we'll use `document.querySelectorAll()` and we'll get all the elements with the class `.expand`.

So, on our HTML it would look like this:
```html
<body>
    <div id="section-one"></div>
    <div id="section-two">
      <div id="container">
        <h1 class="expand">Hello</h1>
      </div>
    </div>
</body>
```

And our JavaScript would look like this:
```javascript
const elementsToExpand = document.querySelectorAll(".expand");
```

After this, we need to tell the `IntersectionObserver` that we want to `observe` these elements, and since we're using `querySelectorAll()` we need to loop over `elementsToExpand` and we'll use a `forEach()` for it.

```javascript
elementsToExpand.forEach((element) => {
  expansionObserver.observe(element);
});
```

To finish our JavaScript part, we need to fill the `if/else` statement we wrote on our callback. Here we'll want to style our `elementsToExpand` with the animation that they should have like so:

```javascript
let expansionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      entry.target.style.animation = `expansion 2s ease-in-out`;
    } else {
      entry.target.style.animation = "none";
    }
  });
});
```

So, this is the whole behaviour that you have to recreate and now all we have to do is to define in our CSS this `expansion` animation:
```css
@keyframes expansion {
  from {
    transform: scaleY(0.1);
  }
  to {
    transform: scaleY(1);
  }
}
```

And we're done! You can now check the full example in this preview or you can play around with the [CodeSandbox](https://codesandbox.io/s/billowing-paper-lm0ij?file=/index.html:310-352) yourself! I've added an extra element with a different animation so you could get a full grip of what's happening! 😄

<br />
<iframe src="https://codesandbox.io/embed/billowing-paper-lm0ij?fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="billowing-paper-lm0ij"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## And that's it!

What did you think about the `Intersection Observer API`? Will you give it a try on your next project?
Let me know what you thought about this post and feel free to follow me on [Twitter](https://twitter.com/HeyItzaMi) 🤘