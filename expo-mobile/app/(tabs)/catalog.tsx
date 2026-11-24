import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import {
  BuffBadge,
  DiamondStar,
  FloatingQuickCartBar,
  MoraAmount,
  ParchmentScreen,
  RarityDishBanner,
  TeyvatImage,
} from '../../components/TeyvatUI';
import {
  BUFF_META,
  CATEGORY_LABELS_ID,
  DISHES,
  DISH_CATEGORIES,
  TEYVAT_REGIONS,
} from '../../data/dishes';
import { filterDishes } from '../../lib/delicaciesRules';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import { COLORS, FONTS, GOLD_BUTTON_GRADIENT } from '../../theme/tokens';
import { BuffType, Dish, DishCategory, DishRarity, TeyvatRegion } from '../../types';

const ALL_BUFFS: BuffType[] = ['ATK', 'DEF', 'HP', 'STAMINA'];
const ALL_RARITIES: DishRarity[] = [5, 4, 3, 2, 1];

export default function CatalogScreen() {
  const profile = useDelicaciesStore((s) => s.profile);
  const addToCart = useDelicaciesStore((s) => s.addToCart);
  const catalogPreset = useDelicaciesStore((s) => s.catalogPreset);
  const clearCatalogPreset = useDelicaciesStore((s) => s.clearCatalogPreset);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  // Reactive subscriptions for FloatingQuickCartBar
  useDelicaciesStore((s) => s.cart);
  useDelicaciesStore((s) => s.selectedDeliveryPointId);
  useDelicaciesStore((s) => s.appliedCouponCode);
  useDelicaciesStore((s) => s.voucherUsageCount);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All Dishes' | DishCategory>(
    'All Dishes'
  );
  const [selectedBuffs, setSelectedBuffs] = useState<BuffType[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<TeyvatRegion[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<DishRarity | null>(null);
  const [showRegionFilters, setShowRegionFilters] = useState(false);

  // Consume filter preset triggered from Beranda Quick Categories
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

  const totals = getCartTotals();

  const handleOpenDish = useCallback((dish: Dish) => {
    router.push({
      pathname: '/dish/[id]',
      params: { id: String(dish.id) },
    });
  }, []);

  const renderDishCard = useCallback(
    ({ item: dish }: { item: Dish }) => (
      <View style={styles.dishCard}>
        <RarityDishBanner
          dish={dish}
          height={108}
          imageSize={78}
          onPress={() => handleOpenDish(dish)}
        />

        <View style={styles.dishBody}>
          <Pressable onPress={() => handleOpenDish(dish)} accessibilityRole="button">
            <Text style={styles.dishName} numberOfLines={2}>
              {dish.name}
            </Text>
            <View style={{ marginTop: 6 }}>
              <BuffBadge
                buffType={dish.buffType}
                label={dish.buffLabel}
                iconSource={dish.buffIcon}
                compact
              />
            </View>
          </Pressable>

          <View style={styles.dishFooter}>
            <MoraAmount
              amount={dish.priceMora}
              size="xs"
              color={COLORS.inkPrimary}
            />
            <Pressable
              onPress={() => addToCart(dish, 1)}
              accessibilityRole="button"
              accessibilityLabel={`Tambah ${dish.name} ke keranjang`}
              style={({ pressed }) => [
                styles.plusBtnOuter,
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              <LinearGradient colors={GOLD_BUTTON_GRADIENT} style={styles.plusBtnInner}>
                <Plus size={16} color="#2E3446" strokeWidth={2.5} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    ),
    [addToCart, handleOpenDish]
  );

  return (
    <ParchmentScreen
      header={
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Katalog Kuliner Teyvat</Text>
            <Text style={styles.headerSubtitle}>
              {DISHES.length} hidangan resmi · Saring efek buff &amp; 8 wilayah
            </Text>
          </View>
          <Pressable
            onPress={() => router.navigate('/(tabs)/profile')}
            style={styles.moraHeaderBtn}
            accessibilityRole="button"
          >
            <MoraAmount
              amount={profile.moraBalance}
              size="sm"
              color={COLORS.goldBright}
            />
          </Pressable>
        </View>
      }
    >
      {/* Warm Parchment Filter Control Deck */}
      <View style={styles.filterDeck}>
        {/* Search Input + Wilayah Toggle */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={16} color="#736957" style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari kuliner Teyvat atau efek buff..."
              placeholderTextColor="#7F7666"
              style={styles.searchInput}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                style={styles.clearBtn}
                accessibilityLabel="Hapus pencarian"
              >
                <X size={16} color="#6B6150" />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => setShowRegionFilters((v) => !v)}
            style={[
              styles.regionToggleBtn,
              (showRegionFilters || selectedRegions.length > 0 || selectedRarity !== null) &&
                styles.chipActive,
            ]}
            accessibilityRole="button"
          >
            <SlidersHorizontal
              size={14}
              color={
                showRegionFilters || selectedRegions.length > 0 || selectedRarity !== null
                  ? COLORS.goldBright
                  : COLORS.inkPrimary
              }
            />
            <Text
              style={[
                styles.regionToggleText,
                (showRegionFilters || selectedRegions.length > 0 || selectedRarity !== null) &&
                  styles.chipTextActive,
              ]}
            >
              Wilayah
            </Text>
          </Pressable>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipStrip}
        >
          {DISH_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.categoryChip, active && styles.chipActive]}
              >
                <Text
                  style={[styles.categoryChipText, active && styles.chipTextActive]}
                >
                  {CATEGORY_LABELS_ID[category]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Combat Buff Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipStrip}
        >
          {ALL_BUFFS.map((buff) => {
            const meta = BUFF_META[buff];
            const active = selectedBuffs.includes(buff);
            return (
              <Pressable
                key={buff}
                onPress={() => toggleBuff(buff)}
                style={[styles.buffChip, active && styles.chipActive]}
              >
                <TeyvatImage
                  source={meta.icon}
                  fallbackSource={meta.fallbackIcon}
                  style={styles.buffChipIcon}
                  contentFit="contain"
                />
                <Text style={[styles.buffChipText, active && styles.chipTextActive]}>
                  {meta.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Expandable 8-Region + Rarity Filter Drawer */}
        {showRegionFilters && (
          <View style={styles.drawerCard}>
            <View>
              <Text style={styles.drawerTitle}>Wilayah Teyvat (8 Negara)</Text>
              <View style={styles.wrapRow}>
                {TEYVAT_REGIONS.map((region) => {
                  const active = selectedRegions.includes(region);
                  return (
                    <Pressable
                      key={region}
                      onPress={() => toggleRegion(region)}
                      style={[styles.regionChip, active && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.regionChipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {region}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={styles.drawerTitle}>Tingkat Kelangkaan</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipStrip}
              >
                <Pressable
                  onPress={() => setSelectedRarity(null)}
                  style={[
                    styles.rarityChip,
                    selectedRarity === null && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.rarityChipText,
                      selectedRarity === null && styles.chipTextActive,
                    ]}
                  >
                    Semua
                  </Text>
                </Pressable>
                {ALL_RARITIES.map((rarity) => {
                  const active = selectedRarity === rarity;
                  return (
                    <Pressable
                      key={rarity}
                      onPress={() => setSelectedRarity(active ? null : rarity)}
                      style={[styles.rarityChip, active && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.rarityChipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {rarity}
                      </Text>
                      <DiamondStar size={10} />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      {/* Optimized Native FlatList 2-Column Catalog Grid for 80 Official Dishes */}
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={renderDishCard}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: totals.itemCount > 0 ? 72 : 4 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.countBar}>
            <Text style={styles.countText}>
              Menampilkan {filteredDishes.length} hidangan
            </Text>
            {(activeFilterCount > 0 || searchQuery.length > 0) && (
              <Pressable onPress={resetAllFilters} style={styles.resetBtn}>
                <RotateCcw size={12} color={COLORS.goldDeep} />
                <Text style={styles.resetText}>Reset Filter</Text>
              </Pressable>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Hidangan Tidak Ditemukan</Text>
            <Text style={styles.emptyDesc}>
              Tidak ada masakan yang cocok dengan kombinasi pencarian atau filter saat ini.
            </Text>
            <Pressable onPress={resetAllFilters} style={styles.emptyBtnOuter}>
              <LinearGradient
                colors={GOLD_BUTTON_GRADIENT}
                style={styles.emptyBtnInner}
              >
                <Text style={styles.emptyBtnText}>Tampilkan Semua Menu</Text>
              </LinearGradient>
            </Pressable>
          </View>
        }
      />

      {/* Floating Quick Cart Bar */}
      <FloatingQuickCartBar
        itemCount={totals.itemCount}
        totalMora={totals.finalTotal}
        onOpenCart={() => router.navigate('/(tabs)/cart')}
      />
    </ParchmentScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 17,
    color: COLORS.goldBright,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.navSubtext,
    marginTop: 2,
  },
  moraHeaderBtn: {
    minHeight: 34,
    justifyContent: 'center',
  },
  filterDeck: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.ivoryBottom,
    borderBottomWidth: 1,
    borderBottomColor: '#E2D8C5',
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.ivoryTop,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8B592',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: COLORS.inkBody,
    paddingVertical: 0,
  },
  clearBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionToggleBtn: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8B592',
    backgroundColor: COLORS.ivoryTop,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  regionToggleText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.inkPrimary,
  },
  chipStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryChip: {
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    justifyContent: 'center',
  },
  categoryChipText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#454A5C',
  },
  buffChip: {
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buffChipIcon: {
    width: 16,
    height: 16,
  },
  buffChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B4052',
  },
  chipActive: {
    backgroundColor: '#242B3E',
    borderColor: COLORS.goldBorder,
  },
  chipTextActive: {
    color: COLORS.goldBright,
  },
  drawerCard: {
    borderRadius: 12,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: 12,
    gap: 10,
  },
  drawerTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#3B4255',
    marginBottom: 6,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  regionChip: {
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    justifyContent: 'center',
  },
  regionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A4F63',
  },
  rarityChip: {
    minHeight: 30,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rarityChipText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#6B4A1B',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  countBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: '#4C4537',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.goldDeep,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  dishCard: {
    flex: 1,
    maxWidth: '48.4%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    shadowColor: '#443824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dishBody: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: COLORS.ivoryTop,
  },
  dishName: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    lineHeight: 17,
    color: COLORS.inkPrimary,
    minHeight: 34,
  },
  dishFooter: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#DED4C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  plusBtnOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
  },
  plusBtnInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 15,
    color: COLORS.inkPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#575A6B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyBtnOuter: {
    marginTop: 16,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
  },
  emptyBtnInner: {
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  emptyBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: '#2E3446',
  },
});
