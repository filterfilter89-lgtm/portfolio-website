const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TOTAL_FRAMES = 49;
const inputDir = path.join(__dirname, '..', 'public', 'frames');
const outputDir = path.join(__dirname, '..', 'public', 'frames-halftone');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Halftone configuration for 2560x1440 resolution:
// 45-degree angled dot matrix with pitch 7px and dot radius 2.0px.
// Accentuates deep risograph ink stippling without altering the base blue hue.
const pitch = 7.0;
const dotR = 2.0;

async function processFrame(index) {
  const padded = String(index).padStart(2, '0');
  const srcPath = path.join(inputDir, `web${padded}.webp`);
  const destPath = path.join(outputDir, `web${padded}.webp`);

  if (!fs.existsSync(srcPath)) {
    console.warn(`Frame ${srcPath} not found`);
    return;
  }

  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const buf = Buffer.from(data);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // 1. Untouched beige detection (background, paper, skin highlights):
      // In original artwork: beige paper is R: 250-255, G: 240-250, B: 230-240
      if (r > 215 && g > 205 && b > 190) {
        continue; // 100% untouched original pixel!
      }

      // 2. Halftone dot calculation on blue artwork:
      // 45-degree rotated coordinate system
      const u = (x * 0.7071 + y * 0.7071);
      const v = (-x * 0.7071 + y * 0.7071);
      const modU = ((u % pitch) + pitch) % pitch - pitch / 2;
      const modV = ((v % pitch) + pitch) % pitch - pitch / 2;
      const dist = Math.sqrt(modU * modU + modV * modV);

      if (dist < dotR) {
        // Deep ink density dot: gives physical screen-print ink texture
        // while preserving the brand blue tone
        buf[idx] = Math.max(10, Math.round(r * 0.5));
        buf[idx + 1] = Math.max(20, Math.round(g * 0.5));
        buf[idx + 2] = Math.max(40, Math.round(b * 0.6));
      }
    }
  }

  await sharp(buf, { raw: { width: w, height: h, channels: 3 } })
    .webp({ quality: 88, effort: 3 })
    .toFile(destPath);
}

async function main() {
  console.log(`Starting halftone generation for ${TOTAL_FRAMES} frames...`);
  const startTime = Date.now();

  // Process in batches of 4 for speed
  const concurrency = 4;
  for (let i = 0; i < TOTAL_FRAMES; i += concurrency) {
    const batch = [];
    for (let j = 0; j < concurrency && i + j < TOTAL_FRAMES; j++) {
      batch.push(processFrame(i + j));
    }
    await Promise.all(batch);
    const progress = Math.min(TOTAL_FRAMES, i + concurrency);
    process.stdout.write(`Processed ${progress}/${TOTAL_FRAMES} frames\r`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nCompleted all ${TOTAL_FRAMES} halftone frames in ${duration}s.`);
}

main().catch(err => {
  console.error('Error processing frames:', err);
  process.exit(1);
});
