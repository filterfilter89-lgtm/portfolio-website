import { useState, useEffect, useCallback, useRef } from 'react';
import VisualReel from './components/VisualReel';
import AlbumCarousel from './components/AlbumCarousel';
import BackgroundTransition from './components/BackgroundTransition';
import DitherTransition from './components/DitherTransition';
import SoundToggle from './components/SoundToggle';
import { getCategoryById, getProjectById } from './data/categories';
import '../styles.css';

export default function App({ initialView }) {
  // Determine starting view and category/project based on URL hash or prop
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#work/')) return 'wheel';
      if (hash === '#work') return 'wheel';
    }
    if (initialView) return initialView;
    return 'reel';
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#work/')) {
        const parts = hash.replace(/^#work\/?/, '').split('/');
        return parts[0] || 'advertisement';
      }
    }
    return null;
  });

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const parts = hash.replace(/^#work\/?/, '').split('/');
      if (hash.startsWith('#work/') && parts.length >= 2 && parts[1]) {
        return parts[1];
      }
    }
    return null;
  });

  const [isWheelEntering, setIsWheelEntering] = useState(false);
  const [isReturning, setIsReturning] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#reel') {
      return true;
    }
    return false;
  });

  // Track the scroll position when entering wheel to restore it exactly when returning
  const savedScrollYRef = useRef(0);

  // Round-pixel dither transition state & orchestration
  const [isDithering, setIsDithering] = useState(false);
  const [bgColor, setBgColor] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#work/')) return '#336196';
    }
    return '#fff7ed';
  });
  const [ditherDirection, setDitherDirection] = useState('forward');
  const [ditherColor, setDitherColor] = useState('#fff7ed');
  const [ditherOrigin, setDitherOrigin] = useState(null);
  const [ditherZIndex, setDitherZIndex] = useState(1000);
  const [ditherSourceShape, setDitherSourceShape] = useState('uniform');
  const [ditherInnerRadius, setDitherInnerRadius] = useState(0);
  const [ditherBoxHalfSize, setDitherBoxHalfSize] = useState(0);
  const [isWheelExiting, setIsWheelExiting] = useState(false);
  const ditherTargetRef = useRef(null);
  const handleGoBackRef = useRef(null);

  const [isCategoryActive, setIsCategoryActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.startsWith('#work/');
    }
    return false;
  });

  // Sync body class & title with current view
  useEffect(() => {
    const isShowcaseMode = view === 'showcase' || isCategoryActive || Boolean(selectedCategoryId);
    if (isShowcaseMode) {
      document.body.classList.remove('page-reel');
      document.body.classList.add('page-work', 'is-showcase-active');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      const cat = getCategoryById(selectedCategoryId);
      const proj = getProjectById(selectedCategoryId, selectedProjectId);
      document.title = proj ? `${proj.title} | ${cat?.title || ''}` : `Work | Basil Jose`;
    } else if (view === 'wheel') {
      document.body.classList.remove('page-reel', 'is-showcase-active');
      document.body.classList.add('page-work');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.title = 'On Record | Basil Jose';
    } else {
      document.body.classList.remove('page-work', 'is-showcase-active');
      document.body.classList.add('page-reel');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.title = 'Basil Jose | Visual Reel';
    }
  }, [view, selectedCategoryId, selectedProjectId, isCategoryActive]);

  // Support browser back/forward buttons
  useEffect(() => {
    function handleHashChange() {
      if (isDithering) return;
      const hash = window.location.hash;
      if (hash.startsWith('#work/')) {
        const parts = hash.replace(/^#work\/?/, '').split('/');
        const catId = parts[0] || 'advertisement';
        const projId = parts[1] || null;
        setSelectedCategoryId(catId);
        setIsCategoryActive(true);
        setBgColor('#336196');
        if (projId) {
          setSelectedProjectId(projId);
          setView('showcase');
        } else {
          setSelectedProjectId(null);
          setView('showcase');
        }
      } else if (hash === '#work') {
        setSelectedCategoryId(null);
        setSelectedProjectId(null);
        setIsCategoryActive(false);
        setBgColor('#fff7ed');
        if (view !== 'wheel') {
          setView('wheel');
          setIsWheelEntering(true);
        }
      } else if (hash === '#reel' || hash === '' || hash === '#') {
        setSelectedCategoryId(null);
        setSelectedProjectId(null);
        setIsCategoryActive(false);
        setBgColor('#fff7ed');
        if (view === 'wheel' && handleGoBackRef.current) {
          handleGoBackRef.current();
        } else if (view !== 'reel') {
          setView('reel');
          setIsReturning(true);
        }
      }
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [view, isDithering]);

  // Forward: Play button clicked on blue frame 48 -> Dither wipes to beige first!
  const handlePlay = useCallback((origin) => {
    if (typeof window !== 'undefined') {
      savedScrollYRef.current = window.scrollY;
    }
    const playBtn = document.getElementById('reel-play-btn') || document.querySelector('.canvas-play-hitbox');
    let originCoord = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let btnRadius = 80;
    if (playBtn) {
      const rect = playBtn.getBoundingClientRect();
      originCoord = {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2)
      };
      btnRadius = Math.round(rect.width / 2);
    } else if (origin && typeof origin.x === 'number') {
      originCoord = origin;
    }
    setDitherOrigin(originCoord);
    setDitherSourceShape('circle');
    setDitherInnerRadius(0);
    setDitherBoxHalfSize(0);
    ditherTargetRef.current = 'wheel';
    setDitherColor('#fff7ed');
    setDitherDirection('forward');
    setDitherZIndex(1000);
    setIsWheelEntering(false);
    setIsDithering(true);
  }, []);

  // When halftone dither transition animation completes
  const handleDitherComplete = useCallback(() => {
    const target = ditherTargetRef.current;
    if (ditherDirection === 'forward') {
      if (target === 'wheel') {
        // Beige is revealed! Mount wheel and slide albums in from the sides
        setBgColor('#fff7ed');
        setView('wheel');
        window.history.pushState(null, '', '#work');
        setIsWheelEntering(true);
        setTimeout(() => {
          setIsWheelEntering(false);
        }, 700);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsDithering(false);
            ditherTargetRef.current = null;
          });
        });
      } else if (target === 'category' || target === 'showcase') {
        // Seamless handoff: lock background color to blue, and let canvas unmount after paint
        setBgColor('#336196');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsDithering(false);
            ditherTargetRef.current = null;
          });
        });
      } else if (target === 'carousel_return') {
        // Seamless handoff: lock background color to beige, and let canvas unmount after paint
        setBgColor('#fff7ed');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsDithering(false);
            ditherTargetRef.current = null;
          });
        });
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsDithering(false);
            ditherTargetRef.current = null;
          });
        });
      }
    } else {
      // True reverse: beige dither dots contracted into play button
      if (target === 'reel_reverse' || target === 'reel') {
        setBgColor('#fff7ed');
        setView('reel');
        setIsWheelExiting(false);
        setIsReturning(true);
        setTimeout(() => setIsReturning(false), 800);
        if (window.location.hash !== '#reel' && window.location.hash !== '') {
          window.history.replaceState(null, '', '#reel');
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsDithering(false);
            ditherTargetRef.current = null;
          });
        });
      } else {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsDithering(false);
            ditherTargetRef.current = null;
          });
        });
      }
    }
  }, [ditherDirection]);

  // Exact True Reverse: Albums slide out to sides first, then beige dither blanket contracts inward into the play button!
  const handleGoBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('work.html')) {
      window.location.href = 'index.html#reel';
      return;
    }

    // Step 1: Slide albums out to sides
    setIsWheelExiting(true);

    // Position reel underneath at frame 48
    if (typeof window !== 'undefined') {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = savedScrollYRef.current > 0 ? savedScrollYRef.current : maxScroll;
      if (targetScroll > 0) {
        window.scrollTo({ top: targetScroll, behavior: 'instant' });
      }
    }
    setIsReturning(true);

    let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let btnRadius = 80;
    const playBtn = document.getElementById('reel-play-btn') || document.querySelector('.canvas-play-hitbox');
    if (playBtn) {
      const rect = playBtn.getBoundingClientRect();
      origin = {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2)
      };
      btnRadius = Math.round(rect.width / 2);
    }
    setDitherOrigin(origin);
    setDitherSourceShape('circle');
    setDitherInnerRadius(0);
    setDitherBoxHalfSize(0);

    // Step 2: After albums slide out (320ms), reverse dither contracts back to play button edge
    setTimeout(() => {
      ditherTargetRef.current = 'reel_reverse';
      setDitherColor('#fff7ed');
      setDitherDirection('reverse');
      setDitherZIndex(1000);
      setIsDithering(true);
    }, 320);

    if (typeof window !== 'undefined' && window.location.hash !== '#reel' && window.location.hash !== '') {
      window.history.pushState(null, '', '#reel');
    }
  }, []);

  handleGoBackRef.current = handleGoBack;

  // Behind-the-album dither trigger (z-index: 10 strictly behind centered album at 25)
  const handleTriggerDither = useCallback((params) => {
    let originCoord = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let targetColor = '#336196';
    let shape = 'uniform';
    let boxSize = 0;
    let rad = 0;
    let z = 10;

    if (params && typeof params === 'object') {
      if (params.origin) originCoord = params.origin;
      if (params.color) targetColor = params.color;
      if (params.sourceShape) shape = params.sourceShape;
      if (typeof params.boxHalfSize === 'number') boxSize = params.boxHalfSize;
      if (typeof params.innerRadius === 'number') rad = params.innerRadius;
      if (typeof params.zIndex === 'number') z = params.zIndex;
    }

    setDitherOrigin(originCoord);
    setDitherColor(targetColor);
    setDitherDirection('forward');
    setDitherSourceShape(shape);
    setDitherBoxHalfSize(boxSize);
    setDitherInnerRadius(rad);
    setDitherZIndex(z);
    const isShowcase = targetColor === '#336196' || targetColor?.toLowerCase() === 'blue';
    ditherTargetRef.current = isShowcase ? 'showcase' : 'carousel_return';
    setIsDithering(true);
  }, []);

  // Category changed: keep bgColor as #fff7ed while dithering behind the album!
  const handleCategoryChange = useCallback((catId) => {
    setIsCategoryActive(Boolean(catId));
    if (catId) {
      setSelectedCategoryId(catId);
    } else {
      setSelectedCategoryId(null);
    }
  }, []);

  return (
    <>
      <SoundToggle />
      {/* Background layer: alone changes color from #fff7ed to #336196 behind all elements */}
      <BackgroundTransition color={bgColor} />

      {/* Keep VisualReel persistently mounted in DOM */}
      <div
        className="reel-stage-container"
        style={{
          visibility: view === 'reel' || ditherTargetRef.current === 'reel' || ditherTargetRef.current === 'reel_reverse' ? 'visible' : 'hidden',
          pointerEvents: view === 'reel' ? 'auto' : 'none',
          zIndex: view === 'reel' ? 20 : (ditherTargetRef.current === 'reel' ? 5 : 0)
        }}
      >
        <VisualReel
          onPlay={handlePlay}
          isReturning={isReturning}
          isActive={view === 'reel'}
        />
      </div>

      {/* Unified Continuous Album Carousel & Postcards Stage */}
      {(view === 'wheel' || view === 'showcase') && (
        <AlbumCarousel
          activeCategoryId={selectedCategoryId}
          initialProjectId={selectedProjectId}
          onBack={handleGoBack}
          onDitherTrigger={handleTriggerDither}
          onCategoryChange={handleCategoryChange}
          isEntering={isWheelEntering}
          isExiting={isWheelExiting}
        />
      )}

      {/* Signature 16px Round-Pixel Radial Dither Canvas (Dynamic Stacking: 10 when behind album, 1000 when between pages) */}
      <DitherTransition
        isActive={isDithering}
        origin={ditherOrigin}
        cellSize={18}
        direction={ditherDirection}
        color={ditherColor}
        sourceShape={ditherSourceShape}
        innerRadius={ditherInnerRadius}
        boxHalfSize={ditherBoxHalfSize}
        zIndex={ditherZIndex}
        onComplete={handleDitherComplete}
      />
    </>
  );
}
