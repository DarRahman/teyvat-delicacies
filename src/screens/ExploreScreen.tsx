import React, { useMemo, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import {
  BUFF_META,
  DISHES,
  RARITY_META,
  TEYVAT_REGIONS,
} from '../data/dishes';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import { BuffType, DishRarity, TeyvatRegion } from '../types';
import {
  BuffBadge,
  DiamondDivider,
  DiamondStar,
  DiamondStarRow,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

const ALL_BUFFS: BuffType[] = ['ATK', 'DEF', 'HP', 'STAMINA'];
const ALL_RARITIES: DishRarity[] = [5, 4, 3, 2, 1];

export const ExploreScreen: React.FC = () => {
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const pushStack = useDelicaciesStore((s) => s.pushStack);

  const [selectedBuffs, setSelectedBuffs] = useState<BuffType[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<TeyvatRegion[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<DishRarity | null>(null);

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

  const hasFilters =
    selectedBuffs.length > 0 || selectedRegions.length > 0 || selectedRarity !== null;

  const resetFilters = () => {
    setSelectedBuffs([]);
    setSelectedRegions([]);
    setSelectedRarity(null);
  };

  const results = useMemo(() => {
    return DISHES.filter((dish) => {
      if (selectedBuffs.length > 0 && !selectedBuffs.includes(dish.buffType)) {
        return false;
      }
      if (selectedRegions.length > 0 && !selectedRegions.includes(dish.region)) {
        return false;
      }
      if (selectedRarity !== null && dish.rarity !== selectedRarity) {
        return false;
      }
      return true;
    }).sort((a, b) => b.rarity - a.rarity);
  }, [selectedBuffs, selectedRegions, selectedRarity]);

  return (
    <div className="flex flex-col h-full">
      {/* Screen Header */}
      <header className="px-4 pt-4 pb-3 bg-[#171421]/95 backdrop-blur-md border-b border-[#5D5187]/40 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="font-genshin text-[18px] text-[#FFE7A5] tracking-wide">
              Eksplorasi &amp; Buff Tempur
            </h1>
            <p className="text-[11px] text-[#B8B0CD] mt-0.5">
              Saring masakan menurut khasiat dan delapan wilayah Teyvat
            </p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[36px] px-3 py-1 rounded-full bg-[#252038] border border-[#FFE7A5]/60 text-[11px] font-semibold text-[#FFE7A5] inline-flex items-center gap-1 hover:bg-[#312A4A] transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Scrollable Filter Controls + Comprehensive Stat Results */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4">
        {/* Multi-Filter Combat Buff Grid */}
        <section aria-labelledby="filter-buff-heading">
          <h2
            id="filter-buff-heading"
            className="text-[12px] font-semibold text-[#CFC7DE] mb-2"
          >
            Efek Khasiat Tempur
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {ALL_BUFFS.map((buff) => {
              const meta = BUFF_META[buff];
              const active = selectedBuffs.includes(buff);
              return (
                <button
                  key={buff}
                  type="button"
                  onClick={() => toggleBuff(buff)}
                  aria-pressed={active}
                  className={`min-h-[48px] px-3 py-2 rounded-xl border flex items-center gap-2.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                    active
                      ? 'bg-[#E9E5DC] border-[#FFE7A5] text-[#232635] shadow-[0_4px_14px_rgba(255,231,165,0.18)]'
                      : 'bg-[#221D33] border-[#5D5187]/65 text-[#E9E5DC] hover:border-[#FFE7A5]/55'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      active ? 'bg-[#D3BC8E]/35' : 'bg-[#171421]/70'
                    }`}
                  >
                    <TeyvatImage
                      src={meta.icon}
                      fallbackSrc={meta.fallbackIcon}
                      alt={meta.label}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold leading-tight truncate">
                      {meta.label}
                    </div>
                    <div
                      className={`text-[10px] leading-tight ${
                        active ? 'text-[#5A5F72]' : 'text-[#A9A0BE]'
                      }`}
                    >
                      {meta.shortLabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Region Filter Buttons (All 8 Teyvat Nations including Nod-Krai) */}
        <section aria-labelledby="filter-region-heading">
          <h2
            id="filter-region-heading"
            className="text-[12px] font-semibold text-[#CFC7DE] mb-2"
          >
            Wilayah Asal Teyvat
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {TEYVAT_REGIONS.map((region) => {
              const active = selectedRegions.includes(region);
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleRegion(region)}
                  aria-pressed={active}
                  className={`min-h-[36px] px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                    active
                      ? 'teyvat-gold-btn !min-h-[36px] !py-1 !text-[11px]'
                      : 'bg-[#221D33] text-[#CFC7DE] border border-[#5D5187]/65 hover:border-[#FFE7A5]/50'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </section>

        {/* Rarity Diamond Star Selector */}
        <section aria-labelledby="filter-rarity-heading">
          <h2
            id="filter-rarity-heading"
            className="text-[12px] font-semibold text-[#CFC7DE] mb-2"
          >
            Tingkat Kelangkaan
          </h2>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedRarity(null)}
              className={`min-h-[36px] px-3 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors ${
                selectedRarity === null
                  ? 'bg-[#FFE7A5] text-[#232635]'
                  : 'bg-[#221D33] text-[#CFC7DE] border border-[#5D5187]/65'
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
                  className={`min-h-[36px] px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 shrink-0 transition-colors ${
                    active
                      ? 'bg-[#FFE7A5] text-[#232635]'
                      : 'bg-[#221D33] text-[#FFE7A5] border border-[#5D5187]/65 hover:border-[#FFE7A5]/60'
                  }`}
                >
                  <span className="tabular-nums">{rarity}</span>
                  <DiamondStar
                    size={11}
                    className={active ? 'text-[#9C5A14]' : 'text-[#FFE7A5]'}
                  />
                </button>
              );
            })}
          </div>
        </section>

        <DiamondDivider dark />

        {/* Filtered Results List with Comprehensive In-Game Stat Descriptions */}
        <section aria-labelledby="explore-results-heading">
          <div className="flex items-center justify-between mb-2.5">
            <h2
              id="explore-results-heading"
              className="font-genshin text-[14px] text-[#FFE7A5]"
            >
              Hasil Eksplorasi Kuliner
            </h2>
            <span className="text-[11px] text-[#B8B0CD] tabular-nums">
              {results.length} cocok
            </span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl teyvat-parchment border border-[#FFE7A5]/60 p-6 text-center">
              <p className="font-genshin text-[14px] text-[#232635]">
                Kombinasi Filter Kosong
              </p>
              <p className="text-[12px] text-[#565A6D] mt-1">
                Belum ada hidangan dengan kombinasi buff, wilayah, dan kelangkaan tersebut.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3.5 teyvat-gold-btn px-4 py-2 rounded-full text-[12px] font-bold"
              >
                Atur Ulang Filter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((dish) => {
                const rarityStyle = RARITY_META[dish.rarity];
                return (
                  <article
                    key={dish.id}
                    className="rounded-2xl overflow-hidden border border-[#5D5187]/75 bg-[#E9E5DC] shadow-md"
                  >
                    <div className="flex items-stretch">
                      {/* Left Rarity Thumbnail Banner */}
                      <button
                        type="button"
                        onClick={() => pushStack({ name: 'dish', dishId: dish.id })}
                        className="w-[96px] shrink-0 relative flex flex-col items-center justify-center p-2 focus-visible:outline-none"
                        style={{ background: rarityStyle.gradient }}
                        aria-label={`Buka resep ${dish.name}`}
                      >
                        <TeyvatImage
                          src={dish.image}
                          fallbackSrc={dish.fallbackImage}
                          alt={dish.name}
                          className="w-16 h-16 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
                        />
                        <div className="mt-1">
                          <DiamondStarRow rarity={dish.rarity} size={10} />
                        </div>
                      </button>

                      {/* Right Detailed Parchment Info */}
                      <div className="flex-1 p-3 min-w-0 flex flex-col justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => pushStack({ name: 'dish', dishId: dish.id })}
                          className="text-left focus-visible:outline-none"
                        >
                          <div className="text-[10px] font-semibold text-[#64697B] flex items-center gap-1.5">
                            <span>{dish.region}</span>
                            <span aria-hidden="true">·</span>
                            <span>{dish.category}</span>
                          </div>
                          <h3 className="font-genshin text-[14px] text-[#232635] leading-snug mt-0.5 truncate">
                            {dish.name}
                          </h3>
                          <div className="mt-1.5">
                            <BuffBadge buffType={dish.buffType} label={dish.buffLabel} compact />
                          </div>
                          <p className="text-[11px] text-[#454A5C] leading-relaxed mt-1.5 line-clamp-2">
                            {dish.effect}
                          </p>
                        </button>

                        <div className="pt-2 border-t border-[#D2C9B6] flex items-center justify-between gap-2">
                          <MoraAmount
                            amount={dish.priceMora}
                            size="sm"
                            className="text-[#232635]"
                          />
                          <button
                            type="button"
                            onClick={() => addToCart(dish, 1)}
                            className="teyvat-gold-btn min-h-[34px] px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Tambah</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
