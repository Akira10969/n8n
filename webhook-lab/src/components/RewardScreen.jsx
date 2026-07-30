import React, { useEffect } from 'react';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { badges } from '../data/achievements';

export default function RewardScreen({ xpGained, newRank, newAbsoluteIndex, unlockedBadgeId, onContinue }) {
  
  useEffect(() => {
    // Trigger celebration immediately
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#06b6d4', '#8b5cf6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#06b6d4', '#8b5cf6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const badge = unlockedBadgeId ? badges.find(b => b.id === unlockedBadgeId) : null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Trophy size={64} color="var(--accent-purple)" style={{ margin: '0 auto', display: 'block' }} />
      </div>

      <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Mission Accomplished!
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Great work, Engineer. Here are your rewards:
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
        
        {/* XP REWARD */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', minWidth: '200px', border: '1px solid var(--glass-border)' }}>
          <Star size={48} color="var(--accent-cyan)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Experience</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>+{xpGained} XP</div>
        </div>

        {/* BADGE REWARD (If applicable) */}
        {badge && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '12px', minWidth: '200px', border: '1px solid var(--accent-green)' }}>
            <div style={{ fontSize: '3rem', margin: '0 auto 1rem auto', display: 'block' }}>{badge.icon}</div>
            <div style={{ fontSize: '1rem', color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Badge Unlocked</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{badge.name}</div>
          </div>
        )}
      </div>

      <button 
        className="btn btn-primary" 
        onClick={onContinue}
        style={{ padding: '1rem 3rem', fontSize: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        Return to Mission Control <ArrowRight size={20} />
      </button>

    </div>
  );
}
