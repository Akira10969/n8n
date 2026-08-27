import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';

export const VoltageRegulator: React.FC = () => {
  const [vin, setVin] = useState(9); // Unregulated input

  // Simulate a 5V Zener diode or 5V Linear Regulator (e.g. 7805)
  // Drops anything above 5V down to 5V. If below 5V, it outputs Vin (minus a tiny dropout, but let's keep it simple).
  const vout = vin >= 5 ? 5 : vin;

  return (
    <TopicLayout category="Electronic Components" title="Zener Diodes & Voltage Regulators">
      <Section title="Concept" icon={Icons.Concept}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-engineering-base p-5 rounded-lg border-l-4 border-engineering-accent">
            <h4 className="font-bold text-white mb-2">Zener Diodes</h4>
            <p className="text-slate-300 text-sm">
              Normal diodes block reverse current completely. <strong>Zener Diodes</strong> are special: if the reverse voltage gets high enough (the "Zener Breakdown Voltage"), they suddenly open up and let current through to keep the voltage exactly at that limit.
            </p>
          </div>
          <div className="bg-engineering-base p-5 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-bold text-white mb-2">Linear Regulators (LDOs)</h4>
            <p className="text-slate-300 text-sm">
              ICs like the famous <strong>7805</strong> use internal Zener diodes and transistors to take a messy, fluctuating input voltage (like 9V) and output a perfectly stable, flat voltage (like 5.0V) for sensitive microcontrollers.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Interactive Visualization: Voltage Regulation" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="text-slate-300 mb-6 text-center max-w-lg text-sm">
            Adjust the <strong>Unregulated Input Voltage</strong>. Notice that no matter how high the input goes (simulating a noisy or overpowered battery), the Regulator clamps the Output Voltage to exactly <strong>5.0V</strong>!
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 w-full max-w-2xl justify-center">
            
            {/* Input Dial */}
            <div className="flex flex-col items-center p-4 bg-slate-800 rounded-lg border border-slate-700 w-48">
              <div className="text-slate-400 font-bold uppercase text-xs mb-2">Input (V_in)</div>
              <div className="text-4xl font-mono text-engineering-danger font-bold mb-4">{vin.toFixed(1)}V</div>
              <input 
                type="range" min="0" max="15" step="0.5" 
                value={vin} onChange={(e) => setVin(Number(e.target.value))} 
                className="w-full accent-engineering-danger" 
              />
            </div>

            {/* The Regulator IC */}
            <div className="relative w-32 h-32 bg-slate-900 border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {/* Heat waves if working hard */}
              {vin > 6 && (
                <div className="absolute -top-8 text-engineering-warning animate-bounce opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              )}
              
              <div className="w-20 h-20 bg-slate-800 rounded border border-slate-500 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 mb-1"></div>
                <div className="text-white font-bold text-xs">7805</div>
              </div>
              
              <div className="absolute -left-4 top-1/2 w-4 h-1 bg-engineering-danger"></div>
              <div className="absolute -right-4 top-1/2 w-4 h-1 bg-engineering-success"></div>
              <div className="absolute left-1/2 -bottom-4 w-1 h-4 bg-slate-500"></div>
            </div>

            {/* Output Dial */}
            <div className="flex flex-col items-center p-4 bg-engineering-base rounded-lg border-2 border-engineering-success w-48 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="text-engineering-success font-bold uppercase text-xs mb-2">Regulated Output</div>
              <div className="text-4xl font-mono text-white font-bold">{vout.toFixed(1)}V</div>
              <div className="mt-4 text-xs text-slate-400">
                {vin < 5 ? "Undeliverable (Too Low)" : vin > 5 ? "Regulating (Burning Heat)" : "Perfect Match"}
              </div>
            </div>

          </div>

          <div className="w-full max-w-2xl bg-slate-900 p-4 rounded border border-slate-700 text-sm text-slate-400 font-mono">
            <strong>Math:</strong> Linear regulators drop voltage by turning the excess power into HEAT. <br/>
            Power Wasted = (V_in - V_out) × Current. <br/>
            At {vin}V in and 1 Amp of current, this regulator is burning <strong>{Math.max(0, vin - vout).toFixed(1)} Watts</strong> of pure heat!
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
