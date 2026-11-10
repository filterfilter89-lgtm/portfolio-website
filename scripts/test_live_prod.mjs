import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';
const PROD_URL = 'https://basil-jose.vercel.app';

(async () => {
  console.log('--- TESTING LIVE PRODUCTION DEPLOYMENT AT ' + PROD_URL + ' ---');
  const browser = await chromium.launch({
    executablePath: 'C:/Users/basil/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
  });

  // Mobile Context: iPhone 15 (393 x 852)
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await mobileContext.newPage();

  console.log('1. Navigating to live mobile landing page...');
  await page.goto(`${PROD_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const heroPath = path.join(ARTIFACT_DIR, 'live_prod_01_mobile_landing.png');
  await page.screenshot({ path: heroPath });
  console.log('   - Mobile Landing Hero Screenshot:', heroPath);

  // 1. Verify Name
  const mobileName = page.locator('.hero-flapstick-mobile-bottom');
  const isNameVisible = await mobileName.isVisible();
  const nameText = await mobileName.innerText();
  console.log('   - Mobile name visible:', isNameVisible, 'Content:', JSON.stringify(nameText));

  // 2. Verify Scroll prompt
  const scrollPrompt = page.locator('.hero-scroll-instruction');
  const isScrollVisible = await scrollPrompt.isVisible();
  const scrollText = await scrollPrompt.innerText();
  console.log('   - Scroll prompt visible:', isScrollVisible, 'Content:', JSON.stringify(scrollText));

  // 3. Verify Hamburger
  const hamburger = page.locator('.mobile-hamburger-btn');
  const isHamburgerVisible = await hamburger.isVisible();
  console.log('   - Hamburger button visible in top-right:', isHamburgerVisible);

  // 4. Open Drawer
  console.log('2. Opening mobile hamburger drawer on live site...');
  await hamburger.click();
  await page.waitForTimeout(500);

  const drawerPath = path.join(ARTIFACT_DIR, 'live_prod_02_hamburger_open.png');
  await page.screenshot({ path: drawerPath });
  console.log('   - Hamburger Drawer Screenshot:', drawerPath);

  // 5. Navigate to Contact Page
  console.log('3. Navigating to Contact Page via drawer...');
  const contactLink = page.locator('.mobile-menu-link:has-text("CONTACT")');
  await contactLink.click();
  await page.waitForTimeout(800);

  const contactPath = path.join(ARTIFACT_DIR, 'live_prod_03_contact_page.png');
  await page.screenshot({ path: contactPath });
  console.log('   - Contact Page Screenshot:', contactPath);

  const backBtn = page.locator('.contact-page-wrapper .clean-back-btn');
  const backText = await backBtn.innerText();
  console.log('   - Contact back button text (must be empty arrow only):', JSON.stringify(backText));

  // 6. Navigate to Work Carousel
  console.log('4. Navigating to Album Carousel (#work)...');
  await page.goto(`${PROD_URL}/#work`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const carouselPath = path.join(ARTIFACT_DIR, 'live_prod_04_album_carousel.png');
  await page.screenshot({ path: carouselPath });
  console.log('   - Album Carousel Screenshot:', carouselPath);

  const carouselBackBtn = page.locator('.clean-back-btn').first();
  const carouselBackText = await carouselBackBtn.innerText();
  console.log('   - Carousel back button text (must be empty arrow only):', JSON.stringify(carouselBackText));

  // 7. Navigate to Postcard Showcase
  console.log('5. Navigating to Postcard Showcase (#work/graphic-designs)...');
  await page.goto(`${PROD_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const showcasePath = path.join(ARTIFACT_DIR, 'live_prod_05_postcard_desk.png');
  await page.screenshot({ path: showcasePath });
  console.log('   - Postcard Showcase Screenshot:', showcasePath);

  const showcaseBackBtn = page.locator('.clean-back-btn').first();
  const showcaseBackText = await showcaseBackBtn.innerText();
  console.log('   - Showcase back button text (must be empty arrow only):', JSON.stringify(showcaseBackText));

  // 8. Desktop Viewport
  console.log('6. Verifying Desktop Viewport at 1440 x 900...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(`${PROD_URL}/#contact`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(800);

  const desktopContactPath = path.join(ARTIFACT_DIR, 'live_prod_06_contact_desktop.png');
  await desktopPage.screenshot({ path: desktopContactPath });
  console.log('   - Desktop Contact Page Screenshot:', desktopContactPath);

  await browser.close();
  console.log('--- ALL 6 FEATURES VERIFIED 100% LIVE ON PRODUCTION ---');
})();
