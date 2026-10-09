"use client";

import React from "react";
import { UserCheck } from "lucide-react";
import MinistryLogo from "@/components/ui/MinistryLogo";

export interface FungsionarisIdCardProps {
  id?: string;
  nama: string;
  jabatan: string;
  fotoUrl: string;
  nim?: string;
  fakultas?: string;
  kementerianId?: string;
  subBranding?: string;
  className?: string;
  size?: "full" | "compact";
  onClick?: () => void;
}

export default function FungsionarisIdCard({
  nama,
  jabatan,
  fotoUrl,
  nim,
  fakultas,
  kementerianId,
  subBranding,
  className = "",
  size = "full",
  onClick,
}: FungsionarisIdCardProps) {
  const isCompact = size === "compact";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`flex flex-col items-center group w-full ${
        isCompact ? "max-w-[210px]" : "max-w-[340px]"
      } mx-auto ${onClick ? "cursor-pointer active:scale-[0.98]" : ""} transition-transform ${className}`}
    >
      {/* Lanyard Ribbon & Metallic Clasp Hook */}
      <div
        className={`flex flex-col items-center ${
          isCompact ? "-mb-2" : "-mb-3"
        } z-10 relative pointer-events-none group-hover:-translate-y-1 transition-transform duration-300`}
      >
        {/* Maroon Ribbon Strap */}
        <div
          className={`${
            isCompact ? "w-8 h-4.5" : "w-10 sm:w-12 h-6"
          } bg-gradient-to-b from-[#6b0505] via-[#990808] to-[#800606] shadow-xs relative overflow-hidden rounded-t-xs`}
        >
          {/* Ribbon texture lines */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
          {/* Stitch borders */}
          <div className="absolute inset-y-0 left-0.5 sm:left-1 w-px border-l border-dashed border-white/40" />
          <div className="absolute inset-y-0 right-0.5 sm:right-1 w-px border-r border-dashed border-white/40" />
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/25" />
        </div>

        {/* Silver Metallic Ring & Hook */}
        <div className="flex flex-col items-center -mt-0.5">
          <div
            className={`${
              isCompact ? "w-4.5 h-1.5" : "w-6 h-2"
            } rounded-t-sm bg-gradient-to-r from-neutral-300 via-white to-neutral-300 border border-neutral-400 shadow-2xs`}
          />
          <div
            className={`${
              isCompact ? "w-2 h-2.5" : "w-3 h-3.5"
            } bg-gradient-to-r from-neutral-200 via-white to-neutral-400 border border-neutral-400 rounded-b-xs shadow-xs -mt-0.5`}
          />
        </div>
      </div>

      {/* ID Card Badge Base */}
      <div
        className={`w-full bg-white dark:bg-[#140606] border border-neutral-200/90 dark:border-neutral-800 ${
          isCompact ? "rounded-[22px] p-2.5 sm:p-3 pt-2 text-center" : "rounded-[28px] p-4 sm:p-5 pt-3.5 text-center sm:text-left"
        } shadow-md group-hover:shadow-2xl group-hover:shadow-brand-primary/10 group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full`}
      >
        <div>
          {/* Top Header: Badge Slot & Branding */}
          <div
            className={`relative flex items-center justify-between ${
              isCompact ? "min-h-[22px] mb-2" : "min-h-[28px] mb-3.5"
            } pt-0.5`}
          >
            {/* Left Badge ID label */}
            <span
              className={`${
                isCompact ? "text-[7px]" : "text-[8px] sm:text-[9px]"
              } font-black tracking-widest text-neutral-300 dark:text-neutral-700 uppercase font-poppins select-none`}
            >
              ID CARD
            </span>

            {/* Lanyard Punch Hole Cutout (Precisely Centered) */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ${
                isCompact ? "w-8 h-2" : "w-12 sm:w-14 h-3"
              } rounded-full bg-neutral-200/90 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 shadow-inner flex items-center justify-center pointer-events-none`}
            >
              <div
                className={`${
                  isCompact ? "w-5 h-0.5" : "w-8 h-1"
                } rounded-full bg-neutral-300/80 dark:bg-neutral-900`}
              />
            </div>

            {/* Top Right Branding */}
            {kementerianId ? (
              <div className="flex items-center gap-1 justify-end z-1">
                <div className={`${isCompact ? "w-4 h-4" : "w-6 h-6"} flex items-center justify-center`}>
                  <MinistryLogo
                    kementerianId={kementerianId}
                    className={`${isCompact ? "w-3.5 h-3.5" : "w-5 h-5"} text-brand-primary`}
                  />
                </div>
              </div>
            ) : (
              <div className="text-right z-1">
                <span
                  className={`${
                    isCompact ? "text-[8px]" : "text-[10px] sm:text-[11px]"
                  } font-black tracking-tight text-brand-primary font-poppins block leading-none`}
                >
                  DEMA UIN
                </span>
                <span
                  className={`${
                    isCompact ? "text-[6px]" : "text-[7px] sm:text-[8px]"
                  } font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase block font-poppins mt-0.5`}
                >
                  ANTASARI
                </span>
              </div>
            )}
          </div>

          {/* Photo Container (Inset with Rounded Frame) */}
          <div
            className={`relative aspect-[4/5] w-full ${
              isCompact ? "rounded-xl" : "rounded-2xl"
            } overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs group-hover:shadow-sm transition-shadow`}
          >
            {fotoUrl && fotoUrl.trim() !== "" ? (
              <img
                src={fotoUrl}
                alt={nama}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/60 p-3 sm:p-6 text-center">
                <div
                  className={`${
                    isCompact ? "w-10 h-10 mb-1.5" : "w-16 h-16 mb-3"
                  } rounded-full bg-neutral-200/80 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 shadow-inner`}
                >
                  <UserCheck className={`${isCompact ? "w-5 h-5" : "w-8 h-8"} stroke-[1.5]`} />
                </div>
                <span
                  className={`${
                    isCompact ? "text-[9px]" : "text-xs"
                  } font-semibold text-neutral-500 dark:text-neutral-400 font-poppins leading-tight`}
                >
                  Foto Dalam Pembaruan
                </span>
                {!isCompact && (
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-poppins mt-0.5">
                    {subBranding || "DEMA UIN Antasari"}
                  </span>
                )}
              </div>
            )}

            {/* Subtle Sheen Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Name & Role */}
          <div className={isCompact ? "pt-2 pb-0.5 text-center flex flex-col items-center" : "pt-4 pb-1 text-center sm:text-left"}>
            <h3
              className={`${
                isCompact
                  ? "text-[11px] min-h-[26px] text-center justify-center"
                  : "text-base sm:text-lg min-h-[38px] sm:min-h-[44px] text-center sm:text-left justify-center sm:justify-start"
              } font-black uppercase tracking-tight text-brand-primary dark:text-[#ff4d4d] font-poppins leading-[1.2] line-clamp-2 flex items-center w-full`}
            >
              {nama}
            </h3>
            <p
              className={`${
                isCompact
                  ? "text-[9.5px] mt-0.5 min-h-[16px] text-center justify-center"
                  : "text-xs sm:text-sm mt-1 min-h-[36px] text-center sm:text-left justify-center sm:justify-start"
              } font-semibold text-neutral-700 dark:text-neutral-300 font-poppins line-clamp-2 leading-tight flex items-center w-full`}
            >
              {jabatan}
            </p>
          </div>
        </div>

        <div>
          {/* Red Horizontal Divider Line */}
          <div
            className={`${
              isCompact ? "h-px my-2" : "h-[2px] my-3"
            } bg-brand-primary/85 dark:bg-brand-accent/85 w-full`}
          />

          {/* Footer Credentials */}
          <div
            className={`flex items-center ${
              isCompact
                ? "flex-col justify-center text-center gap-0.5 text-[8px]"
                : "justify-between text-[11px]"
            } font-poppins w-full`}
          >
            <span className="font-semibold text-neutral-600 dark:text-neutral-400 truncate max-w-full">
              {fakultas || "UIN Antasari"}
            </span>
            <span className="font-bold text-brand-primary dark:text-brand-accent shrink-0">
              {nim ? `NIM. ${nim}` : "2026/2027"}
            </span>
          </div>
        </div>

        {/* Micro Accent Line */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}
