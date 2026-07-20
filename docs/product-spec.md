# Product Specification

## Product status and purpose

PINTAG Spatial Campaign Copilot is an independent OpenAI Build Week prototype for the Work & Productivity track. It is separate from, and does not integrate with or modify, the contractual PINTAG MVP.

The prototype is intended to help a local merchant transform a natural-language operational need into a structured, place-bound, time-bound, and measurable campaign while keeping publication under human control.

## Problem

Local merchants may have temporary inventory, unused capacity, or time-sensitive opportunities, but translating an operational need into a clear local campaign requires decisions about audience, place, timing, reward terms, supply, and measurement. Existing digital channels may not reliably connect that need with nearby consumers who are ready to act.

## Audience

- Merchant owners who define business needs, review campaign proposals, and publish campaigns.
- Nearby consumers who discover a campaign, review its terms, and claim a reward.
- Merchant staff members who validate a consumer-provided redemption code through deterministic system rules.

## Value proposition

The prototype is designed to shorten the path from a merchant's natural-language need to a human-approved local campaign, then demonstrate a measurable flow from publication through discovery, claim, redemption, and campaign insight.

## Core flow

Merchant need
→ GPT-5.6 campaign proposal
→ human review
→ publication
→ consumer discovery
→ claim
→ merchant redemption
→ campaign insight

## Actors

### Merchant owner

Provides the operational need, reviews the generated proposal, resolves missing information, approves publication, and views campaign analytics.

### Nearby consumer

Discovers a published campaign in the simulated map environment, reviews the Pintag details, claims an available reward, and presents the resulting redemption code.

### Merchant staff member

Receives the consumer's redemption code and submits it to the deterministic redemption flow. Staff members do not decide whether an invalid, expired, or previously used code should be accepted.

## User stories

- As a merchant owner, I want to describe an operational need in natural language so that I can receive a structured campaign proposal.
- As a merchant owner, I want ambiguities and missing information identified so that I can resolve them before publication.
- As a merchant owner, I want to review and approve every campaign so that GPT-5.6 cannot publish without my consent.
- As a merchant owner, I want a recommended primary metric so that the campaign has a clear measurement target.
- As a nearby consumer, I want to see the campaign's place, time window, availability, and reward terms so that I can make an informed claim.
- As a nearby consumer, I want a claim confirmation and redemption code so that I can redeem the reward at the merchant venue.
- As a merchant staff member, I want the system to validate a redemption code deterministically so that single-use and expiration rules are consistently applied.
- As a merchant owner, I want to see funnel metrics and a concise GPT-5.6 insight so that I can understand observed campaign performance without unsupported causal claims.

## Minimum product screens

1. **Merchant dashboard:** Displays campaign records, deterministic statuses, time windows, reward supply, and summary metrics.
2. **AI campaign composer:** Accepts the merchant's natural-language need and presents missing or ambiguous information identified by GPT-5.6.
3. **Campaign review:** Displays the structured proposal and requires explicit human approval before publication.
4. **Consumer map:** Shows the simulated venue, simulated user location, simulated nearby distance, and published campaign discovery entry.
5. **Pintag detail:** Shows campaign terms, venue, start time, expiration, remaining supply, and claim action.
6. **Claim confirmation:** Confirms a deterministic claim, its expiration, and its redemption code.
7. **Merchant redemption:** Accepts a redemption code and reports deterministic validity, expiration, and single-use results.
8. **Campaign analytics:** Shows recorded funnel events, derived campaign metrics, and a clearly labeled GPT-5.6 performance insight.

## Functional requirements

### Campaign generation and review

- The prototype must accept a merchant's natural-language operational need.
- GPT-5.6 must generate a structured campaign proposal.
- The proposal must include place, start time, expiration time, reward terms, reward supply, target audience or discovery context, and a recommended primary measurement metric.
- GPT-5.6 must identify missing information and ambiguous terms instead of silently inventing required facts.
- The merchant owner must be able to review the complete proposal before publication.
- Publication must require an explicit human approval action.
- GPT-5.6 must not change venue coordinates or publish a campaign.

### Campaign lifecycle

- The system must manage campaign status deterministically.
- The system must enforce the configured start and expiration times.
- The system must manage reward supply deterministically and must not fabricate scarcity.
- Published campaign terms and expiration must remain visible to consumers.

### Discovery, claim, and redemption

- The consumer map must use clearly simulated identity, location, venue, distance, and map data.
- A consumer must be able to inspect a published Pintag before claiming.
- Claim creation and claim expiration must be deterministic.
- Each successful claim must receive a redemption code.
- Redemption validation must be deterministic, single-use, and subject to expiration.
- GPT-5.6 must not determine physical presence, validate redemption, or control inventory state.

### Events, metrics, and insight

- The system must record defined funnel events for publication, discovery, detail view, claim, and redemption.
- Campaign metrics must be computed deterministically from recorded events.
- Initial demo events may be simulated and must be identifiable as demo data.
- GPT-5.6 may generate a short campaign-performance insight from supplied metrics.
- GPT-5.6 must not fabricate activity or analytics or claim causal sales impact without evidence.

## Non-functional requirements

- The primary end-to-end flow must be demonstrable in under three minutes.
- Human control over publication must be explicit and visible.
- Campaign expiration, reward terms, and supply must be clear and internally consistent.
- AI-generated content and insight must be distinguishable from deterministic system state.
- Simulated data must be distinguishable from observed or user-entered data.
- The experience should be visually aligned with PINTAG's premium identity without implying production readiness.
- The prototype should fail safely when GPT-5.6 output is unavailable, invalid, incomplete, or ambiguous.
- Only the minimum data necessary for the demonstration should be collected or retained.
- The experience must avoid unsupported claims, fabricated scarcity, and misleading urgency.

## Prototype boundaries

### Required as real prototype behavior

- GPT-5.6 campaign generation
- Structured AI output
- Human review
- Campaign publication
- Claim
- Redemption
- Event tracking
- GPT-5.6 campaign insight

These are requirements for the prototype and are not claims that implementation has been completed.

### Demo or simulated

- Merchant and consumer identity
- User location
- Venue location
- Nearby distance
- Initial campaign events
- Map environment

## Exclusions

- Payments
- Production authentication
- Real merchant onboarding
- Background location
- Real fraud detection
- Full PINTAG social or community features
- Integration with the contractual PINTAG MVP

## Acceptance criteria

- A merchant can enter a natural-language need and request a structured GPT-5.6 proposal.
- The proposal identifies missing or ambiguous information and recommends one primary measurement metric.
- The proposal cannot be published until a merchant owner explicitly approves it.
- A published campaign exposes clear reward terms, supply, venue, start time, and expiration.
- A consumer can discover the campaign in a clearly simulated map environment and create a claim while supply and time rules permit.
- A claim receives an expiring redemption code.
- Merchant staff can submit the code, and deterministic rules reject expired, invalid, or previously used codes.
- Funnel events and campaign metrics are derived from recorded or clearly labeled simulated events.
- GPT-5.6 can produce a short insight grounded only in supplied metrics and without causal sales claims.
- The complete demonstration can be performed in under three minutes.
- No excluded capability or contractual PINTAG MVP integration is required to complete the demonstration.

