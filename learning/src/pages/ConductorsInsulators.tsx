import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

type Material = { name: string; type: 'conductor' | 'insulator'; color: string };

const materials: Material[] = [
  { name: 'Copper Wire', type: 'conductor', color: '#b87333' },
  { name: 'Rubber Eraser', type: 'insulator', color: '#f87171' },
  { name: 'Iron Nail', type: 'conductor', color: '#94a3b8' },
  { name: 'Plastic Block', type: 'insulator', color: '#60a5fa' },
  { name: 'Gold Ring', type: 'conductor', color: '#fbbf24' },
  { name: 'Glass Rod', type: 'insulator', color: '#cbd5e1' },
];

export const ConductorsInsulators: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const isConducting = selectedMaterial?.type === 'conductor';

  return (
    <TopicLayout category="Electrical Fundamentals" title="Conductors and Insulators">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Not all materials allow electricity to flow through them easily. The atomic structure of a material determines how tightly its electrons are bound to the nucleus.
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Conductors:</strong> Materials with "free electrons" that can easily move from atom to atom. Metals like copper, gold, and silver are excellent conductors.</li>
          <li><strong>Insulators:</strong> Materials whose electrons are tightly bound and cannot easily move. Rubber, plastic, glass, and air are excellent insulators.</li>
        </ul>
      </Section>

      <Section title="Interactive Visualization: Material Testing" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-1/3 space-y-3">
            <h4 className="text-slate-300 font-bold mb-4">Select a Material to Test:</h4>
            {materials.map((mat) => (
              <button
                key={mat.name}
                onClick={() => setSelectedMaterial(mat)}
                className={`w-full p-3 rounded text-left font-semibold transition-all border ${selectedMaterial?.name === mat.name ? 'border-engineering-accent bg-engineering-accent/20 text-white' : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {mat.name}
              </button>
            ))}
          </div>

          <div className="w-full md:w-2/3 flex flex-col items-center justify-center bg-slate-900 border-2 border-slate-700 rounded-lg p-8">
            
            <svg viewBox="0 0 300 200" className="w-full h-48 mb-6">
              {/* Battery */}
              <rect x="20" y="80" width="30" height="40" rx="4" fill="#3b82f6" />
              <text x="35" y="105" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">9V</text>
              
              {/* Wires */}
              <path d="M 50 90 L 100 90" fill="none" stroke="#64748b" strokeWidth="6" />
              <path d="M 200 90 L 250 90 L 250 160 L 50 160 L 50 120" fill="none" stroke="#64748b" strokeWidth="6" />
              
              {/* LED */}
              <circle cx="250" cy="120" r="15" fill={isConducting ? "#22c55e" : "#064e3b"} stroke="#14532d" strokeWidth="3" />
              {isConducting && (
                <motion.circle cx="250" cy="120" r="20" fill="none" stroke="#22c55e" strokeWidth="2" 
                  initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, scale: 1.5 }} transition={{ repeat: Infinity, duration: 1 }}
                />
              )}

              {/* Material Placement Area */}
              <rect x="100" y="75" width="100" height="30" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
              
              {selectedMaterial && (
                <rect x="100" y="75" width="100" height="30" rx="4" fill={selectedMaterial.color} />
              )}
              {selectedMaterial && (
                <text x="150" y="95" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ textShadow: '1px 1px 2px black' }}>
                  {selectedMaterial.name}
                </text>
              )}
            </svg>

            <div className="h-20 flex items-center justify-center w-full">
              {!selectedMaterial ? (
                <p className="text-slate-400">Place a material in the gap to complete the circuit.</p>
              ) : isConducting ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-3 bg-engineering-success/20 border border-engineering-success rounded text-engineering-success">
                  <strong>Conductor!</strong> Electrons can flow through the {selectedMaterial.name}, completing the circuit and turning on the LED.
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-3 bg-engineering-danger/20 border border-engineering-danger rounded text-engineering-danger">
                  <strong>Insulator!</strong> The {selectedMaterial.name} blocks electron flow. The circuit is effectively open, so the LED remains off.
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
