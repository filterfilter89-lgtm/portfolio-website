import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  console.log('Verifying Figma SVG against live mobile screenshots...');
  const browser = await chromium.launch({
    executablePath: 'C:/Users/basil/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
  });

  const page = await browser.newPage({
    viewport: { width: 2200, height: 2200 },
    deviceScaleFactor: 2
  });

  const svgPath = 'C:/Users/basil/Documents/WEBSITE PORTFOLIO/WEBSITE_PORTFOLIO_FIGMA_MOBILE_DESIGN.svg';
  const outDir = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/scratch/mobile_compare';

  // Load SVG directly
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: #0b1320; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `);

  await page.waitForTimeout(2000);

  // Artboard regions
  const artboards = [
    { id: '01_hero_start', x: 80, y: 80, live: '01_live_hero_start.png' },
    { id: '02_hero_end', x: 560, y: 80, live: '02_live_hero_end.png' },
    { id: '03_carousel', x: 1040, y: 80, live: '03_live_carousel.png' },
    { id: '04_desk', x: 1520, y: 80, live: '04_live_desk_graphic_designs.png' },
    { id: '05_flipped', x: 80, y: 1050, live: '05_live_flipped_ganesh.png' },
    { id: '06_modal', x: 560, y: 1050, live: '06_live_inspect_modal.png' },
    { id: '07_video', x: 1040, y: 1050, live: '08_live_flipped_video.png' }
  ];

  for (const ab of artboards) {
    const shotPath = path.join(outDir, `figma_${ab.id}.png`);
    await page.screenshot({
      path: shotPath,
      clip: { x: ab.x, y: ab.y, width: 393, height: 852 }
    });
    console.log(`Captured ${shotPath}`);
  }

  // Full Figma canvas overview
  await page.screenshot({
    path: path.join(outDir, 'figma_full_canvas_overview.png'),
    clip: { x: 0, y: 0, width: 2000, height: 2050 }
  });

  await browser.close();
  console.log('Figma rendering verification complete!');
})();
