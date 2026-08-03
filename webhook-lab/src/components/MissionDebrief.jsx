import React, { useEffect, useState } from 'react';
import { Trophy, Star, ArrowRight, ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { badges } from '../data/achievements';
import { playVoiceLine, playSuccessSound } from '../utils/audioUtils';
import { getDebrief } from '../data/debriefs';
import './MissionDebrief.css';

export default function MissionDebrief({ missionIndex, xpGained, newRank, unlockedBadgeId, onContinue, failedAttempts }) {
  
  const [step, setStep] = useState(0); // 0: Status, 1: Report, 2: Rewards

  let status = 'SUCCESS';
  let statusColor = '#22c55e';
  let Icon = ShieldCheck;
  
  if (failedAttempts > 0) {
    status = 'SUCCESS WITH WARNINGS';
    statusColor = '#f59e0b';
    Icon = AlertTriangle;
  }

  useEffect(() => {
    playSuccessSound();
    
    const debrief = getDebrief(missionIndex, status);

    // Auto-progress sequence
    const t1 = setTimeout(() => setStep(1), 2000);
    const t2 = setTimeout(() => {
      setStep(2);
      fireConfetti();
      playVoiceLine(`[SARAH]: ${debrief.sarah}`);
    }, 4500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [status, missionIndex]);

  const fireConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#06b6d4', '#8b5cf6', '#10b981'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#06b6d4', '#8b5cf6', '#10b981'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const badge = unlockedBadgeId ? badges.find(b => b.id === unlockedBadgeId) : null;

  return (
    <div className="debrief-wrapper">
      
      <div className="debrief-header">
        <h1>MISSION DEBRIEF</h1>
      </div>

      <div className="debrief-content">
        
        {/* Step 0: STATUS */}
        <div className={`debrief-card status-card debrief-fade-in`} style={{ borderColor: statusColor, background: `radial-gradient(circle at top, ${statusColor}22, transparent)` }}>
          <Icon size={48} color={statusColor} />
          <h2>MISSION STATUS: {status}</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {status === 'SUCCESS' ? 'All operational objectives completed successfully.' : 'Mission completed, but performance targets were missed.'}
          </p>
        </div>

        {/* Step 1: REPORT */}
        {step >= 1 && (
          <div className="debrief-card report-card debrief-fade-in">
            <h3><CheckCircle2 size={16}/> POST-MISSION REPORT</h3>
            <div className="debrief-log">
              <p><strong>[UNIT-7]:</strong> {getDebrief(missionIndex, status).unit7}</p>
              <p><strong>[SARAH]:</strong> {getDebrief(missionIndex, status).sarah}</p>
            </div>
          </div>
        )}

        {/* Step 2: REWARDS */}
        {step >= 2 && (
          <div className="debrief-rewards debrief-fade-in">
            <div className="reward-box">
              <Star size={32} color="var(--accent-cyan)" />
              <div className="reward-val">+{xpGained} XP</div>
              <div className="reward-lbl">EXPERIENCE</div>
            </div>
            
            {badge && (
              <div className="reward-box badge-box">
                <div style={{ fontSize: '2rem' }}>{badge.icon}</div>
                <div className="reward-val">{badge.name}</div>
                <div className="reward-lbl">BADGE UNLOCKED</div>
              </div>
            )}
          </div>
        )}

      </div>

      {step >= 2 && (
        <div className="debrief-controls debrief-fade-in">
          <button className="btn-return" onClick={onContinue}>
            RETURN TO MAP <ArrowRight size={18} />
          </button>
        </div>
      )}

    </div>
  );
}
