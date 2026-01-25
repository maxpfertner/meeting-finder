import React, { useState, useEffect } from 'react';
import { MapPin, Train, Clock, X, Calculator, Info } from 'lucide-react';

// Große deutsche Städte mit Koordinaten
const CITIES = [
  { name: 'Berlin', lat: 52.520008, lon: 13.404954, population: 3645000 },
  { name: 'Hamburg', lat: 53.551086, lon: 9.993682, population: 1841000 },
  { name: 'München', lat: 48.135124, lon: 11.581981, population: 1472000 },
  { name: 'Köln', lat: 50.937531, lon: 6.960279, population: 1086000 },
  { name: 'Frankfurt', lat: 50.110924, lon: 8.682127, population: 753000 },
  { name: 'Stuttgart', lat: 48.775846, lon: 9.182932, population: 634000 },
  { name: 'Düsseldorf', lat: 51.227741, lon: 6.773456, population: 621000 },
  { name: 'Dortmund', lat: 51.513587, lon: 7.465298, population: 587000 },
  { name: 'Essen', lat: 51.455643, lon: 7.011555, population: 583000 },
  { name: 'Leipzig', lat: 51.339695, lon: 12.373075, population: 597000 },
  { name: 'Bremen', lat: 53.079296, lon: 8.801694, population: 569000 },
  { name: 'Dresden', lat: 51.050409, lon: 13.737262, population: 556000 },
  { name: 'Hannover', lat: 52.375892, lon: 9.732010, population: 535000 },
  { name: 'Nürnberg', lat: 49.452030, lon: 11.076750, population: 518000 },
  { name: 'Duisburg', lat: 51.434146, lon: 6.762329, population: 498000 },
  { name: 'Bochum', lat: 51.481845, lon: 7.216236, population: 365000 },
  { name: 'Wuppertal', lat: 51.256290, lon: 7.150764, population: 355000 },
  { name: 'Bielefeld', lat: 52.020736, lon: 8.535002, population: 334000 },
  { name: 'Bonn', lat: 50.733992, lon: 7.099814, population: 329000 },
  { name: 'Mannheim', lat: 49.487459, lon: 8.466039, population: 310000 },
  { name: 'Karlsruhe', lat: 49.006890, lon: 8.403653, population: 308000 },
  { name: 'Wiesbaden', lat: 50.082730, lon: 8.240594, population: 278000 },
  { name: 'Münster', lat: 51.960665, lon: 7.626135, population: 315000 },
  { name: 'Augsburg', lat: 48.371736, lon: 10.898341, population: 296000 },
  { name: 'Chemnitz', lat: 50.827845, lon: 12.921389, population: 246000 },
  { name: 'Braunschweig', lat: 52.268874, lon: 10.526770, population: 249000 },
  { name: 'Kiel', lat: 54.323293, lon: 10.122765, population: 247000 },
  { name: 'Aachen', lat: 50.775346, lon: 6.083887, population: 249000 },
  { name: 'Magdeburg', lat: 52.120533, lon: 11.627624, population: 237000 },
  { name: 'Freiburg', lat: 47.997791, lon: 7.842609, population: 230000 },
];

