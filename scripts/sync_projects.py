import os
import json
import re
import shutil
import subprocess

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

def get_ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return 'ffmpeg'

FFMPEG_BIN = get_ffmpeg()

def format_title(slug):
    slug = re.sub(r'^[0-9]+[_\-\s]+', '', slug)
    words = re.split(r'[_\-\s]+', slug)
    return ' '.join(w.capitalize() for w in words if w)

def extract_video_thumbnail(video_path, thumb_path):
    if os.path.exists(thumb_path) and os.path.getsize(thumb_path) > 0:
        return True
    try:
        cmd = [FFMPEG_BIN, '-y', '-ss', '1', '-i', video_path, '-vframes', '1', '-q:v', '2', thumb_path]
        res = subprocess.run(cmd, capture_output=True)
        if res.returncode == 0 and os.path.exists(thumb_path) and os.path.getsize(thumb_path) > 0:
            return True
    except Exception as e:
        print(f"FFmpeg thumbnail error: {e}")
    try:
        import cv2
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 24
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(fps * 1))
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
        if ret:
            cv2.imwrite(thumb_path, frame)
            cap.release()
            return True
        cap.release()
    except Exception as e:
        print(f"OpenCV fallback error: {e}")
    return False

def optimize_video_for_web(src_path, dst_path):
    if os.path.exists(dst_path) and os.path.getsize(dst_path) > 0:
        return True
    file_size_mb = os.path.getsize(src_path) / (1024 * 1024)
    # If already .mp4 and under 80MB, fast direct copy
    if file_size_mb <= 80 and src_path.lower().endswith('.mp4'):
        shutil.copy2(src_path, dst_path)
        return True

    # If .mov under 80MB, remux losslessly to .mp4
    if file_size_mb <= 80 and src_path.lower().endswith('.mov'):
        try:
            cmd = [FFMPEG_BIN, '-y', '-i', src_path, '-c:v', 'copy', '-c:a', 'copy', '-movflags', '+faststart', dst_path]
            res = subprocess.run(cmd, capture_output=True)
            if res.returncode == 0 and os.path.exists(dst_path) and os.path.getsize(dst_path) > 0:
                return True
        except Exception as e:
            print(f"Remux error: {e}")

    # For videos > 80MB, optimize with H.264 CRF 22 for fast streaming
    print(f"  Web-optimizing large video ({file_size_mb:.1f} MB): {os.path.basename(src_path)}...")
    try:
        cmd = [
            FFMPEG_BIN, '-y', '-i', src_path,
            '-c:v', 'libx264', '-crf', '22', '-preset', 'fast',
            '-c:a', 'aac', '-b:a', '128k',
            '-movflags', '+faststart',
            dst_path
        ]
        res = subprocess.run(cmd, capture_output=True)
        if res.returncode == 0 and os.path.exists(dst_path) and os.path.getsize(dst_path) > 0:
            new_mb = os.path.getsize(dst_path) / (1024 * 1024)
            print(f"  Optimized to {new_mb:.1f} MB ({((1 - new_mb/file_size_mb)*100):.0f}% smaller)")
            return True
    except Exception as e:
        print(f"Compression error: {e}")

    shutil.copy2(src_path, dst_path)
    return True

