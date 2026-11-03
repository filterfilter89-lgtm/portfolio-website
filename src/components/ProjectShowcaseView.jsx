import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategoryById } from '../data/categories';

// Organic Initial Scattered Coordinates across the desk canvas

// Mobile Organic Scattered Coordinates


// Mobile Organic Scattered Coordinates
const MOBILE_SCATTER_SLOTS = [
  { left: '6%',  top: '10%', rot: -3.5, z: 12 },
  { left: '10%', top: '24%', rot: 3.2,  z: 14 },
  { left: '5%',  top: '38%', rot: -2.5, z: 13 },
  { left: '9%',  top: '50%', rot: 2.8,  z: 15 },
  { left: '7%',  top: '62%', rot: -1.8, z: 11 }
];
const DEFAULT_SCATTER_SLOTS = [
  { left: '10%', top: '14%', rot: -5.5, z: 12 },
  { left: '42%', top: '12%', rot: 4.5,  z: 15 },
  { left: '72%', top: '16%', rot: -3.5, z: 11 },
  { left: '14%', top: '48%', rot: 6.2,  z: 14 },
  { left: '44%', top: '50%', rot: -4.8, z: 13 },
  { left: '74%', top: '49%', rot: 5.1,  z: 12 }
];

// Physical Paper Postcard with Blue Airmail Edge, Top Pop-out, Dragging & 3D Flip
const DraggablePostcard = memo(function DraggablePostcard({
  project,
  index,
  totalCount,
  category,
  isFlipping,
  isRetracting,
  onOpenProject,
  scatterSlot
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  // Compute mouth coordinate offsets relative to docked album sleeve at bottom-center
  const getTopPopOffsets = () => {
    if (typeof window === 'undefined') return { deltaX: 0, deltaY: 400 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const isMobile = vw < 640;
    const cardW = isMobile ? Math.min(300, vw * 0.84) : 330;

    // Target resting pixel coordinates for this card on the fullscreen desk canvas
    const targetX = (vw * parseFloat(scatterSlot.left)) / 100;
    const targetY = (vh * parseFloat(scatterSlot.top)) / 100;

    // Center Album Sleeve dimensions and mouth position (centered on screen)
    const sleeveSize = isMobile ? Math.min(280, vw * 0.76) : Math.min(380, Math.max(280, vw * 0.28));
    const mouthX = vw / 2 - cardW / 2;
    const mouthY = vh / 2 - sleeveSize / 2;

    return {
      deltaX: Math.round(mouthX - targetX),
      deltaY: Math.round(mouthY - targetY)
    };
  };

  const { deltaX, deltaY } = getTopPopOffsets();

  const handlePointerDown = (e) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
  };

  const handleDragStart = () => {
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
    onOpenProject(project);
  };

  return (
    <motion.div
      className={`draggable-postcard-item ${isDragging ? 'is-dragging' : ''} ${isFlipping ? 'is-flipping' : ''}`}
      style={{
        '--card-left': scatterSlot.left,
        '--card-top': scatterSlot.top,
        '--base-rot': `${scatterSlot.rot}deg`,
        '--z-order': isDragging ? 120 : (isFlipping ? 110 : scatterSlot.z)
      }}
      drag={!isRetracting}
      dragMomentum={false}
      dragElastic={0.08}
      onPointerDown={handlePointerDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      initial={{
        x: deltaX,
        y: deltaY + 50,
        scale: 0.62,
        opacity: 0,
        rotate: 0
      }}
      animate={
        isRetracting
          ? {
              x: [0, deltaX, deltaX],
              y: [0, deltaY - 160, deltaY + 50],
              rotate: [scatterSlot.rot, 0, 0],
              scale: [1, 0.82, 0.62],
              opacity: [1, 1, 0]
            }
          : {
              x: [deltaX, deltaX, 0],
              y: [deltaY + 50, deltaY - 180, 0], // Shoots UPWARDS out of center album, then scatters across desk!
              scale: [0.62, 0.82, isFlipping ? 1.08 : 1],
              rotate: [0, 0, isFlipping ? 0 : scatterSlot.rot],
              opacity: [0, 1, 1]
            }
      }
      transition={
        isRetracting
          ? {
              duration: 0.52,
              times: [0, 0.5, 1],
              delay: (totalCount - 1 - index) * 0.05,
              ease: [0.36, 0, 0.66, -0.56]
            }
          : {
              duration: 0.92,
              times: [0, 0.38, 1],
              delay: 0.06 + index * 0.11,
              ease: [0.22, 1, 0.36, 1]
            }
      }
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenProject(project);
        }
      }}
      aria-label={`Postcard for ${project.title} - Click to flip and view work, hold to drag`}
    >
      {/* 3D Double-Sided Flipper Container */}
      <div className={`postcard-3d-flipper ${isFlipping ? 'is-flipped' : ''}`}>
        {/* FRONT SIDE OF POSTCARD (Warm Beige #fff7ed, Blue only for Edge) */}
        <div className="postcard-side postcard-side-front">
          {/* Blue Airmail Barber-Pole Perimeter Border Pattern */}
          <div className="postcard-airmail-border" />

          {/* Inner Warm Beige Paper Body */}
          <div className="postcard-inner-card">
            {/* Center Vertical Divider Line */}
            <div className="postcard-vertical-divider" />

            {/* Left Column: Project Overview & Typography */}
            <div className="postcard-left-pane">
              <div className="postcard-meta-header">
                <span className="postcard-index-tag">#{String(index + 1).padStart(2, '0')}</span>
                <span className="postcard-discipline-tag">{category.title}</span>
              </div>

              <div className="postcard-main-content">
                <div className="postcard-client-date">
                  <span>{project.client}</span>
                  <span className="bullet-sep">?</span>
                  <span>{project.dateStamp || '2024'}</span>
                </div>
                <h3 className="postcard-project-title">{project.title}</h3>
                <div className="postcard-role-tag">{project.role}</div>
                <p className="postcard-snippet-text">{project.description}</p>
              </div>

              <div className="postcard-footer-left">
                <span className="postcard-city-seal">{project.city || 'ARCHIVE'}</span>
              </div>
            </div>

            {/* Right Column: Postage Stamp, Circular Postmark & Address Lines */}
            <div className="postcard-right-pane">
              <div className="postcard-stamp-area">
                <div className="postcard-postage-stamp">
                  <div className="stamp-inner-art">
                    <span className="stamp-code-text">{project.stampCode || 'ARCHIVE'}</span>
                    <span className="stamp-value-text">33."</span>
                  </div>
                </div>

                <div className="postcard-ink-postmark">
                  <div className="postmark-circle">
                    <span className="postmark-city">BASIL JOSE</span>
                    <span className="postmark-date">{project.dateStamp || '2024'}</span>
                  </div>
                  <div className="postmark-waves" />
                </div>
              </div>

              <div className="postcard-address-lines">
                <div className="address-line line-1" />
                <div className="address-line line-2" />
                <div className="address-line line-3" />
              </div>

              <div className="postcard-hint-tag">
                <span>{isDragging ? 'DRAGGING' : 'CLICK TO FLIP'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE OF POSTCARD (Revealed on 3D Flip) */}
        <div className="postcard-side postcard-side-back">
          <div className="postcard-airmail-border" />
          <div className="postcard-back-inner">
            <div className="postcard-back-preview-stage">
              <img
                src={project.thumbnail || '/frames/web00.webp'}
                alt={project.title}
                className="postcard-back-img"
              />

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Docked Album Sleeve Anchor at Bottom Center (Source of Pop-out Postcards)
const DockedAlbumSleeve = memo(function DockedAlbumSleeve({
  category,
  onBack,
  isRetracting
}) {
  return (
    <motion.div
      className="emerging-album-sleeve"
      onClick={onBack}
      initial={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }}
      animate={
        isRetracting
          ? {
              x: '-50%',
              y: ['120vh', '-50%'],
              opacity: [0, 1],
              scale: [0.9, 1]
            }
          : {
              x: '-50%',
              y: ['-50%', '120vh'], // Album moves down completely off-screen and disappears!
              opacity: [1, 0],
              scale: [1, 0.88]
            }
      }
      transition={
        isRetracting
          ? {
              duration: 0.52,
              ease: [0.22, 1, 0.36, 1]
            }
          : {
              duration: 0.68,
              delay: 0.38, // Waits for postcards to pop out before sliding down completely
              ease: [0.22, 1, 0.36, 1]
            }
      }
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onBack();
        }
      }}
      aria-label={`Docked album sleeve for ${category.title} - Click to re-collect postcards`}
      title="Click album sleeve to return to carousel"
    >
      {/* Top opening slot / mouth where postcards emerge from */}
      <div className="sleeve-top-slot-lip">
        <div className="sleeve-slot-opening" />
        <div className="sleeve-slot-accent" />
      </div>

      {/* Front Sleeve Cover Face */}
      <div className="sleeve-cover-face">
        <img
          src={category.coverIcon || category.coverImage || '/frames/web00.webp'}
          alt={category.title}
          className="sleeve-cover-img"
        />
        <div className="sleeve-cover-sheen" />
        <div className="sleeve-info-overlay">
          <span className="sleeve-cat-kicker">ARCHIVE SLEEVE</span>
          <span className="sleeve-cat-title">{category.title}</span>
        </div>
      </div>
    </motion.div>
  );
});

