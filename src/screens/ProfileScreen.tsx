import React from 'react';
import { PlusCircle, RotateCw, Volume2, VolumeX } from 'lucide-react';
import {
  ASSET_ICONS,
  COUPONS,
  DISHES,
  RARITY_META,
  formatMora,
} from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondBullet,
  DiamondDivider,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

export const ProfileScreen: React.FC = () => {
  const profile = useDelicaciesStore((s) => s.profile);
  const orders = useDelicaciesStore((s) => s.orders);
  const favoriteIds = useDelicaciesStore((s) => s.favoriteIds);
  const bgmEnabled = useDelicaciesStore((s) => s.bgmEnabled);
  const sfxEnabled = useDelicaciesStore((s) => s.sfxEnabled);
  const toggleBgm = useDelicaciesStore((s) => s.toggleBgm);
  const toggleSfx = useDelicaciesStore((s) => s.toggleSfx);
  const topUpMora = useDelicaciesStore((s) => s.topUpMora);
  const reorderFromHistory = useDelicaciesStore((s) => s.reorderFromHistory);
  const pushStack = useDelicaciesStore((s) => s.pushStack);

  const favoriteDishes = DISHES.filter((d) => favoriteIds.includes(d.id));

  return (
    <div className="flex flex-col h-full bg-[#171421]">
      {/* Compact Night-Sky Header */}
      <header className="px-4 pt-3.5 pb-2.5 bg-[#171421] shrink-0">
        <h1 className="font-genshin text-[17px] text-[#FFE7A5] tracking-wide">
          Lisensi Petualang
        </h1>
        <p className="text-[11px] text-[#BEB5D4]">
          Identitas Adventurers&apos; Guild, dompet Mora &amp; riwayat jamuan
        </p>
      </header>

      {/* Warm Parchment Main Sheet (65% Warm Parchment Balance) */}
      <div className="flex-1 min-h-0 px-2.5 pb-2">
        <div className="h-full rounded-[24px] bg-[#ECE5D8] border border-[#D3BC8E] ring-1 ring-[#5D5187]/45 overflow-y-auto px-3.5 pt-4 pb-16 space-y-4 text-[#232635]">
          {/* Adventurer License Card (Dark Night-Sky Crest Inset) */}
          <section
            aria-label="Kartu Lisensi Petualang"
            className="relative rounded-2xl overflow-hidden border border-[#C8A86B] bg-gradient-to-br from-[#2B2444] via-[#221D35] to-[#191528] p-4 text-[#FFF8E7]"
          >
            <img
              src={ASSET_ICONS.constellationBg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
            />

            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFE7A5] bg-[#171421] shrink-0">
                <TeyvatImage
                  src={profile.avatarUrl}
                  fallbackSrc={profile.fallbackAvatarUrl}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-genshin text-[17px] text-[#FFF8E7] truncate">
                  {profile.username}
                </h2>
                <p className="font-genshin text-[12px] text-[#CFC7DE] tabular-nums mt-0.5">
                  UID {profile.uid}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#FFE7A5]">
                  <TeyvatImage
                    src={ASSET_ICONS.crownOfInsight}
                    alt="Reputasi Knights of Favonius"
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <span className="truncate">{profile.reputationTitle}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 pt-3 border-t border-[#FFE7A5]/25 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] text-[#BEB5D4]">Adventure Rank</div>
                <div className="font-genshin text-[16px] text-[#FFE7A5] tabular-nums">
                  {profile.adventureRank}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#BEB5D4]">World Level</div>
                <div className="font-genshin text-[16px] text-[#FFE7A5] tabular-nums">
                  {profile.worldLevel}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#BEB5D4]">Total Pesanan</div>
                <div className="font-genshin text-[16px] text-[#FFE7A5] tabular-nums">
                  {orders.length}
                </div>
              </div>
            </div>
          </section>

          {/* Teyvat Wallet */}
          <section
            aria-labelledby="wallet-heading"
            className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 id="wallet-heading" className="font-genshin text-[14px] text-[#232635]">
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
                    className="text-[#232635]"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-[#ECE5D8] border border-[#D4C7AE] p-3">
                <div className="text-[11px] text-[#5B5F70]">Simpanan Primogem</div>
                <div className="font-genshin mt-1 inline-flex items-center gap-1.5 font-bold text-[15px] text-[#232635] tabular-nums">
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
                      <div className="font-genshin text-[12px] text-[#232635] truncate">
                        {coupon.title}
                      </div>
                      <div className="text-[11px] text-[#5B5F70] truncate">
                        Kode: <strong className="font-genshin text-[#9C5A14]">{coupon.code}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Audio Settings */}
          <section className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-3.5 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-genshin text-[13px] text-[#232635]">
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
                    ? 'bg-[#3B4255] border-[#3B4255] text-[#FFE7A5]'
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
                    ? 'bg-[#3B4255] border-[#3B4255] text-[#FFE7A5]'
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
                className="font-genshin text-[14px] text-[#232635] mb-2"
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
                      className="w-[120px] shrink-0 rounded-xl overflow-hidden border border-[#C8B490] bg-[#F5F2EB] text-left hover:border-[#9C5A14] transition-colors"
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
                        <div className="font-genshin text-[11px] text-[#232635] truncate">
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
              className="font-genshin text-[14px] text-[#232635]"
            >
              Riwayat Pesanan Kuliner
            </h2>

            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-3.5 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-genshin text-[12px] text-[#232635] tabular-nums">
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
                    className="text-[#232635]"
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
      </div>
    </div>
  );
};
