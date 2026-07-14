# AGENTS.md — Website DEMA UIN Antasari (Kabinet Laskar Purnama Antasari)

> File ini adalah panduan utama untuk AI coding agent (Antigravity / vibecoding tool apa pun) dalam membangun, mengedit, dan memelihara proyek ini. Baca seluruh file ini sebelum melakukan perubahan apa pun ke codebase.

---

## 1. RINGKASAN PROYEK

**Nama proyek:** dema-uinantasari-web
**Tujuan:** Website resmi DEMA UIN Antasari Banjarmasin, Kabinet Laskar Purnama Antasari — pusat informasi (digital hub) organisasi: profil kabinet, struktur kepengurusan, layanan mahasiswa (P3, Advokasi, Persuratan), berita/media, dan program kerja. Dilengkapi panel admin untuk mengelola berita, kegiatan, dan dokumen/surat.

**Prinsip desain:**
- Native code (bukan WordPress/Elementor) — ringan, cepat, hemat biaya hosting.
- Estetika minimal: dominan putih, tipografi gelap, ikon simpel, banyak white space.
- Font: Poppins (sudah dipakai konsisten di materi visual DEMA sebelumnya).
- Animasi interaktif tapi tidak berlebihan — GSAP dipakai untuk scroll reveal, transisi section, dan micro-interaction, bukan animasi yang mengganggu keterbacaan.
- Mobile-first, responsive penuh.

**Tipografi — Poppins:**
- Font utama seluruh situs (heading maupun body) adalah **Poppins**, di-load lewat `next/font/google` (bukan link CDN manual), supaya optimized dan tidak nge-blok render.
  ```ts
  import { Poppins } from "next/font/google";
  const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
  });
  ```
- Jangan pakai font lain sama sekali (termasuk font default browser/system-ui) di komponen manapun — semua elemen teks mewarisi `font-poppins`.
- Skala weight yang dipakai, jangan lebih dari ini:
  | Weight | Kapan dipakai |
  |---|---|
  | 600–700 (Semibold/Bold) | Heading (`h1`–`h3`), nama menu navbar, angka statistik |
  | 500 (Medium) | Subheading, label tombol, nama kategori/badge |
  | 400 (Regular) | Body text, paragraf, deskripsi |
  | 300 (Light) | Hanya untuk tagline/hero subtitle besar, dipakai seperlunya |
- Skala ukuran (jangan bikin ukuran baru di luar ini tanpa alasan):
  | Elemen | Ukuran (mobile → desktop) |
  |---|---|
  | H1 (hero/judul halaman) | `text-3xl` → `text-5xl` |
  | H2 (judul section) | `text-2xl` → `text-3xl` |
  | H3 (judul card/subsection) | `text-lg` → `text-xl` |
  | Body | `text-sm` → `text-base` |
  | Caption/meta (tanggal, label kecil) | `text-xs` |
- `line-height` longgar untuk body text (`leading-relaxed`) supaya tetap nyaman dibaca di gaya minimalis dengan banyak white space.

**Gaya desain — Simple & Minimalis (aturan konkret, bukan sekadar prinsip umum):**
- **Layout**: banyak white space/negative space, jangan padatkan elemen. Gunakan grid sederhana (1–3 kolom), hindari layout bertumpuk atau efek 3D/skeuomorphic.
- **Warna**: dominan `background` (`#F4F2EF`), warna dari palet resmi (Bagian 1) dipakai secukupnya sebagai aksen — bukan warna-warni. Satu halaman idealnya tidak memakai lebih dari 2 warna aksen sekaligus di luar `background` dan teks gelap.
- **Bentuk & border**: sudut membulat konsisten (`rounded-lg` atau `rounded-xl` saja, jangan campur banyak radius berbeda), border tipis (`border` 1px) atau tanpa border sama sekali — andalkan white space dan shadow tipis (`shadow-sm`) untuk memisahkan elemen, bukan garis tebal/kontras keras.
- **Ikon**: hanya pakai `lucide-react`, gaya line-icon (outline), jangan campur dengan ikon filled/emoji/ikon dari sumber lain — ukuran & stroke width konsisten di seluruh situs.
- **Gambar**: foto ditampilkan apa adanya tanpa filter/efek berlebihan, rasio aspek konsisten per konteks (misal semua foto profil menteri pakai rasio 1:1 atau 4:5, semua cover berita pakai 16:9).
- **Elemen dekoratif**: hindari gradient mencolok, pattern ramai, atau ilustrasi dekoratif berlebihan. Kalau butuh aksen visual, gunakan bentuk geometris sederhana (garis, titik, blok warna solid tipis) — sesuai semangat minimal yang sudah konsisten dipakai di materi visual DEMA sebelumnya.
- **Konsistensi komponen**: satu jenis tombol/badge/card harus terlihat identik di semua halaman (ukuran padding, radius, shadow) — definisikan sekali di `components/ui/`, jangan bikin variasi ad-hoc di tiap halaman.
- **Jangan**: menambahkan efek visual "ramai" seperti particle background, animasi berputar terus-menerus (infinite loop) di elemen dekoratif, glassmorphism, neumorphism, atau gaya desain lain di luar minimalis yang sudah ditentukan di sini — walau agent menganggap itu "menarik".

