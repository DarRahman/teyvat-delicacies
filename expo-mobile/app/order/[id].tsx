import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { formatMora } from '../../src/data/dishes';
import { useDelicaciesStore } from '../../src/store/useDelicaciesStore';

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [deliveryStage, setDeliveryStage] = useState(1);

  const orders = useDelicaciesStore((s) => s.orders);
  const matchedOrder = orders.find((o) => o.id === id) ?? orders[0];

  const stages = [
    { title: 'Dimasak di Dapur Wanmin', desc: 'Chef Xiangling meracik bumbu segar khas Teyvat' },
    { title: 'Kurir Glider Meluncur di Udara', desc: 'Melintasi langit Teyvat menuju titik pendaratan' },
    { title: 'Hidangan Mendarat di Lokasi', desc: 'Jamuan siap dinikmati oleh Traveler' },
  ];

  const handleAccelerate = () => {
    setDeliveryStage(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹ Beranda</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pelacakan Kurir Glider</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.successBanner}>
          <Text style={styles.successIcon}>✨</Text>
          <Text style={styles.successTitle}>Pesanan Berhasil Diproses!</Text>
          <Text style={styles.orderIdText}>ID: {id || matchedOrder?.id || 'ORD-TEYVAT-LATEST'}</Text>
          <Text style={styles.successDesc}>
            Kurir Glider Teyvat telah bertolak dari Wanmin Restaurant membawa hidangan pesanan Anda.
          </Text>
        </View>

        <View style={styles.trackerCard}>
          <Text style={styles.sectionTitle}>Status Pengantaran Udara</Text>

          <View style={styles.timeline}>
            {stages.map((stage, idx) => {
              const isPassed = idx <= deliveryStage;
              const isCurrent = idx === deliveryStage;
              return (
                <View key={idx} style={styles.stageRow}>
                  <View style={styles.indicatorCol}>
                    <View
                      style={[
                        styles.indicatorDot,
                        isPassed && styles.activeIndicatorDot,
                        isCurrent && styles.currentIndicatorDot,
                      ]}
                    >
                      <Text style={[styles.dotText, isPassed && styles.activeDotText]}>
                        {isPassed ? '✓' : idx + 1}
                      </Text>
                    </View>
                    {idx < stages.length - 1 && (
                      <View
                        style={[
                          styles.indicatorLine,
                          idx < deliveryStage && styles.activeIndicatorLine,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stageContent}>
                    <Text
                      style={[
                        styles.stageTitle,
                        isPassed && styles.activeStageTitle,
                      ]}
                    >
                      {stage.title}
                    </Text>
                    <Text style={styles.stageDesc}>{stage.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {deliveryStage < 2 && (
            <TouchableOpacity
              style={styles.accelerateBtn}
              onPress={handleAccelerate}
              activeOpacity={0.8}
            >
              <Text style={styles.accelerateBtnText}>Percepat Pendaratan Kurir Glider ⚡</Text>
            </TouchableOpacity>
          )}
        </View>

        {matchedOrder && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Rincian Pesanan</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tujuan Pengantaran:</Text>
              <Text style={styles.infoVal}>
                {matchedOrder.deliveryPoint.region} · {matchedOrder.deliveryPoint.name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Metode Pembayaran:</Text>
              <Text style={styles.infoVal}>{matchedOrder.paymentMethod}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemsList}>
              {matchedOrder.items.map((item, idx) => (
                <View key={idx} style={styles.orderItemLine}>
                  <Text style={styles.orderItemName}>
                    {item.dish.name} ×{item.quantity}
                  </Text>
                  <Text style={styles.orderItemPrice}>
                    {formatMora(item.dish.priceMora * item.quantity)} Mora
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pembayaran:</Text>
              <Text style={styles.totalVal}>{formatMora(matchedOrder.totalMora)} Mora</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.8}
        >
          <Text style={styles.homeBtnText}>Kembali ke Beranda Utama</Text>
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
  successBanner: {
    backgroundColor: '#242B3D',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8A86B60',
  },
  successIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF8E7',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 12,
    color: '#FFE7A5',
    fontWeight: '700',
    backgroundColor: '#2A354C',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  successDesc: {
    fontSize: 12,
    color: '#D0D4DF',
    textAlign: 'center',
    lineHeight: 18,
  },
  trackerCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  timeline: {
    gap: 10,
  },
  stageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 24,
  },
  indicatorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E4DAC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicatorDot: {
    backgroundColor: '#2B5838',
  },
  currentIndicatorDot: {
    backgroundColor: '#D4AF37',
  },
  dotText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8A7B68',
  },
  activeDotText: {
    color: '#FFFFFF',
  },
  indicatorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E4DAC8',
    marginVertical: 4,
  },
  activeIndicatorLine: {
    backgroundColor: '#2B5838',
  },
  stageContent: {
    flex: 1,
    paddingBottom: 14,
  },
  stageTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#8A7B68',
  },
  activeStageTitle: {
    color: '#2F3542',
  },
  stageDesc: {
    fontSize: 11,
    color: '#706452',
    marginTop: 2,
  },
  accelerateBtn: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  accelerateBtnText: {
    color: '#1C2232',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailsCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 12,
    color: '#655743',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F3542',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4DAC8',
  },
  itemsList: {
    gap: 6,
  },
  orderItemLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemName: {
    fontSize: 12,
    color: '#2F3542',
  },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B57A1E',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  totalVal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#B57A1E',
  },
  homeBtn: {
    backgroundColor: '#242B3D',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8A86B60',
  },
  homeBtnText: {
    color: '#FFE7A5',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
