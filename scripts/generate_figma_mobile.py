import os
import base64
import io
import re
import xml.etree.ElementTree as ET
from PIL import Image

BASE_DIR = r"C:\Users\basil\Documents\WEBSITE PORTFOLIO"
SCRATCH_DIR = r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch"

def get_base64_image(path, max_size=(600, 600), is_jpeg=True, quality=88):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return ""
    try:
        im = Image.open(path)
        im.thumbnail(max_size, Image.Resampling.LANCZOS)
        buf = io.BytesIO()
        if is_jpeg:
            if im.mode != 'RGB':
                bg = Image.new('RGB', im.size, (255, 247, 237))
                if im.mode == 'RGBA':
                    bg.paste(im, mask=im.split()[3])
                else:
                    bg.paste(im)
                im = bg
            im.save(buf, format='JPEG', quality=quality)
            b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            return f"data:image/jpeg;base64,{b64}"
        else:
            if im.mode != 'RGBA':
                im = im.convert('RGBA')
            im.save(buf, format='PNG')
            b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            return f"data:image/png;base64,{b64}"
    except Exception as e:
        print(f"Error processing {path}: {e}")
        return ""

print("Encoding image assets in Figma-compatible JPEG / PNG format...")
hero_00_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "frames", "web00.webp"), max_size=(786, 1704), is_jpeg=True, quality=88)
hero_48_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "frames", "web48.webp"), max_size=(786, 1704), is_jpeg=True, quality=88)

ad_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons", "ADVERTISEMENT.png"), max_size=(560, 560), is_jpeg=False)
video_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons", "VIDEOGRAPHY.png"), max_size=(560, 560), is_jpeg=False)
genai_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons", "GENERATIVE AI.png"), max_size=(560, 560), is_jpeg=False)

# Graphic design projects
ganesh_slide1_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 1.png"), max_size=(450, 550), is_jpeg=True, quality=86)
ganesh_slide2_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 2.png"), max_size=(240, 320), is_jpeg=True, quality=84)
ganesh_slide3_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 3.png"), max_size=(240, 320), is_jpeg=True, quality=84)
ganesh_slide4_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 4.png"), max_size=(240, 320), is_jpeg=True, quality=84)
ganesh_slide5_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 5.png"), max_size=(240, 320), is_jpeg=True, quality=84)

fetto_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fetto-garments", "Artboard 1 copy 2.png"), max_size=(280, 360), is_jpeg=True, quality=86)
fouz_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fouz-travels", "FOUZ POSTER 1.png"), max_size=(280, 360), is_jpeg=True, quality=86)
fruitly_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fruitly", "1.png"), max_size=(280, 360), is_jpeg=True, quality=86)

# Videography reels
realme_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "videography", "dot-store", "realme-thumb.webp"), max_size=(360, 640), is_jpeg=True, quality=88)
speaker_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "videography", "dot-store", "speaker-thumb.webp"), max_size=(360, 640), is_jpeg=True, quality=88)

# Load split postcard templates
with open(os.path.join(SCRATCH_DIR, "postcard_defs_template.txt"), "r", encoding="utf-8") as f:
    pc_defs_template = f.read()

with open(os.path.join(SCRATCH_DIR, "postcard_body_template.txt"), "r", encoding="utf-8") as f:
    pc_body_template = f.read()

def create_postcard(title, thumb_b64, uid):
    words = title.split(' ')
    if len(words) >= 3 and len(title) > 16:
        mid = len(words) // 2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])
    else:
        line1 = title
        line2 = ""

    max_len = max(len(line1), len(line2))
    font_size = 56 if max_len > 24 else 66 if max_len > 16 else 74 if line2 else 80

    if line2:
        title_block = f'''
        <g id="{uid}-title">
          <text x="500" y="370" text-anchor="middle" fill="#1d3b6d" font-family="'Caveat', cursive" font-size="{font_size}" font-weight="700" letter-spacing="0.5">{line1}</text>
          <text x="500" y="{370 + int(font_size * 1.15)}" text-anchor="middle" fill="#1d3b6d" font-family="'Caveat', cursive" font-size="{font_size}" font-weight="700" letter-spacing="0.5">{line2}</text>
        </g>
        '''
    else:
        title_block = f'''
        <g id="{uid}-title">
          <text x="500" y="415" text-anchor="middle" fill="#1d3b6d" font-family="'Caveat', cursive" font-size="{font_size}" font-weight="700" letter-spacing="0.5">{line1}</text>
        </g>
        '''

    # Postcard defs for this UID
    pc_defs = pc_defs_template.replace('__UID__', uid)

    # Postcard body
    pc_body = pc_body_template.replace('__UID__', uid)
    pc_body = pc_body.replace('__THUMBNAIL_B64__', thumb_b64)
    pc_body = pc_body.replace('__TITLE_BLOCK__', title_block)

    return pc_defs, pc_body

