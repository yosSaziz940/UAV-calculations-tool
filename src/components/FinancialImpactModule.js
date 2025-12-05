import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


function fmtCurrency(n) {
  if (isNaN(n)) return "-";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}


const defaultVolumes = {
  Vol_Delivery: { flightsLow: 9525600, flightsHigh: 23814000, uavsLow: 39690, uavsHigh: 99225 },
  Vol_UAM: { flightsLow: 23400000, flightsHigh: 253500000, uavsLow: 3900, uavsHigh: 42250 },
  Vol_Inspection: { flightsLow: 38902, flightsHigh: 38917, uavsLow: 110, uavsHigh: 1094 },
  Vol_Rec: { flightsLow: 917280, flightsHigh: 2076360 },
};

const volumeLabels = {
  flightsLow: "Flights (Low)",
  flightsHigh: "Flights (High)",
  uavsLow: "UAVs (Low)",
  uavsHigh: "UAVs (High)"
};

export default function FinancialImpactModule() {
  const [bound, setBound] = useState("low");
  const [showResults, setShowResults] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [volumes, setVolumes] = useState(defaultVolumes);

  
  const [inputs, setInputs] = useState({
    price_delivery: 7.0,       // Avg. Revenue per Delivery
    price_uam: 180.0,           // Avg. Ticket per UAM Trip
    price_inspection: 75.0,     // Avg. Revenue per Inspection
    price_rec: 0.5,             // Avg. Fee per Rec Flight
    fee_permit_drone: 100.0,    // Annual Permit (Small UAV)
    fee_permit_uam: 5000.0,     // Annual Permit (Air Taxi)
    split_owners: 70.0,         // Corridor Owner Share
    split_protocol: 30.0,       // Protocol Ops Share
    split_city: 70.0,           // City % of Owner Share
    econ_multiplier: 2.5,       // Economic Multiplier
    avg_salary: 75000,          // Avg. Industry Salary
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleVolumeChange = (cat, key, value) => {
    setVolumes((prev) => ({
      ...prev,
      [cat]: { ...prev[cat], [key]: parseFloat(value) || 0 },
    }));
  };

  const calculate = () => setShowResults(true);

 
  const getFlightsLow = (obj) => (obj && obj.flightsLow) || 0;
  const getFlightsHigh = (obj) => (obj && obj.flightsHigh) || 0;
  const getUavsLow = (obj) => (obj && obj.uavsLow) || 0;
  const getUavsHigh = (obj) => (obj && obj.uavsHigh) || 0;


  const { 
    price_delivery, price_uam, price_inspection, price_rec,
    fee_permit_drone, fee_permit_uam,
    split_owners, split_protocol, split_city,
    econ_multiplier, avg_salary
  } = inputs;

 
  const Vol_Delivery_Low = getFlightsLow(volumes.Vol_Delivery);
  const Vol_Delivery_High = getFlightsHigh(volumes.Vol_Delivery);
  const UAVs_Delivery_Low = getUavsLow(volumes.Vol_Delivery);
  const UAVs_Delivery_High = getUavsHigh(volumes.Vol_Delivery);


  const Vol_UAM_Low = getFlightsLow(volumes.Vol_UAM);
  const Vol_UAM_High = getFlightsHigh(volumes.Vol_UAM);
  const UAVs_UAM_Low = getUavsLow(volumes.Vol_UAM);
  const UAVs_UAM_High = getUavsHigh(volumes.Vol_UAM);

  
  const Vol_Inspection_Low = getFlightsLow(volumes.Vol_Inspection);
  const Vol_Inspection_High = getFlightsHigh(volumes.Vol_Inspection);
  const UAVs_Inspection_Low = getUavsLow(volumes.Vol_Inspection);
  const UAVs_Inspection_High = getUavsHigh(volumes.Vol_Inspection);


  const Vol_Rec_Low = getFlightsLow(volumes.Vol_Rec);
  const Vol_Rec_High = getFlightsHigh(volumes.Vol_Rec);


  const Rev_Flight_Delivery_Low = Vol_Delivery_Low * price_delivery;
  const Rev_Flight_UAM_Low = Vol_UAM_Low * price_uam;
  const Rev_Flight_Insp_Low = Vol_Inspection_Low * price_inspection;
  const Rev_Flight_Rec_Low = Vol_Rec_Low * price_rec;
  const Total_Flight_Fees_Low =
    Rev_Flight_Delivery_Low + Rev_Flight_UAM_Low + Rev_Flight_Insp_Low + Rev_Flight_Rec_Low;

  const Rev_Flight_Delivery_High = Vol_Delivery_High * price_delivery;
  const Rev_Flight_UAM_High = Vol_UAM_High * price_uam;
  const Rev_Flight_Insp_High = Vol_Inspection_High * price_inspection;
  const Rev_Flight_Rec_High = Vol_Rec_High * price_rec;
  const Total_Flight_Fees_High =
    Rev_Flight_Delivery_High + Rev_Flight_UAM_High + Rev_Flight_Insp_High + Rev_Flight_Rec_High;


  const Count_Small_UAVs_Low = UAVs_Delivery_Low + UAVs_Inspection_Low;
  const Total_Permits_Low = Count_Small_UAVs_Low * fee_permit_drone + UAVs_UAM_Low * fee_permit_uam;

  const Count_Small_UAVs_High = UAVs_Delivery_High + UAVs_Inspection_High;
  const Total_Permits_High = Count_Small_UAVs_High * fee_permit_drone + UAVs_UAM_High * fee_permit_uam;


  const Alloc_Protocol_Low = Total_Flight_Fees_Low * (split_protocol / 100);
  const Alloc_Owner_Low = Total_Flight_Fees_Low * (split_owners / 100);
  const Alloc_City_Corridor_Low = Alloc_Owner_Low * (split_city / 100);
  const Alloc_Private_Corridor_Low = Alloc_Owner_Low * (1 - split_city / 100);
  const Total_City_Rev_Low = Alloc_City_Corridor_Low + Total_Permits_Low;

  const Alloc_Protocol_High = Total_Flight_Fees_High * (split_protocol / 100);
  const Alloc_Owner_High = Total_Flight_Fees_High * (split_owners / 100);
  const Alloc_City_Corridor_High = Alloc_Owner_High * (split_city / 100);
  const Alloc_Private_Corridor_High = Alloc_Owner_High * (1 - split_city / 100);
  const Total_City_Rev_High = Alloc_City_Corridor_High + Total_Permits_High;

  const GEA_Low = (Total_Flight_Fees_Low + Total_Permits_Low) * econ_multiplier;
  const Jobs_Low = Math.round(GEA_Low / avg_salary);
  const GEA_High = (Total_Flight_Fees_High + Total_Permits_High) * econ_multiplier;
  const Jobs_High = Math.round(GEA_High / avg_salary);

  const Grand_Total_Low = Total_Flight_Fees_Low + Total_Permits_Low;
  const Grand_Total_High = Total_Flight_Fees_High + Total_Permits_High;


  const Summary_TotalMarketRevenue = bound === "low" ? Grand_Total_Low : Grand_Total_High;
  const Summary_TotalCityRevenue = bound === "low" ? Total_City_Rev_Low : Total_City_Rev_High;
  const Summary_Jobs = bound === "low" ? Jobs_Low : Jobs_High;

  const revenueData = [
    { name: "Delivery", value: bound === "low" ? Rev_Flight_Delivery_Low : Rev_Flight_Delivery_High },
    { name: "UAM", value: bound === "low" ? Rev_Flight_UAM_Low : Rev_Flight_UAM_High },
    { name: "Inspection", value: bound === "low" ? Rev_Flight_Insp_Low : Rev_Flight_Insp_High },
    { name: "Recreational", value: bound === "low" ? Rev_Flight_Rec_Low : Rev_Flight_Rec_High },
    { name: "Permits", value: bound === "low" ? Total_Permits_Low : Total_Permits_High },
  ];

  return (
    <section className="card">
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>Financial & Economic Impact</h2>

 
      <div className="grid">
  
        {["price_delivery","price_uam","price_inspection","price_rec"].map((key) => (
          <label key={key}>
            <span>{
              {
                price_delivery: "Avg. Revenue per Delivery",
                price_uam: "Avg. Ticket per UAM Trip",
                price_inspection: "Avg. Revenue per Inspection",
                price_rec: "Avg. Fee per Rec Flight"
              }[key]
            }</span>
            <input type="number" name={key} value={inputs[key]} onChange={handleInputChange} />
          </label>
        ))}


        {["fee_permit_drone","fee_permit_uam"].map((key) => (
          <label key={key}>
            <span>{
              {
                fee_permit_drone: "Annual Permit (Small UAV)",
                fee_permit_uam: "Annual Permit (Air Taxi)"
              }[key]
            }</span>
            <input type="number" name={key} value={inputs[key]} onChange={handleInputChange} />
          </label>
        ))}

        {["split_owners","split_protocol","split_city"].map((key) => (
          <label key={key}>
            <span>{
              {
                split_owners: "Corridor Owner Share",
                split_protocol: "Protocol Ops Share",
                split_city: "City % of Owner Share"
              }[key]
            }</span>
            <input type="number" name={key} value={inputs[key]} onChange={handleInputChange} />
          </label>
        ))}

        {["econ_multiplier","avg_salary"].map((key) => (
          <label key={key}>
            <span>{
              {
                econ_multiplier: "Economic Multiplier",
                avg_salary: "Avg. Industry Salary"
              }[key]
            }</span>
            <input type="number" name={key} value={inputs[key]} onChange={handleInputChange} />
          </label>
        ))}

        {Object.keys(volumes).map((cat) =>
          Object.keys(volumes[cat]).map((key) => (
            <label key={`${cat}_${key}`}>
              <span>{cat.replace("Vol_","")} {volumeLabels[key]}</span>
              <input
                type="number"
                value={volumes[cat][key]}
                onChange={(e) => handleVolumeChange(cat, key, e.target.value)}
              />
            </label>
          ))
        )}
      </div>

      <button onClick={calculate}>Calculate</button>

      {showResults && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => { setBound("low"); setShowDetails(false); }}
            style={{
              padding: "8px 14px",
              marginRight: 8,
              background: bound === "low" ? "#007bff" : "#ddd",
              color: bound === "low" ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}>Lower Bound</button>

          <button onClick={() => { setBound("high"); setShowDetails(false); }}
            style={{
              padding: "8px 14px",
              marginRight: 8,
              background: bound === "high" ? "#007bff" : "#ddd",
              color: bound === "high" ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}>Upper Bound</button>
          <br />
          <button onClick={() => setShowDetails((s) => !s)}
            style={{
              padding: "8px 14px",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}>{showDetails ? "Hide Details" : `Show Details (${bound === "low" ? "Lower" : "Upper"})`}</button>
        </div>
      )}

      {showResults && (
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Card label="Total Market Revenue" value={fmtCurrency(Summary_TotalMarketRevenue)} />
          <Card label="Total City Revenue" value={fmtCurrency(Summary_TotalCityRevenue)} />
          <Card label="Estimated Jobs" value={Summary_Jobs} />
        </div>
      )}

      {/* --- Revenue Allocation Table --- */}
      {showResults && (
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Revenue Allocation Table (Ohio Model)</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 6, overflow: "hidden" }}>
            <tbody>
              <tr>
                <td style={{ padding: 8 }}>Total Flight Fees</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Total_Flight_Fees_Low : Total_Flight_Fees_High)}</td>
              </tr>
              <tr>
                <td style={{ padding: 8 }}>Total Permit Fees</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Total_Permits_Low : Total_Permits_High)}</td>
              </tr>
              <tr style={{ borderTop: "1px solid #e5e7eb", fontWeight: 600 }}>
                <td style={{ padding: 8 }}>GRAND TOTAL</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Grand_Total_Low : Grand_Total_High)}</td>
              </tr>

              <tr style={{ height: 8 }} />
              <tr>
                <td style={{ padding: 8 }}>Protocol Operations ({split_protocol}%)</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Alloc_Protocol_Low : Alloc_Protocol_High)}</td>
              </tr>
              <tr>
                <td style={{ padding: 8 }}>Corridor Owners ({split_owners}%)</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Alloc_Owner_Low : Alloc_Owner_High)}</td>
              </tr>
              <tr>
                <td style={{ padding: 8}}>City Share({split_city}%)</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Alloc_City_Corridor_Low : Alloc_City_Corridor_High)}</td>
              </tr>
              <tr>
                <td style={{ padding: 8}}>Private Share</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Alloc_Private_Corridor_Low : Alloc_Private_Corridor_High)}</td>
              </tr>

              <tr style={{ borderTop: "1px solid #e5e7eb", fontWeight: 600 }}>
                <td style={{ padding: 8 }}>TOTAL CITY REVENUE</td>
                <td style={{ padding: 8, textAlign: "right" }}>{fmtCurrency(bound === "low" ? Total_City_Rev_Low : Total_City_Rev_High)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {showResults && showDetails && (
        <div style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Detailed Calculations — {bound === "low" ? "Lower" : "Upper"} Bound</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 6, overflow: "hidden" }}>
            <tbody>
              {[
                ["Delivery Revenue", bound === "low" ? Rev_Flight_Delivery_Low : Rev_Flight_Delivery_High],
                ["UAM Revenue", bound === "low" ? Rev_Flight_UAM_Low : Rev_Flight_UAM_High],
                ["Inspection Revenue", bound === "low" ? Rev_Flight_Insp_Low : Rev_Flight_Insp_High],
                ["Recreational Revenue", bound === "low" ? Rev_Flight_Rec_Low : Rev_Flight_Rec_High],
                ["Total Flight Fees", bound === "low" ? Total_Flight_Fees_Low : Total_Flight_Fees_High],
                ["Total Permit Fees", bound === "low" ? Total_Permits_Low : Total_Permits_High],
                ["Grand Total (Market)", bound === "low" ? Grand_Total_Low : Grand_Total_High],
                
              ].map(([label, val]) => (
                <tr key={label}>
                  <td style={{ padding: 8 }}>{label}</td>
                  <td style={{ padding: 8, textAlign: "right" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showResults && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Revenue Mix Chart ({bound === "low" ? "Lower" : "Upper"} Bound)</h4>
          <PieChart width={520} height={320}>
            <Pie
              key={bound}
              data={revenueData}
              cx={260}
              cy={160}
              outerRadius={100}
              innerRadius={60}
              dataKey="value"
              nameKey="name"
            >
              {revenueData.map((_, i) => (
                <Cell key={i} fill={["#ff6b6b", "#ffb74d", "#4db6ac", "#4d79ff", "#9c27b0"][i % 5]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => fmtCurrency(v)} />
            <Legend />
          </PieChart>
        </div>
      )}
    </section>
  );
}

function Card({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 180, border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