def sync():
    print(f"Scanning {projects_src} for updated projects...")
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
                        if sf.startswith('.') or sf.endswith('-thumb.webp') or sf.endswith('-thumb.jpg'):
                            continue
                        name, ext = os.path.splitext(sf)
                        ext_lower = ext.lower()
                        if ext_lower in IMAGE_EXTS or ext_lower in VIDEO_EXTS:
                            if name not in base_names or ext_lower in ('.webp', '.mp4'):
                                base_names[name] = sf

                    for name, sf in sorted(base_names.items(), key=lambda x: x[1]):
                        _, ext = os.path.splitext(sf.lower())
                        src_file = os.path.join(entry_path, sf)
                        
                        if ext in IMAGE_EXTS:
                            dst_file = os.path.join(pub_proj_dir, sf)
                            try:
                                shutil.copy2(src_file, dst_file)
                            except Exception:
                                pass
                            web_path = f"/projects/{cat_id}/{proj_id}/{sf}"
                            media_items.append({
                                'title': format_title(os.path.splitext(sf)[0]),
                                'caption': format_title(os.path.splitext(sf)[0]),
                                'type': 'image',
                                'src': web_path
                            })
                        elif ext in VIDEO_EXTS:
                            # Remux or optimize to .mp4
                            out_name = f"{name}.mp4"
                            dst_file = os.path.join(pub_proj_dir, out_name)
                            optimize_video_for_web(src_file, dst_file)
                            
                            # Generate video poster thumbnail
                            thumb_name = f"{name}-thumb.webp"
                            thumb_dst = os.path.join(pub_proj_dir, thumb_name)
                            extract_video_thumbnail(src_file, thumb_dst)
                            
                            web_path = f"/projects/{cat_id}/{proj_id}/{out_name}"
                            web_thumb = f"/projects/{cat_id}/{proj_id}/{thumb_name}" if os.path.exists(thumb_dst) else ""
                            
                            media_items.append({
                                'title': format_title(name),
                                'caption': format_title(name),
                                'type': 'video',
                                'src': web_path,
                                'poster': web_thumb
                            })

                    if media_items:
                        first_img = next((m['src'] for m in media_items if m['type'] == 'image'), None)
                        first_video = next((m for m in media_items if m['type'] == 'video'), None)

                        # Determine primary thumbnail (real image or video poster)
                        primary_thumb = first_img
                        if not primary_thumb and first_video:
                            primary_thumb = first_video.get('poster') or '/frames/web00.webp?v=20261104'

                        cat_projects.append({
                            'id': proj_id,
                            'title': proj_title,
                            'client': 'Basil Jose',
                            'role': cat_meta['title'],
                            'description': f"{proj_title} collection.",
                            'thumbnail': primary_thumb or '/frames/web00.webp?v=20261104',
                            'videoSrc': first_video['src'] if first_video else '',
                            'dateStamp': '2026',
                            'media': media_items
                        })

                elif os.path.isfile(entry_path):
                    name, ext = os.path.splitext(entry)
                    ext = ext.lower()
                    if ext in IMAGE_EXTS or ext in VIDEO_EXTS:
                        proj_id = name.lower().replace(' ', '-')
                        proj_title = format_title(name)
                        
                        if ext in IMAGE_EXTS:
                            dst_file = os.path.join(pub_cat_dir, entry)
                            try:
                                shutil.copy2(entry_path, dst_file)
                            except Exception:
                                pass
                            web_path = f"/projects/{cat_id}/{entry}"
                            media_items = [{
                                'title': proj_title,
                                'caption': proj_title,
                                'type': 'image',
                                'src': web_path
                            }]
                            cat_projects.append({
                                'id': proj_id,
                                'title': proj_title,
                                'client': 'Basil Jose',
                                'role': cat_meta['title'],
                                'description': f"{proj_title} project.",
                                'thumbnail': web_path,
                                'videoSrc': '',
                                'dateStamp': '2026',
                                'media': media_items
                            })
                        elif ext in VIDEO_EXTS:
                            out_name = f"{name}.mp4"
                            dst_file = os.path.join(pub_cat_dir, out_name)
                            optimize_video_for_web(entry_path, dst_file)
                            
                            thumb_name = f"{name}-thumb.webp"
                            thumb_dst = os.path.join(pub_cat_dir, thumb_name)
                            extract_video_thumbnail(entry_path, thumb_dst)
                            
                            web_path = f"/projects/{cat_id}/{out_name}"
                            web_thumb = f"/projects/{cat_id}/{thumb_name}" if os.path.exists(thumb_dst) else '/frames/web00.webp?v=20261104'
                            
                            media_items = [{
                                'title': proj_title,
                                'caption': proj_title,
                                'type': 'video',
                                'src': web_path,
                                'poster': web_thumb
                            }]
                            cat_projects.append({
                                'id': proj_id,
                                'title': proj_title,
                                'client': 'Basil Jose',
                                'role': cat_meta['title'],
                                'description': f"{proj_title} project.",
                                'thumbnail': web_thumb,
                                'videoSrc': web_path,
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
