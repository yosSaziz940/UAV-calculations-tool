import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SectionK = ({
  flightsBase = {},
  flightsUpperSource = {},
  uavsBase = {},
  uavsUpperSource = {},
}) => {
  const safe = (v) => (isFinite(v) ? v : 0);

  const roundDownExcel = (value) => {
    value = safe(value);
    if (value <= 0) return 0;
    const power = Math.floor(Math.log10(value * 4));
    const magnitude = Math.pow(10, power) / 4;
    return Math.floor(value / magnitude) * magnitude;
  };

  const roundUpExcel = (value) => {
    value = safe(value);
    if (value <= 0) return 0;
    const power = Math.floor(Math.log10(value));
    const magnitude = Math.pow(10, power) / 4;
    return Math.ceil(value / magnitude) * magnitude;
  };

  const generateTable = (base = {}, upperSrc = {}) => {
    const lower = {
      small: roundDownExcel(safe(base.small)),
      medium: roundDownExcel(safe(base.medium)),
      large: roundDownExcel(safe(base.large)),
    };
    const upper = {
      small: roundUpExcel(safe(upperSrc.small)),
      medium: roundUpExcel(safe(upperSrc.medium)),
      large: roundUpExcel(safe(upperSrc.large)),
    };

    const range = {
      small: upper.small - lower.small,
      medium: upper.medium - lower.medium,
      large: upper.large - lower.large,
    };

    const steps = [
      { label: "Lower Bound", frac: 0 },
      { label: "+10%", frac: 0.1 },
      { label: "+20%", frac: 0.2 },
      { label: "+50%", frac: 0.5 },
      { label: "Upper Bound", frac: 1 },
    ];

    return steps.map(({ label, frac }) => {
      const small = lower.small + frac * range.small;
      const medium = lower.medium + frac * range.medium;
      const large = lower.large + frac * range.large;
      return {
        label,
        small: Math.round(small),
        medium: Math.round(medium),
        large: Math.round(large),
        total: Math.round(small + medium + large),
      };
    });
  };

  // ✅ Directly compute rows (no useMemo)
  const flightsRows = generateTable(flightsBase, flightsUpperSource);
  const uavsRows = generateTable(uavsBase, uavsUpperSource);

  const fmt = (n) => (isFinite(n) ? n.toLocaleString() : "-");

  const renderTable = (title, rows) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "right",
          border: "1px solid #ddd",
        }}
      >
        <thead style={{ background: "#f9f9f9" }}>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Category</th>
            <th style={{ padding: 8 }}>Small Recreational</th>
            <th style={{ padding: 8 }}>Medium Commercial</th>
            <th style={{ padding: 8 }}>Large Urban Mobility</th>
            <th style={{ padding: 8 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderTop: "1px solid #eee" }}>
              <td style={{ textAlign: "left", padding: 8, fontWeight: 600 }}>
                {r.label}
              </td>
              <td style={{ padding: 8 }}>{fmt(r.small)}</td>
              <td style={{ padding: 8 }}>{fmt(r.medium)}</td>
              <td style={{ padding: 8 }}>{fmt(r.large)}</td>
              <td style={{ padding: 8, fontWeight: 700, background: "#fafafa" }}>
                {fmt(r.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderChart = (title, data) => (
    <div style={{ width: "48%", minWidth: 300, height: 300 }}>
      <h3 style={{ textAlign: "center", marginBottom: 8 }}>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 40, left: 30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString()} />
          <Legend />
          <Line type="monotone" dataKey="small" stroke="#cccccc" name="Small Recreational" />
          <Line type="monotone" dataKey="medium" stroke="#d85c1a" name="Medium Commercial" />
          <Line type="monotone" dataKey="large" stroke="#3b82f6" name="Large Urban Mobility" />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#000000"
            strokeDasharray="3 3"
            name="Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>K. Chart Calculations</h2>

      {/* --- Tables --- */}
      {renderTable("Annual Flights", flightsRows)}
      {renderTable("Annual UAVs", uavsRows)}

      {/* --- Charts --- */}
      <h2 style={{ textAlign: "center", marginTop: 40 }}>Results</h2>
      <p style={{ textAlign: "center", fontStyle: "italic" }}>
        Volume Estimates for Year 2049
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        {renderChart("Annual Flights", flightsRows)}
        {renderChart("Annual UAVs", uavsRows)}
      </div>
    </div>
  );
};

export default SectionK;
