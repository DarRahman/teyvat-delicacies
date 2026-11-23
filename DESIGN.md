# DESIGN.md — Teyvat Delicacies Modern Design Specification

Dokumen spesifikasi desain antarmuka resmi untuk **Teyvat Delicacies**, mendokumentasikan sistem token visual, hierarki tata letak layar penuh (*edge-to-edge*), komponen diegetic, dan standar estetika RPG modern berbasis perpaduan *in-game Genshin Impact* dan *HoYoLAB Battle Chronicle*.

---

## 1. Aesthetic Identity & Design Philosophy

* **Modern RPG & HoYoLAB Chronicle Elegance**: Mengadopsi arsitektur visual resmi HoYoLAB dan menu in-game Genshin. Menghadirkan keseimbangan antara kanvas kosmik yang bernafas (*breathing cosmic canvas*), lembaran kartu gading kuno (*ivory parchment cards*), dan akrilik kaca transparan (*glassmorphism*).
* **True Fullscreen / Edge-to-Edge Canvas**: 
  * Pada perangkat smartphone mobile, antarmuka mengalir 100% penuh dari ujung ke ujung (*full bleed*), tanpa bingkai luar mengambang (*no outer inset border*) yang membungkus atau mencekik konten.
  * Kartu-kartu data di dalam layar memiliki margin samping internal standar (`px-4`) dengan sudut membulat mewah (`rounded-2xl`).
* **Atmospheric Translucency (Tidak Segelap Itu)**:
  * Menghindari warna hitam pekat mati. Latar belakang kanvas mengadopsi gradasi *Midnight Slate & Cosmic Indigo* (`#1E2333` ke `#141824`) bertekstur bintang lembut.
  * Elemen bilah atas (*top bar*), bilah tab bawah, dan kartu status mengadopsi akrilik kaca transparan (`backdrop-blur-md bg-[#1E2333]/70` berbingkai emas tipis `#FFE7A5`/25).
* **Zero Unicode Emojis**: Seluruh ikonografi wajib menggunakan aset vektor SVG berlian resmi atau gambar transparan PNG beresolusi tinggi.

---

## 2. Color Palette & Design Tokens

### Primary Surfaces & Backdrops
| Token Name | Hex / RGBA | Peran & Penggunaan |
| :--- | :--- | :--- |
| `surface-canvas-slate` | `#1A1F2C` / `#1E2333` | Kanvas latar belakang utama yang sejuk dan bernafas |
| `surface-glass-midnight`| `rgba(28, 34, 52, 0.72)` | Bilah atas profil traveler & bilah tab navigasi bawah |
| `surface-card-parchment`| `#F7F4EE` / `#ECE5D8` | Permukaan utama kartu hidangan, rincian pesanan, & dompet |
| `surface-inset-parchment`| `#EFECE3` | Kolom input pencarian, catatan chef, & wadah stepper |
| `surface-tag-glass` | `rgba(22, 27, 42, 0.65)` | Lencana statistik petualang di atas banner Namecard |

### Accents & Borders
| Token Name | Hex Code | Peran & Penggunaan |
| :--- | :--- | :--- |
| `accent-gold-primary` | `#FFE7A5` | Teks judul aktif, pendaran status, ikon koin Mora, ring aktif |
| `border-gold-hairline` | `#D3BC8E` | Garis tepi kartu perkamen gading & pembagi berlian |
| `border-glass-rim` | `rgba(255, 231, 165, 0.22)`| Stroke pembatas akrilik kaca transparan |
| `accent-anemo-teal` | `#56E2B6` | Pendaran kursor angin pelacakan kurir glider & status kilat |

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

* **Display & RPG Title**: `GenshinFont` (`HYWenHei 85W` - `/assets/fonts/GenshinFont.ttf`).
  * Digunakan pada: Judul aplikasi, nama hidangan, harga Mora, nama kategori, tajuk tab, dan modal dialog petualang.
* **Body & UI Font**: `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
  * Digunakan pada: Deskripsi masakan, *lore*, teks bantuan, dan teks status kurir.
* **Numerical Standard**: Seluruh angka harga Mora, saldo dompet, kuantitas stepper, UID petualang, dan hitungan mundur wajib menerapkan `tabular-nums` untuk perataan angka monospace.

---

## 4. Component Architectures & Guidelines

### 1. Edge-to-Edge Screen Architecture
* **Tidak Ada Pembungkus Mengambang (*No Outer Box Wrapper*)**: Konten utama mengisi 100% lebar viewport smartphone. Ruang bernafas diciptakan melalui padding horizontal internal komponen (`px-4`), bukan margin luar layout.
* **Translucent Floating Header**: Header traveler melayang lembut di bagian atas layar dengan efek blur kaca (`backdrop-blur-md`), memperlihatkan latar belakang kosmik saat pengguna menggulir konten.

### 2. Glider Delivery Progress Tracker (3-Point Waypoint System)
* Menggantikan bilah persentase statis dengan lintasan penerbangan 3 stasiun resmi:
  * **Titik 1 (Dapur Teyvat)**: Titik tolak pesanan dengan ikon tungku/koki.
  * **Titik 2 (Kurir di Udara)**: Kursor angin melayang dengan pendaran Anemo teal `#56E2B6` dan cincin emas.
  * **Titik 3 (Lokasi Tujuan)**: Waypoint teleportasi wilayah pemesan (misal: *Grand Narukami Shrine, Inazuma*).
* Garis lintasan menghubungkan stasiun secara presisi dari 0% hingga 100% tanpa celah putus di ujung kanan.

### 3. Two-Tone Food Card
* **Header Kelangkaan (Top 40%)**: Gradasi kelangkaan bintang dengan watermark cincin Triquetra resmi (`bg_1star` s/d `bg_5star`, `opacity: 0.35`), pendaran radial lembut di belakang hidangan PNG transparan.
* **Tubuh Kartu Gading (Bottom 60%)**: Latar krem gading lembut `#F7F4EE` bergaris emas tipis `#D3BC8E`, lencana buff tempur resmi, harga Mora dengan koin resmi, dan tombol cepat `+`.

### 4. Floating Quick Cart Bar (Tas Petualang)
* Melayang elegan di atas bilah navigasi dengan akrilik kaca gelap transparan (`rgba(28, 34, 52, 0.85)`), ring emas tipis, dan efek blur latar belakang.
