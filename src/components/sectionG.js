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
    uavFlightsPerYear: 675, 
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
    <section className="card">
      <h2>G. Structures & Construction Monitoring</h2>

      <div classname="grid">
        {data.types.map((type, index) => (
          <div key={index} >
            <h3>{type.name}</h3>
            <label>
              Structures
              <input
                type="number"
                value={type.structures}
                onChange={e => handleChange(index, "structures", e.target.value)}
                
              />
            </label>
            <label >
              Coverage Times per Year
              <input
                type="number"
                value={type.coverageTimesPerYear}
                onChange={e => handleChange(index, "coverageTimesPerYear", e.target.value)}
                
              />
            </label>
          </div>
        ))}

        <div >
          <label >
            Maximum Annual Structures per UAV
            <input
              type="number"
              value={data.maxStructuresPerUAV}
              onChange={e => handleGlobalChange("maxStructuresPerUAV", e.target.value)}
              
            />
          </label>
          <label >
            Coverage Structures per Flight
            <input
              type="number"
              value={data.coverageStructuresPerFlight}
              onChange={e => handleGlobalChange("coverageStructuresPerFlight", e.target.value)}
             
            />
          </label>
          <label >
            UAV Flights per Year
            <input
              type="number"
              value={data.uavFlightsPerYear}
              onChange={e => handleGlobalChange("uavFlightsPerYear", e.target.value)}
             
            />
          </label>
          <label >
            UAV % of Max Capacity - Lower
            <input
              type="number"
              value={data.uavCapacityPctLower}
              onChange={e => handleGlobalChange("uavCapacityPctLower", e.target.value)}
             
            />
          </label>
          <label>
            UAV % of Max Capacity - Upper
            <input
              type="number"
              value={data.uavCapacityPctUpper}
              onChange={e => handleGlobalChange("uavCapacityPctUpper", e.target.value)}
             
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleCalculate}
       
      >
        Calculate
      </button>

      {results && (
        <div>
          <h3>Results</h3>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>UAV Locations</th>
                <th>Structures per Location</th>
                <th>Annual Flights/Loc</th>
                <th>Total Flights</th>
                <th>UAVs/Loc</th>
                <th>Total UAVs</th>
              </tr>
            </thead>
            <tbody>
              {results.typeResults.map((res, idx) => (
                <tr key={idx}>
                  <td>{res.name}</td>
                  <td>{res.uavLocations}</td>
                  <td>{res.kmPerLocation.toFixed(2)}</td>
                  <td>{res.annualFlightsPerLocation}</td>
                  <td>{res.totalAnnualFlights}</td>
                  <td>{res.uavsPerLocation}</td>
                  <td>{res.totalUAVsForType}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
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

