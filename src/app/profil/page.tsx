"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  Lightbulb,
  Handshake,
  Star,
  Globe,
  Zap,
  Heart,
  TrendingUp,
  BookOpen,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProfilPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const visi =
    "Optimalisasi DEMA UIN Antasari Sebagai Platform Aktualisasi Mahasiswa yang Berdampak dalam Kemajuan Antasari dan Indonesia.";

  const misi = [
    {
      no: "01",
      title: "Kinerja Profesional, Adaptif & Proaktif",
      desc: "Menghadirkan kinerja organisasi yang profesional, adaptif terhadap perubahan, dan proaktif dalam merespons kebutuhan mahasiswa.",
      icon: Zap,
    },
    {
      no: "02",
      title: "Sinergitas & Kolaborasi Harmonis",
      desc: "Membangun sinergitas dan kolaborasi dengan segala elemen demi terwujudnya hubungan yang harmonis antar lembaga kemahasiswaan.",
      icon: Handshake,
    },
    {
      no: "03",
      title: "Pelayanan Inklusif & Transparan",
      desc: "Mewujudkan eskalasi pelayanan yang inklusif dan transparan untuk kesejahteraan mahasiswa UIN Antasari secara menyeluruh.",
      icon: Users,
    },
    {
      no: "04",
      title: "Pengembangan Minat & Bakat Unggul",
      desc: "Memfasilitasi pengembangan minat dan bakat yang supportif dan apresiatif untuk mewujudkan Antasari yang unggul.",
      icon: Star,
    },
    {
      no: "05",
      title: "Gerakan Sosial & Kedaulatan Masyarakat",
      desc: "Menciptakan peran mahasiswa dalam menjaga nilai gerakan sosial untuk kedaulatan masyarakat dan kemajuan daerah.",
      icon: Globe,
    },
  ];

  const nilaiDasar = [
    {
      title: "Inklusif",
      desc: "Organisasi adalah rumah bersama bagi seluruh mahasiswa tanpa membedakan latar belakang. Kami menolak segala bentuk diskriminasi dan memberi ruang aman bagi setiap suara.",
      icon: Heart,
      color: "from-[#990808] to-[#F44027]",
    },
    {
      title: "Progresif",
      desc: "Menempatkan organisasi sebagai kekuatan perubahan yang responsif terhadap realitas zaman. Berani melakukan terobosan dan pembaruan berkelanjutan.",
      icon: TrendingUp,
      color: "from-[#F44027] to-[#EDC537]",
    },
    {
      title: "Harmonis",
      desc: "Menjaga keberlangsungan organisasi sebagai ruang kolektif. Perbedaan dirawat melalui dialog dan musyawarah, mengelola perbedaan secara dewasa.",
      icon: Handshake,
      color: "from-[#990808] to-[#EDC537]",
    },
    {
      title: "Dinamis",
      desc: "Organisasi mampu bergerak, beradaptasi, dan berkembang. Terbuka terhadap inovasi, kolaborasi, dan pendekatan baru, terus hidup sebagai ruang belajar.",
      icon: Lightbulb,
      color: "from-[#F44027] to-[#990808]",
    },
  ];

  const filosofi = [
    {
      title: "Laskar",
      meaning: "Barisan Pejuang",
      desc: "Mencerminkan segenap pengurus DEMA sebagai laskar perjuangan mahasiswa yang tangguh, solid, memiliki dedikasi tinggi, dan ikhlas bekerja demi kemaslahatan bersama.",
      num: "I",
    },
    {
      title: "Purnama",
      meaning: "Cahaya Penerang",
      desc: "Simbol petunjuk dan penerang di tengah kegelapan. DEMA berkomitmen hadir membawa solusi konkret, bersinar lewat prestasi, serta menyebarkan kehangatan pelayanan yang inklusif.",
      num: "II",
    },
    {
      title: "Antasari",
      meaning: "Keteguhan Perjuangan",
      desc: "Mengadopsi semangat juang Pangeran Antasari ('Haram Manyarah Waja Sampai Kaputing'). Merepresentasikan identitas kampus serta kegigihan memperjuangkan aspirasi mahasiswa.",
      num: "III",
    },
  ];

  const budayaItems = [
    {
      label: "Ing Ngarso Sung Tulodo",
      sub: "Keteladanan Pemimpin",
      desc: "Kepemimpinan tidak dimaknai sebagai posisi tertinggi yang memerintah, melainkan sebagai teladan yang memberi arah melalui tindakan nyata.",
      icon: BookOpen,
    },
    {
      label: "Ing Madya Mangun Karso",
      sub: "Motivasi Kolektif",
      desc: "Setiap anggota hadir bukan sebagai pelengkap, tetapi sebagai subjek yang memiliki peran, gagasan, dan daya dorong.",
      icon: Users,
    },
    {
      label: "Tut Wuri Handayani",
      sub: "Ruang Tumbuh Kader",
      desc: "Kaderisasi tidak dilakukan dengan cara menekan, melainkan dengan mendampingi, mempercayai, dan memberi ruang untuk bertumbuh.",
      icon: Heart,
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(
          ".hero-title-word, .hero-subtitle, .hero-scroll-hint, .tentang-para, .photo-slot-container, .filosofi-card, .visi-text, .misi-item, .nilai-card, .budaya-item, .budaya-quote",
          { opacity: 1, y: 0, x: 0, clipPath: "none" }
        );
        gsap.set(".visi-line", { width: "100%" });
        return;
      }

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      // 1. Hero Entrance & Scroll Parallax
      gsap.fromTo(
        ".hero-title-word",
        { y: "110%" },
        { y: "0%", duration: 1.1, stagger: 0.08, ease: "power4.out" }
      );
      
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.4, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-scroll-hint",
        { opacity: 0 },
        { opacity: 0.6, duration: 0.8, delay: 0.7 }
      );

      // Desktop-only subtle hero scrub
      if (!isMobile) {
        gsap.to(".hero-content-wrapper", {
          y: -80,
          opacity: 0,
          scale: 0.96,
          scrollTrigger: {
            trigger: ".profil-hero",
            start: "top top",
            end: "bottom 30%",
            scrub: 1,
          },
        });
      }

      // 2. Tentang: Stagger Fade Up + Smooth Scale In
      gsap.fromTo(
        ".tentang-para",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".tentang-section",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".photo-slot-container",
        { opacity: 0, scale: 0.97, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tentang-section",
            start: "top 88%",
            once: true,
          },
        }
      );

      // 3. Filosofi: Stagger Card Reveal
      gsap.fromTo(
        ".filosofi-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".filosofi-section",
            start: "top 88%",
            once: true,
          },
        }
      );

      // 4. Visi & Misi: Drawing line & Stagger Items
      gsap.fromTo(
        ".visi-line",
        { width: "0%" },
        {
          width: "100%",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".visi-section",
            start: "top 90%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".visi-text",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".visi-section",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".misi-item",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".misi-container",
            start: "top 88%",
            once: true,
          },
        }
      );

      // 5. Nilai Dasar: Clean reveal
      gsap.fromTo(
        ".nilai-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".nilai-section",
            start: "top 88%",
            once: true,
          },
        }
      );

      // 6. Budaya Organisasi: Stagger items + Drawing Quote border
      gsap.fromTo(
        ".budaya-quote",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".budaya-quote",
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".budaya-item",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".budaya-items-grid",
            start: "top 88%",
            once: true,
          },
        }
      );

      // 7. Global Left Progress Line (Desktop only)
      if (!isMobile) {
        gsap.to(".deco-line-left", {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative overflow-x-hidden bg-white font-poppins">
      {/* Decorative left progress line */}
      <div className="fixed left-4 top-0 h-screen w-0.5 bg-neutral-100 z-10 hidden lg:block">
        <div className="deco-line-left w-full bg-brand-primary" style={{ height: "0%" }} />
      </div>

      {/* Hero */}
      <section className="profil-hero relative min-h-[55vh] xs:min-h-[60vh] sm:min-h-screen py-10 xs:py-14 sm:py-0 flex items-center justify-center overflow-hidden bg-white border-b border-neutral-100">
        {/* Technical architectural grid background texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Technical outline markings in corners */}
        <div className="absolute top-24 left-8 text-neutral-300 text-[10px] font-mono hidden sm:block">
          DEMA-UIN-ANTASARI // PRFL_PG_01
        </div>
        <div className="absolute bottom-8 right-8 text-neutral-300 text-[10px] font-mono hidden sm:block">
          SYS.LOC // BANJARMASIN-BANJARBARU
        </div>

        <div className="hero-content-wrapper relative z-10 text-center px-3.5 sm:px-4">
          <span className="inline-block text-brand-primary text-[10px] xs:text-xs font-bold uppercase tracking-[0.3em] xs:tracking-[0.4em] mb-2 xs:mb-3 sm:mb-6 font-poppins">
            Dewan Eksekutif Mahasiswa
          </span>
          
          <h1 className="flex flex-wrap justify-center gap-x-2 xs:gap-x-3 sm:gap-x-4 gap-y-0.5 sm:gap-y-2 mb-3 xs:mb-4 sm:mb-6 overflow-hidden py-1 sm:py-2">
            {["Profil", "DEMA", "UIN", "Antasari"].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden py-0.5 sm:py-1">
                <span className="hero-title-word block text-2xl xs:text-3xl sm:text-6xl md:text-8xl font-black text-neutral-900 leading-none uppercase tracking-tight font-poppins">
                  {word}
                </span>
              </span>
            ))}
          </h1>
          
          <p className="hero-subtitle text-neutral-600 text-xs sm:text-base max-w-md mx-auto leading-relaxed font-poppins px-1">
            Kabinet{" "}
            <strong className="text-brand-primary font-bold">Laskar Purnama Antasari</strong>
            : Tumbuh Berdampak, Bersama Antasari
          </p>
          
          <div className="hero-scroll-hint mt-6 sm:mt-16 flex flex-col items-center gap-1.5 text-neutral-400 text-xs font-mono">
            <span>Scroll untuk menjelajahi</span>
            <ChevronDown className="w-4 h-4 text-brand-primary animate-bounce" />
          </div>
        </div>
      </section>

      {/* 01. Tentang Kami Section */}
      <section className="bg-white border-b border-neutral-100 py-8 sm:py-20 lg:py-24 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="tentang-section grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-widest font-poppins">
              01. Tentang Kami
            </span>
            <h2 className="mt-1.5 sm:mt-3 text-xl sm:text-3xl font-extrabold text-neutral-900 leading-snug uppercase font-poppins tracking-tight">
              Tentang Organisasi
            </h2>
            <div className="mt-3.5 sm:mt-6 space-y-2.5 sm:space-y-4">
              <p className="tentang-para text-[13px] sm:text-sm leading-relaxed text-neutral-600">
                Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin merupakan lembaga
                eksekutif tertinggi di tingkat universitas yang berfungsi sebagai wadah representasi
                resmi mahasiswa untuk mengoordinasikan kegiatan kemahasiswaan, menyalurkan aspirasi,
                serta melakukan advokasi hak-hak mahasiswa.
              </p>
              <p className="tentang-para text-[13px] sm:text-sm leading-relaxed text-neutral-600">
                Dengan kesadaran bahwa tidak ada sebaik-baiknya manusia selain yang bisa memberikan
                kebermanfaatan bagi manusia lainnya, DEMA UIN Antasari hadir sebagai ruang tumbuhnya
                gagasan yang berakar pada cinta, harapan, dan nilai kemanusiaan.
              </p>
              <p className="tentang-para text-[13px] sm:text-sm leading-relaxed text-neutral-600">
                Melalui proses pembenahan yang berkesinambungan, penguatan solidaritas, serta dialog
                yang inklusif, kami berkomitmen menghadirkan kebermanfaatan nyata yang melampaui
                batas institusional.
              </p>
            </div>
          </div>

          {/* Photo Column with IMG_8267.JPG */}
          <div className="photo-slot-container w-full max-w-lg mx-auto relative group mt-2 lg:mt-0">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-md bg-neutral-100">
              <img
                src="/images/kabinet/kabinet-utama.jpg"
                alt="Foto Utama Kabinet Laskar Purnama Antasari DEMA UIN Antasari Banjarmasin"
                className="w-full h-auto aspect-[16/10] sm:aspect-[4/3] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 sm:bottom-4 left-3.5 right-3.5 sm:left-4 sm:right-4 flex items-center justify-between text-white text-[11px] sm:text-xs font-poppins">
                <span className="font-semibold drop-shadow-sm truncate mr-2">
                  Kabinet Laskar Purnama Antasari
                </span>
                <span className="text-[10px] text-white/90 font-mono drop-shadow-sm bg-black/40 px-2 py-0.5 rounded-full border border-white/20 shrink-0">
                  2026/2027
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. Filosofi Kabinet */}
      <section className="filosofi-section py-8 sm:py-20 lg:py-24 px-3.5 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="filosofi-label text-center mb-6 sm:mb-16">
            <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-widest font-poppins">
              02. Filosofi Kabinet
            </span>
            <h2 className="mt-1.5 sm:mt-3 text-xl sm:text-3xl font-extrabold text-neutral-900 uppercase font-poppins tracking-tight">
              Laskar Purnama Antasari
            </h2>
            <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Setiap kata dalam nama kabinet membawa makna mendalam yang melandasi seluruh gerak langkah kepengurusan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            {filosofi.map((item) => (
              <div
                key={item.title}
                className="filosofi-card relative overflow-hidden rounded-2xl bg-white border border-neutral-200/90 p-4.5 sm:p-8 group hover:border-brand-primary/30 transition-all duration-300 shadow-2xs"
              >
                {/* Big background numeral */}
                <span className="absolute top-2 right-4 text-5xl sm:text-7xl font-black text-neutral-100/90 select-none group-hover:text-brand-primary/10 transition-colors duration-500 font-poppins pointer-events-none">
                  {item.num}
                </span>
                <span className="relative z-10 text-[10px] sm:text-[11px] font-bold text-brand-primary uppercase tracking-wider font-poppins block">
                  {item.meaning}
                </span>
                <h3 className="relative z-10 mt-1 sm:mt-2 text-base sm:text-xl font-extrabold text-neutral-900 uppercase font-poppins tracking-tight">
                  {item.title}
                </h3>
                <div className="relative z-10 mt-2 sm:mt-4 w-7 sm:w-8 h-0.5 bg-brand-secondary group-hover:w-14 sm:group-hover:w-16 transition-all duration-500" />
                <p className="relative z-10 mt-2.5 sm:mt-4 text-xs sm:text-sm leading-relaxed text-neutral-600 font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03. Visi & Misi */}
      <section className="visi-section py-8 sm:py-20 lg:py-24 px-3.5 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-widest font-poppins block text-center sm:text-left">
            03. Visi &amp; Misi
          </span>

          {/* Visi */}
          <div className="mt-4 sm:mt-8 mb-6 sm:mb-16">
            <div className="visi-line h-px bg-brand-primary mb-4 sm:mb-8" style={{ width: "0%" }} />
            <blockquote className="visi-text bg-neutral-50/60 sm:bg-transparent rounded-2xl sm:rounded-none p-4 sm:p-0 border sm:border-0 border-neutral-200/70">
              <span className="block text-2xl sm:text-5xl font-black text-brand-primary/15 leading-none -mb-2 sm:-mb-4 select-none">&ldquo;</span>
              <p className="text-sm sm:text-2xl font-bold text-neutral-800 leading-snug sm:leading-relaxed max-w-3xl font-poppins">
                {visi}
              </p>
              <span className="block text-2xl sm:text-5xl font-black text-brand-primary/15 leading-none mt-0 text-right max-w-3xl select-none">&rdquo;</span>
            </blockquote>
          </div>

          {/* Misi */}
          <div className="misi-container space-y-2.5 sm:space-y-4">
            <h3 className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3 sm:mb-8 font-poppins">
              Misi Strategis Kabinet
            </h3>
            {misi.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="misi-item group flex items-start gap-3 sm:gap-6 rounded-2xl bg-white border border-neutral-200/90 p-3.5 sm:px-6 sm:py-5 hover:bg-neutral-50 hover:border-brand-primary/30 transition-all duration-300 shadow-2xs"
                >
                  <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 pt-0.5">
                    <span className="text-lg sm:text-3xl font-black text-brand-primary/35 group-hover:text-brand-primary/60 transition-colors duration-300 font-poppins w-6 sm:w-10 text-center">
                      {item.no}
                    </span>
                    <div className="flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-none bg-neutral-100 text-brand-primary border border-neutral-200/80 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
                      <IconComponent className="h-3.5 w-3.5 sm:h-5 sm:w-5 stroke-[1.4]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-base font-bold text-neutral-900 font-poppins leading-snug">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[12px] sm:text-sm leading-relaxed text-neutral-600">
                      {item.desc}
                    </p>
                  </div>
                  <div className="hidden sm:block shrink-0 w-1 h-10 bg-neutral-200 group-hover:bg-brand-accent transition-colors duration-300 self-center" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04. Nilai Dasar */}
      <section className="nilai-section py-8 sm:py-20 lg:py-24 px-3.5 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="nilai-label text-center mb-6 sm:mb-16">
            <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-widest font-poppins">
              04. Nilai Dasar
            </span>
            <h2 className="mt-1.5 sm:mt-3 text-xl sm:text-3xl font-extrabold text-neutral-900 uppercase font-poppins tracking-tight">
              Nilai Dasar Organisasi
            </h2>
            <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Empat nilai yang menjadi pondasi gerak dan sikap seluruh pengurus DEMA UIN Antasari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {nilaiDasar.map((nilai) => {
              const IconComponent = nilai.icon;
              return (
                <div
                  key={nilai.title}
                  className="nilai-card relative overflow-hidden rounded-2xl bg-white border border-neutral-200/90 p-4 sm:p-7 group hover:border-brand-primary/30 transition-all duration-300 shadow-2xs"
                >
                  <div className="relative z-10 flex items-start gap-3.5 sm:gap-5">
                    <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200/80 text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
                      <IconComponent className="h-4.5 w-4.5 sm:h-6 sm:w-6 stroke-[1.4]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-lg font-bold text-neutral-900 group-hover:text-brand-primary transition-colors duration-200 font-poppins">
                        {nilai.title}
                      </h3>
                      <p className="mt-1 sm:mt-2 text-[12px] sm:text-xs leading-relaxed text-neutral-600">
                        {nilai.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05. Budaya Organisasi */}
      <section className="budaya-section py-8 sm:py-20 lg:py-24 px-3.5 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="budaya-label text-center mb-6 sm:mb-12">
            <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-widest font-poppins">
              05. Budaya Organisasi
            </span>
            <h2 className="mt-1.5 sm:mt-3 text-xl sm:text-3xl font-extrabold text-neutral-900 uppercase font-poppins tracking-tight">
              Falsafah Gerak Bersama
            </h2>
          </div>

          {/* Pinned quote */}
          <div className="budaya-quote mb-6 sm:mb-16 rounded-2xl border-l-4 border-brand-primary bg-neutral-50/80 p-4 sm:p-10 text-left shadow-2xs">
            <p className="text-sm sm:text-2xl font-bold text-neutral-900 italic leading-relaxed font-poppins">
              &ldquo;Ing ngarso sung tulodo, ing madya mangun karso, tut wuri handayani&rdquo;
            </p>
            <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-neutral-500 font-mono">
              (Falsafah Ki Hajar Dewantara)
            </p>
          </div>

          <div className="budaya-items-grid grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            {budayaItems.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={i}
                  className="budaya-item relative rounded-2xl border border-neutral-200/90 bg-white p-4 sm:p-7 group hover:border-brand-primary/30 transition-all duration-300 shadow-2xs"
                >
                  {/* Step number top */}
                  <div className="flex items-center gap-2.5 mb-2.5 sm:mb-5">
                    <div className="flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-none bg-neutral-100 text-brand-primary border border-neutral-200/80 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
                      <IconComponent className="h-3.5 w-3.5 sm:h-5 sm:w-5 stroke-[1.4]" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-brand-primary font-bold uppercase tracking-wider font-poppins">
                      Prinsip {i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-0.5 sm:mb-1 font-poppins">
                    {item.label}
                  </h3>
                  <p className="text-xs font-semibold text-brand-primary mb-1.5 sm:mb-3 font-poppins">
                    {item.sub}
                  </p>
                  <p className="text-[12px] sm:text-xs leading-relaxed text-neutral-600">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Closing quote */}
          <div className="mt-6 sm:mt-12 p-4 sm:p-7 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 text-center shadow-2xs">
            <p className="text-[12px] sm:text-sm leading-relaxed text-neutral-600 italic max-w-3xl mx-auto font-poppins">
              Kepemimpinan tidak diwariskan, tetapi ditumbuhkan, tidak dipaksakan, tetapi dihidupkan
              melalui proses yang jujur dan berkelanjutan. Organisasi tidak berjalan dengan logika
              kekuasaan, melainkan dengan etika kebersamaan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
