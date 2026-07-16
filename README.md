# Website DEMA UIN Antasari (Kabinet Laskar Purnama Antasari)

Website resmi Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin, Kabinet Laskar Purnama Antasari. Berfungsi sebagai pusat informasi digital organisasi: profil kabinet, struktur kepengurusan, layanan mahasiswa (P3, Advokasi, Persuratan), berita/media, dan program kerja, dilengkapi dengan panel admin.

---

## 🚀 Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS + PostCSS
- **Animasi:** GSAP + `@gsap/react`
- **Database & Auth:** Supabase (Postgres)
- **Storage:** Supabase Storage (untuk cover berita dan dokumen persuratan)

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- Paket manajer seperti `npm` (bawaan Node.js) atau `pnpm` / `yarn`

---

## 🛠️ Langkah Instalasi & Setup Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal Anda:

### 1. Clone Repository
Gunakan Git untuk mengklon repositori ini:
```bash
git clone https://github.com/username/dema-uinantasari-web.git
cd dema-uinantasari-web
```

### 2. Instal Dependensi
Instal seluruh dependensi proyek menggunakan NPM:
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.local.example` menjadi `.env.local`:
```bash
cp .env.local.example .env.local
```
Buka file `.env.local` dan lengkapi nilai variabel berikut menggunakan kredensial dari project Supabase Anda (bisa ditemukan di **Supabase Dashboard -> Project Settings -> API**):
```env
NEXT_PUBLIC_SUPABASE_URL=isi_dengan_url_project_supabase_anda
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_dengan_anon_key_supabase_anda
```

### 4. Setup Database Supabase
Masuk ke **Supabase Dashboard -> SQL Editor** pada proyek Anda, kemudian jalankan query SQL berikut secara berurutan untuk membuat tabel dan indeks yang dibutuhkan:
1. Jalankan isi berkas [supabase/schema.sql](supabase/schema.sql) untuk membuat tabel utama (`berita`, `kegiatan`, `dokumen`).
2. Jalankan isi berkas [supabase/migrations/add_permohonan_table.sql](supabase/migrations/add_permohonan_table.sql) untuk membuat tabel `permohonan` (Layanan Persuratan).

### 5. Setup Storage Buckets di Supabase
Masuk ke **Supabase Dashboard -> Storage** dan buat dua bucket berikut:
1. **`berita-images`**
   - Atur akses menjadi **Public** (agar gambar cover berita bisa diakses publik).
2. **`dokumen-surat`**
   - Atur akses menjadi **Private** (dokumen penting hanya bisa diakses admin melalui Signed URL).

### 6. Membuat Akun Admin
Untuk masuk ke panel admin (`/admin`), buat akun pengguna baru secara manual melalui **Supabase Dashboard -> Authentication -> Users -> Add User** (pilih opsi *Create User* dengan Email dan Password).

### 7. Jalankan Development Server
Jalankan server lokal Next.js dengan perintah:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## 📁 Struktur Folder Utama

```text
dema-uinantasari-web/
├── public/                    # Aset statis (logo, font, dsb)
├── supabase/                  # Skema database & migrasi SQL
└── src/
    ├── app/                   # Folder routing Next.js (App Router)
    │   ├── admin/             # Panel kelola konten (Dashboard, Berita, Dokumen, dll)
    │   ├── berita/            # Halaman berita publik
    │   ├── layanan/           # Layanan Persuratan, Advokasi, & P3
    │   ├── program-kerja/     # Kalender & agenda DEMA
    │   └── profil/            # Profil kabinet, visi & misi
    ├── components/            # Komponen React reusable (layout, UI, animasi)
    ├── lib/                   # Integrasi Supabase client/server & utilitas
    └── types/                 # Definisi tipe TypeScript
```

---

## ✍️ Panduan Kontribusi & Konvensi Kode

Jika Anda ingin melakukan kolaborasi atau perubahan kode:
1. **Patuhi Panduan Desain:** Seluruh komponen wajib mematuhi aturan desain yang ada di [AGENTS.md](AGENTS.md) (menggunakan font **Poppins**, mematuhi palet warna resmi, dan menjaga estetika minimalis).
2. **Animasi GSAP:** Gunakan hook `@gsap/react` untuk setiap implementasi animasi GSAP agar ter-cleanup dengan baik dan menghindari memori bocor (*memory leak*).
3. **Format Commit Git:** Gunakan format commit konvensional:
   - `feat: ...` untuk fitur baru.
   - `fix: ...` untuk perbaikan bug.
   - `docs: ...` untuk perubahan dokumentasi.
   - `style: ...` untuk perapian format kode/gaya tampilan.