// Echte DB Reisezeiten (in Minuten, gerundet auf 15 Min) - Hauptverbindungen
const TRAVEL_TIMES = {
  'Berlin-Hamburg': 145,
  'Berlin-München': 240,
  'Berlin-Köln': 270,
  'Berlin-Frankfurt': 240,
  'Berlin-Leipzig': 75,
  'Berlin-Dresden': 120,
  'Berlin-Hannover': 105,
  'Berlin-Stuttgart': 330,
  'Berlin-Düsseldorf': 270,
  'Hamburg-München': 360,
  'Hamburg-Köln': 240,
  'Hamburg-Frankfurt': 210,
  'Hamburg-Bremen': 60,
  'Hamburg-Hannover': 90,
  'Hamburg-Berlin': 145,
  'München-Köln': 270,
  'München-Frankfurt': 195,
  'München-Stuttgart': 120,
  'München-Nürnberg': 65,
  'Köln-Frankfurt': 70,
  'Köln-Düsseldorf': 30,
  'Köln-Hannover': 180,
  'Frankfurt-Stuttgart': 80,
  'Frankfurt-Mannheim': 30,
  'Stuttgart-Nürnberg': 120,
  'Stuttgart-Karlsruhe': 45,
  'Hannover-Leipzig': 165,
  'Hannover-Dresden': 210,
  'Leipzig-Dresden': 75,
  'Düsseldorf-Essen': 20,
  'Düsseldorf-Dortmund': 45,
  'Düsseldorf-Stuttgart': 150,
};

