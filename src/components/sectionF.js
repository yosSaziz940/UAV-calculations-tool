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
    maxLinearPathPerUAV: 250, 
    coveredLinearPathPerFlight: 20, 
    UAVFlightsPerYear: 675, 
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
    const { types, uavCapacityPctLower, uavCapacityPctUpper, maxLinearPathPerUAV, coveredLinearPathPerFlight, UAVFlightsPerYear } = infraData;

    let totalFlights = 0;
    let totalUAVs = 0;

    const typeResults = types.map(type => {
     
      const UAV_Locations = Math.ceil(type.km / maxLinearPathPerUAV) || 1;

  
      const kmPerLocation = type.km / UAV_Locations;

      
      const annualFlightsPerLocation = Math.ceil(kmPerLocation / coveredLinearPathPerFlight) * type.coverageTimesPerYear;

      
      const UAVsPerLocation = Math.ceil(annualFlightsPerLocation / UAVFlightsPerYear);

      
      const totalFlightsForType = annualFlightsPerLocation * UAV_Locations;
      const totalUAVsForType = UAVsPerLocation * UAV_Locations;

      totalFlights += totalFlightsForType;
      totalUAVs += totalUAVsForType;

      return {
        ...type,
        UAV_Locations,
        kmPerLocation,
        annualFlightsPerLocation,
        UAVsPerLocation,
        totalFlightsForType,
        totalUAVsForType,
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
    <section className="card">
      <h2>F. Infrastructure Monitoring</h2>

      <div className="grid">
        {infraData.types.map((type, index) => (
          <div key={index} >
            <h3 >{type.name}</h3>
            <label >
              total length in km
              <input
                type="number"
                value={type.km}
                onChange={e => handleChange(index, "km", e.target.value)}
                
              />
            </label>
            <label>
              Coverage Times per Year
              <input
                type="number"
                value={type.coverageTimesPerYear}
                onChange={e => handleChange(index, "coverageTimesPerYear", e.target.value)}
                
              />
            </label>
          </div>
        ))}

        <label>
          UAV % of Max Capacity - Lower
          <input
            type="number"
            value={infraData.uavCapacityPctLower}
            onChange={e => handleUAVCapacityChange("uavCapacityPctLower", e.target.value)}
            
          />
        </label>
        <label >
          UAV % of Max Capacity - Upper
          <input
            type="number"
            value={infraData.uavCapacityPctUpper}
            onChange={e => handleUAVCapacityChange("uavCapacityPctUpper", e.target.value)}
           
          />
        </label>
        <label >
          Max Linear Path per UAV (km)
          <input
            type="number"
            value={infraData.maxLinearPathPerUAV}
            onChange={e => handleUAVCapacityChange("maxLinearPathPerUAV", e.target.value)}
          
          />
        </label>
        <label >
          Covered Linear Path per Flight (km)
          <input
            type="number"
            value={infraData.coveredLinearPathPerFlight}
            onChange={e => handleUAVCapacityChange("coveredLinearPathPerFlight", e.target.value)}
           
          />
        </label>
        <label >
          Max Annual Flights per UAV
          <input
            type="number"
            value={infraData.UAVFlightsPerYear}
            onChange={e => handleUAVCapacityChange("UAVFlightsPerYear", e.target.value)}
           
          />
        </label>
      </div>

      <button
        onClick={handleCalculate}
        
      >
        Calculate
      </button>

      {results && (
        <div>
          <h3 >Results</h3>

          <table>
            <thead>
              <tr>
                <th >Type</th>
                <th >UAV Locations</th>
                <th >km per Location</th>
                <th >Annual Flights per Location</th>
                <th >UAVs per Location</th>
                <th >Total UAV Flights</th>
                <th >Total UAVs</th>
              </tr>
            </thead>
            <tbody>
              {results.typeResults.map((res, idx) => (
                <tr key={idx}>
                  <td >{res.name}</td>
                  <td >{res.UAV_Locations}</td>
                  <td >{res.kmPerLocation.toFixed(2)}</td>
                  <td >{res.annualFlightsPerLocation}</td>
                  <td >{res.UAVsPerLocation}</td>
                  <td >{res.totalFlightsForType}</td>
                  <td >{res.totalUAVsForType}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-2 text-sm">
            <li><strong>Total UAV Flights:</strong> {results.totalFlights}</li>
            <li><strong>Total UAVs:</strong> {results.totalUAVs}</li>
            <li><strong>Annual Flights per UAV:</strong> {results.annualFlightsPerUAV.toFixed(0)}</li>
            <li><strong>Annual UAV Flights - Lower:</strong> {results.annualFlightsLower.toFixed(0)}</li>
            <li><strong>Annual UAV Flights - Upper:</strong> {results.annualFlightsUpper.toFixed(0)}</li>
            <li><strong>Annual UAVs - Lower:</strong> {results.annualUAVsLower.toFixed(0)}</li>
            <li><strong>Annual UAVs - Upper:</strong> {results.annualUAVsUpper.toFixed(0)}</li>
          </ul>
        </div>
      )}
    </section>
  );
}
