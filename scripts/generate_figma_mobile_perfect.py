import os
import base64
import io
import re
from PIL import Image

BASE_DIR = r"C:\Users\basil\Documents\WEBSITE PORTFOLIO"
SCRATCH_DIR = r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch"
SCREENS_DIR = os.path.join(BASE_DIR, "figma_mobile_screens")
os.makedirs(SCREENS_DIR, exist_ok=True)

def get_base64_image(path, max_size=(500, 500), is_jpeg=True, quality=82):
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
            im.save(buf, format='JPEG', quality=quality, optimize=True)
            b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            return f"data:image/jpeg;base64,{b64}"
        else:
            if im.mode != 'RGBA':
                im = im.convert('RGBA')
            im.save(buf, format='PNG', optimize=True)
            b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            return f"data:image/png;base64,{b64}"
    except Exception as e:
        print(f"Error processing {path}: {e}")
        return ""

print("Encoding image assets with high-fidelity, compact settings...")
hero_00_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "frames", "web00.webp"), max_size=(600, 1300), is_jpeg=True, quality=80)
hero_48_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "frames", "web48.webp"), max_size=(600, 1300), is_jpeg=True, quality=80)

ad_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons", "ADVERTISEMENT.png"), max_size=(400, 400), is_jpeg=False)
video_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons", "VIDEOGRAPHY.png"), max_size=(400, 400), is_jpeg=False)
genai_icon_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "icons", "GENERATIVE AI.png"), max_size=(400, 400), is_jpeg=False)

# Graphic design projects
ganesh_slide1_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 1.png"), max_size=(360, 440), is_jpeg=True, quality=80)
ganesh_slide2_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 2.png"), max_size=(200, 260), is_jpeg=True, quality=78)
ganesh_slide3_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 3.png"), max_size=(200, 260), is_jpeg=True, quality=78)
ganesh_slide4_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 4.png"), max_size=(200, 260), is_jpeg=True, quality=78)
ganesh_slide5_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "eazyarts-ganesh", "slide 5.png"), max_size=(200, 260), is_jpeg=True, quality=78)

fetto_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fetto-garments", "Artboard 1 copy 2.png"), max_size=(240, 300), is_jpeg=True, quality=80)
fouz_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fouz-travels", "FOUZ POSTER 1.png"), max_size=(240, 300), is_jpeg=True, quality=80)
fruitly_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "graphic-designs", "fruitly", "1.png"), max_size=(240, 300), is_jpeg=True, quality=80)

# Videography reels
realme_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "videography", "dot-store", "realme-thumb.webp"), max_size=(300, 540), is_jpeg=True, quality=80)
speaker_thumb_b64 = get_base64_image(os.path.join(BASE_DIR, "public", "projects", "videography", "dot-store", "speaker-thumb.webp"), max_size=(300, 540), is_jpeg=True, quality=80)

# Load clean postcard templates
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
          <text x="500" y="370" text-anchor="middle" fill="#1d3b6d" font-family="Caveat, cursive" font-size="{font_size}" font-weight="700" letter-spacing="0.5">{line1}</text>
          <text x="500" y="{370 + int(font_size * 1.15)}" text-anchor="middle" fill="#1d3b6d" font-family="Caveat, cursive" font-size="{font_size}" font-weight="700" letter-spacing="0.5">{line2}</text>
        </g>
        '''
    else:
        title_block = f'''
        <g id="{uid}-title">
          <text x="500" y="415" text-anchor="middle" fill="#1d3b6d" font-family="Caveat, cursive" font-size="{font_size}" font-weight="700" letter-spacing="0.5">{line1}</text>
        </g>
        '''

    pc_defs = pc_defs_template.replace('__UID__', uid)
    pc_body = pc_body_template.replace('__UID__', uid)
    pc_body = pc_body.replace('__THUMBNAIL_B64__', thumb_b64)
    pc_body = pc_body.replace('__TITLE_BLOCK__', title_block)
    return pc_defs, pc_body

ganesh_defs, ganesh_body = create_postcard("Eazyarts Ganesh", ganesh_slide1_b64, "pc-ganesh")
fetto_defs, fetto_body = create_postcard("Fetto Garments", fetto_thumb_b64, "pc-fetto")
fouz_defs, fouz_body = create_postcard("Fouz Travels", fouz_thumb_b64, "pc-fouz")
fruitly_defs, fruitly_body = create_postcard("Fruitly", fruitly_thumb_b64, "pc-fruitly")

all_postcard_defs = f"{ganesh_defs}\n{fetto_defs}\n{fouz_defs}\n{fruitly_defs}"

# Shared master clip paths (No filters, No styles with @import, 100% valid XML)
master_clip_defs = f'''
    <clipPath id="viewport-clip"><rect width="393" height="852" /></clipPath>
    <clipPath id="sleeve-clip"><rect width="280" height="280" rx="16" /></clipPath>
    <clipPath id="pc-card-clip"><rect width="320" height="180" rx="6" /></clipPath>
    <clipPath id="expanded-card-clip"><rect width="369" height="208" rx="6" /></clipPath>
    <clipPath id="polaroid-img-clip"><rect width="94.75" height="64.27" rx="2" /></clipPath>
    <clipPath id="lightbox-img-clip"><rect width="349" height="436.09" rx="4" /></clipPath>
    <clipPath id="video-reel-clip"><rect width="146.13" height="259.77" rx="6" /></clipPath>
    {all_postcard_defs}
