import fs from 'fs';
import path from 'path';
import pkg from 'wavefile';
const { WaveFile } = pkg;

const DURATION_SECONDS = 30; // 30 seconds is enough for a looping ambient track
const SAMPLE_RATE = 44100;
const TOTAL_SAMPLES = DURATION_SECONDS * SAMPLE_RATE;

// Helper to create a basic wavefile
function createWave(samples) {
  const wav = new WaveFile();
  // 1 channel, 44100 Hz, 32-bit float
  wav.fromScratch(1, SAMPLE_RATE, '32f', samples);
  return wav.toBuffer();
}

// Map - Ambient cyber operations center (Calm 432Hz sine with slow LFO)
function generateMap() {
  const samples = new Float64Array(TOTAL_SAMPLES);
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const lfo = Math.sin(t * 0.1); // Slow 10-second volume swell
    samples[i] = Math.sin(t * 432 * Math.PI * 2) * 0.1 * (0.5 + lfo * 0.2);
  }
  return createWave(samples);
}

// Briefing - Tactical preparation (Rhythmic pulsing at 120bpm)
function generateBriefing() {
  const samples = new Float64Array(TOTAL_SAMPLES);
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const pulse = Math.max(0, Math.sin(t * 2 * Math.PI * 2)); // 2 beats per sec
    samples[i] = (Math.random() - 0.5) * 0.05 * pulse; // filtered noise pulse
  }
  return createWave(samples);
}

// Deployment - Increasing tension (Rising frequency)
function generateDeployment() {
  const samples = new Float64Array(TOTAL_SAMPLES);
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 100 + (t / DURATION_SECONDS) * 100; // 100Hz to 200Hz
    samples[i] = Math.sin(t * freq * Math.PI * 2) * 0.15;
  }
  return createWave(samples);
}

// Gameplay - Focused, technology-inspired (16th note synth arpeggio simulation)
function generateGameplay() {
  const samples = new Float64Array(TOTAL_SAMPLES);
  const notes = [220, 261.63, 329.63, 392.00]; // A minor pentatonic
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const noteIdx = Math.floor(t * 8) % notes.length; // 8 notes per second
    const noteEnvelope = Math.exp(-6 * (t * 8 - Math.floor(t * 8))); // Pluck envelope
    samples[i] = Math.sin(t * notes[noteIdx] * Math.PI * 2) * 0.1 * noteEnvelope;
  }
  return createWave(samples);
}

// Critical - Dark, unsettling corrupted atmosphere
function generateCritical() {
  const samples = new Float64Array(TOTAL_SAMPLES);
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const drone1 = Math.sin(t * 55 * Math.PI * 2); // 55Hz (Low A)
    const drone2 = Math.sin(t * 56.5 * Math.PI * 2); // Detuned beating
    const glitch = Math.random() > 0.999 ? Math.random() * 0.5 : 0;
    samples[i] = (drone1 + drone2) * 0.1 + glitch;
  }
  return createWave(samples);
}

// Debrief - Relief and accomplishment (Major chord)
function generateDebrief() {
  const samples = new Float64Array(TOTAL_SAMPLES);
  // C major pad
  const freqs = [261.63, 329.63, 392.00]; 
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;
    for (const f of freqs) {
      sample += Math.sin(t * f * Math.PI * 2) * 0.05;
    }
    samples[i] = sample;
  }
  return createWave(samples);
}

// Void - Deep, dark drones
function generateVoid() {
  const samples = new Float64Array(TOTAL_SAMPLES);
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] = Math.sin(t * 40 * Math.PI * 2) * 0.2; // 40Hz sub bass
  }
  return createWave(samples);
}

const targetDirs = {
  'map.wav': 'public/audio/ambience',
  'briefing.wav': 'public/audio/briefing',
  'deployment.wav': 'public/audio/deployment',
  'gameplay.wav': 'public/audio/gameplay',
  'critical.wav': 'public/audio/gameplay',
  'debrief.wav': 'public/audio/debrief',
  'void.wav': 'public/audio/ending'
};

const generators = {
  'map.wav': generateMap,
  'briefing.wav': generateBriefing,
  'deployment.wav': generateDeployment,
  'gameplay.wav': generateGameplay,
  'critical.wav': generateCritical,
  'debrief.wav': generateDebrief,
  'void.wav': generateVoid
};

for (const [filename, generator] of Object.entries(generators)) {
  const buf = generator();
  const dir = targetDirs[filename];
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buf);
  console.log(`Generated ${filename}`);
}
