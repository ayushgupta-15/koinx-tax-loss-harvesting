import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchCapitalGains, fetchHoldings } from "../api/mockApi";

export function useHarvesting() {
  const [gainsData, setGainsData] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCapitalGains(), fetchHoldings()])
      .then(([g, h]) => {
        setGainsData(g.capitalGains);
        // Sort by absolute total gain descending
        const sorted = [...h].sort(
          (a, b) =>
            Math.abs(b.stcg.gain + b.ltcg.gain) -
            Math.abs(a.stcg.gain + a.ltcg.gain)
        );
        setHoldings(sorted);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const afterGains = useMemo(() => {
    if (!gainsData) return null;
    let stcgP = gainsData.stcg.profits;
    let stcgL = gainsData.stcg.losses;
    let ltcgP = gainsData.ltcg.profits;
    let ltcgL = gainsData.ltcg.losses;

    holdings.forEach((h) => {
      if (!selected.has(h._id)) return;
      if (h.stcg.gain > 0) stcgP += h.stcg.gain;
      else if (h.stcg.gain < 0) stcgL += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) ltcgP += h.ltcg.gain;
      else if (h.ltcg.gain < 0) ltcgL += Math.abs(h.ltcg.gain);
    });

    return {
      stcg: { profits: stcgP, losses: stcgL },
      ltcg: { profits: ltcgP, losses: ltcgL },
    };
  }, [gainsData, holdings, selected]);

  const preRealised = gainsData
    ? gainsData.stcg.profits - gainsData.stcg.losses + (gainsData.ltcg.profits - gainsData.ltcg.losses)
    : 0;
  const postRealised = afterGains
    ? afterGains.stcg.profits - afterGains.stcg.losses + (afterGains.ltcg.profits - afterGains.ltcg.losses)
    : 0;
  const savings = preRealised > postRealised ? preRealised - postRealised : null;

  const toggleHolding = useCallback((id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }, []);

  const toggleAll = useCallback(
    (checked) => {
      setSelected(checked ? new Set(holdings.map((h) => h._id)) : new Set());
    },
    [holdings]
  );

  return {
    gainsData,
    afterGains,
    holdings,
    selected,
    loading,
    error,
    savings,
    toggleHolding,
    toggleAll,
  };
}
