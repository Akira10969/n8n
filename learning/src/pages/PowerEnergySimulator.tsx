import React, { useState, useEffect } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { Lightbulb, Zap } from 'lucide-react';

export const PowerEnergySimulator: React.FC = () => {
  const [voltage, setVoltage] = useState(12);
  const [current, setCurrent] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [energy, setEnergy] = useState(0); // in Joules
  
  const power = voltage * current; // Watts (Joules per second)
  
  // Power Formulas visualization
  const resistance = voltage / current; 
  
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        // Add energy based on power. Power = Joules/second.
        // Update every 100ms (0.1 seconds), so add Power * 0.1
        setEnergy(prev => prev + (power * 0.1));
      }, 100);
    }
    return () => window.clearInterval(interval);
  }, [isRunning, power]);

  // Reset energy when parameters change significantly
  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoltage(Number(e.target.value));
  };

  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(Number(e.target.value));
  };

  return (
    <TopicLayout category="Electrical Fundamentals" title="Power & Energy">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          <strong>Electrical Power (W)</strong> is the <em>rate</em> at which electrical energy is transferred or consumed. It is measured in Watts.
        </p>
        <p className="mt-2">
          <strong>Electrical Energy (J)</strong> is the <em>total amount</em> of work done over time. It is measured in Joules (or Watt-hours).
          <br/><span className="text-engineering-accent font-mono mt-1 inline-block">Energy = Power × Time</span>
        </p>
      </Section>

      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-yellow-400 text-lg mb-1">Electrical Power (W)</dt>
            <dd className="text-slate-300">The rate at which electrical energy is transferred by an electric circuit. Measured in Watts.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-accent text-lg mb-1">Electrical Energy (J)</dt>
            <dd className="text-slate-300">The total amount of work done by an electrical circuit over a specific period of time. Measured in Joules or Watt-hours.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-slate-100 text-lg mb-1">Watt (W)</dt>
            <dd className="text-slate-300">The unit of Power. One Watt equals one Joule of energy transferred per second (1W = 1 J/s).</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-slate-100 text-lg mb-1">Joule (J)</dt>
            <dd className="text-slate-300">The standard unit of Energy in the International System of Units (SI).</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: Energy Consumption" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light shadow-inner">
          
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            
            {/* The Load (Lightbulb) */}
            <div className="relative w-48 h-48 bg-slate-900 border-2 border-slate-700 rounded-full flex flex-col items-center justify-center shrink-0">
              <Lightbulb 
                className={`w-20 h-20 transition-colors duration-300 ${isRunning ? 'text-yellow-400' : 'text-slate-600'}`} 
                style={{ filter: isRunning ? `drop-shadow(0 0 ${power / 2}px rgba(250, 204, 21, 0.8))` : 'none' }}
              />
              <div className="mt-4 text-white font-bold font-mono bg-slate-800 px-3 py-1 rounded">
                {power} W
              </div>
            </div>

            {/* Energy Counter */}
            <div className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-lg p-6 w-full flex flex-col justify-center items-center relative overflow-hidden">
              <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2 z-10">Total Energy Consumed</div>
              <div className="text-5xl font-mono text-engineering-accent font-bold z-10">
                {energy.toFixed(0)} <span className="text-2xl">Joules</span>
              </div>
              <div className="text-slate-500 mt-2 z-10 text-sm">
                ({(energy / 3600).toFixed(4)} Watt-hours)
              </div>
              
              {/* Background energy filling effect */}
              <div 
                className="absolute bottom-0 left-0 w-full bg-engineering-accent/10 transition-all"
                style={{ height: `${Math.min(100, (energy / 5000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Voltage (V)</span>
                  <span className="text-blue-400 font-mono">{voltage} V</span>
                </label>
                <input 
                  type="range" min="1" max="24" step="1" 
                  value={voltage} onChange={handleVoltageChange}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
                  <span>Current (I)</span>
                  <span className="text-engineering-success font-mono">{current} A</span>
                </label>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={current} onChange={handleCurrentChange}
                  className="w-full accent-engineering-success"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-48 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all shadow-lg ${isRunning ? 'bg-engineering-danger text-white hover:bg-red-600' : 'bg-engineering-success text-white hover:bg-green-500'}`}
              >
                <Zap className={isRunning ? 'animate-pulse' : ''} />
                {isRunning ? 'Turn OFF' : 'Turn ON'}
              </button>
              <button 
                onClick={() => setEnergy(0)}
                className="mt-4 text-slate-400 text-sm hover:text-white underline"
              >
                Reset Energy Counter
              </button>
            </div>
          </div>

          {/* Power Formulas */}
          <div className="p-4 bg-engineering-base border border-engineering-light rounded-lg">
            <h4 className="text-slate-300 font-bold mb-4">The Three Power Formulas (Derived from Ohm's Law)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded text-center border border-slate-700">
                <div className="font-mono text-lg text-white mb-2">P = V × I</div>
                <div className="text-sm text-slate-400">{voltage}V × {current}A = <strong>{power}W</strong></div>
              </div>
              <div className="bg-slate-800 p-4 rounded text-center border border-slate-700">
                <div className="font-mono text-lg text-white mb-2">P = I² × R</div>
                <div className="text-sm text-slate-400">({current}A)² × {resistance.toFixed(1)}Ω = <strong>{power}W</strong></div>
              </div>
              <div className="bg-slate-800 p-4 rounded text-center border border-slate-700">
                <div className="font-mono text-lg text-white mb-2">P = V² / R</div>
                <div className="text-sm text-slate-400">({voltage}V)² / {resistance.toFixed(1)}Ω = <strong>{power}W</strong></div>
              </div>
            </div>
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
