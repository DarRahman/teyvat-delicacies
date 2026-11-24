import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Image, ImageContentFit } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingBag, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { ASSET_ICONS, BUFF_META, RARITY_META, formatMora } from '../data/dishes';
import {
  CHROME_BAR_GRADIENT,
  COLORS,
  FONTS,
  GOLD_BUTTON_GRADIENT,
  PARCHMENT_BG_GRADIENT,
} from '../theme/tokens';
import { AssetSource, BuffType, Dish, DishRarity } from '../types';

/** Resilient Native Image Component using expo-image */
interface TeyvatImageProps {
  source: AssetSource;
  fallbackSource?: AssetSource;
  style?: StyleProp<any>;
  contentFit?: ImageContentFit;
  accessibilityLabel?: string;
}

export const TeyvatImage: React.FC<TeyvatImageProps> = ({
  source,
  fallbackSource,
  style,
  contentFit = 'contain',
  accessibilityLabel,
}) => {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'empty'>('primary');

  useEffect(() => {
    setStage('primary');
  }, [source, fallbackSource]);

  const activeSource = stage === 'primary' ? source : fallbackSource;

  if (stage === 'empty' || !activeSource) {
    return (
      <View
        style={[styles.fallbackCrest, style]}
        accessibilityLabel={accessibilityLabel}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path
            d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z"
            fill={COLORS.goldBright}
            opacity={0.85}
          />
        </Svg>
      </View>
    );
  }

  return (
    <Image
      source={activeSource}
      style={style}
      contentFit={contentFit}
      transition={120}
      accessibilityLabel={accessibilityLabel}
      onError={() => {
        if (stage === 'primary' && fallbackSource && fallbackSource !== source) {
          setStage('fallback');
        } else {
          setStage('empty');
        }
      }}
    />
  );
};

/** Shared Parchment Screen Shell ensuring 100% uniform header & parchment canvas */
export const ParchmentScreen: React.FC<{
  header?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ header, children, style }) => {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={PARCHMENT_BG_GRADIENT} style={[styles.parchmentScreen, style]}>
      {header ? (
        <LinearGradient
          colors={CHROME_BAR_GRADIENT}
          style={[styles.parchmentHeader, { paddingTop: Math.max(insets.top + 10, 18) }]}
        >
          {header}
        </LinearGradient>
      ) : null}
      {children}
    </LinearGradient>
  );
};

/** Shared Ivory Parchment Card ensuring identical radius, border, and shadow across all screens */
export const ParchmentCard: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => (
  <View style={[styles.parchmentCard, style]}>{children}</View>
);

/** Shared Warm Parchment Icon Container (unifies Mora Tunai & Kartu Northland Bank icons) */
export const ParchmentIconBox: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ children, size = 40, style }) => (
  <View
    style={[
      styles.parchmentIconBox,
      { width: size, height: size, borderRadius: Math.round(size * 0.3) },
      style,
    ]}
  >
    {children}
  </View>
);

/** Shared Ornamental Genshin Modal Sheet used by Namecard Picker, Teyvat Map, Paimon's Bargains & Settings */
export const TeyvatModalSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  ornamentSource?: AssetSource;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeight?: `${number}%`;
}> = ({
  visible,
  onClose,
  title,
  subtitle,
  ornamentSource,
  children,
  footer,
  maxHeight = '88%',
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalBackdrop}>
      <View style={[styles.modalSheet, { maxHeight }]}>
        <LinearGradient colors={CHROME_BAR_GRADIENT} style={styles.modalHeader}>
          <View style={styles.modalHeaderLeft}>
            <TeyvatImage
              source={ornamentSource ?? ASSET_ICONS.modalOrnament}
              fallbackSource={ASSET_ICONS.crownOfInsight}
              style={styles.modalOrnamentIcon}
              contentFit="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={styles.modalSub} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          </View>

          <Pressable
            onPress={onClose}
            style={styles.modalCloseBtn}
            accessibilityRole="button"
            accessibilityLabel={`Tutup ${title}`}
          >
            <X size={16} color={COLORS.goldBright} />
          </Pressable>
        </LinearGradient>

        {children}

        {footer ? <View style={styles.modalFooter}>{footer}</View> : null}
      </View>
    </View>
  </Modal>
);