**Palet warna resmi:**

| Nama token | Hex | Peran |
|---|---|---|
| `background` | `#F4F2EF` | Warna dasar/latar utama (off-white, pengganti putih polos) |
| `primary` | `#990808` | Warna utama brand (dark red) — navbar, heading penting, tombol utama |
| `accent` | `#F44027` | Warna aksen (orange-red) — hover state, highlight, badge kategori, CTA sekunder |
| `secondary` | `#EDC537` | Warna pendukung (gold/kuning) — aksen dekoratif, ikon, garis pembatas, badge "baru" |

Aturan pakai:
- Teks body tetap gelap (`#1a1a1a` atau `neutral-900`) di atas `background` — jangan pakai `primary`/`accent` untuk paragraf panjang, hanya untuk heading/aksen/tombol.
- Tombol utama (CTA): background `primary` (`#990808`), teks putih, hover ke `accent` (`#F44027`).
- `secondary` (`#EDC537`) dipakai sedikit saja — untuk garis underline, ikon aktif, atau badge, jangan jadi warna dominan.
- Definisikan token ini di `tailwind.config.ts` sebagai custom colors (`brand.background`, `brand.primary`, `brand.accent`, `brand.secondary`) supaya konsisten dipakai di seluruh komponen, bukan hardcode hex di tiap file.

---

## 2. TECH STACK

| Layer | Teknologi | Alasan |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | SSR/SSG cepat, deploy gratis di Vercel |
| Styling | Tailwind CSS | Cepat, konsisten, mudah maintain |
| Animasi | GSAP + @gsap/react (ScrollTrigger, SplitText) | Animasi scroll & animasi teks interaktif — lihat detail lengkap di Bagian 15 |
| Database | Supabase (Postgres) | Free tier, mudah, sudah termasuk Auth & Storage |
| Auth (admin) | Supabase Auth (email/password) | Login admin tanpa bikin sistem auth sendiri |
| Storage file | Supabase Storage | Upload dokumen/surat (PDF, gambar berita) |
| Hosting | Vercel (free tier) | Native support Next.js, auto-deploy dari GitHub |
| Form layanan publik | Google Forms (embed iframe) | Tetap dipakai sesuai rencana awal, gratis, privasi terjaga untuk form P3 |
| Kalender | react-big-calendar atau FullCalendar (react wrapper) | Untuk halaman Program Kerja |
| Icon | lucide-react | Ringan, konsisten dengan gaya minimal |

**Jangan** menambahkan CMS berbayar, plugin WordPress, atau library animasi lain selain GSAP kecuali diminta eksplisit.

---

## 3. STRUKTUR FOLDER LENGKAP

