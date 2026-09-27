"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer, CheckCircle, RotateCcw, Share2, Sparkles, Building2, User, CreditCard, Mail } from "lucide-react";

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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGeneratingDownload, setIsGeneratingDownload] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Generate QR Code data URL from NIM
  useEffect(() => {
    async function makeQR() {
      try {
        // Encode NIM and basic verification payload
        const qrPayload = JSON.stringify({
          event: "ANTASARI_MEDIA_LAB_2026",
          ticketId: data.ticketId,
          nim: data.nim,
          nama: data.nama,
          delegasi: data.delegasi,
        });

        const url = await QRCode.toDataURL(qrPayload, {
          width: 320,
          margin: 1,
          color: {
            dark: "#1C4BBC",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H",
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("Gagal membuat QR Code:", err);
      }
    }

    if (data.nim) {
      makeQR();
    }
  }, [data]);

  // High-Resolution Canvas Ticket Downloader
  const handleDownloadTicket = async () => {
    setIsGeneratingDownload(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // High-res retina scale
      const width = 1200;
      const height = 650;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Fill (Royal Blue Gradient)
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#1C4BBC");
      grad.addColorStop(1, "#0d2b79");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Decorative elements & curved accents
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.beginPath();
      ctx.arc(width - 150, -50, 300, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(100, height + 100, 250, 0, Math.PI * 2);
      ctx.fill();

      // Top accent bar: Lime Green
      ctx.fillStyle = "#82BE3B";
      ctx.fillRect(0, 0, width, 14);

      // 3. Ticket Split Dashed Line
      const splitX = 840;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(splitX, 30);
      ctx.lineTo(splitX, height - 30);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Ticket Cutout circles on split
      ctx.fillStyle = "#F4F2EF";
      ctx.beginPath();
      ctx.arc(splitX, 0, 25, 0, Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(splitX, height, 25, Math.PI, 0);
      ctx.fill();

      // 4. Header Text (Left Side)
      ctx.fillStyle = "#82BE3B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("DEMA UIN ANTASARI BANJARMASIN • E-TICKET RESMI", 60, 65);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 48px sans-serif";
      ctx.fillText("ANTASARI MEDIA LAB", 60, 125);

      ctx.fillStyle = "#CAD3E6";
      ctx.font = "italic 20px sans-serif";
      ctx.fillText('"Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa"', 60, 160);

      // 5. Participant Info Table / Grid
      const renderField = (label: string, value: string, x: number, y: number) => {
        ctx.fillStyle = "#CAD3E6";
        ctx.font = "500 16px sans-serif";
        ctx.fillText(label.toUpperCase(), x, y);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(value, x, y + 30);
      };

      renderField("NAMA LENGKAP", data.nama, 60, 230);
      renderField("NOMOR INDUK MAHASISWA (NIM)", data.nim, 460, 230);
      renderField("ASAL DELEGASI", data.delegasi, 60, 330);
      renderField("STATUS REGISTRASI", "TERVERIFIKASI (VALID)", 460, 330);

      renderField("KODE TIKET", data.ticketId, 60, 430);
      renderField("WAKTU PENDAFTARAN", data.registeredAt, 460, 430);

      // Bottom Note
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "15px sans-serif";
      ctx.fillText("Catatan: Harap tunjukkan QR Code pada panitia registrasi di lokasi kegiatan untuk verifikasi kehadiran.", 60, 560);

      // 6. Right Stub (QR Code Area)
      ctx.fillStyle = "#82BE3B";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("SCAN CHECK-IN", splitX + 50, 70);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("GATE PASS", splitX + 50, 100);

      // Draw QR Code
      if (qrDataUrl) {
        const qrImage = new window.Image();
        qrImage.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImage.onload = resolve;
        });

        // White background box for QR
        ctx.fillStyle = "#FFFFFF";
        const qrBoxSize = 250;
        const qrBoxX = splitX + (width - splitX - qrBoxSize) / 2;
        const qrBoxY = 140;

        ctx.beginPath();
        ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16);
        ctx.fill();

        ctx.drawImage(qrImage, qrBoxX + 15, qrBoxY + 15, qrBoxSize - 30, qrBoxSize - 30);

        // Under QR label
        ctx.fillStyle = "#CAD3E6";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`NIM: ${data.nim}`, splitX + (width - splitX) / 2, qrBoxY + qrBoxSize + 35);
        ctx.fillStyle = "#82BE3B";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText("VERIFIED ATTENDEE", splitX + (width - splitX) / 2, qrBoxY + qrBoxSize + 65);
        ctx.textAlign = "left"; // reset
      }

      // Convert canvas to image and trigger download
      const imageURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = `Tiket-Antasari-Media-Lab-${data.nim}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Gagal mendownload tiket:", err);
      alert("Terjadi kendala saat membuat gambar tiket. Silakan coba cetak halaman ini.");
    } finally {
      setIsGeneratingDownload(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Success Notification Alert */}
      <div className="bg-[#82BE3B]/15 border border-[#82BE3B]/30 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#82BE3B] text-white flex items-center justify-center shrink-0 shadow-md">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
            Pendaftaran Berhasil & Tiket Resmi Diterbitkan!
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-0.5">
            Selamat, data pendaftaran Anda telah tersimpan. Silakan <strong>download tiket di bawah ini</strong> untuk registrasi ulang di lokasi acara.
          </p>
        </div>
      </div>

      {/* Modern E-Ticket Card Representation */}
      <div
        ref={ticketRef}
        className="relative bg-gradient-to-br from-[#1C4BBC] via-[#163e9e] to-[#0c235c] text-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#82BE3B] via-[#CAD3E6] to-[#82BE3B]" />

        {/* Ambient Glow Bubbles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#82BE3B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#CAD3E6]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row relative z-10">
          {/* Main Ticket Body (Left / Top) */}
          <div className="p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between">
            {/* Top Subheader */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#82BE3B] animate-pulse" />
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-[#82BE3B]">
                    E-Ticket Resmi • DEMA UIN Antasari
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#CAD3E6] font-mono">
                  {data.ticketId}
                </span>
              </div>

              {/* Event Name */}
              <div className="mt-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-poppins text-white uppercase">
                  Antasari Media Lab
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#CAD3E6] italic font-light">
                  &ldquo;Optimalisasi Media Sosial sebagai Wajah Digital Organisasi Mahasiswa&rdquo;
                </p>
              </div>

              {/* Participant Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#CAD3E6] tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#82BE3B]" />
                    Nama Lengkap
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
                    {data.nama}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#CAD3E6] tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#82BE3B]" />
                    NIM (Nomor Induk)
                  </span>
                  <p className="text-base sm:text-lg font-bold font-mono text-[#82BE3B]">
                    {data.nim}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#CAD3E6] tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#82BE3B]" />
                    Asal Delegasi
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    {data.delegasi}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase text-[#CAD3E6] tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#82BE3B]" />
                    Email Terdaftar
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-[#CAD3E6] truncate">
                    {data.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Footer / Instructions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#CAD3E6]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#82BE3B]" />
                Registrasi: {data.registeredAt}
              </span>
              <span className="bg-[#82BE3B]/20 text-[#82BE3B] px-2 py-0.5 rounded font-semibold text-[10px] uppercase">
                Valid Pass
              </span>
            </div>
          </div>

          {/* Ticket Perforation Divider (Desktop: Vertical, Mobile: Horizontal) */}
          <div className="relative flex items-center justify-center">
            {/* Cutout notch Top / Left */}
            <div className="hidden lg:block absolute -top-4 w-8 h-8 rounded-full bg-[#F4F2EF] dark:bg-[#1A0202] z-20" />
            <div className="hidden lg:block absolute -bottom-4 w-8 h-8 rounded-full bg-[#F4F2EF] dark:bg-[#1A0202] z-20" />
            <div className="lg:hidden absolute -left-4 w-8 h-8 rounded-full bg-[#F4F2EF] dark:bg-[#1A0202] z-20" />
            <div className="lg:hidden absolute -right-4 w-8 h-8 rounded-full bg-[#F4F2EF] dark:bg-[#1A0202] z-20" />

            {/* Dotted separator line */}
            <div className="w-full lg:w-0 lg:h-full border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-white/25 my-2 lg:my-0 lg:mx-2" />
          </div>

          {/* Ticket Stub (Right / Bottom) with QR Code */}
          <div className="p-6 sm:p-8 lg:p-10 lg:w-80 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-[#82BE3B] uppercase tracking-wider mb-1">
              Scan Check-in
            </span>
            <p className="text-xs text-[#CAD3E6] mb-4">
              Tunjukkan QR Code ini di meja registrasi
            </p>

            {/* QR Code Container */}
            <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/40">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code NIM ${data.nim}`}
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-neutral-400 text-xs">
                  Membuat QR...
                </div>
              )}
            </div>

            <div className="mt-3 font-mono text-sm font-bold text-white tracking-widest">
              {data.nim}
            </div>
            <span className="text-[10px] text-[#CAD3E6] uppercase font-medium mt-0.5">
              QR Berbasis NIM Peserta
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons for Mobile & Desktop */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownloadTicket}
          disabled={isGeneratingDownload || !qrDataUrl}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#82BE3B] hover:bg-[#72a833] shadow-lg shadow-[#82BE3B]/25 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isGeneratingDownload ? "Menyiapkan File..." : "Download Tiket (PNG)"}
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Cetak Tiket
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-[#1C4BBC] dark:text-[#CAD3E6] bg-[#1C4BBC]/10 hover:bg-[#1C4BBC]/15 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Daftar Peserta Lain
          </button>
        )}
      </div>

      {/* Mobile Friendly Helper Note */}
      <div className="text-center text-xs text-neutral-500 dark:text-neutral-400">
        Catatan: Anda dapat langsung menyimpan gambar tiket di galeri perangkat Anda atau mengambil tangkapan layar (screenshot) sebagai cadangan.
      </div>
    </div>
  );
}
