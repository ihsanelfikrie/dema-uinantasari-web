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
      desc: "Menjaga keberlangsungan organisasi sebagai ruang kolektif. Perbedaan dirawat melalui dialog dan musyawarah — mengelola perbedaan secara dewasa.",
      icon: Handshake,
      color: "from-[#990808] to-[#EDC537]",
    },
    {
      title: "Dinamis",
      desc: "Organisasi mampu bergerak, beradaptasi, dan berkembang. Terbuka terhadap inovasi, kolaborasi, dan pendekatan baru — terus hidup sebagai ruang belajar.",
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
      // ── 1. Hero Section: pinned scroll scrub ───────────────────────────────
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".profil-hero",
          start: "top top",
          end: "+=600",
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
        },
      });
      heroTl
        .to(".hero-bg-overlay", { scaleX: 1.15, scaleY: 1.15, opacity: 0.9, ease: "none" })
        .to(".hero-title-word", { y: -80, opacity: 0, stagger: 0.05, ease: "none" }, 0)
        .to(".hero-subtitle", { y: -50, opacity: 0, ease: "none" }, 0.1)
        .to(".hero-scroll-hint", { opacity: 0, ease: "none" }, 0);

      // ── 2. Tentang: sliding from left ─────────────────────────────────────
      gsap.fromTo(
        ".tentang-section",
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tentang-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ".tentang-deco",
        { x: 100, opacity: 0, rotation: -15 },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 1.2,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".tentang-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ".tentang-para",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".tentang-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── 3. Filosofi: staggered card flip-in ───────────────────────────────
      gsap.fromTo(
        ".filosofi-label",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".filosofi-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ".filosofi-card",
        { rotationY: 60, opacity: 0, transformOrigin: "left center", x: 60 },
        {
          rotationY: 0,
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "back.out(1.2)",
          stagger: 0.18,
          scrollTrigger: {
            trigger: ".filosofi-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── 4. Visi: scrubbed text reveal + neon line ─────────────────────────
      gsap.fromTo(
        ".visi-line",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".visi-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ".visi-text",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: ".visi-section",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── 5. Misi: alternating slide-in ─────────────────────────────────────
      document.querySelectorAll(".misi-item").forEach((el, i) => {
        const fromDir = i % 2 === 0 ? -80 : 80;
        gsap.fromTo(
          el,
          { x: fromDir, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ── 6. Nilai Dasar: batch with scrub scale ────────────────────────────
      gsap.fromTo(
        ".nilai-label",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".nilai-section",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
      ScrollTrigger.batch(".nilai-card", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { y: 60, opacity: 0, scale: 0.93 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.4)",
              stagger: 0.12,
            }
          ),
        onLeaveBack: (batch) =>
          gsap.to(batch, { y: 60, opacity: 0, scale: 0.93, duration: 0.4 }),
      });

      // ── 7. Budaya: pinned horizontal scrub ────────────────────────────────
      gsap.fromTo(
        ".budaya-label",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".budaya-section",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ".budaya-quote",
        { scaleX: 0.85, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".budaya-quote",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      document.querySelectorAll(".budaya-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: ".budaya-section",
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ── 8. Global: decorative floating line scrub ─────────────────────────
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
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative overflow-x-hidden bg-brand-background font-poppins">
      {/* Decorative left progress line */}
      <div className="fixed left-4 top-0 h-screen w-0.5 bg-neutral-200 z-10 hidden lg:block">
        <div className="deco-line-left w-full bg-brand-primary" style={{ height: "0%" }} />
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="profil-hero relative h-screen flex items-center justify-center overflow-hidden bg-brand-primary">
        {/* Decorative background shapes */}
        <div className="hero-bg-overlay absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F44027] opacity-20 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#EDC537] opacity-10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-white/5 rounded-full" />
        </div>

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-[#EDC537] text-xs font-semibold uppercase tracking-[0.4em] mb-6 opacity-80">
            Dewan Eksekutif Mahasiswa
          </span>
          <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-6">
            {["Profil", "DEMA", "UIN", "Antasari"].map((word, i) => (
              <span
                key={i}
                className="hero-title-word block text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-none"
              >
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle text-white/70 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Kabinet{" "}
            <strong className="text-[#EDC537]">Laskar Purnama Antasari</strong>
            {" "}— Tumbuh Berdampak, Bersama Antasari
          </p>
          <div className="hero-scroll-hint mt-12 flex flex-col items-center gap-2 text-white/40 text-xs">
            <span>Scroll untuk menjelajahi</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── TENTANG ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="tentang-section grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-widest">
              01 — Tentang Kami
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
              Tentang Organisasi
            </h2>
            <div className="mt-6 space-y-4">
              <p className="tentang-para text-sm leading-relaxed text-neutral-600">
                Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin merupakan lembaga
                eksekutif tertinggi di tingkat universitas yang berfungsi sebagai wadah representasi
                resmi mahasiswa — mengoordinasikan kegiatan kemahasiswaan, menyalurkan aspirasi,
                serta melakukan advokasi hak-hak mahasiswa.
              </p>
              <p className="tentang-para text-sm leading-relaxed text-neutral-600">
                Dengan kesadaran bahwa tidak ada sebaik-baiknya manusia selain yang bisa memberikan
                kebermanfaatan bagi manusia lainnya, DEMA UIN Antasari hadir sebagai ruang tumbuhnya
                gagasan yang berakar pada cinta, harapan, dan nilai kemanusiaan.
              </p>
              <p className="tentang-para text-sm leading-relaxed text-neutral-600">
                Melalui proses pembenahan yang berkesinambungan, penguatan solidaritas, serta dialog
                yang inklusif — kami berkomitmen menghadirkan kebermanfaatan nyata yang melampaui
                batas institusional.
              </p>
            </div>
          </div>

          {/* Decorative right side */}
          <div className="tentang-deco relative flex items-center justify-center">
            <div className="relative w-72 h-72">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-primary/20" />
              <div className="absolute inset-4 rounded-full border border-brand-accent/20" />
              {/* Center block */}
              <div className="absolute inset-8 rounded-full bg-brand-primary flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <p className="text-3xl font-bold">2026</p>
                  <p className="text-xs opacity-70 mt-1">Tahun Berdiri</p>
                </div>
              </div>
              {/* Orbiting dots */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#990808" : "#EDC537",
                    top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 130}px - 6px)`,
                    left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 130}px - 6px)`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILOSOFI ─────────────────────────────────────────────────────── */}
      <section className="filosofi-section py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="filosofi-label text-center mb-16">
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-widest">
              02 — Filosofi Kabinet
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-neutral-900">
              Laskar Purnama Antasari
            </h2>
            <p className="mt-3 text-sm text-neutral-500 max-w-md mx-auto">
              Setiap kata dalam nama kabinet membawa makna mendalam yang melandasi seluruh gerak langkah kepengurusan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filosofi.map((item) => (
              <div
                key={item.title}
                className="filosofi-card relative overflow-hidden rounded-2xl bg-brand-background border border-neutral-100 p-8 group hover:border-brand-primary/30 transition-colors duration-300"
              >
                {/* Big background numeral */}
                <span className="absolute top-4 right-6 text-8xl font-black text-neutral-100 select-none group-hover:text-brand-primary/10 transition-colors duration-500">
                  {item.num}
                </span>
                <span className="relative z-10 text-xs font-semibold text-brand-primary uppercase tracking-widest">
                  {item.meaning}
                </span>
                <h3 className="relative z-10 mt-2 text-2xl font-bold text-neutral-900">
                  {item.title}
                </h3>
                <div className="relative z-10 mt-4 w-8 h-0.5 bg-brand-secondary group-hover:w-16 transition-all duration-500" />
                <p className="relative z-10 mt-4 text-xs leading-relaxed text-neutral-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISI & MISI ──────────────────────────────────────────────────── */}
      <section className="visi-section py-24 px-4 sm:px-6 lg:px-8 bg-brand-background">
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-semibold text-brand-primary uppercase tracking-widest">
            03 — Visi &amp; Misi
          </span>

          {/* Visi */}
          <div className="mt-8 mb-20">
            <div className="visi-line h-px bg-brand-primary mb-8" style={{ scaleX: 0 }} />
            <blockquote className="visi-text">
              <span className="block text-4xl sm:text-5xl font-black text-brand-primary/10 leading-none -mb-4 select-none">&ldquo;</span>
              <p className="text-lg sm:text-2xl font-semibold text-neutral-800 leading-relaxed max-w-3xl">
                {visi}
              </p>
              <span className="block text-4xl sm:text-5xl font-black text-brand-primary/10 leading-none mt-0 text-right max-w-3xl select-none">&rdquo;</span>
            </blockquote>
          </div>

          {/* Misi */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-8">
              Misi Strategis
            </h3>
            {misi.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="misi-item group flex items-center gap-6 rounded-2xl bg-white border border-neutral-100 px-6 py-5 hover:border-brand-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <span className="text-3xl font-black text-neutral-100 group-hover:text-brand-primary/20 transition-colors duration-300 w-10 shrink-0">
                    {item.no}
                  </span>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <IconComponent className="h-5 w-5 stroke-[1.5]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-semibold text-neutral-900">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-500">
                      {item.desc}
                    </p>
                  </div>
                  <div className="shrink-0 w-1 h-10 rounded-full bg-neutral-100 group-hover:bg-brand-accent transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NILAI DASAR ──────────────────────────────────────────────────── */}
      <section className="nilai-section py-24 px-4 sm:px-6 lg:px-8 bg-brand-primary">
        <div className="max-w-6xl mx-auto">
          <div className="nilai-label text-center mb-16">
            <span className="text-xs font-semibold text-[#EDC537] uppercase tracking-widest">
              04 — Nilai Dasar
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
              Nilai Dasar Organisasi
            </h2>
            <p className="mt-3 text-sm text-white/60 max-w-md mx-auto">
              Empat nilai yang menjadi pondasi gerak dan sikap seluruh pengurus DEMA UIN Antasari.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {nilaiDasar.map((nilai) => {
              const IconComponent = nilai.icon;
              return (
                <div
                  key={nilai.title}
                  className="nilai-card relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-8 group hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Gradient accent top-right */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-br ${nilai.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  <div className="relative z-10 flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white group-hover:bg-[#EDC537] group-hover:text-brand-primary transition-all duration-300">
                      <IconComponent className="h-6 w-6 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{nilai.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/60">{nilai.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BUDAYA ORGANISASI ────────────────────────────────────────────── */}
      <section className="budaya-section py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="budaya-label text-center mb-12">
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-widest">
              05 — Budaya Organisasi
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-neutral-900">
              Falsafah Gerak Bersama
            </h2>
          </div>

          {/* Pinned quote */}
          <div className="budaya-quote mb-16 rounded-2xl bg-brand-primary p-10 text-center">
            <p className="text-lg sm:text-xl font-semibold text-[#EDC537] italic leading-relaxed">
              &ldquo;Ing ngarso sung tulodo, ing madya mangun karso, tut wuri handayani&rdquo;
            </p>
            <p className="mt-3 text-xs text-white/50">— Falsafah Ki Hajar Dewantara</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {budayaItems.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={i}
                  className="budaya-item relative rounded-2xl border border-neutral-100 bg-brand-background p-7 group hover:border-brand-primary/30 hover:shadow-md transition-all duration-300"
                >
                  {/* Step number top */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
                      Prinsip {i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1">{item.label}</h3>
                  <p className="text-xs font-semibold text-brand-primary mb-3">{item.sub}</p>
                  <p className="text-xs leading-relaxed text-neutral-500">{item.desc}</p>
                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-neutral-100 group-hover:bg-brand-accent transition-colors duration-300" />
                </div>
              );
            })}
          </div>

          {/* Closing quote */}
          <div className="mt-12 p-7 rounded-2xl bg-brand-background border border-neutral-100 text-center">
            <p className="text-sm leading-relaxed text-neutral-500 italic max-w-3xl mx-auto">
              Kepemimpinan tidak diwariskan, tetapi ditumbuhkan — tidak dipaksakan, tetapi dihidupkan
              melalui proses yang jujur dan berkelanjutan. Organisasi tidak berjalan dengan logika
              kekuasaan, melainkan dengan etika kebersamaan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
