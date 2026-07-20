"use client";

import { useState } from "react";

const merchantPrompt =
  "We have eight fresh desserts available and low foot traffic between 3:00 PM and 5:00 PM. We want to attract nearby customers without using misleading urgency.";

const roles = ["Merchant", "Consumer", "Redemption"] as const;
type Role = (typeof roles)[number];

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function MerchantView() {
  const [prompt, setPrompt] = useState(merchantPrompt);
  const [hasRequested, setHasRequested] = useState(false);

  return (
    <section className="view-grid" aria-labelledby="merchant-heading">
      <div className="intro-panel">
        <p className="eyebrow">Merchant workspace</p>
        <h1 id="merchant-heading">Turn a local need into a spatial campaign.</h1>
        <p className="intro-copy">
          Describe the opportunity in plain language. The copilot will propose a
          place-bound, time-bound campaign for your review before anything can
          be published.
        </p>

        <article className="problem-card">
          <div className="problem-marker" aria-hidden="true">
            01
          </div>
          <div>
            <p className="card-label">Today&apos;s opportunity</p>
            <h2>Fresh inventory, quiet afternoon</h2>
            <p>
              Eight desserts are available during a low-traffic window. The
              goal is to invite nearby customers without manufactured urgency.
            </p>
          </div>
        </article>
      </div>

      <div className="composer-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Campaign composer</p>
            <h2>What does your business need?</h2>
          </div>
          <span className="step-pill">Step 1 of 3</span>
        </div>

        <label className="sr-only" htmlFor="merchant-need">
          Merchant business need
        </label>
        <textarea
          id="merchant-need"
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            setHasRequested(false);
          }}
          rows={7}
        />

        <div className="composer-footer">
          <p>{prompt.length} characters</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => setHasRequested(true)}
          >
            Generate spatial campaign <ArrowIcon />
          </button>
        </div>

        <aside className="integration-note" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>
              {hasRequested
                ? "Campaign generation is not connected yet"
                : "GPT-5.6 integration comes next"}
            </strong>
            <p>
              This foundation does not generate a fake response. The next build
              step will add structured GPT-5.6 output and a human review gate.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ConsumerView() {
  return (
    <section className="consumer-layout" aria-labelledby="consumer-heading">
      <div className="consumer-copy">
        <p className="eyebrow">Consumer discovery</p>
        <h1 id="consumer-heading">A clear view of what is nearby.</h1>
        <p className="intro-copy">
          This interface demonstrates spatial discovery without requesting a
          real location or connecting to an external map service.
        </p>

        <div className="disclosure-card">
          <span className="status-dot" aria-hidden="true" />
          <p>
            Venue, consumer position, distance, and map geometry are simulated
            for the Build Week demo.
          </p>
        </div>
      </div>

      <figure className="map-card" aria-labelledby="map-title">
        <figcaption className="map-header">
          <div>
            <p className="eyebrow">Spatial preview</p>
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
            <span className="venue-pin" aria-hidden="true">P</span>
            <strong>Casa Dulce</strong>
            <small>Simulated venue</small>
          </div>

          <div className="pintag-placeholder">
            <span>Inactive</span>
            <strong>Afternoon dessert Pintag</strong>
            <small>Awaiting merchant publication</small>
          </div>
        </div>

        <div className="map-legend" aria-label="Map legend">
          <span><i className="legend-consumer" /> Consumer</span>
          <span><i className="legend-venue" /> Venue</span>
          <span><i className="legend-pintag" /> Inactive Pintag</span>
        </div>
      </figure>
    </section>
  );
}

function RedemptionView() {
  return (
    <section className="redemption-layout" aria-labelledby="redemption-heading">
      <div className="redemption-copy">
        <p className="eyebrow">Merchant staff</p>
        <h1 id="redemption-heading">Redeem with confidence.</h1>
        <p className="intro-copy">
          Redemption will use deterministic rules for code validity,
          expiration, and single use—not an AI decision.
        </p>
      </div>

      <div className="redemption-card">
        <div className="redemption-icon" aria-hidden="true">✓</div>
        <p className="eyebrow">Redemption terminal</p>
        <h2>Enter the consumer&apos;s code</h2>
        <p className="helper-text">
          Code validation is intentionally unavailable in this foundation.
        </p>

        <label htmlFor="redemption-code">Redemption code</label>
        <input
          id="redemption-code"
          name="redemption-code"
          type="text"
          placeholder="PINTAG-0000"
          autoComplete="off"
          aria-describedby="redemption-notice"
        />
        <button className="disabled-button" type="button" disabled>
          Validate redemption
        </button>

        <p id="redemption-notice" className="redemption-notice">
          Deterministic redemption logic will be added next. No code is being
          checked or stored yet.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("Merchant");

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="PINTAG home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>
            <strong>PINTAG</strong>
            <small>Spatial Campaign Copilot</small>
          </span>
        </a>

        <div className="event-meta" aria-label="Project information">
          <span>OpenAI Build Week 2026</span>
          <span className="meta-divider" aria-hidden="true" />
          <span>Work &amp; Productivity</span>
          <strong className="demo-badge">Demo prototype</strong>
        </div>
      </header>

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
        {activeRole === "Merchant" && <MerchantView />}
        {activeRole === "Consumer" && <ConsumerView />}
        {activeRole === "Redemption" && <RedemptionView />}
      </main>

      <footer className="site-footer">
        <p>
          Independent Build Week prototype · Separate from the contractual
          PINTAG MVP
        </p>
        <p>Simulated identities and location data</p>
      </footer>
    </div>
  );
}
