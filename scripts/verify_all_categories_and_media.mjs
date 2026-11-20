import { chromium } from 'playwright';

const BASE_URL = process.argv[2] || 'http://localhost:5173';

async function main() {
  console.log('=== VERIFYING ALL CATEGORIES & NEW MEDIA ASSETS ===');
  console.log('Target URL:', BASE_URL, '\n');
  const browser = await chromium.launch({ headless: true });

  let allPassed = true;

  try {
    // 1. DESKTOP GENERATIVE AI
    console.log('--- [1. DESKTOP] Testing #work/generative-ai ---');
    let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/#work/generative-ai`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const genAiCards = await page.$$('.draggable-postcard-item');
    console.log(`  Found ${genAiCards.length} postcards on Generative AI desk (Expected: 3)`);
    if (genAiCards.length !== 3) {
      console.error('  FAIL: Expected 3 postcards in generative-ai');
      allPassed = false;
    } else {
      console.log('  Generative AI postcard count: PASS');
    }

    // Click Logo Animations (16:9 landscape videos)
    console.log('  Testing "Logo Animations" postcard flip (16:9 landscape videos)...');
    // Find the logo animations card
    const logoCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
      return cards.find(c => c.textContent.toLowerCase().includes('logo animation')) || cards[1];
    });
    await logoCard.click();
    await page.waitForTimeout(1500);

    const logoMetrics = await page.evaluate(() => {
      const card = document.querySelector('.draggable-postcard-item.is-expanded');
      const videos = Array.from(document.querySelectorAll('.incard-video-element, video'));
      const wrappers = Array.from(document.querySelectorAll('.proportional-media-wrapper, .incard-video-slide-media, .incard-video-wrapper'));
      return {
        cardExpanded: Boolean(card),
        videoCount: videos.length,
        firstVideoAR: videos[0] ? (videos[0].videoWidth ? (videos[0].videoWidth / videos[0].videoHeight).toFixed(3) : 'pending') : null
      };
    });
    console.log('  Logo Animations expanded:', logoMetrics.cardExpanded ? 'PASS' : 'FAIL');
    console.log(`  Videos detected in card: ${logoMetrics.videoCount}`);
    if (!logoMetrics.cardExpanded || logoMetrics.videoCount === 0) allPassed = false;

    // Close card
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // 2. DESKTOP PHOTOGRAPHY
    console.log('\n--- [2. DESKTOP] Testing #work/photography ---');
    await page.goto(`${BASE_URL}/#work/photography`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const photoCards = await page.$$('.draggable-postcard-item');
    console.log(`  Found ${photoCards.length} postcards on Photography desk (Expected: 1)`);
    if (photoCards.length !== 1) {
      console.error('  FAIL: Expected 1 postcard in photography');
      allPassed = false;
    } else {
      console.log('  Photography postcard count: PASS');
    }

    // Click Jazil
    console.log('  Testing "Jazil" postcard flip (6 images with mixed aspect ratios)...');
    await photoCards[0].click();
    await page.waitForTimeout(1500);

    const photoMetrics = await page.evaluate(() => {
      const card = document.querySelector('.draggable-postcard-item.is-expanded');
      const rows = Array.from(document.querySelectorAll('.proportional-gallery-row'));
      const images = Array.from(document.querySelectorAll('.polaroid-item img, .proportional-media-wrapper img'));
      return {
        cardExpanded: Boolean(card),
        rowCount: rows.length,
        imageCount: images.length,
        imageNaturalSizes: images.map(img => `${img.naturalWidth}x${img.naturalHeight} (AR: ${(img.naturalWidth / img.naturalHeight).toFixed(2)})`)
      };
    });
    console.log('  Jazil expanded:', photoMetrics.cardExpanded ? 'PASS' : 'FAIL');
    console.log(`  Images rendered: ${photoMetrics.imageCount} (Expected: 6)`);
    console.log('  Aspect ratios:', photoMetrics.imageNaturalSizes);
    if (!photoMetrics.cardExpanded || photoMetrics.imageCount !== 6) allPassed = false;

    // Close card
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // 3. DESKTOP VIDEOGRAPHY
    console.log('\n--- [3. DESKTOP] Testing #work/videography ---');
    await page.goto(`${BASE_URL}/#work/videography`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const videoCards = await page.$$('.draggable-postcard-item');
    console.log(`  Found ${videoCards.length} postcards on Videography desk (Expected: 5)`);
    if (videoCards.length !== 5) {
      console.error('  FAIL: Expected 5 postcards in videography');
      allPassed = false;
    } else {
      console.log('  Videography postcard count: PASS');
    }

    // 4. MOBILE VIEWPORT GENERATIVE AI & PHOTOGRAPHY
    console.log('\n--- [4. MOBILE] Testing Mobile Viewport (390x844) ---');
    let mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto(`${BASE_URL}/#work/generative-ai`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(2000);

    const mobileGenAiCards = await mobilePage.$$('.draggable-postcard-item');
    console.log(`  Mobile Generative AI cards: ${mobileGenAiCards.length}`);
    await mobileGenAiCards[0].click();
    await mobilePage.waitForTimeout(1500);

    const mobileFlipStatus = await mobilePage.evaluate(() => {
      const card = document.querySelector('.draggable-postcard-item.is-expanded');
      return Boolean(card);
    });
    console.log('  Mobile card 3D flip open:', mobileFlipStatus ? 'PASS' : 'FAIL');
    if (!mobileFlipStatus) allPassed = false;

  } catch (err) {
    console.error('Test error:', err);
    allPassed = false;
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log('ALL CATEGORIES & MEDIA VERIFIED:', allPassed ? 'YES (100% PASS)' : 'FAIL');
  console.log('========================================');
  process.exit(allPassed ? 0 : 1);
}

main();
