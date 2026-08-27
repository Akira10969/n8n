import React, { useState } from 'react';
import { MissionLayout, Section, Icons } from '../components/MissionLayout';
import { motion } from 'framer-motion';
import { Cpu, Power, Zap, AlertTriangle } from 'lucide-react';

export const Mission17: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Breadboard grid state
  // Simplification: We'll have a few key nodes.
  // Power (+), Ground (-), LED Anode, LED Cathode, Resistor ends.
  
  const [connections, setConnections] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    { id: 'pwr_pos', label: '5V+', x: 10, y: 20 },
    { id: 'pwr_neg', label: 'GND-', x: 10, y: 80 },
    { id: 'bb_row_1', label: 'Row 1', x: 40, y: 40 },
    { id: 'bb_row_2', label: 'Row 2', x: 60, y: 40 },
    { id: 'bb_row_3', label: 'Row 3', x: 80, y: 40 },
    { id: 'bb_row_4', label: 'Row 4', x: 40, y: 60 },
    { id: 'bb_row_5', label: 'Row 5', x: 60, y: 60 },
    { id: 'bb_row_6', label: 'Row 6', x: 80, y: 60 },
  ];

  const handleNodeClick = (id: string) => {
    if (!activeNode) {
      setActiveNode(id);
    } else {
      if (activeNode !== id) {
        // Create connection
        const newConnection = [activeNode, id].sort().join('-');
        if (!connections.includes(newConnection)) {
          setConnections([...connections, newConnection]);
        }
      }
      setActiveNode(null);
    }
  };

  const isConnected = (id1: string, id2: string) => {
    return connections.includes([id1, id2].sort().join('-'));
  };

  // Check if circuit is complete
  // Path: pwr_pos -> bb_row_1 -> (Resistor) -> bb_row_2 -> (Wire) -> bb_row_5 -> (LED) -> bb_row_6 -> (Wire) -> pwr_neg
  // For simplicity, let's just check if pwr_pos is connected to something, and pwr_neg is connected.
  
  // Actually, let's make it a pre-placed components scenario, and they just need to add wires.
  const hasPowerToResistor = isConnected('pwr_pos', 'bb_row_1');
  const hasResistorToLED = isConnected('bb_row_2', 'bb_row_5'); // jumper
  const hasLEDToGround = isConnected('bb_row_6', 'pwr_neg');

  const isCircuitComplete = hasPowerToResistor && hasResistorToLED && hasLEDToGround;

  return (
    <MissionLayout number="17" title="Build Your First Circuit" onBack={onBack}>
      <Section title="Learn" icon={Icons.Learn}>
        <p>
          A <strong>breadboard</strong> is a tool used to prototype circuits without soldering. The holes in a breadboard are connected underneath by metal clips in specific patterns.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li><strong>Power Rails:</strong> The long strips on the sides, used for +V and GND.</li>
          <li><strong>Terminal Strips:</strong> The short rows in the middle. Components on the same row are electrically connected.</li>
        </ul>
      </Section>

      <Section title="Experiment: Wire the Circuit" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light">
          <p className="mb-6">
            Objective: Connect the 5V power to the resistor, connect the resistor to the LED anode, and connect the LED cathode to ground. Click two points to connect a wire.
          </p>

          <div className="relative w-full h-80 bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden mb-6">
            {/* Draw connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn) => {
                const [id1, id2] = conn.split('-');
                const n1 = nodes.find(n => n.id === id1);
                const n2 = nodes.find(n => n.id === id2);
                if (n1 && n2) {
                  return (
                    <line 
                      key={conn}
                      x1={`${n1.x}%`} y1={`${n1.y}%`}
                      x2={`${n2.x}%`} y2={`${n2.y}%`}
                      stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"
                    />
                  );
                }
                return null;
              })}

              {/* Pre-placed components */}
              {/* Resistor between row 1 and 2 */}
              <path d="M 40% 40% L 45% 35% L 50% 45% L 55% 35% L 60% 40%" stroke="#f59e0b" strokeWidth="4" fill="none" />
              {/* LED between row 5 and 6 */}
              <circle cx="70%" cy="60%" r="10" fill={isCircuitComplete ? "#ef4444" : "#450a0a"} stroke="#7f1d1d" strokeWidth="2" />
              <line x1="60%" y1="60%" x2="65%" y2="60%" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="75%" y1="60%" x2="80%" y2="60%" stroke="#cbd5e1" strokeWidth="4" />
            </svg>

            {/* Clickable Nodes */}
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all z-10 
                  ${activeNode === node.id ? 'bg-engineering-accent border-white scale-125' : 'bg-slate-800 border-slate-500 hover:border-engineering-accent'}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                title={node.label}
              />
            ))}

            {/* Labels */}
            <div className="absolute top-[10%] left-[10%] text-xs font-bold text-engineering-danger transform -translate-x-1/2">5V</div>
            <div className="absolute top-[90%] left-[10%] text-xs font-bold text-engineering-success transform -translate-x-1/2">GND</div>
            <div className="absolute top-[30%] left-[50%] text-xs font-bold text-slate-400 transform -translate-x-1/2">1kΩ Resistor</div>
            <div className="absolute top-[70%] left-[70%] text-xs font-bold text-slate-400 transform -translate-x-1/2">LED</div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setConnections([])}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white"
            >
              Reset Wires
            </button>
          </div>

          {/* Checklist */}
          <div className="mt-8 space-y-2">
            <div className={`flex items-center gap-2 ${hasPowerToResistor ? 'text-engineering-success' : 'text-slate-500'}`}>
              <Icons.Check /> Power connected to resistor
            </div>
            <div className={`flex items-center gap-2 ${hasResistorToLED ? 'text-engineering-success' : 'text-slate-500'}`}>
              <Icons.Check /> Resistor connected to LED Anode
            </div>
            <div className={`flex items-center gap-2 ${hasLEDToGround ? 'text-engineering-success' : 'text-slate-500'}`}>
              <Icons.Check /> LED Cathode connected to Ground
            </div>
          </div>

          {isCircuitComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-4 bg-engineering-success/20 border border-engineering-success rounded-lg text-engineering-success font-bold text-center text-xl">
              Circuit Complete! The LED is ON.
            </motion.div>
          )}
        </div>
      </Section>
    </MissionLayout>
  );
};
