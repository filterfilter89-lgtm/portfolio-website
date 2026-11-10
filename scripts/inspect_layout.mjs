import { chromium } from 'playwright';

async function inspectLayout() {
  const browser = await chromium.launch({ headless: true });
  
  // Test Desktop 1440x900
  console.log('--- Inspecting Desktop 1440x900 ---');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/work.html#work/graphic-designs', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Check Desk Postcards (unflipped)
  const deskCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.draggable-postcard-item'));
    return cards.map((c, i) => {
      const r = c.getBoundingClientRect();
      return { index: i, text: c.innerText.slice(0, 30), rect: { left: r.left, top: r.top, width: r.width, height: r.height, right: r.right, bottom: r.bottom } };
    });
  });
  console.log('Desk postcards count:', deskCards.length);
  deskCards.forEach(c => console.log(` Card ${c.index}: ${c.rect.width}x${c.rect.height} at (${c.rect.left.toFixed(1)}, ${c.rect.top.toFixed(1)})`));

  // Check overlap among desk postcards
  let deskOverlaps = 0;
  for (let i = 0; i < deskCards.length; i++) {
    for (let j = i + 1; j < deskCards.length; j++) {
      const a = deskCards[i].rect;
      const b = deskCards[j].rect;
      const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      if (xOverlap > 10 && yOverlap > 10) {
        deskOverlaps++;
        console.log(` Desk Overlap between ${i} and ${j}: ${xOverlap.toFixed(1)}x${yOverlap.toFixed(1)}px`);
      }
    }
  }
  console.log('Total Desk Overlaps:', deskOverlaps);

  // 2. Open Eazyarts Ganesh (5 images)
  const ganeshCard = page.locator('.draggable-postcard-item').first();
  await ganeshCard.click();
  await page.waitForTimeout(1500);

  // Inspect flipped card contents
  const flippedGanesh = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.scattered-polaroid-item'));
    const imgs = Array.from(document.querySelectorAll('.scattered-img'));
    return items.map((it, i) => {
      const r = it.getBoundingClientRect();
      const img = imgs[i];
      const imgR = img ? img.getBoundingClientRect() : null;
      const naturalAR = img ? (img.naturalWidth / img.naturalHeight).toFixed(3) : 'none';
      const renderedAR = imgR ? (imgR.width / imgR.height).toFixed(3) : 'none';
      return {
        index: i,
        itemRect: { left: r.left.toFixed(1), top: r.top.toFixed(1), width: r.width.toFixed(1), height: r.height.toFixed(1), right: r.right.toFixed(1), bottom: r.bottom.toFixed(1) },
        naturalAR,
        renderedAR,
        arDiff: imgR ? Math.abs((img.naturalWidth / img.naturalHeight) - (imgR.width / imgR.height)).toFixed(4) : 0
      };
    });
  });
  console.log('\nFlipped Ganesh items count:', flippedGanesh.length);
  flippedGanesh.forEach(it => {
    console.log(` Item ${it.index}: ${it.itemRect.width}x${it.itemRect.height} at (${it.itemRect.left}, ${it.itemRect.top}) | naturalAR=${it.naturalAR} renderedAR=${it.renderedAR} arDiff=${it.arDiff}`);
  });

  // Check overlap among flipped items
  let flippedOverlaps = 0;
  for (let i = 0; i < flippedGanesh.length; i++) {
    for (let j = i + 1; j < flippedGanesh.length; j++) {
      const a = flippedGanesh[i].itemRect;
      const b = flippedGanesh[j].itemRect;
      const xOverlap = Math.max(0, Math.min(parseFloat(a.right), parseFloat(b.right)) - Math.max(parseFloat(a.left), parseFloat(b.left)));
      const yOverlap = Math.max(0, Math.min(parseFloat(a.bottom), parseFloat(b.bottom)) - Math.max(parseFloat(a.top), parseFloat(b.top)));
      if (xOverlap > 5 && yOverlap > 5) {
        flippedOverlaps++;
        console.log(` Flipped Overlap between ${i} and ${j}: ${xOverlap.toFixed(1)}x${yOverlap.toFixed(1)}px`);
      }
    }
  }
  console.log('Total Flipped Ganesh Overlaps:', flippedOverlaps);

  await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/inspect_ganesh_desktop.png' });

  // 3. Close and open Videography
  await page.goto('http://localhost:5173/work.html#work/videography', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const videoCard = page.locator('.draggable-postcard-item').first();
  await videoCard.click();
  await page.waitForTimeout(1500);

  const videoMetrics = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video.in-card-video-element'));
    return videos.map((v, i) => {
      const r = v.getBoundingClientRect();
      const parentR = v.parentElement ? v.parentElement.getBoundingClientRect() : null;
      return {
        index: i,
        videoW: r.width.toFixed(1),
        videoH: r.height.toFixed(1),
        videoAR: (r.width / r.height).toFixed(3),
        parentW: parentR ? parentR.width.toFixed(1) : 'none',
        parentH: parentR ? parentR.height.toFixed(1) : 'none',
        videoNatW: v.videoWidth,
        videoNatH: v.videoHeight
      };
    });
  });
  console.log('\nVideography in-card videos:', videoMetrics);
  await page.screenshot({ path: 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/inspect_videography_desktop.png' });

  await browser.close();
}

inspectLayout().catch(e => console.error(e));