/** Authentic Genshin Impact Teleport Waypoint Vector Crest (crisp at any DPI) */
export const TeleportWaypointIcon: React.FC<{
  size?: number;
  active?: boolean;
  color?: string;
  outlineColor?: string;
}> = ({ size = 22, active = false, color, outlineColor }) => {
  const fill = color ?? (active ? '#FFE7A5' : '#4FD6FF');
  const stroke = outlineColor ?? (active ? '#22283A' : '#18344D');
  const innerFill = active ? '#FFF9E6' : '#E3FAFF';

  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      {/* Upper Waypoint Spire Diamond */}
      <Path
        d="M14 2L17.4 8.4L14 11.4L10.6 8.4L14 2Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={1.35}
        strokeLinejoin="round"
      />
      {/* Central Floating Teleport Rhombus Core */}
      <Path
        d="M14 10.6L19.4 15.8L14 26L8.6 15.8L14 10.6Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      {/* Luminous Inner Facet */}
      <Path
        d="M14 13.4L16.4 15.9L14 21.2L11.6 15.9L14 13.4Z"
        fill={innerFill}
      />
      {/* Side Energy Wings */}
      <Path
        d="M6.4 13.2L9.2 14.8L8.1 17.2L5.3 15.5L6.4 13.2Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
      <Path
        d="M21.6 13.2L18.8 14.8L19.9 17.2L22.7 15.5L21.6 13.2Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

/** Authentic 4-Point Genshin Diamond Star */
export const DiamondStar: React.FC<{
  size?: number;
  color?: string;
  strokeColor?: string;
}> = ({ size = 13, color = COLORS.goldBright, strokeColor = '#9C6A1B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M12 1.2L14.9 9.1L22.8 12L14.9 14.9L12 22.8L9.1 14.9L1.2 12L9.1 9.1L12 1.2Z"
      fill={color}
      stroke={strokeColor}
      strokeWidth={0.9}
    />
  </Svg>
);

export const DiamondStarRow: React.FC<{
  rarity: DishRarity;
  size?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ rarity, size = 12, style }) => (
  <View
    style={[styles.starRow, style]}
    accessibilityLabel={`Tingkat kelangkaan bintang ${rarity}`}
  >
    {Array.from({ length: rarity }).map((_, idx) => (
      <DiamondStar key={idx} size={size} />
    ))}
  </View>
);

/** Diamond Bullet Ornament */
export const DiamondBullet: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 8, color = COLORS.goldBorder }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12">
    <Path d="M6 0.5L11.5 6L6 11.5L0.5 6L6 0.5Z" fill={color} />
  </Svg>
);

/** Ornamental Genshin Hairline Divider with Centered Diamond */
export const DiamondDivider: React.FC<{
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ dark = false, style }) => (
  <View style={[styles.dividerRow, style]}>
    <LinearGradient
      colors={
        dark
          ? ['rgba(255,231,165,0)', 'rgba(255,231,165,0.55)']
          : ['rgba(201,182,148,0)', '#C9B694']
      }
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.dividerLine}
    />
    <DiamondBullet size={7} color={dark ? '#FFE7A5' : '#B29560'} />
    <LinearGradient
      colors={
        dark
          ? ['rgba(255,231,165,0.55)', 'rgba(255,231,165,0)']
          : ['#C9B694', 'rgba(201,182,148,0)']
      }
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.dividerLine}
    />
  </View>
);

/** Soft Centered Golden Radial Illumination Backdrop */
export const RadialGlowBackdrop: React.FC<{
  size: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ size, opacity = 0.45, style }) => (
  <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.centerAll, style]}>
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFE7A5" stopOpacity={opacity} />
          <Stop offset="68%" stopColor="#FFE7A5" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="100" fill="url(#glowGrad)" />
    </Svg>
  </View>
);

