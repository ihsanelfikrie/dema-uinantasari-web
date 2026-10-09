"use client";

import React, { useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bph, kementerianList, Kementerian } from "@/data/struktur";
import BaganOrganisasi from "@/components/struktur/BaganOrganisasi";
import FungsionarisIdCard from "@/components/struktur/FungsionarisIdCard";
import MinistryLogo from "@/components/ui/MinistryLogo";
import MinistryLogoShowcase from "@/components/struktur/MinistryLogoShowcase";
import {
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  ArrowDown,
  Building2,
  Briefcase,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type FilterTab = "all" | "bagan" | "bph" | "kemenko" | "teknis" | "logo";

export default function StrukturClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const bphMembers = useMemo(
    () => [
      bph.ketua,
      bph.wakilKetua,
      bph.sekjen,
      bph.wakilSekjen,
      bph.sekkab,
      bph.bendum,
    ],
    []
  );

  // Group ministries
  const kemenkoList = useMemo(
    () => kementerianList.filter((k) => k.menteri.jabatan === "Menteri Koordinator"),
    []
  );

  const kemenTeknisList = useMemo(
    () => kementerianList.filter((k) => k.menteri.jabatan !== "Menteri Koordinator"),
    []
  );

  const displayedKementerian = useMemo(() => {
    if (activeTab === "kemenko") return kemenkoList;
    if (activeTab === "teknis") return kemenTeknisList;
    return kementerianList;
  }, [activeTab, kemenkoList, kemenTeknisList]);

  // Smooth scroll helper
  const scrollToSection = (id: string, tab: FilterTab) => {
    setActiveTab(tab);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const renderAvatar = (
    fotoUrl?: string,
    nama?: string,
    size: "circle-sm" | "circle-md" = "circle-sm"
  ) => {
    if (fotoUrl && fotoUrl.trim() !== "" && fotoUrl !== "/images/kabinet/placeholder.png") {
      return (
        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shadow-2xs">
          <img
            src={fotoUrl}
            alt={nama || "Foto Pengurus"}
            className="h-full w-full object-cover object-top"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
        <svg
          className="h-5 w-5 stroke-[1.2]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
    );
  };

  // GSAP ScrollTrigger Animations
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Scroll Reading Progress Bar at the top
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.15,
            },
          }
        );
      }

      // 2. Hero Header Entry Animation
      const headerTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      headerTl
        .fromTo(
          ".hero-badge",
          { opacity: 0, y: -20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 }
        )
        .fromTo(
          ".hero-title-line",
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          ".hero-description",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ".stat-pill-item",
          { opacity: 0, y: 25, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08 },
          "-=0.3"
        );

      // 3. Bagan Organisasi Section Reveal
      gsap.fromTo(
        ".bagan-section-container",
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".bagan-section-container",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. BPH Section Cards with Lanyard Physics Tilt
      gsap.fromTo(
        ".bph-section-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#bph-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".bph-idcard-anim",
        {
          opacity: 0,
          y: 60,
          scale: 0.92,
          rotation: (index: number) => (index % 2 === 0 ? -2.2 : 2.2),
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".bph-cards-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 5. Kementerian Cards Staggered Wave Animations
      const kemenCards = gsap.utils.toArray<HTMLElement>(".kemen-card-wrapper");

      kemenCards.forEach((card, index) => {
        const isEven = index % 2 === 0;
        const logoBadge = card.querySelector(".kemen-logo-badge");
        const titleText = card.querySelector(".kemen-title-text");
        const categoryBadge = card.querySelector(".kemen-cat-badge");
        const idCards = card.querySelectorAll(".kemen-idcard-anim");
        const staffContainer = card.querySelector(".kemen-staff-wrapper");
        const staffItems = card.querySelectorAll(".kemen-staff-item");

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });

        // Elevated container reveal
        cardTl.fromTo(
          card,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
        );

        // Logo pop in with elastic bounce
        if (logoBadge) {
          cardTl.fromTo(
            logoBadge,
            { scale: 0.5, rotation: isEven ? -15 : 15, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: "back.out(2)" },
            "-=0.45"
          );
        }

        // Title and badge slide
        if (titleText) {
          cardTl.fromTo(
            titleText,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
            "-=0.35"
          );
        }

        if (categoryBadge) {
          cardTl.fromTo(
            categoryBadge,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
            "-=0.3"
          );
        }

        // Menteri / Menko ID Card(s) lanyard drop
        if (idCards.length > 0) {
          cardTl.fromTo(
            idCards,
            {
              opacity: 0,
              y: 40,
              scale: 0.94,
              rotation: (i: number) => (i % 2 === 0 ? -1.5 : 1.5),
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 0.75,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.25"
          );
        }

        // Staff section slide in
        if (staffContainer) {
          cardTl.fromTo(
            staffContainer,
            { opacity: 0, x: 25 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
            "-=0.4"
          );
        }

        // Staff item wave
        if (staffItems.length > 0) {
          cardTl.fromTo(
            staffItems,
            { opacity: 0, y: 15, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              stagger: 0.04,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }
      });
    },
    { scope: containerRef, dependencies: [displayedKementerian] }
  );

  return (
    <div ref={containerRef} className="relative min-h-screen bg-brand-background">
      {/* Top GSAP Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary z-50 transform-gpu origin-left pointer-events-none shadow-xs"
        style={{ transform: "scaleX(0)" }}
      />

      <main className="py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Hero Header Section */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/15 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4 hero-badge font-poppins">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kabinet Laskar Purnama Antasari</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl font-poppins hero-title-line">
              Struktur Organisasi
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed hero-description font-poppins">
              Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin Periode 2026/2027.
              Dedikasi bersinergi dalam integritas, aspirasi, dan kemajuan mahasiswa.
            </p>

            {/* Quick Summary Statistic Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-6 sm:mt-8">
              <div className="stat-pill-item flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs text-xs font-semibold text-neutral-800 font-poppins">
                <ShieldCheck className="w-4 h-4 text-brand-primary" />
                <span>6 Fungsionaris BPH</span>
              </div>
              <div className="stat-pill-item flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs text-xs font-semibold text-neutral-800 font-poppins">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>6 Kemenko</span>
              </div>
              <div className="stat-pill-item flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs text-xs font-semibold text-neutral-800 font-poppins">
                <Building2 className="w-4 h-4 text-brand-primary" />
                <span>11 Kementerian Teknis</span>
              </div>
              <div className="stat-pill-item flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200/80 shadow-2xs text-xs font-semibold text-neutral-800 font-poppins">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>100+ Fungsionaris</span>
              </div>
            </div>
          </div>

          {/* Sticky Interactive Quick-Navigation Filter Bar */}
          <div className="sticky top-16 sm:top-20 z-40 mb-10 sm:mb-14 -mx-2 px-2 flex justify-center">
            <div className="flex items-center gap-1.5 p-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-md max-w-full overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-poppins ${
                  activeTab === "all"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                Semua
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("bagan-section", "bagan")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-poppins flex items-center gap-1.5 ${
                  activeTab === "bagan"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Bagan</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("bph-section", "bph")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-poppins flex items-center gap-1.5 ${
                  activeTab === "bph"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BPH</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("kementerian-section", "kemenko")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-poppins flex items-center gap-1.5 ${
                  activeTab === "kemenko"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Kemenko</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("kementerian-section", "teknis")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-poppins flex items-center gap-1.5 ${
                  activeTab === "teknis"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Kementerian Teknis</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("logo-section", "logo")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap font-poppins flex items-center gap-1.5 ${
                  activeTab === "logo"
                    ? "bg-brand-primary text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Galeri Logo</span>
              </button>
            </div>
          </div>

          {/* Bagan Organisasi Section */}
          <section id="bagan-section" className="mb-14 sm:mb-20 bagan-section-container">
            <BaganOrganisasi />
          </section>

          {/* Badan Pengurus Harian Section */}
          <section id="bph-section" className="mb-16 sm:mb-24">
            <div className="bph-section-header text-center mb-8 sm:mb-12">
              <span className="text-[11px] sm:text-xs font-bold text-brand-primary uppercase tracking-widest block mb-2 font-poppins">
                Jajaran Pimpinan Inti
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
                Badan Pengurus Harian (BPH)
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-poppins">
                Pengarah dan pengendali kebijakan organisasi kabinet periode 2026/2027.
              </p>
            </div>

            <div className="bph-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 pt-2">
              {bphMembers.map((member) => (
                <div key={member.id} className="bph-idcard-anim w-full">
                  <FungsionarisIdCard
                    nama={member.nama}
                    jabatan={member.jabatan}
                    fotoUrl={member.fotoUrl}
                    nim={member.nim}
                    fakultas={member.fakultas}
                    subBranding="BPH DEMA UIN Antasari"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Jajaran Kementerian Section */}
          <section id="kementerian-section" className="mb-16 sm:mb-24">
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-[11px] sm:text-xs font-bold text-brand-primary uppercase tracking-widest block mb-2 font-poppins">
                Struktur Kerja &amp; Pelayanan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
                Jajaran Kementerian
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-poppins">
                Sinergi 17 kementerian koordinator dan teknis fungsionaris Kabinet Laskar Purnama Antasari.
              </p>
            </div>

            <div className="space-y-8 sm:space-y-14">
              {displayedKementerian.map((kemen) => {
                const isCoordinating = kemen.menteri.jabatan === "Menteri Koordinator";
                const coordinators = isCoordinating ? [kemen.menteri, ...kemen.anggota] : [];

                return (
                  <div
                    key={kemen.id}
                    className="kemen-card-wrapper bg-white border border-neutral-100 rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
                  >
                    {/* Top Accent Stripe */}
                    <div
                      className={`absolute top-0 inset-x-0 h-1 ${
                        isCoordinating
                          ? "bg-gradient-to-r from-amber-500 via-brand-secondary to-amber-600"
                          : "bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"
                      }`}
                    />

                    {/* Ministry Card Header */}
                    <div className="border-b border-neutral-100 pb-4 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`kemen-logo-badge w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                            isCoordinating
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-700"
                              : "bg-brand-primary/10 border-brand-primary/15 text-brand-primary"
                          }`}
                        >
                          <MinistryLogo
                            kementerianId={kemen.id}
                            className={`w-6 h-6 ${
                              isCoordinating ? "text-amber-700" : "text-brand-primary"
                            }`}
                          />
                        </div>

                        <div className="kemen-title-text min-w-0">
                          <h3 className="text-base sm:text-xl font-bold text-neutral-900 font-poppins tracking-tight">
                            {kemen.nama}
                          </h3>
                          <span className="text-[11px] text-neutral-500 font-poppins block">
                            {isCoordinating
                              ? "Kementerian Koordinator Bidang"
                              : "Kementerian Teknis Pelaksana"}
                          </span>
                        </div>
                      </div>

                      <div className="kemen-cat-badge flex items-center gap-2 self-start sm:self-auto">
                        {isCoordinating ? (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80 font-poppins">
                            Kemenko
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-primary bg-brand-primary/5 px-3 py-1 rounded-full border border-brand-primary/10 font-poppins">
                            Kementerian Teknis
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full hidden md:inline-block font-poppins">
                          2026/2027
                        </span>
                      </div>
                    </div>

                    {isCoordinating ? (
                      /* Coordinating Ministry: Uniform ID Card Grid for all coordinators */
                      <div
                        className={
                          coordinators.length <= 2
                            ? "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-6 sm:gap-8 pt-2"
                            : coordinators.length === 3
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-6 sm:gap-8 pt-2"
                            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2"
                        }
                      >
                        {coordinators.map((coord) => (
                          <div key={coord.id} className="kemen-idcard-anim w-full">
                            <FungsionarisIdCard
                              nama={coord.nama}
                              jabatan={coord.jabatan}
                              fotoUrl={coord.fotoUrl}
                              nim={coord.nim}
                              fakultas={coord.fakultas}
                              kementerianId={kemen.id}
                              subBranding={kemen.nama}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Regular Ministry: Menteri ID Card on Left + Staff List on Right */
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Menteri ID Card */}
                        <div className="lg:col-span-1 flex justify-center pt-2 kemen-idcard-anim">
                          <FungsionarisIdCard
                            nama={kemen.menteri.nama}
                            jabatan={kemen.menteri.jabatan}
                            fotoUrl={kemen.menteri.fotoUrl}
                            nim={kemen.menteri.nim}
                            fakultas={kemen.menteri.fakultas}
                            kementerianId={kemen.id}
                            subBranding={kemen.nama}
                          />
                        </div>

                        {/* Staff List (Preserved Original Clean Layout) */}
                        <div className="lg:col-span-2 kemen-staff-wrapper">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block font-poppins">
                              Sekretaris &amp; Staf Kementerian:
                            </span>
                            <span className="text-[11px] font-semibold text-neutral-400 font-poppins">
                              {(kemen.sekretaris ? 1 : 0) + kemen.anggota.length} Anggota
                            </span>
                          </div>

                          {kemen.sekretaris || kemen.anggota.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {kemen.sekretaris && (
                                <div className="kemen-staff-item flex items-center gap-3.5 p-3.5 border border-brand-primary/15 rounded-2xl bg-brand-background/40 hover:border-brand-primary/30 transition-colors">
                                  {renderAvatar(
                                    kemen.sekretaris.fotoUrl,
                                    kemen.sekretaris.nama,
                                    "circle-sm"
                                  )}
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-neutral-900 truncate font-poppins">
                                      {kemen.sekretaris.nama}
                                    </h5>
                                    {kemen.sekretaris.nim && (
                                      <span className="text-[9px] text-neutral-400 block font-poppins">
                                        NIM. {kemen.sekretaris.nim}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-brand-primary font-semibold block mt-0.5 font-poppins">
                                      {kemen.sekretaris.jabatan}
                                    </span>
                                    {kemen.sekretaris.fakultas && (
                                      <span className="text-[9px] text-neutral-500 block truncate font-poppins font-light">
                                        {kemen.sekretaris.fakultas}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {kemen.anggota.map((staf) => (
                                <div
                                  key={staf.id}
                                  className="kemen-staff-item flex items-center gap-3.5 p-3.5 border border-neutral-100 rounded-2xl bg-brand-background/25 hover:border-neutral-200 transition-colors"
                                >
                                  {renderAvatar(staf.fotoUrl, staf.nama, "circle-sm")}
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-semibold text-neutral-900 truncate font-poppins">
                                      {staf.nama}
                                    </h5>
                                    {staf.nim && (
                                      <span className="text-[9px] text-neutral-400 block font-poppins">
                                        NIM. {staf.nim}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-neutral-500 font-medium block mt-0.5 font-poppins">
                                      {staf.jabatan}
                                    </span>
                                    {staf.fakultas && (
                                      <span className="text-[9px] text-neutral-500 block truncate font-poppins font-light">
                                        {staf.fakultas}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-400 italic font-poppins p-4 border border-dashed border-neutral-200 rounded-xl text-center">
                              Belum ada anggota terdaftar.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Galeri Logo Kementerian Adaptif */}
          <section id="logo-section" className="logo-showcase-container">
            <MinistryLogoShowcase />
          </section>
        </div>
      </main>
    </div>
  );
}
