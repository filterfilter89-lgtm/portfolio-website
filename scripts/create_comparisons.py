import os
from PIL import Image, ImageDraw, ImageFont

compare_dir = r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch\mobile_compare"

pairs = [
    ("01_hero_start", "01_live_hero_start.png", "figma_01_hero_start.png", "01 · Visual Reel Hero (Start State)"),
    ("02_hero_end", "02_live_hero_end.png", "figma_02_hero_end.png", "02 · Visual Reel Hero (Play Trigger)"),
    ("03_carousel", "03_live_carousel.png", "figma_03_carousel.png", "03 · Album Carousel (#work)"),
    ("04_desk", "04_live_desk_graphic_designs.png", "figma_04_desk.png", "04 · Postcard Showcase Desk"),
    ("05_flipped", "05_live_flipped_ganesh.png", "figma_05_flipped.png", "05 · Flipped Postcard Bento Grid"),
    ("06_modal", "06_live_inspect_modal.png", "figma_06_modal.png", "06 · Lightbox Inspect Modal"),
    ("07_video", "08_live_flipped_video.png", "figma_07_video.png", "07 · Videography In-Card Player")
]

for pid, live_fn, figma_fn, title in pairs:
    live_p = os.path.join(compare_dir, live_fn)
    figma_p = os.path.join(compare_dir, figma_fn)

    if not os.path.exists(live_p) or not os.path.exists(figma_p):
        print(f"Skipping {pid}, missing files: {live_p} or {figma_p}")
        continue

    im_live = Image.open(live_p).convert("RGBA")
    im_figma = Image.open(figma_p).convert("RGBA")

    # Match sizes
    w, h = 786, 1704
    im_live = im_live.resize((w, h), Image.Resampling.LANCZOS)
    im_figma = im_figma.resize((w, h), Image.Resampling.LANCZOS)

    # Header height
    header_h = 80
    border = 20
    comp_w = w * 2 + border * 3
    comp_h = h + header_h + border * 2

    comp = Image.new("RGBA", (comp_w, comp_h), (11, 19, 32, 255))
    draw = ImageDraw.Draw(comp)

    # Title
    draw.text((border, 24), f"COMPARISON: {title}", fill=(248, 250, 252, 255))
    draw.text((border, 48), "LEFT: Live Mobile Website (iPhone 15)  |  RIGHT: Figma Vector Design", fill=(148, 163, 184, 255))

    # Paste
    comp.paste(im_live, (border, header_h + border))
    comp.paste(im_figma, (border * 2 + w, header_h + border))

    out_p = os.path.join(compare_dir, f"side_by_side_{pid}.png")
    comp.save(out_p, quality=92)
    print(f"Generated side-by-side comparison: {out_p}")

print("All side-by-side comparisons generated successfully!")

