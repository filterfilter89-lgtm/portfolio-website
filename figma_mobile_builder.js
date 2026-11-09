// =========================================================================
// FIGMA NATIVE MOBILE BUILDER SCRIPT (iPhone 15 Viewport: 393 × 852)
// Run this inside Figma via: Plugins -> Development -> Open Console / Scripter
// Or create a new local Figma plugin with this code.
// =========================================================================

(async () => {
  console.log("Starting native Figma Mobile Portfolio construction...");

  // 1. Font Preloading
  const fontsToLoad = [
    { family: "DM Sans", style: "Regular" },
    { family: "DM Sans", style: "Bold" },
    { family: "Space Mono", style: "Regular" },
    { family: "Space Mono", style: "Bold" },
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

  // Color Palette Definitions
  const COLORS = {
    cream: { r: 255 / 255, g: 247 / 255, b: 237 / 255 }, // #fff7ed
    blue: { r: 40 / 255, g: 89 / 255, b: 145 / 255 },    // #285991
    navy: { r: 14 / 255, g: 25 / 255, b: 40 / 255 },     // #0e1928
    slate: { r: 100 / 255, g: 116 / 255, b: 139 / 255 }, // #64748b
    white: { r: 1, g: 1, b: 1 },
    darkBackdrop: { r: 15 / 255, g: 34 / 255, b: 56 / 255 }
  };

  const page = figma.currentPage;
  page.name = "Basil Jose — Mobile Portfolio (iPhone 15)";

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
    bar.resize(345, 30);
    bar.x = 24;
    bar.y = 14;
    bar.fills = [];
    bar.layoutMode = "HORIZONTAL";
    bar.primaryAxisAlignItems = "SPACE_BETWEEN";
    bar.counterAxisAlignItems = "CENTER";

    const time = figma.createText();
    time.fontName = getFont("DM Sans", "Bold");
    time.characters = "9:41";
    time.fontSize = 14;
    time.fills = [{ type: "SOLID", color: isLight ? COLORS.white : COLORS.navy }];
    bar.appendChild(time);

    const island = figma.createRectangle();
    island.name = "Dynamic Island";
    island.resize(100, 26);
    island.cornerRadius = 13;
    island.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    bar.appendChild(island);

    parent.appendChild(bar);
    return bar;
  };

  const createBackButton = (parent, label, isLight = false) => {
    const btn = figma.createFrame();
    btn.name = `Back Button (${label})`;
    btn.resize(110, 28);
    btn.x = 20;
    btn.y = 56;
    btn.fills = [];
    btn.layoutMode = "HORIZONTAL";
    btn.itemSpacing = 6;
    btn.counterAxisAlignItems = "CENTER";

    const text = figma.createText();
    text.fontName = getFont("Space Mono", "Bold");
    text.characters = `← ${label}`;
    text.fontSize = 11;
    text.fills = [{ type: "SOLID", color: isLight ? COLORS.cream : COLORS.blue }];
    btn.appendChild(text);

    const hint = figma.createFrame();
    hint.name = "ESC Pill";
    hint.resize(28, 16);
    hint.cornerRadius = 3;
    hint.fills = [{ type: "SOLID", color: isLight ? COLORS.white : COLORS.blue, opacity: 0.12 }];
    hint.layoutMode = "HORIZONTAL";
    hint.primaryAxisAlignItems = "CENTER";
    hint.counterAxisAlignItems = "CENTER";

    const hintText = figma.createText();
    hintText.fontName = getFont("Space Mono", "Bold");
    hintText.characters = "ESC";
    hintText.fontSize = 8;
    hintText.fills = [{ type: "SOLID", color: isLight ? COLORS.cream : COLORS.blue }];
    hint.appendChild(hintText);
    btn.appendChild(hint);

    parent.appendChild(btn);
    return btn;
  };

  // -------------------------------------------------------------
  // Artboard 1: Hero Start (393 x 852)
  // -------------------------------------------------------------
  const artboard1 = createMobileFrame("01 • Mobile Visual Reel Hero (Start)", 0, 0, COLORS.cream);
  createStatusBar(artboard1, false);

  const heroTitle = figma.createText();
  heroTitle.name = "Flapstick Hero Title";
  heroTitle.fontName = getFont("DM Sans", "Bold");
  heroTitle.characters = "Basil Jose";
  heroTitle.fontSize = 42;
  heroTitle.fills = [{ type: "SOLID", color: COLORS.blue }];
  heroTitle.x = 28;
  heroTitle.y = 390;
  artboard1.appendChild(heroTitle);

  const scrollHint = figma.createFrame();
  scrollHint.name = "Scroll Hint Pill";
  scrollHint.resize(140, 32);
  scrollHint.cornerRadius = 16;
  scrollHint.x = (393 - 140) / 2;
  scrollHint.y = 780;
  scrollHint.fills = [{ type: "SOLID", color: COLORS.blue, opacity: 0.08 }];
  scrollHint.strokes = [{ type: "SOLID", color: COLORS.blue }];
  scrollHint.strokeWeight = 1.2;
  scrollHint.layoutMode = "HORIZONTAL";
  scrollHint.primaryAxisAlignItems = "CENTER";
  scrollHint.counterAxisAlignItems = "CENTER";

  const scrollText = figma.createText();
  scrollText.fontName = getFont("Space Mono", "Bold");
  scrollText.characters = "SCROLL TO PLAY ↓";
  scrollText.fontSize = 9;
  scrollText.fills = [{ type: "SOLID", color: COLORS.blue }];
  scrollHint.appendChild(scrollText);
  artboard1.appendChild(scrollHint);

  // -------------------------------------------------------------
  // Artboard 2: Hero Play Trigger (393 x 852)
  // -------------------------------------------------------------
  const artboard2 = createMobileFrame("02 • Mobile Visual Reel Hero (Play Trigger)", 460, 0, COLORS.blue);
  createStatusBar(artboard2, true);

  const playBtn = figma.createEllipse();
  playBtn.name = "Play Button Circle (No Ring)";
  playBtn.resize(128, 128);
  playBtn.x = (393 - 128) / 2;
  playBtn.y = (852 - 128) / 2;
  playBtn.fills = [{ type: "SOLID", color: COLORS.cream }];
  artboard2.appendChild(playBtn);

  const playTriangle = figma.createPolygon();
  playTriangle.name = "Play Triangle";
  playTriangle.resize(36, 42);
  playTriangle.rotation = -90;
  playTriangle.x = 216;
  playTriangle.y = 405;
  playTriangle.fills = [{ type: "SOLID", color: COLORS.blue }];
  artboard2.appendChild(playTriangle);

  // -------------------------------------------------------------
  // Artboard 3: Mobile Album Carousel (#work)
  // -------------------------------------------------------------
  const artboard3 = createMobileFrame("03 • Mobile Album Carousel (#work)", 920, 0, COLORS.cream);
  createStatusBar(artboard3, false);
  createBackButton(artboard3, "REEL", false);

  const centerSleeve = figma.createFrame();
  centerSleeve.name = "Active Vinyl Album Sleeve";
  centerSleeve.resize(260, 260);
  centerSleeve.x = (393 - 260) / 2;
  centerSleeve.y = 220;
  centerSleeve.cornerRadius = 18;
  centerSleeve.fills = [{ type: "SOLID", color: COLORS.cream }];
  centerSleeve.strokes = [{ type: "SOLID", color: COLORS.blue }];
  centerSleeve.strokeWeight = 8;
  artboard3.appendChild(centerSleeve);

  const albumTitle = figma.createText();
  albumTitle.name = "Album Category Title";
  albumTitle.fontName = getFont("Space Mono", "Bold");
  albumTitle.characters = "ADVERTISEMENT";
  albumTitle.fontSize = 16;
  albumTitle.fills = [{ type: "SOLID", color: COLORS.blue }];
  albumTitle.x = (393 - 160) / 2;
  albumTitle.y = 540;
  artboard3.appendChild(albumTitle);

  // -------------------------------------------------------------
  // Artboard 4: Mobile Postcard Showcase Desk
  // -------------------------------------------------------------
  const artboard4 = createMobileFrame("04 • Mobile Postcard Showcase Desk", 1380, 0, COLORS.blue);
  createStatusBar(artboard4, true);
  createBackButton(artboard4, "ALBUMS", true);

  const projects = ["Eazyarts Ganesh", "Fetto Garments", "Fouz Travels", "Fruitly"];
  projects.forEach((proj, i) => {
    const card = figma.createFrame();
    card.name = `Postcard: ${proj}`;
    card.resize(330, 142);
    card.x = (393 - 330) / 2;
    card.y = 110 + i * 160;
    card.cornerRadius = 8;
    card.fills = [{ type: "SOLID", color: COLORS.cream }];
    card.strokes = [{ type: "SOLID", color: COLORS.white }];
    card.strokeWeight = 4;

    const projText = figma.createText();
    projText.fontName = getFont("DM Sans", "Bold");
    projText.characters = proj;
    projText.fontSize = 20;
    projText.fills = [{ type: "SOLID", color: COLORS.navy }];
    projText.x = 24;
    projText.y = 56;
    card.appendChild(projText);

    const stamp = figma.createFrame();
    stamp.name = "Postage Stamp Frame";
    stamp.resize(58, 76);
    stamp.x = 244;
    stamp.y = 16;
    stamp.cornerRadius = 2;
    stamp.fills = [{ type: "SOLID", color: COLORS.blue }];
    card.appendChild(stamp);

    artboard4.appendChild(card);
  });

  // -------------------------------------------------------------
  // Artboard 5: Flipped Postcard Bento Grid (393 x 852)
  // -------------------------------------------------------------
  const artboard5 = createMobileFrame("05 • Mobile Flipped Bento Grid", 0, 940, COLORS.darkBackdrop);
  createStatusBar(artboard5, true);

  const bentoCard = figma.createFrame();
  bentoCard.name = "Flipped Postcard Container (Cream)";
  bentoCard.resize(361, 260);
  bentoCard.x = 16;
  bentoCard.y = 290;
  bentoCard.cornerRadius = 16;
  bentoCard.fills = [{ type: "SOLID", color: COLORS.cream }];
  artboard5.appendChild(bentoCard);

  // -------------------------------------------------------------
  // Artboard 6: Cinematic Lightbox Modal (393 x 852)
  // -------------------------------------------------------------
  const artboard6 = createMobileFrame("06 • Mobile Lightbox Modal", 460, 940, { r: 7/255, g: 14/255, b: 23/255 });
  createStatusBar(artboard6, true);

  const lightbox = figma.createFrame();
  lightbox.name = "Inspect Modal Card (White)";
  lightbox.resize(353, 580);
  lightbox.x = 20;
  lightbox.y = 120;
  lightbox.cornerRadius = 16;
  lightbox.fills = [{ type: "SOLID", color: COLORS.white }];
  artboard6.appendChild(lightbox);

  // -------------------------------------------------------------
  // Artboard 7: Videography In-Card Player (393 x 852)
  // -------------------------------------------------------------
  const artboard7 = createMobileFrame("07 • Mobile Video Player Postcard", 920, 940, COLORS.blue);
  createStatusBar(artboard7, true);
  createBackButton(artboard7, "ALBUMS", true);

  const videoCard = figma.createFrame();
  videoCard.name = "Flipped Video Postcard";
  videoCard.resize(357, 420);
  videoCard.x = 18;
  videoCard.y = 160;
  videoCard.cornerRadius = 16;
  videoCard.fills = [{ type: "SOLID", color: COLORS.cream }];
  artboard7.appendChild(videoCard);

  // -------------------------------------------------------------
  // Artboard 8: Design System & Tokens (393 x 852)
  // -------------------------------------------------------------
  const artboard8 = createMobileFrame("08 • Mobile Design System & Tokens", 1380, 940, { r: 248/255, g: 250/255, b: 252/255 });
  createStatusBar(artboard8, false);

  const tokensTitle = figma.createText();
  tokensTitle.name = "System Title";
  tokensTitle.fontName = getFont("Space Mono", "Bold");
  tokensTitle.characters = "MOBILE TOKENS & COMPONENTS";
  tokensTitle.fontSize = 12;
  tokensTitle.fills = [{ type: "SOLID", color: COLORS.blue }];
  tokensTitle.x = 24;
  tokensTitle.y = 60;
  artboard8.appendChild(tokensTitle);

  // Scroll viewport to encompass all created artboards
  figma.viewport.scrollAndZoomIntoView([
    artboard1, artboard2, artboard3, artboard4,
    artboard5, artboard6, artboard7, artboard8
  ]);

  console.log("All 8 Mobile Figma Artboards & Components successfully created!");
})();
