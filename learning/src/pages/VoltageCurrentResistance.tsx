import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const VoltageCurrentResistance: React.FC = () => {
  const [voltage, setVoltage] = useState(10); // Pressure
  const [resistance, setResistance] = useState(5); // Pipe strictness
  
  // I = V/R
  const current = voltage / resistance;
  
  // Calculate visual properties
  const pipeWidth = Math.max(10, 60 - (resistance * 5)); // Higher resistance = narrower pipe
  const flowSpeed = current; // Higher current = faster particles
  
  const particles = Array.from({ length: 15 });

  return (
    <TopicLayout category="Electrical Fundamentals" title="Voltage, Current, and Resistance">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          The relationship between Voltage, Current, and Resistance is often explained using a <strong>water analogy</strong>.
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Voltage (V):</strong> Think of this as the water pressure pushing the water through the pipes. Higher pressure pushes more water.</li>
          <li><strong>Resistance (R):</strong> Think of this as the width of the pipe or a physical restriction in the pipe. A narrower pipe resists the flow of water.</li>
          <li><strong>Current (I):</strong> This is the actual rate of water flowing through the pipe. It depends entirely on how much pressure (Voltage) is applied and how much restriction (Resistance) is in the way.</li>
        </ul>
      </Section>

      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-blue-400 text-lg mb-1">Voltage (V)</dt>
            <dd className="text-slate-300">Also known as electromotive force. It is the difference in electric potential between two points. It is the "pressure" that pushes electrons.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-success text-lg mb-1">Current (I)</dt>
            <dd className="text-slate-300">The rate at which electric charge (electrons) flows past a point in a circuit. Measured in Amperes (A).</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-warning text-lg mb-1">Resistance (R)</dt>
            <dd className="text-slate-300">A material's opposition to the flow of electric current. Measured in Ohms (Ω).</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-slate-100 text-lg mb-1">Ampere (Amp)</dt>
            <dd className="text-slate-300">The base unit of electric current. One ampere equals one coulomb of electrical charge moving past a specific point in one second.</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: The Water Analogy" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="relative w-full max-w-2xl h-64 bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-8">
            
            {/* Water Tank (Voltage) */}
            <div className="absolute left-8 bottom-8 w-24 border-x-4 border-b-4 border-slate-500 rounded-b" style={{ height: '180px' }}>
              <div 
                className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
                style={{ height: `${(voltage / 24) * 100}%` }}
              >
                {/* Water surface animation */}
                <div className="w-full h-2 bg-blue-400 opacity-50 absolute top-0" />
              </div>
              <div className="absolute -top-6 w-full text-center text-sm font-bold text-slate-300">Pressure Tank</div>
            </div>

            {/* The Pipe (Resistance) */}
            <div 
              className="absolute left-32 bg-slate-800 border-y-4 border-slate-500 flex items-center overflow-hidden transition-all duration-300"
              style={{ width: '350px', height: `${pipeWidth}px` }}
            >
              {/* Flowing Water Particles */}
              {particles.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-blue-300 rounded-full absolute"
                  initial={{ left: '-5%' }}
                  animate={{ left: '105%' }}
                  transition={{ 
                    duration: Math.max(0.2, 5 / flowSpeed), 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: i * (Math.max(0.2, 5 / flowSpeed) / particles.length)
                  }}
                  style={{ top: `${15 + Math.random() * 60}%` }}
                />
              ))}
            </div>

            {/* Labels */}
            <div className="absolute left-[250px] top-[40px] text-slate-400 text-sm font-bold bg-slate-900 px-2">
              Restriction (Resistance)
            </div>
            
            <div className="absolute right-[50px] bottom-[20px] text-blue-400 text-sm font-bold bg-slate-900 px-2">
              Flow Rate: {current.toFixed(1)} A
            </div>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Voltage (Pressure)</span>
                  <span className="text-blue-400 font-mono">{voltage} V</span>
                </label>
                <input 
                  type="range" min="1" max="24" step="1" 
                  value={voltage} onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Resistance (Pipe Narrowness)</span>
                  <span className="text-engineering-warning font-mono">{resistance} Ω</span>
                </label>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={resistance} onChange={(e) => setResistance(Number(e.target.value))}
                  className="w-full accent-engineering-warning"
                />
              </div>
            </div>

            <div className="bg-engineering-base p-6 rounded-lg border border-engineering-light flex flex-col justify-center">
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Notice how increasing the <strong>Voltage</strong> raises the water level in the tank, pushing the particles faster.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Increasing the <strong>Resistance</strong> physically narrows the pipe, choking the flow and causing the particles to slow down.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
