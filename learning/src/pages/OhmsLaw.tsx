import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const OhmsLaw: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(5);
  const [resistance, setResistance] = useState<number>(1000);
  
  const current = voltage / resistance; 
  const currentMA = current * 1000; 
  const power = voltage * current; 
  const powerMW = power * 1000; 

  const [practiceAnswered, setpracticeAnswered] = useState<boolean | null>(null);

  const animationDuration = Math.max(0.2, 5 / Math.max(0.1, currentMA));

  return (
    <TopicLayout category="Electrical Fundamentals" title="Ohm's Law">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Ohm's Law is the foundational equation of electronics. It describes the relationship between <strong>Voltage (V)</strong>, <strong>Current (I)</strong>, and <strong>Resistance (R)</strong> in an electrical circuit.
        </p>
        <div className="bg-engineering-dark border border-engineering-light rounded-lg p-6 my-6 text-center shadow-inner">
          <span className="text-4xl font-mono text-engineering-accent font-bold tracking-widest">V = I × R</span>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>V (Voltage):</strong> The electrical potential or "pressure" from the power source (Volts, V).</li>
          <li><strong>R (Resistance):</strong> The restriction to the flow of electrons (Ohms, Ω).</li>
          <li><strong>I (Current):</strong> The actual rate of flow of electrons (Amperes, A).</li>
        </ul>
      </Section>

      <Section title="Key Terms & Symbols" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-blue-400 text-lg mb-1">Voltage</dt>
            <dd className="text-slate-300 mb-2">The electrical pressure pushing the electrons.</dd>
            <div className="bg-slate-800 p-2 rounded text-center font-mono">
              <span className="text-slate-400">Symbol:</span> <strong>V</strong> (or E)<br/>
              <span className="text-slate-400">Unit:</span> Volts (V)
            </div>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-success text-lg mb-1">Current</dt>
            <dd className="text-slate-300 mb-2">The rate of electron flow through the circuit.</dd>
            <div className="bg-slate-800 p-2 rounded text-center font-mono">
              <span className="text-slate-400">Symbol:</span> <strong>I</strong><br/>
              <span className="text-slate-400">Unit:</span> Amperes (A)
            </div>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-warning text-lg mb-1">Resistance</dt>
            <dd className="text-slate-300 mb-2">The restriction to the flow of electrons.</dd>
            <div className="bg-slate-800 p-2 rounded text-center font-mono">
              <span className="text-slate-400">Symbol:</span> <strong>R</strong><br/>
              <span className="text-slate-400">Unit:</span> Ohms (Ω)
            </div>
          </div>
        </dl>
      </Section>

      <Section title="The Formulas" icon={Icons.Concept}>
        <p className="mb-4">Ohm's Law can be rearranged using basic algebra depending on which value you need to calculate. If you know any two values, you can always find the third!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <div className="text-slate-400 text-sm font-bold uppercase mb-2">To find Voltage</div>
            <div className="text-2xl font-mono text-white font-bold">V = I × R</div>
          </div>
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <div className="text-slate-400 text-sm font-bold uppercase mb-2">To find Current</div>
            <div className="text-2xl font-mono text-white font-bold">I = V / R</div>
          </div>
          <div className="bg-slate-800 p-4 rounded border border-slate-700">
            <div className="text-slate-400 text-sm font-bold uppercase mb-2">To find Resistance</div>
            <div className="text-2xl font-mono text-white font-bold">R = V / I</div>
          </div>
        </div>
      </Section>

      <Section title="Visual Explanation & Interactive Example" icon={Icons.Experiment}>
        <div className="bg-engineering-dark rounded-xl p-8 flex flex-col items-center border border-engineering-light shadow-inner">
          <div className="relative w-full max-w-lg h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border-2 border-slate-700 mb-8">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Power Source */}
              <rect x="40" y="70" width="40" height="60" rx="4" fill="#3b82f6" />
              <text x="60" y="105" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">{voltage}V</text>
              
              {/* Resistor */}
              <path d="M 180 40 L 190 20 L 210 60 L 230 20 L 250 60 L 270 20 L 290 40" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" />
              <text x="235" y="80" fill="#f59e0b" fontSize="14" fontWeight="bold" textAnchor="middle">{resistance >= 1000 ? `${(resistance/1000).toFixed(1)}k` : resistance}Ω</text>
              
              {/* Wires */}
              <path d="M 60 70 L 60 40 L 180 40" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 290 40 L 340 40 L 340 160 L 60 160 L 60 130" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Current Animation (particles) */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.circle
                  key={i}
                  r={Math.min(6, Math.max(2, currentMA / 5))}
                  fill="#fbbf24"
                  initial={{ offsetDistance: '0%' }}
                  animate={{ offsetDistance: '100%' }}
                  transition={{ 
                    duration: animationDuration, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: i * (animationDuration / 15)
                  }}
                  style={{
                    offsetPath: "path('M 60 70 L 60 40 L 180 40 L 190 20 L 210 60 L 230 20 L 250 60 L 270 20 L 290 40 L 340 40 L 340 160 L 60 160 L 60 130')"
                  }}
                />
              ))}
            </svg>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Voltage (V)</span>
                  <span className="text-engineering-accent font-mono">{voltage} V</span>
                </label>
                <input 
                  type="range" min="1" max="24" step="1" 
                  value={voltage} onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full accent-engineering-accent"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Resistance (R)</span>
                  <span className="text-engineering-warning font-mono">{resistance} Ω</span>
                </label>
                <input 
                  type="range" min="10" max="10000" step="10" 
                  value={resistance} onChange={(e) => setResistance(Number(e.target.value))}
                  className="w-full accent-engineering-warning"
                />
              </div>
            </div>

            {/* Readouts */}
            <div className="bg-engineering-base p-6 rounded-lg border border-engineering-light flex flex-col justify-center gap-4">
              <div className="flex justify-between items-center border-b border-engineering-light/50 pb-3">
                <span className="text-slate-400 text-sm">Calculated Current (I = V/R)</span>
                <span className="text-2xl font-mono text-engineering-success font-bold">
                  {currentMA < 1 ? currentMA.toFixed(3) : currentMA.toFixed(1)} mA
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Power Dissipation (P = V×I)</span>
                <span className="text-xl font-mono text-engineering-danger font-semibold">
                  {powerMW < 1 ? powerMW.toFixed(3) : powerMW.toFixed(1)} mW
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Explanation" icon={Icons.Concept}>
        <p>
          As you increase the <strong>Voltage</strong>, the electrical pressure pushing the electrons increases, resulting in a higher <strong>Current</strong>.
        </p>
        <p>
          Conversely, as you increase the <strong>Resistance</strong>, it becomes harder for electrons to flow, resulting in a lower <strong>Current</strong>. 
        </p>
        <p>
          Notice how the Power Dissipation (heat generated by the resistor) increases exponentially as current increases. This is because Power can also be written as P = I²R.
        </p>
      </Section>

      <Section title="Practice" icon={Icons.Practice}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light">
          <p className="mb-4 font-medium text-lg">You have a 5V power supply and a 1kΩ (1000Ω) resistor. What is the current flowing through the resistor?</p>
          <div className="space-y-3 text-sm">
            <button 
              className={`w-full text-left p-4 rounded border transition-colors ${practiceAnswered === false ? 'border-engineering-danger bg-engineering-danger/10' : 'border-engineering-light hover:bg-engineering-light/50'}`}
              onClick={() => setpracticeAnswered(false)}
            >
              A. 5 A
            </button>
            <button 
              className={`w-full text-left p-4 rounded border transition-colors ${practiceAnswered === true ? 'border-engineering-success bg-engineering-success/10' : 'border-engineering-light hover:bg-engineering-light/50'}`}
              onClick={() => setpracticeAnswered(true)}
            >
              B. 5 mA (0.005 A)
            </button>
            <button 
              className={`w-full text-left p-4 rounded border transition-colors ${practiceAnswered === false ? 'border-engineering-danger bg-engineering-danger/10' : 'border-engineering-light hover:bg-engineering-light/50'}`}
              onClick={() => setpracticeAnswered(false)}
            >
              C. 500 mA
            </button>
          </div>
          {practiceAnswered === true && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-engineering-success/10 text-engineering-success border border-engineering-success/30 rounded">
              <strong>Correct!</strong> Using Ohm's Law (I = V / R): I = 5V / 1000Ω = 0.005 Amperes, which converts to 5 milliamperes (mA).
            </motion.div>
          )}
        </div>
      </Section>
    </TopicLayout>
  );
};
