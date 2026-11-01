'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/core.js');

const people = (...names) => names.map(personId => ({ personId, weight: 1 }));
const mkItem = (account, input) => {
  const { item, error } = C.buildItem({ quantity: 1, mode: 'manual', ...input }, account);
  assert.equal(error, undefined, error);
  account.items.push(item);
  return item;
};
const emptyAccount = (...names) => ({ id: 'acc', people: people(...names), items: [], fees: [], memberPayments: [] });

test('parseCents lida com vírgula, ponto e entradas inválidas', () => {
  assert.equal(C.parseCents('12,50'), 1250);
  assert.equal(C.parseCents('1.005'), 101);
  assert.equal(C.parseCents('0.1'), 10);
  assert.ok(Number.isNaN(C.parseCents('abc')));
  assert.ok(Number.isNaN(C.parseCents('')));
});

test('distribute soma exatamente o total e gira o centavo excedente', () => {
  const parts = C.distribute(10000, [['a', 1], ['b', 1], ['c', 1]], 0);
  assert.equal(parts.a + parts.b + parts.c, 10000);
  const seeds = new Set();
  for (let seed = 0; seed < 3; seed++) {
    const r = C.distribute(10000, [['a', 1], ['b', 1], ['c', 1]], seed);
    seeds.add(Object.entries(r).find(([, v]) => v === 3334)[0]);
  }
  assert.equal(seeds.size, 3, 'o centavo extra deve passar por pessoas diferentes');
});

test('rateio por pesos e por quantidade', () => {
  const acc = emptyAccount('a', 'b');
  acc.people[1].weight = 3;
  const weighted = mkItem(acc, { name: 'Pizza', unitPriceCents: 10000, mode: 'weighted', consumers: ['a', 'b'] });
  assert.deepEqual(C.allocateItem(acc, weighted), { a: 2500, b: 7500 });
  const byQty = mkItem(acc, { name: 'Cerveja', quantity: 4, unitPriceCents: 1000, mode: 'quantity', consumption: { a: 1, b: 3 } });
  assert.deepEqual(C.allocateItem(acc, byQty), { a: 1000, b: 3000 });
});

test('histórico: mudar a cota depois não altera itens já lançados', () => {
  const acc = emptyAccount('a', 'b');
  const item = mkItem(acc, { name: 'Pizza', unitPriceCents: 10000, mode: 'weighted', consumers: ['a', 'b'] });
  acc.people[1].weight = 3;
  assert.deepEqual(C.allocateItem(acc, item), { a: 5000, b: 5000 });
  const novo = mkItem(acc, { name: 'Sobremesa', unitPriceCents: 10000, mode: 'weighted', consumers: ['a', 'b'] });
  assert.deepEqual(C.allocateItem(acc, novo), { a: 2500, b: 7500 });
});

test('validações de item', () => {
  const acc = emptyAccount('a', 'b');
  assert.ok(C.buildItem({ name: '', quantity: 1, unitPriceCents: 100, mode: 'manual' }, acc).error);
  assert.ok(C.buildItem({ name: 'x', quantity: 2, unitPriceCents: 100, mode: 'quantity', consumption: { a: 1 } }, acc).error);
  assert.ok(C.buildItem({ name: 'x', quantity: 1, unitPriceCents: 100, mode: 'selected', consumers: [] }, acc).error);
  assert.ok(C.buildItem({ name: 'x', quantity: 1, unitPriceCents: 100, mode: 'manual' }, { people: [], items: [] }).error);
  assert.equal(C.buildItem({ name: 'x', quantity: 2.5, unitPriceCents: 100, mode: 'quantity', consumption: { a: 1.5, b: 1 } }, acc).error, undefined);
});

test('taxa de serviço em porcentagem incide só sobre itens e acompanha o consumo', () => {
  const acc = emptyAccount('a', 'b');
  mkItem(acc, { name: 'Prato A', unitPriceCents: 6000, mode: 'selected', consumers: ['a'] });
  mkItem(acc, { name: 'Prato B', unitPriceCents: 4000, mode: 'selected', consumers: ['b'] });
  const { fee } = C.buildFee({ title: 'Serviço', kind: 'fee', mode: 'percent', value: 10, participants: ['a', 'b'] }, acc);
  acc.fees.push(fee);
  const { fee: couvert } = C.buildFee({ title: 'Couvert', kind: 'fee', mode: 'fixed', amountCents: 2000, participants: ['a', 'b'] }, acc);
  acc.fees.push(couvert);
  const r = C.calc(acc);
  assert.equal(r.itemsTotal, 10000);
  assert.equal(r.feesTotal, 1000 + 2000);
  assert.equal(r.total, 13000);
  assert.deepEqual(r.shareTotals, { a: 6000 + 600 + 1000, b: 4000 + 400 + 1000 });
});

