const compact = (n, dec = 2) => {
  const abs = Math.abs(n);
  const unit = abs >= 1_000_000 ? "M" : abs >= 1_000 ? "K" : "";
  const divisor = unit === "M" ? 1_000_000 : unit === "K" ? 1_000 : 1;
  const value = n / divisor;

  return (
    value.toLocaleString("en-IN", {
      minimumFractionDigits: unit ? 0 : dec,
      maximumFractionDigits: unit ? dec : dec,
    }).replace(/\.00$/, "") + unit
  );
};

export const fmt = (n, dec = 2) => {
  if (n === null || n === undefined) return "—";
  const abs = Math.abs(n);
  if (abs < 0.01 && abs > 0) return n > 0 ? "<₹0.01" : ">-₹0.01";
  return "₹" + compact(n, dec);
};

export const fmtFull = (n, dec = 2) => {
  if (n === null || n === undefined) return "—";
  return (
    "₹" +
    n.toLocaleString("en-IN", {
      minimumFractionDigits: dec,
      maximumFractionDigits: 20,
    })
  );
};

export const fmtNum = (n) => {
  if (Math.abs(n) < 1e-10) return "~0";
  if (Math.abs(n) >= 1_000) return compact(n, 2);
  return n.toLocaleString("en-IN", { maximumSignificantDigits: 4 });
};

export const fmtNumFull = (n) => {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 20 });
};

export const gainColor = (g) =>
  g > 0 ? "#22c55e" : g < 0 ? "#ef4444" : "#94a3b8";

export const gainSign = (g) => (g > 0 ? "+" : "");
