import React, { useState } from 'react';
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
import { router } from 'expo-router';
import {
  Check,
  Image as ImageIcon,
  Info,
  Mail,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  X,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DiamondBullet,
  DiamondDivider,
  GoldCapsuleButton,
  MoraAmount,
  RadialGlowBackdrop,
  TeyvatImage,
} from '../../components/TeyvatUI';
import {
  ASSET_ICONS,
  COUPONS,
  DISHES,
  NAMECARDS,
  RARITY_META,
  formatMora,
} from '../../data/dishes';
import { getRemainingVoucherUses, isLocalLiyueDelivery } from '../../lib/delicaciesRules';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import {
  CHROME_BAR_GRADIENT,
  COLORS,
  FONTS,
  GOLD_BUTTON_GRADIENT,
  PARCHMENT_BG_GRADIENT,
} from '../../theme/tokens';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const profile = useDelicaciesStore((s) => s.profile);
  const selectedNamecardId = useDelicaciesStore((s) => s.selectedNamecardId);
  const setSelectedNamecard = useDelicaciesStore((s) => s.setSelectedNamecard);
  const orders = useDelicaciesStore((s) => s.orders);
  const favoriteIds = useDelicaciesStore((s) => s.favoriteIds);
  const voucherUsageCount = useDelicaciesStore((s) => s.voucherUsageCount);
  const topUpMora = useDelicaciesStore((s) => s.topUpMora);
  const reorderFromHistory = useDelicaciesStore((s) => s.reorderFromHistory);
  const resetSimulationData = useDelicaciesStore((s) => s.resetSimulationData);

  const [isNamecardModalOpen, setIsNamecardModalOpen] = useState(false);

  const activeNamecard =
    NAMECARDS.find((n) => n.id === selectedNamecardId) ?? NAMECARDS[0];
  const favoriteDishes = DISHES.filter((d) => favoriteIds.includes(d.id));

  const handleReorder = (orderId: string) => {
    const ok = reorderFromHistory(orderId);
    if (ok) {
      router.navigate('/(tabs)/cart');
    }
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
            <Text style={styles.headerTitle}>Lisensi Petualang</Text>
            <Text style={styles.headerSubtitle}>
              Adventurers&apos; Guild · Koleksi Namecard &amp; riwayat jamuan
            </Text>
          </View>

          <Pressable
            onPress={() => setIsNamecardModalOpen(true)}
            style={styles.namecardBtnOuter}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={GOLD_BUTTON_GRADIENT}
              style={styles.namecardBtnInner}
            >
              <ImageIcon size={14} color="#2E3446" />
              <Text style={styles.namecardBtnText}>Ganti Namecard</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Authentic In-Game Adventurer Namecard Showcase (Unobstructed Artwork) */}
        <View style={styles.namecardCard}>
          <View style={styles.namecardBanner}>
            <Image
              source={activeNamecard.bgImage}
              style={styles.namecardBgImg}
              contentFit="cover"
            />
            <LinearGradient
              colors={[
                'rgba(26, 33, 51, 0.84)',
                'rgba(26, 33, 51, 0.34)',
                'rgba(26, 33, 51, 0)',
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.namecardContent}>
              <View style={styles.profileAvatarRing}>
                <TeyvatImage
                  source={profile.avatarUrl}
                  fallbackSource={profile.fallbackAvatarUrl}
                  style={styles.profileAvatarImg}
                  contentFit="cover"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {profile.username}
                </Text>
                <View style={styles.reputationRow}>
                  <TeyvatImage
                    source={ASSET_ICONS.crownOfInsight}
                    style={styles.crownIcon}
                    contentFit="contain"
                  />
                  <Text style={styles.reputationText} numberOfLines={1}>
                    {profile.reputationTitle}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Warm Ivory Adventurer Stat Strip (Full HYWenHei Typography) */}
          <View style={styles.statStrip}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>UID</Text>
              <Text style={styles.statValSmall} numberOfLines={1}>
                {profile.uid}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>AR</Text>
              <Text style={[styles.statVal, { color: COLORS.goldDeep }]}>
                {profile.adventureRank}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>WL</Text>
              <Text style={[styles.statVal, { color: COLORS.goldDeep }]}>
                {profile.worldLevel}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>PESANAN</Text>
              <Text style={[styles.statVal, { color: COLORS.successGreen }]}>
                {orders.length}
              </Text>
            </View>
          </View>

          {/* Traveler Email & Short Bio Strip */}
          <View style={styles.identityMetaBox}>
            <View style={styles.emailRow}>
              <Mail size={13} color={COLORS.goldDeep} />
              <Text style={styles.emailText} numberOfLines={1}>
                {profile.email}
              </Text>
            </View>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        </View>

        {/* Teyvat Wallet & Synced Voucher Quotas */}
        <View style={styles.ivoryCard}>
          <View style={styles.walletHeader}>
            <Text style={styles.sectionCardTitle}>Dompet Teyvat</Text>
            <Pressable
              onPress={() => topUpMora(50000)}
              style={styles.claimBtn}
              accessibilityRole="button"
            >
              <TeyvatImage
                source={ASSET_ICONS.masterlessStarglitter}
                fallbackSource={ASSET_ICONS.mora}
                style={styles.claimIcon}
                contentFit="contain"
              />
              <Text style={styles.claimBtnText}>Klaim 50k Mora</Text>
            </Pressable>
          </View>

          <View style={styles.walletGrid}>
            <View style={styles.walletTile}>
              <Text style={styles.walletTileLabel}>Saldo Mora</Text>
              <View style={{ marginTop: 4 }}>
                <MoraAmount
                  amount={profile.moraBalance}
                  size="md"
                  color={COLORS.inkPrimary}
                />
              </View>
            </View>
            <View style={styles.walletTile}>
              <Text style={styles.walletTileLabel}>Simpanan Primogem</Text>
              <View style={styles.primoRow}>
                <TeyvatImage
                  source={ASSET_ICONS.primogem}
                  fallbackSource={ASSET_ICONS.primogemCdn}
                  style={styles.primoIcon}
                  contentFit="contain"
                />
                <Text style={styles.primoVal}>
                  {formatMora(profile.primogemBalance)}
                </Text>
              </View>
            </View>
          </View>

          <DiamondDivider style={{ marginVertical: 12 }} />

          <Text style={styles.voucherSectionLabel}>
            Koleksi Voucher Pengantaran ({COUPONS.length})
          </Text>
          <View style={styles.voucherList}>
            {COUPONS.map((coupon) => {
              const remaining = getRemainingVoucherUses(coupon, voucherUsageCount);
              const exhausted = remaining <= 0;
              return (
                <View
                  key={coupon.code}
                  style={[styles.voucherRowCard, exhausted && { opacity: 0.68 }]}
                >
                  <TeyvatImage
                    source={coupon.icon}
                    style={styles.voucherRowIcon}
                    contentFit="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.voucherRowTop}>
                      <Text style={styles.voucherRowTitle} numberOfLines={1}>
                        {coupon.title}
                      </Text>
                      <Text
                        style={[
                          styles.voucherRowQuota,
                          { color: exhausted ? COLORS.dangerRed : COLORS.successGreen },
                        ]}
                      >
                        {exhausted
                          ? 'Habis Terpakai'
                          : `Sisa ${remaining}/${coupon.maxUses}`}
                      </Text>
                    </View>
                    <Text style={styles.voucherRowMeta} numberOfLines={1}>
                      Kode:{' '}
                      <Text style={styles.voucherRowCode}>{coupon.code}</Text> · Min.{' '}
                      <Text style={styles.voucherRowMinVal}>
                        {formatMora(coupon.minSubtotalMora)}
                      </Text>{' '}
                      Mora
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Saved Favorites */}
        {favoriteDishes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Hidangan Favorit ({favoriteDishes.length})
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favStrip}
            >
              {favoriteDishes.map((dish) => {
                const rarityStyle = RARITY_META[dish.rarity];
                return (
                  <Pressable
                    key={dish.id}
                    onPress={() =>
                      router.push({
                        pathname: '/dish/[id]',
                        params: { id: String(dish.id) },
                      })
                    }
                    style={styles.favCard}
                  >
                    <LinearGradient
                      colors={rarityStyle.gradientColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.favBanner}
                    >
                      <Image
                        source={rarityStyle.bgAsset}
                        style={styles.favWatermark}
                        contentFit="cover"
                      />
                      <RadialGlowBackdrop size={50} opacity={0.42} />
                      <TeyvatImage
                        source={dish.image}
                        fallbackSource={dish.fallbackImage}
                        style={styles.favImg}
                        contentFit="contain"
                      />
                    </LinearGradient>
                    <View style={styles.favBody}>
                      <Text style={styles.favName} numberOfLines={1}>
                        {dish.name}
                      </Text>
                      <Text style={styles.favPrice}>
                        {formatMora(dish.priceMora)} Mora
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Order History List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Pesanan Kuliner</Text>
          <View style={styles.historyList}>
            {orders.map((order) => {
              const localOrder = isLocalLiyueDelivery(order.deliveryPoint);
              return (
                <View key={order.id} style={styles.ivoryCard}>
                  <View style={styles.orderHeaderRow}>
                    <View style={styles.orderHeaderLeft}>
                      <TeyvatImage
                        source={ASSET_ICONS.masterlessStardust}
                        fallbackSource={ASSET_ICONS.mora}
                        style={styles.orderBadgeIcon}
                        contentFit="contain"
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.orderId}>{order.id}</Text>
                        <Text style={styles.orderMeta}>
                          {order.createdAt} ·{' '}
                          {localOrder ? 'Lokal Liyue' : order.deliveryPoint.region}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderStatusBadge}>
                      <DiamondBullet size={6} color={COLORS.successGreen} />
                      <Text style={styles.orderStatusText}>
                        {order.status === 'COMPLETED' ? 'Terkirim' : 'Diantar'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderItems}>
                    {order.items.map((item) => (
                      <View key={item.dish.id} style={styles.orderItemRow}>
                        <Text style={styles.orderItemName} numberOfLines={1}>
                          {item.dish.name} ×{item.quantity}
                        </Text>
                        <Text style={styles.orderItemPrice}>
                          {formatMora(item.dish.priceMora * item.quantity)} Mora
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.orderFooter}>
                    <MoraAmount
                      amount={order.totalMora}
                      size="sm"
                      showSuffix
                      color={COLORS.inkPrimary}
                    />
                    <Pressable
                      onPress={() => handleReorder(order.id)}
                      style={styles.reorderBtnOuter}
                    >
                      <LinearGradient
                        colors={GOLD_BUTTON_GRADIENT}
                        style={styles.reorderBtnInner}
                      >
                        <RotateCw size={13} color="#2E3446" />
                        <Text style={styles.reorderBtnText}>Pesan Lagi</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Informasi Aplikasi & Pengaturan Sederhana */}
        <View style={styles.ivoryCard}>
          <View style={styles.appInfoHeader}>
            <Info size={16} color={COLORS.goldDeep} />
            <Text style={styles.sectionCardTitle}>Informasi Aplikasi &amp; Pengaturan</Text>
          </View>

          <View style={styles.appInfoList}>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Nama Aplikasi</Text>
              <Text style={styles.appInfoValue}>Teyvat Delicacies v1.0.0</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Kerangka Mobile</Text>
              <Text style={styles.appInfoValue}>React Native · Expo Router SDK 58</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Penyimpanan Lokal</Text>
              <View style={styles.storageBadge}>
                <ShieldCheck size={13} color={COLORS.successGreen} />
                <Text style={styles.storageText}>AsyncStorage Aktif</Text>
              </View>
            </View>
          </View>

          <DiamondDivider style={{ marginVertical: 12 }} />

          <Pressable
            onPress={resetSimulationData}
            style={styles.resetSimBtn}
            accessibilityRole="button"
          >
            <RotateCcw size={14} color={COLORS.goldDeep} />
            <Text style={styles.resetSimText}>Reset Data Simulasi Teyvat</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* WARM PARCHMENT COLLECTIBLE NAMECARD MODAL */}
      <Modal
        visible={isNamecardModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNamecardModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            {/* Modal Header with Official Ornament */}
            <LinearGradient colors={CHROME_BAR_GRADIENT} style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <TeyvatImage
                  source={ASSET_ICONS.modalOrnament}
                  fallbackSource={ASSET_ICONS.crownOfInsight}
                  style={styles.modalOrnamentIcon}
                  contentFit="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle} numberOfLines={1}>
                    Koleksi Namecard Teyvat
                  </Text>
                  <Text style={styles.modalSub} numberOfLines={1}>
                    Ketuk gambar untuk memasang spanduk profil
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setIsNamecardModalOpen(false)}
                style={styles.modalCloseBtn}
                accessibilityLabel="Tutup pilihan Namecard"
              >
                <X size={16} color={COLORS.goldBright} />
              </Pressable>
            </LinearGradient>

            {/* Live Selected Banner Preview */}
            <View style={styles.previewWrap}>
              <View style={styles.previewBanner}>
                <Image
                  source={activeNamecard.bgImage}
                  style={styles.previewBannerImg}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={[
                    'rgba(28, 35, 54, 0.86)',
                    'rgba(28, 35, 54, 0.38)',
                    'rgba(28, 35, 54, 0)',
                  ]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.previewCopy}>
                  <Text style={styles.previewRegion}>
                    DIPASANG · {activeNamecard.region.toUpperCase()}
                  </Text>
                  <Text style={styles.previewName}>{activeNamecard.name}</Text>
                  <Text style={styles.previewSub} numberOfLines={1}>
                    {activeNamecard.subtitle}
                  </Text>
                </View>
              </View>
            </View>

            {/* 2-Column Pure Visual Namecard Artwork Grid (Zero text covering art) */}
            <ScrollView
              style={styles.modalGridScroll}
              contentContainerStyle={styles.modalGridContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.namecardGrid}>
                {NAMECARDS.map((card) => {
                  const isSelected = card.id === activeNamecard.id;
                  return (
                    <Pressable
                      key={card.id}
                      onPress={() => setSelectedNamecard(card.id)}
                      accessibilityLabel={card.name}
                      style={[
                        styles.namecardOption,
                        isSelected && styles.namecardOptionSelected,
                      ]}
                    >
                      <Image
                        source={card.bgImage}
                        style={styles.namecardOptionImg}
                        contentFit="cover"
                      />
                      {isSelected && (
                        <View style={styles.selectedCheckBadge}>
                          <Check size={13} color={COLORS.inkPrimary} strokeWidth={3} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <GoldCapsuleButton onPress={() => setIsNamecardModalOpen(false)}>
                Terapkan Namecard
              </GoldCapsuleButton>
            </View>
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
    fontSize: 11,
    color: COLORS.navSubtext,
    marginTop: 2,
  },
  namecardBtnOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
  },
  namecardBtnInner: {
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  namecardBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#2E3446',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  namecardCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.goldBorder,
    backgroundColor: COLORS.ivoryTop,
    shadowColor: '#4A3A1E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },
  namecardBanner: {
    height: 132,
    backgroundColor: '#242C42',
    position: 'relative',
    overflow: 'hidden',
  },
  namecardBgImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transform: [{ scale: 1.22 }],
  },
  namecardContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileAvatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.goldBright,
    backgroundColor: COLORS.chromeDeep,
  },
  profileAvatarImg: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontFamily: FONTS.genshin,
    fontSize: 19,
    color: COLORS.inkCream,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  reputationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  crownIcon: {
    width: 16,
    height: 16,
  },
  reputationText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#F7F1E3',
    flexShrink: 1,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statStrip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.ivoryTop,
    borderTopWidth: 1,
    borderTopColor: COLORS.goldTrim,
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.insetWarm,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    paddingHorizontal: 6,
    paddingVertical: 7,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 9,
    color: COLORS.goldMuted,
    letterSpacing: 0.4,
  },
  statValSmall: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: COLORS.inkPrimary,
    marginTop: 2,
  },
  statVal: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    marginTop: 2,
  },
  identityMetaBox: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 2,
    backgroundColor: COLORS.ivoryTop,
    gap: 4,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emailText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.goldDeep,
    flexShrink: 1,
  },
  bioText: {
    fontSize: 11,
    color: COLORS.inkMuted,
    lineHeight: 16,
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
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  sectionCardTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: COLORS.inkPrimary,
  },
  claimBtn: {
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  claimIcon: {
    width: 16,
    height: 16,
  },
  claimBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#3B4255',
  },
  walletGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  walletTile: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: '#D4C7AE',
    padding: 12,
  },
  walletTileLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: '#5B5F70',
  },
  primoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  primoIcon: {
    width: 20,
    height: 20,
  },
  primoVal: {
    fontFamily: FONTS.genshin,
    fontSize: 15,
    color: COLORS.inkPrimary,
  },
  voucherSectionLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.inkSecondary,
    marginBottom: 8,
  },
  voucherList: {
    gap: 8,
  },
  voucherRowCard: {
    borderRadius: 12,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: '#D4C7AE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voucherRowIcon: {
    width: 28,
    height: 28,
  },
  voucherRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  voucherRowTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkPrimary,
    flex: 1,
  },
  voucherRowQuota: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
  },
  voucherRowMeta: {
    fontSize: 10.5,
    color: '#5B5F70',
    marginTop: 2,
  },
  voucherRowCode: {
    fontFamily: FONTS.genshin,
    color: COLORS.goldDeep,
  },
  voucherRowMinVal: {
    fontFamily: FONTS.genshin,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 14.5,
    color: COLORS.inkPrimary,
  },
  favStrip: {
    gap: 10,
    paddingBottom: 4,
  },
  favCard: {
    width: 122,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
  },
  favBanner: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  favWatermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.32,
  },
  favImg: {
    width: 44,
    height: 44,
  },
  favBody: {
    padding: 8,
  },
  favName: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.inkPrimary,
  },
  favPrice: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: '#6B4A1B',
    marginTop: 2,
  },
  historyList: {
    gap: 10,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  orderBadgeIcon: {
    width: 24,
    height: 24,
    marginTop: 2,
  },
  orderId: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkPrimary,
  },
  orderMeta: {
    fontSize: 11,
    color: '#5C6072',
    marginTop: 2,
  },
  orderStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderStatusText: {
    fontFamily: FONTS.genshin,
    fontSize: 10.5,
    color: COLORS.successGreen,
  },
  orderItems: {
    gap: 4,
    marginBottom: 10,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  orderItemName: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#2B2D3A',
    flex: 1,
  },
  orderItemPrice: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#4A4F63',
  },
  orderFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#DED4C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  reorderBtnOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
  },
  reorderBtnInner: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reorderBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#2E3446',
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  appInfoList: {
    gap: 8,
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  appInfoLabel: {
    fontSize: 11.5,
    color: COLORS.inkMuted,
  },
  appInfoValue: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.inkPrimary,
  },
  storageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storageText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.successGreen,
  },
  resetSimBtn: {
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: COLORS.insetWarm,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  resetSimText: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.goldDeep,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 34, 52, 0.72)',
    justifyContent: 'center',
    padding: 16,
  },
  modalSheet: {
    maxHeight: '86%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: COLORS.parchmentMid,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  modalOrnamentIcon: {
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
  previewWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  previewBanner: {
    height: 82,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: '#242C42',
    justifyContent: 'center',
  },
  previewBannerImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transform: [{ scale: 1.22 }],
  },
  previewCopy: {
    paddingHorizontal: 14,
    zIndex: 10,
  },
  previewRegion: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: COLORS.goldBright,
    letterSpacing: 0.6,
  },
  previewName: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    color: COLORS.inkCream,
    marginTop: 2,
  },
  previewSub: {
    fontSize: 10.5,
    color: '#E6EBF5',
    marginTop: 1,
  },
  modalGridScroll: {
    maxHeight: 360,
  },
  modalGridContent: {
    padding: 16,
  },
  namecardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  namecardOption: {
    width: '48.2%',
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    backgroundColor: '#242C42',
    position: 'relative',
  },
  namecardOptionSelected: {
    borderWidth: 2,
    borderColor: COLORS.goldBright,
  },
  namecardOptionImg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transform: [{ scale: 1.24 }],
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.goldBright,
    borderWidth: 1,
    borderColor: COLORS.goldDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.ivoryBottom,
    borderTopWidth: 1,
    borderTopColor: '#E2D8C5',
  },
});
