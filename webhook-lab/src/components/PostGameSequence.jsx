import React, { useState, useEffect } from 'react';

export default function PostGameSequence({ onComplete }) {
  // sequence state
  // 0: Initial Map Bloom (3s)
  // 1: UNIT-7 Message (3.5s)
  // 2: Sarah Message 1 (4s)
  // 3: Sarah Message 2 (4s)
  // 4: Celebration Message (Waiting for Acknowledge)
  // 5: Post-Credits Teaser Booting...
  // 6: Post-Credits Teaser Scanning...
  // 7: Post-Credits Teaser Glitch/Warning
  // 8: Post-Credits Teaser Connection Lost
  // 9: Fade out and Complete
  const [seq, setSeq] = useState(0);
  const [terminalLines, setTerminalLines] = useState([]);
  
  useEffect(() => {
    let timer;
    if (seq === 0) {
      // Bloom
      timer = setTimeout(() => setSeq(1), 3000);
    } else if (seq === 1) {
      playBeep();
      timer = setTimeout(() => setSeq(2), 3500);
    } else if (seq === 2) {
      playBeep();
      timer = setTimeout(() => setSeq(3), 4000);
    } else if (seq === 3) {
      playBeep();
      timer = setTimeout(() => setSeq(4), 4000);
    }
    // seq === 4 waits for user click
    return () => clearTimeout(timer);
  }, [seq]);

  useEffect(() => {
    let timer;
    if (seq === 5) {
      // Terminal booting
      timer = setTimeout(() => setSeq(6), 2000);
    } else if (seq === 6) {
      const lines = [
        "Running final system integrity scan...",
        "100%",
        "No active threats detected.",
        "Archiving residual system artifacts...",
        "..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < lines.length) {
          setTerminalLines(prev => prev.includes(lines[i]) ? prev : [...prev, lines[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setSeq(7), 2000);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (seq === 7) {
      // WARNING
      playGlitch();
      timer = setTimeout(() => setSeq(8), 3000);
    } else if (seq === 8) {
      // Connection Lost
      timer = setTimeout(() => setSeq(9), 4000);
    } else if (seq === 9) {
      timer = setTimeout(() => onComplete(), 2000);
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
    a.volume = 0.5;
    a.playbackRate = 1.5;
    a.play().catch(()=>{});
  };

  return (
    <>
      {/* Bloom Effect */}
      {seq === 0 && <div className="map-restore-bloom"></div>}

      {/* NPC Dialogue Overlay */}
      {seq >= 1 && seq <= 4 && (
        <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', maxWidth: '600px' }}>
          
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
      {seq === 4 && (
        <div className="celebration-overlay animate-fade-in" style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(11, 15, 25, 0.95)', border: '2px solid var(--accent-cyan)', padding: '3rem',
          textAlign: 'center', zIndex: 100, boxShadow: '0 0 50px rgba(6, 182, 212, 0.5)',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: 'var(--accent-cyan)', fontSize: '2rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Congratulations.</h2>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '1rem' }}>You didn't just complete a course.</p>
          <p style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '2rem' }}>You restored an entire platform.</p>
          <h3 style={{ color: 'var(--accent-purple)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2.5rem' }}>Welcome, Platform Engineer.</h3>
          
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
            onClick={() => setSeq(5)}
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Post Credits Teaser Overlay */}
      {seq >= 5 && (
        <div className="post-credits-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: '#000', zIndex: 999, padding: '4rem',
          display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: 'monospace',
          opacity: seq === 9 ? 0 : 1, transition: 'opacity 2s ease-in-out'
        }}>
          {/* Scan Text */}
          {seq >= 6 && terminalLines.map((line, i) => (
            <div key={i} style={{ marginBottom: '1rem', color: line === '100%' || line.includes('No active threats') ? '#39ff14' : 'var(--text-muted)', fontSize: '1.2rem' }}>
              {line}
            </div>
          ))}

          {/* Warning Block */}
          {seq >= 7 && (
            <div style={{ marginTop: '2rem', color: '#ff003c', fontSize: '1.2rem' }}>
              <div className="animate-jitter" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>WARNING</div>
              <div>Unknown process detected.</div>
              <div>Status: Dormant</div>
              <div>Location: Unknown</div>
            </div>
          )}

          {/* Mini Singularity Glitch */}
          {seq === 7 && (
            <div className="mini-singularity-glitch" style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '100px', height: '100px', background: '#000', borderRadius: '50%',
              boxShadow: '0 0 50px #ff003c, inset 0 0 20px #fff',
              animation: 'jitter 0.1s infinite', zIndex: 1000
            }}></div>
          )}

          {/* Connection Lost */}
          {seq >= 8 && (
            <div className="animate-fade-in" style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              color: '#fff', fontSize: '2rem', fontWeight: 'bold'
            }}>
              Connection Lost...
            </div>
          )}
        </div>
      )}
    </>
  );
}
