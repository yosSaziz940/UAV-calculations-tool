import React, { useState } from "react";
import SectionA from "./components/sectionA";
import SectionB from "./components/sectionB";
import SectionC from "./components/sectionC";
import SectionD from "./components/sectionD";
import SectionE from "./components/sectionE";
import SectionF from "./components/sectionF";
import SectionG from "./components/sectionG";
import SectionH from "./components/sectionH";
import SectionI from "./components/sectionI";
import SectionJ from "./components/sectionJ";
import SectionK from "./components/sectionK";
import FinancialImpactModule from "./components/FinancialImpactModule";
import InfrastructureFiscalModule from "./components/InfrastructureFiscalModule";

function App() {
  const [activeSection, setActiveSection] = useState("A. General Inputs");
  const defaultVolumes = {
  delivery: { flightsLow: 9525600, flightsHigh: 23814000, uavsLow: 39690, uavsHigh: 99225 },
  uam: { flightsLow: 23400000, flightsHigh: 253500000, uavsLow: 3900, uavsHigh: 42250 },
  inspection_total: { flightsLow: 38902, flightsHigh: 38917, uavsLow: 110, uavsHigh: 1094 },
  rec: { flightsLow: 917280, flightsHigh: 2076360 },};
  
  const [inputs, setInputs] = useState({
    year: 2049,
    population: 6500000,
    operationalHoursPerDay: 6,
    operationalDaysPerWeek: 5,
    operationalWeeksPerYear: 48,
    operationalTimeInFlightPct: 70,
    averageHoursPerFlight: 1,
    averageOverheadHoursPerFlight: 0.5,
    averageVelocity: 20,
    coverageWidthPerPath: 100,
    maxStructuresPerWeek: 7,
    maxKmPerUAV: 250,       
    coveredLinearPathPerFlight: 20, 
    dailyAreaPerFlight: 2,   
    avgEventServedPct: 50
  });

  // **State to hold calculated UAM revenue from FinancialImpactModule**
  const [calculatedRevUAM, setCalculatedRevUAM] = useState(0);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="./icon.svg" alt="SkyTrade Logo" />
        </div>
        <h2>UAV Volume Tool</h2>
        {[
          "A. General Inputs","B. Recreational Use","C. Commercial Delivery Use",
          "D. Urban Air Mobility","E. Agriculture Use","F. Linear Inspection",
          "G. Structure Inspection","H. Emergency Response","I. Other",
          "J. Distributions by Vehicle Type","K. Chart Calculations",
          "L. FinancialImpactModule", "M. InfrastructureFiscalModule"
        ].map(sec => (
          <button 
            key={sec} 
            className={activeSection === sec ? "active" : ""}
            onClick={() => setActiveSection(sec)}
          >
            {sec}
          </button>
        ))}
      </aside>

      <main className="content">
        {activeSection === "A. General Inputs" && <SectionA inputs={inputs} setInputs={setInputs} />}
        {activeSection === "B. Recreational Use" && <SectionB inputs={inputs} />}
        {activeSection === "C. Commercial Delivery Use" && <SectionC inputs={inputs} />}
        {activeSection === "D. Urban Air Mobility" && <SectionD inputs={inputs} />}
        {activeSection === "E. Agriculture Use" && <SectionE inputs={inputs} />}
        {activeSection === "F. Linear Inspection" && <SectionF inputs={inputs} />}
        {activeSection === "G. Structure Inspection" && <SectionG inputs={inputs} />}
        {activeSection === "H. Emergency Response" && <SectionH inputs={inputs} />}
        {activeSection === "I. Other" && <SectionI inputs={inputs} />}
        {activeSection === "J. Distributions by Vehicle Type" && <SectionJ inputs={inputs} />}
        {activeSection === "K. Chart Calculations" && <SectionK />}
        {activeSection === "L. FinancialImpactModule" && 
        
        <FinancialImpactModule 
          volumes={defaultVolumes} 
          onRevUAMChange={setCalculatedRevUAM}
        />}

        {activeSection === "M. InfrastructureFiscalModule" &&
        <InfrastructureFiscalModule 
          volumes={defaultVolumes} 
          rev_uam={calculatedRevUAM}
        />}
      </main>
    </div>
  );
}

export default App;
