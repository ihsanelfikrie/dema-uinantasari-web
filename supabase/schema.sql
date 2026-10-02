-- Table definitions for Website DEMA UIN Antasari (Kabinet Laskar Purnama Antasari)

-- 1. berita: id, judul, slug, kategori, cover_url, isi, status, created_at, updated_at
CREATE TABLE IF NOT EXISTS berita (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    kategori TEXT NOT NULL, -- e.g., 'Berita Nasional', 'Berita Kampus', 'Pengumuman'
    cover_url TEXT NOT NULL,
    isi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. kegiatan: id, nama, deskripsi, kementerian, tanggal_mulai, tanggal_selesai, lokasi, created_at
CREATE TABLE IF NOT EXISTS kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    kementerian TEXT NOT NULL,
    tanggal_mulai TIMESTAMP WITH TIME ZONE NOT NULL,
    tanggal_selesai TIMESTAMP WITH TIME ZONE NOT NULL,
    lokasi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. dokumen: id, nama, kategori, file_url, deskripsi, uploaded_at
CREATE TABLE IF NOT EXISTS dokumen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL, -- 'Surat Keluar' | 'Surat Masuk' | 'SK' | 'Notulensi' | 'Lainnya'
    file_url TEXT NOT NULL,
    deskripsi TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. sambat: id, text_konten, warna_sticky_note, koordinat_x, koordinat_y, rotasi, status, created_at
CREATE TABLE IF NOT EXISTS sambat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_konten TEXT NOT NULL,
    warna_sticky_note TEXT NOT NULL, -- Kode warna pastel hex (misal #FFF9A6)
    koordinat_x INTEGER NOT NULL,    -- Koordinat X relatif (%)
    koordinat_y INTEGER NOT NULL,    -- Koordinat Y relatif (%)
    rotasi INTEGER NOT NULL,         -- Sudut rotasi acak (-15 s.d 15 derajat)
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. event_registrasi: untuk pendaftaran event (Antasari Media Lab, dll.)
CREATE TABLE IF NOT EXISTS event_registrasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_slug TEXT NOT NULL DEFAULT 'antasari-media-lab',
    nama TEXT NOT NULL,
    nim TEXT NOT NULL,
    email TEXT NOT NULL,
    delegasi TEXT NOT NULL,
    ticket_id TEXT NOT NULL,
    ig_screenshot_url TEXT,
    tiktok_screenshot_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Aktifkan RLS dan izinkan publik mendaftar event
ALTER TABLE event_registrasi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Izinkan publik mendaftar event" ON event_registrasi;
CREATE POLICY "Izinkan publik mendaftar event" ON event_registrasi
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Izinkan baca event_registrasi" ON event_registrasi;
CREATE POLICY "Izinkan baca event_registrasi" ON event_registrasi
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Izinkan publik update event_registrasi" ON event_registrasi;
CREATE POLICY "Izinkan publik update event_registrasi" ON event_registrasi
    FOR UPDATE USING (true);

-- Izinkan admin (authenticated user) menghapus data peserta
-- Catatan: API route DELETE juga menggunakan service role key sebagai lapisan keamanan tambahan
DROP POLICY IF EXISTS "Izinkan admin hapus event_registrasi" ON event_registrasi;
CREATE POLICY "Izinkan admin hapus event_registrasi" ON event_registrasi
    FOR DELETE USING (auth.role() = 'authenticated');


-- Storage bucket untuk bukti screenshot follow IG & TikTok
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bukti-follow', 'bukti-follow', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Izinkan upload bukti follow" ON storage.objects;
CREATE POLICY "Izinkan upload bukti follow" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'bukti-follow');

DROP POLICY IF EXISTS "Izinkan update bukti follow" ON storage.objects;
CREATE POLICY "Izinkan update bukti follow" ON storage.objects
    FOR UPDATE USING (bucket_id = 'bukti-follow');

DROP POLICY IF EXISTS "Izinkan lihat bukti follow" ON storage.objects;
CREATE POLICY "Izinkan lihat bukti follow" ON storage.objects
    FOR SELECT USING (bucket_id = 'bukti-follow');

-- 6. event_sesi_absen: Daftar sesi absensi per event (Dibuat oleh admin)
CREATE TABLE IF NOT EXISTS event_sesi_absen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_slug TEXT NOT NULL DEFAULT 'antasari-media-lab',
    nama_sesi TEXT NOT NULL, -- contoh: 'Absensi Datang (Pagi)', 'Absensi Siang (ISHOMA)', 'Absensi Pulang'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. event_absensi: Rekap log kehadiran scan QR per sesi
CREATE TABLE IF NOT EXISTS event_absensi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesi_id UUID NOT NULL REFERENCES event_sesi_absen(id) ON DELETE CASCADE,
    event_slug TEXT NOT NULL DEFAULT 'antasari-media-lab',
    peserta_id UUID NOT NULL REFERENCES event_registrasi(id) ON DELETE CASCADE,
    nim TEXT NOT NULL,
    waktu_absen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metode TEXT NOT NULL DEFAULT 'qr_scan', -- 'qr_scan' | 'manual'
    catatan TEXT,
    CONSTRAINT unique_sesi_nim UNIQUE (sesi_id, nim)
);

-- Aktifkan RLS
ALTER TABLE event_sesi_absen ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_absensi ENABLE ROW LEVEL SECURITY;

-- Policy RLS
DROP POLICY IF EXISTS "Akses penuh event_sesi_absen" ON event_sesi_absen;
CREATE POLICY "Akses penuh event_sesi_absen" ON event_sesi_absen FOR ALL USING (true);