// Fullscreen 16:9 Cinematic Media Lightbox (Zero Text, Pure Visual Experience)
const ProjectRevealDisplay = memo(function ProjectRevealDisplay({
  project,
  category,
  onClose
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const videoMedia = project.media?.find(m => m.type === 'video');
  const hasVideo = Boolean(videoMedia && videoMedia.src);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setProgress((current / total) * 100);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = ratio * videoRef.current.duration;
    setProgress(ratio * 100);
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="project-reveal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClose}
    >
      <motion.div
        className="cinematic-16-9-card"
        initial={{ opacity: 0, scale: 0.38, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.38, rotateY: 90 }}
        transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="cinematic-close-btn"
          onClick={onClose}
          aria-label="Close 16:9 view"
          title="Close (ESC)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="cinematic-media-container" onClick={hasVideo ? togglePlay : undefined}>
          {hasVideo ? (
            <div className="cinematic-video-wrapper">
              <video
                ref={videoRef}
                src={videoMedia.src}
                className="cinematic-video-element"
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Hover-only sleek controls overlay */}
              <div className="cinematic-controls-overlay" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="cinematic-ctrl-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  )}
                </button>

                <div className="cinematic-progress-bar" onClick={handleSeek}>
                  <div className="cinematic-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <button
                  type="button"
                  className="cinematic-ctrl-btn"
                  onClick={() => setIsMuted(prev => !prev)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="cinematic-image-wrapper">
              <img
                src={project.thumbnail || '/frames/web00.webp'}
                alt=""
                className="cinematic-image-element"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

export default function ProjectShowcaseView({
  category: initialCategory,
  project: initialProject,
  onBack,
  albumOrigin
}) {
  const [activeCategoryId] = useState(() => initialCategory?.id || 'videography');
  const activeCategory = getCategoryById(activeCategoryId);
  const projects = activeCategory?.projects || [];

  const [flippingProjectId, setFlippingProjectId] = useState(null);
  const [activeFullscreenProject, setActiveFullscreenProject] = useState(null);
  const [isRetracting, setIsRetracting] = useState(false);

  const handleOpenProject = useCallback((project) => {
    setFlippingProjectId(project.id);
    setTimeout(() => {
      setActiveFullscreenProject(project);
    }, 360);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setActiveFullscreenProject(null);
    setTimeout(() => {
      setFlippingProjectId(null);
    }, 280);
  }, []);

  // Smooth retraction back into docked album sleeve before triggering onBack
  const handleTriggerBack = useCallback(() => {
    if (isRetracting) return;
    if (activeFullscreenProject) {
      handleCloseFullscreen();
      return;
    }
    setIsRetracting(true);
    setTimeout(() => {
      if (onBack) onBack();
    }, 580);
  }, [isRetracting, activeFullscreenProject, handleCloseFullscreen, onBack]);

  const activeProjectIndex = activeFullscreenProject
    ? projects.findIndex(p => p.id === activeFullscreenProject.id)
    : -1;

  const handleNextProject = useCallback(() => {
    if (projects.length <= 1) return;
    const nextIdx = (activeProjectIndex + 1) % projects.length;
    setActiveFullscreenProject(projects[nextIdx]);
  }, [activeProjectIndex, projects]);

  const handlePrevProject = useCallback(() => {
    if (projects.length <= 1) return;
    const prevIdx = (activeProjectIndex - 1 + projects.length) % projects.length;
    setActiveFullscreenProject(projects[prevIdx]);
  }, [activeProjectIndex, projects]);

  // Handle ESC key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (activeFullscreenProject) {
          handleCloseFullscreen();
        } else {
          handleTriggerBack();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFullscreenProject, handleCloseFullscreen, handleTriggerBack]);

  return (
    <div className="editorial-showcase-stage" role="region" aria-label="Draggable Postcards Showcase">
      {/* Clean Minimalist Back to Albums Button (No Circle) */}
      <div className="minimalist-top-nav">
        <button
          type="button"
          className="clean-back-btn is-showcase"
          onClick={handleTriggerBack}
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
      </div>

      {/* Draggable Postcards Desk Canvas */}
      <main className="scattered-canvas-stage">
        {/* Subtle Watermark */}
        <div className="scatter-canvas-watermark" aria-hidden="true">
          <span className="watermark-title">{activeCategory?.title}</span>
          <span className="watermark-sub">HOLD TO DRAG ? CLICK TO FLIP</span>
        </div>

        {/* Postcards Popping Out from Top of Album and Scattering Across Desk */}
        <div className="scattered-envelopes-wrapper">
          {projects.map((proj, idx) => {
            const isMobileScreen = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
            const slots = isMobileScreen ? MOBILE_SCATTER_SLOTS : DEFAULT_SCATTER_SLOTS;
            const scatter = slots[idx % slots.length];
            const isFlipping = flippingProjectId === proj.id;
            return (
              <DraggablePostcard
                key={proj.id}
                project={proj}
                index={idx}
                totalCount={projects.length}
                category={activeCategory}
                isFlipping={isFlipping}
                isRetracting={isRetracting}
                onOpenProject={handleOpenProject}
                scatterSlot={scatter}
              />
            );
          })}
        </div>

        {/* Physical Docked Album Sleeve Anchor at Screen Bottom */}
        <DockedAlbumSleeve
          category={activeCategory}
          onBack={handleTriggerBack}
          isRetracting={isRetracting}
        />
      </main>

      {/* Fullscreen Work Presentation Modal */}
      <AnimatePresence>
        {activeFullscreenProject && (
          <ProjectRevealDisplay
            project={activeFullscreenProject}
            category={activeCategory}
            onClose={handleCloseFullscreen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
