import type {
  CampaignGenerationInput,
  CampaignGenerationResponse,
  InsightInput,
  InsightResponse,
  ProviderFailureReason,
} from "./ai-types.ts";

function fallbackNotice(reason: ProviderFailureReason): string {
  switch (reason) {
    case "not-configured":
      return "Azure OpenAI is not configured. The deterministic demo campaign is being used.";
    case "timeout":
      return "Azure OpenAI timed out. The deterministic demo campaign is being used.";
    case "invalid-output":
      return "Azure OpenAI returned an invalid structured response. The deterministic demo campaign is being used.";
    default:
      return "Azure OpenAI is unavailable. The deterministic demo campaign is being used.";
  }
}

export function createFallbackCampaign(
  input: CampaignGenerationInput,
  reason: ProviderFailureReason,
): CampaignGenerationResponse {
  return {
    objective: "Invite nearby customers during the merchant's low-traffic afternoon window using factual availability and clear terms.",
    title: "Afternoon Dessert Invitation",
    description: `${input.defaultSupply} fresh desserts are available for nearby customers between ${input.defaultStartTime} and ${input.defaultEndTime}, while supplies last.`,
    reward: "One complimentary mini dessert with an eligible in-store purchase",
    supply: input.defaultSupply,
    startTime: input.defaultStartTime,
    endTime: input.defaultEndTime,
    discoveryRadiusMeters: input.defaultRadiusMeters,
    primaryMetric: "Redemption rate",
    missingInformation: [],
    ambiguityWarnings: [
      "Nearby discovery uses a simulated radius and does not establish physical presence.",
    ],
    safetyNotes: [
      "Use only the factual time window and supplied quantity; do not manufacture urgency or scarcity.",
      "Human approval remains required before publication.",
    ],
    sourceMode: "deterministic-fallback",
    notice: fallbackNotice(reason),
  };
}

export function createFallbackInsight(
  input: InsightInput,
  reason: ProviderFailureReason,
): InsightResponse {
  const simulationNotice = input.includesSimulatedData
    ? " These values include simulated prototype data."
    : "";

  return {
    summary: `This prototype session recorded ${input.claims} claim${input.claims === 1 ? "" : "s"} and ${input.redemptions} redemption${input.redemptions === 1 ? "" : "s"}.`,
    observation: `The observed claim-to-redemption rate is ${input.claimToRedemptionRate}%, with ${input.remainingSupply} rewards remaining.${simulationNotice}`,
    recommendation:
      input.claims === 0
        ? "Complete a claim and redemption in the demo before interpreting the funnel."
        : "Review the observed claim and redemption steps for friction while preserving clear reward terms and human control.",
    limitation:
      "This session summary does not establish incremental revenue, causal sales impact, or historical campaign performance.",
    sourceMode: "deterministic-fallback",
    notice: fallbackNotice(reason).replace("campaign", "insight"),
  };
}
