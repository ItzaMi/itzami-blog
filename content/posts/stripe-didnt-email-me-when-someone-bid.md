---
title: "Stripe didn't email me when someone bid"
slug: "stripe-didnt-email-me-when-someone-bid"
date: "2026-08-27T22:42+01:00"
description: "While building a ten-logo postcard auction for a family trip to Italy, I learned that Stripe could confirm the payment without telling me when a bid became real."
thumbnail: "/images/posts/travel-with-me-email-notifications.png"
---

I had a family trip to Italy planned for 4 to 10 September, and I knew I was going to take a lot of photos.

Then I saw [Vincent's original BrandMyMac post](https://x.com/vynsedev/status/2092544016315306400). He was auctioning ten sticker spaces on the lid of a MacBook he didn't own yet. The auction would pay for the MacBook, and the winning brands would travel around on it afterwards.

I liked how easy it was to understand: ten places, a live auction and a physical thing that would keep showing up in his photos.

<a href="https://x.com/vynsedev/status/2092544016315306400" aria-label="Open Vincent's original BrandMyMac post on X">
  <img src="/images/posts/brand-my-mac-original-post.jpg" alt="Vincent's original X post announcing the BrandMyMac auction" style="width:100%;max-width:520px;height:auto" />
</a>

_[Vincent's original post](https://x.com/vynsedev/status/2092544016315306400), where I got the idea._

Since I was already going to Italy, I decided to make my own version. That became [Travel With Me](https://travelwithme.rest): one physical postcard with ten logo places that I would carry and photograph throughout the trip.

Brands bid for a place. The ten winners get printed on the real card. I take the card through Italy and share the photographs on X.

Once the site was ready, [I launched it by quoting Vincent's post](https://x.com/heyitzami/status/2093033098975883598).

[![The Travel With Me launch image showing the physical postcard in Italy](/images/posts/travel-with-me-launch.jpg)](https://x.com/heyitzami/status/2093033098975883598)

_[My launch post](https://x.com/heyitzami/status/2093033098975883598): ten internet brands, one physical postcard and one week in Italy._

## The payment flow was the weird part

Every place begins at €5, but placing a bid isn't the same as buying a €5 product.

If I charged every bidder immediately, I would have to take one payment, refund it when somebody bid €6, charge the next person, refund them at €7, and keep doing that until the auction ended.

Instead, Stripe places a temporary authorization for the full bid on the bidder's card. The money is only captured if that bid is still winning when the auction closes. When somebody is outbid, the previous authorization is cancelled.

The setup ended up being:

- Stripe handles Checkout and the card authorization
- Supabase stores the places, bids, logos and current winners
- The application decides whether a new authorized bid is high enough
- Resend sends me an email afterwards

The logo only appears on the public card after Stripe confirms the authorization and Supabase accepts the bid. An abandoned Checkout should never make a logo appear.

## Then I tested the first bid

I placed a test bid on the site, completed Stripe Checkout and returned to the card.

The logo appeared, the place showed a current holder and the payment was in Stripe. It looked like everything had worked.

So I waited for the email telling me that somebody had bid.

Nothing arrived.

My first thought was: **isn't Stripe supposed to send me something?**

Apparently not. Stripe records the payment and gives me the events, but it doesn't know that I call this a bid or that I want an email when it becomes the current winner. That part belongs to the application.

So I added it.

I didn't want a receipt for the bidder. I wanted an email for myself saying that a bid had passed the checks and was now holding one of the ten places.

## A successful checkout wasn't the moment I wanted

Because the auction uses authorizations instead of immediate charges, `checkout.session.completed` wasn't quite enough for the notification.

It tells me that the bidder completed Checkout, but I wanted the email only after Stripe confirmed that the amount was authorized **and** my database accepted it as the current bid for that place.

Stripe sends a [`payment_intent.amount_capturable_updated`](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method) event when a manually captured PaymentIntent becomes ready to capture. That's the event I use.

So the flow is:

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

The email is sent **after** the database accepts the bid. If two people bid on the same place very close together, I only want the email about the one that is actually holding it.

## The email I wanted

I didn't need a big email system. I just wanted to look at my phone and understand what had happened.

The notification contains:

- The brand and bid amount
- The chosen place on the card
- The bidder's email and website
- Their uploaded logo
- A direct link to the PaymentIntent in Stripe

The reply-to address is also set to the bidder's email, so I can reply directly if I need to ask about a logo or website.

The email is sent through [Resend](https://resend.com/docs/api-reference/emails/send-email). I only had to add two deployment variables:

```text
RESEND_API_KEY
BID_NOTIFICATION_EMAIL
```

The API key stays on the server. The destination address can change without touching the code.

## Webhooks repeat themselves, so emails need protection

Stripe retries webhooks when something goes wrong. That's useful, but it also means the same handler can run more than once. Sending the email without any protection would be a very easy way to email myself twice.

I ended up protecting the notification at three levels:

1. Every Stripe event ID is stored after it is processed, so a repeated webhook can be recognised.
2. Every bid has a `bid_notification_sent_at` value in Supabase, so the application knows if its email already succeeded.
3. The request to Resend uses a stable key based on the bid ID. [Resend's idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys) make a retry return the original result instead of sending the same email again.

The third layer covers a particularly annoying failure: Resend could accept the email and then the database update could fail. Stripe retries the webhook, the application tries the notification again, and the stable Resend key prevents the retry from becoming a duplicate in my inbox.

It is probably more protection than this small auction needs, but duplicate emails are annoying and the checks were easy to add.

## The email contains uploaded data

The brand name, website and email all come from the bid form, so I escape them before putting them in the HTML. The email also has a plain-text version.

I added two tests:

- User-provided HTML is escaped
- The same bid always produces the same email idempotency key

## Stripe wasn't the notification system

Stripe did what I asked it to do. It authorized the card and sent an event. Supabase decided whether the bid became active, and Resend delivered the email.

My application is the only part that can turn those things into the message I actually care about:

> A confirmed €5 bid from this brand now holds place 01.

I had assumed that the payment provider would also notify me about the bid, but the idea of a "bid" only exists inside my app.

And that's it! The next real bid should update the card **and** send me an email, which is much better than checking the Stripe dashboard every five minutes 😂

If you're building something similar, or just want to take a place on the card, [let me know on X](https://x.com/HeyItzaMi) 🤘
