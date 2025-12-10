# SkyTrade UAV Volume Estimate Tool

## Description

The SkyTrade UAV Volume Estimate Tool is a comprehensive React-based web application designed to estimate and analyze UAV (Unmanned Aerial Vehicle, commonly known as drone) volumes across various sectors. It helps stakeholders in aviation, urban planning, and emergency services to forecast UAV usage, assess financial impacts, and plan infrastructure needs. The tool integrates data from Excel spreadsheets, provides interactive maps, and generates charts for data visualization.

Key functionalities include:

- Volume estimation for recreational, commercial, and industrial UAV operations.
- Financial modeling for UAV-related investments and revenues.
- Infrastructure planning for UAV support systems.
- Interactive mapping for scorecard visualization.

## Features

The tool is based on the UAV Volume Estimate Tool v1.0.3 Excel spreadsheet, providing detailed calculations for UAV volumes across various sectors. Below are the detailed descriptions for each section from A to K, including inputs, what the section does, and outputs. Note that some inputs are reused from Section A (e.g., population, operational days per week, operational weeks per year).

- **Section A: General Inputs**
  - Inputs: Operational hours per day, operational days per week, operational weeks per year, operational time in flight percentage, average hours per flight, average overhead hours per flight, average velocity, coverage width per path, max structures per week.
  - What it does: Calculates operational hours per year, flights per year, covered linear path per flight, covered area per flight (hectares), max annual structures.
  - Outputs: Operational hours per year, flights per year, covered linear path per flight, covered area per flight (hectares), max annual structures.

- **Section B: Recreational Use**
  - Inputs: Population (reused from A), UAV percentage of population (lower and upper), average flights per month per UAV.
  - What it does: Estimates UAV usage for recreational purposes by calculating UAVs and annual flights based on population percentages and flight frequency.
  - Outputs: Estimated UAVs (lower and upper), annual UAV flights (lower and upper).

- **Section C: Commercial Delivery Use**
  - Inputs: Population (reused from A), operational days per week (reused from A), operational weeks per year (reused from A), annual tonnes commercial delivery, manufactured goods percentage, UAV potential percentage, average kg per delivery, average flights per day, UAV capacity percentage (lower and upper).
  - What it does: Analyzes UAV potential in commercial delivery by calculating maximum capacity tonnes, flights, and UAVs based on goods volume and capacity percentages.
  - Outputs: Annual UAV tonnes max, annual UAV flights max, average flights per UAV per year, annual flights lower, annual flights upper, annual UAVs lower, annual UAVs upper.

- **Section D: Urban Air Mobility**
  - Inputs: Total annual vehicle trips, vehicle share percentage (lower and upper), UAV capacity percentage (lower and upper), average flights per year.
  - What it does: Forecasts UAV usage in urban transportation by calculating vehicle share trips and UAV flights/UAVs based on trip shares and capacity percentages.
  - Outputs: Annual vehicle share trips (lower and upper), annual UAV flights (lower and upper), annual UAVs (lower and upper).

- **Section E: Agriculture Use**
  - Inputs: Agriculture land hectares, agriculture land locations, agriculture land coverage times per year, cropland hectares, cropland locations, cropland coverage times per year, forest and parks hectares, forest and parks locations, forest and parks coverage times per year, max annual area per UAV hectares, max annual flights per UAV, UAV capacity percentage (lower and upper).
  - What it does: Estimates UAV usage for agricultural monitoring by calculating UAV locations, hectares per location, flights per location, UAVs per location, and total capacity estimates.
  - Outputs: UAV locations, hectares per location, annual UAV flights per location, UAV per location, total max capacity flights, UAVs, annual flights per UAV, estimates annual UAV flights (lower and upper), annual UAVs (lower and upper).

- **Section F: Linear Inspection**
  - Inputs: Various linear infrastructures (km, coverage times per year), max linear path per UAV, covered linear path per flight, UAV flights per year, UAV capacity percentage (lower and upper).
  - What it does: Estimates UAV usage for inspecting linear infrastructure by calculating UAV locations, km per location, flights per location, UAVs per location, and total capacity estimates.
  - Outputs: UAV locations, km per location, annual flights per location, UAVs per location, total flights, total UAVs, annual flights per UAV, annual flights lower, annual flights upper, annual UAVs lower, annual UAVs upper.

- **Section G: Structure Inspection**
  - Inputs: Various structures (structures, coverage times per year), max structures per UAV, coverage structures per flight, UAV flights per year, UAV capacity percentage (lower and upper).
  - What it does: Estimates UAV usage for inspecting structures by calculating UAV locations, structures per location, flights per location, UAVs per location, and total capacity estimates.
  - Outputs: UAV locations, structures per location, annual flights per location, total flights, UAVs per location, total UAVs for type, total flights, total UAVs, annual flights per UAV, annual flights lower, annual flights upper, annual UAVs lower, annual UAVs upper.

- **Section H: Emergency Response**
  - Inputs: Impacted area per emergency event, annual emergency response events, coverage percentages and times for various activities, coverage rates, average percentage of events served per UAV, UAV capacity percentage (lower and upper).
  - What it does: Estimates UAV usage in emergency scenarios by calculating coverage areas, flights, and UAVs per activity and total capacity estimates.
  - Outputs: Total coverage area, average area per flight, total flights, total UAVs, annual flights lower, annual flights upper, annual UAVs lower, annual UAVs upper.

