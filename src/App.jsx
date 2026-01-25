import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from 'react-leaflet';
import { MapPin, Train, Clock, X, Calculator, Info, RotateCcw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Deutsche Städte über 100.000 Einwohner (sortiert nach Einwohnerzahl)
const CITIES = [
  { name: 'Berlin', lat: 52.520008, lon: 13.404954, population: 3645000 },
  { name: 'Hamburg', lat: 53.551086, lon: 9.993682, population: 1841000 },
  { name: 'München', lat: 48.135124, lon: 11.581981, population: 1472000 },
  { name: 'Köln', lat: 50.937531, lon: 6.960279, population: 1086000 },
  { name: 'Frankfurt', lat: 50.110924, lon: 8.682127, population: 753000 },
  { name: 'Stuttgart', lat: 48.775846, lon: 9.182932, population: 634000 },
  { name: 'Düsseldorf', lat: 51.227741, lon: 6.773456, population: 621000 },
  { name: 'Leipzig', lat: 51.339695, lon: 12.373075, population: 597000 },
  { name: 'Dortmund', lat: 51.513587, lon: 7.465298, population: 587000 },
  { name: 'Essen', lat: 51.455643, lon: 7.011555, population: 583000 },
  { name: 'Bremen', lat: 53.079296, lon: 8.801694, population: 569000 },
  { name: 'Dresden', lat: 51.050409, lon: 13.737262, population: 556000 },
  { name: 'Hannover', lat: 52.375892, lon: 9.732010, population: 535000 },
  { name: 'Nürnberg', lat: 49.452030, lon: 11.076750, population: 518000 },
  { name: 'Duisburg', lat: 51.434146, lon: 6.762329, population: 498000 },
  { name: 'Bochum', lat: 51.481845, lon: 7.216236, population: 365000 },
  { name: 'Wuppertal', lat: 51.256290, lon: 7.150764, population: 355000 },
  { name: 'Bielefeld', lat: 52.020736, lon: 8.535002, population: 334000 },
  { name: 'Bonn', lat: 50.733992, lon: 7.099814, population: 329000 },
  { name: 'Münster', lat: 51.960665, lon: 7.626135, population: 315000 },
  { name: 'Mannheim', lat: 49.487459, lon: 8.466039, population: 310000 },
  { name: 'Karlsruhe', lat: 49.006890, lon: 8.403653, population: 308000 },
  { name: 'Augsburg', lat: 48.371736, lon: 10.898341, population: 296000 },
  { name: 'Wiesbaden', lat: 50.082730, lon: 8.240594, population: 278000 },
  { name: 'Mönchengladbach', lat: 51.195136, lon: 6.432726, population: 261000 },
  { name: 'Gelsenkirchen', lat: 51.517744, lon: 7.085717, population: 260000 },
  { name: 'Braunschweig', lat: 52.268874, lon: 10.526770, population: 249000 },
  { name: 'Aachen', lat: 50.775346, lon: 6.083887, population: 249000 },
  { name: 'Kiel', lat: 54.323293, lon: 10.122765, population: 247000 },
  { name: 'Chemnitz', lat: 50.827845, lon: 12.921389, population: 246000 },
  { name: 'Halle', lat: 51.482580, lon: 11.969761, population: 239000 },
  { name: 'Magdeburg', lat: 52.120533, lon: 11.627624, population: 237000 },
  { name: 'Freiburg', lat: 47.997791, lon: 7.842609, population: 230000 },
  { name: 'Krefeld', lat: 51.338079, lon: 6.585279, population: 227000 },
  { name: 'Mainz', lat: 49.992862, lon: 8.247253, population: 218000 },
  { name: 'Lübeck', lat: 53.865467, lon: 10.686559, population: 217000 },
  { name: 'Erfurt', lat: 50.984768, lon: 11.029807, population: 214000 },
  { name: 'Oberhausen', lat: 51.469431, lon: 6.851460, population: 210000 },
  { name: 'Rostock', lat: 54.092685, lon: 12.099147, population: 209000 },
  { name: 'Kassel', lat: 51.312801, lon: 9.479742, population: 202000 },
  { name: 'Hagen', lat: 51.359241, lon: 7.479416, population: 188000 },
  { name: 'Potsdam', lat: 52.390569, lon: 13.064473, population: 183000 },
  { name: 'Saarbrücken', lat: 49.240155, lon: 6.996727, population: 180000 },
  { name: 'Hamm', lat: 51.680845, lon: 7.820346, population: 179000 },
  { name: 'Ludwigshafen', lat: 49.477430, lon: 8.445141, population: 172000 },
  { name: 'Mülheim', lat: 51.427620, lon: 6.883045, population: 171000 },
  { name: 'Oldenburg', lat: 53.143887, lon: 8.213886, population: 169000 },
  { name: 'Osnabrück', lat: 52.278748, lon: 8.049654, population: 165000 },
  { name: 'Leverkusen', lat: 51.030247, lon: 6.988455, population: 163000 },
  { name: 'Heidelberg', lat: 49.398750, lon: 8.672434, population: 159000 },
  { name: 'Darmstadt', lat: 49.872775, lon: 8.651177, population: 159000 },
  { name: 'Solingen', lat: 51.163670, lon: 7.067190, population: 159000 },
  { name: 'Herne', lat: 51.538327, lon: 7.225608, population: 156000 },
  { name: 'Regensburg', lat: 49.013432, lon: 12.101624, population: 153000 },
  { name: 'Neuss', lat: 51.204109, lon: 6.688388, population: 153000 },
  { name: 'Paderborn', lat: 51.715033, lon: 8.752506, population: 152000 },
  { name: 'Ingolstadt', lat: 48.763616, lon: 11.424946, population: 138000 },
  { name: 'Offenbach', lat: 50.103050, lon: 8.760850, population: 131000 },
  { name: 'Fürth', lat: 49.477879, lon: 10.988633, population: 128000 },
  { name: 'Würzburg', lat: 49.794033, lon: 9.929350, population: 127000 },
  { name: 'Ulm', lat: 48.401478, lon: 9.987608, population: 126000 },
  { name: 'Heilbronn', lat: 49.142291, lon: 9.218916, population: 126000 },
  { name: 'Pforzheim', lat: 48.891880, lon: 8.699278, population: 126000 },
  { name: 'Wolfsburg', lat: 52.423076, lon: 10.787085, population: 124000 },
  { name: 'Göttingen', lat: 51.533889, lon: 9.935556, population: 117000 },
  { name: 'Bottrop', lat: 51.524204, lon: 6.928844, population: 117000 },
  { name: 'Reutlingen', lat: 48.491388, lon: 9.204584, population: 116000 },
  { name: 'Koblenz', lat: 50.356667, lon: 7.593889, population: 114000 },
  { name: 'Bremerhaven', lat: 53.539722, lon: 8.580556, population: 114000 },
  { name: 'Erlangen', lat: 49.598194, lon: 11.004194, population: 113000 },
  { name: 'Recklinghausen', lat: 51.613830, lon: 7.197830, population: 111000 },
  { name: 'Trier', lat: 49.756944, lon: 6.641389, population: 111000 },
  { name: 'Remscheid', lat: 51.179722, lon: 7.189167, population: 111000 },
  { name: 'Jena', lat: 50.927222, lon: 11.586111, population: 108000 },
  { name: 'Salzgitter', lat: 52.085556, lon: 10.333889, population: 104000 },
  { name: 'Moers', lat: 51.451111, lon: 6.626389, population: 103000 },
  { name: 'Siegen', lat: 50.874722, lon: 8.024167, population: 102000 },
];

// Echte DB Reisezeiten (in Minuten, gerundet auf 15 Min)
const TRAVEL_TIMES = {
  // Hauptverbindungen Berlin
  'Berlin-Hamburg': 145,
  'Berlin-München': 240,
  'Berlin-Köln': 270,
  'Berlin-Frankfurt': 240,
  'Berlin-Leipzig': 75,
  'Berlin-Dresden': 120,
  'Berlin-Hannover': 105,
  'Berlin-Stuttgart': 330,
  'Berlin-Düsseldorf': 270,
  'Berlin-Bremen': 225,
  'Berlin-Nürnberg': 270,
  'Berlin-Erfurt': 135,
  'Berlin-Halle': 105,
  'Berlin-Magdeburg': 90,
  'Berlin-Potsdam': 30,
  'Berlin-Rostock': 165,
  
  // Hauptverbindungen Hamburg
  'Hamburg-München': 360,
  'Hamburg-Köln': 240,
  'Hamburg-Frankfurt': 210,
  'Hamburg-Bremen': 60,
  'Hamburg-Hannover': 90,
  'Hamburg-Berlin': 145,
  'Hamburg-Stuttgart': 330,
  'Hamburg-Düsseldorf': 225,
  'Hamburg-Kiel': 75,
  'Hamburg-Lübeck': 45,
  'Hamburg-Oldenburg': 105,
  'Hamburg-Bremerhaven': 75,
  
  // Hauptverbindungen München
  'München-Köln': 270,
  'München-Frankfurt': 195,
  'München-Stuttgart': 120,
  'München-Nürnberg': 65,
  'München-Berlin': 240,
  'München-Hamburg': 360,
  'München-Augsburg': 30,
  'München-Regensburg': 90,
  'München-Ingolstadt': 45,
  'München-Ulm': 90,
  'München-Würzburg': 180,
  'München-Freiburg': 270,
  
  // Hauptverbindungen Köln
  'Köln-Frankfurt': 70,
  'Köln-Düsseldorf': 30,
  'Köln-Hannover': 180,
  'Köln-Berlin': 270,
  'Köln-München': 270,
  'Köln-Hamburg': 240,
  'Köln-Stuttgart': 165,
  'Köln-Dortmund': 60,
  'Köln-Essen': 45,
  'Köln-Bonn': 20,
  'Köln-Aachen': 45,
  'Köln-Mainz': 90,
  'Köln-Koblenz': 60,
  
  // Hauptverbindungen Frankfurt
  'Frankfurt-Stuttgart': 80,
  'Frankfurt-Mannheim': 30,
  'Frankfurt-Köln': 70,
  'Frankfurt-München': 195,
  'Frankfurt-Berlin': 240,
  'Frankfurt-Hamburg': 210,
  'Frankfurt-Hannover': 165,
  'Frankfurt-Würzburg': 75,
  'Frankfurt-Nürnberg': 135,
  'Frankfurt-Kassel': 90,
  'Frankfurt-Mainz': 30,
  'Frankfurt-Darmstadt': 15,
  'Frankfurt-Wiesbaden': 30,
  'Frankfurt-Heidelberg': 45,
  'Frankfurt-Karlsruhe': 60,
  
  // Hauptverbindungen Stuttgart
  'Stuttgart-Nürnberg': 120,
  'Stuttgart-Karlsruhe': 45,
  'Stuttgart-München': 120,
  'Stuttgart-Frankfurt': 80,
  'Stuttgart-Köln': 165,
  'Stuttgart-Mannheim': 30,
  'Stuttgart-Ulm': 45,
  'Stuttgart-Freiburg': 120,
  'Stuttgart-Heidelberg': 45,
  'Stuttgart-Heilbronn': 30,
  
  // Hauptverbindungen Hannover
  'Hannover-Leipzig': 165,
  'Hannover-Dresden': 210,
  'Hannover-Berlin': 105,
  'Hannover-Hamburg': 90,
  'Hannover-Frankfurt': 165,
  'Hannover-Köln': 180,
  'Hannover-Bremen': 60,
  'Hannover-Braunschweig': 30,
  'Hannover-Göttingen': 45,
  'Hannover-Kassel': 90,
  'Hannover-Magdeburg': 75,
  'Hannover-Wolfsburg': 30,
  
  // Hauptverbindungen Leipzig
  'Leipzig-Dresden': 75,
  'Leipzig-Berlin': 75,
  'Leipzig-Hannover': 165,
  'Leipzig-Frankfurt': 195,
  'Leipzig-Nürnberg': 180,
  'Leipzig-Erfurt': 45,
  'Leipzig-Halle': 20,
  'Leipzig-Magdeburg': 90,
  'Leipzig-Jena': 60,
  
  // Hauptverbindungen Dresden
  'Dresden-Berlin': 120,
  'Dresden-Leipzig': 75,
  'Dresden-Hannover': 210,
  'Dresden-Nürnberg': 240,
  'Dresden-Erfurt': 150,
  'Dresden-Halle': 135,
  
  // Ruhrgebiet intern
  'Düsseldorf-Essen': 20,
  'Düsseldorf-Dortmund': 45,
  'Düsseldorf-Köln': 30,
  'Düsseldorf-Duisburg': 15,
  'Düsseldorf-Stuttgart': 150,
  'Düsseldorf-Berlin': 270,
  'Düsseldorf-Hamburg': 225,
  'Düsseldorf-München': 315,
  'Essen-Dortmund': 30,
  'Essen-Köln': 45,
  'Essen-Duisburg': 10,
  'Essen-Bochum': 10,
  'Essen-Gelsenkirchen': 15,
  'Dortmund-Köln': 60,
  'Dortmund-Hannover': 120,
  'Dortmund-Bochum': 15,
  'Dortmund-Münster': 30,
  'Dortmund-Bielefeld': 60,
  'Dortmund-Hagen': 20,
  'Bochum-Gelsenkirchen': 10,
  'Bochum-Essen': 10,
  'Duisburg-Essen': 10,
  
  // Weitere wichtige Verbindungen
  'Nürnberg-Würzburg': 60,
  'Nürnberg-Regensburg': 60,
  'Nürnberg-Fürth': 10,
  'Mannheim-Heidelberg': 15,
  'Mannheim-Karlsruhe': 30,
  'Mannheim-Ludwigshafen': 5,
  'Karlsruhe-Freiburg': 75,
  'Karlsruhe-Pforzheim': 20,
  'Bremen-Oldenburg': 45,
  'Bremen-Bremerhaven': 45,
  'Kassel-Göttingen': 30,
  'Kassel-Erfurt': 90,
  'Erfurt-Jena': 15,
  'Erfurt-Weimar': 15,
  'Mainz-Wiesbaden': 15,
  'Kiel-Lübeck': 60,
  'Bielefeld-Paderborn': 45,
  'Bielefeld-Münster': 45,
  'Münster-Osnabrück': 45,
  'Wuppertal-Solingen': 15,
  'Wuppertal-Remscheid': 15,
  'Halle-Magdeburg': 60,
  'Chemnitz-Leipzig': 75,
  'Augsburg-Ulm': 45,
  'Saarbrücken-Kaiserslautern': 45,
  'Koblenz-Mainz': 45,
  'Lübeck-Rostock': 120,
  'Potsdam-Magdeburg': 75,
  'Freiburg-Basel': 45,
  'Aachen-Köln': 45,
  'Offenbach-Frankfurt': 10,
  'Neuss-Düsseldorf': 10,
  'Leverkusen-Köln': 15,
  'Mönchengladbach-Düsseldorf': 30,
  'Krefeld-Düsseldorf': 30,
  'Oberhausen-Essen': 15,
  'Gelsenkirchen-Herne': 10,
  'Mülheim-Essen': 10,
  'Bottrop-Essen': 20,
  'Recklinghausen-Dortmund': 30,
  'Hagen-Dortmund': 20,
  'Hamm-Dortmund': 30,
  'Solingen-Düsseldorf': 20,
  'Remscheid-Wuppertal': 15,
  'Moers-Duisburg': 15,
  'Salzgitter-Braunschweig': 30,
  'Wolfsburg-Braunschweig': 20,
};

function getTravelTime(city1Name, city2Name) {
  if (city1Name === city2Name) return 0;
  
  const key1 = `${city1Name}-${city2Name}`;
  const key2 = `${city2Name}-${city1Name}`;
  
  if (TRAVEL_TIMES[key1]) return TRAVEL_TIMES[key1];
  if (TRAVEL_TIMES[key2]) return TRAVEL_TIMES[key2];
  
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
    
    const score = maxTime * 0.7 + avgTime * 0.3;
    
    if (score < bestScore) {
      bestScore = score;
      bestCity = candidate;
      bestDetails = { travelTimes, maxTime, avgTime };
    }
  });

  return { city: bestCity, ...bestDetails };
}

