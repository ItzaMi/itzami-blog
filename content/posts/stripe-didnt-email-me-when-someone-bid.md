---
title: "Stripe didn't email me when someone bid"
slug: "stripe-didnt-email-me-when-someone-bid"
date: "2026-08-27T22:42+01:00"
description: "I placed a test bid on my tiny Stripe-powered auction, received no notification, and learned where payment events end and application logic begins."
thumbnail: "/images/posts/travel-with-me-email-notifications.png"
---

I placed a test bid on [travelwithme.rest](https://travelwithme.rest), saw the logo appear on the card and waited for the email telling me that somebody had bid.

Nothing arrived.

My first thought was: **isn't Stripe supposed to send me something?**

The answer, which felt obvious only after I knew it, was no. Stripe records the payment event and gives me a very good dashboard, but it doesn't know which moments in my little auction deserve an email. That part belongs to the application.

So I added it.

![Travel With Me, the tiny auction that needed its own email notifications](/images/posts/travel-with-me-email-notifications.png)

## A successful checkout wasn't the moment I wanted

The auction doesn't charge every bidder immediately. When somebody bids, Stripe places a temporary authorization on their card. I only capture the winning bid when the auction closes. If they are outbid, I cancel their authorization instead.

That meant `checkout.session.completed` wasn't quite enough for the notification.

It tells me that the bidder completed Checkout, but I wanted the email only after Stripe confirmed that the amount was authorized **and** my database accepted it as the current bid for that place.

Stripe sends a [`payment_intent.amount_capturable_updated`](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method) event when a manually captured PaymentIntent becomes ready to capture. That became the useful boundary.

The flow now looks like this:

```text
Bidder completes Stripe Checkout
                |
                v
Stripe confirms the amount is capturable
                |
                v
The webhook verifies and activates the bid
                |
                v
Resend emails me the bid details
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
