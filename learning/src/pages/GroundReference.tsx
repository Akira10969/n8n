import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const GroundReference: React.FC = () => {
  const [groundNode, setGroundNode] = useState<0 | 1 | 2>(0);

  // A circuit with a 12V battery and two identical resistors.
  // Node 0: bottom of battery
  // Node 1: middle of resistors
  // Node 2: top of battery
  
  // If Ground is at Node 0:
  // Node 0 = 0V, Node 1 = 6V, Node 2 = 12V
  
  // If Ground is at Node 1:
  // Node 0 = -6V, Node 1 = 0V, Node 2 = 6V
  
  // If Ground is at Node 2:
  // Node 0 = -12V, Node 1 = -6V, Node 2 = 0V

  const getVoltage = (node: number) => {
    const rawVoltages = [0, 6, 12];
    return rawVoltages[node] - rawVoltages[groundNode];
  };

  return (
    <TopicLayout category="Electrical Fundamentals" title="Ground and Reference">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          In electrical engineering, <strong>Voltage</strong> is always a measurement of the difference in potential between <em>two</em> points. 
          There is no such thing as an absolute voltage at a single point.
        </p>
        <p className="mt-2">
          To make discussing circuits easier, engineers pick one specific point in the circuit and arbitrarily define it as <strong>Ground (0 Volts)</strong>. 
          Every other voltage in the circuit is then measured relative to that Ground reference. 
        </p>
      </Section>

      <Section title="Interactive Visualization: Moving the Ground" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light flex flex-col items-center">
          
          <div className="text-slate-300 mb-6 text-center max-w-lg text-sm">
            Below is a circuit with a 12V battery and two identical resistors. The battery always provides a 12V difference, 
            and the resistors split it evenly (6V each). <strong>Click on a node to set it as the Ground Reference (0V)</strong> and see how the other node readings change!
          </div>

          <div className="relative w-full max-w-md h-80 bg-slate-900 border-2 border-slate-700 rounded-lg flex items-center justify-center mb-6">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Circuit Path */}
              <path d="M 100 250 L 100 50 L 300 50 L 300 250 Z" fill="none" stroke="#64748b" strokeWidth="4" />
              
              {/* Battery on left */}
              <rect x="80" y="120" width="40" height="60" fill="#3b82f6" />
              <text x="100" y="155" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">12V</text>
              <text x="100" y="110" fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>
              <text x="100" y="200" fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">-</text>

              {/* Resistor 1 (Top Right) */}
              <rect x="290" y="80" width="20" height="40" fill="#f59e0b" />
              {/* Resistor 2 (Bottom Right) */}
              <rect x="290" y="180" width="20" height="40" fill="#f59e0b" />

              {/* Node 2 (Top) */}
              <circle cx="200" cy="50" r="15" fill={groundNode === 2 ? "#22c55e" : "#1e293b"} stroke="#cbd5e1" strokeWidth="2"
                onClick={() => setGroundNode(2)} className="cursor-pointer hover:stroke-white transition-all" />
              <text x="200" y="55" fill="white" fontSize="14" textAnchor="middle" pointerEvents="none">A</text>
              
              <text x="200" y="30" fill={groundNode === 2 ? "#22c55e" : "#cbd5e1"} fontSize="16" fontWeight="bold" textAnchor="middle">
                {getVoltage(2)}V
              </text>

              {/* Node 1 (Middle Right) */}
              <circle cx="300" cy="150" r="15" fill={groundNode === 1 ? "#22c55e" : "#1e293b"} stroke="#cbd5e1" strokeWidth="2"
                onClick={() => setGroundNode(1)} className="cursor-pointer hover:stroke-white transition-all" />
              <text x="300" y="155" fill="white" fontSize="14" textAnchor="middle" pointerEvents="none">B</text>
              
              <text x="340" y="155" fill={groundNode === 1 ? "#22c55e" : "#cbd5e1"} fontSize="16" fontWeight="bold" textAnchor="start">
                {getVoltage(1)}V
              </text>

              {/* Node 0 (Bottom) */}
              <circle cx="200" cy="250" r="15" fill={groundNode === 0 ? "#22c55e" : "#1e293b"} stroke="#cbd5e1" strokeWidth="2"
                onClick={() => setGroundNode(0)} className="cursor-pointer hover:stroke-white transition-all" />
              <text x="200" y="255" fill="white" fontSize="14" textAnchor="middle" pointerEvents="none">C</text>
              
              <text x="200" y="285" fill={groundNode === 0 ? "#22c55e" : "#cbd5e1"} fontSize="16" fontWeight="bold" textAnchor="middle">
                {getVoltage(0)}V
              </text>

              {/* Ground Symbol (animated movement) */}
              <motion.g
                initial={false}
                animate={{
                  x: groundNode === 2 ? 200 : groundNode === 1 ? 300 : 200,
                  y: groundNode === 2 ? 70 : groundNode === 1 ? 170 : 270
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <path d="M -15 0 L 15 0 M -10 5 L 10 5 M -5 10 L 5 10" stroke="#22c55e" strokeWidth="2" fill="none" />
                <line x1="0" y1="-20" x2="0" y2="0" stroke="#22c55e" strokeWidth="2" />
              </motion.g>

            </svg>
          </div>

          <div className="w-full bg-engineering-base p-4 border border-engineering-light rounded">
            <h4 className="font-bold text-white mb-2">Observations:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
              <li>No matter where you place the Ground, the difference between Node A and Node C is <strong>always 12V</strong> (the battery voltage).</li>
              <li>Placing Ground at Node B creates a <strong>split supply</strong> (+6V and -6V). This is very common in Operational Amplifier (Op-Amp) circuits!</li>
              <li>A negative voltage simply means that point has a lower electrical potential than the node you chose to call 0V.</li>
            </ul>
          </div>

        </div>
      </Section>
    </TopicLayout>
  );
};
