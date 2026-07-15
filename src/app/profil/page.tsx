import type { Metadata } from "next";
import {
  Users,
  Lightbulb,
  Handshake,
  Star,
  Globe,
  Zap,
  Heart,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Profil Kabinet - DEMA UIN Antasari",
  description:
    "Pelajari visi, misi, nilai dasar, budaya organisasi, dan filosofi kabinet DEMA UIN Antasari Banjarmasin — Laskar Purnama Antasari.",
};

export default function ProfilPage() {
  const visi =
    "Optimalisasi DEMA UIN Antasari Sebagai Platform Aktualisasi Mahasiswa yang Berdampak dalam Kemajuan Antasari dan Indonesia.";

  const misi = [
    {
      title: "Kinerja Profesional, Adaptif & Proaktif",
      desc: "Menghadirkan kinerja organisasi yang profesional, adaptif terhadap perubahan, dan proaktif dalam merespons kebutuhan mahasiswa.",
      icon: Zap,
    },
    {
      title: "Sinergitas & Kolaborasi Harmonis",
      desc: "Membangun sinergitas dan kolaborasi dengan segala elemen demi terwujudnya hubungan yang harmonis antar lembaga kemahasiswaan.",
      icon: Handshake,
    },
    {
      title: "Pelayanan Inklusif & Transparan",
      desc: "Mewujudkan eskalasi pelayanan yang inklusif dan transparan untuk kesejahteraan mahasiswa UIN Antasari secara menyeluruh.",
      icon: Users,
    },
    {
      title: "Pengembangan Minat & Bakat Unggul",
      desc: "Memfasilitasi pengembangan minat dan bakat yang supportif dan apresiatif untuk mewujudkan Antasari yang unggul.",
      icon: Star,
    },
    {
      title: "Gerakan Sosial & Kedaulatan Masyarakat",
      desc: "Menciptakan peran mahasiswa dalam menjaga nilai gerakan sosial untuk kedaulatan masyarakat dan kemajuan daerah.",
      icon: Globe,
    },
  ];

  const nilaiDasar = [
    {
      title: "Inklusif",
      desc: "Organisasi adalah rumah bersama bagi seluruh mahasiswa tanpa membedakan latar belakang. Kami menolak segala bentuk diskriminasi dan marginalisasi, serta memberi ruang aman bagi setiap suara untuk tumbuh dan didengar.",
      icon: Heart,
    },
    {
      title: "Progresif",
      desc: "Menempatkan organisasi sebagai kekuatan perubahan yang responsif terhadap realitas zaman. Berani melakukan terobosan, evaluasi diri, dan pembaruan berkelanjutan demi menjawab kebutuhan mahasiswa secara nyata.",
      icon: TrendingUp,
    },
    {
      title: "Harmonis",
      desc: "Menjaga keberlangsungan organisasi sebagai ruang kolektif. Perbedaan pandangan dirawat melalui dialog dan musyawarah. Harmoni bukan meniadakan konflik, melainkan mengelola perbedaan secara dewasa dan beretika.",
      icon: Handshake,
    },
    {
      title: "Dinamis",
      desc: "Organisasi mampu bergerak, beradaptasi, dan berkembang seiring perubahan situasi dan tantangan. Terbuka terhadap inovasi, kolaborasi, dan pendekatan baru. Tidak stagnan, tetapi terus hidup sebagai ruang belajar dan bertumbuh.",
      icon: Lightbulb,
    },
  ];

  const filosofi = [
    {
      title: "Laskar",
      meaning: "Barisan Pejuang",
      desc: "Mencerminkan segenap pengurus DEMA sebagai laskar perjuangan mahasiswa yang tangguh, solid, memiliki dedikasi tinggi, dan ikhlas bekerja demi kemaslahatan bersama.",
    },
    {
      title: "Purnama",
      meaning: "Cahaya Penerang",
      desc: "Simbol petunjuk dan penerang di tengah kegelapan. DEMA berkomitmen hadir membawa solusi konkret, bersinar lewat prestasi, serta menyebarkan kehangatan pelayanan yang inklusif.",
    },
    {
      title: "Antasari",
      meaning: "Keteguhan Perjuangan",
      desc: "Mengadopsi semangat juang Pangeran Antasari ('Haram Manyarah Waja Sampai Kaputing'). Merepresentasikan identitas kampus serta kegigihan memperjuangkan aspirasi mahasiswa.",
    },
  ];

  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-poppins">
            Profil DEMA
          </h1>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 max-w-md mx-auto">
            Mengenal Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin —
            Kabinet Laskar Purnama Antasari.
          </p>
        </div>

        {/* Tentang DEMA Section */}
        <FadeInSection>
          <section className="bg-white border border-neutral-100 rounded-2xl p-8 sm:p-12 mb-12 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-6 border-l-4 border-brand-primary pl-4">
              Tentang Organisasi
            </h2>
            <div className="text-sm leading-relaxed text-neutral-600 space-y-4">
              <p>
                Dewan Eksekutif Mahasiswa (DEMA) UIN Antasari Banjarmasin
                merupakan lembaga eksekutif tertinggi di tingkat universitas
                yang berfungsi sebagai wadah representasi resmi mahasiswa. DEMA
                mengemban amanah untuk mengoordinasikan kegiatan kemahasiswaan,
                menyalurkan aspirasi, serta melakukan advokasi hak-hak
                mahasiswa.
              </p>
              <p>
                Dengan kesadaran bahwa tidak ada sebaik-baiknya manusia selain
                yang bisa memberikan kebermanfaatan bagi manusia lainnya, DEMA
                UIN Antasari hadir sebagai ruang tumbuhnya gagasan yang berakar
                pada cinta, harapan, dan nilai kemanusiaan. Melalui proses
                pembenahan yang berkesinambungan, penguatan solidaritas, serta
                dialog yang inklusif, kami berkomitmen menghadirkan kebermanfaatan
                nyata yang melampaui batas institusional.
              </p>
              <p>
                UIN Antasari tidak hanya menjadi institusi pendidikan, tetapi
                menjelma sebagai pusat pertumbuhan insan akademik yang reflektif,
                progresif, dan berorientasi pada kemajuan peradaban. Kami percaya
                bahwa mahasiswa bukan sekadar objek pendidikan, melainkan subjek
                perubahan yang memiliki peran vital dalam menentukan arah
                perkembangan akademik dan pengabdian kepada masyarakat.
              </p>
            </div>
          </section>
        </FadeInSection>

        {/* Filosofi Kabinet Section */}
        <FadeInSection>
          <section className="bg-white border border-neutral-100 rounded-2xl p-8 sm:p-12 mb-12 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-4 border-l-4 border-brand-primary pl-4">
              Filosofi Kabinet
            </h2>
            <p className="text-sm text-neutral-500 mb-8">
              Nama kabinet kami membawa arti penting yang melandasi setiap gerak
              langkah kepengurusan — <strong className="text-neutral-700">Laskar Purnama Antasari</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filosofi.map((item) => (
                <div
                  key={item.title}
                  className="p-5 bg-brand-background rounded-xl border border-neutral-100/50"
                >
                  <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
                    {item.meaning}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-1 font-poppins">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </FadeInSection>

        {/* Visi & Misi Section */}
        <FadeInSection>
          <section className="bg-white border border-neutral-100 rounded-2xl p-8 sm:p-12 mb-12 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-6 border-l-4 border-brand-primary pl-4">
              Visi &amp; Misi
            </h2>

            {/* Visi */}
            <div className="mb-10 p-6 bg-brand-background rounded-xl border border-neutral-100/50 text-center">
              <h3 className="text-sm font-semibold text-brand-primary uppercase tracking-wider mb-2">
                Visi Besar
              </h3>
              <p className="text-base font-medium leading-relaxed text-neutral-800 font-poppins max-w-2xl mx-auto">
                &ldquo;{visi}&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-6">
                Misi Strategis
              </h3>
              <div className="space-y-6">
                {misi.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4 sm:gap-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F2EF] text-brand-primary">
                        <IconComponent className="h-5 w-5 stroke-[1.5]" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-semibold text-neutral-900">
                          {index + 1}. {item.title}
                        </h4>
                        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* Nilai Dasar Section */}
        <FadeInSection>
          <section className="bg-white border border-neutral-100 rounded-2xl p-8 sm:p-12 mb-12 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-4 border-l-4 border-brand-primary pl-4">
              Nilai Dasar Organisasi
            </h2>
            <p className="text-sm text-neutral-500 mb-8">
              Empat nilai yang menjadi pondasi gerak dan sikap seluruh pengurus DEMA UIN Antasari.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {nilaiDasar.map((nilai) => {
                const IconComponent = nilai.icon;
                return (
                  <div
                    key={nilai.title}
                    className="p-6 bg-brand-background rounded-xl border border-neutral-100/50 flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                      <IconComponent className="h-5 w-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 font-poppins">
                        {nilai.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                        {nilai.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </FadeInSection>

        {/* Budaya Organisasi Section */}
        <FadeInSection>
          <section className="bg-white border border-neutral-100 rounded-2xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-6 border-l-4 border-brand-primary pl-4">
              Budaya Organisasi
            </h2>
            <div className="mb-6 p-5 bg-brand-primary rounded-xl text-center">
              <p className="text-sm font-semibold text-brand-secondary italic font-poppins">
                &ldquo;Ing ngarso sung tulodo, ing madya mangun karso, tut wuri handayani&rdquo;
              </p>
            </div>
            <div className="space-y-6 text-sm leading-relaxed text-neutral-600">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F2EF] text-brand-primary">
                  <BookOpen className="h-5 w-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Ing Ngarso Sung Tulodo — Keteladanan Pemimpin</h3>
                  <p>
                    Kepemimpinan tidak dimaknai sebagai posisi tertinggi yang memerintah, melainkan sebagai
                    teladan yang memberi arah melalui tindakan nyata. Siapa pun yang berada di depan dituntut
                    untuk menjadi contoh, bukan sekadar simbol — baik dalam etika, kerja, maupun keberpihakan
                    pada kepentingan bersama.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F2EF] text-brand-primary">
                  <Users className="h-5 w-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Ing Madya Mangun Karso — Motivasi Kolektif</h3>
                  <p>
                    Setiap anggota hadir bukan sebagai pelengkap, tetapi sebagai subjek yang memiliki peran,
                    gagasan, dan daya dorong. Organisasi tumbuh ketika ruang diskusi dibuka, inisiatif dihargai,
                    dan proses berjalan secara partisipatif. Dari sinilah solidaritas lahir — bukan karena
                    keterpaksaan, tetapi karena kesadaran bersama.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F2EF] text-brand-primary">
                  <Heart className="h-5 w-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">Tut Wuri Handayani — Ruang Tumbuh Kader</h3>
                  <p>
                    Kaderisasi tidak dilakukan dengan cara menekan atau mengontrol, melainkan dengan mendampingi,
                    mempercayai, dan memberi ruang untuk bertumbuh. Kesalahan dipandang sebagai bagian dari proses,
                    bukan alasan untuk mematikan potensi. Budaya ini mendorong lahirnya kader yang percaya diri,
                    mandiri, dan bertanggung jawab.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-5 bg-brand-background rounded-xl border border-neutral-100/50">
              <p className="text-xs leading-relaxed text-neutral-500 italic text-center">
                Keseluruhan nilai tersebut membentuk budaya organisasi yang rendah hati namun berprinsip, cair namun terarah.
                Organisasi tidak berjalan dengan logika kekuasaan, melainkan dengan etika kebersamaan. Kepemimpinan tidak
                diwariskan, tetapi ditumbuhkan — tidak dipaksakan, tetapi dihidupkan melalui proses yang jujur dan berkelanjutan.
              </p>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>
  );
}
