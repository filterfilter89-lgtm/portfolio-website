/* ── Scroll Animation Hero (49-Frame Sequence) ──────────────── */
const TOTAL_FRAMES = 49;
const canvas = document.getElementById('scroll-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const scrollHero = document.getElementById('hero');
const textIntro = document.getElementById('scroll-text-intro');
const textMid = document.getElementById('scroll-text-mid');
const textEnd = document.getElementById('scroll-text-end');
const scrollIndicator = document.getElementById('scroll-indicator');
const progressFill = document.getElementById('scroll-progress-fill');

const frameImages = new Array(TOTAL_FRAMES);
let currentFrame = 0;
let targetFrame = 0;

function getFrameUrl(index) {
  const padded = String(index).padStart(2, '0');
  return `/frames/web${padded}.webp`;
}

function renderFrame(index) {
  if (!ctx || !canvas) return;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Find target image or nearest loaded frame
  let img = frameImages[index];
  if (!img || !img.complete || img.naturalWidth === 0) {
    for (let d = 1; d < TOTAL_FRAMES; d++) {
      if (index - d >= 0 && frameImages[index - d]?.complete && frameImages[index - d].naturalWidth > 0) {
        img = frameImages[index - d];
        break;
      }
      if (index + d < TOTAL_FRAMES && frameImages[index + d]?.complete && frameImages[index + d].naturalWidth > 0) {
        img = frameImages[index + d];
        break;
      }
    }
  }
  if (!img || !img.complete || img.naturalWidth === 0) return;

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'medium';

  // Draw image to fill viewport preserving aspect ratio (object-fit: cover)
  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  const imgRatio = imgWidth / imgHeight;
  const canvasRatio = width / height;

  let drawW, drawH, drawX, drawY;
  if (canvasRatio > imgRatio) {
    drawW = width;
    drawH = width / imgRatio;
    drawX = 0;
    drawY = (height - drawH) / 2;
  } else {
    drawW = height * imgRatio;
    drawH = height;
    drawX = (width - drawW) / 2;
    drawY = 0;
  }

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  renderFrame(currentFrame);
}

function updateScrollAnimation() {
  if (!scrollHero) return;
  const heroRect = scrollHero.getBoundingClientRect();
  const scrollDistance = scrollHero.offsetHeight - window.innerHeight;
  if (scrollDistance <= 0) return;

  // Progress normalized [0, 1]
  const progress = Math.max(0, Math.min(1, -heroRect.top / scrollDistance));

  // Determine frame
  targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
  if (currentFrame !== targetFrame) {
    currentFrame = targetFrame;
    renderFrame(currentFrame);
  }

  // Progress bar
  if (progressFill) {
    progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
  }

  // Text Overlays
  // 1. Intro Text: Visible 0 -> 0.16, fades out 0.16 -> 0.25
  if (textIntro) {
    if (progress <= 0.16) {
      textIntro.style.opacity = '1';
      textIntro.style.transform = `translateY(-${progress * 40}px)`;
      textIntro.style.pointerEvents = 'auto';
    } else if (progress <= 0.25) {
      const fade = 1 - (progress - 0.16) / 0.09;
      textIntro.style.opacity = Math.max(0, fade).toFixed(2);
      textIntro.style.transform = `translateY(-${progress * 40}px)`;
      textIntro.style.pointerEvents = 'none';
    } else {
      textIntro.style.opacity = '0';
      textIntro.style.pointerEvents = 'none';
    }
  }

  // 2. End Play Button Overlay: Fades in 0.76 -> 0.88
  if (textEnd) {
    if (progress < 0.76) {
      textEnd.style.opacity = '0';
      textEnd.style.pointerEvents = 'none';
    } else {
      const enter = Math.min(1, (progress - 0.76) / 0.12);
      textEnd.style.opacity = enter.toFixed(2);
      textEnd.style.pointerEvents = 'auto';
    }
  }

  // Scroll Indicator: Fades out immediately as soon as user begins scrolling
  if (scrollIndicator) {
    if (progress < 0.05) {
      scrollIndicator.style.opacity = (1 - progress / 0.05).toFixed(2);
      scrollIndicator.style.visibility = 'visible';
    } else {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.visibility = 'hidden';
    }
  }
}

// Preload frames with non-blocking async decode and prioritized queue
async function loadSingleFrame(index) {
  if (frameImages[index]?.complete && frameImages[index].naturalWidth > 0) {
    return frameImages[index];
  }
  const img = new Image();
  img.src = getFrameUrl(index);
  try {
    if ('decode' in img) {
      await img.decode();
    }
  } catch (e) {
    // decode fallback if aborted or error
  }
  frameImages[index] = img;
  if (index === currentFrame) {
    renderFrame(currentFrame);
  }
  return img;
}

async function preloadFrames() {
  // 1. Immediately load & decode frame 0 for instant crisp initial render
  await loadSingleFrame(0);
  resizeCanvas();
  renderFrame(0);
  updateScrollAnimation();

  // 2. Preload immediate scroll buffer (frames 1 to 6)
  for (let i = 1; i <= Math.min(6, TOTAL_FRAMES - 1); i++) {
    loadSingleFrame(i);
  }

  // 3. Batch load remaining frames in small non-blocking chunks
  const batchSize = 4;
  for (let i = 7; i < TOTAL_FRAMES; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
      batch.push(loadSingleFrame(j));
    }
    await Promise.all(batch);
  }
}

