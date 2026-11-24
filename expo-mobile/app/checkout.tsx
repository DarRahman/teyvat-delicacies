import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { DELIVERY_POINTS, formatMora } from '../src/data/dishes';
import { useDelicaciesStore } from '../src/store/useDelicaciesStore';
import { PaymentMethod } from '../src/types';

export default function CheckoutScreen() {
  const cart = useDelicaciesStore((s) => s.cart);
  const selectedDeliveryPointId = useDelicaciesStore((s) => s.selectedDeliveryPointId);
  const setSelectedDeliveryPointId = useDelicaciesStore((s) => s.setSelectedDeliveryPointId);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  const placeOrder = useDelicaciesStore((s) => s.placeOrder);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Mora Saldo');
  const [kitchenNotes, setKitchenNotes] = useState('');

  const selectedPoint =
    DELIVERY_POINTS.find((p) => p.id === selectedDeliveryPointId) ?? DELIVERY_POINTS[0];

  const totals = getCartTotals(selectedPoint);

  const handleSelectPoint = (pointId: string) => {
    setSelectedDeliveryPointId(pointId);
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Keranjang Kosong', 'Silakan pilih hidangan terlebih dahulu sebelum checkout.');
      return;
    }

    const result = placeOrder({
      deliveryPoint: selectedPoint,
      paymentMethod,
      kitchenNotes,
    });

    if (result.ok && result.order) {
      const orderId = result.order.id;
      Alert.alert(
        'Pesanan Berhasil Dibuat!',
        `Jamuan Teyvat sedang diproses di Dapur Wanmin dan akan dikirim oleh Kurir Glider ke ${selectedPoint.name}.`,
        [
          {
            text: 'Lihat Status Pelacakan ➔',
            onPress: () => router.push(`/order/${orderId}`),
          },
        ]
      );
    } else {
      Alert.alert('Gagal Membuat Pesanan', result.error ?? 'Terjadi kesalahan pada transaksi.');
    }
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
        <Text style={styles.headerTitle}>Simulasi Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pilih Titik Pengantaran Teyvat</Text>
          <Text style={styles.sectionSubtitle}>
            Tentukan tujuan pendaratan kurir glider melintasi 8 wilayah
          </Text>

          <View style={styles.pointsList}>
            {DELIVERY_POINTS.map((point) => {
              const isSelected = point.id === selectedPoint.id;
              return (
                <TouchableOpacity
                  key={point.id}
                  style={[styles.pointItem, isSelected && styles.selectedPointItem]}
                  onPress={() => handleSelectPoint(point.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.pointHeader}>
                    <Text style={[styles.pointRegion, isSelected && styles.selectedText]}>
                      {point.region} · {point.name}
                    </Text>
                    <Text style={styles.pointDuration}>{point.estimatedMinutes} menit</Text>
                  </View>
                  <Text style={styles.pointDescription} numberOfLines={1}>
                    {point.description}
                  </Text>
                  <Text style={styles.pointFee}>
                    Biaya Kurir: {point.deliveryFeeMora === 0 ? 'Gratis (Lokal Liyue)' : `${formatMora(point.deliveryFeeMora)} Mora`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ringkasan Pesanan Jamuan</Text>
          <View style={styles.itemsList}>
            {cart.map((item) => (
              <View key={item.dish.id} style={styles.orderItemRow}>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemTitle}>{item.dish.name}</Text>
                  <Text style={styles.itemSub}>
                    {item.quantity} porsi × {formatMora(item.dish.priceMora)} Mora
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  {formatMora(item.dish.priceMora * item.quantity)} Mora
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          <View style={styles.paymentRow}>
            <TouchableOpacity
              style={[
                styles.paymentChip,
                paymentMethod === 'Mora Saldo' && styles.selectedPaymentChip,
              ]}
              onPress={() => setPaymentMethod('Mora Saldo')}
            >
              <Text
                style={[
                  styles.paymentChipText,
                  paymentMethod === 'Mora Saldo' && styles.selectedPaymentText,
                ]}
              >
                🪙 Mora Dompet Traveler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentChip,
                paymentMethod === 'Northland Bank Note' && styles.selectedPaymentChip,
              ]}
              onPress={() => setPaymentMethod('Northland Bank Note')}
            >
              <Text
                style={[
                  styles.paymentChipText,
                  paymentMethod === 'Northland Bank Note' && styles.selectedPaymentText,
                ]}
              >
                🏛️ Wesel Bank Northland
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Catatan Dapur untuk Chef</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Contoh: Kurangi cabai Jueyun, kuah dipisah..."
            placeholderTextColor="#8B7E66"
            value={kitchenNotes}
            onChangeText={setKitchenNotes}
          />
        </View>

        <View style={styles.totalCard}>
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
            <Text style={styles.summaryLabel}>Ongkos Kurir Glider</Text>
            <Text style={styles.summaryVal}>
              {totals.deliveryFeeMora === 0 ? 'Gratis (Lokal Liyue)' : `${formatMora(totals.deliveryFeeMora)} Mora`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.finalTotalRow}>
            <Text style={styles.finalTotalLabel}>Total Tagihan</Text>
            <Text style={styles.finalTotalVal}>{formatMora(totals.grandTotalMora)} Mora</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Konfirmasi & Buat Pesanan Sekarang ➔</Text>
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
    paddingBottom: 36,
  },
  sectionCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  sectionSubtitle: {
    fontSize: 10,
    color: '#8A7B68',
    marginBottom: 4,
  },
  pointsList: {
    gap: 8,
  },
  pointItem: {
    backgroundColor: '#F5EFE3',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D8CCA8',
  },
  selectedPointItem: {
    backgroundColor: '#242B3D',
    borderColor: '#D4AF37',
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointRegion: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3A3226',
  },
  selectedText: {
    color: '#FFE7A5',
  },
  pointDuration: {
    fontSize: 10,
    color: '#8A6D3B',
    fontWeight: '600',
  },
  pointDescription: {
    fontSize: 10,
    color: '#756855',
    marginVertical: 2,
  },
  pointFee: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B57A1E',
  },
  itemsList: {
    gap: 8,
  },
  orderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE5D4',
  },
  itemMeta: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  itemSub: {
    fontSize: 10,
    color: '#8A7B68',
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B57A1E',
  },
  paymentRow: {
    gap: 8,
  },
  paymentChip: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F5EFE3',
    borderWidth: 1,
    borderColor: '#D8CCA8',
  },
  selectedPaymentChip: {
    backgroundColor: '#242B3D',
    borderColor: '#D4AF37',
  },
  paymentChipText: {
    fontSize: 12,
    color: '#3A3226',
    fontWeight: '600',
  },
  selectedPaymentText: {
    color: '#FFE7A5',
  },
  notesInput: {
    backgroundColor: '#F5EFE3',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: '#2F3542',
    borderWidth: 1,
    borderColor: '#D8CCA8',
  },
  totalCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  finalTotalVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B57A1E',
  },
  confirmButton: {
    backgroundColor: '#242B3D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  confirmButtonText: {
    color: '#FFE7A5',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
