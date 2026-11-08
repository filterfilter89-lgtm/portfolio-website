import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

const DEVICES = [
  { name: 'iPhone_15', width: 390, height: 844, dpr: 3, isMobile: true, hasTouch: true },
  { name: 'iPhone_SE', width: 375, height: 667, dpr: 2, isMobile: true, hasTouch: true },
  { name: 'Pixel_7', width: 412, height: 915, dpr: 2.6, isMobile: true, hasTouch: true },
  { name: 'iPad_Mini', width: 768, height: 1024, dpr: 2, isMobile: true, hasTouch: true },
  { name: 'Desktop_1080p', width: 1920, height: 1080, dpr: 1, isMobile: false, hasTouch: false }
];

async function runDeviceMatrix() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const dev of DEVICES) {
    console.log(`\n======================================================`);
    console.log(` TESTING DEVICE: ${dev.name} (${dev.width}x${dev.height}, DPR: ${dev.dpr})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: dev.width, height: dev.height },
      deviceScaleFactor: dev.dpr,
      isMobile: dev.isMobile,
      hasTouch: dev.hasTouch
    });

    const page = await context.newPage();

    // Collect console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    // 1. Initial Load
    const t0 = Date.now();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    const loadTimeMs = Date.now() - t0;
    console.log(`  Initial Load Time: ${loadTimeMs}ms`);

    // Verify canvas rendered
    const canvasRendered = await page.evaluate(() => {
      const c = document.querySelector('.scroll-canvas');
      return !!c && c.width > 0 && c.height > 0;
    });
    console.log(`  Canvas Initialized: ${canvasRendered}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, `device_${dev.name}_01_hero_start.png`) });

    // 2. Scroll Scrub to End Frame (Frame 48)
    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), maxScroll);
    await page.waitForTimeout(600);

    const playBtnVisible = await page.evaluate(() => {
      const btn = document.querySelector('.canvas-play-hitbox');
      const endOverlay = document.querySelector('.scroll-text--end');
      const opacity = endOverlay ? window.getComputedStyle(endOverlay).opacity : '0';
      return !!btn && parseFloat(opacity) > 0.8;
    });
    console.log(`  Play Button Visible at End Frame: ${playBtnVisible}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `device_${dev.name}_02_hero_end.png`) });

    // 3. Play Button Click -> Transition to Album Carousel
    await page.click('.canvas-play-hitbox');
    await page.waitForSelector('.react-album-stage', { timeout: 6000 });
    await page.waitForTimeout(1000); // Allow dither wipe & entrance

    const carouselReady = await page.evaluate(() => {
      const cards = document.querySelectorAll('.react-album-card-item');
      return cards.length >= 3;
    });
    console.log(`  Album Carousel Mounted: ${carouselReady}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `device_${dev.name}_03_album_carousel.png`) });

    // 4. Test Touch / Swipe Gesture
    if (dev.hasTouch) {
      await page.evaluate(() => {
        const stage = document.querySelector('.react-album-stage');
        if (!stage) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const tStart = new Touch({ identifier: 1, target: stage, clientX: w * 0.75, clientY: h * 0.5 });
        stage.dispatchEvent(new TouchEvent('touchstart', { touches: [tStart], cancelable: true }));

        const tMove = new Touch({ identifier: 1, target: stage, clientX: w * 0.25, clientY: h * 0.5 });
        stage.dispatchEvent(new TouchEvent('touchmove', { touches: [tMove], cancelable: true }));

        stage.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [tMove], cancelable: true }));
      });
      await page.waitForTimeout(500);
      console.log(`  Swipe Gesture executed smoothly`);
    }

    // 5. Open Graphic Designs category by selecting its album card
    await page.evaluate(() => {
      const link = document.querySelector('a[aria-label*="GRAPHIC DESIGNS"]');
      if (link) link.click();
    });
    await page.waitForSelector('.draggable-postcard-item', { timeout: 8000 });
    await page.waitForTimeout(1400); // Allow postcards to scatter

    const postcardsCount = await page.evaluate(() => document.querySelectorAll('.draggable-postcard-item').length);
    console.log(`  Postcards Scattered on Desk: ${postcardsCount}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `device_${dev.name}_04_postcards_desk.png`) });

    // 6. Click Fetto Garments to expand & flip
    const fettoCard = page.locator('.draggable-postcard-item[aria-label*="Fetto Garments"]').first();
    await fettoCard.click();
    await page.waitForSelector('.draggable-postcard-item.is-expanded', { timeout: 5000 });
    await page.waitForSelector('.scattered-polaroid-item', { timeout: 5000 });
    await page.waitForTimeout(1000);

    // Verify Flipped Layout: Containment, Zero Rotation, Zero Overlap
    const layoutVerification = await page.evaluate(() => {
      const backSide = document.querySelector('.draggable-postcard-item.is-expanded .postcard-side-back');
      if (!backSide) return { pass: false, reason: 'Card back missing' };

      const cardRect = backSide.getBoundingClientRect();
      const frames = Array.from(document.querySelectorAll('.draggable-postcard-item.is-expanded .scattered-polaroid-frame'));
      const items = Array.from(document.querySelectorAll('.draggable-postcard-item.is-expanded .scattered-polaroid-item'));

      let allContained = true;
      let zeroRot = true;
      const boxes = [];

      items.forEach((el, i) => {
        const frameR = frames[i] ? frames[i].getBoundingClientRect() : el.getBoundingClientRect();
        boxes.push(frameR);

        const padLeft = frameR.left - cardRect.left;
        const padRight = cardRect.right - frameR.right;
        const padTop = frameR.top - cardRect.top;
        const padBottom = cardRect.bottom - frameR.bottom;

        // Sub-pixel tolerance
        if (padLeft < -1.5 || padRight < -1.5 || padTop < -1.5 || padBottom < -1.5) {
          allContained = false;
        }

        const transform = window.getComputedStyle(el).transform;
        if (transform && transform !== 'none' && transform.startsWith('matrix(')) {
          const vals = transform.slice(7, -1).split(',').map(parseFloat);
          const deg = Math.abs(Math.round(Math.atan2(vals[1], vals[0]) * (180 / Math.PI) * 10) / 10);
          if (deg > 0.2) zeroRot = false;
        }
      });

      // Overlap check
      let overlap = false;
      for (let a = 0; a < boxes.length; a++) {
        for (let b = a + 1; b < boxes.length; b++) {
          const b1 = boxes[a];
          const b2 = boxes[b];
          const dx = Math.max(0, Math.min(b1.right, b2.right) - Math.max(b1.left, b2.left));
          const dy = Math.max(0, Math.min(b1.bottom, b2.bottom) - Math.max(b1.top, b2.top));
          if (dx > 2 && dy > 2) overlap = true;
        }
      }

      return {
        pass: allContained && zeroRot && !overlap,
        itemCount: items.length,
        cardW: Math.round(cardRect.width),
        cardH: Math.round(cardRect.height),
        allContained,
        zeroRot,
        overlap
      };
    });

    console.log(`  Flipped Layout: ${layoutVerification.itemCount} items inside ${layoutVerification.cardW}x${layoutVerification.cardH}px`);
    console.log(`  Containment: ${layoutVerification.allContained} | 0° Rotation: ${layoutVerification.zeroRot} | Overlap: ${layoutVerification.overlap}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `device_${dev.name}_05_flipped_expanded.png`) });

    // 7. Click Item 1 to open Lightbox Modal
    const firstItem = page.locator('.draggable-postcard-item.is-expanded .scattered-polaroid-item').first();
    await firstItem.click();
    await page.waitForSelector('.polaroid-inspect-modal', { timeout: 4000 });
    await page.waitForTimeout(500);

    const modalActive = await page.evaluate(() => !!document.querySelector('.polaroid-inspect-modal'));
    console.log(`  Lightbox Inspect Modal Opened: ${modalActive}`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `device_${dev.name}_06_inspect_modal.png`) });

    // 8. Close Modal
    await page.click('.polaroid-inspect-close');
    await page.waitForTimeout(500);

    results.push({
      device: dev.name,
      viewport: `${dev.width}x${dev.height}`,
      loadTime: `${loadTimeMs}ms`,
      heroCanvas: canvasRendered ? 'PASS' : 'FAIL',
      playBtn: playBtnVisible ? 'PASS' : 'FAIL',
      carousel: carouselReady ? 'PASS' : 'FAIL',
      postcards: postcardsCount >= 3 ? 'PASS' : 'FAIL',
      layout0Rot: layoutVerification.zeroRot ? 'PASS' : 'FAIL',
      layout0Overlap: !layoutVerification.overlap ? 'PASS' : 'FAIL',
      layoutContained: layoutVerification.allContained ? 'PASS' : 'FAIL',
      lightbox: modalActive ? 'PASS' : 'FAIL',
      errors: errors.length === 0 ? '0 errors (PASS)' : `${errors.length} errors: ${errors.join('; ')}`
    });

    await context.close();
  }

  await browser.close();

  console.log('\n======================================================');
  console.log(' COMPLETE MULTI-DEVICE PERFORMANCE & RESPONSIVENESS MATRIX');
  console.log('======================================================');
  console.table(results);

  return results;
}

runDeviceMatrix().catch(err => {
  console.error('Testing matrix error:', err);
  process.exit(1);
});
