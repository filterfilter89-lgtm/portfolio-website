import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- [PORTFOLIO HEALTH VERIFICATION] ---');

// 1. Check critical HTML entrypoints
const indexHtmlPath = path.join(rootDir, 'index.html');
const workHtmlPath = path.join(rootDir, 'work.html');

if (!fs.existsSync(indexHtmlPath) || !fs.existsSync(workHtmlPath)) {
  console.error('FAIL: Missing index.html or work.html');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
if (!indexContent.includes('id="root"')) {
  console.error('FAIL: index.html missing #root mount point');
  process.exit(1);
}
console.log('PASS: HTML entry points and #root mount point verified.');

// 2. Check dev server connection
function checkServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        resolve({ ok: res.statusCode === 200, status: res.statusCode, body });
      });
    });
    req.on('error', (err) => {
      resolve({ ok: false, error: err.message });
    });
    req.setTimeout(4000, () => {
      req.destroy();
      resolve({ ok: false, error: 'Timeout' });
    });
  });
}

const serverCheck = await checkServer('http://127.0.0.1:5173');
if (serverCheck.ok) {
  console.log(`PASS: Dev server active on http://localhost:5173 (HTTP ${serverCheck.status})`);
  
  // Verify API endpoint connectivity
  const apiCheck = await checkServer('http://127.0.0.1:5173/api/health');
  if (apiCheck.ok && apiCheck.body.includes('"status": "ok"')) {
    console.log(`PASS: Backend API active and responsive (/api/health HTTP 200)`);
  } else {
    console.warn(`WARN: Backend API check: ${apiCheck.error || apiCheck.status}`);
  }
} else {
  console.warn(`WARN: Dev server check: ${serverCheck.error || serverCheck.status} (Vite server may need launch)`);
}

console.log('--- ALL BASIC CHECKS COMPLETE ---');
process.exit(0);
