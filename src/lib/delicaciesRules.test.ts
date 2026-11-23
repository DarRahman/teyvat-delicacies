import test from 'node:test';
import assert from 'node:assert/strict';
import { DISHES, RARITY_META } from '../data/dishes';
import {
  calculateCartTotals,
  filterDishes,
  validateCheckoutPayment,
} from './delicaciesRules';

test('RARITY_META maps all 1-star through 5-star Triquetra watermark assets', () => {
  assert.equal(RARITY_META[1].bgAsset, '/assets/icons/bg_1star.webp');
  assert.equal(RARITY_META[2].bgAsset, '/assets/icons/bg_2star.webp');
  assert.equal(RARITY_META[3].bgAsset, '/assets/icons/bg_3star.webp');
  assert.equal(RARITY_META[4].bgAsset, '/assets/icons/bg_4star.webp');
  assert.equal(RARITY_META[5].bgAsset, '/assets/icons/bg_5star.webp');
});

test('calculateCartTotals computes subtotal, delivery fee, and coupons accurately', () => {
  const adeptus = DISHES.find((d) => d.id === 5101)!; // 12,500 Mora
  const dango = DISHES.find((d) => d.id === 3108)!; // 4,800 Mora

  const empty = calculateCartTotals([], null);
  assert.equal(empty.finalTotal, 0);
  assert.equal(empty.deliveryFee, 0);

  const regular = calculateCartTotals(
    [
      { dish: adeptus, quantity: 1 },
      { dish: dango, quantity: 2 },
    ],
    null
  );
  assert.equal(regular.itemCount, 3);
  assert.equal(regular.subtotal, 22100);
  assert.equal(regular.deliveryFee, 500);
  assert.equal(regular.discount, 0);
  assert.equal(regular.finalTotal, 22600);

  const percentDiscount = calculateCartTotals(
    [{ dish: adeptus, quantity: 2 }],
    'PAIMONKENYANG'
  );
  assert.equal(percentDiscount.subtotal, 25000);
  assert.equal(percentDiscount.discount, 5000);
  assert.equal(percentDiscount.deliveryFee, 500);
  assert.equal(percentDiscount.finalTotal, 20500);

  const freeDelivery = calculateCartTotals(
    [{ dish: adeptus, quantity: 1 }],
    'FRAGILERESIN'
  );
  assert.equal(freeDelivery.deliveryFee, 0);
  assert.equal(freeDelivery.discount, 500);
  assert.equal(freeDelivery.finalTotal, 12500);
});

test('filterDishes filters by query, category, combat buffs, region, and rarity', () => {
  const byQuery = filterDishes(DISHES, { query: 'adeptus' });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].name, "Adeptus' Temptation");

  const beverages = filterDishes(DISHES, { category: 'Beverages' });
  assert.ok(beverages.length >= 4);
  assert.ok(beverages.every((d) => d.category === 'Beverages'));

  const liyueAtk = filterDishes(DISHES, {
    regions: ['Liyue'],
    buffs: ['ATK'],
  });
  assert.ok(liyueAtk.length >= 3);
  assert.ok(liyueAtk.every((d) => d.region === 'Liyue' && d.buffType === 'ATK'));

  const fiveStar = filterDishes(DISHES, { rarity: 5 });
  assert.equal(fiveStar.length, 1);
  assert.equal(fiveStar[0].rarity, 5);
});

test('validateCheckoutPayment enforces non-empty cart and Northland Bank balance', () => {
  const adeptus = DISHES[0];
  assert.equal(
    validateCheckoutPayment([], 'MORA_COD', 100000, 0).ok,
    false
  );
  assert.equal(
    validateCheckoutPayment(
      [{ dish: adeptus, quantity: 1 }],
      'NORTHLAND_BANK_CARD',
      1000,
      13000
    ).ok,
    false
  );
  assert.equal(
    validateCheckoutPayment(
      [{ dish: adeptus, quantity: 1 }],
      'MORA_COD',
      1000,
      13000
    ).ok,
    true
  );
  assert.equal(
    validateCheckoutPayment(
      [{ dish: adeptus, quantity: 1 }],
      'NORTHLAND_BANK_CARD',
      50000,
      13000
    ).ok,
    true
  );
});
