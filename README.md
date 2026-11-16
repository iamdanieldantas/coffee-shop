# Coffee House ☕

Protótipo público de cafeteria e bakery, independente do Dantas Cozinha. Nome provisório. O visual aprovado tem logo croissant + copo, Home / Menu / Pedidos, cards em creme e barra inferior flutuante.

## Arquitetura

- `index.html` — estrutura semântica da interface.
- `assets/styles.css` — layout responsivo e design system.
- `assets/app.js` — catálogo, navegação, imagens **embutidas**, carrinho e cupom demonstrativo.
- `tests/` — contratos e smoke tests Playwright (celular e desktop).
- `harness/runner.py` — bloqueia publicação se algum teste falhar.
- `.github/workflows/validate.yml` — qualidade em PRs.
- `.github/workflows/site.yml` — release em main, Pages e verificação da URL.

## Desenvolvimento

```bash
python -m http.server 8000
python -m harness.runner --mode review --browser
```

## Publicação

GitHub Pages → Settings → Pages → Build and deployment → **Source: GitHub Actions**.
A publicação fica em https://iamdanieldantas.github.io/coffee-shop/ somente após o workflow terminar e Pages estar habilitado.

## Avisos

Preços ilustrativos. O checkout é **simulação**, sem pagamentos ou envio real. A sacola fica no navegador; o site não tem backend nem login. Imagens incorporadas ao próprio código garantem que não dependam de links externos. Para futuras alterações, abrir branch e PR, validar e somente depois integrar.
