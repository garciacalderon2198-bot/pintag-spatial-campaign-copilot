"use client";

import { useMemo, useState } from "react";

import { DemoProgress } from "@/components/demo-progress";
import {
  DEMO_CAMPAIGN,
  DEMO_DISTANCE,
  DEMO_MERCHANT_INPUT,
} from "@/lib/demo-data";
import {
  attemptClaim,
  calculateAnalytics,
  validateRedemption,
} from "@/lib/demo-rules";
import type {
  CampaignProposal,
  CampaignStatus,
  FunnelEvent,
  FunnelEventType,
  RedemptionStatus,
  Role,
} from "@/lib/demo-types";

const roles: Role[] = ["Merchant", "Consumer", "Redemption"];

type Notice = { tone: "success" | "error" | "info"; text: string } | null;

type MerchantViewProps = {
  merchantInput: string;
  proposal: CampaignProposal | null;
  campaignStatus: CampaignStatus;
  remainingSupply: number;
  notice: Notice;
  onInputChange: (value: string) => void;
  onGenerate: () => void;
  onProposalChange: (proposal: CampaignProposal) => void;
  onPublish: () => void;
};

function NoticeBanner({ notice }: { notice: Notice }) {
  if (!notice) return null;

  return (
    <div className={`notice-banner ${notice.tone}`} role="status">
      <span aria-hidden="true">
        {notice.tone === "success" ? "✓" : notice.tone === "error" ? "!" : "i"}
      </span>
      <p>{notice.text}</p>
    </div>
  );
}

