import React from 'react';
import { Lock, CheckCircle2, Play, BookOpen } from 'lucide-react';
import './MissionMap.css';

export default function MissionMap({ curriculum, highestUnlockedIndex, activeMissionIndex, onSelectMission }) {
  return (
    <div className={`mission-map-container animate-fade-in ${activeMissionIndex !== null ? 'sidebar-mode' : ''}`}>
      {activeMissionIndex === null && (
        <div className="map-header">
          <h1>Mission Control</h1>
          <p>Select your next assignment.</p>
        </div>
      )}
      
      <div className="map-grid">
        {curriculum.map((mission, index) => {
          const isUnlocked = index <= highestUnlockedIndex;
          const isCompleted = index < highestUnlockedIndex;
          const isNext = index === highestUnlockedIndex;
          const isActive = index === activeMissionIndex;
          const isBlurred = activeMissionIndex !== null && !isActive;

          return (
            <div key={mission.id} className={`map-node ${isUnlocked ? 'unlocked' : 'locked'} ${isNext ? 'next-mission' : ''} ${isActive ? 'active-mission' : ''} ${isBlurred ? 'blurred-mission' : ''}`}>
              <div className="node-connector"></div>
              <button 
                className="mission-card glass-panel"
                onClick={() => onSelectMission(index)}
                disabled={!isUnlocked}
              >
                <div className="mission-icon">
                  {!isUnlocked ? (
                    <Lock size={24} color="var(--text-muted)" />
                  ) : isCompleted ? (
                    <CheckCircle2 size={24} color="var(--accent-green)" />
                  ) : (
                    <Play size={24} color="var(--accent-cyan)" fill="var(--accent-cyan)" />
                  )}
                </div>
                
                <div className="mission-info">
                  <div className="mission-number">Mission {index + 1}</div>
                  <h3 className="mission-title">{mission.title}</h3>
                  <div className="mission-type">
                    {mission.type === 'lab' ? '🛠 Hands-On Lab' : mission.type === 'visual-flow' ? '👁 Visual Simulator' : '📖 Theory Briefing'}
                  </div>
                </div>

                {isNext && (
                  <div className="pulse-indicator"></div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
