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
    // Play glitch sound on mount
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(50, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(10, audioContext.currentTime + 1);
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);

    document.body.classList.add('void-active');

    return () => {
      document.body.classList.remove('void-active');
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
        const timer = setTimeout(() => setPhase(1), 3000);
        return () => clearTimeout(timer);
      }
    } else if (phase === 1) {
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
