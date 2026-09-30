"use client";

import { useEffect, useState } from "react";
import { 
  FolderDown, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Link2, 
  FileDown, 
  Image as ImageIcon, 
  Folder, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowLeft,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface MateriItem {
  id: string;
  event_slug: string;
  judul: string;
  sesi: string;
  pemateri?: string | null;
  deskripsi?: string | null;
  tipe: "link" | "file" | "image" | "drive";
  file_url: string;
  button_label?: string | null;
  urutan: number;
  is_published: boolean;
  created_at: string;
}

export default function AdminMateriPage() {
  const [materiList, setMateriList] = useState<MateriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal / Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formJudul, setFormJudul] = useState("");
  const [formSesi, setFormSesi] = useState("Sesi 1: Desain Grafis");
  const [customSesi, setCustomSesi] = useState("");
  const [formPemateri, setFormPemateri] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formTipe, setFormTipe] = useState<"link" | "file" | "image" | "drive">("link");
  const [formFileUrl, setFormFileUrl] = useState("");
  const [formButtonLabel, setFormButtonLabel] = useState("Buka Tautan");
  const [formUrutan, setFormUrutan] = useState(1);
  const [formIsPublished, setFormIsPublished] = useState(true);

  const supabase = createClient();

  const fetchMateri = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(`/api/event/materi?event=antasari-media-lab&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setMateriList(Array.isArray(data) ? data : []);
      } else {
        setMateriList([]);
      }
    } catch (err: any) {
      setErrorMsg("Gagal mengambil data materi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateri();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormJudul("");
    setFormSesi("Sesi 1: Desain Grafis");
    setCustomSesi("");
    setFormPemateri("");
    setFormDeskripsi("");
    setFormTipe("link");
    setFormFileUrl("");
    setFormButtonLabel("Buka Tautan");
    setFormUrutan(materiList.length + 1);
    setFormIsPublished(true);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: MateriItem) => {
    setEditingId(item.id);
    setFormJudul(item.judul);
    
    const presetSesi = [
      "Sesi 1: Desain Grafis", 
      "Sesi 2: Fotografi & Reels", 
      "Sesi 3: Content Planning", 
      "Toolkit Umum"
    ];
    if (presetSesi.includes(item.sesi)) {
      setFormSesi(item.sesi);
      setCustomSesi("");
    } else {
      setFormSesi("Lainnya");
      setCustomSesi(item.sesi);
    }

    setFormPemateri(item.pemateri || "");
    setFormDeskripsi(item.deskripsi || "");
    setFormTipe(item.tipe || "link");
    setFormFileUrl(item.file_url);
    setFormButtonLabel(item.button_label || "Buka Tautan");
    setFormUrutan(item.urutan || 1);
    setFormIsPublished(item.is_published);
    setIsModalOpen(true);
  };

  // Helper ketika tipe diubah, update rekomendasi label tombol
  const handleTipeChange = (newTipe: "link" | "file" | "image" | "drive") => {
    setFormTipe(newTipe);
    if (!editingId) {
      if (newTipe === "link") setFormButtonLabel("Buka Template Canva");
      if (newTipe === "file") setFormButtonLabel("Download PDF Modul");
      if (newTipe === "image") setFormButtonLabel("Lihat Gambar Aset");
      if (newTipe === "drive") setFormButtonLabel("Buka Google Drive");
    }
  };

  // Handle Upload File / Dokumen / Gambar ke Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("Ukuran file maksimal adalah 20MB.");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg("");

      const fileExt = file.name.split(".").pop();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storagePath = `materi/${Date.now()}_${cleanFileName}`;

      let bucketName = "event-materi";
      let uploadRes = await supabase.storage.from(bucketName).upload(storagePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

      // Jika bucket event-materi belum dibuat di storage supabase, fallback ke bucket berita-images
      if (uploadRes.error) {
        bucketName = "berita-images";
        uploadRes = await supabase.storage.from(bucketName).upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
        });
      }

      if (uploadRes.error) {
        throw new Error(uploadRes.error.message);
      }

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
      setFormFileUrl(publicData.publicUrl);
      
      // Auto isi judul jika masih kosong
      if (!formJudul) {
        setFormJudul(file.name.replace(/\.[^/.]+$/, ""));
      }

      setSuccessMsg("File berhasil diunggah ke storage!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg("Gagal mengunggah file: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle Simpan (Tambah / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim()) {
      alert("Harap masukkan judul materi.");
      return;
    }
    if (!formFileUrl.trim()) {
      alert("Harap unggah file atau masukkan tautan URL materi.");
      return;
    }

    const finalSesi = formSesi === "Lainnya" ? (customSesi.trim() || "Umum") : formSesi;

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        event_slug: "antasari-media-lab",
        judul: formJudul.trim(),
        sesi: finalSesi,
        pemateri: formPemateri.trim() || null,
        deskripsi: formDeskripsi.trim() || null,
        tipe: formTipe,
        file_url: formFileUrl.trim(),
        button_label: formButtonLabel.trim() || "Buka Tautan",
        urutan: Number(formUrutan) || 1,
        is_published: formIsPublished,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/event/materi/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/event/materi`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan modul materi.");
      }

      setSuccessMsg(editingId ? "Modul materi berhasil diperbarui!" : "Modul materi baru berhasil ditambahkan!");
      setTimeout(() => setSuccessMsg(""), 3500);
      resetForm();
      fetchMateri();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Hapus Materi
  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus materi "${judul}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/event/materi/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menghapus materi.");
      }
      setSuccessMsg("Modul materi berhasil dihapus.");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchMateri();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Toggle Publish Langsung
  const handleTogglePublish = async (item: MateriItem) => {
    try {
      const res = await fetch(`/api/event/materi/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !item.is_published }),
      });
      if (res.ok) {
        setMateriList((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, is_published: !m.is_published } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1C4BBC]/10 text-[#1C4BBC]">
              <FolderDown className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C4BBC]">
              Antasari Media Lab
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-poppins">
            Kelola Modul & Materi Event
          </h1>
          <p className="text-xs text-neutral-500">
            Unggah dan atur berbagai format modul (slide PDF/PPT, link Canva, infografis gambar, folder Drive) yang dapat diakses peserta.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/event/antasari-media-lab?tab=materi"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-bold transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat Halaman Publik</span>
          </Link>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C4BBC] hover:bg-[#153a99] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Modul Baru</span>
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Total Modul</span>
          <span className="text-2xl font-black text-neutral-900 font-poppins">{materiList.length}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Terpublikasi (Live)</span>
          <span className="text-2xl font-black text-emerald-600 font-poppins">
            {materiList.filter((m) => m.is_published).length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Draft / Disembunyikan</span>
          <span className="text-2xl font-black text-amber-600 font-poppins">
            {materiList.filter((m) => !m.is_published).length}
          </span>
        </div>
      </div>

      {/* Tabel / Daftar Modul */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-800">Daftar Modul & Materi</h2>
          <button
            type="button"
            onClick={fetchMateri}
            className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#1C4BBC]" />
            <p>Memuat daftar materi...</p>
          </div>
        ) : materiList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <FolderDown className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-bold text-neutral-800">Belum Ada Modul Ditambahkan</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Di halaman publik, peserta saat ini melihat tampilan <strong>&ldquo;Modul Belum Tersedia / Segera Hadir&rdquo;</strong>. Klik tombol di bawah untuk menambahkan modul pertama.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C4BBC] hover:bg-[#153a99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Modul Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 text-neutral-500 font-semibold border-b border-neutral-100">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Urutan</th>
                  <th className="py-3 px-4">Judul & Pemateri</th>
                  <th className="py-3 px-4">Sesi / Kategori</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Tautan / Aset</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {materiList.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-neutral-500">
                      {item.urutan}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5 max-w-xs">
                      <span className="font-bold text-neutral-900 block">{item.judul}</span>
                      {item.pemateri && (
                        <span className="text-[11px] text-[#1C4BBC] font-medium block">
                          {item.pemateri}
                        </span>
                      )}
                      {item.deskripsi && (
                        <span className="text-[10px] text-neutral-400 line-clamp-1 block">
                          {item.deskripsi}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-700">
                        {item.sesi || "Umum"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.tipe === "image" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          <ImageIcon className="w-3 h-3" />
                          <span>Gambar</span>
                        </span>
                      )}
                      {item.tipe === "file" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <FileDown className="w-3 h-3" />
                          <span>File Dokumen</span>
                        </span>
                      )}
                      {item.tipe === "drive" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Folder className="w-3 h-3" />
                          <span>Google Drive</span>
                        </span>
                      )}
                      {item.tipe === "link" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          <Link2 className="w-3 h-3" />
                          <span>Link Tautan</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#1C4BBC] hover:underline font-medium truncate max-w-[180px]"
                        title={item.file_url}
                      >
                        <span className="truncate">{item.button_label || "Buka"}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                          item.is_published
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                        }`}
                        title="Klik untuk ubah status tampil"
                      >
                        {item.is_published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-[#1C4BBC] hover:bg-neutral-100 transition-colors"
                          title="Edit Modul"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.judul)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus Modul"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL TAMBAH / EDIT MODUL
      ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-2xl w-full max-w-xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C4BBC]">
                  {editingId ? "Perbarui Materi" : "Modul Baru"}
                </span>
                <h3 className="text-lg font-extrabold text-neutral-900 font-poppins">
                  {editingId ? "Edit Modul Materi" : "Tambah Modul Materi Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Judul Materi */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Judul Modul / Materi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Slide PPT Desain Grafis & Identitas Visual"
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs"
                />
              </div>

              {/* Sesi / Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Sesi / Kategori
                  </label>
                  <select
                    value={formSesi}
                    onChange={(e) => setFormSesi(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs bg-white"
                  >
                    <option value="Sesi 1: Desain Grafis">Sesi 1: Desain Grafis</option>
                    <option value="Sesi 2: Fotografi & Reels">Sesi 2: Fotografi & Reels</option>
                    <option value="Sesi 3: Content Planning">Sesi 3: Content Planning</option>
                    <option value="Toolkit Umum">Toolkit Umum</option>
                    <option value="Lainnya">Kustom / Lainnya</option>
                  </select>
                </div>

                {formSesi === "Lainnya" ? (
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Nama Sesi Kustom
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Sesi Bonus / Workshop"
                      value={customSesi}
                      onChange={(e) => setCustomSesi(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Pemateri / Narasumber
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ihsan El Fikrie / Graphic Designer"
                      value={formPemateri}
                      onChange={(e) => setFormPemateri(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs"
                    />
                  </div>
                )}
              </div>

              {formSesi === "Lainnya" && (
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Pemateri / Narasumber
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ihsan El Fikrie / Graphic Designer"
                    value={formPemateri}
                    onChange={(e) => setFormPemateri(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs"
                  />
                </div>
              )}

              {/* Deskripsi */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Deskripsi / Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan poin materi atau panduan penggunaan modul..."
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs"
                />
              </div>

              {/* Format / Tipe Modul */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  Format / Tipe Modul
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTipeChange("link")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      formTipe === "link"
                        ? "border-[#1C4BBC] bg-[#1C4BBC]/5 text-[#1C4BBC] font-bold"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    <span className="text-[11px]">Link / Canva</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipeChange("file")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      formTipe === "file"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <FileDown className="w-4 h-4" />
                    <span className="text-[11px]">File / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipeChange("image")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      formTipe === "image"
                        ? "border-purple-600 bg-purple-50 text-purple-800 font-bold"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-[11px]">Gambar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipeChange("drive")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      formTipe === "drive"
                        ? "border-amber-600 bg-amber-50 text-amber-800 font-bold"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    <span className="text-[11px]">Google Drive</span>
                  </button>
                </div>
              </div>

              {/* Upload File Langsung (Opsional / Praktis) */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800 text-[11px]">
                    Unggah File Langsung ke Storage (PDF, PPT, Gambar, ZIP)
                  </span>
                  {uploading && <span className="text-[10px] text-[#1C4BBC] font-bold animate-pulse">Mengunggah...</span>}
                </div>
                <input
                  type="file"
                  disabled={uploading}
                  onChange={handleFileUpload}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1C4BBC] file:text-white hover:file:bg-[#153a99] cursor-pointer"
                />
              </div>

              {/* URL File / Tautan */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  URL / Tautan Modul <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/... atau https://canva.com/..."
                  value={formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs font-mono"
                />
                <span className="text-[10px] text-neutral-400 block mt-1">
                  Bisa berupa link Google Drive, Canva Template, YouTube, atau URL file yang otomatis terisi dari tombol unggah di atas.
                </span>
              </div>

              {/* Label Tombol & Urutan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Label Tombol Aksi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Download PDF Materi"
                    value={formButtonLabel}
                    onChange={(e) => setFormButtonLabel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formUrutan}
                    onChange={(e) => setFormUrutan(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#1C4BBC] text-neutral-800 text-xs"
                  />
                </div>
              </div>

              {/* Status Publikasi */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1C4BBC] focus:ring-[#1C4BBC]"
                  />
                  <span className="font-bold text-neutral-800 text-xs">
                    Publikasikan ke Halaman Peserta Sekarang
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C4BBC] hover:bg-[#153a99] text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingId ? "Simpan Perubahan" : "Tambah Modul"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
