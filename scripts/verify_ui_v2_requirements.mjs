import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const brainDir = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function run() {
  console.log('--- STARTING PLAYWRIGHT VERIFICATION FOR UI REFINEMENTS V2 ---');
  const browser = await chromium.launch({ headless: true });

  // 1. DESKTOP TEST
  console.log('\n[1/3] Testing Desktop Views...');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Navigate to landing page
  await page.goto('http://localhost:5173/#reel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Check Sound Toggle is completely absent
  const soundBtn = await page.$('.sound-toggle-btn');
  console.log('Sound toggle in DOM:', soundBtn ? 'Present' : 'Completely removed from DOM (PASS)');

  // Check Hamburger resting state: transparent, borderless, no box-shadow
  const hamburgerPill = await page.$('.nav-morph-pill');
  if (hamburgerPill) {
    const pillStyles = await hamburgerPill.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        borderStyle: s.borderStyle,
        boxShadow: s.boxShadow,
        color: s.color,
        backdropFilter: s.backdropFilter || s.webkitBackdropFilter
      };
    });
    console.log('Desktop #reel Hamburger Resting Styles:');
    console.log('  bg:', pillStyles.bg);
    console.log('  borderStyle:', pillStyles.borderStyle);
    console.log('  boxShadow:', pillStyles.boxShadow);
    console.log('  color:', pillStyles.color);
    console.log('  backdropFilter:', pillStyles.backdropFilter);
  }

  // Open Hamburger menu and check backdrop blur
  console.log('\nTesting Hamburger Open state & Backdrop blur...');
  const hamburgerToggle = await page.$('.nav-morph-toggle');
  await hamburgerToggle.click();
  await page.waitForTimeout(400);

  const backdrop = await page.$('.nav-morph-backdrop');
  if (backdrop) {
    const bdStyles = await backdrop.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        backdropFilter: s.backdropFilter || s.webkitBackdropFilter
      };
    });
    console.log('Backdrop on Hamburger Open:');
    console.log('  bg:', bdStyles.bg);
    console.log('  backdropFilter:', bdStyles.backdropFilter);
  }
  await page.screenshot({ path: `${brainDir}/v2_verified_desktop_menu_open.png` });

  // Close Hamburger menu
  await hamburgerToggle.click();
  await page.waitForTimeout(400);

  // Navigate to #work (Beige overview)
  console.log('\nNavigating to #work...');
  await page.goto('http://localhost:5173/#work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const backBtn = await page.$('.clean-back-btn');
  if (backBtn) {
    const backStyles = await backBtn.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        borderStyle: s.borderStyle,
        boxShadow: s.boxShadow,
        color: s.color
      };
    });
    console.log('Back Button on #work (Beige overview):');
    console.log('  bg:', backStyles.bg);
    console.log('  borderStyle:', backStyles.borderStyle);
    console.log('  boxShadow:', backStyles.boxShadow);
    console.log('  color:', backStyles.color);
  }

  // Navigate to #work/videography (Showcase Desk - Deep Blue background)
  console.log('\nNavigating to #work/videography (Showcase Desk)...');
  await page.goto('http://localhost:5173/#work/videography', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800); // Allow album mouth to open and postcards to scatter

  const backBtnShowcase = await page.$('.clean-back-btn');
  const hamShowcase = await page.$('.nav-morph-pill');
  if (backBtnShowcase && hamShowcase) {
    const backColor = await backBtnShowcase.evaluate(el => window.getComputedStyle(el).color);
    const hamColor = await hamShowcase.evaluate(el => window.getComputedStyle(el).color);
    console.log('Color Flipping on Blue Desk:');
    console.log('  Back Button color:', backColor);
    console.log('  Hamburger color:', hamColor);
  }

  // Click a postcard in Videography to test flip and media card styling
  console.log('\nClicking a postcard in Videography to test flip and media card styling...');
  await page.waitForSelector('.draggable-postcard-item', { timeout: 5000 });
  const postcards = await page.$$('.draggable-postcard-item');
  console.log(`Found ${postcards.length} postcards on desk.`);
  if (postcards.length > 0) {
    await postcards[0].click();
    await page.waitForTimeout(1200);

    // Inspect flipped card media styling
    const mediaFrame = await page.$('.scattered-polaroid-frame');
    if (mediaFrame) {
      const frameStyles = await mediaFrame.evaluate(el => {
        const s = window.getComputedStyle(el);
        return {
          borderRadius: s.borderRadius,
          border: s.border,
          borderColor: s.borderColor,
          borderWidth: s.borderWidth,
          bg: s.backgroundColor,
          padding: s.padding,
          boxShadow: s.boxShadow,
          overflow: s.overflow
        };
      });
      console.log('Flipped Media Card Styles:');
      console.log('  borderRadius:', frameStyles.borderRadius);
      console.log('  border:', frameStyles.border);
      console.log('  borderWidth:', frameStyles.borderWidth);
      console.log('  borderColor:', frameStyles.borderColor);
      console.log('  bg:', frameStyles.bg);
      console.log('  padding:', frameStyles.padding);
      console.log('  boxShadow:', frameStyles.boxShadow);
      console.log('  overflow:', frameStyles.overflow);
    }

    const chin = await page.$('.scattered-chin');
    console.log('  chin element in DOM:', chin ? 'Present' : 'NOT PRESENT (PASS)');

    await page.screenshot({ path: `${brainDir}/v2_verified_desktop_flipped_card.png` });
  }

  // 2. MOBILE TEST
  console.log('\n[2/3] Testing Mobile Phone View (iPhone 14 / 390x844)...');
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  await mobilePage.goto('http://localhost:5173/#work/videography', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1800);

  console.log('Clicking postcard on Mobile...');
  await mobilePage.waitForSelector('.draggable-postcard-item', { timeout: 5000 });
  const mobileCards = await mobilePage.$$('.draggable-postcard-item');
  if (mobileCards.length > 0) {
    await mobileCards[0].click();
    await mobilePage.waitForTimeout(1200);

    const frontFace = await mobilePage.$('.postcard-side-front');
    const backFace = await mobilePage.$('.postcard-side-back');

    if (frontFace && backFace) {
      const frontVis = await frontFace.evaluate(el => window.getComputedStyle(el).visibility);
      const backVis = await backFace.evaluate(el => window.getComputedStyle(el).visibility);
      const backBox = await backFace.boundingBox();

      console.log('Mobile 3D Backface Culling & Visibility:');
      console.log('  Front Face visibility:', frontVis);
      console.log('  Back Face visibility:', backVis);
      console.log('  Back Face dimensions:', backBox ? `${backBox.width}x${backBox.height}` : 'null');
    }

    const videoElem = await mobilePage.$('.in-card-video-element');
    const imgElem = await mobilePage.$('.scattered-img');
    const media = videoElem || imgElem;

    if (media) {
      const mediaBox = await media.boundingBox();
      const mediaAttrs = await media.evaluate(el => ({
        tag: el.tagName,
        loading: el.getAttribute('loading'),
        decoding: el.getAttribute('decoding'),
        playsInline: el.getAttribute('playsinline') !== null || el.playsInline,
        webkitPlaysInline: el.getAttribute('webkit-playsinline')
      }));
      console.log('Mobile Flipped Media Element:');
      console.log('  Tag:', mediaAttrs.tag);
      console.log('  BoundingBox:', mediaBox ? `${mediaBox.width}x${mediaBox.height}` : 'null');
      console.log('  Attributes:', mediaAttrs);
    }

    await mobilePage.screenshot({ path: `${brainDir}/v2_verified_mobile_flipped_card.png` });
  }

  // 3. CONTACT VIEW TEST
  console.log('\n[3/3] Testing Contact View (#contact)...');
  await page.goto('http://localhost:5173/#contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const contactBack = await page.$('.clean-back-btn');
  if (contactBack) {
    const cbStyles = await contactBack.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        borderStyle: s.borderStyle,
        boxShadow: s.boxShadow,
        color: s.color
      };
    });
    console.log('Contact Page Back Button:');
    console.log('  bg:', cbStyles.bg);
    console.log('  borderStyle:', cbStyles.borderStyle);
    console.log('  boxShadow:', cbStyles.boxShadow);
    console.log('  color:', cbStyles.color);
  }
  await page.screenshot({ path: `${brainDir}/v2_verified_contact_page.png` });

  await browser.close();
  console.log('\n=== ALL PLAYWRIGHT VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
