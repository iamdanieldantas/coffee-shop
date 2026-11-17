"""Browser regression for coffee-house navigation, carousel, logo, and checkout demo."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def assert_page(page, expected):
    assert page.locator(f'#{expected}').is_visible(), f'{expected} must be visible'
    assert page.locator('.screen.active').count() == 1, 'Exactly one active screen'
    assert page.locator('nav .nav-btn.active').count() == 1, 'Exactly one active nav item'
    assert page.locator('nav [aria-current="page"]').count() == 1
    assert page.locator('nav [aria-current="page"]').get_attribute('data-go') == expected
    visible = page.locator('.screen').evaluate_all(
        "els => els.filter(el => getComputedStyle(el).display !== 'none').length"
    )
    assert visible == 1, f'Expected one visible screen; found {visible}'

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
try:
    with sync_playwright() as playwright:
        for width, height in ((390, 844), (1365, 900)):
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': width, 'height': height})
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            response = page.goto(f'http://127.0.0.1:{server.server_port}/', wait_until='load')
            assert response.status == 200
            assert_page(page, 'home')

            # The approved icon is shared on each screen and loads without remote URLs.
            assert page.locator('.brand-symbol').count() == 3
            assert page.locator('.brand-symbol').evaluate_all(
                "els => els.every(el => el.complete && el.naturalWidth > 0)"
            )

            # Three actual photographs, with functional controls rather than decorative dots.
            assert page.locator('.hero-slide').count() == 3
            assert page.locator('.hero-slide').evaluate_all(
                "els => els.every(el => el.complete && el.naturalWidth > 0)"
            )
            assert page.locator('.hero-slide.is-active').count() == 1
            assert page.locator('.hero-dot.is-active').count() == 1
            page.locator('[data-carousel-index="1"]').click()
            assert page.locator('.hero-slide.is-active').get_attribute('alt') == 'Croissant artesanal dourado'
            page.locator('[data-carousel-index="2"]').click()
            assert page.locator('.hero-slide.is-active').get_attribute('alt') == 'Café com leite cremoso'

            # Regression for bug #1: CTA must change the visible screen, not only the nav.
            page.locator('#home [data-go="menu"]').click()
            assert_page(page, 'menu')
            assert page.locator('#menu .product').count() >= 3
            assert page.locator('#menu .product img').evaluate_all(
                "els => els.every(el => el.complete && el.naturalWidth > 0)"
            )
            page.locator('nav [data-go="pedidos"]').click()
            assert_page(page, 'pedidos')
            page.locator('#pedidos [data-go="menu"]').click()
            assert_page(page, 'menu')
            # Regression: one synchronized - quantity + stepper across all screens.
            menu_slot = page.locator('#menu [data-qty-slot="latte"]')
            home_slot = page.locator('#home [data-qty-slot="latte"]')
            assert menu_slot.locator('.round-add').is_visible()
            assert menu_slot.locator('.qty-picker').is_hidden()
            page.locator('#menu [data-add="latte"]').first.click()
            assert menu_slot.locator('output').inner_text() == '1'
            assert home_slot.locator('output').inner_text() == '1'
            assert menu_slot.locator('.qty-picker').is_visible()
            assert menu_slot.locator('.round-add').is_hidden()
            menu_slot.locator('[data-diff="1"]').click()
            assert menu_slot.locator('output').inner_text() == '2'
            assert home_slot.locator('output').inner_text() == '2'
            assert page.locator('#cart-badge').inner_text() == '2'
            page.locator('nav [data-go="home"]').click()
            assert_page(page, 'home')
            home_slot.locator('[data-diff="1"]').click()
            assert home_slot.locator('output').inner_text() == '3'
            assert menu_slot.locator('output').inner_text() == '3'
            home_slot.locator('[data-diff="-1"]').click()
            assert home_slot.locator('output').inner_text() == '2'
            assert menu_slot.locator('output').inner_text() == '2'
            page.locator('nav [data-go="pedidos"]').click()
            assert_page(page, 'pedidos')
            assert page.locator('#order-list .order-row').count() == 1
            assert page.locator('#order-list .quantity span').inner_text() == '2'
            page.locator('#order-list [data-change="latte"][data-diff="1"]').click()
            assert menu_slot.locator('output').inner_text() == '3'
            assert home_slot.locator('output').inner_text() == '3'
            assert page.locator('#order-list .quantity span').inner_text() == '3'
            assert 'R$' in page.locator('#order-summary').inner_text()
            page.locator('nav [data-go="menu"]').click()
            assert_page(page, 'menu')
            page.reload(wait_until='load')
            assert_page(page, 'menu')
            menu_slot = page.locator('#menu [data-qty-slot="latte"]')
            home_slot = page.locator('#home [data-qty-slot="latte"]')
            assert menu_slot.locator('output').inner_text() == '3'
            assert home_slot.locator('output').inner_text() == '3'
            for expected in ('2', '1'):
                menu_slot.locator('[data-diff="-1"]').click()
                assert menu_slot.locator('output').inner_text() == expected
                assert home_slot.locator('output').inner_text() == expected
            menu_slot.locator('[data-diff="-1"]').click()
            assert menu_slot.locator('.qty-picker').is_hidden()
            assert menu_slot.locator('.round-add').is_visible()
            assert home_slot.locator('.round-add').get_attribute('hidden') is None
            assert page.locator('#cart-badge').is_hidden()
            page.locator('nav [data-go="home"]').click()
            assert_page(page, 'home')
            home_slot.locator('[data-add="latte"]').click()
            assert home_slot.locator('output').inner_text() == '1'
            assert menu_slot.locator('output').inner_text() == '1'
            page.locator('nav [data-go="pedidos"]').click()
            assert_page(page, 'pedidos')
            assert page.locator('#order-list .quantity span').inner_text() == '1'
            page.locator('nav [data-go="home"]').click()
            assert_page(page, 'home')
            # The footer is shared across all routes. No guessed or broken URLs.
            footer = page.locator('footer.site-footer')
            assert footer.count() == 1
            assert footer.locator('.social-link').count() == 4
            assert footer.locator('.social-link.is-pending').count() == 4
            assert footer.locator('a.social-link').count() == 0
            for social in ('instagram','facebook','spotify','whatsapp'):
                assert footer.locator(f'[data-social="{social}"]').count() == 1
            for tab in ('home', 'menu', 'pedidos'):
                page.locator(f'nav [data-go="{tab}"]').click()
                assert_page(page, tab)
                page.evaluate("window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'})")
                assert footer.is_visible()
                assert footer.locator('.footer-social-grid').is_visible()
                # Content must remain above the fixed bottom navigation on iPhone.
                footer_end = footer.locator('.footer-bottom').bounding_box()
                nav_start = page.locator('nav.bottom-wrap').bounding_box()
                if width < 760:
                    assert footer_end['y'] + footer_end['height'] < nav_start['y']
                page.evaluate('window.scrollTo(0, 0)')
            # PT-BR is the default; language changes must not alter IDs, cart or navigation.
            assert page.locator('#site-language').input_value() == 'pt'
            assert page.locator('html').get_attribute('lang') == 'pt-BR'
            assert page.locator('#sobre-nos').count() == 1
            assert page.locator('#pedidos .quantity.qty-picker').count() == 1
            menu_qty_style = page.locator('#menu [data-qty-slot="latte"] .qty-picker button').first.evaluate(
                "el => ({width:getComputedStyle(el).width, height:getComputedStyle(el).height, icon:getComputedStyle(el.querySelector('svg')).width})"
            )
            order_qty_style = page.locator('#pedidos .quantity.qty-picker button').first.evaluate(
                "el => ({width:getComputedStyle(el).width, height:getComputedStyle(el).height, icon:getComputedStyle(el.querySelector('svg')).width})"
            )
            assert order_qty_style == menu_qty_style, (order_qty_style, menu_qty_style)
            assert page.locator('#pedidos .quantity span').inner_text() == '1'
            page.locator('#site-language').select_option('en')
            assert page.locator('html').get_attribute('lang') == 'en-US'
            assert page.locator('#pedidos .page-title').inner_text() == 'Orders'
            assert page.locator('#order-list h3').first.inner_text() == 'Classic Latte'
            assert page.locator('#pedidos .quantity span').inner_text() == '1'
            assert page.locator('nav [data-go="pedidos"] span[data-i18n="nav.orders"]').inner_text() == 'Orders'
            page.locator('nav [data-go="menu"]').click()
            assert_page(page, 'menu')
            assert page.locator('#menu .category').first.inner_text() == 'Drinks'
            assert page.locator('#menu [data-qty-slot="latte"] output').inner_text() == '1'
            assert page.locator('#menu .product h3').first.count() == 1
            assert page.locator('#menu').get_attribute('aria-label') == 'Menu page'
            page.locator('nav [data-go="home"]').click()
            assert_page(page, 'home')
            assert page.locator('#sobre-nos #about-heading').inner_text() == 'A little getaway in every cup.'
            assert page.locator('footer .footer-social-section h3').inner_text() == 'Stay in touch'
            assert page.locator('footer .social-meta').first.inner_text() == 'Coming soon'
            assert page.locator('#home .featured [data-qty-slot="latte"] output').inner_text() == '1'
            page.locator('#site-language').select_option('es')
            assert page.locator('html').get_attribute('lang') == 'es-AR'
            assert page.locator('#sobre-nos #about-heading').inner_text() == 'Una pausa con sabor a viaje.'
            assert page.locator('#home .home-text h1').inner_text().startswith('Café, medialunas')
            assert page.locator('nav [data-go="home"] span[data-i18n="nav.home"]').inner_text() == 'Inicio'
            page.locator('nav [data-go="pedidos"]').click()
            assert_page(page, 'pedidos')
            assert page.locator('#order-list h3').first.inner_text() == 'Latte clásico'
            assert page.locator('#pedidos .quantity span').inner_text() == '1'
            page.locator('#coupon-trigger').click()
            page.locator('#coupon-input').fill('CAFE10')
            page.locator('#apply-coupon').click()
            assert 'Descuento (10%)' in page.locator('#order-summary').inner_text()
            assert page.locator('#cart-badge').inner_text() == '1'
            page.reload(wait_until='load')
            assert page.locator('#site-language').input_value() == 'es'
            assert page.locator('html').get_attribute('lang') == 'es-AR'
            assert_page(page, 'pedidos')
            assert page.locator('#pedidos .quantity span').inner_text() == '1'
            assert page.locator('#order-list h3').first.inner_text() == 'Latte clásico'
            page.locator('#site-language').select_option('pt')
            assert page.locator('html').get_attribute('lang') == 'pt-BR'
            assert page.locator('#order-list h3').first.inner_text() == 'Latte Clássico'
            assert page.locator('#pedidos .quantity span').inner_text() == '1'
            assert not errors, errors
            print(f'OK browser {width}x{height}: PT/EN/ES translation, About Us, matching quantity icons, persistence, navigation, coupon, cart and footer', flush=True)
            context.close()
            browser.close()

        # Configured channels become safe real links, never implicit generic homepages.
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()
        page.add_init_script("""window.COFFEE_SOCIAL_LINKS = {
            instagram: 'https://www.instagram.com/coffeehouse_example/',
            facebook: 'https://www.facebook.com/coffeehouse-example/',
            spotify: 'https://open.spotify.com/playlist/1ab234',
            whatsapp: 'https://wa.me/5511999999999'
        };""")
        page.goto(f'http://127.0.0.1:{server.server_port}/', wait_until='load')
        links = page.locator('footer.site-footer a.social-link')
        assert links.count() == 4
        assert page.locator('footer.site-footer .is-pending').count() == 0
        for social in ('instagram','facebook','spotify','whatsapp'):
            link = page.locator(f'footer.site-footer a[data-social="{social}"]')
            assert link.count() == 1
            assert link.get_attribute('href').startswith('https://')
            assert link.get_attribute('target') == '_blank'
            assert 'noopener' in link.get_attribute('rel')
            assert 'noreferrer' in link.get_attribute('rel')
        print('OK configured social URLs open in a new tab with secure link attributes', flush=True)
        context.close()
        browser.close()

        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844}, java_script_enabled=False)
        page = context.new_page()
        page.goto(f'http://127.0.0.1:{server.server_port}/', wait_until='load')
        assert page.locator('#home [data-go="menu"]').get_attribute('href') == '#menu'
        page.locator('nav [data-go="menu"]').click()
        assert page.locator('#menu').is_visible()
        page.locator('nav [data-go="pedidos"]').click()
        assert page.locator('#pedidos').is_visible()
        print('OK native hash navigation without JavaScript', flush=True)
        context.close()
        browser.close()

        # Mocked Supabase API: shared totals and toggle, with no external credentials.
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()
        page.add_init_script("""window.COFFEE_LIKES_CONFIG = {
          supabaseUrl: 'https://coffee-ci.supabase.co',
          publishableKey: 'sb_publishable_test'
        };""")
        totals = {'latte': 2, 'croissant': 1}
        my_likes = set()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))

        def mock_supabase(route):
            request = route.request
            headers = {
                'access-control-allow-origin': '*',
                'access-control-allow-headers': 'apikey,authorization,content-type',
                'access-control-allow-methods': 'POST, OPTIONS'
            }
            if request.method == 'OPTIONS':
                route.fulfill(status=204, headers=headers)
                return
            path = request.url
            if path.endswith('/rpc/coffee_likes_snapshot'):
                assert request.headers.get('apikey') == 'sb_publishable_test'
                body = [{
                    'product_id': product,
                    'likes': totals.get(product, 0),
                    'liked': product in my_likes
                } for product in ('espresso','latte','cappuccino','coldbrew','croissant','crocafe','cookie','mocca','sanduiche')]
            elif path.endswith('/auth/v1/signup'):
                body = {'access_token':'mock_access_jwt','refresh_token':'mock_refresh','expires_in':3600}
            elif path.endswith('/rpc/coffee_toggle_like'):
                assert request.headers.get('authorization') == 'Bearer mock_access_jwt'
                product = request.post_data_json['p_product_id']
                if product in my_likes:
                    my_likes.remove(product)
                    totals[product] -= 1
                else:
                    my_likes.add(product)
                    totals[product] = totals.get(product, 0) + 1
                body = product in my_likes
            else:
                route.fulfill(status=404, headers=headers, body='{}')
                return
            route.fulfill(status=200, headers=headers, content_type='application/json', body=json.dumps(body))

        page.route('https://coffee-ci.supabase.co/**', mock_supabase)
        page.goto(f'http://127.0.0.1:{server.server_port}/', wait_until='load')
        page.wait_for_function('window.CoffeeLikes.available()')
        assert page.locator('#featured-heading').inner_text() == 'Mais curtidos da casa'
        assert page.locator('#home .featured .like-button').count() == 4
        page.locator('nav [data-go="menu"]').click()
        page.locator('#likes-status').wait_for(state='visible')
        assert 'compartilhados' in page.locator('#likes-status').inner_text()
        heart = page.locator('#menu [data-like="latte"]')
        assert heart.get_attribute('aria-pressed') == 'false'
        heart.click()
        page.wait_for_function('window.CoffeeLikes.count("latte") === 3')
        assert page.locator('#menu [data-like="latte"]').get_attribute('aria-pressed') == 'true'
        assert '3' in page.locator('#menu [data-like="latte"]').inner_text()
        page.locator('#menu [data-sort-likes]').click()
        assert page.locator('#menu [data-sort-likes]').get_attribute('aria-pressed') == 'true'
        page.locator('#menu [data-like="latte"]').click()
        page.wait_for_function('window.CoffeeLikes.count("latte") === 2')
        assert page.locator('#menu [data-like="latte"]').get_attribute('aria-pressed') == 'false'
        assert not errors, errors
        print('OK shared likes: aggregate counters, anonymous session, toggle and ranking', flush=True)
        context.close()
        browser.close()
finally:
    server.shutdown()
    server.server_close()
