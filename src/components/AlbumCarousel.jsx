import { playCardSlide, playCardFlip, playDeskThud, playClick } from '../utils/soundEffects';
import PolaroidGallery from './PolaroidGallery';
import InCardVideoPlayer from './InCardVideoPlayer';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltedCard from './TiltedCard';
import PostcardSVG from './PostcardSVG';
import { CATEGORIES } from '../data/categories';
import '../../styles.css';

const ALBUMS = CATEGORIES.map((cat) => ({
  id: cat.id,
  title: cat.title.toUpperCase(),
  artist: 'BASIL JOSE',
  coverIcon: cat.coverIcon,
  imageSrc: cat.coverIcon,
  url: `#work/${cat.id}`
}));

// Dynamic uncluttered physical desk coordinates ensuring generous breathing room
function getScatterSlot(index, totalCount, isMobile) {
  if (isMobile) {
    const startTop = 22;
    const availableHeight = 56;
    const step = totalCount > 1 ? availableHeight / (totalCount - 1) : 0;
    const topVal = totalCount === 1 ? 50 : startTop + index * step;
    const rot = (index % 2 === 0 ? -1 : 1) * (1.6 + (index % 3) * 0.8);
    return {
      left: '50vw',
      top: `${topVal.toFixed(1)}vh`,
      rot,
      z: 10 + index
    };
  }

  // Dynamic layouts for any number of uploaded projects with zero overlapping:
  if (totalCount === 1) {
    return { left: '50vw', top: '48vh', rot: 0, z: 12 };
  }
  if (totalCount === 2) {
    const slots2 = [
      { left: '32vw', top: '48vh', rot: -2.5, z: 12 },
      { left: '68vw', top: '48vh', rot: 2.5, z: 14 }
    ];
    return slots2[index % slots2.length];
  }
  if (totalCount === 3) {
    const slots3 = [
      { left: '22vw', top: '48vh', rot: -3.0, z: 12 },
      { left: '50vw', top: '46vh', rot: 1.0, z: 14 },
      { left: '78vw', top: '48vh', rot: 3.0, z: 13 }
    ];
    return slots3[index % slots3.length];
  }
  if (totalCount === 4) {
    const slots4 = [
      { left: '29vw', top: '30vh', rot: -2.5, z: 12 },
      { left: '71vw', top: '30vh', rot: 2.2, z: 13 },
      { left: '29vw', top: '70vh', rot: 2.0, z: 14 },
      { left: '71vw', top: '70vh', rot: -1.8, z: 15 }
    ];
    return slots4[index % slots4.length];
  }
  if (totalCount <= 5) {
    const slots5 = [
      { left: '18vw', top: '30vh', rot: -3.5, z: 12 },
      { left: '50vw', top: '26vh', rot: 1.5, z: 14 },
      { left: '82vw', top: '30vh', rot: 3.5, z: 11 },
      { left: '32vw', top: '70vh', rot: 2.5, z: 13 },
      { left: '68vw', top: '70vh', rot: -2.2, z: 15 }
    ];
    return slots5[index % slots5.length];
  }

  // 7-card layout (Graphic Designs with Fetto Garments & Fouz Travels):
  // Top row: 4 cards spaced generously from 14vw to 86vw
  // Bottom row: 3 cards centered from 24vw to 76vw
  if (totalCount === 7) {
    const slots7 = [
      { left: '14vw', top: '27vh', rot: -3.5, z: 12 }, // Fetto Garments
      { left: '38vw', top: '25vh', rot: 1.8, z: 14 },  // Fouz Travels
      { left: '62vw', top: '25vh', rot: -1.5, z: 13 }, // Synthesis Bauhaus
      { left: '86vw', top: '27vh', rot: 3.5, z: 11 },  // Brutalist Mono
      { left: '24vw', top: '71vh', rot: 2.2, z: 15 },  // Echoes Vinyl
      { left: '50vw', top: '72vh', rot: -1.2, z: 16 }, // Modernity Posters
      { left: '76vw', top: '70vh', rot: 2.0, z: 14 }   // Monolith Identity
    ];
    return slots7[index % slots7.length];
  }

  // Generic balanced 2-row formula for any N
  const half = Math.ceil(totalCount / 2);
  const isTopRow = index < half;
  const colIdx = isTopRow ? index : (index - half);
  const rowCount = isTopRow ? half : (totalCount - half);
  const xPercent = 14 + (colIdx / Math.max(1, rowCount - 1)) * 72;
  const yPercent = isTopRow ? 27 : 71;
  const rot = (index % 2 === 0 ? -1 : 1) * (1.8 + (index % 3) * 1.2);
  return {
    left: `${xPercent.toFixed(1)}vw`,
    top: `${yPercent}vh`,
    rot,
    z: 10 + index
  };
}

