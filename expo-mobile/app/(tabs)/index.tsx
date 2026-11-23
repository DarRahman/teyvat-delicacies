import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { DISHES, TOP_RECOMMENDATION_IDS, formatMora } from '../../src/data/dishes';

/**
 * Halaman Beranda - Teyvat Delicacies
 * 
 * Memenuhi Ketentuan Soal 4: Fitur 1 (Halaman Beranda):
 * • Menampilkan nama aplikasi dan informasi singkat.
 * • Menampilkan minimal 5 rekomendasi makanan.
 * • Menampilkan kategori makanan (Makanan Utama, Minuman, dan Snack).
 * • Menampilkan informasi nama makanan, harga, dan gambar.
 * • Pengguna dapat memilih makanan untuk melihat halaman detail makanan.
 */
export default function HomeScreen() {
  // Ambil 5 rekomendasi makanan terbaik
  const recommendations = TOP_RECOMMENDATION_IDS.map((id) =>
    DISHES.find((d) => d.id === id)
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  const categories = [
    { label: 'Makanan Utama', icon: '🍗' },
    { label: 'Camilan', icon: '🍡' },
    { label: 'Minuman', icon: '🧋' },
    { label: 'ATK Boost', icon: '⚔️' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Aplikasi */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Teyvat Delicacies</Text>
          <Text style={styles.appSubtitle}>
            Kuliner Khas Delapan Bangsa Teyvat · Jamuan Hangat Penjelajah
          </Text>
        </View>
        <View style={styles.moraPill}>
          <Text style={styles.moraText}>🪙 2,214,430 Mora</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Promo / Festival */}
        <View style={styles.banner}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>✦ FESTIVAL KULINER LIYUE ✦</Text>
          </View>
          <Text style={styles.bannerTitle}>Jamuan Hangat Para Adeptus</Text>
          <Text style={styles.bannerSubtitle}>
            Diskon 20% seluruh hidangan khas Liyue dengan kupon PAIMONKENYANG.
          </Text>
          <TouchableOpacity
            style={styles.bannerBtn}
            onPress={() => router.push('/(tabs)/catalog')}
            activeOpacity={0.8}
          >
            <Text style={styles.bannerBtnText}>Jelajahi Menu ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Kategori Makanan (Ketentuan Soal: Makanan Utama, Minuman, Snack) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori Makanan</Text>
          <View style={styles.categoryRow}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryCard}
                onPress={() => router.push('/(tabs)/catalog')}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 5 Rekomendasi Makanan (Ketentuan Soal: Minimal 5 Rekomendasi) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>5 Rekomendasi Makanan</Text>
            <Text style={styles.sectionNote}>Pilihan Chef Xiangling</Text>
          </View>

          {recommendations.map((dish) => (
            <TouchableOpacity
              key={dish.id}
              style={styles.dishCard}
              onPress={() => router.push(`/dish/${dish.id}`)}
              activeOpacity={0.75}
            >
              <Image
                source={{ uri: dish.image }}
                style={styles.dishImage}
                resizeMode="contain"
              />
              <View style={styles.dishInfo}>
                <View style={styles.dishMetaRow}>
                  <Text style={styles.dishRegion}>{dish.region}</Text>
                  <Text style={styles.dishDot}>·</Text>
                  <Text style={styles.dishCategory}>{dish.category}</Text>
                </View>
                <Text style={styles.dishName} numberOfLines={1}>
                  {dish.name}
                </Text>
                <Text style={styles.dishEffect} numberOfLines={2}>
                  {dish.effect}
                </Text>
                <View style={styles.dishPriceRow}>
                  <Text style={styles.dishPrice}>🪙 {formatMora(dish.priceMora)} Mora</Text>
                  <View style={styles.detailButton}>
                    <Text style={styles.detailButtonText}>Lihat Detail ➔</Text>
                  </View>
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
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E2435',
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B50',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE7A5',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 10.5,
    color: '#C8D0E4',
    marginTop: 2,
  },
  moraPill: {
    backgroundColor: 'rgba(255, 231, 165, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8A86B80',
  },
  moraText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFE7A5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  banner: {
    backgroundColor: '#272038',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 231, 165, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFE7A5',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFDF5',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 11.5,
    color: '#D4CDE6',
    lineHeight: 18,
    marginBottom: 14,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#C8A86B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerBtnText: {
    color: '#1A1426',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 8,
  },
  sectionNote: {
    fontSize: 11,
    color: '#7A6B53',
    fontStyle: 'italic',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FAF8F2',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3BC8E',
    elevation: 1,
  },
  categoryIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#34384A',
    textAlign: 'center',
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  dishImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#EAE4D7',
    marginRight: 12,
  },
  dishInfo: {
    flex: 1,
  },
  dishMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dishRegion: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8A5D1C',
    textTransform: 'uppercase',
  },
  dishDot: {
    marginHorizontal: 4,
    color: '#A09786',
    fontSize: 10,
  },
  dishCategory: {
    fontSize: 10,
    color: '#656A7D',
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 3,
  },
  dishEffect: {
    fontSize: 10.5,
    color: '#5A6072',
    lineHeight: 15,
    marginBottom: 6,
  },
  dishPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  dishPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8A5D1C',
  },
  detailButton: {
    backgroundColor: '#EAE3D2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#664C1B',
  },
});
