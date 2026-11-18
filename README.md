# Coffee House ☕ — Cafeteria & Bakery

Site mobile-first demonstrativo da Coffee House, independente do **Dantas Cozinha**. O nome ainda é provisório; a identidade usa verde-escuro, cobre e o logo aprovado de croissant + copo.

**Site:** https://iamdanieldantas.github.io/coffee-shop/

## Experiência do visitante

- **Home:** carrossel, produtos em destaque, seção Sobre nós, inspirações de Buenos Aires, New York e São Paulo e cartão de fidelidade **simulado**.
- **Menu:** categorias, pesquisa, ordenação, favoritos locais e curtidas compartilhadas via Supabase.
- **Produtos:** detalhes, exemplos de composição, personalização de bebidas (tamanho e leite) e escolha de quantidade.
- **Pedidos:** sacola sincronizada, cupom de demonstração e fluxo de revisão → retirada fictícia → resumo. **Não há pagamentos nem pedidos reais**.
- **Idiomas:** português brasileiro (padrão), inglês americano e espanhol argentino, com preferência salva no dispositivo.
- **Acessibilidade:** rótulos para leitores de tela, foco visível, link para pular ao conteúdo ativo, navegação por teclado e foco contido nos diálogos.
- **PWA:** instalação na tela inicial do iPhone e Android; conteúdo estático já acessado disponível offline, sem cache de APIs externas.

As imagens e preços são **ilustrativos**. A lista de ingredientes nos detalhes é apenas uma **composição de referência**: não equivale a ficha técnica ou declaração de alérgenos de uma loja.

## Gestão do catálogo

- **Painel:** [admin.html](https://iamdanieldantas.github.io/coffee-shop/admin.html).
- **Backend:** Supabase com catálogo público somente para leitura e **RLS** que restringe gravação a contas previamente autorizadas na tabela `coffee_staff`.
- O painel permite alterar nomes e descrições em PT/EN/ES, preços, categoria, disponibilidade e escolher fotos locais; novos arquivos de imagem ainda exigem deploy no GitHub.
- **Acesso administrativo não é criado automaticamente.** Veja [docs/ADMIN_FIDELIDADE.md](docs/ADMIN_FIDELIDADE.md) para cadastrar uma conta no Supabase Auth e autorizar seu UUID. Não compartilhe senhas ou tokens.
- A fidelidade é apenas um **simulador local**: nenhum selo representa compra nem dá direito a recompensa.

## Arquitetura

- `index.html`, `assets/styles.css`, `assets/app.js` — interface, design system, catálogo de fallback e sacola.
- `assets/i18n.js`, `assets/experience.js`, `assets/accessibility.js` — traduções, descoberta, detalhes, checkout demonstrativo e acessibilidade.
- `assets/catalog.js`, `assets/likes.js`, `assets/admin.js` — integração pública e administração com Supabase.
- `assets/loyalty.js`, `assets/social-footer.js` — fidelidade simulada e canais oficiais configuráveis.
- `assets/photos/` — imagens WebP locais otimizadas.
- `manifest.webmanifest`, `sw.js` — PWA com cache somente de arquivos locais do site.
- `supabase/migrations/` — SQL versionado para curtidas, catálogo e autorização de administradores.
- `tests/`, `harness/runner.py` — contratos, testes Playwright e gates de publicação.
- `.github/workflows/validate.yml`, `.github/workflows/site.yml` — PR e deploy GitHub Pages.

## Desenvolvimento e validação

```bash
python -m http.server 8000
python -m harness.runner --mode review --browser
```

No GitHub Pages: **Settings → Pages → Source: GitHub Actions**.

Os canais Instagram, Facebook, Spotify e WhatsApp ficam como **Em breve** até serem informados perfis/números oficiais em `assets/social-config.js`. Nenhum perfil, endereço físico ou telefone é inventado.
