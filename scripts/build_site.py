"""Assemble a static site for GitHub Pages."""
from pathlib import Path
import argparse,shutil
p=argparse.ArgumentParser();p.add_argument('--out',default='_site');args=p.parse_args()
root=Path(__file__).resolve().parents[1];dest=root/args.out
if dest.exists():shutil.rmtree(dest)
dest.mkdir(parents=True)
for filename in ('index.html','robots.txt','.nojekyll','sw.js','manifest.webmanifest','admin.html'):shutil.copy2(root/filename,dest/filename)
shutil.copytree(root/'assets',dest/'assets')
assert (dest/'index.html').exists() and (dest/'assets/app.js').exists() and (dest/'sw.js').exists() and (dest/'manifest.webmanifest').exists()
print('Site built:',dest)
