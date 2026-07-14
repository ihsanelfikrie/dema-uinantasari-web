import type { Metadata } from "next";
import { Heart, Compass, Shield, HelpCircle, Calendar } from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";

export const metadata: Metadata = {
  title: "Profil Kabinet - DEMA UIN Antasari",
  description:
    "Pelajari visi, misi, sejarah DEMA UIN Antasari, serta makna filosofi kabinet Laskar Purnama Antasari.",
};

export default function ProfilPage() {
  const visi =
    "Menjadikan DEMA UIN Antasari Banjarmasin sebagai episentrum pergerakan mahasiswa yang progresif, inklusif, aspiratif, dan solutif demi terwujudnya mahasiswa yang berintegritas dan bersinergi.";

  const misi = [
    {
      title: "Advokasi Responsif & Solutif",
      desc: "Membangun ruang advokasi yang responsif dan solutif terhadap permasalahan akademik maupun kesejahteraan mahasiswa.",
      icon: Shield,
    },
    {
      title: "Sinergi & Kolaborasi ORMAWA",
      desc: "Meningkatkan sinergisitas dan kolaborasi aktif antar Organisasi Kemahasiswaan (ORMAWA) di lingkungan UIN Antasari.",
      icon: Compass,
    },
    {
      title: "Pengembangan Minat & Bakat",
      desc: "Menyelenggarakan program kerja berbasis minat, bakat, keilmuan, dan pengembangan kepemimpinan mahasiswa.",
      icon: Calendar,
    },
    {
      title: "Informasi Transparan & Komunikatif",
      desc: "Mengoptimalkan penyebaran informasi yang transparan, komunikatif, dan edukatif melalui media informasi resmi.",
      icon: HelpCircle,
    },
    {
      title: "Kesadaran Sosial Keagamaan",
      desc: "Menumbuhkan kesadaran sosial-keagamaan melalui aksi nyata pengabdian kepada masyarakat luas.",
      icon: Heart,
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
            Mengenal Dewan Eksekutif Mahasiswa UIN Antasari Banjarmasin Kabinet
            Laskar Purnama Antasari.
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
                mengemban amanah untuk mengoordinasikan kegiatan
                kemahasiswaan, menyalurkan aspirasi, serta melakukan advokasi
                hak-hak mahasiswa.
              </p>
              <p>
                Di bawah bendera **Kabinet Laskar Purnama Antasari**, kami
                membawa spirit kolaborasi dan dedikasi penuh. Kami percaya
                bahwa mahasiswa bukan sekadar objek pendidikan, melainkan
                subjek perubahan yang memiliki peran vital dalam menentukan
                arah perkembangan akademik dan pengabdian masyarakat.
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
              Nama kabinet kami membawa arti penting yang melandasi setiap
              gerak langkah kepengurusan.
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
          <section className="bg-white border border-neutral-100 rounded-2xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl font-poppins mb-6 border-l-4 border-brand-primary pl-4">
              Visi & Misi
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
      </div>
    </main>
  );
}
