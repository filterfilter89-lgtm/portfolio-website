import math
import numpy as np
from PIL import Image, ImageDraw
from heatmap_engine import compute_heatmap

def test_current_flipped_slots():
    print("==================================================")
    print(" TESTING CURRENT FLIPPED POSTCARDS WITH HEATMAP")
    print("==================================================")
    
    # Desktop 1440x900 -> enlarged postcard is 1238 x 696 px
    desktop_w, desktop_h = 1238, 696
    # Mobile 390x844 -> enlarged postcard is 367 x 206 px
    mobile_w, mobile_h = 367, 206

    counts = [1, 2, 3, 4, 5, 8]
    
    for mode, cw, ch, is_mobile in [('Desktop', desktop_w, desktop_h, False), ('Mobile', mobile_w, mobile_h, True)]:
        print(f"\n--- {mode} Viewport ({cw}x{ch}) ---")
        for count in counts:
            items = []
            for i in range(count):
                # Using current getProjectScatterSlot formulas from PolaroidGallery.jsx
                if count == 1:
                    slot = {'left': 50, 'top': 50, 'rot': -1.2, 'maxW': 78 if is_mobile else 56, 'maxH': 78}
                elif count == 2:
                    slots2 = [
                        {'left': 30 if is_mobile else 31, 'top': 50, 'rot': -3.0, 'maxW': 44 if is_mobile else 36, 'maxH': 76},
                        {'left': 70 if is_mobile else 69, 'top': 50, 'rot': 2.8, 'maxW': 44 if is_mobile else 36, 'maxH': 76}
                    ]
                    slot = slots2[i % 2]
                elif count == 3:
                    slots3 = [
                        {'left': 23, 'top': 51, 'rot': -3.5, 'maxW': 30 if is_mobile else 28, 'maxH': 75},
                        {'left': 50, 'top': 48, 'rot': 1.2, 'maxW': 30 if is_mobile else 28, 'maxH': 75},
                        {'left': 77, 'top': 51, 'rot': 3.2, 'maxW': 30 if is_mobile else 28, 'maxH': 75}
                    ]
                    slot = slots3[i % 3]
                elif count == 4:
                    slots4 = [
                        {'left': 17, 'top': 50, 'rot': -3.2, 'maxW': 23 if is_mobile else 21.5, 'maxH': 75},
                        {'left': 39, 'top': 47, 'rot': 2.4, 'maxW': 23 if is_mobile else 21.5, 'maxH': 75},
                        {'left': 61, 'top': 52, 'rot': -2.0, 'maxW': 23 if is_mobile else 21.5, 'maxH': 75},
                        {'left': 83, 'top': 48, 'rot': 3.0, 'maxW': 23 if is_mobile else 21.5, 'maxH': 75}
                    ]
                    slot = slots4[i % 4]
                elif count == 5:
                    slots5 = [
                        {'left': 21, 'top': 32, 'rot': -2.6, 'maxW': 30 if is_mobile else 27, 'maxH': 48},
                        {'left': 50, 'top': 28, 'rot': 1.8, 'maxW': 30 if is_mobile else 27, 'maxH': 48},
                        {'left': 79, 'top': 33, 'rot': -2.8, 'maxW': 30 if is_mobile else 27, 'maxH': 48},
                        {'left': 35, 'top': 71, 'rot': 3.0, 'maxW': 31 if is_mobile else 28, 'maxH': 48},
                        {'left': 65, 'top': 67, 'rot': -1.8, 'maxW': 31 if is_mobile else 28, 'maxH': 48}
                    ]
                    slot = slots5[i % 5]
                else:
                    # 6+ items (e.g. 8)
                    half = math.ceil(count / 2)
                    is_top = i < half
                    row_count = half if is_top else (count - half)
                    col_idx = i if is_top else (i - half)
                    step = 76 / max(1, row_count - 1)
                    left_val = 12 + col_idx * step
                    top_val = (30 + (-2.5 if col_idx % 2 == 0 else 2.5)) if is_top else (70 + (2.5 if col_idx % 2 == 0 else -2.5))
                    rot = (-1 if i % 2 == 0 else 1) * (1.8 + (i % 3) * 0.7)
                    max_w = (82 if is_mobile else 78) / row_count
                    slot = {'left': left_val, 'top': top_val, 'rot': rot, 'maxW': max_w, 'maxH': 48}
                
                cx = (slot['left'] / 100.0) * cw
                cy = (slot['top'] / 100.0) * ch
                # For an image with 4:5 AR (like Ganesh) or 16:9 AR (Fruitly)
                # Slot box:
                sw = (slot['maxW'] / 100.0) * cw
                sh = (slot['maxH'] / 100.0) * ch
                # The polaroid frame fits inside (sw, sh)
                items.append({'cx': cx, 'cy': cy, 'w': sw, 'h': sh, 'rot': slot['rot']})
                
            res = compute_heatmap(cw, ch, items)
            status = "PASS (0 Overlap)" if res['max_overlap'] <= 1 else f"FAIL ({len(res['pairwise_collisions'])} collisions, max overlap={res['max_overlap']})"
            print(f"  Count = {count}: {status}")

test_current_flipped_slots()
