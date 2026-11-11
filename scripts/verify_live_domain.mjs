import { chromium } from 'playwright';

const chromePath = 'C:/Users/basil/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const LIVE_URL = 'https://basil-jose.vercel.app';
const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function verifyLive() {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const report = [];

  console.log(`=== STARTING DIRECT VERIFICATION OF LIVE PRODUCTION DOMAIN ===`);
  console.log(`Target: ${LIVE_URL}\n`);

  // 1. Desktop Landing Page - Centered Scroll Instruction
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${LIVE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const indicator = page.locator('.hero-scroll-instruction');
    const isVisible = await indicator.isVisible();
    const box = await indicator.boundingBox();
    const centerX = box.x + box.width / 2;
    const diff = Math.abs(centerX - 720);

    report.push({
      test: 'LIVE Desktop Scroll Indicator Centered',
      passed: isVisible && diff < 10,
      details: `Visible: ${isVisible}, CenterX: ${centerX}px (Screen 720px, diff: ${diff.toFixed(1)}px)`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/live_verified_desktop_landing.png` });
    await page.close();
  }

  // 2. Mobile Landing Page - BASIL JOSE Removal & Centered Scroll
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${LIVE_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const mobileName = page.locator('.hero-flapstick-mobile-bottom');
    const nameVisible = await mobileName.isVisible().catch(() => false);

    const indicator = page.locator('.hero-scroll-instruction');
    const indVisible = await indicator.isVisible();
    const box = await indicator.boundingBox();
    const centerX = box.x + box.width / 2;
    const diff = Math.abs(centerX - 195);

    report.push({
      test: 'LIVE Mobile Landing Page: BASIL JOSE Removed',
      passed: !nameVisible,
      details: `BASIL JOSE bottom text visible: ${nameVisible}`
    });

    report.push({
      test: 'LIVE Mobile Landing Page: Scroll Indicator Centered',
      passed: indVisible && diff < 10,
      details: `Visible: ${indVisible}, CenterX: ${centerX}px (Screen 195px, diff: ${diff.toFixed(1)}px)`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/live_verified_mobile_landing.png` });
    await page.close();
  }

  // 3. Morphing Hamburger Navigation Pill (Desktop & Mobile)
  {
    // Desktop Morph
    const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesk.goto(`${LIVE_URL}/`, { waitUntil: 'networkidle' });
    await pageDesk.waitForTimeout(1000);

    const pillDesk = pageDesk.locator('.nav-morph-pill');
    const closedDeskBox = await pillDesk.boundingBox();
    const closedDeskRadius = await pillDesk.evaluate(el => window.getComputedStyle(el).borderRadius);

    const toggleDesk = pageDesk.locator('.nav-morph-toggle');
    await toggleDesk.click();
    await pageDesk.waitForTimeout(600);

    const openDeskBox = await pillDesk.boundingBox();
    const openDeskRadius = await pillDesk.evaluate(el => window.getComputedStyle(el).borderRadius);
    const isHorizontalDesk = openDeskBox.width >= 340 && openDeskBox.height <= 50;
    const curvatureDeskMatches = openDeskRadius === '22px' && closedDeskRadius === '22px';

    const deskLinks = await pageDesk.locator('.nav-morph-link').allInnerTexts();
    const expected = ['REEL', 'WORK', 'CONTACT', 'RESUME'];
    const exactLinksDesk = deskLinks.length === 4 && deskLinks.every((t, i) => t.trim() === expected[i]);

    const allDeskText = await pillDesk.innerText();
    const deskWords = allDeskText.split(/\s+/).filter(w => w.length > 0);
    const zeroExtraText = deskWords.length === 4 && deskWords.every((w, i) => w === expected[i]);

    report.push({
      test: 'LIVE Desktop Menu Morphs into Horizontal Rectangle with Matching Curvature',
      passed: isHorizontalDesk && curvatureDeskMatches,
      details: `Width: ${openDeskBox.width}px, Height: ${openDeskBox.height}px, Radius: ${openDeskRadius}`
    });

    report.push({
      test: 'LIVE Desktop Menu Displays ONLY 4 Text Items (REEL, WORK, CONTACT, RESUME)',
      passed: exactLinksDesk && zeroExtraText,
      details: `Words inside menu: [${deskWords.join(', ')}]`
    });

    await pageDesk.screenshot({ path: `${ARTIFACT_DIR}/live_verified_desktop_morph_menu.png` });
    await pageDesk.close();

    // Mobile Morph
    const pageMob = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await pageMob.goto(`${LIVE_URL}/`, { waitUntil: 'networkidle' });
    await pageMob.waitForTimeout(1000);

    const pillMob = pageMob.locator('.nav-morph-pill');
    const toggleMob = pageMob.locator('.nav-morph-toggle');
    await toggleMob.click();
    await pageMob.waitForTimeout(600);

    const openMobBox = await pillMob.boundingBox();
    const openMobRadius = await pillMob.evaluate(el => window.getComputedStyle(el).borderRadius);
    const isHorizontalMob = openMobBox.width >= 300 && openMobBox.height <= 50;

    const mobLinks = await pageMob.locator('.nav-morph-link').allInnerTexts();
    const exactLinksMob = mobLinks.length === 4 && mobLinks.every((t, i) => t.trim() === expected[i]);

    report.push({
      test: 'LIVE Mobile Menu Morphs into Horizontal Rectangle with Matching Curvature',
      passed: isHorizontalMob && openMobRadius === '22px',
      details: `Width: ${openMobBox.width}px, Height: ${openMobBox.height}px, Radius: ${openMobRadius}`
    });

    report.push({
      test: 'LIVE Mobile Menu Displays ONLY 4 Text Items',
      passed: exactLinksMob,
      details: `Words inside menu: [${mobLinks.join(', ')}]`
    });

    await pageMob.screenshot({ path: `${ARTIFACT_DIR}/live_verified_mobile_morph_menu.png` });
    await pageMob.close();
  }

  // 4. Mobile Postcards Prominent Sizing & Vertical Flip
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${LIVE_URL}/work.html#work/videography`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const cards = page.locator('.draggable-postcard-item');
    const firstBox = await cards.first().boundingBox();
    const isProminent = firstBox.width >= 270;

    report.push({
      test: 'LIVE Mobile Postcard Restored Prominence',
      passed: isProminent,
      details: `Resting Width: ${firstBox.width.toFixed(1)}px, Height: ${firstBox.height.toFixed(1)}px`
    });

    // Flip first card (Dot Store)
    await cards.first().click();
    await page.waitForTimeout(1500);

    const expCard = page.locator('.draggable-postcard-item.is-expanded');
    const expBox = await expCard.boundingBox();
    const isVertical = expBox.height > expBox.width && expBox.height >= 550;

    report.push({
      test: 'LIVE Mobile Postcard Vertical Flip Orientation',
      passed: isVertical,
      details: `Width: ${expBox.width.toFixed(1)}px, Height: ${expBox.height.toFixed(1)}px (Portrait: ${expBox.height > expBox.width})`
    });

    // Video aspect ratio
    const wells = page.locator('.scattered-photo-well');
    const wellCount = await wells.count();
    let arOk = true;
    for (let i = 0; i < wellCount; i++) {
      const size = await wells.nth(i).evaluate((el) => ({
        width: el.offsetWidth || el.clientWidth,
        height: el.offsetHeight || el.clientHeight
      }));
      const ar = size.width / size.height;
      if (Math.abs(ar - 0.5625) > 0.05) arOk = false;
    }

    report.push({
      test: 'LIVE Mobile Video Exact 9:16 Aspect Ratio',
      passed: arOk && wellCount === 2,
      details: `Well count: ${wellCount}, All exact 9:16: ${arOk}`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/live_verified_mobile_vertical_flip.png` });

    // Test back button return navigation
    const backBtn = page.locator('.clean-back-btn.is-showcase');
    await backBtn.click();
    await page.waitForTimeout(1000);

    const isClosed = !(await page.locator('.draggable-postcard-item.is-expanded').isVisible().catch(() => false));
    report.push({
      test: 'LIVE Return Navigation via Back Arrow',
      passed: isClosed,
      details: `Card cleanly returned to rest: ${isClosed}`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/live_verified_mobile_returned_to_rest.png` });
    await page.close();
  }

  // 5. Desktop Graphic Designs - Fruitly 16:9 Aspect Ratio Preservation
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${LIVE_URL}/work.html#work/graphic-designs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Fruitly is 4th card (index 3)
    const fruitlyCard = page.locator('.draggable-postcard-item').nth(3);
    await fruitlyCard.click();
    await page.waitForTimeout(1500);

    const wells = page.locator('.scattered-photo-well');
    const count = await wells.count();
    let all169 = true;
    for (let i = 0; i < count; i++) {
      const size = await wells.nth(i).evaluate((el) => ({
        width: el.offsetWidth || el.clientWidth,
        height: el.offsetHeight || el.clientHeight
      }));
      const ar = size.width / size.height;
      if (Math.abs(ar - 1.7778) > 0.05) all169 = false;
    }

    report.push({
      test: 'LIVE Desktop Fruitly 16:9 Aspect Ratio Preservation',
      passed: all169 && count === 8,
      details: `Count: ${count}, All exact 16:9: ${all169}`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/live_verified_desktop_fruitly.png` });
    await page.close();
  }

  console.log('\n================ LIVE DOMAIN TEST SUMMARY ================');
  let allPassed = true;
  for (const r of report) {
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.test}`);
    console.log(`       Details: ${r.details}`);
    if (!r.passed) allPassed = false;
  }
  console.log('==========================================================');
  console.log(`ALL LIVE DOMAIN TESTS PASSED: ${allPassed}`);

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

verifyLive().catch((e) => {
  console.error(e);
  process.exit(1);
});

