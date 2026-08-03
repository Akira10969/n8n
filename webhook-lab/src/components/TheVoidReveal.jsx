import React, { useState, useEffect } from 'react';
import { Database, Webhook, Cloud, Server, Lock } from 'lucide-react';
import { playVoiceLine, stopVoice } from '../utils/audioUtils';

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

    // Subtle glitch sound on mount (softened)
    const glitchOsc = audioCtx.createOscillator();
    glitchOsc.type = 'sawtooth';
    glitchOsc.frequency.setValueAtTime(80, audioCtx.currentTime); // Lower frequency, less harsh
    glitchOsc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.3);
    
    const glitchGain = audioCtx.createGain();
    glitchGain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Significantly lower volume
    glitchGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    glitchOsc.connect(glitchGain);
    glitchGain.connect(audioCtx.destination);
    glitchOsc.start();
    glitchOsc.stop(audioCtx.currentTime + 0.5);

    document.body.classList.add('void-active');

    // Save context and nodes to window so phase 1 can access them or clean them up
    window.voidAudio = { ctx: audioCtx, drone: osc, droneGain: gain };

    return () => {
      document.body.classList.remove('void-active');
      stopVoice();
      if (globalAudio) globalAudio.volume = 0.5; // Restore music when done
      try {
        gain.gain.cancelScheduledValues(audioCtx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        
        setTimeout(() => {
          try { osc.stop(); } catch {}
        }, 500);
        setTimeout(() => {
          try { audioCtx.close(); } catch {}
        }, 600);
      } catch {}
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    if (phase === 0) {
      if (textIndex < scriptLines.length) {
        const line = scriptLines[textIndex];
        
        let voiceText = line.text;
        if (line.style.includes('void-text')) {
          if (line.text === '...') {
            voiceText = null;
          } else {
            voiceText = '[THE VOID]: ' + line.text;
          }
        }

        if (voiceText) {
          playVoiceLine(voiceText, () => {
            if (isActive) {
              setTimeout(() => {
                if (isActive) setTextIndex(prev => prev + 1);
              }, line.style.includes('void-text') ? 800 : 400);
            }
          });
        } else {
          setTimeout(() => {
            if (isActive) setTextIndex(prev => prev + 1);
          }, 1500);
        }
      } else {
        // Moment of near silence before the reveal
        if (window.voidAudio) {
          window.voidAudio.droneGain.gain.linearRampToValueAtTime(0.01, window.voidAudio.ctx.currentTime + 2);
        }
        setTimeout(() => {
          if (isActive) setPhase(1);
        }, 3500);
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

        // Distortion / Static Blast (Softened)
        const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3; // Much quieter white noise
        }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(400, ctx.currentTime); // Cut high frequencies
        noiseFilter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 2);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, ctx.currentTime); // Low volume blast
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        
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

      setTimeout(() => {
        if (isActive) {
          document.body.classList.remove('screen-tearing-active');
          setPhase(2);
        }
      }, 5000);
    } else if (phase === 2) {
      onRevealComplete();
    }

    return () => {
      isActive = false;
      document.body.classList.remove('screen-tearing-active');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
