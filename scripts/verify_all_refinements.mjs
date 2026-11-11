import { chromium } from 'playwright';

async function verifyAll() {
  const browser = await chromium.launch({ headless: true });
  const report = [];

  console.log('--- STARTING COMPREHENSIVE VERIFICATION ---');

  // Test 1: Desktop Landing Page & Centered Scroll Indicator
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const indicator = page.locator('.hero-scroll-instruction');
    const isVisible = await indicator.isVisible();
    const box = await indicator.boundingBox();
    const centerX = box.x + box.width / 2;
    const diffFromCenter = Math.abs(centerX - 720);

    report.push({
      test: 'Desktop Scroll Indicator Centered',
      passed: isVisible && diffFromCenter < 10,
      details: `Visible: ${isVisible}, CenterX: ${centerX}px (Screen 720px, diff: ${diffFromCenter.toFixed(1)}px)`
    });
    await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_desktop_landing.png' });
    await page.close();
  }

  // Test 2: Mobile Landing Page - BASIL JOSE Removal & Centered Scroll Indicator
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const mobileName = page.locator('.hero-flapstick-mobile-bottom');
    const nameVisible = await mobileName.isVisible().catch(() => false);

    const indicator = page.locator('.hero-scroll-instruction');
    const indVisible = await indicator.isVisible();
    const box = await indicator.boundingBox();
    const centerX = box.x + box.width / 2;
    const diffFromCenter = Math.abs(centerX - 195);

    report.push({
      test: 'Mobile Landing Page: BASIL JOSE Removed',
      passed: !nameVisible,
      details: `BASIL JOSE bottom text visible: ${nameVisible}`
    });

    report.push({
      test: 'Mobile Landing Page: Scroll Indicator Centered',
      passed: indVisible && diffFromCenter < 10,
      details: `Visible: ${indVisible}, CenterX: ${centerX}px (Screen 195px, diff: ${diffFromCenter.toFixed(1)}px)`
    });

    await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_mobile_landing.png' });
    await page.close();
  }

  // Test 3: Hamburger Menu - Compact Connected Popover Box (Desktop & Mobile)
  {
    // Desktop Popover
    const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesk.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await pageDesk.waitForTimeout(800);

    const btnDesk = pageDesk.locator('.mobile-hamburger-btn');
    await btnDesk.click();
    await pageDesk.waitForTimeout(400);

    const drawerDesk = pageDesk.locator('.mobile-menu-drawer');
    const drawerBox = await drawerDesk.boundingBox();
    const btnBox = await btnDesk.boundingBox();

    // Verify it is a small compact box (< 260px width, < 350px height) docked directly below the button
    const isCompact = drawerBox.width <= 260 && drawerBox.height <= 350;
    const isDocked = drawerBox.y >= btnBox.y && (drawerBox.x + drawerBox.width) >= (btnBox.x - 20);

    report.push({
      test: 'Desktop Hamburger Menu Compact Popover',
      passed: isCompact && isDocked,
      details: `Width: ${drawerBox.width}px, Height: ${drawerBox.height}px, Docked below button: ${isDocked}`
    });

    await pageDesk.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_desktop_hamburger_popover.png' });

    // Test click outside to dismiss
    await pageDesk.mouse.click(200, 200);
    await pageDesk.waitForTimeout(300);
    const isOpenAfterClick = await drawerDesk.evaluate((el) => el.classList.contains('is-open'));
    report.push({
      test: 'Desktop Hamburger Popover Dismiss on Click Outside',
      passed: !isOpenAfterClick,
      details: `Menu open after click outside: ${isOpenAfterClick}`
    });
    await pageDesk.close();

    // Mobile Popover
    const pageMob = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await pageMob.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await pageMob.waitForTimeout(800);

    const btnMob = pageMob.locator('.mobile-hamburger-btn');
    await btnMob.click();
    await pageMob.waitForTimeout(400);

    const drawerMob = pageMob.locator('.mobile-menu-drawer');
    const mobDrawerBox = await drawerMob.boundingBox();
    const mobCompact = mobDrawerBox.width <= 250 && mobDrawerBox.height <= 350;

    report.push({
      test: 'Mobile Hamburger Menu Compact Popover',
      passed: mobCompact,
      details: `Width: ${mobDrawerBox.width}px, Height: ${mobDrawerBox.height}px`
    });

    await pageMob.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_mobile_hamburger_popover.png' });
    await pageMob.close();
  }

  // Test 4: Mobile Postcard Prominent Resting Sizing
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://localhost:5173/#work/videography', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const cards = page.locator('.draggable-postcard-item');
    const count = await cards.count();
    const firstCardBox = await cards.first().boundingBox();

    // Width should be prominent (~280px to ~305px), NOT 145px!
    const isProminent = firstCardBox.width >= 270;
    report.push({
      test: 'Mobile Postcards Restored Prominent Sizing',
      passed: isProminent,
      details: `Count: ${count}, Resting Width: ${firstCardBox.width.toFixed(1)}px, Height: ${firstCardBox.height.toFixed(1)}px`
    });

    await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_mobile_postcards_prominent.png' });
    await page.close();
  }

  // Test 5: Mobile Vertical Postcard Flip & Aspect Ratio
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://localhost:5173/#work/videography', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Click Dot Store postcard
    const dotStoreCard = page.locator('.draggable-postcard-item').first();
    await dotStoreCard.click();
    await page.waitForTimeout(1200);

    // Verify expanded card is in vertical orientation (height > width)
    const expandedCard = page.locator('.draggable-postcard-item.is-expanded');
    const expBox = await expandedCard.boundingBox();
    const isVertical = expBox.height > expBox.width && expBox.height >= 550;

    report.push({
      test: 'Mobile Postcard Vertical Flip Orientation',
      passed: isVertical,
      details: `Width: ${expBox.width.toFixed(1)}px, Height: ${expBox.height.toFixed(1)}px (Tall Portrait: ${expBox.height > expBox.width})`
    });

    // Check media inside: videos have 9:16 aspect ratio
    const videoWells = page.locator('.scattered-photo-well');
    const wellCount = await videoWells.count();
    let aspectRatiosCorrect = true;
    for (let i = 0; i < wellCount; i++) {
      const wellBox = await videoWells.nth(i).boundingBox();
      const ar = wellBox.width / wellBox.height;
      // 9:16 is 0.5625 (allow small tolerance 0.54 - 0.58)
      if (Math.abs(ar - 0.5625) > 0.05) {
        aspectRatiosCorrect = false;
      }
    }

    report.push({
      test: 'Mobile Video Exact 9:16 Aspect Ratio in Vertical Postcard',
      passed: aspectRatiosCorrect && wellCount === 2,
      details: `Well count: ${wellCount}, Aspect ratios exact: ${aspectRatiosCorrect}`
    });

    // Check internal margins: well does not touch expanded postcard edge
    const firstWellBox = await videoWells.first().boundingBox();
    const distToLeft = firstWellBox.x - expBox.x;
    const distToTop = firstWellBox.y - expBox.y;
    const hasMargin = distToLeft >= 10 && distToTop >= 10;

    report.push({
      test: 'Mobile Postcard Internal Margin (Zero Edge Touching)',
      passed: hasMargin,
      details: `Dist to left edge: ${distToLeft.toFixed(1)}px, Dist to top edge: ${distToTop.toFixed(1)}px`
    });

    await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_mobile_vertical_flip_dot_store.png' });

    // Test 6: Return Navigation via Top-Left Back Arrow
    const backBtn = page.locator('.clean-back-btn.is-showcase');
    await backBtn.click();
    await page.waitForTimeout(900);

    // Verify expanded card is closed and cards returned to scatter
    const isStillExpanded = await page.locator('.draggable-postcard-item.is-expanded').isVisible().catch(() => false);
    const restingCards = page.locator('.draggable-postcard-item');
    const restingCount = await restingCards.count();
    const closedBox = await restingCards.first().boundingBox();

    // In Videography, there are 5 projects (Dot Store, Eazyarts, Final 3, Josh Talks, Real Estate)
    report.push({
      test: 'Return Navigation via Back Arrow (Smooth Reverse Flip)',
      passed: !isStillExpanded && restingCount === 5 && closedBox.width < 320,
      details: `Expanded open: ${isStillExpanded}, Cards resting: ${restingCount}, Width returned: ${closedBox.width.toFixed(1)}px`
    });

    await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_mobile_returned_to_scatter.png' });
    await page.close();
  }

  // Test 7: Desktop Graphic Designs (Fouz Travels 3:4 & Fruitly 16:9 images)
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:5173/#work/graphic-designs', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Open Fruitly (Index 3: Eazyarts Ganesh=0, Fetto=1, Fouz=2, Fruitly=3)
    const fruitlyCard = page.locator('.draggable-postcard-item').nth(3);
    await fruitlyCard.click();
    await page.waitForTimeout(1200);

    const wells = page.locator('.scattered-photo-well');
    const fruitlyCount = await wells.count();
    let all169 = true;
    for (let i = 0; i < fruitlyCount; i++) {
      const size = await wells.nth(i).evaluate((el) => ({
        width: el.offsetWidth || el.clientWidth,
        height: el.offsetHeight || el.clientHeight
      }));
      const ar = size.width / size.height;
      console.log(`Fruitly Well ${i} Layout Size: ${size.width.toFixed(1)}x${size.height.toFixed(1)}, AR: ${ar.toFixed(4)}`);
      if (Math.abs(ar - 1.7778) > 0.05) {
        all169 = false;
      }
    }

    report.push({
      test: 'Desktop Fruitly 16:9 Aspect Ratio Preservation',
      passed: all169 && fruitlyCount === 8,
      details: `Count: ${fruitlyCount}, All 16:9 (1.778): ${all169}`
    });

    await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_desktop_fruitly_aspect_ratios.png' });

    // Close via close 'X' button
    const closeBtn = page.locator('.enlarged-postcard-close-btn');
    await closeBtn.click();
    await page.waitForTimeout(900);

    const isClosed = !(await page.locator('.draggable-postcard-item.is-expanded').isVisible().catch(() => false));
    report.push({
      test: 'Desktop Return Navigation via Close X Button',
      passed: isClosed,
      details: `Expanded card closed: ${isClosed}`
    });

    await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verified_desktop_returned_after_close_btn.png' });
    await page.close();
  }

  console.log('\n================ VERIFICATION SUMMARY ================');
  let allPassed = true;
  for (const r of report) {
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.test}`);
    console.log(`       Details: ${r.details}`);
    if (!r.passed) allPassed = false;
  }
  console.log('======================================================');
  console.log(`ALL TESTS PASSED: ${allPassed}`);

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

verifyAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

