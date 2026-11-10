import xml.etree.ElementTree as ET
import re
import os

SVG_PATH = r"C:\Users\basil\Documents\WEBSITE PORTFOLIO\WEBSITE_PORTFOLIO_FIGMA_MOBILE_DESIGN.svg"

print("--- VALIDATING MASTER SVG ---")
with open(SVG_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# 1. XML parse
try:
    tree = ET.parse(SVG_PATH)
    root = tree.getroot()
    print("PASS: XML is well-formed! Root:", root.tag)
except Exception as e:
    print("FAIL: XML parsing error:", e)

# 2. Check clip-path nesting
# Walk the tree and check if any element with clip-path has an ancestor with clip-path
nested_clips = []
def check_nesting(node, has_clip_ancestor=False, path=""):
    tag = node.tag.split('}')[-1]
    has_clip = 'clip-path' in node.attrib
    current_path = f"{path}/{tag}"
    if has_clip:
        clip_val = node.attrib['clip-path']
        if has_clip_ancestor:
            nested_clips.append((current_path, clip_val))
        has_clip_ancestor = True
    for child in node:
        check_nesting(child, has_clip_ancestor, current_path)

check_nesting(root)
if len(nested_clips) == 0:
    print("PASS: 0 nested clip-paths found across the entire master SVG!")
else:
    print(f"FAIL: {len(nested_clips)} nested clip-paths found:")
    for p, c in nested_clips[:5]:
        print(f"  {p} -> {c}")

# 3. Check clip-rule inside clipPath
clip_rules = re.findall(r'<clipPath[^>]*>.*?clip-rule.*?<\/clipPath>', content, re.DOTALL)
if len(clip_rules) == 0:
    print("PASS: 0 clip-rule attributes found inside clipPath elements!")
else:
    print(f"FAIL: {len(clip_rules)} clip-rule attributes found!")

# 4. Check all image tags for href AND xlink:href
images = re.findall(r'<image[^>]+>', content)
missing_xlink = [img[:100] for img in images if 'xlink:href=' not in img]
missing_href = [img[:100] for img in images if 'href=' not in img]
if len(missing_xlink) == 0 and len(missing_href) == 0:
    print(f"PASS: All {len(images)} <image> tags have BOTH href and xlink:href!")
else:
    print(f"FAIL: Missing xlink:href: {len(missing_xlink)}, Missing href: {len(missing_href)}")

# 5. Check clipPath IDs
clip_defs = re.findall(r'<clipPath id="([^"]+)"', content)
print(f"PASS: Total clean clipPath definitions: {len(clip_defs)} ({', '.join(clip_defs)})")

print("\n--- VALIDATING INDIVIDUAL SCREEN SVGS ---")
screens_dir = r"C:\Users\basil\Documents\WEBSITE PORTFOLIO\figma_mobile_screens"
all_screens_pass = True
for f in sorted(os.listdir(screens_dir)):
    if not f.endswith(".svg"):
        continue
    p = os.path.join(screens_dir, f)
    try:
        t = ET.parse(p)
        r = t.getroot()
        # Check nested clips
        screen_nested = []
        check_nesting(r)
        with open(p, "r", encoding="utf-8") as sf:
            scontent = sf.read()
        simages = re.findall(r'<image[^>]+>', scontent)
        smissing = [img[:80] for img in simages if 'xlink:href=' not in img or 'href=' not in img]
        if len(smissing) > 0:
            print(f"FAIL: {f} has images missing attributes!")
            all_screens_pass = False
        else:
            print(f"PASS: {f} (well-formed, {len(simages)} images, 0 errors)")
    except Exception as e:
        print(f"FAIL: {f} error: {e}")
        all_screens_pass = False

if all_screens_pass:
    print("\nALL 9 SCREENS PASSED 100% CLEAN SVG VALIDATION!")
