import { useState } from "react";

export default function SectionC() {
  const [inputs, setInputs] = useState({
    population: 6500000,             // from Section A
    operationalDaysPerWeek: 5,       // from Section A
    operationalWeeksPerYear: 48,     // from Section A
    annualTonnes: 7938000,
    manufacturedGoodsPct: 30,
    uavPotentialPct: 20,
    avgKgPerDelivery: 1,
    avgFlightsPerDay: 1,
    uavCapacityPctLower: 2,
    uavCapacityPctUpper: 5
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const {
      annualTonnes,
      manufacturedGoodsPct,
      uavPotentialPct,
      avgKgPerDelivery,
      avgFlightsPerDay,
      uavCapacityPctLower,
      uavCapacityPctUpper,
      operationalDaysPerWeek,
      operationalWeeksPerYear
    } = inputs;

    const annualUAVTonnesMax = annualTonnes * (manufacturedGoodsPct / 100) * (uavPotentialPct / 100);
    const annualUAVFlightsMax = (annualUAVTonnesMax * 1000) / avgKgPerDelivery;
    const avgFlightsPerUAVPerYear = avgFlightsPerDay * operationalDaysPerWeek * operationalWeeksPerYear;
    const annualFlightsLower = annualUAVFlightsMax * (uavCapacityPctLower / 100);
    const annualFlightsUpper = annualUAVFlightsMax * (uavCapacityPctUpper / 100);
    const annualUAVsLower = annualFlightsLower / avgFlightsPerUAVPerYear;
    const annualUAVsUpper = annualFlightsUpper / avgFlightsPerUAVPerYear;

    setResults({
      annualUAVTonnesMax,
      annualUAVFlightsMax,
      avgFlightsPerUAVPerYear,
      annualFlightsLower,
      annualFlightsUpper,
      annualUAVsLower,
      annualUAVsUpper
    });
  };

  return (
    <section className="card">
      <h2>C. Commercial Delivery</h2>
      <div className="grid">
        {Object.entries(inputs).map(([key, value]) => (
          <label key={key}>
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            <input type="number" name={key} value={value} onChange={handleChange} />
          </label>
        ))}
      </div>

      <button onClick={handleCalculate}>Calculate</button>

      {results && (
        <ul className="results">
          <li><strong>Annual UAV Tonnes Max:</strong> {results.annualUAVTonnesMax.toFixed(2)}</li>
          <li><strong>Annual UAV Flights Max:</strong> {results.annualUAVFlightsMax.toFixed(0)}</li>
          <li><strong>Avg Flights per UAV per Year:</strong> {results.avgFlightsPerUAVPerYear.toFixed(2)}</li>
          <li><strong>Annual Flights Lower:</strong> {results.annualFlightsLower.toFixed(0)}</li>
          <li><strong>Annual Flights Upper:</strong> {results.annualFlightsUpper.toFixed(0)}</li>
          <li><strong>Annual UAVs Lower:</strong> {results.annualUAVsLower.toFixed(2)}</li>
          <li><strong>Annual UAVs Upper:</strong> {results.annualUAVsUpper.toFixed(2)}</li>
        </ul>
      )}
    </section>
  );
}
