# Teyvat Delicacies - Pemvis Tugas 7: Aplikasi Pemesanan Makanan Mobile

Aplikasi mobile katalog dan pemesanan kuliner bertema fantasi RPG dunia Teyvat (*Genshin Impact*) berbasis React Native dan Expo Router (Expo SDK 52). Proyek ini dikembangkan untuk memenuhi penugasan praktikum Tugas 7 (Pertemuan 7) mata kuliah Pemrograman Visual I pada program studi S1 Teknik Informatika STIKOM Poltek Cirebon.

---

## Identitas Pengembang & Penugasan

- Nama Mahasiswa : Badar Rahman
- NIM            : 14524303
- Program Studi  : S1 Teknik Informatika
- Kelas          : TI-1
- Semester       : 5 (Ganjil)
- Kampus         : STIKOM Poltek Cirebon
- Mata Kuliah    : Pemrograman Visual I (TI361)
- Penugasan      : Tugas 7 (Pertemuan 7)
- Dosen Pengampu : Rifky Hilmanudin, S.Kom., M.Kom.
- Repositori Git : https://github.com/DarRahman/teyvat-delicacies

---

## Struktur Berkas & Arsitektur Direktori Proyek

```text
teyvat-delicacies/
├── README.md                          # Dokumentasi resmi proyek akademik Tugas 7
├── PRD_TEYVAT_DELICACIES.md           # Spesifikasi teknis aplikasi kuliner
├── SPESIFIKASI_TUGAS_7_PEMVIS.md      # Salinan ketentuan soal praktikum dosen
├── package.json                       # Konfigurasi dependensi simulator root
├── tsconfig.json                      # Konfigurasi TypeScript root
├── vite.config.ts                     # Konfigurasi bundler Vite dev server
├── index.html                         # Dokumen induk simulator web
├── assets/                            # Koleksi aset visual dan media game
│   ├── backgrounds/                   # Latar belakang gerbang Celestia & konstelasi
│   ├── dishes/                        # Berkas PNG transparan masakan utama
│   ├── icons/                         # Ikon mata uang Mora, Primogem, dan buff
│   ├── map/                           # Peta benua Teyvat resolusi tinggi 8 region
│   ├── namecards/                     # Panji kartu nama karakter & wilayah
│   └── ui/                            # Ornamen belah ketupat dan logo
├── screenshots/                       # Dokumentasi 10 tangkapan layar antarmuka
│   ├── 01_beranda_rekomendasi.jpg
│   ├── 02_beranda_kategori.jpg
│   ├── 03_katalog_flatlist.jpg
│   ├── 04_katalog_pencarian.jpg
│   ├── 05_detail_makanan_resep.jpg
│   ├── 06_keranjang_belanja.jpg
│   ├── 07_checkout_pengiriman.jpg
│   ├── 08_pelacakan_glider.jpg
│   ├── 09_quest_complete_modal.jpg
│   └── 10_profil_pengaturan.jpg
├── expo-mobile/                       # Subproyek utama aplikasi React Native Expo
│   ├── app.json                       # Konfigurasi metadata aplikasi Expo SDK 52
│   ├── package.json                   # Dependensi mobile (React 18, Expo 52, Zustand)
│   ├── tsconfig.json                  # Konfigurasi TypeScript mobile
│   ├── app/                           # File-Based Routing (Expo Router)
│   │   ├── _layout.tsx                # Root layout, Stack navigator, safe area & toast
│   │   ├── index.tsx                  # Layar pembuka (Celestia Gate Entrance Screen)
│   │   ├── checkout.tsx               # Layar formulir checkout & titik antar Waypoint
│   │   ├── (tabs)/                    # 4 Menu bilah navigasi bawah (Bottom Tabs)
│   │   │   ├── _layout.tsx            # Konfigurasi Tabs navigator & tab bar styling
│   │   │   ├── index.tsx              # Tab 1: Beranda & Rekomendasi Chef Xiangling
│   │   │   ├── catalog.tsx            # Tab 2: Katalog 80 Hidangan (FlatList 2 kolom)
│   │   │   ├── cart.tsx               # Tab 3: Keranjang Belanja & Validasi Kupon
│   │   │   └── profile.tsx            # Tab 4: Profil Mahasiswa & Pengaturan
│   │   ├── dish/
│   │   │   └── [id].tsx               # Layar dinamis Detail Masakan, Lore & Resep
│   │   └── order/
│   │       └── [id].tsx               # Layar Pelacakan Glider & Modal Quest Complete
│   ├── components/
│   │   └── TeyvatUI.tsx               # Komponen antarmuka modular (Cards, Modal, Buttons)
│   ├── data/
│   │   ├── assets.ts                  # Resolusi impor aset lokal terpusat
│   │   ├── dishes.ts                  # Metadata hidangan kurasi & titik antar wilayah
│   │   └── yattaCatalog.ts            # Basis data 80 hidangan resmi 8 region Teyvat
│   ├── lib/
│   │   └── delicaciesRules.ts         # Aturan bisnis (ongkir, kupon diskon, kalkulasi Mora)
│   ├── store/
│   │   └── useDelicaciesStore.ts      # State management terpusat (Zustand + AsyncStorage)
│   └── theme/
│       └── tokens.ts                  # Token desain resmi (Palet Hex, Font, Elevation)
└── src/                               # Simulator Web React + Tailwind CSS
    ├── App.tsx                        # Root container web simulator
    ├── components/                    # Komponen antarmuka web
    ├── data/                          # Data hidangan simulator web
    ├── screens/                       # Layar simulasi desktop/web
    └── store/                         # State manager simulator web
```

