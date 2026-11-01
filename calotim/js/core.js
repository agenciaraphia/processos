/*
 * Calotim core 0.6
 * Regras de cálculo puras (sem DOM). Todos os valores monetários são inteiros em centavos.
 * Funciona no navegador (window.CalotimCore) e no Node (require) para os testes automatizados.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CalotimCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STATE_VERSION = 2;
  const MODES = ['quantity', 'selected', 'weighted', 'manual'];
  const CATEGORIES = ['Alimentação', 'Bebidas', 'Hospedagem', 'Transporte', 'Combustível', 'Passeios e ingressos', 'Compras', 'Outras'];

  /* ---------- utilidades ---------- */
  function newId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return String(Date.now()) + Math.random().toString(16).slice(2);
  }
  function hashString(text) {
    let hash = 5381;
    const value = String(text || '');
    for (let i = 0; i < value.length; i++) hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
    return hash;
  }
  // Converte texto digitado ("12,50", "12.5") em centavos inteiros. Retorna NaN se inválido.
  function parseCents(input) {
    const text = String(input == null ? '' : input).trim().replace(',', '.');
    if (!/^-?\d+(\.\d+)?$/.test(text)) return NaN;
    return Math.round(Number(text + 'e2'));
  }
  function legacyCents(reais) {
    const value = Number(reais);
    return Number.isFinite(value) ? Math.round(value * 100) : 0;
  }
  function formatMoney(cents) {
    return ((Number(cents) || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  function formatQuantity(quantity) {
    return (Number(quantity) || 0).toLocaleString('pt-BR', { maximumFractionDigits: 3 });
  }
  function lineAmount(quantity, unitCents) {
    return Math.round(Number(quantity) * Number(unitCents));
  }
  function sum(values) { return values.reduce((total, value) => total + value, 0); }

  /*
   * Divide `total` centavos entre as entradas [[id, peso]] pelo método do maior resto.
   * A soma das partes é sempre exatamente igual ao total. O centavo excedente gira entre as
   * pessoas conforme `seed`, para que a mesma pessoa não receba sempre o centavo extra.
   */
  function distribute(total, entries, seed = 0) {
    const list = entries.map(([id, weight]) => [id, Math.round(Number(weight) * 1000)]).filter(([, weight]) => weight > 0);
    const result = {};
    if (!list.length) return result;
    const weightSum = sum(list.map(([, weight]) => weight));
    const sign = total < 0 ? -1 : 1;
    const absolute = Math.abs(Math.round(total));
    const parts = list.map(([id, weight], index) => {
      const product = absolute * weight;
      return { id, index, base: Math.floor(product / weightSum), rest: product % weightSum };
    });
    let left = absolute - sum(parts.map(part => part.base));
    const count = parts.length;
    const order = [...parts].sort((a, b) => b.rest - a.rest || (((a.index - seed) % count) + count) % count - (((b.index - seed) % count) + count) % count);
    order.forEach(part => { if (left > 0) { part.base += 1; left -= 1; } });
    parts.forEach(part => { result[part.id] = part.base === 0 ? 0 : sign * part.base; });
    return result;
  }

  /* ---------- participantes ---------- */
  function memberMap(account) {
    const map = new Map();
    (account.people || []).forEach(entry => map.set(entry.personId, entry));
    return map;
  }
  function activeMembers(account) { return (account.people || []).filter(entry => !entry.removed); }

  /* ---------- rateio ---------- */
  function weightOf(item, entry, personId) {
    const snapshot = item.weights && Number(item.weights[personId]);
    if (snapshot > 0) return snapshot;
    return Number(entry && entry.weight) > 0 ? Number(entry.weight) : 1;
  }
  // Parte de cada pessoa (em centavos) em um item.
  function allocateItem(account, item) {
    const members = memberMap(account);
    let entries;
    if (item.mode === 'quantity') {
      entries = Object.entries(item.consumption || {}).filter(([personId, quantity]) => members.has(personId) && Number(quantity) > 0);
    } else {
      const ids = (item.consumers || []).filter(personId => members.has(personId));
      entries = ids.map(personId => [personId, item.mode === 'weighted' ? weightOf(item, members.get(personId), personId) : 1]);
    }
    return distribute(item.amountCents || 0, entries, hashString(item.id));
  }
  // Parte de cada pessoa em uma taxa ou desconto. Porcentagens incidem somente sobre os itens (nunca taxa sobre taxa).
  function allocateFee(account, fee, itemShares) {
    const members = memberMap(account);
    const ids = (fee.participants || []).filter(personId => members.has(personId));
    const result = {};
    if (fee.mode === 'percent') {
      ids.forEach(personId => {
        const value = Math.round((itemShares[personId] || 0) * Number(fee.value) / 100);
        if (value) result[personId] = value;
      });
    } else {
      Object.assign(result, distribute(Math.round(fee.amountCents || 0), ids.map(personId => [personId, 1]), hashString(fee.id)));
    }
    if (fee.kind === 'discount') Object.keys(result).forEach(personId => { result[personId] = result[personId] === 0 ? 0 : -result[personId]; });
    Object.keys(result).forEach(personId => { if (result[personId] === 0) delete result[personId]; });
    return result;
  }

  // Linhas de cobrança (itens e depois taxas), com a parte de cada pessoa.
  function buildLines(account) {
    const itemShares = {};
    (account.people || []).forEach(entry => { itemShares[entry.personId] = 0; });
    const lines = [];
    (account.items || []).forEach(item => {
      const shares = allocateItem(account, item);
      Object.entries(shares).forEach(([personId, share]) => { itemShares[personId] = (itemShares[personId] || 0) + share; });
      lines.push({ id: item.id, type: 'item', payerId: item.payerId || null, shares, total: item.amountCents || 0 });
    });
    (account.fees || []).forEach(fee => {
      const shares = allocateFee(account, fee, itemShares);
      lines.push({ id: fee.id, type: 'fee', payerId: fee.payerId || null, shares, total: sum(Object.values(shares)) });
    });
    return { lines, itemShares };
  }
  function prepaidIndex(account) {
    const index = {};
    (account.memberPayments || []).forEach(payment => {
      Object.entries(payment.allocations || {}).forEach(([lineId, byPerson]) => {
        Object.entries(byPerson || {}).forEach(([personId, cents]) => {
          index[lineId] = index[lineId] || {};
          index[lineId][personId] = (index[lineId][personId] || 0) + (Number(cents) || 0);
        });
      });
    });
    return index;
  }
  function prepaidOnLine(account, lineId) {
    const byPerson = prepaidIndex(account)[lineId] || {};
    return sum(Object.values(byPerson));
  }

  function calc(account) {
    const ids = (account.people || []).map(entry => entry.personId);
    const zero = () => Object.fromEntries(ids.map(id => [id, 0]));
    const { lines, itemShares } = buildLines(account);
    const feeShares = zero(), unpaidShares = zero(), balances = zero();
    const prepaid = prepaidIndex(account);
    const itemsTotal = sum((account.items || []).map(item => item.amountCents || 0));
    let feesTotal = 0, paidTotal = 0, unpaidTotal = 0;

    lines.forEach(line => {
      if (line.type === 'fee') {
        feesTotal += line.total;
        Object.entries(line.shares).forEach(([personId, share]) => { feeShares[personId] = (feeShares[personId] || 0) + share; });
      }
      const lineSum = sum(Object.values(line.shares));
      const payerIsMember = Boolean(line.payerId) && Object.prototype.hasOwnProperty.call(balances, line.payerId);
      if (payerIsMember) {
        paidTotal += lineSum;
        Object.entries(line.shares).forEach(([personId, share]) => { balances[personId] += share; });
        balances[line.payerId] -= lineSum;
      } else {
        let lineUnpaid = 0;
        Object.entries(line.shares).forEach(([personId, share]) => {
          const already = (prepaid[line.id] && prepaid[line.id][personId]) || 0;
          const remaining = share >= 0 ? Math.max(0, share - already) : share;
          unpaidShares[personId] = (unpaidShares[personId] || 0) + remaining;
          lineUnpaid += remaining;
        });
        unpaidTotal += lineUnpaid;
        paidTotal += lineSum - lineUnpaid;
      }
    });

    const shareTotals = {};
    ids.forEach(id => { shareTotals[id] = (itemShares[id] || 0) + (feeShares[id] || 0); });
    return { total: itemsTotal + feesTotal, itemsTotal, feesTotal, itemShares, feeShares, shareTotals, unpaidShares, balances, paidTotal, unpaidTotal };
  }

  // Sugestão de acertos entre participantes (inteiros, sem resíduo de arredondamento).
  function suggestSettlements(balances) {
    const entries = Object.entries(balances).map(([personId, due]) => ({ personId, due }));
    const debtors = entries.filter(item => item.due > 0).map(item => ({ personId: item.personId, amount: item.due })).sort((a, b) => b.amount - a.amount || a.personId.localeCompare(b.personId));
    const creditors = entries.filter(item => item.due < 0).map(item => ({ personId: item.personId, amount: -item.due })).sort((a, b) => b.amount - a.amount || a.personId.localeCompare(b.personId));
    const result = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const value = Math.min(debtors[i].amount, creditors[j].amount);
      if (value > 0) result.push({ from: debtors[i].personId, to: creditors[j].personId, amount: value });
      debtors[i].amount -= value; creditors[j].amount -= value;
      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }
    return result;
  }
  function settlements(account) { return suggestSettlements(calc(account).balances); }

  /* ---------- pagamento antecipado ---------- */
  function outstandingFor(account, personId) {
    return Math.max(0, calc(account).unpaidShares[personId] || 0);
  }
  // Distribui o valor entre as linhas ainda pendentes da pessoa (mais antigas primeiro).
  function planPrepayment(account, personId, amountCents) {
    const { lines } = buildLines(account);
    const prepaid = prepaidIndex(account);
    const allocations = {};
    let remaining = Math.round(amountCents);
    lines.forEach(line => {
      if (remaining <= 0) return;
      if (line.payerId && (account.people || []).some(entry => entry.personId === line.payerId)) return;
      const share = line.shares[personId] || 0;
      const already = (prepaid[line.id] && prepaid[line.id][personId]) || 0;
      const available = Math.max(0, share - already);
      if (available <= 0) return;
      const applied = Math.min(available, remaining);
      allocations[line.id] = { [personId]: applied };
      remaining -= applied;
    });
    return { allocations, remaining };
  }
  function registerPrepayment(account, personId, amountCents, options = {}) {
    const cents = Math.round(amountCents);
    const outstanding = outstandingFor(account, personId);
    if (outstanding <= 0) return { ok: false, error: 'Essa pessoa não tem valor pendente com o estabelecimento.' };
    if (!Number.isFinite(cents) || cents <= 0 || cents > outstanding) return { ok: false, error: 'range', outstanding };
    const plan = planPrepayment(account, personId, cents);
    if (plan.remaining > 0) return { ok: false, error: 'Não foi possível distribuir todo o pagamento. Atualize a divisão e tente novamente.' };
    account.memberPayments = account.memberPayments || [];
    account.memberPayments.push({ id: newId(), personId, amountCents: cents, allocations: plan.allocations, createdAt: new Date().toISOString() });
    if (options.leave) {
      const entry = account.people.find(item => item.personId === personId);
      if (entry) {
        entry.displayName = options.displayName || entry.displayName || 'Participante';
        entry.avatar = options.avatar || entry.avatar || 'sorriso';
        entry.removed = true; entry.removedAt = new Date().toISOString();
      }
    }
    return { ok: true };
  }
  function recomputePayments(account) {
    account.memberPayments = (account.memberPayments || []).map(payment => {
      const total = sum(Object.values(payment.allocations || {}).map(byPerson => sum(Object.values(byPerson || {}))));
      return { ...payment, amountCents: total };
    }).filter(payment => payment.amountCents > 0);
  }
  // Remove um item ou uma taxa e ajusta os pagamentos antecipados ligados a ele. Retorna os centavos de abatimento perdidos.
  function removeLine(account, lineId) {
    const lost = prepaidOnLine(account, lineId);
    account.items = (account.items || []).filter(item => item.id !== lineId);
    account.fees = (account.fees || []).filter(fee => fee.id !== lineId);
    (account.memberPayments || []).forEach(payment => { if (payment.allocations) delete payment.allocations[lineId]; });
    recomputePayments(account);
    return lost;
  }
  // Depois de editar itens ou taxas, impede que um abatimento fique maior que a parte atual da pessoa.
  function reconcilePrepayments(account) {
    const { lines } = buildLines(account);
    const byId = new Map(lines.map(line => [line.id, line]));
    const used = {};
    let changed = 0;
    (account.memberPayments || []).forEach(payment => {
      Object.keys(payment.allocations || {}).forEach(lineId => {
        const line = byId.get(lineId);
        Object.keys(payment.allocations[lineId]).forEach(personId => {
          const current = Number(payment.allocations[lineId][personId]) || 0;
          const paidByMember = line && line.payerId && (account.people || []).some(entry => entry.personId === line.payerId);
          const allowed = !line || paidByMember ? 0 : Math.max(0, (line.shares[personId] || 0));
          const key = lineId + '|' + personId;
          const room = Math.max(0, allowed - (used[key] || 0));
          const next = Math.min(current, room);
          used[key] = (used[key] || 0) + next;
          if (next !== current) { changed += current - next; if (next > 0) payment.allocations[lineId][personId] = next; else delete payment.allocations[lineId][personId]; }
        });
        if (!Object.keys(payment.allocations[lineId]).length) delete payment.allocations[lineId];
      });
    });
    recomputePayments(account);
    return changed;
  }

  /* ---------- criação e validação de itens e taxas ---------- */
  function buildItem(input, account, previous) {
    const name = String(input.name || '').trim();
    const quantity = Number(input.quantity);
    const unitPriceCents = Math.round(Number(input.unitPriceCents));
    const mode = MODES.includes(input.mode) ? input.mode : 'selected';
    const active = activeMembers(account);
    if (!name || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPriceCents) || unitPriceCents <= 0) return { error: 'Informe descrição, quantidade e valor unitário válidos.' };
    if (!active.length) return { error: 'Adicione participantes primeiro.' };
    let consumers = [], consumption = {};
    if (mode === 'quantity') {
      Object.entries(input.consumption || {}).forEach(([personId, value]) => {
        const qty = Math.max(0, Number(value) || 0);
        if (qty > 0) { consumption[personId] = qty; consumers.push(personId); }
      });
      const assigned = Math.round(sum(Object.values(consumption)) * 1000);
      if (!consumers.length || Math.abs(assigned - Math.round(quantity * 1000)) > 1) return { error: `Distribua exatamente ${formatQuantity(quantity)} unidade(s) entre as pessoas.` };
    } else {
      const given = [...(input.consumers || [])];
      consumers = mode === 'manual' && !given.length ? active.map(entry => entry.personId) : given;
      if (!consumers.length) return { error: 'Selecione ao menos uma pessoa para dividir este item.' };
    }
    const weights = { ...(previous && previous.weights) };
    if (mode === 'weighted') consumers.forEach(personId => {
      if (!(weights[personId] > 0)) weights[personId] = weightOf({}, account.people.find(entry => entry.personId === personId), personId);
    });
    const payerId = input.payerId && account.people.some(entry => entry.personId === input.payerId) ? input.payerId : null;
    return {
      item: {
        id: previous ? previous.id : newId(), name, category: CATEGORIES.includes(input.category) ? input.category : '',
        quantity, unitPriceCents, amountCents: lineAmount(quantity, unitPriceCents), payerId, mode, consumers, consumption, weights,
        createdAt: previous ? previous.createdAt : new Date().toISOString()
      }
    };
  }
  function buildFee(input, account, previous) {
    const title = String(input.title || '').trim();
    const kind = input.kind === 'discount' ? 'discount' : 'fee';
    const mode = input.mode === 'fixed' ? 'fixed' : 'percent';
    const participants = [...new Set((input.participants || []).filter(personId => account.people.some(entry => entry.personId === personId)))];
    if (!title) return { error: 'Informe o nome da taxa ou do desconto.' };
    if (!participants.length) return { error: 'Selecione ao menos uma pessoa para dividir.' };
    const fee = { id: previous ? previous.id : newId(), title, kind, mode, participants, payerId: input.payerId && account.people.some(entry => entry.personId === input.payerId) ? input.payerId : null, createdAt: previous ? previous.createdAt : new Date().toISOString() };
    if (mode === 'percent') {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value <= 0 || value > 100) return { error: 'Informe uma porcentagem entre 0,01 e 100.' };
      fee.value = Math.round(value * 100) / 100;
    } else {
      const cents = Math.round(Number(input.amountCents));
      if (!Number.isFinite(cents) || cents <= 0) return { error: 'Informe um valor maior que zero.' };
      fee.amountCents = cents;
    }
    return { fee };
  }

  /* ---------- normalização e migração (v1 em reais para v2 em centavos) ---------- */
  const text = (value, fallback = '') => (typeof value === 'string' ? value : fallback);
  // Ids viram chaves de objetos nos cálculos. Estas chaves alterariam o protótipo e são recusadas.
  const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
  const safeKey = value => typeof value === 'string' && !UNSAFE_KEYS.has(value);
  const positive = (value, fallback = 1) => (Number(value) > 0 ? Number(value) : fallback);
  // Peso de uma pessoa na divisão. Só existem duas opções: pessoa sozinha (1) ou casal (2).
  // Dados antigos com outras cotas (meia cota, 3 cotas...) são aproximados para o valor mais próximo.
  const coupleWeight = value => (Number(value) >= 1.5 ? 2 : 1);

  function normalizeItem(raw, account) {
    if (!raw || typeof raw !== 'object') return null;
    const quantity = positive(raw.quantity, 1);
    const unitPriceCents = raw.unitPriceCents !== undefined ? Math.round(Number(raw.unitPriceCents) || 0) : legacyCents(raw.unitPrice);
    const amountCents = raw.amountCents !== undefined ? Math.round(Number(raw.amountCents) || 0) : legacyCents(raw.amount);
    const mode = MODES.includes(raw.mode) ? raw.mode : 'selected';
    let consumers = Array.isArray(raw.consumers) ? raw.consumers.filter(safeKey) : [];
    if (mode === 'manual' && !consumers.length) consumers = activeMembers(account).map(entry => entry.personId);
    const consumption = {};
    Object.entries(raw.consumption && typeof raw.consumption === 'object' ? raw.consumption : {}).forEach(([personId, value]) => { if (safeKey(personId) && Number(value) > 0) consumption[personId] = Number(value); });
    const weights = {};
    if (raw.weights && typeof raw.weights === 'object') Object.entries(raw.weights).forEach(([personId, value]) => { if (safeKey(personId) && Number(value) > 0) weights[personId] = Number(value); });
    if (mode === 'weighted') consumers.forEach(personId => {
      if (!(weights[personId] > 0)) weights[personId] = weightOf({}, account.people.find(entry => entry.personId === personId), personId);
    });
    return {
      id: text(raw.id) || newId(), name: text(raw.name, 'Item'), category: CATEGORIES.includes(raw.category) ? raw.category : '',
      quantity, unitPriceCents, amountCents, payerId: safeKey(raw.payerId) && raw.payerId ? raw.payerId : null,
      mode, consumers, consumption, weights, createdAt: text(raw.createdAt, new Date().toISOString())
    };
  }
  function normalizeFee(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const fee = {
      id: text(raw.id) || newId(), title: text(raw.title, 'Taxa'), kind: raw.kind === 'discount' ? 'discount' : 'fee',
      mode: raw.mode === 'fixed' ? 'fixed' : 'percent', participants: Array.isArray(raw.participants) ? raw.participants.filter(safeKey) : [],
      payerId: safeKey(raw.payerId) && raw.payerId ? raw.payerId : null, createdAt: text(raw.createdAt, new Date().toISOString())
    };
    if (fee.mode === 'percent') fee.value = Math.min(100, positive(raw.value, 0)); else fee.amountCents = Math.max(0, Math.round(Number(raw.amountCents) || 0));
    return fee;
  }
  function normalizePayment(raw) {
    if (!raw || typeof raw !== 'object' || !safeKey(raw.personId)) return null;
    const legacy = raw.amountCents === undefined;
    const allocations = {};
    Object.entries(raw.allocations && typeof raw.allocations === 'object' ? raw.allocations : {}).forEach(([lineId, byPerson]) => {
      if (!safeKey(lineId) || !byPerson || typeof byPerson !== 'object') return;
      Object.entries(byPerson).forEach(([personId, value]) => {
        if (!safeKey(personId)) return;
        const cents = legacy ? legacyCents(value) : Math.round(Number(value) || 0);
        if (cents > 0) { allocations[lineId] = allocations[lineId] || {}; allocations[lineId][personId] = cents; }
      });
    });
    const amountCents = legacy ? legacyCents(raw.amount) : Math.round(Number(raw.amountCents) || 0);
    return { id: text(raw.id) || newId(), personId: raw.personId, amountCents, allocations, createdAt: text(raw.createdAt, new Date().toISOString()) };
  }
  function normalizeAccount(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const account = {
      id: text(raw.id) || newId(), name: text(raw.name, 'Divisão'), kind: text(raw.kind, 'Outra'), place: text(raw.place),
      createdAt: text(raw.createdAt, new Date().toISOString()), people: [], items: [], fees: [], memberPayments: []
    };
    (Array.isArray(raw.people) ? raw.people : []).forEach(entry => {
      if (!entry || !safeKey(entry.personId)) return;
      const clean = { personId: entry.personId, weight: coupleWeight(entry.weight) };
      if (entry.removed) { clean.removed = true; clean.removedAt = text(entry.removedAt); }
      if (entry.displayName) clean.displayName = text(entry.displayName);
      if (entry.avatar) clean.avatar = text(entry.avatar);
      account.people.push(clean);
    });
    account.items = (Array.isArray(raw.items) ? raw.items : []).map(item => normalizeItem(item, account)).filter(Boolean);
    account.fees = (Array.isArray(raw.fees) ? raw.fees : []).map(normalizeFee).filter(Boolean);
    account.memberPayments = (Array.isArray(raw.memberPayments) ? raw.memberPayments : []).map(normalizePayment).filter(Boolean);
    return account;
  }
  function normalizeState(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const state = { version: STATE_VERSION, people: [], accounts: [] };
    (Array.isArray(source.people) ? source.people : []).forEach(person => {
      if (!person || !safeKey(person.id) || typeof person.name !== 'string') return;
      state.people.push({ id: person.id, name: person.name, avatar: text(person.avatar, 'sorriso') || 'sorriso', weight: coupleWeight(person.weight), createdAt: text(person.createdAt, new Date().toISOString()) });
    });
    state.accounts = (Array.isArray(source.accounts) ? source.accounts : []).map(normalizeAccount).filter(Boolean);
    return state;
  }
  // Mescla um estado importado ao atual (por id), sem apagar nada do atual.
  function mergeStates(current, incoming) {
    const result = normalizeState(current);
    const incomingState = normalizeState(incoming);
    const peopleIds = new Set(result.people.map(person => person.id));
    const accountIds = new Set(result.accounts.map(account => account.id));
    let addedPeople = 0, addedAccounts = 0;
    incomingState.people.forEach(person => { if (!peopleIds.has(person.id)) { result.people.push(person); addedPeople++; } });
    incomingState.accounts.forEach(account => { if (!accountIds.has(account.id)) { result.accounts.push(account); addedAccounts++; } });
    return { state: result, addedPeople, addedAccounts };
  }

  return {
    STATE_VERSION, MODES, CATEGORIES,
    newId, hashString, parseCents, formatMoney, formatQuantity, lineAmount, distribute,
    activeMembers, allocateItem, allocateFee, buildLines, calc, suggestSettlements, settlements,
    outstandingFor, planPrepayment, registerPrepayment, removeLine, reconcilePrepayments, prepaidOnLine,
    coupleWeight, buildItem, buildFee, normalizeState, normalizeAccount, mergeStates
  };
});
