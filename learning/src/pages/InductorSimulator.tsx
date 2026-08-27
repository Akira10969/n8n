import React, { useState, useEffect } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { Zap, PowerOff } from 'lucide-react';

export const InductorSimulator: React.FC = () => {
  const [powerOn, setPowerOn] = useState(false);
  const [current, setCurrent] = useState(0); // Arbitrary unit (0 to 100)
  const [magneticField, setMagneticField] = useState(0); // 0 to 100
  const [spike, setSpike] = useState(false); // Inductive kickback spike

  // Physics simulation loop
  useEffect(() => {
    let interval: number;
    if (powerOn) {
      interval = window.setInterval(() => {
        setCurrent(c => {
          const next = c + (100 - c) * 0.1; // exponential growth
          setMagneticField(next);
          return next;
        });
      }, 50);
    } else {
      // Disconnect
      interval = window.setInterval(() => {
        setCurrent(c => {
          if (c > 5) {
            // Sudden collapse causes a voltage spike
            setSpike(true);
            setTimeout(() => setSpike(false), 500); // clear spike
          }
          const next = c * 0.5; // rapid exponential decay
          setMagneticField(next);
          if (next < 1) return 0;
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [powerOn]);

  return (
    <TopicLayout category="Electronic Components" title="Inductors">
      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-warning text-lg mb-1">Inductor</dt>
            <dd className="text-slate-300">A passive component (usually a coil of wire) that stores energy in a <strong>magnetic field</strong> when electric current flows through it.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-accent text-lg mb-1">Henry (H)</dt>
            <dd className="text-slate-300">The unit of Inductance. It measures how strongly the inductor opposes changes in current.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light col-span-1 md:col-span-2">
            <dt className="font-bold text-engineering-danger text-lg mb-1">Current Inertia & Flyback</dt>
            <dd className="text-slate-300">An inductor absolutely refuses to let current change instantly. If you suddenly break the circuit, the collapsing magnetic field creates a massive voltage spike to try and keep the current flowing across the gap. This is how spark plugs work!</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: Magnetic Field & Kickback" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className={`relative w-full max-w-lg h-64 bg-slate-900 border-2 rounded-lg flex flex-col items-center justify-center mb-8 overflow-hidden transition-colors duration-200 ${spike ? 'border-engineering-danger bg-red-900/30' : 'border-slate-700'}`}>
            
            {spike && (
              <div className="absolute top-4 left-0 w-full text-center text-engineering-danger font-bold text-2xl animate-bounce z-50 drop-shadow-md">
                INDUCTIVE VOLTAGE SPIKE! ⚡
              </div>
            )}

            <svg viewBox="0 0 400 200" className="w-full h-full z-10">
              {/* Circuit Wires */}
              <path d="M 50 150 L 50 50 L 150 50" fill="none" stroke="#64748b" strokeWidth="4" />
              <path d="M 250 50 L 350 50 L 350 150 L 50 150" fill="none" stroke="#64748b" strokeWidth="4" />
              
              {/* Battery */}
              <rect x="30" y="120" width="40" height="30" fill="#3b82f6" />
              <text x="50" y="140" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">9V</text>

              {/* Switch */}
              <circle cx="150" cy="50" r="4" fill="#cbd5e1" />
              <circle cx="250" cy="50" r="4" fill="#cbd5e1" />
              <line x1="150" y1="50" x2={powerOn ? "250" : "240"} y2={powerOn ? "50" : "20"} stroke="#cbd5e1" strokeWidth="4" className="transition-all duration-200" />
              
              {/* Inductor Coil Symbol */}
              <g transform="translate(150, 150)">
                <path d="M 0 0 C 15 -30, 35 -30, 25 0 C 40 -30, 60 -30, 50 0 C 65 -30, 85 -30, 75 0 C 90 -30, 110 -30, 100 0" fill="none" stroke="#f59e0b" strokeWidth="6" />
              </g>

              {/* Magnetic Field Visualization */}
              {magneticField > 5 && (
                <g transform="translate(200, 135)">
                  {/* Expanding magnetic loops */}
                  <ellipse cx="0" cy="0" rx={magneticField * 0.8} ry={magneticField * 0.4} fill="none" stroke="#60a5fa" strokeWidth="2" opacity={0.5 + (magneticField/200)} />
                  <ellipse cx="0" cy="0" rx={magneticField * 0.6} ry={magneticField * 0.3} fill="none" stroke="#60a5fa" strokeWidth="3" opacity={0.5 + (magneticField/200)} />
                  <ellipse cx="0" cy="0" rx={magneticField * 0.4} ry={magneticField * 0.2} fill="none" stroke="#60a5fa" strokeWidth="4" opacity={0.5 + (magneticField/200)} />
                </g>
              )}

              {/* Spark (if spike) */}
              {spike && (
                <path d="M 240 20 L 245 35 L 235 35 L 250 50" fill="none" stroke="#facc15" strokeWidth="4" />
              )}
            </svg>

            {/* Readouts */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between px-8 text-sm font-mono z-20">
              <div className="bg-slate-800 p-2 rounded text-blue-400 font-bold border border-slate-700">
                Magnetic Field: {magneticField.toFixed(0)}%
              </div>
              <div className="bg-slate-800 p-2 rounded text-engineering-warning font-bold border border-slate-700">
                Current: {current.toFixed(0)}%
              </div>
            </div>
          </div>

          <button
            onClick={() => setPowerOn(!powerOn)}
            className={`px-8 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all shadow-lg text-white w-full max-w-sm ${powerOn ? 'bg-engineering-danger hover:bg-red-600' : 'bg-engineering-success hover:bg-green-500'}`}
          >
            {powerOn ? <PowerOff /> : <Zap />}
            {powerOn ? 'Disconnect Switch (Break)' : 'Close Switch (Make)'}
          </button>

          <p className="text-slate-300 text-sm mt-6 text-center max-w-xl">
            When you close the switch, the current does not instantly jump to 100%. It builds up slowly as the magnetic field expands (<strong>Current Inertia</strong>). <br/><br/>
            When you suddenly break the connection, the magnetic field instantly collapses. This forces the current to keep going, jumping across the air gap as a massive <strong>Voltage Spike</strong>!
          </p>
        </div>
      </Section>
    </TopicLayout>
  );
};
