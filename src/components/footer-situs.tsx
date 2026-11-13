import Image from "next/image";
import Link from "next/link";
import { GAMBAR } from "@/lib/gambar";
import { IconArrowRight } from "@/components/icons";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { Wordmark } from "@/components/site-header";

const KOLOM = [
  {
    judul: "Jelajahi",
    isi: [
      { label: "Beranda", href: "/" },
      { label: "Cek kulit", href: "/cek" },
      { label: "Jurnal", href: "/jurnal" },
      { label: "Tentang", href: "/tentang" },
    ],
  },
  {
    judul: "Metode",
    isi: [{ label: "Grayscale" }, { label: "SURF" }, { label: "HOG" }, { label: "SVM linear" }],
  },
  {
    judul: "Akademik",
    isi: [
      { label: "Kelompok 7 · TI-3D" },
      { label: "Pengolahan Citra & Visi Komputer" },
      { label: "Politeknik Negeri Malang" },
    ],
  },
];

/**
 * `tanpaAjakan`: sembunyikan pita foto + kartu "Siap cek kulitmu?" —
 * dipakai di halaman cek, karena pengunjung sudah berada di sana.
 */
export function FooterSitus({ tanpaAjakan = false }: { tanpaAjakan?: boolean }) {
  return (
    <footer className={`relative bg-white pb-10 text-ink ${tanpaAjakan ? "border-t border-ink/10 pt-20" : ""}`}>
      {/* Pita foto besar dengan parallax */}
      {!tanpaAjakan && (
        <div className="relative h-[60vh] overflow-hidden sm:h-[75vh] lg:h-[90vh]">
          <Parallax speed={0.15} className="absolute -inset-y-[15%] inset-x-0">
            <Image src={GAMBAR.footer} alt="" fill sizes="100vw" className="object-cover brightness-[1.05]" />
          </Parallax>
        </div>
      )}

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end md:gap-6">
          {/* Kartu gelap yang menumpuk di atas foto */}
          {!tanpaAjakan && (
          <Reveal className="relative z-10 -mt-32 md:order-2 md:col-span-6 md:col-start-7 md:-mt-[38vh] lg:col-span-5 lg:col-start-8">
            <div className="flex flex-col items-center bg-[#232323] px-6 pt-14 pb-10 text-center text-white sm:px-12 sm:pt-20">
              <h2 className="text-[clamp(40px,5.4vw,72px)] leading-[0.88] font-normal tracking-[-0.03em] uppercase">
                Siap cek
                <br />
                <span className="serif-em normal-case">kulitmu?</span>
              </h2>
              <p className="mt-6 max-w-[320px] text-sm leading-relaxed text-white/60">
                Unggah satu foto close-up, lalu AcneLens akan memberi tahu jenis jerawatnya.
              </p>

              <Link href="/cek" className="group mt-10 flex flex-col items-center gap-4">
                <span className="flex size-[72px] items-center justify-center rounded-full bg-[#787878] text-white transition-all duration-700 ease-halus group-hover:scale-110 group-hover:bg-white group-hover:text-ink sm:size-[104px]">
                  <IconArrowRight size={22} />
                </span>
                <span className="link-garis pb-0.5 text-xs font-semibold tracking-[0.12em] text-white/60 uppercase transition-colors duration-500 group-hover:text-white">
                  Mulai cek
                </span>
              </Link>

              <div className="mt-14 h-px w-full bg-white/15 sm:mt-20" />
              <p className="mt-6 max-w-[360px] text-xs leading-relaxed text-white/45">
                Hasil aplikasi bukan diagnosis medis. Periksakan ke dokter kulit bila jerawat meluas atau
                terasa nyeri.
              </p>
            </div>
          </Reveal>
          )}

          {/* Kolom link */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-2 md:order-1 md:col-span-6 md:grid-cols-3 lg:col-span-6">
            {KOLOM.map((k, i) => (
              <Reveal
                key={k.judul}
                delay={i * 90}
                className={i === 2 ? "col-span-2 md:col-span-1" : ""}
              >
                <h3 className="mb-4 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{k.judul}</h3>
                <ul className="flex flex-col gap-3">
                  {k.isi.map((x) => (
                    <li key={x.label} className="text-[15px]">
                      {"href" in x && x.href ? (
                        <Link href={x.href} className="link-garis text-ink">
                          {x.label}
                        </Link>
                      ) : (
                        <span className="text-ink/70">{x.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Baris bawah */}
        <div className="mt-16 flex flex-col gap-6 border-t border-ink/10 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="text-ink">
              <Wordmark className="text-[28px]" />
            </Link>
            <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-muted">
              Klasifikasi papula, pustula, dan kulit normal dari satu foto.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-xs text-muted md:flex-row md:items-center md:gap-8">
            <span>© 2026 AcneLens</span>
            <ul className="flex flex-wrap gap-5">
              <li>
                <Link href="/tentang" className="underline underline-offset-4 hover:text-ink">
                  Tentang proyek
                </Link>
              </li>
              <li>
                <Link href="/jurnal" className="underline underline-offset-4 hover:text-ink">
                  Jurnal
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