if (canvas) {
  preloadFrames();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  let isTicking = false;
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateScrollAnimation();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Clicking on canvas when at blue play button screen navigates to the album page
  canvas.addEventListener('click', () => {
    if (currentFrame >= 42) {
      openAlbumPage();
    }
  });
}

/* ── Page Navigation Controller ──────────────────────────────── */
const reelPlayBtn = document.getElementById('reel-play-btn');

function openAlbumPage() {
  window.location.href = 'work.html';
}

if (reelPlayBtn) {
  reelPlayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openAlbumPage();
  });
}



/* ── Album Carousel ─────────────────────────────────────────── */
const albumViewport = document.querySelector('.album-viewport');
const albumSection = document.getElementById('work');
const albumGroup = document.querySelector('.album-group');
const albumPause = document.getElementById('albums-pause');

if (albumViewport && albumGroup) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const albumRepeat = albumGroup.cloneNode(true);
  albumRepeat.setAttribute('aria-hidden', 'true');
  albumRepeat.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
  const track = document.querySelector('.album-track');
  if (track) track.append(albumRepeat);

  let albumsPaused = reducedMotion.matches;
  const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let albumWidth = albumGroup.getBoundingClientRect().width;
  let lastFrame;
  let albumPosition = 0;
  new ResizeObserver(() => {
    const w = albumGroup.getBoundingClientRect().width;
    if (w > 0) albumWidth = w;
  }).observe(albumGroup);

  function updateAlbumPause() {
    if (!albumPause) return;
    albumPause.setAttribute('aria-pressed', String(albumsPaused));
    albumPause.setAttribute('aria-label', albumsPaused ? 'Play album scrolling' : 'Pause album scrolling');
    const playIcon = albumPause.querySelector('.icon-play');
    const pauseIcon = albumPause.querySelector('.icon-pause');
    if (playIcon && pauseIcon) {
      playIcon.style.display = albumsPaused ? 'block' : 'none';
      pauseIcon.style.display = albumsPaused ? 'none' : 'block';
    } else {
      albumPause.textContent = albumsPaused ? '▶' : 'Ⅱ';
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('page-work')) {
      window.location.href = 'index.html';
    }
  });

  if (albumPause) {
    albumPause.addEventListener('click', () => { albumsPaused = !albumsPaused; updateAlbumPause(); });
  }

  albumViewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') { albumsPaused = true; updateAlbumPause(); }
  });
  albumViewport.addEventListener('wheel', () => { albumsPaused = true; updateAlbumPause(); }, { passive: true });

  document.querySelectorAll('#albums-previous, #albums-next').forEach(button => {
    button.addEventListener('click', () => {
      albumsPaused = true;
      updateAlbumPause();
      const firstCard = albumGroup.querySelector('a');
      const step = firstCard ? firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(albumGroup).gap) : 300;
      const direction = button.id === 'albums-next' ? 1 : -1;
      albumViewport.scrollLeft = (albumViewport.scrollLeft + direction * step + (albumWidth || 1000)) % (albumWidth || 1000);
    });
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { albumsPaused = true; updateAlbumPause(); }
  });

  function scrollAlbums(time) {
    const elapsed = lastFrame === undefined ? 0 : Math.min(time - lastFrame, 50);
    lastFrame = time;
    const albumHovered = hoverPointer.matches && albumSection && albumSection.matches(':hover');
    if (!albumsPaused && !albumHovered && !albumViewport.contains(document.activeElement) && !document.hidden && albumWidth > 0) {
      albumPosition = (albumPosition + elapsed * 0.035) % albumWidth;
      albumViewport.scrollLeft = albumPosition;
    } else {
      albumPosition = albumViewport.scrollLeft;
    }
    requestAnimationFrame(scrollAlbums);
  }

  updateAlbumPause();
  requestAnimationFrame(scrollAlbums);
}

