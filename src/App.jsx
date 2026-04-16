import React, { useEffect, useState } from "react";
import GainsCard from "./components/GainsCard";
import HoldingsTable from "./components/HoldingsTable";
import { useHarvesting } from "./hooks/useHarvesting";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const {
    gainsData,
    afterGains,
    holdings,
    selected,
    loading,
    error,
    savings,
    toggleHolding,
    toggleAll,
  } = useHarvesting();

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className="app" data-theme={theme}>
      <header className="brand-bar">
        <div className="brand-inner">
          <img className="brand-logo" src="/logo.png" alt="KoinX" />
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
          >
            <span className="theme-toggle-icon" aria-hidden="true">{isDark ? "☀" : "☾"}</span>
          </button>
        </div>
      </header>
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">Tax Harvesting</h1>
          <span className="app-help-wrap">
            <button className="app-help" type="button">How it works?</button>
            <span className="app-help-tooltip" role="tooltip">
              <span>See your capital gains for FY 2024-25 in the left card</span>
              <span>Check boxes for assets you plan on selling to reduce your tax liability</span>
              <span>Instantly see your updated tax liability in the right card</span>
              <strong>Pro tip:</strong> Experiment with different combinations of your holdings to optimize your tax liability
            </span>
          </span>
        </div>

        <details className="app-banner">
          <summary className="app-banner-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Important Notes & Disclaimers
            <span className="app-banner-chevron" aria-hidden="true">⌄</span>
          </summary>
          <ul>
            <li>Tax loss harvesting is only allowed under tax regulations. Please consult your tax advisor before making any decisions.</li>
            <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income.</li>
            <li>Price and market value data is fetched from CoinGecko and may differ slightly from your exchange.</li>
            <li>Some countries do not have short-term / long-term bifurcation. For now, we calculate everything as long-term.</li>
            <li>Only realised losses are considered for harvesting. Unrealised losses in held assets are not counted.</li>
          </ul>
        </details>

        {loading ? (
          <div className="cards-grid">
            {[0, 1].map((i) => (
              <div key={i} className="card-skeleton">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="skeleton" style={{ height: 13, marginBottom: 12, width: j === 0 ? "60%" : "100%" }} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          gainsData && afterGains && (
            <div className="cards-grid">
              <GainsCard
                title="Pre Harvesting"
                stcg={gainsData.stcg}
                ltcg={gainsData.ltcg}
                isAfter={false}
                savings={null}
              />
              <GainsCard
                title="After Harvesting"
                stcg={afterGains.stcg}
                ltcg={afterGains.ltcg}
                isAfter={true}
                savings={savings}
              />
            </div>
          )
        )}

        {error && (
          <div className="app-error">Failed to load data: {error}</div>
        )}

        <HoldingsTable
          holdings={holdings}
          selected={selected}
          onToggle={toggleHolding}
          onToggleAll={toggleAll}
          loading={loading}
        />
      </div>
    </div>
  );
}
