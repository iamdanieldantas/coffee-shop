"""Contract checks for approved Coffee House v4 bootstrap."""
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text()
CSS=(ROOT/'assets/styles.css').read_text()
JS=(ROOT/'assets/app.js').read_text()
class SiteContract(unittest.TestCase):
 def test_core_screens(self):
  for value in ('id="home"','id="menu"','id="pedidos"','data-go="home"','data-go="menu"','data-go="pedidos"'):self.assertIn(value,HTML)
 def test_navigation(self):
  self.assertIn('function nav(page,updateHistory=true)',JS)
  self.assertIn('function renderMenu()',JS)
  self.assertIn('function renderOrders()',JS)
 def test_regression_navigation_and_carousel(self):
  self.assertIn('href="#menu" data-go="menu"',HTML)
  self.assertIn('href="#menu" data-go="menu">Explorar o menu',JS)
  self.assertIn("e.preventDefault();nav(go.dataset.go)",JS)
  self.assertIn("classList.add('js-ready')",JS)
  self.assertEqual(HTML.count('data-carousel-index="'),3)
  self.assertIn('function setCarouselSlide(index)',JS)
  self.assertIn('function syncCarouselPlayback()',JS)
  self.assertIn('html:not(.js-ready)',CSS)
 def test_images_embedded(self):
  self.assertGreaterEqual((HTML+JS+CSS).count('data:image/webp;base64,'),8)
  self.assertNotIn('images.unsplash.com',HTML+JS+CSS)
 def test_logo_and_mobile_bar(self):
  self.assertIn('brand-symbol',HTML)
  self.assertIn('Croissant e copo de café',HTML)
  self.assertIn('bottom-wrap',HTML)
 def test_approved_logo(self):
  import xml.etree.ElementTree as ET
  logo=ROOT/'assets/logo-approved.svg'
  self.assertTrue(logo.is_file())
  svg=ET.parse(logo).getroot()
  self.assertEqual(svg.attrib['viewBox'],'150 60 900 1170')
  self.assertEqual(HTML.count('src="assets/logo-approved.svg"'),3)
  self.assertIn('object-fit:contain',CSS)
 def test_assets(self):
  self.assertTrue((ROOT/'assets/app.js').is_file())
  self.assertTrue((ROOT/'assets/styles.css').is_file())
  self.assertIn('assets/app.js',HTML)
  self.assertIn('assets/styles.css',HTML)
if __name__=='__main__':unittest.main()
