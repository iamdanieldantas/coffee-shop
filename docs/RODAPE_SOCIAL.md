# Rodapé e links oficiais — Coffee House

O rodapé já aparece em **Home**, **Menu** e **Pedidos**. Ele inclui Instagram,
Facebook, Spotify e WhatsApp, com ícones vetoriais locais e visual responsivo.

## Ativar os links

Edite `assets/social-config.js` no repositório. Substitua os campos vazios
pelos **links oficiais** da cafeteria, por exemplo:

```js
window.COFFEE_SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/SEU_PERFIL/',
  facebook: 'https://www.facebook.com/SUA_PAGINA/',
  spotify: 'https://open.spotify.com/playlist/ID_DA_PLAYLIST',
  whatsapp: 'https://wa.me/55DDDNUMERO'
};
```

Os valores acima são apenas **modelos de URL** e não são contas ou números reais.
Não publique dados pessoais ou números de outras pessoas sem autorização.

Quando um campo está vazio ou tem URL inválida, o canal permanece marcado
**Em breve**, sem navegação. Quando configurado, vira um link acessível que
abre uma nova aba com `rel="noopener noreferrer"`.

### Domínios aceitos
- Instagram: `instagram.com` / `www.instagram.com`
- Facebook: `facebook.com` / `www.facebook.com` / `m.facebook.com`
- Spotify: `open.spotify.com` com playlist, artista, perfil, podcast ou álbum
- WhatsApp: `wa.me` com número internacional, sem espaços ou pontuação

Todos os links usam HTTPS. Não coletamos dados do visitante no rodapé.

Depois de preencher URLs oficiais, abra uma PR e valide com
`python -m harness.runner --mode review --browser` antes de publicar.
