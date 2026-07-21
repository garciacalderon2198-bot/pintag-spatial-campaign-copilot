export type Role = "Merchant" | "Consumer" | "Redemption";

export type CampaignStatus = "draft" | "review" | "published";

export type RedemptionStatus = "idle" | "redeemed" | "rejected";

export type FunnelEventType =
  | "campaign_generated"
  | "campaign_published"
  | "pintag_opened"
  | "claim_created"
  | "redemption_validated"
  | "redemption_rejected";

export type CampaignProposal = {
  title: string;
  description: string;
  venue: string;
  startTime: string;
  expirationTime: string;
  rewardSupply: number;
  reward: string;
  discoveryRadius: number;
  primaryMetric: string;
};

export type Claim = {
  id: string;
  code: string;
  status: "active" | "redeemed";
};

export type FunnelEvent = {
  id: number;
  type: FunnelEventType;
  recordedAt: string;
};

export type AnalyticsMetrics = {
  publications: number;
  pintagViews: number;
  claims: number;
  redemptions: number;
  claimToRedemptionRate: number;
  remainingSupply: number;
};

export type DemoRuleState = {
  campaignStatus: CampaignStatus;
  remainingSupply: number;
  claim: Claim | null;
  redemptionStatus: RedemptionStatus;
};

export type RuleResult = {
  ok: boolean;
  state: DemoRuleState;
  message: string;
};
