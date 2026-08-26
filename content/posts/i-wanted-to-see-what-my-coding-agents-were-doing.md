---
title: "I wanted to see what my coding agents were doing"
slug: "i-wanted-to-see-what-my-coding-agents-were-doing"
date: "2026-08-26T21:00+01:00"
description: "I wanted a privacy-safe way to see what the coding agents running on my Mac were doing, so I built a small status room. This is the very unfinished story of making it real."
thumbnail: "/images/posts/agents-live-room.jpg"
---

I had an idea: what if I could open my website and see what my coding agents were doing?

Not their whole chain of thought. Not a terminal livestream. Just a small sign of life telling me if the agents I have running in Codex, Cursor, Claude or my VPS were doing something.

When I was trying to explain the idea, I used a post showing a full 3D command center for AI agents as an example. Little characters were walking around an office, sitting at desks and apparently doing actual work.

It looked **incredibly cool**.

It was also much more elaborate than what I had in mind!

![The Hermes3D post used as a visual example](/images/posts/agents-hermes3d-inspiration.png)

_The Hermes3D post by Luke The Dev that I used as a visual example._

What I wanted was the feeling behind it: opening a page and immediately understanding if something was happening.

So, naturally, I opened my website and started adding an `/agents` page.

## The first version showed too much

The most obvious version of an agent dashboard is also the one that immediately becomes uncomfortable.

You show the agent name, the project, the task it is working on, the last command it ran and maybe a little stream of messages. It looks impressive! It also turns a public page into a very convenient list of things that probably shouldn't be public.

I don't need people to know which private project I'm changing at a specific moment. I definitely don't need prompts, commands, paths or output leaving my machine just because I wanted a cool page on my personal website.

The useful part was much smaller:

- Thinking
- Researching
- Building
- Reviewing
- Testing
- Deploying
- Monitoring
- Waiting
- Idle
- Offline

That's pretty much it!

The status tells me that something is happening without telling everyone what that something is.

## A quiet room instead of a command center

I started with text because text forces the idea to be useful before it becomes visually impressive.

![The first live version of my agents room](/images/posts/agents-live-room.jpg)

The page currently shows how many agents are connected, which ones are working and a small stream of status changes. If an agent delegates work in the future, I also want the child agent to stay visually connected to the one that started it.

The UI is still very rough. That's intentional. I want to know if I keep opening this page before spending time making tiny people walk around a virtual office!

## Then I connected it to something real

The first screen used example data. It looked alive, but it wasn't alive, which makes an agent status page particularly pointless.

For the first real connection I used Codex's local session events. A task starting becomes `thinking`, tool activity becomes `building`, and a completed turn becomes `idle`. The page checks the status every few seconds, but that check is just reading local data. It doesn't call a model and it doesn't spend tokens.

I also made the API boring on purpose. Session identifiers are hashed and the response only contains the agent source, host, status and how recently it changed. Even if someone inspects the request, there shouldn't be a hidden project name waiting there.

This local reader is useful for proving the page, but it isn't the final integration. Session transcript files are an internal detail and I don't want the idea to depend on their format forever.

Thankfully, [Codex has lifecycle hooks](https://learn.chatgpt.com/docs/hooks) for sessions, tool use, stopped turns and subagents. Those hooks should give me a cleaner way to report status and properly distinguish a main agent from a reviewer or tester.

## The Vercel problem

My website runs on Vercel, so my next thought was: can I just leave everything there?

Well... not really.

The page can stay on Vercel, but a Vercel function can't magically read what is happening on my Mac. It also isn't the place where I want to keep this small piece of persistent, frequently changing state.

Since I already have a VPS, the actual shape is becoming this:

```text
Codex / Cursor / Claude on my Mac
                  |
                  | small authenticated heartbeats
                  v
         Status API on my VPS
                  |
                  | privacy-safe public JSON
                  v
         /agents page on Vercel
```

The agents will send tiny HTTPS updates such as `building` or `testing`. The VPS will store the latest state in SQLite, mark agents offline when their heartbeat disappears and expose a read-only feed to the website.

No inbound connection to my Mac. No LLM running just to check if another LLM is idle. And, most importantly, no task details crossing the boundary.

## There are still a lot of open questions

At this point only the local Codex prototype is real. Cursor, Claude and the VPS agent aren't connected yet. The backend is specified but not deployed. The aliases need work, the event stream is noisy and the UI needs a proper pass.

I'm also not completely convinced that this deserves to become more than a personal experiment.

But I like the constraint of making agent activity visible **without turning visibility into surveillance**. A public status should feel more like the light outside a recording studio: something is happening in there, but you don't get to hear the private conversation.

That's the part I want to keep exploring.

Maybe the final version will have a little office. Maybe it will remain a few lines of text and some coloured dots. For now, it is real enough to switch from `building` to `idle` when an agent finishes its work, and that already feels strangely satisfying.

And that's it! I'll document the next version if this survives the experiment.

If you're building something similar, or if you have an idea for what this could become, [let me know on X](https://x.com/HeyItzaMi) 🤘
