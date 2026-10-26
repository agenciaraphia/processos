/* Dra. Célia Alcântara · interações do site (carregado pelo template de Rodapé). */
(function () {
  if (window.__dcaInit) return;
  window.__dcaInit = true;

  var doc = document.documentElement;
  var editor = document.body.classList.contains('elementor-editor-active');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Revelação ao rolar ---- */
  if (!editor && 'IntersectionObserver' in window) {
    doc.classList.add('dca-js');

    // Escalonamento: filhos .dca-reveal dentro de .dca-stagger entram em sequência
    document.querySelectorAll('.dca-stagger').forEach(function (group) {
      group.querySelectorAll('.dca-reveal').forEach(function (el, i) {
        el.style.setProperty('--d', Math.min(i * 70, 560) + 'ms');
      });
    });
    document.querySelectorAll('.dca-load').forEach(function (el, i) {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i * 110 + 80) + 'ms');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    document.querySelectorAll('.dca-reveal, .dca-img-reveal, .dca-joint, .dca-arch, .dca-circle, .dca-signature, .dca-timeline li')
      .forEach(function (el) { io.observe(el); });

    requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.add('dca-ready'); }); });
    // Segurança: nunca deixar conteúdo escondido
    setTimeout(function () {
      document.querySelectorAll('.dca-reveal:not(.is-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('is-in');
      });
    }, 2500);
  }

  /* ---- Linha do tempo: a "coluna" se desenha conforme a rolagem ---- */
  var timelines = document.querySelectorAll('.dca-timeline');
  function paintTimelines() {
    timelines.forEach(function (tl) {
      var r = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.75 - r.top) / r.height;
      tl.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    });
  }

  /* ---- Cabeçalho: compacta ao rolar, esconde ao descer, volta ao subir ---- */
  var header = document.querySelector('.dca-header');
  var wa = document.querySelector('.dca-wa');
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      var menuOpen = document.body.classList.contains('dca-lock');
      header.classList.toggle('is-hidden', !menuOpen && y > 480 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove('is-hidden');
    }
    if (wa) wa.classList.toggle('is-visible', y > 420);
    if (timelines.length && !reduce) paintTimelines();
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- Submenu de especialidades ---- */
  document.querySelectorAll('.dca-nav .has-sub').forEach(function (li) {
    var btn = li.querySelector('button');
    var closeT;
    function open(v) { li.classList.toggle('is-open', v); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); }
    btn.addEventListener('click', function () { open(!li.classList.contains('is-open')); });
    li.addEventListener('mouseenter', function () { clearTimeout(closeT); open(true); });
    li.addEventListener('mouseleave', function () { closeT = setTimeout(function () { open(false); }, 160); });
    li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) open(false); });
    li.addEventListener('keydown', function (e) { if (e.key === 'Escape') { open(false); btn.focus(); } });
  });

  /* ---- Menu mobile ---- */
  var burger = document.querySelector('.dca-burger');
  var drawer = document.getElementById('dca-drawer');
  if (burger && drawer) {
    drawer.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--i', i); });
    function setMenu(v) {
      burger.setAttribute('aria-expanded', v ? 'true' : 'false');
      burger.setAttribute('aria-label', v ? 'Fechar menu' : 'Abrir menu');
      drawer.classList.toggle('is-open', v);
      drawer.toggleAttribute('inert', !v);
      document.body.classList.toggle('dca-lock', v);
      if (header) {
        header.classList.remove('is-hidden');
        drawer.style.setProperty('--dca-drawer-top', header.getBoundingClientRect().bottom + 'px');
      }
    }
    drawer.setAttribute('inert', '');
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
  }

  /* ---- Página atual no menu ---- */
  var here = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.dca-nav a, .dca-drawer a').forEach(function (a) {
    var p = (a.getAttribute('href') || '').replace(location.origin, '').replace(/\/+$/, '') || '/';
    if (p === here && p.indexOf('#') === -1) {
      a.setAttribute('aria-current', 'page');
      var sub = a.closest('.has-sub');
      if (sub) sub.classList.add('is-current');
    }
  });

  /* ---- Cartões que viram: toque e teclado ---- */
  document.querySelectorAll('.dca-flip').forEach(function (card) {
    function flip() {
      var v = !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped', v);
      card.setAttribute('aria-pressed', v ? 'true' : 'false');
    }
    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  /* ---- Sumário lateral: destaca a seção em leitura ---- */
  var toc = document.querySelector('.dca-toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = {};
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && links[e.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
          links[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(links).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---- Ano automático no rodapé ---- */
  document.querySelectorAll('[data-dca-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
