"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function EventCountdown() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    setIsMounted(true);
    
    // Target waktu: Sabtu, 3 Oktober 2026 pukul 08:00 WITA (UTC+8)
    const targetDate = new Date("2026-10-03T08:00:00+08:00").getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
        });
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return (
      <div className="bg-neutral-900 text-white rounded-2xl p-5 sm:p-6 mb-8 border border-neutral-800 animate-pulse">
        <div className="h-6 bg-neutral-800 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-neutral-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C4BBC] via-[#153a99] to-[#0d2566] text-white p-6 sm:p-8 shadow-xl border border-blue-400/20 mb-8">
      {/* Subtle decorative background circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#82BE3B]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Information */}
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#EDC537]" />
            <span>Hitung Mundur Pelaksanaan</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold font-poppins tracking-tight">
            Antasari Media Lab 2026
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-blue-100/90 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#EDC537]" />
              <span>Sabtu, 3 Oktober 2026 • 08.00 WITA</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#82BE3B]" />
              <span>Aula Sasangga Banua Banjarmasin</span>
            </span>
          </div>
        </div>

        {/* Right Countdown Blocks & CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
          {!timeLeft.isExpired ? (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 min-w-[60px] sm:min-w-[70px]">
                <span className="block text-xl sm:text-2xl font-black font-poppins text-white leading-none">
                  {timeLeft.days.toString().padStart(2, "0")}
                </span>
                <span className="block text-[10px] uppercase font-semibold text-blue-200 mt-1">Hari</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 min-w-[60px] sm:min-w-[70px]">
                <span className="block text-xl sm:text-2xl font-black font-poppins text-white leading-none">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="block text-[10px] uppercase font-semibold text-blue-200 mt-1">Jam</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 min-w-[60px] sm:min-w-[70px]">
                <span className="block text-xl sm:text-2xl font-black font-poppins text-white leading-none">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="block text-[10px] uppercase font-semibold text-blue-200 mt-1">Menit</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/15 min-w-[60px] sm:min-w-[70px]">
                <span className="block text-xl sm:text-2xl font-black font-poppins text-[#EDC537] leading-none">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="block text-[10px] uppercase font-semibold text-blue-200 mt-1">Detik</span>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold text-xs">
              Kegiatan Sedang Berlangsung / Selesai
            </div>
          )}

          {/* Quick CTA Button */}
          <Link
            href="/event/antasari-media-lab"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-[#1C4BBC] hover:bg-neutral-100 transition-all shadow-md active:scale-95 shrink-0"
          >
            <span>Buka Halaman Acara</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
