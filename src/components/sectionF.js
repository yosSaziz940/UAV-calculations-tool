"use client";

import { useState } from "react";

export default function SectionF({ inputs }) {
  const [infraData, setInfraData] = useState({
    types: [
      { name: "Highways", km: 40, coverageTimesPerYear: 4 },
      { name: "Local Roads", km: 400, coverageTimesPerYear: 1 },
      { name: "Railways High-speed", km: 1, coverageTimesPerYear: 365 },
      { name: "Railways Low-speed", km: 7, coverageTimesPerYear: 156 },
      { name: "Railways Freight-only", km: 10, coverageTimesPerYear: 104 },
      { name: "Pipelines", km: 13, coverageTimesPerYear: 4 },
      { name: "High-voltage Transmission Lines", km: 40, coverageTimesPerYear: 4 },

    ],
    maxLinearPathPerUAV: 250.0, // C$27
    coveredLinearPathPerFlight : 20.0,// C$44}
    uavCapacityPctLower: 5,
    uavCapacityPctUpper: 50,
  });

  const [results, setResults] = useState(null);

  const handleChange = (index, field, value) => {
    setInfraData(prev => {
      const types = [...prev.types];
      types[index][field] = parseFloat(value) || 0;
      return { ...prev, types };
    });
  };

  const handleUAVCapacityChange = (field, value) => {
    setInfraData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const { types, uavCapacityPctLower, uavCapacityPctUpper, maxLinearPathPerUAV, coveredLinearPathPerFlight  } = infraData;


    let totalFlights = 0;
    let totalUAVs = 0;

    const typeResults = types.map(type => {
      const UAV_Locations = Math.ceil(type.km / maxLinearPathPerUAV) || 1;
      const kmPerLocation = type.km / UAV_Locations;

      const annualFlightsPerLocation = Math.ceil(kmPerLocation / coveredLinearPathPerFlight) * type.coverageTimesPerYear;
      const UAVsPerLocation = annualFlightsPerLocation; // same as Excel formula

      const totalFlightsForType = annualFlightsPerLocation * UAV_Locations;
    // const totalUAVsForType = UAVsPerLocation * UAV_Locations;

      totalFlights += totalFlightsForType;
      totalUAVs += UAV_Locations;

      return {
        ...type,
        UAV_Locations,
        kmPerLocation,
        annualFlightsPerLocation,

      };
    });

    const annualFlightsPerUAV = totalFlights / totalUAVs;

    const annualFlightsLower = totalFlights * (uavCapacityPctLower / 100);
    const annualFlightsUpper = totalFlights * (uavCapacityPctUpper / 100);
    const annualUAVsLower = totalUAVs * (uavCapacityPctLower / 100);
    const annualUAVsUpper = totalUAVs * (uavCapacityPctUpper / 100);

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
      <h2 className="font-bold text-lg mb-4">F. Infrastructure Monitoring</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infraData.types.map((type, index) => (
          <div key={index} className="p-2 border rounded">
            <h3 className="text-sm font-semibold">{type.name}</h3>
            <label className="flex flex-col text-xs mt-1">
              km
              <input
                type="number"
                value={type.km}
                onChange={e => handleChange(index, "km", e.target.value)}
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

        <label className="flex flex-col mt-2">
          UAV % of Max Capacity - Lower
          <input
            type="number"
            value={infraData.uavCapacityPctLower}
            onChange={e => handleUAVCapacityChange("uavCapacityPctLower", e.target.value)}
            className="border rounded p-1"
          />
        </label>
        <label className="flex flex-col mt-2">
          UAV % of Max Capacity - Upper
          <input
            type="number"
            value={infraData.uavCapacityPctUpper}
            onChange={e => handleUAVCapacityChange("uavCapacityPctUpper", e.target.value)}
            className="border rounded p-1"
          />
        </label>
        <label className="flex flex-col mt-2">
          maxLinearPathPerUAV
          <input
            type="number"
            value={infraData.maxLinearPathPerUAV}
            onChange={e => handleUAVCapacityChange("maxLinearPathPerUAV", e.target.value)}
            className="border rounded p-1"
          />
        </label>
        <label className="flex flex-col mt-2">
          coveredLinearPathPerFlight
          <input
            type="number"
            value={infraData.coveredLinearPathPerFlight}
            onChange={e => handleUAVCapacityChange("coveredLinearPathPerFlight", e.target.value)}
            className="border rounded p-1"
          />
        </label>
      </div>

      <button
        onClick={handleCalculate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Calculate
      </button>

      {results && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Results</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border p-1">Type</th>
                <th className="border p-1">UAV Locations</th>
                <th className="border p-1">km per Location</th>
                <th className="border p-1">Annual Flights per Location</th>
              </tr>
            </thead>
            <tbody>
              {results.typeResults.map((res, idx) => (
                <tr key={idx}>
                  <td className="border p-1">{res.name}</td>
                  <td className="border p-1">{res.UAV_Locations}</td>
                  <td className="border p-1">{res.kmPerLocation.toFixed(2)}</td>
                  <td className="border p-1">{res.annualFlightsPerLocation}</td>
                  <td className="border p-1">{res.totalFlightsForType}</td>
                  <td className="border p-1">{res.UAVsPerLocation}</td>
                  <td className="border p-1">{res.totalUAVsForType}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-2 text-sm">
            <li>Total UAV Flights: {results.totalFlights}</li>
            <li>Total UAVs: {results.totalUAVs}</li>
            <li>Annual Flights per UAV: {results.annualFlightsPerUAV.toFixed(0)}</li>
            <li>Annual UAV Flights - Lower: {results.annualFlightsLower.toFixed(0)}</li>
            <li>Annual UAV Flights - Upper: {results.annualFlightsUpper.toFixed(0)}</li>
            <li>Annual UAVs - Lower: {results.annualUAVsLower.toFixed(0)}</li>
            <li>Annual UAVs - Upper: {results.annualUAVsUpper.toFixed(0)}</li>
          </ul>
        </div>
      )}
    </section>
  );
}

