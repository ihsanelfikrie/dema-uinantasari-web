import { FileText } from "lucide-react";

export default function PersuratanLayananPage() {
  return (
    <main className="min-h-screen bg-brand-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl font-poppins">
            Persuratan & Kerja Sama
          </h1>
          <p className="mt-4 text-sm text-neutral-500 max-w-md mx-auto">
            Layanan pengajuan surat resmi kemahasiswaan, rekomendasi kegiatan,
            dan permohonan kerja sama publikasi Media Partner DEMA UIN Antasari.
          </p>
        </div>

        {/* Info Persuratan */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex gap-4 sm:gap-6 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
            <FileText className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 font-poppins mb-2">
              Kerja Sama Media Partner & Administrasi
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-500 font-normal">
              DEMA UIN Antasari Banjarmasin membuka ruang kerja sama publikasi
              (Media Partner) bagi seluruh organisasi internal maupun eksternal
              kampus untuk mempublikasikan pamflet/informasi kegiatan. Selain
              itu, Anda juga dapat mengajukan surat permohonan delegasi, surat
              rekomendasi, atau permohonan audiensi.
            </p>
          </div>
        </div>

        {/* Alur Persuratan */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm mb-12">
          <h2 className="text-base font-bold text-neutral-900 font-poppins mb-6">
            Alur Pengajuan Persuratan / Media Partner:
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-neutral-600">
            <div className="flex gap-4">
              <span className="font-bold text-brand-primary text-sm">1.</span>
              <p>
                Mengisi form permohonan di bawah ini secara lengkap dengan
                melampirkan berkas penunjang (seperti surat resmi bertanda
                tangan basah/stempel ORMAWA, proposal kegiatan, atau
                materi/pamflet publikasi).
              </p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-brand-primary text-sm">2.</span>
              <p>
                Sekretaris Jenderal DEMA akan memeriksa kelengkapan administrasi
                dan berkas permohonan dalam waktu 1x24 jam.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-brand-primary text-sm">3.</span>
              <p>
                Pemohon akan menerima konfirmasi persetujuan (melalui
                email/WhatsApp) berupa surat balasan, bukti upload media, atau
                jadwal disposisi resmi.
              </p>
            </div>
          </div>
        </div>

        {/* Form Embed (Iframe Responsive) */}
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-neutral-50 border-b border-neutral-100 py-3 px-6 text-xs text-neutral-400 font-medium">
            Formulir Administrasi & Media Partner DEMA UIN Antasari
          </div>
          <div className="w-full aspect-[9/16] sm:aspect-square md:aspect-[4/5] min-h-[600px]">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScJ_v5k0n5Wp-37N6qT7Vf5S8z3J1nN9q-uF1uD5Z5G5Z5G5A/viewform?embedded=true"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Form Persuratan"
            >
              Memuat formulir...
            </iframe>
          </div>
        </div>
      </div>
    </main>
  );
}
