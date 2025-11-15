import React, { useState } from "react";

export default function SectionJ() {
  const initial = [
    { key: "recreational", name: "Recreational Use", small: 1.0, medium: 0.0, lowerFlights: 917280, upperFlights: 2076360, flightsPerUAV: 24 },
    { key: "commercial", name: "Commercial Delivery", small: 0.0, medium: 1.0, lowerFlights: 9525600, upperFlights: 23814000, flightsPerUAV: 240 },
    { key: "urban", name: "Urban Air Mobility", small: 0.0, medium: 0.0, lowerFlights: 23400000, upperFlights: 253500000, flightsPerUAV: 6000 },
    { key: "agriculture", name: "Agriculture", small: 0.5, medium: 0.5, lowerFlights: 6, upperFlights: 56, flightsPerUAV: 11 },
    { key: "linear", name: "Linear Inspection", small: 0.8, medium: 0.2, lowerFlights: 33, upperFlights: 333, flightsPerUAV: 83 },
    { key: "structure", name: "Structure Inspection", small: 0.8, medium: 0.2, lowerFlights: 20763, upperFlights: 207628, flightsPerUAV: 655 },
    { key: "emergency", name: "Emergency Response", small: 0.5, medium: 0.4, lowerFlights: 18100, upperFlights: 181000, flightsPerUAV: 236 },
  ];

  const [rows] = useState(initial);
  const [otherFraction] = useState(0.001);

  // const updateCell = (index, field, value) => {
  //   setRows(prev => {
  //     const copy = prev.map(r => ({ ...r }));
  //     copy[index][field] = value === "" ? "" : Number(value);
  //     return copy;
  //   });
  // };

  const computeLarge = (small, medium) => 1 - (Number(small || 0) + Number(medium || 0));
  const fmt = v => (v == null || Number.isNaN(v) ? "—" : Math.round(v * 100) / 100);

  // First table: distributions Small/Medium/Large + Other
  const computeDistributions = () => {
    const data = rows.map(r => ({
      ...r,
      large: computeLarge(r.small, r.medium),
      total: r.small + r.medium + computeLarge(r.small, r.medium)
    }));

    const avgSmall = rows.reduce((sum, r) => sum + r.small, 0) / rows.length;
    const avgMedium = rows.reduce((sum, r) => sum + r.medium, 0) / rows.length;
    const avgLarge = 1 - (avgSmall + avgMedium);

    const other = { key: "other", name: "Other (average)", small: avgSmall, medium: avgMedium, large: avgLarge, total: 1 };
    return [...data, other];
  };

  const distributions = computeDistributions();

  // Flights
  const computeFlights = (type) => {
    const key = type === "lower" ? "lowerFlights" : "upperFlights";
    const flights = rows.map(r => ({
      ...r,
      small: r[key] * r.small,
      medium: r[key] * r.medium,
      large: r[key] * computeLarge(r.small, r.medium),
      total: r[key]
    }));

    const avgSmall = rows.reduce((sum, r) => sum + r.small, 0) / rows.length;
    const avgMedium = rows.reduce((sum, r) => sum + r.medium, 0) / rows.length;
    const avgLarge = 1 - (avgSmall + avgMedium);

    const totalFlights = flights.reduce((sum, r) => sum + r.total, 0);
    const otherTotal = otherFraction * totalFlights / (1 - otherFraction);

    const other = {
      key: "other",
      name: "Other",
      small: avgSmall * otherTotal,
      medium: avgMedium * otherTotal,
      large: avgLarge * otherTotal,
      total: otherTotal
    };

    return [...flights, other];
  };

  const lowerFlights = computeFlights("lower");
  const upperFlights = computeFlights("upper");

  const G357 = 1036; // fixed for Other UAVs

  // UAVs LOWER
  const uavsLower = lowerFlights.map(r => {
    if (r.key === "other") {
      return { key: r.key, name: r.name, small: r.small / G357, medium: r.medium / G357, large: r.large / G357, total: (r.small + r.medium + r.large) / G357 };
    } else {
      return { key: r.key, name: r.name, small: r.small / r.flightsPerUAV, medium: r.medium / r.flightsPerUAV, large: r.large / r.flightsPerUAV, total: (r.small + r.medium + r.large) / r.flightsPerUAV };
    }
  });

  // UAVs UPPER
  const uavsUpper = upperFlights.map(r => {
    if (r.key === "other") {
      return { key: r.key, name: r.name, small: r.small / G357, medium: r.medium / G357, large: r.large / G357, total: (r.small + r.medium + r.large) / G357 };
    } else {
      return { key: r.key, name: r.name, small: r.small / r.flightsPerUAV, medium: r.medium / r.flightsPerUAV, large: r.large / r.flightsPerUAV, total: (r.small + r.medium + r.large) / r.flightsPerUAV };
    }
  });

  const sumRow = (arr, prop) => arr.reduce((sum, r) => sum + r[prop], 0);

  // const totals = (arr) => ({ small: sumRow(arr, "small"), medium: sumRow(arr, "medium"), large: sumRow(arr, "large"), total: sumRow(arr, "total") });

  const renderTable = (title, data, showTotals = true) => (
    <>
      <h3 className="font-semibold mb-1">{title}</h3>
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100"><th>Category</th><th>Small</th><th>Medium</th><th>Large</th><th>Total</th></tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.key} className={r.key==="other"?"bg-gray-50 font-semibold":""}>
              <td>{r.name}</td>
              <td>{fmt(r.small)}</td>
              <td>{fmt(r.medium)}</td>
              <td>{fmt(r.large)}</td>
              <td>{fmt(r.total)}</td>
            </tr>
          ))}
          {showTotals &&
            <tr className="font-bold bg-gray-100">
              <td>Totals</td>
              <td>{fmt(sumRow(data, "small"))}</td>
              <td>{fmt(sumRow(data, "medium"))}</td>
              <td>{fmt(sumRow(data, "large"))}</td>
              <td>{fmt(sumRow(data, "total"))}</td>
            </tr>
          }
        </tbody>
      </table>
    </>
  );

  return (
    <section className="card p-4">
      <h2 className="text-xl font-semibold mb-3">J. Distributions by Vehicle Type — detailed</h2>
      {renderTable("1) Vehicle Type Distributions", distributions, false)}
      {renderTable("2) Annual Flights — Lower bound", lowerFlights)}
      {renderTable("3) Annual Flights — Upper bound", upperFlights)}
      {renderTable("4) Annual UAVs — Lower bound", uavsLower)}
      {renderTable("5) Annual UAVs — Upper bound", uavsUpper)}
    </section>
  );
}
