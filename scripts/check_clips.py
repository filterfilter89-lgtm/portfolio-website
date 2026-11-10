import re
from collections import Counter

with open(r'C:\Users\basil\Documents\WEBSITE PORTFOLIO\scripts\generate_figma_mobile_perfect.py', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'clip-path="url\((#[^)]+)\)"', text)
print('Total clip-path usages in script:', len(matches))
print(Counter(matches))
