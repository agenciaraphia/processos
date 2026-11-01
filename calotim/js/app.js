/* Calotim 0.8 - interface. Regras de cálculo ficam em js/core.js (valores em centavos). */
const C = window.CalotimCore;
const A = window.CalotimAvatars;
const STORAGE_KEY = 'calotim_mvp_v2';
const LEGACY_STORAGE_KEY = 'calotim_mvp_v1';
const DEFAULT_AVATAR = A.DEFAULT;
const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const MAX_SHARE_CHARS = 30000;
const state = loadState();
let storageOk = true;
let currentView = 'dashboard';
let currentAccountId = null;
let lastRenderedAccountId = null;
let categoryFilter = '';
let detailTab = 'items';
let flashLineId = null;
let modalAction = null;
let sharedAccount = null;
let sharedNameLookup = null;
let toastTimer = null;
let toastRemaining = 0;
let toastStarted = 0;
const liveSignatures = new Map();
const counterMemory = new Map();
const splitMemory = new Map();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactLayout = window.matchMedia('(max-width: 1023px)');
const FEE_TEMPLATES = {
  service: { title: 'Taxa de serviço', kind: 'fee', mode: 'percent', value: '10' },
  couvert: { title: 'Couvert artístico', kind: 'fee', mode: 'fixed', value: '' },
  booking: { title: 'Taxa de reserva', kind: 'fee', mode: 'fixed', value: '' },
  discount: { title: 'Desconto', kind: 'discount', mode: 'percent', value: '' },
  courtesy: { title: 'Cortesia', kind: 'discount', mode: 'fixed', value: '' }
};
const KINDS = [
  { value: 'Restaurante', label: 'Restaurante ou bar', icon: 'utensils-crossed', css: 'kind-restaurante' },
  { value: 'Viagem', label: 'Viagem', icon: 'plane', css: 'kind-viagem' },
  { value: 'Evento', label: 'Evento ou encontro', icon: 'party-popper', css: 'kind-evento' },
  { value: 'Outra', label: 'Outra', icon: 'shapes', css: 'kind-outra' }
];
const CATEGORY_ICONS = { 'Alimentação': 'utensils', 'Bebidas': 'beer', 'Hospedagem': 'bed-double', 'Transporte': 'car', 'Combustível': 'fuel', 'Passeios e ingressos': 'ticket', 'Compras': 'shopping-bag', 'Outras': 'package' };
const TITLES = { dashboard: 'Visão geral', accounts: 'Minhas divisões', people: 'Amigos', settings: 'Configurações', detail: 'Minhas divisões', share: 'Extrato compartilhado' };

/* ---------- armazenamento ---------- */
function loadState() {
  for (const key of [STORAGE_KEY, LEGACY_STORAGE_KEY]) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return C.normalizeState(JSON.parse(raw));
    } catch { /* tenta a próxima chave */ }
  }
  return C.normalizeState(null);
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageOk = true; updateSaveStatus(true); return true; }
  catch {
    if (storageOk) toast('Não foi possível salvar neste navegador. Exporte um backup para não perder os dados.');
    storageOk = false; updateSaveStatus(false); return false;
  }
}
function save() { persist(); renderAll(); }
function updateSaveStatus(ok) {
  const box = document.getElementById('save-status');
  if (!box) return;
  box.classList.toggle('failed', !ok);
  document.getElementById('save-status-title').textContent = ok ? 'Salvo neste navegador' : 'Não foi possível salvar';
  document.getElementById('save-status-sub').textContent = ok ? `Última alteração às ${timeNow()}` : 'Exporte um backup agora';
  box.classList.remove('saved'); void box.offsetWidth; if (ok) box.classList.add('saved');
}

/* ---------- utilidades de interface ---------- */
const money = C.formatMoney;
const id = C.newId;
function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
// Ícone do sprite (index.html). `name` vem sempre do código, nunca de dados do usuário.
function icon(name, extraClass = '') { return `<svg class="icon${extraClass ? ' ' + extraClass : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`; }
function timeNow() { return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }
function plural(count, one, many) { return `${count} ${count === 1 ? one : many}`; }
function normalizeSearch(value) { return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('pt-BR').trim(); }
function kindInfo(kind) {
  const value = String(kind || '');
  return KINDS.find(item => item.value === value) || (value.includes('Restaurante') ? KINDS[0] : KINDS.find(item => value.startsWith(item.value)) || KINDS[3]);
}
function kindTile(kind, extraClass = '') { const info = kindInfo(kind); return `<span class="kind-tile ${info.css} ${extraClass}" aria-hidden="true">${icon(info.icon)}</span>`; }
function emptyState({ art = 'receipt', tone = '', title, text = '', action = '', compact = false }) {
  return `<div class="empty${compact ? ' compact' : ''}"><span class="empty-art ${tone}" aria-hidden="true">${icon(art)}</span><b>${title}</b>${text ? `<p>${text}</p>` : ''}${action}</div>`;
}

/* ---------- avisos (toast) ---------- */
function toastKind(message) {
  return /^(Informe|Digite|Já existe|Selecione|Não |Antes de|Essa pessoa não|Arquivo|Este amigo|Esta divisão ficou|O link público|A soma|O arquivo)/.test(message) ? 'warn' : 'ok';
}
function hideToast() {
  const element = document.getElementById('toast');
  element.classList.remove('show', 'paused');
  clearTimeout(toastTimer);
}
function startToastTimer(ms) { clearTimeout(toastTimer); toastRemaining = ms; toastStarted = Date.now(); toastTimer = setTimeout(hideToast, ms); }
function toast(message, action) {
  const element = document.getElementById('toast');
  const kind = toastKind(message);
  const duration = action ? 8000 : 3200;
  element.className = 'toast' + (kind === 'warn' ? ' warn' : '');
  element.innerHTML = icon(kind === 'warn' ? 'triangle-alert' : 'circle-check');
  const text = document.createElement('span'); text.className = 'toast-text'; text.textContent = message; element.append(text);
  if (action) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'toast-action'; button.textContent = action.label;
    button.onclick = () => { hideToast(); action.run(); };
    const bar = document.createElement('span'); bar.className = 'toast-progress';
    bar.style.animation = `toast-progress ${duration}ms linear forwards`;
    element.append(button, bar);
  }
  void element.offsetWidth;
  element.classList.add('show');
  startToastTimer(duration);
}
function pauseToast() {
  const element = document.getElementById('toast');
  if (!element.classList.contains('show') || element.classList.contains('paused')) return;
  clearTimeout(toastTimer); toastRemaining -= Date.now() - toastStarted; element.classList.add('paused');
}
function resumeToast() {
  const element = document.getElementById('toast');
  if (!element.classList.contains('show') || !element.classList.contains('paused')) return;
  element.classList.remove('paused'); startToastTimer(Math.max(1200, toastRemaining));
}

/* ---------- confirmação ---------- */
function confirmDialog({ title, message, confirmLabel = 'Confirmar', danger = false }) {
  return new Promise(resolve => {
    const dialog = document.getElementById('confirm-dialog');
    const ok = document.getElementById('confirm-ok');
    const cancel = document.getElementById('confirm-cancel');
    document.getElementById('confirm-title').textContent = title;
    const body = document.getElementById('confirm-message');
    body.textContent = '';
    String(message || '').split('\n').filter(Boolean).forEach(line => { const p = document.createElement('p'); p.textContent = line; body.append(p); });
    document.getElementById('confirm-icon').classList.toggle('danger', danger);
    ok.textContent = confirmLabel;
    ok.classList.toggle('danger', danger);
    let settled = false;
    const done = value => {
      if (settled) return; settled = true;
      ok.onclick = cancel.onclick = dialog.oncancel = dialog.onclick = null;
      if (dialog.open) dialog.close();
      resolve(value);
    };
    ok.onclick = () => done(true);
    cancel.onclick = () => done(false);
    dialog.oncancel = event => { event.preventDefault(); done(false); };
    dialog.onclick = event => { if (event.target === dialog) done(false); };
    dialog.showModal();
    (danger ? cancel : ok).focus();
  });
}

/* ---------- navegação ---------- */
function showView(name) {
  const previous = currentView;
  currentView = name;
  document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === 'view-' + name));
  const navTarget = name === 'detail' ? 'accounts' : name;
  document.querySelectorAll('.nav-item, .bnav-item').forEach(button => {
    const active = button.dataset.view === navTarget;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  document.getElementById('page-title').textContent = TITLES[name] || 'Calotim';
  document.body.classList.toggle('readonly', name === 'share');
  document.body.classList.toggle('on-detail', name === 'detail');
  document.getElementById('new-account-top').hidden = ['dashboard', 'accounts', 'share'].includes(name);
  updateFab();
  moveNavPill();
  if (previous !== name) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (name !== 'detail') setLiveOpen(false);
  }
}
function moveNavPill() {
  const pill = document.querySelector('.nav-pill');
  const active = document.querySelector('.side-nav .nav-item.active');
  if (!pill) return;
  if (!active || !active.offsetHeight) { pill.classList.remove('ready'); return; }
  pill.style.setProperty('--pill-y', active.offsetTop + 'px');
  pill.style.height = active.offsetHeight + 'px';
  requestAnimationFrame(() => pill.classList.add('ready'));
}
function updateFab() {
  const fab = document.getElementById('bnav-fab');
  const label = currentView === 'detail' ? 'Adicionar item' : currentView === 'people' ? 'Cadastrar amigo' : 'Nova divisão';
  fab.setAttribute('aria-label', label);
}
function primaryActionForView() {
  if (currentView === 'detail') addExpense();
  else if (currentView === 'people') addPersonModal();
  else createAccountModal();
}

/* ---------- janelas ---------- */
function openModal(title, html, action, submitLabel = 'Salvar') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-submit').textContent = submitLabel;
  modalAction = action;
  const dialog = document.getElementById('modal');
  if (!dialog.open) dialog.showModal();
  document.getElementById('modal-content').scrollTop = 0;
}
function closeModal() { const dialog = document.getElementById('modal'); if (dialog.open) dialog.close(); }
function field(label, name, placeholder = '', type = 'text', value = '') {
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(value)}" ${type === 'number' ? 'min="0" step="0.01" inputmode="decimal"' : ''} required></div>`;
}
function formData() { return Object.fromEntries(new FormData(document.getElementById('modal-form')).entries()); }
function setRadio(name, value) {
  const input = [...document.querySelectorAll(`#modal-content input[name="${name}"]`)].find(item => item.value === value);
  if (input) input.checked = true;
}

/* ---------- dados ---------- */
function getAccount(accountId) { return state.accounts.find(account => account.id === accountId); }
function person(personId) { return state.people.find(item => item.id === personId); }
function lookupName(personId, account) {
  const current = person(personId); if (current?.name) return current.name;
  const scopes = account ? [account, ...state.accounts] : state.accounts;
  for (const scope of scopes) { const entry = scope.people.find(item => item.personId === personId); if (entry?.displayName) return entry.displayName; }
  return 'Participante';
}
// Dados de exibição de um participante de uma divisão (cadastro atual ou, se excluído, o nome guardado).
function memberView(account, personId) {
  const current = person(personId);
  const entry = account.people.find(item => item.personId === personId);
  return { id: personId, name: current?.name || entry?.displayName || 'Participante', avatar: current?.avatar || entry?.avatar || DEFAULT_AVATAR };
}
function snapshotAccount(account) { return JSON.stringify(account); }
function restoreAccount(snapshot, index) {
  const restored = C.normalizeAccount(JSON.parse(snapshot));
  const at = state.accounts.findIndex(account => account.id === restored.id);
  if (at >= 0) state.accounts[at] = restored; else state.accounts.splice(Math.min(index ?? 0, state.accounts.length), 0, restored);
  save();
  if (currentView === 'detail' || at < 0) openAccount(restored.id);
  toast('Alteração desfeita.');
}

/* ---------- avatares ---------- */
function avatarHtml(participant, extraClass = '') {
  const key = A.resolve(participant?.avatar);
  if (!key && participant?.avatar) {
    const initial = String(participant?.name || '?').trim().slice(0, 1).toUpperCase() || '?';
    return `<span class="avatar initial ${extraClass}" aria-hidden="true">${escapeHtml(initial)}</span>`;
  }
  return `<span class="avatar ${extraClass}" aria-hidden="true">${A.svg(key || DEFAULT_AVATAR)}</span>`;
}
function avatarPicker(selected = DEFAULT_AVATAR, name = 'avatar') {
  const chosen = A.resolve(selected) || DEFAULT_AVATAR;
  return `<div class="field"><span class="field-label" id="${name}-label">Escolha um personagem</span><div class="avatar-picker" role="radiogroup" aria-labelledby="${name}-label">${A.list.map(item => `<label class="avatar-choice" title="${escapeHtml(item.label)}"><input type="radio" name="${name}" value="${item.key}" aria-label="${escapeHtml(item.label)}" ${item.key === chosen ? 'checked' : ''}><span class="avatar">${A.svg(item.key)}</span></label>`).join('')}</div></div>`;
}
function avatarStack(account, max = 4) {
  const active = C.activeMembers(account);
  if (!active.length) return '<span class="split-caption">Sem participantes</span>';
  const shown = active.slice(0, max).map(entry => avatarHtml(memberView(account, entry.personId), 'avatar-sm')).join('');
  const more = active.length > max ? `<span class="avatar-more">+${active.length - max}</span>` : '';
  return `<span class="avatar-stack">${shown}${more}</span>`;
}

