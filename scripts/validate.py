"""Validate rendered Jekyll output: routes, assets, fragments and confidentiality."""
from pathlib import Path
from urllib.parse import urlsplit,unquote
from bs4 import BeautifulSoup
import sys
root=Path(sys.argv[1]); errors=[]
assert (root/'index.html').is_file(), 'Missing generated homepage'
for path in ['cbct','pos-tagging','ppm','edumeter']:
 assert (root/f'projects/{path}.html').is_file(), path
home=BeautifulSoup((root/'index.html').read_text(),'html.parser')
assert len(home.select('.project-card'))==4, 'Expected exactly four project cards'
for file in root.rglob('*.html'):
 text=file.read_text(); soup=BeautifulSoup(text,'html.parser')
 if 'imaginalis' in text.lower():errors.append(f'Confidential reference: {file}')
 for tag in soup.select('[href], [src]'):
  href=tag.get('href',tag.get('src',''));u=urlsplit(href)
  if u.scheme or u.netloc:continue
  target=root/unquote(u.path).lstrip('/') if u.path.startswith('/') else file.parent/unquote(u.path)
  if not u.path:target=file
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{file}: missing {href}');continue
  if u.fragment and target.suffix=='.html':
   dest=BeautifulSoup(target.read_text(),'html.parser')
   if not dest.find(id=unquote(u.fragment)):errors.append(f'{file}: missing fragment {href}')
print('\n'.join(errors) if errors else 'PASS: homepage, four projects, all local assets/links/fragments and confidentiality')
raise SystemExit(bool(errors))
