import sys, os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.append(os.path.join(r"C:\Users\basil\Documents\WEBSITE PORTFOLIO", "scripts"))
from heatmap_engine import compute_heatmap, get_rotated_corners
from optimize_desk import optimize_desk
from optimize_flipped_cards import optimize_flipped

ARTIFACT_DIR = r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9"

def render_visual_heatmap(cw, ch, items, title, filename):
    res = compute_heatmap(cw, ch, items, grid_scale=1)
    grid = res['grid']
    
    # Create RGBA heatmap image
    # 0 = #0e1928 (dark slate navy)
    # 1 = #10b981 (clean emerald green)
    # >= 2 = #ef4444 (bright red collision)
    h_img = Image.new('RGB', (cw, ch), (14, 25, 40))
    draw = ImageDraw.Draw(h_img)
    
    # Draw item polygons
    for idx, it in enumerate(items):
        pts = get_rotated_corners(it['cx'], it['cy'], it['w'], it['h'], it['rot'])
        # Fill with semi-transparent green
        draw.polygon(pts, fill=(20, 60, 95), outline=(56, 189, 248), width=2)
        # Draw label
        draw.text((it['cx'] - 20, it['cy'] - 8), f"#{idx+1}", fill=(255, 255, 255))
        
    # Highlight any overlapping regions (if any)
    overlap_mask = (grid >= 2)
    if np.any(overlap_mask):
        # Draw red warning over collision pixels
        for y in range(ch):
            for x in range(cw):
                if grid[y, x] >= 2:
                    h_img.putpixel((x, y), (239, 68, 68))
                    
    # Draw header overlay
    draw.rectangle([(0, 0), (cw, 40)], fill=(11, 19, 32))
    status_text = "HEATMAP PASS: 0% OVERLAP (ZERO COLLISIONS)" if res['max_overlap'] <= 1 else f"HEATMAP FAIL: {len(res['pairwise_collisions'])} COLLISIONS"
    status_color = (74, 222, 128) if res['max_overlap'] <= 1 else (248, 113, 113)
    draw.text((16, 12), f"{title} | {status_text}", fill=status_color)
    
    out_path = os.path.join(ARTIFACT_DIR, filename)
    h_img.save(out_path)
    print(f"Saved heatmap: {out_path} ({res['max_overlap']} max occupancy)")

print("Heatmap visualizer defined.")
