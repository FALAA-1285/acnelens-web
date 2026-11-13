import Image from "next/image";
import { PillLink } from "@/components/ui";
import type { ReactNode } from "react";
import { GAMBAR } from "@/lib/gambar";
import { IconFocus, IconGrid, IconKeypoint, IconSplit } from "@/components/icons";
import { Parallax } from "@/components/motion/parallax";
import { Baris, Reveal } from "@/components/motion/reveal";

type Tahap = { judul: string; isi: string; icon: ReactNode };

const TAHAP: Tahap[] = [
  {
    judul: "Menyiapkan foto",
    isi: "Diubah ke hitam-putih dan ukurannya diseragamkan.",
    icon: <IconFocus size={30} />,
  },
  {
    judul: "Mencari titik penting",
    isi: "Bagian kulit yang paling menonjol ditandai (SURF).",
    icon: <IconKeypoint size={30} />,
  },
  {
    judul: "Membaca tekstur",
    isi: "Pola garis di sekitar titik tadi dibaca (HOG).",
    icon: <IconGrid size={30} />,
  },
  {
    judul: "Menentukan kelas",
    isi: "Normal, papula, atau pustula (SVM).",
    icon: <IconSplit size={30} />,
  },
];

function Kartu({ t, i }: { t: Tahap; i: number }) {
  return (
    <div className="group relative flex w-full flex-col items-center rounded-[16px] bg-[#f4efe9]/95 px-5 pt-8 pb-7 text-center backdrop-blur-sm transition-transform duration-700 ease-halus hover:-translate-y-1.5 sm:px-8 sm:pt-12 sm:pb-10 lg:max-w-[290px]">
      <span className="absolute top-4 left-5 font-mono text-[11px] text-muted">0{i + 1}</span>
      <span className="flex size-16 items-center justify-center rounded-full bg-white text-ink transition-transform duration-700 ease-halus group-hover:scale-105 group-hover:rotate-6 sm:size-24">
        {t.icon}
      </span>
      <h3 className="mt-5 text-lg leading-tight font-medium tracking-[-0.01em] text-ink sm:mt-7 sm:text-xl">{t.judul}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">{t.isi}</p>
    </div>
  );
}

export function SectionProses() {
  return (
    <section id="proses" className="relative overflow-hidden bg-white pt-24 pb-16 sm:pt-36 sm:pb-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6">
        {/* ---------- Judul ---------- */}
        <div className="relative">
          <Reveal
            as="h2"
            varian="lines"
            className="text-[clamp(40px,7.4vw,108px)] leading-[0.95] font-normal tracking-[-0.035em] text-ink uppercase"
          >
            <Baris>Dari satu foto,</Baris>
            <Baris>empat langkah</Baris>
          </Reveal>

          <div className="mt-6 flex flex-col gap-6 md:mt-4 md:flex-row md:items-start md:gap-14">
            <Reveal delay={200} className="max-w-[300px] md:pt-6">
              <p className="text-[15px] leading-relaxed text-muted">
                Semuanya berjalan otomatis setiap kali kamu mengunggah foto, tanpa perlu mengatur apa
                pun.
              </p>
              <div className="mt-6">
                <PillLink href="/tentang" varian="garis">
                  Pelajari metodenya
                </PillLink>
              </div>
            </Reveal>
            <Reveal
              as="p"
              varian="lines"
              delay={150}
              className="serif-em text-[clamp(72px,12vw,176px)] leading-[0.9] tracking-[-0.02em] text-ink"
            >
              <Baris>
                <span className="garis-tebal pb-1">otomatis.</span>
              </Baris>
            </Reveal>
          </div>

          {/* Panah melengkung — digambar saat masuk layar */}
          <Reveal
            varian="fade"
            className="pointer-events-none absolute top-[2%] right-[4%] hidden w-[30%] max-w-[380px] lg:block"
          >
            <svg viewBox="0 0 400 640" fill="none" className="garis-anim h-auto w-full text-ink" aria-hidden="true">
              <path
                pathLength={1}
                d="M6 30 C 150 -6, 330 30, 380 190 C 420 330, 330 520, 170 622"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                pathLength={1}
                d="M188 600 L 166 624 L 196 628"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Reveal>
        </div>

        {/* ---------- Panggung: foto oval + kartu zig-zag ---------- */}
        <div className="relative mt-16 lg:mt-24 lg:min-h-[820px]">
          {/* Foto oval miring */}
          <Reveal
            varian="scale"
            className="relative mx-auto mb-10 aspect-[4/3] w-[94%] -rotate-[18deg] overflow-hidden rounded-[58%_42%_50%_50%/52%_48%_52%_48%] lg:absolute lg:top-1/2 lg:left-[56%] lg:mb-0 lg:aspect-auto lg:h-[88%] lg:w-[78%] lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <div className="absolute inset-[-14%] rotate-[18deg]">
              <Parallax speed={0.08} className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src={GAMBAR.prosesSorotan}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                />
              </Parallax>
            </div>
          </Reveal>

          {/* Kartu: 2×2 di HP, zig-zag menumpuk foto di layar lebar */}
          <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-5 lg:block">
            <div className="contents lg:flex lg:items-start lg:gap-7 lg:pt-[2%]">
              {TAHAP.slice(0, 2).map((t, i) => (
                <Reveal key={t.judul} delay={i * 120} className={`lg:w-[290px] ${i === 0 ? "lg:mt-[9%]" : ""}`}>
                  <Parallax hanyaLebar speed={i === 0 ? 0.06 : -0.04}>
                    <Kartu t={t} i={i} />
                  </Parallax>
                </Reveal>
              ))}
            </div>
            <div className="contents lg:mt-[-6%] lg:flex lg:items-start lg:justify-end lg:gap-7">
              {TAHAP.slice(2).map((t, i) => (
                <Reveal key={t.judul} delay={(i + 2) * 120} className={`lg:w-[290px] ${i === 1 ? "lg:mt-[12%]" : ""}`}>
                  <Parallax hanyaLebar speed={i === 0 ? -0.05 : 0.07}>
                    <Kartu t={t} i={i + 2} />
                  </Parallax>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
