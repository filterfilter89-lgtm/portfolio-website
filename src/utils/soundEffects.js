/**
 * Procedural Analog Sound Effects Engine (Web Audio API)
 * Generates tactile, physical paper/stationery audio cues:
 * - Card sliding out of envelope
 * - 3D Card flip whoosh & snap
 * - Card landing / desk thud
 * - Mechanical micro-clicks
 */

let audioCtx = null;
let isMuted = typeof window !== 'undefined' ? localStorage.getItem('portfolio_sound_muted') === 'true' : false;
const listeners = new Set();

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getIsMuted() {
  return isMuted;
}

export function toggleMute() {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio_sound_muted', isMuted ? 'true' : 'false');
  }
  listeners.forEach((fn) => fn(isMuted));
  if (!isMuted) {
    playClick();
  }
  return isMuted;
}

export function subscribeSoundState(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

let sharedNoiseBuffer = null;

function getSharedNoiseBuffer(ctx) {
  if (sharedNoiseBuffer && sharedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return sharedNoiseBuffer;
  }
  const bufferSize = Math.floor(ctx.sampleRate * 0.35);
  sharedNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = sharedNoiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.45;
  }
  return sharedNoiseBuffer;
}

// 1. Crisp Heavy Cardstock Sliding Out of Envelope
export function playCardSlide() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const noise = ctx.createBufferSource();
  noise.buffer = getSharedNoiseBuffer(ctx);

  // Resonant bandpass filter sweeping from 600Hz to 1400Hz (paper sliding against paper)
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 2.2;
  filter.frequency.setValueAtTime(600, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.18);
  filter.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.28);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  noise.stop(ctx.currentTime + 0.29);
}

// 2. Physical 3D Card Flip & Air Whoosh
export function playCardFlip() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // A. Low air displacement whoosh
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + 0.24);

  oscGain.gain.setValueAtTime(0.001, now);
  oscGain.gain.linearRampToValueAtTime(0.22, now + 0.05);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);

  // B. Card flap friction texture
  const noise = ctx.createBufferSource();
  noise.buffer = getSharedNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.8;
  filter.frequency.setValueAtTime(1200, now + 0.02);
  filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.001, now);
  noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.04);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(now + 0.02);
  noise.stop(now + 0.18);
}

// 3. Soft Card Landing / Desk Thud
export function playDeskThud() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

// 4. Subtle Tactile Mechanical Micro-Click
export function playClick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.03);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.035);
}
