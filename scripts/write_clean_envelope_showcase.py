content = '''import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, getCategoryById } from '../data/categories';

// ── Organic Scattered Layout Coordinates (Non-Grid, Natural & Random-Feeling) ──
// Leaves the bottom-right corner completely open for the single spinning vinyl record
const SCATTER_SLOTS = [
  { left: '10%', top: '15%', rot: -6.8, z: 12 },
  { left: '44%', top: '11%', rot: 5.2,  z: 15 },
  { left: '72%', top: '18%', rot: -3.4, z: 11 },
  { left: '16%', top: '54%', rot: 6.4,  z: 14 },
  { left: '46%', top: '56%', rot: -5.1, z: 13 }
];

// ── Plain Blank Landscape Postcard Envelope Component ──
// Plain, blank, landscape-oriented rectangle with NO images, NO illustrations, NO thumbnails, and NO background artwork
const PlainLandscapePostcard = memo(function PlainLandscapePostcard({
  project,
  index,
  category,
  isOpen,
  onOpen,
  scatter
}) {
  return (
    <motion.div
      className={`plain-landscape-postcard ${isOpen ? 'is-opening' : ''}`}
      style={{
        '--card-left': scatter.left,
        '--card-top': scatter.top,
        '--base-rot': `${scatter.rot}deg`,
        '--z-order': isOpen ? 90 : scatter.z
      }}
      initial={{ opacity: 0, scale: 0.88, rotate: scatter.rot * 1.6 }}
      animate={{ opacity: 1, scale: 1, rotate: scatter.rot }}
      transition={{
        duration: 0.55,
        delay: 0.08 + index * 0.06,
        ease: [0.22, 1, 0.36, 1]
      }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      aria-label={`Open project envelope: ${project.title}`}
    >
      {/* Physical Envelope Pocket & Flap (Plain, warm beige #FFF7ED) */}
      <div className="envelope-pocket">
        {/* Envelope 3D Foldable Top Flap */}
        <div className={`envelope-flap ${isOpen ? 'is-flap-open' : ''}`}>
          <div className="flap-seam-triangle" />
        </div>

        {/* Interior Project Letter Sheet (peeks out or slides up when open) */}
        <div className={`envelope-letter-sheet ${isOpen ? 'is-sliding-out' : ''}`}>
          <div className="letter-header-line" />
          <div className="letter-title-preview">{project.title}</div>
        </div>

        {/* Envelope Face (Plain Blank Landscape Surface with Minimal Typography) */}
        <div className="envelope-face">
          <div className="envelope-airmail-edge" />

          <div className="envelope-meta-top">
            <span className="envelope-index-tag">
              CORRESPONDENCE #{String(index + 1).padStart(2, '0')}
            </span>
            <span className="envelope-discipline-tag">
              {category.title}
            </span>
          </div>

          <div className="envelope-content-center">
            <div className="envelope-client-date">
              <span>{project.client}</span>
              <span>{project.dateStamp || '2024'}</span>
            </div>
            <h3 className="envelope-project-title">{project.title}</h3>
            <div className="envelope-role-tag">{project.role}</div>
          </div>

          <div className="envelope-footer-row">
            <span className="envelope-city-seal">SEALED // {project.city || 'ARCHIVE'}</span>
            <span className="envelope-open-hint">
              OPEN ENVELOPE <span className="hint-arrow">→</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ── Strictly ONE Vinyl Record Docked in Bottom-Right Corner ──
// Exactly one vinyl record per album, slides smoothly to bottom-right and spins continuously
const SingleCornerVinyl = memo(function SingleCornerVinyl({
  category,
  discOrigin,
  onDiscClick
}) {
  return (
    <motion.aside
      className="corner-turntable-assembly"
      initial={{
        x: discOrigin ? discOrigin.x - (typeof window !== 'undefined' ? window.innerWidth - 130 : 0) : -180,
        y: discOrigin ? discOrigin.y - (typeof window !== 'undefined' ? window.innerHeight - 130 : 0) : -220,
        scale: 1.1,
        opacity: 0.6,
        rotate: 0
      }}
      animate={{
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotate: 360
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1]
      }}
      aria-label={`Vinyl record for ${category?.title || 'Selected Album'}`}
    >
      {/* Vinyl Disc Body with continuous infinite 33 ⅓ RPM spin */}
      <div className="corner-vinyl-disc" onClick={onDiscClick} title="33 ⅓ RPM Turntable">
        <div className="corner-vinyl-grooves" />
        <div className="corner-vinyl-sheen" />

        {/* Center Typographic Label */}
        <div className="corner-vinyl-center-label">
          <div className="corner-label-ring" />
          <div className="corner-label-side">SIDE A</div>
          <div className="corner-label-brand">BASIL JOSE</div>
          <div className="corner-label-category">{category?.title || 'RECORDING'}</div>
          <div className="corner-label-speed">33 ⅓ RPM</div>
          <div className="corner-spindle-hole" />
        </div>
      </div>

      {/* Ambient Turntable Indicator */}
      <div className="corner-turntable-tag">
        <span className="turntable-pulse-dot" />
        <span className="turntable-text">NOW SPINNING // 33 ⅓</span>
      </div>
    </motion.aside>
  );
});

// ── Clear React-Powered Project Reveal Display ──
// Expands smoothly from the envelope to display the corresponding project clearly on screen
const ProjectRevealDisplay = memo(function ProjectRevealDisplay({
  project,
  category,
  onClose,
  onNext,
  onPrev,
  hasMultiple
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

  // Keyboard navigation & ESC handler
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      className="project-reveal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="project-reveal-card"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Envelope Chevron Header Ribbon */}
        <div className="reveal-airmail-ribbon" />

        {/* Close Button */}
        <button
          type="button"
          className="reveal-close-btn"
          onClick={onClose}
          aria-label="Close project reveal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Project Header */}
        <div className="reveal-header">
          <div className="reveal-header-left">
            <span className="reveal-kicker">PROJECT ENVELOPE // {category.title}</span>
            <h2 className="reveal-title">{project.title}</h2>
            <div className="reveal-meta-row">
              <span className="reveal-client">{project.client}</span>
              <span className="reveal-sep">•</span>
              <span className="reveal-role">{project.role}</span>
              <span className="reveal-sep">•</span>
              <span className="reveal-city">{project.city || 'ARCHIVE'}</span>
            </div>
          </div>
          <div className="reveal-stamp-tag">
            <span className="stamp-tag-label">VERIFIED PROJECT</span>
            <span className="stamp-tag-code">{project.stampCode || 'ARCHIVE-2024'}</span>
          </div>
        </div>

        {/* Project Media Stage */}
        <div className="reveal-media-stage" onClick={hasVideo ? togglePlay : undefined}>
          {hasVideo ? (
            <div className="reveal-video-wrapper">
              <video
                ref={videoRef}
                src={videoMedia.src}
                className="reveal-video-element"
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Video Player Controls */}
              <div className="reveal-video-controls" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="reveal-ctrl-btn"
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

                <div className="reveal-progress-track" onClick={handleSeek}>
                  <div className="reveal-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <button
                  type="button"
                  className="reveal-ctrl-btn"
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
            <div className="reveal-image-wrapper">
              <img
                src={project.thumbnail || '/frames/web00.webp'}
                alt={project.title}
                className="reveal-image-element"
              />
            </div>
          )}
        </div>

        {/* Narrative & Details */}
        <div className="reveal-body-grid">
          <div className="reveal-narrative">
            <h4 className="reveal-subheading">PROJECT OVERVIEW</h4>
            <p className="reveal-description">{project.description}</p>
          </div>

          <div className="reveal-specs">
            <h4 className="reveal-subheading">DETAILS</h4>
            <ul className="reveal-specs-list">
              <li><strong>DISCIPLINE:</strong> {category.title}</li>
              <li><strong>CLIENT:</strong> {project.client}</li>
              <li><strong>ROLE:</strong> {project.role}</li>
              <li><strong>LOCATION:</strong> {project.city || 'ARCHIVE'}</li>
              <li><strong>YEAR:</strong> {project.dateStamp || '2024'}</li>
            </ul>
          </div>
        </div>

        {/* Navigation Footer */}
        {hasMultiple && (
          <div className="reveal-footer-nav">
            <button
              type="button"
              className="reveal-nav-btn"
              onClick={onPrev}
              aria-label="Previous project in envelope collection"
            >
              <span>← PREVIOUS PROJECT</span>
            </button>
            <span className="reveal-counter-text">
              ENVELOPE ARCHIVE
            </span>
            <button
              type="button"
              className="reveal-nav-btn"
              onClick={onNext}
              aria-label="Next project in envelope collection"
            >
              <span>NEXT PROJECT →</span>
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

// ── Main Pure React Scattered Postcard & Envelope Showcase View ──
export default function ProjectShowcaseView({
  category: initialCategory,
  project: initialProject,
  onBack,
  discOrigin
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(() => initialCategory?.id || 'videography');
  const activeCategory = getCategoryById(activeCategoryId);
  const projects = activeCategory?.projects || [];

  // Track the active open envelope
  const [activeEnvelopeProject, setActiveEnvelopeProject] = useState(null);

  const activeProjectIndex = activeEnvelopeProject
    ? projects.findIndex(p => p.id === activeEnvelopeProject.id)
    : -1;

  const handleNextProject = useCallback(() => {
    if (projects.length <= 1) return;
    const nextIdx = (activeProjectIndex + 1) % projects.length;
    setActiveEnvelopeProject(projects[nextIdx]);
  }, [activeProjectIndex, projects]);

  const handlePrevProject = useCallback(() => {
    if (projects.length <= 1) return;
    const prevIdx = (activeProjectIndex - 1 + projects.length) % projects.length;
    setActiveEnvelopeProject(projects[prevIdx]);
  }, [activeProjectIndex, projects]);

  // Handle ESC key to return or close envelope
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (activeEnvelopeProject) {
          setActiveEnvelopeProject(null);
        } else if (onBack) {
          onBack();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, activeEnvelopeProject]);

  return (
    <div className="editorial-showcase-stage" role="region" aria-label="Scattered Postcard Envelopes Collection">
      {/* ── Top Floating Minimalist Navigation ── */}
      <header className="showcase-editorial-header">
        <button
          type="button"
          className="editorial-back-pill"
          onClick={onBack}
          aria-label="Return to Album Carousel"
        >
          <span className="back-arrow" aria-hidden="true">←</span>
          <span>ALBUMS</span>
          <span className="back-esc-tag">ESC</span>
        </button>

        {/* Category Archive Selector Pills */}
        <nav className="showcase-category-nav" aria-label="Categories">
          {CATEGORIES.map(cat => {
            const isCatActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                className={`showcase-cat-pill ${isCatActive ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setActiveEnvelopeProject(null);
                }}
              >
                {cat.title}
              </button>
            );
          })}
        </nav>

        <div className="showcase-counter-badge">
          <span>{String(projects.length).padStart(2, '0')} ENVELOPES</span>
        </div>
      </header>

      {/* ── Natural Scattered Canvas: Plain Blank Landscape Postcards ── */}
      <main className="scattered-canvas-stage">
        {/* Subtle Archival Watermark */}
        <div className="scatter-canvas-watermark" aria-hidden="true">
          <span className="watermark-title">{activeCategory?.title}</span>
          <span className="watermark-sub">SCATTERED CORRESPONDENCE ARCHIVE</span>
        </div>

        {/* Natural Organic Scatter Area (Free placement, no grid rows) */}
        <div className="scattered-envelopes-wrapper">
          {projects.map((proj, idx) => {
            const scatter = SCATTER_SLOTS[idx % SCATTER_SLOTS.length];
            const isOpen = activeEnvelopeProject?.id === proj.id;
            return (
              <PlainLandscapePostcard
                key={proj.id}
                project={proj}
                index={idx}
                category={activeCategory}
                isOpen={isOpen}
                onOpen={setActiveEnvelopeProject}
                scatter={scatter}
              />
            );
          })}
        </div>
      </main>

      {/* ── Strictly ONE Vinyl Record Docked in Bottom-Right Corner ── */}
      <SingleCornerVinyl
        category={activeCategory}
        discOrigin={discOrigin}
        onDiscClick={() => {
          if (projects.length > 0) setActiveEnvelopeProject(projects[0]);
        }}
      />

      {/* ── Clear Project Reveal Display (Animated Envelope Opening) ── */}
      <AnimatePresence>
        {activeEnvelopeProject && (
          <ProjectRevealDisplay
            project={activeEnvelopeProject}
            category={activeCategory}
            onClose={() => setActiveEnvelopeProject(null)}
            onNext={handleNextProject}
            onPrev={handlePrevProject}
            hasMultiple={projects.length > 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
'''

with open('src/components/ProjectShowcaseView.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("src/components/ProjectShowcaseView.jsx written successfully.")
