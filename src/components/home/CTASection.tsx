import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-brand-background py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      <div className="bg-white border border-neutral-100 rounded-2xl p-8 sm:p-12 hover:shadow-sm transition-all duration-200">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl font-poppins">
          Butuh Advokasi atau Layanan Mahasiswa?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 font-normal">
          DEMA UIN Antasari siap mendengarkan aspirasi dan membantu kebutuhan
          Anda. Layanan P3, pengaduan advokasi, dan permohonan persuratan dapat
          diakses secara digital.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/layanan"
            className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-accent transition-colors duration-200"
          >
            Kunjungi Portal Layanan
          </Link>
        </div>
      </div>
    </section>
  );
}
