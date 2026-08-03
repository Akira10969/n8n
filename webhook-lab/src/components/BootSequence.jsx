import React, { useState, useEffect } from 'react';
import './BootSequence.css';
import { playTypingSound, playUIBeep, setGlobalDucking, setMusicTension, playVoiceLine, stopVoice } from '../utils/audioUtils';

const Typewriter = ({ text, delay = 20, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);

  const isTypingComplete = React.useRef(false);
  const isVoiceComplete = React.useRef(false);
  const hasCalledComplete = React.useRef(false);

  const checkCompletion = () => {
    if (isTypingComplete.current && isVoiceComplete.current && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 750); // 0.75s pause before next line
    }
  };

  useEffect(() => {
    isTypingComplete.current = false;
    isVoiceComplete.current = false;
    hasCalledComplete.current = false;
    setDisplayed('');
    setIdx(0);

    let voiceCompleted = false;

    if (text) {
      const isSerious = text.includes('ELEVATED') || text.includes('Incident reports') || text.includes('anomalies') || text.includes('testing our defenses') || text.includes('Warning');
      const isUrgent = text.includes('CRITICAL') || text.includes('latency') || text.includes('timing out') || text.includes('Trust nothing') || text.includes('Anomaly');
      const isExtreme = text.includes('FAILURE') || text.includes('EXTREME') || text.includes('Void') || text.includes('never recover') || text.includes('core services');

      let pitch = 1.2;
      let rate = 0.95;

      if (isExtreme) {
        pitch = 0.8;
        rate = 1.1;
        setMusicTension(1.4);
      } else if (isUrgent) {
        pitch = 0.9;
        rate = 0.85;
        setMusicTension(1.2);
      } else if (isSerious) {
        pitch = 1.0;
        rate = 0.9;
        setMusicTension(1.1);
      } else {
        setMusicTension(1.0);
      }

      playVoiceLine(text, () => {
        if (voiceCompleted) return;
        voiceCompleted = true;
        isVoiceComplete.current = true;
        checkCompletion();
      }, { pitch, rate });

    } else {
      isVoiceComplete.current = true;
    }

    return () => {
      voiceCompleted = true;
      stopVoice();
    };
  }, [text]);

  useEffect(() => {
    if (idx < text.length) {
      // Randomize delay to simulate realistic, tense AI typing
      let currentDelay = Math.random() * 30 + delay;
      
      // Pause longer on punctuation for dramatic effect
      const char = text[idx];
      if (char === '.' || char === ',' || char === '!' || char === '?') {
        currentDelay += 300; // Add dramatic pause on punctuation
      }
      
      const t = setTimeout(() => {
        setDisplayed(p => p + char);
        setIdx(prev => prev + 1);
        
        // Play typing sound on ~1/3 of the characters to avoid being repetitive
        if (idx % 3 === 0 && char !== ' ') {
          playTypingSound();
        }
      }, currentDelay);
      return () => clearTimeout(t);
    } else {
      isTypingComplete.current = true;
      checkCompletion();
    }
  }, [idx, text, delay]);

  return <span>{displayed}<span className="cursor-block">█</span></span>;
};

const LoadingBar = ({ targetPercent, onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (percent < targetPercent) {
      const t = setTimeout(() => setPercent(p => p + Math.floor(Math.random() * 5) + 1), Math.random() * 50 + 20);
      return () => clearTimeout(t);
    } else {
      setPercent(targetPercent);
      if (onComplete) onComplete();
    }
  }, [percent, targetPercent, onComplete]);

  const boxes = 10;
  const filledBoxes = Math.floor((percent / 100) * boxes);
  const bar = Array.from({ length: boxes }, (_, i) => (i < filledBoxes ? '■' : '□')).join('');

  return <div>{bar} {Math.min(percent, targetPercent)}%</div>;
};

