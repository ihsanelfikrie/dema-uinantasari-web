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
  X, 
  Database, 
  ExternalLink, 
  Copy, 
  Check, 
  FlipHorizontal,
  ChevronDown
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
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // UI Modals & Filters
  const [showAddSesiModal, setShowAddSesiModal] = useState(false);
  const [newSesiName, setNewSesiName] = useState("");
  const [isCreatingSesi, setIsCreatingSesi] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "hadir" | "belum">("all");
  const [tableMissing, setTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [mobileTab, setMobileTab] = useState<"scanner" | "rekap">("scanner");
  const [mobileLimit, setMobileLimit] = useState(20);

  // Refs for native getUserMedia scanner (Safari iOS compatible)
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const isProcessingScanRef = useRef(false);

  // Audio synthesizer for scan feedback
  const playSound = (type: "success" | "warning" | "error") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (type === "success") {
        // High 2-tone pleasant chord (D5 -> A5)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc1.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(880.00, ctx.currentTime);
        osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      } else {
        // Warning / Error low double tone
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
      console.warn("Audio Context error:", e);
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "success") navigator.vibrate(120);
      else navigator.vibrate([100, 50, 100]);
    }
  };

  // 1. Fetch Sessions for Event (with local storage resilience fallback)
  const fetchSessions = async () => {
    setIsLoadingSesi(true);
    try {
      const res = await fetch(`/api/presensi/sesi?event=${encodeURIComponent(eventSlug)}&t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (data.tableMissing) {
        setTableMissing(true);
        // Resilient Fallback: Load sessions from localStorage
        const localKey = `local_presensi_sesi_${eventSlug}`;
        let localSesi: SesiAbsen[] = [];
        try {
          const saved = localStorage.getItem(localKey);
          if (saved) {
            localSesi = JSON.parse(saved);
          } else {
            // Seed 3 standard sessions
            localSesi = [
              { id: "sesi-datang", event_slug: eventSlug, nama_sesi: "Absensi Datang (Pagi)", is_active: true, created_at: new Date().toISOString() },
              { id: "sesi-siang", event_slug: eventSlug, nama_sesi: "Absensi Siang (ISHOMA)", is_active: true, created_at: new Date().toISOString() },
              { id: "sesi-pulang", event_slug: eventSlug, nama_sesi: "Absensi Pulang (Sore)", is_active: true, created_at: new Date().toISOString() },
            ];
            localStorage.setItem(localKey, JSON.stringify(localSesi));
          }
        } catch (e) {
          console.warn("LocalStorage error:", e);
        }

        setSesiList(localSesi);
        if (localSesi.length > 0 && !activeSesiId) {
          setActiveSesiId(localSesi[0].id);
        }
        return;
      }

      setTableMissing(false);
      setSesiList(data.data || []);
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
      } else if (tableMissing || dataLogs?.tableMissing) {
        // Load local attendance logs from localStorage fallback
        try {
          const localLogsKey = `local_logs_${eventSlug}_${activeSesiId}`;
          const savedLogs = localStorage.getItem(localLogsKey);
          if (savedLogs) {
            setAttendanceLogs(JSON.parse(savedLogs));
          } else {
            setAttendanceLogs([]);
          }
        } catch (e) {
          console.warn("LocalStorage logs error:", e);
        }
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
  }, [activeSesiId, eventSlug, tableMissing]);

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
      if (tableMissing) {
        // Local fallback creation
        const newSesi: SesiAbsen = {
          id: `sesi-${Date.now()}`,
          event_slug: eventSlug,
          nama_sesi: newSesiName.trim(),
          is_active: true,
          created_at: new Date().toISOString(),
        };
        const updated = [...sesiList, newSesi];
        setSesiList(updated);
        localStorage.setItem(`local_presensi_sesi_${eventSlug}`, JSON.stringify(updated));
        setActiveSesiId(newSesi.id);
        setNewSesiName("");
        setShowAddSesiModal(false);
        return;
      }

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
    if (!confirm(`Hapus sesi "${name}"? Data kehadiran sesi ini juga akan dibersihkan.`)) return;

    try {
      if (tableMissing) {
        const updated = sesiList.filter((s) => s.id !== id);
        setSesiList(updated);
        localStorage.setItem(`local_presensi_sesi_${eventSlug}`, JSON.stringify(updated));
        if (activeSesiId === id) setActiveSesiId(updated[0]?.id || "");
        return;
      }

      const res = await fetch(`/api/presensi/sesi/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus sesi.");
      if (activeSesiId === id) setActiveSesiId("");
      fetchSessions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Helper: tampilkan hasil scan & auto-clear setelah 2.5 detik
  const showResultRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showResult = (result: ScanResult) => {
    if (showResultRef.current) clearTimeout(showResultRef.current);
    setLastScanResult(result);
    showResultRef.current = setTimeout(() => {
      setLastScanResult(null);
    }, 2500);
  };

  // 5. Verify Attendance Function (Camera QR & Manual Input)
  const verifyAttendance = async (code: string, metode: "qr_scan" | "manual" = "qr_scan") => {
    if (!activeSesiId) {
      showResult({
        type: "warning",
        title: "Sesi Belum Dipilih",
        message: "Silakan pilih sesi absensi yang aktif terlebih dahulu sebelum memindai.",
      });
      playSound("warning");
      return;
    }

    if (!code || !code.trim()) return;

    setIsVerifying(true);
    try {
      let cleanCode = code.trim().replace(/\s+/g, "");
      if (cleanCode.includes("nim=")) {
        const match = cleanCode.match(/nim=([^&]+)/);
        if (match) cleanCode = match[1];
      }

      // Check if table missing (Local Fallback Verification)
      if (tableMissing) {
        const matched = pesertaList.find(
          (p) => p.nim.trim() === cleanCode || p.ticket_id.trim() === cleanCode
        );

        if (!matched) {
          showResult({
            type: "error",
            title: "Peserta Tidak Ditemukan",
            message: `NIM / Kode "${cleanCode}" tidak terdaftar dalam database event ini.`,
          });
          playSound("error");
          return;
        }

        // Check if already attended
        const existingAtt = attendanceMap.get(matched.nim.trim());
        if (existingAtt) {
          const waktuStr = new Date(existingAtt.waktu_absen).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          showResult({
            type: "warning",
            title: "Sudah Pernah Diabsen!",
            message: `${matched.nama} (${matched.nim}) sudah tercatat hadir pada pukul ${waktuStr} WITA.`,
            peserta: matched,
            waktu: waktuStr,
          });
          playSound("warning");
          return;
        }

        // Record locally
        const newRecord: AbsensiLog = {
          id: `log-${Date.now()}`,
          sesi_id: activeSesiId,
          peserta_id: matched.id,
          nim: matched.nim,
          waktu_absen: new Date().toISOString(),
          metode,
        };

        const updatedLogs = [newRecord, ...attendanceLogs];
        setAttendanceLogs(updatedLogs);
        try {
          localStorage.setItem(`local_logs_${eventSlug}_${activeSesiId}`, JSON.stringify(updatedLogs));
        } catch (e) {}

        const waktuStr = new Date(newRecord.waktu_absen).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        showResult({
          type: "success",
          title: "✓ Kehadiran Terverifikasi!",
          message: `${matched.nama} (${matched.nim}) berhasil diverifikasi hadir.`,
          peserta: matched,
          waktu: waktuStr,
        });
        playSound("success");
        return;
      }

      // Production Server Verification
      const res = await fetch("/api/presensi/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sesi_id: activeSesiId,
          event_slug: eventSlug,
          code: cleanCode,
          metode,
        }),
      });

      const result = await res.json();

      if (res.status === 404) {
        showResult({
          type: "error",
          title: "Peserta Tidak Ditemukan",
          message: `NIM / Kode "${cleanCode}" tidak terdaftar dalam database event ini.`,
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

        showResult({
          type: "warning",
          title: "Sudah Pernah Diabsen!",
          message: `${result.peserta.nama} (${result.peserta.nim}) sudah tercatat hadir pada pukul ${waktuStr} WITA.`,
          peserta: result.peserta,
          waktu: waktuStr,
        });
        playSound("warning");
      } else {
        const waktuStr = new Date(result.attendance.waktu_absen).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

        showResult({
          type: "success",
          title: "✓ Kehadiran Terverifikasi!",
          message: `${result.peserta.nama} (${result.peserta.nim}) berhasil diverifikasi hadir.`,
          peserta: result.peserta,
          waktu: waktuStr,
        });
        playSound("success");

        setAttendanceLogs((prev) => [result.attendance, ...prev]);
      }
    } catch (err: any) {
      showResult({
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
      if (tableMissing) {
        const updated = attendanceLogs.filter((log) => !(log.sesi_id === activeSesiId && log.nim.trim() === nim.trim()));
        setAttendanceLogs(updated);
        localStorage.setItem(`local_logs_${eventSlug}_${activeSesiId}`, JSON.stringify(updated));
        if (lastScanResult?.peserta?.nim === nim) setLastScanResult(null);
        return;
      }

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

  // 8. Native getUserMedia + jsQR scanner — works on Safari iOS, Android Chrome, all browsers
  const stopScanner = () => {
    if (rafRef.current) {
      clearInterval(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startScanner = async () => {
    if (!activeSesiId) {
      alert("Pilih atau buat sesi absensi terlebih dahulu sebelum menyalakan scanner.");
      return;
    }

    setCameraError(null);

    // Stop any existing stream first
    stopScanner();

    try {
      // Safari iOS: must call getUserMedia after a user gesture.
      // Use simple facingMode without `exact` to avoid OverconstrainedError on some iPhone models.
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) { stopScanner(); return; }

      // CRITICAL for Safari iOS: playsinline + muted must be set before srcObject
      video.setAttribute("playsinline", "true");
      video.setAttribute("muted", "true");
      video.muted = true;
      video.srcObject = stream;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = reject;
      });

      await video.play();
      setIsScanning(true);

      // Pre-load jsQR ONCE before the scan loop — removes per-frame async overhead
      const jsQR = (await import("jsqr")).default;

      // Use a canvas that stays at a stable moderate resolution for reliable jsQR detection.
      // Full 1280x720 is often TOO high-res for jsQR to scan quickly on phone CPUs.
      // Downsample to max 640px wide keeps it fast while preserving QR readability.
      const SCAN_W = 640;
      const SCAN_H = 360;
      const canvas = canvasRef.current!;
      canvas.width = SCAN_W;
      canvas.height = SCAN_H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      // Synchronous scan tick — runs every ~120ms (≈8fps decode, plenty for QR)
      // Using setInterval instead of async RAF avoids frame scheduling issues on Safari
      const intervalId = setInterval(() => {
        const vid = videoRef.current;
        if (!vid || !streamRef.current || vid.readyState < vid.HAVE_ENOUGH_DATA || vid.videoWidth === 0) return;
        if (isProcessingScanRef.current) return;

        // Draw downsampled frame to canvas
        ctx.drawImage(vid, 0, 0, SCAN_W, SCAN_H);
        const imageData = ctx.getImageData(0, 0, SCAN_W, SCAN_H);

        // attemptBoth: try normal + inverted — handles dark/light backgrounds & varied lighting
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });

        if (code && code.data && code.data.trim()) {
          isProcessingScanRef.current = true;
          verifyAttendance(code.data.trim(), "qr_scan").finally(() => {
            setTimeout(() => {
              isProcessingScanRef.current = false;
            }, 2000);
          });
        }
      }, 120);

      // Store intervalId in rafRef so stopScanner can clear it
      rafRef.current = intervalId as unknown as number;


    } catch (err: any) {
      console.error("Gagal mengakses kamera:", err);
      let msg = "Tidak dapat mengakses kamera.";
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        msg = "Izin kamera ditolak. Buka Pengaturan → Safari → Kamera → Izinkan, lalu muat ulang halaman.";
      } else if (err?.name === "NotFoundError") {
        msg = "Kamera tidak ditemukan di perangkat ini.";
      } else if (err?.name === "OverconstrainedError") {
        msg = "Kamera tidak mendukung resolusi yang diminta. Mencoba konfigurasi alternatif...";
        // Retry with minimal constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = fallbackStream;
          const video = videoRef.current!;
          video.setAttribute("playsinline", "true");
          video.muted = true;
          video.srcObject = fallbackStream;
          await video.play();
          setIsScanning(true);
          return;
        } catch (e2: any) {
          msg = `Gagal mengakses kamera: ${e2?.message}`;
        }
      } else {
        msg = `Gagal mengakses kamera: ${err?.message || "Kesalahan tidak diketahui"}`;
      }
      setCameraError(msg);
      setIsScanning(false);
    }
  };

  // Flip Camera between Rear and Front
  const flipCamera = async () => {
    const nextFacing: "environment" | "user" = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    stopScanner();
    // Small delay to allow stream cleanup before re-opening
    setTimeout(() => startScanner(), 400);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopScanner();
  }, []);

  // Re-start scanner when cameraFacing changes while scanning
  const handleCameraChange = async (newFacing: "environment" | "user") => {
    setCameraFacing(newFacing);
    if (isScanning) {
      stopScanner();
      setTimeout(() => startScanner(), 400);
    }
  };

  // Filtered Participants List
  const filteredPeserta = useMemo(() => {
    return pesertaList.filter((p) => {
      const isPresent = attendanceMap.has(p.nim.trim());

      if (filterStatus === "hadir" && !isPresent) return false;
      if (filterStatus === "belum" && isPresent) return false;

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
        `"'${p.nim}"`,
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
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Event Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 font-poppins">
              Presensi & Verifikasi QR Code
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pindai tiket peserta langsung lewat kamera HP atau barcode reader.
          </p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
          <label className="text-xs font-semibold text-neutral-600 shrink-0">
            Event:
          </label>
          <select
            value={eventSlug}
            onChange={(e) => setEventSlug(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-300 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="antasari-media-lab">Antasari Media Lab 2026</option>
            <option value="all">Semua Event</option>
          </select>
        </div>
      </div>

      {/* Database Assistant Banner (if SQL hasn't been run yet) */}
      {tableMissing && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-amber-950 font-poppins">
                  Mode Presensi Aktif (Penyimpanan Lokal Aktif)
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900">
                  Siap Digunakan
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Anda sudah bisa langsung scan dan mencoba fitur presensi di HP sekarang. Untuk sinkronisasi database permanen di Supabase, cukup jalankan script SQL sekali di SQL Editor.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={copySqlCode}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 cursor-pointer transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? "Tersalin!" : "Salin SQL"}</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/rifcawifuojzercjauhy/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs cursor-pointer transition-colors"
            >
              <span>Buka SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 2. Kelola Sesi Absensi */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-neutral-900 font-poppins flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-primary" />
              <span>Sesi Absensi:</span>
              <span className="text-brand-primary underline underline-offset-2">
                {currentSesiName}
              </span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Pilih sesi aktif untuk verifikasi atau tambah sesi baru:
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddSesiModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-accent shadow-sm transition-all cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Jenis Absen</span>
          </button>
        </div>

        {/* Sesi Scrollable Pills */}
        {isLoadingSesi ? (
          <div className="py-2 text-xs text-neutral-400">Memuat sesi absensi...</div>
        ) : sesiList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-center space-y-2">
            <p className="text-xs font-semibold text-neutral-700">
              Belum Ada Sesi Absensi
            </p>
            <button
              type="button"
              onClick={() => setShowAddSesiModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-primary bg-brand-primary/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Sesi Pertama</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
            {sesiList.map((sesi) => {
              const isActive = sesi.id === activeSesiId;
              const sessionAttCount = attendanceLogs.filter((l) => l.sesi_id === sesi.id).length;

              return (
                <div
                  key={sesi.id}
                  className={`shrink-0 inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-brand-primary"
                  }`}
                  onClick={() => setActiveSesiId(sesi.id)}
                >
                  <span className="whitespace-nowrap">{sesi.nama_sesi}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {sessionAttCount}
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
                    title="Hapus sesi"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Segmented Control (< lg) */}
      <div className="lg:hidden grid grid-cols-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab("scanner")}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === "scanner"
              ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-600" />
          <span>Scanner QR ({isScanning ? "Aktif" : "Siap"})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("rekap")}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === "rekap"
              ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Users className="w-4 h-4 text-brand-primary" />
          <span>Daftar Peserta ({stats.hadir}/{stats.total})</span>
        </button>
      </div>

      {/* 3. Scanner & Status Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 ${mobileTab === "rekap" ? "hidden lg:grid" : ""}`}>
        {/* Left Column: Camera Viewport & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#160808] p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white font-poppins flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Kamera Scanner</span>
              </h3>

              <div className="flex items-center gap-1.5">
                {isScanning && (
                  <button
                    type="button"
                    onClick={flipCamera}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 text-neutral-600 dark:text-neutral-300"
                    title="Putar Kamera Depan/Belakang"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                )}

                {isScanning ? (
                  <button
                    type="button"
                    onClick={stopScanner}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <CameraOff className="w-3.5 h-3.5" />
                    <span>Tutup</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startScanner}
                    disabled={!activeSesiId}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Nyalakan Kamera</span>
                  </button>
                )}
              </div>
            </div>

            {/* Native Camera Viewport — Safari iOS + Android Chrome compatible */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-square max-w-sm mx-auto flex flex-col items-center justify-center border border-neutral-800 shadow-inner">
              {/* Live video feed — playsinline + muted required by Safari iOS */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover ${isScanning ? "block" : "hidden"}`}
              />
              {/* Hidden canvas for jsQR frame decode */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder overlay when scanning */}
              {isScanning && !lastScanResult && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Corner brackets */}
                  <div className="relative w-52 h-52">
                    <span className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-white/80 rounded-tl-md" />
                    <span className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-white/80 rounded-tr-md" />
                    <span className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-white/80 rounded-bl-md" />
                    <span className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-white/80 rounded-br-md" />
                    {/* Scan line animation */}
                    <span className="absolute left-1 right-1 h-0.5 bg-emerald-400/80 rounded-full animate-scan-line" />
                  </div>
                </div>
              )}

              {/* ✅ SCAN RESULT OVERLAY — muncul langsung di atas kamera */}
              {isScanning && lastScanResult && (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-5 text-center pointer-events-none
                    ${lastScanResult.type === "success"
                      ? "bg-emerald-900/90"
                      : lastScanResult.type === "warning"
                      ? "bg-amber-900/90"
                      : "bg-red-900/90"
                    }`}
                >
                  {/* Icon besar */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 text-white
                    ${lastScanResult.type === "success" ? "bg-emerald-500" : lastScanResult.type === "warning" ? "bg-amber-500" : "bg-red-500"}`}>
                    {lastScanResult.type === "success"
                      ? <CheckCircle2 className="w-8 h-8" />
                      : lastScanResult.type === "warning"
                      ? <AlertTriangle className="w-8 h-8" />
                      : <AlertCircle className="w-8 h-8" />
                    }
                  </div>
                  {/* Judul */}
                  <p className={`text-base font-bold text-white leading-tight`}>
                    {lastScanResult.title}
                  </p>
                  {/* Pesan detail */}
                  <p className="text-xs text-white/80 mt-1.5 leading-relaxed max-w-[220px]">
                    {lastScanResult.message}
                  </p>
                  {/* Nama & waktu */}
                  {lastScanResult.peserta && (
                    <div className={`mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-white
                      ${lastScanResult.type === "success" ? "bg-emerald-600/60" : lastScanResult.type === "warning" ? "bg-amber-600/60" : "bg-red-600/60"}`}>
                      {lastScanResult.peserta.nama}
                      {lastScanResult.waktu && (
                        <span className="font-normal text-white/70 ml-1">· {lastScanResult.waktu} WITA</span>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-white/40 mt-3">Scan otomatis lanjut dalam 2 detik...</p>
                </div>
              )}

              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-400 bg-neutral-950/85 space-y-2.5 pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-200">Kamera Sedang Nonaktif</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Klik <strong>&quot;Nyalakan Kamera&quot;</strong> di atas untuk memindai QR tiket peserta.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera error banner */}
            {cameraError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">Kamera gagal aktif</p>
                  <p>{cameraError}</p>
                </div>
              </div>
            )}


            {/* Manual NIM / Ticket Input */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <form onSubmit={handleManualSubmit} className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block">
                  Input NIM / ID Tiket Manual:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Ketik NIM lalu tekan Enter..."
                    disabled={!activeSesiId || isVerifying}
                    className="flex-1 px-3 py-2 rounded-xl text-xs border border-neutral-200 bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    type="submit"
                    disabled={!manualCode.trim() || isVerifying || !activeSesiId}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-accent transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isVerifying ? "Cek..." : "Hadir"}
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile Quick Counters under Camera & Manual Input */}
            <div className="lg:hidden pt-3 border-t border-neutral-100 space-y-2.5">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200/80 text-center">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-wider block">Total</span>
                  <strong className="text-sm font-bold font-mono text-neutral-900">{stats.total}</strong>
                </div>
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200/80 text-center">
                  <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider block">Hadir</span>
                  <strong className="text-sm font-bold font-mono text-emerald-700">{stats.hadir}</strong>
                </div>
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200/80 text-center">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-wider block">Belum</span>
                  <strong className="text-sm font-bold font-mono text-neutral-600">{stats.belum}</strong>
                </div>
              </div>

              {/* Shortcut button to switch to participant list without scrolling */}
              <button
                type="button"
                onClick={() => setMobileTab("rekap")}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center justify-between shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Lihat Daftar Peserta ({stats.hadir} Hadir)</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Result Banner & Summary Counters (7 cols) - Desktop Only, mobile has overlay */}
        <div className="hidden lg:block lg:col-span-7 space-y-3.5">
          {/* Real-Time Scan Result Alert Banner */}
          {lastScanResult ? (
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-sm ${
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : lastScanResult.type === "warning" ? (
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-75">
                      {lastScanResult.type === "success" ? "Verifikasi Berhasil" : lastScanResult.type === "warning" ? "Peringatan" : "Tidak Ditemukan"}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold font-poppins">{lastScanResult.title}</h4>
                    <p className="text-xs mt-0.5 leading-relaxed opacity-90">{lastScanResult.message}</p>

                    {lastScanResult.peserta && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs bg-white/70 dark:bg-black/30 p-2 rounded-lg border border-black/5 dark:border-white/10 font-mono">
                        <div>
                          <span className="text-[10px] text-neutral-500 block">NIM:</span>
                          <strong>{lastScanResult.peserta.nim}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block">Delegasi:</span>
                          <span>{lastScanResult.peserta.delegasi}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLastScanResult(null)}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#160808] p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  Siap Memindai Tiket
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Arahkan QR tiket ke kotak bidik kamera atau ketik NIM di kolom manual.
                </p>
              </div>
            </div>
          )}

          {/* Quick Statistics Bar (Compact 4 columns on mobile & desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white dark:bg-[#160808] p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] text-neutral-500 font-medium block">Total Pendaftar</span>
              <strong className="text-lg font-bold font-mono text-neutral-900 dark:text-white">{stats.total}</strong>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/40 shadow-2xs">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-medium block">Sudah Hadir</span>
              <div className="flex items-baseline gap-1">
                <strong className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">{stats.hadir}</strong>
                <span className="text-[11px] font-semibold text-emerald-600">({stats.persentase}%)</span>
              </div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-900 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <span className="text-[10px] text-neutral-500 font-medium block">Belum Hadir</span>
              <strong className="text-lg font-bold font-mono text-neutral-600 dark:text-neutral-400">{stats.belum}</strong>
            </div>

            <div className="bg-white dark:bg-[#160808] p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col justify-center">
              <span className="text-[10px] text-neutral-500 font-medium block">Sesi Terpilih</span>
              <span className="text-xs font-bold text-brand-primary dark:text-[#82BE3B] truncate" title={currentSesiName}>
                {currentSesiName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rekap Kehadiran (Desktop Table + Mobile Touch Card List) */}
      <div className={`bg-white dark:bg-[#160808] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4 p-4 sm:p-6 ${mobileTab === "scanner" ? "hidden lg:block" : "block"}`}>
        {/* Mobile Header in Rekap Tab: Quick Back to Scanner */}
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setMobileTab("scanner")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>← Buka Kamera Scanner</span>
          </button>
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block font-medium">Kehadiran</span>
            <span className="text-xs font-bold font-mono text-emerald-600">
              {stats.hadir} / {stats.total} ({stats.persentase}%)
            </span>
          </div>
        </div>

        {/* Controls: Filter Tabs, Search & Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === "all" ? "bg-white dark:bg-neutral-800 shadow-2xs text-neutral-900 dark:text-white" : "text-neutral-500"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("hadir")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === "hadir" ? "bg-emerald-600 text-white shadow-2xs font-bold" : "text-neutral-500"
              }`}
            >
              Hadir ({stats.hadir})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("belum")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === "belum" ? "bg-neutral-700 text-white shadow-2xs font-bold" : "text-neutral-500"
              }`}
            >
              Belum ({stats.belum})
            </button>
          </div>

          {/* Search Input & Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama / NIM..."
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <button
              type="button"
              onClick={fetchData}
              disabled={isLoadingData}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 text-neutral-600 dark:text-neutral-400 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={pesertaList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 cursor-pointer disabled:opacity-50"
              title="Download CSV Rekap"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Mobile Card View (< 640px) */}
        <div className="sm:hidden space-y-2.5">
          {isLoadingData ? (
            <div className="py-10 text-center text-xs text-neutral-400">
              <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Memuat data peserta...
            </div>
          ) : filteredPeserta.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-400">
              Tidak ada data yang cocok dengan filter.
            </div>
          ) : (
            <>
              {filteredPeserta.slice(0, mobileLimit).map((peserta) => {
                const att = attendanceMap.get(peserta.nim.trim());
                const isPresent = !!att;

                return (
                  <div
                    key={peserta.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isPresent
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/80 shadow-2xs"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <strong className="text-xs font-bold text-neutral-900 dark:text-white block">
                          {peserta.nama}
                        </strong>
                        <span className="font-mono text-[11px] text-neutral-500 block">
                          NIM: {peserta.nim} · {peserta.delegasi}
                        </span>
                      </div>

                      {/* Status Badge */}
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shrink-0 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>HADIR</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 shrink-0">
                          Belum Hadir
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[10px] text-neutral-400">
                        {isPresent && att?.waktu_absen
                          ? `Pukul ${new Date(att.waktu_absen).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WITA`
                          : peserta.ticket_id}
                      </span>

                      {isPresent ? (
                        <button
                          type="button"
                          onClick={() => handleCancelAttendance(peserta.nim, peserta.nama)}
                          className="text-red-600 font-semibold hover:underline text-[11px]"
                        >
                          Batal Hadir
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => verifyAttendance(peserta.nim, "manual")}
                          disabled={!activeSesiId}
                          className="px-3 py-1 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 text-[11px] shadow-2xs disabled:opacity-50"
                        >
                          + Hadirkan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Show more button to prevent endless scrolling on mobile */}
              {filteredPeserta.length > mobileLimit && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setMobileLimit((prev) => prev + 25)}
                    className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-bold text-brand-primary hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Tampilkan 25 Peserta Lagi ({filteredPeserta.length - mobileLimit} tersisa)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop Table View (>= 640px) */}
        <div className="hidden sm:block border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto">
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
                    <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
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

                  // ROW TURNS EMERALD GREEN IF PRESENT
                  return (
                    <tr
                      key={peserta.id}
                      className={`transition-colors ${
                        isPresent
                          ? "bg-emerald-50/90 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-medium border-l-4 border-l-emerald-500"
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
          <div className="bg-white dark:bg-[#160808] w-full max-w-md rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white font-poppins">
                Tambah Jenis Sesi Absen
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSesiModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-500 block">Pilihan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Absensi Datang (Pagi)", "Absensi Siang (ISHOMA)", "Absensi Pulang (Sore)", "Sesi Workshop 1"].map((sug) => (
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSesi || !newSesiName.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-accent transition-colors disabled:opacity-50"
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
