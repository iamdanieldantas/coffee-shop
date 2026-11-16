"""Check the published GitHub Pages URL and its assets with propagation retries."""
import argparse,time,urllib.request,urllib.error
p=argparse.ArgumentParser();p.add_argument('--url',required=True);url=p.parse_args().url.rstrip('/')+'/'
for attempt in range(1,9):
 try:
  for path,needle in (('',b'Coffee House'),('assets/styles.css',b'--forest'),('assets/app.js',b'renderMenu')):
   with urllib.request.urlopen(url+path,timeout=20) as res:
    data=res.read()
    assert res.status==200 and needle in data,(path,res.status)
  print('Verified:',url);break
 except Exception as exc:
  print('Retry',attempt,'/',8,exc,flush=True)
  if attempt==8:raise
  time.sleep(12)
