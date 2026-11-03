import { useEffect, useRef, useState, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './TiltedCard.css';

const cardSpringValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

const discSpringValues = {
  damping: 24,
  stiffness: 90,
  mass: 1.2
};

function TiltedCardComponent({
  coverIcon,
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '340px',
  containerWidth = '340px',
  imageHeight = '340px',
  imageWidth = '340px',
  scaleOnHover = 1.12,
  rotateAmplitude = 14,
  scrollProgress = 0,
  discSlideDistance = 215,
  showVinyl = false,
  showMobileWarning = false,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false,
  isDescending = false
}) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, cardSpringValues);
  const rotateY = useSpring(rawRotateY, cardSpringValues);
  const scale = useSpring(1, cardSpringValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  // Upward Vinyl Disc motion values (Pops UP out of sleeve)
  const discY = useSpring(0, discSpringValues);
  const discX = useSpring(0, discSpringValues);
  const discRotate = useSpring(0, discSpringValues);
  const discScale = useSpring(0.96, discSpringValues);

  const [lastY, setLastY] = useState(0);

  // Neutralize hover scaling and tilt when descending starts
  useEffect(() => {
    if (isDescending) {
      setIsHovered(false);
      rawRotateX.set(0);
      rawRotateY.set(0);
      scale.set(1);
      opacity.set(0);
      rotateFigcaption.set(0);
    }
  }, [isDescending, rawRotateX, rawRotateY, scale, opacity, rotateFigcaption]);

  // Combine scroll progress and hover state
  const effectiveProgress = isDescending ? 0 : Math.max(scrollProgress, isHovered ? 1 : 0);

  // Update upward trajectory whenever effective progress changes (only if vinyl is enabled)
  useEffect(() => {
    if (!showVinyl) return;
    const liftDistance = typeof discSlideDistance === 'number' ? discSlideDistance : 190;
    const yVal = -effectiveProgress * liftDistance;
    const xVal = 0;
    const rotVal = -effectiveProgress * 24;
    const scaleVal = 0.96 + effectiveProgress * 0.04;

    discY.set(yVal);
    discX.set(xVal);
    discRotate.set(rotVal);
    discScale.set(scaleVal);
  }, [showVinyl, effectiveProgress, discSlideDistance]);

  function handleMouse(e) {
    if (!ref.current || isDescending) return;

    const rect = rectRef.current || (rectRef.current = ref.current.getBoundingClientRect());
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rawRotateX.set(rotationX);
    rawRotateY.set(rotationY);

    if (showTooltip) {
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
      const velocityY = offsetY - lastY;
      rotateFigcaption.set(-velocityY * 0.6);
      setLastY(offsetY);
    }
  }

  function handleMouseEnter() {
    if (isDescending) return;
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    setIsHovered(true);
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    rectRef.current = null;
    setIsHovered(false);
    opacity.set(0);
    scale.set(1);
    rawRotateX.set(0);
    rawRotateY.set(0);
    if (showTooltip) rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">This effect is not optimized for mobile. Check on desktop.</div>
      )}

      <motion.div
        className="tilted-card-inner"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        {/* Layer 1: Back Sleeve Jacket (only if vinyl is enabled) */}
        {showVinyl && <div className="tilted-card-back" />}

        {/* Layer 2: 3D Vinyl Disc that pops out along the top (only if vinyl is enabled) */}
        {showVinyl && (
          <motion.div
            className="tilted-vinyl-disc"
            style={{
              x: discX,
              y: discY,
              z: -2,
              rotate: discRotate,
              scale: discScale
            }}
            aria-hidden="true"
          >
            <div className="vinyl-sheen"></div>
            <div className="vinyl-center-label">
              <img src={imageSrc} alt="" className="vinyl-label-art" />
              <div className="vinyl-label-ring"></div>
              <div className="vinyl-spindle-hole"></div>
            </div>
          </motion.div>
        )}

        {/* Layer 3: Front Album Jacket Sleeve (Official Icon Artwork or Typographic Design) */}
        <motion.div
          className={`tilted-card-front-wrap typographic-album-jacket ${coverIcon || imageSrc ? 'has-icon' : ''}`}
          style={{
            width: imageWidth,
            height: imageHeight,
            z: 8
          }}
        >
          {coverIcon || imageSrc ? (
            <img
              src={coverIcon || imageSrc}
              alt={captionText || altText}
              className="jacket-cover-icon"
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const s = e.currentTarget.src;
                if (s.includes('GRAPHIC%20DESIGNS') || s.includes('GRAPHIC DESIGNS')) {
                  e.currentTarget.src = '/icons/GRAPHIC DESIGN.png';
                } else if (s.includes('GRAPHIC%20DESIGN') || s.includes('GRAPHIC DESIGN')) {
                  e.currentTarget.src = '/icons/GRAPHIC DESIGNS.png';
                }
              }}
            />
          ) : (
            <div className="jacket-border-frame">
              <div className="jacket-header">
                <span className="jacket-brand">BASIL JOSE</span>
                <span className="jacket-badge">12" LP // 33 RPM</span>
              </div>
              <div className="jacket-center">
                <div className="jacket-archive-tag">ARCHIVE RECORDINGS</div>
                <h2 className="jacket-title">{captionText || altText}</h2>
                <div className="jacket-divider" />
                <div className="jacket-vol">VOL. 01 • PORTFOLIO</div>
              </div>
              <div className="jacket-footer">
                <span className="jacket-tracks">09 WORKS</span>
                <span className="jacket-cat-num">BJ-{String(captionText || 'CAT').substring(0, 3).toUpperCase()}-26</span>
              </div>
            </div>
          )}
        </motion.div>

        {displayOverlayContent && overlayContent && (
          <motion.div className="tilted-card-overlay">{overlayContent}</motion.div>
        )}
      </motion.div>

      {captionText && (
        <div className="tilted-card-title">{captionText}</div>
      )}

      {showTooltip && captionText && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}

export default memo(TiltedCardComponent);
