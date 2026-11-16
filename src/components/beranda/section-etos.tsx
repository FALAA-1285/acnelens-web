import Image from "next/image";
import { GAMBAR } from "@/lib/gambar";
import { HASIL_TERBAIK, KESALAHAN_UJI, persen } from "@/lib/penelitian";
import { Baris, Reveal } from "@/components/motion/reveal";
import { GambarParallax } from "@/components/bagian";

const ETOS = [
  {
    icon: GAMBAR.ikon.akurasi,
    judul: "Seberapa akurat?",
    isi: `Pada penelitian yang kami jadikan acuan, metode yang sama menebak dengan benar ${persen(HASIL_TERBAIK.uji)} dari ${KESALAHAN_UJI.total} foto uji. Hasil di aplikasi ini bisa sedikit berbeda, tergantung kualitas foto.`,
  },
  {
    icon: GAMBAR.ikon.hasil,
    judul: "Bukan pengganti dokter",
    isi: "AcneLens hanya memperkirakan jenis jerawat dari foto. Kalau jerawat terasa sakit, makin banyak, atau tidak kunjung membaik, sebaiknya periksakan ke dokter kulit.",
  },
];

export function SectionEtos() {
  return (
    <section id="ethos" className="relative overflow-hidden py-24 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.08]">
        <Image src={GAMBAR.tekstur} alt="" fill sizes="100vw" decoding="async" className="object-cover" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal
              as="h2"
              varian="lines"
              className="text-[clamp(38px,5.6vw,80px)] leading-[1.02] font-normal tracking-[-0.035em] text-ink"
            >
              <Baris>Hal yang</Baris>
              <Baris>perlu kamu</Baris>
              <Baris>
                <span className="serif-em">ketahui</span>
              </Baris>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
              {ETOS.map((e, i) => (
                <Reveal key={e.judul} delay={150 + i * 120} className="border-t border-ink/15 pt-6">
                  <Image src={e.icon} alt="" width={36} height={36} style={{ width: 36, height: 36 }} />
                  <h3 className="mt-5 text-xl font-medium tracking-[-0.02em] text-ink">{e.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{e.isi}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <GambarParallax
              src={GAMBAR.etos}
              speed={0.12}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-[3/4] w-full rounded-t-full rounded-b-[28px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