/** Authentic Rarity Header Banner with Triquetra Seal Watermark + Radial Glow */
export const RarityDishBanner: React.FC<{
  dish: Dish;
  height?: number;
  imageSize?: number;
  onPress?: () => void;
  showRegion?: boolean;
  alignImage?: 'center' | 'right';
  style?: StyleProp<ViewStyle>;
}> = ({
  dish,
  height = 112,
  imageSize = 80,
  onPress,
  showRegion = true,
  alignImage = 'right',
  style,
}) => {
  const rarityStyle = RARITY_META[dish.rarity];

  const inner = (
    <LinearGradient
      colors={rarityStyle.gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.bannerWrap, { height }, style]}
    >
      {/* Circular Triquetra Watermark Grading */}
      <Image
        source={rarityStyle.bgAsset}
        style={styles.watermarkImg}
        contentFit="cover"
        pointerEvents="none"
      />

      {/* Quiet Region Label Top-Left */}
      {showRegion && (
        <Text style={styles.bannerRegionLabel} numberOfLines={1}>
          {dish.region}
        </Text>
      )}

      {/* Dish Transparent PNG with Centered Soft Radial Illumination */}
      <View
        pointerEvents="none"
        style={[
          styles.bannerImageWrap,
          alignImage === 'right'
            ? { justifyContent: 'flex-end', paddingRight: 8, paddingTop: 4 }
            : { justifyContent: 'center' },
        ]}
      >
        <View
          style={{
            width: imageSize + 18,
            height: imageSize + 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RadialGlowBackdrop size={imageSize + 18} opacity={0.44} />
          <TeyvatImage
            source={dish.image}
            fallbackSource={dish.fallbackImage}
            style={{ width: imageSize, height: imageSize }}
            contentFit="contain"
            accessibilityLabel={dish.name}
          />
        </View>
      </View>

      {/* Gold-Embossed 4-Point Diamond Stars Bottom-Left */}
      <View style={styles.bannerStarsWrap}>
        <DiamondStarRow rarity={dish.rarity} size={11} />
      </View>

      {/* Fine metallic gold bottom hairline */}
      <View style={styles.bannerGoldLine} pointerEvents="none" />
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Lihat detail ${dish.name}`}
        style={({ pressed }) => [pressed && { opacity: 0.92 }]}
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
};

/** Primary Gold Capsule CTA Button */
export const GoldCapsuleButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}> = ({ children, onPress, disabled = false, style, contentStyle, textStyle }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    style={({ pressed }) => [
      styles.goldBtnOuter,
      disabled && { opacity: 0.45 },
      pressed && !disabled && { transform: [{ scale: 0.985 }] },
      style,
    ]}
  >
    <LinearGradient
      colors={GOLD_BUTTON_GRADIENT}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.goldBtnGradient, contentStyle]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.goldBtnText, textStyle]} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        children
      )}
    </LinearGradient>
  </Pressable>
);

/** Mora Currency Display with Official Coin Asset & HYWenHei Typography */
export const MoraAmount: React.FC<{
  amount: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  showSuffix?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ amount, size = 'sm', color = COLORS.inkPrimary, showSuffix = false, style }) => {
  const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'md' ? 20 : 24;
  const fontSize = size === 'xs' ? 11.5 : size === 'sm' ? 13 : size === 'md' ? 15 : 18;

  return (
    <View style={[styles.moraRow, style]}>
      <TeyvatImage
        source={ASSET_ICONS.mora}
        fallbackSource={ASSET_ICONS.moraCdn}
        style={{ width: iconSize, height: iconSize }}
        contentFit="contain"
        accessibilityLabel="Mora"
      />
      <Text
        style={[styles.moraText, { fontSize, color }]}
        numberOfLines={1}
      >
        {formatMora(amount)}
        {showSuffix ? ' Mora' : ''}
      </Text>
    </View>
  );
};

/** Official Combat Buff Indicator */
export const BuffBadge: React.FC<{
  buffType: BuffType;
  label: string;
  iconSource?: AssetSource;
  compact?: boolean;
}> = ({ buffType, label, iconSource, compact = false }) => {
  const meta = BUFF_META[buffType];
  return (
    <View
      style={[
        styles.buffBadge,
        {
          backgroundColor: meta.bgTint,
          paddingHorizontal: compact ? 6 : 8,
          paddingVertical: compact ? 3 : 4,
        },
      ]}
    >
      <TeyvatImage
        source={iconSource ?? meta.icon}
        fallbackSource={meta.fallbackIcon}
        style={{ width: compact ? 14 : 16, height: compact ? 14 : 16 }}
        contentFit="contain"
        accessibilityLabel={meta.label}
      />
      <Text
        style={[styles.buffBadgeText, { fontSize: compact ? 10 : 11 }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

/** Authentic Genshin Wind Glider Wing Crest SVG */
export const WindGliderIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = COLORS.goldBright,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28">
    <Path
      d="M14 7.5C11.2 6.8 6.4 7.6 3 10.6C5.5 11.4 8 12.1 10.4 13.4C7.9 14.2 5.9 15.5 4.4 17.3C7.8 17.2 10.9 16.4 13.4 14.9L14 19.8L14.6 14.9C17.1 16.4 20.2 17.2 23.6 17.3C22.1 15.5 20.1 14.2 17.6 13.4C20 12.1 22.5 11.4 25 10.6C21.6 7.6 16.8 6.8 14 7.5Z"
      fill={color}
    />
    <Path d="M14 4.2L15.4 7.5L14 9.5L12.6 7.5L14 4.2Z" fill={COLORS.goldBright} />
  </Svg>
);

/** Floating Quick Cart Bar above Bottom Tab Navigation */
export const FloatingQuickCartBar: React.FC<{
  itemCount: number;
  totalMora: number;
  onOpenCart: () => void;
}> = ({ itemCount, totalMora, onOpenCart }) => {
  if (itemCount <= 0) return null;

  return (
    <View style={styles.quickCartContainer} pointerEvents="box-none">
      <Pressable
        onPress={onOpenCart}
        accessibilityRole="button"
        accessibilityLabel="Buka Keranjang"
        style={({ pressed }) => [pressed && { transform: [{ scale: 0.985 }] }]}
      >
        <LinearGradient
          colors={CHROME_BAR_GRADIENT}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.quickCartBar}
        >
          <View style={styles.quickCartLeft}>
            <View style={styles.quickCartIconCircle}>
              <ShoppingBag size={16} color={COLORS.goldBright} />
              <View style={styles.quickCartBadge}>
                <Text style={styles.quickCartBadgeText}>{itemCount}</Text>
              </View>
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.quickCartSubtitle} numberOfLines={1}>
                {itemCount} hidangan siap antar
              </Text>
              <MoraAmount amount={totalMora} size="sm" color={COLORS.goldBright} />
            </View>
          </View>

          <LinearGradient
            colors={GOLD_BUTTON_GRADIENT}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.quickCartCta}
          >
            <Text style={styles.quickCartCtaText}>Buka Keranjang</Text>
          </LinearGradient>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

/** Luminous Ivory Parchment Toast Notification */
export const TeyvatToast: React.FC<{ message: string | null; bottomOffset?: number }> = ({
  message,
  bottomOffset = 84,
}) => {
  if (!message) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.toastWrap, { bottom: bottomOffset }]}
    >
      <View style={styles.toastCard}>
        <DiamondBullet size={7} color={COLORS.goldWarm} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parchmentScreen: {
    flex: 1,
  },
  parchmentHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  parchmentCard: {
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 15,
    shadowColor: '#443824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  parchmentIconBox: {
    backgroundColor: COLORS.insetTrack,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 34, 52, 0.74)',
    justifyContent: 'center',
    padding: 16,
  },
  modalSheet: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: COLORS.parchmentMid,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalOrnamentIcon: {
    width: 28,
    height: 28,
  },
  modalTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 14.5,
    color: COLORS.goldBright,
  },
  modalSub: {
    fontSize: 10.5,
    color: COLORS.navSubtext,
    marginTop: 1,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.ivoryBottom,
    borderTopWidth: 1,
    borderTopColor: '#E2D8C5',
  },
  centerAll: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackCrest: {
    backgroundColor: '#252136',
    borderWidth: 1,
    borderColor: 'rgba(255,231,165,0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    height: 1,
    flex: 1,
  },
  bannerWrap: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  watermarkImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.32,
  },
  bannerRegionLabel: {
    position: 'absolute',
    top: 8,
    left: 10,
    zIndex: 10,
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF9EB',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerImageWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerStarsWrap: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    zIndex: 10,
  },
  bannerGoldLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1.5,
    backgroundColor: 'rgba(255, 231, 165, 0.7)',
    zIndex: 20,
  },
  goldBtnOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
    shadowColor: '#4A3A1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  goldBtnGradient: {
    minHeight: 46,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  goldBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    color: '#2E3446',
    letterSpacing: 0.2,
  },
  moraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moraText: {
    fontFamily: FONTS.genshin,
    fontVariant: ['tabular-nums'],
  },
  buffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: 6,
    maxWidth: '100%',
  },
  buffBadgeText: {
    fontFamily: FONTS.genshin,
    color: '#2B2D3A',
    flexShrink: 1,
  },
  quickCartContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 10,
    zIndex: 30,
  },
  quickCartBar: {
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,231,165,0.32)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    shadowColor: '#202638',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  quickCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  quickCartIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,231,165,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  quickCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: COLORS.goldWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCartBadgeText: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: '#FFF9EB',
  },
  quickCartSubtitle: {
    fontSize: 10.5,
    color: '#DCE2F2',
    marginBottom: 1,
  },
  quickCartCta: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
  },
  quickCartCtaText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#2E3446',
  },
  toastWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99,
    alignItems: 'center',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    shadowColor: '#242735',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    maxWidth: 360,
  },
  toastText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.inkBody,
    flexShrink: 1,
  },
});
