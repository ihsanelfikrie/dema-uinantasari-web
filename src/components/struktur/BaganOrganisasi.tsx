"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { bph, kementerianList, Fungsionaris } from "@/data/struktur";
import {
  Crown,
  ShieldCheck,
  Layers,
  LayoutGrid,
  ListOrdered,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Briefcase,
  Building2,
  Users,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  Scale,
  Network,
  ArrowRight,
  ExternalLink,
  ArrowDown,
} from "lucide-react";

// ──────────────────────────────────────────────────────────
// 6 KEMENKO PILLARS CONFIGURATION
// ──────────────────────────────────────────────────────────
export const kemenkoMap: Record<string, string[]> = {
  kemenspi: ["kemenkvd"],
  kemenkoma: ["kemenpora", "kemenekraf", "kemenpendikbud"],
  "kemenko-sos": ["kemensosmas", "kemenagama", "kemenlh"],
  "kemenko-ap": ["kemenaksi", "kemenkis"],
  "kemenko-phk": ["kemenppp", "kemenadvokasi"],
  "kemenko-mitra": ["kemendagri", "kemenlu"],
};

export const kemenkoMeta: Record<
  string,
  {
    label: string;
    shortLabel: string;
    badge: string;
    desc: string;
    acronym: string;
    icon: typeof ShieldCheck;
  }
> = {
  kemenspi: {
    label: "Kemenko Satuan Pengawas Internal",
    shortLabel: "SPI & Digital",
    badge: "Pengawasan & Media",
    desc: "Supervisi mutu internal, tata kelola kinerja, serta infrastruktur komunikasi visual dan digital kabinet.",
    acronym: "SPI",
    icon: ShieldCheck,
  },
  kemenkoma: {
    label: "Kemenko Kemahasiswaan",
    shortLabel: "Kemahasiswaan",
    badge: "Minat, Bakat & Budaya",
    desc: "Pengembangan potensi kepemudaan, keolahragaan, inkubasi ekonomi kreatif, dan pengembangan budaya akademis.",
    acronym: "KOMA",
    icon: GraduationCap,
  },
  "kemenko-sos": {
    label: "Kemenko Kemasyarakatan",
    shortLabel: "Kemasyarakatan",
    badge: "Sosial & Lingkungan",
    desc: "Pengabdian masyarakat banua, syiar keagamaan Islam, dan pelestarian kelestarian lingkungan hidup.",
    acronym: "SOS",
    icon: HeartHandshake,
  },
  "kemenko-ap": {
    label: "Kemenko Analisis & Pergerakan",
    shortLabel: "Analisis & Aksi",
    badge: "Pergerakan & Riset",
    desc: "Eskalasi isu kemahasiswaan, riset strategis kajian publik, serta mobilisasi pergerakan mahasiswa.",
    acronym: "AKPRO",
    icon: Megaphone,
  },
  "kemenko-phk": {
    label: "Kemenko Politik Hukum & Keamanan",
    shortLabel: "Polhukam & Advokasi",
    badge: "Advokasi & Hak",
    desc: "Kesejahteraan hak mahasiswa, ruang aman P3 perempuan, dan pendampingan bantuan hukum berkeadilan.",
    acronym: "POLHUKAM",
    icon: Scale,
  },
  "kemenko-mitra": {
    label: "Kemenko Kemitraan",
    shortLabel: "Kemitraan",
    badge: "Diplomasi & Relasi",
    desc: "Konsolidasi organisasi mahasiswa internal dan relasi diplomasi strategis eksternal se-Kalsel & Nasional.",
    acronym: "MITRA",
    icon: Network,
  },
};

const kemenAcronyms: Record<string, string> = {
  kemenkvd: "KOMVIGI",
  kemenpora: "PORA",
  kemenekraf: "EKRAF",
  kemenpendikbud: "PENDIKBUD",
  kemensosmas: "SOSMAS",
  kemenagama: "AGAMA",
  kemenlh: "LH",
  kemenaksi: "AKPRO",
  kemenkis: "KIS",
  kemenppp: "PPP",
  kemenadvokasi: "ADVOKASI",
  kemendagri: "DAGRI",
  kemenlu: "LUGRI",
};

const getKemenById = (id: string) => kementerianList.find((k) => k.id === id);

