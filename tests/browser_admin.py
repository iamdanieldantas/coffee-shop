"""Secure V2 admin and loyalty smoke without writing to real Supabase."""
import json
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True)
  context=browser.new_context(viewport={'width':390,'height':844})
  page=context.new_page()
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  base=f'http://127.0.0.1:{server.server_port}'
  page.goto(base+'/admin.html',wait_until='load')
  assert page.locator('meta[name="robots"]').get_attribute('content')=='noindex,nofollow'
  assert page.locator('#admin-login').is_visible()
  assert page.locator('#admin-workspace').is_hidden()
  assert page.locator('#admin-status').is_visible()
  assert page.locator('input[type="password"]').count()==1

  def row(id,pt,en,es,price,photo):
   return {'product_id':id,'name_pt':pt,'name_en':en,'name_es':es,
    'desc_pt':'Descrição do produto','desc_en':'Product description','desc_es':'Descripción del producto',
    'price_cents':price,'image_key':photo,'category':'bebidas','active':True}
  catalog=[row('espresso','Espresso','Espresso','Espresso',990,'espresso'),
           row('latte','Latte novo','New Latte','Latte nuevo',1850,'latte'),
           row('tea','Chá especial','Special Tea','Té especial',1450,'latte')]
  def mock(route):
   headers={'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'apikey,authorization,content-type'}
   if route.request.method=='OPTIONS':
    route.fulfill(status=204,headers=headers);return
   if '/coffee_catalog?' in route.request.url:
    route.fulfill(status=200,headers=headers,body=json.dumps(catalog),content_type='application/json')
   elif '/coffee_likes_snapshot' in route.request.url:
    route.fulfill(status=200,headers=headers,body=json.dumps([{'product_id':x['product_id'],'likes':0,'liked':False} for x in catalog]),content_type='application/json')
   else:
    route.fulfill(status=404,headers=headers,body='{}',content_type='application/json')
  page.route('https://jasnepwcihsuvelwcmvu.supabase.co/**',mock)
  page.goto(base+'/',wait_until='load')
  page.wait_for_function("window.CoffeeCatalog.status() === 'live'")
  page.locator('nav [data-go="menu"]').click()
  assert page.locator('#menu .product h3').count()==3
  assert page.locator('#menu .product h3').all_inner_texts().count('Latte novo')==1
  page.locator('#product-search').fill('chá')
  assert page.locator('#menu .product').count()==1
  assert 'Chá especial' in page.locator('#menu .product').inner_text()
  page.locator('#product-search').fill('')
  page.locator('#site-language').select_option('en')
  assert 'Special Tea' in page.locator('#menu').inner_text()
  page.locator('nav [data-go="home"]').click()
  assert page.locator('#loyalty-card .loyalty-stamps span.filled').count()==0
  page.locator('#loyalty-card [data-demo-stamp]').click()
  assert page.locator('#loyalty-card .loyalty-stamps span.filled').count()==1
  page.reload(wait_until='load')
  assert page.locator('#loyalty-card .loyalty-stamps span.filled').count()==1
  assert 'demo stamps' in page.locator('#loyalty-card').inner_text()
  page.locator('#loyalty-card [data-demo-reset]').click()
  assert page.locator('#loyalty-card .loyalty-stamps span.filled').count()==0
  assert not errors,errors
  print('OK admin login locked, live catalog mock, new products, locale, safe loyalty simulation')
  context.close();browser.close()
finally:
 server.shutdown();server.server_close()
