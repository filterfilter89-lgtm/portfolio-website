import React, { useState, useRef, useEffect, useLayoutEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import InCardVideoPlayer from './InCardVideoPlayer';

export default memo(function PolaroidGallery({
  items = [],
  project = {},
  isExpanded = true,
  isMobile: isMobileProp
}) {
  const isMobile = isMobileProp !== undefined
    ? isMobileProp
    : (typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

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

  // Measure stage dimensions responsively to guarantee 100% containment and zero overflow
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

  // Partition items into balanced rows (1 row for 1–3 items; 2 balanced rows for 4–8 items)
  const rows = [];
  if (count <= 3) {
    rows.push(photoList.map((item, idx) => ({ item, index: idx })));
  } else {
    const mid = Math.ceil(count / 2);
    rows.push(photoList.slice(0, mid).map((item, idx) => ({ item, index: idx })));
    rows.push(photoList.slice(mid).map((item, idx) => ({ item, index: mid + idx })));
  }

  const numRows = rows.length;
  const rowGap = isMobile ? 8 : 10;
  const itemGap = isMobile ? 8 : 10;

  return (
    <div
      ref={stageRef}
      className="card-back-body polaroid-gallery-container pure-bento-postcard"
      style={{
        position: 'absolute',
        top: isMobile ? '38px' : '44px',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: isMobile ? 'calc(100% - 38px)' : 'calc(100% - 44px)',
        padding: isMobile ? '8px 10px 10px 10px' : '10px 16px 14px 16px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: `${rowGap}px`,
        pointerEvents: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {rows.map((rowItems, rIdx) => {
        // Compute row aspect ratio sum: S = sum(r_i)
        const S = rowItems.reduce((acc, { index }) => acc + (ratios[index] || 1), 0);
        const gapTotal = Math.max(0, (rowItems.length - 1) * itemGap);

        // Compute optimal row height H = min(rowMaxH, (availableWidth - gapTotal) / S)
        let targetRowH = null;
        if (stageSize.width > 0 && stageSize.height > 0) {
          const availableH = stageSize.height - (numRows - 1) * rowGap;
          const rowMaxH = availableH / numRows;
          const availableW = Math.max(40, stageSize.width - gapTotal);
          const widthConstrainedH = availableW / Math.max(0.1, S);
          targetRowH = Math.max(20, Math.min(rowMaxH, widthConstrainedH));
        }

        return (
          <div
            key={rIdx}
            className="proportional-gallery-row"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: `${itemGap}px`,
              width: '100%',
              height: targetRowH ? `${Math.floor(targetRowH)}px` : (numRows === 1 ? '100%' : '50%'),
              maxHeight: '100%',
              minHeight: 0,
              flexShrink: 1,
              boxSizing: 'border-box',
              pointerEvents: 'auto'
            }}
          >
            {rowItems.map(({ item, index }) => {
              const isVideo = item.type === 'video' || (item.src && (item.src.endsWith('.mp4') || item.src.endsWith('.mov')));
              const ratio = ratios[index] || 1;
              const imgSrc = item.src || project.thumbnail || '/frames/web00.webp?v=20261104';

              return (
                <div
                  key={index}
                  className="proportional-media-wrapper scattered-polaroid-frame"
                  style={{
                    height: '100%',
                    aspectRatio: `${ratio}`,
                    maxHeight: '100%',
                    maxWidth: '100%',
                    width: 'auto',
                    border: '2.5px solid var(--blue)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    background: 'transparent',
                    flexShrink: 0,
                    minWidth: 0,
                    minHeight: 0,
                    cursor: !isVideo ? 'pointer' : 'default',
                    position: 'relative',
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
                      aspectRatio={ratio}
                      onAspectRatioDetected={(detected) => {
                        if (detected && detected > 0) {
                          setRatios((prev) => (prev[index] !== detected ? { ...prev, [index]: detected } : prev));
                        }
                      }}
                    />
                  ) : (
                    <img
                      src={imgSrc}
                      alt={item.title || ''}
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
