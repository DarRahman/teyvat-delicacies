import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COUPONS,
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
  getDeliveryFeeForPoint,
  getGliderProgressPercent,
  getGliderStageFromProgress,
  getRemainingVoucherUses,
  isLocalLiyueDelivery,
  validateCheckoutPayment,
  validateCouponApplication,
} from './delicaciesRules';

test('RARITY_META maps all 1-star through 5-star Triquetra watermark assets', () => {
  assert.equal(RARITY_META[1].bgAsset, '/assets/icons/bg_1star.webp');
  assert.equal(RARITY_META[2].bgAsset, '/assets/icons/bg_2star.webp');
  assert.equal(RARITY_META[3].bgAsset, '/assets/icons/bg_3star.webp');
  assert.equal(RARITY_META[4].bgAsset, '/assets/icons/bg_4star.webp');
  assert.equal(RARITY_META[5].bgAsset, '/assets/icons/bg_5star.webp');
});

test('High-fidelity dish asset and specific combat buff icon mappings', () => {
  const adeptus = DISHES.find((d) => d.id === 5101)!;
  assert.equal(adeptus.buffIcon, '/assets/icons/buff_atk_crit.png');

  const shrimpBalls = DISHES.find((d) => d.id === 3103)!;
  assert.equal(shrimpBalls.buffIcon, '/assets/icons/buff_recovery_revive.png');

  const appleCider = DISHES.find((d) => d.name === 'Apple Cider')!;
  assert.equal(appleCider.rarity, 3);
  assert.equal(appleCider.image, '/assets/dishes/apple_cider.png');
  assert.equal(appleCider.buffIcon, '/assets/icons/buff_recovery_hp_all.png');

  const blazedStew = DISHES.find((d) => d.name === 'Blazed Meat Stew')!;
  assert.equal(blazedStew.rarity, 4);
  assert.equal(blazedStew.region, 'Natlan');
  assert.equal(blazedStew.image, '/assets/dishes/magmic_ode.png');
  assert.equal(blazedStew.buffIcon, '/assets/icons/buff_atk_crit.png');

  const fonta = DISHES.find((d) => d.name === 'Fonta')!;
  assert.equal(fonta.buffIcon, '/assets/icons/buff_adventure.png');
});

test('Collectible Namecards catalog provides 8 official banners defaulting to Natlan', () => {
  assert.equal(NAMECARDS.length, 8);
  assert.equal(NAMECARDS[0].id, 'natlan_saurian');
  assert.equal(NAMECARDS[0].bgImage, '/assets/namecards/natlan_saurian_bg.png');
  assert.ok(
    NAMECARDS.every(
      (n) =>
        n.bgImage.startsWith('/assets/namecards/') &&
        n.iconImage.startsWith('/assets/namecards/')
    )
  );
});

test('Local Liyue 0-Mora delivery & dynamic 8-realm Teyvat delivery fees compute cleanly', () => {
  assert.equal(DELIVERY_POINTS.length, 8);
  const coveredRegions = new Set(DELIVERY_POINTS.map((p) => p.region));
  for (const region of TEYVAT_REGIONS) {
    assert.ok(coveredRegions.has(region), `Missing delivery hub for ${region}`);
  }

  const liyue = DELIVERY_POINTS.find((p) => p.region === 'Liyue')!;
  const mondstadt = DELIVERY_POINTS.find((p) => p.region === 'Mondstadt')!;
  const inazuma = DELIVERY_POINTS.find((p) => p.region === 'Inazuma')!;
  const snezhnaya = DELIVERY_POINTS.find((p) => p.region === 'Snezhnaya')!;

  assert.equal(isLocalLiyueDelivery(liyue), true);
  assert.equal(getDeliveryFeeForPoint(liyue), 0);
  assert.equal(liyue.etaMinutes, 6);

  assert.equal(isLocalLiyueDelivery(mondstadt), false);
  assert.equal(getDeliveryFeeForPoint(mondstadt), 400);
  assert.equal(getDeliveryFeeForPoint(inazuma), 800);
  assert.equal(getDeliveryFeeForPoint(snezhnaya), 1200);

  // Arc tests
  assert.equal(getGliderProgressPercent(0), 0);
  assert.equal(getGliderProgressPercent(1), 50);
  assert.equal(getGliderProgressPercent(2), 100);
  assert.equal(clampGliderProgress(-12), 0);
  assert.equal(clampGliderProgress(47.34), 47.3);
  assert.equal(clampGliderProgress(128), 100);
  assert.equal(getGliderStageFromProgress(5), 0);
  assert.equal(getGliderStageFromProgress(54), 1);
  assert.equal(getGliderStageFromProgress(100), 2);

  const arc = buildGliderFlightArcPath(WANMIN_ORIGIN_COORDS, snezhnaya.mapCoords);
  assert.ok(arc.startsWith('M 68.0 65.0 Q '));
  assert.ok(arc.endsWith('47.0 21.0'));

  const sameSpot = buildGliderFlightArcPath(WANMIN_ORIGIN_COORDS, WANMIN_ORIGIN_COORDS);
  assert.equal(sameSpot, '');
});

