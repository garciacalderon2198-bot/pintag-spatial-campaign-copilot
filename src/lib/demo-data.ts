import type { CampaignProposal } from "./demo-types.ts";

export const DEMO_MERCHANT_INPUT =
  "We have eight fresh desserts available and low foot traffic between 3:00 PM and 5:00 PM. We want to attract nearby customers without using misleading urgency.";

export const DEMO_CAMPAIGN: CampaignProposal = {
  title: "Afternoon Dessert Invitation",
  description:
    "Eight fresh desserts are available for nearby customers between 3:00 PM and 5:00 PM, while supplies last.",
  venue: "Casa Dulce Demo Café",
  startTime: "15:00",
  expirationTime: "17:00",
  rewardSupply: 8,
  reward: "One complimentary mini dessert with an eligible in-store purchase",
  discoveryRadius: 500,
  primaryMetric: "Redemption rate",
};

export const DEMO_REDEMPTION_CODE = "PINTAG-4821";
export const DEMO_DISTANCE = "240 m";