export default function BootSequence({ highestUnlockedIndex, onBootComplete }) {
  const [step, setStep] = useState(0);

  // Dynamic narrative logic based on progress
  let narrativeText = [];
  if (highestUnlockedIndex < 5) {
    narrativeText = [
      "Incoming Transmission...",
      "Priority: LOW",
      "Good morning, Engineer.",
      "Your first day begins today.",
      "Business Cloud OS powers thousands of services across the city, processing millions of requests every minute.",
      "Most days are routine. Monitor systems. Resolve incidents. Keep the platform online.",
      "At least... that's what everyone believes.",
      "... ... ...",
      "Internal Monitoring AI — Status Report",
      "✓ API Gateway Online",
      "✓ Database Cluster Healthy",
      "✓ Webhook Queue Operational",
      "✓ Network Stable",
      "... ... ...",
      "Warning. One anomaly detected. Source: Unknown.",
      "The event has been dismissed as insignificant. Continue to assignment..."
    ];
  } else if (highestUnlockedIndex >= 5 && highestUnlockedIndex < 15) {
    narrativeText = [
      "Incoming Transmission...",
      "Priority: ELEVATED",
      "Welcome back, Engineer.",
      "Incident reports are increasing across the Platform Operations Zone.",
      "Multiple authentication failures detected.",
      "The anomalies are no longer isolated.",
      "Something is systematically testing our defenses.",
      "Stay vigilant."
    ];
  } else if (highestUnlockedIndex >= 15 && highestUnlockedIndex < 24) {
    narrativeText = [
      "EMERGENCY BROADCAST",
      "Priority: CRITICAL",
      "Webhook delivery success has dropped to 18%.",
      "Queue latency exceeds SLA.",
      "Serverless functions are timing out.",
      "The incident is spreading rapidly through the Distributed Systems Zone.",
      "Trust nothing. Verify everything."
    ];
  } else {
    narrativeText = [
      "SYSTEM FAILURE IMMINENT",
      "Priority: EXTREME",
      "This is no longer a routine outage.",
      "Multiple core services have failed.",
      "The Void has penetrated the core infrastructure.",
      "If you fail here...",
      "Business Cloud OS will never recover."
    ];
  }

  useEffect(() => {
    // 1. Initializing
    const timers = [];
    timers.push(setTimeout(() => { setStep(1); playUIBeep(); }, 1000)); // Connect
    timers.push(setTimeout(() => { setStep(2); playUIBeep(); }, 2500)); // Auth
    timers.push(setTimeout(() => { setStep(3); playUIBeep(); }, 4000)); // Load infra
    timers.push(setTimeout(() => { setStep(4); playUIBeep(); }, 5500)); // Sync complete
    timers.push(setTimeout(() => { setStep(5); playUIBeep(); }, 7000)); // Welcome
    timers.push(setTimeout(() => { setStep(6); }, 8500)); // Narrative start
    
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    
    osc.type = 'sine'; // Soft ambient hum instead of harsh sawtooth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioCtx.currentTime); // Filter out high frequencies
    
    // Slightly lower frequency for higher levels to make it more menacing
    const baseFreq = highestUnlockedIndex >= 24 ? 40 : 50;
    osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime); 
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    
    let targetVolume = 0.05;
    if (highestUnlockedIndex >= 5) targetVolume = 0.1;
    if (highestUnlockedIndex >= 15) targetVolume = 0.15;
    if (highestUnlockedIndex >= 24) targetVolume = 0.2;
    
    // Slow build up over 8 seconds
    gain.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + 8);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    osc.start();
    
    return () => {
      try {
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        setTimeout(() => osc.stop(), 1000);
        setTimeout(() => audioCtx.close(), 1100);
      } catch (e) {}
    };
  }, [highestUnlockedIndex]);

  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [fadeStatus, setFadeStatus] = useState('in');

  const handleLineComplete = () => {
    const pauseTime = narrativeText[narrativeIndex].includes('...') ? 1500 : 1000;
    setTimeout(() => {
      setFadeStatus('out');
      setTimeout(() => {
        if (narrativeIndex < narrativeText.length - 1) {
          setNarrativeIndex(n => n + 1);
          setFadeStatus('in');
        } else {
          setTimeout(onBootComplete, 500);
        }
      }, 800); // Wait for CSS fade out
    }, pauseTime);
  };

  return (
    <div className="boot-sequence-container">
      <div className={`boot-text ${step >= 6 ? 'fade-out' : 'fade-in'}`}>
        <div className="boot-header">
          <p>══════════════════════════════════════</p>
          <p>Business Cloud OS</p>
          <p>Platform Operations Division</p>
          <br/>
          <p>Year 2042</p>
          <p>Megacity-01</p>
          <p>══════════════════════════════════════</p>
        </div>
        
        <br/>
        <p>Initializing secure connection...</p>

        {step >= 1 && (
          <div className="boot-step">
            <p>Connecting...</p>
            <LoadingBar targetPercent={22} />
          </div>
        )}

        {step >= 2 && (
          <div className="boot-step">
            <p>Authenticating Engineer...</p>
            <LoadingBar targetPercent={54} />
          </div>
        )}

        {step >= 3 && (
          <div className="boot-step">
            <p>Loading Infrastructure...</p>
            <LoadingBar targetPercent={87} />
          </div>
        )}

        {step >= 4 && (
          <div className="boot-step">
            <p>Synchronization Complete.</p>
          </div>
        )}

        {step >= 5 && (
          <div className="boot-step highlight">
            <p>Welcome, Engineer.</p>
            <br/>
          </div>
        )}
      </div>

      {step >= 6 && narrativeText[narrativeIndex] && (
        <div className={`boot-narrative-centered ${fadeStatus === 'in' ? 'fade-in' : 'fade-out'}`}>
          <p className={narrativeText[narrativeIndex].includes('Warning') || narrativeText[narrativeIndex].includes('EMERGENCY') || narrativeText[narrativeIndex].includes('FAILURE') ? 'text-warn' : ''}>
            <Typewriter key={narrativeIndex} text={narrativeText[narrativeIndex]} onComplete={handleLineComplete} delay={15} />
          </p>
        </div>
      )}

    </div>
  );
}
