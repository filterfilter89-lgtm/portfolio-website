import os
import base64
import io
from PIL import Image

def get_base64_image(path, max_size=(500, 500), quality=85):
    if not os.path.exists(path):
        return ""
    try:
        im = Image.open(path)
        im.thumbnail(max_size, Image.Resampling.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, format='WEBP', quality=quality)
        b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        return f"data:image/webp;base64,{b64}"
    except Exception as e:
        print(f"Error processing {path}: {e}")
        return ""

BASE_DIR = r"C:\Users\basil\Documents\WEBSITE PORTFOLIO"

hero_img_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "frames", "web00.webp"), max_size=(786, 1704), quality=90)
ad_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons_backup", "ADVERTISEMENT.png"), max_size=(400, 400), quality=90)
gd_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons_backup", "GRAPHIC DESIGN.png"), max_size=(400, 400), quality=90)
video_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons_backup", "VIDEOGRAPHY.png"), max_size=(400, 400), quality=90)

ganesh_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 1.png"), max_size=(240, 300), quality=85)
fetto_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fetto-garments", "Artboard 1 copy 2.png"), max_size=(360, 480), quality=85)
fetto_slide1_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fetto-garments", "Artboard 1.png"), max_size=(240, 320), quality=85)
fetto_slide2_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fetto-garments", "Artboard 1 copy.png"), max_size=(240, 320), quality=85)
fouz_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fouz-travels", "FOUZ POSTER 1.png"), max_size=(240, 300), quality=85)
fruitly_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fruitly", "1.png"), max_size=(240, 300), quality=85)
realme_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "videography", "dot-store", "realme-thumb.webp"), max_size=(480, 270), quality=85)

print("All assets prepared. Generating SVG...")

svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="2150" height="2050" viewBox="0 0 2150 2050" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&amp;family=Space+Mono:wght@400;700&amp;family=Instrument+Serif:ital@0;1&amp;family=Caveat:wght@500;600;700&amp;display=swap');
      .font-sans {{ font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }}
      .font-mono {{ font-family: 'Space Mono', Menlo, monospace; }}
      .font-serif {{ font-family: 'Instrument Serif', Georgia, serif; }}
      .font-script {{ font-family: 'Caveat', cursive, sans-serif; }}
      .font-flapstick {{ font-family: 'FlapstickDEMO', 'Caveat', 'Instrument Serif', serif; }}
    </style>

    <!-- Filters & Shadows -->
    <filter id="shadow-phone" x="-10%" y="-10%" width="125%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#0a121e" flood-opacity="0.28" />
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#0a121e" flood-opacity="0.16" />
    </filter>

    <filter id="shadow-mobile-card" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#0a1526" flood-opacity="0.22" />
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#0a1526" flood-opacity="0.14" />
    </filter>

    <filter id="shadow-mobile-postcard" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#07101d" flood-opacity="0.32" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#07101d" flood-opacity="0.18" />
    </filter>

    <filter id="shadow-modal" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#02060d" flood-opacity="0.45" />
    </filter>

    <!-- Airmail Border Pattern -->
    <pattern id="airmail-stripes-mobile" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="5" height="20" fill="#dc2626" />
      <rect x="5" width="5" height="20" fill="#ffffff" />
      <rect x="10" width="5" height="20" fill="#2563eb" />
      <rect x="15" width="5" height="20" fill="#ffffff" />
    </pattern>

    <!-- Clip Paths -->
    <clipPath id="mobile-screen-clip"><rect width="393" height="852" rx="44" /></clipPath>
    <clipPath id="mobile-hero-clip"><rect width="393" height="852" rx="44" /></clipPath>
    <clipPath id="sleeve-clip"><rect width="260" height="260" rx="16" /></clipPath>
    <clipPath id="postcard-clip-mobile"><rect width="330" height="136" rx="8" /></clipPath>
    <clipPath id="stamp-clip"><rect width="52" height="68" rx="2" /></clipPath>
    <clipPath id="polaroid-photo-clip"><rect width="66" height="84" rx="3" /></clipPath>
    <clipPath id="lightbox-img-clip"><rect width="328" height="420" rx="8" /></clipPath>
    <clipPath id="video-frame-clip"><rect width="328" height="184" rx="8" /></clipPath>
  </defs>

  <!-- ========================================================================================= -->
  <!-- ROW 1: PRIMARY USER JOURNEY (Hero Start -> Hero Play -> Carousel -> Postcards Desk)        -->
  <!-- ========================================================================================= -->

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 1: MOBILE VISUAL REEL HERO (SCRUB / START STATE)                                  -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 1: Visual Reel Hero (Start)" transform="translate(80, 80)">
    <!-- Device Outer Shadow -->
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#fff7ed" stroke="#d5c8b8" stroke-width="2" />
    </g>

    <!-- Screen Content Wrapped in Screen Clip -->
    <g clip-path="url(#mobile-screen-clip)">
      <!-- Background Paper Tint -->
      <rect width="393" height="852" fill="#fff7ed" />

      <!-- Full-Bleed Anime Hero Portrait Canvas -->
      <g id="Hero Illustration Canvas">
        <image href="{hero_img_b64}" x="-10" y="0" width="413" height="852" preserveAspectRatio="xMidYMid slice" />
      </g>

      <!-- Flapstick DEMO Display Typography -->
      <g id="Hero Flapstick Typography">
        <text x="28" y="415" class="font-script" font-size="44" font-weight="700" fill="#285991" letter-spacing="1">Basil</text>
        <text x="248" y="415" class="font-script" font-size="44" font-weight="700" fill="#285991" letter-spacing="1">Jose</text>
      </g>

      <!-- Floating Scroll Prompt Pill -->
      <g id="Scroll Prompt Indicator" transform="translate(196.5, 780)">
        <rect x="-70" y="-16" width="140" height="32" rx="16" fill="rgba(40, 89, 145, 0.08)" stroke="#285991" stroke-width="1.2" />
        <text x="-8" y="4" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#285991" letter-spacing="1.2">SCROLL TO PLAY</text>
        <path d="M46 -2 L50 2 L54 -2" stroke="#285991" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>

      <!-- Bottom Timeline Scrub Bar -->
      <g id="Timeline Progress Scrubber" transform="translate(20, 826)">
        <rect width="353" height="3" rx="1.5" fill="rgba(40, 89, 145, 0.2)" />
        <rect width="28" height="3" rx="1.5" fill="#285991" />
      </g>

      <!-- Mobile Status Bar (Dark on Cream) -->
      <g id="Status Bar" transform="translate(24, 14)">
        <text x="8" y="16" class="font-sans" font-size="14" font-weight="700" fill="#0e1928">9:41</text>
        <!-- Dynamic Island -->
        <rect x="110" y="2" width="100" height="26" rx="13" fill="#000000" />
        <!-- Cellular, Wifi, Battery -->
        <g transform="translate(280, 6)" fill="#0e1928">
          <rect x="0" y="8" width="3" height="6" rx="0.5" />
          <rect x="5" y="6" width="3" height="8" rx="0.5" />
          <rect x="10" y="3" width="3" height="11" rx="0.5" />
          <rect x="15" y="0" width="3" height="14" rx="0.5" />
          <path d="M26 12 A6 6 0 0 1 36 12 M28 9 A9 9 0 0 1 34 9" stroke="#0e1928" stroke-width="1.5" fill="none" stroke-linecap="round" />
          <rect x="42" y="2" width="20" height="10" rx="3" stroke="#0e1928" stroke-width="1.5" fill="none" />
          <rect x="44" y="4" width="13" height="6" rx="1.5" />
          <path d="M63 5 C63.5 5 64 5.5 64 6 L64 8 C64 8.5 63.5 9 63 9" fill="#0e1928" />
        </g>
      </g>
    </g>

    <!-- Artboard Title Caption -->
    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">01 • HERO SCRUB VIEWPORT</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">393 × 852 • Interactive Anime Reel Scrub</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 2: MOBILE VISUAL REEL HERO (TRIGGER PLAY / END STATE)                            -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 2: Visual Reel Hero (Play Trigger)" transform="translate(560, 80)">
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#285991" stroke="#1d426d" stroke-width="2" />
    </g>

    <g clip-path="url(#mobile-screen-clip)">
      <!-- Signature Ocean Blue Background (Frame 48 Solid Color) -->
      <rect width="393" height="852" fill="#285991" />

      <!-- Center Play Button (No outer ring - 100% accurate) -->
      <g id="Play Button Component" transform="translate(196.5, 426)">
        <g filter="url(#shadow-mobile-card)">
          <circle cx="0" cy="0" r="64" fill="#fff7ed" />
        </g>
        <polygon points="-12,-20 -12,20 20,0" fill="#285991" />
      </g>

      <!-- Tap Prompt Pill -->
      <g id="Tap Prompt" transform="translate(196.5, 524)">
        <rect x="-80" y="-14" width="160" height="28" rx="14" fill="rgba(255, 247, 237, 0.16)" stroke="rgba(255, 247, 237, 0.35)" stroke-width="1.2" />
        <text x="0" y="4" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#fff7ed" letter-spacing="1.2">TAP TO PLAY REEL</text>
      </g>

      <!-- Bottom Timeline Scrub Bar (100% Completed) -->
      <g id="Timeline Scrubber Completed" transform="translate(20, 826)">
        <rect width="353" height="3" rx="1.5" fill="#fff7ed" />
      </g>

      <!-- Mobile Status Bar (White on Blue) -->
      <g id="Status Bar Light" transform="translate(24, 14)">
        <text x="8" y="16" class="font-sans" font-size="14" font-weight="700" fill="#ffffff">9:41</text>
        <rect x="110" y="2" width="100" height="26" rx="13" fill="#0a1526" />
        <g transform="translate(280, 6)" fill="#ffffff">
          <rect x="0" y="8" width="3" height="6" rx="0.5" />
          <rect x="5" y="6" width="3" height="8" rx="0.5" />
          <rect x="10" y="3" width="3" height="11" rx="0.5" />
          <rect x="15" y="0" width="3" height="14" rx="0.5" />
          <path d="M26 12 A6 6 0 0 1 36 12 M28 9 A9 9 0 0 1 34 9" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round" />
          <rect x="42" y="2" width="20" height="10" rx="3" stroke="#ffffff" stroke-width="1.5" fill="none" />
          <rect x="44" y="4" width="13" height="6" rx="1.5" />
          <path d="M63 5 C63.5 5 64 5.5 64 6 L64 8 C64 8.5 63.5 9 63 9" fill="#ffffff" />
        </g>
      </g>
    </g>

    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">02 • REEL TRIGGER (PLAY BUTTON)</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">Clean Minimalist Play State (Zero Ring Outline)</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 3: MOBILE ALBUM CAROUSEL (#work)                                                 -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 3: Album Carousel (#work)" transform="translate(1040, 80)">
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#fff7ed" stroke="#d5c8b8" stroke-width="2" />
    </g>

    <g clip-path="url(#mobile-screen-clip)">
      <rect width="393" height="852" fill="#fff7ed" />

      <!-- Top Back Navigation Header -->
      <g id="Top Header Bar" transform="translate(20, 56)">
        <!-- Clean Back Button (REEL) -->
        <g id="Back Button (REEL)">
          <path d="M12 10 L4 10 M8 6 L4 10 L8 14" stroke="#285991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="18" y="14" class="font-mono" font-size="11" font-weight="700" fill="#285991" letter-spacing="1">REEL</text>
          <rect x="52" y="3" width="28" height="15" rx="3" fill="rgba(40,89,145,0.08)" stroke="rgba(40,89,145,0.2)" stroke-width="1" />
          <text x="66" y="14" text-anchor="middle" class="font-mono" font-size="8" font-weight="700" fill="#285991">ESC</text>
        </g>
        <!-- Wordmark -->
        <text x="353" y="14" text-anchor="end" class="font-mono" font-size="10" font-weight="700" fill="#94a3b8" letter-spacing="1">PORTFOLIO</text>
      </g>

      <!-- Circular Carousel Curved Gallery Stage -->
      <g id="Circular Gallery Carousel Stage" transform="translate(0, 180)">
        <!-- Left Peek Card (Arching off left) -->
        <g id="Left Neighbor Sleeve" transform="translate(-160, 60) rotate(-14) scale(0.85)" opacity="0.35">
          <rect width="260" height="260" rx="18" fill="#fff7ed" stroke="#285991" stroke-width="8" />
          <image href="{video_icon_b64}" x="30" y="30" width="200" height="200" preserveAspectRatio="xMidYMid meet" opacity="0.6" />
        </g>

        <!-- Right Peek Card (Arching off right) -->
        <g id="Right Neighbor Sleeve" transform="translate(295, 60) rotate(14) scale(0.85)" opacity="0.35">
          <rect width="260" height="260" rx="18" fill="#fff7ed" stroke="#285991" stroke-width="8" />
          <image href="{gd_icon_b64}" x="30" y="30" width="200" height="200" preserveAspectRatio="xMidYMid meet" opacity="0.6" />
        </g>

        <!-- Active Center Vinyl Album Sleeve -->
        <g id="Active Vinyl Album Sleeve" transform="translate(66.5, 40)">
          <g filter="url(#shadow-mobile-card)">
            <!-- Outer Jacket Border (8px deep blue border matching design) -->
            <rect width="260" height="260" rx="18" fill="#fff7ed" stroke="#285991" stroke-width="8" />
          </g>
          <!-- Center Halftone Megaphone Art -->
          <g clip-path="url(#sleeve-clip)">
            <image href="{ad_icon_b64}" x="25" y="25" width="210" height="210" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>
      </g>

      <!-- Album Title & Tagline -->
      <g id="Album Metadata Typography" transform="translate(196.5, 545)">
        <text x="0" y="0" text-anchor="middle" class="font-mono" font-size="16" font-weight="700" fill="#285991" letter-spacing="2">ADVERTISEMENT</text>
        <text x="0" y="24" text-anchor="middle" class="font-serif" font-size="15" font-style="italic" fill="#64748b">Commercial &amp; Editorial Reels</text>
      </g>

      <!-- Carousel Pagination Dots -->
      <g id="Carousel Dots" transform="translate(196.5, 620)">
        <rect x="-36" y="-3" width="18" height="6" rx="3" fill="#285991" />
        <circle cx="-6" cy="0" r="3" fill="#cbd5e1" />
        <circle cx="10" cy="0" r="3" fill="#cbd5e1" />
        <circle cx="26" cy="0" r="3" fill="#cbd5e1" />
        <circle cx="42" cy="0" r="3" fill="#cbd5e1" />
      </g>

      <!-- Interaction Hint -->
      <g id="Swipe Interaction Hint" transform="translate(196.5, 760)">
        <rect x="-95" y="-14" width="190" height="28" rx="14" fill="rgba(40, 89, 145, 0.06)" stroke="rgba(40, 89, 145, 0.15)" stroke-width="1" />
        <text x="0" y="4" text-anchor="middle" class="font-mono" font-size="8.5" font-weight="700" fill="#64748b" letter-spacing="1">SWIPE TO BROWSE • TAP TO OPEN</text>
      </g>

      <!-- Mobile Status Bar (Dark) -->
      <g id="Status Bar Dark" transform="translate(24, 14)">
        <text x="8" y="16" class="font-sans" font-size="14" font-weight="700" fill="#0e1928">9:41</text>
        <rect x="110" y="2" width="100" height="26" rx="13" fill="#000000" />
        <g transform="translate(280, 6)" fill="#0e1928">
          <rect x="0" y="8" width="3" height="6" rx="0.5" />
          <rect x="5" y="6" width="3" height="8" rx="0.5" />
          <rect x="10" y="3" width="3" height="11" rx="0.5" />
          <rect x="15" y="0" width="3" height="14" rx="0.5" />
          <path d="M26 12 A6 6 0 0 1 36 12 M28 9 A9 9 0 0 1 34 9" stroke="#0e1928" stroke-width="1.5" fill="none" stroke-linecap="round" />
          <rect x="42" y="2" width="20" height="10" rx="3" stroke="#0e1928" stroke-width="1.5" fill="none" />
          <rect x="44" y="4" width="13" height="6" rx="1.5" />
          <path d="M63 5 C63.5 5 64 5.5 64 6 L64 8 C64 8.5 63.5 9 63 9" fill="#0e1928" />
        </g>
      </g>
    </g>

    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">03 • ALBUM CAROUSEL (#WORK)</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">Curved Arc Carousel with Halftone Sleeves</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 4: MOBILE POSTCARD SHOWCASE DESK (#work/category)                                -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 4: Postcard Showcase Desk" transform="translate(1520, 80)">
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#285991" stroke="#1d426d" stroke-width="2" />
    </g>

    <g clip-path="url(#mobile-screen-clip)">
      <!-- Deep Blue Desk Background -->
      <rect width="393" height="852" fill="#285991" />

      <!-- Top Header Navigation -->
      <g id="Showcase Header" transform="translate(20, 56)">
        <g id="Back Button (ALBUMS)">
          <path d="M12 10 L4 10 M8 6 L4 10 L8 14" stroke="#fff7ed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="18" y="14" class="font-mono" font-size="11" font-weight="700" fill="#fff7ed" letter-spacing="1">ALBUMS</text>
          <rect x="68" y="3" width="28" height="15" rx="3" fill="rgba(255,247,237,0.12)" stroke="rgba(255,247,237,0.25)" stroke-width="1" />
          <text x="82" y="14" text-anchor="middle" class="font-mono" font-size="8" font-weight="700" fill="#fff7ed">ESC</text>
        </g>
        <text x="353" y="14" text-anchor="end" class="font-mono" font-size="10" font-weight="700" fill="rgba(255,247,237,0.6)" letter-spacing="1">GRAPHIC DESIGNS</text>
      </g>

      <!-- Vertical Postcard Desk Layout (4 Centered Airmail Postcards) -->
      <g id="Postcard Desk Stack" transform="translate(31.5, 110)">
        
        <!-- Postcard 1: Eazyarts Ganesh -->
        <g id="Postcard 01: Eazyarts Ganesh" transform="translate(0, 0)">
          <g filter="url(#shadow-mobile-postcard)">
            <rect width="330" height="142" rx="8" fill="url(#airmail-stripes-mobile)" />
            <rect x="5" y="5" width="320" height="132" rx="5" fill="#fff7ed" />
          </g>
          <!-- Left Info Pane -->
          <text x="22" y="28" class="font-mono" font-size="9" fill="#94a3b8">2026</text>
          <text x="50" y="82" class="font-script" font-size="25" font-weight="700" fill="#1e3a5f">Eazyarts Ganesh</text>
          <!-- Right Stamp -->
          <g transform="translate(244, 16)">
            <rect width="58" height="76" rx="2" fill="#285991" />
            <!-- Inner Stamp Image -->
            <g clip-path="url(#stamp-clip)" transform="translate(3, 4)">
              <image href="{ganesh_thumb_b64}" x="0" y="0" width="52" height="68" preserveAspectRatio="xMidYMid slice" />
            </g>
          </g>
        </g>

        <!-- Postcard 2: Fetto Garments -->
        <g id="Postcard 02: Fetto Garments" transform="translate(0, 160)">
          <g filter="url(#shadow-mobile-postcard)">
            <rect width="330" height="142" rx="8" fill="url(#airmail-stripes-mobile)" />
            <rect x="5" y="5" width="320" height="132" rx="5" fill="#fff7ed" />
          </g>
          <text x="22" y="28" class="font-mono" font-size="9" fill="#94a3b8">2026</text>
          <text x="50" y="82" class="font-script" font-size="25" font-weight="700" fill="#1e3a5f">Fetto Garments</text>
          <g transform="translate(244, 16)">
            <rect width="58" height="76" rx="2" fill="#285991" />
            <g clip-path="url(#stamp-clip)" transform="translate(3, 4)">
              <image href="{fetto_thumb_b64}" x="0" y="0" width="52" height="68" preserveAspectRatio="xMidYMid slice" />
            </g>
          </g>
        </g>

        <!-- Postcard 3: Fouz Travels -->
        <g id="Postcard 03: Fouz Travels" transform="translate(0, 320)">
          <g filter="url(#shadow-mobile-postcard)">
            <rect width="330" height="142" rx="8" fill="url(#airmail-stripes-mobile)" />
            <rect x="5" y="5" width="320" height="132" rx="5" fill="#fff7ed" />
          </g>
          <text x="22" y="28" class="font-mono" font-size="9" fill="#94a3b8">2026</text>
          <text x="50" y="82" class="font-script" font-size="25" font-weight="700" fill="#1e3a5f">Fouz Travels</text>
          <g transform="translate(244, 16)">
            <rect width="58" height="76" rx="2" fill="#285991" />
            <g clip-path="url(#stamp-clip)" transform="translate(3, 4)">
              <image href="{fouz_thumb_b64}" x="0" y="0" width="52" height="68" preserveAspectRatio="xMidYMid slice" />
            </g>
          </g>
        </g>

        <!-- Postcard 4: Fruitly -->
        <g id="Postcard 04: Fruitly" transform="translate(0, 480)">
          <g filter="url(#shadow-mobile-postcard)">
            <rect width="330" height="142" rx="8" fill="url(#airmail-stripes-mobile)" />
            <rect x="5" y="5" width="320" height="132" rx="5" fill="#fff7ed" />
          </g>
          <text x="22" y="28" class="font-mono" font-size="9" fill="#94a3b8">2026</text>
          <text x="50" y="82" class="font-script" font-size="25" font-weight="700" fill="#1e3a5f">Fruitly</text>
          <g transform="translate(244, 16)">
            <rect width="58" height="76" rx="2" fill="#285991" />
            <g clip-path="url(#stamp-clip)" transform="translate(3, 4)">
              <image href="{fruitly_thumb_b64}" x="0" y="0" width="52" height="68" preserveAspectRatio="xMidYMid slice" />
            </g>
          </g>
        </g>
      </g>

      <!-- Mobile Status Bar (White on Blue) -->
      <g id="Status Bar Light 4" transform="translate(24, 14)">
        <text x="8" y="16" class="font-sans" font-size="14" font-weight="700" fill="#ffffff">9:41</text>
        <rect x="110" y="2" width="100" height="26" rx="13" fill="#0a1526" />
        <g transform="translate(280, 6)" fill="#ffffff">
          <rect x="0" y="8" width="3" height="6" rx="0.5" />
          <rect x="5" y="6" width="3" height="8" rx="0.5" />
          <rect x="10" y="3" width="3" height="11" rx="0.5" />
          <rect x="15" y="0" width="3" height="14" rx="0.5" />
          <path d="M26 12 A6 6 0 0 1 36 12 M28 9 A9 9 0 0 1 34 9" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round" />
          <rect x="42" y="2" width="20" height="10" rx="3" stroke="#ffffff" stroke-width="1.5" fill="none" />
          <rect x="44" y="4" width="13" height="6" rx="1.5" />
          <path d="M63 5 C63.5 5 64 5.5 64 6 L64 8 C64 8.5 63.5 9 63 9" fill="#ffffff" />
        </g>
      </g>
    </g>

    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">04 • POSTCARD SHOWCASE DESK</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">Vertical Mobile Postcard Stack with Stamps</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ROW 2: DETAILED INTERACTION STATES (Flipped Bento -> Lightbox -> Video Player -> Tokens)   -->
  <!-- ========================================================================================= -->

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 5: MOBILE FLIPPED POSTCARD BENTO GRID                                            -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 5: Flipped Bento Grid" transform="translate(80, 1050)">
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#0f2238" stroke="#1b395e" stroke-width="2" />
    </g>

    <g clip-path="url(#mobile-screen-clip)">
      <!-- Dimmed Blurred Background -->
      <rect width="393" height="852" fill="#0f2238" />

      <!-- Ghost background cards (indicating stack behind) -->
      <g opacity="0.15" transform="translate(31.5, 110)">
        <rect width="330" height="142" rx="8" fill="#fff7ed" />
        <rect y="480" width="330" height="142" rx="8" fill="#fff7ed" />
      </g>

      <!-- Flipped Postcard Container Modal -->
      <g id="Flipped Postcard Modal" transform="translate(16, 290)">
        <g filter="url(#shadow-modal)">
          <rect width="361" height="260" rx="16" fill="#fff7ed" />
        </g>

        <!-- Close Button (Pill with X) -->
        <g id="Close Button" transform="translate(315, 12)">
          <circle cx="15" cy="15" r="15" fill="#f0e6d6" />
          <path d="M10 10 L20 20 M20 10 L10 20" stroke="#285991" stroke-width="2" stroke-linecap="round" />
        </g>

        <!-- Horizontal Polaroid Row (Bento Layout) -->
        <g id="Polaroid Gallery Row" transform="translate(14, 44)">
          
          <!-- Polaroid 1 -->
          <g id="Polaroid 01" transform="translate(0, 0)">
            <g filter="url(#shadow-mobile-card)">
              <rect width="76" height="170" rx="4" fill="#ffffff" />
            </g>
            <g clip-path="url(#polaroid-photo-clip)" transform="translate(5, 5)">
              <image href="{fetto_thumb_b64}" x="-25" y="0" width="120" height="145" preserveAspectRatio="xMidYMid slice" />
            </g>
            <text x="38" y="160" text-anchor="middle" class="font-mono" font-size="6" font-weight="700" fill="#64748b">SLIDE 01</text>
          </g>

          <!-- Polaroid 2 -->
          <g id="Polaroid 02" transform="translate(84, 0)">
            <g filter="url(#shadow-mobile-card)">
              <rect width="76" height="170" rx="4" fill="#ffffff" />
            </g>
            <g clip-path="url(#polaroid-photo-clip)" transform="translate(5, 5)">
              <image href="{fetto_slide1_b64}" x="-10" y="0" width="86" height="145" preserveAspectRatio="xMidYMid slice" />
            </g>
            <text x="38" y="160" text-anchor="middle" class="font-mono" font-size="6" font-weight="700" fill="#64748b">SLIDE 02</text>
          </g>

          <!-- Polaroid 3 -->
          <g id="Polaroid 03" transform="translate(168, 0)">
            <g filter="url(#shadow-mobile-card)">
              <rect width="76" height="170" rx="4" fill="#ffffff" />
            </g>
            <g clip-path="url(#polaroid-photo-clip)" transform="translate(5, 5)">
              <image href="{fetto_slide2_b64}" x="-10" y="0" width="86" height="145" preserveAspectRatio="xMidYMid slice" />
            </g>
            <text x="38" y="160" text-anchor="middle" class="font-mono" font-size="6" font-weight="700" fill="#64748b">SLIDE 03</text>
          </g>

          <!-- Polaroid 4 -->
          <g id="Polaroid 04" transform="translate(252, 0)">
            <g filter="url(#shadow-mobile-card)">
              <rect width="76" height="170" rx="4" fill="#ffffff" />
            </g>
            <g clip-path="url(#polaroid-photo-clip)" transform="translate(5, 5)">
              <image href="{fetto_thumb_b64}" x="0" y="0" width="76" height="145" preserveAspectRatio="xMidYMid slice" />
            </g>
            <text x="38" y="160" text-anchor="middle" class="font-mono" font-size="6" font-weight="700" fill="#64748b">SLIDE 04</text>
          </g>
        </g>

        <!-- Tap Hint -->
        <text x="180" y="235" text-anchor="middle" class="font-mono" font-size="8.5" font-weight="700" fill="#94a3b8" letter-spacing="0.8">TAP POLAROID TO EXPAND FULLSCREEN</text>
      </g>

      <!-- Mobile Status Bar (White on Dark) -->
      <g id="Status Bar Light 5" transform="translate(24, 14)">
        <text x="8" y="16" class="font-sans" font-size="14" font-weight="700" fill="#ffffff">9:41</text>
        <rect x="110" y="2" width="100" height="26" rx="13" fill="#000000" />
      </g>
    </g>

    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">05 • FLIPPED POSTCARD BENTO GRID</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">Multi-Polaroid Zero-Rotation Layout</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 6: MOBILE CINEMATIC LIGHTBOX MODAL                                               -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 6: Cinematic Lightbox Modal" transform="translate(560, 1050)">
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#070e17" stroke="#132438" stroke-width="2" />
    </g>

    <g clip-path="url(#mobile-screen-clip)">
      <!-- Dark Cinematic Backdrop -->
      <rect width="393" height="852" fill="#070e17" />

      <!-- Fullscreen Image Inspect Card Container -->
      <g id="Inspect Modal Card" transform="translate(20, 120)">
        <g filter="url(#shadow-modal)">
          <rect width="353" height="580" rx="16" fill="#ffffff" />
        </g>

        <!-- High-Resolution Graphic Poster Image -->
        <g clip-path="url(#lightbox-img-clip)" transform="translate(12, 12)">
          <image href="{fetto_thumb_b64}" x="-10" y="-10" width="348" height="440" preserveAspectRatio="xMidYMid slice" />
        </g>

        <!-- Close Button (Top-Right inside image) -->
        <g id="Modal Close Button" transform="translate(305, 22)">
          <circle cx="16" cy="16" r="16" fill="rgba(14, 25, 40, 0.65)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
          <path d="M11 11 L21 21 M21 11 L11 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        </g>

        <!-- Bottom Metadata Strip -->
        <g id="Image Metadata Bar" transform="translate(20, 470)">
          <text x="0" y="24" class="font-mono" font-size="9" font-weight="700" fill="#285991" letter-spacing="1">CONTACT US ON WHATSAPP</text>
          <text x="0" y="52" class="font-sans" font-size="16" font-weight="700" fill="#0e1928">Artboard 1 Copy 2 • Fetto Garments</text>
          <text x="0" y="74" class="font-sans" font-size="11" fill="#64748b">Custom jersey typographic identity &amp; vector jersey design.</text>
        </g>
      </g>

      <!-- Mobile Status Bar (White on Dark) -->
      <g id="Status Bar Light 6" transform="translate(24, 14)">
        <text x="8" y="16" class="font-sans" font-size="14" font-weight="700" fill="#ffffff">9:41</text>
        <rect x="110" y="2" width="100" height="26" rx="13" fill="#000000" />
      </g>
    </g>

    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">06 • LIGHTBOX INSPECT MODAL</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">Full-Resolution Zoom with Metadata</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 7: MOBILE VIDEOGRAPHY IN-CARD VIDEO PLAYER                                       -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 7: Videography In-Card Player" transform="translate(1040, 1050)">
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#285991" stroke="#1d426d" stroke-width="2" />
    </g>

    <g clip-path="url(#mobile-screen-clip)">
      <rect width="393" height="852" fill="#285991" />

      <!-- Top Header Navigation -->
      <g id="Video Showcase Header" transform="translate(20, 56)">
        <g id="Back Button (ALBUMS 7)">
          <path d="M12 10 L4 10 M8 6 L4 10 L8 14" stroke="#fff7ed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="18" y="14" class="font-mono" font-size="11" font-weight="700" fill="#fff7ed" letter-spacing="1">ALBUMS</text>
          <rect x="68" y="3" width="28" height="15" rx="3" fill="rgba(255,247,237,0.12)" stroke="rgba(255,247,237,0.25)" stroke-width="1" />
          <text x="82" y="14" text-anchor="middle" class="font-mono" font-size="8" font-weight="700" fill="#fff7ed">ESC</text>
        </g>
        <text x="353" y="14" text-anchor="end" class="font-mono" font-size="10" font-weight="700" fill="rgba(255,247,237,0.6)" letter-spacing="1">VIDEOGRAPHY</text>
      </g>

      <!-- In-Card Video Player Postcard Container -->
      <g id="Flipped Video Postcard" transform="translate(18, 160)">
        <g filter="url(#shadow-modal)">
          <rect width="357" height="420" rx="16" fill="#fff7ed" />
        </g>

        <!-- Close Button -->
        <g id="Close Button 7" transform="translate(315, 14)">
          <circle cx="14" cy="14" r="14" fill="#f0e6d6" />
          <path d="M9 9 L19 19 M19 9 L9 19" stroke="#285991" stroke-width="1.8" stroke-linecap="round" />
        </g>

        <!-- Project Badge & Title -->
        <g transform="translate(20, 24)">
          <text x="0" y="0" class="font-mono" font-size="9" font-weight="700" fill="#64748b">DOT STORE • 2026</text>
          <text x="0" y="24" class="font-sans" font-size="18" font-weight="700" fill="#0e1928">Realme Smartphone</text>
        </g>

        <!-- 16:9 Video Canvas Player -->
        <g id="16-9 Video Canvas Container" transform="translate(14, 68)">
          <rect width="329" height="185" rx="8" fill="#0e1928" />
          <g clip-path="url(#video-frame-clip)">
            <image href="{realme_thumb_b64}" x="0" y="0" width="329" height="185" preserveAspectRatio="xMidYMid slice" />
          </g>

          <!-- Center Play/Pause Indicator Overlay -->
          <circle cx="164.5" cy="92.5" r="26" fill="rgba(14, 25, 40, 0.6)" stroke="#ffffff" stroke-width="1.5" />
          <polygon points="160,82 160,103 175,92.5" fill="#ffffff" />

          <!-- Video Custom Controls HUD -->
          <g id="Player HUD Controls" transform="translate(10, 150)">
            <rect width="309" height="26" rx="6" fill="rgba(14, 25, 40, 0.75)" backdrop-filter="blur(4px)" />
            <!-- Play icon -->
            <polygon points="12,8 12,18 20,13" fill="#ffffff" />
            <!-- Progress Line -->
            <rect x="28" y="11" width="200" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
            <rect x="28" y="11" width="80" height="4" rx="2" fill="#fff7ed" />
            <circle cx="108" cy="13" r="4" fill="#ffffff" />
            <!-- Time -->
            <text x="236" y="17" class="font-mono" font-size="7.5" fill="#ffffff">00:12/00:34</text>
            <!-- Mute Icon -->
            <g transform="translate(286, 7)" fill="#ffffff">
              <polygon points="0,5 3,5 6,2 6,10 3,7 0,7" />
              <path d="M8 3 C10 4.5 10 7.5 8 9" stroke="#ffffff" stroke-width="1" fill="none" stroke-linecap="round" />
            </g>
          </g>
        </g>

        <!-- Secondary Video Reel in Collection -->
        <g id="Secondary Video Item" transform="translate(14, 274)">
          <rect width="329" height="60" rx="8" fill="#f5ede2" stroke="#e5dacb" stroke-width="1" />
          <!-- Thumb -->
          <rect x="8" y="8" width="78" height="44" rx="4" fill="#0e1928" />
          <polygon points="44,24 44,36 54,30" fill="#ffffff" opacity="0.8" />
          <text x="96" y="26" class="font-sans" font-size="12" font-weight="700" fill="#0e1928">Wireless Speaker Reel</text>
          <text x="96" y="42" class="font-mono" font-size="9" fill="#64748b">00:28 • 1080P PRORES</text>
        </g>

        <!-- Project Description -->
        <text x="20" y="365" class="font-sans" font-size="11" fill="#475569">Cinematic product cinematography, dynamic lighting, and rhythm edit.</text>
      </g>

      <!-- Mobile Status Bar (White on Blue) -->
      <g id="Status Bar Light 7" transform="translate(24, 14)">
        <text x="8" y="16" class="font-sans" font-size="14" font-weight="700" fill="#ffffff">9:41</text>
        <rect x="110" y="2" width="100" height="26" rx="13" fill="#0a1526" />
      </g>
    </g>

    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">07 • VIDEOGRAPHY IN-CARD PLAYER</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">Native HTML5 16:9 Video Postcard</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 8: MOBILE DESIGN SYSTEM, TOKENS & MASTER COMPONENTS                               -->
  <!-- ========================================================================================= -->
  <g id="Mobile Artboard 8: Design System &amp; Tokens" transform="translate(1520, 1050)">
    <g filter="url(#shadow-phone)">
      <rect width="393" height="852" rx="44" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
    </g>

    <g clip-path="url(#mobile-screen-clip)">
      <rect width="393" height="852" fill="#f8fafc" />

      <!-- Section Title -->
      <g transform="translate(24, 60)">
        <text x="0" y="0" class="font-mono" font-size="10" font-weight="700" fill="#285991" letter-spacing="1.5">FIGMA DESIGN SYSTEM</text>
        <text x="0" y="24" class="font-sans" font-size="18" font-weight="700" fill="#0e1928">Mobile Tokens &amp; Components</text>
      </g>

      <!-- Color Tokens Grid -->
      <g id="Color Palette Tokens" transform="translate(24, 115)">
        <text x="0" y="0" class="font-mono" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">COLOR PALETTE</text>
        
        <!-- Swatch 1: Cream -->
        <g transform="translate(0, 14)">
          <rect width="48" height="48" rx="8" fill="#fff7ed" stroke="#e2d6c7" stroke-width="1" />
          <text x="56" y="20" class="font-sans" font-size="11" font-weight="700" fill="#0e1928">Cream Vintage</text>
          <text x="56" y="36" class="font-mono" font-size="9" fill="#64748b">#FFF7ED</text>
        </g>
        <!-- Swatch 2: Signature Blue -->
        <g transform="translate(180, 14)">
          <rect width="48" height="48" rx="8" fill="#285991" />
          <text x="56" y="20" class="font-sans" font-size="11" font-weight="700" fill="#0e1928">Signature Blue</text>
          <text x="56" y="36" class="font-mono" font-size="9" fill="#64748b">#285991</text>
        </g>
        <!-- Swatch 3: Dark Ink -->
        <g transform="translate(0, 72)">
          <rect width="48" height="48" rx="8" fill="#0e1928" />
          <text x="56" y="20" class="font-sans" font-size="11" font-weight="700" fill="#0e1928">Charcoal Ink</text>
          <text x="56" y="36" class="font-mono" font-size="9" fill="#64748b">#0E1928</text>
        </g>
        <!-- Swatch 4: Airmail Red & Blue -->
        <g transform="translate(180, 72)">
          <rect width="24" height="48" rx="8" fill="#dc2626" />
          <rect x="24" width="24" height="48" rx="8" fill="#2563eb" />
          <text x="56" y="20" class="font-sans" font-size="11" font-weight="700" fill="#0e1928">Airmail Red/Blue</text>
          <text x="56" y="36" class="font-mono" font-size="9" fill="#64748b">#DC2626 • #2563EB</text>
        </g>
      </g>

      <!-- Typography Tokens -->
      <g id="Typography Hierarchy" transform="translate(24, 270)">
        <text x="0" y="0" class="font-mono" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">TYPOGRAPHY SYSTEM</text>
        
        <g transform="translate(0, 18)">
          <text x="0" y="16" class="font-script" font-size="28" font-weight="700" fill="#285991">Flapstick DEMO / Caveat Script</text>
          <text x="0" y="36" class="font-mono" font-size="8.5" fill="#64748b">Display Title • Hand-lettered Signature</text>

          <text x="0" y="70" class="font-mono" font-size="13" font-weight="700" fill="#0e1928" letter-spacing="1.5">SPACE MONO BOLD 13PX</text>
          <text x="0" y="86" class="font-mono" font-size="8.5" fill="#64748b">Navigation • Timecode • Eyebrows • Labels</text>

          <text x="0" y="120" class="font-sans" font-size="16" font-weight="700" fill="#0e1928">DM Sans Bold 16px</text>
          <text x="0" y="136" class="font-mono" font-size="8.5" fill="#64748b">Project Headings • Body Copy • Descriptions</text>
        </g>
      </g>

      <!-- Master Components Library Preview -->
      <g id="Master Components" transform="translate(24, 450)">
        <text x="0" y="0" class="font-mono" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">REUSABLE COMPONENTS</text>

        <!-- 1. Clean Back Button Component -->
        <g transform="translate(0, 18)">
          <rect width="160" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <path d="M16 17 L8 17 M12 13 L8 17 L12 21" stroke="#285991" stroke-width="1.8" stroke-linecap="round" />
          <text x="24" y="21" class="font-mono" font-size="10" font-weight="700" fill="#285991" letter-spacing="1">ALBUMS</text>
          <rect x="74" y="9" width="28" height="15" rx="3" fill="rgba(40,89,145,0.08)" stroke="rgba(40,89,145,0.2)" stroke-width="1" />
          <text x="88" y="20" text-anchor="middle" class="font-mono" font-size="8" font-weight="700" fill="#285991">ESC</text>
          <text x="110" y="21" class="font-mono" font-size="8" fill="#94a3b8">Button</text>
        </g>

        <!-- 2. Master Postage Stamp Component -->
        <g transform="translate(180, 18)">
          <rect width="160" height="74" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <g transform="translate(10, 8)">
            <rect width="44" height="58" rx="2" fill="#285991" />
            <g clip-path="url(#stamp-clip)" transform="translate(2, 3)">
              <image href="{ganesh_thumb_b64}" x="0" y="0" width="40" height="52" preserveAspectRatio="xMidYMid slice" />
            </g>
          </g>
          <text x="64" y="28" class="font-sans" font-size="10" font-weight="700" fill="#0e1928">Postage Stamp</text>
          <text x="64" y="44" class="font-mono" font-size="8" fill="#64748b">Scalloped Master</text>
        </g>

        <!-- 3. Airmail Border Postcard Frame -->
        <g transform="translate(0, 106)">
          <rect width="345" height="70" rx="6" fill="url(#airmail-stripes-mobile)" />
          <rect x="4" y="4" width="337" height="62" rx="4" fill="#fff7ed" />
          <text x="18" y="24" class="font-mono" font-size="8" fill="#94a3b8">2026</text>
          <text x="18" y="46" class="font-script" font-size="18" font-weight="700" fill="#285991">Airmail Postcard Master Component</text>
        </g>

        <!-- 4. Polaroid Frame Component -->
        <g transform="translate(0, 190)">
          <rect width="160" height="150" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <!-- Polaroid -->
          <g transform="translate(48, 12)">
            <rect width="64" height="100" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
            <rect x="4" y="4" width="56" height="70" rx="2" fill="#285991" />
            <text x="32" y="92" text-anchor="middle" class="font-mono" font-size="6" font-weight="700" fill="#64748b">POLAROID</text>
          </g>
          <text x="80" y="132" text-anchor="middle" class="font-mono" font-size="8.5" font-weight="700" fill="#0e1928">Polaroid Master</text>
        </g>

        <!-- 5. Play Button Component -->
        <g transform="translate(180, 190)">
          <rect width="165" height="150" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <circle cx="82" cy="62" r="32" fill="#285991" />
          <circle cx="82" cy="62" r="24" fill="#fff7ed" />
          <polygon points="78,54 78,70 90,62" fill="#285991" />
          <text x="82" y="132" text-anchor="middle" class="font-mono" font-size="8.5" font-weight="700" fill="#0e1928">Play Button (No Ring)</text>
        </g>
      </g>
    </g>

    <text x="196.5" y="888" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">08 • MOBILE DESIGN SYSTEM &amp; TOKENS</text>
    <text x="196.5" y="904" text-anchor="middle" class="font-sans" font-size="11" fill="#94a3b8">Typography, Colors &amp; Master Components</text>
  </g>

</svg>
'''

output_path = os.path.join(BASE_DIR, "WEBSITE_PORTFOLIO_FIGMA_MOBILE_DESIGN.svg")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(svg)

print(f"File created successfully at {output_path} ({os.path.getsize(output_path)/(1024*1024):.2f} MB)")
