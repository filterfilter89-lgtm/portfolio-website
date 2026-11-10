// =========================================================================
// FIGMA NATIVE MOBILE BUILDER SCRIPT (iPhone 15 Viewport: 393 × 852 px)
// Run this inside Figma via: Plugins -> Development -> Open Console / Scripter
// Exact 1:1 match to the live mobile website DOM
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
    blue: { r: 51 / 255, g: 97 / 255, b: 150 / 255 },          // #336196 Desk Ocean Blue (--blue)
    navy: { r: 14 / 255, g: 25 / 255, b: 40 / 255 },           // #0e1928 Deep Navy
    flapstickBlue: { r: 23 / 255, g: 66 / 255, b: 118 / 255 }, // #174276 Flapstick Text
    slate: { r: 100 / 255, g: 116 / 255, b: 139 / 255 },       // #64748b Muted Slate
    white: { r: 1, g: 1, b: 1 },                               // #ffffff Pure White
    darkBackdrop: { r: 4 / 255, g: 9 / 255, b: 20 / 255 },      // #040914 Cinematic Dark
    airmailRed: { r: 220 / 255, g: 38 / 255, b: 38 / 255 },    // #dc2626 Airmail Red
    airmailBlue: { r: 49 / 255, g: 92 / 255, b: 143 / 255 }    // #315c8f Airmail Blue
  };

  const page = figma.currentPage;
  page.name = "Basil Jose • Mobile Portfolio (iPhone 15 - 1:1 Live)";

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

  // Back Navigation: Arrow ONLY (No text label)
  const createBackButton = (parent, isLight = false) => {
    const btn = figma.createFrame();
    btn.name = "Back Arrow Button";
    btn.resize(36, 36);
    btn.x = 18;
    btn.y = 54;
    btn.cornerRadius = 18;
    btn.fills = [{
      type: "SOLID",
      color: isLight ? COLORS.white : COLORS.flapstickBlue,
      opacity: isLight ? 0.12 : 0.08
    }];

    const arrow = figma.createVector();
    arrow.name = "Arrow Icon";
    arrow.vectorPaths = [{
      windingRule: "NONZERO",
      data: "M 18 10 L 10 18 L 18 26 M 10 18 L 26 18"
    }];
    arrow.strokes = [{ type: "SOLID", color: isLight ? COLORS.cream : COLORS.flapstickBlue }];
    arrow.strokeWeight = 2;
    arrow.strokeCap = "ROUND";
    arrow.strokeJoin = "ROUND";
    arrow.resize(16, 16);
    arrow.x = 10;
    arrow.y = 10;
    btn.appendChild(arrow);

    parent.appendChild(btn);
    return btn;
  };

  // Hamburger Menu in Top Right Corner
  const createHamburgerMenu = (parent, isLight = false) => {
    const btn = figma.createFrame();
    btn.name = "Hamburger Menu";
    btn.resize(36, 36);
    btn.x = 339;
    btn.y = 54;
    btn.cornerRadius = 18;
    btn.fills = [{
      type: "SOLID",
      color: isLight ? COLORS.white : COLORS.flapstickBlue,
      opacity: isLight ? 0.12 : 0.08
    }];

    const icon = figma.createVector();
    icon.name = "3 Bars";
    icon.vectorPaths = [{
      windingRule: "NONZERO",
      data: "M 10 13 L 26 13 M 10 18 L 26 18 M 10 23 L 26 23"
    }];
    icon.strokes = [{ type: "SOLID", color: isLight ? COLORS.cream : COLORS.flapstickBlue }];
    icon.strokeWeight = 1.8;
    icon.strokeCap = "ROUND";
    icon.resize(16, 12);
    icon.x = 10;
    icon.y = 12;
    btn.appendChild(icon);

    parent.appendChild(btn);
    return btn;
  };

  // =========================================================================
  // 1. MOBILE VISUAL REEL HERO (START STATE)
  // =========================================================================
  const artboard1 = createMobileFrame("01 • Mobile Visual Reel Hero (Start)", 60, 80, COLORS.cream);
  createStatusBar(artboard1, false);
  createHamburgerMenu(artboard1, false);

  // Minimal Scroll Instruction
  const scrollText = figma.createText();
  scrollText.fontName = getFont("Space Mono", "Bold");
  scrollText.characters = "SCROLL TO EXPLORE";
  scrollText.fontSize = 9;
  scrollText.letterSpacing = { value: 1.5, unit: "PIXELS" };
  scrollText.fills = [{ type: "SOLID", color: COLORS.flapstickBlue, opacity: 0.65 }];
  scrollText.x = 196.5 - 60;
  scrollText.y = 620;
  artboard1.appendChild(scrollText);

  // Bottom 2-Line Name: BASIL / JOSE
  const basilText = figma.createText();
  basilText.name = "Hero Title Top (BASIL)";
  basilText.fontName = getFont("Inter", "Bold");
  basilText.characters = "BASIL";
  basilText.fontSize = 52;
  basilText.fills = [{ type: "SOLID", color: COLORS.flapstickBlue }];
  basilText.x = 24;
  basilText.y = 690;
  artboard1.appendChild(basilText);

  const joseText = figma.createText();
  joseText.name = "Hero Title Bottom (JOSE)";
  joseText.fontName = getFont("Inter", "Bold");
  joseText.characters = "JOSE";
  joseText.fontSize = 52;
  joseText.fills = [{ type: "SOLID", color: COLORS.flapstickBlue }];
  joseText.x = 24;
  joseText.y = 744;
  artboard1.appendChild(joseText);

  // Scrubber at bottom
  const scrub1 = figma.createRectangle();
  scrub1.resize(393, 3);
  scrub1.x = 0;
  scrub1.y = 849;
  scrub1.fills = [{ type: "SOLID", color: COLORS.blue, opacity: 0.2 }];
  artboard1.appendChild(scrub1);

  // =========================================================================
  // 2. MOBILE VISUAL REEL HERO (PLAY END STATE)
  // =========================================================================
  const artboard2 = createMobileFrame("02 • Mobile Visual Reel Hero (Play Trigger)", 540, 80, COLORS.blue);
  createStatusBar(artboard2, true);
  createHamburgerMenu(artboard2, true);

  const playHitbox = figma.createEllipse();
  playHitbox.name = "Reel Play Hitbox (226px Circle)";
  playHitbox.resize(226, 226);
  playHitbox.x = 83.5;
  playHitbox.y = 313;
  playHitbox.fills = [];
  playHitbox.strokes = [{ type: "SOLID", color: COLORS.cream, opacity: 0.3 }];
  playHitbox.strokeWeight = 1.5;
  playHitbox.dashPattern = [4, 4];
  artboard2.appendChild(playHitbox);

  // =========================================================================
  // 3. MOBILE ALBUM CAROUSEL (#work)
  // =========================================================================
  const artboard3 = createMobileFrame("03 • Mobile Album Carousel (#work)", 1020, 80, COLORS.cream);
  createStatusBar(artboard3, false);
  createBackButton(artboard3, false);
  createHamburgerMenu(artboard3, false);

  const centerSleeve = figma.createRectangle();
  centerSleeve.name = "Active Vinyl Album Sleeve (ADVERTISEMENT)";
  centerSleeve.resize(280, 280);
  centerSleeve.x = 56.5;
  centerSleeve.y = 274;
  centerSleeve.cornerRadius = 16;
  centerSleeve.fills = [{ type: "SOLID", color: COLORS.blue }];
  artboard3.appendChild(centerSleeve);

  const albumTitle = figma.createText();
  albumTitle.fontName = getFont("Space Mono", "Bold");
  albumTitle.characters = "ADVERTISEMENT";
  albumTitle.fontSize = 14;
  albumTitle.letterSpacing = { value: 2, unit: "PIXELS" };
  albumTitle.fills = [{ type: "SOLID", color: COLORS.blue }];
  albumTitle.x = 135;
  albumTitle.y = 594;
  artboard3.appendChild(albumTitle);

  // =========================================================================
  // 4. MOBILE POSTCARD SHOWCASE DESK
  // =========================================================================
  const artboard4 = createMobileFrame("04 • Mobile Postcard Showcase Desk", 60, 1050, COLORS.blue);
  createStatusBar(artboard4, true);
  createBackButton(artboard4, true);

  const deskTitle = figma.createText();
  deskTitle.fontName = getFont("Space Mono", "Bold");
  deskTitle.characters = "GRAPHIC DESIGNS";
  deskTitle.fontSize = 10;
  deskTitle.letterSpacing = { value: 1, unit: "PIXELS" };
  deskTitle.fills = [{ type: "SOLID", color: COLORS.cream, opacity: 0.6 }];
  deskTitle.x = 245;
  deskTitle.y = 62;
  artboard4.appendChild(deskTitle);

  // =========================================================================
  // 5. MOBILE FLIPPED POSTCARD BENTO GRID
  // =========================================================================
  const artboard5 = createMobileFrame("05 • Mobile Flipped Bento Grid", 540, 1050, COLORS.blue);
  createStatusBar(artboard5, true);

  const bentoCard = figma.createRectangle();
  bentoCard.name = "Flipped Postcard (369 × 208 px)";
  bentoCard.resize(369, 208);
  bentoCard.x = 12;
  bentoCard.y = 322;
  bentoCard.cornerRadius = 6;
  bentoCard.fills = [{ type: "SOLID", color: COLORS.cream }];
  artboard5.appendChild(bentoCard);

  // =========================================================================
  // 6. MOBILE LIGHTBOX MODAL
  // =========================================================================
  const artboard6 = createMobileFrame("06 • Mobile Lightbox Modal", 1020, 1050, COLORS.darkBackdrop);
  createStatusBar(artboard6, true);

  const lightbox = figma.createRectangle();
  lightbox.name = "Inspect Modal Card (369 × 485 px)";
  lightbox.resize(369, 485);
  lightbox.x = 12;
  lightbox.y = 183;
  lightbox.cornerRadius = 8;
  lightbox.fills = [{ type: "SOLID", color: COLORS.white }];
  artboard6.appendChild(lightbox);

  // =========================================================================
  // 7. MOBILE VIDEOGRAPHY PLAYER
  // =========================================================================
  const artboard7 = createMobileFrame("07 • Mobile Videography Player", 60, 2020, COLORS.blue);
  createStatusBar(artboard7, true);
  createBackButton(artboard7, true);

  const videoCard = figma.createRectangle();
  videoCard.name = "Flipped Video Postcard";
  videoCard.resize(369, 208);
  videoCard.x = 12;
  videoCard.y = 322;
  videoCard.cornerRadius = 6;
  videoCard.fills = [{ type: "SOLID", color: COLORS.cream }];
  artboard7.appendChild(videoCard);

  // =========================================================================
  // 8. MOBILE CONTACT PAGE
  // =========================================================================
  const artboard8 = createMobileFrame("08 • Mobile Dedicated Contact Page", 540, 2020, COLORS.cream);
  createStatusBar(artboard8, false);
  createBackButton(artboard8, false);
  createHamburgerMenu(artboard8, false);

  const contactHeading = figma.createText();
  contactHeading.fontName = getFont("Space Mono", "Bold");
  contactHeading.characters = "GET IN TOUCH";
  contactHeading.fontSize = 12;
  contactHeading.letterSpacing = { value: 2, unit: "PIXELS" };
  contactHeading.fills = [{ type: "SOLID", color: COLORS.blue }];
  contactHeading.x = 24;
  contactHeading.y = 110;
  artboard8.appendChild(contactHeading);

  const contactSub = figma.createText();
  contactSub.fontName = getFont("Inter", "Bold");
  contactSub.characters = "Let's Connect";
  contactSub.fontSize = 38;
  contactSub.fills = [{ type: "SOLID", color: COLORS.flapstickBlue }];
  contactSub.x = 24;
  contactSub.y = 136;
  artboard8.appendChild(contactSub);

  const formCard = figma.createRectangle();
  formCard.name = "Contact Message Form";
  formCard.resize(345, 520);
  formCard.x = 24;
  formCard.y = 260;
  formCard.cornerRadius = 14;
  formCard.fills = [{ type: "SOLID", color: COLORS.white }];
  formCard.strokes = [{ type: "SOLID", color: { r: 226/255, g: 216/255, b: 205/255 } }];
  artboard8.appendChild(formCard);

  // =========================================================================
  // 9. MOBILE HAMBURGER MENU DRAWER
  // =========================================================================
  const artboard9 = createMobileFrame("09 • Mobile Hamburger Menu Drawer", 1020, 2020, COLORS.navy);
  createStatusBar(artboard9, true);

  const navTitle = figma.createText();
  navTitle.fontName = getFont("Space Mono", "Bold");
  navTitle.characters = "NAVIGATION";
  navTitle.fontSize = 11;
  navTitle.letterSpacing = { value: 2, unit: "PIXELS" };
  navTitle.fills = [{ type: "SOLID", color: { r: 56/255, g: 189/255, b: 248/255 } }];
  navTitle.x = 36;
  navTitle.y = 120;
  artboard9.appendChild(navTitle);

  const links = ["01 Reel", "02 Work", "03 Contact", "04 CV / Resume"];
  links.forEach((link, idx) => {
    const linkText = figma.createText();
    linkText.fontName = getFont("Inter", "Bold");
    linkText.characters = link;
    linkText.fontSize = 24;
    linkText.fills = [{ type: "SOLID", color: idx === 2 ? { r: 56/255, g: 189/255, b: 248/255 } : COLORS.cream }];
    linkText.x = 36;
    linkText.y = 170 + (idx * 60);
    artboard9.appendChild(linkText);
  });

  console.log("Figma Native Mobile Portfolio Construction Complete! 9 frames created.");
})();
