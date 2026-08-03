
// ==========================================
// GLOBAL AUDIO MANAGER
// ==========================================

// Global Audio Context
let audioCtx = null;

export const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// DEV Logging
const logAudio = (msg) => {
  if (import.meta.env.DEV) {
    console.log('[AUDIO]', msg);
  }
};

// Global Settings State
let audioSettings = {
  voiceEnabled: true,
  musicVolume: 0.5,
  sfxVolume: 0.5,
};

export const getAudioSettings = () => audioSettings;

// Global State
let currentMusicPhase = null;
let currentAudioElement = null;
let nextAudioElement = null;
let isDucking = false;
let isTransitioning = false;
let activeTimers = new Set();
let currentEnvOsc = null;
let currentEnvGain = null;

const MUSIC_TRACKS = {
  MAP: "/audio/ambience/map.mp3",
  BRIEFING: "/audio/briefing/briefing.mp3",
  DEPLOYMENT: "/audio/deployment/deployment.mp3",
  GAMEPLAY: "/audio/gameplay/gameplay.mp3",
  CRITICAL: "/audio/gameplay/critical.mp3",
  DEBRIEF: "/audio/debrief/debrief.mp3",
  VOID: "/audio/ending/void.mp3"
};

// Utility to track and clear intervals
const safeSetInterval = (fn, ms) => {
  const id = setInterval(fn, ms);
  activeTimers.add(id);
  return id;
};

const safeClearInterval = (id) => {
  if (id) {
    clearInterval(id);
    activeTimers.delete(id);
  }
};

export const cleanupAudio = () => {
  logAudio('Cleanup Initiated');
  
  // Clear all pending transition logic
  activeTimers.forEach(id => clearInterval(id));
  activeTimers.clear();
  
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.src = '';
    currentAudioElement = null;
  }
  if (nextAudioElement) {
    nextAudioElement.pause();
    nextAudioElement.src = '';
    nextAudioElement = null;
  }
  
  currentMusicPhase = null;
  isTransitioning = false;
  isDucking = false;
  
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  stopSpeechBackground();
  stopZoneAmbience(true); // true = force immediate
  
  logAudio('Cleanup Complete');
};

export const setGlobalDucking = (duck) => {
  isDucking = duck;
  logAudio(`Ducking ${duck ? 'Enabled' : 'Disabled'}`);
  
  if (!currentAudioElement || isTransitioning) return;
  
  safeClearInterval(currentAudioElement.fadeInterval);
  
  const targetVol = audioSettings.musicVolume * (duck ? 0.2 : 1);
  let vol = currentAudioElement.volume;
  const step = duck ? -0.05 : 0.05;
  
  currentAudioElement.fadeInterval = safeSetInterval(() => {
    vol += step;
    if ((duck && vol <= targetVol) || (!duck && vol >= targetVol)) {
      currentAudioElement.volume = Math.max(0, Math.min(1, targetVol));
      safeClearInterval(currentAudioElement.fadeInterval);
      currentAudioElement.fadeInterval = null;
    } else {
      currentAudioElement.volume = Math.max(0, Math.min(1, vol));
    }
  }, 50);
};

export const setMusicTension = (multiplier) => {
  if (currentAudioElement && !isTransitioning) {
    const targetRate = Math.max(1, Math.min(2.0, multiplier));
    let currentRate = currentAudioElement.playbackRate;
    
    safeClearInterval(currentAudioElement.tensionInterval);
    
    currentAudioElement.tensionInterval = safeSetInterval(() => {
      if (Math.abs(currentRate - targetRate) < 0.02) {
        currentAudioElement.playbackRate = targetRate;
        safeClearInterval(currentAudioElement.tensionInterval);
      } else {
        currentRate += (targetRate > currentRate ? 0.01 : -0.01);
        currentAudioElement.playbackRate = currentRate;
      }
    }, 100);
  }
};

export const updateAudioSettings = (settings) => {
  audioSettings = { ...audioSettings, ...settings };
  
  if (!audioSettings.voiceEnabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  if (currentAudioElement && !isTransitioning) {
    const targetVol = Math.max(0, Math.min(1, audioSettings.musicVolume * (isDucking ? 0.2 : 1)));
    currentAudioElement.volume = targetVol;
  }
};

export const setMusicPhase = (phase) => {
  if (currentMusicPhase === phase) {
    return;
  }
  
  const trackUrl = MUSIC_TRACKS[phase];
  if (!trackUrl) return;

  logAudio(`Phase Transition Requested: ${currentMusicPhase || 'NONE'} -> ${phase}`);
  currentMusicPhase = phase;
  
  // If we are already transitioning, we immediately force-stop the old transition logic
  // and jump to fading out whatever is currently playing
  if (isTransitioning) {
    logAudio('Interrupting active transition.');
    if (nextAudioElement) {
      nextAudioElement.pause();
      nextAudioElement.src = '';
      nextAudioElement = null;
    }
  }

  isTransitioning = true;
  
  // 1. Fade Out Current Element Sequence
  const fadeOutAndPlayNext = () => {
    nextAudioElement = new Audio(trackUrl);
    nextAudioElement.loop = true;
    nextAudioElement.volume = 0;
    
    // Play interaction needs to happen, catch browser policy errors
    nextAudioElement.play().then(() => {
      currentAudioElement = nextAudioElement;
      nextAudioElement = null;
      
      if (import.meta.env.DEV) {
        console.log(`[AUDIO]\nTrack: ${trackUrl.split('/').pop()}\nStatus: Playing`);
      }
      
      const targetVol = Math.max(0, Math.min(1, audioSettings.musicVolume * (isDucking ? 0.2 : 1)));
      let vol = 0;
      
      currentAudioElement.fadeInterval = safeSetInterval(() => {
        vol += 0.05;
        if (vol >= targetVol) {
          currentAudioElement.volume = targetVol;
          safeClearInterval(currentAudioElement.fadeInterval);
          currentAudioElement.fadeInterval = null;
          isTransitioning = false;
          logAudio('Music Transition Complete');
        } else {
          currentAudioElement.volume = Math.max(0, Math.min(1, vol));
        }
      }, 100);
    }).catch(e => {
      isTransitioning = false;
      
      if (import.meta.env.DEV) {
        console.warn(`[AUDIO]\nTrack: ${trackUrl.split('/').pop()}\nStatus: Missing\nFallback: Silence`);
      }
      
      if (nextAudioElement) {
        nextAudioElement.pause();
        nextAudioElement.src = '';
        nextAudioElement = null;
      }
    });
  };

  if (currentAudioElement) {
    safeClearInterval(currentAudioElement.fadeInterval);
    
    let vol = currentAudioElement.volume;
    currentAudioElement.fadeInterval = safeSetInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        currentAudioElement.pause();
        currentAudioElement.src = '';
        safeClearInterval(currentAudioElement.fadeInterval);
        currentAudioElement.fadeInterval = null;
        currentAudioElement = null;
        fadeOutAndPlayNext();
      } else {
        currentAudioElement.volume = Math.max(0, vol);
      }
    }, 100);
  } else {
    // Nothing playing, just fade in the new track
    fadeOutAndPlayNext();
  }
};

