import React, { useRef, useState, useEffect } from 'react';
import { Lock, CheckCircle2, Play, ShieldAlert, Activity } from 'lucide-react';
import PostGameSequence from './PostGameSequence';
import { playVoiceLine } from '../utils/audioUtils';
import './MissionMap.css';

// Zone definitions for region labels and colors
const zones = [
  { name: 'FOUNDATION ZONE',     color: '#22c55e', missions: [1,2,3,4,5] },
  { name: 'INFRASTRUCTURE ZONE', color: '#06b6d4', missions: [6,7,8,9,10] },
  { name: 'CLOUD ZONE',          color: '#8b5cf6', missions: [11,12,13,14,15] },
  { name: 'SECURITY ZONE',       color: '#ef4444', missions: [16,17,18,19,20] },
  { name: 'AUTOMATION ZONE',     color: '#f97316', missions: [21,22,23,24,25] },
  { name: 'OBSERVABILITY ZONE',  color: '#06b6d4', missions: [26,27,28,29,30] },
  { name: 'CAPSTONE',            color: '#fbbf24', missions: [31] },
];

const missionCoordinates = [
  { x: 4,  y: 60 }, { x: 8,  y: 40 }, { x: 12, y: 30 }, { x: 15, y: 55 }, { x: 18, y: 70 },
  { x: 23, y: 60 }, { x: 25, y: 35 }, { x: 29, y: 25 }, { x: 32, y: 45 }, { x: 35, y: 65 },
  { x: 40, y: 55 }, { x: 42, y: 30 }, { x: 46, y: 25 }, { x: 49, y: 45 }, { x: 51, y: 65 },
  { x: 56, y: 55 }, { x: 58, y: 30 }, { x: 62, y: 25 }, { x: 65, y: 45 }, { x: 68, y: 65 },
  { x: 73, y: 55 }, { x: 75, y: 30 }, { x: 79, y: 25 }, { x: 82, y: 45 }, { x: 84, y: 65 },
  { x: 89, y: 55 }, { x: 91, y: 30 }, { x: 93, y: 25 }, { x: 95, y: 45 }, { x: 96, y: 65 },
  { x: 98, y: 50 },
];

function getZoneColor(index) {
  const missionNum = index + 1;
  const zone = zones.find(z => z.missions.includes(missionNum));
  return zone ? zone.color : '#06b6d4';
}

function TypewriterLine({ text, onDone }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(t);
        if (onDone) setTimeout(onDone, 1000);
      }
    }, 40);
    return () => clearInterval(t);
  }, [text, onDone]);
  return <div>{displayed}<span className="mb-blink">_</span></div>;
}

