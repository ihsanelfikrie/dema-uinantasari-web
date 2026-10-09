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
  Info,
  Maximize2,
  FileDown,
  Eye,
  Share2,
  Check,
  Smartphone
} from "lucide-react";
import jsPDF from "jspdf";

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
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<boolean>(false);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
  const [isInApp, setIsInApp] = useState<boolean>(false);
  const activeBlobUrlRef = useRef<string | null>(null);

  // Standar Cetak Resmi A4 Landscape (300 DPI) = 3508 x 2480 px
  const CANVAS_WIDTH = 3508;
  const CANVAS_HEIGHT = 2480;

  // Deteksi Webview / In-App Browser (WhatsApp, Instagram, FB)
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || "";
      const inApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Telegram|Snapchat|MicroMessenger/i.test(ua);
      setIsInApp(inApp);
    }
  }, []);

  // Cleanup Object URL on unmount
  useEffect(() => {
    return () => {
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
    };
  }, []);

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

      // 1. Mitigasi Font Race Condition: Pastikan font Poppins & Caveat siap sebelum dirender
      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.load("700 100px Caveat");
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
      const namaSize = conf.nama_font_size ?? 130;
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
        ctx.font = `700 ${effectiveNamaSize}px Caveat, cursive`;

        // Batasi lebar maksimum nama agar pas di dalam bracket box (lebar max 2400px)
        const MAX_NAME_WIDTH = 2400;
        while (ctx.measureText(data.nama).width > MAX_NAME_WIDTH && effectiveNamaSize > 38) {
          effectiveNamaSize -= 2;
          ctx.font = `700 ${effectiveNamaSize}px Caveat, cursive`;
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
          '\"Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa\"',
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

      // 4. Finalisasi Ekspor Gambar dengan Mitigasi Tainted Canvas dan Blob Generation
      const finalizeCanvasExport = () => {
        if (isCancelled) return;
        try {
          canvas.toBlob((blob) => {
            if (isCancelled) return;
            if (blob) {
              if (activeBlobUrlRef.current) {
                URL.revokeObjectURL(activeBlobUrlRef.current);
              }
              const objectUrl = URL.createObjectURL(blob);
              activeBlobUrlRef.current = objectUrl;
              setImageBlob(blob);
              setImageUrl(objectUrl);
              setIsRendering(false);
            } else {
              const dataUrl = canvas.toDataURL("image/png", 1.0);
              setImageUrl(dataUrl);
              setIsRendering(false);
            }
          }, "image/png");
        } catch (err) {
          console.warn("Tainted canvas terdeteksi saat ekspor template luar. Beralih ke vector fallback...", err);
          drawVectorFallback();
          try {
            canvas.toBlob((fallbackBlob) => {
              if (isCancelled) return;
              if (fallbackBlob) {
                if (activeBlobUrlRef.current) {
                  URL.revokeObjectURL(activeBlobUrlRef.current);
                }
                const objectUrl = URL.createObjectURL(fallbackBlob);
                activeBlobUrlRef.current = objectUrl;
                setImageBlob(fallbackBlob);
                setImageUrl(objectUrl);
                setIsRendering(false);
              } else {
                const fallbackDataUrl = canvas.toDataURL("image/png", 1.0);
                setImageUrl(fallbackDataUrl);
                setIsRendering(false);
              }
            }, "image/png");
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

  // 1. Download Utama: Simpan ke Galeri (Web Share di Mobile) / Download File (Desktop)
  const handleDownload = async () => {
    if (!imageUrl && !imageBlob && !canvasRef.current) return;
    setIsDownloading(true);

    try {
      const safeName = (data.nama || "Peserta").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 35);
      const safeNim = (data.nim || "AML").replace(/[^a-zA-Z0-9]/g, "");
      const fileName = `Sertifikat-AML2026-${safeName}-${safeNim}.png`;

      // Dapatkan Blob
      let blob = imageBlob;
      if (!blob && canvasRef.current) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvasRef.current?.toBlob((b) => resolve(b), "image/png");
        });
      }
      if (!blob && imageUrl.startsWith("data:")) {
        const res = await fetch(imageUrl);
        blob = await res.blob();
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // A. Coba Web Share API di perangkat seluler (iPhone / Android)
      // Ini otomatis memicu action sheet sistem: pilihan pertama di iPhone adalah "Simpan Gambar" langsung ke Galeri Foto
      if (isMobile && blob && typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const file = new File([blob], fileName, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `E-Sertifikat AML 2026 - ${data.nama}`,
              text: `E-Sertifikat Resmi Peserta Antasari Media Lab 2026 - ${data.nama}`,
            });
            setDownloadSuccess("Sertifikat siap disimpan di perangkat Anda!");
            setTimeout(() => setDownloadSuccess(null), 4000);
            setIsDownloading(false);
            return;
          }
        } catch (shareErr: any) {
          if (shareErr?.name === "AbortError") {
            // Pengguna menutup / membatalkan dialog share
            setIsDownloading(false);
            return;
          }
          console.warn("Navigator share gagal, lanjut unduh file biasa:", shareErr);
        }
      }

      // B. Fallback: Unduh via Object URL <a> tag
      if (blob) {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }, 4000);
      } else if (imageUrl) {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 1000);
      }

      setDownloadSuccess("File sertifikat berhasil diunduh!");
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error("Gagal mendownload sertifikat:", err);
      // Fallback darurat: buka gambar di tab baru
      handleOpenNewTab();
    } finally {
      setIsDownloading(false);
    }
  };

  // 2. Download File PDF Resmi (A4 Landscape) via jsPDF
  const handleDownloadPdf = async () => {
    if (!canvasRef.current && !imageUrl) return;
    setIsDownloadingPdf(true);

    try {
      const safeName = (data.nama || "Peserta").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 35);
      const safeNim = (data.nim || "AML").replace(/[^a-zA-Z0-9]/g, "");
      const fileName = `Sertifikat-AML2026-${safeName}-${safeNim}.pdf`;

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4", // 297mm x 210mm
      });

      if (canvasRef.current) {
        doc.addImage(canvasRef.current, "PNG", 0, 0, 297, 210, undefined, "FAST");
      } else {
        doc.addImage(imageUrl, "PNG", 0, 0, 297, 210, undefined, "FAST");
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const pdfBlob = doc.output("blob");

      // Coba bagikan / simpan via Web Share jika di HP
      if (isMobile && typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
          if (navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
              files: [pdfFile],
              title: `E-Sertifikat PDF - ${data.nama}`,
              text: `Dokumen Resmi E-Sertifikat Antasari Media Lab 2026`,
            });
            setDownloadSuccess("File PDF siap disimpan!");
            setTimeout(() => setDownloadSuccess(null), 4000);
            setIsDownloadingPdf(false);
            return;
          }
        } catch (shareErr: any) {
          if (shareErr?.name === "AbortError") {
            setIsDownloadingPdf(false);
            return;
          }
          console.warn("Share PDF gagal, lanjut download dokumen:", shareErr);
        }
      }

      doc.save(fileName);
      setDownloadSuccess("File PDF berhasil disimpan!");
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error("Gagal generate PDF:", err);
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // 3. Unduh PNG Langsung (Khusus Pengguna yang Ingin File Langsung ke Folder Unduhan)
  const handleDirectPngDownload = async () => {
    try {
      const safeName = (data.nama || "Peserta").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 35);
      const safeNim = (data.nim || "AML").replace(/[^a-zA-Z0-9]/g, "");
      const fileName = `Sertifikat-AML2026-${safeName}-${safeNim}.png`;

      let blob = imageBlob;
      if (!blob && canvasRef.current) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvasRef.current?.toBlob((b) => resolve(b), "image/png");
        });
      }

      if (blob) {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        }, 4000);
      } else if (imageUrl) {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
        }, 1000);
      }
      setDownloadSuccess("Mengunduh file PNG...");
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch {
      handleOpenNewTab();
    }
  };

  // 4. Buka Gambar di Tab Baru untuk Tekan & Tahan
  const handleOpenNewTab = () => {
    if (!imageUrl) return;
    const w = window.open();
    if (w) {
      w.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>E-Sertifikat - ${data.nama}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; background: #0c0d12; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px 16px; text-align: center; }
              img { max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.6); -webkit-touch-callout: default !important; -webkit-user-select: auto !important; user-select: auto !important; }
              .banner { background: rgba(28, 75, 188, 0.25); border: 1px solid rgba(28, 75, 188, 0.5); padding: 12px 18px; border-radius: 10px; margin-top: 20px; font-size: 13px; line-height: 1.5; max-width: 500px; }
              .banner strong { color: #60a5fa; }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="E-Sertifikat ${data.nama}" />
            <div class="banner">
              📱 <strong>Pengguna HP / iPhone:</strong><br/>
              Tekan dan tahan gambar di atas selama 1-2 detik, lalu pilih <strong>"Simpan ke Foto"</strong> / <strong>"Save Image"</strong>.
            </div>
          </body>
        </html>
      `);
      w.document.close();
    } else {
      window.location.href = imageUrl;
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

      {/* In-App Browser (WhatsApp / Instagram) Friendly Notice */}
      {isInApp && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          <Smartphone className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <strong className="block font-semibold">Membuka di Browser Aplikasi (WhatsApp / Medsos)</strong>
            <p className="text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
              Browser WhatsApp sering kali membatasi unduhan otomatis. Gunakan tombol hijau <strong>&quot;Download / Simpan ke Galeri&quot;</strong> di bawah (otomatis memicu dialog simpan foto), atau ketuk titik tiga (<strong>⋮</strong>) di pojok kanan atas layar lalu pilih <strong>&quot;Buka di Browser / Safari / Chrome&quot;</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Download Success Feedback Toast */}
      {downloadSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{downloadSuccess}</span>
        </div>
      )}

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
      <div 
        onClick={() => {
          if (imageUrl) setShowFullscreen(true);
        }}
        className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-inner group cursor-zoom-in"
        title="Ketuk atau klik untuk melihat pratinjau penuh"
      >
        {isRendering ? (
          <div className="w-full aspect-[3508/2480] flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1C4BBC] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-neutral-500">Menerbitkan E-Sertifikat High-Res 300 DPI...</p>
          </div>
        ) : imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={`Sertifikat ${data.nama}`}
              className="w-full h-auto block pointer-events-auto transition-transform duration-300 group-hover:scale-[1.008]"
              style={{
                WebkitTouchCallout: "default",
                WebkitUserSelect: "auto",
                userSelect: "auto",
                touchAction: "manipulation",
              }}
            />
            {/* Visual Hint Badge */}
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Maximize2 className="w-3 h-3 text-emerald-400" />
              <span>Ketuk untuk Perbesar / Tekan & Tahan untuk Simpan</span>
            </div>
          </>
        ) : (
          <div className="w-full aspect-[3508/2480] flex flex-col items-center justify-center p-6 text-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <p className="text-xs text-neutral-600">Gagal merender gambar sertifikat.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!imageUrl || isRendering || isDownloading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyiapkan Sertifikat...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download / Simpan ke Galeri (PNG 300 DPI)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!imageUrl || isRendering || isDownloadingPdf}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Membuat Dokumen PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Unduh File PDF (A4)</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Auxiliary Actions: Direct download, Fullscreen, Print, New Tab */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
          <button
            type="button"
            onClick={() => setShowFullscreen(true)}
            disabled={!imageUrl || isRendering}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Buka Layar Penuh</span>
          </button>

          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={handleDirectPngDownload}
            disabled={!imageUrl || isRendering}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh PNG Langsung</span>
          </button>

          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!imageUrl || isRendering}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Printer</span>
          </button>

          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>

          <button
            type="button"
            onClick={handleOpenNewTab}
            disabled={!imageUrl || isRendering}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka di Tab Baru</span>
          </button>
        </div>
      </div>

      {/* Guidance Notes */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>E-Sertifikat ini sah dan diterbitkan secara digital oleh Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin.</span>
        </div>

        {/* Foolproof Mobile Guide */}
        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200">
            <Info className="w-4 h-4 text-[#1C4BBC] shrink-0" />
            <span>Panduan Mudah Menyimpan Sertifikat di HP / Smartphone:</span>
          </div>
          <ol className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 pl-4 list-decimal leading-relaxed">
            <li>
              <strong>Pilihan 1 (Otomatis ke Galeri):</strong> Ketuk tombol hijau <strong>&quot;Download / Simpan ke Galeri&quot;</strong>. Di iPhone atau Android akan muncul menu berbagi sistem &rarr; ketuk opsi <strong>&quot;Simpan Gambar&quot; (Save Image)</strong>.
            </li>
            <li>
              <strong>Pilihan 2 (Format Dokumen PDF):</strong> Ketuk tombol <strong>&quot;Unduh File PDF (A4)&quot;</strong> untuk menyimpan dokumen PDF resmi siap cetak.
            </li>
            <li>
              <strong>Pilihan 3 (Tekan &amp; Tahan):</strong> Ketuk gambar sertifikat di atas untuk memperbesar, lalu <strong>tekan &amp; tahan gambar selama 1-2 detik</strong> hingga muncul menu pop-up &rarr; pilih <strong>&quot;Simpan Gambar&quot;</strong>.
            </li>
          </ol>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal untuk Pratinjau & Simpan Gambar */}
      {showFullscreen && imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-3 border-b border-white/10 text-white">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm">Pratinjau E-Sertifikat Penuh (300 DPI)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowFullscreen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Tutup pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full max-w-4xl mx-auto my-auto py-4 flex flex-col items-center gap-3">
            <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
              <img
                src={imageUrl}
                alt={`Sertifikat ${data.nama}`}
                className="w-full h-auto block select-text pointer-events-auto"
                style={{
                  WebkitTouchCallout: "default",
                  WebkitUserSelect: "auto",
                  userSelect: "auto",
                  touchAction: "manipulation",
                }}
              />
            </div>
            <div className="p-3 rounded-xl bg-white/10 text-white text-center text-xs w-full max-w-md border border-white/10">
              📱 <strong>Pengguna HP / iPhone:</strong> Tekan &amp; tahan gambar di atas selama 1-2 detik, lalu pilih <strong>&quot;Simpan Gambar&quot;</strong> untuk menyimpan langsung ke Galeri Foto.
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Simpan ke Galeri / Download</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              {isDownloadingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              <span>Unduh PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFullscreen(false)}
              className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
