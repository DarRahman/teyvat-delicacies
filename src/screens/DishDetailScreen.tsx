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
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Backdrop Section with Triquetra Watermark & Centered Radial Illumination */}
        <div
          className="relative h-[214px] overflow-hidden flex flex-col justify-between"
          style={{ background: rarityStyle.gradient }}
        >
          <img
            src={ASSET_ICONS.dishDetailBg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-multiply pointer-events-none"
          />
          <img
            src={rarityStyle.bgAsset}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.35, mixBlendMode: 'overlay' }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#171421]/60 via-transparent to-[#171421]/85 pointer-events-none"
            aria-hidden="true"
          />

          {/* Top Bar: Golden Back Arrow & Favorite Toggle */}
          <header className="relative z-10 px-4 pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={popStack}
              aria-label="Kembali"
              className="w-10 h-10 rounded-full bg-[#171421]/75 backdrop-blur-md border border-[#FFE7A5]/75 text-[#FFE7A5] flex items-center justify-center hover:bg-[#252038] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5]"
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
              className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
                isFavorite
                  ? 'bg-[#FFE7A5] border-[#FFE7A5] text-[#9C2B3B]'
                  : 'bg-[#171421]/75 border-[#FFE7A5]/75 text-[#FFE7A5] hover:bg-[#252038]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </header>

          {/* Large Transparent Dish Illustration with Exact Soft Centered Radial Illumination */}
          <div className="relative z-10 flex-1 flex items-center justify-center pb-4">
            <div
              className="w-[156px] h-[156px] rounded-full flex items-center justify-center animate-float-slow"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255, 231, 165, 0.42) 0%, transparent 68%)',
              }}
            >
              <TeyvatImage
                src={dish.image}
                fallbackSrc={dish.fallbackImage}
                alt={dish.name}
                className="w-[132px] h-[132px] object-contain drop-shadow-[0_10px_14px_rgba(18,12,8,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* Warm Antique Parchment Dossier Card (#ECE5D8 framed with metallic gold hairline) */}
        <div className="px-3 -mt-4 relative z-20">
          <div className="rounded-[24px] bg-[#ECE5D8] border border-[#D3BC8E] ring-1 ring-[#5D5187]/45 p-3.5 shadow-lg space-y-3 text-[#232635]">
            {/* Title, 4-Point Diamond Stars, Region & Mora Price */}
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
                  className="font-genshin text-[11px] tracking-wide"
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
              className="rounded-2xl bg-[#F5F2EB] border border-[#CBB997] p-3.5 flex items-start gap-3"
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
                  <span className="text-[#9C5A14]">({dish.buffLabel})</span>
                </h2>
                <p className="text-[12px] text-[#454A5C] leading-relaxed mt-1">
                  {dish.effect}
                </p>
              </div>
            </section>

            {/* Italicized Lore Quote Block Framed with Delicate Gold Quotation Marks */}
            <section aria-labelledby="lore-heading">
              <h2
                id="lore-heading"
                className="font-genshin text-[13px] text-[#232635] mb-2"
              >
                Kisah &amp; Asal Hidangan
              </h2>
              <blockquote className="relative rounded-2xl bg-[#F5F2EB] border border-[#D3BC8E] px-5 py-3.5">
                <span
                  aria-hidden="true"
                  className="font-genshin absolute top-1.5 left-2.5 text-[24px] leading-none text-[#C8A86B]/90 select-none"
                >
                  &ldquo;
                </span>
                <p className="italic text-[12.5px] text-[#43485B] leading-relaxed px-2">
                  {dish.description}
                </p>
                <span
                  aria-hidden="true"
                  className="font-genshin absolute bottom-0.5 right-3 text-[24px] leading-none text-[#C8A86B]/90 select-none"
                >
                  &rdquo;
                </span>
              </blockquote>
            </section>

            <DiamondDivider />

            {/* Authentic Genshin Cooking Interface Ingredients Grid (Square Parchment Box + Dark Inlay + Bottom-Right Qty) */}
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
                    className="rounded-xl bg-[#F5F2EB] border border-[#CBB997] p-1.5 flex flex-col items-center text-center"
                  >
                    {/* Square Dark Inlay with Bottom-Right Quantity Tag */}
                    <div className="relative w-full aspect-square rounded-lg bg-[#2C283B] border border-[#5D5187]/70 flex items-center justify-center overflow-hidden p-1.5">
                      <TeyvatImage
                        src={ing.icon}
                        alt={ing.name}
                        className="w-9 h-9 object-contain"
                      />
                      <span className="font-genshin absolute bottom-0 right-0 px-1.5 py-0.5 rounded-tl-md bg-[#171421]/90 text-[#FFE7A5] text-[10px] leading-none tabular-nums border-t border-l border-[#D3BC8E]/45">
                        ×{ing.count * quantity}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#2B2D3A] leading-tight line-clamp-1 w-full mt-1.5">
                      {ing.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="px-4 py-3 bg-[#171421] border-t border-[#D3BC8E]/45 flex items-center gap-3 shrink-0">
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
          <span>Tambah — {formatMora(totalPrice)} Mora</span>
        </GoldCapsuleButton>
      </div>
    </div>
  );
};
