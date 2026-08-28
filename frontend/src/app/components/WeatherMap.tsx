"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Markers for Indian cities in Demo Mode
const MAP_LOCATIONS = [
  { name: "Pune", lat: 18.5204, lon: 73.8567, temp: "27°C", condition: "Heavy Rain", risk: "SEVERE", color: "red", alert: "Red Alert: Extreme Rainfall" },
  { name: "Mumbai", lat: 19.0760, lon: 72.8777, temp: "29°C", condition: "Moderate Rain", risk: "HIGH", color: "orange", alert: "Orange Warning: High Tide Ingress" },
  { name: "Lonavala", lat: 18.7557, lon: 73.4091, temp: "21°C", condition: "Extremely Heavy Rain", risk: "SEVERE", color: "red", alert: "Red Alert: Landslide Risk" },
  { name: "Khopoli", lat: 18.7904, lon: 73.3424, temp: "25°C", condition: "Heavy Rainfall", risk: "HIGH", color: "orange", alert: "Orange Alert: River Rise" },
  { name: "Panvel", lat: 18.9894, lon: 73.1175, temp: "27°C", condition: "Moderate Rain", risk: "MODERATE", color: "amber", alert: "Yellow Alert: Active Rain Watch" },
  { name: "Delhi", lat: 28.7041, lon: 77.1025, temp: "38°C", condition: "Severe Heatwave", risk: "SEVERE", color: "red", alert: "Red Alert: Extreme Heatwave" },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946, temp: "24°C", condition: "Drizzle", risk: "LOW", color: "green", alert: "None" },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, temp: "31°C", condition: "Partly Cloudy", risk: "LOW", color: "green", alert: "None" },
  { name: "Hyderabad", lat: 17.3850, lon: 78.4867, temp: "29°C", condition: "Partly Cloudy", risk: "LOW", color: "green", alert: "None" }
];

// Helper to recolor marker pin programmatically using Leaflet divIcon
const createCustomIcon = (color: string, label: string) => {
  const markerColors: Record<string, string> = {
    red: '#f43f5e',     // rose-500
    orange: '#f97316',  // orange-500
    amber: '#f59e0b',   // amber-500
    green: '#10b981'    // emerald-500
  };

  const hexColor = markerColors[color] || '#3b82f6';
  
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-6 w-6 animate-ping rounded-full opacity-40" style="background-color: ${hexColor}"></span>
        <div class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-lg" style="background-color: ${hexColor}">
          ${label}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface WeatherMapProps {
  activeLayer: string; // 'temp', 'rain', 'wind', 'risk'
  searchCenter?: [number, number];
  onMarkerClick?: (locationName: string) => void;
}

export default function WeatherMap({ activeLayer, searchCenter = [18.97, 74.5], onMarkerClick }: WeatherMapProps) {
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <MapContainer 
        center={searchCenter} 
        zoom={8} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={searchCenter} />
        
        {/* Dark CartoDB basemap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {MAP_LOCATIONS.map((loc) => {
          let label = loc.temp;
          const pinColor = loc.color;

          if (activeLayer === 'rain') {
            label = loc.condition.includes("Rain") ? "🌧️" : "☁️";
          } else if (activeLayer === 'wind') {
            label = "💨";
          } else if (activeLayer === 'risk') {
            label = loc.risk.substring(0, 3);
          }

          const icon = createCustomIcon(pinColor, label);

          return (
            <Marker 
              key={loc.name} 
              position={[loc.lat, loc.lon]} 
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) {
                    onMarkerClick(loc.name);
                  }
                }
              }}
            >
              <Popup>
                <div className="text-slate-900 font-sans p-1">
                  <h3 className="font-bold text-base border-b pb-1 text-slate-800">{loc.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-700">Temperature:</span> {loc.temp}</p>
                    <p><span className="font-semibold text-slate-700">Weather:</span> {loc.condition}</p>
                    <p>
                      <span className="font-semibold text-slate-700">Risk Level:</span> 
                      <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white
                        ${loc.risk === 'SEVERE' ? 'bg-red-500' : 
                          loc.risk === 'HIGH' ? 'bg-orange-500' : 
                          loc.risk === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'}
                      `}>
                        {loc.risk}
                      </span>
                    </p>
                    {loc.alert !== "None" && (
                      <p className="mt-1.5 text-xs text-red-600 bg-red-50 p-1 rounded font-semibold border border-red-200">
                        ⚠️ {loc.alert}
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
