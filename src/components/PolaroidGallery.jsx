import React, { useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import InCardVideoPlayer from './InCardVideoPlayer';

// Dynamic physical desk coordinates ensuring generous breathing room and matching getScatterSlot
function getProjectScatterSlot(index, totalCount) {
  if (totalCount === 1) {
    return { left: '50%', top: '50%', rot: -1.2, maxW: '55%', maxH: '78%', z: 10 };
  }
  if (totalCount === 2) {
    const slots2 = [
      { left: '31%', top: '50%', rot: -3.0, maxW: '36%', maxH: '76%', z: 11 },
      { left: '69%', top: '50%', rot: 2.8, maxW: '36%', maxH: '76%', z: 12 }
    ];
    return slots2[index % slots2.length];
  }
  if (totalCount === 3) {
    const slots3 = [
      { left: '23%', top: '51%', rot: -3.5, maxW: '28%', maxH: '75%', z: 11 },
      { left: '50%', top: '48%', rot: 1.2, maxW: '28%', maxH: '75%', z: 13 },
      { left: '77%', top: '51%', rot: 3.2, maxW: '28%', maxH: '75%', z: 12 }
    ];
    return slots3[index % slots3.length];
  }
  if (totalCount === 4) {
    const slots4 = [
      { left: '17%', top: '50%', rot: -3.2, maxW: '21.5%', maxH: '75%', z: 11 },
      { left: '39%', top: '47%', rot: 2.4, maxW: '21.5%', maxH: '75%', z: 13 },
      { left: '61%', top: '52%', rot: -2.0, maxW: '21.5%', maxH: '75%', z: 12 },
      { left: '83%', top: '48%', rot: 3.0, maxW: '21.5%', maxH: '75%', z: 14 }
    ];
    return slots4[index % slots4.length];
  }

  // 5+ items: Dynamic organic spread across width
  const step = 74 / Math.max(1, totalCount - 1);
  const leftVal = 13 + index * step;
  const topVal = 49 + (index % 2 === 0 ? -2.5 : 2.5);
  const rot = (index % 2 === 0 ? -1 : 1) * (2.0 + (index % 3) * 0.7);
  const maxW = Math.min(20, 80 / totalCount) + '%';
  return {
    left: `${leftVal.toFixed(1)}%`,
    top: `${topVal.toFixed(1)}%`,
    rot,
    maxW,
    maxH: '74%',
    z: 10 + index
  };
}

export default memo(function PolaroidGallery({
  items = [],
  project = {},
  isExpanded = true
}) {
  const [inspectItem, setInspectItem] = useState(null);
  const stageRef = useRef(null);
  const hasMovedRef = useRef(false);

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
    <div className="polaroid-gallery-container pure-bento-postcard" ref={stageRef}>
      {/* Scattered Polaroid Stage - Matching the scattered arrangement of the postcards themselves */}
      <div className={`polaroid-scatter-stage is-count-${count}`}>
        {photoList.map((item, idx) => {
          const isVideo = item.type === 'video' || (item.src && item.src.endsWith('.mp4'));
          const imgSrc = item.src || project.thumbnail || '/frames/web00.webp?v=20261104';
          const slot = getProjectScatterSlot(idx, count);

          return (
            <motion.div
              key={idx}
              className="scattered-polaroid-item"
              style={{
                left: slot.left,
                top: slot.top,
                zIndex: slot.z,
                width: slot.maxW,
                height: slot.maxH
              }}
              initial={{
                x: '-50%',
                y: '-50%',
                scale: 0.88,
                opacity: 0,
                rotate: slot.rot
              }}
              animate={{
                x: '-50%',
                y: '-50%',
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
                x: '-50%',
                y: '-50%',
                scale: 1.04,
                rotate: slot.rot * 0.3,
                zIndex: 45,
                transition: { duration: 0.2 }
              }}
              drag={isExpanded}
              dragConstraints={stageRef}
              dragElastic={0.06}
              onDragStart={() => {
                hasMovedRef.current = true;
              }}
              onDragEnd={() => {
                setTimeout(() => {
                  hasMovedRef.current = false;
                }, 80);
              }}
              onClick={() => {
                if (!hasMovedRef.current && !isVideo) {
                  setInspectItem(item);
                }
              }}
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
              {/* Proper Physical Polaroid Frame conforming to exact media aspect ratio */}
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
          );
        })}
      </div>

      {/* High-Resolution Inspect Lightbox */}
      {inspectItem && (
        <div
          className="polaroid-inspect-modal"
          onClick={() => setInspectItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="polaroid-inspect-card pure-inspect"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="polaroid-inspect-close"
              onClick={() => setInspectItem(null)}
              aria-label="Close image inspection"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="polaroid-inspect-img-wrap">
              <img
                src={inspectItem.src}
                alt=""
                className="polaroid-inspect-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