'''

# Common reusable components
def back_arrow_svg(color="#174276", bg="rgba(23,66,118,0.08)"):
    return f'''
    <g id="Back Arrow" transform="translate(18, 18)" cursor="pointer">
      <circle cx="18" cy="18" r="18" fill="{bg}" />
      <path d="M22 18 L14 18 M18 14 L14 18 L18 22" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </g>
    '''

def hamburger_menu_svg(color="#174276", bg="rgba(23,66,118,0.08)"):
    return f'''
    <g id="Hamburger Menu" transform="translate(339, 18)" cursor="pointer">
      <circle cx="18" cy="18" r="18" fill="{bg}" />
      <path d="M11 13 L25 13 M11 18 L25 18 M11 23 L25 23" stroke="{color}" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </g>
    '''

# -------------------------------------------------------------
# ARTBOARD 1: VISUAL REEL HERO (START STATE)
# -------------------------------------------------------------
artboard_1_body = f'''
    <rect width="393" height="852" fill="#fff7ed" />
    <g clip-path="url(#viewport-clip)">
      <g id="Hero Canvas Start">
        <image href="{hero_00_b64}" x="-560.83" y="0" width="1514.67" height="852" preserveAspectRatio="xMidYMid slice" />
      </g>
      {hamburger_menu_svg(color="#174276", bg="rgba(23,66,118,0.08)")}
      
      <!-- Minimal Subtle Scroll Instruction -->
      <g id="Scroll Instruction" transform="translate(196.5, 620)">
        <text x="0" y="0" text-anchor="middle" font-family="Space Mono, monospace" font-size="8.5" font-weight="700" fill="#174276" opacity="0.65" letter-spacing="1.5">SCROLL TO EXPLORE</text>
        <path d="M196.5 628 L196.5 638 M192.5 634 L196.5 638 L200.5 634" stroke="#174276" stroke-width="1.2" opacity="0.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>

      <!-- Mobile Landing Name Placement: Bottom, 2 Lines, Flapstick DEMO, NO OTHER TEXT -->
      <g id="Hero Name Bottom" transform="translate(24, 712)">
        <text x="0" y="0" font-family="Flapstick DEMO, cursive, sans-serif" font-size="52" font-weight="400" fill="#174276">BASIL</text>
        <text x="0" y="52" font-family="Flapstick DEMO, cursive, sans-serif" font-size="52" font-weight="400" fill="#174276">JOSE</text>
      </g>

      <!-- Bottom Timeline Progress Bar: x=0, y=849, h=3, 0% filled -->
      <g id="Timeline Progress Scrubber" transform="translate(0, 849)">
        <rect width="393" height="3" fill="#285991" opacity="0.2" />
        <rect width="0" height="3" fill="#285991" />
      </g>
    </g>
    <rect width="393" height="852" stroke="#d5c8b8" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">01 &#8226; HERO SCRUB (START)</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">393 &#215; 852 px &#8226; Bottom 2-Line Name &amp; Scroll Prompt</text>
'''

# -------------------------------------------------------------
# ARTBOARD 2: VISUAL REEL HERO (REEL TRIGGER / PLAY END STATE)
# -------------------------------------------------------------
artboard_2_body = f'''
    <rect width="393" height="852" fill="#285991" />
    <g clip-path="url(#viewport-clip)">
      <g id="Hero Canvas End">
        <image href="{hero_48_b64}" x="-560.83" y="0" width="1514.67" height="852" preserveAspectRatio="xMidYMid slice" />
      </g>
      {hamburger_menu_svg(color="#fff7ed", bg="rgba(255,247,237,0.12)")}
      
      <!-- Interactive Play Hitbox -->
      <g id="Reel Play Hitbox">
        <circle cx="196.5" cy="426" r="113" fill="none" stroke="#fff7ed" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.3" />
      </g>
      
      <!-- Timeline Scrub Bar Completed -->
      <g id="Timeline Scrubber Completed" transform="translate(0, 849)">
        <rect width="393" height="3" fill="#285991" />
      </g>
    </g>
    <rect width="393" height="852" stroke="#1d426d" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">02 &#8226; REEL TRIGGER (PLAY STATE)</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">Frame 48 Canvas &#8226; Interactive Play Hitbox (226px)</text>
