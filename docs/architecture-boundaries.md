# Architecture Boundaries

## Boundary objective

The prototype must separate probabilistic GPT-5.6 assistance from deterministic campaign, claim, redemption, and measurement state. Human approval is the boundary between an AI-generated proposal and publication. This architecture applies only to the independent Build Week prototype and does not define or modify the contractual PINTAG MVP.

Azure OpenAI through Microsoft Foundry is the active optional provider target. The server-side model identifier is `gpt-5.6-sol`, and the intended Azure deployment is `pintag-gpt-5-6-sol`. Azure quota remains externally controlled, and a successful live call has not yet been verified.

## GPT-5.6 responsibilities

GPT-5.6 is responsible for:

- Interpreting the merchant's natural-language need.
- Generating a structured campaign proposal.
- Identifying missing information and ambiguous terms.
- Recommending a primary measurement metric.
- Generating a short campaign-performance insight grounded in supplied metrics.

GPT-5.6 output is advisory. It must be validated against the expected structure and presented for human review before it can affect publishable campaign content.

Credentials, endpoint configuration, deployment metadata, prompts, and provider errors remain server-side. No Azure credential is stored in Git or returned to the browser.

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
- **Presence integrity:** GPT-5.6 cannot determine physical presence as a source of truth. Prototype location and distance are simulated.
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

If Azure OpenAI is unconfigured, unavailable, quota-limited, missing its deployment, times out, returns invalid structured output, or omits required information, the system must use the labeled deterministic campaign fallback. The fallback preserves the complete demo but does not imply that GPT-5.6 generated it. Human approval remains required.

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

Metrics must remain available when GPT-5.6 insight generation fails. The interface shows deterministic metrics and may show a labeled deterministic insight derived only from those metrics. It must not fabricate historical activity or causal sales impact.

## Provider boundary

- Azure OpenAI uses server-side Next.js route handlers and the official `openai` SDK against the Azure OpenAI v1 endpoint.
- `AZURE_OPENAI_API_KEY` is read only in the server-only provider module.
- The browser receives validated campaign or insight fields, `sourceMode`, and a safe notice; it never receives credentials, raw errors, endpoints, subscription identifiers, or deployment metadata.
- Publication, reward inventory, claims, redemption codes, redemption validation, funnel events, and campaign metrics remain deterministic.
- The deterministic fallback is the verified default while Azure quota approval and live deployment verification remain pending.

## Explicit exclusions

The architecture does not include payments, production authentication, real merchant onboarding, background location, real fraud detection, full PINTAG social or community features, or integration with the contractual PINTAG MVP.

## Golden Drop two-location boundary

Both activation modes reuse deterministic publication, timing, inventory, claim, redemption code, single-use redemption, events, and metrics. Golden mode distinguishes:

- **Drop Zone:** a human-selected entry from the fixed simulated approved catalog, used for public discovery and simulated search.
- **Sponsor Venue:** the distinct simulated merchant location where deterministic redemption occurs.

The provider may recommend or rank catalog IDs but cannot invent coordinates, select a Drop Zone on behalf of the human, declare safety or permission, verify traffic or physical presence, or enable geofencing. The browser requests neither geolocation nor camera permission. The 2D map, travel, proximity, and WebAR treatment are in-memory UI simulations, and their events are labeled as prototype session events.

Golden claims additionally require publication, an available Drop, simulated proximity unlock, a found-state transition, remaining supply, and no prior session claim. The existing deterministic redemption engine remains authoritative. Insight inputs may include activation type, Drop Zone, Sponsor Venue, searches started, and Golden Pintags found, but every insight must disclaim verified movement, causal sales effect, and CAC results.
