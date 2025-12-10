# UAV Volume Estimate Tool

## Description

A React-based application for estimating UAV volumes across various sectors including recreational use, commercial delivery, urban air mobility, agriculture, inspections, and emergency response. It provides tools for financial impact analysis, infrastructure fiscal planning, and interactive mapping.

## Features

- **General Inputs**: Configure base parameters like year, population, operational hours.
- **Sector-Specific Modules**: Sections for Recreational Use, Commercial Delivery, Urban Air Mobility, Agriculture, Linear Inspection, Structure Inspection, Emergency Response, and Other uses.
- **Distributions by Vehicle Type**: Analyze UAV distributions.
- **Chart Calculations**: Visualize data with charts.
- **Financial Impact Module**: Assess financial implications.
- **Infrastructure Fiscal Module**: Plan infrastructure costs.
- **Drone Scorecard Map**: Interactive map using Mapbox for scorecard visualization.
- **Data Integration**: Supports Excel data import/export using XLSX library.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yosSaziz940/UAV-calculations-tool.git
   cd uav-volume-tool-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`.

## Usage

- Navigate through the sidebar to select different sections.
- Input parameters in Section A and view results in subsequent sections.
- Use the map and charts for data visualization.

## Project Structure

- `src/App.js`: Main application component.
- `src/components/`: Individual section components (sectionA.js to sectionK.js), modules (FinancialImpactModule.js, InfrastructureFiscalModule.js), and map (DroneScorecardMap.js).
- `public/`: Static assets including HTML, icons, and data files (Excel spreadsheets).

## Dependencies

- React 18
- Mapbox GL
- Chart.js and React-Chartjs-2
- Recharts
- XLSX for Excel handling

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request.
