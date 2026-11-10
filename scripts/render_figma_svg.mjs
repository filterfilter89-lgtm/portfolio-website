import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_DIR = 'C:/Users/basil/Documents/WEBSITE PORTFOLIO';
const ARTIFACT_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';
const svgPath = path.join(BASE_DIR, 'WEBSITE_PORTFOLIO_FIGMA_MOBILE_DESIGN.svg');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/basil/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe'
  });
  const page = await browser.newPage({
    viewport: { width: 1500, height: 3050 },
    deviceScaleFactor: 1
  });

  const svgContent = fs.readFileSync(svgPath, 'utf8');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background: #0b1320; overflow: hidden; }
          svg { display: block; width: 1500px; height: 3050px; }
        </style>
      </head>
      <body>
        ${svgContent}
      </body>
    </html>
  `, { waitUntil: 'networkidle' });

  await page.waitForTimeout(1000);

  const outPath = path.join(ARTIFACT_DIR, 'figma_full_canvas_overview.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved canvas screenshot to:', outPath);

  await browser.close();
  console.log('Render script completed successfully!');
})();
