# Prompt Google AI Studio / Stitch: Redesain Antarmuka Fullscreen & Estetika HoYoLAB Chronicle

Salin teks prompt di bawah ini langsung ke dalam kolom instruksi **Google AI Studio / Stitch**. Prompt ini dirancang secara deskriptif mendalam untuk mengarahkan model menghadirkan antarmuka mobile layar penuh (*edge-to-edge*) yang bernafas, cerah elegan, dan transparan layaknya aplikasi resmi HoYoLAB dan Genshin Impact.

---

```markdown
Transformasikan antarmuka mobile "Teyvat Delicacies" agar mengadopsi estetika resmi modern HoYoLAB Battle Chronicle dan menu petualang in-game Genshin Impact dengan standar tata letak layar penuh (edge-to-edge), atmosfer kosmik transparan (tidak gelap pekat), dan penyelarasan komponen yang presisi:

1. Konsep Tata Letak Layar Penuh (True Edge-to-Edge Fullscreen Canvas):
- Hilangkan sepenuhnya struktur "konten dibungkus kotak mengambang" (outer inset border atau margin luar samping yang mencekik kanvas utama).
- Pada viewport smartphone, kanvas halaman wajib membentang penuh 100% dari tepi kiri ke kanan layar (full bleed) dan mengalir mulus dari puncak status bar hingga bilah navigasi bawah.
- Ruang bernafas diciptakan secara alami melalui padding horizontal internal di masing-masing modul kartu konten (standar px-4), bukan dengan mengecilkan wadah utama halaman.

2. Palet Warna & Transparansi Bernafas (Atmospheric Translucency ala HoYoLAB):
- Hindari warna hitam pekat mati. Kanvas utama menggunakan nuansa Midnight Slate dan Cosmic Indigo yang sejuk, lapang, dan bernafas (#1A1F2C hingga #1E2333) dengan pendaran bintang lembut di latar belakang.
- Bilah navigasi atas (Traveler Header) dan bilah navigasi bawah (4 Tab Navigasi) menerapkan efek akrilik kaca transparan (glassmorphism: backdrop-blur-md dengan latar semi-transparan rgba(28, 34, 52, 0.75) dan garis tepi emas tipis rgba(255, 231, 165, 0.25)).
- Permukaan kartu informasi (kartu hidangan dua warna, rincian pesanan, dan dompet petualang) menggunakan permukaan perkamen gading kuno (Ivory Parchment #F7F4EE / #ECE5D8) bergaris tepi emas tipis #D3BC8E, menghadirkan kontras tinggi yang sangat bersih dan mudah dibaca.

3. Penyelarasan Sistem Pelacakan Kurir Glider (OrderStatusScreen):
- Rancang ulang bilah progres pengantaran kurir glider agar selaras sempurna dari titik asal hingga tujuan akhir (3-Point Waypoint Expedition):
  * Titik 1 (Awal): Dapur Teyvat (0% progres) dengan ikon tungku persiapan.
  * Titik 2 (Tengah): Kurir Glider di Udara (50% progres) dengan kursor angin Anemo yang melayang presisi di tengah garis dan berpendar cahaya toska-emas (#56E2B6 dan #FFE7A5).
  * Titik 3 (Tujuan): Waypoint Teleportasi Wilayah Pemesan (100% progres, misal: Grand Narukami Shrine, Inazuma).
- Garis lintasan emas harus terhubung penuh dan menyentuh stasiun tujuan secara proporsional tanpa terpotong atau menyisakan celah kosong di ujung kanan.
- Bagian rincian pesanan kuliner di bawahnya menyatu dalam kartu perkamen gading edge-to-edge yang rapi.

4. Penyelarasan Aset Resmi & Kelengkapan Kartu Masakan:
- Pada hidangan "Apple Cider" (3★ Biru), gunakan aset botol minuman resmi (/assets/dishes/apple_cider.png), bukan buah apel mentah.
- Pada hidangan "Blazed Meat Stew" (4★ Ungu Natlan), gunakan aset masakan daging panggang berbumbu api khas Natlan (/assets/dishes/magmic_ode.png), bukan gambar ramen.
- Pada kartu masakan kelangkaan 1★ (Common) dan 2★ (Uncommon), sematkan watermark cincin Triquetra resmi (/assets/icons/bg_1star.webp dan /assets/icons/bg_2star.webp dengan opacity 0.35 dan mix-blend-mode overlay) agar memiliki hierarki cincin yang seragam dengan bintang 3★, 4★, dan 5★.
- Pada profil petualang (ProfileScreen), pasangkan banner Namecard horizontal Saurian Natlan (/assets/namecards/natlan_saurian_bg.png) dengan lencana statistik petualang melayang transparan di atasnya.
- Tetap patuhi aturan anti-slop: Dilarang keras menggunakan emoji Unicode bawaan sistem operasi; seluruh angka memakai format monospace tabular-nums dan mata uang menggunakan ikon resmi koin Mora.
```
