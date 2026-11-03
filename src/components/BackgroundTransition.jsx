import { memo } from 'react';

/**
 * BackgroundTransition
 * 
 * Persistent background layer at z-index: 0.
 * Purely holds the background color (#fff7ed for carousel, #336196 for showcase)
 * without any smooth vector animations, allowing DitherTransition to drive the visual transition.
 */
export default memo(function BackgroundTransition({
  color = '#fff7ed'
}) {
  return (
    <div
      className="portfolio-bg-layer"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: color,
        transition: 'none'
      }}
    />
  );
});
