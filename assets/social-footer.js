/* Validação de destinos sociais, sem dependências externas. */
(function () {
  'use strict';
  const labels = { instagram: 'Instagram', facebook: 'Facebook', spotify: 'Spotify', whatsapp: 'WhatsApp' };
  const config = window.COFFEE_SOCIAL_LINKS || {};
  function resolveUrl(service, candidate) {
    if (typeof candidate !== 'string' || !candidate.trim()) return null;
    try {
      const target = new URL(candidate.trim());
      const host = target.hostname.toLowerCase();
      if (target.protocol !== 'https:' || target.username || target.password || target.port) return null;
      const pathname = target.pathname;
      if (service === 'instagram' && !(['instagram.com', 'www.instagram.com'].includes(host) && /^\/[A-Za-z0-9._]{1,30}\/?$/.test(pathname))) return null;
      if (service === 'facebook' && !(['facebook.com', 'www.facebook.com', 'm.facebook.com'].includes(host) && pathname.length > 1)) return null;
      if (service === 'spotify' && !(host === 'open.spotify.com' && /^\/(playlist|artist|user|show|album)\/[A-Za-z0-9_]+\/?$/.test(pathname))) return null;
      if (service === 'whatsapp' && !(host === 'wa.me' && /^\/[0-9]{8,15}\/?$/.test(pathname))) return null;
      return target.href;
    } catch (e) { return null; }
  }
  document.querySelectorAll('.social-link[data-social]').forEach(function (placeholder) {
    const service = placeholder.dataset.social;
    const address = resolveUrl(service, config[service]);
    if (!address || !labels[service]) return;
    const link = document.createElement('a');
    link.className = 'social-link is-ready';
    link.setAttribute('data-social', service);
    link.setAttribute('aria-label', window.CoffeeI18n.t('aria.openSocial', {service: labels[service]}));
    link.href = address;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    while (placeholder.firstChild) link.appendChild(placeholder.firstChild);
    const meta = link.querySelector('.social-meta');
    if (meta) { meta.dataset.i18n = service === 'whatsapp' ? 'footer.chat' : 'footer.open'; meta.textContent = window.CoffeeI18n.t(meta.dataset.i18n); }
    placeholder.replaceWith(link);
  });
  window.addEventListener('coffee:language-change', function () {
    document.querySelectorAll('a.social-link[data-social]').forEach(function (link) {
      const name = labels[link.dataset.social];
      if (name) link.setAttribute('aria-label', window.CoffeeI18n.t('aria.openSocial', {service:name}));
    });
  });
})();
