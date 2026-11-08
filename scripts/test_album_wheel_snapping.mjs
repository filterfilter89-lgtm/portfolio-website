import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function testWheelSnapping() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/#work ...');
  await page.goto('http://localhost:5173/#work', { waitUntil: 'networkidle' });
  await page.waitForSelector('.react-album-stage', { timeout: 6000 });
  await page.waitForTimeout(1000); // Allow entrance animation

  // Measure initial state
  const getCarouselState = async () => {
    return await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.react-album-card-item'));
      const windowCenter = window.innerWidth / 2;
      let minDistance = Infinity;
      let centerCard = null;
      let centerTitle = '';

      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - windowCenter);
        if (dist < minDistance) {
          minDistance = dist;
          centerCard = r;
          const titleEl = card.querySelector('figcaption') || card.querySelector('a');
          centerTitle = titleEl ? (titleEl.innerText || titleEl.getAttribute('aria-label') || '') : '';
        }
      });

      return {
        centerCardDistFromScreenCenter: Math.round(minDistance * 10) / 10,
        centerTitle: centerTitle.split('-')[0].trim(),
        totalCards: cards.length
      };
    });
  };

  const initial = await getCarouselState();
  console.log('1. Initial Carousel State:', initial);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'wheel_snap_01_initial.png') });

  // TEST 1: Single scroll down notch (deltaY = 100)
  console.log('\n2. Simulating single mouse wheel down scroll (deltaY = 100)...');
  await page.mouse.move(960, 540);
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(700); // Wait for smooth lerp settle

  const afterScroll1 = await getCarouselState();
  console.log('State after 1st scroll down:', afterScroll1);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'wheel_snap_02_scroll_down_1.png') });

  if (afterScroll1.centerTitle === initial.centerTitle) {
    throw new Error(`FAIL: Single scroll did not advance to next album! Still on ${initial.centerTitle}`);
  }
  if (afterScroll1.centerCardDistFromScreenCenter > 2) {
    throw new Error(`FAIL: Album is not centered! Offset: ${afterScroll1.centerCardDistFromScreenCenter}px`);
  }
  console.log(`PASS: Advanced from ${initial.centerTitle} -> ${afterScroll1.centerTitle} with perfect snap (offset: ${afterScroll1.centerCardDistFromScreenCenter}px)`);

  // TEST 2: Second scroll down notch
  console.log('\n3. Simulating 2nd mouse wheel down scroll (deltaY = 100)...');
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(700);

  const afterScroll2 = await getCarouselState();
  console.log('State after 2nd scroll down:', afterScroll2);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'wheel_snap_03_scroll_down_2.png') });

  if (afterScroll2.centerTitle === afterScroll1.centerTitle) {
    throw new Error(`FAIL: Second scroll did not advance to next album! Still on ${afterScroll1.centerTitle}`);
  }
  if (afterScroll2.centerCardDistFromScreenCenter > 2) {
    throw new Error(`FAIL: Album is not centered! Offset: ${afterScroll2.centerCardDistFromScreenCenter}px`);
  }
  console.log(`PASS: Advanced from ${afterScroll1.centerTitle} -> ${afterScroll2.centerTitle} with perfect snap (offset: ${afterScroll2.centerCardDistFromScreenCenter}px)`);

  // TEST 3: Reverse scroll (scroll UP 1 notch)
  console.log('\n4. Simulating mouse wheel UP scroll (deltaY = -100)...');
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(700);

  const afterScrollUp = await getCarouselState();
  console.log('State after scroll UP:', afterScrollUp);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'wheel_snap_04_scroll_up.png') });

  if (afterScrollUp.centerTitle !== afterScroll1.centerTitle) {
    throw new Error(`FAIL: Scroll up did not return to previous album ${afterScroll1.centerTitle}, got ${afterScrollUp.centerTitle}`);
  }
  if (afterScrollUp.centerCardDistFromScreenCenter > 2) {
    throw new Error(`FAIL: Album is not centered! Offset: ${afterScrollUp.centerCardDistFromScreenCenter}px`);
  }
  console.log(`PASS: Reversed cleanly back to ${afterScrollUp.centerTitle} with perfect snap`);

  // TEST 4: Trackpad simulation (multiple small rapid deltas)
  console.log('\n5. Simulating trackpad swipe gesture (small continuous delta bursts)...');
  await page.mouse.wheel(0, 15);
  await page.waitForTimeout(20);
  await page.mouse.wheel(0, 25);
  await page.waitForTimeout(20);
  await page.mouse.wheel(0, 30);
  await page.waitForTimeout(20);
  await page.mouse.wheel(0, 10);
  await page.waitForTimeout(700);

  const afterTrackpad = await getCarouselState();
  console.log('State after trackpad swipe:', afterTrackpad);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'wheel_snap_05_trackpad.png') });

  if (afterTrackpad.centerTitle !== afterScroll2.centerTitle) {
    throw new Error(`FAIL: Trackpad swipe expected ${afterScroll2.centerTitle}, got ${afterTrackpad.centerTitle}`);
  }
  if (afterTrackpad.centerCardDistFromScreenCenter > 2) {
    throw new Error(`FAIL: Trackpad album not centered! Offset: ${afterTrackpad.centerCardDistFromScreenCenter}px`);
  }
  console.log(`PASS: Trackpad swipe stepped cleanly to ${afterTrackpad.centerTitle} without multiple runaway spins!`);

  // TEST 5: Verify Clicking an Album still works seamlessly
  console.log('\n6. Testing clicking the centered album card to open postcard desk...');
  await page.evaluate(() => {
    const link = document.querySelector('a[aria-label*="GRAPHIC DESIGNS"]');
    if (link) link.click();
  });
  await page.waitForSelector('.draggable-postcard-item', { timeout: 8000 });
  await page.waitForTimeout(1000);

  const postcardsCount = await page.evaluate(() => document.querySelectorAll('.draggable-postcard-item').length);
  console.log(`PASS: Postcards emerged successfully (${postcardsCount} postcards mounted)!`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'wheel_snap_06_postcards_open.png') });

  console.log('\n======================================================');
  console.log(' ALL ALBUM WHEEL SCROLL & SNAPPING TESTS PASSED 100%!');
  console.log('======================================================');

  await browser.close();
}

testWheelSnapping().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