// ==========================================
// VOICE SYNTHESIS & IDENTITIES
// ==========================================

import { VoiceEngine } from './VoiceEngine';

export const playVoiceLine = (text, onEnd, options = {}) => {
  // Legacy wrapper to maintain compatibility while transitioning to Promises
  const identityMatch = text.match(/\[(.*?)\]/);
  let character = 'NARRATOR';
  let cleanText = text;

  if (identityMatch) {
    cleanText = text.replace(/\[.*?\]:\s*/, '').trim();
    if (cleanText.startsWith('[')) { 
      // in case it didn't have a colon, fallback strip
      cleanText = text.replace(/\[.*?\]\s*/, '').trim();
    }
    
    const tag = identityMatch[1].toUpperCase();
    if (tag.includes('UNIT-7')) character = 'UNIT-7';
    if (tag.includes('SARAH')) character = 'SARAH';
    if (tag.includes('VOID')) character = 'THE_VOID';
  }

  VoiceEngine.play(cleanText, character, { 
    ...options,
    sfxVolume: audioSettings.sfxVolume,
    voiceEnabled: audioSettings.voiceEnabled
  }).then((success) => {
    if (success && onEnd) onEnd();
  });
};

export const stopVoice = () => {
  VoiceEngine.stop();
};

export const stopSpeechBackground = () => {
  VoiceEngine.stopSpeechBackground();
};

// ==========================================
// SOUND EFFECTS & UI
// ==========================================

export const playUIBeep = () => {
  if (audioSettings.sfxVolume === 0) return;
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(audioSettings.sfxVolume * 0.2, ctx.currentTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

export const playTypingSound = () => {
  if (audioSettings.sfxVolume === 0) return;
  if (window.speechSynthesis && window.speechSynthesis.speaking) return;

  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  const frequencies = [600, 750, 800, 950];
  const baseFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.02);
  
  const targetVolume = audioSettings.sfxVolume * 0.03; 
  gain.gain.setValueAtTime(targetVolume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.03);
};

export const playRadioClick = () => {
  if (audioSettings.sfxVolume === 0) return;
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(audioSettings.sfxVolume * 0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  
  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  noiseSource.start();
};

export const playSuccessSound = () => {
  if (audioSettings.sfxVolume === 0) return;
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
  osc.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(audioSettings.sfxVolume * 0.3, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
};

// ==========================================
// ENVIRONMENTAL AMBIENCE
// ==========================================

export const playZoneAmbience = (zoneName) => {
  if (audioSettings.sfxVolume === 0) return;
  const ctx = getAudioContext();
  
  stopZoneAmbience(true); // Force stop previous seamlessly
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(audioSettings.sfxVolume * 0.05, ctx.currentTime + 2); // Fade in
  
  if (zoneName === 'FOUNDATION ZONE') {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    currentEnvOsc = ctx.createBufferSource();
    currentEnvOsc.buffer = buffer;
    currentEnvOsc.loop = true;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    currentEnvOsc.connect(filter);
    filter.connect(gain);
  } else if (zoneName === 'CLOUD ZONE') {
    currentEnvOsc = ctx.createOscillator();
    currentEnvOsc.type = 'sine';
    currentEnvOsc.frequency.value = 120;
    
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(currentEnvOsc.frequency);
    lfo.start();
    
    currentEnvOsc.connect(gain);
  } else {
    currentEnvOsc = ctx.createOscillator();
    currentEnvOsc.type = 'square';
    currentEnvOsc.frequency.value = 50; 
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    currentEnvOsc.connect(filter);
    filter.connect(gain);
  }

  gain.connect(ctx.destination);
  currentEnvOsc.start();
  currentEnvGain = gain;
};

export const stopZoneAmbience = (immediate = false) => {
  if (currentEnvGain && currentEnvOsc) {
    const ctx = getAudioContext();
    if (immediate) {
      currentEnvGain.gain.setValueAtTime(0, ctx.currentTime);
      try { currentEnvOsc.stop(); } catch {}
    } else {
      currentEnvGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      const oscToStop = currentEnvOsc;
      setTimeout(() => {
        try { oscToStop.stop(); } catch {}
      }, 1000);
    }
    currentEnvOsc = null;
    currentEnvGain = null;
  }
};
