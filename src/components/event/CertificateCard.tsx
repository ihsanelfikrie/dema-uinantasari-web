"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  Award, 
  X, 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Info
} from "lucide-react";

export interface CertificateRenderData {
  nama: string;
  nim: string;
  delegasi: string;
  ticketId: string;
  nomorSertifikat: string;
  config: {
    template_url?: string;
    nama_pos_y?: number;
    nama_font_size?: number;
    nama_color?: string;
    nomor_pos_x?: number;
    nomor_pos_y?: number;
    nomor_font_size?: number;
    nomor_color?: string;
  };
}

interface CertificateCardProps {
  data: CertificateRenderData;
  onClose?: () => void;
}

export default function CertificateCard({ data, onClose }: CertificateCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<boolean>(false);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);

  // Standar Cetak Resmi A4 Landscape (300 DPI) = 3508 x 2480 px
  const CANVAS_WIDTH = 3508;
  const CANVAS_HEIGHT = 2480;

  useEffect(() => {
    let isCancelled = false;

    // Helper: Safely load image as ObjectURL blob to prevent canvas tainting (CORS)
    const loadSafeImage = async (url: string, timeoutMs = 8000): Promise<HTMLImageElement> => {
      return new Promise(async (resolve, reject) => {
        let objectUrlToRevoke: string | null = null;
        let resolvedSrc = url;

        const timer = setTimeout(() => {
          if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
          reject(new Error("Timeout memuat gambar template sertifikat"));
        }, timeoutMs);

        try {
          // Attempt fetch as blob: converts remote image into local origin (never taints canvas)
          const res = await fetch(url, { mode: "cors" });
          if (res.ok) {
            const blob = await res.blob();
            resolvedSrc = URL.createObjectURL(blob);
            objectUrlToRevoke = resolvedSrc;
          }
        } catch {
          // Fetch failed (e.g. cross-origin blocking fetch) -> fallback to direct Image URL
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          clearTimeout(timer);
          resolve(img);
          if (objectUrlToRevoke) {
            setTimeout(() => URL.revokeObjectURL(objectUrlToRevoke!), 10000);
          }
        };
        img.onerror = (err) => {
          clearTimeout(timer);
          if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
          reject(err);
        };
        img.src = resolvedSrc;
      });
    };

    async function renderCertificate() {
      setIsRendering(true);
      setRenderError(false);
      setIsFallbackMode(false);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // 1. Mitigasi Font Race Condition: Pastikan font Poppins siap sebelum dirender
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // Abaikan jika browser tidak mendukung
        }
      }

      const conf = data.config || {};
      const nomorX = conf.nomor_pos_x ?? 1754;
      const nomorY = conf.nomor_pos_y ?? 845;
      const nomorSize = conf.nomor_font_size ?? 44;
      const nomorColor = conf.nomor_color || "#FFFFFF";

      const namaY = conf.nama_pos_y ?? 1232;
      const namaSize = conf.nama_font_size ?? 86;
      const namaColor = conf.nama_color || "#FFFFFF";

      // 2. Fungsi Menggambar Teks Dinamis dengan Proteksi Auto-Shrink untuk Nama Panjang
      const drawTexts = (isVector = false) => {
        // --- A. Render Nomor Surat ---
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isVector ? "#333333" : nomorColor;
        let effectiveNomorSize = isVector ? 38 : nomorSize;
        ctx.font = `600 ${effectiveNomorSize}px Poppins, sans-serif`;
        const fullNomorStr = data.nomorSertifikat;
        while (ctx.measureText(fullNomorStr).width > 1200 && effectiveNomorSize > 20) {
          effectiveNomorSize -= 2;
          ctx.font = `600 ${effectiveNomorSize}px Poppins, sans-serif`;
        }
        ctx.fillText(fullNomorStr, nomorX, isVector ? 780 : nomorY);

        // --- B. Render Nama Peserta dengan Auto-Scale Font ---
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isVector ? "#1C4BBC" : namaColor;
        let effectiveNamaSize = isVector ? 84 : namaSize;
        ctx.font = `bold ${effectiveNamaSize}px Poppins, sans-serif`;

        // Batasi lebar maksimum nama agar pas di dalam bracket box (lebar max 2400px)
        const MAX_NAME_WIDTH = 2400;
        while (ctx.measureText(data.nama).width > MAX_NAME_WIDTH && effectiveNamaSize > 38) {
          effectiveNamaSize -= 2;
          ctx.font = `bold ${effectiveNamaSize}px Poppins, sans-serif`;
        }

        ctx.fillText(data.nama, CANVAS_WIDTH / 2, isVector ? 1180 : namaY);

        // Underline aksen hanya jika pada vector fallback (karena template resmi sudah memiliki bracket box)
        if (isVector) {
          const textWidth = ctx.measureText(data.nama).width;
          ctx.strokeStyle = "#1C4BBC55";
          ctx.lineWidth = Math.max(3, Math.round(effectiveNamaSize * 0.05));
          ctx.beginPath();
          const underlineY = 1180 + Math.round(effectiveNamaSize * 0.35);
          ctx.moveTo(CANVAS_WIDTH / 2 - textWidth / 2, underlineY);
          ctx.lineTo(CANVAS_WIDTH / 2 + textWidth / 2, underlineY);
          ctx.stroke();
        }
      };

      // 3. Fallback Template Vektor Elegan (Jika template gambar belum diunggah atau gagal dimuat)
      const drawVectorFallback = () => {
        setIsFallbackMode(true);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Background krem halus
        ctx.fillStyle = "#FBFBFA";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Frame Luar Biru DEMA
        ctx.strokeStyle = "#1C4BBC";
        ctx.lineWidth = 24;
        ctx.strokeRect(60, 60, CANVAS_WIDTH - 120, CANVAS_HEIGHT - 120);

        // Frame Dalam Emas / Hijau
        ctx.strokeStyle = "#82BE3B";
        ctx.lineWidth = 8;
        ctx.strokeRect(95, 95, CANVAS_WIDTH - 190, CANVAS_HEIGHT - 190);

        // Header Instansi
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

        // Tanda Tangan & Tanggal
        ctx.fillStyle = "#333333";
        ctx.font = "500 36px Poppins, sans-serif";
        ctx.fillText("Banjarmasin, 3 Oktober 2026", CANVAS_WIDTH / 2, 1850);

        ctx.fillText("Ketua DEMA UIN Antasari", 800, 2020);
        ctx.fillText("Menteri Komunikasi & Informasi", CANVAS_WIDTH - 800, 2020);

        // Render Nomor dan Nama
        drawTexts(true);
      };

      // 4. Finalisasi Ekspor Gambar dengan Mitigasi Tainted Canvas
      const finalizeCanvasExport = () => {
        if (isCancelled) return;
        try {
          const dataUrl = canvas.toDataURL("image/png", 1.0);
          setImageUrl(dataUrl);
          setIsRendering(false);
        } catch (err) {
          console.warn("Tainted canvas terdeteksi saat ekspor template luar. Beralih ke vector fallback...", err);
          drawVectorFallback();
          try {
            const fallbackDataUrl = canvas.toDataURL("image/png", 1.0);
            setImageUrl(fallbackDataUrl);
            setIsRendering(false);
          } catch (fatalErr) {
            console.error("Gagal total merender canvas:", fatalErr);
            setRenderError(true);
            setIsRendering(false);
          }
        }
      };

      // 5. Muat Template Gambar jika Tersedia
      const resolvedTemplateUrl = conf.template_url || "/images/event/sertifikat-template-aml.png";
      if (resolvedTemplateUrl) {
        try {
          const img = await loadSafeImage(resolvedTemplateUrl);
          if (isCancelled) return;
          ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          drawTexts(false);
          finalizeCanvasExport();
        } catch (imgErr) {
          console.warn("Gagal memuat template gambar resmi. Menggunakan template vektor internal:", imgErr);
          if (isCancelled) return;
          drawVectorFallback();
          finalizeCanvasExport();
        }
      } else {
        drawVectorFallback();
        finalizeCanvasExport();
      }
    }

    renderCertificate();

    return () => {
      isCancelled = true;
    };
  }, [data]);

  // Handler Download dengan Mitigasi Browser Mobile (iOS / Android)
  const handleDownload = () => {
    if (!imageUrl) return;
    try {
      const a = document.createElement("a");
      a.href = imageUrl;
      const safeName = data.nama.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 35);
      const safeNim = data.nim.replace(/[^a-zA-Z0-9]/g, "");
      a.download = `Sertifikat-AML2026-${safeName}-${safeNim}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Jika download attribute diblokir browser mobile, buka tab baru
      window.open(imageUrl, "_blank");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-[#140606] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-7 shadow-xl space-y-5">
      {/* Printable Area Scoped CSS: Menjamin Cetak / Simpan PDF Hanya Menampilkan Sertifikat Penuh A4 Landscape */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-certificate-stage,
          #print-certificate-stage * {
            visibility: visible !important;
          }
          #print-certificate-stage {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 999999 !important;
          }
          #print-certificate-stage img {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
          }
        }
      `}</style>

      {/* Hidden Render Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Dedicated Print Container */}
      {imageUrl && (
        <div id="print-certificate-stage" className="hidden">
          <img
            src={imageUrl}
            alt={`Sertifikat ${data.nama}`}
          />
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white font-poppins flex items-center gap-2">
              <span>E-Sertifikat Resmi Terverifikasi</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                Resmi
              </span>
            </h4>
            <span className="text-[11px] font-mono text-neutral-500">
              No: {data.nomorSertifikat}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Tutup sertifikat"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Participant Meta Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 text-xs">
        <div>
          <span className="text-[10px] text-neutral-400 block uppercase">Penerima</span>
          <strong className="text-neutral-900 dark:text-white font-bold block truncate">{data.nama}</strong>
        </div>
        <div>
          <span className="text-[10px] text-neutral-400 block uppercase">NIM</span>
          <span className="text-neutral-800 dark:text-neutral-200 font-mono font-semibold block">{data.nim}</span>
        </div>
        <div>
          <span className="text-[10px] text-neutral-400 block uppercase">Delegasi</span>
          <span className="text-neutral-700 dark:text-neutral-300 block truncate">{data.delegasi}</span>
        </div>
        <div>
          <span className="text-[10px] text-neutral-400 block uppercase">Status Presensi</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hadir & Sah
          </span>
        </div>
      </div>

      {/* Certificate Preview Image (A4 Landscape 3508:2480) */}
      <div className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-inner group">
        {isRendering ? (
          <div className="w-full aspect-[3508/2480] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1C4BBC] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-neutral-500">Menerbitkan E-Sertifikat High-Res 300 DPI...</p>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`Sertifikat ${data.nama}`}
            className="w-full h-auto block select-none pointer-events-auto transition-transform duration-300"
          />
        ) : (
          <div className="w-full aspect-[3508/2480] flex flex-col items-center justify-center p-6 text-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <p className="text-xs text-neutral-600">Gagal merender gambar sertifikat.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!imageUrl || isRendering}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Download Sertifikat (PNG 300 DPI)</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          disabled={!imageUrl || isRendering}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Guidance Notes */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>E-Sertifikat ini sah dan diterbitkan secara digital oleh Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin.</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-200/50 dark:border-neutral-800">
          <Info className="w-3.5 h-3.5 text-[#1C4BBC] shrink-0" />
          <span>Pengguna Smartphone / iPhone: Jika tombol download tidak langsung membuka dialog simpan, Anda juga dapat menekan & tahan gambar sertifikat di atas lalu pilih <strong>&quot;Simpan ke Foto / Galeri&quot;</strong>.</span>
        </div>
      </div>
    </div>
  );
}
