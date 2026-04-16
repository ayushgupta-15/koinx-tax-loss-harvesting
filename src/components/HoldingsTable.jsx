import React, { useState } from "react";
import { fmt, fmtFull, fmtNum, fmtNumFull, gainColor, gainSign } from "../utils/format";
import "./HoldingsTable.css";

const DEFAULT_ROWS = 4;

const Skeleton = ({ style = {} }) => (
  <div className="skeleton" style={style} />
);

export default function HoldingsTable({ holdings, selected, onToggle, onToggleAll, loading }) {
  const [showAll, setShowAll] = useState(false);
  const [sort, setSort] = useState(null);
  const allSelected = holdings.length > 0 && holdings.every((h) => selected.has(h._id));
  const someSelected = holdings.some((h) => selected.has(h._id)) && !allSelected;
  const sortedHoldings = sort
    ? [...holdings].sort((a, b) => {
        const aGain = sort.key === "stcg" ? a.stcg.gain : a.ltcg.gain;
        const bGain = sort.key === "stcg" ? b.stcg.gain : b.ltcg.gain;
        return sort.direction === "asc" ? aGain - bGain : bGain - aGain;
      })
    : holdings;
  const displayed = showAll ? sortedHoldings : sortedHoldings.slice(0, DEFAULT_ROWS);

  const toggleSort = (key) => {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: "desc" };
      return { key, direction: current.direction === "desc" ? "asc" : "desc" };
    });
  };

  const sortIcon = (key) => {
    if (sort?.key !== key) return "";
    return sort.direction === "asc" ? "▲" : "▼";
  };

  return (
    <section className="ht-wrapper" id="holdings">
      <div className="ht-header">
        <div className="ht-header-left">
          <span className="ht-title">Holdings</span>
        </div>
      </div>

      <div className="ht-assets">
        <div className="ht-scroll">
          <table className="ht-table">
            <thead>
              <tr>
                <th className="ht-th ht-th-check">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={(e) => onToggleAll(e.target.checked)}
                    className="ht-checkbox"
                  />
                </th>
                <th className="ht-th ht-th-left">Asset</th>
                <th className="ht-th ht-th-right">Holdings<br /><span>Avg Buy Price</span></th>
                <th className="ht-th ht-th-right">Current Price</th>
                <th className="ht-th ht-th-right">Total Current Value</th>
                <th className="ht-th ht-th-right">
                  <button
                    className="ht-sort-btn"
                    type="button"
                    onClick={() => toggleSort("stcg")}
                    aria-label={`Sort short-term gains ${sort?.key === "stcg" && sort.direction === "desc" ? "ascending" : "descending"}`}
                  >
                    Short-term <span aria-hidden="true">{sortIcon("stcg")}</span>
                  </button>
                </th>
                <th className="ht-th ht-th-right">
                  <button
                    className="ht-sort-btn"
                    type="button"
                    onClick={() => toggleSort("ltcg")}
                    aria-label={`Sort long-term gains ${sort?.key === "ltcg" && sort.direction === "desc" ? "ascending" : "descending"}`}
                  >
                    Long-term <span aria-hidden="true">{sortIcon("ltcg")}</span>
                  </button>
                </th>
                <th className="ht-th ht-th-right">Amount to Sell</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: DEFAULT_ROWS }).map((_, i) => (
                    <tr key={i} className="ht-tr">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="ht-td">
                          <Skeleton style={{ height: 13, borderRadius: 4 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : displayed.map((h) => {
                    const sel = selected.has(h._id);
                    return (
                      <tr
                        key={h._id}
                        className={`ht-tr ${sel ? "ht-tr--selected" : ""}`}
                        onClick={() => onToggle(h._id)}
                      >
                        <td className="ht-td ht-td-check">
                          <input
                            type="checkbox"
                            checked={sel}
                            onChange={() => onToggle(h._id)}
                            onClick={(e) => e.stopPropagation()}
                            className="ht-checkbox"
                          />
                        </td>
                        <td className="ht-td">
                          <div className="ht-asset">
                            <img
                              src={h.logo}
                              alt={h.coin}
                              className="ht-logo"
                              onError={(e) => {
                                e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='16' cy='16' r='16' fill='%231e2a3a'/><text x='16' y='21' text-anchor='middle' font-size='11' fill='%2394a3b8' font-family='sans-serif'>${encodeURIComponent(h.coin.slice(0, 2))}</text></svg>`;
                              }}
                            />
                            <div>
                              <div className="ht-coin">{h.coin}</div>
                              <div className="ht-coin-name">{h.coinName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="ht-td ht-td-right">
                          <div className="ht-sm value-tip" data-tooltip={`${fmtNumFull(h.totalHolding)} ${h.coin}`}>
                            {fmtNum(h.totalHolding)} {h.coin}
                          </div>
                          <div className="ht-muted value-tip" data-tooltip={`${fmtFull(h.averageBuyPrice)}/${h.coin}`}>
                            {fmt(h.averageBuyPrice)}/{h.coin}
                          </div>
                        </td>
                        <td className="ht-td ht-td-right ht-sm">
                          <span className="value-tip" data-tooltip={fmtFull(h.currentPrice)}>{fmt(h.currentPrice)}</span>
                        </td>
                        <td className="ht-td ht-td-right">
                          <div className="ht-sm value-tip" data-tooltip={fmtFull(h.currentPrice * h.totalHolding)}>
                            {fmt(h.currentPrice * h.totalHolding)}
                          </div>
                        </td>
                        <td className="ht-td ht-td-right">
                          <div
                            className="ht-sm ht-gain value-tip"
                            style={{ color: gainColor(h.stcg.gain) }}
                            data-tooltip={`${gainSign(h.stcg.gain)}${fmtFull(h.stcg.gain)}`}
                          >
                            {gainSign(h.stcg.gain)}{fmt(h.stcg.gain)}
                          </div>
                          <div className="ht-muted value-tip" data-tooltip={`${fmtNumFull(h.stcg.balance)} ${h.coin}`}>
                            {fmtNum(h.stcg.balance)} {h.coin}
                          </div>
                        </td>
                        <td className="ht-td ht-td-right">
                          <div
                            className="ht-sm ht-gain value-tip"
                            style={{ color: gainColor(h.ltcg.gain) }}
                            data-tooltip={`${gainSign(h.ltcg.gain)}${fmtFull(h.ltcg.gain)}`}
                          >
                            {gainSign(h.ltcg.gain)}{fmt(h.ltcg.gain)}
                          </div>
                          <div className="ht-muted value-tip" data-tooltip={`${fmtNumFull(h.ltcg.balance)} ${h.coin}`}>
                            {fmtNum(h.ltcg.balance)} {h.coin}
                          </div>
                        </td>
                        <td
                          className="ht-td ht-td-right ht-sm"
                          style={{ color: sel ? "var(--text)" : "var(--text3)" }}
                        >
                          {sel ? (
                            <span className="value-tip" data-tooltip={`${fmtNumFull(h.totalHolding)} ${h.coin}`}>
                              {fmtNum(h.totalHolding)} {h.coin}
                            </span>
                          ) : "-"}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && holdings.length > DEFAULT_ROWS && (
        <div className="ht-footer">
          <button className="ht-view-btn" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show less" : "View all"}
          </button>
        </div>
      )}
    </section>
  );
}
