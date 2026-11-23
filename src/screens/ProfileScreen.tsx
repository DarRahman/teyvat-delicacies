import React, { useState } from 'react';
import {
  Check,
  Image as ImageIcon,
  PlusCircle,
  RotateCw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  ASSET_ICONS,
  COUPONS,
  DISHES,
  NAMECARDS,
  RARITY_META,
  formatMora,
} from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondBullet,
  DiamondDivider,
  GoldCapsuleButton,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

export const ProfileScreen: React.FC = () => {
  const profile = useDelicaciesStore((s) => s.profile);
  const selectedNamecardId = useDelicaciesStore((s) => s.selectedNamecardId);
  const setSelectedNamecard = useDelicaciesStore((s) => s.setSelectedNamecard);
  const orders = useDelicaciesStore((s) => s.orders);
  const favoriteIds = useDelicaciesStore((s) => s.favoriteIds);
  const bgmEnabled = useDelicaciesStore((s) => s.bgmEnabled);
  const sfxEnabled = useDelicaciesStore((s) => s.sfxEnabled);
  const toggleBgm = useDelicaciesStore((s) => s.toggleBgm);
  const toggleSfx = useDelicaciesStore((s) => s.toggleSfx);
  const topUpMora = useDelicaciesStore((s) => s.topUpMora);
  const reorderFromHistory = useDelicaciesStore((s) => s.reorderFromHistory);
  const pushStack = useDelicaciesStore((s) => s.pushStack);

  const [isNamecardModalOpen, setIsNamecardModalOpen] = useState(false);

  const activeNamecard =
    NAMECARDS.find((n) => n.id === selectedNamecardId) ?? NAMECARDS[0];
  const favoriteDishes = DISHES.filter((d) => favoriteIds.includes(d.id));

  return (
    <div className="relative flex flex-col h-full bg-transparent">
      {/* Clean Genshin Header (Zero brown border line) */}
      <header className="px-4 pt-3.5 pb-3 teyvat-chrome-bar shrink-0 flex items-center justify-between gap-2">
        <div>
          <h1 className="font-genshin text-[17px] text-[#FFE7A5] tracking-wide">
            Lisensi Petualang
          </h1>
          <p className="text-[11px] text-[#C8D0E4]">
            Adventurers&apos; Guild · Koleksi Namecard &amp; riwayat jamuan
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNamecardModalOpen(true)}
          className="teyvat-gold-btn min-h-[34px] px-3 py-1 rounded-full font-genshin text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Ganti Namecard</span>
        </button>
      </header>

      {/* Edge-to-Edge Warm Antique Parchment Scrollable Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-16 space-y-4">
        {/* Authentic In-Game Adventurer Namecard Showcase (Symmetrical Full-Bleed Corners) */}
        <section
          aria-label="Kartu Namecard Petualang"
          className="rounded-2xl overflow-hidden border-2 border-[#C8A86B] shadow-[0_6px_18px_rgba(74,58,30,0.14)] bg-[#FAF8F2]"
        >
          {/* Symmetrical Full-Bleed Namecard Banner (zoomed cleanly to crop built-in PNG right curve) */}
          <div className="relative h-[132px] w-full overflow-hidden bg-[#242C42]">
            <img
              src={activeNamecard.bgImage}
              alt={`Namecard ${activeNamecard.name}`}
              className="absolute inset-0 w-full h-full object-cover object-center scale-[1.22] pointer-events-none select-none"
            />
            {/* Measured left readability fade preserving vivid Namecard artwork across center & right */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#1A2133]/82 via-[#1A2133]/35 to-transparent pointer-events-none"
            />

            <div className="relative z-10 h-full px-4 py-3.5 flex items-center gap-3.5">
              <div className="w-[62px] h-[62px] rounded-full overflow-hidden border-2 border-[#FFE7A5] bg-[#1E263A] shadow-lg shrink-0">
                <TeyvatImage
                  src={profile.avatarUrl}
                  fallbackSrc={profile.fallbackAvatarUrl}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#192032]/78 border border-[#FFE7A5]/55 text-[10px] font-genshin text-[#FFE7A5] mb-1">
                  <span className="truncate">{activeNamecard.name}</span>
                </div>
                <h2 className="font-genshin text-[18px] text-[#FFFDF5] leading-tight truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  {profile.username}
                </h2>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#F7F1E3] drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
                  <TeyvatImage
                    src={ASSET_ICONS.crownOfInsight}
                    alt="Reputasi Knights of Favonius"
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <span className="truncate">{profile.reputationTitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warm Ivory Adventurer Stat Strip */}
          <div className="px-3.5 py-3 bg-[#FAF8F2] border-t border-[#D3BC8E] grid grid-cols-4 gap-2">
            <div className="rounded-xl bg-[#EFEAE0] border border-[#D3BC8E] px-2 py-1.5 text-center">
              <div className="text-[9.5px] font-semibold text-[#6B5A3E] uppercase tracking-wider">
                UID
              </div>
              <div className="font-genshin text-[11px] text-[#242735] tabular-nums truncate mt-0.5">
                {profile.uid}
              </div>
            </div>
            <div className="rounded-xl bg-[#EFEAE0] border border-[#D3BC8E] px-2 py-1.5 text-center">
              <div className="text-[9.5px] font-semibold text-[#6B5A3E] uppercase tracking-wider">
                AR
              </div>
              <div className="font-genshin text-[14px] text-[#9C5A14] tabular-nums mt-0.5">
                {profile.adventureRank}
              </div>
            </div>
            <div className="rounded-xl bg-[#EFEAE0] border border-[#D3BC8E] px-2 py-1.5 text-center">
              <div className="text-[9.5px] font-semibold text-[#6B5A3E] uppercase tracking-wider">
                WL
              </div>
              <div className="font-genshin text-[14px] text-[#9C5A14] tabular-nums mt-0.5">
                {profile.worldLevel}
              </div>
            </div>
            <div className="rounded-xl bg-[#EFEAE0] border border-[#D3BC8E] px-2 py-1.5 text-center">
              <div className="text-[9.5px] font-semibold text-[#6B5A3E] uppercase tracking-wider">
                Pesanan
              </div>
              <div className="font-genshin text-[14px] text-[#2D6E4E] tabular-nums mt-0.5">
                {orders.length}
              </div>
            </div>
          </div>
        </section>

        {/* Teyvat Wallet (Luminous Ivory Card) */}
        <section
          aria-labelledby="wallet-heading"
          className="rounded-2xl teyvat-ivory-card p-4 space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="wallet-heading" className="font-genshin text-[14px] text-[#242735]">
              Dompet Teyvat
            </h2>
            <button
              type="button"
              onClick={() => topUpMora(50000)}
              className="min-h-[32px] px-2.5 py-1 rounded-full bg-[#ECE5D8] border border-[#C8A86B] font-genshin text-[11px] text-[#3B4255] inline-flex items-center gap-1 hover:border-[#9C5A14] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#9C5A14]" />
              <span>Klaim 50k Mora</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[#ECE5D8] border border-[#D4C7AE] p-3">
              <div className="text-[11px] text-[#5B5F70]">Saldo Mora</div>
              <div className="mt-1">
                <MoraAmount
                  amount={profile.moraBalance}
                  size="md"
                  className="text-[#242735]"
                />
              </div>
            </div>

            <div className="rounded-xl bg-[#ECE5D8] border border-[#D4C7AE] p-3">
              <div className="text-[11px] text-[#5B5F70]">Simpanan Primogem</div>
              <div className="font-genshin mt-1 inline-flex items-center gap-1.5 font-bold text-[15px] text-[#242735] tabular-nums">
                <TeyvatImage
                  src={ASSET_ICONS.primogem}
                  fallbackSrc={ASSET_ICONS.primogemCdn}
                  alt="Primogem"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span>{formatMora(profile.primogemBalance)}</span>
              </div>
            </div>
          </div>

          <DiamondDivider />

          {/* Active Delivery Vouchers */}
          <div>
            <div className="font-genshin text-[11px] text-[#4E5366] mb-2">
              Voucher Pengantaran Aktif
            </div>
            <div className="space-y-2">
              {COUPONS.map((coupon) => (
                <div
                  key={coupon.code}
                  className="rounded-xl bg-[#ECE5D8] border border-[#D4C7AE] px-3 py-2 flex items-center gap-2.5"
                >
                  <TeyvatImage
                    src={coupon.icon}
                    alt={coupon.title}
                    className="w-7 h-7 object-contain shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-genshin text-[12px] text-[#242735] truncate">
                      {coupon.title}
                    </div>
                    <div className="text-[11px] text-[#5B5F70] truncate">
                      Kode:{' '}
                      <strong className="font-genshin text-[#9C5A14]">{coupon.code}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audio Settings */}
        <section className="rounded-2xl teyvat-ivory-card p-3.5 flex items-center justify-between gap-2">
          <div>
            <h2 className="font-genshin text-[13px] text-[#242735]">
              Pengaturan Audio Teyvat
            </h2>
            <p className="text-[11px] text-[#5B5F70]">
              Musik latar ambien &amp; efek suara pesanan
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleBgm}
              className={`min-h-[36px] px-3 rounded-lg border font-genshin text-[11px] inline-flex items-center gap-1 transition-colors ${
                bgmEnabled
                  ? 'bg-[#242B3E] border-[#C8A86B] text-[#FFE7A5]'
                  : 'bg-[#ECE5D8] border-[#CBB997] text-[#4A4F63]'
              }`}
            >
              {bgmEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>BGM</span>
            </button>
            <button
              type="button"
              onClick={toggleSfx}
              className={`min-h-[36px] px-3 rounded-lg border font-genshin text-[11px] inline-flex items-center gap-1 transition-colors ${
                sfxEnabled
                  ? 'bg-[#242B3E] border-[#C8A86B] text-[#FFE7A5]'
                  : 'bg-[#ECE5D8] border-[#CBB997] text-[#4A4F63]'
              }`}
            >
              <span>SFX</span>
            </button>
          </div>
        </section>

        {/* Saved Favorites */}
        {favoriteDishes.length > 0 && (
          <section aria-labelledby="favorites-heading">
            <h2
              id="favorites-heading"
              className="font-genshin text-[14.5px] text-[#242735] mb-2.5"
            >
              Hidangan Favorit ({favoriteDishes.length})
            </h2>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {favoriteDishes.map((dish) => {
                const rarityStyle = RARITY_META[dish.rarity];
                return (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => pushStack({ name: 'dish', dishId: dish.id })}
                    className="w-[122px] shrink-0 rounded-xl overflow-hidden teyvat-ivory-card text-left hover:border-[#C87C24] transition-colors"
                  >
                    <div
                      className="relative h-14 flex items-center justify-center p-1 overflow-hidden"
                      style={{ background: rarityStyle.gradient }}
                    >
                      <img
                        src={rarityStyle.bgAsset}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{ opacity: 0.35, mixBlendMode: 'overlay' }}
                      />
                      <div
                        className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle at center, rgba(255, 231, 165, 0.42) 0%, transparent 68%)',
                        }}
                      >
                        <TeyvatImage
                          src={dish.image}
                          fallbackSrc={dish.fallbackImage}
                          alt={dish.name}
                          className="w-11 h-11 object-contain drop-shadow"
                        />
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="font-genshin text-[11px] text-[#242735] truncate">
                        {dish.name}
                      </div>
                      <div className="font-genshin text-[10px] text-[#6B4A1B] tabular-nums mt-0.5">
                        {formatMora(dish.priceMora)} Mora
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Order History List */}
        <section aria-labelledby="order-history-heading" className="space-y-2.5">
          <h2
            id="order-history-heading"
            className="font-genshin text-[14.5px] text-[#242735]"
          >
            Riwayat Pesanan Kuliner
          </h2>

          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl teyvat-ivory-card p-3.5 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-genshin text-[12px] text-[#242735] tabular-nums">
                    {order.id}
                  </div>
                  <div className="text-[11px] text-[#5C6072] mt-0.5">
                    {order.createdAt} · {order.deliveryPoint.name}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D6E4E] shrink-0">
                  <DiamondBullet size={6} className="text-[#2D6E4E]" />
                  <span>
                    {order.status === 'COMPLETED' ? 'Terkirim' : 'Dalam Pengantaran'}
                  </span>
                </span>
              </div>

              <div className="text-[12px] text-[#3F4456] space-y-0.5">
                {order.items.map((item) => (
                  <div
                    key={item.dish.id}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="font-genshin truncate pr-2 text-[#2B2D3A]">
                      {item.dish.name} ×{item.quantity}
                    </span>
                    <span className="font-genshin tabular-nums shrink-0 text-[#4A4F63]">
                      {formatMora(item.dish.priceMora * item.quantity)} Mora
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#DED4C0] flex items-center justify-between gap-2">
                <MoraAmount
                  amount={order.totalMora}
                  size="sm"
                  showSuffix
                  className="text-[#242735]"
                />
                <button
                  type="button"
                  onClick={() => reorderFromHistory(order.id)}
                  className="teyvat-gold-btn min-h-[36px] px-3.5 py-1.5 rounded-full font-genshin text-[11px] font-bold inline-flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Pesan Lagi</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* WARM PARCHMENT COLLECTIBLE NAMECARD MODAL (Pure Unobstructed Artwork Options) */}
      {isNamecardModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="namecard-modal-title"
          className="absolute inset-0 z-50 bg-[#1B2234]/68 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-[388px] max-h-[88%] rounded-[24px] overflow-hidden border border-[#D3BC8E] bg-[#ECE5D8] shadow-2xl flex flex-col animate-modal-enter">
            {/* Clean Genshin Modal Header */}
            <div className="px-4 py-3.5 teyvat-chrome-bar flex items-center justify-between gap-2 shrink-0">
              <div>
                <h2
                  id="namecard-modal-title"
                  className="font-genshin text-[15px] text-[#FFE7A5]"
                >
                  Koleksi Namecard Teyvat
                </h2>
                <p className="text-[11px] text-[#C8D0E4]">
                  Ketuk gambar untuk memasang spanduk profil
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNamecardModalOpen(false)}
                aria-label="Tutup pilihan Namecard"
                className="w-9 h-9 rounded-full bg-white/[0.08] text-[#FFE7A5] flex items-center justify-center hover:bg-white/[0.15] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Selected Symmetrical Banner Preview (Shows active Namecard title & subtitle cleanly) */}
            <div className="px-4 pt-3.5 shrink-0">
              <div className="relative h-[82px] rounded-xl overflow-hidden border border-[#D3BC8E] bg-[#242C42] shadow-sm">
                <img
                  src={activeNamecard.bgImage}
                  alt={activeNamecard.name}
                  className="absolute inset-0 w-full h-full object-cover object-center scale-[1.22]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C2336]/86 via-[#1C2336]/38 to-transparent" />
                <div className="relative z-10 h-full px-3.5 flex flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#FFE7A5] font-semibold">
                    Dipasang · {activeNamecard.region}
                  </span>
                  <span className="font-genshin text-[14px] text-[#FFFDF5]">
                    {activeNamecard.name}
                  </span>
                  <span className="text-[10.5px] text-[#E6EBF5] truncate">
                    {activeNamecard.subtitle}
                  </span>
                </div>
              </div>
            </div>

            {/* 2-Column Pure Visual Namecard Artwork Grid (Zero text covering art, full height guaranteed) */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                {NAMECARDS.map((card) => {
                  const isSelected = card.id === activeNamecard.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedNamecard(card.id)}
                      aria-label={card.name}
                      aria-pressed={isSelected}
                      className={`relative h-[76px] w-full rounded-xl overflow-hidden bg-[#242C42] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A86B] shadow-sm ${
                        isSelected
                          ? 'ring-2 ring-[#C87C24] border-2 border-[#FFE7A5] scale-[1.01]'
                          : 'border border-[#D3BC8E] hover:border-[#9C5A14]'
                      }`}
                    >
                      <img
                        src={card.bgImage}
                        alt={card.name}
                        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.24] pointer-events-none select-none"
                      />
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#FFE7A5] border border-[#9C5A14] text-[#242735] flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Warm Parchment Modal Footer */}
            <div className="px-4 py-3 bg-[#F4EFE4] border-t border-[#E2D8C5] shrink-0">
              <GoldCapsuleButton onClick={() => setIsNamecardModalOpen(false)}>
                Terapkan Namecard
              </GoldCapsuleButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
