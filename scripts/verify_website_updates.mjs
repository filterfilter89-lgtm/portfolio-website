import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';

async function testWebsite() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Test Desktop (1440 x 900)
  console.log('\n--- TESTING DESKTOP (1440 x 900) ---');
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopCtx.newPage();
  
  await desktopPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1500);
  
  // Check hamburger button visibility on Desktop
  const desktopHamburger = desktopPage.locator('.mobile-hamburger-btn');
  const isHamburgerVisible = await desktopHamburger.isVisible();
  console.log('Desktop Hamburger visible:', isHamburgerVisible);
  
  if (isHamburgerVisible) {
    const box = await desktopHamburger.boundingBox();
    console.log('Desktop Hamburger position:', box);
    
    // Click hamburger to verify drawer opens
    await desktopHamburger.click();
    await desktopPage.waitForTimeout(600);
    const drawer = desktopPage.locator('.mobile-menu-drawer');
    const isDrawerOpen = await drawer.isVisible();
    console.log('Desktop Menu Drawer open on click:', isDrawerOpen);
    
    // Take screenshot of desktop drawer
    await desktopPage.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verify_desktop_hamburger_open.png' });
    
    // Close drawer
    const closeBtn = desktopPage.locator('.mobile-menu-close-btn');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await desktopPage.waitForTimeout(400);
    }
  }
  
  // 2. Test Mobile (393 x 852 - iPhone 15)
  console.log('\n--- TESTING MOBILE (393 x 852) ---');
  const mobileCtx = await browser.newContext({
    viewport: { width: 393, height: 852 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1500);
  
  // Verify mobile name placement & sizing
  const mobileNameContainer = mobilePage.locator('.hero-flapstick-mobile-bottom');
  const isNameVisible = await mobileNameContainer.isVisible();
  console.log('Mobile Name Container visible:', isNameVisible);
  
  if (isNameVisible) {
    const nameBox = await mobileNameContainer.boundingBox();
    console.log('Mobile Name Box:', nameBox);
    console.log('Bottom gap to screen edge:', 852 - (nameBox.y + nameBox.height), 'px');
    console.log('Name width vs screen width (393px):', nameBox.width, 'px');
    
    const lines = await mobilePage.locator('.hero-flapstick-mobile-line').allInnerTexts();
    console.log('Mobile Name Lines:', lines);
  }
  
  // Check scroll instruction
  const scrollInstr = mobilePage.locator('.hero-scroll-instruction');
  const isScrollVisible = await scrollInstr.isVisible();
  console.log('Scroll instruction visible:', isScrollVisible);
  if (isScrollVisible) {
    const scrollBox = await scrollInstr.boundingBox();
    console.log('Scroll instruction position:', scrollBox);
  }
  
  await mobilePage.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verify_mobile_hero_bottom.png' });
  
  // 3. Test Flipped Postcards Scattered Arrangement on Desktop and Mobile
  console.log('\n--- TESTING FLIPPED POSTCARDS ---');
  await desktopPage.goto(`${BASE_URL}/work.html#work/graphic-designs`, { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1500);
  
  // Click on a postcard to flip it
  const ganeshCard = desktopPage.locator('.polaroid-item').first();
  if (await ganeshCard.isVisible()) {
    console.log('Clicking postcard to flip...');
    await ganeshCard.click();
    await desktopPage.waitForTimeout(1000);
    
    // Check if scattered polaroid gallery appears
    const scatterStage = desktopPage.locator('.polaroid-scatter-stage');
    const isScatterVisible = await scatterStage.isVisible();
    console.log('Scattered Polaroid Stage visible:', isScatterVisible);
    
    const frames = await desktopPage.locator('.scattered-polaroid-frame').count();
    console.log('Scattered frames count:', frames);
    
    // Check rotation on slots
    const slots = await desktopPage.locator('.scattered-polaroid-item').evaluateAll(els => 
      els.map(el => window.getComputedStyle(el).transform)
    );
    console.log('Rotations/Transforms applied:', slots.slice(0, 3));
    
    // Check img object-fit
    const imgFits = await desktopPage.locator('.scattered-img').evaluateAll(imgs =>
      imgs.map(img => window.getComputedStyle(img).objectFit)
    );
    console.log('Image object-fits:', imgFits.slice(0, 3));
    
    await desktopPage.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verify_flipped_postcard_desktop.png' });
  }

  // Same on Mobile
  await mobilePage.goto(`${BASE_URL}/work.html#work/graphic-designs`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1500);
  const mobileCard = mobilePage.locator('.polaroid-item').first();
  if (await mobileCard.isVisible()) {
    await mobileCard.click();
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/verify_flipped_postcard_mobile.png' });
    console.log('Mobile flipped postcard captured.');
  }

  await browser.close();
  console.log('\n--- VERIFICATION COMPLETED ---');
}

testWebsite().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
