import { chromium } from 'playwright';
import path from 'path';

const BASE_URL = process.argv[2] || 'http://localhost:5173';
const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function main() {
  console.log('=== VERIFYING STRETCHED SVG BACKDROP TITLE & CLEAN REMOVALS ===');
  console.log('Target URL:', BASE_URL, '\n');

  const browser = await chromium.launch({ headless: true });
  let allPassed = true;

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP FRUITLY (#work/graphic-designs)
    // -------------------------------------------------------------
    console.log('--- [1. DESKTOP] Testing Flipped Postcard (Fruitly) ---');
    let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Click Fruitly postcard
    const fruitlyCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('fruitly')) || cards[3];
    });
    await fruitlyCard.click();
    await page.waitForTimeout(1600);

    // Save screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_stretched_title_fruitly_desktop.png') });
    console.log('  Saved test_stretched_title_fruitly_desktop.png');

    const fruitlyChecks = await page.evaluate(() => {
      const headerBlock = document.querySelector('.enlarged-postcard-header-block');
      const closeBtn = document.querySelector('.enlarged-postcard-close-btn');
      const bgTitleSvg = document.querySelector('.postcard-stretched-bg-title');
      const textNode = bgTitleSvg ? bgTitleSvg.querySelector('text') : null;
      const gallery = document.querySelector('.card-back-body.polaroid-gallery');

      const bgTitleRect = bgTitleSvg ? bgTitleSvg.getBoundingClientRect() : null;
      const galleryRect = gallery ? gallery.getBoundingClientRect() : null;

      return {
        headerRemoved: headerBlock === null,
        closeBtnRemoved: closeBtn === null,
        hasSvg: Boolean(bgTitleSvg),
        viewBox: bgTitleSvg ? bgTitleSvg.getAttribute('viewBox') : null,
        preserveAspectRatio: bgTitleSvg ? bgTitleSvg.getAttribute('preserveAspectRatio') : null,
        textContent: textNode ? textNode.textContent.trim() : null,
        textColor: textNode ? window.getComputedStyle(textNode).fill : null,
        galleryHeight: galleryRect ? galleryRect.height : 0,
        galleryZIndex: gallery ? window.getComputedStyle(gallery).zIndex : null,
        bgTitleRect,
        galleryRect
      };
    });

    console.log(`  Top header text removed: ${fruitlyChecks.headerRemoved ? 'PASS' : 'FAIL'}`);
    console.log(`  Top-right close button removed: ${fruitlyChecks.closeBtnRemoved ? 'PASS' : 'FAIL'}`);
    console.log(`  Stretched SVG backdrop title present: ${fruitlyChecks.hasSvg ? 'PASS' : 'FAIL'}`);
    console.log(`  SVG preserveAspectRatio: "${fruitlyChecks.preserveAspectRatio}" (Expected: "none")`);
    console.log(`  SVG viewBox: "${fruitlyChecks.viewBox}"`);
    console.log(`  SVG textContent: "${fruitlyChecks.textContent}" (Expected: "FRUITLY")`);
    console.log(`  Media gallery zIndex: "${fruitlyChecks.galleryZIndex}" (Expected: "2")`);

    if (!fruitlyChecks.headerRemoved) allPassed = false;
    if (!fruitlyChecks.closeBtnRemoved) allPassed = false;
    if (!fruitlyChecks.hasSvg) allPassed = false;
    if (fruitlyChecks.preserveAspectRatio !== 'none') allPassed = false;
    if (fruitlyChecks.textContent !== 'FRUITLY') allPassed = false;

    await page.close();

    // -------------------------------------------------------------
    // 2. DESKTOP EAZYARTS GANESH (#work/graphic-designs)
    // -------------------------------------------------------------
    console.log('\n--- [2. DESKTOP] Testing Flipped Postcard (Eazyarts Ganesh) ---');
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const ganeshCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('ganesh')) || cards[0];
    });
    await ganeshCard.click();
    await page.waitForTimeout(1600);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_stretched_title_ganesh_desktop.png') });
    console.log('  Saved test_stretched_title_ganesh_desktop.png');

    const ganeshChecks = await page.evaluate(() => {
      const bgTitleSvg = document.querySelector('.postcard-stretched-bg-title');
      const textNode = bgTitleSvg ? bgTitleSvg.querySelector('text') : null;
      return {
        hasSvg: Boolean(bgTitleSvg),
        textContent: textNode ? textNode.textContent.trim() : null,
        viewBox: bgTitleSvg ? bgTitleSvg.getAttribute('viewBox') : null
      };
    });

    console.log(`  Ganesh backdrop title present: ${ganeshChecks.hasSvg ? 'PASS' : 'FAIL'}`);
    console.log(`  Ganesh textContent: "${ganeshChecks.textContent}"`);
    console.log(`  Ganesh viewBox: "${ganeshChecks.viewBox}"`);
    if (!ganeshChecks.hasSvg || !ganeshChecks.textContent.includes('GANESH')) allPassed = false;

    await page.close();

    // -------------------------------------------------------------
    // 3. DESKTOP DOT STORE (#work/videography)
    // -------------------------------------------------------------
    console.log('\n--- [3. DESKTOP] Testing Flipped Postcard (Dot Store) ---');
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/#work/videography`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const dotStoreCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('dot store')) || cards[0];
    });
    await dotStoreCard.click();
    await page.waitForTimeout(1600);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_stretched_title_dot_store_desktop.png') });
    console.log('  Saved test_stretched_title_dot_store_desktop.png');

    const dotStoreChecks = await page.evaluate(() => {
      const bgTitleSvg = document.querySelector('.postcard-stretched-bg-title');
      const textNode = bgTitleSvg ? bgTitleSvg.querySelector('text') : null;
      return {
        hasSvg: Boolean(bgTitleSvg),
        textContent: textNode ? textNode.textContent.trim() : null
      };
    });
    console.log(`  Dot Store backdrop title present: ${dotStoreChecks.hasSvg ? 'PASS' : 'FAIL'}`);
    console.log(`  Dot Store textContent: "${dotStoreChecks.textContent}"`);
    if (!dotStoreChecks.hasSvg || !dotStoreChecks.textContent.includes('DOT STORE')) allPassed = false;

    await page.close();

    // -------------------------------------------------------------
    // 4. MOBILE VIEWPORT (390x844)
    // -------------------------------------------------------------
    console.log('\n--- [4. MOBILE] Testing Mobile Viewport (390x844) ---');
    page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const mobileFruitly = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('fruitly')) || cards[3];
    });
    await mobileFruitly.click();
    await page.waitForTimeout(1600);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_stretched_title_fruitly_mobile.png') });
    console.log('  Saved test_stretched_title_fruitly_mobile.png');

    const mobileChecks = await page.evaluate(() => {
      const bgTitleSvg = document.querySelector('.postcard-stretched-bg-title');
      const textNode = bgTitleSvg ? bgTitleSvg.querySelector('text') : null;
      const gallery = document.querySelector('.card-back-body.polaroid-gallery');
      const headerBlock = document.querySelector('.enlarged-postcard-header-block');
      const closeBtn = document.querySelector('.enlarged-postcard-close-btn');

      return {
        headerRemoved: headerBlock === null,
        closeBtnRemoved: closeBtn === null,
        hasSvg: Boolean(bgTitleSvg),
        textContent: textNode ? textNode.textContent.trim() : null,
        pointerEvents: bgTitleSvg ? window.getComputedStyle(bgTitleSvg).pointerEvents : null,
        isScrollable: gallery ? gallery.scrollHeight > gallery.clientHeight : false
      };
    });

    console.log(`  Mobile header removed: ${mobileChecks.headerRemoved ? 'PASS' : 'FAIL'}`);
    console.log(`  Mobile close button removed: ${mobileChecks.closeBtnRemoved ? 'PASS' : 'FAIL'}`);
    console.log(`  Mobile SVG title present: ${mobileChecks.hasSvg ? 'PASS' : 'FAIL'}`);
    console.log(`  Mobile textContent: "${mobileChecks.textContent}"`);
    console.log(`  Mobile SVG pointer-events: "${mobileChecks.pointerEvents}" (Expected: "none")`);
    console.log(`  Mobile gallery scrollable: ${mobileChecks.isScrollable ? 'PASS' : 'FAIL'}`);

    if (!mobileChecks.headerRemoved) allPassed = false;
    if (!mobileChecks.closeBtnRemoved) allPassed = false;
    if (!mobileChecks.hasSvg) allPassed = false;
    if (mobileChecks.pointerEvents !== 'none') allPassed = false;

    await page.close();

  } catch (err) {
    console.error('Error during test execution:', err);
    allPassed = false;
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log('STRETCHED TITLE TEST RESULT:', allPassed ? 'PASS (100%)' : 'FAIL');
  console.log('========================================');
  process.exit(allPassed ? 0 : 1);
}

main();

