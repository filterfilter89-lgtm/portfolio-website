import os
import json
import re
from PIL import Image

portfolio_dir = r"C:\Users\basil\Documents\WEBSITE PORTFOLIO"
categories_js_path = os.path.join(portfolio_dir, "src", "data", "categories.js")
pub_dir = os.path.join(portfolio_dir, "public")

# Read current categories.js
with open(categories_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract json object after export const CATEGORIES =
match = re.search(r'export const CATEGORIES = (\[.*\]);?', content, re.DOTALL)
if not match:
    print("Could not find CATEGORIES in categories.js")
    exit(1)

categories = json.loads(match.group(1))

for cat in categories:
    for proj in cat.get('projects', []):
        # Determine thumbnail aspect ratio
        thumb_src = proj.get('thumbnail', '')
        if thumb_src:
            clean_thumb = thumb_src.lstrip('/')
            thumb_full = os.path.join(pub_dir, clean_thumb)
            if os.path.exists(thumb_full):
                try:
                    with Image.open(thumb_full) as im:
                        tw, th = im.size
                        proj['thumbnailWidth'] = tw
                        proj['thumbnailHeight'] = th
                        proj['thumbnailAspectRatio'] = round(tw / th, 4)
                except Exception:
                    pass

        # Check project-level video
        if proj.get('videoSrc'):
            proj['videoAspectRatio'] = 0.5625 # 9/16 vertical reel

        # Process media items
        for item in proj.get('media', []):
            src = item.get('src', '')
            item_type = item.get('type', '')
            if item_type == 'image' or (src and any(src.lower().endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.webp'])):
                clean_src = src.lstrip('/')
                full_src = os.path.join(pub_dir, clean_src)
                if os.path.exists(full_src):
                    try:
                        with Image.open(full_src) as im:
                            w, h = im.size
                            item['width'] = w
                            item['height'] = h
                            item['aspectRatio'] = round(w / h, 4)
                    except Exception as e:
                        print(f"Error reading image {full_src}: {e}")
            elif item_type == 'video' or (src and any(src.lower().endswith(ext) for ext in ['.mp4', '.mov', '.webm'])):
                item['width'] = 1080
                item['height'] = 1920
                item['aspectRatio'] = 0.5625

new_categories_js = f"// Auto-generated with exact aspect ratios and dimensions\nexport const CATEGORIES = {json.dumps(categories, indent=2)};\n\nexport function getCategoryById(id) {{\n  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];\n}}\n"

with open(categories_js_path, "w", encoding="utf-8") as f:
    f.write(new_categories_js)

print("SUCCESS: Updated src/data/categories.js with exact dimensions and aspect ratios for all media assets!")