```
dema-uinantasari-web/
├── AGENTS.md
├── README.md
├── .env.local.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── supabase/
│   └── schema.sql                     # skema database (lihat bagian 6)
├── public/
│   ├── images/
│   │   ├── logo/
│   │   ├── kabinet/                   # foto menteri & anggota
│   │   └── og-image.png
│   └── favicon.ico
└── src/
    ├── middleware.ts                  # proteksi route /admin
    ├── app/
    │   ├── layout.tsx                 # root layout: Navbar + Footer + font
    │   ├── page.tsx                   # Landing page (Beranda)
    │   ├── globals.css
    │   │
    │   ├── profil/
    │   │   └── page.tsx               # Tentang DEMA, Filosofi Kabinet, Visi & Misi
    │   │
    │   ├── struktur/
    │   │   └── page.tsx               # Bagan organisasi + profil menteri/anggota
    │   │
    │   ├── layanan/
    │   │   ├── page.tsx               # Landing layanan (3 kartu: P3, Advokasi, Persuratan)
    │   │   ├── p3/page.tsx            # Info + embed Google Form pelaporan P3
    │   │   ├── advokasi/page.tsx      # Info + embed Google Form pengaduan
    │   │   └── persuratan/page.tsx    # Info + embed Google Form surat-menyurat
    │   │
    │   ├── berita/
    │   │   ├── page.tsx               # List berita (grid, filter kategori)
    │   │   └── [slug]/page.tsx        # Detail 1 berita
    │   │
    │   ├── program-kerja/
    │   │   └── page.tsx               # Kalender/timeline agenda & proker
    │   │
    │   ├── admin/
    │   │   ├── layout.tsx             # layout khusus admin (sidebar), cek session
    │   │   ├── login/
    │   │   │   └── page.tsx           # form login admin
    │   │   ├── page.tsx               # dashboard (ringkasan jumlah berita/kegiatan/dokumen)
    │   │   ├── berita/
    │   │   │   ├── page.tsx           # tabel semua berita + tombol edit/hapus
    │   │   │   ├── tambah/page.tsx    # form tambah berita
    │   │   │   └── [id]/edit/page.tsx # form edit berita
    │   │   ├── kegiatan/
    │   │   │   ├── page.tsx           # tabel semua kegiatan/agenda
    │   │   │   ├── tambah/page.tsx    # form tambah kegiatan
    │   │   │   └── [id]/edit/page.tsx # form edit kegiatan
    │   │   └── dokumen/
    │   │       ├── page.tsx           # daftar dokumen/surat + kategori
    │   │       └── upload/page.tsx    # form upload surat (PDF)
    │   │
    │   └── api/
    │       ├── berita/route.ts        # GET/POST berita
    │       ├── berita/[id]/route.ts   # PUT/DELETE berita
    │       ├── kegiatan/route.ts      # GET/POST kegiatan
    │       ├── kegiatan/[id]/route.ts # PUT/DELETE kegiatan
    │       └── dokumen/route.ts       # GET/POST/DELETE dokumen
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   ├── MobileMenu.tsx
    │   │   └── Footer.tsx
    │   ├── home/
    │   │   ├── HeroSection.tsx        # GSAP: headline masuk + parallax
    │   │   ├── PilarSection.tsx       # 5 pilar navigasi (Profil, Struktur, Layanan, Berita, Proker)
    │   │   ├── BeritaTerbaru.tsx      # 3 berita terbaru dari Supabase
    │   │   └── CTASection.tsx
    │   ├── berita/
    │   │   ├── BeritaCard.tsx
    │   │   └── FilterKategori.tsx
    │   ├── struktur/
    │   │   └── BaganOrganisasi.tsx    # SVG/diagram interaktif struktur
    │   ├── program-kerja/
    │   │   └── KalenderProker.tsx
    │   ├── admin/
    │   │   ├── Sidebar.tsx
    │   │   ├── DataTable.tsx          # tabel generik reusable
    │   │   ├── FormBerita.tsx
    │   │   ├── FormKegiatan.tsx
    │   │   └── UploadDokumen.tsx
    │   ├── ui/                        # button, card, badge, modal, input (reusable)
    │   └── animations/
    │       ├── FadeInSection.tsx      # wrapper GSAP scroll reveal reusable
    │       └── useGsapContext.ts      # hook cleanup GSAP context
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts              # supabase client (browser)
    │   │   ├── server.ts              # supabase client (server component)
    │   │   └── middleware.ts          # helper untuk middleware.ts
    │   └── utils.ts                   # formatTanggal, slugify, dll
    │
    └── types/
        └── index.ts                  # tipe Berita, Kegiatan, Dokumen, dst
```

---

## 4. DETAIL PER-SCREEN

