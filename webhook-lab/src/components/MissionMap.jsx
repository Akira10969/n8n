import React, { useRef, useState, useEffect } from 'react';
import { Lock, CheckCircle2, Play } from 'lucide-react';
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
// These snake through the biome map zones top-to-bottom.
const missionCoordinates = [
  // Foundation Zone (top-left forest island) — missions snake right then down
  { x: 22, y: 8  }, // 1
  { x: 32, y: 10 }, // 2
  { x: 40, y: 8  }, // 3
  { x: 50, y: 10 }, // 4
  { x: 58, y: 8  }, // 5

  // Infrastructure Zone (snowy island top-right)
  { x: 68, y: 14 }, // 6
  { x: 75, y: 20 }, // 7
  { x: 70, y: 27 }, // 8
  { x: 60, y: 30 }, // 9
  { x: 52, y: 26 }, // 10

  // Cloud Zone (purple mystical center)
  { x: 42, y: 30 }, // 11
  { x: 33, y: 34 }, // 12
  { x: 28, y: 40 }, // 13
  { x: 35, y: 46 }, // 14
  { x: 44, y: 48 }, // 15

  // Security Zone (volcanic red lower-left)
  { x: 54, y: 44 }, // 16
  { x: 62, y: 48 }, // 17
  { x: 70, y: 52 }, // 18
  { x: 65, y: 58 }, // 19
  { x: 55, y: 60 }, // 20

  // Automation Zone (sandy desert center-right)
  { x: 46, y: 60 }, // 21
  { x: 37, y: 62 }, // 22
  { x: 28, y: 66 }, // 23
  { x: 35, y: 72 }, // 24
  { x: 44, y: 74 }, // 25

  // Observability Zone (oceanic islands lower)
  { x: 54, y: 72 }, // 26
  { x: 63, y: 74 }, // 27
  { x: 70, y: 78 }, // 28
  { x: 63, y: 84 }, // 29
  { x: 54, y: 88 }, // 30

  // Capstone (golden temple — bottom center)
  { x: 42, y: 92 }, // 31
];

// Get zone color for a mission index
function getZoneColor(index) {
  const missionNum = index + 1;
  const zone = zones.find(z => z.missions.includes(missionNum));
  return zone ? zone.color : '#06b6d4';
}

export default function MissionMap({ curriculum, highestUnlockedIndex, activeMissionIndex, onSelectMission }) {
  const wrapperRef = useRef(null);
  const [mapTransform, setMapTransform] = useState('scale(1) translate(0,0)');

  // Pan + zoom to selected mission
  useEffect(() => {
    if (activeMissionIndex !== null && activeMissionIndex < missionCoordinates.length) {
      const coord = missionCoordinates[activeMissionIndex];
      const targetX = 50 - coord.x - 12; // shift left for panel
      const targetY = 50 - coord.y;
      setMapTransform(`scale(2.2) translate(${targetX}%, ${targetY}%)`);
    } else {
      setMapTransform('scale(1) translate(0,0)');
    }
  }, [activeMissionIndex]);

  // Build SVG path lines — use raw % values matching our coordinate system
  const pathLines = missionCoordinates.slice(0, curriculum.length - 1).map((coord, i) => {
    const next = missionCoordinates[i + 1];
    if (!next) return null;
    const isCompleted = i < highestUnlockedIndex;
    const isUnlocked = i <= highestUnlockedIndex;
    return { x1: coord.x, y1: coord.y, x2: next.x, y2: next.y, isCompleted, isUnlocked };
  });

  return (
    <div className={`interactive-map-wrapper ${activeMissionIndex !== null ? 'sidebar-mode' : ''}`} ref={wrapperRef}>

      {/* Minimal floating header — only shown when no mission active */}
      {activeMissionIndex === null && (
        <div className="map-hud-chip animate-fade-in">
          <span className="hud-dot"></span>
          MISSION CONTROL — SELECT ASSIGNMENT
        </div>
      )}

      {/* Zone Legend */}
      {activeMissionIndex === null && (
        <div className="zone-legend animate-fade-in">
          {zones.map(zone => (
            <div key={zone.name} className="zone-legend-item">
              <span className="zone-dot" style={{ background: zone.color, boxShadow: `0 0 6px ${zone.color}` }}></span>
              <span className="zone-label">{zone.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="map-viewport">
        <div className="map-layer" ref={mapLayerRef} style={{ transform: mapTransform }}>

          <img src="/mission-map-bg.jpg" alt="Mission Map" className="map-bg-image" />

          {/* SVG CONNECTION PATHS — uses viewBox 0 0 100 100 matching CSS % coords */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 3, overflow: 'visible'
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
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                onClick={() => isUnlocked && onSelectMission(index)}
              >
                {/* Pulse ring for current mission */}
                {isNext && <div className="pulse-ring" style={{ borderColor: zoneColor, boxShadow: `0 0 10px ${zoneColor}` }}></div>}

                {/* Node icon */}
                <div
                  className="node-icon"
                  style={{
                    borderColor: isCompleted ? '#22c55e' : isNext ? zoneColor : isUnlocked ? zoneColor : 'rgba(255,255,255,0.2)',
                    background: isCompleted
                      ? 'rgba(34,197,94,0.2)'
                      : isNext
                      ? `rgba(6,182,212,0.3)`
                      : isUnlocked
                      ? `rgba(6,182,212,0.15)`
                      : 'rgba(0,0,0,0.4)',
                    boxShadow: (isNext || isActive) ? `0 0 16px ${zoneColor}` : isCompleted ? '0 0 10px #22c55e' : 'none',
                  }}
                >
                  {!isUnlocked
                    ? <Lock size={12} color="rgba(255,255,255,0.3)" />
                    : isCompleted
                    ? <CheckCircle2 size={12} color="#22c55e" />
                    : <Play size={12} color={zoneColor} fill={zoneColor} />
                  }
                </div>

                {/* Permanent number badge */}
                <div className="node-badge" style={{ background: isCompleted ? '#22c55e' : isNext ? zoneColor : isUnlocked ? zoneColor : 'rgba(255,255,255,0.2)' }}>
                  {index + 1}
                </div>

                {/* Hover tooltip with full info */}
                <div className="node-hover-card" style={{ borderColor: zoneColor }}>
                  <div className="hover-card-num" style={{ color: zoneColor }}>MISSION {index + 1}</div>
                  <div className="hover-card-title">{mission.title}</div>
                  <div className="hover-card-status">
                    {!isUnlocked ? '🔒 Locked' : isCompleted ? '✅ Completed' : isNext ? '⭐ Active' : '🔓 Unlocked'}
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
