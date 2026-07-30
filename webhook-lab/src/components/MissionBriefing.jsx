import React, { useState, useEffect } from 'react';
import { AlertOctagon, Target, Award, Play } from 'lucide-react';
import { badges } from '../data/achievements';

function Typewriter({ text, delay = 15 }) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}{currentIndex < text.length ? <span className="cursor-blink">_</span> : null}</span>;
}

export default function MissionBriefing({ mission, missionIndex, onStartMission }) {
  const briefing = mission.briefing;

  // Fallback for missions that don't have a briefing defined yet
  if (!briefing) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{mission.title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Proceed to the learning module.</p>
        <button className="btn btn-primary" onClick={onStartMission}>
          <Play size={20} fill="currentColor" /> Start Mission
        </button>
      </div>
    );
  }

  // Find the badge if there is one
  const rewardBadge = briefing.rewards?.badge && briefing.rewards.badge !== 'None'
    ? badges.find(b => b.id === briefing.rewards.badge)
    : null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div style={{ fontSize: '1rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Mission {missionIndex + 1} Briefing
        </div>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', margin: '0' }}>{mission.title}</h1>
      </div>

      {/* INCIDENT REPORT */}
      <div style={{ 
        background: 'rgba(239, 68, 68, 0.05)', 
        border: '1px solid rgba(239, 68, 68, 0.2)', 
        borderLeft: '4px solid var(--accent-red)',
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-red)', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>
          <AlertOctagon size={24} /> Incident Report
        </h3>
        <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.6, margin: 0, fontFamily: 'monospace' }}>
          <Typewriter text={briefing.incident} />
        </p>
      </div>

      {/* TASK */}
      <div style={{ 
        background: 'rgba(6, 182, 212, 0.05)', 
        border: '1px solid rgba(6, 182, 212, 0.2)', 
        borderLeft: '4px solid var(--accent-cyan)',
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>
          <Target size={24} /> Your Task
        </h3>
        <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: 1.6, margin: 0, fontFamily: 'monospace' }}>
          <Typewriter text={briefing.task} delay={10} />
        </p>
      </div>

      {/* REWARDS */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-purple)', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>
          <Award size={24} /> Potential Rewards
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--accent-purple)', padding: '0.75rem 1.5rem', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>
            ⭐ {briefing.rewards?.xp || 50} XP
          </div>
          
          {rewardBadge && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', padding: '0.75rem 1.5rem', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {rewardBadge.icon} {rewardBadge.name} Badge
            </div>
          )}
        </div>
      </div>

      {/* START BUTTON */}
      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={onStartMission}
          style={{ padding: '1rem 3rem', fontSize: '1.25rem', width: '100%', maxWidth: '400px', display: 'inline-flex', justifyContent: 'center' }}
        >
          <Play size={24} fill="currentColor" /> Initialize Mission
        </button>
      </div>

    </div>
  );
}
