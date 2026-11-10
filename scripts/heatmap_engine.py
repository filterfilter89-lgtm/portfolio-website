import math
import numpy as np
from PIL import Image, ImageDraw

def get_rotated_corners(cx, cy, w, h, deg):
    rad = math.radians(deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)
    hw = w / 2.0
    hh = h / 2.0
    # 4 local corners
    local_corners = [
        (-hw, -hh),
        (hw, -hh),
        (hw, hh),
        (-hw, hh)
    ]
    world_corners = []
    for lx, ly in local_corners:
        wx = cx + (lx * cos_a - ly * sin_a)
        wy = cy + (lx * sin_a + ly * cos_a)
        world_corners.append((wx, wy))
    return world_corners

def polygons_intersect(p1, p2):
    # Separating Axis Theorem (SAT)
    for polygon in [p1, p2]:
        for i in range(len(polygon)):
            p_cur = polygon[i]
            p_next = polygon[(i + 1) % len(polygon)]
            edge = (p_next[0] - p_cur[0], p_next[1] - p_cur[1])
            # Normal perpendicular vector
            normal = (-edge[1], edge[0])
            
            # Project p1 onto normal
            min1 = float('inf')
            max1 = float('-inf')
            for p in p1:
                proj = p[0] * normal[0] + p[1] * normal[1]
                min1 = min(min1, proj)
                max1 = max(max1, proj)
                
            # Project p2 onto normal
            min2 = float('inf')
            max2 = float('-inf')
            for p in p2:
                proj = p[0] * normal[0] + p[1] * normal[1]
                min2 = min(min2, proj)
                max2 = max(max2, proj)
                
            # Check separation
            if max1 < min2 or max2 < min1:
                return False
    return True

def compute_heatmap(container_w, container_h, items, grid_scale=2):
    gw = int(container_w // grid_scale)
    gh = int(container_h // grid_scale)
    grid = np.zeros((gh, gw), dtype=np.int32)
    
    polys = []
    for it in items:
        pts = get_rotated_corners(it['cx'], it['cy'], it['w'], it['h'], it['rot'])
        # Scale to grid
        grid_pts = [(int(x / grid_scale), int(y / grid_scale)) for x, y in pts]
        polys.append(pts)
        
        # Rasterize polygon into a temporary mask
        mask_img = Image.new('L', (gw, gh), 0)
        draw = ImageDraw.Draw(mask_img)
        draw.polygon(grid_pts, outline=1, fill=1)
        mask_arr = np.array(mask_img, dtype=np.int32)
        grid += mask_arr
        
    overlap_mask = (grid >= 2)
    overlap_pixels = int(np.sum(overlap_mask))
    max_overlap = int(np.max(grid)) if grid.size > 0 else 0
    
    # Check pairwise SAT intersections
    pairwise_collisions = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if polygons_intersect(polys[i], polys[j]):
                pairwise_collisions.append((i, j))
                
    return {
        'grid': grid,
        'overlap_pixels': overlap_pixels,
        'max_overlap': max_overlap,
        'pairwise_collisions': pairwise_collisions,
        'polys': polys
    }

print("Heatmap engine defined.")
