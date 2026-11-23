import React, { useState } from 'react';
import { Home, ShoppingBag, User, UtensilsCrossed } from 'lucide-react';
import { ASSET_ICONS, BUFF_META, RARITY_META, formatMora } from '../data/dishes';
import { BuffType, Dish, DishRarity, TabId } from '../types';

/** Resilient Image Component: Local Asset -> Official CDN -> Styled Vector Crest */
interface TeyvatImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const TeyvatImage: React.FC<TeyvatImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'empty'>('primary');

  const activeSrc = stage === 'primary' ? src : fallbackSrc;

  if (stage === 'empty' || !activeSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-[#252136] text-[#FFE7A5] border border-[#FFE7A5]/30 rounded-lg ${className}`}
        aria-label={alt}
      >
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 fill-current opacity-80" aria-hidden="true">
          <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
        </svg>
        {fallbackLabel && <span className="sr-only">{fallbackLabel}</span>}
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        if (stage === 'primary' && fallbackSrc && fallbackSrc !== src) {
          setStage('fallback');
        } else {
          setStage('empty');
        }
      }}
    />
  );
};

/** Authentic 4-Point Genshin Diamond Star (Gold-Embossed, Never 5-point) */
export const DiamondStar: React.FC<{ size?: number; className?: string }> = ({
  size = 13,
  className = 'text-[#FFE7A5]',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`shrink-0 ${className}`}
    style={{ filter: 'drop-shadow(0 1px 1px rgba(29, 20, 10, 0.72))' }}
    aria-hidden="true"
  >
    <path
      d="M12 1.2L14.9 9.1L22.8 12L14.9 14.9L12 22.8L9.1 14.9L1.2 12L9.1 9.1L12 1.2Z"
      fill="currentColor"
      stroke="#9C6A1B"
      strokeWidth="0.9"
    />
  </svg>
);

export const DiamondStarRow: React.FC<{
  rarity: DishRarity;
  size?: number;
  className?: string;
}> = ({ rarity, size = 12, className = '' }) => (
  <div
    className={`inline-flex items-center gap-0.5 ${className}`}
    aria-label={`Tingkat kelangkaan bintang ${rarity}`}
  >
    {Array.from({ length: rarity }).map((_, idx) => (
      <DiamondStar key={idx} size={size} />
    ))}
  </div>
);

