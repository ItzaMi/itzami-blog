---
title: "Learning Go By Doing | Scraping Supermakets | A Post-Project Review"
slug: "learning-go-by-doing-scraping-supermakets"
date: "2024-12-24T17:00+00:00"
description: "In an attempt to learn Go, I decided to delve into one of the capabilities of a backend language, which is scraping the web. For it, I decided to focus on getting info from supermarket stores. This is a post-project review of what I learned"
thumbnail: "/images/posts/ItzaMi_Frame_28.jpg"
---

*This is not a tutorial but a post-project review of what I learned. Check the repository [here](https://github.com/ItzaMi/compare-supermarket-prices).*

In an attempt to learn a new language (in this case, [Go](https://go.dev/)), I started this `compare/supermaket_prices` project with a couple of goals:

- get familiar with the language's syntax
- understand the language's limitations
- strengthen myself in the backend field by exposing myself to one of its many capabilities

## The Project

The idea for this project came from the fact that prices across different stores are very distinct and I wanted to know more about them, so the proper course of action was, obviously, to try to automate a 5-minute task!

![](https://preview.redd.it/0cm6yx27tez21.jpg?auto=webp&s=5755c035c4bef4d74125b798bcb6ec44b7154405)

Nah, but for real, I wanted to learn Go and it seemed like a good use case for it, and in a time of impoverished energy for thinking of projects, anything is good enough!

### The 'Not So Good' Parts

I want to start by saying that this project is very simplistic regarding its functions, and it assumes a lot of stuff, but, at this time of learning Go, it does the job and I'll work on improving it. That doesn't mean, however, that I don't already see its flaws.

The first one, and maybe this is transversal to all web scraping code, I'm heavily leaning on the HTML structure to get to my results. Trying to get the `:first-of-type` doesn't sound bad, but trying to get there by targeting `classes` surely does; not only can the classes change, but it also means that I can't abstract the logic and use it across different systems.

Ideally, in my mind, I would have a way of identifying what is a product name (_regex?_) and then also grab the value that has a currency symbol next to it (this actually doesn't sound that bad!). So, basically look for patterns! This also assumes a lot of stuff regarding the data but seems to be _smarter_ than what I'm doing.

### The 'Aha' Moment

My web development brain wanted to grab the project and do the following:
1. Grab the homepage
2. Find the search bar
3. Type in the search bar and trigger the click on the search button
4. Get to the page of the product
5. Do whatever I'm already doing

This 👆 sounds like a very JavaScript way of doing stuff!

Thankfully, I quickly realized that this wouldn't be very smart, and would only be necessary if the websites didn't have separate URLs for their search and products (which, mercifully, they do), but the idea of scrapping via 'user flow' (is this a thing?) sounds fun (to a certain point).

### The Future

I'm creating a split `.csv` for each store but ideally, I would do a lot more than this. I'm picturing a single file with rows of products and columns of stores, so it's easier to parse the stores with the cheapest items.

## Conclusion

Overall, I've enjoyed Go for the short bit that I've tried it in this project. The typing flows well into my brain and the syntax makes sense so I'm definitely excited to see what I'll build next with it!