test('desconto em porcentagem e em valor fixo', () => {
  const acc = emptyAccount('a', 'b');
  mkItem(acc, { name: 'Prato', unitPriceCents: 10000, mode: 'manual' });
  acc.fees.push(C.buildFee({ title: 'Promo', kind: 'discount', mode: 'percent', value: 20, participants: ['a', 'b'] }, acc).fee);
  acc.fees.push(C.buildFee({ title: 'Cortesia', kind: 'discount', mode: 'fixed', amountCents: 501, participants: ['a', 'b'] }, acc).fee);
  const r = C.calc(acc);
  assert.equal(r.total, 10000 - 2000 - 501);
  assert.equal(r.shareTotals.a + r.shareTotals.b, r.total);
});

test('validações de taxa', () => {
  const acc = emptyAccount('a');
  assert.ok(C.buildFee({ title: '', mode: 'percent', value: 10, participants: ['a'] }, acc).error);
  assert.ok(C.buildFee({ title: 'x', mode: 'percent', value: 0, participants: ['a'] }, acc).error);
  assert.ok(C.buildFee({ title: 'x', mode: 'percent', value: 101, participants: ['a'] }, acc).error);
  assert.ok(C.buildFee({ title: 'x', mode: 'fixed', amountCents: 0, participants: ['a'] }, acc).error);
  assert.ok(C.buildFee({ title: 'x', mode: 'fixed', amountCents: 10, participants: [] }, acc).error);
});

test('item pago por um participante gera créditos e acertos exatos', () => {
  const acc = emptyAccount('a', 'b', 'c');
  mkItem(acc, { name: 'Jantar', unitPriceCents: 10000, mode: 'manual', payerId: 'a' });
  const r = C.calc(acc);
  assert.equal(Object.values(r.balances).reduce((s, v) => s + v, 0), 0);
  const transfers = C.settlements(acc);
  assert.equal(transfers.length, 2);
  assert.ok(transfers.every(t => t.to === 'a'));
  const payerShare = C.allocateItem(acc, acc.items[0]).a;
  assert.equal(transfers.reduce((s, t) => s + t.amount, 0), 10000 - payerShare);
});

test('taxa paga pelo mesmo participante entra no acerto', () => {
  const acc = emptyAccount('a', 'b');
  mkItem(acc, { name: 'Prato', unitPriceCents: 10000, mode: 'manual', payerId: 'a' });
  acc.fees.push(C.buildFee({ title: 'Serviço', kind: 'fee', mode: 'percent', value: 10, participants: ['a', 'b'], payerId: 'a' }, acc).fee);
  assert.deepEqual(C.settlements(acc), [{ from: 'b', to: 'a', amount: 5500 }]);
});

test('pagamento antecipado abate itens e taxas pendentes e pode retirar a pessoa', () => {
  const acc = emptyAccount('a', 'b');
  mkItem(acc, { name: 'Prato', unitPriceCents: 10000, mode: 'manual' });
  acc.fees.push(C.buildFee({ title: 'Serviço', kind: 'fee', mode: 'percent', value: 10, participants: ['a', 'b'] }, acc).fee);
  assert.equal(C.outstandingFor(acc, 'a'), 5500);
  assert.equal(C.registerPrepayment(acc, 'a', 6000).ok, false);
  assert.equal(C.registerPrepayment(acc, 'a', 5500, { leave: true, displayName: 'Ana' }).ok, true);
  assert.equal(C.outstandingFor(acc, 'a'), 0);
  assert.equal(acc.people[0].removed, true);
  // Item novo só divide entre quem ficou.
  const novo = mkItem(acc, { name: 'Café', unitPriceCents: 1000, mode: 'manual' });
  assert.deepEqual(C.allocateItem(acc, novo), { b: 1000 });
  assert.equal(C.outstandingFor(acc, 'a'), 0);
});

