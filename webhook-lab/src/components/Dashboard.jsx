import React from 'react';
import { badges, toolbox } from '../data/achievements';
import { Trophy, Star, Heart, Activity, CheckCircle2, Lock } from 'lucide-react';

export default function Dashboard({ xp, hearts, rank, absoluteHighestIndex, totalMissions }) {
  
  const completionPercentage = Math.round((absoluteHighestIndex / totalMissions) * 100);

  return (
    <div className="dashboard-container animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Player Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Track your engineering career progression and unlocked tools.</p>
      </div>

      {/* OVERVIEW STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <Trophy size={36} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Rank</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{rank}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <Star size={36} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total XP</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{xp}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <Heart size={36} color="var(--accent-red)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{hearts} / 3</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '12px' }}>
          <Activity size={36} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completion</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{completionPercentage}%</div>
        </div>
      </div>

      {/* ACHIEVEMENT BADGES */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy size={24} color="var(--accent-cyan)" /> Achievement Badges
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {badges.map(badge => {
            const isUnlocked = absoluteHighestIndex > badge.unlockIndex;
            return (
              <div key={badge.id} className="glass-panel" style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                opacity: isUnlocked ? 1 : 0.4,
                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '2.5rem', minWidth: '50px', textAlign: 'center' }}>
                  {isUnlocked ? badge.icon : <Lock size={32} color="var(--text-muted)" />}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: isUnlocked ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>{badge.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {isUnlocked ? badge.description : `Unlocks after Mission ${badge.unlockIndex + 1}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ENGINEERING TOOLBOX */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={24} color="var(--accent-green)" /> Engineering Toolbox
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {toolbox.map(tool => {
            const isUnlocked = absoluteHighestIndex > tool.unlockIndex;
            return (
              <div key={tool.id} className="glass-panel" style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem',
                opacity: isUnlocked ? 1 : 0.4,
                border: isUnlocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--glass-border)',
                background: isUnlocked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ fontSize: '2rem', minWidth: '40px', textAlign: 'center', marginTop: '-4px' }}>
                  {isUnlocked ? tool.icon : <Lock size={24} color="var(--text-muted)" />}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>{tool.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {isUnlocked ? tool.description : `Keep learning to unlock this tool.`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
