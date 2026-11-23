# Riset Komprehensif: Sistem Desain, Palet Warna & Sumber Aset Genshin Impact

* **Mata Kuliah**: Pemrograman Visual I (`TI361`) - Tugas 7 (Food Catalog & Delivery App)
* **Penyusun**: Badar Rahman (NIM `14524303`)
* **Tujuan**: Acuan desain UI/UX dan penyediaan aset visual agar aplikasi makanan berbasis React Native & Expo Router tampil 100% otentik menyerupai antarmuka *Genshin Impact*.

---

## 1. Sumber Aset & CDN Transparent PNG Siap Pakai

Seluruh aset gambar telah diverifikasi memiliki format **Transparent PNG** (latar transparan murni tanpa background putih/kotak), resolusi tajam (256x256 px hingga 512x512 px), dan mendukung pemanggilan langsung via *Image URI* di React Native tanpa memicu blokir CORS.

* **Base URL CDN Resmi (Project Amber / Yatta Moe):**  
  `https://gi.yatta.moe/assets/UI/{IconName}.png`
* **Repositori Data Terverifikasi:**  
  `theBowja/genshin-db` & `Dimbreath/GenshinData` (GitHub).

### A. Katalog Makanan Ikonik (Dishes)

| Nama Makanan | Tier Rarity | Kategori Menu | Icon Asset Name | Direct CDN Link |
| :--- | :---: | :--- | :--- | :--- |
| **Adeptus' Temptation** | 5-Star | Makanan Utama | `UI_ItemIcon_108123` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108123.png` |
| **Jade Parcels** | 4-Star | Makanan Utama | `UI_ItemIcon_108122` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108122.png` |
| **Golden Shrimp Balls** | 3-Star | Snack / Camilan | `UI_ItemIcon_108126` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108126.png` |
| **Mondstadt Hash Brown** | 3-Star | Snack / Camilan | `UI_ItemIcon_108119` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108119.png` |
| **Mushroom Pizza** | 3-Star | Makanan Utama | `UI_ItemIcon_108117` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108117.png` |
| **Sweet Madame** | 2-Star | Makanan Utama | `UI_ItemIcon_108115` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108115.png` |
| **Barbatos Ratatouille** | 2-Star | Makanan Utama | `UI_ItemIcon_108118` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108118.png` |
| **Almond Tofu** | 2-Star | Dessert / Manisan | `UI_ItemIcon_100428` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100428.png` |
| **Dango Milk** | 2-Star | Minuman | `UI_ItemIcon_101514` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_101514.png` |
| **Wolfhook Juice** | 2-Star | Minuman | `UI_ItemIcon_108149` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108149.png` |
| **Mora Meat** | 1-Star | Snack / Roti | `UI_ItemIcon_108101` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108101.png` |
| **Teyvat Fried Egg** | 1-Star | Snack / Sarapan | `UI_ItemIcon_108006` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_108006.png` |

### B. Mata Uang (Mora) & Bahan Mentah Masakan (Ingredients)

| Nama Aset | Keterangan | Icon Asset Name | Direct CDN Link |
| :--- | :--- | :--- | :--- |
| **Mora Coin** | Simbol Koin Uang Teyvat ( Mora) | `UI_ItemIcon_202` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_202.png` |
| **Fowl** | Daging Unggas Segar | `UI_ItemIcon_100061` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100061.png` |
| **Raw Meat** | Daging Merah Mentah | `UI_ItemIcon_100062` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100062.png` |
| **Sweet Flower** | Bunga Manis | `UI_ItemIcon_100012` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100012.png` |
| **Ham** | Ham Asap Gurih | `UI_ItemIcon_110005` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_110005.png` |
| **Crab** | Kepiting Segar Laut | `UI_ItemIcon_100073` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100073.png` |
| **Shrimp Meat** | Daging Udang Kupas | `UI_ItemIcon_100075` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100075.png` |
| **Flour** | Tepung Gandum | `UI_ItemIcon_110001` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_110001.png` |
| **Milk** | Susu Segar Botol | `UI_ItemIcon_100078` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100078.png` |
| **Potato** | Kentang | `UI_ItemIcon_100080` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100080.png` |
| **Matsutake** | Jamur Matsutake Hutan | `UI_ItemIcon_100063` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100063.png` |
| **Wolfhook** | Buah Berry Wolfhook Berduri | `UI_ItemIcon_100025` | `https://gi.yatta.moe/assets/UI/UI_ItemIcon_100025.png` |

---

## 2. Palet Warna Resmi (Official Hex Design Tokens)

### A. Warna Dasar Khas (Parchment & Charcoal)
* **Krem Kertas Kuno (`Parchment Paper`):** `#E9E5DC`  
  *Warna latar belakang paling identik pada modal informasi makanan, kartu resep, dan dialog in-game.*
* **Krem Cerah Sub-Kontainer:** `#F5F2EB`  
  *Digunakan untuk card inner, kolom input kupon, atau area pencarian.*
* **Charcoal Slate Teks (`Dark Slate`):** `#4A5366`  
  *Warna teks standar untuk deskripsi, paragraf, dan label agar tidak terlalu kontras hitam pekat.*
* **Deep Navy Obsidian (`Dark Surface`):** `#1D1A2A` atau `#312B47`  
  *Latar belakang utama layar aplikasi (*dark mode fantasy*), modal overlay, dan navbar.*
* **Card Border Accent (`Muted Indigo Stroke`):** `#5D5187`  
  *Garis tepi pembungkus kartu antarmuka.*

### B. Aksen Emas Teyvat (Gold & Star System)
* **Bintang Kelangkaan (`Star Yellow`):** `#FFCC32`  
  *Warna bintang 4-point diamond kelangkaan dan rating kepuasan pelanggan.*
