import React, { useEffect, useState } from 'react';
import './EpisodeCard.css';

export default function EpisodeCard({ mission, missionIndex, onComplete }) {
  const [phase, setPhase] = useState('fade-in');

  useEffect(() => {
    // Hold the card on screen, then fade it out and complete
    const t1 = setTimeout(() => {
      setPhase('fade-out');
    }, 3500); // Wait 3.5 seconds before fading out

    const t2 = setTimeout(() => {
      onComplete();
    }, 4500); // 1s for fade out transition

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  // Use mission.episodeNumber if available, fallback to missionIndex
  const episodeNum = mission.episodeNumber || (missionIndex + 1);
  const duration = mission.duration || '15 minutes';
  const difficulty = mission.difficulty || '★★☆☆☆';
  const location = mission.location || 'Foundation Zone';

  return (
    <div className={`episode-card-container ${phase}`}>
      <div className="episode-card-content">
        <div className="ec-border-top">══════════════════════════════════════</div>
        <h2 className="ec-subtitle">EPISODE {episodeNum}</h2>
        <h1 className="ec-title">{mission.title.toUpperCase().replace(/^LEVEL \\d+ – /, '')}</h1>
        
        <div className="ec-metadata">
          <div className="ec-meta-item">
            <span className="ec-meta-label">Duration:</span>
            <span className="ec-meta-value">{duration}</span>
          </div>
          <div className="ec-meta-item">
            <span className="ec-meta-label">Difficulty:</span>
            <span className="ec-meta-value">{difficulty}</span>
          </div>
          <div className="ec-meta-item">
            <span className="ec-meta-label">Location:</span>
            <span className="ec-meta-value">{location}</span>
          </div>
        </div>
        <div className="ec-border-bottom">══════════════════════════════════════</div>
      </div>
    </div>
  );
}