### 4.1 Beranda (`/`)
- **Hero section**: judul "Laskar Purnama Antasari", tagline filosofi kabinet, CTA ke Profil. Animasi GSAP: teks fade-up staggered saat load, background subtle parallax saat scroll.
- **Pilar navigasi**: 5 kartu (Profil, Struktur, Layanan Mahasiswa, Berita & Media, Program Kerja) — GSAP ScrollTrigger reveal satu-satu saat masuk viewport.
- **Berita terbaru**: 3 kartu berita terbaru (ambil dari Supabase, published saja).
- **CTA penutup**: ajakan ke halaman Layanan Mahasiswa.

### 4.2 Profil (`/profil`)
- Tentang DEMA (deskripsi organisasi).
- Filosofi Kabinet "Laskar Purnama Antasari" (narasi makna nama, bisa dengan ilustrasi/SVG).
- Visi & Misi (list terstruktur).
- Konten statis, boleh hardcode di komponen atau ambil dari 1 tabel `profil_konten` jika ingin diedit dari admin nantinya (opsional, fase 2).

### 4.3 Struktur (`/struktur`)
- Bagan organisasi visual (komponen `BaganOrganisasi`, SVG atau diagram interaktif — klik nama menteri untuk lihat detail).
- Grid profil menteri & anggota: foto, nama, jabatan, tupoksi singkat.
- Data bisa hardcode di `data/struktur.ts` dulu (statis), tidak perlu database di fase awal.

### 4.4 Layanan Mahasiswa (`/layanan`, `/layanan/p3`, `/layanan/advokasi`, `/layanan/persuratan`)
- Landing `/layanan`: 3 kartu menuju masing-masing sub-layanan, dengan ikon dan deskripsi singkat.
- Tiap sub-halaman: penjelasan alur layanan + embed Google Form (iframe responsive, `loading="lazy"`).
- P3: tekankan poin privasi terjaga di teks halaman.
- Persuratan: termasuk pengajuan surat-menyurat & permohonan kerja sama (Media Partner).

### 4.5 Berita & Media (`/berita`, `/berita/[slug]`)
- List: grid card berita, filter kategori (Berita Nasional, Berita Kampus, Pengumuman), pagination atau infinite scroll.
- Detail: judul, cover image, tanggal, kategori, isi (render dari rich text/markdown), tombol share.
- Data dari tabel `berita` di Supabase, hanya tampilkan yang `status = 'published'`.

### 4.6 Program Kerja (`/program-kerja`)
- Kalender agenda (`KalenderProker`, pakai FullCalendar/react-big-calendar) menampilkan tanggal kegiatan.
- Timeline proker per kementerian (opsional tampilan list di bawah kalender).
- Data dari tabel `kegiatan`.

### 4.7 Admin — Login (`/admin/login`)
- Form email + password, submit ke Supabase Auth `signInWithPassword`.
- Redirect ke `/admin` jika sukses, tampilkan error jika gagal.
- Halaman ini **tidak** memakai layout admin (sidebar), full page sendiri.

### 4.8 Admin — Dashboard (`/admin`)
- Ringkasan: total berita (published/draft), total kegiatan mendatang, total dokumen tersimpan.
- Shortcut cepat ke "Tambah Berita", "Tambah Kegiatan", "Upload Dokumen".

### 4.9 Admin — Kelola Berita (`/admin/berita`, `/tambah`, `/[id]/edit`)
- Tabel: judul, kategori, status (draft/published), tanggal, aksi (edit/hapus).
- Form tambah/edit: judul, slug (auto-generate, bisa diedit), kategori (dropdown), cover image (upload ke Supabase Storage bucket `berita-images`), isi (textarea/rich text editor sederhana), status (draft/published).

### 4.10 Admin — Kelola Kegiatan (`/admin/kegiatan`, `/tambah`, `/[id]/edit`)
- Tabel: nama kegiatan, kementerian penanggung jawab, tanggal mulai-selesai, status.
- Form tambah/edit: nama kegiatan, deskripsi, kementerian, tanggal mulai, tanggal selesai, lokasi (opsional).

