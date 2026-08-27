import React from 'react';
import type { ViewState } from '../App';
import { Lock, Unlock, Zap, Activity, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface MissionProps {
  id: string;
  number: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  icon: React.ReactNode;
  onSelect: () => void;
  x: number;
  y: number;
}

const MissionNode: React.FC<MissionProps> = ({ number, title, description, status, icon, onSelect, x, y }) => {
  const isLocked = status === 'locked';
  
  return (
    <motion.div 
      className={`absolute w-64 transform -translate-x-1/2 -translate-y-1/2 ${isLocked ? 'opacity-50 grayscale' : 'cursor-pointer hover:z-10'}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      onClick={() => !isLocked && onSelect()}
    >
      <div className={`bg-engineering-base border-2 rounded-lg p-4 shadow-xl transition-all ${isLocked ? 'border-engineering-light' : status === 'completed' ? 'border-engineering-success' : 'border-engineering-accent shadow-engineering-accent/20'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 rounded-md ${isLocked ? 'bg-engineering-light' : 'bg-engineering-accent/20 text-engineering-accent'}`}>
            {icon}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-mono text-slate-400">MISSION {number}</span>
            {isLocked ? <Lock className="w-4 h-4 text-slate-500 mt-1" /> : <Unlock className="w-4 h-4 text-engineering-success mt-1" />}
          </div>
        </div>
        <h3 className="font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{description}</p>
        
        {!isLocked && (
          <div className="mt-4 flex justify-between items-center text-xs font-mono">
            <span className="text-engineering-accent">500 XP</span>
            <span className={status === 'completed' ? 'text-engineering-success' : 'text-slate-400'}>
              {status === 'completed' ? 'COMPLETED' : 'READY'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const CampaignMap: React.FC<{ onSelectMission: (view: ViewState) => void }> = ({ onSelectMission }) => {
  return (
    <div className="relative w-full h-[800px] circuit-grid overflow-hidden">
      {/* Decorative path lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <path d="M 20% 20% L 35% 40% L 65% 30% L 80% 60%" stroke="#334155" strokeWidth="4" fill="none" strokeDasharray="8 8" />
      </svg>
      
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Campaign</h2>
        <p className="text-slate-400 max-w-md">Master Computer Engineering fundamentals through interactive missions. Understand why it works, don't just memorize.</p>
      </div>

      <div className="relative w-full h-full" style={{ zIndex: 1 }}>
        <MissionNode 
          id="m01"
          number="01"
          title="What is Electricity?"
          description="Understand charge, electrons, conductors, and the basis of current."
          status="completed"
          icon={<Zap className="w-6 h-6" />}
          onSelect={() => onSelectMission('mission_01')}
          x={20}
          y={20}
        />
        
        <MissionNode 
          id="m05"
          number="05"
          title="Ohm's Law"
          description="The fundamental relationship between Voltage, Current, and Resistance."
          status="unlocked"
          icon={<Activity className="w-6 h-6" />}
          onSelect={() => onSelectMission('mission_05')}
          x={35}
          y={40}
        />

        <MissionNode 
          id="m17"
          number="17"
          title="Build Your First Circuit"
          description="Use a virtual breadboard to wire up an LED, resistor, and power source."
          status="unlocked"
          icon={<Cpu className="w-6 h-6" />}
          onSelect={() => onSelectMission('mission_17')}
          x={65}
          y={30}
        />

        <MissionNode 
          id="m24"
          number="24"
          title="Transistor as a Switch"
          description="Learn how a small current can control a much larger one using an NPN BJT."
          status="locked"
          icon={<Zap className="w-6 h-6" />}
          onSelect={() => {}}
          x={80}
          y={60}
        />
      </div>
    </div>
  );
};
