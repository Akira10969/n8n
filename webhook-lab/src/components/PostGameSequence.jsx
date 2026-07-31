import React, { useState, useEffect } from 'react';

export default function PostGameSequence({ onComplete }) {
  // sequence state
  // 0: Initial Map Bloom (3s)
  // 1: UNIT-7 Message (5s)
  // 2: Sarah Message 1 (5s)
  // 3: Sarah Message 2 (6s)
  // 4: Pause (2s)
  // 5: Celebration Message (Waiting for Acknowledge)
  // 6: Player regains control, enjoying peaceful map (10s delay)
  // 7: Mini singularity blinks in, UNIT-7 terminal slides in
  // 8: UNIT-7 scanning lines appear
  // 9: Anomaly detected, Monitoring...
  // 10: Singularity disappears, Threat level Minimal, complete.
  const [seq, setSeq] = useState(0);
  const [terminalLines, setTerminalLines] = useState([]);
  const [isInteractive, setIsInteractive] = useState(false);
  
  useEffect(() => {
    let timer;
    if (seq === 0) {
      // Bloom
      timer = setTimeout(() => setSeq(1), 3000);
    } else if (seq === 1) {
      playBeep();
      timer = setTimeout(() => setSeq(2), 5000);
    } else if (seq === 2) {
      playBeep();
      timer = setTimeout(() => setSeq(3), 5000);
    } else if (seq === 3) {
      playBeep();
      timer = setTimeout(() => setSeq(4), 6000);
    } else if (seq === 4) {
      // Pause
      timer = setTimeout(() => setSeq(5), 2000);
    } else if (seq === 6) {
      // 10s of peace before the anomaly hits
      setIsInteractive(true);
      timer = setTimeout(() => setSeq(7), 10000);
    } else if (seq === 7) {
      playGlitch();
      timer = setTimeout(() => setSeq(8), 2000);
    } else if (seq === 8) {
      const lines = [
        "Running final integrity scan...",
        "100%",
        "No active threats detected.",
        "...",
        "Analyzing archived sectors...",
        "..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < lines.length) {
          setTerminalLines(prev => prev.includes(lines[i]) ? prev : [...prev, lines[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setSeq(9), 1000);
        }
      }, 800);
      return () => clearInterval(interval);
    } else if (seq === 9) {
      // Show anomaly detected
      timer = setTimeout(() => setSeq(10), 4000);
    } else if (seq === 10) {
      // Singularity vanishes, Threat Minimal
      timer = setTimeout(() => {
        setSeq(11);
        setTimeout(() => onComplete(), 1000);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [seq, onComplete]);

  const playBeep = () => {
    const a = new Audio('/mission-start.webm');
    a.volume = 0.2;
    a.play().catch(()=>{});
  };

  const playGlitch = () => {
    const a = new Audio('/error.webm');
    a.volume = 0.1;
    a.playbackRate = 1.5;
    a.play().catch(()=>{});
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: isInteractive ? 'none' : 'auto', zIndex: 100 }}>
      {/* Bloom Effect */}
      {seq === 0 && <div className="map-restore-bloom"></div>}

      {/* NPC Dialogue Overlay */}
      {seq >= 1 && seq <= 3 && (
        <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', maxWidth: '600px', pointerEvents: 'none' }}>
          
          <div className="npc-message animate-fade-in" style={{ opacity: seq >= 1 ? 1 : 0, transition: 'opacity 0.5s', background: 'rgba(11, 15, 25, 0.9)', borderLeft: '4px solid #0ea5e9', padding: '1rem', borderRadius: '4px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: '#0ea5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>U7</div>
            <div>
              <div style={{ color: '#0ea5e9', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>UNIT-7 [NOC-BOT]</div>
              <div style={{ color: 'var(--text-main)' }}>SYSTEM DIAGNOSTIC COMPLETE. ALL REGIONS ONLINE. NO CRITICAL ALERTS. Thank you, Operator.</div>
            </div>
          </div>

          <div className="npc-message animate-fade-in" style={{ opacity: seq >= 2 ? 1 : 0, transition: 'opacity 0.5s', background: 'rgba(11, 15, 25, 0.9)', borderLeft: '4px solid #8b5cf6', padding: '1rem', borderRadius: '4px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: '#8b5cf6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SH</div>
            <div>
              <div style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>SARAH [SENIOR ENGINEER]</div>
              <div style={{ color: 'var(--text-main)' }}>You actually did it... The Void is completely purged. MEI_Cloud_OS is running perfectly.</div>
            </div>
          </div>

          <div className="npc-message animate-fade-in" style={{ opacity: seq >= 3 ? 1 : 0, transition: 'opacity 0.5s', background: 'rgba(11, 15, 25, 0.9)', borderLeft: '4px solid #8b5cf6', padding: '1rem', borderRadius: '4px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', background: 'transparent' }}></div>
            <div>
              <div style={{ color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>SARAH [SENIOR ENGINEER]</div>
              <div style={{ color: 'var(--text-main)' }}>We're receiving stable telemetry from all biomes. The network is secure. You've earned this.</div>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Screen */}
      {seq === 5 && (
        <div className="celebration-overlay animate-fade-in" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(11, 15, 25, 0.95)', border: '2px solid var(--accent-cyan)', padding: '3rem',
          textAlign: 'center', zIndex: 100, boxShadow: '0 0 50px rgba(6, 182, 212, 0.5)',
          borderRadius: '8px', pointerEvents: 'auto'
        }}>
          <h2 style={{ color: 'var(--accent-cyan)', fontSize: '2rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Congratulations.</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '1rem' }}>You didn't just complete a course.</p>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '2rem' }}>You restored an entire platform.</p>
          <h3 style={{ color: 'var(--accent-purple)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2.5rem' }}>Welcome, Platform Engineer.</h3>
          
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
            onClick={() => {
              // Trigger the peaceful map phase
              setSeq(6);
            }}
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Map Integrated Teaser UI */}
      {seq >= 7 && seq <= 10 && (
        <>
          {/* Mini Singularity Glitch on Map */}
          {seq < 10 && (
            <div className="mini-singularity-glitch animate-fade-in" style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '40px', height: '40px', background: '#000', borderRadius: '50%',
              boxShadow: '0 0 20px #ff003c, inset 0 0 10px #fff',
              animation: 'jitter 0.1s infinite', zIndex: 10,
              pointerEvents: 'none'
            }}></div>
          )}

          {/* UNIT-7 Scanning Terminal */}
          <div className="post-credits-terminal animate-scale-up-center" style={{
            position: 'absolute', top: '50%', left: '50%', width: '350px',
            background: 'rgba(11, 15, 25, 0.85)', border: '1px solid #0ea5e9',
            borderRadius: '4px', padding: '1rem', fontFamily: 'monospace',
            color: '#0ea5e9', fontSize: '0.85rem', zIndex: 100, pointerEvents: 'none',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.3)'
          }}>
            <div style={{ borderBottom: '1px solid #0ea5e9', paddingBottom: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              UNIT-7 [AUTO-SCAN]
            </div>

            {/* Scan Text */}
            {seq >= 8 && terminalLines.map((line, i) => (
              <div key={i} style={{ marginBottom: '0.5rem', color: line.includes('100%') || line.includes('No active threats') ? '#22c55e' : 'var(--text-muted)' }}>
                {line}
              </div>
            ))}

            {/* Warning Block */}
            {seq >= 9 && (
              <div style={{ marginTop: '1rem', color: '#ff003c' }}>
                <div style={{ fontWeight: 'bold' }}>Unknown anomaly detected.</div>
                <div>Status: Dormant</div>
                {seq === 9 && <div className="animate-pulse" style={{ marginTop: '0.5rem' }}>Monitoring...</div>}
              </div>
            )}

            {/* Final Status */}
            {seq >= 10 && (
              <div className="animate-fade-in" style={{ marginTop: '1rem', color: '#22c55e', fontWeight: 'bold', borderTop: '1px dashed #22c55e', paddingTop: '1rem' }}>
                <div>Threat level: Minimal</div>
                <div>Continuous monitoring enabled.</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
