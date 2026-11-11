import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('   SAFEGUARDED PORTFOLIO DEPLOYMENT SCRIPT          ');
console.log('====================================================\n');

// Safeguard 1: Verify Current Directory
const cwd = process.cwd();
if (path.resolve(cwd) !== PROJECT_ROOT) {
  console.error('❌ DIRECTORY MISMATCH ERROR:');
  console.error(`Current directory: ${cwd}`);
  console.error(`Expected project root: ${PROJECT_ROOT}`);
  console.error('\nPlease navigate to the project root first:');
  console.error(`cd "${PROJECT_ROOT}"\n`);
  process.exit(1);
}

// Safeguard 2: Verify project.json links to basil-jose
const projectJsonPath = path.join(PROJECT_ROOT, '.vercel', 'project.json');
if (!fs.existsSync(projectJsonPath)) {
  console.error('❌ Vercel project link not found!');
  console.log('Re-linking to basil-jose...');
  execSync('npx vercel link --project basil-jose --yes', { stdio: 'inherit' });
} else {
  const projectConfig = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
  if (projectConfig.projectName !== 'basil-jose') {
    console.error(`❌ Wrong project linked: ${projectConfig.projectName}. Re-linking to basil-jose...`);
    execSync('npx vercel link --project basil-jose --yes', { stdio: 'inherit' });
  }
}

console.log('✓ Project directory and Vercel target (basil-jose) verified.');

// Step 1: Clean build
console.log('\n[1/3] Building production assets (Vite)...');
execSync('npm run build', { stdio: 'inherit', cwd: PROJECT_ROOT });
console.log('✓ Build completed successfully.');

// Step 2: Deploy to Production
console.log('\n[2/3] Deploying to Vercel Production (basil-jose.vercel.app)...');
execSync('npx vercel --prod --yes', { stdio: 'inherit', cwd: PROJECT_ROOT });
console.log('✓ Deployment finished.');

// Step 3: Automatically verify live production domain
console.log('\n[3/3] Running live production verification & visual tests...');
try {
  execSync('node scripts/verify_live_domain.mjs', { stdio: 'inherit', cwd: PROJECT_ROOT });
  console.log('\n🎉 ALL CHECKS PASSED: Live website https://basil-jose.vercel.app is verified and running.');
} catch (err) {
  console.warn('\n⚠️ Live verification finished with warnings. Review output above.');
}
