# Coffee House V2 — PWA, desempenho e SEO

## O que está implementado
- `manifest.webmanifest`, ícone vetorial da marca, metadados para instalação pelo navegador e tela inicial.
- Service worker com cache **exclusivo de arquivos públicos do Coffee House** e navegação offline. Não armazena dados ou respostas do Supabase, tokens de autenticação, pedidos ou pagamentos.
- Fotografias WebP extraídas de data URLs e hospedadas como arquivos locais em `assets/photos/`, com imagens de cardápio carregadas sob demanda e decodificação assíncrona.
- Metadados de compartilhamento (Open Graph, Twitter), URL canônica e marcação schema.org de **WebSite demonstrativo**, sem fingir uma loja física.
- Testes automáticos com Chromium em modo offline.

## Instalar
No iPhone: Safari → Compartilhar → Adicionar à Tela de Início.
No Android com Chrome: menu do navegador → Instalar app ou Adicionar à tela inicial, conforme disponibilidade.

Instalação e comportamento offline podem variar por sistema operacional e navegador; não se trata de publicação na App Store.

## Restrições
- Offline: pode navegar e consultar **imagens e conteúdos já armazenados**; curtidas compartilhadas e qualquer ação que dependa de banco exigem conexão.
- Manifest usa ícone **SVG**. Para compatibilidade universal com todos os lançadores e previews sociais, ainda é recomendado adicionar variantes PNG 192/512 px e OG JPG/PNG no futuro.
- Não cadastramos endereço, horário ou empresa inexistentes; por isso usamos `WebSite`, não `Restaurant` ou `LocalBusiness`.
- Site e preços continuam demonstrativos.
- O service worker tem versão de cache, atualizável nas próximas versões. Evite salvar requisições cross-origin.

## Verificação
```bash
python -m harness.runner --mode review --browser
```
Testa as três telas, imagens, responsividade, navegação offline e escopo de cache. Para acompanhar desempenho, use Lighthouse no DevTools; a pontuação pode variar conforme aparelho e rede.
