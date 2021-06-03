---
title: "How to build an accordion with JavaScript"
description: "Creating an accordion with JavaScript might seem like a true battle but it doesn't have to be. Check out this tutorial to see how you can easily build it!"
author: "Rui Sousa"
image: ./how-to-build-an-accordion-with-javascript.png
date: "2021-06-03"
type: post
---

I've seen some people battle with accordions in the past and, well, it wasn't pretty. BUT... It's completely understandable! An accordion has a whole lot going on and on a first sight it seems like all the functionalities will be pretty hard to develop.

Well... I'm here to prove that that is wrong and I want to help you build your very best JavaScript accordion 😄 And in this tutorial you'll learn a bunch of stuff like:

- selecting elements on the DOM
- forEach loops
- event listeners
- toggling class lists

If you're really just interested on the code, here's a link to the [CodePen](https://codepen.io/ItzaMi/pen/bGgaOEr) with it. I also have a YouTube video for it if you're more of a visual person 👇

<iframe width="100%" height="500" src="https://www.youtube.com/embed/4w2bcqb25VQ?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

So, with all of that out of the way, let's start this post 😎

## Starting with the HTML

We'll start by create a basic structure of the HTML. And here it's pretty straight forward. You'll want a `wrapping <div>` that will hold your _accordion component_ and inside it you'll have different _accordion items_. Inside each _item_ you'll want to have two things:

1. the content that will always show (it can be just a `<p>` or it can be an entire `<div>`)
2. a `<div>` that will have the content that will _collapse_ (AKA, that will appear and disappear when you press **1)**).

A made a image to illustrate the basic structure and I advise you, specially when you're starting, to sketch out what you're intending to build since it makes it easier to split everything into smaller parts so you can work on them separately.

![Initial structure of the accordion](./initial-sketch-of-structure.png)

So, now that we have our structure, we can build it. In my example below, as you can see I have the mentioned `<div>` that has everything inside and that's our _accordion component_ and inside each I have an `accordionTitle`, which represents the content that will always be showing, and a `accordionContent` that will be the content that will appear and disappear. You can change up the HTML elements that you use (maybe you would prefer to use `<ul>` and `<li>`) but that's on you! And that's our HTML 🎉

```html
<body>
  <h1>Accordion</h1>

  <div>
    <div class="accordionItem">
      <h2 class="accordionTitle">Tab 1</h2>
      <div class="accordionContent">
        <p>Information here</p>
      </div>
    </div>

    <div class="accordionItem">
      <h2 class="accordionTitle">Tab 2</h2>
      <div class="accordionContent">
        <p>Information here</p>
      </div>
    </div>

    <div class="accordionItem">
      <h2 class="accordionTitle">Tab 3</h2>
      <div class="accordionContent">
        <p>Information here</p>
      </div>
    </div>
  </div>
</body>
```

## A step further with our CSS

We have our HTML up and that's great but that's not an accordion. We have at least to hide `accordionContent` to at least make it look like one so that's what we're going to do. We simply want to hide that content on this step so what we're going to add to our CSS is the following.

```css
body {
  margin-left: auto;
  margin-right: auto;
  max-width: 40em;
}

.accordionTitle {
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.accordionTitle + .accordionContent {
  display: none;
}
```

The styling for the `body` and `.accordionTitle` it's just a matter of preference. I noticed, when clicking on `.accordionTitle` that I was getting highlighted text and I didn't wanted that so I chose to remove it with [user-select](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select) and since I wanted for the user to know that this element was clickable, I changed the cursor that appears when you over it to a pointer. That's it.

The `.accordionTitle + .accordionContent` is what matters and, honestly, the [adjacent sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator) is pretty much all you want here. It will style your `.accordionContent` based on if it immediately follows `.accordionTitle` and, on for my accordion structure, it's just what I need.

For now, this is the CSS that we'll need. We'll make some changes to it once we start working on our JavaScript but we'll get there right away!

## It's alive... With JavaScript (and some CSS)

So, we've hidden our content but now we want to show it when we click on `accordionTitle` (or show it if it's showing, of course). So we want to grab this `accordionTitle` class and add an [event listener](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) to it, in this case a _click event_, and then some magic will end happening!

So, on our JavaScript we'll grab all the elements on our HTMl that have this `.accordionTitle` and we'll do it with [querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll).

```js
const accordionTitles = document.querySelectorAll(".accordionTitle")
```

This piece of codes grabs all the elements that have this class name and returns a `NodeList`. A `NodeList` is an object that has a collection of `nodes` in it which, in this case, it's our elements that have the `.accordionTitle` in them, which means, our `<h2>`.

