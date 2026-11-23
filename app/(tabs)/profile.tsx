import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

/**
 * Halaman Profil Pengguna - Teyvat Delicacies
 * 
 * Memenuhi Ketentuan Soal 4: Fitur 5 (Halaman Profil):
 * • Menampilkan informasi profil pengguna (nama, email, informasi singkat).
 * • Menampilkan menu pengaturan sederhana atau informasi aplikasi.
 */
export default function ProfileScreen() {
  const profile = {
    name: 'Badar Rahman',
    nim: '14524303',
    program: 'S1 Teknik Informatika · Semester 5',
    institution: 'STIKOM Poltek Cirebon',
    email: 'badarrahman1905@gmail.com',
    role: 'Traveler of Teyvat',
    arLevel: 60,
    worldLevel: 9,
    moraWallet: 2214430,
    namecardName: 'Natlan · Divine Flame',
  };

  const menuOptions = [
    { title: 'Lisensi Petualang (Adventurer License)', subtitle: 'Data UID, World Level & Reputasi Bangsa' },
    { title: 'Ganti Spanduk Namecard', subtitle: '8 koleksi Namecard resmi wilayah Teyvat' },
    { title: 'Riwayat Pesanan Jamuan', subtitle: 'Catatan pengantaran kurir glider terdahulu' },
    { title: 'Buku Resep & Khasiat Tempur', subtitle: 'Kompilasi masakan ATK, DEF, HP & Stamina' },
    { title: 'Pengaturan Suara & Animasi', subtitle: 'BGM Teyvat, efek godray, dan notifikasi' },
    { title: 'Tentang Aplikasi & Versi', subtitle: 'Teyvat Delicacies v1.0.0 (Tugas 7 Pemrograman Visual)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Profil */}
      <View style={styles.header}>
        <Text style={styles.title}>Lisensi Petualang</Text>
        <Text style={styles.subtitle}>
          Adventurers&apos; Guild · Profil Penjelajah &amp; Pengaturan
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Kartu Profil Pengguna (Ketentuan Soal: Nama, Email, Info Singkat) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarBorder}>
              <Image
                source={{
                  uri: 'https://fastcdn.hoyoverse.com/content-psi/upload/2024/04/28/97cf735c02931201999e0df3fa8d10ee_8180219502759902604.png',
                }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>

            <View style={styles.nameDetails}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>AR {profile.arLevel} · WL {profile.worldLevel}</Text>
              </View>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userNim}>NIM: {profile.nim}</Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Program Studi</Text>
              <Text style={styles.infoValue}>{profile.program}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Kampus</Text>
              <Text style={styles.infoValue}>{profile.institution}</Text>
            </View>
          </View>
        </View>

        {/* Dompet Mora */}
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>Saldo Dompet Petualang</Text>
            <Text style={styles.walletValue}>🪙 {profile.moraWallet.toLocaleString()} Mora</Text>
          </View>
          <View style={styles.topUpBtn}>
            <Text style={styles.topUpBtnText}>+ Isi Mora</Text>
          </View>
        </View>

        {/* Menu Pengaturan & Informasi Aplikasi (Ketentuan Soal) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu &amp; Pengaturan Aplikasi</Text>
          <View style={styles.menuList}>
            {menuOptions.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuTextCol}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    backgroundColor: '#1E2435',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#C8A86B50',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE7A5',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#C8D0E4',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: '#FAF8F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#C8A86B',
    marginBottom: 14,
    elevation: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FFE7A5',
    overflow: 'hidden',
    backgroundColor: '#242C42',
    marginRight: 14,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  nameDetails: {
    flex: 1,
  },
  rankBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFE7D8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    marginBottom: 4,
  },
  rankBadgeText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#8A5D1C',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242735',
  },
  userNim: {
    fontSize: 11,
    color: '#5B6275',
    marginTop: 1,
  },
  userEmail: {
    fontSize: 11,
    color: '#8A5D1C',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD5C4',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#838A9E',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#242735',
  },
  walletCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#252038',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8A86B',
    marginBottom: 16,
  },
  walletLabel: {
    fontSize: 10.5,
    color: '#C8D0E4',
    marginBottom: 2,
  },
  walletValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFE7A5',
  },
  topUpBtn: {
    backgroundColor: '#C8A86B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  topUpBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1426',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#242735',
    marginBottom: 10,
  },
  menuList: {
    backgroundColor: '#FAF8F2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D3BC8E',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE6D8',
  },
  menuTextCol: {
    flex: 1,
    marginRight: 8,
  },
  menuTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#242735',
  },
  menuSubtitle: {
    fontSize: 10.5,
    color: '#70778B',
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: '#A89E88',
  },
});
