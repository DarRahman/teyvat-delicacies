import os
import win32com.client
import docx
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def build_tugas_7_document():
    doc = docx.Document()

    # 1. Setup Halaman A4 Sesuai Format Lurus STIKOM Poltek Cirebon
    for s in doc.sections:
        s.page_width = Cm(21.0)
        s.page_height = Cm(29.7)
        s.top_margin = Cm(2.54)
        s.bottom_margin = Cm(2.54)
        s.left_margin = Cm(2.54)
        s.right_margin = Cm(2.54)

    # 2. Setup Normal Style (Times New Roman 12pt, 1.5 Spacing, Justify)
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.5
    normal_style.paragraph_format.space_after = Pt(6)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # 3. Setup Numbering Definition di Word (1 abstractNum, 1 numId)
    numbering_part = doc.part.numbering_part
    numbering_elm = numbering_part._element

    abstract_num_id = 101
    num_id = 101

    abstract_num = OxmlElement('w:abstractNum')
    abstract_num.set(qn('w:abstractNumId'), str(abstract_num_id))

    lvl = OxmlElement('w:lvl')
    lvl.set(qn('w:ilvl'), '0')

    start = OxmlElement('w:start')
    start.set(qn('w:val'), '1')
    lvl.append(start)

    num_fmt = OxmlElement('w:numFmt')
    num_fmt.set(qn('w:val'), 'decimal')
    lvl.append(num_fmt)

    lvl_text = OxmlElement('w:lvlText')
    lvl_text.set(qn('w:val'), '%1.')
    lvl.append(lvl_text)

    lvl_jc = OxmlElement('w:lvlJc')
    lvl_jc.set(qn('w:val'), 'left')
    lvl.append(lvl_jc)

    pPr = OxmlElement('w:pPr')
    tabs = OxmlElement('w:tabs')
    tab = OxmlElement('w:tab')
    tab.set(qn('w:val'), 'num')
    tab.set(qn('w:pos'), '360')
    tabs.append(tab)
    pPr.append(tabs)

    ind = OxmlElement('w:ind')
    ind.set(qn('w:left'), '360')
    ind.set(qn('w:hanging'), '360')
    pPr.append(ind)
    lvl.append(pPr)

    abstract_num.append(lvl)
    numbering_elm.append(abstract_num)

    num_elm = OxmlElement('w:num')
    num_elm.set(qn('w:numId'), str(num_id))
    abs_ref = OxmlElement('w:abstractNumId')
    abs_ref.set(qn('w:val'), str(abstract_num_id))
    num_elm.append(abs_ref)
    numbering_elm.append(num_elm)

    # 4. Header metadata identitas Badar Rahman persis Tugas 1 - 5
    headers = [
        ('Nama', 'Badar Rahman'),
        ('Nim', '14524303'),
        ('Kelas', 'TI'),
        ('Semester', '5'),
        ('Matkul', 'Pemrograman Visual'),
        ('Tugas', '7'),
    ]

    for label, val in headers:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.tab_stops.add_tab_stop(Cm(3.0))
        p.add_run(f'{label}\t: {val}')

    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_after = Pt(12)

    # Helper untuk format soal, tautan, dan konten jawaban
    def add_hyperlink(paragraph, url, text, color='0563C1', underline=True):
        part = paragraph.part
        r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
        hyperlink = OxmlElement('w:hyperlink')
        hyperlink.set(qn('r:id'), r_id)
        new_run = OxmlElement('w:r')
        rPr = OxmlElement('w:rPr')
        if color:
            c = OxmlElement('w:color')
            c.set(qn('w:val'), color)
            rPr.append(c)
        if underline:
            u = OxmlElement('w:u')
            u.set(qn('w:val'), 'single')
            rPr.append(u)
        r_font = OxmlElement('w:rFonts')
        r_font.set(qn('w:ascii'), 'Times New Roman')
        r_font.set(qn('w:hAnsi'), 'Times New Roman')
        rPr.append(r_font)
        sz = OxmlElement('w:sz')
        sz.set(qn('w:val'), '24')
        rPr.append(sz)
        new_run.append(rPr)
        new_run.text = text
        hyperlink.append(new_run)
        paragraph._p.append(hyperlink)
        return hyperlink

    def add_qa(q_text, answers_blocks):
        q_lines = q_text.split('\n')

        pq = doc.add_paragraph()
        pq.paragraph_format.line_spacing = 1.5
        pq.paragraph_format.space_after = Pt(2) if len(q_lines) > 1 else Pt(4)
        pq.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

        pq_pr = pq._p.get_or_add_pPr()
        num_pr = OxmlElement('w:numPr')
        ilvl_el = OxmlElement('w:ilvl')
        ilvl_el.set(qn('w:val'), '0')
        num_id_el = OxmlElement('w:numId')
        num_id_el.set(qn('w:val'), str(num_id))
        num_pr.append(ilvl_el)
        num_pr.append(num_id_el)
        pq_pr.append(num_pr)

        pq.add_run(q_lines[0].strip())

        for line in q_lines[1:]:
            p_line = doc.add_paragraph()
            p_line.paragraph_format.line_spacing = 1.5
            p_line.paragraph_format.space_before = Pt(0)
            p_line.paragraph_format.space_after = Pt(2)
            p_line.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p_line.paragraph_format.left_indent = Cm(0.63)
            p_line.add_run(line.strip())

        pj = doc.add_paragraph()
        pj.paragraph_format.line_spacing = 1.5
        pj.paragraph_format.space_before = Pt(4)
        pj.paragraph_format.space_after = Pt(4)
        pj.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
        pj.add_run('Jawab :')

        for item in answers_blocks:
            if isinstance(item, str):
                pa = doc.add_paragraph()
                pa.paragraph_format.line_spacing = 1.5
                pa.paragraph_format.space_before = Pt(0)
                pa.paragraph_format.space_after = Pt(6)
                pa.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                pa.add_run(item)
            elif isinstance(item, tuple) and item[0] == 'bullet':
                pb = doc.add_paragraph()
                pb.paragraph_format.line_spacing = 1.5
                pb.paragraph_format.space_before = Pt(0)
                pb.paragraph_format.space_after = Pt(4)
                pb.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                pb.paragraph_format.left_indent = Cm(0.63)
                pb.add_run('•  ' + item[1])
            elif isinstance(item, tuple) and item[0] == 'bullet_link':
                prefix = item[1]
                url = item[2]
                link_text = item[3]
                pb = doc.add_paragraph()
                pb.paragraph_format.line_spacing = 1.5
                pb.paragraph_format.space_before = Pt(0)
                pb.paragraph_format.space_after = Pt(4)
                pb.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                pb.paragraph_format.left_indent = Cm(0.63)
                pb.add_run('•  ' + prefix)
                add_hyperlink(pb, url, link_text, color='0563C1', underline=True)
            elif isinstance(item, tuple) and item[0] == 'sub_item':
                title = item[1]
                contents = item[2] if isinstance(item[2], list) else [item[2]]

                pt = doc.add_paragraph()
                pt.paragraph_format.line_spacing = 1.5
                pt.paragraph_format.space_before = Pt(6)
                pt.paragraph_format.space_after = Pt(2)
                pt.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
                pt.paragraph_format.left_indent = Cm(0.63)
                r_title = pt.add_run(title)
                r_title.bold = True

                for c in contents:
                    pc_sub = doc.add_paragraph()
                    pc_sub.paragraph_format.line_spacing = 1.5
                    pc_sub.paragraph_format.space_before = Pt(0)
                    pc_sub.paragraph_format.space_after = Pt(4)
                    pc_sub.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                    pc_sub.paragraph_format.left_indent = Cm(0.63)
                    pc_sub.add_run(c)
            elif isinstance(item, tuple) and item[0] == 'code':
                code_text = item[1]
                pc = doc.add_paragraph()
                pc.paragraph_format.line_spacing = 1.15
                pc.paragraph_format.space_before = Pt(0)
                pc.paragraph_format.space_after = Pt(6)
                pc.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
                run = pc.add_run(code_text.strip())
                run.font.name = 'Consolas'
                run.font.size = Pt(9.5)
            elif isinstance(item, tuple) and item[0] == 'image_pair':
                left_info = item[1]
                right_info = item[2]

                table = doc.add_table(rows=1, cols=2)
                tblPr = table._tbl.tblPr
                tblBorders = OxmlElement('w:tblBorders')
                for b in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
                    border = OxmlElement(f'w:{b}')
                    border.set(qn('w:val'), 'none')
                    tblBorders.append(border)
                tblPr.append(tblBorders)

                for col_idx, (path, cap, dim_type, dim_val) in enumerate([left_info, right_info]):
                    cell = table.cell(0, col_idx)
                    cell.width = Cm(7.9)

                    p_img = cell.paragraphs[0]
                    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_img.paragraph_format.space_before = Pt(2)
                    p_img.paragraph_format.space_after = Pt(2)
                    r_img = p_img.add_run()

                    if os.path.exists(path):
                        if dim_type == 'width':
                            r_img.add_picture(path, width=dim_val)
                        else:
                            r_img.add_picture(path, height=dim_val)
                    else:
                        r_img.text = f'[{os.path.basename(path)} - Siapkan berkas screenshot]'

                    p_cap = cell.add_paragraph()
                    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_cap.paragraph_format.space_before = Pt(2)
                    p_cap.paragraph_format.space_after = Pt(6)
                    r_cap = p_cap.add_run(cap)
                    r_cap.font.name = 'Times New Roman'
                    r_cap.font.size = Pt(10)
                    r_cap.italic = True

                p_after = doc.add_paragraph()
                p_after.paragraph_format.space_before = Pt(0)
                p_after.paragraph_format.space_after = Pt(4)

    # --- SOAL 1 ---
    q1 = ("Jelaskan pengertian navigasi pada aplikasi mobile. Mengapa aplikasi React Native membutuhkan sistem navigasi? "
          "Jelaskan fungsi Stack, Tab, dan Drawer Navigator serta berikan contoh penerapannya dalam sebuah aplikasi mobile.")
    a1 = [
        "Navigasi pada aplikasi mobile merupakan mekanisme arsitektural yang mengatur perpindahan visual antarmuka pengguna (user interface) dari satu layar (screen) ke layar lainnya, sekaligus mengelola riwayat tumpukan halaman (navigation stack) secara terstruktur. Navigasi menentukan bagaimana pengguna menjelajahi fungsionalitas aplikasi, kembali ke layar sebelumnya, serta bagaimana data konteks diteruskan antarhalaman.",
        "Aplikasi React Native membutuhkan sistem navigasi karena arsitektur mobile native tidak memiliki antarmuka bilah alamat URL bawaan (address bar) maupun tombol riwayat peramban fisik (browser back/forward buttons) layaknya aplikasi web konvensional. Seluruh rendering komponen antarmuka React Native beroperasi di atas sebuah root container tunggal (Single Page Architecture). Oleh karena itu, diperlukan pustaka sistem navigasi khusus untuk mengelola status riwayat rute di memori (in-memory state management), menangani transisi animasi antarlayar (seperti slide horizontal atau modal slide-up), serta merespons tombol fisik 'Back' pada perangkat Android maupun gesture geser tepi layar (edge swipe) pada iOS.",
        "Fungsi dan karakteristik ketiga jenis navigator utama dalam aplikasi mobile meliputi:",
        ("sub_item", "a. Stack Navigator", [
            "Fungsi: Mengelola tumpukan layar dengan mekanisme Last In, First Out (LIFO). Ketika pengguna berpindah ke layar baru, layar tersebut ditumpuk di atas layar aktif sebelumnya. Ketika pengguna menekan tombol kembali, layar teratas dilepas (pop) dari memori sehingga layar sebelumnya kembali terlihat tanpa kehilangan status formulir.",
            "Contoh Penerapan: Alur transaksi pemesanan kuliner pada aplikasi Teyvat Delicacies: dari layar Beranda/Katalog (Bottom Sheet) -> menekan kartu masakan untuk membuka layar Detail Masakan (app/dish/[id]) -> menekan tombol 'Pesan Sekarang' untuk membuka Formulir Checkout (app/checkout) -> hingga layar Pelacakan Kurir (app/order/[id])."
        ]),
        ("sub_item", "b. Tab Navigator", [
            "Fungsi: Menyediakan bilah menu navigasi tetap (biasanya di bagian bawah layar atau bottom navigation bar) yang memungkinkan pengguna berpindah secara instan di antara menu-menu utama aplikasi hanya dengan satu ketukan jari. Masing-masing tab mempertahankan status internalnya secara mandiri.",
            "Contoh Penerapan: 4 bilah navigasi utama pada aplikasi Teyvat Delicacies di direktori app/(tabs)/ yang terdiri dari Tab Beranda (index.tsx), Tab Katalog Hidangan (catalog.tsx), Tab Keranjang Belanja (cart.tsx), dan Tab Profil Petualang (profile.tsx)."
        ]),
        ("sub_item", "c. Drawer Navigator", [
            "Fungsi: Menyediakan panel menu navigasi tersembunyi yang dapat ditarik keluar dari sisi samping layar (slide-out drawer) dengan menggeser jari dari tepi layar atau menekan ikon menu hamburger di pojok atas. Sangat efektif untuk aplikasi yang memiliki puluhan sub-fitur tanpa mengorbankan ruang vertikal layar utama.",
            "Contoh Penerapan: Menu laci samping pada aplikasi email (seperti Gmail untuk berpindah folder Kotak Masuk, Terkirim, Draf, Sampah, dan Pengaturan Akun) atau aplikasi perbankan mobile untuk mengakses riwayat mutasi, mutasi rekening, dan layanan nasabah."
        ])
    ]
    add_qa(q1, a1)

    # --- SOAL 2 ---
    q2 = ("Jelaskan perbedaan React Navigation dan Expo Router dari segi pendekatan navigasi, pendefinisian rute, "
          "struktur file, serta cara berpindah halaman. Mengapa Expo Router disebut menggunakan pendekatan file-based routing?")
    a2 = [
        "Perbedaan mendasar antara React Navigation konvensional dan Expo Router modern mencakup empat dimensi utama:",
        ("sub_item", "a. Pendekatan Navigasi (Navigation Approach)", [
            "React Navigation menggunakan pendekatan konfigurasi imperatif berbasis komponen React murni. Seluruh hierarki rute harus dirakit manual menggunakan pembungkus <NavigationContainer>, <Stack.Navigator>, dan <Tab.Navigator>.",
            "Expo Router mengadopsi pendekatan deklaratif berbasis berkas (File-Based Routing) yang dibangun di atas fondasi React Navigation. Expo Router menyatukan paradigma perutean aplikasi seluler dengan standar konvensi web modern (seperti Next.js), di mana setiap berkas di direktori rute secara otomatis merepresentasikan satu rute aplikasi."
        ]),
        ("sub_item", "b. Pendefinisian Rute (Route Definition)", [
            "Pada React Navigation, setiap nama layar harus didaftarkan satu per satu menggunakan komponen <Stack.Screen name='Detail' component={DetailScreen} /> di berkas konfigurasi rute.",
            "Pada Expo Router, pengembang tidak perlu mendaftarkan nama rute secara manual. Cukup dengan membuat sebuah berkas baru di dalam folder app/, misalnya app/checkout.tsx, rute /checkout langsung tercipta dan dapat diakses seketika."
        ]),
        ("sub_item", "c. Struktur File (File Structure)", [
            "React Navigation tidak memaksakan struktur folder tertentu, sehingga struktur berkas sering kali berbeda-beda antarproyek dan rentan inkonsistensi arsitektur.",
            "Expo Router menerapkan konvensi struktur direktori yang baku dan seragam: seluruh rute berada di folder app/, berkas _layout.tsx bertindak sebagai layout wrapper bersama, index.tsx sebagai halaman beranda rute, tanda kurung (tabs)/ untuk pengelompokan rute tanpa mengubah segmen URL, dan tanda kurung siku [id].tsx untuk parameter dinamis."
        ]),
        ("sub_item", "d. Cara Berpindah Halaman (Navigation Method)", [
            "React Navigation menggunakan prop navigation atau hook useNavigation() dengan pemanggilan method imperatif: navigation.navigate('Detail', { id: 101 }).",
            "Expo Router menggunakan pustaka perutean terpadu melalui objek router atau komponen <Link>, dengan sintaks mirip URL web: router.push('/dish/101') atau <Link href='/dish/101'>, serta pembacaan parameter rute melalui hook useLocalSearchParams()."
        ]),
        "Alasan Expo Router disebut menggunakan pendekatan File-Based Routing adalah karena struktur hierarki folder dan penamaan berkas fisik di dalam direktori proyek secara langsung menentukan skema alamat rute (URL path) aplikasi. Pengembang tidak lagi menulis kode konfigurasi pemetaan rute statis; sistem perutean bekerja secara otomatis dengan membaca pohon direktori sistem berkas (file system). Selain itu, pendekatan ini secara otomatis mengaktifkan fitur Universal Deep Linking, di mana setiap halaman di aplikasi mobile dapat langsung diakses melalui tautan web URL universal tanpa konfigurasi tambahan."
    ]
    add_qa(q2, a2)

    # --- SOAL 3 ---
    q3 = ("Jelaskan fungsi folder app/, file _layout.tsx, index.tsx, serta file halaman lainnya dalam Expo Router. "
          "Bagaimana struktur folder dan file dapat menentukan rute yang digunakan untuk mengakses halaman aplikasi?")
    a3 = [
        "Fungsi masing-masing folder dan berkas khusus dalam arsitektur Expo Router dijelaskan sebagai berikut:",
        ("sub_item", "a. Folder app/", [
            "Folder app/ merupakan direktori akar (root navigation directory) tempat seluruh sistem perutean aplikasi didefinisikan. Segala berkas berekstensi .js, .jsx, .ts, atau .tsx yang diletakkan di dalam folder ini (dan subfoldernya) akan secara otomatis dipindai dan dikompilasi oleh bundler Expo Router menjadi segmen rute antarmuka."
        ]),
        ("sub_item", "b. File _layout.tsx", [
            "Berkas _layout.tsx berfungsi sebagai pembungkus tata letak bersama (shared layout wrapper) untuk seluruh rute yang berada pada tingkat direktori yang sama dan subdirektori di bawahnya. Berkas ini bertugas mendefinisikan tipe navigator utama (apakah berupa Stack Navigator atau Tabs Navigator), mengatur opsi visual bilah judul (header) atau bilah tab bawah (tab bar), membungkus penyedia konteks global (Context Providers / State Management), menangani area aman layar (SafeAreaProvider), serta menampung elemen antarmuka persisten seperti komponen Toast notifikasi yang tidak boleh ter-unmount saat layar berpindah."
        ]),
        ("sub_item", "c. File index.tsx", [
            "Berkas index.tsx berfungsi sebagai titik masuk utama (default entry point / index route) untuk suatu tingkat direktori rute. Sebagai contoh, berkas app/index.tsx bertindak sebagai layar pembuka rute akar (/), sedangkan berkas app/(tabs)/index.tsx bertindak sebagai halaman beranda default saat pengguna mengakses rute grup tab."
        ]),
        ("sub_item", "d. File Halaman Lainnya dan Format Khusus", [
            "File Halaman Statis: Berkas seperti app/checkout.tsx secara langsung memetakan rute tunggal beralamat /checkout.",
            "Folder Grup Rute (group): Penamaan folder yang dibungkus tanda kurung kurawal, seperti app/(tabs)/, berfungsi mengelompokkan beberapa rute ke dalam satu kesatuan struktur navigasi (misalnya Tab Bar) tanpa menambahkan segmen teks '(tabs)' ke dalam segmen URL navigasi.",
            "File Rute Dinamis [param].tsx: Penamaan berkas menggunakan tanda kurung siku, seperti app/dish/[id].tsx, mendefinisikan rute dinamis yang menerima parameter variabel (wildcard parameter) pada segmen URL, di mana nilai parameter 'id' dapat diakses langsung oleh komponen menggunakan hook useLocalSearchParams()."
        ]),
        "Mekanisme penentuan rute oleh struktur folder dan berkas berlangsung secara deterministik: sistem bundler memetakan jalur direktori relatif terhadap folder app/ menjadi string URL. Contoh pada aplikasi Teyvat Delicacies:",
        ("bullet", "Berkas app/index.tsx -> Terpetakan menjadi rute awal / (Layar Gerbang Celestia)."),
        ("bullet", "Berkas app/(tabs)/index.tsx -> Terpetakan menjadi rute tab Beranda /."),
        ("bullet", "Berkas app/(tabs)/catalog.tsx -> Terpetakan menjadi rute tab Katalog /catalog."),
        ("bullet", "Berkas app/(tabs)/cart.tsx -> Terpetakan menjadi rute tab Keranjang Belanja /cart."),
        ("bullet", "Berkas app/(tabs)/profile.tsx -> Terpetakan menjadi rute tab Profil /profile."),
        ("bullet", "Berkas app/checkout.tsx -> Terpetakan menjadi rute formulir /checkout."),
        ("bullet", "Berkas app/dish/[id].tsx -> Terpetakan menjadi rute dinamis /dish/5101 saat melihat masakan ID 5101."),
        ("bullet", "Berkas app/order/[id].tsx -> Terpetakan menjadi rute pelacakan /order/ORD-TEYVAT-1023.")
    ]
    add_qa(q3, a3)

    # --- SOAL 4 ---
    q4 = ("Buatlah sebuah aplikasi katalog dan pemesanan makanan menggunakan React Native dan Expo Router. "
          "Aplikasi ini digunakan untuk membantu pengguna melihat daftar makanan, mencari makanan, melihat detail makanan, "
          "serta melakukan simulasi pemesanan makanan.\n"
          "Ketentuan Fitur Aplikasi :\n"
          "Aplikasi yang dibuat harus memiliki fitur berikut:\n"
          "1. Halaman Beranda (Menampilkan nama aplikasi, info singkat, minimal 5 rekomendasi makanan, kategori makanan, foto, harga, dan navigasi ke detail)\n"
          "2. Halaman Katalog Makanan (Minimal 10 data makanan, nama, kategori, harga, deskripsi, gambar, menggunakan FlatList, fitur pencarian, dan navigasi detail)\n"
          "3. Halaman Detail Makanan (Informasi lengkap, gambar, kategori, harga, deskripsi, tombol Add to Cart, dan menerima parameter rute)\n"
          "4. Halaman Keranjang (Daftar item belanja, nama, harga, qty stepper, subtotal, total bayar, dan fitur hapus item)\n"
          "5. Halaman Profil (Nama pengguna, email, info singkat, dan menu pengaturan aplikasi)\n"
          "6. Simulasi Checkout (Ringkasan pesanan, total harga, tombol checkout, dan konfirmasi pesanan berhasil)\n"
          "Ketentuan Pengumpulan :\n"
          "1. Mahasiswa mengumpulkan source code project React Native.\n"
          "2. Mahasiswa mengumpulkan screenshot halaman aplikasi.\n"
          "3. Mahasiswa dapat mengumpulkan link repository GitHub yang berisi source code project React Native.")

    ss_dir = r'C:\Users\Pongo\Documents\Codingan\Tugas_Pemvis\Tugas_7\screenshots'

    a4 = [
        "Aplikasi mobile pemesanan kuliner 'Teyvat Delicacies' berhasil dikembangkan menggunakan framework React Native dan Expo Router (Expo SDK 52) dengan tema visual RPG bernuansa kertas kuno (parchment cream), bingkai emas antik (antique gold), dan tipografi otentik Teyvat. Sesuai ketentuan pengumpulan tugas, seluruh kode sumber proyek telah diunggah dan dikelola secara rapi pada repositori GitHub resmi berikut:",
        ("bullet_link", "Tautan Repositori GitHub: ", "https://github.com/DarRahman/teyvat-delicacies", "https://github.com/DarRahman/teyvat-delicacies"),
        ("bullet", "Nama Repositori: teyvat-delicacies"),
        ("bullet", "Arsitektur / Runtime: React Native 0.76, Expo SDK 52, Expo Router v4, TypeScript, Zustand State Management"),
        "Rincian implementasi keenam fitur wajib aplikasi berdasarkan ketentuan dosen pengampu:",
        ("sub_item", "1. Halaman Beranda (app/(tabs)/index.tsx)", [
            "Menampilkan identitas aplikasi kuliner Teyvat Delicacies lengkap dengan avatar petualang dan saldo koin Mora.",
            "Menyajikan banner promosi hidangan spesial Chef Xiangling dengan kode voucher diskon PAIMONKENYANG.",
            "Menampilkan 5 hidangan rekomendasi terbaik (Top 5 Recommendations) dengan nama, bintang kelangkaan, harga koin Mora, efek buff in-game, dan tombol navigasi langsung ke halaman detail masakan.",
            "Menyediakan 4 tombol pintasan kategori kuliner: Hidangan Utama (Main Dish), Minuman Segar (Beverages), Cemilan (Snacks), dan Penguat Tempur (ATK Boost)."
        ]),
        ("sub_item", "2. Halaman Katalog Makanan (app/(tabs)/catalog.tsx)", [
            "Memuat basis data 80 hidangan kuliner resmi dari 8 wilayah Teyvat (Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya) yang jauh melampaui batas minimal 10 data yang dipersyaratkan.",
            "Daftar masakan dirender menggunakan komponen performa tinggi FlatList 2 kolom dengan virtualisasi memori (initialNumToRender={8}, maxToRenderPerBatch={8}, windowSize={5}, removeClippedSubviews={true}) sehingga rendering ribuan data tetap halus dan bebas lag.",
            "Dilengkapi kolom pencarian instan (Search Bar) berdasarkan nama hidangan, filter kategori, serta tombol filter wilayah Teyvat.",
            "Setiap kartu masakan menampilkan foto hidangan transparan, nama, harga koin Mora, lencana khasiat buff, bintang kelangkaan, dan dapat diketuk untuk membuka detail masakan."
        ]),
        ("sub_item", "3. Halaman Detail Makanan (app/dish/[id].tsx)", [
            "Menerima parameter ID hidangan yang dikirim dari halaman Beranda maupun Katalog menggunakan hook useLocalSearchParams<{ id: string }>().",
            "Menampilkan citra hidangan beresolusi tinggi dengan efek pendaran elemen lembut, bintang kelangkaan emas, nama masakan, harga Mora, dan kategori hidangan.",
            "Menyajikan rincian narasi deskripsi (lore in-game), efek peningkatan status tempur (Combat Buff), serta grid takaran bahan baku resep (Recipe Ingredients).",
            "Menyediakan pengatur kuantitas porsi (+ / -), tombol 'Tambah ke Keranjang' (Add to Cart) yang memicu notifikasi toast di atas layar, serta tombol 'Pesan Sekarang' yang langsung mengarahkan pengguna ke alur checkout."
        ]),
        ("sub_item", "4. Halaman Keranjang Belanja (app/(tabs)/cart.tsx)", [
            "Menampilkan daftar seluruh hidangan kuliner yang telah dimasukkan ke dalam tas petualang.",
            "Setiap baris masakan memuat informasi thumbnail, nama hidangan, harga satuan Mora, pengatur kuantitas (+ / -), subtotal biaya per item, dan tombol ikon tempat sampah untuk menghapus item dari keranjang.",
            "Menyediakan modul penebusan voucher diskon resmi (PAIMONKENYANG diskon 20%, GLIDERFREE gratis ongkir, dan ADEPTEUSFEAST potongan 3.000 Mora) dengan validasi syarat minimal belanja dan kuota pemakaian otomatis.",
            "Menampilkan kartu rincian tagihan terperinci: subtotal pesanan, ongkos kirim kurir Wind Glider, potongan voucher diskon, dan kalkulasi total akhir koin Mora."
        ]),
        ("sub_item", "5. Halaman Profil Mahasiswa & Pengaturan (app/(tabs)/profile.tsx)", [
            "Menampilkan identitas resmi pengembang: Badar Rahman, NIM 14524303, Semester 5 S1 Teknik Informatika STIKOM Poltek Cirebon.",
            "Menampilkan data profil petualang: Adventure Rank (AR) 60, World Level 9, email resmi badarrahman1905@gmail.com, serta saldo koin Mora dan Primogem.",
            "Menyediakan fitur interaktif pemilihan Panji Kartu Nama (Namecard Picker) dari berbagai karakter dan wilayah Teyvat yang tersimpan secara lokal.",
            "Dilengkapi tombol klaim berkah harian Mora Ley Line (+50.000 Mora) serta tombol ikon gerigi pengaturan yang membuka modal dialog informasi resmi versi aplikasi (Teyvat Delicacies v1.0.0)."
        ]),
        ("sub_item", "6. Simulasi Checkout & Pelacakan Pesanan (app/checkout.tsx & app/order/[id].tsx)", [
            "Menampilkan ringkasan daftar hidangan yang dipesan beserta rincian total biaya akhir koin Mora.",
            "Menyediakan selector titik antar 8 markas besar region Teyvat (Markas Favonius Mondstadt, Teras Restoran Wanmin Liyue dengan gratis ongkir, Kuil Narukami Inazuma, Akademi Sumeru, dll.) dilengkapi modal peta benua Teyvat resolusi tinggi.",
            "Menyediakan pilihan metode pembayaran: Koin Mora Tunai saat Terima (Cash on Delivery) atau Kartu Debit Bank Northland Snezhnaya.",
            "Menyediakan kolom catatan khusus koki untuk instruksi penyajian dapur.",
            "Setelah menekan tombol 'Konfirmasi Pesanan', sistem mengarahkan pengguna ke layar Pelacakan Kurir Wind Glider (app/order/[id].tsx) yang menampilkan progres pendaratan kurir secara dinamis.",
            "Saat pesanan tiba (progres 100%), sistem menampilkan dialog modal konfirmasi legendaris 'QUEST COMPLETE: Feast Delivered!' yang menganugerahkan hadiah +60 Primogem kepada petualang."
        ]),
        "Dokumentasi tangkapan layar antarmuka aplikasi mobile Teyvat Delicacies yang berjalan pada perangkat smartphone Android fisik (Poco M4 Pro):",
        ("image_pair",
         (os.path.join(ss_dir, '01_beranda_rekomendasi.jpg'), "Gambar 7.1 Halaman Beranda (Rekomendasi Chef Xiangling)", "width", Cm(6.8)),
         (os.path.join(ss_dir, '02_beranda_kategori.jpg'), "Gambar 7.2 Halaman Beranda (Shortcut Kategori Kuliner)", "width", Cm(6.8))),
        ("image_pair",
         (os.path.join(ss_dir, '03_katalog_flatlist.jpg'), "Gambar 7.3 Halaman Katalog 80 Masakan (FlatList)", "width", Cm(6.8)),
         (os.path.join(ss_dir, '04_katalog_pencarian.jpg'), "Gambar 7.4 Halaman Katalog saat Filter Pencarian Aktif", "width", Cm(6.8))),
        ("image_pair",
         (os.path.join(ss_dir, '05_detail_makanan_resep.jpg'), "Gambar 7.5 Halaman Detail Masakan & Resep Bahan", "width", Cm(6.8)),
         (os.path.join(ss_dir, '06_keranjang_belanja.jpg'), "Gambar 7.6 Halaman Keranjang Belanja & Kupon Mora", "width", Cm(6.8))),
        ("image_pair",
         (os.path.join(ss_dir, '07_checkout_pengiriman.jpg'), "Gambar 7.7 Halaman Formulir Checkout & Titik Antar", "width", Cm(6.8)),
         (os.path.join(ss_dir, '08_pelacakan_glider.jpg'), "Gambar 7.8 Halaman Pelacakan Kurir Wind Glider", "width", Cm(6.8))),
        ("image_pair",
         (os.path.join(ss_dir, '09_quest_complete_modal.jpg'), "Gambar 7.9 Modal Konfirmasi Quest Complete (+60 Primo)", "width", Cm(6.8)),
         (os.path.join(ss_dir, '10_profil_pengaturan.jpg'), "Gambar 7.10 Halaman Profil Petualang & Pengaturan", "width", Cm(6.8)))
    ]
    add_qa(q4, a4)

    out_docx = r'C:\Users\Pongo\Documents\Codingan\Tugas_7_Pemrograman_Visual_Badar_Rahman.docx'
    out_pdf = r'C:\Users\Pongo\Documents\Codingan\Tugas_7_Pemrograman_Visual_Badar_Rahman.pdf'

    doc.save(out_docx)
    print(f'Dokumen Word Tugas 7 berhasil dibuat: {out_docx}')

    # Konversi otomatis ke PDF via Microsoft Word Native COM
    try:
        word = win32com.client.Dispatch('Word.Application')
        word.Visible = False
        doc_word = word.Documents.Open(os.path.abspath(out_docx))
        doc_word.SaveAs(os.path.abspath(out_pdf), FileFormat=17)
        doc_word.Close()
        word.Quit()
        print(f'Dokumen PDF Tugas 7 berhasil dibuat: {out_pdf}')
    except Exception as e:
        print(f'Catatan konversi PDF (Word COM): {e}')

if __name__ == '__main__':
    build_tugas_7_document()