const getShortKemenName = (nama: string) => {
  return nama
    .replace(/^Kementerian\s+/i, "")
    .replace("Komunikasi Visual dan Digital", "Komunikasi Visual & Digital")
    .replace("Perlindungan dan Pemberdayaan Perempuan", "Perlindungan Perempuan")
    .replace("Advokasi, Hukum dan Hak Asasi Manusia", "Advokasi & HAM")
    .replace("Kajian Isu Strategis", "Kajian Isu Strategis")
    .replace("Sosial Masyarakat", "Sosial Masyarakat")
    .replace("Lingkungan Hidup", "Lingkungan Hidup")
    .replace("Aksi dan Propaganda", "Aksi & Propaganda")
    .replace("Dalam Negeri", "Dalam Negeri")
    .replace("Luar Negeri", "Luar Negeri");
};

// Mini Avatar Component
function AvatarThumb({
  fotoUrl,
  nama,
  size = "md",
}: {
  fotoUrl?: string;
  nama: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 sm:w-9 sm:h-9 text-xs",
    lg: "w-20 h-20 text-xl",
  };

  if (fotoUrl && fotoUrl.trim() !== "" && fotoUrl !== "/images/kabinet/placeholder.png") {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-neutral-100 border border-neutral-200/90 shrink-0 shadow-2xs`}
      >
        <img
          src={fotoUrl}
          alt={nama}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>
    );
  }

  const initials = nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold font-poppins flex items-center justify-center border border-neutral-200/80 dark:border-neutral-700 shrink-0 shadow-2xs`}
    >
      {initials || "D"}
    </div>
  );
}

