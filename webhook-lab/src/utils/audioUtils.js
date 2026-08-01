// Global Audio Context to avoid creating multiple instances
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

// Global settings state references
let audioSettings = {
  voiceEnabled: true,
  musicVolume: 0.5,
  sfxVolume: 0.5,
};

// MUSIC STATE
let currentMusicPhase = null;
let currentAudioElement = null;
let nextAudioElement = null;
let isDucking = false;

const MUSIC_TRACKS = {
  MAP: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3",
  BRIEFING: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  DEPLOYMENT: "https://cdn.pixabay.com/download/audio/2021/11/24/audio_33895e7c8f.mp3",
  GAMEPLAY: "https://cdn.pixabay.com/download/audio/2021/10/08/audio_2448375e0c.mp3",
  CRITICAL: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c89e2c694a.mp3",
  DEBRIEF: "https://cdn.pixabay.com/download/audio/2021/11/23/audio_732a3d0fb1.mp3",
  VOID: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_5fb6660fc6.mp3"
};

const applyMusicVolume = (element, targetVol = audioSettings.musicVolume, isFadingIn = false) => {
  if (!element) return;
  
  if (element.fadeInterval) {
    clearInterval(element.fadeInterval);
    element.fadeInterval = null;
  }
  
  const finalVolume = Math.max(0, Math.min(1, targetVol * (isDucking ? 0.2 : 1)));
  if (isFadingIn) {
    element.volume = 0;
    let vol = 0;
    element.fadeInterval = setInterval(() => {
      vol += 0.05;
      if (vol >= finalVolume) {
        element.volume = finalVolume;
        clearInterval(element.fadeInterval);
        element.fadeInterval = null;
      } else {
        element.volume = vol;
      }
    }, 100);
  } else {
    element.volume = finalVolume;
  }
};

export const updateAudioSettings = (settings) => {
  audioSettings = { ...audioSettings, ...settings };
  
  if (!audioSettings.voiceEnabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  if (currentAudioElement) {
    applyMusicVolume(currentAudioElement, audioSettings.musicVolume);
  }
};

export const setMusicPhase = (phase) => {
  if (currentMusicPhase === phase) return;
  const trackUrl = MUSIC_TRACKS[phase];
  if (!trackUrl) return;

  currentMusicPhase = phase;
  
  // Crossfade setup
  nextAudioElement = new Audio(trackUrl);
  nextAudioElement.loop = true;
  nextAudioElement.play().catch(e => console.warn('Audio play prevented by browser', e));
  
  applyMusicVolume(nextAudioElement, audioSettings.musicVolume, true);

  if (currentAudioElement) {
    const fadeOutEl = currentAudioElement;
    
    if (fadeOutEl.fadeInterval) {
      clearInterval(fadeOutEl.fadeInterval);
      fadeOutEl.fadeInterval = null;
    }
    
    let vol = fadeOutEl.volume;
    fadeOutEl.fadeInterval = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        fadeOutEl.pause();
        fadeOutEl.src = '';
        clearInterval(fadeOutEl.fadeInterval);
        fadeOutEl.fadeInterval = null;
      } else {
        fadeOutEl.volume = Math.max(0, vol);
      }
    }, 100);
  }
  
  currentAudioElement = nextAudioElement;
};

// ==========================================
// VOICE SYNTHESIS & IDENTITIES
// ==========================================

export const getVoiceIdentity = (text) => {
  let identity = 'NARRATOR';
  let cleanText = text;

  if (text.startsWith('[UNIT-7')) {
    identity = 'UNIT-7';
    cleanText = text.replace(/\[UNIT-7[^\]]*\]:\s*/i, '');
  } else if (text.startsWith('[SARAH')) {
    identity = 'SARAH';
    cleanText = text.replace(/\[SARAH[^\]]*\]:\s*/i, '');
  } else if (text.startsWith('[THE VOID')) {
    identity = 'THE_VOID';
    cleanText = text.replace(/\[THE VOID[^\]]*\]:\s*/i, '');
  }

  return { identity, cleanText };
};

