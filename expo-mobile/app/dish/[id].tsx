import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DiamondDivider,
  DiamondStarRow,
  GoldCapsuleButton,
  MoraAmount,
  RadialGlowBackdrop,
  TeyvatImage,
} from '../../components/TeyvatUI';
import {
  ASSET_ICONS,
  BUFF_META,
  DISHES,
  RARITY_META,
  formatMora,
} from '../../data/dishes';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import {
  CHROME_BAR_GRADIENT,
  COLORS,
  FONTS,
} from '../../theme/tokens';

export default function DishDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const favoriteIds = useDelicaciesStore((s) => s.favoriteIds);
  const toggleFavorite = useDelicaciesStore((s) => s.toggleFavorite);

  const [quantity, setQuantity] = useState(1);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  const numericId = Number(id);
  const dish = DISHES.find((d) => d.id === numericId) ?? DISHES[0];
  const isFavorite = favoriteIds.includes(dish.id);
  const rarityStyle = RARITY_META[dish.rarity];
  const buffMeta = BUFF_META[dish.buffType];
  const totalPrice = dish.priceMora * quantity;

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    router.back();
  };

  const handleOrderNow = () => {
    addToCart(dish, quantity);
    router.push('/checkout');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={rarityStyle.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: Math.max(insets.top + 8, 16) }]}
        >
          <Image
            source={ASSET_ICONS.dishDetailBg}
            style={styles.heroBgTexture}
            contentFit="cover"
          />
          <Image
            source={rarityStyle.bgAsset}
            style={styles.heroWatermark}
            contentFit="cover"
          />
          <LinearGradient
            colors={[
              'rgba(27, 34, 52, 0.52)',
              'rgba(27, 34, 52, 0.05)',
              'rgba(27, 34, 52, 0.44)',
            ]}
            style={StyleSheet.absoluteFill}
          />

          {/* Top Bar: Golden Back Arrow (router.back) & Favorite Toggle */}
          <View style={styles.heroHeader}>
            <Pressable
              onPress={() => router.back()}
              style={styles.circleBtn}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <ArrowLeft size={20} color={COLORS.goldBright} />
            </Pressable>

            <Text style={styles.heroHeaderTitle}>Dossier Resep</Text>

            <Pressable
              onPress={() => toggleFavorite(dish.id)}
              style={[
                styles.circleBtn,
                isFavorite && styles.circleBtnFavActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'
              }
            >
              <Heart
                size={20}
                color={isFavorite ? COLORS.favoriteCrimson : COLORS.goldBright}
                fill={isFavorite ? COLORS.favoriteCrimson : 'none'}
              />
            </Pressable>
          </View>

          {/* Large Transparent Dish Illustration with Radial Glow */}
          <View style={styles.heroDishArea}>
            <Animated.View
              style={[
                styles.heroDishGlowBox,
                { transform: [{ translateY: floatAnim }] },
              ]}
            >
              <RadialGlowBackdrop size={156} opacity={0.48} />
              <TeyvatImage
                source={dish.image}
                fallbackSource={dish.fallbackImage}
                style={styles.heroDishImg}
                contentFit="contain"
                accessibilityLabel={dish.name}
              />
            </Animated.View>
          </View>
        </LinearGradient>

        {/* Full-Bleed Ivory Parchment Dossier Surface */}
        <View style={styles.dossierSheet}>
          <View>
            <View style={styles.metaTopRow}>
              <DiamondStarRow rarity={dish.rarity} size={14} />
              <Text style={styles.metaRightText}>
                {dish.region} · {dish.category} · {dish.prepMinutes} mnt
              </Text>
            </View>

            <Text style={styles.dishTitle}>{dish.name}</Text>

            <View style={styles.priceRarityRow}>
              <MoraAmount
                amount={dish.priceMora}
                size="md"
                showSuffix
                color={COLORS.inkPrimary}
              />
              <Text style={[styles.rarityLabel, { color: rarityStyle.headerColor }]}>
                {rarityStyle.name} · Bintang {dish.rarity}
              </Text>
            </View>
          </View>

          <DiamondDivider />

          <View style={styles.buffCard}>
            <View
              style={[
                styles.buffIconBox,
                { backgroundColor: buffMeta.bgTint },
              ]}
            >
              <TeyvatImage
                source={dish.buffIcon ?? buffMeta.icon}
                fallbackSource={buffMeta.fallbackIcon}
                style={styles.buffIconImg}
                contentFit="contain"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.buffCardTitle}>
                {buffMeta.label}{' '}
                <Text style={{ color: COLORS.goldDeep }}>({dish.buffLabel})</Text>
              </Text>
              <Text style={styles.buffCardEffect}>{dish.effect}</Text>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Kisah &amp; Asal Hidangan</Text>
            <View style={styles.loreBox}>
              <Text style={styles.quoteMarkOpen}>“</Text>
              <Text style={styles.loreText}>{dish.description}</Text>
              <Text style={styles.quoteMarkClose}>”</Text>
            </View>
          </View>

          <DiamondDivider />

          <View style={styles.sectionBlock}>
            <View style={styles.ingredientsHeader}>
              <Text style={styles.sectionTitle}>Bahan Baku Resep</Text>
              <Text style={styles.ingredientsCount}>
                {dish.ingredients.length} bahan pilihan
              </Text>
            </View>

            <View style={styles.ingredientsGrid}>
              {dish.ingredients.map((ing) => (
                <View key={ing.name} style={styles.ingredientCard}>
                  <View style={styles.ingredientImgBox}>
                    <TeyvatImage
                      source={ing.icon}
                      style={styles.ingredientImg}
                      contentFit="contain"
                      accessibilityLabel={ing.name}
                    />
                    <View style={styles.ingredientQtyBadge}>
                      <Text style={styles.ingredientQtyText}>
                        ×{ing.count * quantity}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.ingredientName} numberOfLines={1}>
                    {ing.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Clean Genshin Bottom Sticky Action Bar (Stepper + Add to Cart + Direct Checkout) */}
      <LinearGradient
        colors={CHROME_BAR_GRADIENT}
        style={[
          styles.stickyFooter,
          { paddingBottom: Math.max(insets.bottom + 10, 14) },
        ]}
      >
        <View style={styles.footerTopRow}>
          {/* Portion Stepper */}
          <View style={styles.stepperPill}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.stepperBtn}
              accessibilityLabel="Kurangi jumlah porsi"
            >
              <Minus size={16} color={COLORS.goldBright} />
            </Pressable>
            <Text style={styles.stepperVal}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((q) => Math.min(99, q + 1))}
              style={styles.stepperBtn}
              accessibilityLabel="Tambah jumlah porsi"
            >
              <Plus size={16} color={COLORS.goldBright} />
            </Pressable>
          </View>

          {/* Secondary Direct Checkout Button (Stack: Detail -> Checkout) */}
          <Pressable
            onPress={handleOrderNow}
            style={({ pressed }) => [
              styles.orderNowBtn,
              pressed && { opacity: 0.88 },
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.orderNowText}>Pesan Sekarang</Text>
          </Pressable>
        </View>

        {/* Primary Gold Pill CTA: Add to Cart */}
        <GoldCapsuleButton onPress={handleAddToCart}>
          <ShoppingBag size={15} color="#2E3446" />
          <Text style={styles.addBtnText}>
            Tambah ke Keranjang — {formatMora(totalPrice)} Mora
          </Text>
        </GoldCapsuleButton>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.ivoryTop,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 14,
  },
  hero: {
    minHeight: 242,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  heroBgTexture: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.28,
  },
  heroWatermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.34,
  },
  heroHeader: {
    zIndex: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.chromePillBg,
    borderWidth: 1,
    borderColor: COLORS.chromePillBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnFavActive: {
    backgroundColor: COLORS.goldBright,
    borderColor: COLORS.goldBright,
  },
  heroHeaderTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 13.5,
    color: COLORS.inkIvory,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroDishArea: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
    paddingTop: 6,
  },
  heroDishGlowBox: {
    width: 156,
    height: 156,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDishImg: {
    width: 130,
    height: 130,
  },
  dossierSheet: {
    marginTop: -18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.ivoryTop,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 16,
  },
  metaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaRightText: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: '#5E6275',
  },
  dishTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 22,
    color: COLORS.inkPrimary,
    marginTop: 8,
    lineHeight: 28,
  },
  priceRarityRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rarityLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  buffCard: {
    borderRadius: 16,
    backgroundColor: COLORS.insetWarm,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  buffIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buffIconImg: {
    width: 24,
    height: 24,
  },
  buffCardTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkPrimary,
  },
  buffCardEffect: {
    fontSize: 12,
    color: '#454A5C',
    lineHeight: 18,
    marginTop: 4,
  },
  sectionBlock: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    color: COLORS.inkPrimary,
  },
  loreBox: {
    borderRadius: 16,
    backgroundColor: COLORS.insetWarm,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    paddingHorizontal: 20,
    paddingVertical: 14,
    position: 'relative',
  },
  quoteMarkOpen: {
    position: 'absolute',
    top: 4,
    left: 10,
    fontFamily: FONTS.genshin,
    fontSize: 24,
    color: 'rgba(200, 168, 107, 0.9)',
  },
  quoteMarkClose: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    fontFamily: FONTS.genshin,
    fontSize: 24,
    color: 'rgba(200, 168, 107, 0.9)',
  },
  loreText: {
    fontStyle: 'italic',
    fontSize: 12.5,
    color: '#43485B',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ingredientsCount: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: '#64697B',
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientCard: {
    width: '23%',
    borderRadius: 12,
    backgroundColor: COLORS.insetWarm,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    padding: 6,
    alignItems: 'center',
  },
  ingredientImgBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: COLORS.ingredientTile,
    borderWidth: 1,
    borderColor: 'rgba(200,168,107,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  ingredientImg: {
    width: 34,
    height: 34,
  },
  ingredientQtyBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderTopLeftRadius: 6,
    backgroundColor: '#242B3E',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(200,168,107,0.6)',
  },
  ingredientQtyText: {
    fontFamily: FONTS.genshin,
    fontSize: 9.5,
    color: COLORS.goldBright,
  },
  ingredientName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2B2D3A',
    marginTop: 5,
    textAlign: 'center',
  },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  footerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chromePillBg,
    borderWidth: 1,
    borderColor: COLORS.chromePillBorder,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    fontFamily: FONTS.genshin,
    minWidth: 26,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.inkIvory,
  },
  orderNowBtn: {
    flex: 1,
    minHeight: 42,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    backgroundColor: 'rgba(255,231,165,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  orderNowText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.goldBright,
  },
  addBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 12.5,
    color: '#2E3446',
  },
});
