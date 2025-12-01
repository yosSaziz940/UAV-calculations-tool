import { useState } from "react";


export default function SectionA({ inputs, setInputs }) {

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const {
      operationalHoursPerDay,
      operationalDaysPerWeek,
      operationalWeeksPerYear,
      operationalTimeInFlightPct,
      averageHoursPerFlight,
      averageOverheadHoursPerFlight,
      averageVelocity,
      coverageWidthPerPath,
      maxStructuresPerWeek,
    } = inputs;

    const operationalHoursPerYear = operationalHoursPerDay * operationalDaysPerWeek * operationalWeeksPerYear * (operationalTimeInFlightPct / 100);
    const flightsPerYear = operationalHoursPerYear / (averageHoursPerFlight + averageOverheadHoursPerFlight);
    const coveredLinearPathPerFlight = averageVelocity * averageHoursPerFlight;
    const coveredAreaPerFlightHa = (averageVelocity * coverageWidthPerPath) / 10;
    const maxAnnualStructures = maxStructuresPerWeek * operationalWeeksPerYear;

    setResults({ operationalHoursPerYear, flightsPerYear, coveredLinearPathPerFlight, coveredAreaPerFlightHa, maxAnnualStructures });

  };

  return (
    <section className="card">
      <h2>A. General Inputs</h2>
      <div className="grid">
        {Object.entries(inputs).map(([key, value]) => (
          <label key={key}>
            <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
            <input type="number" name={key} value={value} onChange={handleChange} />
          </label>
        ))}
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      {results && (
        <ul className="results">
          <li><strong>Operational Hours per Year:</strong> {results.operationalHoursPerYear.toFixed(2)}</li>
          <li><strong>Flights per Year:</strong> {results.flightsPerYear.toFixed(2)}</li>
          <li><strong>Covered Linear Path per Flight (km):</strong> {results.coveredLinearPathPerFlight.toFixed(2)}</li>
          <li><strong>Covered Area per Flight (ha):</strong> {results.coveredAreaPerFlightHa.toFixed(2)}</li>
          <li><strong>Max Annual Structures:</strong> {results.maxAnnualStructures.toFixed(2)}</li>
        </ul>
      )}
    </section>
  );
}