* **Emas Primer Tombol (`Gold Gradient Accent`):** `#D3BC8E` hingga `#E3C78A`  
  *Digunakan pada tombol utama "Pesan Sekarang", "Beli", atau badge harga Mora.*
* **Teks Judul Emas (`Gold Heading`):** `#D49F3D` / `#7E6B09`  
  *Subjudul section "Bahan Masakan (Ingredients)", "Efek Buff", dll.*

### C. Latar Belakang Tingkat Kelangkaan (Rarity Gradients)
Setiap kartu masakan memiliki banner atas yang warnanya mengikuti tingkat bintang kelangkaan:
* **1-Star (Common - Abu-abu):** `#818486` (Gradasi ke `#6A6D70`)
* **2-Star (Uncommon - Hijau Lumut):** `#5A977A` (Gradasi ke `#46745F`)
* **3-Star (Rare - Biru Samudra):** `#5987AD` (Gradasi ke `#436683`)
* **4-Star (Epic - Ungu Mistis):** `#9470BB` (Gradasi ke `#6E508E`)
* **5-Star (Legendary - Emas/Oranye Jingga):** `#E09536` (Gradasi ke `#C87C24`)

### D. Warna 7 Elemen Teyvat (Kategori Wilayah)
* **Pyro (Api / Natlan):** `#EF7938` (Vibrant) / `#FF9999` (Soft)
* **Hydro (Air / Fontaine):** `#4CC2F9` (Vibrant) / `#80C0FF` (Soft)
* **Anemo (Angin / Mondstadt):** `#48D9B4` (Vibrant) / `#80FFD7` (Soft)
* **Electro (Petir / Inazuma):** `#AF84FB` (Vibrant) / `#FFACFF` (Soft)
* **Dendro (Tumbuhan / Sumeru):** `#7AD43A` (Vibrant) / `#B2EA2A` (Soft)
* **Cryo (Es / Snezhnaya):** `#8FE4F2` (Vibrant) / `#99FFFF` (Soft)
* **Geo (Tanah / Liyue):** `#FAB632` (Vibrant) / `#FFE699` (Soft)

---

## 3. Karakteristik Visual & Pola UI/UX Genshin

### 1. Struktur Kartu "Two-Tone" (Rarity Top + Parchment Bottom)
* **Bagian Atas (Header Rarity):**
  * Menggunakan warna gradasi kelangkaan makanan (1-5 Star).
  * Di sudut kiri bawah header terdapat deretan bintang belah ketupat (`*`).
  * Ilustrasi makanan diletakkan menonjol (*overlapping*) ke arah kanan header.
  * Sudut atas melengkung (`borderTopLeftRadius: 12`, `borderTopRightRadius: 12`).
* **Bagian Bawah (Body Kertas Krem):**
  * Menggunakan warna `#E9E5DC`.
  * Memuat nama makanan (teks tebal `#1D1A2A`), efek buff statis, serta harga dalam satuan koin Mora.
  * Sudut bawah melengkung (`borderBottomLeftRadius: 16`, `borderBottomRightRadius: 16`).

### 2. Ornamen Belah Ketupat (4-Point Diamond / Rhombus)
* Lambang *diamond* (seperti bentuk Primogem dan bintang Teyvat) diaplikasikan secara konsisten pada:
  * Bentuk ikon bintang kelangkaan (bintang 4 sudut runcing, bukan bintang 5 sudut kartun).
  * *Bullet point* pada rincian efek makanan: `◆ Memulihkan 24% HP Maksimal`.
  * Hiasan tengah garis pemisah (*filigree divider*).

### 3. Gaya Tombol Aksi (Buttons)
* **Tombol Emas Utama (Pill Button):**
  * Bentuk: Kapsul memanjang penuh (`borderRadius: 9999`).
  * Latar: Gradasi krem keemasan (`#ECE5D8` menuju `#D3BC8E`).
  * Border: Garis emas tipis 1.5–2px (`#FFE7A5`).
  * Bayangan halus: *Soft golden glow effect*.
  * Teks: Kontras gelap `#3B4255` dengan font tebal (*bold*).
* **Tombol Sekunder (Dark Navy):**
  * Latar: `#312B47` dengan border tipis `#5D5187` dan teks putih krem `#E9E5DC`.

### 4. Rekomendasi Tipografi & Font
* **Font Asli In-Game:** `HYWenHei-85W` (Sans-serif tebal dengan terminal kurva lembut).
* **Font Alternatif Terbaik di React Native / Expo:**
  * **Poppins / Nunito:** Sangat identik dengan karakter teks antarmuka dan nama makanan.
  * **Cinzel:** Sangat mewah untuk judul besar aplikasi (misal: "TEYVAT DELICACIES").
  * **Inter / JetBrains Mono:** Untuk angka harga koin Mora dan kuantitas agar selalu rapi.

---

## 4. Implementasi Objek Style React Native (Design Tokens)

```typescript
export const GenshinColors = {
  // Latar Belakang & Kertas
  parchment: '#E9E5DC',
  parchmentLight: '#F5F2EB',
  surfaceDark: '#1D1A2A',
  modalDark: '#312B47',
  borderDark: '#5D5187',
  
  // Teks
  textDark: '#4A5366',
  textTitle: '#1D1A2A',
  textGold: '#D49F3D',
  
  // Aksen Emas & Bintang
  goldPrimary: '#D3BC8E',
  goldBorder: '#FFE7A5',
  starYellow: '#FFCC32',
  
  // Rarity Colors
  rarity1: '#818486',
  rarity2: '#5A977A',
  rarity3: '#5987AD',
  rarity4: '#9470BB',
  rarity5: '#C87C24',
};
```
