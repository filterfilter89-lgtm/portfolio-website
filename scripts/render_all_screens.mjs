import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENS_DIR = 'C:/Users/basil/Documents/WEBSITE PORTFOLIO/figma_mobile_screens';
const ARTIFACTS_DIR = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9';

async function renderAllScreens() {
  const browser = await chromium.launch({ headless: true });
  const files = fs.readdirSync(SCREENS_DIR).filter(f => f.endsWith('.svg'));
  
  for (const f of files) {
    const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
    const fullPath = path.join(SCREENS_DIR, f);
    await page.goto(`file://${fullPath}`, { waitUntil: 'load' });
    const outName = f.replace('.svg', '.png');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, `screen_${outName}`) });
    console.log(`Rendered: screen_${outName}`);
    await page.close();
  }
  
  await browser.close();
  console.log('All screens rendered successfully!');
}

renderAllScreens();
