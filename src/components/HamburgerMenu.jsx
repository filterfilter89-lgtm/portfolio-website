import React, { useState, useEffect, useCallback } from 'react';

/**
 * Mobile Hamburger Menu Component
 * - Fixed in the top-right corner of the mobile interface
 * - Perfectly positioned and aligned with existing navigation elements
 * - Maintains 100% visual consistency with typography (Space Mono, DM Sans), colors (--blue, --cream), and design language
 */
export default function HamburgerMenu({ currentView = 'reel', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

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

  // Prevent background scrolling when menu is open
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

  // Determine button color based on current view theme
  const isDarkDesk = currentView === 'showcase';

  return (
    <>
      {/* Top-Right Hamburger Toggle Button */}
      <button
        type="button"
        className={`mobile-hamburger-btn ${isDarkDesk ? 'is-dark-desk' : ''} ${isOpen ? 'is-active' : ''}`}
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

      {/* Backdrop overlay */}
      <div
        className={`mobile-menu-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Navigation Drawer */}
      <nav
        className={`mobile-menu-drawer ${isOpen ? 'is-open' : ''}`}
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu-inner">
          {/* Drawer Header */}
          <div className="mobile-menu-header">
            <span className="mobile-menu-brand">BASIL JOSE</span>
            <span className="mobile-menu-tag">DIRECTORY</span>
          </div>

          {/* Navigation Links */}
          <ul className="mobile-menu-links">
            <li className="mobile-menu-item">
              <button
                type="button"
                className={`mobile-menu-link ${currentView === 'reel' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('reel')}
              >
                <span className="menu-num">01</span>
                <span className="menu-title">REEL</span>
                <span className="menu-sub">Visual Introduction</span>
              </button>
            </li>

            <li className="mobile-menu-item">
              <button
                type="button"
                className={`mobile-menu-link ${currentView === 'wheel' || currentView === 'showcase' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('work')}
              >
                <span className="menu-num">02</span>
                <span className="menu-title">WORK</span>
                <span className="menu-sub">Albums &amp; Postcards</span>
              </button>
            </li>

            <li className="mobile-menu-item">
              <button
                type="button"
                className={`mobile-menu-link ${currentView === 'contact' ? 'is-current' : ''}`}
                onClick={() => handleLinkClick('contact')}
              >
                <span className="menu-num">03</span>
                <span className="menu-title">CONTACT</span>
                <span className="menu-sub">Inquiries &amp; Projects</span>
              </button>
            </li>

            <li className="mobile-menu-item">
              <a
                href="/basil jose final cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-menu-link"
                onClick={() => setIsOpen(false)}
              >
                <span className="menu-num">04</span>
                <span className="menu-title">RESUME / CV</span>
                <span className="menu-sub">Download PDF &#8599;</span>
              </a>
            </li>
          </ul>

          {/* Drawer Footer */}
          <div className="mobile-menu-footer">
            <div className="mobile-menu-contact-info">
              <span className="menu-footer-label">GET IN TOUCH</span>
              <a href="mailto:basiljose8989@gmail.com" className="menu-footer-email">
                basiljose8989@gmail.com
              </a>
              <span className="menu-footer-geo">Kochi, Kerala &#8226; Open to Global Remote</span>
            </div>
            <div className="mobile-menu-copyright">
              <span>&#169; 2026 Basil Jose</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