'''

# -------------------------------------------------------------
# ARTBOARD 3: ALBUM CAROUSEL (#work)
# -------------------------------------------------------------
artboard_3_body = f'''
    <rect width="393" height="852" fill="#fff7ed" />
    <g clip-path="url(#viewport-clip)">
      <!-- Back Navigation: Arrow ONLY (No text) -->
      {back_arrow_svg(color="#285991", bg="rgba(40,89,145,0.08)")}
      {hamburger_menu_svg(color="#285991", bg="rgba(40,89,145,0.08)")}

      <!-- Curved Circular Gallery Stage -->
      <g id="Circular Gallery Carousel Stage">
        <!-- Left Neighbor Sleeve -->
        <g id="Left Neighbor Sleeve" transform="translate(-145.7, 476.5) rotate(-17) translate(-140, -140)" opacity="0.6">
          <g clip-path="url(#sleeve-clip)">
            <image href="{video_icon_b64}" x="0" y="0" width="280" height="280" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>
        <!-- Right Neighbor Sleeve -->
        <g id="Right Neighbor Sleeve" transform="translate(538.7, 476.5) rotate(17) translate(-140, -140)" opacity="0.6">
          <g clip-path="url(#sleeve-clip)">
            <image href="{genai_icon_b64}" x="0" y="0" width="280" height="280" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>
        <!-- Active Center Vinyl Album Sleeve -->
        <g id="Active Vinyl Album Sleeve" transform="translate(56.5, 274)">
          <!-- Soft Drop Shadow Underlay (Standard vector rect, 0 filter crashes) -->
          <rect x="-4" y="8" width="288" height="288" rx="20" fill="#0a1937" opacity="0.18" />
          <rect width="280" height="280" rx="16" fill="#fff7ed" stroke="#e2d8cd" stroke-width="1" />
          <g clip-path="url(#sleeve-clip)">
            <image href="{ad_icon_b64}" x="0" y="0" width="280" height="280" preserveAspectRatio="xMidYMid slice" />
          </g>
        </g>
      </g>

      <!-- Album Title Directly Below Card -->
      <g id="Album Metadata Typography" transform="translate(196.5, 594)">
        <text x="0" y="0" text-anchor="middle" font-family="Space Mono, monospace" font-size="14" font-weight="700" fill="#285991" letter-spacing="2">ADVERTISEMENT</text>
      </g>
    </g>
    <rect width="393" height="852" stroke="#d5c8b8" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">03 &#8226; ALBUM CAROUSEL (#WORK)</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">Back Arrow Only &#8226; Hamburger Menu &#8226; Snapped Active Card</text>
'''

# -------------------------------------------------------------
# ARTBOARD 4: POSTCARD SHOWCASE DESK (#work/graphic-designs)
# -------------------------------------------------------------
artboard_4_body = f'''
    <rect width="393" height="852" fill="#336196" />
    <g clip-path="url(#viewport-clip)">
      <!-- Top Header Navigation: Arrow ONLY + Title -->
      {back_arrow_svg(color="#fff7ed", bg="rgba(255,247,237,0.12)")}
      <text x="361" y="40" text-anchor="end" font-family="Space Mono, monospace" font-size="10" font-weight="700" fill="#fff7ed" opacity="0.6" letter-spacing="1">GRAPHIC DESIGNS</text>

      <!-- 4 Draggable Airmail Postcards -->
      <g id="Postcards Desk Stack">
        <!-- Postcard 1: Eazyarts Ganesh -->
        <g id="Postcard 01 - Eazyarts Ganesh" transform="translate(196.5, 187.44) rotate(-1.6) translate(-160, -90)">
          <rect x="-2" y="6" width="324" height="184" rx="8" fill="#000c20" opacity="0.25" />
          <rect width="320" height="180" rx="6" fill="#fff7ed" />
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {ganesh_body}
            </g>
          </g>
        </g>
        <!-- Postcard 2: Fetto Garments -->
        <g id="Postcard 02 - Fetto Garments" transform="translate(196.5, 346.76) rotate(2.4) translate(-160, -90)">
          <rect x="-2" y="6" width="324" height="184" rx="8" fill="#000c20" opacity="0.25" />
          <rect width="320" height="180" rx="6" fill="#fff7ed" />
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {fetto_body}
            </g>
          </g>
        </g>
        <!-- Postcard 3: Fouz Travels -->
        <g id="Postcard 03 - Fouz Travels" transform="translate(196.5, 505.24) rotate(-3.2) translate(-160, -90)">
          <rect x="-2" y="6" width="324" height="184" rx="8" fill="#000c20" opacity="0.25" />
          <rect width="320" height="180" rx="6" fill="#fff7ed" />
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {fouz_body}
            </g>
          </g>
        </g>
        <!-- Postcard 4: Fruitly -->
        <g id="Postcard 04 - Fruitly" transform="translate(196.5, 664.56) rotate(1.6) translate(-160, -90)">
          <rect x="-2" y="6" width="324" height="184" rx="8" fill="#000c20" opacity="0.25" />
          <rect width="320" height="180" rx="6" fill="#fff7ed" />
          <g clip-path="url(#pc-card-clip)">
            <g transform="scale(0.22222222)">
              {fruitly_body}
            </g>
          </g>
        </g>
      </g>
    </g>
    <rect width="393" height="852" stroke="#254d79" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">04 &#8226; POSTCARD SHOWCASE DESK</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">Back Arrow Only &#8226; Organic Rotations &#8226; Clean SVG Structure</text>
