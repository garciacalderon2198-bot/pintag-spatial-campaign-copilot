export type AISourceMode = "azure-gpt-5.6" | "deterministic-fallback";

export type CampaignGenerationInput = {
  merchantNeed: string;
  venue: string;
  defaultSupply: number;
  defaultStartTime: string;
  defaultEndTime: string;
  defaultRadiusMeters: number;
};

export type CampaignGenerationCore = {
  objective: string;
  title: string;
  description: string;
  reward: string;
  supply: number;
  startTime: string;
  endTime: string;
  discoveryRadiusMeters: number;
  primaryMetric: string;
  missingInformation: string[];
  ambiguityWarnings: string[];
  safetyNotes: string[];
};

export type CampaignGenerationResponse = CampaignGenerationCore & {
  sourceMode: AISourceMode;
  notice: string;
};

export type InsightInput = {
  publications: number;
  detailViews: number;
  claims: number;
  redemptions: number;
  remainingSupply: number;
  claimToRedemptionRate: number;
  includesSimulatedData: boolean;
};

export type InsightCore = {
  summary: string;
  observation: string;
  recommendation: string;
  limitation: string;
};

export type InsightResponse = InsightCore & {
  sourceMode: AISourceMode;
  notice: string;
};

export type ProviderFailureReason =
  | "not-configured"
  | "timeout"
  | "provider-unavailable"
  | "invalid-output";

export type ProviderResult =
  | { ok: true; data: unknown }
  | { ok: false; reason: ProviderFailureReason };

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export const MAX_CAMPAIGN_BODY_BYTES = 12_000;
export const MAX_INSIGHT_BODY_BYTES = 8_000;

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoundedString(
  value: unknown,
  minimum: number,
  maximum: number,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= minimum &&
    value.length <= maximum
  );
}

function isBoundedInteger(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return Number.isInteger(value) && Number(value) >= minimum && Number(value) <= maximum;
}

function isStringArray(value: unknown, maximumItems = 10): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maximumItems &&
    value.every((item) => isBoundedString(item, 1, 400))
  );
}

export function validateCampaignInput(
  value: unknown,
): ValidationResult<CampaignGenerationInput> {
  if (!isRecord(value)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  if (!isBoundedString(value.merchantNeed, 1, 2_000)) {
    return { ok: false, error: "merchantNeed is required and must be 2,000 characters or fewer." };
  }
  if (!isBoundedString(value.venue, 1, 200)) {
    return { ok: false, error: "venue is required and must be 200 characters or fewer." };
  }
  if (!isBoundedInteger(value.defaultSupply, 1, 1_000)) {
    return { ok: false, error: "defaultSupply must be an integer from 1 to 1,000." };
  }
  if (
    typeof value.defaultStartTime !== "string" ||
    typeof value.defaultEndTime !== "string" ||
    !TIME_PATTERN.test(value.defaultStartTime) ||
    !TIME_PATTERN.test(value.defaultEndTime) ||
    value.defaultStartTime >= value.defaultEndTime
  ) {
    return { ok: false, error: "Start and end times must be valid HH:mm values with the end after the start." };
  }
  if (!isBoundedInteger(value.defaultRadiusMeters, 1, 5_000)) {
    return { ok: false, error: "defaultRadiusMeters must be an integer from 1 to 5,000." };
  }

  return {
    ok: true,
    value: {
      merchantNeed: value.merchantNeed.trim(),
      venue: value.venue.trim(),
      defaultSupply: value.defaultSupply,
      defaultStartTime: value.defaultStartTime,
      defaultEndTime: value.defaultEndTime,
      defaultRadiusMeters: value.defaultRadiusMeters,
    },
  };
}

export function validateInsightInput(value: unknown): ValidationResult<InsightInput> {
  if (!isRecord(value)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const countFields = [
    "publications",
    "detailViews",
    "claims",
    "redemptions",
    "remainingSupply",
  ] as const;

  for (const field of countFields) {
    if (!isBoundedInteger(value[field], 0, 100_000)) {
      return { ok: false, error: `${field} must be an integer from 0 to 100,000.` };
    }
  }

  if (
    typeof value.claimToRedemptionRate !== "number" ||
    !Number.isFinite(value.claimToRedemptionRate) ||
    value.claimToRedemptionRate < 0 ||
    value.claimToRedemptionRate > 100
  ) {
    return { ok: false, error: "claimToRedemptionRate must be from 0 to 100." };
  }
  if (typeof value.includesSimulatedData !== "boolean") {
    return { ok: false, error: "includesSimulatedData must be a boolean." };
  }

  const publications = Number(value.publications);
  const detailViews = Number(value.detailViews);
  const claims = Number(value.claims);
  const redemptions = Number(value.redemptions);
  const remainingSupply = Number(value.remainingSupply);
  const expectedRate = claims === 0 ? 0 : Math.round((redemptions / claims) * 100);

  if (redemptions > claims || claims > detailViews || (claims > 0 && publications === 0)) {
    return { ok: false, error: "Aggregate metrics contain an impossible funnel sequence." };
  }
  if (Math.abs(value.claimToRedemptionRate - expectedRate) > 0.01) {
    return { ok: false, error: "claimToRedemptionRate does not match the supplied counts." };
  }

  return {
    ok: true,
    value: {
      publications,
      detailViews,
      claims,
      redemptions,
      remainingSupply,
      claimToRedemptionRate: value.claimToRedemptionRate,
      includesSimulatedData: value.includesSimulatedData,
    },
  };
}

export function validateCampaignCore(value: unknown): CampaignGenerationCore | null {
  if (!isRecord(value)) return null;
  if (
    !isBoundedString(value.objective, 1, 500) ||
    !isBoundedString(value.title, 1, 120) ||
    !isBoundedString(value.description, 1, 600) ||
    !isBoundedString(value.reward, 1, 300) ||
    !isBoundedInteger(value.supply, 1, 1_000) ||
    typeof value.startTime !== "string" ||
    typeof value.endTime !== "string" ||
    !TIME_PATTERN.test(value.startTime) ||
    !TIME_PATTERN.test(value.endTime) ||
    value.startTime >= value.endTime ||
    !isBoundedInteger(value.discoveryRadiusMeters, 1, 5_000) ||
    !isBoundedString(value.primaryMetric, 1, 120) ||
    !isStringArray(value.missingInformation) ||
    !isStringArray(value.ambiguityWarnings) ||
    !isStringArray(value.safetyNotes)
  ) {
    return null;
  }

  return {
    objective: value.objective.trim(),
    title: value.title.trim(),
    description: value.description.trim(),
    reward: value.reward.trim(),
    supply: value.supply,
    startTime: value.startTime,
    endTime: value.endTime,
    discoveryRadiusMeters: value.discoveryRadiusMeters,
    primaryMetric: value.primaryMetric.trim(),
    missingInformation: value.missingInformation.map((item) => item.trim()),
    ambiguityWarnings: value.ambiguityWarnings.map((item) => item.trim()),
    safetyNotes: value.safetyNotes.map((item) => item.trim()),
  };
}

export function validateInsightCore(value: unknown): InsightCore | null {
  if (!isRecord(value)) return null;
  if (
    !isBoundedString(value.summary, 1, 600) ||
    !isBoundedString(value.observation, 1, 600) ||
    !isBoundedString(value.recommendation, 1, 600) ||
    !isBoundedString(value.limitation, 1, 600)
  ) {
    return null;
  }

  return {
    summary: value.summary.trim(),
    observation: value.observation.trim(),
    recommendation: value.recommendation.trim(),
    limitation: value.limitation.trim(),
  };
}