# Generate 4 postcards
ganesh_defs, ganesh_body = create_postcard("Eazyarts Ganesh", ganesh_slide1_b64, "pc-ganesh")
fetto_defs, fetto_body = create_postcard("Fetto Garments", fetto_thumb_b64, "pc-fetto")
fouz_defs, fouz_body = create_postcard("Fouz Travels", fouz_thumb_b64, "pc-fouz")
fruitly_defs, fruitly_body = create_postcard("Fruitly", fruitly_thumb_b64, "pc-fruitly")

all_postcard_defs = f'''
{ganesh_defs}
{fetto_defs}
{fouz_defs}
{fruitly_defs}
'''

print("Assembling 100% valid, Figma-compatible SVG document...")

svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="2000" height="2050" viewBox="0 0 2000 2050" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&amp;family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&amp;family=Space+Mono:wght@400;700&amp;family=Courier+Prime:wght@700&amp;display=swap');

      .font-flapstick {{ font-family: 'Flapstick DEMO', 'Flapstick Demo', cursive, sans-serif; }}
      .font-sans {{ font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }}
      .font-mono {{ font-family: 'Space Mono', Menlo, monospace; }}
      .font-script {{ font-family: 'Caveat', cursive, sans-serif; }}
    </style>

    <!-- CSS Drop Shadows with standard objectBoundingBox coordinates -->
    <filter id="shadow-album-sleeve" x="-20%" y="-10%" width="140%" height="135%">
      <feDropShadow dx="0" dy="24" stdDeviation="16" flood-color="#0a1937" flood-opacity="0.45" />
      <feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#000000" flood-opacity="0.25" />
    </filter>

    <filter id="shadow-postcard-desk" x="-15%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000c20" flood-opacity="0.28" />
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.16" />
    </filter>

    <filter id="shadow-expanded-card" x="-20%" y="-15%" width="140%" height="135%">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#00081a" flood-opacity="0.55" />
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.3" />
    </filter>

    <filter id="shadow-polaroid" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#06101d" flood-opacity="0.2" />
    </filter>

    <!-- Master Clip Paths -->
    <clipPath id="viewport-clip"><rect width="393" height="852" /></clipPath>
    <clipPath id="sleeve-clip"><rect width="280" height="280" rx="16" /></clipPath>
    <clipPath id="pc-card-clip"><rect width="320" height="180" rx="6" /></clipPath>
    <clipPath id="expanded-card-clip"><rect width="369" height="208" rx="6" /></clipPath>
    <clipPath id="polaroid-img-clip"><rect width="94.75" height="64.27" rx="2" /></clipPath>
    <clipPath id="lightbox-img-clip"><rect width="349" height="436.09" rx="4" /></clipPath>
    <clipPath id="video-reel-clip"><rect width="146.13" height="259.77" rx="6" /></clipPath>

    <!-- Postcard internal clip paths -->
    {all_postcard_defs}
  </defs>

  <!-- Canvas Presentation Backdrop -->
  <rect width="2000" height="2050" fill="#0b1320" />

  <!-- Master Canvas Board Title &amp; Description -->
  <g id="Master Canvas Header" transform="translate(80, 42)">
    <text x="0" y="0" font-family="'Space Mono', monospace" font-size="14" font-weight="700" fill="#94a3b8" letter-spacing="2">BASIL JOSE &#8226; MOBILE PORTFOLIO FIGMA DESIGN SYSTEM</text>
    <text x="1840" y="0" text-anchor="end" font-family="'DM Sans', sans-serif" font-size="13" fill="#64748b">Exact 1:1 Live Production Match &#8226; iPhone 15 Viewport (393 &#215; 852 px)</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ROW 1: PRIMARY USER JOURNEY (Hero Start -&gt; Hero Play -&gt; Carousel -&gt; Postcards Desk)        -->
  <!-- ========================================================================================= -->

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 1: VISUAL REEL HERO (START STATE)                                                -->
  <!-- ========================================================================================= -->
  <g id="Artboard 1 - Visual Reel Hero (Start)" transform="translate(80, 80)">
    <!-- 393 x 852 Viewport Container -->
    <rect width="393" height="852" fill="#fff7ed" />

    <g clip-path="url(#viewport-clip)">
      <!-- Hero Illustration Canvas: web00.webp rendered matching drawImage calculation -->
      <g id="Hero Canvas Start">
        <image href="{hero_00_b64}" xlink:href="{hero_00_b64}" x="-560.83" y="0" width="1514.67" height="852" preserveAspectRatio="xMidYMid slice" />
      </g>

      <!-- Flapstick DEMO Typography: Exact 1:1 live coordinates, color rgb(23,66,118) -->
      <g id="Hero Flapstick Typography">
        <!-- Basil: x=16.89, y=385, font-size=62.17px -->
        <text x="16.89" y="385" class="font-flapstick" font-size="62.17px" font-weight="400" fill="#174276">Basil</text>
        <!-- Jose: x=253.67, y=388, font-size=65.98px -->
        <text x="253.67" y="388" class="font-flapstick" font-size="65.98px" font-weight="400" fill="#174276">Jose</text>
      </g>

      <!-- Bottom Timeline Progress Bar: x=0, y=849, h=3, 0% filled -->
      <g id="Timeline Progress Scrubber" transform="translate(0, 849)">
        <rect width="393" height="3" fill="rgba(40, 89, 145, 0.2)" />
        <rect width="0" height="3" fill="#285991" />
      </g>
    </g>

    <rect width="393" height="852" stroke="#d5c8b8" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">01 &#8226; HERO SCRUB (START)</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">393 &#215; 852 px &#8226; Flapstick DEMO Typography</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 2: VISUAL REEL HERO (REEL TRIGGER / PLAY END STATE)                              -->
  <!-- ========================================================================================= -->
  <g id="Artboard 2 - Visual Reel Hero (Play Trigger)" transform="translate(560, 80)">
    <rect width="393" height="852" fill="#285991" />

    <g clip-path="url(#viewport-clip)">
      <!-- Hero Canvas End Frame: web48.webp containing character holding play reel disc -->
      <g id="Hero Canvas End">
        <image href="{hero_48_b64}" xlink:href="{hero_48_b64}" x="-560.83" y="0" width="1514.67" height="852" preserveAspectRatio="xMidYMid slice" />
      </g>

      <!-- Reel Play Hitbox Component: Exact circle diameter 226px at x=83.49, y=312.99 -->
      <g id="Reel Play Hitbox Component">
        <circle cx="196.5" cy="426" r="113" fill="none" stroke="rgba(255, 247, 237, 0.3)" stroke-width="1.5" stroke-dasharray="4 4" />
      </g>

      <!-- Bottom Timeline Scrub Bar (100% Completed at y=849, h=3) -->
      <g id="Timeline Scrubber Completed" transform="translate(0, 849)">
        <rect width="393" height="3" fill="#285991" />
      </g>
    </g>

    <rect width="393" height="852" stroke="#1d426d" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">02 &#8226; REEL TRIGGER (PLAY STATE)</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">Frame 48 Canvas &#8226; Interactive Play Hitbox (226px)</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 3: ALBUM CAROUSEL (#work)                                                        -->
  <!-- ========================================================================================= -->
  <g id="Artboard 3 - Album Carousel" transform="translate(1040, 80)">
    <rect width="393" height="852" fill="#fff7ed" />

    <g clip-path="url(#viewport-clip)">
      <!-- Top Back Navigation Header: Exact 1:1 live position x=16, y=16 -->
      <g id="Top Header Bar" transform="translate(16, 16)">
        <g id="Back Button (REEL)">
          <text x="0" y="24" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#285991" letter-spacing="1">&#8592; REEL ESC</text>
        </g>
      </g>

      <!-- Circular Carousel Curved Gallery Stage -->
      <g id="Circular Gallery Carousel Stage">
        <!-- Left Peek Card (Videography rotated -17.0 deg) -->
        <g id="Left Neighbor Sleeve" transform="translate(-145.7, 476.5) rotate(-17) translate(-140, -140)" opacity="0.6">
          <g clip-path="url(#sleeve-clip)">
            <image href="{video_icon_b64}" xlink:href="{video_icon_b64}" x="0" y="0" width="280" height="280" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>

        <!-- Right Peek Card (Generative AI rotated +17.0 deg) -->
        <g id="Right Neighbor Sleeve" transform="translate(538.7, 476.5) rotate(17) translate(-140, -140)" opacity="0.6">
          <g clip-path="url(#sleeve-clip)">
            <image href="{genai_icon_b64}" xlink:href="{genai_icon_b64}" x="0" y="0" width="280" height="280" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>

        <!-- Active Center Vinyl Album Sleeve: Exact 280 x 280 at x=56.5, y=274 -->
        <g id="Active Vinyl Album Sleeve" transform="translate(56.5, 274)">
          <g filter="url(#shadow-album-sleeve)">
            <rect width="280" height="280" rx="16" fill="#fff7ed" />
          </g>
          <!-- Full-Bleed Cover Icon Image -->
          <g clip-path="url(#sleeve-clip)">
            <image href="{ad_icon_b64}" xlink:href="{ad_icon_b64}" x="0" y="0" width="280" height="280" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>
      </g>

      <!-- Album Title Directly Below Card: Exact Space Mono 14px bold in #285991 -->
      <g id="Album Metadata Typography" transform="translate(196.5, 594)">
        <text x="0" y="0" text-anchor="middle" font-family="'Space Mono', monospace" font-size="14" font-weight="700" fill="#285991" letter-spacing="2">ADVERTISEMENT</text>
      </g>
    </g>

    <rect width="393" height="852" stroke="#d5c8b8" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">03 &#8226; ALBUM CAROUSEL (#WORK)</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">280px Vinyl Sleeves &#8226; Multi-layer Shadows</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 4: POSTCARD SHOWCASE DESK (#work/graphic-designs)                                 -->
  <!-- ========================================================================================= -->
  <g id="Artboard 4 - Postcard Showcase Desk" transform="translate(1520, 80)">
    <!-- Deep Ocean Blue Desk Background: rgb(51, 97, 150) #336196 -->
    <rect width="393" height="852" fill="#336196" />

    <g clip-path="url(#viewport-clip)">
      <!-- Top Header Navigation -->
      <g id="Showcase Header" transform="translate(16, 16)">
        <g id="Back Button (ALBUMS)">
          <text x="0" y="24" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#fff7ed" letter-spacing="1">&#8592; ALBUMS ESC</text>
        </g>
        <text x="361" y="24" text-anchor="end" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="rgba(255, 247, 237, 0.6)" letter-spacing="1">GRAPHIC DESIGNS</text>
      </g>

      <!-- 4 Draggable Airmail Postcards (320 x 180, centered at x=196.5 with exact organic rotations) -->
      <g id="Postcards Desk Stack">
        
        <!-- Postcard 1: Eazyarts Ganesh (top=187.44, rot=-1.6 deg) -->
        <g id="Postcard 01 - Eazyarts Ganesh" transform="translate(196.5, 187.44) rotate(-1.6) translate(-160, -90)">
          <g filter="url(#shadow-postcard-desk)">
            <rect width="320" height="180" rx="6" fill="#fff7ed" />
          </g>
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {ganesh_body}
            </g>
          </g>
        </g>

        <!-- Postcard 2: Fetto Garments (top=346.76, rot=+2.4 deg) -->
        <g id="Postcard 02 - Fetto Garments" transform="translate(196.5, 346.76) rotate(2.4) translate(-160, -90)">
          <g filter="url(#shadow-postcard-desk)">
            <rect width="320" height="180" rx="6" fill="#fff7ed" />
          </g>
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {fetto_body}
            </g>
          </g>
        </g>

        <!-- Postcard 3: Fouz Travels (top=505.24, rot=-3.2 deg) -->
        <g id="Postcard 03 - Fouz Travels" transform="translate(196.5, 505.24) rotate(-3.2) translate(-160, -90)">
          <g filter="url(#shadow-postcard-desk)">
            <rect width="320" height="180" rx="6" fill="#fff7ed" />
          </g>
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {fouz_body}
            </g>
          </g>
        </g>

        <!-- Postcard 4: Fruitly (top=664.56, rot=+1.6 deg) -->
        <g id="Postcard 04 - Fruitly" transform="translate(196.5, 664.56) rotate(1.6) translate(-160, -90)">
          <g filter="url(#shadow-postcard-desk)">
            <rect width="320" height="180" rx="6" fill="#fff7ed" />
          </g>
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {fruitly_body}
            </g>
          </g>
        </g>
      </g>
    </g>

    <rect width="393" height="852" stroke="#254d79" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">04 &#8226; POSTCARD SHOWCASE DESK</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">Physical Paper Stack &#8226; Organic Rotations (-1.6&#176; to +2.4&#176;)</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ROW 2: DETAILED INTERACTION STATES (FLIPPED BENTO -&gt; LIGHTBOX -&gt; VIDEO -&gt; TOKENS)        -->
  <!-- ========================================================================================= -->

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 5: FLIPPED POSTCARD BENTO GRID (EAZYARTS GANESH)                                 -->
  <!-- ========================================================================================= -->
  <g id="Artboard 5 - Flipped Postcard Bento Grid" transform="translate(80, 1050)">
    <!-- Base Background Desk -->
    <rect width="393" height="852" fill="#336196" />

    <g clip-path="url(#viewport-clip)">
      <!-- Ghost background cards -->
      <g opacity="0.3" transform="translate(196.5, 187.44) rotate(-1.6) translate(-160, -90)">
        <rect width="320" height="180" rx="6" fill="#fff7ed" />
      </g>
      <g opacity="0.3" transform="translate(196.5, 664.56) rotate(1.6) translate(-160, -90)">
        <rect width="320" height="180" rx="6" fill="#fff7ed" />
      </g>

      <!-- Dimmed backdrop (rgb(20, 40, 65) effective) -->
      <rect width="393" height="852" fill="rgba(4, 9, 20, 0.65)" />

      <!-- Flipped Postcard Container: Exact 369 x 208 at x=11.5, y=322.44 -->
      <g id="Flipped Postcard Container" transform="translate(11.5, 322.44)">
        <g filter="url(#shadow-expanded-card)">
          <rect width="369" height="208" rx="6" fill="#fff7ed" stroke="#e6d9cb" stroke-width="1.5" />
        </g>

        <!-- Close Button: Exact x=327, y=10 inside card (x=338.5, y=332.44 screen) -->
        <g id="Close Button 5" transform="translate(327, 10)">
          <circle cx="16" cy="16" r="16" fill="#fff7ed" stroke="rgba(40, 89, 145, 0.2)" stroke-width="1" />
          <path d="M11 11 L21 21 M21 11 L11 21" stroke="#285991" stroke-width="2" stroke-linecap="round" />
        </g>

        <!-- Heatmap-Calibrated 2-Row Bento Polaroids: 5 slides of Eazyarts Ganesh -->
        <!-- Row 1 (y=17.47 relative to card, 3 polaroids: w=102.75, h=78.27) -->
        <g id="Polaroid 01" transform="translate(15.67, 17.47)">
          <g filter="url(#shadow-polaroid)">
            <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          </g>
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide1_b64}" xlink:href="{ganesh_slide1_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>

        <g id="Polaroid 02" transform="translate(133.13, 17.47)">
          <g filter="url(#shadow-polaroid)">
            <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          </g>
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide2_b64}" xlink:href="{ganesh_slide2_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>

        <g id="Polaroid 03" transform="translate(250.56, 17.47)">
          <g filter="url(#shadow-polaroid)">
            <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          </g>
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide3_b64}" xlink:href="{ganesh_slide3_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>

        <!-- Row 2 (y=112.24 relative to card, 2 polaroids: w=102.75, h=78.27) -->
        <g id="Polaroid 04" transform="translate(54.95, 112.24)">
          <g filter="url(#shadow-polaroid)">
            <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          </g>
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide4_b64}" xlink:href="{ganesh_slide4_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>

        <g id="Polaroid 05" transform="translate(211.28, 112.24)">
          <g filter="url(#shadow-polaroid)">
            <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          </g>
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide5_b64}" xlink:href="{ganesh_slide5_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>
      </g>
    </g>

    <rect width="393" height="852" stroke="#254d79" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">05 &#8226; FLIPPED POSTCARD BENTO GRID</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">16:9 Flipped Card &#8226; Heatmap 2-Row Polaroids (0&#176; Rotation)</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 6: CINEMATIC LIGHTBOX MODAL (INSPECT SLIDE)                                      -->
  <!-- ========================================================================================= -->
  <g id="Artboard 6 - Lightbox Inspect Modal" transform="translate(560, 1050)">
    <!-- Exact Live Backdrop: rgba(4, 9, 20, 0.78) -->
    <rect width="393" height="852" fill="#040914" />

    <g clip-path="url(#viewport-clip)">
      <!-- Fullscreen Image Inspect Card: Exact 369 x 485.09 at x=12, y=183.45 -->
      <g id="Inspect Modal Card" transform="translate(12, 183.45)">
        <g filter="url(#shadow-expanded-card)">
          <rect width="369" height="485.09" rx="8" fill="#ffffff" />
        </g>

        <!-- Slide Preview Image: Exact 349 x 436.09 at relative x=10, y=10 (padding: 10px 10px 18px) -->
        <g clip-path="url(#lightbox-img-clip)" transform="translate(10, 10)">
          <image href="{ganesh_slide1_b64}" xlink:href="{ganesh_slide1_b64}" x="0" y="0" width="349" height="436.09" preserveAspectRatio="xMidYMid slice" />
        </g>

        <!-- Close Button: Circle inside card at top right -->
        <g id="Modal Close Button 6" transform="translate(325, 18)">
          <circle cx="16" cy="16" r="16" fill="rgba(14, 25, 40, 0.65)" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
          <path d="M11 11 L21 21 M21 11 L11 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>
    </g>

    <rect width="393" height="852" stroke="#132438" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">06 &#8226; LIGHTBOX INSPECT MODAL</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">Clean Inspect Mode (369 &#215; 485 px) &#8226; High-Res Poster View</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 7: VIDEOGRAPHY IN-CARD VIDEO PLAYER (DOT STORE)                                  -->
  <!-- ========================================================================================= -->
  <g id="Artboard 7 - Videography In-Card Player" transform="translate(1040, 1050)">
    <rect width="393" height="852" fill="#336196" />

    <g clip-path="url(#viewport-clip)">
      <!-- Ghost background cards behind -->
      <g opacity="0.3" transform="translate(196.5, 187.44) rotate(-1.6) translate(-160, -90)">
        <rect width="320" height="180" rx="6" fill="#fff7ed" />
      </g>

      <!-- Dimmed backdrop overlay -->
      <rect width="393" height="852" fill="rgba(4, 9, 20, 0.65)" />

      <!-- Top Header Navigation -->
      <g id="Video Showcase Header" transform="translate(16, 16)">
        <g id="Back Button (ALBUMS 7)">
          <text x="0" y="24" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#fff7ed" letter-spacing="1">&#8592; ALBUMS ESC</text>
        </g>
        <text x="361" y="24" text-anchor="end" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="rgba(255, 247, 237, 0.6)" letter-spacing="1">VIDEOGRAPHY</text>
      </g>

      <!-- Flipped Postcard Container: Exact 369 x 208 at x=11.5, y=322.44 -->
      <g id="Flipped Video Postcard" transform="translate(11.5, 322.44)">
        <g filter="url(#shadow-expanded-card)">
          <rect width="369" height="208" rx="6" fill="#fff7ed" stroke="#e6d9cb" stroke-width="1.5" />
        </g>

        <!-- Close Button -->
        <g id="Close Button 7" transform="translate(327, 10)">
          <circle cx="16" cy="16" r="16" fill="#fff7ed" stroke="rgba(40, 89, 145, 0.2)" stroke-width="1" />
          <path d="M11 11 L21 21 M21 11 L11 21" stroke="#285991" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>

      <!-- Dual Vertical In-Card Video Reels: Exact live metrics x=35.95 and x=209.91, y=293.06 -->
      <!-- Video Reel 1 (Realme) -->
      <g id="In-Card Video Reel 01" transform="translate(35.95, 293.06)">
        <g filter="url(#shadow-polaroid)">
          <rect width="146.13" height="259.77" rx="6" fill="#000000" />
        </g>
        <g clip-path="url(#video-reel-clip)">
          <image href="{realme_thumb_b64}" xlink:href="{realme_thumb_b64}" x="0" y="0" width="146.13" height="259.77" preserveAspectRatio="xMidYMid slice" />
        </g>

        <!-- Video Player Controls Floating HUD: Exact x=35.95, y=504.83 (rel y=211.77) -->
        <g id="Video Controls HUD 1" transform="translate(0, 211.77)">
          <rect width="146.13" height="48" rx="6" fill="rgba(14, 25, 40, 0.75)" />
          <!-- Pause icon: two rects -->
          <g transform="translate(24, 18)" fill="#ffffff">
            <rect x="0" y="0" width="2.4" height="12" rx="0.5" />
            <rect x="5.5" y="0" width="2.4" height="12" rx="0.5" />
          </g>
          <!-- Timeline scrubber bar -->
          <g transform="translate(48, 22)">
            <rect width="50" height="4" rx="2" fill="rgba(255, 255, 255, 0.3)" />
            <rect width="20" height="4" rx="2" fill="#fff7ed" />
            <circle cx="20" cy="2" r="3" fill="#ffffff" />
          </g>
          <!-- Mute Speaker Icon -->
          <g transform="translate(112, 17)" fill="#ffffff">
            <polygon points="0,5 3,5 7,2 7,12 3,9 0,9" />
            <path d="M9 4.5 C10.5 6 10.5 8 9 9.5" stroke="#ffffff" stroke-width="1.2" fill="none" stroke-linecap="round" />
          </g>
        </g>
      </g>

      <!-- Video Reel 2 (Speaker) -->
      <g id="In-Card Video Reel 02" transform="translate(209.91, 293.06)">
        <g filter="url(#shadow-polaroid)">
          <rect width="146.13" height="259.77" rx="6" fill="#000000" />
        </g>
        <g clip-path="url(#video-reel-clip)">
          <image href="{speaker_thumb_b64}" xlink:href="{speaker_thumb_b64}" x="0" y="0" width="146.13" height="259.77" preserveAspectRatio="xMidYMid slice" />
        </g>

        <g id="Video Controls HUD 2" transform="translate(0, 211.77)">
          <rect width="146.13" height="48" rx="6" fill="rgba(14, 25, 40, 0.75)" />
          <g transform="translate(24, 18)" fill="#ffffff">
            <rect x="0" y="0" width="2.4" height="12" rx="0.5" />
            <rect x="5.5" y="0" width="2.4" height="12" rx="0.5" />
          </g>
          <g transform="translate(48, 22)">
            <rect width="50" height="4" rx="2" fill="rgba(255, 255, 255, 0.3)" />
            <rect width="32" height="4" rx="2" fill="#fff7ed" />
            <circle cx="32" cy="2" r="3" fill="#ffffff" />
          </g>
          <g transform="translate(112, 17)" fill="#ffffff">
            <polygon points="0,5 3,5 7,2 7,12 3,9 0,9" />
            <path d="M9 4.5 C10.5 6 10.5 8 9 9.5" stroke="#ffffff" stroke-width="1.2" fill="none" stroke-linecap="round" />
          </g>
        </g>
      </g>
    </g>

    <rect width="393" height="852" stroke="#254d79" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">07 &#8226; VIDEOGRAPHY IN-CARD PLAYER</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">Dual In-Card Video Reels (Realme &amp; Speaker) &#8226; Controls HUD</text>
  </g>

  <!-- ========================================================================================= -->
  <!-- ARTBOARD 8: DESIGN TOKENS, TYPOGRAPHY &amp; MASTER COMPONENTS                                 -->
  <!-- ========================================================================================= -->
  <g id="Artboard 8 - Design Tokens and Components" transform="translate(1520, 1050)">
    <rect width="393" height="852" fill="#0f172a" />

    <g clip-path="url(#viewport-clip)">
      <!-- Section Title -->
      <g transform="translate(24, 48)">
        <text x="0" y="0" font-family="'Space Mono', monospace" font-size="12" font-weight="700" fill="#38bdf8" letter-spacing="1.5">FIGMA DESIGN TOKENS</text>
        <text x="0" y="20" font-family="'DM Sans', sans-serif" font-size="11" fill="#94a3b8">Master Styles, Color Roles &amp; Components</text>
      </g>

      <!-- Color Palette Swatches -->
      <g id="Color Palette Tokens" transform="translate(24, 96)">
        <text x="0" y="0" font-family="'Space Mono', monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">COLOR TOKENS</text>
        
        <!-- Swatch 1: Desk Ocean Blue -->
        <g transform="translate(0, 14)">
          <rect width="42" height="28" rx="4" fill="#336196" stroke="#3b82f6" stroke-width="0.8" />
          <text x="52" y="14" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#f8fafc">#336196</text>
          <text x="52" y="26" font-family="'DM Sans', sans-serif" font-size="9" fill="#94a3b8">Desk Ocean Blue (--blue)</text>
        </g>

        <!-- Swatch 2: Cream Paper -->
        <g transform="translate(0, 52)">
          <rect width="42" height="28" rx="4" fill="#fff7ed" stroke="#d5c8b8" stroke-width="0.8" />
          <text x="52" y="14" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#f8fafc">#fff7ed / #fff4ea</text>
          <text x="52" y="26" font-family="'DM Sans', sans-serif" font-size="9" fill="#94a3b8">Cream Paper Surface (--cream)</text>
        </g>

        <!-- Swatch 3: Dark Text Blue -->
        <g transform="translate(0, 90)">
          <rect width="42" height="28" rx="4" fill="#174276" stroke="#2563eb" stroke-width="0.8" />
          <text x="52" y="14" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#f8fafc">#174276</text>
          <text x="52" y="26" font-family="'DM Sans', sans-serif" font-size="9" fill="#94a3b8">Flapstick Hero Text Color</text>
        </g>

        <!-- Swatch 4: Airmail Red &amp; Blue -->
        <g transform="translate(0, 128)">
          <rect width="20" height="28" rx="4" fill="#dc2626" />
          <rect x="22" width="20" height="28" rx="4" fill="#315c8f" />
          <text x="52" y="14" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#f8fafc">#dc2626 / #315c8f</text>
          <text x="52" y="26" font-family="'DM Sans', sans-serif" font-size="9" fill="#94a3b8">Airmail Border Perimeter Stripes</text>
        </g>
      </g>

      <!-- Typography Tokens -->
      <g id="Typography Tokens Hierarchy" transform="translate(24, 290)">
        <text x="0" y="0" font-family="'Space Mono', monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">TYPOGRAPHY HIERARCHY</text>

        <g transform="translate(0, 16)">
          <text x="0" y="28" class="font-flapstick" font-size="34" fill="#38bdf8">Flapstick DEMO</text>
          <text x="0" y="44" font-family="'Space Mono', monospace" font-size="8.5" fill="#64748b">Hero Names (Basil Jose) &#8226; 62px - 66px</text>
        </g>

        <g transform="translate(0, 72)">
          <text x="0" y="24" font-family="'Space Mono', monospace" font-size="16" font-weight="700" fill="#f8fafc">Space Mono Bold</text>
          <text x="0" y="40" font-family="'Space Mono', monospace" font-size="8.5" fill="#64748b">Navigation Labels (&#8592; REEL ESC, ALBUMS) &#8226; 10px / 14px</text>
        </g>

        <g transform="translate(0, 126)">
          <text x="0" y="26" class="font-script" font-size="30" font-weight="700" fill="#f8fafc">Caveat Cursive Hand</text>
          <text x="0" y="42" font-family="'Space Mono', monospace" font-size="8.5" fill="#64748b">Postcard Titles &#8226; 74px - 80px Scaled</text>
        </g>
      </g>

      <!-- Master Components Library -->
      <g id="Master Components Library" transform="translate(24, 490)">
        <text x="0" y="0" font-family="'Space Mono', monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">REUSABLE MASTER COMPONENTS</text>

        <!-- Mini Postcard Frame -->
        <g transform="translate(0, 16)">
          <rect width="140" height="78" rx="4" fill="#fff4ea" stroke="#315c8f" stroke-width="1.5" />
          <rect x="94" y="8" width="38" height="50" rx="2" fill="#315c8f" />
          <text x="14" y="44" class="font-script" font-size="16" font-weight="700" fill="#1e3a5f">Postcard</text>
          <text x="154" y="32" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="#f8fafc">.draggable-postcard-item</text>
          <text x="154" y="48" font-family="'Space Mono', monospace" font-size="8.5" fill="#64748b">16:9 Aspect Ratio &#8226; 320 &#215; 180 px</text>
        </g>

        <!-- Mini Album Sleeve -->
        <g transform="translate(0, 110)">
          <rect width="64" height="64" rx="8" fill="#fff7ed" stroke="#285991" stroke-width="2" />
          <image href="{ad_icon_b64}" xlink:href="{ad_icon_b64}" x="0" y="0" width="64" height="64" preserveAspectRatio="xMidYMid slice" />
          <text x="80" y="26" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="#f8fafc">.react-album-card-item</text>
          <text x="80" y="42" font-family="'Space Mono', monospace" font-size="8.5" fill="#64748b">280 &#215; 280 px &#8226; Object-fit Cover</text>
        </g>

        <!-- Mini Polaroid Frame -->
        <g transform="translate(0, 190)">
          <rect width="52" height="42" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8" />
          <rect x="4" y="4" width="44" height="28" rx="1" fill="#285991" />
          <text x="68" y="20" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="#f8fafc">.scattered-polaroid-frame</text>
          <text x="68" y="36" font-family="'Space Mono', monospace" font-size="8.5" fill="#64748b">102.75 &#215; 78.27 px &#8226; 0&#176; Rotation</text>
        </g>

        <!-- Mini Pill Button -->
        <g transform="translate(0, 252)">
          <text x="0" y="16" font-family="'Space Mono', monospace" font-size="10" font-weight="700" fill="#38bdf8">&#8592; REEL ESC</text>
          <text x="110" y="14" font-family="'DM Sans', sans-serif" font-size="11" font-weight="700" fill="#f8fafc">.clean-back-btn</text>
        </g>
      </g>
    </g>

    <rect width="393" height="852" stroke="#1e293b" stroke-width="1" fill="none" pointer-events="none" />

    <text x="196.5" y="888" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">08 &#8226; DESIGN SYSTEM &amp; TOKENS</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11" fill="#64748b">Color Palette &#8226; Typography Specs &#8226; Master Components</text>
  </g>
</svg>
'''

output_path = os.path.join(BASE_DIR, "WEBSITE_PORTFOLIO_FIGMA_MOBILE_DESIGN.svg")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"Generated {output_path} ({os.path.getsize(output_path)} bytes). Validating XML...")

try:
    tree = ET.parse(output_path)
    root = tree.getroot()
    print(f"VERIFICATION SUCCESS: SVG is 100% well-formed XML! Root tag: {root.tag}, Elements count: {len(list(root.iter()))}")
except Exception as e:
    print(f"XML PARSING ERROR: {e}")
