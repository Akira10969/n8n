import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const SwitchSimulator: React.FC = () => {
  const [sw1, setSw1] = useState(false);
  const [sw2, setSw2] = useState(false);
  const [sw3, setSw3] = useState(false);

  // Path 1 (Top bulb) is powered if Main Switch (SW1) AND Branch Switch (SW2) are closed
  const path1Active = sw1 && sw2;
  // Path 2 (Bottom bulb) is powered if Main Switch (SW1) AND Branch Switch (SW3) are closed
  const path2Active = sw1 && sw3;

  return (
    <TopicLayout category="Circuit Fundamentals" title="Open/Closed Circuits & Paths">
      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-blue-400 text-lg mb-1">Closed Circuit</dt>
            <dd className="text-slate-300">An unbroken path that allows current to flow continuously from the source, through the load, and back.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-danger text-lg mb-1">Open Circuit</dt>
            <dd className="text-slate-300">A circuit with a physical break in the path. Current cannot flow across the gap.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-accent text-lg mb-1">Switch</dt>
            <dd className="text-slate-300">A mechanical component designed to intentionally open or close a circuit path on command.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-slate-100 text-lg mb-1">Circuit Path (Branch)</dt>
            <dd className="text-slate-300">A specific route that current can take. Electricity will split and flow down every closed path available to it.</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: Routing Current" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="text-slate-300 mb-6 text-center max-w-lg text-sm">
            Toggle the switches by clicking them to control the flow of electricity. Notice how the main switch controls everything, while the branch switches only control their specific paths.
          </div>

          <div className="relative w-full max-w-2xl h-[400px] bg-slate-900 border-2 border-slate-700 rounded-lg flex items-center justify-center mb-8 overflow-hidden">
            
            <svg viewBox="0 0 600 400" className="w-full h-full">
              {/* --- WIRES --- */}
              {/* Battery to SW1 */}
              <path d="M 100 200 L 100 100 L 200 100" fill="none" stroke={sw1 ? "#22c55e" : "#64748b"} strokeWidth="6" />
              {/* SW1 to Split */}
              <path d="M 280 100 L 300 100 L 300 300" fill="none" stroke={sw1 ? "#22c55e" : "#64748b"} strokeWidth="6" />
              
              {/* Split to SW2 (Top Path) */}
              <path d="M 300 100 L 400 100" fill="none" stroke={path1Active ? "#22c55e" : "#64748b"} strokeWidth="6" />
              {/* SW2 to Bulb 1 to Return */}
              <path d="M 460 100 L 500 100 L 500 200 L 100 200" fill="none" stroke={path1Active || path2Active ? "#22c55e" : "#64748b"} strokeWidth="6" />

              {/* Split to SW3 (Bottom Path) */}
              <path d="M 300 300 L 400 300" fill="none" stroke={path2Active ? "#22c55e" : "#64748b"} strokeWidth="6" />
              {/* SW3 to Bulb 2 to Return */}
              <path d="M 460 300 L 500 300 L 500 200" fill="none" stroke={path2Active ? "#22c55e" : "#64748b"} strokeWidth="6" />


              {/* --- COMPONENTS --- */}
              {/* Power Supply */}
              <rect x="75" y="175" width="50" height="50" rx="4" fill="#3b82f6" />
              <text x="100" y="205" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">BAT</text>

              {/* Bulb 1 (Top) */}
              <circle cx="500" cy="100" r="20" fill={path1Active ? "#fef08a" : "#1e293b"} stroke="#cbd5e1" strokeWidth="4" />
              {path1Active && <motion.circle cx="500" cy="100" r="30" fill="none" stroke="#fef08a" strokeWidth="2" animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} />}

              {/* Bulb 2 (Bottom) */}
              <circle cx="500" cy="300" r="20" fill={path2Active ? "#fef08a" : "#1e293b"} stroke="#cbd5e1" strokeWidth="4" />
              {path2Active && <motion.circle cx="500" cy="300" r="30" fill="none" stroke="#fef08a" strokeWidth="2" animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />}

              {/* --- SWITCHES (Interactive SVG Elements) --- */}
              {/* SW1 Main */}
              <g transform="translate(200, 100)" onClick={() => setSw1(!sw1)} className="cursor-pointer">
                <circle cx="0" cy="0" r="6" fill="#cbd5e1" />
                <circle cx="80" cy="0" r="6" fill="#cbd5e1" />
                <line x1="0" y1="0" x2={sw1 ? "80" : "70"} y2={sw1 ? "0" : "-30"} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" className="transition-all duration-300" />
                <rect x="-10" y="-40" width="100" height="60" fill="transparent" /> {/* Hitbox */}
                <text x="40" y="-40" fill="#cbd5e1" fontSize="14" fontWeight="bold" textAnchor="middle">MAIN (SW1)</text>
              </g>

              {/* SW2 Path 1 */}
              <g transform="translate(400, 100)" onClick={() => setSw2(!sw2)} className="cursor-pointer">
                <circle cx="0" cy="0" r="6" fill="#cbd5e1" />
                <circle cx="60" cy="0" r="6" fill="#cbd5e1" />
                <line x1="0" y1="0" x2={sw2 ? "60" : "50"} y2={sw2 ? "0" : "-20"} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" className="transition-all duration-300" />
                <rect x="-10" y="-30" width="80" height="50" fill="transparent" /> {/* Hitbox */}
                <text x="30" y="-30" fill="#cbd5e1" fontSize="12" textAnchor="middle">PATH A (SW2)</text>
              </g>

              {/* SW3 Path 2 */}
              <g transform="translate(400, 300)" onClick={() => setSw3(!sw3)} className="cursor-pointer">
                <circle cx="0" cy="0" r="6" fill="#cbd5e1" />
                <circle cx="60" cy="0" r="6" fill="#cbd5e1" />
                <line x1="0" y1="0" x2={sw3 ? "60" : "50"} y2={sw3 ? "0" : "-20"} stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" className="transition-all duration-300" />
                <rect x="-10" y="-30" width="80" height="50" fill="transparent" /> {/* Hitbox */}
                <text x="30" y="-30" fill="#cbd5e1" fontSize="12" textAnchor="middle">PATH B (SW3)</text>
              </g>

              {/* CURRENT ANIMATIONS */}
              {sw1 && (
                <circle cx="100" cy="150" r="4" fill="#fef08a">
                  <animate attributeName="cy" values="200;100" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
              {sw1 && (
                <circle cx="150" cy="100" r="4" fill="#fef08a">
                  <animate attributeName="cx" values="100;300" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              {path1Active && (
                <circle cx="450" cy="100" r="4" fill="#fef08a">
                  <animate attributeName="cx" values="300;500" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              {path2Active && (
                <circle cx="450" cy="300" r="4" fill="#fef08a">
                  <animate attributeName="cx" values="300;500" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              {path1Active && (
                <circle cx="500" cy="150" r="4" fill="#fef08a">
                  <animate attributeName="cy" values="100;200" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
              {path2Active && (
                <circle cx="500" cy="250" r="4" fill="#fef08a">
                  <animate attributeName="cy" values="300;200" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
              {(path1Active || path2Active) && (
                <circle cx="300" cy="200" r="4" fill="#fef08a">
                  <animate attributeName="cx" values="500;100" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </svg>
          </div>

          <div className="w-full bg-slate-800 p-4 border border-slate-700 rounded grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm font-bold text-white uppercase tracking-wider">
            <div className={`p-2 rounded ${!sw1 ? 'bg-engineering-danger' : 'bg-engineering-success'}`}>
              Main Circuit: {!sw1 ? 'OPEN' : 'CLOSED'}
            </div>
            <div className={`p-2 rounded ${!path1Active ? 'bg-slate-600' : 'bg-engineering-success'}`}>
              Path A: {!path1Active ? 'OFF' : 'ON'}
            </div>
            <div className={`p-2 rounded ${!path2Active ? 'bg-slate-600' : 'bg-engineering-success'}`}>
              Path B: {!path2Active ? 'OFF' : 'ON'}
            </div>
          </div>
          
        </div>
      </Section>
    </TopicLayout>
  );
};
