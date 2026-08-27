import React, { useState } from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';
import { genericContent } from '../data/genericContent';
import { motion } from 'framer-motion';

interface PlaceholderTopicProps {
  categoryTitle: string;
  topicTitle: string;
  topicId: string;
}

export const PlaceholderTopic: React.FC<PlaceholderTopicProps> = ({ categoryTitle, topicTitle, topicId }) => {
  const [practiceAnswered, setPracticeAnswered] = useState<number | null>(null);
  
  const content = genericContent[topicId];

  if (content) {
    return (
      <TopicLayout category={categoryTitle} title={topicTitle}>
        <Section title="Concept" icon={Icons.Concept}>
          <p>{content.concept}</p>
        </Section>
        
        <Section title="Explanation" icon={Icons.Visualize}>
          <p>{content.explanation}</p>
          <div className="mt-4 p-4 bg-engineering-light/20 border border-engineering-light border-dashed rounded text-sm text-slate-400 italic">
            Note: The custom interactive visualizer for this specific topic is currently in the development queue. 
          </div>
        </Section>

        <Section title="Practice" icon={Icons.Practice}>
          <div className="bg-engineering-dark p-6 rounded-lg border border-engineering-light">
            <p className="mb-4 font-medium text-lg">{content.practice.q}</p>
            <div className="space-y-3 text-sm">
              {content.practice.options.map((opt, idx) => (
                <button 
                  key={idx}
                  className={`w-full text-left p-4 rounded border transition-colors 
                    ${practiceAnswered === idx && idx === content.practice.answerIndex ? 'border-engineering-success bg-engineering-success/10' : 
                      practiceAnswered === idx ? 'border-engineering-danger bg-engineering-danger/10' : 
                      'border-engineering-light hover:bg-engineering-light/50'}`}
                  onClick={() => setPracticeAnswered(idx)}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              ))}
            </div>
            {practiceAnswered === content.practice.answerIndex && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-engineering-success/10 text-engineering-success border border-engineering-success/30 rounded">
                <strong>Correct!</strong> {content.practice.explanation}
              </motion.div>
            )}
          </div>
        </Section>
      </TopicLayout>
    );
  }

  // Fallback for completely empty ones (Categories 2-14)
  return (
    <TopicLayout category={categoryTitle} title={topicTitle}>
      <Section title="Concept Overview" icon={Icons.Concept}>
        <p className="text-slate-400 italic">
          This module is currently under development. Soon, it will feature comprehensive explanations, interactive visualizations, and practical engineering examples.
        </p>
        <div className="bg-engineering-base p-6 rounded mt-4 border border-engineering-light border-dashed">
          <h4 className="text-lg font-bold text-white mb-2">Planned Content Structure:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
            <li><strong>Concept:</strong> Clear, simple explanation.</li>
            <li><strong>Visual Explanation:</strong> Diagrams and animations where helpful.</li>
            <li><strong>Interactive Example:</strong> Tools to manipulate values and explore behavior.</li>
            <li><strong>Practical Application:</strong> Real-world examples (PCBs, Embedded Systems).</li>
            <li><strong>Practice:</strong> Knowledge checks to reinforce understanding.</li>
          </ul>
        </div>
      </Section>
    </TopicLayout>
  );
};
