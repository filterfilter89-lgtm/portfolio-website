css_path = 'styles.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

start_marker = "/* ============================================================\n   Editorial Postcard Showcase"
end_marker = "/* Central Media Stage (fills viewport smoothly) */"

section_start = css.find(start_marker)
if section_start == -1:
    section_start = css.find(".editorial-showcase-stage")
    section_start = css.rfind("/*", 0, section_start)

section_end = css.find(end_marker)
if section_end == -1:
    section_end = css.find(".showcase-media-stage")

print("Replacing section from", section_start, "to", section_end)

new_styles = """/* ============================================================
   React Scattered Plain Landscape Postcard & Envelope Showcase
   Strictly ONE Vinyl Record in Bottom-Right
   Zero Images on Postcards | Organic Scattered Placement
   ============================================================ */

/* ── Fullscreen Editorial Stage ── */
.editorial-showcase-stage {
  position: fixed;
  inset: 0;
  z-index: 120;
  width: 100vw;
  height: 100vh;
  background-color: var(--blue, #285991);
  background-image: 
    radial-gradient(circle at 45% 20%, rgba(255, 247, 237, 0.08) 0%, transparent 60%),
    radial-gradient(circle at 85% 85%, rgba(0, 0, 0, 0.3) 0%, transparent 50%);
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* ── Top Floating Minimalist Bar ── */
.showcase-editorial-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 140;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 36px;
  background: linear-gradient(180deg, rgba(20, 50, 88, 0.92) 0%, rgba(40, 89, 145, 0) 100%);
  pointer-events: none;
}

.editorial-back-pill {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 9999px;
  background: var(--cream, #FFF7ED);
  color: var(--blue, #285991);
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 16px rgba(0, 15, 40, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1), background 0.2s;
  cursor: pointer;
}

.editorial-back-pill:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 8px 24px rgba(0, 15, 40, 0.4);
  background: #ffffff;
}

.editorial-back-pill .back-arrow {
  font-size: 14px;
  transition: transform 0.2s;
}

.editorial-back-pill:hover .back-arrow {
  transform: translateX(-3px);
}

.editorial-back-pill .back-esc-tag {
  font-size: 9px;
  padding: 2px 5px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--blue, #285991) 14%, transparent);
  color: var(--blue, #285991);
  font-weight: 700;
}

.showcase-category-nav {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: color-mix(in srgb, var(--blue-dark, #16365c) 65%, transparent);
  padding: 4px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 247, 237, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.showcase-cat-pill {
  padding: 6px 14px;
  border-radius: 9999px;
  background: transparent;
  color: rgba(255, 247, 237, 0.78);
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 10px;
  letter-spacing: 0.08em;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.showcase-cat-pill:hover {
  color: var(--cream, #FFF7ED);
  background: rgba(255, 247, 237, 0.12);
}

.showcase-cat-pill.is-active {
  background: var(--cream, #FFF7ED);
  color: var(--blue, #285991);
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.showcase-counter-badge {
  pointer-events: auto;
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--cream, #FFF7ED);
  padding: 8px 14px;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--blue-dark, #16365c) 50%, transparent);
  border: 1px solid rgba(255, 247, 237, 0.18);
  backdrop-filter: blur(8px);
}

/* ── Natural Scattered Canvas: Plain Blank Landscape Postcards ── */
.scattered-canvas-stage {
  position: relative;
  min-height: 100vh;
  width: 100%;
  padding: 90px 40px 140px 40px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.scatter-canvas-watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  text-align: center;
  opacity: 0.05;
}

.watermark-title {
  font-family: var(--serif, 'Instrument Serif', Georgia, serif);
  font-size: clamp(60px, 11vw, 150px);
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: 0.95;
  color: var(--cream, #FFF7ED);
}

.watermark-sub {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 12px;
  letter-spacing: 0.3em;
  color: var(--cream, #FFF7ED);
  margin-top: 14px;
}

/* ── Scattered Envelopes Wrapper (Free Organic Placement, Not a Grid) ── */
.scattered-envelopes-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1380px;
  height: 680px;
  margin: 30px auto 0 auto;
}

/* ── Plain Blank Landscape Postcard Envelope ──
   Landscape rectangle: 300px × 190px (1.58:1 ratio)
   NO images, NO illustrations, NO thumbnails, NO background artwork ── */
.plain-landscape-postcard {
  position: absolute;
  left: var(--card-left);
  top: var(--card-top);
  width: 310px;
  height: 195px;
  z-index: var(--z-order, 10);
  cursor: pointer;
  outline: none;
  perspective: 900px;
  transform-style: preserve-3d;
  transition: 
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.plain-landscape-postcard:hover {
  transform: rotate(calc(var(--base-rot) * 0.3)) translateY(-12px) scale(1.03) !important;
  z-index: 70 !important;
}

.plain-landscape-postcard:focus-visible {
  outline: 2px solid var(--cream, #FFF7ED);
  outline-offset: 6px;
}

/* Envelope Physical Pocket & Construction */
.envelope-pocket {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--cream, #FFF7ED);
  border-radius: 4px;
  border: 1px solid rgba(40, 89, 145, 0.16);
  box-shadow: 
    0 12px 28px rgba(0, 15, 40, 0.28),
    0 3px 8px rgba(0, 0, 0, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  overflow: visible;
  transition: box-shadow 0.3s ease;
}

.plain-landscape-postcard:hover .envelope-pocket {
  box-shadow: 
    0 24px 52px rgba(0, 12, 35, 0.44),
    0 6px 16px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.9);
}

/* Envelope 3D Foldable Top Flap */
.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  transform-origin: top center;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 25;
  pointer-events: none;
}

.envelope-flap.is-flap-open {
  transform: rotateX(180deg);
}

.flap-seam-triangle {
  width: 100%;
  height: 100%;
  background: color-mix(in srgb, var(--cream, #FFF7ED) 95%, #ebd9c0);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  border-top: 1px solid rgba(40, 89, 145, 0.14);
  box-shadow: 0 4px 10px rgba(0, 20, 50, 0.12);
}

/* Interior Letter Sheet (slides smoothly out upon opening) */
.envelope-letter-sheet {
  position: absolute;
  inset: 12px 14px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid rgba(40, 89, 145, 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 10;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.envelope-letter-sheet.is-sliding-out {
  transform: translateY(-60%);
  box-shadow: 0 12px 28px rgba(0, 15, 40, 0.3);
}

.letter-header-line {
  width: 40px;
  height: 2px;
  background: #bd3232;
  border-radius: 1px;
}

.letter-title-preview {
  font-family: var(--serif, 'Instrument Serif', Georgia, serif);
  font-size: 15px;
  color: var(--blue, #285991);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Envelope Face: Pure Blank Landscape Surface */
.envelope-face {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: var(--cream, #FFF7ED);
  border-radius: 4px;
  padding: 16px 18px 16px 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Subtle Airmail Top Edge */
.envelope-airmail-edge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: repeating-linear-gradient(
    135deg,
    #bd3232,
    #bd3232 8px,
    #fff7ed 8px,
    #fff7ed 14px,
    #285991 14px,
    #285991 22px,
    #fff7ed 22px,
    #fff7ed 28px
  );
  opacity: 0.85;
}

/* Meta Top Row */
.envelope-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.envelope-index-tag {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #bd3232;
  text-transform: uppercase;
}

.envelope-discipline-tag {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8px;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--blue, #285991) 65%, transparent);
}

/* Content Center */
.envelope-content-center {
  margin: auto 0;
}

.envelope-client-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8.5px;
  color: color-mix(in srgb, var(--blue, #285991) 75%, transparent);
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.envelope-project-title {
  font-family: var(--serif, 'Instrument Serif', Georgia, serif);
  font-size: 21px;
  font-weight: 400;
  line-height: 1.18;
  color: var(--blue, #285991);
  margin: 0 0 6px 0;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.envelope-role-tag {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8px;
  font-weight: 600;
  color: color-mix(in srgb, var(--blue, #285991) 85%, transparent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Footer Row */
.envelope-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px dashed rgba(40, 89, 145, 0.2);
}

.envelope-city-seal {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8px;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--blue, #285991) 65%, transparent);
}

.envelope-open-hint {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--blue, #285991);
  display: inline-flex;
  align-items: center;
  gap: 3px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.plain-landscape-postcard:hover .envelope-open-hint {
  transform: translateX(3px);
  color: #bd3232;
}

/* ============================================================
   Strictly ONE Vinyl Record in Bottom-Right Corner
   Immediate flight upon album click + continuous 33 ⅓ RPM spin
   ============================================================ */
.corner-turntable-assembly {
  position: fixed;
  right: 36px;
  bottom: 36px;
  z-index: 135;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}

.corner-vinyl-disc {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  position: relative;
  background: radial-gradient(circle, #242430 0%, #15151e 40%, #1d1d28 70%, #0e0e14 100%);
  box-shadow: 
    0 16px 38px rgba(0, 10, 30, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  cursor: pointer;
  animation: corner-vinyl-spin 7.5s linear infinite;
  transform-origin: center center;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.corner-vinyl-disc:hover {
  animation-duration: 4.5s;
}

@keyframes corner-vinyl-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.corner-vinyl-grooves {
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle at center,
    transparent 0,
    transparent 2px,
    rgba(255, 255, 255, 0.035) 2.5px,
    transparent 3.5px
  );
  pointer-events: none;
}

.corner-vinyl-sheen {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 35deg,
    transparent 0deg,
    rgba(255, 255, 255, 0.08) 45deg,
    transparent 90deg,
    transparent 180deg,
    rgba(255, 255, 255, 0.08) 225deg,
    transparent 270deg
  );
  pointer-events: none;
}

.corner-vinyl-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: var(--cream, #FFF7ED);
  color: var(--blue, #285991);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(40, 89, 145, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4px;
  box-sizing: border-box;
}

.corner-label-ring {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 1px solid rgba(40, 89, 145, 0.25);
  pointer-events: none;
}

.corner-label-side {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 6px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--blue, #285991) 65%, transparent);
}

.corner-label-brand {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  margin-top: 1px;
}

.corner-label-category {
  font-family: var(--serif, 'Instrument Serif', Georgia, serif);
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  margin: 2px 0;
  max-width: 65px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.corner-label-speed {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 5.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--blue, #285991) 70%, transparent);
}

.corner-spindle-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--blue, #285991);
  border: 1.5px solid rgba(255, 247, 237, 0.9);
}

.corner-turntable-tag {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--blue-dark, #16365c) 75%, transparent);
  border: 1px solid rgba(255, 247, 237, 0.22);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.turntable-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
  animation: turntable-pulse 2s ease infinite;
}

@keyframes turntable-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}

.turntable-text {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--cream, #FFF7ED);
}

/* ============================================================
   Clear React-Powered Project Reveal Display
   Smooth animation opening the envelope to reveal project
   ============================================================ */
.project-reveal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(14, 34, 60, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.project-reveal-card {
  position: relative;
  width: 100%;
  max-width: 980px;
  max-height: 90vh;
  background: var(--cream, #FFF7ED);
  color: var(--blue, #285991);
  border-radius: 6px;
  border: 1px solid rgba(40, 89, 145, 0.2);
  box-shadow: 
    0 24px 60px rgba(0, 10, 30, 0.5),
    0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 32px 36px 28px 36px;
  box-sizing: border-box;
}

.reveal-airmail-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: repeating-linear-gradient(
    135deg,
    #bd3232,
    #bd3232 8px,
    #fff7ed 8px,
    #fff7ed 14px,
    #285991 14px,
    #285991 22px,
    #fff7ed 22px,
    #fff7ed 28px
  );
}

.reveal-close-btn {
  position: absolute;
  top: 18px;
  right: 20px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(40, 89, 145, 0.08);
  color: var(--blue, #285991);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(40, 89, 145, 0.15);
}

.reveal-close-btn:hover {
  background: var(--blue, #285991);
  color: var(--cream, #FFF7ED);
  transform: rotate(90deg);
}

.reveal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 6px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(40, 89, 145, 0.18);
  gap: 20px;
}

.reveal-kicker {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #bd3232;
  text-transform: uppercase;
}

.reveal-title {
  font-family: var(--serif, 'Instrument Serif', Georgia, serif);
  font-size: clamp(28px, 4.5vw, 42px);
  font-weight: 400;
  line-height: 1.1;
  color: var(--blue, #285991);
  margin: 6px 0 10px 0;
  letter-spacing: -0.01em;
}

.reveal-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 11px;
  color: color-mix(in srgb, var(--blue, #285991) 80%, transparent);
}

.reveal-sep {
  color: #bd3232;
}

.reveal-stamp-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border: 1px dashed rgba(40, 89, 145, 0.4);
  padding: 6px 12px;
  border-radius: 4px;
  background: rgba(40, 89, 145, 0.04);
  flex-shrink: 0;
}

.stamp-tag-label {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #bd3232;
}

.stamp-tag-code {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--blue, #285991);
}

.reveal-media-stage {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: #0d1a2c;
  border: 1px solid rgba(40, 89, 145, 0.2);
  margin-bottom: 24px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.reveal-video-wrapper,
.reveal-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a1422;
}

.reveal-video-element,
.reveal-image-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.reveal-video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(180deg, transparent 0%, rgba(10, 24, 44, 0.88) 100%);
}

.reveal-ctrl-btn {
  background: transparent;
  color: var(--cream, #FFF7ED);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.2s;
}

.reveal-ctrl-btn:hover {
  background: rgba(255, 247, 237, 0.2);
}

.reveal-progress-track {
  flex: 1;
  height: 4px;
  background: rgba(255, 247, 237, 0.25);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.reveal-progress-fill {
  height: 100%;
  background: var(--cream, #FFF7ED);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.reveal-body-grid {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 32px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(40, 89, 145, 0.16);
}

.reveal-subheading {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #bd3232;
  margin: 0 0 10px 0;
}

.reveal-description {
  font-family: var(--sans, 'DM Sans', sans-serif);
  font-size: 14.5px;
  line-height: 1.65;
  color: color-mix(in srgb, var(--blue, #285991) 95%, black);
  margin: 0;
}

.reveal-specs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 11px;
  line-height: 1.8;
  color: color-mix(in srgb, var(--blue, #285991) 85%, transparent);
}

.reveal-specs-list strong {
  color: var(--blue, #285991);
}

.reveal-footer-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.reveal-nav-btn {
  background: transparent;
  color: var(--blue, #285991);
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(40, 89, 145, 0.2);
  transition: all 0.2s;
}

.reveal-nav-btn:hover {
  background: var(--blue, #285991);
  color: var(--cream, #FFF7ED);
}

.reveal-counter-text {
  font-family: var(--mono, 'Space Mono', monospace);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--blue, #285991) 60%, transparent);
}

/* ============================================================
   Responsive Adaptations
   ============================================================ */
@media (max-width: 1160px) and (min-width: 769px) {
  .scattered-envelopes-wrapper {
    height: 720px;
  }

  .plain-landscape-postcard {
    width: 280px;
    height: 180px;
  }

  .corner-vinyl-disc {
    width: 155px;
    height: 155px;
  }

  .corner-vinyl-center-label {
    width: 64px;
    height: 64px;
  }

  .reveal-body-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .showcase-editorial-header {
    padding: 0 16px;
    height: 64px;
  }

  .showcase-category-nav {
    display: none;
  }

  .scattered-canvas-stage {
    padding: 80px 16px 180px 16px;
  }

  .scattered-envelopes-wrapper {
    position: relative;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-width: 440px;
    margin: 10px auto;
  }

  .plain-landscape-postcard {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    max-width: 360px;
    height: 180px;
    margin: 0 auto !important;
    transform: rotate(calc(var(--base-rot) * 0.4)) !important;
  }

  .plain-landscape-postcard:hover {
    transform: translateY(-5px) scale(1.02) !important;
  }

  .corner-turntable-assembly {
    right: 14px;
    bottom: 14px;
    z-index: 70;
  }

  .corner-vinyl-disc {
    width: 95px;
    height: 95px;
    box-shadow: 0 10px 24px rgba(0, 10, 30, 0.5);
  }

  .corner-vinyl-center-label {
    width: 42px;
    height: 42px;
  }

  .corner-label-side, .corner-label-speed {
    display: none;
  }

  .corner-label-brand {
    font-size: 6px;
  }

  .corner-label-category {
    font-size: 7px;
    max-width: 36px;
  }

  .corner-turntable-tag {
    display: none;
  }

  .project-reveal-card {
    padding: 20px 18px;
  }
}

/* Reduced Motion Preferences */
@media (prefers-reduced-motion: reduce) {
  .corner-vinyl-disc {
    animation: none !important;
  }
  .plain-landscape-postcard,
  .envelope-flap,
  .envelope-letter-sheet {
    transition: none !important;
    transform: none !important;
  }
  .turntable-pulse-dot {
    animation: none !important;
  }
}
"""

updated_css = css[:section_start] + new_styles + "\n" + css[section_end:]
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(updated_css)

print("styles.css updated with plain landscape envelope and scattered styles!")