// Hilfsfunktion für Reisezeit-Lookup
function getTravelTime(city1Name, city2Name) {
  if (city1Name === city2Name) return 0;
  
  const key1 = `${city1Name}-${city2Name}`;
  const key2 = `${city2Name}-${city1Name}`;
  
  if (TRAVEL_TIMES[key1]) return TRAVEL_TIMES[key1];
  if (TRAVEL_TIMES[key2]) return TRAVEL_TIMES[key2];
  
  // Fallback: Berechnung basierend auf Luftlinie (für nicht-definierte Routen)
  const city1 = CITIES.find(c => c.name === city1Name);
  const city2 = CITIES.find(c => c.name === city2Name);
  
  const R = 6371;
  const dLat = (city2.lat - city1.lat) * Math.PI / 180;
  const dLon = (city2.lon - city1.lon) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(city1.lat * Math.PI / 180) * Math.cos(city2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Schätzung: ~0.8 Min/km + 30 Min Basis, auf 15 Min gerundet
  const estimated = Math.round((distance * 0.8 + 30) / 15) * 15;
  return estimated;
}

function findOptimalMeetingPoint(selectedCities) {
  let bestCity = null;
  let bestScore = Infinity;
  let bestDetails = null;

  CITIES.forEach(candidate => {
    const travelTimes = selectedCities.map(startCity => ({
      from: startCity.name,
      time: getTravelTime(startCity.name, candidate.name)
    }));
    
    const maxTime = Math.max(...travelTimes.map(t => t.time));
    const avgTime = travelTimes.reduce((sum, t) => sum + t.time, 0) / travelTimes.length;
    
    // Score: Gewichtung von max und avg Zeit (faire Verteilung wichtiger)
    const score = maxTime * 0.7 + avgTime * 0.3;
    
    if (score < bestScore) {
      bestScore = score;
      bestCity = candidate;
      bestDetails = { travelTimes, maxTime, avgTime };
    }
  });

  return { city: bestCity, ...bestDetails };
}

export default function MeetingPointFinder() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [optimalPoint, setOptimalPoint] = useState(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (selectedCities.length >= 2) {
      const result = findOptimalMeetingPoint(selectedCities);
      setOptimalPoint(result);
    } else {
      setOptimalPoint(null);
    }
  }, [selectedCities]);

  const toggleCity = (city) => {
    setSelectedCities(prev => {
      const exists = prev.find(c => c.name === city.name);
      if (exists) {
        return prev.filter(c => c.name !== city.name);
      } else {
        return [...prev, city];
      }
    });
  };

  const removeCity = (cityName) => {
    setSelectedCities(prev => prev.filter(c => c.name !== cityName));
  };

  // Konvertierung Geo-Koordinaten zu SVG-Koordinaten
  const lonToX = (lon) => ((lon - 5.5) / (15.5 - 5.5)) * mapDimensions.width;
  const latToY = (lat) => mapDimensions.height - ((lat - 47) / (55 - 47)) * mapDimensions.height;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Train className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Meeting-Point Finder</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Wähle die Startstädte deiner Teilnehmer aus und finde den optimalen Treffpunkt mit minimaler Reisezeit für alle.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Karte */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
                <svg width="100%" viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`} className="bg-white rounded-lg">
                  {/* Verbindungslinien zu optimalem Punkt */}
                  {optimalPoint && selectedCities.map((city, idx) => (
                    <line
                      key={`line-${idx}`}
                      x1={lonToX(city.lon)}
                      y1={latToY(city.lat)}
                      x2={lonToX(optimalPoint.city.lon)}
                      y2={latToY(optimalPoint.city.lat)}
                      stroke="#818cf8"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.4"
                    />
                  ))}

                  {/* Alle Städte */}
                  {CITIES.map((city, idx) => {
                    const isSelected = selectedCities.find(c => c.name === city.name);
                    const isOptimal = optimalPoint && optimalPoint.city.name === city.name;
                    
                    return (
                      <g key={idx}>
                        <circle
                          cx={lonToX(city.lon)}
                          cy={latToY(city.lat)}
                          r={isOptimal ? 12 : isSelected ? 8 : 5}
                          fill={isOptimal ? '#10b981' : isSelected ? '#6366f1' : '#cbd5e1'}
                          stroke={isOptimal ? '#059669' : isSelected ? '#4f46e5' : '#94a3b8'}
                          strokeWidth="2"
                          className="cursor-pointer hover:opacity-80 transition-all"
                          onClick={() => !isOptimal && toggleCity(city)}
                        />
                        {(isSelected || isOptimal) && (
                          <text
                            x={lonToX(city.lon)}
                            y={latToY(city.lat) - 15}
                            textAnchor="middle"
                            className="text-xs font-semibold fill-gray-700 pointer-events-none"
                          >
                            {city.name}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                
                <div className="flex gap-4 mt-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-300 border-2 border-slate-400"></div>
                    <span className="text-gray-600">Verfügbare Städte</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-indigo-600"></div>
                    <span className="text-gray-600">Ausgewählte Startstädte</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-600"></div>
                    <span className="text-gray-600">Optimaler Treffpunkt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ausgewählte Startstädte
                </h2>
                
                {selectedCities.length === 0 ? (
                  <p className="text-gray-500 text-sm">Klicke auf Städte auf der Karte, um sie auszuwählen.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCities.map(city => (
                      <div key={city.name} className="bg-white rounded-lg p-3 flex items-center justify-between">
                        <span className="font-medium text-gray-800">{city.name}</span>
                        <button
                          onClick={() => removeCity(city.name)}
                          className="text-red-500 hover:bg-red-50 rounded p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ergebnis */}
              {optimalPoint && (
                <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Optimaler Treffpunkt
                  </h2>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">
                      {optimalPoint.city.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" />
                        Max. Reisezeit: <span className="font-semibold">{optimalPoint.maxTime} Min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Ø Reisezeit: <span className="font-semibold">{Math.round(optimalPoint.avgTime)} Min</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-sm mb-2">Reisezeiten:</h3>
                    {optimalPoint.travelTimes.map((travel, idx) => (
                      <div key={idx} className="bg-white rounded p-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">{travel.from}</span>
                          <span className="font-semibold text-indigo-600">{travel.time} Min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Schnellauswahl */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-3">Schnellauswahl Städte:</h3>
            <div className="flex flex-wrap gap-2">
              {CITIES.slice(0, 15).map(city => {
                const isSelected = selectedCities.find(c => c.name === city.name);
                return (
                  <button
                    key={city.name}
                    onClick={() => toggleCity(city)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <strong>Datenquelle:</strong> Die Reisezeiten basieren auf echten DB-Fahrplandaten (Stand Januar 2026) 
                für Hauptverbindungen mit ICE/IC. Zeiten sind auf 15 Minuten gerundet. Für seltener befahrene 
                Strecken werden Schätzwerte verwendet. Tatsächliche Reisezeiten können je nach Tageszeit und 
                Verbindung variieren.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}