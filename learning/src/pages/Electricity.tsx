import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { Battery, PowerOff, Power } from 'lucide-react';

export const Electricity: React.FC = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [practiceAnswered, setpracticeAnswered] = useState<boolean | null>(null);

  const electrons = Array.from({ length: 10 }).map((_, i) => i);

  return (
    <TopicLayout category="Electrical Fundamentals" title="What Is Electricity?">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Electricity is the flow of electrical power or charge. At an atomic level, electricity is the movement of <strong>electrons</strong> through a <strong>conductor</strong> (such as a copper wire). 
        </p>
        <p>
          An <strong>insulator</strong> prevents this flow. For current to continuously flow, there must be a complete, unbroken path called a <strong>closed circuit</strong>.
        </p>
      </Section>

      <Section title="Visual Explanation & Interactive Example" icon={Icons.Experiment}>
        <div className="bg-engineering-dark rounded-xl p-8 flex flex-col items-center border border-engineering-light">
          <div className="relative w-full max-w-md h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border-2 border-slate-700">
            {/* The Circuit SVG */}
            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* Battery */}
              <rect x="40" y="70" width="40" height="60" rx="4" fill="#3b82f6" />
              <rect x="50" y="60" width="20" height="10" fill="#cbd5e1" />
              <text x="50" y="105" fill="white" fontSize="14" fontWeight="bold">BAT</text>
              
              {/* Wires */}
              <path d="M 60 70 L 60 40 L 340 40 L 340 80" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 340 120 L 340 160 L 60 160 L 60 130" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Switch */}
              <circle cx="340" cy="80" r="4" fill="#cbd5e1" />
              <circle cx="340" cy="120" r="4" fill="#cbd5e1" />
              <motion.line 
                x1="340" y1="80" 
                x2="340" y2={isClosed ? 120 : 100}
                stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round"
                initial={false}
                animate={{ x2: isClosed ? 340 : 360, y2: isClosed ? 120 : 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />

              {/* Electrons */}
              {electrons.map((e) => (
                <motion.circle
                  key={e}
                  r="3"
                  fill="#fbbf24"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isClosed ? 1 : 0,
                    offsetDistance: isClosed ? ['0%', '100%'] : '0%'
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: e * 0.3
                  }}
                  style={{
                    offsetPath: "path('M 60 70 L 60 40 L 340 40 L 340 160 L 60 160 L 60 130')"
                  }}
                />
              ))}
            </svg>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <button
              onClick={() => setIsClosed(!isClosed)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isClosed ? 'bg-engineering-success text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {isClosed ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
              {isClosed ? 'Circuit Closed' : 'Circuit Open'}
            </button>
          </div>
          <p className="mt-4 text-slate-400 text-center max-w-sm">
            Toggle the switch to see how closing the circuit allows electrons to flow continuously.
          </p>
        </div>
      </Section>

      <Section title="Explanation" icon={Icons.Concept}>
        <p>
          When the switch is <strong>open</strong>, there is a physical gap in the conductive wire (filled with air, which is an insulator). Electrons cannot cross this gap, so the flow of electricity halts completely throughout the entire circuit.
        </p>
        <p>
          When the switch is <strong>closed</strong>, a piece of conductive metal bridges the gap, creating an unbroken path. The electrons are pushed by the voltage source (the battery) and flow continuously through the circuit.
        </p>
      </Section>

      <Section title="Practice" icon={Icons.Practice}>
        <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light">
          <p className="mb-4 font-medium text-lg">Why doesn't electricity flow when the circuit is open?</p>
          <div className="space-y-3 text-sm">
            <button 
              className={`w-full text-left p-4 rounded border transition-colors ${practiceAnswered === false ? 'border-engineering-danger bg-engineering-danger/10' : 'border-engineering-light hover:bg-engineering-light/50'}`}
              onClick={() => setpracticeAnswered(false)}
            >
              A. Electrons run out of energy before reaching the switch.
            </button>
            <button 
              className={`w-full text-left p-4 rounded border transition-colors ${practiceAnswered === true ? 'border-engineering-success bg-engineering-success/10' : 'border-engineering-light hover:bg-engineering-light/50'}`}
              onClick={() => setpracticeAnswered(true)}
            >
              B. The gap in the switch breaks the continuous conductive path required for electron flow.
            </button>
            <button 
              className={`w-full text-left p-4 rounded border transition-colors ${practiceAnswered === false ? 'border-engineering-danger bg-engineering-danger/10' : 'border-engineering-light hover:bg-engineering-light/50'}`}
              onClick={() => setpracticeAnswered(false)}
            >
              C. The battery voltage drops to zero when the switch is opened.
            </button>
          </div>
          {practiceAnswered === true && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-engineering-success/10 text-engineering-success border border-engineering-success/30 rounded">
              <strong>Correct!</strong> For current to flow, there must be an unbroken path of conductive material. The air gap in an open switch stops the electrons because air is an insulator.
            </motion.div>
          )}
        </div>
      </Section>

      <Section title="Practical Application" icon={Icons.Application}>
        <div className="flex items-start gap-6">
          <div className="p-4 bg-engineering-light/20 rounded-lg text-slate-400">
            <Battery className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Wiring and Switches</h4>
            <p className="text-sm">
              In real hardware, the copper inside wires acts as the conductor allowing electrons to flow. The plastic coating on the outside of the wire is an insulator, keeping the electricity safely confined. Mechanical switches, buttons, and even transistors function by physically or electronically closing and opening this conductive path.
            </p>
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
};