'''

# -------------------------------------------------------------
# ARTBOARD 5: FLIPPED POSTCARD BENTO GRID (PRESERVED ASPECT RATIO)
# -------------------------------------------------------------
artboard_5_body = f'''
    <rect width="393" height="852" fill="#336196" />
    <g clip-path="url(#viewport-clip)">
      <g opacity="0.3" transform="translate(196.5, 187.44) rotate(-1.6) translate(-160, -90)">
        <rect width="320" height="180" rx="6" fill="#fff7ed" />
      </g>
      <rect width="393" height="852" fill="#040914" opacity="0.65" />

      <!-- Flipped Postcard Container -->
      <g id="Flipped Postcard Container" transform="translate(11.5, 322.44)">
        <rect x="-4" y="10" width="377" height="216" rx="12" fill="#00081a" opacity="0.45" />
        <rect width="369" height="208" rx="6" fill="#fff7ed" stroke="#e6d9cb" stroke-width="1.5" />

        <!-- Close Button -->
        <g id="Close Button 5" transform="translate(327, 10)">
          <circle cx="16" cy="16" r="16" fill="#fff7ed" stroke="#285991" stroke-opacity="0.2" stroke-width="1" />
          <path d="M11 11 L21 21 M21 11 L11 21" stroke="#285991" stroke-width="2" stroke-linecap="round" />
        </g>

        <!-- Preserved Aspect Ratio Polaroids (Natural Proportions, No Crop/Distort) -->
        <g id="Polaroid 01" transform="translate(15.67, 17.47)">
          <rect x="-1" y="2" width="104.75" height="80.27" rx="5" fill="#06101d" opacity="0.16" />
          <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide1_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>

        <g id="Polaroid 02" transform="translate(133.13, 17.47)">
          <rect x="-1" y="2" width="104.75" height="80.27" rx="5" fill="#06101d" opacity="0.16" />
          <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide2_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>

        <g id="Polaroid 03" transform="translate(250.56, 17.47)">
          <rect x="-1" y="2" width="104.75" height="80.27" rx="5" fill="#06101d" opacity="0.16" />
          <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide3_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>

        <g id="Polaroid 04" transform="translate(54.95, 112.24)">
          <rect x="-1" y="2" width="104.75" height="80.27" rx="5" fill="#06101d" opacity="0.16" />
          <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide4_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>

        <g id="Polaroid 05" transform="translate(211.28, 112.24)">
          <rect x="-1" y="2" width="104.75" height="80.27" rx="5" fill="#06101d" opacity="0.16" />
          <rect width="102.75" height="78.27" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
          <g clip-path="url(#polaroid-img-clip)" transform="translate(4, 4)">
            <image href="{ganesh_slide5_b64}" x="0" y="0" width="94.75" height="64.27" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>
      </g>
    </g>
    <rect width="393" height="852" stroke="#254d79" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">05 &#8226; FLIPPED POSTCARD BENTO GRID</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">Preserved Natural Aspect Ratio &#8226; No Cropping or Distortion</text>