export const playVoiceLine = (text, onEnd) => {
  if (!audioSettings.voiceEnabled || !('speechSynthesis' in window)) {
    if (onEnd) setTimeout(onEnd, text.length * 50); // Simulate reading time if disabled
    return;
  }

  window.speechSynthesis.cancel();
  
  const { identity, cleanText } = getVoiceIdentity(text);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = voices[0];
  
  // Voice Personalities
  if (identity === 'UNIT-7') {
    utterance.pitch = 0.9;
    utterance.rate = 1.0;
    selectedVoice = voices.find(v => v.name.includes('Microsoft Mark') || v.name.includes('Google UK English Male') || v.name.includes('David')) || voices[0];
    playUIBeep();
  } else if (identity === 'SARAH') {
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    selectedVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Victoria')) || voices[0];
    playRadioClick();
  } else if (identity === 'THE_VOID') {
    utterance.pitch = 0.2;
    utterance.rate = 0.7;
  } else {
    // Default narrator
    utterance.pitch = 1.0;
    utterance.rate = 1.0;
  }

  if (selectedVoice) utterance.voice = selectedVoice;
  
  utterance.volume = audioSettings.sfxVolume * 1.5;

  // Audio Ducking Start
  isDucking = true;
  if (currentAudioElement) applyMusicVolume(currentAudioElement);

  utterance.onend = () => {
    // Audio Ducking End
    isDucking = false;
    if (currentAudioElement) {
      // Smooth fade back up
      if (currentAudioElement.fadeInterval) {
        clearInterval(currentAudioElement.fadeInterval);
        currentAudioElement.fadeInterval = null;
      }
      
      let vol = currentAudioElement.volume;
      const targetVol = audioSettings.musicVolume;
      currentAudioElement.fadeInterval = setInterval(() => {
        vol += 0.05;
        if (vol >= targetVol) {
          currentAudioElement.volume = targetVol;
          clearInterval(currentAudioElement.fadeInterval);
          currentAudioElement.fadeInterval = null;
        } else {
          currentAudioElement.volume = vol;
        }
      }, 50);
    }
    
    if (identity === 'SARAH') {
      setTimeout(playRadioClick, 200);
    }
    if (onEnd) onEnd();
  };
  
  window.speechSynthesis.speak(utterance);
};

export const stopVoice = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isDucking = false;
  if (currentAudioElement) applyMusicVolume(currentAudioElement);
};


// ==========================================
// SOUND EFFECTS
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

export const playRadioClick = () => {
  if (audioSettings.sfxVolume === 0) return;
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.05; // 50ms click
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

let currentEnvOsc = null;
let currentEnvGain = null;

export const playZoneAmbience = (zoneName) => {
  if (audioSettings.sfxVolume === 0) return;
  const ctx = getAudioContext();
  
  stopZoneAmbience(); // clear existing
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(audioSettings.sfxVolume * 0.05, ctx.currentTime + 2); // Fade in
  
  if (zoneName === 'FOUNDATION ZONE') {
    // Soft wind noise
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
    // Magical synth hum
    currentEnvOsc = ctx.createOscillator();
    currentEnvOsc.type = 'sine';
    currentEnvOsc.frequency.value = 120; // Low hum
    
    // Add LFO for modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(currentEnvOsc.frequency);
    lfo.start();
    
    currentEnvOsc.connect(gain);
    
  } else {
    // Default low drone for other zones (Security, Infrastructure)
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

export const stopZoneAmbience = () => {
  if (currentEnvGain && currentEnvOsc) {
    const ctx = getAudioContext();
    currentEnvGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    const oscToStop = currentEnvOsc;
    setTimeout(() => {
      try { oscToStop.stop(); } catch(e){}
    }, 1000);
    currentEnvOsc = null;
    currentEnvGain = null;
  }
};
