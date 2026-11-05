import os
import json
import re
import shutil

portfolio_dir = r"C:\Users\basil\Documents\WEBSITE PORTFOLIO"
projects_src = os.path.join(portfolio_dir, "projects")
public_dest = os.path.join(portfolio_dir, "public", "projects")

CATEGORIES_META = [
  {
    'id': 'advertisement',
    'title': 'ADVERTISEMENT',
    'coverIcon': '/icons/ADVERTISEMENT.png',
    'artist': 'Basil Jose',
    'tagline': 'High-production luxury spots, studio lighting campaigns, and kinetic product films.'
  },
  {
    'id': 'generative-ai',
    'title': 'GENERATIVE AI',
    'coverIcon': '/icons/GENERATIVE AI.png',
    'artist': 'Basil Jose',
    'tagline': 'Custom diffusion pipelines, latent video explorations, and neural motion design.'
  },
  {
    'id': 'graphic-designs',
    'title': 'GRAPHIC DESIGNS',
    'coverIcon': '/icons/GRAPHIC DESIGN.png',
    'artist': 'Basil Jose',
    'tagline': 'Bold editorial compositions, brand identities, and brutalist typographic posters.'
  },
  {
    'id': 'photography',
    'title': 'PHOTOGRAPHY',
    'coverIcon': '/icons/PHOTOGRAPHY.png',
    'artist': 'Basil Jose',
    'tagline': 'Chiaroscuro studio captures, natural twilight portraits, and documentary frames.'
  },
  {
    'id': 'videography',
    'title': 'VIDEOGRAPHY',
    'coverIcon': '/icons/VIDEOGRAPHY.png',
    'artist': 'Basil Jose',
    'tagline': 'Cinematography reels, color-graded narratives, and rhythmic visual essays.'
  }
]

IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'}
VIDEO_EXTS = {'.mp4', '.webm', '.mov', '.m4v'}

def format_title(slug):
    slug = re.sub(r'^[0-9]+[_\-\s]+', '', slug)
    words = re.split(r'[_\-\s]+', slug)
    return ' '.join(w.capitalize() for w in words if w)

def sync():
    print(f"Scanning {projects_src} for uploaded projects...")
    updated_categories = []

    for cat_meta in CATEGORIES_META:
        cat_id = cat_meta['id']
        cat_dir = os.path.join(projects_src, cat_id)
        pub_cat_dir = os.path.join(public_dest, cat_id)
        os.makedirs(pub_cat_dir, exist_ok=True)

        cat_projects = []

        if os.path.exists(cat_dir):
            entries = sorted(os.listdir(cat_dir))
            for entry in entries:
                if entry.startswith('.') or entry == 'README.md':
                    continue
                entry_path = os.path.join(cat_dir, entry)

                if os.path.isdir(entry_path):
                    proj_id = entry.lower().replace(' ', '-')
                    proj_title = format_title(entry)
                    pub_proj_dir = os.path.join(pub_cat_dir, proj_id)
                    os.makedirs(pub_proj_dir, exist_ok=True)

                    media_items = []
                    subfiles = sorted(os.listdir(entry_path))
                    
                    # Deduplicate: if both name.webp and name.png exist, prefer .webp
                    base_names = {}
                    for sf in subfiles:
                        if sf.startswith('.'):
                            continue
                        name, ext = os.path.splitext(sf)
                        ext_lower = ext.lower()
                        if ext_lower in IMAGE_EXTS or ext_lower in VIDEO_EXTS:
                            if name not in base_names or ext_lower == '.webp':
                                base_names[name] = sf

                    for name, sf in sorted(base_names.items(), key=lambda x: x[1]):
                        _, ext = os.path.splitext(sf.lower())
                        src_file = os.path.join(entry_path, sf)
                        dst_file = os.path.join(pub_proj_dir, sf)
                        try:
                            shutil.copy2(src_file, dst_file)
                        except Exception as e:
                            pass

                        web_path = f"/projects/{cat_id}/{proj_id}/{sf}"
                        if ext in IMAGE_EXTS:
                            media_items.append({
                                'title': format_title(os.path.splitext(sf)[0]),
                                'caption': format_title(os.path.splitext(sf)[0]),
                                'type': 'image',
                                'src': web_path
                            })
                        elif ext in VIDEO_EXTS:
                            media_items.append({
                                'title': format_title(os.path.splitext(sf)[0]),
                                'caption': format_title(os.path.splitext(sf)[0]),
                                'type': 'video',
                                'src': web_path
                            })

                    if media_items:
                        first_img = next((m['src'] for m in media_items if m['type'] == 'image'), media_items[0]['src'])
                        first_video = next((m['src'] for m in media_items if m['type'] == 'video'), None)

                        cat_projects.append({
                            'id': proj_id,
                            'title': proj_title,
                            'client': 'Basil Jose',
                            'role': cat_meta['title'],
                            'description': f"{proj_title} showcase collection.",
                            'thumbnail': first_img,
                            'videoSrc': first_video or '',
                            'dateStamp': '2026',
                            'media': media_items
                        })

                elif os.path.isfile(entry_path):
                    name, ext = os.path.splitext(entry)
                    ext = ext.lower()
                    if ext in IMAGE_EXTS or ext in VIDEO_EXTS:
                        proj_id = name.lower().replace(' ', '-')
                        proj_title = format_title(name)
                        dst_file = os.path.join(pub_cat_dir, entry)
                        try:
                            shutil.copy2(entry_path, dst_file)
                        except Exception as e:
                            pass
                        web_path = f"/projects/{cat_id}/{entry}"

                        is_video = ext in VIDEO_EXTS
                        media_items = [{
                            'title': proj_title,
                            'caption': proj_title,
                            'type': 'video' if is_video else 'image',
                            'src': web_path
                        }]

                        cat_projects.append({
                            'id': proj_id,
                            'title': proj_title,
                            'client': 'Basil Jose',
                            'role': cat_meta['title'],
                            'description': f"{proj_title} project.",
                            'thumbnail': '/frames/web00.webp' if is_video else web_path,
                            'videoSrc': web_path if is_video else '',
                            'dateStamp': '2026',
                            'media': media_items
                        })

        cat_entry = dict(cat_meta)
        cat_entry['projects'] = cat_projects
        updated_categories.append(cat_entry)
        print(f"[{cat_id}] found {len(cat_projects)} projects.")

    categories_js_path = os.path.join(portfolio_dir, "src", "data", "categories.js")
    categories_json_str = json.dumps(updated_categories, indent=2)
    js_code = f"""// Auto-generated by scripts/sync_projects.py
export const CATEGORIES = {categories_json_str};

export function getCategoryById(id) {{
  return CATEGORIES.find(cat => cat.id === id) || null;
}}

export function getProjectById(categoryId, projectId) {{
  const category = getCategoryById(categoryId);
  if (!category || !category.projects) return null;
  return category.projects.find(p => p.id === projectId) || null;
}}
"""
    with open(categories_js_path, "w", encoding="utf-8") as f:
        f.write(js_code)
    print("Successfully synced all projects and updated src/data/categories.js!")

if __name__ == '__main__':
    sync()
