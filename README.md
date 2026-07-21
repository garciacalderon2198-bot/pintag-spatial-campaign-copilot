# PINTAG Spatial Campaign Copilot

Turn a local merchant's natural-language operational need into a reviewed, place-bound, time-bound, and measurable campaign.

OpenAI Build Week 2026 independent prototype · Work & Productivity

## Problem

Local businesses often have temporary inventory, unused capacity, or time-sensitive opportunities, but existing digital channels do not reliably reach people who are nearby and ready to act.

## Solution

PINTAG Spatial Campaign Copilot is designed to use GPT-5.6 to structure a merchant need as a spatial campaign, keep publication under human control, and support discovery, claim, redemption, and campaign insight in one demonstrable workflow.

PINTAG helps local businesses turn nearby attention into measurable store visits through real-time spatial offers and gamified sponsored rewards. The AI Copilot is the merchant recommendation and structuring tool; the product is the shared spatial campaign and action infrastructure.

## Activation modes

- **Real-time Offer:** discovery and redemption occur at the Sponsor Venue, supporting temporary inventory, unused capacity, and short operating windows.
- **Golden Pintag Drop:** discovery and simulated search occur at a human-selected approved public Drop Zone, while deterministic redemption occurs later at the distinct Sponsor Venue.

Both modes reuse human approval, publication, time windows, inventory, claim, single-use redemption, prototype events, and analytics. Golden mode adds a simulated 2D map, simulated arrival and proximity, a CSS-only simulated WebAR search, and a positive public post-claim state. No real geolocation, camera access, presence verification, safety verification, permission claim, sales effect, or CAC result is provided.

## Why Work & Productivity

The prototype helps merchants turn an operational need into an actionable local campaign, reduces campaign setup effort, and keeps staff-facing publication and redemption steps clear and measurable.

## End-to-end flow

Merchant need → campaign proposal → human review → publication → consumer discovery → claim → redemption → campaign insight

## What GPT-5.6 does

When the Azure provider is available, GPT-5.6 may interpret the merchant need, recommend one of the two activation modes, rank only the approved Drop Zone catalog, propose structured campaign copy, identify missing or ambiguous information, recommend a primary metric, and generate an aggregate performance insight. It cannot invent coordinates, publish campaigns, determine physical presence, verify safety or permission, control inventory, validate redemption, fabricate activity, or claim causal sales impact or proven CAC reduction.

## What remains deterministic

Campaign status, publication, start and expiration times, reward supply, claim creation and expiration, redemption codes, single-use redemption, prototype session events, and campaign metrics remain application-controlled rules. Human approval is always required before publication.

## Azure OpenAI provider architecture

Next.js route handlers keep provider access server-side. Azure OpenAI through Microsoft Foundry is the active provider target, using model `gpt-5.6-sol` and intended deployment `pintag-gpt-5-6-sol`. Inputs and structured outputs are validated, credentials are read only on the server, and raw provider errors are not returned to the browser.

## Current provider status

Azure quota remains externally controlled. A successful live GPT-5.6 call has not yet been verified, and the public deployment currently uses the clearly labeled deterministic fallback. No live model output is presented as Build Week evidence.

## Deterministic fallback

If Azure configuration, quota, deployment, network access, timeout budget, or structured-output validation prevents a live response, the application returns the approved deterministic campaign or insight with `sourceMode: deterministic-fallback`. The complete demo remains usable and never represents fallback content as GPT-5.6 output.

## Try it

- Live demo: [pintag-spatial-campaign-copilot.vercel.app](https://pintag-spatial-campaign-copilot.vercel.app/)
- Public repository: [github.com/garciacalderon2198-bot/pintag-spatial-campaign-copilot](https://github.com/garciacalderon2198-bot/pintag-spatial-campaign-copilot)

## Local setup

Requirements: Node.js and npm.

```bash
git clone https://github.com/garciacalderon2198-bot/pintag-spatial-campaign-copilot.git
cd pintag-spatial-campaign-copilot
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment file is required for deterministic fallback mode.

For validation:

```bash
npm run lint
npm test
npm run build
```

## Optional environment variables

Create `.env.local` only for local Azure provider testing and never commit it. Use placeholders until real server-side values are available:

```dotenv
AZURE_OPENAI_ENDPOINT=https://YOUR-RESOURCE-NAME.openai.azure.com
AZURE_OPENAI_API_KEY=replace-with-a-local-secret
AZURE_OPENAI_DEPLOYMENT=pintag-gpt-5-6-sol
AZURE_OPENAI_MODEL=gpt-5.6-sol
AZURE_OPENAI_TIMEOUT_MS=15000
```

## Testing and validation

- `npm run lint` passes.
- All 26 automated tests pass.
- `npm run build` passes.
- The complete public deterministic fallback flow has been verified.
- Tests cover fallback source labeling, invalid input, provider failure and timeout, activation recommendation and override, approved Drop Zone controls, Golden search transitions, pre-publication claim rejection, single supply decrement, single-use redemption, and invalid-code rejection.

## Security and trust boundaries

- Provider credentials remain server-side and are excluded from Git and client bundles.
- Raw provider errors are suppressed.
- Human review controls publication.
- The model does not control inventory, claims, redemption, events, or metrics.
- The application does not use production authentication, a database, real geolocation, or an external map provider.

## Simulated prototype elements

Merchant and consumer identities, user, Drop Zone and Sponsor Venue locations, nearby distance, movement, proximity, WebAR search, initial campaign context, and the map environment are simulated and labeled in the interface. The approved Drop Zone catalog is a prototype constraint and does not establish current real-world safety, traffic, permission, availability, or legal authorization. Metrics represent only events generated during the current prototype session; no historical activity is fabricated.

## Build Week development history

The Git history and [development record](docs/build-week-development.md) document the specification baseline, application foundation, deterministic end-to-end flow, optional Azure provider layer, validation, licensing, and public release.

## How Codex was used

Under human review and direction, Codex helped initialize and structure the repository; write specifications and architecture boundaries; build the Next.js interface; implement deterministic campaign, claim, redemption, and analytics rules; create and run tests; implement the server-side Azure OpenAI layer; perform security and secret scans; maintain Git commits; and prepare GitHub publication and Vercel deployment. Product and engineering decisions remained human-owned.

## Codex `/feedback` Session ID

`019f8151-561f-7881-bdd2-a09f68112a1e`

## Existing PINTAG concepts versus Build Week additions

Pre-existing PINTAG concepts include place-bound and time-bound Pintags, spatial discovery, merchant campaigns, claim and redemption concepts, measurable local action, and the PINTAG visual identity. These are not presented as Build Week inventions.

Built or significantly extended during Build Week: this independent Next.js prototype, the campaign copilot workflow, structured AI provider layer, human review and publication flow, deterministic claim and redemption engine, prototype event analytics, AI insight route, Azure OpenAI fallback architecture, automated tests, public GitHub repository, Vercel deployment, and Build Week documentation.

This repository is separate from and does not modify, replace, or include the contractual PINTAG MVP.

## License and trademarks

The prototype source code is released under the [MIT License](LICENSE). PINTAG names, logos, visual identity, and trademarks are not granted by the software license. This independent Build Week prototype does not include the contractual PINTAG MVP.
