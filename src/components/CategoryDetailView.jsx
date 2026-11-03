import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { getCategoryById } from '../data/categories';

export default function CategoryDetailView({ categoryId, onBack, onSelectProject }) {
  const category = getCategoryById(categoryId);
  const projects = category?.projects || [];

  // Middle project index as initial center (e.g. index 2 for 5 projects)
  const initialCenterIdx = Math.floor(projects.length / 2);
  const [isClosing, setIsClosing] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Responsive dimensions for exact arc geometry
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  }));

  useEffect(() => {
    function handleResize() {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width: vw, height: vh } = viewportSize;
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;

  // Exact same album card size as in AlbumCarousel.jsx (1:1 square aspect ratio)
  const cardWidth = isMobile
    ? Math.min(270, Math.floor(vw * 0.72))
    : isTablet
    ? Math.min(340, Math.floor(vh * 0.42))
    : Math.min(420, Math.max(340, Math.floor(vh * 0.44)));

  // Large vinyl disc scaled to fit authentically inside the album jacket (90% of cardWidth)
  const discSize = Math.floor(cardWidth * 0.90);

  // Equal spacing between adjacent vinyls (matching cardGap in AlbumCarousel)
  const discGap = isMobile ? 24 : isTablet ? 36 : 48;
  const discStep = discSize + discGap;

  // Arc Radius for circular dome curve
  const arcRadius = isMobile ? 1400 : isTablet ? 1900 : 2500;

  // Apex height for center active vinyl (balanced in upper screen)
  const apexY = -Math.round(vh * 0.44);

  // Vertical offsets relative to sleeve mouth:
  // dockY: resting completely inside sleeve (no protrusion)
  // riseY: elevated as a single unified stack right above the mouth before fanning out
  const dockY = Math.round(cardWidth * 0.52);
  const riseY = -Math.floor(cardWidth * 0.52);

  // Continuous 60FPS Lerp carousel physics for infinite looping
  const initialScroll = initialCenterIdx * discStep;
  const currentScrollRef = useRef(initialScroll);
  const targetScrollRef = useRef(initialScroll);
  const [scrollProgress, setScrollProgress] = useState(initialScroll);
  const snapTimeoutRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, scroll: 0 });

  // 60FPS Lerp loop
  useEffect(() => {
    let animId;
    function loop() {
      const diff = targetScrollRef.current - currentScrollRef.current;
      if (Math.abs(diff) > 0.05) {
        currentScrollRef.current += diff * 0.1;
        setScrollProgress(currentScrollRef.current);
      }
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Set entrance settled after initial fan-out animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 820);
    return () => clearTimeout(timer);
  }, []);

  // Wheel / Trackpad scroll listener to spin the vinyl carousel in an infinite loop
  useEffect(() => {
    function handleWheel(e) {
      if (isClosing) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      // Free unbounded scrolling for infinite loop
      targetScrollRef.current += delta * 1.6;

      // Debounced magnetic snap to nearest slot on rest
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(() => {
        const nearest = Math.round(targetScrollRef.current / discStep);
        targetScrollRef.current = nearest * discStep;
      }, 140);
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [discStep, isClosing]);

  // Touch gesture support for mobile / tablet trackpad
  const handleTouchStart = (e) => {
    if (isClosing) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      scroll: targetScrollRef.current
    };
  };

  const handleTouchMove = (e) => {
    if (isClosing) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    targetScrollRef.current = touchStartRef.current.scroll - dx * 1.5;
  };

  const handleTouchEnd = () => {
    if (isClosing) return;
    const nearest = Math.round(targetScrollRef.current / discStep);
    targetScrollRef.current = nearest * discStep;
  };

  // Close handler: retract vinyls into single stack, then slide inside sleeve
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onBack();
    }, 540);
  }, [isClosing, onBack]);

  // Select project handler: captures active disc center coordinates and notifies parent
  const handleSelectActiveProject = useCallback((project, e) => {
    if (isClosing) return;
    let origin = null;
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      origin = {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2)
      };
    } else {
      origin = {
        x: Math.round(vw / 2),
        y: Math.round(vh / 2 + apexY)
      };
    }
    if (onSelectProject) onSelectProject(project, origin);
  }, [apexY, isClosing, onSelectProject, vh, vw]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (e.key === 'Enter') {
        if (isClosing) return;
        const currentIdx = Math.round(targetScrollRef.current / discStep);
        const projIndex = ((currentIdx % projects.length) + projects.length) % projects.length;
        const activeProj = projects[projIndex];
        if (activeProj) {
          handleSelectActiveProject(activeProj);
        }
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const currentIdx = Math.round(targetScrollRef.current / discStep);
        targetScrollRef.current = (currentIdx + 1) * discStep;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const currentIdx = Math.round(targetScrollRef.current / discStep);
        targetScrollRef.current = (currentIdx - 1) * discStep;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [discStep, handleClose, handleSelectActiveProject, isClosing, projects]);

  // Virtual window of visible slots centered around current scroll position
  const centerK = Math.round(scrollProgress / discStep);
  // During entrance, show the 5 projects fanning out from center. Once entered, expand virtual window to 9 slots for seamless infinite looping.
  const visibleRange = !hasEntered ? 2 : 4;
  const centerForSlots = !hasEntered ? initialCenterIdx : centerK;
  const visibleSlots = [];
  for (let offset = -visibleRange; offset <= visibleRange; offset++) {
    visibleSlots.push(centerForSlots + offset);
  }

  return (
    <div
      className={`category-page-stage ${isClosing ? 'is-closing' : 'is-entering'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Center Stage: Equal-Spaced Curved Looping Vinyl Carousel Track ── */}
      <div className="category-vinyl-stage">
        <div
          className="project-vinyls-container"
          style={{ '--card-width': `${cardWidth}px` }}
        >
          {visibleSlots.map((k) => {
            const projIndex = ((k % projects.length) + projects.length) % projects.length;
            const project = projects[projIndex];
            if (!project) return null;

            // Horizontal offset from center of arc
            const dx = (k * discStep) - scrollProgress;

            // Circular dome arc calculations:
            const sinTheta = Math.max(-0.96, Math.min(0.96, dx / arcRadius));
            const thetaRad = Math.asin(sinTheta);
            const thetaDeg = thetaRad * (180 / Math.PI);
            const dropY = arcRadius * (1 - Math.cos(thetaRad));

            const targetX = Math.round(dx);
            const targetY = Math.round(apexY + dropY);
            const targetRotate = thetaDeg;

            const isActive = k === centerK;
            const scale = isActive ? 1.05 : 0.96;
            const zIndex = isActive ? 40 : 25 - Math.min(20, Math.round(Math.abs(dx) / discStep));

            return (
              <motion.div
                key={k}
                className={`project-vinyl-item ${isActive ? 'is-active' : ''}`}
                initial={
                  !hasEntered
                    ? {
                        x: 0,
                        y: dockY,
                        rotate: 0,
                        scale: 0.7,
                        opacity: 0
                      }
                    : false
                }
                animate={
                  isClosing
                    ? {
                        // Gather inward into single unified stack at center and slide down
                        x: [targetX, 0, 0],
                        y: [targetY, riseY, dockY],
                        rotate: [targetRotate, 0, 0],
                        scale: [scale, 0.96, 0.7],
                        opacity: [1, 1, 0]
                      }
                    : !hasEntered
                    ? {
                        // Rise straight UP out of sleeve as ONE cohesive stack, then fan out
                        x: [0, 0, targetX],
                        y: [dockY, riseY, targetY],
                        rotate: [0, 0, targetRotate],
                        scale: [0.7, 0.96, scale],
                        opacity: [0, 1, 1]
                      }
                    : {
                        // 60FPS continuous lerp spin along the arc
                        x: targetX,
                        y: targetY,
                        rotate: targetRotate,
                        scale,
                        opacity: 1
                      }
                }
                transition={
                  isClosing
                    ? {
                        duration: 0.52,
                        times: [0, 0.48, 1],
                        ease: [0.22, 1, 0.36, 1]
                      }
                    : !hasEntered
                    ? {
                        duration: 0.80,
                        delay: 0.08,
                        times: [0, 0.38, 1],
                        ease: [0.22, 1, 0.36, 1]
                      }
                    : {
                        duration: 0
                      }
                }
                style={{
                  zIndex,
                  '--disc-size': `${discSize}px`
                }}
                onClick={(e) => {
                  if (isClosing) return;
                  if (isActive) {
                    handleSelectActiveProject(project, e);
                  } else {
                    targetScrollRef.current = k * discStep;
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (isClosing) return;
                    if (isActive) {
                      handleSelectActiveProject(project, e);
                    } else {
                      targetScrollRef.current = k * discStep;
                    }
                  }
                }}
                aria-label={`Select project: ${project.title}`}
              >
                {/* Vinyl Grooved Record Body */}
                <div className={`project-vinyl-disc ${isActive ? 'is-spinning' : ''}`}>
                  <div className="vinyl-sheen" />

                  {/* Circular Center Label Sticker (Minimalist Typographic Vinyl Record) */}
                  <div className="vinyl-center-label typographic-vinyl-label">
                    <div className="vinyl-label-ring" />
                    <div className="label-side-tag">SIDE A</div>
                    <div className="label-speed-tag">33 ⅓</div>
                    <div className="label-brand-curved">BASIL JOSE</div>
                    <div className="label-project-title">{project.title}</div>
                    <div className="label-track-num">{(!project.media || project.media.length === 0) ? "â— IN PROGRESS" : `TRK ${String(projIndex + 1).padStart(2, '0')}`}</div>
                    <div className="vinyl-spindle-hole" />
                    {isActive && (
                      <div className="vinyl-center-play-hint" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Lower Docked Category Album Jacket (Typographic Sleeve) ── */}
      <motion.div
        className="category-docked-jacket"
        style={{ '--card-width': `${cardWidth}px` }}
        initial={{ x: '-50%', y: 0, opacity: 1 }}
        animate={{ x: '-50%', y: 0, opacity: 1 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleClose}
        role="button"
        tabIndex={0}
        aria-label="Click album sleeve to return to works"
      >
        <div className={`docked-jacket-face typographic-album-jacket ${category?.coverIcon ? 'has-icon' : ''}`}>
          {category?.coverIcon ? (
            <img
              src={category.coverIcon}
              alt={category.title}
              className="jacket-cover-icon"
              loading="eager"
              decoding="sync"
            />
          ) : (
            <div className="jacket-border-frame">
              <div className="jacket-header">
                <span className="jacket-brand">BASIL JOSE</span>
                <span className="jacket-badge">12" LP // 33 RPM</span>
              </div>
              <div className="jacket-center">
                <div className="jacket-archive-tag">ARCHIVE RECORDINGS</div>
                <h2 className="jacket-title">{category.title}</h2>
                <div className="jacket-divider" />
                <div className="jacket-vol">CLICK TO RETURN TO ALBUMS</div>
              </div>
              <div className="jacket-footer">
                <span className="jacket-tracks">09 WORKS</span>
                <span className="jacket-cat-num">BJ-{String(category.title).substring(0, 3).toUpperCase()}-26</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

