import React, { useState, useEffect } from 'react';
import { getIsMuted, toggleMute, subscribeSoundState } from '../utils/soundEffects';

export default function SoundToggle() {
  const [muted, setMuted] = useState(getIsMuted);

  useEffect(() => {
    return subscribeSoundState((newMuted) => setMuted(newMuted));
  }, []);

  return (
    <button
      type="button"
      className="sound-toggle-btn"
      onClick={() => toggleMute()}
      title={muted ? 'Enable sound effects' : 'Mute sound effects'}
      aria-label={muted ? 'Enable sound effects' : 'Mute sound effects'}
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
      <span className="sound-toggle-label">{muted ? 'MUTED' : 'AUDIO'}</span>
    </button>
  );
}