// Komponente zum Zeichnen der Verbindungslinien
function MapConnections({ selectedCities, optimalPoint, mapRef }) {
  const map = useMap();
  
  // Speichere Map-Referenz im Parent
  React.useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  
  useEffect(() => {
    if (optimalPoint && selectedCities.length > 0) {
      const allLats = [...selectedCities.map(c => c.lat), optimalPoint.city.lat];
      const allLons = [...selectedCities.map(c => c.lon), optimalPoint.city.lon];
      const bounds = [
        [Math.min(...allLats) - 0.5, Math.min(...allLons) - 0.5],
        [Math.max(...allLats) + 0.5, Math.max(...allLons) + 0.5]
      ];
      map.fitBounds(bounds);
    }
  }, [selectedCities, optimalPoint, map]);

  return (
    <>
      {optimalPoint && selectedCities.map((city, idx) => (
        <Polyline
          key={`line-${idx}`}
          positions={[
            [city.lat, city.lon],
            [optimalPoint.city.lat, optimalPoint.city.lon]
          ]}
          color="#818cf8"
          weight={2}
          opacity={0.5}
          dashArray="5, 10"
        />
      ))}
    </>
  );
}

export default function MeetingPointFinder() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [optimalPoint, setOptimalPoint] = useState(null);
  const mapRef = React.useRef(null);

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

  const resetMap = () => {
    setSelectedCities([]);
    setOptimalPoint(null);
    // Zoom zurück auf ganz Deutschland
    if (mapRef.current) {
      mapRef.current.setView([51.1657, 10.4515], 6);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Train className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Halfways
              </h1>
              <p className="text-sm text-gray-500 font-medium">Meeting Point Finder</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8 text-lg">
            Finde den optimalen Treffpunkt mit minimaler Reisezeit für alle Teilnehmer.
          </p>

          {selectedCities.length > 0 && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={resetMap}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Zurücksetzen
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Karte */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-2xl p-4 border border-indigo-200/50 shadow-xl backdrop-blur-sm">
                <div className="h-[600px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
                  <MapContainer
                    center={[51.1657, 10.4515]}
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      maxZoom={19}
                    />
                    
                    <MapConnections selectedCities={selectedCities} optimalPoint={optimalPoint} mapRef={mapRef} />
                    
                    {/* Alle Städte */}
                    {CITIES.map((city, idx) => {
                      const isSelected = selectedCities.find(c => c.name === city.name);
                      const isOptimal = optimalPoint && optimalPoint.city.name === city.name;
                      
                      // WICHTIG: Der optimale Treffpunkt hat Vorrang vor der Auswahl-Farbe
                      let markerColor, markerBorderColor, markerSize, markerOpacity;
                      
                      if (isOptimal) {
                        // Grün für optimalen Treffpunkt
                        markerColor = '#10b981';
                        markerBorderColor = '#059669';
                        markerSize = 14;
                        markerOpacity = 1;
                      } else if (isSelected) {
                        // Orange für ausgewählte Städte
                        markerColor = '#f59e0b';
                        markerBorderColor = '#d97706';
                        markerSize = 10;
                        markerOpacity = 0.9;
                      } else {
                        // Grau für verfügbare Städte
                        markerColor = '#94a3b8';
                        markerBorderColor = '#64748b';
                        markerSize = 6;
                        markerOpacity = 0.6;
                      }
                      
                      // Eindeutiger Key der sich ändert wenn Status wechselt - zwingt React zum Neurendern
                      const markerKey = `${city.name}-${isOptimal ? 'optimal' : isSelected ? 'selected' : 'available'}`;
                      
                      return (
                        <CircleMarker
                          key={markerKey}
                          center={[city.lat, city.lon]}
                          radius={markerSize}
                          fillColor={markerColor}
                          color={markerBorderColor}
                          weight={isOptimal || isSelected ? 3 : 2}
                          fillOpacity={markerOpacity}
                          eventHandlers={{
                            click: () => !isOptimal && toggleCity(city)
                          }}
                        >
                          <Popup>
                            <div className="text-center">
                              <strong className={isOptimal ? 'text-green-600' : ''}>{city.name}</strong>
                              {isOptimal && <div className="text-green-600 text-sm font-semibold mt-1">✓ Optimaler Treffpunkt</div>}
                              {isSelected && !isOptimal && (
                                <button 
                                  onClick={() => removeCity(city.name)}
                                  className="text-red-500 text-sm mt-1 hover:underline"
                                >
                                  Entfernen
                                </button>
                              )}
                              {!isSelected && !isOptimal && (
                                <div className="text-gray-500 text-xs mt-1">Klicken zum Auswählen</div>
                              )}
                            </div>
                          </Popup>
                        </CircleMarker>
                      );
                    })}
                  </MapContainer>
                </div>
                
                <div className="flex gap-4 mt-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-400 border-2 border-slate-600" style={{opacity: 0.6}}></div>
                    <span className="text-gray-600">Verfügbare Städte</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-700"></div>
                    <span className="text-gray-600">Ausgewählte Startstädte</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-700"></div>
                    <span className="text-gray-600">Optimaler Treffpunkt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/50 shadow-xl mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Ausgewählte Startstädte
                </h2>
                
                {selectedCities.length === 0 ? (
                  <p className="text-gray-500 text-sm">Klicke auf Städte auf der Karte oder nutze die Schnellauswahl unten.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCities.map(city => {
                      const isOptimal = optimalPoint && optimalPoint.city.name === city.name;
                      return (
                        <div key={city.name} className={`rounded-xl p-3 flex items-center justify-between transition-all transform hover:scale-102 ${
                          isOptimal ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-300 shadow-md' : 'bg-white shadow-sm hover:shadow-md'
                        }`}>
                          <span className={`font-medium ${isOptimal ? 'text-emerald-700' : 'text-gray-800'}`}>
                            {city.name}
                            {isOptimal && <span className="text-xs ml-2">✓ Treffpunkt</span>}
                          </span>
                          {!isOptimal && (
                            <button
                              onClick={() => removeCity(city.name)}
                              className="text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Ergebnis */}
              {optimalPoint && (
                <div className="bg-gradient-to-br from-emerald-50/80 to-green-50/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-xl">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    Optimaler Treffpunkt
                  </h2>
                  
                  <div className="bg-white/90 rounded-xl p-4 mb-4 shadow-lg border border-emerald-100">
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                      {optimalPoint.city.name}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        Max. Reisezeit: <span className="font-semibold">{optimalPoint.maxTime} Min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        Ø Reisezeit: <span className="font-semibold">{Math.round(optimalPoint.avgTime)} Min</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-700 text-sm mb-2">Reisezeiten:</h3>
                    {optimalPoint.travelTimes.map((travel, idx) => (
                      <div key={idx} className="bg-white/90 rounded-lg p-3 text-sm shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">{travel.from}</span>
                          <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{travel.time} Min</span>
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
              {CITIES.slice(0, 25).map(city => {
                const isSelected = selectedCities.find(c => c.name === city.name);
                return (
                  <button
                    key={city.name}
                    onClick={() => toggleCity(city)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-200'
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
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