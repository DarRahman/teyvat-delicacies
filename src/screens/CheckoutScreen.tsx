import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Compass,
  CreditCard,
  MapPin,
  Navigation,
  Wallet,
  X,
} from 'lucide-react';
import {
  ASSET_ICONS,
  DELIVERY_POINTS,
  WANMIN_ORIGIN_COORDS,
  formatMora,
} from '../data/dishes';
import { buildGliderFlightArcPath } from '../lib/delicaciesRules';
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
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NORTHLAND_BANK_CARD');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totals = getCartTotals();
  const selectedPoint =
    DELIVERY_POINTS.find((p) => p.id === selectedPointId) ?? DELIVERY_POINTS[0];

  const flightArcPath = useMemo(
    () => buildGliderFlightArcPath(WANMIN_ORIGIN_COORDS, selectedPoint.mapCoords),
    [selectedPoint.mapCoords]
  );

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
    <div className="relative flex flex-col h-full bg-transparent animate-stack-enter">
      {/* Translucent Glassmorphic Top Bar */}
      <header className="px-4 py-3 hoyolab-glass-bar border-b border-[#FFE7A5]/25 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={popStack}
          aria-label="Kembali ke Keranjang"
          className="w-10 h-10 rounded-full hoyolab-stat-badge text-[#FFE7A5] flex items-center justify-center hover:border-[#FFE7A5] transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-genshin text-[16px] text-[#FFE7A5] truncate">
            Checkout Pengantaran Glider
          </h1>
          <p className="text-[11px] text-[#C2CAE0]">
            Tentukan titik pendaratan kurir di Peta Teyvat &amp; metode Mora
          </p>
        </div>
      </header>

      {/* Full-Bleed Scrollable Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8 space-y-4">
        {/* 1. Interactive Teyvat Delivery Point Section */}
        <section
          aria-labelledby="delivery-point-heading"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-3 shadow-md"
        >
          <div className="flex items-center justify-between gap-2">
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

          {/* Active Waypoint Preview Card */}
          <div className="rounded-xl bg-[#ECE5D8] border border-[#C8A86B] p-3 flex items-start justify-between gap-2.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-genshin text-[13.5px] text-[#232635]">
                  {selectedPoint.name}
                </span>
                <span className="font-genshin text-[10.5px] text-[#9C5A14]">
                  · {selectedPoint.region}
                </span>
              </div>
              <p className="text-[11.5px] text-[#575C70] mt-0.5 leading-snug">
                {selectedPoint.landmark}
              </p>
              <p className="text-[10.5px] text-[#2D6E4E] font-semibold mt-1.5 inline-flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                <span>Rute Glider: Dapur Wanmin (Liyue) ke {selectedPoint.region}</span>
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#2C354D] text-[#FFE7A5] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Interactive World Map Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#252E47] border border-[#FFE7A5]/65 text-[#FFE7A5] font-genshin text-[12px] inline-flex items-center justify-center gap-2 hover:bg-[#2F3A59] active:scale-[0.99] transition-all shadow-sm"
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Pilih Titik Antar di Peta Teyvat</span>
          </button>

          {/* Compact Regional Quick-Switch List */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {DELIVERY_POINTS.map((point) => {
              const active = point.id === selectedPointId;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => setSelectedPointId(point.id)}
                  aria-pressed={active}
                  className={`rounded-xl px-2.5 py-2 border text-left transition-colors ${
                    active
                      ? 'bg-[#FFFDF8] border-[#C87C24] ring-1 ring-[#FFE7A5]'
                      : 'bg-[#EFEAE0]/80 border-[#D3BC8E]/75 hover:border-[#B59A6B]'
                  }`}
                >
                  <div className="font-genshin text-[11px] text-[#232635] truncate">
                    {point.name}
                  </div>
                  <div className="text-[10px] text-[#6B4A1B] mt-0.5 tabular-nums">
                    {point.region} · {point.etaMinutes} mnt
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Payment Method Radio Toggle */}
        <section
          aria-labelledby="payment-method-heading"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-2.5 shadow-md"
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
                <div className="w-9 h-9 rounded-lg bg-[#252E47] text-[#FFE7A5] flex items-center justify-center shrink-0">
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
          className="rounded-2xl teyvat-ivory-card p-4 space-y-2 shadow-md"
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
        <section className="rounded-2xl teyvat-ivory-card p-4 space-y-2 shadow-md">
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
          <p className="text-[12px] font-semibold text-[#FFB4B4] text-center">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Glassmorphic Bottom Sticky Confirm CTA */}
      <div className="px-4 py-3 hoyolab-glass-bar border-t border-[#FFE7A5]/25 shrink-0">
        <GoldCapsuleButton
          onClick={handleConfirmOrder}
          disabled={insufficientMora || cart.length === 0}
        >
          Konfirmasi Pesanan — {formatMora(totals.finalTotal)} Mora
        </GoldCapsuleButton>
      </div>

      {/* INTERACTIVE TEYVAT WORLD MAP DELIVERY MODAL */}
      {isMapModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="teyvat-map-modal-title"
          className="absolute inset-0 z-50 bg-[#121622]/86 backdrop-blur-sm flex items-center justify-center p-3.5"
        >
          <div className="w-full max-w-[392px] max-h-[90%] rounded-[24px] overflow-hidden border-2 border-[#FFE7A5]/75 bg-[#1B2234] shadow-2xl flex flex-col animate-modal-enter">
            {/* Modal Header */}
            <div className="px-4 py-3 hoyolab-glass-bar border-b border-[#FFE7A5]/25 flex items-center justify-between gap-2 shrink-0">
              <div>
                <h2
                  id="teyvat-map-modal-title"
                  className="font-genshin text-[15px] text-[#FFE7A5]"
                >
                  Peta Pengantaran Teyvat
                </h2>
                <p className="text-[10.5px] text-[#C2CAE0]">
                  Ketuk pin wilayah untuk menentukan jalur terbang Kurir Glider
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                aria-label="Tutup Peta Teyvat"
                className="w-9 h-9 rounded-full hoyolab-stat-badge text-[#FFE7A5] flex items-center justify-center hover:border-[#FFE7A5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive World Map Canvas with Precision SVG Flight Arc */}
            <div className="p-3.5 space-y-3 overflow-y-auto">
              <div className="relative w-full aspect-[100/68] overflow-hidden rounded-2xl border border-[#FFE7A5]/45 bg-[#121622] shadow-inner">
                {/* Inner 1:1 Image-Matched Coordinate Wrapper shifted to frame all 6 core continents */}
                <div
                  className="relative w-full"
                  style={{ transform: 'translateY(-15%)' }}
                >
                  <img
                    src={ASSET_ICONS.teyvatMap}
                    alt="Peta Dunia Teyvat Lengkap"
                    className="w-full h-auto block select-none brightness-[0.94] contrast-[1.06]"
                  />

                  {/* SVG Golden Glider Flight Trajectory Path from Wanmin Kitchen (Liyue) */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    aria-hidden="true"
                  >
                    {flightArcPath ? (
                      <>
                        {/* Soft Golden Trajectory Glow */}
                        <path
                          d={flightArcPath}
                          fill="none"
                          stroke="rgba(255, 231, 165, 0.35)"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                        {/* Animated Golden Flight Line */}
                        <path
                          d={flightArcPath}
                          fill="none"
                          stroke="#FFE7A5"
                          strokeWidth="0.85"
                          strokeDasharray="2.4 1.6"
                          strokeLinecap="round"
                          className="animate-flight-dash"
                        />
                      </>
                    ) : (
                      /* Local Liyue Harbor Beacon Ring when Wanmin Terrace is chosen */
                      <circle
                        cx={WANMIN_ORIGIN_COORDS.x}
                        cy={WANMIN_ORIGIN_COORDS.y}
                        r="4.2"
                        fill="rgba(86, 226, 182, 0.22)"
                        stroke="#FFE7A5"
                        strokeWidth="0.7"
                      />
                    )}
                    {/* Origin Kitchen Diamond Anchor (Wanmin Kitchen, Liyue) */}
                    <circle
                      cx={WANMIN_ORIGIN_COORDS.x}
                      cy={WANMIN_ORIGIN_COORDS.y}
                      r="1.45"
                      fill="#FFE7A5"
                      stroke="#1B2234"
                      strokeWidth="0.45"
                    />
                  </svg>

                  {/* Clickable Regional Waypoint Pins */}
                  {DELIVERY_POINTS.map((point) => {
                    const isSelected = point.id === selectedPoint.id;
                    const alignLabelLeft = point.mapCoords.x > 74;
                    return (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => setSelectedPointId(point.id)}
                        aria-label={`Pilih titik antar ${point.name}, ${point.region}`}
                        aria-pressed={isSelected}
                        style={{
                          left: `${point.mapCoords.x}%`,
                          top: `${point.mapCoords.y}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group focus-visible:outline-none z-10"
                      >
                        <span
                          className={`flex items-center justify-center rounded-full border-2 transition-transform ${
                            isSelected
                              ? 'w-7 h-7 bg-[#232C45] border-[#FFE7A5] text-[#56E2B6] scale-110 shadow-[0_0_14px_rgba(86,226,182,0.75)]'
                              : 'w-5 h-5 bg-[#1B2234]/90 border-[#FFE7A5]/80 text-[#FFE7A5] hover:scale-110'
                          }`}
                        >
                          <MapPin className={isSelected ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} />
                        </span>

                        <span
                          className={`absolute top-full mt-0.5 px-1.5 py-0.5 rounded font-genshin text-[8.5px] leading-none whitespace-nowrap border pointer-events-none shadow ${
                            alignLabelLeft ? 'right-0' : 'left-1/2 -translate-x-1/2'
                          } ${
                            isSelected
                              ? 'bg-[#FFE7A5] text-[#232635] border-[#FFFDF8] z-20'
                              : 'bg-[#161B2A]/88 text-[#F7F4EE] border-[#FFE7A5]/35'
                          }`}
                        >
                          {point.region}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Map Legend Overlay Bottom-Left (keeps Natlan pin completely unobstructed) */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg hoyolab-stat-badge text-[9.5px] text-[#F7F4EE] flex items-center gap-2 pointer-events-none">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FFE7A5]" />
                    <span>Asal: Wanmin</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#56E2B6]" />
                    <span>Tujuan</span>
                  </span>
                </div>
              </div>

              {/* Horizontal Quick-Tap Hub Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {DELIVERY_POINTS.map((point) => {
                  const active = point.id === selectedPoint.id;
                  return (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => setSelectedPointId(point.id)}
                      className={`min-h-[32px] px-2.5 py-1 rounded-full font-genshin text-[10.5px] whitespace-nowrap shrink-0 border transition-colors ${
                        active
                          ? 'bg-[#FFE7A5] border-[#FFE7A5] text-[#232635]'
                          : 'hoyolab-stat-badge text-[#DCE2F2] hover:border-[#FFE7A5]/60'
                      }`}
                    >
                      {point.region}
                    </button>
                  );
                })}
              </div>

              {/* Luminous Ivory Parchment Waypoint Confirmation Card */}
              <div className="rounded-2xl teyvat-ivory-card p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9C5A14]">
                      Titik Pendaratan Terpilih · {selectedPoint.region}
                    </div>
                    <div className="font-genshin text-[14px] text-[#232635] mt-0.5">
                      {selectedPoint.name}
                    </div>
                    <div className="text-[11px] text-[#575C70] mt-0.5">
                      {selectedPoint.landmark}
                    </div>
                  </div>
                  <span className="font-genshin text-[11px] px-2.5 py-1 rounded-full bg-[#ECE5D8] border border-[#C8A86B] text-[#6B4A1B] shrink-0 tabular-nums">
                    {selectedPoint.etaMinutes} mnt
                  </span>
                </div>
              </div>

              <GoldCapsuleButton onClick={() => setIsMapModalOpen(false)}>
                Konfirmasi Titik Pengantaran
              </GoldCapsuleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
