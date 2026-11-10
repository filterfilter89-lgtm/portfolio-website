import React, { useRef, useState, useEffect, memo } from 'react';

/**
 * InCardVideoPlayer
 * Pure, clean video player inside the flipped postcard without text headers or footers.
 * Preserves the exact original aspect ratio of the video (9:16 vertical reels, 16:9, etc.)
 * with zero cropping, distortion, or squashing.
 */
export default memo(function InCardVideoPlayer({
  project = {},
  media = null,
  isExpanded = true,
  aspectRatio = null
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Exact natural aspect ratio
  const naturalAR = aspectRatio || media?.aspectRatio || project.videoAspectRatio || 0.5625; // 9/16 default for reels
  const arStyle = { aspectRatio: `${naturalAR}` };

  const videoSrc = media?.src || project.videoSrc || project.video || '';
  const posterSrc = media?.poster || project.thumbnail || '/frames/web00.webp?v=20261104';

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const tot = videoRef.current.duration || 1;
    setProgress((cur / tot) * 100);
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
    setProgress(pos * 100);
  };

  useEffect(() => {
    setHasError(false);
    if (videoRef.current) {
      if (isExpanded) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [videoSrc, isExpanded]);

  return (
    <div
      className="in-card-video-container"
      style={{
        ...arStyle,
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        margin: 'auto'
      }}
    >
      {/* Video Screen Framed Cleanly Inside Postcard (No text headers or footers) */}
      <div
        className="in-card-video-stage"
        onClick={togglePlay}
        style={{
          ...arStyle,
          maxWidth: '100%',
          maxHeight: '100%',
          width: '100%',
          height: '100%'
        }}
      >
        {!hasError && videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onError={() => setHasError(true)}
            className="in-card-video-element"
            style={{
              ...arStyle,
              maxWidth: '100%',
              maxHeight: '100%',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        ) : (
          <div className="in-card-video-fallback" style={arStyle}>
            <img src={posterSrc} alt={project.title} className="in-card-fallback-img" style={arStyle} />
            <div className="in-card-fallback-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{project.title}</span>
            </div>
          </div>
        )}

        {/* Floating Custom Video Controls */}
        <div className="in-card-video-controls" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="in-card-ctrl-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <div
            className="in-card-timeline"
            onClick={handleSeek}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
          >
            <div className="in-card-timeline-fill" style={{ width: `${progress}%` }} />
          </div>

          <button
            type="button"
            className="in-card-ctrl-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
