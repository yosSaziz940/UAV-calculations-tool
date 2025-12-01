import { useState } from "react";

export default function SectionB() {
  const [recreational, setRecreational] = useState({
    population: 6500000,         // normally from Section A
    uavPercentLower: 0.588,
    uavPercentUpper: 1.331,
    avgFlightsPerMonth: 2,
  });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecreational(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const uavsLower = recreational.population * (recreational.uavPercentLower / 100);
    const uavsUpper = recreational.population * (recreational.uavPercentUpper / 100);
    const annualFlightsLower = uavsLower * recreational.avgFlightsPerMonth * 12;
    const annualFlightsUpper = uavsUpper * recreational.avgFlightsPerMonth * 12;

    setResults({ uavsLower, uavsUpper, annualFlightsLower, annualFlightsUpper });
  };

  return (
    <section className="card">
      <h2>B. Recreational Use</h2>

      <div className="grid">
        <label>
          Population
          <input
            type="number"
            name="population"
            value={recreational.population}
            onChange={handleChange}
          />
        </label>
        <label>
          UAV % of Population - Lower
          <input
            type="number"
            name="uavPercentLower"
            value={recreational.uavPercentLower}
            onChange={handleChange}
          />
        </label>
        <label>
          UAV % of Population - Upper
          <input
            type="number"
            name="uavPercentUpper"
            value={recreational.uavPercentUpper}
            onChange={handleChange}
          />
        </label>
        <label>
          Average flights per month per UAV
          <input
            type="number"
            name="avgFlightsPerMonth"
            value={recreational.avgFlightsPerMonth}
            onChange={handleChange}
          />
        </label>
      </div>

      <button onClick={handleCalculate}>Calculate</button>

      {results && (
        <ul className="results">
          <li><strong>Estimated UAVs (Lower):</strong> {results.uavsLower.toFixed(0)}</li>
          <li><strong>Estimated UAVs (Upper):</strong> {results.uavsUpper.toFixed(0)}</li>
          <li><strong>Annual UAV Flights (Lower):</strong> {results.annualFlightsLower.toFixed(0)}</li>
          <li><strong>Annual UAV Flights (Upper):</strong> {results.annualFlightsUpper.toFixed(0)}</li>
        </ul>
      )}
    </section>
  );
}
