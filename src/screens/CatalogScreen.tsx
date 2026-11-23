import React, { useEffect, useMemo, useState } from 'react';
import { Plus, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  BUFF_META,
  CATEGORY_LABELS_ID,
  DISHES,
  DISH_CATEGORIES,
  TEYVAT_REGIONS,
} from '../data/dishes';
import { filterDishes } from '../lib/delicaciesRules';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { BuffType, Dish, DishCategory, DishRarity, TeyvatRegion } from '../types';
import {
  BuffBadge,
  DiamondStar,
  MoraAmount,
  RarityDishBanner,
  TeyvatImage,
} from '../components/TeyvatUI';

const ALL_BUFFS: BuffType[] = ['ATK', 'DEF', 'HP', 'STAMINA'];
const ALL_RARITIES: DishRarity[] = [5, 4, 3, 2, 1];

export const CatalogScreen: React.FC = () => {
  const profile = useDelicaciesStore((s) => s.profile);
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const pushStack = useDelicaciesStore((s) => s.pushStack);
  const setActiveTab = useDelicaciesStore((s) => s.setActiveTab);
  const catalogPreset = useDelicaciesStore((s) => s.catalogPreset);
  const clearCatalogPreset = useDelicaciesStore((s) => s.clearCatalogPreset);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All Dishes' | DishCategory>(
    'All Dishes'
  );
  const [selectedBuffs, setSelectedBuffs] = useState<BuffType[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<TeyvatRegion[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<DishRarity | null>(null);
  const [showRegionFilters, setShowRegionFilters] = useState(false);

  // Consume preset when navigating from Beranda Quick Categories
  useEffect(() => {
    if (!catalogPreset) return;
    if (catalogPreset.category !== undefined) {
      setSelectedCategory(catalogPreset.category);
    }
    if (catalogPreset.buff !== undefined) {
      setSelectedBuffs(catalogPreset.buff ? [catalogPreset.buff] : []);
    }
    if (catalogPreset.region !== undefined) {
      setSelectedRegions(catalogPreset.region ? [catalogPreset.region] : []);
      if (catalogPreset.region) setShowRegionFilters(true);
    }
    clearCatalogPreset();
  }, [catalogPreset, clearCatalogPreset]);

  const toggleBuff = (buff: BuffType) => {
    setSelectedBuffs((prev) =>
      prev.includes(buff) ? prev.filter((b) => b !== buff) : [...prev, buff]
    );
  };

  const toggleRegion = (region: TeyvatRegion) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const activeFilterCount =
    selectedBuffs.length +
    selectedRegions.length +
    (selectedRarity !== null ? 1 : 0) +
    (selectedCategory !== 'All Dishes' ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Dishes');
    setSelectedBuffs([]);
    setSelectedRegions([]);
    setSelectedRarity(null);
  };

  const filteredDishes = useMemo(
    () =>
      filterDishes(DISHES, {
        query: searchQuery,
        category: selectedCategory,
        buffs: selectedBuffs,
        regions: selectedRegions,
        rarity: selectedRarity,
      }),
    [searchQuery, selectedCategory, selectedBuffs, selectedRegions, selectedRarity]
  );

  const handleOpenDish = (dish: Dish) => {
    pushStack({ name: 'dish', dishId: dish.id });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Translucent Glassmorphic Header & Multi-Filter Control Deck (Full-Bleed Edge-to-Edge) */}
      <header className="px-4 pt-3.5 pb-3 hoyolab-glass-bar border-b border-[#FFE7A5]/25 shrink-0 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="font-genshin text-[17px] text-[#FFE7A5] tracking-wide">
              Katalog Kuliner Teyvat
            </h1>
            <p className="text-[11px] text-[#C2CAE0]">
              Cari hidangan, saring efek buff tempur &amp; 8 wilayah
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('profil')}
            className="min-h-[34px] px-2.5 py-1 rounded-full hoyolab-stat-badge flex items-center gap-1 shrink-0 hover:border-[#FFE7A5] transition-colors"
            title="Saldo Mora"
          >
            <MoraAmount amount={profile.moraBalance} size="xs" className="text-[#FFE7A5]" />
          </button>
        </div>

        {/* Luminous Soft-Cream Search Input + Region/Rarity Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#6B647A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kuliner Teyvat atau efek buff..."
              aria-label="Cari kuliner Teyvat atau efek buff"
              className="teyvat-cream-input w-full h-[40px] pl-9 pr-8 rounded-xl border border-[#D3BC8E] text-[12.5px] placeholder:text-[#787285] focus:outline-none focus:ring-2 focus:ring-[#FFE7A5]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian"
                className="w-7 h-7 flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-[#5B5568] hover:text-[#1D1A2A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowRegionFilters((v) => !v)}
            aria-expanded={showRegionFilters}
            aria-label="Filter wilayah dan bintang"
            className={`min-h-[40px] px-3 rounded-xl border text-[11px] font-genshin font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors ${
              showRegionFilters || selectedRegions.length > 0 || selectedRarity !== null
                ? 'bg-[#FFE7A5] border-[#FFE7A5] text-[#232635]'
                : 'hoyolab-stat-badge text-[#F7F4EE] hover:border-[#FFE7A5]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Wilayah</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
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
                className={`min-h-[34px] px-3 py-1 rounded-full font-genshin text-[11px] whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                  active
                    ? 'bg-[#FFE7A5] text-[#232635] border border-[#FFE7A5]'
                    : 'bg-[#161B2A]/70 text-[#DCE2F2] border border-[#FFE7A5]/25 hover:border-[#FFE7A5]/60'
                }`}
              >
                {CATEGORY_LABELS_ID[category]}
              </button>
            );
          })}
        </div>

        {/* Combat Buff Filter Strip (Official Buff Icons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ALL_BUFFS.map((buff) => {
            const meta = BUFF_META[buff];
            const active = selectedBuffs.includes(buff);
            return (
              <button
                key={buff}
                type="button"
                onClick={() => toggleBuff(buff)}
                aria-pressed={active}
                className={`min-h-[34px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1.5 shrink-0 transition-colors ${
                  active
                    ? 'bg-[#F7F4EE] border-[#FFE7A5] text-[#232635]'
                    : 'bg-[#161B2A]/60 border-[#FFE7A5]/20 text-[#CFD6E9] hover:border-[#FFE7A5]/50'
                }`}
              >
                <TeyvatImage
                  src={meta.icon}
                  fallbackSrc={meta.fallbackIcon}
                  alt={meta.label}
                  className="w-4 h-4 object-contain shrink-0"
                />
                <span className="whitespace-nowrap">{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Expandable 8-Region + Rarity Filter Drawer */}
        {showRegionFilters && (
          <div className="rounded-xl teyvat-ivory-card p-3 space-y-2.5 animate-modal-enter shadow-md">
            <div>
              <div className="font-genshin text-[11px] text-[#3B4255] mb-1.5">
                Wilayah Teyvat (8 Negara)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TEYVAT_REGIONS.map((region) => {
                  const active = selectedRegions.includes(region);
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleRegion(region)}
                      aria-pressed={active}
                      className={`min-h-[30px] px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                        active
                          ? 'bg-[#2C354D] text-[#FFE7A5] border border-[#FFE7A5]/60'
                          : 'bg-[#ECE5D8] text-[#4A4F63] border border-[#D3BC8E]/75 hover:border-[#9C5A14]'
                      }`}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="font-genshin text-[11px] text-[#3B4255] mb-1.5">
                Tingkat Kelangkaan
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedRarity(null)}
                  className={`min-h-[30px] px-2.5 rounded-lg text-[11px] font-semibold shrink-0 ${
                    selectedRarity === null
                      ? 'bg-[#2C354D] text-[#FFE7A5]'
                      : 'bg-[#ECE5D8] text-[#4A4F63] border border-[#D3BC8E]/75'
                  }`}
                >
                  Semua
                </button>
                {ALL_RARITIES.map((rarity) => {
                  const active = selectedRarity === rarity;
                  return (
                    <button
                      key={rarity}
                      type="button"
                      onClick={() => setSelectedRarity(active ? null : rarity)}
                      className={`min-h-[30px] px-2.5 rounded-lg text-[11px] font-genshin font-bold inline-flex items-center gap-1 shrink-0 ${
                        active
                          ? 'bg-[#2C354D] text-[#FFE7A5]'
                          : 'bg-[#ECE5D8] text-[#6B4A1B] border border-[#D3BC8E]/75'
                      }`}
                    >
                      <span className="tabular-nums">{rarity}</span>
                      <DiamondStar size={10} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Full-Bleed Scrollable 2-Column Ivory Parchment Card Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3.5 pb-24">
        <div className="flex items-center justify-between mb-3">
          <span className="font-genshin text-[12px] text-[#D7DEEE] tabular-nums">
            Menampilkan {filteredDishes.length} hidangan
          </span>
          {(activeFilterCount > 0 || searchQuery) && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-semibold text-[#FFE7A5] inline-flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="rounded-2xl teyvat-ivory-card p-6 text-center mt-2 shadow-md">
            <p className="font-genshin text-[15px] text-[#232635]">
              Hidangan Tidak Ditemukan
            </p>
            <p className="text-[12px] text-[#575A6B] mt-1.5">
              Tidak ada masakan yang cocok dengan kombinasi pencarian atau filter saat ini.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 teyvat-gold-btn px-4 py-2 rounded-full font-genshin text-[12px] font-bold"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredDishes.map((dish) => (
              <article
                key={dish.id}
                className="rounded-2xl overflow-hidden teyvat-ivory-card shadow-md flex flex-col transition-transform duration-150 hover:-translate-y-0.5"
              >
                {/* Card Top: 1*-5* Rarity Banner + Triquetra Watermark (0.35 overlay) + Radial Glow + 4-pt Stars */}
                <RarityDishBanner
                  dish={dish}
                  heightClass="h-[108px]"
                  imageSizeClass="w-[80px] h-[80px]"
                  onClick={() => handleOpenDish(dish)}
                />

                {/* Card Body: Luminous Ivory Parchment */}
                <div className="p-2.5 flex-1 flex flex-col justify-between gap-2 bg-[#F7F4EE]">
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

                  <div className="pt-1.5 border-t border-[#DED4C0] flex items-center justify-between gap-1">
                    <MoraAmount
                      amount={dish.priceMora}
                      size="xs"
                      className="text-[#232635]"
                    />
                    <button
                      type="button"
                      onClick={() => addToCart(dish, 1)}
                      aria-label={`Tambah ${dish.name} ke keranjang`}
                      className="teyvat-gold-btn w-8 h-8 rounded-full flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B4255]"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
