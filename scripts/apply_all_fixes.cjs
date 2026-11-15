const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// 1. UPDATE AlbumCarousel.jsx
{
  const filePath = path.join(root, 'src', 'components', 'AlbumCarousel.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace front and back side styling in AlbumCarousel
  const frontRegex = /(className="postcard-side postcard-side-front"[\s\S]*?style=\{\{[\s\S]*?\}\})/;
  const backRegex = /(className="postcard-side postcard-side-back"[\s\S]*?style=\{\{[\s\S]*?\}\})/;

  const newFrontStyle = `className="postcard-side postcard-side-front"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            zIndex: isExpanded ? 1 : 2,
            visibility: isExpanded ? 'hidden' : 'visible',
            pointerEvents: isExpanded ? 'none' : 'auto',
            borderRadius: isExpanded ? '6px' : '4px',
            overflow: 'hidden'
          }}`;

  const newBackStyle = `className="postcard-side postcard-side-back"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: isExpanded ? 'rotateY(180deg) translateZ(1px)' : 'rotateY(180deg)',
            zIndex: isExpanded ? 5 : 1,
            visibility: isExpanded ? 'visible' : 'hidden',
            opacity: 1,
            background: '#fff7ed',
            borderRadius: isExpanded ? '6px' : '4px',
            overflow: 'hidden',
            pointerEvents: isExpanded ? 'auto' : 'none'
          }}`;

  if (frontRegex.test(content) && backRegex.test(content)) {
    content = content.replace(frontRegex, newFrontStyle);
    content = content.replace(backRegex, newBackStyle);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated AlbumCarousel.jsx');
  } else {
    console.warn('Could not match front/back regex in AlbumCarousel.jsx');
  }
}

// 2. UPDATE DitherTransition.jsx
{
  const filePath = path.join(root, 'src', 'components', 'DitherTransition.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Change duration default to 420
  content = content.replace(/duration\s*=\s*\d+/, 'duration = 420');

  // Change dpr to 1
  content = content.replace(
    /const dpr = Math\.min\(window\.devicePixelRatio \|\| 1, 2\);/,
    'const dpr = 1;'
  );

  // In useEffect cleanup, make sure canvas pointer-events: none
  content = content.replace(
    /return \(\) => \{\s*cancelAnimationFrame\(animationFrameId\);\s*\};/,
    `return () => {
      cancelAnimationFrame(animationFrameId);
      if (canvas) {
        canvas.style.pointerEvents = 'none';
      }
    };`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated DitherTransition.jsx');
}

// 3. UPDATE App.jsx
{
  const filePath = path.join(root, 'src', 'App.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove SoundToggle import
  content = content.replace(/import SoundToggle from '\.\/components\/SoundToggle';\r?\n?/, '');

  // Remove SoundToggle rendering
  content = content.replace(
    /\{\/\* Bottom-Left Sound Toggle Button \*\/\}[\s\S]*?<SoundToggle[^>]*\/>\r?\n?/,
    ''
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated App.jsx');
}

// 4. UPDATE styles.css
{
  const filePath = path.join(root, 'styles.css');
  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure sound toggle is hidden
  const soundToggleHider = `
/* Hide Sound Toggle Across all views */
.sound-toggle,
.sound-toggle-btn {
  display: none !important;
  pointer-events: none !important;
  visibility: hidden !important;
}
`;

  // Append comprehensive overrides at end of styles.css to ensure ultimate specificity
  const uiOverridesV2 = `
${soundToggleHider}

/* =========================================================================
   UI REFINEMENT PASS V2: BORDERLESS NAV, CRISP MEDIA STROKE & DYNAMIC COLORS
   ========================================================================= */

/* 1. Transparent, Borderless Back Navigation Button */
.clean-back-btn {
  position: fixed !important;
  top: max(18px, env(safe-area-inset-top, 18px)) !important;
  left: max(18px, env(safe-area-inset-left, 18px)) !important;
  z-index: 1000 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 44px !important;
  height: 44px !important;
  border-radius: 0 !important;
  background: transparent !important;
  border: none !important;
  color: var(--blue, #285991) !important;
  padding: 0 !important;
  cursor: pointer !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  outline: none !important;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s ease, stroke 0.3s ease, fill 0.3s ease, opacity 0.2s ease !important;
  user-select: none !important;
  -webkit-user-select: none !important;
  touch-action: manipulation !important;
}

.clean-back-btn:hover {
  transform: scale(1.08) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  opacity: 0.82 !important;
}

.clean-back-btn:active {
  transform: scale(0.92) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.clean-back-btn.is-showcase,
.page-work.is-showcase-active .clean-back-btn {
  color: var(--cream, #fff7ed) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.clean-back-btn.is-showcase:hover,
.page-work.is-showcase-active .clean-back-btn:hover {
  color: #ffffff !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  opacity: 0.88 !important;
}

.clean-back-btn .back-arrow-svg {
  width: 22px !important;
  height: 22px !important;
  display: block !important;
  stroke: currentColor !important;
  transition: transform 0.2s ease, stroke 0.3s ease !important;
}

.clean-back-btn:hover .back-arrow-svg {
  transform: translateX(-3px) !important;
}

.clean-back-btn .back-label,
.clean-back-btn .back-key-hint {
  display: none !important;
}

/* 2. Transparent, Borderless Hamburger Resting State & Zero Backdrop Blur */
.nav-morph-backdrop {
  position: fixed !important;
  inset: 0 !important;
  z-index: 990 !important;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity 0.2s ease !important;
}

.nav-morph-backdrop.is-open {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* Resting hamburger: clean, floating, ringless icon */
.nav-morph-pill:not(.is-open) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.nav-morph-pill:not(.is-open):hover {
  transform: scale(1.08) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  opacity: 0.82 !important;
}

.nav-morph-pill:not(.is-open):active {
  transform: scale(0.92) !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* Dynamic color transitions for hamburger menu */
.nav-morph-pill {
  color: var(--blue, #285991);
  transition: 
    width 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    color 0.3s ease,
    stroke 0.3s ease,
    fill 0.3s ease,
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

.nav-morph-pill .hamburger-bar {
  background-color: currentColor !important;
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease, background-color 0.3s ease !important;
}

/* Blue desk: Hamburger icon turns Cream */
.nav-morph-pill.is-dark-desk,
.page-work.is-showcase-active .nav-morph-pill {
  color: var(--cream, #fff7ed) !important;
}

.nav-morph-pill.is-dark-desk:not(.is-open):hover,
.page-work.is-showcase-active .nav-morph-pill:not(.is-open):hover {
  color: #ffffff !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* Expanded pill retains clean styling for menu links */
.nav-morph-pill.is-open {
  background: rgba(255, 247, 237, 0.98) !important;
  border: 1px solid rgba(40, 89, 145, 0.35) !important;
  box-shadow: 
    0 12px 32px -4px rgba(10, 25, 55, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.06) !important;
  color: var(--blue, #285991) !important;
}

.nav-morph-pill.is-dark-desk.is-open,
.page-work.is-showcase-active .nav-morph-pill.is-open {
  background: rgba(26, 44, 72, 0.96) !important;
  border: 1px solid rgba(255, 247, 237, 0.25) !important;
  box-shadow: 
    0 12px 32px -4px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3) !important;
  color: var(--cream, #fff7ed) !important;
}

/* 3. Curved Corners (14px) + Website Blue Stroke (2.5px solid var(--blue)) for all Media */
.scattered-polaroid-frame {
  box-sizing: border-box !important;
  background: transparent !important;
  border-radius: 14px !important;
  border: 2.5px solid var(--blue, #285991) !important;
  box-shadow: 
    0 10px 24px rgba(0, 15, 40, 0.22),
    0 2px 6px rgba(0, 0, 0, 0.12) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  max-width: 100% !important;
  max-height: 100% !important;
  width: auto !important;
  height: auto !important;
  overflow: hidden !important;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

.scattered-polaroid-item:hover .scattered-polaroid-frame {
  box-shadow: 
    0 18px 38px rgba(0, 15, 40, 0.32),
    0 4px 10px rgba(0, 0, 0, 0.18) !important;
}

.scattered-polaroid-frame.is-portrait {
  height: 100% !important;
  max-height: 100% !important;
  width: auto !important;
  aspect-ratio: var(--polaroid-ar, 9 / 16) !important;
}

.scattered-polaroid-frame.is-landscape {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  aspect-ratio: var(--polaroid-ar, 16 / 9) !important;
}

.scattered-photo-well {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: inherit !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.scattered-polaroid-frame img,
.scattered-polaroid-frame video,
.scattered-img,
.in-card-video-element,
.exact-aspect-video-wrapper,
.in-card-video-stage,
.in-card-video-container {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  border-radius: inherit !important;
  overflow: hidden !important;
}

.scattered-polaroid-frame .in-card-video-container,
.scattered-polaroid-frame .in-card-video-stage {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.scattered-chin {
  display: none !important;
}

/* 4. Mobile Flip Media Visibility & Dimensions */
@media (max-width: 768px) {
  .postcard-side-back {
    min-height: 260px !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .polaroid-gallery-container,
  .polaroid-scatter-stage {
    min-height: 260px !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
}
`;

  content += uiOverridesV2;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated styles.css');
}
