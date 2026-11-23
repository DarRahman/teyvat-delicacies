import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { DISHES, formatMora } from '../../src/data/dishes';

/**
 * Halaman Detail Makanan - Teyvat Delicacies
 * 
 * Memenuhi Ketentuan Soal 4:
 * • Fitur 3 (Halaman Detail Makanan):
 *   - Menampilkan informasi detail makanan yang dipilih (gambar, nama, kategori, harga, deskripsi).
 *   - Menampilkan tombol untuk menambahkan makanan ke keranjang.
 *   - Menerima parameter makanan yang dikirim dari halaman katalog atau beranda.
 * • Ketentuan Navigasi dan Parameter:
 *   - Mengambil parameter yang dikirim pada halaman detail menggunakan fitur Expo Router (useLocalSearchParams).
 *   - Menggunakan router.back() untuk kembali ke halaman sebelumnya.
 */
export default function DishDetailScreen() {
  // Mengambil parameter rute menggunakan fitur resmi Expo Router
  const { id } = useLocalSearchParams<{ id: string }>();
  const [portionCount, setPortionCount] = useState(1);

  // Cari data hidangan berdasarkan parameter ID
  const dish = DISHES.find((d) => d.id === Number(id)) ?? DISHES[0];

  const handleAddToCart = () => {
    Alert.alert(
      'Berhasil Ditambahkan',
      `${portionCount} porsi "${dish.name}" telah masuk ke Keranjang Jamuan.`,
      [
        { text: 'Lanjut Pilih Menu', style: 'cancel' },
        { text: 'Lihat Keranjang', onPress: () => router.push('/(tabs)/cart') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan Tombol Kembali (router.back) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹ Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Detail Resep Teyvat
        </Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Gambar Hidangan */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: dish.image }}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <View style={styles.rarityPill}>
            <Text style={styles.rarityText}>{'★'.repeat(dish.rarity)} Bintang {dish.rarity}</Text>
          </View>
        </View>

        {/* Informasi Utama Hidangan */}
        <View style={styles.infoCard}>
          <View style={styles.metaRow}>
            <Text style={styles.regionBadge}>{dish.region}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.categoryBadge}>{dish.category}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.buffBadge}>{dish.buffLabel}</Text>
          </View>

          <Text style={styles.dishTitle}>{dish.name}</Text>
          <Text style={styles.priceMora}>🪙 {formatMora(dish.priceMora)} Mora / porsi</Text>

          <View style={styles.divider} />

          {/* Deskripsi Hidangan (Ketentuan Soal) */}
          <Text style={styles.sectionHeading}>Deskripsi Kuliner</Text>
          <Text style={styles.descText}>{dish.description}</Text>

          {/* Khasiat Tempur & Petualangan */}
          <View style={styles.buffBox}>
            <Text style={styles.buffTitle}>✦ Khasiat Khusus Jamuan Teyvat:</Text>
            <Text style={styles.buffEffect}>{dish.effect}</Text>
          </View>

          {/* Resep Bahan Alami Teyvat */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <View style={styles.ingredientsSection}>
              <Text style={styles.sectionHeading}>Komposisi Bahan Masakan</Text>
              <View style={styles.ingredientGrid}>
                {dish.ingredients.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientChip}>
                    <Text style={styles.ingredientText}>
                      • {ing.name} ({ing.count}x)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Pengatur Porsi & Tombol Tambah ke Keranjang (Ketentuan Soal) */}
          <View style={styles.actionRow}>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setPortionCount((c) => Math.max(1, c - 1))}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{portionCount}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setPortionCount((c) => c + 1)}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.addToCartText}>
                + Tambah ke Keranjang (🪙 {formatMora(dish.priceMora * portionCount)} Mora)
              </Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E2435',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B50',
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 231, 165, 0.12)',
  },
  backButtonText: {
    color: '#FFE7A5',
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFE7A5',
    fontSize: 15,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#272038',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    marginBottom: 16,
    position: 'relative',
  },
  heroImage: {
    width: 140,
    height: 140,
  },
  rarityPill: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3BC8E',
  },
  rarityText: {
    color: '#FFE7A5',
    fontSize: 11,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#FAF8F2',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  regionBadge: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#8A5D1C',
    textTransform: 'uppercase',
  },
  metaDot: {
    marginHorizontal: 5,
    color: '#A09786',
    fontSize: 10,
  },
  categoryBadge: {
    fontSize: 10.5,
    color: '#555B6E',
  },
  buffBadge: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#9C3D12',
  },
  dishTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 4,
  },
  priceMora: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A5D1C',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD5C4',
    marginVertical: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 6,
  },
  descText: {
    fontSize: 12,
    color: '#555B6E',
    lineHeight: 18,
    marginBottom: 14,
  },
  buffBox: {
    backgroundColor: '#EFE7D8',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    marginBottom: 14,
  },
  buffTitle: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#6E4515',
    marginBottom: 3,
  },
  buffEffect: {
    fontSize: 11,
    color: '#34384A',
    lineHeight: 16,
  },
  ingredientsSection: {
    marginBottom: 6,
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientChip: {
    backgroundColor: '#EAE3D4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ingredientText: {
    fontSize: 11,
    color: '#4A4F62',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAE3D4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3BC8E',
  },
  stepBtn: {
    width: 34,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242735',
  },
  stepperValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#242735',
    paddingHorizontal: 8,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#C8A86B',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#C8A86B',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1426',
  },
});
