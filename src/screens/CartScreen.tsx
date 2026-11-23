import React, { useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { ASSET_ICONS, COUPONS, RARITY_META, formatMora } from '../data/dishes';
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

  const totals = getCartTotals();

  const handleApplyCoupon = (codeToTry?: string) => {
    const target = codeToTry ?? couponInput;
    const res = applyCoupon(target);
    if (res.ok) {
      setCouponInput(target.trim().toUpperCase());
      setCouponFeedback({ type: 'success', text: res.message });
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Clean Genshin Header */}
      <header className="px-4 pt-3.5 pb-3 teyvat-chrome-bar shrink-0 flex items-center justify-between gap-2">
        <div>
          <h1 className="font-genshin text-[17px] text-[#FFE7A5] tracking-wide">
            Keranjang Petualang
          </h1>
          <p className="text-[11px] text-[#C8D0E4] tabular-nums">
            {totals.itemCount > 0
              ? `${totals.itemCount} porsi siap dikirim kurir Glider`
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

            {/* Intertwined Fate Coupon Redemption Section */}
            <section
              aria-labelledby="coupon-heading"
              className="rounded-2xl teyvat-ivory-card p-3.5"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <TeyvatImage
                  src={ASSET_ICONS.intertwinedFate}
                  fallbackSrc={ASSET_ICONS.intertwinedFateCdn}
                  alt="Kupon Intertwined Fate"
                  className="w-6 h-6 object-contain shrink-0"
                />
                <div className="min-w-0">
                  <h2 id="coupon-heading" className="font-genshin text-[13px] text-[#242735]">
                    Tebus Kupon Intertwined Fate
                  </h2>
                  <p className="text-[11px] text-[#5B5F70]">
                    Gunakan kode promo untuk potongan Mora atau gratis ongkir
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
                  placeholder="Contoh: PAIMONKENYANG"
                  aria-label="Kode kupon promo"
                  className="teyvat-cream-input flex-1 h-[42px] px-3 rounded-xl border border-[#CBB997] text-[12px] font-semibold tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#C87C24]"
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
                  className={`mt-2 text-[11px] font-medium ${
                    couponFeedback.type === 'success' ? 'text-[#2D6E4E]' : 'text-[#A33B3B]'
                  }`}
                >
                  {couponFeedback.text}
                </p>
              )}

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {COUPONS.map((c) => {
                  const isApplied = appliedCouponCode === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors ${
                        isApplied
                          ? 'bg-[#242B3E] border-[#C8A86B] text-[#FFE7A5]'
                          : 'bg-[#ECE5D8] border-[#CBB997] text-[#3B4255] hover:border-[#9C5A14]'
                      }`}
                    >
                      <TeyvatImage
                        src={c.icon}
                        alt={c.code}
                        className="w-4 h-4 object-contain"
                      />
                      <span className="font-genshin">{c.code}</span>
                      <span className="opacity-80">
                        {c.type === 'PERCENT' ? `(-${c.value}%)` : '(Gratis Ongkir)'}
                      </span>
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
                  <span>Ongkir Kurir Glider</span>
                  <span className="font-genshin text-[#242735] tabular-nums">
                    {totals.deliveryFee === 0
                      ? 'Gratis'
                      : `${formatMora(totals.deliveryFee)} Mora`}
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex items-center justify-between text-[#2D6E4E]">
                    <span>Potongan Kupon ({appliedCouponCode})</span>
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
                Lanjut Pengantaran Glider
              </GoldCapsuleButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