// Tree Node Card Component
function TreeNode({
  fungsionaris,
  tag,
  subTag,
  tier = "kementerian",
  onClick,
  isHighlighted = false,
  isDimmed = false,
  customBadge,
}: {
  fungsionaris: Fungsionaris;
  tag?: string;
  subTag?: string;
  tier?: "presidium" | "bph" | "kemenko" | "kementerian";
  onClick: () => void;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  customBadge?: string;
}) {
  const tierStyles = {
    presidium:
      "bg-gradient-to-br from-[#7a0606] via-[#990808] to-[#600505] text-white border-amber-400/50 hover:border-amber-400 shadow-md hover:shadow-lg",
    bph: "bg-white dark:bg-[#180606] text-neutral-900 dark:text-neutral-100 border-neutral-200/90 dark:border-neutral-800 hover:border-brand-primary/60 shadow-2xs hover:shadow-sm",
    kemenko:
      "bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-[#241505] dark:via-[#180606] dark:to-[#1a0808] text-neutral-900 dark:text-neutral-100 border-amber-300/80 dark:border-amber-800/60 hover:border-amber-500 shadow-2xs hover:shadow-sm",
    kementerian:
      "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200/80 dark:border-neutral-800 hover:border-brand-primary/60 shadow-2xs hover:shadow-sm",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-2.5 sm:p-3 text-left transition-all duration-300 cursor-pointer relative select-none hover:-translate-y-0.5 ${
        tierStyles[tier]
      } ${
        isHighlighted
          ? "ring-2 ring-brand-primary ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 scale-[1.02] shadow-md z-10"
          : isDimmed
          ? "opacity-35 hover:opacity-100"
          : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <AvatarThumb fotoUrl={fungsionaris.fotoUrl} nama={fungsionaris.nama} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            {tag && (
              <span
                className={`block text-[9px] font-bold uppercase tracking-wider font-poppins truncate ${
                  tier === "presidium"
                    ? "text-amber-200"
                    : tier === "kemenko"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-brand-primary dark:text-brand-accent"
                }`}
              >
                {tag}
              </span>
            )}
            {customBadge && (
              <span
                className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono shrink-0 ${
                  tier === "presidium"
                    ? "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                }`}
              >
                {customBadge}
              </span>
            )}
          </div>
          <span
            className={`block text-xs sm:text-[13px] font-bold font-poppins truncate leading-snug ${
              tier === "presidium" ? "text-white" : "text-neutral-900 dark:text-white"
            }`}
          >
            {fungsionaris.nama}
          </span>
          <span
            className={`block text-[10px] font-medium font-poppins truncate mt-0.5 ${
              tier === "presidium" ? "text-white/80" : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            {subTag || fungsionaris.jabatan}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function BaganOrganisasi() {
  const [selected, setSelected] = useState<{
    fungsionaris: Fungsionaris;
    tierLabel: string;
    kemenId?: string;
  } | null>(null);

  const [viewMode, setViewMode] = useState<"tree" | "pillars" | "tiers">("tree");
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Zoom controls
  const zoomIn = () => setZoom((prev) => Math.min(Number((prev + 0.15).toFixed(2)), 1.3));
  const zoomOut = () => setZoom((prev) => Math.max(Number((prev - 0.15).toFixed(2)), 0.7));
  const resetZoom = () => {
    setZoom(1);
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: Math.max(0, (scrollWidth - clientWidth) / 2),
        behavior: "smooth",
      });
    }
  };

  // Center tree on initial render or viewMode change
  useEffect(() => {
    if (viewMode === "tree" && scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      scrollRef.current.scrollLeft = Math.max(0, (scrollWidth - clientWidth) / 2);
    }
  }, [viewMode]);

  // All 6 Kemenko objects from kementerianList
  const kemenkos = useMemo(
    () => kementerianList.filter((k) => Object.keys(kemenkoMap).includes(k.id)),
    []
  );

  // Search filter matches
  const searchResultsCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase();
    let count = 0;

    // Check BPH
    const bphList = [
      bph.ketua,
      bph.wakilKetua,
      bph.sekjen,
      bph.wakilSekjen,
      bph.sekkab,
      bph.bendum,
    ];
    count += bphList.filter(
      (m) =>
        m.nama.toLowerCase().includes(q) ||
        m.jabatan.toLowerCase().includes(q) ||
        (m.nim && m.nim.includes(q))
    ).length;

    // Check Kementerian
    kementerianList.forEach((k) => {
      if (
        k.nama.toLowerCase().includes(q) ||
        k.menteri.nama.toLowerCase().includes(q) ||
        k.menteri.jabatan.toLowerCase().includes(q)
      ) {
        count += 1;
      }
    });

    return count;
  }, [searchQuery]);

  const isMatch = (name: string, title?: string, nim?: string, extra?: string): boolean => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return Boolean(
      name.toLowerCase().includes(q) ||
      (title && title.toLowerCase().includes(q)) ||
      (nim && nim.includes(q)) ||
      (extra && extra.toLowerCase().includes(q))
    );
  };

  // Smooth scroll to ministry section on page
  const scrollToMinistryOnPage = (kemenId: string) => {
    setSelected(null);
    const element = document.getElementById(`kemen-${kemenId}`);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Smooth scroll to BPH section on page
  const scrollToBphOnPage = () => {
    setSelected(null);
    const element = document.getElementById("bph-section");
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full py-6 sm:py-8 px-3.5 sm:px-7 bg-white dark:bg-[#140606] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl shadow-sm mb-12">
      {/* ────────────────────────────────────────────────────────── */}
      {/* HEADER & CONTROL DASHBOARD                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider font-poppins mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>Peta Hierarki Kabinet</span>
            <span className="w-1 h-1 rounded-full bg-brand-primary/40" />
            <span>2026/2027</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-poppins">
            Tata Kelola &amp; Garis Koordinasi Kabinet
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-poppins max-w-xl">
            Silsilah struktur komando Dewan Eksekutif Mahasiswa. Klik fungsionaris untuk membuka uraian Tupoksi resmi.
          </p>
        </div>

        {/* View Mode Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-stretch lg:self-end">
          {/* Quick Search Input */}
          <div className="relative min-w-[210px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama / kementerian..."
              className="w-full pl-8 pr-7 py-2 bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/70 dark:border-neutral-800 rounded-xl text-xs font-poppins text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-850 rounded-xl border border-neutral-200/70 dark:border-neutral-800 text-xs font-semibold font-poppins">
            <button
              type="button"
              onClick={() => setViewMode("tree")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "tree"
                  ? "bg-white dark:bg-neutral-900 text-brand-primary shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bagan Visual</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("pillars")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "pillars"
                  ? "bg-white dark:bg-neutral-900 text-brand-primary shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>6 Pilar Sektoral</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("tiers")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === "tiers"
                  ? "bg-white dark:bg-neutral-900 text-brand-primary shadow-xs font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Hierarki Bertingkat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Result Feedback Bar */}
      {searchQuery.trim() !== "" && (
        <div className="mt-3 py-2 px-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs font-poppins text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              Menemukan <strong>{searchResultsCount}</strong> entri cocok untuk kata kunci: &quot;{searchQuery}&quot;
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-[11px] underline font-semibold cursor-pointer text-amber-800 dark:text-amber-300"
          >
            Hapus filter
          </button>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 1: VISUAL FLOW TREE CANVAS                            */}
      {/* ────────────────────────────────────────────────────────── */}
      {viewMode === "tree" && (
        <div className="pt-4">
          {/* Branch Spotlight Filter Pills & Zoom Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 mr-1 font-poppins">
                Sorot Cabang:
              </span>
              <button
                type="button"
                onClick={() => setActiveBranch(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium font-poppins transition-colors cursor-pointer ${
                  activeBranch === null
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                }`}
              >
                Semua Cabang
              </button>
              {kemenkos.map((kemenko) => {
                const meta = kemenkoMeta[kemenko.id];
                const isActive = activeBranch === kemenko.id;
                return (
                  <button
                    key={kemenko.id}
                    type="button"
                    onClick={() => setActiveBranch(isActive ? null : kemenko.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium font-poppins transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? "bg-brand-primary text-white font-bold shadow-2xs"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <span>{meta?.shortLabel || kemenko.nama}</span>
                  </button>
                );
              })}
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-1 text-xs font-poppins text-neutral-600">
              <button
                type="button"
                onClick={zoomOut}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Perkecil bagan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] font-semibold px-1.5 min-w-[38px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={zoomIn}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Perbesar bagan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 hover:text-brand-primary transition-colors cursor-pointer border-l border-neutral-200 dark:border-neutral-800"
                title="Reset zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Tree Scroll Viewport */}
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto scroll-smooth py-4 pb-10 scrollbar-thin select-none relative"
          >
            <div
              className="min-w-[1360px] mx-auto px-6 transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* ── TIER 1: PRESIDIUM PIMPINAN (Ketua & Wakil) ── */}
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-[#990808]/15 to-amber-500/15 border border-amber-500/30 text-neutral-900 dark:text-neutral-100 text-[10px] font-bold uppercase tracking-wider mb-3 font-poppins">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tingkat I — Presidium Pimpinan Umum</span>
                </div>

                <div className="flex justify-center items-center gap-5">
                  <div className="w-72">
                    <TreeNode
                      fungsionaris={bph.ketua}
                      tag="Ketua Umum DEMA"
                      subTag="Mandataris Kongres Mahasiswa"
                      customBadge="PRESIDIUM"
                      tier="presidium"
                      isHighlighted={isMatch(bph.ketua.nama, bph.ketua.jabatan, bph.ketua.nim)}
                      onClick={() =>
                        setSelected({
                          fungsionaris: bph.ketua,
                          tierLabel: "Tingkat I • Presidium Pimpinan Umum",
                        })
                      }
                    />
                  </div>
                  <div className="w-72">
                    <TreeNode
                      fungsionaris={bph.wakilKetua}
                      tag="Wakil Ketua Umum DEMA"
                      subTag="Koordinator Eksekutif Operasional"
                      customBadge="PRESIDIUM"
                      tier="presidium"
                      isHighlighted={isMatch(
                        bph.wakilKetua.nama,
                        bph.wakilKetua.jabatan,
                        bph.wakilKetua.nim
                      )}
                      onClick={() =>
                        setSelected({
                          fungsionaris: bph.wakilKetua,
                          tierLabel: "Tingkat I • Presidium Pimpinan Umum",
                        })
                      }
                    />
                  </div>
                </div>

                {/* Vertical Trunk Line from Presidium to BPH */}
                <div className="flex flex-col items-center my-3">
                  <div className="w-0.5 h-6 bg-brand-primary" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-brand-primary/20" />
                </div>
              </div>

              {/* ── TIER 2: BPH INTI (Kesekretariatan & Keuangan) ── */}
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-semibold uppercase tracking-wider mb-3 font-poppins">
                  <span>Tingkat II — Kesekretariatan &amp; Keuangan Organisasi</span>
                </div>

                <div className="flex justify-center gap-4 max-w-4xl mx-auto">
                  <div className="w-56">
                    <TreeNode
                      fungsionaris={bph.sekjen}
                      tag="Sekretaris Jenderal"
                      subTag="Tata Kelola & Birokrasi"
                      tier="bph"
                      isHighlighted={isMatch(bph.sekjen.nama, bph.sekjen.jabatan, bph.sekjen.nim)}
                      onClick={() =>
                        setSelected({
                          fungsionaris: bph.sekjen,
                          tierLabel: "Tingkat II • Badan Pengurus Harian",
                        })
                      }
                    />
                  </div>
                  <div className="w-56">
                    <TreeNode
                      fungsionaris={bph.wakilSekjen}
                      tag="Wakil Sekjen"
                      subTag="Administrasi Kesekretariatan"
                      tier="bph"
                      isHighlighted={isMatch(
                        bph.wakilSekjen.nama,
                        bph.wakilSekjen.jabatan,
                        bph.wakilSekjen.nim
                      )}
                      onClick={() =>
                        setSelected({
                          fungsionaris: bph.wakilSekjen,
                          tierLabel: "Tingkat II • Badan Pengurus Harian",
                        })
                      }
                    />
                  </div>
                  <div className="w-56">
                    <TreeNode
                      fungsionaris={bph.sekkab}
                      tag="Sekretaris Kabinet"
                      subTag="Notulensi & Alur Rapat"
                      tier="bph"
                      isHighlighted={isMatch(bph.sekkab.nama, bph.sekkab.jabatan, bph.sekkab.nim)}
                      onClick={() =>
                        setSelected({
                          fungsionaris: bph.sekkab,
                          tierLabel: "Tingkat II • Badan Pengurus Harian",
                        })
                      }
                    />
                  </div>
                  <div className="w-56">
                    <TreeNode
                      fungsionaris={bph.bendum}
                      tag="Bendahara Umum"
                      subTag="Otoritas Keuangan Kabinet"
                      tier="bph"
                      isHighlighted={isMatch(bph.bendum.nama, bph.bendum.jabatan, bph.bendum.nim)}
                      onClick={() =>
                        setSelected({
                          fungsionaris: bph.bendum,
                          tierLabel: "Tingkat II • Badan Pengurus Harian",
                        })
                      }
                    />
                  </div>
                </div>

                {/* Hierarchy Trunk Line from BPH branching out to 6 Kemenko Columns */}
                <div className="flex flex-col items-center my-4 w-full">
                  <div className="w-0.5 h-6 bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-full max-w-[1240px] h-0.5 bg-neutral-300 dark:bg-neutral-700 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2.5 h-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  </div>
                </div>
              </div>

              {/* ── TIER 3 & 4: 6 KEMENKO COLUMNS & TECHNICAL MINISTRIES ── */}
              <div className="grid grid-cols-6 gap-3.5 mt-1">
                {kemenkos.map((kemenko) => {
                  const meta = kemenkoMeta[kemenko.id];
                  const childKemens = kemenkoMap[kemenko.id] || [];
                  const isBranchActive = activeBranch === null || activeBranch === kemenko.id;
                  const isBranchHighlighted = activeBranch === kemenko.id;
                  const IconComponent = meta?.icon || Briefcase;

                  return (
                    <div
                      key={kemenko.id}
                      className={`flex flex-col items-center transition-all duration-300 ${
                        isBranchActive ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {/* Vertical connector line from parent horizontal trunk */}
                      <div
                        className={`w-0.5 h-5 -mt-1.5 mb-1 transition-colors ${
                          isBranchHighlighted
                            ? "bg-brand-primary h-6"
                            : "bg-neutral-300 dark:bg-neutral-700"
                        }`}
                      />

                      {/* Kemenko Pillar Card */}
                      <div className="w-full">
                        <TreeNode
                          fungsionaris={kemenko.menteri}
                          tag={meta?.label || "Kemenko"}
                          subTag="Menteri Koordinator"
                          customBadge={meta?.acronym || "MENKO"}
                          tier="kemenko"
                          isHighlighted={
                            isBranchHighlighted ||
                            isMatch(kemenko.menteri.nama, kemenko.nama, kemenko.menteri.nim)
                          }
                          onClick={() =>
                            setSelected({
                              fungsionaris: kemenko.menteri,
                              tierLabel: `Tingkat III • ${meta?.label || "Menteri Koordinator"}`,
                              kemenId: kemenko.id,
                            })
                          }
                        />
                      </div>

                      {/* Middle connector line with ministry count badge */}
                      <div className="flex flex-col items-center my-2">
                        <div
                          className={`w-0.5 h-3 ${
                            isBranchHighlighted
                              ? "bg-amber-400"
                              : "bg-amber-300/80 dark:bg-amber-800/80"
                          }`}
                        />
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60 font-mono">
                          {childKemens.length} Kementerian
                        </span>
                        <div
                          className={`w-0.5 h-3 ${
                            isBranchHighlighted
                              ? "bg-amber-400"
                              : "bg-amber-300/80 dark:bg-amber-800/80"
                          }`}
                        />
                      </div>

                      {/* Technical Ministries under this Kemenko */}
                      <div className="w-full flex flex-col gap-2">
                        {childKemens.map((kemenId) => {
                          const kemen = getKemenById(kemenId);
                          if (!kemen) return null;
                          const shortLabel = getShortKemenName(kemen.nama);
                          const acronym = kemenAcronyms[kemen.id] || "TEKNIS";

                          return (
                            <div key={kemen.id} className="relative">
                              <TreeNode
                                fungsionaris={kemen.menteri}
                                tag={shortLabel}
                                subTag="Menteri Teknis"
                                customBadge={acronym}
                                tier="kementerian"
                                isHighlighted={isMatch(
                                  kemen.menteri.nama,
                                  kemen.nama,
                                  kemen.menteri.nim
                                )}
                                onClick={() =>
                                  setSelected({
                                    fungsionaris: kemen.menteri,
                                    tierLabel: `Tingkat IV • ${kemen.nama}`,
                                    kemenId: kemen.id,
                                  })
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 2: 6 PILAR SEKTORAL (PILLAR & HUB MATRIX)             */}
      {/* ────────────────────────────────────────────────────────── */}
      {viewMode === "pillars" && (
        <div className="py-5 font-poppins">
          {/* Quick Pillar Filter */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <button
              type="button"
              onClick={() => setActiveBranch(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeBranch === null
                  ? "bg-brand-primary text-white shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
              }`}
            >
              Semua 6 Pilar
            </button>
            {kemenkos.map((k) => {
              const meta = kemenkoMeta[k.id];
              const isSelected = activeBranch === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setActiveBranch(isSelected ? null : k.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-primary text-white shadow-xs"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                  }`}
                >
                  {meta?.shortLabel || k.nama}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {kemenkos
              .filter((k) => activeBranch === null || activeBranch === k.id)
              .map((kemenko) => {
                const meta = kemenkoMeta[kemenko.id];
                const childKemens = kemenkoMap[kemenko.id] || [];
                const IconComponent = meta?.icon || Briefcase;

                return (
                  <div
                    key={kemenko.id}
                    className="rounded-3xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#160606] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Pillar Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block font-mono">
                              PILAR #{meta?.acronym}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
                              {meta?.label}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shrink-0 font-mono">
                          {childKemens.length} Kementerian
                        </span>
                      </div>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
                        {meta?.desc}
                      </p>

                      {/* Menko Leader Card */}
                      <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50/70 to-white dark:from-[#241505] dark:to-[#160606] border border-amber-200/80 dark:border-amber-900/60">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1.5 font-poppins">
                          Menteri Koordinator:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <AvatarThumb
                              fotoUrl={kemenko.menteri.fotoUrl}
                              nama={kemenko.menteri.nama}
                              size="md"
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                                {kemenko.menteri.nama}
                              </h5>
                              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                                {kemenko.menteri.fakultas || kemenko.menteri.jabatan}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSelected({
                                fungsionaris: kemenko.menteri,
                                tierLabel: `Tingkat III • ${meta?.label}`,
                                kemenId: kemenko.id,
                              })
                            }
                            className="text-xs font-bold text-brand-primary dark:text-brand-accent hover:underline shrink-0 p-1 cursor-pointer"
                          >
                            Tupoksi →
                          </button>
                        </div>
                      </div>

                      {/* Child Technical Ministries */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                          Kementerian di Bawah Koordinasi:
                        </span>
                        {childKemens.map((kemenId) => {
                          const kemen = getKemenById(kemenId);
                          if (!kemen) return null;
                          const acronym = kemenAcronyms[kemen.id] || "TEKNIS";

                          return (
                            <div
                              key={kemen.id}
                              className="p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-100/80 transition-colors flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <AvatarThumb
                                  fotoUrl={kemen.menteri.fotoUrl}
                                  nama={kemen.menteri.nama}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-neutral-900 dark:text-white truncate">
                                      {getShortKemenName(kemen.nama)}
                                    </span>
                                    <span className="text-[8px] font-bold px-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
                                      {acronym}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-neutral-500 truncate">
                                    Menteri: {kemen.menteri.nama}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setSelected({
                                    fungsionaris: kemen.menteri,
                                    tierLabel: `Tingkat IV • ${kemen.nama}`,
                                    kemenId: kemen.id,
                                  })
                                }
                                className="p-1 rounded-lg text-neutral-400 hover:text-brand-primary transition-colors cursor-pointer"
                                title="Lihat Tupoksi"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick jump to full ministry section */}
                    <button
                      type="button"
                      onClick={() => scrollToMinistryOnPage(kemenko.id)}
                      className="mt-4 w-full py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-brand-primary hover:text-white transition-all text-[11px] font-semibold font-poppins flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Lihat Rincian Fungsionaris di Bawah</span>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODE 3: HIERARKI BERTINGKAT (SEQUENTIAL TIER VIEW)         */}
      {/* ────────────────────────────────────────────────────────── */}
      {viewMode === "tiers" && (
        <div className="py-5 space-y-6 font-poppins">
          {/* Level 1 */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 bg-white dark:bg-[#160606]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="w-3 h-3 rounded-full bg-brand-primary" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Tingkat I — Presidium Pimpinan Umum
              </h4>
              <span className="text-[10px] font-mono text-neutral-400 ml-auto">2 Pejabat</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <TreeNode
                fungsionaris={bph.ketua}
                tag="Ketua Umum DEMA"
                subTag="Mandataris Kongres Mahasiswa"
                customBadge="PRESIDIUM"
                tier="presidium"
                onClick={() =>
                  setSelected({
                    fungsionaris: bph.ketua,
                    tierLabel: "Tingkat I • Presidium Pimpinan Umum",
                  })
                }
              />
              <TreeNode
                fungsionaris={bph.wakilKetua}
                tag="Wakil Ketua Umum DEMA"
                subTag="Koordinator Eksekutif Operasional"
                customBadge="PRESIDIUM"
                tier="presidium"
                onClick={() =>
                  setSelected({
                    fungsionaris: bph.wakilKetua,
                    tierLabel: "Tingkat I • Presidium Pimpinan Umum",
                  })
                }
              />
            </div>
          </div>

          {/* Level 2 */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 bg-white dark:bg-[#160606]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="w-3 h-3 rounded-full bg-neutral-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Tingkat II — Kesekretariatan &amp; Keuangan Kabinet
              </h4>
              <span className="text-[10px] font-mono text-neutral-400 ml-auto">4 Pejabat</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <TreeNode
                fungsionaris={bph.sekjen}
                tag="Sekretaris Jenderal"
                tier="bph"
                onClick={() =>
                  setSelected({
                    fungsionaris: bph.sekjen,
                    tierLabel: "Tingkat II • Badan Pengurus Harian",
                  })
                }
              />
              <TreeNode
                fungsionaris={bph.wakilSekjen}
                tag="Wakil Sekjen"
                tier="bph"
                onClick={() =>
                  setSelected({
                    fungsionaris: bph.wakilSekjen,
                    tierLabel: "Tingkat II • Badan Pengurus Harian",
                  })
                }
              />
              <TreeNode
                fungsionaris={bph.sekkab}
                tag="Sekretaris Kabinet"
                tier="bph"
                onClick={() =>
                  setSelected({
                    fungsionaris: bph.sekkab,
                    tierLabel: "Tingkat II • Badan Pengurus Harian",
                  })
                }
              />
              <TreeNode
                fungsionaris={bph.bendum}
                tag="Bendahara Umum"
                tier="bph"
                onClick={() =>
                  setSelected({
                    fungsionaris: bph.bendum,
                    tierLabel: "Tingkat II • Badan Pengurus Harian",
                  })
                }
              />
            </div>
          </div>

          {/* Level 3 */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 bg-white dark:bg-[#160606]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Tingkat III — Jajaran Menteri Koordinator (6 Pilar)
              </h4>
              <span className="text-[10px] font-mono text-neutral-400 ml-auto">6 Menko</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {kemenkos.map((k) => {
                const meta = kemenkoMeta[k.id];
                return (
                  <TreeNode
                    key={k.id}
                    fungsionaris={k.menteri}
                    tag={meta?.label}
                    customBadge={meta?.acronym}
                    tier="kemenko"
                    onClick={() =>
                      setSelected({
                        fungsionaris: k.menteri,
                        tierLabel: `Tingkat III • ${meta?.label}`,
                        kemenId: k.id,
                      })
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Level 4 */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 bg-white dark:bg-[#160606]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="w-3 h-3 rounded-full bg-neutral-300" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Tingkat IV — Jajaran Menteri Teknis Sektoral
              </h4>
              <span className="text-[10px] font-mono text-neutral-400 ml-auto">13 Kementerian</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Object.values(kemenkoMap)
                .flat()
                .map((kemenId) => {
                  const kemen = getKemenById(kemenId);
                  if (!kemen) return null;
                  return (
                    <TreeNode
                      key={kemen.id}
                      fungsionaris={kemen.menteri}
                      tag={getShortKemenName(kemen.nama)}
                      customBadge={kemenAcronyms[kemen.id]}
                      tier="kementerian"
                      onClick={() =>
                        setSelected({
                          fungsionaris: kemen.menteri,
                          tierLabel: `Tingkat IV • ${kemen.nama}`,
                          kemenId: kemen.id,
                        })
                      }
                    />
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* DIAGRAM LEGEND & INTERACTION HINT                         */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-5 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-poppins text-neutral-500 dark:text-neutral-400">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#990808]" />
            <span>Presidium Pimpinan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-white border border-neutral-300 dark:border-neutral-700" />
            <span>Kesekretariatan &amp; Keuangan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500" />
            <span>Menteri Koordinator</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-neutral-100 border border-neutral-300 dark:border-neutral-700" />
            <span>Menteri Teknis</span>
          </div>
        </div>

        <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-brand-primary" />
          <span>Klik kartu pengurus untuk rincian Tupoksi lengkap</span>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* DETAIL MODAL POPUP                                         */}
      {/* ────────────────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#140606] rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-200/90 dark:border-neutral-800 relative font-poppins select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup rincian pengurus"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <AvatarThumb
                fotoUrl={selected.fungsionaris.fotoUrl}
                nama={selected.fungsionaris.nama}
                size="lg"
              />

              <div className="mt-3">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-1">
                  {selected.tierLabel}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white font-poppins">
                  {selected.fungsionaris.nama}
                </h4>
                {selected.fungsionaris.nim && (
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono block mt-0.5">
                    NIM. {selected.fungsionaris.nim}
                  </span>
                )}
              </div>

              <span className="inline-flex items-center rounded-full bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-primary mt-2">
                {selected.fungsionaris.jabatan}
              </span>

              {selected.fungsionaris.fakultas && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                  {selected.fungsionaris.fakultas}
                </span>
              )}

              {/* Tupoksi Narrative */}
              <div className="mt-4 text-left w-full bg-brand-background dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-brand-primary dark:text-brand-accent uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Tugas Pokok &amp; Fungsi (Tupoksi):</span>
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal">
                  {selected.fungsionaris.tupoksi}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 w-full flex flex-col gap-2">
                {selected.kemenId && (
                  <button
                    type="button"
                    onClick={() => scrollToMinistryOnPage(selected.kemenId!)}
                    className="w-full py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs hover:bg-brand-accent transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Lihat Fungsionaris Lengkap Kementerian Ini</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}

                {!selected.kemenId && (
                  <button
                    type="button"
                    onClick={scrollToBphOnPage}
                    className="w-full py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs hover:bg-brand-accent transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Lihat ID Card di Bagian BPH</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="w-full py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