---

## Fitur Aplikasi

1. **Halaman Beranda & Rekomendasi Utama**  
   Menampilkan identitas aplikasi pemesanan kuliner, banner promosi masakan Chef Xiangling, 5 hidangan rekomendasi terbaik lengkap dengan harga Mora dan lencana buff, serta 4 tombol pintasan kategori kuliner (Hidangan Utama, Minuman, Cemilan, Penguat Tempur).

2. **Katalog Terpadu 80 Hidangan (FlatList 2 Kolom)**  
   Menampilkan 80 masakan resmi dari seluruh region Teyvat (Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya). Dirender menggunakan komponen performa tinggi `FlatList` 2 kolom dengan virtualisasi memori agar rendering tetap halus dan ringan di perangkat mobile.

3. **Pencarian Cepat & Filter Region**  
   Fitur pencarian instan berdasarkan nama masakan (*Search Bar*) serta filter kategori dan asal wilayah untuk memudahkan petualang menemukan kuliner yang diinginkan.

4. **Detail Masakan, Lore & Resep Bahan**  
   Halaman detail dinamis berbasis parameter rute (`app/dish/[id].tsx`) menampilkan gambar beresolusi tinggi, narasi latar belakang (*lore in-game*), efek peningkatan status tempur (*Combat Buff*), takaran bahan resep, stepper porsi, tombol *Add to Cart*, serta tombol *Pesan Sekarang*.

5. **Keranjang Belanja & Validasi Kupon**  
   Daftar seluruh item pesanan aktif dengan pengatur kuantitas porsi (+ / -), subtotal harga, serta tombol hapus item. Dilengkapi sistem penebusan voucher diskon resmi (*PAIMONKENYANG, GLIDERFREE, ADEPTEUSFEAST*) dengan validasi kuota dan syarat minimal belanja otomatis.

6. **Simulasi Checkout & Titik Antar Waypoint**  
   Ringkasan pesanan dengan pemilihan 8 titik antar markas Teyvat (termasuk Restoran Wanmin Liyue dengan bebas ongkir) yang dilengkapi modal peta benua interaktif, pilihan metode bayar (Koin Mora Tunai COD atau Kartu Debit Bank Northland), serta catatan khusus dapur.

7. **Pelacakan Kurir Wind Glider & Quest Complete**  
   Animasi pelacakan progres kurir *Wind Glider* waktu nyata dari dapur hingga mendarat di lokasi tujuan (progres 100%), yang diakhiri dengan tampilan modal dialog *"QUEST COMPLETE: Feast Delivered!"* berpemberian hadiah saldo Primogem.

