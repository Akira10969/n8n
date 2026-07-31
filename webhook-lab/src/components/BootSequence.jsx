import React, { useState, useEffect } from 'react';
import './BootSequence.css';

const Typewriter = ({ text, delay = 20, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);

  const hasCompleted = React.useRef(false);

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
        setIdx(i => i + 1);
      }, currentDelay);
      return () => clearTimeout(t);
    } else {
      if (onComplete && !hasCompleted.current) {
        hasCompleted.current = true;
        onComplete();
      }
    }
  }, [idx, text, delay, onComplete]);

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
      "MEI_Cloud_OS powers thousands of services across the city, processing millions of requests every minute.",
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
      "MEI_Cloud_OS will never recover."
    ];
  }

  useEffect(() => {
    // 1. Initializing
    const timers = [];
    timers.push(setTimeout(() => setStep(1), 1000)); // Connect
    timers.push(setTimeout(() => setStep(2), 2500)); // Auth
    timers.push(setTimeout(() => setStep(3), 4000)); // Load infra
    timers.push(setTimeout(() => setStep(4), 5500)); // Sync complete
    timers.push(setTimeout(() => setStep(5), 7000)); // Welcome
    timers.push(setTimeout(() => setStep(6), 8500)); // Narrative start
    
    return () => timers.forEach(clearTimeout);
  }, []);

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
          <p>MEI_Cloud_OS</p>
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
