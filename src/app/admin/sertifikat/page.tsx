"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Award, 
  Upload, 
  Settings, 
  Eye, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  Users, 
  Check, 
  ExternalLink,
  ChevronRight,
  Search,
  Printer,
  FileCheck,
  Sparkles,
  Info
} from "lucide-react";
import Link from "next/link";

interface SertifikatConfig {
  event_slug: string;
  is_published: boolean;
  template_url: string;
  nomor_format: string;
  nomor_start: number;
  nama_pos_y: number;
  nama_font_size: number;
  nama_color: string;
  nomor_pos_x: number;
  nomor_pos_y: number;
  nomor_font_size: number;
  nomor_color: string;
  require_presensi: boolean;
}

interface Peserta {
  id: string;
  nama: string;
  nim: string;
  delegasi: string;
  ticket_id: string;
  created_at: string;
  has_attended?: boolean;
}

export default function AdminSertifikatPage() {
  const [activeTab, setActiveTab] = useState<"design" | "peserta">("design");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Standar Cetak A4 Landscape (300 DPI) = 3508 x 2480 px
  const CANVAS_WIDTH = 3508;
  const CANVAS_HEIGHT = 2480;

  const [config, setConfig] = useState<SertifikatConfig>({
    event_slug: "antasari-media-lab",
    is_published: false,
    template_url: "",
    nomor_format: "{nomor}/DEMA-UIN/AML/X/2026",
    nomor_start: 1,
    nama_pos_y: 1180,
    nama_font_size: 84,
    nama_color: "#1C4BBC",
    nomor_pos_x: 1754,
    nomor_pos_y: 780,
    nomor_font_size: 38,
    nomor_color: "#333333",
    require_presensi: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [templatePreviewUrl, setTemplatePreviewUrl] = useState<string>("");

  // Pratinjau Nama Contoh
  const [sampleNama, setSampleNama] = useState("Muhammad Ihsan El Fikrie");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Data Peserta & Presensi
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loadingPeserta, setLoadingPeserta] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPresensi, setFilterPresensi] = useState<"all" | "hadir" | "belum">("all");

  // 1. Fetch konfigurasi awal
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const res = await fetch("/api/sertifikat/config?event=antasari-media-lab");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setConfig((prev) => ({
              ...prev,
              ...data,
            }));
            if (data.template_url) {
              setTemplatePreviewUrl(data.template_url);
            }
          }
        }
      } catch (err: any) {
        console.error("Gagal memuat config sertifikat:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  // 2. Fetch Data Peserta & Kehadiran (Diperbaiki agar membaca data secara tangguh)
  useEffect(() => {
    async function fetchPesertaAndAttendance() {
      try {
        setLoadingPeserta(true);
        const [resPeserta, resAbsensi] = await Promise.all([
          fetch("/api/peserta?event=antasari-media-lab"),
          fetch("/api/presensi/log?event=antasari-media-lab"),
        ]);

        let pList: Peserta[] = [];
        const attendedNims = new Set<string>();

        if (resPeserta.ok) {
          const pData = await resPeserta.json();
          if (Array.isArray(pData)) pList = pData;
        }

        if (resAbsensi.ok) {
          const aData = await resAbsensi.json();
          // Antisipasi baik format array langsung maupun objek { data: [] }
          const absensiItems = Array.isArray(aData)
            ? aData
            : Array.isArray(aData?.data)
            ? aData.data
            : [];

          absensiItems.forEach((item: any) => {
            if (item.nim) {
              attendedNims.add(item.nim.trim().replace(/\s+/g, "").toUpperCase());
            }
          });
        }

        const merged = pList.map((p) => {
          const cleanNim = p.nim ? p.nim.trim().replace(/\s+/g, "").toUpperCase() : "";
          return {
            ...p,
            has_attended: attendedNims.has(cleanNim),
          };
        });

        setPesertaList(merged);
      } catch (err) {
        console.error("Gagal mengambil data peserta & presensi:", err);
      } finally {
        setLoadingPeserta(false);
      }
    }

    if (activeTab === "peserta") {
      fetchPesertaAndAttendance();
    }
  }, [activeTab]);

  // 3. Render Canvas Studio Pratinjau
  useEffect(() => {
    let isCancelled = false;

    async function drawCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // Tunggu font siap
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }

      const sampleNomor = (config.nomor_format || "{nomor}/DEMA-UIN/AML/X/2026").replace(
        "{nomor}",
        (config.nomor_start || 1).toString().padStart(3, "0")
      );

      const renderText = () => {
        // --- 1. Draw Nomor Surat ---
        ctx.textAlign = "center";
        ctx.fillStyle = config.nomor_color || "#333333";
        let effNomorSize = config.nomor_font_size || 38;
        ctx.font = `500 ${effNomorSize}px Poppins, sans-serif`;
        const fullNomorStr = `Nomor: ${sampleNomor}`;
        while (ctx.measureText(fullNomorStr).width > 2200 && effNomorSize > 20) {
          effNomorSize -= 2;
          ctx.font = `500 ${effNomorSize}px Poppins, sans-serif`;
        }
        ctx.fillText(fullNomorStr, config.nomor_pos_x || 1754, config.nomor_pos_y || 780);

        // --- 2. Draw Nama Peserta dengan Auto-Scale ---
        ctx.fillStyle = config.nama_color || "#1C4BBC";
        let effNamaSize = config.nama_font_size || 84;
        ctx.font = `bold ${effNamaSize}px Poppins, sans-serif`;

        // Batasi nama agar tidak overflow kanvas A4
        while (ctx.measureText(sampleNama).width > 2700 && effNamaSize > 38) {
          effNamaSize -= 2;
          ctx.font = `bold ${effNamaSize}px Poppins, sans-serif`;
        }

        ctx.fillText(sampleNama, CANVAS_WIDTH / 2, config.nama_pos_y || 1180);

        // Underline aksen
        ctx.strokeStyle = (config.nama_color || "#1C4BBC") + "55";
        ctx.lineWidth = Math.max(3, Math.round(effNamaSize * 0.05));
        const textWidth = ctx.measureText(sampleNama).width;
        ctx.beginPath();
        const underlineY = (config.nama_pos_y || 1180) + Math.round(effNamaSize * 0.22);
        ctx.moveTo(CANVAS_WIDTH / 2 - textWidth / 2, underlineY);
        ctx.lineTo(CANVAS_WIDTH / 2 + textWidth / 2, underlineY);
        ctx.stroke();
      };

      const drawFallback = () => {
        ctx.fillStyle = "#FBFBFA";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.strokeStyle = "#1C4BBC";
        ctx.lineWidth = 24;
        ctx.strokeRect(60, 60, CANVAS_WIDTH - 120, CANVAS_HEIGHT - 120);

        ctx.strokeStyle = "#82BE3B";
        ctx.lineWidth = 8;
        ctx.strokeRect(95, 95, CANVAS_WIDTH - 190, CANVAS_HEIGHT - 190);

        ctx.textAlign = "center";
        ctx.fillStyle = "#1C4BBC";
        ctx.font = "bold 64px Poppins, sans-serif";
        ctx.fillText("DEWAN EKSEKUTIF MAHASISWA", CANVAS_WIDTH / 2, 380);

        ctx.fillStyle = "#333333";
        ctx.font = "500 46px Poppins, sans-serif";
        ctx.fillText("UNIVERSITAS ISLAM NEGERI ANTASARI BANJARMASIN", CANVAS_WIDTH / 2, 450);

        ctx.fillStyle = "#82BE3B";
        ctx.font = "bold 96px Poppins, sans-serif";
        ctx.fillText("SERTIFIKAT PENGHARGAAN", CANVAS_WIDTH / 2, 640);

        ctx.fillStyle = "#666666";
        ctx.font = "400 44px Poppins, sans-serif";
        ctx.fillText("Diberikan dengan penuh apresiasi dan kehormatan kepada:", CANVAS_WIDTH / 2, 1020);

        ctx.fillStyle = "#666666";
        ctx.font = "400 40px Poppins, sans-serif";
        ctx.fillText(
          "Atas partisipasi aktif dan kontribusinya sebagai PESERTA dalam kegiatan:",
          CANVAS_WIDTH / 2,
          1380
        );

        ctx.fillStyle = "#1C4BBC";
        ctx.font = "bold 68px Poppins, sans-serif";
        ctx.fillText("ANTASARI MEDIA LAB 2026", CANVAS_WIDTH / 2, 1480);

        ctx.fillStyle = "#333333";
        ctx.font = "500 40px Poppins, sans-serif";
        ctx.fillText(
          '"Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa"',
          CANVAS_WIDTH / 2,
          1550
        );

        ctx.fillStyle = "#333333";
        ctx.font = "500 36px Poppins, sans-serif";
        ctx.fillText("Banjarmasin, 3 Oktober 2026", CANVAS_WIDTH / 2, 1850);

        ctx.fillText("Ketua DEMA UIN Antasari", 800, 2020);
        ctx.fillText("Menteri Komunikasi & Informasi", CANVAS_WIDTH - 800, 2020);

        renderText();
      };

      if (templatePreviewUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          if (isCancelled) return;
          ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          renderText();
        };
        img.onerror = () => {
          if (isCancelled) return;
          drawFallback();
        };
        img.src = templatePreviewUrl;
      } else {
        drawFallback();
      }
    }

    drawCanvas();

    return () => {
      isCancelled = true;
    };
  }, [config, templatePreviewUrl, sampleNama]);

  // Handle Pemilihan File Template
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setTemplatePreviewUrl(objectUrl);
    }
  };

  // Simpan Konfigurasi ke Server
  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const formData = new FormData();
      formData.append("event_slug", config.event_slug);
      formData.append("is_published", config.is_published ? "true" : "false");
      formData.append("template_url", config.template_url);
      formData.append("nomor_format", config.nomor_format);
      formData.append("nomor_start", config.nomor_start.toString());
      formData.append("nama_pos_y", config.nama_pos_y.toString());
      formData.append("nama_font_size", config.nama_font_size.toString());
      formData.append("nama_color", config.nama_color);
      formData.append("nomor_pos_x", config.nomor_pos_x.toString());
      formData.append("nomor_pos_y", config.nomor_pos_y.toString());
      formData.append("nomor_font_size", config.nomor_font_size.toString());
      formData.append("nomor_color", config.nomor_color);
      formData.append("require_presensi", config.require_presensi ? "true" : "false");

      if (selectedFile) {
        formData.append("template_file", selectedFile);
      }

      const res = await fetch("/api/sertifikat/config", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan pengaturan.");
      }

      if (result.data?.template_url) {
        setConfig((prev) => ({ ...prev, template_url: result.data.template_url }));
        setTemplatePreviewUrl(result.data.template_url);
        setSelectedFile(null);
      }

      setSuccessMsg("Pengaturan sertifikat berhasil disimpan!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  // Download Sample Canvas
  const handleDownloadSample = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `Sample-Sertifikat-Antasari-Media-Lab.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Gagal ekspor sample canvas:", err);
    }
  };

  // Filter Peserta
  const filteredPeserta = pesertaList.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.delegasi.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterPresensi === "hadir") return p.has_attended;
    if (filterPresensi === "belum") return !p.has_attended;
    return true;
  });

  const totalPeserta = pesertaList.length;
  const totalHadir = pesertaList.filter((p) => p.has_attended).length;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#1C4BBC]/10 text-[#1C4BBC]">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C4BBC]">
              Modul E-Sertifikat Digital
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-poppins">
            Pengaturan Sertifikat Antasari Media Lab
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Unggah template A4 Landscape, atur format penomoran surat, koordinat teks, serta aktivasi unduh untuk peserta.
          </p>
        </div>

        {/* Kontrol Status & Pintasan Laman Publik */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/event/antasari-media-lab"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Buka Laman Event</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </Link>

          <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
            <div className="text-right">
              <span className="block text-xs font-bold text-neutral-900">
                {config.is_published ? "Status: Terbuka (Publik)" : "Status: Ditutup (Draft)"}
              </span>
              <span className="block text-[11px] text-neutral-500">
                {config.is_published ? "Peserta berhak dapat mengunduh" : "Hanya admin yang dapat menguji"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, is_published: !prev.is_published }))}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                config.is_published ? "bg-emerald-600 justify-end" : "bg-neutral-300 justify-start"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200">
        <button
          type="button"
          onClick={() => setActiveTab("design")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "design"
              ? "border-[#1C4BBC] text-[#1C4BBC]"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Desain Template & Koordinat Teks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("peserta")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "peserta"
              ? "border-[#1C4BBC] text-[#1C4BBC]"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Peserta & Kelayakan ({totalPeserta})</span>
          {totalHadir > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
              {totalHadir} Hadir
            </span>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: STUDIO DESAIN & PENGATURAN KANVAS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "design" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (Left Column) */}
          <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center justify-between">
              <span>Parameter Template Sertifikat (A4 Landscape)</span>
              <span className="text-[11px] font-mono text-neutral-400">3508 × 2480 px</span>
            </h3>

            {/* 1. Upload Template Image */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 block">
                Gambar Template Sertifikat (A4 Landscape)
              </label>
              <div className="p-3 border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1C4BBC] file:text-white hover:file:bg-[#153a99] cursor-pointer"
                />
                <span className="text-[11px] text-neutral-400 block mt-1.5">
                  Format: PNG/JPG beresolusi tinggi (A4 landscape polos tanpa nama & tanpa nomor surat).
                </span>
              </div>
            </div>

            {/* 2. Format Penomoran Surat */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-900 block">
                Format Penomoran Sertifikat
              </span>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-600 block">
                  Pola Format Nomor (gunakan tag <code className="text-[#1C4BBC] font-bold">{"{nomor}"}</code>)
                </label>
                <input
                  type="text"
                  value={config.nomor_format}
                  onChange={(e) => setConfig({ ...config, nomor_format: e.target.value })}
                  placeholder="{nomor}/DEMA-UIN/AML/X/2026"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-mono font-medium focus:ring-2 focus:ring-[#1C4BBC] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 block">
                    Nomor Mulai (Counter)
                  </label>
                  <input
                    type="number"
                    value={config.nomor_start}
                    onChange={(e) => setConfig({ ...config, nomor_start: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-mono font-medium focus:ring-2 focus:ring-[#1C4BBC] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 block">
                    Ukuran Font Nomor (px)
                  </label>
                  <input
                    type="number"
                    value={config.nomor_font_size}
                    onChange={(e) => setConfig({ ...config, nomor_font_size: parseInt(e.target.value) || 36 })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-mono font-medium focus:ring-2 focus:ring-[#1C4BBC] outline-none"
                  />
                </div>
              </div>

              {/* Posisi Koordinat Nomor */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-600">
                    <span>Posisi X Nomor</span>
                    <span className="font-mono font-bold text-[#1C4BBC]">{config.nomor_pos_x}px</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="3300"
                    step="10"
                    value={config.nomor_pos_x}
                    onChange={(e) => setConfig({ ...config, nomor_pos_x: parseInt(e.target.value) })}
                    className="w-full accent-[#1C4BBC] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-600">
                    <span>Posisi Y Nomor</span>
                    <span className="font-mono font-bold text-[#1C4BBC]">{config.nomor_pos_y}px</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="2200"
                    step="10"
                    value={config.nomor_pos_y}
                    onChange={(e) => setConfig({ ...config, nomor_pos_y: parseInt(e.target.value) })}
                    className="w-full accent-[#1C4BBC] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 3. Pengaturan Teks Nama Peserta */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-900 block">
                Pengaturan Teks Nama Peserta
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 block">
                    Ukuran Font Nama (px)
                  </label>
                  <input
                    type="number"
                    value={config.nama_font_size}
                    onChange={(e) => setConfig({ ...config, nama_font_size: parseInt(e.target.value) || 80 })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs font-mono font-medium focus:ring-2 focus:ring-[#1C4BBC] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 block">
                    Warna Font Nama
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.nama_color}
                      onChange={(e) => setConfig({ ...config, nama_color: e.target.value })}
                      className="w-8 h-8 rounded border border-neutral-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={config.nama_color}
                      onChange={(e) => setConfig({ ...config, nama_color: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Posisi Y Nama */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-600">
                  <span>Posisi Y Nama Peserta</span>
                  <span className="font-mono font-bold text-[#1C4BBC]">{config.nama_pos_y}px</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2000"
                  step="10"
                  value={config.nama_pos_y}
                  onChange={(e) => setConfig({ ...config, nama_pos_y: parseInt(e.target.value) })}
                  className="w-full accent-[#1C4BBC] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-neutral-600 block">
                  Uji Pratinjau Nama Peserta
                </label>
                <input
                  type="text"
                  value={sampleNama}
                  onChange={(e) => setSampleNama(e.target.value)}
                  placeholder="Ketik nama untuk tes pratinjau..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs focus:ring-2 focus:ring-[#1C4BBC] outline-none"
                />
              </div>
            </div>

            {/* 4. Syarat Presensi Acara */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Syarat Wajib Presensi Acara
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  Peserta wajib tercatat hadir di absensi agar dapat mengunduh sertifikat
                </span>
              </div>
              <input
                type="checkbox"
                checked={config.require_presensi}
                onChange={(e) => setConfig({ ...config, require_presensi: e.target.checked })}
                className="w-4 h-4 accent-[#1C4BBC] cursor-pointer"
              />
            </div>

            {/* Tombol Simpan & Download Sample */}
            <div className="pt-3 border-t border-neutral-100 flex gap-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C4BBC] hover:bg-[#153a99] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSample}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title="Download Pratinjau Kanvas 300 DPI"
              >
                <Download className="w-4 h-4" />
                <span>Tes Unduh PNG</span>
              </button>
            </div>
          </div>

          {/* Live Preview Canvas (Right Column) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-bold text-neutral-800">
                  Pratinjau Kanvas Cetak A4 Landscape (3508 × 2480 px)
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">
                Rendering Resolusi Penuh
              </span>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-3 shadow-lg border border-neutral-800 overflow-hidden">
              <div className="relative rounded-xl overflow-hidden bg-neutral-950 aspect-[3508/2480]">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain block"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Petunjuk Penyesuaian Desain:</span>
              </div>
              <p>
                1. Jika desain Anda sudah siap (dari Canva/Photoshop/Illustrator), simpan ke resolusi A4 Landscape dan unggah melalui kolom di sebelah kiri.
              </p>
              <p>
                2. Geser <strong>Posisi Y Nama</strong> dan <strong>Posisi X/Y Nomor</strong> hingga teks berada persis di tempat yang Anda inginkan.
              </p>
              <p>
                3. Klik <strong>Simpan Pengaturan</strong> agar tersimpan ke sistem.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: DATA PESERTA & REKAP KELAYAKAN
      ───────────────────────────────────────────────────────────── */}
      {activeTab === "peserta" && (
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-neutral-100 shadow-xs">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, NIM, atau delegasi..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs focus:ring-2 focus:ring-[#1C4BBC] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Filter Kehadiran:</span>
              <select
                value={filterPresensi}
                onChange={(e: any) => setFilterPresensi(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs bg-white focus:ring-2 focus:ring-[#1C4BBC] outline-none cursor-pointer"
              >
                <option value="all">Semua Peserta ({totalPeserta})</option>
                <option value="hadir">Sudah Hadir ({totalHadir})</option>
                <option value="belum">Belum Hadir ({totalPeserta - totalHadir})</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loadingPeserta ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-neutral-400">
              <RefreshCw className="w-6 h-6 animate-spin text-[#1C4BBC]" />
              <span className="text-xs">Memuat data pendaftar & presensi...</span>
            </div>
          ) : filteredPeserta.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              Tidak ada data peserta yang cocok dengan kriteria pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto border border-neutral-100 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/80 text-neutral-500 font-semibold border-b border-neutral-200/80">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama Peserta</th>
                    <th className="py-3 px-4">NIM</th>
                    <th className="py-3 px-4">Asal Delegasi</th>
                    <th className="py-3 px-4">Status Presensi</th>
                    <th className="py-3 px-4">Nomor Sertifikat</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredPeserta.map((peserta, idx) => {
                    const estimatedNumberVal = (idx + (config.nomor_start || 1)).toString().padStart(3, "0");
                    const formattedNumber = (config.nomor_format || "{nomor}/DEMA-UIN/AML/X/2026").replace(
                      "{nomor}",
                      estimatedNumberVal
                    );
                    const isEligible = !config.require_presensi || peserta.has_attended;

                    return (
                      <tr key={peserta.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-3 px-4 text-neutral-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-neutral-900">{peserta.nama}</td>
                        <td className="py-3 px-4 font-mono text-neutral-600">{peserta.nim}</td>
                        <td className="py-3 px-4 text-neutral-600">{peserta.delegasi}</td>
                        <td className="py-3 px-4">
                          {peserta.has_attended ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Hadir di Acara
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Belum Absen
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-700">
                          {isEligible ? formattedNumber : "-"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSampleNama(peserta.nama);
                              setActiveTab("design");
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1C4BBC] hover:underline cursor-pointer"
                          >
                            <span>Uji Desain</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
