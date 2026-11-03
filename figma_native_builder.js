// =========================================================================
// FIGMA NATIVE BUILDER SCRIPT
// Run this inside Figma via: Plugins -> Development -> Open Console / Scripter
// Or create a new local plugin with this code.
// =========================================================================

(async () => {
  console.log("Starting native Figma layer creation...");

  // Load fonts first
  await Promise.all([
    figma.loadFontAsync({ family: "DM Sans", style: "Regular" }).catch(() => {}),
    figma.loadFontAsync({ family: "DM Sans", style: "Bold" }).catch(() => {}),
    figma.loadFontAsync({ family: "Space Mono", style: "Regular" }).catch(() => {}),
    figma.loadFontAsync({ family: "Space Mono", style: "Bold" }).catch(() => {}),
    figma.loadFontAsync({ family: "Inter", style: "Regular" }).catch(() => {}),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }).catch(() => {})
  ]);

  const defaultFont = { family: "Inter", style: "Regular" };

  // Page setup
  const page = figma.currentPage;
  page.name = "Basil Jose — Website Portfolio";

  // Artboard 1: Visual Reel Hero
  const heroFrame = figma.createFrame();
  heroFrame.name = "Artboard 1: Visual Reel Hero";
  heroFrame.resize(1440, 900);
  heroFrame.x = 0;
  heroFrame.y = 0;
  heroFrame.fills = [{ type: "SOLID", color: { r: 255/255, g: 247/255, b: 237/255 } }];
  heroFrame.cornerRadius = 20;

  // Header in Hero
  const heroHeader = figma.createFrame();
  heroHeader.name = "Header";
  heroHeader.resize(1320, 60);
  heroHeader.x = 60;
  heroHeader.y = 40;
  heroHeader.fills = [];
  heroHeader.layoutMode = "HORIZONTAL";
  heroHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
  heroHeader.counterAxisAlignItems = "CENTER";
  heroFrame.appendChild(heroHeader);

  const logoText = figma.createText();
  logoText.name = "Logo";
  try { await figma.loadFontAsync({ family: "DM Sans", style: "Bold" }); logoText.fontName = { family: "DM Sans", style: "Bold" }; } catch { logoText.fontName = defaultFont; }
  logoText.characters = "BASIL JOSE";
  logoText.fontSize = 18;
  logoText.fills = [{ type: "SOLID", color: { r: 14/255, g: 25/255, b: 40/255 } }];
  heroHeader.appendChild(logoText);

  // Artboard 2: Album Carousel
  const carouselFrame = figma.createFrame();
  carouselFrame.name = "Artboard 2: Album Carousel";
  carouselFrame.resize(1440, 900);
  carouselFrame.x = 1540;
  carouselFrame.y = 0;
  carouselFrame.fills = [{ type: "SOLID", color: { r: 255/255, g: 247/255, b: 237/255 } }];
  carouselFrame.cornerRadius = 20;

  // Artboard 3: Postcards Showcase Desk
  const deskFrame = figma.createFrame();
  deskFrame.name = "Artboard 3: Postcards Showcase Desk";
  deskFrame.resize(1440, 900);
  deskFrame.x = 3080;
  deskFrame.y = 0;
  deskFrame.fills = [{ type: "SOLID", color: { r: 51/255, g: 97/255, b: 150/255 } }];
  deskFrame.cornerRadius = 20;

  // Zoom to fit
  figma.viewport.scrollAndZoomIntoView([heroFrame, carouselFrame, deskFrame]);
  console.log("Native Figma Frames constructed successfully!");
})();
