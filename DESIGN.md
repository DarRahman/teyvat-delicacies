# DESIGN.md — Teyvat Delicacies Design System & Specification

Dokumen spesifikasi desain antarmuka resmi untuk **Teyvat Delicacies**, mendokumentasikan sistem token visual, hierarki tata letak, komponen diegetic, dan standar estetika RPG fantasi sesuai arsitektur implementasi terbaru.

---

## 1. Design Philosophy & Aesthetic Identity

* **Diegetic RPG Interface**: Mengadopsi bahasa antarmuka resmi *in-game Genshin Impact* (bukan template SaaS / e-commerce datar). Menghadirkan atmosfer lembaran gulungan resep kuno dan buku petualang (*adventurer's handbook*).
* **Color Balance (65% Warm Parchment / 35% Obsidian Framing)**:
  * Kanvas utama konten adalah lembaran perkamen antik krem tebal (`#ECE5D8` / `#E9E5DC`), memberikan keterbacaan tinggi dan nuansa kertas kuno.
  * Langit malam obsidian berbintang (`#120F1D` / `#171421`) berfungsi sebagai bingkai luar dan penegas kedalaman kontras visual.
* **Zero Unicode Emojis**: Dilarang total menggunakan emoji bawaan OS. Seluruh ikonografi menggunakan aset transparan PNG resolusi tinggi atau vektor SVG berlian resmi.

---

## 2. Color Palette & Design Tokens

### Primary Surfaces & Canvases
| Token Name | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| `surface-canvas-night` | `#120F1D` | Latar belakang desktop & kanvas luar viewport |
| `surface-header-night` | `#171421` | Bilah atas header traveler & bilah tab bawah |
| `surface-sheet-parchment`| `#ECE5D8` | Lembaran dialog utama konten menu |
| `surface-card-parchment` | `#E9E5DC` | Permukaan tubuh kartu makanan (*two-tone bottom*) |
| `surface-inset-cream` | `#F5F2EB` | Kolom input pencarian & wadah kartu dalam |

### Borders & Accent Trims
| Token Name | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| `border-gold-accent` | `#FFE7A5` | Stroke aksen emas, lencana aktif, highlight sudut |
| `border-gold-hairline`| `#D3BC8E` | Garis pembatas kartu perkamen & pembagi berlian |
| `border-indigo-rim` | `#5D5187` | Garis tepi luar modul dialog & ring penegas kontras |
| `border-gold-banner` | `#C8A86B` | Bingkai kartu festival dan lisensi petualang |

### Rarity Grading Spectrum
| Rarity Tier | Header Hex | Linear Gradient | Asset Watermark |
| :--- | :--- | :--- | :--- |
| **1-Star (Common)** | `#818486` | `linear-gradient(135deg, #696C70 0%, #8C9094 100%)` | `/assets/icons/bg_1star.webp` |
| **2-Star (Uncommon)** | `#5A977A` | `linear-gradient(135deg, #43775E 0%, #68A889 100%)` | `/assets/icons/bg_2star.webp` |
| **3-Star (Rare)** | `#5987AD` | `linear-gradient(135deg, #416C91 0%, #6BA0C9 100%)` | `/assets/icons/bg_3star.webp` |
| **4-Star (Epic)** | `#9470BB` | `linear-gradient(135deg, #6F5194 0%, #A682CF 100%)` | `/assets/icons/bg_4star.webp` |
| **5-Star (Legendary)**| `#C87C24` | `linear-gradient(135deg, #9C5A14 0%, #D99238 100%)` | `/assets/icons/bg_5star.webp` |

---

## 3. Typography Hierarchy

* **Display & Title Font**: `GenshinFont` (`HYWenHei 85W` - `assets/fonts/GenshinFont.ttf`).
  * Digunakan pada: Judul aplikasi, nama hidangan, harga Mora, nama kategori, tajuk tab, dan modal dialog.
* **Body & UI Font**: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
  * Digunakan pada: Deskripsi masakan, *lore*, teks bantuan, dan teks sekunder.
* **Numerical Standard**: Seluruh angka harga Mora, saldo, kuantitas stepper, UID, dan hitungan mundur wajib menerapkan `tabular-nums` untuk perataan presisi.

---

## 4. Component Architectures

### 1. Two-Tone Food Card
* **Header Kelangkaan (Top 40%)**:
  * Gradasi warna sesuai bintang kelangkaan.
  * Watermark cincin Triquetra resmi (`bg_1star` s/d `bg_5star`) dengan `opacity: 0.35` dan `mix-blend-mode: overlay`.
  * Ilustrasi masakan PNG transparan beresolusi tinggi yang menyembul keluar melintasi batas pembatas (*overlapping depth*).
  * Di balik hidangan terdapat *radial illumination halo* lembut: `radial-gradient(circle at center, rgba(255, 231, 165, 0.42) 0%, transparent 68%)`.
  * Bintang berlian 4-sisi emas di pojok kiri bawah header.
* **Tubuh Perkamen (Bottom 60%)**:
  * Warna dasar `#E9E5DC` dengan judul tegas font Genshin.
  * Lencana buff tempur resmi (*ATK, DEF, HP, Stamina*).
  * Harga Mora dengan ikon koin emas resmi dan tombol cepat `+` berlapis emas.

### 2. Primary Gold Capsule Button (`teyvat-gold-btn`)
* **Bentuk**: Kapsul lonjong memanjang (*full-rounded*).
* **Gradasi**: `linear-gradient(180deg, #ECE5D8 0%, #D3BC8E 100%)`.
* **Border**: `1.5px solid #FFE7A5`.
* **Teks**: Bold `#3B4255`, font `GenshinFont`.
* **Efek Interaksi**: `active:scale-[0.98]` dengan bayangan jatuh tipis metalik.

### 3. Quick Cart Bar (Floating Traveler's Bag)
* Melayang di atas bilah navigasi bawah pada tab Beranda dan Katalog saat ada pesanan aktif.
* Latar belakang `#252038` dengan border emas tipis `#FFE7A5` dan efek blur latar belakang.
* Menampilkan jumlah hidangan, kalkulasi total Mora, dan tombol *"Buka Tas Petualang"*.

### 4. Bottom Navigation Bar (4 Tab Resmi Dosen)
* **Tab 1 — Beranda (`home`)**: Sambutan Traveler Badar Rahman, Banner Festival Kuliner, Kategori Cepat, 5 Rekomendasi Pilihan Chef Xiangling.
* **Tab 2 — Katalog (`catalog`)**: Daftar lengkap 16+ hidangan Teyvat dengan FlatList/grid, bilah pencarian nama, filter 8 wilayah, dan filter stat tempur.
* **Tab 3 — Keranjang (`cart`)**: Tas petualang, daftar pesanan, stepper jumlah (`- / +`), penukaran voucher Intertwined Fate, dan ringkasan tagihan Mora.
* **Tab 4 — Profil (`profile`)**: Lisensi Petualang UID 14524303, dompet Teyvat (Mora/Primogem), pengaturan audio, dan riwayat pesanan.

---

## 5. Viewport & Presentation Standard

* **Desktop Presentation**: Tampil terpusat dalam bingkai smartphone presisi (`420px × 840px`) bersudut membulat `36px` dengan bayangan dramatis dan latar belakang langit konstelasi malam `constellation_stars_bg.webp`.
* **Mobile Touch Canvas**: Otomatis memenuhi 100% layar sentuh smartphone (*100dvh full-screen viewport*) dengan area sentuh minimum 44×44px di setiap tombol interaktif.