### 4.11 Admin — Kelola Dokumen/Surat (`/admin/dokumen`, `/upload`)
- Tabel: nama dokumen, kategori (Surat Keluar, Surat Masuk, SK, Notulensi, Lainnya), tanggal upload, tombol lihat/download/hapus.
- Form upload: nama dokumen, kategori (dropdown), file (PDF/gambar, upload ke Supabase Storage bucket `dokumen-surat`, maksimal 10MB), deskripsi singkat (opsional).
- **Catatan privasi**: bucket `dokumen-surat` di-set **private**, akses hanya lewat signed URL yang dibuat saat admin login — jangan buat bucket ini public.

---

## 5. AUTENTIKASI & AKSES

- Hanya ada 1 role: **admin** (pengurus DEMA yang berwenang mengelola konten). Tidak perlu sistem multi-role rumit di fase awal.
- Semua route di bawah `/admin/*` (kecuali `/admin/login`) diproteksi lewat `src/middleware.ts` — cek session Supabase, redirect ke `/admin/login` jika belum login.
- Akun admin dibuat manual lewat Supabase Dashboard (Authentication → Users → Add User), bukan lewat form registrasi publik. Jangan buat halaman signup publik.

---

## 6. SKEMA DATABASE (Supabase / Postgres)

Lihat file `supabase/schema.sql` untuk skema lengkap yang siap dijalankan. Ringkasan tabel:

- **berita**: `id, judul, slug, kategori, cover_url, isi, status, created_at, updated_at`
- **kegiatan**: `id, nama, deskripsi, kementerian, tanggal_mulai, tanggal_selesai, lokasi, created_at`
- **dokumen**: `id, nama, kategori, file_url, deskripsi, uploaded_at`

Storage buckets:
- `berita-images` (public) — cover image berita.
- `dokumen-surat` (private) — file surat/dokumen resmi.

---

## 7. KONVENSI KODE

- TypeScript strict mode aktif, semua komponen bertipe.
- Komponen server component secara default; tambahkan `"use client"` hanya jika perlu interaktivitas/GSAP/state.
- GSAP animation selalu dibungkus `useGSAP()` hook dari `@gsap/react` agar cleanup otomatis (hindari memory leak saat navigasi antar halaman).
- Semua akses Supabase di server component/API route pakai `lib/supabase/server.ts`; di client component pakai `lib/supabase/client.ts`.
- Penamaan file komponen: PascalCase. Penamaan route folder: kebab-case sesuai konvensi Next.js App Router.
- Jangan commit file `.env.local` — gunakan `.env.local.example` sebagai referensi variabel yang dibutuhkan.

---

## 8. HAL YANG TIDAK BOLEH DILAKUKAN AGENT

- Jangan tambahkan WordPress, PHP, atau dependency backend lain di luar stack yang ditentukan.
- Jangan buat bucket storage dokumen jadi public.
- Jangan hardcode API key/secret Supabase langsung di kode — selalu lewat environment variable.
- Jangan hapus atau ubah struktur folder di atas tanpa alasan kuat; jika perlu deviasi, catat alasannya di README.md.
- Jangan install library animasi tambahan (Framer Motion, dll) selain GSAP kecuali diminta eksplisit oleh user.

---

## 9. BATASAN SCOPE (WAJIB DIPATUHI — anti over-engineering)

Tujuan bagian ini: mencegah agent mengerjakan sesuatu di luar yang diminta, membuat abstraksi berlebihan, atau menambah fitur "bonus" yang tidak diminta.

**9.1 Halaman & fitur**
- Hanya bangun halaman yang tercantum di Bagian 3 & 4. Jangan menambah halaman baru (misal: "Galeri Foto", "Testimoni", "FAQ", "Blog Tim", dark mode toggle, multi-bahasa) kecuali diminta eksplisit oleh user, walaupun agent merasa itu "akan bagus untuk ditambahkan".
- Jangan menambah field baru di form (berita/kegiatan/dokumen) di luar yang disebut di Bagian 4, walaupun terasa "lebih lengkap". Kalau agent merasa ada field penting yang kurang, **tanyakan dulu ke user**, jangan langsung ditambahkan.
- Jangan membuat sistem role/permission bertingkat (super admin, editor, viewer, dst). Cukup satu role admin seperti di Bagian 5.
- Jangan membuat fitur komentar, like, notifikasi push, newsletter, atau search engine internal kecuali diminta.

