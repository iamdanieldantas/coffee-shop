"""V2 customer journeys: search, favorites, details, personalization, draft checkout."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
try:
    with sync_playwright() as pw:
        for width in (390,1365):
            browser=pw.chromium.launch(headless=True)
            context=browser.new_context(viewport={'width':width,'height':844})
            page=context.new_page()
            errors=[]
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.goto(f'http://127.0.0.1:{server.server_port}/',wait_until='load')
            page.locator('nav [data-go="menu"]').click()
            assert page.locator('#product-search').count()==1
            page.locator('#product-search').fill('croissant')
            assert page.locator('#menu .product').count()==2
            page.locator('#product-search').fill('')
            page.locator('#menu [data-category="bebidas"]').click()
            page.locator('#menu [data-detail="latte"]').click()
            assert page.locator('#experience-modal [role="dialog"]').is_visible()
            assert 'Latte Clássico' in page.locator('#experience-modal h2').inner_text()
            page.locator('#experience-modal [name="detail-size"][value="large"]').check()
            page.locator('#experience-modal [name="detail-milk"][value="oat"]').check()
            page.locator('#detail-add').click()
            assert page.locator('#experience-modal').is_hidden()
            page.locator('nav [data-go="pedidos"]').click()
            assert 'Grande' in page.locator('#order-list').inner_text()
            assert page.locator('#order-list .order-row').count()==1
            assert '23,90' in page.locator('#order-list').inner_text()
            page.locator('#checkout').click()
            assert page.locator('#experience-modal').is_visible()
            assert 'Revisar sacola' in page.locator('#experience-modal').inner_text()
            page.locator('#demo-next').click()
            assert 'Retirada' in page.locator('#experience-modal h2').inner_text()
            page.locator('#demo-next').click()
            assert 'Resumo do pedido' in page.locator('#experience-modal h2').inner_text()
            assert 'Nenhum pedido' in page.locator('#experience-modal').inner_text()
            assert page.locator('#experience-modal a[href*="wa.me"]').count()==0
            page.locator('[data-experience-close]').click()
            page.locator('nav [data-go="menu"]').click()
            page.locator('#product-sort').select_option('cheap')
            assert page.locator('#menu .product h3').first.inner_text()=='Espresso'
            page.locator('#menu [data-favorite="latte"]').click()
            page.locator('#favorites-filter').click()
            assert page.locator('#menu .product').count()==1
            assert page.locator('#menu .product h3').first.inner_text()=='Latte Clássico'
            page.reload(wait_until='load')
            page.locator('nav [data-go="menu"]').click()
            page.locator('#favorites-filter').click()
            assert page.locator('#menu .product').count()==1
            page.locator('#site-language').select_option('en')
            assert page.locator('#product-search').get_attribute('placeholder').startswith('Search')
            page.locator('#menu [data-detail="latte"]').click()
            assert page.locator('#experience-modal h2').inner_text()=='Classic Latte'
            page.locator('[data-experience-close]').click()
            assert not errors,errors
            print(f'OK V2 {width}px: search, favorites, details, customizations, checkout, language',flush=True)
            context.close();browser.close()
finally:
    server.shutdown();server.server_close()
