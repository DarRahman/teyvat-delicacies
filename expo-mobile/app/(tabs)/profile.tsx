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
import {
  Check,
  ChevronRight,
  Image as ImageIcon,
  Mail,
  RotateCcw,
  RotateCw,
  Settings,
  ShieldCheck,
} from 'lucide-react-native';
import {
  DiamondBullet,
  DiamondDivider,
  GoldCapsuleButton,
  MoraAmount,
  ParchmentCard,
  ParchmentIconBox,
  ParchmentScreen,
  RadialGlowBackdrop,
  TeyvatImage,
  TeyvatModalSheet,
} from '../../components/TeyvatUI';
import {
  ASSET_ICONS,
  AVATAR_OPTIONS,
  COUPONS,
  DISHES,
  NAMECARDS,
  PRIMOGEM_RULES,
  RARITY_META,
  formatMora,
} from '../../data/dishes';
import { getRemainingVoucherUses, isLocalLiyueDelivery } from '../../lib/delicaciesRules';
import { useDelicaciesStore } from '../../store/useDelicaciesStore';
import { COLORS, FONTS, GOLD_BUTTON_GRADIENT } from '../../theme/tokens';
import { TravelerAvatarId } from '../../types';

export default function ProfileScreen() {
  const profile = useDelicaciesStore((s) => s.profile);
  const selectedNamecardId = useDelicaciesStore((s) => s.selectedNamecardId);
  const setSelectedNamecard = useDelicaciesStore((s) => s.setSelectedNamecard);
  const orders = useDelicaciesStore((s) => s.orders);
  const favoriteIds = useDelicaciesStore((s) => s.favoriteIds);
  const voucherUsageCount = useDelicaciesStore((s) => s.voucherUsageCount);
  const exchangePrimogemsForMora = useDelicaciesStore((s) => s.exchangePrimogemsForMora);
  const exchangePrimogemsForVoucherRefill = useDelicaciesStore(
    (s) => s.exchangePrimogemsForVoucherRefill
  );
  const updateProfileSettings = useDelicaciesStore((s) => s.updateProfileSettings);
  const reorderFromHistory = useDelicaciesStore((s) => s.reorderFromHistory);
  const resetSimulationData = useDelicaciesStore((s) => s.resetSimulationData);

  const [isNamecardModalOpen, setIsNamecardModalOpen] = useState(false);
  const [isBargainsModalOpen, setIsBargainsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Settings form state
  const [draftName, setDraftName] = useState(profile.username);
  const [draftBio, setDraftBio] = useState(profile.bio);
  const [draftAvatarId, setDraftAvatarId] = useState<TravelerAvatarId>(profile.avatarId);

  useEffect(() => {
    if (isSettingsModalOpen) {
      setDraftName(profile.username);
      setDraftBio(profile.bio);
      setDraftAvatarId(profile.avatarId);
    }
  }, [isSettingsModalOpen, profile.username, profile.bio, profile.avatarId]);

  const activeNamecard =
    NAMECARDS.find((n) => n.id === selectedNamecardId) ?? NAMECARDS[0];
  const favoriteDishes = DISHES.filter((d) => favoriteIds.includes(d.id));
  const canAffordExchange = profile.primogemBalance >= PRIMOGEM_RULES.EXCHANGE_COST;

  const handleReorder = (orderId: string) => {
    const ok = reorderFromHistory(orderId);
    if (ok) {
      router.navigate('/(tabs)/cart');
    }
  };

  const handleSaveSettings = () => {
    updateProfileSettings({
      username: draftName,
      bio: draftBio,
      avatarId: draftAvatarId,
    });
    setIsSettingsModalOpen(false);
  };

  return (
    <ParchmentScreen
      header={
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Lisensi Petualang</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              Adventurers&apos; Guild · Koleksi Namecard &amp; riwayat
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => setIsNamecardModalOpen(true)}
              style={styles.namecardBtnOuter}
              accessibilityRole="button"
              accessibilityLabel="Ganti Namecard"
            >
              <LinearGradient
                colors={GOLD_BUTTON_GRADIENT}
                style={styles.namecardBtnInner}
              >
                <ImageIcon size={14} color="#2E3446" />
                <Text style={styles.namecardBtnText}>Namecard</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => setIsSettingsModalOpen(true)}
              style={styles.settingsIconBtn}
              accessibilityRole="button"
              accessibilityLabel="Pengaturan & Info Akun"
            >
              <Settings size={18} color={COLORS.goldBright} />
            </Pressable>
          </View>
        </View>
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clean In-Game Adventurer Namecard Showcase (Matches Web Layout, Full UID & WL 9) */}
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

          {/* Proportional 4-Box Stat Strip: Full 8-Digit UID NIM Never Truncates + WL 9 */}
          <View style={styles.statStrip}>
            <View style={[styles.statBox, styles.statBoxUid]}>
              <Text style={styles.statLabel}>UID</Text>
              <Text
                style={styles.statValUid}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.76}
              >
                {profile.uid}
              </Text>
            </View>
            <View style={[styles.statBox, styles.statBoxCompact]}>
              <Text style={styles.statLabel}>AR</Text>
              <Text style={[styles.statVal, { color: COLORS.goldDeep }]}>
                {profile.adventureRank}
              </Text>
            </View>
            <View style={[styles.statBox, styles.statBoxCompact]}>
              <Text style={styles.statLabel}>WL</Text>
              <Text style={[styles.statVal, { color: COLORS.goldDeep }]}>
                {profile.worldLevel}
              </Text>
            </View>
            <View style={[styles.statBox, styles.statBoxOrders]}>
              <Text style={styles.statLabel} numberOfLines={1}>
                PESANAN
              </Text>
              <Text style={[styles.statVal, { color: COLORS.successGreen }]}>
                {orders.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Teyvat Wallet, Functional Primogem Exchange (160) & Synced Voucher Quotas */}
        <ParchmentCard>
          <View style={styles.walletHeader}>
            <Text style={styles.sectionCardTitle}>Dompet Teyvat</Text>
            <Pressable
              onPress={() => setIsBargainsModalOpen(true)}
              style={({ pressed }) => [
                styles.exchangeBtn,
                pressed && { opacity: 0.85 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Tukar Primogem di Paimon's Bargains"
            >
              <TeyvatImage
                source={ASSET_ICONS.primogem}
                fallbackSource={ASSET_ICONS.primogemCdn}
                style={styles.exchangeIcon}
                contentFit="contain"
              />
              <Text style={styles.exchangeBtnText}>Tukar Primogem</Text>
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
        </ParchmentCard>

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

        {/* Interactive Order History List (Tap Card to Inspect Receipt) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riwayat Pesanan Kuliner</Text>
          <View style={styles.historyList}>
            {orders.map((order) => {
              const localOrder = isLocalLiyueDelivery(order.deliveryPoint);
              return (
                <ParchmentCard key={order.id}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/order/[id]',
                        params: { id: order.id },
                      })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Lihat struk ${order.id}`}
                    style={({ pressed }) => [pressed && { opacity: 0.85 }]}
                  >
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
                        <ChevronRight size={13} color={COLORS.goldMuted} />
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
                  </Pressable>

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
                </ParchmentCard>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 1. COLLECTIBLE NAMECARD PICKER MODAL */}
      <TeyvatModalSheet
        visible={isNamecardModalOpen}
        onClose={() => setIsNamecardModalOpen(false)}
        title="Koleksi Namecard Teyvat"
        subtitle="Ketuk gambar untuk memasang spanduk profil"
        footer={
          <GoldCapsuleButton onPress={() => setIsNamecardModalOpen(false)}>
            Terapkan Namecard
          </GoldCapsuleButton>
        }
      >
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
      </TeyvatModalSheet>

      {/* 2. PAIMON'S BARGAINS (PRIMOGEM 160 EXCHANGE MODAL) */}
      <TeyvatModalSheet
        visible={isBargainsModalOpen}
        onClose={() => setIsBargainsModalOpen(false)}
        title="Paimon's Bargains"
        subtitle={`Standar 1 Wish · ${PRIMOGEM_RULES.EXCHANGE_COST} Primogem per penukaran`}
        ornamentSource={ASSET_ICONS.primogem}
      >
        <ScrollView
          contentContainerStyle={styles.bargainsBody}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Balances Strip */}
          <View style={styles.bargainsBalanceRow}>
            <View style={styles.bargainsBalanceItem}>
              <TeyvatImage
                source={ASSET_ICONS.primogem}
                style={styles.bargainsMiniIcon}
                contentFit="contain"
              />
              <Text style={styles.bargainsBalanceText}>
                {formatMora(profile.primogemBalance)} Primogem
              </Text>
            </View>
            <MoraAmount
              amount={profile.moraBalance}
              size="xs"
              showSuffix
              color={COLORS.inkPrimary}
            />
          </View>

          {/* Exchange 1: 160 Primogem -> +50,000 Mora */}
          <ParchmentCard style={styles.bargainCard}>
            <View style={styles.bargainTop}>
              <ParchmentIconBox size={44}>
                <TeyvatImage
                  source={ASSET_ICONS.mora}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                />
              </ParchmentIconBox>
              <View style={{ flex: 1 }}>
                <Text style={styles.bargainTitle}>
                  Peti +{formatMora(PRIMOGEM_RULES.MORA_REWARD)} Mora
                </Text>
                <Text style={styles.bargainDesc}>
                  Tambah saldo Northland Bank secara instan untuk memesan hidangan legendaris.
                </Text>
              </View>
            </View>
            <GoldCapsuleButton
              disabled={!canAffordExchange}
              onPress={() => exchangePrimogemsForMora()}
              contentStyle={{ minHeight: 40 }}
            >
              <TeyvatImage
                source={ASSET_ICONS.primogem}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />
              <Text style={styles.bargainBtnText}>
                Tukar {PRIMOGEM_RULES.EXCHANGE_COST} Primogem
              </Text>
            </GoldCapsuleButton>
          </ParchmentCard>

          {/* Exchange 2: 160 Primogem -> Refill Voucher Quota (+1) */}
          <ParchmentCard style={styles.bargainCard}>
            <View style={styles.bargainTop}>
              <ParchmentIconBox size={44}>
                <TeyvatImage
                  source={ASSET_ICONS.intertwinedFate}
                  style={{ width: 28, height: 28 }}
                  contentFit="contain"
                />
              </ParchmentIconBox>
              <View style={{ flex: 1 }}>
                <Text style={styles.bargainTitle}>Isi Ulang Kuota Voucher (+1×)</Text>
                <Text style={styles.bargainDesc}>
                  Pulihkan 1× kuota pemakaian voucher yang sudah digunakan dengan {PRIMOGEM_RULES.EXCHANGE_COST} Primogem.
                </Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              {COUPONS.map((coupon) => {
                const remaining = getRemainingVoucherUses(coupon, voucherUsageCount);
                const isFull = remaining >= coupon.maxUses;
                return (
                  <View key={coupon.code} style={styles.refillRow}>
                    <TeyvatImage
                      source={coupon.icon}
                      style={{ width: 22, height: 22 }}
                      contentFit="contain"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.refillCode} numberOfLines={1}>
                        {coupon.code}
                      </Text>
                      <Text style={styles.refillQuota}>
                        Sisa {remaining}/{coupon.maxUses}
                      </Text>
                    </View>
                    <Pressable
                      disabled={isFull || !canAffordExchange}
                      onPress={() => exchangePrimogemsForVoucherRefill(coupon.code)}
                      style={[
                        styles.refillBtn,
                        (isFull || !canAffordExchange) && { opacity: 0.45 },
                      ]}
                    >
                      <Text style={styles.refillBtnText}>
                        {isFull ? 'Penuh' : `${PRIMOGEM_RULES.EXCHANGE_COST} Primo`}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ParchmentCard>

          <View style={styles.commissionHintBox}>
            <DiamondBullet size={6} color={COLORS.goldDeep} />
            <Text style={styles.commissionHintText}>
              Selesaikan setiap pesanan kuliner untuk menerima hadiah +{PRIMOGEM_RULES.ORDER_COMMISSION_REWARD} Primogem (Commission Reward).
            </Text>
          </View>
        </ScrollView>
      </TeyvatModalSheet>

      {/* 3. PENGATURAN & INFO AKUN MODAL (From Header Gear Icon) */}
      <TeyvatModalSheet
        visible={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Pengaturan & Info Akun"
        subtitle="Identitas Traveler, avatar & info aplikasi"
        footer={
          <GoldCapsuleButton onPress={handleSaveSettings}>
            Simpan Perubahan Profil
          </GoldCapsuleButton>
        }
      >
        <ScrollView
          contentContainerStyle={styles.settingsBody}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Account Info Card */}
          <ParchmentCard style={{ gap: 10 }}>
            <View style={styles.accountBadgeRow}>
              <Mail size={14} color={COLORS.goldDeep} />
              <Text style={styles.accountEmail}>{profile.email}</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>UID Petualang (NIM)</Text>
              <Text style={styles.appInfoValue}>{profile.uid}</Text>
            </View>

            <DiamondDivider style={{ marginVertical: 2 }} />

            {/* Avatar Selector (Aether / Lumine) */}
            <Text style={styles.fieldLabel}>Pilih Avatar Traveler</Text>
            <View style={styles.avatarChoiceRow}>
              {AVATAR_OPTIONS.map((opt) => {
                const active = draftAvatarId === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setDraftAvatarId(opt.id)}
                    style={[
                      styles.avatarChoiceCard,
                      active && styles.avatarChoiceCardActive,
                    ]}
                  >
                    <View style={styles.avatarChoiceRing}>
                      <TeyvatImage
                        source={opt.source}
                        style={styles.profileAvatarImg}
                        contentFit="cover"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.avatarChoiceName}>{opt.name}</Text>
                      <Text style={styles.avatarChoiceSub} numberOfLines={1}>
                        {opt.subtitle}
                      </Text>
                    </View>
                    {active && (
                      <View style={styles.avatarCheckDot}>
                        <Check size={11} color={COLORS.inkPrimary} strokeWidth={3} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Editable Name & Short Bio */}
            <View style={{ gap: 6 }}>
              <Text style={styles.fieldLabel}>Nama Traveler</Text>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Nama tampilan"
                placeholderTextColor="#7F7666"
                style={styles.textInput}
              />
            </View>

            <View style={{ gap: 6 }}>
              <Text style={styles.fieldLabel}>Bio Singkat</Text>
              <TextInput
                value={draftBio}
                onChangeText={setDraftBio}
                placeholder="Tulis informasi singkat petualang..."
                placeholderTextColor="#7F7666"
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                style={[styles.textInput, styles.bioInput]}
              />
            </View>
          </ParchmentCard>

          {/* Compact App Information & Reset */}
          <ParchmentCard style={{ gap: 8 }}>
            <Text style={styles.fieldLabel}>Informasi Aplikasi</Text>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Aplikasi</Text>
              <Text style={styles.appInfoValue}>Teyvat Delicacies v1.0.0</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Katalog Resmi</Text>
              <Text style={styles.appInfoValue}>{DISHES.length} Hidangan · 8 Wilayah</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={styles.appInfoLabel}>Penyimpanan</Text>
              <View style={styles.storageBadge}>
                <ShieldCheck size={13} color={COLORS.successGreen} />
                <Text style={styles.storageText}>AsyncStorage Aktif</Text>
              </View>
            </View>

            <DiamondDivider style={{ marginVertical: 4 }} />

            <Pressable
              onPress={() => {
                resetSimulationData();
                setIsSettingsModalOpen(false);
              }}
              style={styles.resetSimBtn}
              accessibilityRole="button"
            >
              <RotateCcw size={14} color={COLORS.goldDeep} />
              <Text style={styles.resetSimText}>Reset Data Simulasi Teyvat</Text>
            </Pressable>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  namecardBtnOuter: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldTrim,
  },
  namecardBtnInner: {
    minHeight: 34,
    paddingHorizontal: 11,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  namecardBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: '#2E3446',
  },
  settingsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,231,165,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
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
    height: 130,
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
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: COLORS.ivoryTop,
    borderTopWidth: 1,
    borderTopColor: COLORS.goldTrim,
    flexDirection: 'row',
    gap: 6,
  },
  statBox: {
    borderRadius: 11,
    backgroundColor: COLORS.insetWarm,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
    paddingHorizontal: 5,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxUid: {
    flex: 1.55,
  },
  statBoxCompact: {
    flex: 0.85,
  },
  statBoxOrders: {
    flex: 1.15,
  },
  statLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 8.5,
    color: COLORS.goldMuted,
    letterSpacing: 0.3,
  },
  statValUid: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.inkPrimary,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  statVal: {
    fontFamily: FONTS.genshin,
    fontSize: 14,
    marginTop: 2,
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
  exchangeBtn: {
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
  exchangeIcon: {
    width: 16,
    height: 16,
  },
  exchangeBtnText: {
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
  bargainsBody: {
    padding: 16,
    gap: 12,
  },
  bargainsBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  bargainsBalanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bargainsMiniIcon: {
    width: 18,
    height: 18,
  },
  bargainsBalanceText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: COLORS.inkPrimary,
  },
  bargainCard: {
    gap: 12,
  },
  bargainTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bargainTitle: {
    fontFamily: FONTS.genshin,
    fontSize: 13,
    color: COLORS.inkPrimary,
  },
  bargainDesc: {
    fontSize: 11,
    color: COLORS.inkMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  bargainBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 12,
    color: '#2E3446',
  },
  refillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: '#D4C7AE',
  },
  refillCode: {
    fontFamily: FONTS.genshin,
    fontSize: 11,
    color: COLORS.inkPrimary,
  },
  refillQuota: {
    fontSize: 10,
    color: COLORS.inkMuted,
  },
  refillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#242B3E',
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  refillBtnText: {
    fontFamily: FONTS.genshin,
    fontSize: 10,
    color: COLORS.goldBright,
  },
  commissionHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.ivoryTop,
    borderWidth: 1,
    borderColor: COLORS.goldDivider,
  },
  commissionHintText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.inkSecondary,
    lineHeight: 16,
  },
  settingsBody: {
    padding: 16,
    gap: 12,
  },
  accountBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.insetWarm,
    borderWidth: 1,
    borderColor: COLORS.goldTrim,
  },
  accountEmail: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.goldDeep,
    flexShrink: 1,
  },
  fieldLabel: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.inkPrimary,
  },
  avatarChoiceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  avatarChoiceCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 12,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: '#D4C7AE',
  },
  avatarChoiceCardActive: {
    backgroundColor: '#FFFDF8',
    borderColor: COLORS.goldWarm,
    borderWidth: 1.5,
  },
  avatarChoiceRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    backgroundColor: COLORS.chromeDeep,
  },
  avatarChoiceName: {
    fontFamily: FONTS.genshin,
    fontSize: 11.5,
    color: COLORS.inkPrimary,
  },
  avatarChoiceSub: {
    fontSize: 9.5,
    color: COLORS.inkMuted,
  },
  avatarCheckDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.goldBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: COLORS.parchmentMid,
    borderWidth: 1,
    borderColor: '#CBB997',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: COLORS.inkBody,
  },
  bioInput: {
    minHeight: 62,
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
});
