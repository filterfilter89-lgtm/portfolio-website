import React, { useState, memo } from 'react';
import InCardVideoPlayer from './InCardVideoPlayer';

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
      {/* Centered Gallery - 100% Exact Native Aspect Ratio, Zero Cropping, No Colliding */}
      <div className={`exact-aspect-gallery-stage is-count-${count}`}>
        {photoList.map((item, idx) => {
          const isVideo = item.type === 'video' || (item.src && item.src.endsWith('.mp4'));
          const imgSrc = item.src || project.thumbnail || '/frames/web00.webp?v=20261104';

          return (
            <div
              key={idx}
              className="exact-aspect-polaroid-item"
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
              {/* Proper Polaroid Frame conforming to exact media aspect ratio */}
              <div className="exact-aspect-polaroid-frame">
                <div className="exact-aspect-photo-well">
                  {isVideo ? (
                    <div className="exact-aspect-video-wrapper">
                      <InCardVideoPlayer project={project} media={item} isExpanded={isExpanded} />
                    </div>
                  ) : (
                    <img
                      src={imgSrc}
                      alt=""
                      className="exact-aspect-img"
                      loading="lazy"
                      draggable="false"
                    />
                  )}
                </div>
                <div className="exact-aspect-chin" />
              </div>
            </div>
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