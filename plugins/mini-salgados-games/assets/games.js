(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
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
    check: ['M5 12.5l4.5 4.5L19 7.5'],
    pin: ['M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z', 'M12 7.3a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5'],
    external: ['M14 5h5v5', 'M19 5l-8 8', 'M17 14v5H5V7h5'],
    soundOn: ['M4 9.5h3.5L12 5.5v13l-4.5-4H4z', 'M15.5 9a4 4 0 0 1 0 6', 'M18 6.5a7.5 7.5 0 0 1 0 11'],
    soundOff: ['M4 9.5h3.5L12 5.5v13l-4.5-4H4z', 'M16 9.5l5 5', 'M21 9.5l-5 5']
  };

  /* ---------- Efeitos sonoros (sintetizados com Web Audio, sem arquivos) ---------- */
  const Sound = (() => {
    let ctx = null;
    let noise = null;
    let muted = false;
    let lastTick = 0;
    let lastScratch = 0;
    try { muted = window.localStorage.getItem('msg_sound_muted') === '1'; } catch (e) { /* storage can be unavailable */ }
    const audio = () => {
      if (muted) return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) { try { ctx = new AC(); } catch (e) { return null; } }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    };
    const noiseBuffer = (c) => {
      if (noise) return noise;
      noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
      return noise;
    };
    const envelope = (c, node, t, peak, attack, release) => {
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(peak, t + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
      node.connect(gain);
      gain.connect(c.destination);
    };
    const tone = (freq, start, dur, type, peak, endFreq) => {
      const c = audio(); if (!c) return;
      const t = c.currentTime + start;
      const osc = c.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
      envelope(c, osc, t, peak, 0.006, dur);
      osc.start(t); osc.stop(t + dur + 0.05);
    };
    const hiss = (start, dur, filterType, freq, q, peak, endFreq) => {
      const c = audio(); if (!c) return;
      const t = c.currentTime + start;
      const src = c.createBufferSource();
      src.buffer = noiseBuffer(c);
      const filter = c.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, t);
      if (endFreq) filter.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
      filter.Q.value = q;
      src.connect(filter);
      envelope(c, filter, t, peak, 0.004, dur);
      src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
    };
    return {
      isMuted: () => muted,
      setMuted(value) { muted = value; try { window.localStorage.setItem('msg_sound_muted', value ? '1' : '0'); } catch (e) { /* ignore */ } },
      unlock() { audio(); },
      tick() { const now = performance.now(); if (now - lastTick < 26) return; lastTick = now; tone(1400 + Math.random() * 400, 0, 0.03, 'square', 0.045); hiss(0, 0.025, 'highpass', 3500, 0.7, 0.06); },
      whoosh() { hiss(0, 0.4, 'bandpass', 350, 1.1, 0.14, 2600); },
      scratch(speed) { const now = performance.now(); if (now - lastScratch < 40) return; lastScratch = now; hiss(0, 0.07, 'bandpass', 2400 + Math.random() * 2200, 0.8, Math.min(0.2, 0.05 + speed / 300)); },
      crack(level) { hiss(0, 0.1, 'bandpass', 800 + level * 260, 1.3, 0.34); tone(150 - level * 15, 0, 0.14, 'sine', 0.24, 65); },
      burst() { hiss(0, 0.5, 'lowpass', 6000, 0.5, 0.36, 280); tone(120, 0, 0.3, 'sine', 0.32, 40); [1318.5, 1760, 2093].forEach((f, i) => tone(f, 0.14 + i * 0.07, 0.3, 'sine', 0.06)); },
      win() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.17)); [1046.5, 1318.5, 1568].forEach((f) => tone(f, 0.4, 0.7, 'triangle', 0.075)); },
      lose() { tone(392, 0, 0.24, 'sine', 0.12); tone(293.66, 0.2, 0.45, 'sine', 0.11, 261.6); }
    };
  })();

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
    for (let i = 0; i < 8; i += 1) svg('path', { d: slicePath(r, i * 45, 45), class: `msg-slice ${SLICE_FILL[i % 4]}`, 'data-slot': i }, group);
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
  // Toca um clique cada vez que uma divisória passa pelo ponteiro, lendo o ângulo real da animação.
  function trackTicks(wheel, duration, onTick) {
    let last = 0; let total = 0; let slot = 0;
    const end = performance.now() + duration + 200;
    const frame = (now) => {
      const m = /matrix\(([^,]+),\s*([^,]+)/.exec(getComputedStyle(wheel).transform || '');
      if (m) {
        const angle = Math.atan2(parseFloat(m[2]), parseFloat(m[1])) * 180 / Math.PI;
        let delta = angle - last;
        if (delta < -180) delta += 360; else if (delta > 180) delta -= 360;
        total += delta; last = angle;
        const current = Math.floor((total + 22.5) / 45);
        if (current !== slot) { slot = current; onTick(); }
      }
      if (now < end) window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
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
    const cracks = svg('g', { class: 'msg-box-cracks', fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, body);
    svg('path', { d: 'M62 118 L74 140 L66 156 L80 178', class: 'msg-crack msg-crack--1' }, cracks);
    svg('path', { d: 'M184 124 L170 146 L182 164 L166 192 M170 146 L158 150', class: 'msg-crack msg-crack--2' }, cracks);
    svg('path', { d: 'M96 206 L102 184 L92 170 L100 150 M102 184 L114 180 M146 206 L140 186 L150 172', class: 'msg-crack msg-crack--3' }, cracks);
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
    const soundOn = cfg.sound !== false;
    const sfx = (name, ...args) => { if (soundOn) Sound[name](...args); };
    const winSlots = (Array.isArray(cfg.roletaWinSlots) ? cfg.roletaWinSlots : []).map(Number).filter((n) => n >= 0 && n < 8);
    const GAME_COPY = {
      roleta: { overline: 'Gire e torça', ready: 'Gire e veja onde o ponteiro para.', intro: 'Toque no botão para girar. Se o ponteiro parar num espaço premiado, o cupom aparece na hora.' },
      raspadinha: { overline: 'Raspe e descubra', ready: 'Raspe o cartão para revelar.', intro: 'Passe o dedo ou o mouse sobre o cartão prateado. O resultado aparece por baixo.' },
      caixa: { overline: 'Toque e abra', ready: 'Toque 4 vezes para abrir.', intro: 'Toque na caixa quatro vezes até ela estourar e mostrar o que tem dentro.' }
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

    if (soundOn) {
      const toggle = button('', 'msg-sound-toggle');
      const paint = () => {
        const muted = Sound.isMuted();
        toggle.replaceChildren(icon(muted ? ICONS.soundOff : ICONS.soundOn, 20, 2));
        toggle.setAttribute('aria-pressed', muted ? 'true' : 'false');
        toggle.setAttribute('aria-label', muted ? 'Ligar os sons' : 'Desligar os sons');
        toggle.title = muted ? 'Ligar os sons' : 'Desligar os sons';
      };
      toggle.addEventListener('click', () => { Sound.setMuted(!Sound.isMuted()); paint(); if (!Sound.isMuted()) Sound.tick(); });
      paint();
      app.appendChild(toggle);
    }

    function updateCountdowns() {
      let expired = false;
      list.querySelectorAll('[data-next-at]').forEach((node) => {
        const left = waitText(node.dataset.nextAt);
        if (left) node.textContent = `Libera em ${left}.`;
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
          const left = state.next_at ? waitText(state.next_at) : null;
          details.textContent = left ? `Libera em ${left}.` : 'Disponível mais tarde.';
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

    function renderResult(result) {
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
        const uses = parseInt(result.redeem_limit, 10);
        if (uses > 0) couponWrap.appendChild(make('span', 'msg-coupon-uses', uses === 1 ? 'Válido para 1 uso.' : `Pode ser usado até ${uses} vezes.`));
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
      if (win && cfg.storeUrl) {
        const store = make('a', 'msg-store-link');
        store.href = cfg.storeUrl;
        store.target = '_blank';
        store.rel = 'noopener';
        store.append(icon(ICONS.pin, 20, 2.2), document.createTextNode(cfg.storeLabel || 'Encontrar loja e pedir online'), icon(ICONS.external, 16, 2.2));
        resultCard.appendChild(store);
      }
      if (!win && result.next_at) {
        const left = waitText(result.next_at);
        if (left) {
          const next = make('p', 'msg-result-next');
          next.appendChild(icon(ICONS.clock, 18, 2));
          next.appendChild(document.createTextNode(`Nova jogada neste jogo em ${left} (${absoluteDate(result.next_at)}).`));
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

    function openGame(game) {
      if (!games[game] || !games[game].available) return;
      sfx('unlock');
      busy = false;
      session += 1;
      const mySession = session;
      window.clearInterval(menuTimer);
      const state = games[game];
      const head = addGameIntro(state.label, (GAME_COPY[game] || GAME_COPY.roleta).intro, game);

      // A jogada é registrada uma única vez, no momento em que a pessoa se compromete
      // (girar, primeira raspada ou primeiro toque). O servidor decide o resultado.
      let pending = null;
      const commit = () => {
        if (!pending) {
          back.hidden = true;
          say('');
          pending = api('play', { campaign: slug, game, token }).catch((error) => {
            pending = null;
            if (mySession === session) { back.hidden = false; say(error.message, 'error'); }
            throw error;
          });
        }
        return pending;
      };
      const showResultSoon = (result, delay) => window.setTimeout(() => { if (mySession === session) renderResult(result); }, delay);
      const celebrate = (result) => sfx(result.result === 'win' ? 'win' : 'lose');

      if (game === 'roleta') {
        const stage = make('div', 'msg-wheel-stage');
        stage.appendChild(wheelPointer());
        const labels = Array.isArray(cfg.roletaLabels) ? cfg.roletaLabels.slice(0, 8) : [];
        while (labels.length < 8) labels.push(`Prêmio ${labels.length + 1}`);
        const wheel = bigWheel(labels);
        stage.appendChild(wheel);
        area.appendChild(stage);
        const action = button('Girar a roleta', 'msg-action msg-game-cta');
        action.addEventListener('click', async () => {
          if (busy) return;
          busy = true; action.disabled = true; action.textContent = 'Girando…';
          sfx('unlock'); sfx('whoosh');
          stage.classList.add('is-winding');
          let result;
          try { [result] = await Promise.all([commit(), wait(340)]); }
          catch (e) { stage.classList.remove('is-winding'); busy = false; action.disabled = false; action.textContent = 'Tentar novamente'; return; }
          if (mySession !== session) return;
          stage.classList.remove('is-winding');
          // Para num espaço coerente com o resultado oficial: premiado se ganhou, sem prêmio se não ganhou.
          const win = result.result === 'win';
          const all = [0, 1, 2, 3, 4, 5, 6, 7];
          const pool = all.filter((i) => (win ? winSlots.includes(i) : !winSlots.includes(i)));
          const choices = pool.length ? pool : all;
          const slot = choices[Math.floor(Math.random() * choices.length)];
          const quick = reducedMotion();
          const duration = quick ? 900 : 4600;
          const rotation = (quick ? 360 : 360 * 6) + (360 - slot * 45) % 360 + (Math.random() * 20 - 10);
          stage.classList.add('is-spinning');
          wheel.style.transform = `rotate(${rotation}deg)`;
          trackTicks(wheel, duration, () => sfx('tick'));
          window.setTimeout(() => { if (mySession === session) stage.classList.add('is-slowing'); }, duration * 0.55);
          window.setTimeout(() => {
            stage.classList.remove('is-spinning', 'is-slowing');
            if (mySession !== session) return;
            const landed = wheel.querySelector(`.msg-slice[data-slot="${slot}"]`);
            if (landed) landed.classList.add('is-landed');
            stage.classList.add(win ? 'is-win' : 'is-lose');
            action.textContent = win ? 'Você ganhou!' : 'Não foi dessa vez';
            action.classList.add('is-final', win ? 'is-win' : 'is-lose');
            celebrate(result);
            showResultSoon(result, 1300);
          }, duration + 150);
        });
        area.appendChild(action);
      } else if (game === 'raspadinha') {
        const stage = make('div', 'msg-scratch-stage');
        const under = make('div', 'msg-scratch-under');
        const kicker = make('span', 'msg-scratch-kicker', cfg.name || 'Mini Salgados');
        const big = make('strong', '', 'Raspe para descobrir');
        const small = make('small', '', 'Seu resultado está escondido aqui');
        under.append(kicker, big, small);
        const canvas = document.createElement('canvas');
        canvas.className = 'msg-scratch-cover'; canvas.width = 600; canvas.height = 320;
        canvas.setAttribute('aria-label', 'Cartão prateado para raspar'); canvas.setAttribute('role', 'img');
        stage.appendChild(under); stage.appendChild(canvas); area.appendChild(stage);
        const meter = make('div', 'msg-meter'); const meterFill = make('span'); meter.appendChild(meterFill);
        meter.setAttribute('aria-hidden', 'true');
        area.appendChild(meter);
        const hint = make('p', 'msg-stage-hint', 'Raspe a superfície até a barra encher.');
        hint.setAttribute('aria-live', 'polite');
        area.appendChild(hint);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let drawing = false; let last = null; let scratchedDistance = 0;
        let result = null; let enough = false; let revealed = false;
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
        const reveal = () => {
          if (!enough || !result || revealed || mySession !== session) return;
          revealed = true;
          canvas.classList.add('is-revealed');
          meterFill.style.transform = 'scaleX(1)';
          hint.textContent = result.result === 'win' ? 'Você ganhou! Preparando seu cupom…' : 'Não foi dessa vez.';
          celebrate(result);
          showResultSoon(result, 1700);
        };
        const startPlay = () => {
          commit().then((r) => {
            result = r;
            const win = r.result === 'win';
            stage.classList.add(win ? 'is-win' : 'is-lose');
            kicker.textContent = win ? 'Você ganhou!' : (cfg.name || 'Resultado');
            big.textContent = win ? (r.prize || 'Prêmio surpresa') : 'Não foi dessa vez';
            small.textContent = win ? 'Seu código aparece em seguida' : 'Tente de novo depois do intervalo';
            reveal();
          }).catch(() => { if (enough) hint.textContent = 'Não conseguimos conferir o resultado. Raspe de novo para tentar.'; });
        };
        const scratchPoint = (event) => {
          const rect = canvas.getBoundingClientRect();
          return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
        };
        const strokeTo = (point) => {
          if (!last) { last = point; return; }
          const distance = Math.hypot(point.x - last.x, point.y - last.y);
          scratchedDistance += distance;
          if (distance > 2) sfx('scratch', distance);
          ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(point.x, point.y); ctx.lineWidth = 48; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
          last = point;
          meterFill.style.transform = `scaleX(${Math.min(1, scratchedDistance / 2800)})`;
          if (scratchedDistance >= 2800 && !enough) {
            enough = true;
            if (!result) hint.textContent = 'Conferindo seu resultado…';
            reveal();
          }
        };
        canvas.addEventListener('pointerdown', (event) => {
          if (revealed) return;
          sfx('unlock');
          if (!pending) startPlay();
          drawing = true; last = scratchPoint(event); canvas.setPointerCapture?.(event.pointerId); strokeTo(last); event.preventDefault();
        });
        canvas.addEventListener('pointermove', (event) => { if (!drawing) return; strokeTo(scratchPoint(event)); event.preventDefault(); });
        const endStroke = () => { drawing = false; last = null; };
        canvas.addEventListener('pointerup', endStroke); canvas.addEventListener('pointercancel', endStroke); canvas.addEventListener('pointerleave', endStroke);
      } else {
        const stage = make('div', 'msg-box-stage');
        const box = make('button', 'msg-box-illustration', ''); box.type = 'button'; box.setAttribute('aria-label', 'Toque para abrir a caixa');
        box.appendChild(giftBox());
        const surprise = make('span', 'msg-box-reveal'); surprise.hidden = true;
        box.appendChild(surprise);
        const dots = make('div', 'msg-taps'); dots.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 4; i += 1) dots.appendChild(make('i'));
        const progress = make('p', 'msg-stage-hint', 'Toque 4 vezes para abrir a caixa.');
        progress.setAttribute('aria-live', 'polite');
        stage.appendChild(box); stage.appendChild(dots); stage.appendChild(progress); area.appendChild(stage);
        let taps = 0; let result = null; let opened = false;
        const paintTaps = () => {
          Array.from(dots.children).forEach((dot, i) => dot.classList.toggle('is-on', i < taps));
          for (let n = 1; n <= 3; n += 1) box.classList.toggle(`has-crack-${n}`, taps >= n);
        };
        const open = () => {
          if (taps < 4 || !result || opened || mySession !== session) return;
          opened = true;
          const win = result.result === 'win';
          sfx('burst');
          box.classList.add('is-open', win ? 'is-win' : 'is-lose');
          box.setAttribute('aria-label', 'Caixa aberta');
          surprise.textContent = win ? (result.prize || 'Você ganhou!') : 'Não foi dessa vez';
          surprise.hidden = false;
          progress.textContent = win ? 'Você ganhou! Preparando seu cupom…' : 'A caixa estava vazia desta vez.';
          window.setTimeout(() => { if (mySession === session) celebrate(result); }, 420);
          showResultSoon(result, 2100);
        };
        box.addEventListener('click', () => {
          if (opened || taps >= 4) return;
          sfx('unlock');
          taps += 1;
          box.classList.remove('is-tapped'); void box.offsetWidth; box.classList.add('is-tapped');
          paintTaps();
          if (taps === 1) {
            commit().then((r) => { result = r; open(); }).catch(() => {
              taps = 0; paintTaps();
              progress.textContent = 'Não conseguimos registrar sua jogada. Toque na caixa para tentar de novo.';
            });
          }
          if (taps < 4) {
            sfx('crack', taps);
            progress.textContent = `Mais ${4 - taps} toque${4 - taps === 1 ? '' : 's'} para estourar.`;
          } else {
            progress.textContent = result ? '' : 'Abrindo…';
            open();
          }
        });
      }
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
      sfx('unlock');
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
