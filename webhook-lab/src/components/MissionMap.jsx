import React, { useRef, useEffect, useState } from 'react';
import { Lock, CheckCircle2, Play, BookOpen } from 'lucide-react';
import './MissionMap.css';

// Approximate coordinates based on the uploaded isometric map image.
// You can adjust these percentages to perfectly align the glowing nodes to the image.
const missionCoordinates = [
  { top: '10%', left: '78%' }, // 1
  { top: '14%', left: '65%' }, // 2
  { top: '13%', left: '52%' }, // 3
  { top: '13%', left: '41%' }, // 4
  { top: '14%', left: '26%' }, // 5

  { top: '24%', left: '24%' }, // 6
  { top: '25%', left: '39%' }, // 7
  { top: '25%', left: '51%' }, // 8
  { top: '26%', left: '63%' }, // 9
  { top: '26%', left: '77%' }, // 10

  { top: '36%', left: '77%' }, // 11
  { top: '36%', left: '41%' }, // 12
  { top: '36%', left: '52%' }, // 13
  { top: '36%', left: '63%' }, // 14
  { top: '37%', left: '26%' }, // 15

  { top: '53%', left: '23%' }, // 16
  { top: '52%', left: '39%' }, // 17
  { top: '51%', left: '51%' }, // 18
  { top: '51%', left: '64%' }, // 19
  { top: '52%', left: '78%' }, // 20

  { top: '65%', left: '24%' }, // 21
  { top: '65%', left: '38%' }, // 22
  { top: '64%', left: '51%' }, // 23
  { top: '64%', left: '64%' }, // 24
  { top: '63%', left: '78%' }, // 25

  { top: '75%', left: '23%' }, // 26
  { top: '76%', left: '38%' }, // 27
  { top: '77%', left: '51%' }, // 28
  { top: '78%', left: '64%' }, // 29
  { top: '79%', left: '79%' }, // 30

  { top: '88%', left: '51%' }  // 31
];

export default function MissionMap({ curriculum, highestUnlockedIndex, activeMissionIndex, onSelectMission }) {
  const mapRef = useRef(null);
  const [mapTransform, setMapTransform] = useState('scale(1) translate(0, 0)');

  useEffect(() => {
    // Zoom logic
    if (activeMissionIndex !== null && activeMissionIndex < missionCoordinates.length) {
      const coord = missionCoordinates[activeMissionIndex];
      // Calculate transform to center the node, slightly shifted left to accommodate the sidebar
      const xPos = parseFloat(coord.left);
      const yPos = parseFloat(coord.top);
      
      // Shift 15% left because the sidebar takes up the right space
      const targetX = 50 - xPos - 15; 
      const targetY = 50 - yPos;

      setMapTransform(`scale(2) translate(${targetX}%, ${targetY}%)`);
    } else {
      setMapTransform('scale(1) translate(0, 0)');
    }
  }, [activeMissionIndex]);

  return (
    <div className={`interactive-map-wrapper ${activeMissionIndex !== null ? 'sidebar-mode' : ''}`}>
      
      {activeMissionIndex === null && (
        <div className="map-overlay-header animate-fade-in">
          <h1>Mission Control</h1>
          <p>Select your next assignment.</p>
        </div>
      )}

      <div className="map-viewport">
        <div 
          className="map-layer" 
          ref={mapRef}
          style={{ transform: mapTransform }}
        >
          <img src="/mission-map-bg.jpg" alt="Mission Map Background" className="map-bg-image" />
          
          {curriculum.map((mission, index) => {
            const isUnlocked = index <= highestUnlockedIndex;
            const isCompleted = index < highestUnlockedIndex;
            const isNext = index === highestUnlockedIndex;
            const isActive = index === activeMissionIndex;
            const isBlurred = activeMissionIndex !== null && !isActive;

            // Safe fallback if curriculum is larger than our coordinates
            const coord = missionCoordinates[index] || { top: '50%', left: '50%' };

            return (
              <div 
                key={mission.id} 
                className={`map-interactive-node ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'next-mission' : ''} ${isActive ? 'active-mission' : ''} ${isBlurred ? 'blurred-mission' : ''}`}
                style={{ top: coord.top, left: coord.left }}
                onClick={() => isUnlocked && onSelectMission(index)}
              >
                <div className="node-tooltip">
                  <div className="tooltip-number">Mission {index + 1}</div>
                  <div className="tooltip-title">{mission.title}</div>
                </div>

                <div className="mission-node-icon">
                  {!isUnlocked ? (
                    <Lock size={16} />
                  ) : isCompleted ? (
                    <CheckCircle2 size={16} color="var(--accent-green)" />
                  ) : (
                    <Play size={16} color="var(--accent-cyan)" fill="var(--accent-cyan)" />
                  )}
                </div>

                {isNext && <div className="node-pulse"></div>}
                
                {/* Visual debug/target indicator - can be removed later */}
                <div className="node-center-dot"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
