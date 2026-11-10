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
// Dynamic physical desk coordinates verified by Heatmap method for 0% overlap
function getScatterSlot(index, totalCount, isMobile) {
  if (isMobile) {
    if (totalCount === 1) {
      return { left: '50vw', top: '48vh', rot: -1.2, z: 12 };
    }
    if (totalCount === 2) {
      const slots2 = [
        { left: '50vw', top: '30vh', rot: -2.2, z: 12 },
        { left: '50vw', top: '66vh', rot: 2.2, z: 14 }
      ];
      return slots2[index % slots2.length];
    }
    if (totalCount === 3) {
      const slots3 = [
        { left: '50vw', top: '24vh', rot: -2.2, z: 12 },
        { left: '50vw', top: '48vh', rot: 1.8, z: 14 },
        { left: '50vw', top: '72vh', rot: -2.0, z: 13 }
      ];
      return slots3[index % slots3.length];
    }
    if (totalCount === 4) {
      const slots4 = [
        { left: '26vw', top: '31vh', rot: -2.0, z: 12 },
        { left: '74vw', top: '31vh', rot: 1.8, z: 13 },
        { left: '26vw', top: '66vh', rot: 1.6, z: 14 },
        { left: '74vw', top: '66vh', rot: -1.8, z: 15 }
      ];
      return slots4[index % slots4.length];
    }
    if (totalCount === 5) {
      const slots5 = [
        { left: '26vw', top: '23vh', rot: -2.0, z: 12 },
        { left: '74vw', top: '32vh', rot: 1.8, z: 14 },
        { left: '26vw', top: '48vh', rot: 1.6, z: 13 },
        { left: '74vw', top: '57vh', rot: -2.0, z: 15 },
        { left: '26vw', top: '73vh', rot: -1.8, z: 16 }
      ];
      return slots5[index % slots5.length];
    }

    // 6+ cards: 2 balanced columns
    const half = Math.ceil(totalCount / 2);
    const isLeft = index < half;
    const colIdx = isLeft ? index : (index - half);
    const colCount = isLeft ? half : (totalCount - half);
    const step = 60 / Math.max(1, colCount - 1);
    const topVal = (isLeft ? (19 + colIdx * step) : (25 + colIdx * step)).toFixed(1);
    const leftVal = isLeft ? '26vw' : '74vw';
    const rot = (index % 2 === 0 ? -1 : 1) * (1.4 + (index % 3) * 0.5);
    return {
      left: leftVal,
      top: `${topVal}vh`,
      rot,
      z: 10 + index
    };
  }

  // Desktop Viewport
  if (totalCount === 1) {
    return { left: '50vw', top: '48vh', rot: 0, z: 12 };
  }
  if (totalCount === 2) {
    const slots2 = [
      { left: '32vw', top: '48vh', rot: -2.2, z: 12 },
      { left: '68vw', top: '48vh', rot: 2.2, z: 14 }
    ];
    return slots2[index % slots2.length];
  }
  if (totalCount === 3) {
    const slots3 = [
      { left: '22vw', top: '48vh', rot: -2.5, z: 12 },
      { left: '50vw', top: '46vh', rot: 1.0, z: 14 },
      { left: '78vw', top: '48vh', rot: 2.5, z: 13 }
    ];
    return slots3[index % slots3.length];
  }
  if (totalCount === 4) {
    const slots4 = [
      { left: '29vw', top: '30vh', rot: -2.2, z: 12 },
      { left: '71vw', top: '30vh', rot: 2.0, z: 13 },
      { left: '29vw', top: '68vh', rot: 1.8, z: 14 },
      { left: '71vw', top: '68vh', rot: -1.8, z: 15 }
    ];
    return slots4[index % slots4.length];
  }
  if (totalCount === 5) {
    const slots5 = [
      { left: '19vw', top: '30vh', rot: -2.8, z: 12 },
      { left: '50vw', top: '26vh', rot: 1.5, z: 14 },
      { left: '81vw', top: '30vh', rot: 2.8, z: 11 },
      { left: '33vw', top: '68vh', rot: 2.2, z: 13 },
      { left: '67vw', top: '68vh', rot: -2.0, z: 15 }
    ];
    return slots5[index % slots5.length];
  }
  if (totalCount === 7) {
    const slots7 = [
      { left: '15vw', top: '28vh', rot: -2.8, z: 12 },
      { left: '38.3vw', top: '26vh', rot: 1.5, z: 14 },
      { left: '61.6vw', top: '26vh', rot: -1.2, z: 13 },
      { left: '85vw', top: '28vh', rot: 2.8, z: 11 },
      { left: '26vw', top: '70vh', rot: 2.0, z: 15 },
      { left: '50vw', top: '71vh', rot: -1.0, z: 16 },
      { left: '74vw', top: '70vh', rot: 1.8, z: 14 }
    ];
    return slots7[index % slots7.length];
  }

  // Generic balanced 2-row formula for any N
  const half = Math.ceil(totalCount / 2);
  const isTopRow = index < half;
  const colIdx = isTopRow ? index : (index - half);
  const rowCount = isTopRow ? half : (totalCount - half);
  const xPercent = 16 + (colIdx / Math.max(1, rowCount - 1)) * 68;
  const yPercent = isTopRow ? 28 : 70;
  const rot = (index % 2 === 0 ? -1 : 1) * (1.5 + (index % 3) * 0.8);
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

  // Card dimensions on desk: calibrated by Heatmap method for 0% overlap & generous margins
  const restingW = isMobile
    ? (totalCount <= 2
        ? Math.min(270, Math.round(vw * 0.72))
        : (totalCount === 3
            ? Math.min(230, Math.round(vw * 0.62))
            : (totalCount === 4
                ? Math.min(150, Math.round(vw * 0.38))
                : Math.min(145, Math.round(vw * 0.37)))))
    : (totalCount >= 7
        ? Math.round(cardW * 0.74)
        : (totalCount === 5
            ? Math.round(cardW * 0.80)
            : Math.round(cardW * 0.86)));
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

  // --- CircularGallery Physics & Scrolling Engine ---
  // Implements the exact scrolling mechanism, follow easing, momentum, and snapping from React Bits CircularGallery
  const isLoopRunningRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const [motionVelocity, setMotionVelocity] = useState(0);

  // Easing constant from CircularGallery (scrollEase: 0.05 - 0.08)
  const SCROLL_EASE = 0.14;

  const startLerpLoop = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;
    lastFrameTimeRef.current = performance.now();

    function loop(now) {
      // Delta time between frames capped safely between 0.5ms and 50ms
      const dt = lastFrameTimeRef.current
        ? Math.min(0.05, Math.max(0.0005, (now - lastFrameTimeRef.current) / 1000))
        : 1 / 60;
      lastFrameTimeRef.current = now;

      // CircularGallery display-refresh-rate independent follow easing:
      // follow = 1 - Math.pow(1 - scrollEase, dt * 60)
      const follow = 1 - Math.pow(1 - SCROLL_EASE, dt * 60);
      const before = currentScrollRef.current;
      const diff = targetScrollRef.current - currentScrollRef.current;

      currentScrollRef.current += diff * follow;

      // Exact snap threshold: within 0.15px locks cleanly to exact integer target
      if (Math.abs(targetScrollRef.current - currentScrollRef.current) < 0.15) {
        currentScrollRef.current = targetScrollRef.current;
      }

      // CircularGallery smoothed physical velocity formula:
      // velocity += (instVelocity - velocity) * (1 - Math.exp(-dt / 0.08))
      const instVelocity = (currentScrollRef.current - before) / dt;
      velocityRef.current += (instVelocity - velocityRef.current) * (1 - Math.exp(-dt / 0.08));
      if (Math.abs(velocityRef.current) < 0.5) {
        velocityRef.current = 0;
      }

      setScrollProgress(currentScrollRef.current);
      setMotionVelocity(velocityRef.current);

      if (currentScrollRef.current !== targetScrollRef.current || Math.abs(velocityRef.current) > 0.5) {
        requestAnimationFrame(loop);
      } else {
        currentScrollRef.current = targetScrollRef.current;
        setScrollProgress(targetScrollRef.current);
        velocityRef.current = 0;
        setMotionVelocity(0);
        isLoopRunningRef.current = false;
        lastFrameTimeRef.current = 0;
      }
    }
    requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    startLerpLoop();
  }, [startLerpLoop]);

  // Center snap helper: sets target to exact nearest slot
  const nearestSlot = useCallback(() => Math.round(targetScrollRef.current / cardStep), [cardStep]);
  const snapNow = useCallback(() => {
    targetScrollRef.current = nearestSlot() * cardStep;
    startLerpLoop();
  }, [nearestSlot, cardStep, startLerpLoop]);

  // Unified Pointer & Drag state (matching CircularGallery drag tracking)
  const pointerStartRef = useRef({
    id: null,
    x: 0,
    y: 0,
    scroll: 0,
    moved: false,
    hasDragged: false,
    samples: [],
    isDown: false
  });
  const [isPointerDragging, setIsPointerDragging] = useState(false);

  const handlePointerDownStage = (e) => {
    if (selectedCategory || isExiting) return;
    if (e.pointerType === 'touch') return; // Handled smoothly by touch handlers
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    pointerStartRef.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      scroll: targetScrollRef.current,
      moved: false,
      hasDragged: false,
      samples: [{ x: e.clientX, t: performance.now() }],
      isDown: true
    };
  };

  const handlePointerMoveStage = (e) => {
    if (e.pointerType === 'touch') return;
    const drag = pointerStartRef.current;
    if (!drag.isDown || selectedCategory || isExiting) return;

    const dx = drag.x - e.clientX;
    const dy = drag.y - e.clientY;

    if (!drag.moved && Math.hypot(dx, dy) > 6) {
      drag.moved = true;
      drag.hasDragged = true;
      setIsPointerDragging(true);
      try {
        containerRef.current?.setPointerCapture?.(e.pointerId);
      } catch {}
    }

    if (drag.moved) {
      const maxLead = cardStep * 2.5;
      targetScrollRef.current = Math.max(
        currentScrollRef.current - maxLead,
        Math.min(currentScrollRef.current + maxLead, drag.scroll + dx * 0.98)
      );
      drag.samples.push({ x: e.clientX, t: performance.now() });
      if (drag.samples.length > 6) drag.samples.shift();
      startLerpLoop();
    }
  };

  const handlePointerUpStage = (e) => {
    if (e?.pointerType === 'touch') return;
    const drag = pointerStartRef.current;
    if (!drag.isDown) return;
    drag.isDown = false;
    setIsPointerDragging(false);

    try {
      if (e?.pointerId && containerRef.current?.hasPointerCapture?.(e.pointerId)) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (drag.moved) {
      // CircularGallery release flick momentum calculation
      const samples = drag.samples;
      if (samples.length > 1) {
        const a = samples[0];
        const b = samples[samples.length - 1];
        const span = Math.max(b.t - a.t, 16);
        const speed = ((b.x - a.x) / span) * 1000;
        targetScrollRef.current -= speed * 0.18;
      }
      snapNow();
      setTimeout(() => {
        drag.hasDragged = false;
      }, 140);
    }
  };

  // CircularGallery Wheel & Trackpad Listener with responsive stepping & silky follow easing
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

      if (e.cancelable) {
        e.preventDefault();
      }

      const now = performance.now();
      const rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(rawDelta) < 0.5) return;

      const unit = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? window.innerHeight : 1;
      const normalizedDelta = rawDelta * unit;
      const currentDirection = normalizedDelta > 0 ? 1 : -1;

      // If user reverses scroll direction, immediately break lock and allow instant counter-step
      if (lastDirection !== 0 && currentDirection !== lastDirection) {
        wheelLock = false;
        accumulatedDelta = 0;
      }
      lastDirection = currentDirection;

      clearTimeout(wheelUnlockTimer);
      wheelUnlockTimer = setTimeout(() => {
        wheelLock = false;
        accumulatedDelta = 0;
        lastDirection = 0;
      }, 160);

      // Throttled step pacing: allows next step after 220ms if user continues scrolling
      if (wheelLock) {
        if (now - lastWheelTime > 220 && Math.abs(normalizedDelta) > 12) {
          wheelLock = false;
          accumulatedDelta = 0;
        } else {
          return;
        }
      }

      accumulatedDelta += normalizedDelta;

      // Threshold: 35px triggers 1 album transition smoothly
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

  // Mobile Touch Handlers with CircularGallery 6-sample velocity window & flick momentum
  const handleTouchStart = (e) => {
    if (selectedCategory || isExiting) return;
    const touch = e.touches[0];
    const now = performance.now();
    pointerStartRef.current = {
      id: null,
      x: touch.clientX,
      y: touch.clientY,
      scroll: targetScrollRef.current,
      moved: false,
      hasDragged: false,
      samples: [{ x: touch.clientX, t: now }],
      isDown: true
    };
  };

  const handleTouchMove = (e) => {
    const drag = pointerStartRef.current;
    if (!drag.isDown || selectedCategory || isExiting) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const dx = drag.x - touch.clientX;
    const dy = drag.y - touch.clientY;

    if (!drag.moved && Math.hypot(dx, dy) > 6) {
      drag.moved = true;
      drag.hasDragged = true;
    }

    if (drag.moved) {
      const maxLead = cardStep * 2.5;
      targetScrollRef.current = Math.max(
        currentScrollRef.current - maxLead,
        Math.min(currentScrollRef.current + maxLead, drag.scroll + dx * 0.98)
      );
      drag.samples.push({ x: touch.clientX, t: performance.now() });
      if (drag.samples.length > 6) drag.samples.shift();
      startLerpLoop();
    }
  };

  const handleTouchEnd = (e) => {
    const drag = pointerStartRef.current;
    if (!drag.isDown) return;
    drag.isDown = false;

    if (drag.moved) {
      const samples = drag.samples;
      if (samples.length > 1) {
        const a = samples[0];
        const b = samples[samples.length - 1];
        const span = Math.max(b.t - a.t, 16);
        const speed = ((b.x - a.x) / span) * 1000;
        targetScrollRef.current -= speed * 0.18;
      }
      snapNow();
      setTimeout(() => {
        drag.hasDragged = false;
      }, 140);
    }
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
  // Derived directly from CircularGallery's exponentially smoothed physical velocity
  const speedRatio = isLoopRunningRef.current && !selectedCategory && !isExiting
    ? Math.min(Math.abs(motionVelocity) / 1200, 1)
    : 0;
  const motionBlurPx = speedRatio > 0.03 ? Math.min(2.0, speedRatio * 2.0) : 0;

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
      onDragStart={(e) => e.preventDefault()}
      data-dragging={isPointerDragging ? '' : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDownStage}
      onPointerMove={handlePointerMoveStage}
      onPointerUp={handlePointerUpStage}
      onPointerLeave={handlePointerUpStage}
    >
      {/* Top-Left Back Button: Back Arrow Only */}
      {!selectedCategory ? (
        onBack && (
          <button
            type="button"
            className="clean-back-btn"
            onClick={handleReturnToReel}
            aria-label="Return to Visual Reel"
            title="Back (ESC)"
          >
            <svg className="back-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
        )
      ) : (
        <button
          type="button"
          className="clean-back-btn is-showcase"
          onClick={handleReturnToCarousel}
          aria-label="Return to Album Carousel"
          title="Back (ESC)"
        >
          <svg className="back-arrow-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
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

          // Motion blur is applied ONLY to moving peripheral elements during the transition, NEVER the entire album!
          // 1. Center focused album (|dx| < cardStep * 0.38) stays 100% sharp and clear throughout.
          // 2. Peripheral/side elements transitioning across the arc ramp up subtly based on distance and velocity.
          // 3. Album titles/captions (.tilted-card-title) are outside tilted-card-inner and never blurred.
          const distanceFromCenter = Math.abs(dx) / Math.max(1, cardStep);
          const transitionFactor = Math.min(1, Math.max(0, (distanceFromCenter - 0.38) / 0.62));
          const cardBlurPx = motionBlurPx > 0.05 ? motionBlurPx * transitionFactor : 0;

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
                  motionBlurPx={cardBlurPx}
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
