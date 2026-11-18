"""PWA smoke: install service worker, cache local assets, browse offline safely."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True)
  context=browser.new_context(viewport={'width':390,'height':844},service_workers='allow')
  page=context.new_page()
  origin=f'http://127.0.0.1:{server.server_port}'
  errors=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto(origin+'/',wait_until='load')
  page.wait_for_function('navigator.serviceWorker && navigator.serviceWorker.controller',timeout=20000)
  assert page.locator('link[rel="manifest"]').count()==1
  assert page.locator('#home .featured').count()==4
  context.set_offline(True)
  page.goto(origin+'/',wait_until='load')
  assert page.locator('html').get_attribute('lang')=='pt-BR'
  page.locator('nav [data-go="menu"]').click()
  assert page.locator('#menu .product').count()>0
  page.locator('#menu .product img').first.wait_for(state='visible')
  assert page.locator('#menu .product img').first.evaluate('el=>el.complete && el.naturalWidth>0')
  assert not errors,errors
  print('OK offline PWA: cache navigation, JS/CSS, products, images, locale default',flush=True)
  context.close();browser.close()
finally:
 server.shutdown();server.server_close()
