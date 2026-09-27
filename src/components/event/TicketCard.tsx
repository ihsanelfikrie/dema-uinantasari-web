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
  ShieldAlert
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
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper to load image as a Promise
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
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

  // Generate full ticket image using canvas & template
  useEffect(() => {
    let isCancelled = false;

    async function buildTicket() {
      setIsGenerating(true);
      try {
        const width = 1200;
        const height = 650;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Generate clean transparent QR code from NIM
        const cleanNim = data.nim.trim();
        const qrDataUrl = await QRCode.toDataURL(cleanNim, {
          width: 320,
          margin: 0,
          color: {
            dark: "#FFFFFF",
            light: "#00000000", // 100% transparent background
          },
          errorCorrectionLevel: "M",
        });

        // 2. Load all required images in parallel
        const [templateImg, iconUser, iconMail, iconDelegasi, iconNim, qrImg] = await Promise.all([
          loadImage("/images/event/tiket-template.jpg"),
          loadImage("/images/event/icon-user.png?v=2"),
          loadImage("/images/event/icon-mail.png?v=2"),
          loadImage("/images/event/icon-delegasi.png?v=2"),
          loadImage("/images/event/icon-nim.png?v=2"),
          loadImage(qrDataUrl),
        ]);

        if (isCancelled) return;

        // 3. Draw Template Background (1200 x 650)
        ctx.drawImage(templateImg, 0, 0, width, height);

        // 4. Draw 4 Green Circle Icons (Size: 56 x 56)
        const iconSize = 56;
        const col1IconX = 72;
        const col2IconX = 394;
        const row1IconY = 245;
        const row2IconY = 350;

        ctx.drawImage(iconUser, col1IconX, row1IconY, iconSize, iconSize);
        ctx.drawImage(iconMail, col2IconX, row1IconY, iconSize, iconSize);
        ctx.drawImage(iconDelegasi, col1IconX, row2IconY, iconSize, iconSize);
        ctx.drawImage(iconNim, col2IconX, row2IconY, iconSize, iconSize);

        // 5. Draw Participant Information Text
        const textCol1X = 142;
        const textCol2X = 464;

        ctx.textBaseline = "alphabetic";

        // Row 1: Nama Lengkap & Email Terdaftar
        // Labels
        ctx.font = "bold 18px 'Poppins', sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText("Nama Lengkap", textCol1X, 266);
        ctx.fillText("Email Terdaftar", textCol2X, 266);

        // Values
        ctx.font = "500 15px 'Poppins', sans-serif";
        ctx.fillStyle = "#374151";
        const cleanNama = truncateText(ctx, data.nama, 230);
        ctx.fillText(cleanNama, textCol1X, 292);

        ctx.font = "500 14px 'Poppins', sans-serif";
        const cleanEmail = truncateText(ctx, data.email, 240);
        ctx.fillText(cleanEmail, textCol2X, 292);

        // Row 2: Asal Delegasi & NIM
        // Labels
        ctx.font = "bold 18px 'Poppins', sans-serif";
        ctx.fillStyle = "#111827";
        ctx.fillText("Asal Delegasi", textCol1X, 371);
        ctx.fillText("NIM", textCol2X, 371);

        // Values
        ctx.font = "500 15px 'Poppins', sans-serif";
        ctx.fillStyle = "#374151";
        const cleanDelegasi = truncateText(ctx, data.delegasi, 230);
        ctx.fillText(cleanDelegasi, textCol1X, 398);

        ctx.font = "bold 16px 'Poppins', monospace";
        ctx.fillStyle = "#111827";
        ctx.fillText(cleanNim, textCol2X, 398);

        // Row 3: Metadata (Registrasi & ID Tiket)
        ctx.font = "500 13px 'Poppins', sans-serif";
        ctx.fillStyle = "#4b5563";
        ctx.fillText(`Registrasi: ${data.registeredAt}`, col1IconX, 462);

        ctx.font = "bold 14px 'Poppins', sans-serif";
        ctx.fillStyle = "#1f2937";
        ctx.fillText(data.ticketId, col2IconX, 462);

        // 6. Draw Gradient Lime Green QR Code directly on Blue Card (Centered at x = 976, no white background)
        const qrSize = 295;
        const qrX = 976 - qrSize / 2; // 828.5
        const qrY = 160;

        const gradCanvas = document.createElement("canvas");
        gradCanvas.width = qrSize;
        gradCanvas.height = qrSize;
        const gradCtx = gradCanvas.getContext("2d");
        if (gradCtx) {
          // Draw white QR modules on transparent background
          gradCtx.drawImage(qrImg, 0, 0, qrSize, qrSize);

          // Colorize only the QR modules
          gradCtx.globalCompositeOperation = "source-in";

          // Vertical gradient from light mint green at top to rich lime green at bottom
          const gradient = gradCtx.createLinearGradient(0, 0, 0, qrSize);
          gradient.addColorStop(0, "#E8FCD0");
          gradient.addColorStop(0.35, "#BCEE76");
          gradient.addColorStop(0.7, "#98DE45");
          gradient.addColorStop(1, "#82BE3B");
          gradCtx.fillStyle = gradient;
          gradCtx.fillRect(0, 0, qrSize, qrSize);

          // Draw directly on the blue card of the template
          ctx.drawImage(gradCanvas, qrX, qrY, qrSize, qrSize);
        }

        // 7. Draw NIM text in green pill (Centered at x = 976, y = 525)
        ctx.font = "bold 25px 'Poppins', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cleanNim, 976, 525);

        // Reset alignment
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";

        // Save generated data URL
        const fullTicketUrl = canvas.toDataURL("image/png");
        if (!isCancelled) {
          setTicketImageUrl(fullTicketUrl);
        }
      } catch (err) {
        console.error("Gagal membuat gambar tiket:", err);
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
  }, [data]);

  // Download Trigger
  const handleDownload = () => {
    if (!ticketImageUrl) return;
    const a = document.createElement("a");
    a.href = ticketImageUrl;
    a.download = `tiket-antasari-media-lab-${data.nim.trim()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Success Notification Alert */}
      <div className="bg-[#82BE3B]/15 border border-[#82BE3B]/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#82BE3B] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-neutral-900">
            Pendaftaran Berhasil! Segera Simpan Tiket Resmi Anda
          </h4>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
            Tiket resmi Antasari Media Lab Anda telah diterbitkan. <strong>Harap langsung download atau tangkap layar (screenshot)</strong> tiket di bawah ini untuk disimpan aman di galeri ponsel Anda.
          </p>
        </div>
      </div>

      {/* Official Rendered Ticket Image Container */}
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
          <div className="w-full aspect-[1200/650] bg-neutral-100 flex items-center justify-center text-xs text-neutral-500">
            Gagal memuat pratinjau tiket.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!ticketImageUrl || isGenerating}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#82BE3B] hover:bg-[#72a833] shadow-md shadow-[#82BE3B]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Download Tiket (PNG)</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Tiket</span>
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-[#1C4BBC] bg-[#1C4BBC]/10 hover:bg-[#1C4BBC]/15 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Daftar Peserta Lain</span>
          </button>
        )}
      </div>

      {/* Important Notice Card: Wajib Simpan Tiket untuk Registrasi & Sertifikat */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-amber-950 font-poppins tracking-wide">
              PENTING: HARAP SIMPAN TIKET INI BAIK-BAIK!
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Tiket ini adalah identitas resmi kepesertaan Anda dan tidak boleh hilang:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="bg-white/95 rounded-xl p-3.5 border border-amber-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1C4BBC]/10 text-[#1C4BBC] flex items-center justify-center shrink-0 mt-0.5">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 block">
                1. Registrasi Ulang / Check-In
              </span>
              <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                QR Code pada tiket wajib ditunjukkan dan dipindai oleh panitia di meja registrasi pada hari-H acara.
              </p>
            </div>
          </div>

          <div className="bg-white/95 rounded-xl p-3.5 border border-amber-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#82BE3B]/20 text-[#527d21] flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-900 block">
                2. Syarat Klaim E-Sertifikat
              </span>
              <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                Nomor ID Tiket dan NIM merupakan syarat mutlak untuk verifikasi penerbitan sertifikat resmi kegiatan.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center justify-center text-center font-medium">
          💡 Tips: Silakan klik tombol &quot;Download Tiket (PNG)&quot; di atas atau screenshot layar ponsel Anda sekarang agar tersimpan aman di galeri.
        </div>
      </div>
    </div>
  );
}
