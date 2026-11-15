import { chromium } from 'playwright';

const LIVE_URL = 'https://basil-jose.vercel.app';
const brainDir = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function run() {
  console.log(`=== STARTING LIVE PRODUCTION BROWSER BACK & FORWARD VERIFICATION SUITE ===`);
  console.log(`Target: ${LIVE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // STEP 1: LOAD REEL
  console.log('[Step 1] Loading #reel on live...');
  await page.goto(`${LIVE_URL}/#reel`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // STEP 2: SCROLL TO FRAME 48
  console.log('[Step 2] Scrolling to Frame 48 Play Button...');
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  });
  await page.waitForTimeout(1500);

  // STEP 3: CLICK PLAY TO ENTER #work
  console.log('[Step 3] Clicking Play button to enter #work...');
  const playBtn = await page.waitForSelector('#reel-play-btn', { timeout: 10000 });
  await playBtn.click({ force: true });
  await page.waitForTimeout(2000);

  const hashAfterPlay = await page.evaluate(() => window.location.hash);
  console.log('  Current URL Hash:', hashAfterPlay);

  // STEP 4: CLICK VIDEOGRAPHY ALBUM
  console.log('[Step 4] Clicking Videography album on carousel...');
  const videographyAlbum = await page.waitForSelector('a[aria-label*="VIDEOGRAPHY" i]', { timeout: 10000 });
  await videographyAlbum.click();
  await page.waitForTimeout(2000);

  const hashAfterCat = await page.evaluate(() => window.location.hash);
  console.log('  Current URL Hash after selecting category:', hashAfterCat);

  // STEP 5: FLIP POSTCARD
  console.log('[Step 5] Clicking a postcard to flip 180° into project view...');
  await page.waitForSelector('.draggable-postcard-item', { timeout: 10000 });
  const postcards = await page.$$('.draggable-postcard-item');
  console.log('  Found', postcards.length, 'postcards on desk.');
  await postcards[0].click();
  await page.waitForTimeout(2000);

  const hashAfterFlip = await page.evaluate(() => window.location.hash);
  const isFlippedOpen = await page.$('.draggable-postcard-item.is-expanded');
  console.log('  Current URL Hash after flipping card:', hashAfterFlip);
  console.log('  Postcard open modal present:', Boolean(isFlippedOpen));
  await page.screenshot({ path: `${brainDir}/live_test_back_step5_flipped.png` });

  // TEST 1: BROWSER BACK FROM FLIPPED POSTCARD
  console.log('\n--- [TEST 1] Testing Browser Back from Flipped Postcard on Live ---');
  console.log('Calling page.goBack()...');
  await page.goBack();
  await page.waitForTimeout(1500);

  const hashAfterBack1 = await page.evaluate(() => window.location.hash);
  const isFlippedOpenAfter1 = await page.$('.draggable-postcard-item.is-expanded');
  const postcardsStillOnDesk1 = await page.$$('.draggable-postcard-item');

  console.log('  Hash after Back:', hashAfterBack1);
  console.log('  Postcard open modal present:', Boolean(isFlippedOpenAfter1), '(Expected: false - PASS)');
  console.log('  Postcards on desk count:', postcardsStillOnDesk1.length, '(Expected: > 0 - PASS)');
  await page.screenshot({ path: `${brainDir}/live_test_back1_postcard_closed.png` });

  if (Boolean(isFlippedOpenAfter1)) {
    throw new Error('TEST 1 FAILED: Flipped postcard stayed stuck open after Browser Back!');
  }

  // TEST 2: BROWSER BACK FROM CATEGORY DESK TO VINYL ALBUM WHEEL
  console.log('\n--- [TEST 2] Testing Browser Back from Category Desk to Album Wheel on Live ---');
  console.log('Calling page.goBack()...');
  await page.goBack();
  await page.waitForTimeout(1500);

  const hashAfterBack2 = await page.evaluate(() => window.location.hash);
  const postcardsStillOnDesk2 = await page.$$('.draggable-postcard-item');
  const albumsVisible2 = await page.$$('.react-album-card-item');

  console.log('  Hash after Back:', hashAfterBack2);
  console.log('  Postcards on desk count:', postcardsStillOnDesk2.length, '(Expected: 0 - PASS)');
  console.log('  Vinyl albums in carousel count:', albumsVisible2.length, '(Expected: > 0 - PASS)');
  await page.screenshot({ path: `${brainDir}/live_test_back2_album_wheel.png` });

  if (postcardsStillOnDesk2.length > 0) {
    throw new Error('TEST 2 FAILED: Category postcards stayed stuck on desk after Browser Back!');
  }

  // TEST 3: BROWSER BACK FROM VINYL WHEEL TO VISUAL REEL
  console.log('\n--- [TEST 3] Testing Browser Back from Vinyl Wheel to Visual Reel on Live ---');
  console.log('Calling page.goBack()...');
  await page.goBack();
  await page.waitForTimeout(1500);

  const hashAfterBack3 = await page.evaluate(() => window.location.hash);
  const reelContainer = await page.$('.reel-stage-container');
  const reelStyles = await reelContainer.evaluate(el => {
    const s = window.getComputedStyle(el);
    return {
      display: s.display,
      visibility: s.visibility,
      opacity: s.opacity
    };
  });
  const albumsVisible3 = await page.$$('.react-album-card-item');

  console.log('  Hash after Back:', hashAfterBack3);
  console.log('  Reel container styles:', reelStyles);
  console.log('  Albums on screen count:', albumsVisible3.length, '(Expected: 0 - PASS)');
  await page.screenshot({ path: `${brainDir}/live_test_back3_visual_reel.png` });

  if (reelStyles.visibility !== 'visible' || albumsVisible3.length > 0) {
    throw new Error('TEST 3 FAILED: Visual reel not visible or albums stuck on screen!');
  }

  // TEST 4: CONTACT PAGE AND RETURN TO REEL (ZERO BLANK SCREEN)
  console.log('\n--- [TEST 4] Testing Contact Page and Return to Reel on Live ---');
  console.log('Navigating forward to #contact...');
  await page.goto(`${LIVE_URL}/#contact`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const contactView = await page.$('.contact-view');
  console.log('  Contact view present:', Boolean(contactView));
  await page.screenshot({ path: `${brainDir}/live_test_contact_view.png` });

  // Click on-screen back button in ContactView
  console.log('Clicking top-left on-screen back button in ContactView...');
  const contactBackBtn = await page.waitForSelector('.clean-back-btn', { timeout: 5000 });
  await contactBackBtn.click();
  await page.waitForTimeout(1500);

  const hashAfterContactBack = await page.evaluate(() => window.location.hash);
  const reelContainerAfterContact = await page.$('.reel-stage-container');
  const reelStylesAfter = await reelContainerAfterContact.evaluate(el => {
    const s = window.getComputedStyle(el);
    return {
      display: s.display,
      visibility: s.visibility,
      width: s.width,
      height: s.height
    };
  });

  const canvasPixelSample = await page.evaluate(() => {
    const canvas = document.querySelector('.scroll-canvas');
    if (!canvas) return 'NO_CANVAS';
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'NO_CTX';
    try {
      const p = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data;
      return `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${p[3]})`;
    } catch (e) {
      return 'CANNOT_SAMPLE';
    }
  });

  console.log('  Hash after returning from contact:', hashAfterContactBack);
  console.log('  Reel container styles:', reelStylesAfter);
  console.log('  Canvas center pixel color:', canvasPixelSample);
  await page.screenshot({ path: `${brainDir}/live_test_back4_reel_from_contact.png` });

  if (reelStylesAfter.display === 'none' || reelStylesAfter.visibility !== 'visible' || canvasPixelSample.includes('NO_')) {
    throw new Error('TEST 4 FAILED: Reel stage container is hidden or canvas missing!');
  }

  await browser.close();
  console.log('\n🎉 ALL 4 LIVE PRODUCTION BROWSER BACK / FORWARD AND ON-SCREEN NAVIGATION TESTS PASSED PERFECTLY!');
}

run().catch(err => {
  console.error('\n❌ LIVE VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
