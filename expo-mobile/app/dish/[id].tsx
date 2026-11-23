import React, { useState } from 'react';
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
import { useLocalSearchParams, router } from 'expo-router';
import { DISHES, formatMora } from '../../src/data/dishes';
import { useDelicaciesStore } from '../../src/store/useDelicaciesStore';

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [portionCount, setPortionCount] = useState(1);

  const addToCart = useDelicaciesStore((s) => s.addToCart);

  const dish = DISHES.find((d) => d.id === Number(id)) ?? DISHES[0];

  const handleAddToCart = () => {
    addToCart(dish, portionCount);
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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: dish.fallbackImage || dish.image }}
            style={styles.heroImage}
          />
          <View style={styles.imageOverlayBadge}>
            <Text style={styles.imageBadgeText}>{dish.region}</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.dishHeaderRow}>
            <Text style={styles.stars}>{'★'.repeat(dish.rarity)}</Text>
            <Text style={styles.categoryLabel}>{dish.category}</Text>
          </View>

          <Text style={styles.dishName}>{dish.name}</Text>
          <Text style={styles.dishPrice}>{formatMora(dish.priceMora)} Mora</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionHeading}>Deskripsi Kuliner</Text>
          <Text style={styles.description}>{dish.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionHeading}>Bahan Masakan</Text>
          <View style={styles.ingredientsRow}>
            {dish.ingredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientBadge}>
                <Text style={styles.ingredientText}>
                  {ing.name} ×{ing.count}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeading}>Khasiat Tempur</Text>
          <View style={styles.buffBox}>
            <Text style={styles.buffBadge}>✦ {dish.buffType} BOOST</Text>
            <Text style={styles.buffEffect}>{dish.buffEffect}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setPortionCount((prev) => Math.max(1, prev - 1))}
          >
            <Text style={styles.quantityBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{portionCount}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setPortionCount((prev) => prev + 1)}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addToCartText}>
            Tambah ke Keranjang · {formatMora(dish.priceMora * portionCount)} Mora
          </Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B40',
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backButtonText: {
    color: '#FFE7A5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  headerSpacer: {
    width: 60,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242B3D',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#C8A86B60',
    position: 'relative',
  },
  heroImage: {
    width: 150,
    height: 150,
    borderRadius: 16,
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#D4AF3725',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4AF3760',
  },
  imageBadgeText: {
    color: '#FFE7A5',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 10,
  },
  dishHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stars: {
    color: '#E6A23C',
    fontSize: 13,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#8A7B68',
    fontWeight: '600',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B57A1E',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4DAC8',
    marginVertical: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A3E2F',
  },
  description: {
    fontSize: 12,
    color: '#554C3E',
    lineHeight: 18,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientBadge: {
    backgroundColor: '#ECE5D8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4C6AB',
  },
  ingredientText: {
    fontSize: 11,
    color: '#4B3F2F',
  },
  buffBox: {
    backgroundColor: '#F4EFE6',
    borderRadius: 8,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#D8CCB5',
  },
  buffBadge: {
    color: '#8A5810',
    fontSize: 10,
    fontWeight: 'bold',
  },
  buffEffect: {
    fontSize: 11,
    color: '#4B3F2F',
    lineHeight: 16,
  },
  bottomBar: {
    backgroundColor: '#1C2232',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#C8A86B40',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262E44',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8A86B60',
  },
  quantityBtn: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    color: '#FFE7A5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#FFF8E7',
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: '#D4AF37',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#1C2232',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
