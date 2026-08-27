import React from 'react';
import { BookOpen, Eye, FlaskConical, Target, Wrench, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopicLayoutProps {
  category: string;
  title: string;
  children: React.ReactNode;
}

export const TopicLayout: React.FC<TopicLayoutProps> = ({ category, title, children }) => {
  return (
    <div className="max-w-5xl mx-auto p-8 pb-24">
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-engineering-accent tracking-wider uppercase mb-1">{category}</h2>
        <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-engineering-base border border-engineering-light rounded-xl overflow-hidden shadow-sm"
    >
      <div className="bg-engineering-light/20 border-b border-engineering-light p-4 flex items-center gap-3">
        <div className="text-engineering-accent">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="p-6 text-slate-300 space-y-4 leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
};

export const Icons = {
  Concept: <BookOpen className="w-5 h-5" />,
  Visualize: <Eye className="w-5 h-5" />,
  Experiment: <FlaskConical className="w-5 h-5" />,
  Practice: <Target className="w-5 h-5" />,
  Application: <Wrench className="w-5 h-5" />,
  Check: <CheckCircle className="w-5 h-5" />
};
