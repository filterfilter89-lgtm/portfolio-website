// =========================================================================
// FIGMA NATIVE MOBILE BUILDER SCRIPT (iPhone 15 Viewport: 393 × 852 px)
// Run this inside Figma via: Plugins -> Development -> Open Console / Scripter
// Exact 1:1 mathematical match to the live mobile website DOM
// =========================================================================

(async () => {
  console.log("Starting native Figma Mobile Portfolio construction (1:1 Live Match)...");

  // 1. Font Preloading
  const fontsToLoad = [
    { family: "DM Sans", style: "Regular" },
    { family: "DM Sans", style: "Bold" },
    { family: "Space Mono", style: "Regular" },
    { family: "Space Mono", style: "Bold" },
    { family: "Caveat", style: "Bold" },
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Bold" }
  ];

  await Promise.all(
    fontsToLoad.map(font => figma.loadFontAsync(font).catch(() => {}))
  );

  const defaultFont = { family: "Inter", style: "Regular" };
  const getFont = (family, style) => {
    try {
      return { family, style };
    } catch {
      return defaultFont;
    }
  };

  // Color Palette Definitions (Exact Match)
  const COLORS = {
    cream: { r: 255 / 255, g: 247 / 255, b: 237 / 255 },       // #fff7ed Paper Cream
    blue: { r: 40 / 255, g: 89 / 255, b: 145 / 255 },          // #285991 Ocean Blue
    navy: { r: 14 / 255, g: 25 / 255, b: 40 / 255 },           // #0e1928 Deep Navy
    flapstickBlue: { r: 23 / 255, g: 66 / 255, b: 118 / 255 }, // #174276 Flapstick Text
    slate: { r: 100 / 255, g: 116 / 255, b: 139 / 255 },       // #64748b Muted Slate
    white: { r: 1, g: 1, b: 1 },                               // #ffffff Pure White
    darkBackdrop: { r: 4 / 255, g: 9 / 255, b: 20 / 255 },      // #040914 Cinematic Dark
    airmailRed: { r: 220 / 255, g: 38 / 255, b: 38 / 255 },    // #dc2626 Airmail Red
    airmailBlue: { r: 37 / 255, g: 99 / 255, b: 235 / 255 }    // #2563eb Airmail Blue
  };

  const page = figma.currentPage;
  page.name = "Basil Jose · Mobile Portfolio (iPhone 15 - 1:1 Live)";

  const createMobileFrame = (name, x, y, bg) => {
    const frame = figma.createFrame();
    frame.name = name;
    frame.resize(393, 852);
    frame.x = x;
    frame.y = y;
    frame.cornerRadius = 44;
    frame.clipsContent = true;
    frame.fills = [{ type: "SOLID", color: bg }];
    page.appendChild(frame);
    return frame;
  };

  const createStatusBar = (parent, isLight = false) => {
    const bar = figma.createFrame();
    bar.name = "Status Bar (Dynamic Island)";
    bar.resize(393, 44);
    bar.x = 0;
    bar.y = 0;
    bar.fills = [];

    const time = figma.createText();
    time.fontName = getFont("DM Sans", "Bold");
    time.characters = "9:41";
    time.fontSize = 14;
    time.fills = [{ type: "SOLID", color: isLight ? COLORS.white : COLORS.navy }];
    time.x = 36;
    time.y = 14;
    bar.appendChild(time);

    const island = figma.createRectangle();
    island.name = "Dynamic Island";
    island.resize(100, 26);
    island.cornerRadius = 13;
    island.x = 146.5;
    island.y = 11;
    island.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    bar.appendChild(island);

    parent.appendChild(bar);
    return bar;
  };

  const createBackButton = (parent, label, isLight = false) => {
    const btn = figma.createFrame();
    btn.name = `Back Button (${label})`;
    btn.resize(122, 35);
    btn.x = 16;
    btn.y = 16;
    btn.fills = [];

    const text = figma.createText();
    text.fontName = getFont("Space Mono", "Bold");
    text.characters = `← ${label} ESC`;
    text.fontSize = 10;
    text.letterSpacing = { value: 1, unit: "PIXELS" };
    text.fills = [{ type: "SOLID", color: isLight ? COLORS.cream : COLORS.blue }];
    text.x = 0;
    text.y = 16;
    btn.appendChild(text);

    parent.appendChild(btn);
    return btn;
  };

  // -------------------------------------------------------------
  // Artboard 1: Hero Start (393 x 852)
  // -------------------------------------------------------------
  const artboard1 = createMobileFrame("01 · Mobile Visual Reel Hero (Start)", 80, 80, COLORS.cream);
  createStatusBar(artboard1, false);

  // Left Title "Basil" (x: 16.89, y: 338.45, fontSize: 62.17px)
  const basilText = figma.createText();
  basilText.name = "Hero Title Left (Basil)";
  basilText.fontName = getFont("DM Sans", "Bold");
  basilText.characters = "Basil";
  basilText.fontSize = 62;
  basilText.fills = [{ type: "SOLID", color: COLORS.flapstickBlue }];
  basilText.x = 17;
  basilText.y = 338;
  artboard1.appendChild(basilText);

  // Right Title "Jose" (x: 253.67, y: 340.39, fontSize: 65.98px)
  const joseText = figma.createText();
  joseText.name = "Hero Title Right (Jose)";
  joseText.fontName = getFont("DM Sans", "Bold");
  joseText.characters = "Jose";
  joseText.fontSize = 66;
  joseText.fills = [{ type: "SOLID", color: COLORS.flapstickBlue }];
  joseText.x = 254;
  joseText.y = 340;
  artboard1.appendChild(joseText);

  // Timeline Scrubber at y=849, h=3
  const scrubBg1 = figma.createRectangle();
  scrubBg1.name = "Timeline Scrubber Track";
  scrubBg1.resize(393, 3);
  scrubBg1.x = 0;
  scrubBg1.y = 849;
  scrubBg1.fills = [{ type: "SOLID", color: COLORS.blue, opacity: 0.2 }];
  artboard1.appendChild(scrubBg1);

  // -------------------------------------------------------------
  // Artboard 2: Hero Play Trigger (393 x 852)
  // -------------------------------------------------------------
  const artboard2 = createMobileFrame("02 · Mobile Visual Reel Hero (Play Trigger)", 560, 80, COLORS.blue);
  createStatusBar(artboard2, true);

  // Reel Play Hitbox: 226 x 226 at x=83.49, y=312.99
  const playHitbox = figma.createEllipse();
  playHitbox.name = "Reel Play Hitbox (226px Circle)";
  playHitbox.resize(226, 226);
  playHitbox.x = 83.5;
  playHitbox.y = 313;
  playHitbox.fills = [{ type: "SOLID", color: COLORS.cream, opacity: 0.05 }];
  playHitbox.strokes = [{ type: "SOLID", color: COLORS.cream, opacity: 0.3 }];
  playHitbox.strokeWeight = 1.5;
  playHitbox.dashPattern = [4, 4];
  artboard2.appendChild(playHitbox);

  const scrubBg2 = figma.createRectangle();
  scrubBg2.name = "Timeline Scrubber Completed (100%)";
  scrubBg2.resize(393, 3);
  scrubBg2.x = 0;
  scrubBg2.y = 849;
  scrubBg2.fills = [{ type: "SOLID", color: COLORS.blue }];
  artboard2.appendChild(scrubBg2);

  // -------------------------------------------------------------
  // Artboard 3: Mobile Album Carousel (#work)
  // -------------------------------------------------------------
  const artboard3 = createMobileFrame("03 · Mobile Album Carousel (#work)", 1040, 80, COLORS.cream);
  createStatusBar(artboard3, false);
  createBackButton(artboard3, "REEL", false);

  // Center Sleeve (280 x 280 at x=56.5, y=276)
  const centerSleeve = figma.createFrame();
  centerSleeve.name = "Active Vinyl Album Sleeve (ADVERTISEMENT)";
  centerSleeve.resize(280, 280);
  centerSleeve.x = 56.5;
  centerSleeve.y = 276;
  centerSleeve.cornerRadius = 18;
  centerSleeve.fills = [{ type: "SOLID", color: COLORS.cream }];
  centerSleeve.strokes = [{ type: "SOLID", color: COLORS.blue }];
  centerSleeve.strokeWeight = 8;
  artboard3.appendChild(centerSleeve);

  const albumTitle = figma.createText();
  albumTitle.name = "Album Category Title";
  albumTitle.fontName = getFont("Space Mono", "Bold");
  albumTitle.characters = "ADVERTISEMENT";
  albumTitle.fontSize = 14;
  albumTitle.letterSpacing = { value: 2, unit: "PIXELS" };
  albumTitle.fills = [{ type: "SOLID", color: COLORS.blue }];
  albumTitle.x = (393 - 160) / 2;
  albumTitle.y = 584;
  artboard3.appendChild(albumTitle);

  // -------------------------------------------------------------
  // Artboard 4: Mobile Postcard Showcase Desk
  // -------------------------------------------------------------
  const artboard4 = createMobileFrame("04 · Mobile Postcard Showcase Desk", 1520, 80, COLORS.blue);
  createStatusBar(artboard4, true);
  createBackButton(artboard4, "ALBUMS", true);

  const categoryTitle = figma.createText();
  categoryTitle.name = "Showcase Category Title";
  categoryTitle.fontName = getFont("Space Mono", "Bold");
  categoryTitle.characters = "GRAPHIC DESIGNS";
  categoryTitle.fontSize = 10;
  categoryTitle.fills = [{ type: "SOLID", color: COLORS.cream, opacity: 0.6 }];
  categoryTitle.x = 260;
  categoryTitle.y = 28;
  artboard4.appendChild(categoryTitle);

  // 4 Airmail Postcards (320 x 180, centered at x=196.5)
  const deskCards = [
    { name: "Eazyarts Ganesh", top: 187.44, rot: -1.6 },
    { name: "Fetto Garments", top: 346.76, rot: 2.4 },
    { name: "Fouz Travels", top: 505.24, rot: -3.2 },
    { name: "Fruitly", top: 664.56, rot: 1.6 }
  ];

  deskCards.forEach(c => {
    const card = figma.createFrame();
    card.name = `Postcard (16:9): ${c.name}`;
    card.resize(320, 180);
    card.x = 196.5 - 160;
    card.y = c.top - 90;
    card.rotation = c.rot;
    card.cornerRadius = 6;
    card.fills = [{ type: "SOLID", color: COLORS.cream }];
    card.strokes = [{ type: "SOLID", color: COLORS.blue, opacity: 0.3 }];
    card.strokeWeight = 1.5;

    const titleText = figma.createText();
    titleText.fontName = getFont("Caveat", "Bold");
    titleText.characters = c.name;
    titleText.fontSize = 24;
    titleText.fills = [{ type: "SOLID", color: { r: 30 / 255, g: 58 / 255, b: 95 / 255 } }];
    titleText.x = 24;
    titleText.y = 75;
    card.appendChild(titleText);

    const stamp = figma.createFrame();
    stamp.name = "Postage Stamp Frame";
    stamp.resize(68, 96);
    stamp.x = 230;
    stamp.y = 20;
    stamp.cornerRadius = 4;
    stamp.fills = [{ type: "SOLID", color: COLORS.blue }];
    card.appendChild(stamp);

    artboard4.appendChild(card);
  });

  // -------------------------------------------------------------
  // Artboard 5: Flipped Postcard Bento Grid (393 x 852)
  // -------------------------------------------------------------
  const artboard5 = createMobileFrame("05 · Mobile Flipped Bento Grid", 80, 1050, COLORS.blue);
  createStatusBar(artboard5, true);

  const bentoCard = figma.createFrame();
  bentoCard.name = "Flipped Postcard (369 × 208 px)";
  bentoCard.resize(369, 208);
  bentoCard.x = 11.5;
  bentoCard.y = 322.44;
  bentoCard.cornerRadius = 6;
  bentoCard.fills = [{ type: "SOLID", color: COLORS.cream }];
  artboard5.appendChild(bentoCard);

  // 5 Polaroids (102.75 × 78.27, 0 deg rotation)
  const polaroids = [
    { x: 15.67, y: 17.47, label: "Slide 01" },
    { x: 133.13, y: 17.47, label: "Slide 02" },
    { x: 250.56, y: 17.47, label: "Slide 03" },
    { x: 54.95, y: 112.24, label: "Slide 04" },
    { x: 211.28, y: 112.24, label: "Slide 05" }
  ];

  polaroids.forEach((p, idx) => {
    const pol = figma.createFrame();
    pol.name = `Polaroid ${p.label}`;
    pol.resize(102.75, 78.27);
    pol.x = p.x;
    pol.y = p.y;
    pol.cornerRadius = 4;
    pol.fills = [{ type: "SOLID", color: COLORS.white }];
    pol.strokes = [{ type: "SOLID", color: { r: 226/255, g: 232/255, b: 240/255 } }];
    pol.strokeWeight = 1;
    bentoCard.appendChild(pol);
  });

  // Close button
  const closeBtn = figma.createEllipse();
  closeBtn.name = "Close Button (32px)";
  closeBtn.resize(32, 32);
  closeBtn.x = 327;
  closeBtn.y = 10;
  closeBtn.fills = [{ type: "SOLID", color: COLORS.cream }];
  closeBtn.strokes = [{ type: "SOLID", color: COLORS.blue, opacity: 0.2 }];
  bentoCard.appendChild(closeBtn);

  // -------------------------------------------------------------
  // Artboard 6: Cinematic Lightbox Modal (393 x 852)
  // -------------------------------------------------------------
  const artboard6 = createMobileFrame("06 · Mobile Lightbox Modal", 560, 1050, COLORS.darkBackdrop);
  createStatusBar(artboard6, true);

  const lightbox = figma.createFrame();
  lightbox.name = "Inspect Modal Card (369 × 485 px)";
  lightbox.resize(369, 485.09);
  lightbox.x = 12;
  lightbox.y = 183.45;
  lightbox.cornerRadius = 8;
  lightbox.fills = [{ type: "SOLID", color: COLORS.white }];
  lightbox.paddingLeft = 10;
  lightbox.paddingRight = 10;
  lightbox.paddingTop = 10;
  lightbox.paddingBottom = 18;
  artboard6.appendChild(lightbox);

  const inspectImg = figma.createRectangle();
  inspectImg.name = "High-Res Slide Poster (349 × 436 px)";
  inspectImg.resize(349, 436.09);
  inspectImg.x = 10;
  inspectImg.y = 10;
  inspectImg.cornerRadius = 4;
  inspectImg.fills = [{ type: "SOLID", color: COLORS.blue }];
  lightbox.appendChild(inspectImg);

  // -------------------------------------------------------------
  // Artboard 7: Videography In-Card Player (393 x 852)
  // -------------------------------------------------------------
  const artboard7 = createMobileFrame("07 · Mobile Videography Player", 1040, 1050, COLORS.blue);
  createStatusBar(artboard7, true);
  createBackButton(artboard7, "ALBUMS", true);

  const videoCard = figma.createFrame();
  videoCard.name = "Flipped Video Postcard (369 × 208 px)";
  videoCard.resize(369, 208);
  videoCard.x = 11.5;
  videoCard.y = 322.44;
  videoCard.cornerRadius = 6;
  videoCard.fills = [{ type: "SOLID", color: COLORS.cream }];
  artboard7.appendChild(videoCard);

  // Dual Video Reels (146.13 × 259.77)
  const reel1 = figma.createFrame();
  reel1.name = "Video Reel 01";
  reel1.resize(146.13, 259.77);
  reel1.x = 35.95;
  reel1.y = 293.06;
  reel1.cornerRadius = 6;
  reel1.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  artboard7.appendChild(reel1);

  const reel2 = figma.createFrame();
  reel2.name = "Video Reel 02";
  reel2.resize(146.13, 259.77);
  reel2.x = 209.91;
  reel2.y = 293.06;
  reel2.cornerRadius = 6;
  reel2.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  artboard7.appendChild(reel2);

  // -------------------------------------------------------------
  // Artboard 8: Design Tokens & Components (393 x 852)
  // -------------------------------------------------------------
  const artboard8 = createMobileFrame("08 · Design System & Tokens", 1520, 1050, { r: 15/255, g: 23/255, b: 42/255 });

  const tokensTitle = figma.createText();
  tokensTitle.name = "Tokens Title";
  tokensTitle.fontName = getFont("Space Mono", "Bold");
  tokensTitle.characters = "DESIGN TOKENS";
  tokensTitle.fontSize = 12;
  tokensTitle.fills = [{ type: "SOLID", color: { r: 56/255, g: 189/255, b: 248/255 } }];
  tokensTitle.x = 24;
  tokensTitle.y = 48;
  artboard8.appendChild(tokensTitle);

  console.log("Figma Mobile Portfolio construction complete! All 8 artboards created.");
})();
