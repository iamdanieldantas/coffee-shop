"""Browser regression for coffee-house navigation, carousel, logo, and checkout demo."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
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
            page.locator('#menu [data-add="latte"]').first.click()
            page.locator('nav [data-go="pedidos"]').click()
            assert_page(page, 'pedidos')
            assert page.locator('#order-list .order-row').count() == 1
            assert 'R$' in page.locator('#order-summary').inner_text()
            page.locator('nav [data-go="home"]').click()
            assert_page(page, 'home')
            assert not errors, errors
            print(f'OK browser {width}x{height}: nav CTAs, one active tab, carousel, photos, logo, cart', flush=True)
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
finally:
    server.shutdown()
    server.server_close()
