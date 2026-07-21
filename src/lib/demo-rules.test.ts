import assert from "node:assert/strict";
import test from "node:test";

import { attemptClaim, validateRedemption } from "./demo-rules.ts";
import type { DemoRuleState } from "./demo-types.ts";

function initialState(
  overrides: Partial<DemoRuleState> = {},
): DemoRuleState {
  return {
    campaignStatus: "draft",
    remainingSupply: 8,
    claim: null,
    redemptionStatus: "idle",
    ...overrides,
  };
}

test("claim cannot occur before publication", () => {
  const state = initialState();
  const result = attemptClaim(state);

  assert.equal(result.ok, false);
  assert.equal(result.state.claim, null);
  assert.equal(result.state.remainingSupply, 8);
});

test("supply decreases only once for a demo session", () => {
  const first = attemptClaim(
    initialState({ campaignStatus: "published" }),
  );
  const duplicate = attemptClaim(first.state);

  assert.equal(first.ok, true);
  assert.equal(first.state.remainingSupply, 7);
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.state.remainingSupply, 7);
});

test("redemption is single-use", () => {
  const claimed = attemptClaim(
    initialState({ campaignStatus: "published" }),
  );
  const redeemed = validateRedemption(claimed.state, "PINTAG-4821");
  const repeated = validateRedemption(redeemed.state, "PINTAG-4821");

  assert.equal(redeemed.ok, true);
  assert.equal(redeemed.state.claim?.status, "redeemed");
  assert.equal(repeated.ok, false);
  assert.match(repeated.message, /already been used/i);
});

test("invalid redemption code is rejected", () => {
  const claimed = attemptClaim(
    initialState({ campaignStatus: "published" }),
  );
  const result = validateRedemption(claimed.state, "PINTAG-9999");

  assert.equal(result.ok, false);
  assert.equal(result.state.redemptionStatus, "rejected");
  assert.equal(result.state.claim?.status, "active");
});
