# Catatan Diskusi & Daftar Rencana Refinement Lanjutan (Teyvat Delicacies)

Dokumen catatan komprehensif untuk mendokumentasikan seluruh ide, evaluasi visual, temuan bug aset, dan arsitektur pengujian mobile sebelum dieksekusi di sesi perumusan prompt berikutnya.

---

## 1. Peta Lokasi Seluruh Aset Proyek (`assets/`)

Seluruh aset lokal tersimpan secara terstruktur di direktori proyek `assets/` (yang disajikan langsung oleh Vite ke URL `/assets/...`):

| Direktori Aset | Jumlah & Format | Daftar Berkas & Kegunaan |
| :--- | :--- | :--- |
| **`assets/dishes/`** | 16 PNG Transparan | Masakan resmi Teyvat: `adeptus_temptation.png`, `sweet_madame.png`, `jade_parcels.png`, `barbatos_ratatouille.png`, `mushroom_pizza.png`, `tonkotsu_ramen.png`, `golden_shrimp_balls.png`, `almond_tofu.png`, `shawarma_wrap.png`, `fishermans_toast.png`, `matsutake_meat_rolls.png`, `dango_milk.png`, `fonta.png`, `apple_cider.png`, `tri_color_dango.png`, `magmic_ode.png`. |
| **`assets/namecards/`** | 8 Pasang PNG HD | Banner Namecard profil & ikon pratinjau: `natlan_saurian_bg.png` + `_icon.png` (Saurian Natlan), `furina_fountain_bg.png` + `_icon.png`, `zhongli_rex_bg.png` + `_icon.png`, `raiden_shogun_bg.png` + `_icon.png`, `nahida_dendro_bg.png` + `_icon.png`, `fontaine_glory_bg.png` + `_icon.png`, `liyue_harbor_bg.png`, `mondstadt_favonius_bg.png`. |
| **`assets/icons/`** | 20+ PNG & WebP | Mata uang & material resmi: `mora.png`, `primogem.png`, `intertwined_fate.png`, `fragile_resin.png`, `crown_of_insight.png`, `genesis_crystal.png`. Watermark cincin Triquetra kelangkaan: `bg_1star.webp`, `bg_2star.webp`, `bg_3star.webp`, `bg_4star.webp`, `bg_5star.webp`. Ikon buff tempur: `buff_atk_add.png`, `buff_def_add.png`, `buff_recovery_hp.png`, `buff_stamina_reduce.png`, dll. |
| **`assets/map/`** | 2 WebP HD (2048×2560) | Peta lengkap benua Teyvat versi terbaru (v7.2 Natlan update): `teyvat_world_map.webp` & `teyvat_world_map_hd.webp` (mencakup Natlan 5.x, Fontaine, Chenyu Vale, Sumeru hutan & gurun, Inazuma, Liyue, dan Mondstadt). |
| **`assets/video/`** | MP4 & WebM 1080p | Video transisi pintu gerbang Celestia sinematik resmi: `celestia_door_open.mp4` (936 KB) & `celestia_door_open.webm` (475 KB) — menampilkan panorama langit biru siang penuh, awan melayang, pilar-pilar mengapung, pembukaan pintu batu, dan ledakan kilatan cahaya putih (*fade to white*). |
| **`assets/backgrounds/`** | 5 WebP & PNG HD | Latar belakang atmosferik: `genshin_celestia_login_door_1080p.webp` (Pintu langit Celestia siang), `constellation_stars_bg.webp` (Langit konstelasi malam), `dish_detail_bg.webp`, `wish-background.webp`. |
| **`assets/fonts/`** | TTF & SVG Vektor | `GenshinFont.ttf` (HYWenHei 85W, font resmi Hoyoverse) dan `genshin_icons.svg` (87 glyph ikon in-game resmi). |
| **`assets/audio/`** | 4 OGG Berkualitas | Audio in-game: `teyvat_ambient_bgm.ogg` (musik latar santai), `quest_complete_jingle.ogg` (jingle pesanan selesai), `legendary_dish_sfx.ogg` (efek hidangan bintang 5), `epic_dish_sfx.ogg`. |
| **`assets/ui/`** | WebP & PNG | `genshin_logo.webp`, `paimon_hungry_mascot.png`, `gold_button_texture.webp`, `modal_ornament_icon.png`. |

---

## 2. Status Kesesuaian `DESIGN.md` dengan Kode Riil

Berkas `DESIGN.md` telah disinkronkan 100% dengan kode aktual yang dihasilkan Google AI Studio:
1. **Palet Warna & Token Visual**:
   * Token `surface-canvas-night` (`#120F1D`) dan `surface-header-night` (`#171421`) diterapkan presisi pada kanvas luar dan bilah navigasi.
   * Token `surface-sheet-parchment` (`#ECE5D8`) menjadi lembaran dialog utama pada Beranda, Katalog, dan Profil.
   * Token kartu `surface-card-parchment` (`#E9E5DC`) dan aksen emas `#FFE7A5` & `#D3BC8E` terpasang konsisten.
2. **Spektrum Kelangkaan (1★ s/d 5★)**:
   * Hex `#818486` (1★ Abu-abu), `#5A977A` (2★ Hijau), `#5987AD` (3★ Biru), `#9470BB` (4★ Ungu), `#C87C24` (5★ Emas) terpasang di `RARITY_META` (`src/data/dishes.ts`) dan styling kartu dua warna.
