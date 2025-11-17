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

function App() {
  const [activeSection, setActiveSection] = useState("A. General Inputs");
  
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
    maxKmPerUAV: 250,       // for sections F/G
    coveredLinearPathPerFlight: 20, 
    maxStructuresPerUAV: 336,
    dailyAreaPerFlight: 2,    // for H
    avgEventServedPct: 50
  });

  return (
    <div className="dashboard">
     
      <aside className="sidebar">
        <div className="sidebar-logo">
    <img src="./icon.svg" alt="SkyTrade Logo" />
  </div>
        <h2>UAV Volume Tool</h2>
        {["A. General Inputs","B. Recreational Use","C. Commercial Delivery Use",
        "D. Urban Air Mobility","E. Agriculture Use","F. Linear Inspection","G. Structure Inspection",
        "H. Emergency Response","I. Other","J. Distributions by Vehicle Type","K. Chart Calculations"].map(sec => (
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
        {activeSection === "K. Chart Calculations" && <SectionK flightsBase={{
    small: 750000,
    medium: 7500000,
    large: 22500000,
  }}
  flightsUpperSource={{
    small: 2500000,
    medium: 25000000,
    large: 275000000,
  }}
  uavsBase={{
    small: 25000,
    medium: 25000,
    large: 2500,
  }}
  uavsUpperSource={{
    small: 87500,
    medium: 100000,
    large: 42500,
  }}
/>}
 
  

      
      </main>
    </div>
  );
}

export default App;
