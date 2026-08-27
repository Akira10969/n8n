import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const KirchhoffSimulator: React.FC = () => {
  const [activeLaw, setActiveLaw] = useState<'kcl' | 'kvl'>('kvl');
  
  // States for interactive sliders
  const [vSupply, setVSupply] = useState(12);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);

  // KVL Calculations (Series)
  const reqSeries = r1 + r2;
  const currentSeries = vSupply / reqSeries;
  const vdrop1 = currentSeries * r1;
  const vdrop2 = currentSeries * r2;

  // KCL Calculations (Parallel / Current Division)
  const i1 = vSupply / r1; // Amps
  const i2 = vSupply / r2; // Amps
  const iTotal = i1 + i2;

  return (
    <TopicLayout category="Circuit Fundamentals" title="Kirchhoff's Laws & Circuit Analysis">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Gustav Kirchhoff formulated two fundamental rules that govern all electrical circuits. These laws are the bedrock of <strong>Circuit Analysis</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-engineering-base p-5 rounded-lg border-t-4 border-blue-500">
            <h4 className="font-bold text-white mb-2">Kirchhoff's Voltage Law (KVL)</h4>
            <p className="text-slate-300 text-sm mb-3">
              "The sum of all voltages around any closed loop in a circuit must equal zero."
            </p>
            <p className="text-slate-400 text-xs">
              <strong>Meaning:</strong> Whatever voltage the battery supplies, the components in the loop must "drop" entirely.
            </p>
          </div>
          <div className="bg-engineering-base p-5 rounded-lg border-t-4 border-engineering-success">
            <h4 className="font-bold text-white mb-2">Kirchhoff's Current Law (KCL)</h4>
            <p className="text-slate-300 text-sm mb-3">
              "The total current entering a junction (node) must equal the total current leaving the junction."
            </p>
            <p className="text-slate-400 text-xs">
              <strong>Meaning:</strong> Current doesn't magically disappear. What goes in, must come out (Conservation of Charge).
            </p>
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualization: Proving the Laws" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center">
          
          <div className="flex gap-4 mb-8 w-full max-w-md">
            <button
              onClick={() => setActiveLaw('kvl')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${activeLaw === 'kvl' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              KVL (Voltage Loop)
            </button>
            <button
              onClick={() => setActiveLaw('kcl')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${activeLaw === 'kcl' ? 'bg-engineering-success text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              KCL (Current Node)
            </button>
          </div>

          {/* SVG Visualizer */}
          <div className="relative w-full max-w-2xl h-80 bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-8">
            <svg viewBox="0 0 600 300" className="w-full h-full">
              
              {/* Common Power Supply */}
              <rect x="50" y="110" width="40" height="80" rx="4" fill="#3b82f6" />
              <text x="70" y="155" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">{vSupply}V</text>
              <text x="70" y="105" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
              <text x="70" y="210" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">-</text>

              {activeLaw === 'kvl' ? (
                // --- KVL (Series Loop) ---
                <g>
                  {/* Wires */}
                  <path d="M 90 130 L 150 130 L 150 50 L 500 50 L 500 250 L 150 250 L 150 170 L 90 170" fill="none" stroke="#64748b" strokeWidth="4" />
                  
                  {/* R1 */}
                  <rect x="250" y="40" width="80" height="20" fill="#f59e0b" />
                  <text x="290" y="30" fill="white" fontSize="12" textAnchor="middle">R1: {r1}Ω</text>
                  
                  {/* R2 */}
                  <rect x="420" y="40" width="80" height="20" fill="#f59e0b" />
                  <text x="460" y="30" fill="white" fontSize="12" textAnchor="middle">R2: {r2}Ω</text>
                  
                  {/* Voltage Probes/Drops */}
                  <path d="M 240 80 L 240 70 L 340 70 L 340 80" fill="none" stroke="#60a5fa" strokeWidth="2" />
                  <text x="290" y="95" fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle">Drop: {vdrop1.toFixed(2)}V</text>

                  <path d="M 410 80 L 410 70 L 510 70 L 510 80" fill="none" stroke="#60a5fa" strokeWidth="2" />
                  <text x="460" y="95" fill="#60a5fa" fontSize="14" fontWeight="bold" textAnchor="middle">Drop: {vdrop2.toFixed(2)}V</text>

                  {/* KVL Equation Overlay */}
                  <rect x="200" y="150" width="250" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                  <text x="325" y="175" fill="white" fontSize="14" textAnchor="middle">Loop Sum: {vSupply}V - {vdrop1.toFixed(2)}V - {vdrop2.toFixed(2)}V =</text>
                  <text x="325" y="195" fill="#60a5fa" fontSize="18" fontWeight="bold" textAnchor="middle">0V</text>

                  {/* Loop Arrow */}
                  <path d="M 170 150 A 100 100 0 1 1 170 151" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                  <polygon points="170,50 180,45 180,55" fill="#3b82f6" />
                </g>
              ) : (
                // --- KCL (Parallel Junction) ---
                <g>
                  {/* Wires */}
                  <path d="M 90 130 L 150 130 L 150 50 L 450 50 L 450 250 L 150 250 L 150 170 L 90 170" fill="none" stroke="#64748b" strokeWidth="4" />
                  <path d="M 250 50 L 250 250" fill="none" stroke="#64748b" strokeWidth="4" />
                  
                  {/* The Main Node (Junction) */}
                  <circle cx="250" cy="50" r="8" fill="#22c55e" />
                  <text x="250" y="30" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">Junction Node</text>

                  {/* R1 */}
                  <rect x="240" y="110" width="20" height="80" fill="#f59e0b" />
                  <text x="210" y="150" fill="white" fontSize="12" textAnchor="end">R1: {r1}Ω</text>
                  
                  {/* R2 */}
                  <rect x="440" y="110" width="20" height="80" fill="#f59e0b" />
                  <text x="410" y="150" fill="white" fontSize="12" textAnchor="end">R2: {r2}Ω</text>
                  
                  {/* Current Labels */}
                  <text x="180" y="70" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">I_total (IN)</text>
                  <text x="290" y="150" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="start">I_1: {(i1 * 1000).toFixed(0)}mA</text>
                  <text x="480" y="150" fill="#facc15" fontSize="14" fontWeight="bold" textAnchor="start">I_2: {(i2 * 1000).toFixed(0)}mA</text>

                  {/* KCL Equation Overlay */}
                  <rect x="180" y="200" width="280" height="60" rx="8" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
                  <text x="320" y="225" fill="white" fontSize="14" textAnchor="middle">I_in = I_out_1 + I_out_2</text>
                  <text x="320" y="245" fill="#22c55e" fontSize="16" fontWeight="bold" textAnchor="middle">
                    {(iTotal * 1000).toFixed(0)}mA = {(i1 * 1000).toFixed(0)}mA + {(i2 * 1000).toFixed(0)}mA
                  </text>

                  {/* Animated Particles to show splitting */}
                  <circle cx="150" cy="50" r="4" fill="#22c55e">
                    <animate attributeName="cx" values="100;250" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="100" r="4" fill="#facc15">
                    <animate attributeName="cy" values="50;110" dur={`${1 / i1}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx="450" cy="100" r="4" fill="#facc15">
                    <animate attributeName="cx" values="250;450" dur="1s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                <span>Supply Voltage</span>
                <span className="text-blue-400 font-mono">{vSupply} V</span>
              </label>
              <input type="range" min="1" max="24" step="1" value={vSupply} onChange={(e) => setVSupply(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                <span>Resistor 1 (R1)</span>
                <span className="text-engineering-warning font-mono">{r1} Ω</span>
              </label>
              <input type="range" min="10" max="1000" step="10" value={r1} onChange={(e) => setR1(Number(e.target.value))} className="w-full accent-engineering-warning" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                <span>Resistor 2 (R2)</span>
                <span className="text-engineering-warning font-mono">{r2} Ω</span>
              </label>
              <input type="range" min="10" max="1000" step="10" value={r2} onChange={(e) => setR2(Number(e.target.value))} className="w-full accent-engineering-warning" />
            </div>
          </div>
          
          <div className="w-full bg-engineering-base border border-engineering-light rounded-lg p-4 text-sm text-slate-300">
            {activeLaw === 'kvl' ? (
              <p><strong>Notice:</strong> As you change the resistor values, the individual voltage drops change, but they <strong>always</strong> perfectly add up to the supply voltage ({vSupply}V). This proves KVL!</p>
            ) : (
              <p><strong>Notice:</strong> As you change the resistors, the current splits differently between the two branches (Current Division). However, the sum of the two branch currents <strong>always</strong> perfectly equals the total current entering the junction node. This proves KCL!</p>
            )}
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
