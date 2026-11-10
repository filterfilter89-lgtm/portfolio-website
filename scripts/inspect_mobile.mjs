import { chromium } from 'playwright';

async function inspectMobile() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const projectsToTest = [
    { cat: 'graphic-designs', id: 'eazyarts-ganesh', name: 'Ganesh (5 items)' },
    { cat: 'graphic-designs', id: 'fetto-garments', name: 'Fetto (4 items)' },
    { cat: 'graphic-designs', id: 'fouz-travels', name: 'Fouz (2 items)' },
    { cat: 'graphic-designs', id: 'fruitly', name: 'Fruitly (8 items)' },
    { cat: 'videography', id: 'dot-store', name: 'Dot Store (2 videos)' },
    { cat: 'videography', id: 'eazyarts', name: 'Eazyarts (5 videos)' }
  ];

  for (const p of projectsToTest) {
    console.log(`\n--- Mobile Testing: ${p.name} ---`);
    await page.goto(`http://localhost:5173/work.html#work/${p.cat}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const card = page.locator(`.draggable-postcard-item`).filter({ hasText: p.name.split(' ')[0] }).first();
    if (await card.isVisible()) {
      await card.click();
      await page.waitForTimeout(1500);

      const res = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.scattered-polaroid-item'));
        const cardBack = document.querySelector('.postcard-side-back');
        const cardRect = cardBack ? cardBack.getBoundingClientRect() : null;

        const itemBoxes = items.map((it, i) => {
          const r = it.getBoundingClientRect();
          const img = it.querySelector('img.scattered-img');
          const vid = it.querySelector('video.in-card-video-element');
          let natAR = null;
          let rendAR = null;
          if (img) {
            natAR = img.naturalWidth / img.naturalHeight;
            const ir = img.getBoundingClientRect();
            rendAR = ir.width / ir.height;
          } else if (vid) {
            natAR = vid.videoWidth ? vid.videoWidth / vid.videoHeight : 9 / 16;
            const vr = vid.getBoundingClientRect();
            rendAR = vr.width / vr.height;
          }
          return {
            i,
            r: { left: r.left, top: r.top, width: r.width, height: r.height, right: r.right, bottom: r.bottom },
            natAR: natAR ? natAR.toFixed(3) : 'none',
            rendAR: rendAR ? rendAR.toFixed(3) : 'none',
            arDiff: (natAR && rendAR) ? Math.abs(natAR - rendAR).toFixed(4) : '0'
          };
        });

        // Calculate 2D overlaps
        let overlaps = 0;
        const collisions = [];
        for (let a = 0; a < itemBoxes.length; a++) {
          for (let b = a + 1; b < itemBoxes.length; b++) {
            const b1 = itemBoxes[a].r;
            const b2 = itemBoxes[b].r;
            const dx = Math.max(0, Math.min(b1.right, b2.right) - Math.max(b1.left, b2.left));
            const dy = Math.max(0, Math.min(b1.bottom, b2.bottom) - Math.max(b1.top, b2.top));
            if (dx > 4 && dy > 4) {
              overlaps++;
              collisions.push({ a, b, dx: dx.toFixed(1), dy: dy.toFixed(1) });
            }
          }
        }

        return { cardRect, count: itemBoxes.length, itemBoxes, overlaps, collisions };
      });

      console.log(`Card count: ${res.count}, Overlaps: ${res.overlaps}`);
      if (res.collisions.length > 0) {
        console.log('Collisions:', res.collisions);
      }
      res.itemBoxes.forEach(it => {
        console.log(`  #${it.i}: ${it.r.width.toFixed(1)}x${it.r.height.toFixed(1)} at (${it.r.left.toFixed(1)}, ${it.r.top.toFixed(1)}) | natAR=${it.natAR} rendAR=${it.rendAR} diff=${it.arDiff}`);
      });

      await page.screenshot({ path: `C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/mobile_flipped_${p.id}.png` });
    } else {
      console.log(`Card not visible for ${p.name}`);
    }
  }

  await browser.close();
}

inspectMobile().catch(e => console.error(e));
