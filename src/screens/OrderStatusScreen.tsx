import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock, Flame, MapPin, Wind } from 'lucide-react';
import { ASSET_ICONS, formatMora } from '../data/dishes';
import { teyvatAudio } from '../lib/audio';
import { getGliderProgressPercent } from '../lib/delicaciesRules';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondBullet,
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

  const [stage, setStage] = useState<0 | 1 | 2>(
    order?.status === 'COMPLETED' ? 2 : 0
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    (order?.deliveryPoint.etaMinutes ?? 15) * 60
  );
  const [showQuestModal, setShowQuestModal] = useState(
    order?.status === 'COMPLETED'
  );
  const playedJingleRef = useRef(false);

  useEffect(() => {
    if (!order || order.status === 'COMPLETED') return;

    const timerDispatch = window.setTimeout(() => {
      setStage(1);
      updateOrderStatus(order.id, 'GLIDER_DISPATCHED');
    }, 1800);

    const timerComplete = window.setTimeout(() => {
      setStage(2);
      setRemainingSeconds(0);
      updateOrderStatus(order.id, 'COMPLETED');
      setShowQuestModal(true);
    }, 4600);

    return () => {
      window.clearTimeout(timerDispatch);
      window.clearTimeout(timerComplete);
    };
  }, [order?.id]);

  useEffect(() => {
    if (stage >= 2) return;
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (showQuestModal && !playedJingleRef.current) {
      playedJingleRef.current = true;
      teyvatAudio.playSfx('quest_complete', sfxEnabled);
    }
  }, [showQuestModal, sfxEnabled]);

  const handleInstantDeliver = () => {
    if (!order) return;
    setStage(2);
    setRemainingSeconds(0);
    updateOrderStatus(order.id, 'COMPLETED');
    setShowQuestModal(true);
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-transparent">
        <p className="font-genshin text-[#FFE7A5]">Pesanan tidak ditemukan</p>
        <div className="mt-4 w-full max-w-[240px]">
          <GoldCapsuleButton onClick={() => resetToTab('beranda')}>
            Kembali ke Beranda
          </GoldCapsuleButton>
        </div>
      </div>
    );
  }

  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');
  const progressPercent = getGliderProgressPercent(stage);

  const milestones = [
    {
      title: 'Dimasak di Dapur Wanmin',
      subtitle: 'Chef Xiangling meracik bumbu segar',
    },
    {
      title: 'Kurir Glider Meluncur',
      subtitle: `Melintasi langit menuju ${order.deliveryPoint.name}`,
    },
    {
      title: 'Hidangan Tiba di Lokasi',
      subtitle: `Mendarat sempurna di ${order.deliveryPoint.region}`,
    },
  ];

  return (
    <div className="relative flex flex-col h-full bg-transparent overflow-hidden animate-stack-enter">
      {/* Translucent Glassmorphic Header */}
      <header className="relative z-10 px-4 pt-3.5 pb-3 hoyolab-glass-bar border-b border-[#FFE7A5]/25 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-genshin text-[11px] text-[#C2CAE0] tabular-nums">
              {order.id}
            </p>
            <h1 className="font-genshin text-[17px] text-[#FFE7A5]">
              Pelacakan Kurir Glider
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-full hoyolab-stat-badge inline-flex items-center gap-1.5 font-genshin text-[12px] text-[#FFE7A5] tabular-nums">
            <Clock className="w-3.5 h-3.5 text-[#56E2B6]" />
            <span>{stage >= 2 ? 'Tiba · 100%' : `${mins}:${secs}`}</span>
          </div>
        </div>
      </header>

      {/* Full-Bleed Scrollable Tracking Canvas */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8 space-y-4">
        {/* Precise 3-Point Glider Courier Progress Card */}
        <section
          aria-label="Progres Kurir Glider 3 Titik"
          className="rounded-2xl hoyolab-glass-bar border border-[#FFE7A5]/35 p-4 text-[#FFF8E7] shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10.5px] uppercase tracking-wider text-[#BFC8DF]">
                Status Pengantaran
              </p>
              <p className="font-genshin text-[14px] text-[#FFE7A5] mt-0.5">
                {stage === 0
                  ? 'Menyiapkan hidangan di Dapur Wanmin...'
                  : stage === 1
                  ? 'Kurir Glider meluncur di udara'
                  : 'Pendaratan sempurna di tujuan'}
              </p>
            </div>
            <span className="font-genshin text-[12px] px-2.5 py-1 rounded-full bg-[#161B2A]/80 border border-[#56E2B6]/45 text-[#56E2B6] tabular-nums">
              {progressPercent}%
            </span>
          </div>

          {/* Balanced 3-Point Waypoint Progress Track (0% -> 50% -> 100% Exact Fill) */}
          <div className="pt-2 pb-1">
            <div className="relative h-12 flex items-center">
              {/* Background Track spanning strictly from Node 1 center (20px) to Node 3 center (calc(100% - 20px)) */}
              <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2 h-[4px] rounded-full bg-[#131826] border border-[#FFE7A5]/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C87C24] via-[#FFE7A5] to-[#56E2B6] transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 3 Anchored Waypoint Nodes: 0%, 50%, 100% */}
              <div className="relative z-10 w-full flex items-center justify-between">
                {/* Node 1 (0%): Dapur Teyvat / Wanmin Kitchen */}
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    stage >= 0
                      ? 'bg-[#262F48] border-[#FFE7A5] text-[#FFE7A5] shadow-[0_0_12px_rgba(255,231,165,0.35)]'
                      : 'bg-[#161B2A] border-[#5D698A] text-[#8E98B3]'
                  }`}
                  aria-label="Titik 1: Dapur Teyvat"
                >
                  <Flame className="w-4 h-4" />
                </div>

                {/* Node 2 (50%): Glider Courier Airborne — Centered directly on the gold line */}
                <div
                  className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    stage === 1
                      ? 'bg-[#213344] border-[#56E2B6] text-[#56E2B6] animate-anemo-pulse'
                      : stage >= 2
                      ? 'bg-[#262F48] border-[#FFE7A5] text-[#56E2B6] shadow-[0_0_12px_rgba(86,226,182,0.45)]'
                      : 'bg-[#161B2A] border-[#5D698A]/70 text-[#8E98B3]'
                  }`}
                  aria-label="Titik 2: Kurir Glider di Udara"
                >
                  <Wind className="w-5 h-5" />
                </div>

                {/* Node 3 (100%): Destination Waypoint */}
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    stage >= 2
                      ? 'bg-[#FFE7A5] border-[#FFFDF8] text-[#232635] shadow-[0_0_16px_rgba(255,231,165,0.65)]'
                      : 'bg-[#161B2A] border-[#5D698A]/70 text-[#8E98B3]'
                  }`}
                  aria-label={`Titik 3: ${order.deliveryPoint.name}`}
                >
                  {stage >= 2 ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Aligned Labels Under the 3 Nodes */}
            <div className="grid grid-cols-3 gap-1 mt-2 text-[10.5px]">
              <div className="text-left">
                <div className="font-genshin text-[#FFF8E7]">Dapur Wanmin</div>
                <div className="text-[#AEB8D1] text-[9.5px]">Liyue · 0%</div>
              </div>
              <div className="text-center">
                <div
                  className={`font-genshin ${
                    stage === 1 ? 'text-[#56E2B6]' : 'text-[#FFF8E7]'
                  }`}
                >
                  Kurir Glider
                </div>
                <div className="text-[#AEB8D1] text-[9.5px]">Di Udara · 50%</div>
              </div>
              <div className="text-right">
                <div
                  className={`font-genshin truncate ${
                    stage >= 2 ? 'text-[#FFE7A5]' : 'text-[#DCE2F2]'
                  }`}
                >
                  {order.deliveryPoint.region}
                </div>
                <div className="text-[#AEB8D1] text-[9.5px] truncate">
                  Tujuan · 100%
                </div>
              </div>
            </div>
          </div>

          <DiamondDivider dark />

          {/* Detailed Step Log */}
          <div className="space-y-2.5">
            {milestones.map((m, idx) => {
              const done = stage >= idx;
              const current = stage === idx;
              return (
                <div key={m.title} className="flex items-start gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                      done
                        ? 'bg-[#FFE7A5] border-[#FFE7A5] text-[#232635]'
                        : 'bg-[#161B2A] border-[#5D698A] text-[#7D87A3]'
                    }`}
                  >
                    {done ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <DiamondBullet size={6} className="text-[#7D87A3]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`font-genshin text-[12.5px] ${
                        current
                          ? 'text-[#FFE7A5]'
                          : done
                          ? 'text-[#FFF8E7]'
                          : 'text-[#96A0BA]'
                      }`}
                    >
                      {m.title}
                    </div>
                    <div className="text-[11px] text-[#C2CAE0]">{m.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {stage < 2 && (
            <button
              type="button"
              onClick={handleInstantDeliver}
              className="w-full min-h-[42px] rounded-xl bg-[#27314B] border border-[#FFE7A5]/65 font-genshin text-[12px] text-[#FFE7A5] hover:bg-[#313D5D] transition-colors"
            >
              Percepat Pendaratan Kurir Glider
            </button>
          )}
        </section>

        {/* Clean Ivory Parchment Order Receipt Card */}
        <section
          aria-label="Struk Pesanan Kuliner"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-3 shadow-lg"
        >
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#9C5A14] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9C5A14]">
                Tujuan Pengantaran · {order.deliveryPoint.region}
              </div>
              <div className="font-genshin text-[14px] text-[#232635]">
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
              <span className="font-genshin text-[#232635]">Catatan Chef Xiangling: </span>
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
              className="text-[#232635]"
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
          className="absolute inset-0 z-40 bg-[#121622]/80 backdrop-blur-sm flex items-center justify-center p-5"
        >
          <div className="relative w-full max-w-[356px] rounded-[26px] overflow-hidden border-2 border-[#FFE7A5] bg-[#F7F4EE] shadow-2xl animate-modal-enter text-[#232635]">
            {/* Top Ornamental Midnight Slate Crest Header */}
            <div className="relative bg-[#1E2538] px-5 pt-5 pb-4 text-center border-b-2 border-[#D3BC8E]">
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
                  className="font-genshin text-[19px] leading-snug text-[#FFF8E7] mt-1"
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
                  <span className="font-genshin text-[#232635] tabular-nums">
                    {order.id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#565B6F]">
                  <span>Titik Antar</span>
                  <span className="font-genshin text-[#232635] truncate max-w-[175px]">
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
                  <span className="font-genshin text-[12px] text-[#232635]">
                    Total Transaksi
                  </span>
                  <MoraAmount
                    amount={order.totalMora}
                    size="sm"
                    showSuffix
                    className="text-[#232635]"
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
