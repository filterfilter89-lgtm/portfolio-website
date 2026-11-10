import re

with open(r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch\postcard_exact_template.txt", "r", encoding="utf-8") as f:
    t = f.read()

# 1. Remove JSX comments
t = re.sub(r'\{\/\*.*?\*\/\}', '', t)

# 2. Convert JSX attributes to standard SVG
t = t.replace('{`url(#${uid}-', 'url(#__UID__-').replace(')`}', ')')
t = t.replace('clipPath=', 'clip-path=')
t = t.replace('${uid}-', '__UID__-')
t = re.sub(r'id=\{\`([^\`]+)\`\}', r'id="\1"', t)

# 3. Clean up conditional rendering of text in React
# In React:
# {line2 ? (<> ... </>) : ( ... )}
# We will replace that whole text block with a single placeholder __TITLE_TEXT_BLOCK__
start_title = t.find('{/* 5. Dynamic Cursive Project Title')
if start_title == -1:
    start_title = t.find('<g>')
    # find where it ends before <text x="122" y="154"
end_title = t.find('<text\n        x="122"\n        y="154"')
if end_title == -1:
    end_title = t.find('x="122"')
    # backup to preceding '<text'
    end_title = t.rfind('<text', 0, end_title)

prefix = t[:start_title]
suffix = t[end_title:]

clean_template = prefix + "__TITLE_BLOCK__\n\n      " + suffix
# Replace dateStamp
clean_template = clean_template.replace('{dateStamp.toUpperCase()}', '2026')
clean_template = clean_template.replace('{thumbnail}', '__THUMBNAIL_B64__')

with open(r"C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch\postcard_clean_svg_template.txt", "w", encoding="utf-8") as out:
    out.write(clean_template)

print("Saved clean template! Length:", len(clean_template))
