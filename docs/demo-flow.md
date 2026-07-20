# Demo Flow

## Demo status

This document defines the intended demonstration. It does not claim that the described functionality has been implemented. Merchant identity, consumer identity, locations, distance, initial events, and the map environment are simulated for the prototype.

## Exact demo scenario

A local dessert merchant has eight fresh desserts available and expects low foot traffic between 3:00 PM and 5:00 PM. The merchant wants a truthful, nearby activation with explicit availability and expiration, without misleading urgency.

The demonstration follows this exact sequence:

Merchant need
→ GPT-5.6 campaign proposal
→ human review
→ publication
→ consumer discovery
→ claim
→ merchant redemption
→ campaign insight

## Merchant input

> We have eight fresh desserts available and low foot traffic between 3:00 PM and 5:00 PM. We want to attract nearby customers without using misleading urgency.

## Expected AI output

The following is the expected shape and content of a GPT-5.6 proposal for the demonstration; it is not recorded model output or evidence of a completed integration.

- **Campaign objective:** Increase visits during the merchant's low-traffic window while making the limited reward supply explicit.
- **Suggested title:** Afternoon Dessert Invitation
- **Suggested description:** Eight fresh desserts are available for nearby customers between 3:00 PM and 5:00 PM, while supplies last.
- **Place:** Use the merchant venue already selected by the deterministic system; GPT-5.6 must not alter its coordinates.
- **Start time:** 3:00 PM on the selected demo date.
- **Expiration time:** 5:00 PM on the selected demo date.
- **Reward supply:** Eight claims, based only on the merchant-provided quantity.
- **Reward terms:** One dessert offer per valid, unexpired, single-use claim; the merchant must review and confirm the exact offer before publication.
- **Missing information:** The precise reward or price benefit, selected demo date, claim expiration policy, and any eligibility restrictions require human confirmation.
- **Ambiguity notice:** "Attract nearby customers" does not define a distance; the simulated discovery radius must be selected by the human or deterministic demo configuration.
- **Primary metric recommendation:** Redemption rate, calculated as redeemed claims divided by created claims.
- **Safety note:** Do not describe the offer as urgent beyond the factual 3:00 PM–5:00 PM window and supply of eight.

## Human review and publication

The merchant reviews every proposed field, supplies the missing reward terms and demo date, confirms the configured venue and simulated discovery radius, and approves the campaign. GPT-5.6 cannot publish it. The deterministic system then records the campaign status, supply, start time, and expiration and performs publication.

## Consumer journey

1. A simulated nearby consumer opens the consumer map.
2. The map displays simulated user location, venue location, distance, and the published Pintag.
3. The consumer opens the Pintag detail screen.
4. The detail screen shows the place, factual time window, reward terms, expiration, and remaining supply.
5. The consumer selects the claim action while the campaign is active and supply remains.

## Claim and redemption

1. The deterministic system creates one claim, decreases available claim supply according to the defined rule, assigns an expiration, and issues a redemption code.
2. The claim confirmation screen displays the code and its expiration.
3. The consumer presents the code to the merchant staff member.
4. The staff member submits the code through the merchant redemption screen.
5. The deterministic system verifies that the code exists, is unexpired, and has not been used.
6. A valid code is marked redeemed once; a repeated, invalid, or expired submission is rejected.
7. GPT-5.6 does not determine presence, validate the code, or alter supply.

## Analytics and insight

The analytics screen displays clearly labeled demo funnel events together with events produced during the demonstration. Deterministic calculations show counts and rates for discovery, detail views, claims, and redemptions.

GPT-5.6 receives only the displayed metrics and produces a short, labeled insight. The expected insight should describe observed funnel behavior, distinguish simulated data, avoid fabricated activity, and avoid claiming that the campaign caused sales.

Example expected wording:

> Demo data shows that claims progressed to redemption at the displayed rate. Because the initial events are simulated and no sales baseline is available, this prototype cannot establish causal sales impact.

## Target duration

Target total: **2 minutes 40 seconds**, remaining under three minutes.

| Segment | Target time |
|---|---:|
| Introduce the merchant need | 0:15 |
| Generate and review the GPT-5.6 proposal | 0:40 |
| Approve and publish | 0:20 |
| Discover the Pintag and create a claim | 0:35 |
| Redeem the claim | 0:25 |
| Review analytics and GPT-5.6 insight | 0:25 |
| **Total** | **2:40** |

