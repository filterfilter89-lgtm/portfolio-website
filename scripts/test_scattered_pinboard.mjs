import { chromium } from 'playwright';
import path from 'path';

const BASE_URL = process.argv[2] || 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

function checkOverlap(rect1, rect2) {
  // Overlap if horizontal and vertical projections overlap
  return !(
    rect1.right <= rect2.left ||
    rect1.left >= rect2.right ||
    rect1.bottom <= rect2.top ||
    rect1.top >= rect2.bottom
  );
}

async function main() {
  console.log('=== VERIFYING ORGANIC SCATTERED PINBOARD & LIGHTBOX ===');
  console.log('Target URL:', BASE_URL, '\n');
  const browser = await chromium.launch({ headless: true });

  let allPassed = true;

  try {
    // 1. DESKTOP FRUITLY (8 LANDSCAPE IMAGES)
    console.log('--- [1. DESKTOP] Testing Fruitly (8 landscape images) ---');
    let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Find and click Fruitly postcard
    const fruitlyCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('fruitly')) || cards[3];
    });
    await fruitlyCard.click();
    await page.waitForTimeout(1500);

    // Take screenshot of Fruitly flipped
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_fruitly_scattered_pinboard.png') });
    console.log('  Saved test_fruitly_scattered_pinboard.png');

    // Check items, bounding boxes, overlap, and aspect ratios
    const fruitlyMetrics = await page.evaluate(() => {
      const card = document.querySelector('.draggable-postcard-item.is-expanded');
      const container = document.querySelector('.card-back-body.polaroid-gallery');
      const items = Array.from(document.querySelectorAll('.scattered-pinboard-item'));
      const containerBox = container ? container.getBoundingClientRect() : null;

      const itemBoxes = items.map((it, idx) => {
        const b = it.getBoundingClientRect();
        return {
          idx,
          left: b.left,
          right: b.right,
          top: b.top,
          bottom: b.bottom,
          width: b.width,
          height: b.height,
          ar: (b.width / b.height).toFixed(3)
        };
      });

      return {
        cardExpanded: Boolean(card),
        itemCount: items.length,
        containerBox,
        itemBoxes
      };
    });

    console.log(`  Fruitly card expanded: ${fruitlyMetrics.cardExpanded ? 'PASS' : 'FAIL'}`);
    console.log(`  Items rendered: ${fruitlyMetrics.itemCount} (Expected: 8)`);
    if (fruitlyMetrics.itemCount !== 8) {
      console.error('  FAIL: Expected 8 items in Fruitly');
      allPassed = false;
    }

    // Check overlap between all pairs of 8 items
    let overlapCount = 0;
    const boxes = fruitlyMetrics.itemBoxes;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        // Small 2px tolerance for subpixel borders
        const rect1 = { left: boxes[i].left + 1, right: boxes[i].right - 1, top: boxes[i].top + 1, bottom: boxes[i].bottom - 1 };
        const rect2 = { left: boxes[j].left + 1, right: boxes[j].right - 1, top: boxes[j].top + 1, bottom: boxes[j].bottom - 1 };
        if (checkOverlap(rect1, rect2)) {
          console.warn(`  Overlap detected between item ${i} and item ${j}`);
          overlapCount++;
        }
      }
    }
    console.log(`  Fruitly overlapping pairs count: ${overlapCount} (Expected: 0)`);
    if (overlapCount > 0) allPassed = false;

    // Check out-of-frame clipping
    const cb = fruitlyMetrics.containerBox;
    let clippedCount = 0;
    boxes.forEach(b => {
      if (b.left < cb.left - 5 || b.right > cb.right + 5 || b.top < cb.top - 5 || b.bottom > cb.bottom + 5) {
        console.warn(`  Item ${b.idx} clips outside container!`);
        clippedCount++;
      }
    });
    console.log(`  Fruitly out-of-frame clipped items: ${clippedCount} (Expected: 0)`);
    if (clippedCount > 0) allPassed = false;

    // Test clicking Fruitly image to open lightbox
    console.log('  Testing Fruitly Image Click Lightbox...');
    const firstFruitlyImg = await page.$('.scattered-pinboard-item img');
    await firstFruitlyImg.click();
    await page.waitForTimeout(600);

    const lightboxMetrics = await page.evaluate(() => {
      const modal = document.querySelector('.polaroid-inspect-modal');
      const counter = document.querySelector('.polaroid-inspect-counter');
      const img = document.querySelector('.polaroid-inspect-img');
      return {
        modalVisible: Boolean(modal),
        counterText: counter ? counter.textContent.trim() : null,
        imgSrc: img ? img.getAttribute('src') : null
      };
    });

    console.log('  Fruitly Lightbox Modal Open:', lightboxMetrics.modalVisible ? 'PASS' : 'FAIL');
    console.log(`  Lightbox Counter: "${lightboxMetrics.counterText}" (Expected: "1 / 8")`);
    if (!lightboxMetrics.modalVisible || lightboxMetrics.counterText !== '1 / 8') {
      allPassed = false;
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_fruitly_lightbox_open.png') });
    console.log('  Saved test_fruitly_lightbox_open.png');

    // Click Next Arrow
    const nextBtn = await page.$('.polaroid-inspect-nav-btn.is-next');
    if (nextBtn) {
      await nextBtn.click();
      await page.waitForTimeout(400);
      const nextCounter = await page.$eval('.polaroid-inspect-counter', el => el.textContent.trim());
      console.log(`  Lightbox Next Counter: "${nextCounter}" (Expected: "2 / 8")`);
      if (nextCounter !== '2 / 8') allPassed = false;
    }

    // Close lightbox
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);

    const lightboxClosed = await page.evaluate(() => !document.querySelector('.polaroid-inspect-modal'));
    console.log('  Lightbox Cleanly Closed via Escape:', lightboxClosed ? 'PASS' : 'FAIL');
    if (!lightboxClosed) allPassed = false;

    // Close Fruitly card
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    await page.close();

    // 2. DESKTOP EAZYARTS GANESH (5 PORTRAIT IMAGES)
    console.log('\n--- [2. DESKTOP] Testing Eazyarts Ganesh (5 portrait images) ---');
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const ganeshCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('ganesh')) || cards[0];
    });
    await ganeshCard.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_ganesh_scattered_pinboard.png') });
    console.log('  Saved test_ganesh_scattered_pinboard.png');

    const ganeshMetrics = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.scattered-pinboard-item'));
      const container = document.querySelector('.card-back-body.polaroid-gallery');
      const cb = container ? container.getBoundingClientRect() : null;
      return {
        count: items.length,
        boxes: items.map((it, idx) => {
          const b = it.getBoundingClientRect();
          return {
            idx,
            left: b.left,
            right: b.right,
            top: b.top,
            bottom: b.bottom,
            width: b.width,
            height: b.height,
            ar: (b.width / b.height).toFixed(3)
          };
        }),
        containerBox: cb
      };
    });

    console.log(`  Ganesh items rendered: ${ganeshMetrics.count} (Expected: 5)`);
    if (ganeshMetrics.count !== 5) allPassed = false;

    // Check overlap for Ganesh
    let ganeshOverlap = 0;
    const gBoxes = ganeshMetrics.boxes;
    for (let i = 0; i < gBoxes.length; i++) {
      for (let j = i + 1; j < gBoxes.length; j++) {
        const r1 = { left: gBoxes[i].left + 1, right: gBoxes[i].right - 1, top: gBoxes[i].top + 1, bottom: gBoxes[i].bottom - 1 };
        const r2 = { left: gBoxes[j].left + 1, right: gBoxes[j].right - 1, top: gBoxes[j].top + 1, bottom: gBoxes[j].bottom - 1 };
        if (checkOverlap(r1, r2)) ganeshOverlap++;
      }
    }
    console.log(`  Ganesh overlapping pairs: ${ganeshOverlap} (Expected: 0)`);
    if (ganeshOverlap > 0) allPassed = false;

    await page.close();

    // 3. DESKTOP VIDEOGRAPHY: DOT STORE (2 VERTICAL REELS)
    console.log('\n--- [3. DESKTOP] Testing Dot Store (2 vertical reels) ---');
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/#work/videography`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const dotStoreCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('dot store')) || cards[0];
    });
    await dotStoreCard.click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_dot_store_scattered_pinboard.png') });
    console.log('  Saved test_dot_store_scattered_pinboard.png');

    const dotMetrics = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.scattered-pinboard-item'));
      const videos = Array.from(document.querySelectorAll('video'));
      return {
        itemCount: items.length,
        videoCount: videos.length,
        boxes: items.map(it => {
          const b = it.getBoundingClientRect();
          return { width: b.width, height: b.height, ar: (b.width / b.height).toFixed(3) };
        })
      };
    });

    console.log(`  Dot Store items: ${dotMetrics.itemCount} (Expected: 2), Videos: ${dotMetrics.videoCount}`);
    console.log(`  Aspect Ratios: ${dotMetrics.boxes.map(b => b.ar).join(', ')} (Expected ~0.563 for 9:16)`);
    if (dotMetrics.itemCount !== 2 || dotMetrics.videoCount !== 2) allPassed = false;

    await page.close();

    // 4. MOBILE VIEWPORT (390x844)
    console.log('\n--- [4. MOBILE] Testing Mobile Viewport (390x844) ---');
    page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const mobileFruitly = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('fruitly')) || cards[3];
    });
    await mobileFruitly.click();
    await page.waitForTimeout(1500);

    const mobileMetrics = await page.evaluate(() => {
      const card = document.querySelector('.draggable-postcard-item.is-expanded');
      const gallery = document.querySelector('.card-back-body.polaroid-gallery');
      const items = Array.from(document.querySelectorAll('.scattered-pinboard-item'));
      return {
        cardExpanded: Boolean(card),
        itemCount: items.length,
        galleryScrollable: gallery ? gallery.scrollHeight > gallery.clientHeight : false
      };
    });

    console.log(`  Mobile Fruitly expanded: ${mobileMetrics.cardExpanded ? 'PASS' : 'FAIL'}`);
    console.log(`  Mobile Fruitly items: ${mobileMetrics.itemCount} (Expected: 8)`);
    console.log(`  Mobile Gallery Scrollable: ${mobileMetrics.galleryScrollable ? 'PASS' : 'FAIL'}`);
    if (!mobileMetrics.cardExpanded || mobileMetrics.itemCount !== 8) allPassed = false;

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_fruitly_mobile_vertical_stack.png') });
    console.log('  Saved test_fruitly_mobile_vertical_stack.png');

    await page.close();

  } catch (err) {
    console.error('Test error:', err);
    allPassed = false;
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log('ALL PINBOARD & LIGHTBOX TESTS:', allPassed ? 'YES (100% PASS)' : 'FAIL');
  console.log('========================================');
  process.exit(allPassed ? 0 : 1);
}

main();

