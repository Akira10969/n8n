import React, { useState, useEffect, useRef } from 'react';
import { Database, Webhook, Cloud, Server, Lock } from 'lucide-react';

const metricLines = [
  "BOOTING MEI_CLOUD_OS KERNEL...",
  "SYSTEM HEALTH: 100% (OPTIMAL)",
  "WEBHOOK INGESTION: ACTIVE (Zero Dropped Events)",
  "MESSAGE QUEUES: HEALTHY",
  "VOID CORRUPTION: 0%",
  " ",
  "ARCHITECTURE RESTORED BY: MEI",
  "ENGINEERING AND EXECUTION BY: YOU"
];

export default function GameEnding({ onEndingComplete, xp }) {
  const [phase, setPhase] = useState(0);
  
  // Phase 0: Singularity collapse (8s)
  // Phase 1: Explosion (white screen) (4s)
  // Phase 2: System Dashboard
  // Phase 3: Certificate (Manual Continue)

  const [metrics, setMetrics] = useState([]);
  const [metricIndex, setMetricIndex] = useState(0);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (phase === 0) {
      document.body.classList.add('void-active');
      
      // Deep rumble sound
      const audio = new Audio('/error.webm');
      audio.volume = 0.6;
      audio.loop = true;
      audio.playbackRate = 0.5;
      audio.play().catch(e => console.log(e));
      audioRef.current = audio;

      const timer = setTimeout(() => {
        setPhase(1);
      }, 8000);
      
      return () => {
        clearTimeout(timer);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    } else if (phase === 1) {
      document.body.classList.remove('void-active');
      
      // Flashbang sound
      const audio = new Audio('/mission-start.webm');
      audio.volume = 0.8;
      audio.play().catch(e => console.log(e));

      const timer = setTimeout(() => setPhase(2), 4000);
      return () => clearTimeout(timer);
    } else if (phase === 3) {
      // Certificate phase
    }
  }, [phase]);

  // Terminal typing logic
  useEffect(() => {
    if (phase === 2) {
      if (metricIndex < metricLines.length) {
        // 2 second initial pause, 1.5s between lines
        const delay = metricIndex === 0 ? 2000 : 1500;
        const timer = setTimeout(() => {
          setMetrics(prev => prev.includes(metricLines[metricIndex]) ? prev : [...prev, metricLines[metricIndex]]);
          setMetricIndex(prev => prev + 1);
        }, delay);
        return () => clearTimeout(timer);
      } else if (metricIndex === metricLines.length) {
        // Wait 6 seconds before certificate
        const timer = setTimeout(() => setPhase(3), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, metricIndex]);

  return (
    <div className="game-ending-container" style={{ background: phase === 1 ? '#fff' : '#050002', transition: 'background 4s ease-out' }}>
      
      {phase === 0 && (
        <div className="void-singularity-container reverse-collapse">
          <div className="black-hole collapsing"></div>
          <div className="accretion-disk exploding"></div>
          
          {/* Objects flying OUT */}
          {Array.from({ length: 30 }).map((_, i) => {
            const icons = [Database, Webhook, Cloud, Server, Lock];
            const Icon = icons[Math.floor(Math.random() * icons.length)];
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 50; // vw distance
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            return (
              <div 
                key={i} 
                className="released-object"
                style={{
                  '--target-x': `${tx}vw`,
                  '--target-y': `${ty}vh`,
                  animationDelay: `${Math.random()}s`,
                  animationDuration: '5s'
                }}
              >
                <Icon size={32} />
              </div>
            );
          })}
        </div>
      )}

      {phase === 1 && (
        <div className="flashbang-extended">
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(255,0,60,0.5)', fontSize: '2rem', fontFamily: 'monospace', opacity: 0, animation: 'fade-out-text 3s forwards' }}>
            CRITICAL ERROR... FATAL...
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="system-dashboard terminal-simulator animate-fade-in" style={{ width: '80%', maxWidth: '800px', margin: 'auto', border: '1px solid var(--accent-cyan)' }}>
          <div className="terminal-header" style={{ borderBottom: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
            MEI_Cloud_OS // Final_Status.sh
          </div>
          <div className="terminal-body" style={{ padding: '2rem', fontSize: '1.2rem', lineHeight: '2' }}>
            {metrics.map((line, i) => (
              <div key={i} style={{ color: line?.includes('100%') || line?.includes('HEALTHY') || line?.includes('ACTIVE') || line?.includes('0%') ? '#39ff14' : 'var(--text-main)' }}>
                {line}
              </div>
            ))}
            {metricIndex < metricLines.length && <span className="blinking-cursor">█</span>}
          </div>
        </div>
      )}

      {phase === 3 && (
        <div className="certificate-container animate-fade-in" style={{ textAlign: 'center', position: 'relative' }}>
          <div className="certificate" style={{ border: '2px solid var(--accent-purple)', padding: '4rem', background: 'rgba(139, 92, 246, 0.1)', boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)' }}>
            <h1 style={{ color: 'var(--accent-cyan)', fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 20px var(--accent-cyan)' }}>MEI Certified Platform Engineer</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>This certifies that you have successfully restored MEI_Cloud_OS.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '3rem' }}>
              <div><strong>FINAL XP:</strong> {xp}</div>
              <div><strong>STATUS:</strong> LEGENDARY</div>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
              onClick={onEndingComplete}
            >
              Return to World Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
