import React, { useRef, useState, useEffect } from 'react';
import { Lock, CheckCircle2, Play } from 'lucide-react';
import PostGameSequence from './PostGameSequence';
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

// Coordinates as percentages of the map image dimensions.
// These snake through the biome map zones horizontally from left to right.
const missionCoordinates = [
  // Foundation Zone (left forest)
  { x: 4,  y: 60 }, // 1
  { x: 8,  y: 40 }, // 2
  { x: 12, y: 30 }, // 3
  { x: 15, y: 55 }, // 4
  { x: 18, y: 70 }, // 5

  // Infrastructure Zone (snowy tundra)
  { x: 23, y: 60 }, // 6
  { x: 25, y: 35 }, // 7
  { x: 29, y: 25 }, // 8
  { x: 32, y: 45 }, // 9
  { x: 35, y: 65 }, // 10

  // Cloud Zone (purple mystical center-left)
  { x: 40, y: 55 }, // 11
  { x: 42, y: 30 }, // 12
  { x: 46, y: 25 }, // 13
  { x: 49, y: 45 }, // 14
  { x: 51, y: 65 }, // 15

  // Security Zone (volcanic lava center-right)
  { x: 56, y: 55 }, // 16
  { x: 58, y: 30 }, // 17
  { x: 62, y: 25 }, // 18
  { x: 65, y: 45 }, // 19
  { x: 68, y: 65 }, // 20

  // Automation Zone (sandy desert right)
  { x: 73, y: 55 }, // 21
  { x: 75, y: 30 }, // 22
  { x: 79, y: 25 }, // 23
  { x: 82, y: 45 }, // 24
  { x: 84, y: 65 }, // 25

  // Observability Zone & Capstone (oceanic crystal far right)
  { x: 89, y: 55 }, // 26
  { x: 91, y: 30 }, // 27
  { x: 93, y: 25 }, // 28
  { x: 95, y: 45 }, // 29
  { x: 96, y: 65 }, // 30
  { x: 98, y: 50 }, // 31 (Capstone)
];

// Get zone color for a mission index
function getZoneColor(index) {
  const missionNum = index + 1;
  const zone = zones.find(z => z.missions.includes(missionNum));
  return zone ? zone.color : '#06b6d4';
}

