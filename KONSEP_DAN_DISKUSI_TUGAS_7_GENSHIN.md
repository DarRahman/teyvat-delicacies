# Konsep & Desain Tugas 7: Aplikasi Pemesanan Kuliner Teyvat (Genshin Impact Theme)

* **Mata Kuliah**: Pemrograman Visual I (`TI361`)
* **Dosen Pengampu**: Rifky Hilmanudin, S.Kom., M.Kom.
* **Mahasiswa**: Badar Rahman (NIM `14524303`, Kelas `TI-1`, Semester 5)
* **Deadline SIAKAD**: Sabtu, 28 November 2026, 23:59 WIB
* **Status**: Tahap Diskusi & Perancangan Konsep UI/UX (Belum Mulai Koding Sesuai Permintaan)

---

## 1. Latar Belakang & Inspirasi Desain
Tugas 7 mewajibkan pembuatan aplikasi mobile katalog dan pemesanan makanan (*Food Delivery & Catalog*) menggunakan React Native dan Expo Router.

Untuk menghasilkan tampilan yang unik, artistik, dan bernilai tinggi dibandingkan desain template biasa, konsep aplikasi ini mengadopsi tema **Kuliner Dunia Teyvat (Genshin Impact)**:
* **Nama Konsep Aplikasi**: *Good Hunter Express* / *Teyvat Delicacies Delivery* / *Wanmin Express*.
* **Referensi Wiki Kuliner**: [Food | Genshin Impact Wiki | Fandom](https://genshin-impact.fandom.com/wiki/Food).
* **Mata Uang**: Mora ( Mora) alih-alih Rupiah biasa.

---

## 2. Analisis UI/UX: Referensi Delivery vs Genshin Visual Language

| Elemen Desain | Referensi Delivery Biasa (Fast Food) | Desain Teyvat Delicacies (Genshin Theme) |
| :--- | :--- | :--- |
| **Palet Warna Utama** | Merah menyala fast-food (`#E53935`), oranye terang (`#FF7043`), putih polos. | Emas Mewah Teyvat (`#E4B869`), Dark Obsidian Navy (`#1C2230`), Parchment Slate (`#252F42`), Aksen Merah Crimson (`#D85842`). |
| **Tipografi & Karakter** | Font sans-serif tebal modern standar. | Font bergaya serif/fantasy elegan dengan tracking proporsional (serupa tipografi Hoyoverse). |
| **Bentuk Komponen** | Rounded card generik dengan bayangan standar. | Kartu dengan sudut bersegi khas bingkai artefak Teyvat, border tipis aksen emas, serta background berpendar lembut sesuai tier bintang. |
| **Hierarki Kategori** | Burger, Pizza, Minuman, Dessert. | Makanan Pemulih HP, Penambah ATK, Penambah DEF, Penambah Stamina, atau berdasarkan Wilayah Asal (*Mondstadt, Liyue, Inazuma, Fontaine*). |
| **Indikator Kualitas** | Diskon % dan bintang rating toko (4.5*). | Tingkat Kelangkaan Masakan (*1* Common hingga 5* Legendary*), lengkap dengan efek buff karakter. |

---

## 3. Spesifikasi 4 Layar Utama (Sesuai Ketentuan Dosen)

### A. Layar 1: Katalog Menu Utama (`app/(tabs)/index.tsx`)
1. **Header Eksklusif**:
   * Menampilkan profil Traveler (Badar Rahman - AR 60) dan saldo koin Mora ( Mora 1.452.430 Mora).
   * Bilah pencarian makanan (*Search by dish name or buff type*).
2. **Kategori Filter Tab**:
   * *All Dishes*, *Mondstadt Specialties*, *Liyue Flavors*, *Inazuma Delicacies*, *Fontaine Cuisine*.
3. **Banner Promo Khusus**:
   * Diskon festival "Windblume Feast" atau "Lantern Rite Special Delivery".
4. **Grid/List Makanan Terpopuler**:
   * Kartu masakan dengan gambar berkualitas tinggi, rating bintang kelangkaan (*), nama menu, dan harga dalam Mora.

### B. Layar 2: Detail Makanan (`app/dish/[id].tsx`)
1. **Hero Image Visual**:
   * Tampilan besar ilustrasi masakan dengan latar partikel elemen sesuai daerah asal.
2. **Badge Kualitas & Info Buff**:
   * Label tingkat kelangkaan (misal: ***** Legendary).
   * Efek konsumsi: "Meningkatkan ATK seluruh anggota tim sebesar 372 poin dan CRIT Rate sebesar 12% selama 300 detik."
3. **Daftar Resep & Bahan Baku (*Ingredients*)**:
   * Menampilkan ikon bahan: Daging Unggas (*Fowl*), Jamur Liar (*Mushroom*), Ham, Udang, dll.
4. **Selector Kuantitas & Tombol Aksi**:
   * Tombol `+` / `-` untuk menentukan jumlah pesanan.
   * Tombol melayang emas: "Tambah ke Keranjang Pesanan (Add to Order)".

### C. Layar 3: Keranjang Belanja (`app/(tabs)/cart.tsx`)
1. **Daftar Item Pesanan**:
   * Menampilkan setiap menu yang dipilih, opsi porsi (Delicious / Normal / Suspicious jika ingin variasi humor game), harga satuan Mora, dan subtotal.
2. **Kontrol Interaktif**:
   * Tambah/kurang jumlah pesanan secara langsung di keranjang atau hapus item.
3. **Kupon Diskon Teyvat**:
   * Input kode kupon (misal: `PAIMONHUNGRY` untuk potongan biaya antar).
4. **Ringkasan Kalkulasi**:
   * Subtotal biaya makanan.
   * Ongkir kurir (*Hilichurl Express Courier* atau *Delivery Amber*).
   * Total akhir dalam satuan Mora.

### D. Layar 4: Checkout & Ringkasan Pesanan (`app/checkout.tsx`)
1. **Alamat Pengantaran**:
   * Opsi lokasi: *Knights of Favonius HQ, Mondstadt*, *Wanmin Restaurant Terrace, Liyue Harbor*, atau alamat kost kampus Cirebon.
2. **Metode Pembayaran**:
   * Northland Bank Credit Card, Mora Cash on Delivery, atau Gnosis Transfer.
3. **Rincian Pesanan Final**:
   * Ringkasan barang yang dibeli dan estimasi waktu kurir tiba (misal: "15 Menit via Glider Courier").
4. **Tombol Konfirmasi**:
   * Tombol "Kirim Pesanan Sekarang (Place Order)".
   * Muncul modal/halaman konfirmasi sukses dengan efek suara atau animasi khas Genshin *Quest Complete*.

---

## 4. Rencana Dataset Mock Makanan (10+ Item)

```json
[
  {
    "id": "1",
    "name": "Adeptus' Temptation",
    "region": "Liyue",
    "rarity": 5,
    "category": "Makanan Utama",
    "price": 12500,
    "buff": "Meningkatkan ATK tim sebesar 372 dan CRIT Rate 12% selama 300 detik",
    "ingredients": ["Ham", "Crab", "Shrimp Meat", "Matsutake"],
    "description": "Mahakarya kuliner Liyue yang aromanya konon dapat menggoda para Adeptus untuk turun dari alam kayangan."
  },
  {
    "id": "2",
    "name": "Sweet Madame",
    "region": "Mondstadt",
    "rarity": 2,
    "category": "Makanan Utama",
    "price": 950,
    "buff": "Memulihkan 24% HP Maksimal karakter ditambah 1.500 HP instan",
    "ingredients": ["Fowl", "Sweet Flower"],
    "description": "Ayam panggang manis madu yang sangat empuk, menjadi menu andalan para petualang Mondstadt."
  },
  {
    "id": "3",
    "name": "Mondstadt Hash Brown",
    "region": "Mondstadt",
    "rarity": 3,
    "category": "Snack",
    "price": 2400,
    "buff": "Memulihkan 34% HP Maksimal karakter ditambah 1.900 HP",
    "ingredients": ["Pinecone", "Potato", "Jam"],
    "description": "Kroket kentang renyah berbentuk daun pinus dengan olesan selai manis yang disukai segala usia."
  },
  {
    "id": "4",
    "name": "Mora Meat",
    "region": "Liyue",
    "rarity": 1,
    "category": "Snack",
    "price": 500,
    "buff": "Membangkitkan karakter yang gugur dan memulihkan 150 HP",
    "ingredients": ["Raw Meat", "Flour"],
    "description": "Roti pipih gurih berisi cincangan daging berbumbu, bentuknya menyerupai koin Mora pembawa berkah."
  },
  {
    "id": "5",
    "name": "Dango Milk",
    "region": "Inazuma",
    "rarity": 2,
    "category": "Minuman",
    "price": 1200,
    "buff": "Minuman manis creamy pelepas dahaga favorit Raiden Shogun",
    "ingredients": ["Milk", "Dango"],
    "description": "Kombinasi unik antara susu segar dan bola ketan manis dango yang kenyal dan lezat."
  },
  {
    "id": "6",
    "name": "Wolfhook Juice",
    "region": "Mondstadt",
    "rarity": 2,
    "category": "Minuman",
    "price": 1500,
    "buff": "Meningkatkan ketahanan stamina dan kesegaran tubuh",
    "ingredients": ["Wolfhook", "Sunsetia"],
    "description": "Jus buah liar ungu dari Wolvendom yang manis dengan sedikit sentuhan rasa asam menyegarkan."
  },
  {
    "id": "7",
    "name": "Golden Shrimp Balls",
    "region": "Liyue",
    "rarity": 3,
    "category": "Snack",
    "price": 4500,
    "buff": "Membangkitkan karakter dan memulihkan 1.200 HP",
    "ingredients": ["Shrimp Meat", "Potato", "Flour"],
    "description": "Bola udang goreng dibalut helaian kentang keemasan yang sangat renyah di luar dan lembut di dalam."
  },
  {
    "id": "8",
    "name": "Barbatos Ratatouille",
    "region": "Mondstadt",
    "rarity": 3,
    "category": "Makanan Utama",
    "price": 3800,
    "buff": "Mengurangi konsumsi stamina saat berlari dan meluncur sebesar 25% selama 900 detik",
    "ingredients": ["Carrot", "Potato", "Onion"],
    "description": "Sup sayuran hangat berkuah gurih khas perbukitan Mondstadt yang memberi energi berlimpah."
  }
]
```

---

## 5. Status & Tahap Selanjutnya
* Dokumen spesifikasi teknis dan analisis UI/UX telah siap.
* Menunggu aba-aba resmi dari Badar sebelum membuat repositori atau memulai pengodean di React Native & Expo Router.
