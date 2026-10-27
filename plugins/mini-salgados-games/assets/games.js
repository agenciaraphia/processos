(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const one = (root, selector) => root.querySelector(selector);
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  };
  const svg = (tag, attrs, parent) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
    if (parent) parent.appendChild(el);
    return el;
  };
  const icon = (paths, size = 20, stroke = 2.2) => {
    const el = svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': stroke, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' });
    paths.forEach((d) => svg('path', { d }, el));
    return el;
  };
  const ICONS = {
    chevron: ['M9 6l6 6-6 6'],
    lock: ['M7 11V8a5 5 0 0 1 10 0v3', 'M6 11h12v9H6z'],
    clock: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18', 'M12 7v5l3 2'],
    star: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'],
    copy: ['M9 9h11v11H9z', 'M5 15V4h11'],
    check: ['M5 12.5l4.5 4.5L19 7.5']
  };

  // Uma fatia de pizza (setor) do círculo, centrada no ângulo `mid` (graus, 0 = topo, sentido horário).
  const slicePath = (r, mid, span) => {
    const rad = (deg) => (deg - 90) * Math.PI / 180;
    const a0 = rad(mid - span / 2);
    const a1 = rad(mid + span / 2);
    const p = (a) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
    return `M0 0 L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z`;
  };
  const SLICE_FILL = ['msg-f-p', 'msg-f-w', 'msg-f-s', 'msg-f-w'];
  const SLICE_TEXT = ['msg-t-op', 'msg-t-ink', 'msg-t-os', 'msg-t-ink'];

  function drawWheelFace(group, r, labels) {
    for (let i = 0; i < 8; i += 1) svg('path', { d: slicePath(r, i * 45, 45), class: SLICE_FILL[i % 4] }, group);
    for (let i = 0; i < 8; i += 1) {
      const a = (i * 45 + 22.5 - 90) * Math.PI / 180;
      svg('line', { x1: 0, y1: 0, x2: (r * Math.cos(a)).toFixed(2), y2: (r * Math.sin(a)).toFixed(2), class: 'msg-s-line', 'stroke-width': r > 60 ? 1.5 : 1 }, group);
    }
    if (!labels) return;
    labels.forEach((raw, i) => {
      const text = String(raw || `Prêmio ${i + 1}`).trim();
      const lines = splitLabel(text);
      const node = svg('text', { class: `msg-wheel-label ${SLICE_TEXT[i % 4]}`, transform: `rotate(${i * 45 - 90})`, 'text-anchor': 'end' }, group);
      lines.forEach((line, n) => {
        const span = svg('tspan', { x: r - 14, y: lines.length === 1 ? 4 : (n === 0 ? -3 : 11) }, node);
        span.textContent = line;
        if (line.length > 13) { span.setAttribute('textLength', String(r - 50)); span.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
      });
    });
  }
  function splitLabel(text) {
    if (text.length <= 12 || !text.includes(' ')) return [text];
    const middle = text.length / 2;
    let best = -1;
    for (let i = 0; i < text.length; i += 1) if (text[i] === ' ' && (best < 0 || Math.abs(i - middle) < Math.abs(best - middle))) best = i;
    return [text.slice(0, best), text.slice(best + 1)];
  }

  function cardArt(game) {
    const art = make('span', `msg-card-art msg-card-art--${game}`);
    const s = svg('svg', { viewBox: '0 0 120 90', 'aria-hidden': 'true' }, art);
    if (game === 'roleta') {
      svg('ellipse', { cx: 60, cy: 86, rx: 30, ry: 3, class: 'msg-f-shadow' }, s);
      const g = svg('g', { class: 'msg-art-wheel' }, s);
      const face = svg('g', { transform: 'translate(60 45)' }, g);
      svg('circle', { r: 41, class: 'msg-f-pd' }, face);
      svg('circle', { r: 37, class: 'msg-f-w' }, face);
      drawWheelFace(face, 35, null);
      svg('circle', { r: 8, class: 'msg-f-w' }, face);
      svg('circle', { r: 5, class: 'msg-f-s' }, face);
      svg('path', { d: 'M60 13 L53 1 H67 Z', class: 'msg-f-ink' }, s);
    } else if (game === 'raspadinha') {
      svg('ellipse', { cx: 60, cy: 82, rx: 44, ry: 3, class: 'msg-f-shadow' }, s);
      svg('rect', { x: 8, y: 16, width: 104, height: 60, rx: 9, class: 'msg-f-p' }, s);
      svg('circle', { cx: 8, cy: 46, r: 6, class: 'msg-f-pt' }, s);
      svg('circle', { cx: 112, cy: 46, r: 6, class: 'msg-f-pt' }, s);
      const q = svg('text', { x: 36, y: 56, 'text-anchor': 'middle', class: 'msg-t-op', style: 'font: 700 30px var(--msg-font-heading)' }, s);
      q.textContent = '?';
      svg('path', { d: 'M58 16 H103 a9 9 0 0 1 9 9 V67 a9 9 0 0 1 -9 9 H52 c6-6 -4-10 3-16 c7-6 -5-10 2-16 c7-6 -3-11 1-17 z', class: 'msg-f-foil' }, s);
      svg('path', { d: 'M68 30 l30 0 M66 42 l36 0 M70 54 l24 0', stroke: 'rgba(255,255,255,.7)', 'stroke-width': 3, 'stroke-linecap': 'round' }, s);
      const coin = svg('g', { class: 'msg-art-coin' }, s);
      svg('circle', { cx: 96, cy: 70, r: 13, class: 'msg-f-sd' }, coin);
      svg('circle', { cx: 96, cy: 68, r: 13, class: 'msg-f-s' }, coin);
      svg('circle', { cx: 96, cy: 68, r: 8, fill: 'none', stroke: 'rgba(31,26,23,.25)', 'stroke-width': 1.5 }, coin);
    } else {
      svg('ellipse', { cx: 60, cy: 84, rx: 36, ry: 3.5, class: 'msg-f-shadow' }, s);
      svg('rect', { x: 28, y: 42, width: 64, height: 40, rx: 5, class: 'msg-f-p' }, s);
      svg('rect', { x: 28, y: 42, width: 64, height: 6, class: 'msg-f-pd' }, s);
      svg('rect', { x: 54, y: 42, width: 12, height: 40, class: 'msg-f-s' }, s);
      const lid = svg('g', { class: 'msg-art-lid' }, s);
      svg('rect', { x: 23, y: 30, width: 74, height: 15, rx: 4, class: 'msg-f-p' }, lid);
      svg('rect', { x: 53, y: 30, width: 14, height: 15, class: 'msg-f-s' }, lid);
      svg('ellipse', { cx: 50, cy: 23, rx: 11, ry: 7, transform: 'rotate(-24 50 23)', class: 'msg-f-s' }, lid);
      svg('ellipse', { cx: 70, cy: 23, rx: 11, ry: 7, transform: 'rotate(24 70 23)', class: 'msg-f-s' }, lid);
      svg('circle', { cx: 60, cy: 27, r: 5, class: 'msg-f-sd' }, lid);
    }
    return art;
  }

  function bigWheel(labels) {
    const wrap = make('div', 'msg-wheel');
    const s = svg('svg', { viewBox: '-160 -160 320 320', role: 'img', 'aria-label': 'Roleta com oito espaços' }, wrap);
    svg('circle', { r: 159, class: 'msg-f-pd' }, s);
    const bulbs = svg('g', {}, s);
    for (let i = 0; i < 16; i += 1) {
      const a = (i * 22.5 - 90) * Math.PI / 180;
      svg('circle', { cx: (149 * Math.cos(a)).toFixed(2), cy: (149 * Math.sin(a)).toFixed(2), r: 4.6, class: 'msg-bulb' }, bulbs);
    }
    svg('circle', { r: 140, class: 'msg-f-w' }, s);
    drawWheelFace(svg('g', {}, s), 136, labels);
    svg('circle', { r: 34, class: 'msg-f-w' }, s);
    svg('circle', { r: 27, class: 'msg-f-s' }, s);
    svg('path', { d: 'M0 -14 L4.1 -5.6 L13.3 -4.3 L6.7 2.1 L8.2 11.3 L0 7 L-8.2 11.3 L-6.7 2.1 L-13.3 -4.3 L-4.1 -5.6 Z', class: 'msg-t-os' }, s);
    return wrap;
  }
  function wheelPointer() {
    const s = svg('svg', { class: 'msg-wheel-pointer', viewBox: '0 0 46 58', 'aria-hidden': 'true' });
    svg('path', { d: 'M23 56 C15 42 4 32 4 21 A19 19 0 1 1 42 21 C42 32 31 42 23 56 Z', class: 'msg-f-ink' }, s);
    svg('circle', { cx: 23, cy: 21, r: 8, class: 'msg-f-s' }, s);
    return s;
  }

  function giftBox() {
    const s = svg('svg', { viewBox: '0 -40 240 270', 'aria-hidden': 'true' });
    const rays = svg('g', { class: 'msg-box-rays' }, s);
    for (let i = 0; i < 12; i += 1) svg('path', { d: 'M120 112 L112 10 L128 10 Z', transform: `rotate(${i * 30} 120 112)`, class: 'msg-f-s', opacity: '.55' }, rays);
    svg('circle', { cx: 120, cy: 112, r: 46, class: 'msg-f-s', opacity: '.35' }, rays);
    svg('ellipse', { cx: 120, cy: 214, rx: 84, ry: 9, class: 'msg-f-shadow' }, s);
    const body = svg('g', { class: 'msg-box-body' }, s);
    svg('rect', { x: 40, y: 104, width: 160, height: 106, rx: 12, class: 'msg-f-p' }, body);
    svg('rect', { x: 40, y: 104, width: 160, height: 14, class: 'msg-f-pd' }, body);
    svg('rect', { x: 106, y: 104, width: 28, height: 106, class: 'msg-f-s' }, body);
    svg('rect', { x: 106, y: 104, width: 28, height: 14, class: 'msg-f-sd' }, body);
    const lid = svg('g', { class: 'msg-box-lid' }, body);
    svg('rect', { x: 30, y: 78, width: 180, height: 34, rx: 9, class: 'msg-f-p' }, lid);
    svg('rect', { x: 104, y: 78, width: 32, height: 34, class: 'msg-f-s' }, lid);
    svg('ellipse', { cx: 98, cy: 64, rx: 25, ry: 14, transform: 'rotate(-24 98 64)', class: 'msg-f-s' }, lid);
    svg('ellipse', { cx: 98, cy: 64, rx: 12, ry: 6, transform: 'rotate(-24 98 64)', class: 'msg-f-sd' }, lid);
    svg('ellipse', { cx: 142, cy: 64, rx: 25, ry: 14, transform: 'rotate(24 142 64)', class: 'msg-f-s' }, lid);
    svg('ellipse', { cx: 142, cy: 64, rx: 12, ry: 6, transform: 'rotate(24 142 64)', class: 'msg-f-sd' }, lid);
    svg('circle', { cx: 120, cy: 74, r: 11, class: 'msg-f-sd' }, lid);
    return s;
  }

  function waitText(nextAt) {
    const ms = new Date(nextAt).getTime() - Date.now();
    if (!(ms > 0)) return null;
    const minutes = Math.ceil(ms / 60000);
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h < 48) return m ? `${h}h ${String(m).padStart(2, '0')}min` : `${h}h`;
    return `${Math.round(h / 24)} dias`;
  }
  const absoluteDate = (value) => new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  function init(app) {
    if (app.dataset.msgReady === '1') return;
    app.dataset.msgReady = '1';

    const slug = app.dataset.campaign;
    const cfg = (window.MSGCampaigns || {})[slug];
    const form = one(app, '.msg-register-form');
    const register = one(app, '.msg-register');
    const menu = one(app, '.msg-menu');
    const list = one(app, '.msg-game-list');
    const area = one(app, '.msg-play-area');
    const back = one(app, '.msg-back');
    const feedback = Array.from(app.querySelectorAll('.msg-feedback'));
    if (!cfg || !form || !register || !menu || !list || !area || !back) {
      if (!one(app, '.msg-notice')) app.appendChild(make('p', 'msg-notice', 'Não foi possível carregar esta campanha. Atualize a página ou fale com a equipe.'));
      return;
    }

    let token = '';
    let games = {};
    let profile = null;
    let busy = false;
    let session = 0;
    let menuTimer = 0;
    const storageKey = `msg_${slug}_profile`;
    const GAME_COPY = {
      roleta: { overline: 'Gire e torça', ready: 'Gire e veja onde o ponteiro para.', intro: 'Toque no botão para girar. O resultado é confirmado pelo sistema da campanha assim que a roleta parar.' },
      raspadinha: { overline: 'Raspe e descubra', ready: 'Raspe o cartão para revelar.', intro: 'Passe o dedo ou o mouse sobre o cartão prateado até liberar o resultado.' },
      caixa: { overline: 'Toque e abra', ready: 'Toque 4 vezes para abrir.', intro: 'Toque na caixa quatro vezes para abrir a tampa e descobrir o que tem dentro.' }
    };

    const say = (message, tone) => feedback.forEach((node) => { node.textContent = message || ''; node.dataset.tone = tone || 'info'; });
    const setView = (view) => { app.dataset.view = view; };
    const bringIntoView = (el) => {
      const top = el.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.55) el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    };
    const focusQuietly = (el) => { if (!el) return; el.setAttribute('tabindex', '-1'); try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } };
    const api = async (path, payload) => {
      const response = await fetch(cfg.api + path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce },
        body: JSON.stringify(payload)
      });
      let body;
      try { body = await response.json(); } catch (e) { throw new Error('O servidor respondeu de forma inesperada. Atualize a página e tente novamente.'); }
      if (!response.ok || !body || !body.success) throw new Error((body && body.message) || 'Não foi possível concluir sua participação.');
      return body;
    };

    function storedProfile() {
      try { return JSON.parse(window.localStorage.getItem(storageKey) || 'null'); }
      catch (e) { return null; }
    }
    function persistProfile() {
      try { window.localStorage.setItem(storageKey, JSON.stringify(profile)); } catch (e) { /* storage can be unavailable */ }
    }
    function button(text, className = 'msg-action') { const el = make('button', className, text); el.type = 'button'; return el; }

    function updateCountdowns() {
      let expired = false;
      list.querySelectorAll('[data-next-at]').forEach((node) => {
        const wait = waitText(node.dataset.nextAt);
        if (wait) node.textContent = `Libera em ${wait}.`;
        else expired = true;
      });
      if (expired) { window.clearInterval(menuTimer); refreshAndShowMenu(); }
    }

    function showMenu() {
      session += 1;
      window.clearInterval(menuTimer);
      list.replaceChildren();
      let readyCount = 0;
      Object.entries(games).forEach(([game, state]) => {
        const copyText = GAME_COPY[game] || GAME_COPY.roleta;
        const card = button('', 'msg-game-card');
        card.dataset.game = game;
        card.appendChild(cardArt(game));
        const copy = make('span', 'msg-game-copy');
        copy.appendChild(make('span', 'msg-game-overline', copyText.overline));
        const title = make('strong', 'msg-game-title', state.label);
        const go = make('span', 'msg-card-go');
        go.appendChild(icon(!state.available ? ICONS.lock : ICONS.chevron, 18, 2.4));
        title.appendChild(go);
        copy.appendChild(title);
        const details = make('span', 'msg-game-status');
        if (!state.available) {
          card.disabled = true;
          card.classList.add('is-locked');
          if (state.won) card.classList.add('is-won');
          const wait = state.next_at ? waitText(state.next_at) : null;
          details.textContent = wait ? `Libera em ${wait}.` : 'Disponível mais tarde.';
          if (state.next_at) { details.dataset.nextAt = state.next_at; card.title = `Disponível em ${absoluteDate(state.next_at)}`; }
          copy.appendChild(make('span', 'msg-game-tag msg-game-tag--wait', 'Em espera'));
        } else if (state.won) {
          readyCount += 1;
          card.classList.add('is-won');
          details.textContent = 'Você já ganhou aqui. Pode jogar de novo, mas sem novo prêmio.';
          copy.appendChild(make('span', 'msg-game-tag msg-game-tag--won', '★ Prêmio ganho'));
        } else {
          readyCount += 1;
          details.textContent = copyText.ready;
          copy.appendChild(make('span', 'msg-game-tag', 'Pronto para jogar'));
        }
        copy.appendChild(details);
        card.appendChild(copy);
        if (state.available) card.addEventListener('click', () => openGame(game));
        list.appendChild(card);
      });
      const welcome = one(menu, '.msg-returning');
      const first = profile && profile.name ? profile.name.trim().split(' ')[0] : '';
      if (welcome) {
        if (!readyCount && Object.keys(games).length) welcome.textContent = `${first ? first + ', você' : 'Você'} já jogou tudo por agora. Os jogos liberam de novo após o intervalo.`;
        else welcome.textContent = first ? `Olá, ${first}! Escolha um jogo para começar.` : 'Escolha um dos jogos abaixo.';
      }
      register.hidden = true;
      menu.hidden = false;
      list.hidden = false;
      back.hidden = true;
      area.hidden = true;
      setView('menu');
      say('');
      if (list.querySelector('[data-next-at]')) menuTimer = window.setInterval(updateCountdowns, 30000);
    }

    function makeActionRow() {
      const row = make('div', 'msg-game-actions');
      return row;
    }

    function addGameIntro(title, description, game) {
      area.replaceChildren();
      area.hidden = false;
      list.hidden = true;
      back.hidden = false;
      setView('play');
      const head = make('div', 'msg-game-view-head');
      head.appendChild(make('span', 'msg-game-overline', (GAME_COPY[game] || GAME_COPY.roleta).overline));
      head.appendChild(make('h3', 'msg-play-title', title));
      head.appendChild(make('p', 'msg-play-description', description));
      area.appendChild(head);
      return head;
    }

    function confetti(origin) {
      if (reducedMotion() || !Element.prototype.animate) return;
      const layer = make('div', 'msg-confetti');
      app.appendChild(layer);
      const box = app.getBoundingClientRect();
      const from = origin ? origin.getBoundingClientRect() : box;
      const x0 = from.left + from.width / 2 - box.left;
      const y0 = from.top + from.height / 2 - box.top;
      const colors = ['var(--msg-primary)', 'var(--msg-secondary)', 'var(--msg-p-tint)', 'var(--msg-s-deep)', 'var(--msg-ink)'];
      for (let i = 0; i < 56; i += 1) {
        const piece = make('i');
        piece.style.left = `${x0}px`;
        piece.style.top = `${y0}px`;
        piece.style.background = colors[i % colors.length];
        if (i % 3 === 0) { piece.style.width = '8px'; piece.style.height = '8px'; piece.style.borderRadius = '50%'; }
        layer.appendChild(piece);
        const angle = Math.random() * Math.PI * 2;
        const force = 90 + Math.random() * 170;
        const dx = Math.cos(angle) * force;
        const peak = -Math.abs(Math.sin(angle) * force) - 60;
        const fall = box.height - y0 + 40;
        const spin = (Math.random() * 2 - 1) * 720;
        piece.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx * 0.8}px, ${peak}px) rotate(${spin * 0.3}deg)`, opacity: 1, offset: 0.28 },
          { transform: `translate(${dx}px, ${fall}px) rotate(${spin}deg)`, opacity: 0.9 }
        ], { duration: 1500 + Math.random() * 1100, delay: Math.random() * 120, easing: 'cubic-bezier(.2,.6,.35,1)', fill: 'forwards' });
      }
      window.setTimeout(() => layer.remove(), 3000);
    }

    function renderResult(result, game) {
      session += 1;
      area.replaceChildren();
      const win = result.result === 'win';
      const resultCard = make('div', `msg-result-card ${win ? 'is-win' : 'is-lose'}`);
      const mark = make('div', 'msg-result-mark');
      mark.appendChild(icon(win ? ICONS.star : ICONS.clock, 40, 2));
      resultCard.appendChild(mark);
      resultCard.appendChild(make('span', 'msg-game-overline', win ? 'Você ganhou' : 'Resultado da jogada'));
      const title = make('h3', 'msg-result-title', win ? 'Tem prêmio esperando por você.' : 'Dessa vez, não foi.');
      resultCard.appendChild(title);
      resultCard.appendChild(make('p', 'msg-result-message', result.message || 'Sua participação foi registrada.'));
      if (result.prize) resultCard.appendChild(make('div', 'msg-prize', result.prize));
      if (result.coupon) {
        const couponWrap = make('div', 'msg-coupon-wrap');
        couponWrap.appendChild(make('span', 'msg-coupon-label', 'Seu código de resgate'));
        couponWrap.appendChild(make('code', 'msg-coupon', result.coupon));
        const copy = button('', 'msg-secondary');
        const setCopy = (paths, text) => { copy.replaceChildren(icon(paths, 18, 2.4), document.createTextNode(text)); };
        setCopy(ICONS.copy, 'Copiar código');
        copy.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(result.coupon);
            copy.classList.add('is-done');
            setCopy(ICONS.check, 'Código copiado');
            window.setTimeout(() => { copy.classList.remove('is-done'); setCopy(ICONS.copy, 'Copiar código'); }, 2400);
          } catch (e) {
            const range = document.createRange(); range.selectNodeContents(couponWrap.querySelector('.msg-coupon'));
            const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
            setCopy(ICONS.copy, 'Código selecionado: copie manualmente');
          }
        });
        couponWrap.appendChild(copy);
        resultCard.appendChild(couponWrap);
      }
      if (!win && result.next_at) {
        const wait = waitText(result.next_at);
        if (wait) {
          const next = make('p', 'msg-result-next');
          next.appendChild(icon(ICONS.clock, 18, 2));
          next.appendChild(document.createTextNode(`Nova jogada neste jogo em ${wait} (${absoluteDate(result.next_at)}).`));
          resultCard.appendChild(next);
        }
      }
      resultCard.appendChild(make('p', 'msg-result-footnote', win ? 'Guarde o código: ele também fica registrado na campanha. Cada jogo tem seu próprio intervalo de espera.' : 'Sua participação foi salva. Os outros jogos liberados continuam disponíveis no menu.'));
      const actions = makeActionRow();
      const again = button('Voltar aos jogos', 'msg-action');
      again.addEventListener('click', refreshAndShowMenu);
      actions.appendChild(again);
      resultCard.appendChild(actions);
      area.appendChild(resultCard);
      area.hidden = false;
      list.hidden = true;
      back.hidden = true;
      setView('result');
      say('');
      bringIntoView(menu);
      focusQuietly(title);
      if (win) window.requestAnimationFrame(() => confetti(mark));
    }

    async function refreshAndShowMenu() {
      if (!profile) return;
      try {
        const fresh = await api('register', { campaign: slug, name: profile.name, phone: profile.phone, privacy: true, marketing: !!profile.marketing, token: profile.token || '' });
        token = fresh.token;
        profile.token = token;
        games = fresh.games || {};
        persistProfile();
        showMenu();
        bringIntoView(menu);
      } catch (error) {
        say(error.message, 'error');
      }
    }

    async function playNow(game, visual, action, ready) {
      if (!ready() || busy) return;
      busy = true;
      back.hidden = true;
      action.disabled = true;
      action.classList.add('is-loading');
      action.textContent = 'Registrando resultado…';
      visual.classList.add('is-playing');
      try {
        const result = await api('play', { campaign: slug, game, token });
        visual.classList.remove('is-playing');
        visual.classList.add(result.result === 'win' ? 'is-win' : 'is-lose');
        renderResult(result, game);
      } catch (error) {
        visual.classList.remove('is-playing');
        busy = false;
        back.hidden = false;
        action.disabled = false;
        action.classList.remove('is-loading');
        action.textContent = 'Tentar novamente';
        say(error.message, 'error');
      }
    }

    function openGame(game) {
      if (!games[game] || !games[game].available) return;
      busy = false;
      session += 1;
      const mySession = session;
      window.clearInterval(menuTimer);
      const state = games[game];
      const description = (GAME_COPY[game] || GAME_COPY.roleta).intro;
      const head = addGameIntro(state.label, description, game);

      let visual;
      let action;
      let ready = false;
      if (game === 'roleta') {
        const stage = make('div', 'msg-wheel-stage');
        stage.appendChild(wheelPointer());
        const labels = Array.isArray(cfg.roletaLabels) ? cfg.roletaLabels.slice(0, 8) : [];
        while (labels.length < 8) labels.push(`Prêmio ${labels.length + 1}`);
        const wheel = bigWheel(labels);
        stage.appendChild(wheel);
        area.appendChild(stage);
        visual = wheel;
        ready = true;
        action = button('Girar a roleta', 'msg-action msg-game-cta');
        action.addEventListener('click', async () => {
          if (busy) return;
          busy = true; action.disabled = true; action.textContent = 'Boa sorte!'; back.hidden = true;
          const quick = reducedMotion();
          const duration = quick ? 900 : 4600;
          // Para no centro de um dos espaços. A animação é só apresentação; o servidor decide o resultado real.
          const slot = Math.floor(Math.random() * 8);
          const rotation = (quick ? 360 : 360 * 6) + (360 - slot * 45) % 360 + (Math.random() * 16 - 8);
          stage.classList.add('is-spinning');
          wheel.style.transform = `rotate(${rotation}deg)`;
          window.setTimeout(() => { if (mySession === session) stage.classList.add('is-slowing'); }, duration * 0.55);
          window.setTimeout(async () => {
            stage.classList.remove('is-spinning', 'is-slowing');
            if (mySession !== session) return;
            busy = false;
            await playNow(game, wheel, action, () => ready);
          }, duration + 150);
        });
      } else if (game === 'raspadinha') {
        const stage = make('div', 'msg-scratch-stage');
        const under = make('div', 'msg-scratch-under');
        under.appendChild(make('span', 'msg-scratch-kicker', cfg.name || 'Mini Salgados'));
        under.appendChild(make('strong', '', 'Sua surpresa está aqui'));
        under.appendChild(make('small', '', 'Toque no botão para ver o resultado'));
        const canvas = document.createElement('canvas');
        canvas.className = 'msg-scratch-cover'; canvas.width = 600; canvas.height = 320;
        canvas.setAttribute('aria-label', 'Cartão prateado para raspar'); canvas.setAttribute('role', 'img');
        stage.appendChild(under); stage.appendChild(canvas); area.appendChild(stage);
        visual = stage;
        const meter = make('div', 'msg-meter'); const meterFill = make('span'); meter.appendChild(meterFill);
        meter.setAttribute('aria-hidden', 'true');
        area.appendChild(meter);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let drawing = false; let last = null; let scratchedDistance = 0;
        const paintCover = () => {
          ctx.globalCompositeOperation = 'source-over';
          const gradient = ctx.createLinearGradient(0, 0, 600, 320);
          gradient.addColorStop(0, '#c9c4bd'); gradient.addColorStop(0.32, '#f3f1ee'); gradient.addColorStop(0.5, '#dcd8d2'); gradient.addColorStop(0.72, '#f6f4f1'); gradient.addColorStop(1, '#bbb5ad');
          ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
          let seed = 7;
          const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
          for (let i = 0; i < 1400; i += 1) { ctx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,.55)' : 'rgba(60,50,40,.07)'; ctx.fillRect(rand() * 600, rand() * 320, 1.6, 1.6); }
          ctx.fillStyle = 'rgba(60,50,40,.07)'; ctx.font = '700 22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          for (let y = 28; y < 320; y += 56) for (let x = (y / 56) % 2 ? 40 : 12; x < 620; x += 56) ctx.fillText('★', x, y);
          ctx.fillStyle = '#3d3632';
          ctx.font = `700 50px "${cfg.headingFontFamily || 'Fredoka One'}", sans-serif`; ctx.fillText('RASPE AQUI', 300, 150);
          ctx.fillStyle = '#5c544e';
          ctx.font = `600 19px "${cfg.fontFamily || 'Montserrat'}", sans-serif`; ctx.fillText('Use o dedo ou o mouse', 300, 200);
          ctx.globalCompositeOperation = 'destination-out';
        };
        paintCover();
        if (document.fonts && document.fonts.load) {
          Promise.all([document.fonts.load(`700 50px "${cfg.headingFontFamily || 'Fredoka One'}"`), document.fonts.load(`600 19px "${cfg.fontFamily || 'Montserrat'}"`)])
            .then(() => { if (scratchedDistance === 0) paintCover(); }).catch(() => {});
        }
        const scratchPoint = (event) => {
          const rect = canvas.getBoundingClientRect();
          return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
        };
        const strokeTo = (point) => {
          if (!last) { last = point; return; }
          const distance = Math.hypot(point.x - last.x, point.y - last.y);
          scratchedDistance += distance;
          ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(point.x, point.y); ctx.lineWidth = 48; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
          last = point;
          meterFill.style.transform = `scaleX(${Math.min(1, scratchedDistance / 2800)})`;
          if (scratchedDistance >= 2800 && !ready) {
            ready = true; canvas.classList.add('is-revealed');
            action.disabled = false; action.textContent = 'Revelar meu resultado';
            const hint = one(area, '.msg-stage-hint'); if (hint) hint.textContent = 'Cartão raspado! Agora descubra seu resultado.';
          }
        };
        canvas.addEventListener('pointerdown', (event) => { drawing = true; last = scratchPoint(event); canvas.setPointerCapture?.(event.pointerId); strokeTo(last); event.preventDefault(); });
        canvas.addEventListener('pointermove', (event) => { if (!drawing) return; strokeTo(scratchPoint(event)); event.preventDefault(); });
        const endStroke = () => { drawing = false; last = null; };
        canvas.addEventListener('pointerup', endStroke); canvas.addEventListener('pointercancel', endStroke); canvas.addEventListener('pointerleave', endStroke);
        const hint = make('p', 'msg-stage-hint', 'Raspe a superfície até a barra encher.'); area.appendChild(hint);
        action = button('Continue raspando…', 'msg-action msg-game-cta'); action.disabled = true;
        action.addEventListener('click', () => playNow(game, visual, action, () => ready));
      } else {
        const stage = make('div', 'msg-box-stage');
        const box = make('button', 'msg-box-illustration', ''); box.type = 'button'; box.setAttribute('aria-label', 'Toque para abrir a caixa');
        box.appendChild(giftBox());
        const dots = make('div', 'msg-taps'); dots.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 4; i += 1) dots.appendChild(make('i'));
        const progress = make('p', 'msg-stage-hint', 'Toque 4 vezes para abrir a caixa.');
        progress.setAttribute('aria-live', 'polite');
        stage.appendChild(box); stage.appendChild(dots); stage.appendChild(progress); area.appendChild(stage);
        visual = box; let taps = 0;
        const tapBox = () => {
          if (ready || busy) return;
          taps += 1; box.classList.remove('is-tapped'); void box.offsetWidth; box.classList.add('is-tapped');
          dots.children[taps - 1]?.classList.add('is-on');
          progress.textContent = taps >= 4 ? 'Caixa aberta! Descubra o resultado.' : `Mais ${4 - taps} toque${4 - taps === 1 ? '' : 's'} para abrir.`;
          if (taps >= 4) { ready = true; box.classList.add('is-open'); box.setAttribute('aria-label', 'Caixa aberta'); action.disabled = false; action.textContent = 'Descobrir meu resultado'; }
        };
        box.addEventListener('click', tapBox);
        action = button('Toque na caixa para abrir', 'msg-action msg-game-cta'); action.disabled = true;
        action.addEventListener('click', () => playNow(game, visual, action, () => ready));
      }
      area.appendChild(action);
      say('');
      bringIntoView(menu);
      focusQuietly(one(head, '.msg-play-title'));
    }

    const phone = form.querySelector('input[name="phone"]');
    if (phone) phone.addEventListener('input', () => {
      const d = phone.value.replace(/\D+/g, '');
      if (d.length > 11) { phone.value = d; return; }
      let v = d;
      if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 6) v = d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      phone.value = v;
    });

    back.addEventListener('click', () => { busy = false; showMenu(); bringIntoView(menu); });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      const fd = new FormData(form);
      submit.disabled = true; submit.classList.add('is-loading'); submit.textContent = 'Preparando seus jogos…'; say('');
      try {
        const data = await api('register', { campaign: slug, name: fd.get('name'), phone: fd.get('phone'), privacy: fd.get('privacy') === 'on', marketing: fd.get('marketing') === 'on' });
        profile = { name: String(fd.get('name') || '').trim(), phone: String(fd.get('phone') || ''), marketing: fd.get('marketing') === 'on', token: data.token };
        token = data.token; games = data.games || {}; persistProfile();
        form.reset(); showMenu(); bringIntoView(menu); focusQuietly(one(menu, 'h3'));
      } catch (error) { say(error.message, 'error'); }
      finally { submit.disabled = false; submit.classList.remove('is-loading'); submit.textContent = 'Continuar para os jogos'; }
    });

    profile = storedProfile();
    if (profile && profile.name && profile.phone) {
      register.hidden = true; menu.hidden = false; setView('menu');
      api('register', { campaign: slug, name: profile.name, phone: profile.phone, privacy: true, marketing: !!profile.marketing, token: profile.token || '' })
        .then((data) => { token = data.token; profile.token = token; games = data.games || {}; persistProfile(); showMenu(); })
        .catch((error) => { try { localStorage.removeItem(storageKey); } catch (e) {} profile = null; token = ''; register.hidden = false; menu.hidden = true; setView('register'); say(error.message || 'Informe seus dados para continuar.', 'error'); });
    } else {
      register.hidden = false; menu.hidden = true; setView('register');
    }
  }

  const boot = () => document.querySelectorAll('.msg-app').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
