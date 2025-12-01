import { useState } from "react";


export default function SectionH({ inputs }) {
  const [emergencyData, setEmergencyData] = useState({
    impactedArea: 10000,
    annualEvents: 10,
    avgEventServedPct: 0.5,
    
    coverage: [
      { name: "Search and Rescue", percent: 0.05, timesPerEvent: 1, dailyFlights: 16, dailyArea: 1, daysToFull: 2 },
      { name: "Cellular Connectivity", percent: 0.2, timesPerEvent: 1, dailyFlights: 16, dailyArea: 10, daysToFull: 2 },
      { name: "Government Inspection", percent: 1.0, timesPerEvent: 4, dailyFlights: 8, dailyArea: 0 , daysToFull: 7 },
      { name: "Insurance Inspection", percent: 1.0, timesPerEvent: 1, dailyFlights: 12, dailyArea: 0, daysToFull: 7 },
    ],
    uavCapacityPctLower: 5,
    uavCapacityPctUpper: 50,
    coveredAreaPerFlight: 2,
    results: null
  });

  const handleChange = (index, field, value) => {
    setEmergencyData(prev => {
      const coverage = [...prev.coverage];
      coverage[index][field] = parseFloat(value) || 0;
      return { ...prev, coverage };
    });
  };

  const handleInputChange = (field, value) => {
    setEmergencyData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const { impactedArea, annualEvents, coverage, uavCapacityPctLower, uavCapacityPctUpper, avgEventServedPct } = emergencyData;

    let totalFlightsAll = 0;
    let totalUAVsAll = 0;
    let GovDailyAreaPerUAV=0;
    let InsDailyAreaPerUAV=0;
    const coverageResults = coverage.map(cov => {
      const totalCoveragePercent = cov.percent * cov.timesPerEvent;
      const totalCoverageArea = totalCoveragePercent * impactedArea;
      if (cov.name === "Government Inspection") {
       GovDailyAreaPerUAV = cov.dailyFlights * emergencyData.coveredAreaPerFlight;
      }
      else if (cov.name === "Insurance Inspection") {
       InsDailyAreaPerUAV = cov.dailyFlights * emergencyData.coveredAreaPerFlight;
      }
      
      const avgAreaPerFlight = cov.dailyArea / cov.dailyFlights || emergencyData.coveredAreaPerFlight;

      const totalFlights = totalCoverageArea / avgAreaPerFlight;
      const totalUAVs = Math.ceil(totalFlights / (cov.dailyFlights * cov.daysToFull));

      totalFlightsAll += totalFlights;
      totalUAVsAll += totalUAVs;

      return {
        ...cov, 
        GovDailyAreaPerUAV,
        InsDailyAreaPerUAV,
        totalCoveragePercent,
        totalCoverageArea,
        avgAreaPerFlight,
        totalFlights,
        totalUAVs
      };
    });

    const totalFlightsMax = totalFlightsAll * annualEvents;
    const totalUAVsMax = totalUAVsAll / avgEventServedPct;
    const annualFlightsLower = totalFlightsMax * (uavCapacityPctLower / 100);
    const annualFlightsUpper = totalFlightsMax * (uavCapacityPctUpper / 100);
    const annualUAVsLower = totalUAVsMax * (uavCapacityPctLower / 100);
    const annualUAVsUpper = totalUAVsMax * (uavCapacityPctUpper / 100);

    setEmergencyData(prev => ({
      ...prev,
      results: {
        coverageResults,
        totalFlight: totalFlightsAll,
        totalUAVs: totalUAVsAll,
        totalFlightsMax,
        totalUAVsMax,
        annualFlightsLower,
        annualFlightsUpper,
        annualUAVsLower,
        annualUAVsUpper,
        GovDailyAreaPerUAV,
        InsDailyAreaPerUAV,
      }
    }));
  };

  const { results } = emergencyData;

  return (
    <section className="card">
      <h2>H. Emergency Response</h2>

      <div className="grid">
        <label>
          Impacted Area per Event (sq km)
          <input type="number" value={emergencyData.impactedArea} onChange={e => handleInputChange("impactedArea", e.target.value)} />
        </label>

        <label>
          Annual Emergency Events
          <input type="number" value={emergencyData.annualEvents} onChange={e => handleInputChange("annualEvents", e.target.value)} />
        </label>

        <label>
          Average % of Events Served per UAV (H11)
          <input type="number" value={emergencyData.avgEventServedPct} onChange={e => handleInputChange("avgEventServedPct", e.target.value)} />
        </label>

        <label>
          UAV % of Max Capacity - Lower
          <input type="number" value={emergencyData.uavCapacityPctLower} onChange={e => handleInputChange("uavCapacityPctLower", e.target.value)} />
        </label>

        <label>
          UAV % of Max Capacity - Upper
          <input type="number" value={emergencyData.uavCapacityPctUpper} onChange={e => handleInputChange("uavCapacityPctUpper", e.target.value)} />
        </label>
      </div>

      <div className="grid">
        {emergencyData.coverage.map((cov, idx) => (
          <div key={idx}>
            <h3>{cov.name}</h3>
            <label>
              Coverage %
              <input type="number" value={cov.percent * 100} onChange={e => handleChange(idx, "percent", e.target.value / 100)} />
            </label>
            <label>
              Coverage Times per Event
              <input type="number" value={cov.timesPerEvent} onChange={e => handleChange(idx, "timesPerEvent", e.target.value)} />
            </label>
            <label>
              Daily Flights per UAV
              <input type="number" value={cov.dailyFlights} onChange={e => handleChange(idx, "dailyFlights", e.target.value)} />
            </label>
            <label>
              Daily Area per UAV
              <input type="number" value={cov.dailyArea} onChange={e => handleChange(idx, "dailyArea", e.target.value)} />
            </label>
            <label>
              Days to Full Coverage
              <input type="number" value={cov.daysToFull} onChange={e => handleChange(idx, "daysToFull", e.target.value)} />
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleCalculate}>
        Calculate
      </button>

      {results && (
        <div >
          <h3 >Coverage Results</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Total Coverage %</th>
                <th>Total Coverage Area (km²)</th>
                <th>Average Area per Flight (km²)</th>
                <th>Total Flights</th>
                <th>Total UAVs</th>
              </tr>
            </thead>
            <tbody>
              {results.coverageResults.map((res, idx) => (
                <tr key={idx}>
                  <td>{res.name}</td>
                  <td>{(res.totalCoveragePercent * 100).toFixed(2)}%</td>
                  <td>{res.totalCoverageArea.toFixed(2)}</td>
                  <td>{res.avgAreaPerFlight.toFixed(2)}</td>
                  <td>{res.totalFlights.toFixed(0)}</td>
                  <td>{res.totalUAVs}</td>
        
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <p><strong>Gov-Daily Area Per UAV:</strong> {results.GovDailyAreaPerUAV}</p>
            <p><strong>Ins-Daily Area Per UAV:</strong> {results.InsDailyAreaPerUAV}</p>
            <p><strong>Total Flights:</strong> {results.totalFlight}</p>
            <p><strong>Total UAVs:</strong> {results.totalUAVs}</p>
            <p><strong>Total Flights (UAV Maximum Capacity):</strong> {results.totalFlightsMax.toFixed(0)}</p>
            <p><strong>Total UAVs (UAV Maximum Capacity):</strong> {results.totalUAVsMax.toFixed(0)}</p>
            <p><strong>Annual UAV Flights - Lower:</strong> {results.annualFlightsLower.toFixed(0)}</p>
            <p><strong>Annual UAV Flights - Upper:</strong> {results.annualFlightsUpper.toFixed(0)}</p>
            <p><strong>Annual UAVs - Lower:</strong> {results.annualUAVsLower.toFixed(0)}</p>
            <p><strong>Annual UAVs - Upper:</strong> {results.annualUAVsUpper.toFixed(0)}</p>

          </div>
        </div>
      )}
    </section>
  );
}
