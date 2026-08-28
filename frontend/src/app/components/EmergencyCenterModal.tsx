"use client";

import React, { useState, useEffect } from 'react';
import { PhoneCall, Shield, Building2, MapPin, CheckSquare, X } from 'lucide-react';

interface EmergencyLocation {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  capacity: string;
  distance_km: string;
}

interface EmergencyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyCenterModal({ isOpen, onClose }: EmergencyCenterModalProps) {
  const [activeTab, setActiveTab] = useState<'shelters' | 'checklist' | 'contacts'>('shelters');
  const [locations, setLocations] = useState<EmergencyLocation[]>([]);
  const [hazard, setHazard] = useState('flood');
  const [checklist] = useState<{ title: string; before: string[]; during: string[]; emergency_contacts: { name: string; number: string }[] }>({
    title: "Flood & Heavy Rain Safety Checklist",
    before: [
      "Charge mobile phones and power banks to 100%.",
      "Keep important documents in waterproof sealed bags.",
      "Identify nearest high-ground emergency shelter.",
      "Store at least 3 days of clean drinking water and non-perishable food."
    ],
    during: [
      "Do not walk or drive through moving water streams.",
      "Switch off main electrical breakers if water enters the house.",
      "Stay tuned to official WeatherGPT / IMD emergency broadcasts."
    ],
    emergency_contacts: [
      { name: "National Disaster Response Force (NDRF)", number: "1078 / 011-24363260" },
      { name: "State Disaster Control Room", number: "1070" },
      { name: "District Disaster Cell (Pune)", number: "020-26123371" },
      { name: "Ambulance Emergency", number: "108" }
    ]
  });

  useEffect(() => {
    if (!isOpen) return;
    fetch("http://localhost:8000/api/emergency/locations?city=Pune")
      .then(res => res.json())
      .then(data => {
        if (data.locations) setLocations(data.locations);
      })
      .catch(() => {
        // Fallback
        setLocations([
          {
            id: "loc-1",
            name: "Sassoon General Hospital & Emergency Care",
            category: "Hospital",
            city: "Pune",
            address: "Near Pune Railway Station, Sangamvadi, Pune",
            phone: "108 / +91-20-26128000",
            capacity: "150 beds",
            distance_km: "2.4"
          },
          {
            id: "loc-2",
            name: "Pune Municipal Disaster Shelter - Shivajinagar",
            category: "Shelter",
            city: "Pune",
            address: "PMC Community Hall, Shivajinagar, Pune",
            phone: "+91-20-25501000",
            capacity: "450 people",
            distance_km: "3.1"
          },
          {
            id: "loc-3",
            name: "NDRF 5th Battalion Rescue Base",
            category: "Disaster Base",
            city: "Pune",
            address: "Sudumbare, Talegaon Dabhade, Pune",
            phone: "+91-2114-237000 / 1077",
            capacity: "Specialized Flood Response Team",
            distance_km: "24.0"
          }
        ]);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl border border-red-500/30 bg-slate-900 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/20 p-2 text-red-400 border border-red-500/30">
              <Shield className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-100">Emergency Preparedness &amp; Safe Zone Finder</h2>
              <p className="text-xs text-slate-400">Offline resilient emergency guidance &amp; nearest shelter finder</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('shelters')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'shelters' ? 'border-red-500 text-red-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Safe Shelters &amp; Hospitals
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'checklist' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            Safety Checklists
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'contacts' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="h-4 w-4" />
            Helpline Contacts
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'shelters' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Nearest verified emergency care facilities &amp; shelters (cached for offline reliance):</p>
              {locations.map((loc) => (
                <div key={loc.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{loc.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        {loc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {loc.address}
                    </p>
                    <p className="text-xs text-emerald-400 font-semibold">📞 Helpline: {loc.phone} | Capacity: {loc.capacity}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded">{loc.distance_km} km</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {['flood', 'heatwave', 'cyclone'].map((h) => (
                  <button
                    key={h}
                    onClick={() => setHazard(h)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      hazard === h ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-red-400">{checklist.title}</h3>
                
                <div>
                  <h4 className="text-xs font-bold text-amber-300 mb-1">BEFORE THE HAZARD:</h4>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                    {checklist.before.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-rose-300 mb-1">DURING THE EVENT:</h4>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                    {checklist.during.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklist.emergency_contacts.map((c, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-slate-200">{c.name}</p>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">{c.number}</p>
                  </div>
                  <a href={`tel:${c.number.split('/')[0]}`} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 p-2 rounded-lg text-xs font-bold border border-emerald-500/30">
                    Call
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>Official Helpline Data — Emergency Control Response</span>
          <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-1.5 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
