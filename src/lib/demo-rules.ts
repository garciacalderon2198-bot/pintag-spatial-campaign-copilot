import { DEMO_REDEMPTION_CODE } from "./demo-data.ts";
import type {
  AnalyticsMetrics,
  DemoRuleState,
  FunnelEvent,
  RuleResult,
} from "./demo-types.ts";

export function attemptClaim(state: DemoRuleState): RuleResult {
  if (state.campaignStatus !== "published") {
    return {
      ok: false,
      state,
      message: "This Pintag must be published before a reward can be claimed.",
    };
  }

  if (state.remainingSupply <= 0) {
    return {
      ok: false,
      state,
      message: "No rewards remain for this demo campaign.",
    };
  }

  if (state.claim) {
    return {
      ok: false,
      state,
      message: "A reward has already been claimed in this demo session.",
    };
  }

  return {
    ok: true,
    state: {
      ...state,
      remainingSupply: state.remainingSupply - 1,
      claim: {
        id: "claim-demo-1",
        code: DEMO_REDEMPTION_CODE,
        status: "active",
      },
    },
    message: "Reward claimed. Your single-use redemption code is ready.",
  };
}

export function validateRedemption(
  state: DemoRuleState,
  submittedCode: string,
): RuleResult {
  const normalizedCode = submittedCode.trim().toUpperCase();

  if (!state.claim || normalizedCode !== state.claim.code) {
    return {
      ok: false,
      state: { ...state, redemptionStatus: "rejected" },
      message: "Invalid redemption code. No reward was redeemed.",
    };
  }

  if (state.claim.status === "redeemed") {
    return {
      ok: false,
      state: { ...state, redemptionStatus: "rejected" },
      message: "This redemption code has already been used.",
    };
  }

  return {
    ok: true,
    state: {
      ...state,
      claim: { ...state.claim, status: "redeemed" },
      redemptionStatus: "redeemed",
    },
    message: "Redemption validated. The code is now marked as used.",
  };
}

export function calculateAnalytics(
  events: FunnelEvent[],
  remainingSupply: number,
): AnalyticsMetrics {
  const count = (type: FunnelEvent["type"]) =>
    events.filter((event) => event.type === type).length;
  const claims = count("claim_created");
  const redemptions = count("redemption_validated");

  return {
    publications: count("campaign_published"),
    pintagViews: count("pintag_opened"),
    claims,
    redemptions,
    claimToRedemptionRate:
      claims === 0 ? 0 : Math.round((redemptions / claims) * 100),
    remainingSupply,
    goldenSearchesStarted: count("golden_search_started"),
    goldenPintagsFound: count("golden_pintag_found"),
  };
}