Now that we have our elements, we need to add to each of them a click event and for that we'll use a [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) loop.

A `forEach` loop allows us to go through each element of an array (or, in this case, the NodeList) and do something to it. It's very similar to a `.map()` but, unlike `.map()`, it will not return anything from it because any `return` inside a `forEach` will be discarded. I'm using the `forEach` because I want to use the original data from my array/nodeList and do something with it instead of changing it.

So, we'll do something like the following.

```js
accordionTitles.forEach(accordionTitle => {})
```

Now, inside these brackets we can define what we're doing with each item, our `accordionTitle`, and we know that we want for something to happen when we click on them so we'll add an `eventListener` to them.

```js
accordionTitles.forEach(accordionTitle => {
  accordionTitle.addEventListener("click", () => {})
})
```

Here's we saying that, when we click on an `accordionTitle` something will happen and we'll define what happens inside these new brackets.

So... We know that now our `div` with the content is hidden and we want to show it so... how can we do that? Here's my approach to it:

On our CSS we're currently hiding the content based on our `.accordionTitle` element and I want to keep that logic to show it as well. Which means that I want to alter our `.accordionTitle` in some way that it allow for our `.accordionContent` to have a different styling (throwback to the _adjacent sibling combinator_).

On the JavaScript we'll change the `classList` of our `accordionTitle` by adding (or removing) a new class called `is-open`.

```js
accordionTitles.forEach(accordionTitle => {
  accordionTitle.addEventListener("click", () => {
    accordionTitle.classList.toggle("is-open")
  })
})
```

So, what's my way of thinking here?
If I can add a class to my `accordionTitle`, and I'm controlling this **accordion content <div>** with that same element on my CSS, I can add a new CSS rule which tells my code that, when the `.accordionTitle` also has the class `is-open`, then the `.accordionContent` that comes immediately after it should have a `display: block` and it looks like this.

```css
.accordionTitle.is-open + .accordionContent {
  display: block;
}
```

So, once again, I'm controlling `.accordionContent` visibility, or presence, with `.accordionTitle` and by **toggling a new class** to `.accordionTitle`, I'm able to show and hide `.accordionContent` as I wish.

And now, it just works, if you would try it. And you have a fully functioning accordion with very few lines of JavaScript, two classes in the HTML and pretty much just two CSS rules. Isn't that amazing? 🤯

## Let's go even further

Currently our code allows us to open and close any tab but all the others that might be open stay like that and that's not really the _perfect accordion_ so let's work on it, shall we?
Currently we're toggling each element independently but that's not what we want. We want to check if there are already any element that are open already and we want to remove that property so this is what I'm going to do:

I'll start by removing our `toggle` and first I want to create an [if/else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) statement. On my `if` I want to check if the `accordionTitle` has the class `is-open` and, if it does, I want to remove it. We'll do the following on our JavaScript

```js
if (accordionTitle.classList.contains("is-open")) {
  accordionTitle.classList.remove("is-open")
}
```

Now, my `else` will be responsible for adding the `is-open` class and we can do it like this

```js
else {
	accordionTitle.classList.add("is-open");
}
```

At this point we're basically at the same level that we were with the `toggle`. Now, on this `else` statement I want to see if there are any other elements with the `.is-open` class and, if there are, I want to remove it and we can do it like this.

First we do a `querySelectorAll` for all the elements with the `.is-open` class like this

```js
const accordionTitlesWithIsOpen = document.querySelectorAll(".is-open")
```

Then we'll need to run a new `forEach` loop to iterate over each element so we can remove the class and that looks something like this

```js
accordionTitlesWithIsOpen.forEach(accordionTitleWithIsOpen => {
  accordionTitleWithIsOpen.classList.remove("is-open")
})
```

And we're done! Now once you click on a tab the other will close and we have a fully functioning accordion! 🎉🕺
Here's the working code 👇

<iframe height="439" style="width: 100%;" scrolling="no" title="JavaScript Accordion" src="https://codepen.io/ItzaMi/embed/bGgaOEr?height=439&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/ItzaMi/pen/bGgaOEr'>JavaScript Accordion</a> by Rui Sousa
  (<a href='https://codepen.io/ItzaMi'>@ItzaMi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Here's a challenge for you

I would like to challenge you to do something now: using what you've learned so far, I would like for you to create a button that would close and open all the tabs. Are you up for the challenge? If you are, send me your code to my [Twitter](https://twitter.com/HeyItzaMi) 😄

## And that's it!

Hopefully, you learned everything you need to know about building your own JavaScript Accordion and you understood that it's not that hard to make something that rocks 💪
Let me know what you thought about this post and feel free to follow me on [Twitter](https://twitter.com/HeyItzaMi) 🤘
