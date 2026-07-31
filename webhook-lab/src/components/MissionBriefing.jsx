import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, Target, Award, Play, ChevronRight, Radio, CheckCircle2 } from 'lucide-react';
import { badges } from '../data/achievements';
import './MissionBriefing.css';

// ─── Typewriter component ────────────────────────────────────────────────────
function Typewriter({ text, delay = 18, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setDisplayed('');
    setIdx(0);
  }, [text]);

  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => {
        setDisplayed(p => p + text[idx]);
        setIdx(i => i + 1);
      }, delay);
      return () => clearTimeout(t);
    } else if (onDone) {
      onDone();
    }
  }, [idx, text, delay, onDone]);

  return (
    <span>
      {displayed}
      {idx < text.length && <span className="mb-blink">▌</span>}
    </span>
  );
}

// ─── Step definitions ────────────────────────────────────────────────────────
// We build the steps dynamically from the mission data
function buildSteps(mission, missionIndex, rewardBadge) {
  const b = mission?.briefing;
  const steps = [];
  
  if (b?.recap) {
    steps.push({
      id: 'recap',
      label: 'PREVIOUSLY ON MEI_CLOUD_OS',
      icon: <Radio size={18} />,
      color: '#f59e0b', // Amber/orange for flashback
    });
  }
  
  steps.push(
    {
      id: 'transmission',
      label: 'INCOMING TRANSMISSION',
      icon: <AlertOctagon size={18} />,
      color: '#ef4444',
    },
    {
      id: 'task',
      label: 'MISSION DIRECTIVE',
      icon: <Target size={18} />,
      color: '#06b6d4',
    },
    {
      id: 'rewards',
      label: 'POTENTIAL REWARDS',
      icon: <Award size={18} />,
      color: '#8b5cf6',
    },
    {
      id: 'launch',
      label: 'INITIALIZE MISSION',
      icon: <Play size={18} />,
      color: '#22c55e',
    }
  );
  
  return steps;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MissionBriefing({ mission, missionIndex, onStartMission }) {
  const [step, setStep] = useState(0);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [animIn, setAnimIn] = useState(true);
  const panelRef = useRef(null);

  const briefing = mission?.briefing;

  // Reset state when mission changes
  useEffect(() => {
    setStep(0);
    setTypewriterDone(false);
    setAnimIn(true);
  }, [mission.id]);

  const rewardBadge = briefing?.rewards?.badge && briefing.rewards.badge !== 'None'
    ? badges.find(b => b.id === briefing.rewards.badge)
    : null;

  const steps = buildSteps(mission, missionIndex, rewardBadge);
  const totalSteps = steps.length;

  // Advance to next step with slide-in animation
  const advance = () => {
    setAnimIn(false);
    setTimeout(() => {
      setStep(s => s + 1);
      setTypewriterDone(false);
      setAnimIn(true);
    }, 300);
  };

  // Fallback for missions with no briefing
  if (!briefing) {
    return (
      <div className="mb-wrapper">
        <div className="mb-panel">
          <h2 className="mb-title">{mission.title}</h2>
          <button className="mb-btn-primary" onClick={onStartMission}>
            <Play size={18} fill="currentColor" /> Start Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-wrapper" ref={panelRef}>
      {/* ── Step Progress Bar ── */}
      <div className="mb-progress-track">
        {steps.map((s, i) => (
          <div key={s.id} className={`mb-progress-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
            <div className="mb-step-dot" style={{ borderColor: i <= step ? s.color : undefined, background: i < step ? s.color : undefined }}>
              {i < step ? <CheckCircle2 size={10} color="#000" /> : <span className="mb-step-num">{i + 1}</span>}
            </div>
            <span className="mb-step-label">{s.label}</span>
            {i < totalSteps - 1 && <div className={`mb-step-line ${i < step ? 'filled' : ''}`} style={{ background: i < step ? s.color : undefined }} />}
          </div>
        ))}
      </div>

      {/* ── Mission Identity ── */}
      <div className="mb-identity">
        <div className="mb-mission-code">MISSION_{String(missionIndex + 1).padStart(2, '0')}</div>
        <h1 className="mb-title">{mission.title}</h1>
      </div>

      {/* ── Step Content ── */}
      <div className={`mb-step-content ${animIn ? 'slide-in' : 'slide-out'}`}>

        {/* STEP: Recap (Optional) */}
        {steps[step].id === 'recap' && (
          <div className="mb-card" style={{ borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}>
            <div className="mb-card-header" style={{ color: '#f59e0b' }}>
              <Radio size={20} />
              <span>PREVIOUSLY ON MEI_CLOUD_OS...</span>
            </div>
            <p className="mb-body-text" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
              <Typewriter text={briefing?.recap || ''} delay={18} onDone={() => setTypewriterDone(true)} />
            </p>
          </div>
        )}

        {/* STEP: Incoming Transmission */}
        {steps[step].id === 'transmission' && (
          <div className="mb-card" style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.06)' }}>
            <div className="mb-card-header" style={{ color: '#ef4444' }}>
              <AlertOctagon size={20} />
              <span>INCOMING TRANSMISSION — PRIORITY ALPHA</span>
              <span className="mb-blink-dot"></span>
            </div>
            <p className="mb-body-text">
              <Typewriter text={briefing?.incident || ''} delay={18} onDone={() => setTypewriterDone(true)} />
            </p>
          </div>
        )}

        {/* STEP: Mission Directive */}
        {steps[step].id === 'task' && (
          <div className="mb-card" style={{ borderColor: '#06b6d4', background: 'rgba(6,182,212,0.06)' }}>
            <div className="mb-card-header" style={{ color: '#06b6d4' }}>
              <Target size={20} />
              <span>MISSION DIRECTIVE</span>
            </div>
            <p className="mb-body-text">
              <Typewriter text={briefing?.task || ''} delay={14} onDone={() => setTypewriterDone(true)} />
            </p>
          </div>
        )}

        {/* STEP: Rewards */}
        {steps[step].id === 'rewards' && (
          <div className="mb-card" style={{ borderColor: '#8b5cf6', background: 'rgba(139,92,246,0.06)' }}>
            <div className="mb-card-header" style={{ color: '#8b5cf6' }}>
              <Award size={20} />
              <span>POTENTIAL REWARDS</span>
            </div>
            <div className="mb-rewards-grid">
              <div className="mb-reward-chip" style={{ borderColor: '#facc15', color: '#facc15' }}>
                <span className="mb-reward-icon">⭐</span>
                <div>
                  <div className="mb-reward-value">{briefing?.rewards?.xp || 50} XP</div>
                  <div className="mb-reward-label">Experience Points</div>
                </div>
              </div>
              {rewardBadge ? (
                <div className="mb-reward-chip" style={{ borderColor: rewardBadge.color, color: rewardBadge.color }}>
                  <span className="mb-reward-icon">{rewardBadge.icon}</span>
                  <div>
                    <div className="mb-reward-value">{rewardBadge.name}</div>
                    <div className="mb-reward-label">Badge Unlocked</div>
                  </div>
                </div>
              ) : (
                <div className="mb-reward-chip" style={{ borderColor: '#22c55e', color: '#22c55e' }}>
                  <span className="mb-reward-icon">🏅</span>
                  <div>
                    <div className="mb-reward-value">+1 Mission Complete</div>
                    <div className="mb-reward-label">Career Progress</div>
                  </div>
                </div>
              )}
            </div>
            {/* Auto-advance after a brief pause since no typewriter here */}
            {!typewriterDone && setTimeout(() => setTypewriterDone(true), 800)}
          </div>
        )}

        {/* STEP 3: Launch */}
        {step === 3 && (
          <div className="mb-card mb-card-launch" style={{ borderColor: '#22c55e', background: 'rgba(34,197,94,0.06)' }}>
            <div className="mb-card-header" style={{ color: '#22c55e' }}>
              <Play size={20} fill="currentColor" />
              <span>SYSTEMS READY — AWAITING AUTHORIZATION</span>
            </div>
            <p className="mb-body-text" style={{ color: 'var(--text-muted)' }}>
              All prerequisite checks passed. Your mission parameters are locked in. Click INITIALIZE to begin deployment.
            </p>
            <button className="mb-btn-launch" onClick={onStartMission}>
              <Play size={22} fill="currentColor" />
              INITIALIZE MISSION
            </button>
            {!typewriterDone && setTimeout(() => setTypewriterDone(true), 500)}
          </div>
        )}

      </div>

      {/* ── Continue Button (hidden on last step) ── */}
      {step < totalSteps - 1 && (
        <button
          className={`mb-btn-continue ${typewriterDone ? 'ready' : 'waiting'}`}
          onClick={typewriterDone ? advance : undefined}
          disabled={!typewriterDone}
        >
          {typewriterDone ? (
            <>CONTINUE <ChevronRight size={18} /></>
          ) : (
            <span className="mb-loading-dots">Receiving<span>.</span><span>.</span><span>.</span></span>
          )}
        </button>
      )}
    </div>
  );
}
