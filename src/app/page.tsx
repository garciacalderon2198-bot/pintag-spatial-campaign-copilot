"use client";

import { useMemo, useState } from "react";
import { DemoProgress } from "@/components/demo-progress";
import {
  GoldenCampaignBanner,
  GoldenCampaignFields,
  GoldenLocationReview,
  GoldenMerchantNotification,
} from "@/components/golden-campaign-review";
import type {
  AISourceMode,
  CampaignGenerationResponse,
  InsightResponse,
} from "@/lib/ai-types";
import {
  APPROVED_DROP_ZONES,
  DEMO_CAMPAIGN,
  DEMO_DISTANCE,
  DEMO_MERCHANT_INPUT,
  GOLDEN_CAMPAIGN,
  GOLDEN_MERCHANT_INPUT,
  LATE_USER_MESSAGE,
  SPONSOR_VENUE,
} from "@/lib/demo-data";
import {
  attemptClaim,
  calculateAnalytics,
  validateRedemption,
} from "@/lib/demo-rules";
import {
  approvedDropZonesById,
  attemptGoldenClaim,
  canPublishGolden,
  findGoldenPintag,
  recommendActivation,
  startGoldenSearch,
  unlockGoldenProximity,
} from "@/lib/golden-drop-rules";
import type {
  ActivationPreference,
  CampaignProposal,
  CampaignStatus,
  Claim,
  DropStatus,
  FunnelEvent,
  FunnelEventType,
  GoldenDemoState,
  RedemptionStatus,
  Role,
  SearchMode,
} from "@/lib/demo-types";

const roles: Role[] = ["Merchant", "Consumer", "Redemption"];
type Notice = { tone: "success" | "error" | "info"; text: string } | null;
type RequestState = "idle" | "loading" | "success" | "fallback" | "error";

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

function SourceBadge({
  sourceMode,
  requestState,
}: {
  sourceMode: AISourceMode | null;
  requestState: RequestState;
}) {
  return (
    <span
      className={`demo-structure-badge ${sourceMode === "azure-gpt-5.6" ? "live" : "fallback"}`}
    >
      {sourceMode === "azure-gpt-5.6"
        ? "Generated live with GPT-5.6 through Azure OpenAI"
        : requestState === "error"
          ? "AI request unavailable — deterministic campaign preserved"
          : "Deterministic fallback — Azure model unavailable"}
    </span>
  );
}

type MerchantProps = {
  preference: ActivationPreference;
  merchantInput: string;
  proposal: CampaignProposal | null;
  status: CampaignStatus;
  remainingSupply: number;
  notice: Notice;
  requestState: RequestState;
  sourceMode: AISourceMode | null;
  claim: Claim | null;
  onPreference: (value: ActivationPreference) => void;
  onPreset: (type: "real-time-offer" | "golden-pintag-drop") => void;
  onInput: (value: string) => void;
  onGenerate: () => void;
  onProposal: (proposal: CampaignProposal) => void;
  onPublish: () => void;
};

