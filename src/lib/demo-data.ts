import type { CampaignProposal, DropZone, SponsorVenue } from "./demo-types.ts";

export const DEMO_MERCHANT_INPUT =
  "We have seven chocolate cheesecakes available and low foot traffic between 3:00 PM and 5:00 PM. We want to attract nearby customers without using misleading urgency.";
export const GOLDEN_MERCHANT_INPUT =
  "We want to use one chocolate cheesecake as a sponsored reward to introduce Homers Café to new customers in another part of Machala this Saturday.";

export const SPONSOR_VENUE: SponsorVenue = {
  name: "Homers Café — South Machala",
  addressLabel: "South Machala · exact address pending merchant review",
  role: "sponsor-venue",
  simulated: true,
};

export const APPROVED_DROP_ZONES: DropZone[] = [
  {
    id: "paseo-shopping-machala",
    name: "Paseo Shopping Machala",
    areaLabel: "North Machala commercial zone",
    role: "drop-zone",
    simulated: true,
    approved: true,
    suitabilityReason:
      "Prototype assumption: high simulated weekend pedestrian activity and broad local visibility.",
    simulatedDistanceFromUser: "1.2 km",
    simulatedDistanceFromSponsor: "5.8 km",
  },
  {
    id: "parque-juan-montalvo",
    name: "Parque Juan Montalvo",
    areaLabel: "Central Machala",
    role: "drop-zone",
    simulated: true,
    approved: true,
    suitabilityReason:
      "Prototype assumption: central, walkable public space suitable for a daytime activation.",
    simulatedDistanceFromUser: "850 m",
    simulatedDistanceFromSponsor: "3.9 km",
  },
  {
    id: "plaza-colon",
    name: "Plaza Colón",
    areaLabel: "Central cultural and tourism zone",
    role: "drop-zone",
    simulated: true,
    approved: true,
    suitabilityReason:
      "Prototype assumption: public visibility and simulated visitor activity.",
    simulatedDistanceFromUser: "1.6 km",
    simulatedDistanceFromSponsor: "4.4 km",
  },
];

export const DEMO_CAMPAIGN: CampaignProposal = {
  activationType: "real-time-offer",
  activationReason:
    "Use factual short-window inventory availability to attract customers already near the merchant.",
  title: "Afternoon Dessert Invitation",
  description:
    "Seven chocolate cheesecakes are available for nearby customers between 3:00 PM and 5:00 PM, while supplies last.",
  venue: SPONSOR_VENUE.name,
  sponsorName: "Homers Café",
  sponsorVenue: SPONSOR_VENUE,
  selectedDropZone: null,
  recommendedDropZones: [],
  sponsorshipLabel: "",
  claimRedemptionWindowHours: 2,
  startTime: "15:00",
  expirationTime: "17:00",
  rewardSupply: 7,
  reward:
    "One complimentary chocolate cheesecake with an eligible in-store purchase",
  discoveryRadius: 500,
  primaryMetric: "Redemption rate",
  missingInformation: [],
  ambiguityWarnings: [],
  safetyNotes: [
    "Use factual supply and time terms; do not manufacture urgency.",
  ],
};

export const GOLDEN_CAMPAIGN: CampaignProposal = {
  activationType: "golden-pintag-drop",
  activationReason:
    "Use one sponsored reward to introduce Homers Café to customers outside its immediate local radius.",
  title: "Homers Golden Cheesecake Hunt",
  description:
    "Find the Golden Pintag in the selected Drop Zone and claim a chocolate cheesecake sponsored by Homers Café.",
  venue: SPONSOR_VENUE.name,
  sponsorName: "Homers Café",
  sponsorVenue: SPONSOR_VENUE,
  selectedDropZone: null,
  recommendedDropZones: APPROVED_DROP_ZONES,
  sponsorshipLabel: "Sponsored by Homers Café",
  claimRedemptionWindowHours: 24,
  startTime: "10:00",
  expirationTime: "13:00",
  rewardSupply: 1,
  reward: "One complimentary chocolate cheesecake",
  discoveryRadius: 500,
  primaryMetric: "Claim-to-redemption rate",
  missingInformation: [
    "Final activation date",
    "Exact Sponsor Venue address",
    "Merchant redemption conditions",
    "Drop Zone permission",
    "Safety and operational approval",
  ],
  ambiguityWarnings: [
    "All Drop Zone suitability descriptions are simulated prototype assumptions.",
  ],
  safetyNotes: [
    "Use only approved public Drop Zones.",
    "Do not obstruct pedestrian movement or encourage unsafe behavior.",
    "Do not place the experience in roads, private areas, restricted zones, or unsafe locations.",
    "Human approval and local authorization are required.",
  ],
};

export const DEMO_REDEMPTION_CODE = "PINTAG-4821";
export const DEMO_DISTANCE = "240 m";
export const LATE_USER_MESSAGE =
  "This Golden Pintag has already been claimed. Keep exploring—another Drop may appear nearby.";
