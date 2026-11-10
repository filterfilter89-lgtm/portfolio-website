import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  const outDir = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/scratch/mobile_compare';

  console.log('--- 7. Videography Desk ---');
  await page.goto('http://localhost:5173/#work/videography', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '07_live_desk_videography.png') });

  const videoDeskMetrics = await page.evaluate(() => {
    const postcards = Array.from(document.querySelectorAll('.draggable-postcard-item')).map(p => {
      const r = p.getBoundingClientRect();
      const s = window.getComputedStyle(p);
      const title = p.querySelector('.postcard-project-title');
      const stampImg = p.querySelector('image');
      return {
        title: title ? title.innerText.trim() : '',
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        transform: s.transform,
        stampHref: stampImg ? stampImg.getAttribute('href') : ''
      };
    });
    return { postcards };
  });
  fs.writeFileSync(path.join(outDir, '07_video_desk_metrics.json'), JSON.stringify(videoDeskMetrics, null, 2));

  console.log('--- 8. Videography Flipped (Dot Store / In-Card Video Player) ---');
  const firstVideoCard = page.locator('.draggable-postcard-item').first();
  await firstVideoCard.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '08_live_flipped_video.png') });

  const videoPlayerMetrics = await page.evaluate(() => {
    const expandedCard = document.querySelector('.draggable-postcard-item.is-expanded') || document.querySelector('.postcard-inner-card.is-flipped');
    const video = document.querySelector('video');
    const controls = document.querySelector('.in-card-video-controls') || document.querySelector('.video-controls');
    return {
      expandedCard: expandedCard ? expandedCard.getBoundingClientRect() : null,
      video: video ? {
        rect: video.getBoundingClientRect(),
        src: video.src,
        paused: video.paused
      } : null,
      controls: controls ? controls.getBoundingClientRect() : null
    };
  });
  fs.writeFileSync(path.join(outDir, '08_video_player_metrics.json'), JSON.stringify(videoPlayerMetrics, null, 2));

  await browser.close();
  console.log('Videography extraction complete!');
})();
