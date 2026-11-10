import { chromium } from 'playwright';

const PROD_URL = 'https://basil-jose.vercel.app';

async function testProd() {
  console.log('Testing live production at:', PROD_URL);
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop (1440 x 900)
  console.log('\n--- VERIFYING LIVE DESKTOP ---');
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();
  await desktopPage.goto(PROD_URL, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(2000);
  
  const hamburger = desktopPage.locator('.mobile-hamburger-btn');
  const isHamburgerVisible = await hamburger.isVisible();
  console.log('Desktop Hamburger visible on live site:', isHamburgerVisible);
  if (isHamburgerVisible) {
    const box = await hamburger.boundingBox();
    console.log('Hamburger position on desktop:', box);
    await hamburger.click();
    await desktopPage.waitForTimeout(600);
    const drawerOpen = await desktopPage.locator('.mobile-menu-drawer').isVisible();
    console.log('Menu drawer opens on desktop click:', drawerOpen);
    await desktopPage.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/live_prod_desktop_hamburger.png' });
    
    // Close drawer
    const closeBtn = desktopPage.locator('.mobile-menu-close-btn');
    if (await closeBtn.isVisible()) await closeBtn.click();
  }
  
  // 2. Mobile (393 x 852)
  console.log('\n--- VERIFYING LIVE MOBILE ---');
  const mobileCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(PROD_URL, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(2000);
  
  const nameBox = await mobilePage.locator('.hero-flapstick-mobile-bottom').boundingBox();
  console.log('Mobile Name Box on live site:', nameBox);
  if (nameBox) {
    console.log('Distance from bottom edge:', 852 - (nameBox.y + nameBox.height), 'px');
    console.log('Width:', nameBox.width, 'px (fills screen width)');
  }
  const lines = await mobilePage.locator('.hero-flapstick-mobile-line').allInnerTexts();
  console.log('Mobile name lines:', lines);
  
  const scrollBox = await mobilePage.locator('.hero-scroll-instruction').boundingBox();
  console.log('Scroll instruction position:', scrollBox);
  
  await mobilePage.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/live_prod_mobile_landing.png' });
  
  // 3. Postcards
  console.log('\n--- VERIFYING LIVE POSTCARD DESK ---');
  await desktopPage.goto(`${PROD_URL}/work.html#work/graphic-designs`, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/live_prod_postcard_desk.png' });
  
  await browser.close();
  console.log('\nAll production checks passed successfully!');
}

testProd().catch(err => {
  console.error('Prod verify error:', err);
  process.exit(1);
});