test('apagar item remove só o abatimento dele e informa o valor perdido', () => {
  const acc = emptyAccount('a', 'b');
  const i1 = mkItem(acc, { name: 'Prato 1', unitPriceCents: 4000, mode: 'manual' });
  mkItem(acc, { name: 'Prato 2', unitPriceCents: 6000, mode: 'manual' });
  C.registerPrepayment(acc, 'a', 5000);
  const lost = C.removeLine(acc, i1.id);
  assert.equal(lost, 2000);
  assert.equal(acc.memberPayments[0].amountCents, 3000);
  assert.equal(C.outstandingFor(acc, 'a'), 0);
});

test('reconcile corta abatimentos que passaram a exceder a parte da pessoa', () => {
  const acc = emptyAccount('a', 'b');
  const item = mkItem(acc, { name: 'Prato', unitPriceCents: 10000, mode: 'manual' });
  C.registerPrepayment(acc, 'a', 5000);
  const { item: menor } = C.buildItem({ ...item, unitPriceCents: 4000, mode: 'manual' }, acc, item);
  acc.items[0] = menor;
  const cut = C.reconcilePrepayments(acc);
  assert.equal(cut, 3000);
  assert.equal(acc.memberPayments[0].amountCents, 2000);
  assert.equal(C.outstandingFor(acc, 'a'), 0);
});

test('migração v1 (reais) para v2 (centavos) preserva valores e histórico', () => {
  const v1 = {
    people: [{ id: 'p1', name: 'Ana', weight: 1, avatar: '😀' }, { id: 'p2', name: 'Bia', weight: 2 }],
    accounts: [{
      id: 'acc1', name: 'Bar', kind: 'Restaurante', place: '', createdAt: '2026-10-01T00:00:00Z', fees: [],
      people: [{ personId: 'p1', weight: 1 }, { personId: 'p2', weight: 2 }],
      items: [
        { id: 'i1', name: 'Cerveja', quantity: 3, unitPrice: 18.45, amount: 55.35, payerId: null, mode: 'weighted', consumers: ['p1', 'p2'], consumption: {} },
        { id: 'i2', name: 'Porção', quantity: 1, unitPrice: 40, amount: 40, payerId: 'p1', mode: 'manual', consumers: [], consumption: {} }
      ],
      memberPayments: [{ id: 'm1', personId: 'p2', amount: 10.1, allocations: { i1: { p2: 10.1 } }, createdAt: '2026-10-01T01:00:00Z' }]
    }]
  };
  const state = C.normalizeState(v1);
  assert.equal(state.version, 2);
  const acc = state.accounts[0];
  assert.equal(acc.items[0].amountCents, 5535);
  assert.equal(acc.items[0].unitPriceCents, 1845);
  assert.deepEqual(acc.items[0].weights, { p1: 1, p2: 2 });
  assert.deepEqual(acc.items[1].consumers, ['p1', 'p2']);
  assert.equal(acc.memberPayments[0].amountCents, 1010);
  assert.equal(acc.memberPayments[0].allocations.i1.p2, 1010);
  assert.equal(C.calc(acc).total, 5535 + 4000);
  // Idempotente: normalizar de novo não muda nada.
  assert.deepEqual(C.normalizeState(state), state);
});

test('cotas antigas viram pessoa (1) ou casal (2) na migração, sem mexer no histórico dos itens', () => {
  const s = C.normalizeState({
    people: [{ id: 'a', name: 'A', weight: 0.5 }, { id: 'b', name: 'B', weight: 1 }, { id: 'c', name: 'C', weight: 2 }, { id: 'd', name: 'D', weight: 3 }],
    accounts: [{ id: 'x', name: 'X', people: [{ personId: 'a', weight: 0.5 }, { personId: 'c', weight: 2 }],
      items: [{ id: 'i', name: 'Pizza', quantity: 1, unitPriceCents: 1000, amountCents: 1000, mode: 'weighted', consumers: ['a', 'c'], weights: { a: 0.5, c: 2 } }] }]
  });
  assert.deepEqual(s.people.map(p => p.weight), [1, 1, 2, 2]);
  assert.deepEqual(s.accounts[0].people.map(p => p.weight), [1, 2]);
  assert.deepEqual(s.accounts[0].items[0].weights, { a: 0.5, c: 2 });
  assert.equal(C.allocateItem(s.accounts[0], s.accounts[0].items[0]).a, 200);
});