export default function MissionMap({ curriculum, highestUnlockedIndex, activeMissionIndex, onSelectMission, skipIntro, onIntroComplete, hasCompletedGame }) {
  const wrapperRef = useRef(null);
  
  const [hasAcknowledged, setHasAcknowledged] = useState(() => localStorage.getItem('webhook_has_acknowledged_ending') === 'true');
  
  // Intro cinematic phases: 'init' -> 'pan' -> 'zoom-out' -> 'done'
  const [introPhase, setIntroPhase] = useState((activeMissionIndex === null && !skipIntro) ? 'init' : 'done');
  
  // Determine starting transform based on phase
  const [mapTransform, setMapTransform] = useState(() => {
    if (activeMissionIndex === null && !skipIntro) return 'scale(3) translate(-25%, -15%)';
    return 'scale(1) translate(0, 0)';
  });

  // Cinematic sequence logic
  useEffect(() => {
    if (activeMissionIndex !== null || skipIntro) return;
    
    // Start sequence
    const t1 = setTimeout(() => {
      setIntroPhase('pan');
      setMapTransform('scale(2.2) translate(15%, 20%)');
    }, 100);

    const t2 = setTimeout(() => {
      setIntroPhase('zoom-out');
      setMapTransform('scale(1) translate(0%, 0%)');
    }, 6000);

    const t3 = setTimeout(() => {
      setIntroPhase('done');
      if (onIntroComplete) onIntroComplete();
    }, 9500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // Run ONLY once on mount

  // Handle active mission zooming (only when sequence is done)
  useEffect(() => {
    if (introPhase !== 'done') return;
    
    if (activeMissionIndex !== null && activeMissionIndex < missionCoordinates.length) {
      const coord = missionCoordinates[activeMissionIndex];
      const targetX = 50 - coord.x - 12; // shift left for panel
      const targetY = 50 - coord.y;
      setMapTransform(`scale(2.2) translate(${targetX}%, ${targetY}%)`);
    } else {
      setMapTransform('scale(1) translate(0%, 0%)');
    }
  }, [activeMissionIndex, introPhase]);

  // Build SVG path lines — use raw % values matching our coordinate system
  const pathLines = missionCoordinates.slice(0, curriculum.length - 1).map((coord, i) => {
    const next = missionCoordinates[i + 1];
    if (!next) return null;
    const isCompleted = i < highestUnlockedIndex;
    const isUnlocked = i <= highestUnlockedIndex;
    return { x1: coord.x, y1: coord.y, x2: next.x, y2: next.y, isCompleted, isUnlocked };
  });

  // Determine transition timing based on phase
  let transitionStyle = 'transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)';
  if (introPhase === 'pan') transitionStyle = 'transform 6s linear';
  if (introPhase === 'zoom-out') transitionStyle = 'transform 3.5s cubic-bezier(0.2, 0.8, 0.2, 1)';

  // Determine if nodes and UI should be visible
  const isUIVisible = introPhase === 'zoom-out' || introPhase === 'done';
  const isFogHeavy = introPhase === 'init' || introPhase === 'pan';

  return (
    <div className={`interactive-map-wrapper ${activeMissionIndex !== null ? 'sidebar-mode' : ''}`} ref={wrapperRef}>

      {/* Cinematic Fog & Dust Overlay */}
      <div className={`map-fog-overlay ${isFogHeavy ? 'heavy' : 'light'}`}></div>
      <div className="dust-particles"></div>
      <div className={`cinematic-vignette ${introPhase !== 'done' ? 'active' : ''}`}></div>

      {/* Minimal floating header — only shown when no mission active */}
      {activeMissionIndex === null && (
        <div className="map-hud-chip" style={{ opacity: isUIVisible ? 1 : 0, transition: 'opacity 2s ease 1s' }}>
          <span className="hud-dot"></span>
          MISSION CONTROL — SELECT ASSIGNMENT
        </div>
      )}

      {/* Zone Legend */}
      {activeMissionIndex === null && (
        <div className="zone-legend" style={{ opacity: isUIVisible ? 1 : 0, transition: 'opacity 2s ease 1.5s' }}>
          {zones.map(zone => (
            <div key={zone.name} className="zone-legend-item">
              <span className="zone-dot" style={{ background: zone.color, boxShadow: `0 0 6px ${zone.color}` }}></span>
              <span className="zone-label">{zone.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="map-viewport">
        <div className="map-layer" style={{ transform: mapTransform, transition: transitionStyle }}>

          <img src="/mission-map-bg.jpg" alt="Mission Map" className="map-bg-image" />
          
          {/* Dynamic Void Overlay */}
          {highestUnlockedIndex >= 24 && !hasCompletedGame && (
            <div 
              className="void-map-overlay"
              style={{
                background: `radial-gradient(circle at 95% 50%, #000 0%, #000 ${Math.max(0, 70 - (highestUnlockedIndex - 24) * 15)}%, transparent ${Math.max(20, 120 - (highestUnlockedIndex - 24) * 20)}%)`,
                opacity: isUIVisible ? 0.95 : 0,
                transition: 'background 2s ease-in-out, opacity 2s ease 1s'
              }}
            ></div>
          )}

          {/* SVG CONNECTION PATHS — uses viewBox 0 0 100 100 matching CSS % coords */}
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
              return (
                <g key={i}>
                  {/* Base dashed gray path for all */}
                  <line
                    x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.4"
                    strokeDasharray="1 0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Glowing completed/unlocked path overlay */}
                  {line.isUnlocked && (
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

            return (
              <div
                key={mission.id}
                className={`map-node-wrapper ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'is-next' : ''} ${isActive ? 'is-active' : ''} ${isBlurred ? 'is-blurred' : ''}`}
                style={{ 
                  left: `${coord.x}%`, 
                  top: `${coord.y}%`,
                  opacity: isUIVisible ? 1 : 0,
                  transition: `opacity 2s ease ${1.5 + (index * 0.05)}s, transform 0.3s ease`
                }}
                onClick={() => {
                  if (isUnlocked) {
                    const audio = new Audio('/mission-start.webm');
                    audio.volume = 0.3;
                    audio.play();
                    onSelectMission(index);
                  }
                }}
              >
                {/* Pulse ring for current mission */}
                {isNext && <div className="pulse-ring" style={{ borderColor: zoneColor, boxShadow: `0 0 12px ${zoneColor}` }}></div>}

                {/* "YOU ARE HERE" floating label */}
                {isNext && <div className="node-active-label">▶ NEXT MISSION</div>}

                {/* Node icon */}
                <div
                  className="node-icon"
                  style={{
                    borderColor: isCompleted ? '#22c55e' : isNext ? zoneColor : isUnlocked ? zoneColor : 'rgba(255,255,255,0.2)',
                    background: isCompleted
                      ? 'rgba(34,197,94,0.25)'
                      : isNext
                      ? `${zoneColor}44`
                      : isUnlocked
                      ? `${zoneColor}22`
                      : 'rgba(0,0,0,0.55)',
                    boxShadow: isNext ? `0 0 20px ${zoneColor}, 0 0 40px ${zoneColor}55` : isCompleted ? '0 0 12px #22c55e' : isActive ? `0 0 20px ${zoneColor}` : 'none',
                  }}
                >
                  {!isUnlocked
                    ? <Lock size={16} color="rgba(255,255,255,0.35)" />
                    : isCompleted
                    ? <CheckCircle2 size={18} color="#22c55e" />
                    : <Play size={18} color={zoneColor} fill={zoneColor} />
                  }
                </div>

                {/* Permanent number badge */}
                <div className="node-badge" style={{
                  background: isCompleted ? '#22c55e' : isNext ? zoneColor : isUnlocked ? zoneColor : 'rgba(80,80,80,0.8)',
                  color: isUnlocked ? '#000' : 'rgba(255,255,255,0.5)'
                }}>
                  {index + 1}
                </div>

                {/* Hover tooltip with full info */}
                <div className="node-hover-card" style={{ borderColor: zoneColor }}>
                  <div className="hover-card-num" style={{ color: zoneColor }}>MISSION {index + 1}</div>
                  <div className="hover-card-title">{mission.title}</div>
                  <div className="hover-card-status">
                    {!isUnlocked ? '🔒 Locked' : isCompleted ? '✅ Completed' : isNext ? '⭐ Current Mission' : '🔓 Unlocked'}
                  </div>
                </div>
              </div>
            );
          })}
          {/* FINAL POST-GAME SEQUENCE */}
          {hasCompletedGame && activeMissionIndex === null && !hasAcknowledged && (
            <PostGameSequence 
              onComplete={() => {
                setHasAcknowledged(true);
                localStorage.setItem('webhook_has_acknowledged_ending', 'true');
              }} 
            />
          )}

        </div>
      </div>
    </div>
  );
}
