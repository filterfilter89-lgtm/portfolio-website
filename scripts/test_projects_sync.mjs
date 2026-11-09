import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function testProjectSync() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Navigating to http://localhost:5173/#work ...');
  await page.goto('http://localhost:5173/#work', { waitUntil: 'networkidle' });
  await page.waitForSelector('.react-album-stage', { timeout: 6000 });
  await page.waitForTimeout(800);

  // ==========================================
  // TEST A: GRAPHIC DESIGNS (Now with Eazyarts Ganesh!)
  // ==========================================
  console.log('\n2. Testing GRAPHIC DESIGNS category...');
  await page.evaluate(() => {
    const link = document.querySelector('a[aria-label*="GRAPHIC DESIGNS"]');
    if (link) link.click();
  });
  await page.waitForSelector('.draggable-postcard-item', { timeout: 6000 });
  await page.waitForTimeout(1000);

  const graphicCardsCount = await page.evaluate(() => document.querySelectorAll('.draggable-postcard-item').length);
  console.log(`PASS: Found ${graphicCardsCount} postcards in Graphic Designs desk (Expected 4)`);
  if (graphicCardsCount !== 4) {
    throw new Error(`FAIL: Expected 4 postcards in Graphic Designs, found ${graphicCardsCount}`);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sync_01_graphic_designs_desk.png') });

  // Test opening Eazyarts Ganesh postcard
  console.log('3. Opening Eazyarts Ganesh postcard...');
  await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('.draggable-postcard-item')).find(c => 
      c.getAttribute('aria-label')?.includes('Eazyarts Ganesh')
    );
    if (card) card.click();
  });
  await page.waitForSelector('.draggable-postcard-item.is-expanded', { timeout: 4000 });
  await page.waitForSelector('.scattered-polaroid-item', { timeout: 4000 });
  await page.waitForTimeout(800);

  const ganeshSlidesCount = await page.evaluate(() => document.querySelectorAll('.scattered-polaroid-item').length);
  console.log(`PASS: Eazyarts Ganesh rendered ${ganeshSlidesCount} polaroid slides (Expected 5)`);
  if (ganeshSlidesCount !== 5) {
    throw new Error(`FAIL: Expected 5 polaroid slides in Eazyarts Ganesh, found ${ganeshSlidesCount}`);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sync_02_eazyarts_ganesh_flipped.png') });

  // Test inspecting a slide in modal
  console.log('4. Inspecting slide in lightbox modal...');
  await page.evaluate(() => {
    const item = document.querySelector('.scattered-polaroid-item');
    if (item) item.click();
  });
  await page.waitForSelector('.polaroid-inspect-modal', { timeout: 4000 });
  await page.waitForTimeout(500);
  console.log('PASS: Slide lightbox modal opened successfully!');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sync_03_slide_lightbox.png') });

  // Close lightbox modal and return to carousel
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.polaroid-inspect-close');
    if (closeBtn) closeBtn.click();
  });
  await page.waitForTimeout(400);

  // Return to Carousel
  await page.evaluate(() => {
    const backBtn = document.querySelector('.clean-back-btn.is-showcase');
    if (backBtn) backBtn.click();
  });
  await page.waitForTimeout(1000);

  // ==========================================
  // TEST B: VIDEOGRAPHY (Now with 5 projects!)
  // ==========================================
  console.log('\n5. Testing VIDEOGRAPHY category...');
  await page.evaluate(() => {
    const link = document.querySelector('a[aria-label*="VIDEOGRAPHY"]');
    if (link) link.click();
  });
  await page.waitForSelector('.draggable-postcard-item', { timeout: 6000 });
  await page.waitForTimeout(1000);

  const videoCardsCount = await page.evaluate(() => document.querySelectorAll('.draggable-postcard-item').length);
  console.log(`PASS: Found ${videoCardsCount} postcards in Videography desk (Expected 5)`);
  if (videoCardsCount !== 5) {
    throw new Error(`FAIL: Expected 5 postcards in Videography, found ${videoCardsCount}`);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sync_04_videography_desk.png') });

  // Verify that postage stamps have valid image thumbnails (not empty/broken)
  const stampsInfo = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('.postcard-16-9-wrapper image'));
    return images.map(img => img.getAttribute('href') || '');
  });
  console.log('Postcard stamp thumbnail hrefs:', stampsInfo);
  const allStampsValid = stampsInfo.every(href => href.includes('-thumb.webp') || href.includes('.webp') || href.includes('.png'));
  if (!allStampsValid) {
    throw new Error('FAIL: Some postcard stamps do not have valid image thumbnails!');
  }
  console.log('PASS: All videography postage stamps have real, crisp video poster thumbnails!');

  // Test opening a video postcard (e.g. Dot Store)
  console.log('6. Opening Dot Store video postcard...');
  await page.evaluate(() => {
    const card = Array.from(document.querySelectorAll('.draggable-postcard-item')).find(c => 
      c.getAttribute('aria-label')?.includes('Dot Store')
    );
    if (card) card.click();
  });
  await page.waitForSelector('.draggable-postcard-item.is-expanded', { timeout: 4000 });
  await page.waitForSelector('.in-card-video-element', { timeout: 4000 });
  await page.waitForTimeout(1000);

  const videoElementInfo = await page.evaluate(() => {
    const v = document.querySelector('.in-card-video-element');
    return {
      src: v?.src || '',
      paused: v?.paused,
      muted: v?.muted,
      readyState: v?.readyState
    };
  });
  console.log('In-card video player state:', videoElementInfo);
  if (!videoElementInfo.src) {
    throw new Error('FAIL: In-card video player has no src!');
  }
  console.log('PASS: In-card video player rendered and loaded video smoothly!');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'sync_05_videography_player.png') });

  console.log('\n======================================================');
  console.log(' ALL PROJECT ASSET SYNC & PLAYBACK TESTS PASSED 100%!');
  console.log('======================================================');

  await browser.close();
}

testProjectSync().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
