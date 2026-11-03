import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function run(cmd) {
  try {
    return execSync(cmd, { cwd: projectRoot, encoding: 'utf8', stdio: 'pipe' });
  } catch (err) {
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    throw err;
  }
}

async function sync() {
  console.log('[AUTO-SYNC] Checking repository status...');
  
  const status = run('git status --porcelain').trim();
  if (!status) {
    console.log('[AUTO-SYNC] Working tree clean. Pushing any pending commits to GitHub...');
    try {
      run('git push origin main');
      console.log('[AUTO-SYNC] Everything up to date on GitHub.');
    } catch (e) {
      console.log('[AUTO-SYNC] Nothing new to push or already synced.');
    }
    return;
  }

  console.log('[AUTO-SYNC] Changes detected:');
  console.log(status);

  console.log('[AUTO-SYNC] Staging changes...');
  run('git add -A');

  const commitMsg = process.argv.slice(2).join(' ') || `Update portfolio: ${new Date().toISOString()}`;
  console.log(`[AUTO-SYNC] Committing: "${commitMsg}"...`);
  run(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);

  console.log('[AUTO-SYNC] Pushing to GitHub (origin/main)...');
  const pushOut = run('git push origin main');
  console.log(pushOut || '[AUTO-SYNC] Push successful!');
  console.log('[AUTO-SYNC] Changes pushed to GitHub! Vercel will now automatically deploy the live site.');
}

sync().catch(err => {
  console.error('[AUTO-SYNC ERROR]:', err.message);
  process.exit(1);
});