function MerchantView({
  merchantInput,
  proposal,
  campaignStatus,
  remainingSupply,
  notice,
  onInputChange,
  onGenerate,
  onProposalChange,
  onPublish,
}: MerchantViewProps) {
  return (
    <section className="view-stack" aria-labelledby="merchant-heading">
      <div className="merchant-hero">
        <div>
          <p className="eyebrow">Merchant workspace</p>
          <h1 id="merchant-heading">Compose, review, then publish.</h1>
          <p className="intro-copy">
            This deterministic demo keeps every campaign decision visible and
            under human control while GPT-5.6 integration remains pending.
          </p>
        </div>

        <article className="dashboard-card" aria-label="Campaign dashboard">
          <div>
            <span className={`status-badge ${campaignStatus}`}>
              {campaignStatus}
            </span>
            <small>Campaign status</small>
          </div>
          <div>
            <strong>{remainingSupply}</strong>
            <small>Rewards remaining</small>
          </div>
          <div>
            <strong>{proposal ? `${proposal.startTime}–${proposal.expirationTime}` : "—"}</strong>
            <small>Demo time window</small>
          </div>
        </article>
      </div>

      <NoticeBanner notice={notice} />

      <div className="merchant-workspace">
        <div className="composer-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">1 · Compose</p>
              <h2>Describe the operational need</h2>
            </div>
            <span className="step-pill">Editable input</span>
          </div>

          <label className="sr-only" htmlFor="merchant-need">
            Merchant business need
          </label>
          <textarea
            id="merchant-need"
            value={merchantInput}
            onChange={(event) => onInputChange(event.target.value)}
            rows={7}
          />

          <div className="composer-footer">
            <p>{merchantInput.length} characters</p>
            <button
              className="primary-button"
              type="button"
              onClick={onGenerate}
              disabled={campaignStatus === "published"}
            >
              Generate spatial campaign <span aria-hidden="true">→</span>
            </button>
          </div>

          <aside className="integration-note">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>Deterministic generator active</strong>
              <p>
                No AI call occurs. The button loads the approved demo campaign
                structure for human review.
              </p>
            </div>
          </aside>
        </div>

        {proposal ? (
          <form
            className="review-card"
            onSubmit={(event) => {
              event.preventDefault();
              onPublish();
            }}
          >
            <div className="review-heading">
              <div>
                <p className="eyebrow">2 · Human review</p>
                <h2>Campaign proposal</h2>
              </div>
              <span className="demo-structure-badge">
                Demo campaign structure — GPT-5.6 integration pending
              </span>
            </div>

            <div className="review-fields">
              <label className="field-wide">
                <span>Title</span>
                <input
                  value={proposal.title}
                  onChange={(event) =>
                    onProposalChange({ ...proposal, title: event.target.value })
                  }
                  required
                />
              </label>
              <label className="field-wide">
                <span>Description</span>
                <textarea
                  value={proposal.description}
                  onChange={(event) =>
                    onProposalChange({
                      ...proposal,
                      description: event.target.value,
                    })
                  }
                  rows={3}
                  required
                />
              </label>
              <label className="field-wide">
                <span>Reward</span>
                <input
                  value={proposal.reward}
                  onChange={(event) =>
                    onProposalChange({ ...proposal, reward: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Reward supply</span>
                <input
                  type="number"
                  min="1"
                  value={proposal.rewardSupply}
                  onChange={(event) =>
                    onProposalChange({
                      ...proposal,
                      rewardSupply: Math.max(1, Number(event.target.value)),
                    })
                  }
                  required
                />
              </label>
              <label>
                <span>Discovery radius (m)</span>
                <input
                  type="number"
                  min="1"
                  value={proposal.discoveryRadius}
                  onChange={(event) =>
                    onProposalChange({
                      ...proposal,
                      discoveryRadius: Math.max(1, Number(event.target.value)),
                    })
                  }
                  required
                />
              </label>
              <label>
                <span>Start time</span>
                <input
                  type="time"
                  value={proposal.startTime}
                  onChange={(event) =>
                    onProposalChange({ ...proposal, startTime: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Expiration time</span>
                <input
                  type="time"
                  value={proposal.expirationTime}
                  onChange={(event) =>
                    onProposalChange({
                      ...proposal,
                      expirationTime: event.target.value,
                    })
                  }
                  required
                />
              </label>
            </div>

            <div className="review-facts">
              <span>Venue: {proposal.venue} (simulated)</span>
              <span>Primary metric: {proposal.primaryMetric}</span>
            </div>

            <ul className="review-warnings">
              <li>Venue, location, and discovery distance are simulated.</li>
              <li>Human approval is required before publication.</li>
              <li>GPT-5.6 integration is pending.</li>
            </ul>

            <button
              className="primary-button publish-button"
              type="submit"
              disabled={campaignStatus === "published"}
            >
              {campaignStatus === "published" ? "Campaign published" : "Approve and publish"}
            </button>
          </form>
        ) : (
          <aside className="empty-review-card">
            <span aria-hidden="true">02</span>
            <h2>Review appears here</h2>
            <p>
              Generate the deterministic campaign structure to unlock editable
              review and publication.
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}

type ConsumerViewProps = {
  proposal: CampaignProposal | null;
  campaignStatus: CampaignStatus;
  remainingSupply: number;
  isPintagOpen: boolean;
  claimCode: string;
  claimStatus: "active" | "redeemed" | null;
  notice: Notice;
  onOpen: () => void;
  onClaim: () => void;
};

function ConsumerView({
  proposal,
  campaignStatus,
  remainingSupply,
  isPintagOpen,
  claimCode,
  claimStatus,
  notice,
  onOpen,
  onClaim,
}: ConsumerViewProps) {
  const isPublished = campaignStatus === "published" && proposal;

  return (
    <section className="view-stack" aria-labelledby="consumer-heading">
      <div className="view-intro">
        <div>
          <p className="eyebrow">Consumer discovery</p>
          <h1 id="consumer-heading">Discover what is active nearby.</h1>
        </div>
        <p className="intro-copy">
          This spatial panel uses a simulated venue, position, distance, and map.
          It never requests real location access.
        </p>
      </div>

      <NoticeBanner notice={notice} />

      <div className="consumer-workspace">
        <figure className="map-card" aria-labelledby="map-title">
          <figcaption className="map-header">
            <div>
              <p className="eyebrow">3 · Discover</p>
              <h2 id="map-title">Simulated map environment</h2>
            </div>
            <span className="map-status">No location access</span>
          </figcaption>

          <div className="map-canvas">
            <div className="map-road map-road-one" aria-hidden="true" />
            <div className="map-road map-road-two" aria-hidden="true" />
            <div className="map-block block-one" aria-hidden="true" />
            <div className="map-block block-two" aria-hidden="true" />
            <div className="map-block block-three" aria-hidden="true" />

            <div className="map-point consumer-point">
              <span className="consumer-pulse" aria-hidden="true" />
              <strong>You</strong>
              <small>Simulated position</small>
            </div>

            <div className="map-point venue-point">
              <span className="venue-pin" aria-hidden="true"><b>P</b></span>
              <strong>Casa Dulce</strong>
              <small>Simulated venue</small>
            </div>

            <div className={`pintag-map-card ${isPublished ? "active" : "inactive"}`}>
              <span>{isPublished ? "Active now" : "Inactive"}</span>
              <strong>{isPublished ? proposal.title : "Afternoon dessert Pintag"}</strong>
              <small>
                {isPublished ? `${DEMO_DISTANCE} simulated distance` : "Awaiting merchant publication"}
              </small>
              <button type="button" onClick={onOpen} disabled={!isPublished}>
                {isPublished ? "Open Pintag" : "Not published"}
              </button>
            </div>
          </div>

          <div className="map-legend" aria-label="Map legend">
            <span><i className="legend-consumer" /> Consumer</span>
            <span><i className="legend-venue" /> Venue</span>
            <span><i className={isPublished ? "legend-active" : "legend-pintag"} /> Pintag</span>
          </div>
        </figure>

        <aside className="pintag-detail-card" aria-live="polite">
          {isPublished && isPintagOpen ? (
            <>
              <div className="detail-heading">
                <span className="active-label">Active Pintag</span>
                <span>{DEMO_DISTANCE} away · simulated</span>
              </div>
              <h2>{proposal.title}</h2>
              <p className="detail-description">{proposal.description}</p>
              <dl className="detail-list">
                <div><dt>Venue</dt><dd>{proposal.venue}</dd></div>
                <div><dt>Time</dt><dd>{proposal.startTime}–{proposal.expirationTime}</dd></div>
                <div><dt>Reward</dt><dd>{proposal.reward}</dd></div>
                <div><dt>Remaining</dt><dd>{remainingSupply} of {proposal.rewardSupply}</dd></div>
              </dl>
              <p className="simulation-disclosure">
                Map, venue position, consumer position, and distance are simulated.
              </p>

              {claimCode ? (
                <div className="claim-confirmation">
                  <span>Claim confirmed · {claimStatus}</span>
                  <strong>{claimCode}</strong>
                  <small>Single-use deterministic demo code</small>
                </div>
              ) : (
                <button className="primary-button claim-button" type="button" onClick={onClaim}>
                  Claim reward
                </button>
              )}
            </>
          ) : (
            <div className="detail-empty">
              <span aria-hidden="true">03</span>
              <h2>{isPublished ? "Open the active Pintag" : "No active Pintag yet"}</h2>
              <p>
                {isPublished
                  ? "Select the map card to view truthful campaign terms and claim availability."
                  : "The merchant must review and publish the campaign before discovery begins."}
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

type RedemptionViewProps = {
  redemptionInput: string;
  claimCode: string;
  claimStatus: "active" | "redeemed" | null;
  redemptionStatus: RedemptionStatus;
  notice: Notice;
  onInputChange: (value: string) => void;
  onValidate: () => void;
};

function RedemptionView({
  redemptionInput,
  claimCode,
  claimStatus,
  redemptionStatus,
  notice,
  onInputChange,
  onValidate,
}: RedemptionViewProps) {
  return (
    <section className="view-stack" aria-labelledby="redemption-heading">
      <div className="view-intro">
        <div>
          <p className="eyebrow">Merchant staff</p>
          <h1 id="redemption-heading">Validate once. Deterministically.</h1>
        </div>
        <p className="intro-copy">
          Code matching and single-use enforcement are local business rules.
          GPT-5.6 does not participate in redemption validation.
        </p>
      </div>

      <NoticeBanner notice={notice} />

      <div className="redemption-workspace">
        <form
          className="redemption-card"
          onSubmit={(event) => {
            event.preventDefault();
            onValidate();
          }}
        >
          <div className="redemption-icon" aria-hidden="true">✓</div>
          <p className="eyebrow">5 · Redeem</p>
          <h2>Enter the consumer&apos;s code</h2>
          <p className="helper-text">
            Try the generated code, a repeated use, or an invalid value.
          </p>

          <label htmlFor="redemption-code">Redemption code</label>
          <input
            id="redemption-code"
            name="redemption-code"
            value={redemptionInput}
            onChange={(event) => onInputChange(event.target.value.toUpperCase())}
            type="text"
            placeholder="PINTAG-0000"
            autoComplete="off"
          />
          <button className="primary-button validate-button" type="submit">
            Validate redemption
          </button>

          <p className="redemption-notice">
            Deterministic local validation · no AI · no external request
          </p>
        </form>

        <aside className="redemption-summary">
          <p className="eyebrow">Session state</p>
          <h2>Redemption record</h2>
          <dl>
            <div><dt>Claim code</dt><dd>{claimCode || "Not created"}</dd></div>
            <div><dt>Claim status</dt><dd>{claimStatus || "Not claimed"}</dd></div>
            <div><dt>Last validation</dt><dd>{redemptionStatus}</dd></div>
          </dl>
          <p>
            Correct unused codes redeem once. Invalid and repeated submissions
            are rejected and recorded as prototype session events.
          </p>
        </aside>
      </div>
    </section>
  );
}

function SessionAnalytics({
  metrics,
  events,
}: {
  metrics: ReturnType<typeof calculateAnalytics>;
  events: FunnelEvent[];
}) {
  const cards = [
    ["Publications", metrics.publications],
    ["Pintag detail views", metrics.pintagViews],
    ["Claims", metrics.claims],
    ["Redemptions", metrics.redemptions],
    ["Claim-to-redemption", `${metrics.claimToRedemptionRate}%`],
    ["Remaining supply", metrics.remainingSupply],
  ];

  return (
    <section className="analytics-section" aria-labelledby="analytics-heading">
      <div className="analytics-heading">
        <div>
          <p className="eyebrow">6 · Measure</p>
          <h2 id="analytics-heading">Prototype session events</h2>
        </div>
        <span>{events.length} events recorded</span>
      </div>
      <div className="metrics-grid">
        {cards.map(([label, value]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
      <div className="event-strip" aria-label="Recorded event sequence">
        {events.length ? (
          events.map((event) => <code key={event.id}>{event.type}</code>)
        ) : (
          <p>No historical activity is fabricated. Complete the demo to record session events.</p>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("Merchant");
  const [merchantInput, setMerchantInput] = useState(DEMO_MERCHANT_INPUT);
  const [proposal, setProposal] = useState<CampaignProposal | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>("draft");
  const [remainingSupply, setRemainingSupply] = useState(0);
  const [claim, setClaim] = useState<ReturnType<typeof attemptClaim>["state"]["claim"]>(null);
  const [redemptionCode, setRedemptionCode] = useState("");
  const [redemptionInput, setRedemptionInput] = useState("");
  const [redemptionStatus, setRedemptionStatus] = useState<RedemptionStatus>("idle");
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [isPintagOpen, setIsPintagOpen] = useState(false);
  const [notices, setNotices] = useState<Record<Role, Notice>>({
    Merchant: null,
    Consumer: null,
    Redemption: null,
  });

  const analytics = useMemo(
    () => calculateAnalytics(events, remainingSupply),
    [events, remainingSupply],
  );

  const eventTypes = useMemo(() => new Set(events.map((event) => event.type)), [events]);
  const milestoneCompletion = [
    proposal !== null,
    campaignStatus === "published",
    eventTypes.has("pintag_opened"),
    claim !== null,
    claim?.status === "redeemed",
    eventTypes.has("redemption_validated"),
  ];
  const currentStep = milestoneCompletion.findIndex((complete) => !complete);
  const progressSteps = ["Compose", "Publish", "Discover", "Claim", "Redeem", "Measure"].map(
    (label, index) => ({
      label,
      complete: milestoneCompletion[index],
      current: index === (currentStep === -1 ? 5 : currentStep),
    }),
  );

  function recordEvent(type: FunnelEventType) {
    setEvents((current) => [
      ...current,
      { id: current.length + 1, type, recordedAt: new Date().toISOString() },
    ]);
  }

  function setNotice(role: Role, notice: Notice) {
    setNotices((current) => ({ ...current, [role]: notice }));
  }

  function generateCampaign() {
    if (campaignStatus === "published") {
      setNotice("Merchant", { tone: "error", text: "Reset the demo before generating another campaign." });
      return;
    }
    setProposal({ ...DEMO_CAMPAIGN });
    setCampaignStatus("review");
    setRemainingSupply(DEMO_CAMPAIGN.rewardSupply);
    setNotice("Merchant", {
      tone: "info",
      text: "Deterministic demo structure created. Review every field before publication.",
    });
    recordEvent("campaign_generated");
  }

  function publishCampaign() {
    if (!proposal) return;
    if (proposal.startTime >= proposal.expirationTime) {
      setNotice("Merchant", { tone: "error", text: "Expiration time must be later than the start time." });
      return;
    }
    setCampaignStatus("published");
    setRemainingSupply(proposal.rewardSupply);
    setNotice("Merchant", { tone: "success", text: "Campaign approved and published to the simulated map." });
    recordEvent("campaign_published");
  }

  function openPintag() {
    if (campaignStatus !== "published") {
      setNotice("Consumer", { tone: "error", text: "This Pintag is inactive until the merchant publishes it." });
      return;
    }
    if (!isPintagOpen) recordEvent("pintag_opened");
    setIsPintagOpen(true);
    setNotice("Consumer", { tone: "info", text: "Pintag details opened using simulated spatial data." });
  }

  function claimReward() {
    const result = attemptClaim({ campaignStatus, remainingSupply, claim, redemptionStatus });
    setRemainingSupply(result.state.remainingSupply);
    setClaim(result.state.claim);
    setRedemptionStatus(result.state.redemptionStatus);
    setNotice("Consumer", { tone: result.ok ? "success" : "error", text: result.message });
    if (result.ok && result.state.claim) {
      setRedemptionCode(result.state.claim.code);
      setRedemptionInput(result.state.claim.code);
      recordEvent("claim_created");
    }
  }

  function redeemClaim() {
    const result = validateRedemption(
      { campaignStatus, remainingSupply, claim, redemptionStatus },
      redemptionInput,
    );
    setClaim(result.state.claim);
    setRedemptionStatus(result.state.redemptionStatus);
    setNotice("Redemption", { tone: result.ok ? "success" : "error", text: result.message });
    recordEvent(result.ok ? "redemption_validated" : "redemption_rejected");
  }

  function resetDemo() {
    setActiveRole("Merchant");
    setMerchantInput(DEMO_MERCHANT_INPUT);
    setProposal(null);
    setCampaignStatus("draft");
    setRemainingSupply(0);
    setClaim(null);
    setRedemptionCode("");
    setRedemptionInput("");
    setRedemptionStatus("idle");
    setEvents([]);
    setIsPintagOpen(false);
    setNotices({ Merchant: null, Consumer: null, Redemption: null });
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="PINTAG home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span><strong>PINTAG</strong><small>Spatial Campaign Copilot</small></span>
        </a>
        <div className="event-meta" aria-label="Project information">
          <span>OpenAI Build Week 2026</span>
          <span className="meta-divider" aria-hidden="true" />
          <span>Work &amp; Productivity</span>
          <strong className="demo-badge">Demo prototype</strong>
          <button className="reset-button" type="button" onClick={resetDemo}>Reset demo</button>
        </div>
      </header>

      <DemoProgress steps={progressSteps} />

      <nav className="role-nav" aria-label="Choose a demo role">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            className={activeRole === role ? "active" : ""}
            aria-pressed={activeRole === role}
            onClick={() => setActiveRole(role)}
          >
            {role}
          </button>
        ))}
      </nav>

      <main id="main-content">
        {activeRole === "Merchant" && (
          <MerchantView
            merchantInput={merchantInput}
            proposal={proposal}
            campaignStatus={campaignStatus}
            remainingSupply={remainingSupply}
            notice={notices.Merchant}
            onInputChange={setMerchantInput}
            onGenerate={generateCampaign}
            onProposalChange={setProposal}
            onPublish={publishCampaign}
          />
        )}
        {activeRole === "Consumer" && (
          <ConsumerView
            proposal={proposal}
            campaignStatus={campaignStatus}
            remainingSupply={remainingSupply}
            isPintagOpen={isPintagOpen}
            claimCode={redemptionCode}
            claimStatus={claim?.status ?? null}
            notice={notices.Consumer}
            onOpen={openPintag}
            onClaim={claimReward}
          />
        )}
        {activeRole === "Redemption" && (
          <RedemptionView
            redemptionInput={redemptionInput}
            claimCode={redemptionCode}
            claimStatus={claim?.status ?? null}
            redemptionStatus={redemptionStatus}
            notice={notices.Redemption}
            onInputChange={setRedemptionInput}
            onValidate={redeemClaim}
          />
        )}
      </main>

      <SessionAnalytics metrics={analytics} events={events} />

      <footer className="site-footer">
        <p>Independent Build Week prototype · Separate from the contractual PINTAG MVP</p>
        <p>Simulated identities and location data · No external services</p>
      </footer>
    </div>
  );
}
