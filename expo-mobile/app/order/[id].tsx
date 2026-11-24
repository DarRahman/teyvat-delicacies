import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, Clock, Flame, Footprints, MapPin } from 'lucide-react-native';
import {
  DiamondBullet,
  DiamondDivider,
  DiamondStar,
  GoldCapsuleButton,
  MoraAmount,
  ParchmentCard,
  ParchmentScreen,
  TeyvatImage,
  WindGliderIcon,
} from '../../components/TeyvatUI';
import { ASSET_ICONS, PRIMOGEM_RULES, formatMora } from '../../data/dishes';
import {
  clampGliderProgress,
  getGliderStageFromProgress,
  isLocalLiyueDelivery,
} from '../../lib/delicaciesRules';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import {
  CHROME_BAR_GRADIENT,
  COLORS,
  FONTS,
  GOLD_RAIL_GRADIENT,
  PARCHMENT_BG_GRADIENT,
} from '../../theme/tokens';

export default function OrderStatusScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const orders = useDelicaciesStore((s) => s.orders);
  const updateOrderStatus = useDelicaciesStore((s) => s.updateOrderStatus);

  const order = orders.find((o) => o.id === id) ?? orders[0];
  const initialTotalSeconds = (order?.deliveryPoint.etaMinutes ?? 12) * 60;
  const startedCompleted = order?.status === 'COMPLETED';

  const [progress, setProgress] = useState<number>(startedCompleted ? 100 : 4);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [railWidth, setRailWidth] = useState(220);

  const dispatchedRef = useRef(order?.status !== 'COOKING');
  const completedRef = useRef(startedCompleted);

  // Smooth continuous real-time courier progress (0% -> 100%)
  useEffect(() => {
    if (!order || order.status === 'COMPLETED' || completedRef.current) return;

    const tick = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return clampGliderProgress(prev + 1.25);
      });
    }, 65);

    return () => clearInterval(tick);
  }, [order?.id, order?.status]);

  // Synchronize store order status & Quest Complete modal + +60 Primogem reward
  useEffect(() => {
    if (!order) return;

    if (progress >= 18 && !dispatchedRef.current) {
      dispatchedRef.current = true;
      updateOrderStatus(order.id, 'GLIDER_DISPATCHED');
    }

    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      updateOrderStatus(order.id, 'COMPLETED');
      setShowQuestModal(true);
    }
  }, [progress, order, updateOrderStatus]);

  const handleInstantDeliver = () => {
    if (!order) return;
    dispatchedRef.current = true;
    completedRef.current = true;
    setProgress(100);
    updateOrderStatus(order.id, 'COMPLETED');
    setShowQuestModal(true);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (!order) {
    return (
      <LinearGradient colors={PARCHMENT_BG_GRADIENT} style={styles.emptyScreen}>
        <Text style={styles.notFoundTitle}>Pesanan tidak ditemukan</Text>
        <View style={{ width: 240, marginTop: 16 }}>
          <GoldCapsuleButton onPress={() => router.replace('/(tabs)')}>
            Kembali ke Beranda
          </GoldCapsuleButton>
        </View>
      </LinearGradient>
    );
  }

  const isLocalLiyue = isLocalLiyueDelivery(order.deliveryPoint);
  const stage = getGliderStageFromProgress(progress);
  const roundedPercent = Math.round(progress);
  const remainingSeconds = Math.max(
    0,
    Math.round(initialTotalSeconds * (1 - progress / 100))
  );
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');

  const statusHeadline =
    stage === 0
      ? 'Dimasak di Dapur Wanmin'
      : stage === 1
      ? isLocalLiyue
        ? 'Kurir Lokal Menuju Teras Yujing'
        : `Kurir Glider Menuju ${order.deliveryPoint.region}`
      : isLocalLiyue
      ? `Tiba di ${order.deliveryPoint.name}`
      : `Mendarat di ${order.deliveryPoint.name}`;

  const statusSubcopy =
    stage === 0
      ? 'Chef Xiangling sedang meracik dan menyegel kehangatan hidanganmu.'
      : stage === 1
      ? isLocalLiyue
        ? 'Kurir lokal Dapur Wanmin mengantar pesanan hangat melintasi Pelabuhan Liyue (Gratis Ongkir).'
        : `Kurir Wind Glider meluncur membawa pesanan ke ${order.deliveryPoint.name}.`
      : 'Pesanan kuliner telah tiba hangat di lokasi pilihanmu.';

  const phases = [
    { label: 'Dapur Wanmin', active: stage >= 0, current: stage === 0 },
    {
      label: isLocalLiyue ? 'Kurir Lokal' : 'Kurir Meluncur',
      active: stage >= 1,
      current: stage === 1,
    },
    { label: 'Pesanan Tiba', active: stage >= 2, current: stage === 2 },
  ];

  const medallionLeft = (railWidth * progress) / 100 - 20;

  return (
    <ParchmentScreen
      header={
        <View style={styles.headerRow}>
          <Pressable
            onPress={handleBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <ArrowLeft size={19} color={COLORS.goldBright} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderIdHeader}>{order.id}</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {isLocalLiyue ? 'Pengantaran Lokal Liyue' : 'Pelacakan Kurir Glider'}
            </Text>
          </View>
          <View style={styles.etaHud}>
            <Clock size={15} color={COLORS.goldBright} />
            <Text style={styles.etaHudText}>
              {stage >= 2 ? 'Tiba' : `${mins}:${secs}`}
            </Text>
          </View>
        </View>
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Commission Progress Card */}
        <ParchmentCard style={{ gap: 14 }}>
          <View style={styles.progressTopRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.commissionTagRow}>
                <DiamondStar size={9} color="#C8963E" />
                <Text style={styles.commissionTagText}>
                  {isLocalLiyue
                    ? 'PENGANTARAN LOKAL · PELABUHAN LIYUE'
                    : 'MISI PENGANTARAN AKTIF'}
                </Text>
              </View>
              <Text style={styles.statusHeadline}>{statusHeadline}</Text>
              <Text style={styles.statusSubcopy}>{statusSubcopy}</Text>
            </View>
            <Text style={styles.percentText}>{roundedPercent}%</Text>
          </View>

          {/* Warm Parchment & Antique Gold Delivery Corridor */}
          <View style={styles.corridorBox}>
            <View style={styles.trackRow}>
              <View style={styles.originNode}>
                <Flame size={16} color={COLORS.goldDeep} />
              </View>

              <View
                style={styles.railWrap}
                onLayout={(e) => setRailWidth(e.nativeEvent.layout.width)}
              >
                <View style={styles.railBg}>
                  <LinearGradient
                    colors={GOLD_RAIL_GRADIENT}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[styles.railFill, { width: `${progress}%` }]}
                  />
                </View>

                {/* Smoothly Gliding Courier Medallion */}
                <View
                  style={[
                    styles.medallionWrap,
                    { left: Math.max(-12, Math.min(railWidth - 28, medallionLeft)) },
                  ]}
                >
                  <View
                    style={[
                      styles.medallionCircle,
                      stage >= 2 && styles.medallionDone,
                    ]}
                  >
                    {stage >= 2 ? (
                      <Check size={16} color={COLORS.chromeTop} strokeWidth={3} />
                    ) : isLocalLiyue ? (
                      <Footprints size={16} color={COLORS.goldBright} />
                    ) : (
                      <WindGliderIcon size={22} color={COLORS.goldBright} />
                    )}
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.destNode,
                  stage >= 2 && styles.destNodeDone,
                ]}
              >
                <MapPin
                  size={16}
                  color={stage >= 2 ? COLORS.goldBright : '#7D6C4F'}
                />
              </View>
            </View>

            {/* Aligned Origin -> ETA -> Destination Labels */}
            <View style={styles.corridorLabels}>
              <View>
                <Text style={styles.corridorTitle}>Dapur Wanmin</Text>
                <Text style={styles.corridorSub}>Liyue · Asal</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.corridorEta}>
                  {stage >= 2 ? 'Pesanan Tiba' : `Est. ${mins}:${secs}`}
                </Text>
                <Text style={styles.corridorSub}>
                  {isLocalLiyue ? 'Kurir Lokal · 0 Mora' : 'Kurir Wind Glider'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', maxWidth: 100 }}>
                <Text style={styles.corridorTitle} numberOfLines={1}>
                  {isLocalLiyue ? 'Teras Yujing' : order.deliveryPoint.region}
                </Text>
                <Text style={styles.corridorSub} numberOfLines={1}>
                  {isLocalLiyue ? 'Liyue · Lokal' : 'Tujuan'}
                </Text>
              </View>
            </View>
          </View>

          {/* Inline Diamond Milestone Strip */}
          <View style={styles.milestoneStrip}>
            {phases.map((phase, idx) => (
              <React.Fragment key={phase.label}>
                <View style={styles.milestoneItem}>
                  {phase.active ? (
                    <DiamondStar
                      size={10}
                      color={phase.current ? COLORS.goldWarm : COLORS.goldBorder}
                    />
                  ) : (
                    <DiamondBullet size={6} color="#CFC4AE" />
                  )}
                  <Text
                    style={[
                      styles.milestoneText,
                      phase.current
                        ? { color: COLORS.goldDeep }
                        : phase.active
                        ? { color: COLORS.inkBody }
                        : { color: '#8F887A' },
                    ]}
                    numberOfLines={1}
                  >
                    {phase.label}
                  </Text>
                </View>
                {idx < phases.length - 1 && <View style={styles.milestoneLine} />}
              </React.Fragment>
            ))}
          </View>

          {stage < 2 && (
            <GoldCapsuleButton onPress={handleInstantDeliver}>
              {isLocalLiyue
                ? 'Percepat Pengantaran Lokal'
                : 'Percepat Pendaratan Kurir Glider'}
            </GoldCapsuleButton>
          )}
        </ParchmentCard>

        {/* Clean Ivory Parchment Order Receipt Card (Includes Voucher Discount Row) */}
        <ParchmentCard style={{ gap: 12 }}>
          <View style={styles.receiptDestRow}>
            <MapPin size={16} color={COLORS.goldDeep} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.receiptEyebrow}>
                {isLocalLiyue
                  ? 'PENGANTARAN LOKAL · LIYUE'
                  : `TUJUAN PENGANTARAN · ${order.deliveryPoint.region.toUpperCase()}`}
              </Text>
              <Text style={styles.receiptDestName}>{order.deliveryPoint.name}</Text>
              <Text style={styles.receiptDestLandmark}>
                {order.deliveryPoint.landmark}
              </Text>
            </View>
          </View>

          <DiamondDivider />

          <View style={styles.receiptItems}>
            {order.items.map((item) => (
              <View key={item.dish.id} style={styles.receiptRow}>
                <Text style={styles.receiptItemName} numberOfLines={1}>
                  {item.dish.name} ×{item.quantity}
                </Text>
                <Text style={styles.receiptItemPrice}>
                  {formatMora(item.dish.priceMora * item.quantity)} Mora
                </Text>
              </View>
            ))}

            <View style={[styles.receiptRow, { paddingTop: 4 }]}>
              <Text style={styles.receiptFeeLabel}>
                {isLocalLiyue ? 'Ongkir Lokal Liyue' : 'Ongkir Kurir Glider'}
              </Text>
              <Text
                style={[
                  styles.receiptFeeVal,
                  order.deliveryFeeMora === 0 && { color: COLORS.successGreen },
                ]}
              >
                {order.deliveryFeeMora === 0
                  ? 'Gratis (0 Mora)'
                  : `${formatMora(order.deliveryFeeMora)} Mora`}
              </Text>
            </View>

            {order.discountMora > 0 && (
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptFeeLabel, { color: COLORS.successGreen }]}>
                  Potongan Voucher{order.couponCode ? ` (${order.couponCode})` : ''}
                </Text>
                <Text style={[styles.receiptFeeVal, { color: COLORS.successGreen }]}>
                  -{formatMora(order.discountMora)} Mora
                </Text>
              </View>
            )}
          </View>

          {order.kitchenNotes ? (
            <View style={styles.notesReceiptBox}>
              <Text style={styles.notesReceiptText}>
                <Text style={{ fontFamily: FONTS.genshin, color: COLORS.inkBody }}>
                  Catatan Chef Xiangling:{' '}
                </Text>
                {order.kitchenNotes}
              </Text>
            </View>
          ) : null}

          <View style={styles.receiptFooter}>
            <View style={styles.paymentBadgeRow}>
              <TeyvatImage
                source={
                  order.paymentMethod === 'NORTHLAND_BANK_CARD'
                    ? ASSET_ICONS.genesisCrystal
                    : ASSET_ICONS.mora
                }
                style={styles.paymentBadgeIcon}
                contentFit="contain"
              />
              <Text style={styles.paymentBadgeText}>
                {order.paymentMethod === 'NORTHLAND_BANK_CARD'
                  ? 'Lunas · Northland Bank'
                  : 'Tunai saat Terima'}
              </Text>
            </View>
            <MoraAmount
              amount={order.totalMora}
              size="sm"
              showSuffix
              color={COLORS.inkBody}
            />
          </View>
        </ParchmentCard>

        {stage >= 2 && !showQuestModal && (
          <GoldCapsuleButton onPress={() => setShowQuestModal(true)}>
            Buka Ringkasan Quest Complete
          </GoldCapsuleButton>
        )}
      </ScrollView>

      {/* LEGENDARY GOLDEN-FRAMED PARCHMENT MODAL: QUEST COMPLETE + +60 PRIMOGEM REWARD */}
      <Modal
        visible={showQuestModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuestModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <LinearGradient colors={CHROME_BAR_GRADIENT} style={styles.modalTopBanner}>
              <Image
                source={ASSET_ICONS.resultCardBg}
                style={styles.resultBg}
                contentFit="cover"
              />
              <View style={styles.modalCrestRow}>
                <DiamondStar size={12} />
                <TeyvatImage
                  source={ASSET_ICONS.modalOrnament}
                  fallbackSource={ASSET_ICONS.crownOfInsight}
                  style={styles.modalOrnamentLg}
                  contentFit="contain"
                />
                <DiamondStar size={12} />
              </View>
              <Text style={styles.modalEyebrow}>
                {isLocalLiyue ? 'PENGANTARAN LOKAL SELESAI' : 'MISI KULINER SELESAI'}
              </Text>
              <Text style={styles.modalHeadline}>
                QUEST COMPLETE: Feast Delivered!
              </Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              {/* Commission Primogem Reward Banner */}
              <View style={styles.rewardBadgeCard}>
                <TeyvatImage
                  source={ASSET_ICONS.primogem}
                  fallbackSource={ASSET_ICONS.primogemCdn}
                  style={styles.rewardPrimoIcon}
                  contentFit="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardLabel}>HADIAH COMMISSION GUILD</Text>
                  <Text style={styles.rewardVal}>
                    +{PRIMOGEM_RULES.ORDER_COMMISSION_REWARD} Primogem ditambahkan ke Dompet
                  </Text>
                </View>
              </View>

              <View style={styles.modalSummaryCard}>
                <View style={styles.modalSummaryRow}>
                  <Text style={styles.modalSummaryLabel}>Nomor Pesanan</Text>
                  <Text style={styles.modalSummaryVal}>{order.id}</Text>
                </View>
                <View style={styles.modalSummaryRow}>
                  <Text style={styles.modalSummaryLabel}>Titik Antar</Text>
                  <Text style={styles.modalSummaryVal} numberOfLines={1}>
                    {order.deliveryPoint.name}
                  </Text>
                </View>
                <View style={styles.modalSummaryRow}>
                  <Text style={styles.modalSummaryLabel}>Estimasi Tiba</Text>
                  <Text style={[styles.modalSummaryVal, { color: COLORS.successGreen }]}>
                    {order.deliveryPoint.etaMinutes} menit (Tiba)
                  </Text>
                </View>
                {order.discountMora > 0 && (
                  <View style={styles.modalSummaryRow}>
                    <Text style={[styles.modalSummaryLabel, { color: COLORS.successGreen }]}>
                      Potongan Voucher
                    </Text>
                    <Text style={[styles.modalSummaryVal, { color: COLORS.successGreen }]}>
                      -{formatMora(order.discountMora)} Mora
                    </Text>
                  </View>
                )}
                <DiamondDivider style={{ marginVertical: 4 }} />
                <View style={styles.modalSummaryRow}>
                  <Text style={styles.modalTotalLabel}>Total Transaksi</Text>
                  <MoraAmount
                    amount={order.totalMora}
                    size="sm"
                    showSuffix
                    color={COLORS.inkBody}
                  />
                </View>
              </View>

              <GoldCapsuleButton
                onPress={() => {
                  setShowQuestModal(false);
                  router.replace('/(tabs)');
                }}
              >
                Kembali ke Beranda
              </GoldCapsuleButton>

              <Pressable
                onPress={() => {
                  setShowQuestModal(false);
                  router.replace('/(tabs)/profile');
                }}
                style={styles.modalSecondaryBtn}
              >
                <Text style={styles.modalSecondaryText}>Lihat di Riwayat Profil</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ParchmentScreen>
  );
}

