"""Brand story, localized ingredient examples, modal keyboard focus, and quantity regression."""
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
  for width in (390,1365):
   browser=pw.chromium.launch(headless=True)
   context=browser.new_context(viewport={'width':width,'height':844})
   page=context.new_page()
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('https://jasnepwcihsuvelwcmvu.supabase.co/**',lambda route:route.abort())
   page.goto(f'http://127.0.0.1:{server.server_port}/',wait_until='load')
   assert page.locator('.inspiration-city').count()==3
   assert page.locator('#inspiration-heading').inner_text()=='Três cidades, uma paixão por café.'
   assert 'não representam endereços' in page.locator('.inspiration-caption').inner_text()
   page.locator('.skip-link').focus()
   page.locator('.skip-link').press('Enter')
   assert page.locator('#home h1').evaluate('el=>document.activeElement===el')
   page.locator('nav [data-go="menu"]').click()
   page.locator('.skip-link').focus()
   page.locator('.skip-link').press('Enter')
   assert page.locator('#menu h1').evaluate('el=>document.activeElement===el')
   assert page.locator('#menu').is_visible()
   page.locator('#menu [data-category="bebidas"]').click()
   detail=page.locator('#menu [data-detail="latte"]')
   detail.click()
   assert page.locator('#experience-modal [role="dialog"]').get_attribute('aria-labelledby')=='experience-heading'
   assert page.locator('.detail-ingredients li').count()==2
   assert 'Ingredientes apenas indicativos' in page.locator('.detail-disclaimer').inner_text()
   assert page.locator('#detail-count').inner_text()=='1'
   assert page.locator('#detail-minus').is_disabled()
   # Focus wraps inside the modal, and the original product button regains focus.
   page.locator('[data-experience-close]').focus()
   page.keyboard.press('Shift+Tab')
   assert page.locator('#detail-add').evaluate('el=>document.activeElement===el')
   page.keyboard.press('Tab')
   assert page.locator('[data-experience-close]').evaluate('el=>document.activeElement===el')
   page.locator('[name="detail-size"][value="large"]').check()
   assert page.locator('[name="detail-size"][value="large"]').evaluate('el=>document.activeElement===el')
   page.locator('[name="detail-milk"][value="oat"]').check()
   page.locator('#detail-plus').click()
   page.locator('#detail-plus').click()
   assert page.locator('#detail-count').inner_text()=='3'
   assert '71,70' in page.locator('#detail-add').inner_text()
   page.keyboard.press('Escape')
   assert page.locator('#experience-modal').is_hidden()
   assert detail.evaluate('el=>document.activeElement===el')
   detail.click()
   page.locator('[name="detail-size"][value="large"]').check()
   page.locator('[name="detail-milk"][value="oat"]').check()
   page.locator('#detail-plus').click()
   page.locator('#detail-plus').click()
   page.locator('#detail-add').click()
   page.locator('nav [data-go="pedidos"]').click()
   assert page.locator('#order-list .quantity span').inner_text()=='3'
   assert '71,70' in page.locator('#order-summary').inner_text()
   page.locator('nav [data-go="home"]').click()
   page.locator('#site-language').select_option('en')
   assert page.locator('#inspiration-heading').inner_text()=='Three cities, one love of coffee.'
   assert 'not store locations' in page.locator('.inspiration-caption').inner_text()
   page.locator('#site-language').select_option('es')
   assert page.locator('#inspiration-heading').inner_text()=='Tres ciudades, una pasión por el café.'
   assert page.locator('.skip-link').inner_text()=='Ir al contenido'
   page.reload(wait_until='load')
   assert page.locator('#site-language').input_value()=='es'
   assert page.locator('.inspiration-city').count()==3
   assert not errors,errors
   print(f'OK polish {width}px: city story, locale, ingredients, qty, focus trap, skip navigation, cart',flush=True)
   context.close()
   browser.close()
finally:
 server.shutdown();server.server_close()
