import React, { useState, useEffect } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { Zap, PowerOff } from 'lucide-react';

export const CapacitorSimulator: React.FC = () => {
  const [charging, setCharging] = useState(false);
  const [voltage, setVoltage] = useState(0); // Capacitor voltage
  const [time, setTime] = useState(0); // Elapsed time in ms
  
  // Circuit Params
  const vSupply = 9;
  const resistance = 10000; // 10k Ohms
  const capacitance = 0.0001; // 100uF
  const rc = resistance * capacitance; // Time constant (Tau) in seconds (1s)

  // Simulation loop
  useEffect(() => {
    let interval: number;
    if (charging) {
      interval = window.setInterval(() => {
        setTime(t => {
          const newTime = t + 50; // 50ms per tick
          // V(t) = V0 * (1 - e^(-t/RC))
          const newV = vSupply * (1 - Math.exp(-(newTime / 1000) / rc));
          setVoltage(newV);
          return newTime;
        });
      }, 50);
    } else {
      interval = window.setInterval(() => {
        setTime(t => {
          const newTime = t + 50;
          // V(t) = V_initial * e^(-t/RC)
          // To make it simple, we just decay from current voltage
          setVoltage(v => {
            const newV = v * Math.exp(-(50 / 1000) / rc);
            if (newV < 0.01) return 0;
            return newV;
          });
          return newTime; // We don't really use this for discharging math here, just tracking
        });
      }, 50);
    }
    
    return () => clearInterval(interval);
  }, [charging, rc, vSupply]);

  // Handle manual toggle
  const toggleCharge = () => {
    setCharging(!charging);
    setTime(0); // Reset time for the new curve math
  };

  const chargePercent = (voltage / vSupply) * 100;

  return (
    <TopicLayout category="Electronic Components" title="Capacitors & RC Time Constants">
      <Section title="Key Terms" icon={Icons.Concept}>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-blue-400 text-lg mb-1">Capacitor</dt>
            <dd className="text-slate-300">A passive component that stores electrical energy in an electric field. Think of it like a tiny, extremely fast temporary battery.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-accent text-lg mb-1">Farad (F)</dt>
            <dd className="text-slate-300">The unit of capacitance. 1 Farad is massive, so you will usually see microfarads (µF), nanofarads (nF), or picofarads (pF).</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-engineering-warning text-lg mb-1">RC Circuit</dt>
            <dd className="text-slate-300">A circuit containing a Resistor (R) and a Capacitor (C). The resistor limits how fast the capacitor can charge or discharge.</dd>
          </div>
          <div className="bg-engineering-base p-4 rounded border border-engineering-light">
            <dt className="font-bold text-slate-100 text-lg mb-1">Time Constant (τ)</dt>
            <dd className="text-slate-300">Calculated as τ = R × C. It is the time it takes to charge the capacitor to ~63.2% of the supply voltage.</dd>
          </div>
        </dl>
      </Section>

      <Section title="Interactive Visualization: Charging / Discharging" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full mb-8">
            
            {/* The Capacitor Visual */}
            <div className="relative w-48 h-64 bg-slate-900 border-2 border-slate-700 rounded-lg flex flex-col items-center justify-end p-4 overflow-hidden">
              <div className="absolute top-2 text-slate-400 text-xs font-bold uppercase tracking-widest z-20">100 µF</div>
              
              {/* Plates */}
              <div className="w-32 h-4 bg-slate-500 rounded-full mb-1 z-20" />
              <div className="w-32 h-32 relative z-20">
                {/* Dielectric / charge buildup */}
                <div 
                  className="absolute bottom-0 w-full bg-blue-500/80 transition-all duration-75 rounded shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  style={{ height: `${chargePercent}%` }}
                />
              </div>
              <div className="w-32 h-4 bg-slate-500 rounded-full mt-1 z-20" />
              
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold rotate-[-90deg] tracking-widest opacity-50 z-20">DIELECTRIC</div>
            </div>

            {/* Readouts */}
            <div className="bg-engineering-base border-2 border-engineering-light p-6 rounded-xl flex flex-col items-center w-64 h-64 justify-center relative overflow-hidden">
              <div className="text-slate-400 font-bold uppercase text-sm mb-2 z-10">Capacitor Voltage</div>
              <div className="text-5xl font-mono text-white font-bold z-10">
                {voltage.toFixed(2)}<span className="text-2xl text-slate-400">V</span>
              </div>
              <div className="text-slate-400 mt-4 text-sm font-mono z-10">Target: {charging ? vSupply : 0}V</div>
              <div className="text-slate-400 text-sm font-mono z-10">τ (Tau): {rc}s</div>

              <div 
                className={`absolute bottom-0 left-0 w-full transition-all duration-75 ${charging ? 'bg-engineering-success/20' : 'bg-engineering-danger/20'}`}
                style={{ height: `${chargePercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleCharge}
              className={`px-8 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 transition-all shadow-lg text-white ${charging ? 'bg-engineering-danger hover:bg-red-600' : 'bg-engineering-success hover:bg-green-500'}`}
            >
              {charging ? <PowerOff /> : <Zap />}
              {charging ? 'Disconnect Power (Discharge)' : 'Connect Power (Charge)'}
            </button>
          </div>

          <div className="mt-8 text-sm text-slate-300 bg-slate-800 p-4 rounded text-center w-full max-w-2xl border border-slate-700">
            <p>Notice that the charging (and discharging) is <strong>not linear</strong>. It charges extremely fast at first, and then slows down as it gets closer to the target voltage. This is an exponential curve defined by the RC Time Constant!</p>
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
