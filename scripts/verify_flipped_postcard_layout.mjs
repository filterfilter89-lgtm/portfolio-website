import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function runVisualVerification() {
  const browser = await chromium.launch({ headless: true });
  
  const testConfigs = [
    {
      mode: 'desktop',
      width: 1920,
      height: 1080,
      projects: [
        { id: 'fetto-garments', name: 'Fetto Garments', expectedCount: 4 },
        { id: 'fouz-travels', name: 'Fouz Travels', expectedCount: 2 },
        { id: 'fruitly', name: 'Fruitly', expectedCount: 8 }
      ]
    },
    {
      mode: 'mobile',
      width: 390,
      height: 844,
      projects: [
        { id: 'fetto-garments', name: 'Fetto Garments', expectedCount: 4 },
        { id: 'fouz-travels', name: 'Fouz Travels', expectedCount: 2 },
        { id: 'fruitly', name: 'Fruitly', expectedCount: 8 }
      ]
    }
  ];

  const summary = [];

  for (const cfg of testConfigs) {
    console.log(`\n======================================================`);
    console.log(` TESTING VIEWPORT: ${cfg.mode.toUpperCase()} (${cfg.width}x${cfg.height})`);
    console.log(`======================================================`);

    const page = await browser.newPage({
      viewport: { width: cfg.width, height: cfg.height },
      deviceScaleFactor: cfg.mode === 'mobile' ? 2 : 1
    });

    await page.goto('http://localhost:5173/#work/graphic-designs', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // Allow postcards to settle on desk

    for (const proj of cfg.projects) {
      console.log(`\nOpening project: ${proj.name} on ${cfg.mode}...`);

      // Find postcard by aria-label
      const postcard = page.locator(`.draggable-postcard-item[aria-label*="${proj.name}"]`).first();
      await postcard.waitFor({ state: 'visible', timeout: 5000 });
      await postcard.click();

      // Wait for flip and expansion
      await page.waitForSelector('.draggable-postcard-item.is-expanded', { timeout: 5000 });
      await page.waitForSelector('.scattered-polaroid-item', { timeout: 5000 });
      await page.waitForTimeout(1000); // Allow animation to settle

      // Extract geometry from DOM
      const metrics = await page.evaluate(() => {
        const backSide = document.querySelector('.draggable-postcard-item.is-expanded .postcard-side-back');
        if (!backSide) return null;

        const cardRect = backSide.getBoundingClientRect();
        const itemEls = Array.from(document.querySelectorAll('.draggable-postcard-item.is-expanded .scattered-polaroid-item'));
        const frameEls = Array.from(document.querySelectorAll('.draggable-postcard-item.is-expanded .scattered-polaroid-frame'));

        const items = itemEls.map((el, i) => {
          const r = el.getBoundingClientRect();
          const frameR = frameEls[i] ? frameEls[i].getBoundingClientRect() : r;
          const style = window.getComputedStyle(el);
          const transform = style.transform;

          let rotationDeg = 0;
          if (transform && transform !== 'none' && transform.startsWith('matrix(')) {
            const values = transform.slice(7, -1).split(',').map(parseFloat);
            const a = values[0];
            const b = values[1];
            rotationDeg = Math.round(Math.atan2(b, a) * (180 / Math.PI) * 10) / 10;
          }

          return {
            index: i,
            rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height },
            frameRect: { left: frameR.left, top: frameR.top, right: frameR.right, bottom: frameR.bottom, width: frameR.width, height: frameR.height },
            rotationDeg
          };
        });

        return {
          cardRect: { left: cardRect.left, top: cardRect.top, right: cardRect.right, bottom: cardRect.bottom, width: cardRect.width, height: cardRect.height },
          items
        };
      });

      if (!metrics) {
        console.error(`FAILED: Postcard back not found for ${proj.name}`);
        summary.push({ viewport: cfg.mode, project: proj.name, pass: false, reason: 'Card back missing' });
        continue;
      }

      console.log(`Expanded Postcard: ${Math.round(metrics.cardRect.width)}x${Math.round(metrics.cardRect.height)}px at (${Math.round(metrics.cardRect.left)}, ${Math.round(metrics.cardRect.top)})`);
      console.log(`Rendered Items: ${metrics.items.length}`);

      // 1. Containment Verification (100% inside)
      let allContained = true;
      let zeroRotation = true;
      const boxes = [];

      for (const item of metrics.items) {
        const b = item.frameRect;
        boxes.push(b);

        const padLeft = b.left - metrics.cardRect.left;
        const padRight = metrics.cardRect.right - b.right;
        const padTop = b.top - metrics.cardRect.top;
        const padBottom = metrics.cardRect.bottom - b.bottom;

        // Sub-pixel tolerance (1.5px) for browser rounding
        const isInside = padLeft >= -1.5 && padRight >= -1.5 && padTop >= -1.5 && padBottom >= -1.5;
        if (!isInside) allContained = false;

        const isZeroRot = Math.abs(item.rotationDeg) < 0.2;
        if (!isZeroRot) zeroRotation = false;

        console.log(`  Item #${item.index + 1}: ${Math.round(b.width)}x${Math.round(b.height)}px | rot=${item.rotationDeg}° | margins: L=${padLeft.toFixed(1)} R=${padRight.toFixed(1)} T=${padTop.toFixed(1)} B=${padBottom.toFixed(1)} -> Contained: ${isInside}`);
      }

      // 2. Overlap Verification (0% Overlap)
      let overlapCount = 0;
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const b1 = boxes[i];
          const b2 = boxes[j];
          const xOverlap = Math.max(0, Math.min(b1.right, b2.right) - Math.max(b1.left, b2.left));
          const yOverlap = Math.max(0, Math.min(b1.bottom, b2.bottom) - Math.max(b1.top, b2.top));
          if (xOverlap > 2 && yOverlap > 2) {
            overlapCount++;
            console.error(`  OVERLAP detected between Item ${i + 1} and ${j + 1}: dx=${xOverlap.toFixed(1)}px, dy=${yOverlap.toFixed(1)}px`);
          }
        }
      }

      const pass = allContained && zeroRotation && overlapCount === 0 && metrics.items.length === proj.expectedCount;
      summary.push({
        viewport: cfg.mode,
        project: proj.name,
        items: `${metrics.items.length}/${proj.expectedCount}`,
        zeroRot: zeroRotation ? '0° (PASS)' : 'ROTATED (FAIL)',
        overlap: overlapCount === 0 ? '0% (PASS)' : `${overlapCount} collisions`,
        contained: allContained ? '100% (PASS)' : 'Overflow detected',
        status: pass ? 'PASS' : 'FAIL'
      });

      // Capture screenshot
      const shotFilename = `verified_${cfg.mode}_${proj.id}_expanded.png`;
      const shotPath = path.join(ARTIFACT_DIR, shotFilename);
      await page.screenshot({ path: shotPath });
      console.log(`  Screenshot saved: ${shotPath}`);

      // Close postcard to return to desk
      const closeBtn = page.locator('.enlarged-postcard-close-btn').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(800); // Allow retraction
      }
    }

    await page.close();
  }

  await browser.close();

  console.log('\n======================================================');
  console.log(' FINAL VISUAL VERIFICATION SUMMARY TABLE');
  console.log('======================================================');
  console.table(summary);

  const allPassed = summary.every(s => s.status === 'PASS');
  console.log(`\nRESULT: ${allPassed ? 'ALL TESTS PASSED WITH 0% OVERLAP AND 0° ROTATION' : 'SOME TESTS FAILED'}`);
  return allPassed;
}

runVisualVerification().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
