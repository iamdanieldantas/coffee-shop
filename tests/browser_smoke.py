"""Playwright smoke: nav, product photos, cart, and JS errors in mobile + desktop."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as playwright:
  for width,height in ((390,844),(1365,900)):
   browser=playwright.chromium.launch(headless=True)
   context=browser.new_context(viewport={'width':width,'height':height})
   page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
   response=page.goto(f'http://127.0.0.1:{srv.server_port}/',wait_until='load')
   assert response.status==200
   assert page.locator('#home').is_visible()
   assert page.locator('.brand-symbol').first.is_visible()
   assert page.locator('nav [data-go]').count()==3
   page.locator('nav [data-go="menu"]').click()
   assert page.locator('#menu').is_visible()
   assert page.locator('#menu .product').count()>=3
   assert page.locator('#menu .product img').evaluate_all('(xs)=>xs.every(x=>x.complete&&x.naturalWidth>0)')
   page.locator('#menu [data-add="latte"]').first.click()
   page.locator('nav [data-go="pedidos"]').click()
   assert page.locator('#pedidos').is_visible()
   assert page.locator('#order-list .order-row').count()==1
   assert 'R$' in page.locator('#order-summary').inner_text()
   page.locator('nav [data-go="home"]').click()
   assert page.locator('#home').is_visible()
   assert not errors,errors
   print(f'OK browser {width}x{height}',flush=True)
   context.close();browser.close()
  browser=playwright.chromium.launch(headless=True)
  context=browser.new_context(viewport={'width':390,'height':844},java_script_enabled=False)
  page=context.new_page();page.goto(f'http://127.0.0.1:{srv.server_port}/')
  page.locator('nav [data-go="menu"]').click();assert page.locator('#menu').is_visible()
  page.locator('nav [data-go="pedidos"]').click();assert page.locator('#pedidos').is_visible()
  print('OK native hash links without JS')
  browser.close()
finally:
 srv.shutdown();srv.server_close()
