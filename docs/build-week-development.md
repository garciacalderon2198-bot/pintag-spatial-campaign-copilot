# Build Week Development Record

## Project scope

Build an independent web prototype that demonstrates the flow:
merchant need → AI-generated campaign → spatial publication → user claim → merchant redemption → campaign insight.

## Pre-existing PINTAG foundation

Before Build Week, PINTAG already had:
- its Spatial Internet category thesis;
- the Pintag object model;
- the concept of place-bound and time-bound digital activations;
- a broader MVP and product vision developed separately from this repository.

These concepts are not being presented as work created during Build Week.

## Built during OpenAI Build Week

The repository now contains a responsive Next.js prototype with a deterministic end-to-end campaign flow, typed in-memory state, human approval, simulated spatial discovery, single-use claim and redemption rules, prototype session events, and aggregate analytics.

An optional server-side Azure OpenAI integration layer targets `gpt-5.6-sol` through the intended Microsoft Foundry deployment `pintag-gpt-5-6-sol`. The integration validates structured campaign and insight responses and falls back deterministically when Azure is not configured or available.

## Codex contribution log

Codex created the documentation baseline, Next.js application foundation, deterministic campaign workflow, rule tests, Azure OpenAI integration boundary, structured validation, fallback behavior, and UI source disclosures in this repository.

## GPT-5.6 usage log

Azure OpenAI through Microsoft Foundry is the active provider target for GPT-5.6 Sol. Azure quota was requested and remains externally controlled. A successful live GPT-5.6 call has not yet been verified, and no live model output is presented as evidence.

The application uses deterministic fallback for campaign generation and performance insight when Azure credentials, quota, deployment, network availability, timeout budget, or structured output validation prevent a live response.

## Human product and engineering decisions

- Selected Work & Productivity as the submission track.
- Limited the prototype to a merchant spatial campaign workflow.
- Kept the hackathon repository separate from the contractual PINTAG MVP.
- Selected Azure OpenAI through Microsoft Foundry as the primary GPT-5.6 provider target to use available Microsoft for Startups credits.
- Preserved deterministic publication, supply, claim, redemption, event, and metric rules outside the model boundary.

## Testing evidence

Automated tests cover pre-publication claim rejection, single decrement of reward supply, single-use redemption, invalid redemption rejection, missing-Azure fallback, timeout fallback, invalid-model-output fallback, source labeling, secret non-disclosure, raw-error suppression, and invalid AI-route input.

## Submission checklist

- [ ] Working project
- [ ] GPT-5.6 integration
- [ ] Codex contribution evidence
- [ ] Public demo or testable deployment
- [ ] Repository access configured
- [ ] README setup instructions
- [ ] Sample data
- [ ] Demo video under three minutes
- [ ] Codex `/feedback` session ID
- [ ] Devpost submission completed
