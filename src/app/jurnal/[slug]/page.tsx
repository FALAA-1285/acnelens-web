import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Halaman } from "@/components/motion/halaman";
import { Parallax } from "@/components/motion/parallax";
import { Baris, Reveal } from "@/components/motion/reveal";
import { FooterSitus } from "@/components/footer-situs";
import { Bagikan } from "@/components/jurnal/bagikan";
import { FotoJurnal } from "@/components/jurnal/foto-jurnal";
import { IsiArtikel } from "@/components/jurnal/isi-artikel";
import { TombolTurun } from "@/components/bagian";
import { cariArtikel, JURNAL, TANGGAL_TULIS } from "@/lib/jurnal";

// Semua artikel diprerender lewat generateStaticParams. Navigasi sengaja menunggu
// halaman tujuan siap (bukan streaming), supaya foto kartu dan foto utama artikel
// ter-render dalam commit yang sama dan bisa ber-morph.
export const instant = false;

export function generateStaticParams() {
  return JURNAL.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/jurnal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = cariArtikel(slug);
  if (!a) return {};
  return { title: a.judul, description: a.ringkas };
}

export default async function HalamanArtikel({ params }: PageProps<"/jurnal/[slug]">) {
  const { slug } = await params;
  const a = cariArtikel(slug);
  if (!a) notFound();

  const idx = JURNAL.findIndex((x) => x.slug === a.slug);
  const berikutnya = JURNAL[(idx + 1) % JURNAL.length];

  return (
    <Halaman>
      <SmoothScroll />
      <SiteHeader aktif="jurnal" varian="hero" />

      <main className="overflow-x-clip">
        <article>
          {/* ---------- Foto utama satu layar (ber-morph dari kartu) ---------- */}
          <div className="relative h-[62vh] w-full overflow-hidden lg:h-screen">
            <Parallax speed={0.14} className="absolute -inset-y-[12%] inset-x-0">
              <FotoJurnal slug={a.slug} src={a.gambar} sizes="100vw" priority className="h-full w-full" />
            </Parallax>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />
          </div>

          {/* ---------- Blok judul gelap: menumpuk ke atas foto, bablas ke kanan ---------- */}
          <div className="relative z-10 -mt-24 sm:-mt-40 lg:-mt-[22vh]">
            <div className="ml-5 bg-[#232323] text-white sm:ml-6 lg:ml-[max(24px,calc((100vw-1280px)/2+24px))]">
              <div className="max-w-[1000px] px-6 pt-12 pb-14 sm:px-12 sm:pt-16 sm:pb-20 lg:min-h-[44rem] lg:px-20 lg:pt-24">
                <Reveal varian="fade">
                  <ul className="flex flex-wrap gap-x-10 gap-y-2 text-sm text-white/65">
                    <li>
                      <time dateTime="2026-11-13">{TANGGAL_TULIS}</time>
                    </li>
                    <li>Oleh Tim AcneLens</li>
                    <li>{a.kategori}</li>
                  </ul>
                </Reveal>

                <Reveal
                  as="h1"
                  varian="lines"
                  delay={150}
                  className="mt-12 text-[clamp(38px,5.6vw,84px)] leading-[0.95] font-normal tracking-[-0.035em] text-balance lg:mt-16"
                >
                  <Baris>{a.judul}</Baris>
                </Reveal>

                <Reveal delay={350}>
                  <p className="mt-10 max-w-[80%] text-[clamp(18px,1.6vw,22px)] leading-[1.35] text-white/65">
                    {a.ringkas}
                  </p>
                  <div className="mt-14 flex flex-wrap items-center gap-5">
                    <span className="border-b border-white/40 pb-0.5 text-xs font-semibold tracking-[0.12em] text-white/80 uppercase">
                      Bagikan
                    </span>
                    <Bagikan judul={a.judul} gelap />
                    <span className="ml-auto text-sm text-white/50">{a.menitBaca} menit baca</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          {/* ---------- Tombol ke isi ---------- */}
          <div className="mx-auto mt-14 flex max-w-[1280px] justify-center px-5 sm:px-6">
            <TombolTurun href="#isi" label="Mulai membaca" varian="garis" />
          </div>

          {/* ---------- Isi artikel + kolom bagikan menempel di kanan ---------- */}
          <div id="isi" className="relative scroll-mt-24">
            <div className="pointer-events-none absolute inset-y-0 right-[6%] hidden xl:block">
              <div className="pointer-events-auto sticky top-[30vh] mt-24">
                <Bagikan judul={a.judul} tegak />
              </div>
            </div>

            <div className="mx-auto max-w-[60rem] px-5 pt-16 pb-10 sm:px-10 lg:px-20 lg:pt-24">
              <IsiArtikel isi={a.isi} />

              {/* sumber */}
              <Reveal className="mt-16 flex flex-col gap-4 border-y border-ink/10 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[11px] tracking-[0.12em] text-muted uppercase">Sumber</span>
                  <p className="mt-1 text-[15px] text-ink">
                    {a.sumber}
                    {a.tahun && ` · ${a.tahun}`}
                  </p>
                </div>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-garis self-start pb-0.5 text-xs font-semibold tracking-[0.1em] text-ink uppercase sm:self-auto"
                >
                  Baca sumber asli ↗
                </a>
              </Reveal>
              <p className="mt-6 text-xs leading-relaxed text-muted">
                Ringkasan ini ditulis oleh tim AcneLens berdasarkan sumber di atas dan hanya bersifat
                informasi umum, bukan pengganti saran dokter.
              </p>
              <div className="mt-8 xl:hidden">
                <Bagikan judul={a.judul} />
              </div>
            </div>
          </div>
        </article>

        {/* ---------- Bacaan berikutnya ---------- */}
        <section className="mx-auto max-w-[1280px] px-5 pt-16 pb-28 sm:px-6 sm:pb-36">
          <div className="h-px bg-ink/10" />
          <div className="mt-16 grid grid-cols-1 items-start gap-12 md:grid-cols-12">
            <div className="relative md:col-span-5">
              <Reveal
                as="h2"
                varian="lines"
                className="text-center text-[clamp(48px,5.4vw,84px)] leading-[0.82] font-normal tracking-[-0.04em] text-ink md:mt-40"
              >
                <Baris>
                  <span className="serif-em text-[1.2em]">bacaan</span>
                </Baris>
                <Baris>
                  <span className="ml-[0.5em]">berikutnya</span>
                </Baris>
              </Reveal>
              <Reveal varian="fade" className="mt-8 hidden justify-center md:flex">
                <svg viewBox="0 0 200 120" fill="none" className="garis-anim w-40 text-ink/60" aria-hidden="true">
                  <path pathLength={1} d="M8 20 C 70 0, 150 20, 180 90" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path pathLength={1} d="M168 80 L 181 93 L 189 76" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Reveal>
            </div>

            <Reveal className="md:col-span-7">
              <Link href={`/jurnal/${berikutnya.slug}`} prefetch className="group block">
                <FotoJurnal
                  slug={berikutnya.slug}
                  src={berikutnya.gambar}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  zoomHover
                  className="aspect-[4/3] w-full"
                />
                <h3 className="mt-6 max-w-[36rem] text-[clamp(24px,2.4vw,30px)] leading-[1.2] font-normal tracking-[-0.015em] text-ink decoration-1 underline-offset-[6px] group-hover:underline">
                  {berikutnya.judul}
                </h3>
                <p className="mt-3 max-w-[34rem] text-[15px] leading-relaxed text-muted">{berikutnya.ringkas}</p>
                <span className="mt-6 block text-xs text-muted">{TANGGAL_TULIS}</span>
              </Link>
            </Reveal>
          </div>
          <div className="mt-20 flex justify-center">
            <Link
              href="/jurnal"
              className="link-garis pb-0.5 text-xs font-semibold tracking-[0.12em] text-ink uppercase"
            >
              Lihat semua jurnal
            </Link>
          </div>
        </section>
      </main>

      <FooterSitus />
    </Halaman>
  );
}
