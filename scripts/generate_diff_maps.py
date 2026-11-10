import os
from PIL import Image, ImageChops

compare_dir = r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch\mobile_compare"

pairs = [
    ("01_hero_start", "01_live_hero_start.png", "figma_01_hero_start.png"),
    ("03_carousel", "03_live_carousel.png", "figma_03_carousel.png"),
    ("04_desk", "04_live_desk_graphic_designs.png", "figma_04_desk.png"),
    ("05_flipped", "05_live_flipped_ganesh.png", "figma_05_flipped.png"),
    ("07_video", "08_live_flipped_video.png", "figma_07_video.png")
]

for pid, live_fn, figma_fn in pairs:
    live_p = os.path.join(compare_dir, live_fn)
    figma_p = os.path.join(compare_dir, figma_fn)
    im_live = Image.open(live_p).convert("RGB").resize((786, 1704))
    im_figma = Image.open(figma_p).convert("RGB").resize((786, 1704))
    
    diff = ImageChops.difference(im_live, im_figma)
    # amplify diff by 4x to clearly see differences
    diff_amp = diff.point(lambda p: min(255, p * 4))
    diff_p = os.path.join(compare_dir, f"diff_{pid}.png")
    diff_amp.save(diff_p)
    print(f"Saved diff map: {diff_p}")

