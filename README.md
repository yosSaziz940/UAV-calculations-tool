# UAV Volume Estimate Tool

## Description

The UAV Volume Estimate Tool is a comprehensive React-based web application designed to estimate and analyze UAV (Unmanned Aerial Vehicle, commonly known as drone) volumes across various sectors. It helps stakeholders in aviation, urban planning, and emergency services to forecast UAV usage, assess financial impacts, and plan infrastructure needs. The tool integrates data from Excel spreadsheets, provides interactive maps, and generates charts for data visualization.

Key functionalities include:

- Volume estimation for recreational, commercial, and industrial UAV operations.
- Financial modeling for UAV-related investments and revenues.
- Infrastructure planning for UAV support systems.
- Interactive mapping for scorecard visualization.

## Features

The tool is based on the UAV Volume Estimate Tool v1.0.3 Excel spreadsheet, providing detailed calculations for UAV (Unmanned Aerial Vehicle, commonly known as drone) volumes across various sectors. Below is a summary of key outputs, followed by detailed descriptions for each section from A to K and additional modules. Note that some inputs are reused from Section A (e.g., population, operational days per week, operational weeks per year).

### Key Metrics / Outputs Summary

| Section / Module | Key Outputs |
|------------------|-------------|
| A. General Inputs | Operational hours/year, flights/year, covered linear path/flight, covered area/flight (hectares), max annual structures |
| B. Recreational | UAVs (lower/upper), annual UAV flights (lower/upper) |
| C. Commercial Delivery | Annual UAV tonnes max, flights max, flights/UAV/year, flights/UAVs (lower/upper) |
| D. Urban Air Mobility | Vehicle share trips (lower/upper), UAV flights/UAVs (lower/upper) |
| E. Agriculture | UAV locations, hectares/location, flights/location, UAVs/location, total capacity estimates |
| F. Linear Inspection | UAV locations, km/location, flights/location, UAVs/location, total capacity estimates |
| G. Structure Inspection | UAV locations, structures/location, flights/location, UAVs/location, total capacity estimates |
| H. Emergency Response | Coverage areas, flights, UAVs, annual flights/UAVs (lower/upper) |
| I. Other | Totals and percentages by category |
| J. Distributions by Vehicle Type | Vehicle type distributions, annual flights/UAVs (lower/upper) |
| K. Chart Calculations | Rounded annual flights/UAVs for charting |
| Financial Impact Module | Total market/city revenue, jobs, revenue allocation table, revenue mix chart |
| Infrastructure Fiscal Module | Vertiports/hubs required, total investment, tax revenue, fiscal mix chart |
| Drone Scorecard Map | Maps with scores, rankings table, radar charts |
| Data Integration | Loaded data structures for calculations/maps |

### Section Details

- [**Section A: General Inputs**](src/components/sectionA.js) 

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Operational hours/day | User input | hours | Hours UAVs operate per day |
  | Operational days/week | User input | days | Operational days per week |
  | Operational weeks/year | User input | weeks | Operational weeks per year |
  | Operational time in flight % | User input | % | Percentage of time UAVs are in flight |
  | Average hours/flight | User input | hours | Average flight duration |
  | Average overhead hours/flight | User input | hours | Overhead time per flight |
  | Average velocity | User input | km/h | Average UAV speed |
  | Coverage width per path | User input | meters | Width covered per flight path |
  | Max structures/week | User input | structures | Maximum structures inspected per week |


  What it does:
  - Calculates operational hours per year.
  - Estimates flights per year.
  - Computes covered linear path per flight.
  - Determines covered area per flight (hectares).
  - Sets max annual structures.

  | Output | Description |
  |--------|-------------|
  | Operational hours/year | Total operational hours annually |
  | Flights/year | Estimated annual flights |
  | Covered linear path/flight | Linear distance covered per flight |
  | Covered area/flight (hectares) | Area covered per flight |
  | Max annual structures | Maximum structures inspectable annually |

