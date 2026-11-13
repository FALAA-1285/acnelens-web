import Image from "next/image";
import Link from "next/link";
import { GAMBAR } from "@/lib/gambar";
import { KELAS, type KelasId } from "@/lib/kelas";
import { IconArrowRight } from "@/components/icons";
import { Parallax } from "@/components/motion/parallax";
import { Baris, Reveal } from "@/components/motion/reveal";
import { SliderKelas } from "@/components/beranda/slider-kelas";

// urutan tampil: normal → papula → pustula
const URUTAN: KelasId[] = ["non_acne", "papula", "pustula"];

function KartuKelas({ id }: { id: KelasId }) {
  const k = KELAS[id];
  const [gambar1, gambar2] = GAMBAR.kelas[id];
  return (
    <Link
      href="/tentang#jenis"
      data-slide
      className="group flex w-[78vw] shrink-0 snap-start flex-col sm:w-[320px] lg:w-[340px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-mist">
        <Image
          src={gambar1}
          alt={`Contoh ${k.nama.toLowerCase()}`}
          fill
          sizes="(max-width: 640px) 78vw, 360px"
          className="object-cover transition-transform duration-[1.2s] ease-halus group-hover:scale-105"
        />
        <Image
          src={gambar2}
          alt=""
          fill
          sizes="(max-width: 640px) 78vw, 360px"
          className="object-cover opacity-0 transition-[opacity,transform] duration-[1.2s] ease-halus group-hover:scale-105 group-hover:opacity-100"
        />
        <span className="absolute right-4 bottom-4 flex size-11 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-sm transition-all duration-500 ease-halus max-sm:translate-y-0 max-sm:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <IconArrowRight size={14} />
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-4 pt-5">
        <h3 className="text-[26px] leading-none font-normal tracking-[-0.02em] text-ink">
          <span className="serif-em">{k.nama}</span>
        </h3>
        <span className="font-mono text-xs text-muted">0{k.label}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{k.ringkas}</p>
    </Link>
  );
}

export function SectionKelas() {
  return (
    <section id="explore" className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* ---------- Judul tengah ---------- */}
      <div className="relative mx-auto max-w-[1280px] px-5 text-center sm:px-6">
        <Reveal
          as="h2"
          varian="lines"
          className="text-[clamp(44px,6.4vw,92px)] leading-[0.92] font-normal tracking-[-0.03em] text-ink"
        >
          <Baris>
            <span className="uppercase">Kenali</span>
          </Baris>
          <Baris>
            <span className="serif-em">kondisi kulitmu</span>
          </Baris>
        </Reveal>

        {/* ikon panah belok-ke-bawah di pojok kanan */}
        <Reveal varian="fade" delay={300} className="absolute right-5 bottom-2 hidden sm:right-6 md:block">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-ink">
            <path
              d="M3 4h7a5 5 0 0 1 5 5v11m0 0-4-4m4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Reveal>
      </div>

      {/* ---------- Terbelah: foto menempel tepi kiri | judul + kartu ---------- */}
      <div className="mt-14 grid grid-cols-1 items-center gap-12 sm:mt-20 lg:grid-cols-2 lg:gap-0">
        <Reveal
          varian="buka"
          className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-auto lg:h-[92vh] lg:max-h-[880px] lg:min-h-[620px]"
        >
          <Parallax speed={0.1} className="absolute -inset-y-[12%] inset-x-0">
            <Image
              src={GAMBAR.kelasSorotan}
              alt="Close-up wajah dengan kulit berbintik dan lembap"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Parallax>
        </Reveal>

        <div className="min-w-0 pl-5 sm:pl-6 lg:pl-[clamp(40px,6vw,104px)]">
          <SliderKelas
            judul={
              <Reveal
                varian="lines"
                as="h3"
                className="text-[clamp(40px,4.6vw,68px)] leading-[0.98] font-normal tracking-[-0.03em] text-ink"
              >
                <Baris>
                  Tiga <span className="serif-em">kondisi</span>
                </Baris>
              </Reveal>
            }
          >
            {URUTAN.map((id) => (
              <KartuKelas key={id} id={id} />
            ))}
          </SliderKelas>

          <Reveal delay={150} className="mt-8 pr-5 sm:pr-6">
            <p className="max-w-[440px] text-sm leading-relaxed text-muted">
              AcneLens membedakan dua jenis jerawat yang meradang, papula dan pustula, serta kulit yang
              tidak berjerawat.{" "}
              <Link href="/tentang#jenis" className="link-garis font-medium text-ink">
                Lihat penjelasannya
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