const copyEmail = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
let copyStatusTimer;
if (copyEmail) {
  copyEmail.addEventListener('click', async () => {
    clearTimeout(copyStatusTimer);
    try {
      await navigator.clipboard.writeText('basiljose8989@gmail.com');
      if (copyStatus) copyStatus.textContent = 'Copied';
    } catch {
      if (copyStatus) copyStatus.textContent = 'Select the email to copy';
    }
    copyStatusTimer = setTimeout(() => { if (copyStatus) copyStatus.textContent = ''; }, 3500);
  });
}

// The optional soundtrack is synthesized locally; no audio downloads or autoplay.
const soundToggle = document.getElementById('sound-toggle');
let audioContext;
let masterGain;
let musicTimer;
let soundOn = false;
let nextBeat = 0;
let beat = 0;
const chords = [[130.81, 164.81, 196, 246.94], [110, 130.81, 164.81, 196], [87.31, 110, 130.81, 164.81], [98, 123.47, 146.83, 174.61]];

function tone(frequency, start, duration, volume, type = 'sine') {
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + 0.025);
  envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
  oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
}

function scheduleMusic() {
  while (nextBeat < audioContext.currentTime + 0.15) {
    const chord = chords[Math.floor(beat / 8) % chords.length];
    if (beat % 4 === 0) chord.forEach(frequency => tone(frequency, nextBeat, 1.7, 0.065, 'triangle'));
    if (beat % 2 === 0) {
      tone(chord[0] / 2, nextBeat, 0.45, 0.2);
      tone(55, nextBeat, 0.12, 0.18);
    }
    if (beat % 4 === 2) tone(185, nextBeat, 0.055, 0.035, 'triangle');
    if (beat % 2 === 1) tone(chord[(beat + 1) % 4] * 4, nextBeat, 0.3, 0.035);
    beat++;
    nextBeat += 60 / 86 / 2;
  }
}

if (soundToggle) {
  soundToggle.addEventListener('click', async () => {
    soundToggle.disabled = true;
    try {
      if (!audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) throw new Error('Audio is not supported');
        audioContext = new AudioContextClass();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.4;
        masterGain.connect(audioContext.destination);
      }
      if (soundOn) {
        clearInterval(musicTimer);
        await audioContext.suspend();
        soundOn = false;
      } else {
        await audioContext.resume();
        nextBeat = audioContext.currentTime + 0.05;
        scheduleMusic();
        musicTimer = setInterval(scheduleMusic, 80);
        soundOn = true;
      }
      soundToggle.setAttribute('aria-pressed', String(soundOn));
      const soundLabel = document.getElementById('sound-label');
      if (soundLabel) soundLabel.textContent = soundOn ? 'SOUND ON' : 'SOUND OFF';
      soundToggle.setAttribute('aria-label', soundOn ? 'Turn background music off' : 'Turn background music on');
    } catch {
      const soundLabel = document.getElementById('sound-label');
      if (soundLabel) soundLabel.textContent = 'UNAVAILABLE';
      soundToggle.setAttribute('aria-label', 'Background audio is unavailable in this browser');
    } finally {
      soundToggle.disabled = false;
    }
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
