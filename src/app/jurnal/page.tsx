import type { Metadata } from "next";
import Link from "next/link";
import { PillLink } from "@/components/ui";
import { TombolTurun } from "@/components/bagian";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Halaman } from "@/components/motion/halaman";
import { FotoJurnal } from "@/components/jurnal/foto-jurnal";
import { Baris, Reveal } from "@/components/motion/reveal";
import { FooterSitus } from "@/components/footer-situs";
import { JURNAL, type Artikel } from "@/lib/jurnal";

export const metadata: Metadata = {
  title: "Jurnal",
  description:
    "Bacaan pilihan tentang merawat kulit, mengatasi jerawat, dan penelitian yang menjadi dasar AcneLens.",
};

/**
 * Pola kolase berulang setiap 5 artikel (layar lebar):
 *  1 — kiri, setengah lebar, foto tinggi
 *  2, 3 — berdampingan di kanan, lebih kecil
 *  4 — kiri, sangat tinggi
 *  5 — kanan, turun jauh ke bawah
 */
const POLA = [
  { kolom: "lg:col-span-6", foto: "aspect-[4/5] lg:aspect-auto lg:h-[38rem]", geser: "" },
  { kolom: "lg:col-span-4 lg:col-start-5", foto: "aspect-[4/5] lg:aspect-auto lg:h-[28rem]", geser: "lg:mt-24" },
  { kolom: "lg:col-span-4 lg:col-start-9", foto: "aspect-[4/5] lg:aspect-auto lg:h-[28rem]", geser: "lg:mt-24" },
  { kolom: "lg:col-span-5", foto: "aspect-[4/5] lg:aspect-auto lg:h-[46rem]", geser: "lg:mt-24" },
  { kolom: "lg:col-span-6 lg:col-start-7", foto: "aspect-[4/5] lg:aspect-auto lg:h-[36rem]", geser: "lg:mt-[22rem]" },
];

function KartuJurnal({ a, i }: { a: Artikel; i: number }) {
  const p = POLA[i % POLA.length];
  return (
    <Reveal className={`col-span-12 ${p.kolom} ${p.geser}`} delay={(i % 2) * 120}>
      <Link href={`/jurnal/${a.slug}`} prefetch className="group block">
        <div className="relative">
          <FotoJurnal
            slug={a.slug}
            src={a.gambar}
            sizes="(max-width: 1024px) 100vw, 50vw"
            zoomHover
            className={`w-full ${p.foto}`}
          />
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] tracking-[0.06em] text-ink uppercase backdrop-blur">
            {a.kategori}
          </span>
        </div>

        <h2 className="mt-6 max-w-[34rem] text-[clamp(22px,2.2vw,28px)] leading-[1.2] font-normal tracking-[-0.015em] text-ink decoration-1 underline-offset-[6px] group-hover:underline">
          {a.judul}
        </h2>
        <p className="mt-3 max-w-[34rem] text-[15px] leading-relaxed text-muted">{a.ringkas}</p>
        <div className="mt-6 flex max-w-[34rem] items-center justify-between gap-4 text-xs text-muted">
          <span>
            {a.sumber}
            {a.tahun && ` · ${a.tahun}`}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold tracking-[0.08em] text-ink uppercase">
            Baca
            <span className="transition-transform duration-500 ease-halus group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function HalamanJurnal() {
  return (
    <Halaman>
      <SmoothScroll />
      <SiteHeader aktif="jurnal" />

      <main className="overflow-x-clip">
        {/* ---------- Intro ---------- */}
        <section className="relative mx-auto max-w-[1280px] px-5 pt-24 text-center sm:px-6 sm:pt-32">
          <Reveal
            as="h1"
            varian="lines"
            className="text-[clamp(52px,9vw,128px)] leading-[0.82] font-normal tracking-[-0.04em] text-ink"
          >
            <Baris>
              <span className="serif-em text-[1.25em]">bacaan</span>
            </Baris>
            <Baris>
              <span className="uppercase">jurnal</span>
            </Baris>
          </Reveal>
          <Reveal delay={250} className="mx-auto mt-8 max-w-[520px]">
            <p className="leading-relaxed text-muted">
              Bacaan pilihan tentang merawat kulit, mengatasi jerawat, dan penelitian yang menjadi dasar
              AcneLens. Setiap artikel tertaut ke sumber aslinya.
            </p>
          </Reveal>

          {/* Garis lengkung dekoratif + tombol panah ke bawah */}
          <Reveal varian="fade" className="pointer-events-none absolute top-[12%] -right-[6%] hidden w-[42%] lg:block">
            <svg viewBox="0 0 600 300" fill="none" className="garis-anim h-auto w-full text-ink/60" aria-hidden="true">
              <path
                pathLength={1}
                d="M10 40 C 180 -10, 420 10, 520 120 C 600 210, 560 290, 470 296"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </Reveal>
          <Reveal delay={400} className="mt-12 flex justify-center">
            <TombolTurun href="#daftar" label="Lihat daftar bacaan" />
          </Reveal>
        </section>

        {/* ---------- Kolase artikel ---------- */}
        <section id="daftar" className="mx-auto max-w-[1280px] scroll-mt-24 px-5 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
          <div className="grid grid-cols-12 items-start gap-x-8 gap-y-16">
            {JURNAL.map((a, i) => (
              <KartuJurnal key={a.href} a={a} i={i} />
            ))}
          </div>

          <Reveal className="mt-28 flex flex-col items-center gap-6 border-t border-ink/10 pt-14 text-center">
            <p className="max-w-[560px] text-sm leading-relaxed text-muted">
              Artikel di atas ditulis oleh pihak lain dan dibuka di situs aslinya. Untuk keluhan kulit yang
              serius, tetap konsultasikan ke dokter kulit.
            </p>
            <PillLink href="/cek">Coba cek kulitmu</PillLink>
          </Reveal>
        </section>
      </main>

      <FooterSitus />
    </Halaman>
  );
}
