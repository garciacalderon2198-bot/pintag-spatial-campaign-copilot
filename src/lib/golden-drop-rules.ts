import { APPROVED_DROP_ZONES, LATE_USER_MESSAGE } from "./demo-data.ts";
import { attemptClaim } from "./demo-rules.ts";
import type {
  ActivationPreference,
  ActivationType,
  DropZone,
  GoldenDemoState,
} from "./demo-types.ts";

const REAL_TIME_TERMS = [
  "inventory",
  "perishable",
  "low traffic",
  "unused capacity",
  "time window",
  "last-minute",
  "last minute",
  "before closing",
  "expiration",
  "available",
];
const GOLDEN_TERMS = [
  "launch",
  "opening",
  "awareness",
  "visibility",
  "introduce",
  "first-time",
  "another area",
  "sponsored reward",
  "exploration",
  "discovery",
  "memorable",
];

export type ActivationRecommendation = {
  activationType: ActivationType;
  activationReason: string;
  ambiguityWarning: string | null;
};

export function recommendActivation(
  merchantNeed: string,
  preference: ActivationPreference = "recommend",
): ActivationRecommendation {
  if (preference !== "recommend") {
    return {
      activationType: preference,
      activationReason:
        "The merchant explicitly selected this activation mode; human choice overrides the recommendation heuristic.",
      ambiguityWarning: null,
    };
  }
  const normalized = merchantNeed.toLowerCase();
  const realTimeScore = REAL_TIME_TERMS.filter((term) =>
    normalized.includes(term),
  ).length;
  const goldenScore = GOLDEN_TERMS.filter((term) =>
    normalized.includes(term),
  ).length;
  if (goldenScore > realTimeScore) {
    return {
      activationType: "golden-pintag-drop",
      activationReason:
        "The need emphasizes sponsored discovery, visibility, and reaching customers in another area.",
      ambiguityWarning: null,
    };
  }
  if (realTimeScore === goldenScore) {
    return {
      activationType: "real-time-offer",
      activationReason:
        "The deterministic heuristic defaulted to the simpler nearby offer for human review.",
      ambiguityWarning:
        "Activation intent is ambiguous. Review the recommended Real-time Offer before publication.",
    };
  }
  return {
    activationType: "real-time-offer",
    activationReason:
      "The need emphasizes available inventory, low traffic, or a short operating window.",
    ambiguityWarning: null,
  };
}

export function approvedDropZonesById(ids: string[]): DropZone[] {
  const allowed = new Set(ids);
  return APPROVED_DROP_ZONES.filter((zone) => allowed.has(zone.id));
}

export function canPublishGolden(selectedDropZone: DropZone | null): boolean {
  return Boolean(
    selectedDropZone?.approved &&
      APPROVED_DROP_ZONES.some((zone) => zone.id === selectedDropZone.id),
  );
}

export function initialGoldenState(): GoldenDemoState {
  return {
    campaignStatus: "draft",
    remainingSupply: 1,
    claim: null,
    redemptionStatus: "idle",
    dropStatus: "draft",
    searchMode: "locked",
    selectedDropZone: null,
    rewardClaimedByCurrentSession: false,
    rewardAvailabilityStatus: "available",
  };
}

export function unlockGoldenProximity(state: GoldenDemoState): GoldenDemoState {
  if (state.campaignStatus !== "published" || !state.selectedDropZone)
    return state;
  return {
    ...state,
    searchMode: "proximity-unlocked",
    dropStatus: "available",
  };
}

export function startGoldenSearch(state: GoldenDemoState): GoldenDemoState {
  return state.searchMode === "proximity-unlocked"
    ? { ...state, searchMode: "searching" }
    : state;
}

export function findGoldenPintag(state: GoldenDemoState): GoldenDemoState {
  return state.searchMode === "searching"
    ? { ...state, searchMode: "found" }
    : state;
}

export function attemptGoldenClaim(state: GoldenDemoState): {
  ok: boolean;
  state: GoldenDemoState;
  message: string;
} {
  if (
    state.remainingSupply <= 0 ||
    state.rewardAvailabilityStatus === "claimed"
  )
    return { ok: false, state, message: LATE_USER_MESSAGE };
  if (state.dropStatus !== "available" || state.searchMode !== "found")
    return {
      ok: false,
      state,
      message:
        "Find the Golden Pintag in the simulated search before claiming.",
    };
  const result = attemptClaim(state);
  if (!result.ok) return { ok: false, state, message: result.message };
  return {
    ok: true,
    state: {
      ...state,
      ...result.state,
      dropStatus: "claimed",
      rewardClaimedByCurrentSession: true,
      rewardAvailabilityStatus: "claimed",
    },
    message:
      "You found the Golden Pintag. Your reward is reserved for 24 hours.",
  };
}

export function resetGoldenState(): GoldenDemoState {
  return initialGoldenState();
}
export { LATE_USER_MESSAGE };
