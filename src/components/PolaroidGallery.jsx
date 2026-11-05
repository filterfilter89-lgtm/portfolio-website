import React, { useState, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import InCardVideoPlayer from './InCardVideoPlayer';

// Heatmap-calibrated physical desk coordinates: guaranteed 0% overlap and 100% containment
function getProjectScatterSlot(index, totalCount) {
  if (totalCount === 1) {
    return { left: '50%', top: '50%', rot: -1.0, maxW: '46%', maxH: '76%', z: 12 };
  }
  if (totalCount === 2) {
    const slots2 = [
      { left: '29%', top: '50%', rot: -2.5, maxW: '32%', maxH: '74%', z: 12 },
      { left: '71%', top: '50%', rot: 2.2, maxW: '32%', maxH: '74%', z: 14 }
    ];
    return slots2[index % slots2.length];
  }
  if (totalCount === 3) {
    const slots3 = [
      { left: '20%', top: '51%', rot: -2.8, maxW: '23%', maxH: '74%', z: 12 },
      { left: '50%', top: '48%', rot: 1.2, maxW: '23%', maxH: '74%', z: 14 },
      { left: '80%', top: '51%', rot: 2.5, maxW: '23%', maxH: '74%', z: 13 }
    ];
    return slots3[index % slots3.length];
  }
  if (totalCount === 4) {
    const slots4 = [
      { left: '15.5%', top: '51%', rot: -2.8, maxW: '18.5%', maxH: '73%', z: 12 },
      { left: '38.5%', top: '48%', rot: 2.2, maxW: '18.5%', maxH: '73%', z: 14 },
      { left: '61.5%', top: '52%', rot: -1.8, maxW: '18.5%', maxH: '73%', z: 13 },
      { left: '84.5%', top: '49%', rot: 2.5, maxW: '18.5%', maxH: '73%', z: 15 }
    ];
    return slots4[index % slots4.length];
  }

  // 5+ items: Two balanced organic rows with zero overlap
  const half = Math.ceil(totalCount / 2);
  const isTop = index < half;
  const rowCount = isTop ? half : (totalCount - half);
  const colIdx = isTop ? index : (index - half);
  const step = 72 / Math.max(1, rowCount - 1);
  const leftVal = 14 + colIdx * step;
  const topVal = isTop ? 29 : 71;
  const rot = (index % 2 === 0 ? -1 : 1) * (1.6 + (index % 3) * 0.6);
  const maxW = Math.min(20, Math.floor(70 / rowCount)) + '%';
  return {
    left: `${leftVal.toFixed(1)}%`,
    top: `${topVal}%`,
    rot,
    maxW,
    maxH: '36%',
    z: 10 + index
  };
}

export default memo(function PolaroidGallery({
  items = [],
  project = {},
  isExpanded = true
}) {
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
          const slot = getProjectScatterSlot(idx, count);

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
                  scale: 0.88,
                  opacity: 0,
                  rotate: slot.rot
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: slot.rot,
                  transition: {
                    duration: 0.45,
                    delay: idx * 0.05,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: slot.rot * 0.25,
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
