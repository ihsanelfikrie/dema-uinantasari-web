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

export interface Sambat {
  id: string;
  text_konten: string;
  warna_sticky_note: string;
  koordinat_x: number;
  koordinat_y: number;
  rotasi: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

// Festival Antasari Form Maker & Lomba Types
export interface FormCustomField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "link" | "number" | "file";
  required: boolean;
  placeholder?: string;
  options?: string[];
  help_text?: string;
}

export interface FormConfig {
  // Pengaturan Label & Keaktifan Kolom Identitas Standar
  label_nama?: string;
  enable_nim?: boolean;
  label_nim?: string;
  enable_instansi?: boolean;
  label_instansi?: string;
  enable_email?: boolean;
  enable_whatsapp?: boolean;

  // Pengaturan Kolom Tim / Beregu
  label_nama_tim?: string;
  label_anggota_tim?: string;
  max_anggota_tim?: number;

  // Pengaturan Berkas Persyaratan
  require_ktm: boolean;
  label_ktm?: string;
  require_bukti_transfer: boolean;
  label_bukti_transfer?: string;
  require_bukti_follow: boolean;
  label_bukti_follow?: string;
  require_link_karya: boolean;
  label_link_karya?: string;

  // Catatan Pembayaran & Rekening
  catatan_pembayaran?: string;
  nomor_rekening?: string;

  // Pasca Pendaftaran
  link_group_wa?: string;
  pesan_sukses?: string;

  // Kolom Pertanyaan Kustom
  custom_fields?: FormCustomField[];
}

export interface FestivalLomba {
  id: string;
  nama_lomba: string;
  slug: string;
  kategori: string;
  tipe_peserta: "individu" | "tim";
  deskripsi: string;
  persyaratan?: string;
  kuota_maksimal?: number | null;
  biaya_registrasi: string;
  tanggal_buka?: string | null;
  tanggal_tutup?: string | null;
  link_juknis?: string | null;
  kontak_pj?: string | null;
  status: "open" | "closed" | "upcoming";
  form_config: FormConfig;
  pendaftar_count?: number;
  created_at: string;
  updated_at: string;
}

export interface FestivalPendaftar {
  id: string;
  lomba_id: string;
  lomba_slug: string;
  lomba_nama?: string;
  kode_pendaftaran: string;
  nama_ketua: string;
  nim_ketua: string;
  email: string;
  whatsapp: string;
  instansi: string;
  nama_tim?: string | null;
  anggota_tim?: string | null;
  file_ktm_url?: string | null;
  file_pembayaran_url?: string | null;
  file_follow_url?: string | null;
  link_karya?: string | null;
  custom_answers?: Record<string, string>;
  status: "pending" | "verified" | "rejected";
  catatan_admin?: string | null;
  created_at: string;
}
