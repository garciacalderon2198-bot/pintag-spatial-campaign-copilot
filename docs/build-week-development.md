# Build Week Development Record

## Project scope

Build an independent web prototype that demonstrates the flow:
merchant need → AI-generated campaign → spatial publication → user claim → merchant redemption → campaign insight.

## Pre-existing PINTAG foundation

Public evaluation links and evidence:

- Public repository: https://github.com/garciacalderon2198-bot/pintag-spatial-campaign-copilot
- Live deployment: https://pintag-spatial-campaign-copilot.vercel.app/
- Codex Session ID: `019f8151-561f-7881-bdd2-a09f68112a1e`

Before Build Week, PINTAG already had:
- its Spatial Internet category thesis;
- the Pintag object model;
- the concept of place-bound and time-bound digital activations;
- a broader MVP and product vision developed separately from this repository.

These concepts are not being presented as work created during Build Week.

## Built during OpenAI Build Week

The repository now contains a responsive Next.js prototype with a deterministic end-to-end campaign flow, typed in-memory state, human approval, simulated spatial discovery, single-use claim and redemption rules, prototype session events, and aggregate analytics.

The Golden Pintag Drop extension adds a second activation mode on the same engine: deterministic activation recommendation, a fixed approved Drop Zone catalog, mandatory human Drop Zone selection, a distinct Sponsor Venue, simulated map/travel/proximity/WebAR states, positive post-claim messaging, and Golden funnel events. All location, movement, search, identity, safety, and permission behavior remains explicitly simulated or pending real-world review.

An optional server-side Azure OpenAI integration layer targets `gpt-5.6-sol` through the intended Microsoft Foundry deployment `pintag-gpt-5-6-sol`. The integration validates structured campaign and insight responses and falls back deterministically when Azure is not configured or available.

## Codex contribution log

Under human review and direction, Codex helped initialize and structure the repository; write the documentation baseline, specifications, and architecture boundaries; build the Next.js interface; implement deterministic campaign, claim, redemption, event, and analytics rules; create and run tests; implement the server-side Azure OpenAI boundary, structured validation, and fallback behavior; perform security and secret scans; maintain Git commits; and prepare GitHub publication and Vercel deployment. Product and engineering decisions remained human-owned.

## GPT-5.6 usage log

Azure OpenAI through Microsoft Foundry is the active provider target for GPT-5.6 Sol. Azure quota was requested and remains externally controlled. A successful live GPT-5.6 call has not yet been verified, and no live model output is presented as evidence.

The public deployment currently uses the clearly labeled deterministic fallback for campaign generation and performance insight. The fallback also applies when Azure credentials, quota, deployment, network availability, timeout budget, or structured output validation prevent a live response.

## Human product and engineering decisions

- Selected Work & Productivity as the submission track.
- Limited the prototype to a merchant spatial campaign workflow.
- Kept the hackathon repository separate from the contractual PINTAG MVP.
- Selected Azure OpenAI through Microsoft Foundry as the primary GPT-5.6 provider target to use available Microsoft for Startups credits.
- Preserved deterministic publication, supply, claim, redemption, event, and metric rules outside the model boundary.

## Testing evidence

Automated tests cover pre-publication claim rejection, single decrement of reward supply, single-use redemption, invalid redemption rejection, activation recommendation and override, approved Drop Zone controls, Golden search transitions, missing-Azure fallback, timeout fallback, invalid-model-output fallback, source labeling, secret non-disclosure, raw-error suppression, and invalid AI-route input.

Final validation results:

- `npm run lint` passes.
- All 26 automated tests pass.
- `npm run build` passes.
- The complete public deterministic fallback flow has been verified.
- No `.env.local`, credentials, real Azure endpoints, subscription IDs, resource IDs, or secrets are stored in Git.

## Submission checklist

- [x] Working project
- [x] Optional GPT-5.6 provider layer with deterministic fallback
- [x] Codex contribution evidence
- [x] Public demo or testable deployment
- [x] Repository access configured
- [x] README setup instructions
- [x] Sample data
- [ ] Demo video under three minutes
- [x] Codex `/feedback` session ID
- [ ] Devpost submission completed
