import { chromium } from 'playwright';

const LOCAL_URL = process.argv[2] || 'http://localhost:5173';

async function run() {
  console.log('=== STARTING TEST SUITE FOR ALL 4 FIXES ===\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // -------------------------------------------------------------
  // TEST 3A: Dynamic Hamburger Color on #reel (Top vs Bottom)
  // -------------------------------------------------------------
  console.log('--- [TEST 3A] Testing Dynamic Hamburger Color on #reel (Top vs Bottom) ---');
  await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Frame 0: Progress 0 -> Hamburger should be Blue
  const burgerColorFrame0 = await page.evaluate(() => {
    const el = document.querySelector('.nav-morph-pill');
    return el ? window.getComputedStyle(el).color : null;
  });
  console.log('  Hamburger color at Frame 0:', burgerColorFrame0);
  const isBlueFrame0 = burgerColorFrame0?.includes('40, 89, 145');
  console.log('  Frame 0 is Blue:', isBlueFrame0 ? 'PASS' : 'FAIL');

  // Scroll to Frame 48: Progress > 0.55 -> Hamburger should turn Cream/Beige
  console.log('  Scrolling to Frame 48 (progress > 0.55)...');
  await page.evaluate(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    window.dispatchEvent(new Event('scroll'));
  });
  await page.waitForTimeout(800);

  const burgerColorFrame48 = await page.evaluate(() => {
    const el = document.querySelector('.nav-morph-pill');
    return el ? window.getComputedStyle(el).color : null;
  });
  console.log('  Hamburger color at Frame 48:', burgerColorFrame48);
  const isCreamFrame48 = burgerColorFrame48?.includes('255, 247, 237');
  console.log('  Frame 48 is Cream/Beige:', isCreamFrame48 ? 'PASS' : 'FAIL');

  // -------------------------------------------------------------
  // TEST 2: Blank #contact page regression & hamburger visibility
  // -------------------------------------------------------------
  console.log('\n--- [TEST 2] Testing #contact Page Visibility & Layout ---');
  // Open hamburger
  const burgerBtn = await page.waitForSelector('.nav-morph-toggle');
  await burgerBtn.click();
  await page.waitForTimeout(400);

  // Click CONTACT
  const contactLink = await page.waitForSelector('.nav-morph-link:has-text("CONTACT")');
  await contactLink.click();
  await page.waitForTimeout(1200);

  const contactMetrics = await page.evaluate(() => {
    const contactView = document.querySelector('.contact-view');
    const contactCard = document.querySelector('.contact-card');
    const burger = document.querySelector('.nav-morph-pill');
    const backBtn = document.querySelector('.clean-back-btn');
    return {
      url: window.location.hash,
      contactViewRect: contactView?.getBoundingClientRect(),
      contactCardRect: contactCard?.getBoundingClientRect(),
      contactCardVisible: contactCard ? contactCard.getBoundingClientRect().top < 900 && contactCard.getBoundingClientRect().bottom > 0 : false,
      burgerVisible: burger ? window.getComputedStyle(burger).visibility !== 'hidden' : false,
      burgerZIndex: burger ? window.getComputedStyle(burger).zIndex : null,
      burgerColor: burger ? window.getComputedStyle(burger).color : null,
      backBtnColor: backBtn ? window.getComputedStyle(backBtn).color : null
    };
  });

  console.log('  Contact URL Hash:', contactMetrics.url);
  console.log('  Contact Card Top Y:', contactMetrics.contactCardRect?.top, 'px (Must be inside viewport [0, 900])');
  console.log('  Contact Card Visible:', contactMetrics.contactCardVisible ? 'PASS' : 'FAIL');
  console.log('  Hamburger Visible:', contactMetrics.burgerVisible ? 'PASS' : 'FAIL');
  console.log('  Hamburger Z-Index:', contactMetrics.burgerZIndex, '(Must be >= 2000)');
  console.log('  Hamburger Color on Contact:', contactMetrics.burgerColor, '(Must be Blue)');
  console.log('  Back Button Color on Contact:', contactMetrics.backBtnColor, '(Must be Blue)');

  // -------------------------------------------------------------
  // TEST 3B: Returning from #contact to #work: Icon NOT stuck on beige
  // -------------------------------------------------------------
  console.log('\n--- [TEST 3B] Returning from #contact to #work ---');
  await burgerBtn.click();
  await page.waitForTimeout(400);
  const workLink = await page.waitForSelector('.nav-morph-link:has-text("WORK")');
  await workLink.click();
  await page.waitForTimeout(1200);

  const workOverviewMetrics = await page.evaluate(() => {
    const burger = document.querySelector('.nav-morph-pill');
    const backBtn = document.querySelector('.clean-back-btn');
    return {
      url: window.location.hash,
      burgerColor: burger ? window.getComputedStyle(burger).color : null,
      backBtnColor: backBtn ? window.getComputedStyle(backBtn).color : null
    };
  });
  console.log('  Work URL Hash:', workOverviewMetrics.url);
  console.log('  Hamburger Color on #work overview:', workOverviewMetrics.burgerColor, '(Must be Blue, not stuck on beige)');
  const isWorkBurgerBlue = workOverviewMetrics.burgerColor?.includes('40, 89, 145');
  console.log('  Work Hamburger is Blue:', isWorkBurgerBlue ? 'PASS' : 'FAIL');

  // -------------------------------------------------------------
  // TEST 1: Postcard Flip, Clicking Image Opens Lightbox (Does NOT Close Card)
  // -------------------------------------------------------------
  console.log('\n--- [TEST 1] Testing Clicking Image inside Flipped Postcard (Lightbox Opens, Card Stays Open) ---');
  // Click Graphic Design album
  const graphicDesignAlbum = await page.waitForSelector('a[aria-label*="GRAPHIC" i]', { timeout: 10000 });
  await graphicDesignAlbum.click();
  await page.waitForTimeout(2000);

  // Check hamburger color on showcase desk (Must be Cream)
  const deskBurgerColor = await page.evaluate(() => {
    const el = document.querySelector('.nav-morph-pill');
    return el ? window.getComputedStyle(el).color : null;
  });
  console.log('  Hamburger Color on Blue Showcase Desk:', deskBurgerColor, '(Must be Cream)');
  const isDeskBurgerCream = deskBurgerColor?.includes('255, 247, 237');
  console.log('  Desk Hamburger is Cream:', isDeskBurgerCream ? 'PASS' : 'FAIL');

  // Click a postcard (Fruitly or first card)
  const postcards = await page.$$('.draggable-postcard-item');
  console.log('  Found', postcards.length, 'postcards on desk. Clicking first postcard...');
  await postcards[0].click();
  await page.waitForTimeout(1500);

  const isCardExpandedBefore = await page.evaluate(() => {
    const expandedCard = document.querySelector('.draggable-postcard-item.is-expanded');
    return Boolean(expandedCard);
  });
  console.log('  Card is 3D flipped open:', isCardExpandedBefore ? 'PASS' : 'FAIL');

  // Find image inside flipped postcard
  const flippedImg = await page.waitForSelector('.draggable-postcard-item.is-expanded .scattered-polaroid-frame img', { timeout: 5000 });
  console.log('  Clicking image inside flipped postcard...');
  await flippedImg.click();
  await page.waitForTimeout(800);

  // Verify: Lightbox is OPEN!
  const isLightboxOpen = await page.evaluate(() => {
    const modal = document.querySelector('.polaroid-inspect-modal');
    return Boolean(modal);
  });
  console.log('  Lightbox opened:', isLightboxOpen ? 'PASS' : 'FAIL');

  // Verify: Postcard is STILL OPEN!
  const isCardStillExpanded = await page.evaluate(() => {
    const expandedCard = document.querySelector('.draggable-postcard-item.is-expanded');
    return Boolean(expandedCard);
  });
  console.log('  Postcard remains open while lightbox active:', isCardStillExpanded ? 'PASS' : 'FAIL');

  // Verify: Close Lightbox via Escape or Close Button
  console.log('  Closing lightbox via close button...');
  const lightboxClose = await page.waitForSelector('.polaroid-inspect-close');
  await lightboxClose.click();
  await page.waitForTimeout(600);

  const isLightboxClosed = await page.evaluate(() => {
    return !document.querySelector('.polaroid-inspect-modal');
  });
  console.log('  Lightbox cleanly closed:', isLightboxClosed ? 'PASS' : 'FAIL');

  // Postcard should still be open!
  const isCardStillExpandedAfter = await page.evaluate(() => {
    return Boolean(document.querySelector('.draggable-postcard-item.is-expanded'));
  });
  console.log('  Postcard still cleanly open after lightbox closed:', isCardStillExpandedAfter ? 'PASS' : 'FAIL');

  // -------------------------------------------------------------
  // TEST 4: Prevent Duplicate URL History Push on Close Card
  // -------------------------------------------------------------
  console.log('\n--- [TEST 4] Testing History ReplaceState on Card Close & Browser Back ---');
  const hashWithCardOpen = await page.evaluate(() => window.location.hash);
  console.log('  URL Hash with card open:', hashWithCardOpen);

  // Close card via explicit close button
  const cardCloseBtn = await page.waitForSelector('.enlarged-postcard-close-btn');
  await cardCloseBtn.click();
  await page.waitForTimeout(1000);

  const hashAfterCardClose = await page.evaluate(() => window.location.hash);
  console.log('  URL Hash after closing card:', hashAfterCardClose);

  // Now call page.goBack() -> Should go directly to #work (album wheel), NOT re-open the card!
  console.log('  Calling browser back (page.goBack())...');
  await page.goBack();
  await page.waitForTimeout(1200);

  const hashAfterBack = await page.evaluate(() => window.location.hash);
  console.log('  URL Hash after Browser Back:', hashAfterBack, '(Expected: #work)');
  const isBackToWheel = hashAfterBack === '#work';
  console.log('  Browser Back returned to album wheel without duplicate loop:', isBackToWheel ? 'PASS' : 'FAIL');

  const allPassed = isBlueFrame0 && isCreamFrame48 && contactMetrics.contactCardVisible && contactMetrics.burgerVisible && isWorkBurgerBlue && isDeskBurgerCream && isCardExpandedBefore && isLightboxOpen && isCardStillExpanded && isLightboxClosed && isCardStillExpandedAfter && isBackToWheel;

  console.log('\n========================================');
  console.log('ALL 4 FIXES VERIFIED SUCCESSFULLY:', allPassed ? 'YES (100% PASS)' : 'SOME FAILED');
  console.log('========================================');

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
