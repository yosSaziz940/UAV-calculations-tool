import { useState } from "react";


export default function SectionG({ inputs }) {
  const [data, setData] = useState({
    types: [
      { name: "Bridges & Culverts", structures: 4380, coverageTimesPerYear: 4 },
      { name: "Annual Infrastructure Construction", structures: 2920, coverageTimesPerYear: 48 },
      { name: "Annual Residential Unit Construction", structures: 29200, coverageTimesPerYear: 4 },
      { name: "Annual Non-Residential Construction", structures: 2920, coverageTimesPerYear: 48 },
    ],
    maxStructuresPerUAV: 336, 
    coverageStructuresPerFlight: 1, 
    uavFlightsPerYear: 672, 
    uavCapacityPctLower: 5,
    uavCapacityPctUpper: 50,
  });

  const [results, setResults] = useState(null);

  const handleChange = (index, field, value) => {
    setData(prev => {
      const types = [...prev.types];
      types[index][field] = parseFloat(value) || 0;
      return { ...prev, types };
    });
  };

  const handleGlobalChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const {
      types,
      maxStructuresPerUAV,
      coverageStructuresPerFlight,
      uavFlightsPerYear,
      uavCapacityPctLower,
      uavCapacityPctUpper,
    } = data;

    let totalFlights = 0;
    let totalUAVs = 0;

    const typeResults = types.map(type => {
      const uavLocations = Math.ceil(type.structures / maxStructuresPerUAV);
      const kmPerLocation = uavLocations > 0 ? type.structures / uavLocations : 0;

      const annualFlightsPerLocation =
        Math.ceil(kmPerLocation / coverageStructuresPerFlight) * type.coverageTimesPerYear;

      const uavsPerLocation = Math.max(Math.ceil(annualFlightsPerLocation / uavFlightsPerYear), 1);

      const totalAnnualFlights = annualFlightsPerLocation * uavLocations;
      const totalUAVsForType = uavsPerLocation * uavLocations;

      totalFlights += totalAnnualFlights;
      totalUAVs += totalUAVsForType;

      return {
        name: type.name,
        uavLocations,
        kmPerLocation,
        annualFlightsPerLocation,
        totalAnnualFlights,
        uavsPerLocation,
        totalUAVsForType,
      };
    });

    const annualFlightsPerUAV = totalUAVs > 0 ? totalFlights / totalUAVs : 0;

    const annualFlightsLower = totalFlights * (uavCapacityPctLower / 100);
    const annualFlightsUpper = totalFlights * (uavCapacityPctUpper / 100);
    const annualUAVsLower = annualFlightsPerUAV > 0 ? annualFlightsLower / annualFlightsPerUAV : 0;
    const annualUAVsUpper = annualFlightsPerUAV > 0 ? annualFlightsUpper / annualFlightsPerUAV : 0;

    setResults({
      typeResults,
      totalFlights,
      totalUAVs,
      annualFlightsPerUAV,
      annualFlightsLower,
      annualFlightsUpper,
      annualUAVsLower,
      annualUAVsUpper,
    });
  };

  return (
    <section className="card p-4">
      <h2 className="text-lg font-bold mb-2">G. Structures & Construction Monitoring</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {data.types.map((type, index) => (
          <div key={index} className="border rounded p-2 bg-gray-50">
            <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
            <label className="flex flex-col text-xs">
              Structures
              <input
                type="number"
                value={type.structures}
                onChange={e => handleChange(index, "structures", e.target.value)}
                className="border rounded p-1 text-xs"
              />
            </label>
            <label className="flex flex-col text-xs mt-1">
              Coverage Times per Year
              <input
                type="number"
                value={type.coverageTimesPerYear}
                onChange={e => handleChange(index, "coverageTimesPerYear", e.target.value)}
                className="border rounded p-1 text-xs"
              />
            </label>
          </div>
        ))}

        <div className="border rounded p-2 bg-gray-50">
          <label className="flex flex-col text-xs mt-1">
            Maximum Annual Structures per UAV (C$50)
            <input
              type="number"
              value={data.maxStructuresPerUAV}
              onChange={e => handleGlobalChange("maxStructuresPerUAV", e.target.value)}
              className="border rounded p-1 text-xs"
            />
          </label>
          <label className="flex flex-col text-xs mt-1">
            Coverage Structures per Flight (C$26)
            <input
              type="number"
              value={data.coverageStructuresPerFlight}
              onChange={e => handleGlobalChange("coverageStructuresPerFlight", e.target.value)}
              className="border rounded p-1 text-xs"
            />
          </label>
          <label className="flex flex-col text-xs mt-1">
            UAV Flights per Year (C$39)
            <input
              type="number"
              value={data.uavFlightsPerYear}
              onChange={e => handleGlobalChange("uavFlightsPerYear", e.target.value)}
              className="border rounded p-1 text-xs"
            />
          </label>
          <label className="flex flex-col text-xs mt-1">
            UAV % of Max Capacity – Lower
            <input
              type="number"
              value={data.uavCapacityPctLower}
              onChange={e => handleGlobalChange("uavCapacityPctLower", e.target.value)}
              className="border rounded p-1 text-xs"
            />
          </label>
          <label className="flex flex-col text-xs mt-1">
            UAV % of Max Capacity – Upper
            <input
              type="number"
              value={data.uavCapacityPctUpper}
              onChange={e => handleGlobalChange("uavCapacityPctUpper", e.target.value)}
              className="border rounded p-1 text-xs"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        Calculate
      </button>

      {results && (
        <div className="mt-4 border rounded p-4 bg-white shadow">
          <h3 className="font-semibold text-base mb-2">Results</h3>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">UAV Locations</th>
                <th className="border px-2 py-1">Structures per Location</th>
                <th className="border px-2 py-1">Annual Flights/Loc</th>
                <th className="border px-2 py-1">Total Flights</th>
                <th className="border px-2 py-1">UAVs/Loc</th>
                <th className="border px-2 py-1">Total UAVs</th>
              </tr>
            </thead>
            <tbody>
              {results.typeResults.map((res, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{res.name}</td>
                  <td className="border px-2 py-1 text-center">{res.uavLocations}</td>
                  <td className="border px-2 py-1 text-center">{res.kmPerLocation.toFixed(2)}</td>
                  <td className="border px-2 py-1 text-center">{res.annualFlightsPerLocation}</td>
                  <td className="border px-2 py-1 text-center">{res.totalAnnualFlights}</td>
                  <td className="border px-2 py-1 text-center">{res.uavsPerLocation}</td>
                  <td className="border px-2 py-1 text-center">{res.totalUAVsForType}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-sm">
            <p><strong>Total UAV Flights:</strong> {results.totalFlights.toFixed(0)}</p>
            <p><strong>Total UAVs:</strong> {results.totalUAVs.toFixed(0)}</p>
            <p><strong>Annual Flights per UAV:</strong> {results.annualFlightsPerUAV.toFixed(1)}</p>
            <p><strong>Annual UAV Flights (Lower):</strong> {results.annualFlightsLower.toFixed(0)}</p>
            <p><strong>Annual UAV Flights (Upper):</strong> {results.annualFlightsUpper.toFixed(0)}</p>
            <p><strong>Annual UAVs (Lower):</strong> {results.annualUAVsLower.toFixed(0)}</p>
            <p><strong>Annual UAVs (Upper):</strong> {results.annualUAVsUpper.toFixed(0)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
