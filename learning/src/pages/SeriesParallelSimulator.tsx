import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const SeriesParallelSimulator: React.FC = () => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series');
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(100);
  const voltage = 9;

  // Calculations
  const reqSeries = r1 + r2;
  const reqParallel = (r1 * r2) / (r1 + r2);
  
  const iSeries = (voltage / reqSeries) * 1000; // mA
  const v1Series = (iSeries / 1000) * r1;
  const v2Series = (iSeries / 1000) * r2;

  const vParallel = voltage;
  const i1Parallel = (vParallel / r1) * 1000; // mA
  const i2Parallel = (vParallel / r2) * 1000; // mA
  const iTotalParallel = i1Parallel + i2Parallel;

  return (
    <TopicLayout category="Circuit Fundamentals" title="Series & Parallel Circuits">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Components in an electrical circuit can be connected in two primary ways: <strong>Series</strong> or <strong>Parallel</strong>.
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Series:</strong> Components are connected end-to-end. There is only one path for current to flow. The current is the same through all components, but the voltage drops across each one.</li>
          <li><strong>Parallel:</strong> Components are connected across the same two points. There are multiple paths for current. The voltage is the same across all branches, but the current splits among them.</li>
        </ul>
      </Section>

      <Section title="Interactive Visualization: Circuit Simulator" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center">
          
          <div className="flex gap-4 mb-8 w-full max-w-md">
            <button
              onClick={() => setCircuitType('series')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${circuitType === 'series' ? 'bg-engineering-accent text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Series Circuit
            </button>
            <button
              onClick={() => setCircuitType('parallel')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${circuitType === 'parallel' ? 'bg-engineering-warning text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Parallel Circuit
            </button>
          </div>

          {/* SVG Visualizer */}
          <div className="relative w-full max-w-2xl h-80 bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-8">
            <svg viewBox="0 0 600 300" className="w-full h-full">
              {/* Battery */}
              <rect x="50" y="110" width="40" height="80" rx="4" fill="#3b82f6" />
              <text x="70" y="155" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">9V</text>
              <text x="70" y="105" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
              <text x="70" y="210" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">-</text>

              {circuitType === 'series' ? (
                // --- SERIES CIRCUIT ---
                <g>
                  {/* Wires */}
                  <path d="M 90 130 L 150 130 L 150 50 L 500 50 L 500 250 L 150 250 L 150 170 L 90 170" fill="none" stroke="#64748b" strokeWidth="4" />
                  
                  {/* Resistor 1 */}
                  <rect x="250" y="40" width="80" height="20" fill="#f59e0b" />
                  <text x="290" y="30" fill="white" fontSize="12" textAnchor="middle">R1: {r1}Ω</text>
                  <text x="290" y="80" fill="#22c55e" fontSize="12" textAnchor="middle">{v1Series.toFixed(2)}V</text>

                  {/* Resistor 2 */}
                  <rect x="420" y="40" width="80" height="20" fill="#f59e0b" />
                  <text x="460" y="30" fill="white" fontSize="12" textAnchor="middle">R2: {r2}Ω</text>
                  <text x="460" y="80" fill="#22c55e" fontSize="12" textAnchor="middle">{v2Series.toFixed(2)}V</text>

                  {/* Current flow indicators */}
                  <circle cx="200" cy="50" r="4" fill="#fbbf24">
                    <animate attributeName="cx" values="150;500" dur={`${3000 / Math.max(1, iSeries)}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx="500" cy="150" r="4" fill="#fbbf24">
                    <animate attributeName="cy" values="50;250" dur={`${3000 / Math.max(1, iSeries)}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx="300" cy="250" r="4" fill="#fbbf24">
                    <animate attributeName="cx" values="500;150" dur={`${3000 / Math.max(1, iSeries)}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              ) : (
                // --- PARALLEL CIRCUIT ---
                <g>
                  {/* Wires */}
                  <path d="M 90 130 L 150 130 L 150 50 L 450 50 L 450 250 L 150 250 L 150 170 L 90 170" fill="none" stroke="#64748b" strokeWidth="4" />
                  <path d="M 250 50 L 250 250" fill="none" stroke="#64748b" strokeWidth="4" />
                  
                  {/* Resistor 1 */}
                  <rect x="240" y="110" width="20" height="80" fill="#f59e0b" />
                  <text x="210" y="150" fill="white" fontSize="12" textAnchor="end">R1: {r1}Ω</text>
                  <text x="280" y="150" fill="#22c55e" fontSize="12" textAnchor="start">{i1Parallel.toFixed(1)}mA</text>

                  {/* Resistor 2 */}
                  <rect x="440" y="110" width="20" height="80" fill="#f59e0b" />
                  <text x="410" y="150" fill="white" fontSize="12" textAnchor="end">R2: {r2}Ω</text>
                  <text x="480" y="150" fill="#22c55e" fontSize="12" textAnchor="start">{i2Parallel.toFixed(1)}mA</text>

                  {/* Current flow indicators */}
                  <circle cx="150" cy="100" r="4" fill="#fbbf24">
                    <animate attributeName="cy" values="130;50" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="100" r="4" fill="#fbbf24">
                    <animate attributeName="cy" values="50;250" dur={`${3000 / Math.max(1, i1Parallel)}s`} repeatCount="indefinite" />
                  </circle>
                  <circle cx="450" cy="100" r="4" fill="#fbbf24">
                    <animate attributeName="cy" values="50;250" dur={`${3000 / Math.max(1, i2Parallel)}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          {/* Controls & Readouts */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Resistor 1 (R1)</span>
                  <span className="text-engineering-warning font-mono">{r1} Ω</span>
                </label>
                <input 
                  type="range" min="10" max="1000" step="10" 
                  value={r1} onChange={(e) => setR1(Number(e.target.value))}
                  className="w-full accent-engineering-warning"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Resistor 2 (R2)</span>
                  <span className="text-engineering-warning font-mono">{r2} Ω</span>
                </label>
                <input 
                  type="range" min="10" max="1000" step="10" 
                  value={r2} onChange={(e) => setR2(Number(e.target.value))}
                  className="w-full accent-engineering-warning"
                />
              </div>
            </div>

            <div className="bg-engineering-base p-6 rounded-lg border border-engineering-light flex flex-col justify-center gap-4">
              <div className="flex justify-between items-center border-b border-engineering-light/50 pb-3">
                <span className="text-slate-400 text-sm">Equivalent Resistance (Req)</span>
                <span className="text-xl font-mono text-white font-bold">
                  {circuitType === 'series' ? reqSeries.toFixed(1) : reqParallel.toFixed(1)} Ω
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Current (I)</span>
                <span className="text-xl font-mono text-engineering-success font-semibold">
                  {circuitType === 'series' ? iSeries.toFixed(1) : iTotalParallel.toFixed(1)} mA
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-800 rounded border border-slate-700 text-sm text-slate-300 w-full">
            {circuitType === 'series' ? (
              <p>In <strong>Series</strong>, the equivalent resistance is the sum of all resistors (R_eq = R1 + R2). The current ({iSeries.toFixed(1)}mA) flows equally through both, causing a voltage drop across each proportional to its resistance.</p>
            ) : (
              <p>In <strong>Parallel</strong>, the equivalent resistance drops (1/R_eq = 1/R1 + 1/R2). The full 9V is applied across both resistors, causing the current to split. The path with lower resistance draws more current.</p>
            )}
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
