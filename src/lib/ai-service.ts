import {
  createFallbackCampaign,
  createFallbackInsight,
} from "./ai-fallback.ts";
import type {
  CampaignGenerationInput,
  CampaignGenerationResponse,
  InsightInput,
  InsightResponse,
  ProviderFailureReason,
  ProviderResult,
} from "./ai-types.ts";
import { validateCampaignCore, validateInsightCore } from "./ai-types.ts";

export type AIProvider = {
  generateCampaign: (input: CampaignGenerationInput) => Promise<ProviderResult>;
  generateInsight: (input: InsightInput) => Promise<ProviderResult>;
};

async function safelyCall(
  operation: (() => Promise<ProviderResult>) | undefined,
): Promise<ProviderResult> {
  if (!operation) return { ok: false, reason: "not-configured" };
  try {
    return await operation();
  } catch {
    return { ok: false, reason: "provider-unavailable" };
  }
}

export async function generateCampaignWithFallback(
  input: CampaignGenerationInput,
  provider: AIProvider | null,
): Promise<CampaignGenerationResponse> {
  const result = await safelyCall(
    provider ? () => provider.generateCampaign(input) : undefined,
  );
  if (!result.ok) return createFallbackCampaign(input, result.reason);

  const validated = validateCampaignCore(result.data);
  if (!validated) return createFallbackCampaign(input, "invalid-output");

  return {
    ...validated,
    sourceMode: "azure-gpt-5.6",
    notice: "Live structured response received through Azure OpenAI. Human approval remains required.",
  };
}

export async function generateInsightWithFallback(
  input: InsightInput,
  provider: AIProvider | null,
): Promise<InsightResponse> {
  const result = await safelyCall(
    provider ? () => provider.generateInsight(input) : undefined,
  );
  if (!result.ok) return createFallbackInsight(input, result.reason);

  const validated = validateInsightCore(result.data);
  if (!validated) return createFallbackInsight(input, "invalid-output");

  return {
    ...validated,
    sourceMode: "azure-gpt-5.6",
    notice: "Live campaign insight received through Azure OpenAI and grounded in supplied aggregate metrics.",
  };
}

export function providerFailure(reason: ProviderFailureReason): ProviderResult {
  return { ok: false, reason };
}
