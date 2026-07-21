import assert from "node:assert/strict";
import test from "node:test";

import { createFallbackCampaign } from "./ai-fallback.ts";
import {
  APPROVED_DROP_ZONES,
  DEMO_CAMPAIGN,
  GOLDEN_CAMPAIGN,
  LATE_USER_MESSAGE,
} from "./demo-data.ts";
import { attemptClaim, validateRedemption } from "./demo-rules.ts";
import {
  attemptGoldenClaim,
  canPublishGolden,
  findGoldenPintag,
  initialGoldenState,
  recommendActivation,
  resetGoldenState,
  startGoldenSearch,
  unlockGoldenProximity,
} from "./golden-drop-rules.ts";

test("inventory and low-traffic input recommends real-time-offer", () => {
  assert.equal(
    recommendActivation("Excess inventory and low traffic before closing")
      .activationType,
    "real-time-offer",
  );
});

test("awareness and sponsored-reward input recommends golden-pintag-drop", () => {
  assert.equal(
    recommendActivation(
      "Launch awareness with a sponsored reward in another area",
    ).activationType,
    "golden-pintag-drop",
  );
});

test("explicit merchant choice overrides recommendation", () => {
  assert.equal(
    recommendActivation(
      "low traffic and available inventory",
      "golden-pintag-drop",
    ).activationType,
    "golden-pintag-drop",
  );
});

test("Golden proposal uses a different Drop Zone and Sponsor Venue", () => {
  const proposal = {
    ...GOLDEN_CAMPAIGN,
    selectedDropZone: APPROVED_DROP_ZONES[0],
  };
  assert.notEqual(proposal.selectedDropZone.name, proposal.sponsorVenue.name);
});

test("Golden fallback recommends only approved Drop Zones", () => {
  const result = createFallbackCampaign(
    {
      merchantNeed: "sponsored reward for awareness in another area",
      venue: "Homers Café — South Machala",
      defaultSupply: 1,
      defaultStartTime: "10:00",
      defaultEndTime: "13:00",
      defaultRadiusMeters: 500,
      activationPreference: "recommend",
    },
    "not-configured",
  );
  assert.equal(result.activationType, "golden-pintag-drop");
  assert.deepEqual(
    result.recommendedDropZoneIds,
    APPROVED_DROP_ZONES.map((zone) => zone.id),
  );
});

test("Golden campaign cannot publish without a human-selected Drop Zone", () => {
  assert.equal(canPublishGolden(null), false);
  assert.equal(canPublishGolden(APPROVED_DROP_ZONES[0]), true);
});

test("Golden search remains locked before simulated proximity", () => {
  const state = {
    ...initialGoldenState(),
    campaignStatus: "published" as const,
    selectedDropZone: APPROVED_DROP_ZONES[0],
    dropStatus: "available" as const,
  };
  assert.equal(startGoldenSearch(state).searchMode, "locked");
});

test("Golden claim is blocked before the Pintag is found", () => {
  const state = {
    ...initialGoldenState(),
    campaignStatus: "published" as const,
    selectedDropZone: APPROVED_DROP_ZONES[0],
    dropStatus: "available" as const,
  };
  assert.equal(attemptGoldenClaim(state).ok, false);
});

function foundState() {
  const published = {
    ...initialGoldenState(),
    campaignStatus: "published" as const,
    selectedDropZone: APPROVED_DROP_ZONES[0],
    dropStatus: "available" as const,
  };
  return findGoldenPintag(startGoldenSearch(unlockGoldenProximity(published)));
}

test("Golden claim succeeds after publication, proximity unlock, and find", () => {
  assert.equal(attemptGoldenClaim(foundState()).ok, true);
});

test("Golden supply decreases only once", () => {
  const first = attemptGoldenClaim(foundState());
  const second = attemptGoldenClaim(first.state);
  assert.equal(first.state.remainingSupply, 0);
  assert.equal(second.state.remainingSupply, 0);
  assert.equal(second.ok, false);
});

test("Golden claim creates PINTAG-4821", () => {
  assert.equal(
    attemptGoldenClaim(foundState()).state.claim?.code,
    "PINTAG-4821",
  );
});

test("Golden redemption is single-use", () => {
  const claimed = attemptGoldenClaim(foundState());
  const redeemed = validateRedemption(claimed.state, "PINTAG-4821");
  const repeated = validateRedemption(redeemed.state, "PINTAG-4821");
  assert.equal(redeemed.ok, true);
  assert.equal(repeated.ok, false);
});

test("invalid Golden redemption is rejected", () => {
  const claimed = attemptGoldenClaim(foundState());
  assert.equal(validateRedemption(claimed.state, "PINTAG-9999").ok, false);
});

test("late user cannot claim and receives positive wording", () => {
  const claimed = attemptGoldenClaim(foundState());
  const late = attemptGoldenClaim(claimed.state);
  assert.equal(late.ok, false);
  assert.equal(late.message, LATE_USER_MESSAGE);
  assert.doesNotMatch(
    late.message,
    /you lost|too late|failed|reward unavailable/i,
  );
});

test("reset clears all Golden state", () => {
  assert.deepEqual(resetGoldenState(), initialGoldenState());
});

test("Real-time Offer claim and redemption flow remains valid", () => {
  const claimed = attemptClaim({
    campaignStatus: "published",
    remainingSupply: DEMO_CAMPAIGN.rewardSupply,
    claim: null,
    redemptionStatus: "idle",
  });
  assert.equal(claimed.ok, true);
  assert.equal(validateRedemption(claimed.state, "PINTAG-4821").ok, true);
});