8. **Profil Petualang & Pengaturan Aplikasi**  
   Menampilkan data profil resmi mahasiswa (Badar Rahman, NIM 14524303, AR 60, WL 9, email `badarrahman1905@gmail.com`), fitur interaktif ganti Panji Kartu Nama (*Namecard Picker*), klaim berkah harian Mora Ley Line, serta modal pengaturan informasi versi aplikasi.

---

## Arsitektur Navigasi & Expo Router

Proyek ini menerapkan arsitektur navigasi deklaratif berbasis berkas (*File-Based Routing*) menggunakan Expo Router:

1. **Folder `app/`**  
   Menjadi direktori akar tempat seluruh sistem perutean aplikasi didefinisikan secara otomatis tanpa konfigurasi rute imperatif manual.

2. **Root Layout (`app/_layout.tsx`)**  
   Membungkus tumpukan layar (*Stack Navigator*), menangani area aman (*SafeAreaProvider*), dan menampung komponen persisten seperti `TeyvatToast` di bagian atas layar agar tidak ter-unmount saat berpindah rute.

3. **Bottom Tab Navigation (`app/(tabs)/`)**  
   Mengelompokkan 4 menu utama (Beranda, Katalog, Keranjang, Profil) dalam satu navigator bilah bawah tetap menggunakan struktur grup rute `(tabs)` tanpa mengubah segmen URL.

4. **Nested Stack & Rute Dinamis (`app/dish/[id].tsx` & `app/order/[id].tsx`)**  
   Navigasi bertingkat dari tab Beranda/Katalog menuju layar detail masakan menggunakan parameter dinamis `[id]` yang ditangkap dengan hook `useLocalSearchParams()`, diteruskan ke layar `checkout.tsx`, dan berakhir pada pelacakan pesanan `order/[id].tsx`.

5. **State Management Terpusat (Zustand + AsyncStorage)**  
   Pengelolaan status keranjang, riwayat pesanan, profil petualang, serta saldo Mora dan Primogem tersinkronisasi secara reaktif dan persisten pada penyimpanan lokal perangkat.

---

## Tangkapan Layar Aplikasi

| 01. Rekomendasi Beranda | 02. Kategori Kuliner | 03. Katalog 80 Masakan |
| :---: | :---: | :---: |
| ![Beranda](screenshots/01_beranda_rekomendasi.jpg) | ![Kategori](screenshots/02_beranda_kategori.jpg) | ![Katalog](screenshots/03_katalog_flatlist.jpg) |

| 04. Pencarian Katalog | 05. Detail Masakan & Resep | 06. Keranjang & Kupon |
| :---: | :---: | :---: |
| ![Pencarian](screenshots/04_katalog_pencarian.jpg) | ![Detail](screenshots/05_detail_makanan_resep.jpg) | ![Keranjang](screenshots/06_keranjang_belanja.jpg) |

| 07. Checkout & Waypoint | 08. Pelacakan Glider | 09. Quest Complete Modal |
| :---: | :---: | :---: |
| ![Checkout](screenshots/07_checkout_pengiriman.jpg) | ![Pelacakan](screenshots/08_pelacakan_glider.jpg) | ![Quest Complete](screenshots/09_quest_complete_modal.jpg) |

| 10. Profil & Pengaturan |
| :---: |
| ![Profil](screenshots/10_profil_pengaturan.jpg) |

---

## Petunjuk Menjalankan Aplikasi

Prasyarat: Node.js (versi 18 ke atas) dan npm telah terpasang pada komputer.

1. Kloning repositori proyek:
   ```bash
   git clone https://github.com/DarRahman/teyvat-delicacies.git
   cd teyvat-delicacies
   ```

2. Jalankan aplikasi mobile via Metro Bundler (Expo):
   ```bash
   cd expo-mobile
   npm install
   npx expo start -c
   ```

3. Buka aplikasi **Expo Go** pada perangkat smartphone fisik (Android / iOS) atau emulator, lalu pindai kode QR yang muncul di terminal (pastikan ponsel dan laptop terhubung dalam satu jaringan Wi-Fi yang sama).

4. Untuk memvalidasi integritas kode TypeScript pada subproyek mobile:
   ```bash
   npm run typecheck
   ```

5. (Opsional) Menjalankan simulator versi web desktop:
   ```bash
   cd ..
   npm install
   npm run dev
   ```
   Buka `http://localhost:3000` pada peramban web.