- **Section I: Other**
  - Inputs: Lower and upper bounds and flights per UAV for recreational, commercial, urban, agriculture, linear, structure, emergency, other percentage.
  - What it does: Aggregates UAV applications not covered in other sections, calculating totals and percentages.
  - Outputs: Lower bound, percentage of total, upper bound, percentage of total, flights per UAV for each category and total.

- **Section J: Distributions by Vehicle Type**
  - Inputs: Distribution percentages (small, medium), lower flights, upper flights, flights per UAV for each use case, other fraction, other annual flights per UAV.
  - What it does: Categorizes UAV volumes by vehicle size and type, calculating distributions, flights, and UAVs.
  - Outputs: Vehicle type distributions, annual flights (lower and upper), annual UAVs (lower and upper).

- **Section K: Chart Calculations**
  - Inputs: Annual flights and UAVs (lower and upper) for small, medium, large vehicle types.
  - What it does: Prepares rounded data for charting with levels in between.
  - Outputs: Rounded annual flights and UAVs for charting.

- **Financial Impact Module**
  - Inputs: Average revenue per delivery, average ticket per UAM trip, average revenue per inspection, average fee per recreational flight, annual permit fees for small UAVs and air taxis, revenue share percentages (owners, protocol, city), economic multiplier, average industry salary, reused volumes from other sections (flights and UAVs for delivery, UAM, inspection, recreational).
  - What it does: Calculates flight revenues, permit fees, revenue allocations, economic impact, and job estimates based on UAV operations.
  - Outputs: Total market revenue, total city revenue, estimated jobs, revenue allocation table, revenue mix chart.

- **Infrastructure Fiscal Module**
  - Inputs: Average cost per vertiport, average cost per delivery hub, annual trips per vertiport, annual deliveries per hub, sales tax rate, average value of goods delivered, reused volumes from other sections (flights for delivery and UAM, revenues for UAM).
  - What it does: Estimates required infrastructure (vertiports and hubs) and calculates capital expenditures and tax revenues from UAV-related activities.
  - Outputs: Vertiports required, delivery hubs required, total infrastructure investment, estimated annual sales tax revenue, fiscal mix chart.

- **Drone Scorecard Map**
  - Inputs: Excel file data (drone_scorecard_2025_update_FINAL.xlsx) containing state scores, rankings, and category breakdowns.
  - What it does: Displays interactive maps comparing 2023 and 2025 state readiness scores, allows selection of states and factors for detailed visualization, including rankings and radar charts.
  - Outputs: Visual maps with color-coded scores, state rankings table, radar chart for selected state's category breakdown.

- **Data Integration**: Import and export data from Excel files using the XLSX library, supporting file: drone_scorecard_2025_update_FINAL.xlsx.

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

1. Clone the repository:
   ```bash
   git clone https://github.com/yosSaziz940/UAV-calculations-tool.git
   cd uav-volume-tool-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) If you need to build for production:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`.

## Usage

1. Launch the application by running `npm start`.
2. Use the sidebar to navigate between sections.
3. Start with Section A to input general parameters that affect all calculations.
4. Explore sector-specific sections (B-I) to view volume estimates.
5. Analyze distributions in Section J and visualize data in Section K.
6. Access advanced modules: Financial Impact, Infrastructure Fiscal, and Drone Scorecard Map.
7. Import data from Excel files in the public/data directory for customized analysis.

## Project Structure

```
uav-volume-tool-react/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   ├── logo.svg
│   ├── logo192.png
│   ├── logo512.png
│   ├── icon.svg
│   ├── Dronescorecard.pdf
│   └── data/
│       ├── drone_report_master_2023_spreadsheet.xlsx
│       └── drone_scorecard_2025_update_FINAL.xlsx
├── src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   └── components/
│       ├── sectionA.js
│       ├── sectionB.js
│       ├── sectionC.js
│       ├── sectionD.js
│       ├── sectionE.js
│       ├── sectionF.js
│       ├── sectionG.js
│       ├── sectionH.js
│       ├── sectionI.js
│       ├── sectionJ.js
│       ├── sectionK.js
│       ├── FinancialImpactModule.js
│       ├── InfrastructureFiscalModule.js
│       └── DroneScorecardMap.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

- **public/**: Contains static assets, HTML entry point, icons, and data files.
- **src/**: Source code directory.
  - **App.js**: Main application component with sidebar navigation and section rendering.
  - **components/**: Modular components for each section and module.
- **package.json**: Project configuration and dependencies.

## Technologies

- **Frontend**: React 18.2.0
- **Mapping**: Mapbox GL 3.17.0, React Map GL 7.0.16
- **Charts**: Chart.js 4.5.1, React-Chartjs-2 5.3.1, Recharts 3.5.0
- **Data Handling**: XLSX 0.18.5
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App (React Scripts 5.0.1)

## Dependencies

- **Core**: React 18.2.0, React DOM 18.2.0
- **Mapping**: mapbox-gl 3.17.0, react-map-gl 7.0.16
- **Visualization**: chart.js 4.5.1, react-chartjs-2 5.3.1, recharts 3.5.0
- **Utilities**: web-vitals 2.1.4, xlsx 0.18.5
- **Dev Dependencies**: @testing-library/jest-dom 5.16.5, @testing-library/react 13.4.0, @testing-library/user-event 14.4.3

