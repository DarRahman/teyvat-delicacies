import React, { useMemo, useState } from 'react';
import {
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
import { ArrowLeft, Check, MapPin, Navigation } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  DiamondDivider,
  GoldCapsuleButton,
  MoraAmount,
  ParchmentCard,
  ParchmentIconBox,
  ParchmentScreen,
  TeleportWaypointIcon,
  TeyvatImage,
  TeyvatModalSheet,
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
import { CHROME_BAR_GRADIENT, COLORS, FONTS } from '../theme/tokens';
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
    <ParchmentScreen
      header={
        <View style={styles.headerRow}>
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
        </View>
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ParchmentCard>
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

          {/* Interactive World Map Trigger Button with Genshin Teleport Waypoint Icon */}
          <Pressable
            onPress={() => setIsMapModalOpen(true)}
            style={({ pressed }) => [
              styles.mapTriggerBtn,
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
          >
            <TeleportWaypointIcon size={20} active />
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
        </ParchmentCard>

        <ParchmentCard>
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
                <ParchmentIconBox size={40}>
                  <TeyvatImage
                    source={ASSET_ICONS.genesisCrystal}
                    fallbackSource={ASSET_ICONS.primogem}
                    style={styles.paymentIconImg}
                    contentFit="contain"
                  />
                </ParchmentIconBox>
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
                <ParchmentIconBox size={40}>
                  <TeyvatImage
                    source={ASSET_ICONS.mora}
                    fallbackSource={ASSET_ICONS.moraCdn}
                    style={styles.paymentIconImg}
                    contentFit="contain"
                  />
                </ParchmentIconBox>
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
              Saldo Mora Northland Bank kurang. Pilih Mora Tunai atau tukar Primogem di Profil.
            </Text>
          )}
        </ParchmentCard>

        <ParchmentCard>
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
        </ParchmentCard>

        <ParchmentCard>
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
        </ParchmentCard>

        {errorMessage && <Text style={styles.errorCenter}>{errorMessage}</Text>}
      </ScrollView>

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

      <TeyvatModalSheet
        visible={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        title="Peta Pengantaran Teyvat"
        subtitle="8 Teleport Waypoint · Ongkir dari Dapur Wanmin"
        maxHeight="92%"
        footer={
          <GoldCapsuleButton onPress={() => setIsMapModalOpen(false)}>
            Konfirmasi Titik Pengantaran
          </GoldCapsuleButton>
        }
      >
        <ScrollView
          contentContainerStyle={styles.modalBody}
          showsVerticalScrollIndicator={false}
        >
          {/* Full 8-Region Teyvat World Map with SVG Trajectory & Teleport Waypoints */}
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
                    stroke="rgba(32, 38, 56, 0.5)"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  />
                  <Path
                    d={flightArcPath}
                    fill="none"
                    stroke="#FFE7A5"
                    strokeWidth={1.15}
                    strokeDasharray="2.5 1.5"
                    strokeLinecap="round"
                  />
                </>
              ) : null}
              <Circle
                cx={WANMIN_ORIGIN_COORDS.x}
                cy={WANMIN_ORIGIN_COORDS.y}
                r={1.9}
                fill="#FFE7A5"
                stroke="#22283A"
                strokeWidth={0.6}
              />
            </Svg>

            {/* All 8 Clickable Teleport Waypoint Pins (Unclipped Full Region Labels) */}
            {DELIVERY_POINTS.map((point) => {
              const isSelected = point.id === selectedPoint.id;
              const isAbove =
                point.region === 'Inazuma' ||
                point.region === 'Mondstadt' ||
                point.mapCoords.y > 72;
              const shiftX =
                point.region === 'Inazuma'
                  ? -18
                  : point.region === 'Liyue'
                  ? 14
                  : point.region === 'Sumeru'
                  ? -14
                  : point.region === 'Mondstadt'
                  ? 6
                  : 0;

              return (
                <View
                  key={point.id}
                  pointerEvents="box-none"
                  style={[
                    styles.waypointHitBox,
                    {
                      left: `${point.mapCoords.x}%`,
                      top: `${point.mapCoords.y}%`,
                      zIndex: isSelected ? 30 : 15,
                    },
                  ]}
                >
                  <Pressable
                    onPress={() => setSelectedDeliveryPointId(point.id)}
                    hitSlop={10}
                    style={[
                      styles.waypointAura,
                      isSelected && styles.waypointAuraActive,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Teleport Waypoint ${point.region}`}
                  >
                    <TeleportWaypointIcon
                      size={isSelected ? 26 : 21}
                      active={isSelected}
                    />
                  </Pressable>
                  <View
                    pointerEvents="none"
                    style={[
                      styles.mapPinLabel,
                      isSelected && styles.mapPinLabelSelected,
                      isAbove ? { bottom: 38 } : { top: 38 },
                      shiftX !== 0 ? { transform: [{ translateX: shiftX }] } : null,
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
                </View>
              );
            })}

            {/* Compact Legend Badge Top-Left */}
            <View style={styles.mapLegend} pointerEvents="none">
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: COLORS.goldBright }]} />
                <Text style={styles.legendText}>Wanmin</Text>
              </View>
              <View style={styles.legendItem}>
                <TeleportWaypointIcon size={13} />
                <Text style={styles.legendText}>Waypoint</Text>
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
                  <TeleportWaypointIcon size={13} active={active} />
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
          <ParchmentCard style={styles.mapConfirmCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapConfirmEyebrow}>
                {isLocalLiyue
                  ? 'PENGANTARAN LOKAL · LIYUE'
                  : `TELEPORT WAYPOINT · ${selectedPoint.region.toUpperCase()}`}
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
          </ParchmentCard>
        </ScrollView>
      </TeyvatModalSheet>
    </ParchmentScreen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
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
    paddingBottom: 18,
    gap: 14,
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
  waypointHitBox: {
    position: 'absolute',
    width: 112,
    height: 36,
    marginLeft: -56,
    marginTop: -18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waypointAura: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(18, 30, 50, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(79, 214, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waypointAuraActive: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(34, 40, 58, 0.92)',
    borderWidth: 1.5,
    borderColor: COLORS.goldBright,
    shadowColor: '#FFE7A5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  mapPinLabel: {
    position: 'absolute',
    minWidth: 55,
    width: 'auto',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    backgroundColor: 'rgba(26, 33, 51, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,231,165,0.45)',
  },
  mapPinLabelSelected: {
    backgroundColor: COLORS.goldBright,
    borderColor: COLORS.ivoryTop,
    zIndex: 35,
  },
  mapPinLabelText: {
    fontFamily: FONTS.genshin,
    fontSize: 8.5,
    color: COLORS.inkIvory,
    textAlign: 'center',
  },
  mapLegend: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 33, 51, 0.88)',
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
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
