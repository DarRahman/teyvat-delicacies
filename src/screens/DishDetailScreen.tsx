import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Minus, Plus } from 'lucide-react';
import {
  ASSET_ICONS,
  BUFF_META,
  DISHES,
  RARITY_META,
  formatMora,
} from '../data/dishes';
import { teyvatAudio } from '../lib/audio';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  DiamondDivider,
  DiamondStarRow,
  GoldCapsuleButton,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';

interface DishDetailScreenProps {
  dishId: number;
}

export const DishDetailScreen: React.FC<DishDetailScreenProps> = ({ dishId }) => {
  const popStack = useDelicaciesStore((s) => s.popStack);
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const favoriteIds = useDelicaciesStore((s) => s.favoriteIds);
  const toggleFavorite = useDelicaciesStore((s) => s.toggleFavorite);
  const sfxEnabled = useDelicaciesStore((s) => s.sfxEnabled);

  const [quantity, setQuantity] = useState(1);

  const dish = DISHES.find((d) => d.id === dishId) ?? DISHES[0];
  const isFavorite = favoriteIds.includes(dish.id);
  const rarityStyle = RARITY_META[dish.rarity];
  const buffMeta = BUFF_META[dish.buffType];

  useEffect(() => {
    if (dish.rarity === 5) {
      teyvatAudio.playSfx('legendary', sfxEnabled);
    } else if (dish.rarity === 4) {
      teyvatAudio.playSfx('epic', sfxEnabled);
    }
  }, [dish.id, dish.rarity, sfxEnabled]);

  const totalPrice = dish.priceMora * quantity;

  const handleAdd = () => {
    addToCart(dish, quantity);
    popStack();
  };

  return (
    <div className="flex flex-col h-full bg-[#171421] animate-stack-enter">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero Backdrop Section with Top Bar */}
        <div className="relative h-[268px] overflow-hidden flex flex-col justify-between">
          <img
            src={ASSET_ICONS.dishDetailBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 56%, ${rarityStyle.glow} 0%, rgba(23,20,33,0.72) 60%, #171421 100%)`,
            }}
            aria-hidden="true"
          />

          {/* Top Bar: Golden Back Arrow & Favorite Toggle */}
          <header className="relative z-10 px-4 pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={popStack}
              aria-label="Kembali"
              className="w-11 h-11 rounded-full bg-[#171421]/75 backdrop-blur-md border border-[#FFE7A5]/70 text-[#FFE7A5] flex items-center justify-center hover:bg-[#252038] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <span className="font-genshin text-[13px] text-[#FFE7A5] tracking-wider drop-shadow">
              Dossier Resep
            </span>

            <button
              type="button"
              onClick={() => toggleFavorite(dish.id)}
              aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
              aria-pressed={isFavorite}
              className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                isFavorite
                  ? 'bg-[#FFE7A5] border-[#FFE7A5] text-[#9C2B3B]'
                  : 'bg-[#171421]/75 border-[#FFE7A5]/70 text-[#FFE7A5] hover:bg-[#252038]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </header>

          {/* Large Transparent Dish Illustration */}
          <div className="relative z-10 flex-1 flex items-center justify-center pb-4">
            <div className="relative animate-float-slow">
              <div
                className="absolute inset-4 rounded-full blur-2xl opacity-65 pointer-events-none"
                style={{ backgroundColor: rarityStyle.headerColor }}
                aria-hidden="true"
              />
              <TeyvatImage
                src={dish.image}
                fallbackSrc={dish.fallbackImage}
                alt={dish.name}
                className="relative z-10 w-[164px] h-[164px] object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.65)]"
              />
            </div>
          </div>
        </div>

        {/* Parchment Dossier Card */}
        <div className="px-4 -mt-4 relative z-20">
          <div className="rounded-3xl teyvat-parchment border border-[#FFE7A5]/75 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.45)] space-y-4">
            {/* Title, Rarity Stars, Region & Price */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <DiamondStarRow rarity={dish.rarity} size={14} />
                <span className="text-[11px] font-semibold text-[#5E6275]">
                  {dish.region} · {dish.category} · {dish.prepMinutes} mnt
                </span>
              </div>

              <h1 className="font-genshin text-[21px] text-[#232635] leading-snug mt-2">
                {dish.name}
              </h1>

              <div className="mt-1.5 flex items-center justify-between">
                <MoraAmount
                  amount={dish.priceMora}
                  size="md"
                  showSuffix
                  className="text-[#232635]"
                />
                <span
                  className="text-[11px] font-bold tracking-wide"
                  style={{ color: rarityStyle.headerColor }}
                >
                  {rarityStyle.name} · Bintang {dish.rarity}
                </span>
              </div>
            </div>

            <DiamondDivider />

            {/* Combat Stat Buff Banner */}
            <section
              aria-labelledby="buff-dossier-heading"
              className="rounded-2xl bg-[#F5F2EB] border border-[#D4C8B2] p-3.5 flex items-start gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: buffMeta.bgTint }}
              >
                <TeyvatImage
                  src={buffMeta.icon}
                  fallbackSrc={buffMeta.fallbackIcon}
                  alt={buffMeta.label}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2
                  id="buff-dossier-heading"
                  className="font-genshin text-[12px] text-[#232635] flex items-center gap-1.5"
                >
                  <span>{buffMeta.label}</span>
                  <span className="font-sans font-bold text-[#9C5A14]">
                    ({dish.buffLabel})
                  </span>
                </h2>
                <p className="text-[12px] text-[#454A5C] leading-relaxed mt-1">
                  {dish.effect}
                </p>
              </div>
            </section>

            {/* Official Lore Story */}
            <section aria-labelledby="lore-heading">
              <h2
                id="lore-heading"
                className="font-genshin text-[13px] text-[#232635] mb-1.5"
              >
                Kisah &amp; Asal Hidangan
              </h2>
              <p className="text-[12.5px] text-[#4A4F63] leading-relaxed">
                {dish.description}
              </p>
            </section>

            <DiamondDivider />

            {/* Ingredients Horizontal Grid */}
            <section aria-labelledby="ingredients-heading">
              <div className="flex items-center justify-between mb-2.5">
                <h2
                  id="ingredients-heading"
                  className="font-genshin text-[13px] text-[#232635]"
                >
                  Bahan Baku Resep
                </h2>
                <span className="text-[11px] text-[#64697B] tabular-nums">
                  {dish.ingredients.length} bahan pilihan
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {dish.ingredients.map((ing) => (
                  <div
                    key={ing.name}
                    className="rounded-xl bg-[#F5F2EB] border border-[#D8CEBC] p-2 flex flex-col items-center text-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#E9E5DC] flex items-center justify-center p-1 mb-1">
                      <TeyvatImage
                        src={ing.icon}
                        alt={ing.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#2B2D3A] leading-tight line-clamp-1 w-full">
                      {ing.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#9C5A14] tabular-nums mt-0.5">
                      ×{ing.count * quantity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="px-4 py-3 bg-[#171421]/95 backdrop-blur-md border-t border-[#5D5187]/55 flex items-center gap-3 shrink-0">
        {/* Portion Stepper */}
        <div className="inline-flex items-center gap-1 bg-[#241F36] border border-[#5D5187]/80 rounded-full p-1 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Kurangi jumlah porsi"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#FFE7A5] hover:bg-[#342D4F] transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="min-w-[26px] text-center font-genshin text-[14px] text-[#FFF8E7] tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Tambah jumlah porsi"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#FFE7A5] hover:bg-[#342D4F] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Gold Pill CTA */}
        <GoldCapsuleButton onClick={handleAdd} className="flex-1 text-[12px] px-3">
          <span>Tambah ke Pesanan — {formatMora(totalPrice)} Mora</span>
        </GoldCapsuleButton>
      </div>
    </div>
  );
};
