import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, Power } from 'lucide-react';

export const CircuitSafety: React.FC = () => {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [componentReplaced, setComponentReplaced] = useState(false);
  const [shocked, setShocked] = useState(false);

  const handleReplaceComponent = () => {
    if (isPowerOn) {
      // Uh oh, safety violation!
      setShocked(true);
      setTimeout(() => setShocked(false), 2000);
    } else {
      // Safe replacement
      setComponentReplaced(true);
      setTimeout(() => setComponentReplaced(false), 2000);
    }
  };

  return (
    <TopicLayout category="Electrical Fundamentals" title="Basic Circuit Safety">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Working with electricity requires strict adherence to safety protocols to prevent shock, burns, or electrical fires. 
          The golden rule of electronics is: <strong>Never work on a live circuit.</strong>
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li><strong>Disconnect Power:</strong> Always unplug or remove batteries before modifying a circuit.</li>
          <li><strong>Current Kills:</strong> It only takes a tiny amount of current (as low as 50mA) passing through the heart to be lethal. High voltage is dangerous because it can push that lethal current through the resistance of your skin.</li>
          <li><strong>Double Check Polarity:</strong> Plugging polarized components (like electrolytic capacitors or ICs) in backwards can cause them to explode when power is applied.</li>
        </ul>
      </Section>

      <Section title="Interactive Visualization: Safe Modification" icon={Icons.Experiment}>
        <div className={`bg-engineering-dark p-6 rounded-lg border flex flex-col items-center transition-colors duration-300 ${shocked ? 'border-engineering-danger bg-red-900/20' : 'border-engineering-light'}`}>
          
          <div className="w-full text-center mb-6">
            <h4 className="text-white font-bold text-lg mb-2">Scenario: Replace the Resistor</h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              The resistor in the circuit below has burned out. You need to swap it for a new one. Follow the proper safety procedures to swap it without getting shocked!
            </p>
          </div>

          {/* Circuit UI */}
          <div className="relative w-full max-w-2xl h-80 bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden flex items-center justify-center mb-6">
            
            {/* The Shock Overlay */}
            {shocked && (
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-white z-50 pointer-events-none flex items-center justify-center mix-blend-overlay"
              >
                <Zap className="w-48 h-48 text-yellow-300 drop-shadow-[0_0_20px_rgba(250,204,21,1)]" />
              </motion.div>
            )}

            <svg viewBox="0 0 600 300" className="w-full h-full">
              {/* Circuit Path */}
              <path d="M 150 200 L 150 100 L 450 100 L 450 200" fill="none" stroke={isPowerOn ? "#ef4444" : "#64748b"} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Power Supply Box */}
              <rect x="100" y="200" width="100" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="4" />
              <text x="150" y="235" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">120V PSU</text>
              
              {/* Load (Resistor area) */}
              <rect x="400" y="200" width="100" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="4" strokeDasharray="5,5" />
              
              {/* Actual Component */}
              <motion.rect 
                x="420" y="210" width="60" height="40" rx="4" 
                fill={componentReplaced ? "#22c55e" : "#f59e0b"} 
                initial={false}
                animate={componentReplaced ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              />
              <text x="450" y="235" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">
                {componentReplaced ? 'NEW' : 'OLD'}
              </text>

              {/* Current Indicator (only if power is on) */}
              {isPowerOn && (
                <circle cx="150" cy="150" r="6" fill="#facc15">
                  <animate attributeName="cy" values="200;100" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
              {isPowerOn && (
                <circle cx="300" cy="100" r="6" fill="#facc15">
                  <animate attributeName="cx" values="150;450" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
            </svg>

            {/* Floating Disconnect Switch */}
            <div className="absolute left-8 top-8">
              <button 
                onClick={() => setIsPowerOn(!isPowerOn)}
                className={`flex items-center gap-2 px-4 py-2 rounded font-bold shadow-lg transition-colors border-2 ${isPowerOn ? 'bg-engineering-danger border-red-400 text-white' : 'bg-slate-700 border-slate-500 text-slate-300 hover:bg-slate-600'}`}
              >
                <Power className="w-5 h-5" />
                {isPowerOn ? 'POWER: ON' : 'POWER: OFF'}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button 
              onClick={handleReplaceComponent}
              className="px-8 py-4 bg-engineering-accent hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              Swap Component (Hands On)
            </button>

            {shocked && (
              <div className="flex items-center gap-2 text-engineering-danger font-bold bg-red-900/30 px-4 py-2 rounded">
                <ShieldAlert className="w-5 h-5" />
                ZAP! Always turn off the power first!
              </div>
            )}
            
            {componentReplaced && !shocked && (
              <div className="flex items-center gap-2 text-engineering-success font-bold bg-green-900/30 px-4 py-2 rounded">
                <Icons.Check />
                Safe swap successful!
              </div>
            )}
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
