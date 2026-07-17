"use client";

import React, { useRef } from "react";
import { Sambat } from "@/types";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

// Registrasi GSAP Draggable pada client-side saja
if (typeof window !== "undefined") {
  const { Draggable } = require("gsap/Draggable");
  gsap.registerPlugin(Draggable);
}

interface SambatBoardProps {
  sambatList: Sambat[];
}

export default function SambatBoard({ sambatList }: SambatBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (sambatList.length === 0) return;

      const { Draggable } = require("gsap/Draggable");

      // 1. Integrasikan GSAP Draggable pada setiap sticky note
      Draggable.create(".sambat-card", {
        bounds: containerRef.current,
        inertia: true,
        edgeResistance: 0.7,
        onPress: function (this: any) {
          const element = this.target;
          element.classList.add("is-dragging");
          
          // Cari zIndex maksimum saat ini di antara semua sambat-card
          let maxZIndex = 10;
          document.querySelectorAll(".sambat-card").forEach((card) => {
            const z = parseInt(window.getComputedStyle(card).zIndex) || 0;
            if (z > maxZIndex) maxZIndex = z;
          });

          // Angkat kertas (scale up), ratakan kemiringan agar mudah dibaca, zIndex teratas
          gsap.to(element, {
            scale: 1.1,
            y: -12,
            boxShadow: "0 25px 35px -5px rgba(0, 0, 0, 0.18), 0 15px 15px -5px rgba(0, 0, 0, 0.08)",
            zIndex: maxZIndex + 1,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
        onDrag: function (this: any) {
          // 2. Efek Goyang Fisika Pegas (Springy Swing)
          // Berikan kemiringan dinamis tergantung arah & kecepatan geser (deltaX)
          const deltaX = this.deltaX;
          const targetRotation = gsap.utils.clamp(-25, 25, deltaX * 2.8);
          
          gsap.to(this.target, {
            rotation: targetRotation,
            duration: 0.15,
            ease: "power1.out",
            overwrite: "auto",
          });
        },
        onRelease: function (this: any) {
          const element = this.target;
          element.classList.remove("is-dragging");
          const originalRotation = element.getAttribute("data-rotation") || "0";

          // 3. Kembalikan ke rotasi dan skala semula dengan efek pantulan elastis (back.out)
          gsap.to(element, {
            scale: 1.0,
            y: 0,
            rotation: parseInt(originalRotation),
            boxShadow: "0 6px 12px -2px rgba(0, 0, 0, 0.08), 0 3px 6px -3px rgba(0, 0, 0, 0.04)",
            duration: 0.6,
            ease: "back.out(2.2)",
            overwrite: "auto",
          });
        },
      });

      // 4. Efek Interaktif Hover (Mengambang Saat Disorot)
      const cards = containerRef.current?.querySelectorAll(".sambat-card");
      cards?.forEach((card) => {
        // Hover Enter
        card.addEventListener("mouseenter", () => {
          if (card.classList.contains("is-dragging")) return;
          gsap.to(card, {
            y: -8,
            scale: 1.04,
            boxShadow: "0 12px 20px -3px rgba(0, 0, 0, 0.1), 0 6px 10px -3px rgba(0, 0, 0, 0.05)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
        
        // Hover Exit
        card.addEventListener("mouseleave", () => {
          if (card.classList.contains("is-dragging")) return;
          const originalRotation = card.getAttribute("data-rotation") || "0";
          gsap.to(card, {
            y: 0,
            scale: 1.0,
            rotation: parseInt(originalRotation),
            boxShadow: "0 6px 12px -2px rgba(0, 0, 0, 0.08), 0 3px 6px -3px rgba(0, 0, 0, 0.04)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // 5. Animasi Entrance Elastic Pegas Staggered
      // Note masuk bergantian dengan animasi elastic yang sangat premium
      gsap.fromTo(
        ".sambat-card",
        {
          opacity: 0,
          scale: 0.1,
          y: -200,
          rotation: () => Math.random() * 40 - 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: (i, target) => parseInt(target.getAttribute("data-rotation") || "0"),
          duration: 1.5,
          stagger: 0.08,
          ease: "elastic.out(1.1, 0.7)",
          overwrite: "auto",
        }
      );
    },
    { dependencies: [sambatList], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[650px] bg-[#E5DCD3] rounded-[2.5rem] border-[10px] border-[#C8B195] overflow-hidden shadow-2xl p-6 select-none touch-none"
      style={{
        // Kombinasi tekstur papan mading (corkboard) yang berkelas
        backgroundImage: `
          radial-gradient(#bba68d 1.5px, transparent 1.5px), 
          radial-gradient(#bba68d 1.5px, #e5dcd3 1.5px)
        `,
        backgroundSize: "28px 28px",
        backgroundPosition: "0 0, 14px 14px",
      }}
    >
      {/* Bingkai Kayu Dalam (Subtle inner shadow untuk kesan 3D mading) */}
      <div className="absolute inset-0 border-[6px] border-black/5 rounded-3xl pointer-events-none z-10 shadow-inner" />

      {/* Tali Gantung Estetik Mading */}
      <div className="absolute top-2 left-1/4 w-0.5 h-6 bg-neutral-600/30" />
      <div className="absolute top-2 right-1/4 w-0.5 h-6 bg-neutral-600/30" />

      {sambatList.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0">
          <div className="w-16 h-16 rounded-full bg-white/40 flex items-center justify-center mb-4 backdrop-blur-xs">
            <span className="text-2xl animate-pulse">📝</span>
          </div>
          <p className="text-sm font-semibold font-poppins text-neutral-800">
            Papan Sambat masih kosong
          </p>
          <p className="text-xs text-neutral-500 mt-1.5 max-w-xs leading-relaxed font-poppins font-normal">
            Jadilah yang pertama menyampaikan keluh kesah atau kritik secara anonim di mading ini!
          </p>
        </div>
      ) : (
        sambatList.map((sambat, index) => {
          const leftPos = `${sambat.koordinat_x}%`;
          const topPos = `${sambat.koordinat_y}%`;
          const rotateDeg = `${sambat.rotasi}deg`;

          // Format tanggal yang bersahabat
          let timeAgo = "";
          try {
            timeAgo = formatDistanceToNow(new Date(sambat.created_at), {
              addSuffix: true,
              locale: id,
            });
          } catch (e) {
            timeAgo = "Baru saja";
          }

          // Variasi pola warna tape transparan (washi tape)
          const tapeColor = sambat.warna_sticky_note === "#FFF9A6" 
            ? "bg-amber-400/25 border-amber-450/20" 
            : sambat.warna_sticky_note === "#FFD1DC" 
            ? "bg-rose-400/25 border-rose-450/20"
            : "bg-teal-400/20 border-teal-450/15";

          return (
            <div
              key={sambat.id}
              className="sambat-card absolute w-[170px] sm:w-[200px] p-5 rounded-lg border border-black/5 flex flex-col justify-between cursor-grab active:cursor-grabbing text-neutral-800 font-poppins transition-shadow"
              data-rotation={sambat.rotasi}
              style={{
                left: leftPos,
                top: topPos,
                transform: `rotate(${rotateDeg})`,
                backgroundColor: sambat.warna_sticky_note,
                zIndex: index + 5,
                // Kesan tekukan kertas 3D realistis (curl bottom right)
                borderRadius: "2px 2px 2px 2px",
                borderBottomRightRadius: "40px 10px",
                boxShadow: "0 6px 12px -2px rgba(0, 0, 0, 0.08), 0 3px 6px -3px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Dekorasi Plester Perekat Transparan (Washi Tape) */}
              <div 
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-4.5 border-x backdrop-blur-xs flex items-center justify-center shadow-xs rotate-[-3deg] ${tapeColor}`}
                style={{
                  clipPath: "polygon(0% 0%, 5% 100%, 95% 100%, 100% 0%, 95% 30%, 5% 30%)", // Sobekan plester di sisi kiri-kanan
                }}
              />

              {/* Garis Aksen Buku Tulis Tipis */}
              <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-red-400/25 border-l border-red-400/10 pointer-events-none" />

              {/* Konten Text (Memo style) */}
              <div className="pl-3.5 pr-1 pt-2 pb-5 text-[11px] sm:text-[12px] font-medium leading-relaxed tracking-wide select-none">
                <p className="line-clamp-6 text-neutral-850">
                  "{sambat.text_konten}"
                </p>
              </div>

              {/* Memo Footer */}
              <div className="pl-3.5 pr-1 border-t border-black/5 pt-2.5 flex items-center justify-between text-[8px] sm:text-[9px] text-neutral-500 font-normal select-none">
                <span className="font-semibold tracking-wider text-neutral-400 uppercase">#Anonim</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
