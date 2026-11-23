import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { DELIVERY_POINTS, formatMora } from '../../src/data/dishes';

/**
 * Halaman Simulasi Checkout - Teyvat Delicacies
 * 
 * Memenuhi Ketentuan Soal 4: Fitur 6 (Simulasi Checkout):
 * • Menampilkan ringkasan pesanan.
 * • Menampilkan total harga pesanan.
 * • Menyediakan tombol checkout.
 * • Setelah checkout dilakukan, tampilkan pesan bahwa pesanan berhasil dibuat atau tampilkan halaman konfirmasi pesanan.
 */
export default function CheckoutScreen() {
  const [selectedPointId, setSelectedPointId] = useState(DELIVERY_POINTS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'MORA_COD' | 'NORTHLAND_BANK'>('MORA_COD');

  const selectedPoint =
    DELIVERY_POINTS.find((p) => p.id === selectedPointId) ?? DELIVERY_POINTS[0];

  const subtotalMora = 55500;
  const deliveryFeeMora = selectedPoint.region === 'Liyue' ? 0 : 3500;
  const grandTotalMora = subtotalMora + deliveryFeeMora;

  const handleConfirmOrder = () => {
    // Generate order ID
    const orderId = 'ORD-TEYVAT-7775';
    Alert.alert(
      'Pesanan Berhasil Dibuat!',
      `Jamuan Teyvat sedang dimasak di Dapur Wanmin dan akan diantar oleh Kurir Glider menuju ${selectedPoint.name}.`,
      [
        {
          text: 'Lihat Pelacakan Kurir ➔',
          onPress: () => router.push(`/order/${orderId}`),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Checkout */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹ Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout Pengantaran</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Titik Pengantaran Peta Teyvat (Ketentuan Titik Antar) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Titik Pendaratan Kurir Glider</Text>
          <Text style={styles.cardSubtitle}>
            Pilih wilayah pendaratan kurir di delapan bangsa Teyvat:
          </Text>

          <View style={styles.pointSelector}>
            {DELIVERY_POINTS.map((pt) => {
              const isSelected = pt.id === selectedPoint.id;
              return (
                <TouchableOpacity
                  key={pt.id}
                  style={[styles.pointChip, isSelected && styles.pointChipActive]}
                  onPress={() => setSelectedPointId(pt.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pointChipText,
                      isSelected && styles.pointChipTextActive,
                    ]}
                  >
                    {pt.region} · {pt.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.selectedPointBox}>
            <Text style={styles.selectedPointName}>{selectedPoint.name}</Text>
            <Text style={styles.selectedPointLandmark}>{selectedPoint.landmark}</Text>
            <Text style={styles.selectedPointEta}>
              ⚡ Estimasi Luncuran Glider: {selectedPoint.etaMinutes} Menit
            </Text>
          </View>
        </View>

        {/* Ringkasan Pesanan (Ketentuan Soal: Menampilkan ringkasan pesanan) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Ringkasan Pesanan</Text>
          <View style={styles.orderItem}>
            <Text style={styles.itemName}>Adeptus&apos; Temptation ×2</Text>
            <Text style={styles.itemPrice}>🪙 50,000 Mora</Text>
          </View>
          <View style={styles.orderItem}>
            <Text style={styles.itemName}>Barbatos Ratatouille ×1</Text>
            <Text style={styles.itemPrice}>🪙 5,500 Mora</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subtotal Hidangan</Text>
            <Text style={styles.costValue}>🪙 {formatMora(subtotalMora)} Mora</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Biaya Kurir Glider ({selectedPoint.region})</Text>
            <Text style={deliveryFeeMora === 0 ? styles.freeCost : styles.costValue}>
              {deliveryFeeMora === 0 ? 'Gratis (0 Mora)' : `🪙 ${formatMora(deliveryFeeMora)} Mora`}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Total Harga Pesanan (Ketentuan Soal: Menampilkan total harga) */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>🪙 {formatMora(grandTotalMora)} Mora</Text>
          </View>
        </View>

        {/* Metode Pembayaran */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💳 Metode Pembayaran</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'MORA_COD' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('MORA_COD')}
          >
            <Text style={styles.paymentRadio}>
              {paymentMethod === 'MORA_COD' ? '●' : '○'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentName}>Tunai Mora saat Terima (COD)</Text>
              <Text style={styles.paymentSub}>Bayar langsung ke Kurir Glider saat makanan mendarat</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'NORTHLAND_BANK' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('NORTHLAND_BANK')}
          >
            <Text style={styles.paymentRadio}>
              {paymentMethod === 'NORTHLAND_BANK' ? '●' : '○'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentName}>Kartu Giro Northland Bank (Snezhnaya)</Text>
              <Text style={styles.paymentSub}>Debit otomatis dari rekening bank Fatui Liyue</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tombol Checkout (Ketentuan Soal: Menyediakan tombol checkout) */}
        <TouchableOpacity
          style={styles.submitCheckoutBtn}
          onPress={handleConfirmOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.submitCheckoutText}>
            Konfirmasi &amp; Luncurkan Kurir Glider ➔
          </Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: '#FAF8F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    marginBottom: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#656C80',
    marginBottom: 10,
  },
  pointSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  pointChip: {
    backgroundColor: '#ECE5D8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D3BC8E',
  },
  pointChipActive: {
    backgroundColor: '#C8A86B',
    borderColor: '#8A5D1C',
  },
  pointChipText: {
    fontSize: 10.5,
    color: '#4B5164',
    fontWeight: '600',
  },
  pointChipTextActive: {
    color: '#1A1426',
    fontWeight: 'bold',
  },
  selectedPointBox: {
    backgroundColor: '#EFE7D8',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D3BC8E',
  },
  selectedPointName: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#242735',
  },
  selectedPointLandmark: {
    fontSize: 11,
    color: '#5B6275',
    marginTop: 2,
  },
  selectedPointEta: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8A5D1C',
    marginTop: 6,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 12,
    color: '#242735',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#242735',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD5C4',
    marginVertical: 10,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  costLabel: {
    fontSize: 11.5,
    color: '#555B6E',
  },
  costValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#242735',
  },
  freeCost: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#2D6E4E',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#242735',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8A5D1C',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    backgroundColor: '#EFEAE0',
    marginBottom: 8,
  },
  paymentOptionActive: {
    borderColor: '#C8A86B',
    backgroundColor: '#FFFDF5',
  },
  paymentRadio: {
    fontSize: 16,
    color: '#8A5D1C',
    marginRight: 10,
  },
  paymentName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#242735',
  },
  paymentSub: {
    fontSize: 10,
    color: '#656C80',
    marginTop: 1,
  },
  submitCheckoutBtn: {
    backgroundColor: '#C8A86B',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#C8A86B',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  submitCheckoutText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#1A1426',
  },
});
