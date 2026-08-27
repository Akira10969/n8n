import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const VoltageDividerSimulator: React.FC = () => {
  const [vin, setVin] = useState(12);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(100);

  // Math
  const req = r1 + r2;
  const current = vin / req;
  const vout = (r2 / req) * vin;
  const vdropR1 = vin - vout;

  return (
    <TopicLayout category="Circuit Fundamentals" title="Voltage Division & Voltage Drop">
      <Section title="Key Terms & Formulas" icon={Icons.Concept}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <dl className="space-y-4 text-sm">
              <div className="bg-engineering-base p-4 rounded border border-engineering-light">
                <dt className="font-bold text-engineering-danger text-lg mb-1">Voltage Drop</dt>
                <dd className="text-slate-300">The reduction in voltage as current flows through a resistor. In a closed loop, the sum of all voltage drops must equal the supply voltage.</dd>
              </div>
              <div className="bg-engineering-base p-4 rounded border border-engineering-light">
                <dt className="font-bold text-blue-400 text-lg mb-1">Voltage Divider</dt>
                <dd className="text-slate-300">A simple linear circuit that produces an output voltage (V_out) that is a fraction of its input voltage (V_in) using two resistors in series.</dd>
              </div>
            </dl>
          </div>
          
          <div className="bg-slate-800 p-6 rounded border border-slate-700 flex flex-col items-center justify-center text-center">
            <div className="text-slate-400 font-bold uppercase tracking-widest mb-4">Voltage Divider Equation</div>
            <div className="text-3xl font-mono text-white font-bold mb-4">
              V<sub>out</sub> = V<sub>in</sub> × <span className="inline-block align-middle"><div className="border-b-2 border-white pb-1">R<sub>2</sub></div><div className="pt-1">R<sub>1</sub> + R<sub>2</sub></div></span>
            </div>
            <p className="text-slate-400 text-sm">This formula dictates exactly how the voltage is scaled down.</p>
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualization: Voltage Divider" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light shadow-inner">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            
            {/* The Circuit SVG */}
            <div className="relative w-full h-80 bg-slate-900 border-2 border-slate-700 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Wires */}
                <path d="M 100 250 L 100 50 L 250 50 L 250 250 L 100 250" fill="none" stroke="#64748b" strokeWidth="4" />
                <path d="M 250 150 L 320 150" fill="none" stroke="#64748b" strokeWidth="4" /> {/* Vout node */}
                <path d="M 250 250 L 320 250" fill="none" stroke="#64748b" strokeWidth="4" /> {/* Ground node */}
                
                {/* V_in Supply */}
                <rect x="80" y="125" width="40" height="50" fill="#ef4444" />
                <text x="100" y="155" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">{vin}V</text>

                {/* R1 */}
                <rect x="235" y="70" width="30" height="60" fill="#f59e0b" />
                <text x="220" y="105" fill="white" fontSize="12" textAnchor="end">R1</text>
                <text x="280" y="105" fill="#f87171" fontSize="12" textAnchor="start">Drop: {vdropR1.toFixed(1)}V</text>

                {/* R2 */}
                <rect x="235" y="170" width="30" height="60" fill="#f59e0b" />
                <text x="220" y="205" fill="white" fontSize="12" textAnchor="end">R2</text>
                <text x="280" y="205" fill="#60a5fa" fontSize="12" textAnchor="start">Drop: {vout.toFixed(1)}V</text>

                {/* V_out Probes */}
                <circle cx="320" cy="150" r="5" fill="#60a5fa" />
                <circle cx="320" cy="250" r="5" fill="#22c55e" />
                <text x="335" y="155" fill="white" fontSize="14" fontWeight="bold" textAnchor="start">V_out Node</text>
                <text x="335" y="255" fill="white" fontSize="14" fontWeight="bold" textAnchor="start">Ground (0V)</text>

                {/* Ground Symbol */}
                <path d="M 240 260 L 260 260 M 245 265 L 255 265 M 248 270 L 252 270" stroke="#22c55e" strokeWidth="2" />
                <line x1="250" y1="250" x2="250" y2="260" stroke="#22c55e" strokeWidth="2" />

                {/* Current Animation */}
                <circle cx="100" cy="100" r="4" fill="#facc15">
                  <animate attributeName="cy" values="250;50" dur={`${1 / (current * 10)}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="50" r="4" fill="#facc15">
                  <animate attributeName="cx" values="100;250" dur={`${1 / (current * 10)}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="250" cy="200" r="4" fill="#facc15">
                  <animate attributeName="cy" values="50;250" dur={`${1 / (current * 10)}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="150" cy="250" r="4" fill="#facc15">
                  <animate attributeName="cx" values="250;100" dur={`${1 / (current * 10)}s`} repeatCount="indefinite" />
                </circle>
              </svg>
            </div>

            {/* V_out Display */}
            <div className="bg-engineering-base border-2 border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-full">
              <div className="text-blue-400 font-bold uppercase tracking-widest mb-2 z-10">Output Voltage (V_out)</div>
              <div className="text-6xl font-mono text-white font-bold z-10">
                {vout.toFixed(2)}<span className="text-3xl text-slate-400">V</span>
              </div>
              <div className="mt-4 text-slate-400 text-sm z-10">
                Current: {(current * 1000).toFixed(1)} mA
              </div>
              
              {/* Vout filling effect */}
              <div 
                className="absolute bottom-0 left-0 w-full bg-blue-500/20 transition-all duration-300"
                style={{ height: `${(vout / vin) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                <span>Supply Voltage (V_in)</span>
                <span className="text-red-400 font-mono">{vin} V</span>
              </label>
              <input type="range" min="1" max="24" step="1" value={vin} onChange={(e) => setVin(Number(e.target.value))} className="w-full accent-red-500" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                <span>Resistor 1 (Top)</span>
                <span className="text-engineering-warning font-mono">{r1} Ω</span>
              </label>
              <input type="range" min="10" max="1000" step="10" value={r1} onChange={(e) => setR1(Number(e.target.value))} className="w-full accent-engineering-warning" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                <span>Resistor 2 (Bottom)</span>
                <span className="text-engineering-warning font-mono">{r2} Ω</span>
              </label>
              <input type="range" min="10" max="1000" step="10" value={r2} onChange={(e) => setR2(Number(e.target.value))} className="w-full accent-engineering-warning" />
            </div>
          </div>
          
          <div className="mt-6 text-sm text-slate-400 bg-slate-900 p-4 rounded text-center">
            <strong>Pro Tip:</strong> Notice that if R1 and R2 are identical, V_out is exactly half of V_in. This is the foundation of how <strong>Potentiometers (Volume Knobs)</strong> work!
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
