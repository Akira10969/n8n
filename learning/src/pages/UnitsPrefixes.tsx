import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const UnitsPrefixes: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('0.005');
  const [unit, setUnit] = useState<'A' | 'V' | 'Ω' | 'W'>('A');

  const parsedValue = parseFloat(inputValue);
  const isValid = !isNaN(parsedValue);

  // Conversion logic
  const getFormatted = (val: number, baseUnit: string) => {
    if (val === 0) return `0 ${baseUnit}`;
    const absVal = Math.abs(val);
    
    if (absVal >= 1e6) return `${(val / 1e6).toFixed(2).replace(/\.00$/, '')} M${baseUnit}`; // Mega
    if (absVal >= 1e3) return `${(val / 1e3).toFixed(2).replace(/\.00$/, '')} k${baseUnit}`; // kilo
    if (absVal >= 1) return `${val.toFixed(2).replace(/\.00$/, '')} ${baseUnit}`; // Base
    if (absVal >= 1e-3) return `${(val * 1e3).toFixed(2).replace(/\.00$/, '')} m${baseUnit}`; // milli
    if (absVal >= 1e-6) return `${(val * 1e6).toFixed(2).replace(/\.00$/, '')} µ${baseUnit}`; // micro
    if (absVal >= 1e-9) return `${(val * 1e9).toFixed(2).replace(/\.00$/, '')} n${baseUnit}`; // nano
    return `${(val * 1e12).toFixed(2).replace(/\.00$/, '')} p${baseUnit}`; // pico
  };

  return (
    <TopicLayout category="Electrical Fundamentals" title="Units and Prefixes">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          In engineering, we constantly deal with extremely large numbers (like 1,000,000 Ohms) and extremely small numbers (like 0.000001 Amperes).
        </p>
        <p className="mt-2">
          To make these numbers manageable to read, write, and discuss, engineers use standard <strong>SI Prefixes</strong>. 
          Instead of writing all the zeros, we attach a letter to the front of the unit that represents a specific power of 10.
        </p>
      </Section>

      <Section title="Interactive Visualization: Engineering Notation Converter" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center shadow-inner">
          
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center w-full max-w-3xl bg-slate-900 p-8 rounded-xl border-2 border-slate-700">
            
            {/* Input Side */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 font-bold text-sm uppercase">Raw Scientific Value</label>
              <div className="flex bg-slate-800 rounded border border-slate-600 focus-within:border-engineering-accent overflow-hidden">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-transparent text-white p-4 font-mono text-xl w-full outline-none"
                  placeholder="e.g. 0.005"
                />
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="bg-slate-700 text-white p-4 font-bold outline-none border-l border-slate-600 cursor-pointer"
                >
                  <option value="A">Amperes (A)</option>
                  <option value="V">Volts (V)</option>
                  <option value="Ω">Ohms (Ω)</option>
                  <option value="W">Watts (W)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-8 h-8 text-engineering-accent hidden md:block" />
            </div>

            {/* Output Side */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 font-bold text-sm uppercase">Engineering Notation</label>
              <div className="bg-engineering-base p-4 rounded border-2 border-engineering-success flex items-center justify-center h-[66px]">
                {isValid ? (
                  <motion.div 
                    key={parsedValue + unit}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold font-mono text-engineering-success"
                  >
                    {getFormatted(parsedValue, unit)}
                  </motion.div>
                ) : (
                  <span className="text-engineering-danger font-bold text-sm">Invalid Number</span>
                )}
              </div>
            </div>

          </div>

          {/* Reference Table */}
          <div className="w-full mt-8">
            <h4 className="text-white font-bold mb-4">Common Engineering Prefixes</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 rounded-tl">Prefix</th>
                    <th className="px-4 py-3">Symbol</th>
                    <th className="px-4 py-3">Multiplier</th>
                    <th className="px-4 py-3 rounded-tr">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <td className="px-4 py-3 font-medium">Mega</td>
                    <td className="px-4 py-3 font-bold text-engineering-accent">M</td>
                    <td className="px-4 py-3 font-mono">x 1,000,000 (10⁶)</td>
                    <td className="px-4 py-3">1 MΩ = 1,000,000 Ω</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="px-4 py-3 font-medium">kilo</td>
                    <td className="px-4 py-3 font-bold text-engineering-accent">k</td>
                    <td className="px-4 py-3 font-mono">x 1,000 (10³)</td>
                    <td className="px-4 py-3">4.7 kΩ = 4,700 Ω</td>
                  </tr>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <td className="px-4 py-3 font-medium">milli</td>
                    <td className="px-4 py-3 font-bold text-engineering-accent">m</td>
                    <td className="px-4 py-3 font-mono">÷ 1,000 (10⁻³)</td>
                    <td className="px-4 py-3">20 mA = 0.020 A</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="px-4 py-3 font-medium">micro</td>
                    <td className="px-4 py-3 font-bold text-engineering-accent">µ</td>
                    <td className="px-4 py-3 font-mono">÷ 1,000,000 (10⁻⁶)</td>
                    <td className="px-4 py-3">10 µA = 0.000010 A</td>
                  </tr>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <td className="px-4 py-3 font-medium">nano</td>
                    <td className="px-4 py-3 font-bold text-engineering-accent">n</td>
                    <td className="px-4 py-3 font-mono">÷ 1,000,000,000 (10⁻⁹)</td>
                    <td className="px-4 py-3">100 nV = 0.0000001 V</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
