# Product Requirements Document (PRD) — Teyvat Delicacies

* **Project Title**: Teyvat Delicacies (Aplikasi Pemesanan Kuliner Teyvat)
* **Academic Course**: Pemrograman Visual I (`TI361`) — Tugas Pertemuan 7
* **Author / Developer**: Badar Rahman (NIM `14524303`, Kelas `TI-1`, Semester 5)
* **Institution**: STIKOM Poltek Cirebon
* **Target Platform**: Android & iOS Mobile (React Native + Expo Router)
* **Target Framework**: React Native (Expo SDK 52), TypeScript, Expo Image, Expo AV, Zustand
* **Version**: 1.0.0
* **Status**: Approved for Mobile Deployment (React Native + Expo Router)

---

## 1. Executive Summary & Objective

### 1.1 Objective
Membangun frontend aplikasi mobile pemesanan makanan (*Food Ordering App*) bertema fantasi RPG otentik dunia *Genshin Impact*. Aplikasi ini dirancang untuk memenuhi spesifikasi tugas akademik Pemrograman Visual I (Pertemuan 7), dengan fokus pada:
* Kualitas UI/UX kelas produksi (*production-grade*), bukan prototipe generic (*anti-slop*).
* Konsistensi tema visual Teyvat: warna kertas kuno (*parchment cream*), bingkai emas & indigo, tipografi resmi `HYWenHei 85W`, dan efek buff in-game.
* Eliminasi total emoji unicode standar, digantikan 100% oleh aset resmi Genshin Impact transparan (PNG) dan vektor (SVG).

### 1.2 Target Audience
* Dosen pengampu & penilai mata kuliah Pemrograman Visual I.
* Penggemar RPG fantasi dan kuliner yang menginginkan pengalaman pemesanan makanan imersif berbasis dunia Teyvat.

---

## 2. Technical Stack & Architecture

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React Native (Expo SDK 52)** | Standar industri untuk aplikasi cross-platform performa tinggi. |
| **Routing** | **Expo Router v4** | File-based routing yang bersih, mendukung 4 Bottom Tabs + Stack Screens. |
| **Language** | **TypeScript (Strict Mode)** | Menjamin keamanan tipe data (*type-safety*) dan kontrak model data. |
| **Styling** | **React Native StyleSheet + Theme Tokens** | Presisi rendering pixel, gradasi emas khusus, dan performa native optimal tanpa lag. |
| **Image Engine** | **expo-image** | Rendering transparan instan, disk caching, dan animasi smooth. |
| **Audio Engine** | **expo-av** | Memutar musik latar Teyvat (*BGM*) dan efek suara denting (*SFX*) tombol & Quest Complete. |
| **State Store** | **Zustand** | Manajemen state keranjang belanja (*cart*), kupon, dan saldo Mora yang ringan dan reaktif. |
| **Iconography** | **react-native-svg + Local PNGs** | 87 glyphs ikon resmi vektor SVG dan puluhan icon buff/makanan transparan. |

---

## 3. Scope & Feature Specifications

### 3.1 Screen Breakdown (Total 7 Layar)

#### A. Main Navigation (4 Bottom Tabs)
1. **Catalog Screen (`app/(tabs)/index.tsx`)**:
   * Header Traveler: Avatar Lumine/Aether, nama pengguna, dan saldo Mora live (`Mora 1,452,430`).
   * Search Bar: Pencarian instan masakan berdasarkan nama dan khasiat.
   * Category Filter Pills: `Semua Menu`, `Makanan Utama`, `Camilan / Snack`, `Minuman Segar`.
   * Two-Tone Card Grid: Kartu masakan bernuansa kertas kuno dengan header warna rarity (1* Abu-abu s/d 5* Emas), ilustrasi transparan, rating bintang 4-point diamond, dan tombol aksi beli mini.
   * Floating Quick Cart Bar: Bar melayang di bawah layar saat keranjang terisi.

2. **Explore & Buff Filter Screen (`app/(tabs)/explore.tsx`)**:
   * Filter multi-pilihan berdasarkan khasiat: *ATK Boost, DEF Boost, HP Recovery, Stamina*.
   * Filter berdasarkan bangsa/region: *Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya*.
   * Indikator visual ikon buff resmi transparan di tiap kartu.

3. **Cart Screen (`app/(tabs)/cart.tsx`)**:
   * Daftar item belanja dengan pengatur jumlah porsi (+ / -) dan tombol hapus item.
   * Input kode kupon diskon *Intertwined Fate* (misal: `PAIMONKENYANG` diskon 20%).
   * Rincian biaya: Subtotal pesanan, ongkir kurir glider, potongan diskon, dan total tagihan koin Mora.
   * Tombol utama kapsul emas menuju checkout pengantaran.

4. **Adventurer Profile Screen (`app/(tabs)/profile.tsx`)**:
   * Kartu petualang: UID `14524303`, Adventure Rank 60, World Level 8.
   * Dompet Teyvat: Saldo koin emas Mora, simpanan Primogem, dan voucher aktif.
   * Riwayat pesanan kuliner terdahulu (*Order History*).

#### B. Modal & Transaction Stack Screens
5. **Dish Detail Screen (`app/dish/[id].tsx`)**:
   * Tampilan layar penuh dengan gambar masakan besar berlatar cahaya lembut.
   * Detail khasiat in-game: Peningkatan status tempur dan durasi efek.
   * Grid bahan baku masakan (*Ingredients*) dengan takaran resep.
   * Cerita latar belakang masakan (*Food Lore*).
   * Stepper porsi dan tombol sticky bawah: *"Tambah ke Pesanan"*.

6. **Delivery Checkout Screen (`app/checkout.tsx`)**:
   * Pemilihan titik antar Teyvat (Markas Favonius, Teras Wanmin, Kuil Narukami, dll).
   * Pilihan metode bayar: Tunai Koin Mora (*Cash on Delivery*) atau Kartu Bank Northland.
   * Formulir catatan khusus untuk koki/dapur.

7. **Order Status & Success Modal (`app/order-status.tsx`)**:
   * Animasi kurir glider sedang mengantar pesanan.
   * Pop-up dialog modal emas legendaris: **"QUEST COMPLETE: Feast Delivered!"**.
   * Estimasi waktu tiba kurir dan tombol kembali ke beranda.

---

## 4. Design System & Anti-Slop Directives

1. **Aturan Mutlak Anti-Slop**:
   * **DILARANG MENGGUNAKAN EMOJI UNICODE**: Jangan gunakan emoji standar handphone (seperti koin, pedang, tameng, tas, bintang, centang).
   * Gunakan selalu berkas PNG transparan atau SVG resmi yang tersedia di direktori `assets/`.
2. **Palet Warna Resmi**:
   * Kertas Kuno Masakan: `#E9E5DC`
   * Sub-kontainer & Input: `#F5F2EB`
   * Background Luar: `#171421` / `#1D1A2A`
   * Border Indigo: `#5D5187`
   * Aksen Emas: `#FFE7A5`
   * Tombol Kapsul Emas: Gradasi `#ECE5D8` menuju `#D3BC8E` dengan teks `#3B4255`
3. **Tipografi**:
   * Menggunakan font `HYWenHei 85W` (`GenshinFont.ttf`).
4. **Motif Bintang & Poin**:
   * Menggunakan bintang belah ketupat 4 sudut (*4-point diamond star*), bukan bintang kartun 5 sudut.
