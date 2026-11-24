import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BuffBadge,
  DiamondDivider,
  DiamondStar,
  FloatingQuickCartBar,
  GoldCapsuleButton,
  MoraAmount,
  RadialGlowBackdrop,
  RarityDishBanner,
  TeyvatImage,
} from '../../components/TeyvatUI';
import { LOCAL_ASSETS } from '../../data/assets';
import {
  ASSET_ICONS,
  BUFF_META,
  DISHES,
  TOP_RECOMMENDATION_IDS,
} from '../../data/dishes';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import {
  CHROME_BAR_GRADIENT,
  COLORS,
  FONTS,
  GOLD_BUTTON_GRADIENT,
  HERO_FESTIVAL_GRADIENT,
  PARCHMENT_BG_GRADIENT,
} from '../../theme/tokens';
import { AssetSource, BuffType, DishCategory } from '../../types';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const profile = useDelicaciesStore((s) => s.profile);
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const setCatalogPreset = useDelicaciesStore((s) => s.setCatalogPreset);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  // Reactive subscriptions for FloatingQuickCartBar
  useDelicaciesStore((s) => s.cart);
  useDelicaciesStore((s) => s.selectedDeliveryPointId);
  useDelicaciesStore((s) => s.appliedCouponCode);
  useDelicaciesStore((s) => s.voucherUsageCount);

  const totals = getCartTotals();
  const featuredDish = DISHES.find((d) => d.id === 5101) ?? DISHES[0];
  const topFive = TOP_RECOMMENDATION_IDS.map((id) =>
    DISHES.find((d) => d.id === id)
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  const openCatalogFiltered = (preset: {
    category?: 'All Dishes' | DishCategory;
    buff?: BuffType | null;
    region?: null;
  }) => {
    setCatalogPreset(preset);
    router.navigate('/(tabs)/catalog');
  };

  const openDishDetail = (dishId: number) => {
    router.push({
      pathname: '/dish/[id]',
      params: { id: String(dishId) },
    });
  };

  const quickShortcuts: Array<{
    label: string;
    subtitle: string;
    icon: AssetSource;
    fallbackIcon?: string;
    onPress: () => void;
  }> = [
    {
      label: 'Menu Utama',
      subtitle: 'Santapan utama',
      icon: LOCAL_ASSETS.dishes.sweetMadame,
      onPress: () => openCatalogFiltered({ category: 'Main Dish', buff: null }),
    },
    {
      label: 'Camilan',
      subtitle: 'Kudapan penjelajah',
      icon: LOCAL_ASSETS.dishes.triColorDango,
      onPress: () => openCatalogFiltered({ category: 'Snacks', buff: null }),
    },
    {
      label: 'Minuman',
      subtitle: 'Segar khas Teyvat',
      icon: LOCAL_ASSETS.dishes.dangoMilk,
      onPress: () => openCatalogFiltered({ category: 'Beverages', buff: null }),
    },
    {
      label: 'ATK Boost',
      subtitle: 'Khasiat tempur',
      icon: BUFF_META.ATK.icon,
      fallbackIcon: BUFF_META.ATK.fallbackIcon,
      onPress: () => openCatalogFiltered({ category: 'All Dishes', buff: 'ATK' }),
    },
  ];

  return (
    <LinearGradient colors={PARCHMENT_BG_GRADIENT} style={styles.screen}>
      {/* Clean Genshin Charcoal-Indigo Traveler Header */}
      <LinearGradient
        colors={CHROME_BAR_GRADIENT}
        style={[styles.header, { paddingTop: Math.max(insets.top + 10, 18) }]}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.navigate('/(tabs)/profile')}
            style={styles.travelerBtn}
            accessibilityRole="button"
            accessibilityLabel="Buka Profil Petualang"
          >
            <View style={styles.avatarRing}>
              <TeyvatImage
                source={profile.avatarUrl}
                fallbackSource={profile.fallbackAvatarUrl}
                style={styles.avatarImg}
                contentFit="cover"
                accessibilityLabel={profile.username}
              />
            </View>
            <View style={styles.travelerInfo}>
              <Text style={styles.travelerRank} numberOfLines={1}>
                Traveler · AR {profile.adventureRank}
              </Text>
              <Text style={styles.travelerName} numberOfLines={1}>
                {profile.username}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.navigate('/(tabs)/profile')}
            style={styles.moraHeaderBtn}
            accessibilityRole="button"
            accessibilityLabel="Saldo Mora Aktif"
          >
            <MoraAmount
              amount={profile.moraBalance}
              size="sm"
              color={COLORS.goldBright}
            />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Edge-to-Edge Warm Antique Parchment Scrollable Canvas */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: totals.itemCount > 0 ? 96 : 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Culinary Festival Hero Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={HERO_FESTIVAL_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroTop}
          >
            <Image
              source={LOCAL_ASSETS.icons.bg5Star}
              style={styles.heroWatermark}
              contentFit="cover"
              pointerEvents="none"
            />
            <View style={styles.heroRow}>
              <View style={styles.heroCopy}>
                <View style={styles.heroTagRow}>
                  <DiamondStar size={9} />
                  <Text style={styles.heroTag}>FESTIVAL KULINER LIYUE</Text>
                </View>
                <Text style={styles.heroTitle}>Jamuan Hangat Para Adeptus</Text>
                <Text style={styles.heroDesc}>
                  Teyvat Delicacies · Gunakan kupon{' '}
                  <Text style={styles.heroCode}>PAIMONKENYANG</Text> untuk potongan 20% seluruh hidangan.
                </Text>
              </View>

              <View style={styles.heroDishWrap}>
                <RadialGlowBackdrop size={88} opacity={0.5} />
                <TeyvatImage
                  source={featuredDish.image}
                  fallbackSource={featuredDish.fallbackImage}
                  style={styles.heroDishImg}
                  contentFit="contain"
                  accessibilityLabel={featuredDish.name}
                />
              </View>
            </View>
          </LinearGradient>

          <View style={styles.heroFooter}>
            <View style={styles.heroFooterLeft}>
              <TeyvatImage
                source={ASSET_ICONS.intertwinedFate}
                fallbackSource={ASSET_ICONS.intertwinedFateCdn}
                style={styles.heroFooterIcon}
                contentFit="contain"
              />
              <Text style={styles.heroFooterText} numberOfLines={1}>
                Lokal Liyue 0 Mora · Glider 6–24 mnt
              </Text>
            </View>
            <Pressable
              onPress={() => openDishDetail(featuredDish.id)}
              style={styles.heroLinkBtn}
              accessibilityRole="button"
            >
              <Text style={styles.heroLinkText}>Lihat Menu</Text>
              <ArrowRight size={14} color={COLORS.goldDeep} />
            </Pressable>
          </View>
        </View>

        {/* Quick Category Shortcuts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategori Cepat</Text>
            <Pressable
              onPress={() =>
                openCatalogFiltered({ category: 'All Dishes', buff: null, region: null })
              }
              accessibilityRole="button"
            >
              <Text style={styles.sectionLink}>Semua Katalog</Text>
            </Pressable>
          </View>

          <View style={styles.shortcutGrid}>
            {quickShortcuts.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.shortcutCard,
                  pressed && { transform: [{ scale: 0.985 }] },
                ]}
                accessibilityRole="button"
              >
                <View style={styles.shortcutIconBox}>
                  <RadialGlowBackdrop size={40} opacity={0.45} />
                  <TeyvatImage
                    source={item.icon}
                    fallbackSource={item.fallbackIcon}
                    style={styles.shortcutIcon}
                    contentFit="contain"
                    accessibilityLabel={item.label}
                  />
                </View>
                <View style={styles.shortcutCopy}>
                  <Text style={styles.shortcutLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={styles.shortcutSub} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <DiamondDivider />

        {/* Top 5 Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>5 Rekomendasi Terbaik</Text>
            <Text style={styles.sectionSubNote}>Pilihan Chef Xiangling</Text>
          </View>

          <View style={styles.recoList}>
            {topFive.map((dish, index) => (
              <View key={dish.id} style={styles.recoCard}>
                <View style={styles.recoLeftBanner}>
                  <RarityDishBanner
                    dish={dish}
                    height={112}
                    imageSize={66}
                    showRegion={false}
                    alignImage="center"
                    onPress={() => openDishDetail(dish.id)}
                  />
                </View>

                <View style={styles.recoRightBody}>
                  <Pressable
                    onPress={() => openDishDetail(dish.id)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.recoMeta} numberOfLines={1}>
                      0{index + 1} · {dish.region} · {dish.category}
                    </Text>
                    <Text style={styles.recoName} numberOfLines={1}>
                      {dish.name}
                    </Text>
                    <View style={{ marginTop: 4 }}>
                      <BuffBadge
                        buffType={dish.buffType}
                        label={dish.buffLabel}
                        iconSource={dish.buffIcon}
                        compact
                      />
                    </View>
                  </Pressable>

                  <View style={styles.recoBottomRow}>
                    <MoraAmount
                      amount={dish.priceMora}
                      size="sm"
                      color={COLORS.inkPrimary}
                    />
                    <Pressable
                      onPress={() => addToCart(dish, 1)}
                      accessibilityRole="button"
                      accessibilityLabel={`Tambah ${dish.name} ke keranjang`}
                      style={({ pressed }) => [
                        styles.addPillOuter,
                        pressed && { transform: [{ scale: 0.96 }] },
                      ]}
                    >
                      <LinearGradient
                        colors={GOLD_BUTTON_GRADIENT}
                        style={styles.addPillInner}
                      >
                        <Plus size={14} color="#2E3446" strokeWidth={2.5} />
                        <Text style={styles.addPillText}>Tambah</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 6 }}>
            <GoldCapsuleButton
              onPress={() =>
                openCatalogFiltered({ category: 'All Dishes', buff: null, region: null })
              }
            >
              <Text style={styles.browseAllText}>Jelajahi Seluruh 18 Menu Katalog</Text>
              <ArrowRight size={16} color="#2E3446" />
            </GoldCapsuleButton>
          </View>
        </View>
      </ScrollView>

      {/* Floating Quick Cart Bar */}
      <FloatingQuickCartBar
        itemCount={totals.itemCount}
        totalMora={totals.finalTotal}
        onOpenCart={() => router.navigate('/(tabs)/cart')}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  travelerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,231,165,0.85)',
    backgroundColor: '#252D44',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  travelerInfo: {
    flex: 1,
  },
  travelerRank: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: COLORS.navSubtext,
  },
  travelerName: {
    fontFamily: FONTS.genshin,
    fontSize: 14.5,
    color: COLORS.inkIvory,
    marginTop: 1,
  },
  moraHeaderBtn: {
    minHeight: 36,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 20,
  },
  heroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    backgroundColor: COLORS.ivoryTop,
    shadowColor: '#4A3A1E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTop: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'relative',
  },
  heroWatermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.3,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroCopy: {
    flex: 1,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: '#FFF1C7',
  },
  heroTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 17,
    color: '#FFFDF7',
    marginTop: 4,
    lineHeight: 22,
    textShadowColor: 'rgba(44,24,6,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroDesc: {
    fontSize: 11.5,
    color: '#FFF4DC',
    marginTop: 4,
    lineHeight: 17,
  },
  heroCode: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroDishWrap: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDishImg: {
    width: 76,
    height: 76,
  },
  heroFooter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.ivoryTop,
    borderTopWidth: 1,
    borderTopColor: COLORS.goldTrim,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  heroFooterIcon: {
    width: 16,
    height: 16,
  },
  heroFooterText: {
    fontSize: 11,
    color: COLORS.inkSecondary,
    flexShrink: 1,
  },
  heroLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroLinkText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.goldDeep,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 14.5,
    color: COLORS.inkPrimary,
  },
  sectionLink: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.goldDeep,
  },
  sectionSubNote: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.goldMuted,
  },
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  shortcutCard: {
    width: '48.4%',
    minHeight: 60,
    borderRadius: 12,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#443824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  shortcutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(211,188,142,0.8)',
    backgroundColor: '#ECE4D3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shortcutIcon: {
    width: 28,
    height: 28,
  },
  shortcutCopy: {
    flex: 1,
  },
  shortcutLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkPrimary,
  },
  shortcutSub: {
    fontSize: 10,
    color: COLORS.inkMuted,
    marginTop: 1,
  },
  recoList: {
    gap: 10,
  },
  recoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    flexDirection: 'row',
    shadowColor: '#443824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  recoLeftBanner: {
    width: 104,
  },
  recoRightBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    gap: 6,
  },
  recoMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666B7D',
  },
  recoName: {
    fontFamily: FONTS.genshin,
    fontSize: 13.5,
    color: COLORS.inkPrimary,
    marginTop: 2,
  },
  recoBottomRow: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.goldHairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  addPillOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
  },
  addPillInner: {
    minHeight: 32,
    paddingHorizontal: 11,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addPillText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#2E3446',
  },
  browseAllText: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    color: '#2E3446',
  },
});
