import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DELIVERY_POINTS,
  DISHES,
  NAMECARDS,
  RARITY_META,
  TEYVAT_REGIONS,
  WANMIN_ORIGIN_COORDS,
} from '../data/dishes';
import {
  buildGliderFlightArcPath,
  calculateCartTotals,
  clampGliderProgress,
  filterDishes,
  getGliderProgressPercent,
  getGliderStageFromProgress,
  validateCheckoutPayment,
} from './delicaciesRules';

test('RARITY_META maps all 1-star through 5-star Triquetra watermark assets', () => {
  assert.equal(RARITY_META[1].bgAsset, '/assets/icons/bg_1star.webp');
  assert.equal(RARITY_META[2].bgAsset, '/assets/icons/bg_2star.webp');
  assert.equal(RARITY_META[3].bgAsset, '/assets/icons/bg_3star.webp');
  assert.equal(RARITY_META[4].bgAsset, '/assets/icons/bg_4star.webp');
  assert.equal(RARITY_META[5].bgAsset, '/assets/icons/bg_5star.webp');
});

test('High-fidelity dish asset mappings for Apple Cider and Blazed Meat Stew', () => {
  const appleCider = DISHES.find((d) => d.name === 'Apple Cider');
  assert.ok(appleCider, 'Apple Cider must exist in DISHES');
  assert.equal(appleCider.rarity, 3);
  assert.equal(appleCider.image, '/assets/dishes/apple_cider.png');

  const blazedStew = DISHES.find((d) => d.name === 'Blazed Meat Stew');
  assert.ok(blazedStew, 'Blazed Meat Stew must exist in DISHES');
  assert.equal(blazedStew.rarity, 4);
  assert.equal(blazedStew.region, 'Natlan');
  assert.equal(blazedStew.image, '/assets/dishes/magmic_ode.png');
});

test('Collectible Namecards catalog provides 8 official banners defaulting to Natlan', () => {
  assert.equal(NAMECARDS.length, 8);
  assert.equal(NAMECARDS[0].id, 'natlan_saurian');
  assert.equal(NAMECARDS[0].bgImage, '/assets/namecards/natlan_saurian_bg.png');
  assert.ok(NAMECARDS.every((n) => n.bgImage.startsWith('/assets/namecards/') && n.iconImage.startsWith('/assets/namecards/')));
});

test('Glider courier continuous trajectory and 8-realm Teyvat delivery map compute cleanly', () => {
  assert.equal(getGliderProgressPercent(0), 0);
  assert.equal(getGliderProgressPercent(1), 50);
  assert.equal(getGliderProgressPercent(2), 100);

  assert.equal(clampGliderProgress(-12), 0);
  assert.equal(clampGliderProgress(47.34), 47.3);
  assert.equal(clampGliderProgress(128), 100);
  assert.equal(getGliderStageFromProgress(5), 0);
  assert.equal(getGliderStageFromProgress(54), 1);
  assert.equal(getGliderStageFromProgress(100), 2);

  assert.equal(DELIVERY_POINTS.length, 8);
  const coveredRegions = new Set(DELIVERY_POINTS.map((p) => p.region));
  for (const region of TEYVAT_REGIONS) {
    assert.ok(coveredRegions.has(region), `Missing delivery hub for ${region}`);
  }
  for (const pt of DELIVERY_POINTS) {
    assert.ok(pt.mapCoords.x > 0 && pt.mapCoords.x < 100);
    assert.ok(pt.mapCoords.y > 0 && pt.mapCoords.y < 100);
  }

  const snezhnaya = DELIVERY_POINTS.find((p) => p.id === 'zapolyarny-palace')!;
  const arc = buildGliderFlightArcPath(WANMIN_ORIGIN_COORDS, snezhnaya.mapCoords);
  assert.ok(arc.startsWith('M 75.0 45.0 Q '));
  assert.ok(arc.endsWith('52.0 85.0'));

  const nodKrai = DELIVERY_POINTS.find((p) => p.id === 'nasha-outpost')!;
  const arcNod = buildGliderFlightArcPath(WANMIN_ORIGIN_COORDS, nodKrai.mapCoords);
  assert.ok(arcNod.startsWith('M 75.0 45.0 Q '));
  assert.ok(arcNod.endsWith('24.0 74.0'));

  const sameSpot = buildGliderFlightArcPath(WANMIN_ORIGIN_COORDS, WANMIN_ORIGIN_COORDS);
  assert.equal(sameSpot, '');
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
