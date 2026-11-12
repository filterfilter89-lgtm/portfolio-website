import React, { useState, useEffect } from 'react';
import { getIsMuted, toggleMute, subscribeSoundState } from '../utils/soundEffects';

/**
 * 44px Circular Sound Toggle Button
 * - Pinned to bottom-left corner: bottom: 24px, left: 28px, z-index: 1000
 * - Matches top-right morphing hamburger pill aesthetics (cream glassmorphism / dark desk variant)
 * - Toggles audio across site via soundEffects engine
 */
export default function SoundToggle({ currentView = 'reel', isDark = false }) {
  const [isMuted, setIsMuted] = useState(() => getIsMuted());

  useEffect(() => {
    return subscribeSoundState((muted) => {
      setIsMuted(muted);
    });
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleMute();
  };

  const isDarkDesk = isDark || currentView === 'showcase';

  return (
    <button
      type="button"
      className={`sound-toggle-btn ${isDarkDesk ? 'is-dark-desk' : ''}`}
      onClick={handleClick}
      aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
    >
      {isMuted ? (
        // Muted speaker icon
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Active sound waves speaker icon
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
