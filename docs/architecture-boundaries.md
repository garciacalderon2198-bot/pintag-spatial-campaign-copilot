# Architecture Boundaries

## Boundary objective

The prototype must separate probabilistic GPT-5.6 assistance from deterministic campaign, claim, redemption, and measurement state. Human approval is the boundary between an AI-generated proposal and publication. This architecture applies only to the independent Build Week prototype and does not define or modify the contractual PINTAG MVP.

## GPT-5.6 responsibilities

GPT-5.6 is responsible for:

- Interpreting the merchant's natural-language need.
- Generating a structured campaign proposal.
- Identifying missing information and ambiguous terms.
- Recommending a primary measurement metric.
- Generating a short campaign-performance insight grounded in supplied metrics.

GPT-5.6 output is advisory. It must be validated against the expected structure and presented for human review before it can affect publishable campaign content.

## Deterministic system responsibilities

The application layer is responsible for authoritative state and rules involving:

- Campaign status.
- Start and expiration time.
- Reward supply.
- Claim creation.
- Claim expiration.
- Redemption-code issuance.
- Single-use redemption validation.
- Funnel-event recording.
- Campaign-metric calculation.
- Human approval and publication transitions.

GPT-5.6 must not serve as the source of truth for any of these responsibilities.

## Simulated components

The following prototype components are demo or simulated data rather than production integrations:

- Merchant identity.
- Consumer identity.
- User location.
- Venue location.
- Nearby distance.
- Initial campaign events.
- Map environment.

Simulated values must be labeled in the experience or demo narrative and must not be represented as observed real-world activity.

## Trust and safety boundaries

- **Human publication control:** GPT-5.6 cannot publish a campaign; explicit merchant approval is required.
- **Coordinate integrity:** GPT-5.6 cannot select or change authoritative venue coordinates.
- **Presence integrity:** GPT-5.6 cannot Determine physical presence as a source of truth. Prototype location and distance are simulated.
- **Redemption integrity:** GPT-5.6 cannot validate redemption codes or override expiration and single-use rules.
- **Inventory integrity:** GPT-5.6 cannot control reward supply or merchant inventory state.
- **Analytics integrity:** GPT-5.6 cannot fabricate events, metrics, activity, or scarcity.
- **Causal restraint:** Insights cannot claim causal sales impact without appropriate evidence.
- **Terms clarity:** Reward terms, factual supply, start time, and expiration must be visible before claim creation.
- **Ambiguity handling:** Required missing information must be surfaced for human resolution rather than invented.

## Data minimization

- Use simulated actor identities rather than production personal accounts.
- Use simulated locations and distance rather than collecting background or precise live location.
- Send GPT-5.6 only the merchant need, reviewed campaign fields, or aggregate metrics required for the current task.
- Do not send redemption codes, credentials, secrets, or unnecessary consumer-level event histories to GPT-5.6.
- Avoid collecting payment details, production authentication data, or real merchant-onboarding information.
- Keep initial demo events clearly labeled and separable from events generated during the demonstration.
- Retain only the minimum prototype state needed to demonstrate the approved flow.

## Failure and fallback behavior

### Campaign generation failure

If GPT-5.6 is unavailable, times out, returns invalid structured output, or omits required information, the system must not publish. It should preserve the merchant's input, explain that no valid proposal was produced, and allow a retry.

### Ambiguous or incomplete proposal

If the proposal contains ambiguous or missing required fields, the review screen must identify them and prevent publication until the merchant resolves them.

### Unsafe or unsupported proposal

If generated content introduces misleading urgency, fabricated scarcity, unsupported claims, altered coordinates, or unclear reward terms, the proposal must be rejected or held for correction before publication.

### Publication or state-transition failure

If a deterministic publication, claim, or redemption transition fails, the prior authoritative state must remain unchanged and the interface must report the failure without asking GPT-5.6 to decide the outcome.

### Claim failure

If the campaign is inactive, expired, depleted, or otherwise ineligible, claim creation must fail deterministically with a clear reason and no redemption code.

### Redemption failure

Invalid, expired, or previously used codes must be rejected deterministically. GPT-5.6 must not override or reinterpret the result.

### Analytics or insight failure

Metrics must remain available when GPT-5.6 insight generation fails. The interface should show deterministic metrics, omit the AI insight, and offer a retry without inventing a fallback narrative.

## Explicit exclusions

The architecture does not include payments, production authentication, real merchant onboarding, background location, real fraud detection, full PINTAG social or community features, or integration with the contractual PINTAG MVP.
