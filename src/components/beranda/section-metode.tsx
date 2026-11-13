import { GAMBAR } from "@/lib/gambar";
import { PillLink } from "@/components/ui";
import { Baris, Reveal } from "@/components/motion/reveal";
import { Eyebrow, GambarParallax } from "@/components/bagian";

/** Grid setengah-setengah: gambar penuh di kiri, teks di kanan. */
export function SectionMetode() {
  return (
    <section id="metode" className="bg-[#f3e8e7]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <GambarParallax
          src={GAMBAR.metode}
          speed={0.1}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[720px]"
        />
        <div className="flex items-center px-5 py-20 sm:px-12 lg:px-20">
          <div className="max-w-[480px]">
            <Reveal varian="fade">
              <Eyebrow>Dasar penelitian</Eyebrow>
            </Reveal>
            <Reveal
              as="h2"
              varian="lines"
              className="mt-4 text-[clamp(34px,4.2vw,56px)] leading-[1.04] font-normal tracking-[-0.03em] text-ink"
            >
              <Baris>Mengikuti</Baris>
              <Baris>
                <span className="serif-em">penelitian</span>
              </Baris>
              <Baris>yang sudah ada</Baris>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 leading-relaxed text-muted">
                Langkah-langkah di AcneLens mengikuti sebuah jurnal tentang klasifikasi jerawat.
                Karena memakai cara yang sama, hasil kami bisa dibandingkan dengan hasil yang
                dilaporkan di jurnal tersebut.
              </p>
              <div className="mt-10">
                <PillLink href="/tentang">Baca selengkapnya</PillLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