'''

# -------------------------------------------------------------
# ARTBOARD 6: CINEMATIC LIGHTBOX MODAL
# -------------------------------------------------------------
artboard_6_body = f'''
    <rect width="393" height="852" fill="#040914" />
    <g clip-path="url(#viewport-clip)">
      <g id="Inspect Modal Card" transform="translate(12, 183.45)">
        <rect x="-4" y="8" width="377" height="493.09" rx="12" fill="#00081a" opacity="0.45" />
        <rect width="369" height="485.09" rx="8" fill="#ffffff" />
        <g clip-path="url(#lightbox-img-clip)" transform="translate(10, 10)">
          <image href="{ganesh_slide1_b64}" x="0" y="0" width="349" height="436.09" preserveAspectRatio="xMidYMid meet" />
        </g>
        <g id="Modal Close Button 6" transform="translate(325, 18)">
          <circle cx="16" cy="16" r="16" fill="#0e1928" opacity="0.65" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1" />
          <path d="M11 11 L21 21 M21 11 L11 21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>
    </g>
    <rect width="393" height="852" stroke="#132438" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">06 &#8226; LIGHTBOX INSPECT MODAL</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">369 &#215; 485 px Card &#8226; High-Res Poster Detail</text>
'''

# -------------------------------------------------------------
# ARTBOARD 7: VIDEOGRAPHY IN-CARD VIDEO PLAYER (DOT STORE)
# -------------------------------------------------------------
artboard_7_body = f'''
    <rect width="393" height="852" fill="#336196" />
    <g clip-path="url(#viewport-clip)">
      <g opacity="0.3" transform="translate(196.5, 187.44) rotate(-1.6) translate(-160, -90)">
        <rect width="320" height="180" rx="6" fill="#fff7ed" />
      </g>
      <rect width="393" height="852" fill="#040914" opacity="0.65" />

      <!-- Top Header Navigation: Arrow ONLY -->
      {back_arrow_svg(color="#fff7ed", bg="rgba(255,247,237,0.12)")}
      <text x="361" y="40" text-anchor="end" font-family="Space Mono, monospace" font-size="10" font-weight="700" fill="#fff7ed" opacity="0.6" letter-spacing="1">VIDEOGRAPHY</text>

      <!-- Flipped Postcard Container -->
      <g id="Flipped Video Postcard" transform="translate(11.5, 322.44)">
        <rect x="-4" y="10" width="377" height="216" rx="12" fill="#00081a" opacity="0.45" />
        <rect width="369" height="208" rx="6" fill="#fff7ed" stroke="#e6d9cb" stroke-width="1.5" />
        <g id="Close Button 7" transform="translate(327, 10)">
          <circle cx="16" cy="16" r="16" fill="#fff7ed" stroke="#285991" stroke-opacity="0.2" stroke-width="1" />
          <path d="M11 11 L21 21 M21 11 L11 21" stroke="#285991" stroke-width="2" stroke-linecap="round" />
        </g>
      </g>

      <!-- Dual Vertical Video Reels (Preserved 9:16 Aspect Ratio) -->
      <g id="In-Card Video Reel 01" transform="translate(35.95, 293.06)">
        <rect x="-2" y="4" width="150.13" height="263.77" rx="8" fill="#06101d" opacity="0.2" />
        <rect width="146.13" height="259.77" rx="6" fill="#000000" />
        <g clip-path="url(#video-reel-clip)">
          <image href="{realme_thumb_b64}" x="0" y="0" width="146.13" height="259.77" preserveAspectRatio="xMidYMid meet" />
        </g>
        <g id="Video Controls HUD 1" transform="translate(0, 211.77)">
          <rect width="146.13" height="48" rx="6" fill="#0e1928" opacity="0.75" />
          <g transform="translate(24, 18)" fill="#ffffff">
            <rect x="0" y="0" width="2.4" height="12" rx="0.5" />
            <rect x="5.5" y="0" width="2.4" height="12" rx="0.5" />
          </g>
          <g transform="translate(48, 22)">
            <rect width="50" height="4" rx="2" fill="#ffffff" opacity="0.3" />
            <rect width="20" height="4" rx="2" fill="#fff7ed" />
            <circle cx="20" cy="2" r="3" fill="#ffffff" />
          </g>
          <g transform="translate(112, 17)" fill="#ffffff">
            <polygon points="0,5 3,5 7,2 7,12 3,9 0,9" />
            <path d="M9 4.5 C10.5 6 10.5 8 9 9.5" stroke="#ffffff" stroke-width="1.2" fill="none" stroke-linecap="round" />
          </g>
        </g>
      </g>

      <g id="In-Card Video Reel 02" transform="translate(209.91, 293.06)">
        <rect x="-2" y="4" width="150.13" height="263.77" rx="8" fill="#06101d" opacity="0.2" />
        <rect width="146.13" height="259.77" rx="6" fill="#000000" />
        <g clip-path="url(#video-reel-clip)">
          <image href="{speaker_thumb_b64}" x="0" y="0" width="146.13" height="259.77" preserveAspectRatio="xMidYMid meet" />
        </g>
        <g id="Video Controls HUD 2" transform="translate(0, 211.77)">
          <rect width="146.13" height="48" rx="6" fill="#0e1928" opacity="0.75" />
          <g transform="translate(24, 18)" fill="#ffffff">
            <rect x="0" y="0" width="2.4" height="12" rx="0.5" />
            <rect x="5.5" y="0" width="2.4" height="12" rx="0.5" />
          </g>
          <g transform="translate(48, 22)">
            <rect width="50" height="4" rx="2" fill="#ffffff" opacity="0.3" />
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
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">07 &#8226; VIDEOGRAPHY IN-CARD PLAYER</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">Back Arrow Only &#8226; Dual 9:16 In-Card Reels &#8226; Controls HUD</text>
'''

# -------------------------------------------------------------
# ARTBOARD 8: DEDICATED CONTACT PAGE
# -------------------------------------------------------------
artboard_8_body = f'''
    <rect width="393" height="852" fill="#fff7ed" />
    <g clip-path="url(#viewport-clip)">
      {back_arrow_svg(color="#174276", bg="rgba(23,66,118,0.08)")}
      {hamburger_menu_svg(color="#174276", bg="rgba(23,66,118,0.08)")}

      <!-- Contact Title & Header -->
      <g transform="translate(24, 96)">
        <text x="0" y="0" font-family="Space Mono, monospace" font-size="12" font-weight="700" fill="#336196" letter-spacing="2">GET IN TOUCH</text>
        <text x="0" y="32" font-family="Flapstick DEMO, cursive, sans-serif" font-size="44" font-weight="400" fill="#174276">Let's Connect</text>
        <text x="0" y="58" font-family="DM Sans, sans-serif" font-size="13" fill="#64748b">Open for freelance projects, collaborations &amp; design inquiries.</text>
      </g>

      <!-- Contact Info Card (Email & Direct Action) -->
      <g transform="translate(24, 185)">
        <rect width="345" height="74" rx="12" fill="#ffffff" stroke="#e2d8cd" stroke-width="1" />
        <circle cx="36" cy="37" r="18" fill="#336196" opacity="0.1" />
        <path d="M26 31 L46 31 C47 31 48 32 48 33 L48 43 C48 44 47 45 46 45 L26 45 C25 45 24 44 24 43 L24 33 C24 32 25 31 26 31 Z M26 33 L36 39 L46 33" stroke="#336196" stroke-width="1.6" fill="none" stroke-linejoin="round" />
        <text x="68" y="30" font-family="Space Mono, monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">EMAIL DIRECT</text>
        <text x="68" y="48" font-family="DM Sans, sans-serif" font-size="13" font-weight="700" fill="#174276">basiljose8989@gmail.com</text>
      </g>

      <!-- Message Form Container Card -->
      <g transform="translate(24, 275)">
        <rect width="345" height="520" rx="14" fill="#ffffff" stroke="#e2d8cd" stroke-width="1" />
        
        <!-- Field 1: Name -->
        <g transform="translate(20, 24)">
          <text x="0" y="0" font-family="Space Mono, monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">YOUR NAME</text>
          <rect y="8" width="305" height="42" rx="6" fill="#fff7ed" stroke="#d5c8b8" stroke-width="1" />
          <text x="14" y="34" font-family="DM Sans, sans-serif" font-size="12" fill="#94a3b8">e.g. Sarah Jenkins</text>
        </g>

        <!-- Field 2: Email -->
        <g transform="translate(20, 96)">
          <text x="0" y="0" font-family="Space Mono, monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">EMAIL ADDRESS</text>
          <rect y="8" width="305" height="42" rx="6" fill="#fff7ed" stroke="#d5c8b8" stroke-width="1" />
          <text x="14" y="34" font-family="DM Sans, sans-serif" font-size="12" fill="#94a3b8">e.g. sarah@company.com</text>
        </g>

        <!-- Field 3: Subject -->
        <g transform="translate(20, 168)">
          <text x="0" y="0" font-family="Space Mono, monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">PROJECT / INQUIRY TYPE</text>
          <rect y="8" width="305" height="42" rx="6" fill="#fff7ed" stroke="#d5c8b8" stroke-width="1" />
          <text x="14" y="34" font-family="DM Sans, sans-serif" font-size="12" fill="#94a3b8">Creative Direction / Design Inquiry</text>
        </g>

        <!-- Field 4: Message -->
        <g transform="translate(20, 240)">
          <text x="0" y="0" font-family="Space Mono, monospace" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1">MESSAGE</text>
          <rect y="8" width="305" height="140" rx="6" fill="#fff7ed" stroke="#d5c8b8" stroke-width="1" />
          <text x="14" y="34" font-family="DM Sans, sans-serif" font-size="12" fill="#94a3b8">Tell me about your project, timeline &amp; goals...</text>
        </g>

        <!-- Submit Button -->
        <g transform="translate(20, 440)">
          <rect width="305" height="46" rx="8" fill="#174276" />
          <text x="152.5" y="28" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#fff7ed" letter-spacing="2">SEND MESSAGE &#8594;</text>
        </g>
      </g>
    </g>
    <rect width="393" height="852" stroke="#d5c8b8" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">08 &#8226; DEDICATED CONTACT PAGE</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">Clean Mobile Form &#8226; Direct Contact Card &#8226; Back Navigation</text>
