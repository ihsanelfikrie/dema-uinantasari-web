"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
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
  Eye,
  X,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type FilterTab = "all" | "bagan" | "bph" | "kemenko" | "teknis" | "logo";

interface SelectedFungsionaris {
  nama: string;
  jabatan: string;
  fotoUrl: string;
  nim?: string;
  fakultas?: string;
  kementerianId?: string;
  subBranding?: string;
}

export default function StrukturClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedFungsionaris, setSelectedFungsionaris] = useState<SelectedFungsionaris | null>(null);

  // Close modal on Escape key & lock body scroll
  useEffect(() => {
    if (!selectedFungsionaris) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedFungsionaris(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedFungsionaris]);

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
    size: "circle-xs" | "circle-sm" | "circle-md" = "circle-sm"
  ) => {
    const sizeWrapperClass =
      size === "circle-xs"
        ? "h-7 w-7"
        : size === "circle-md"
        ? "h-12 w-12"
        : "h-9 w-9 sm:h-10 sm:w-10";

    const iconSizeClass =
      size === "circle-xs" ? "h-3.5 w-3.5" : size === "circle-md" ? "h-6 w-6" : "h-5 w-5";

    if (fotoUrl && fotoUrl.trim() !== "" && fotoUrl !== "/images/kabinet/placeholder.png") {
      return (
        <div className={`${sizeWrapperClass} shrink-0 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shadow-2xs`}>
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
      <div className={`${sizeWrapperClass} shrink-0 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200`}>
        <svg
          className={`${iconSizeClass} stroke-[1.2]`}
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

            <div className="bph-cards-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-8 pt-2">
              {bphMembers.map((member) => (
                <div key={member.id} className="bph-idcard-anim w-full">
                  {/* Mobile Compact Card */}
                  <div
                    onClick={() =>
                      setSelectedFungsionaris({
                        nama: member.nama,
                        jabatan: member.jabatan,
                        fotoUrl: member.fotoUrl,
                        nim: member.nim,
                        fakultas: member.fakultas,
                        subBranding: "BPH DEMA UIN Antasari",
                      })
                    }
                    className="sm:hidden group/bph flex flex-col justify-between bg-white dark:bg-[#140606] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-2 sm:p-2.5 shadow-xs hover:border-brand-primary/40 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer h-full"
                  >
                    <div>
                      {/* Top ID Card Notch & Badge */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded font-poppins">
                          BPH
                        </span>
                        <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover/bph:text-brand-primary transition-colors">
                          <Eye className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Photo */}
                      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 mb-2">
                        {member.fotoUrl && member.fotoUrl.trim() !== "" ? (
                          <img
                            src={member.fotoUrl}
                            alt={member.nama}
                            className="w-full h-full object-cover object-top group-hover/bph:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Name & Role */}
                      <h3 className="text-[11px] font-black uppercase text-brand-primary line-clamp-2 leading-tight font-poppins min-h-[26px]">
                        {member.nama}
                      </h3>
                      <p className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 line-clamp-1 leading-tight font-poppins mt-0.5">
                        {member.jabatan}
                      </p>
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-400 font-poppins">
                      <span className="truncate">{member.fakultas || "UIN Antasari"}</span>
                      <span className="text-brand-primary font-bold">Detail ↗</span>
                    </div>
                  </div>

                  {/* Desktop Full ID Card */}
                  <div className="hidden sm:block">
                    <FungsionarisIdCard
                      nama={member.nama}
                      jabatan={member.jabatan}
                      fotoUrl={member.fotoUrl}
                      nim={member.nim}
                      fakultas={member.fakultas}
                      subBranding="BPH DEMA UIN Antasari"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Jajaran Kementerian Section */}
          <section id="kementerian-section" className="mb-12 sm:mb-24">
            <div className="text-center mb-6 sm:mb-14">
              <span className="text-[11px] sm:text-xs font-bold text-brand-primary uppercase tracking-widest block mb-1.5 font-poppins">
                Struktur Kerja &amp; Pelayanan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-poppins tracking-tight">
                Jajaran Kementerian
              </h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-poppins">
                Sinergi 17 kementerian koordinator dan teknis fungsionaris Kabinet Laskar Purnama Antasari.
              </p>
            </div>

            {/* Mobile Quick Ministry Jump Dropdown */}
            <div className="sm:hidden mb-5">
              <div className="relative">
                <select
                  aria-label="Pilih Kementerian"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 font-poppins shadow-xs appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  onChange={(e) => {
                    if (e.target.value) {
                      const el = document.getElementById(e.target.value);
                      if (el) {
                        const offset = 80;
                        const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({ top: pos, behavior: "smooth" });
                      }
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    ⚡ Lompat Langsung ke Kementerian...
                  </option>
                  <optgroup label="Kementerian Koordinator (Kemenko)">
                    {kemenkoList.map((k) => (
                      <option key={k.id} value={`kemen-${k.id}`}>
                        {k.nama}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Kementerian Teknis Pelaksana">
                    {kemenTeknisList.map((k) => (
                      <option key={k.id} value={`kemen-${k.id}`}>
                        {k.nama}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-14">
              {displayedKementerian.map((kemen) => {
                const isCoordinating = kemen.menteri.jabatan === "Menteri Koordinator";
                const coordinators = isCoordinating ? [kemen.menteri, ...kemen.anggota] : [];

                return (
                  <div
                    key={kemen.id}
                    id={`kemen-${kemen.id}`}
                    className="kemen-card-wrapper bg-white dark:bg-[#140606] border border-neutral-100 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-xs hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
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
                    <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 sm:pb-4 mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`kemen-logo-badge w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border ${
                            isCoordinating
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-700"
                              : "bg-brand-primary/10 border-brand-primary/15 text-brand-primary"
                          }`}
                        >
                          <MinistryLogo
                            kementerianId={kemen.id}
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${
                              isCoordinating ? "text-amber-700" : "text-brand-primary"
                            }`}
                          />
                        </div>

                        <div className="kemen-title-text min-w-0">
                          <h3 className="text-sm sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 font-poppins tracking-tight">
                            {kemen.nama}
                          </h3>
                          <span className="text-[10px] sm:text-[11px] text-neutral-500 font-poppins block">
                            {isCoordinating
                              ? "Kementerian Koordinator Bidang"
                              : "Kementerian Teknis Pelaksana"}
                          </span>
                        </div>
                      </div>

                      <div className="kemen-cat-badge flex items-center gap-2 self-start sm:self-auto">
                        {isCoordinating ? (
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 dark:bg-amber-950/40 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-amber-200/80 dark:border-amber-900/40 font-poppins">
                            Kemenko
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-brand-primary bg-brand-primary/5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-brand-primary/10 font-poppins">
                            Teknis
                          </span>
                        )}
                        <span className="text-[9px] sm:text-[10px] font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full font-poppins">
                          {(isCoordinating ? coordinators.length : (kemen.sekretaris ? 1 : 0) + kemen.anggota.length + 1)} Personil
                        </span>
                      </div>
                    </div>

                    {isCoordinating ? (
                      /* Coordinating Ministry */
                      <>
                        {/* Desktop View */}
                        <div
                          className={`hidden sm:grid ${
                            coordinators.length <= 2
                              ? "sm:grid-cols-2 max-w-2xl mx-auto gap-6 sm:gap-8 pt-2"
                              : coordinators.length === 3
                              ? "sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-6 sm:gap-8 pt-2"
                              : "sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2"
                          }`}
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

                        {/* Mobile 2-Column Compact Grid for Coordinators */}
                        <div className="sm:hidden grid grid-cols-2 gap-2 pt-1">
                          {coordinators.map((coord) => (
                            <div
                              key={coord.id}
                              onClick={() =>
                                setSelectedFungsionaris({
                                  nama: coord.nama,
                                  jabatan: coord.jabatan,
                                  fotoUrl: coord.fotoUrl,
                                  nim: coord.nim,
                                  fakultas: coord.fakultas,
                                  kementerianId: kemen.id,
                                  subBranding: kemen.nama,
                                })
                              }
                              className="group/coord flex flex-col justify-between bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer h-full"
                            >
                              <div>
                                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-amber-300/60 dark:border-amber-800 mb-1.5">
                                  {coord.fotoUrl && coord.fotoUrl.trim() !== "" ? (
                                    <img
                                      src={coord.fotoUrl}
                                      alt={coord.nama}
                                      className="w-full h-full object-cover object-top"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-amber-700">
                                      <Users className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <span className="text-[8px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 px-1.5 py-0.5 rounded font-poppins inline-block mb-1">
                                  {coord.jabatan}
                                </span>
                                <h4 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-tight font-poppins min-h-[26px]">
                                  {coord.nama}
                                </h4>
                              </div>
                              <div className="pt-1.5 mt-1 border-t border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-[9px] text-amber-700 dark:text-amber-400 font-poppins">
                                <span className="truncate">{coord.fakultas || "Koordinator"}</span>
                                <span className="font-bold">ID Card ↗</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* Regular Ministry */
                      <>
                        {/* Desktop View (Original layout) */}
                        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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

                          {/* Staff List */}
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
                                  <div
                                    onClick={() =>
                                      setSelectedFungsionaris({
                                        nama: kemen.sekretaris!.nama,
                                        jabatan: kemen.sekretaris!.jabatan,
                                        fotoUrl: kemen.sekretaris!.fotoUrl,
                                        nim: kemen.sekretaris!.nim,
                                        fakultas: kemen.sekretaris!.fakultas,
                                        kementerianId: kemen.id,
                                        subBranding: kemen.nama,
                                      })
                                    }
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setSelectedFungsionaris({
                                          nama: kemen.sekretaris!.nama,
                                          jabatan: kemen.sekretaris!.jabatan,
                                          fotoUrl: kemen.sekretaris!.fotoUrl,
                                          nim: kemen.sekretaris!.nim,
                                          fakultas: kemen.sekretaris!.fakultas,
                                          kementerianId: kemen.id,
                                          subBranding: kemen.nama,
                                        });
                                      }
                                    }}
                                    className="kemen-staff-item group/staff flex items-center justify-between gap-3.5 p-3.5 border border-brand-primary/15 rounded-2xl bg-brand-background/40 hover:bg-white hover:border-brand-primary/40 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer"
                                    title={`Klik untuk melihat ID Card ${kemen.sekretaris.nama}`}
                                  >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      <div className="relative shrink-0">
                                        {renderAvatar(
                                          kemen.sekretaris.fotoUrl,
                                          kemen.sekretaris.nama,
                                          "circle-sm"
                                        )}
                                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-primary text-white flex items-center justify-center text-[8px] opacity-0 group-hover/staff:opacity-100 transition-opacity shadow-xs">
                                          <Eye className="w-2.5 h-2.5" />
                                        </span>
                                      </div>
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-bold text-neutral-900 truncate font-poppins group-hover/staff:text-brand-primary transition-colors">
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

                                    <div className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-neutral-400 group-hover/staff:text-brand-primary transition-colors pr-1">
                                      <span className="hidden sm:inline text-[9px] font-poppins">ID Card</span>
                                      <Eye className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                )}

                                {kemen.anggota.map((staf) => (
                                  <div
                                    key={staf.id}
                                    onClick={() =>
                                      setSelectedFungsionaris({
                                        nama: staf.nama,
                                        jabatan: staf.jabatan,
                                        fotoUrl: staf.fotoUrl,
                                        nim: staf.nim,
                                        fakultas: staf.fakultas,
                                        kementerianId: kemen.id,
                                        subBranding: kemen.nama,
                                      })
                                    }
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setSelectedFungsionaris({
                                          nama: staf.nama,
                                          jabatan: staf.jabatan,
                                          fotoUrl: staf.fotoUrl,
                                          nim: staf.nim,
                                          fakultas: staf.fakultas,
                                          kementerianId: kemen.id,
                                          subBranding: kemen.nama,
                                        });
                                      }
                                    }}
                                    className="kemen-staff-item group/staff flex items-center justify-between gap-3.5 p-3.5 border border-neutral-100 rounded-2xl bg-brand-background/25 hover:bg-white hover:border-brand-primary/30 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer"
                                    title={`Klik untuk melihat ID Card ${staf.nama}`}
                                  >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      <div className="relative shrink-0">
                                        {renderAvatar(staf.fotoUrl, staf.nama, "circle-sm")}
                                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-primary text-white flex items-center justify-center text-[8px] opacity-0 group-hover/staff:opacity-100 transition-opacity shadow-xs">
                                          <Eye className="w-2.5 h-2.5" />
                                        </span>
                                      </div>
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-semibold text-neutral-900 truncate font-poppins group-hover/staff:text-brand-primary transition-colors">
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

                                    <div className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-neutral-400 group-hover/staff:text-brand-primary transition-colors pr-1">
                                      <span className="hidden sm:inline text-[9px] font-poppins">ID Card</span>
                                      <Eye className="w-3.5 h-3.5" />
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

                        {/* Mobile Compact View (< lg screens) */}
                        <div className="lg:hidden space-y-3">
                          {/* Menteri Compact Horizontal Hero Card */}
                          <div
                            onClick={() =>
                              setSelectedFungsionaris({
                                nama: kemen.menteri.nama,
                                jabatan: kemen.menteri.jabatan,
                                fotoUrl: kemen.menteri.fotoUrl,
                                nim: kemen.menteri.nim,
                                fakultas: kemen.menteri.fakultas,
                                kementerianId: kemen.id,
                                subBranding: kemen.nama,
                              })
                            }
                            className="flex items-center gap-3 p-2.5 bg-brand-background/60 dark:bg-neutral-900/60 border border-brand-primary/20 dark:border-brand-primary/30 rounded-2xl active:scale-[0.99] transition-all cursor-pointer shadow-2xs hover:bg-white dark:hover:bg-neutral-800"
                          >
                            <div className="relative w-14 h-[72px] shrink-0 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-brand-primary/25 shadow-2xs">
                              {kemen.menteri.fotoUrl && kemen.menteri.fotoUrl.trim() !== "" ? (
                                <img
                                  src={kemen.menteri.fotoUrl}
                                  alt={kemen.menteri.nama}
                                  className="w-full h-full object-cover object-top"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                  <Users className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full inline-block font-poppins mb-1">
                                {kemen.menteri.jabatan}
                              </span>
                              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate font-poppins">
                                {kemen.menteri.nama}
                              </h4>
                              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-poppins">
                                {kemen.menteri.nim ? `NIM. ${kemen.menteri.nim}` : kemen.menteri.fakultas || "Fungsionaris"}
                              </span>
                            </div>
                            <div className="shrink-0 p-1.5 rounded-full bg-white dark:bg-neutral-800 text-brand-primary border border-brand-primary/15 shadow-2xs">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Sekretaris & Staf: 2-Column Compact Grid on Mobile */}
                          {kemen.sekretaris || kemen.anggota.length > 0 ? (
                            <div>
                              <div className="flex items-center justify-between mb-1.5 px-0.5">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-poppins">
                                  Sekretaris &amp; Staf ({(kemen.sekretaris ? 1 : 0) + kemen.anggota.length})
                                </span>
                                <span className="text-[9px] text-neutral-400 font-poppins">Ketuk untuk ID Card</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {kemen.sekretaris && (
                                  <div
                                    onClick={() =>
                                      setSelectedFungsionaris({
                                        nama: kemen.sekretaris!.nama,
                                        jabatan: kemen.sekretaris!.jabatan,
                                        fotoUrl: kemen.sekretaris!.fotoUrl,
                                        nim: kemen.sekretaris!.nim,
                                        fakultas: kemen.sekretaris!.fakultas,
                                        kementerianId: kemen.id,
                                        subBranding: kemen.nama,
                                      })
                                    }
                                    className="flex items-center gap-2 p-2 border border-brand-primary/20 rounded-xl bg-brand-background/40 hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
                                  >
                                    {renderAvatar(kemen.sekretaris.fotoUrl, kemen.sekretaris.nama, "circle-xs")}
                                    <div className="min-w-0 flex-1">
                                      <span className="text-[9px] font-bold text-brand-primary block truncate font-poppins">
                                        {kemen.sekretaris.jabatan}
                                      </span>
                                      <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 block truncate font-poppins">
                                        {kemen.sekretaris.nama}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                {kemen.anggota.map((staf) => (
                                  <div
                                    key={staf.id}
                                    onClick={() =>
                                      setSelectedFungsionaris({
                                        nama: staf.nama,
                                        jabatan: staf.jabatan,
                                        fotoUrl: staf.fotoUrl,
                                        nim: staf.nim,
                                        fakultas: staf.fakultas,
                                        kementerianId: kemen.id,
                                        subBranding: kemen.nama,
                                      })
                                    }
                                    className="flex items-center gap-2 p-2 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 hover:border-brand-primary/20 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
                                  >
                                    {renderAvatar(staf.fotoUrl, staf.nama, "circle-xs")}
                                    <div className="min-w-0 flex-1">
                                      <span className="text-[9px] font-semibold text-neutral-500 block truncate font-poppins">
                                        {staf.jabatan}
                                      </span>
                                      <span className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 block truncate font-poppins">
                                        {staf.nama}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </>
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

      {/* Pop-up Modal ID Card Fungsionaris */}
      {selectedFungsionaris && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedFungsionaris(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-sm w-full mx-auto flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Close Button */}
            <div className="w-full flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setSelectedFungsionaris(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer font-poppins shadow-lg"
                aria-label="Tutup ID Card"
              >
                <span>Tutup</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* The Full ID Card */}
            <FungsionarisIdCard
              nama={selectedFungsionaris.nama}
              jabatan={selectedFungsionaris.jabatan}
              fotoUrl={selectedFungsionaris.fotoUrl}
              nim={selectedFungsionaris.nim}
              fakultas={selectedFungsionaris.fakultas}
              kementerianId={selectedFungsionaris.kementerianId}
              subBranding={selectedFungsionaris.subBranding}
              className="shadow-2xl"
            />

            {/* Dismissal Instruction Hint */}
            <p className="mt-3 text-[11px] text-white/70 font-poppins text-center">
              Klik di luar kartu atau tekan <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] text-white font-mono">ESC</kbd> untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
