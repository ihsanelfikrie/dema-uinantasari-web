"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { 
  Download, 
  Printer, 
  CheckCircle, 
  RotateCcw, 
  AlertTriangle, 
  Award, 
  QrCode,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  HelpCircle,
  ExternalLink
} from "lucide-react";

export interface TicketData {
  nama: string;
  nim: string;
  email: string;
  delegasi: string;
  ticketId: string;
  registeredAt: string;
}

interface TicketCardProps {
  data: TicketData;
  onReset?: () => void;
}

export default function TicketCard({ data, onReset }: TicketCardProps) {
  const [ticketImageUrl, setTicketImageUrl] = useState<string>("");
  const [standaloneQrUrl, setStandaloneQrUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [generationError, setGenerationError] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isVectorFallback, setIsVectorFallback] = useState<boolean>(false);

  // Helper to load image as a Promise with a safety timeout
  const loadImage = (src: string, timeoutMs = 6000): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout memuat aset: ${src}`));
      }, timeoutMs);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        clearTimeout(timer);
        resolve(img);
      };
      img.onerror = (err) => {
        clearTimeout(timer);
        reject(err);
      };
      img.src = src;
    });
  };

  // Helper to truncate text for canvas width
  const truncateText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string => {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let truncated = text;
    while (truncated.length > 0 && ctx.measureText(truncated + "...").width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + "...";
  };

  // 1. Tier 1: Generate standalone high-res QR code immediately (0 network dependency, pure JS math)
  useEffect(() => {
    if (!data.nim) return;
    const cleanNim = data.nim.trim();
    QRCode.toDataURL(cleanNim, {
      width: 450,
      margin: 1,
      color: {
        dark: "#1C4BBC",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setStandaloneQrUrl(url))
      .catch((err) => console.error("Gagal generate QR Code standalone:", err));
  }, [data.nim]);

  // 2. Tier 2: Canvas Builder with Auto-Vector Fallback
  useEffect(() => {
    let isCancelled = false;

    async function buildTicket() {
      setIsGenerating(true);
      setGenerationError(false);
      setErrorDetails("");
      setIsVectorFallback(false);

      const width = 1200;
      const height = 650;
      const cleanNim = data.nim.trim();

      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Browser tidak mendukung HTML5 Canvas Context 2D.");
        }

        // Generate transparent QR for canvas embedding
        const qrDataUrl = await QRCode.toDataURL(cleanNim, {
          width: 320,
          margin: 0,
          color: {
            dark: "#FFFFFF",
            light: "#00000000",
          },
          errorCorrectionLevel: "M",
        });

        const qrImg = await loadImage(qrDataUrl, 3000);

        // Try primary engine: load graphical template & icons
        let usedPrimaryTemplate = false;
        const cacheBust = retryCount > 0 ? `?t=${Date.now()}` : "";

        try {
          const [templateImg, iconUser, iconMail, iconDelegasi, iconNim] = await Promise.all([
            loadImage(`/images/event/tiket-template.jpg${cacheBust}`),
            loadImage(`/images/event/icon-user.png${cacheBust || "?v=2"}`),
            loadImage(`/images/event/icon-mail.png${cacheBust || "?v=2"}`),
            loadImage(`/images/event/icon-delegasi.png${cacheBust || "?v=2"}`),
            loadImage(`/images/event/icon-nim.png${cacheBust || "?v=2"}`),
          ]);

          if (isCancelled) return;

          // Draw Primary Template Background (1200 x 650)
          ctx.drawImage(templateImg, 0, 0, width, height);

          // Draw 4 Green Circle Icons
          const iconSize = 56;
          const col1IconX = 72;
          const col2IconX = 394;
          const row1IconY = 245;
          const row2IconY = 350;

          ctx.drawImage(iconUser, col1IconX, row1IconY, iconSize, iconSize);
          ctx.drawImage(iconMail, col2IconX, row1IconY, iconSize, iconSize);
          ctx.drawImage(iconDelegasi, col1IconX, row2IconY, iconSize, iconSize);
          ctx.drawImage(iconNim, col2IconX, row2IconY, iconSize, iconSize);

          // Draw Participant Information Text
          const textCol1X = 142;
          const textCol2X = 464;
          ctx.textBaseline = "alphabetic";

          // Row 1
          ctx.font = "bold 18px 'Poppins', sans-serif";
          ctx.fillStyle = "#111827";
          ctx.fillText("Nama Lengkap", textCol1X, 266);
          ctx.fillText("Email Terdaftar", textCol2X, 266);

          ctx.font = "500 15px 'Poppins', sans-serif";
          ctx.fillStyle = "#374151";
          ctx.fillText(truncateText(ctx, data.nama, 230), textCol1X, 292);

          ctx.font = "500 14px 'Poppins', sans-serif";
          ctx.fillText(truncateText(ctx, data.email, 240), textCol2X, 292);

          // Row 2
          ctx.font = "bold 18px 'Poppins', sans-serif";
          ctx.fillStyle = "#111827";
          ctx.fillText("Asal Delegasi", textCol1X, 371);
          ctx.fillText("NIM", textCol2X, 371);

          ctx.font = "500 15px 'Poppins', sans-serif";
          ctx.fillStyle = "#374151";
          ctx.fillText(truncateText(ctx, data.delegasi, 230), textCol1X, 398);

          ctx.font = "bold 16px 'Poppins', monospace";
          ctx.fillStyle = "#111827";
          ctx.fillText(cleanNim, textCol2X, 398);

          // Row 3: Metadata
          ctx.font = "500 13px 'Poppins', sans-serif";
          ctx.fillStyle = "#4b5563";
          ctx.fillText(`Registrasi: ${data.registeredAt}`, col1IconX, 462);

          ctx.font = "bold 14px 'Poppins', sans-serif";
          ctx.fillStyle = "#1f2937";
          ctx.fillText(data.ticketId, col2IconX, 462);

          // Draw Gradient Lime Green QR Code
          const qrSize = 295;
          const qrX = 976 - qrSize / 2;
          const qrY = 160;

          const gradCanvas = document.createElement("canvas");
          gradCanvas.width = qrSize;
          gradCanvas.height = qrSize;
          const gradCtx = gradCanvas.getContext("2d");
          if (gradCtx) {
            gradCtx.drawImage(qrImg, 0, 0, qrSize, qrSize);
            gradCtx.globalCompositeOperation = "source-in";

            const gradient = gradCtx.createLinearGradient(0, 0, 0, qrSize);
            gradient.addColorStop(0, "#E8FCD0");
            gradient.addColorStop(0.35, "#BCEE76");
            gradient.addColorStop(0.7, "#98DE45");
            gradient.addColorStop(1, "#82BE3B");
            gradCtx.fillStyle = gradient;
            gradCtx.fillRect(0, 0, qrSize, qrSize);

            ctx.drawImage(gradCanvas, qrX, qrY, qrSize, qrSize);
          }

          // Draw NIM text in green pill
          ctx.font = "bold 25px 'Poppins', sans-serif";
          ctx.fillStyle = "#FFFFFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cleanNim, 976, 525);

          // Reset alignment
          ctx.textAlign = "left";
          ctx.textBaseline = "alphabetic";

          usedPrimaryTemplate = true;
        } catch (templateErr) {
          console.warn("Template gambar gagal dimuat, beralih ke Vector Canvas Engine...", templateErr);

          // AUTO-VECTOR FALLBACK ENGINE (Zero image assets needed)
          if (isCancelled) return;
          setIsVectorFallback(true);

          // 1. Background gradient
          const bgGrad = ctx.createLinearGradient(0, 0, width, height);
          bgGrad.addColorStop(0, "#08132B");
          bgGrad.addColorStop(0.55, "#1C4BBC");
          bgGrad.addColorStop(1, "#0D2561");
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);

          // 2. Decorative circles
          ctx.fillStyle = "rgba(130, 190, 59, 0.15)";
          ctx.beginPath();
          ctx.arc(width - 150, 100, 260, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
          ctx.beginPath();
          ctx.arc(100, height, 320, 0, Math.PI * 2);
          ctx.fill();

          // 3. Header branding
          ctx.fillStyle = "#82BE3B";
          ctx.font = "bold 16px 'Poppins', sans-serif";
          ctx.fillText("DEMA UIN ANTASARI BANJARMASIN • KABINET LASKAR PURNAMA", 60, 65);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 38px 'Poppins', sans-serif";
          ctx.fillText("ANTASARI MEDIA LAB 2026", 60, 115);

          ctx.fillStyle = "#CAD3E6";
          ctx.font = "500 16px 'Poppins', sans-serif";
          ctx.fillText("OFFICIAL PARTICIPANT PASS & TICKET", 60, 145);

          // 4. Left White Info Box
          const cardX = 60;
          const cardY = 175;
          const cardW = 680;
          const cardH = 410;

          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(cardX, cardY, cardW, cardH, 20);
          } else {
            ctx.rect(cardX, cardY, cardW, cardH);
          }
          ctx.fill();

          // Participant details
          ctx.fillStyle = "#6B7280";
          ctx.font = "bold 13px 'Poppins', sans-serif";
          ctx.fillText("NAMA LENGKAP PESERTA", cardX + 35, cardY + 50);
          ctx.fillStyle = "#111827";
          ctx.font = "bold 20px 'Poppins', sans-serif";
          ctx.fillText(truncateText(ctx, data.nama, cardW - 70), cardX + 35, cardY + 80);

          ctx.fillStyle = "#6B7280";
          ctx.font = "bold 13px 'Poppins', sans-serif";
          ctx.fillText("NOMOR INDUK MAHASISWA (NIM)", cardX + 35, cardY + 140);
          ctx.fillStyle = "#1C4BBC";
          ctx.font = "bold 22px 'Poppins', monospace";
          ctx.fillText(cleanNim, cardX + 35, cardY + 170);

          ctx.fillStyle = "#6B7280";
          ctx.font = "bold 13px 'Poppins', sans-serif";
          ctx.fillText("ASAL DELEGASI", cardX + 35, cardY + 230);
          ctx.fillStyle = "#111827";
          ctx.font = "500 17px 'Poppins', sans-serif";
          ctx.fillText(truncateText(ctx, data.delegasi, 280), cardX + 35, cardY + 260);

          ctx.fillStyle = "#6B7280";
          ctx.font = "bold 13px 'Poppins', sans-serif";
          ctx.fillText("EMAIL TERDAFTAR", cardX + 360, cardY + 230);
          ctx.fillStyle = "#374151";
          ctx.font = "500 15px 'Poppins', sans-serif";
          ctx.fillText(truncateText(ctx, data.email, 280), cardX + 360, cardY + 260);

          // Divider
          ctx.strokeStyle = "#E5E7EB";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cardX + 35, cardY + 310);
          ctx.lineTo(cardX + cardW - 35, cardY + 310);
          ctx.stroke();

          // Footer
          ctx.fillStyle = "#6B7280";
          ctx.font = "500 13px 'Poppins', sans-serif";
          ctx.fillText(`Registrasi: ${data.registeredAt}`, cardX + 35, cardY + 355);

          ctx.fillStyle = "#1C4BBC";
          ctx.font = "bold 15px 'Poppins', sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(data.ticketId, cardX + cardW - 35, cardY + 355);
          ctx.textAlign = "left";

          // 5. Right QR Card
          const qrCardX = 770;
          const qrCardY = 175;
          const qrCardW = 370;
          const qrCardH = 410;

          ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(qrCardX, qrCardY, qrCardW, qrCardH, 20);
          } else {
            ctx.rect(qrCardX, qrCardY, qrCardW, qrCardH);
          }
          ctx.fill();

          // White QR background box
          const qrBoxSize = 250;
          const qrBoxX = qrCardX + (qrCardW - qrBoxSize) / 2;
          const qrBoxY = qrCardY + 25;

          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(qrBoxX - 10, qrBoxY - 10, qrBoxSize + 20, qrBoxSize + 20, 16);
          } else {
            ctx.rect(qrBoxX - 10, qrBoxY - 10, qrBoxSize + 20, qrBoxSize + 20);
          }
          ctx.fill();

          // Draw QR Code
          const qrBlackDataUrl = await QRCode.toDataURL(cleanNim, {
            width: 250,
            margin: 0,
            color: { dark: "#1C4BBC", light: "#FFFFFF" },
          });
          const qrBlackImg = await loadImage(qrBlackDataUrl, 3000);
          ctx.drawImage(qrBlackImg, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

          // NIM pill under QR code
          ctx.fillStyle = "#82BE3B";
          ctx.beginPath();
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(qrCardX + 30, qrCardY + 310, qrCardW - 60, 48, 12);
          } else {
            ctx.rect(qrCardX + 30, qrCardY + 310, qrCardW - 60, 48);
          }
          ctx.fill();

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 20px 'Poppins', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(cleanNim, qrCardX + qrCardW / 2, qrCardY + 341);

          ctx.fillStyle = "#CAD3E6";
          ctx.font = "500 12px 'Poppins', sans-serif";
          ctx.fillText("PINDAI SAAT CHECK-IN DI LOKASI", qrCardX + qrCardW / 2, qrCardY + 382);
          ctx.textAlign = "left";
        }

        // Export data URL from Canvas
        const fullTicketUrl = canvas.toDataURL("image/png");
        if (!isCancelled) {
          setTicketImageUrl(fullTicketUrl);
          setGenerationError(false);
        }
      } catch (err: any) {
        console.error("Gagal total membuat gambar tiket di canvas:", err);
        if (!isCancelled) {
          setGenerationError(true);
          setErrorDetails(err?.message || "Koneksi jaringan atau memori perangkat terbatas.");
        }
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    }

    if (data.nim) {
      buildTicket();
    }

    return () => {
      isCancelled = true;
    };
  }, [data, retryCount]);

  // Download Trigger: Full Ticket
  const handleDownloadTicket = () => {
    if (!ticketImageUrl) return;
    const a = document.createElement("a");
    a.href = ticketImageUrl;
    a.download = `tiket-antasari-media-lab-${data.nim.trim()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download Trigger: Standalone QR Code
  const handleDownloadQrOnly = () => {
    if (!standaloneQrUrl) return;
    const a = document.createElement("a");
    a.href = standaloneQrUrl;
    a.download = `qr-checkin-${data.nim.trim()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Retry canvas generation
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Pre-filled WhatsApp Narahubung Hotline (Wafi)
  const narhubPhone = "6282162138655";
  const narhubDisplay = "+62 821 6213 8655 (Wafi)";
  const whatsappUrl = `https://wa.me/${narhubPhone}?text=${encodeURIComponent(
    `Halo Kak Wafi (Narahubung Antasari Media Lab DEMA UIN Antasari),\n\nSaya ingin berkonsultasi mengenai tiket / pendaftaran saya:\n- Nama: ${data.nama}\n- NIM: ${data.nim}\n- Delegasi: ${data.delegasi}\n- ID Tiket: ${data.ticketId}\n\nKendala/pertanyaan saya:\n...`
  )}`;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Notifikasi Sukses Minimalis */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#160808] px-4 py-3 flex items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-neutral-800 dark:text-neutral-200">
            <strong>Pendaftaran Berhasil!</strong> Tiket resmi Anda telah diterbitkan.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#1C4BBC] dark:text-[#82BE3B] shrink-0 bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded">
          {data.ticketId}
        </span>
      </div>

      {/* TIER 3: EMERGENCY LIVE HTML DIGITAL PASS (Rendered if Canvas totally fails) */}
      {generationError && !ticketImageUrl ? (
        <div className="rounded-2xl border-2 border-[#1C4BBC]/40 bg-white p-5 sm:p-7 shadow-lg space-y-6">
          {/* Fallback Notice Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-amber-950">
                Mode Tiket Digital Darurat (Fallback Pass Aktif)
              </h5>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Pratinjau gambar grafis tiket terkendala koneksi internet pada browser Anda ({errorDetails || "jaringan lambat"}), <strong>namun kepesertaan Anda 100% Sah dan Terdata di Database Resmi</strong>. Anda dapat menggunakan Kartu Digital di bawah ini atau mengunduh QR Code langsung.
              </p>
            </div>
          </div>

          {/* HTML Official Pass Card */}
          <div className="bg-gradient-to-br from-[#0B1A3A] via-[#1C4BBC] to-[#0D2561] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#82BE3B]/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Side: Information */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82BE3B]/20 border border-[#82BE3B]/40 text-[#82BE3B] text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TIKET RESMI DIGITAL • SAH TERVERIFIKASI</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-wide font-poppins">
                    ANTASARI MEDIA LAB 2026
                  </h3>
                  <p className="text-xs text-[#CAD3E6] mt-0.5">
                    DEMA UIN Antasari Banjarmasin • Kabinet Laskar Purnama
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 text-left">
                  <div>
                    <span className="text-[11px] text-neutral-300 block uppercase font-medium">Nama Peserta</span>
                    <strong className="text-sm text-white font-bold block truncate">{data.nama}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-300 block uppercase font-medium">NIM Peserta</span>
                    <strong className="text-base text-[#82BE3B] font-mono font-bold block">{data.nim}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-300 block uppercase font-medium">Asal Delegasi</span>
                    <span className="text-xs text-white block truncate">{data.delegasi}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-300 block uppercase font-medium">ID Tiket</span>
                    <span className="text-xs text-neutral-200 font-mono block">{data.ticketId}</span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-300">
                  Waktu Registrasi: <span className="text-white font-medium">{data.registeredAt}</span>
                </div>
              </div>

              {/* Right Side: High-Res QR Standalone Container */}
              <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0 border-4 border-[#82BE3B]">
                {standaloneQrUrl ? (
                  <img
                    src={standaloneQrUrl}
                    alt={`QR Code ${data.nim}`}
                    className="w-44 h-44 sm:w-48 sm:h-48 block"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-xs text-neutral-400">
                    Menghasilkan QR...
                  </div>
                )}
                <div className="mt-2 text-center">
                  <span className="text-xs font-mono font-extrabold text-[#1C4BBC] tracking-wider block">
                    NIM: {data.nim}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    Pindai untuk Check-In
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for Fallback Pass */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {standaloneQrUrl && (
              <button
                type="button"
                onClick={handleDownloadQrOnly}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#82BE3B] hover:bg-[#72a833] shadow-md shadow-[#82BE3B]/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Code (PNG)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRetry}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-[#1C4BBC] bg-[#1C4BBC]/10 hover:bg-[#1C4BBC]/15 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              <span>Coba Muat Ulang Gambar</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Halaman Ini</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-emerald-700 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Bantuan Narhub Wafi (WA)</span>
            </a>
          </div>
        </div>
      ) : (
        /* OFFICIAL RENDERED TICKET IMAGE CONTAINER */
        <div className="space-y-3">
          {isVectorFallback && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Tiket dibuat melalui Vector Engine resmi (desain alternatif adaptif hemat kuota).</span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="text-xs font-semibold text-[#1C4BBC] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Coba Desain Grafis</span>
              </button>
            </div>
          )}

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200/90 bg-white">
            {isGenerating ? (
              <div className="w-full aspect-[1200/650] bg-neutral-100 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-[#1C4BBC] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-neutral-500">Menerbitkan Tiket Resmi...</p>
              </div>
            ) : ticketImageUrl ? (
              <img
                src={ticketImageUrl}
                alt={`Tiket Peserta ${data.nama}`}
                className="w-full h-auto block select-none"
              />
            ) : (
              <div className="w-full aspect-[1200/650] bg-neutral-100 flex flex-col items-center justify-center p-6 text-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                <p className="text-xs text-neutral-600">Gagal memuat pratinjau gambar tiket.</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-lg bg-[#1C4BBC] text-white text-xs font-semibold"
                >
                  Coba Muat Ulang
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownloadTicket}
              disabled={!ticketImageUrl || isGenerating}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#82BE3B] hover:bg-[#72a833] shadow-md shadow-[#82BE3B]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Tiket (PNG)</span>
            </button>

            {standaloneQrUrl && (
              <button
                type="button"
                onClick={handleDownloadQrOnly}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer"
                title="Download hanya file QR Code"
              >
                <QrCode className="w-4 h-4 text-[#1C4BBC]" />
                <span>Simpan QR Saja</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Tiket</span>
            </button>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-[#1C4BBC] bg-[#1C4BBC]/10 hover:bg-[#1C4BBC]/15 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Daftar Peserta Lain</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Catatan Registrasi & Narahubung (Minimalist & Clean) */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#160808] p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-neutral-900 dark:text-white font-semibold">Simpan tiket ini baik-baik.</strong> Tiket wajib ditunjukkan saat registrasi ulang di lokasi dan digunakan untuk verifikasi e-sertifikat kegiatan.
          </p>
        </div>

        <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-neutral-500 dark:text-neutral-400">
            Ada kendala tiket atau salah data?{" "}
            <span className="text-neutral-700 dark:text-neutral-300">
              Narahubung: <strong className="text-neutral-900 dark:text-white font-mono">+62 821 6213 8655 (Wafi)</strong>
            </span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 transition-colors shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
