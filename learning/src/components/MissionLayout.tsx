import React from 'react';
import { ArrowLeft, BookOpen, Eye, FlaskConical, Target, Wrench, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MissionLayoutProps {
  number: string;
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export const MissionLayout: React.FC<MissionLayoutProps> = ({ number, title, onBack, children }) => {
  return (
    <div className="max-w-6xl mx-auto p-6 pb-24">
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-engineering-light rounded-full transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-sm font-mono text-engineering-accent tracking-wider">MISSION {number}</h2>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
      </div>
      
      <div className="flex flex-col gap-12">
        {children}
      </div>
    </div>
  );
};

export const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-engineering-base border border-engineering-light rounded-xl overflow-hidden shadow-lg"
    >
      <div className="bg-engineering-light/30 border-b border-engineering-light p-4 flex items-center gap-3">
        <div className="text-engineering-accent">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="p-6 text-slate-300 space-y-4">
        {children}
      </div>
    </motion.section>
  );
};

export const Icons = {
  Learn: <BookOpen className="w-5 h-5" />,
  Visualize: <Eye className="w-5 h-5" />,
  Experiment: <FlaskConical className="w-5 h-5" />,
  Challenge: <Target className="w-5 h-5" />,
  Hardware: <Wrench className="w-5 h-5" />,
  Check: <CheckCircle className="w-5 h-5" />
};
