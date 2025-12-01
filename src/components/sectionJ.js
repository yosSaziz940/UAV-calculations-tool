import React, { useState } from "react";

export default function SectionJ() {
  const initialRows = [
    { key: "recreational", name: "Recreational Use", small: 1.0, medium: 0.0, lowerFlights: 917280, upperFlights: 2076360, flightsPerUAV: 24 },
    { key: "commercial", name: "Commercial Delivery", small: 0.0, medium: 1.0, lowerFlights: 9525600, upperFlights: 23814000, flightsPerUAV: 240 },
    { key: "urban", name: "Urban Air Mobility", small: 0.0, medium: 0.0, lowerFlights: 23400000, upperFlights: 253500000, flightsPerUAV: 6000 },
    { key: "agriculture", name: "Agriculture", small: 0.5, medium: 0.5, lowerFlights: 6, upperFlights: 56, flightsPerUAV: 11 },
    { key: "linear", name: "Linear Inspection", small: 0.8, medium: 0.2, lowerFlights: 33, upperFlights: 333, flightsPerUAV: 83 },
    { key: "structure", name: "Structure Inspection", small: 0.8, medium: 0.2, lowerFlights: 20763, upperFlights: 207628, flightsPerUAV: 655 },
    { key: "emergency", name: "Emergency Response", small: 0.5, medium: 0.4, lowerFlights: 18100, upperFlights: 181000, flightsPerUAV: 236 },
  ];

  const [rows, setRows] = useState(initialRows);
  const [otherFraction, setOtherFraction] = useState(0.001);
  const [otherUAVs, setOtherUAVs] = useState(1036);
  const [computed, setComputed] = useState(null);

  const updateCell = (index, field, value) => {
    setRows(prev => {
      const copy = prev.map(r => ({ ...r }));
      copy[index][field] = parseFloat(value) || 0;
      return copy;
    });
  };

  const fmt = v => (v == null || Number.isNaN(v) ? "-" : Math.round(v * 100) / 100);
  const computeLarge = (small, medium) => 1 - (Number(small || 0) + Number(medium || 0));
  // const sumRow = (arr, prop) => arr.reduce((sum, r) => sum + r[prop], 0);

  const calculate = () => {

    const distributions = rows.map(r => ({
      ...r,
      large: computeLarge(r.small, r.medium),
      total: r.small + r.medium + computeLarge(r.small, r.medium)
    }));

    const avgSmall = rows.reduce((sum, r) => sum + r.small, 0) / rows.length;
    const avgMedium = rows.reduce((sum, r) => sum + r.medium, 0) / rows.length;
    const avgLarge = 1 - (avgSmall + avgMedium);

    const otherDist = { key: "other", name: "Other (average)", small: avgSmall, medium: avgMedium, large: avgLarge, total: 1 };
    const allDistributions = [...distributions, otherDist];

    // ---- flights ----
    const computeFlights = (type) => {
      const key = type === "lower" ? "lowerFlights" : "upperFlights";
      const flights = rows.map(r => ({
        ...r,
        small: r[key] * r.small,
        medium: r[key] * r.medium,
        large: r[key] * computeLarge(r.small, r.medium),
        total: r[key]
      }));

      const avgSmallF = rows.reduce((sum, r) => sum + r.small, 0) / rows.length;
      const avgMediumF = rows.reduce((sum, r) => sum + r.medium, 0) / rows.length;
      const avgLargeF = 1 - (avgSmallF + avgMediumF);

      const totalFlights = flights.reduce((sum, r) => sum + r.total, 0);
      const otherTotal = otherFraction * totalFlights / (1 - otherFraction);

      const other = {
        key: "other",
        name: "Other",
        small: avgSmallF * otherTotal,
        medium: avgMediumF * otherTotal,
        large: avgLargeF * otherTotal,
        total: otherTotal
      };

      return [...flights, other];
    };

    const lowerFlights = computeFlights("lower");
    const upperFlights = computeFlights("upper");

    // ---- UAVs ----
    const computeUAVs = (flights) =>
      flights.map(r => {
        if (r.key === "other") return { ...r, small: r.small / otherUAVs, medium: r.medium / otherUAVs, large: r.large / otherUAVs, total: (r.small + r.medium + r.large) / otherUAVs };
        return { ...r, small: r.small / r.flightsPerUAV, medium: r.medium / r.flightsPerUAV, large: r.large / r.flightsPerUAV, total: (r.small + r.medium + r.large) / r.flightsPerUAV };
      });

    const uavsLower = computeUAVs(lowerFlights);
    const uavsUpper = computeUAVs(upperFlights);

    setComputed({ distributions: allDistributions, lowerFlights, upperFlights, uavsLower, uavsUpper });
  };

  const renderTable = (title, data, editable = false, showFlights = false) => (
    <>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Small</th>
            <th>Medium</th>
            {showFlights && <th>Lower / Upper Flights</th>}
            <th>Large</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, idx) => (
            <tr key={r.key}>
              <td>{r.name}</td>
              <td>
                {editable && r.key !== "other" ? <input type="number" value={r.small} onChange={e => updateCell(idx, "small", e.target.value)}/> : fmt(r.small)}
              </td>
              <td>
                {editable && r.key !== "other" ? <input type="number" value={r.medium} onChange={e => updateCell(idx, "medium", e.target.value)}/> : fmt(r.medium)}
              </td>
              {showFlights && r.key !== "other" && (
                <td>
                  <input type="number" value={r.total} onChange={e => updateCell(idx, "lowerFlights", e.target.value)}/>
                </td>
              )}
              <td>{fmt(r.large)}</td>
              <td>{fmt(r.total)}</td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </>
  );

  return (
    <section className="card">
      <h2>J. Vehicle Type Inputs</h2>

      {/* INPUTS PANEL */}
      <div className="grid">
        {rows.map((r, idx) => (
          <div key={r.key}>
            <div>{r.name}</div>
            <label>Small:
              <input type="number" value={r.small} onChange={e => updateCell(idx, "small", e.target.value)}/>
            </label>
            <label>Medium:
              <input type="number" value={r.medium} onChange={e => updateCell(idx, "medium", e.target.value)}/>
            </label>
            <label>Lower Flights:
              <input type="number" value={r.lowerFlights} onChange={e => updateCell(idx, "lowerFlights", e.target.value)}/>
            </label>
            <label>Upper Flights:
              <input type="number" value={r.upperFlights} onChange={e => updateCell(idx, "upperFlights", e.target.value)}/>
            </label>
            <label>Flights per UAV:
              <input type="number" value={r.flightsPerUAV} onChange={e => updateCell(idx, "flightsPerUAV", e.target.value)}/>
            </label>
          </div>
        ))}

        {/* Other Fraction & Other UAVs */}
        <div>
          <div>Other Options</div>
          <label>Other Fraction (%):
            <input type="number" value={otherFraction * 100} onChange={e => setOtherFraction(parseFloat(e.target.value) / 100)}/>
          </label>
          <label>Other Annual Flights per UAV:
            <input type="number" value={otherUAVs} onChange={e => setOtherUAVs(parseFloat(e.target.value))}/>
          </label>
        </div>
      </div>

      {/* CALCULATE BUTTON */}
      <button onClick={calculate}>
        Calculate
      </button>

      {/* TABLES */}
      {computed && (
        <>
          {renderTable("1) Vehicle Type Distributions", computed.distributions, false)}
          {renderTable("2) Annual Flights - Lower bound", computed.lowerFlights, false)}
          {renderTable("3) Annual Flights - Upper bound", computed.upperFlights, false)}
          {renderTable("4) Annual UAVs - Lower bound", computed.uavsLower)}
          {renderTable("5) Annual UAVs - Upper bound", computed.uavsUpper)}
        </>
      )}
    </section>
  );
}