test('Strict voucher validation handles empty, unknown, min subtotal, quota exhausted, and Liyue conflict', () => {
  const liyue = DELIVERY_POINTS.find((p) => p.region === 'Liyue')!;
  const snezhnaya = DELIVERY_POINTS.find((p) => p.region === 'Snezhnaya')!;

  // 1. Empty code
  assert.equal(validateCouponApplication('   ', 15000, snezhnaya, {}).ok, false);

  // 2. Unknown code
  assert.equal(validateCouponApplication('TIDAKADA', 15000, snezhnaya, {}).ok, false);

  // 3. Minimum subtotal not met (PAIMONKENYANG requires 10,000 Mora)
  const lowSubtotal = validateCouponApplication('PAIMONKENYANG', 6000, snezhnaya, {});
  assert.equal(lowSubtotal.ok, false);
  assert.match(lowSubtotal.message, /10,000/);

  // 4. Quota exhausted (ADEPTUSFEAST has maxUses = 1)
  const exhausted = validateCouponApplication('ADEPTUSFEAST', 20000, snezhnaya, {
    ADEPTUSFEAST: 1,
  });
  assert.equal(exhausted.ok, false);
  assert.match(exhausted.message, /habis/i);

  const adeptusCoupon = COUPONS.find((c) => c.code === 'ADEPTUSFEAST')!;
  assert.equal(getRemainingVoucherUses(adeptusCoupon, { ADEPTUSFEAST: 1 }), 0);

  // 5. Free delivery voucher conflict when delivering locally inside Liyue (already 0 Mora)
  const liyueFreeConflict = validateCouponApplication('GLIDERFREE', 12000, liyue, {});
  assert.equal(liyueFreeConflict.ok, false);
  assert.match(liyueFreeConflict.message, /Liyue/i);

  // 6. Valid GLIDERFREE to Snezhnaya (saves 1,200 Mora!)
  const validGlider = validateCouponApplication('GLIDERFREE', 12000, snezhnaya, {});
  assert.equal(validGlider.ok, true);
});

test('calculateCartTotals computes local Liyue, dynamic regional fees, percent, fixed, and free-delivery coupons', () => {
  const adeptus = DISHES.find((d) => d.id === 5101)!; // 12,500 Mora
  const dango = DISHES.find((d) => d.id === 3108)!; // 4,800 Mora
  const liyue = DELIVERY_POINTS.find((p) => p.region === 'Liyue')!;
  const mondstadt = DELIVERY_POINTS.find((p) => p.region === 'Mondstadt')!;
  const snezhnaya = DELIVERY_POINTS.find((p) => p.region === 'Snezhnaya')!;

  const empty = calculateCartTotals([], null, mondstadt);
  assert.equal(empty.finalTotal, 0);
  assert.equal(empty.deliveryFee, 0);

  // Local Liyue: 0 Mora fee
  const localOrder = calculateCartTotals([{ dish: adeptus, quantity: 1 }], null, liyue);
  assert.equal(localOrder.isLocalLiyue, true);
  assert.equal(localOrder.deliveryFee, 0);
  assert.equal(localOrder.finalTotal, 12500);

  // Mondstadt dynamic fee: 400 Mora
  const mondstadtOrder = calculateCartTotals(
    [
      { dish: adeptus, quantity: 1 },
      { dish: dango, quantity: 2 },
    ],
    null,
    mondstadt
  );
  assert.equal(mondstadtOrder.subtotal, 22100);
  assert.equal(mondstadtOrder.deliveryFee, 400);
  assert.equal(mondstadtOrder.finalTotal, 22500);

  // PAIMONKENYANG (20% off subtotal >= 10,000) to Snezhnaya (1,200 fee)
  const percentDiscount = calculateCartTotals(
    [{ dish: adeptus, quantity: 2 }],
    'PAIMONKENYANG',
    snezhnaya
  );
  assert.equal(percentDiscount.subtotal, 25000);
  assert.equal(percentDiscount.discount, 5000);
  assert.equal(percentDiscount.deliveryFee, 1200);
  assert.equal(percentDiscount.finalTotal, 21200);

  // ADEPTUSFEAST (fixed 3,000 Mora off >= 15,000) to Mondstadt
  const fixedDiscount = calculateCartTotals(
    [{ dish: adeptus, quantity: 2 }],
    'ADEPTUSFEAST',
    mondstadt
  );
  assert.equal(fixedDiscount.discount, 3000);
  assert.equal(fixedDiscount.finalTotal, 22400);

  // GLIDERFREE to Snezhnaya waives 1,200 Mora delivery fee
  const freeDelivery = calculateCartTotals(
    [{ dish: adeptus, quantity: 1 }],
    'GLIDERFREE',
    snezhnaya
  );
  assert.equal(freeDelivery.deliveryFee, 0);
  assert.equal(freeDelivery.discount, 1200);
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
  assert.equal(validateCheckoutPayment([], 'MORA_COD', 100000, 0).ok, false);
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
