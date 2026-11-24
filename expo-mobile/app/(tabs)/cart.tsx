import React, { useEffect, useState } from 'react';
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
import { Minus, Plus, Trash2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DiamondDivider,
  DiamondStarRow,
  GoldCapsuleButton,
  MoraAmount,
  RadialGlowBackdrop,
  TeyvatImage,
} from '../../components/TeyvatUI';
import { ASSET_ICONS, COUPONS, RARITY_META, formatMora } from '../../data/dishes';
import { getRemainingVoucherUses } from '../../lib/delicaciesRules';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import {
  CHROME_BAR_GRADIENT,
  COLORS,
  FONTS,
  GOLD_BUTTON_GRADIENT,
  PARCHMENT_BG_GRADIENT,
} from '../../theme/tokens';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const cart = useDelicaciesStore((s) => s.cart);
  const appliedCouponCode = useDelicaciesStore((s) => s.appliedCouponCode);
  const voucherUsageCount = useDelicaciesStore((s) => s.voucherUsageCount);
  const selectedDeliveryPointId = useDelicaciesStore((s) => s.selectedDeliveryPointId);
  const getSelectedDeliveryPoint = useDelicaciesStore((s) => s.getSelectedDeliveryPoint);
  const updateQuantity = useDelicaciesStore((s) => s.updateQuantity);
  const removeFromCart = useDelicaciesStore((s) => s.removeFromCart);
  const applyCoupon = useDelicaciesStore((s) => s.applyCoupon);
  const removeCoupon = useDelicaciesStore((s) => s.removeCoupon);
  const getCartTotals = useDelicaciesStore((s) => s.getCartTotals);

  const [couponInput, setCouponInput] = useState(appliedCouponCode ?? '');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!appliedCouponCode && couponFeedback?.type === 'success') {
      setCouponInput('');
      setCouponFeedback(null);
    }
  }, [appliedCouponCode, selectedDeliveryPointId]);

  const deliveryPoint = getSelectedDeliveryPoint();
  const totals = getCartTotals(deliveryPoint);

  const handleApplyCoupon = (codeToTry?: string) => {
    const target = codeToTry ?? couponInput;
    const res = applyCoupon(target);
    if (res.ok) {
      setCouponInput(target.trim().toUpperCase());
      setCouponFeedback({ type: 'success', text: res.message });
    } else {
      if (codeToTry) {
        setCouponInput(codeToTry);
      }
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  const getCouponValueBadge = (coupon: (typeof COUPONS)[number]) => {
    if (coupon.type === 'PERCENT') return `-${coupon.value}%`;
    if (coupon.type === 'FIXED_MORA') return `-${formatMora(coupon.value)}`;
    return 'Gratis Ongkir';
  };

  return (
    <LinearGradient colors={PARCHMENT_BG_GRADIENT} style={styles.screen}>
      {/* Clean Genshin Header */}
      <LinearGradient
        colors={CHROME_BAR_GRADIENT}
        style={[styles.header, { paddingTop: Math.max(insets.top + 10, 18) }]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Keranjang Petualang</Text>
            <Text style={styles.headerSubtitle}>
              {totals.itemCount > 0
                ? `${totals.itemCount} porsi siap menuju ${deliveryPoint.region}`
                : 'Belum ada hidangan dipilih'}
            </Text>
          </View>
          {totals.itemCount > 0 && (
            <MoraAmount
              amount={totals.finalTotal}
              size="sm"
              color={COLORS.goldBright}
            />
          )}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {cart.length === 0 ? (
          <View style={styles.emptyCard}>
            <TeyvatImage
              source={ASSET_ICONS.paimonHungry}
              style={styles.paimonImg}
              contentFit="contain"
              accessibilityLabel="Paimon sedang lapar"
            />
            <Text style={styles.emptyTitle}>Keranjang Masih Kosong</Text>
            <Text style={styles.emptyDesc}>
              Perut Paimon sudah keroncongan! Jelajahi katalog kuliner Teyvat dan pilih hidangan favoritmu.
            </Text>
            <View style={styles.emptyCtaWrap}>
              <GoldCapsuleButton onPress={() => router.navigate('/(tabs)/catalog')}>
                Jelajahi Katalog Kuliner
              </GoldCapsuleButton>
            </View>
          </View>
        ) : (
          <View style={styles.contentStack}>
            {/* Active Order List */}
            <View style={styles.cartList}>
              {cart.map(({ dish, quantity }) => {
                const rarityStyle = RARITY_META[dish.rarity];
                return (
                  <View key={dish.id} style={styles.cartItemCard}>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/dish/[id]',
                          params: { id: String(dish.id) },
                        })
                      }
                      style={styles.thumbOuter}
                      accessibilityLabel={`Lihat ${dish.name}`}
                    >
                      <LinearGradient
                        colors={rarityStyle.gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.thumbGradient}
                      >
                        <Image
                          source={rarityStyle.bgAsset}
                          style={styles.thumbWatermark}
                          contentFit="cover"
                        />
                        <RadialGlowBackdrop size={56} opacity={0.42} />
                        <TeyvatImage
                          source={dish.image}
                          fallbackSource={dish.fallbackImage}
                          style={styles.thumbImg}
                          contentFit="contain"
                        />
                      </LinearGradient>
                    </Pressable>

                    <View style={styles.cartItemBody}>
                      <View style={styles.cartItemTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cartItemName} numberOfLines={1}>
                            {dish.name}
                          </Text>
                          <View style={{ marginTop: 3 }}>
                            <DiamondStarRow rarity={dish.rarity} size={9} />
                          </View>
                        </View>
                        <Pressable
                          onPress={() => removeFromCart(dish.id)}
                          style={styles.trashBtn}
                          accessibilityLabel={`Hapus ${dish.name} dari keranjang`}
                        >
                          <Trash2 size={16} color="#7A6F85" />
                        </Pressable>
                      </View>

                      <View style={styles.cartItemBottom}>
                        <MoraAmount
                          amount={dish.priceMora * quantity}
                          size="sm"
                          color={COLORS.inkPrimary}
                        />

                        <View style={styles.stepperPill}>
                          <Pressable
                            onPress={() => updateQuantity(dish.id, quantity - 1)}
                            style={styles.stepperBtn}
                            accessibilityLabel={`Kurangi porsi ${dish.name}`}
                          >
                            <Minus size={14} color="#3B4255" />
                          </Pressable>
                          <Text style={styles.stepperQty}>{quantity}</Text>
                          <Pressable
                            onPress={() => updateQuantity(dish.id, quantity + 1)}
                            style={styles.stepperBtn}
                            accessibilityLabel={`Tambah porsi ${dish.name}`}
                          >
                            <Plus size={14} color="#3B4255" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Strict Voucher Redemption Section */}
            <View style={styles.ivoryCard}>
              <View style={styles.voucherHeader}>
                <TeyvatImage
                  source={ASSET_ICONS.intertwinedFate}
                  fallbackSource={ASSET_ICONS.intertwinedFateCdn}
                  style={styles.voucherIcon}
                  contentFit="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardHeading}>Tebus Voucher Teyvat</Text>
                  <Text style={styles.voucherSub}>
                    Validasi otomatis syarat minimal belanja &amp; sisa kuota pakai
                  </Text>
                </View>
              </View>

              <View style={styles.voucherInputRow}>
                <TextInput
                  value={couponInput}
                  onChangeText={(txt) => {
                    setCouponInput(txt.toUpperCase());
                    setCouponFeedback(null);
                  }}
                  onSubmitEditing={() => {
                    if (!appliedCouponCode) handleApplyCoupon();
                  }}
                  placeholder="Contoh: PAIMONKENYANG"
                  placeholderTextColor="#7F7666"
                  autoCapitalize="characters"
                  style={styles.voucherInput}
                />

                {appliedCouponCode ? (
                  <Pressable
                    onPress={() => {
                      removeCoupon();
                      setCouponInput('');
                      setCouponFeedback(null);
                    }}
                    style={styles.detachBtn}
                  >
                    <X size={14} color={COLORS.ivoryTop} />
                    <Text style={styles.detachBtnText}>Lepas</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => handleApplyCoupon()}
                    style={styles.applyBtnOuter}
                  >
                    <LinearGradient
                      colors={GOLD_BUTTON_GRADIENT}
                      style={styles.applyBtnInner}
                    >
                      <Text style={styles.applyBtnText}>Terapkan</Text>
                    </LinearGradient>
                  </Pressable>
                )}
              </View>

              {couponFeedback && (
                <Text
                  style={[
                    styles.feedbackText,
                    couponFeedback.type === 'success'
                      ? { color: COLORS.successGreen }
                      : { color: COLORS.dangerRed },
                  ]}
                >
                  {couponFeedback.text}
                </Text>
              )}

              {/* Quick Voucher Cards with Live Remaining Quota */}
              <View style={styles.quickVoucherList}>
                {COUPONS.map((c) => {
                  const isApplied = appliedCouponCode === c.code;
                  const remaining = getRemainingVoucherUses(c, voucherUsageCount);
                  const isExhausted = remaining <= 0;
                  return (
                    <Pressable
                      key={c.code}
                      onPress={() => handleApplyCoupon(c.code)}
                      style={[
                        styles.quickVoucherCard,
                        isApplied
                          ? styles.quickVoucherActive
                          : isExhausted
                          ? styles.quickVoucherExhausted
                          : null,
                      ]}
                    >
                      <TeyvatImage
                        source={c.icon}
                        style={styles.quickVoucherIcon}
                        contentFit="contain"
                      />
                      <View style={{ flex: 1 }}>
                        <View style={styles.quickVoucherTop}>
                          <Text
                            style={[
                              styles.quickVoucherCode,
                              isApplied && { color: COLORS.goldBright },
                            ]}
                            numberOfLines={1}
                          >
                            {c.code}
                          </Text>
                          <Text
                            style={[
                              styles.quickVoucherValue,
                              isApplied
                                ? { color: COLORS.goldBright }
                                : isExhausted
                                ? { color: COLORS.dangerRed }
                                : { color: COLORS.goldDeep },
                            ]}
                          >
                            {getCouponValueBadge(c)}
                          </Text>
                        </View>
                        <View style={styles.quickVoucherBottom}>
                          <Text
                            style={[
                              styles.quickVoucherMin,
                              isApplied && { color: '#D6DCEB' },
                            ]}
                            numberOfLines={1}
                          >
                            Min. {formatMora(c.minSubtotalMora)} Mora
                          </Text>
                          <Text
                            style={[
                              styles.quickVoucherQuota,
                              isApplied && { color: '#D6DCEB' },
                            ]}
                          >
                            {isExhausted ? 'Habis' : `Sisa ${remaining}×`}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Billing Summary Card */}
            <View style={styles.ivoryCard}>
              <Text style={styles.billingTitle}>Rincian Tagihan Mora</Text>

              <View style={styles.billingRows}>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>
                    Subtotal Hidangan ({totals.itemCount} porsi)
                  </Text>
                  <Text style={styles.billingVal}>
                    {formatMora(totals.subtotal)} Mora
                  </Text>
                </View>

                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>
                    {totals.isLocalLiyue
                      ? 'Kurir Lokal (Liyue)'
                      : `Kurir Glider (${deliveryPoint.region})`}
                  </Text>
                  <Text
                    style={[
                      styles.billingVal,
                      totals.deliveryFee === 0 && { color: COLORS.successGreen },
                    ]}
                  >
                    {totals.deliveryFee === 0
                      ? totals.isLocalLiyue
                        ? 'Gratis · Lokal'
                        : 'Gratis (Voucher)'
                      : `${formatMora(totals.deliveryFee)} Mora`}
                  </Text>
                </View>

                {totals.discount > 0 && (
                  <View style={styles.billingRow}>
                    <Text style={[styles.billingLabel, { color: COLORS.successGreen }]}>
                      Potongan Voucher ({appliedCouponCode})
                    </Text>
                    <Text style={[styles.billingVal, { color: COLORS.successGreen }]}>
                      -{formatMora(totals.discount)} Mora
                    </Text>
                  </View>
                )}
              </View>

              <DiamondDivider style={{ marginVertical: 10 }} />

              <View style={styles.billingRow}>
                <Text style={styles.billingTotalLabel}>Total Akhir</Text>
                <MoraAmount
                  amount={totals.finalTotal}
                  size="md"
                  showSuffix
                  color={COLORS.inkPrimary}
                />
              </View>
            </View>

            <View style={{ paddingTop: 4 }}>
              <GoldCapsuleButton onPress={() => router.push('/checkout')}>
                Lanjut Pengantaran Teyvat
              </GoldCapsuleButton>
            </View>
          </View>
        )}
      </ScrollView>
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 17,
    color: COLORS.goldBright,
  },
  headerSubtitle: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: COLORS.navSubtext,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyCard: {
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  paimonImg: {
    width: 124,
    height: 124,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 16,
    color: COLORS.inkPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#565A6D',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    maxWidth: 260,
  },
  emptyCtaWrap: {
    width: '100%',
    marginTop: 20,
  },
  contentStack: {
    gap: 14,
  },
  cartList: {
    gap: 10,
  },
  cartItemCard: {
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#443824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbOuter: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,231,165,0.75)',
  },
  thumbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbWatermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.32,
  },
  thumbImg: {
    width: 48,
    height: 48,
  },
  cartItemBody: {
    flex: 1,
  },
  cartItemTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cartItemName: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    color: COLORS.inkPrimary,
  },
  trashBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
    marginRight: -4,
  },
  cartItemBottom: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: '#CBB997',
    borderRadius: 999,
    padding: 2,
    gap: 4,
  },
  stepperBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQty: {
    fontFamily: FONTS.genshin,
    minWidth: 22,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.inkPrimary,
  },
  ivoryCard: {
    borderRadius: 16,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
    padding: 14,
    shadowColor: '#443824',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  voucherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  voucherIcon: {
    width: 24,
    height: 24,
  },
  cardHeading: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    color: COLORS.inkPrimary,
  },
  voucherSub: {
    fontSize: 11,
    color: '#5B5F70',
    marginTop: 1,
  },
  voucherInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voucherInput: {
    flex: 1,
    minWidth: 0,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: '#CBB997',
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkBody,
  },
  applyBtnOuter: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
  },
  applyBtnInner: {
    height: 42,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: '#2E3446',
  },
  detachBtn: {
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#242B3E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detachBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.ivoryTop,
  },
  feedbackText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    lineHeight: 16,
  },
  quickVoucherList: {
    marginTop: 12,
    gap: 6,
  },
  quickVoucherCard: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBB997',
    backgroundColor: COLORS.parchmentMid,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quickVoucherActive: {
    backgroundColor: '#242B3E',
    borderColor: COLORS.goldBorder,
  },
  quickVoucherExhausted: {
    opacity: 0.68,
    borderColor: '#D8CEBC',
  },
  quickVoucherIcon: {
    width: 24,
    height: 24,
  },
  quickVoucherTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickVoucherCode: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.inkPrimary,
    flexShrink: 1,
  },
  quickVoucherValue: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
  },
  quickVoucherBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    gap: 8,
  },
  quickVoucherMin: {
    fontSize: 10,
    color: '#5E6375',
  },
  quickVoucherQuota: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: '#5E6375',
  },
  billingTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: COLORS.inkPrimary,
    marginBottom: 10,
  },
  billingRows: {
    gap: 7,
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  billingLabel: {
    fontSize: 12,
    color: '#4A4F63',
    flexShrink: 1,
  },
  billingVal: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkPrimary,
  },
  billingTotalLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: COLORS.inkPrimary,
  },
});
