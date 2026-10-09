import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-brand-background py-10 sm:py-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-12 shadow-xs hover:border-brand-primary/20 hover:shadow-md transition-all duration-300">
        <span className="text-[11px] sm:text-xs font-semibold text-brand-primary uppercase tracking-wider block mb-1.5 sm:mb-2 font-poppins">
          Ruang Aspirasi &amp; Bantuan Mahasiswa
        </span>
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-poppins">
          Butuh Advokasi atau Layanan Mahasiswa?
        </h2>
        <p className="mx-auto mt-2.5 sm:mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-neutral-600 font-poppins">
          DEMA UIN Antasari siap mendengarkan aspirasi dan memperjuangkan hak-hak mahasiswa. Layanan penanganan kekerasan (P3), advokasi UKT, dan persuratan dapat diakses secara cepat dan aman.
        </p>
        <div className="mt-6 sm:mt-7 flex justify-center">
          <Link
            href="/layanan"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-accent px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none min-h-[46px] w-full sm:w-auto"
          >
            <span>Kunjungi Portal Layanan Mahasiswa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
