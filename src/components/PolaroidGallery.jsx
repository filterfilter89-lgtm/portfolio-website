import React, { useState, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import InCardVideoPlayer from './InCardVideoPlayer';

// Heatmap-calibrated zero-rotation coordinates: maximized available space, even spacing, and guaranteed 0% overlap
function getProjectScatterSlot(index, totalCount, isMobile = false) {
  // Strict 0 rotation
  const rot = 0;

  if (totalCount === 1) {
    return {
      left: '50%',
      top: '50%',
      rot: 0,
      maxW: isMobile ? '76%' : '70%',
      maxH: '86%',
      z: 12
    };
  }

  if (totalCount >= 2 && totalCount <= 4) {
    const K = totalCount;
    // Maximized slot widths for single-row presentation
    const cardWidths = { 2: 42, 3: 28, 4: 21 };
    const W = cardWidths[K];
    const totalGap = 100 - (K * W);
    const G = totalGap / (K + 1);
    const leftCenter = G * (index + 1) + W * (index + 0.5);

    return {
      left: `${leftCenter.toFixed(1)}%`,
      top: '50%',
      rot: 0,
      maxW: `${W}%`,
      maxH: '84%',
      z: 10 + index
    };
  }

  // 5+ items: 2 balanced rows with unified card sizing and even gaps
  const half = Math.ceil(totalCount / 2);
  const isTop = index < half;
  const rowCount = isTop ? half : (totalCount - half);
  const colIdx = isTop ? index : (index - half);

  const W = Math.floor(84 / half);
  const totalGap = 100 - (rowCount * W);
  const G = totalGap / (rowCount + 1);
  const leftCenter = G * (colIdx + 1) + W * (colIdx + 0.5);

  // 2 vertical rows with balanced margins
  const topCenter = isTop ? 27 : 73;

  return {
    left: `${leftCenter.toFixed(1)}%`,
    top: `${topCenter}%`,
    rot: 0,
    maxW: `${W}%`,
    maxH: '38%',
    z: 10 + index
  };
}

export default memo(function PolaroidGallery({
  items = [],
  project = {},
  isExpanded = true,
  isMobile: isMobileProp
}) {
  const isMobile = isMobileProp !== undefined
    ? isMobileProp
    : (typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  const [inspectItem, setInspectItem] = useState(null);

  // If no items provided or empty, create default photo set from thumbnail
  const photoList = items && items.length > 0 ? items : [
    {
      title: project.title || 'Project Preview',
      src: project.thumbnail || '/frames/web00.webp?v=20261104',
      type: project.videoSrc ? 'video' : 'image'
    }
  ];

  const count = photoList.length;

  return (
    <div className="polaroid-gallery-container pure-bento-postcard">
      {/* Scattered Polaroid Stage - Matching the scattered arrangement of the postcards themselves */}
      <div className={`polaroid-scatter-stage is-count-${count}`}>
        {photoList.map((item, idx) => {
          const isVideo = item.type === 'video' || (item.src && item.src.endsWith('.mp4'));
          const imgSrc = item.src || project.thumbnail || '/frames/web00.webp?v=20261104';
          const slot = getProjectScatterSlot(idx, count, isMobile);

          return (
            <div
              key={idx}
              className="scattered-polaroid-slot"
              style={{
                position: 'absolute',
                left: slot.left,
                top: slot.top,
                width: slot.maxW,
                height: slot.maxH,
                transform: 'translate(-50%, -50%)',
                zIndex: slot.z
              }}
            >
              <motion.div
                className="scattered-polaroid-item"
                initial={{
                  scale: 0.92,
                  opacity: 0,
                  rotate: 0
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  transition: {
                    duration: 0.4,
                    delay: idx * 0.04,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
                whileHover={{
                  scale: 1.04,
                  rotate: 0,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                onClick={() => !isVideo && setInspectItem(item)}
                role={!isVideo ? 'button' : undefined}
                tabIndex={!isVideo ? 0 : undefined}
                onKeyDown={(e) => {
                  if (!isVideo && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setInspectItem(item);
                  }
                }}
                aria-label={`Photo ${idx + 1}`}
              >
                {/* Physical Polaroid Frame conforming to exact media aspect ratio */}
                <div className="scattered-polaroid-frame">
                  <div className="scattered-photo-well">
                    {isVideo ? (
                      <div className="exact-aspect-video-wrapper">
                        <InCardVideoPlayer project={project} media={item} isExpanded={isExpanded} />
                      </div>
                    ) : (
                      <img
                        src={imgSrc}
                        alt={item.title || ''}
                        className="scattered-img"
                        loading="lazy"
                        draggable="false"
                      />
                    )}
                  </div>
                  <div className="scattered-chin" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Full-screen Lightbox Inspect Modal via Portal */}
      {inspectItem && typeof document !== 'undefined' && createPortal(
        <div
          className="polaroid-inspect-modal"
          onClick={() => setInspectItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Inspect media full size"
        >
          <div className="polaroid-inspect-card pure-inspect" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="polaroid-inspect-close polaroid-inspect-close-btn"
              onClick={() => setInspectItem(null)}
              aria-label="Close full size preview"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="polaroid-inspect-img-wrap polaroid-inspect-media-container">
              <img
                src={inspectItem.src || project.thumbnail}
                alt={inspectItem.title || project.title}
                className="polaroid-inspect-img"
              />
            </div>
            {inspectItem.title && (
              <div className="polaroid-inspect-caption">
                <span className="polaroid-inspect-title">{inspectItem.title}</span>
                {project.title && (
                  <span className="polaroid-inspect-project">{project.title}</span>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});