DROP POLICY IF EXISTS "Akses penuh event_absensi" ON event_absensi;
CREATE POLICY "Akses penuh event_absensi" ON event_absensi FOR ALL USING (true);

-- 8. event_sertifikat_config: Pengaturan generator sertifikat dinamis per event
CREATE TABLE IF NOT EXISTS event_sertifikat_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_slug TEXT NOT NULL UNIQUE DEFAULT 'antasari-media-lab',
    is_published BOOLEAN NOT NULL DEFAULT true, -- Saklar apakah peserta sudah boleh cek & unduh
    template_url TEXT DEFAULT '/images/event/sertifikat-template-aml.png', -- URL file gambar template A4 Landscape
    nomor_format TEXT NOT NULL DEFAULT '{nomor}/G/PP-AML/DEMA-U/UIN-A/BJM/X/2026', -- Format nomor surat/sertifikat
    nomor_start INTEGER NOT NULL DEFAULT 1,
    nama_pos_y INTEGER NOT NULL DEFAULT 1232, -- Posisi Y Nama Peserta (pada kanvas standar A4 3508x2480)
    nama_font_size INTEGER NOT NULL DEFAULT 86, -- Ukuran font Nama
    nama_color TEXT NOT NULL DEFAULT '#FFFFFF', -- Warna font Nama
    nomor_pos_x INTEGER NOT NULL DEFAULT 1754, -- Posisi X Nomor Surat (center=1754)
    nomor_pos_y INTEGER NOT NULL DEFAULT 845, -- Posisi Y Nomor Surat
    nomor_font_size INTEGER NOT NULL DEFAULT 44, -- Ukuran font Nomor Surat
    nomor_color TEXT NOT NULL DEFAULT '#FFFFFF',
    require_presensi BOOLEAN NOT NULL DEFAULT false, -- Syarat wajib sudah presensi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE event_sertifikat_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses penuh event_sertifikat_config" ON event_sertifikat_config;
CREATE POLICY "Akses penuh event_sertifikat_config" ON event_sertifikat_config FOR ALL USING (true);

-- Storage bucket untuk template sertifikat A4
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sertifikat-templates', 'sertifikat-templates', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Izinkan publik lihat template sertifikat" ON storage.objects;
CREATE POLICY "Izinkan publik lihat template sertifikat" ON storage.objects
    FOR SELECT USING (bucket_id = 'sertifikat-templates');

DROP POLICY IF EXISTS "Izinkan upload template sertifikat" ON storage.objects;
CREATE POLICY "Izinkan upload template sertifikat" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'sertifikat-templates');

DROP POLICY IF EXISTS "Izinkan update template sertifikat" ON storage.objects;
CREATE POLICY "Izinkan update template sertifikat" ON storage.objects
    FOR UPDATE USING (bucket_id = 'sertifikat-templates');

DROP POLICY IF EXISTS "Izinkan hapus template sertifikat" ON storage.objects;
CREATE POLICY "Izinkan hapus template sertifikat" ON storage.objects
    FOR DELETE USING (bucket_id = 'sertifikat-templates');


-- 9. event_feedback: Kuesioner evaluasi & kepuasan peserta
CREATE TABLE IF NOT EXISTS event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_slug TEXT NOT NULL DEFAULT 'antasari-media-lab',
    nim TEXT NOT NULL,
    nama TEXT NOT NULL,
    delegasi TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    materi_favorit TEXT,
    saran TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Izinkan publik kirim feedback" ON event_feedback;
CREATE POLICY "Izinkan publik kirim feedback" ON event_feedback
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Izinkan baca feedback" ON event_feedback;
CREATE POLICY "Izinkan baca feedback" ON event_feedback
    FOR SELECT USING (true);


-- 10. event_materi: Modul & Materi Pelatihan Event (Dikelola dari Admin)
CREATE TABLE IF NOT EXISTS event_materi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_slug TEXT NOT NULL DEFAULT 'antasari-media-lab',
    judul TEXT NOT NULL,
    sesi TEXT, -- contoh: 'Sesi 1: Desain Grafis', 'Sesi 2: Fotografi & Reels', 'Toolkit Umum'
    pemateri TEXT, -- contoh: 'Ihsan El Fikrie / Graphic Designer'
    deskripsi TEXT,
    tipe TEXT NOT NULL DEFAULT 'link', -- 'link', 'file', 'image', 'drive'
    file_url TEXT NOT NULL,
    button_label TEXT DEFAULT 'Buka Tautan',
    urutan INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE event_materi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses publik baca event_materi" ON event_materi;
CREATE POLICY "Akses publik baca event_materi" ON event_materi 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Akses penuh event_materi" ON event_materi;
CREATE POLICY "Akses penuh event_materi" ON event_materi 
    FOR ALL USING (true);

-- Storage bucket untuk materi event (file PDF/PPT, modul, infografis)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event-materi', 'event-materi', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Izinkan publik lihat file materi" ON storage.objects;
CREATE POLICY "Izinkan publik lihat file materi" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-materi');

DROP POLICY IF EXISTS "Izinkan upload materi" ON storage.objects;
CREATE POLICY "Izinkan upload materi" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'event-materi');

DROP POLICY IF EXISTS "Izinkan update materi" ON storage.objects;
CREATE POLICY "Izinkan update materi" ON storage.objects
    FOR UPDATE USING (bucket_id = 'event-materi');

DROP POLICY IF EXISTS "Izinkan hapus materi" ON storage.objects;
CREATE POLICY "Izinkan hapus materi" ON storage.objects
    FOR DELETE USING (bucket_id = 'event-materi');




