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

  const results = computeTotals();

  return (
    <section className="card p-4">
      <h2 className="text-xl font-semibold mb-4">I. Annual UAV Flights Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {Object.keys(inputs).map(key =>
          key !== "otherPct" ? (
            <div key={key} className="border p-2 rounded">
              <h3 className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <label className="flex flex-col text-xs mt-1">
                Lower Bound
                <input
                  type="number"
                  value={inputs[key].lower}
                  onChange={e => handleChange(key, "lower", e.target.value)}
                  className="border rounded p-1 text-xs"
                />
              </label>
              <label className="flex flex-col text-xs mt-1">
                Upper Bound
                <input
                  type="number"
                  value={inputs[key].upper}
                  onChange={e => handleChange(key, "upper", e.target.value)}
                  className="border rounded p-1 text-xs"
                />
              </label>
              <label className="flex flex-col text-xs mt-1">
                Flights per UAV
                <input
                  type="number"
                  value={inputs[key].perUAV}
                  onChange={e => handleChange(key, "perUAV", e.target.value)}
                  className="border rounded p-1 text-xs"
                />
              </label>
            </div>
          ) : (
            <div key={key} className="border p-2 rounded">
              <h3 className="font-semibold">Other %</h3>
              <input
                type="number"
                value={inputs.otherPct * 100}
                onChange={e => setInputs(prev => ({ ...prev, otherPct: parseFloat(e.target.value) / 100 }))}
                className="border rounded p-1 text-xs"
              />
            </div>
          )
        )}
      </div>

      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Lower Bound</th>
            <th className="border px-2 py-1">% of Total</th>
            <th className="border px-2 py-1">Upper Bound</th>
            <th className="border px-2 py-1">% of Total</th>
            <th className="border px-2 py-1">Annual Flights per UAV</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="border px-2 py-1">{r.name}</td>
              <td className="border px-2 py-1">{Math.round(r.lower)}</td>
              <td className="border px-2 py-1">{r.lowerPct.toFixed(2)}%</td>
              <td className="border px-2 py-1">{Math.round(r.upper)}</td>
              <td className="border px-2 py-1">{r.upperPct.toFixed(2)}%</td>
              <td className="border px-2 py-1">{r.perUAV}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
