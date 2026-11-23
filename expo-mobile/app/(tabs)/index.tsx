import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { DISHES, TOP_RECOMMENDATION_IDS, formatMora } from '../../src/data/dishes';
import { useDelicaciesStore } from '../../src/store/useDelicaciesStore';
import { Dish } from '../../src/types';

export default function HomeScreen() {
  const profile = useDelicaciesStore((s) => s.profile);
  const addToCart = useDelicaciesStore((s) => s.addToCart);

  const recommendations = TOP_RECOMMENDATION_IDS.map((id) =>
    DISHES.find((d) => d.id === id)
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  const categories = [
    { label: 'Makanan Utama', sub: 'Porsi mengenyangkan', icon: '🍗' },
    { label: 'Camilan', sub: 'Kudapan penjelajah', icon: '🍡' },
    { label: 'Minuman', sub: 'Segar khas Teyvat', icon: '🧋' },
    { label: 'ATK Boost', sub: 'Khasiat tempur', icon: '⚔️' },
  ];

  const handleQuickAdd = (dish: Dish) => {
    addToCart(dish, 1);
    Alert.alert('Berhasil', `${dish.name} ditambahkan ke keranjang.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Image
            source={{ uri: profile.fallbackAvatarUrl || profile.avatarUrl }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userRank}>Traveler · AR {profile.adventureRank}</Text>
            <Text style={styles.userName}>{profile.username}</Text>
          </View>
        </View>
        <View style={styles.moraPill}>
          <Text style={styles.moraText}>🪙 {formatMora(profile.mora)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>✦ FESTIVAL KULINER LIYUE ✦</Text>
          </View>
          <Text style={styles.bannerTitle}>Jamuan Hangat Para Adeptus</Text>
          <Text style={styles.bannerSubtitle}>
            Gunakan kupon PAIMONKENYANG untuk potongan 20% seluruh hidangan khas Liyue.
          </Text>
          <TouchableOpacity
            style={styles.bannerBtn}
            onPress={() => router.push('/(tabs)/catalog')}
            activeOpacity={0.8}
          >
            <Text style={styles.bannerBtnText}>Jelajahi Menu ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori Makanan</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryCard}
                onPress={() => router.push('/(tabs)/catalog')}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  <Text style={styles.categorySub}>{cat.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>5 Rekomendasi Pilihan</Text>
            <Text style={styles.sectionSubtitle}>Pilihan Chef Xiangling</Text>
          </View>

          {recommendations.map((dish) => (
            <TouchableOpacity
              key={dish.id}
              style={styles.dishCard}
              onPress={() => router.push(`/dish/${dish.id}`)}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: dish.fallbackImage || dish.image }}
                style={styles.dishImage}
              />
              <View style={styles.dishInfo}>
                <View style={styles.dishHeaderRow}>
                  <Text style={styles.dishRegionBadge}>{dish.region}</Text>
                  <Text style={styles.dishStars}>{'★'.repeat(dish.rarity)}</Text>
                </View>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishCategory}>{dish.category}</Text>
                <View style={styles.dishBottomRow}>
                  <Text style={styles.dishPrice}>{formatMora(dish.priceMora)} Mora</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleQuickAdd(dish)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.addButtonText}>+ Pesan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5D8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1C2232',
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B40',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFE7A5',
    backgroundColor: '#2A334B',
  },
  userRank: {
    color: '#A7ADC0',
    fontSize: 10,
    fontWeight: '500',
  },
  userName: {
    color: '#FFF8E7',
    fontSize: 14,
    fontWeight: 'bold',
  },
  moraPill: {
    backgroundColor: '#262E44',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4AF3780',
  },
  moraText: {
    color: '#FFE7A5',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 20,
    paddingBottom: 32,
  },
  banner: {
    backgroundColor: '#242B3D',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#C8A86B60',
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D4AF3725',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: '#FFE7A5',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF8E7',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#D0D4DF',
    lineHeight: 18,
    marginBottom: 14,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerBtnText: {
    color: '#1C2232',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#7A6B53',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FDFBF7',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2D7C3',
  },
  categoryIcon: {
    fontSize: 22,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  categorySub: {
    fontSize: 10,
    color: '#8A7B68',
  },
  dishCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    alignItems: 'center',
  },
  dishImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#EBE2D2',
  },
  dishInfo: {
    flex: 1,
  },
  dishHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishRegionBadge: {
    fontSize: 10,
    color: '#8A6D3B',
    fontWeight: '600',
  },
  dishStars: {
    color: '#E6A23C',
    fontSize: 11,
  },
  dishName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2F3542',
    marginTop: 2,
  },
  dishCategory: {
    fontSize: 11,
    color: '#7A6B53',
    marginBottom: 6,
  },
  dishBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B57A1E',
  },
  addButton: {
    backgroundColor: '#242B3D',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFE7A5',
    fontSize: 11,
    fontWeight: '700',
  },
});
