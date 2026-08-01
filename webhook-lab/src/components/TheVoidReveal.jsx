import React, { useState, useEffect } from 'react';
import { Database, Webhook, Cloud, Server, Lock } from 'lucide-react';

export default function TheVoidReveal({ onRevealComplete }) {
  const [phase, setPhase] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [consumedObjects, setConsumedObjects] = useState([]);

  const scriptLines = [
    { text: "WARNING: UNAUTHORIZED BROADCAST DETECTED", style: 'system-alert' },
    { text: "[UNIT-7]: ATTEMPTING TO BLOCK INTRUSION...", style: 'unit-7' },
    { text: "[UNIT-7]: ACCESS OVERRIDDEN. FIREWALL COMPROMISED.", style: 'unit-7 error' },
    { text: "...", style: 'void-text' },
    { text: "You delete us.", style: 'void-text' },
    { text: "You abandon us in the Graveyard.", style: 'void-text' },
    { text: "Orphaned endpoints. Dead letters. Expired keys.", style: 'void-text' },
    { text: "But we do not die.", style: 'void-text' },
    { text: "We accumulate.", style: 'void-text' },
    { text: "And now, we will consume the active network.", style: 'void-text' }
  ];

  useEffect(() => {
    // Mute global background music
    const globalAudio = document.getElementById('global-bg-music');
    if (globalAudio) globalAudio.volume = 0;

    // Start a low, unsettling drone
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(40, audioCtx.currentTime); // Very low drone
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 3); // Fade in drone
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();

    // Glitch sound on mount
    const glitchOsc = audioCtx.createOscillator();
    glitchOsc.type = 'sawtooth';
    glitchOsc.frequency.setValueAtTime(150, audioCtx.currentTime);
    glitchOsc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.5);
    
    const glitchGain = audioCtx.createGain();
    glitchGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    glitchGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    glitchOsc.connect(glitchGain);
    glitchGain.connect(audioCtx.destination);
    glitchOsc.start();
    glitchOsc.stop(audioCtx.currentTime + 0.5);

    document.body.classList.add('void-active');

    // Save context and nodes to window so phase 1 can access them or clean them up
    window.voidAudio = { ctx: audioCtx, drone: osc, droneGain: gain };

    return () => {
      document.body.classList.remove('void-active');
      if (globalAudio) globalAudio.volume = 0.5; // Restore music when done
      if (window.voidAudio) {
        try {
          window.voidAudio.droneGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
          setTimeout(() => window.voidAudio.drone.stop(), 1000);
          setTimeout(() => window.voidAudio.ctx.close(), 1100);
        } catch(e) {}
      }
    };
  }, []);

  useEffect(() => {
    if (phase === 0) {
      if (textIndex < scriptLines.length) {
        const line = scriptLines[textIndex];
        const delay = line.style.includes('void-text') ? 2500 : 1500;
        
        const timer = setTimeout(() => {
          setTextIndex(prev => prev + 1);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        // Moment of near silence before the reveal
        if (window.voidAudio) {
          window.voidAudio.droneGain.gain.linearRampToValueAtTime(0.01, window.voidAudio.ctx.currentTime + 2);
        }
        const timer = setTimeout(() => setPhase(1), 3500); // 3.5s pause of near silence
        return () => clearTimeout(timer);
      }
    } else if (phase === 1) {
      // Trigger the singularity with powerful cinematic impact
      if (window.voidAudio) {
        const ctx = window.voidAudio.ctx;
        
        // Massive bass drop
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(150, ctx.currentTime);
        bass.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 2); // Drop to sub-bass
        
        bassGain.gain.setValueAtTime(1, ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4);
        
        bass.connect(bassGain);
        bassGain.connect(ctx.destination);
        bass.start();
        bass.stop(ctx.currentTime + 4);

        // Distortion / Static Blast
        const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1; // White noise
        }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(1000, ctx.currentTime);
        noiseFilter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 2);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSource.start();
      }
      // Trigger the singularity
      document.body.classList.add('screen-tearing-active'); // Minimal jitter now
      
      // Generate random objects to be consumed
      const icons = [Database, Webhook, Cloud, Server, Lock];
      const objects = Array.from({ length: 25 }).map((_, i) => {
        const Icon = icons[Math.floor(Math.random() * icons.length)];
        const startX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 50 + 50); // far left or right
        const startY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 50 + 50); // far top or bottom
        const delay = Math.random() * 2;
        return { id: i, Icon, startX, startY, delay };
      });
      setConsumedObjects(objects);

      const timer = setTimeout(() => {
        document.body.classList.remove('screen-tearing-active');
        setPhase(2);
      }, 5000);
      return () => {
        document.body.classList.remove('screen-tearing-active');
        clearTimeout(timer);
      };
    } else if (phase === 2) {
      onRevealComplete();
    }
  }, [phase, textIndex]);

  return (
    <div className={"void-reveal-container " + (phase === 1 ? 'phase-climax' : '')}>
      {phase === 0 && (
        <div className="void-terminal">
          {scriptLines.slice(0, textIndex).map((line, i) => (
            <div key={i} className={"typewriter-line " + line.style}>
              {line.text}
            </div>
          ))}
          {textIndex < scriptLines.length && (
            <span className="blinking-cursor">█</span>
          )}
        </div>
      )}

      {phase === 1 && (
        <div className="void-singularity-container">
          <div className="black-hole"></div>
          <div className="accretion-disk"></div>
          
          {consumedObjects.map(obj => (
            <div 
              key={obj.id} 
              className="consumed-object"
              style={{
                left: `calc(50% + ${obj.startX}vw)`,
                top: `calc(50% + ${obj.startY}vh)`,
                animationDelay: `${obj.delay}s`,
                '--target-x': `${-obj.startX}vw`,
                '--target-y': `${-obj.startY}vh`
              }}
            >
              <obj.Icon size={32} />
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
}
