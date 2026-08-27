import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export const ElectricCharge: React.FC = () => {
  const [protons, setProtons] = useState(3);
  const [electrons, setElectrons] = useState(3);

  const netCharge = protons - electrons;
  let chargeState = "Neutral";
  let chargeColor = "text-slate-300";
  
  if (netCharge > 0) {
    chargeState = "Positively Charged";
    chargeColor = "text-engineering-danger"; // Red for positive (conventional)
  } else if (netCharge < 0) {
    chargeState = "Negatively Charged";
    chargeColor = "text-blue-400"; // Blue for negative
  }

  // Generate particles based on counts
  const renderProtons = Array.from({ length: protons });
  const renderElectrons = Array.from({ length: electrons });

  return (
    <TopicLayout category="Electrical Fundamentals" title="Electric Charge & Electrons">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          At the atomic level, all matter is made of protons, neutrons, and electrons. 
          <strong> Protons</strong> carry a positive charge, while <strong>Electrons</strong> carry a negative charge.
        </p>
        <p className="mt-2">
          By default, atoms have an equal number of protons and electrons, making them electrically <strong>neutral</strong>. 
          Because protons are tightly bound in the nucleus, objects become charged exclusively by <strong>gaining or losing electrons</strong>.
        </p>
      </Section>

      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-danger text-lg mb-1">Proton</dt>
            <dd className="text-slate-300">A subatomic particle found in the nucleus of every atom. It carries a positive electrical charge.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-blue-400 text-lg mb-1">Electron</dt>
            <dd className="text-slate-300">A subatomic particle that orbits the nucleus of an atom. It carries a negative electrical charge and is responsible for electricity.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-slate-100 text-lg mb-1">Neutron</dt>
            <dd className="text-slate-300">A subatomic particle found in the nucleus of an atom with no net electric charge (neutral).</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-accent text-lg mb-1">Ion</dt>
            <dd className="text-slate-300">An atom or molecule that has a net electrical charge because it has either gained or lost electrons.</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: The Atom" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center">
          
          <div className="relative w-full max-w-md h-80 bg-slate-900 border-2 border-slate-700 rounded-full overflow-hidden flex items-center justify-center mb-6 shadow-inner">
            
            {/* Nucleus (Protons) */}
            <div className="absolute w-20 h-20 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center flex-wrap p-2 gap-1 z-10">
              {renderProtons.map((_, i) => (
                <motion.div 
                  key={`p-${i}`} 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="w-4 h-4 bg-engineering-danger rounded-full flex items-center justify-center shadow-md"
                >
                  <Plus className="w-3 h-3 text-white" />
                </motion.div>
              ))}
            </div>

            {/* Electron Orbits */}
            <div className="absolute w-40 h-40 rounded-full border border-slate-600/30" />
            <div className="absolute w-60 h-60 rounded-full border border-slate-600/30" />

            {/* Electrons animating on orbits */}
            {renderElectrons.map((_, i) => {
              // Alternate between inner and outer orbit for visualization
              const radius = i < 2 ? 80 : 120;
              const duration = i < 2 ? 3 : 5;
              const delay = (duration / renderElectrons.length) * i;
              
              return (
                <motion.div
                  key={`e-${i}`}
                  className="absolute"
                  animate={{ rotate: 360 }}
                  transition={{ duration, repeat: Infinity, ease: "linear", delay }}
                  style={{ width: radius * 2, height: radius * 2 }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                    <Minus className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center">
            
            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
              <span className="text-sm font-bold text-blue-400 w-24">Electrons (-)</span>
              <button 
                onClick={() => setElectrons(Math.max(0, electrons - 1))}
                className="w-10 h-10 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl flex items-center justify-center"
              >-</button>
              <span className="w-6 text-center font-mono text-lg text-white">{electrons}</span>
              <button 
                onClick={() => setElectrons(Math.min(8, electrons + 1))}
                className="w-10 h-10 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl flex items-center justify-center"
              >+</button>
            </div>

            <div className="flex flex-col items-center min-w-[200px]">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Net Charge</span>
              <span className={`text-2xl font-bold ${chargeColor}`}>
                {netCharge > 0 ? '+' : ''}{netCharge}
              </span>
              <span className={`text-sm font-semibold mt-1 ${chargeColor}`}>
                {chargeState}
              </span>
            </div>

          </div>

          <div className="mt-8 p-4 bg-engineering-base rounded border border-engineering-light text-slate-300 w-full text-center text-sm">
            Notice that the number of Protons (positive charge in the nucleus) remains fixed at 3. 
            You can only change the charge of the object by adding or stripping away <strong>Electrons</strong>.
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
