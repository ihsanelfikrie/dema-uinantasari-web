"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { 
  QrCode, 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Search, 
  Download, 
  RefreshCw, 
  UserCheck, 
  Clock, 
  Users, 
  Sparkles, 
  X, 
  ChevronRight,
  Database,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";

interface Peserta {
  id: string;
  event_slug: string;
  nama: string;
  nim: string;
  email: string;
  delegasi: string;
  ticket_id: string;
  created_at: string;
}

interface SesiAbsen {
  id: string;
  event_slug: string;
  nama_sesi: string;
  is_active: boolean;
  created_at: string;
}

interface AbsensiLog {
  id: string;
  sesi_id: string;
  peserta_id: string;
  nim: string;
  waktu_absen: string;
  metode: string;
}

interface ScanResult {
  type: "success" | "warning" | "error";
  title: string;
  message: string;
  peserta?: Peserta;
  waktu?: string;
}

export default function AdminPresensiPage() {
  // Event & Session State
  const [eventSlug, setEventSlug] = useState("antasari-media-lab");
  const [sesiList, setSesiList] = useState<SesiAbsen[]>([]);
  const [activeSesiId, setActiveSesiId] = useState<string>("");
  const [isLoadingSesi, setIsLoadingSesi] = useState(true);

  // Participants & Attendance Logs State
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AbsensiLog[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Scanner & Manual Input State
  const [isScanning, setIsScanning] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);

  // UI Modals & Filters
  const [showAddSesiModal, setShowAddSesiModal] = useState(false);
  const [newSesiName, setNewSesiName] = useState("");
  const [isCreatingSesi, setIsCreatingSesi] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "hadir" | "belum">("all");
  const [tableMissing, setTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Refs for scanner
  const html5QrCodeRef = useRef<any>(null);
  const scannerContainerId = "qr-reader-container";
  const isProcessingScanRef = useRef(false);

  // Audio synthesizer for scan feedback
  const playSound = (type: "success" | "warning" | "error") => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === "success") {
        // High 2-tone pleasant chord (D5 -> A5)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc1.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880.00, ctx.currentTime);
        osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1); // D6

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      } else {
        // Warning / Error low double beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.setValueAtTime(260, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("Audio Context playback error:", e);
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "success") navigator.vibrate(100);
      else navigator.vibrate([100, 50, 100]);
    }
  };

  // 1. Fetch Sessions for Event
  const fetchSessions = async () => {
    setIsLoadingSesi(true);
    try {
      const res = await fetch(`/api/presensi/sesi?event=${encodeURIComponent(eventSlug)}&t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.tableMissing) {
        setTableMissing(true);
        return;
      }
      setTableMissing(false);
      setSesiList(data.data || []);
      // Auto select first session if none selected
      if (data.data?.length > 0 && !activeSesiId) {
        setActiveSesiId(data.data[0].id);
      }
    } catch (err) {
      console.error("Gagal mengambil sesi:", err);
    } finally {
      setIsLoadingSesi(false);
    }
  };

  // 2. Fetch Participants & Attendance Logs
  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const [resPeserta, resLogs] = await Promise.all([
        fetch(`/api/peserta?event=${encodeURIComponent(eventSlug)}&t=${Date.now()}`, { cache: "no-store" }),
        fetch(`/api/presensi/log?event=${encodeURIComponent(eventSlug)}&sesi_id=${encodeURIComponent(activeSesiId || "all")}&t=${Date.now()}`, { cache: "no-store" }),
      ]);

      const dataPeserta = await resPeserta.json();
      const dataLogs = await resLogs.json();

      if (Array.isArray(dataPeserta)) {
        setPesertaList(dataPeserta);
      }
      if (dataLogs && Array.isArray(dataLogs.data)) {
        setAttendanceLogs(dataLogs.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data peserta & log:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [eventSlug]);

  useEffect(() => {
    if (activeSesiId || sesiList.length === 0) {
      fetchData();
    }
  }, [activeSesiId, eventSlug]);

  // Attendance lookup map: NIM -> AbsensiLog for active session
  const attendanceMap = useMemo(() => {
    const map = new Map<string, AbsensiLog>();
    attendanceLogs.forEach((log) => {
      if (!activeSesiId || log.sesi_id === activeSesiId) {
        map.set(log.nim.trim(), log);
      }
    });
    return map;
  }, [attendanceLogs, activeSesiId]);

  // Current active session name
  const currentSesiName = useMemo(() => {
    const s = sesiList.find((item) => item.id === activeSesiId);
    return s ? s.nama_sesi : "Pilih Sesi Absen";
  }, [sesiList, activeSesiId]);

  // 3. Create New Attendance Session
  const handleCreateSesi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSesiName.trim()) return;

    setIsCreatingSesi(true);
    try {
      const res = await fetch("/api/presensi/sesi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_slug: eventSlug,
          nama_sesi: newSesiName.trim(),
        }),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Gagal membuat sesi baru.");
      }
      setNewSesiName("");
      setShowAddSesiModal(false);
      await fetchSessions();
      if (result.data?.id) {
        setActiveSesiId(result.data.id);
      }
    } catch (err: any) {
      alert(err.message || "Gagal membuat sesi.");
    } finally {
      setIsCreatingSesi(false);
    }
  };

  // 4. Delete Session
  const handleDeleteSesi = async (id: string, name: string) => {
    if (!confirm(`Hapus sesi "${name}"? Semua data presensi untuk sesi ini juga akan terhapus.`)) return;

    try {
      const res = await fetch(`/api/presensi/sesi/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus sesi.");
      if (activeSesiId === id) setActiveSesiId("");
      fetchSessions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 5. Verify Attendance Function (Used by both Camera QR & Manual Input)
  const verifyAttendance = async (code: string, metode: "qr_scan" | "manual" = "qr_scan") => {
    if (!activeSesiId) {
      setLastScanResult({
        type: "warning",
        title: "Sesi Belum Dipilih",
        message: "Silakan buat atau pilih Sesi Absen aktif terlebih dahulu di atas.",
      });
      playSound("warning");
      return;
    }

    if (!code || !code.trim()) return;

    setIsVerifying(true);
    try {
      const res = await fetch("/api/presensi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sesi_id: activeSesiId,
          event_slug: eventSlug,
          code: code.trim(),
          metode,
        }),
      });

      const result = await res.json();

      if (res.status === 404) {
        setLastScanResult({
          type: "error",
          title: "Peserta Tidak Ditemukan",
          message: `NIM / Kode "${code.trim()}" tidak terdaftar dalam database event ini.`,
        });
        playSound("error");
        return;
      }

      if (!res.ok) {
        throw new Error(result.error || "Gagal memverifikasi kehadiran.");
      }

      if (result.alreadyAttended) {
        const waktuStr = result.attendance?.waktu_absen 
          ? new Date(result.attendance.waktu_absen).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          : "sebelumnya";

        setLastScanResult({
          type: "warning",
          title: "Sudah Pernah Diabsen!",
          message: `${result.peserta.nama} (${result.peserta.nim}) sudah tercatat hadir pada pukul ${waktuStr} WITA.`,
          peserta: result.peserta,
          waktu: waktuStr,
        });
        playSound("warning");
      } else {
        // Success verified!
        const waktuStr = new Date(result.attendance.waktu_absen).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        setLastScanResult({
          type: "success",
          title: "✓ Kehadiran Terverifikasi!",
          message: `${result.peserta.nama} (${result.peserta.nim}) berhasil diverifikasi hadir.`,
          peserta: result.peserta,
          waktu: waktuStr,
        });
        playSound("success");

        // Immediately update local logs
        setAttendanceLogs((prev) => [result.attendance, ...prev]);
      }
    } catch (err: any) {
      setLastScanResult({
        type: "error",
        title: "Kesalahan Sistem",
        message: err.message || "Gagal memverifikasi presensi.",
      });
      playSound("error");
    } finally {
      setIsVerifying(false);
      setManualCode("");
    }
  };

  // 6. Handle Manual NIM Form Submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      verifyAttendance(manualCode, "manual");
    }
  };

  // 7. Cancel / Undo Attendance
  const handleCancelAttendance = async (nim: string, nama: string) => {
    if (!confirm(`Batalkan status kehadiran peserta "${nama}" pada sesi ${currentSesiName}?`)) return;

    try {
      const res = await fetch(`/api/presensi/verify?sesi_id=${encodeURIComponent(activeSesiId)}&nim=${encodeURIComponent(nim)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal membatalkan presensi.");

      setAttendanceLogs((prev) => prev.filter((log) => !(log.sesi_id === activeSesiId && log.nim.trim() === nim.trim())));
      if (lastScanResult?.peserta?.nim === nim) {
        setLastScanResult(null);
      }
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan.");
    }
  };

  // 8. Setup HTML5 QR Code Scanner
  const startScanner = async () => {
    if (!activeSesiId) {
      alert("Pilih atau buat sesi absensi terlebih dahulu sebelum menyalakan scanner kamera.");
      return;
    }

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      // Get cameras
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        alert("Tidak ditemukan kamera pada perangkat ini.");
        return;
      }

      setAvailableCameras(devices.map((d) => ({ id: d.id, label: d.label || "Kamera" })));

      // Prefer back camera (environment) if available
      let preferredCamera = selectedCameraId || devices[0].id;
      const backCam = devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("belakang") || d.label.toLowerCase().includes("environment"));
      if (backCam && !selectedCameraId) {
        preferredCamera = backCam.id;
        setSelectedCameraId(backCam.id);
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        preferredCamera,
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Debounce scan calls to prevent rapid repeated firing
          if (isProcessingScanRef.current) return;
          isProcessingScanRef.current = true;

          verifyAttendance(decodedText, "qr_scan").finally(() => {
            setTimeout(() => {
              isProcessingScanRef.current = false;
            }, 1800);
          });
        },
        () => {
          // QR not found in frame (ignore continuous scan ticks)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Gagal menyalakan scanner:", err);
      alert(`Gagal mengakses kamera: ${err.message || "Izin kamera ditolak atau kamera sedang digunakan."}`);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [isScanning]);

  // Switch camera when user picks another camera in dropdown
  const handleCameraChange = async (newCamId: string) => {
    setSelectedCameraId(newCamId);
    if (isScanning) {
      await stopScanner();
      setTimeout(() => {
        startScanner();
      }, 300);
    }
  };

  // Filtered Participants List
  const filteredPeserta = useMemo(() => {
    return pesertaList.filter((p) => {
      const isPresent = attendanceMap.has(p.nim.trim());

      // Filter by Attendance Status
      if (filterStatus === "hadir" && !isPresent) return false;
      if (filterStatus === "belum" && isPresent) return false;

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNama = p.nama.toLowerCase().includes(q);
        const matchNim = p.nim.toLowerCase().includes(q);
        const matchDelegasi = p.delegasi.toLowerCase().includes(q);
        const matchTicket = p.ticket_id.toLowerCase().includes(q);
        return matchNama || matchNim || matchDelegasi || matchTicket;
      }

      return true;
    });
  }, [pesertaList, attendanceMap, filterStatus, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = pesertaList.length;
    const hadir = pesertaList.filter((p) => attendanceMap.has(p.nim.trim())).length;
    const belum = total - hadir;
    const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;
    return { total, hadir, belum, persentase };
  }, [pesertaList, attendanceMap]);

  // Export Attendance CSV
  const handleExportCsv = () => {
    if (pesertaList.length === 0) return;

    const headers = ["No", "Nama Peserta", "NIM", "Asal Delegasi", "Email", "ID Tiket", `Status Kehadiran (${currentSesiName})`, "Waktu Absen (WITA)", "Metode"];
    const rows = filteredPeserta.map((p, idx) => {
      const att = attendanceMap.get(p.nim.trim());
      const statusStr = att ? "HADIR" : "BELUM HADIR";
      const waktuStr = att ? new Date(att.waktu_absen).toLocaleString("id-ID") : "-";
      const metodeStr = att ? (att.metode === "qr_scan" ? "Scan QR Kamera" : "Absen Manual") : "-";

      return [
        idx + 1,
        `"${p.nama.replace(/"/g, '""')}"`,
        `"${p.nim}"`,
        `"${p.delegasi.replace(/"/g, '""')}"`,
        `"${p.email}"`,
        `"${p.ticket_id}"`,
        `"${statusStr}"`,
        `"${waktuStr}"`,
        `"${metodeStr}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rekap-presensi-${eventSlug}-${currentSesiName.replace(/\s+/g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copySqlCode = () => {
    const sql = `-- Eksekusi di Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS event_sesi_absen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_slug TEXT NOT NULL DEFAULT 'antasari-media-lab',
    nama_sesi TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_absensi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesi_id UUID NOT NULL REFERENCES event_sesi_absen(id) ON DELETE CASCADE,
    event_slug TEXT NOT NULL DEFAULT 'antasari-media-lab',
    peserta_id UUID NOT NULL REFERENCES event_registrasi(id) ON DELETE CASCADE,
    nim TEXT NOT NULL,
    waktu_absen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metode TEXT NOT NULL DEFAULT 'qr_scan',
    catatan TEXT,
    CONSTRAINT unique_sesi_nim UNIQUE (sesi_id, nim)
);

