import React, { useState, useRef, useEffect, useLayoutEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import InCardVideoPlayer from './InCardVideoPlayer';

/**
 * Approved Deterministic Scattered Slot Coordinates
 * Generates organic, non-overlapping pinboard slots across the full wide beige (#FFF7ED) postcard canvas.
 */
export function getScatteredSlot(index, count, avgRatio = 1) {
  // 1 item (Josh Talks, Kinetic Commercial Reel)
  if (count === 1) {
    const slots1 = [
      { x: 50, y: 50, maxW: 82, maxH: 88, rot: -1.4 }
    ];
    return slots1[index % slots1.length];
  }

  // 2 items (Dot Store, Fouz Travels — Diagonal Counterbalance)
  if (count === 2) {
    const slots2 = [
      { x: 32, y: 46, maxW: 38, maxH: 82, rot: -2.6 },
      { x: 68, y: 54, maxW: 38, maxH: 82, rot: 2.5 }
    ];
    return slots2[index % slots2.length];
  }

  // 3 items (Triangular Wave)
  if (count === 3) {
    const slots3 = [
      { x: 20, y: 45, maxW: 27, maxH: 76, rot: -2.8 },
      { x: 50, y: 55, maxW: 27, maxH: 78, rot: 1.8 },
      { x: 80, y: 46, maxW: 27, maxH: 76, rot: -2.4 }
    ];
    return slots3[index % slots3.length];
  }

  // 4 items (Fetto Garments — Full-Width 4-Card Staggered Wave for portraits, or 2x2 staggered scatter for landscapes)
  if (count === 4) {
    if (avgRatio < 1.1) {
      // portraits / 9:16
      const slots4P = [
        { x: 15, y: 47, maxW: 21, maxH: 76, rot: -2.8 },
        { x: 38.5, y: 53, maxW: 21, maxH: 76, rot: 2.2 },
        { x: 61.5, y: 46, maxW: 21, maxH: 76, rot: -2.0 },
        { x: 85, y: 54, maxW: 21, maxH: 76, rot: 2.8 }
      ];
      return slots4P[index % slots4P.length];
    } else {
      // landscapes
      const slots4L = [
        { x: 27, y: 29, maxW: 41, maxH: 41, rot: -2.2 },
        { x: 73, y: 31, maxW: 41, maxH: 41, rot: 2.0 },
        { x: 28, y: 71, maxW: 41, maxH: 41, rot: 1.8 },
        { x: 72, y: 69, maxW: 41, maxH: 41, rot: -2.2 }
      ];
      return slots4L[index % slots4L.length];
    }
  }

  // 5 items (Eazyarts Ganesh, Eazyarts 9:16 reels — Full-Width 5-Card Panoramic Wave)
  if (count === 5) {
    if (avgRatio < 1.1) {
      // portraits / 9:16
      const slots5P = [
        { x: 12, y: 52, maxW: 17, maxH: 74, rot: -2.8 },
        { x: 31, y: 44, maxW: 17, maxH: 72, rot: 2.2 },
        { x: 50, y: 53, maxW: 17, maxH: 74, rot: -1.4 },
        { x: 69, y: 44, maxW: 17, maxH: 72, rot: 2.2 },
        { x: 88, y: 52, maxW: 17, maxH: 74, rot: -2.6 }
      ];
      return slots5P[index % slots5P.length];
    } else {
      // landscapes: Top 3 + Bottom 2
      const slots5L = [
        { x: 19, y: 28, maxW: 27, maxH: 40, rot: -2.2 },
        { x: 50, y: 31, maxW: 27, maxH: 40, rot: 1.6 },
        { x: 81, y: 28, maxW: 27, maxH: 40, rot: 2.2 },
        { x: 34, y: 72, maxW: 27, maxH: 40, rot: 1.8 },
        { x: 66, y: 70, maxW: 27, maxH: 40, rot: -2.0 }
      ];
      return slots5L[index % slots5L.length];
    }
  }

  // 6 items (e.g. Jazil in Photography: 3 on top, 3 on bottom)
  if (count === 6) {
    const slots6 = [
      { x: 19, y: 26, maxW: 26, maxH: 38, rot: -2.4 },
      { x: 50, y: 26, maxW: 26, maxH: 38, rot: 1.8 },
      { x: 81, y: 26, maxW: 26, maxH: 38, rot: -1.8 },
      { x: 19, y: 74, maxW: 26, maxH: 38, rot: 2.0 },
      { x: 50, y: 74, maxW: 26, maxH: 38, rot: -2.0 },
      { x: 81, y: 74, maxW: 26, maxH: 38, rot: 1.8 }
    ];
    return slots6[index % slots6.length];
  }

  // 7 items: Top 4 + Bottom 3
  if (count === 7) {
    const slots7 = [
      { x: 14, y: 28, maxW: 21.5, maxH: 40, rot: -2.4 },
      { x: 38, y: 32, maxW: 21.5, maxH: 40, rot: 1.8 },
      { x: 62, y: 27, maxW: 21.5, maxH: 40, rot: -1.8 },
      { x: 86, y: 31, maxW: 21.5, maxH: 40, rot: 2.2 },
      { x: 26, y: 71, maxW: 23, maxH: 40, rot: 2.0 },
      { x: 50, y: 69, maxW: 23, maxH: 40, rot: -1.8 },
      { x: 74, y: 72, maxW: 23, maxH: 40, rot: 1.8 }
    ];
    return slots7[index % slots7.length];
  }

  // 8 items (Fruitly — Two-Tier Organic Staggered Pinboard)
  if (count === 8) {
    const slots8 = [
      // Top row (first 4 items)
      { x: 14, y: 28, maxW: 21.5, maxH: 40, rot: -2.4 },
      { x: 38, y: 32, maxW: 21.5, maxH: 40, rot: 1.8 },
      { x: 62, y: 27, maxW: 21.5, maxH: 40, rot: -1.8 },
      { x: 86, y: 31, maxW: 21.5, maxH: 40, rot: 2.2 },
      // Bottom row (remaining items; balanced x for 0 overlap)
      { x: 15, y: 72, maxW: 21.5, maxH: 40, rot: 2.0 },
      { x: 38.5, y: 69, maxW: 21.5, maxH: 40, rot: -2.0 },
      { x: 61.5, y: 73, maxW: 21.5, maxH: 40, rot: 1.8 },
      { x: 85, y: 70, maxW: 21.5, maxH: 40, rot: -2.2 }
    ];
    return slots8[index % slots8.length];
  }

  // Fallback for any N > 8: Dynamic 2-tier distribution
  const half = Math.ceil(count / 2);
  const isTop = index < half;
  const colIdx = isTop ? index : (index - half);
  const rowCount = isTop ? half : (count - half);
  const step = 72 / Math.max(1, rowCount - 1);
  const x = 14 + colIdx * step;
  const y = isTop ? (index % 2 === 0 ? 28 : 32) : (index % 2 === 0 ? 72 : 69);
  const rot = (index % 2 === 0 ? -1 : 1) * (1.8 + (index % 3) * 0.4);
  const maxW = Math.min(21.5, (80 / rowCount) * 0.95);
  return { x, y, maxW, maxH: 40, rot };
}

export default memo(function PolaroidGallery({
  items = [],
  project = {},
  isExpanded = true,
  isMobile: isMobileProp
}) {
  const isMobile = isMobileProp !== undefined
    ? isMobileProp
    : (typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const stageRef = useRef(null);

  // If no items provided or empty, create default photo set from thumbnail / video
  const photoList = items && items.length > 0 ? items : [
    {
      title: project.title || 'Project Preview',
      src: project.thumbnail || '/frames/web00.webp?v=20261104',
      type: project.videoSrc ? 'video' : 'image',
      aspectRatio: project.videoAspectRatio || project.thumbnailAspectRatio || (project.videoSrc ? 9 / 16 : 1),
      width: project.thumbnailWidth || (project.videoSrc ? 1080 : 1200),
      height: project.thumbnailHeight || (project.videoSrc ? 1920 : 800)
    }
  ];

  const count = photoList.length;

  // Maintain native aspect ratio state map initialized from metadata
  const [ratios, setRatios] = useState(() => {
    const init = {};
    photoList.forEach((item, idx) => {
      const isVid = item.type === 'video' || (item.src && (item.src.endsWith('.mp4') || item.src.endsWith('.mov')));
      if (item.aspectRatio) {
        init[idx] = Number(item.aspectRatio);
      } else if (item.width && item.height) {
        init[idx] = item.width / item.height;
      } else if (isVid) {
        init[idx] = 9 / 16;
      } else {
        init[idx] = 1;
      }
    });
    return init;
  });

  // Keep ratios updated if items change
  useEffect(() => {
    setRatios((prev) => {
      const next = { ...prev };
      let changed = false;
      photoList.forEach((item, idx) => {
        if (next[idx] === undefined) {
          const isVid = item.type === 'video' || (item.src && (item.src.endsWith('.mp4') || item.src.endsWith('.mov')));
          const initialRatio = item.aspectRatio || (item.width && item.height ? item.width / item.height : (isVid ? 9 / 16 : 1));
          next[idx] = initialRatio;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [photoList]);

  // Initial stage size estimation to eliminate initial render flash
  const [stageSize, setStageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const isMob = window.innerWidth <= 768;
      const estW = isMob ? window.innerWidth * 0.9 : Math.min(1380, window.innerWidth * 0.86);
      const estH = isMob ? window.innerHeight * 0.78 : Math.min(840, window.innerHeight * 0.84) - 44;
      return { width: Math.round(estW), height: Math.round(estH) };
    }
    return { width: 1000, height: 550 };
  });

  // Measure stage dimensions responsively with ResizeObserver
  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const measure = () => {
      if (stageRef.current) {
        const { clientWidth, clientHeight } = stageRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setStageSize((prev) => {
            if (Math.abs(prev.width - clientWidth) > 1 || Math.abs(prev.height - clientHeight) > 1) {
              return { width: clientWidth, height: clientHeight };
            }
            return prev;
          });
        }
      }
    };
    measure();

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(stageRef.current);
    }
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Keyboard navigation & ESC for lightbox (capture phase so ESC closes lightbox without closing postcard)
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft' && count > 1) {
        e.preventDefault();
        e.stopPropagation();
        setLightboxIndex((prev) => (prev - 1 + count) % count);
      } else if (e.key === 'ArrowRight' && count > 1) {
        e.preventDefault();
        e.stopPropagation();
        setLightboxIndex((prev) => (prev + 1) % count);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [lightboxIndex, count]);

  // Compute average aspect ratio across all items
  const totalRatio = photoList.reduce((acc, item, idx) => {
    const r = ratios[idx] || item.aspectRatio || (item.width && item.height ? item.width / item.height : 1);
    return acc + r;
  }, 0);
  const avgRatio = count > 0 ? totalRatio / count : 1;

  const canvasW = stageSize.width || 1000;
  const canvasH = stageSize.height || 550;

  return (
    <div
      ref={stageRef}
      className="card-back-body polaroid-gallery pure-bento-postcard"
      style={!isMobile ? {
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 44px)',
        marginTop: '44px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        pointerEvents: 'auto'
      } : {
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 38px)',
        marginTop: '38px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '12px 12px 28px',
        boxSizing: 'border-box',
        pointerEvents: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {photoList.map((item, index) => {
        const isVideo = item.type === 'video' || (item.src && (item.src.endsWith('.mp4') || item.src.endsWith('.mov')));
        const r = ratios[index] || item.aspectRatio || (item.width && item.height ? item.width / item.height : (isVideo ? 9 / 16 : 1));
        const slot = getScatteredSlot(index, count, avgRatio);

        // Exact Aspect-Ratio Bounding Math (Zero Cropping, Zero White Border, Zero Overlap)
        const slotW = (canvasW * slot.maxW) / 100;
        const slotH = (canvasH * slot.maxH) / 100;
        const fittedH = Math.min(slotH, slotW / r);
        const fittedW = fittedH * r;

        const imgSrc = item.src || project.thumbnail || '/frames/web00.webp?v=20261104';

        return (
          <div
            key={index}
            className="scattered-pinboard-item proportional-media-wrapper"
            style={!isMobile ? {
              position: 'absolute',
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: `${Math.round(fittedW)}px`,
              height: `${Math.round(fittedH)}px`,
              maxWidth: `${Math.round(fittedW)}px`,
              maxHeight: `${Math.round(fittedH)}px`,
              transform: `translate(-50%, -50%) rotate(${slot.rot}deg)`,
              border: '2.5px solid var(--blue)',
              borderRadius: '14px',
              overflow: 'hidden',
              padding: 0,
              background: 'transparent',
              boxShadow: '0 8px 20px rgba(10, 25, 55, 0.12)',
              transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease',
              boxSizing: 'border-box',
              zIndex: 10 + index,
              cursor: !isVideo ? 'pointer' : 'default',
              pointerEvents: 'auto'
            } : {
              position: 'relative',
              left: 'auto',
              top: 'auto',
              width: '88%',
              height: 'auto',
              aspectRatio: `${r}`,
              transform: `rotate(${index % 2 === 0 ? -1.5 : 1.5}deg)`,
              border: '2.5px solid var(--blue)',
              borderRadius: '14px',
              overflow: 'hidden',
              padding: 0,
              background: 'transparent',
              boxShadow: '0 6px 16px rgba(10, 25, 55, 0.12)',
              boxSizing: 'border-box',
              flexShrink: 0,
              cursor: !isVideo ? 'pointer' : 'default',
              pointerEvents: 'auto'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isVideo) {
                setLightboxIndex(index);
              }
            }}
            role={!isVideo ? 'button' : undefined}
            tabIndex={!isVideo ? 0 : undefined}
            aria-label={`Media ${index + 1}`}
            onKeyDown={(e) => {
              if (!isVideo && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                e.stopPropagation();
                setLightboxIndex(index);
              }
            }}
          >
            {isVideo ? (
              <InCardVideoPlayer
                project={project}
                media={item}
                isExpanded={isExpanded}
                aspectRatio={r}
                onAspectRatioDetected={(detected) => {
                  if (detected && detected > 0) {
                    setRatios((prev) => (prev[index] !== detected ? { ...prev, [index]: detected } : prev));
                  }
                }}
              />
            ) : (
              <img
                src={imgSrc}
                alt={item.title || project.title || ''}
                className="proportional-media-img scattered-img"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  borderRadius: 'inherit',
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                loading="eager"
                decoding="async"
                draggable="false"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(index);
                }}
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth && naturalHeight) {
                    const detected = naturalWidth / naturalHeight;
                    setRatios((prev) => (prev[index] !== detected ? { ...prev, [index]: detected } : prev));
                  }
                }}
              />
            )}
          </div>
        );
      })}

      {/* Full-Screen High-Resolution Inspect Lightbox (Mounted to body via createPortal) */}
      {lightboxIndex !== null && photoList[lightboxIndex] && typeof document !== 'undefined' && createPortal(
        <div
          className="polaroid-inspect-modal"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="polaroid-inspect-card pure-inspect"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '88vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2.5px solid var(--blue)',
              borderRadius: '14px',
              overflow: 'hidden',
              background: '#050c18',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)'
            }}
          >
            <button
              type="button"
              className="polaroid-inspect-close"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              aria-label="Close image inspection"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {count > 1 && (
              <>
                <button
                  type="button"
                  className="polaroid-inspect-nav-btn is-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev - 1 + count) % count);
                  }}
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="polaroid-inspect-nav-btn is-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev + 1) % count);
                  }}
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}

            <div className="polaroid-inspect-img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '100%', maxHeight: '100%' }}>
              <img
                src={photoList[lightboxIndex].src || project.thumbnail}
                alt={photoList[lightboxIndex].title || ''}
                className="polaroid-inspect-img"
                style={{
                  aspectRatio: ratios[lightboxIndex] ? `${ratios[lightboxIndex]}` : undefined,
                  maxHeight: '86vh',
                  maxWidth: '88vw',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            {count > 1 && (
              <div className="polaroid-inspect-counter">
                {lightboxIndex + 1} / {count}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});
