"use client";

import { useState, useRef } from "react";
import { Berita } from "@/types";
import BeritaCard from "@/components/berita/BeritaCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface BeritaListClientProps {
  initialBerita: Berita[];
}

const ITEMS_PER_PAGE = 9;

export default function BeritaListClient({
  initialBerita,
}: BeritaListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const topAnchorRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(initialBerita.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBerita = initialBerita.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // GSAP animation when page loads or page changes
  useGSAP(
    () => {
      if (currentBerita.length === 0) return;
      gsap.fromTo(
        ".berita-item-card",
        {
          opacity: 0,
          y: 24,
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
    { scope: containerRef, dependencies: [currentPage] }
  );

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (initialBerita.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
        <p className="text-sm text-neutral-500 font-medium font-poppins">
          Belum ada rilis berita atau kegiatan yang diterbitkan saat ini.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {/* Anchor for smooth scroll when pagination changes */}
      <div ref={topAnchorRef} className="scroll-mt-28" />

      {/* Grid: 1 col (compact row) on mobile, 2 col on tablet, 3 col on desktop */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentBerita.map((item) => (
          <div key={item.id} className="berita-item-card opacity-0">
            <BeritaCard berita={item} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 sm:mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              className="inline-flex items-center justify-center h-9 px-3 rounded-lg border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                  className={`inline-flex items-center justify-center h-9 w-9 rounded-lg text-xs sm:text-sm font-medium font-poppins transition-colors ${
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
              className="inline-flex items-center justify-center h-9 px-3 rounded-lg border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline font-poppins">Selanjutnya</span>
              <ChevronRight className="h-4 w-4 sm:ml-1" />
            </button>
          </div>

          {/* Info text */}
          <p className="text-xs text-neutral-400 font-poppins">
            Halaman {currentPage} dari {totalPages} &bull; Menampilkan {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, initialBerita.length)} dari{" "}
            {initialBerita.length} kegiatan & berita
          </p>
        </div>
      )}
    </div>
  );
}

