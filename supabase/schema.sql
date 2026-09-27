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

-- Storage bucket untuk bukti screenshot follow IG & TikTok
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bukti-follow', 'bukti-follow', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Izinkan upload bukti follow" ON storage.objects;
CREATE POLICY "Izinkan upload bukti follow" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'bukti-follow');

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



