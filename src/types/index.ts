export interface Berita {
  id: string;
  judul: string;
  slug: string;
  kategori: string; // e.g., 'Berita Nasional' | 'Berita Kampus' | 'Pengumuman'
  cover_url: string;
  isi: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Kegiatan {
  id: string;
  nama: string;
  deskripsi: string;
  kementerian: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi?: string;
  created_at: string;
}

export interface Dokumen {
  id: string;
  nama: string;
  kategori: "Surat Keluar" | "Surat Masuk" | "SK" | "Notulensi" | "Lainnya";
  file_url: string;
  deskripsi?: string;
  uploaded_at: string;
}