- [**Section B: Recreational**](src/components/sectionB.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | UAV % of population (lower/upper) | User input | % | Percentage of population using UAVs |
  | Average flights/month per UAV | User input | flights | Flights per UAV per month |

  | Reused Inputs | Population (from Section A) |
  |---------------|-----------------------------|

  What it does:
  - Estimates UAV usage for recreational purposes.
  - Calculates UAVs and annual flights based on population percentages and flight frequency.

  | Output | Description |
  |--------|-------------|
  | UAVs (lower/upper) | Estimated UAV count |
  | Annual UAV flights (lower/upper) | Annual flight volume |

- [**Section C: Commercial Delivery**](src/components/sectionC.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Annual tonnes commercial delivery | User input | tonnes | Total commercial delivery volume |
  | Manufactured goods % | User input | % | Percentage of manufactured goods |
  | UAV potential % | User input | % | UAV-suitable delivery percentage |
  | Average kg/delivery | User input | kg | Average delivery weight |
  | Average flights/day | User input | flights | Flights per UAV per day |
  | UAV capacity % (lower/upper) | User input | % | Capacity utilization bounds |

  | Reused Inputs | Population, operational days/week, weeks/year (from Section A) |
  |---------------|---------------------------------------------------------------|

  What it does:
  - Analyzes UAV potential in commercial delivery.
  - Calculates maximum capacity tonnes, flights, and UAVs based on goods volume and capacity percentages.

  | Output | Description |
  |--------|-------------|
  | Annual UAV tonnes max | Maximum UAV delivery volume |
  | Annual UAV flights max | Maximum flight volume |
  | Average flights/UAV/year | Flights per UAV annually |
  | Annual flights/UAVs (lower/upper) | Flight and UAV estimates |

- [**Section D: Urban Air Mobility (UAM)**](src/components/sectionD.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Total annual vehicle trips | User input | trips | Total vehicle trips annually |
  | Vehicle share % (lower/upper) | User input | % | UAV share of trips |
  | UAV capacity % (lower/upper) | User input | % | Capacity utilization bounds |
  | Average flights/year | User input | flights | Flights per UAV per year |


  What it does:
  - Forecasts UAV usage in urban transportation.
  - Calculates vehicle share trips and UAV flights/UAVs based on trip shares and capacity percentages.

  | Output | Description |
  |--------|-------------|
  | Annual vehicle share trips (lower/upper) | UAV trip volume |
  | Annual UAV flights/UAVs (lower/upper) | Flight and UAV estimates |

- [**Section E: Agriculture**](src/components/sectionE.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Agriculture land hectares/locations/coverage times | User input | hectares/locations/times | Land details for agriculture |
  | Cropland hectares/locations/coverage times | User input | hectares/locations/times | Cropland details |
  | Forest and parks hectares/locations/coverage times | User input | hectares/locations/times | Forest/park details |
  | Max annual area/UAV hectares | User input | hectares | Max area per UAV |
  | Max annual flights/UAV | User input | flights | Max flights per UAV |
  | UAV capacity % (lower/upper) | User input | % | Capacity utilization bounds |


  What it does:
  - Estimates UAV usage for agricultural monitoring.
  - Calculates UAV locations and hectares per location.
  - Estimates flights per location, UAVs per location, and total capacity.

  | Output | Description |
  |--------|-------------|
  | UAV locations | Number of locations |
  | Hectares/location | Area per location |
  | Flights/location | Flights per location |
  | UAVs/location | UAVs per location |
  | Total capacity estimates | Overall estimates |

- [**Section F: Linear Inspection**](src/components/sectionF.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Linear infrastructures (km, coverage times) | User input | km/times | Infrastructure details |
  | Max linear path/UAV | User input | km | Max path per UAV |
  | Covered linear path/flight | User input | km | Path per flight |
  | UAV flights/year | User input | flights | Flights per UAV per year |
  | UAV capacity % (lower/upper) | User input | % | Capacity utilization bounds |


  What it does:
  - Estimates UAV usage for inspecting linear infrastructure.
  - Calculates UAV locations, km per location, flights per location, UAVs per location, and total capacity.

  | Output | Description |
  |--------|-------------|
  | UAV locations | Number of locations |
  | Km/location | Distance per location |
  | Flights/location | Flights per location |
  | UAVs/location | UAVs per location |
  | Total capacity estimates | Overall estimates |

- [**Section G: Structure Inspection**](src/components/sectionG.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Structures (structures, coverage times) | User input | structures/times | Structure details |
  | Max structures/UAV | User input | structures | Max structures per UAV |
  | Coverage structures/flight | User input | structures | Structures per flight |
  | UAV flights/year | User input | flights | Flights per UAV per year |
  | UAV capacity % (lower/upper) | User input | % | Capacity utilization bounds |


  What it does:
  - Estimates UAV usage for inspecting structures.
  - Calculates UAV locations, structures per location, flights per location, UAVs per location, and total capacity.

  | Output | Description |
  |--------|-------------|
  | UAV locations | Number of locations |
  | Structures/location | Structures per location |
  | Flights/location | Flights per location |
  | UAVs/location | UAVs per location |
  | Total capacity estimates | Overall estimates |

- [**Section H: Emergency Response**](src/components/sectionH.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Impacted area/event | User input | km² | Area per event |
  | Annual events | User input | events | Events per year |
  | Coverage %/times for activities | User input | %/times | Coverage details |
  | Coverage rates | User input | km²/flights | Coverage per flight |
  | Avg % events served/UAV | User input | % | Events per UAV |
  | UAV capacity % (lower/upper) | User input | % | Capacity utilization bounds |


  What it does:
  - Estimates UAV usage in emergency scenarios.
  - Calculates coverage areas, flights, and UAVs per activity and total capacity.

  | Output | Description |
  |--------|-------------|
  | Coverage areas | Areas covered |
  | Flights | Total flights |
  | UAVs | Total UAVs |
  | Annual flights/UAVs (lower/upper) | Estimates |

- [**Section I: Other**](src/components/sectionI.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Lower/upper bounds and flights/UAV for categories | User input | bounds/flights | Bounds for each category |
  | Other % | User input | % | Percentage for unmodeled UAV use |

  | Reused Inputs | Outputs from Sections B–H (flight volumes & UAV counts) |
  |---------------|---------------------------------------------------------|

  What it does:
  - Aggregates UAV applications not covered in other sections.
  - Calculates totals and percentages.

  | Output | Description |
  |--------|-------------|
  | Totals and percentages by category | Aggregated estimates |

- [**Section J: Distributions by Vehicle Type**](src/components/sectionJ.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Distribution % (small, medium, large) | User input | % | Size distributions |
  | Lower/upper flights | User input | flights | Flight bounds |
  | Flights/UAV per use case | User input | flights | Flights per UAV |
  | Other fraction | User input | fraction | Other fraction |
  | Other annual flights/UAV | User input | flights | Flights for other |

  | Reused Inputs | Flights & UAV counts from Sections B–I |
  |---------------|---------------------------------------|

  What it does:
  - Categorizes UAV volumes by vehicle size and type.
  - Calculates distributions, flights, and UAVs.

  | Output | Description |
  |--------|-------------|
  | Vehicle type distributions | Size breakdowns |
  | Annual flights/UAVs (lower/upper) | Estimates |

- [**Section K: Chart Calculations**](src/components/sectionK.js)  

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Annual flights/UAVs (lower/upper) for sizes | User input | flights/UAVs | Size-specific volumes |

  | Reused Inputs | Outputs from Section J |
  |---------------|-----------------------|

  What it does:
  - Prepares rounded data for charting with levels in between.

  | Output | Description |
  |--------|-------------|
  | Rounded annual flights/UAVs for charting | Chart-ready data |

- [**Financial Impact Module**](src/components/FinancialImpactModule.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Average revenue per delivery/UAM trip/inspection/rec flight | User input | USD | Revenue rates |
  | Annual permit fees (small UAVs, air taxis) | User input | USD | Permit costs |
  | Revenue share % (owners, protocol, city) | User input | % | Share allocations |
  | Economic multiplier | User input | multiplier | Economic impact factor |
  | Average industry salary | User input | USD | Salary average |

  | Reused Inputs | Flights and UAVs for delivery, UAM, inspection, recreational (from Sections B–I) |
  |---------------|-------------------------------------------------------------------------|

  What it does:
  - Calculates flight revenues, permit fees, revenue allocations, economic impact, and job estimates based on UAV operations (all in USD).

  | Output | Description |
  |--------|-------------|
  | Total market/city revenue (USD) | Revenue estimates |
  | Estimated jobs | Job impact |
  | Revenue allocation table | Allocation details |
  | Revenue mix chart | Visual breakdown |

- [**Infrastructure Fiscal Module**](src/components/InfrastructureFiscalModule.js) 

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Average cost per vertiport/hub | User input | USD | Infrastructure costs |
  | Annual trips per vertiport/deliveries per hub | User input | trips/deliveries | Capacity metrics |
  | Sales tax rate | User input | % | Tax rate |
  | Average value of goods delivered | User input | USD | Goods value |

  | Reused Inputs | Flights for delivery and UAM, revenues for UAM (from Financial Module & Sections C, D) |
  |---------------|-------------------------------------------------------------------------------------|

  What it does:
  - Estimates required infrastructure (vertiports and hubs) and calculates capital expenditures and tax revenues from UAV-related activities (all in USD).

  | Output | Description |
  |--------|-------------|
  | Vertiports/hubs required | Infrastructure needs |
  | Total infrastructure investment (USD) | CapEx estimates |
  | Estimated annual sales tax revenue (USD) | Tax revenue |
  | Fiscal mix chart | Visual breakdown |

- [**Drone Scorecard Map**](src/components/DroneScorecardMap.js)

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Excel file data | File | scores/rankings | State readiness data |

  | Reused Inputs | - |
  |---------------|---|

  What it does:
  - Displays interactive maps comparing 2023 and 2025 state readiness scores.
  - Allows selection of states and factors for detailed visualization, including rankings and radar charts.

  | Output | Description |
  |--------|-------------|
  | Maps with scores | Visual comparisons |
  | Rankings table | State rankings |
  | Radar charts | Category breakdowns |

- **Data Integration**

  | Input | Source | Unit | Description |
  |-------|--------|------|-------------|
  | Excel files | File | data | Spreadsheet inputs |

  What it does:
  - Imports and exports data from Excel files using the XLSX library for use in the application.

  | Output | Description |
  |--------|-------------|
  | Loaded data structures | Data for calculations/maps |


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

[![npm version](https://badge.fury.io/js/npm.svg)](https://badge.fury.io/js/npm) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Dependencies

- **Core**: React 18.2.0, React DOM 18.2.0
- **Mapping**: mapbox-gl 3.17.0, react-map-gl 7.0.16
- **Visualization**: chart.js 4.5.1, react-chartjs-2 5.3.1, recharts 3.5.0
- **Utilities**: web-vitals 2.1.4, xlsx 0.18.5
- **Dev Dependencies**: @testing-library/jest-dom 5.16.5, @testing-library/react 13.4.0, @testing-library/user-event 14.4.3
