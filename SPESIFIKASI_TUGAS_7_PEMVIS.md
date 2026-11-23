# Spesifikasi & Ketentuan Tugas Pemrograman Visual I (Pertemuan 7)

- **Mata Kuliah:** Pemrograman Visual I * (`TI361`)
- **Program Studi:** S1 Teknik Informatika (Kelas TI-1 Semester 5) - STIKOM Poltek Cirebon
- **Dosen Pengampu:** Rifky Hilmanudin, S.Kom., M.Kom.
- **Batas Waktu (Deadline):** Sabtu, 28 November 2026
- **Status di SIAKAD:** `Upload` (Belum Dikumpulkan)
- **Tautan Berkas Soal Resmi:** `https://drive.google.com/file/d/1F8EEQpSWbkjrzwfZXL0vmRQEwzIBYN4f/view?usp=sharing`

---

## - 4 Butir Soal Resmi (Sama Persis Dokumen Dosen)

1. **Soal 1 (Teori Navigasi):**
   Jelaskan pengertian navigasi pada aplikasi mobile. Mengapa aplikasi React Native membutuhkan sistem navigasi? Jelaskan fungsi Stack, Tab, dan Drawer Navigator serta berikan contoh penerapannya dalam sebuah aplikasi mobile.

2. **Soal 2 (React Navigation vs Expo Router):**
   Jelaskan perbedaan React Navigation dan Expo Router dari segi pendekatan navigasi, pendefinisian rute, struktur file, serta cara berpindah halaman. Mengapa Expo Router disebut menggunakan pendekatan file-based routing?

3. **Soal 3 (Struktur File Expo Router):**
   Jelaskan fungsi folder `app/`, file `_layout.tsx`, `index.tsx`, serta file halaman lainnya dalam Expo Router. Bagaimana struktur folder dan file dapat menentukan rute yang digunakan untuk mengakses halaman aplikasi?

4. **Soal 4 (Praktik Aplikasi Mobile):**
   Buatlah sebuah aplikasi katalog dan pemesanan makanan menggunakan React Native dan Expo Router. Aplikasi ini digunakan untuk membantu pengguna melihat daftar makanan, mencari makanan, melihat detail makanan, serta melakukan simulasi pemesanan makanan.

---

## [Screen] Ketentuan Fitur Aplikasi (Soal 4)

Aplikasi yang dibuat wajib memiliki 6 fitur fungsional utama:

### 1. Halaman Beranda
* Menampilkan nama aplikasi dan informasi singkat.
* Menampilkan minimal 5 rekomendasi makanan.
* Menampilkan kategori makanan: **Makanan Utama**, **Minuman**, dan **Snack**.
* Menampilkan informasi nama makanan, harga, dan gambar.
* Pengguna dapat memilih makanan untuk melihat halaman detail makanan.

### 2. Halaman Katalog Makanan
* Menampilkan minimal 10 data makanan.
* Setiap makanan memiliki informasi: nama, kategori, harga, deskripsi, dan gambar.
* Menggunakan komponen **`FlatList`** untuk menampilkan daftar makanan.
* Pengguna dapat mencari makanan berdasarkan nama (*Search Bar*).
* Pengguna dapat memilih makanan untuk membuka halaman detail.

### 3. Halaman Detail Makanan
* Menampilkan informasi detail makanan yang dipilih.
* Menampilkan gambar, nama makanan, kategori, harga, dan deskripsi lengkap.
* Menampilkan tombol untuk menambahkan makanan ke keranjang (*Add to Cart*).
* Menerima parameter makanan yang dikirim dari halaman katalog atau beranda.

### 4. Halaman Keranjang (*Cart*)
* Menampilkan daftar makanan yang telah ditambahkan.
* Menampilkan nama makanan, harga, jumlah (*qty*), dan subtotal.
* Pengguna dapat menambah (`+`) atau mengurangi (`-`) jumlah makanan.
* Menampilkan total harga seluruh pesanan.
* Pengguna dapat menghapus makanan dari keranjang.

### 5. Halaman Profil
* Menampilkan informasi profil pengguna: nama, email, dan informasi singkat.
* Menampilkan menu pengaturan sederhana atau informasi aplikasi.

### 6. Simulasi Checkout
* Menampilkan ringkasan pesanan dan total harga pesanan.
* Menyediakan tombol checkout.
* Setelah checkout, tampilkan pesan/konfirmasi bahwa pesanan berhasil dibuat.

---

## [Fitur] Ketentuan Teknis Expo Router

1. **File-Based Routing:**
   * Seluruh rute halaman dibuat di dalam folder `app/`.
   * Menggunakan `index.tsx` sebagai halaman utama rute.
2. **Bottom Tab Navigation:**
   * 4 Menu Tab Utama: **Beranda**, **Katalog**, **Keranjang**, dan **Profil**.
3. **Stack Navigation & Nested Routing:**
   * Navigasi bertingkat dari Katalog $\to$ Detail Makanan $\to$ Checkout / Konfirmasi Pesanan.
4. **Navigasi & Parameter:**
   * Berpindah menggunakan `router.push()` atau `<Link>`.
   * Mengirim dan membaca parameter ID makanan di halaman detail.
   * Kembali dengan `router.back()`.

---

## [Export] Ketentuan Pengumpulan & Penilaian

1. Screenshot *source code* project React Native.
2. Screenshot halaman aplikasi yang berjalan.
3. Link repositori GitHub (bersifat opsional, namun **mendapat poin nilai tambahan**).
