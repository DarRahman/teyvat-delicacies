# Catatan Evaluasi & Rencana Refinement Lanjutan (Teyvat Delicacies)

Dokumen catatan komprehensif mendokumentasikan analisis perbandingan antarmuka riil (HoYoLAB Battle Chronicle & Genshin Impact Mobile) dengan implementasi terkini, temuan kekurangan visual, perbaikan aset, dan spesifikasi prompt untuk Google AI Studio.

---

## 1. Analisis Komparasi Visual: Implementasi Saat Ini vs Standar Resmi HoYoLAB (Gambar 5)

Berdasarkan tangkapan layar akun in-game Genshin Impact AR 59 milik Badar di aplikasi resmi HoYoLAB (Gambar 5):

### A. Masalah Layar Utama "Dibungkus Kotak" (*Inset Container Trap*)
* **Masalah di Kode Saat Ini**:
  * Pada layar Beranda, Katalog, Pelacakan Glider, dan Profil, seluruh lembaran perkamen dimasukkan ke dalam container `px-2.5 pb-2` dengan `rounded-[24px]` di dalam kanvas hitam `#171421`.
  * Akibatnya, di layar smartphone fisik, aplikasi terlihat seperti "kotak kartu mengambang yang tercekik di tengah layar dengan margin hitam 10px di kiri, kanan, dan bawah", bukan antarmuka aplikasi mobile native yang leluasa.
* **Standar Resmi HoYoLAB & Genshin Mobile**:
  * Layar mobile wajib **Fullscreen / Edge-to-Edge** (`w-full` 100% lebar layar).
  * Latar belakang halaman mengalir utuh dari puncak layar hingga bilah navigasi bawah tanpa garis tepi ganda atau bingkai luar yang memotong.
  * Hanya kartu-kartu konten di dalamnya (seperti kartu pesanan, banner festival, kartu resep) yang memiliki margin samping standar (`px-4`) dan sudut membulat elegan (`rounded-2xl`).

### B. Masalah Kecerahan & Transparansi (*Atmospheric Translucency*)
* **Masalah di Kode Saat Ini**:
  * Warna latar belakang terasa terlalu gelap, pekat, dan monoton hitam legam (`#120F1D` / `#171421`).
* **Standar Resmi HoYoLAB & Genshin Mobile**:
  * Desain HoYoverse tidak pernah menggunakan warna hitam pekat mati. Latar belakang kanvas mengadopsi nuansa **Midnight Slate & Cosmic Indigo** (`#1E2333` hingga `#2A3246`) dengan pendaran bintang lembut atau kabut kosmik tipis.
  * Elemen navigasi atas (*top bar*) dan kartu status menggunakan teknik **Glassmorphism Transparan** (`backdrop-blur-md bg-[#1E2333]/70` dengan garis aksen emas tipis `#FFE7A5`/25).
  * Lembaran kartu data mengadopsi **Ivory Parchment Cream** (`#F7F4EE` / `#ECE5D8`) yang bersih, mewah, dan sangat kontras terbaca, dipadukan dengan tipografi tegas font Genshin (`HYWenHei 85W`).
  * Hasilnya: Tampilan terasa hidup, bercahaya, lapang, dan bernafas layaknya membuka aplikasi resmi HoYoLAB.

### C. Masalah Pelacakan Kurir Glider (*Order Tracking Bar & Icons - Gambar 3*)
* **Masalah di Kode Saat Ini**:
  * Bilah progres pengantaran kurir glider diatur persentasenya secara statis (`14%`, `54%`, `88%`), sehingga saat kurir selesai meluncur, bilah emas tidak pernah menyentuh tujuan akhir ("Inazuma") dan tampak terputus.
  * Ikon pusaran angin kurir melayang tidak pas di tengah garis lintasan, dan garis lintasannya berupa garis datar gelap tanpa penanda titik stasiun (*waypoint nodes*).
