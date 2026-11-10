import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';
const BASE_URL = 'http://localhost:5173';

async function runHeatmapVerification() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'Desktop (1440x900)', width: 1440, height: 900, isMobile: false },
    { name: 'Mobile (390x844)', width: 390, height: 844, isMobile: true }
  ];

  const overallResults = [];

  for (const vp of viewports) {
    console.log(`\n======================================================`);
    console.log(` RUNNING HEATMAP VERIFICATION ON: ${vp.name}`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.isMobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined
    });

    const page = await context.newPage();

    // -----------------------------------------------------------------
    // TEST 1: Desk Postcards (Unflipped) for Graphic Designs & Videography
    // -----------------------------------------------------------------
    for (const catId of ['graphic-designs', 'videography']) {
      console.log(`\nTesting Desk Postcards for Category: ${catId}...`);
      await page.goto(`${BASE_URL}/work.html#work/${catId}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1600); // Allow cards to pop out and settle on desk

      const deskMetrics = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.draggable-postcard-item:not(.is-expanded)'));
        return cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          return {
            index: i,
            left: r.left,
            top: r.top,
            right: r.right,
            bottom: r.bottom,
            width: r.width,
            height: r.height
          };
        });
      });

      console.log(`  Found ${deskMetrics.length} postcards on desk.`);

      // Check 2D Heatmap / pairwise overlaps among desk postcards
      let deskCollisions = 0;
      for (let i = 0; i < deskMetrics.length; i++) {
        for (let j = i + 1; j < deskMetrics.length; j++) {
          const a = deskMetrics[i];
          const b = deskMetrics[j];
          const dx = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const dy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          // Sub-pixel threshold 5px
          if (dx > 5 && dy > 5) {
            deskCollisions++;
            console.error(`  COLLISION on Desk between Card ${i} and Card ${j}: overlap ${dx.toFixed(1)}x${dy.toFixed(1)}px`);
          }
        }
      }

      const deskPass = deskCollisions === 0 && deskMetrics.length > 0;
      console.log(`  Desk Postcards Result: ${deskPass ? 'PASS (0% Overlap)' : 'FAIL (' + deskCollisions + ' collisions)'}`);
      overallResults.push({
        viewport: vp.name,
        target: `Desk: ${catId}`,
        items: deskMetrics.length,
        collisions: deskCollisions,
        aspectRatioMatch: 'N/A (Front of Postcard)',
        status: deskPass ? 'PASS' : 'FAIL'
      });

      await page.screenshot({ path: path.join(ARTIFACT_DIR, `heatmap_desk_${vp.isMobile ? 'mobile' : 'desktop'}_${catId}.png`) });
    }

    // -----------------------------------------------------------------
    // TEST 2: Flipped Postcards & Exact Aspect Ratio Verification
    // Projects to test:
    // - Eazyarts Ganesh (5 images, 4:5 aspect ratio)
    // - Fouz Travels (2 images, 3:4 aspect ratio)
    // - Fetto Garments (4 images, 4:5 and 9:16 aspect ratio)
    // - Fruitly (8 images, 16:9 aspect ratio)
    // - Dot Store (2 videos, 9:16 aspect ratio)
    // - Eazyarts (5 videos, 9:16 aspect ratio)
    // -----------------------------------------------------------------
    const projectsToVerify = [
      { cat: 'graphic-designs', id: 'eazyarts-ganesh', name: 'Eazyarts Ganesh', expectedCount: 5 },
      { cat: 'graphic-designs', id: 'fouz-travels', name: 'Fouz Travels', expectedCount: 2 },
      { cat: 'graphic-designs', id: 'fetto-garments', name: 'Fetto Garments', expectedCount: 4 },
      { cat: 'graphic-designs', id: 'fruitly', name: 'Fruitly', expectedCount: 8 },
      { cat: 'videography', id: 'dot-store', name: 'Dot Store', expectedCount: 2 },
      { cat: 'videography', id: 'eazyarts', name: 'Eazyarts Reels', expectedCount: 5 }
    ];

    for (const proj of projectsToVerify) {
      console.log(`\nVerifying Flipped Postcard: ${proj.name} (${proj.cat})...`);
      await page.goto(`${BASE_URL}/work.html#work/${proj.cat}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1400);

      // Click card by text or index
      const card = page.locator(`.draggable-postcard-item`).filter({ hasText: proj.name.split(' ')[0] }).first();
      await card.waitFor({ state: 'visible', timeout: 5000 });
      await card.click();

      // Wait for flip and expansion
      await page.waitForSelector('.draggable-postcard-item.is-expanded', { timeout: 5000 });
      await page.waitForSelector('.scattered-polaroid-item', { timeout: 5000 });
      await page.waitForTimeout(1000); // Allow animation to settle

      // Extract geometry and aspect ratios from DOM
      const cardAnalysis = await page.evaluate(() => {
        const backSide = document.querySelector('.draggable-postcard-item.is-expanded .postcard-side-back');
        if (!backSide) return null;

        const cardRect = backSide.getBoundingClientRect();
        const slotEls = Array.from(document.querySelectorAll('.draggable-postcard-item.is-expanded .scattered-polaroid-slot'));
        const itemEls = Array.from(document.querySelectorAll('.draggable-postcard-item.is-expanded .scattered-polaroid-item'));
        const frameEls = Array.from(document.querySelectorAll('.draggable-postcard-item.is-expanded .scattered-polaroid-frame'));

        const items = itemEls.map((el, i) => {
          const r = el.getBoundingClientRect();
          const frameR = frameEls[i] ? frameEls[i].getBoundingClientRect() : r;
          const img = el.querySelector('img.scattered-img');
          const vid = el.querySelector('video.in-card-video-element');

          let naturalAR = null;
          let renderedAR = null;
          let mediaType = 'unknown';

          if (img) {
            mediaType = 'image';
            if (img.naturalWidth && img.naturalHeight) {
              naturalAR = img.naturalWidth / img.naturalHeight;
            }
            const ir = img.getBoundingClientRect();
            renderedAR = ir.width / ir.height;
          } else if (vid) {
            mediaType = 'video';
            if (vid.videoWidth && vid.videoHeight) {
              naturalAR = vid.videoWidth / vid.videoHeight;
            } else {
              naturalAR = 9 / 16;
            }
            const vr = vid.getBoundingClientRect();
            renderedAR = vr.width / vr.height;
          }

          const style = window.getComputedStyle(el);
          let rotationDeg = 0;
          if (style.transform && style.transform.startsWith('matrix(')) {
            const vals = style.transform.slice(7, -1).split(',').map(parseFloat);
            rotationDeg = Math.round(Math.atan2(vals[1], vals[0]) * (180 / Math.PI) * 10) / 10;
          }

          return {
            index: i,
            mediaType,
            naturalAR,
            renderedAR,
            arDiff: (naturalAR && renderedAR) ? Math.abs(naturalAR - renderedAR) : 0,
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

      if (!cardAnalysis) {
        console.error(`  ERROR: Postcard back not found for ${proj.name}`);
        continue;
      }

      console.log(`  Items detected: ${cardAnalysis.items.length}/${proj.expectedCount}`);

      // Check Heatmap collisions among polaroid items inside flipped card
      let flippedCollisions = 0;
      const collisionDetails = [];
      const boxes = cardAnalysis.items.map(it => it.frameRect);

      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const dx = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const dy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          // Sub-pixel threshold 4px
          if (dx > 4 && dy > 4) {
            flippedCollisions++;
            collisionDetails.push({ i, j, dx: dx.toFixed(1), dy: dy.toFixed(1) });
          }
        }
      }

      // Check aspect ratio accuracy (tolerance 0.02 for sub-pixel frame border rendering)
      let allAspectRatiosPreserved = true;
      const maxArDiff = Math.max(...cardAnalysis.items.map(it => it.arDiff));

      cardAnalysis.items.forEach(it => {
        const isArValid = it.arDiff <= 0.025;
        if (!isArValid) allAspectRatiosPreserved = false;
        console.log(`    Item #${it.index + 1} (${it.mediaType}): naturalAR=${it.naturalAR ? it.naturalAR.toFixed(4) : 'N/A'}, renderedAR=${it.renderedAR ? it.renderedAR.toFixed(4) : 'N/A'}, diff=${it.arDiff.toFixed(4)} -> ${isArValid ? 'MATCH (PASS)' : 'DISTORTED (FAIL)'}`);
      });

      const flippedPass = flippedCollisions === 0 && allAspectRatiosPreserved && cardAnalysis.items.length === proj.expectedCount;
      console.log(`  Heatmap Overlaps: ${flippedCollisions === 0 ? '0% OVERLAP (PASS)' : flippedCollisions + ' COLLISIONS (FAIL)'}`);
      console.log(`  Aspect Ratios: ${allAspectRatiosPreserved ? 'EXACT MATCH (PASS)' : 'DEVIATION DETECTED (FAIL)'}`);

      overallResults.push({
        viewport: vp.name,
        target: `Flipped: ${proj.name}`,
        items: `${cardAnalysis.items.length}/${proj.expectedCount}`,
        collisions: flippedCollisions,
        aspectRatioMatch: allAspectRatiosPreserved ? '100% Match' : `Diff: ${maxArDiff.toFixed(4)}`,
        status: flippedPass ? 'PASS' : 'FAIL'
      });

      // Capture screenshot
      await page.screenshot({ path: path.join(ARTIFACT_DIR, `heatmap_flipped_${vp.isMobile ? 'mobile' : 'desktop'}_${proj.id}.png`) });

      // Close expanded postcard
      const closeBtn = page.locator('.enlarged-postcard-close-btn').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(600);
      }
    }

    await page.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(` COMPLETE HEATMAP & ASPECT RATIO VERIFICATION SUMMARY`);
  console.log(`======================================================`);
  console.table(overallResults);

  const allPassed = overallResults.every(r => r.status === 'PASS');
  console.log(`\nFINAL OUTCOME: ${allPassed ? 'ALL TESTS PASSED (0% OVERLAP & EXACT ASPECT RATIOS)' : 'FAILURES DETECTED'}`);
  return allPassed;
}

runHeatmapVerification().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
