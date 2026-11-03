const { test, expect } = require('@playwright/test');

test('essential content and real work remain without sample clutter', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Basil Jose | Designer, Videographer & Photographer');
  await expect(page.locator('.hero-copy')).toContainText('BASIL JOSE');
  await expect(page.locator('.portfolio-link').first()).toHaveAttribute('href', 'https://bit.ly/4fL6q3q');
  await expect(page.locator('.contact-email')).toHaveAttribute('href', 'mailto:basiljose8989@gmail.com');
  await expect(page.getByRole('link', { name: 'INDIA +91 9778763750' })).toHaveAttribute('href', 'tel:+919778763750');
  await expect(page.getByRole('link', { name: 'UAE +971 547556624' })).toHaveAttribute('href', 'tel:+971547556624');
  await expect(page.locator('.project, .sample-notice, .marquee, img')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('CV details expand using mouse and keyboard', async ({ page }) => {
  await page.goto('/');
  const education = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Education' }) });
  await expect(education).not.toHaveAttribute('open', '');
  await education.locator('summary').click();
  await expect(education.locator('.detail-content')).toBeVisible();
  await expect(education).toContainText('Gulf Asian English School, Sharjah');
  await expect(education).toContainText('Presidency University');
  const toolkit = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Toolkit' }) });
  await toolkit.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(toolkit.locator('.detail-content')).toBeVisible();
  await expect(toolkit).toContainText('Premiere Pro');
  await page.locator('summary', { hasText: 'Languages' }).click();
  await expect(page.locator('.language-list li')).toHaveText(['English', 'Malayalam', 'Hindi']);
});

test('record and sound controls toggle independently', async ({ page }) => {
  await page.goto('/');
  const record = page.locator('#record-control');
  await record.click();
  await expect(record).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#vinyl')).toHaveClass(/is-paused/);
  await record.click();
  await expect(record).toHaveAttribute('aria-pressed', 'true');
  const sound = page.locator('#sound-toggle');
  await sound.click();
  await expect(sound).toHaveAttribute('aria-pressed', 'true');
  await sound.click();
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
});

test('album reveals its vinyl on hover and keyboard focus', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo({ top: document.getElementById('work').offsetTop, behavior: 'instant' });
  });
  const album = page.locator('.portfolio-link').first();
  const record = album.locator('.album-vinyl');
  const cover = album.locator('.poster-cover');
  await expect(record).toHaveCSS('transform', 'none');
  await page.locator('#work-title').hover();
  await album.hover({ position: { x: 120, y: 150 } });
  await expect.poll(async () => (await cover.boundingBox()).y - (await record.boundingBox()).y).toBeGreaterThan(50);
  await page.mouse.move(0, 0);
  await album.focus();
  await expect.poll(async () => (await cover.boundingBox()).y - (await record.boundingBox()).y).toBeGreaterThan(50);
});

test('clicking the exposed vinyl opens the poster portfolio', async ({ page, context }) => {
  await context.route('https://bit.ly/4fL6q3q', route => route.fulfill({ contentType: 'text/html', body: '<title>Poster portfolio</title>' }));
  await page.goto('/');
  const album = page.locator('.portfolio-link').first();
  await album.hover();
  const popupPromise = page.waitForEvent('popup');
  await album.locator('.album-vinyl').click({ position: { x: 140, y: 25 } });
  const popup = await popupPromise;
  await expect(popup).toHaveURL('https://bit.ly/4fL6q3q');
});

test('touch album opens with a single tap', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await context.route('https://bit.ly/4fL6q3q', route => route.fulfill({ contentType: 'text/html', body: '<title>Poster portfolio</title>' }));
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173');
  await expect(page.locator('.album-vinyl').first()).not.toHaveCSS('transform', 'none');
  const popupPromise = page.waitForEvent('popup');
  await page.locator('.poster-cover').first().tap();
  await expect(await popupPromise).toHaveURL('https://bit.ly/4fL6q3q');
  await context.close();
});

test('email copy confirms success and handles denied access', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('basiljose8989@gmail.com');
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); };
  });
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByRole('status')).toHaveText('Select the email to copy');
});

