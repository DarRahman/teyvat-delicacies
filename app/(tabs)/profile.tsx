import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { NAMECARDS, formatMora } from '../../src/data/dishes';
import { useDelicaciesStore } from '../../src/store/useDelicaciesStore';

export default function ProfileScreen() {
  const profile = useDelicaciesStore((s) => s.profile);
  const selectedNamecardId = useDelicaciesStore((s) => s.selectedNamecardId);
  const setSelectedNamecard = useDelicaciesStore((s) => s.setSelectedNamecard);
  const orders = useDelicaciesStore((s) => s.orders);

  const [modalVisible, setModalVisible] = useState(false);

  const activeNamecard =
    NAMECARDS.find((n) => n.id === selectedNamecardId) ?? NAMECARDS[0];

  const handleSelectNamecard = (namecardId: string) => {
    setSelectedNamecard(namecardId);
    setModalVisible(false);
    Alert.alert('Namecard Diperbarui', 'Kartu nama profil Teyvat berhasil dipasang.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lisensi Penjelajah Teyvat</Text>
        <Text style={styles.headerSubtitle}>Profil Resmi Traveler & Informasi Aplikasi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.licenseCard}>
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: activeNamecard.fallbackBanner || activeNamecard.banner }}
              style={styles.bannerImage}
            />
            <View style={styles.bannerOverlay}>
              <Text style={styles.namecardRegionBadge}>{activeNamecard.region}</Text>
              <Text style={styles.namecardTitle}>{activeNamecard.name}</Text>
            </View>
          </View>

          <View style={styles.profileBody}>
            <View style={styles.avatarRow}>
              <Image
                source={{ uri: profile.fallbackAvatarUrl || profile.avatarUrl }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{profile.username}</Text>
                <Text style={styles.userUid}>UID: {profile.uid} · World Level {profile.worldLevel}</Text>
                <Text style={styles.userRankBadge}>AR {profile.adventureRank} · Adventure Rank Maksimal</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Saldo Mora</Text>
                <Text style={styles.statValue}>🪙 {formatMora(profile.mora)}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Pesanan</Text>
                <Text style={styles.statValue}>📦 {orders.length} Jamuan</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.changeNamecardBtn}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.changeNamecardBtnText}>Ganti Koleksi Namecard (8 Wilayah) ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Riwayat Jamuan Terakhir</Text>
          <View style={styles.ordersList}>
            {orders.slice(0, 3).map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <View style={styles.orderHeaderRow}>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderStatusBadge}>Selesai</Text>
                </View>
                <Text style={styles.orderDest}>
                  Tujuan: {order.deliveryPoint.region} ({order.deliveryPoint.name})
                </Text>
                <Text style={styles.orderTotal}>
                  Total: {formatMora(order.totalMora)} Mora ({order.items.length} item)
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pengaturan & Informasi Aplikasi</Text>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Aplikasi</Text>
              <Text style={styles.infoVal}>Teyvat Delicacies (v2.4)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Mata Kuliah</Text>
              <Text style={styles.infoVal}>Pemrograman Visual 1 (Tugas 7)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Institusi</Text>
              <Text style={styles.infoVal}>STIKOM Poltek Cirebon</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Framework</Text>
              <Text style={styles.infoVal}>React Native & Expo Router</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Koleksi Namecard Teyvat</Text>
                <Text style={styles.modalSubtitle}>Pilih kartu nama resmi dari 8 wilayah</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.namecardsGrid}>
              {NAMECARDS.map((card) => {
                const isSelected = card.id === selectedNamecardId;
                return (
                  <TouchableOpacity
                    key={card.id}
                    style={[styles.namecardItem, isSelected && styles.selectedNamecardItem]}
                    onPress={() => handleSelectNamecard(card.id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: card.fallbackBanner || card.banner }}
                      style={styles.namecardThumb}
                    />
                    <View style={styles.namecardThumbOverlay}>
                      <Text style={styles.namecardThumbTitle} numberOfLines={1}>
                        {card.name}
                      </Text>
                      <Text style={styles.namecardThumbRegion}>
                        {card.region} {isSelected ? '· (Aktif)' : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B40',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#A7ADC0',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 36,
  },
  licenseCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2D7C3',
  },
  bannerContainer: {
    height: 90,
    backgroundColor: '#2A334B',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    backgroundColor: '#1C2232CC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C8A86B50',
  },
  namecardRegionBadge: {
    color: '#FFE7A5',
    fontSize: 9,
    fontWeight: 'bold',
  },
  namecardTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  profileBody: {
    padding: 16,
    gap: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D4AF37',
    backgroundColor: '#262E44',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  userUid: {
    fontSize: 11,
    color: '#706452',
  },
  userRankBadge: {
    fontSize: 10,
    color: '#8A5810',
    fontWeight: 'bold',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F4ECE0',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D8CCA8',
  },
  statLabel: {
    fontSize: 10,
    color: '#706452',
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2F3542',
    marginTop: 2,
  },
  changeNamecardBtn: {
    backgroundColor: '#242B3D',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8A86B50',
  },
  changeNamecardBtnText: {
    color: '#FFE7A5',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2D7C3',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  ordersList: {
    gap: 8,
  },
  orderItem: {
    backgroundColor: '#F5EFE3',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#D8CCA8',
    gap: 2,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  orderStatusBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2B5838',
    backgroundColor: '#E2EFE3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderDest: {
    fontSize: 10,
    color: '#706452',
  },
  orderTotal: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B57A1E',
  },
  infoList: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  infoKey: {
    fontSize: 11,
    color: '#655743',
  },
  infoVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2F3542',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FDFBF7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8A86B',
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4DAC8',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2F3542',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#8A7B68',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECE5D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 13,
    color: '#3A3226',
    fontWeight: 'bold',
  },
  namecardsGrid: {
    gap: 10,
    paddingVertical: 6,
  },
  namecardItem: {
    borderRadius: 10,
    overflow: 'hidden',
    height: 64,
    borderWidth: 1,
    borderColor: '#D8CCA8',
    position: 'relative',
  },
  selectedNamecardItem: {
    borderColor: '#D4AF37',
    borderWidth: 2,
  },
  namecardThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  namecardThumbOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C2232DD',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  namecardThumbTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  namecardThumbRegion: {
    color: '#FFE7A5',
    fontSize: 9,
  },
});
