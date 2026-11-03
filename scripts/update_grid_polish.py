with open("styles.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace .postcard-scatter-grid and add the nth-child offsets
old_grid_block = """.postcard-scatter-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  max-width: 1360px;
  width: 100%;
  gap: 36px 32px;
  margin: 0 auto;
}"""

new_grid_block = """.postcard-scatter-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 1fr));
  max-width: 1320px;
  width: 100%;
  gap: 40px 36px;
  margin: 0 auto;
  padding-bottom: 40px;
}

/* Curated organic scattered placement for 5 postcards (row 2 col 3 is left open for the corner disc) */
.editorial-postcard:nth-child(1) {
  grid-column: 1;
  margin-top: 14px;
}

.editorial-postcard:nth-child(2) {
  grid-column: 2;
  margin-top: -18px;
}

.editorial-postcard:nth-child(3) {
  grid-column: 3;
  margin-top: 26px;
}

.editorial-postcard:nth-child(4) {
  grid-column: 1;
  margin-left: 28px;
  margin-top: -8px;
}

.editorial-postcard:nth-child(5) {
  grid-column: 2;
  margin-left: 14px;
  margin-top: -22px;
}"""

css = css.replace(old_grid_block, new_grid_block)

# Also update responsive media queries in styles.css
old_responsive = """@media (max-width: 1024px) {
  .postcard-scatter-canvas {
    padding: 96px 28px 150px 28px;
  }

  .postcard-scatter-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 28px;
  }

  .corner-vinyl-disc {
    width: 150px;
    height: 150px;
  }

  .corner-vinyl-center-label {
    width: 62px;
    height: 62px;
  }

  .dossier-narrative-grid {
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

  .postcard-scatter-canvas {
    padding: 84px 16px 140px 16px;
  }

  .postcard-scatter-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .editorial-postcard {
    padding: 16px;
    transform: rotate(0deg) !important;
  }

  .editorial-postcard:hover {
    transform: translateY(-6px) scale(1.01) !important;
  }

  .corner-turntable-assembly {
    right: 18px;
    bottom: 18px;
  }

  .corner-vinyl-disc {
    width: 110px;
    height: 110px;
  }

  .corner-vinyl-center-label {
    width: 48px;
    height: 48px;
  }

  .corner-label-category {
    font-size: 8px;
    max-width: 42px;
  }

  .corner-turntable-tag {
    display: none;
  }

  .project-dossier-sheet {
    padding: 20px 18px;
  }
}"""

new_responsive = """@media (max-width: 1160px) and (min-width: 769px) {
  .postcard-scatter-canvas {
    padding: 96px 28px 160px 28px;
  }

  .postcard-scatter-grid {
    grid-template-columns: repeat(2, minmax(290px, 1fr));
    gap: 32px;
  }

  .editorial-postcard:nth-child(1) { grid-column: 1; margin: 0; }
  .editorial-postcard:nth-child(2) { grid-column: 2; margin-top: 24px; }
  .editorial-postcard:nth-child(3) { grid-column: 1; margin: 0; }
  .editorial-postcard:nth-child(4) { grid-column: 2; margin-top: 24px; }
  .editorial-postcard:nth-child(5) { grid-column: 1; margin: 0; }

  .corner-vinyl-disc {
    width: 155px;
    height: 155px;
  }

  .corner-vinyl-center-label {
    width: 64px;
    height: 64px;
  }

  .dossier-narrative-grid {
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

  .postcard-scatter-canvas {
    padding: 80px 16px 180px 16px;
  }

  .postcard-scatter-grid {
    display: flex;
    flex-direction: column;
    gap: 26px;
    width: 100%;
    max-width: 440px;
  }

  .editorial-postcard {
    padding: 16px;
    margin: 0 !important;
    transform: rotate(calc(var(--base-rot) * 0.45)) !important;
  }

  .editorial-postcard:hover {
    transform: translateY(-6px) scale(1.015) !important;
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

  .project-dossier-sheet {
    padding: 20px 18px;
  }
}"""

css = css.replace(old_responsive, new_responsive)

with open("styles.css", "w", encoding="utf-8") as f:
    f.write(css)

print("styles.css updated with curated scattered desktop layout and mobile polish!")
