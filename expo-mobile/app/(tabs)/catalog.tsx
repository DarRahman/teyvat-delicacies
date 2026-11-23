import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { DISHES, formatMora } from '../../src/data/dishes';
import { Dish } from '../../src/types';

/**
 * Halaman Katalog Makanan - Teyvat Delicacies
 * 
 * Memenuhi Ketentuan Soal 4: Fitur 2 (Halaman Katalog Makanan):
 * • Menampilkan minimal 10 data makanan (tersedia 16 data hidangan resmi).
 * • Setiap makanan memiliki informasi nama, kategori, harga, deskripsi, dan gambar.
 * • Menggunakan FlatList untuk menampilkan daftar makanan.
 * • Pengguna dapat mencari makanan berdasarkan nama.
 * • Pengguna dapat memilih makanan untuk membuka halaman detail.
 */
export default function CatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Main Dish', 'Snacks', 'Beverages'];

  // Filter daftar hidangan berdasarkan pencarian nama dan kategori
  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      const matchSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === 'Semua' || dish.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const renderDishItem = ({ item }: { item: Dish }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/dish/${item.id}`)}
      activeOpacity={0.75}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <View style={styles.cardBody}>
        <View style={styles.metaRow}>
          <Text style={styles.badgeRegion}>{item.region}</Text>
          <Text style={styles.badgeDot}>•</Text>
          <Text style={styles.badgeCategory}>{item.category}</Text>
          <Text style={styles.badgeDot}>•</Text>
          <Text style={styles.badgeRarity}>{'★'.repeat(item.rarity)}</Text>
        </View>

        <Text style={styles.dishName} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={styles.dishDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.priceText}>🪙 {formatMora(item.priceMora)} Mora</Text>
          <View style={styles.orderBtn}>
            <Text style={styles.orderBtnText}>Pesan ➔</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Katalog */}
      <View style={styles.header}>
        <Text style={styles.title}>Katalog Jamuan Teyvat</Text>
        <Text style={styles.subtitle}>
          Daftar resep autentik 8 wilayah Teyvat ({filteredDishes.length} hidangan tersedia)
        </Text>

        {/* Input Pencarian Berdasarkan Nama (Ketentuan Soal) */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari hidangan Teyvat (misal: Adeptus, Barbatos)..."
            placeholderTextColor="#8C93A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Kategori */}
        <View style={styles.categoryFilterRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Render Menggunakan FlatList React Native (Ketentuan Wajib Soal) */}
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDishItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>Hidangan Tidak Ditemukan</Text>
            <Text style={styles.emptyDesc}>
              Tidak ada kuliner yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </Text>
          </View>
        }
      />
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
    backgroundColor: '#1E2435',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B50',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE7A5',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#C8D0E4',
    marginTop: 2,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F2',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#242735',
  },
  clearIcon: {
    color: '#8C93A6',
    fontSize: 14,
    padding: 4,
  },
  categoryFilterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: '#C8A86B40',
  },
  categoryChipActive: {
    backgroundColor: '#C8A86B',
    borderColor: '#FFE7A5',
  },
  categoryChipText: {
    fontSize: 10.5,
    color: '#D4CDE6',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#1A1426',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#EAE4D7',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeRegion: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8A5D1C',
    textTransform: 'uppercase',
  },
  badgeDot: {
    marginHorizontal: 4,
    color: '#9C9482',
    fontSize: 10,
  },
  badgeCategory: {
    fontSize: 10,
    color: '#5E6477',
  },
  badgeRarity: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: 'bold',
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 3,
  },
  dishDesc: {
    fontSize: 10.5,
    color: '#555B6E',
    lineHeight: 15,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8A5D1C',
  },
  orderBtn: {
    backgroundColor: '#C8A86B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderBtnText: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#1A1426',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#70778B',
    textAlign: 'center',
    maxWidth: 240,
  },
});
