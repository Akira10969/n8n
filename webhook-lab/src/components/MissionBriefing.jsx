import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, Target, Play, Radio, CheckCircle2, Terminal, ShieldAlert, Cpu, Activity, Server, Clock } from 'lucide-react';
import './MissionBriefing.css';
import { playVoiceLine, stopVoice, playUIBeep, playSuccessSound, playZoneAmbience, stopZoneAmbience, getAudioContext, setMusicPhase, playTypingSound } from '../utils/audioUtils';

// ─── Typewriter component ────────────────────────────────────────────────────
function Typewriter({ text, delay = 18, onDone, speedMultiplier = 1, showCursor = true }) {
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
        
        // Play typing sound on ~1/3 of characters to avoid being repetitive
        if (idx % 3 === 0 && text[idx] !== ' ') {
          playTypingSound();
        }
      }, delay / speedMultiplier);
      return () => clearTimeout(t);
    } else if (onDone) {
      onDone();
    }
  }, [idx, text, delay, onDone, speedMultiplier]);

  return (
    <span>
      {displayed}
      {showCursor && idx < text.length && <span className="mb-blink">█</span>}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MissionBriefing({ mission, missionIndex, onStartMission, highestUnlockedIndex, settings }) {
  // Cinematic Flow States
  const [step, setStep] = useState(0);
  const [voiceDone, setVoiceDone] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [isReadyToAdvance, setIsReadyToAdvance] = useState(false);
  const [animIn, setAnimIn] = useState(true);
  
  // Track timeouts/intervals for cleanup
  const timeoutsRef = useRef([]);
  const intervalsRef = useRef([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
    };
  }, []);
  
  // Terminal UI States
  const [liveTimestamp, setLiveTimestamp] = useState(new Date().toISOString().substring(11, 19));
  const [countdown, setCountdown] = useState(null);
  
  // NOC Dashboard states
  const [dashboardStatus, setDashboardStatus] = useState({
    api: 'ONLINE',
    webhook: 'HEALTHY',
    db: 'ONLINE',
    alerts: 0
  });

  const briefing = mission?.briefing;
  const isReplay = missionIndex < highestUnlockedIndex;

  // Determine Incident Level
  let incidentLevel = { level: 'LOW', color: '#22c55e', impact: '< 5 Minutes' };
  if (missionIndex >= 15) incidentLevel = { level: 'HIGH', color: '#f97316', impact: 'Regional Disruption' };
  if (missionIndex >= 24) incidentLevel = { level: 'CRITICAL', color: '#ef4444', impact: 'Enterprise-wide' };

  const steps = [];
  if (briefing?.recap) steps.push({ id: 'recap', label: 'SITREP / RECAP', text: briefing.recap, color: '#f59e0b' });
  
  // Add UNIT-7 Intro
  steps.push({
    id: 'unit7_intro',
    label: 'SECURE CHANNEL',
    text: '[UNIT-7]: Monitoring... Incoming transmission. Authenticating... Identity confirmed. Sarah connected. Opening secure channel...',
    color: '#06b6d4'
  });

  steps.push({ id: 'transmission', label: 'INCIDENT REPORT', text: briefing?.incident || '', color: '#ef4444' });
  steps.push({ id: 'task', label: 'OPERATIONAL DIRECTIVES', text: briefing?.task || '', color: '#8b5cf6' });
  steps.push({ id: 'launch', label: 'AUTHORIZATION', text: '', color: '#22c55e' });

  // Clock
  useEffect(() => {
    const t = setInterval(() => setLiveTimestamp(new Date().toISOString().substring(11, 19)), 1000);
    return () => clearInterval(t);
  }, []);

  // Environmental Ambience
  useEffect(() => {
    let zone = 'FOUNDATION ZONE';
    if (missionIndex >= 5) zone = 'INFRASTRUCTURE ZONE';
    if (missionIndex >= 10) zone = 'CLOUD ZONE';
    if (missionIndex >= 15) zone = 'SECURITY ZONE';
    if (missionIndex >= 20) zone = 'AUTOMATION ZONE';
    
    playZoneAmbience(zone);
    return () => stopZoneAmbience();
  }, [missionIndex]);

  // Handle stage audio/voice
  useEffect(() => {
    if (step >= steps.length) return;
    
    setVoiceDone(false);
    setTypingDone(false);
    setIsReadyToAdvance(false);
    
    if (steps[step].id === 'launch') {
      // Special logic for launch stage
      setMusicPhase('DEPLOYMENT');
      handleStage5();
      return;
    }

    if (steps[step].id === 'recap' || steps[step].id === 'unit7_intro') {
      setMusicPhase('MAP'); // Calm/Mysterious
    } else if (steps[step].id === 'transmission' || steps[step].id === 'task') {
      setMusicPhase('BRIEFING'); // Tense pulse
    }

    if (settings?.voiceEnabled !== false) {
      playVoiceLine(steps[step].text, () => setVoiceDone(true));
    } else {
      setVoiceDone(true); // Auto done if disabled
    }

    // Dynamic dashboard updates based on step
    if (steps[step].id === 'transmission') {
      const t = setTimeout(() => {
        setDashboardStatus(prev => ({
          ...prev, 
          api: incidentLevel.level === 'CRITICAL' ? 'DEGRADED' : 'ONLINE',
          webhook: 'CRITICAL',
          alerts: prev.alerts + 3
        }));
      }, 2000);
      timeoutsRef.current.push(t);
    }

    return () => stopVoice();
  }, [step]);

  // Check completion of typing and voice
  useEffect(() => {
    if (typingDone && voiceDone && steps[step]?.id !== 'launch') {
      setIsReadyToAdvance(true);
      if (settings?.autoPlayBriefings !== false && !isReplay) {
        const t = setTimeout(advance, 1500); // Cinematic pause before next
        timeoutsRef.current.push(t);
      }
    }
  }, [typingDone, voiceDone, settings?.autoPlayBriefings, isReplay]);

  const advance = () => {
    if (step < steps.length - 1) {
      setAnimIn(false);
      const t = setTimeout(() => {
        setStep(s => s + 1);
        setAnimIn(true);
      }, 400);
      timeoutsRef.current.push(t);
    }
  };

  const handleStage5 = () => {
    // Stage 5 Checklist animation handled in render, just wait for it.
    const t = setTimeout(() => {
      if (settings?.voiceEnabled !== false) {
        playVoiceLine("[UNIT-7]: Mission environment ready. Good luck, Engineer.", () => {
          startCountdown();
        });
      } else {
        startCountdown();
      }
    }, 4000); // Wait for checklist to render
    timeoutsRef.current.push(t);
  };

  const startCountdown = () => {
    let c = 5;
    setCountdown(c);
    const int = setInterval(() => {
      c--;
      if (c > 0) {
        setCountdown(c);
        playUIBeep();
      } else {
        setCountdown('DEPLOYMENT AUTHORIZED');
        playSuccessSound();
        clearInterval(int);
        const t = setTimeout(() => {
          onStartMission();
        }, 1500);
        timeoutsRef.current.push(t);
      }
    }, 1000);
    intervalsRef.current.push(int);
  };

  if (!briefing) {
    return (
      <div className="mb-wrapper">
        <button className="mb-btn-launch" onClick={onStartMission}>DEPLOYMENT AUTHORIZED</button>
      </div>
    );
  }

  return (
    <div className="mb-wrapper">
      
      {/* HUD HEADER */}
      <div className="mb-hud-header">
        <div className="mb-hud-left">
          <Terminal size={18} color="var(--accent-cyan)" />
          <span>TERMINAL // {liveTimestamp}</span>
        </div>
        <div className="mb-hud-right" style={{ color: incidentLevel.color }}>
          <ShieldAlert size={18} />
          <span>INCIDENT LEVEL: {incidentLevel.level}</span>
        </div>
      </div>

      <div className="mb-main-layout">
        
        {/* LEFT: Briefing Content */}
        <div className="mb-content-area">
          <div className="mb-progress-track">
            {steps.map((s, i) => (
              <div key={s.id} className={`mb-progress-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
                <div className="mb-step-dot" style={{ borderColor: i <= step ? s.color : undefined, background: i < step ? s.color : undefined }}></div>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {Math.round((step / (steps.length - 1)) * 100)}%
            </div>
          </div>

          <div className={`mb-step-content ${animIn ? 'slide-in' : 'slide-out'}`}>
            
            {steps[step].id !== 'launch' && (
              <div className="mb-card" style={{ borderColor: steps[step].color, background: `linear-gradient(90deg, ${steps[step].color}11, transparent)` }}>
                <div className="mb-card-header" style={{ color: steps[step].color }}>
                  <Radio size={18} />
                  <span>{steps[step].label}</span>
                </div>
                <div className="mb-body-text">
                  <Typewriter 
                    text={steps[step].text.replace(/\[.*?\]:\s*/, '')} 
                    delay={25} 
                    speedMultiplier={isReplay ? 3 : 1}
                    onDone={() => setTypingDone(true)} 
                  />
                </div>
              </div>
            )}

            {steps[step].id === 'launch' && (
              <div className="mb-card mb-card-launch" style={{ borderColor: '#22c55e', background: 'rgba(34,197,94,0.08)' }}>
                <div className="mb-card-header" style={{ color: '#22c55e' }}>
                  <Play size={18} />
                  <span>DEPLOYMENT AUTHORIZATION</span>
                </div>
                <div className="mb-checklist">
                  <Typewriter text="Initializing Mission..." onDone={() => {}} showCursor={false} delay={10} /><br/><br/>
                  <Typewriter text="✓ Network Connected" delay={200} showCursor={false}/><br/>
                  <Typewriter text="✓ API Gateway Online" delay={400} showCursor={false}/><br/>
                  <Typewriter text="✓ Authentication Verified" delay={600} showCursor={false}/><br/>
                  <Typewriter text="✓ Terminal Ready" delay={800} showCursor={false}/><br/>
                  <Typewriter text="✓ Environment Loaded" delay={1000} showCursor={false}/><br/>
                  <Typewriter text="✓ Mission Authorization Granted" delay={1200} showCursor={false}/>
                </div>
                
                {countdown !== null && (
                  <div className="mb-countdown-overlay">
                    {countdown === 'DEPLOYMENT AUTHORIZED' ? 'DEPLOYING TO INCIDENT...' : countdown}
                  </div>
                )}
              </div>
            )}
            
          </div>

          <div className="mb-controls">
            {(isReplay || settings?.autoPlayBriefings === false) && step < steps.length - 1 && (
              <button 
                className={`mb-btn-continue ${isReadyToAdvance ? 'ready' : ''}`}
                onClick={advance}
              >
                {isReadyToAdvance ? 'CONTINUE >' : 'SKIP >'}
              </button>
            )}
            {step < steps.length - 1 && (
              <button className="mb-btn-skip-all" onClick={() => { stopVoice(); setStep(steps.length - 1); }}>
                QUICK DEPLOY
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Live Monitoring Panel */}
        <div className="mb-sidebar-dashboard">
          <div className="mb-dash-header">LIVE MONITORING</div>
          
          <div className="mb-dash-item">
            <Cpu size={16} />
            <span>API Gateway</span>
            <span className={`status-badge ${dashboardStatus.api}`}>{dashboardStatus.api}</span>
          </div>
          
          <div className="mb-dash-item">
            <Activity size={16} />
            <span>Webhook Queue</span>
            <span className={`status-badge ${dashboardStatus.webhook}`}>{dashboardStatus.webhook}</span>
          </div>
          
          <div className="mb-dash-item">
            <Server size={16} />
            <span>Database</span>
            <span className={`status-badge ${dashboardStatus.db}`}>{dashboardStatus.db}</span>
          </div>
          
          <div className="mb-dash-item">
            <AlertOctagon size={16} />
            <span>Active Alerts</span>
            <span style={{ color: dashboardStatus.alerts > 0 ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{dashboardStatus.alerts}</span>
          </div>
          
          <div className="mb-dash-footer">
            <Clock size={14} /> Est. Impact: {incidentLevel.impact}
          </div>
        </div>

      </div>
    </div>
  );
}
