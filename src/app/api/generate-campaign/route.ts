import "server-only";

import { NextResponse } from "next/server";

import { generateCampaignWithFallback } from "@/lib/ai-service";
import {
  MAX_CAMPAIGN_BODY_BYTES,
  validateCampaignInput,
} from "@/lib/ai-types";
import { createAzureOpenAIProvider } from "@/lib/azure-openai-client";

export const runtime = "nodejs";

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_CAMPAIGN_BODY_BYTES) {
    return jsonResponse({ error: "Request body is too large." }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ error: "Unable to read request body." }, 400);
  }
  if (new TextEncoder().encode(rawBody).length > MAX_CAMPAIGN_BODY_BYTES) {
    return jsonResponse({ error: "Request body is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Request body must contain valid JSON." }, 400);
  }

  const validated = validateCampaignInput(body);
  if (!validated.ok) return jsonResponse({ error: validated.error }, 400);

  const result = await generateCampaignWithFallback(
    validated.value,
    createAzureOpenAIProvider(),
  );
  return jsonResponse(result);
}
