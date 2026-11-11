import { chromium } from 'playwright';

const chromePath = 'C:/Users/basil/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const LOCAL_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function testMorphMenu() {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const results = [];

  console.log('=== TESTING MORPHING HAMBURGER NAVIGATION PILL ===\n');

  // 1. Desktop Test
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const pill = page.locator('.nav-morph-pill');
    const closedBox = await pill.boundingBox();
    const closedRadius = await pill.evaluate(el => window.getComputedStyle(el).borderRadius);

    console.log(`[Desktop Closed] Width: ${closedBox.width}px, Height: ${closedBox.height}px, BorderRadius: ${closedRadius}`);

    const isCircleClosed = Math.abs(closedBox.width - 44) <= 2 && Math.abs(closedBox.height - 44) <= 2;
    results.push({
      test: 'Desktop Menu Circle at Rest',
      passed: isCircleClosed && closedRadius === '22px',
      details: `Box: ${closedBox.width}x${closedBox.height}px, Radius: ${closedRadius}`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/morph_menu_desktop_closed.png` });

    // Click toggle button
    const toggle = page.locator('.nav-morph-toggle');
    await toggle.click();
    await page.waitForTimeout(600); // Wait for transition

    const openBox = await pill.boundingBox();
    const openRadius = await pill.evaluate(el => window.getComputedStyle(el).borderRadius);
    console.log(`[Desktop Open] Width: ${openBox.width}px, Height: ${openBox.height}px, BorderRadius: ${openRadius}`);

    const isHorizontalRect = openBox.width >= 340 && openBox.height <= 50;
    const radiusMatchesCircle = openRadius === '22px';
    results.push({
      test: 'Desktop Menu Morphs into Horizontal Rectangle with Matching Curvature',
      passed: isHorizontalRect && radiusMatchesCircle,
      details: `Width: ${openBox.width}px, Height: ${openBox.height}px, Radius: ${openRadius} (matches circle)`
    });

    // Verify text items inside
    const links = await page.locator('.nav-morph-link').allInnerTexts();
    console.log(`[Desktop Links Found]:`, links);

    const expected = ['REEL', 'WORK', 'CONTACT', 'RESUME'];
    const exactMatches = links.length === 4 && links.every((t, i) => t.trim() === expected[i]);
    results.push({
      test: 'Displays ONLY the 4 Text Items (REEL, WORK, CONTACT, RESUME)',
      passed: exactMatches,
      details: `Items: [${links.join(', ')}]`
    });

    // Check for any subtitles or extra text
    const allPillText = await pill.innerText();
    const cleanedWords = allPillText.split(/\s+/).filter(w => w.length > 0);
    console.log(`[All text words inside pill]:`, cleanedWords);
    const onlyFourWords = cleanedWords.length === 4 && cleanedWords.every((w, i) => w === expected[i]);
    results.push({
      test: 'Zero subtitles, descriptions, labels, or additional text',
      passed: onlyFourWords,
      details: `Found words: [${cleanedWords.join(', ')}]`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/morph_menu_desktop_expanded.png` });

    // Test close via toggle
    await toggle.click();
    await page.mouse.move(0, 0); // Move mouse away to clear hover scale
    await page.waitForTimeout(600);
    const returnBox = await pill.boundingBox();
    const isReturned = Math.abs(returnBox.width - 44) <= 2;
    results.push({
      test: 'Desktop Menu Smoothly Collapses back to Circle on Toggle',
      passed: isReturned,
      details: `Returned Width: ${returnBox.width}px`
    });

    await page.close();
  }

  // 2. Mobile Test (390px)
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const pill = page.locator('.nav-morph-pill');
    const toggle = page.locator('.nav-morph-toggle');

    // Click toggle to expand on mobile
    await toggle.click();
    await page.waitForTimeout(600);

    const openBox = await pill.boundingBox();
    const openRadius = await pill.evaluate(el => window.getComputedStyle(el).borderRadius);
    console.log(`[Mobile Open] Width: ${openBox.width}px, Height: ${openBox.height}px, BorderRadius: ${openRadius}`);

    const isHorizontalMob = openBox.width >= 300 && openBox.width <= 360 && openBox.height <= 50;
    results.push({
      test: 'Mobile Menu Morphs into Horizontal Rectangle with Matching Curvature',
      passed: isHorizontalMob && openRadius === '22px',
      details: `Width: ${openBox.width}px, Height: ${openBox.height}px, Radius: ${openRadius}`
    });

    const linksMob = await page.locator('.nav-morph-link').allInnerTexts();
    const expected = ['REEL', 'WORK', 'CONTACT', 'RESUME'];
    const exactMatchesMob = linksMob.length === 4 && linksMob.every((t, i) => t.trim() === expected[i]);
    results.push({
      test: 'Mobile Displays ONLY the 4 Text Items',
      passed: exactMatchesMob,
      details: `Items: [${linksMob.join(', ')}]`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/morph_menu_mobile_expanded.png` });

    // Test navigation: Click WORK link
    const workLink = page.locator('.nav-morph-link').nth(1);
    await workLink.click();
    await page.waitForTimeout(1500);

    const hash = await page.evaluate(() => window.location.hash);
    const isClosedAfterNav = !(await page.locator('.nav-morph-pill.is-open').isVisible().catch(() => false));
    results.push({
      test: 'Clicking WORK navigates to #work and collapses menu back to circle',
      passed: hash === '#work' && isClosedAfterNav,
      details: `Hash: ${hash}, Menu collapsed: ${isClosedAfterNav}`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/morph_menu_mobile_navigated_work.png` });
    await page.close();
  }

  // 3. Showcase Dark Theme Test
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${LOCAL_URL}/work.html#work/videography`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Expand 1st card into showcase mode
    const card = page.locator('.draggable-postcard-item').first();
    await card.click();
    await page.waitForTimeout(1500);

    const pill = page.locator('.nav-morph-pill');
    const isDark = await pill.evaluate(el => el.classList.contains('is-dark-desk') || document.body.classList.contains('is-showcase-active'));

    const toggle = page.locator('.nav-morph-toggle');
    await toggle.click();
    await page.waitForTimeout(600);

    const openBox = await pill.boundingBox();
    results.push({
      test: 'Showcase Dark View Supports Morphing Navigation Pill',
      passed: isDark && openBox.width >= 340,
      details: `Dark class present: ${isDark}, Expanded width: ${openBox.width}px`
    });

    await page.screenshot({ path: `${ARTIFACT_DIR}/morph_menu_dark_showcase_expanded.png` });
    await page.close();
  }

  console.log('\n================ TEST SUMMARY ================');
  let allPassed = true;
  for (const r of results) {
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.test}`);
    console.log(`       Details: ${r.details}`);
    if (!r.passed) allPassed = false;
  }
  console.log('==============================================');
  console.log(`ALL TESTS PASSED: ${allPassed}`);

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

testMorphMenu().catch(err => {
  console.error(err);
  process.exit(1);
});
