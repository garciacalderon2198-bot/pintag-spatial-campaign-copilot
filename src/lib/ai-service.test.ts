import assert from "node:assert/strict";
import test from "node:test";

import {
  generateCampaignWithFallback,
  generateInsightWithFallback,
  type AIProvider,
} from "./ai-service.ts";
import type {
  CampaignGenerationInput,
  InsightInput,
} from "./ai-types.ts";
import {
  validateCampaignInput,
  validateInsightInput,
} from "./ai-types.ts";
import { createAzureOpenAIProvider } from "./azure-openai-client.ts";

const campaignInput: CampaignGenerationInput = {
  merchantNeed:
    "We have eight fresh desserts available and low foot traffic between 3:00 PM and 5:00 PM.",
  venue: "Casa Dulce Demo Café",
  defaultSupply: 8,
  defaultStartTime: "15:00",
  defaultEndTime: "17:00",
  defaultRadiusMeters: 500,
};

const insightInput: InsightInput = {
  publications: 1,
  detailViews: 1,
  claims: 1,
  redemptions: 1,
  remainingSupply: 7,
  claimToRedemptionRate: 100,
  includesSimulatedData: true,
};

function withoutAzureEnvironment<T>(operation: () => T): T {
  const names = [
    "AZURE_OPENAI_ENDPOINT",
    "AZURE_OPENAI_API_KEY",
    "AZURE_OPENAI_DEPLOYMENT",
    "AZURE_OPENAI_MODEL",
    "AZURE_OPENAI_TIMEOUT_MS",
  ] as const;
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  for (const name of names) delete process.env[name];
  try {
    return operation();
  } finally {
    for (const name of names) {
      const value = previous[name];
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}

test("campaign falls back when Azure variables are absent", async () => {
  const provider = withoutAzureEnvironment(() => createAzureOpenAIProvider());
  const result = await generateCampaignWithFallback(campaignInput, provider);

  assert.equal(provider, null);
  assert.equal(result.sourceMode, "deterministic-fallback");
  assert.match(result.notice, /not configured/i);
  assert.equal(result.supply, 8);
});

test("insight falls back when Azure variables are absent", async () => {
  const provider = withoutAzureEnvironment(() => createAzureOpenAIProvider());
  const result = await generateInsightWithFallback(insightInput, provider);

  assert.equal(result.sourceMode, "deterministic-fallback");
  assert.match(result.limitation, /does not establish/i);
  assert.match(result.observation, /simulated/i);
});

test("provider failures are never labeled as live GPT-5.6 or exposed", async () => {
  const secretError = "RAW_AZURE_ERROR_WITH_SECRET_SENTINEL";
  const provider: AIProvider = {
    async generateCampaign() {
      throw new Error(secretError);
    },
    async generateInsight() {
      throw new Error(secretError);
    },
  };

  const campaign = await generateCampaignWithFallback(campaignInput, provider);
  const insight = await generateInsightWithFallback(insightInput, provider);
  const browserPayload = JSON.stringify({ campaign, insight });

  assert.equal(campaign.sourceMode, "deterministic-fallback");
  assert.equal(insight.sourceMode, "deterministic-fallback");
  assert.doesNotMatch(browserPayload, /RAW_AZURE_ERROR|AZURE_OPENAI_API_KEY/i);
});

test("timeout produces deterministic fallback", async () => {
  const provider: AIProvider = {
    async generateCampaign() {
      return { ok: false, reason: "timeout" };
    },
    async generateInsight() {
      return { ok: false, reason: "timeout" };
    },
  };

  const campaign = await generateCampaignWithFallback(campaignInput, provider);
  const insight = await generateInsightWithFallback(insightInput, provider);

  assert.equal(campaign.sourceMode, "deterministic-fallback");
  assert.equal(insight.sourceMode, "deterministic-fallback");
  assert.match(campaign.notice, /timed out/i);
});

test("invalid model output produces deterministic fallback", async () => {
  const provider: AIProvider = {
    async generateCampaign() {
      return { ok: true, data: { title: "Incomplete" } };
    },
    async generateInsight() {
      return { ok: true, data: { summary: "Incomplete" } };
    },
  };

  const campaign = await generateCampaignWithFallback(campaignInput, provider);
  const insight = await generateInsightWithFallback(insightInput, provider);

  assert.equal(campaign.sourceMode, "deterministic-fallback");
  assert.equal(insight.sourceMode, "deterministic-fallback");
  assert.match(campaign.notice, /invalid structured response/i);
});

test("invalid campaign and insight input is rejected", () => {
  const campaign = validateCampaignInput({
    ...campaignInput,
    merchantNeed: "   ",
    defaultSupply: -1,
  });
  const insight = validateInsightInput({
    ...insightInput,
    claims: 0,
    redemptions: 1,
  });

  assert.equal(campaign.ok, false);
  assert.equal(insight.ok, false);
});
