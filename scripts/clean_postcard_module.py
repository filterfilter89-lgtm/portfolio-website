import os
import re

SCRATCH_DIR = r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch"
with open(os.path.join(SCRATCH_DIR, "postcard_clean_parts.py"), "r", encoding="utf-8") as f:
    code = f.read()
exec(code, globals())

# Now we have STRIPES_SVG and STAMP_PATH

def create_clean_postcard(title, thumb_b64, uid):
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

    # Pure standard vector shapes: ZERO clipPaths, ZERO nesting, 100% valid SVG 1.1
    pc_body = f'''
      <!-- Base Outer Border & Airmail Stripes -->
      <rect width="1440" height="810" fill="#315c8f" />
      {STRIPES_SVG}

      <!-- Inner Ivory Writing Surface -->
      <rect x="57" y="57" width="1326" height="696" rx="8" fill="#fff4ea" />

      <!-- Perforated Postage Stamp Outline (Direct vector path) -->
      <path fill="#315c8f" d="{STAMP_PATH}" />

      <!-- Postage Stamp Thumbnail Image (Direct image with both href and xlink:href) -->
      <image x="936" y="188" width="314.15" height="433.81" href="{thumb_b64}" xlink:href="{thumb_b64}" preserveAspectRatio="xMidYMid slice" />

      <!-- Project Title in Handwritten Cursive Font -->
      {title_block}

      <!-- Clean Postcard Date Stamp -->
      <text x="122" y="154" fill="#315c8f" font-family="'Courier New', Courier, monospace" font-size="20" font-weight="700" letter-spacing="2.5">2026</text>
    '''
    return "", pc_body

print("create_clean_postcard ready!")
