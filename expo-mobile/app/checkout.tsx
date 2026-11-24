import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Compass,
  MapPin,
  Navigation,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  DiamondDivider,
  GoldCapsuleButton,
  MoraAmount,
  TeyvatImage,
} from '../components/TeyvatUI';
import {
  ASSET_ICONS,
  DELIVERY_POINTS,
  WANMIN_ORIGIN_COORDS,
  formatMora,
} from '../data/dishes';
import {
  buildGliderFlightArcPath,
  getDeliveryFeeForPoint,
  isLocalLiyueDelivery,
} from '../lib/delicaciesRules';
import { useDelicaciesStore } from '../store/useDelicaciesStore';
import {
  CHROME_BAR_GRADIENT,
  COLORS,
  FONTS,
  PARCHMENT_BG_GRADIENT,
} from '../theme/tokens';
import { PaymentMethod } from '../types';

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const cart = useDelicaciesStore((s) => s.cart);
  const profile = useDelicaciesStore((s) => s.profile);
  const selectedDeliveryPointId = useDelicaciesStore((s) => s.selectedDeliveryPointId);
  const setSelectedDeliveryPointId = useDelicaciesStore(
    (s) => s.setSelectedDeliveryPointId
  );
  const appliedCouponCode = useDelicaciesStore((s) => s.appliedCouponCode);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);
  const placeOrder = useDelicaciesStore((s) => s.placeOrder);
  // Reactive subscription for voucher usage
  useDelicaciesStore((s) => s.voucherUsageCount);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('NORTHLAND_BANK_CARD');
  const [kitchenNotes, setKitchenNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPoint =
    DELIVERY_POINTS.find((p) => p.id === selectedDeliveryPointId) ?? DELIVERY_POINTS[0];
  const isLocalLiyue = isLocalLiyueDelivery(selectedPoint);
  const totals = getCartTotals(selectedPoint);

  const flightArcPath = useMemo(
    () => buildGliderFlightArcPath(WANMIN_ORIGIN_COORDS, selectedPoint.mapCoords),
    [selectedPoint.mapCoords]
  );

  const insufficientMora =
    paymentMethod === 'NORTHLAND_BANK_CARD' && profile.moraBalance < totals.finalTotal;

  const handleConfirmOrder = () => {
    setErrorMessage(null);
    const result = placeOrder({
      deliveryPoint: selectedPoint,
      paymentMethod,
      kitchenNotes,
    });
    if (!result.ok) {
      setErrorMessage(result.error ?? 'Gagal memproses pesanan.');
      return;
    }
    if (result.order) {
      router.replace({
        pathname: '/order/[id]',
        params: { id: result.order.id },
      });
    }
  };

  return (
    <LinearGradient colors={PARCHMENT_BG_GRADIENT} style={styles.screen}>
      {/* Clean Genshin Top Bar */}
      <LinearGradient
        colors={CHROME_BAR_GRADIENT}
        style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Keranjang"
        >
          <ArrowLeft size={20} color={COLORS.goldBright} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Checkout Pengantaran
          </Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            Ongkir dinamis 8 wilayah Teyvat · Lokal Liyue gratis 0 Mora
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Interactive Teyvat Delivery Point Section */}
        <View style={styles.ivoryCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleLeft}>
              <MapPin size={16} color={COLORS.goldDeep} />
              <Text style={styles.sectionCardTitle}>Titik Pengantaran Teyvat</Text>
            </View>
            <Text style={styles.etaBadge}>Est. {selectedPoint.etaMinutes} mnt</Text>
          </View>

          {/* Active Waypoint Preview Card */}
          <View style={styles.activePointCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activePointTitle}>
                {selectedPoint.name}{' '}
                <Text style={styles.activePointRegion}>· {selectedPoint.region}</Text>
              </Text>
              <Text style={styles.activePointLandmark}>{selectedPoint.landmark}</Text>
              <View style={styles.courierHintRow}>
                <Navigation size={12} color={COLORS.successGreen} />
                <Text style={styles.courierHintText}>
                  {isLocalLiyue
                    ? 'Kurir Lokal Pelabuhan Liyue · Gratis Ongkir (0 Mora)'
                    : `Kurir Wind Glider: Dapur Wanmin → ${selectedPoint.region} (${formatMora(selectedPoint.deliveryFeeMora)} Mora)`}
                </Text>
              </View>
            </View>
            <View style={styles.selectedCheckCircle}>
              <Check size={14} color={COLORS.goldBright} strokeWidth={3} />
            </View>
          </View>

          {/* Interactive World Map Trigger Button */}
          <Pressable
            onPress={() => setIsMapModalOpen(true)}
            style={({ pressed }) => [
              styles.mapTriggerBtn,
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
          >
            <Compass size={16} color={COLORS.goldBright} />
            <Text style={styles.mapTriggerText}>Buka Peta Teyvat (8 Wilayah)</Text>
          </Pressable>

          {/* Compact 8-Region Quick-Switch Grid */}
          <View style={styles.regionGrid}>
            {DELIVERY_POINTS.map((point) => {
              const active = point.id === selectedPoint.id;
              const fee = getDeliveryFeeForPoint(point);
              return (
                <Pressable
                  key={point.id}
                  onPress={() => setSelectedDeliveryPointId(point.id)}
                  style={[
                    styles.regionTile,
                    active && styles.regionTileActive,
                  ]}
                >
                  <Text style={styles.regionTileTitle} numberOfLines={1}>
                    {point.region}
                  </Text>
                  <Text style={styles.regionTileName} numberOfLines={1}>
                    {point.name}
                  </Text>
                  <View style={styles.regionTileFooter}>
                    <Text
                      style={[
                        styles.regionTileFee,
                        { color: fee === 0 ? COLORS.successGreen : COLORS.goldDeep },
                      ]}
                    >
                      {fee === 0 ? 'Gratis 0 Mora' : `${formatMora(fee)} Mora`}
                    </Text>
                    <Text style={styles.regionTileEta}>{point.etaMinutes} mnt</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 2. Payment Method Radio Toggle with Official Genshin Icons */}
        <View style={styles.ivoryCard}>
          <Text style={[styles.sectionCardTitle, { marginBottom: 10 }]}>
            Metode Pembayaran Mora
          </Text>

          <View style={{ gap: 8 }}>
            <Pressable
              onPress={() => {
                setPaymentMethod('NORTHLAND_BANK_CARD');
                setErrorMessage(null);
              }}
              style={[
                styles.paymentCard,
                paymentMethod === 'NORTHLAND_BANK_CARD' && styles.paymentCardActive,
              ]}
            >
              <View style={styles.paymentLeft}>
                <View style={styles.paymentIconDark}>
                  <TeyvatImage
                    source={ASSET_ICONS.genesisCrystal}
                    fallbackSource={ASSET_ICONS.primogem}
                    style={styles.paymentIconImg}
                    contentFit="contain"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentTitle}>Kartu Northland Bank</Text>
                  <Text style={styles.paymentSub}>
                    Saldo: {formatMora(profile.moraBalance)} Mora
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'NORTHLAND_BANK_CARD' && styles.radioOuterActive,
                ]}
              >
                {paymentMethod === 'NORTHLAND_BANK_CARD' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                setPaymentMethod('MORA_COD');
                setErrorMessage(null);
              }}
              style={[
                styles.paymentCard,
                paymentMethod === 'MORA_COD' && styles.paymentCardActive,
              ]}
            >
              <View style={styles.paymentLeft}>
                <View style={styles.paymentIconWarm}>
                  <TeyvatImage
                    source={ASSET_ICONS.mora}
                    fallbackSource={ASSET_ICONS.moraCdn}
                    style={styles.paymentIconImg}
                    contentFit="contain"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.paymentTitle}>Mora Tunai saat Terima</Text>
                  <Text style={styles.paymentDesc}>
                    {isLocalLiyue
                      ? 'Bayar langsung ke Kurir Lokal Dapur Wanmin'
                      : 'Bayar langsung ke Kurir Glider saat mendarat'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  paymentMethod === 'MORA_COD' && styles.radioOuterActive,
                ]}
              >
                {paymentMethod === 'MORA_COD' && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          </View>

          {insufficientMora && (
            <Text style={styles.errorNote}>
              Saldo Mora Northland Bank kurang. Pilih Mora Tunai saat Terima atau klaim Mora di Profil.
            </Text>
          )}
        </View>

        {/* 3. Kitchen Notes for Chef Xiangling */}
        <View style={styles.ivoryCard}>
          <Text style={[styles.sectionCardTitle, { fontSize: 13, marginBottom: 8 }]}>
            Catatan Dapur untuk Chef Xiangling
          </Text>
          <TextInput
            value={kitchenNotes}
            onChangeText={setKitchenNotes}
            multiline
            numberOfLines={3}
            placeholder="Contoh: Kurangi Jueyun Chili ya, atau pisahkan kuah kaldu agar tetap hangat..."
            placeholderTextColor="#7B7487"
            textAlignVertical="top"
            style={styles.notesInput}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.ivoryCard}>
          <View style={styles.summaryRows}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {cart.length} jenis hidangan ({totals.itemCount} porsi)
              </Text>
              <Text style={styles.summaryVal}>{formatMora(totals.subtotal)} Mora</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {isLocalLiyue
                  ? 'Kurir Lokal (Pelabuhan Liyue)'
                  : `Kurir Glider (${selectedPoint.region})`}
              </Text>
              <Text
                style={[
                  styles.summaryVal,
                  totals.deliveryFee === 0 && { color: COLORS.successGreen },
                ]}
              >
                {totals.deliveryFee === 0
                  ? isLocalLiyue
                    ? 'Gratis · 0 Mora'
                    : 'Gratis (Voucher)'
                  : `${formatMora(totals.deliveryFee)} Mora`}
              </Text>
            </View>
            {totals.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: COLORS.successGreen }]}>
                  Potongan Voucher ({appliedCouponCode})
                </Text>
                <Text style={[styles.summaryVal, { color: COLORS.successGreen }]}>
                  -{formatMora(totals.discount)} Mora
                </Text>
              </View>
            )}
          </View>

          <DiamondDivider style={{ marginVertical: 10 }} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total Bayar</Text>
            <MoraAmount
              amount={totals.finalTotal}
              size="md"
              showSuffix
              color={COLORS.inkPrimary}
            />
          </View>
        </View>

        {errorMessage && <Text style={styles.errorCenter}>{errorMessage}</Text>}
      </ScrollView>

      {/* Clean Genshin Bottom Sticky Confirm CTA */}
      <LinearGradient
        colors={CHROME_BAR_GRADIENT}
        style={[
          styles.stickyFooter,
          { paddingBottom: Math.max(insets.bottom + 10, 14) },
        ]}
      >
        <GoldCapsuleButton
          onPress={handleConfirmOrder}
          disabled={insufficientMora || cart.length === 0}
        >
          Konfirmasi Pesanan — {formatMora(totals.finalTotal)} Mora
        </GoldCapsuleButton>
      </LinearGradient>

      {/* INTERACTIVE 8-REALM TEYVAT WORLD MAP MODAL */}
      <Modal
        visible={isMapModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMapModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <LinearGradient colors={CHROME_BAR_GRADIENT} style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <TeyvatImage
                  source={ASSET_ICONS.modalOrnament}
                  fallbackSource={ASSET_ICONS.crownOfInsight}
                  style={styles.modalOrnament}
                  contentFit="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle} numberOfLines={1}>
                    Peta Pengantaran Teyvat
                  </Text>
                  <Text style={styles.modalSub} numberOfLines={1}>
                    8 wilayah · Ongkir dinamis dari Dapur Wanmin
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setIsMapModalOpen(false)}
                style={styles.modalCloseBtn}
                accessibilityLabel="Tutup Peta Teyvat"
              >
                <X size={16} color={COLORS.goldBright} />
              </Pressable>
            </LinearGradient>

            <ScrollView
              contentContainerStyle={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Full 8-Region Teyvat World Map with SVG Trajectory & Pins */}
              <View style={styles.mapFrame}>
                <Image
                  source={ASSET_ICONS.teyvatMap}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />

                {/* SVG Golden Trajectory Path from Wanmin Kitchen */}
                <Svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                >
                  {isLocalLiyue ? (
                    <Circle
                      cx={WANMIN_ORIGIN_COORDS.x}
                      cy={WANMIN_ORIGIN_COORDS.y}
                      r={5.2}
                      fill="rgba(255, 231, 165, 0.28)"
                      stroke="#FFE7A5"
                      strokeWidth={0.9}
                      strokeDasharray="1.8 1.2"
                    />
                  ) : flightArcPath ? (
                    <>
                      <Path
                        d={flightArcPath}
                        fill="none"
                        stroke="rgba(32, 38, 56, 0.45)"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                      />
                      <Path
                        d={flightArcPath}
                        fill="none"
                        stroke="#FFE7A5"
                        strokeWidth={1.1}
                        strokeDasharray="2.5 1.5"
                        strokeLinecap="round"
                      />
                    </>
                  ) : null}
                  <Circle
                    cx={WANMIN_ORIGIN_COORDS.x}
                    cy={WANMIN_ORIGIN_COORDS.y}
                    r={1.7}
                    fill="#FFE7A5"
                    stroke="#22283A"
                    strokeWidth={0.5}
                  />
                </Svg>

                {/* All 8 Clickable Regional Waypoint Pins */}
                {DELIVERY_POINTS.map((point) => {
                  const isSelected = point.id === selectedPoint.id;
                  const alignRight = point.mapCoords.x > 76;
                  const placeAbove = point.mapCoords.y > 76;
                  return (
                    <Pressable
                      key={point.id}
                      onPress={() => setSelectedDeliveryPointId(point.id)}
                      style={[
                        styles.mapPinWrap,
                        {
                          left: `${point.mapCoords.x}%`,
                          top: `${point.mapCoords.y}%`,
                        },
                      ]}
                      accessibilityLabel={`Pilih ${point.region}`}
                    >
                      <View
                        style={[
                          styles.mapPinCircle,
                          isSelected && styles.mapPinCircleSelected,
                        ]}
                      >
                        <MapPin
                          size={isSelected ? 13 : 10}
                          color={isSelected ? '#22283A' : COLORS.goldBright}
                        />
                      </View>
                      <View
                        style={[
                          styles.mapPinLabel,
                          isSelected && styles.mapPinLabelSelected,
                          placeAbove ? { bottom: 26 } : { top: 24 },
                          alignRight ? { right: -4 } : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.mapPinLabelText,
                            isSelected && { color: '#22283A' },
                          ]}
                          numberOfLines={1}
                        >
                          {point.region}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}

                {/* Compact Legend Badge Top-Left */}
                <View style={styles.mapLegend} pointerEvents="none">
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: COLORS.goldBright }]} />
                    <Text style={styles.legendText}>Asal: Wanmin</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        {
                          backgroundColor: COLORS.goldWarm,
                          borderWidth: 1,
                          borderColor: COLORS.goldBright,
                        },
                      ]}
                    />
                    <Text style={styles.legendText}>Tujuan</Text>
                  </View>
                </View>
              </View>

              {/* Horizontal Quick-Tap Chips for All 8 Realms */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mapChipsRow}
              >
                {DELIVERY_POINTS.map((point) => {
                  const active = point.id === selectedPoint.id;
                  return (
                    <Pressable
                      key={point.id}
                      onPress={() => setSelectedDeliveryPointId(point.id)}
                      style={[styles.mapChip, active && styles.mapChipActive]}
                    >
                      <Text
                        style={[
                          styles.mapChipText,
                          active && { color: COLORS.goldBright },
                        ]}
                      >
                        {point.region}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Waypoint Confirmation Card */}
              <View style={styles.mapConfirmCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapConfirmEyebrow}>
                    {isLocalLiyue
                      ? 'PENGANTARAN LOKAL · LIYUE'
                      : `TITIK PENDARATAN · ${selectedPoint.region.toUpperCase()}`}
                  </Text>
                  <Text style={styles.mapConfirmName}>{selectedPoint.name}</Text>
                  <Text style={styles.mapConfirmLandmark}>{selectedPoint.landmark}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      styles.mapConfirmFee,
                      { color: isLocalLiyue ? COLORS.successGreen : COLORS.goldDeep },
                    ]}
                  >
                    {isLocalLiyue
                      ? 'Gratis 0 Mora'
                      : `${formatMora(selectedPoint.deliveryFeeMora)} Mora`}
                  </Text>
                  <Text style={styles.mapConfirmEta}>
                    Est. {selectedPoint.etaMinutes} mnt
                  </Text>
                </View>
              </View>

              <GoldCapsuleButton onPress={() => setIsMapModalOpen(false)}>
                Konfirmasi Titik Pengantaran
              </GoldCapsuleButton>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 16,
    color: COLORS.goldBright,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.navSubtext,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
    gap: 14,
  },
  ivoryCard: {
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 15,
    shadowColor: '#443824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionCardTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: COLORS.inkPrimary,
  },
  etaBadge: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#6B4A1B',
  },
  activePointCard: {
    borderRadius: 12,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  activePointTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 13.5,
    color: COLORS.inkPrimary,
  },
  activePointRegion: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.goldDeep,
  },
  activePointLandmark: {
    fontSize: 11.5,
    color: '#575C70',
    marginTop: 3,
    lineHeight: 16,
  },
  courierHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  courierHintText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.successGreen,
    flexShrink: 1,
  },
  selectedCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#242B3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTriggerBtn: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#242B3E',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  mapTriggerText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.goldBright,
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 7,
  },
  regionTile: {
    width: '48.6%',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: COLORS.insetWarm,
  },
  regionTileActive: {
    backgroundColor: '#FFFDF8',
    borderColor: COLORS.goldWarm,
    borderWidth: 1.5,
  },
  regionTileTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.inkPrimary,
  },
  regionTileName: {
    fontSize: 10,
    color: COLORS.inkMuted,
    marginTop: 1,
  },
  regionTileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  regionTileFee: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
  },
  regionTileEta: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: COLORS.goldMuted,
  },
  paymentCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D5CBB7',
    backgroundColor: 'rgba(236, 229, 216, 0.72)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  paymentCardActive: {
    backgroundColor: '#FFFDF8',
    borderColor: COLORS.goldWarm,
    borderWidth: 1.5,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  paymentIconDark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#242B3E',
    borderWidth: 1,
    borderColor: 'rgba(200,168,107,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIconWarm: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.insetTrack,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIconImg: {
    width: 26,
    height: 26,
  },
  paymentTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 12.5,
    color: COLORS.inkPrimary,
  },
  paymentSub: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: '#575C70',
    marginTop: 2,
  },
  paymentDesc: {
    fontSize: 11,
    color: '#575C70',
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A79E8D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.goldWarm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.goldWarm,
  },
  errorNote: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.dangerRed,
    marginTop: 8,
  },
  notesInput: {
    minHeight: 74,
    borderRadius: 12,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: '#CBB997',
    padding: 12,
    fontSize: 12,
    color: COLORS.inkBody,
  },
  summaryRows: {
    gap: 7,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.inkSecondary,
    flexShrink: 1,
  },
  summaryVal: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkPrimary,
  },
  summaryTotalLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: COLORS.inkPrimary,
  },
  errorCenter: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dangerRed,
    textAlign: 'center',
  },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 34, 52, 0.74)',
    justifyContent: 'center',
    padding: 14,
  },
  modalSheet: {
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: COLORS.parchmentMid,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalOrnament: {
    width: 28,
    height: 28,
  },
  modalTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 14.5,
    color: COLORS.goldBright,
  },
  modalSub: {
    fontSize: 10.5,
    color: COLORS.navSubtext,
    marginTop: 1,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 14,
    gap: 10,
  },
  mapFrame: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: COLORS.mapSea,
    position: 'relative',
  },
  mapPinWrap: {
    position: 'absolute',
    marginLeft: -12,
    marginTop: -12,
    alignItems: 'center',
    zIndex: 15,
  },
  mapPinCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(34, 40, 58, 0.92)',
    borderWidth: 2,
    borderColor: COLORS.goldBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinCircleSelected: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.goldBright,
    borderColor: '#22283A',
  },
  mapPinLabel: {
    position: 'absolute',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(34, 40, 58, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,231,165,0.45)',
  },
  mapPinLabelSelected: {
    backgroundColor: COLORS.goldBright,
    borderColor: COLORS.ivoryTop,
    zIndex: 25,
  },
  mapPinLabelText: {
    fontFamily: FONTS.genshin,
    fontSize: 8,
    color: COLORS.inkIvory,
  },
  mapLegend: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 40, 58, 0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255,231,165,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 9,
    color: COLORS.inkIvory,
    fontWeight: '600',
  },
  mapChipsRow: {
    gap: 6,
  },
  mapChip: {
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    justifyContent: 'center',
  },
  mapChipActive: {
    backgroundColor: '#242B3E',
    borderColor: COLORS.goldBorder,
  },
  mapChipText: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: '#3B4255',
  },
  mapConfirmCard: {
    borderRadius: 14,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  mapConfirmEyebrow: {
    fontFamily: FONTS.genshin,
    fontSize: 9.5,
    color: COLORS.goldDeep,
    letterSpacing: 0.4,
  },
  mapConfirmName: {
    fontFamily: FONTS.genshin,
    fontSize: 13.5,
    color: COLORS.inkPrimary,
    marginTop: 2,
  },
  mapConfirmLandmark: {
    fontSize: 11,
    color: '#575C70',
    marginTop: 2,
  },
  mapConfirmFee: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
  },
  mapConfirmEta: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: COLORS.goldMuted,
    marginTop: 2,
  },
});
