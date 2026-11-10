import math
from heatmap_engine import compute_heatmap

def test_current_desk_slots():
    print("==================================================")
    print(" TESTING CURRENT DESK POSTCARDS WITH HEATMAP")
    print("==================================================")

    # Viewports to test
    viewports = [
        ('Desktop 1920x1080', 1920, 1080, False),
        ('Desktop 1440x900', 1440, 900, False),
        ('Desktop 1024x768', 1024, 768, False),
        ('Mobile 390x844', 390, 844, True),
        ('Mobile 375x667', 375, 667, True)
    ]

    for vp_name, vw, vh, is_mobile in viewports:
        print(f"\n--- {vp_name} ---")
        card_w = min(460, round(vw * 0.28)) if not is_mobile else min(320, round(vw * 0.82))
        resting_scale = 0.84  # for 7 cards or 0.90 for <= 5 cards
        
        for total_count in [1, 2, 3, 4, 5, 7]:
            scale = 0.84 if total_count > 5 else 0.90
            rw = card_w if is_mobile else round(card_w * scale)
            rh = round(rw * 0.5625)

            items = []
            for idx in range(total_count):
                if is_mobile:
                    start_top = 22
                    available_height = 56
                    step = available_height / (total_count - 1) if total_count > 1 else 0
                    top_val = 50 if total_count == 1 else start_top + idx * step
                    rot = (-1 if idx % 2 == 0 else 1) * (1.6 + (idx % 3) * 0.8)
                    slot = {'left': 50, 'top': top_val, 'rot': rot}
                else:
                    if total_count == 1:
                        slot = {'left': 50, 'top': 48, 'rot': 0}
                    elif total_count == 2:
                        s2 = [{'left': 32, 'top': 48, 'rot': -2.5}, {'left': 68, 'top': 48, 'rot': 2.5}]
                        slot = s2[idx % 2]
                    elif total_count == 3:
                        s3 = [{'left': 22, 'top': 48, 'rot': -3.0}, {'left': 50, 'top': 46, 'rot': 1.0}, {'left': 78, 'top': 48, 'rot': 3.0}]
                        slot = s3[idx % 3]
                    elif total_count == 4:
                        s4 = [{'left': 29, 'top': 30, 'rot': -2.5}, {'left': 71, 'top': 30, 'rot': 2.2}, {'left': 29, 'top': 70, 'rot': 2.0}, {'left': 71, 'top': 70, 'rot': -1.8}]
                        slot = s4[idx % 4]
                    elif total_count <= 5:
                        s5 = [{'left': 18, 'top': 30, 'rot': -3.5}, {'left': 50, 'top': 26, 'rot': 1.5}, {'left': 82, 'top': 30, 'rot': 3.5}, {'left': 32, 'top': 70, 'rot': 2.5}, {'left': 68, 'top': 70, 'rot': -2.2}]
                        slot = s5[idx % 5]
                    elif total_count == 7:
                        s7 = [
                            {'left': 14, 'top': 27, 'rot': -3.5},
                            {'left': 38, 'top': 25, 'rot': 1.8},
                            {'left': 62, 'top': 25, 'rot': -1.5},
                            {'left': 86, 'top': 27, 'rot': 3.5},
                            {'left': 24, 'top': 71, 'rot': 2.2},
                            {'left': 50, 'top': 72, 'rot': -1.2},
                            {'left': 76, 'top': 70, 'rot': 2.0}
                        ]
                        slot = s7[idx % 7]

                cx = (slot['left'] / 100.0) * vw
                cy = (slot['top'] / 100.0) * vh
                items.append({'cx': cx, 'cy': cy, 'w': rw, 'h': rh, 'rot': slot['rot']})

            res = compute_heatmap(vw, vh, items)
            status = "PASS (0 Overlap)" if res['max_overlap'] <= 1 else f"FAIL ({len(res['pairwise_collisions'])} collisions, max={res['max_overlap']})"
            print(f"  Count = {total_count}: {status}")

test_current_desk_slots()
