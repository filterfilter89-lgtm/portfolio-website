import re

with open(r'C:\Users\basil\Documents\WEBSITE PORTFOLIO\scripts\generate_figma_mobile_perfect.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace postcard creation
repl = '''# Using clean postcard module
import sys
sys.path.append(r'C:/Users/basil/Documents/WEBSITE PORTFOLIO/scripts')
from clean_postcard_module import create_clean_postcard

ganesh_defs, ganesh_body = create_clean_postcard("Eazyarts Ganesh", ganesh_slide1_b64, "pc-ganesh")
fetto_defs, fetto_body = create_clean_postcard("Fetto Garments", fetto_thumb_b64, "pc-fetto")
fouz_defs, fouz_body = create_clean_postcard("Fouz Travels", fouz_thumb_b64, "pc-fouz")
fruitly_defs, fruitly_body = create_clean_postcard("Fruitly", fruitly_thumb_b64, "pc-fruitly")

all_postcard_defs = ""'''

text_new = re.sub(
    r'# Load clean postcard templates.*?all_postcard_defs = f\"\{ganesh_defs\}\\n\{fetto_defs\}\\n\{fouz_defs\}\\n\{fruitly_defs\}\"',
    lambda m: repl,
    text,
    flags=re.DOTALL
)

# Remove viewport-clip def
text_new = text_new.replace('<clipPath id="viewport-clip"><rect width="393" height="852" /></clipPath>', '')

# Replace <g clip-path="url(#viewport-clip)"> with <g id="artboard-viewport">
text_new = text_new.replace('<g clip-path="url(#viewport-clip)">', '<g id="artboard-viewport">')

with open(r'C:\Users\basil\Documents\WEBSITE PORTFOLIO\scripts\generate_figma_mobile_ultraclean.py', 'w', encoding='utf-8') as f:
    f.write(text_new)

print('generate_figma_mobile_ultraclean.py created! Length:', len(text_new))
