/* Coffee House likes: public aggregate counts, one anonymous Supabase identity per browser.
 * No external SDK or email data. Requires assets/likes-config.js + SQL migration.
 * Publishable/anon key is safe for browsers; NEVER configure a service_role/secret key.
 */
(() => {
  'use strict';
  const raw = window.COFFEE_LIKES_CONFIG || {};
  const url = String(raw.supabaseUrl || '').replace(/\/+$/, '');
  const key = String(raw.publishableKey || '');
  const validUrl = /^https:\/\/[^/]+\.supabase\.co$/.test(url);
  const configured = validUrl && !!key && !key.startsWith('sb_secret_') && !key.includes('service_role');
  const sessionStorageKey = 'coffeehouse-likes-session-v1';
  const counts = new Map();
  const busy = new Set();
  let session = null, available = false, message = '', currentRequest = null;

  function readSaved() {
    try {
      const parsed = JSON.parse(localStorage.getItem(sessionStorageKey) || 'null');
      if (parsed && parsed.access_token && parsed.refresh_token && Number.isFinite(parsed.expires_at)) return parsed;
    } catch (_) {}
    return null;
  }
  function persist(next) {
    session = next;
    try {
      if (next) localStorage.setItem(sessionStorageKey, JSON.stringify(next));
      else localStorage.removeItem(sessionStorageKey);
    } catch (_) {}
  }
  async function call(path, body, bearer = key) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(url + path, {
        method: 'POST',
        headers: { 'apikey': key, 'Content-Type': 'application/json', ...(bearer !== key ? { 'Authorization': 'Bearer ' + bearer } : {}) },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || data?.msg || data?.error_description || data?.error || 'Serviço indisponível');
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }
  function tokenRecord(rawSession) {
    if (!rawSession?.access_token || !rawSession?.refresh_token) throw new Error('Não foi possível iniciar a sessão anônima');
    const expires = Number(rawSession.expires_at || (Math.floor(Date.now() / 1000) + Number(rawSession.expires_in || 3600)));
    return { access_token: rawSession.access_token, refresh_token: rawSession.refresh_token, expires_at: expires };
  }
  async function getToken(create = false) {
    if (!session) session = readSaved();
    if (session && session.expires_at > Date.now() / 1000 + 60) return session.access_token;
    if (session && session.refresh_token) {
      try {
        persist(tokenRecord(await call('/auth/v1/token?grant_type=refresh_token',
          { refresh_token: session.refresh_token }, key)));
        return session.access_token;
      } catch (_) {
        persist(null); // Invalid or expired anonymous session; never reuse a rejected token.
      }
    }
    if (!create) return key; // Public counts require no sign-in.
    const data = await call('/auth/v1/signup', { data: {} });
    persist(tokenRecord(data));
    return session.access_token;
  }
  function count(id) { return counts.get(id)?.likes || 0; }
  function liked(id) { return !!counts.get(id)?.liked; }
  function notify() { window.dispatchEvent(new CustomEvent('coffee:likes-update')); }
  function statusText() {
    if (!configured) return 'Curtidas aguardando ativação. Nenhum total foi simulado.';
    if (!available) return message || 'Carregando curtidas...';
    return 'Uma curtida por visitante neste navegador. Os totais são compartilhados entre visitantes.';
  }
  function button(product) {
    const id = product.id;
    const active = liked(id), pending = busy.has(id);
    const disabled = !configured || !available || pending;
    const label = active ? 'Remover curtida de' : 'Curtir';
    const title = !configured ? 'Curtidas disponíveis após ativação do banco de dados'
      : !available ? 'Aguardando conexão com o serviço de curtidas' : label + ' ' + product.name;
    const number = available ? count(id).toLocaleString('pt-BR') : '—';
    return '<button type="button" class="like-button' + (active ? ' is-liked' : '') +
      '" data-like="' + id + '" aria-label="' + title.replaceAll('"', '&quot;') + '"' +
      ' aria-pressed="' + active + '" title="' + title.replaceAll('"', '&quot;') + '"' +
      (disabled ? ' disabled' : '') + '>' +
      '<svg viewBox="0 0 24 24" class="like-icon" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/></svg>' +
      '<span class="like-count">' + number + '</span></button>';
  }
  async function refresh() {
    if (!configured || currentRequest) return currentRequest;
    currentRequest = (async () => {
      try {
        const token = await getToken(false);
        const rows = await call('/rest/v1/rpc/coffee_likes_snapshot', {}, token);
        if (!Array.isArray(rows)) throw new Error('Resposta de curtidas inválida');
        counts.clear();
        for (const row of rows) {
          if (typeof row.product_id !== 'string') continue;
          const n = Number(row.likes);
          counts.set(row.product_id, { likes: Number.isSafeInteger(n) && n >= 0 ? n : 0, liked: !!row.liked });
        }
        available = true; message = '';
      } catch (_) {
        // Never present locally guessed likes as shared totals.
        available = false; message = 'Não foi possível consultar as curtidas. Tente novamente mais tarde.';
      } finally { notify(); }
    })();
    try { await currentRequest; } finally { currentRequest = null; }
  }
  async function toggle(id) {
    if (!configured || !available || busy.has(id)) return;
    if (!window.COFFEE_PRODUCT_IDS?.includes(id)) return;
    busy.add(id); notify();
    try {
      const token = await getToken(true);
      await call('/rest/v1/rpc/coffee_toggle_like', { p_product_id: id }, token);
      await refresh();
    } catch (_) {
      message = 'Não foi possível salvar a curtida. Tente novamente.';
      window.CoffeeLikes.onError?.(message);
    } finally { busy.delete(id); notify(); }
  }
  document.addEventListener('click', event => {
    const btn = event.target.closest('[data-like]');
    if (btn) { event.preventDefault(); toggle(btn.dataset.like); }
  });
  window.addEventListener('focus', () => { if (configured && document.visibilityState === 'visible') refresh(); });
  document.addEventListener('visibilitychange', () => { if (configured && !document.hidden) refresh(); });
  // Refresh public totals periodically when the page is in use; no websocket/CDN dependency.
  setInterval(() => { if (configured && !document.hidden) refresh(); }, 45000);
  function init() { refresh(); notify(); }
  window.CoffeeLikes = { button, count, liked, configured, available: () => available, statusText, refresh, init, onError: null };
})();
