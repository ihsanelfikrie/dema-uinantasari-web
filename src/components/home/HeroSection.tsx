import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-background py-24 sm:py-32 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 border-b border-neutral-100">
      <div className="max-w-3xl flex flex-col items-center">
        <span className="text-xs font-semibold tracking-wider text-brand-secondary uppercase bg-brand-primary/10 px-3 py-1 rounded-full text-brand-primary mb-6">
          Dewan Eksekutif Mahasiswa 2026
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl font-poppins">
          Kabinet <span className="text-brand-primary">Laskar Purnama Antasari</span>
        </h1>
        <p className="mt-6 text-sm sm:text-base leading-relaxed text-neutral-600 max-w-2xl font-normal">
          Membawa terwujudnya Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin sebagai pelopor kepemimpinan yang bersinar, aspiratif, solutif, dan berdampak bagi civitas akademika dan masyarakat luas.
        </p>
        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/profil"
            className="rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-accent transition-colors duration-200"
          >
            Tentang Kabinet
          </Link>
        </div>
      </div>
    </section>
  );
}
