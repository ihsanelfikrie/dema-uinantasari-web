"use client";

import { useState, useRef, useMemo } from "react";
import { Berita } from "@/types";
import BeritaCard from "@/components/berita/BeritaCard";
import { ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface BeritaListClientProps {
  initialBerita: Berita[];
}

const ITEMS_PER_PAGE = 10;

export default function BeritaListClient({
  initialBerita,
}: BeritaListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const topAnchorRef = useRef<HTMLDivElement>(null);

  // Extract unique categories and counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = { Semua: initialBerita.length };
    initialBerita.forEach((b) => {
      const cat = b.kategori || "Lainnya";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const uniqueCats = Array.from(
      new Set(initialBerita.map((b) => b.kategori).filter(Boolean))
    );

    return {
      categories: ["Semua", ...uniqueCats],
      categoryCounts: counts,
    };
  }, [initialBerita]);

  // Filtered news items
  const filteredBerita = useMemo(() => {
    if (selectedCategory === "Semua") return initialBerita;
    return initialBerita.filter((b) => b.kategori === selectedCategory);
  }, [initialBerita, selectedCategory]);

  const totalPages = Math.ceil(filteredBerita.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBerita = filteredBerita.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleCategorySelect = (cat: string) => {
    if (cat === selectedCategory) return;
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // GSAP animation when category or page changes
  useGSAP(
    () => {
      if (currentBerita.length === 0) return;
      gsap.fromTo(
        ".berita-item-card",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    },
    { scope: containerRef, dependencies: [currentPage, selectedCategory] }
  );

  if (initialBerita.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-xs">
        <Newspaper className="w-10 h-10 text-neutral-300 mx-auto mb-3 stroke-[1.5]" />
        <p className="text-sm text-neutral-600 font-medium font-poppins">
          Belum ada rilis berita atau kegiatan yang diterbitkan saat ini.
        </p>
      </div>
    );
  }

  const isHeadlineLayout = selectedCategory === "Semua" && currentPage === 1;
  const headlineItem = isHeadlineLayout ? currentBerita[0] : null;
  const gridItems = isHeadlineLayout ? currentBerita.slice(1) : currentBerita;

  return (
    <div ref={containerRef} className="w-full">
      {/* Anchor for smooth scroll when pagination changes */}
      <div ref={topAnchorRef} className="scroll-mt-28" />

      {/* Category Filter Pills */}
      <div className="mb-6 sm:mb-10 flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1 gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 font-poppins cursor-pointer shrink-0 min-h-[38px] active:scale-95 ${
                isActive
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Featured Headline Item (Page 1 of All) */}
      {headlineItem && (
        <div className="mb-8 sm:mb-10 berita-item-card opacity-0">
          <BeritaCard berita={headlineItem} variant="featured" />
        </div>
      )}

      {/* News Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
      {gridItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((item) => (
            <div key={item.id} className="berita-item-card opacity-0">
              <BeritaCard berita={item} variant="default" />
            </div>
          ))}
        </div>
      ) : (
        !headlineItem && (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/80 p-8">
            <p className="text-sm text-neutral-500 font-poppins">
              Tidak ada berita untuk kategori ini.
            </p>
          </div>
        )
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 sm:mt-14 flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              className="inline-flex items-center justify-center h-10 px-3 sm:h-9 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline font-poppins">Sebelumnya</span>
            </button>

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center justify-center h-10 w-10 sm:h-9 sm:w-9 rounded-xl text-xs sm:text-sm font-semibold font-poppins transition-all active:scale-95 ${
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Halaman selanjutnya"
              className="inline-flex items-center justify-center h-10 px-3 sm:h-9 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
            >
              <span className="hidden sm:inline font-poppins">Selanjutnya</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </button>
          </div>

          {/* Info text */}
          <p className="text-xs text-neutral-400 font-poppins">
            Halaman {currentPage} dari {totalPages} &bull; Menampilkan {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredBerita.length)} dari{" "}
            {filteredBerita.length} warta & kegiatan
          </p>
        </div>
      )}
    </div>
  );
}