export default function MissionMap({ curriculum, highestUnlockedIndex, activeMissionIndex, onSelectMission, skipIntro, onIntroComplete, hasCompletedGame, worldState, onCorruptionCinematicComplete }) {
  const wrapperRef = useRef(null);
  const [hasAcknowledged, setHasAcknowledged] = useState(() => localStorage.getItem('webhook_has_seen_post_credits') === 'true');
  
  const [introPhase, setIntroPhase] = useState((activeMissionIndex === null && !skipIntro && worldState !== 'UNDER_ATTACK') ? 'init' : 'done');
  
  const [mapTransform, setMapTransform] = useState(() => {
    if (activeMissionIndex === null && !skipIntro && worldState !== 'UNDER_ATTACK') return 'scale(3) translate(-25%, -15%)';
    return 'scale(1) translate(0, 0)';
  });

  // Cinematic Attack States
  const [attackPhase, setAttackPhase] = useState(0); 
  // 0=idle, 1=monitor, 2=anomaly, 3=breach, 4=voice, 5=sweeping, 6=done

  // Attack Cinematic Sequence
  useEffect(() => {
    if (worldState === 'UNDER_ATTACK' && attackPhase === 0 && activeMissionIndex === null) {
      setIntroPhase('done');
      setMapTransform('scale(1.2) translate(10%, 10%)'); // Slightly zoomed in before pulling back
      setAttackPhase(1);
    }
  }, [worldState, attackPhase, activeMissionIndex]);

  useEffect(() => {
    if (attackPhase === 4) {
      // Pull back camera
      setMapTransform('scale(1) translate(0, 0)');
      setTimeout(() => {
        setAttackPhase(5);
        playVoiceLine("[UNIT-7]: WARNING. The UI is shattered. The map is bleeding. The Void has breached the outer defenses.", () => {
          setTimeout(() => {
            setAttackPhase(6);
            if (onCorruptionCinematicComplete) onCorruptionCinematicComplete();
          }, 2000);
        }, { pitch: 0.8, rate: 1.1 });
      }, 500);
    }
  }, [attackPhase, onCorruptionCinematicComplete]);

  // Handle active mission zooming
  useEffect(() => {
    if (introPhase !== 'done' || worldState === 'UNDER_ATTACK') return;
    
    if (activeMissionIndex !== null && activeMissionIndex < missionCoordinates.length) {
      const coord = missionCoordinates[activeMissionIndex];
      const targetX = 50 - coord.x - 12;
      const targetY = 50 - coord.y;
      setMapTransform(`scale(2.2) translate(${targetX}%, ${targetY}%)`);
    } else {
      setMapTransform('scale(1) translate(0%, 0%)');
    }
  }, [activeMissionIndex, introPhase, worldState]);

  // Standard intro sequence
  useEffect(() => {
    if (activeMissionIndex !== null || skipIntro || worldState === 'UNDER_ATTACK') return;
    const t1 = setTimeout(() => { setIntroPhase('pan'); setMapTransform('scale(2.2) translate(15%, 20%)'); }, 100);
    const t2 = setTimeout(() => { setIntroPhase('zoom-out'); setMapTransform('scale(1) translate(0%, 0%)'); }, 6000);
    const t3 = setTimeout(() => { setIntroPhase('done'); if (onIntroComplete) onIntroComplete(); }, 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [activeMissionIndex, skipIntro, worldState, onIntroComplete]);

  const pathLines = missionCoordinates.slice(0, curriculum.length - 1).map((coord, i) => {
    const next = missionCoordinates[i + 1];
    if (!next) return null;
    const isCompleted = i < highestUnlockedIndex;
    const isUnlocked = i <= highestUnlockedIndex;
    return { x1: coord.x, y1: coord.y, x2: next.x, y2: next.y, isCompleted, isUnlocked, index: i };
  });

  let transitionStyle = 'transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)';
  if (introPhase === 'pan') transitionStyle = 'transform 6s linear';
  if (introPhase === 'zoom-out') transitionStyle = 'transform 3.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
  if (attackPhase === 4) transitionStyle = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)'; // Slow dramatic pull back

  const isUIVisible = introPhase === 'zoom-out' || introPhase === 'done';
  const isFogHeavy = introPhase === 'init' || introPhase === 'pan' || worldState === 'CORRUPTED';

  // NOC Dashboard Values dynamically based on attackPhase and worldState
  const getDashboardData = () => {
    if (worldState === 'NORMAL') return { f: 'ONLINE', i: 'ONLINE', c: 'ONLINE', s: 'ONLINE', a: 'ONLINE', load: '14%', alerts: 0, gw: 'ONLINE', wq: 'Low' };
    if (worldState === 'UNDER_ATTACK') {
      if (attackPhase < 3) return { f: 'ONLINE', i: 'ONLINE', c: 'ONLINE', s: 'ONLINE', a: 'ONLINE', load: '22%', alerts: 1, gw: 'ONLINE', wq: 'Normal' };
      if (attackPhase === 3) return { f: 'ONLINE', i: 'WARNING', c: 'WARNING', s: 'WARNING', a: 'WARNING', load: '85%', alerts: 4, gw: 'WARNING', wq: 'Elevated' };
      if (attackPhase >= 4) return { f: 'ONLINE', i: 'DEGRADED', c: 'WARNING', s: 'CRITICAL', a: 'OFFLINE', load: '99%', alerts: 17, gw: 'DEGRADED', wq: 'High' };
    }
    if (worldState === 'CORRUPTED') return { f: 'ONLINE', i: 'DEGRADED', c: 'WARNING', s: 'CRITICAL', a: 'OFFLINE', load: '92%', alerts: 12, gw: 'DEGRADED', wq: 'High' };
    if (worldState === 'RECOVERING') {
      const idx = highestUnlockedIndex;
      return { 
        f: 'ONLINE', 
        i: idx >= 10 ? 'ONLINE' : 'DEGRADED', 
        c: idx >= 15 ? 'ONLINE' : 'WARNING', 
        s: idx >= 20 ? 'ONLINE' : 'CRITICAL', 
        a: idx >= 25 ? 'ONLINE' : 'OFFLINE', 
        load: `${Math.max(15, 90 - (idx - 5) * 3)}%`, 
        alerts: Math.max(0, 12 - Math.floor((idx - 5) / 2)), 
        gw: idx >= 15 ? 'ONLINE' : 'DEGRADED', 
        wq: idx >= 20 ? 'Normal' : 'High' 
      };
    }
    return { f: 'ONLINE', i: 'ONLINE', c: 'ONLINE', s: 'ONLINE', a: 'ONLINE', load: '10%', alerts: 0, gw: 'ONLINE', wq: 'Low' };
  };

  const dbData = getDashboardData();

  // Progressive Healing Overlay Calculation
  // Max corruption reaches to x=23 (Mission 6). Capstone is x=98.
  let corruptionX = 98;
  if (worldState === 'UNDER_ATTACK') {
    corruptionX = attackPhase >= 5 ? 20 : 100; // Sweep left during phase 5
  } else if (worldState === 'CORRUPTED') {
    corruptionX = 20; // Maximum coverage
  } else if (worldState === 'RECOVERING') {
    const currentCoord = missionCoordinates[Math.min(highestUnlockedIndex, 30)];
    corruptionX = currentCoord ? currentCoord.x - 5 : 98; 
  } else if (worldState === 'RESTORED' || worldState === 'NORMAL') {
    corruptionX = 150; // Off screen
  }

  return (
    <div className={`interactive-map-wrapper ${activeMissionIndex !== null ? 'sidebar-mode' : ''} ${worldState ? worldState.toLowerCase() : ''}`} ref={wrapperRef}>

      {worldState === 'UNDER_ATTACK' && (attackPhase > 0 && attackPhase < 6) && (
        <div className="attack-cinematic-overlay">
          {attackPhase === 1 && <TypewriterLine text="[UNIT-7]: Monitoring..." onDone={() => setAttackPhase(2)} />}
          {attackPhase === 2 && <TypewriterLine text="[UNIT-7]: Anomaly detected. Unknown signal strength increasing." onDone={() => setAttackPhase(3)} />}
          {attackPhase === 3 && <TypewriterLine text="[UNIT-7]: Outer defenses compromised." onDone={() => setAttackPhase(4)} />}
        </div>
      )}

      {/* Cinematic Fog & Dust Overlay */}
      <div className={`map-fog-overlay ${isFogHeavy ? 'heavy' : 'light'} ${worldState === 'RESTORED' ? 'cleared' : ''}`}></div>
      <div className="dust-particles"></div>
      
      {/* Glitch Overlay for Attack/Corrupted states */}
      {((worldState === 'UNDER_ATTACK' && attackPhase >= 3) || worldState === 'CORRUPTED') && (
        <div className="global-glitch-overlay"></div>
      )}

      {/* NOC Dashboard (Top Right) */}
      <div className="map-noc-dashboard" style={{ opacity: isUIVisible && activeMissionIndex === null ? 1 : 0 }}>
        <div className="noc-header"><Activity size={14} /> PLATFORM STATUS: {worldState}</div>
        <div className="noc-grid">
          <div className="noc-row"><span>Foundation</span> <span className={`status ${dbData.f}`}>{dbData.f}</span></div>
          <div className="noc-row"><span>Infrastructure</span> <span className={`status ${dbData.i}`}>{dbData.i}</span></div>
          <div className="noc-row"><span>Cloud</span> <span className={`status ${dbData.c}`}>{dbData.c}</span></div>
          <div className="noc-row"><span>Security</span> <span className={`status ${dbData.s}`}>{dbData.s}</span></div>
          <div className="noc-row"><span>Automation</span> <span className={`status ${dbData.a}`}>{dbData.a}</span></div>
        </div>
        <div className="noc-divider"></div>
        <div className="noc-grid">
          <div className="noc-row"><span>API Gateway</span> <span className={`status ${dbData.gw}`}>{dbData.gw}</span></div>
          <div className="noc-row"><span>Webhook Queue</span> <span className={`status ${dbData.wq === 'High' ? 'CRITICAL' : 'ONLINE'}`}>{dbData.wq}</span></div>
          <div className="noc-row"><span>CPU Load</span> <span className="status">{dbData.load}</span></div>
          <div className="noc-row"><span>Active Alerts</span> <span className={`status ${dbData.alerts > 0 ? 'WARNING' : 'ONLINE'}`}>{dbData.alerts}</span></div>
        </div>
      </div>

      <div className="map-viewport">
        <div className={hasCompletedGame && !hasAcknowledged ? "map-cinematic-pan" : ""} style={{ width: '100%', height: '100%' }}>
          <div className="map-layer" style={{ transform: mapTransform, transition: transitionStyle }}>

            <img src="/mission-map-bg.jpg" alt="Mission Map" className="map-bg-image" />
          
          {/* Progressive Dynamic Void Overlay */}
          {worldState !== 'NORMAL' && worldState !== 'RESTORED' && (
            <div 
              className={`void-map-overlay ${worldState === 'UNDER_ATTACK' && attackPhase === 5 ? 'sweeping' : ''}`}
              style={{
                background: `radial-gradient(circle at 100% 50%, #000 0%, #000 ${100 - corruptionX - 10}%, transparent ${100 - corruptionX + 20}%)`,
                opacity: 0.95,
                transition: worldState === 'UNDER_ATTACK' ? 'background 5s cubic-bezier(0.4, 0, 0.2, 1)' : 'background 2s ease-in-out'
              }}
            ></div>
          )}

          {/* SVG CONNECTION PATHS */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 3, overflow: 'visible',
              opacity: isUIVisible ? 1 : 0, transition: 'opacity 2s ease 1s'
            }}
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {pathLines.map((line, i) => {
              if (!line) return null;
              // If the path is to the right of the corruption edge, it is corrupted.
              const isCorrupted = line.x1 >= corruptionX && worldState !== 'NORMAL' && worldState !== 'RESTORED';
              
              return (
                <g key={i}>
                  <line
                    x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                    stroke={isCorrupted ? "rgba(239, 68, 68, 0.4)" : "rgba(255,255,255,0.15)"}
                    strokeWidth={isCorrupted ? "0.6" : "0.4"}
                    strokeDasharray={isCorrupted ? "2 2" : "1 0.8"}
                    vectorEffect="non-scaling-stroke"
                    className={isCorrupted ? "corrupted-path" : ""}
                  />
                  {line.isUnlocked && !isCorrupted && (
                    <line
                      x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                      stroke={line.isCompleted ? '#22c55e' : '#06b6d4'}
                      strokeWidth={line.isCompleted ? 0.6 : 0.4}
                      strokeOpacity={line.isCompleted ? 0.9 : 0.6}
                      filter="url(#glow)"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* MISSION NODES */}
          {curriculum.map((mission, index) => {
            const isUnlocked = index <= highestUnlockedIndex;
            const isCompleted = index < highestUnlockedIndex;
            const isNext = index === highestUnlockedIndex;
            const isActive = index === activeMissionIndex;
            const isBlurred = activeMissionIndex !== null && !isActive;
            const coord = missionCoordinates[index] || { x: 50, y: 50 };
            const zoneColor = getZoneColor(index);
            
            const isCorrupted = coord.x >= corruptionX && worldState !== 'NORMAL' && worldState !== 'RESTORED';

            return (
              <div
                key={mission.id}
                className={`map-node-wrapper ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'is-next' : ''} ${isActive ? 'is-active' : ''} ${isBlurred ? 'is-blurred' : ''} ${isCorrupted ? 'corrupted-node' : ''}`}
                style={{ 
                  left: `${coord.x}%`, 
                  top: `${coord.y}%`,
                  opacity: isUIVisible ? 1 : 0,
                  transition: `opacity 2s ease ${1.5 + (index * 0.05)}s, transform 0.3s ease`
                }}
              >
                {!isCompleted && !isCorrupted && (
                  <div className="node-pulse" style={{ borderColor: zoneColor, animationDelay: `${index * 0.2}s` }}></div>
                )}
                
                {isCorrupted && (
                  <div className="node-glitch-ring"></div>
                )}

                <button 
                  className="map-node"
                  style={{ 
                    borderColor: isCorrupted ? '#ef4444' : zoneColor,
                    background: isCorrupted ? '#450a0a' : '#111',
                    boxShadow: isCorrupted ? '0 0 10px #ef4444' : (isUnlocked ? `0 0 15px ${zoneColor}40` : 'none')
                  }}
                  onClick={() => {
                    if (isUnlocked && worldState !== 'UNDER_ATTACK') {
                      onSelectMission(index);
                    }
                  }}
                  disabled={!isUnlocked || worldState === 'UNDER_ATTACK'}
                >
                  {isCompleted && !isCorrupted ? <CheckCircle2 size={12} color={zoneColor} /> : 
                   isCorrupted ? <ShieldAlert size={12} color="#ef4444" /> :
                   isUnlocked ? <Play size={10} color={zoneColor} style={{ marginLeft: '2px' }} /> : 
                   <Lock size={10} color="rgba(255,255,255,0.3)" />}
                </button>
                
                <div className="node-label">
                  <span className="node-num" style={{ color: isCorrupted ? '#ef4444' : zoneColor }}>{index + 1}</span>
                  <span className="node-title">{mission.title.split(' - ')[0]}</span>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {hasCompletedGame && !hasAcknowledged && (
        <PostGameSequence onComplete={() => setHasAcknowledged(true)} />
      )}
    </div>
  );
}
