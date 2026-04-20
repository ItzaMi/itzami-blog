---
title: "Build a Quote Generator with JavaScript: Your first API project"
slug: "build-a-quote-generator-with-javascript-your-first-api-project"
date: "2022-03-02T11:00+00:00"
description: "The purpose of this tutorial is simple: to allow you to work with an API by making a single request and display its info on the screen. That’s it! No tricks! And we’ll probably do it in like 10 lines of JavaScript 🤘 How exciting is that?"
thumbnail: "/images/posts/build-a-quote-generator-with-javascript-your-first-api-project.jpeg"
---

If you’ve never worked with an API (Application Programming Interface) before, WELCOME! I assure you that this is going to be an excellent first time! 😄

The purpose of this tutorial is simple: to allow you to work with an API by making a single request and display its info on the screen. That’s it! No tricks! And we’ll probably do it in like 10 lines of JavaScript 🤘 How exciting is that?

So, to summarize, in this tutorial you’ll learn a bunch of stuff like:

- selecting elements on the DOM
- `onClick` events
- trigger a `fetch` for an API
- displaying info in empty elements

If you're really just interested on the code, here's a link to the **[CodePen](https://codepen.io/ItzaMi/pen/vYgdXgL)** with it.

## What’s an API?

We should clarify on what’s an API if that’s something new to you.

An **[API](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction)** is an intermediary that allows for two applications to talk between them, and it will have a set of functions that allow applications to access data and interact with external software components, operating systems, or services.

The most widely practical example to describe an API is the following: think of a waiter at a restaurant. When you (*application 1*) get at a restaurant, you place your order (*request*) with the waiter (*API*) and he tells the kitchen (*application 2*); the kitchen then makes your order, gives it to the waiter and the waiter gives it to you (*response*).

In our tutorial we’ll use an API that **[fetches data from a server](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data)** and we’ll use the **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** to facilitate that communication (that means that we’ll actually be using **two** APIs in this tutorial 😦).

That’s enough theory for now but if you do have any doubts, please message me on [**Twitter**](https://twitter.com/HeyItzaMi).

## Starting with the HTML

Every web app needs its HTML and ours is no different! Our HTML for this application is incredibly straight forward and all you need is a `button` and a `div` with an `id`. So your `HTML` will look something like this:

```html
<button onclick='getQuote()'>Get quote</button>
<div id='insertQuoteHere' />
```

That’s it, job done! We can now move to the interesting part! 😄

## The JavaScript

Most of the APIs require you to deal with secrets but that’s out of the scope of this tutorial so we’ll be using a completely free one called **[kanye.rest](https://kanye.rest/)** (I know, I know 😅).

### Get our `div`

So, the first thing that we’ll need to do is to get our `<div id='insertQuoteHere' />` because we need it readily availably to insert our quote into it. For that we’ll use **[getElementById()](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)** (if you don’t know what that is, it’s a method that will an object that represents the element with the `id` that we pass as parameter.

So, in this case, this is going to be our first line of JavaScript.

```js
const divWithQuote = document.getElementById("insertQuoteHere");
```

### Create our function

We need to create our `getQuote()` function and this function will do the request and print the data into our `divWithQuote`.

You’ll see me using an **[arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)** but you can use a regular function expression.

Let’s declare our empty function

```js
const getQuote = () => {}
```

### The request

Now that we have our function, we’ll run the `fetch()` function provided by the [**Fetch API**](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), which will fetch (well, duh!) our data.

```js
const getQuote = () => {
	fetch("https://api.kanye.rest")
}
```

If you know click on the button, you won’t see anything happening, BUT... Congratulations, you just made your first request! 🎉

Now let’s deal with its data! 😄

The basic format for any fetch request is as follows:

```js
fetch('API_URL')
  .then(response => response.json())
  .then(data => console.log(data));
```

Now, some stuff here may look weird so let’s go through them:

- The [then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) method will wait for a response from the request and execute whatever is inside it
- Our `response` will look like an HTTP response, which means that, we need to extract the content from it and that’s why we use the [json()](https://developer.mozilla.org/en-US/docs/Web/API/Response/json) method
- After that extraction is complete, we can then deal with the parsed data and actual make something with it

With this settled, we can now adapt this format to our code and it will look like this:

```js
const getQuote = () => {
	fetch("https://api.kanye.rest")
		.then(response => response.json())
	  .then(data => console.log(data));
}
```

If you know click the button and open your console you should see the data, which will look something like this:

```js
{
	"quote": "Life is the ultimate gift"
}
```

I want to take this opportunity to say how important it is to be curious about anything that you do with code.

LOG EVERYTHING! LEARN WHAT YOU’RE WORKING WITH! PLAY WITH IT!

Code might be confusing and scary but the best way of dealing with that it to play with it and get to know it so don’t be afraid to throw random `console.log()` around! 😄

### From data to HTML

We’ve basically done everything that we need for our application to work. All we’re missing is to get that `quote` into our HTML and to do that we’ll use [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML).

While logging our `data` we can see that there’s an object inside with a single property (`quote`) so we can reference it by doing `data.quote` and we’ll get its value by doing so! This means that we can do the same for our `innerHTML`, like so:

```js
divWithQuote.innerHTML = data.quote;
```

So our JavaScript will look like this in it’s entirety:

```js
const divWithQuote = document.getElementById("insertQuoteHere");

const getQuote = () => {
	fetch("https://api.kanye.rest")
		.then(response => response.json())
	  .then(data => ( divWithQuote.innerHTML = data.quote ));
}
```

If you know press the button you should see a quote appearing on your div! 🎉 Here’s the working code 👇

<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
<iframe height="300" style="width: 100%;" scrolling="no" title="Quote Generator" src="https://codepen.io/ItzaMi/embed/vYgdXgL?default-tab=js&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/ItzaMi/pen/vYgdXgL">
  Quote Generator</a> by Rui Sousa (<a href="https://codepen.io/ItzaMi">@ItzaMi</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## And that’s it!

You’ve successfully created a quote generator! Well done! 😄

Hopefully you’ve learn how to work with APIs and you’re know able to dive deeper into how they work and what’s possible to do with them. 💪

Let me know what you thought about this post and feel free to follow me on **[Twitter](https://twitter.com/HeyItzaMi)** 🤘