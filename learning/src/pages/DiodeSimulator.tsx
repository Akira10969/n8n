import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const DiodeSimulator: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [componentType, setComponentType] = useState<'diode' | 'led'>('led');

  // Forward Bias is when the anode is connected to positive, cathode to negative.
  // Assuming power supply is + on left, - on right.
  // If isFlipped is false, Anode is left, Cathode is right -> Forward Bias.
  const isForwardBiased = !isFlipped;

  return (
    <TopicLayout category="Electronic Components" title="Diodes & LEDs">
      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-blue-400 text-lg mb-1">Diode</dt>
            <dd className="text-slate-300">A semiconductor device that acts like a one-way valve for electricity. It allows current to flow easily in one direction, but severely restricts it in the opposite direction.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-yellow-400 text-lg mb-1">LED (Light Emitting Diode)</dt>
            <dd className="text-slate-300">A specific type of diode that emits light when current flows through it in the forward direction.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-success text-lg mb-1">Forward Bias</dt>
            <dd className="text-slate-300">Connecting the positive voltage to the Anode and negative to the Cathode. The "valve" is open, and current flows.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-danger text-lg mb-1">Reverse Bias</dt>
            <dd className="text-slate-300">Connecting the positive voltage to the Cathode and negative to the Anode. The "valve" is slammed shut, blocking current.</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: Forward vs Reverse Bias" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="flex gap-4 mb-8 w-full max-w-md">
            <button
              onClick={() => setComponentType('led')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${componentType === 'led' ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              LED
            </button>
            <button
              onClick={() => setComponentType('diode')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${componentType === 'diode' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Standard Diode
            </button>
          </div>

          <div className="text-slate-300 mb-6 text-center max-w-lg text-sm">
            Click the "Flip Polarity" button to physically reverse the component in the circuit. Notice how the flow of current responds to the orientation of the Anode (+) and Cathode (-)!
          </div>

          <div className="relative w-full max-w-2xl h-[350px] bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-6">
            
            <svg viewBox="0 0 600 350" className="w-full h-full">
              {/* --- WIRES --- */}
              <path d="M 150 250 L 150 100 L 250 100" fill="none" stroke="#64748b" strokeWidth="6" />
              <path d="M 350 100 L 450 100 L 450 250 L 150 250" fill="none" stroke="#64748b" strokeWidth="6" />
              
              {/* --- POWER SUPPLY --- */}
              <rect x="125" y="220" width="50" height="60" rx="4" fill="#3b82f6" />
              <text x="150" y="255" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">9V</text>
              <text x="170" y="240" fill="white" fontSize="16" fontWeight="bold">+</text>

              {/* --- RESISTOR (Current Limiting) --- */}
              <g transform="translate(450, 150)">
                <rect x="-15" y="0" width="30" height="60" fill="#f59e0b" />
                <text x="25" y="35" fill="white" fontSize="12" textAnchor="start">330Ω</text>
              </g>

              {/* --- DIODE / LED COMPONENT --- */}
              {/* Rotating Wrapper */}
              <g transform={`translate(300, 100) rotate(${isFlipped ? 180 : 0})`} className="transition-transform duration-500 ease-in-out">
                
                {/* Physical Body */}
                {componentType === 'diode' ? (
                  <g>
                    {/* Standard Diode Cylinder */}
                    <rect x="-40" y="-15" width="80" height="30" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    {/* Cathode Stripe */}
                    <rect x="25" y="-15" width="10" height="30" fill="#cbd5e1" />
                  </g>
                ) : (
                  <g>
                    {/* LED Bulb */}
                    <path d="M -20 -15 C -20 -35, 20 -35, 20 -15 L 20 15 L -20 15 Z" fill={isForwardBiased ? "#ef4444" : "#475569"} stroke="#334155" strokeWidth="2" className="transition-colors duration-300" />
                    {/* Flat Spot (Cathode indicator on LED) */}
                    <line x1="20" y1="-15" x2="20" y2="15" stroke="#94a3b8" strokeWidth="4" />
                    
                    {/* Light glow if forward biased */}
                    {isForwardBiased && (
                      <circle cx="0" cy="0" r="40" fill="#ef4444" opacity="0.3">
                        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                )}

                {/* Terminals (Legs) */}
                <line x1="-50" y1="0" x2="-40" y2="0" stroke="#cbd5e1" strokeWidth="6" />
                <line x1="40" y1="0" x2="50" y2="0" stroke="#cbd5e1" strokeWidth="6" />

                {/* Labeling Anode/Cathode */}
                <text x="-25" y="35" fill="#22c55e" fontSize="12" fontWeight="bold" textAnchor="middle">ANODE (+)</text>
                <text x="25" y="35" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">CATHODE (-)</text>
                
                {/* Schematic Symbol overlay */}
                <g transform="translate(0, 0)" opacity="0.5">
                  <polygon points="-10,-10 10,0 -10,10" fill="white" />
                  <line x1="10" y1="-10" x2="10" y2="10" stroke="white" strokeWidth="3" />
                </g>
              </g>

              {/* --- CURRENT ANIMATION --- */}
              {isForwardBiased && (
                <g>
                  <circle cx="150" cy="200" r="5" fill="#facc15">
                    <animate attributeName="cy" values="220;100" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="200" cy="100" r="5" fill="#facc15">
                    <animate attributeName="cx" values="150;250" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="400" cy="100" r="5" fill="#facc15">
                    <animate attributeName="cx" values="350;450" dur="0.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="450" cy="200" r="5" fill="#facc15">
                    <animate attributeName="cy" values="100;250" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="300" cy="250" r="5" fill="#facc15">
                    <animate attributeName="cx" values="450;150" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Blocked Current Indicator */}
              {!isForwardBiased && (
                <g transform="translate(260, 100)">
                  <circle cx="0" cy="0" r="5" fill="#facc15" />
                  <path d="M 15 -15 L 35 15 M 35 -15 L 15 15" stroke="#ef4444" strokeWidth="4" />
                  <text x="25" y="30" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">BLOCKED!</text>
                </g>
              )}

            </svg>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center w-full justify-between">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-8 py-4 bg-engineering-accent hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition-transform active:scale-95 uppercase tracking-wider"
            >
              Flip Polarity
            </button>

            <div className={`flex-1 p-4 rounded-xl border-2 text-center font-bold text-lg ${isForwardBiased ? 'bg-engineering-success/20 border-engineering-success text-engineering-success' : 'bg-engineering-danger/20 border-engineering-danger text-engineering-danger'}`}>
              State: {isForwardBiased ? 'FORWARD BIASED (Conducting)' : 'REVERSE BIASED (Blocking)'}
            </div>
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