3. **Komponen Inti**:
   * *Two-Tone Food Card*, *Primary Gold Capsule Button*, *Floating Quick Cart Bar*, serta 4 Tab Bawah (`Beranda`, `Katalog`, `Keranjang`, `Profil`) terimplementasi tanpa deviasi.

---

## 3. Catatan Evaluasi & Rencana Refinement Berdasarkan Referensi Tangkapan Layar

Berdasarkan analisis tangkapan layar akun in-game Genshin Impact AR 58 milik Badar dan antarmuka AI Studio:

### A. Evaluasi Gambar & Data Masakan di Katalog
* **Ketidakcocokan Gambar Makanan (Mismatch)**:
  * Pada hidangan *Apple Cider* (3★ Biru), gambar yang tampil adalah apel utuh, bukan botol minuman cider. Perlu diarahkan ke `assets/dishes/apple_cider.png`.
  * Pada hidangan *Blazed Meat Stew* (4★ Ungu khas Natlan), gambar yang tampil adalah semangkuk ramen (*Tonkotsu Ramen*). Perlu diarahkan ke aset hidangan daging berbumbu api seperti `assets/dishes/magmic_ode.png`.
* **Watermark Kelangkaan Bintang 1 dan 2**:
  * Pada kartu masakan kelangkaan 1★ dan 2★, bagian header masih terlihat polos tanpa watermark cincin Triquetra melingkar. Perlu dihubungkan dengan aset `assets/icons/bg_1star.webp` dan `assets/icons/bg_2star.webp` (opacity 35% overlay) agar seragam dengan bintang 3, 4, dan 5.

### B. Evaluasi Lisensi Petualang & Sistem Namecard (Profil Screen)
* **Adopsi Namecard Banner Khas Genshin**:
  * Pada tangkapan layar Genshin milik Badar (AR 58 World Level 9), bagian atas profil memuat kartu nama (*Namecard*) tematik (Saurian Natlan dengan tiga naga kecil).
  * Pada profil AI Studio saat ini, header lisensi masih menggunakan kartu hitam polos sederhana.
  * *Rencana Refinement*: Mengganti kartu hitam polos dengan banner Namecard horizontal resmi (`assets/namecards/natlan_saurian_bg.png`), serta menambahkan tombol kecil *"Ganti Kartu Nama"* yang membuka modal grid koleksi 8 Namecard seperti pada menu in-game Genshin.

### C. Keseimbangan Warna (Color Balance: Parchment vs Obsidian)
* **Menghindari Nuansa Terlalu Gelap**:
  * Genshin Impact menggunakan lembaran perkamen krem hangat (`#ECE5D8`) pada 65% area antarmuka menu (seperti menu Tas Artefak di tangkapan layar kedua).
  * Obsidian malam (`#171421`) hanya berfungsi sebagai bingkai luar dan bilah navigasi (35%), sehingga atmosfer aplikasi terasa seperti membaca buku panduan petualang (*Adventurer Handbook*) yang mewah dan bersih, bukan tema dark-mode monokrom standar.

### D. Fitur Peta Teyvat (Checkout Screen)
* **Pemilih Waypoint Pengantaran Kurir Glider**:
  * Di halaman Checkout, tombol *"Pilih di Peta Teyvat"* akan membuka dialog interaktif yang menampilkan peta utuh 2048px `assets/map/teyvat_world_map.webp`.
  * Menampilkan 6 pin teleport waypoint (Mondstadt HQ, Wanmin Restaurant Liyue, Kuil Grand Narukami, Akademiya Sumeru, Opera Epiclese Fontaine, Teater Bunga Natlan) dengan garis putus-putus rute pengantaran glider.

---

## 4. Panduan Menjalankan & Memeriksa Aplikasi di Smartphone (HP)

Aplikasi dapat langsung dicoba di layar smartphone fisik Badar melalui dua metode tanpa mengubah satu baris pun kode desain:

### Metode 1: Buka Langsung di Browser HP (Paling Cepat — Detik Ini Juga)
1. Pastikan smartphone dan laptop **Axioo Pongo 725 V2** terhubung ke jaringan Wi-Fi yang sama.
2. Buka aplikasi browser di HP (Google Chrome / Safari) dan ketik alamat:
   ```
   http://192.168.1.74:3000
   ```
3. *(Opsional)* Tekan menu titik tiga di browser HP lalu pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)** untuk menjadikannya seperti aplikasi native berlayar penuh tanpa bilah URL.

### Metode 2: Melalui Aplikasi Expo Go (SDK 58)
Wrapper container native Expo SDK 58 telah disiapkan di folder `expo-mobile/` menggunakan modul `react-native-webview`. Server Metro bundler saat ini aktif di port 8081.

1. Buka aplikasi **Expo Go** di smartphone Android / iPhone.
2. Di aplikasi Expo Go, masukkan URL server Metro lokal:
   ```
   exp://192.168.1.74:8081
   ```
3. Aplikasi akan langsung memuat tampilan *Teyvat Delicacies* di dalam shell native dengan status bar gelap presisi dan kendali sentuh penuh.
