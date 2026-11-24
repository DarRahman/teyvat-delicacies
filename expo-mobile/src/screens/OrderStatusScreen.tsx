import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock, Flame, Footprints, MapPin } from 'lucide-react';
import { ASSET_ICONS, formatMora } from '../data/dishes';
import {
  clampGliderProgress,
  getGliderStageFromProgress,
  isLocalLiyueDelivery,
} from '../lib/delicaciesRules';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondBullet,
  DiamondDivider,
  DiamondStar,
  GoldCapsuleButton,
  MoraAmount,
  TeyvatImage,
  WindGliderIcon,
} from '../components/TeyvatUI';

interface OrderStatusScreenProps {
  orderId: string;
}

export const OrderStatusScreen: React.FC<OrderStatusScreenProps> = ({ orderId }) => {
  const orders = useDelicaciesStore((s) => s.orders);
  const updateOrderStatus = useDelicaciesStore((s) => s.updateOrderStatus);
  const resetToTab = useDelicaciesStore((s) => s.resetToTab);

  const order = orders.find((o) => o.id === orderId) ?? orders[0];
  const initialTotalSeconds = (order?.deliveryPoint.etaMinutes ?? 12) * 60;

  const [progress, setProgress] = useState<number>(
    order?.status === 'COMPLETED' ? 100 : 4
  );
  const [showQuestModal, setShowQuestModal] = useState(
    order?.status === 'COMPLETED'
  );
  const dispatchedRef = useRef(order?.status !== 'COOKING');
  const completedRef = useRef(order?.status === 'COMPLETED');

  // Smooth continuous real-time courier progress (0% -> 100%)
  useEffect(() => {
    if (!order || order.status === 'COMPLETED' || completedRef.current) return;

    const tick = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return clampGliderProgress(prev + 1.25);
      });
    }, 65);

    return () => window.clearInterval(tick);
  }, [order?.id, order?.status]);

  // Synchronize store order status & Quest Complete modal outside setState updater
  useEffect(() => {
    if (!order) return;

    if (progress >= 18 && !dispatchedRef.current) {
      dispatchedRef.current = true;
      updateOrderStatus(order.id, 'GLIDER_DISPATCHED');
    }

    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      updateOrderStatus(order.id, 'COMPLETED');
      setShowQuestModal(true);
    }
  }, [progress, order, updateOrderStatus]);

  const handleInstantDeliver = () => {
    if (!order) return;
    dispatchedRef.current = true;
    completedRef.current = true;
    setProgress(100);
    updateOrderStatus(order.id, 'COMPLETED');
    setShowQuestModal(true);
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-transparent">
        <p className="font-genshin text-[#2C3040]">Pesanan tidak ditemukan</p>
        <div className="mt-4 w-full max-w-[240px]">
          <GoldCapsuleButton onClick={() => resetToTab('beranda')}>
            Kembali ke Beranda
          </GoldCapsuleButton>
        </div>
      </div>
    );
  }

  const isLocalLiyue = isLocalLiyueDelivery(order.deliveryPoint);
  const stage = getGliderStageFromProgress(progress);
  const roundedPercent = Math.round(progress);
  const remainingSeconds = Math.max(
    0,
    Math.round(initialTotalSeconds * (1 - progress / 100))
  );
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');

  const statusHeadline =
    stage === 0
      ? 'Dimasak di Dapur Wanmin'
      : stage === 1
      ? isLocalLiyue
        ? 'Kurir Lokal Menuju Teras Yujing'
        : `Kurir Glider Menuju ${order.deliveryPoint.region}`
      : isLocalLiyue
      ? `Tiba di ${order.deliveryPoint.name}`
      : `Mendarat di ${order.deliveryPoint.name}`;

  const statusSubcopy =
    stage === 0
      ? 'Chef Xiangling sedang meracik dan menyegel kehangatan hidanganmu.'
      : stage === 1
      ? isLocalLiyue
        ? 'Kurir lokal Dapur Wanmin mengantar pesanan hangat melintasi Pelabuhan Liyue (Gratis Ongkir).'
        : `Kurir Wind Glider meluncur membawa pesanan ke ${order.deliveryPoint.name}.`
      : 'Pesanan kuliner telah tiba hangat di lokasi pilihanmu.';

  const phases = [
    { label: 'Dapur Wanmin', active: stage >= 0, current: stage === 0 },
    {
      label: isLocalLiyue ? 'Kurir Lokal' : 'Kurir Meluncur',
      active: stage >= 1,
      current: stage === 1,
    },
    { label: 'Pesanan Tiba', active: stage >= 2, current: stage === 2 },
  ];

  return (
    <div className="relative flex flex-col h-full bg-transparent overflow-hidden animate-stack-enter">
      {/* Clean Genshin Header (No brown line, borderless ETA HUD) */}
      <header className="relative z-10 px-4 pt-3.5 pb-3 teyvat-chrome-bar shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-genshin text-[10.5px] text-[#C8D0E4] tabular-nums">
              {order.id}
            </p>
            <h1 className="font-genshin text-[17px] text-[#FFE7A5]">
              {isLocalLiyue ? 'Pengantaran Lokal Liyue' : 'Pelacakan Kurir Glider'}
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 font-genshin text-[13px] text-[#FFE7A5] tabular-nums shrink-0">
            <Clock className="w-4 h-4 text-[#FFE7A5]/90" />
            <span>{stage >= 2 ? 'Tiba' : `${mins}:${secs}`}</span>
          </div>
        </div>
      </header>

      {/* Edge-to-Edge Warm Antique Parchment Scrollable Tracking Canvas */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pt-4 pb-8 space-y-4">
        {/* Authentic Genshin Commission Progress Card */}
        <section
          aria-label="Lintasan Pengantaran Pesanan"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-4"
        >
          {/* Commission Quest Title & Live Gold Percentage */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-genshin tracking-wider text-[#9C6A1B] uppercase">
                <DiamondStar size={9} className="text-[#C8963E]" />
                <span>
                  {isLocalLiyue
                    ? 'Pengantaran Lokal · Pelabuhan Liyue'
                    : 'Misi Pengantaran Aktif'}
                </span>
              </div>
              <h2 className="font-genshin text-[15px] text-[#2C3040] leading-snug mt-1">
                {statusHeadline}
              </h2>
              <p className="text-[11.5px] text-[#5B6073] mt-1 leading-relaxed">
                {statusSubcopy}
              </p>
            </div>
            <div className="font-genshin text-[16px] text-[#9C6A1B] tabular-nums shrink-0 pt-0.5">
              {roundedPercent}%
            </div>
          </div>

          {/* Authentic Warm Parchment & Antique Gold Delivery Corridor */}
          <div className="rounded-2xl bg-[#EFE9DC] border border-[#DDD2BE] px-3.5 py-4 space-y-3">
            {/* Continuous Horizontal Track */}
            <div className="relative h-12 flex items-center">
              {/* Origin Crest (Left: Wanmin Kitchen) */}
              <div
                className="w-8 h-8 rounded-full bg-[#FAF8F2] border border-[#C8A86B] text-[#9C5A14] flex items-center justify-center shrink-0 z-10 shadow-sm"
                aria-label="Asal: Dapur Wanmin, Liyue"
              >
                <Flame className="w-4 h-4" />
              </div>

              {/* Golden Commission Rail */}
              <div className="relative flex-1 mx-2 h-[5px] rounded-full bg-[#DDD3BF]">
                {/* Continuous Filled Antique-Gold Wake */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-75 ease-linear"
                  style={{
                    width: `${progress}%`,
                    background:
                      'linear-gradient(90deg, #B8873A 0%, #DFBD76 62%, #F5DFA6 100%)',
                  }}
                />

                {/* Smoothly Gliding Courier Medallion */}
                <div
                  role="progressbar"
                  aria-label="Progres pengantaran pesanan"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={roundedPercent}
                  style={{
                    left: `${progress}%`,
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-[left] duration-75 ease-linear"
                >
                  {/* Soft Gold-Ivory Motion Streaks while Active */}
                  {progress > 5 && progress < 100 && (
                    <div
                      aria-hidden="true"
                      className="absolute right-full top-1/2 -translate-y-1/2 mr-1 flex flex-col gap-1 pointer-events-none"
                    >
                      <span className="block w-5 h-[1.5px] rounded-full bg-gradient-to-l from-[#C8963E] to-transparent animate-wind-streak" />
                      <span
                        className="block w-3.5 h-[1.5px] rounded-full bg-gradient-to-l from-[#DFBD76] to-transparent animate-wind-streak"
                        style={{ animationDelay: '0.28s' }}
                      />
                    </div>
                  )}

                  {/* Genshin Charcoal-Gold Courier Medallion */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      stage >= 2
                        ? 'bg-[#FFE7A5] border-[#9C6A1B] text-[#272E42] shadow-md'
                        : 'bg-[#272E42] border-[#FFE7A5] text-[#FFE7A5] animate-gold-pulse'
                    }`}
                  >
                    {stage >= 2 ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isLocalLiyue ? (
                      <Footprints className="w-4 h-4" />
                    ) : (
                      <WindGliderIcon className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>

              {/* Destination Crest (Right: Chosen Realm) */}
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 shadow-sm transition-colors ${
                  stage >= 2
                    ? 'bg-[#272E42] border-[#C8A86B] text-[#FFE7A5]'
                    : 'bg-[#FAF8F2] border-[#D3BC8E] text-[#7D6C4F]'
                }`}
                aria-label={`Tujuan: ${order.deliveryPoint.name}`}
              >
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            {/* Aligned Origin -> ETA -> Destination Labels */}
            <div className="flex items-center justify-between text-[10.5px]">
              <div className="text-left">
                <div className="font-genshin text-[#2C3040]">Dapur Wanmin</div>
                <div className="text-[#6E6758] text-[10px]">Liyue · Asal</div>
              </div>
              <div className="text-center px-2">
                <div className="font-genshin text-[#9C6A1B] tabular-nums">
                  {stage >= 2 ? 'Pesanan Tiba' : `Est. ${mins}:${secs}`}
                </div>
                <div className="text-[#6E6758] text-[10px]">
                  {isLocalLiyue ? 'Kurir Lokal · 0 Mora' : 'Kurir Wind Glider'}
                </div>
              </div>
              <div className="text-right max-w-[104px]">
                <div className="font-genshin text-[#2C3040] truncate">
                  {isLocalLiyue ? 'Teras Yujing' : order.deliveryPoint.region}
                </div>
                <div className="text-[#6E6758] text-[10px] truncate">
                  {isLocalLiyue ? 'Liyue · Lokal' : 'Tujuan'}
                </div>
              </div>
            </div>
          </div>

          {/* Authentic Genshin Inline Diamond Milestone Strip */}
          <div className="flex items-center justify-between px-1 pt-0.5">
            {phases.map((phase, idx) => (
              <React.Fragment key={phase.label}>
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  {phase.active ? (
                    <DiamondStar
                      size={10}
                      className={phase.current ? 'text-[#C87C24]' : 'text-[#C8A86B]'}
                    />
                  ) : (
                    <DiamondBullet size={6} className="text-[#CFC4AE]" />
                  )}
                  <span
                    className={`font-genshin text-[10.5px] whitespace-nowrap ${
                      phase.current
                        ? 'text-[#9C5A14]'
                        : phase.active
                        ? 'text-[#2C3040]'
                        : 'text-[#8F887A]'
                    }`}
                  >
                    {phase.label}
                  </span>
                </div>
                {idx < phases.length - 1 && (
                  <div className="h-px flex-1 mx-2 bg-[#DED4C0]" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>

          {stage < 2 && (
            <GoldCapsuleButton onClick={handleInstantDeliver}>
              {isLocalLiyue
                ? 'Percepat Pengantaran Lokal'
                : 'Percepat Pendaratan Kurir Glider'}
            </GoldCapsuleButton>
          )}
        </section>

        {/* Clean Ivory Parchment Order Receipt Card */}
        <section
          aria-label="Struk Pesanan Kuliner"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-3"
        >
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#9C5A14] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="font-genshin text-[10px] uppercase tracking-wider text-[#9C5A14]">
                {isLocalLiyue
                  ? 'Pengantaran Lokal · Liyue'
                  : `Tujuan Pengantaran · ${order.deliveryPoint.region}`}
              </div>
              <div className="font-genshin text-[14px] text-[#2C3040]">
                {order.deliveryPoint.name}
              </div>
              <div className="text-[11px] text-[#5B6073]">
                {order.deliveryPoint.landmark}
              </div>
            </div>
          </div>

          <DiamondDivider />

          <div className="space-y-1.5">
            {order.items.map((item) => (
              <div
                key={item.dish.id}
                className="flex items-center justify-between text-[12px] text-[#35394A]"
              >
                <span className="font-genshin truncate pr-2">
                  {item.dish.name} ×{item.quantity}
                </span>
                <span className="font-genshin tabular-nums shrink-0">
                  {formatMora(item.dish.priceMora * item.quantity)} Mora
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between text-[11.5px] text-[#5B6073] pt-1">
              <span>{isLocalLiyue ? 'Ongkir Lokal Liyue' : 'Ongkir Kurir Glider'}</span>
              <span
                className={`font-genshin tabular-nums ${
                  order.deliveryFeeMora === 0 ? 'text-[#2D6E4E]' : 'text-[#35394A]'
                }`}
              >
                {order.deliveryFeeMora === 0
                  ? 'Gratis (0 Mora)'
                  : `${formatMora(order.deliveryFeeMora)} Mora`}
              </span>
            </div>
          </div>

          {order.kitchenNotes && (
            <div className="rounded-xl bg-[#EFE9DC] border border-[#DDD2BE] px-3 py-2 text-[11px] text-[#4C5166]">
              <span className="font-genshin text-[#2C3040]">Catatan Chef Xiangling: </span>
              {order.kitchenNotes}
            </div>
          )}

          <div className="pt-2 border-t border-[#E2D8C5] flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#5B6073]">
              <TeyvatImage
                src={
                  order.paymentMethod === 'NORTHLAND_BANK_CARD'
                    ? ASSET_ICONS.genesisCrystal
                    : ASSET_ICONS.mora
                }
                alt="Metode Pembayaran"
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>
                {order.paymentMethod === 'NORTHLAND_BANK_CARD'
                  ? 'Lunas · Northland Bank'
                  : 'Tunai saat Terima'}
              </span>
            </span>
            <MoraAmount
              amount={order.totalMora}
              size="sm"
              showSuffix
              className="text-[#2C3040]"
            />
          </div>
        </section>

        {stage >= 2 && !showQuestModal && (
          <GoldCapsuleButton onClick={() => setShowQuestModal(true)}>
            Buka Ringkasan Quest Complete
          </GoldCapsuleButton>
        )}
      </div>

      {/* LEGENDARY GOLDEN-FRAMED PARCHMENT MODAL: QUEST COMPLETE */}
      {showQuestModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quest-complete-title"
          className="absolute inset-0 z-40 bg-[#1B2234]/70 backdrop-blur-sm flex items-center justify-center p-5"
        >
          <div className="relative w-full max-w-[356px] rounded-[26px] overflow-hidden border border-[#D3BC8E] bg-[#FAF8F2] shadow-2xl animate-modal-enter text-[#2C3040]">
            {/* Top Ornamental Regal Crest Header */}
            <div className="relative teyvat-chrome-bar px-5 pt-5 pb-4 text-center">
              <img
                src={ASSET_ICONS.resultCardBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DiamondStar size={12} />
                  <TeyvatImage
                    src={ASSET_ICONS.modalOrnament}
                    fallbackSrc={ASSET_ICONS.crownOfInsight}
                    alt="Ornamen Quest Complete"
                    className="w-11 h-11 object-contain"
                  />
                  <DiamondStar size={12} />
                </div>
                <p className="font-genshin text-[10px] tracking-[0.2em] text-[#FFE7A5] uppercase">
                  {isLocalLiyue ? 'Pengantaran Lokal Selesai' : 'Misi Kuliner Selesai'}
                </p>
                <h2
                  id="quest-complete-title"
                  className="font-genshin text-[19px] leading-snug text-[#FFFDF5] mt-1"
                >
                  QUEST COMPLETE: Feast Delivered!
                </h2>
              </div>
            </div>

            {/* Warm Ivory Parchment Modal Body */}
            <div className="p-5 text-center space-y-4">
              <div className="rounded-2xl bg-[#EFE9DC] border border-[#DDD2BE] p-3.5 text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#565B6F]">
                  <span>Nomor Pesanan</span>
                  <span className="font-genshin text-[#2C3040] tabular-nums">
                    {order.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#565B6F]">
                  <span>Titik Antar</span>
                  <span className="font-genshin text-[#2C3040] truncate max-w-[175px]">
                    {order.deliveryPoint.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#565B6F]">
                  <span>Estimasi Tiba</span>
                  <span className="font-genshin text-[#2D6E4E] tabular-nums">
                    {order.deliveryPoint.etaMinutes} menit (Tiba)
                  </span>
                </div>
                <DiamondDivider className="my-1" />
                <div className="flex items-center justify-between">
                  <span className="font-genshin text-[12px] text-[#2C3040]">
                    Total Transaksi
                  </span>
                  <MoraAmount
                    amount={order.totalMora}
                    size="sm"
                    showSuffix
                    className="text-[#2C3040]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <GoldCapsuleButton onClick={() => resetToTab('beranda')}>
                  Kembali ke Beranda
                </GoldCapsuleButton>
                <button
                  type="button"
                  onClick={() => resetToTab('profil')}
                  className="w-full min-h-[38px] font-genshin text-[12px] text-[#4E5366] hover:text-[#9C5A14] transition-colors"
                >
                  Lihat di Riwayat Profil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
