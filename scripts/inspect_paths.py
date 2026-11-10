import re

with open(r'C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch\postcard_body_template.txt', 'r', encoding='utf-8') as f:
    text = f.read()

stripes = re.findall(r'<path fill="#fff4ea" d="[^"]+" fill-opacity="1" fill-rule="nonzero"/>', text)
print('Number of stripes found:', len(stripes))

stamp_match = re.search(r'<g clip-path="url\(#[^)]+-2592f6d9b6\)">\s*<path fill="#315c8f" d="([^"]+)"', text)
if stamp_match:
    print('Found stamp path! Length:', len(stamp_match.group(1)))
    stamp_d = stamp_match.group(1)
else:
    print('Stamp match failed')

with open(r'C:\Users\basil\.gemini\antigravity\brain\19b7de88-e1a2-4cdd-9e35-6772361deff9\scratch\postcard_clean_parts.py', 'w', encoding='utf-8') as f_out:
    f_out.write('STRIPES_SVG = """' + '\n'.join(stripes) + '"""\n')
    f_out.write(f'STAMP_PATH = """{stamp_d}"""\n')
print('Successfully saved clean parts!')
