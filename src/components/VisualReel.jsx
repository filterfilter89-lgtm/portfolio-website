import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 49;

function getFrameUrl(index) {
  const padded = String(index).padStart(2, '0');
  return `/frames/web${padded}.webp`;
}

export default function VisualReel({ onPlay, isReturning = false, isActive = true }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const playBtnRef = useRef(null);
  const progressFillRef = useRef(null);
  const endOverlayRef = useRef(null);

  const currentFrameRef = useRef(isReturning ? TOTAL_FRAMES - 1 : 0);
  const framesRef = useRef(new Array(TOTAL_FRAMES));
  const [playVisible, setPlayVisible] = useState(isReturning);

  // Load single frame helper with memoized promise tracking
  const loadingPromisesRef = useRef({});

  // Render a specific frame to canvas
  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

    ctx.clearRect(0, 0, width, height);
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

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const loadSingleFrame = useCallback(async (index) => {
    if (index < 0 || index >= TOTAL_FRAMES) return null;
    const frames = framesRef.current;
    if (frames[index]?.complete && frames[index].naturalWidth > 0) {
      return frames[index];
    }
    if (loadingPromisesRef.current[index]) {
      return loadingPromisesRef.current[index];
    }

    const loadPromise = new Promise((resolve) => {
      const img = new Image();
      img.src = getFrameUrl(index);

      const onDone = () => {
        frames[index] = img;
        delete loadingPromisesRef.current[index];
        // If current frame is this index or adjacent, re-render immediately
        if (currentFrameRef.current === index || Math.abs(currentFrameRef.current - index) <= 1) {
          renderFrame(currentFrameRef.current);
        }
        resolve(img);
      };

      if ('decode' in img) {
        img.decode().then(onDone).catch(onDone);
      } else {
        img.onload = onDone;
        img.onerror = onDone;
      }
    });

    loadingPromisesRef.current[index] = loadPromise;
    return loadPromise;
  }, [renderFrame]);

  // Handle canvas sizing for sharp retina display
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Initial & return scroll position handling
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (isReturning || (typeof window !== 'undefined' && window.location.hash === '#reel')) {
      const scrollToBottom = () => {
        const container = containerRef.current;
        const maxScroll = container
          ? container.offsetHeight - window.innerHeight
          : document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll > 0) {
          window.scrollTo({ top: maxScroll, behavior: 'instant' });
        }
      };
      scrollToBottom();
      requestAnimationFrame(scrollToBottom);
      setTimeout(scrollToBottom, 50);

      currentFrameRef.current = TOTAL_FRAMES - 1;
      renderFrame(TOTAL_FRAMES - 1);

      if (endOverlayRef.current) {
        endOverlayRef.current.style.opacity = '1';
        endOverlayRef.current.style.pointerEvents = 'auto';
        setPlayVisible(true);
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.width = '100%';
      }
    }
  }, [isReturning, renderFrame, isActive]);

  // Preload sequence: prioritize anchor frames (0 and 48) immediately
  useEffect(() => {
    let isCancelled = false;

    async function preloadAll() {
      // 1. Immediately load & decode both essential anchor frames
      await Promise.all([
        loadSingleFrame(0),
        loadSingleFrame(TOTAL_FRAMES - 1)
      ]);
      if (isCancelled) return;

      resizeCanvas();
      const initialFrame = currentFrameRef.current;
      renderFrame(initialFrame);

      // 2. Preload surrounding frames
      if (initialFrame >= TOTAL_FRAMES - 1) {
        const backFrames = [47, 46, 45, 44, 43, 42, 41, 40];
        await Promise.all(backFrames.map(f => loadSingleFrame(f)));
      } else {
        const forwardFrames = [1, 2, 3, 4, 5, 6, 7, 8];
        await Promise.all(forwardFrames.map(f => loadSingleFrame(f)));
      }
      if (isCancelled) return;

      // 3. Preload all remaining frames in non-blocking batches
      const remaining = [];
      const currentCache = framesRef.current;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!currentCache[i]) remaining.push(i);
      }
      const batchSize = 4;
      for (let i = 0; i < remaining.length; i += batchSize) {
        if (isCancelled) return;
        const batch = remaining.slice(i, i + batchSize);
        await Promise.all(batch.map(idx => loadSingleFrame(idx)));
      }
    }

    preloadAll();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    return () => {
      isCancelled = true;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [loadSingleFrame, resizeCanvas, renderFrame]);

  // Handle scroll animation scrub
  useEffect(() => {
    if (!isActive) return;
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const container = containerRef.current;
          if (!container) {
            ticking = false;
            return;
          }

          const heroRect = container.getBoundingClientRect();
          const scrollDistance = container.offsetHeight - window.innerHeight;
          if (scrollDistance <= 0) {
            ticking = false;
            return;
          }

          const progress = Math.max(0, Math.min(1, -heroRect.top / scrollDistance));
          const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

          if (currentFrameRef.current !== targetFrame) {
            currentFrameRef.current = targetFrame;
            loadSingleFrame(targetFrame);
            if (targetFrame > 0) loadSingleFrame(targetFrame - 1);
            if (targetFrame < TOTAL_FRAMES - 1) loadSingleFrame(targetFrame + 1);
            renderFrame(targetFrame);
          }

          // Progress fill
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
          }

          // Play button visibility: ONLY at the end of the frame (frame 48)
          if (endOverlayRef.current) {
            const isAtEnd = targetFrame >= TOTAL_FRAMES - 1 && progress >= 0.98;
            if (!isAtEnd) {
              endOverlayRef.current.style.opacity = '0';
              endOverlayRef.current.style.pointerEvents = 'none';
            } else {
              endOverlayRef.current.style.opacity = '1';
              endOverlayRef.current.style.pointerEvents = 'auto';
            }
            setPlayVisible((prev) => (prev !== isAtEnd ? isAtEnd : prev));
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [renderFrame, loadSingleFrame, isActive]);

  const handleTriggerPlay = (e) => {
    e?.preventDefault?.();
    // Strictly require being at the final frame (frame 48) after scrolling
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
          <div
            className="scroll-text scroll-text--end"
            ref={endOverlayRef}
            aria-hidden={!playVisible}
          >
            <button
              type="button"
              ref={playBtnRef}
              className="canvas-play-hitbox"
              id="reel-play-btn"
              onClick={handleTriggerPlay}
              aria-label="Open vinyl album portfolio"
            >
              <span className="play-pulse-ring" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="scroll-progress" aria-hidden="true">
          <div className="scroll-progress-fill" ref={progressFillRef} />
        </div>
      </div>
    </div>
  );
}