/* ---------- contadores e barra de divisão ---------- */
function countMarkup(value, key, kind = 'money') {
  const rounded = Math.round(Number(value) || 0);
  return `<span class="num" data-count="${rounded}" data-count-key="${escapeHtml(key)}" data-count-kind="${kind}">${kind === 'money' ? money(rounded) : rounded}</span>`;
}
function animateNumber(element, to, key, format) {
  const from = counterMemory.has(key) ? counterMemory.get(key) : 0;
  counterMemory.set(key, to);
  if (reduceMotion.matches || from === to) { element.textContent = format(to); return; }
  const duration = 720;
  const start = performance.now();
  element.textContent = format(from);
  const frame = now => {
    if (!element.isConnected) return;
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    element.textContent = format(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
function hydrateCounters(root) {
  root.querySelectorAll('[data-count]').forEach(element => {
    const format = element.dataset.countKind === 'int' ? value => String(value) : money;
    animateNumber(element, Number(element.dataset.count) || 0, element.dataset.countKey, format);
  });
}
function personColor(account, personId) {
  const index = account.people.findIndex(entry => entry.personId === personId);
  return (Math.max(0, index) % 8) + 1;
}
function splitParts(account, values) {
  return account.people
    .map(entry => [entry.personId, Math.max(0, values.shareTotals[entry.personId] || 0)])
    .filter(([, amount]) => amount > 0);
}
function splitBarHtml(account, values, key, size = '') {
  const parts = splitParts(account, values);
  const sum = parts.reduce((total, [, amount]) => total + amount, 0);
  if (!sum) return `<span class="split-bar empty ${size}" role="img" aria-label="Nenhum valor lançado ainda"></span>`;
  const label = 'Divisão: ' + parts.map(([personId, amount]) => `${lookupName(personId, account)} ${money(amount)}`).join(', ');
  return `<span class="split-bar ${size}" data-split-key="${escapeHtml(key)}" role="img" aria-label="${escapeHtml(label)}">${parts.map(([personId, amount]) => `<span class="split-seg c${personColor(account, personId)}" data-person="${escapeHtml(personId)}" data-w="${(amount / sum * 100).toFixed(3)}" data-tip="${escapeHtml(lookupName(personId, account))} · ${money(amount)}"></span>`).join('')}</span>`;
}
// Anima a barra só com transform (FLIP): cada segmento sai da posição e largura anteriores para as novas.
function hydrateSplitBars(root) {
  root.querySelectorAll('.split-bar[data-split-key]').forEach(bar => {
    const key = bar.dataset.splitKey;
    const previous = splitMemory.get(key);
    const segments = [...bar.querySelectorAll('.split-seg')];
    const layout = {};
    let cursor = 0;
    segments.forEach(segment => {
      const width = Number(segment.dataset.w) || 0;
      segment.style.width = width + '%';
      layout[segment.dataset.person] = { left: cursor, width };
      cursor += width;
    });
    splitMemory.set(key, layout);
    if (reduceMotion.matches) return;
    const moving = [];
    segments.forEach(segment => {
      const now = layout[segment.dataset.person];
      const before = previous ? (previous[segment.dataset.person] || { left: now.left, width: 0 }) : { left: 0, width: 0 };
      if (!now.width || (Math.abs(before.left - now.left) < 0.01 && Math.abs(before.width - now.width) < 0.01)) return;
      const scale = Math.max(before.width, 0.001) / now.width;
      const shift = (before.left - now.left) / now.width * 100;
      segment.style.transition = 'none';
      segment.style.transform = `translateX(${shift}%) scaleX(${scale})`;
      moving.push(segment);
    });
    if (!moving.length) return;
    void bar.offsetWidth;
    requestAnimationFrame(() => moving.forEach(segment => { segment.style.transition = ''; segment.style.transform = ''; }));
  });
}
function hydrate(root) { hydrateCounters(root); hydrateSplitBars(root); }

/* ---------- divisões ---------- */
function createAccountModal(existingAccountId = null) {
  const existing = existingAccountId ? getAccount(existingAccountId) : null;
  const currentKind = existing ? kindInfo(existing.kind).value : 'Restaurante';
  startPicker();
  openModal(existing ? 'Editar divisão' : 'Nova divisão', `${field('Nome da divisão', 'name', 'Ex.: Aniversário, viagem para Recife', 'text', existing?.name || '')}
    <div class="field"><span class="field-label" id="kind-label">Tipo</span><div class="choice-grid four" role="radiogroup" aria-labelledby="kind-label">${KINDS.map(kind => `<label class="choice"><input type="radio" name="kind" value="${kind.value}" ${kind.value === currentKind ? 'checked' : ''}><span class="choice-card">${icon(kind.icon)}<b>${kind.label}</b></span></label>`).join('')}</div></div>
    <div class="field"><label for="place">Local (opcional)</label><input id="place" name="place" type="text" placeholder="Ex.: Restaurante do Zé" value="${escapeHtml(existing?.place || '')}"></div>
    ${existing ? '' : pickerHtml()}`, data => {
    if (!data.name.trim()) { toast('Informe o nome da divisão.'); return; }
    if (existing) {
      existing.name = data.name.trim(); existing.kind = data.kind || existing.kind; existing.place = (data.place || '').trim();
      save(); closeModal(); openAccount(existing.id); toast('Divisão atualizada.');
    } else {
      const account = { id: id(), name: data.name.trim(), kind: data.kind || 'Outra', place: (data.place || '').trim(), createdAt: new Date().toISOString(), people: [], items: [], fees: [], memberPayments: [] };
      const added = applyPicker(account);
      state.accounts.unshift(account);
      save(); closeModal(); openAccount(account.id);
      toast(added ? 'Divisão criada com os participantes.' : 'Divisão criada. Adicione quem vai participar quando quiser.');
    }
  }, existing ? 'Salvar alterações' : 'Criar divisão');
  if (!existing) renderPicker(true);
}

async function deleteAccount(accountId) {
  const account = getAccount(accountId); if (!account) return;
  const confirmed = await confirmDialog({ title: `Excluir "${account.name}"?`, message: 'Os itens, os participantes vinculados e o histórico desta divisão serão apagados.\nVocê poderá desfazer logo em seguida.', confirmLabel: 'Excluir divisão', danger: true });
  if (!confirmed) return;
  const snapshot = snapshotAccount(account); const index = state.accounts.indexOf(account);
  state.accounts = state.accounts.filter(item => item.id !== accountId);
  currentAccountId = null; save(); showView('accounts');
  toast('Divisão excluída.', { label: 'Desfazer', run: () => { restoreAccount(snapshot, index); } });
}

/* ---------- participantes ---------- */
// Seletor de participantes: caixa de seleção com os amigos cadastrados e cadastro rápido de novo amigo.
let picker = null;
function startPicker(excludeIds = []) { picker = { selected: [], excluded: new Set(excludeIds), search: '' }; }
function normalizeName(value) { return String(value || '').trim().toLocaleLowerCase('pt-BR'); }
function nameTaken(name, exceptId = null) {
  const wanted = normalizeName(name);
  return state.people.some(item => item.id !== exceptId && normalizeName(item.name) === wanted)
    || (picker?.selected || []).some(item => item.personId !== exceptId && normalizeName(item.name) === wanted);
}
function coupleTag(weight) { return Number(weight) > 1 ? `<em class="tag tag-couple">${icon('heart')}Casal</em>` : ''; }
function coupleCheckbox(name, checked = false) {
  return `<label class="check-option couple-check"><input type="checkbox" ${name === 'pk-couple' ? 'id="pk-couple"' : `name="${name}" value="yes"`} ${checked ? 'checked' : ''}><span>É um casal <small>(conta como 2 pessoas na divisão)</small></span></label>`;
}
function pickerHtml() {
  return `<div class="field picker-field"><span class="field-label">Quem vai participar?</span>
    <div id="picker-chips" class="chips"></div>
    <details class="picker-box" id="friend-box"><summary>${icon('users')}<span id="friend-summary">Escolher entre os amigos cadastrados</span>${icon('chevron-down', 'chev')}</summary><div class="picker-panel"><input id="friend-search" type="search" placeholder="Buscar amigo" autocomplete="off" aria-label="Buscar amigo"><div id="friend-options" class="friend-options"></div></div></details>
    <details class="picker-box" id="new-friend-box"><summary>${icon('user-plus')}<span>Cadastrar novo amigo</span>${icon('chevron-down', 'chev')}</summary><div class="picker-panel">
      <div class="field"><label for="pk-name">Nome ou apelido</label><input id="pk-name" type="text" placeholder="Ex.: Ana" autocomplete="off"></div>
      ${coupleCheckbox('pk-couple')}
      ${avatarPicker(DEFAULT_AVATAR, 'pk-avatar')}
      <button type="button" class="button secondary full pk-add-new">${icon('plus')}Adicionar à divisão</button>
    </div></details></div>`;
}
function renderPickerChips() {
  const target = document.getElementById('picker-chips');
  if (!target || !picker) return;
  target.innerHTML = picker.selected.length
    ? picker.selected.map(item => `<span class="chip">${avatarHtml(item)}${escapeHtml(item.name)}${coupleTag(item.weight)}<button type="button" data-picker-remove="${escapeHtml(item.personId)}" aria-label="Remover ${escapeHtml(item.name)}">${icon('x')}</button></span>`).join('')
    : '<span class="chips-empty">Ninguém selecionado ainda.</span>';
}
function renderPicker(initial = false) {
  if (!picker) return;
  const available = state.people.filter(item => !picker.excluded.has(item.id));
  const search = normalizeSearch(picker.search);
  const shown = available.filter(item => !search || normalizeSearch(item.name).includes(search));
  const picked = picker.selected.filter(item => item.existing).length;
  document.getElementById('friend-summary').textContent = available.length ? `Escolher entre os amigos cadastrados (${picked} de ${available.length})` : picker.selected.length ? 'Os amigos novos ficam salvos na sua agenda' : 'Você ainda não tem amigos cadastrados';
  document.getElementById('friend-search').hidden = available.length <= 6;
  document.getElementById('friend-options').innerHTML = shown.length
    ? shown.map(item => `<label class="check-option friend-option"><input type="checkbox" data-picker-friend="${escapeHtml(item.id)}" ${picker.selected.some(sel => sel.personId === item.id) ? 'checked' : ''}>${avatarHtml(item)}<span>${escapeHtml(item.name)}</span>${coupleTag(item.weight)}</label>`).join('')
    : `<p class="chips-empty">${available.length ? 'Nenhum amigo encontrado.' : 'Cadastre o primeiro amigo logo abaixo. Ele fica salvo para as próximas divisões.'}</p>`;
  if (initial) {
    document.getElementById('friend-box').open = available.length > 0;
    document.getElementById('new-friend-box').open = available.length === 0;
  }
  renderPickerChips();
}
function pickerToggleFriend(personId, checked) {
  picker.selected = picker.selected.filter(item => item.personId !== personId);
  const friend = person(personId);
  if (checked && friend) picker.selected.push({ personId: friend.id, name: friend.name, avatar: friend.avatar || DEFAULT_AVATAR, weight: friend.weight > 1 ? 2 : 1, existing: true });
  renderPicker();
}
function pickerRemove(personId) {
  picker.selected = picker.selected.filter(item => item.personId !== personId);
  renderPicker();
}
function pickerAddNew() {
  const nameInput = document.getElementById('pk-name');
  const name = nameInput.value.trim();
  if (!name) { toast('Digite o nome do amigo.'); nameInput.focus(); return; }
  if (nameTaken(name)) { toast('Já existe um amigo com esse nome. Selecione na lista de cadastrados.'); return; }
  const chosen = A.resolve(document.querySelector('input[name="pk-avatar"]:checked')?.value) || DEFAULT_AVATAR;
  picker.selected.push({ personId: id(), name, avatar: chosen, weight: document.getElementById('pk-couple').checked ? 2 : 1, existing: false });
  nameInput.value = ''; document.getElementById('pk-couple').checked = false; nameInput.focus();
  renderPicker();
}
// Aplica a seleção à divisão e cria os cadastros novos na agenda. Retorna quantas pessoas entraram.
function applyPicker(account) {
  let count = 0;
  picker.selected.forEach(item => {
    if (!item.existing) state.people.push({ id: item.personId, name: item.name, weight: item.weight, avatar: item.avatar, createdAt: new Date().toISOString() });
    const entry = account.people.find(current => current.personId === item.personId);
    if (entry) { entry.removed = false; delete entry.removedAt; entry.weight = item.weight; }
    else account.people.push({ personId: item.personId, weight: item.weight });
    count++;
  });
  return count;
}
function participantsModal(accountId) {
  const account = getAccount(accountId); if (!account) return;
  startPicker(account.people.filter(entry => !entry.removed).map(entry => entry.personId));
  openModal('Adicionar participantes', pickerHtml(), () => {
    if (!picker.selected.length) { toast('Selecione ou cadastre ao menos uma pessoa.'); return; }
    const added = applyPicker(account);
    save(); closeModal(); openAccount(accountId);
    toast(added === 1 ? 'Participante adicionado.' : `${added} participantes adicionados.`);
  }, 'Adicionar à divisão');
  renderPicker(true);
}
function addPersonModal() {
  startPicker();
  openModal('Cadastrar amigo', `${field('Nome ou apelido', 'name', 'Ex.: Ana')}${coupleCheckbox('couple')}${avatarPicker()}`, data => {
    const name = (data.name || '').trim();
    if (!name) { toast('Informe o nome da pessoa.'); return; }
    if (nameTaken(name)) { toast('Já existe um amigo com esse nome.'); return; }
    state.people.push({ id: id(), name, weight: data.couple === 'yes' ? 2 : 1, avatar: A.resolve(data.avatar) || DEFAULT_AVATAR, createdAt: new Date().toISOString() });
    save(); closeModal(); toast('Amigo cadastrado. Ele já aparece para as próximas divisões.');
  }, 'Cadastrar');
}
function editPersonModal(personId) {
  const participant = person(personId); if (!participant) return;
  startPicker();
  openModal('Editar amigo', `${field('Nome ou apelido', 'name', 'Nome', 'text', participant.name)}${coupleCheckbox('couple', participant.weight > 1)}${avatarPicker(participant.avatar || DEFAULT_AVATAR)}<p class="field-hint">${icon('info')}Casais contam como 2 pessoas nos itens divididos por pessoa. Itens já lançados não mudam.</p>`, data => {
    const name = (data.name || '').trim();
    if (!name) { toast('Informe o nome da pessoa.'); return; }
    if (nameTaken(name, personId)) { toast('Já existe outro amigo com esse nome.'); return; }
    participant.name = name; participant.avatar = A.resolve(data.avatar) || A.resolve(participant.avatar) || DEFAULT_AVATAR;
    participant.weight = data.couple === 'yes' ? 2 : 1;
    state.accounts.forEach(account => account.people.forEach(entry => { if (entry.personId === personId) entry.weight = participant.weight; }));
    save(); closeModal(); toast('Amigo atualizado.');
  }, 'Salvar alterações');
}
async function deleteGlobalPerson(personId) {
  const participant = person(personId); if (!participant) return;
  const linkedActive = state.accounts.some(account => account.people.some(entry => entry.personId === personId && !entry.removed));
  if (linkedActive) { toast('Este amigo ainda está ativo em uma divisão. Remova-o da divisão primeiro.'); return; }
  const confirmed = await confirmDialog({ title: `Excluir o cadastro de ${participant.name}?`, message: 'O nome continua aparecendo nas divisões antigas, com o histórico preservado.', confirmLabel: 'Excluir cadastro', danger: true });
  if (!confirmed) return;
  state.accounts.forEach(account => account.people.forEach(entry => {
    if (entry.personId === personId) { entry.displayName = participant.name; entry.avatar = participant.avatar; }
  }));
  state.people = state.people.filter(item => item.id !== personId); save(); toast('Cadastro excluído.');
}
async function removeAccountPerson(accountId, personId) {
  const account = getAccount(accountId); if (!account) return;
  const entry = account.people.find(item => item.personId === personId); if (!entry || entry.removed) return;
  const participant = person(personId);
  const confirmed = await confirmDialog({ title: `Remover ${participant?.name || 'esta pessoa'} da divisão?`, message: 'Os lançamentos e cálculos já feitos ficam preservados no histórico.\nA pessoa não entra nos próximos rateios.', confirmLabel: 'Remover da divisão' });
  if (!confirmed) return;
  entry.displayName = participant?.name || 'Participante'; entry.avatar = participant?.avatar || DEFAULT_AVATAR;
  entry.removed = true; entry.removedAt = new Date().toISOString();
  save(); openAccount(accountId); toast('Participante removido da lista ativa. Histórico preservado.');
}

/* ---------- itens ---------- */
function addExpense() {
  const account = getAccount(currentAccountId); if (!account) return;
  if (!C.activeMembers(account).length) { toast('Antes de lançar itens, escolha quem vai participar.'); participantsModal(account.id); return; }
  itemModal(account.id);
}
function addFee() {
  const account = getAccount(currentAccountId); if (!account) return;
  if (!C.activeMembers(account).length) { toast('Antes de lançar taxas, escolha quem vai participar.'); participantsModal(account.id); return; }
  feeModal(account.id);
}
function itemModal(accountId, options = {}) {
  const account = getAccount(accountId); if (!account) return;
  const source = options.item || null;
  const editing = Boolean(source) && !options.duplicate;
  const related = new Set(source ? [...(source.consumers || []), ...Object.keys(source.consumption || {}), source.payerId].filter(Boolean) : []);
  const pool = account.people.filter(entry => !entry.removed || related.has(entry.personId));
  const poolIds = pool.map(entry => entry.personId);
  const activeIds = C.activeMembers(account).map(entry => entry.personId);
  const hasCouple = pool.some(entry => entry.weight > 1);
  // "Quem consumiu?" tem 3 opções. O modo interno é deduzido delas (e de "casais pagam o dobro").
  let who = 'all';
  if (source) {
    if (source.mode === 'quantity') who = 'units';
    else if (source.mode === 'manual') who = 'all';
    else who = activeIds.every(personId => (source.consumers || []).includes(personId)) ? 'all' : 'some';
  }
  const double = source ? source.mode === 'weighted' : true;
  const quantityRows = pool.map(entry => {
    const view = memberView(account, entry.personId);
    return `<div class="quantity-person"><div class="person-info">${avatarHtml(view, 'avatar-sm')}<span>${escapeHtml(view.name)}</span>${coupleTag(entry.weight)}</div><input aria-label="Unidades de ${escapeHtml(view.name)}" type="number" inputmode="decimal" name="qty_${escapeHtml(entry.personId)}" min="0" step="0.01" value="${Number(source?.consumption?.[entry.personId]) || 0}"></div>`;
  }).join('');
  const checks = pool.map(entry => {
    const view = memberView(account, entry.personId);
    const checked = source && who === 'some' ? (source.consumers || []).includes(entry.personId) : true;
    return `<label class="check-option"><input type="checkbox" name="consumers" value="${escapeHtml(entry.personId)}" ${checked ? 'checked' : ''}>${avatarHtml(view, 'avatar-sm')}<span>${escapeHtml(view.name)}</span>${coupleTag(entry.weight)}</label>`;
  }).join('');
  const seg = (value, iconName, title, hint) => `<label class="choice"><input type="radio" name="who" value="${value}" ${who === value ? 'checked' : ''}><span class="choice-card">${icon(iconName)}<b>${title}</b><small>${hint}</small></span></label>`;
  const title = editing ? 'Editar item' : options.duplicate ? 'Duplicar item' : 'Adicionar item';
  openModal(title, `
    ${field('O que foi consumido?', 'name', 'Ex.: Cerveja, pizza, Uber', 'text', source?.name || '')}
    <div class="form-two-cols">
      <div class="field"><label for="item-quantity">Quantidade</label><input id="item-quantity" name="quantity" type="number" inputmode="decimal" min="0.01" step="0.01" value="${Number(source?.quantity ?? 1) || 1}" required></div>
      <div class="field"><label for="item-unit-price">Valor de cada unidade (R$)</label><input id="item-unit-price" name="unitPrice" type="number" inputmode="decimal" min="0.01" step="0.01" placeholder="0,00" value="${source ? (source.unitPriceCents / 100).toFixed(2) : ''}" required></div>
    </div>
    <div class="item-total-preview"><span>Total do item</span><strong id="item-total-preview">${source ? money(source.amountCents) : money(0)}</strong></div>
    <div class="field"><span class="field-label" id="who-label">Quem consumiu?</span><div class="choice-grid" role="radiogroup" aria-labelledby="who-label">
      ${seg('all', 'users-round', 'Todos', 'Divide igualmente')}
      ${seg('some', 'user-check', 'Algumas pessoas', 'Escolha quem')}
      ${seg('units', 'hash', 'Por unidade', 'Cada um diz quantas')}
    </div></div>
    <div id="who-some" class="field" ${who === 'some' ? '' : 'hidden'}><div class="check-list">${checks}</div></div>
    <div id="who-units" class="allocation-box" ${who === 'units' ? '' : 'hidden'}><div class="allocation-heading"><strong>Quantas unidades cada pessoa consumiu?</strong><small>A soma precisa ser igual à quantidade.</small></div>${quantityRows}<div class="allocation-sum" id="allocation-sum"></div></div>
    <label id="couple-option" class="check-option couple-check" data-has-couple="${hasCouple ? '1' : '0'}" ${hasCouple && who !== 'units' ? '' : 'hidden'}><input type="checkbox" name="couplesDouble" value="yes" ${double ? 'checked' : ''}><span>Casais pagam o dobro <small>(cada casal conta como 2 pessoas)</small></span></label>
    <div class="field"><label for="payer">Quem pagou?</label><select name="payer" id="payer"><option value="">Ninguém ainda, será pago no estabelecimento</option>${pool.map(entry => `<option value="${escapeHtml(entry.personId)}" ${source?.payerId === entry.personId ? 'selected' : ''}>${escapeHtml(memberView(account, entry.personId).name)} já pagou</option>`).join('')}</select><p class="field-hint">${icon('info')}É só um registro para o cálculo. O Calotim não recebe nem envia dinheiro.</p></div>
    <details class="more" ${source?.category ? 'open' : ''}><summary>Mais opções${icon('chevron-down')}</summary><div class="field"><label for="item-category">Categoria</label><select id="item-category" name="category"><option value="">Sem categoria</option>${C.CATEGORIES.map(category => `<option value="${escapeHtml(category)}" ${source?.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}</select></div></details>
  `, data => {
    const consumption = {};
    pool.forEach(entry => { consumption[entry.personId] = data['qty_' + entry.personId]; });
    const checked = [...document.querySelectorAll('#modal-content input[name="consumers"]:checked')].map(input => input.value);
    const doubleCouples = data.couplesDouble === 'yes' && hasCouple;
    let mode, consumers;
    if (data.who === 'units') mode = 'quantity';
    else if (data.who === 'some') { mode = doubleCouples ? 'weighted' : 'selected'; consumers = checked; }
    else { mode = doubleCouples ? 'weighted' : 'manual'; consumers = editing ? poolIds : (doubleCouples ? activeIds : undefined); }
    const result = C.buildItem({
      name: data.name, category: data.category, quantity: data.quantity, unitPriceCents: C.parseCents(data.unitPrice),
      mode, consumers, consumption, payerId: data.payer
    }, account, editing ? source : undefined);
    if (result.error) { toast(result.error); return; }
    let note = '';
    if (editing) {
      const index = account.items.findIndex(item => item.id === source.id);
      account.items[index] = result.item;
      const cut = C.reconcilePrepayments(account);
      if (cut > 0) note = ` Pagamento antecipado ajustado em ${money(cut)}.`;
    } else account.items.push(result.item);
    flashLineId = result.item.id;
    detailTab = 'items';
    save(); closeModal(); openAccount(accountId);
    toast((editing ? 'Item atualizado.' : data.payer ? 'Item lançado como pago.' : 'Item lançado.') + note);
  }, editing ? 'Salvar alterações' : options.duplicate ? 'Duplicar' : 'Adicionar item');
  updateAllocationSum();
}
function updateItemPreview() {
  const quantity = Number(document.getElementById('item-quantity')?.value) || 0;
  const unitCents = C.parseCents(document.getElementById('item-unit-price')?.value);
  const preview = document.getElementById('item-total-preview');
  if (!preview) return;
  const next = money(C.lineAmount(quantity, Number.isFinite(unitCents) ? unitCents : 0));
  if (preview.textContent !== next) {
    preview.textContent = next;
    preview.classList.remove('tick'); void preview.offsetWidth; preview.classList.add('tick');
  }
}
function updateAllocationSum() {
  const box = document.getElementById('allocation-sum');
  if (!box) return;
  const quantity = Number(document.getElementById('item-quantity')?.value) || 0;
  const assigned = [...document.querySelectorAll('#who-units input[type="number"]')].reduce((total, input) => total + (Number(input.value) || 0), 0);
  const ok = Math.abs(assigned - quantity) < 0.0001 && quantity > 0;
  box.className = 'allocation-sum ' + (ok ? 'ok' : 'off');
  box.innerHTML = `<span>${ok ? 'Tudo distribuído' : 'Unidades atribuídas'}</span><span>${escapeHtml(C.formatQuantity(assigned))} de ${escapeHtml(C.formatQuantity(quantity))}</span>`;
}

/* ---------- taxas e descontos ---------- */
function feeModal(accountId, options = {}) {
  const account = getAccount(accountId); if (!account) return;
  const source = options.fee || null;
  const related = new Set(source ? [...source.participants, source.payerId].filter(Boolean) : []);
  const pool = account.people.filter(entry => !entry.removed || related.has(entry.personId));
  const kind = source?.kind || 'fee';
  const mode = source?.mode || 'percent';
  const valueText = source ? (source.mode === 'percent' ? String(source.value) : (source.amountCents / 100).toFixed(2)) : '10';
  const checks = pool.map(entry => { const view = memberView(account, entry.personId); return `<label class="check-option"><input type="checkbox" name="feePeople" value="${escapeHtml(entry.personId)}" ${source ? (source.participants.includes(entry.personId) ? 'checked' : '') : 'checked'}>${avatarHtml(view, 'avatar-sm')}<span>${escapeHtml(view.name)}</span></label>`; }).join('');
  const templates = [['service', 'Serviço 10%', 'percent'], ['couvert', 'Couvert', 'tag'], ['booking', 'Reserva', 'calendar-days'], ['discount', 'Desconto', 'percent'], ['courtesy', 'Cortesia', 'heart'], ['custom', 'Outro', 'pencil']];
  const chip = (name, value, label, iconName, checked) => `<label class="chip-choice"><input type="radio" name="${name}" value="${value}" ${checked ? 'checked' : ''}><span>${iconName ? icon(iconName) : ''}${label}</span></label>`;
  openModal(source ? 'Editar taxa ou desconto' : 'Taxa ou desconto', `
    ${source ? '' : `<div class="field"><span class="field-label" id="fee-template-label">Modelo</span><div class="chip-choices" role="radiogroup" aria-labelledby="fee-template-label">${templates.map(([value, label, iconName], index) => chip('feeTemplate', value, label, iconName, index === 0)).join('')}</div></div>`}
    ${field('Nome', 'title', 'Ex.: Taxa de serviço', 'text', source?.title || FEE_TEMPLATES.service.title)}
    <div class="form-two-cols">
      <div class="field"><span class="field-label" id="fee-kind-label">Tipo</span><div class="chip-choices" role="radiogroup" aria-labelledby="fee-kind-label">${chip('kind', 'fee', 'Acréscimo', 'plus', kind === 'fee')}${chip('kind', 'discount', 'Desconto', 'tag', kind === 'discount')}</div></div>
      <div class="field"><span class="field-label" id="fee-mode-label">Forma de cálculo</span><div class="chip-choices" role="radiogroup" aria-labelledby="fee-mode-label">${chip('mode', 'percent', 'Porcentagem', 'percent', mode === 'percent')}${chip('mode', 'fixed', 'Valor fixo', 'receipt', mode === 'fixed')}</div></div>
    </div>
    <div class="field"><label for="fee-value" id="fee-value-label">${mode === 'percent' ? 'Porcentagem (%)' : 'Valor (R$)'}</label><input id="fee-value" name="value" type="number" inputmode="decimal" min="0.01" step="0.01" value="${escapeHtml(valueText)}" required><p class="field-hint" id="fee-hint">${icon('info')}<span>${mode === 'percent' ? 'Incide somente sobre os itens de cada pessoa, nunca sobre outras taxas.' : 'Dividido igualmente entre as pessoas selecionadas.'}</span></p></div>
    <div class="field"><span class="field-label">Quem divide?</span><div class="check-list">${checks}</div></div>
    <div class="field"><label for="fee-payer">Quem pagou?</label><select name="payer" id="fee-payer"><option value="">Ninguém ainda, será pago no estabelecimento</option>${pool.map(entry => `<option value="${escapeHtml(entry.personId)}" ${source?.payerId === entry.personId ? 'selected' : ''}>${escapeHtml(memberView(account, entry.personId).name)} já pagou</option>`).join('')}</select></div>
  `, data => {
    const participants = [...document.querySelectorAll('#modal-content input[name="feePeople"]:checked')].map(input => input.value);
    const result = C.buildFee({
      title: data.title, kind: data.kind, mode: data.mode, participants, payerId: data.payer,
      value: Number(String(data.value).replace(',', '.')), amountCents: C.parseCents(data.value)
    }, account, source || undefined);
    if (result.error) { toast(result.error); return; }
    let note = '';
    if (source) {
      account.fees[account.fees.findIndex(fee => fee.id === source.id)] = result.fee;
      const cut = C.reconcilePrepayments(account);
      if (cut > 0) note = ` Pagamento antecipado ajustado em ${money(cut)}.`;
    } else account.fees.push(result.fee);
    flashLineId = result.fee.id;
    detailTab = 'fees';
    save(); closeModal(); openAccount(accountId); toast((source ? 'Taxa atualizada.' : 'Taxa lançada.') + note);
  }, source ? 'Salvar alterações' : 'Salvar');
}
function applyFeeTemplate(key) {
  const template = FEE_TEMPLATES[key];
  if (!template) return;
  document.getElementById('title').value = template.title;
  setRadio('kind', template.kind);
  setRadio('mode', template.mode);
  document.getElementById('fee-value').value = template.value;
  updateFeeLabels();
}
function updateFeeLabels() {
  const percent = (document.querySelector('#modal-content input[name="mode"]:checked')?.value || 'percent') === 'percent';
  document.getElementById('fee-value-label').textContent = percent ? 'Porcentagem (%)' : 'Valor (R$)';
  document.querySelector('#fee-hint span').textContent = percent ? 'Incide somente sobre os itens de cada pessoa, nunca sobre outras taxas.' : 'Dividido igualmente entre as pessoas selecionadas.';
}

/* ---------- exclusões com desfazer ---------- */
async function deleteLine(accountId, lineId, label) {
  const account = getAccount(accountId); if (!account) return;
  const prepaid = C.prepaidOnLine(account, lineId);
  const warning = prepaid > 0 ? `\nAtenção: ${money(prepaid)} de pagamento antecipado registrado neste lançamento deixará de ser considerado.` : '';
  const confirmed = await confirmDialog({ title: `Excluir "${label}"?`, message: `Você poderá desfazer logo em seguida.${warning}`, confirmLabel: 'Excluir', danger: true });
  if (!confirmed) return;
  const snapshot = snapshotAccount(account);
  C.removeLine(account, lineId);
  save(); toast('Lançamento removido.', { label: 'Desfazer', run: () => { restoreAccount(snapshot); } });
}

/* ---------- pagamento antecipado ---------- */
function registerMemberPayment(accountId, personId) {
  const account = getAccount(accountId); if (!account) return;
  const outstanding = C.outstandingFor(account, personId);
  const view = memberView(account, personId);
  if (outstanding <= 0) { toast('Essa pessoa não tem valor pendente com o estabelecimento.'); return; }
  openModal('Registrar pagamento antecipado', `
    <div class="payment-person-summary">${avatarHtml(view, 'avatar-md')}<div><strong>${escapeHtml(view.name)}</strong><small>Valor acumulado até agora</small></div><b>${money(outstanding)}</b></div>
    ${field('Quanto essa pessoa pagou? (R$)', 'paymentAmount', (outstanding / 100).toFixed(2), 'number', (outstanding / 100).toFixed(2))}
    <label class="check-option"><input type="checkbox" name="leaveAfterPayment" value="yes" checked><span>Essa pessoa vai embora e não participa dos próximos itens</span></label>
    <p class="field-hint">${icon('info')}O valor é abatido somente dos itens e taxas pendentes lançados até agora. Os próximos lançamentos são divididos entre quem continuar na conta. É um registro informativo: o Calotim não recebe dinheiro.</p>
  `, data => {
    const result = C.registerPrepayment(account, personId, C.parseCents(data.paymentAmount), { leave: data.leaveAfterPayment === 'yes', displayName: view.name, avatar: view.avatar });
    if (!result.ok) { toast(result.error === 'range' ? `Informe um valor entre R$ 0,01 e ${money(result.outstanding)}.` : result.error); return; }
    save(); closeModal(); openAccount(accountId);
    toast(data.leaveAfterPayment === 'yes' ? 'Pagamento registrado. Pessoa retirada dos próximos rateios.' : 'Pagamento antecipado registrado.');
  }, 'Confirmar pagamento');
}

/* ---------- telas: divisão ---------- */
function lineStatus(account, lineId, payerId) {
  if (payerId && account.people.some(entry => entry.personId === payerId)) return `<span class="status paid">${icon('check')}Pago por ${escapeHtml(lookupName(payerId, account))}</span>`;
  const prepaid = C.prepaidOnLine(account, lineId);
  return prepaid > 0 ? `<span class="status prepaid">${icon('hand-coins')}Antecipado ${money(prepaid)}</span>` : `<span class="status pending">${icon('clock')}Pendente no local</span>`;
}
function feeSummaryText(fee) {
  const how = fee.mode === 'percent' ? `${C.formatQuantity(fee.value)}% sobre os itens` : `valor fixo de ${money(fee.amountCents)}`;
  return `${fee.kind === 'discount' ? 'Desconto' : 'Acréscimo'} · ${how}`;
}
function menuHtml(entries) {
  return `<details class="menu"><summary aria-label="Mais ações">${icon('ellipsis')}</summary><div class="menu-list">${entries.map(entry => entry.sep ? '<span class="menu-sep" aria-hidden="true"></span>' : `<button type="button" class="menu-item${entry.danger ? ' danger-text' : ''}" ${entry.attr}>${icon(entry.icon)}${entry.label}</button>`).join('')}</div></details>`;
}
function consumersStack(account, ids, max = 3) {
  const list = [...new Set(ids)].filter(Boolean);
  if (!list.length) return `<span class="line-tile" aria-hidden="true">${icon('receipt')}</span>`;
  const shown = list.slice(0, list.length > max ? max - 1 : max).map(personId => avatarHtml(memberView(account, personId)));
  const more = list.length > max ? `<span class="avatar-more">+${list.length - (max - 1)}</span>` : '';
  return `<span class="line-avatars" aria-hidden="true">${shown.join('')}${more}</span>`;
}
function rowClass(lineId) { return lineId === flashLineId ? ' is-new' : ''; }

function renderItemsPanel(account) {
  const usedCategories = [...new Set(account.items.map(item => item.category).filter(Boolean))];
  if (categoryFilter && !usedCategories.includes(categoryFilter)) categoryFilter = '';
  const filter = document.getElementById('category-filter');
  document.getElementById('category-filter-wrap').hidden = usedCategories.length === 0;
  filter.innerHTML = '<option value="">Todas as categorias</option>' + usedCategories.map(category => `<option value="${escapeHtml(category)}" ${category === categoryFilter ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('');
  const visibleItems = account.items.filter(item => !categoryFilter || item.category === categoryFilter);
  document.getElementById('expense-list').innerHTML = visibleItems.length ? visibleItems.map(item => {
    const consumerIds = item.mode === 'quantity' ? Object.keys(item.consumption) : item.consumers;
    const count = new Set(consumerIds).size;
    const pill = item.category ? `<span class="tag tag-neutral">${icon(CATEGORY_ICONS[item.category] || 'tag')}${escapeHtml(item.category)}</span>` : '';
    const key = escapeHtml(item.id);
    return `<div class="line-row${rowClass(item.id)}">${consumersStack(account, consumerIds)}<div class="line-main"><strong>${escapeHtml(item.name)} ${pill}</strong><span class="line-sub"><span class="num">${escapeHtml(C.formatQuantity(item.quantity))} × ${money(item.unitPriceCents)}</span><span>${plural(count, 'pessoa', 'pessoas')}</span>${lineStatus(account, item.id, item.payerId)}</span></div><span class="line-value">${money(item.amountCents)}</span>${menuHtml([
      { label: 'Editar', icon: 'pencil', attr: `data-edit-item="${key}"` }, { label: 'Duplicar', icon: 'copy', attr: `data-duplicate-item="${key}"` }, { sep: true }, { label: 'Excluir', icon: 'trash-2', attr: `data-delete-item="${key}"`, danger: true }])}</div>`;
  }).join('') : account.items.length
    ? emptyState({ art: 'list-filter', title: 'Nenhum item nesta categoria', text: 'Escolha outra categoria no filtro.', compact: true })
    : emptyState({ art: 'receipt', title: 'Nenhum item lançado', text: 'Comece pelo que chegou à mesa. Cada item pergunta quem consumiu.', action: `<button class="button primary" type="button" data-action="add-item">${icon('plus')}Adicionar item</button>` });
}
function renderFeesPanel(account, lineTotals) {
  document.getElementById('fee-list').innerHTML = account.fees.length ? account.fees.map(fee => {
    const key = escapeHtml(fee.id);
    return `<div class="line-row${rowClass(fee.id)}"><span class="line-tile ${fee.kind === 'discount' ? 'discount' : 'fee'}" aria-hidden="true">${icon(fee.kind === 'discount' ? 'tag' : 'percent')}</span><div class="line-main"><strong>${escapeHtml(fee.title)}</strong><span class="line-sub"><span>${escapeHtml(feeSummaryText(fee))}</span><span>${plural(fee.participants.length, 'pessoa', 'pessoas')}</span>${lineStatus(account, fee.id, fee.payerId)}</span></div><span class="line-value">${money(lineTotals.get(fee.id) || 0)}</span>${menuHtml([
      { label: 'Editar', icon: 'pencil', attr: `data-edit-fee="${key}"` }, { sep: true }, { label: 'Excluir', icon: 'trash-2', attr: `data-delete-fee="${key}"`, danger: true }])}</div>`;
  }).join('') : emptyState({ art: 'percent', tone: 'orange', title: 'Sem taxas ou descontos', text: 'Inclua serviço, couvert ou descontos para o total bater com a conta.', action: `<button class="button secondary" type="button" data-action="add-fee">${icon('plus')}Taxa ou desconto</button>`, compact: true });
}
function renderPeoplePanel(account, values) {
  const unpaidOf = personId => Math.max(0, values.unpaidShares[personId] || 0);
  const personRow = (entry, archived) => {
    const view = memberView(account, entry.personId);
    const key = escapeHtml(entry.personId);
    const pending = unpaidOf(entry.personId);
    const actions = [];
    if (pending > 0) actions.push({ label: 'Registrar pagamento antecipado', icon: 'hand-coins', attr: `data-pay-member="${key}"` });
    actions.push({ label: 'Ver extrato individual', icon: 'file-text', attr: `data-person-statement="${key}"` });
    if (archived) { if (person(entry.personId)) actions.push({ label: 'Reativar na divisão', icon: 'rotate-ccw', attr: `data-restore-person="${key}"` }); }
    else {
      if (person(entry.personId)) actions.push({ label: 'Editar amigo', icon: 'pencil', attr: `data-edit-person="${key}"` });
      actions.push({ sep: true }, { label: 'Remover da divisão', icon: 'user-minus', attr: `data-remove-account-person="${key}"`, danger: true });
    }
    const itemsPart = values.itemShares[entry.personId] || 0;
    const feesPart = values.feeShares[entry.personId] || 0;
    const breakdown = `<span class="num">${money(itemsPart)} em itens${feesPart ? ` ${feesPart < 0 ? '−' : '+'} ${money(Math.abs(feesPart))} ${feesPart < 0 ? 'de desconto' : 'de taxas'}` : ''}</span>`;
    const sub = `${pending > 0 ? `<span class="pending-text">${icon('clock')}Falta pagar ${money(pending)}</span>` : `<span>${archived ? 'Não participa de novos itens' : 'Sem pendência no local'}</span>`}${breakdown}`;
    return `<div class="line-row person-line${archived ? ' archived' : ''}">${avatarHtml(view)}<div class="line-main"><strong>${escapeHtml(view.name)}${coupleTag(entry.weight)}</strong><span class="line-sub">${sub}</span></div><span class="line-value">${money(values.shareTotals[entry.personId] || 0)}</span>${menuHtml(actions)}</div>`;
  };
  const activeMembers = account.people.filter(entry => !entry.removed);
  const removedMembers = account.people.filter(entry => entry.removed);
  document.getElementById('account-people').innerHTML = `${activeMembers.length ? activeMembers.map(entry => personRow(entry, false)).join('') : emptyState({ art: 'users', title: 'Ninguém na divisão ainda', text: 'Escolha entre seus amigos cadastrados ou cadastre alguém na hora.', action: `<button class="button primary" type="button" data-action="add-people">${icon('user-plus')}Adicionar participantes</button>` })}${removedMembers.length ? `<div class="archived-members"><p>${icon('door-open')}Quem saiu da divisão · histórico preservado</p>${removedMembers.map(entry => personRow(entry, true)).join('')}</div>` : ''}`;
}
function renderSettlePanel(account, values) {
  const unpaidOf = personId => Math.max(0, values.unpaidShares[personId] || 0);
  const unpaidRows = account.people.map(entry => ({ personId: entry.personId, amount: unpaidOf(entry.personId) })).filter(item => item.amount > 0);
  const unpaidMarkup = values.unpaidTotal > 0
    ? `<div class="settle-block"><h3 class="settle-title">${icon('store')}Pendente com o estabelecimento</h3><p class="settle-copy">Esses valores ainda não foram pagos. Selecionar os produtos não significa que a comanda esteja quitada.</p><div class="line-list">${unpaidRows.map(item => `<div class="line-row person-line">${avatarHtml(memberView(account, item.personId))}<div class="line-main"><strong>${escapeHtml(lookupName(item.personId, account))}</strong><span class="line-sub">de uma parte de ${money(values.shareTotals[item.personId] || 0)}</span></div><span class="line-value">${money(item.amount)}</span><span></span></div>`).join('')}</div></div>`
    : `<div class="settle-block">${emptyState({ art: 'circle-check', title: 'Nada pendente com o estabelecimento', text: account.items.length ? 'Todos os lançamentos estão marcados como pagos.' : 'Os valores aparecem aqui assim que você lançar itens.', compact: true })}</div>`;
  const transfers = C.suggestSettlements(values.balances);
  const transferMarkup = `<div class="settle-block"><h3 class="settle-title">${icon('arrow-right-left')}Acerto entre participantes</h3>${transfers.length
    ? `<div class="transfers">${transfers.map(item => { const from = lookupName(item.from, account); const to = lookupName(item.to, account); return `<div class="transfer"><span class="transfer-person">${avatarHtml(memberView(account, item.from), 'avatar-sm')}<span>${escapeHtml(from)}</span></span><span class="transfer-line" aria-hidden="true"></span><span class="transfer-person to">${avatarHtml(memberView(account, item.to), 'avatar-sm')}<span>${escapeHtml(to)}</span></span><strong class="transfer-amount">${money(item.amount)}</strong><span class="sr-only">${escapeHtml(from)} deve ${money(item.amount)} para ${escapeHtml(to)}</span></div>`; }).join('')}</div>`
    : `<p class="settle-copy">${values.paidTotal > 0 ? 'Não há transferências pendentes entre os participantes.' : 'Quando alguém pagar um lançamento e você registrar em "Quem pagou?", os acertos entre as pessoas aparecem aqui.'}</p>`}
    <p class="disclaimer">${icon('info')}<span>Sugestão de acerto. O Calotim calcula e organiza; não movimenta dinheiro nem confirma transferências.</span></p></div>`;
  document.getElementById('settlement-list').innerHTML = unpaidMarkup + transferMarkup;
  return { transfers: transfers.length, attention: transfers.length > 0 || unpaidRows.length > 0 };
}
function renderLive(account, values) {
  const accountKey = account.id;
  const body = document.getElementById('live-body');
  const head = document.getElementById('live-head-total');
  head.innerHTML = `${money(values.total)}${values.unpaidTotal > 0 ? `<small>Falta pagar ${money(values.unpaidTotal)}</small>` : ''}`;
  const listed = account.people.filter(entry => !entry.removed || Math.abs(values.shareTotals[entry.personId] || 0) > 0);
  if (!listed.length) {
    body.innerHTML = `<div class="live-total"><small>Total da conta</small><strong>${countMarkup(values.total, 'live-total-' + accountKey)}</strong></div><div class="live-empty"><span>Adicione participantes para ver quanto cabe a cada um.</span><button class="button secondary live-link" type="button" data-action="add-people">${icon('user-plus')}Adicionar participantes</button></div>`;
  } else {
    const rows = listed.map(entry => {
      const view = memberView(account, entry.personId);
      const pending = Math.max(0, values.unpaidShares[entry.personId] || 0);
      const sub = pending > 0 ? `<small class="pending-text">${icon('clock')}Falta ${money(pending)}</small>` : `<small>${entry.removed ? 'Saiu da divisão' : 'Sem pendência no local'}</small>`;
      return `<li class="live-person" data-person="${escapeHtml(entry.personId)}"><span class="pdot c${personColor(account, entry.personId)}" aria-hidden="true"></span>${avatarHtml(view)}<span class="live-person-name"><strong>${escapeHtml(view.name)}</strong>${sub}</span><span class="live-person-value">${countMarkup(values.shareTotals[entry.personId] || 0, `live-share-${accountKey}-${entry.personId}`)}</span></li>`;
    }).join('');
    body.innerHTML = `<div class="live-total"><small>Total da conta</small><strong>${countMarkup(values.total, 'live-total-' + accountKey)}</strong><span class="live-sub">Itens ${money(values.itemsTotal)} · Taxas e descontos ${money(values.feesTotal)}</span></div>
      ${splitBarHtml(account, values, 'live-' + accountKey, 'lg')}
      <ul class="live-people">${rows}</ul>
      <div class="live-foot">
        <div class="live-stat"><span class="stat-tile" aria-hidden="true">${icon('store')}</span><span>Falta pagar ao estabelecimento</span><strong>${countMarkup(values.unpaidTotal, 'live-unpaid-' + accountKey)}</strong></div>
        <div class="live-stat"><span class="stat-tile green" aria-hidden="true">${icon('circle-check')}</span><span>Pago por participantes</span><strong>${countMarkup(values.paidTotal, 'live-paid-' + accountKey)}</strong></div>
      </div>
      <button class="button secondary live-link" type="button" data-tab-go="settle">${icon('arrow-right-left')}Ver acerto de contas</button>`;
  }
  const signature = [values.total, values.unpaidTotal, values.paidTotal, JSON.stringify(values.shareTotals)].join('|');
  const previous = liveSignatures.get(accountKey);
  if (previous === undefined) document.getElementById('live-updated').textContent = `Calculado às ${timeNow()}`;
  if (previous !== undefined && previous !== signature) {
    document.getElementById('live-updated').textContent = `Atualizado às ${timeNow()}`;
    const dot = document.getElementById('live-dot');
    dot.classList.remove('pulse'); void dot.offsetWidth; dot.classList.add('pulse');
  }
  liveSignatures.set(accountKey, signature);
}
function setLiveOpen(open) {
  const panel = document.getElementById('live-panel');
  panel.classList.toggle('open', open);
  const toggle = document.getElementById('live-toggle');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Esconder a divisão por pessoa' : 'Mostrar a divisão por pessoa');
}
function applyTab(tab, focus = false) {
  detailTab = tab;
  ['items', 'fees', 'people', 'settle'].forEach(name => {
    const button = document.getElementById('tab-' + name);
    const panel = document.getElementById('panel-' + name);
    const selected = name === tab;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    panel.hidden = !selected;
  });
  moveTabInk();
  if (focus) document.getElementById('tab-' + tab).focus();
}
function moveTabInk() {
  const tabs = document.getElementById('detail-tabs');
  const active = tabs.querySelector('[aria-selected="true"]');
  const ink = tabs.querySelector('.tab-ink');
  if (!active || !ink || !active.offsetWidth) return;
  ink.style.setProperty('--ink-x', active.offsetLeft + 'px');
  ink.style.setProperty('--ink-w', String(active.offsetWidth));
}
function openAccount(accountId) {
  currentAccountId = accountId;
  const account = getAccount(accountId);
  if (!account) return;
  if (lastRenderedAccountId !== accountId) { categoryFilter = ''; detailTab = flashLineId ? detailTab : 'items'; lastRenderedAccountId = accountId; setLiveOpen(false); }
  showView('detail');
  const info = kindInfo(account.kind);
  document.getElementById('detail-name').textContent = account.name;
  document.getElementById('detail-kind-icon').className = `kind-tile kind-tile-lg ${info.css}`;
  document.getElementById('detail-kind-icon').innerHTML = icon(info.icon);
  const created = account.createdAt ? new Date(account.createdAt) : null;
  const values = C.calc(account);
  document.getElementById('detail-subtitle').innerHTML = [
    `<span>${icon('receipt')}Total ${money(values.total)}</span>`,
    `<span>${escapeHtml(info.label)}</span>`,
    account.place ? `<span>${icon('map-pin')}${escapeHtml(account.place)}</span>` : '',
    created && !Number.isNaN(created.getTime()) ? `<span>${icon('calendar-days')}${escapeHtml(created.toLocaleDateString('pt-BR'))}</span>` : ''
  ].join('');
  const { lines } = C.buildLines(account);
  const lineTotals = new Map(lines.map(line => [line.id, line.total]));
  renderItemsPanel(account);
  renderFeesPanel(account, lineTotals);
  renderPeoplePanel(account, values);
  const settle = renderSettlePanel(account, values);
  renderLive(account, values);
  document.getElementById('count-items').textContent = account.items.length;
  document.getElementById('count-fees').textContent = account.fees.length;
  document.getElementById('count-people').textContent = C.activeMembers(account).length;
  const settleBadge = document.getElementById('count-settle');
  settleBadge.textContent = settle.transfers;
  settleBadge.classList.toggle('attention', settle.attention);
  applyTab(detailTab);
  hydrate(document.getElementById('view-detail'));
  flashLineId = null;
}

/* ---------- telas: listas ---------- */
function divisionMeta(account) {
  const active = C.activeMembers(account).length;
  return `${account.place ? `<span>${icon('map-pin')}${escapeHtml(account.place)}</span>` : ''}<span>${icon('users')}${plural(active, 'pessoa', 'pessoas')}</span><span>${icon('receipt')}${plural(account.items.length, 'item', 'itens')}</span>`;
}
function divisionRow(account) {
  const values = C.calc(account);
  return `<button type="button" class="division-row" data-open="${escapeHtml(account.id)}">${kindTile(account.kind)}<span class="row-text"><span class="row-title">${escapeHtml(account.name)}</span><span class="row-meta">${divisionMeta(account)}</span></span><span class="division-split">${splitBarHtml(account, values, 'row-' + account.id)}${avatarStack(account)}</span><span class="row-total">${countMarkup(values.total, 'row-total-' + account.id)}</span>${icon('chevron-right', 'chev')}</button>`;
}
function divisionCard(account) {
  const values = C.calc(account);
  const info = kindInfo(account.kind);
  const pending = values.unpaidTotal > 0 ? `<span class="status pending">${icon('clock')}Falta ${money(values.unpaidTotal)}</span>` : (values.total > 0 ? `<span class="status paid">${icon('check')}Sem pendência</span>` : '');
  return `<button type="button" class="division-card" data-open="${escapeHtml(account.id)}"><span class="card-top">${kindTile(account.kind)}<span class="tag tag-neutral">${escapeHtml(info.label)}</span></span><span><span class="row-title">${escapeHtml(account.name)}</span><span class="row-meta">${divisionMeta(account)}</span></span><span class="division-split">${splitBarHtml(account, values, 'card-' + account.id)}<span class="split-caption">${avatarStack(account)}${pending}</span></span><span class="card-foot"><span><small>Total</small><span class="row-total">${countMarkup(values.total, 'card-total-' + account.id)}</span></span>${icon('arrow-right', 'chev')}</span></button>`;
}
function renderRecentAccounts() {
  const element = document.getElementById('recent-accounts');
  element.innerHTML = state.accounts.length
    ? state.accounts.slice(0, 5).map(divisionRow).join('')
    : emptyState({ art: 'receipt-text', title: 'Você ainda não criou divisões', text: 'Restaurante, viagem, churrasco: crie uma divisão e lance os itens. As contas ficam com a gente.', action: `<button class="button primary" type="button" data-action="new-account">${icon('plus')}Criar a primeira divisão</button>` });
}
function renderAllAccounts() {
  const element = document.getElementById('all-accounts');
  const query = normalizeSearch(document.getElementById('account-search').value);
  if (!state.accounts.length) { element.innerHTML = emptyState({ art: 'receipt-text', title: 'Você ainda não criou divisões', text: 'Comece criando uma divisão para organizar os valores.', action: `<button class="button primary" type="button" data-action="new-account">${icon('plus')}Nova divisão</button>` }); return; }
  const shown = state.accounts.filter(account => !query || normalizeSearch(`${account.name} ${account.place} ${account.kind}`).includes(query));
  element.innerHTML = shown.length ? shown.map(divisionCard).join('') : emptyState({ art: 'search', title: 'Nenhuma divisão encontrada', text: 'Tente outro nome ou local.', compact: true });
}
function renderPeople() {
  const element = document.getElementById('people-list');
  const query = normalizeSearch(document.getElementById('people-search').value);
  if (!state.people.length) { element.innerHTML = emptyState({ art: 'users', title: 'Nenhum amigo cadastrado', text: 'Cadastre uma vez e escolha a pessoa em qualquer divisão.', action: `<button class="button primary" type="button" data-action="add-person">${icon('user-plus')}Cadastrar amigo</button>` }); return; }
  const shown = state.people.filter(participant => !query || normalizeSearch(participant.name).includes(query));
  element.innerHTML = shown.length ? shown.map(participant => {
    const divisions = state.accounts.filter(account => account.people.some(entry => entry.personId === participant.id && !entry.removed)).length;
    const key = escapeHtml(participant.id);
    return `<div class="person-card">${avatarHtml(participant, 'avatar-lg')}<div class="person-card-main"><strong>${escapeHtml(participant.name)}</strong><span class="row-meta">${participant.weight > 1 ? `<span class="tag tag-couple">${icon('heart')}Casal</span>` : '<span class="tag tag-neutral">Individual</span>'}<span>${participant.weight > 1 ? 'Conta como 2 · ' : ''}${divisions ? `Em ${plural(divisions, 'divisão', 'divisões')}` : 'Fora das divisões'}</span></span></div>${menuHtml([{ label: 'Editar', icon: 'pencil', attr: `data-edit-person="${key}"` }, { sep: true }, { label: 'Excluir cadastro', icon: 'trash-2', attr: `data-delete-person="${key}"`, danger: true }])}</div>`;
  }).join('') : emptyState({ art: 'search', title: 'Nenhum amigo encontrado', text: 'Confira o nome digitado.', compact: true });
}
// Ilustração do painel inicial: mostra a divisão mais recente com valores; sem divisões, um exemplo rotulado.
const ENGINE_SAMPLE = [['festa', 7200], ['raposa', 4800], ['oculos', 6600], ['coala', 5400]];
function renderEngine() {
  const button = document.getElementById('engine-open');
  const caption = document.getElementById('engine-caption');
  const latest = state.accounts.find(account => splitParts(account, C.calc(account)).length);
  let total, parts, extra = 0;
  if (latest) {
    const values = C.calc(latest);
    const ranked = splitParts(latest, values).sort((a, b) => b[1] - a[1]);
    extra = Math.max(0, ranked.length - 4);
    parts = ranked.slice(0, 4).map(([personId, amount]) => ({ avatar: memberView(latest, personId).avatar, amount }));
    total = values.total;
    button.dataset.open = latest.id;
    button.removeAttribute('tabindex'); button.removeAttribute('aria-hidden');
    button.setAttribute('aria-label', `Abrir a divisão ${latest.name}`);
    caption.innerHTML = `${icon('receipt-text')}<span>Mais recente: <strong>${escapeHtml(latest.name)}</strong>${extra ? ` · +${plural(extra, 'pessoa', 'pessoas')}` : ''}</span>`;
  } else {
    parts = ENGINE_SAMPLE.map(([avatar, amount]) => ({ avatar, amount }));
    total = parts.reduce((sum, item) => sum + item.amount, 0);
    delete button.dataset.open;
    button.setAttribute('tabindex', '-1'); button.setAttribute('aria-hidden', 'true'); button.removeAttribute('aria-label');
    caption.innerHTML = '<span class="engine-sample">Exemplo</span><span>Assim o Calotim divide uma conta</span>';
  }
  const count = parts.length;
  const ys = parts.map((_, index) => Math.round(120 + (index - (count - 1) / 2) * 53));
  const branch = y => `M218 120C262 120 272 ${y} 316 ${y}`;
  document.getElementById('engine-dynamic').innerHTML = parts.map((part, index) => `<g class="engine-branch"><path class="engine-wire" d="${branch(ys[index])}"/><svg x="318" y="${ys[index] - 17}" width="34" height="34" viewBox="0 0 40 40"><g clip-path="url(#engine-clip)">${A.art(part.avatar)}</g></svg><text class="engine-amount" x="360" y="${ys[index] + 4}">${money(part.amount)}</text></g>`).join('')
    + `<g class="engine-pulses">${ys.map((y, index) => `<circle r="3.5"><animateMotion dur="2.6s" begin="${(-index * 2.6 / count).toFixed(2)}s" repeatCount="indefinite" path="M134 120H${branch(y).slice(1)}"/></circle>`).join('')}</g>`;
  document.getElementById('engine-label').textContent = latest ? 'Total' : 'Total do exemplo';
  animateNumber(document.getElementById('engine-total'), total, 'engine-total', money);
  if (reduceMotion.matches) document.getElementById('engine-svg').pauseAnimations?.();
}
function renderDashboard() {
  const total = state.accounts.reduce((sum, account) => sum + C.calc(account).total, 0);
  const summary = document.getElementById('hero-summary');
  if (!state.accounts.length) {
    summary.textContent = 'Crie uma divisão, escolha quem participou e lance os itens. A gente faz as contas, centavo por centavo.';
  } else {
    const accounts = state.accounts.length; const people = state.people.length;
    summary.innerHTML = `<strong class="hl">${countMarkup(total, 'dash-total')}</strong> organizados em <strong>${countMarkup(accounts, 'dash-accounts', 'int')}</strong> ${accounts === 1 ? 'divisão' : 'divisões'}, com <strong>${countMarkup(people, 'dash-people', 'int')}</strong> ${people === 1 ? 'amigo' : 'amigos'} na sua agenda.`;
  }
  renderRecentAccounts();
  renderEngine();
}
function renderAll() {
  renderDashboard(); renderAllAccounts(); renderPeople();
  if (currentAccountId && getAccount(currentAccountId) && currentView === 'detail') openAccount(currentAccountId);
  const visible = document.querySelector('.view.active');
  if (visible && visible.id !== 'view-detail') hydrate(visible);
}

/* ---------- extrato ---------- */
const LOGO_SVG = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#245A43"/><circle cx="16" cy="16" r="8.5" fill="none" stroke="#fff" stroke-width="3"/><path d="M16 16V6a10 10 0 0 1 10 10z" fill="#F28B42"/></svg>';
function statementMarkup(account, nameFor, options = {}) {
  const values = C.calc(account);
  const { lines } = C.buildLines(account);
  const lineTotals = new Map(lines.map(line => [line.id, line.total]));
  const arrow = icon('arrow-right');
  const status = (lineId, payerId) => {
    if (payerId && account.people.some(entry => entry.personId === payerId)) return `Pago por ${escapeHtml(nameFor(payerId))}`;
    const prepaid = C.prepaidOnLine(account, lineId);
    return prepaid > 0 ? `Pagamento antecipado de ${money(prepaid)}` : 'Pendente com o estabelecimento';
  };
  const created = account.createdAt ? new Date(account.createdAt) : new Date();
  const date = Number.isNaN(created.getTime()) ? new Date().toLocaleDateString('pt-BR') : created.toLocaleDateString('pt-BR');
  const transfers = C.suggestSettlements(values.balances);
  const head = (tag, extraTitle) => `<div class="statement-brand">${LOGO_SVG}<strong>calotim</strong><span class="statement-tag">${tag}</span></div><h2>${escapeHtml(account.name)}${extraTitle ? ' · ' + escapeHtml(extraTitle) : ''}</h2><p class="statement-meta">${escapeHtml(kindInfo(account.kind).label)}${account.place ? ' · ' + escapeHtml(account.place) : ''} · Criada em ${escapeHtml(date)}</p>`;
  const disclaimer = '<p class="statement-disclaimer">Extrato informativo gerado pelo Calotim. A divisão calculada não confirma o pagamento e o Calotim não movimenta dinheiro. Confira os valores com o estabelecimento antes de encerrar a comanda.</p>';
  const transferLine = (from, to, amount) => `<div class="statement-transfer"><span>${escapeHtml(from)} ${arrow} ${escapeHtml(to)}</span><strong>${money(amount)}</strong></div>`;

  if (options.personId) {
    const personId = options.personId;
    const rows = lines.filter(line => line.shares[personId]).map(line => {
      const item = account.items.find(entry => entry.id === line.id);
      const fee = item ? null : account.fees.find(entry => entry.id === line.id);
      const label = item ? escapeHtml(item.name) : escapeHtml(fee?.title || 'Taxa');
      const extra = item ? `<small>${escapeHtml(C.formatQuantity(item.quantity))} un. × ${money(item.unitPriceCents)} no total</small>` : `<small>${escapeHtml(fee ? feeSummaryText(fee) : '')}</small>`;
      return `<tr><td><strong>${label}</strong>${extra}</td><td>${money(line.shares[personId])}</td><td>${status(line.id, line.payerId)}</td></tr>`;
    }).join('');
    const mine = transfers.filter(item => item.from === personId || item.to === personId).map(item => transferLine(nameFor(item.from), nameFor(item.to), item.amount)).join('');
    return `<div class="statement-paper">${head('Extrato individual', nameFor(personId))}<div class="statement-metrics"><div><small>Itens</small><strong>${money(values.itemShares[personId] || 0)}</strong></div><div><small>Taxas e descontos</small><strong>${money(values.feeShares[personId] || 0)}</strong></div><div><small>Parte total</small><strong>${money(values.shareTotals[personId] || 0)}</strong></div></div><h3>Lançamentos desta pessoa</h3><div class="statement-scroll"><table class="statement-table"><thead><tr><th>Descrição</th><th>Parte</th><th>Pagamento</th></tr></thead><tbody>${rows || '<tr><td colspan="3">Nenhum lançamento para esta pessoa.</td></tr>'}</tbody></table></div><h3>Ainda deve ao estabelecimento</h3><p class="statement-note"><strong>${money(Math.max(0, values.unpaidShares[personId] || 0))}</strong></p><h3>Acertos entre participantes</h3>${mine || '<p class="statement-note">Nenhum acerto pendente para esta pessoa.</p>'}${disclaimer}</div>`;
  }

  const itemRows = account.items.map(item => {
    const allocations = C.allocateItem(account, item);
    const allocationText = Object.entries(allocations).map(([personId, amount]) => `${escapeHtml(nameFor(personId))}: ${money(amount)}${item.mode === 'quantity' && item.consumption?.[personId] ? ` (${escapeHtml(C.formatQuantity(item.consumption[personId]))} un.)` : ''}`).join(' · ') || 'Sem participantes';
    return `<tr><td><strong>${escapeHtml(item.name)}</strong>${item.category ? `<small>${escapeHtml(item.category)}</small>` : ''}<small>${escapeHtml(C.formatQuantity(item.quantity))} un. × ${money(item.unitPriceCents)} cada</small><small>${allocationText}</small></td><td>${money(item.amountCents)}</td><td>${status(item.id, item.payerId)}</td></tr>`;
  }).join('');
  const feeRows = account.fees.map(fee => `<tr><td><strong>${escapeHtml(fee.title)}</strong><small>${escapeHtml(feeSummaryText(fee))} · ${fee.participants.map(personId => escapeHtml(nameFor(personId))).join(', ')}</small></td><td>${money(lineTotals.get(fee.id) || 0)}</td><td>${status(fee.id, fee.payerId)}</td></tr>`).join('');
  const categories = new Map();
  account.items.forEach(item => { const key = item.category || 'Sem categoria'; categories.set(key, (categories.get(key) || 0) + item.amountCents); });
  const categoryRows = account.items.some(item => item.category) ? [...categories].map(([name, amount]) => `<div class="statement-transfer"><span>${escapeHtml(name)}</span><strong>${money(amount)}</strong></div>`).join('') : '';
  const participantRows = account.people.map(entry => `<tr><td>${escapeHtml(nameFor(entry.personId))}</td><td>${money(values.itemShares[entry.personId] || 0)}</td><td>${money(values.feeShares[entry.personId] || 0)}</td><td>${money(values.shareTotals[entry.personId] || 0)}</td><td>${money(Math.max(0, values.unpaidShares[entry.personId] || 0))}</td></tr>`).join('');
  const unpaidRows = account.people.filter(entry => (values.unpaidShares[entry.personId] || 0) > 0).map(entry => transferLine(nameFor(entry.personId), 'estabelecimento', values.unpaidShares[entry.personId])).join('');
  const transferRows = transfers.map(item => transferLine(nameFor(item.from), nameFor(item.to), item.amount)).join('');
  return `<div class="statement-paper">${head('Extrato de divisão')}<div class="statement-metrics"><div><small>Valor total</small><strong>${money(values.total)}</strong></div><div><small>A pagar ao estabelecimento</small><strong>${money(values.unpaidTotal)}</strong></div><div><small>Já pago</small><strong>${money(values.paidTotal)}</strong></div></div><h3>Itens lançados</h3><div class="statement-scroll"><table class="statement-table"><thead><tr><th>Item e divisão</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>${itemRows || '<tr><td colspan="3">Nenhum item lançado.</td></tr>'}</tbody></table></div>${feeRows ? `<h3>Taxas e descontos</h3><div class="statement-scroll"><table class="statement-table"><thead><tr><th>Descrição</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>${feeRows}</tbody></table></div>` : ''}${categoryRows ? `<h3>Subtotal dos itens por categoria</h3>${categoryRows}` : ''}<h3>Resumo por participante</h3><div class="statement-scroll"><table class="statement-table"><thead><tr><th>Participante</th><th>Itens</th><th>Taxas</th><th>Parte total</th><th>Ainda deve ao estabelecimento</th></tr></thead><tbody>${participantRows || '<tr><td colspan="5">Nenhum participante.</td></tr>'}</tbody></table></div><h3>Valores pendentes com o estabelecimento</h3>${unpaidRows || '<p class="statement-note">Nenhum valor pendente registrado.</p>'}<h3>Acerto entre participantes</h3>${transferRows || '<p class="statement-note">Nenhuma transferência entre participantes pendente.</p>'}${disclaimer}</div>`;
}
// Imprime o extrato na própria página (sem janela pop-up). "Salvar como PDF" fica na janela de impressão.
function printStatement(account, nameFor, options = {}) {
  const root = document.getElementById('print-root');
  root.innerHTML = statementMarkup(account, nameFor, options);
  const previousTitle = document.title;
  document.title = `Extrato · ${account.name}${options.personId ? ' · ' + nameFor(options.personId) : ''}`;
  const cleanup = () => { root.innerHTML = ''; document.title = previousTitle; window.removeEventListener('afterprint', cleanup); };
  window.addEventListener('afterprint', cleanup);
  setTimeout(() => window.print(), 80);
}

/* ---------- compartilhamento ---------- */
function encodeSharePayload(account) {
  const payload = { version: 2, account, people: account.people.map(entry => ({ personId: entry.personId, name: lookupName(entry.personId, account) })) };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function decodeSharePayload(encoded) {
  if (encoded.length > MAX_SHARE_CHARS || !/^[A-Za-z0-9_-]+$/.test(encoded)) throw new Error('Link inválido');
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function shareStatement(account) {
  if (!['http:', 'https:'].includes(location.protocol) || ['localhost', '127.0.0.1', '::1'].includes(location.hostname)) {
    toast('O link público fica disponível depois que o Calotim for publicado na internet.');
    return;
  }
  const encoded = encodeSharePayload(account);
  if (encoded.length > 18000) { toast('Esta divisão ficou grande demais para um link direto. O link curto chega com o banco online.'); return; }
  const url = `${location.origin}${location.pathname}#extrato=${encoded}`;
  const shareData = { title: `Extrato · ${account.name}`, text: 'Confira o extrato desta divisão no Calotim.', url };
  if (navigator.share) {
    try { await navigator.share(shareData); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast('Link do extrato copiado. Envie pelo WhatsApp ou outro aplicativo.');
  } catch {
    window.prompt('Copie o link do extrato:', url);
  }
}
function renderSharedStatement(payload) {
  if (!payload || typeof payload !== 'object' || ![1, 2].includes(payload.version) || !payload.account || !Array.isArray(payload.people)) throw new Error('Link inválido');
  const account = C.normalizeAccount(payload.account);
  if (!account) throw new Error('Link inválido');
  const names = new Map(payload.people.filter(item => item && typeof item === 'object').map(item => [String(item.personId), String(item.name ?? '').slice(0, 120)]));
  const nameFor = personId => names.get(String(personId)) || 'Participante';
  sharedAccount = account;
  sharedNameLookup = nameFor;
  document.getElementById('shared-statement-content').innerHTML = statementMarkup(account, nameFor);
  document.getElementById('shared-export-statement').hidden = false;
  showView('share');
}
function handleSharedLink() {
  const match = location.hash.match(/^#extrato=(.+)$/);
  if (!match) return false;
  try { renderSharedStatement(decodeSharePayload(match[1])); return true; }
  catch {
    sharedAccount = null;
    document.getElementById('shared-export-statement').hidden = true;
    document.getElementById('shared-statement-content').innerHTML = emptyState({ art: 'link', tone: 'orange', title: 'Não foi possível abrir este extrato', text: 'O link pode estar incompleto ou inválido. Peça um novo link para quem enviou.' });
    showView('share'); return true;
  }
}

/* ---------- backup ---------- */
function exportBackup() {
  const payload = { app: 'calotim', formatVersion: C.STATE_VERSION, exportedAt: new Date().toISOString(), state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = `calotim-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Backup exportado.');
}
function importBackupFromText(textContent) {
  let incoming;
  try {
    const parsed = JSON.parse(textContent);
    const raw = parsed && typeof parsed === 'object' && parsed.state ? parsed.state : parsed;
    if (!raw || typeof raw !== 'object' || (!Array.isArray(raw.accounts) && !Array.isArray(raw.people))) throw new Error('formato');
    incoming = C.normalizeState(raw);
  } catch { toast('Arquivo inválido. Escolha um backup exportado pelo Calotim.'); return; }
  openModal('Importar backup', `<p class="setup-intro">O arquivo tem <strong>${plural(incoming.accounts.length, 'divisão', 'divisões')}</strong> e <strong>${plural(incoming.people.length, 'pessoa', 'pessoas')}</strong>.</p><div class="field option-stack"><label class="check-option"><input type="radio" name="importMode" value="merge" checked><span>Mesclar com os dados atuais <small>(não apaga nada e ignora o que já existe)</small></span></label><label class="check-option"><input type="radio" name="importMode" value="replace"><span>Substituir todos os dados deste navegador</span></label></div><p class="field-hint">${icon('info')}Antes de substituir, exporte um backup dos dados atuais.</p>`, data => {
    if (data.importMode === 'replace') {
      state.people = incoming.people; state.accounts = incoming.accounts;
      save(); closeModal(); showView('accounts'); toast('Backup restaurado.');
    } else {
      const merged = C.mergeStates(state, incoming);
      state.people = merged.state.people; state.accounts = merged.state.accounts;
      save(); closeModal(); showView('accounts'); toast(`Importado: ${plural(merged.addedAccounts, 'divisão nova', 'divisões novas')} e ${plural(merged.addedPeople, 'pessoa nova', 'pessoas novas')}.`);
    }
  }, 'Importar');
}

/* ---------- paleta de comandos (Ctrl/Cmd + K) ---------- */
let commandItems = [];
let commandIndex = 0;
function commandCatalog() {
  const list = [];
  const account = currentView === 'detail' ? getAccount(currentAccountId) : null;
  if (account) {
    list.push({ group: account.name, icon: 'plus', label: 'Adicionar item', run: addExpense });
    list.push({ group: account.name, icon: 'percent', label: 'Taxa ou desconto', run: addFee });
    list.push({ group: account.name, icon: 'user-plus', label: 'Adicionar participantes', run: () => participantsModal(account.id) });
    list.push({ group: account.name, icon: 'arrow-right-left', label: 'Ver acerto de contas', run: () => applyTab('settle') });
    list.push({ group: account.name, icon: 'download', label: 'Exportar extrato em PDF', run: () => printStatement(account, personId => lookupName(personId, account)) });
    list.push({ group: account.name, icon: 'share-2', label: 'Compartilhar extrato', run: () => shareStatement(account) });
  }
  list.push({ group: 'Ações', icon: 'plus', label: 'Nova divisão', run: () => createAccountModal() });
  list.push({ group: 'Ações', icon: 'user-plus', label: 'Cadastrar amigo', run: addPersonModal });
  list.push({ group: 'Ações', icon: 'hard-drive-download', label: 'Exportar backup', run: exportBackup });
  list.push({ group: 'Ir para', icon: 'house', label: 'Visão geral', run: () => showView('dashboard') });
  list.push({ group: 'Ir para', icon: 'receipt-text', label: 'Minhas divisões', run: () => showView('accounts') });
  list.push({ group: 'Ir para', icon: 'users', label: 'Amigos', run: () => showView('people') });
  list.push({ group: 'Ir para', icon: 'settings', label: 'Configurações', run: () => showView('settings') });
  state.accounts.forEach(item => list.push({ group: 'Divisões', icon: kindInfo(item.kind).icon, label: item.name, hint: money(C.calc(item).total), run: () => openAccount(item.id) }));
  return list;
}
function renderCommandList() {
  const query = normalizeSearch(document.getElementById('command-input').value);
  commandItems = commandCatalog().filter(item => !query || normalizeSearch(`${item.label} ${item.group}`).includes(query));
  if (commandIndex >= commandItems.length) commandIndex = 0;
  const list = document.getElementById('command-list');
  if (!commandItems.length) { list.innerHTML = '<div class="command-empty">Nada encontrado. Tente outra palavra.</div>'; updateCommandActive(); return; }
  let lastGroup = null;
  list.innerHTML = commandItems.map((item, index) => {
    const header = item.group !== lastGroup ? `<div class="command-group" role="presentation">${escapeHtml(item.group)}</div>` : '';
    lastGroup = item.group;
    return `${header}<button type="button" class="command-item" role="option" id="cmd-${index}" data-command-index="${index}" aria-selected="${index === commandIndex}" tabindex="-1"><span class="cmd-icon">${icon(item.icon)}</span><span class="cmd-label">${escapeHtml(item.label)}</span>${item.hint ? `<span class="cmd-hint">${escapeHtml(item.hint)}</span>` : '<span></span>'}</button>`;
  }).join('');
  updateCommandActive();
}
function updateCommandActive() {
  const input = document.getElementById('command-input');
  document.querySelectorAll('.command-item').forEach(item => item.setAttribute('aria-selected', String(Number(item.dataset.commandIndex) === commandIndex)));
  const active = document.getElementById('cmd-' + commandIndex);
  if (active) { input.setAttribute('aria-activedescendant', active.id); active.scrollIntoView({ block: 'nearest' }); }
  else input.removeAttribute('aria-activedescendant');
}
function openCommand() {
  const dialog = document.getElementById('command');
  if (dialog.open || document.querySelector('dialog[open]')) return;
  const input = document.getElementById('command-input');
  input.value = ''; commandIndex = 0;
  renderCommandList();
  dialog.showModal();
  input.focus();
}
function closeCommand() { const dialog = document.getElementById('command'); if (dialog.open) dialog.close(); }
function runCommand(index) {
  const item = commandItems[index];
  if (!item) return;
  closeCommand();
  item.run();
}

/* ---------- eventos ---------- */
document.addEventListener('click', event => {
  // Fecha menus de ação abertos ao clicar fora ou em uma opção.
  document.querySelectorAll('details.menu[open]').forEach(menu => { if (!menu.contains(event.target) || event.target.closest('.menu-item')) menu.removeAttribute('open'); });
  const nav = event.target.closest('[data-view]');
  if (nav) { event.preventDefault(); showView(nav.dataset.view); hydrate(document.getElementById('view-' + nav.dataset.view)); }
  const go = event.target.closest('[data-go]'); if (go) { showView(go.dataset.go); hydrate(document.getElementById('view-' + go.dataset.go)); }
  const open = event.target.closest('[data-open]'); if (open) openAccount(open.dataset.open);
  const action = event.target.closest('[data-action]');
  if (action) {
    const name = action.dataset.action;
    if (name === 'add-item') addExpense();
    else if (name === 'add-fee') addFee();
    else if (name === 'add-people' && currentAccountId) participantsModal(currentAccountId);
    else if (name === 'new-account') createAccountModal();
    else if (name === 'add-person') addPersonModal();
  }
  const tabGo = event.target.closest('[data-tab-go]');
  if (tabGo) { applyTab(tabGo.dataset.tabGo); setLiveOpen(false); if (compactLayout.matches) document.getElementById('detail-tabs').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' }); }
  const tab = event.target.closest('[role="tab"][data-tab]'); if (tab) applyTab(tab.dataset.tab);
  if (event.target.closest('.live-head') && compactLayout.matches) setLiveOpen(!document.getElementById('live-panel').classList.contains('open'));
  const account = currentAccountId ? getAccount(currentAccountId) : null;
  const removeItem = event.target.closest('[data-delete-item]');
  if (removeItem && account) { const item = account.items.find(entry => entry.id === removeItem.dataset.deleteItem); if (item) deleteLine(account.id, item.id, item.name); }
  const removeFee = event.target.closest('[data-delete-fee]');
  if (removeFee && account) { const fee = account.fees.find(entry => entry.id === removeFee.dataset.deleteFee); if (fee) deleteLine(account.id, fee.id, fee.title); }
  const editItem = event.target.closest('[data-edit-item]');
  if (editItem && account) { const item = account.items.find(entry => entry.id === editItem.dataset.editItem); if (item) itemModal(account.id, { item }); }
  const duplicateItem = event.target.closest('[data-duplicate-item]');
  if (duplicateItem && account) { const item = account.items.find(entry => entry.id === duplicateItem.dataset.duplicateItem); if (item) itemModal(account.id, { item, duplicate: true }); }
  const editFee = event.target.closest('[data-edit-fee]');
  if (editFee && account) { const fee = account.fees.find(entry => entry.id === editFee.dataset.editFee); if (fee) feeModal(account.id, { fee }); }
  if (event.target.closest('.pk-add-new')) pickerAddNew();
  const pickerRemoveButton = event.target.closest('[data-picker-remove]');
  if (pickerRemoveButton) pickerRemove(pickerRemoveButton.dataset.pickerRemove);
  const payMember = event.target.closest('[data-pay-member]'); if (payMember && account) registerMemberPayment(account.id, payMember.dataset.payMember);
  const personStatement = event.target.closest('[data-person-statement]');
  if (personStatement && account) printStatement(account, personId => lookupName(personId, account), { personId: personStatement.dataset.personStatement });
  const editPerson = event.target.closest('[data-edit-person]'); if (editPerson) editPersonModal(editPerson.dataset.editPerson);
  const deletePerson = event.target.closest('[data-delete-person]'); if (deletePerson) deleteGlobalPerson(deletePerson.dataset.deletePerson);
  const removePerson = event.target.closest('[data-remove-account-person]'); if (removePerson && account) removeAccountPerson(account.id, removePerson.dataset.removeAccountPerson);
  const restorePerson = event.target.closest('[data-restore-person]');
  if (restorePerson && account) { const entry = account.people.find(item => item.personId === restorePerson.dataset.restorePerson); if (entry) { entry.removed = false; delete entry.removedAt; save(); openAccount(account.id); toast('Participante reativado.'); } }
  const commandItem = event.target.closest('[data-command-index]'); if (commandItem) runCommand(Number(commandItem.dataset.commandIndex));
});
// Abre menus para cima quando não há espaço embaixo.
document.addEventListener('toggle', event => {
  const menu = event.target;
  if (!(menu instanceof HTMLDetailsElement) || !menu.classList.contains('menu') || !menu.open) return;
  document.querySelectorAll('details.menu[open]').forEach(other => { if (other !== menu) other.removeAttribute('open'); });
  menu.classList.remove('up');
  const list = menu.querySelector('.menu-list');
  const rect = menu.getBoundingClientRect();
  const dock = compactLayout.matches ? (document.body.classList.contains('on-detail') ? 150 : 80) : 16;
  if (rect.bottom + list.offsetHeight + 12 > window.innerHeight - dock && rect.top > list.offsetHeight + 12) menu.classList.add('up');
}, true);
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (document.getElementById('command').open) closeCommand(); else openCommand();
    return;
  }
  if (event.key === 'Escape') document.querySelectorAll('details.menu[open]').forEach(menu => menu.removeAttribute('open'));
  // Enter no campo de nome do novo amigo adiciona a pessoa em vez de concluir a divisão.
  if (event.key === 'Enter' && event.target.id === 'pk-name') { event.preventDefault(); pickerAddNew(); }
  if (event.key === 'Enter' && event.target.id === 'friend-search') event.preventDefault();
  const tab = event.target.closest?.('[role="tab"][data-tab]');
  if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const order = ['items', 'fees', 'people', 'settle'];
    const index = order.indexOf(tab.dataset.tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? order.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + order.length) % order.length;
    applyTab(order[next], true);
  }
});
document.getElementById('command-input').addEventListener('input', () => { commandIndex = 0; renderCommandList(); });
document.getElementById('command-input').addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!commandItems.length) return;
    commandIndex = (commandIndex + (event.key === 'ArrowDown' ? 1 : -1) + commandItems.length) % commandItems.length;
    updateCommandActive();
  } else if (event.key === 'Enter') { event.preventDefault(); runCommand(commandIndex); }
});
document.getElementById('command-list').addEventListener('mousemove', event => {
  const item = event.target.closest('[data-command-index]');
  if (item && Number(item.dataset.commandIndex) !== commandIndex) { commandIndex = Number(item.dataset.commandIndex); updateCommandActive(); }
});
document.getElementById('command').addEventListener('click', event => { if (event.target === event.currentTarget) closeCommand(); });
document.getElementById('open-command').onclick = openCommand;

document.getElementById('new-account-top').onclick = () => createAccountModal();
document.getElementById('new-account-hero').onclick = () => createAccountModal();
document.getElementById('hero-add-person').onclick = () => addPersonModal();
document.getElementById('new-account-list').onclick = () => createAccountModal();
document.getElementById('bnav-fab').onclick = primaryActionForView;
document.getElementById('edit-account').onclick = () => createAccountModal(currentAccountId);
document.getElementById('delete-account').onclick = () => deleteAccount(currentAccountId);
document.getElementById('add-person').onclick = () => addPersonModal();
document.getElementById('add-expense').onclick = addExpense;
document.getElementById('add-fee').onclick = addFee;
document.getElementById('add-person-account').onclick = () => participantsModal(currentAccountId);
document.getElementById('back-accounts').onclick = () => { showView('accounts'); hydrate(document.getElementById('view-accounts')); };
document.getElementById('category-filter').onchange = event => { categoryFilter = event.target.value; openAccount(currentAccountId); };
document.getElementById('account-search').addEventListener('input', () => { renderAllAccounts(); hydrate(document.getElementById('view-accounts')); });
document.getElementById('people-search').addEventListener('input', renderPeople);
document.getElementById('export-statement').onclick = () => { const account = getAccount(currentAccountId); if (account) printStatement(account, personId => lookupName(personId, account)); };
document.getElementById('share-statement').onclick = () => { const account = getAccount(currentAccountId); if (account) shareStatement(account); };
document.getElementById('shared-export-statement').onclick = () => { if (sharedAccount) printStatement(sharedAccount, sharedNameLookup); };
document.getElementById('modal-content').addEventListener('input', event => {
  if (event.target.id === 'item-quantity' || event.target.id === 'item-unit-price') updateItemPreview();
  if (event.target.id === 'item-quantity' || event.target.closest('#who-units')) updateAllocationSum();
  if (event.target.id === 'friend-search' && picker) { picker.search = event.target.value; renderPicker(); }
});
document.getElementById('modal-content').addEventListener('change', event => {
  if (event.target.dataset.pickerFriend && picker) pickerToggleFriend(event.target.dataset.pickerFriend, event.target.checked);
  if (event.target.name === 'who') {
    const who = event.target.value;
    document.getElementById('who-some').hidden = who !== 'some';
    document.getElementById('who-units').hidden = who !== 'units';
    const couple = document.getElementById('couple-option');
    couple.hidden = who === 'units' || couple.dataset.hasCouple !== '1';
    updateAllocationSum();
  }
  if (event.target.name === 'feeTemplate') applyFeeTemplate(event.target.value);
  if (event.target.name === 'mode' && document.getElementById('fee-value')) updateFeeLabels();
});
document.getElementById('modal-form').addEventListener('submit', event => {
  event.preventDefault();
  if (event.submitter?.value === 'cancel') { closeModal(); return; }
  const form = event.currentTarget;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (modalAction) modalAction(formData());
});
document.getElementById('modal').addEventListener('click', event => {
  if (event.target === event.currentTarget) closeModal();
});
document.getElementById('modal').addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
document.getElementById('export-backup').onclick = exportBackup;
document.getElementById('import-backup').onclick = () => document.getElementById('import-backup-file').click();
document.getElementById('import-backup-file').onchange = event => {
  const file = event.target.files[0]; event.target.value = '';
  if (!file) return;
  if (file.size > MAX_BACKUP_BYTES) { toast('O arquivo é grande demais para um backup do Calotim (limite de 5 MB).'); return; }
  const reader = new FileReader();
  reader.onload = () => importBackupFromText(String(reader.result));
  reader.onerror = () => toast('Não foi possível ler o arquivo.');
  reader.readAsText(file);
};
document.getElementById('clear-data').onclick = async () => {
  const confirmed = await confirmDialog({ title: 'Apagar todos os dados deste navegador?', message: 'As divisões e os amigos salvos aqui serão apagados e não dá para desfazer.\nExporte um backup antes se quiser guardar os dados.', confirmLabel: 'Apagar tudo', danger: true });
  if (!confirmed) return;
  state.people = []; state.accounts = []; currentAccountId = null; save(); showView('dashboard'); toast('Dados apagados.');
};

// Destaque cruzado entre a barra de divisão e a lista de pessoas do painel ao vivo.
const livePanel = document.getElementById('live-panel');
function setHotPerson(personId) {
  livePanel.querySelectorAll('[data-person]').forEach(element => element.classList.toggle('is-hot', Boolean(personId) && element.dataset.person === personId));
  livePanel.querySelectorAll('.split-bar').forEach(bar => bar.classList.toggle('has-hot', Boolean(personId)));
}
livePanel.addEventListener('mouseover', event => { const target = event.target.closest('[data-person]'); setHotPerson(target ? target.dataset.person : null); });
livePanel.addEventListener('mouseleave', () => setHotPerson(null));

const toastElement = document.getElementById('toast');
toastElement.addEventListener('mouseenter', pauseToast);
toastElement.addEventListener('mouseleave', resumeToast);
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseToast(); else resumeToast(); });
window.addEventListener('resize', () => { moveNavPill(); moveTabInk(); });
window.addEventListener('hashchange', () => { if (!handleSharedLink() && currentView === 'share') location.reload(); });
compactLayout.addEventListener?.('change', () => { setLiveOpen(false); moveNavPill(); moveTabInk(); });
if (document.fonts?.ready) document.fonts.ready.then(() => { moveNavPill(); moveTabInk(); });

/* ---------- início ---------- */
(function initChrome() {
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    document.getElementById('command-kbd').innerHTML = `<span>${icon('command')}</span><span>K</span>`;
  }
})();
updateSaveStatus(true);
document.getElementById('save-status-sub').textContent = 'Nada sai do seu aparelho';
renderAll();
if (!handleSharedLink()) { showView('dashboard'); hydrate(document.getElementById('view-dashboard')); }
