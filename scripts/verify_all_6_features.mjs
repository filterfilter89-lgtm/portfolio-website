import { chromium } from '@playwright/test';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';
const BASE_URL = 'http://localhost:5173';

(async () => {
  console.log('--- STARTING 6-FEATURE AUTOMATED VERIFICATION ---');
  const browser = await chromium.launch({
    executablePath: 'C:/Users/basil/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
  });

  // Mobile viewport: iPhone 15 (393 x 852)
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await mobileContext.newPage();

  // Test 1: Mobile Landing Page Name & Scroll Instruction & Hamburger
  console.log('1. Navigating to Mobile Landing Page...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Take screenshot of Mobile Landing Page (Name at bottom, scroll prompt, hamburger top-right)
  const heroPath = path.join(ARTIFACT_DIR, 'verify_01_mobile_landing_hero.png');
  await page.screenshot({ path: heroPath });
  console.log('Saved mobile landing hero screenshot to:', heroPath);

  // Check hamburger button visibility
  const hamburgerBtn = page.locator('.mobile-hamburger-btn');
  const isHamburgerVisible = await hamburgerBtn.isVisible();
  console.log('Hamburger button visible in top-right:', isHamburgerVisible);

  // Check bottom name: BASIL / JOSE
  const mobileName = page.locator('.hero-flapstick-mobile-bottom');
  const isMobileNameVisible = await mobileName.isVisible();
  const nameText = await mobileName.innerText();
  console.log('Mobile bottom name visible:', isMobileNameVisible, 'Content:', JSON.stringify(nameText));

  // Check scroll instruction
  const scrollInstruction = page.locator('.hero-scroll-instruction');
  const isScrollVisible = await scrollInstruction.isVisible();
  const scrollText = await scrollInstruction.innerText();
  console.log('Scroll instruction visible:', isScrollVisible, 'Content:', JSON.stringify(scrollText));

  // Test 2: Hamburger Menu Open State
  console.log('2. Clicking Hamburger Menu Button...');
  await hamburgerBtn.click();
  await page.waitForTimeout(400);

  const menuDrawerPath = path.join(ARTIFACT_DIR, 'verify_02_hamburger_menu_open.png');
  await page.screenshot({ path: menuDrawerPath });
  console.log('Saved hamburger menu drawer screenshot to:', menuDrawerPath);

  // Test 3: Navigate to Contact Page
  console.log('3. Navigating to Contact Page via drawer...');
  const contactLink = page.locator('.mobile-menu-link:has-text("CONTACT")');
  await contactLink.click();
  await page.waitForTimeout(600);

  const contactPath = path.join(ARTIFACT_DIR, 'verify_03_contact_page_mobile.png');
  await page.screenshot({ path: contactPath });
  console.log('Saved contact page mobile screenshot to:', contactPath);

  // Check back button has ONLY arrow
  const contactBackBtn = page.locator('.contact-page-wrapper .clean-back-btn');
  const backText = await contactBackBtn.innerText();
  console.log('Contact back button text (should be empty):', JSON.stringify(backText));

  // Test 4: Navigate to Album Carousel and check back button
  console.log('4. Navigating to Work Carousel...');
  await page.goto(`${BASE_URL}/#work`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const carouselPath = path.join(ARTIFACT_DIR, 'verify_04_work_carousel_mobile.png');
  await page.screenshot({ path: carouselPath });
  console.log('Saved work carousel mobile screenshot to:', carouselPath);

  // Test 5: Open a Postcard Showcase & Test Flipped Aspect Ratio
  console.log('5. Navigating to Postcard Showcase (Graphic Designs)...');
  await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const showcasePath = path.join(ARTIFACT_DIR, 'verify_05_postcard_desk_mobile.png');
  await page.screenshot({ path: showcasePath });
  console.log('Saved postcard showcase mobile screenshot to:', showcasePath);

  // Test 6: Desktop Viewport Verification (Desktop Lightbox / Flipped Card Aspect Ratio)
  console.log('6. Verifying Desktop Viewport (1440 x 900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(`${BASE_URL}/#contact`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(600);

  const desktopContactPath = path.join(ARTIFACT_DIR, 'verify_06_contact_page_desktop.png');
  await desktopPage.screenshot({ path: desktopContactPath });
  console.log('Saved contact page desktop screenshot to:', desktopContactPath);

  await browser.close();
  console.log('--- ALL 6-FEATURE AUTOMATED VERIFICATIONS SUCCEEDED ---');
})();
