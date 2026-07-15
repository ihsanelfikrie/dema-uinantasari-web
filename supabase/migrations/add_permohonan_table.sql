-- 4. permohonan: tabel surat masuk dari formulir publik Layanan Persuratan
CREATE TABLE IF NOT EXISTS permohonan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap TEXT NOT NULL,
    organisasi TEXT NOT NULL,
    email TEXT NOT NULL,
    no_whatsapp TEXT NOT NULL,
    jenis_permohonan TEXT NOT NULL,
    keterangan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'baru', -- 'baru' | 'diproses' | 'selesai' | 'ditolak'
    catatan_admin TEXT,                  -- Catatan balasan dari admin (opsional)
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk sorting terbaru
CREATE INDEX IF NOT EXISTS permohonan_submitted_at_idx ON permohonan (submitted_at DESC);
