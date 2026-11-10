import sys, os, math
sys.path.append(os.path.join(r"C:\Users\basil\Documents\WEBSITE PORTFOLIO", "scripts"))
from heatmap_engine import compute_heatmap

def optimize_flipped():
    # Card inner dimensions (16:9 expanded postcard):
    viewports = [
        ('Desktop 1920x1080', 1380, 776, False),
        ('Desktop 1440x900', 1238, 696, False),
        ('Desktop 1024x768', 880, 495, False),
        ('Mobile 430x932', 404, 227, True),
        ('Mobile 390x844', 367, 206, True),
        ('Mobile 375x667', 352, 198, True)
    ]

    def get_flipped_slot(idx, count, is_mobile):
        if is_mobile:
            if count == 1:
                return {'left': 50, 'top': 50, 'rot': -1.0, 'maxW': 70, 'maxH': 78}
            elif count == 2:
                # 2 items side-by-side with generous spacing
                slots = [
                    {'left': 28, 'top': 50, 'rot': -2.2, 'maxW': 36, 'maxH': 74},
                    {'left': 72, 'top': 50, 'rot': 2.0, 'maxW': 36, 'maxH': 74}
                ]
                return slots[idx]
            elif count == 3:
                # 3 items: clean spread
                slots = [
                    {'left': 20, 'top': 50, 'rot': -2.5, 'maxW': 24, 'maxH': 74},
                    {'left': 50, 'top': 49, 'rot': 1.2, 'maxW': 24, 'maxH': 74},
                    {'left': 80, 'top': 50, 'rot': 2.2, 'maxW': 24, 'maxH': 74}
                ]
                return slots[idx]
            elif count == 4:
                # 4 items: 2x2 grid on mobile
                slots = [
                    {'left': 28, 'top': 30, 'rot': -2.0, 'maxW': 34, 'maxH': 36},
                    {'left': 72, 'top': 30, 'rot': 1.8, 'maxW': 34, 'maxH': 36},
                    {'left': 28, 'top': 70, 'rot': 1.6, 'maxW': 34, 'maxH': 36},
                    {'left': 72, 'top': 70, 'rot': -1.8, 'maxW': 34, 'maxH': 36}
                ]
                return slots[idx]
            elif count == 5:
                # 5 items: 3 on top row, 2 on bottom row (staggered in spaces)
                slots = [
                    {'left': 19, 'top': 29, 'rot': -2.0, 'maxW': 22, 'maxH': 36},
                    {'left': 50, 'top': 27, 'rot': 1.5, 'maxW': 22, 'maxH': 36},
                    {'left': 81, 'top': 29, 'rot': -1.8, 'maxW': 22, 'maxH': 36},
                    {'left': 34.5, 'top': 71, 'rot': 1.8, 'maxW': 22, 'maxH': 36},
                    {'left': 65.5, 'top': 71, 'rot': -1.6, 'maxW': 22, 'maxH': 36}
                ]
                return slots[idx]
            else:
                # 6+ items (e.g. 8 for Fruitly): 2 rows of N/2
                half = math.ceil(count / 2)
                is_top = idx < half
                col_idx = idx if is_top else (idx - half)
                row_count = half if is_top else (count - half)
                step = 70 / max(1, row_count - 1)
                left_val = 15 + col_idx * step
                top_val = 29 if is_top else 71
                rot = (-1 if idx % 2 == 0 else 1) * (1.4 + (idx % 3) * 0.5)
                max_w = min(22, math.floor(66 / row_count))
                return {'left': left_val, 'top': top_val, 'rot': rot, 'maxW': max_w, 'maxH': 36}
        else:
            # Desktop
            if count == 1:
                return {'left': 50, 'top': 50, 'rot': -1.0, 'maxW': 48, 'maxH': 78}
            elif count == 2:
                slots = [
                    {'left': 30, 'top': 50, 'rot': -2.2, 'maxW': 32, 'maxH': 74},
                    {'left': 70, 'top': 50, 'rot': 2.0, 'maxW': 32, 'maxH': 74}
                ]
                return slots[idx]
            elif count == 3:
                slots = [
                    {'left': 21, 'top': 50, 'rot': -2.5, 'maxW': 24, 'maxH': 74},
                    {'left': 50, 'top': 48, 'rot': 1.2, 'maxW': 24, 'maxH': 74},
                    {'left': 79, 'top': 50, 'rot': 2.5, 'maxW': 24, 'maxH': 74}
                ]
                return slots[idx]
            elif count == 4:
                # 4 items in one elegant row or 2x2
                # In one row across a 16:9 landscape card, 4 items look stunning:
                slots = [
                    {'left': 15.5, 'top': 50, 'rot': -2.4, 'maxW': 18.5, 'maxH': 74},
                    {'left': 38.5, 'top': 48, 'rot': 1.8, 'maxW': 18.5, 'maxH': 74},
                    {'left': 61.5, 'top': 52, 'rot': -1.6, 'maxW': 18.5, 'maxH': 74},
                    {'left': 84.5, 'top': 49, 'rot': 2.2, 'maxW': 18.5, 'maxH': 74}
                ]
                return slots[idx]
            elif count == 5:
                # 3 top, 2 bottom staggered
                slots = [
                    {'left': 20, 'top': 29, 'rot': -2.2, 'maxW': 23, 'maxH': 37},
                    {'left': 50, 'top': 27, 'rot': 1.5, 'maxW': 23, 'maxH': 37},
                    {'left': 80, 'top': 29, 'rot': -2.0, 'maxW': 23, 'maxH': 37},
                    {'left': 35, 'top': 71, 'rot': 2.0, 'maxW': 23, 'maxH': 37},
                    {'left': 65, 'top': 71, 'rot': -1.8, 'maxW': 23, 'maxH': 37}
                ]
                return slots[idx]
            else:
                # 6+ items (e.g. 8): 2 rows of 4
                half = math.ceil(count / 2)
                is_top = idx < half
                col_idx = idx if is_top else (idx - half)
                row_count = half if is_top else (count - half)
                step = 72 / max(1, row_count - 1)
                left_val = 14 + col_idx * step
                top_val = 29 if is_top else 71
                rot = (-1 if idx % 2 == 0 else 1) * (1.5 + (idx % 3) * 0.6)
                max_w = min(22, math.floor(70 / row_count))
                return {'left': left_val, 'top': top_val, 'rot': rot, 'maxW': max_w, 'maxH': 36}

    print("==================================================")
    print(" VERIFYING OPTIMIZED FLIPPED POSTCARDS WITH HEATMAP")
    print("==================================================")
    all_pass = True
    for vp_name, cw, ch, is_mobile in viewports:
        for count in [1, 2, 3, 4, 5, 6, 7, 8]:
            items = []
            for i in range(count):
                slot = get_flipped_slot(i, count, is_mobile)
                cx = (slot['left'] / 100.0) * cw
                cy = (slot['top'] / 100.0) * ch
                sw = (slot['maxW'] / 100.0) * cw
                sh = (slot['maxH'] / 100.0) * ch
                items.append({'cx': cx, 'cy': cy, 'w': sw, 'h': sh, 'rot': slot['rot']})
            res = compute_heatmap(cw, ch, items)
            if res['max_overlap'] > 1:
                all_pass = False
                print(f"FAILED on {vp_name} for Count={count}: {len(res['pairwise_collisions'])} collisions")
    if all_pass:
        print("ALL VIEWPORTS AND COUNTS: 100% PASS WITH ZERO OVERLAPS!")

optimize_flipped()
