"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Trash2,
  Users,
  Download,
  Eye,
  Calendar,
  DollarSign,
  FileText,
  Layers,
  Sparkles,
  Link as LinkIcon,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Upload,
  RefreshCw,
  Settings2,
  ListPlus,
  Sliders,
  Smartphone,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { FestivalLomba, FestivalPendaftar, FormCustomField, FormConfig } from "@/types";
import { formMakerPresets } from "@/data/festivalStarter";

export default function AdminFestivalAntasariPage() {
  const [activeTab, setActiveTab] = useState<"lomba" | "pendaftar">("lomba");
  const [lombaList, setLombaList] = useState<FestivalLomba[]>([]);
  const [pendaftarList, setPendaftarList] = useState<FestivalPendaftar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Form Maker Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"builder" | "preview">("builder");
  const [editingLombaId, setEditingLombaId] = useState<string | null>(null);

  // Pendaftar Modal / Detail State
  const [selectedPendaftar, setSelectedPendaftar] = useState<FestivalPendaftar | null>(null);
  const [activeProofTab, setActiveProofTab] = useState<"ktm" | "bayar" | "follow">("ktm");

  // Filter & Search
  const [lombaFilter, setLombaFilter] = useState("all");
  const [searchPendaftar, setSearchPendaftar] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ==================== FORM BUILDER STATES ====================
  // Info Dasar Lomba
  const [namaLomba, setNamaLomba] = useState("");
  const [slug, setSlug] = useState("");
  const [kategori, setKategori] = useState("Media & Kreatif");
  const [tipePeserta, setTipePeserta] = useState<"individu" | "tim">("individu");
  const [biayaRegistrasi, setBiayaRegistrasi] = useState("Gratis");
  const [kuotaMaksimal, setKuotaMaksimal] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState("");
  const [persyaratan, setPersyaratan] = useState("");
  const [linkJuknis, setLinkJuknis] = useState("");
  const [kontakPj, setKontakPj] = useState("");
  const [statusLomba, setStatusLomba] = useState<"open" | "closed" | "upcoming">("open");

  // Kustomisasi Kolom Identitas Standar
  const [labelNama, setLabelNama] = useState("Nama Lengkap Ketua / Peserta");
  const [enableNim, setEnableNim] = useState(true);
  const [labelNim, setLabelNim] = useState("NIM (Nomor Induk Mahasiswa)");
  const [enableInstansi, setEnableInstansi] = useState(true);
  const [labelInstansi, setLabelInstansi] = useState("Instansi / Fakultas / Kampus");
  const [enableEmail, setEnableEmail] = useState(true);
  const [enableWhatsapp, setEnableWhatsapp] = useState(true);

  // Kustomisasi Kolom Tim / Beregu
  const [labelNamaTim, setLabelNamaTim] = useState("Nama Tim / Squad");
  const [labelAnggotaTim, setLabelAnggotaTim] = useState("Daftar Nama & NIM Anggota Tim");
  const [maxAnggotaTim, setMaxAnggotaTim] = useState<number>(5);

  // Kustomisasi Berkas & Upload
  const [requireKtm, setRequireKtm] = useState(true);
  const [labelKtm, setLabelKtm] = useState("Kartu Tanda Mahasiswa (KTM)");
  const [requireBuktiTransfer, setRequireBuktiTransfer] = useState(false);
  const [labelBuktiTransfer, setLabelBuktiTransfer] = useState("Bukti Transfer / Pembayaran");
  const [requireBuktiFollow, setRequireBuktiFollow] = useState(true);
  const [labelBuktiFollow, setLabelBuktiFollow] = useState("Bukti Follow Instagram @dema.uin.antasari");
  const [requireLinkKarya, setRequireLinkKarya] = useState(false);
  const [labelLinkKarya, setLabelLinkKarya] = useState("Tautan Berkas Karya (Google Drive)");

  // Rekening & WhatsApp & Pesan
  const [nomorRekening, setNomorRekening] = useState("");
  const [catatanPembayaran, setCatatanPembayaran] = useState("");
  const [linkGroupWa, setLinkGroupWa] = useState("");
  const [pesanSukses, setPesanSukses] = useState("Pendaftaran berhasil! Silakan gabung ke grup WhatsApp resmi.");

  // Pertanyaan Kustom
  const [customFields, setCustomFields] = useState<FormCustomField[]>([]);

  // Feedback notifications
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Fetch initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resLomba, resPendaftar] = await Promise.all([
        fetch("/api/festival/lomba", { cache: "no-store" }),
        fetch("/api/festival/pendaftar", { cache: "no-store" }),
      ]);

      if (resLomba.ok) {
        const dataL = await resLomba.json();
        setLombaList(dataL);
      }
      if (resPendaftar.ok) {
        const dataP = await resPendaftar.json();
        setPendaftarList(dataP);
      }
    } catch (err) {
      console.error("Gagal memuat data festival:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick preset application
  const applyPreset = (preset: typeof formMakerPresets[0]) => {
    setKategori(preset.kategori);
    setTipePeserta(preset.tipe_peserta);
    setBiayaRegistrasi(preset.biaya_registrasi);
    setDeskripsi(preset.deskripsi_template);
    setPersyaratan(preset.persyaratan_template);
    setRequireKtm(preset.form_config.require_ktm);
    setRequireBuktiTransfer(preset.form_config.require_bukti_transfer);
    setRequireBuktiFollow(preset.form_config.require_bukti_follow);
    setRequireLinkKarya(preset.form_config.require_link_karya);
    if (preset.form_config.label_link_karya) {
      setLabelLinkKarya(preset.form_config.label_link_karya);
    }
    if (preset.form_config.max_anggota_tim) {
      setMaxAnggotaTim(preset.form_config.max_anggota_tim);
    }
    if (preset.form_config.nomor_rekening) {
      setNomorRekening(preset.form_config.nomor_rekening);
    }
    if (preset.form_config.catatan_pembayaran) {
      setCatatanPembayaran(preset.form_config.catatan_pembayaran);
    }
    if (preset.form_config.custom_fields) {
      setCustomFields([...preset.form_config.custom_fields]);
    }
    showAlert("success", `Preset "${preset.nama_preset}" berhasil diterapkan!`);
  };

  // Quick helper to insert popular questions
  const addQuickField = (preset: {
    label: string;
    type: "text" | "textarea" | "select" | "number" | "link";
    placeholder?: string;
    options?: string[];
    help_text?: string;
  }) => {
    const newField: FormCustomField = {
      id: `field_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
      label: preset.label,
      type: preset.type,
      required: true,
      placeholder: preset.placeholder || "",
      options: preset.options || [],
      help_text: preset.help_text || "",
    };
    setCustomFields((prev) => [...prev, newField]);
    showAlert("success", `Kolom "${preset.label}" ditambahkan!`);
  };

  // Reset form to clean state
  const resetForm = () => {
    setEditingLombaId(null);
    setModalMode("builder");
    setNamaLomba("");
    setSlug("");
    setKategori("Media & Kreatif");
    setTipePeserta("individu");
    setBiayaRegistrasi("Gratis");
    setKuotaMaksimal("");
    setDeskripsi("");
    setPersyaratan("");
    setLinkJuknis("");
    setKontakPj("");
    setStatusLomba("open");

    // Standard fields
    setLabelNama("Nama Lengkap Ketua / Peserta");
    setEnableNim(true);
    setLabelNim("NIM (Nomor Induk Mahasiswa)");
    setEnableInstansi(true);
    setLabelInstansi("Instansi / Fakultas / Kampus");
    setEnableEmail(true);
    setEnableWhatsapp(true);

    // Tim
    setLabelNamaTim("Nama Tim / Squad");
    setLabelAnggotaTim("Daftar Nama & NIM Anggota Tim");
    setMaxAnggotaTim(5);

    // Berkas
    setRequireKtm(true);
    setLabelKtm("Kartu Tanda Mahasiswa (KTM)");
    setRequireBuktiTransfer(false);
    setLabelBuktiTransfer("Bukti Transfer / Pembayaran");
    setRequireBuktiFollow(true);
    setLabelBuktiFollow("Bukti Follow Instagram @dema.uin.antasari");
    setRequireLinkKarya(false);
    setLabelLinkKarya("Tautan Berkas Karya (Google Drive)");

    // Info
    setNomorRekening("");
    setCatatanPembayaran("");
    setLinkGroupWa("");
    setPesanSukses("Pendaftaran berhasil! Silakan gabung ke grup WhatsApp resmi.");
    setCustomFields([]);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (lomba: FestivalLomba) => {
    setEditingLombaId(lomba.id);
    setModalMode("builder");
    setNamaLomba(lomba.nama_lomba);
    setSlug(lomba.slug);
    setKategori(lomba.kategori);
    setTipePeserta(lomba.tipe_peserta);
    setBiayaRegistrasi(lomba.biaya_registrasi);
    setKuotaMaksimal(lomba.kuota_maksimal ? String(lomba.kuota_maksimal) : "");
    setDeskripsi(lomba.deskripsi || "");
    setPersyaratan(lomba.persyaratan || "");
    setLinkJuknis(lomba.link_juknis || "");
    setKontakPj(lomba.kontak_pj || "");
    setStatusLomba(lomba.status);

    const cfg = lomba.form_config || {};
    setLabelNama(cfg.label_nama || "Nama Lengkap Ketua / Peserta");
    setEnableNim(cfg.enable_nim ?? true);
    setLabelNim(cfg.label_nim || "NIM (Nomor Induk Mahasiswa)");
    setEnableInstansi(cfg.enable_instansi ?? true);
    setLabelInstansi(cfg.label_instansi || "Instansi / Fakultas / Kampus");
    setEnableEmail(cfg.enable_email ?? true);
    setEnableWhatsapp(cfg.enable_whatsapp ?? true);

    setLabelNamaTim(cfg.label_nama_tim || "Nama Tim / Squad");
    setLabelAnggotaTim(cfg.label_anggota_tim || "Daftar Nama & NIM Anggota Tim");
    setMaxAnggotaTim(cfg.max_anggota_tim || 5);

    setRequireKtm(cfg.require_ktm ?? true);
    setLabelKtm(cfg.label_ktm || "Kartu Tanda Mahasiswa (KTM)");
    setRequireBuktiTransfer(cfg.require_bukti_transfer ?? false);
    setLabelBuktiTransfer(cfg.label_bukti_transfer || "Bukti Transfer / Pembayaran");
    setRequireBuktiFollow(cfg.require_bukti_follow ?? true);
    setLabelBuktiFollow(cfg.label_bukti_follow || "Bukti Follow Instagram @dema.uin.antasari");
    setRequireLinkKarya(cfg.require_link_karya ?? false);
    setLabelLinkKarya(cfg.label_link_karya || "Tautan Berkas Karya (Google Drive)");

    setNomorRekening(cfg.nomor_rekening || "");
    setCatatanPembayaran(cfg.catatan_pembayaran || "");
    setLinkGroupWa(cfg.link_group_wa || "");
    setPesanSukses(cfg.pesan_sukses || "Pendaftaran berhasil! Silakan gabung ke grup WhatsApp resmi.");
    setCustomFields(cfg.custom_fields || []);

    setIsModalOpen(true);
  };

  // Add blank custom question
  const addCustomField = () => {
    const newField: FormCustomField = {
      id: `field_${Date.now().toString(36)}`,
      label: "",
      type: "text",
      required: true,
      placeholder: "",
      options: [],
      help_text: "",
    };
    setCustomFields((prev) => [...prev, newField]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, updates: Partial<FormCustomField>) => {
    setCustomFields((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  // Handle Save Lomba
  const handleSaveLomba = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLomba.trim()) {
      showAlert("error", "Nama lomba wajib diisi.");
      return;
    }

    setIsSaving(true);
    const payload = {
      nama_lomba: namaLomba.trim(),
      slug: slug.trim() || undefined,
      kategori,
      tipe_peserta: tipePeserta,
      deskripsi: deskripsi.trim(),
      persyaratan: persyaratan.trim(),
      kuota_maksimal: kuotaMaksimal ? Number(kuotaMaksimal) : null,
      biaya_registrasi: biayaRegistrasi.trim() || "Gratis",
      link_juknis: linkJuknis.trim() || null,
      kontak_pj: kontakPj.trim() || null,
      status: statusLomba,
      form_config: {
        label_nama: labelNama.trim(),
        enable_nim: enableNim,
        label_nim: labelNim.trim(),
        enable_instansi: enableInstansi,
        label_instansi: labelInstansi.trim(),
        enable_email: enableEmail,
        enable_whatsapp: enableWhatsapp,
        label_nama_tim: labelNamaTim.trim(),
        label_anggota_tim: labelAnggotaTim.trim(),
        max_anggota_tim: tipePeserta === "tim" ? Number(maxAnggotaTim) : 1,
        require_ktm: requireKtm,
        label_ktm: labelKtm.trim(),
        require_bukti_transfer: requireBuktiTransfer,
        label_bukti_transfer: labelBuktiTransfer.trim(),
        require_bukti_follow: requireBuktiFollow,
        label_bukti_follow: labelBuktiFollow.trim(),
        require_link_karya: requireLinkKarya,
        label_link_karya: labelLinkKarya.trim(),
        nomor_rekening: nomorRekening.trim(),
        catatan_pembayaran: catatanPembayaran.trim(),
        link_group_wa: linkGroupWa.trim(),
        pesan_sukses: pesanSukses.trim(),
        custom_fields: customFields.filter((f) => f.label.trim().length > 0),
      },
    };

    try {
      if (editingLombaId) {
        // Update
        const res = await fetch(`/api/festival/lomba/${editingLombaId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal mengupdate form lomba.");
        showAlert("success", "Form lomba berhasil diperbarui!");
      } else {
        // Create new
        const res = await fetch("/api/festival/lomba", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Gagal membuat form lomba baru.");
        showAlert("success", "Form lomba baru berhasil diterbitkan!");
      }

      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      showAlert("error", err.message || "Terjadi kesalahan saat menyimpan form.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Status Open/Closed directly
  const handleToggleStatus = async (lomba: FestivalLomba) => {
    const nextStatus = lomba.status === "open" ? "closed" : "open";
    try {
      const res = await fetch(`/api/festival/lomba/${lomba.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setLombaList((prev) =>
          prev.map((l) => (l.id === lomba.id ? { ...l, status: nextStatus } : l))
        );
        showAlert("success", `Status "${lomba.nama_lomba}" diubah ke ${nextStatus === "open" ? "Buka" : "Tutup"}.`);
      }
    } catch {
      showAlert("error", "Gagal memperbarui status lomba.");
    }
  };

  // Delete Lomba
  const handleDeleteLomba = async (id: string, name: string) => {
    if (!confirm(`Hapus form cabang lomba "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/festival/lomba/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLombaList((prev) => prev.filter((l) => l.id !== id));
        showAlert("success", `Lomba "${name}" berhasil dihapus.`);
      }
    } catch {
      showAlert("error", "Gagal menghapus lomba.");
    }
  };

  // Copy registration link
  const copyPublicLink = (slugName: string) => {
    const url = `${window.location.origin}/event/festival-antasari/daftar/${slugName}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(slugName);
    showAlert("success", "Tautan formulir pendaftaran berhasil disalin!");
    setTimeout(() => setCopiedLink(null), 3000);
  };

  // Update participant status
  const handleUpdatePendaftarStatus = async (
    pendaftarId: string,
    newStatus: "pending" | "verified" | "rejected"
  ) => {
    try {
      const res = await fetch(`/api/festival/pendaftar/${pendaftarId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPendaftarList((prev) =>
          prev.map((p) => (p.id === pendaftarId ? { ...p, status: newStatus } : p))
        );
        if (selectedPendaftar?.id === pendaftarId) {
          setSelectedPendaftar((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showAlert("success", `Status pendaftar diubah menjadi ${newStatus}.`);
      }
    } catch {
      showAlert("error", "Gagal memperbarui status pendaftar.");
    }
  };

  // Delete participant
  const handleDeletePendaftar = async (id: string, name: string) => {
    if (!confirm(`Hapus pendaftar "${name}"?`)) return;
    try {
      const res = await fetch(`/api/festival/pendaftar/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPendaftarList((prev) => prev.filter((p) => p.id !== id));
        if (selectedPendaftar?.id === id) setSelectedPendaftar(null);
        showAlert("success", "Pendaftar berhasil dihapus.");
      }
    } catch {
      showAlert("error", "Gagal menghapus pendaftar.");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (pendaftarList.length === 0) {
      showAlert("error", "Belum ada data pendaftar untuk diekspor.");
      return;
    }

    const headers = [
      "Kode Pendaftaran",
      "Nama Lomba",
      "Nama Ketua / Peserta",
      "NIM",
      "Email",
      "WhatsApp",
      "Instansi",
      "Nama Tim",
      "Anggota Tim",
      "Link Karya",
      "File KTM",
      "File Bukti Bayar",
      "Status",
      "Tanggal Daftar",
    ];

    const rows = filteredPendaftar.map((p) => [
      `"${p.kode_pendaftaran}"`,
      `"${p.lomba_nama || p.lomba_slug}"`,
      `"${p.nama_ketua}"`,
      `"${p.nim_ketua}"`,
      `"${p.email}"`,
      `"${p.whatsapp}"`,
      `"${p.instansi}"`,
      `"${p.nama_tim || "-"}"`,
      `"${(p.anggota_tim || "-").replace(/\n/g, " | ")}"`,
      `"${p.link_karya || "-"}"`,
      `"${p.file_ktm_url || "-"}"`,
      `"${p.file_pembayaran_url || "-"}"`,
      `"${p.status}"`,
      `"${new Date(p.created_at).toLocaleString("id-ID")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Pendaftar_Festival_Antasari_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert("success", "File CSV berhasil diekspor!");
  };

  // Filtered participants
  const filteredPendaftar = useMemo(() => {
    return pendaftarList.filter((p) => {
      const matchLomba =
        lombaFilter === "all" || p.lomba_slug === lombaFilter || p.lomba_id === lombaFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const q = searchPendaftar.toLowerCase();
      const matchQuery =
        !q ||
        p.nama_ketua.toLowerCase().includes(q) ||
        p.nim_ketua.toLowerCase().includes(q) ||
        p.kode_pendaftaran.toLowerCase().includes(q) ||
        p.whatsapp.includes(q) ||
        (p.nama_tim && p.nama_tim.toLowerCase().includes(q));
      return matchLomba && matchStatus && matchQuery;
    });
  }, [pendaftarList, lombaFilter, statusFilter, searchPendaftar]);

  // Statistics
  const stats = useMemo(() => {
    const totalLomba = lombaList.length;
    const openLomba = lombaList.filter((l) => l.status === "open").length;
    const totalPendaftar = pendaftarList.length;
    const pendingPendaftar = pendaftarList.filter((p) => p.status === "pending").length;
    return { totalLomba, openLomba, totalPendaftar, pendingPendaftar };
  }, [lombaList, pendaftarList]);

  return (
    <div className="min-h-screen pb-20 font-poppins">
      {/* Toast Notification */}
      {alertMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white transition-all transform animate-in fade-in slide-in-from-top-3 ${
            alertMessage.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {alertMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-white border-b border-neutral-200/80 px-4 sm:px-8 py-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-primary/10 text-brand-primary">
                <Trophy className="w-3.5 h-3.5" />
                Festival Antasari 2026
              </span>
              <span className="text-xs text-neutral-400">&bull; Admin Form Maker</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Form Maker &amp; Registrasi Lomba
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Buat dan publikasikan form pendaftaran berbagai cabang lomba dengan cepat, lengkap dengan juknis &amp; verifikasi berkas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/event/festival-antasari"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-all"
            >
              <span>Lihat Katalog Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Form Lomba Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-100">
          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Total Cabang Lomba
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-neutral-900">{stats.totalLomba}</span>
              <span className="text-[10px] text-neutral-500">Cabang</span>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Lomba Aktif (Buka)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-emerald-600">{stats.openLomba}</span>
              <span className="text-[10px] text-neutral-500">Menerima Pendaftar</span>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Total Pendaftar
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-neutral-900">{stats.totalPendaftar}</span>
              <span className="text-[10px] text-neutral-500">Peserta/Tim</span>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
              Perlu Verifikasi
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-amber-600">{stats.pendingPendaftar}</span>
              <span className="text-[10px] text-neutral-500">Pending</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-6 pt-2">
          <button
            onClick={() => setActiveTab("lomba")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "lomba"
                ? "bg-brand-primary text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Cabang Lomba &amp; Form ({lombaList.length})
          </button>
          <button
            onClick={() => setActiveTab("pendaftar")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "pendaftar"
                ? "bg-brand-primary text-white shadow-xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <span>Data Pendaftar Masuk ({pendaftarList.length})</span>
            {stats.pendingPendaftar > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-400 text-neutral-900">
                {stats.pendingPendaftar}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto">
        {/* ==================== TAB 1: LIST CABANG LOMBA ==================== */}
        {activeTab === "lomba" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-800">
                Daftar Formulir Perlombaan Aktif
              </h2>
              <button
                onClick={loadData}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-brand-primary font-medium cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {isLoading && lombaList.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-neutral-500 font-medium">Memuat cabang perlombaan...</p>
              </div>
            ) : lombaList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center shadow-2xs">
                <Trophy className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-800">Belum Ada Formulir Lomba</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Mulai dengan membuat form cabang perlombaan pertama Anda sekarang menggunakan tombol di bawah.
                </p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Form Pertama</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lombaList.map((item) => {
                  const isOpen = item.status === "open";
                  const pendaftarCount =
                    pendaftarList.filter((p) => p.lomba_slug === item.slug || p.lomba_id === item.id)
                      .length || item.pendaftar_count || 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-neutral-200/80 hover:border-brand-primary/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div className="p-5">
                        {/* Top Meta */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
                            {item.kategori}
                          </span>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            title="Klik untuk ubah status pendaftaran"
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              isOpen
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border border-neutral-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOpen ? "bg-emerald-600 animate-pulse" : "bg-neutral-400"
                              }`}
                            />
                            <span>{isOpen ? "Pendaftaran Buka" : "Pendaftaran Tutup"}</span>
                          </button>
                        </div>

                        {/* Title & Desc */}
                        <h3 className="text-base font-extrabold text-neutral-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                          {item.nama_lomba}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.deskripsi || "Tidak ada deskripsi cabang lomba."}
                        </p>

                        {/* Key Attributes */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-neutral-100 text-xs">
                          <div>
                            <span className="text-[10px] text-neutral-400 block">Tipe Peserta</span>
                            <span className="font-semibold text-neutral-800 capitalize">
                              {item.tipe_peserta === "tim" ? "Beregu / Tim" : "Individu"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 block">Biaya Registrasi</span>
                            <span className="font-semibold text-brand-primary">
                              {item.biaya_registrasi}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 block">Total Masuk</span>
                            <span className="font-semibold text-neutral-800">
                              {pendaftarCount} {item.tipe_peserta === "tim" ? "Tim" : "Peserta"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 block">Kuota Maksimal</span>
                            <span className="font-semibold text-neutral-800">
                              {item.kuota_maksimal ? `${item.kuota_maksimal} Slot` : "Tak Terbatas"}
                            </span>
                          </div>
                        </div>

                        {/* Config Badges */}
                        <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-neutral-100">
                          {item.form_config?.require_ktm && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-neutral-100 text-neutral-600">
                              KTM Wajib
                            </span>
                          )}
                          {item.form_config?.require_bukti_transfer && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-50 text-amber-700">
                              Bukti Bayar
                            </span>
                          )}
                          {item.form_config?.require_link_karya && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-50 text-blue-700">
                              Link Karya
                            </span>
                          )}
                          {(item.form_config?.custom_fields?.length || 0) > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-50 text-purple-700">
                              {item.form_config.custom_fields!.length} Soal Khusus
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="px-5 py-3 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => copyPublicLink(item.slug)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600 hover:text-brand-primary transition-colors cursor-pointer"
                        >
                          {copiedLink === item.slug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          <Link
                            href={`/event/festival-antasari/daftar/${item.slug}`}
                            target="_blank"
                            title="Buka Formulir Publik"
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-primary hover:bg-neutral-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit & Kustomisasi Formulir"
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteLomba(item.id, item.nama_lomba)}
                            title="Hapus Lomba"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: DATA PENDAFTAR ==================== */}
        {activeTab === "pendaftar" && (
          <div>
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 mb-4 shadow-2xs">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  {/* Search box */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, NIM, WA, atau kode pendaftaran..."
                      value={searchPendaftar}
                      onChange={(e) => setSearchPendaftar(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Filter Cabang Lomba */}
                  <select
                    value={lombaFilter}
                    onChange={(e) => setLombaFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:outline-none focus:border-brand-primary bg-white cursor-pointer"
                  >
                    <option value="all">Semua Cabang Lomba</option>
                    {lombaList.map((l) => (
                      <option key={l.id} value={l.slug}>
                        {l.nama_lomba}
                      </option>
                    ))}
                  </select>

                  {/* Filter Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-700 focus:outline-none focus:border-brand-primary bg-white cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu (Pending)</option>
                    <option value="verified">Terverifikasi (Verified)</option>
                    <option value="rejected">Ditolak (Rejected)</option>
                  </select>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Spreadsheet (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Table of Registrants */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 text-neutral-500 uppercase tracking-wider font-bold text-[10px] border-b border-neutral-200/80">
                    <tr>
                      <th className="px-4 py-3.5">Kode &amp; Tanggal</th>
                      <th className="px-4 py-3.5">Cabang Lomba</th>
                      <th className="px-4 py-3.5">Nama &amp; Instansi</th>
                      <th className="px-4 py-3.5">Kontak</th>
                      <th className="px-4 py-3.5">Bukti / Berkas</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredPendaftar.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-neutral-400">
                          Tidak ada data pendaftar yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPendaftar.map((p) => {
                        const statusBg =
                          p.status === "verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200";

                        return (
                          <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className="font-mono font-bold text-neutral-900 block">
                                {p.kode_pendaftaran}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {new Date(p.created_at).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-neutral-900 block line-clamp-1">
                                {p.lomba_nama || p.lomba_slug}
                              </span>
                              {p.nama_tim && (
                                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                                  Tim: {p.nama_tim}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="font-semibold text-neutral-900 block">
                                {p.nama_ketua}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                NIM: {p.nim_ketua} &bull; {p.instansi}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className="text-neutral-700 font-medium block">
                                {p.whatsapp}
                              </span>
                              <span className="text-[10px] text-neutral-400">{p.email}</span>
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                {p.file_ktm_url && (
                                  <a
                                    href={p.file_ktm_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                                  >
                                    KTM
                                  </a>
                                )}
                                {p.file_pembayaran_url && (
                                  <a
                                    href={p.file_pembayaran_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800"
                                  >
                                    Bayar
                                  </a>
                                )}
                                {p.link_karya && (
                                  <a
                                    href={p.link_karya}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800"
                                  >
                                    Karya
                                  </a>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${statusBg}`}
                              >
                                {p.status}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setSelectedPendaftar(p)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-primary hover:bg-neutral-100 transition-colors cursor-pointer"
                                  title="Lihat Detail Lengkap"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleUpdatePendaftarStatus(p.id, "verified")}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                  title="Verifikasi Peserta"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleUpdatePendaftarStatus(p.id, "rejected")}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Tolak Peserta"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeletePendaftar(p.id, p.nama_ketua)}
                                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Hapus Data"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== MODAL FORM MAKER KUSTOMISASI PENUH ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-100 max-h-[94vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top Header with Mode Tabs */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Sliders className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-900 leading-tight">
                    {editingLombaId ? "Edit & Kustomisasi Formulir" : "Form Maker & Kustomisasi Lomba"}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Sesuaikan kolom identitas, berkas syarat, dan pertanyaan kustom sesuai kebutuhan cabang lomba.
                  </p>
                </div>
              </div>

              {/* Toggle Tab Builder vs Live Preview */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-neutral-200/70 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setModalMode("builder")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalMode === "builder" ? "bg-white text-brand-primary shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Pengaturan Form</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode("preview")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalMode === "preview" ? "bg-white text-brand-primary shadow-xs" : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Pratinjau Live</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto">
              {/* MODE 1: BUILDER & CUSTOMIZATION */}
              {modalMode === "builder" ? (
                <form id="form-maker-builder" onSubmit={handleSaveLomba} className="p-6 space-y-7">
                  {/* SECTION 1: 1-KLIK PRESET CEPAT UNTUK ORANG AWAM */}
                  {!editingLombaId && (
                    <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs font-bold text-brand-primary font-poppins">
                          1-Klik Preset Cepat (Paling Mudah untuk Pemula)
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mb-3">
                        Pilih jenis perlombaan di bawah untuk otomatis mengisi deskripsi, berkas syarat, dan opsi form:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {formMakerPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            className="flex items-start justify-between p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-left transition-all hover:border-brand-primary cursor-pointer group shadow-2xs"
                          >
                            <div>
                              <span className="text-xs font-bold text-neutral-900 group-hover:text-brand-primary block leading-tight">
                                {preset.nama_preset}
                              </span>
                              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                                {preset.kategori} &bull; {preset.tipe_peserta}
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-100 text-neutral-700">
                              {preset.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: INFORMASI DASAR LOMBA */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>1. Informasi Pokok Perlombaan</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Nama Cabang Lomba <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Lomba Desain Poster Digital Festival Antasari"
                          value={namaLomba}
                          onChange={(e) => setNamaLomba(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Kategori Perlombaan
                        </label>
                        <select
                          value={kategori}
                          onChange={(e) => setKategori(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs bg-white focus:outline-none focus:border-brand-primary cursor-pointer font-medium"
                        >
                          <option value="Media & Kreatif">Media &amp; Kreatif</option>
                          <option value="Olahraga & E-Sport">Olahraga &amp; E-Sport</option>
                          <option value="Keagamaan">Keagamaan</option>
                          <option value="Seni & Budaya">Seni &amp; Budaya</option>
                          <option value="Ilmiah & Debat">Ilmiah &amp; Debat</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Tipe Peserta
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTipePeserta("individu")}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              tipePeserta === "individu"
                                ? "bg-brand-primary text-white border-brand-primary"
                                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                            }`}
                          >
                            Individu / Perorangan
                          </button>
                          <button
                            type="button"
                            onClick={() => setTipePeserta("tim")}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              tipePeserta === "tim"
                                ? "bg-brand-primary text-white border-brand-primary"
                                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                            }`}
                          >
                            Beregu / Tim
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Biaya Registrasi
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Gratis atau Rp 35.000 / tim"
                          value={biayaRegistrasi}
                          onChange={(e) => setBiayaRegistrasi(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Kuota Maksimal (Opsional)
                        </label>
                        <input
                          type="number"
                          placeholder="Contoh: 32 (kosongkan jika tanpa batas)"
                          value={kuotaMaksimal}
                          onChange={(e) => setKuotaMaksimal(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Tautan Juknis / Petunjuk Teknis (Drive/PDF)
                        </label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/..."
                          value={linkJuknis}
                          onChange={(e) => setLinkJuknis(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Kontak PJ Lomba (WhatsApp)
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 0812-3456-7890 (Kak Sarah)"
                          value={kontakPj}
                          onChange={(e) => setKontakPj(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Deskripsi Singkat Lomba
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Jelaskan gambaran umum perlombaan..."
                          value={deskripsi}
                          onChange={(e) => setDeskripsi(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Persyaratan &amp; Ketentuan Lomba
                        </label>
                        <textarea
                          rows={3}
                          placeholder="1. Mahasiswa aktif se-Kalsel&#10;2. Menyerahkan karya sebelum batas waktu..."
                          value={persyaratan}
                          onChange={(e) => setPersyaratan(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: KUSTOMISASI KOLOM IDENTITAS STANDAR */}
                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>2. Kustomisasi Kolom Identitas Peserta</span>
                    </h4>

                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-3.5 text-xs">
                      {/* Label Nama Lengkap */}
                      <div className="p-3 bg-white rounded-xl border border-neutral-200">
                        <label className="font-bold text-neutral-800 block mb-1">
                          Teks Label Kolom Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={labelNama}
                          onChange={(e) => setLabelNama(e.target.value)}
                          placeholder="Nama Lengkap Ketua / Peserta"
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      {/* Toggle & Label NIM */}
                      <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-800 block">Wajibkan Kolom NIM / Nomor Identitas</span>
                            <span className="text-[11px] text-neutral-500">
                              Matikan jika lomba terbuka untuk umum / siswa tanpa NIM.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={enableNim}
                            onChange={(e) => setEnableNim(e.target.checked)}
                            className="w-4 h-4 rounded text-brand-primary accent-brand-primary cursor-pointer"
                          />
                        </div>
                        {enableNim && (
                          <input
                            type="text"
                            value={labelNim}
                            onChange={(e) => setLabelNim(e.target.value)}
                            placeholder="Label (contoh: NIM / NISN / No. Identitas)"
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary"
                          />
                        )}
                      </div>

                      {/* Toggle & Label Asal Instansi */}
                      <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-800 block">Wajibkan Kolom Asal Instansi / Kampus</span>
                            <span className="text-[11px] text-neutral-500">
                              Asal universitas, fakultas, atau sekolah peserta.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={enableInstansi}
                            onChange={(e) => setEnableInstansi(e.target.checked)}
                            className="w-4 h-4 rounded text-brand-primary accent-brand-primary cursor-pointer"
                          />
                        </div>
                        {enableInstansi && (
                          <input
                            type="text"
                            value={labelInstansi}
                            onChange={(e) => setLabelInstansi(e.target.value)}
                            placeholder="Label (contoh: Instansi / Fakultas / Kampus)"
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary"
                          />
                        )}
                      </div>

                      {/* Jika Tipe Tim: Kustomisasi Label Tim */}
                      {tipePeserta === "tim" && (
                        <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                          <span className="text-[11px] uppercase font-bold text-purple-900 block">
                            Pengaturan Khusus Tim / Beregu
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-neutral-600 block mb-0.5">Label Nama Tim</label>
                              <input
                                type="text"
                                value={labelNamaTim}
                                onChange={(e) => setLabelNamaTim(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 text-xs bg-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-600 block mb-0.5">Batas Maksimal Anggota</label>
                              <input
                                type="number"
                                min={2}
                                max={20}
                                value={maxAnggotaTim}
                                onChange={(e) => setMaxAnggotaTim(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 text-xs bg-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 4: KUSTOMISASI BERKAS PERSYARATAN */}
                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>3. Kustomisasi Berkas &amp; Dokumen Persyaratan</span>
                    </h4>

                    <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-xs">
                      {/* KTM */}
                      <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-800 block">Wajib Upload KTM (Kartu Mahasiswa)</span>
                            <span className="text-[11px] text-neutral-500">
                              Memastikan keaktifan status mahasiswa peserta.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={requireKtm}
                            onChange={(e) => setRequireKtm(e.target.checked)}
                            className="w-4 h-4 text-brand-primary rounded cursor-pointer accent-brand-primary"
                          />
                        </div>
                        {requireKtm && (
                          <input
                            type="text"
                            value={labelKtm}
                            onChange={(e) => setLabelKtm(e.target.value)}
                            placeholder="Label (contoh: Kartu Tanda Mahasiswa / Kartu Pelajar)"
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none"
                          />
                        )}
                      </div>

                      {/* Bukti Bayar */}
                      <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-800 block">Wajib Upload Bukti Transfer / Pembayaran</span>
                            <span className="text-[11px] text-neutral-500">
                              Aktifkan jika cabang lomba memiliki biaya pendaftaran.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={requireBuktiTransfer}
                            onChange={(e) => setRequireBuktiTransfer(e.target.checked)}
                            className="w-4 h-4 text-brand-primary rounded cursor-pointer accent-brand-primary"
                          />
                        </div>

                        {requireBuktiTransfer && (
                          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 mt-2">
                            <div>
                              <label className="text-[11px] font-bold text-amber-900 block mb-0.5">
                                Nomor Rekening / E-Wallet Panitia
                              </label>
                              <input
                                type="text"
                                placeholder="BSI: 7123456789 a.n Panitia Festival Antasari"
                                value={nomorRekening}
                                onChange={(e) => setNomorRekening(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-amber-900 block mb-0.5">
                                Catatan / Berita Transfer
                              </label>
                              <input
                                type="text"
                                placeholder="Sertakan berita transfer: [Nama Lomba] - [Nama Tim]"
                                value={catatanPembayaran}
                                onChange={(e) => setCatatanPembayaran(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-amber-300 text-xs bg-white focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Follow IG */}
                      <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-800 block">Wajib Screenshot Follow IG @dema.uin.antasari</span>
                            <span className="text-[11px] text-neutral-500">
                              Syarat publikasi dan administratif resmi.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={requireBuktiFollow}
                            onChange={(e) => setRequireBuktiFollow(e.target.checked)}
                            className="w-4 h-4 text-brand-primary rounded cursor-pointer accent-brand-primary"
                          />
                        </div>
                      </div>

                      {/* Link Karya */}
                      <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-neutral-800 block">Wajib Tautan Berkas Karya (Google Drive)</span>
                            <span className="text-[11px] text-neutral-500">
                              Untuk lomba poster, video, esai, atau karya digital online.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={requireLinkKarya}
                            onChange={(e) => setRequireLinkKarya(e.target.checked)}
                            className="w-4 h-4 text-brand-primary rounded cursor-pointer accent-brand-primary"
                          />
                        </div>
                        {requireLinkKarya && (
                          <input
                            type="text"
                            value={labelLinkKarya}
                            onChange={(e) => setLabelLinkKarya(e.target.value)}
                            placeholder="Label (contoh: Tautan Berkas Karya Google Drive / YouTube)"
                            className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none"
                          />
                        )}
                      </div>

                      {/* Group WA */}
                      <div className="p-3 rounded-xl bg-white border border-neutral-200">
                        <label className="font-bold text-neutral-800 block mb-1">
                          Tautan Grup WhatsApp Peserta (Auto Tampil di Tiket Pendaftaran)
                        </label>
                        <input
                          type="url"
                          placeholder="https://chat.whatsapp.com/..."
                          value={linkGroupWa}
                          onChange={(e) => setLinkGroupWa(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: PEMBUAT PERTANYAAN KUSTOM (CUSTOM FIELDS BUILDER) */}
                  <div className="pt-4 border-t border-neutral-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>4. Pertanyaan Tambahan Khusus Cabang Lomba</span>
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Tambahkan pertanyaan kustom bebas: teks singkat, pilihan dropdown, angka, atau link.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addCustomField}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-accent transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Tambah Kolom Kustom</span>
                      </button>
                    </div>

                    {/* Quick Suggestions for Orang Awam */}
                    <div className="mb-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">
                        Pilihan Cepat Pertanyaan Populer (Klik untuk tambah langsung):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            addQuickField({
                              label: "Program Studi / Jurusan",
                              type: "text",
                              placeholder: "Contoh: Pendidikan Agama Islam (PAI)",
                              help_text: "Tuliskan program studi aktif Anda",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:border-brand-primary cursor-pointer shadow-2xs"
                        >
                          + Program Studi
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addQuickField({
                              label: "Semester Saat Ini",
                              type: "select",
                              options: ["Semester 1", "Semester 3", "Semester 5", "Semester 7", "Lainnya"],
                              help_text: "Pilih semester Anda saat ini",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:border-brand-primary cursor-pointer shadow-2xs"
                        >
                          + Semester (Dropdown)
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addQuickField({
                              label: "Ukuran Kaos / Baju",
                              type: "select",
                              options: ["S", "M", "L", "XL", "XXL", "XXXL"],
                              help_text: "Untuk kelengkapan atribut kegiatan",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:border-brand-primary cursor-pointer shadow-2xs"
                        >
                          + Ukuran Kaos (S-XXL)
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addQuickField({
                              label: "ID & Server Game",
                              type: "text",
                              placeholder: "Contoh: 12345678 (2045) - Nickname: Player1",
                              help_text: "Khusus cabang lomba E-Sport",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:border-brand-primary cursor-pointer shadow-2xs"
                        >
                          + ID &amp; Server Game
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addQuickField({
                              label: "Judul / Tema Karya",
                              type: "text",
                              placeholder: "Masukkan judul karya Anda...",
                              help_text: "Sesuai dengan petunjuk teknis",
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-[11px] font-semibold text-neutral-700 hover:border-brand-primary cursor-pointer shadow-2xs"
                        >
                          + Judul Karya
                        </button>
                      </div>
                    </div>

                    {/* Custom Question Cards */}
                    {customFields.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic bg-neutral-50 p-4 rounded-xl border border-dashed border-neutral-200 text-center">
                        Belum ada pertanyaan tambahan khusus. Anda dapat menambahkan pertanyaan seperti ID Game, Semester, atau Ukuran Kaos di atas.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {customFields.map((field, idx) => (
                          <div
                            key={field.id || idx}
                            className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-3 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                              <span className="font-bold text-neutral-500 text-[11px]">
                                Pertanyaan #{idx + 1}
                              </span>

                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1 text-[11px] font-semibold text-neutral-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => updateCustomField(idx, { required: e.target.checked })}
                                    className="w-3.5 h-3.5 rounded text-brand-primary accent-brand-primary"
                                  />
                                  <span>Wajib Diisi</span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => removeCustomField(idx)}
                                  className="p-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Hapus Pertanyaan Ini"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <div className="sm:col-span-2">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                                  Label Pertanyaan
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Contoh: ID Game & Server Kapten"
                                  value={field.label}
                                  onChange={(e) => updateCustomField(idx, { label: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-brand-primary font-medium"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                                  Tipe Input
                                </label>
                                <select
                                  value={field.type}
                                  onChange={(e) => updateCustomField(idx, { type: e.target.value as any })}
                                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white focus:outline-none"
                                >
                                  <option value="text">Teks Singkat</option>
                                  <option value="textarea">Paragraf / Uraian</option>
                                  <option value="select">Dropdown Pilihan</option>
                                  <option value="number">Angka / Nominal</option>
                                  <option value="link">Tautan Link URL</option>
                                </select>
                              </div>

                              <div className="sm:col-span-2">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                                  Placeholder (Teks Petunjuk Pengisian)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Contoh: Masukkan jawaban Anda..."
                                  value={field.placeholder || ""}
                                  onChange={(e) => updateCustomField(idx, { placeholder: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                                  Teks Bantuan (Kecil di Bawah)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Opsional, misal: Khusus kategori A"
                                  value={field.help_text || ""}
                                  onChange={(e) => updateCustomField(idx, { help_text: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs focus:outline-none"
                                />
                              </div>

                              {/* Jika Tipe Dropdown (Select): Input Opsi */}
                              {field.type === "select" && (
                                <div className="sm:col-span-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                                  <label className="text-[11px] font-bold text-neutral-800 block mb-0.5">
                                    Daftar Opsi Pilihan (Pisahkan dengan Koma)
                                  </label>
                                  <p className="text-[10px] text-neutral-500 mb-1.5">
                                    Contoh: <code className="text-brand-primary">Kategori A, Kategori B, Kategori C</code> atau <code className="text-brand-primary">S, M, L, XL, XXL</code>
                                  </p>
                                  <input
                                    type="text"
                                    placeholder="Opsi 1, Opsi 2, Opsi 3..."
                                    value={(field.options || []).join(", ")}
                                    onChange={(e) =>
                                      updateCustomField(idx, {
                                        options: e.target.value
                                          .split(",")
                                          .map((s) => s.trim())
                                          .filter((s) => s.length > 0),
                                      })
                                    }
                                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                /* ==================== MODE 2: LIVE PREVIEW INTERAKTIF ==================== */
                <div className="p-6 bg-neutral-100/70 min-h-[500px]">
                  <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-200 space-y-6">
                    <div className="text-center pb-4 border-b border-neutral-100">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-primary/10 text-brand-primary">
                        {kategori}
                      </span>
                      <h2 className="text-xl font-extrabold text-neutral-900 mt-2 font-poppins">
                        {namaLomba || "[Nama Cabang Lomba]"}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        Biaya: <span className="font-bold text-brand-primary">{biayaRegistrasi}</span> &bull; Tipe:{" "}
                        <span className="capitalize font-semibold">{tipePeserta}</span>
                      </p>
                    </div>

                    {/* Pratinjau Identitas */}
                    <div className="space-y-3 text-xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Bagian 1: Identitas Peserta
                      </span>
                      <div>
                        <label className="font-semibold text-neutral-700 block mb-1">
                          {labelNama} <span className="text-red-500">*</span>
                        </label>
                        <input
                          disabled
                          placeholder="Masukkan nama lengkap..."
                          className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                        />
                      </div>

                      {enableNim && (
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">
                            {labelNim} <span className="text-red-500">*</span>
                          </label>
                          <input
                            disabled
                            placeholder="Contoh: 220101030012"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                          />
                        </div>
                      )}

                      {enableInstansi && (
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">
                            {labelInstansi} <span className="text-red-500">*</span>
                          </label>
                          <input
                            disabled
                            placeholder="UIN Antasari Banjarmasin"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">Email Aktif</label>
                          <input
                            disabled
                            placeholder="nama@student.uin-antasari.ac.id"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">WhatsApp</label>
                          <input
                            disabled
                            placeholder="0812-3456-7890"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pratinjau Tim */}
                    {tipePeserta === "tim" && (
                      <div className="space-y-3 pt-3 border-t border-neutral-100 text-xs">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                          Bagian 2: Data Beregu / Tim
                        </span>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">
                            {labelNamaTim} <span className="text-red-500">*</span>
                          </label>
                          <input
                            disabled
                            placeholder="Nama squad..."
                            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">
                            {labelAnggotaTim} (Maks {maxAnggotaTim} Orang) <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            disabled
                            rows={2}
                            placeholder="1. Kapten&#10;2. Anggota..."
                            className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pratinjau Pertanyaan Kustom */}
                    {customFields.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-neutral-100 text-xs">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                          Bagian 3: Pertanyaan Khusus
                        </span>
                        {customFields.map((f, i) => (
                          <div key={i}>
                            <label className="font-semibold text-neutral-700 block mb-1">
                              {f.label || `[Pertanyaan #${i + 1}]`} {f.required && <span className="text-red-500">*</span>}
                            </label>
                            {f.type === "select" ? (
                              <select disabled className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50">
                                <option>-- Pilih {(f.options || []).length} Pilihan Tersedia --</option>
                              </select>
                            ) : (
                              <input
                                disabled
                                placeholder={f.placeholder || "Jawaban..."}
                                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
                              />
                            )}
                            {f.help_text && <span className="text-[10px] text-neutral-400 block mt-0.5">{f.help_text}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pratinjau Berkas */}
                    <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                        Persyaratan Berkas Upload
                      </span>
                      {requireKtm && (
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-[11px]">
                          <span>Upload {labelKtm}</span>
                          <span className="text-[10px] font-bold text-brand-primary">Wajib</span>
                        </div>
                      )}
                      {requireBuktiFollow && (
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-[11px]">
                          <span>Upload {labelBuktiFollow}</span>
                          <span className="text-[10px] font-bold text-brand-primary">Wajib</span>
                        </div>
                      )}
                      {requireBuktiTransfer && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
                          <span>Upload {labelBuktiTransfer}</span>
                          <span className="text-[10px] font-bold text-amber-800">Wajib</span>
                        </div>
                      )}
                      {requireLinkKarya && (
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-[11px] text-blue-900">
                          <span>{labelLinkKarya}</span>
                          <span className="text-[10px] font-bold text-blue-800">Wajib Link</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              {/* Toggle Preview Button for Mobile */}
              <button
                type="button"
                onClick={() => setModalMode((prev) => (prev === "builder" ? "preview" : "builder"))}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-brand-primary cursor-pointer"
              >
                {modalMode === "builder" ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Lihat Pratinjau Tampilan Peserta</span>
                  </>
                ) : (
                  <>
                    <Settings2 className="w-4 h-4" />
                    <span>Kembali ke Editor Pengaturan</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="form-maker-builder"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingLombaId ? "Simpan Perubahan Form" : "Terbitkan Form Lomba"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL DETAIL PENDAFTAR ==================== */}
      {selectedPendaftar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-100 max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div>
                <span className="font-mono text-xs font-bold text-brand-primary">
                  {selectedPendaftar.kode_pendaftaran}
                </span>
                <h3 className="text-base font-extrabold text-neutral-900 mt-0.5">
                  Detail Berkas Pendaftar
                </h3>
              </div>
              <button
                onClick={() => setSelectedPendaftar(null)}
                className="p-1.5 rounded-xl text-neutral-400 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Nama Ketua / Peserta</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {selectedPendaftar.nama_ketua}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">NIM &bull; Instansi</span>
                  <span className="font-semibold text-neutral-800">
                    {selectedPendaftar.nim_ketua} &bull; {selectedPendaftar.instansi}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">WhatsApp</span>
                  <a
                    href={`https://wa.me/${selectedPendaftar.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    {selectedPendaftar.whatsapp}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Email</span>
                  <span className="font-semibold text-neutral-800">{selectedPendaftar.email}</span>
                </div>
              </div>

              {selectedPendaftar.nama_tim && (
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-purple-700 block mb-0.5">
                    Data Tim: {selectedPendaftar.nama_tim}
                  </span>
                  <p className="text-neutral-700 whitespace-pre-line leading-relaxed">
                    {selectedPendaftar.anggota_tim || "Belum ada rincian anggota tim."}
                  </p>
                </div>
              )}

              {/* Custom Answers */}
              {selectedPendaftar.custom_answers &&
                Object.keys(selectedPendaftar.custom_answers).length > 0 && (
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-2">
                      Jawaban Kuesioner Khusus Lomba
                    </span>
                    <div className="space-y-1.5">
                      {Object.entries(selectedPendaftar.custom_answers).map(([key, val]) => (
                        <div key={key} className="border-b border-neutral-100 pb-1 last:border-0">
                          <span className="font-semibold text-neutral-600 capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>{" "}
                          <span className="text-neutral-900 font-medium">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* File Proofs Viewer */}
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">
                  Pratinjau Berkas Pendukung
                </span>
                <div className="flex items-center gap-1.5 mb-3 border-b border-neutral-100 pb-2">
                  <button
                    onClick={() => setActiveProofTab("ktm")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeProofTab === "ktm"
                        ? "bg-brand-primary text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    KTM Mahasiswa
                  </button>
                  <button
                    onClick={() => setActiveProofTab("bayar")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeProofTab === "bayar"
                        ? "bg-brand-primary text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    Bukti Pembayaran
                  </button>
                  <button
                    onClick={() => setActiveProofTab("follow")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeProofTab === "follow"
                        ? "bg-brand-primary text-white"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    Bukti Follow IG
                  </button>
                </div>

                <div className="bg-neutral-100 rounded-2xl p-4 flex items-center justify-center min-h-[200px]">
                  {activeProofTab === "ktm" && (
                    selectedPendaftar.file_ktm_url ? (
                      <img
                        src={selectedPendaftar.file_ktm_url}
                        alt="KTM Peserta"
                        className="max-h-72 rounded-lg object-contain shadow-xs"
                      />
                    ) : (
                      <span className="text-neutral-400">Tidak ada berkas KTM yang diunggah.</span>
                    )
                  )}

                  {activeProofTab === "bayar" && (
                    selectedPendaftar.file_pembayaran_url ? (
                      <img
                        src={selectedPendaftar.file_pembayaran_url}
                        alt="Bukti Transfer"
                        className="max-h-72 rounded-lg object-contain shadow-xs"
                      />
                    ) : (
                      <span className="text-neutral-400">Lomba ini tidak memerlukan bukti bayar.</span>
                    )
                  )}

                  {activeProofTab === "follow" && (
                    selectedPendaftar.file_follow_url ? (
                      <img
                        src={selectedPendaftar.file_follow_url}
                        alt="Bukti Follow"
                        className="max-h-72 rounded-lg object-contain shadow-xs"
                      />
                    ) : (
                      <span className="text-neutral-400">Tidak ada bukti follow IG.</span>
                    )
                  )}
                </div>

                {selectedPendaftar.link_karya && (
                  <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-900 block">Tautan Karya Peserta</span>
                      <span className="text-[11px] text-blue-700 truncate max-w-sm block">
                        {selectedPendaftar.link_karya}
                      </span>
                    </div>
                    <a
                      href={selectedPendaftar.link_karya}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1 shadow-2xs hover:bg-blue-700"
                    >
                      <span>Buka Karya</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Verification Action */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                Ubah status pendaftaran:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdatePendaftarStatus(selectedPendaftar.id, "rejected")}
                  className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Tolak Berkas
                </button>
                <button
                  onClick={() => handleUpdatePendaftarStatus(selectedPendaftar.id, "verified")}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verifikasi &amp; Sahkan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
