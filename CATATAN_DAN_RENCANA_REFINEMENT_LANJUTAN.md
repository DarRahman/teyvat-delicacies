# Catatan Diskusi & Evaluasi Refinement Visual (Teyvat Delicacies)

Dokumen pencatatan komprehensif seluruh evaluasi visual, perbaikan aset, dan panduan arahan desain untuk Google AI Studio.

---

## 1. Evaluasi & Root Cause Masalah Desain Terakhir (Commit `ed21ce4`)

Berdasarkan pengujian langsung di layar smartphone dan inspeksi tangkapan layar in-game Genshin Impact:
1. **Warna Dominan Terlalu Gelap (Hilang Estetika Genshin)**:
   - AI Studio mengubah latar belakang menjadi hitam pekat (`#120F1D` / `#171421`) yang menyesakkan dan menyerupai template SaaS gelap standar.
   - **Solusi**: Mengembalikan dominasi perkamen krem hangat (*warm ivory cream* `#ECE5D8` / `#F8F5EE`) dengan border emas antik (`#C8A86B` / `#D3BC8E`), sesuai identitas visual buku saku *Adventurer Handbook* dan *Character Showcase* resmi.
2. **Peta Teyvat Terpotong Garis Hitam ("Belah-Belah")**:
   - Skrip jahitan tile sebelumnya menyisakan tile laut yang hilang (404/unmapped) dengan warna hitam solid, dan rentang koordinat vertikal memanjang hingga area kosong.
   - **Solusi**: Seluruh tile telah diperbaiki, area laut diisi dengan gradasi biru laut Teyvat yang mulus tanpa jahitan (*seamless azure ocean*), dan di-push ke `assets/map/teyvat_world_map.webp` (Commit `9cea06e`). Cakupan mencakup 8 wilayah Teyvat (Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya).
3. **Gerbang Masuk Celestia Terlalu Ribet & Video Patah**:
   - Pemutar video menghasilkan kotak hitam (*letterboxing*) dan memunculkan tombol teknis kaku ("Masuk tanpa musik latar").
   - **Solusi**: Menghapus pemutar video sepenuhnya. Menggunakan latar belakang gambar pintu langit siang hari HD 1080p (`genshin_celestia_login_door_1080p.webp`) yang bersih, dengan tombol minimalis bercahaya "Ketuk untuk Memulai" / "CLICK TO BEGIN" serta transisi pendaran cahaya putih (*godray bloom*).
4. **Namecard Modal & Spanduk Profil**:
   - Spanduk aktif di bagian atas memiliki kelengkungan asimetris aneh di sudut kanan bawah.
   - Modal opsi Namecard hanya berupa tombol teks polos tanpa gambar kartu.
   - Tertera kata-kata meta teknis seperti *"HoYoLAB Battle Chronicle"*.
   - **Solusi**: Menyamakan kelengkungan sudut spanduk secara simetris, menampilkan kisi thumbnail kartu visual resmi (`assets/namecards/*_icon.png`), dan membuang semua teks meta teknis agar 100% bercerita dari sudut pandang dunia game Teyvat.
5. **Pelacakan Kurir Glider Berubah Menjadi Titik Poin Statis**:
   - AI Studio mereduksi slider lintasan dinamis menjadi 3 titik poin statis.
   - **Solusi**: Mengembalikan slider lintasan terbang horizontal yang bergerak mulus di sepanjang hembusan angin Anemo emas dari Dapur Wanmin Liyue ke titik pendaratan tujuan.

---

## 2. Status Aset Terkini di Repositori (`assets/`)

* **Peta Teyvat Utuh & Mulus**: `assets/map/teyvat_world_map.webp` (8 wilayah, tanpa garis hitam).
* **Pintu Masuk Celestia 1080p**: `assets/backgrounds/genshin_celestia_login_door_1080p.webp`.
* **Koleksi 8 Namecard Resmi**: `assets/namecards/` (Natlan, Fontaine, Zhongli, Raiden, Nahida, Furina, Mondstadt, Liyue).
* **16 Hidangan & Minuman Resmi Transparan**: `assets/dishes/` (termasuk *Apple Cider* botol kaca dan *Blazed Meat Stew* daging panggang Natlan).
* **Ikon Mata Uang & Rarity Resmi**: `assets/icons/mora.png`, `primogem.png`, `bg_1star.webp` s/d `bg_5star.webp`.
