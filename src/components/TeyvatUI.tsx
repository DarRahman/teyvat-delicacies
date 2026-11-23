import React, { useState } from 'react';
import { Compass, ShoppingBag, User, UtensilsCrossed } from 'lucide-react';
import { ASSET_ICONS, BUFF_META, formatMora } from '../data/dishes';
import { BuffType, DishRarity, TabId } from '../types';

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

/** Authentic 4-Point Genshin Diamond Star (Never 5-point cartoon stars) */
export const DiamondStar: React.FC<{ size?: number; className?: string }> = ({
  size = 13,
  className = 'text-[#FFE7A5]',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`shrink-0 fill-current drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] ${className}`}
    aria-hidden="true"
  >
    <path d="M12 1.5L14.9 9.1L22.5 12L14.9 14.9L12 22.5L9.1 14.9L1.5 12L9.1 9.1L12 1.5Z" />
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
  className = 'text-[#D3BC8E]',
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
          ? 'bg-gradient-to-r from-transparent via-[#FFE7A5]/40 to-[#FFE7A5]/50'
          : 'bg-gradient-to-r from-transparent via-[#B8A98E]/70 to-[#B8A98E]'
      }`}
    />
    <DiamondBullet
      size={7}
      className={dark ? 'text-[#FFE7A5]/80' : 'text-[#A9926A]'}
    />
    <div
      className={`h-px flex-1 ${
        dark
          ? 'bg-gradient-to-l from-transparent via-[#FFE7A5]/40 to-[#FFE7A5]/50'
          : 'bg-gradient-to-l from-transparent via-[#B8A98E]/70 to-[#B8A98E]'
      }`}
    />
  </div>
);

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
    className={`teyvat-gold-btn min-h-[46px] px-5 py-2.5 rounded-full font-genshin text-[13px] tracking-wide font-bold inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171421] disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap ${
      fullWidth ? 'w-full' : ''
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

/** Mora Currency Display with Official Coin Asset */
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
    <span className={`inline-flex items-center gap-1 tabular-nums font-bold ${textSize} ${className}`}>
      <TeyvatImage
        src={ASSET_ICONS.mora}
        fallbackSrc={ASSET_ICONS.moraCdn}
        alt="Mora"
        className={`${iconSize} object-contain shrink-0`}
      />
      <span>{formatMora(amount)}</span>
      {showSuffix && <span className="font-normal opacity-80 text-[0.85em]">Mora</span>}
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

/** Floating Quick Cart Bar (appears above bottom nav when cart has items) */
export const FloatingQuickCartBar: React.FC<{
  itemCount: number;
  totalMora: number;
  onOpenCart: () => void;
}> = ({ itemCount, totalMora, onOpenCart }) => {
  if (itemCount <= 0) return null;

  return (
    <div className="px-3 pb-2 pointer-events-auto animate-modal-enter">
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full min-h-[52px] px-3.5 py-2 rounded-2xl bg-[#252038]/95 border border-[#FFE7A5]/70 shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-md flex items-center justify-between gap-2 active:scale-[0.985] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#FFE7A5]/15 border border-[#FFE7A5]/60 flex items-center justify-center shrink-0 relative">
            <ShoppingBag className="w-4 h-4 text-[#FFE7A5]" />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C87C24] border border-[#FFE7A5] text-[10px] font-bold text-[#FFF9EB] flex items-center justify-center tabular-nums">
              {itemCount}
            </span>
          </div>
          <div className="text-left min-w-0">
            <div className="text-[10px] text-[#CFC7DE] leading-tight truncate">
              {itemCount} hidangan siap antar
            </div>
            <MoraAmount amount={totalMora} size="sm" className="text-[#FFE7A5]" />
          </div>
        </div>

        <span className="teyvat-gold-btn px-3 py-1.5 rounded-full font-genshin text-[11px] font-bold shrink-0 whitespace-nowrap">
          Buka Tas Petualang
        </span>
      </button>
    </div>
  );
};

/** 4-Tab Bottom Navigation Bar */
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
    { id: 'catalog', label: 'Katalog', Icon: UtensilsCrossed },
    { id: 'explore', label: 'Eksplorasi', Icon: Compass },
    { id: 'cart', label: 'Tas', Icon: ShoppingBag },
    { id: 'profile', label: 'Profil', Icon: User },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="h-[64px] bg-[#171421]/95 backdrop-blur-md border-t border-[#5D5187]/55 grid grid-cols-4 items-center px-2 shrink-0"
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectTab(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7A5] ${
              isActive
                ? 'text-[#FFE7A5]'
                : 'text-[#9B93B2] hover:text-[#E9E5DC]'
            }`}
          >
            {isActive && (
              <span
                className="absolute top-0.5 w-6 h-[2px] rounded-full bg-[#FFE7A5]"
                aria-hidden="true"
              />
            )}
            <div className="relative">
              <Icon className="w-[20px] h-[20px]" />
              {id === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C87C24] border border-[#FFE7A5] text-[9px] font-bold text-[#FFF9EB] flex items-center justify-center tabular-nums">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

/** Subtle Parchment Toast Notification */
export const TeyvatToast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute top-16 left-4 right-4 z-50 pointer-events-none flex justify-center animate-modal-enter"
    >
      <div className="px-3.5 py-2 rounded-xl bg-[#252038]/95 border border-[#FFE7A5]/70 shadow-xl flex items-center gap-2 max-w-[360px]">
        <DiamondBullet size={7} className="text-[#FFE7A5]" />
        <span className="text-[12px] font-medium text-[#F5F2EB] leading-snug">
          {message}
        </span>
      </div>
    </div>
  );
};
