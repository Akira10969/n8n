import React, { useState, useEffect } from 'react';
import { Database, Webhook, Cloud, Server, Lock } from 'lucide-react';

export default function GameEnding({ onEndingComplete, xp }) {
  const [phase, setPhase] = useState(0);
  
  // Phase 0: Singularity collapse
  // Phase 1: Explosion (white screen)
  // Phase 2: System Dashboard
  // Phase 3: Certificate
  // Phase 4: Post-Credits Anomaly

  const [metrics, setMetrics] = useState([]);
  const [anomalyVisible, setAnomalyVisible] = useState(false);

  useEffect(() => {
    if (phase === 0) {
      document.body.classList.add('void-active');
      const timer = setTimeout(() => setPhase(1), 5000);
      return () => clearTimeout(timer);
    } else if (phase === 1) {
      document.body.classList.remove('void-active');
      const timer = setTimeout(() => setPhase(2), 2000);
      return () => clearTimeout(timer);
    } else if (phase === 2) {
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
      
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine < metricLines.length) {
          setMetrics(prev => [...prev, metricLines[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase(3), 4000);
        }
      }, 800);
      return () => clearInterval(interval);
    } else if (phase === 3) {
      const timer = setTimeout(() => {
        setAnomalyVisible(true);
        setTimeout(() => {
          setAnomalyVisible(false);
          setTimeout(() => onEndingComplete(), 3000);
        }, 4000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [phase, onEndingComplete]);

  return (
    <div className="game-ending-container" style={{ background: phase === 1 ? '#fff' : '#050002' }}>
      
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
                  animationDelay: `${Math.random()}s`
                }}
              >
                <Icon size={32} />
              </div>
            );
          })}
        </div>
      )}

      {phase === 1 && (
        <div className="flashbang"></div>
      )}

      {phase === 2 && (
        <div className="system-dashboard terminal-simulator" style={{ width: '80%', maxWidth: '800px', margin: 'auto', border: '1px solid var(--accent-cyan)' }}>
          <div className="terminal-header" style={{ borderBottom: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
            MEI_Cloud_OS // Final_Status.sh
          </div>
          <div className="terminal-body" style={{ padding: '2rem', fontSize: '1.2rem', lineHeight: '2' }}>
            {metrics.map((line, i) => (
              <div key={i} style={{ color: line.includes('100%') || line.includes('HEALTHY') || line.includes('ACTIVE') || line.includes('0%') ? '#39ff14' : 'var(--text-main)' }}>
                {line}
              </div>
            ))}
            {metrics.length < 8 && <span className="blinking-cursor">█</span>}
          </div>
        </div>
      )}

      {phase === 3 && (
        <div className="certificate-container animate-fade-in" style={{ textAlign: 'center' }}>
          <div className="certificate" style={{ border: '2px solid var(--accent-purple)', padding: '4rem', background: 'rgba(139, 92, 246, 0.1)', boxShadow: '0 0 50px rgba(139, 92, 246, 0.3)' }}>
            <h1 style={{ color: 'var(--accent-cyan)', fontSize: '3rem', marginBottom: '1rem', textShadow: '0 0 20px var(--accent-cyan)' }}>MEI Certified Platform Engineer</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>This certifies that you have successfully restored MEI_Cloud_OS.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>
              <div><strong>FINAL XP:</strong> {xp}</div>
              <div><strong>STATUS:</strong> LEGENDARY</div>
            </div>
          </div>
          
          {anomalyVisible && (
            <div className="post-credits-anomaly" style={{ position: 'absolute', bottom: '20px', right: '20px', textAlign: 'right', color: '#ff003c', fontSize: '0.8rem', fontFamily: 'monospace', opacity: 0.8, animation: 'jitter-mild 0.2s infinite' }}>
              <div>[SYSTEM_WARN]</div>
              <div>Unknown archived process detected.</div>
              <div>Status: Dormant</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