* **Standar Desain Rute Kurir Glider**:
  * Lintasan harus berupa garis 3 titik stasiun (*Waypoints*):
    1. **Titik 1 (Dapur Teyvat / Start - 0%)**: Ikon tungku api/dapur dengan indikator selesai.
    2. **Titik 2 (Kurir di Udara / Transit - 50%)**: Titik tengah di mana kurir glider meluncur dengan pendaran Anemo hijau-teal toska dan emas (`#56E2B6` & `#FFE7A5`).
    3. **Titik 3 (Tujuan Pengantaran / Destination - 100%)**: Pin teleport waypoint lokasi pesanan (misal: *Grand Narukami Shrine, Inazuma*).
  * Bilah emas bergerak proporsional dari 0% ke 50% hingga tepat menyentuh 100% di titik tujuan.

### D. Masalah Data & Gambar Makanan di Katalog
* **Apple Cider (3★)**: Saat ini masih menampilkan gambar apel buah mentah, harus diarahkan ke `assets/dishes/apple_cider.png` (botol cider kaca khas Mondstadt).
* **Blazed Meat Stew (4★ Natlan)**: Saat ini masih menampilkan gambar semangkuk ramen, harus diarahkan ke `assets/dishes/magmic_ode.png` (masakan daging berlumur bumbu api khas Natlan).
* **Rarity Cincin Bintang 1 dan 2**: Kartu hidangan kelangkaan 1★ dan 2★ masih polos, wajib dipasangi watermark cincin Triquetra `assets/icons/bg_1star.webp` dan `assets/icons/bg_2star.webp` (`opacity: 0.35, mixBlendMode: overlay`).

---

## 2. Status Aset Mutakhir yang Sudah Siap di Repositori

1. **Video Gerbang Celestia**:
   * `assets/video/celestia_door_open.mp4` (936 KB) & `celestia_door_open.webm` (475 KB).
   * 100% langit biru cerah siang hari penuh, pilar-pilar melayang, pembukaan daun pintu batu, dan ledakan cahaya putih suci (*celestial whiteout*) tepat di detik ke-2.5–3.0. Nol piksel hitam.
2. **Peta Teyvat HD Versi 7.2 (Natlan Update)**:
   * `assets/map/teyvat_world_map.webp` & `teyvat_world_map_hd.webp` (2048 × 2560 px, 417 KB).
   * Mencakup 7 bangsa lengkap: Natlan (5.0 & 5.2), Fontaine, Chenyu Vale, Sumeru (hutan & gurun), Inazuma, Liyue, dan Mondstadt.
3. **8 Koleksi Namecard Resmi**:
   * Tersimpan di `assets/namecards/` (Saurian Natlan, Fontaine, Zhongli, Raiden, Nahida, Furina, Mondstadt, Liyue).

---

## 3. Rumusan Konsep Desain Baru: "Teyvat Chronicle & Adventurer Feast"

Menggabungkan estetika **HoYoLAB Battle Chronicle** (Gambar 5) dengan **Diegetic Adventurer Handbook**:
1. **Layar Penuh (Edge-to-Edge Fullscreen)**: Mengalir bebas tanpa margin pembungkus samping.
2. **Hero Header Dinamis**: Banner latar belakang kosmik / namecard di puncak layar dengan kartu profil petualang Lumine melayang transparan.
3. **Kartu Konten Lembaran Gading Kuno (*Ivory Parchment*)**: Kartu-kartu menu, ringkasan pesanan, dan dompet Mora berlatar krem gading lembut `#F7F4EE` dengan garis batas emas tipis `#D3BC8E`.
4. **Sentuhan Akrilik Kaca Kosmik (*Cosmic Glassmorphism*)**: Bilah bawah navigasi dan panel status menggunakan latar belakang gelap transparan ber-blur (`backdrop-blur-md bg-[#1B2030]/80`), memberikan kesan modern, mewah, dan tidak mencekam.
