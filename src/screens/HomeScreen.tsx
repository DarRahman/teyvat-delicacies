import React from 'react';
import { ArrowRight, Plus, Volume2, VolumeX } from 'lucide-react';
import {
  ASSET_ICONS,
  BUFF_META,
  DISHES,
  TOP_RECOMMENDATION_IDS,
} from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { BuffType, DishCategory } from '../types';
import {
  BuffBadge,
  DiamondDivider,
  DiamondStar,
  GoldCapsuleButton,
  MoraAmount,
  RarityDishBanner,
  TeyvatImage,
} from '../components/TeyvatUI';

export const HomeScreen: React.FC = () => {
  const profile = useDelicaciesStore((s) => s.profile);
  const bgmEnabled = useDelicaciesStore((s) => s.bgmEnabled);
  const toggleBgm = useDelicaciesStore((s) => s.toggleBgm);
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const pushStack = useDelicaciesStore((s) => s.pushStack);
  const setActiveTab = useDelicaciesStore((s) => s.setActiveTab);
  const openCatalogWithFilter = useDelicaciesStore((s) => s.openCatalogWithFilter);

  const featuredDish = DISHES.find((d) => d.id === 5101) ?? DISHES[0];
  const topFive = TOP_RECOMMENDATION_IDS.map((id) =>
    DISHES.find((d) => d.id === id)
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  const quickShortcuts: Array<{
    label: string;
    subtitle: string;
    icon: string;
    fallbackIcon?: string;
    action: () => void;
  }> = [
    {
      label: 'Menu Utama',
      subtitle: 'Santapan utama',
      icon: '/assets/dishes/sweet_madame.png',
      action: () => openCatalogWithFilter({ category: 'Main Dish' as DishCategory }),
    },
    {
      label: 'Camilan',
      subtitle: 'Kudapan penjelajah',
      icon: '/assets/dishes/tri_color_dango.png',
      action: () => openCatalogWithFilter({ category: 'Snacks' as DishCategory }),
    },
    {
      label: 'Minuman',
      subtitle: 'Segar khas Teyvat',
      icon: '/assets/dishes/dango_milk.png',
      action: () => openCatalogWithFilter({ category: 'Beverages' as DishCategory }),
    },
    {
      label: 'ATK Boost',
      subtitle: 'Khasiat tempur',
      icon: BUFF_META.ATK.icon,
      fallbackIcon: BUFF_META.ATK.fallbackIcon,
      action: () => openCatalogWithFilter({ buff: 'ATK' as BuffType }),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Clean Genshin Charcoal-Indigo Traveler Header (No brown line, borderless Mora HUD) */}
      <header className="px-4 pt-3.5 pb-3 teyvat-chrome-bar shrink-0">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className="flex items-center gap-2.5 min-w-0 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] rounded-xl pr-1"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-[1.5px] border-[#FFE7A5]/85 bg-[#252D44] shrink-0">
              <TeyvatImage
                src={profile.avatarUrl}
                fallbackSrc={profile.fallbackAvatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10.5px] text-[#C8D0E4] leading-tight truncate">
                Traveler · AR {profile.adventureRank}
              </p>
              <h1 className="font-genshin text-[14.5px] text-[#FFF8E7] leading-tight truncate group-hover:text-[#FFE7A5] transition-colors">
                {profile.username}
              </h1>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('profil')}
              className="min-h-[36px] px-1 py-1 flex items-center gap-1 hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] rounded-lg"
              title="Saldo Mora Aktif"
            >
              <MoraAmount amount={profile.moraBalance} size="sm" className="text-[#FFE7A5]" />
            </button>

            <button
              type="button"
              onClick={toggleBgm}
              aria-label={bgmEnabled ? 'Matikan musik latar' : 'Nyalakan musik latar'}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                bgmEnabled
                  ? 'bg-[#FFE7A5]/16 text-[#FFE7A5]'
                  : 'bg-white/[0.06] text-[#B6C0D9] hover:text-[#FFE7A5]'
              }`}
            >
              {bgmEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Edge-to-Edge Warm Antique Parchment Scrollable Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-24 space-y-5">
        {/* Culinary Festival Hero Card (Warm Gold Banner + Luminous Ivory Footer) */}
        <section
          aria-label="Banner Festival Kuliner Teyvat"
          className="relative rounded-2xl overflow-hidden border border-[#C8A86B] shadow-[0_6px_18px_rgba(74,58,30,0.14)] bg-[#FAF8F2]"
        >
          <div
            className="relative px-4 pt-4 pb-4 text-[#FFF9EC]"
            style={{
              background:
                'linear-gradient(135deg, #8F5417 0%, #B97626 52%, #D49A42 100%)',
            }}
          >
            <img
              src="/assets/icons/bg_5star.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ opacity: 0.32, mixBlendMode: 'overlay' }}
            />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#FFF1C7] uppercase">
                  <DiamondStar size={9} />
                  <span>Festival Kuliner Liyue</span>
                </div>
                <h2 className="font-genshin text-[17px] leading-snug text-[#FFFDF7] mt-1 drop-shadow-[0_1px_2px_rgba(44,24,6,0.45)]">
                  Jamuan Hangat Para Adeptus
                </h2>
                <p className="text-[11.5px] text-[#FFF4DC] mt-1 leading-relaxed">
                  Gunakan kupon <strong className="text-[#FFFFFF]">PAIMONKENYANG</strong> untuk potongan 20% seluruh hidangan.
                </p>
              </div>

              <div
                className="w-[86px] h-[86px] shrink-0 flex items-center justify-center rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(255, 245, 210, 0.52) 0%, transparent 68%)',
                }}
              >
                <TeyvatImage
                  src={featuredDish.image}
                  fallbackSrc={featuredDish.fallbackImage}
                  alt={featuredDish.name}
                  className="w-[76px] h-[76px] object-contain drop-shadow-[0_4px_6px_rgba(48,26,8,0.42)]"
                />
              </div>
            </div>
          </div>

          <div className="px-4 py-2.5 bg-[#FAF8F2] border-t border-[#D3BC8E] flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[#4E5366]">
              <TeyvatImage
                src={ASSET_ICONS.intertwinedFate}
                fallbackSrc={ASSET_ICONS.intertwinedFateCdn}
                alt="Voucher Intertwined Fate"
                className="w-4 h-4 object-contain shrink-0"
              />
              <span>Pengantaran Kurir Glider 12–22 menit</span>
            </div>
            <button
              type="button"
              onClick={() => pushStack({ name: 'dish', dishId: featuredDish.id })}
              className="font-genshin text-[11px] font-bold text-[#9C5A14] hover:text-[#6E3E0B] inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <span>Lihat Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Quick Category Shortcuts */}
        <section aria-labelledby="quick-categories-heading">
          <div className="flex items-center justify-between mb-2.5">
            <h2
              id="quick-categories-heading"
              className="font-genshin text-[14.5px] text-[#242735]"
            >
              Kategori Cepat
            </h2>
            <button
              type="button"
              onClick={() =>
                openCatalogWithFilter({ category: 'All Dishes', buff: null, region: null })
              }
              className="text-[11.5px] font-semibold text-[#9C5A14] hover:text-[#6E3E0B]"
            >
              Semua Katalog
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {quickShortcuts.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="min-h-[60px] rounded-xl teyvat-ivory-card px-2.5 py-2 flex items-center gap-2.5 text-left hover:border-[#C87C24] active:scale-[0.985] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A86B]"
              >
                <div
                  className="w-10 h-10 rounded-lg border border-[#D3BC8E]/80 flex items-center justify-center shrink-0"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(255, 231, 165, 0.48) 0%, #ECE4D3 78%)',
                  }}
                >
                  <TeyvatImage
                    src={item.icon}
                    fallbackSrc={item.fallbackIcon}
                    alt={item.label}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-genshin text-[12px] text-[#242735] truncate">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-[#5B6073] truncate">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <DiamondDivider />

        {/* Top 5 Recommendations */}
        <section aria-labelledby="top-recommendations-heading" className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2
              id="top-recommendations-heading"
              className="font-genshin text-[14.5px] text-[#242735]"
            >
              5 Rekomendasi Terbaik
            </h2>
            <span className="text-[11px] font-medium text-[#6B5A3E]">
              Pilihan Chef Xiangling
            </span>
          </div>

          <div className="space-y-2.5">
            {topFive.map((dish, index) => (
              <article
                key={dish.id}
                className="rounded-2xl overflow-hidden teyvat-ivory-card flex items-stretch"
              >
                <div className="w-[104px] shrink-0">
                  <RarityDishBanner
                    dish={dish}
                    heightClass="h-full min-h-[104px]"
                    imageSizeClass="w-[68px] h-[68px]"
                    showRegion={false}
                    alignImage="center"
                    onClick={() => pushStack({ name: 'dish', dishId: dish.id })}
                  />
                </div>

                <div className="flex-1 p-3 min-w-0 flex flex-col justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => pushStack({ name: 'dish', dishId: dish.id })}
                    className="text-left focus-visible:outline-none"
                  >
                    <div className="text-[10px] font-semibold text-[#666B7D]">
                      0{index + 1} · {dish.region} · {dish.category}
                    </div>
                    <h3 className="font-genshin text-[13.5px] text-[#242735] leading-snug truncate mt-0.5">
                      {dish.name}
                    </h3>
                    <div className="mt-1">
                      <BuffBadge buffType={dish.buffType} label={dish.buffLabel} compact />
                    </div>
                  </button>

                  <div className="pt-1.5 border-t border-[#DFD6C4] flex items-center justify-between gap-2">
                    <MoraAmount
                      amount={dish.priceMora}
                      size="sm"
                      className="text-[#242735]"
                    />
                    <button
                      type="button"
                      onClick={() => addToCart(dish, 1)}
                      aria-label={`Tambah ${dish.name} ke keranjang`}
                      className="teyvat-gold-btn min-h-[34px] px-3 py-1 rounded-full font-genshin text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pt-1">
            <GoldCapsuleButton
              onClick={() =>
                openCatalogWithFilter({ category: 'All Dishes', buff: null, region: null })
              }
            >
              <span>Jelajahi Seluruh 18 Menu Katalog</span>
              <ArrowRight className="w-4 h-4" />
            </GoldCapsuleButton>
          </div>
        </section>
      </div>
    </div>
  );
};
