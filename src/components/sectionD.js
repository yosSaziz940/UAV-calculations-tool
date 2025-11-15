import { useState } from "react";


export default function SectionD({ inputs }) {
  const [dData, setDData] = useState({
    totalAnnualVehicleTrips: 7800000000,
    vehicleSharePctLower: 15,
    vehicleSharePctUpper: 65,
    uavCapacityPctLower: 2,
    uavCapacityPctUpper: 5,
    avgFlightsPerYear: 6000,
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const {
      totalAnnualVehicleTrips,
      vehicleSharePctLower,
      vehicleSharePctUpper,
      uavCapacityPctLower,
      uavCapacityPctUpper,
      avgFlightsPerYear
    } = dData;

    // 1. Annual Vehicle Share Trips
    const vehicleShareLower = totalAnnualVehicleTrips * (vehicleSharePctLower / 100);
    const vehicleShareUpper = totalAnnualVehicleTrips * (vehicleSharePctUpper / 100);

    // 2. Urban Air Mobility Estimates
    const annualUAVFlightsLower = vehicleShareLower * (uavCapacityPctLower / 100);
    const annualUAVFlightsUpper = vehicleShareUpper * (uavCapacityPctUpper / 100);

    // 3. Annual UAVs
    const annualUAVsLower = annualUAVFlightsLower / avgFlightsPerYear;
    const annualUAVsUpper = annualUAVFlightsUpper / avgFlightsPerYear;

    setResults({
      vehicleShareLower,
      vehicleShareUpper,
      annualUAVFlightsLower,
      annualUAVFlightsUpper,
      annualUAVsLower,
      annualUAVsUpper
    });
  };

  return (
    <section className="card">
      <h2>D. Urban Air Mobility</h2>
      <div className="grid">
        <label>
          Total Annual Vehicle Trips
          <input type="number" name="totalAnnualVehicleTrips" value={dData.totalAnnualVehicleTrips} onChange={handleChange} />
        </label>
        <label>
          Vehicle Share % - Lower
          <input type="number" name="vehicleSharePctLower" value={dData.vehicleSharePctLower} onChange={handleChange} />
        </label>
        <label>
          Vehicle Share % - Upper
          <input type="number" name="vehicleSharePctUpper" value={dData.vehicleSharePctUpper} onChange={handleChange} />
        </label>
        <label>
          UAV % of Max Capacity - Lower
          <input type="number" name="uavCapacityPctLower" value={dData.uavCapacityPctLower} onChange={handleChange} />
        </label>
        <label>
          UAV % of Max Capacity - Upper
          <input type="number" name="uavCapacityPctUpper" value={dData.uavCapacityPctUpper} onChange={handleChange} />
        </label>
        <label>
          Average Flights per Year per UAV
          <input type="number" name="avgFlightsPerYear" value={dData.avgFlightsPerYear} onChange={handleChange} />
        </label>
      </div>

      <button onClick={handleCalculate}>Calculate</button>

      {results && (
        <ul className="results">
          <li><strong>Annual Vehicle Share Trips - Lower:</strong> {results.vehicleShareLower.toLocaleString()}</li>
          <li><strong>Annual Vehicle Share Trips - Upper:</strong> {results.vehicleShareUpper.toLocaleString()}</li>
          <li><strong>Annual UAV Flights - Lower:</strong> {results.annualUAVFlightsLower.toLocaleString()}</li>
          <li><strong>Annual UAV Flights - Upper:</strong> {results.annualUAVFlightsUpper.toLocaleString()}</li>
          <li><strong>Annual UAVs - Lower:</strong> {results.annualUAVsLower.toFixed(2)}</li>
          <li><strong>Annual UAVs - Upper:</strong> {results.annualUAVsUpper.toFixed(2)}</li>
        </ul>
      )}
    </section>
  );
}