// Draggable Physical Paper Airmail Postcard Component (Simultaneous 3D Flight & Flip)
const DraggablePostcard = memo(function DraggablePostcard({
  project,
  index,
  totalCount,
  category,
  isRetracting,
  isScattered,
  isExpanded,
  isAnyCardExpanded,
  onOpenProject,
  onCloseProject,
  scatterSlot,
  centerAlbumTop,
  vw,
  vh,
  cardWidth: cardW,
  isMobile
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const [shouldRenderBack, setShouldRenderBack] = useState(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      setShouldRenderBack(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRenderBack(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const hasMultipleMedia = Boolean(project.media && project.media.length > 1);

  const parseUnit = (valStr, dimension) => {
    if (typeof valStr === 'string' && valStr.endsWith('vw')) {
      return (parseFloat(valStr) / 100) * vw;
    }
    if (typeof valStr === 'string' && (valStr.endsWith('vh') || valStr.endsWith('dvh'))) {
      return (parseFloat(valStr) / 100) * vh;
    }
    return parseFloat(valStr) || 0;
  };

  const targetX = parseUnit(scatterSlot.left, vw);
  const targetY = parseUnit(scatterSlot.top, vh);

  // Card dimensions on desk: enlarged proportion with generous breathing room
  const restingScale = totalCount > 5 ? 0.84 : 0.90;
  const restingW = isMobile ? Math.min(320, Math.round(vw * 0.82)) : Math.round(cardW * restingScale);
  const restingH = Math.round(restingW * 0.5625);

  // Card dimensions when expanded to 86% viewport
  let enlargedW = isMobile ? Math.round(vw * 0.94) : Math.min(1380, Math.round(vw * 0.86));
  let enlargedH = Math.round(enlargedW * 0.5625);
  const maxH = Math.min(840, Math.round(vh * 0.84));
  if (enlargedH > maxH) {
    enlargedH = maxH;
    enlargedW = Math.round(enlargedH / 0.5625);
  }

  // Emergence origin strictly from the top opening of the center album (Zero Overlap with album cover)
  const mouthX = Math.round(vw / 2);
  const baseAlbumTop = Math.round(centerAlbumTop !== undefined ? centerAlbumTop : vh * 0.5 - cardW / 2);
  const dipAmount = 70;
  const albumTopWhenDipped = baseAlbumTop + dipAmount;
  // Position the bottom edge of the postcard stack cleanly 10px ABOVE the top of the dipped album
  const stackCenterY = albumTopWhenDipped - Math.round(restingH / 2) - 10;
  const nonOverlapDeltaY = Math.round(stackCenterY - targetY);
  // Tucked inside the album sleeve when emerging or retracting
  const tuckedInsideY = Math.round(albumTopWhenDipped + Math.round(restingH * 0.25) - targetY);
  const mouthDeltaX = Math.round(mouthX - targetX);
  const mouthDeltaY = Math.round(baseAlbumTop - targetY);

  // Center-anchored travel delta from resting slot to center screen (eliminates wobble & rotation axis drift)
  const moveCenterX = Math.round(vw / 2 - targetX);
  const moveCenterY = Math.round(vh / 2 - targetY);

  const handlePointerDown = (e) => {
    if (isExpanded) return;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
  };

  const handleDragStart = () => {
    if (isExpanded) return;
    setIsDragging(true);
    hasMovedRef.current = true;
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 80);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDragging || hasMovedRef.current || isRetracting) return;
    if (!isExpanded) {
      onOpenProject(project);
    }
  };

  let animateTarget = {
    x: 0,
    y: 0,
    z: 0,
    width: restingW,
    height: restingH,
    marginLeft: -Math.round(restingW / 2),
    marginTop: -Math.round(restingH / 2),
    scale: 1,
    rotate: scatterSlot.rot,
    rotateY: 0,
    opacity: 1,
    zIndex: isDragging ? 125 : 35 + scatterSlot.z,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  };

  if (isRetracting) {
    animateTarget = {
      x: mouthDeltaX,
      y: tuckedInsideY + 20,
      z: 0,
      scale: 0.6,
      rotate: 0,
      rotateY: 0,
      opacity: 0,
      zIndex: 15,
      transition: {
        duration: 0.36,
        delay: (totalCount - 1 - index) * 0.015,
        ease: [0.36, 0, 0.66, -0.56]
      }
    };
  } else if (isExpanded) {
    animateTarget = {
      x: moveCenterX,
      y: moveCenterY,
      z: isMobile ? 0 : 160,
      width: enlargedW,
      height: enlargedH,
      marginLeft: -Math.round(enlargedW / 2),
      marginTop: -Math.round(enlargedH / 2),
      scale: 1,
      rotate: 0,
      rotateY: 180,
      opacity: 1,
      zIndex: 300,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1]
      }
    };
  } else if (isAnyCardExpanded) {
    animateTarget = {
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      rotate: scatterSlot.rot,
      rotateY: 0,
      opacity: 0.22,
      zIndex: 35 + scatterSlot.z,
      transition: { duration: 0.4, ease: 'easeOut' }
    };
  } else if (!isScattered) {
    // Postcards emerge stacked cleanly above the top opening of the album - ZERO OVERLAP
    animateTarget = {
      x: mouthDeltaX,
      y: nonOverlapDeltaY - (index * 2),
      z: 20 + index,
      width: restingW,
      height: restingH,
      marginLeft: -Math.round(restingW / 2),
      marginTop: -Math.round(restingH / 2),
      scale: 0.88,
      rotate: 0,
      rotateY: 0,
      opacity: 1,
      zIndex: 60 + index,
      transition: {
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1]
      }
    };
  }

  return (
    <motion.div
      className={"draggable-postcard-item postcard-16-9 " + (isDragging ? "is-dragging " : "") + (isExpanded ? "is-expanded" : "")}
      style={{
        position: 'absolute',
        left: targetX,
        top: targetY,
        width: restingW,
        height: restingH,
        marginLeft: -Math.round(restingW / 2),
        marginTop: -Math.round(restingH / 2),
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 50%',
        willChange: 'transform',
        pointerEvents: isAnyCardExpanded && !isExpanded ? 'none' : 'auto',
        cursor: isExpanded ? 'default' : 'grab'
      }}
      drag={!isRetracting && !isExpanded}
      dragMomentum={false}
      dragElastic={0.08}
      onPointerDown={handlePointerDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
            initial={{
        x: mouthDeltaX,
        y: tuckedInsideY,
        z: 0,
        scale: 0.84,
        rotate: 0,
        rotateY: 0,
        opacity: 0
      }}
      animate={animateTarget}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isExpanded) onOpenProject(project);
        }
      }}
      aria-label={"Postcard for " + (project?.title || "")}
    >
      <div
        className="postcard-3d-flipper"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          borderRadius: isExpanded ? '6px' : '4px',
          boxShadow: isExpanded
            ? '0 24px 50px rgba(0, 8, 26, 0.6), 0 8px 20px rgba(0, 0, 0, 0.35)'
            : isDragging
            ? '0 18px 36px rgba(0, 10, 35, 0.4)'
            : '0 12px 24px rgba(0, 12, 32, 0.3), 0 4px 10px rgba(0, 0, 0, 0.18)'
        }}
      >
        {/* Front Face: Postcard Artwork */}
        <div
          className="postcard-side postcard-side-front"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            zIndex: 2,
            borderRadius: isExpanded ? '6px' : '4px',
            overflow: 'hidden'
          }}
        >
          <div className="postcard-16-9-wrapper" style={{ width: '100%', height: '100%' }}>
            <PostcardSVG project={project} category={category} index={index} />
          </div>
        </div>

        {/* Back Face: Revealed on 180 deg Flip */}
        <div
          className="postcard-side postcard-side-back"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            zIndex: 3,
            background: '#fff7ed',
            borderRadius: isExpanded ? '6px' : '4px',
            overflow: 'hidden',
            pointerEvents: isExpanded ? 'auto' : 'none'
          }}
        >
          {isExpanded && (
            <button
              type="button"
              className="enlarged-postcard-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCloseProject();
              }}
              aria-label="Close enlarged postcard"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          {shouldRenderBack && (
            <PolaroidGallery items={project.media} project={project} isExpanded={isExpanded} isMobile={isMobile} />
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default function AlbumCarousel({
  activeCategoryId,
  initialProjectId = null,
  onBack,
  onDitherTrigger,
  onCategoryChange,
  onProjectChange,
  isEntering = false,
  isExiting: isExitingProp = false
}) {
  const containerRef = useRef(null);
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  }));

  const { width: vw, height: vh } = viewportSize;
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;

  const cardWidth = isMobile
    ? Math.min(280, Math.floor(vw * 0.74))
    : isTablet
    ? Math.min(360, Math.floor(vh * 0.42))
    : Math.min(460, Math.max(350, Math.floor(vh * 0.46)));

  // Generous, breathable spacing so adjacent albums never feel crowded or collide when tilted
  const cardGap = isMobile ? 54 : isTablet ? 110 : 180;
  const cardStep = cardWidth + cardGap;
  const arcRadius = isMobile ? 1200 : isTablet ? 1650 : 2000;

  const initialCategoryIdx = Math.max(0, ALBUMS.findIndex((cat) => cat.id === activeCategoryId));
  const initialScroll = initialCategoryIdx * cardStep;

  const currentScrollRef = useRef(initialScroll);
  const targetScrollRef = useRef(initialScroll);
  const [scrollProgress, setScrollProgress] = useState(initialScroll);
  const touchStartRef = useRef({ x: 0, y: 0, scroll: 0 });

  // Pure GPU-composited entry state (zero React per-frame setState!)
  const [isEnteringSides, setIsEnteringSides] = useState(isEntering);

  useEffect(() => {
    if (isEntering) {
      setIsEnteringSides(true);
      const timer = setTimeout(() => {
        setIsEnteringSides(false);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsEnteringSides(false);
    }
  }, [isEntering]);

  // Continuous Category & Postcards Showcase State (Zero Cut!)
  const [isExiting, setIsExiting] = useState(isExitingProp);

  useEffect(() => {
    if (isExitingProp) {
      setIsExiting(true);
    }
  }, [isExitingProp]);

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (activeCategoryId) {
      return CATEGORIES.find((c) => c.id === activeCategoryId) || null;
    }
    return null;
  });

  const [selectedSlot, setSelectedSlot] = useState(() => {
    if (activeCategoryId) {
      const idx = ALBUMS.findIndex((cat) => cat.id === activeCategoryId);
      return idx >= 0 ? idx : null;
    }
    return null;
  });

  const [hasAlbumDescended, setHasAlbumDescended] = useState(() => Boolean(activeCategoryId));
  const [isAlbumDipped, setIsAlbumDipped] = useState(false);
  const [showPostcards, setShowPostcards] = useState(() => Boolean(activeCategoryId));
  const [isCardsScattered, setIsCardsScattered] = useState(() => Boolean(activeCategoryId));
  const [isRetractingPostcards, setIsRetractingPostcards] = useState(false);
  const [flippingProjectId, setFlippingProjectId] = useState(null);

  const [activeFullscreenProject, setActiveFullscreenProject] = useState(null);

  // Sync selectedCategory if URL updates externally
  useEffect(() => {
    if (activeCategoryId) {
      const cat = CATEGORIES.find((c) => c.id === activeCategoryId);
      if (cat) {
        setSelectedCategory(cat);
        const idx = ALBUMS.findIndex((a) => a.id === activeCategoryId);
        if (idx >= 0) {
          setSelectedSlot(idx);
          targetScrollRef.current = idx * cardStep;
          currentScrollRef.current = idx * cardStep;
          setScrollProgress(idx * cardStep);
        }
        setShowPostcards(true);
        setHasAlbumDescended(true);
        setIsCardsScattered(true);
      }
    }
    // Strictly do not auto-open projects on category load
    setActiveFullscreenProject(null);
    setFlippingProjectId(null);
    if (onProjectChange) {
      onProjectChange(null);
    }
  }, [activeCategoryId]);

  // Postcard Click -> Open 70% Viewport 3D Flip Modal
  const handleOpenProject = useCallback((project) => {
    playCardFlip();
    setActiveFullscreenProject(project);
    if (onProjectChange) onProjectChange(project.id);
    if (selectedCategory) {
      window.history.pushState(null, '', '#work/' + selectedCategory.id + '/' + project.id);
    }
  }, [selectedCategory, onProjectChange]);

  const handleCloseProject = useCallback(() => {
    playCardFlip();
    setActiveFullscreenProject(null);
    setFlippingProjectId(null);
    if (onProjectChange) onProjectChange(null);
    if (selectedCategory) {
      window.history.pushState(null, '', '#work/' + selectedCategory.id);
    }
  }, [selectedCategory, onProjectChange]);

  // Resize listener with passive flag and mobile address bar jitter debounce
  useEffect(() => {
    function handleResize() {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      setViewportSize((prev) => {
        // Prevent re-rendering carousel on minor mobile address bar hide/show (< 60px)
        if (prev.width === newW && Math.abs(prev.height - newH) < 60) {
          return prev;
        }
        return { width: newW, height: newH };
      });
    }
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On-demand Lerp loop: only runs when scrolling or settling, stops completely on idle (0% CPU)
  const isLoopRunningRef = useRef(false);
  const startLerpLoop = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;
    function loop() {
      const diff = targetScrollRef.current - currentScrollRef.current;
      if (Math.abs(diff) > 1.2) {
        currentScrollRef.current += diff * 0.22;
        setScrollProgress(currentScrollRef.current);
        requestAnimationFrame(loop);
      } else {
        currentScrollRef.current = targetScrollRef.current;
        setScrollProgress(targetScrollRef.current);
        isLoopRunningRef.current = false;
      }
    }
    requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    startLerpLoop();
  }, [startLerpLoop]);

  // Pointer/mouse drag tracking to allow clicking & dragging the wheel without false triggers
  const pointerStartRef = useRef({ x: 0, y: 0, scroll: 0, isDown: false, hasDragged: false });

  const handlePointerDownStage = (e) => {
    if (selectedCategory || isExiting) return;
    if (e.pointerType === 'touch') return; // Dedicated mobile touch handler
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scroll: targetScrollRef.current,
      isDown: true,
      hasDragged: false
    };
  };

  const handlePointerMoveStage = (e) => {
    if (e.pointerType === 'touch') return;
    if (!pointerStartRef.current.isDown || selectedCategory || isExiting) return;
    const dx = pointerStartRef.current.x - e.clientX;
    if (Math.abs(dx) > 5) {
      pointerStartRef.current.hasDragged = true;
    }
    const maxLead = cardStep * 2.2;
    targetScrollRef.current = Math.max(
      currentScrollRef.current - maxLead,
      Math.min(currentScrollRef.current + maxLead, pointerStartRef.current.scroll + dx * 0.95)
    );
    startLerpLoop();
  };

  const handlePointerUpStage = (e) => {
    if (e?.pointerType === 'touch') return;
    if (!pointerStartRef.current.isDown) return;
    pointerStartRef.current.isDown = false;
    const nearest = Math.round(targetScrollRef.current / cardStep);
    targetScrollRef.current = nearest * cardStep;
    startLerpLoop();
    setTimeout(() => {
      pointerStartRef.current.hasDragged = false;
    }, 120);
  };

  // Global window wheel scroll listener with responsive 1-scroll-per-album snapping
  useEffect(() => {
    if (selectedCategory || isExiting) return;

    let wheelLock = false;
    let wheelUnlockTimer = null;
    let accumulatedDelta = 0;
    let lastWheelTime = 0;
    let lastDirection = 0;

    function handleWheel(e) {
      if (selectedCategory || isExiting) return;
      if (pointerStartRef.current.isDown) return;

      // Prevent native window/page vertical scrolling while interacting with the wheel
      if (e.cancelable) {
        e.preventDefault();
      }

      const now = performance.now();
      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(rawDelta) < 1) return;

      // Normalize delta for different browsers / deltaModes (pixels vs lines vs pages)
      let normalizedDelta = rawDelta;
      if (e.deltaMode === 1) {
        normalizedDelta *= 36;
      } else if (e.deltaMode === 2) {
        normalizedDelta *= window.innerHeight;
      }

      const currentDirection = normalizedDelta > 0 ? 1 : -1;

      // If user reverses scroll direction, immediately break lock and allow instant counter-snap
      if (lastDirection !== 0 && currentDirection !== lastDirection) {
        wheelLock = false;
        accumulatedDelta = 0;
      }
      lastDirection = currentDirection;

      // Reset the settling timeout on every event
      clearTimeout(wheelUnlockTimer);
      wheelUnlockTimer = setTimeout(() => {
        wheelLock = false;
        accumulatedDelta = 0;
        lastDirection = 0;
      }, 160);

      // If currently locked after a step:
      // Allow the next step if the user deliberately continues scrolling after a throttle interval
      if (wheelLock) {
        if (now - lastWheelTime > 300 && Math.abs(normalizedDelta) > 15) {
          wheelLock = false;
          accumulatedDelta = 0;
        } else {
          return;
        }
      }

      accumulatedDelta += normalizedDelta;

      // Sensitivity threshold:
      // A single mouse wheel notch is typically ~100px delta.
      // Trackpads quickly sum to 35px in 1-2 frames.
      const THRESHOLD = 35;

      if (Math.abs(accumulatedDelta) >= THRESHOLD) {
        const step = accumulatedDelta > 0 ? 1 : -1;
        const currentIdx = Math.round(targetScrollRef.current / cardStep);
        const targetIdx = currentIdx + step;

        targetScrollRef.current = targetIdx * cardStep;
        startLerpLoop();

        wheelLock = true;
        accumulatedDelta = 0;
        lastWheelTime = now;
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelUnlockTimer);
    };
  }, [selectedCategory, isExiting, cardStep, startLerpLoop]);

  // Mobile Touch handlers with high-velocity swipe support and momentum
  const handleTouchStart = (e) => {
    if (selectedCategory || isExiting) return;
    const touch = e.touches[0];
    const now = performance.now();
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scroll: targetScrollRef.current,
      time: now,
      lastX: touch.clientX,
      lastTime: now,
      vx: 0
    };
  };

  const handleTouchMove = (e) => {
    if (selectedCategory || isExiting) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const now = performance.now();
    const dt = now - touchStartRef.current.lastTime;
    if (dt > 8) {
      touchStartRef.current.vx = (touch.clientX - touchStartRef.current.lastX) / dt;
      touchStartRef.current.lastX = touch.clientX;
      touchStartRef.current.lastTime = now;
    }
    const dx = touchStartRef.current.x - touch.clientX;
    const maxLead = cardStep * 2.2;
    targetScrollRef.current = Math.max(
      currentScrollRef.current - maxLead,
      Math.min(currentScrollRef.current + maxLead, touchStartRef.current.scroll + dx * 0.95)
    );
    startLerpLoop();
  };

  const handleTouchEnd = (e) => {
    if (selectedCategory || isExiting) return;
    const { vx, time: startTime } = touchStartRef.current;
    const totalDt = performance.now() - startTime;
    let target = targetScrollRef.current;

    // High-velocity flick recognition (swiping left = vx < 0 = moves to next album)
    if (Math.abs(vx) > 0.35 || (totalDt < 260 && Math.abs(vx) > 0.22)) {
      const dir = vx < 0 ? 1 : -1;
      const currentIdx = Math.round(currentScrollRef.current / cardStep);
      target = (currentIdx + dir) * cardStep;
    } else {
      const nearest = Math.round(target / cardStep);
      target = nearest * cardStep;
    }

    targetScrollRef.current = target;
    startLerpLoop();
  };

  // Step 1 - 4 Unified Category Selection Choreography:
  // 1. Clicking the album
  // 2. Album going a little down AT THE SAME TIME postcards coming from top without overlapping
  // 3. Album fully goes down
  // 4. Cards scatter
  const triggerSelectCategory = useCallback((slot, categoryId, origin) => {
    if (selectedCategory || isExiting) return;
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return;

    setSelectedSlot(slot);
    setSelectedCategory(cat);
    setHasAlbumDescended(false);
    setIsRetractingPostcards(false);
    setIsCardsScattered(false);
    setActiveFullscreenProject(null);
    setFlippingProjectId(null);
    if (onProjectChange) onProjectChange(null);

    // Step 1: Center the selected album immediately; side albums move out left & right
    targetScrollRef.current = slot * cardStep;
    currentScrollRef.current = slot * cardStep;
    setScrollProgress(slot * cardStep);
    startLerpLoop();

    // Step 2: AT THE EXACT SAME TIME:
    // Album goes a little down (70px dip) AND postcards come out from top without overlapping
    setIsAlbumDipped(true);
    setShowPostcards(true);
    setIsCardsScattered(false);
    playCardSlide();

    // Step 3: Once cards have cleanly emerged above album (420ms), album immediately fully goes down
    setTimeout(() => {
      setIsAlbumDipped(false);
      setHasAlbumDescended(true);
    }, 420);

    // Step 4: Circle dither wave expands from center & cards scatter across desk surface (580ms)
    setTimeout(() => {
      if (onDitherTrigger) {
        onDitherTrigger({
          origin: { x: vw / 2, y: vh * 0.5 },
          color: '#336196',
          sourceShape: 'circle',
          zIndex: 10
        });
      }
      setIsCardsScattered(true);
      playDeskThud();
    }, 580);

    // Step 5: Lock background color to desk blue (920ms)
    setTimeout(() => {
      if (onCategoryChange) {
        onCategoryChange(categoryId);
      }
    }, 920);

    window.history.pushState(null, '', '#work/' + categoryId);
  }, [selectedCategory, isExiting, cardStep, onDitherTrigger, onCategoryChange, vw, vh, startLerpLoop]);

  // Exact Reverse Motion for going back to album page:
  // 4 Rev: cards gather back into clean stack at top; circle dither contracts to beige
  // 3 Rev: album comes up from bottom to dipped position
  // 2 Rev: album rises to normal center AT THE SAME TIME postcards slide down into sleeve
  // 1 Rev: side albums return into carousel arc
  const handleReturnToCarousel = useCallback(() => {
    if (!selectedCategory || isRetractingPostcards) return;
    setActiveFullscreenProject(null);
    setFlippingProjectId(null);
    if (onProjectChange) onProjectChange(null);
    playCardSlide();

    // 4 Rev: Cards gather back from desk into top stack above center
    setIsCardsScattered(false);

    // Circle dither contracts back to beige
    if (onDitherTrigger) {
      onDitherTrigger({
        origin: { x: vw / 2, y: vh * 0.5 },
        color: '#fff7ed',
        sourceShape: 'circle',
        boxHalfSize: 0,
        zIndex: 10
      });
    }
    if (onCategoryChange) {
      onCategoryChange(null);
    }

    // 3 Rev: Album ascends from bottom (130vh) back to dipped position (320ms)
    setTimeout(() => {
      setHasAlbumDescended(false);
      setIsAlbumDipped(true);
    }, 320);

    // 2 Rev: AT THE EXACT SAME TIME (620ms):
    // Album rises from dipped position back to normal center height
    // AND postcards slide down into the sleeve
    setTimeout(() => {
      setIsAlbumDipped(false);
      setIsRetractingPostcards(true);
    }, 620);

    // 1 Rev: Postcards unmount and side albums return into the arc (1000ms)
    setTimeout(() => {
      setShowPostcards(false);
      setIsRetractingPostcards(false);
      setSelectedCategory(null);
      setSelectedSlot(null);
      setHasAlbumDescended(false);
      window.history.pushState(null, '', '#work');
    }, 1000);
  }, [selectedCategory, isRetractingPostcards, onDitherTrigger, onCategoryChange, vw, vh]);

  // Return to Visual Reel
  const handleReturnToReel = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    if (onBack) onBack();
  }, [isExiting, onBack]);

  // Keyboard navigation & ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (activeFullscreenProject) {
          handleCloseProject();
        } else if (selectedCategory) {
          handleReturnToCarousel();
        } else if (onBack) {
          handleReturnToReel();
        }
        return;
      }
      if (selectedCategory || isExiting) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const currentIdx = Math.round(targetScrollRef.current / cardStep);
        targetScrollRef.current = (currentIdx + 1) * cardStep;
        startLerpLoop();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const currentIdx = Math.round(targetScrollRef.current / cardStep);
        targetScrollRef.current = (currentIdx - 1) * cardStep;
        startLerpLoop();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategory, isExiting, cardStep, onBack, activeFullscreenProject, handleCloseProject, handleReturnToCarousel, handleReturnToReel]);

  // Dynamic subtle motion blur during scrolling (0px when idle/stopped, up to 2.5px at peak velocity)
  const scrollVelocity = isLoopRunningRef.current && !selectedCategory && !isExiting
    ? Math.abs(targetScrollRef.current - currentScrollRef.current) * 0.18
    : 0;
  const motionBlurPx = scrollVelocity > 0.5 ? Math.min(2.5, Math.max(0, scrollVelocity / 32)) : 0;

  // Compute center index and circular visible range
  const centerIdx = Math.round(scrollProgress / cardStep);
  const visibleRange = isMobile ? 2 : 2;
  const visibleSlots = [];
  for (let offset = -visibleRange; offset <= visibleRange; offset++) {
    visibleSlots.push(centerIdx + offset);
  }

  // Top lip of centered album for postcard mouth emergence
  const centerAlbumTop = Math.round(vh * 0.5 - cardWidth / 2);

  return (
    <div
      ref={containerRef}
      className={`react-album-stage ${selectedCategory ? 'is-postcard-stage' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDownStage}
      onPointerMove={handlePointerMoveStage}
      onPointerUp={handlePointerUpStage}
      onPointerLeave={handlePointerUpStage}
    >
      {/* Top-Left Back Button: REEL when in carousel, ALBUMS when in showcase */}
      {!selectedCategory ? (
        onBack && (
          <button
            type="button"
            className="clean-back-btn"
            onClick={handleReturnToReel}
            aria-label="Return to Visual Reel"
            title="Return to Visual Reel (ESC)"
          >
            <svg className="back-arrow-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span className="back-label">REEL</span>
            <span className="back-key-hint">ESC</span>
          </button>
        )
      ) : (
        <button
          type="button"
          className="clean-back-btn is-showcase"
          onClick={handleReturnToCarousel}
          aria-label="Return to Album Carousel"
          title="Return to Albums (ESC)"
        >
          <svg className="back-arrow-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="back-label">ALBUMS</span>
          <span className="back-key-hint">ESC</span>
        </button>
      )}

      {/* Album Carousel Track: Zero Cuts, Exact Same Album! */}
      <div
        className="react-album-track"
        style={{ '--arc-radius': `${arcRadius}px` }}
      >
        {visibleSlots.map((k) => {
          const albumIndex = ((k % ALBUMS.length) + ALBUMS.length) % ALBUMS.length;
          const album = ALBUMS[albumIndex];

          const dx = (k * cardStep) - scrollProgress;

          const isThisSelected = selectedCategory && k === selectedSlot;
          const isSideAlbumExiting = selectedCategory && k !== selectedSlot;

          // Centered gentle Ferris wheel arc: stays strictly centered vertically, never drops down or plunges off-screen
          const safeRadius = Math.max(800, arcRadius);
          const clampedRatio = Math.max(-0.85, Math.min(0.85, dx / safeRadius));
          const thetaRad = Math.asin(clampedRatio);
          const thetaDeg = isThisSelected ? 0 : thetaRad * (180 / Math.PI) * 1.05;
          const circularDrop = safeRadius * (1 - Math.cos(thetaRad));
          // Steep drop while strictly anchoring center album at 50% vertical center
          const dropY = isThisSelected ? 0 : Math.min(vh * 0.42, circularDrop * 1.25);

          // Elevate selected card to z-index: 25 (in front of dither canvas at z-index: 10)
          const zIndex = isThisSelected ? 30 : Math.max(1, 18 - Math.min(15, Math.round(Math.abs(dx) / (cardStep * 0.5))));

          let cardModifierClass = '';
          if (isThisSelected) {
            cardModifierClass = hasAlbumDescended
              ? 'is-selected-descending'
              : isAlbumDipped
              ? 'is-selected-dipped'
              : 'is-selected-ascending';
          } else if (isSideAlbumExiting) {
            cardModifierClass = k < selectedSlot ? 'is-fading-out-left' : 'is-fading-out-right';
          } else if (isExiting) {
            cardModifierClass = dx <= 0 ? 'is-exiting-to-reel-left' : 'is-exiting-to-reel-right';
          } else if (isEnteringSides) {
            cardModifierClass = dx < 0 ? 'is-entering-from-left' : 'is-entering-from-right';
          }

          return (
            <div
              key={k}
              className={`react-album-card-item ${cardModifierClass}`}
              style={{
                '--card-dx': `${dx}px`,
                '--card-dy': `${dropY}px`,
                '--card-rot': `${thetaDeg}deg`,
                transform: `translate(-50%, -50%) translate3d(${dx}px, ${dropY}px, 0) rotate(${thetaDeg}deg)`,
                transformOrigin: '50% 60%',
                filter: motionBlurPx > 0.05 ? `blur(${motionBlurPx.toFixed(2)}px)` : 'none',
                zIndex
              }}
            >
              <a
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="react-album-card-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (selectedCategory || pointerStartRef.current.hasDragged) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const origin = {
                    x: Math.round(rect.left + rect.width / 2),
                    y: Math.round(rect.top + rect.height / 2)
                  };
                  triggerSelectCategory(k, album.id, origin);
                }}
                aria-label={`${album.title} - Click to explore projects in this category`}
              >
                <TiltedCard
                  coverIcon={album.coverIcon}
                  imageSrc={album.imageSrc}
                  altText={`${album.title} - ${album.artist}`}
                  captionText={isThisSelected ? '' : album.title}
                  containerHeight={`${cardWidth}px`}
                  containerWidth={`${cardWidth}px`}
                  imageHeight={`${cardWidth}px`}
                  imageWidth={`${cardWidth}px`}
                  rotateAmplitude={isThisSelected || isMobile ? 0 : 12}
                  scaleOnHover={isThisSelected ? 1 : 1.08}
                  showVinyl={false}
                  showMobileWarning={false}
                  showTooltip={false}
                  isDescending={Boolean(selectedCategory)}
                />
              </a>
            </div>
          );
        })}
      </div>

      {/* Dimmed & Blurred Desk Backdrop (Outside 3D space to prevent clipping during flip) */}
      <AnimatePresence>
        {activeFullscreenProject && (
          <motion.div
            className="enlarged-postcard-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            onClick={handleCloseProject}
          />
        )}
      </AnimatePresence>

      {/* Step 3 & 5: Postcards pop out of the album mouth and scatter across desk */}
      {selectedCategory && showPostcards && (
        <div className={"scattered-envelopes-wrapper" + (hasAlbumDescended ? " album-descended" : "") + (activeFullscreenProject ? " has-expanded-card" : "")}>

          {selectedCategory.projects.map((proj, idx) => {
            const scatter = getScatterSlot(idx, selectedCategory.projects.length, isMobile);
            return (
              <DraggablePostcard
                key={proj.id}
                project={proj}
                index={idx}
                totalCount={selectedCategory.projects.length}
                category={selectedCategory}
                isRetracting={isRetractingPostcards}
                isScattered={isCardsScattered}
                isExpanded={activeFullscreenProject?.id === proj.id}
                isAnyCardExpanded={Boolean(activeFullscreenProject)}
                onOpenProject={handleOpenProject}
                onCloseProject={handleCloseProject}
                scatterSlot={scatter}
                centerAlbumTop={centerAlbumTop}
                vw={vw}
                vh={vh}
                cardWidth={cardWidth}
                isMobile={isMobile}
              />
            );
          })}

          {selectedCategory.projects.length === 0 && (
            <div className="empty-category-desk-badge">
              <div className="empty-category-stamp">
                <span className="empty-category-tag">COLLECTION EMPTY</span>
                <h3 className="empty-category-title">{selectedCategory.title}</h3>
                <p className="empty-category-text">
                  Upload your project files or folders into:
                </p>
                <code className="empty-category-code">
                  projects/{selectedCategory.id}/
                </code>
                <p className="empty-category-hint">
                  Then type <strong>updated</strong> in chat to display them here.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