function MerchantView({
  preference,
  merchantInput,
  proposal,
  status,
  remainingSupply,
  notice,
  requestState,
  sourceMode,
  claim,
  onPreference,
  onPreset,
  onInput,
  onGenerate,
  onProposal,
  onPublish,
}: MerchantProps) {
  const golden = proposal?.activationType === "golden-pintag-drop";
  return (
    <section className="view-stack" aria-labelledby="merchant-heading">
      <div className="merchant-hero">
        <div>
          <p className="eyebrow">Merchant workspace</p>
          <h1 id="merchant-heading">Choose, structure, and approve.</h1>
          <p className="intro-copy">
            PINTAG helps local businesses turn nearby attention into measurable
            store visits through real-time spatial offers and gamified sponsored
            rewards.
          </p>
        </div>
        <article className="dashboard-card" aria-label="Campaign dashboard">
          <div>
            <span className={`status-badge ${status}`}>{status}</span>
            <small>Campaign status</small>
          </div>
          <div>
            <strong>
              {proposal ? (golden ? "Golden Drop" : "Real-time Offer") : "—"}
            </strong>
            <small>Activation mode</small>
          </div>
          <div>
            <strong>{remainingSupply}</strong>
            <small>Rewards remaining</small>
          </div>
        </article>
      </div>
      <NoticeBanner notice={notice} />
      <div className="merchant-workspace">
        <div className="composer-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">1 · Compose</p>
              <h2>Describe the merchant need</h2>
            </div>
            <span className="step-pill">Human-controlled</span>
          </div>
          <fieldset
            className="activation-selector"
            disabled={status === "published"}
          >
            <legend>Activation selector</legend>
            {(
              [
                ["recommend", "Recommend activation"],
                ["real-time-offer", "Real-time Offer"],
                ["golden-pintag-drop", "Golden Pintag Drop"],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="activation"
                  value={value}
                  checked={preference === value}
                  onChange={() => onPreference(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          <div className="preset-row">
            <button
              type="button"
              onClick={() => onPreset("real-time-offer")}
              disabled={status === "published"}
            >
              Use real-time offer example
            </button>
            <button
              type="button"
              onClick={() => onPreset("golden-pintag-drop")}
              disabled={status === "published"}
            >
              Use Golden Drop example
            </button>
          </div>
          <label className="sr-only" htmlFor="merchant-need">
            Merchant business need
          </label>
          <textarea
            id="merchant-need"
            value={merchantInput}
            onChange={(event) => onInput(event.target.value)}
            rows={7}
          />
          <div className="composer-footer">
            <p>{merchantInput.length} characters</p>
            <button
              className="primary-button"
              type="button"
              onClick={onGenerate}
              disabled={status === "published" || requestState === "loading"}
            >
              {requestState === "loading"
                ? "Generating campaign…"
                : "Generate spatial campaign"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <aside className="integration-note">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>
                Optional Azure recommendation with deterministic fallback
              </strong>
              <p>
                The heuristic is deterministic when Azure is unavailable.
                Explicit merchant choice always wins, and publication always
                requires human approval.
              </p>
            </div>
          </aside>
        </div>
        {proposal ? (
          <form
            className={`review-card ${golden ? "golden-review" : ""}`}
            onSubmit={(event) => {
              event.preventDefault();
              onPublish();
            }}
          >
            <div className="review-heading">
              <div>
                <p className="eyebrow">2 · Human review</p>
                <h2>
                  {golden ? "Golden Drop proposal" : "Real-time Offer proposal"}
                </h2>
              </div>
              <SourceBadge
                sourceMode={sourceMode}
                requestState={requestState}
              />
            </div>
            {golden && <GoldenCampaignBanner proposal={proposal} />}
            <div className="review-fields">
              <label className="field-wide">
                <span>Activation reason</span>
                <textarea
                  value={proposal.activationReason}
                  onChange={(e) =>
                    onProposal({
                      ...proposal,
                      activationReason: e.target.value,
                    })
                  }
                  rows={2}
                  required
                />
              </label>
              <label className="field-wide">
                <span>Title</span>
                <input
                  value={proposal.title}
                  onChange={(e) =>
                    onProposal({ ...proposal, title: e.target.value })
                  }
                  required
                />
              </label>
              <label className="field-wide">
                <span>Description</span>
                <textarea
                  value={proposal.description}
                  onChange={(e) =>
                    onProposal({ ...proposal, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </label>
              <label className="field-wide">
                <span>Reward</span>
                <input
                  value={proposal.reward}
                  onChange={(e) =>
                    onProposal({ ...proposal, reward: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Supply</span>
                <input
                  type="number"
                  min="1"
                  value={proposal.rewardSupply}
                  onChange={(e) =>
                    onProposal({
                      ...proposal,
                      rewardSupply: Math.max(1, Number(e.target.value)),
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
                  onChange={(e) =>
                    onProposal({
                      ...proposal,
                      discoveryRadius: Math.max(1, Number(e.target.value)),
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
                  onChange={(e) =>
                    onProposal({ ...proposal, startTime: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>Expiration time</span>
                <input
                  type="time"
                  value={proposal.expirationTime}
                  onChange={(e) =>
                    onProposal({ ...proposal, expirationTime: e.target.value })
                  }
                  required
                />
              </label>
              {golden && (
                <GoldenCampaignFields
                  proposal={proposal}
                  onProposal={onProposal}
                />
              )}
            </div>
            {golden ? (
              <GoldenLocationReview
                proposal={proposal}
                onProposal={onProposal}
              />
            ) : (
              <div className="review-facts">
                <span>
                  Discovery and redemption: {proposal.sponsorVenue.name}{" "}
                  (simulated)
                </span>
                <span>Primary metric: {proposal.primaryMetric}</span>
              </div>
            )}
            <ul className="review-warnings">
              {proposal.missingInformation.map((item) => (
                <li key={item}>Missing: {item}</li>
              ))}
              {proposal.ambiguityWarnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {proposal.safetyNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>Human approval is required before publication.</li>
            </ul>
            <button
              className="primary-button publish-button"
              type="submit"
              disabled={status === "published"}
            >
              {status === "published"
                ? "Campaign published"
                : "Approve and publish"}
            </button>
          </form>
        ) : (
          <aside className="empty-review-card">
            <span aria-hidden="true">02</span>
            <h2>Review appears here</h2>
            <p>
              Generate a proposal to review its activation mode, terms,
              locations, safety notes, and publication controls.
            </p>
          </aside>
        )}
      </div>
      {golden && claim && (
        <GoldenMerchantNotification proposal={proposal} claim={claim} />
      )}
    </section>
  );
}

type ConsumerProps = {
  proposal: CampaignProposal | null;
  status: CampaignStatus;
  remainingSupply: number;
  isOpen: boolean;
  claim: Claim | null;
  searchMode: SearchMode;
  dropStatus: DropStatus;
  notice: Notice;
  onOpen: () => void;
  onArrive: () => void;
  onStartSearch: () => void;
  onFind: () => void;
  onClaim: () => void;
};

function ConsumerView({
  proposal,
  status,
  remainingSupply,
  isOpen,
  claim,
  searchMode,
  dropStatus,
  notice,
  onOpen,
  onArrive,
  onStartSearch,
  onFind,
  onClaim,
}: ConsumerProps) {
  const published = status === "published" && proposal;
  const golden = proposal?.activationType === "golden-pintag-drop";
  return (
    <section className="view-stack" aria-labelledby="consumer-heading">
      <div className="view-intro">
        <div>
          <p className="eyebrow">Consumer discovery</p>
          <h1 id="consumer-heading">Discover and act locally.</h1>
        </div>
        <p className="intro-copy">
          All map, location, movement, proximity, WebAR, merchant identity, and
          user identity behavior is simulated.
        </p>
      </div>
      <NoticeBanner notice={notice} />
      <div className="consumer-workspace">
        <figure
          className={`map-card ${golden ? "golden-map" : ""}`}
          aria-labelledby="map-title"
        >
          <figcaption className="map-header">
            <div>
              <p className="eyebrow">3 · Discover</p>
              <h2 id="map-title">
                {golden ? "Golden Pintag Drop" : "Simulated map environment"}
              </h2>
            </div>
            <span className="map-status">Simulated map and location data</span>
          </figcaption>
          <div className="map-canvas">
            <div className="map-road map-road-one" />
            <div className="map-road map-road-two" />
            <div className="map-block block-one" />
            <div className="map-block block-two" />
            <div className="map-point consumer-point">
              <span className="consumer-pulse" />
              <strong>You</strong>
              <small>Simulated position</small>
            </div>
            {golden ? (
              <>
                <div className="map-point drop-zone-point">
                  <span className="gold-pin">★</span>
                  <strong>
                    {proposal?.selectedDropZone?.name || "Drop Zone pending"}
                  </strong>
                  <small>Simulated discovery location</small>
                </div>
                <div className="map-point sponsor-point">
                  <span className="venue-pin">
                    <b>H</b>
                  </span>
                  <strong>{proposal?.sponsorVenue.name}</strong>
                  <small>Simulated redemption location</small>
                </div>
                <div className="gold-route" aria-hidden="true" />
              </>
            ) : (
              <div className="map-point venue-point">
                <span className="venue-pin">
                  <b>H</b>
                </span>
                <strong>Homers Café</strong>
                <small>Simulated venue</small>
              </div>
            )}
            <div
              className={`pintag-map-card ${published ? "active" : "inactive"} ${golden ? "golden" : ""}`}
            >
              <span>
                {published
                  ? golden && dropStatus === "claimed"
                    ? "Claimed"
                    : "Active now"
                  : "Inactive"}
              </span>
              <strong>
                {published
                  ? proposal.title
                  : golden
                    ? "Golden Drop awaiting publication"
                    : "Offer awaiting publication"}
              </strong>
              {golden && published && (
                <small>{proposal.sponsorshipLabel}</small>
              )}
              <small>
                {published
                  ? golden
                    ? `Find at ${proposal.selectedDropZone?.name}`
                    : `${DEMO_DISTANCE} simulated distance`
                  : "Awaiting human approval"}
              </small>
              <button type="button" onClick={onOpen} disabled={!published}>
                {published ? "Open Pintag" : "Not published"}
              </button>
            </div>
          </div>
          <div className="map-legend">
            <span>
              <i className="legend-consumer" /> Consumer
            </span>
            {golden ? (
              <>
                <span>
                  <i className="legend-gold" /> Drop Zone
                </span>
                <span>
                  <i className="legend-venue" /> Sponsor Venue
                </span>
              </>
            ) : (
              <span>
                <i className="legend-venue" /> Merchant venue
              </span>
            )}
          </div>
        </figure>
        <aside
          className={`pintag-detail-card ${golden ? "golden-detail" : ""}`}
          aria-live="polite"
        >
          {published && isOpen ? (
            golden ? (
              <GoldenDetail
                proposal={proposal}
                remainingSupply={remainingSupply}
                claim={claim}
                searchMode={searchMode}
                dropStatus={dropStatus}
                onArrive={onArrive}
                onStartSearch={onStartSearch}
                onFind={onFind}
                onClaim={onClaim}
              />
            ) : (
              <>
                <div className="detail-heading">
                  <span className="active-label">Active Pintag</span>
                  <span>{DEMO_DISTANCE} away · simulated</span>
                </div>
                <h2>{proposal.title}</h2>
                <p className="detail-description">{proposal.description}</p>
                <dl className="detail-list">
                  <div>
                    <dt>Venue</dt>
                    <dd>{proposal.venue}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>
                      {proposal.startTime}–{proposal.expirationTime}
                    </dd>
                  </div>
                  <div>
                    <dt>Reward</dt>
                    <dd>{proposal.reward}</dd>
                  </div>
                  <div>
                    <dt>Remaining</dt>
                    <dd>
                      {remainingSupply} of {proposal.rewardSupply}
                    </dd>
                  </div>
                </dl>
                <p className="simulation-disclosure">
                  Map, venue position, consumer position, and distance are
                  simulated.
                </p>
                {claim ? (
                  <ClaimConfirmation claim={claim} proposal={proposal} />
                ) : (
                  <button
                    className="primary-button claim-button"
                    type="button"
                    onClick={onClaim}
                  >
                    Claim reward
                  </button>
                )}
              </>
            )
          ) : (
            <div className="detail-empty">
              <span aria-hidden="true">03</span>
              <h2>
                {published ? "Open the active Pintag" : "No active Pintag yet"}
              </h2>
              <p>
                {published
                  ? "Select the map card to begin the clearly labeled simulated journey."
                  : "The merchant must review and publish before discovery begins."}
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function GoldenDetail({
  proposal,
  remainingSupply,
  claim,
  searchMode,
  dropStatus,
  onArrive,
  onStartSearch,
  onFind,
  onClaim,
}: {
  proposal: CampaignProposal;
  remainingSupply: number;
  claim: Claim | null;
  searchMode: SearchMode;
  dropStatus: DropStatus;
  onArrive: () => void;
  onStartSearch: () => void;
  onFind: () => void;
  onClaim: () => void;
}) {
  return (
    <>
      <div className="detail-heading">
        <span className="golden-label">Sponsored Golden Drop</span>
        <span>{dropStatus}</span>
      </div>
      <h2>{proposal.title}</h2>
      <p className="detail-description">{proposal.description}</p>
      <dl className="detail-list">
        <div>
          <dt>Find at</dt>
          <dd>{proposal.selectedDropZone?.name}</dd>
        </div>
        <div>
          <dt>Redeem at</dt>
          <dd>{proposal.sponsorVenue.name}</dd>
        </div>
        <div>
          <dt>Window</dt>
          <dd>
            {proposal.startTime}–{proposal.expirationTime}
          </dd>
        </div>
        <div>
          <dt>Reward</dt>
          <dd>{proposal.reward}</dd>
        </div>
        <div>
          <dt>Remaining</dt>
          <dd>
            {remainingSupply} of {proposal.rewardSupply}
          </dd>
        </div>
      </dl>
      <p className="simulation-disclosure">
        Simulated map and location data. No physical movement or presence is
        verified.
      </p>
      {!claim && searchMode === "locked" && (
        <div className="search-gate">
          <p>Move closer to unlock the Golden search.</p>
          <button className="primary-button" type="button" onClick={onArrive}>
            Simulate arrival at Drop Zone
          </button>
        </div>
      )}
      {!claim && searchMode === "proximity-unlocked" && (
        <div className="search-gate unlocked">
          <strong>Simulated proximity unlocked</strong>
          <p>No location or camera permission is requested.</p>
          <button
            className="primary-button"
            type="button"
            onClick={onStartSearch}
          >
            Start simulated AR search
          </button>
        </div>
      )}
      {!claim && (searchMode === "searching" || searchMode === "found") && (
        <div className="webar-panel">
          <div className="webar-heading">
            <strong>Simulated WebAR search</strong>
            <span>CSS-only · no camera access</span>
          </div>
          {searchMode === "searching" ? (
            <>
              <p>Find and tap the floating Golden Pintag.</p>
              <button
                className="floating-pintag"
                type="button"
                onClick={onFind}
                aria-label="Found Golden Pintag"
              >
                <span>★</span>
                <small>Homers Café</small>
              </button>
            </>
          ) : (
            <div className="found-state">
              <span>★</span>
              <strong>
                You found a Golden Pintag sponsored by Homers Café.
              </strong>
              <p>Reward and Sponsor Venue revealed.</p>
              <button
                className="primary-button"
                type="button"
                onClick={onClaim}
              >
                Claim Golden reward
              </button>
            </div>
          )}
        </div>
      )}
      {claim && (
        <>
          <ClaimConfirmation claim={claim} proposal={proposal} />
          <div className="late-user-state">
            <span>Public post-claim state</span>
            <strong>{LATE_USER_MESSAGE}</strong>
            <p>Sponsored by {proposal.sponsorName} · Drop status: claimed</p>
          </div>
        </>
      )}
    </>
  );
}

function ClaimConfirmation({
  claim,
  proposal,
}: {
  claim: Claim;
  proposal: CampaignProposal;
}) {
  const golden = proposal.activationType === "golden-pintag-drop";
  return (
    <div className="claim-confirmation">
      <span>
        {golden
          ? "You found the Golden Pintag. Your reward is reserved for 24 hours."
          : `Claim confirmed · ${claim.status}`}
      </span>
      <strong>{claim.code}</strong>
      <small>Reward: {proposal.reward}</small>
      <small>Redeem at: {proposal.sponsorVenue.name}</small>
      <small>
        Redemption window: {proposal.claimRedemptionWindowHours} hours ·
        simulated demo
      </small>
    </div>
  );
}

function RedemptionView({
  proposal,
  redemptionInput,
  claim,
  status,
  notice,
  onInput,
  onValidate,
}: {
  proposal: CampaignProposal | null;
  redemptionInput: string;
  claim: Claim | null;
  status: RedemptionStatus;
  notice: Notice;
  onInput: (value: string) => void;
  onValidate: () => void;
}) {
  const golden = proposal?.activationType === "golden-pintag-drop";
  return (
    <section className="view-stack" aria-labelledby="redemption-heading">
      <div className="view-intro">
        <div>
          <p className="eyebrow">Merchant staff</p>
          <h1 id="redemption-heading">Validate once. Deterministically.</h1>
        </div>
        <p className="intro-copy">
          GPT-5.6 does not participate in code validation, inventory, or
          redemption.
        </p>
      </div>
      <NoticeBanner notice={notice} />
      {golden && claim && (
        <GoldenMerchantNotification proposal={proposal} claim={claim} />
      )}
      <div className="redemption-workspace">
        <form
          className="redemption-card"
          onSubmit={(e) => {
            e.preventDefault();
            onValidate();
          }}
        >
          <div className="redemption-icon">✓</div>
          <p className="eyebrow">5 · Redeem</p>
          <h2>Enter the consumer&apos;s code</h2>
          <label htmlFor="redemption-code">Redemption code</label>
          <input
            id="redemption-code"
            value={redemptionInput}
            onChange={(e) => onInput(e.target.value.toUpperCase())}
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
            <div>
              <dt>Claim code</dt>
              <dd>{claim?.code || "Not created"}</dd>
            </div>
            <div>
              <dt>Claim status</dt>
              <dd>{claim?.status || "Not claimed"}</dd>
            </div>
            <div>
              <dt>Last validation</dt>
              <dd>{status}</dd>
            </div>
            {proposal && (
              <div>
                <dt>Redeem at</dt>
                <dd>{proposal.sponsorVenue.name}</dd>
              </div>
            )}
          </dl>
          {status === "redeemed" && proposal && (
            <p>
              <strong>Reward redeemed at: {proposal.sponsorVenue.name}</strong>
            </p>
          )}
          <p>
            Redemption is the strongest prototype signal of journey completion;
            no merchant visit is claimed before successful validation.
          </p>
        </aside>
      </div>
    </section>
  );
}

function SessionAnalytics({
  proposal,
  metrics,
  events,
  insight,
  requestState,
  onGenerateInsight,
}: {
  proposal: CampaignProposal | null;
  metrics: ReturnType<typeof calculateAnalytics>;
  events: FunnelEvent[];
  insight: InsightResponse | null;
  requestState: RequestState;
  onGenerateInsight: () => void;
}) {
  const cards = [
    ["Publications", metrics.publications],
    ["Pintag detail views", metrics.pintagViews],
    ["Claims", metrics.claims],
    ["Redemptions", metrics.redemptions],
    ["Claim-to-redemption", `${metrics.claimToRedemptionRate}%`],
    ["Remaining supply", metrics.remainingSupply],
    ["Golden searches started", metrics.goldenSearchesStarted],
    ["Golden Pintags found", metrics.goldenPintagsFound],
  ];
  return (
    <section className="analytics-section">
      <div className="analytics-heading">
        <div>
          <p className="eyebrow">6 · Measure</p>
          <h2>Prototype session events</h2>
        </div>
        <div className="analytics-actions">
          <span>{events.length} events recorded</span>
          <button
            type="button"
            onClick={onGenerateInsight}
            disabled={requestState === "loading"}
          >
            {requestState === "loading"
              ? "Generating insight…"
              : "Generate campaign insight"}
          </button>
        </div>
      </div>
      {proposal && (
        <div className="analytics-context">
          <span>Activation type: {proposal.activationType}</span>
          <span>
            Drop Zone:{" "}
            {proposal.selectedDropZone?.name ||
              "Same as Sponsor Venue / not applicable"}
          </span>
          <span>Sponsor Venue: {proposal.sponsorVenue.name}</span>
        </div>
      )}
      <div className="metrics-grid">
        {cards.map(([label, value]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
      <div className="event-strip">
        {events.length ? (
          events.map((event) => <code key={event.id}>{event.type}</code>)
        ) : (
          <p>No prototype events yet.</p>
        )}
      </div>
      {insight && (
        <div className="insight-card">
          <div className="insight-heading">
            <div>
              <span>Campaign insight</span>
              <h3>{insight.summary}</h3>
            </div>
            <strong
              className={
                insight.sourceMode === "azure-gpt-5.6" ? "live" : "fallback"
              }
            >
              {insight.sourceMode === "azure-gpt-5.6"
                ? "Generated live with GPT-5.6 through Azure OpenAI"
                : "Deterministic fallback — Azure model unavailable"}
            </strong>
          </div>
          <dl>
            <div>
              <dt>Observation</dt>
              <dd>{insight.observation}</dd>
            </div>
            <div>
              <dt>Recommendation</dt>
              <dd>{insight.recommendation}</dd>
            </div>
            <div>
              <dt>Limitation</dt>
              <dd>{insight.limitation}</dd>
            </div>
          </dl>
          <p>{insight.notice}</p>
        </div>
      )}
      {requestState === "error" && (
        <p className="insight-error">
          AI request unavailable — deterministic metrics preserved.
        </p>
      )}
    </section>
  );
}

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("Merchant");
  const [preference, setPreference] =
    useState<ActivationPreference>("recommend");
  const [merchantInput, setMerchantInput] = useState(DEMO_MERCHANT_INPUT);
  const [proposal, setProposal] = useState<CampaignProposal | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>("draft");
  const [remainingSupply, setRemainingSupply] = useState(0);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [redemptionInput, setRedemptionInput] = useState("");
  const [redemptionStatus, setRedemptionStatus] =
    useState<RedemptionStatus>("idle");
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [isPintagOpen, setIsPintagOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>("locked");
  const [dropStatus, setDropStatus] = useState<DropStatus>("draft");
  const [campaignRequestState, setCampaignRequestState] =
    useState<RequestState>("idle");
  const [campaignSourceMode, setCampaignSourceMode] =
    useState<AISourceMode | null>(null);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [insightRequestState, setInsightRequestState] =
    useState<RequestState>("idle");
  const [notices, setNotices] = useState<Record<Role, Notice>>({
    Merchant: null,
    Consumer: null,
    Redemption: null,
  });
  const analytics = useMemo(
    () => calculateAnalytics(events, remainingSupply),
    [events, remainingSupply],
  );
  const eventTypes = useMemo(
    () => new Set(events.map((event) => event.type)),
    [events],
  );
  const milestones = [
    proposal !== null,
    campaignStatus === "published",
    eventTypes.has("pintag_opened"),
    claim !== null,
    claim?.status === "redeemed",
    eventTypes.has("redemption_validated"),
  ];
  const firstIncomplete = milestones.findIndex((complete) => !complete);
  const progressSteps = [
    "Compose",
    "Publish",
    "Discover",
    "Claim",
    "Redeem",
    "Measure",
  ].map((label, index) => ({
    label,
    complete: milestones[index],
    current: index === (firstIncomplete === -1 ? 5 : firstIncomplete),
  }));

  function recordEvent(type: FunnelEventType) {
    setEvents((current) => [
      ...current,
      { id: current.length + 1, type, recordedAt: new Date().toISOString() },
    ]);
  }
  function setNotice(role: Role, notice: Notice) {
    setNotices((current) => ({ ...current, [role]: notice }));
  }
  function clearGeneratedState() {
    setProposal(null);
    setCampaignStatus("draft");
    setRemainingSupply(0);
    setClaim(null);
    setRedemptionInput("");
    setRedemptionStatus("idle");
    setEvents([]);
    setIsPintagOpen(false);
    setSearchMode("locked");
    setDropStatus("draft");
    setCampaignRequestState("idle");
    setCampaignSourceMode(null);
    setInsight(null);
    setInsightRequestState("idle");
    setNotices({ Merchant: null, Consumer: null, Redemption: null });
  }
  function changePreference(value: ActivationPreference) {
    if (campaignStatus === "published") {
      setNotice("Merchant", {
        tone: "error",
        text: "Reset the demo before changing activation mode.",
      });
      return;
    }
    setPreference(value);
    clearGeneratedState();
  }
  function usePreset(type: "real-time-offer" | "golden-pintag-drop") {
    changePreference(type);
    setMerchantInput(
      type === "golden-pintag-drop"
        ? GOLDEN_MERCHANT_INPUT
        : DEMO_MERCHANT_INPUT,
    );
  }

  async function generateCampaign() {
    if (campaignStatus === "published")
      return setNotice("Merchant", {
        tone: "error",
        text: "Reset the demo before generating another campaign.",
      });
    if (!merchantInput.trim())
      return setNotice("Merchant", {
        tone: "error",
        text: "Enter a merchant need before generating a campaign.",
      });
    const recommendation = recommendActivation(merchantInput, preference);
    const base =
      recommendation.activationType === "golden-pintag-drop"
        ? GOLDEN_CAMPAIGN
        : DEMO_CAMPAIGN;
    setCampaignRequestState("loading");
    setNotice("Merchant", {
      tone: "info",
      text: "Preparing a structured activation proposal…",
    });
    try {
      const response = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantNeed: merchantInput,
          venue: SPONSOR_VENUE.name,
          defaultSupply: base.rewardSupply,
          defaultStartTime: base.startTime,
          defaultEndTime: base.expirationTime,
          defaultRadiusMeters: base.discoveryRadius,
          activationPreference: preference,
        }),
      });
      if (!response.ok) throw new Error("Campaign request rejected");
      const result = (await response.json()) as CampaignGenerationResponse;
      const isGolden = result.activationType === "golden-pintag-drop";
      const zones = isGolden
        ? approvedDropZonesById(result.recommendedDropZoneIds)
        : [];
      setProposal({
        ...(isGolden ? GOLDEN_CAMPAIGN : DEMO_CAMPAIGN),
        activationType: result.activationType,
        activationReason: result.activationReason,
        title: result.title,
        description: result.description,
        sponsorName: result.sponsorName,
        sponsorVenue: { ...SPONSOR_VENUE, name: result.sponsorVenue },
        venue: result.sponsorVenue,
        selectedDropZone: null,
        recommendedDropZones:
          isGolden && zones.length
            ? zones
            : isGolden
              ? APPROVED_DROP_ZONES
              : [],
        claimRedemptionWindowHours: result.claimRedemptionWindowHours,
        startTime: result.startTime,
        expirationTime: result.endTime,
        rewardSupply: result.supply,
        reward: result.reward,
        discoveryRadius: result.discoveryRadiusMeters,
        primaryMetric: result.primaryMetric,
        missingInformation: result.missingInformation,
        ambiguityWarnings: result.ambiguityWarnings,
        safetyNotes: result.safetyNotes,
      });
      setCampaignStatus("review");
      setRemainingSupply(result.supply);
      setDropStatus("draft");
      setSearchMode("locked");
      setCampaignSourceMode(result.sourceMode);
      setCampaignRequestState(
        result.sourceMode === "azure-gpt-5.6" ? "success" : "fallback",
      );
      setNotice("Merchant", {
        tone: result.sourceMode === "azure-gpt-5.6" ? "success" : "info",
        text: result.notice,
      });
      recordEvent("campaign_generated");
    } catch {
      setProposal({
        ...base,
        activationReason: recommendation.activationReason,
        ambiguityWarnings: recommendation.ambiguityWarning
          ? [recommendation.ambiguityWarning]
          : base.ambiguityWarnings,
      });
      setCampaignStatus("review");
      setRemainingSupply(base.rewardSupply);
      setCampaignSourceMode("deterministic-fallback");
      setCampaignRequestState("error");
      setNotice("Merchant", {
        tone: "error",
        text: "AI request unavailable — deterministic campaign preserved",
      });
      recordEvent("campaign_generated");
    }
  }

  function publishCampaign() {
    if (!proposal) return;
    if (proposal.startTime >= proposal.expirationTime)
      return setNotice("Merchant", {
        tone: "error",
        text: "Expiration time must be later than the start time.",
      });
    if (
      proposal.activationType === "golden-pintag-drop" &&
      !canPublishGolden(proposal.selectedDropZone)
    )
      return setNotice("Merchant", {
        tone: "error",
        text: "Select one approved Drop Zone before publishing the Golden Drop.",
      });
    setCampaignStatus("published");
    setRemainingSupply(proposal.rewardSupply);
    setDropStatus(
      proposal.activationType === "golden-pintag-drop"
        ? "available"
        : "published",
    );
    setNotice("Merchant", {
      tone: "success",
      text: "Campaign approved and published to the simulated map.",
    });
    recordEvent("campaign_published");
  }
  function openPintag() {
    if (campaignStatus !== "published")
      return setNotice("Consumer", {
        tone: "error",
        text: "This Pintag is inactive until the merchant publishes it.",
      });
    if (!isPintagOpen) recordEvent("pintag_opened");
    setIsPintagOpen(true);
    setNotice("Consumer", {
      tone: "info",
      text: "Pintag details opened using simulated spatial data.",
    });
  }
  function currentGoldenState(): GoldenDemoState {
    return {
      campaignStatus,
      remainingSupply,
      claim,
      redemptionStatus,
      dropStatus,
      searchMode,
      selectedDropZone: proposal?.selectedDropZone || null,
      rewardClaimedByCurrentSession: Boolean(claim),
      rewardAvailabilityStatus: remainingSupply > 0 ? "available" : "claimed",
    };
  }
  function simulateArrival() {
    const next = unlockGoldenProximity(currentGoldenState());
    if (next.searchMode === "proximity-unlocked") {
      setSearchMode(next.searchMode);
      setNotice("Consumer", {
        tone: "success",
        text: "Simulated proximity unlocked",
      });
      recordEvent("drop_zone_arrival_simulated");
    }
  }
  function beginSearch() {
    const next = startGoldenSearch(currentGoldenState());
    if (next.searchMode === "searching") {
      setSearchMode(next.searchMode);
      recordEvent("golden_search_started");
    }
  }
  function findGolden() {
    const next = findGoldenPintag(currentGoldenState());
    if (next.searchMode === "found") {
      setSearchMode(next.searchMode);
      setNotice("Consumer", {
        tone: "success",
        text: "You found a Golden Pintag sponsored by Homers Café.",
      });
      recordEvent("golden_pintag_found");
    }
  }
  function claimReward() {
    if (!proposal) return;
    const result =
      proposal.activationType === "golden-pintag-drop"
        ? attemptGoldenClaim(currentGoldenState())
        : attemptClaim({
            campaignStatus,
            remainingSupply,
            claim,
            redemptionStatus,
          });
    setRemainingSupply(result.state.remainingSupply);
    setClaim(result.state.claim);
    setRedemptionStatus(result.state.redemptionStatus);
    if (proposal.activationType === "golden-pintag-drop") {
      const goldenState = result.state as GoldenDemoState;
      setDropStatus(goldenState.dropStatus);
    }
    setNotice("Consumer", {
      tone: result.ok ? "success" : "error",
      text: result.message,
    });
    if (result.ok && result.state.claim) {
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
    setNotice("Redemption", {
      tone: result.ok ? "success" : "error",
      text: result.message,
    });
    recordEvent(result.ok ? "redemption_validated" : "redemption_rejected");
  }
  async function generateInsight() {
    setInsightRequestState("loading");
    try {
      const response = await fetch("/api/generate-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activationType: proposal?.activationType || "real-time-offer",
          dropZone: proposal?.selectedDropZone?.name || null,
          sponsorVenue: proposal?.sponsorVenue.name || SPONSOR_VENUE.name,
          searchesStarted: analytics.goldenSearchesStarted,
          goldenPintagsFound: analytics.goldenPintagsFound,
          publications: analytics.publications,
          detailViews: analytics.pintagViews,
          claims: analytics.claims,
          redemptions: analytics.redemptions,
          remainingSupply: analytics.remainingSupply,
          claimToRedemptionRate: analytics.claimToRedemptionRate,
          includesSimulatedData: true,
        }),
      });
      if (!response.ok) throw new Error("Insight rejected");
      const result = (await response.json()) as InsightResponse;
      setInsight(result);
      setInsightRequestState(
        result.sourceMode === "azure-gpt-5.6" ? "success" : "fallback",
      );
    } catch {
      setInsightRequestState("error");
    }
  }
  function resetDemo() {
    setActiveRole("Merchant");
    setPreference("recommend");
    setMerchantInput(DEMO_MERCHANT_INPUT);
    clearGeneratedState();
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#main-content">
          <span className="brand-mark">P</span>
          <span>
            <strong>PINTAG</strong>
            <small>Spatial Campaign Copilot</small>
          </span>
        </a>
        <div className="event-meta">
          <span>OpenAI Build Week 2026</span>
          <span className="meta-divider" />
          <span>Work &amp; Productivity</span>
          <strong className="demo-badge">Demo prototype</strong>
          <button className="reset-button" type="button" onClick={resetDemo}>
            Reset demo
          </button>
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
            preference={preference}
            merchantInput={merchantInput}
            proposal={proposal}
            status={campaignStatus}
            remainingSupply={remainingSupply}
            notice={notices.Merchant}
            requestState={campaignRequestState}
            sourceMode={campaignSourceMode}
            claim={claim}
            onPreference={changePreference}
            onPreset={usePreset}
            onInput={setMerchantInput}
            onGenerate={generateCampaign}
            onProposal={setProposal}
            onPublish={publishCampaign}
          />
        )}
        {activeRole === "Consumer" && (
          <ConsumerView
            proposal={proposal}
            status={campaignStatus}
            remainingSupply={remainingSupply}
            isOpen={isPintagOpen}
            claim={claim}
            searchMode={searchMode}
            dropStatus={dropStatus}
            notice={notices.Consumer}
            onOpen={openPintag}
            onArrive={simulateArrival}
            onStartSearch={beginSearch}
            onFind={findGolden}
            onClaim={claimReward}
          />
        )}
        {activeRole === "Redemption" && (
          <RedemptionView
            proposal={proposal}
            redemptionInput={redemptionInput}
            claim={claim}
            status={redemptionStatus}
            notice={notices.Redemption}
            onInput={setRedemptionInput}
            onValidate={redeemClaim}
          />
        )}
      </main>
      <SessionAnalytics
        proposal={proposal}
        metrics={analytics}
        events={events}
        insight={insight}
        requestState={insightRequestState}
        onGenerateInsight={generateInsight}
      />
      <footer className="site-footer">
        <p>
          Independent Build Week prototype · Separate from the contractual
          PINTAG MVP
        </p>
        <p>
          Simulated identities, map, movement, proximity, and WebAR · Optional
          server-side Azure OpenAI
        </p>
      </footer>
    </div>
  );
}
