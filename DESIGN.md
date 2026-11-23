# DESIGN SYSTEM: TEYVAT DELICACIES (GENSHIN IMPACT DIEGETIC UI)

Dokumentasi spesifikasi desain antarmuka *Teyvat Delicacies* yang selaras dengan prinsip *Genshin Impact In-Game UI* dan buku saku *Adventurer Handbook*.

---

## 1. Filosofi & Palet Warna (Dominasi Perkamen Krem 70%)

Antarmuka **BUKAN** bertema SaaS *dark mode* hitam pekat, melainkan mengadopsi estetika manuskrip petualang kuno yang terang, hangat, dan berwibawa:

* **Warm Ivory Parchment (Latar Utama ~70%)**:
  * `#ECE5D8` — Warna dasar perkamen klasik buku petualang.
  * `#F8F5EE` / `#FAF8F2` — Permukaan kartu informasi hidangan & resep.
  * `#DFD7C7` — Garis pembatas dan *crease* lipatan kertas.
* **Brushed Antique Gold (Aksen, Border & Tombol ~20%)**:
  * `#C8A86B` / `#D3BC8E` — Lis bingkai emas khas Genshin.
  * `#FFE7A5` — Pendaran teks tombol primer dan bintang kelangkaan.
  * `#9C5A14` — Emas tua untuk label header kategori.
* **Obsidian & Deep Ink Typography (~10%)**:
  * `#242735` — Tinta teks utama (keterbacaan kontras tinggi di atas perkamen krem).
  * `#4A4F63` — Teks sekunder (deskripsi dan efek buff).
  * `#1B2234` — Header navigasi atas/bawah bertabur bintang halus.

---

## 2. Tipografi & Ikonografi Resmi

* **Font Utama**: *HYWenHei 85W* (`font-genshin`) untuk semua judul, harga, dan tombol aksi.
* **Font Sekunder**: Inter / system sans-serif untuk paragraf deskripsi panjang.
* **Mata Uang**: Koin Mora resmi (`assets/icons/mora.png`), angka tabular (`tabular-nums`).
* **Invarian Anti-Slop**: Dilarang menggunakan emoji Unicode standar. Menggunakan ornamen belah ketupat (`◆`), bintang vektor (`★`), dan cincin watermark Triquetra.

---

## 3. Komponen Utama

* **Spanduk Profil & Koleksi Namecard**: Spanduk lebar dengan sudut simetris rapi, dilengkapi modal kisi thumbnail kartu berilustrasi resmi.
* **Peta Pengantaran Teyvat**: Peta utuh beresolusi tinggi tanpa garis potong hitam, menghubungkan 8 wilayah Teyvat (Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya).
* **Pelacakan Kurir Glider**: Slider animasi kurir bersayap angin yang meluncur mulus dari Dapur Wanmin Liyue ke titik pendaratan tujuan.
* **Gerbang Celestia**: Pintu batu siang hari berlatar langit tak bertepi dengan tombol masuk minimalis dan efek cahaya *godray*.