'''

# -------------------------------------------------------------
# ARTBOARD 9: HAMBURGER MENU DRAWER (OPEN STATE OVERLAY)
# -------------------------------------------------------------
artboard_9_body = f'''
    <rect width="393" height="852" fill="#040914" />
    <g clip-path="url(#viewport-clip)">
      <!-- Blurred dimmed background preview of hero -->
      <g opacity="0.15">
        <image href="{hero_00_b64}" x="-560.83" y="0" width="1514.67" height="852" preserveAspectRatio="xMidYMid slice" />
      </g>
      <rect width="393" height="852" fill="#0e1928" opacity="0.94" />

      <!-- Top Header: Close 'X' Button on Right -->
      <g id="Menu Close Button" transform="translate(339, 18)" cursor="pointer">
        <circle cx="18" cy="18" r="18" fill="rgba(255, 247, 237, 0.12)" />
        <path d="M12 12 L24 24 M24 12 L12 24" stroke="#fff7ed" stroke-width="2" stroke-linecap="round" />
      </g>

      <!-- Menu Brand Header -->
      <g transform="translate(36, 120)">
        <text x="0" y="0" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#38bdf8" letter-spacing="2">NAVIGATION</text>
        <line x1="0" y1="14" x2="321" y2="14" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
      </g>

      <!-- Navigation Links -->
      <g transform="translate(36, 180)">
        <!-- Link 1: Visual Reel -->
        <g transform="translate(0, 0)">
          <text x="0" y="32" font-family="Flapstick DEMO, cursive, sans-serif" font-size="38" fill="#fff7ed">Reel</text>
          <text x="310" y="28" text-anchor="end" font-family="Space Mono, monospace" font-size="11" fill="#64748b">01</text>
          <line x1="0" y1="46" x2="321" y2="46" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
        </g>
        <!-- Link 2: Portfolio Work -->
        <g transform="translate(0, 70)">
          <text x="0" y="32" font-family="Flapstick DEMO, cursive, sans-serif" font-size="38" fill="#fff7ed">Work</text>
          <text x="310" y="28" text-anchor="end" font-family="Space Mono, monospace" font-size="11" fill="#64748b">02</text>
          <line x1="0" y1="46" x2="321" y2="46" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
        </g>
        <!-- Link 3: Contact Page -->
        <g transform="translate(0, 140)">
          <text x="0" y="32" font-family="Flapstick DEMO, cursive, sans-serif" font-size="38" fill="#38bdf8">Contact</text>
          <text x="310" y="28" text-anchor="end" font-family="Space Mono, monospace" font-size="11" fill="#38bdf8">03</text>
          <line x1="0" y1="46" x2="321" y2="46" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
        </g>
        <!-- Link 4: Curriculum Vitae -->
        <g transform="translate(0, 210)">
          <text x="0" y="32" font-family="Flapstick DEMO, cursive, sans-serif" font-size="38" fill="#fff7ed">CV / Resume</text>
          <text x="310" y="28" text-anchor="end" font-family="Space Mono, monospace" font-size="11" fill="#64748b">04</text>
          <line x1="0" y1="46" x2="321" y2="46" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />
        </g>
      </g>

      <!-- Bottom Direct Contact Info -->
      <g transform="translate(36, 680)">
        <text x="0" y="0" font-family="Space Mono, monospace" font-size="10" font-weight="700" fill="#64748b" letter-spacing="1.5">DIRECT CONTACT</text>
        <text x="0" y="26" font-family="DM Sans, sans-serif" font-size="14" font-weight="700" fill="#fff7ed">basiljose8989@gmail.com</text>
        <text x="0" y="48" font-family="DM Sans, sans-serif" font-size="12" fill="#94a3b8">Based in Kerala, India &#8226; Available Worldwide</text>
      </g>
    </g>
    <rect width="393" height="852" stroke="#1d426d" stroke-width="1" fill="none" pointer-events="none" />
    <text x="196.5" y="888" text-anchor="middle" font-family="Space Mono, monospace" font-size="11" font-weight="700" fill="#94a3b8" letter-spacing="1">09 &#8226; HAMBURGER MENU DRAWER</text>
    <text x="196.5" y="904" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="11" fill="#64748b">Slide-Out Mobile Drawer &#8226; Quick Links &amp; Direct Actions</text>
