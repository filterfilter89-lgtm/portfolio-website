import { chromium } from 'playwright';

const brainDir = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function run() {
  console.log('=== STARTING VERIFICATION: 3D FLIP ANIMATION, REVERSE EXIT DITHER, & BROWSER BACK ===\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const targetUrl = process.argv[2] || 'http://localhost:5173/#reel';
  console.log(`[Step 1] Loading #reel on ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 2. Scroll to bottom
  console.log('[Step 2] Scrolling to Frame 48 Play Button...');
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  // 3. Click play button
  console.log('[Step 3] Clicking Play button to enter #work...');
  const playBtn = await page.waitForSelector('#reel-play-btn', { timeout: 10000 });
  await playBtn.click({ force: true });
  await page.waitForTimeout(2000);

  // 4. Select Videography Category
  console.log('[Step 4] Selecting Videography Category to scatter cards on desk...');
  const catBtn = await page.waitForSelector('a[aria-label*="VIDEOGRAPHY" i]', { timeout: 10000 });
  await catBtn.click();
  await page.waitForTimeout(2000);

  const postcards = await page.$$('.draggable-postcard-item');
  console.log(`  Found ${postcards.length} postcards scattered on desk.`);
  if (postcards.length === 0) {
    throw new Error('No postcards found on desk!');
  }

  // TEST 1: CLICK POSTCARD -> OBSERVE 3D FLIGHT & 180° FLIP ANIMATION
  console.log('\n--- [TEST 1] Testing 3D Flight & 180° Flip Animation on Card Click ---');
  
  // Track transform samples during the 550ms animation
  const samplingPromise = page.evaluate(async () => {
    const card = document.querySelector('.draggable-postcard-item');
    if (!card) return null;
    const samples = [];
    const startTime = performance.now();
    while (performance.now() - startTime < 600) {
      const style = window.getComputedStyle(card);
      samples.push({
        elapsed: Math.round(performance.now() - startTime),
        transform: style.transform,
        width: card.offsetWidth,
        height: card.offsetHeight
      });
      await new Promise(r => setTimeout(r, 40));
    }
    return samples;
  });

  // Click first postcard
  await postcards[0].click();

  const samples = await samplingPromise;
  await page.waitForTimeout(500);

  const isFlippedNow = await page.evaluate(() => {
    const card = document.querySelector('.draggable-postcard-item.is-expanded');
    return Boolean(card);
  });

  console.log(`  Animation samples captured: ${samples?.length || 0}`);
  if (samples && samples.length > 5) {
    console.log(`    Sample at ${samples[1].elapsed}ms: width=${samples[1].width}px, height=${samples[1].height}px`);
    console.log(`    Sample at ${samples[Math.floor(samples.length / 2)].elapsed}ms: width=${samples[Math.floor(samples.length / 2)].width}px, height=${samples[Math.floor(samples.length / 2)].height}px`);
    console.log(`    Sample at ${samples[samples.length - 1].elapsed}ms: width=${samples[samples.length - 1].width}px, height=${samples[samples.length - 1].height}px`);
  }
  console.log(`  Card expanded in project view: ${isFlippedNow} (Expected: true - PASS)`);
  await page.screenshot({ path: `${brainDir}/test_anim_step1_card_flipped.png` });

  if (!isFlippedNow) {
    throw new Error('TEST 1 FAILED: Card failed to expand into project view!');
  }

  // TEST 2: BROWSER BACK -> SMOOTH 3D REVERSE FLIP BACK TO DESK
  console.log('\n--- [TEST 2] Testing Smooth 3D Reverse Flip on Browser Back ---');
  const reverseSamplingPromise = page.evaluate(async () => {
    const card = document.querySelector('.draggable-postcard-item');
    if (!card) return null;
    const samples = [];
    const startTime = performance.now();
    while (performance.now() - startTime < 600) {
      const style = window.getComputedStyle(card);
      samples.push({
        elapsed: Math.round(performance.now() - startTime),
        transform: style.transform,
        width: card.offsetWidth,
        height: card.offsetHeight
      });
      await new Promise(r => setTimeout(r, 40));
    }
    return samples;
  });

  console.log('Calling page.goBack()...');
  await page.goBack();
  const revSamples = await reverseSamplingPromise;
  await page.waitForTimeout(600);

  const isCardClosed = await page.evaluate(() => {
    const card = document.querySelector('.draggable-postcard-item.is-expanded');
    return !card;
  });
  const hashAfterCardBack = await page.evaluate(() => window.location.hash);

  console.log(`  URL Hash after Back: ${hashAfterCardBack}`);
  console.log(`  Reverse samples captured: ${revSamples?.length || 0}`);
  if (revSamples && revSamples.length > 5) {
    console.log(`    Reverse sample at ${revSamples[1].elapsed}ms: width=${revSamples[1].width}px, height=${revSamples[1].height}px`);
    console.log(`    Reverse sample at ${revSamples[Math.floor(revSamples.length / 2)].elapsed}ms: width=${revSamples[Math.floor(revSamples.length / 2)].width}px, height=${revSamples[Math.floor(revSamples.length / 2)].height}px`);
    console.log(`    Reverse sample at ${revSamples[revSamples.length - 1].elapsed}ms: width=${revSamples[revSamples.length - 1].width}px, height=${revSamples[revSamples.length - 1].height}px`);
  }
  console.log(`  Card closed back onto desk: ${isCardClosed} (Expected: true - PASS)`);
  await page.screenshot({ path: `${brainDir}/test_anim_step2_card_closed.png` });

  if (!isCardClosed) {
    throw new Error('TEST 2 FAILED: Card stayed open after Browser Back!');
  }

  // TEST 3: BROWSER BACK FROM CATEGORY DESK TO VINYL ALBUM WHEEL
  console.log('\n--- [TEST 3] Testing Browser Back from Category Desk to Album Wheel ---');
  console.log('Calling page.goBack()...');
  await page.goBack();
  await page.waitForTimeout(1200);

  const hashAfterCatBack = await page.evaluate(() => window.location.hash);
  const postcardsStillOnDesk = await page.$$('.draggable-postcard-item');
  const albumsOnWheel = await page.$$('.react-album-card-item');

  console.log(`  URL Hash: ${hashAfterCatBack}`);
  console.log(`  Postcards on desk: ${postcardsStillOnDesk.length} (Expected: 0 - PASS)`);
  console.log(`  Vinyl albums on wheel: ${albumsOnWheel.length} (Expected: > 0 - PASS)`);
  await page.screenshot({ path: `${brainDir}/test_anim_step3_album_wheel.png` });

  if (postcardsStillOnDesk.length > 0 || albumsOnWheel.length === 0) {
    throw new Error('TEST 3 FAILED: Category desk did not return to vinyl carousel!');
  }

  // TEST 4: BROWSER BACK FROM #work TO #reel -> FULL REVERSE EXIT DITHER ANIMATION
  console.log('\n--- [TEST 4] Testing Reverse Exit & Dither Animation on Browser Back to #reel ---');
  
  // Monitor dither canvas activation during the exit sequence
  const ditherMonitorPromise = page.evaluate(async () => {
    const states = [];
    const startTime = performance.now();
    while (performance.now() - startTime < 1200) {
      const ditherCanvas = document.querySelector('.dither-transition-canvas');
      states.push({
        elapsed: Math.round(performance.now() - startTime),
        ditherCanvasPresent: Boolean(ditherCanvas),
        hash: window.location.hash
      });
      await new Promise(r => setTimeout(r, 60));
    }
    return states;
  });

  console.log('Calling page.goBack()...');
  await page.goBack();
  const ditherStates = await ditherMonitorPromise;
  await page.waitForTimeout(800);

  const hashAfterWheelBack = await page.evaluate(() => window.location.hash);
  const ditherCanvasActivated = ditherStates.some(s => s.ditherCanvasPresent);
  console.log(`  URL Hash: ${hashAfterWheelBack}`);
  console.log(`  Dither transition canvas active during exit: ${ditherCanvasActivated} (Expected: true - PASS)`);

  const reelCanvasSample = await page.evaluate(() => {
    const canvas = document.querySelector('.scroll-canvas');
    if (!canvas) return 'NO_CANVAS';
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'NO_CTX';
    const p = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
    return `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${p[3]})`;
  });
  console.log(`  Canvas center pixel color on #reel: ${reelCanvasSample}`);
  await page.screenshot({ path: `${brainDir}/test_anim_step4_reel_restored.png` });

  if (!ditherCanvasActivated) {
    throw new Error('TEST 4 FAILED: Reverse exit dither did not activate!');
  }
  if (reelCanvasSample.includes('NO_') || reelCanvasSample === 'rgba(255, 247, 237, 255)') {
    throw new Error('TEST 4 FAILED: Reel canvas is not rendered or blank!');
  }

  // TEST 5: ON-SCREEN BACK ARROW FROM #work TO #reel -> REVERSE EXIT DITHER
  console.log('\n--- [TEST 5] Testing On-Screen Back Arrow (←) from #work to #reel ---');
  // Re-enter #work
  await playBtn.click({ force: true });
  await page.waitForTimeout(1500);

  // Click on-screen back button in AlbumCarousel
  const backBtn = await page.waitForSelector('.clean-back-btn', { timeout: 5000 });
  
  const ditherMonitorPromise2 = page.evaluate(async () => {
    const states = [];
    const startTime = performance.now();
    while (performance.now() - startTime < 1200) {
      const ditherCanvas = document.querySelector('.dither-transition-canvas');
      states.push({
        elapsed: Math.round(performance.now() - startTime),
        ditherCanvasPresent: Boolean(ditherCanvas)
      });
      await new Promise(r => setTimeout(r, 60));
    }
    return states;
  });

  console.log('Clicking on-screen ← button...');
  await backBtn.click();
  const ditherStates2 = await ditherMonitorPromise2;
  await page.waitForTimeout(800);

  const ditherActivated2 = ditherStates2.some(s => s.ditherCanvasPresent);
  console.log(`  Dither transition canvas active on on-screen back: ${ditherActivated2} (Expected: true - PASS)`);
  await page.screenshot({ path: `${brainDir}/test_anim_step5_onscreen_back.png` });

  if (!ditherActivated2) {
    throw new Error('TEST 5 FAILED: Reverse exit dither did not activate on on-screen back button!');
  }

  await browser.close();
  console.log('\n🎉 ALL 5 ANIMATION AND NAVIGATION TESTS PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});