**9.2 Kode & arsitektur**
- Jangan bikin abstraksi/generic system yang belum dibutuhkan (contoh: "content builder" generik untuk semua tipe konten, plugin system, config-driven page builder). Tulis kode langsung untuk kebutuhan yang ada — refactor ke abstraksi hanya kalau memang ada duplikasi nyata di 3+ tempat.
- Jangan bikin file/komponen yang tidak dipakai "untuk jaga-jaga masa depan". Semua file yang dibuat harus benar-benar dipakai di halaman yang ada sekarang.
- Jangan menulis unit test/e2e test suite kecuali user memintanya. Fokus ke fungsionalitas dulu.
- Jangan menambahkan library baru di luar Bagian 2 tanpa bertanya dulu ke user — termasuk state management (Redux/Zustand/Jotai), UI kit besar (Material UI, Chakra), atau ORM tambahan (Prisma dsb — cukup pakai Supabase client langsung).
- Satu komponen sebaiknya fokus satu tanggung jawab; hindari 1 file raksasa berisi banyak logic tidak berhubungan, tapi juga hindari memecah jadi terlalu banyak file kecil untuk hal sepele.

**9.3 Konten & desain**
- Jangan mengisi konten placeholder yang terkesan final (contoh: menulis nama menteri fiktif, angka statistik karangan, atau testimoni palsu). Kalau data asli belum ada, pakai placeholder yang jelas-jelas ditandai, misal `"[Nama Menteri — isi di sini]"`, bukan nama karangan yang terlihat real.
- Jangan menambahkan animasi GSAP di elemen yang tidak disebutkan butuh animasi (contoh: animasi di setiap huruf teks, animasi di semua ikon footer). Animasi hanya di bagian yang disebut Bagian 4.
- Jangan mengubah palet warna, font, atau prinsip desain di Bagian 1 atas inisiatif sendiri.

**9.4 Kalau ragu**
- Kalau ada instruksi yang ambigu atau agent merasa perlu keputusan desain/fitur yang tidak diatur file ini, **agent harus berhenti dan bertanya ke user**, bukan menebak lalu mengerjakan versi paling lengkap/kompleks yang terpikirkan.

---

## 10. CARA KERJA BERTAHAP

Agent wajib mengerjakan proyek per-fase, bukan generate semua sekaligus dalam satu batch besar tanpa checkpoint:

1. **Fase 0**: Setup project (struktur folder, config, dependency) — stop, biarkan user cek dulu sebelum lanjut.
2. **Fase 1**: Layout global (Navbar, Footer, root layout) + halaman Beranda.
3. **Fase 2**: Halaman Profil, Struktur, Layanan (statis + embed form).
4. **Fase 3**: Halaman Berita (list + detail) terhubung ke Supabase.
5. **Fase 4**: Halaman Program Kerja + kalender.
6. **Fase 5**: Admin — login, dashboard, kelola berita.
7. **Fase 6**: Admin — kelola kegiatan, kelola dokumen/surat.
8. **Fase 7**: Polish — animasi GSAP di seluruh halaman, responsive check, SEO meta.

Setelah tiap fase selesai, agent sebaiknya merangkum singkat apa yang baru dikerjakan sebelum lanjut ke fase berikutnya — bukan diam-diam lanjut membangun fase selanjutnya tanpa konfirmasi, apalagi mengerjakan fase di luar urutan.

---

## 11. DEFINITION OF DONE

Satu halaman/fitur dianggap selesai kalau memenuhi semua ini — tidak lebih, tidak kurang:
- Tampilan sesuai deskripsi di Bagian 4 (tidak ada section tambahan di luar yang disebut).
- Responsive di mobile (360px) dan desktop (1440px) minimal.
- Tidak ada console error/warning saat dijalankan.
- Data dinamis (berita/kegiatan/dokumen) benar-benar terhubung ke Supabase, bukan data dummy hardcode yang dilupakan.
- Form admin bisa create/update/delete dan langsung terrefleksi di halaman publik terkait.
- Tidak ada dependency baru yang ter-install tanpa disebutkan di README/commit message.

---

## 12. VALIDASI & KEAMANAN INPUT

