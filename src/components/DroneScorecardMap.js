import React, { useState, useEffect, useRef, useMemo } from "react";
import Map, { Source, Layer } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import { Radar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const GEOJSON_URL = "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json";
const EXCEL_2025_URL = "/data/drone_scorecard_2025_update_FINAL.xlsx"

const factorOptions = [
  { value: "drone_score_2025", label: "Overall Score 2025", max: 100 },
  { value: "Airspace Lease provisions permission (30%)", label: "Airspace Lease", max: 30 },
  { value: "Express Avigational Easement (25%)", label: "Easement", max: 25 },
  { value: "Drone Task Force or Program Office (20%)", label: "Task Forces", max: 20 },
  { value: "Sandbox (10%)", label: "Sandbox", max: 10 },
  { value: "Jobs Score (5 %)", label: "Jobs", max: 5 },
  { value: "Air rights vested in landowners (10%)", label: "Air Rights", max: 10 },
];

export default function DroneScorecardMap() {
  const mapRef = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverInfo2023, setHoverInfo2023] = useState(null);
  const [hoverInfo2025, setHoverInfo2025] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState("drone_score_2025");
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const geoRes = await fetch(GEOJSON_URL);
        const geoJson = await geoRes.json();

        // Fetch Excel data
        const excelRes = await fetch(EXCEL_2025_URL);
        const arrayBuffer = await excelRes.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames.find(name => name === '2025 Overall');
        if (!sheetName) throw new Error('2025 Overall sheet not found');
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const dataMap = {};
        const statesList = [];

        jsonData.forEach((row) => {
          const stateName = row['State'];
          if (!stateName) return;
          const cleanRow = {
            State: stateName,
            drone_score_2025: row['Overall Score 2025'] || 0,
            drone_score_2023: row['Baseline Overall Score 2023'] || 0,
            "Airspace Lease provisions permission (30%)": row['Airspace Lease provisions permission (30%) '] || 0,
            "Express Avigational Easement (25%)": row['Express Avigational Easement (25%)'] || 0,
            "Drone Task Force or Program Office (20%)": row['Drone Task Force or Program Office (20%) '] || 0,
            "Sandbox (10%)": row['Sandbox (10%)'] || 0,
            "Jobs Score (5 %)": row['Jobs Score (5 %)'] || 0,
            "Air rights vested in landowners (10%)": row['Air rights vested in landowners (10%)'] || 0,
          };
          dataMap[stateName] = cleanRow;
          statesList.push(cleanRow);
        });

        statesList.sort((a, b) => b.drone_score_2025 - a.drone_score_2025);
        statesList.forEach((row, index) => {
          row.rank_2025 = index + 1;
        });

        statesList.sort((a, b) => b.drone_score_2023 - a.drone_score_2023);
        statesList.forEach((row, index) => {
          row.rank_2023 = index + 1;
        });

        const mergedFeatures = geoJson.features.map(f => {
          const name = f.properties.name;
          const data = dataMap[name] || {};
          return {
            ...f,
            properties: { ...f.properties, ...data }
          };
        });

        setGeoData({ ...geoJson, features: mergedFeatures });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Zoom to selected feature when it changes
  useEffect(() => {
    if (selectedFeature && mapRef.current) {
      zoomToFeature(selectedFeature);
    }
  }, [selectedFeature]);

  useEffect(() => {
    if (mapLoaded && selectedFeature && mapRef.current) {
      zoomToFeature(selectedFeature);
    }
  }, [mapLoaded, selectedFeature]);

  const handleSelectState = (stateName) => {
    const feature = geoData?.features.find(f => f.properties.name === stateName);
    if (feature) {
      setSelectedFeature(feature);
      setShowMap(true);
    }
  };

  const handleMapClick = (event) => {
    const feature = event.features?.[0];
    if (feature) {
      setSelectedFeature(feature);
      zoomToFeature(feature);
    }
  };

  const zoomToFeature = (feature) => {
    if (!mapRef.current || !feature) return;
    const bounds = new LngLatBounds();
    const flattenCoords = (arr) => {
      arr.forEach(item => {
        if (Array.isArray(item) && item.length >= 2 && typeof item[0] === 'number' && typeof item[1] === 'number') {
          bounds.extend(item);
        } else if (Array.isArray(item)) {
          flattenCoords(item);
        }
      });
    };
    flattenCoords(feature.geometry.coordinates);
    mapRef.current.fitBounds(bounds, { padding: 40, duration: 1500 });
  };

  const fillLayer2023 = useMemo(() => {
    return {
      id: "state-fills-2023",
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "drone_score_2023"], null], "#e2e8f0",
          ["interpolate", ["linear"], ["get", "drone_score_2023"],
            0, "#e53e3e",
            50, "#f6e05e",
            70, "#68d391",
            90, "#38a169"
          ]
        ],
        "fill-opacity": 0.8,
        "fill-outline-color": "#ffffff"
      }
    };
  }, []);

  const fillLayer2025 = useMemo(() => {
    return {
      id: "state-fills-2025",
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "drone_score_2025"], null], "#e2e8f0",
          ["interpolate", ["linear"], ["get", "drone_score_2025"],
            0, "#e53e3e",
            50, "#f6e05e",
            70, "#68d391",
            90, "#38a169"
          ]
        ],
        "fill-opacity": 0.8,
        "fill-outline-color": "#ffffff"
      }
    };
  }, []);

  const getMaxValueForFactor = (factor) => {
    const option = factorOptions.find(opt => opt.value === factor);
    return option ? option.max : 100;
  };

  const fillLayer = useMemo(() => {
    const max = getMaxValueForFactor(selectedFactor);
    return {
      id: "state-fills",
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", selectedFactor], null], "#e2e8f0",
          ["interpolate", ["linear"], ["get", selectedFactor],
            0, "#e53e3e",
            max * 0.5, "#f6e05e",
            max * 0.7, "#68d391",
            max * 0.9, "#38a169"
          ]
        ],
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false], 1.0, 0.8
        ],
        "fill-outline-color": "#ffffff"
      }
    };
  }, [selectedFactor]);

  const highlightLayer = {
    id: "state-highlight",
    type: "line",
    paint: {
      "line-color": "#2b6cb0",
      "line-width": 3
    }
  };

  // Fixed text layer - removed incorrect visibility syntax
  const textLayer = {
    id: "state-labels",
    type: "symbol",
    layout: {
      "text-field": ["get", "name"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3, 8,     // Smaller zoom levels: 8px text
        4, 10,    // Slightly zoomed in: 10px text
        5, 12,    // More zoom: 12px text
        6, 14,    // Even more zoom: 14px text
        7, 16     // Highest zoom: 16px text
      ],
      "text-anchor": "center",
      "text-justify": "center",
      "text-font": ["Open Sans Bold", "Arial Unicode MS Regular"],
      "text-allow-overlap": false,
      "text-ignore-placement": false,
      "text-padding": 4,
      "text-line-height": 1.2,
      "visibility": "visible"  // Fixed: simple string value instead of stops
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
      "text-opacity": [
        "interpolate",
        ["linear"],
        ["zoom"],
        3, 0.7,  // Slightly transparent at far zoom
        4, 0.8,  // More opaque as we zoom in
        5, 1     // Fully opaque at closer zoom
      ]
    }
  };

  const scoreTextLayer = useMemo(() => ({
    id: "state-scores",
    type: "symbol",
    layout: {
      "text-field": ["to-string", ["get", selectedFactor]],
      "text-size": ["interpolate", ["linear"], ["zoom"], 3, 8, 6, 10, 10, 14],
      "text-anchor": "top",
      "text-justify": "center",
      "text-offset": [0, 1],
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      "text-allow-overlap": false,
      "text-ignore-placement": false,
      "text-padding": 4
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2
    }
  }), [selectedFactor]);

  const scoreTextLayer2023 = useMemo(() => ({
    id: "state-scores-2023",
    type: "symbol",
    layout: {
      "text-field": ["to-string", ["get", "drone_score_2023"]],
      "text-size": ["interpolate", ["linear"], ["zoom"], 3, 8, 6, 10, 10, 14],
      "text-anchor": "top",
      "text-justify": "center",
      "text-offset": [0, 1],
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      "text-allow-overlap": false,
      "text-ignore-placement": false,
      "text-padding": 4
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2
    }
  }), []);

  const scoreTextLayer2025 = useMemo(() => ({
    id: "state-scores-2025",
    type: "symbol",
    layout: {
      "text-field": ["to-string", ["get", "drone_score_2025"]],
      "text-size": ["interpolate", ["linear"], ["zoom"], 3, 8, 6, 10, 10, 14],
      "text-anchor": "top",
      "text-justify": "center",
      "text-offset": [0, 1],
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      "text-allow-overlap": false,
      "text-ignore-placement": false,
      "text-padding": 4
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2
    }
  }), []);

  const highlightFilter = useMemo(() => ["==", "name", selectedFeature?.properties?.name || ""], [selectedFeature]);

  // --- CHART ---
  const RadarChart = () => {
    if (!selectedFeature) return null;
    const p = selectedFeature.properties;

    // Safety check for N/A keys
    const getValue = (key) => p[key] || 0;

    const data = {
      labels: [
        "Airspace Lease", "Easement", "Task Forces", "Sandbox", "Jobs", "Air Rights"
      ],
      datasets: [{
        label: p.State,
        data: [
          getValue("Airspace Lease provisions permission (30%)"),
          getValue("Express Avigational Easement (25%)"),
          getValue("Drone Task Force or Program Office (20%)"),
          getValue("Sandbox (10%)"),
          getValue("Jobs Score (5 %)"),
          getValue("Air rights vested in landowners (10%)")
        ],
        backgroundColor: "rgba(49, 130, 206, 0.2)",
        borderColor: "rgba(49, 130, 206, 1)",
        borderWidth: 2,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(49, 130, 206, 1)",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(49, 130, 206, 1)",
      }]
    };

    const options = {
      scales: {
        r: {
          beginAtZero: true,
          suggestedMax: 30,
          ticks: { display: false, stepSize: 10 },
          pointLabels: {
            font: { size: 11, weight: '600', family: "'Inter', sans-serif" },
            color: "#4a5568"
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)"
          },
          angleLines: {
            color: "rgba(0, 0, 0, 0.1)"
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(26, 32, 44, 0.9)",
          titleFont: {
            family: "'Inter', sans-serif",
            size: 14,
            weight: "bold"
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 10,
          cornerRadius: 6,
          displayColors: false
        }
      },
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0.1
        }
      }
    };

    return <Radar data={data} options={options} />;
  };

  return (
    <div className="card">
      {/* Header */}
      <header className="header">
        <div className="title-block">
          <h1 className="title">Drone Commerce Scorecard 2025</h1>
          <p className="subtitle">Comparison of State Readiness & Regulations</p>
        </div>
      </header>

      {/* Static Maps */}
      <div className="static-maps-container">
        <div className="map-container">
          <div className="map-header">
            <h3 className="map-title">2023 Overall Score</h3>
            <span className="badge badge-neutral">Historical Data</span>
          </div>
          {geoData && (
            <>
              <Map
                initialViewState={{ longitude: -96, latitude: 37.8, zoom: 3 }}
                mapStyle="mapbox://styles/mapbox/light-v10"
                mapboxAccessToken={MAPBOX_TOKEN}
                attributionControl={false}
                interactiveLayerIds={["state-fills-2023"]}
                onMouseMove={(e) => {
                  const f = e.features?.[0];
                  setHoverInfo2023(f ? { feature: f, x: e.point.x, y: e.point.y } : null);
                }}
                onMouseLeave={() => setHoverInfo2023(null)}
              >
                <Source id="states-2023" type="geojson" data={geoData}>
                  <Layer {...fillLayer2023} />
                  <Layer {...textLayer} />
                  <Layer {...scoreTextLayer2023} />
                </Source>
              </Map>
              {hoverInfo2023 && (
                <div className="tooltip" style={{ left: hoverInfo2023.x + 10, top: hoverInfo2023.y + 10 }}>
                  <strong>{hoverInfo2023.feature.properties.name}</strong>
                </div>
              )}
            </>
          )}
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#e53e3e" }}></div>
              <div className="legend-label">Low</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#f6e05e" }}></div>
              <div className="legend-label">Medium </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#68d391" }}></div>
              <div className="legend-label">High </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#38a169" }}></div>
              <div className="legend-label">Excellent</div>
            </div>
          </div>
        </div>

        <div className="map-container">
          <div className="map-header">
            <h3 className="map-title">2025 Overall Score</h3>
            <span className="badge badge-positive">Current Data</span>
          </div>
          {geoData && (
            <>
              <Map
                initialViewState={{ longitude: -96, latitude: 37.8, zoom: 3 }}
                mapStyle="mapbox://styles/mapbox/light-v10"
                mapboxAccessToken={MAPBOX_TOKEN}
                attributionControl={false}
                interactiveLayerIds={["state-fills-2025"]}
                onMouseMove={(e) => {
                  const f = e.features?.[0];
                  setHoverInfo2025(f ? { feature: f, x: e.point.x, y: e.point.y } : null);
                }}
                onMouseLeave={() => setHoverInfo2025(null)}
              >
                <Source id="states-2025" type="geojson" data={geoData}>
                  <Layer {...fillLayer2025} />
                  <Layer {...textLayer} />
                  <Layer {...scoreTextLayer2025} />
                </Source>
              </Map>
              {hoverInfo2025 && (
                <div className="tooltip" style={{ left: hoverInfo2025.x + 10, top: hoverInfo2025.y + 10 }}>
                  <strong>{hoverInfo2025.feature.properties.name}</strong>
                </div>
              )}
            </>
          )}
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#e53e3e" }}></div>
              <div className="legend-label">Low</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#f6e05e" }}></div>
              <div className="legend-label">Medium</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#68d391" }}></div>
              <div className="legend-label">High</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#38a169" }}></div>
              <div className="legend-label">Excellent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Map Section - Full Width */}
        <div className="map-section">
          <div className="filter-block">
            <span className="label">Filter by State:</span>
            <select
              className="select"
              value={selectedFeature?.properties?.name || ""}
              onChange={(e) => handleSelectState(e.target.value)}
            >
              <option value="">Select a State...</option>
              {geoData?.features.map(f => (
                <option key={f.properties.name} value={f.properties.name}>{f.properties.name}</option>
              ))}
            </select>
            <span className="label">Select Factor:</span>
            <select
              className="select"
              value={selectedFactor}
              onChange={(e) => setSelectedFactor(e.target.value)}
            >
              {factorOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          {showMap && (
            <div className="map-container" style={{ height: '400px' }}>
            {loading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            )}
            {hoverInfo && (
              <div className="tooltip" style={{ left: hoverInfo.x + 10, top: hoverInfo.y + 10 }}>
                <strong>{hoverInfo.feature.properties.name}</strong><br />
                {factorOptions.find(opt => opt.value === selectedFactor)?.label}: {hoverInfo.feature.properties[selectedFactor] ?? "N/A"}
              </div>
            )}
            {geoData && (
              <Map
                ref={mapRef}
                initialViewState={{ longitude: -96, latitude: 37.8, zoom: 3 }}
                mapStyle="mapbox://styles/mapbox/light-v10"
                mapboxAccessToken={MAPBOX_TOKEN}
                interactiveLayerIds={["state-fills"]}
                onMouseMove={(e) => {
                  const f = e.features?.[0];
                  setHoverInfo(f ? { feature: f, x: e.point.x, y: e.point.y } : null);
                }}
              
                onClick={handleMapClick}
                onLoad={() => {
                  setMapLoaded(true);
                  if (selectedFeature) {
                    zoomToFeature(selectedFeature);
                  }
                }}
                attributionControl={false}
                onMouseLeave={() => setHoverInfo(null)}
              >
                <Source id="states" type="geojson" data={geoData}>
                  <Layer {...fillLayer} />
                  <Layer {...highlightLayer} filter={highlightFilter} />
                  <Layer {...textLayer} />
                  <Layer {...scoreTextLayer} />
                </Source>
              </Map>
            )}

            {/* Map Controls - Moved onto the map */}
            <div className="map-controls">
              <h4 className="map-control-title">Interactive Map</h4>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#e53e3e" }}></div>
                <div className="legend-label">Low</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#f6e05e" }}></div>
                <div className="legend-label">Medium</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#68d391" }}></div>
                <div className="legend-label">High</div>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#38a169" }}></div>
                <div className="legend-label">Excellent</div>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Info Section - Below Map */}
        <div className="info-section">
          {/* State Info Panel */}
          <div className="state-info">
            {selectedFeature ? (
              <>
                <div className="score-header">
                  <h2 style={{ margin: "0 0 10px 0", color: "#2d3748" }}>{selectedFeature.properties.name}</h2>
                  <div className="huge-score">
                    {selectedFeature.properties.drone_score_2025 ?? "--"}
                  </div>
                  <div className="score-label">2025 Overall Score</div>
                  <div style={{ marginTop: "16px" }}>
                    <span className="badge badge-positive">
                      Rank #{selectedFeature.properties.rank_2025 ?? "--"}
                    </span>
                  </div>
                </div>

                <div className="card">
                  <h3 className="score-label" style={{ marginBottom: "15px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>Year-over-Year Comparison</h3>
                  <div className="comparison-row">
                    <div className="comp-item">
                      <div className="comp-val">{selectedFeature.properties.drone_score_2023 ?? "--"}</div>
                      <div className="comp-label">2023 Score</div>
                    </div>

                    <div className="delta">
                      {(() => {
                        const s25 = selectedFeature.properties.drone_score_2025;
                        const s23 = selectedFeature.properties.drone_score_2023;
                        if (typeof s25 !== 'number' || typeof s23 !== 'number') return <span>-</span>;
                        const diff = s25 - s23;
                        return (
                          <div className={diff > 0 ? "delta-positive" : diff < 0 ? "delta-negative" : "delta-neutral"}>
                            {diff > 0 ? "▲" : diff < 0 ? "▼" : "="} {Math.abs(diff)}
                          </div>
                        );
                      })()}
                      <div className="comp-label">Change</div>
                    </div>

                    <div className="comp-item">
                      <div className="comp-val" style={{ color: "#2b6cb0" }}>
                        #{selectedFeature.properties.rank_2023 ?? "--"}
                      </div>
                      <div className="comp-label">2023 Rank</div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="score-label" style={{ marginBottom: "15px" }}>Category Breakdown</h3>
                  <div className="radar-container">
                    <RadarChart />
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗺️</div>
                <h3>Select a State</h3>
                <p>Click on map or use the dropdown to view scorecard details.</p>
              </div>
            )}
          </div>

          {/* Rankings Panel */}
          <div className="rankings-info">
            <div className="card">
              <h3 className="score-label" style={{ marginBottom: "15px" }}>State Rankings (2025)</h3>
              <div className="table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Rank</th>
                      <th className="table-header-cell">State</th>
                      <th className="table-header-cell" style={{ textAlign: "right" }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoData?.features
                      .filter(f => f.properties.drone_score_2025 != null)
                      .sort((a, b) => (b.properties.drone_score_2025 || 0) - (a.properties.drone_score_2025 || 0))
                      .map((f, index) => (
                        <tr
                          key={f.properties.name}
                          className="table-row"
                          style={{
                            backgroundColor: f.properties.name === selectedFeature?.properties?.name ? "#edf2f7" : "transparent",
                            fontWeight: f.properties.name === selectedFeature?.properties?.name ? "600" : "normal"
                          }}
                        >
                          <td className="table-cell">
                            {index + 1}
                            {index + 1 === 1 && <span style={{ marginLeft: "4px" }}>🥇</span>}
                            {index + 1 === 2 && <span style={{ marginLeft: "4px" }}>🥈</span>}
                            {index + 1 === 3 && <span style={{ marginLeft: "4px" }}>🥉</span>}
                          </td>
                          <td className="table-cell">{f.properties.name}</td>
                          <td className="table-cell" style={{ textAlign: "right" }}>{f.properties.drone_score_2025}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
 
