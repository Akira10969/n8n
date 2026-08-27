import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';

export const MosfetSimulator: React.FC = () => {
  const [gateVoltage, setGateVoltage] = useState(0); // VGS
  
  // MOSFET Threshold Voltage
  const vth = 2.5; 
  
  // States
  const isOn = gateVoltage >= vth;

  return (
    <TopicLayout category="Electronic Components" title="MOSFETs">
      <Section title="Concept" icon={Icons.Concept}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-engineering-base p-5 rounded-lg border border-engineering-light">
            <h4 className="font-bold text-blue-400 text-lg mb-2">MOSFET</h4>
            <p className="text-slate-300 text-sm">
              Metal-Oxide-Semiconductor Field-Effect Transistor. Unlike a standard BJT transistor which is controlled by <strong>Current</strong>, a MOSFET is controlled purely by <strong>Voltage</strong>.
            </p>
          </div>
          <div className="bg-engineering-base p-5 rounded-lg border border-engineering-light">
            <h4 className="font-bold text-engineering-accent text-lg mb-2">The 3 Terminals</h4>
            <p className="text-slate-300 text-sm">
              <strong>Gate (G):</strong> The control pin. It draws NO current.<br/>
              <strong>Drain (D):</strong> The current inlet (like Collector).<br/>
              <strong>Source (S):</strong> The current outlet (like Emitter).
            </p>
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualization: N-Channel MOSFET" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="text-slate-300 mb-6 text-center max-w-lg text-sm">
            Adjust the <strong>Gate-to-Source Voltage (VGS)</strong>. Notice that until it reaches the Threshold Voltage (V_th = 2.5V), the switch remains completely off. Once crossed, it turns on instantly without pulling any current from the control pin!
          </div>

          <div className="relative w-full max-w-2xl h-[300px] bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-6">
            <svg viewBox="0 0 600 300" className="w-full h-full">
              
              {/* --- WIRES --- */}
              <path d="M 150 150 L 250 150" fill="none" stroke="#64748b" strokeWidth="4" />
              <path d="M 350 250 L 350 50 L 250 50 L 250 110" fill="none" stroke="#64748b" strokeWidth="4" />
              <path d="M 250 190 L 250 250 L 350 250" fill="none" stroke="#64748b" strokeWidth="4" />

              {/* --- COMPONENTS --- */}
              <rect x="330" y="125" width="40" height="50" rx="4" fill="#ef4444" />
              <text x="350" y="155" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">24V</text>

              {/* Heavy Load */}
              <circle cx="250" cy="50" r="25" fill={isOn ? "#fef08a" : "#1e293b"} stroke="#cbd5e1" strokeWidth="4" />
              <text x="250" y="55" fill={isOn ? "#94a3b8" : "#cbd5e1"} fontSize="14" fontWeight="bold" textAnchor="middle">LOAD</text>

              {/* --- MOSFET SYMBOL --- */}
              <g transform="translate(250, 150)">
                {/* Gate wire */}
                <line x1="-100" y1="0" x2="-20" y2="0" stroke="#60a5fa" strokeWidth="4" />
                <text x="-90" y="-10" fill="#60a5fa" fontSize="14" fontWeight="bold">G ({gateVoltage}V)</text>
                
                {/* Gate Plate */}
                <line x1="-20" y1="-30" x2="-20" y2="30" stroke="#60a5fa" strokeWidth="6" />
                
                {/* Channel Plates (Broken = Enhancement mode) */}
                <line x1="-10" y1="-30" x2="-10" y2="-10" stroke="#cbd5e1" strokeWidth="6" />
                <line x1="-10" y1="-10" x2="-10" y2="10" stroke="#cbd5e1" strokeWidth="6" />
                <line x1="-10" y1="10" x2="-10" y2="30" stroke="#cbd5e1" strokeWidth="6" />

                {/* Drain */}
                <line x1="-10" y1="-20" x2="0" y2="-20" stroke="#cbd5e1" strokeWidth="4" />
                <line x1="0" y1="-40" x2="0" y2="-20" stroke="#cbd5e1" strokeWidth="4" />
                <text x="15" y="-30" fill="#ef4444" fontSize="14" fontWeight="bold">D</text>

                {/* Source */}
                <line x1="-10" y1="20" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="4" />
                <line x1="0" y1="40" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="4" />
                <text x="15" y="40" fill="#22c55e" fontSize="14" fontWeight="bold">S</text>

                {/* Body Diode / Substrate Arrow */}
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#cbd5e1" strokeWidth="4" />
                <line x1="10" y1="0" x2="10" y2="20" stroke="#cbd5e1" strokeWidth="4" />
                <polygon points="0,0 -8,-6 -8,6" fill="#cbd5e1" />
              </g>

              {/* Electric Field Animation (VGS) */}
              {gateVoltage > 0 && (
                <rect x="232" y="120" width="6" height="60" fill="#60a5fa" opacity={gateVoltage / 5} />
              )}
              {/* Channel Formation */}
              {isOn && (
                <rect x="238" y="120" width="4" height="60" fill="#22c55e" />
              )}
              
              {/* Current Animation (Drain to Source) */}
              {isOn && (
                <circle cx="250" cy="110" r="5" fill="#facc15">
                  <animate attributeName="cy" values="110;190" dur="0.2s" repeatCount="indefinite" />
                </circle>
              )}

            </svg>
          </div>

          <div className="w-full bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-300">
                Gate Voltage (V_GS)
              </label>
              <div className={`px-4 py-1 rounded font-bold text-sm ${isOn ? 'bg-engineering-success text-white' : 'bg-slate-700 text-slate-400'}`}>
                {isOn ? 'MOSFET: ON (Conducting)' : 'MOSFET: OFF (Cutoff)'}
              </div>
            </div>
            
            <input 
              type="range" min="0" max="5" step="0.1" 
              value={gateVoltage} onChange={(e) => setGateVoltage(Number(e.target.value))} 
              className="w-full accent-blue-500 mb-2" 
            />
            
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>0V</span>
              <span className="text-engineering-warning relative">
                V_th (2.5V)
                <div className="absolute top-[-25px] left-[50%] w-0.5 h-6 bg-engineering-warning/50"></div>
              </span>
              <span>5V</span>
            </div>
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