- Semua form admin (berita, kegiatan, dokumen) wajib validasi di **dua sisi**: client (form tidak submit kalau field wajib kosong) dan server/API route (tolak request kalau data tidak valid) — jangan cuma andalkan validasi client.
- Upload file (cover berita, dokumen surat) wajib dicek: tipe file (whitelist: `pdf, jpg, jpeg, png, webp` — tolak tipe lain) dan ukuran maksimal (gambar maks 5MB, dokumen maks 10MB) sebelum diupload ke Supabase Storage.
- Sebelum simpan ke database, sanitize input teks (judul, deskripsi, isi berita) dari kemungkinan HTML/script asing kalau editor isi berita mendukung rich text — cegah XSS sederhana.
- Slug berita di-generate otomatis dari judul (`slugify`) dan dicek unik sebelum insert; kalau bentrok, tambahkan suffix angka, jangan biarkan error mentah tampil ke admin.
- Endpoint API (`/api/*`) yang mengubah data (POST/PUT/DELETE) wajib cek session admin dulu sebelum eksekusi — jangan hanya mengandalkan proteksi middleware di sisi halaman.
- Jangan expose `service_role key` Supabase ke client sama sekali — hanya `anon key` yang boleh dipakai di browser.

---

## 13. KONVENSI GIT & COMMIT

- Commit kecil dan sering per fitur/fase (lihat Bagian 10), **bukan** satu commit raksasa berisi seluruh proyek.
- Format commit message: `<tipe>: <deskripsi singkat>` — contoh: `feat: tambah halaman profil kabinet`, `fix: perbaiki responsive navbar mobile`, `style: sesuaikan warna tombol CTA ke palet resmi`.
- Jangan pernah commit file `.env.local`, folder `node_modules/`, atau `.next/` — pastikan `.gitignore` sudah benar sebelum commit pertama.
- Jangan melakukan `git push --force` ke branch `main` kecuali diminta eksplisit oleh user.
- Kalau agent membuat perubahan besar/berisiko (ubah skema database, hapus komponen yang dipakai banyak halaman), beri tahu user dulu sebelum commit, bukan langsung push.

---

## 14. PROTOKOL KOMUNIKASI AGENT

- Sebelum mulai satu fase baru (Bagian 10), agent menjelaskan singkat rencana kerja fase itu ke user.
- Setelah satu fase selesai, agent melaporkan: file apa saja yang dibuat/diubah, apakah ada dependency baru yang diinstall, dan apa yang perlu dicek manual oleh user (misalnya: isi env variable, buat akun admin).
- Kalau agent menemukan kebutuhan yang tidak jelas di file ini (contoh: kategori berita tambahan, warna status kegiatan), **tanyakan lewat 1 pertanyaan spesifik**, jangan berasumsi lalu membangun berdasarkan tebakan sendiri.
- Kalau agent gagal mengerjakan sesuatu (error yang tidak bisa diselesaikan, API limit, dsb), laporkan apa adanya ke user — jangan diam-diam melewati fitur itu atau menggantinya dengan pendekatan lain tanpa bilang.

---

## 15. SPESIFIKASI ANIMASI GSAP (per-text & scroll effect)

**15.1 Plugin yang dipakai**
- `gsap` (core)
- `ScrollTrigger` — animasi berbasis posisi scroll
- `SplitText` — animasi per karakter/kata/baris teks (sudah menjadi bagian gratis dari GSAP sejak diakuisisi Webflow, tidak perlu lisensi Club GreenSock lagi)
- Jangan tambah plugin GSAP lain (MorphSVG, DrawSVG, Flip, dll) kecuali diminta eksplisit.

**15.2 Animasi teks (per-text)**
- **Heading utama saja** (H1 hero di Beranda, H1 tiap halaman) di-split pakai `SplitText` per kata (bukan per huruf — per huruf terlalu ramai untuk gaya minimalis), lalu animasikan masuk: `opacity 0 → 1` + `y: 24px → 0`, stagger `0.04s` antar kata, easing `power3.out`, durasi `0.7s`.
- **Body text / paragraf** tidak di-split. Cukup animasi sebagai satu blok: fade + slight slide up (`y: 16px → 0`), durasi `0.6s`.
- **Trigger**: heading hero dianimasikan saat halaman pertama kali load (tidak menunggu scroll). Heading section lain memakai `ScrollTrigger` dengan `start: "top 80%"`.
- Easing dan durasi di atas dipakai **konsisten di semua halaman** — jangan tiap komponen punya angka easing/durasi sendiri-sendiri.

