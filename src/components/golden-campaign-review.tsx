import type { CampaignProposal, Claim } from "@/lib/demo-types";

type ProposalProps = {
  proposal: CampaignProposal;
  onProposal: (proposal: CampaignProposal) => void;
};

export function GoldenCampaignBanner({
  proposal,
}: {
  proposal: CampaignProposal;
}) {
  return (
    <div className="golden-banner">
      <span>Sponsored Golden Drop</span>
      <strong>{proposal.sponsorshipLabel}</strong>
      <p>{proposal.activationReason}</p>
    </div>
  );
}

export function GoldenCampaignFields({ proposal, onProposal }: ProposalProps) {
  return (
    <>
      <label>
        <span>Sponsor</span>
        <input
          value={proposal.sponsorName}
          onChange={(event) =>
            onProposal({
              ...proposal,
              sponsorName: event.target.value,
              sponsorshipLabel: `Sponsored by ${event.target.value}`,
            })
          }
          required
        />
      </label>
      <label>
        <span>Redemption window (hours)</span>
        <input
          type="number"
          min="1"
          max="168"
          value={proposal.claimRedemptionWindowHours}
          onChange={(event) =>
            onProposal({
              ...proposal,
              claimRedemptionWindowHours: Math.max(
                1,
                Number(event.target.value),
              ),
            })
          }
          required
        />
      </label>
      <label className="field-wide">
        <span>Sponsor Venue</span>
        <input
          value={proposal.sponsorVenue.name}
          onChange={(event) =>
            onProposal({
              ...proposal,
              venue: event.target.value,
              sponsorVenue: {
                ...proposal.sponsorVenue,
                name: event.target.value,
              },
            })
          }
          required
        />
      </label>
    </>
  );
}

export function GoldenLocationReview({ proposal, onProposal }: ProposalProps) {
  return (
    <div className="location-review">
      <div className="location-pair">
        <article>
          <small>Find the Golden Pintag at:</small>
          <strong>
            {proposal.selectedDropZone?.name || "Select one approved Drop Zone"}
          </strong>
        </article>
        <span aria-hidden="true">→</span>
        <article>
          <small>Redeem the reward at:</small>
          <strong>{proposal.sponsorVenue.name}</strong>
        </article>
      </div>
      <h3>
        Prototype Drop Zones — final safety, permission and operational review
        required.
      </h3>
      <div className="drop-zone-grid">
        {proposal.recommendedDropZones.map((zone) => (
          <label
            className={
              proposal.selectedDropZone?.id === zone.id ? "selected" : ""
            }
            key={zone.id}
          >
            <input
              type="radio"
              name="drop-zone"
              checked={proposal.selectedDropZone?.id === zone.id}
              onChange={() =>
                onProposal({ ...proposal, selectedDropZone: zone })
              }
            />
            <strong>{zone.name}</strong>
            <span>{zone.areaLabel}</span>
            <p>{zone.suitabilityReason}</p>
            <small>
              {zone.simulatedDistanceFromUser} from simulated user ·{" "}
              {zone.simulatedDistanceFromSponsor} from sponsor · Approved
              catalog entry
            </small>
          </label>
        ))}
      </div>
      <p className="trust-copy">
        AI or fallback recommendations do not replace safety, legal, permission
        or operational review.
      </p>
    </div>
  );
}

export function GoldenMerchantNotification({
  proposal,
  claim,
}: {
  proposal: CampaignProposal;
  claim: Claim;
}) {
  return (
    <aside className="merchant-notification">
      <span>Simulated merchant notification</span>
      <strong>DemoUser23 claimed your Golden Pintag Drop.</strong>
      <p>
        {proposal.reward} · {claim.code} · redeem within{" "}
        {proposal.claimRedemptionWindowHours} hours
      </p>
      <p>
        Drop Zone: {proposal.selectedDropZone?.name} · Sponsor Venue:{" "}
        {proposal.sponsorVenue.name}
      </p>
    </aside>
  );
}