const styles = StyleSheet.create({
  emptyScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 16,
    color: COLORS.inkBody,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderIdHeader: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: COLORS.navSubtext,
  },
  headerTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 16,
    color: COLORS.goldBright,
    marginTop: 1,
  },
  etaHud: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  etaHudText: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    color: COLORS.goldBright,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 18,
    gap: 14,
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  commissionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commissionTagText: {
    fontFamily: FONTS.genshin,
    fontSize: 9.5,
    color: COLORS.goldOchre,
    letterSpacing: 0.5,
  },
  statusHeadline: {
    fontFamily: FONTS.genshin,
    fontSize: 15,
    color: COLORS.inkBody,
    marginTop: 4,
    lineHeight: 20,
  },
  statusSubcopy: {
    fontSize: 11.5,
    color: COLORS.inkMuted,
    marginTop: 4,
    lineHeight: 17,
  },
  percentText: {
    fontFamily: FONTS.genshin,
    fontSize: 16,
    color: COLORS.goldOchre,
  },
  corridorBox: {
    borderRadius: 16,
    backgroundColor: COLORS.insetTrack,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 12,
  },
  trackRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  originNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  railWrap: {
    flex: 1,
    marginHorizontal: 8,
    height: 44,
    justifyContent: 'center',
    position: 'relative',
  },
  railBg: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DDD3BF',
    overflow: 'hidden',
  },
  railFill: {
    height: '100%',
    borderRadius: 3,
  },
  medallionWrap: {
    position: 'absolute',
    top: 2,
    zIndex: 20,
  },
  medallionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.chromeTop,
    borderWidth: 2,
    borderColor: COLORS.goldBright,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D9B362',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 5,
  },
  medallionDone: {
    backgroundColor: COLORS.goldBright,
    borderColor: COLORS.goldOchre,
  },
  destNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  destNodeDone: {
    backgroundColor: COLORS.chromeTop,
    borderColor: COLORS.goldBorder,
  },
  corridorLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  corridorTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: COLORS.inkBody,
  },
  corridorEta: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: COLORS.goldOchre,
  },
  corridorSub: {
    fontSize: 10,
    color: COLORS.inkSubtle,
    marginTop: 1,
  },
  milestoneStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  milestoneText: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
  },
  milestoneLine: {
    height: 1,
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#DED4C0',
  },
  receiptDestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  receiptEyebrow: {
    fontFamily: FONTS.genshin,
    fontSize: 9.5,
    color: COLORS.goldDeep,
    letterSpacing: 0.4,
  },
  receiptDestName: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: COLORS.inkBody,
    marginTop: 2,
  },
  receiptDestLandmark: {
    fontSize: 11,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  receiptItems: {
    gap: 6,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  receiptItemName: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: '#35394A',
    flex: 1,
  },
  receiptItemPrice: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: '#35394A',
  },
  receiptFeeLabel: {
    fontSize: 11.5,
    color: COLORS.inkMuted,
  },
  receiptFeeVal: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: '#35394A',
  },
  notesReceiptBox: {
    borderRadius: 12,
    backgroundColor: COLORS.insetTrack,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  notesReceiptText: {
    fontSize: 11,
    color: '#4C5166',
    lineHeight: 16,
  },
  receiptFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2D8C5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  paymentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentBadgeIcon: {
    width: 16,
    height: 16,
  },
  paymentBadgeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.inkMuted,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 34, 52, 0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: COLORS.ivoryTop,
  },
  modalTopBanner: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
    position: 'relative',
  },
  resultBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.2,
  },
  modalCrestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalOrnamentLg: {
    width: 44,
    height: 44,
  },
  modalEyebrow: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: COLORS.goldBright,
    letterSpacing: 1.6,
  },
  modalHeadline: {
    fontFamily: FONTS.genshin,
    fontSize: 18.5,
    color: COLORS.inkCream,
    textAlign: 'center',
    marginTop: 4,
  },
  modalBody: {
    padding: 18,
    gap: 12,
  },
  rewardBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#242B3E',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  rewardPrimoIcon: {
    width: 26,
    height: 26,
  },
  rewardLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 9,
    color: COLORS.goldBright,
    letterSpacing: 0.8,
  },
  rewardVal: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.inkCream,
    marginTop: 2,
  },
  modalSummaryCard: {
    borderRadius: 16,
    backgroundColor: COLORS.insetTrack,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 14,
    gap: 8,
  },
  modalSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalSummaryLabel: {
    fontSize: 11,
    color: '#565B6F',
  },
  modalSummaryVal: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.inkBody,
    flexShrink: 1,
    textAlign: 'right',
  },
  modalTotalLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkBody,
  },
  modalSecondaryBtn: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkSecondary,
  },
});
