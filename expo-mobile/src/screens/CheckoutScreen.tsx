import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Compass,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';
import {
  ASSET_ICONS,
  DELIVERY_POINTS,
  WANMIN_ORIGIN_COORDS,
  formatMora,
} from '../data/dishes';
import {
  buildGliderFlightArcPath,
  getDeliveryFeeForPoint,
  isLocalLiyueDelivery,
} from '../lib/delicaciesRules';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { PaymentMethod } from '../types';
import {
  DiamondDivider,
  GoldCapsuleButton,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

export const CheckoutScreen: React.FC = () => {
  const popStack = useDelicaciesStore((s) => s.popStack);
  const cart = useDelicaciesStore((s) => s.cart);
  const profile = useDelicaciesStore((s) => s.profile);
  const selectedDeliveryPointId = useDelicaciesStore((s) => s.selectedDeliveryPointId);
  const setSelectedDeliveryPointId = useDelicaciesStore(
    (s) => s.setSelectedDeliveryPointId
  );
  const appliedCouponCode = useDelicaciesStore((s) => s.appliedCouponCode);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  const placeOrder = useDelicaciesStore((s) => s.placeOrder);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NORTHLAND_BANK_CARD');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPoint =
    DELIVERY_POINTS.find((p) => p.id === selectedDeliveryPointId) ?? DELIVERY_POINTS[0];
  const isLocalLiyue = isLocalLiyueDelivery(selectedPoint);
  const totals = getCartTotals(selectedPoint);

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
      {/* Clean Genshin Top Bar (Zero brown border line) */}
      <header className="px-4 py-3 teyvat-chrome-bar flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={popStack}
          aria-label="Kembali ke Keranjang"
          className="w-10 h-10 rounded-full bg-white/[0.08] text-[#FFE7A5] flex items-center justify-center hover:bg-white/[0.14] transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="font-genshin text-[16px] text-[#FFE7A5] truncate">
            Checkout Pengantaran
          </h1>
          <p className="text-[11px] text-[#C8D0E4]">
            Ongkir dinamis 8 wilayah Teyvat · Lokal Liyue gratis 0 Mora
          </p>
        </div>
      </header>

      {/* Edge-to-Edge Warm Parchment Scrollable Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8 space-y-4">
        {/* 1. Interactive Teyvat Delivery Point Section */}
        <section
          aria-labelledby="delivery-point-heading"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="delivery-point-heading"
              className="font-genshin text-[14px] text-[#242735] flex items-center gap-1.5"
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
                <span className="font-genshin text-[13.5px] text-[#242735]">
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
                <Navigation className="w-3 h-3 shrink-0" />
                <span>
                  {isLocalLiyue
                    ? 'Kurir Lokal Pelabuhan Liyue · Gratis Ongkir (0 Mora)'
                    : `Kurir Wind Glider: Dapur Wanmin → ${selectedPoint.region} (${formatMora(selectedPoint.deliveryFeeMora)} Mora)`}
                </span>
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#242B3E] text-[#FFE7A5] flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Interactive World Map Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#242B3E] border border-[#C8A86B] text-[#FFE7A5] font-genshin text-[12px] inline-flex items-center justify-center gap-2 whitespace-nowrap hover:bg-[#2F3A59] active:scale-[0.99] transition-all shadow-sm"
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Buka Peta Teyvat (8 Wilayah)</span>
          </button>

          {/* Compact 8-Region Quick-Switch List with Dynamic Distance-Based Delivery Fees */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {DELIVERY_POINTS.map((point) => {
              const active = point.id === selectedPoint.id;
              const fee = getDeliveryFeeForPoint(point);
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => setSelectedDeliveryPointId(point.id)}
                  aria-pressed={active}
                  className={`rounded-xl px-2.5 py-2 border text-left transition-colors ${
                    active
                      ? 'bg-[#FFFDF8] border-[#C87C24] ring-1 ring-[#C8A86B]'
                      : 'bg-[#EFEAE0]/85 border-[#D3BC8E] hover:border-[#9C5A14]'
                  }`}
                >
                  <div className="font-genshin text-[11px] text-[#242735] truncate">
                    {point.region}
                  </div>
                  <div className="text-[10px] text-[#5B6073] truncate">
                    {point.name}
                  </div>
                  <div className="font-genshin text-[10px] mt-1 flex items-center justify-between gap-1 tabular-nums">
                    <span className={fee === 0 ? 'text-[#2D6E4E]' : 'text-[#9C5A14]'}>
                      {fee === 0 ? 'Gratis 0 Mora' : `${formatMora(fee)} Mora`}
                    </span>
                    <span className="text-[#6B5A3E]">{point.etaMinutes} mnt</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Payment Method Radio Toggle with Official Genshin Icons */}
        <section
          aria-labelledby="payment-method-heading"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-2.5"
        >
          <h2
            id="payment-method-heading"
            className="font-genshin text-[14px] text-[#242735]"
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
                  : 'bg-[#ECE5D8]/70 border-[#D5CBB7]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#242B3E] border border-[#C8A86B]/70 flex items-center justify-center shrink-0 p-1.5">
                  <TeyvatImage
                    src={ASSET_ICONS.genesisCrystal}
                    fallbackSrc={ASSET_ICONS.primogem}
                    alt="Kartu Northland Bank"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-genshin text-[12.5px] text-[#242735]">
                    Kartu Northland Bank
                  </div>
                  <div className="font-genshin text-[10.5px] text-[#575C70] tabular-nums">
                    Saldo: {formatMora(profile.moraBalance)} Mora
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
                  : 'bg-[#ECE5D8]/70 border-[#D5CBB7]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#EFE9DC] border border-[#C8A86B] flex items-center justify-center shrink-0 p-1.5">
                  <TeyvatImage
                    src={ASSET_ICONS.mora}
                    fallbackSrc={ASSET_ICONS.moraCdn}
                    alt="Mora Tunai saat Terima"
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-genshin text-[12.5px] text-[#242735]">
                    Mora Tunai saat Terima
                  </div>
                  <div className="text-[11px] text-[#575C70]">
                    {isLocalLiyue
                      ? 'Bayar langsung ke Kurir Lokal Dapur Wanmin'
                      : 'Bayar langsung ke Kurir Glider saat mendarat'}
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
          className="rounded-2xl teyvat-ivory-card p-4 space-y-2"
        >
          <label
            id="kitchen-notes-heading"
            htmlFor="xiangling-notes"
            className="block font-genshin text-[13px] text-[#242735]"
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
        <section className="rounded-2xl teyvat-ivory-card p-4 space-y-2">
          <div className="flex items-center justify-between text-[12px] text-[#4E5366]">
            <span>{cart.length} jenis hidangan ({totals.itemCount} porsi)</span>
            <span className="font-genshin text-[#242735] tabular-nums">
              {formatMora(totals.subtotal)} Mora
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] text-[#4E5366]">
            <span>
              {isLocalLiyue
                ? 'Kurir Lokal (Pelabuhan Liyue)'
                : `Kurir Glider (${selectedPoint.region})`}
            </span>
            <span
              className={`font-genshin tabular-nums ${
                totals.deliveryFee === 0 ? 'text-[#2D6E4E]' : 'text-[#242735]'
              }`}
            >
              {totals.deliveryFee === 0
                ? isLocalLiyue
                  ? 'Gratis · 0 Mora'
                  : 'Gratis (Voucher)'
                : `${formatMora(totals.deliveryFee)} Mora`}
            </span>
          </div>
          {totals.discount > 0 && (
            <div className="flex items-center justify-between text-[12px] text-[#2D6E4E]">
              <span>Potongan Voucher ({appliedCouponCode})</span>
              <span className="font-genshin font-bold tabular-nums">
                -{formatMora(totals.discount)} Mora
              </span>
            </div>
          )}
          <DiamondDivider className="my-1" />
          <div className="flex items-center justify-between">
            <span className="font-genshin text-[14px] text-[#242735]">Total Bayar</span>
            <MoraAmount
              amount={totals.finalTotal}
              size="md"
              showSuffix
              className="text-[#242735]"
            />
          </div>
        </section>

        {errorMessage && (
          <p className="text-[12px] font-semibold text-[#A33B3B] text-center">
            {errorMessage}
          </p>
        )}
      </div>

      {/* Clean Genshin Bottom Sticky Confirm CTA */}
      <div className="px-4 py-3 teyvat-chrome-bar shrink-0">
        <GoldCapsuleButton
          onClick={handleConfirmOrder}
          disabled={insufficientMora || cart.length === 0}
        >
          Konfirmasi Pesanan — {formatMora(totals.finalTotal)} Mora
        </GoldCapsuleButton>
      </div>

      {/* WARM PARCHMENT INTERACTIVE 8-REALM TEYVAT WORLD MAP MODAL */}
      {isMapModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="teyvat-map-modal-title"
          className="absolute inset-0 z-50 bg-[#1B2234]/72 backdrop-blur-sm flex items-center justify-center p-3"
        >
          <div className="w-full max-w-[396px] max-h-[92%] rounded-[24px] overflow-hidden border border-[#D3BC8E] bg-[#ECE5D8] shadow-2xl flex flex-col animate-modal-enter">
            {/* Genshin Modal Header with Official Modal Ornament */}
            <div className="px-4 py-3 teyvat-chrome-bar flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <TeyvatImage
                  src={ASSET_ICONS.modalOrnament}
                  fallbackSrc={ASSET_ICONS.crownOfInsight}
                  alt="Ornamen Peta Teyvat"
                  className="w-7 h-7 object-contain shrink-0"
                />
                <div className="min-w-0">
                  <h2
                    id="teyvat-map-modal-title"
                    className="font-genshin text-[14.5px] text-[#FFE7A5] truncate"
                  >
                    Peta Pengantaran Teyvat
                  </h2>
                  <p className="text-[10.5px] text-[#C8D0E4] truncate">
                    8 wilayah · Ongkir dinamis dari Dapur Wanmin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                aria-label="Tutup Peta Teyvat"
                className="w-9 h-9 rounded-full bg-white/[0.08] text-[#FFE7A5] flex items-center justify-center hover:bg-white/[0.15] transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Seamless Right-Side-Up Full 8-Region Teyvat World Map */}
            <div className="p-3.5 space-y-2.5 overflow-y-auto no-scrollbar">
              <div className="relative w-full aspect-square overflow-hidden rounded-2xl border border-[#D3BC8E] bg-[#1885B5] shadow-inner">
                <img
                  src={ASSET_ICONS.teyvatMap}
                  alt="Peta Dunia Teyvat Lengkap Delapan Wilayah"
                  className="w-full h-full object-cover block select-none"
                />

                {/* SVG Golden Trajectory Path from Wanmin Kitchen (Liyue) */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  aria-hidden="true"
                >
                  {isLocalLiyue ? (
                    <circle
                      cx={WANMIN_ORIGIN_COORDS.x}
                      cy={WANMIN_ORIGIN_COORDS.y}
                      r="5.2"
                      fill="rgba(255, 231, 165, 0.28)"
                      stroke="#FFE7A5"
                      strokeWidth="0.9"
                      strokeDasharray="1.8 1.2"
                    />
                  ) : flightArcPath ? (
                    <>
                      <path
                        d={flightArcPath}
                        fill="none"
                        stroke="rgba(32, 38, 56, 0.45)"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <path
                        d={flightArcPath}
                        fill="none"
                        stroke="#FFE7A5"
                        strokeWidth="1.05"
                        strokeDasharray="2.5 1.5"
                        strokeLinecap="round"
                        className="animate-flight-dash"
                      />
                    </>
                  ) : null}
                  {/* Origin Kitchen Anchor (Wanmin Kitchen, Liyue) */}
                  <circle
                    cx={WANMIN_ORIGIN_COORDS.x}
                    cy={WANMIN_ORIGIN_COORDS.y}
                    r="1.6"
                    fill="#FFE7A5"
                    stroke="#22283A"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* All 8 Clickable Regional Waypoint Pins */}
                {DELIVERY_POINTS.map((point) => {
                  const isSelected = point.id === selectedPoint.id;
                  const alignLabelLeft = point.mapCoords.x > 78;
                  const placeLabelAbove = point.mapCoords.y > 78;
                  return (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => setSelectedDeliveryPointId(point.id)}
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
                            ? 'w-7 h-7 bg-[#FFE7A5] border-[#22283A] text-[#22283A] scale-110 shadow-[0_0_14px_rgba(255,231,165,0.95)]'
                            : 'w-5 h-5 bg-[#22283A]/92 border-[#FFE7A5] text-[#FFE7A5] hover:scale-110'
                        }`}
                      >
                        <MapPin className={isSelected ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} />
                      </span>

                      <span
                        className={`absolute px-1.5 py-0.5 rounded font-genshin text-[8px] leading-none whitespace-nowrap border pointer-events-none shadow ${
                          placeLabelAbove ? 'bottom-full mb-1' : 'top-full mt-0.5'
                        } ${
                          alignLabelLeft ? 'right-0' : 'left-1/2 -translate-x-1/2'
                        } ${
                          isSelected
                            ? 'bg-[#FFE7A5] text-[#22283A] border-[#FAF8F2] z-20'
                            : 'bg-[#22283A]/90 text-[#FFF8E7] border-[#FFE7A5]/45'
                        }`}
                      >
                        {point.region}
                      </span>
                    </button>
                  );
                })}

                {/* Compact Legend Badge Top-Left over open northwestern sea */}
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-[#22283A]/84 border border-[#FFE7A5]/35 text-[9px] text-[#FFF8E7] flex items-center gap-2 pointer-events-none backdrop-blur-sm whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FFE7A5]" />
                    <span>Asal: Wanmin</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#C87C24] border border-[#FFE7A5]" />
                    <span>Tujuan</span>
                  </span>
                </div>
              </div>

              {/* Horizontal Quick-Tap Buttons for All 8 Realms */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {DELIVERY_POINTS.map((point) => {
                  const active = point.id === selectedPoint.id;
                  return (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => setSelectedDeliveryPointId(point.id)}
                      className={`min-h-[30px] px-2.5 py-1 rounded-full font-genshin text-[10px] whitespace-nowrap shrink-0 border transition-colors ${
                        active
                          ? 'bg-[#242B3E] border-[#C8A86B] text-[#FFE7A5]'
                          : 'bg-[#FAF8F2] border-[#D3BC8E] text-[#3B4255] hover:border-[#9C5A14]'
                      }`}
                    >
                      {point.region}
                    </button>
                  );
                })}
              </div>

              {/* Luminous Ivory Parchment Waypoint Confirmation Card */}
              <div className="rounded-2xl teyvat-ivory-card p-3 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-genshin text-[10px] uppercase tracking-wider text-[#9C5A14]">
                      {isLocalLiyue
                        ? 'Pengantaran Lokal · Liyue'
                        : `Titik Pendaratan · ${selectedPoint.region}`}
                    </div>
                    <div className="font-genshin text-[13.5px] text-[#242735] mt-0.5">
                      {selectedPoint.name}
                    </div>
                    <div className="text-[11px] text-[#575C70] mt-0.5">
                      {selectedPoint.landmark}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`font-genshin text-[11px] tabular-nums ${
                        isLocalLiyue ? 'text-[#2D6E4E]' : 'text-[#9C5A14]'
                      }`}
                    >
                      {isLocalLiyue
                        ? 'Gratis 0 Mora'
                        : `${formatMora(selectedPoint.deliveryFeeMora)} Mora`}
                    </div>
                    <div className="font-genshin text-[10px] text-[#6B5A3E] tabular-nums mt-0.5">
                      Est. {selectedPoint.etaMinutes} mnt
                    </div>
                  </div>
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
