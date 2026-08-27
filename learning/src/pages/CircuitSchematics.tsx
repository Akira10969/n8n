import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';

export const CircuitSchematics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'symbols' | 'schematic'>('symbols');

  const symbols = [
    { name: 'Wire / Conductor', symbol: 'M 0 25 L 50 25', desc: 'A path with negligible resistance.' },
    { name: 'Connected Wires', symbol: 'M 0 25 L 50 25 M 25 0 L 25 50 M 25 25', isDot: true, desc: 'A physical connection (node) between wires.' },
    { name: 'Unconnected Wires', symbol: 'M 0 25 L 15 25 Q 25 10 35 25 L 50 25 M 25 0 L 25 50', desc: 'Wires crossing without electrical connection.' },
    { name: 'Resistor (US)', symbol: 'M 0 25 L 10 25 L 15 15 L 25 35 L 35 15 L 40 25 L 50 25', desc: 'Resists current flow.' },
    { name: 'DC Voltage Source', symbol: 'M 25 0 L 25 15 M 10 15 L 40 15 M 18 25 L 32 25 M 10 35 L 40 35 M 18 45 L 32 45 M 25 45 L 25 50', desc: 'Provides DC voltage (e.g., Battery).' },
    { name: 'Ground', symbol: 'M 25 0 L 25 25 M 10 25 L 40 25 M 15 35 L 35 35 M 20 45 L 30 45', desc: '0V Reference point.' },
    { name: 'Switch (SPST)', symbol: 'M 0 25 L 15 25 L 35 15 M 40 25 L 50 25', isCircle: true, desc: 'Opens or closes a path.' },
    { name: 'LED', symbol: 'M 0 25 L 15 25 L 15 15 L 35 25 L 15 35 Z M 35 15 L 35 35 M 35 25 L 50 25 M 45 10 L 55 0 M 35 10 L 45 0', desc: 'Light Emitting Diode.' },
  ];

  return (
    <TopicLayout category="Circuit Fundamentals" title="Circuit Symbols & Schematics">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          A <strong>schematic</strong> is a standardized map of an electrical circuit. Rather than drawing realistic pictures of batteries and lightbulbs, engineers use universal <strong>circuit symbols</strong>.
        </p>
        <p className="mt-2">
          Schematics show you <em>how components are electrically connected</em>, not necessarily their physical layout on a breadboard or PCB.
        </p>
      </Section>

      <Section title="Interactive Dictionary: Standard Symbols" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light shadow-inner">
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('symbols')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${activeTab === 'symbols' ? 'bg-engineering-accent text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Symbol Dictionary
            </button>
            <button
              onClick={() => setActiveTab('schematic')}
              className={`flex-1 p-3 rounded font-bold transition-colors ${activeTab === 'schematic' ? 'bg-engineering-warning text-slate-900' : 'bg-slate-800 text-slate-400'}`}
            >
              Reading a Schematic
            </button>
          </div>

          {activeTab === 'symbols' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {symbols.map((sym, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col items-center text-center hover:border-engineering-accent transition-colors">
                  <div className="w-16 h-16 bg-slate-900 rounded mb-3 flex items-center justify-center border border-slate-600">
                    <svg viewBox="0 0 50 50" className="w-12 h-12">
                      <path d={sym.symbol} fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      {sym.isDot && <circle cx="25" cy="25" r="3" fill="#e2e8f0" />}
                      {sym.isCircle && (
                        <>
                          <circle cx="15" cy="25" r="2" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                          <circle cx="40" cy="25" r="2" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                        </>
                      )}
                    </svg>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{sym.name}</h4>
                  <p className="text-slate-400 text-xs leading-tight">{sym.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'schematic' && (
            <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-900 p-6 rounded-lg border-2 border-slate-700">
              {/* Schematic Drawing */}
              <div className="w-full max-w-sm h-64 bg-engineering-base rounded-lg border border-slate-600 flex items-center justify-center">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  {/* Wires */}
                  <path d="M 50 150 L 50 50 L 120 50" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                  <path d="M 160 50 L 250 50 L 250 100" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                  <path d="M 250 140 L 250 150 L 50 150" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                  
                  {/* Battery */}
                  <g transform="translate(50, 100)">
                    <path d="M -15 0 L 15 0 M -10 10 L 10 10" stroke="#e2e8f0" strokeWidth="2" />
                    <text x="-25" y="5" fill="#e2e8f0" fontSize="12" fontWeight="bold">9V</text>
                  </g>

                  {/* Switch */}
                  <g transform="translate(120, 50)">
                    <circle cx="0" cy="0" r="3" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                    <circle cx="40" cy="0" r="3" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                    <path d="M 0 0 L 35 -15" stroke="#e2e8f0" strokeWidth="2" />
                    <text x="15" y="-20" fill="#e2e8f0" fontSize="12">SW1</text>
                  </g>

                  {/* Resistor */}
                  <g transform="translate(250, 100)">
                    <path d="M 0 0 L 0 5 L -10 10 L 10 15 L -10 20 L 10 25 L -10 30 L 10 35 L 0 40 L 0 40" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                    <text x="15" y="25" fill="#e2e8f0" fontSize="12">R1 (330Ω)</text>
                  </g>
                </svg>
              </div>

              <div className="flex-1">
                <h4 className="text-white font-bold mb-2 text-lg">Deconstructing the Schematic</h4>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  The diagram on the left is a complete circuit represented purely by symbols. It contains:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                  <li>A <strong>9V DC Voltage Source</strong> (left) providing the power.</li>
                  <li>A <strong>SPST Switch</strong> labeled SW1 (top) that is currently open, preventing current flow.</li>
                  <li>A <strong>Resistor</strong> labeled R1 (right) with a value of 330 Ohms acting as the load.</li>
                  <li>Solid lines representing perfect conductive <strong>wires</strong> connecting them in a single series loop.</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </Section>
    </TopicLayout>
  );
};
