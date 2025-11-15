import { useState } from "react";


export default function SectionH({ inputs }) {
  const [emergencyData, setEmergencyData] = useState({
    impactedArea: 10000,
    annualEvents: 10,
    avgEventServedPct: 0.5,
    coverage: [
      { name: "Search and Rescue", percent: 0.05, timesPerEvent: 1, dailyFlights: 16, dailyArea: 1, daysToFull: 2 },
      { name: "Cellular Connectivity", percent: 0.2, timesPerEvent: 1, dailyFlights: 16, dailyArea: 10, daysToFull: 2 },
      { name: "Government Inspection", percent: 1.0, timesPerEvent: 4, dailyFlights: 8, dailyArea: 16 , daysToFull: 7 },
      { name: "Insurance Inspection", percent: 1.0, timesPerEvent: 1, dailyFlights: 12, dailyArea: 24, daysToFull: 7 },
    ],
    uavCapacityPctLower: 5,
    uavCapacityPctUpper: 50,
    dailyAreaPerFlight: 2,
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

    const coverageResults = coverage.map(cov => {
      const totalCoveragePercent = cov.percent * cov.timesPerEvent;
      const totalCoverageArea = totalCoveragePercent * impactedArea;

      // Average Area per Flight
      const avgAreaPerFlight = cov.dailyArea / cov.dailyFlights || emergencyData.dailyAreaPerFlight;

      const totalFlights = totalCoverageArea / avgAreaPerFlight;
      const totalUAVs = Math.ceil(totalFlights / (cov.dailyFlights * cov.daysToFull));

      totalFlightsAll += totalFlights;
      totalUAVsAll += totalUAVs;

      return {
        ...cov,
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
        annualUAVsUpper
      }
    }));
  };

  const { results } = emergencyData;

  return (
    <section className="card p-4 bg-gray-50 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">H. Emergency Response</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col">
          Impacted Area per Event (sq km)
          <input type="number" value={emergencyData.impactedArea} onChange={e => handleInputChange("impactedArea", e.target.value)} className="border rounded p-1" />
        </label>

        <label className="flex flex-col">
          Annual Emergency Events
          <input type="number" value={emergencyData.annualEvents} onChange={e => handleInputChange("annualEvents", e.target.value)} className="border rounded p-1" />
        </label>

        <label className="flex flex-col">
          Average % of Events Served per UAV (H11)
          <input type="number" value={emergencyData.avgEventServedPct} onChange={e => handleInputChange("avgEventServedPct", e.target.value)} className="border rounded p-1" />
        </label>

        <label className="flex flex-col">
          UAV % of Max Capacity - Lower
          <input type="number" value={emergencyData.uavCapacityPctLower} onChange={e => handleInputChange("uavCapacityPctLower", e.target.value)} className="border rounded p-1" />
        </label>

        <label className="flex flex-col">
          UAV % of Max Capacity - Upper
          <input type="number" value={emergencyData.uavCapacityPctUpper} onChange={e => handleInputChange("uavCapacityPctUpper", e.target.value)} className="border rounded p-1" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyData.coverage.map((cov, idx) => (
          <div key={idx} className="p-2 border rounded bg-white">
            <h3 className="text-sm font-semibold">{cov.name}</h3>
            <label className="flex flex-col text-xs mt-1">
              Coverage %
              <input type="number" value={cov.percent * 100} onChange={e => handleChange(idx, "percent", e.target.value / 100)} className="border rounded p-1 text-xs" />
            </label>
            <label className="flex flex-col text-xs mt-1">
              Coverage Times per Event
              <input type="number" value={cov.timesPerEvent} onChange={e => handleChange(idx, "timesPerEvent", e.target.value)} className="border rounded p-1 text-xs" />
            </label>
            <label className="flex flex-col text-xs mt-1">
              Daily Flights per UAV
              <input type="number" value={cov.dailyFlights} onChange={e => handleChange(idx, "dailyFlights", e.target.value)} className="border rounded p-1 text-xs" />
            </label>
            <label className="flex flex-col text-xs mt-1">
              Daily Area per UAV
              <input type="number" value={cov.dailyArea} onChange={e => handleChange(idx, "dailyArea", e.target.value)} className="border rounded p-1 text-xs" />
            </label>
            <label className="flex flex-col text-xs mt-1">
              Days to Full Coverage
              <input type="number" value={cov.daysToFull} onChange={e => handleChange(idx, "daysToFull", e.target.value)} className="border rounded p-1 text-xs" />
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleCalculate} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Calculate
      </button>

      {results && (
        <div className="mt-4 border rounded p-4 bg-white shadow">
          <h3 className="font-semibold mb-2">Coverage Results</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border p-1">Type</th>
                <th className="border p-1">Total Coverage %</th>
                <th className="border p-1">Total Coverage Area (km²)</th>
                <th className="border p-1">Average Area per Flight (km²)</th>
                <th className="border p-1">Total Flights</th>
                <th className="border p-1">Total UAVs</th>
              </tr>
            </thead>
            <tbody>
              {results.coverageResults.map((res, idx) => (
                <tr key={idx}>
                  <td className="border p-1">{res.name}</td>
                  <td className="border p-1">{(res.totalCoveragePercent * 100).toFixed(2)}%</td>
                  <td className="border p-1">{res.totalCoverageArea.toFixed(2)}</td>
                  <td className="border p-1">{res.avgAreaPerFlight.toFixed(2)}</td>
                  <td className="border p-1">{res.totalFlights.toFixed(0)}</td>
                  <td className="border p-1">{res.totalUAVs}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-sm">
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
