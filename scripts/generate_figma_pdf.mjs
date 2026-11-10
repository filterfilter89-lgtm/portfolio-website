import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENS_DIR = 'C:/Users/basil/Documents/WEBSITE PORTFOLIO/figma_mobile_screens';
const PDF_OUTPUT = 'C:/Users/basil/Documents/WEBSITE PORTFOLIO/WEBSITE_PORTFOLIO_FIGMA_MOBILE_DESIGN.pdf';

const screens = [
  { file: '01_Mobile_Hero_Start.svg', title: '01 - Mobile Landing Hero' },
  { file: '02_Mobile_Reel_Play.svg', title: '02 - Reel Scrolled & Play Button' },
  { file: '03_Mobile_Albums_Carousel.svg', title: '03 - Vinyl Albums Carousel' },
  { file: '04_Mobile_Postcards_Desk.svg', title: '04 - Postcards Stack Desk' },
  { file: '05_Mobile_Flipped_Postcard.svg', title: '05 - Flipped Postcard (Scattered Work)' },
  { file: '06_Mobile_Lightbox_Inspect.svg', title: '06 - Bento Lightbox Modal' },
  { file: '07_Mobile_Videography_Player.svg', title: '07 - Videography Reel Player' },
  { file: '08_Mobile_Contact_Page.svg', title: '08 - Dedicated Contact Page' },
  { file: '09_Mobile_Hamburger_Menu_Open.svg', title: '09 - Hamburger Navigation Drawer' }
];

async function generatePDF() {
  console.log('Building HTML print document for 9 Figma mobile screens...');
  
  let pagesHtml = '';
  for (const s of screens) {
    const svgPath = path.join(SCREENS_DIR, s.file);
    if (!fs.existsSync(svgPath)) {
      console.error(`Missing SVG: ${svgPath}`);
      continue;
    }
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    // Remove <?xml ...?> from inner inline SVG
    const cleanSvg = svgContent.replace(/<\?xml[^>]*\?>/, '').trim();
    
    pagesHtml += `
      <div class="pdf-page" data-title="${s.title}">
        ${cleanSvg}
      </div>
    `;
  }
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Basil Jose - Mobile Portfolio Figma Design System</title>
        <style>
          @page {
            size: 393px 852px;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: #0b1320;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .pdf-page {
            width: 393px;
            height: 852px;
            page-break-after: always;
            break-after: page;
            overflow: hidden;
            position: relative;
            background: #fff7ed;
          }
          .pdf-page svg {
            width: 393px;
            height: 852px;
            display: block;
          }
        </style>
      </head>
      <body>
        ${pagesHtml}
      </body>
    </html>
  `;
  
  const tmpHtml = 'C:/Users/basil/Documents/WEBSITE PORTFOLIO/scripts/temp_pdf_builder.html';
  fs.writeFileSync(tmpHtml, htmlContent, 'utf8');
  
  console.log('Launching Chromium to compile vector PDF...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(`file://${tmpHtml}`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  
  await page.pdf({
    path: PDF_OUTPUT,
    width: '393px',
    height: '852px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  
  // Clean up temp HTML
  if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
  
  const stats = fs.statSync(PDF_OUTPUT);
  console.log(`SUCCESS: Multi-page Figma PDF created at ${PDF_OUTPUT} (${stats.size} bytes)`);
}

generatePDF().catch(err => {
  console.error('PDF Generation Error:', err);
  process.exit(1);
});
