import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const WhatIsACircuit: React.FC = () => {
  const [hasPower, setHasPower] = useState(false);
  const [hasPath, setHasPath] = useState(false);
  const [hasLoad, setHasLoad] = useState(false);

  const isComplete = hasPower && hasPath && hasLoad;

  return (
    <TopicLayout category="Circuit Fundamentals" title="What Is an Electrical Circuit?">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          An <strong>electrical circuit</strong> is a closed, continuous path that allows electricity (electrons) to flow and do useful work.
        </p>
        <p className="mt-2">
          Every functional, basic circuit strictly requires three fundamental elements:
        </p>
        <ul className="list-decimal pl-5 mt-4 space-y-2">
          <li><strong>A Power Source:</strong> Provides the voltage (electrical pressure) to push the electrons. (e.g., Battery)</li>
          <li><strong>A Conductive Path:</strong> Provides the unbroken loop for the electrons to travel through. (e.g., Copper Wire)</li>
          <li><strong>A Load:</strong> Consumes the electrical energy and turns it into useful work like light, heat, or motion. (e.g., Lightbulb or Motor). <em>Without a load, you create a dangerous "short circuit".</em></li>
        </ul>
      </Section>

      <Section title="Interactive Visualization: Build a Circuit" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center">
          
          <div className="text-slate-300 mb-6 text-center max-w-lg text-sm">
            Toggle the switches below to add the three required components to the workspace. Watch what happens when all three requirements are met!
          </div>

          <div className="relative w-full max-w-2xl h-80 bg-slate-900 border-2 border-slate-700 rounded-lg flex items-center justify-center mb-8 shadow-inner overflow-hidden">
            
            <svg viewBox="0 0 600 300" className="w-full h-full">
              {/* --- 2. The Path (Wire) --- */}
              {hasPath && (
                <path d="M 150 150 L 150 50 L 450 50 L 450 250 L 150 250 L 150 200" fill="none" stroke="#64748b" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {/* Show ghost outline if path is missing */}
              {!hasPath && (
                <path d="M 150 150 L 150 50 L 450 50 L 450 250 L 150 250 L 150 200" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" strokeLinecap="round" strokeLinejoin="round" />
              )}

              {/* --- 1. The Power Source --- */}
              {hasPower && (
                <g>
                  <rect x="125" y="150" width="50" height="50" rx="4" fill="#3b82f6" />
                  <text x="150" y="180" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">BAT</text>
                  <rect x="135" y="140" width="30" height="10" fill="#cbd5e1" />
                </g>
              )}
              {!hasPower && (
                <rect x="125" y="150" width="50" height="50" rx="4" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
              )}

              {/* --- 3. The Load --- */}
              {hasLoad && (
                <g>
                  <circle cx="450" cy="150" r="30" fill={isComplete ? "#fef08a" : "#1e293b"} stroke="#cbd5e1" strokeWidth="4" />
                  <path d="M 435 150 Q 450 120 465 150" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                  {isComplete && (
                    <motion.circle cx="450" cy="150" r="45" fill="none" stroke="#fef08a" strokeWidth="2"
                      initial={{ opacity: 1, scale: 0.8 }} animate={{ opacity: 0, scale: 1.2 }} transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}
                </g>
              )}
              {!hasLoad && (
                <circle cx="450" cy="150" r="30" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
              )}

              {/* Current Animation (Only if Complete) */}
              {isComplete && (
                <g>
                  <circle cx="150" cy="100" r="6" fill="#facc15">
                    <animate attributeName="cy" values="150;50" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="300" cy="50" r="6" fill="#facc15">
                    <animate attributeName="cx" values="150;450" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="450" cy="200" r="6" fill="#facc15">
                    <animate attributeName="cy" values="50;250" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="300" cy="250" r="6" fill="#facc15">
                    <animate attributeName="cx" values="450;150" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 justify-between">
            <button
              onClick={() => setHasPower(!hasPower)}
              className={`flex-1 p-4 rounded border-2 transition-all font-bold ${hasPower ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'}`}
            >
              1. Power Source
            </button>
            <button
              onClick={() => setHasPath(!hasPath)}
              className={`flex-1 p-4 rounded border-2 transition-all font-bold ${hasPath ? 'bg-slate-600/50 border-slate-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'}`}
            >
              2. Conductive Path
            </button>
            <button
              onClick={() => setHasLoad(!hasLoad)}
              className={`flex-1 p-4 rounded border-2 transition-all font-bold ${hasLoad ? 'bg-yellow-600/20 border-yellow-500 text-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'}`}
            >
              3. Load
            </button>
          </div>

          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 w-full bg-engineering-success/20 border border-engineering-success rounded text-engineering-success text-center">
              <strong>Circuit Complete!</strong> The battery provides the voltage, the wire provides the continuous path, and the lightbulb consumes the power to produce light.
            </motion.div>
          )}

        </div>
      </Section>
    </TopicLayout>
  );
};
