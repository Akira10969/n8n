import React, { useState, useEffect } from 'react';

export default function TheVoidReveal({ onRevealComplete }) {
  const [phase, setPhase] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

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
      // Show the massive silhouette glitch
      const timer = setTimeout(() => setPhase(2), 6000);
      return () => clearTimeout(timer);
    } else if (phase === 2) {
      onRevealComplete();
    }
  }, [phase, textIndex]);

  return (
    <div className="void-reveal-container">
      <div className="void-terminal">
        {scriptLines.slice(0, textIndex).map((line, i) => (
          <div key={i} className={"typewriter-line " + line.style}>
            {line.text}
          </div>
        ))}
        {phase === 0 && textIndex < scriptLines.length && (
          <span className="blinking-cursor">█</span>
        )}
      </div>

      {phase === 1 && (
        <div className="void-silhouette-container animate-intense-glitch">
          <svg viewBox="0 0 100 100" className="void-silhouette">
            <filter id="glitch-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <path d="M20,80 Q50,10 80,80 Q60,50 50,70 Q40,50 20,80 Z" fill="rgba(255, 0, 0, 0.4)" filter="url(#glitch-filter)" />
            <path d="M10,90 Q50,0 90,90 Q60,60 50,80 Q40,60 10,90 Z" fill="rgba(0, 255, 0, 0.3)" style={{mixBlendMode: 'screen', transform: 'translate(2px, -2px)'}} />
            <path d="M30,70 Q50,20 70,70 Q60,40 50,60 Q40,40 30,70 Z" fill="rgba(0, 0, 255, 0.3)" style={{mixBlendMode: 'screen', transform: 'translate(-2px, 2px)'}} />
          </svg>
          <div className="void-name-reveal glitch" data-text="? U N K N O W N ?">
            ? U N K N O W N ?
          </div>
        </div>
      )}
    </div>
  );
}
