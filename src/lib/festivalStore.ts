import { FestivalLomba, FestivalPendaftar } from "@/types";
import { initialFestivalLomba } from "@/data/festivalStarter";

// Global in-memory cache to ensure fallback data persistence during development
// and offline mode before Supabase database migration is run.
const globalState = globalThis as unknown as {
  __festivalLombaStore?: FestivalLomba[];
  __festivalPendaftarStore?: FestivalPendaftar[];
};

if (!globalState.__festivalLombaStore) {
  globalState.__festivalLombaStore = [...initialFestivalLomba];
}

if (!globalState.__festivalPendaftarStore) {
  globalState.__festivalPendaftarStore = [
    {
      id: "reg-sample-1",
      lomba_id: "fl-poster-2026",
      lomba_slug: "desain-poster",
      lomba_nama: "Lomba Desain Poster Digital",
      kode_pendaftaran: "FA26-POSTER-1001",
      nama_ketua: "Ahmad Rizky Pratama",
      nim_ketua: "220101030012",
      email: "ahmad.rizky@student.uin-antasari.ac.id",
      whatsapp: "081234567890",
      instansi: "UIN Antasari Banjarmasin",
      nama_tim: null,
      anggota_tim: null,
      file_ktm_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      file_pembayaran_url: null,
      file_follow_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80",
      link_karya: "https://drive.google.com/file/d/sample-poster-drive/view",
      custom_answers: {
        judul_karya: "Harmoni Banua Membangun Bangsa",
        deskripsi_singkat_karya: "Karya ini menggambarkan persatuan mahasiswa dalam melestarikan budaya lokal dan etos religius Banjar.",
      },
      status: "verified",
      catatan_admin: "KTM & Karya valid dan sesuai kriteria tema.",
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: "reg-sample-2",
      lomba_id: "fl-esport-2026",
      lomba_slug: "mlbb-championship",
      lomba_nama: "Turnamen E-Sport Mobile Legends",
      kode_pendaftaran: "FA26-MLBB-2002",
      nama_ketua: "Muhammad Ihsan",
      nim_ketua: "230102040055",
      email: "muh.ihsan@student.uin-antasari.ac.id",
      whatsapp: "085398765432",
      instansi: "UIN Antasari Banjarmasin",
      nama_tim: "Laskar Purnama Esports",
      anggota_tim: "1. Ihsan (Kapten)\n2. Farhan (Mid)\n3. Dimas (Gold)\n4. Bima (Roam)\n5. Rian (EXP)\n6. Kevin (Cadangan)",
      file_ktm_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      file_pembayaran_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
      file_follow_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80",
      link_karya: null,
      custom_answers: {
        id_server_kapten: "88291024 (2104)",
      },
      status: "pending",
      catatan_admin: null,
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  ];
}

export const festivalStore = {
  getLombaList(): FestivalLomba[] {
    const list = globalState.__festivalLombaStore || [];
    const pendaftar = globalState.__festivalPendaftarStore || [];
    return list.map((lomba) => {
      const count = pendaftar.filter((p) => p.lomba_slug === lomba.slug || p.lomba_id === lomba.id).length;
      return {
        ...lomba,
        pendaftar_count: (lomba.pendaftar_count || 0) + count,
      };
    });
  },

  getLombaBySlugOrId(identifier: string): FestivalLomba | undefined {
    const all = this.getLombaList();
    return all.find((l) => l.slug === identifier || l.id === identifier);
  },

  addLomba(newLomba: FestivalLomba): FestivalLomba {
    if (!globalState.__festivalLombaStore) {
      globalState.__festivalLombaStore = [];
    }
    globalState.__festivalLombaStore.unshift(newLomba);
    return newLomba;
  },

  updateLomba(id: string, updates: Partial<FestivalLomba>): FestivalLomba | null {
    if (!globalState.__festivalLombaStore) return null;
    const index = globalState.__festivalLombaStore.findIndex((l) => l.id === id);
    if (index === -1) return null;
    globalState.__festivalLombaStore[index] = {
      ...globalState.__festivalLombaStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return globalState.__festivalLombaStore[index];
  },

  deleteLomba(id: string): boolean {
    if (!globalState.__festivalLombaStore) return false;
    const initialLen = globalState.__festivalLombaStore.length;
    globalState.__festivalLombaStore = globalState.__festivalLombaStore.filter((l) => l.id !== id);
    return globalState.__festivalLombaStore.length < initialLen;
  },

  getPendaftarList(lombaFilter?: string): FestivalPendaftar[] {
    const list = globalState.__festivalPendaftarStore || [];
    if (!lombaFilter || lombaFilter === "all") return list;
    return list.filter((p) => p.lomba_slug === lombaFilter || p.lomba_id === lombaFilter);
  },

  addPendaftar(pendaftar: FestivalPendaftar): FestivalPendaftar {
    if (!globalState.__festivalPendaftarStore) {
      globalState.__festivalPendaftarStore = [];
    }
    globalState.__festivalPendaftarStore.unshift(pendaftar);
    return pendaftar;
  },

  updatePendaftarStatus(
    id: string,
    status: "pending" | "verified" | "rejected",
    catatan_admin?: string
  ): FestivalPendaftar | null {
    if (!globalState.__festivalPendaftarStore) return null;
    const index = globalState.__festivalPendaftarStore.findIndex((p) => p.id === id);
    if (index === -1) return null;
    globalState.__festivalPendaftarStore[index] = {
      ...globalState.__festivalPendaftarStore[index],
      status,
      catatan_admin: catatan_admin !== undefined ? catatan_admin : globalState.__festivalPendaftarStore[index].catatan_admin,
    };
    return globalState.__festivalPendaftarStore[index];
  },

  deletePendaftar(id: string): boolean {
    if (!globalState.__festivalPendaftarStore) return false;
    const initialLen = globalState.__festivalPendaftarStore.length;
    globalState.__festivalPendaftarStore = globalState.__festivalPendaftarStore.filter((p) => p.id !== id);
    return globalState.__festivalPendaftarStore.length < initialLen;
  },
};
