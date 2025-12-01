import React, { useState } from "react"; 

export default function SectionI() {
  const [inputs, setInputs] = useState({
    recreational: { lower: 917280, upper: 2076360, perUAV: 24 },
    commercial: { lower: 9525600, upper: 23814000, perUAV: 240 },
    urban: { lower: 23400000, upper: 253500000, perUAV: 6000 },
    agriculture: { lower: 6, upper: 56, perUAV: 11 },
    linear: { lower: 33, upper: 333, perUAV: 83 },
    structure: { lower: 20763, upper: 207628, perUAV: 655 },
    emergency: { lower: 18100, upper: 181000, perUAV: 236 },
    otherPct: 0.001, // 0.10% as decimal
  });

  const [showResults, setShowResults] = useState(false);

  const handleChange = (section, field, value) => {
    setInputs(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: parseFloat(value) || 0 }
    }));
  };

  const computeTotals = () => {
    const sections = [
      "recreational",
      "commercial",
      "urban",
      "agriculture",
      "linear",
      "structure",
      "emergency",
    ];

    const sumLower = sections.reduce((acc, s) => acc + inputs[s].lower, 0);
    const sumUpper = sections.reduce((acc, s) => acc + inputs[s].upper, 0);

    const otherLower = (inputs.otherPct * sumLower) / (1 - inputs.otherPct);
    const otherUpper = (inputs.otherPct * sumUpper) / (1 - inputs.otherPct);
    const otherPerUAV = Math.round(
      sections.reduce((acc, s) => acc + inputs[s].perUAV, 0) / sections.length
    );

    const totalLower = sumLower + otherLower;
    const totalUpper = sumUpper + otherUpper;

    const results = sections.map(s => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      lower: inputs[s].lower,
      lowerPct: (inputs[s].lower / totalLower) * 100,
      upper: inputs[s].upper,
      upperPct: (inputs[s].upper / totalUpper) * 100,
      perUAV: inputs[s].perUAV,
    }));

    results.push({
      name: "Other",
      lower: otherLower,
      lowerPct: (otherLower / totalLower) * 100,
      upper: otherUpper,
      upperPct: (otherUpper / totalUpper) * 100,
      perUAV: otherPerUAV,
    });

    results.push({
      name: "Total",
      lower: totalLower,
      lowerPct: 100,
      upper: totalUpper,
      upperPct: 100,
      perUAV: "-",
    });

    return results;
  };

  const handleCalculate = () => setShowResults(true);

  return (
    <section className="card">
      <h2>I. Annual UAV Flights Summary</h2>

      <div class="grid">
        {Object.keys(inputs).map(key =>
          key !== "otherPct" ? (
            <div key={key}>
              <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <label >
                Lower Bound
                <input
                  type="number"
                  value={inputs[key].lower}
                  onChange={e => handleChange(key, "lower", e.target.value)}
                 
                />
              </label>
              <label >
                Upper Bound
                <input
                  type="number"
                  value={inputs[key].upper}
                  onChange={e => handleChange(key, "upper", e.target.value)}
                 
                />
              </label>
              <label >
                Flights per UAV
                <input
                  type="number"
                  value={inputs[key].perUAV}
                  onChange={e => handleChange(key, "perUAV", e.target.value)}
                 
                />
              </label>
            </div>
          ) : (
            <div key={key}>
              <h3>Other %</h3>
              <input
                type="number"
                value={inputs.otherPct * 100}
                onChange={e => setInputs(prev => ({ ...prev, otherPct: parseFloat(e.target.value) / 100 }))}
             
              />
            </div>
          )
        )}
      </div>

      <button
        onClick={handleCalculate}
     
      >
        Calculate
      </button>

      {showResults && (
        <table >
          <thead>
            <tr>
              <th >Category</th>
              <th >Lower Bound</th>
              <th >% of Total</th>
              <th >Upper Bound</th>
              <th >% of Total</th>
              <th >Annual Flights per UAV</th>
            </tr>
          </thead>
          <tbody>
            {computeTotals().map((r, idx) => (
              <tr key={idx}>
                <td >{r.name}</td>
                <td >{Math.round(r.lower)}</td>
                <td >{r.lowerPct.toFixed(2)}%</td>
                <td >{Math.round(r.upper)}</td>
                <td >{r.upperPct.toFixed(2)}%</td>
                <td >{r.perUAV}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