'''

# -------------------------------------------------------------
# Function to save a single standalone SVG screen
# -------------------------------------------------------------
def save_screen_svg(filename, body_content, screen_title):
    standalone_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="393" height="852" viewBox="0 0 393 852" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    {master_clip_defs}
  </defs>
  <g id="{screen_title}">
    {body_content}
  </g>
</svg>'''
    filepath = os.path.join(SCREENS_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(standalone_svg)
    print(f"Saved individual screen: {filename} ({len(standalone_svg)} bytes)")

save_screen_svg("01_Mobile_Hero_Start.svg", artboard_1_body, "01 - Visual Reel Hero (Start)")
save_screen_svg("02_Mobile_Reel_Play.svg", artboard_2_body, "02 - Visual Reel Hero (Play Trigger)")
save_screen_svg("03_Mobile_Albums_Carousel.svg", artboard_3_body, "03 - Album Carousel")
save_screen_svg("04_Mobile_Postcards_Desk.svg", artboard_4_body, "04 - Postcard Showcase Desk")
save_screen_svg("05_Mobile_Flipped_Postcard.svg", artboard_5_body, "05 - Flipped Postcard Bento Grid")
save_screen_svg("06_Mobile_Lightbox_Inspect.svg", artboard_6_body, "06 - Lightbox Inspect Modal")
save_screen_svg("07_Mobile_Videography_Player.svg", artboard_7_body, "07 - Videography In-Card Player")
save_screen_svg("08_Mobile_Contact_Page.svg", artboard_8_body, "08 - Dedicated Contact Page")
save_screen_svg("09_Mobile_Hamburger_Menu_Open.svg", artboard_9_body, "09 - Hamburger Menu Drawer")

# -------------------------------------------------------------
# MASTER PANORAMIC FIGMA CANVAS SVG (3 Rows, 3 Screens each: 1500 x 3050 px)
# -------------------------------------------------------------
master_canvas_svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1500" height="3050" viewBox="0 0 1500 3050" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    {master_clip_defs}
  </defs>

  <!-- Presentation Backdrop -->
  <rect width="1500" height="3050" fill="#0b1320" />

  <!-- Canvas Board Header -->
  <g id="Master Canvas Header" transform="translate(60, 42)">
    <text x="0" y="0" font-family="Space Mono, monospace" font-size="14" font-weight="700" fill="#94a3b8" letter-spacing="2">BASIL JOSE &#8226; MOBILE PORTFOLIO FIGMA DESIGN SYSTEM</text>
    <text x="1380" y="0" text-anchor="end" font-family="DM Sans, sans-serif" font-size="13" fill="#64748b">100% Native Figma Compatible &#8226; iPhone 15 Viewport (393 &#215; 852 px)</text>
  </g>

  <!-- ROW 1 (y=80): Primary User Journey -->
  <g id="Row 1 - Primary Journey" transform="translate(0, 0)">
    <g transform="translate(60, 80)">
      {artboard_1_body}
    </g>
    <g transform="translate(540, 80)">
      {artboard_2_body}
    </g>
    <g transform="translate(1020, 80)">
      {artboard_3_body}
    </g>
  </g>

  <!-- ROW 2 (y=1050): Postcard Showcases & Bento Inspection -->
  <g id="Row 2 - Postcards &amp; Inspection" transform="translate(0, 0)">
    <g transform="translate(60, 1050)">
      {artboard_4_body}
    </g>
    <g transform="translate(540, 1050)">
      {artboard_5_body}
    </g>
    <g transform="translate(1020, 1050)">
      {artboard_6_body}
    </g>
  </g>

  <!-- ROW 3 (y=2020): Video Showcase, Contact & Menu Navigation -->
  <g id="Row 3 - Video &amp; Navigation" transform="translate(0, 0)">
    <g transform="translate(60, 2020)">
      {artboard_7_body}
    </g>
    <g transform="translate(540, 2020)">
      {artboard_8_body}
    </g>
    <g transform="translate(1020, 2020)">
      {artboard_9_body}
    </g>
  </g>
</svg>
'''

output_svg_path = os.path.join(BASE_DIR, "WEBSITE_PORTFOLIO_FIGMA_MOBILE_DESIGN.svg")
with open(output_svg_path, "w", encoding="utf-8") as f:
    f.write(master_canvas_svg)

print(f"SUCCESS: Master Figma Mobile SVG generated at {output_svg_path} ({len(master_canvas_svg)} bytes)")
