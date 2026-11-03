const fs = require('fs');

const code = `import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, getCategoryById } from '../data/categories';

// ── Curated Postal Stamp Component ──
const PostalStamp = memo(function PostalStamp({ stampCode, city, year, index }) {
  const stampColors = ['#9e2a2b', '#1d4e89', '#2a6f97', '#386641', '#6b2d5c'];
  const color = stampColors[index % stampColors.length];

  return (
    <div className="postcard-stamp-wrap" aria-hidden="true">
      <div className="postcard-stamp" style={{ '--stamp-color': color }}>
        <div className="stamp-perforations" />
        <div className="stamp-inner-border">
          <div className="stamp-top-row">
            <span className="stamp-country">POSTAGE</span>
            <span className="stamp-value">25¢</span>
          </div>
          <div className="stamp-center-art">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 0 0 18" />
              <path d="M3 12h18" />
            </svg>
          </div>
          <div className="stamp-bottom-row">
            <span className="stamp-city">{city || 'ARCHIVE'}</span>
            <span className="stamp-year">{year || '2024'}</span>
          </div>
        </div>
      </div>
      {/* Circular Ink Postmark Cancellation */}
      <div className="postcard-postmark">
        <div className="postmark-circle">
          <span className="postmark-city">{city || 'DISPATCH'}</span>
          <span className="postmark-date">{year || '2024'}</span>
          <span className="postmark-brand">BASIL JOSE</span>
        </div>
        <div className="postmark-wavy-lines">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
});

// ── Single Editorial Postcard / Letter Card ──
const EditorialPostcard = memo(function EditorialPostcard({
  project,
  index,
  total,
  category,
  onOpenDossier,
  scatterConfig
}) {
  const isVideo = project.media && project.media.some(m => m.type === 'video');
  const previewMedia = (project.media && project.media[0]) || null;
  const imageSrc = project.thumbnail || (previewMedia && previewMedia.src) || '/frames/web00.webp';

  const { rot, xOff, yOff, z } = scatterConfig;

  return (
    <motion.article
      className="editorial-postcard"
      style={{
        '--base-rot': `${rot}deg`,
        '--x-off': `${xOff}%`,
        '--y-off': `${yOff}%`,
        '--z-order': z
      }}
      initial={{ opacity: 0, y: 30, scale: 0.92, rotate: rot * 1.5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: rot }}
      transition={{
        duration: 0.65,
        delay: 0.12 + index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      onClick={() => onOpenDossier(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDossier(project);
        }
      }}
      aria-label={`Open project dossier: ${project.title}`}
    >
      {/* Airmail Red & Blue Chevron Top Edge */}
      <div className="postcard-airmail-edge" aria-hidden="true" />

      {/* Header Row: Format Tag + Stamp */}
      <div className="postcard-top-row">
        <div className="postcard-meta-header">
          <span className="postcard-format-badge">
            {project.formatTag || 'CORRESPONDENCE'}
          </span>
          <span className="postcard-archive-id">
            REF #{String(index + 1).padStart(2, '0')} // {category.title}
          </span>
        </div>
        <PostalStamp
          stampCode={project.stampCode}
          city={project.city}
          year={project.dateStamp?.slice(-4) || '2024'}
          index={index}
        />
      </div>

      {/* Project Visual Stage */}
      <div className="postcard-media-frame">
        <img
          src={imageSrc}
          alt={project.title}
          className="postcard-image"
          loading="lazy"
        />
        {isVideo && (
          <div className="postcard-video-badge" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            <span>REEL MASTER</span>
          </div>
        )}
        <div className="postcard-photo-corner" />
      </div>

      {/* Editorial Content / Letter Typography */}
      <div className="postcard-body">
        <div className="postcard-client-date">
          <span className="postcard-client">{project.client}</span>
          <span className="postcard-date">{project.dateStamp || '2024'}</span>
        </div>

        <h3 className="postcard-title">{project.title}</h3>

        <div className="postcard-role-pill">
          <span className="role-bullet">•</span>
          <span>{project.role}</span>
        </div>

        <p className="postcard-description">
          {project.description}
        </p>

        <div className="postcard-bottom-footer">
          <span className="postcard-city-tag">ORIGIN: {project.city || 'ARCHIVE'}</span>
          <span className="postcard-inspect-cta">
            INSPECT RECORD <span>↗</span>
          </span>
        </div>
      </div>
    </motion.article>
  );
});

// ── Corner Spinning Disc (Turntable in Bottom-Right) ──
const CornerSpinningDisc = memo(function CornerSpinningDisc({
  category,
  discOrigin,
  onDiscClick
}) {
  return (
    <motion.aside
      className="corner-turntable-assembly"
      initial={{
        x: discOrigin ? discOrigin.x - (typeof window !== 'undefined' ? window.innerWidth - 120 : 0) : 100,
        y: discOrigin ? discOrigin.y - (typeof window !== 'undefined' ? window.innerHeight - 120 : 0) : 100,
        scale: 1.15,
        opacity: 0.3,
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
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1]
      }}
      aria-label={`Playing category vinyl record: ${category?.title || 'Selected Works'}`}
    >
      {/* Vinyl Record Body */}
      <div className="corner-vinyl-disc" onClick={onDiscClick} title="Playing at 33 ⅓ RPM">
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

      {/* Ambient Live Turntable Status Tag */}
      <div className="corner-turntable-tag">
        <span className="turntable-pulse-dot" />
        <span className="turntable-text">NOW SPINNING // 33 ⅓</span>
      </div>
    </motion.aside>
  );
});

// ── Unfolded Project Dossier Modal (Interactive Lightbox) ──
const ProjectDossierModal = memo(function ProjectDossierModal({
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
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Keyboard navigation
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
      className="project-dossier-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="project-dossier-sheet"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Airmail Chevron Top Ribbon */}
        <div className="dossier-airmail-ribbon" />

        {/* Modal Close Button */}
        <button
          type="button"
          className="dossier-close-btn"
          onClick={onClose}
          aria-label="Close project dossier"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Bar */}
        <div className="dossier-header">
          <div className="dossier-header-left">
            <span className="dossier-kicker">ARCHIVAL DOSSIER // {category.title}</span>
            <h2 className="dossier-title">{project.title}</h2>
            <div className="dossier-meta-row">
              <span className="dossier-client">{project.client}</span>
              <span className="dossier-sep">•</span>
              <span className="dossier-role">{project.role}</span>
              <span className="dossier-sep">•</span>
              <span className="dossier-city">{project.city || 'ARCHIVE'}</span>
            </div>
          </div>
          <div className="dossier-header-stamp">
            <span className="dossier-stamp-mark">VERIFIED MASTER</span>
            <span className="dossier-stamp-code">{project.stampCode || 'ARCHIVE-2024'}</span>
          </div>
        </div>

        {/* Media Stage */}
        <div className="dossier-media-container" onClick={hasVideo ? togglePlay : undefined}>
          {hasVideo ? (
            <div className="dossier-video-stage">
              <video
                ref={videoRef}
                src={videoMedia.src}
                className="dossier-video-element"
                autoPlay
                loop
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Video Controls Bar */}
              <div className="dossier-video-controls" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="dossier-ctrl-btn"
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

                <div className="dossier-progress-track" onClick={handleSeek}>
                  <div className="dossier-progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <button
                  type="button"
                  className="dossier-ctrl-btn"
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
            <div className="dossier-image-stage">
              <img
                src={project.thumbnail || '/frames/web00.webp'}
                alt={project.title}
                className="dossier-image-element"
              />
            </div>
          )}
        </div>

        {/* Narrative & Specifications Body */}
        <div className="dossier-narrative-grid">
          <div className="dossier-synopsis">
            <h4 className="dossier-section-title">CREATIVE NARRATIVE</h4>
            <p className="dossier-text">{project.description}</p>
          </div>

          <div className="dossier-specs">
            <h4 className="dossier-section-title">SPECIFICATIONS</h4>
            <ul className="dossier-specs-list">
              <li><strong>DISCIPLINE:</strong> {category.title}</li>
              <li><strong>CLIENT / ORIGIN:</strong> {project.client}</li>
              <li><strong>ROLE:</strong> {project.role}</li>
              <li><strong>LOCATION:</strong> {project.city || 'ARCHIVE'}</li>
              <li><strong>DATE RECORDED:</strong> {project.dateStamp || '2024'}</li>
              <li><strong>CATALOGUE NO:</strong> {project.stampCode || 'BJ-CAT-24'}</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer with Previous / Next Arrows */}
        {hasMultiple && (
          <div className="dossier-nav-footer">
            <button
              type="button"
              className="dossier-nav-arrow"
              onClick={onPrev}
              aria-label="Previous project in archive"
            >
              <span>← PREVIOUS RECORD</span>
            </button>
            <span className="dossier-nav-counter">
              ARCHIVE CORRESPONDENCE
            </span>
            <button
              type="button"
              className="dossier-nav-arrow"
              onClick={onNext}
              aria-label="Next project in archive"
            >
              <span>NEXT RECORD →</span>
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

// ── Organic Curated Scatter Configurations (5 slots) ──
const DESKTOP_SCATTER = [
  { rot: -3.4, xOff: 0,  yOff: 0,  z: 14 },
  { rot: 2.8,  xOff: 2,  yOff: -4, z: 18 },
  { rot: -2.0, xOff: -2, yOff: 4,  z: 16 },
  { rot: 3.5,  xOff: 1,  yOff: -2, z: 12 },
  { rot: -2.6, xOff: -1, yOff: 3,  z: 15 }
];

// ── Main Pure Editorial Postcard Project Showcase ──
export default function ProjectShowcaseView({
  category: initialCategory,
  project: initialProject,
  onBack,
  discOrigin
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(() => initialCategory?.id || 'videography');
  const activeCategory = getCategoryById(activeCategoryId);
  const projects = activeCategory?.projects || [];

  const [activeDossierProject, setActiveDossierProject] = useState(() => initialProject || null);

  const activeProjectIndex = activeDossierProject
    ? projects.findIndex(p => p.id === activeDossierProject.id)
    : -1;

  const handleNextProject = useCallback(() => {
    if (projects.length <= 1) return;
    const nextIdx = (activeProjectIndex + 1) % projects.length;
    setActiveDossierProject(projects[nextIdx]);
  }, [activeProjectIndex, projects]);

  const handlePrevProject = useCallback(() => {
    if (projects.length <= 1) return;
    const prevIdx = (activeProjectIndex - 1 + projects.length) % projects.length;
    setActiveDossierProject(projects[prevIdx]);
  }, [activeProjectIndex, projects]);

  // Handle ESC key to return
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !activeDossierProject) {
        if (onBack) onBack();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, activeDossierProject]);

  return (
    <div className="editorial-showcase-stage" role="region" aria-label="Project Archive Postcard Collection">
      {/* ── Top Floating Minimalist Bar ── */}
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
                  setActiveDossierProject(null);
                }}
              >
                {cat.title}
              </button>
            );
          })}
        </nav>

        <div className="showcase-counter-badge">
          <span>{String(projects.length).padStart(2, '0')} RECORDS</span>
        </div>
      </header>

      {/* ── Main Canvas: Scattered Postcards & Letters ── */}
      <main className="postcard-scatter-canvas">
        {/* Subtle Watermark Branding in Background */}
        <div className="scatter-canvas-watermark" aria-hidden="true">
          <span className="watermark-title">{activeCategory?.title}</span>
          <span className="watermark-sub">CORRESPONDENCE & CREATIVE ARCHIVE</span>
        </div>

        {/* Scattered Postcards Container */}
        <div className="postcard-scatter-grid">
          {projects.map((proj, idx) => {
            const scatterConfig = DESKTOP_SCATTER[idx % DESKTOP_SCATTER.length];
            return (
              <EditorialPostcard
                key={proj.id}
                project={proj}
                index={idx}
                total={projects.length}
                category={activeCategory}
                onOpenDossier={setActiveDossierProject}
                scatterConfig={scatterConfig}
              />
            );
          })}
        </div>
      </main>

      {/* ── Fixed Corner Spinning Disc (Turntable in Bottom-Right) ── */}
      <CornerSpinningDisc
        category={activeCategory}
        discOrigin={discOrigin}
        onDiscClick={() => {
          // Open the first project or showreel if clicked
          if (projects.length > 0) setActiveDossierProject(projects[0]);
        }}
      />

      {/* ── Interactive Unfolded Project Dossier Lightbox Modal ── */}
      <AnimatePresence>
        {activeDossierProject && (
          <ProjectDossierModal
            project={activeDossierProject}
            category={activeCategory}
            onClose={() => setActiveDossierProject(null)}
            onNext={handleNextProject}
            onPrev={handlePrevProject}
            hasMultiple={projects.length > 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync('src/components/ProjectShowcaseView.jsx', code, 'utf8');
console.log('src/components/ProjectShowcaseView.jsx created successfully');
