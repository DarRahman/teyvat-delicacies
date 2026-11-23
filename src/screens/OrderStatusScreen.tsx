import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock, Flame, MapPin, Wind } from 'lucide-react';
import { ASSET_ICONS, formatMora } from '../data/dishes';
import { teyvatAudio } from '../lib/audio';
import {
  clampGliderProgress,
  getGliderStageFromProgress,
} from '../lib/delicaciesRules';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondDivider,
  DiamondStar,
  GoldCapsuleButton,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

interface OrderStatusScreenProps {
  orderId: string;
}

export const OrderStatusScreen: React.FC<OrderStatusScreenProps> = ({ orderId }) => {
  const orders = useDelicaciesStore((s) => s.orders);
  const updateOrderStatus = useDelicaciesStore((s) => s.updateOrderStatus);
  const resetToTab = useDelicaciesStore((s) => s.resetToTab);
  const sfxEnabled = useDelicaciesStore((s) => s.sfxEnabled);

  const order = orders.find((o) => o.id === orderId) ?? orders[0];
  const initialTotalSeconds = (order?.deliveryPoint.etaMinutes ?? 15) * 60;

  const [progress, setProgress] = useState<number>(
    order?.status === 'COMPLETED' ? 100 : 4
  );
  const [showQuestModal, setShowQuestModal] = useState(
    order?.status === 'COMPLETED'
  );
  const dispatchedRef = useRef(order?.status !== 'COOKING');
  const completedRef = useRef(order?.status === 'COMPLETED');
  const playedJingleRef = useRef(false);

  // Smooth continuous real-time Anemo Glider flight progress (0% -> 100%)
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

  useEffect(() => {
    if (showQuestModal && !playedJingleRef.current) {
      playedJingleRef.current = true;
      teyvatAudio.playSfx('quest_complete', sfxEnabled);
    }
  }, [showQuestModal, sfxEnabled]);

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
        <p className="font-genshin text-[#242735]">Pesanan tidak ditemukan</p>
        <div className="mt-4 w-full max-w-[240px]">
          <GoldCapsuleButton onClick={() => resetToTab('beranda')}>
            Kembali ke Beranda
          </GoldCapsuleButton>
        </div>
      </div>
    );
  }

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
      ? 'Menyiapkan hidangan di Dapur Wanmin'
      : stage === 1
      ? `Kurir Glider meluncur menuju ${order.deliveryPoint.region}`
      : `Mendarat sempurna di ${order.deliveryPoint.name}`;

  const statusSubcopy =
    stage === 0
      ? 'Chef Xiangling sedang meracik dan menyegel kehangatan hidangan.'
      : stage === 1
      ? `Arus angin Anemo membawa pesanan melewati langit menuju ${order.deliveryPoint.name}.`
      : 'Pesanan kuliner telah tiba hangat di titik pendaratan pilihanmu.';

  return (
    <div className="relative flex flex-col h-full bg-transparent overflow-hidden animate-stack-enter">
      {/* Slim Regal Header */}
      <header className="relative z-10 px-4 pt-3.5 pb-3 teyvat-chrome-bar border-b-2 border-[#C8A86B]/75 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-genshin text-[11px] text-[#C8D0E4] tabular-nums">
              {order.id}
            </p>
            <h1 className="font-genshin text-[17px] text-[#FFE7A5]">
              Pelacakan Kurir Glider
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-full teyvat-chrome-pill inline-flex items-center gap-1.5 font-genshin text-[12px] text-[#FFE7A5] tabular-nums">
            <Clock className="w-3.5 h-3.5 text-[#56E2B6]" />
            <span>{stage >= 2 ? 'Tiba · 100%' : `${mins}:${secs}`}</span>
          </div>
        </div>
      </header>

      {/* Edge-to-Edge Warm Parchment Scrollable Tracking Canvas */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8 space-y-4">
        {/* Continuous Horizontal Anemo Glider Flight Trajectory Card */}
        <section
          aria-label="Lintasan Terbang Kurir Glider Anemo"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-4 border-2 border-[#C8A86B]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9C5A14]">
                Lintasan Terbang Anemo · Real-Time
              </p>
              <h2 className="font-genshin text-[14.5px] text-[#242735] leading-snug mt-0.5">
                {statusHeadline}
              </h2>
              <p className="text-[11.5px] text-[#555A6E] mt-1 leading-relaxed">
                {statusSubcopy}
              </p>
            </div>
            <span className="font-genshin text-[13px] px-2.5 py-1 rounded-full bg-[#242B3E] border border-[#C8A86B] text-[#56E2B6] shrink-0 tabular-nums">
              {roundedPercent}%
            </span>
          </div>

          {/* Living Continuous Horizontal Flight Corridor */}
          <div
            className="rounded-2xl p-3.5 border border-[#C8A86B]/85 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #1E2E46 0%, #24475C 52%, #1E3E4B 100%)',
            }}
          >
            {/* Subtle Horizon Sky Glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, rgba(86, 226, 182, 0.22) 0%, transparent 65%)',
              }}
            />

            {/* Continuous Trajectory Slider Track */}
            <div className="relative z-10 h-14 flex items-center">
              {/* Origin Anchor (Left: Dapur Wanmin) */}
              <div
                className="w-7 h-7 rounded-full bg-[#242B3E] border border-[#FFE7A5] text-[#FFE7A5] flex items-center justify-center shrink-0 z-10 shadow"
                aria-label="Asal: Dapur Wanmin, Liyue"
              >
                <Flame className="w-3.5 h-3.5" />
              </div>

              {/* Continuous Glowing Flight Rail */}
              <div className="relative flex-1 mx-2 h-[6px] rounded-full bg-[#131C2B]/80 border border-[#FFE7A5]/30">
                {/* Filled Anemo-Gold Wind Wake */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-75 ease-linear"
                  style={{
                    width: `${progress}%`,
                    background:
                      'linear-gradient(90deg, #C87C24 0%, #FFE7A5 56%, #56E2B6 100%)',
                    boxShadow: '0 0 12px rgba(86, 226, 182, 0.55)',
                  }}
                />

                {/* Smoothly Gliding Anemo Glider Cursor */}
                <div
                  role="progressbar"
                  aria-label="Progres terbang Kurir Glider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={roundedPercent}
                  style={{
                    left: `${progress}%`,
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-[left] duration-75 ease-linear"
                >
                  {/* Trailing Anemo Wind Streaks while airborne */}
                  {progress > 4 && progress < 100 && (
                    <div
                      aria-hidden="true"
                      className="absolute right-full top-1/2 -translate-y-1/2 mr-1 flex flex-col gap-1 pointer-events-none"
                    >
                      <span className="block w-5 h-[1.5px] rounded-full bg-gradient-to-l from-[#56E2B6] to-transparent animate-wind-streak" />
                      <span
                        className="block w-3.5 h-[1.5px] rounded-full bg-gradient-to-l from-[#FFE7A5] to-transparent animate-wind-streak"
                        style={{ animationDelay: '0.28s' }}
                      />
                    </div>
                  )}

                  {/* Anemo Wing Glider Emblem */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      stage >= 2
                        ? 'bg-[#FFE7A5] border-[#FFFDF8] text-[#242735] shadow-[0_0_16px_rgba(255,231,165,0.8)]'
                        : 'bg-[#1D3546] border-[#56E2B6] text-[#56E2B6] animate-anemo-pulse'
                    }`}
                  >
                    {stage >= 2 ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Wind className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Destination Anchor (Right: Chosen Realm) */}
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 z-10 transition-colors ${
                  stage >= 2
                    ? 'bg-[#FFE7A5] border-[#FFFDF8] text-[#242735]'
                    : 'bg-[#242B3E] border-[#FFE7A5]/60 text-[#FFE7A5]'
                }`}
                aria-label={`Tujuan: ${order.deliveryPoint.name}`}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Aligned Origin -> Flight Telemetry -> Destination Caption */}
            <div className="relative z-10 mt-1.5 flex items-center justify-between text-[10px]">
              <div className="text-left">
                <div className="font-genshin text-[#FFF8E7]">Dapur Wanmin</div>
                <div className="text-[#B8D0DD]">Liyue · Asal</div>
              </div>
              <div className="text-center px-2">
                <div className="font-genshin text-[#56E2B6] tabular-nums">
                  {stage >= 2 ? 'Pendaratan Selesai' : `Tiba dalam ${mins}:${secs}`}
                </div>
                <div className="text-[#D4E6EF]">Jalur Angin Anemo</div>
              </div>
              <div className="text-right max-w-[104px]">
                <div className="font-genshin text-[#FFE7A5] truncate">
                  {order.deliveryPoint.region}
                </div>
                <div className="text-[#B8D0DD] truncate">Tujuan</div>
              </div>
            </div>
          </div>

          {/* Compact Phase Indicator Strip */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            {[
              { label: 'Dimasak', active: stage >= 0 },
              { label: 'Meluncur', active: stage >= 1 },
              { label: 'Tiba', active: stage >= 2 },
            ].map((phase) => (
              <div
                key={phase.label}
                className={`rounded-lg py-1.5 px-2 border font-genshin text-[10.5px] transition-colors ${
                  phase.active
                    ? 'bg-[#EFE6D2] border-[#C8A86B] text-[#242735]'
                    : 'bg-[#F5F1E7] border-[#DFD6C4] text-[#8B8578]'
                }`}
              >
                {phase.label}
              </div>
            ))}
          </div>

          {stage < 2 && (
            <button
              type="button"
              onClick={handleInstantDeliver}
              className="w-full min-h-[42px] rounded-xl bg-[#242B3E] border border-[#C8A86B] font-genshin text-[12px] text-[#FFE7A5] hover:bg-[#2F3A59] transition-colors"
            >
              Percepat Pendaratan Kurir Glider
            </button>
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
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9C5A14]">
                Tujuan Pengantaran · {order.deliveryPoint.region}
              </div>
              <div className="font-genshin text-[14px] text-[#242735]">
                {order.deliveryPoint.name}
              </div>
              <div className="text-[11px] text-[#575C70]">
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
          </div>

          {order.kitchenNotes && (
            <div className="rounded-xl bg-[#ECE5D8] border border-[#D4C7AE] px-3 py-2 text-[11px] text-[#4C5166]">
              <span className="font-genshin text-[#242735]">Catatan Chef Xiangling: </span>
              {order.kitchenNotes}
            </div>
          )}

          <div className="pt-2 border-t border-[#DED4C0] flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#575C70]">
              {order.paymentMethod === 'NORTHLAND_BANK_CARD'
                ? 'Lunas · Kartu Northland Bank'
                : 'Bayar Tunai saat Terima'}
            </span>
            <MoraAmount
              amount={order.totalMora}
              size="sm"
              showSuffix
              className="text-[#242735]"
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
          <div className="relative w-full max-w-[356px] rounded-[26px] overflow-hidden border-2 border-[#C8A86B] bg-[#FAF8F2] shadow-2xl animate-modal-enter text-[#242735]">
            {/* Top Ornamental Regal Crest Header */}
            <div className="relative teyvat-chrome-bar px-5 pt-5 pb-4 text-center border-b-2 border-[#C8A86B]">
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
                  Misi Kuliner Selesai
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
              <div className="rounded-2xl bg-[#EFEAE0] border border-[#D3BC8E] p-3.5 text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#565B6F]">
                  <span>Nomor Pesanan</span>
                  <span className="font-genshin text-[#242735] tabular-nums">
                    {order.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#565B6F]">
                  <span>Titik Antar</span>
                  <span className="font-genshin text-[#242735] truncate max-w-[175px]">
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
                  <span className="font-genshin text-[12px] text-[#242735]">
                    Total Transaksi
                  </span>
                  <MoraAmount
                    amount={order.totalMora}
                    size="sm"
                    showSuffix
                    className="text-[#242735]"
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
