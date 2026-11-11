import React, { useState, useEffect, useRef } from 'react';

/**
 * Morphing Hamburger Navigation Component
 * - Resting State: 44px x 44px circular button pinned to the top-right.
 * - Active State: Smoothly expands and morphs into a horizontal rectangle with curved corners.
 *   The corner radius (22px) matches the original circle's curvature seamlessly.
 * - Displays ONLY four text items: REEL, WORK, CONTACT, RESUME.
 * - Zero subtitles, descriptions, labels, or additional text.
 */
export default function HamburgerMenu({ currentView = 'reel', isDark = false, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent background scrolling when menu is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLinkClick = (target) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(target);
    }
  };

  const isDarkDesk = isDark || currentView === 'showcase';

  return (
    <>
      {/* Semi-transparent backdrop when menu is open */}
      <div
        className={`nav-morph-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Morphing Navigation Container */}
      {/* Circle (44px) morphs smoothly into horizontal rectangle with matching curved corners */}
      <div
        ref={containerRef}
        className={`nav-morph-pill mobile-menu-drawer ${isOpen ? 'is-open' : ''} ${isDarkDesk ? 'is-dark-desk' : ''}`}
        role="navigation"
        aria-label="Navigation Menu"
      >
        {/* Navigation links - Revealed smoothly when expanded */}
        <nav className="nav-morph-links" aria-hidden={!isOpen}>
          <button
            type="button"
            className={`nav-morph-link ${currentView === 'reel' ? 'is-current' : ''}`}
            onClick={() => handleLinkClick('reel')}
            tabIndex={isOpen ? 0 : -1}
          >
            REEL
          </button>

          <button
            type="button"
            className={`nav-morph-link ${currentView === 'wheel' || currentView === 'showcase' ? 'is-current' : ''}`}
            onClick={() => handleLinkClick('work')}
            tabIndex={isOpen ? 0 : -1}
          >
            WORK
          </button>

          <button
            type="button"
            className={`nav-morph-link ${currentView === 'contact' ? 'is-current' : ''}`}
            onClick={() => handleLinkClick('contact')}
            tabIndex={isOpen ? 0 : -1}
          >
            CONTACT
          </button>

          <a
            href="/basil jose final cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-morph-link"
            onClick={() => setIsOpen(false)}
            tabIndex={isOpen ? 0 : -1}
          >
            RESUME
          </a>
        </nav>

        {/* Hamburger / Close Icon Toggle Button */}
        <button
          type="button"
          className={`nav-morph-toggle mobile-hamburger-btn ${isDarkDesk ? 'is-dark-desk' : ''} ${isOpen ? 'is-active' : ''}`}
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          <span className="hamburger-icon-wrap" aria-hidden="true">
            <span className="hamburger-bar hamburger-bar--1" />
            <span className="hamburger-bar hamburger-bar--2" />
            <span className="hamburger-bar hamburger-bar--3" />
          </span>
        </button>
      </div>
    </>
  );
}
