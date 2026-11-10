import sys, os, math
sys.path.append(os.path.join(r"C:\Users\basil\Documents\WEBSITE PORTFOLIO", "scripts"))
from heatmap_engine import compute_heatmap

def optimize_desk():
    viewports = [
        ('Desktop 1920x1080', 1920, 1080, False),
        ('Desktop 1440x900', 1440, 900, False),
        ('Desktop 1024x768', 1024, 768, False),
        ('Mobile 430x932', 430, 932, True),
        ('Mobile 390x844', 390, 844, True),
        ('Mobile 375x667', 375, 667, True)
    ]

    def get_slot_and_size(idx, total_count, is_mobile, vw, vh):
        if is_mobile:
            if total_count == 1:
                rw = min(290, round(vw * 0.78))
                rh = round(rw * 0.5625)
                return {'left': 50, 'top': 48, 'rot': -1.2, 'rw': rw, 'rh': rh}
            elif total_count == 2:
                rw = min(270, round(vw * 0.72))
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 50, 'top': 30, 'rot': -2.2},
                    {'left': 50, 'top': 66, 'rot': 2.2}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            elif total_count == 3:
                rw = min(230, round(vw * 0.62))
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 50, 'top': 24, 'rot': -2.2},
                    {'left': 50, 'top': 48, 'rot': 1.8},
                    {'left': 50, 'top': 72, 'rot': -2.0}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            elif total_count == 4:
                # 2x2 grid on mobile with generous spacing
                rw = min(150, round(vw * 0.38))
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 26, 'top': 31, 'rot': -2.0},
                    {'left': 74, 'top': 31, 'rot': 1.8},
                    {'left': 26, 'top': 66, 'rot': 1.6},
                    {'left': 74, 'top': 66, 'rot': -1.8}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            elif total_count == 5:
                # Staggered 2 columns: 3 on left, 2 on right
                rw = min(145, round(vw * 0.37))
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 26, 'top': 23, 'rot': -2.0},
                    {'left': 74, 'top': 32, 'rot': 1.8},
                    {'left': 26, 'top': 48, 'rot': 1.6},
                    {'left': 74, 'top': 57, 'rot': -2.0},
                    {'left': 26, 'top': 73, 'rot': -1.8}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            else:
                # 6+ cards (e.g. 7): 2 columns balanced
                rw = min(140, round(vw * 0.36))
                rh = round(rw * 0.5625)
                half = math.ceil(total_count / 2)
                is_left = idx < half
                col_idx = idx if is_left else (idx - half)
                col_count = half if is_left else (total_count - half)
                step = 60 / max(1, col_count - 1)
                top_val = (19 + col_idx * step) if is_left else (25 + col_idx * step)
                left_val = 26 if is_left else 74
                rot = (-1 if idx % 2 == 0 else 1) * (1.4 + (idx % 3) * 0.5)
                return {'left': left_val, 'top': top_val, 'rot': rot, 'rw': rw, 'rh': rh}
        else:
            # Desktop
            card_w = min(440, round(vw * 0.27))
            if total_count == 1:
                rw = round(card_w * 0.95)
                rh = round(rw * 0.5625)
                return {'left': 50, 'top': 48, 'rot': 0, 'rw': rw, 'rh': rh}
            elif total_count == 2:
                rw = round(card_w * 0.90)
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 32, 'top': 48, 'rot': -2.2},
                    {'left': 68, 'top': 48, 'rot': 2.2}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            elif total_count == 3:
                rw = round(card_w * 0.86)
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 22, 'top': 48, 'rot': -2.5},
                    {'left': 50, 'top': 46, 'rot': 1.0},
                    {'left': 78, 'top': 48, 'rot': 2.5}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            elif total_count == 4:
                rw = round(card_w * 0.85)
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 29, 'top': 30, 'rot': -2.2},
                    {'left': 71, 'top': 30, 'rot': 2.0},
                    {'left': 29, 'top': 68, 'rot': 1.8},
                    {'left': 71, 'top': 68, 'rot': -1.8}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            elif total_count == 5:
                rw = round(card_w * 0.80)
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 19, 'top': 30, 'rot': -2.8},
                    {'left': 50, 'top': 26, 'rot': 1.5},
                    {'left': 81, 'top': 30, 'rot': 2.8},
                    {'left': 33, 'top': 68, 'rot': 2.2},
                    {'left': 67, 'top': 68, 'rot': -2.0}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            elif total_count == 7:
                # 4 top, 3 bottom: scale 0.74 ensures 0 collision even at 1024x768
                rw = round(card_w * 0.74)
                rh = round(rw * 0.5625)
                slots = [
                    {'left': 15, 'top': 28, 'rot': -2.8},
                    {'left': 38.3, 'top': 26, 'rot': 1.5},
                    {'left': 61.6, 'top': 26, 'rot': -1.2},
                    {'left': 85, 'top': 28, 'rot': 2.8},
                    {'left': 26, 'top': 70, 'rot': 2.0},
                    {'left': 50, 'top': 71, 'rot': -1.0},
                    {'left': 74, 'top': 70, 'rot': 1.8}
                ]
                return {**slots[idx], 'rw': rw, 'rh': rh}
            else:
                half = math.ceil(total_count / 2)
                is_top_row = idx < half
                col_idx = idx if is_top_row else (idx - half)
                row_count = half if is_top_row else (total_count - half)
                rw = round(card_w * 0.72)
                rh = round(rw * 0.5625)
                x_percent = 16 + (col_idx / max(1, row_count - 1)) * 68
                y_percent = 28 if is_top_row else 70
                rot = (-1 if idx % 2 == 0 else 1) * (1.5 + (idx % 3) * 0.8)
                return {'left': x_percent, 'top': y_percent, 'rot': rot, 'rw': rw, 'rh': rh}

    print("==================================================")
    print(" VERIFYING OPTIMIZED DESK SLOTS ACROSS ALL VIEWPORTS")
    print("==================================================")
    all_pass = True
    for vp_name, vw, vh, is_mobile in viewports:
        for total_count in [1, 2, 3, 4, 5, 7, 8]:
            items = []
            for idx in range(total_count):
                data = get_slot_and_size(idx, total_count, is_mobile, vw, vh)
                cx = (data['left'] / 100.0) * vw
                cy = (data['top'] / 100.0) * vh
                items.append({'cx': cx, 'cy': cy, 'w': data['rw'], 'h': data['rh'], 'rot': data['rot']})
            res = compute_heatmap(vw, vh, items)
            if res['max_overlap'] > 1:
                all_pass = False
                print(f"FAILED on {vp_name} for Count={total_count}: {len(res['pairwise_collisions'])} collisions")
            else:
                pass
    if all_pass:
        print("ALL VIEWPORTS AND COUNTS: 100% PASS WITH ZERO OVERLAPS!")

optimize_desk()