**15.3 Animasi scroll (ScrollTrigger)**
- Reveal section standar: `opacity 0 → 1` + `y: 32px → 0`, `start: "top 80%"`, `toggleActions: "play none none reverse"`.
- Grid/list (kartu berita, pilar navigasi, kartu layanan): stagger antar item `0.12s`, arah masuk seragam (semua dari bawah, jangan campur arah kiri-kanan-bawah dalam satu grid).
- Parallax: hanya di hero image/background, subtle (`yPercent` maksimal 10–15, `scrub: true`) — jangan parallax ekstrem yang bisa bikin lag di mobile.
- `pin` section (elemen menempel saat scroll) hanya dipakai kalau benar-benar relevan (misal showcase Bagan Organisasi) — jangan pakai `pin` di banyak section karena berisiko merusak UX terutama di mobile.
- Navbar: efek shrink/ubah background saat scroll melewati threshold tertentu (opsional, ringan saja — bukan animasi besar).

**15.4 Komponen reusable (wajib dipakai ulang, jangan tulis GSAP inline berulang)**
- `components/animations/FadeInSection.tsx` — wrapper generic untuk reveal section (Bagian 15.3).
- `components/animations/SplitTextHeading.tsx` — wrapper generic untuk animasi heading per kata (Bagian 15.2).
- `components/animations/useGsapContext.ts` — hook cleanup, dipakai di semua komponen yang menggunakan GSAP.

**15.5 Performance & aksesibilitas**
- Wajib hormati `prefers-reduced-motion`: kalau user mengaktifkan reduce motion di OS/browser, animasi dipercepat mendekati instan (durasi ~0.01s) atau di-skip total — konten tetap tampil normal, jangan sampai konten hilang/tersembunyi kalau animasi di-skip.
- Semua animasi GSAP dibungkus `useGSAP()` dari `@gsap/react` supaya otomatis dibersihkan saat pindah halaman (App Router) — animasi yang tidak di-cleanup bisa menumpuk dan bikin scroll patah-patah.
- `ScrollTrigger.refresh()` dipanggil ulang saat resize viewport (gunakan `ScrollTrigger.matchMedia()` untuk beda perilaku mobile vs desktop bila perlu).
- Jangan pasang animasi berat (banyak `will-change`, parallax ganda) di halaman admin — halaman admin harus terasa cepat dan fungsional, animasi di admin cukup transisi halus standar (fade saat modal/toast muncul), bukan showcase visual.

**15.6 Batasan (biar tidak berlebihan)**
- Maksimal satu animasi split-text besar per halaman (biasanya H1 saja). Jangan split semua heading di semua section jadi per-kata — itu berlebihan dan bikin halaman terasa berat/norak untuk situs organisasi.
- Jangan animasikan tiap kata/kalimat di paragraf panjang.
- Jangan bikin animasi *infinite loop* di elemen dekoratif (logo berputar terus, ikon bergoyang terus) kecuali diminta eksplisit.
- Target keseluruhan: halaman terasa **hidup**, bukan **sibuk**. Kalau ragu antara menambah animasi atau tidak, agent memilih **tidak menambah**.

---

## 16. BAHASA & KONTEN UI

- Seluruh teks antarmuka (label tombol, judul halaman, pesan error, placeholder form) memakai **Bahasa Indonesia baku**, konsisten — bukan campur Inggris kecuali istilah teknis yang memang lazim (contoh: "Login", "Email", "Upload").
- Istilah konsisten di seluruh situs: pakai "Kegiatan" atau "Program Kerja" secara konsisten (jangan gonta-ganti dengan "acara"/"event"); pakai "Berita" bukan "Artikel"/"Post"; pakai "Dokumen" bukan "File" di label UI publik.
- Pesan error ke user harus manusiawi, bukan pesan error teknis mentah (contoh: tampilkan "Gagal menyimpan berita, coba lagi." bukan `Error: null value in column "slug"`).
- Semua tanggal ditampilkan dalam format Indonesia (`14 Juli 2026`), bukan format ISO/US mentah (`2026-07-14`).