import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  // iPhone 15 standard mobile viewport
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  const outDir = 'C:/Users/basil/.gemini/antigravity/brain/19b7de88-e1a2-4cdd-9e35-6772361deff9/scratch/mobile_compare';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('--- 1. Hero Start ---');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '01_live_hero_start.png') });

  // Get Hero Start typography & styles
  const heroStartMetrics = await page.evaluate(() => {
    const titleLeft = document.querySelector('#hero-title-left h1') || document.querySelector('.hero-flapstick-left h1');
    const titleRight = document.querySelector('#hero-title-right h1') || document.querySelector('.hero-flapstick-right h1');
    const scrollHint = document.querySelector('.scroll-indicator') || document.querySelector('#scroll-hint');
    const progressFill = document.querySelector('.scroll-progress-fill');
    const getStyles = (el) => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        color: s.color,
        letterSpacing: s.letterSpacing
      };
    };
    return {
      titleLeft: getStyles(titleLeft),
      titleRight: getStyles(titleRight),
      scrollHint: getStyles(scrollHint),
      progressFill: getStyles(progressFill)
    };
  });
  fs.writeFileSync(path.join(outDir, '01_hero_start_metrics.json'), JSON.stringify(heroStartMetrics, null, 2));

  console.log('--- 2. Hero End (Play button) ---');
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), maxScroll);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '02_live_hero_end.png') });

  const heroEndMetrics = await page.evaluate(() => {
    const btn = document.querySelector('#reel-play-btn') || document.querySelector('.canvas-play-hitbox');
    const overlay = document.querySelector('.scroll-text--end');
    const getStyles = (el) => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        background: s.background,
        backgroundColor: s.backgroundColor,
        borderRadius: s.borderRadius,
        border: s.border,
        boxShadow: s.boxShadow
      };
    };
    return {
      btn: getStyles(btn),
      overlay: getStyles(overlay)
    };
  });
  fs.writeFileSync(path.join(outDir, '02_hero_end_metrics.json'), JSON.stringify(heroEndMetrics, null, 2));

  console.log('--- 3. Album Carousel ---');
  await page.goto('http://localhost:5173/#work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '03_live_carousel.png') });

  const carouselMetrics = await page.evaluate(() => {
    const backBtn = document.querySelector('.clean-back-btn') || document.querySelector('.back-to-reel-btn');
    const activeCard = document.querySelector('.react-album-card-item.is-centered') || document.querySelector('.tilted-card-figure') || document.querySelector('.album-card-item');
    const title = document.querySelector('.album-active-title') || document.querySelector('.album-meta-title') || document.querySelector('.react-album-card-item.is-centered .album-title');
    const stage = document.querySelector('.react-album-carousel') || document.querySelector('.circular-gallery') || document.querySelector('.react-album-stage');
    const getStyles = (el) => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        color: s.color,
        background: s.background,
        border: s.border,
        borderRadius: s.borderRadius
      };
    };
    const allCards = Array.from(document.querySelectorAll('.react-album-card-item, .album-card-item')).map(c => {
      const r = c.getBoundingClientRect();
      const s = window.getComputedStyle(c);
      return {
        text: c.innerText.trim(),
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        transform: s.transform,
        opacity: s.opacity
      };
    });
    return {
      backBtn: getStyles(backBtn),
      activeCard: getStyles(activeCard),
      title: getStyles(title),
      stage: getStyles(stage),
      allCards
    };
  });
  fs.writeFileSync(path.join(outDir, '03_carousel_metrics.json'), JSON.stringify(carouselMetrics, null, 2));

  console.log('--- 4. Postcard Showcase Desk (Graphic Designs) ---');
  await page.goto('http://localhost:5173/#work/graphic-designs', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '04_live_desk_graphic_designs.png') });

  const deskMetrics = await page.evaluate(() => {
    const backBtn = document.querySelector('.clean-back-btn');
    const header = document.querySelector('.category-header-compact') || document.querySelector('.showcase-header') || document.querySelector('.section-header');
    const postcards = Array.from(document.querySelectorAll('.draggable-postcard-item, .postcard-desk-item')).map(p => {
      const r = p.getBoundingClientRect();
      const s = window.getComputedStyle(p);
      const title = p.querySelector('.postcard-project-title') || p.querySelector('.project-title') || p.querySelector('h3');
      const stamp = p.querySelector('.postcard-stamp') || p.querySelector('image');
      return {
        titleText: title ? title.innerText.trim() : '',
        titleFont: title ? window.getComputedStyle(title).fontFamily : '',
        titleSize: title ? window.getComputedStyle(title).fontSize : '',
        titleColor: title ? window.getComputedStyle(title).color : '',
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        transform: s.transform,
        outerHTML: p.outerHTML.substring(0, 300)
      };
    });
    const deskContainer = document.querySelector('.postcards-desk-container') || document.querySelector('.desk-layout');
    return {
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      backBtn: backBtn ? {
        rect: backBtn.getBoundingClientRect(),
        text: backBtn.innerText.trim(),
        color: window.getComputedStyle(backBtn).color
      } : null,
      deskContainer: deskContainer ? deskContainer.getBoundingClientRect() : null,
      postcards
    };
  });
  fs.writeFileSync(path.join(outDir, '04_desk_metrics.json'), JSON.stringify(deskMetrics, null, 2));

  console.log('--- 5. Flipped Postcard (Eazyarts Ganesh or Fetto Garments) ---');
  // Click second postcard (Fetto Garments) or first (Eazyarts Ganesh)
  const firstPostcard = page.locator('.draggable-postcard-item, .postcard-desk-item').first();
  await firstPostcard.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, '05_live_flipped_ganesh.png') });

  const flippedMetrics = await page.evaluate(() => {
    const expandedCard = document.querySelector('.draggable-postcard-item.is-expanded') || document.querySelector('.postcard-inner-card.is-flipped') || document.querySelector('.flipped-postcard-container');
    const polaroids = Array.from(document.querySelectorAll('.scattered-polaroid-frame, .polaroid-item, .polaroid-card')).map(p => {
      const r = p.getBoundingClientRect();
      const s = window.getComputedStyle(p);
      const img = p.querySelector('img');
      return {
        rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        transform: s.transform,
        imgSrc: img ? img.src : ''
      };
    });
    const closeBtn = document.querySelector('.enlarged-postcard-close-btn') || document.querySelector('.close-btn');
    return {
      expandedCard: expandedCard ? {
        rect: expandedCard.getBoundingClientRect(),
        bg: window.getComputedStyle(expandedCard).backgroundColor,
        borderRadius: window.getComputedStyle(expandedCard).borderRadius
      } : null,
      closeBtn: closeBtn ? closeBtn.getBoundingClientRect() : null,
      polaroids
    };
  });
  fs.writeFileSync(path.join(outDir, '05_flipped_metrics.json'), JSON.stringify(flippedMetrics, null, 2));

  console.log('--- 6. Lightbox Inspect Modal ---');
  // Click first polaroid
  const firstPolaroid = page.locator('.scattered-polaroid-frame, .polaroid-item, .polaroid-card').first();
  if (await firstPolaroid.count() > 0) {
    await firstPolaroid.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, '06_live_inspect_modal.png') });

    const modalMetrics = await page.evaluate(() => {
      const modal = document.querySelector('.polaroid-inspect-modal');
      const card = document.querySelector('.polaroid-inspect-card');
      const img = card ? card.querySelector('img') : null;
      const meta = document.querySelector('.polaroid-inspect-caption-container') || document.querySelector('.polaroid-inspect-meta');
      return {
        modal: modal ? {
          rect: modal.getBoundingClientRect(),
          bg: window.getComputedStyle(modal).backgroundColor
        } : null,
        card: card ? {
          rect: card.getBoundingClientRect(),
          bg: window.getComputedStyle(card).backgroundColor,
          padding: window.getComputedStyle(card).padding
        } : null,
        img: img ? img.getBoundingClientRect() : null,
        meta: meta ? {
          text: meta.innerText.trim(),
          html: meta.outerHTML
        } : null
      };
    });
    fs.writeFileSync(path.join(outDir, '06_modal_metrics.json'), JSON.stringify(modalMetrics, null, 2));
  }

  await browser.close();
  console.log('Mobile extraction complete!');
})();