test('normalizeState descarta lixo sem lançar erro', () => {
  assert.deepEqual(C.normalizeState(null), { version: 2, people: [], accounts: [] });
  assert.deepEqual(C.normalizeState('x'), { version: 2, people: [], accounts: [] });
  const s = C.normalizeState({ people: [null, { id: 1 }, { id: 'ok', name: 'Z' }], accounts: [null, 5, { name: 'X', items: [null, { amountCents: 'abc' }] }] });
  assert.equal(s.people.length, 1);
  assert.equal(s.accounts.length, 1);
  assert.equal(s.accounts[0].items[0].amountCents, 0);
});

test('mesclar backups não duplica e não apaga', () => {
  const a = C.normalizeState({ people: [{ id: 'p1', name: 'Ana' }], accounts: [{ id: 'x', name: 'A' }] });
  const b = C.normalizeState({ people: [{ id: 'p1', name: 'Outro nome' }, { id: 'p2', name: 'Bia' }], accounts: [{ id: 'x', name: 'A2' }, { id: 'y', name: 'B' }] });
  const m = C.mergeStates(a, b);
  assert.equal(m.addedPeople, 1);
  assert.equal(m.addedAccounts, 1);
  assert.equal(m.state.people.find(p => p.id === 'p1').name, 'Ana');
});

test('fuzz: partes somam o item, saldos zeram e acertos quitam tudo', () => {
  let seed = 123456789;
  const rand = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  for (let n = 0; n < 3000; n++) {
    const count = 2 + Math.floor(rand() * 6);
    const acc = emptyAccount(...[...Array(count)].map((_, i) => 'p' + i));
    acc.people.forEach(p => { p.weight = [0.5, 1, 1, 2, 1.5][Math.floor(rand() * 5)]; });
    const ids = acc.people.map(p => p.personId);
    const itemCount = 1 + Math.floor(rand() * 8);
    for (let k = 0; k < itemCount; k++) {
      const mode = C.MODES[Math.floor(rand() * 4)];
      const quantity = rand() < 0.3 ? Math.round(rand() * 500) / 100 + 0.01 : 1 + Math.floor(rand() * 6);
      const input = { name: 'i' + k, quantity, unitPriceCents: 1 + Math.floor(rand() * 8000), mode, payerId: rand() < 0.5 ? ids[Math.floor(rand() * count)] : null };
      if (mode === 'quantity') {
        let left = Math.round(quantity * 100);
        const chosen = ids.filter(() => rand() < 0.6);
        if (!chosen.length) chosen.push(ids[0]);
        input.consumption = {};
        chosen.forEach((id, idx) => { const part = idx === chosen.length - 1 ? left : Math.floor(rand() * left); input.consumption[id] = part / 100; left -= part; });
      } else if (mode !== 'manual') {
        input.consumers = ids.filter(() => rand() < 0.6);
        if (!input.consumers.length) input.consumers = [ids[0]];
      }
      const { item, error } = C.buildItem(input, acc);
      if (error) continue;
      acc.items.push(item);
      const shares = C.allocateItem(acc, item);
      assert.equal(Object.values(shares).reduce((s, v) => s + v, 0), item.amountCents, 'item ' + JSON.stringify(item));
    }
    if (rand() < 0.5) acc.fees.push(C.buildFee({ title: 'Serviço', kind: 'fee', mode: 'percent', value: 10, participants: ids, payerId: rand() < 0.3 ? ids[0] : null }, acc).fee);
    if (rand() < 0.3) acc.fees.push(C.buildFee({ title: 'Couvert', kind: 'fee', mode: 'fixed', amountCents: 1 + Math.floor(rand() * 5000), participants: ids.filter((_, i) => i % 2 === 0) }, acc).fee);
    const r = C.calc(acc);
    assert.equal(Object.values(r.balances).reduce((s, v) => s + v, 0), 0);
    assert.equal(r.paidTotal + r.unpaidTotal, Object.values(r.shareTotals).reduce((s, v) => s + v, 0));
    const balances = { ...r.balances };
    C.suggestSettlements(r.balances).forEach(t => { balances[t.from] -= t.amount; balances[t.to] += t.amount; });
    assert.ok(Object.values(balances).every(v => v === 0));
    assert.ok(Number.isInteger(r.total));
  }
});
