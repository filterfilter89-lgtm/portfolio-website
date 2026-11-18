import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 49;

function getFrameUrl(index) {
  const padded = String(index).padStart(2, '0');
  return `/frames/web${padded}.webp`;
}

const STAMP_URLS = [
  '/projects/graphic-designs/eazyarts-ganesh/slide%201.png',
  '/projects/graphic-designs/fetto-garments/Artboard%201%20copy%202.png',
  '/projects/graphic-designs/fouz-travels/FOUZ%20POSTER%201.png',
  '/projects/graphic-designs/fruitly/1.png',
  '/projects/videography/dot-store/realme-thumb.webp',
  '/projects/videography/eazyarts/Big%20mistake-thumb.webp',
  '/projects/videography/final-3/FINAL%203-thumb.webp',
  '/projects/videography/josh-talks/Elon%20Musk%20Flying%20Car-thumb.webp',
  '/projects/videography/real-estate/real%20estate%20sample-thumb.webp'
];

function preloadStamps() {
  STAMP_URLS.forEach((url) => {
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = url;
  });
}

export default function VisualReel({ onPlay, isReturning = false, isActive = true, onProgress }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const playBtnRef = useRef(null);
  const progressFillRef = useRef(null);
  const introOverlayRef = useRef(null);
  const endOverlayRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const currentFrameRef = useRef(isReturning ? TOTAL_FRAMES - 1 : 0);
  const frameIndexRef = currentFrameRef;
  const framesRef = useRef(new Array(TOTAL_FRAMES));
  const ctxRef = useRef(null);
  const [playVisible, setPlayVisible] = useState(isReturning);

  // Load single frame helper with memoized promise tracking
  const loadingPromisesRef = useRef({});

  const scrollMetricsRef = useRef({ scrollDistance: 1, containerTop: 0 });

  // Update cached scroll metrics without triggering layout thrash on scroll
  const updateScrollMetrics = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollDistance = container.offsetHeight - window.innerHeight;
    scrollMetricsRef.current = {
      scrollDistance: Math.max(1, scrollDistance),
      containerTop: rect.top + (window.scrollY || window.pageYOffset || 0)
    };
  }, []);

  // Render a specific frame to canvas with zero redundant clear passes
  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = ctxRef.current || (ctxRef.current = canvas.getContext('2d', { desynchronized: true }));
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const frames = framesRef.current;

    // Find requested frame or fallback to closest loaded frame
    let img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        if (index - d >= 0 && frames[index - d]?.complete && frames[index - d].naturalWidth > 0) {
          img = frames[index - d];
          break;
        }
        if (index + d < TOTAL_FRAMES && frames[index + d]?.complete && frames[index + d].naturalWidth > 0) {
          img = frames[index + d];
          break;
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';

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

    // Only clear if the image doesn't completely cover the canvas bounds
    if (drawX > 0 || drawY > 0 || drawW < width || drawH < height) {
      ctx.clearRect(0, 0, width, height);
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const loadSingleFrame = useCallback((index) => {
    if (index < 0 || index >= TOTAL_FRAMES) return Promise.resolve(null);
    const frames = framesRef.current;
    if (frames[index]?.complete && frames[index].naturalWidth > 0) {
      return Promise.resolve(frames[index]);
    }
    if (loadingPromisesRef.current[index]) {
      return loadingPromisesRef.current[index];
    }

    const loadPromise = new Promise((resolve) => {
      const img = new Image();
      const onDone = () => {
        if (img.naturalWidth > 0) {
          frames[index] = img;
        }
        delete loadingPromisesRef.current[index];
        // If current frame is this index or adjacent, re-render immediately
        if (currentFrameRef.current === index || Math.abs(currentFrameRef.current - index) <= 1) {
          renderFrame(currentFrameRef.current);
        }
        resolve(img);
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(onDone).catch(onDone);
        } else {
          onDone();
        }
      };
      img.onerror = () => {
        delete loadingPromisesRef.current[index];
        resolve(null);
      };
      img.src = getFrameUrl(index);
    });

    loadingPromisesRef.current[index] = loadPromise;
    return loadPromise;
  }, [renderFrame]);

  // Handle canvas sizing for sharp retina display & cache layout geometry
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = ctxRef.current || (ctxRef.current = canvas.getContext('2d', { desynchronized: true }));
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    updateScrollMetrics();
    renderFrame(currentFrameRef.current);
  }, [renderFrame, updateScrollMetrics]);

  const updateMeasurements = updateScrollMetrics;
  const drawFrame = renderFrame;

  // Initial & return scroll position handling
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!isActive || !isReturning) return;

    // Safeguard: Ensure DOM body classes and overflow are unlocked
    if (typeof document !== 'undefined') {
      document.body.classList.remove('page-work', 'page-contact', 'is-showcase-active');
      document.body.classList.add('page-reel');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    const syncToEnd = () => {
      const el = containerRef.current;
      const maxScroll = el
        ? el.offsetHeight - window.innerHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        window.scrollTo({ top: maxScroll, behavior: 'instant' });
      }
      updateMeasurements();
    };
    syncToEnd();
    const rafId = requestAnimationFrame(syncToEnd);
    frameIndexRef.current = TOTAL_FRAMES - 1;
    drawFrame(TOTAL_FRAMES - 1);

    if (introOverlayRef.current) {
      introOverlayRef.current.style.opacity = '0';
      introOverlayRef.current.style.pointerEvents = 'none';
    }
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = '0';
      scrollIndicatorRef.current.style.visibility = 'hidden';
    }
    if (endOverlayRef.current) {
      endOverlayRef.current.style.opacity = '1';
      endOverlayRef.current.style.pointerEvents = 'auto';
      setPlayVisible(true);
    }
    if (progressFillRef.current) {
      progressFillRef.current.style.width = '100%';
    }
    if (onProgress) {
      onProgress(1);
    }

    // Only cancel RAF if scroll has already safely reached maxScroll!
    // Never cancel if window.scrollY is still near 0, preventing accidental cancellation before scroll locks.
    const cancelSync = () => {
      const el = containerRef.current;
      const maxScroll = el
        ? el.offsetHeight - window.innerHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll * 0.8) {
        cancelAnimationFrame(rafId);
      }
    };
    window.addEventListener('wheel', cancelSync, { passive: true });
    window.addEventListener('touchstart', cancelSync, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', cancelSync);
      window.removeEventListener('touchstart', cancelSync);
    };
  }, [isActive, isReturning]);

  // Prioritized smart preloader: ensures instant start & non-blocking background streaming
  useEffect(() => {
    let isCancelled = false;

    async function preloadAll() {
      // 1. Immediately load & render anchor frames 0 and 48
      await Promise.all([
        loadSingleFrame(0),
        loadSingleFrame(TOTAL_FRAMES - 1)
      ]);
      if (isCancelled) return;

      resizeCanvas();
      renderFrame(currentFrameRef.current);

      // Preload 9 small postage stamps in idle time now that Frame 0 has painted
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(preloadStamps, { timeout: 1500 });
      } else {
        setTimeout(preloadStamps, 300);
      }

      // 2. High-priority prefetch of initial frames (1 to 8) for instant scroll response
      for (let i = 1; i <= 8; i++) {
        if (isCancelled) return;
        await loadSingleFrame(i);
      }

      // 3. Background streaming for remaining frames (9 to 47) in non-blocking batches
      const loadNextChunk = (startIndex) => {
        if (isCancelled || startIndex >= TOTAL_FRAMES - 1) return;
        const chunkEnd = Math.min(TOTAL_FRAMES - 1, startIndex + 4);
        const chunk = [];
        for (let i = startIndex; i < chunkEnd; i++) {
          chunk.push(loadSingleFrame(i));
        }
        Promise.all(chunk).then(() => {
          if (isCancelled) return;
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            window.requestIdleCallback(() => loadNextChunk(chunkEnd), { timeout: 160 });
          } else {
            setTimeout(() => loadNextChunk(chunkEnd), 35);
          }
        });
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadNextChunk(9), { timeout: 200 });
      } else {
        setTimeout(() => loadNextChunk(9), 60);
      }
    }

    preloadAll();

    return () => {
      isCancelled = true;
    };
  }, [loadSingleFrame, resizeCanvas, renderFrame]);

  // Immediate canvas setup and paint whenever isActive transitions to true
  useEffect(() => {
    if (!isActive) return;
    const rafId = requestAnimationFrame(() => {
      resizeCanvas();
      renderFrame(currentFrameRef.current);
    });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive, resizeCanvas, renderFrame]);

  // High-performance scroll animation scrub & overlays (Zero Layout Thrash)
  useEffect(() => {
    if (!isActive) return;
    let ticking = false;

    updateScrollMetrics();

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const { scrollDistance, containerTop } = scrollMetricsRef.current;
          if (scrollDistance <= 0) {
            ticking = false;
            return;
          }

          const currentY = window.scrollY || window.pageYOffset || 0;
          const progress = Math.max(0, Math.min(1, (currentY - containerTop) / scrollDistance));
          const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

          // Safeguard: when isReturning is active, suppress false frame-0 snap during initial layout settlement
          if (isReturning && currentY < scrollDistance * 0.1 && targetFrame === 0) {
            ticking = false;
            return;
          }

          if (currentFrameRef.current !== targetFrame) {
            currentFrameRef.current = targetFrame;
            loadSingleFrame(targetFrame);
            if (targetFrame > 0) loadSingleFrame(targetFrame - 1);
            if (targetFrame < TOTAL_FRAMES - 1) loadSingleFrame(targetFrame + 1);
            renderFrame(targetFrame);
          }

          // Progress fill & notify parent
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
          }
          if (onProgress) {
            onProgress(progress);
          }

          // 1. Intro Text: Visible 0 -> 0.16, fades out 0.16 -> 0.25
          if (introOverlayRef.current) {
            if (progress <= 0.16) {
              introOverlayRef.current.style.opacity = '1';
              introOverlayRef.current.style.transform = `translateY(-${progress * 40}px)`;
              introOverlayRef.current.style.pointerEvents = 'auto';
            } else if (progress <= 0.25) {
              const fade = 1 - (progress - 0.16) / 0.09;
              introOverlayRef.current.style.opacity = Math.max(0, fade).toFixed(2);
              introOverlayRef.current.style.transform = `translateY(-${progress * 40}px)`;
              introOverlayRef.current.style.pointerEvents = 'none';
            } else {
              introOverlayRef.current.style.opacity = '0';
              introOverlayRef.current.style.pointerEvents = 'none';
            }
          }

          // 2. Scroll Indicator: Fades out immediately as user begins scrolling (< 0.05)
          if (scrollIndicatorRef.current) {
            if (progress < 0.05) {
              scrollIndicatorRef.current.style.opacity = (1 - progress / 0.05).toFixed(2);
              scrollIndicatorRef.current.style.visibility = 'visible';
            } else {
              scrollIndicatorRef.current.style.opacity = '0';
              scrollIndicatorRef.current.style.visibility = 'hidden';
            }
          }

          // 3. Play Button End Overlay: Appears only at the end of the frame (Frame 48, progress >= 0.98)
          if (endOverlayRef.current) {
            if (targetFrame < TOTAL_FRAMES - 1 || progress < 0.98) {
              endOverlayRef.current.style.opacity = '0';
              endOverlayRef.current.style.pointerEvents = 'none';
              setPlayVisible(false);
            } else {
              endOverlayRef.current.style.opacity = '1';
              endOverlayRef.current.style.pointerEvents = 'auto';
              setPlayVisible(true);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [renderFrame, loadSingleFrame, isActive, updateScrollMetrics, isReturning]);

  const handleTriggerPlay = (e) => {
    e?.preventDefault?.();
    // Allow triggering only when at the end of the frame (Frame 48 / progress >= 0.98)
    if (currentFrameRef.current < TOTAL_FRAMES - 1) return;

    let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (playBtnRef.current) {
      const rect = playBtnRef.current.getBoundingClientRect();
      origin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    if (onPlay) {
      onPlay(origin);
    }
  };

  return (
    <div className="scroll-hero" ref={containerRef} id="hero" aria-label="Interactive visual reel animation">
      <div className="scroll-hero__sticky">
        <canvas
          className="scroll-canvas"
          ref={canvasRef}
          aria-label="Animated visual reel of Basil Jose"
        />

        <div className="scroll-overlay">
          {/* Top Intro Overlay: Real Editable Text with Flapstick DEMO Font */}
          <div
            className="scroll-text scroll-text--intro scroll-overlay__stage"
            ref={introOverlayRef}
            id="scroll-text-intro"
          >
            {/* Desktop arrangement */}
            <div className="hero-flapstick-desktop">
              <div className="hero-flapstick-left" id="hero-title-left">
                <h1 className="hero-flapstick-name">Basil</h1>
              </div>
              <div className="hero-flapstick-right" id="hero-title-right">
                <h1 className="hero-flapstick-name"><span className="hero-letter-j">J</span>ose</h1>
              </div>
            </div>

            {/* Small minimal instruction indicating users can scroll */}
            <div className="hero-scroll-instruction" ref={scrollIndicatorRef}>
              <span className="scroll-instruction-text">SCROLL &#8595;</span>
            </div>
          </div>

          {/* End Play Button Overlay */}
          <div
            className="scroll-text scroll-text--end"
            ref={endOverlayRef}
            aria-hidden={!playVisible}
          >
            <button
              type="button"
              ref={playBtnRef}
              className={`canvas-play-hitbox ${playVisible ? "is-pulse" : ""}`}
              id="reel-play-btn"
              onClick={handleTriggerPlay}
              aria-label="Open vinyl album portfolio"
            />
          </div>
        </div>



        {/* Scroll Progress Bar */}
        <div className="scroll-progress" aria-hidden="true">
          <div className="scroll-progress-fill" ref={progressFillRef} />
        </div>
      </div>
    </div>
  );
}
