import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { formatMora } from '../../src/data/dishes';
import { useDelicaciesStore } from '../../src/store/useDelicaciesStore';

export default function CartScreen() {
  const [couponInput, setCouponInput] = useState('');

  const cart = useDelicaciesStore((s) => s.cart);
  const updateQuantity = useDelicaciesStore((s) => s.updateQuantity);
  const removeFromCart = useDelicaciesStore((s) => s.removeFromCart);
  const clearCart = useDelicaciesStore((s) => s.clearCart);
  const appliedCouponCode = useDelicaciesStore((s) => s.appliedCouponCode);
  const applyCoupon = useDelicaciesStore((s) => s.applyCoupon);
  const removeCoupon = useDelicaciesStore((s) => s.removeCoupon);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);

  const totals = getCartTotals();

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput.trim());
    if (result.ok) {
      Alert.alert('Kupon Diterapkan', result.message);
      setCouponInput('');
    } else {
      Alert.alert('Kupon Gagal', result.message);
    }
  };

  const handleClearCart = () => {
    Alert.alert('Kosongkan Keranjang', 'Apakah Anda yakin ingin menghapus semua hidangan?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus Semua', style: 'destructive', onPress: clearCart },
    ]);
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Keranjang Jamuan</Text>
          <Text style={styles.headerSubtitle}>0 Hidangan Terpilih</Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>Keranjang Masih Kosong</Text>
          <Text style={styles.emptySubtitle}>
            Belum ada hidangan lezat Teyvat yang Anda pilih untuk petualangan ini.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/(tabs)/catalog')}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreButtonText}>Pilih Hidangan di Katalog ➔</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Keranjang Jamuan</Text>
          <Text style={styles.headerSubtitle}>{cart.length} Jenis Hidangan Terpilih</Text>
        </View>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Kosongkan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {cart.map((item) => {
            const itemSubtotal = item.dish.priceMora * item.quantity;
            return (
              <View key={item.dish.id} style={styles.cartCard}>
                <Image
                  source={{ uri: item.dish.fallbackImage || item.dish.image }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.dish.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.dish.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.deleteText}>Hapus</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemCategory}>{item.dish.category} · {item.dish.region}</Text>
                  <Text style={styles.unitPrice}>{formatMora(item.dish.priceMora)} Mora / porsi</Text>

                  <View style={styles.itemFooterRow}>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.dish.id, item.quantity - 1)}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.dish.id, item.quantity + 1)}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.subtotalText}>
                      {formatMora(itemSubtotal)} Mora
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.couponSection}>
          <Text style={styles.sectionLabel}>Kupon Promo Festival</Text>
          {appliedCouponCode ? (
            <View style={styles.appliedCouponRow}>
              <View>
                <Text style={styles.appliedCouponText}>Kupon Aktif: {appliedCouponCode}</Text>
                <Text style={styles.couponDiscountText}>Hemat {formatMora(totals.discountMora)} Mora</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon} style={styles.removeCouponBtn}>
                <Text style={styles.removeCouponText}>Lepas</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInputRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="Contoh: PAIMONKENYANG"
                placeholderTextColor="#8B7E66"
                value={couponInput}
                onChangeText={setCouponInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.couponApplyBtn} onPress={handleApplyCoupon}>
                <Text style={styles.couponApplyText}>Terapkan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Pembayaran</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal Hidangan</Text>
            <Text style={styles.summaryVal}>{formatMora(totals.subtotalMora)} Mora</Text>
          </View>

          {totals.discountMora > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.discountLabel}>Diskon Kupon Promo</Text>
              <Text style={styles.discountVal}>−{formatMora(totals.discountMora)} Mora</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimasi Kurir Glider</Text>
            <Text style={styles.summaryVal}>
              {totals.deliveryFeeMora === 0 ? 'Gratis (Lokal Liyue)' : `${formatMora(totals.deliveryFeeMora)} Mora`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Jamuan</Text>
            <Text style={styles.totalVal}>{formatMora(totals.grandTotalMora)} Mora</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => router.push('/checkout')}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutBtnText}>Lanjut ke Simulasi Checkout ➔</Text>
        </TouchableOpacity>
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
    backgroundColor: '#1C2232',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#262E44',
    borderWidth: 1,
    borderColor: '#C8A86B50',
  },
  clearBtnText: {
    color: '#E47161',
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 36,
  },
  itemsContainer: {
    gap: 12,
  },
  cartCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2D7C3',
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#EBE2D2',
    alignSelf: 'center',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F3542',
    flex: 1,
    marginRight: 8,
  },
  deleteText: {
    fontSize: 11,
    color: '#C24B38',
    fontWeight: '600',
  },
  itemCategory: {
    fontSize: 10,
    color: '#8A7B68',
  },
  unitPrice: {
    fontSize: 11,
    color: '#6E614F',
    marginVertical: 2,
  },
  itemFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECE5D8',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4C6AB',
  },
  qtyBtn: {
    width: 26,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3A3226',
  },
  qtyValue: {
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#2F3542',
  },
  subtotalText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B57A1E',
  },
  couponSection: {
    backgroundColor: '#FDFBF7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3E3426',
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#F4ECE0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 12,
    color: '#2F3542',
    borderWidth: 1,
    borderColor: '#D4C6AB',
  },
  couponApplyBtn: {
    backgroundColor: '#242B3D',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
  },
  couponApplyText: {
    color: '#FFE7A5',
    fontWeight: '700',
    fontSize: 11,
  },
  appliedCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2EBDF',
    padding: 10,
    borderRadius: 8,
  },
  appliedCouponText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2B5838',
  },
  couponDiscountText: {
    fontSize: 10,
    color: '#685945',
  },
  removeCouponBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeCouponText: {
    fontSize: 11,
    color: '#C24B38',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3542',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#655743',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F3542',
  },
  discountLabel: {
    fontSize: 12,
    color: '#2B5838',
  },
  discountVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2B5838',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4DAC8',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B57A1E',
  },
  checkoutBtn: {
    backgroundColor: '#242B3D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF3780',
  },
  checkoutBtnText: {
    color: '#FFE7A5',
    fontSize: 13,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A3226',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#7A6B53',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  exploreButton: {
    backgroundColor: '#242B3D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8A86B60',
  },
  exploreButtonText: {
    color: '#FFE7A5',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