test('palette derives exclusively from blue and cream', async ({ page }) => {
  await page.goto('/');
  const css = await (await page.request.get('/styles.css')).text();
  expect([...new Set(css.match(/#[0-9a-f]{3,8}\b/gi))].sort()).toEqual(['#285991', '#FFF7ED']);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 247, 237)');
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(40, 89, 145)');
  await expect(page.locator('.record-label')).toHaveCSS('background-color', 'rgb(255, 247, 237)');
  await expect(page.locator('#work')).toHaveCSS('background-color', 'rgb(40, 89, 145)');
  await expect(page.locator('#work-title')).toHaveCSS('color', 'rgb(255, 247, 237)');
});

test('glass surfaces keep controls readable and interactive', async ({ page }) => {
  await page.goto('/');
  for (const selector of ['.button', '.sound-toggle', '.record-control', '#albums-pause', '.copy-email', '.site-header nav', '.about-details details']) {
    await expect(page.locator(selector).first()).toHaveCSS('backdrop-filter', /blur\(/);
    await expect(page.locator(selector).first()).toHaveCSS('border-top-style', 'solid');
  }
  await page.locator('.button').hover();
  await expect(page.locator('.button')).toHaveCSS('color', 'rgb(255, 247, 237)');
  await page.locator('.button').click();
  await expect(page).toHaveURL(/#work$/);
  await page.locator('#albums-pause').focus();
  await expect(page.locator('#albums-pause')).toHaveCSS('outline-style', 'solid');
});

for (const width of [360, 390, 768, 1440, 1920]) {
  test(`layout stays within a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('.portfolio-link').first().hover();
    await page.evaluate(() => document.querySelectorAll('details').forEach(el => { el.open = true; }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator('.poster-cover').first().evaluate(el => el.offsetWidth / el.offsetHeight)).toBeCloseTo(1, 2);
  });
}

test('desktop keeps its widescreen hero with square albums and circular vinyl', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const [selector, expectedRatio] of [['.hero', 16 / 9], ['.poster-cover', 1]]) {
    const ratio = await page.locator(selector).first().evaluate(el => el.offsetWidth / el.offsetHeight);
    expect(ratio).toBeCloseTo(expectedRatio, 2);
  }
  const hero = await page.locator('.hero').boundingBox();
  expect(hero.width).toBeGreaterThan(1600);
  const vinyl = await page.locator('.album-vinyl').first().boundingBox();
  expect(vinyl.width).toBeCloseTo(vinyl.height, 1);
  await expect(page.locator('.poster-cover').first()).toHaveCSS('overflow', 'hidden');
});

test('reduced motion disables spinning and slide transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#record-control')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#vinyl')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.album-vinyl').first()).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('#albums-pause')).toHaveAttribute('aria-pressed', 'true');
});

test('albums loop, pause, and support manual navigation', async ({ page }) => {
  await page.goto('/');
  const viewport = page.locator('.album-viewport');
  await expect(page.locator('.album-group').first().locator('a')).toHaveCount(6);
  await expect(page.locator('.album-group[aria-hidden="true"] a[tabindex="-1"]')).toHaveCount(6);
  await expect(page.locator('.portfolio-copy')).toHaveCount(0);
  await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(5);
  await page.locator('#albums-pause').click();
  await expect(page.locator('#albums-pause')).toHaveAttribute('aria-pressed', 'true');
  const start = await viewport.evaluate(el => el.scrollLeft);
  await page.waitForTimeout(150);
  expect(await viewport.evaluate(el => el.scrollLeft)).toBe(start);
  await page.locator('#albums-next').click();
  expect(await viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(start + 200);
  await page.locator('#albums-previous').click();
  expect(await viewport.evaluate(el => el.scrollLeft)).toBeCloseTo(start, 0);
  const groupWidth = await page.locator('.album-group').first().evaluate(el => el.getBoundingClientRect().width);
  await viewport.evaluate((el, width) => { el.scrollLeft = width - 2; }, groupWidth);
  await page.waitForTimeout(50);
  await page.locator('#albums-pause').click();
  await page.mouse.move(0, 0);
  await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBeLessThan(100);
  await page.locator('.portfolio-link').first().focus();
  const focused = await viewport.evaluate(el => el.scrollLeft);
  await page.waitForTimeout(150);
  expect(await viewport.evaluate(el => el.scrollLeft)).toBe(focused);
});
