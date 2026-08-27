import React from 'react';
import { TopicLayout, Section, Icons } from '../components/TopicLayout';

interface PlaceholderTopicProps {
  categoryTitle: string;
  topicTitle: string;
}

export const PlaceholderTopic: React.FC<PlaceholderTopicProps> = ({ categoryTitle, topicTitle }) => {
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
