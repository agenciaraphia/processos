/* Mini Salgados Games — interações do painel administrativo */
(() => {
  'use strict';

  const all = (root, selector) => Array.from(root.querySelectorAll(selector));
  const wrap = document.querySelector('.msg-admin-wrap');
  if (!wrap) return;

  // Copiar shortcode
  all(wrap, '[data-msg-copy]').forEach((btn) => {
    const label = btn.querySelector('span');
    btn.addEventListener('click', () => {
      const done = () => {
        btn.classList.add('is-done');
        if (label) label.textContent = 'Copiado!';
        window.setTimeout(() => { btn.classList.remove('is-done'); if (label) label.textContent = 'Copiar'; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.msgCopy).then(done).catch(() => window.prompt('Copie o shortcode:', btn.dataset.msgCopy));
      else window.prompt('Copie o shortcode:', btn.dataset.msgCopy);
    });
  });

  // Confirmação antes de ações destrutivas
  all(wrap, 'form[data-msg-confirm]').forEach((form) => {
    form.addEventListener('submit', (event) => { if (!window.confirm(form.dataset.msgConfirm)) event.preventDefault(); });
  });

  // Campos que aparecem conforme outra escolha: data-msg-show-when="campo=valor1,valor2"
  const conditional = all(wrap, '[data-msg-show-when]');
  const syncConditional = () => conditional.forEach((el) => {
    const [name, values] = el.dataset.msgShowWhen.split('=');
    const form = el.closest('form');
    if (!form) return;
    const control = form.querySelector(`[name="${name}"]:checked`) || form.querySelector(`select[name="${name}"]`);
    el.hidden = !control || !values.split(',').includes(control.value);
  });
  if (conditional.length) { wrap.addEventListener('change', syncConditional); syncConditional(); }

  // Prêmios: só os jogos habilitados na campanha escolhida
  const prizeForm = wrap.querySelector('[data-msg-prize-form]');
  if (prizeForm) {
    const campaign = prizeForm.querySelector('[data-msg-prize-campaign]');
    const hint = prizeForm.querySelector('[data-msg-game-hint]');
    const games = all(prizeForm, 'input[name="game"]');
    const syncGames = () => {
      const option = campaign.options[campaign.selectedIndex];
      const enabled = (option ? option.dataset.games || '' : '').split(',');
      let firstEnabled = null;
      games.forEach((input) => {
        input.disabled = !enabled.includes(input.value);
        if (!input.disabled && !firstEnabled) firstEnabled = input;
      });
      if (games.some((input) => input.checked && input.disabled) && firstEnabled) firstEnabled.checked = true;
      if (hint) hint.hidden = games.every((input) => !input.disabled);
    };
    campaign.addEventListener('change', syncGames);
    syncGames();
  }

  // Participantes: seleção em lote
  const leadsForm = document.getElementById('msg-delete-leads-form');
  if (leadsForm) {
    const selectAll = document.getElementById('msg-select-all-leads');
    const checks = all(leadsForm, '.msg-lead-check');
    const count = document.getElementById('msg-selected-count');
    const del = document.getElementById('msg-delete-selected');
    const update = () => {
      const n = checks.filter((x) => x.checked).length;
      count.textContent = n === 0 ? 'Nenhum selecionado' : `${n} selecionado${n === 1 ? '' : 's'}`;
      del.disabled = n === 0;
      selectAll.checked = n > 0 && n === checks.length;
      selectAll.indeterminate = n > 0 && n < checks.length;
      checks.forEach((x) => x.closest('tr').classList.toggle('is-selected', x.checked));
    };
    selectAll.addEventListener('change', () => { checks.forEach((x) => { x.checked = selectAll.checked; }); update(); });
    checks.forEach((x) => x.addEventListener('change', update));
    leadsForm.addEventListener('submit', (event) => {
      const n = checks.filter((x) => x.checked).length;
      if (!n || !window.confirm(`Apagar ${n} participante${n === 1 ? '' : 's'} e as jogadas vinculadas? Essa ação não pode ser desfeita.`)) event.preventDefault();
    });
    update();
  }

  // Campanha: cores, fontes, logo e prévia ao vivo
  const campaignForm = wrap.querySelector('[data-msg-campaign-form]');
  if (!campaignForm) return;
  const preview = campaignForm.querySelector('[data-msg-preview-root]');
  const loadedFonts = new Set(['Fredoka One', 'Montserrat']);
  const singleWeight = ['Fredoka One', 'Lilita One', 'Chewy', 'Bebas Neue', 'Anton'];
  const loadFont = (family) => {
    if (!family || loadedFonts.has(family)) return;
    loadedFonts.add(family);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}${singleWeight.includes(family) ? '' : ':wght@400;600;700'}&display=swap`;
    document.head.appendChild(link);
  };
  const onColor = (hex) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return '#ffffff';
    const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const n = parseInt(m[1], 16);
    const l = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
    return 1.05 / (l + 0.05) >= (l + 0.05) / 0.0609 ? '#ffffff' : '#221b19';
  };
  const color = (name) => campaignForm.querySelector(`input[name="${name}"]`).value;
  const renderPreview = () => {
    if (!preview) return;
    const primary = color('primary_color');
    const secondary = color('secondary_color');
    preview.style.setProperty('--pv-primary', primary);
    preview.style.setProperty('--pv-secondary', secondary);
    preview.style.setProperty('--pv-on-primary', onColor(primary));
    preview.style.setProperty('--pv-on-secondary', onColor(secondary));
    const heading = campaignForm.querySelector('[data-msg-font="heading_font_family"]').value;
    const body = campaignForm.querySelector('[data-msg-font="font_family"]').value;
    loadFont(heading); loadFont(body);
    preview.style.setProperty('--pv-heading', `'${heading}', sans-serif`);
    preview.style.setProperty('--pv-body', `'${body}', sans-serif`);
    all(campaignForm, '[data-msg-preview]').forEach((input) => {
      const out = preview.querySelector(`[data-msg-preview-out="${input.dataset.msgPreview}"]`);
      if (out) out.textContent = input.value.trim() || (input.dataset.msgPreview === 'name' ? 'Nome da campanha' : 'Seu texto de abertura aparece aqui.');
    });
  };

  all(campaignForm, '.msg-color').forEach((pair) => {
    const picker = pair.querySelector('[data-msg-color]');
    const text = pair.querySelector('[data-msg-color-text]');
    picker.addEventListener('input', () => { text.value = picker.value.toUpperCase(); renderPreview(); });
    text.addEventListener('input', () => {
      const value = text.value.trim().startsWith('#') ? text.value.trim() : `#${text.value.trim()}`;
      if (/^#[0-9a-f]{6}$/i.test(value)) { picker.value = value.toLowerCase(); renderPreview(); }
    });
  });

  const logo = campaignForm.querySelector('[data-msg-logo]');
  const thumb = campaignForm.querySelector('[data-msg-logo-thumb]');
  const previewLogo = campaignForm.querySelector('[data-msg-preview-logo]');
  const placeholder = thumb ? thumb.innerHTML : '';
  const syncLogo = () => {
    const url = logo.value.trim();
    if (thumb) {
      thumb.replaceChildren();
      if (url) { const img = document.createElement('img'); img.src = url; img.alt = ''; thumb.appendChild(img); }
      else thumb.innerHTML = placeholder;
    }
    if (previewLogo) { previewLogo.hidden = !url; if (url) previewLogo.src = url; }
  };
  if (logo) logo.addEventListener('change', syncLogo);

  const mediaButton = campaignForm.querySelector('[data-msg-media]');
  if (mediaButton) {
    if (!(window.wp && window.wp.media)) mediaButton.hidden = true;
    else {
      let frame;
      mediaButton.addEventListener('click', () => {
        if (!frame) {
          frame = window.wp.media({ title: 'Escolher logo da campanha', button: { text: 'Usar esta imagem' }, library: { type: 'image' }, multiple: false });
          frame.on('select', () => { const file = frame.state().get('selection').first().toJSON(); logo.value = file.url; syncLogo(); });
        }
        frame.open();
      });
    }
  }

  // Avisa quando nenhum (ou todos os) espaço(s) da roleta dá cupom.
  const slots = all(campaignForm, 'input[name="roleta_win_slots[]"]');
  const noneAlert = campaignForm.querySelector('[data-msg-slots-alert]');
  const allAlert = campaignForm.querySelector('[data-msg-slots-all]');
  const roletaOn = campaignForm.querySelector('input[name="games[]"][value="roleta"]');
  const syncSlots = () => {
    const checked = slots.filter((x) => x.checked).length;
    const active = !roletaOn || roletaOn.checked;
    if (noneAlert) noneAlert.hidden = !active || checked > 0;
    if (allAlert) allAlert.hidden = !active || checked < slots.length;
  };
  if (slots.length) { campaignForm.addEventListener('change', syncSlots); syncSlots(); }

  campaignForm.addEventListener('input', renderPreview);
  campaignForm.addEventListener('change', renderPreview);
  renderPreview();
})();
