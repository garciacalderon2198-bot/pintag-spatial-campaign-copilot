export type Role = "Merchant" | "Consumer" | "Redemption";
export type ActivationType = "real-time-offer" | "golden-pintag-drop";
export type ActivationPreference = "recommend" | ActivationType;
export type CampaignStatus = "draft" | "review" | "published";
export type RedemptionStatus = "idle" | "redeemed" | "rejected";
export type SearchMode =
  | "locked"
  | "proximity-unlocked"
  | "searching"
  | "found";
export type DropStatus =
  | "draft"
  | "published"
  | "available"
  | "claimed"
  | "expired";
export type RewardAvailabilityStatus = "available" | "claimed" | "expired";

export type FunnelEventType =
  | "campaign_generated"
  | "campaign_published"
  | "pintag_opened"
  | "drop_zone_arrival_simulated"
  | "golden_search_started"
  | "golden_pintag_found"
  | "claim_created"
  | "redemption_validated"
  | "redemption_rejected";

export type SponsorVenue = {
  name: string;
  addressLabel: string;
  role: "sponsor-venue";
  simulated: true;
};

export type DropZone = {
  id: string;
  name: string;
  areaLabel: string;
  role: "drop-zone";
  simulated: true;
  approved: true;
  suitabilityReason: string;
  simulatedDistanceFromUser: string;
  simulatedDistanceFromSponsor: string;
};

export type CampaignProposal = {
  activationType: ActivationType;
  activationReason: string;
  title: string;
  description: string;
  venue: string;
  sponsorName: string;
  sponsorVenue: SponsorVenue;
  selectedDropZone: DropZone | null;
  recommendedDropZones: DropZone[];
  sponsorshipLabel: string;
  claimRedemptionWindowHours: number;
  startTime: string;
  expirationTime: string;
  rewardSupply: number;
  reward: string;
  discoveryRadius: number;
  primaryMetric: string;
  missingInformation: string[];
  ambiguityWarnings: string[];
  safetyNotes: string[];
};

export type Claim = { id: string; code: string; status: "active" | "redeemed" };
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
  goldenSearchesStarted: number;
  goldenPintagsFound: number;
};

export type DemoRuleState = {
  campaignStatus: CampaignStatus;
  remainingSupply: number;
  claim: Claim | null;
  redemptionStatus: RedemptionStatus;
};

export type RuleResult = { ok: boolean; state: DemoRuleState; message: string };

export type GoldenDemoState = DemoRuleState & {
  dropStatus: DropStatus;
  searchMode: SearchMode;
  selectedDropZone: DropZone | null;
  rewardClaimedByCurrentSession: boolean;
  rewardAvailabilityStatus: RewardAvailabilityStatus;
};
