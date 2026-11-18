import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';

async function main() {
  console.log('=== STARTING DEEP VERIFICATION FOR ASPECT RATIOS & MEDIA PACKING ===\n');
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Test
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('--- [DESKTOP] Testing Graphic Designs: Eazyarts Ganesh (5 images) ---');
  await page.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Click first postcard (eazyarts-ganesh)
  const postcardsGD = await page.$$('.draggable-postcard-item');
  console.log('  Found', postcardsGD.length, 'postcards on graphic designs desk. Clicking first postcard...');
  await postcardsGD[0].click();
  await page.waitForTimeout(1500);

  const ganeshMetrics = await page.evaluate(() => {
    const card = document.querySelector('.draggable-postcard-item.is-expanded');
    const rows = Array.from(document.querySelectorAll('.proportional-gallery-row'));
    const wrappers = Array.from(document.querySelectorAll('.proportional-media-wrapper'));
    const images = Array.from(document.querySelectorAll('.proportional-media-img'));

    const rowDetails = rows.map((r, rIdx) => {
      const rBox = r.getBoundingClientRect();
      const items = Array.from(r.querySelectorAll('.proportional-media-wrapper')).map(it => {
        const b = it.getBoundingClientRect();
        return {
          width: Math.round(b.width),
          height: Math.round(b.height),
          ar: (b.width / b.height).toFixed(3)
        };
      });
      return {
        row: rIdx + 1,
        y: Math.round(rBox.top),
        height: Math.round(rBox.height),
        itemCount: items.length,
        items
      };
    });

    return {
      cardExpanded: Boolean(card),
      rowCount: rows.length,
      wrapperCount: wrappers.length,
      imageCount: images.length,
      rowDetails
    };
  });

  console.log('  Card expanded:', ganeshMetrics.cardExpanded ? 'PASS' : 'FAIL');
  console.log('  Row count:', ganeshMetrics.rowCount, '(Expected 2 rows for 5 items: 3+2)');
  console.log('  Items per row:');
  ganeshMetrics.rowDetails.forEach(r => {
    console.log(`    Row ${r.row} (${r.itemCount} items, height: ${r.height}px):`, r.items);
  });

  // Verify all items in row 1 have same height
  const row1Heights = ganeshMetrics.rowDetails[0]?.items.map(i => i.height) || [];
  const row1Uniform = row1Heights.length > 0 && row1Heights.every(h => Math.abs(h - row1Heights[0]) <= 1);
  console.log('  Row 1 heights are uniform:', row1Uniform ? 'PASS' : 'FAIL');

  // Verify all items in row 2 have same height
  const row2Heights = ganeshMetrics.rowDetails[1]?.items.map(i => i.height) || [];
  const row2Uniform = row2Heights.length > 0 && row2Heights.every(h => Math.abs(h - row2Heights[0]) <= 1);
  console.log('  Row 2 heights are uniform:', row2Uniform ? 'PASS' : 'FAIL');

  console.log('\n--- [DESKTOP] Testing Videography: Dot Store (2 vertical reels) ---');
  await page.goto(`${BASE_URL}/#work/videography`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const postcardsVideo = await page.$$('.draggable-postcard-item');
  console.log('  Found', postcardsVideo.length, 'postcards on videography desk. Clicking first postcard (Dot Store)...');
  await postcardsVideo[0].click();
  await page.waitForTimeout(1500);

  const dotStoreMetrics = await page.evaluate(() => {
    const card = document.querySelector('.draggable-postcard-item.is-expanded');
    const videos = Array.from(document.querySelectorAll('.in-card-video-element'));
    const wrappers = Array.from(document.querySelectorAll('.proportional-media-wrapper'));

    const items = wrappers.map(w => {
      const b = w.getBoundingClientRect();
      return {
        width: Math.round(b.width),
        height: Math.round(b.height),
        ar: (b.width / b.height).toFixed(3)
      };
    });

    return {
      cardExpanded: Boolean(card),
      wrapperCount: wrappers.length,
      videoCount: videos.length,
      items
    };
  });

  console.log('  Card expanded:', dotStoreMetrics.cardExpanded ? 'PASS' : 'FAIL');
  console.log('  Video count:', dotStoreMetrics.videoCount, '(Expected 2)');
  console.log('  Videos dimensions:', dotStoreMetrics.items);
  const isDotStore916 = dotStoreMetrics.items.every(it => Math.abs(parseFloat(it.ar) - 0.5625) < 0.05);
  console.log('  Videos preserve 9:16 aspect ratio (~0.563):', isDotStore916 ? 'PASS' : 'FAIL');

  // Test video toggle play/pause
  console.log('  Testing video toggle play/pause...');
  const firstVideo = await page.$('.in-card-video-element');
  const wasPlaying = await page.evaluate(v => !v.paused, firstVideo);
  console.log('    Video initially playing:', wasPlaying);
  const videoStage = await page.$('.in-card-video-stage');
  await videoStage.click();
  await page.waitForTimeout(400);
  const isPaused = await page.evaluate(v => v.paused, firstVideo);
  console.log('    Video paused after click:', isPaused ? 'PASS' : 'FAIL');
  // Card should still be open!
  const isCardOpenAfterVideoClick = await page.evaluate(() => Boolean(document.querySelector('.draggable-postcard-item.is-expanded')));
  console.log('    Card still open after video click:', isCardOpenAfterVideoClick ? 'PASS' : 'FAIL');

  // 2. Mobile Viewport Test (390 x 844 iPhone 12/13/14)
  console.log('\n--- [MOBILE] Testing Mobile Viewport (390 x 844) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto(`${BASE_URL}/#work/graphic-designs`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);

  const mobilePostcards = await mobilePage.$$('.draggable-postcard-item');
  console.log('  Found', mobilePostcards.length, 'postcards on mobile desk. Clicking first postcard...');
  await mobilePostcards[0].click();
  await mobilePage.waitForTimeout(1500);

  const mobileMetrics = await mobilePage.evaluate(() => {
    const card = document.querySelector('.draggable-postcard-item.is-expanded');
    const cardRect = card?.getBoundingClientRect();
    const wrappers = Array.from(document.querySelectorAll('.proportional-media-wrapper')).map(w => {
      const b = w.getBoundingClientRect();
      return {
        x: Math.round(b.x),
        y: Math.round(b.y),
        width: Math.round(b.width),
        height: Math.round(b.height),
        ar: (b.width / b.height).toFixed(3),
        insideCard: cardRect ? (
          b.left >= cardRect.left - 4 &&
          b.right <= cardRect.right + 4 &&
          b.top >= cardRect.top - 4 &&
          b.bottom <= cardRect.bottom + 4
        ) : false
      };
    });

    return {
      cardExpanded: Boolean(card),
      cardRect: cardRect ? { w: Math.round(cardRect.width), h: Math.round(cardRect.height) } : null,
      wrappers,
      allInsideCard: wrappers.every(w => w.insideCard)
    };
  });

  console.log('  Mobile card expanded:', mobileMetrics.cardExpanded ? 'PASS' : 'FAIL');
  console.log('  Mobile card size:', mobileMetrics.cardRect);
  console.log('  Mobile media items:');
  mobileMetrics.wrappers.forEach((w, i) => {
    console.log(`    Item ${i + 1}: ${w.width}x${w.height} (ar: ${w.ar}, inside card: ${w.insideCard})`);
  });
  console.log('  All items 100% contained inside mobile card frame:', mobileMetrics.allInsideCard ? 'PASS' : 'FAIL');

  await browser.close();

  const success = ganeshMetrics.cardExpanded && row1Uniform && row2Uniform && dotStoreMetrics.cardExpanded && isDotStore916 && isPaused && isCardOpenAfterVideoClick && mobileMetrics.cardExpanded && mobileMetrics.allInsideCard;

  console.log('\n========================================');
  console.log('ALL ASPECT RATIO & PACKING CHECKS:', success ? '100% PASS' : 'SOME CHECKS FAILED');
  console.log('========================================');
  process.exit(success ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