/** Diamond Bullet Ornament */
export const DiamondBullet: React.FC<{ className?: string; size?: number }> = ({
  className = 'text-[#C8A86B]',
  size = 8,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    className={`shrink-0 fill-current ${className}`}
    aria-hidden="true"
  >
    <path d="M6 0.5L11.5 6L6 11.5L0.5 6L6 0.5Z" />
  </svg>
);

/** Ornamental Genshin Hairline Divider with Centered Diamond */
export const DiamondDivider: React.FC<{
  dark?: boolean;
  className?: string;
}> = ({ dark = false, className = '' }) => (
  <div className={`flex items-center gap-2.5 ${className}`} aria-hidden="true">
    <div
      className={`h-px flex-1 ${
        dark
          ? 'bg-gradient-to-r from-transparent via-[#FFE7A5]/45 to-[#FFE7A5]/55'
          : 'bg-gradient-to-r from-transparent via-[#C9B694] to-[#C9B694]'
      }`}
    />
    <DiamondBullet
      size={7}
      className={dark ? 'text-[#FFE7A5]/85' : 'text-[#B29560]'}
    />
    <div
      className={`h-px flex-1 ${
        dark
          ? 'bg-gradient-to-l from-transparent via-[#FFE7A5]/45 to-[#FFE7A5]/55'
          : 'bg-gradient-to-l from-transparent via-[#C9B694] to-[#C9B694]'
      }`}
    />
  </div>
);

/** Authentic Rarity Header Banner with Triquetra Seal Watermark + Centered Radial Illumination */
export const RarityDishBanner: React.FC<{
  dish: Dish;
  heightClass?: string;
  imageSizeClass?: string;
  onClick?: () => void;
  showRegion?: boolean;
  alignImage?: 'center' | 'right';
}> = ({
  dish,
  heightClass = 'h-[112px]',
  imageSizeClass = 'w-[84px] h-[84px]',
  onClick,
  showRegion = true,
  alignImage = 'right',
}) => {
  const rarityStyle = RARITY_META[dish.rarity];

  const innerContent = (
    <>
      {/* Full 1*-5* Circular Triquetra Watermark Grading */}
      <img
        src={rarityStyle.bgAsset}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.35, mixBlendMode: 'overlay' }}
      />

      {/* Fine metallic gold bottom hairline separating banner & parchment body */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#FFE7A5]/70 pointer-events-none z-20"
        aria-hidden="true"
      />

      {/* Quiet Region Label Top-Left */}
      {showRegion && (
        <span className="absolute top-2 left-2.5 z-10 text-[10px] font-semibold tracking-wide text-[#FFF9EB] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {dish.region}
        </span>
      )}

      {/* Dish Transparent PNG with Centered Soft Radial Illumination (No blurry CSS glow) */}
      <div
        className={`absolute inset-0 flex items-center pointer-events-none ${
          alignImage === 'right' ? 'justify-end pr-2 pt-1' : 'justify-center'
        }`}
      >
        <div
          className="relative flex items-center justify-center rounded-full p-2"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 231, 165, 0.42) 0%, transparent 68%)',
          }}
        >
          <TeyvatImage
            src={dish.image}
            fallbackSrc={dish.fallbackImage}
            alt={dish.name}
            className={`${imageSizeClass} object-contain drop-shadow-[0_4px_6px_rgba(24,18,12,0.42)]`}
          />
        </div>
      </div>

      {/* Gold-Embossed 4-Point Diamond Stars Bottom-Left */}
      <div className="absolute bottom-2 left-2.5 z-10">
        <DiamondStarRow rarity={dish.rarity} size={11} />
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative ${heightClass} w-full text-left overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFE7A5]`}
        style={{ background: rarityStyle.gradient }}
        aria-label={`Lihat detail ${dish.name}`}
      >
        {innerContent}
      </button>
    );
  }

  return (
    <div
      className={`relative ${heightClass} w-full overflow-hidden`}
      style={{ background: rarityStyle.gradient }}
    >
      {innerContent}
    </div>
  );
};

/** Primary Gold Capsule CTA Button */
interface GoldCapsuleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const GoldCapsuleButton: React.FC<GoldCapsuleButtonProps> = ({
  children,
  fullWidth = true,
  className = '',
  disabled,
  ...rest
}) => (
  <button
    type="button"
    disabled={disabled}
    className={`teyvat-gold-btn min-h-[46px] px-5 py-2.5 rounded-full font-genshin text-[13px] tracking-wide font-bold inline-flex items-center justify-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECE5D8] disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap ${
      fullWidth ? 'w-full' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

/** Mora Currency Display with Official Coin Asset & HYWenHei Typography */
export const MoraAmount: React.FC<{
  amount: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showSuffix?: boolean;
}> = ({ amount, size = 'sm', className = '', showSuffix = false }) => {
  const iconSize =
    size === 'xs'
      ? 'w-3.5 h-3.5'
      : size === 'sm'
      ? 'w-4 h-4'
      : size === 'md'
      ? 'w-5 h-5'
      : 'w-6 h-6';
  const textSize =
    size === 'xs'
      ? 'text-[11px]'
      : size === 'sm'
      ? 'text-[13px]'
      : size === 'md'
      ? 'text-[15px]'
      : 'text-[18px]';

  return (
    <span
      className={`font-genshin inline-flex items-center gap-1 tabular-nums font-bold ${textSize} ${className}`}
    >
      <TeyvatImage
        src={ASSET_ICONS.mora}
        fallbackSrc={ASSET_ICONS.moraCdn}
        alt="Mora"
        className={`${iconSize} object-contain shrink-0`}
      />
      <span>{formatMora(amount)}</span>
      {showSuffix && <span className="font-normal opacity-85 text-[0.85em]">Mora</span>}
    </span>
  );
};

/** Official Combat Buff Indicator */
export const BuffBadge: React.FC<{
  buffType: BuffType;
  label: string;
  compact?: boolean;
}> = ({ buffType, label, compact = false }) => {
  const meta = BUFF_META[buffType];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-semibold whitespace-nowrap ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]'
      }`}
      style={{
        backgroundColor: meta.bgTint,
        color: '#2B2D3A',
      }}
    >
      <TeyvatImage
        src={meta.icon}
        fallbackSrc={meta.fallbackIcon}
        alt={meta.label}
        className={compact ? 'w-3.5 h-3.5 object-contain shrink-0' : 'w-4 h-4 object-contain shrink-0'}
      />
      <span className="truncate">{label}</span>
    </span>
  );
};

/** Floating Quick Cart Bar (Glassmorphic translucent pill bar above Bottom Nav) */
export const FloatingQuickCartBar: React.FC<{
  itemCount: number;
  totalMora: number;
  onOpenCart: () => void;
}> = ({ itemCount, totalMora, onOpenCart }) => {
  if (itemCount <= 0) return null;

  return (
    <div className="px-4 pb-3 pointer-events-auto animate-modal-enter">
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full min-h-[54px] px-3.5 py-2 rounded-2xl hoyolab-glass-bar border border-[#FFE7A5]/45 shadow-xl flex items-center justify-between gap-2 active:scale-[0.985] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#FFE7A5]/15 border border-[#FFE7A5]/55 flex items-center justify-center shrink-0 relative">
            <ShoppingBag className="w-4 h-4 text-[#FFE7A5]" />
            <span className="font-genshin absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C87C24] border border-[#FFE7A5] text-[10px] font-bold text-[#FFF9EB] flex items-center justify-center tabular-nums">
              {itemCount}
            </span>
          </div>
          <div className="text-left min-w-0">
            <div className="text-[10.5px] text-[#DCE2F2] leading-tight truncate">
              {itemCount} hidangan siap antar
            </div>
            <MoraAmount amount={totalMora} size="sm" className="text-[#FFE7A5]" />
          </div>
        </div>

        <span className="teyvat-gold-btn px-3.5 py-1.5 rounded-full font-genshin text-[11px] font-bold shrink-0 whitespace-nowrap">
          Buka Keranjang
        </span>
      </button>
    </div>
  );
};

/** 4-Tab Bottom Navigation Bar with HoYoLAB Glassmorphism & Delicate Hairline Gold Trim */
export const BottomNavBar: React.FC<{
  activeTab: TabId;
  cartCount: number;
  onSelectTab: (tab: TabId) => void;
}> = ({ activeTab, cartCount, onSelectTab }) => {
  const tabs: Array<{
    id: TabId;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'beranda', label: 'Beranda', Icon: Home },
    { id: 'katalog', label: 'Katalog', Icon: UtensilsCrossed },
    { id: 'keranjang', label: 'Keranjang', Icon: ShoppingBag },
    { id: 'profil', label: 'Profil', Icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="h-[66px] hoyolab-glass-bar border-t border-[#FFE7A5]/25 grid grid-cols-4 items-center px-2 shrink-0"
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={id === 'keranjang' && cartCount > 0 ? `${label} (${cartCount} item)` : label}
            className={`relative min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
              isActive
                ? 'text-[#FFE7A5]'
                : 'text-[#A6B0C9] hover:text-[#F7F4EE]'
            }`}
          >
            {isActive && (
              <span
                className="absolute top-0.5 w-8 h-[2px] rounded-full bg-[#FFE7A5]"
                aria-hidden="true"
              />
            )}
            <div className="relative">
              <Icon className="w-[19px] h-[19px]" />
              {id === 'keranjang' && cartCount > 0 && (
                <span className="font-genshin absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C87C24] border border-[#FFE7A5] text-[9px] font-bold text-[#FFF9EB] flex items-center justify-center tabular-nums">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="font-genshin text-[10px] tracking-tight whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

/** Subtle Ivory Parchment Toast Notification */
export const TeyvatToast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute top-16 left-4 right-4 z-50 pointer-events-none flex justify-center animate-modal-enter"
    >
      <div className="px-3.5 py-2 rounded-xl bg-[#F7F4EE] border border-[#D3BC8E] shadow-lg flex items-center gap-2 max-w-[360px]">
        <DiamondBullet size={7} className="text-[#C87C24]" />
        <span className="text-[12px] font-semibold text-[#232635] leading-snug">
          {message}
        </span>
      </div>
    </div>
  );
};
