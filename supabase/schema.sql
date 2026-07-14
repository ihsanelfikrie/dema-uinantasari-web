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
