import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const TransistorSimulator: React.FC = () => {
  const [baseCurrent, setBaseCurrent] = useState(0); // in microamps (uA)
  
  // Simulation params for an NPN transistor acting as a switch
  const hfe = 100; // DC current gain
  const maxCollectorCurrent = 100; // mA (limited by a hypothetical resistor)
  
  // Calculations
  const calculatedCollector = (baseCurrent * hfe) / 1000; // converting uA * gain to mA
  
  // Clamp collector current to max available from supply/load
  const collectorCurrent = Math.min(calculatedCollector, maxCollectorCurrent);
  
  // State variables for visualization
  const isSaturated = collectorCurrent >= maxCollectorCurrent;
  const isCutoff = baseCurrent === 0;
  
  return (
    <TopicLayout category="Electronic Components" title="Transistors (BJT) as a Switch">
      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-blue-400 text-lg mb-1">Transistor (BJT)</dt>
            <dd className="text-slate-300">A 3-terminal semiconductor device that can amplify signals or act as an electrically controlled switch.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-accent text-lg mb-1">The 3 Terminals</dt>
            <dd className="text-slate-300"><strong>Base (B):</strong> The control valve. <br/><strong>Collector (C):</strong> The high-current inlet.<br/><strong>Emitter (E):</strong> The high-current outlet.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-success text-lg mb-1">Current Gain (hFE)</dt>
            <dd className="text-slate-300">The multiplier. A tiny current entering the Base allows a proportionally massive current to flow from Collector to Emitter.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-danger text-lg mb-1">Saturation vs Cutoff</dt>
            <dd className="text-slate-300"><strong>Cutoff:</strong> No base current; switch is fully OFF.<br/><strong>Saturation:</strong> Enough base current that the switch is fully ON.</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: NPN Transistor" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="text-slate-300 mb-6 text-center max-w-lg text-sm leading-relaxed">
            Adjust the <strong>Base Current</strong> slider. Notice how injecting just a tiny trickle of current (microamps) into the Base allows a massive rush of current (milliamps) to flow through the Collector to turn on the heavy motor load!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8 w-full max-w-4xl items-center mb-8">
            
            {/* SVG Circuit Visualizer */}
            <div className="relative w-full h-80 bg-slate-900 border-2 border-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 500 350" className="w-full h-full">
                
                {/* --- WIRES --- */}
                {/* Base Circuit */}
                <path d="M 50 250 L 50 175 L 200 175" fill="none" stroke="#64748b" strokeWidth="4" />
                <path d="M 50 250 L 250 250" fill="none" stroke="#64748b" strokeWidth="4" />
                
                {/* Collector Circuit */}
                <path d="M 450 250 L 450 50 L 250 50 L 250 125" fill="none" stroke="#64748b" strokeWidth="4" />
                <path d="M 250 225 L 250 250 L 450 250" fill="none" stroke="#64748b" strokeWidth="4" />

                {/* --- COMPONENTS --- */}
                {/* Base Control Signal (Small Battery) */}
                <rect x="30" y="210" width="40" height="30" rx="4" fill="#60a5fa" />
                <text x="50" y="230" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">CTRL</text>

                {/* Heavy Load Supply (Big Battery) */}
                <rect x="430" y="125" width="40" height="60" rx="4" fill="#ef4444" />
                <text x="450" y="160" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">12V</text>
                
                {/* The Load (Motor) */}
                <circle cx="250" cy="50" r="25" fill="#1e293b" stroke="#cbd5e1" strokeWidth="4" />
                <text x="250" y="55" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">M</text>
                {/* Motor spinning animation */}
                {!isCutoff && (
                  <motion.g animate={{ rotate: 360 }} transition={{ duration: Math.max(0.2, 2 - (collectorCurrent/50)), repeat: Infinity, ease: "linear" }} style={{ originX: '250px', originY: '50px' }}>
                    <line x1="225" y1="50" x2="275" y2="50" stroke="#facc15" strokeWidth="4" opacity="0.8" />
                    <line x1="250" y1="25" x2="250" y2="75" stroke="#facc15" strokeWidth="4" opacity="0.8" />
                  </motion.g>
                )}

                {/* --- THE TRANSISTOR (NPN) --- */}
                <g transform="translate(250, 175)">
                  {/* Outer circle */}
                  <circle cx="0" cy="0" r="40" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                  {/* Vertical Base Bar */}
                  <line x1="-15" y1="-20" x2="-15" y2="20" stroke="#cbd5e1" strokeWidth="6" />
                  {/* Base Wire */}
                  <line x1="-50" y1="0" x2="-15" y2="0" stroke="#cbd5e1" strokeWidth="4" />
                  <text x="-40" y="-10" fill="#60a5fa" fontSize="14" fontWeight="bold">B</text>
                  
                  {/* Collector Wire */}
                  <line x1="0" y1="-50" x2="0" y2="-15" stroke="#cbd5e1" strokeWidth="4" />
                  <line x1="-15" y1="-10" x2="0" y2="-20" stroke="#cbd5e1" strokeWidth="4" />
                  <text x="15" y="-30" fill="#ef4444" fontSize="14" fontWeight="bold">C</text>
                  
                  {/* Emitter Wire */}
                  <line x1="0" y1="50" x2="0" y2="15" stroke="#cbd5e1" strokeWidth="4" />
                  <line x1="-15" y1="10" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="4" />
                  <text x="15" y="40" fill="#22c55e" fontSize="14" fontWeight="bold">E</text>

                  {/* NPN Arrow */}
                  <polygon points="0,20 -10,10 5,10" fill="#cbd5e1" transform="rotate(-35) translate(-4, 2)" />
                </g>

                {/* --- CURRENT ANIMATIONS --- */}
                {/* Base Current (Tiny blue dots) */}
                {baseCurrent > 0 && (
                  <g>
                    <circle cx="100" cy="175" r="2" fill="#60a5fa">
                      <animate attributeName="cx" values="50;180" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="150" cy="175" r="2" fill="#60a5fa">
                      <animate attributeName="cx" values="50;180" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
                
                {/* Collector Current (Massive yellow dots) */}
                {collectorCurrent > 0 && (
                  <g>
                    <circle cx="250" cy="100" r={Math.min(8, 2 + (collectorCurrent/10))} fill="#facc15">
                      <animate attributeName="cy" values="75;140" dur={`${Math.max(0.2, 1 - (collectorCurrent/100))}s`} repeatCount="indefinite" />
                    </circle>
                    <circle cx="450" cy="100" r={Math.min(8, 2 + (collectorCurrent/10))} fill="#facc15">
                      <animate attributeName="cy" values="50;120" dur={`${Math.max(0.2, 1 - (collectorCurrent/100))}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                )}

                {/* Emitter Current (Combined) */}
                {collectorCurrent > 0 && (
                  <circle cx="250" cy="230" r={Math.min(8, 2 + (collectorCurrent/10))} fill="#facc15">
                    <animate attributeName="cy" values="210;250" dur={`${Math.max(0.2, 1 - (collectorCurrent/100))}s`} repeatCount="indefinite" />
                  </circle>
                )}

              </svg>
            </div>

            {/* Dashboards */}
            <div className="flex flex-col gap-4 h-full">
              
              <div className="bg-slate-800 p-4 border border-blue-500 rounded-lg flex flex-col items-center">
                <span className="text-blue-400 font-bold uppercase text-xs mb-1">Base Current (Input)</span>
                <span className="text-3xl font-mono text-white font-bold">{baseCurrent}<span className="text-sm">µA</span></span>
              </div>

              <div className="flex-1 bg-engineering-base p-4 border-2 border-engineering-warning rounded-lg flex flex-col items-center justify-center">
                <span className="text-engineering-warning font-bold uppercase text-xs mb-1">Collector Current (Output)</span>
                <span className="text-4xl font-mono text-white font-bold">{collectorCurrent.toFixed(0)}<span className="text-lg">mA</span></span>
                <div className="mt-2 text-slate-400 text-xs text-center">Gain (hFE): 100x</div>
              </div>

              <div className={`p-3 rounded-lg border-2 text-center font-bold text-sm uppercase tracking-widest ${isCutoff ? 'bg-slate-800 border-slate-600 text-slate-400' : isSaturated ? 'bg-engineering-success/20 border-engineering-success text-engineering-success' : 'bg-engineering-accent/20 border-engineering-accent text-engineering-accent'}`}>
                {isCutoff ? 'Cutoff (OFF)' : isSaturated ? 'Saturated (FULL ON)' : 'Active (Amplifying)'}
              </div>

            </div>
          </div>

          {/* Controls */}
          <div className="w-full bg-slate-800 p-6 rounded-lg border border-slate-700">
            <label className="flex justify-between text-sm font-semibold text-slate-300 mb-4">
              <span>Control Valve (Base Current)</span>
              <span className="text-blue-400 font-mono">{baseCurrent} µA</span>
            </label>
            <input 
              type="range" min="0" max="1500" step="10" 
              value={baseCurrent} onChange={(e) => setBaseCurrent(Number(e.target.value))} 
              className="w-full accent-blue-500" 
            />
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
