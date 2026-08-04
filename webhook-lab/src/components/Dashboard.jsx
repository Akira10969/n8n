import React from 'react';
import { badges, toolbox } from '../data/achievements';
import { Trophy, Star, Heart, Activity, CheckCircle2, Lock } from 'lucide-react';

export default function Dashboard({ xp, hearts, rank, absoluteHighestIndex, totalMissions, hasCompletedGame, onOpenAdmin }) {
  
  const completionPercentage = Math.round((absoluteHighestIndex / totalMissions) * 100);

  return (
    <div className="dashboard-container animate-fade-in" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'monospace' }}>
      
      <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            &gt; Business Cloud OS v2.4.1 // Secure Connection Established
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--text-main)', letterSpacing: '0.05em' }}>
            EMPLOYEE PERSONNEL FILE
          </h1>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            ID: {localStorage.getItem('webhook_engineer_id') || 'MEI-ENG-PENDING'}<br/>
            STATUS: ACTIVE
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={onOpenAdmin}
              style={{ 
                background: 'transparent', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', 
                padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'monospace', textTransform: 'uppercase' 
              }}
              onMouseOver={(e) => { e.target.style.background = 'rgba(6, 182, 212, 0.2)'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
            >
              [ SYSTEM ADMIN ]
            </button>
            <button 
              onClick={() => {
                if (window.confirm("CRITICAL WARNING: This will format your employee database and wipe all mission progress. Proceed?")) {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }
              }}
              style={{ 
                background: 'transparent', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', 
                padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'monospace', textTransform: 'uppercase' 
              }}
              onMouseOver={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.2)'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
            >
              [ FORMAT DATABASE ]
            </button>
          </div>
        </div>
      </div>

      {/* FINAL CERTIFICATION BANNER */}
      {hasCompletedGame && (
        <div style={{ marginBottom: '3rem', background: 'rgba(139, 92, 246, 0.1)', border: '2px solid var(--accent-purple)', padding: '2rem', textAlign: 'center', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}>
          <Trophy size={48} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-cyan)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 10px var(--accent-cyan)' }}>
            MEI Certified Platform Engineer
          </h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', margin: '0' }}>
            Awarded for the successful restoration of Business Cloud OS. All core infrastructure systems are optimal.
          </p>
          <button 
            className="btn"
            style={{ marginTop: '1.5rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--accent-purple)', color: 'var(--accent-purple)', padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}
            onClick={() => {
              localStorage.removeItem('webhook_has_seen_post_credits');
              window.location.reload();
            }}
          >
            [ REPLAY EPILOGUE ]
          </button>
        </div>
      )}

      {/* OVERVIEW STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--accent-purple)', padding: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '10px', background: 'var(--bg-main)', padding: '0 5px', color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 'bold' }}>[ JOB_TITLE ]</div>
          <Trophy size={28} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{rank}</div>
        </div>

        <div style={{ background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--accent-cyan)', padding: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '10px', background: 'var(--bg-main)', padding: '0 5px', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 'bold' }}>[ EXPERIENCE ]</div>
          <Star size={28} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{xp} XP</div>
        </div>

        <div style={{ background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--accent-red)', padding: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '10px', background: 'var(--bg-main)', padding: '0 5px', color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 'bold' }}>[ SYSTEM_INTEGRITY ]</div>
          <Heart size={28} color="var(--accent-red)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{hearts} / 10</div>
        </div>

        <div style={{ background: 'rgba(11, 15, 25, 0.8)', border: '1px solid var(--accent-green)', padding: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', left: '10px', background: 'var(--bg-main)', padding: '0 5px', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 'bold' }}>[ COMPLETION_RATE ]</div>
          <Activity size={28} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{completionPercentage}%</div>
        </div>
      </div>

      {/* ACHIEVEMENT BADGES */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Trophy size={20} /> Security Clearances
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {badges.map(badge => {
            const isUnlocked = absoluteHighestIndex > badge.unlockIndex;
            return (
              <div key={badge.id} style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                background: isUnlocked ? 'rgba(6, 182, 212, 0.05)' : 'rgba(255,255,255,0.02)',
                border: isUnlocked ? '1px solid var(--accent-cyan)' : '1px dashed var(--glass-border)',
                opacity: isUnlocked ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '2rem', minWidth: '40px', textAlign: 'center' }}>
                  {isUnlocked ? badge.icon : <Lock size={24} color="var(--text-muted)" />}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>{badge.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4, fontFamily: 'sans-serif' }}>
                    {isUnlocked ? badge.description : `Requires Mission ${badge.unlockIndex + 1} Clearance`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ENGINEERING TOOLBOX */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <CheckCircle2 size={20} /> Provisioned Software
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {toolbox.map(tool => {
            const isUnlocked = absoluteHighestIndex > tool.unlockIndex;
            return (
              <div key={tool.id} style={{ 
                padding: '1.25rem', 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem',
                background: isUnlocked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                border: isUnlocked ? '1px solid var(--accent-green)' : '1px dashed var(--glass-border)',
                opacity: isUnlocked ? 1 : 0.5,
              }}>
                <div style={{ fontSize: '1.8rem', minWidth: '40px', textAlign: 'center', marginTop: '-2px' }}>
                  {isUnlocked ? tool.icon : <Lock size={24} color="var(--text-muted)" />}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem', color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>{tool.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.4, fontFamily: 'sans-serif' }}>
                    {isUnlocked ? tool.description : `Access Denied.`}
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
