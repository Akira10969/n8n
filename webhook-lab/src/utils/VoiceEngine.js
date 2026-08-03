import { getAudioContext, setGlobalDucking, playUIBeep, playRadioClick } from './audioUtils';

/**
 * Interface for Voice Providers (Azure, ElevenLabs, BrowserTTS)
 */
class VoiceProvider {
  async init() {}
  async speak(_text, _character, _options = {}) { throw new Error('Not implemented'); }
  stop() {}
}

/**
 * Concrete Implementation: Browser's built-in Web Speech API
 * 
 * KNOWN LIMITATIONS: Browser TTS implementations vary wildly across operating systems and browsers.
 * For example, Chrome on Windows has different voices than Safari on macOS.
 * Because of this, characters may sound different depending on the player's device.
 * 
 * This class is intentionally kept modular behind the VoiceProvider interface. 
 * In the future, this can be seamlessly swapped out for a dedicated AI Voice provider 
 * (such as Azure AI Speech or ElevenLabs) to guarantee 100% consistent character identity 
 * across all devices.
 */
class BrowserTTSProvider extends VoiceProvider {
  constructor() {
    super();
    this.voicesLoaded = false;
    this.voices = [];
    this.voiceCache = new Map(); // Cache selected voices to guarantee consistency
    this.currentSpeakId = 0;
    this.currentUtterance = null; // Strong reference to prevent GC dropping onend
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
    
    // Create a robust Promise that waits for the onvoiceschanged event, with a polling fallback up to 5 seconds.
    await new Promise(resolve => {
      let attempts = 0;
      let interval;
      
      const checkVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
        if (this.voices.length > 0) {
          this.voicesLoaded = true;
          clearInterval(interval);
          resolve();
          return true;
        }
        return false;
      };

      if (checkVoices()) return;

      window.speechSynthesis.onvoiceschanged = () => {
        if (checkVoices()) window.speechSynthesis.onvoiceschanged = null;
      };

      interval = setInterval(() => {
        if (checkVoices()) {
          window.speechSynthesis.onvoiceschanged = null;
        } else if (attempts >= 50) { // 5 seconds
          clearInterval(interval);
          window.speechSynthesis.onvoiceschanged = null;
          resolve();
        }
        attempts++;
      }, 100);
    });
  }

  getVoiceForCharacter(character) {
    if (this.voiceCache.has(character)) {
      return this.voiceCache.get(character);
    }

    // Filter to English voices first
    let enVoices = this.voices.filter(v => v.lang.startsWith('en'));
    if (enVoices.length === 0) enVoices = this.voices;

    let selectedVoice = null;
    let isFallback = false;

    const findVoiceByPrefs = (prefs) => {
      for (const pref of prefs) {
        const match = enVoices.find(v => v.name.toLowerCase().includes(pref.toLowerCase()));
        if (match) return match;
      }
      return null;
    };

    if (character === 'SARAH') {
      const preferred = findVoiceByPrefs(['Google UK English Female', 'Microsoft Zira', 'Samantha', 'Google US English Female']);
      if (preferred) {
        selectedVoice = preferred;
      } else {
        selectedVoice = findVoiceByPrefs(['Female', 'Woman', 'Girl']) || enVoices[0];
        isFallback = true;
      }
    } else if (character === 'UNIT-7') {
      const preferred = findVoiceByPrefs(['Microsoft Mark', 'Google UK English Male', 'David', 'Google US English Male']);
      if (preferred) {
        selectedVoice = preferred;
      } else {
        selectedVoice = findVoiceByPrefs(['Male', 'Man', 'Boy']) || enVoices[0];
        isFallback = true;
      }
    } else if (character === 'THE_VOID') {
      const preferred = findVoiceByPrefs(['Google UK English Male', 'Microsoft David']);
      if (preferred) {
        selectedVoice = preferred;
      } else {
        selectedVoice = findVoiceByPrefs(['Male', 'Man']) || enVoices[0];
        isFallback = true;
      }
    } else if (character === 'NARRATOR') {
      const preferred = findVoiceByPrefs(['Microsoft David', 'Google UK English Male', 'Google US English Male']);
      if (preferred) {
        selectedVoice = preferred;
      } else {
        selectedVoice = findVoiceByPrefs(['Male', 'Man']) || enVoices[0];
        isFallback = true;
      }
    }

    if (!selectedVoice && this.voices.length > 0) {
      selectedVoice = this.voices[0];
      isFallback = true;
    }

    if (selectedVoice) {
      // Store object containing both the voice and whether it was a fallback
      this.voiceCache.set(character, { voice: selectedVoice, isFallback });
    }
    
    return { voice: selectedVoice, isFallback };
  }

  // Delivery modification (punctuation spacing)
  formatTextForDelivery(text, character) {
    if (character === 'THE_VOID') {
      return text
        .replace(/([.?!])\s+/g, '$1 . . . ') 
        .replace(/([a-zA-Z]{5,})(?=\s+[a-zA-Z])/g, '$1, '); 
    } else if (character === 'UNIT-7') {
      return text.replace(/([.?!])\s+/g, '$1 . . . ');
    } else if (character === 'SARAH') {
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
      window.speechSynthesis.cancel();

      const formattedText = this.formatTextForDelivery(text, character);
      const utterance = new SpeechSynthesisUtterance(formattedText);
      const { voice, isFallback } = this.getVoiceForCharacter(character) || {};
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.volume = options.volume || 1.0;

      if (character === 'SARAH') {
        utterance.pitch = 1.1;
        utterance.rate = 1.05; 
      } else if (character === 'UNIT-7') {
        utterance.pitch = 1.0;
        utterance.rate = 1.0; 
      } else if (character === 'THE_VOID') {
        utterance.pitch = 0.4;
        utterance.rate = 0.65; 
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      if (options.pitch) utterance.pitch = options.pitch;
      if (options.rate) utterance.rate = options.rate;

      // Voice Diagnostics (Development)
      if (import.meta.env.DEV) {
        let actualCharacter = character;
        if (character === 'THE_VOID') actualCharacter = 'The Void';
        if (character === 'SARAH') actualCharacter = 'Sarah';
        if (character === 'NARRATOR') actualCharacter = 'Narrator';
        
        console.log(`[VOICE]
Character: ${actualCharacter}
Selected Voice: ${voice ? voice.name : 'System Default'}
Language: ${voice ? voice.lang : 'Unknown'}
Fallback: ${isFallback ? 'Yes' : 'No'}`);
      }

      utterance.onend = () => {
        this.currentUtterance = null; // Free reference
        resolve(true);
      };
      
      utterance.onerror = () => {
        this.currentUtterance = null; // Free reference
        resolve(false); // Resolve anyway so game doesn't hang
      };

      this.currentUtterance = utterance; // Retain strong reference
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
        // Anchor the current gain value to prevent Web Audio from interpolating from the start of the node
        try {
          const currentGain = this.activeSpeechBgGain.gain.value;
          this.activeSpeechBgGain.gain.cancelScheduledValues(ctx.currentTime);
          this.activeSpeechBgGain.gain.setValueAtTime(currentGain, ctx.currentTime);
          this.activeSpeechBgGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        } catch {
          this.activeSpeechBgGain.gain.value = 0;
        }

        const oscToStop = this.activeSpeechBgNode;
        setTimeout(() => {
          try { oscToStop.stop(); } catch {}
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

    // Intelligent Audio Management: Interruption logic
    // Stop any currently playing utterance and background effects
    // to prevent overlapping audio when a skip or scene change occurs.
    this.stop();

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
 
