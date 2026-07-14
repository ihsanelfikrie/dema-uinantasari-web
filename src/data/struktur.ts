export interface Fungsionaris {
  id: string;
  nama: string;
  jabatan: string;
  tupoksi: string;
  fotoUrl: string;
}

export interface Kementerian {
  id: string;
  nama: string;
  menteri: Fungsionaris;
  sekretaris?: Fungsionaris;
  anggota: Fungsionaris[];
}

export const bph = {
  ketua: {
    id: "ketua",
    nama: "[Nama Ketua Umum — isi di sini]",
    jabatan: "Ketua Umum DEMA",
    tupoksi:
      "Memimpin, mengoordinasikan, dan mengendalikan seluruh aktivitas organisasi DEMA UIN Antasari secara internal maupun eksternal.",
    fotoUrl: "/images/kabinet/placeholder.png",
  },
  wakilKetua: {
    id: "wakil-ketua",
    nama: "[Nama Wakil Ketua Umum — isi di sini]",
    jabatan: "Wakil Ketua Umum DEMA",
    tupoksi:
      "Membantu Ketua Umum dalam memimpin organisasi, mengoordinasikan kementerian, dan mewakili Ketua Umum jika berhalangan.",
    fotoUrl: "/images/kabinet/placeholder.png",
  },
  sekjen: {
    id: "sekjen",
    nama: "[Nama Sekretaris Jenderal — isi di sini]",
    jabatan: "Sekretaris Jenderal",
    tupoksi:
      "Mengelola seluruh administrasi, tata kelola organisasi, persuratan, dan koordinasi sekretariatan DEMA.",
    fotoUrl: "/images/kabinet/placeholder.png",
  },
  bendum: {
    id: "bendum",
    nama: "[Nama Bendahara Umum — isi di sini]",
    jabatan: "Bendahara Umum",
    tupoksi:
      "Mengelola keuangan, anggaran belanja, administrasi keuangan, dan pembukuan keuangan DEMA.",
    fotoUrl: "/images/kabinet/placeholder.png",
  },
};

export const kementerianList: Kementerian[] = [
  {
    id: "kemendagri",
    nama: "Kementerian Dalam Negeri",
    menteri: {
      id: "menteri-dagri",
      nama: "[Nama Menteri Dalam Negeri — isi di sini]",
      jabatan: "Menteri Dalam Negeri",
      tupoksi:
        "Mengurus hubungan internal kemahasiswaan UIN Antasari, koordinasi dengan UKM/UKK dan organisasi internal lainnya.",
      fotoUrl: "/images/kabinet/placeholder.png",
    },
    anggota: [
      {
        id: "anggota-dagri-1",
        nama: "[Nama Anggota Dagri — isi di sini]",
        jabatan: "Staf Ahli",
        tupoksi:
          "Membantu pelaksanaan fungsi koordinasi internal organisasi mahasiswa kampus.",
        fotoUrl: "/images/kabinet/placeholder.png",
      },
    ],
  },
  {
    id: "kemenlu",
    nama: "Kementerian Luar Negeri",
    menteri: {
      id: "menteri-luar",
      nama: "[Nama Menteri Luar Negeri — isi di sini]",
      jabatan: "Menteri Luar Negeri",
      tupoksi:
        "Membangun hubungan kerja sama dengan organisasi mahasiswa di luar kampus, lembaga eksternal, dan masyarakat luas.",
      fotoUrl: "/images/kabinet/placeholder.png",
    },
    anggota: [
      {
        id: "anggota-luar-1",
        nama: "[Nama Anggota Luar — isi di sini]",
        jabatan: "Staf Ahli",
        tupoksi:
          "Membantu pelaksanaan program kerja komunikasi dan diplomasi eksternal kampus.",
        fotoUrl: "/images/kabinet/placeholder.png",
      },
    ],
  },
  {
    id: "kemenag-sos",
    nama: "Kementerian Agama & Sosial",
    menteri: {
      id: "menteri-ag-sos",
      nama: "[Nama Menteri Agama & Sosial — isi di sini]",
      jabatan: "Menteri Agama & Sosial",
      tupoksi:
        "Menyelenggarakan kegiatan keagamaan, pembinaan spiritual mahasiswa, dan aksi tanggap sosial kemasyarakatan.",
      fotoUrl: "/images/kabinet/placeholder.png",
    },
    anggota: [],
  },
  {
    id: "kominfo-advokasi",
    nama: "Kementerian Komunikasi, Informasi & Advokasi",
    menteri: {
      id: "menteri-kominfo",
      nama: "[Nama Menteri Kominfo & Advokasi — isi di sini]",
      jabatan: "Menteri Kominfo & Advokasi",
      tupoksi:
        "Mengelola media komunikasi resmi DEMA, publikasi berita, pengumuman, serta mengoordinasikan advokasi pelayanan mahasiswa.",
      fotoUrl: "/images/kabinet/placeholder.png",
    },
    anggota: [],
  },
  {
    id: "kemenpora-seni",
    nama: "Kementerian Pemuda, Seni, Budaya & Olahraga",
    menteri: {
      id: "menteri-pora",
      nama: "[Nama Menteri Pemuda, Seni & Olahraga — isi di sini]",
      jabatan: "Menteri Pemuda, Seni & Olahraga",
      tupoksi:
        "Mengembangkan bakat, minat, dan kreativitas mahasiswa di bidang seni, budaya, pemuda, dan olahraga.",
      fotoUrl: "/images/kabinet/placeholder.png",
    },
    anggota: [],
  },
  {
    id: "kemenpp",
    nama: "Kementerian Pemberdayaan Perempuan",
    menteri: {
      id: "menteri-pp",
      nama: "[Nama Menteri Pemberdayaan Perempuan — isi di sini]",
      jabatan: "Menteri Pemberdayaan Perempuan",
      tupoksi:
        "Fokus pada pengarusutamaan gender, hak-hak perempuan di kampus, kajian isu perempuan, serta pemberdayaan potensi mahasiswi.",
      fotoUrl: "/images/kabinet/placeholder.png",
    },
    anggota: [],
  },
];
