"""Read-only public REST check for the V2 Supabase catalog (no admin credentials)."""
import json,re,urllib.request,urllib.error
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=(root/'assets/likes-config.js').read_text()
def val(name):
 m=re.search(name+r"\s*:\s*'([^']+)'",source)
 assert m,"Missing public config "+name
 return m.group(1)
url=val('supabaseUrl').rstrip('/')
key=val('publishableKey')
assert key.startswith('sb_publishable_')
req=urllib.request.Request(url+'/rest/v1/coffee_catalog?select=product_id,name_pt,name_en,name_es,price_cents,active&active=eq.true',
 headers={'apikey':key,'accept':'application/json'})
try:
 with urllib.request.urlopen(req,timeout=20) as res: rows=json.load(res)
except urllib.error.HTTPError as ex:
 raise SystemExit('Public catalog HTTP '+str(ex.code)) from None
assert isinstance(rows,list)
ids={r.get('product_id') for r in rows}
original={'espresso','latte','cappuccino','coldbrew','croissant','crocafe','cookie','mocca','sanduiche'}
assert original.issubset(ids),'Initial products missing'
assert all(isinstance(r.get('price_cents'),int) and r['price_cents']>0 for r in rows)
assert all(r.get('active') is True and r.get('name_pt') for r in rows)
assert all('user_id' not in r and 'password' not in r for r in rows)
print(f'OK public Supabase catalog: {len(rows)} active products; no sensitive data')
