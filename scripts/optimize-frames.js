const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve('C:/Users/basil/Documents/website/NEW WEBSITE/landpage/upscayl_png_upscayl-standard-4x_4x');
const TARGET_DIRS = [
  path.resolve(__dirname, '../public/frames'),
  path.resolve(__dirname, '../frames'),
  path.resolve('C:/Users/basil/Documents/website/portfolio/public/frames'),
  path.resolve('C:/Users/basil/Documents/website/portfolio/frames')
];

const TOTAL_FRAMES = 49;
const TARGET_WIDTH = 2560;
const TARGET_HEIGHT = 1440;
const WEBP_QUALITY = 85;

async function run() {
  console.log(`Starting frame optimization: ${TOTAL_FRAMES} frames...`);
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Target Resolution: ${TARGET_WIDTH}x${TARGET_HEIGHT} (Lanczos3)`);
  console.log(`Format: WebP (Quality ${WEBP_QUALITY})`);

  // Ensure target directories exist
  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const startTime = Date.now();
  let totalBytes = 0;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const padded = String(i).padStart(2, '0');
    const inputPath = path.join(SOURCE_DIR, `web${padded}.png`);
    const outputFilename = `web${padded}.webp`;

    if (!fs.existsSync(inputPath)) {
      console.warn(`Warning: File not found: ${inputPath}`);
      continue;
    }

    const t0 = Date.now();
    const buffer = await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'cover',
        kernel: sharp.kernel.lanczos3
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();

    totalBytes += buffer.length;

    for (const dir of TARGET_DIRS) {
      fs.writeFileSync(path.join(dir, outputFilename), buffer);
    }

    const elapsed = Date.now() - t0;
    const kb = (buffer.length / 1024).toFixed(1);
    console.log(`[${i + 1}/${TOTAL_FRAMES}] ${outputFilename} - ${kb} KB (${elapsed}ms)`);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`\nOptimization Complete!`);
  console.log(`Processed: ${TOTAL_FRAMES} frames in ${totalTime}s`);
  console.log(`Total sequence size: ${totalMB} MB (down from ~955 MB)`);
  console.log(`Average frame size: ${(totalBytes / TOTAL_FRAMES / 1024).toFixed(1)} KB`);
}

run().catch(err => {
  console.error('Error during optimization:', err);
  process.exit(1);
});
