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
} from 'react-native';
import { router } from 'expo-router';
import { DISHES, formatMora } from '../../src/data/dishes';

/**
 * Halaman Keranjang - Teyvat Delicacies
 * 
 * Memenuhi Ketentuan Soal 4: Fitur 4 (Halaman Keranjang):
 * • Menampilkan daftar makanan yang telah ditambahkan.
 * • Menampilkan nama makanan, harga, jumlah, dan subtotal.
 * • Pengguna dapat menambah atau mengurangi jumlah makanan.
 * • Menampilkan total harga seluruh pesanan.
 * • Pengguna dapat menghapus makanan dari keranjang.
 */
export default function CartScreen() {
  // Simulasi state keranjang aktif dengan data pesanan awal
  const [cartItems, setCartItems] = useState([
    {
      dish: DISHES.find((d) => d.id === 5101) ?? DISHES[0], // Adeptus' Temptation
      quantity: 2,
    },
    {
      dish: DISHES.find((d) => d.id === 4101) ?? DISHES[1], // Barbatos Ratatouille
      quantity: 1,
    },
  ]);

  // Tambah kuantitas (+1)
  const handleIncrease = (dishId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.dish.id === dishId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Kurangi kuantitas (-1) atau hapus jika 1
  const handleDecrease = (dishId: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.dish.id === dishId
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Hapus item dari keranjang
  const handleRemove = (dishId: number) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  // Hitung total harga seluruh pesanan
  const subtotalMora = cartItems.reduce(
    (sum, item) => sum + item.dish.priceMora * item.quantity,
    0
  );
  const deliveryFeeMora = subtotalMora > 0 ? 0 : 0; // Bebas Ongkir Lokal Liyue
  const grandTotalMora = subtotalMora + deliveryFeeMora;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Keranjang */}
      <View style={styles.header}>
        <Text style={styles.title}>Keranjang Jamuan</Text>
        <Text style={styles.subtitle}>
          {cartItems.length} hidangan siap diantar oleh Kurir Glider
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🧺</Text>
          <Text style={styles.emptyTitle}>Keranjang Masih Kosong</Text>
          <Text style={styles.emptyDesc}>
            Jelajahi kelezatan kuliner Teyvat dan tambahkan hidangan favoritmu.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push('/(tabs)/catalog')}
            activeOpacity={0.8}
          >
            <Text style={styles.browseBtnText}>Buka Katalog Kuliner ➔</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Daftar Makanan di Keranjang (Ketentuan Soal) */}
          <View style={styles.itemList}>
            {cartItems.map(({ dish, quantity }) => {
              const itemSubtotal = dish.priceMora * quantity;
              return (
                <View key={dish.id} style={styles.cartCard}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.cartImage}
                    resizeMode="contain"
                  />
                  <View style={styles.cartBody}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.dishName} numberOfLines={1}>
                        {dish.name}
                      </Text>
                      {/* Tombol Hapus Makanan */}
                      <TouchableOpacity
                        onPress={() => handleRemove(dish.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.deleteBtn}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.unitPrice}>
                      🪙 {formatMora(dish.priceMora)} Mora / porsi
                    </Text>

                    {/* Pengaturan Jumlah & Subtotal (Ketentuan Soal) */}
                    <View style={styles.qtyRow}>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => handleDecrease(dish.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.stepBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => handleIncrease(dish.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.stepBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.subtotalBox}>
                        <Text style={styles.subtotalLabel}>Subtotal</Text>
                        <Text style={styles.subtotalValue}>
                          🪙 {formatMora(itemSubtotal)} Mora
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Ringkasan Total Pesanan (Ketentuan Soal) */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Ringkasan Pembayaran</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal Hidangan</Text>
              <Text style={styles.summaryValue}>🪙 {formatMora(subtotalMora)} Mora</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ongkos Kurir Glider</Text>
              <Text style={styles.freeDelivery}>Gratis (Lokal Liyue)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Pesanan</Text>
              <Text style={styles.grandTotalValue}>🪙 {formatMora(grandTotalMora)} Mora</Text>
            </View>

            {/* Tombol Menuju Checkout */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => router.push('/checkout')}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutBtnText}>Lanjut ke Checkout ➔</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  itemList: {
    marginBottom: 16,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    alignItems: 'center',
    elevation: 2,
  },
  cartImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#EAE4D7',
    marginRight: 12,
  },
  cartBody: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242735',
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    fontSize: 13,
    color: '#A09786',
    fontWeight: 'bold',
    padding: 2,
  },
  unitPrice: {
    fontSize: 11,
    color: '#765C2B',
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEAE0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D3BC8E',
  },
  stepBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#242735',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#242735',
    paddingHorizontal: 8,
  },
  subtotalBox: {
    alignItems: 'flex-end',
  },
  subtotalLabel: {
    fontSize: 9.5,
    color: '#7D8498',
  },
  subtotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8A5D1C',
  },
  summaryCard: {
    backgroundColor: '#FAF8F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11.5,
    color: '#555B6E',
  },
  summaryValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#242735',
  },
  freeDelivery: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#2D6E4E',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD5C4',
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  grandTotalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#242735',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A5D1C',
  },
  checkoutBtn: {
    backgroundColor: '#C8A86B',
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: '#C8A86B',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1426',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#70778B',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 260,
  },
  browseBtn: {
    backgroundColor: '#C8A86B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  browseBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1426',
  },
});
