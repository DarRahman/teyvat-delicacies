import React, { useEffect, useRef, useState } from 'react';
import { Check, Clock, MapPin, Wind } from 'lucide-react';
import { ASSET_ICONS, formatMora } from '../data/dishes';
import { teyvatAudio } from '../lib/audio';
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
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#171421]">
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

  const milestones = [
    {
      title: 'Dimasak di Dapur Wanmin',
      subtitle: 'Chef Xiangling meracik bumbu segar',
    },
    {
      title: 'Kurir Glider Meluncur',
      subtitle: `Menuju ${order.deliveryPoint.name}`,
    },
    {
      title: 'Hidangan Tiba di Lokasi',
      subtitle: 'Selamat menikmati jamuan Teyvat',
    },
  ];

  const gliderPercent = stage === 0 ? '14%' : stage === 1 ? '54%' : '88%';

  return (
    <div className="relative flex flex-col h-full bg-[#171421] overflow-hidden animate-stack-enter">
      {/* Compact Night-Sky Header */}
      <header className="relative z-10 px-4 pt-4 pb-3 bg-[#171421] shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-genshin text-[11px] text-[#BEB5D4] tabular-nums">
              {order.id}
            </p>
            <h1 className="font-genshin text-[17px] text-[#FFE7A5]">
              Pelacakan Kurir Glider
            </h1>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-[#241F36] border border-[#FFE7A5]/70 inline-flex items-center gap-1.5 font-genshin text-[12px] text-[#FFE7A5] tabular-nums">
            <Clock className="w-3.5 h-3.5" />
            <span>{stage >= 2 ? 'Tiba' : `${mins}:${secs}`}</span>
          </div>
        </div>
      </header>

      {/* Warm Parchment Tracking Sheet */}
      <div className="relative z-10 flex-1 min-h-0 px-2.5 pb-3">
        <div className="h-full rounded-[24px] bg-[#ECE5D8] border border-[#D3BC8E] ring-1 ring-[#5D5187]/45 overflow-y-auto px-3.5 pt-4 pb-8 space-y-4 text-[#232635]">
          {/* Glider Route Visual Track */}
          <section className="rounded-2xl bg-[#221D33] border border-[#C8A86B] p-4 text-[#FFF8E7]">
            <div className="flex items-center justify-between text-[11px] text-[#CFC7DE] mb-4">
              <span>Dapur Teyvat</span>
              <span className="font-genshin text-[#FFE7A5]">
                {stage === 0
                  ? 'Menyiapkan hidangan...'
                  : stage === 1
                  ? 'Kurir Glider di udara'
                  : 'Pendaratan sempurna'}
              </span>
              <span>{order.deliveryPoint.region}</span>
            </div>

            <div className="relative h-14 flex items-center">
              <div className="w-full h-1.5 rounded-full bg-[#151222] overflow-hidden border border-[#5D5187]/50">
                <div
                  className="h-full bg-gradient-to-r from-[#C87C24] via-[#FFE7A5] to-[#ECE5D8] transition-all duration-700"
                  style={{
                    width: stage === 0 ? '20%' : stage === 1 ? '62%' : '100%',
                  }}
                />
              </div>

              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-700"
                style={{ left: gliderPercent }}
              >
                <div
                  className="w-10 h-10 rounded-full bg-[#2B2444] border-2 border-[#FFE7A5] flex items-center justify-center animate-glider"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(255, 231, 165, 0.35) 0%, #2B2444 75%)',
                  }}
                >
                  <Wind className="w-5 h-5 text-[#FFE7A5]" />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {milestones.map((m, idx) => {
                const done = stage >= idx;
                const current = stage === idx;
                return (
                  <div key={m.title} className="flex items-start gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                        done
                          ? 'bg-[#FFE7A5] border-[#FFE7A5] text-[#232635]'
                          : 'bg-[#171421] border-[#5D5187] text-[#7D7499]'
                      }`}
                    >
                      {done ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <DiamondBullet size={6} className="text-[#7D7499]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-genshin text-[12.5px] ${
                          current
                            ? 'text-[#FFE7A5]'
                            : done
                            ? 'text-[#FFF8E7]'
                            : 'text-[#8B82A3]'
                        }`}
                      >
                        {m.title}
                      </div>
                      <div className="text-[11px] text-[#BEB5D4]">{m.subtitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {stage < 2 && (
              <button
                type="button"
                onClick={handleInstantDeliver}
                className="mt-4 w-full min-h-[40px] rounded-xl bg-[#2E2747] border border-[#FFE7A5]/60 font-genshin text-[12px] text-[#FFE7A5] hover:bg-[#3A3159] transition-colors"
              >
                Percepat Pendaratan Kurir Glider
              </button>
            )}
          </section>

          {/* Delivery Dossier Summary */}
          <section className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-4 space-y-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#9C5A14] shrink-0 mt-0.5" />
              <div>
                <div className="font-genshin text-[13px] text-[#232635]">
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
      </div>

      {/* LEGENDARY GOLDEN-FRAMED PARCHMENT MODAL: QUEST COMPLETE */}
      {showQuestModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quest-complete-title"
          className="absolute inset-0 z-40 bg-[#0D0A16]/78 backdrop-blur-sm flex items-center justify-center p-5"
        >
          <div className="relative w-full max-w-[356px] rounded-[26px] overflow-hidden border-2 border-[#FFE7A5] ring-1 ring-[#5D5187] bg-[#ECE5D8] shadow-2xl animate-modal-enter text-[#232635]">
            {/* Top Ornamental Night-Sky Crest Header */}
            <div className="relative bg-[#1F1B30] px-5 pt-5 pb-4 text-center border-b-2 border-[#D3BC8E]">
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

            {/* Warm Parchment Modal Body */}
            <div className="p-5 text-center space-y-4">
              <div className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-3.5 text-left space-y-2">
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
