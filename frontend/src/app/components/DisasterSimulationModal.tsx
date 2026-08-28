"use client";

import React, { useState } from 'react';
import { AlertTriangle, Sliders, X, ShieldAlert } from 'lucide-react';

interface ScenarioResult {
  title: string;
  simulated_hazard: string;
  baseline_risk: number;
  simulated_risk: number;
  risk_level: string;
  affected_zones: { name: string; risk: number; status: string }[];
  key_factors: { factor: string; score: number }[];
  ai_recommendation: string;
}

interface DisasterSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario?: (scenarioName: string) => void;
}

export default function DisasterSimulationModal({
  isOpen,
  onClose,
  onApplyScenario
}: DisasterSimulationModalProps) {
  const [activeTab, setActiveTab] = useState<'preset' | 'whatif'>('preset');
  const [selectedScenario, setSelectedScenario] = useState('HEAVY_RAIN');
  const [intensity] = useState(1.2);
  
  // What-If state
  const [rainDelta, setRainDelta] = useState(30);
  const [tempDelta, setTempDelta] = useState(2);
  const [windDelta, setWindDelta] = useState(15);
  
  const [simResult, setSimResult] = useState<ScenarioResult | null>({
    title: "Severe Heavy Rain Simulation",
    simulated_hazard: "Cloudburst & Torrential Rainfall",
    baseline_risk: 45,
    simulated_risk: 87,
    risk_level: "SEVERE",
    affected_zones: [
      { name: "Lonavala Ghats", risk: 98, status: "Red Alert - Landslide Watch" },
      { name: "Pune Mula-Mutha River Basin", risk: 89, status: "Red Alert - Inundation Warning" },
      { name: "Khopoli Valley", risk: 84, status: "Orange Warning - Flash Flood" }
    ],
    key_factors: [
      { factor: "Simulated Rainfall Intensity (+65 mm/hr)", score: 38 },
      { factor: "River Level Water Rise (+2.4m above danger)", score: 25 },
      { factor: "Saturated Soil Moisture Index", score: 24 }
    ],
    ai_recommendation: "Activate local disaster cells immediately. Issue mandatory travel warnings on Mumbai-Pune Expressway."
  });

  if (!isOpen) return null;

  const handleRunPreset = async (scenario: string) => {
    setSelectedScenario(scenario);
    try {
      const res = await fetch("http://localhost:8000/api/simulation/disaster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, intensity })
      });
      if (res.ok) {
        const data = await res.json();
        setSimResult(data.result);
        if (onApplyScenario) onApplyScenario(scenario);
      }
    } catch {
      // Offline fallback
    }
  };

  const calculatedWhatIfScore = Math.min(100, Math.max(0, Math.round(35 + (rainDelta * 0.45) + (tempDelta * 3.5) + (windDelta * 0.8))));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl border border-rose-500/30 bg-slate-900 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-500/20 p-2 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                Disaster &amp; What-If Weather Simulator
                <span className="text-[10px] uppercase tracking-wider bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/30">
                  Hackathon Feature
                </span>
              </h2>
              <p className="text-xs text-slate-400">Simulate extreme weather events or run hypothetical parameter changes</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('preset')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'preset' ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Disaster Scenario Presets
          </button>
          <button
            onClick={() => setActiveTab('whatif')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'whatif' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-4 w-4" />
            What-If Parameter Calculator
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'preset' ? (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Select Emergency Scenario:</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                {[
                  { id: 'HEAVY_RAIN', label: '🌧️ Heavy Rain' },
                  { id: 'FLOOD', label: '🌊 Flood' },
                  { id: 'HEATWAVE', label: '🔥 Heatwave' },
                  { id: 'CYCLONE', label: '🌀 Cyclone' },
                  { id: 'THUNDERSTORM', label: '⚡ Thunderstorm' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleRunPreset(s.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      selectedScenario === s.id
                        ? 'bg-rose-600/30 border-rose-500 text-white shadow-lg'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {simResult && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-rose-400 text-base">{simResult.title}</h3>
                      <p className="text-xs text-slate-400">Hazard: {simResult.simulated_hazard}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-rose-500">{simResult.simulated_risk}/100</span>
                      <p className="text-[10px] text-rose-300 font-bold uppercase">{simResult.risk_level} RISK</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 mb-2">Affected High-Risk Zones:</h4>
                    <div className="space-y-2">
                      {simResult.affected_zones.map((zone, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <span className="font-semibold text-slate-200">{zone.name}</span>
                          <span className="text-rose-400 font-bold">{zone.status} ({zone.risk}/100)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded-xl text-xs text-rose-200">
                    <span className="font-bold text-rose-400 block mb-1">🤖 AI Emergency Recommendation:</span>
                    {simResult.ai_recommendation}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Rainfall Increase (%):</span>
                    <span className="text-amber-400 font-bold">+{rainDelta}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rainDelta}
                    onChange={(e) => setRainDelta(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Temperature Shift (°C):</span>
                    <span className="text-amber-400 font-bold">+{tempDelta}°C</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="10"
                    value={tempDelta}
                    onChange={(e) => setTempDelta(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Wind Velocity Surge (km/h):</span>
                    <span className="text-amber-400 font-bold">+{windDelta} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={windDelta}
                    onChange={(e) => setWindDelta(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-center">
                <p className="text-xs text-amber-300 uppercase font-bold tracking-wider mb-1">Calculated Hypothetical Risk</p>
                <div className="text-4xl font-black text-amber-400 my-1">{calculatedWhatIfScore}/100</div>
                <p className="text-xs text-slate-300">
                  {calculatedWhatIfScore > 75 ? '🔴 SEVERE WEATHER RISK' : calculatedWhatIfScore > 50 ? '🟠 HIGH RISK' : '🟡 MODERATE RISK'}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  &quot;If rainfall increases by +{rainDelta}%, temp by +{tempDelta}°C and wind by +{windDelta} km/h, baseline risk increases by +{calculatedWhatIfScore - 35} points.&quot;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>⚠️ Hackathon Simulation Mode — Not an official weather warning</span>
          <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-1.5 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
