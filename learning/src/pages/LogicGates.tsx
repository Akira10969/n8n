import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { motion } from 'framer-motion';

export const LogicGates: React.FC = () => {
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);

  const andResult = inputA & inputB;
  const orResult = inputA | inputB;
  const xorResult = inputA ^ inputB;

  return (
    <TopicLayout category="Digital Electronics" title="Logic Gates: AND, OR, XOR">
      <Section title="Concept" icon={Icons.Concept}>
        <p>
          Logic gates are the fundamental building blocks of digital circuits. They take one or more binary inputs (0 or 1, representing Low or High voltage) and produce a single binary output based on a logical rule.
        </p>
      </Section>

      <Section title="Interactive Visualization" icon={Icons.Experiment}>
        <div className="bg-engineering-dark p-8 rounded-lg border border-engineering-light flex flex-col md:flex-row gap-8 items-center justify-center">
          
          <div className="flex flex-col gap-8 w-48">
            <div className="flex items-center justify-between bg-engineering-base p-4 rounded border border-engineering-light">
              <span className="font-mono text-slate-300">Input A</span>
              <button 
                onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                className={`w-12 h-12 rounded font-bold text-xl ${inputA ? 'bg-engineering-success text-white' : 'bg-slate-700 text-slate-400'}`}
              >
                {inputA}
              </button>
            </div>
            <div className="flex items-center justify-between bg-engineering-base p-4 rounded border border-engineering-light">
              <span className="font-mono text-slate-300">Input B</span>
              <button 
                onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                className={`w-12 h-12 rounded font-bold text-xl ${inputB ? 'bg-engineering-success text-white' : 'bg-slate-700 text-slate-400'}`}
              >
                {inputB}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-md">
            {/* AND Gate */}
            <div className="flex items-center gap-4 bg-engineering-base p-4 rounded border border-engineering-light">
              <div className="flex-1 text-center font-bold text-slate-300">AND</div>
              <svg width="60" height="40" viewBox="0 0 60 40">
                <path d="M 10 5 L 30 5 A 15 15 0 0 1 30 35 L 10 35 Z" fill="none" stroke="#3b82f6" strokeWidth="3" />
                <line x1="0" y1="12" x2="10" y2="12" stroke={inputA ? "#22c55e" : "#64748b"} strokeWidth="3" />
                <line x1="0" y1="28" x2="10" y2="28" stroke={inputB ? "#22c55e" : "#64748b"} strokeWidth="3" />
                <line x1="45" y1="20" x2="60" y2="20" stroke={andResult ? "#22c55e" : "#64748b"} strokeWidth="3" />
              </svg>
              <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-xl ${andResult ? 'bg-engineering-success text-white' : 'bg-slate-700 text-slate-400'}`}>
                {andResult}
              </div>
            </div>

            {/* OR Gate */}
            <div className="flex items-center gap-4 bg-engineering-base p-4 rounded border border-engineering-light">
              <div className="flex-1 text-center font-bold text-slate-300">OR</div>
              <svg width="60" height="40" viewBox="0 0 60 40">
                <path d="M 10 5 Q 20 20 10 35 Q 40 35 45 20 Q 40 5 10 5 Z" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <line x1="0" y1="12" x2="14" y2="12" stroke={inputA ? "#22c55e" : "#64748b"} strokeWidth="3" />
                <line x1="0" y1="28" x2="14" y2="28" stroke={inputB ? "#22c55e" : "#64748b"} strokeWidth="3" />
                <line x1="45" y1="20" x2="60" y2="20" stroke={orResult ? "#22c55e" : "#64748b"} strokeWidth="3" />
              </svg>
              <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-xl ${orResult ? 'bg-engineering-success text-white' : 'bg-slate-700 text-slate-400'}`}>
                {orResult}
              </div>
            </div>

            {/* XOR Gate */}
            <div className="flex items-center gap-4 bg-engineering-base p-4 rounded border border-engineering-light">
              <div className="flex-1 text-center font-bold text-slate-300">XOR</div>
              <svg width="60" height="40" viewBox="0 0 60 40">
                <path d="M 15 5 Q 25 20 15 35 Q 45 35 50 20 Q 45 5 15 5 Z" fill="none" stroke="#ef4444" strokeWidth="3" />
                <path d="M 10 5 Q 20 20 10 35" fill="none" stroke="#ef4444" strokeWidth="3" />
                <line x1="0" y1="12" x2="12" y2="12" stroke={inputA ? "#22c55e" : "#64748b"} strokeWidth="3" />
                <line x1="0" y1="28" x2="12" y2="28" stroke={inputB ? "#22c55e" : "#64748b"} strokeWidth="3" />
                <line x1="50" y1="20" x2="60" y2="20" stroke={xorResult ? "#22c55e" : "#64748b"} strokeWidth="3" />
              </svg>
              <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-xl ${xorResult ? 'bg-engineering-success text-white' : 'bg-slate-700 text-slate-400'}`}>
                {xorResult}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </TopicLayout>
  );
}
