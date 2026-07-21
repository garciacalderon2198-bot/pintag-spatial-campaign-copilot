import { APPROVED_DROP_ZONES } from "./demo-data.ts";
import { recommendActivation } from "./golden-drop-rules.ts";
import type {
  CampaignGenerationInput,
  CampaignGenerationResponse,
  InsightInput,
  InsightResponse,
  ProviderFailureReason,
} from "./ai-types.ts";

function fallbackNotice(reason: ProviderFailureReason): string {
  if (reason === "not-configured")
    return "Azure OpenAI is not configured. The deterministic demo campaign is being used.";
  if (reason === "timeout")
    return "Azure OpenAI timed out. The deterministic demo campaign is being used.";
  if (reason === "invalid-output")
    return "Azure OpenAI returned an invalid structured response. The deterministic demo campaign is being used.";
  return "Azure OpenAI is unavailable. The deterministic demo campaign is being used.";
}

export function createFallbackCampaign(
  input: CampaignGenerationInput,
  reason: ProviderFailureReason,
): CampaignGenerationResponse {
  const recommendation = recommendActivation(
    input.merchantNeed,
    input.activationPreference,
  );
  if (recommendation.activationType === "golden-pintag-drop") {
    return {
      activationType: "golden-pintag-drop",
      activationReason: recommendation.activationReason,
      sponsorName: "Homers Café",
      sponsorVenue: "Homers Café — South Machala",
      recommendedDropZoneIds: APPROVED_DROP_ZONES.map((zone) => zone.id),
      selectedDropZoneId: null,
      claimRedemptionWindowHours: 24,
      objective:
        "Introduce Homers Café to customers outside its immediate local radius through one transparent sponsored discovery reward.",
      title: "Homers Golden Cheesecake Hunt",
      description:
        "Find the Golden Pintag in the selected Drop Zone and claim a chocolate cheesecake sponsored by Homers Café.",
      reward: "One complimentary chocolate cheesecake",
      supply: 1,
      startTime: "10:00",
      endTime: "13:00",
      discoveryRadiusMeters: input.defaultRadiusMeters,
      primaryMetric: "Claim-to-redemption rate",
      missingInformation: [
        "Final activation date",
        "Exact Sponsor Venue address",
        "Merchant redemption conditions",
        "Drop Zone permission",
        "Safety and operational approval",
      ],
      ambiguityWarnings: recommendation.ambiguityWarning
        ? [recommendation.ambiguityWarning]
        : ["Drop Zone suitability uses simulated prototype assumptions."],
      safetyNotes: [
        "Use only approved public Drop Zones.",
        "Do not obstruct pedestrian movement or encourage unsafe behavior.",
        "Human approval, local permission, safety, and operational review are required.",
      ],
      sourceMode: "deterministic-fallback",
      notice: fallbackNotice(reason),
    };
  }
  return {
    activationType: "real-time-offer",
    activationReason: recommendation.activationReason,
    sponsorName: "Homers Café",
    sponsorVenue: input.venue,
    recommendedDropZoneIds: [],
    selectedDropZoneId: null,
    claimRedemptionWindowHours: 2,
    objective:
      "Invite nearby customers during the merchant's low-traffic afternoon window using factual availability and clear terms.",
    title: "Afternoon Dessert Invitation",
    description: `${input.defaultSupply} chocolate cheesecakes are available for nearby customers between ${input.defaultStartTime} and ${input.defaultEndTime}, while supplies last.`,
    reward:
      "One complimentary chocolate cheesecake with an eligible in-store purchase",
    supply: input.defaultSupply,
    startTime: input.defaultStartTime,
    endTime: input.defaultEndTime,
    discoveryRadiusMeters: input.defaultRadiusMeters,
    primaryMetric: "Redemption rate",
    missingInformation: [],
    ambiguityWarnings: recommendation.ambiguityWarning
      ? [recommendation.ambiguityWarning]
      : [
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
  const goldenObservation =
    input.activationType === "golden-pintag-drop"
      ? ` The simulated Golden search recorded ${input.searchesStarted} start${input.searchesStarted === 1 ? "" : "s"} and ${input.goldenPintagsFound} find${input.goldenPintagsFound === 1 ? "" : "s"}.`
      : "";
  const simulationNotice = input.includesSimulatedData
    ? " These values include simulated prototype data."
    : "";
  return {
    summary: `This prototype session recorded ${input.claims} claim${input.claims === 1 ? "" : "s"} and ${input.redemptions} redemption${input.redemptions === 1 ? "" : "s"}.`,
    observation: `The observed claim-to-redemption rate is ${input.claimToRedemptionRate}%, with ${input.remainingSupply} rewards remaining.${goldenObservation}${simulationNotice}`,
    recommendation:
      input.claims === 0
        ? "Complete a claim and redemption in the demo before interpreting the funnel."
        : "Review the observed prototype funnel for friction before any real-world pilot, permission, or safety review.",
    limitation:
      "Location and Golden search are simulated; no physical movement is verified, and this session does not establish any causal sales effect or CAC result.",
    sourceMode: "deterministic-fallback",
    notice: fallbackNotice(reason).replace("campaign", "insight"),
  };
}
