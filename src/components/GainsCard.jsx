import React from "react";
import { fmt, fmtFull, gainColor, gainSign } from "../utils/format";
import "./GainsCard.css";

const GainValue = ({ value, className = "" }) => (
  <span
    className={`gains-value value-tip ${className}`}
    style={{ color: gainColor(value) }}
    data-tooltip={`${gainSign(value)}${fmtFull(value)}`}
  >
    {gainSign(value)}{fmt(value)}
  </span>
);

export default function GainsCard({ title, stcg, ltcg, isAfter, savings }) {
  const stcgNet = stcg.profits - stcg.losses;
  const ltcgNet = ltcg.profits - ltcg.losses;
  const realised = stcgNet + ltcgNet;

  return (
    <div className={`gains-card ${isAfter ? "gains-card--after" : "gains-card--pre"}`}>
      <h2 className="gains-card-title">{title}</h2>

      <div className="gains-grid" aria-label={`${title} capital gains`}>
        <span />
        <span className="gains-col-head">Short-term</span>
        <span className="gains-col-head">Long-term</span>

        <span className="gains-row-label">Profits</span>
        <GainValue value={stcg.profits} />
        <GainValue value={ltcg.profits} />

        <span className="gains-row-label">Losses</span>
        <GainValue value={-stcg.losses} />
        <GainValue value={-ltcg.losses} />

        <span className="gains-row-label gains-net-label">Net Capital Gains</span>
        <GainValue value={stcgNet} />
        <GainValue value={ltcgNet} />
      </div>

      <div className="gains-total">
        <span>{isAfter ? "Effective Capital Gains:" : "Realised Capital Gains:"}</span>
        <GainValue value={realised} className="gains-total-value" />
      </div>

      {isAfter && savings > 0 && (
        <div className="gains-savings-msg">
          🎉 You are going to save upto <strong className="value-tip" data-tooltip={fmtFull(savings)}>{fmt(savings)}</strong>
        </div>
      )}
    </div>
  );
}
