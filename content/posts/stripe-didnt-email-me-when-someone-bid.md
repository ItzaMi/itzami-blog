---
title: "Stripe didn't email me when someone bid"
slug: "stripe-didnt-email-me-when-someone-bid"
date: "2026-08-27T22:42+01:00"
description: "While building a ten-logo postcard auction for a family trip to Italy, I learned that Stripe could confirm the payment without telling me when a bid became real."
thumbnail: "/images/posts/travel-with-me-email-notifications.png"
---

This project started, as many serious business ventures do, with me joking about getting strangers on the internet to pay for my next iPhone.

The joke came from [Vincent's original BrandMyMac post](https://x.com/vynsedev/status/2092544016315306400). He was auctioning ten sticker spaces on the lid of a MacBook he didn't own yet. The auction would pay for the MacBook, and the winning brands would travel around on it afterwards. It was funny, simple and very easy to understand from one image.

<a href="https://x.com/vynsedev/status/2092544016315306400" aria-label="Open Vincent's original BrandMyMac post on X">
  <img src="/images/posts/brand-my-mac-original-post.jpg" alt="Vincent's original X post announcing the BrandMyMac auction" style="width:100%;max-width:520px;height:auto" />
</a>

_[Vincent's original post](https://x.com/vynsedev/status/2092544016315306400), which sent me down this rabbit hole._

We briefly considered doing the same thing with a phone. Then a phone case. Then some other object I could carry around.

The problem was that none of those objects really mattered.

What I actually had was a family trip through Italy from 4 to 10 September and a reason to take a lot of photographs. So the idea became [Travel With Me](https://travelwithme.rest): one physical postcard with ten logo places, carried and photographed throughout the trip.

Brands bid for a place. The ten winners get printed on the real card. I take the card through Italy and share the photographs on X.

It is definitely not an advertising empire, but it is a real object, a real trip and a much better excuse to build a tiny auction than inventing another sample shop!

Once the site was ready, [I launched it by quoting Vincent's post](https://x.com/heyitzami/status/2093033098975883598). That connection matters because Travel With Me wasn't an idea I had been quietly planning for months. It was a direct response to seeing a fun format and asking what version could make sense in my own life.

[![The Travel With Me launch image showing the physical postcard in Italy](/images/posts/travel-with-me-launch.jpg)](https://x.com/heyitzami/status/2093033098975883598)

_[My launch post](https://x.com/heyitzami/status/2093033098975883598): ten internet brands, one physical postcard and one week in Italy._

## The auction made the payment flow slightly unusual

Every place begins at €5, but placing a bid isn't the same as buying a €5 product.

If I charged every bidder immediately, I would have to take one payment, refund it when somebody bid €6, charge the next person, refund them at €7, and repeat that until the auction ended. That would be a terrible experience for everybody involved.

Instead, Stripe places a temporary authorization for the full bid on the bidder's card. The money is only captured if that bid is still winning when the auction closes. When somebody is outbid, the previous authorization is cancelled.

That gave each part of the stack a specific job:

- Stripe handles Checkout and the card authorization
- Supabase stores the places, bids, logos and current winners
- The application decides whether a new authorized bid is high enough
- Resend sends me the useful notification afterwards

The public card only changes after the authorization is confirmed and the bid becomes active in the database. An abandoned Checkout should never make a logo appear, and an outbid authorization should never remain the winner just because its webhook arrived first.

## Then I tested the first bid

I placed a test bid on the site, completed Stripe Checkout and returned to the card.

The logo appeared. The place showed a current holder. Stripe had the PaymentIntent. Supabase had the active bid. Everything important had technically worked.

So I waited for the email telling me that somebody had bid.

Nothing arrived.

My first thought was: **isn't Stripe supposed to send me something?**

The answer, which felt obvious only after I knew it, was no. Stripe records the payment event and gives me a very good dashboard, but it doesn't know which moments in my little auction deserve an email. That part belongs to the application.

So I added it.

Not a receipt for the bidder, and not a generic Stripe payment email. What I wanted was an internal notification telling me that a bid had passed all the checks and was now genuinely holding one of the ten places.

## A successful checkout wasn't the moment I wanted

Because the auction uses authorizations instead of immediate charges, `checkout.session.completed` wasn't quite enough for the notification.

It tells me that the bidder completed Checkout, but I wanted the email only after Stripe confirmed that the amount was authorized **and** my database accepted it as the current bid for that place.

Stripe sends a [`payment_intent.amount_capturable_updated`](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method) event when a manually captured PaymentIntent becomes ready to capture. That became the useful boundary.

The full flow now looks like this:

```text
Choose a place and upload a logo
                 |
                 v
Complete Stripe Checkout
                 |
                 v
Stripe confirms the amount is capturable
                 |
                 v
The webhook verifies the Stripe signature
                 |
                 v
Supabase accepts the bid as the current winner
                 |
                 v
The logo appears and Resend emails me
```

There is an important ordering detail in there: the email is sent **after** the database accepts the bid.

Two people could try to bid on the same place very close together. I don't want an email about a payment that was authorized but lost the race to become the active bid. The database decides first; the notification reports that result.

## The email is deliberately practical

I didn't need a newsletter template or a big email system. I needed to look at my phone and understand what had happened.

The notification contains:

- The brand and bid amount
- The chosen place on the card
- The bidder's email and website
- Their uploaded logo
- A direct link to the PaymentIntent in Stripe

The reply-to address is also set to the bidder's email, so I can reply directly if I need to ask about a logo or website.

For now it is sent through [Resend](https://resend.com/docs/api-reference/emails/send-email). The two deployment variables are wonderfully boring:

```text
RESEND_API_KEY
BID_NOTIFICATION_EMAIL
```

The API key stays on the server. The destination address can change without touching the code.

## Webhooks repeat themselves, so emails need protection

Payment webhooks are designed to be retried. That is a good thing: a temporary server error shouldn't make the auction forget a real bid.

It also creates a very easy way to receive the same email twice.

I ended up protecting the notification at three levels:

1. Every Stripe event ID is stored after it is processed, so a repeated webhook can be recognised.
2. Every bid has a `bid_notification_sent_at` value in Supabase, so the application knows if its email already succeeded.
3. The request to Resend uses a stable key based on the bid ID. [Resend's idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys) make a retry return the original result instead of sending the same email again.

The third layer covers a particularly annoying failure: Resend could accept the email and then the database update could fail. Stripe retries the webhook, the application tries the notification again, and the stable Resend key prevents the retry from becoming a duplicate in my inbox.

That is a lot of caution for a tiny auction with ten places, but it is exactly the kind of bug that only appears after something interesting finally happens!

## User input still belongs to users

Brand names, websites and email addresses end up inside the HTML email. They are escaped before rendering, and the notification also has a plain-text version.

It would probably have been fine to throw a few values into an HTML string and move on. It would also have been completely unnecessary to trust uploaded data when escaping it is so cheap.

I added tests for both details that I really didn't want to regress:

- User-provided HTML is escaped
- The same bid always produces the same email idempotency key

## What Stripe does, and what my app does

This was the useful distinction for me.

Stripe tells the application that the authorization is ready. Supabase decides whether the bid becomes active. Resend delivers the message. My application connects those three facts into the sentence I actually care about:

> A confirmed €5 bid from this brand now holds place 01.

Payment infrastructure can be doing everything correctly while the product still says nothing to its owner.

Sometimes the missing feature really is just an email. The interesting part is choosing the exact moment when that email becomes true.

And that's it! The next real bid should now make the card change **and** make my phone do something.

If you're building something similar, or just want to take a place on the card, [let me know on X](https://x.com/HeyItzaMi) 🤘
