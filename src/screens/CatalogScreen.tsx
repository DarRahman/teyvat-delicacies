import React, { useMemo, useState } from 'react';
import { Plus, Search, Volume2, VolumeX, X } from 'lucide-react';
import {
  CATEGORY_LABELS_ID,
  DISHES,
  DISH_CATEGORIES,
  RARITY_META,
} from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { Dish, DishCategory } from '../types';
import {
  BuffBadge,
  DiamondStarRow,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

export const CatalogScreen: React.FC = () => {
  const profile = useDelicaciesStore((s) => s.profile);
  const bgmEnabled = useDelicaciesStore((s) => s.bgmEnabled);
  const toggleBgm = useDelicaciesStore((s) => s.toggleBgm);
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const pushStack = useDelicaciesStore((s) => s.pushStack);
  const setActiveTab = useDelicaciesStore((s) => s.setActiveTab);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All Dishes' | DishCategory>(
    'All Dishes'
  );

  const filteredDishes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DISHES.filter((dish) => {
      const matchesCategory =
        selectedCategory === 'All Dishes' || dish.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        dish.name.toLowerCase().includes(q) ||
        dish.region.toLowerCase().includes(q) ||
        dish.buffLabel.toLowerCase().includes(q) ||
        dish.buffType.toLowerCase().includes(q) ||
        dish.effect.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenDish = (dish: Dish) => {
    pushStack({ name: 'dish', dishId: dish.id });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Compact Sticky Traveler Header Bar */}
      <header className="px-4 pt-4 pb-3 bg-[#171421]/95 backdrop-blur-md border-b border-[#5D5187]/40 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Traveler Identity */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 min-w-0 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] rounded-xl pr-1"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-[1.5px] border-[#FFE7A5] bg-[#252038] shrink-0 shadow-[0_0_12px_rgba(255,231,165,0.22)]">
              <TeyvatImage
                src={profile.avatarUrl}
                fallbackSrc={profile.fallbackAvatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-genshin text-[14px] text-[#FFF8E7] leading-tight truncate group-hover:text-[#FFE7A5] transition-colors">
                {profile.username}
              </p>
              <p className="text-[11px] text-[#B8B0CD] tabular-nums">
                AR {profile.adventureRank} · WL {profile.worldLevel}
              </p>
            </div>
          </button>

          {/* Live Mora Balance Badge + BGM Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="min-h-[36px] px-2.5 py-1 rounded-full bg-[#241F36] border border-[#FFE7A5]/70 flex items-center gap-1 shadow-inner hover:border-[#FFE7A5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5]"
              title="Saldo Mora Aktif"
            >
              <MoraAmount amount={profile.moraBalance} size="xs" className="text-[#FFE7A5]" />
            </button>

            <button
              type="button"
              onClick={toggleBgm}
              aria-label={bgmEnabled ? 'Matikan musik latar' : 'Nyalakan musik latar'}
              title={bgmEnabled ? 'Musik latar aktif' : 'Musik latar mati'}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                bgmEnabled
                  ? 'bg-[#FFE7A5]/15 border-[#FFE7A5]/75 text-[#FFE7A5]'
                  : 'bg-[#241F36] border-[#5D5187]/70 text-[#A89FC0] hover:text-[#FFE7A5]'
              }`}
            >
              {bgmEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Soft-Cream Inset Search Input */}
        <div className="mt-3 relative">
          <Search
            className="w-4 h-4 text-[#6B647A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kuliner Teyvat atau efek buff..."
            aria-label="Cari kuliner Teyvat atau efek buff"
            className="teyvat-cream-input w-full h-[42px] pl-10 pr-9 rounded-xl border border-[#D3BC8E]/70 text-[13px] placeholder:text-[#7B7487] focus:outline-none focus:ring-2 focus:ring-[#FFE7A5]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Hapus pencarian"
              className="w-8 h-8 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-[#5B5568] hover:text-[#1D1A2A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Buttons (Horizontal Scroll) */}
        <div
          className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
          role="tablist"
          aria-label="Kategori Hidangan"
        >
          {DISH_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                  active
                    ? 'teyvat-gold-btn !min-h-[36px] !py-1.5 !text-[12px]'
                    : 'bg-[#241F36] text-[#CFC7DE] border border-[#5D5187]/65 hover:border-[#FFE7A5]/50 hover:text-[#FFF8E7]'
                }`}
              >
                {CATEGORY_LABELS_ID[category]}
              </button>
            );
          })}
        </div>
      </header>

      {/* Scrollable Catalog Grid */}
      <div className="flex-1 overflow-y-auto px-4 pt-3.5 pb-28">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-genshin text-[15px] text-[#FFE7A5] tracking-wide">
            Menu Pilihan Teyvat
          </h2>
          <span className="text-[11px] text-[#A9A0BE] tabular-nums">
            {filteredDishes.length} hidangan
          </span>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="rounded-2xl teyvat-parchment border border-[#FFE7A5]/60 p-6 text-center mt-4">
            <p className="font-genshin text-[15px] text-[#2B2D3A]">
              Hidangan Tidak Ditemukan
            </p>
            <p className="text-[12px] text-[#575A6B] mt-1.5">
              Tidak ada masakan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Dishes');
              }}
              className="mt-4 teyvat-gold-btn px-4 py-2 rounded-full text-[12px] font-bold"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredDishes.map((dish) => {
              const rarityStyle = RARITY_META[dish.rarity];
              return (
                <article
                  key={dish.id}
                  className="rounded-2xl overflow-hidden border border-[#5D5187]/75 shadow-[0_6px_16px_rgba(0,0,0,0.38)] flex flex-col bg-[#E9E5DC] transition-transform duration-150 hover:-translate-y-0.5"
                >
                  {/* Card Top: Colored Rarity Header Banner with Overlapping Transparent PNG */}
                  <button
                    type="button"
                    onClick={() => handleOpenDish(dish)}
                    className="relative h-[106px] w-full text-left overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFE7A5]"
                    style={{ background: rarityStyle.gradient }}
                    aria-label={`Lihat detail ${dish.name}`}
                  >
                    {rarityStyle.bgAsset && (
                      <img
                        src={rarityStyle.bgAsset}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay pointer-events-none"
                      />
                    )}
                    {/* Subtle Region Text Top-Left */}
                    <span className="absolute top-2 left-2.5 text-[10px] font-semibold tracking-wide text-[#FFF9EB]/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                      {dish.region}
                    </span>

                    {/* Dish Transparent Illustration Overlapping Right/Center */}
                    <div className="absolute inset-0 flex items-center justify-end pr-2 pt-2 pointer-events-none">
                      <TeyvatImage
                        src={dish.image}
                        fallbackSrc={dish.fallbackImage}
                        alt={dish.name}
                        className="w-[82px] h-[82px] object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
                      />
                    </div>

                    {/* 4-Point Diamond Stars Bottom-Left */}
                    <div className="absolute bottom-2 left-2.5 z-10">
                      <DiamondStarRow rarity={dish.rarity} size={11} />
                    </div>
                  </button>

                  {/* Card Body: Authentic Antique Parchment Cream (#E9E5DC) */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between gap-2 bg-[#E9E5DC]">
                    <button
                      type="button"
                      onClick={() => handleOpenDish(dish)}
                      className="text-left focus-visible:outline-none"
                    >
                      <h3 className="font-genshin text-[13px] leading-snug text-[#232635] line-clamp-2 min-h-[34px]">
                        {dish.name}
                      </h3>
                      <div className="mt-1.5">
                        <BuffBadge
                          buffType={dish.buffType}
                          label={dish.buffLabel}
                          compact
                        />
                      </div>
                    </button>

                    <div className="pt-1.5 border-t border-[#CFC6B4] flex items-center justify-between gap-1">
                      <MoraAmount
                        amount={dish.priceMora}
                        size="xs"
                        className="text-[#2B2D3A]"
                      />
                      <button
                        type="button"
                        onClick={() => addToCart(dish, 1)}
                        aria-label={`Tambah ${dish.name} ke tas`}
                        className="teyvat-gold-btn w-8 h-8 rounded-full flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4255]"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
