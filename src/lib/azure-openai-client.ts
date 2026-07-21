import "server-only";

import OpenAI from "openai";

import type { AIProvider } from "./ai-service.ts";
import type {
  CampaignGenerationInput,
  InsightInput,
  ProviderFailureReason,
  ProviderResult,
} from "./ai-types.ts";

export const DEFAULT_AZURE_OPENAI_MODEL = "gpt-5.6-sol";
export const DEFAULT_AZURE_OPENAI_DEPLOYMENT = "pintag-gpt-5-6-sol";
export const DEFAULT_AZURE_OPENAI_TIMEOUT_MS = 15_000;

const campaignSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "activationType",
    "activationReason",
    "sponsorName",
    "sponsorVenue",
    "recommendedDropZoneIds",
    "selectedDropZoneId",
    "claimRedemptionWindowHours",
    "objective",
    "title",
    "description",
    "reward",
    "supply",
    "startTime",
    "endTime",
    "discoveryRadiusMeters",
    "primaryMetric",
    "missingInformation",
    "ambiguityWarnings",
    "safetyNotes",
  ],
  properties: {
    activationType: {
      type: "string",
      enum: ["real-time-offer", "golden-pintag-drop"],
    },
    activationReason: { type: "string" },
    sponsorName: { type: "string" },
    sponsorVenue: { type: "string" },
    recommendedDropZoneIds: {
      type: "array",
      items: {
        type: "string",
        enum: ["paseo-shopping-machala", "parque-juan-montalvo", "plaza-colon"],
      },
    },
    selectedDropZoneId: {
      anyOf: [
        {
          type: "string",
          enum: [
            "paseo-shopping-machala",
            "parque-juan-montalvo",
            "plaza-colon",
          ],
        },
        { type: "null" },
      ],
    },
    claimRedemptionWindowHours: { type: "integer", minimum: 1, maximum: 168 },
    objective: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    reward: { type: "string" },
    supply: { type: "integer", minimum: 1, maximum: 1000 },
    startTime: { type: "string", pattern: "^(?:[01]\\d|2[0-3]):[0-5]\\d$" },
    endTime: { type: "string", pattern: "^(?:[01]\\d|2[0-3]):[0-5]\\d$" },
    discoveryRadiusMeters: { type: "integer", minimum: 1, maximum: 5000 },
    primaryMetric: { type: "string" },
    missingInformation: { type: "array", items: { type: "string" } },
    ambiguityWarnings: { type: "array", items: { type: "string" } },
    safetyNotes: { type: "array", items: { type: "string" } },
  },
} as const;

const insightSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "observation", "recommendation", "limitation"],
  properties: {
    summary: { type: "string" },
    observation: { type: "string" },
    recommendation: { type: "string" },
    limitation: { type: "string" },
  },
} as const;

type AzureConfiguration = {
  client: OpenAI;
  deployment: string;
  model: string;
};

function classifyProviderError(error: unknown): ProviderFailureReason {
  if (
    error instanceof OpenAI.APIConnectionTimeoutError ||
    (error instanceof Error && /timeout|timed out|aborted/i.test(error.message))
  ) {
    return "timeout";
  }
  return "provider-unavailable";
}

function parseTimeout(value: string | undefined): number {
  if (!value) return DEFAULT_AZURE_OPENAI_TIMEOUT_MS;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1_000 && parsed <= 60_000
    ? parsed
    : DEFAULT_AZURE_OPENAI_TIMEOUT_MS;
}

function createConfiguration(): AzureConfiguration | null {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim();
  const apiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  if (!endpoint || !apiKey) return null;

  let parsedEndpoint: URL;
  try {
    parsedEndpoint = new URL(endpoint);
  } catch {
    return null;
  }
  if (parsedEndpoint.protocol !== "https:") return null;

  const normalizedEndpoint = endpoint.replace(/\/+$/, "");
  const baseURL = normalizedEndpoint.endsWith("/openai/v1")
    ? `${normalizedEndpoint}/`
    : `${normalizedEndpoint}/openai/v1/`;
  const timeout = parseTimeout(process.env.AZURE_OPENAI_TIMEOUT_MS);

  return {
    client: new OpenAI({ apiKey, baseURL, timeout, maxRetries: 0 }),
    deployment:
      process.env.AZURE_OPENAI_DEPLOYMENT?.trim() ||
      DEFAULT_AZURE_OPENAI_DEPLOYMENT,
    model: process.env.AZURE_OPENAI_MODEL?.trim() || DEFAULT_AZURE_OPENAI_MODEL,
  };
}

async function parseResponse(
  operation: () => Promise<{ output_text: string }>,
): Promise<ProviderResult> {
  try {
    const response = await operation();
    if (!response.output_text) return { ok: false, reason: "invalid-output" };
    try {
      return { ok: true, data: JSON.parse(response.output_text) };
    } catch {
      return { ok: false, reason: "invalid-output" };
    }
  } catch (error) {
    return { ok: false, reason: classifyProviderError(error) };
  }
}

export function createAzureOpenAIProvider(): AIProvider | null {
  let configuration: AzureConfiguration | null;
  try {
    configuration = createConfiguration();
  } catch {
    return null;
  }
  if (!configuration) return null;

  return {
    generateCampaign(input: CampaignGenerationInput) {
      return parseResponse(() =>
        configuration.client.responses.create({
          model: configuration.deployment,
          instructions: `You are producing an advisory spatial activation structure for human review using ${configuration.model}. Recommend either real-time-offer or golden-pintag-drop unless the merchant explicitly chose one. Golden recommendations may rank only these approved simulated Drop Zone IDs: paseo-shopping-machala, parque-juan-montalvo, plaza-colon. Never invent coordinates or declare real safety, traffic, permission, or legal authorization. You may suggest transparent copy, identify missing information or ambiguity, recommend one primary metric, reward, and duration, and warn against misleading urgency or unsafe behavior. You must not publish, bypass approval, verify physical presence, enable geofencing, control inventory, create or validate claims or redemption codes, fabricate analytics, claim sales impact or CAC reduction, or override human approval. Return only the required structured output.`,
          input: JSON.stringify(input),
          reasoning: { effort: "low" },
          max_output_tokens: 1_500,
          store: false,
          text: {
            verbosity: "low",
            format: {
              type: "json_schema",
              name: "pintag_campaign_proposal",
              strict: true,
              schema: campaignSchema,
            },
          },
        }),
      );
    },
    generateInsight(input: InsightInput) {
      return parseResponse(() =>
        configuration.client.responses.create({
          model: configuration.deployment,
          instructions: `Generate a short campaign-performance insight using ${configuration.model}. Use only the supplied aggregate metrics. State that location and Golden search are simulated when applicable, no physical movement is verified, and no causal sales effect or CAC result is established. Do not fabricate activity, imply incremental revenue, or make publication, inventory, claim, or redemption decisions. Return only the required structured output.`,
          input: JSON.stringify(input),
          reasoning: { effort: "low" },
          max_output_tokens: 900,
          store: false,
          text: {
            verbosity: "low",
            format: {
              type: "json_schema",
              name: "pintag_campaign_insight",
              strict: true,
              schema: insightSchema,
            },
          },
        }),
      );
    },
  };
}