ALTER TABLE event_sesi_absen ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_absensi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses penuh event_sesi_absen" ON event_sesi_absen;
CREATE POLICY "Akses penuh event_sesi_absen" ON event_sesi_absen FOR ALL USING (true);

DROP POLICY IF EXISTS "Akses penuh event_absensi" ON event_absensi;
CREATE POLICY "Akses penuh event_absensi" ON event_absensi FOR ALL USING (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Event Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#160808] p-5 sm:p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white font-poppins">
              Presensi & Verifikasi QR Code
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Scan tiket resmi peserta secara real-time, verifikasi kehadiran per sesi, dan pantau kehadiran mahasiswa.
          </p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 shrink-0">
            Event:
          </label>
          <select
            value={eventSlug}
            onChange={(e) => setEventSlug(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC]"
          >
            <option value="antasari-media-lab">Antasari Media Lab 2026</option>
            <option value="all">Semua Event</option>
          </select>
        </div>
      </div>

      {/* Database Setup Alert if tables not yet created in Supabase */}
      {tableMissing && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Database className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-950 font-poppins">
                Tabel Database Presensi Belum Diaktifkan di Supabase
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Supabase membutuhkan tabel <code>event_sesi_absen</code> dan <code>event_absensi</code> untuk mencatat presensi scan QR. Silakan jalankan script SQL kami sekali di SQL Editor Supabase Anda.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={copySqlCode}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 cursor-pointer transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? "Tersalin!" : "Salin Kode SQL"}</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/rifcawifuojzercjauhy/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm cursor-pointer transition-colors"
            >
              <span>Buka SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Sesi Absen Section (Admin creates/chooses session first) */}
      <div className="bg-white dark:bg-[#160808] p-5 sm:p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white font-poppins flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1C4BBC]" />
              <span>Sesi Absensi Aktif</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Pilih sesi absensi yang sedang berlangsung (misal: Datang, Siang, Pulang) untuk verifikasi scan QR:
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddSesiModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1C4BBC] hover:bg-[#153a99] shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jenis Absen</span>
          </button>
        </div>

        {/* Sesi Pills / Tabs */}
        {isLoadingSesi ? (
          <div className="py-4 text-xs text-neutral-400">Memuat sesi absensi...</div>
        ) : sesiList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-center space-y-2">
            <Clock className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Belum Ada Sesi Absensi
            </p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Silakan buat sesi absensi pertama terlebih dahulu (contoh: <strong>Absensi Datang (Pagi)</strong>) sebelum memulai scan tiket.
            </p>
            <button
              type="button"
              onClick={() => setShowAddSesiModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#1C4BBC] bg-[#1C4BBC]/10 hover:bg-[#1C4BBC]/15"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Sesi Pertama</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {sesiList.map((sesi) => {
              const isActive = sesi.id === activeSesiId;
              const sessionAttCount = attendanceLogs.filter((l) => l.sesi_id === sesi.id).length;

              return (
                <div
                  key={sesi.id}
                  className={`inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#1C4BBC] text-white border-[#1C4BBC] shadow-sm shadow-[#1C4BBC]/20"
                      : "bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-[#1C4BBC]"
                  }`}
                  onClick={() => setActiveSesiId(sesi.id)}
                >
                  <span>{sesi.nama_sesi}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {sessionAttCount} Hadir
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSesi(sesi.id, sesi.nama_sesi);
                    }}
                    className={`p-1 rounded hover:bg-red-500/20 transition-colors ${
                      isActive ? "text-white/70 hover:text-white" : "text-neutral-400 hover:text-red-500"
                    }`}
                    title="Hapus sesi ini"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scanner & Live Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Camera Scanner & Manual Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#160808] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-poppins flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#82BE3B]" />
                <span>Kamera Scanner QR</span>
              </h3>

              {isScanning ? (
                <button
                  type="button"
                  onClick={stopScanner}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>Matikan Kamera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startScanner}
                  disabled={!activeSesiId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Nyalakan Kamera</span>
                </button>
              )}
            </div>

            {/* Camera Viewport */}
            <div className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-square flex flex-col items-center justify-center border border-neutral-800">
              <div id={scannerContainerId} className="w-full h-full" />

              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-400 bg-neutral-950/80 space-y-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                    <QrCode className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-200">Kamera Scanner Sedang Nonaktif</p>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-xs">
                      Klik &quot;Nyalakan Kamera&quot; di atas untuk mulai memindai QR code tiket langsung dari kamera laptop atau ponsel Anda.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Selector Dropdown (if multiple cameras detected) */}
            {availableCameras.length > 1 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500 shrink-0">Pilih Kamera:</span>
                <select
                  value={selectedCameraId}
                  onChange={(e) => handleCameraChange(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs bg-neutral-50 dark:bg-neutral-900"
                >
                  {availableCameras.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label || "Kamera"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Manual NIM / Barcode Input */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <form onSubmit={handleManualSubmit} className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Scan Barcode Reader / Input NIM Manual:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Ketik NIM / ID Tiket, tekan Enter..."
                    disabled={!activeSesiId || isVerifying}
                    className="flex-1 px-3 py-2 rounded-xl text-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC]"
                  />
                  <button
                    type="submit"
                    disabled={!manualCode.trim() || isVerifying || !activeSesiId}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1C4BBC] hover:bg-[#153a99] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isVerifying ? "Verifikasi..." : "Hadirkan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Live Scan Status & Statistics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real-Time Last Scan Result Alert Banner */}
          {lastScanResult ? (
            <div
              className={`rounded-2xl p-5 border transition-all shadow-sm ${
                lastScanResult.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
                  : lastScanResult.type === "warning"
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100"
                  : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {lastScanResult.type === "success" ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : lastScanResult.type === "warning" ? (
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider block opacity-75">
                      {lastScanResult.type === "success" ? "Verifikasi Berhasil" : lastScanResult.type === "warning" ? "Peringatan Absen" : "Gagal Verifikasi"}
                    </span>
                    <h4 className="text-base font-bold font-poppins">{lastScanResult.title}</h4>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">{lastScanResult.message}</p>

                    {lastScanResult.peserta && (
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs bg-white/60 dark:bg-black/30 p-2.5 rounded-lg border border-black/5 dark:border-white/10 font-mono">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">NIM:</span>
                          <strong>{lastScanResult.peserta.nim}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Delegasi:</span>
                          <span>{lastScanResult.peserta.delegasi}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Sesi:</span>
                          <span className="font-sans font-semibold text-[#1C4BBC] dark:text-[#82BE3B]">{currentSesiName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLastScanResult(null)}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#160808] p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                    Siap Memindai Tiket Peserta
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Arahkan QR code tiket peserta ke kamera atau ketik NIM untuk mencatat kehadiran pada <strong>{currentSesiName}</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#160808] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <span className="text-[11px] text-neutral-500 font-medium block">Total Pendaftar</span>
              <strong className="text-xl font-bold font-mono text-neutral-900 dark:text-white">{stats.total}</strong>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 shadow-2xs">
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium block">Sudah Hadir</span>
              <div className="flex items-baseline gap-1.5">
                <strong className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300">{stats.hadir}</strong>
                <span className="text-xs font-semibold text-emerald-600">({stats.persentase}%)</span>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[11px] text-neutral-500 font-medium block">Belum Hadir</span>
              <strong className="text-xl font-bold font-mono text-neutral-600 dark:text-neutral-400">{stats.belum}</strong>
            </div>

            <div className="bg-white dark:bg-[#160808] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-center">
              <span className="text-[11px] text-neutral-500 font-medium block">Sesi Terpilih</span>
              <span className="text-xs font-bold text-[#1C4BBC] dark:text-[#82BE3B] truncate" title={currentSesiName}>
                {currentSesiName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Attendance Table Section */}
      <div className="bg-white dark:bg-[#160808] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Table Controls (Search, Filters, CSV Export) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === "all" ? "bg-white dark:bg-neutral-800 shadow-xs text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("hadir")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === "hadir" ? "bg-emerald-600 text-white shadow-xs font-bold" : "text-neutral-500 hover:text-emerald-600"
              }`}
            >
              Hadir ({stats.hadir})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("belum")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === "belum" ? "bg-neutral-700 text-white shadow-xs font-bold" : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Belum Hadir ({stats.belum})
            </button>
          </div>

          {/* Search Input & Action Buttons */}
          <div className="flex items-center gap-2.5 flex-1 max-w-md ml-auto">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIM, delegasi..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1C4BBC]"
              />
            </div>

            <button
              type="button"
              onClick={fetchData}
              disabled={isLoadingData}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={pesertaList.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Rekap CSV</span>
            </button>
          </div>
        </div>

        {/* The Participant Attendance Table */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-neutral-500 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3">Peserta & NIM</th>
                <th className="px-4 py-3">Asal Delegasi</th>
                <th className="px-4 py-3">ID Tiket</th>
                <th className="px-4 py-3 text-center">Status Kehadiran ({currentSesiName})</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {isLoadingData ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    <div className="w-6 h-6 border-2 border-[#1C4BBC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Memuat data presensi peserta...
                  </td>
                </tr>
              ) : filteredPeserta.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    Tidak ada peserta yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredPeserta.map((peserta, idx) => {
                  const att = attendanceMap.get(peserta.nim.trim());
                  const isPresent = !!att;

                  // ROW BECOMES GREEN IF PRESENT
                  return (
                    <tr
                      key={peserta.id}
                      className={`transition-colors ${
                        isPresent
                          ? "bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-medium"
                          : "hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center font-mono opacity-60">
                        {idx + 1}
                      </td>

                      <td className="px-4 py-3.5">
                        <strong className="block text-sm text-neutral-900 dark:text-white">
                          {peserta.nama}
                        </strong>
                        <span className="font-mono text-xs opacity-75">{peserta.nim}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="truncate max-w-[200px] block">{peserta.delegasi}</span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] opacity-75">
                        {peserta.ticket_id}
                      </td>

                      {/* Status Kehadiran Column */}
                      <td className="px-4 py-3.5 text-center">
                        {isPresent ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>HADIR</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                              Pukul {new Date(att.waktu_absen).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WITA
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                            <span>Belum Hadir</span>
                          </span>
                        )}
                      </td>

                      {/* Action Column */}
                      <td className="px-4 py-3.5 text-right">
                        {isPresent ? (
                          <button
                            type="button"
                            onClick={() => handleCancelAttendance(peserta.nim, peserta.nama)}
                            className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-semibold hover:underline cursor-pointer"
                          >
                            <span>Batal Absen</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => verifyAttendance(peserta.nim, "manual")}
                            disabled={!activeSesiId}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Hadirkan</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Sesi Absen Baru */}
      {showAddSesiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#160808] w-full max-w-md rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white font-poppins">
                Tambah Jenis Sesi Absen
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSesiModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSesi} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Nama Sesi Absensi:
                </label>
                <input
                  type="text"
                  required
                  value={newSesiName}
                  onChange={(e) => setNewSesiName(e.target.value)}
                  placeholder="Contoh: Absensi Datang / Pagi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1C4BBC]"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-500 block">Pilihan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Absensi Datang (Pagi)", "Absensi Siang (ISHOMA)", "Absensi Pulang (Sore)", "Sesi Materi 1"].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewSesiName(sug)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddSesiModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSesi || !newSesiName.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1C4BBC] hover:bg-[#153a99] transition-colors disabled:opacity-50"
                >
                  {isCreatingSesi ? "Menyimpan..." : "Simpan Sesi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
