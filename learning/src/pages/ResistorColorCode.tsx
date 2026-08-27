import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const ResistorColorCode: React.FC = () => {
  // 4-band resistor: Band 1, Band 2, Multiplier, Tolerance
  const [b1, setB1] = useState(2); // Red (2)
  const [b2, setB2] = useState(2); // Red (2)
  const [mult, setMult] = useState(2); // Red (10^2)
  const [tol, setTol] = useState(5); // Gold (5%)

  const colors = [
    { name: 'Black', hex: '#000000', val: 0, mult: 1 },
    { name: 'Brown', hex: '#8B4513', val: 1, mult: 10, tol: 1 },
    { name: 'Red', hex: '#FF0000', val: 2, mult: 100, tol: 2 },
    { name: 'Orange', hex: '#FFA500', val: 3, mult: 1000 },
    { name: 'Yellow', hex: '#FFFF00', val: 4, mult: 10000 },
    { name: 'Green', hex: '#008000', val: 5, mult: 100000, tol: 0.5 },
    { name: 'Blue', hex: '#0000FF', val: 6, mult: 1000000, tol: 0.25 },
    { name: 'Violet', hex: '#EE82EE', val: 7, mult: 10000000, tol: 0.1 },
    { name: 'Gray', hex: '#808080', val: 8, mult: 100000000 },
    { name: 'White', hex: '#FFFFFF', val: 9, mult: 1000000000 },
  ];

  const multipliers = [...colors.slice(0, 10), { name: 'Gold', hex: '#FFD700', mult: 0.1 }, { name: 'Silver', hex: '#C0C0C0', mult: 0.01 }];
  const tolerances = [
    { name: 'Brown', hex: '#8B4513', tol: 1 },
    { name: 'Red', hex: '#FF0000', tol: 2 },
    { name: 'Green', hex: '#008000', tol: 0.5 },
    { name: 'Blue', hex: '#0000FF', tol: 0.25 },
    { name: 'Violet', hex: '#EE82EE', tol: 0.1 },
    { name: 'Gold', hex: '#FFD700', tol: 5 },
    { name: 'Silver', hex: '#C0C0C0', tol: 10 },
  ];

  // Calculation
  const baseValue = (b1 * 10) + b2;
  const multiplierValue = multipliers[mult].mult;
  const resistance = baseValue * multiplierValue;
  const toleranceValue = tolerances.find(t => t.tol === tol)?.tol || 5;

  // Formatting
  const formatResistance = (val: number) => {
    if (val >= 1e6) return `${(val / 1e6).toFixed(1).replace(/\.0$/, '')} MΩ`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(1).replace(/\.0$/, '')} kΩ`;
    return `${val.toFixed(1).replace(/\.0$/, '')} Ω`;
  };

  const minRes = resistance * (1 - (toleranceValue / 100));
  const maxRes = resistance * (1 + (toleranceValue / 100));

  return (
    <TopicLayout category="Electronic Components" title="Resistors & Color Codes">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          A <strong>Resistor</strong> is a passive component that limits current flow. Because many resistors (like through-hole carbon film resistors) are too small to print numbers on, manufacturers use painted color bands to indicate their resistance value.
        </p>
        <ul className="list-disc pl-5 mt-4 text-sm space-y-2">
          <li><strong>Band 1 & 2:</strong> The first two digits of the value.</li>
          <li><strong>Band 3 (Multiplier):</strong> The number of zeros to add to the end (or what to multiply by).</li>
          <li><strong>Band 4 (Tolerance):</strong> How precise the manufacturing is. A 5% tolerance means the actual resistance might be up to 5% higher or lower than the stated value.</li>
        </ul>
      </Section>

      <Section title="Interactive Calculator: 4-Band Resistor" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center">
          
          {/* SVG Visualizer */}
          <div className="relative w-full max-w-lg h-48 bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-8">
            <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-2xl">
              {/* Wires */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#94a3b8" strokeWidth="8" />
              
              {/* Resistor Body */}
              <rect x="100" y="70" width="200" height="60" rx="20" fill="#fcd34d" stroke="#d97706" strokeWidth="4" />
              <rect x="120" y="65" width="160" height="70" fill="#fcd34d" />
              
              {/* Bands */}
              <rect x="130" y="65" width="15" height="70" fill={colors[b1].hex} stroke="#00000033" strokeWidth="1" />
              <rect x="170" y="65" width="15" height="70" fill={colors[b2].hex} stroke="#00000033" strokeWidth="1" />
              <rect x="210" y="65" width="15" height="70" fill={multipliers[mult].hex} stroke="#00000033" strokeWidth="1" />
              
              {/* Tolerance Band (gap before it) */}
              <rect x="260" y="65" width="15" height="70" fill={tolerances.find(t => t.tol === tol)?.hex} stroke="#00000033" strokeWidth="1" />
            </svg>
          </div>

          <div className="w-full text-center mb-8 bg-engineering-base p-6 border-2 border-engineering-success rounded-xl">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Calculated Value</div>
            <div className="text-5xl font-mono text-white font-bold mb-2">
              {formatResistance(resistance)} <span className="text-2xl text-engineering-success">±{toleranceValue}%</span>
            </div>
            <div className="text-slate-400 text-sm">
              Actual value is guaranteed to be between <strong>{formatResistance(minRes)}</strong> and <strong>{formatResistance(maxRes)}</strong>.
            </div>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Band 1 */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2">Digit 1</label>
              <div className="flex flex-col gap-1 h-64 overflow-y-auto scrollbar-thin rounded border border-slate-700 bg-slate-800 p-1">
                {colors.map((c, i) => (
                  <button key={c.name} onClick={() => setB1(i)} className={`p-2 rounded text-left text-xs font-bold flex items-center gap-2 ${b1 === i ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}>
                    <span className="w-4 h-4 rounded-full border border-black/30" style={{backgroundColor: c.hex}}></span>
                    <span className={c.name === 'Black' || c.name === 'Blue' || c.name === 'Brown' ? 'text-white' : 'text-slate-300'}>{c.name} ({c.val})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Band 2 */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2">Digit 2</label>
              <div className="flex flex-col gap-1 h-64 overflow-y-auto scrollbar-thin rounded border border-slate-700 bg-slate-800 p-1">
                {colors.map((c, i) => (
                  <button key={c.name} onClick={() => setB2(i)} className={`p-2 rounded text-left text-xs font-bold flex items-center gap-2 ${b2 === i ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}>
                    <span className="w-4 h-4 rounded-full border border-black/30" style={{backgroundColor: c.hex}}></span>
                    <span className="text-slate-300">{c.name} ({c.val})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Band 3 (Multiplier) */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2">Multiplier</label>
              <div className="flex flex-col gap-1 h-64 overflow-y-auto scrollbar-thin rounded border border-slate-700 bg-slate-800 p-1">
                {multipliers.map((c, i) => (
                  <button key={c.name} onClick={() => setMult(i)} className={`p-2 rounded text-left text-xs font-bold flex items-center gap-2 ${mult === i ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}>
                    <span className="w-4 h-4 rounded-full border border-black/30" style={{backgroundColor: c.hex}}></span>
                    <span className="text-slate-300">{c.name} (x{c.mult})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Band 4 (Tolerance) */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2">Tolerance</label>
              <div className="flex flex-col gap-1 h-64 overflow-y-auto scrollbar-thin rounded border border-slate-700 bg-slate-800 p-1">
                {tolerances.map((c, i) => (
                  <button key={c.name} onClick={() => setTol(c.tol)} className={`p-2 rounded text-left text-xs font-bold flex items-center gap-2 ${tol === c.tol ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}>
                    <span className="w-4 h-4 rounded-full border border-black/30" style={{backgroundColor: c.hex}}></span>
                    <span className="text-slate-300">{c.name} (±{c.tol}%)</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
