import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

/**
 * Halaman Konfirmasi & Status Pesanan - Teyvat Delicacies
 * 
 * Memenuhi Ketentuan Soal 4: Fitur 6 (Simulasi Checkout & Konfirmasi):
 * • Setelah checkout dilakukan, tampilkan pesan bahwa pesanan berhasil dibuat atau tampilkan halaman konfirmasi pesanan.
 * • Mengambil parameter ID pesanan rute Expo Router (useLocalSearchParams).
 */
export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [deliveryStage, setDeliveryStage] = useState(1); // 0: Masak, 1: Glider Meluncur, 2: Tiba

  // Simulasi pergerakan kurir glider seiring waktu
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeliveryStage(2);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const stages = [
    { label: 'Dimasak di Dapur Wanmin', desc: 'Chef Xiangling meracik bumbu segar khas Liyue' },
    { label: 'Kurir Glider Meluncur di Udara', desc: 'Membawa jamuan hangat melintasi langit Teyvat' },
    { label: 'Hidangan Mendarat di Lokasi', desc: 'Jamuan siap dinikmati oleh Traveler' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Status */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹ Beranda</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Status Pelacakan Jamuan</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Konfirmasi Sukses (Ketentuan Soal) */}
        <View style={styles.successBanner}>
          <Text style={styles.successIcon}>✨</Text>
          <Text style={styles.successTitle}>Pesanan Berhasil Dikonfirmasi!</Text>
          <Text style={styles.orderIdText}>Nomor Pesanan: {id || 'ORD-TEYVAT-7775'}</Text>
          <Text style={styles.successDesc}>
            Terima kasih telah memesan jamuan lezat khas Teyvat. Pesanan sedang diproses.
          </Text>
        </View>

        {/* Pelacakan Kurir Glider Berbasis Tahapan */}
        <View style={styles.trackingCard}>
          <Text style={styles.trackingHeading}>🦅 Lintasan Terbang Kurir Glider</Text>
          
          <View style={styles.timeline}>
            {stages.map((stg, idx) => {
              const isPassed = idx <= deliveryStage;
              const isCurrent = idx === deliveryStage;
              return (
                <View key={idx} style={styles.timelineItem}>
                  <View style={styles.nodeColumn}>
                    <View
                      style={[
                        styles.timelineNode,
                        isPassed && styles.timelineNodeActive,
                        isCurrent && styles.timelineNodeCurrent,
                      ]}
                    >
                      <Text style={[styles.nodeIcon, isPassed && styles.nodeIconActive]}>
                        {isPassed ? '✓' : '•'}
                      </Text>
                    </View>
                    {idx < stages.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          idx < deliveryStage && styles.timelineLineActive,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineTitle,
                        isPassed && styles.timelineTitleActive,
                      ]}
                    >
                      {stg.label}
                    </Text>
                    <Text style={styles.timelineDesc}>{stg.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Ringkasan Bukti Pengantaran */}
        <View style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>Struk Ringkasan Pesanan</Text>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptItem}>Adeptus&apos; Temptation ×2</Text>
            <Text style={styles.receiptPrice}>🪙 50,000 Mora</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptItem}>Barbatos Ratatouille ×1</Text>
            <Text style={styles.receiptPrice}>🪙 5,500 Mora</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>🪙 55,500 Mora</Text>
          </View>
          <Text style={styles.payNote}>Metode: Bayar Tunai Mora saat Terima (COD)</Text>
        </View>

        {/* Tombol Kembali ke Beranda */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.8}
        >
          <Text style={styles.doneBtnText}>Kembali ke Beranda Utama ➔</Text>
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
  successBanner: {
    backgroundColor: '#272038',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    marginBottom: 16,
    elevation: 3,
  },
  successIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFE7A5',
    textAlign: 'center',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C8D0E4',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 11.5,
    color: '#E9E5DC',
    textAlign: 'center',
    lineHeight: 18,
  },
  trackingCard: {
    backgroundColor: '#FAF8F2',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    marginBottom: 16,
    elevation: 2,
  },
  trackingHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nodeColumn: {
    alignItems: 'center',
    marginRight: 14,
  },
  timelineNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAE3D4',
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineNodeActive: {
    backgroundColor: '#C8A86B',
    borderColor: '#8A5D1C',
  },
  timelineNodeCurrent: {
    backgroundColor: '#272038',
    borderColor: '#FFE7A5',
  },
  nodeIcon: {
    fontSize: 11,
    color: '#8A5D1C',
    fontWeight: 'bold',
  },
  nodeIconActive: {
    color: '#FFFDF5',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#DDD5C4',
    marginVertical: 2,
  },
  timelineLineActive: {
    backgroundColor: '#C8A86B',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#656C80',
    marginBottom: 2,
  },
  timelineTitleActive: {
    color: '#242735',
  },
  timelineDesc: {
    fontSize: 11,
    color: '#70778B',
    lineHeight: 15,
  },
  receiptCard: {
    backgroundColor: '#FAF8F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    marginBottom: 20,
    elevation: 1,
  },
  receiptTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptItem: {
    fontSize: 12,
    color: '#242735',
  },
  receiptPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#242735',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD5C4',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#242735',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8A5D1C',
  },
  payNote: {
    fontSize: 10.5,
    color: '#7A8194',
    marginTop: 6,
    fontStyle: 'italic',
  },
  doneBtn: {
    backgroundColor: '#C8A86B',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#C8A86B',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  doneBtnText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#1A1426',
  },
});
