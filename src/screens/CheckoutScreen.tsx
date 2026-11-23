import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, MapPin, Wallet } from 'lucide-react';
import { DELIVERY_POINTS, formatMora } from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { PaymentMethod } from '../types';
import {
  DiamondDivider,
  GoldCapsuleButton,
  MoraAmount,
} from '../components/TeyvatUI';

export const CheckoutScreen: React.FC = () => {
  const popStack = useDelicaciesStore((s) => s.popStack);
  const cart = useDelicaciesStore((s) => s.cart);
  const profile = useDelicaciesStore((s) => s.profile);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  const placeOrder = useDelicaciesStore((s) => s.placeOrder);

  const [selectedPointId, setSelectedPointId] = useState(DELIVERY_POINTS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NORTHLAND_BANK_CARD');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totals = getCartTotals();
  const selectedPoint =
    DELIVERY_POINTS.find((p) => p.id === selectedPointId) ?? DELIVERY_POINTS[0];

  const insufficientMora =
    paymentMethod === 'NORTHLAND_BANK_CARD' && profile.moraBalance < totals.finalTotal;

  const handleConfirmOrder = () => {
    setErrorMessage(null);
    const result = placeOrder({
      deliveryPoint: selectedPoint,
      paymentMethod,
      kitchenNotes,
    });
    if (!result.ok && result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#171421] animate-stack-enter">
      {/* Compact Night-Sky Top Bar */}
      <header className="px-4 py-3 bg-[#171421] flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={popStack}
          aria-label="Kembali ke Keranjang"
          className="w-10 h-10 rounded-full bg-[#241F36] border border-[#FFE7A5]/70 text-[#FFE7A5] flex items-center justify-center hover:bg-[#312A4A] transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-genshin text-[16px] text-[#FFE7A5] truncate">
            Checkout Pengantaran Glider
          </h1>
          <p className="text-[11px] text-[#BEB5D4]">
            Tentukan titik pendaratan kurir dan pembayaran Mora
          </p>
        </div>
      </header>

      {/* Warm Parchment Main Dialog Sheet */}
      <div className="flex-1 min-h-0 px-2.5 pb-2">
        <div className="h-full rounded-[24px] bg-[#ECE5D8] border border-[#D3BC8E] ring-1 ring-[#5D5187]/45 overflow-y-auto px-3.5 pt-4 pb-8 space-y-4 text-[#232635]">
          {/* 1. Teyvat Delivery Point Selector */}
          <section aria-labelledby="delivery-point-heading" className="space-y-2">
            <div className="flex items-center justify-between">
              <h2
                id="delivery-point-heading"
                className="font-genshin text-[14px] text-[#232635] flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-[#9C5A14]" />
                <span>Titik Pengantaran Teyvat</span>
              </h2>
              <span className="font-genshin text-[11px] text-[#6B4A1B] tabular-nums">
                Est. {selectedPoint.etaMinutes} mnt
              </span>
            </div>

            <div className="space-y-2">
              {DELIVERY_POINTS.map((point) => {
                const active = point.id === selectedPointId;
                return (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedPointId(point.id)}
                    aria-pressed={active}
                    className={`w-full text-left rounded-2xl p-3 border transition-colors duration-150 flex items-start justify-between gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C87C24] ${
                      active
                        ? 'bg-[#FFFDF8] border-[#C87C24] ring-1 ring-[#FFE7A5]'
                        : 'bg-[#F5F2EB] border-[#D3BC8E]/80 hover:border-[#B59A6B]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-genshin text-[13px] text-[#232635] truncate">
                          {point.name}
                        </span>
                        <span className="font-genshin text-[10px] text-[#9C5A14] shrink-0">
                          · {point.region}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#575C70] mt-0.5 leading-snug">
                        {point.landmark}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        active
                          ? 'bg-[#3B4255] border-[#3B4255] text-[#FFE7A5]'
                          : 'border-[#A79E8D]'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <DiamondDivider />

          {/* 2. Payment Method Radio Toggle */}
          <section
            aria-labelledby="payment-method-heading"
            className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-3.5 space-y-2.5"
          >
            <h2
              id="payment-method-heading"
              className="font-genshin text-[14px] text-[#232635]"
            >
              Metode Pembayaran Mora
            </h2>

            <div className="space-y-2" role="radiogroup" aria-label="Metode Pembayaran">
              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'NORTHLAND_BANK_CARD'}
                onClick={() => {
                  setPaymentMethod('NORTHLAND_BANK_CARD');
                  setErrorMessage(null);
                }}
                className={`w-full rounded-xl p-3 border text-left flex items-center justify-between gap-2.5 transition-colors ${
                  paymentMethod === 'NORTHLAND_BANK_CARD'
                    ? 'bg-[#FFFDF8] border-[#C87C24]'
                    : 'bg-[#ECE5D8]/65 border-[#D5CBB7]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#252038] text-[#FFE7A5] flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-genshin text-[12.5px] text-[#232635]">
                      Kartu Northland Bank
                    </div>
                    <div className="text-[11px] text-[#575C70] tabular-nums">
                      Saldo tersedia: {formatMora(profile.moraBalance)} Mora
                    </div>
                  </div>
                </div>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'NORTHLAND_BANK_CARD'
                      ? 'border-[#C87C24]'
                      : 'border-[#A79E8D]'
                  }`}
                >
                  {paymentMethod === 'NORTHLAND_BANK_CARD' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C87C24]" />
                  )}
                </span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'MORA_COD'}
                onClick={() => {
                  setPaymentMethod('MORA_COD');
                  setErrorMessage(null);
                }}
                className={`w-full rounded-xl p-3 border text-left flex items-center justify-between gap-2.5 transition-colors ${
                  paymentMethod === 'MORA_COD'
                    ? 'bg-[#FFFDF8] border-[#C87C24]'
                    : 'bg-[#ECE5D8]/65 border-[#D5CBB7]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#43775E] text-[#FFF8E7] flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-genshin text-[12.5px] text-[#232635]">
                      Mora Tunai saat Terima
                    </div>
                    <div className="text-[11px] text-[#575C70]">
                      Bayar langsung ke Kurir Glider di titik pendaratan
                    </div>
                  </div>
                </div>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'MORA_COD'
                      ? 'border-[#C87C24]'
                      : 'border-[#A79E8D]'
                  }`}
                >
                  {paymentMethod === 'MORA_COD' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C87C24]" />
                  )}
                </span>
              </button>
            </div>

            {insufficientMora && (
              <p className="text-[11px] font-semibold text-[#A33B3B] pt-1">
                Saldo Mora Northland Bank kurang. Pilih Mora Tunai saat Terima atau klaim Mora di Profil.
              </p>
            )}
          </section>

          {/* 3. Kitchen Notes for Chef Xiangling */}
          <section
            aria-labelledby="kitchen-notes-heading"
            className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-3.5 space-y-2"
          >
            <label
              id="kitchen-notes-heading"
              htmlFor="xiangling-notes"
              className="block font-genshin text-[13px] text-[#232635]"
            >
              Catatan Dapur untuk Chef Xiangling
            </label>
            <textarea
              id="xiangling-notes"
              rows={3}
              value={kitchenNotes}
              onChange={(e) => setKitchenNotes(e.target.value)}
              placeholder="Contoh: Kurangi Jueyun Chili ya, atau pisahkan kuah kaldu agar tetap hangat..."
              className="teyvat-cream-input w-full rounded-xl border border-[#CBB997] p-3 text-[12px] placeholder:text-[#7B7487] focus:outline-none focus:ring-2 focus:ring-[#C87C24] resize-none"
            />
          </section>

          {/* Order Summary */}
          <section className="rounded-2xl bg-[#F5F2EB] border border-[#C8A86B] p-4 space-y-2">
            <div className="flex items-center justify-between text-[12px] text-[#4E5366]">
              <span>{cart.length} jenis hidangan ({totals.itemCount} porsi)</span>
              <span className="font-genshin text-[#232635] tabular-nums">
                {formatMora(totals.subtotal)} Mora
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px] text-[#4E5366]">
              <span>Kurir Glider ({selectedPoint.region})</span>
              <span className="font-genshin text-[#232635] tabular-nums">
                {totals.deliveryFee === 0 ? 'Gratis' : `${formatMora(totals.deliveryFee)} Mora`}
              </span>
            </div>
            {totals.discount > 0 && (
              <div className="flex items-center justify-between text-[12px] text-[#2D6E4E]">
                <span>Potongan Voucher</span>
                <span className="font-genshin font-bold tabular-nums">
                  -{formatMora(totals.discount)} Mora
                </span>
              </div>
            )}
            <DiamondDivider className="my-1" />
            <div className="flex items-center justify-between">
              <span className="font-genshin text-[14px] text-[#232635]">Total Bayar</span>
              <MoraAmount
                amount={totals.finalTotal}
                size="md"
                showSuffix
                className="text-[#232635]"
              />
            </div>
          </section>

          {errorMessage && (
            <p className="text-[12px] font-semibold text-[#A33B3B] text-center">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Sticky Confirm CTA */}
      <div className="px-4 py-3 bg-[#171421] border-t border-[#D3BC8E]/45 shrink-0">
        <GoldCapsuleButton
          onClick={handleConfirmOrder}
          disabled={insufficientMora || cart.length === 0}
        >
          Konfirmasi Pesanan — {formatMora(totals.finalTotal)} Mora
        </GoldCapsuleButton>
      </div>
    </div>
  );
};
