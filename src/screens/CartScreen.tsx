import React, { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { ASSET_ICONS, COUPONS, RARITY_META, formatMora } from '../data/dishes';
import { getRemainingVoucherUses } from '../lib/delicaciesRules';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondDivider,
  DiamondStarRow,
  GoldCapsuleButton,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

export const CartScreen: React.FC = () => {
  const cart = useDelicaciesStore((s) => s.cart);
  const appliedCouponCode = useDelicaciesStore((s) => s.appliedCouponCode);
  const voucherUsageCount = useDelicaciesStore((s) => s.voucherUsageCount);
  const selectedDeliveryPointId = useDelicaciesStore((s) => s.selectedDeliveryPointId);
  const getSelectedDeliveryPoint = useDelicaciesStore((s) => s.getSelectedDeliveryPoint);
  const updateQuantity = useDelicaciesStore((s) => s.updateQuantity);
  const removeFromCart = useDelicaciesStore((s) => s.removeFromCart);
  const applyCoupon = useDelicaciesStore((s) => s.applyCoupon);
  const removeCoupon = useDelicaciesStore((s) => s.removeCoupon);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  const pushStack = useDelicaciesStore((s) => s.pushStack);
  const setActiveTab = useDelicaciesStore((s) => s.setActiveTab);

  const [couponInput, setCouponInput] = useState(appliedCouponCode ?? '');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Sync text field if coupon is auto-detached due to quantity/region change
  useEffect(() => {
    if (!appliedCouponCode && couponFeedback?.type === 'success') {
      setCouponInput('');
      setCouponFeedback(null);
    }
  }, [appliedCouponCode, selectedDeliveryPointId]);

  const deliveryPoint = getSelectedDeliveryPoint();
  const totals = getCartTotals(deliveryPoint);

  const handleApplyCoupon = (codeToTry?: string) => {
    const target = codeToTry ?? couponInput;
    const res = applyCoupon(target);
    if (res.ok) {
      setCouponInput(target.trim().toUpperCase());
      setCouponFeedback({ type: 'success', text: res.message });
    } else {
      if (codeToTry) {
        setCouponInput(codeToTry);
      }
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const getCouponValueBadge = (coupon: (typeof COUPONS)[number]) => {
    if (coupon.type === 'PERCENT') return `-${coupon.value}%`;
    if (coupon.type === 'FIXED_MORA') return `-${formatMora(coupon.value)}`;
    return 'Gratis Ongkir';
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Clean Genshin Header */}
      <header className="px-4 pt-3.5 pb-3 teyvat-chrome-bar shrink-0 flex items-center justify-between gap-2">
        <div>
          <h1 className="font-genshin text-[17px] text-[#FFE7A5] tracking-wide">
            Keranjang Petualang
          </h1>
          <p className="font-genshin text-[10.5px] text-[#C8D0E4] tabular-nums">
            {totals.itemCount > 0
              ? `${totals.itemCount} porsi siap menuju ${deliveryPoint.region}`
              : 'Belum ada hidangan dipilih'}
          </p>
        </div>
        {totals.itemCount > 0 && (
          <div className="shrink-0">
            <MoraAmount amount={totals.finalTotal} size="sm" className="text-[#FFE7A5]" />
          </div>
        )}
      </header>

      {/* Edge-to-Edge Warm Parchment Scrollable Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-10">
        {cart.length === 0 ? (
          <div className="rounded-2xl teyvat-ivory-card p-6 text-center mt-4">
            <TeyvatImage
              src={ASSET_ICONS.paimonHungry}
              alt="Paimon sedang lapar"
              className="w-32 h-32 object-contain mx-auto mb-3 drop-shadow"
            />
            <h2 className="font-genshin text-[16px] text-[#242735]">
              Keranjang Masih Kosong
            </h2>
            <p className="text-[12px] text-[#565A6D] mt-1.5 leading-relaxed max-w-[260px] mx-auto">
              Perut Paimon sudah keroncongan! Jelajahi katalog kuliner Teyvat dan pilih hidangan favoritmu.
            </p>
            <div className="mt-5">
              <GoldCapsuleButton onClick={() => setActiveTab('katalog')}>
                Jelajahi Katalog Kuliner
              </GoldCapsuleButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Order List */}
            <section aria-label="Daftar Pesanan Aktif" className="space-y-2.5">
              {cart.map(({ dish, quantity }) => {
                const rarityStyle = RARITY_META[dish.rarity];
                return (
                  <div
                    key={dish.id}
                    className="rounded-2xl teyvat-ivory-card p-3 flex items-center gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => pushStack({ name: 'dish', dishId: dish.id })}
                      className="relative w-[64px] h-[64px] rounded-xl shrink-0 flex items-center justify-center p-1 overflow-hidden border border-[#FFE7A5]/70"
                      style={{ background: rarityStyle.gradient }}
                      aria-label={`Lihat ${dish.name}`}
                    >
                      <img
                        src={rarityStyle.bgAsset}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{ opacity: 0.35, mixBlendMode: 'overlay' }}
                      />
                      <div
                        className="relative z-10 w-13 h-13 flex items-center justify-center rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle at center, rgba(255, 231, 165, 0.42) 0%, transparent 68%)',
                        }}
                      >
                        <TeyvatImage
                          src={dish.image}
                          fallbackSrc={dish.fallbackImage}
                          alt={dish.name}
                          className="w-12 h-12 object-contain drop-shadow"
                        />
                      </div>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-genshin text-[13px] text-[#242735] truncate">
                            {dish.name}
                          </h3>
                          <DiamondStarRow rarity={dish.rarity} size={9} className="mt-0.5" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(dish.id)}
                          aria-label={`Hapus ${dish.name} dari keranjang`}
                          className="w-8 h-8 -mr-1 -mt-1 rounded-lg flex items-center justify-center text-[#7A6F85] hover:text-[#A33B3B] hover:bg-[#A33B3B]/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <MoraAmount
                          amount={dish.priceMora * quantity}
                          size="sm"
                          className="text-[#242735]"
                        />

                        {/* Quantity Steppers (- / +) */}
                        <div className="inline-flex items-center gap-1 bg-[#ECE5D8] border border-[#CBB997] rounded-full p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(dish.id, quantity - 1)}
                            aria-label={`Kurangi porsi ${dish.name}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#3B4255] hover:bg-[#DDD3BF] transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-genshin min-w-[24px] text-center text-[13px] font-bold text-[#242735] tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(dish.id, quantity + 1)}
                            aria-label={`Tambah porsi ${dish.name}`}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#3B4255] hover:bg-[#DDD3BF] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Strict Voucher Redemption Section */}
            <section
              aria-labelledby="coupon-heading"
              className="rounded-2xl teyvat-ivory-card p-3.5"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <TeyvatImage
                  src={ASSET_ICONS.intertwinedFate}
                  fallbackSrc={ASSET_ICONS.intertwinedFateCdn}
                  alt="Voucher Teyvat"
                  className="w-6 h-6 object-contain shrink-0"
                />
                <div className="min-w-0">
                  <h2 id="coupon-heading" className="font-genshin text-[13px] text-[#242735]">
                    Tebus Voucher Teyvat
                  </h2>
                  <p className="text-[11px] text-[#5B5F70]">
                    Validasi otomatis syarat minimal belanja &amp; sisa kuota pakai
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponFeedback(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !appliedCouponCode) {
                      handleApplyCoupon();
                    }
                  }}
                  placeholder="Contoh: PAIMONKENYANG"
                  aria-label="Kode voucher promo"
                  className="teyvat-cream-input flex-1 min-w-0 h-[42px] px-3 rounded-xl border border-[#CBB997] text-[12px] font-genshin tracking-wider uppercase placeholder:font-sans placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#C87C24]"
                />
                {appliedCouponCode ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setCouponInput('');
                      setCouponFeedback(null);
                    }}
                    className="min-h-[42px] px-3.5 rounded-xl bg-[#242B3E] text-[#FAF8F2] font-genshin text-[12px] inline-flex items-center gap-1 hover:bg-[#192032]"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Lepas</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="teyvat-gold-btn min-h-[42px] px-4 rounded-xl font-genshin text-[12px] font-bold shrink-0"
                  >
                    Terapkan
                  </button>
                )}
              </div>

              {couponFeedback && (
                <p
                  role="alert"
                  className={`mt-2 text-[11px] font-semibold leading-snug ${
                    couponFeedback.type === 'success' ? 'text-[#2D6E4E]' : 'text-[#A33B3B]'
                  }`}
                >
                  {couponFeedback.text}
                </p>
              )}

              {/* Quick Voucher Cards with Live Remaining Quota & Min Spend */}
              <div className="mt-3 space-y-1.5">
                {COUPONS.map((c) => {
                  const isApplied = appliedCouponCode === c.code;
                  const remaining = getRemainingVoucherUses(c, voucherUsageCount);
                  const isExhausted = remaining <= 0;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className={`w-full rounded-xl px-2.5 py-2 border text-left flex items-center gap-2.5 transition-colors ${
                        isApplied
                          ? 'bg-[#242B3E] border-[#C8A86B] text-[#FFF8E7]'
                          : isExhausted
                          ? 'bg-[#ECE5D8]/55 border-[#D8CEBC] text-[#8E877A] opacity-75'
                          : 'bg-[#ECE5D8] border-[#CBB997] text-[#2C3040] hover:border-[#9C5A14]'
                      }`}
                    >
                      <TeyvatImage
                        src={c.icon}
                        alt={c.code}
                        className="w-6 h-6 object-contain shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-genshin text-[11.5px] truncate ${
                              isApplied ? 'text-[#FFE7A5]' : 'text-[#242735]'
                            }`}
                          >
                            {c.code}
                          </span>
                          <span
                            className={`font-genshin text-[10.5px] shrink-0 tabular-nums ${
                              isApplied
                                ? 'text-[#FFE7A5]'
                                : isExhausted
                                ? 'text-[#A33B3B]'
                                : 'text-[#9C5A14]'
                            }`}
                          >
                            {getCouponValueBadge(c)}
                          </span>
                        </div>
                        <div
                          className={`text-[10px] mt-0.5 flex items-center justify-between gap-2 tabular-nums ${
                            isApplied ? 'text-[#D6DCEB]' : 'text-[#5E6375]'
                          }`}
                        >
                          <span className="truncate">
                            Min. {formatMora(c.minSubtotalMora)} Mora
                          </span>
                          <span className="font-genshin shrink-0">
                            {isExhausted ? 'Habis' : `Sisa ${remaining}×`}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Billing Summary Card */}
            <section
              aria-labelledby="billing-summary-heading"
              className="rounded-2xl teyvat-ivory-card p-4 space-y-2.5"
            >
              <h2
                id="billing-summary-heading"
                className="font-genshin text-[14px] text-[#242735]"
              >
                Rincian Tagihan Mora
              </h2>

              <div className="space-y-1.5 text-[12px] text-[#4A4F63]">
                <div className="flex items-center justify-between">
                  <span>Subtotal Hidangan ({totals.itemCount} porsi)</span>
                  <span className="font-genshin text-[#242735] tabular-nums">
                    {formatMora(totals.subtotal)} Mora
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {totals.isLocalLiyue
                      ? 'Kurir Lokal (Liyue)'
                      : `Kurir Glider (${deliveryPoint.region})`}
                  </span>
                  <span
                    className={`font-genshin tabular-nums ${
                      totals.deliveryFee === 0 ? 'text-[#2D6E4E]' : 'text-[#242735]'
                    }`}
                  >
                    {totals.deliveryFee === 0
                      ? totals.isLocalLiyue
                        ? 'Gratis · Lokal'
                        : 'Gratis (Voucher)'
                      : `${formatMora(totals.deliveryFee)} Mora`}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex items-center justify-between text-[#2D6E4E]">
                    <span>Potongan Voucher ({appliedCouponCode})</span>
                    <span className="font-genshin font-bold tabular-nums">
                      -{formatMora(totals.discount)} Mora
                    </span>
                  </div>
                )}
              </div>

              <DiamondDivider className="my-1" />

              <div className="flex items-center justify-between">
                <span className="font-genshin text-[14px] text-[#242735]">Total Akhir</span>
                <MoraAmount
                  amount={totals.finalTotal}
                  size="md"
                  showSuffix
                  className="text-[#242735]"
                />
              </div>
            </section>

            <div className="pt-1 pb-2">
              <GoldCapsuleButton onClick={() => pushStack({ name: 'checkout' })}>
                Lanjut Pengantaran Teyvat
              </GoldCapsuleButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
