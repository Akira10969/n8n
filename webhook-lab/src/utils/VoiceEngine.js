import { getAudioContext, setGlobalDucking, playUIBeep, playRadioClick } from './audioUtils';

/**
 * Interface for Voice Providers (Azure, ElevenLabs, BrowserTTS)
 */
class VoiceProvider {
  async init() {}
  async speak(text, character, options = {}) { throw new Error('Not implemented'); }
  stop() {}
}

/**
 * Concrete Implementation: Browser's built-in Web Speech API
 */
class BrowserTTSProvider extends VoiceProvider {
  constructor() {
    super();
    this.voicesLoaded = false;
    this.voices = [];
    this.currentSpeakId = 0;
    this.loadVoices();
  }

  loadVoices() {
    if (!('speechSynthesis' in window)) return;
    
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      this.voicesLoaded = true;
    }

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }
    };
  }

  async waitForVoices() {
    if (this.voicesLoaded) return;
    
    // Poll for voices up to 2 seconds
    let attempts = 0;
    while (!this.voicesLoaded && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }
      attempts++;
    }
  }

  getVoiceForCharacter(character) {
    if (character === 'SARAH') {
      return this.voices.find(v => 
        v.name.includes('Google UK English Female') || 
        v.name.includes('Microsoft Zira') || 
        v.name.includes('Samantha') || 
        v.name.includes('Female')
      ) || this.voices.find(v => v.name.includes('Female')) || this.voices[0];
    } else if (character === 'UNIT-7') {
      return this.voices.find(v => 
        v.name.includes('Microsoft Mark') || 
        v.name.includes('Google UK English Male') || 
        v.name.includes('David') || 
        v.name.includes('Male')
      ) || this.voices.find(v => v.name.includes('Male')) || this.voices[0];
    } else if (character === 'THE_VOID') {
      // Void usually uses a deep male voice if possible
      return this.voices.find(v => 
        v.name.includes('Google UK English Male') || 
        v.name.includes('Microsoft David') || 
        v.name.includes('Male')
      ) || this.voices[0];
    }
    
    return this.voices[0];
  }

  // Delivery modification (punctuation spacing)
  formatTextForDelivery(text, character) {
    if (character === 'THE_VOID') {
      // Add commas to force deliberate, slow pacing between words.
      // Negative lookahead to ensure we don't insert a comma right before another punctuation mark.
      return text
        .replace(/([.?!])\s+/g, '$1 . . . ') // Emphasize sentence breaks
        .replace(/([a-zA-Z]{5,})(?=\s+[a-zA-Z])/g, '$1, '); // Inject commas between long words for unnatural pacing
    } else if (character === 'UNIT-7') {
      // Short pauses for analytical pacing
      return text.replace(/([.?!])\s+/g, '$1 . . . ');
    } else if (character === 'SARAH') {
      // Natural conversational flow, no forced commas
      return text;
    }
    return text;
  }

  async speak(text, character, options = {}) {
    if (!('speechSynthesis' in window)) return;
    
    this.currentSpeakId++;
    const speakId = this.currentSpeakId;

    window.speechSynthesis.cancel();
    await this.waitForVoices();

    if (this.currentSpeakId !== speakId) return false;

    return new Promise((resolve) => {
      // Final cancel to ensure queue is clear before pushing utterance
      window.speechSynthesis.cancel();

      const formattedText = this.formatTextForDelivery(text, character);
      const utterance = new SpeechSynthesisUtterance(formattedText);
      utterance.voice = this.getVoiceForCharacter(character);
      
      utterance.volume = options.volume || 1.0;

      if (character === 'SARAH') {
        utterance.pitch = 1.1;
        utterance.rate = 1.05; // Slightly faster, conversational
      } else if (character === 'UNIT-7') {
        utterance.pitch = 1.0;
        utterance.rate = 1.0; // Steady, robotic
      } else if (character === 'THE_VOID') {
        utterance.pitch = 0.4;
        utterance.rate = 0.65; // Slowed down significantly
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      // Override if specific emotions dictate
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.rate) utterance.rate = options.rate;

      utterance.onend = () => {
        resolve(true);
      };
      
      utterance.onerror = () => {
        resolve(false); // Resolve anyway so game doesn't hang
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

/**
 * Global Voice Engine Manager
 * Abstracts the TTS provider and handles character background SFX
 */
class VoiceEngineManager {
  constructor() {
    this.provider = new BrowserTTSProvider();
    
    // Background SFX state
    this.activeSpeechBgNode = null;
    this.activeSpeechBgGain = null;
    this.activeGlitchInterval = null;
    this.currentPlayId = 0;
  }

  setProvider(provider) {
    this.provider = provider;
  }

  stopSpeechBackground() {
    if (this.activeGlitchInterval) {
      clearInterval(this.activeGlitchInterval);
      this.activeGlitchInterval = null;
    }
    if (this.activeSpeechBgGain && this.activeSpeechBgNode) {
      const ctx = getAudioContext();
      if (ctx) {
        this.activeSpeechBgGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        const oscToStop = this.activeSpeechBgNode;
        setTimeout(() => {
          try { oscToStop.stop(); } catch(e){}
        }, 600);
      }
      this.activeSpeechBgNode = null;
      this.activeSpeechBgGain = null;
    }
  }

  startSpeechBackground(character, sfxVolume) {
    this.stopSpeechBackground();
    const ctx = getAudioContext();
    if (!ctx) return;

    if (character === 'UNIT-7') {
      playUIBeep();
      const osc = ctx.createOscillator();
      this.activeSpeechBgGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 8000;
      
      this.activeSpeechBgGain.gain.setValueAtTime(0, ctx.currentTime);
      this.activeSpeechBgGain.gain.linearRampToValueAtTime(sfxVolume * 0.02, ctx.currentTime + 0.5);
      
      osc.connect(this.activeSpeechBgGain);
      this.activeSpeechBgGain.connect(ctx.destination);
      osc.start();
      this.activeSpeechBgNode = osc;

    } else if (character === 'SARAH') {
      playRadioClick();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      
      this.activeSpeechBgGain = ctx.createGain();
      this.activeSpeechBgGain.gain.setValueAtTime(0, ctx.currentTime);
      this.activeSpeechBgGain.gain.linearRampToValueAtTime(sfxVolume * 0.03, ctx.currentTime + 0.5);
      
      noise.connect(filter);
      filter.connect(this.activeSpeechBgGain);
      this.activeSpeechBgGain.connect(ctx.destination);
      noise.start();
      this.activeSpeechBgNode = noise;

    } else if (character === 'THE_VOID') {
      const osc = ctx.createOscillator();
      this.activeSpeechBgGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 40;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 100;
      
      this.activeSpeechBgGain.gain.setValueAtTime(0, ctx.currentTime);
      this.activeSpeechBgGain.gain.linearRampToValueAtTime(sfxVolume * 0.1, ctx.currentTime + 1.0);
      
      osc.connect(filter);
      filter.connect(this.activeSpeechBgGain);
      this.activeSpeechBgGain.connect(ctx.destination);
      osc.start();
      this.activeSpeechBgNode = osc;

      this.activeGlitchInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          const glitchOsc = ctx.createOscillator();
          const glitchGain = ctx.createGain();
          glitchOsc.type = 'square';
          glitchOsc.frequency.setValueAtTime(Math.random() * 200 + 50, ctx.currentTime);
          glitchGain.gain.setValueAtTime(sfxVolume * 0.05, ctx.currentTime);
          glitchGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
          glitchOsc.connect(glitchGain);
          glitchGain.connect(ctx.destination);
          glitchOsc.start();
          glitchOsc.stop(ctx.currentTime + 0.1);
        }
      }, 400);
    }
  }

  async play(text, character, options = {}) {
    this.currentPlayId++;
    const playId = this.currentPlayId;

    if (import.meta.env.DEV) {
      console.log(`[AUDIO] Narration Started: ${character}`);
    }

    if (options.voiceEnabled === false) {
      const readingTime = Math.max(1000, text.length * 50);
      await new Promise(resolve => setTimeout(resolve, readingTime));
      return;
    }

    this.startSpeechBackground(character, options.sfxVolume || 0.5);
    setGlobalDucking(true);
    
    const success = await this.provider.speak(text, character, options);
    
    // Only cleanup if we are still the active play request
    if (this.currentPlayId === playId) {
      this.stopSpeechBackground();
      setGlobalDucking(false);
      
      if (character === 'SARAH') {
        setTimeout(playRadioClick, 200);
      }
      return success;
    }
    return false;
  }

  stop() {
    this.provider.stop();
    this.stopSpeechBackground();
    setGlobalDucking(false);
  }
}

export const VoiceEngine = new VoiceEngineManager();
 
