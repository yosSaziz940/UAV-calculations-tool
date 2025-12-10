# UAV Volume Estimate Tool

## Description

The UAV Volume Estimate Tool is a comprehensive React-based web application designed to estimate and analyze UAV volumes across various sectors. It helps stakeholders in aviation, urban planning, and emergency services to forecast UAV usage, assess financial impacts, and plan infrastructure needs. The tool integrates data from Excel spreadsheets, provides interactive maps, and generates charts for data visualization.

Key functionalities include:

- Volume estimation for recreational, commercial, and industrial UAV operations.
- Financial modeling for UAV-related investments and revenues.
- Infrastructure planning for UAV support systems.
- Interactive mapping for scorecard visualization.

## Features

- **General Inputs (Section A)**: Configure fundamental parameters such as target year, population size, operational hours per day, days per week, weeks per year, flight time percentages, average flight hours, overhead hours, velocity, coverage width, structures per week, max km per UAV, linear paths, daily area, and event percentages.
- **Sector-Specific Modules**:
  - **Section B: Recreational Use**: Estimates volumes for hobbyist and leisure UAV activities.
  - **Section C: Commercial Delivery Use**: Analyzes UAV usage in delivery services.
  - **Section D: Urban Air Mobility**: Forecasts UAV roles in urban transportation.
  - **Section E: Agriculture Use**: Estimates for farming and crop monitoring.
  - **Section F: Linear Inspection**: For infrastructure like pipelines and power lines.
  - **Section G: Structure Inspection**: For buildings and industrial sites.
  - **Section H: Emergency Response**: UAVs in disaster management and search operations.
  - **Section I: Other**: Miscellaneous UAV applications.
  - **Section J: Distributions by Vehicle Type**: Breakdown of UAV volumes by different vehicle categories.
  - **Section K: Chart Calculations**: Generate and display charts for data analysis using Chart.js and Recharts.
  - **Financial Impact Module**: Detailed financial analysis including costs, revenues, and ROI for UAV operations.
  - **Infrastructure Fiscal Module**: Planning for fiscal aspects of UAV infrastructure like charging stations and air traffic control.
  - **Drone Scorecard Map**: An interactive map powered by Mapbox GL to visualize drone scorecards and data points.
- **Data Integration**: Import data from Excel files using the XLSX library, supporting file: drone_scorecard_2025_update_FINAL.xlsx.

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
7. Import data from Excel file in the public/data directory for customized analysis.

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
