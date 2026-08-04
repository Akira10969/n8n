import React from 'react';
import { Info, X, Map, Target, FlaskConical, Heart, Star, Trophy, MousePointerClick, Keyboard } from 'lucide-react';
import './HowToPlayModal.css';

const guideSections = [
  {
    icon: Target,
    title: 'Objective',
    items: [
      'Restore the Business Cloud OS by completing missions in order.',
      'Each mission teaches a webhook, automation, troubleshooting, or platform concept.',
      'Finish the final missions to fully restore the system.'
    ]
  },
  {
    icon: Map,
    title: 'Mission Flow',
    items: [
      'Use the map to choose any unlocked mission.',
      'Open the episode card, read the briefing, then start the mission content.',
      'Complete the activity at the end of the mission to unlock progress.'
    ]
  },
  {
    icon: FlaskConical,
    title: 'Activities',
    items: [
      'Some missions include quizzes. Pick the best answer and submit it.',
      'Some missions include terminal simulations or hands-on labs. Follow the prompt and test your response.',
      'Successful activities award XP and move you toward the next rank.'
    ]
  },
  {
    icon: Heart,
    title: 'Hearts',
    items: [
      'Hearts are your retry buffer during mission checks.',
      'A failed quiz or simulation costs one heart.',
      'If hearts run out, progress resets to Mission 1 and hearts are restored.'
    ]
  }
];

export default function HowToPlayModal({ onClose }) {
  return (
    <div className="howto-overlay" role="dialog" aria-modal="true" aria-labelledby="howto-title">
      <div className="howto-panel">
        <div className="howto-header">
          <Info size={20} />
          <h2 id="howto-title">HOW TO PLAY</h2>
          <button className="howto-close" onClick={onClose} aria-label="Close How to Play">
            <X size={20} />
          </button>
        </div>

        <div className="howto-body">
          <div className="howto-summary">
            <div>
              <span className="howto-kicker">Mission Control Guide</span>
              <p>
                Learn the concept, complete the challenge, keep your hearts alive, and unlock the next mission on the map.
              </p>
            </div>
          </div>

          <div className="howto-grid">
            {guideSections.map(({ icon: Icon, title, items }) => (
              <section className="howto-card" key={title}>
                <div className="howto-card-title">
                  <Icon size={18} />
                  <h3>{title}</h3>
                </div>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="howto-controls">
            <div className="howto-control-item">
              <MousePointerClick size={18} />
              <span>Click map nodes, answers, buttons, and lab controls to interact.</span>
            </div>
            <div className="howto-control-item">
              <Keyboard size={18} />
              <span>Use keyboard focus and Enter or Space to activate buttons.</span>
            </div>
            <div className="howto-control-item">
              <Star size={18} />
              <span>XP increases your rank.</span>
            </div>
            <div className="howto-control-item">
              <Trophy size={18} />
              <span>Profile shows your rank, achievements, and completed missions.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
