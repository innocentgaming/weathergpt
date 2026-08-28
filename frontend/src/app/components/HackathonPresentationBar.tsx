"use client";

import React from 'react';
import { Play, CheckCircle, Zap } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  desc: string;
}

const STEPS: Step[] = [
  { id: 1, label: "Step 1: Live Weather", desc: "Pune 27°C & 82/100 Risk" },
  { id: 2, label: "Step 2: AI Weather Chat", desc: "'Will it rain tomorrow?'" },
  { id: 3, label: "Step 3: Route Intel", desc: "Pune → Mumbai Highway" },
  { id: 4, label: "Step 4: Interactive Map", desc: "Lonavala Severe Risk Zone" },
  { id: 5, label: "Step 5: Risk Explainability", desc: "'Why this risk?' breakdown" },
  { id: 6, label: "Step 6: Multilingual AI", desc: "Marathi 'पुण्यात पाऊस' query" },
  { id: 7, label: "Step 7: Offline Mode", desc: "Connectivity loss fallback" },
  { id: 8, label: "Step 8: Disaster Sim", desc: "Heavy Rain & What-If Delta" },
  { id: 9, label: "Step 9: Command Center", desc: "Disaster authority oversight" },
];

interface HackathonPresentationBarProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export default function HackathonPresentationBar({
  currentStep,
  onSelectStep,
  isOpen,
  onToggleOpen
}: HackathonPresentationBarProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xl hover:scale-105 transition-transform border border-amber-300/40"
      >
        <Zap className="h-4 w-4 animate-bounce" />
        Hackathon Presentation Mode
      </button>
    );
  }

  return (
    <div className="bg-slate-950/95 border-b border-amber-500/30 text-white px-4 py-2.5 shadow-2xl backdrop-blur-md relative z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md text-xs font-extrabold border border-amber-500/40">
            <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            HACKATHON DEMO CONTROLLER
          </div>
          <span className="text-xs text-slate-400 hidden lg:inline">
            Follow the 9-step story flow to demonstrate WeatherGPT&apos;s capabilities to judges:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                title={step.desc}
                className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-amber-500 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/20"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {isActive ? <Play className="h-3 w-3 fill-slate-950" /> : <CheckCircle className="h-3 w-3 opacity-40" />}
                <span>{step.id}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onToggleOpen}
          className="text-xs text-slate-400 hover:text-white underline underline-offset-2 ml-auto md:ml-0"
        >
          Hide Controller
        </button>
      </div>
    </div>
  );
}
