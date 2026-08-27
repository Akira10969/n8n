import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const DCvsAC: React.FC = () => {
  const [currentType, setCurrentType] = useState<'DC' | 'AC'>('DC');
  const [voltage, setVoltage] = useState(5);
  
  // Create path for waveform based on current state
  let pathData = "";
  if (currentType === 'DC') {
    // A straight line at the designated voltage height
    const yPos = 100 - (voltage * 10);
    pathData = `M 0 ${yPos} L 500 ${yPos}`;
  } else {
    // Sine wave
    const amplitude = voltage * 10;
    // Frequency could be adjusted, keeping it constant for now
    pathData = "M 0 100 ";
    for (let i = 0; i <= 500; i += 10) {
      const y = 100 - (Math.sin(i * 0.05) * amplitude);
      pathData += `L ${i} ${y} `;
    }
  }

  return (
    <TopicLayout category="Electrical Fundamentals" title="DC vs AC">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Electrical current can flow in two different ways depending on how the voltage is supplied: <strong>Direct Current (DC)</strong> and <strong>Alternating Current (AC)</strong>.
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Direct Current (DC):</strong> The electrical charge flows in only one direction. The voltage remains constant over time. This is the type of power supplied by batteries and USB ports. Most digital electronics require DC power to function.</li>
          <li><strong>Alternating Current (AC):</strong> The electrical charge periodically reverses direction. The voltage oscillates as a sine wave, constantly changing polarity from positive to negative. This is the type of power supplied by wall outlets and power grids because it is highly efficient to transmit over long distances.</li>
        </ul>
      </Section>

      <Section title="Interactive Visualization: Waveforms" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light shadow-inner">
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCurrentType('DC')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${currentType === 'DC' ? 'bg-engineering-accent text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Direct Current (DC)
            </button>
            <button
              onClick={() => setCurrentType('AC')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${currentType === 'AC' ? 'bg-engineering-warning text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Alternating Current (AC)
            </button>
          </div>

          <div className="relative w-full h-64 bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Grid background */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#334155" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* X and Y axes */}
              <line x1="0" y1="100" x2="100%" y2="100" stroke="#94a3b8" strokeWidth="2" />
              <line x1="25" y1="0" x2="25" y2="100%" stroke="#94a3b8" strokeWidth="2" />
              
              <text x="35" y="15" fill="#94a3b8" fontSize="12">Voltage (+)</text>
              <text x="35" y="190" fill="#94a3b8" fontSize="12">Voltage (-)</text>
              <text x="90%" y="115" fill="#94a3b8" fontSize="12">Time (t)</text>

              {/* The Waveform */}
              <motion.path 
                d={pathData} 
                fill="none" 
                stroke={currentType === 'DC' ? '#3b82f6' : '#eab308'} 
                strokeWidth="4" 
                initial={false}
                animate={{ d: pathData }}
                transition={{ type: 'spring', bounce: 0.2 }}
              />
            </svg>
          </div>

          <div className="mt-6 flex flex-col gap-2 max-w-sm">
            <label className="flex justify-between text-sm font-semibold text-slate-300">
              <span>Amplitude (Peak Voltage)</span>
              <span>{voltage}V</span>
            </label>
            <input 
              type="range" min="1" max="8" step="1" 
              value={voltage} onChange={(e) => setVoltage(Number(e.target.value))}
              className={`w-full ${currentType === 'DC' ? 'accent-engineering-accent' : 'accent-engineering-warning'}`}
            />
          </div>

          <div className="mt-6 p-4 bg-engineering-base rounded border border-engineering-light text-slate-300">
            {currentType === 'DC' ? (
              <p>In DC, the voltage stays firmly at {voltage}V over time. The electricity flows smoothly in a single direction.</p>
            ) : (
              <p>In AC, the voltage continually sweeps from +{voltage}V down to -{voltage}V and back again. The electricity is effectively moving forward and backwards through the wires repeatedly.</p>
            )}
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
