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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { DISHES, formatMora } from '../../src/data/dishes';
import { useDelicaciesStore } from '../../src/store/useDelicaciesStore';
import { Dish, DishCategory } from '../../src/types';

export default function CatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');

  const addToCart = useDelicaciesStore((s) => s.addToCart);

  const categories = ['Semua', 'Main Dish', 'Snacks', 'Beverages'];
  const regions = ['Semua', 'Mondstadt', 'Liyue', 'Inazuma', 'Sumeru', 'Fontaine', 'Natlan', 'Snezhnaya'];

  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      const matchName = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === 'Semua' || dish.category === selectedCategory;
      const matchRegion =
        selectedRegion === 'Semua' || dish.region === selectedRegion;
      return matchName && matchCat && matchRegion;
    });
  }, [searchQuery, selectedCategory, selectedRegion]);

  const handleQuickAdd = (dish: Dish) => {
    addToCart(dish, 1);
    Alert.alert('Berhasil', `${dish.name} ditambahkan ke keranjang.`);
  };

  const renderDishItem = ({ item }: { item: Dish }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/dish/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.fallbackImage || item.image }}
        style={styles.dishImage}
      />
      <View style={styles.cardDetails}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.regionTag}>{item.region}</Text>
          <Text style={styles.stars}>{'★'.repeat(item.rarity)}</Text>
        </View>

        <Text style={styles.dishName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.priceText}>{formatMora(item.priceMora)} Mora</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => router.push(`/dish/${item.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.detailButtonText}>Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleQuickAdd(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Katalog Hidangan Teyvat</Text>
        <Text style={styles.headerSubtitle}>
          Daftar menu terlengkap dari seluruh penjuru bangsa
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari hidangan favoritmu..."
          placeholderTextColor="#8B7E66"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => `cat-${item}`}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === item && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === item && styles.activeFilterChipText,
                ]}
              >
                {item === 'Semua' ? 'Semua Kategori' : item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDishItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Hidangan Tidak Ditemukan</Text>
            <Text style={styles.emptySubtitle}>
              Coba cari dengan kata kunci lain atau ubah filter kategori.
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
  },
  header: {
    backgroundColor: '#1C2232',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B40',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A7ADC0',
    marginTop: 2,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FDFBF7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 13,
    color: '#2F3542',
    borderWidth: 1,
    borderColor: '#D4AF3780',
  },
  filterBar: {
    backgroundColor: '#E4DAC8',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D8CEBA',
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F6EFE3',
    borderWidth: 1,
    borderColor: '#D6C8AF',
  },
  activeFilterChip: {
    backgroundColor: '#242B3D',
    borderColor: '#242B3D',
  },
  filterChipText: {
    fontSize: 11,
    color: '#655743',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#FFE7A5',
  },
  listContainer: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2D7C3',
  },
  dishImage: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#EBE2D2',
    alignSelf: 'center',
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionTag: {
    fontSize: 10,
    color: '#8A6D3B',
    fontWeight: '700',
    backgroundColor: '#F3E8D2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stars: {
    color: '#E6A23C',
    fontSize: 10,
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F3542',
    marginTop: 2,
  },
  categoryText: {
    fontSize: 10,
    color: '#8A7B68',
  },
  descriptionText: {
    fontSize: 11,
    color: '#554C3E',
    lineHeight: 15,
    marginVertical: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B57A1E',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  detailButton: {
    backgroundColor: '#ECE5D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4C6AB',
  },
  detailButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B3F2F',
  },
  addButton: {
    backgroundColor: '#242B3D',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFE7A5',
    lineHeight: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4B3F2F',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#8A7B68',
    textAlign: 'center',
  },
});
